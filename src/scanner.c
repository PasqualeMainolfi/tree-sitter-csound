#include "tree_sitter/parser.h"

#include <stdbool.h>
#include <string.h>

// Must match the order of `externals` in grammar.js.
enum TokenType {
  INSTR,
  ENDIN,
  OPCODE,
  ENDOP,
  KW_OD,
  KW_DO,
  KW_ENDIF,
  KW_FI,
  KW_THEN,
  KW_ELSE,
  KW_ELSEIF,
  KW_UNTIL,
  KW_SWITCH_END,
  KW_TIF,
  KW_SWITCH_START,
  KW_CASE_KEY,
  KW_DEFAULT_KEY,
  KW_GOTO,
  KW_RIGOTO,
  KW_REINIT,
  KW_RETURN,
  KW_TRUE,
  CONTINUE_STATEMENT,
  HEADER_IDENTIFIER,
  IDENTIFIER,
  NEW_LINE,
  SCORE_CARRY,
  SCORE_Z_OPERATOR,
  SCORE_RAMPING,
  SCORE_STATEMENT_BARE,
  SCORE_GROUP_P1_BARE,
  SCORE_SWMACRO_P1_BARE,
  SCORE_STATEMENT_I_QUOTED,
  ERROR_SENTINEL,
};

// Keywords that look like identifiers. They are matched here on whole words only, so
// that `odd`, `returnValue` or `src` are not split into a keyword and a rest.
// Reserved keywords are emitted even where they are not valid: the parser reports the
// error there instead of swallowing the keyword as an identifier, and error recovery
// sees them. Contextual keywords are emitted only where they are valid.
typedef struct {
  const char *word;
  enum TokenType symbol;
  bool reserved;
} Keyword;

static const Keyword KEYWORDS[] = {
  {"instr", INSTR, true},
  {"endin", ENDIN, true},
  {"opcode", OPCODE, true},
  {"endop", ENDOP, true},
  {"od", KW_OD, true},
  {"enduntil", KW_OD, true},
  {"do", KW_DO, true},
  {"endif", KW_ENDIF, true},
  {"fi", KW_FI, true},
  {"then", KW_THEN, true},
  {"else", KW_ELSE, true},
  {"elseif", KW_ELSEIF, true},
  {"until", KW_UNTIL, true},
  {"endsw", KW_SWITCH_END, true},
  {"tif", KW_TIF, false},
  {"switch", KW_SWITCH_START, false},
  {"case", KW_CASE_KEY, false},
  {"default", KW_DEFAULT_KEY, false},
  {"goto", KW_GOTO, false},
  {"rigoto", KW_RIGOTO, false},
  {"reinit", KW_REINIT, false},
  {"return", KW_RETURN, false},
  {"rireturn", KW_RETURN, false},
  {"true", KW_TRUE, false},
  {"continue", CONTINUE_STATEMENT, false},
  {"sr", HEADER_IDENTIFIER, false},
  {"kr", HEADER_IDENTIFIER, false},
  {"ksmps", HEADER_IDENTIFIER, false},
  {"nchnls", HEADER_IDENTIFIER, false},
  {"nchnls_i", HEADER_IDENTIFIER, false},
};

#define KEYWORD_COUNT (sizeof(KEYWORDS) / sizeof(KEYWORDS[0]))
#define MAX_WORD_LEN 24

static inline bool is_digit(int32_t c) { return c >= '0' && c <= '9'; }

static inline bool is_word_start(int32_t c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
}

static inline bool is_word_char(int32_t c) { return is_word_start(c) || is_digit(c); }

static inline bool is_blank(int32_t c) { return c == ' ' || c == '\t'; }

static inline bool is_space(int32_t c) {
  return c == ' ' || c == '\t' || c == '\r' || c == '\n' || c == '\f' || c == '\v';
}

static inline bool is_score_group_letter(char c) {
  return c != '\0' && strchr("aqtesxybBCv", c) != NULL;
}

static inline bool is_score_swmacro_letter(char c) { return c == 'r' || c == 'm' || c == 'n'; }

// `word` is a statement letter followed by an optional p1: \d+ (the decimal part, if
// any, has already been appended by the caller).
static bool split_score_statement(const char *word, char *letter, bool *has_p1) {
  if (word[0] == '\0') return false;
  *letter = word[0];
  *has_p1 = word[1] != '\0';
  for (const char *c = word + 1; *c != '\0'; c++) {
    if (!is_digit(*c) && *c != '.') return false;
  }
  return true;
}

void *tree_sitter_csound_external_scanner_create(void) { return NULL; }

void tree_sitter_csound_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_csound_external_scanner_serialize(void *payload, char *buffer) { return 0; }

void tree_sitter_csound_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

bool tree_sitter_csound_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  // during error recovery every external token is marked valid
  bool error_recovery = valid_symbols[ERROR_SENTINEL];

  unsigned skipped = 0;
  if (valid_symbols[NEW_LINE] || valid_symbols[SCORE_CARRY] || valid_symbols[SCORE_Z_OPERATOR] ||
      valid_symbols[SCORE_RAMPING]) {
    while (is_blank(lexer->lookahead)) {
      lexer->advance(lexer, true);
      skipped++;
    }
  }

  // Newlines terminate statements. The newline token is produced only here, so the
  // internal lexer can always skip line breaks as extras.
  if (valid_symbols[NEW_LINE]) {
    if (lexer->lookahead == '\r' || lexer->lookahead == '\n') {
      if (lexer->lookahead == '\r') lexer->advance(lexer, false);
      if (lexer->lookahead == '\n') lexer->advance(lexer, false);
      lexer->result_symbol = NEW_LINE;
      return true;
    }
    if (lexer->eof(lexer) && !error_recovery) {
      lexer->result_symbol = NEW_LINE;
      return true;
    }
  }

  // Score operators that must be separated from the previous p-field by whitespace:
  // carry `.`, infinity `z` and ramps `<` `>`. The whitespace is not part of the token.
  if (skipped > 0 && !error_recovery) {
    if (valid_symbols[SCORE_CARRY] && lexer->lookahead == '.') {
      lexer->advance(lexer, false);
      if (is_digit(lexer->lookahead)) return false;
      lexer->result_symbol = SCORE_CARRY;
      return true;
    }
    if (valid_symbols[SCORE_Z_OPERATOR] && lexer->lookahead == 'z') {
      lexer->advance(lexer, false);
      if (is_word_char(lexer->lookahead)) return false;
      lexer->result_symbol = SCORE_Z_OPERATOR;
      return true;
    }
    if (valid_symbols[SCORE_RAMPING] && (lexer->lookahead == '<' || lexer->lookahead == '>')) {
      lexer->advance(lexer, false);
      if (!is_space(lexer->lookahead)) return false;
      lexer->result_symbol = SCORE_RAMPING;
      return true;
    }
  }

  while (is_space(lexer->lookahead)) {
    lexer->advance(lexer, true);
  }
  if (!is_word_start(lexer->lookahead)) return false;

  char word[MAX_WORD_LEN + 1];
  unsigned len = 0;
  while (is_word_char(lexer->lookahead)) {
    if (len == MAX_WORD_LEN) return false;
    word[len++] = (char)lexer->lookahead;
    lexer->advance(lexer, false);
  }
  word[len] = '\0';

  bool bare_valid = !error_recovery &&
                    (valid_symbols[SCORE_STATEMENT_BARE] || valid_symbols[SCORE_GROUP_P1_BARE] ||
                     valid_symbols[SCORE_SWMACRO_P1_BARE]);

  // decimal part of a score p1 right after the statement letter: `e4.5`
  if (bare_valid && lexer->lookahead == '.' && len >= 2 && is_digit(word[len - 1])) {
    while ((lexer->lookahead == '.' || is_digit(lexer->lookahead)) && len < MAX_WORD_LEN) {
      word[len++] = (char)lexer->lookahead;
      lexer->advance(lexer, false);
    }
    word[len] = '\0';
  }
  lexer->mark_end(lexer);

  for (unsigned i = 0; i < KEYWORD_COUNT; i++) {
    if (strcmp(word, KEYWORDS[i].word) == 0) {
      if (!KEYWORDS[i].reserved && !valid_symbols[KEYWORDS[i].symbol]) return false;
      lexer->result_symbol = KEYWORDS[i].symbol;
      return true;
    }
  }

  // `i"name" ...`: instrument statement with a string p1 attached to the letter
  if (valid_symbols[SCORE_STATEMENT_I_QUOTED] && !error_recovery && strcmp(word, "i") == 0 &&
      lexer->lookahead == '"') {
    lexer->result_symbol = SCORE_STATEMENT_I_QUOTED;
    return true;
  }

  // A score statement without further p-fields, alone on its line: `s`, `e`, `e4`, `r3`.
  // The token ends after the letter and p1; the look-ahead to the end of the line keeps
  // `sr = 44100` in an orchestra from being taken for a score statement.
  if (bare_valid) {
    char letter;
    bool has_p1;
    if (!split_score_statement(word, &letter, &has_p1)) return false;

    while (is_blank(lexer->lookahead)) {
      lexer->advance(lexer, false);
    }
    bool at_line_end = lexer->lookahead == '\n' || lexer->lookahead == '\r' ||
                       lexer->lookahead == ';' || lexer->eof(lexer);
    if (!at_line_end) return false;

    if (is_score_group_letter(letter)) {
      if (!has_p1 && valid_symbols[SCORE_STATEMENT_BARE]) {
        lexer->result_symbol = SCORE_STATEMENT_BARE;
        return true;
      }
      if (has_p1 && valid_symbols[SCORE_GROUP_P1_BARE]) {
        lexer->result_symbol = SCORE_GROUP_P1_BARE;
        return true;
      }
    }
    if (is_score_swmacro_letter(letter) && has_p1 && valid_symbols[SCORE_SWMACRO_P1_BARE]) {
      lexer->result_symbol = SCORE_SWMACRO_P1_BARE;
      return true;
    }
  }
  return false;
}

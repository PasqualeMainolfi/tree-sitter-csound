/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
    name: 'csound',
    word: $ => $.type_identifier_legacy,
    extras: $ => [/\s/, $.comment, $.block_comment],
    conflicts: $ => [
      [$.opcode_statement, $.typed_assignment_statement],
      [$.argument_list, $.parenthesized_expression],
      [$.parenthesized_expression, $.argument_list],
      [$.legacy_typed_assignment_statement, $.opcode_statement],
      [$.xin_statement, $.opcode_statement, $.legacy_typed_assignment_statement],
      [$.xout_statement, $._expression],
      [$.array_access, $.opcode_name],
      [$.if_statement],
      [$.cabbage_statement],
      [$.opcode_statement],
      [$.macro_usage]
    ],

    rules: {

      // --- GENERAL SECTION ---

      source_file: $ => seq(
        optional($.cabbage_block),
        choice(
          $.file_score_body,
          $.csd_file,
          $.orchestra_body,
        )
      ),

      _statement: $ => choice(
        $.typed_assignment_statement,
        $.assignment_statement,
        $.legacy_typed_assignment_statement,
        $.function_call,
        $.opcode_statement,
        $.label_statement,
        $.control_statement,
        $.struct_definition,
        $.internal_code_block
      ),

      _lvalue: $ => choice(
        $.typed_identifier,
        $.global_typed_identifier,
        $.array_access,
        $.struct_access,
        $.identifier,
        $.pfield
      ),

      _expression: $ => choice(
        $.function_call,
        $.unary_expression,
        $.binary_expression,
        $.ternary_expression,
        $.parenthesized_expression,
        $.header_identifier,
        $.number,
        $.string,
        alias(choice(
                $.identifier,
                $.type_identifier_legacy
            ),
            $.identifier
        ),
        $.array_access,
        $.struct_access,
        $.macro_usage,
        $.array_data,
        $.internal_code_block,
        $.pfield
      ),

      control_statement: $ => choice(
        $.if_statement,
        $.while_loop,
        $.until_loop,
        $.for_loop,
        $.switch_statement,
        $.goto_statement,
        $.return_statement
      ),

      _root_statement: $ => choice(
        $.header_assignment,
        $.preprocessor_directive,
        $.instrument_definition,
        $.udo_definition,
        $._statement
      ),

      preprocessor_directive: $ => choice(
        $.macro_define,
        $.include_directive,
        $.undef_directive,
        $.ifdef_directive
      ),

      parenthesized_expression: $ => prec.left(
        seq(
          '(',
          choice(
            $._expression,
            $.argument_list
          ),
          ')'
        )
      ),

      array_access: $ => seq(
        field('array', choice(
          $.identifier,
          $.array_access,
          $.type_identifier_legacy,
          $.struct_access
        )),
        '[',
        $._expression,
        ']'
      ),

      array_data: $ => seq(
        '[',
        sep1($._expression, ','),
        ']'
      ),

      argument_list: $ => seq(
        $._expression,
        repeat(seq(',', $._expression))
      ),

      include_directive: $ => seq(choice(
        $.kw_include,
        $.kw_includestr
      ),
      $.string
      ),

      undef_directive: $ => seq(
        $.kw_undef,
        $.identifier
      ),

      macro_name: $ => seq(
        field('id', $.identifier),
        optional(seq(
          '(',
          sep1(field('arg', $.identifier), '\''),
          ')'
        ))
      ),

      macro_value: $ => token(
        repeat(choice(
            /[^#\\]/,
            /\\./
          ))
      ),

      macro_define: $ => seq(
        $.kw_define,
        field('macro_name', $.macro_name),
        '#',
        field('macro_values', $.macro_value),
        '#'
      ),

      macro_usage: $ => seq(
        '$',
        $.identifier,
        optional('.'),
        optional(seq(
          '(',
          sep1(choice(
            $.number,
            $.string,
            $.identifier
          ),
          "'"),
          ')'
        ))
      ),

      csd_file: $ => seq(
        $.tag_synthesizer_start,
        repeat($.csd_element),
        $.tag_synthesizer_end,
        optional($._whitespace)
      ),

      csd_element: $ => choice(
        $.cabbage_block,
        $.options_block,
        $.instruments_block,
        $.score_block
      ),

      // --- END GENERAL SECTION ---

      // --- CABBAGE SECTION ---

      cabbage_statement: $ => seq(
        field('widget', $.identifier),
        repeat($.cabbage_property)
      ),

      cabbage_property: $ => seq(
        field('key', $.identifier),
        '(', field('value', /[^)]*/),
        ')'
      ),

      // --- END CABBAGE SECTION ---

      // --- OPTIONS SECTION ---

      flag_content: $ => seq(
        $.flag_identifier,
        field('flag_type', choice(
          $.identifier,
          $.number,
          $.string
        )),
        optional("="),
        optional(field('flag_value', choice(
          $.string,
          $.number,
          $.identifier
        )))
      ),

      options_block: $ => seq(
        $.tag_options_start,
        repeat($.flag_content),
        optional($._new_line),
        $.tag_options_end,
        $._new_line
      ),

      // --- END OPTIONS BLOCK ---

      // --- ORCHESTRA BLOCK ---

      instruments_block: $ => seq(
        $.tag_instruments_start,
        optional($.orchestra_body),
        $.tag_instruments_end,
        $._new_line
      ),

      cabbage_block: $ => seq(
        $.tag_cabbage_start,
        repeat($.cabbage_statement),
        $.tag_cabbage_end,
        $._new_line
      ),

      orchestra_body: $ => repeat1($._root_statement),
      header_assignment: $ => seq(
        $.header_identifier,
        '=',
        $._expression
      ),

      instrument_definition: $ => seq(
        $.kw_instr,
        field('name', sep1(choice(
          $.identifier,
          $.number,
          $.plus_identifier
        ), ','
        )),
        repeat($._statement),
        $.kw_endin
      ),

      internal_code_block: $ => seq(
        $.kw_open_code_block,
        repeat($._statement),
        $.kw_close_code_block
      ),

      udo_definition: $ => choice(
        $.udo_definition_legacy,
        $.udo_definition_modern
      ),

      udo_definition_legacy: $ => seq(
        $.kw_opcode,
        field('name', $.opcode_name),
        optional(','),
        field('outputs', $.legacy_udo_args),
        ',',
        field('inputs', $.legacy_udo_args),
        optional($.xin_statement),
        repeat($._statement),
        optional($.xout_statement),
        $.kw_endop
      ),

      udo_definition_modern: $ => seq(
        $.kw_opcode,
        field('name', $.opcode_name),
        field('inputs', $.modern_udo_inputs),
        ':',
        field('outputs', $.modern_udo_outputs),
        repeat($._statement),
        optional($.xout_statement),
        $.kw_endop
      ),

      modern_udo_inputs: $ => seq(
        '(',
        optional(sep1(
          choice(
              $.typed_identifier,
              $.identifier
          ),
      ',')),
      ')'
      ),

      modern_udo_outputs: $ => choice(
        seq(
          '(',
          $.legacy_udo_args,
          ')'
        ),
        $.kw_void
      ),

      struct_definition: $ => prec(5, seq(
        $.kw_struct,
        field('name', $.struct_name),
        field('fields', sep1($.typed_identifier, ','))
      )),

      struct_access: $ => prec(10, seq(
        field('called_struct', choice(
          $.identifier,
          $.struct_access,
          $.array_access,
          $.type_identifier_legacy
        )),
        '.',
        field('member', $.identifier)
      )),

      xin_statement: $ => seq(
        field('outputs', sep1($.type_identifier_legacy, ',')),
        $.kw_xin
      ),

      xout_statement: $ => choice(
        seq(
          $.kw_xout,
          field('inputs', $.parenthesized_expression),
        ),
        seq(
          $.kw_xout,
          field('inputs', $.argument_list),
        )
      ),

      typed_assignment_statement: $ => prec(2, seq(
        field('left', sep1(choice($.typed_identifier, $.global_typed_identifier), ',')),
        field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal, '##addin', '##subin', '##mulin', '##divin')),
        field('right', $._expression)
      )),

      assignment_statement: $ => seq(
        field('left', sep1($._lvalue, ',')),
        field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal, '##addin', '##subin', '##mulin', '##divin')),
        field('right', $._expression)
      ),

      legacy_typed_assignment_statement: $ => prec(3, seq(
        field('left', sep1($.type_identifier_legacy, ',')),
        field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal, '##addin', '##subin', '##mulin', '##divin')),
        field('right', $._expression)
      )),

      opcode_statement: $ => choice(
        prec(2, seq(
          field('outputs', sep1(
            choice(
              $.typed_identifier,
              $.type_identifier_legacy
            ),
            ','
          )),
          field('op', $.opcode_name),
          field('inputs', optional($.argument_list))
        )),
        prec(1, seq(
          field('op', $.opcode_name),
          field('inputs', optional($.argument_list))
        )),
        prec(2, field('label_block', $.label_statement))
      ),

      label_statement: $ => prec(1,
        seq(
          field('label_name', choice($.type_identifier, $.identifier)),
          optional(':')
        )
      ),

      typed_identifier: $ => prec(3,
        seq(
          field('name', alias(choice($.identifier, $.type_identifier_legacy), $.identifier)),
          ':',
          field('type', choice($.type_identifier, $.identifier))
        )
      ),

      global_typed_identifier: $ => prec(2, seq(
        field('name', alias(choice(
            $.identifier,
            $.type_identifier_legacy
          ),
        $.identifier)
        ),
        $.global_keyword,
        ':',
        field('type', choice(
          $.type_identifier,
          $.identifier
        ))
      )),

      opcode_name: $ => alias(choice($.type_identifier_legacy, $.identifier), 'opcode_name'),

      unary_expression: $ => prec.left(10, seq(
        choice(
          '-',
          '~',
          '!'),
        $._expression
      )),

      ternary_expression: $ => prec.right(seq(
        $._expression,
        '?',
        $._expression,
        ':',
        $._expression
      )),

      binary_expression: $ => choice(
        prec.right(9, seq($._expression, '^', $._expression)),
        prec.left(8, seq($._expression, choice('*', '/', '%'), $._expression)),
        prec.left(7, seq($._expression, choice('+', '-'), $._expression)),
        prec.left(6, seq($._expression, choice('<<', '>>'), $._expression)),
        prec.left(5, seq($._expression, choice('<', '>', '<=', '>=', '==', '!=', '='), $._expression)),
        prec.left(4, seq($._expression, '&', $._expression)),
        prec.left(3, seq($._expression, '|', $._expression)),
        prec.left(2, seq($._expression, '&&', $._expression)),
        prec.left(1, seq($._expression, '||', $._expression))
      ),

      // --- END ORCHESTA SECTION ---

      // --- CONTROL SECTION ---

      endif_block: $ => choice(
        $.kw_endif,
        $.kw_fi
      ),

      goto_statement: $ => seq(
        choice(
          $.kw_goto,
          $.kw_igoto,
          $.kw_kgoto
        ),
        $.label_statement
      ),

      return_statement: $ => choice(
        $.kw_return,
        $.kw_rireturn
      ),

      elseif_block: $ => repeat1(
        seq(
          $.kw_elseif,
          $._expression,
          $.kw_then,
          repeat($._statement)
        )
      ),

      else_block: $ => seq(
        $.kw_else,
        repeat($._statement)
      ),

      if_statement: $ => seq(
        choice($.kw_if, $.kw_tif),
        field('condition', $._expression),
        choice(
          seq(
            choice(
                $.kw_then,
                $.kw_ithen,
                $.kw_kthen
            ),
            field('then_block', repeat($._statement)),
            optional($.elseif_block),
            optional($.else_block),
            $.endif_block
          ),
          seq(
            field('then_goto', $.goto_statement),
            optional(field('else_goto', repeat($.goto_statement))),
            optional($.return_statement)
          )
        )
      ),

      while_loop: $ => seq(
        $.kw_while,
        $._expression,
        $.kw_do,
        repeat($._statement),
        $.kw_od
      ),

      until_loop: $ => seq(
        $.kw_until,
        $._expression,
        $.kw_do,
        repeat($._statement),
        $.kw_od
      ),

      for_loop: $ => seq(
        $.kw_for,
        $.identifier,
        $.kw_in,
        $._expression,
        $.kw_do,
        repeat($._statement),
        $.kw_od
      ),

      case_header: $ => seq(
        $.kw_case_key,
        $._expression,
      ),

      default_header: $ => $.kw_default_key,

      switch_statement: $ => seq(
        $.kw_switch_start,
        $._expression,
        repeat($.case_block),
        optional($.default_block),
        $.kw_switch_end
      ),

      case_block: $ => prec.left(1, seq(
        field('case_header', $.case_header),
        field('case_body', repeat($._statement))
      )),

      default_block: $ => prec.left(1, seq(
        field('default_header', $.default_header),
        field('default_body', repeat($._statement))
      )),

      function_call: $ => prec(2,
        seq(
          field('function', $.opcode_name),
          '(',
          optional($.argument_list),
          ')'
        )
      ),

      ifdef_directive: $ => seq(
        choice(
          $.kw_ifdef,
          $.kw_ifndef
        ),
        $.identifier,
        repeat($._statement),
        optional(seq(
          $.kw_elsedef,
          repeat($._statement)
        )),
        $.kw_end
      ),

      // --- END CONTROL SECTION ---

      // --- SCORE SECTION ---

      score_unary_expression: $ => prec.left(7, seq(
        choice(
          '-',
          '@',
          '@@',
          '!'
        ),
        $._score_expression
      )),

      score_binary_expression: $ => choice(
        prec.right(6, seq($._score_expression, '^', $._score_expression)),
        prec.right(5, seq($._score_expression, '#', $._score_expression)),
        prec.left(4, seq($._score_expression, choice('*', '/', '%'), $._score_expression)),
        prec.left(3, seq($._score_expression, choice('+', '-'), $._score_expression)),
        prec.left(2, seq($._score_expression, '&', $._score_expression)),
        prec.left(1, seq($._score_expression, '|', $._score_expression)),
      ),

      score_body: $ => repeat1(seq(
        $._score_item,
        $._new_line
      )),

      file_score_body: $ => repeat1(seq(
        $._file_score_item,
        $._new_line
      )),

      score_block: $ => seq(
        $.tag_score_start,
        optional($.score_body),
        $.tag_score_end,
        $._new_line
      ),

      _score_item_body: $ => choice(
        $.preprocessor_directive,
        $.score_carry,
        $.score_plus
      ),

      _score_item: $ => choice(
        $.score_statement_func,
        $.score_nestable_loop,
        $.score_statement_instr,
        $.score_statement,
        $._score_item_body
      ),

      _file_score_item: $ => choice(
        $.file_score_statement_func,
        $.file_score_nestable_loop,
        $.file_score_statement_instr,
        $.file_score_statement,
        $._score_item_body
      ),

      _score_expression: $ => choice(
        $.score_unary_expression,
        $.score_binary_expression,
        $.parenthesized_score_expression,
        $.number,
        $.string,
        $.identifier,
        $.macro_usage,
        $.score_random_operator
      ),

      parenthesized_score_expression: $ => prec.left(
        seq(
          '(',
          $._score_expression,
          ')'
        )
      ),

      score_field: $ => choice(
        $.score_carry,
        $.score_plus,
        $._score_expression,
        $.score_operation
      ),

      score_operation: $ => seq(
        '[',
        $._score_expression,
        ']'
      ),

      _score_statement_instr: $ => seq(
        field('isntr', choice($.number, $.string, $.identifier)),
        field('start_time', $.score_field),
        field('duration', $.score_field),
        field('pfield', repeat($.score_field)),
      ),

      _score_statement_func: $ => seq(
        field('table_number', $.number),
        field('action_time', $.score_field),
        field('n_points', $.score_field),
        field('gen_id', $.score_field),
        field('pfield', repeat($.score_field)),
      ),

      _score_loop_body: $ => choice(
        $.score_carry,
        $.score_plus,
        $.score_nestable_loop
      ),

      score_statement: $ => seq(
        field('statement', $.score_statement_group),
        field('pfield', repeat($.score_field)),
      ),

      score_nestable_loop: $ => seq(
        '{',
        field('count', $.number),
        field('macro_loop_name', $.identifier),
        field('score_loop_body', choice(
          $.score_statement_instr,
          $._score_loop_body
        )),
        '}',
      ),

      score_statement_instr: $ => seq(
        field('statement', $.score_statement_i),
        $._score_statement_instr,
      ),

      score_statement_func: $ => seq(
        field('statement', $.score_statement_f),
        $._score_statement_func,
      ),

      file_score_statement: $ => seq(
        field('statement', $.file_score_statement_group),
        field('pfield', repeat($.score_field)),
      ),

      file_score_nestable_loop: $ => seq(
        '{',
        field('count', $.number),
        field('macro_loop_name', $.identifier),
        field('score_loop_body', choice(
          $.file_score_statement_instr,
          $._score_loop_body
        )),
        '}',
      ),

      file_score_statement_instr: $ => seq(
        field('statement', $.file_score_statement_i),
        $._score_statement_instr
      ),

      file_score_statement_func: $ => seq(
        field('statement', $.file_score_statement_f),
        $._score_statement_func
      ),

      // --- END SCORE SECTION ---

      // --- KEYWORDS ---

      kw_instr:                   $ => token(prec(5, 'instr')),
      kw_endin:                   $ => token(prec(5, 'endin')),
      kw_struct:                  $ => token(prec(5, 'struct')),
      kw_opcode:                  $ => token(prec(5, 'opcode')),
      kw_endop:                   $ => token(prec(5, 'endop')),
      kw_open_code_block:         $ => token('{{'),
      kw_close_code_block:        $ => token('}}'),
      kw_void:                    $ => token(prec(5, 'void')),
      kw_xin:                     $ => token('xin'),
      kw_xout:                    $ => token('xout'),
      kw_if:                      $ => token(prec(5, 'if')),
      kw_tif:                     $ => token(prec(5, 'tif')),
      kw_endif:                   $ => token(prec(5, 'endif')),
      kw_fi:                      $ => token(prec(5, 'fi')),
      kw_then:                    $ => token(prec(5, 'then')),
      kw_ithen:                   $ => token(prec(5, 'ithen')),
      kw_kthen:                   $ => token(prec(5, 'kthen')),
      kw_elseif:                  $ => token(prec(5, 'elseif')),
      kw_else:                    $ => token(prec(5, 'else')),
      kw_while:                   $ => token(prec(5, 'while')),
      kw_until:                   $ => token(prec(5, 'until')),
      kw_do:                      $ => token(prec(5, 'do')),
      kw_od:                      $ => token(prec(5, 'od')),
      kw_for:                     $ => token(prec(5, 'for')),
      kw_in:                      $ => token(prec(5, 'in')),
      kw_switch_start:            $ => token(prec(5, 'switch')),
      kw_switch_end:              $ => token(prec(5, 'endsw')),
      kw_case_key:                $ => token(prec(5, 'case')),
      kw_default_key:             $ => token(prec(5, 'default')),
      kw_goto:                    $ => token(prec(5, 'goto')),
      kw_kgoto:                   $ => token(prec(5, 'kgoto')),
      kw_igoto:                   $ => token(prec(5, 'igoto')),
      kw_return:                  $ => token(prec(5, 'return')),
      kw_rireturn:                $ => token(prec(5, 'rireturn')),
      kw_include:                 $ => token(prec(5, '#include')),
      kw_includestr:              $ => token(prec(5, '#includestr')),
      kw_define :                 $ => token(prec(5, '#define')),
      kw_ifdef:                   $ => token(prec(5, '#ifdef')),
      kw_undef:                   $ => token(prec(5, '#undef')),
      kw_end:                     $ => token(prec(5, '#end')),
      kw_ifndef:                  $ => token(prec(5, '#ifndef')),
      kw_elsedef:                 $ => token(prec(5, '#else')),
      pfield:                     $ => token(prec(5, /p[0-9]+/)),
      legacy_udo_args:            $ => token(/[a-zA-Z0-9_\[\]]+/),
      struct_name:                $ => token(prec(5, /[a-zA-Z0-9_]+/)),
      header_identifier:          $ => token(prec(10, /(sr|kr|ksmps|nchnls|nchnls_i|0dbfs)/)),
      score_carry:                $ => token(prec(5, '.')),
      score_plus:                 $ => token(prec(5, '+')),
      score_random_operator:      $ => token(prec(5, '~')),
      identifier:                 $ => /[a-zA-Z_]\w*/,
      plus_identifier:            $ => /\+[a-zA-Z_]\w*/,
      mod_equal:                  $ => seq('%', '='),
      flag_identifier:            $ => token(prec(5, '-')),
      file_score_statement_group: $ => token(prec(5, /\s*[aqrtesxybBCvmn]/)),
      file_score_statement_i:     $ => token(prec(5, /\s*i/)),
      file_score_statement_f:     $ => token(prec(5, /\s*f/)),
      score_statement_group:      $ => token(prec(5, /[aqrtesxybBCvmn]/)),
      score_statement_i:          $ => token(prec(5, 'i')),
      score_statement_f:          $ => token(prec(5, 'f')),
      global_keyword:             $ => token('@global'),
      type_identifier:            $ => token(prec(1, /(InstrDef|Instr|Opcode|Complex|[aikbSfw])(\[\])*/)),
      type_identifier_legacy:     $ => token(prec(1, /g?[aikbSfw][a-zA-Z0-9_\[\]]*/)),
      number:                     $ => choice(/\d+/, /0[xX][0-9a-fA-F]+/, /\d+\.\d+([eE][+-]?\d+)?/, /\d+[eE][+-]?\d+/),
      string:                     $ => seq('"', repeat(choice(/[^"\\\n]+/, /\\./)), '"'),
      comment:                    $ => token(choice(seq(';', /[^\n]*/), seq('//', /[^\n]*/))),
      block_comment:              $ => seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
      tag_synthesizer_start:      $ => /<CsoundSynthesi[sz]er>/,
      tag_synthesizer_end:        $ => /<\/CsoundSynthesi[sz]er>/,
      tag_options_start:          $ => /<CsOptions>/,
      tag_options_end:            $ => /<\/CsOptions>/,
      tag_instruments_start:      $ => /<CsInstruments>/,
      tag_instruments_end:        $ => /<\/CsInstruments>/,
      tag_score_start:            $ => /<CsScore>/,
      tag_score_end:              $ => /<\/CsScore>/,
      tag_cabbage_start:          $ => /<Cabbage>/,
      tag_cabbage_end:            $ => /<\/Cabbage>/,
      _new_line:                  $ => token(/\r?\n/),
      _whitespace:                $ => /\s+/,

      // --- END KEYWORDS ---

    }
});

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

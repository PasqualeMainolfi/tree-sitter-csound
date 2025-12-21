(macro_usage) @macro

(global_typed_identifier name: (identifier) @variable)

(typed_identifier
    name: (identifier) @variable)

(flag_identifier) @tag
(flag_content flag_type: (_) @constant.builtin)
(flag_content flag_value: (_) @variable)

(type_identifier) @type
(typed_identifier type: (_) @type)
(type_identifier_legacy) @type

(label_statement) @label

(udo_definition_legacy name: (opcode_name) @entity.name.function)
(udo_definition_modern name: (opcode_name) @entity.name.function)

(udo_definition_legacy inputs: (_) @type)
(udo_definition_legacy outputs: (_) @type)
(udo_definition_modern outputs: (_) @type)

(instrument_definition name: (_) @entity.name.function)

(comment) @comment
(block_comment) @comment
(string) @string
(number) @constant.numeric
(raw_score_script) @comment
(raw_code_script) @comment

[
  (kw_instr)
  (kw_endin)
  (kw_opcode)
  (kw_endop)
  (kw_struct)
  (kw_if )
  (kw_then)
  (kw_ithen)
  (kw_kthen)
  (kw_elseif)
  (kw_else)
  (kw_endif)
  (kw_fi)
  (kw_while)
  (kw_until)
  (kw_do)
  (kw_od)
  (kw_for)
  (kw_in)
  (kw_switch_start)
  (kw_case_key)
  (kw_default_key)
  (kw_return)
  (kw_rireturn)
  (kw_goto)
  (kw_kgoto)
  (kw_igoto)
  (kw_xin)
  (kw_xout)
  (kw_void)
  (kw_switch_end)
  (kw_include)
  (kw_includestr)
  (kw_define)
  (kw_ifdef)
  (kw_undef)
  (kw_end)
  (kw_ifndef)
  (kw_elsedef)
  (pfield)
  (header_identifier)
  (global_keyword)
  (score_statement_i)
  (score_statement_f)
  (score_statement_group)
  (file_score_statement_i)
  (file_score_statement_f)
  (file_score_statement_group)
  (kw_score_includestr)
  (kw_score_ifndef)
  (kw_score_ifdef)
  (kw_score_include)
  (kw_score_define)
  (score_carry)
  (score_plus)
  (score_exclamation)
  (score_np)
  (score_pp)
] @keyword

(identifier) @variable

(struct_name) @type
(struct_definition fields: (typed_identifier
    name: (identifier) @variable))

(struct_access
    called_struct: (_) @variable
    member: (identifier) @property)

[
  (tag_synthesizer_start)
  (tag_synthesizer_end)
  (tag_instruments_start)
  (tag_instruments_end)
  (tag_options_start)
  (tag_options_end)
  (tag_score_start)
  (tag_score_start_bin)
  (tag_score_end)
  (tag_cabbage_start)
  (tag_cabbage_end)
] @tag

[
  "="
  "+"
  "-"
  "*"
  "/"
  "%"
  "^"
  "&"
  "|"
  "<"
  ">"
  "@"
  "!"
  "#"
  "?"
  ":"
  "+="
  "-="
  "*="
  "/="
  (score_random_operator)
  (score_ramping)
  (score_plus_p)
  (score_minus_p)
  (mod_equal)
] @operator

[","] @punctuation.delimiter

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

(cabbage_statement . (identifier) @type)
(cabbage_property . (identifier) @property)

((opcode_name) @function
 (#not-has-child? @function "typed_identifier"))

(opcode_name
    (typed_identifier
        name: (_) @function
        type: (_) @type))

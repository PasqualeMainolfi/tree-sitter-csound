; ((identifier) @variable (#match? @variable "^a"))
; ((identifier) @variable.parameter (#match? @variable.parameter "^k"))
; ((identifier) @constant (#match? @constant "^i"))
; ((identifier) @string.special (#match? @string.special "^S"))
; ((identifier) @variable.builtin (#match? @variable.builtin "^g"))
; ((identifier) @variable.parameter (#match? @variable.parameter "^p[0-9]+$"))

(macro_usage) @macro

(global_typed_identifier name: (identifier) @variable)

(flag_identifier) @constant.builtin
(flag_content flag_type: (_) @constant.builtin)
(flag_content flag_value: (_) @variable)

(type_identifier) @type
(typed_identifier type: (_) @type)
(type_identifier_legacy) @type

(typed_identifier name: (identifier) @variable)

(opcode_name) @function
(function_call function: (opcode_name) @function)
(opcode_statement op: (opcode_name) @function)

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
  (score_carry)
  (score_plus)
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

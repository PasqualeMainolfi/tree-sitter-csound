; ((identifier) @variable (#match? @variable "^a"))
; ((identifier) @variable.parameter (#match? @variable.parameter "^k"))
; ((identifier) @constant (#match? @constant "^i"))
; ((identifier) @string.special (#match? @string.special "^S"))
; ((identifier) @variable.builtin (#match? @variable.builtin "^g"))
; ((identifier) @variable.parameter (#match? @variable.parameter "^p[0-9]+$"))

(header_identifier) @keyword
(global_keyword) @keyword

(global_typed_identifier name: (identifier) @variable)

(type_identifier) @type
(typed_identifier type: (_) @type)
(type_identifier_legacy) @type

(typed_identifier name: (identifier) @variable)

(opcode_name) @function
(function_call function: (opcode_name) @function)
(opcode_statement op: (opcode_name) @function)

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
    (kw_instr) (kw_endin) (kw_opcode) (kw_endop) (kw_struct)
    (kw_if ) (kw_then) (kw_ithen) (kw_kthen) (kw_elseif) (kw_else) (kw_endif) (kw_fi)
    (kw_while) (kw_until) (kw_do) (kw_od) (kw_for)  (kw_in) (kw_switch_start) (kw_case_key) (kw_default_key)
    (kw_return) (kw_rireturn) (kw_goto) (kw_kgoto) (kw_igoto)
    (kw_xin) (kw_xout) (kw_void) (kw_switch_end)
] @keyword

(identifier) @variable

(struct_name) @type
(struct_definition fields: (typed_identifier
    name: (identifier) @variable))

(struct_access
    called_struct: (_) @variable
    member: (identifier) @property)

(tag_synthesizer_start) @tag
(tag_synthesizer_end) @tag
(tag_instruments_start) @tag
(tag_instruments_end) @tag
(tag_options_start) @tag
(tag_options_end) @tag
(tag_score_start) @tag
(tag_score_end) @tag
(tag_cabbage_start) @tag
(tag_cabbage_end) @tag

["=" "+" "-" "*" "/" "%" "^" "?" ":"] @operator
[","] @punctuation.delimiter
["(" ")" "[" "]" "{" "}"] @punctuation.bracket

(cabbage_statement . (identifier) @type)
(cabbage_property . (identifier) @property)
(score_statement . (_) @keyword)
(score_carry) @operator

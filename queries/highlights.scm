((identifier) @variable (#match? @variable "^a"))
((identifier) @variable.parameter (#match? @variable.parameter "^k"))
((identifier) @constant (#match? @constant "^i"))
((identifier) @string.special (#match? @string.special "^S"))
((identifier) @variable.builtin (#match? @variable.builtin "^g"))
((identifier) @variable.parameter (#match? @variable.parameter "^p[0-9]+$"))

(header_identifier) @variable.builtin
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
    "instr" "endin" "opcode" "endop" "struct"
    "if" "then" "ithen" "kthen" "elseif" "else" "endif" "fi"
    "while" "until" "do" "od" "for" "in" "switch" "case" "default"
    "return" "goto" "kgoto" "igoto"
    "xin" "xout" "void" (switch_end)
] @keyword

(identifier) @variable

(struct_name) @type
(struct_definition fields: (typed_identifier
    name: (identifier) @variable))
(struct_access
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
["," ";"] @punctuation.delimiter
["(" ")" "[" "]" "{" "}"] @punctuation.bracket

(cabbage_statement . (identifier) @type)
(cabbage_property . (identifier) @property)
(score_statement . (_) @keyword)
(score_carry) @operator

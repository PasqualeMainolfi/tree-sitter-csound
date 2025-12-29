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
(number) @number

[
    (header_identifier)
    (pfield)
] @constant.builtin.emphasis

[
    (kw_instr)
    (kw_endin)
    (kw_include)
    (kw_includestr)
    (kw_define)
    (kw_ifdef)
    (kw_undef)
    (kw_end)
    (kw_ifndef)
    (kw_elsedef)
] @keyword.emphasis.strong

[
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
    (global_keyword)
    (score_statement_i)
    (score_statement_f)
    (score_statement_group)
    (instr_p1)
    (func_p1)
    (score_carry)
    (score_plus)
    (score_exclamation)
    (score_np_operator)
    (score_pp_operator)
] @keyword

(identifier) @variable

(struct_name) @type
(struct_definition struct_field: (typed_identifier
    name: (identifier) @variable))

(struct_access
    called_struct: (_) @variable
    struct_member: (identifier) @property)

[
    (tag_synthesizer_start)
    (tag_synthesizer_end)
    (tag_instruments_start)
    (tag_instruments_end)
    (tag_options_start)
    (tag_options_end)
    (tag_score_start)
    (tag_score_start_python)
    (tag_score_start_csbeats)
    (tag_score_end)
    (tag_cabbage_start)
    (tag_cabbage_end)
    (tag_csfileb_start)
    (tag_csfileb_end)
    (tag_csmidifileb)
    (tag_cssamplefileb)
    (tag_csfile_start)
    (tag_csfile_end)
    (tag_licence_start)
    (tag_licence_end)
    (tag_short_licence_start)
    (tag_short_licence_end)
    (tag_html_start)
    (tag_html_end)
] @tag.emphasis

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
    "<<"
    ">>"
    ">="
    "<="
    "=="
    "!="
    "&&"
    "||"
    "~"
    (score_random_operator)
    (score_ramping)
    (score_plus_p_operator)
    (score_minus_p_operator)
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

(macro_usage
    macro_symbol: "$" @macro.emphasis.strong
    id: (identifier) @macro.emphasis.strong)

(macro_name
    id: (_) @macro.emphasis.strong)

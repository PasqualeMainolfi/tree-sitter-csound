(instrument_definition) @indent
(instrument_definition "endin" @outdent)

(udo_definition_legacy) @indent
(udo_definition_legacy "endop" @outdent)

(udo_definition_modern) @indent
(udo_definition_modern "endop" @outdent)

(if_statement) @indent

(if_statement
  [
    "then"
    "ithen"
    "kthen"
  ] @indent
)

(if_statement
  [
    "endif"
    "fi"
    (else_block)
    (elseif_block)
  ] @outdent
)

(else_block) @indent
(elseif_block) @indent

(while_loop) @indent
(while_loop "od" @outdent)

(until_loop) @indent
(until_loop "od" @outdent)

(for_loop) @indent
(for_loop "od" @outdent)

(switch_statement) @indent
(switch_statement (switch_end) @outdent)

(case_block) @indent
(default_block) @indent

(score_loop) @indent
(score_loop "}" @outdent)

(cabbage_block) @indent
(cabbage_block (tag_cabbage_end) @outdent)

(html_block) @indent

;;; 6. LISTS & EXPRESSIONS

(parenthesized_expression) @indent
(parenthesized_expression ")" @outdent)

(function_call) @indent

(modern_udo_inputs) @indent
(modern_udo_inputs ")" @outdent)

(modern_udo_outputs) @indent
(modern_udo_outputs ")" @outdent)

(instrument_definition) @indent
(instrument_definition (kw_endin) @outdent)

(udo_definition_legacy) @indent
(udo_definition_legacy (kw_endop) @outdent)

(udo_definition_modern) @indent
(udo_definition_modern (kw_endop) @outdent)

(internal_code_block
    (kw_close_code_block) @outdent)


(if_statement) @indent
(if_statement
  [
    (kw_then)
    (kw_ithen)
    (kw_kthen)
  ] @indent
)

(if_statement
  [
    (kw_endif)
    (kw_fi)
    (else_block)
    (elseif_block)
  ] @outdent
)

(else_block) @indent
(elseif_block) @indent


(switch_statement) @indent
(switch_statement
  [(case_block) (default_block)] @indent)
(case_block
  case_body: (opcode_statement) @indent)
(case_block
  case_body: (assignment_statement) @indent)
(default_block
  default_body: (opcode_statement) @indent)
(default_block
  default_body: (assignment_statement) @indent)
(kw_switch_end) @outdent

(while_loop) @indent
(while_loop (kw_od) @outdent)

(until_loop) @indent
(until_loop (kw_od) @outdent)

(for_loop) @indent
(for_loop (kw_od) @outdent)

(score_loop) @indent
(score_loop "}" @outdent)

(cabbage_block) @indent
(cabbage_block (tag_cabbage_end) @outdent)

(html_block) @indent

;;; 6. LISTS & EXPRESSIONS

(parenthesized_expression) @indent
; (parenthesized_expression ")" @outdent)

(function_call) @indent

(modern_udo_inputs) @indent
; (modern_udo_inputs ")" @outdent)

(modern_udo_outputs) @indent
; (modern_udo_outputs ")" @outdent)

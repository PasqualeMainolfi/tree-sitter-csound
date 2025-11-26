(instrument_definition) @local.scope
(udo_definition_legacy) @local.scope
(udo_definition_modern) @local.scope

(udo_definition_legacy name: (opcode_name) @local.definition)
(udo_definition_modern name: (opcode_name) @local.definition)

(struct_definition name: (struct_name) @local.definition)

(global_typed_identifier
  name: (identifier) @local.definition)

(udo_definition_legacy
  inputs: (_) @local.definition)

(udo_definition_modern
  inputs: (typed_identifier
    name: (identifier) @local.definition))

(instrument_definition name: (_) @local.definition)

(typed_assignment_statement
  left: (typed_identifier
    name: (identifier) @local.definition))

(assignment_statement
  left: (identifier) @local.definition)

(assignment_statement
  left: (array_access
    array: (identifier) @local.definition))

(opcode_statement
  outputs: (identifier) @local.definition)

(xin_statement
  outputs: (identifier) @local.definition)

(xin_statement
  outputs: (typed_identifier
    name: (identifier) @local.definition))

(opcode_name) @local.reference

(struct_name) @local.reference

(assignment_statement right: (identifier) @local.reference)
(typed_assignment_statement right: (identifier) @local.reference)
(header_assignment (identifier) @local.reference)
(header_identifier) @local.reference

(argument_list (identifier) @local.reference)

(if_statement condition: (identifier) @local.reference)
(while_loop (identifier) @local.reference)

(struct_access member: (identifier) @local.reference)

(identifier) @local.reference

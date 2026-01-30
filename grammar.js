/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
    name: 'csound',
    word: $ => $.type_identifier_legacy,
    extras: $ => [/\s/, $.comment, $.block_comment, $._line_continuation],
    conflicts: $ => [
      [$.xin_statement, $.opcode_statement, $.legacy_typed_assignment_statement],
      [$.score_statement, $.score_statement_instr, $.score_statement_func],
      [$.legacy_typed_assignment_statement, $.opcode_statement],
      [$.cs_legacy_file, $.orchestra_statement, $.score_file],
      [$.opcode_statement, $.typed_assignment_statement],
      [$.argument_list, $.parenthesized_expression],
      [$.xout_statement, $._expression],
      [$.orchestra_statement, $.score_file],
      [$.cs_legacy_file, $.score_file],
      [$.cs_legacy_file, $.orchestra_statement],
      [$.array_access, $.opcode_name],
      // [$.cabbage_statement],
      [$._score_statement_instr],
      [$.opcode_statement],
      [$.score_file],
      [$.macro_usage]
    ],

  rules: {

    // --- GENERAL SECTION ---

    source_file: $ => choice(
      $.cs_legacy_file,
      $.csd_file
    ),

    cs_legacy_file: $ => seq(
      optional(alias($.preprocessor_directive, 'cs_common_instructions')),
      choice(
        seq(
          alias($.score_file, 'cs_score'),
          alias($.udo_file, 'cs_udo'),
        ),
        alias($.score_file, 'cs_score'),
        alias($.orchestra_file, 'cs_orchestra')
      )
    ),

    orchestra_file: $ => repeat1($.orchestra_statement),

    _statement: $ => choice(
      $.typed_assignment_statement,
      $.assignment_statement,
      $.legacy_typed_assignment_statement,
      $.function_call,
      $.opcode_statement,
      $.label_statement,
      $.control_statement,
      $.rigoto_statement,
      $.struct_definition,
      $.return_statement
    ),

    _lvalue: $ => choice(
      $.global_typed_identifier,
      $.typed_identifier,
      $.array_access,
      $.struct_access,
      $.identifier,
      $.pfield
    ),

    _expression: $ => choice(
      $.internal_raw_block,
      $.function_call,
      $.unary_expression,
      $.binary_expression,
      $.ternary_expression,
      $.parenthesized_expression,
      $.header_identifier,
      $.number,
      $.boolean_var,
      $.string,
      alias(choice(
        $.identifier,
        $.type_identifier_legacy,
      ), $.identifier),
      $.typed_identifier,
      $.array_access,
      $.struct_access,
      $.macro_usage,
      $.array_data,
      $.pfield
    ),

    control_statement: $ => choice(
      $.if_statement,
      $.while_loop,
      $.until_loop,
      $.for_loop,
      $.switch_statement,
      $.goto_statement,
    ),

    orchestra_statement: $ => choice(
      $.header_assignment,
      $.instrument_definition,
      $.preprocessor_directive,
      $.udo_definition,
      $._statement
    ),

    udo_statement: $ => choice(
      $.preprocessor_directive,
      $.udo_definition,
      $._statement
    ),

    udo_file: $ => repeat1($.udo_statement),

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

    included_file: $ => choice($.string, seq('<', /[^>]*/, '>')),
    include_directive: $ => seq(
      choice(
        $.kw_include,
        $.kw_includestr
      ),
      field('included_file', $.included_file),
    ),

    undef_directive: $ => seq(
      $.kw_undef,
      $.identifier
    ),

    macro_args: $ => seq(
      '(',
      sep1(field('arg', $.identifier), '\''),
      ')'
    ),

    macro_name: $ => seq(
      field('id', $.identifier),
      optional(field('macro_args', $.macro_args))
    ),

    macro_value: $ => token(
      repeat(choice(
        /[^#\\]/,
        /\\./
      ))
    ),

    macro_define: $ => prec(10, seq(
      $.kw_define,
      field('macro_name', $.macro_name),
      '#',
      field('macro_values', $.macro_value),
      '#'
    )),

    macro_usage: $ => seq(
      field('macro_symbol', '$'),
      field('id', $.identifier),
      optional('.'),
      optional(seq(
        '(',
        sep1(choice(
          $.number,
          $.string,
          $.identifier
        ),
          '\''),
        ')'
      ))
    ),

    csd_file: $ => seq(
      optional($.cabbage_block),
      $.tag_synthesizer_start,
      repeat($.csd_element),
      $.tag_synthesizer_end,
      optional($._whitespace)
    ),

    csd_element: $ => choice(
      $.optional_tag_block,
      $.options_block,
      $.instruments_block,
      $.score_block
    ),

    comment: $ => token(seq(
      choice(
        ';',
        '//'
      ),
      /[^\n]*/,
    )),

    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/')
    ),

    // --- END GENERAL SECTION ---

    // --- CABBAGE SECTION ---

    // cabbage_statement: $ => seq(
    //   field('widget', $.identifier),
    //   repeat($.cabbage_property)
    // ),

    // cabbage_property: $ => seq(
    //   field('key', $.identifier),
    //   '(',
    //   field('value', /[^)]*/),
    //   ')'
    // ),

    cabbage_json_block: $ => seq(
      '[',
      repeat(choice(
        $.strong_string,
        $.json_punctuation,
        $.cabbage_json_block,
        $.json_atom
      )),
      ']'
    ),

    strong_string: $ => token(prec(5, seq(
      '"',
      repeat(choice(
        /[^"\\]+/,
        /\\./
      )),
      '"'
    ))),

    json_punctuation: $ => token(prec(2, choice('{', '}', ',', ':'))),

    json_atom: $ => token(prec(1, choice(
        /-?\d+(\.\d+)?([eE][+-]?\d+)?/,
        'true', 'false', 'null'
    ))),

    // cabbage_statement: $ => seq(
    //     $.identifier,
    //     repeat(seq('(', /[^)]*/, ')')) // Argomenti tra parentesi tonde
    // ),

    // --- END CABBAGE SECTION ---

    // --- OPTIONAL TAG ---

    optional_tag_start: $ => seq(
      choice(
        $.tag_csfileb_start,
        $.tag_csmidifileb,
        $.tag_cssamplefileb,
        $.tag_csfile_start,
        $.tag_licence_start,
        $.tag_short_licence_start,
      )
    ),

    optional_tag_end: $ => seq(
      choice(
        $.tag_csfileb_end,
        $.tag_csfile_end,
        $.tag_licence_end,
        $.tag_short_licence_end,
      )
    ),

    generic_tag_block: $ => seq(
      field('optional_start_tag', $.optional_tag_start),
      field('content',
        repeat(choice(
          $.raw_script,
          $.generic_closing_tag
        ))
      ),
      optional(field('optional_end_tag', $.optional_tag_end))
    ),

    html_block: $ => seq(
      field('html_start_tag', $.tag_html_start),
      field('content',
        repeat(choice(
          $.raw_script,
          $.generic_closing_tag
        ))
      ),
      optional(field('optional_end_tag', $.tag_html_end))
    ),

    optional_tag_block: $ => choice($.generic_tag_block, $.html_block),

    // --- END OPTIONAL TAG


    // --- OPTIONS SECTION ---

    flag_content: $ => seq(
      $.flag_identifier,
      field('flag_type', token(prec(5, /[a-zA-Z0-9][a-zA-Z0-9_+-]*/))),
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
      $.tag_options_end,
      $._new_line
    ),

    // --- END OPTIONS BLOCK ---

    // --- ORCHESTRA BLOCK ---

    return_statement: $ => seq(
      $.kw_return,
      optional('('),
      optional(')'),
    ),

    instruments_block: $ => seq(
      $.tag_instruments_start,
      optional($.orchestra_file),
      $.tag_instruments_end,
      $._new_line
    ),

    cabbage_block: $ => seq(
      $.tag_cabbage_start,
      repeat($.cabbage_json_block),
      // field('cabbage_content', repeat(choice(
      //   $.strong_string,
      //   $.raw_script,
      //   $.generic_closing_tag,
      // ))),
      $.tag_cabbage_end,
      $._new_line
    ),

    header_assignment: $ => seq(
      $.header_identifier,
      '=',
      $._expression
    ),

    instrument_definition: $ => prec(7, seq(
      field('instr', token(prec(5, 'instr'))),
      field('name', prec.left(sep1(
        choice(
          $.identifier,
          $.number,
          $.plus_identifier
        ),
        ','
      ))),
      optional($._new_line),
      repeat($._statement),
      choice(
        'endin',
        $.instr_udo_bounded_error
      )
    )),

    internal_raw_block: $ => seq(
      $.kw_open_raw_string,
      repeat($.raw_text),
      $.kw_close_raw_string
    ),

    udo_definition: $ => choice(
      $.udo_definition_legacy,
      $.udo_definition_modern
    ),

    udo_definition_legacy: $ => seq(
      'opcode',
      field('name', $.opcode_name),
      ',',
      field('outputs', $.legacy_udo_args),
      ',',
      field('inputs', $.legacy_udo_args),
      optional($.xin_statement),
      field('udo_body', repeat($._statement)),
      optional($.xout_statement),
      choice(
        'endop',
        $.instr_udo_bounded_error
      )
    ),

    udo_definition_modern: $ => seq(
      'opcode',
      field('name', $.opcode_name),
      field('inputs', $.modern_udo_inputs),
      ':',
      field('outputs', $.modern_udo_outputs),
      field('udo_body', repeat($._statement)),
      optional($.xout_statement),
      choice(
        'endop',
        $.instr_udo_bounded_error
      )
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
      'struct',
      field('struct_name', $.identifier),
      field('struct_field', sep1($.typed_identifier, ',')),
      optional('endstruct')
    )),

    struct_access: $ => prec(10, seq(
      field('called_struct', choice(
        $.identifier,
        $.struct_access,
        $.array_access,
        $.type_identifier_legacy
      )),
      '.',
      field('struct_member', $.identifier)
    )),

    xin_statement: $ => prec.dynamic(10, seq(
      field('outputs', sep1($.type_identifier_legacy, ',')),
      $.kw_xin,
    )),

    xout_statement: $ => seq(
      $.kw_xout,
      field('inputs', choice(
        $.parenthesized_expression,
        $.argument_list
      )),
    ),

    typed_assignment_statement: $ => prec.dynamic(5, prec(2, seq(
      field('left', sep1(choice($.typed_identifier, $.global_typed_identifier), ',')),
      field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal)),
      field('right', $.argument_list)
    ))),

    udo_typed_assignment_statement: $ => prec.dynamic(5, prec(2, seq(
      optional($._whitespace),
      field('left', sep1(choice($.typed_identifier, $.global_typed_identifier), ',')),
      field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal)),
      field('right', $.argument_list)
    ))),

    assignment_statement: $ => prec.dynamic(5, seq(
      field('left', sep1($._lvalue, ',')),
      field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal)),
      field('right', $.argument_list)
    )),

    legacy_typed_assignment_statement: $ => prec.dynamic(5, prec(3, seq(
      field('left', sep1($.type_identifier_legacy, ',')),
      field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal)),
      field('right', $.argument_list)
    ))),

    opcode_statement: $ => choice(
      prec.dynamic(1, prec(3, seq(
        field('outputs', sep1(
          choice(
            $.typed_identifier,
            $.type_identifier_legacy
          ),
          ','
        )),
        choice(
          seq(
            field('op', $.opcode_name),
            field('inputs', optional($.argument_list))
          ),
          field('op_macro', $.macro_usage),
        )
      ))),
      prec.dynamic(0, prec(2, seq(
        field('op', $.opcode_name),
        optional(field('inputs', $.argument_list))
      )))
    ),

    typed_identifier: $ => prec(5,
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

    label_statement: $ => prec.dynamic(10, prec(1,
      seq(
        field('label_name', alias(choice($.identifier, $.type_identifier_legacy), $.identifier)),
        optional(':'),
        $._new_line
      )
    )),

    opcode_name: $ => choice(
      field('opcode_typed_name', $.typed_identifier),
      alias(choice($.type_identifier_legacy, $.identifier), 'opcode_name')
    ),

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

    control_loop_body: $ => choice(
      $._statement,
      $.break_statement,
      $.continue_statement
    ),

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
      optional('('),
      $.label_statement,
      optional(')')
    ),

    rigoto_statement: $ => seq(
      choice(
        $.kw_rigoto,
        $.kw_reinit,
      ),
      optional('('),
      $.label_statement,
      optional(')')
    ),

    elseif_block: $ => seq(
      $.kw_elseif,
      $._expression,
      optional($.then_block)
    ),

    else_block: $ => seq(
      $.kw_else,
      repeat($.control_loop_body)
    ),

    then_block: $ => choice(
      $.kw_then,
      $.kw_ithen,
      $.kw_kthen
    ),

    if_statement: $ => prec.left(1, seq(
      choice($.kw_if, $.kw_tif),
      field('condition', $._expression),
      choice(
        seq(
          optional($.then_block),
          seq(
            field('then_body', repeat($.control_loop_body)),
            optional(repeat(
              seq(
                $.elseif_block,
                field('elseif_body', repeat($.control_loop_body))
              )
            )),
            optional($.else_block),
            choice(
              $.endif_block,
              $.control_statement_bounded_error
            )
          )
        ),
        seq(
          field('then_goto', choice($.goto_statement, $.rigoto_statement)),
          optional(field('else_goto', repeat($.goto_statement)))
        )
      )
    )),

    while_loop: $ => prec.left(1, seq(
      $.kw_while,
      $._expression,
      $.kw_do,
      repeat($.control_loop_body),
      choice(
        $.kw_od,
        $.control_statement_bounded_error
      )
    )),

    until_loop: $ => prec.left(1, seq(
      $.kw_until,
      $._expression,
      $.kw_do,
      repeat($.control_loop_body),
      choice(
        $.kw_od,
        $.control_statement_bounded_error
      )
    )),

    for_loop: $ => prec.left(1, seq(
      $.kw_for,
      field('iterator', $.identifier),
      $.kw_in,
      $._expression,
      $.kw_do,
      repeat($.control_loop_body),
      choice(
        $.kw_od,
        $.control_statement_bounded_error
      )
    )),

    case_header: $ => seq(
      $.kw_case_key,
      $._expression,
    ),

    default_header: $ => $.kw_default_key,

    switch_statement: $ => prec.left(1, seq(
      $.kw_switch_start,
      $._expression,
      repeat($.case_block),
      optional($.default_block),
      choice(
        $.kw_switch_end,
        $.control_statement_bounded_error
      )
    )),

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
        optional(field('inputs', $.argument_list)),
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
        '@@'
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

    score_file: $ => seq(
      repeat($.preprocessor_directive),
      repeat1(seq(
        $._score_item,
        $._new_line
      ))
    ),

    _score_block: $ => seq(
      $.tag_score_start,
      // optional($._new_line),
      field('content', repeat(seq(
        $._score_item,
        $._new_line
      ))),
      $.tag_score_end,
      optional($._new_line)
    ),

    score_block: $ => choice(
      $._score_block,
      $._score_script_block
    ),

    python_block: $ => seq(
      field('python_score_tag_start', $.tag_score_start_python),
      field('content',
        repeat(choice(
          $.raw_script,
          $.generic_closing_tag
        ))
      ),
      field('python_score_tag_end', $.tag_score_end)
    ),

    csbeats_block: $ => seq(
      field('csbeats_score_tag_start', $.tag_score_start_csbeats),
      field('content',
        repeat(choice(
          $.raw_script,
          $.generic_closing_tag
        ))
      ),
      field('csbeats_score_tag_end', $.tag_score_end)
    ),

    _score_script_block: $ => choice(
      $.python_block,
      $.csbeats_block
    ),

    _score_item: $ => choice(
      $.preprocessor_directive,
      $.score_statement_func,
      $.score_nestable_loop,
      $.score_statement_instr,
      $.score_statement_wm,
      $.score_statement
    ),

    _score_expression: $ => choice(
      $.score_unary_expression,
      $.score_binary_expression,
      $.parenthesized_score_expression,
      $.score_operation,
      $.number,
      $.string,
      $.macro_usage,
      $.score_random_operator,
      $.score_carry,
      $.score_plus,
      $.score_plus_p,
      $.score_minus_p,
      $.score_exclamation,
      $.score_ramping,
      $.score_np,
      $.score_pp,
      $.group_p1_safe,
      $.score_statement_safe,
      $.score_z_operator
    ),

    parenthesized_score_expression: $ => prec.left(
      seq(
        '(',
        $._score_expression,
        ')'
      )
    ),

    score_operation: $ => seq(
      '[',
      $._score_expression,
      ']'
    ),

    _score_statement_instr: $ => seq(
      field('start_time', $._score_expression),
      field('duration', $._score_expression),
      field('pfield', repeat($._score_expression)),
    ),

    _score_loop_body: $ => choice(
      $.score_carry,
      $.score_plus,
      $.score_nestable_loop
    ),

    score_statement: $ => prec(5, seq(
      field('statement', choice(
        $.score_statement_group,
        $.group_p1,
        $.macro_usage
      )),
      field('pfield', repeat($._score_expression)),
      optional($.score_line_error)
    )),

    score_statement_wm: $ => prec(5, seq(
      field('statement', choice(
        $.score_statement_with_macro,
        $.swmacro_p1,
        $.macro_usage
      )),
      optional(field('pfield', $._score_expression)),
      field('macro_identifier', $.identifier),
      optional(field('pfield', repeat($._score_expression))),
      optional($.score_line_error)
    )),

    score_nestable_loop: $ => seq(
      '{',
      field('count', choice($.number, $.macro_usage)),
      field('macro_identifier', $.identifier),
      field('score_loop_body', choice(
        $.score_statement_instr,
        $._score_loop_body
      )),
      '}',
    ),

    score_statement_instr: $ => prec(10, seq(
      choice(
        seq(
          field('statement', $.score_statement_i),
          field('instr', choice($.number, $.string))
        ),
        field('statement_instr', $.instr_p1),
        field('statement_macro_instr', $.macro_usage),
      ),
      choice(
        $._score_statement_instr,
        $.score_line_error
      ),
    )),

    score_statement_func: $ => prec(10, seq(
      choice(
        seq(
          field('statement', $.score_statement_f),
          field('table_number', $.number)
        ),
        field('statement_func', $.func_p1),
        field('statement_macro_func', $.macro_usage),
      ),
      choice(
        seq(
          field('action_time', $._score_expression),
          field('pfield', repeat($._score_expression))
        ),
        $.score_line_error
      )
    )),

    // --- END SCORE SECTION ---

    control_statement_bounded_error: $ => choice(
      'endin',
      'instr',
      $.tag_instruments_end
    ),

    instr_udo_bounded_error: $ => choice(
      'instr',
      $.tag_instruments_end
    ),

    // --- KEYWORDS ---

    kw_open_raw_string:         $ => choice(token('{{'), token('R{')),
    kw_close_raw_string:        $ => choice(token('}}'), token('}R')),
    kw_void:                    $ => token(prec(5, 'void')),
    kw_true:                    $ => token(prec(5, 'true')),
    kw_false:                   $ => token(prec(5, 'false')),
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
    break_statement:            $ => token(prec(5, 'break')),
    continue_statement:         $ => token(prec(5, 'continue')),
    kw_switch_start:            $ => token(prec(5, 'switch')),
    kw_switch_end:              $ => token(prec(5, 'endsw')),
    kw_case_key:                $ => token(prec(5, 'case')),
    kw_default_key:             $ => token(prec(5, 'default')),
    kw_goto:                    $ => token(prec(5, 'goto')),
    kw_kgoto:                   $ => token(prec(5, 'kgoto')),
    kw_igoto:                   $ => token(prec(5, 'igoto')),
    kw_rigoto:                  $ => token(prec(5, 'rigoto')),
    kw_return:                  $ => token(prec(5, /(return|rireturn)/)),
    kw_reinit:                  $ => token(prec(5, 'reinit')),
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
    header_identifier:          $ => token(prec(10, /(sr|kr|ksmps|nchnls|nchnls_i|0dbfs)/)),
    score_carry:                $ => token(prec(5, /\s+\./)),
    score_plus:                 $ => token(prec(5, '+')),
    score_plus_p_operator:      $ => token(prec(5, /\^\+/)),
    score_minus_p_operator:     $ => token(prec(5, /\^-/)),
    score_z_operator:           $ => token(prec(5, /\s+z/)),
    score_plus_p:               $ => seq($.score_plus_p_operator, $.number),
    score_minus_p:              $ => seq($.score_minus_p_operator, $.number),
    score_exclamation:          $ => token(prec(5, '!')),
    score_random_operator:      $ => token(prec(5, '~')),
    score_np_operator:          $ => token(prec(5, 'np')),
    score_pp_operator:          $ => token(prec(5, 'pp')),
    score_np:                   $ => seq($.score_np_operator, $.number),
    score_pp:                   $ => seq($.score_pp_operator, $.number),
    score_ramping:              $ => token(/\s+<\s+/),
    identifier:                 $ => /[a-zA-Z_]\w*/,
    plus_identifier:            $ => /\+[a-zA-Z_]\w*/,
    mod_equal:                  $ => seq('%', '='),
    flag_identifier:            $ => token(prec(5, /-[-\+]?/)),
    instr_p1:                   $ => token(prec(6, /i(\d+(\.\d*)?|\.\d+)\s+/)),
    func_p1:                    $ => token(prec(6, /f(?:\d+)\s+/)),
    group_p1:                   $ => token(prec(6, seq(/[aqtesxybBCv](\d+(\.\d*)?|\.\d+)/, /\s+/))),
    group_p1_safe:              $ => token(prec(6, /[aqtesxybBCv](\d+(\.\d*)?|\.\d+)/)),
    swmacro_p1:                 $ => token(prec(6, seq(/[rmn](\d+(\.\d*)?|\.\d+)/, /\s+/))),

    score_statement_group:      $ => token(prec(5, seq(/[aqtesxybBCv]/, /\s+/))),
    score_statement_safe:       $ => token(prec(5, /[aqtesxybBCv]/)),
    score_statement_with_macro: $ => token(prec(5, seq(/[rmn]/, /\s+/))),
    score_statement_i:          $ => token(prec(5, seq('i', /\s+/))),
    score_statement_f:          $ => token(prec(5, seq('f', /\s+/))),
    score_line_error:           $ => token(prec(-1, seq(/[^aqrtesxybBCvifrmn(<\/)]/, /[^\n]+/))),

    global_keyword:             $ => token('@global'),
    type_identifier:            $ => token(prec(1, /(InstrDef|Instr|Opcode|OpcodeDef|Complex|[aikbSfw])(\[\])*/)),
    type_identifier_legacy:     $ => token(prec(2, /g?[aikbSfw][a-zA-Z0-9_\[\]]*/)),
    number:                     $ => token(prec(10, choice(/\d+\.\d*([eE][+-]?\d+)?/, /\.\d+([eE][+-]?\d+)?/, /\d+[eE][+-]?\d+/, /\d+/, /0[xX][0-9a-fA-F]+/))),
    string:                     $ => seq('"', repeat(choice(/[^"\\\n]+/, /\\./)), '"'),
    boolean_var:                $ => choice($.kw_true, $.kw_false),
    tag_synthesizer_start:      $ => token(prec(10, /<CsoundSynthesi[sz]er>/)),
    tag_synthesizer_end:        $ => token(prec(10, /<\/CsoundSynthesi[sz]er>/)),
    tag_options_start:          $ => token(prec(10, /<CsOptions>/)),
    tag_options_end:            $ => token(prec(10, /<\/CsOptions>/)),
    tag_instruments_start:      $ => token(prec(10, /<CsInstruments>/)),
    tag_instruments_end:        $ => token(prec(10, /<\/CsInstruments>/)),
    tag_score_start:            $ => token(prec(10, /<CsScore>/)),
    tag_score_start_python:     $ => token(prec(10, /<CsScore(\s+bin="python[^>]*)?>/)),
    tag_score_start_csbeats:    $ => token(prec(10, /<CsScore\s+bin="csbeats">/)),
    tag_score_end:              $ => token(prec(10, /<\/CsScore>/)),
    tag_cabbage_start:          $ => token(prec(10, /<Cabbage>/)),
    tag_cabbage_end:            $ => token(prec(10, /<\/Cabbage>/)),
    tag_csfileb_start:          $ => token(prec(10, /<CsFileB(\s+[^>]*)?>/)),
    tag_csfileb_end:            $ => token(prec(10, /<\/CsFileB>/)),
    tag_csmidifileb:            $ => token(prec(10, /<CsMidifileB(\s+[^>]*)?>/)),
    tag_cssamplefileb:          $ => token(prec(10, /<CsSampleB(\s+[^>]*)?>/)),
    tag_csfile_start:           $ => token(prec(10, /<CsFile(\s+[^>]*)?>/)),
    tag_csfile_end:             $ => token(prec(10, /<\/CsFile>/)),
    tag_licence_start:          $ => token(prec(10, /<CsLicen[cs]e(\s+[^>]*)?>/)),
    tag_licence_end:            $ => token(prec(10, /<\/CsLicen[cs]e>/)),
    tag_short_licence_start:    $ => token(prec(10, /<CsShortLicen[cs]e(\s+[^>]*)?>/)),
    tag_short_licence_end:      $ => token(prec(10, /<\/CsShortLicen[cs]e>/)),
    tag_html_start:             $ => token(prec(10, /<html(\s+[^>]*)?>/)),
    tag_html_end:               $ => token(prec(10, /<\/html>/)),
    generic_closing_tag:        $ => token(prec(1, /(<\/[^>]+>)/)),

    raw_script:                 $ => token(prec(1, choice(/[^<]+/, seq('<', /[^\/C]/)))),
    raw_text:                   $ => choice(/[^}]+/, seq('}', /[^}]/)),

    _new_line:                  $ => token(/\r?\n/),
    _whitespace:                $ => /\s+/,
    _line_continuation:         $ => token(prec(1, seq('\\', /\s*\r?\n/))),



    // --- END KEYWORDS ---

  }
});

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

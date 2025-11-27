/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'csound',

  extras: $ => [/\s/, $.comment, $.block_comment],

  conflicts: $ => [
    [$._root_statement, $._score_item],
    [$.opcode_statement, $._lvalue],
    [$.opcode_statement, $.opcode_name],
    [$.opcode_statement],
    [$.cabbage_statement],
    [$.macro_usage],
    [$.argument_list, $.parenthesized_expression],
    [$.xout_statement],
    [$.opcode_statement, $.struct_definition],
    [$.opcode_statement, $._expression],
    [$.opcode_statement, $.header_assignment],
    [$.label_statement, $.typed_assignment_statement],
    [$.assignment_statement, $.label_statement],
    [$.function_call, $.opcode_statement],
    [$.opcode_statement, $.assignment_statement],
    [$.xin_statement, $.assignment_statement],
    [$.xout_statement, $.header_assignment]
  ],

  rules: {
    source_file: $ => seq(
      optional($.cabbage_block),
      choice($.csd_file, $.orchestra_body, $.score_body)
    ),

    // --- CSD ---
    csd_file: $ => seq($.tag_synthesizer_start, repeat($.csd_element), $.tag_synthesizer_end),
    csd_element: $ => choice($.options_block, $.instruments_block, $.score_block, $.cabbage_block, $.html_block, $.generic_tag_block),

    tag_synthesizer_start: $ => /<CsoundSynthesi[sz]er>/,
    tag_synthesizer_end: $ => /<\/CsoundSynthesi[sz]er>/,
    tag_options_start: $ => /<CsOptions>/,
    tag_options_end: $ => /<\/CsOptions>/,
    tag_instruments_start: $ => /<CsInstruments>/,
    tag_instruments_end: $ => /<\/CsInstruments>/,
    tag_score_start: $ => /<CsScore>/,
    tag_score_end: $ => /<\/CsScore>/,
    tag_cabbage_start: $ => /<Cabbage>/,
    tag_cabbage_end: $ => /<\/Cabbage>/,

    options_block: $ => seq($.tag_options_start, repeat($._text_content), $.tag_options_end),
    instruments_block: $ => seq($.tag_instruments_start, optional($.orchestra_body), $.tag_instruments_end),
    score_block: $ => seq($.tag_score_start, optional($.score_body), $.tag_score_end),
    cabbage_block: $ => seq($.tag_cabbage_start, repeat($.cabbage_statement), $.tag_cabbage_end),

    html_block: $ => seq(
      /<html>/,
      repeat(/.|\s/),
      /<\/html>/
    ),

    generic_tag_block: $ => seq(/<[a-zA-Z0-9]+>/, repeat(choice($._text_content, $.generic_tag_block)), /<\/[a-zA-Z0-9]+>/),
    _text_content: $ => /[^<]+/,

    // --- ORCHESTRA ---
    orchestra_body: $ => repeat1($._root_statement),
    _root_statement: $ => choice(
      $.preprocessor_directive,
      $.instrument_definition,
      $.udo_definition,
      $.struct_definition, // STRUCT
      $._statement
    ),

    instrument_definition: $ => seq(
      'instr',
      field('name', sep1(choice($.identifier, $.number, $.plus_identifier), ',')),
      repeat($._statement),
      'endin'
    ),

    // --- UDO DEFINITIONS ---
    udo_definition: $ => choice(
      $.udo_definition_legacy,
      $.udo_definition_modern
    ),

    udo_definition_legacy: $ => seq(
      'opcode',
      field('name', $.opcode_name),
      optional(','),
      field('outputs', $.legacy_udo_output_types),
      ',',
      field('inputs', $.legacy_udo_input_types),
      repeat($._statement),
      'endop'
    ),

    udo_definition_modern: $ => seq(
      'opcode',
      field('name', $.opcode_name),
      field('inputs', $.modern_udo_inputs),
      optional(seq(
        ':',
        field('outputs', $.modern_udo_outputs)
      )),
      repeat($._statement),
      'endop'
    ),

    legacy_udo_input_types: $ => token(prec(5, /[afijkopOPVJKS0]+(\[\])*/)),
    legacy_udo_output_types: $ => token(prec(5, /[afijkKS0]+(\[\])*/)),

    modern_udo_inputs: $ => seq(
      '(',
      optional(sep1(choice($.typed_identifier, $.identifier), ',')),
      ')'
    ),

    modern_udo_outputs: $ => choice(
      seq('(', optional(sep1(choice($.type_identifier, $.identifier), ',')), ')'),
      'void',
      $.type_identifier
    ),

    // --- STRUCT DEFINITION (Csound 7) ---
    struct_definition: $ => prec(2, seq(
        'struct',
        field('name', $.struct_name),
        field('fields', sep1($.typed_identifier, ','))
      )
    ),

    struct_name: $ => token(prec(5, /[a-zA-Z0-9_]+/)),

    // --- STATEMENTS ---
    _statement: $ => choice(
      $.header_assignment,
      $.typed_assignment_statement,
      $.assignment_statement,
      $.xin_statement,
      $.xout_statement,
      $.function_call,
      $.opcode_statement,
      $.control_statement,
      $.label_statement
    ),

   case_statement: $ => choice(
      $.header_assignment,
      $.typed_assignment_statement,
      $.assignment_statement,
      $.xin_statement,
      $.xout_statement,
      $.function_call,
      $.opcode_statement,
      $.control_statement,
      $.label_statement
    ),

    xin_statement: $ => seq(
      field('outputs', sep1($._lvalue, ',')),
      'xin'
    ),

    xout_statement: $ => seq(
      'xout',
      field('inputs', optional($.argument_list))
    ),

    header_assignment: $ => seq($.header_identifier, '=', $._expression),
    header_identifier: $ => choice('sr', 'kr', 'ksmps', 'nchnls', 'nchnls_i', '0dbfs'),

    typed_assignment_statement: $ => prec(2, seq(
      field('left', sep1(choice($.typed_identifier, $.global_typed_identifier), ',')),
      field('operator', choice('=', 'init', 'tival', 'divz', '+=', '-=', '*=', '/=', '##addin', '##subin', '##mulin', '##divin')),
      field('right', $._expression)
    )),

    assignment_statement: $ => seq(
      field('left', sep1($._lvalue, ',')),
      field('operator', choice('=', 'init', 'tival', 'divz', '+=', '-=', '*=', '/=', '##addin', '##subin', '##mulin', '##divin')),
      field('right', $._expression)
    ),

    _lvalue: $ => choice(
      $.typed_identifier,
      $.global_typed_identifier,
      $.array_access,
      $.struct_access,
      $.identifier
    ),

    opcode_statement: $ => seq(
      field('outputs', optional(seq(sep1($.identifier, ',')))),
      field('op', $.opcode_name),
      field('inputs', optional($.argument_list))
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

    if_statement: $ => seq(
      choice('if', 'if', 'tif'),
      field('condition', $._expression),
      choice(seq('goto', $.identifier),
        seq(choice('then', 'ithen', 'kthen'),
          repeat($._statement),
          optional($.elseif_block),
          optional($.else_block),
          choice('endif', 'fi')
        )
      )
    ),

    elseif_block: $ => repeat1(
      seq('elseif', $._expression, 'then', repeat($._statement)
      )
    ),

    else_block: $ => seq(
      'else',
      repeat($._statement)
    ),

    while_loop: $ => seq(
      'while',
      $._expression,
      'do',
      repeat($._statement),
      'od'
    ),

    until_loop: $ => seq(
      'until',
      $._expression,
      'do',
      repeat($._statement),
      'od'
    ),

    for_loop: $ => seq(
      'for',
      $.identifier,
      'in',
      $._expression,
      'do',
      repeat($._statement),
      'od'
    ),

    switch_start: $ => prec(1, token('switch')),
    switch_end: $ => prec(1, token('endsw')),
    case_key: $ =>  prec(1, token('case')),
    default_key: $ =>  prec(1, token('default')),

    switch_statement: $ => seq(
      $.switch_start,
      $._expression,
      repeat($.case_block),
      optional($.default_block),
      $.switch_end
    ),

    case_block: $ => seq(
      $.case_key,
      $._expression,
      repeat($.case_statement)
    ),

    default_block: $ => seq(
      $.default_key,
      repeat($.case_statement)
    ),

    goto_statement: $ => seq(choice('goto', 'kgoto', 'igoto'), $.identifier),
    return_statement: $ => choice('return', 'rireturn'),

    label_statement: $ => prec(-1, seq($.identifier, ':')),

    // --- EXPRESSIONS ---
    _expression: $ => choice(
      $.function_call,
      $.unary_expression, $.binary_expression, $.ternary_expression, $.parenthesized_expression,
      $.header_identifier,
      $.number, $.string, $.identifier, $.array_access, $.struct_access, $.macro_usage
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    function_call: $ => prec(2, seq(field('function', $.opcode_name), '(', optional($.argument_list), ')')),

    argument_list: $ => sep1($._expression, ','),
    unary_expression: $ => prec.left(10, seq(choice('-', '~', '!'), $._expression)),
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
    ternary_expression: $ => prec.right(seq($._expression, '?', $._expression, ':', $._expression)),
    array_access: $ => seq(field('array', choice($.identifier, $.array_access)), '[', $._expression, ']'),

    // STRUCT ACCESS (obj.prop)
    struct_access: $ => prec(10, seq(
      field('object', choice($.identifier, $.struct_access, $.array_access)),
      '.',
      field('member', $.identifier)
    )),

    score_body: $ => repeat1($._score_item),
    _score_item: $ => choice($.preprocessor_directive, $.score_statement, $.score_loop, $.score_carry),
    score_statement: $ => seq(field('opcode', /[a-zA-Z]/), repeat(choice($.number, $.string, $.macro_usage, $.identifier))),
    score_carry: $ => '.',
    score_loop: $ => seq('{', field('count', $.number), field('macro_name', $.identifier), repeat(choice($.score_statement, $.score_carry)), '}'),

    cabbage_statement: $ => seq(field('widget', $.identifier), repeat($.cabbage_property)),
    cabbage_property: $ => seq(field('key', $.identifier), '(', field('value', /[^)]*/), ')'),

    preprocessor_directive: $ => choice($.macro_define, $.include_directive, $.undef_directive, $.ifdef_directive),
    macro_define: $ => seq('#define', $.identifier, '#', repeat(choice(/[^#]/, '\\#')), '#'),
    include_directive: $ => seq('#include', $.string),
    undef_directive: $ => seq('#undef', $.identifier),
    ifdef_directive: $ => seq(choice('#ifdef', '#ifndef'), $.identifier, repeat($._statement), optional(seq('#else', repeat($._statement))), '#end'),
    macro_usage: $ => seq('$', $.identifier, optional('.'), optional(seq('(', sep1(choice($.number, $.string, $.identifier), "'"), ')'))),

    // --- PRIMITIVES ---
    identifier: $ => /[a-zA-Z_]\w*/,
    plus_identifier: $ => /\+[a-zA-Z_]\w*/,

    typed_identifier: $ => prec(2, seq(
      field('name', $.identifier),
      ':',
      field('type', choice($.type_identifier, $.identifier))
    )),

    global_typed_identifier: $ => prec(2, seq(
      field('name', $.identifier),
      $.global_keyword,
      ':',
      field('type', choice($.type_identifier, $.identifier))
    )),

    global_keyword: $ => '@global',
    opcode_name: $ => alias($.identifier, 'opcode_name'),

    type_identifier: $ => alias(token(prec(5, /(InstrDef|Instr|Opcode|Complex|[aikSfw])(\[\])*/)), 'type_identifier'),

    number: $ => choice(/\d+/, /0[xX][0-9a-fA-F]+/, /\d+\.\d+([eE][+-]?\d+)?/, /\d+[eE][+-]?\d+/),
    string: $ => seq('"', repeat(choice(/[^"\\\n]+/, /\\./)), '"'),
    comment: $ => choice(seq(';', /.*/), seq('//', /.*/)),
    block_comment: $ => seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')
  }
});

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

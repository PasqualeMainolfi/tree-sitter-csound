/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
    name: 'csound',
    word: $ => $.type_identifier_legacy,
    extras: $ => [/\s/, $.comment, $.block_comment],

    conflicts: $ => [
        [$._root_statement, $._score_item],
        [$._root_statement, $._statement],
        [$.opcode_statement, $.typed_assignment_statement],
        [$.argument_list, $.parenthesized_expression],
        [$.parenthesized_expression, $.argument_list],
        [$.legacy_typed_assignment_statement, $.opcode_statement],
        [$.xin_statement, $.opcode_statement, $.legacy_typed_assignment_statement],
        [$.xout_statement, $._expression],
        [$.array_access, $.opcode_name],
        [$.if_statement],
        [$.cabbage_statement],
        [$.opcode_statement],
        [$.macro_usage],
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

        kw_instr: $ => token(prec(5, 'instr')),
        kw_endin: $ => token(prec(5, 'endin')),
        kw_struct: $ => token(prec(5, 'struct')),
        kw_opcode: $ => token(prec(5, 'opcode')),
        kw_endop: $ => token(prec(5, 'endop')),

        instrument_definition: $ => seq(
            $.kw_instr,
            field('name', sep1(choice(
                $.identifier,
                $.number,
                $.plus_identifier
            ), ','
            )),
            repeat($._statement),
            $.kw_endin
        ),

        kw_open_code_block: $ => token('{{'),
        kw_close_code_block: $ => token('}}'),

        internal_code_block: $ => seq(
            $.kw_open_code_block,
            repeat($._statement),
            $.kw_close_code_block
        ),

        // --- UDO DEFINITIONS ---
        udo_definition: $ => choice(
            $.udo_definition_legacy,
            $.udo_definition_modern
        ),

        udo_definition_legacy: $ => seq(
            $.kw_opcode,
            field('name', $.opcode_name),
            optional(','),
            field('outputs', $.legacy_udo_args),
            ',',
            field('inputs', $.legacy_udo_args),
            optional($.xin_statement),
            repeat($._statement),
            optional($.xout_statement),
            $.kw_endop
        ),

        udo_definition_modern: $ => seq(
            $.kw_opcode,
            field('name', $.opcode_name),
            field('inputs', $.modern_udo_inputs),
            ':',
            field('outputs', $.modern_udo_outputs),
            repeat($._statement),
            optional($.xout_statement),
            $.kw_endop
        ),

        legacy_udo_args: $ => token(/[a-zA-Z0-9_\[\]]+/),
        kw_void: $ => token(prec(5, 'void')),

        modern_udo_inputs: $ => seq(
            '(',
            optional(sep1(choice($.typed_identifier, $.identifier), ',')),
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

        // --- STRUCT DEFINITION (Csound 7) ---
        struct_definition: $ => prec(5, seq(
            $.kw_struct,
            field('name', $.struct_name),
            field('fields', sep1($.typed_identifier, ','))
        )
        ),

        // STRUCT ACCESS (obj.prop)
        struct_access: $ => prec(10, seq(
            field('called_struct', choice(
                $.identifier,
                $.struct_access,
                $.array_access,
                $.type_identifier_legacy
            )),
            '.',
            field('member', $.identifier)
        )),

        struct_name: $ => token(prec(5, /[a-zA-Z0-9_]+/)),

        // --- STATEMENTS ---
        _statement: $ => choice(
            $.header_assignment,
            $.typed_assignment_statement,
            $.assignment_statement,
            $.legacy_typed_assignment_statement,
            $.function_call,
            $.opcode_statement,
            $.control_statement,
            $.label_statement,
            $.struct_definition,
            $.internal_code_block
        ),

        kw_xin: $ => token('xin'),
        xin_statement: $ => seq(
            field('outputs', sep1($.type_identifier_legacy, ',')),
            $.kw_xin
        ),

        kw_xout: $ => token('xout'),
        xout_statement: $ => choice(
            seq(
                $.kw_xout,
                field('inputs', $.parenthesized_expression),
            ),
            seq(
                $.kw_xout,
                field('inputs', $.argument_list),
            )
        ),

        header_assignment: $ => seq($.header_identifier, '=', $._expression),
        header_identifier: $ => token(prec(10, /(sr|kr|ksmps|nchnls|nchnls_i|0dbfs)/)),

        typed_assignment_statement: $ => prec(2, seq(
            field('left', sep1(choice($.typed_identifier, $.global_typed_identifier), ',')),
            field('operator', choice('=', '+=', '-=', '*=', '/=', '##addin', '##subin', '##mulin', '##divin')),
            field('right', $._expression)
        )),

        assignment_statement: $ => seq(
            field('left', sep1($._lvalue, ',')),
            field('operator', choice('=', '+=', '-=', '*=', '/=', '##addin', '##subin', '##mulin', '##divin')),
            field('right', $._expression)
        ),

        legacy_typed_assignment_statement: $ => prec(3, seq(
            field('left', sep1($.type_identifier_legacy, ',')),
            field('operator', choice('=', '+=', '-=', '*=', '/=', '##addin', '##subin', '##mulin', '##divin')),
            field('right', $._expression)
        )),

        _lvalue: $ => choice(
            $.typed_identifier,
            $.global_typed_identifier,
            $.array_access,
            $.struct_access,
            $.identifier
        ),

        opcode_statement: $ => choice(
            prec(2, seq(
                field('outputs', sep1(
                    choice(
                        $.typed_identifier,
                        $.type_identifier_legacy
                    ),
                    ','
                )),
                field('op', $.opcode_name),
                field('inputs', optional($.argument_list))
            )),
            prec(1, seq(
                field('op', $.opcode_name),
                field('inputs', optional($.argument_list))
            ))
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

        kw_if: $ => token(prec(5, 'if')),
        kw_tif: $ => token(prec(5, 'tif')),
        kw_endif: $ => token(prec(5, 'endif')),
        kw_fi: $ => token(prec(5, 'fi')),
        kw_then: $ => token(prec(5, 'then')),
        kw_ithen: $ => token(prec(5, 'ithen')),
        kw_kthen: $ => token(prec(5, 'kthen')),
        kw_elseif: $ => token(prec(5, 'elseif')),
        kw_else: $ => token(prec(5, 'else')),
        kw_while: $ => token(prec(5, 'while')),
        kw_until: $ => token(prec(5, 'until')),
        kw_do: $ => token(prec(5, 'do')),
        kw_od: $ => token(prec(5, 'od')),
        kw_for: $ => token(prec(5, 'for')),
        kw_in: $ => token(prec(5, 'in')),

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
            $.identifier
        ),

        return_statement: $ => choice(
            $.kw_return,
            $.kw_rireturn
        ),

        elseif_block: $ => repeat1(
            seq(
                $.kw_elseif,
                $._expression,
                $.kw_then,
                repeat($._statement)
            )
        ),

        else_block: $ => seq(
            $.kw_else,
            repeat($._statement)
        ),

        if_statement: $ => seq(
            choice($.kw_if, $.kw_tif),
            field('condition', $._expression),
            choice(
                seq(
                    choice(
                        $.kw_then,
                        $.kw_ithen,
                        $.kw_kthen
                    ),
                    field('then_block', repeat($._statement)),
                    optional($.elseif_block),
                    optional($.else_block),
                    $.endif_block
                ),
                seq(
                    field('then_goto', $.goto_statement),
                    optional(field('else_goto', repeat($.goto_statement))),
                    optional($.return_statement)
                )
            )
        ),

        while_loop: $ => seq(
            $.kw_while,
            $._expression,
            $.kw_do,
            repeat($._statement),
            $.kw_od
        ),

        until_loop: $ => seq(
            $.kw_until,
            $._expression,
            $.kw_do,
            repeat($._statement),
            $.kw_od
        ),

        for_loop: $ => seq(
            $.kw_for,
            $.identifier,
            $.kw_in,
            $._expression,
            $.kw_do,
            repeat($._statement),
            $.kw_od
        ),

        kw_switch_start: $ => prec(5, token('switch')),
        kw_switch_end: $ => prec(5, token('endsw')),
        kw_case_key: $ => prec(5, token('case')),
        kw_default_key: $ => prec(5, token('default')),

        case_header: $ => seq(
            $.kw_case_key,
            $._expression,
        ),

        default_header: $ => $.kw_default_key,

        switch_statement: $ => seq(
            $.kw_switch_start,
            $._expression,
            repeat($.case_block),
            optional($.default_block),
            $.kw_switch_end
        ),

        case_block: $ => prec.left(1, seq(
            field('case_header', $.case_header),
            field('case_body', repeat($._statement))
        )),

        default_block: $ => prec.left(1, seq(
            field('default_header', $.default_header),
            field('default_body', repeat($._statement))
        )),


        kw_goto: $ => token(prec(5, 'goto')),
        kw_kgoto: $ => token(prec(5, 'kgoto')),
        kw_igoto: $ => token(prec(5, 'igoto')),
        kw_return: $ => token(prec(5, 'return')),
        kw_rireturn: $ => token(prec(5, 'rireturn')),

        // --- EXPRESSIONS ---
        _expression: $ => choice(
            $.function_call,
            $.unary_expression,
            $.binary_expression,
            $.ternary_expression,
            $.parenthesized_expression,
            $.header_identifier,
            $.number,
            $.string,
            alias(choice(
                    $.identifier,
                    $.type_identifier_legacy
                ),
                $.identifier
            ),
            $.array_access,
            $.struct_access,
            $.macro_usage,
            $.array_data,
            $.internal_code_block
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

        function_call: $ => prec(2,
            seq(
                field('function', $.opcode_name),
                '(',
                optional($.argument_list),
                ')'
            )),

        argument_list: $ => seq(
            $._expression,
            repeat(seq(',', $._expression))
        ),

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

        label_statement: $ => token(/[a-zA-Z_]\w*:/),

        typed_identifier: $ => prec(3, seq(
            field('name', alias(choice($.identifier, $.type_identifier_legacy), $.identifier)),
            ':',
            field('type', choice($.type_identifier, $.identifier))
        )),

        global_typed_identifier: $ => prec(2, seq(
            field('name', alias(choice($.identifier, $.type_identifier_legacy), $.identifier)),
            $.global_keyword,
            ':',
            field('type', choice($.type_identifier, $.identifier))
        )),

        global_keyword: $ => token('@global'),

        opcode_name: $ => alias(choice($.type_identifier_legacy, $.identifier), 'opcode_name'),

        type_identifier: $ => token(prec(1, /(InstrDef|Instr|Opcode|Complex|[aikbSfw])(\[\])*/)),
        type_identifier_legacy: $ => token(prec(1, /g?[aikbSfw][a-zA-Z0-9_\[\]]*/)),

        number: $ => choice(/\d+/, /0[xX][0-9a-fA-F]+/, /\d+\.\d+([eE][+-]?\d+)?/, /\d+[eE][+-]?\d+/),
        string: $ => seq('"', repeat(choice(/[^"\\\n]+/, /\\./)), '"'),
        comment: $ => token(
            choice(
                seq(';', /[^\n]*/),
                seq('//', /[^\n]*/)
            )
        ),
        block_comment: $ => seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')
    }
});

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

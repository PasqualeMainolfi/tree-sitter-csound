/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
    name: 'csound',
    word: $ => $.type_identifier_legacy,
    extras: $ => [/\s/, $.comment, $.block_comment],
    conflicts: $ => [
      [$.xin_statement, $.opcode_statement, $.legacy_typed_assignment_statement],
      [$.legacy_typed_assignment_statement, $.opcode_statement],
      [$.cs_legacy_file, $._orchestra_statement, $.score_file],
      [$.opcode_statement, $.typed_assignment_statement],
      [$.argument_list, $.parenthesized_expression],
      [$.cs_legacy_file, $._orchestra_statement],
      [$.xout_statement, $._expression],
      [$.cs_legacy_file, $.score_file],
      [$.array_access, $.opcode_name],
      [$._score_statement_func],
      [$.cabbage_statement],
      [$.opcode_statement],
      [$.if_statement],
      [$.macro_usage]
    ],

    rules: {

      // --- GENERAL SECTION ---

      source_file: $ => choice(
        $.cs_legacy_file,
        $.csd_file
      ),

      cs_legacy_file: $ => seq(
        alias(repeat(
          choice(
            $.preprocessor_directive,
            $._statement
          )
        ), 'cs_legacy_common_instructions'),
        choice(
          alias($.orchestra_file, 'cs_orchestra_udo'),
          alias($.score_file, 'cs_score'),
        ),
      ),

      _statement: $ => choice(
        $.typed_assignment_statement,
        $.assignment_statement,
        $.legacy_typed_assignment_statement,
        $.function_call,
        $.opcode_statement,
        $.label_statement,
        $.control_statement,
        $.struct_definition
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
        $.internal_code_block,
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
              $.type_identifier_legacy
          ),
          $.identifier
        ),
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
        $.return_statement
      ),

      _orchestra_statement: $ => choice(
        $.header_assignment,
        $.instrument_definition,
        $.preprocessor_directive,
        $.udo_definition,
        $._statement
      ),

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

      include_directive: $ => seq(
        choice(
          $.kw_include,
          $.kw_includestr
        ),
        $.string
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

      macro_define: $ => seq(
        $.kw_define,
        field('macro_name', $.macro_name),
        '#',
        field('macro_values', $.macro_value),
        '#'
      ),

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
        $.tag_synthesizer_start,
        repeat($.csd_element),
        $.tag_synthesizer_end,
        optional($._whitespace)
      ),

      csd_element: $ => choice(
        $.cabbage_block,
        $.optional_tag_block,
        $.options_block,
        $.instruments_block,
        $.score_block
      ),

      // --- END GENERAL SECTION ---

      // --- CABBAGE SECTION ---

      cabbage_statement: $ => seq(
        field('widget', $.identifier),
        repeat($.cabbage_property)
      ),

      cabbage_property: $ => seq(
        field('key', $.identifier),
        '(',
        field('value', /[^)]*/),
        ')'
      ),

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
        field('flag_type', choice(
          $.identifier,
          $.number,
          $.string
        )),
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
        optional($._new_line),
        $.tag_options_end,
        $._new_line
      ),

      // --- END OPTIONS BLOCK ---

      // --- ORCHESTRA BLOCK ---

      instruments_block: $ => seq(
        $.tag_instruments_start,
        optional($.orchestra_file),
        $.tag_instruments_end,
        $._new_line
      ),

      cabbage_block: $ => seq(
        $.tag_cabbage_start,
        repeat($.cabbage_statement),
        $.tag_cabbage_end,
        $._new_line
      ),

      orchestra_file: $ => repeat1(
        $._orchestra_statement
      ),

      header_assignment: $ => seq(
        $.header_identifier,
        '=',
        $._expression
      ),

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

      internal_code_block: $ => seq(
        $.kw_open_code_block,
        repeat($.raw_code_script),
        $.kw_close_code_block
      ),

      udo_definition: $ => choice(
        $.udo_definition_legacy,
        $.udo_definition_modern
      ),

      udo_definition_legacy: $ => seq(
        $.kw_opcode,
        field('name', $.opcode_name),
        ',',
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
        $.kw_struct,
        field('struct_name', $.struct_name),
        field('struct_field', sep1($.typed_identifier, ','))
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

      typed_assignment_statement: $ => prec(2, seq(
        field('left', sep1(choice($.typed_identifier, $.global_typed_identifier), ',')),
        field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal)),
        field('right', $._expression)
      )),

      udo_typed_assignment_statement: $ => prec(2, seq(
        optional($._whitespace),
        field('left', sep1(choice($.typed_identifier, $.global_typed_identifier), ',')),
        field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal)),
        field('right', $._expression)
      )),

      assignment_statement: $ => seq(
        field('left', sep1($._lvalue, ',')),
        field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal)),
        field('right', $._expression)
      ),

      legacy_typed_assignment_statement: $ => prec(3, seq(
        field('left', sep1($.type_identifier_legacy, ',')),
        field('operator', choice('=', '+=', '-=', '*=', '/=', $.mod_equal)),
        field('right', $._expression)
      )),

      opcode_statement: $ => choice(
        prec.dynamic(0, prec(3, seq(
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
            field('op_macro', $.macro_usage)
          )
        ))),
        prec.dynamic(0, prec(2, seq(
          field('op', $.opcode_name),
          field('inputs', optional($.argument_list))
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
        $.label_statement
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
        field('iterator', $.identifier),
        $.kw_in,
        $._expression,
        $.kw_do,
        repeat($._statement),
        $.kw_od
      ),

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

      score_body: $ => repeat1(seq(
        $._score_item,
        $._new_line
      )),

      score_file: $ => seq(
        repeat($.preprocessor_directive),
        repeat1(seq(
          $._file_score_item,
          $._new_line
        ))
      ),

      _score_block: $ => seq(
        $.tag_score_start,
        optional(field('content', $.score_body)),
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
        $.score_statement
      ),

      _file_score_item: $ => choice(
        $.score_statement_func,
        $.score_nestable_loop,
        $.score_statement_instr,
        $.score_statement
      ),

      _score_expression: $ => choice(
        $.score_unary_expression,
        $.score_binary_expression,
        $.parenthesized_score_expression,
        $.score_operation,
        $.number,
        $.string,
        $.identifier,
        $.macro_usage,
        $.score_random_operator,
        $.score_carry,
        $.score_plus,
        $.score_plus_p,
        $.score_minus_p,
        $.score_exclamation,
        $.score_ramping,
        $.score_np,
        $.score_pp
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

      _score_statement_func: $ => seq(
        field('action_time', $._score_expression),
        field('n_points', $._score_expression),
        field('gen_id', $._score_expression),
        field('pfield', repeat($._score_expression)),
      ),

      _score_loop_body: $ => choice(
        $.score_carry,
        $.score_plus,
        $.score_nestable_loop
      ),

      score_statement: $ => seq(
        field('statement', $.score_statement_group),
        field('pfield', repeat($._score_expression)),
      ),

      score_nestable_loop: $ => seq(
        '{',
        field('count', $.number),
        field('macro_loop_name', $.identifier),
        field('score_loop_body', choice(
          $.score_statement_instr,
          $._score_loop_body
        )),
        '}',
      ),

      score_statement_instr: $ => seq(
        choice(
          seq(
            field('statement', $.score_statement_i),
            field('instr', choice($.number, $.string))
          ),
          field('statement_instr', $.instr_p1),
          field('statement_macro_instr', $.macro_usage),
        ),
        $._score_statement_instr,
      ),

      score_statement_func: $ => seq(
        choice(
          seq(
            field('statement', $.score_statement_f),
            field('table_number', $.number)
          ),
          field('statement_func', $.func_p1),
          field('statement_macro_func', $.macro_usage),
        ),
        choice(
          $._score_statement_func,
          field('action_time', $._score_expression)
        )
      ),

      // --- END SCORE SECTION ---

      // --- KEYWORDS ---

      kw_instr:                   $ => token(prec(5, 'instr')),
      kw_endin:                   $ => token(prec(5, 'endin')),
      kw_struct:                  $ => token(prec(5, 'struct')),
      kw_opcode:                  $ => token(prec(5, 'opcode')),
      kw_endop:                   $ => token(prec(5, 'endop')),
      kw_open_code_block:         $ => token('{{'),
      kw_close_code_block:        $ => token('}}'),
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
      kw_switch_start:            $ => token(prec(5, 'switch')),
      kw_switch_end:              $ => token(prec(5, 'endsw')),
      kw_case_key:                $ => token(prec(5, 'case')),
      kw_default_key:             $ => token(prec(5, 'default')),
      kw_goto:                    $ => token(prec(5, 'goto')),
      kw_kgoto:                   $ => token(prec(5, 'kgoto')),
      kw_igoto:                   $ => token(prec(5, 'igoto')),
      kw_return:                  $ => token(prec(5, 'return')),
      kw_rireturn:                $ => token(prec(5, 'rireturn')),
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
      struct_name:                $ => token(prec(5, /[a-zA-Z0-9_]+/)),
      header_identifier:          $ => token(prec(10, /(sr|kr|ksmps|nchnls|nchnls_i|0dbfs)/)),
      score_carry:                $ => token(prec(5, '.')),
      score_plus:                 $ => token(prec(5, '+')),
      score_plus_p_operator:      $ => token(prec(5, /\^\+/)),
      score_minus_p_operator:     $ => token(prec(5, /\^-/)),
      score_plus_p:               $ => seq($.score_plus_p_operator, $.number),
      score_minus_p:              $ => seq($.score_minus_p_operator, $.number),
      score_exclamation:          $ => token(prec(5, '!')),
      score_random_operator:      $ => token(prec(5, '~')),
      score_np_operator:          $ => token(prec(5, 'np')),
      score_pp_operator:          $ => token(prec(5, 'pp')),
      score_np:                   $ => seq($.score_np_operator, $.number),
      score_pp:                   $ => seq($.score_pp_operator, $.number),
      score_ramping:              $ => token('<'),
      identifier:                 $ => /[a-zA-Z_]\w*/,
      plus_identifier:            $ => /\+[a-zA-Z_]\w*/,
      mod_equal:                  $ => seq('%', '='),
      flag_identifier:            $ => token(prec(5, '-')),
      instr_p1:                   $ => token(prec(6, /i(?:\d+(?:\.\d+)?|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/)),
      func_p1:                    $ => token(prec(6, /f(?:\d+)/)),

      score_statement_group:      $ => token(prec(5, /[aqrtesxybBCvmn]/)),
      score_statement_i:          $ => token(prec(5, 'i')),
      score_statement_f:          $ => token(prec(5, 'f')),

      global_keyword:             $ => token('@global'),
      type_identifier:            $ => token(prec(1, /(InstrDef|Instr|Opcode|Complex|[aikbSfw])(\[\])*/)),
      type_identifier_legacy:     $ => token(prec(2, /g?[aikbSfw][a-zA-Z0-9_\[\]]*/)),
      number:                     $ => choice(/\d+/, /0[xX][0-9a-fA-F]+/, /\d+\.\d+([eE][+-]?\d+)?/, /\d+[eE][+-]?\d+/),
      string:                     $ => seq('"', repeat(choice(/[^"\\\n]+/, /\\./)), '"'),
      boolean_var:                $ => choice($.kw_true, $.kw_false),
      comment:                    $ => token(choice(seq(';', /[^\n]*/), seq('//', /[^\n]*/))),
      block_comment:              $ => seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
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

      raw_script:                 $ => choice(/[^<]+/, seq('<', /[^/]/)),
      raw_code_script:            $ => choice(/[^}]+/, seq('}', /[^}]/)),

      _new_line:                  $ => token(/\r?\n/),
      _whitespace:                $ => /\s+/,

      // --- END KEYWORDS ---

    }
});

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

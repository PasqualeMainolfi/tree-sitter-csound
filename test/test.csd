<Cabbage>
[
    {
        "//": "=================== FORM: Classic Subtractive Synth ===================",
        "type": "form",
        "caption": "Classic Subtractive Synth",
        "size": {"width": 632, "height": 350},
        "pluginId": "def1",
        "style": {"backgroundColor": "#181818fd"}
    },
    {
        "type": "groupBox",
        "id": "groupBox4",
        "bounds": {"left": 6, "top": 145, "width": 300, "height": 100},
        "//": "=================== GROUPBOX: Filter Envelope ===================",
        "label": {"text": "Filter Envelope"},
        "style": {
            "backgroundColor": "#292929fa",
            "borderColor": "#404040",
            "fontFamily": "Arial",
            "fontSize": 12,
            "fontColor": "#cccccc",
            "textAlign": "centre"
        },
        "channels": [{"range": {"defaultValue": 0, "increment": 0.001, "max": 1, "min": 0, "skew": 1}}]
    },
    {
        "type": "rotarySlider",
        "id": "filterAtt",
        "bounds": {"left": 13, "top": 166, "width": 68},
        "//": "------------------- ROTARYSLIDER: Filter Attack -------------------",
        "label": {"text": "Attack", "offsetY": -2},
        "valueText": {"visible": true},
        "channels": [{"id": "filterAtt", "range": {"defaultValue": 0.01, "min": 0.01}}],
        "style": {
            "thumb": {"backgroundColor": "#1E90FF", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "filterDec",
        "bounds": {"left": 87, "top": 166, "width": 68},
        "//": "------------------- ROTARYSLIDER: Filter Decay -------------------",
        "label": {"text": "Decay", "offsetY": -2},
        "valueText": {"visible": true},
        "channels": [{"id": "filterDec", "range": {"defaultValue": 0.5, "min": 0.01}}],
        "style": {
            "thumb": {"backgroundColor": "#1E90FF", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "filterSus",
        "bounds": {"left": 161, "top": 166, "width": 68},
        "//": "------------------- ROTARYSLIDER: Filter Sustain -------------------",
        "label": {"text": "Sustain", "offsetY": -2},
        "valueText": {"visible": true},
        "channels": [{"id": "filterSus", "range": {"defaultValue": 0.8, "min": 0.01}}],
        "style": {
            "thumb": {"backgroundColor": "#1E90FF", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "filterRel",
        "bounds": {"left": 235, "top": 166, "width": 68},
        "//": "------------------- ROTARYSLIDER: Filter Release -------------------",
        "label": {"text": "Release", "offsetY": -2},
        "valueText": {"visible": true},
        "channels": [{"id": "filterRel", "range": {"defaultValue": 0.8, "max": 5, "min": 0.01}}],
        "style": {
            "thumb": {"backgroundColor": "#1E90FF", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "groupBox",
        "id": "groupBox5",
        "bounds": {"left": 315, "top": 145, "width": 300, "height": 100},
        "//": "=================== GROUPBOX: Amplitude Envelope ===================",
        "label": {"text": "Amplitude Envelope"},
        "style": {
            "backgroundColor": "#292929fa",
            "borderColor": "#404040",
            "fontFamily": "Arial",
            "fontSize": 12,
            "fontColor": "#cccccc",
            "textAlign": "centre"
        },
        "channels": [{"range": {"defaultValue": 0, "increment": 0.001, "max": 1, "min": 0, "skew": 1}}]
    },
    {
        "type": "rotarySlider",
        "id": "ampAtt",
        "bounds": {"left": 330, "top": 166, "width": 68},
        "//": "------------------- ROTARYSLIDER: Amplitude Attack -------------------",
        "label": {"text": "Attack", "offsetY": -2},
        "valueText": {"visible": true},
        "channels": [{"id": "amplitudeAtt", "range": {"defaultValue": 0.01, "min": 0.01}}],
        "style": {
            "thumb": {"backgroundColor": "#A55EEA", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "amplitudeDec",
        "bounds": {"left": 400, "top": 166, "width": 68},
        "//": "------------------- ROTARYSLIDER: Amplitude Decay -------------------",
        "label": {"text": "Decay", "offsetY": -2},
        "valueText": {"visible": true},
        "channels": [{"id": "amplitudeDec", "range": {"defaultValue": 0.2, "min": 0.01}}],
        "style": {
            "thumb": {"backgroundColor": "#A55EEA", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "amplitudeSus",
        "bounds": {"left": 470, "top": 166, "width": 68},
        "//": "------------------- ROTARYSLIDER: Amplitude Sustain -------------------",
        "label": {"text": "Sustain", "offsetY": -2},
        "valueText": {"visible": true},
        "channels": [{"id": "amplitudeSus", "range": {"defaultValue": 0.8, "min": 0.01}}],
        "style": {
            "thumb": {"backgroundColor": "#A55EEA", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "amplitudeRel",
        "bounds": {"left": 540, "top": 166, "width": 68},
        "//": "------------------- ROTARYSLIDER: Amplitude Release -------------------",
        "label": {"text": "Release", "offsetY": -2},
        "valueText": {"visible": true},
        "channels": [{"id": "amplitudeRel", "range": {"defaultValue": 0.8, "max": 5, "min": 0.01}}],
        "style": {
            "thumb": {"backgroundColor": "#A55EEA", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "keyboard",
        "id": "keyboard25",
        "bounds": {"left": 5, "top": 257, "width": 610, "height": 75},
        "baseOctave": 2,
        "//": "=================== KEYBOARD: 25-Key ===================",
        "style": {"arrowBackgroundColor": "#00ABD1"},
        "channels": [{"range": {"defaultValue": 0, "increment": 0.001, "max": 1, "min": 0, "skew": 1}}]
    },
    {
        "type": "groupBox",
        "id": "groupBox4_copy_1",
        "bounds": {"left": 8, "top": 18, "width": 282, "height": 120},
        "//": "=================== GROUPBOX: Super Saw ===================",
        "style": {
            "borderColor": "#404040",
            "backgroundColor": "#292929fa",
            "fontFamily": "Arial",
            "fontSize": 12,
            "fontColor": "#cccccc"
        },
        "label": {"text": "Super Saw", "align": "centre"},
        "zIndex": -1,
        "channels": [{"range": {"defaultValue": 0, "increment": 0.001, "max": 1, "min": 0, "skew": 1}}]
    },
    {
        "type": "rotarySlider",
        "id": "detune",
        "bounds": {"left": 15, "top": 45, "width": 65, "height": 74},
        "//": "------------------- ROTARYSLIDER: Detune -------------------",
        "channels": [
            {"id": "detune", "range": {"defaultValue": 0.00001, "increment": 0.00001, "max": 0.1, "min": 0.00001}}
        ],
        "label": {"text": "Detune", "offsetY": -2},
        "valueText": {"visible": true},
        "style": {
            "thumb": {"backgroundColor": "#ffa71e", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "dutySlider",
        "bounds": {"left": 214, "top": 45, "width": 65, "height": 74},
        "//": "------------------- ROTARYSLIDER: Duty Cycle -------------------",
        "channels": [{"id": "oscDutyCycle", "range": {"defaultValue": 0.5, "min": 0.5}}],
        "label": {"text": "Duty Cycle", "offsetY": -2},
        "valueText": {"visible": true},
        "style": {
            "thumb": {"backgroundColor": "#ffa91e2d", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb39"},
            "valueText": {"fontFamily": "Arial", "fontColor": "#bbbbbb39"}
        }
    },
    {
        "type": "button",
        "id": "oscSawtooth",
        "bounds": {"left": 83, "top": 69, "width": 30},
        "//": "------------------- BUTTON: Osc Sawtooth -------------------",
        "channels": [{"id": "oscSawtooth", "range": {"defaultValue": 1}}],
        "radioGroup": "waveformRadio",
        "style": {
            "on": {"backgroundColor": "#ffa71e"},
            "off": {"backgroundColor": "#ffa71e14"},
            "hover": {"backgroundColor": "#fbfbfb2e"},
            "active": {"backgroundColor": "#ffa71e"}
        },
        "label": {"text": {"on": "", "off": ""}},
        "svg": {
            "markup": "<svg width=\"39\" height=\"28\" viewBox=\"0 0 39 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M27.0766 19.6261L37.4187 0.86765L39 2.70334L25.0525 28V7.97664L13.4138 27.8021V7.91067L1.526 27.716L0 25.7857L15.4379 0.0659701V19.824L27.0766 0V19.6261Z\" fill=\"white\"/> </svg>",
            "padding": {"left": 3, "right": 6, "top": 6, "bottom": 6}
        },
        "value": 1
    },
    {
        "type": "button",
        "id": "oscSquare",
        "bounds": {"left": 117, "top": 69, "width": 28},
        "//": "------------------- BUTTON: Osc Square -------------------",
        "channels": [{"id": "oscSquare", "range": {}}],
        "style": {
            "on": {"backgroundColor": "#ffa71e"},
            "off": {"backgroundColor": "#ffa71e14"},
            "hover": {"backgroundColor": "#fbfbfb2e"},
            "active": {"backgroundColor": "#ffa71e"}
        },
        "label": {"text": {"on": "", "off": ""}},
        "radioGroup": "waveformRadio",
        "svg": {
            "markup": "<svg width=\"49\" height=\"27\" viewBox=\"0 0 49 27\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M19 0V24.5H33V0H48.5V25.5H46.5V2H35V26.5H18V26H17V2H2V26H0V0H19Z\" fill=\"white\"/> </svg>",
            "padding": {"left": 3, "right": 6}
        }
    },
    {
        "type": "button",
        "id": "oscPulse",
        "bounds": {"left": 149, "top": 69, "width": 30},
        "//": "------------------- BUTTON: Osc Pulse -------------------",
        "channels": [{"id": "oscPulse", "range": {}}],
        "radioGroup": "waveformRadio",
        "style": {
            "on": {"backgroundColor": "#ffa71e"},
            "off": {"backgroundColor": "#ffa71e14"},
            "hover": {"backgroundColor": "#fbfbfb2e"},
            "active": {"backgroundColor": "#ffa71e"}
        },
        "label": {"text": {"on": "", "off": ""}},
        "svg": {
            "markup": "<svg width=\"34\" height=\"30\" viewBox=\"0 0 34 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M16.9847 0.0147078L19.5596 14.9516L22.3794 2.36099L24.3051 2.38885L28.1954 24.1517L32.2021 16.4619L34 17.0796L27.2688 30L23.2307 7.4135L20.3947 20.0831L18.4681 20.0513L15.9552 5.47749L11.613 27.5964L9.68827 27.6096L5.83889 9.89988L1.77502 17.1013L0 16.4402L6.67398 4.61747L10.5996 22.6871L15.0543 0L16.9847 0.0147078Z\" fill=\"white\"/> </svg>",
            "padding": {"top": 6, "right": 6, "bottom": 6, "left": 4}
        }
    },
    {
        "type": "button",
        "id": "oscTriangular",
        "bounds": {"left": 182, "top": 69, "width": 30},
        "//": "------------------- BUTTON: Osc Triangular -------------------",
        "channels": [{"id": "oscTriangular", "range": {}}],
        "radioGroup": "waveformRadio",
        "style": {
            "on": {"backgroundColor": "#ffa71e"},
            "off": {"backgroundColor": "#ffa71e14"},
            "hover": {"backgroundColor": "#fbfbfb2e"},
            "active": {"backgroundColor": "#ffa71e"}
        },
        "label": {"text": {"on": "", "off": ""}},
        "svg": {
            "markup": "<svg width=\"56\" height=\"26\" viewBox=\"0 0 56 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M55.6699 23.4297L53.9473 24.4473L41.792 3.87695L28.2393 25.9639L16.6689 3.8291L1.61719 24.5264L0 23.3506L16.9482 0.046875L28.377 21.9131L41.8252 0L55.6699 23.4297Z\" fill=\"white\"/> </svg>",
            "padding": {"top": -2, "bottom": -1, "left": 1, "right": 3}
        }
    },
    {
        "type": "groupBox",
        "id": "groupBox4_copy_1_m7dz",
        "bounds": {"left": 295, "top": 18, "width": 169, "height": 120},
        "//": "=================== GROUPBOX: Reverb ===================",
        "zIndex": -1,
        "style": {
            "borderColor": "#404040",
            "backgroundColor": "#292929fa",
            "fontFamily": "Arial",
            "fontSize": 12,
            "fontColor": "#cccccc",
            "textAlign": "centre"
        },
        "label": {"text": "Reverb"},
        "channels": [{"range": {"defaultValue": 0, "increment": 0.001, "max": 1, "min": 0, "skew": 1}}]
    },
    {
        "type": "rotarySlider",
        "id": "revFeedback",
        "bounds": {"left": 315, "top": 45, "width": 65, "height": 74},
        "//": "------------------- ROTARYSLIDER: Reverb Feedback -------------------",
        "channels": [{"id": "revFeedback", "range": {"defaultValue": 0.4}}],
        "label": {"text": "Feedback", "offsetY": -2},
        "valueText": {"visible": true},
        "style": {
            "thumb": {"backgroundColor": "#ff1e1e", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "revCutoff",
        "bounds": {"left": 384, "top": 45, "width": 65, "height": 74},
        "//": "------------------- ROTARYSLIDER: Reverb Cutoff -------------------",
        "channels": [
            {"id": "revCutoff", "range": {"defaultValue": 5000, "increment": 1, "max": 22050, "min": 0.1, "skew": 0.5}}
        ],
        "label": {"text": "Cutoff", "offsetY": -2},
        "valueText": {"visible": true},
        "style": {
            "thumb": {"backgroundColor": "#ff1e1e", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "groupBox",
        "id": "groupBox4_copy_1_miod",
        "bounds": {"left": 469, "top": 19, "width": 148, "height": 120},
        "//": "=================== GROUPBOX: Filter Controls ===================",
        "zIndex": -1,
        "style": {
            "borderColor": "#404040",
            "backgroundColor": "#292929fa",
            "fontFamily": "Arial",
            "fontSize": 12,
            "fontColor": "#cccccc",
            "textAlign": "centre"
        },
        "label": {"text": "Filter Controls"},
        "channels": [{"range": {"defaultValue": 0, "increment": 0.001, "max": 1, "min": 0, "skew": 1}}]
    },
    {
        "type": "rotarySlider",
        "id": "cutoffSlider",
        "bounds": {"left": 479, "top": 45, "width": 65, "height": 74},
        "//": "------------------- ROTARYSLIDER: Cut-Off -------------------",
        "channels": [
            {"id": "filterCutoff", "range": {"defaultValue": 5000, "increment": 1, "max": 22050, "min": 1, "skew": 0.5}}
        ],
        "label": {"text": "Cut-Off", "offsetY": -2},
        "valueText": {"visible": true},
        "style": {
            "thumb": {"backgroundColor": "#0ebb11", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "filterRes",
        "bounds": {"left": 546, "top": 45, "width": 65, "height": 74},
        "//": "------------------- ROTARYSLIDER: Res -------------------",
        "channels": [{"id": "filterRes", "range": {"max": 10}}],
        "label": {"text": "Q", "offsetY": -2},
        "valueText": {"visible": true},
        "style": {
            "thumb": {"backgroundColor": "#0ebb11", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        }
    },
    {
        "type": "rotarySlider",
        "id": "filterCutoffDisplay",
        "bounds": {"left": 479, "top": 45, "width": 65, "height": 74},
        "channels": [
            {"id": "filterCutoffDisplay", "range": {"defaultValue": 5000, "max": 22050, "min": 1, "skew": 0.5}}
        ],
        "label": {"offsetY": -2},
        "style": {
            "thumb": {"backgroundColor": "#0ebb11", "borderColor": "#2a2a2a"},
            "track": {"width": 4, "fillColor": "#ededed", "backgroundColor": "#444444ff"},
            "label": {"fontFamily": "Arial", "fontSize": 11, "fontColor": "#bbbbbb"},
            "valueText": {"fontFamily": "Arial"}
        },
        "active": false
    }
]
</Cabbage>
<CsoundSynthesizer>
<CsOptions>
; comment here
; comment here
; comment here
-o dac -+id_artist=dsc
-o dac
; and here
; and here
; and here
; and here
; and here
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1

#include "test_udo.udo"

#define PIG # 21 #
#define OSCMACRO(VOLUME' FREQ) # poscil($VOLUME, $FREQ) #

osc_handle@global:i = OSCinit(8080)

opcode print_value(value:i, value1:i):(ii)
    print(value, value1)
    xout(value, 10)
endop

opcode print_value_with_no_arg():(void)
    print("Hello, World!")
endop

opcode add, iS, iio
    i1, i2, ivalue xin
    klast init 0
    ivalue += 1
    xout i1, i2
endop

freq@global:i = init($M_LN2)
gamp init 0
givalue = 10

struct MyType val0:i, val1:i
struct MyDog val:a

/**
testing doc
*/
instr 1
    ain in
    ifreq = 400
    icall = 10
    sig:a = poscil(.7, 440)
    sig2:a[][] = poscile(1, 400)
    sig3:a += poscil(1, 440 * 3)
    filter2:a = poscil(1, poscil(1, 440))
    filter2 -= gamp
    sig_macro:a = $OSCMACRO(0.7' 550)

    a1, a2 pan2 sig, icall
    iname, isurname = 0, 1
    sig_left:a, sig_right:a, sig_middle:a = pan2(sig, icall)
    sig2[0] = 100; // fix array access as read

    if (itest1 < $M_MAX_VALUE && itest1 != $M_INF) then
        prints "FAIL: PI * MAX_VALUE should be >= MAX_VALUE or infinity\n"
        exitnow 1
    endif

    ; asignal poscil 1, 330
    ; asignal[] poscil noise(1), 300
    filter:a = butterbp:a(sig, freq, iamp)
    afilter butbp:a filter + sig_middle, givalue

    gambo:MyType init 8, 88
    cat:Cat init 0, 0

    k(p5)

    loop:
    ifreq = 500

    ifreq = gambo.val0 > 300 ? 1000:5000
    iamp = cat.body

    goto(label)

    var:b = true

    iv add 1, iamp
    struct_name:i = poscil(40, 400)
    instr_name:i = poscil(2, 399)

    break:
    print(1)

    if p4 then
        print()
    endif

    switch p4
    case 1
        print_value(1, 100)
        for i in [1, 2, 3] do
            if i == 2 then
                value_from_udo_file(1, 10)
                break
            endif
        od
        goto loop

    case 2
        print(2)
    case 3
        print()
    default
        print(3)
    endsw

    out(sig, sig)
endin

/**
* multiline
* multiline
* multiline
* multiline
**/

/* test */

gi_chain init 0

instr S1 // resolve this
    ifreq = 200
    iamp = 300 // ok test comment

    movement:k = init(0)
    OSClisten(osc_handle, "/dev", "f", movement)

    notes:i[] = fillarray(0, 2, 4, \
        5, 6
    )

endin

</CsInstruments>
<CsScore>

#define MACROINSTR # i1 #

f 0 14

e

f 0 0 4097 10 1 1 1
a 0 0 1
f 0 0 4097 10 1 1 1
a 0 0 1
i1.5  +   .  [ 44 * 10 ]

{ 4 CNT
    { 8 PARTIAL
        i 1 [0.5 * $CNT.] [@@3 + ($CNT * 0.2)]  [500 + (~ * 200)]  [800 + (200 * $CNT.) + ($PARTIAL. * 20)]
    }
}

$MACROINSTR. 0

$MACROINSTR. 0  1 [ 110 + 220 ]
$MACROINSTR. +  .  [ 330 - 55 ]
i1  +   .  [ 1100 + 2 ]
; h 1  +   <  [ 5 ^ 4 ]
i 1  +   .  [ 5660 % 1000 ]
i 1  +   .  [ 110 & 220 ]


; i1 +

r6 REPS
i 1  +   .  [ 110 | 220 ] $REPS.
i 1  +   .  [ 110 # 220 ] $REPS.

; i "S1" 10

r6 REPS
s
i 10 1
a10 0 0 0
a 0 0 1
x 0
e
x
i "S1" 0 10
i "S1" 10 1 10

</CsScore>
</CsoundSynthesizer>

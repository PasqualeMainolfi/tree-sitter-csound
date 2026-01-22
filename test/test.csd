<Cabbage>
[
    "come": [ "cmdjkmcd", "mcidmckd"],
    {
        "name": 10
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
    xout(value, $PIG)
endop

opcode add, ii, ii
    i1, Skey, i2 xin
    klast init 0
    xout(i1, i2)
endop

freq@global:i = init($M_LN2)
gamp init 0
givalue = 10

struct MyType val0:i, val1:i
struct MyDog val:a

instr 1
    ifreq = 400
    icall = 10
    sig:a = poscil(.7, 440)
    sig2:a[][] = poscil(1, 400)
    sig3:a += poscil(1, 440 * 3)
    filter2:a = poscil(1, givalue)
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
    afilter butbp:a filter + sig_middle, , givalue

    gambo:MyType init 8, 88
    cat:Cat init 0, 0

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

<CsoundSynthesizer>
<CsOptions>
-o dac
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1

#define PIG # 21 #
#define OSCMACRO(VOLUME' FREQ) # poscil($VOLUME, $FREQ) #

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
    sig:a = poscil(1, 440)
    sig2:a[] = poscile(1, 400)
    sig3:a += poscil(1, 440 * 3)
    filter2:a = poscil(1, givalue)
    filter2 -= gamp
    sig_macro:a = $OSCMACRO(0.7' 550)

    a1, a2 pan2 sig, icall
    sig_left:a, sig_right:a, sig_middle:a = pan2(sig, icall)

    ; asignal poscil 1, 330
    ; asignal[] poscil noise(1), 300
    filter:a = butterbp:a(sig, freq, iamp)
    afilter butbp:a filter + sig_middle, iamp, givalue

    gambo:MyType init 8, 88

    loop:
    ifreq = 500

    if p4 > 10 goto loop

    ifreq = gambo.val0 > 300 ? 1000:5000
    iamp = gambo.val0

    var:b = true
    iv add 1, iamp

    switch p4
        case 1
            print_value(1, 100)
            goto loop
        case 2
            print(2)
        default
            print(3)
    endsw

    outs(sig, sig)
endin

instr 2
    ifreq = 200
    iamp = 300

endin

</CsInstruments>
<CsScore>

#define MACROINSTR # i1 #

f 0 0 4097 10 1 1 1
f 0 0 4097 10 1 1 1

a 0 0 1

{ 4 CNT
    { 8 PARTIAL
        i 1 [0.5 * $CNT.] [@@3 + ($CNT * 0.2)]  [500 + (~ * 200)]  [800 + (200 * $CNT.) + ($PARTIAL. * 20)]
    }

}

$MACROINSTR.  0   1  [ 110 + 220 ]
$MACROINSTR.  +   .  [ 330 - 55 ]
i1  +   .  [ 44 * 10 ]
i1  +   .  [ 1100 + 2 ]
h 1  +   <  [ 5 ^ 4 ]
i 1  +   .  [ 5660 % 1000 ]
i 1  +   .  [ 110 & 220 ]
i 1  +   .  [ 110 | 220 ]
i 1  +   .  [ 110 # 220 ]

e
</CsScore>
</CsoundSynthesizer>

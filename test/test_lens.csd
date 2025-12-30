<CsoundSynthesizer>
<CsOptions>
-o dac
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1

opcode add, ii, ii
    i1, Skey, i2 xin
    klast init 0
    xout(i1, i2)
endop

instr 1

    sig:a = poscil(1, 440)
    out(sig, sig)

    switch p4
        case 1
            print(1)
        case 2
            print(2)
        case 3
            print(3)
        default
            print(0)
    endsw


endin


</CsInstruments>
<CsScore>

i 1 0 10


</CsScore>
</CsoundSynthesizer>

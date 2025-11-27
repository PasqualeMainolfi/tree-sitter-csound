<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1

opcode name(sig:a):(a)
    xout()
endop


instr 1

    sig:a = poscil()

    switch p4
        case 1
            print(1)
        case 2
            print(2)
    endsw

    outs(sig, sig)

endin




</CsInstruments>
<CsScore>



</CsScore>
</CsoundSynthesizer>

<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1


instr 1

    if p4 then
        print(1)
    endif

    switch p4
        case 1
            print(1)
        case 2
            print(2)
    endsw

    sig:a = poscil(1, 440)

    outs(sig, sig)

endin




</CsInstruments>
<CsScore>



</CsScore>
</CsoundSynthesizer>

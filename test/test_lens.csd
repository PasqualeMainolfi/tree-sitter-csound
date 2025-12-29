<CsoundSynthesizer>
<CsOptions>
-o dac
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1

instr 1

    sig:a = poscil(1, 440)
    out(sig, sig)

endin


</CsInstruments>
<CsScore>

i 1 0 10

</CsScore>
</CsoundSynthesizer>

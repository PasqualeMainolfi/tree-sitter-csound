<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1

struct Foo val0:i, val1:i
freq@global:i = 400

instr 1

    bar:Foo init 8, 88
    print(bar.val0, bar.val1)

    obj:InstrDef = create({{
        out(poscil(1, 440))
        }})

endin





</CsInstruments>
<CsScore>

i 1 0 1

</CsScore>
</CsoundSynthesizer>

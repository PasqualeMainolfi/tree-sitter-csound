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

    if p4 > 3 then
        print(1)
    endif

    switch p4 > 3
        case 1
            print(1)
        default
            print(0)
    endsw


endin





</CsInstruments>
<CsScore>

i 1 0 1

</CsScore>
</CsoundSynthesizer>

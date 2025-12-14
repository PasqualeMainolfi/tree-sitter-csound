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


obj_out:InstrDef = create({{
    out(poscil(1, 440))
}})

instr 1

    bar:Foo init 8, 88
    print(bar.val0, bar.val1)

    obj:InstrDef = create({{
        out(poscil(1, 440))
    }})

    ifreq = 400
    iamp = 1
    sig:a = poscil(1, ifreq)

    if p4 > 3 then
        print(1)
    endif

    if p5 > 10 goto lownote
        goto highnote

    lownote:
    ifreq = 1000
    sig:a = poscil(iamp, freq)


    while p4 > 10 do
        print(9)
    od

    for i in [1, 2, 3] do
        print(1)
    od

    sig:a = poscil(1, 440)

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

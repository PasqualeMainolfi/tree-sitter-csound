<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1


opcode print_value(value:i):(void)
    print(value)
endop


instr 1

    sig:a = poscil(1, 440)

    switch p4
        case 1
            print(1)
        case 2
            print(2)
        default
            print(3)
    endsw

endin


</CsInstruments>
<CsScore>



</CsScore>
</CsoundSynthesizer>

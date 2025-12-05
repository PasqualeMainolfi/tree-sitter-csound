<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1

// TODO: lsp: add unused variables, fix type in case as below in xout, add definition of udo in orc, fix mul

opcode print_value(value:i, value1:k):(ii)
    print(value)
    xout(10, i2)
endop

opcode add, ii, ii
    i1, i2 xin
    xout(i1, 10)
endop

instr 1

    struct MyType val0:i, val1:i

    sig:a = poscil(1, 440)
    asignal poscil 1, 440
    sig2:b = poscile(1, 3)
    filter:b = butterbp(sig, 300, 50)
    filter2:b = poscil(1, 440)

    gambo:MyType init 8, 88

    switch p4
        case 1
            print_value(1)
        case 2
            print(2)
        default
            print(3)
    endsw

endin


</CsInstruments>
<CsScore>

i 1 0 1


</CsScore>
</CsoundSynthesizer>

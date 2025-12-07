<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 1
nchnls = 2
0dbfs = 1

#define PIG # 21 #

opcode print_value(value:i, value1:k):(ii)
    print(value, value1)
    xout(10, $PIG)
endop

opcode add, 0, ii
    i1, i2 xin
    xout(i1, i2)
endop

freq@global:i = 10
gamp init 10

instr 1

    struct MyType val0:i, val1:i

    ifreq = 400
    sig:a = poscil(noise(1), 440)
    ; asignal[] poscil ifreq, 44
    asignal[] poscil ifreq, 44
    sig2:a[] = poscile(1, 3)
    sig3:a += poscil(1, 440)
    filter:a = butterbp(sig, freq, 50)
    filter2:a = poscil(1, 440)
    afilter butbp noise(1), 300, 400

    gambo:MyType init 8, 88

    ifreq = gambo.val0 > 300 ? 1000:5000
    iamp = gambo.val0

    v:i = 10
    ib = 10
    iv add 1, 2

    switch p4
        case 1
            print_value(1)
        case 2
            print(2)
        default
            print(3)
    endsw

    outs(sig2, sig2)
endin


</CsInstruments>
<CsScore>

i 1 0 1


</CsScore>
</CsoundSynthesizer>

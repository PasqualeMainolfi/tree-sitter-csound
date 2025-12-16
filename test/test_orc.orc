sr = 44100
ksmps = 1
nchnls = 1
0dbfs = 1

instr 1
    ifreq = 500
    asig poscil(1, 440)
    outs(asig, asig)
endin

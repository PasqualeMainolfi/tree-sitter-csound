sr = 44100
ksmps = 1
nchnls = 1
0dbfs = 1

#define PIG # 21 #
#define OSCMACRO(VOLUME'FREQ) # poscil $VOLUME, $FREQ #

instr 1
    ifreq = 500
    asig $OSCMACRO(1' ifreq)
    outs(asig, asig)
endin

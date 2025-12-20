sr = 44100
ksmps = 1
nchnls = 1
0dbfs = 1

#define PIG # 21 #
#define OSCMACRO(VOLUME'FREQ'TABLE) # oscil $VOLUME, $FREQ, $TABLE #

instr 1
    ifreq = 500
    asig $OSCMACRO
    outs(asig, asig)
endin

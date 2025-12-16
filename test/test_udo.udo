#define PIG # 21 #
#define OSCMACRO(VOLUME'FREQ'TABLE) # oscil $VOLUME, $FREQ, $TABLE #

freq@global:i = init($M_LN2)
gamp init 0
givalue = 10

opcode print_value(value:i, value1:i):(ii)
    print(value, value1)
    xout(value, $PIG) // add error with only $
endop

opcode add, ii, ii
    i1, i2 xin
    xout(i1, i2)
endop

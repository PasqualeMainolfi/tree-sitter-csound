#define MACRO # 21 #


eval_amp@global:i = init(0)
amp@global:i = init(0)
freq@global:i = init($M_LN2)
i10@global:i = init($M_LN2)
gamp init 0
givalue = 10

struct Cat voice:i, body:k

opcode value_from_udo_file(value:i, value1:i):(ii)
    print(value, value1)
    xout(value, $MACRO)
endop

opcode add, ii, ii
    i1, i2 xin
    xout(i1, i2)
endop

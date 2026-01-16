#define MACRO # 21 #  


amp@global:i = init(0)
freq@global:i = init($M_LN2)
i10@global:i = init($M_LN2)
gamp init 0
givalue = 10

struct Cat voice:i, body:k

// TODO: generate opcode documentation
/*************************************
@opcode: value_from_udo_file
@description: testing opcode info
@inputs:
    value1
    value
@outputs:
    i, i
@example:
    first:i, second:i = value_from_udo_file(x, y)
****************************************/
opcode value_from_udo_file(value:i, value1:i):(ii)
    print(value, value1)
    xout(value, $MACRO)
endop

opcode add, ii, ii
    i1, i2 xin
    xout(i1, i2)
endop

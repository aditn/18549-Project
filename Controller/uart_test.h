#include <avr/io.h>
#include "defines.h"
#include <stdio.h>

void uart_init(void);
void uart_putchar(char c);
void sendData(uint32_t* fData);
extern uint32_t fData[NUMBER_OF_SENSORS];

FILE uart_output;
FILE uart_input;
FILE uart_io;

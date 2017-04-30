#include <avr/io.h>
#include "defines.h"

void I2C_received(uint8_t received_data); 
void I2C_requested();
extern uint32_t fData[NUMBER_OF_SENSORS];
volatile uint8_t data;
char data_str[20*NUMBER_OF_SENSORS];

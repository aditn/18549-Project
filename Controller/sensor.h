#include "defines.h"
#include <avr/io.h>

uint16_t fData[NUMBER_OF_SENSORS];
uint16_t adc_read(uint8_t adcx);
void collectforceData(uint16_t* data);
void read_Accelerometer(float* accelArray);
void LED_green_on();
void LED_green_off();
void LED_red_on();
void LED_red_off();
void LED_both_on();
void LED_both_off();

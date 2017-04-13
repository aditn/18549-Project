#include "defines.h"
#include <avr/io.h>

uint32_t fData[NUMBER_OF_SENSORS];
void adc_init();
uint16_t adc_read(uint8_t adcx);
uint32_t ReadCount(); 
void collectforceData(uint32_t* data);
void read_Accelerometer(float* accelArray);
void LED_green_on();
void LED_green_off();
void LED_red_on();
void LED_red_off();
void LED_both_on();
void LED_both_off();

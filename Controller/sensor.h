#include "defines.h"
#include <avr/io.h>

float fData[NUMBER_OF_SENSORS];
void sensor_init();
void adc_init();
uint16_t adc_read(uint8_t adcx);
uint32_t read_avg_force();
void tare();
float read_calibrated_value();
uint32_t ReadCount(); 
void collectforceData(float* data);
uint32_t CALIB_OFFSET;
void read_Accelerometer(float* accelArray);
void LED_green_on();
void LED_green_off();
void LED_red_on();
void LED_red_off();
void LED_both_on();
void LED_both_off();

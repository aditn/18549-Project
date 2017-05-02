#include "defines.h"
#include <avr/io.h>

typedef struct {
	volatile uint8_t* DIR_REG;
	volatile uint8_t* PORT_OUTPUT_REG;
	volatile uint8_t* PORT_INPUT_REG;
	uint8_t DATA;
	uint8_t CLK;
	int32_t CALIB_OFFSET;
	int32_t CALIB_FACTOR;
} sensor;

sensor SENSORS[NUMBER_OF_SENSORS];

float fData[NUMBER_OF_SENSORS];
void sensor_init();
void adc_init();
uint16_t adc_read(uint8_t adcx);
uint32_t read_avg_force(uint8_t sensor_id);
void tare();
float read_calibrated_value(uint8_t sensor_id);
uint32_t ReadCount(uint8_t sensor_id); 
void collectforceData(float* data);
//uint32_t CALIB_OFFSET;

uint32_t CALIB_OFFSETS[NUMBER_OF_SENSORS]; 
uint8_t SENSOR_DATA_PINS[NUMBER_OF_SENSORS];
uint8_t SENSOR_CLK_PINS[NUMBER_OF_SENSORS];

void read_Accelerometer(float* accelArray);
void LED_green_on();
void LED_green_off();
void LED_red_on();
void LED_red_off();
void LED_both_on();
void LED_both_off();

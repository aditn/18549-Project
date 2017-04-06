/*
  sensor.c
*/

#include "sensor.h"
//#include "I2C-master-lib-master/i2c_master.h"

uint16_t adc_read(uint8_t adcx) {
  /* adcx is the analog pin we want to use.  ADMUX's first few bits are
   * the binary representations of the numbers of the pins so we can
   * just 'OR' the pin's number with ADMUX to select that pin.
   * We first zero the four bits by setting ADMUX equal to its higher
   * four bits. */
  ADMUX &=  0xf0;
  ADMUX |=  adcx;

  /* This starts the conversion. */
  ADCSRA |= _BV(ADSC);

  /* This is an idle loop that just wait around until the conversion
   * is finished.  It constantly checks ADCSRA's ADSC bit, which we just
   * set above, to see if it is still set.  This bit is automatically
   * reset (zeroed) when the conversion is ready so if we do this in
   * a loop the loop will just go until the conversion is ready. */
  while ( ADCSRA & _BV(ADIF) );

  uint16_t adcV = ADC;
  ADCSRA |= _BV(ADIF);

  /* Finally, we return the converted value to the calling function. */
  return adcV;
}


void collectforceData(uint16_t* data){
  // use ADC here later

  // using fake data for now
  data[0] = (uint16_t)10;
  data[1] = (uint16_t)20;
  data[2] = (uint16_t)30;
  data[3] = (uint16_t)40;
}

void read_Accelerometer(float* accelArray){

}


void LED_green_on(){
  DDRC |= (1<<PC0);

  // set PC0 and PC1 to logic 1
  PORTC |= (1<<PC0);
}
void LED_green_off(){
  PORTC &= ~(1<<PC0);
}
void LED_red_on(){
  DDRC |= (1<<PC1);

  // set PC1 to logic 1
  PORTC |= (1<<PC1);
}
void LED_red_off(){
  PORTC &= ~(1<<PC1);
}

void LED_both_on(){
  // set Pins PC0,PC1 as outputs
  //DDRC = 0;
  DDRC |= (1<<PC0) | (1<<PC1);

  // set PC0 and PC1 to logic 1
  PORTC |= (1<<PC0) | (1<<PC1);
}

void LED_both_off(){
  // set Pins PC0,PC1 as outputs
  //DDRC = 0;
  //DDRC |= (1<<PC0) | (1<<PC1);

  // set PC0 and PC1 to logic 1
  PORTC &= ~((1<<PC0) | (1<<PC1));
}

/*
  sensor.c
*/

#include "sensor.h"
#include <avr/interrupt.h>
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

void adc_init(){
   // disable interrupts
   cli();

   // Set the ADC prescaler to 128 (i.e., 16MHz/128 = 125KHz)
   ADCSRA |= ( 1 << ADPS2 ) | ( 1 << ADPS1 ) | ( 1 << ADPS0 );

   // Set the voltage reference from AVcc (i.e., 5V).
   ADMUX |= ( 1 << REFS0 );

   // Turn on the ADC.
   ADCSRA |= ( 1 << ADEN );

   // Do the initial conversion (i.e., the slowest conversion)
   // to ensure that everything is up and running.
   ADCSRA |= ( 1 << ADSC );
   
   //enable interrupts
   sei();
}

uint32_t ReadCount(void){
  uint32_t Count;
  uint8_t i;
  //PC0 is clk
  PORTC &= ~(1<<PC0);
  //PC1 is data
  PORTC |= (1<<PC1); // set PC1 as input
  Count=0;
  while(PINC & (1<<PC1));
  for (i=0;i<24;i++){
    PORTC |= (1<<PC0);
    Count=Count<<1;
    PORTC &= ~(1<<PC0);
    if(PINC & (1<<PC1)) Count++;
  }
  
  PORTC |= (1<<PC0);
  Count=Count^0x800000;
  PORTC &= ~(1<<PC0);
  return(Count);
} 
void collectforceData(uint32_t* data){
  // set Data and Manual CLK pins
  DDRC |= (1<<PC0); // Set PC0(clk) as an output pin
  DDRC &= ~(1<<PC1); // Set PC1(data) as input pin
  
  // using fake data for now
  data[0] = ReadCount();
  //data[0] = (uint32_t)10;
  data[1] = (uint32_t)20;
  data[2] = (uint32_t)30;
  data[3] = (uint32_t)40;
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

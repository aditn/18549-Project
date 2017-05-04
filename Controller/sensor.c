/*
  sensor.c
*/

#include "sensor.h"
#include <avr/interrupt.h>
#include <stdio.h>


void sensor_init(){
   DDRC |= (1<<PC0); // Set PC0(clk) as an output pin
   DDRC &= ~(1<<PC1); // Set PC1(data) as input pin

   SENSORS[SENSOR0].CLK = PC0;
   SENSORS[SENSOR0].DATA = PC1;
   SENSORS[SENSOR0].DIR_REG = &DDRC;
   SENSORS[SENSOR0].PORT_OUTPUT_REG = &PORTC;
   SENSORS[SENSOR0].PORT_INPUT_REG = &PINC;
   SENSORS[SENSOR0].CALIB_FACTOR = -12000;

   /* Initializing second sensor */
   DDRC |= (1<<PC2); // Set PC2(clk) as an output pin
   DDRC &= ~(1<<PC3); // Set PC3(data) as input pin

   SENSORS[SENSOR1].CLK = PC2;
   SENSORS[SENSOR1].DATA = PC3;
   SENSORS[SENSOR1].DIR_REG = &DDRC;
   SENSORS[SENSOR1].PORT_OUTPUT_REG = &PORTC;
   SENSORS[SENSOR1].PORT_INPUT_REG = &PINC;
   SENSORS[SENSOR1].CALIB_FACTOR = -11000;
   /* Initializing second sensor */



   /* Initializing THIRD PORTD sensor */
   DDRD |= (1<<PD7); // Set PD7(clk) as an output pin
   DDRD &= ~(1<<PD6); // Set PD6(data) as input pin

   SENSORS[SENSOR2].CLK = PD7;
   SENSORS[SENSOR2].DATA = PD6;
   SENSORS[SENSOR2].DIR_REG = &DDRD;
   SENSORS[SENSOR2].PORT_OUTPUT_REG = &PORTD;
   SENSORS[SENSOR2].PORT_INPUT_REG = &PIND;
   SENSORS[SENSOR2].CALIB_FACTOR = -11000;
   /* Initializing THIRD PORTD sensor */



   /* Initializing FOURTH PORTB sensor */
   DDRB |= (1<<PB5); // Set PB7(clk) as an output pin
   DDRB &= ~(1<<PB4); // Set PB6(data) as input pin

   SENSORS[SENSOR3].CLK = PB5;
   SENSORS[SENSOR3].DATA = PB4;
   SENSORS[SENSOR3].DIR_REG = &DDRB;
   SENSORS[SENSOR3].PORT_OUTPUT_REG = &PORTB;
   SENSORS[SENSOR3].PORT_INPUT_REG = &PINB;
   SENSORS[SENSOR3].CALIB_FACTOR = -11000;
   /* Initializing THIRD PORTD sensor */

}

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

uint32_t read_avg_force(uint8_t sensor_id, uint8_t times){
  uint32_t avg=0;
  uint8_t i;
  for (i=0;i<times;i++){
     avg+=ReadCount(sensor_id);
  }
  avg/=times;
  //printf("avg force value:%lu\n\r",avg);
  return avg;
} 

void tare(){
  uint8_t sensor_id=0;

  for (sensor_id=0; sensor_id < NUMBER_OF_SENSORS; sensor_id++) {
    SENSORS[sensor_id].CALIB_OFFSET = 0;
    SENSORS[sensor_id].CALIB_OFFSET = read_avg_force(sensor_id, 15);
    printf("taring sensor%d:%lu\n\r",sensor_id, SENSORS[sensor_id].CALIB_OFFSET);
  }

  /*
  CALIB_OFFSET = 0;
  CALIB_OFFSET = read_avg_force(); 
  printf("taring sensors:%lu\n\r",CALIB_OFFSET);
  */
}

float read_calibrated_value(uint8_t sensor_id){
  uint32_t avg;
  int32_t avg_offset;
 
  float calib_val=0;
  avg = read_avg_force(sensor_id, 2);
  avg_offset = ((int32_t)avg-SENSORS[sensor_id].CALIB_OFFSET);
  //printf("avg_offset:%li\n\r",avg_offset);
  calib_val = (float)avg_offset/SENSORS[sensor_id].CALIB_FACTOR;
  //printf("calib_val:%f\n\r",calib_val);
 
  return(calib_val);
}

uint32_t ReadCount(uint8_t sensor_id){
  uint32_t Count;
  uint8_t i;

  uint8_t clk = SENSORS[sensor_id].CLK;
  uint8_t data = SENSORS[sensor_id].DATA;
  volatile uint8_t *output_reg = SENSORS[sensor_id].PORT_OUTPUT_REG;
  volatile uint8_t *input_reg = SENSORS[sensor_id].PORT_INPUT_REG;

  /*
  output_reg &= ~_BV(clk);
  output_reg |= _BV(data);

  printf("Saved output_reg is: %d ------ Port value is: %d\r\n", output_reg, PORTC);
  Count=0;

  while(input_reg & _BV(data)); 
  for (i=0;i<24;i++){
    output_reg |= _BV(clk);
    Count=Count<<1;
    output_reg &= ~_BV(clk);
    if(input_reg & _BV(data)) Count++;
  }
  
  output_reg |= _BV(clk);
  Count=Count^0x800000;
  output_reg &= ~_BV(clk);
  */



  *output_reg &= ~_BV(clk);
  *output_reg |= _BV(data);

  //printf("Saved output_reg is: %d ------ Port value is: %d\r\n", *output_reg, PORTC);
  Count=0;

  while(*input_reg & _BV(data)); 
  for (i=0;i<24;i++){
    *output_reg |= _BV(clk);
    Count=Count<<1;
    *output_reg &= ~_BV(clk);
    if(*input_reg & _BV(data)) Count++;
  }
  
  *output_reg |= _BV(clk);
  Count=Count^0x800000;
  *output_reg &= ~_BV(clk);




  /*
  //PC0 is clk
  PORTC &= ~(1<<clk);
  //PC1 is data
  PORTC |= (1<<data); // set PC1 as input

  Count=0;

  while(PINC & (1<<data)); 
  for (i=0;i<24;i++){
    PORTC |= (1<<clk);
    Count=Count<<1;
    PORTC &= ~(1<<clk);
    if(PINC & (1<<data)) Count++;
  }
  
  PORTC |= (1<<clk);
  Count=Count^0x800000;
  PORTC &= ~(1<<clk);
  */

  return(Count);
} 

void collectforceData(float* data){
  // set Data and Manual CLK pins
   
  // using fake data for now
  data[SENSOR0] = read_calibrated_value(SENSOR0);
  //data[0] = (uint32_t)10;
  //data[SENSOR1] = 35.f;
  data[SENSOR1] = read_calibrated_value(SENSOR1);
  //data[2] = (uint32_t)30;
  //data[3] = (uint32_t)40;
  data[SENSOR2] = read_calibrated_value(SENSOR2);

  data[SENSOR3] = read_calibrated_value(SENSOR3);
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

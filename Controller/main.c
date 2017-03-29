/*
  main.c
*/

#include "serial.h"
#include "sensor.c"
//#include "I2C-master-lib-master/i2c_master.c"
#include "uart_test.c"
#include <avr/io.h>
#include <util/twi.h>
#include <util/delay.h>

#define MPU6050 0x53
#define DEVREAD 0xA7

/*int main(void){
  
  serial_init();
  //sensor_init();
  
  uint8_t char_counter = 0;
  uint8_t c;

  while((c = serial_read()) != SERIAL_NO_DATA){
    if(c == 'p'){
      // Probe Pulse Sensor
      sensor_probe(); //add macros for each sensor
      char_counter = 0;
    }
    else{
      line[char_counter++] = c;
    }     
  }
}*/



uint16_t adc_read(uint8_t adcx);

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


void collectforceData(dataStruct* data){
  // use ADC here later

  // using fake data for now
  dataStruct.fSensor0 = 10;
  dataStruct.fSensor1 = 20;
  dataStruct.fSensor2 = 30;
  dataStruct.fSensor3 = 40;
}

int main(void)
{
   // Setup serial port
   uart_init();
   stdout = &uart_output;
   stdin  = &uart_input;

   //uint8_t accelData[3];

   char input;
   //float accel_Values[3]; 

   // Setup ports
   DDRB |= (1<<1) | (1<<0);
   PORTB |= (1<<0);
   PORTB &= ~(1<<1);

   /*i2c_init();
   printf("finished initing\r\n");
   //i2c_start(DEVREAD);
   //printf("finished starting\r\n" );
   //i2c_read_ack();
   i2c_receive(DEVREAD, accelData, 3);
   printf("recieved Data\r\n");
   printf("accelData[0]:%d\n", accelData[0]);
   */

   cli();
   /* Enable the ADC */
     // Set the ADC prescaler to 128 (i.e., 16MHz/128 = 125KHz)
   ADCSRA |= ( 1 << ADPS2 ) | ( 1 << ADPS1 ) | ( 1 << ADPS0 );

   // Set the voltage reference from AVcc (i.e., 5V).
   ADMUX |= ( 1 << REFS0 );

   // Turn on the ADC.
   ADCSRA |= ( 1 << ADEN );

   // Do the initial conversion (i.e., the slowest conversion)
   // to ensure that everything is up and running.
   ADCSRA |= ( 1 << ADSC );

   sei();

  /* Set the LED pin as an output. */
  //DDRB  |= _BV(LED_PIN);
  uint8_t i = 0;
  uint8_t pd = 0;
  uint8_t pd2 = 0;
  uint8_t waitUntilRed = 0;
  uint8_t waitUntilGreen = 0;
  
  // Force Sensor Data struct
  dataStruct fData;
  
  
  /* continually check if the ADC value is greater than the
   * defined ADC_THRESHOLD value above.  If it is turn the LED on,
   * if it isn't turn it off. */
  for (;;) {

    input = getchar();
    if(input == 'p'){
      // use ADC
      while(1){
        //for (i = 0; i<5; i++){
          uint16_t adcVal = adc_read(2);
          printf("adcVal: %d\r\n", adcVal);
          if (adcVal>=650) pd = 1;
          if ((250<=adcVal)&(adcVal<500)) pd2 =1;
        //}
        if (pd & !waitUntilGreen) {
          LED_red_on();
          waitUntilGreen = 1;
          waitUntilRed = 0;
        }
        if (pd2 & !waitUntilRed){
          LED_green_on();
          waitUntilRed = 1;
          waitUntilGreen = 0;
        //  _delay_ms(100);
        }
        _delay_ms(100);
        LED_red_off();
        LED_green_off();
        //else LED_both_off();
        pd = 0;
        pd2 = 0;

        //if ((input = getchar())=='s') break; // stop probing pulse sensor
        //_delay_ms(700);
      }
      // Probe Pulse Sensor
      //sensor_probe(); //add macros for each sensor
      }
      else if(input == 'l'){
        // turn on LEDs
        LED_both_on();
      }
      else if(input == 'm'){
        LED_both_off();
      }
      else if(input == 'a'){ //accelerometer
      }
      else if(input == 'f'){ //get force sensor data + send to RPi
        // use ADC here but for now send fake data
        collectforceData(&fData);
        sendData(&fData);

      }
      PORTB ^= 0x01;            
  }


   /*while(1) {
      
   }
*/
  return 0;
}

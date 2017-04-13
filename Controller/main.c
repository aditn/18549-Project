/*
  main.c
*/

//#include "serial.h"
// #include "sensor.h"
 #include <util/twi.h>
 //#include <avr/io.h>
#include <util/delay.h>
 #include "uart_test.h"
 #include "i2c_master.h"
 //#include "i2c.c"
 #include <stdio.h>
#include <string.h>
 
 #define SLAVE_ADDRESS 0x04



 #define BLINK_DELAY_MS 100
// #include <util/delay.h>
// #include <avr/interrupt.h>

uint8_t number = 0;

int i =0;

int main(void)
{

  /* set pin 5 of PORTB for output*/
  DDRB |= _BV(DDB5);

  /* set pin 5 low to turn led off */
  PORTB &= ~_BV(PORTB5);

  uart_init();
  stdout = &uart_output;
  stdin  = &uart_input;

  //printf("About to begin program...\n");

  // Setup
  i2c_init();

  // Loop
  while(1) {
    printf("Entered loop...\r\n");
    i2c_start(SLAVE_ADDRESS);// Begin connection to new slave device
    printf("In loop...\r\n");
    i2c_write(0x01);
    i2c_write(0x08);

    i2c_stop();
  }
}

// int main(void)
// {
//    // Setup serial port
//    uart_init();
//    stdout = &uart_output;
//    stdin  = &uart_input;

//    char input;
//    //float accel_Values[3]; 

//    // Setup ports
//    DDRB |= (1<<1) | (1<<0);
//    PORTB |= (1<<0);
//    PORTB &= ~(1<<1);

//    /*i2c_init();
//    printf("finished initing\r\n");
//    //i2c_start(DEVREAD);
//    //printf("finished starting\r\n" );
//    //i2c_read_ack();
//    i2c_receive(DEVREAD, accelData, 3);
//    printf("recieved Data\r\n");
//    printf("accelData[0]:%d\n", accelData[0]);
//    */

//    cli();
//    /* Enable the ADC */
//      // Set the ADC prescaler to 128 (i.e., 16MHz/128 = 125KHz)
//    ADCSRA |= ( 1 << ADPS2 ) | ( 1 << ADPS1 ) | ( 1 << ADPS0 );

//    // Set the voltage reference from AVcc (i.e., 5V).
//    ADMUX |= ( 1 << REFS0 );

//    // Turn on the ADC.
//    ADCSRA |= ( 1 << ADEN );

//    // Do the initial conversion (i.e., the slowest conversion)
//    // to ensure that everything is up and running.
//    ADCSRA |= ( 1 << ADSC );

//    sei();

//   /* Set the LED pin as an output. */
//   //DDRB  |= _BV(LED_PIN);
//   uint8_t pd = 0;
//   uint8_t pd2 = 0;
//   uint8_t waitUntilRed = 0;
//   uint8_t waitUntilGreen = 0;
  
//   /* continually check if the ADC value is greater than the
//    * defined ADC_THRESHOLD value above.  If it is turn the LED on,
//    * if it isn't turn it off. */
//   for (;;) {

//     input = getchar();
//     if(input == 'p'){
//       // use ADC
//       while(1){
//         //for (i = 0; i<5; i++){
//           uint16_t adcVal = adc_read(2);
//           printf("adcVal: %d\r\n", adcVal);
//           if (adcVal>=650) pd = 1;
//           if ((250<=adcVal)&(adcVal<500)) pd2 =1;
//         //}
//         if (pd & !waitUntilGreen) {
//           LED_red_on();
//           waitUntilGreen = 1;
//           waitUntilRed = 0;
//         }
//         if (pd2 & !waitUntilRed){
//           LED_green_on();
//           waitUntilRed = 1;
//           waitUntilGreen = 0;
//         //  _delay_ms(100);
//         }
//         _delay_ms(100);
//         LED_red_off();
//         LED_green_off();
//         //else LED_both_off();
//         pd = 0;
//         pd2 = 0;

//         //if ((input = getchar())=='s') break; // stop probing pulse sensor
//         //_delay_ms(700);
//       }
//       // Probe Pulse Sensor
//       //sensor_probe(); //add macros for each sensor
//       }
//       else if(input == 'l'){
//         // turn on LEDs
//         LED_both_on();
//       }
//       else if(input == 'm'){
//         LED_both_off();
//       }
//       else if(input == 'a'){ //accelerometer
//       }
//       else if(input == 'f'){ //get force sensor data + send to RPi
//         // use ADC here but for now send fake data
//         collectforceData(fData);
//         sendData(fData);

//       }
//       PORTB ^= 0x01;            
//   }


//    /*while(1) {
      
//    }
// */
//   return 0;
// }

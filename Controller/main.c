/*
  main.c
*/

//#include "serial.h"
#include "sensor.h"
#include "uart_test.h"
#include "I2CSlave.h"
#include <util/twi.h>
#include <util/delay.h>
#include <avr/interrupt.h>
#include <string.h>

#define SLAVE_ADDRESS 0x04

volatile uint8_t data;
//volatile char* data_string;
char* data_string = "Hello World!";

void I2C_received(uint8_t received_data) {
  data = received_data;
  printf("Arduino received: %d\r\n", data);
}

void I2C_requested() {
  //printf("Arduino sending back: %d\r\n", data);
  //I2C_transmitByte(data);
  if (data == 255) {
    I2C_transmitByte(strlen(data_string));
  }
  
  else {
    printf("\t\t\tArduino sending back: %c\r\n", data_string[data]);
    I2C_transmitByte(data_string[data]);
  }
}

int main(void)
{
   // Setup serial port
   uart_init();
   stdout = &uart_output;
   stdin  = &uart_input;

   // Setup ports
   DDRB |= (1<<1) | (1<<0);
   PORTB |= (1<<0);
   PORTB &= ~(1<<1);

   I2C_setCallbacks(I2C_received, I2C_requested);

   I2C_init(SLAVE_ADDRESS);

   while(1);
}



// int main(void)
// {
//    // Setup serial port
//    uart_init();
//    stdout = &uart_output;
//    stdin  = &uart_input;
   
//    printf("About to init I2c...\r\n"); 
//    // Setup i2c
//    i2c_init();
//    printf("Completed initialization of I2C!\r\n");

//    char input;

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

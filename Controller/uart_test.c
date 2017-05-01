/* 
 uart.c
*/

#include "uart_test.h"
#include <inttypes.h>
#include <avr/pgmspace.h>
#include <avr/interrupt.h>
#include <avr/wdt.h>
#include <util/delay.h>
#include <stdlib.h>
#include <util/setbaud.h>

void uart_init(void) {
   UBRR0H = UBRRH_VALUE;
   UBRR0L = UBRRL_VALUE;

#if USE_2X
   UCSR0A |= _BV(U2X0);
#else
   UCSR0A &= ~(_BV(U2X0));
#endif

   UCSR0C = _BV(UCSZ01) | _BV(UCSZ00); /* 8-bit data */
   UCSR0B = _BV(RXEN0) | _BV(TXEN0);   /* Enable RX and TX */
}

void uart_putchar(char c) {
   loop_until_bit_is_set(UCSR0A, UDRE0); /* Wait until data register empty. */
   UDR0 = c;
}

char uart_getchar(void) {
   loop_until_bit_is_set(UCSR0A, RXC0); /* Wait until data exists. */
   return UDR0;
}

// This function will convert the uint16_t ADC data into
// characters and then send each char over serial
// TODO: MAKE THE SWITCH TO I2C ONCE THE I/O EXPANSION BOARD COMES
void sendData(float* fData){

  uint8_t j = 0;

  for (j=0;j<NUMBER_OF_SENSORS;j++){
    printf("sensor%d:%f",j,fData[j]);
    if (j<NUMBER_OF_SENSORS-1) printf(",");
    if (j==NUMBER_OF_SENSORS-1) printf("\n\r");
  }
}

FILE uart_output = FDEV_SETUP_STREAM(uart_putchar, NULL, _FDEV_SETUP_WRITE);
FILE uart_input = FDEV_SETUP_STREAM(NULL, uart_getchar, _FDEV_SETUP_READ);
FILE uart_io = FDEV_SETUP_STREAM(uart_putchar, uart_getchar, _FDEV_SETUP_RW);


/*int main(void)
{


   uart_init();
   stdout = &uart_output;
   stdin  = &uart_input;

   char input;

   // Setup ports
   DDRB |= (1<<1) | (1<<0);
   PORTB |= (1<<0);
   PORTB &= ~(1<<1);

   printf("Hello world!\r\n");
   while(1) {
      input = getchar();
      printf("You wrote %c\r\n", input);
      PORTB ^= 0x01;
   }

}
*/

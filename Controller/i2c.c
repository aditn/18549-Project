
#include <stdio.h>
#include <inttypes.h>
#include <stdlib.h>

//#define BAUD 115200
//#include <util/setbaud.h>


#define SLAVE_ADDRESS 0x04

uint8_t number = 0;

/*
int main(void)
{
	// Setup
	i2c_init();

	i2c_start(SLAVE_ADDRESS); // Begin connection to new slave device

	// Loop
	while(1) {
		number = i2c_read_nack();
		printf("Arduino received: %d\n", number);

		i2c_write(number);
	}
}

*/
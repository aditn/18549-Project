/*
  i2c_comm.c
*/

#include "i2c_comm.h"
#include "sensor.h"
#include "I2CSlave.h"
#include <string.h>
#include <stdio.h>

void I2C_received(uint8_t received_data) {
  data = received_data;
  printf("Arduino received: %d\r\n", data);
}

void I2C_requested() {
  // 255 is currently the signal to send and collect data
  int i,len;
  char data_str_temp[20];
  //char data_str[20*NUMBER_OF_SENSORS];
  if (data == 255) {
    sprintf(data_str,""); // clear data_str
    // Collect data from attached sensors
    collectforceData(fData);

    for (i=0;i<NUMBER_OF_SENSORS;i++){
      sprintf(data_str_temp,"f%d:%lu,",i,fData[i]);
      strcat(data_str,data_str_temp);
    }
    I2C_transmitByte(strlen(data_str));

  }
  
  else {
    I2C_transmitByte(data_str[data]);
  }
}

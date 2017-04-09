import requests
import json
import datetime

import serial
import RPI.GPIO as GPIO
from time import sleep

pin = 16
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.BCM)

ser = serial.Serial('/dev/ttyACM0', 9600)
s = [0]
content_count = 0
  
URL = "http://localhost:3000/"
      
data = {}

while True:
    if content_count < 4:
        content_count += 1;
        data_name = 'sensor' + str(content_count)
        read_serial = ser.readline()
        s[0] = float(read_serial, pin)
        data[data_name] = s[0]
        GPIO.output(pin, GPIO.HIGH)
        sleep(.2)
        GPIO.output(pin, GPIO.LOW)
    else:
        read_serial = ser.readline()
        s[0] = str(read_serial, pin)
        data['text'] = s[0]
        GPIO.output(pin, GPIO.HIGH)
        content_count = 0
        json_data = json.dumps(data)
        headers = {'content-type': 'application/json'}
        r = requests.post(url=URL, data=json_data, headers=headers)
        print r.text
        sleep(.5)
        GPIO.output(pin, GPIO.LOW)

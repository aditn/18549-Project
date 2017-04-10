import requests
import json
import datetime

import serial
import RPi.GPIO as GPIO
from time import sleep

#pin = 16
#GPIO.setwarnings(False)
#GPIO.setmode(GPIO.BCM)
#GPIO.setup(pin, GPIO.BCM)

ser = serial.Serial('/dev/ttyS0', 115200)
#s = [0]
#content_count = 0
  

URL = "http://localhost:3000/"

sleep(3)
data = {}
a = []
b = []
while True:
    ser.write("f") # f is used to collect force sensor data
    #data_name = 'sensor' + str(content_count)
    read_serial_str = ser.readline()
    a = read_serial_str.split(",")
    for i in a:
        b.append(i.split(":"))
    for i in b:
        data[i[0]] = float(i[1])
    print(data) #make post request here
    json_data = json.dumps(data)
    headers = {'content-type': 'application/json'}
    r = requests.post(url=URL, data=json_data, headers=headers)
    sleep(5)

    '''
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
        GPIO.output(pin, GPIO.LOW)'''


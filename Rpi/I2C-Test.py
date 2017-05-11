 # -*- coding: utf-8 -*-


import smbus
import time
import requests
import json
import datetime

time.sleep(17);

# for RPI version 1, use “bus = smbus.SMBus(0)”
bus = smbus.SMBus(1)

URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80"

addresses = [0x04, 0x08] #08 IS ARDUINO
sleepTimes = [0.1,0]
mcu = 0

sensor1_calib_factor = 10569
sensor2_calib_factor = 12312
sensor3_calib_factor = 16923
sensor4_calib_factor = 5077

def writeNumber(mcu, value):
    bus.write_byte(addresses[mcu], value)
    return -1

def readNumber(mcu):
    number = bus.read_byte(addresses[mcu])
    return number


while True:
    msg = ""
    a=[]
    b=[]
    data={}
    var = 255
    mcu = 0
    
    
    for mcu in range(len(addresses)):
        writeNumber(mcu, var) # --> Can be changed to send letter or something
        #print "RPI: Hi mcu",mcu,", I sent you ", var
    
        num_bytes = readNumber(mcu) # Arduino responds with number of bytes in data string
        #print "Bytes number is: ", num_bytes
        time.sleep(sleepTimes[mcu])

        # Receive every byte transmitted from slave and recreate data string
        for i in xrange(num_bytes):
            writeNumber(mcu, i)
            char = readNumber(mcu)
            msg += chr(char)

     ##### Json parsing to post w/ real data #####
 #   print(msg)
    a = msg.split(",")
    a[len(a)-1] = a[len(a)-1].split('\n')[0]
    #print repr(a.pop()) # Popping empty string of last element from comma split
    for i in a:
        b.append(i.split(":"))
    for i in b:
        data[i[0]] = abs(float(i[1]))
    #make post request here
    # Add text to data with orig.update(new) #

    data['sensor1'] = (data['sensor1']*12000)/sensor1_calib_factor
    data['sensor2'] = (data['sensor2']*11000)/sensor2_calib_factor
    data['sensor3'] = (data['sensor3']*11000)/sensor3_calib_factor
    data['sensor4'] = (data['sensor4']*11000)/sensor4_calib_factor
    
    print data
    #data.update({"sensor3": 100, "sensor4": 100, "text": "Demo test"})

    json_data = json.dumps(data)
    headers = {'content-type': 'application/json'}

    tries = 0
    while tries < 3:
        try:
            r = requests.post(url=URL, data=json_data, headers=headers, timeout=2)
        except requests.exceptions.RequestException as e:
            print e
        tries += 1

    print r.text # Received request or not
    ##### Json parsing to post w/ real data #####

    #print "Data we sent is: ", data

    print

    time.sleep(1)


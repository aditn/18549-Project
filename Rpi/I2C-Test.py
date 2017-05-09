 # -*- coding: utf-8 -*-


import smbus
import time
import requests
import json
import datetime


# for RPI version 1, use “bus = smbus.SMBus(0)”
bus = smbus.SMBus(1)

URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80"

addresses = [0x04, 0x08] #08 IS ARDUINO
sleepTimes = [0.1,0]
mcu = 0

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
    #var = input("Enter number (255 to begin data collection): ")
    #mcu = input("Enter 0, 1: ")
    var = 255
    mcu = 0
   
 
    if not var: continue
    
    for mcu in range(2):
        writeNumber(mcu, var) # --> Can be changed to send letter or something
        print "RPI: Hi mcu",mcu,", I sent you ", var
    
        num_bytes = readNumber(mcu) # Arduino responds with number of bytes in data string
        print "Bytes number is: ", num_bytes
        time.sleep(sleepTimes[i])

        # Receive every byte transmitted from slave and recreate data string
        for i in xrange(num_bytes):
            writeNumber(mcu, i)
            char = readNumber(mcu)
            msg += chr(char)

      ##### Json parsing to post w/ real data #####
      a = msg.split(",")
      a.pop() # Popping empty string of last element from comma split
      for i in a:
          b.append(i.split(":"))
      for i in b:
          data[i[0]] = abs(float(i[1]))
    #make post request here
    # Add text to data with orig.update(new) #

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


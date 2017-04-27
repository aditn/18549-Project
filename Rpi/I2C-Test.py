 # -*- coding: utf-8 -*-
import smbus
import time
import requests
import json
import datetime

# for RPI version 1, use “bus = smbus.SMBus(0)”
bus = smbus.SMBus(1)

URL = "" #put the URL here

addresses = [0x04, 0x08] #08 IS ARDUINO

def writeNumber(mcu, value):
    bus.write_byte(addresses[mcu], value)
    return -1

def readNumber(mcu):
    number = bus.read_byte(addresses[mcu])
    return number


while True:
    msg = ""
    
    var = input("Enter number (255 to begin data collection): ")
    mcu = input("Enter 0, 1: ")
    
    if not var: continue
    #print "I have a number..."
    
    writeNumber(mcu, var) # --> Can be changed to send letter or something
    
    print "RPI: Hi Arduino, I sent you ", var
    time.sleep(1)
    
    num_bytes = readNumber(mcu) # Arduino responds with number of bytes in data string
    time.sleep(.2)

    # Receive every byte transmitted from slave and recreate data string
    for i in xrange(num_bytes):
        writeNumber(mcu, i)
        char = readNumber(mcu)
        print "RPI: Received --> ", char
        msg += chr(char)

    ##### Json parsing to post w/ real data #####
    a = msg.split(",")
    for i in a:
        b.append(i.split(":"))
    for i in b:
        data[i[0]] = float(i[1])
    print(data) #make post request here
    json_data = json.dumps(data)
    headers = {'content-type': 'application/json'}
    r = requests.post(url=URL, data=json_data, headers=headers)
    ##### Json parsing to post w/ real data #####
        

    print "arduino: ", msg

    print

#     F#:1234,F#:1234,

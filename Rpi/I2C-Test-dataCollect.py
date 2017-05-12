 # -*- coding: utf-8 -*-


import smbus
import time
import requests
import json
import datetime
import numpy

time.sleep(17); # allow for load cells to tare 

# for RPI version 1, use “bus = smbus.SMBus(0)”
bus = smbus.SMBus(1)

addresses = [0x04, 0x08] #08 IS ARDUINO
mcu = 0

sensor1_calib_factor = 10569
sensor2_calib_factor = 12312
sensor3_calib_factor = 16923
sensor4_calib_factor = 15077

def writeNumber(mcu, value):
    bus.write_byte(addresses[mcu], value)
    return -1

def readNumber(mcu):
    number = bus.read_byte(addresses[mcu])
    return number


print "0: sitBackPushIntoRestGoodPosture"
print "1: sitBackSlightLeanForwardGoodPosture"
print "2: sitBackSlouchBadPosture"
print "3: fullSlouchButtFoward"
print "4: fullSlouchButtFoward"
print "5: leanLeft"
print "6: leanRight"
print "7: leanFoward"
t = raw_input("Choose your position: ");

options = {0:"sitBackPushIntoRestGoodPosture",
           1:"sitBackSlightLeanForwardGoodPosture",
           2:"sitBackSlouchBadPosture",
           3:"fullSlouchButtFoward",
           4:"fullSlouchButtFoward",
           5:"leanLeft",
           6:"leanRight",
           7:"leanFoward",
           }
fileName = options[t]

times = 30
for x in range(times):
    msg = ""
    a=[]
    b=[]
    data={}
    stats={}

    var = 255
    mcu = 0

    if not var: continue

    for mcu in range(len(addresses)):
        writeNumber(mcu, var) # --> Can be changed to send letter or something
    
        num_bytes = readNumber(mcu) # Arduino responds with number of bytes in data string

        # Receive every byte transmitted from slave and recreate data string
        for i in xrange(num_bytes):
            writeNumber(mcu, i)
            char = readNumber(mcu)
            msg += chr(char)

    ##### Json parsing to post w/ real data #####
    a = msg.split(",")
    a[len(a)-1] = a[len(a)-1].split('\n')[0]
    print repr(a.pop()) # Popping last buffer element
    for i in a:
        b.append(i.split(":"))
    for i in b:
        data[i[0]] = []
        data[i[0]].append(abs(float(i[1])))
        stats[i[0]] = []

    data['sensor1'] = (data['sensor1']*12000)/sensor1_calib_factor
    data['sensor2'] = (data['sensor2']*11000)/sensor2_calib_factor
    data['sensor3'] = (data['sensor3']*11000)/sensor3_calib_factor
    data['sensor4'] = (data['sensor4']*11000)/sensor4_calib_factor
    
    print data
    print stats
    print

for y in data:
    stats[y].append(sum(data[y])/times)
    stats[y].append(numpy.std(data[y]))

print data
target = open(fileName,'w')
target.write(stats)
target.close(stats)

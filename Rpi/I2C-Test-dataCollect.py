 # -*- coding: utf-8 -*-


import smbus
import time
import requests
import json
import datetime
import numpy

#time.sleep(17); # allow for load cells to tare 

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
print "4: leanLeft"
print "5: leanRight"
print "6: leanFoward"
t = raw_input("Choose your position: ");

options = {"0":"sitBackPushIntoRestGoodPosture",
           "1":"sitBackSlightLeanForwardGoodPosture",
           "2":"sitBackSlouchBadPosture",
           "3":"fullSlouchButtFoward",
           "4":"leanLeft",
           "5":"leanRight",
           "6":"leanFoward",
           }
fileName = options[t] +".json"

data={}
stats={}
times = 30
for x in range(times):
    print "x: ",x
    msg = ""
    a=[]
    b=[]

    var = 255

    for mcu in range(len(addresses)):
        writeNumber(mcu, var) # --> Can be changed to send letter or something
    
        num_bytes = readNumber(mcu) # Arduino responds with number of bytes in data string

        # Receive every byte transmitted from slave and recreate data string
        for i in xrange(num_bytes):
            writeNumber(mcu, i)
            char = readNumber(mcu)
            msg += chr(char)

    ##### Json parsing to post w/ real data #####
    #print msg
    a = msg.split(",")
    a[len(a)-1] = a[len(a)-1].split('\n')[0]
    repr(a.pop()) # Popping last buffer element
    for i in a:
        b.append(i.split(":"))
#    print b
    for i in b:
        if x==0:
          data[i[0]] = []
          stats[i[0]] = []
        data[i[0]].append(abs(float(i[1])))
    #print data

    data['sensor1'][x] = (data['sensor1'][x]*12000)/sensor1_calib_factor
    data['sensor2'][x] = (data['sensor2'][x]*11000)/sensor2_calib_factor
    data['sensor3'][x] = (data['sensor3'][x]*11000)/sensor3_calib_factor
    data['sensor4'][x] = (data['sensor4'][x]*11000)/sensor4_calib_factor
    
    #print data
    #print stats
    print

for y in data:
    stats[y].append(sum(data[y])/times)
    stats[y].append(numpy.std(data[y]))

#json_stats = json_dumps(stats)

#print stats
with open(fileName,'w') as f:
    json.dump(stats,f)


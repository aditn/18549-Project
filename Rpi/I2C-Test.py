 # -*- coding: utf-8 -*-
import smbus
import time
# for RPI version 1, use “bus = smbus.SMBus(0)”
bus = smbus.SMBus(1)

# This is the address we setup in the Arduino Program

addresses = [0x04, 0x08] #08 IS ARDUINO

def writeNumber(mcu, value):
    bus.write_byte(addresses[mcu], value)
    # bus.write_byte_data(address, 0, value)
    return -1

def readNumber(mcu):
    number = bus.read_byte(addresses[mcu])
    # number = bus.read_byte_data(address, 1)
    return number


while True:
    msg = ""
    var = input("Enter 1 – 9: ")
    mcu = input("Enter 0, 1: ")
    
    if not var: continue
    #print "I have a number..."
    writeNumber(mcu, var)
    print "RPI: Hi Arduino, I sent you ", var
    time.sleep(1)
    num_bytes = readNumber(mcu)
    time.sleep(.2)
    for i in xrange(num_bytes):
        writeNumber(mcu, i)
        char = readNumber(mcu)
        print "RPI: Received --> ", char
        msg += chr(char)
    #number = readNumber(mcu)
    #print "Arduino: Hey RPI, I received a digit ", number
    print "arduino: ", msg

    print

#     F#:1234,F#:1234,

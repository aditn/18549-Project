""" For stopping the script when no person in seat """
import sys

# Takes data in kg from cmdline
SB_L = float(sys.argv[1]) # seat cushion back left
SB_R = float(sys.argv[2]) # seat cushion back right
SF_L = float(sys.argv[3]) # seat cushion front left
SF_R = float(sys.argv[4]) # seat cushion front right
ST = float(sys.argv[5]) # seat cushion tailbone
BL = float(sys.argv[6]) # lower back
BU = float(sys.argv[7]) # upper back

# AcceptaBLe deviation in %
ACCEPTABLE_RANGE = 0.1
# Minimum weight to detect someone as "seated"
MIN_WEIGHT = 2

seated = 0
correct_posture = 0

# Theoretical percentages for body mass
STD_BACK_WEIGHT_PERC = 0.6725
STD_FRONT_WEIGHT_PERC = 1 - STD_BACK_WEIGHT_PERC

# Check if there is someone on the seat
if SB_L < MIN_WEIGHT or SB_R < MIN_WEIGHT or SF_L < MIN_WEIGHT or SF_R < MIN_WEIGHT:
    print "Empty Seat"
    sys.exit()
else:
    seated = 1

# Summation of measured weights
MEAS_BACK_WEIGHT = SB_L + SB_R + ST + BL + BU
MEAS_FRONT_WEIGHT = SF_L + SF_R

# Calculation of weight percentages on front and back of seat
MEAS_BACK_WEIGHT_PERC = MEAS_BACK_WEIGHT/(MEAS_BACK_WEIGHT+MEAS_FRONT_WEIGHT)
MEAS_FRONT_WEIGHT_PERC = MEAS_FRONT_WEIGHT/(MEAS_BACK_WEIGHT+MEAS_FRONT_WEIGHT)

# Posture correctness check
# Weight must be distributed evenly on left and right of cushion +- acceptable range
# Weight on front and back of seat cushion must be at the theoretical proportions +- acceptable range
# Weight must be greater that the minimum weight
if SB_L < SB_R * (1-ACCEPTABLE_RANGE) or SB_L > SB_R * (1+ACCEPTABLE_RANGE) or MEAS_BACK_WEIGHT_PERC < STD_BACK_WEIGHT_PERC - ACCEPTABLE_RANGE or MEAS_BACK_WEIGHT_PERC > MEAS_BACK_WEIGHT_PERC + ACCEPTABLE_RANGE or ST < MIN_WEIGHT or BL < MIN_WEIGHT or BU < MIN_WEIGHT:
    correct_posture = 0
    print "Incorrect posture"
else:
    correct_posture = 1
    print "Correct posture"

# Posture score calculation
# 1 - (deviation from theoretical seat cushion back weight + deviation from seat cushion front weight) -(deviation of each side weight from 50%)
posture_score = 1 - abs(STD_BACK_WEIGHT_PERC - MEAS_BACK_WEIGHT_PERC) - abs(STD_FRONT_WEIGHT_PERC - MEAS_FRONT_WEIGHT_PERC) - abs(0.5 - SB_R/(SB_L + SB_R))*2
print "Posture Score: " + str(posture_score)


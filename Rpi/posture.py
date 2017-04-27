import time
import sys

sb_l1 = float(sys.argv[1])
sb_r1 = float(sys.argv[2])
sb_l2 = float(sys.argv[3])
sb_r2 = float(sys.argv[4])
sb_l = sb_l1 + sb_l2
sb_r = sb_r1 + sb_r2
sf_l = float(sys.argv[5])
sf_r = float(sys.argv[6])
st = float(sys.argv[7])
bl = float(sys.argv[8])
bu = float(sys.argv[9])
acceptable_range = 0.1

seated = 0
correct_posture = 0

std_upper_weight_perc = 0.6725
std_lower_weight_perc = 1 - std_upper_weight_perc

print sys.argv

#loop
if sb_l1 < 50 or sb_r1 < 50 or sf_l < 50 or sf_r < 50:
    seated = 0
    print "Empty Seat"
    sys.exit()
else:
    seated = 1

meas_upper_weight = sb_l + sb_r + st + bl + bu
meas_lower_weight = sf_l + sf_r

meas_upper_weight_perc = meas_upper_weight/(meas_upper_weight+meas_lower_weight)
meas_lower_weight_perc = meas_lower_weight/(meas_upper_weight+meas_lower_weight)

if sb_l < sb_r * (1-acceptable_range) or sb_l > sb_r * (1+acceptable_range) or meas_upper_weight_perc < std_upper_weight_perc - acceptable_range or meas_upper_weight_perc > meas_upper_weight_perc + acceptable_range or st < 50 or bl < 50 or bu < 50:
    correct_posture = 0
    print "Incorrect posture"
else:
    correct_posture = 1
    print "Correct posture"

posture_score = 1 - 0.6*(abs(std_upper_weight_perc - meas_upper_weight_perc) - abs(std_lower_weight_perc - meas_lower_weight_perc)) - 0.4*abs(sb_r/(sb_l + sb_r))
print "Posture Score: " + str(posture_score)


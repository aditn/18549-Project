import requests
import json
import time
  
URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80/data2"
PARAMS = {'number': 1} # number of rows of most recent data

while True:
    r = requests.get(url=URL, params=PARAMS)
    json = r.json()[0]
    #print json
    print 'Timestamp: ' + json['timestamp']
    print 'sb_l (s1): ' + str(json['sb_l_weight'])
    print 'sb_r (s2): ' + str(json['sb_r_weight'])
    print 'sf_r (s3): ' + str(json['sf_r_weight'])
    print 'sf_l (s4): ' + str(json['sf_l_weight'])
    print 'st (fsr1): ' + str(json['st'])
    print 'bl (fsr2): ' + str(json['bl'])
    print 'bu (fsr3): ' + str(json['bl'])
    time.sleep(1)

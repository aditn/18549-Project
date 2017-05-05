<-------------POST-------------->

For Data: <br />
URL = http://pstr-env.us-east-2.elasticbeanstalk.com:80 <br />

JSON Format: <br />
{'sensor1': (float), <br />
 'sensor2': (float), <br />
 'sensor3': (float), <br />
 'sensor4': (float), <br />
 'fsr1': (float), <br />
 'fsr2': (float), <br />
 'fsr3': (float)} <br />

For Users: <br />
URL = http://pstr-env.us-east-2.elasticbeanstalk.com:80/user <br />

JSON Format: <br />
{'user': (String)} <br />
max 20 characters


<--------------GET---------------->

GET request JSON array format:

GET URL: http://pstr-env.us-east-2.elasticbeanstalk.com:80/data2 <br />

JSON Format: <br />
[{'id': (int), <br />
  'user': (String), <br />
  'sb_l_weight': (float), // seat cushion back left sensor <br />
  'sb_r_weight': (float), // seat cushion back right sensor <br />
  'sf_l_weight': (float), // seat cushion front left sensor <br />
  'sf_r_weight': (float), // seat cushion front right sensor <br />
  'st': (float), // seat tailbone sensor <br />
  'bl': (float), // seat lower back sensor <br />
  'bu': (float), // seat upper back sensor <br />
  'sb_l_perc': (float), // seat cushion back left weight percentage (0-1) <br />
  'sb_r_perc': (float), // seat cushion back rightweight percentage (0-1) <br />
  'sf_l_perc': (float), // seat cushion front left weight percentage (0-1) <br />
  'sf_r_perc': (float), // seat cushion front right weight percentage (0-1) <br />
  'correct': (int), // 1 for correct posture, 0 for incorrect posture <br />
  'score': (float), // posture score (0-1) <br />
  'timestamp': (timestamp)},
 {...},
 {...}]

Optional parameters: {'number' = (int), 'user' = (String)}<br />
If 'number' specified, will give the N most recent entries. Otherwise gives all entries.<br />
If 'user' specified, will give the data for that user. Otherwise gives the data for the default test user.

Server URL = http://pstr-env.us-east-2.elasticbeanstalk.com:80

<-------------POST-------------->

POST request JSON format:

{'sensor1': (float),
 'sensor2': (float),
 'sensor3': (float),
 'sensor4': (float),
 'fsr1': (float),
 'fsr2': (float),
 'fsr3': (float)}


<--------------GET---------------->

GET request JSON array format:

GET URL: http://pstr-env.us-east-2.elasticbeanstalk.com:80/data2

[{'id': (int), 
  'user': (String),
  'sb_l_weight': (float), 
  'sb_r_weight': (float), 
  'sf_l_weight': (float), 
  'sf_r_weight': (float),
  'st': (float),
  'bl': (float),
  'bu': (float),
  'sb_l_perc': (float),
  'sb_r_perc': (float),
  'sf_l_perc': (float),
  'sf_r_perc': (float),
  'correct': (int),
  'score': (float),
  'timestamp': (timestamp)},
 {...},
 {...}]

Optional parameter: {'number' = (int)}
If specified, will give the N most recent entries.
If not specified, will give all entries in database.

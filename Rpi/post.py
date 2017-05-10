import requests
import json
  
#URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80"
URL = "http://localhost:3000"

data = {}
data['sensor1'] = 30
data['sensor2'] = 40
data['sensor3'] = 4
data['sensor4'] = 3
data['fsr1'] = 7;
data['fsr2'] = 4;
data['fsr3'] = 4;
json_data = json.dumps(data)
print json_data
              
headers = {'content-type': 'application/json'}
r = requests.post(url=URL, data=json_data, headers=headers, timeout=2)
print r.text

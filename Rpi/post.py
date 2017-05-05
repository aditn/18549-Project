import requests
import json
  
#URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80"
URL = "http://localhost:3000"

data = {}
data['sensor1'] = 50
data['sensor2'] = 50
data['sensor3'] = 22
data['sensor4'] = 22
data['st'] = 4;
data['bl'] = 4;
data['bu'] = 4;
json_data = json.dumps(data)
print json_data
              
headers = {'content-type': 'application/json'}
r = requests.post(url=URL, data=json_data, headers=headers, timeout=2)
print r.text

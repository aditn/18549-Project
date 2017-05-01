import requests
import json
  
URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80"
#URL = "http://localhost:3000"

data = {}
data['sensor1'] = 12
data['sensor2'] = 24
data['sensor3'] = 31
data['sensor4'] = 44
data['text'] = "time"
json_data = json.dumps(data)
print json_data
              
headers = {'content-type': 'application/json'}
r = requests.post(url=URL, data=json_data, headers=headers, timeout=2)
print r.text

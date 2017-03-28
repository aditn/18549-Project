import requests
import json
import datetime
  
URL = "http://localhost:3000/"
      
data = {}
data['sensor1'] = 1.1
data['sensor2'] = 2.2
data['sensor3'] = 3.3
data['sensor4'] = 4.4
data['timestamp'] = "time"
json_data = json.dumps(data)
print json_data
              
headers = {'content-type': 'application/json'}
r = requests.post(url=URL, data=json_data, headers=headers)
print r.text

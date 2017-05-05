import requests
import json
  
#URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80"
URL = "http://localhost:3000/user"

data = {'user': 'test4'};
json_data = json.dumps(data)
              
'''headers = {'content-type': 'application/json'}
r = requests.post(url=URL, data=json_data, headers=headers, timeout=2)
print r.text'''

r1 = requests.get(url=URL, params=data, timeout=2);
print r1.json()

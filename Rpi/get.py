import requests
import json
  
URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80/data"
#URL = "http://localhost:3000/data"
PARAMS = {'number': 10}
              
r = requests.get(url=URL, params=PARAMS)
#json = json.dumps(r.text)
json = r.json()
print json

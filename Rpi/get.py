import requests
import json
  
URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80/data"
#URL = "http://localhost:3000/data"
PARAMS = {'number': 1} # number of rows of most recent data
              
r = requests.get(url=URL, params=PARAMS)
json = r.json()
print json

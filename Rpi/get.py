import requests
import json
  
#URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80/data"
URL = "http://localhost:3000/data2"
PARAMS = {'number': 10} # number of rows of most recent data
              
r = requests.get(url=URL, params=PARAMS)
json = r.json()
print json

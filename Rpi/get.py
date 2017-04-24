import requests
  
#URL = "http://pstr-env.us-east-2.elasticbeanstalk.com:80/"
URL = "http://localhost:3000/sensor_data"
              
r = requests.get(url=URL, params={})
print r.text
json = r.json()
#print json

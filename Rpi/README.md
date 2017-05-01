Server URL = http://pstr-env.us-east-2.elasticbeanstalk.com:80

<-------------POST-------------->

POST request JSON format:

{'sensor1': <int>,
 'sensor2': <int>,
 'sensor3': <int>,
 'sensor4': <int>,
 'text': <String>}


<--------------GET---------------->

GET request JSON array format:

[{'id': <int>, 'sensor1': <int>, 'sensor2': <int>, 'sensor3': <int>, 'sensor4': <int>, 'text': <String>},
 {...},
 {...}]

Optional parameter: {'number' = <int>}
If specified, will give the N most recent entries.
If not specified, will give all entries in database.

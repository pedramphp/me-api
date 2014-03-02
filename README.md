Me Services
====================


How to run the server
--
```node
npm install // to download all the dependencies
node app.js


For auto connection use nodemon

Install Nodemon
npm install -g nodemon


starting the server
nodemon app.js
```

Service Urls And Access Token generation
--
```node

Base Url: http://127.0.0.1:[PORT]

Go to https://github.com/pedramphp/me-services/blob/master/server/rest-server.js
and change SERVER_IP_ADDRESS and SERVER_PORT.

* Instagram Authentication:         /instagram/auth/[AUTH_TOKEN]
* Instagram Friends Activity Feed:  /instagram/user_feed/[ACCESS_TOKEN]
* Facebook Friends Activity Feed:  /facebook/user_feed/[ACCESS_TOKEN]
* Twitter Friends Activity Feed:  /twitter/user_feed/[ACCESS_TOKEN]
* Me Friends Activity Timeline:   /timeline/home




Facebook Access Token:
----------------------
http://mergify.com/facebook/test.html

open the the console and copy the access token


Instagram Access Token:
--------------------------
http://mergify.com/me-services/test/index.html

it will redirect to this url

http://mergify.com/instagram/test?code=5920d42bf5094ab1866cd25cdb12b27c

copy the code and that is your access_token


url for the code
https://github.com/pedramphp/me-services/blob/master/test/index.html


```


Install Redis:
---

You don't need to install redis now!
install redis in your machine after installing run the "redis-server" command

* [Redis Quickstart] - Redis databse


```node
redis-server
```

Node JS Logging Framework
--

* [Winston Logger] - Winston Logging framework docs.


Markdown Helper
--
* [MD Markdown] - Markdown helper tool



[Winston Logger]:https://github.com/flatiron/winston
[Redis Quickstart]:http://redis.io/topics/quickstart
[MD Markdown]:http://dillinger.io/




Me Services
====================


```node
redis-server
```

How to run the server
--
```node
npm install // to download all the dependencies
node app.js
```

Service Urls
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
```


Install Redis:
---

You don't need to install redis now!
install redis in your machine after installing run the "redis-server" command

* [Redis Quickstart] - Redis databse


[Redis Quickstart]:http://redis.io/topics/quickstart

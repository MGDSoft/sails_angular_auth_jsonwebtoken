sails_angular_auth_jwt
==================================

[![Build Status](https://secure.travis-ci.org/MGDSoft/sails_angular_auth_jsonwebtoken.png)](http://travis-ci.org/MGDSoft/lolreferrals)

Testing jwt, angular and sails. Htmls and some js angular has been taken from https://github.com/fnakstad/angular-client-side-auth (Frederik Nakstad).

JsonWebToken server side: A salt is generated (password) automatically per user. Then the salt is used to create the encrypted password (as regular...). Also with the salt + Date a user-token is generated and stored Date in the DB. By being unique per user, with this we want each time the user logs in the token is refreshed.
To remember the user, a cookie is created with an unique ID (it's only possible to remember the user in one place). The client has a N of tries to authenticate, if he fails them the account will be frozen.

Client-side : It's based in the LocalStore.user and LocalStore.token received from the server when the user authenticates.
Through js angular and his interceptor method, if it contains a LocalStore.token valor it will be sended as header authorization (config.headers.Authorization = localStorage.token) on each request.

PD: Use Polyfill because not all the browsers support LocalStorage.

Version live http://sails-angular-jwt.herokuapp.com/

# Start the project locally

```bash
$ git clone https://github.com/MGDSoft/sails_angular_client_side_auth_jwt.git
$ cd sails_angular_client_side_auth_jwt
$ cp config/local.example.js config/local.js
$ npm install && node app
```

# Test server side

```bash
$ npm test
```

# Libs used

### Server Side

- SailsJs
- jws https://github.com/brianloveswords/node-jws
- Sockets to notify realtime info
- recaptcha https://github.com/mirhampt/node-recaptcha

### Client Side

- AngularJs
- ui.router https://github.com/angular-ui/ui-router
- NgCookies
- Angular Sails https://github.com/kyjan/angular-sails
- Less
- Recaptcha https://github.com/mllrsohn/angular-re-captcha
- angular-translate https://github.com/angular-translate/angular-translate
- animations


# Todo

- Change http petitions to sockets petitions
- testing client side


### All pull request are welcome !!
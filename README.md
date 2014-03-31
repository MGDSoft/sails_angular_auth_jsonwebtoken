sails_angular_client_side_auth_jwt
==================================

Playing with jwt, angular and sails. Html and some js angular has been taken from https://github.com/fnakstad/angular-client-side-auth (Frederik Nakstad).

JsonWebToken server side, salt will be generate automatically per user. With that salt we create his password encrypted (normal..). His salt + Date generate then token and its saved in DB
, only want 1 valid token key per user. If user do other login token will be updated.

Client side send all time token in header (if client have it in LocalStorage...). I use localStorage but it isn`t valid in all browsers u can use polyfill.

The user only has N possibilities for authentication and when that fails exceeds the user is locked.

# Start the project locally

```bash
$ git clone https://github.com/MGDSoft/sails_angular_client_side_auth_jwt.git
# create config/local and configure your db in models
$ cd sails_angular-client-side-auth
$ npm install && bower install && node app


### All pull request are welcome !!
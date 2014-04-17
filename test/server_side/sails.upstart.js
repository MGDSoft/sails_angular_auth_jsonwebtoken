var Sails = require('sails/lib/app')
    ,sails = new Sails()
;
/*
 Global before() and after() launcher for Sails application
 to run tests like Controller and Models test
 */

before(function(done) {

    // Lift Sails and store the app reference
    sails.lift({

        environment: 'testing',
        port: 4000,

        // turn down the log level so we can view the test results
        log: {
            level: 'error'
        },
        models: {
            connection: 'memory'
        },
        "hooks": {
            "grunt": false
        }

    }, function(err, sails) {

        // export properties for upcoming tests with supertest.js
        sails.localAppURL = localAppURL = ( sails.usingSSL ? 'https' : 'http' ) + '://' + sails.config.host + ':' + sails.config.port + '';
        // save reference for teardown function
        done(err);
    });

});

// After Function
after(function(done) {
    sails.lower(done);
});


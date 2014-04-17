var Sails = require('sails/lib/app')
    , sails = new Sails()
    , exec = require('child_process').exec
;

sails.lift(
    {
        environment: 'testing',
        port       : 4000,
        host       : 'localhost',
        // turn down the log level so we can view the test results
        log        : {
            level: 'error'
        },
        models     : {
            connection: 'memory'
        }
    }
    , function (err, sails) {

        sails.localAppURL = localAppURL = ( sails.usingSSL ? 'https' : 'http' ) + '://' + sails.config.host + ':' + sails.config.port + '';

        console.log("Sails Running " + sails.localAppURL);

        var command = 'protractor ./test/e2e/.protractor.conf.js --baseUrl ' + localAppURL;

        console.log("Running " + command);

        exec(command, function (error, stdout, stderr) {

            console.log(stdout);
            console.log(stderr);

            if (error !== null) {
                console.log('exec error: ' + error);
                process.exit(1);
            }

            sails.lower();
            process.exit(0);
        });

    });

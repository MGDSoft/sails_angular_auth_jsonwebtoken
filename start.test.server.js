var exec = require('child_process').exec;

var command = "mocha ./test/server_side";

exec(command, function (error, stdout, stderr) {

    console.log(stdout);
    console.log(stderr);

    if (error !== null) {
        console.log('exec error: ' + error);
        process.exit(1);
    }

    process.exit(0);
});

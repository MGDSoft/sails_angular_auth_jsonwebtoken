var exec = require('child_process').exec;

function result(error, stdout, stderr)
{
    console.log(stdout);
    console.log(stderr);

    if (error!==null)
        process.exit(1);

}

exec("node "+__dirname+"/start.test.server", function (error, stdout, stderr) {

    result(error, stdout, stderr);

    exec("node "+__dirname+"/start.test.e2e", function (error, stdout, stderr) {

        result(error, stdout, stderr);

        console.log("SUCCESS!!");
        process.exit(0);
    });
});

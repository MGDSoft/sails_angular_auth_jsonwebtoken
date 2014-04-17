var ptor = protractor.getInstance();

ptor.getCapabilities().then(function (capabilities) {
    global.browsername = capabilities.caps_.browserName;

    ptor.params.login.username += global.browsername.substring(0,5);

});
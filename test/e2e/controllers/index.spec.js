var login = require('../libs/login')
    register = require('../libs/register')
    ;

describe("Navigation", function(){

    var ptor = protractor.getInstance();

    it("Register -> Login -> Logout -> Login -> Delete Account", function(){


        register.go();

        register.formFilling();
        register.submitClick();
        register.verifyFormIsOk();

        login.goClick();
        login.formFilling();
        login.submitClick();
        login.verifyFormIsOk();

        login.goLogoutClick();

        login.formFilling();
        login.submitClick();
        login.verifyFormIsOk();

        login.goDeleteAccountClick();

        login.formFilling();
        login.submitClick();
        login.verifyFormIsWrong();

    });

});
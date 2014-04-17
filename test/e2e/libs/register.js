var Page = require('astrolabe').Page;

module.exports = Page.create({

    url: { value: '/register' },
    formName: { value: 'registerForm' },

    goClick: {
        value: function () {
            this.findElement(this.by.xpath('//ul[contains(@class, "nav")]//a[contains(@href, "'+ this.url +'")]')).click();
        }
    },

    getUsername: {
        value: function () {
            return  this.findElement(this.by.model('username'))
        }
    },

    setUsername: {
        value: function (username) {
            this.getUsername().sendKeys(username);
        }
    },

    getPassword: {
        value: function () {
            return  this.findElement(this.by.model('password'))
        }
    },

    setPassword: {
        value: function (password) {
            this.getPassword().sendKeys(password);
        }
    },

    setRole: {
        value: function (admin) {

            var selector = '(//form[@name="'+this.formName+'"]//input[@name="role"])';

            if (admin)
                selector += '[1]';
            else
                selector += '[2]';

            this.findElement(this.by.xpath(selector)).click();
        }
    },

    getCaptcha: {
        value: function () {
            return  this.findElement(this.by.id('recaptcha_response_field'))
        }
    },

    setCaptcha: {
        value: function (valid) {

            if (valid)
                this.getCaptcha().sendKeys('true');
            else
                this.getCaptcha().sendKeys('false');

        }
    },

    submitClick:  {
        value: function (){
            this.findElement(this.by.xpath('//form[@name="'+this.formName+'"]//button[@type="submit"]')).click();
        }
    },

    verifyFormIsOk: {
        value: function (){
            var ref = this;
            this.driver.wait(
                function (){
                    return ref.findElement(ref.by.xpath('//p[contains(@class, "alert-success") and text()=" Your account was saved!"]')).isDisplayed();
                }
            );
        }
    },

    formFilling: {
        value: function(username, password, adminBoo, captchaBoo) {

            username = username || this.driver.params.login.username;
            password = password || this.driver.params.login.password;
            adminBoo = adminBoo || true;
            captchaBoo = captchaBoo || true;

            this.setUsername(username);
            this.setPassword(password);
            this.setRole(adminBoo);
            this.setCaptcha(captchaBoo);
        }
    }

});

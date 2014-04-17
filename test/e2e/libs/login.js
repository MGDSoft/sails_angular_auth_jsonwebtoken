var Page = require('astrolabe').Page;

module.exports = Page.create({

    url: { value: '/login' },

    goClick: {
        value: function () {
            this.findElement(this.by.xpath('//ul[contains(@class, "nav")]//a[contains(@href, "'+ this.url +'")]')).click();
        }
    },

    goLogoutClick: {
        value: function () {
            this.findElement(this.by.xpath('//ul[contains(@class, "nav")]//a[text()="Log out"]')).click();
        }
    },

    goDeleteAccountClick: {
        value: function () {
            this.findElement(this.by.xpath('//ul[contains(@class, "nav")]//a[text()="Delete Account"]')).click();
        }
    },


    getUsername: {
        value: function () {
            return  this.findElement(this.by.model('username'));
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

    submitClick:  {
        value: function (){
            this.findElement(this.by.xpath('//form[@name="loginForm"]//button[@type="submit"]')).click();
        }
    },

    verifyFormIsOk: {
        value: function (username){

            username = username || this.driver.params.login.username;

            var ref = this;
            this.driver.wait(
                function (){
                    return ref.findElement(ref.by.xpath('//div[@id="userInfo"]//strong[text()=" '+username+' "]')).isDisplayed();
                }
            );
        }
    },

    verifyFormIsWrong: {
        value: function (username){

            username = username || this.driver.params.login.username;

            var ref = this;
            this.driver.wait(
                function (){
                    return ref.findElement(ref.by.xpath('//p[contains(@class, "alert-danger") and text()=" Incorrect username."]')).isDisplayed();
                }
            );
        }
    },

    formFilling: {
        value: function(username, password) {

            username = username || this.driver.params.login.username;
            password = password || this.driver.params.login.password;

            this.setUsername(username);
            this.setPassword(password);
        }
    }

});

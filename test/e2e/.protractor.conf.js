exports.config = {
    specs: [
        './controllers/1_BEGIN_CONFIGURE.spec.js',
        './**/*.spec.js'
    ],

    // setted by shell args
    // baseUrl: 'http://localhost:4000',

    chromeOnly: false,

    multiCapabilities: [
        {
            'browserName': 'chrome'
        },
        {
            'browserName': 'firefox'
//        },
//        {
//            // Need download driver "The Internet Explorer Driver Server" http://docs.seleniumhq.org/download/#side_plugins
//            // copy in node_modules/protractor/selenium/
//            // And configure IE security all to low
//            'browserName': 'internet explorer'
        }
    ],

    params: {
        config: {

        },
        login: {
            username: 'Jane',
            password: '123456'
        }
    }
};
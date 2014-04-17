
var path = require('path');

module.exports = function(grunt) {

	grunt.config.set('symlink', {
        uploads: {
            target: 'uploads',
            link: '.tmp/public/uploads',
            options: {
                type: 'dir',
                force: true
            }
        }
    });

	grunt.loadNpmTasks('grunt-symbolic-link');
};

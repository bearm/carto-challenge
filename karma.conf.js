module.exports = function(config) {
    'use strict';

    config.set({

        basePath: '',

        frameworks: ['mocha', 'sinon-chai'],

        files: [
            'app/js/*.js',
            'app/test/*.js'
        ],

        exclude: [
        ],

        preprocessors: {
            'app/js/*.js': ['coverage']
        },

        coverageReporter: {
            type : 'text-summary',
            dir : 'coverage/'
        },

        reporters: ['progress', 'coverage'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['PhantomJS'],

        singleRun: false
    });
};


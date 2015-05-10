requirejs.config({
    baseUrl: './js/',
    map: {
        '*': {
            'css': 'vendors/require/plugins/require-css/css'
        }
    },

    paths: {

        'jquery': 'vendors/jquery/dist/jquery.min',
        'underscore': 'vendors/underscore/underscore.min',
        'ko': 'vendors/knockout/build/output/knockout-latest',
        'sammy': 'vendors/knottie-sammy/lib/min/sammy-latest.min',
        'lodash': 'vendors/lodash/lodash',
        'postal': 'vendors/postal/lib/postal.min',

        'templates': '../templates',
        'template': 'utilities/handlebars-template-mapper.min',
        'handlebars_Helpers': 'utilities/handlebars-helpers.min',

        'text': 'vendors/require/plugins/text.min',
        'domReady': '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady',
        'async': '//cdnjs.cloudflare.com/ajax/libs/async/0.2.7/async.min'
    },

    shim: {
        sammy: {
            deps: ['jquery'],
            exports: 'sammy'
        },
        postal: {
            deps: ['lodash'],
            exports: 'postal'
        }
    }
});

require(['routes'], function(Router) {
    Router.run();
});

requirejs.config({
    baseUrl: './js/',
    map: {
        '*': {
            'css': 'vendors/require/plugins/require-css/css'
        }
    },

    paths: {

        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
        'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
        'ko': '//cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min',
        'sammy': '//cdnjs.cloudflare.com/ajax/libs/sammy.js/0.7.6/sammy.min',

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
        }
    }
});

require(['routes'], function(Router) {
    Router.run();
});

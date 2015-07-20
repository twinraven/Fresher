App.filter('yearOnly', function () {
    'use strict';

    return function(num) {
        if (num === undefined || !num) {
            return num;

        } else {
            return num.split('-')[0];
        }
    };
});
App.directive('hasFocusWhen', [
    function () {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                when: '=hasFocusWhen'
            },
            link: function(scope, elem, attrs) {
                scope.$watch("when", function(currentValue, previousValue) {
                    if (currentValue === true && !previousValue) {
                        elem[0].focus();
                    }
                });
            }
        };
    }
]);


App.directive('focusWhen', [
    function () {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                focusWhen: '='
            },
            link: function(scope, elem, attrs) {
                scope.$watch('focusWhen', function(currentValue, previousValue) {
                    if (currentValue === true && !previousValue) {
                        elem[0].focus();
                    }
                });
            }
        };
    }
]);

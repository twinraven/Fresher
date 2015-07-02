App.directive('movieFull', [
    'stateService',
    function (stateService) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                moreData: '='
            },
            templateUrl: 'partials/movie-full.html',

            link: function(scope, elem, attrs) {
                scope.close = function close() {
                    stateService.setMoreState(false);
                };
            }
        };
    }
]);
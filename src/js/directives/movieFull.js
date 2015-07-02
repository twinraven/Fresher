App.directive('movieFull', [
    'moviesService',
    function (moviesService) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                moreData: '='
            },
            templateUrl: 'partials/movie-full.html',

            link: function(scope, elem, attrs) {
                scope.close = function close() {
                    moviesService.setMoreState(false);
                };
            }
        };
    }
]);
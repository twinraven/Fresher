App.directive('movieData', [
    'moviesService',
    function (moviesService) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                movie: '='
            },
            templateUrl: 'partials/movie-data.html',

            link: function(scope, elem, attrs) {
                scope.more = function more(id) {
                    //
                };

                scope.remove = function more(id) {
                    moviesService.remove(id);
                };
            }
        };
    }
]);
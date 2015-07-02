App.directive('movieTile', [
    'moviesService',
    'stateService',
    function (moviesService, stateService) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                movie: '='
            },
            templateUrl: 'partials/movie-tile.html',

            link: function(scope, elem, attrs) {
                scope.more = function more(id) {
                    stateService.setMoreState(true);

                    stateService.setActiveMovie(scope.movie.id);
                };

                scope.remove = function more(id) {
                    moviesService.remove(id);
                };
            }
        };
    }
]);
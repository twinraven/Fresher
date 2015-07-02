App.directive('movieTile', [
    'moviesService',
    function (moviesService) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                movie: '=',
                moreData: '='
            },
            templateUrl: 'partials/movie-tile.html',

            link: function(scope, elem, attrs) {
                scope.more = function more(id) {
                    moviesService.setMoreState(true);

                    scope.moreData = moviesService.getCachedMovieDataById(id);
                };

                scope.remove = function more(id) {
                    moviesService.remove(id);
                };
            }
        };
    }
]);
App.directive('movieTile', [
    'moviesService',
    'stateService',
    '$timeout',
    function (moviesService, stateService, $timeout) {
        'use strict';

        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                movie: '='
            },
            templateUrl: 'partials/movie-tile.html',

            link: function(scope, elem, attrs) {
                scope.more = function more() {
                    stateService.setMoreState(true);
                    stateService.setActiveMovie(scope.movie.id);
                };

                scope.remove = function more(id) {
                    moviesService.remove(id);
                    moviesService.clearUrlParams();
                    moviesService.clearBestMovie();
                };

                scope.getPosterUrl = moviesService.getPosterUrl;

                scope.getRatingFormatted = moviesService.getRatingFormatted;
            }
        };
    }
]);
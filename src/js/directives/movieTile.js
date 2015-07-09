App.directive('movieTile', [
    'moviesService',
    'stateService',
    function (moviesService, stateService) {
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

                scope.getGraphicUrl = function getGraphicUrl(rating) {
                    return 'images/icons/icon-' + moviesService.getRatingFormatted(rating) + '.png';
                };

                scope.getRatingFormatted = moviesService.getRatingFormatted;
            }
        };
    }
]);
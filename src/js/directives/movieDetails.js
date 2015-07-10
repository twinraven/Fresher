App.directive('movieDetails', [
    'moviesService',
    'stateService',
    function (moviesService, stateService) {
        'use strict';

        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'partials/movie-details.html',

            link: function(scope, elem, attrs) {
                scope.movie = {};

                scope.close = function close() {
                    stateService.setMoreState(false);
                };

                scope.getCriticsGraphicUrl = function getCriticsGraphicUrl(rating) {
                    return 'images/icons/icon-critics-' + moviesService.getCriticsRatingFormatted(rating) + '.png';
                };

                scope.getAudienceGraphicUrl = function getAudienceGraphicUrl(rating) {
                    return 'images/icons/icon-audience-' + moviesService.getAudienceRatingFormatted(rating) + '.png';
                };

                scope.$watch(stateService.getState, function(newState, oldState) {
                    if (newState && newState.activeMovie) {
                        scope.movie = moviesService.getCachedMovieDataById(newState.activeMovie);
                    }
                }, true);
            }
        };
    }
]);
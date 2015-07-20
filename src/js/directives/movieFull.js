App.directive('movieFull', [
    'moviesService',
    'stateService',
    function (moviesService, stateService) {
        'use strict';

        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'partials/movie-full.html',

            link: function(scope, elem, attrs) {
                scope.movie = {};

                scope.close = function close() {
                    stateService.setMoreState(false);
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
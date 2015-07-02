App.directive('movieFull', [
    'moviesService',
    'stateService',
    function (moviesService, stateService) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'partials/movie-full.html',

            link: function(scope, elem, attrs) {
                scope.state = stateService.getState();

                scope.movie = moviesService.getCachedMovieDataById(scope.state.activeMovie);

                scope.close = function close() {
                    stateService.setMoreState(false);
                };

                scope.$watch('state', function(oldv, newv) {
                    scope.movie = moviesService.getCachedMovieDataById(scope.state.activeMovie);
                }, true);
            }
        };
    }
]);
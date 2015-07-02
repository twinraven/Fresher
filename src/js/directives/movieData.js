App.directive('movieData', [
    '$window',
    '$rootScope',
    function ($window, $rootScope) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                movie: '='
            },
            controllerAs: 'data',
            templateUrl: 'partials/movie-data.html',

            link: function(scope, elem, attrs) {
                scope.data = scope.movie;
            }
        };
    }
]);
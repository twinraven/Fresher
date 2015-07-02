App.directive('movieData', [
    function () {
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
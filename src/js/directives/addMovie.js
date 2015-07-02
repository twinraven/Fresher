App.directive('addMovie', [
    function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                movie: '='
            },
            bindToController: true,
            templateUrl: 'partials/add-movie.html',

            link: function(scope, elem, attrs) {

                scope.add = function add() {
                    // focus search field
                    // show loading spinner etc?
                    // moviesService.getMovieDataById(id);
                };
            }
        };
    }
]);
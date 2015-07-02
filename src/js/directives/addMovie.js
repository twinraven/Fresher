App.directive('addMovie', [
    'stateService',
    function (stateService) {
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

                    stateService.setSearchState(true);
                };
            }
        };
    }
]);
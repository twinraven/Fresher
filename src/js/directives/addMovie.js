App.directive('addMovie', [
    'stateService',
    function (stateService) {
        'use strict';

        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                movie: '=',
                id: '@'
            },
            bindToController: true,
            templateUrl: 'partials/add-movie.html',

            link: function(scope, elem, attrs) {

                scope.add = function add() {
                    stateService.setSearchState(true, scope.id);
                    stateService.setLoadingState(scope.id, true);
                };
            }
        };
    }
]);
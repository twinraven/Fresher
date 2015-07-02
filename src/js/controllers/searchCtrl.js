App.controller('searchCtrl', [
    '$scope',
    '$timeout',
    function($scope, $timeout) {
        'use strict';

        var search = this;

        search.results = null;

        search.clear = function clear() {
            search.results = null;
            search.title = '';
        };

        search.start = function start() {
            // make search
        };

        $scope.$watch('search.results', function(newVal, oldVal) {
            //
        }, true);

    }
]);
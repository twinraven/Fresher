App.controller('searchCtrl', [
    '$scope',
    '$timeout',
    'moviesService',
    'stateService',
    function($scope, $timeout, moviesService, stateService) {
        'use strict';

        var search = this;

        search.results = null;

        search.clear = function clear() {
            search.results = null;
            search.title = '';

            stateService.clearAllLoadingState();
        };

        search.start = function start() {
            if (search.title) {
                var searchQuery = moviesService.search(search.title);

                searchQuery.success(function (data) {
                    search.results = data.movies;
                })
                .error(function () {
                    console.log('error');
                });
            }
        };

        search.use = function use(index) {
            moviesService.save(search.results[index]);

            search.close();
        };

        search.close = function close() {
            stateService.setSearchState(false);

            search.clear();
        };

        search.state = stateService.getState();
    }
]);
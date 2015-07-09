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
            search.text = '';
        };

        search.start = function start() {
            if (search.text) {
                stateService.setSearchQueryState(true);

                var searchQuery = moviesService.search(search.text);

                searchQuery.success(function (data) {
                    search.results = data.movies;
                    stateService.setSearchQueryState(false);
                })
                .error(function () {
                    console.log('error');
                    stateService.setSearchQueryState(false);
                });
            }
        };

        search.use = function use(index) {
            if (moviesService.save(search.results[index], search.state.searchActiveId)) {
                search.close();
            }
        };

        search.close = function close() {
            stateService.clearAllLoadingState();
            stateService.setSearchState(false);

            search.clear();
        };

        search.state = stateService.getState();
    }
]);
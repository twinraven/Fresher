App.controller('searchCtrl', [
    '$scope',
    '$timeout',
    'moviesService',
    'stateService',
    function($scope, $timeout, moviesService, stateService) {
        'use strict';

        var search = this;

        search.results = null;
        search.hasNoResults = false;

        search.clear = function clear() {
            search.hasNoResults = false;
            search.results = null;
            search.text = '';
        };

        search.start = function start() {
            if (search.text) {
                search.hasNoResults = false;
                stateService.setSearchQueryState(true);

                var searchQuery = moviesService.search(search.text);

                searchQuery.success(function (data) {
                    search.results = data.results;
                    stateService.setSearchQueryState(false);

                    if (search.results.length === 0) {
                        search.hasNoResults = true;
                    }
                })
                .error(function () {
                    console.log('error');
                    stateService.setSearchQueryState(false);
                });
            }
        };

        search.use = function use(index) {
            if (moviesService.save({
                    'fetchFullData': true,
                    'data': search.results[index],
                    'id': search.state.searchActiveId
                })) {
                    stateService.setSearchState(false);

                    search.clear();
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
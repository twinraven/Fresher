App.controller('searchCtrl', [
    '$scope',
    '$timeout',
    'moviesService',
    function($scope, $timeout, moviesService) {
        'use strict';

        var search = this;

        search.results = null;

        search.clear = function clear() {
            search.results = null;
            search.title = '';
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

            search.clear();

            moviesService.setSearchState(false);
        };

        search.state = moviesService.getSearchState();
    }
]);
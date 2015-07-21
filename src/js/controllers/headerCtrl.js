App.controller('headerCtrl', [
    '$location',
	'moviesService',
	'stateService',
    function($location, moviesService, stateService) {
        'use strict';

        var header = this;

        header.reset = function reset() {
            moviesService.clearMovies();
            moviesService.clearUrlParams();

            stateService.setMoreState(false);
            stateService.setSearchState(false);
            stateService.clearAllLoadingState();
        };

        var loc = $location.search();

        header.hasMovies = moviesService.hasMovies;

        header.movies = moviesService.getMovies();
    }
]);
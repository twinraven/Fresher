App.controller('headerCtrl', [
	'moviesService',
	'stateService',
    function(moviesService, stateService) {
        'use strict';

        this.reset = function reset() {
            moviesService.clearMovies();
            moviesService.clearUrlParams();

            stateService.setMoreState(false);
            stateService.setSearchState(false);
            stateService.clearAllLoadingState();
        };
    }
]);
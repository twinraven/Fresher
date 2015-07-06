App.controller('headerCtrl', [
	'moviesService',
    function(moviesService) {
        'use strict';

        this.reset = function reset() {
            moviesService.clearMovies();
            moviesService.clearUrlParams();
        };
    }
]);
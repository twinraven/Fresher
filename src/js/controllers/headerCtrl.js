App.controller('headerCtrl', [
	'moviesService',
	'$timeout',
    function(moviesService, $timeout) {
        'use strict';

        this.reset = function reset() {
            moviesService.clearMovies();
        };
    }
]);
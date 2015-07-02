App.controller('compareCtrl', [
    '$location',
    'moviesService',
    function($location, moviesService) {
        'use strict';

        var compare = this;

        var loc = $location.search();

        if (loc && loc.id0 && loc.id1) {
            console.log('movie ids found', loc.id0, loc.id1);
            //compare.movies[0] = moviesService.getMovieDataById($routeParams.id0);
            //compare.movies[1] = moviesService.getMovieDataById($routeParams.id1);
        }

        compare.movies = moviesService.getMovies();
    }
]);
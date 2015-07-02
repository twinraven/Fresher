App.controller('compareCtrl', [
    '$location',
    function($location) {
        'use strict';

        var compare = this;

        var loc = $location.search();

        if (loc && loc.id0 && loc.id1) {
            console.log('movie ids found', loc.id0, loc.id1);
            //compare.movies[0] = moviesService.getMovieDataById($routeParams.id0);
            //compare.movies[1] = moviesService.getMovieDataById($routeParams.id1);
        }

        compare.movies = [];

        /*{
            id: 1121210,
            title: 'movie title',
            imageUrl: 'something.jpg',
            rating: 72
        }*/

        compare.add = function add(id) {
            // focus the fucking input field. Why is this hard?
        };

    }
]);
App.controller('compareCtrl', [
    '$scope',
    '$location',
    '$q',
    'moviesService',
    'stateService',
    function($scope, $location, $q, moviesService, stateService) {
        'use strict';

        var compare = this;

        var loc = $location.search();

        if (loc && loc.movie1 && loc.movie2) {
            stateService.setAllLoadingState();

            $q.all([
                moviesService.getMovieDataById(loc.movie1),
                moviesService.getMovieDataById(loc.movie2)
            ])
            .then(function (movies) {
                moviesService.save(movies[0].data, 0);
                moviesService.save(movies[1].data, 1);

                stateService.clearAllLoadingState();
            },
            function (err) {
                console.log(err);

                compare.movies[0] = {};
                compare.movies[1] = {};
            });
        }

        compare.closeOverlay = function closeOverlay() {
            stateService.clearAllLoadingState();
            stateService.setSearchState(false);
            stateService.setMoreState(false);
        };

        compare.setBestWorstClass = function setBestWorstClass(id) {
            if (compare.state.bestMovie !== null) {
                return compare.state.bestMovie === id ? 'is-best' : 'is-worst';

            } else {
                return '';
            }
        };

        compare.getMovieAtPos = moviesService.getMovieAtPos;

        compare.movies = moviesService.getMovies();

        compare.state = stateService.getState();
    }
]);
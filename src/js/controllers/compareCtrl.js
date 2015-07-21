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
                var movie1 = movies[0].data;
                var movie2 = movies[1].data;

                moviesService.save({ 'fetchFullData': false, 'data': movie1, 'id': getMoviePosFromId(movie1.id) });
                moviesService.save({ 'fetchFullData': false, 'data': movie2, 'id': getMoviePosFromId(movie2.id) });

                stateService.clearAllLoadingState();
            },
            function (err) {
                console.log(err);

                compare.movies[0] = {};
                compare.movies[1] = {};
            });
        }

        function getMoviePosFromId(id) {
            if (id === parseInt(loc.movie1, 10)) {
                return 0;
            }

            if (id === parseInt(loc.movie2, 10)) {
                return 1;
            }

            return 0;
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
/*global APIKEY */

App.service('moviesService', [
    '$http',
    '$location',
    'stateService',
    function($http, $location, stateService) {
        'use strict';

        window.APIKEY = window.APIKEY ? window.APIKEY : '12345';

        var movies = [],
            methods = {},
            searchUrl = 'http://api.themoviedb.org/3/search/movie?query=%SEARCH%&api_key=%APIKEY%',
            movieUrl = 'http://api.themoviedb.org/3/movie/%ID%?api_key=%APIKEY%&callback=JSON_CALLBACK',
            imageUrl = 'http://image.tmdb.org/t/p/w500/%URL%';

        // Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.getMovies = function getMovies() {
            return movies;
        };

        methods.getMovieAtPos = function getMovieAtPos(pos) {
            if (movies[0] && movies[0].pos === pos) {
                return movies[0];
            }

            if (movies[1] && movies[1].pos === pos) {
                return movies[1];
            }

            return null;
        };

        methods.clearMovies = function clearMovies() {
            movies.length = 0;
        };

        methods.isMovieCached = function isMovieCachedAlready(id) {
            var filtered = _.filter(movies, function (movie) {
                return movie.id === id;
            });

            return filtered.length;
        };

        methods.save = function save(data, id) {
            var pos;

            if (methods.isMovieCached(data.id)) {
                alert('this movie is already in your comparison.\nPlease choose another');

                return false;
            }

            methods.clearUrlParams();
            methods.clearBestMovie();

            // async data request
            methods.getMovieDataById(data.id).then(function (response) {
                var data = response.data;

                // record whether this movie is in the first or second position in our comparison
                if (id !== null && id !== undefined) {
                    pos = parseInt(id, 10);
                }

                data.pos = pos;

                data.year = data.release_date.split('-')[0];

                movies[movies.length] = data;

                stateService.clearAllLoadingState();

                if (movies.length === 2) {
                    methods.addComparisonToUrl();
                    methods.highlightBestMovie();
                }


            }, function (error) {
                alert('error occurred');
            });


            return true;
        };

        methods.addComparisonToUrl = function cacheMovieComparison() {
            $location.search({
                'movie1': movies[0].id,
                'movie2': movies[1].id
            });
        };

        methods.highlightBestMovie = function highlightBestMovie() {
            var best = null;

            if (movies[0].vote_average > movies[1].vote_average) {
                best = 0;
            }

            if (movies[0].vote_average < movies[1].vote_average) {
                best = 1;
            }

            if (best !== null) {
                stateService.setBestMovie(parseInt(movies[best].pos, 10));
            }
        };

        methods.clearBestMovie = function clearBestMovie() {
            stateService.clearBestMovie();
        };

        methods.clearUrlParams = function clearUrlParams() {
            $location.search({});
        };

        methods.remove = function remove(id) {
            var pos = -1;

            _.find(movies, function (movie, idx) {
                if (movie.id === id) {
                    pos = idx;
                }
            });

            if (pos !== -1) {
                movies.splice(pos, 1);
            }
        };

        methods.getSearchUrl = function getSearchUrl(str) {
            return searchUrl.replace(/%SEARCH%/, str).replace(/%APIKEY%/, APIKEY);
            //return 'json/search.json';
        };

        methods.getMovieUrl = function getSearchUrl(id) {
            return movieUrl.replace(/%ID%/, id).replace(/%APIKEY%/, APIKEY);
        };

        methods.getPosterUrl = function getSearchUrl(url) {
            return url ? imageUrl.replace(/%URL%/, url) : '';
        };

        methods.search = function search(str) {
            var searchUrl = methods.getSearchUrl(str);

            return $http.get(searchUrl);
        };

        methods.getCachedMovieDataById = function getCachedMovieDataById(id) {
            return _.find(movies, function (movie) {
                return movie.id === id;
            });
        };

        methods.getMovieDataById = function getMovieDataById(id) {
            var movieUrl = methods.getMovieUrl(id);

            return $http.jsonp(movieUrl);
        };

        methods.getRatingFormatted = function getRatingFormatted(rating) {
            var certified = 'certified';
            var fresh = 'fresh';
            var rotten = 'rotten';

            if (rating === 'Certified Fresh') {
                return certified;

            } else if (rating === 'Fresh') {
                return fresh;

            } else {
                return rotten;
            }
        };


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);

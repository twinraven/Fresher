/*global APIKEY */

App.service('moviesService', [
    '$http',
    '$location',
    function($http, $location) {
        'use strict';

        var movies = [],
            methods = {},
            searchUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=%SEARCH%&page_limit=20&page=1&apikey=%APIKEY%&callback=JSONP_CALLBACK',
            movieUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies/%ID%.json?apikey=%APIKEY%&callback=JSONP_CALLBACK';

        // Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.getMovies = function getMovies() {
            return movies;
        };

        methods.getMovieAtPos = function getMovieAtPos(pos) {
            if (movies[0] && movies[0].pos == pos) {
                return movies[0];
            }

            if (movies[1] && movies[1].pos == pos) {
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

            if (movies.length < 2) {
                if (id !== null && id !== undefined) {
                    pos = id;
                }

                data.pos = pos;

                movies[movies.length] = data;

                if (movies.length === 2) {
                    methods.addComparisonToUrl();
                }

            } else {
                alert('you already have 2 movies. Please remove 1 first');
            }

            return true;
        };

        methods.addComparisonToUrl = function cacheMovieComparison() {
            $location.search({
                'movie1': movies[0].id,
                'movie2': movies[1].id
            });
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
            //return searchUrl.replace(/%SEARCH%/, str).replace(/%APIKEY%/, APIKEY);
            return 'json/search.json';
        };

        methods.getMovieUrl = function getSearchUrl(id) {
            return movieUrl.replace(/%ID%/, id).replace(/%APIKEY%/, APIKEY);
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

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);

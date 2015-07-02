App.service('moviesService', [
    '$http',
    '$timeout',
    function($http, $timeout) {
        var movies = [],
            methods = {},
            state = {active: false},
            searchUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=%SEARCH%&page_limit=20&page=1&apikey=%APIKEY%',
            movieUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies/%ID%.json?apikey=%APIKEY%';

        // Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.getMovies = function getMovies() {
            return movies;
        };

        methods.isMovieCached = function isMovieCachedAlready(id) {
            var filtered = _.filter(movies, function (movie) {
                return movie.id === id;
            });

            return filtered.length;
        };

        methods.setSearchState = function setSearchState(bool) {
            //$timeout(function () {
                state.active = bool;
            //});

        };

        methods.getSearchState = function getSearchState() {
            return state;
        };

        methods.save = function save(data) {
            if (methods.isMovieCached(data.id)) {
                return;
            }

            if (movies.length < 2) {
                movies[movies.length] = data;

            } else {
                alert('you already have 2 movies. Please remove 1 first');
            }
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
            return 'js/json/search.json';
        };

        methods.getMovieUrl = function getSearchUrl(id) {
            //return movieUrl.replace(/%ID%/, id).replace(/%APIKEY%/, APIKEY);
            return 'js/json/movie.json';
        };

        methods.search = function search(str) {
            var searchUrl = methods.getSearchUrl(str);

            return $http.get(searchUrl);
        };

        methods.getMovieDataById = function getMovieDataById(id) {
            var movieUrl = methods.getMovieUrl(id);

            return $http.get(movieUrl);
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);

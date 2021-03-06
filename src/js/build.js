/*global angular */

var App = angular.module('Fresher', ['ngRoute', 'ngAnimate']);
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
App.controller('headerCtrl', [
    '$location',
	'moviesService',
	'stateService',
    function($location, moviesService, stateService) {
        'use strict';

        var header = this;

        header.reset = function reset() {
            moviesService.clearMovies();
            moviesService.clearUrlParams();

            stateService.setMoreState(false);
            stateService.setSearchState(false);
            stateService.clearAllLoadingState();
        };

        var loc = $location.search();

        header.hasMovies = moviesService.hasMovies;

        header.movies = moviesService.getMovies();
    }
]);
App.controller('searchCtrl', [
    '$scope',
    '$timeout',
    'moviesService',
    'stateService',
    function($scope, $timeout, moviesService, stateService) {
        'use strict';

        var search = this;

        search.results = null;
        search.hasNoResults = false;

        search.clear = function clear() {
            search.hasNoResults = false;
            search.results = null;
            search.text = '';
        };

        search.start = function start() {
            if (search.text) {
                search.hasNoResults = false;
                stateService.setSearchQueryState(true);

                var searchQuery = moviesService.search(search.text);

                searchQuery.success(function (data) {
                    search.results = data.results;
                    stateService.setSearchQueryState(false);

                    if (search.results.length === 0) {
                        search.hasNoResults = true;
                    }
                })
                .error(function () {
                    console.log('error');
                    stateService.setSearchQueryState(false);
                });
            }
        };

        search.use = function use(index) {
            if (moviesService.save({
                    'fetchFullData': true,
                    'data': search.results[index],
                    'id': search.state.searchActiveId
                })) {
                    stateService.setSearchState(false);

                    search.clear();
                }
        };

        search.close = function close() {
            stateService.clearAllLoadingState();
            stateService.setSearchState(false);

            search.clear();
        };

        search.state = stateService.getState();
    }
]);
App.directive('addMovie', [
    'stateService',
    function (stateService) {
        'use strict';

        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                movie: '=',
                id: '@'
            },
            bindToController: true,
            templateUrl: 'partials/add-movie.html',

            link: function(scope, elem, attrs) {

                scope.add = function add() {
                    stateService.setSearchState(true, scope.id);
                    stateService.setLoadingState(scope.id, true);
                };
            }
        };
    }
]);
App.directive('focusWhen', [
    function () {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                focusWhen: '='
            },
            link: function(scope, elem, attrs) {
                scope.$watch('focusWhen', function(currentValue, previousValue) {
                    if (currentValue === true && !previousValue) {
                        elem[0].focus();
                    }
                });
            }
        };
    }
]);

App.directive('movieDetails', [
    'moviesService',
    'stateService',
    function (moviesService, stateService) {
        'use strict';

        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'partials/movie-details.html',

            link: function(scope, elem, attrs) {
                scope.movie = {};

                scope.close = function close() {
                    stateService.setMoreState(false);
                };

                scope.getPosterUrl = moviesService.getPosterUrl;

                scope.$watch(stateService.getState, function(newState, oldState) {
                    if (newState && newState.activeMovie) {
                        scope.movie = moviesService.getCachedMovieDataById(newState.activeMovie);
                    }
                }, true);
            }
        };
    }
]);
App.directive('movieTile', [
    'moviesService',
    'stateService',
    '$timeout',
    function (moviesService, stateService, $timeout) {
        'use strict';

        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                movie: '='
            },
            templateUrl: 'partials/movie-tile.html',

            link: function(scope, elem, attrs) {
                scope.more = function more() {
                    stateService.setMoreState(true);
                    stateService.setActiveMovie(scope.movie.id);
                };

                scope.remove = function more(id) {
                    moviesService.remove(id);
                    moviesService.clearUrlParams();
                    moviesService.clearBestMovie();
                };

                scope.getPosterUrl = moviesService.getPosterUrl;

                scope.getRatingFormatted = moviesService.getRatingFormatted;
            }
        };
    }
]);
App.filter('prettyTime', function () {
    'use strict';

    return function(num) {
        if (num === undefined || num.length === 0) {
            return num;
        } else {
            num = Number(num);
            var hours = Math.floor(num / 60);
            var mins = hours * 60;
            var minsOver = Math.round(num - mins);

            return hours + ' hr. ' + minsOver + ' min.';
        }
    };
});
App.filter('yearOnly', function () {
    'use strict';

    return function(num) {
        if (num === undefined || !num) {
            return num;

        } else {
            return num.split('-')[0];
        }
    };
});
App.config(['$routeProvider', function($routeProvider) {
	'use strict';

    $routeProvider.when('/', {
    	templateUrl: 'partials/main.html',
    	reloadOnSearch: false
    });

    $routeProvider.otherwise({redirectTo: '/'});
}]);
/*global APIKEY, angular */

App.service('moviesService', [
    '$http',
    '$location',
    'stateService',
    function($http, $location, stateService) {
        'use strict';

        window.APIKEY = window.APIKEY ? window.APIKEY : '12345';

        var movies = [{}, {}],
            methods = {},
            searchUrl = 'http://api.themoviedb.org/3/search/movie?query=%SEARCH%&api_key=%APIKEY%',
            movieUrl = 'http://api.themoviedb.org/3/movie/%ID%?api_key=%APIKEY%&callback=JSON_CALLBACK',
            imageUrl = 'http://image.tmdb.org/t/p/w500/%URL%';

        // Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.getMovies = function getMovies() {
            return movies;
        };

        methods.hasMovies = function hasMovies(total) {
            if (total === 1) {
                return !angular.equals({}, movies[0]) || !angular.equals({}, movies[1]);
            }

            if (total === 2) {
                return !angular.equals({}, movies[0]) && !angular.equals({}, movies[1]);
            }
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
            movies = [{}, {}];
        };

        methods.isMovieCached = function isMovieCachedAlready(id) {
            var filtered = _.filter(movies, function (movie) {
                return movie.id === id;
            });

            return filtered.length;
        };

        methods.save = function save(props) {
            var pos = 0;

            // record whether this movie is in the first or second position in our comparison
            if (props.id !== null && props.id !== undefined) {
                pos = parseInt(props.id, 10);
            }

            if (methods.isMovieCached(props.id)) {
                alert('this movie is already in your comparison.\nPlease choose another');

                return false;
            }

            methods.clearUrlParams();
            methods.clearBestMovie();

            movies[pos] = {};

            if (props.fetchFullData) {

                // async data request
                methods.getMovieDataById(props.data.id).then(function (response) {
                    var data = response.data;

                    saveMovieData(data, pos);
                },
                function (error) {
                    alert('error occurred');
                });

            } else {
                saveMovieData(props.data, pos);
            }


            return true;
        };

        function saveMovieData(data, pos) {
            data.pos = pos;

            data.year = data.release_date.split('-')[0];

            movies[pos] = data;

            stateService.clearAllLoadingState();

            if (methods.hasMovies(2)) {
                methods.addComparisonToUrl();
                methods.highlightBestMovie();
            }
        }

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
                movies.splice(pos, 1, {});
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
            return url ? imageUrl.replace(/%URL%/, url) : 'images/error.png';
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

        methods.getRatingFormatted = function getRatingFormatted(score) {
            var fresh = 'fresh';
            var rotten = 'rotten';
            var scoreNum = parseFloat(score);

            if (scoreNum > 5) {
                return fresh;

            } else {
                return rotten;
            }
        };


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);

App.service('stateService', [
    function() {
        'use strict';

        var methods = {},
            state = {
                searchActive: false,
                searchActiveId: null,
                searchQueryActive: false,
                moreActive: false,
                activeMovie: null,
                bestMovie: null,
                loading: [false, false]
            };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.getState = function getState() {
            return state;
        };

        methods.setSearchState = function setSearchState(bool, id) {
            state.searchActive = bool;
            state.searchActiveId = id || null;
        };

        methods.setSearchQueryState = function setSearchQueryState(bool) {
            state.searchQueryActive = bool;
        };

        methods.setMoreState = function setMoreState(bool) {
            state.moreActive = bool;
        };

        methods.setActiveMovie = function setActiveMovieId(id) {
            state.activeMovie = id;
        };

        methods.setLoadingState = function setLoadingState(id, bool) {
            state.loading[id] = bool;
        };

        methods.setAllLoadingState = function setAllLoadingState() {
            methods.setLoadingState(0, true);
            methods.setLoadingState(1, true);
        };

        methods.clearAllLoadingState = function clearAllLoadingState() {
            methods.setLoadingState(0, false);
            methods.setLoadingState(1, false);
        };

        methods.setBestMovie = function setBestMovie(id) {
            state.bestMovie = id;
        };

        methods.clearBestMovie = function clearBestMovie() {
            state.bestMovie = null;
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);

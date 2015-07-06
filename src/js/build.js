/*global angular */

var App = angular.module('Fresht', ['ngRoute']);
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
                compare.movies[0] = movies[0];
                compare.movies[1] = movies[1];

                stateService.clearAllLoadingState();
            },
            function (err) {
                console.log(err);
            });
        }

        compare.movies = moviesService.getMovies();

        compare.state = stateService.getState();
    }
]);
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
App.controller('searchCtrl', [
    '$scope',
    '$timeout',
    'moviesService',
    'stateService',
    function($scope, $timeout, moviesService, stateService) {
        'use strict';

        var search = this;

        search.results = null;

        search.clear = function clear() {
            search.results = null;
            search.title = '';

            stateService.clearAllLoadingState();
        };

        search.start = function start() {
            if (search.title) {
                var searchQuery = moviesService.search(search.title);

                searchQuery.success(function (data) {
                    search.results = data.movies;
                })
                .error(function () {
                    console.log('error');
                });
            }
        };

        search.use = function use(index) {
            moviesService.save(search.results[index]);

            search.close();
        };

        search.close = function close() {
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
                    // focus search field
                    // show loading spinner etc?

                    stateService.setSearchState(true);

                    stateService.setLoadingState(scope.id, true);
                };
            }
        };
    }
]);
App.directive('hasFocusWhen', [
    function () {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                when: '=hasFocusWhen'
            },
            link: function(scope, elem, attrs) {
                scope.$watch("when", function(currentValue, previousValue) {
                    if (currentValue === true && !previousValue) {
                        elem[0].focus();
                    }
                });
            }
        };
    }
]);


App.directive('movieFull', [
    'moviesService',
    'stateService',
    function (moviesService, stateService) {
        'use strict';

        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'partials/movie-full.html',

            link: function(scope, elem, attrs) {
                scope.movie = {};

                scope.close = function close() {
                    stateService.setMoreState(false);
                };

                scope.$watch(stateService.getState, function(newState, oldState) {
                    scope.movie = moviesService.getCachedMovieDataById(newState.activeMovie);
                }, true);
            }
        };
    }
]);
App.directive('movieTile', [
    'moviesService',
    'stateService',
    function (moviesService, stateService) {
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
                };
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
App.config(['$routeProvider', function($routeProvider) {
	'use strict';

    $routeProvider.when('/', {
    	templateUrl: 'partials/main.html',
    	reloadOnSearch: false
    });

    $routeProvider.otherwise({redirectTo: '/'});
}]);
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

        methods.clearMovies = function clearMovies() {
            movies.length = 0;
        };

        methods.isMovieCached = function isMovieCachedAlready(id) {
            var filtered = _.filter(movies, function (movie) {
                return movie.id === id;
            });

            return filtered.length;
        };

        methods.save = function save(data) {
            if (methods.isMovieCached(data.id)) {
                return;
            }

            if (movies.length < 2) {
                movies[movies.length] = data;

                if (movies.length === 2) {
                    methods.addComparisonToUrl();
                }

            } else {
                alert('you already have 2 movies. Please remove 1 first');
            }
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

App.service('stateService', [
    function() {
        'use strict';

        var methods = {},
            state = {
                searchActive: false,
                moreActive: false,
                activeMovie: null,
                loading: [false, false]
            };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.setSearchState = function setSearchState(bool) {
            state.searchActive = bool;
        };

        methods.setMoreState = function setMoreState(bool) {
            state.moreActive = bool;
        };

        methods.setActiveMovie = function setActiveMovieId(id) {
            state.activeMovie = id;
        };

        methods.getState = function getState() {
            return state;
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

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);

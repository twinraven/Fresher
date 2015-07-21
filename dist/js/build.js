var App=angular.module("Fresher",["ngRoute","ngAnimate"]);App.controller("compareCtrl",["$scope","$location","$q","moviesService","stateService",function(e,t,r,i,a){"use strict";function o(e){return e===parseInt(s.movie1,10)?0:e===parseInt(s.movie2,10)?1:0}var n=this,s=t.search();s&&s.movie1&&s.movie2&&(a.setAllLoadingState(),r.all([i.getMovieDataById(s.movie1),i.getMovieDataById(s.movie2)]).then(function(e){var t=e[0].data,r=e[1].data;i.save({fetchFullData:!1,data:t,id:o(t.id)}),i.save({fetchFullData:!1,data:r,id:o(r.id)}),a.clearAllLoadingState()},function(e){console.log(e),n.movies[0]={},n.movies[1]={}})),n.closeOverlay=function(){a.clearAllLoadingState(),a.setSearchState(!1),a.setMoreState(!1)},n.setBestWorstClass=function(e){return null!==n.state.bestMovie?n.state.bestMovie===e?"is-best":"is-worst":""},n.getMovieAtPos=i.getMovieAtPos,n.movies=i.getMovies(),n.state=a.getState()}]),App.controller("headerCtrl",["$location","moviesService","stateService",function(e,t,r){"use strict";var i=this;i.reset=function(){t.clearMovies(),t.clearUrlParams(),r.setMoreState(!1),r.setSearchState(!1),r.clearAllLoadingState()};e.search();i.hasMovies=t.hasMovies,i.movies=t.getMovies()}]),App.controller("searchCtrl",["$scope","$timeout","moviesService","stateService",function(e,t,r,i){"use strict";var a=this;a.results=null,a.hasNoResults=!1,a.clear=function(){a.hasNoResults=!1,a.results=null,a.text=""},a.start=function(){if(a.text){a.hasNoResults=!1,i.setSearchQueryState(!0);var e=r.search(a.text);e.success(function(e){a.results=e.results,i.setSearchQueryState(!1),0===a.results.length&&(a.hasNoResults=!0)}).error(function(){console.log("error"),i.setSearchQueryState(!1)})}},a.use=function(e){r.save({fetchFullData:!0,data:a.results[e],id:a.state.searchActiveId})&&(i.setSearchState(!1),a.clear())},a.close=function(){i.clearAllLoadingState(),i.setSearchState(!1),a.clear()},a.state=i.getState()}]),App.directive("addMovie",["stateService",function(e){"use strict";return{restrict:"E",replace:"true",scope:{movie:"=",id:"@"},bindToController:!0,templateUrl:"partials/add-movie.html",link:function(t,r,i){t.add=function(){e.setSearchState(!0,t.id),e.setLoadingState(t.id,!0)}}}}]),App.directive("focusWhen",[function(){"use strict";return{restrict:"A",scope:{focusWhen:"="},link:function(e,t,r){e.$watch("focusWhen",function(e,r){e!==!0||r||t[0].focus()})}}}]),App.directive("movieDetails",["moviesService","stateService",function(e,t){"use strict";return{restrict:"E",replace:"true",scope:!0,templateUrl:"partials/movie-details.html",link:function(r,i,a){r.movie={},r.close=function(){t.setMoreState(!1)},r.getPosterUrl=e.getPosterUrl,r.$watch(t.getState,function(t,i){t&&t.activeMovie&&(r.movie=e.getCachedMovieDataById(t.activeMovie))},!0)}}}]),App.directive("movieTile",["moviesService","stateService","$timeout",function(e,t,r){"use strict";return{restrict:"E",replace:"true",scope:{movie:"="},templateUrl:"partials/movie-tile.html",link:function(r,i,a){r.more=function(){t.setMoreState(!0),t.setActiveMovie(r.movie.id)},r.remove=function(t){e.remove(t),e.clearUrlParams(),e.clearBestMovie()},r.getPosterUrl=e.getPosterUrl,r.getRatingFormatted=e.getRatingFormatted}}}]),App.filter("prettyTime",function(){"use strict";return function(e){if(void 0===e||0===e.length)return e;e=Number(e);var t=Math.floor(e/60),r=60*t,i=Math.round(e-r);return t+" hr. "+i+" min."}}),App.filter("yearOnly",function(){"use strict";return function(e){return void 0!==e&&e?e.split("-")[0]:e}}),App.config(["$routeProvider",function(e){"use strict";e.when("/",{templateUrl:"partials/main.html",reloadOnSearch:!1}),e.otherwise({redirectTo:"/"})}]),App.service("moviesService",["$http","$location","stateService",function(e,t,r){"use strict";function i(e,t){e.pos=t,e.year=e.release_date.split("-")[0],a[t]=e,r.clearAllLoadingState(),o.hasMovies(2)&&(o.addComparisonToUrl(),o.highlightBestMovie())}window.APIKEY=window.APIKEY?window.APIKEY:"12345";var a=[{},{}],o={},n="http://api.themoviedb.org/3/search/movie?query=%SEARCH%&api_key=%APIKEY%",s="http://api.themoviedb.org/3/movie/%ID%?api_key=%APIKEY%&callback=JSON_CALLBACK",c="http://image.tmdb.org/t/p/w500/%URL%";return o.getMovies=function(){return a},o.hasMovies=function(e){return 1===e?!angular.equals({},a[0])||!angular.equals({},a[1]):2===e?!angular.equals({},a[0])&&!angular.equals({},a[1]):void 0},o.getMovieAtPos=function(e){return a[0]&&a[0].pos===e?a[0]:a[1]&&a[1].pos===e?a[1]:null},o.clearMovies=function(){a.length=0,a=[{},{}]},o.isMovieCached=function(e){var t=_.filter(a,function(t){return t.id===e});return t.length},o.save=function(e){var t=0;return null!==e.id&&void 0!==e.id&&(t=parseInt(e.id,10)),o.isMovieCached(e.id)?(alert("this movie is already in your comparison.\nPlease choose another"),!1):(o.clearUrlParams(),o.clearBestMovie(),a[t]={},e.fetchFullData?o.getMovieDataById(e.data.id).then(function(e){var r=e.data;i(r,t)},function(e){alert("error occurred")}):i(e.data,t),!0)},o.addComparisonToUrl=function(){t.search({movie1:a[0].id,movie2:a[1].id})},o.highlightBestMovie=function(){var e=null;a[0].vote_average>a[1].vote_average&&(e=0),a[0].vote_average<a[1].vote_average&&(e=1),null!==e&&r.setBestMovie(parseInt(a[e].pos,10))},o.clearBestMovie=function(){r.clearBestMovie()},o.clearUrlParams=function(){t.search({})},o.remove=function(e){var t=-1;_.find(a,function(r,i){r.id===e&&(t=i)}),-1!==t&&a.splice(t,1,{})},o.getSearchUrl=function(e){return n.replace(/%SEARCH%/,e).replace(/%APIKEY%/,APIKEY)},o.getMovieUrl=function(e){return s.replace(/%ID%/,e).replace(/%APIKEY%/,APIKEY)},o.getPosterUrl=function(e){return e?c.replace(/%URL%/,e):"images/error.png"},o.search=function(t){var r=o.getSearchUrl(t);return e.get(r)},o.getCachedMovieDataById=function(e){return _.find(a,function(t){return t.id===e})},o.getMovieDataById=function(t){var r=o.getMovieUrl(t);return e.jsonp(r)},o.getRatingFormatted=function(e){var t="fresh",r="rotten",i=parseFloat(e);return i>5?t:r},o}]),App.service("stateService",[function(){"use strict";var e={},t={searchActive:!1,searchActiveId:null,searchQueryActive:!1,moreActive:!1,activeMovie:null,bestMovie:null,loading:[!1,!1]};return e.getState=function(){return t},e.setSearchState=function(e,r){t.searchActive=e,t.searchActiveId=r||null},e.setSearchQueryState=function(e){t.searchQueryActive=e},e.setMoreState=function(e){t.moreActive=e},e.setActiveMovie=function(e){t.activeMovie=e},e.setLoadingState=function(e,r){t.loading[e]=r},e.setAllLoadingState=function(){e.setLoadingState(0,!0),e.setLoadingState(1,!0)},e.clearAllLoadingState=function(){e.setLoadingState(0,!1),e.setLoadingState(1,!1)},e.setBestMovie=function(e){t.bestMovie=e},e.clearBestMovie=function(){t.bestMovie=null},e}]);
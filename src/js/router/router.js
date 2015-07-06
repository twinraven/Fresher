App.config(['$routeProvider', function($routeProvider) {
	'use strict';

    $routeProvider.when('/', {
    	templateUrl: 'partials/main.html',
    	reloadOnSearch: false
    });

    $routeProvider.otherwise({redirectTo: '/'});
}]);
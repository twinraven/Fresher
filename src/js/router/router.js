App.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {template: '', controller: ''});
    $routeProvider.otherwise({redirectTo: '/'});
}]);
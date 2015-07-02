App.controller('compareCtrl', [
    function() {
        'use strict';

        this.movies = [
            {
                title: 'movie title',
                imageUrl: 'something.jpg',
                rating: 72
            }
        ];

        this.add = function add(id) {
            console.log(angular.element('movie-title'));//.focus();
        };

    }
]);
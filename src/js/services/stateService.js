App.service('stateService', [
    function() {
        'use strict';

        var methods = {},
            state = {
                searchActive: false,
                searchActiveId: null,
                moreActive: false,
                activeMovie: null,
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

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);

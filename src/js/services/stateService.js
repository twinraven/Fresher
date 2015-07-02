App.service('stateService', [
    function() {
        var methods = {},
            state = {
                searchActive: false,
                moreActive: false,
                activeMovie: null
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
        }

        methods.getState = function getState() {
            return state;
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);

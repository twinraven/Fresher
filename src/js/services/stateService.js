App.service('stateService', [
    function() {
        var methods = {},
            state = {
                searchActive: false,
                moreActive: false
            };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.setSearchState = function setSearchState(bool) {
            state.searchActive = bool;
        };

        methods.setMoreState = function setMoreState(bool) {
            state.moreActive = bool;
        };

        methods.getState = function getState() {
            return state;
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);

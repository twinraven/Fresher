App.filter('prettyTime', function () {
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
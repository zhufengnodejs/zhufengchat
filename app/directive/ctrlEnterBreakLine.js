angular.module('zhufengChat').directive('ctrlEnterBreakLine', function () {
    return {
        link: function (scope, element, attrs) {
            var ctrlDown = false;
            element.bind('keydown', function (event) {
                if (event.which == 17) {
                    ctrlDown = true;
                    setTimeout(function () {
                        ctrlDown = false;
                    }, 1000)
                }
                if (event.which == 13) {
                    if (ctrlDown) {
                        element.val(element.val() + '\n');
                    } else {
                        scope.$apply(function () {
                            scope.$eval(attrs.ctrlEnterBreakLine);
                        });
                        event.preventDefault();
                    }
                }
            });
        }
    }
})
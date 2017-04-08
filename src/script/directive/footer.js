'use strict';

angular.module('app').directive('appFooter', [function() {
  return {
    restrict: 'A',
    // replace: true,
    templateUrl: 'view/template/footer.html',
    scope: {},
    link: function(scope) {}
  };
}]);

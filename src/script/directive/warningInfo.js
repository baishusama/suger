'use strict';

angular.module('app').directive('appWarningInfo', [function() {
  return {
    restrict: 'A',
    // replace: true,
    templateUrl: 'view/template/warningInfo.html',
    scope: {
      info: '='
    }
  };
}]);

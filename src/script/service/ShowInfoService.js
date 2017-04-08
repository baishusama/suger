'user strict';

angular.module('app').service('ShowInfoService', ShowInfoService);

ShowInfoService.$inject = ['$rootScope', '$timeout'];

function ShowInfoService($rootScope, $timeout) {
  this.popup = function(message, theme) {
    $rootScope.submitInfo.info = message;
    $rootScope.submitInfo.theme = theme || "default";

    // 一段时间后隐藏提示 - 并不能按照期望触发 transition 。。
    // $rootScope.submitInfo.opacity = "opacity-zero";

    // debug 用
    // $timeout(function() {
    //   $rootScope.submitInfo.opacity = "opacity-zero";
    // }, 0); // 放到执行队列的末尾 - 并没有什么卵用。。

    // 提示的消失（动画）
    $timeout(function() {
      $rootScope.submitInfo.opacity = "opacity-zero";
    }, 2000); // 2s
    // 一段时间后清空提示
    $timeout(function() {
      $rootScope.submitInfo.opacity = "opacity-one";
      $rootScope.submitInfo.info = "";
    }, 3000); // 2s + 1s
  };
}

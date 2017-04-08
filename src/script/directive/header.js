'use strict';

angular.module('app').directive('appHeader', ['AuthenticationService', 'ShowInfoService', '$state', function(AuthenticationService, ShowInfoService, $state) {
  return {
    restrict: 'A',
    // replace: true,
    templateUrl: 'view/template/header.html',
    scope: {},
    link: function(scope) {
      // // 先判断是否登录
      // var loggedInCache = AuthenticationService.getLoggedInCache();
      // scope.loggedIn = !!loggedInCache;
      //
      // // 已登录的话，获取登录信息
      // scope.userInfo = null;
      // if (scope.loggedIn) {
      //   scope.userInfo = loggedInCache;
      // }

      // 直接获取登录情况
      scope.userInfo = AuthenticationService.getLoggedInCache();

      // 登出
      scope.logout = function() {
        AuthenticationService.signout();
        // scope.loggedIn = false;
        scope.userInfo = null;
        ShowInfoService.popup("已成功登出～");
      };

      // 写文章
      scope.goToWriter = function() {
        console.log("scope.userInfo : ", scope.userInfo);
        if (scope.userInfo && scope.userInfo.active === '1') {
          $state.go('writer');
        } else if (scope.userInfo && scope.userInfo.active === '0') {
          ShowInfoService.popup("请先查收邮件并激活账号！", "warn");
        } else {
          ShowInfoService.popup("请先登录或者注册！", "warn");
          $state.go('signin');
        }
      };
    }
  };
}]);

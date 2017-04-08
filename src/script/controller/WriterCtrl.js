'use strict';

angular.module('app').controller('WriterCtrl', WriterCtrl);

// fortest: 测试样式的时候先关闭
WriterCtrl.resolve = {
  _loggedInMsg: ['$q', 'AuthenticationService', function($q, AuthenticationService) {
    var loggedInCache = AuthenticationService.getLoggedInCache();

    if (loggedInCache) {
      // return FetchInfoService.getAllBooksBy(loggedInCache.uid);
      console.log("WriterCtrl-RESO, loggedInCache : ", loggedInCache);
      return $q.when(loggedInCache); // todo..'when'???
    } else {
      return $q.reject({
        authenticated: false
      });
    }
  }],
  _booksInfo: ['_loggedInMsg', 'FetchInfoService', function(_loggedInMsg, FetchInfoService) {
    // 这个 resolve 依赖于 _loggedInMsg 的 resolve
    return FetchInfoService.getAllBooksBy(_loggedInMsg.uid).then(function(data) {
      // 只显示 state 为 0 的 books
      var booksInfo = (data || []).filter(function(elem) {
        return parseInt(elem.state) < 2;
      });
      return booksInfo;
    });
  }]
};

WriterCtrl.$inject = ['$scope', '_loggedInMsg', '_booksInfo'];

function WriterCtrl($scope, _loggedInMsg, _booksInfo) {
  console.log("WriterCtrl-Init: _loggedInMsg : ", _loggedInMsg);
  console.log("WriterCtrl-Init: _booksInfo : ", _booksInfo);

  $scope.userInfo = _loggedInMsg;
  $scope.booksInfo = _booksInfo;
}

// // fortest
// WriterCtrl.$inject = ['$scope'];
//
// function WriterCtrl($scope) {
//   $scope.userInfo = {
//     active: "0",
//     uid: "1",
//     username: "admin"
//   };
//   $scope.booksInfo = {
//     'book2': {
//       'title': '日记test',
//       'state': '1'
//     },
//     'book1': {
//       'title': '随笔test',
//       'state': '1'
//     }
//   };
// }

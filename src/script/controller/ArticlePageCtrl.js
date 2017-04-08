'use strict';

angular.module('app').controller('ArticlePageCtrl', ArticlePageCtrl);

ArticlePageCtrl.resolve = {
  _articlePageInfo: ['$stateParams', 'FetchInfoService', '$q', function($stateParams, FetchInfoService, $q) {
    var aid = $stateParams.aid;

    return FetchInfoService.getPublishedArticle(aid)
      .then(function(resp) {
        return resp;
      }).catch(function(err) {
        if (err.status === 404) {
          return $q.reject({
            is404: true
          });
        }
      });
  }],
  _authorInfo: ['_articlePageInfo', 'FetchInfoService', '$q', function(_articlePageInfo, FetchInfoService, $q) {
    var uid = _articlePageInfo.author;

    return FetchInfoService.getAuthor(uid)
      .then(function(resp) {
        return resp;
      }).catch(function(err) {
        if (err.status === 404) {
          return $q.reject({
            is404: true
          }); // 可行么???
        }
      });
  }]
};

ArticlePageCtrl.$inject = ['$scope', '_authorInfo', '_articlePageInfo', 'AuthenticationService'];

function ArticlePageCtrl($scope, _authorInfo, _articlePageInfo, AuthenticationService) {
  $scope.authorInfo = _authorInfo;
  $scope.articleInfo = _articlePageInfo;

  // 判断登录情况
  $scope.userInfo = AuthenticationService.getLoggedInCache() || {}; // if null => {}
  // $scope.authorMatchCurrent = false;
  // if($scope.userInfo.uid = ){} // 判断交给 ng-if

  // fortest
  console.log("ArticlePageCtrl-Init: authorInfo : ", $scope.authorInfo);
  console.log("ArticlePageCtrl-Init: articleInfo : ", $scope.articleInfo);
  console.log("ArticlePageCtrl-Init: userInfo : ", $scope.userInfo);
  console.log("++++++++++++++++++++++++");
}

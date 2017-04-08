'use strict';

angular.module('app').controller('DraftCtrl', DraftCtrl);

DraftCtrl.resolve = {
  _articlesInfo: ['AuthenticationService', 'FetchInfoService', function(AuthenticationService, FetchInfoService) {
    var uid = AuthenticationService.getLoggedInCache().uid;
    return FetchInfoService.getArticlesAbandonedByUser(uid)
      .then(function(resp) {
        // console.log("In _articlesInfo, resp : ", resp);
        return resp.data;
      })
      .catch(function(err) {
        // console.log("In _articlesInfo, err : ", err);
      });
  }]
};

DraftCtrl.$inject = ['$scope', '_articlesInfo'];

function DraftCtrl($scope, _articlesInfo) {
  console.log("DraftCtrl-Init: _articlesInfo : ", _articlesInfo);
  $scope.abandonedArticles = _articlesInfo;

  // $scope.recoverArticle = function(aid) {
  //   console.log('test');
  // };

  // 对 panel 的数据的控制暂时直接写在这里了，而不是写在 service
  // $scope.updateArticlePanel = function(aid) {
  //   // console.log("hello");
  //   // var aid = aid.toString(); // => string
  //   // var aids = $scope.abandonedArticles.map(function(elem) {
  //   //   return elem.aid;
  //   // });
  //   // var index = aids.indexOf(aid);
  //   // $scope.abandonedArticles.splice(index, 1);
  // };
}

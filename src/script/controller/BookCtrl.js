'use strict';

angular.module('app').controller('BookCtrl', BookCtrl);

BookCtrl.resolve = {
  _bookInfo: ['$stateParams', '_booksInfo', function($stateParams, _booksInfo) {
    var bid = $stateParams.bid;
    var curBookObj = _booksInfo.filter(function(elem) {
      return elem.bid === bid;
    })[0];
    return curBookObj;
  }],
  _articlesInfo: ['_bookInfo', 'FetchInfoService', function(_bookInfo, FetchInfoService) {
    console.log('BookCtrl-RESO: _articlesInfo, _bookInfo: ', _bookInfo);
    return FetchInfoService.getAllArticlesFrom(_bookInfo.bid).then(function(data) {
      console.log('BookCtrl-RESO: _articlesInfo, data: ', data);
      var articlesInfo = (data || []);
      return articlesInfo;
    });
  }]
};
BookCtrl.$inject = ['$scope', '_bookInfo', '_articlesInfo'];

function BookCtrl($scope, _bookInfo, _articlesInfo) {
  console.log("BookCtrl-Init: _bookInfo : ", _bookInfo);
  console.log("BookCtrl-Init: _articlesInfo : ", _articlesInfo);
  console.log("------------------------");

  $scope.bookInfo = _bookInfo;
  $scope.articlesInfo = _articlesInfo;
}

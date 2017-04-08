'use strict';

angular.module('app').directive('appPanel', ['$stateParams', 'BookManageService', '$state', function($stateParams, BookManageService, $state) {
  return {
    restrict: 'A',
    // replace: true,
    templateUrl: 'view/template/panel.html',
    scope: {
      books: '=',
      user: '='
    },
    link: function(scope) {
      // 初始化
      // console.log("In appPanel Directive, $stateParams : ", $stateParams);
      console.log('>>> Panel REBORN!! <<< $stateParams : ', $stateParams);
      scope.curBook = $stateParams.bid;
      scope.active = function(bid) {
        // 点击事件会在 state 改变之前发生，像下面这么写激活状态会延迟。。
        // (x) scope.curBook = $stateParams.bid;
        scope.curBook = bid;
      };

      // 新增文集的 title
      scope.bookTitle = "";

      // 新增文集表单的显示/隐藏
      scope.showAddBookForm = false;
      scope.toggleAddBookForm = function() {
        if (scope.showAddBookForm) {
          scope.showAddBookForm = false;
        } else {
          scope.showAddBookForm = true;
        }
      };

      // 新增文集表单的 取消
      scope.cancelAddBookForm = function() {
        scope.bookTitle = "";
        scope.toggleAddBookForm();
      };

      // 新增文集表单的 提交
      scope.submitAddBookForm = function() {
        var uid = scope.user.uid;
        var title = scope.bookTitle;
        BookManageService.addBook(uid, title)
          .then(function(data) {
            var bid = data.newBid;

            // todo..
            // 1. bid 需要绑定到 updateArticle 【???啥意思？
            scope.books.unshift({
              'bid': bid,
              'uid': uid,
              'title': title
            });

            // 手动更新 panel 的激活状态
            scope.active(bid);

            // 复原（隐藏并清空）新增文集表单
            scope.cancelAddBookForm();

            // 状态的切换 $state.go ：
            $state.go('writer.book', {
              bid: bid
            });
          })
          .catch(function(err) {
            console.log(err);
          });
      };
    }
  };
}]);

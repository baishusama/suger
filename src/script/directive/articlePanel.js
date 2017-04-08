'use strict';

angular.module('app').directive('appArticlePanel', ['$stateParams', 'ArticleManageService', '$state', function($stateParams, ArticleManageService, $state) {
  return {
    restrict: 'A',
    // replace: true,
    templateUrl: 'view/template/articlePanel.html',
    scope: {
      articles: '=',
      book: '=',
      user: '=',
      type: '='
    },
    link: function(scope) {
      // fortest
      console.log('>>> ArticlePanel REBORN!! <<< $stateParams : ', $stateParams);

      // articlePanel 的激活状态（当前激活的文章）
      scope.curArticle = $stateParams.aid;

      // article 的 menu
      scope.showMenu = false;

      // 激活函数
      scope.active = function(aid) {
        // 如果需要发生变化
        if (scope.curArticle !== aid) {
          // MENU should be hidden >_<!!
          scope.showMenu = false;
          scope.curArticle = aid;
        }
      };

      // menu 的显示/隐藏
      scope.toggleMenu = function() {
        if (scope.showMenu) {
          scope.showMenu = false;
        } else {
          scope.showMenu = true;
        }
      };

      // 进入状态 writer.*.article
      // writer.book.article || writer.draft.article
      // ui-sref="type !== 'draft' ? writer.book.article({bid:book.bid,aid:article.aid}) : writer.draft.article({aid:article.aid})"
      scope.goToArticle = function(aid) {
        var type = scope.type || 'book';

        console.log("In goToArticle, aid : ", aid);
        console.log("In goToArticle, type : ", type);

        $state.go('writer.' + type + '.article', {
          'aid': aid
        });

        // if (scope.type === 'draft') {
        //   $state.go('writer.draft.article', {
        //     'aid': aid
        //   });
        // } else {
        //   $state.go('writer.book.article', {
        //     'aid': aid
        //   });
        // }
      };

      // 添加新文章
      scope.addNewArticle = function() {
        var uid = scope.user.uid;
        var bid = scope.book.bid;

        ArticleManageService.addArticle(uid, bid)
          .then(function(resp) {
            var aid = resp.data.newAid;

            // 手动更新 articlePanel 的激活状态
            scope.active(aid);

            scope.articles.unshift({
              'aid': aid,
              'uid': uid,
              'bid': bid,
              'title': "无标题文章",
              'content': "",
              'published': 0
              // , 'abandoned': 0
            });

            // 当前 $state.go 的判断和跳转：（判断好像是多余的。。修改如下）
            // if ($state.is("writer.book.article")) {
            //   $state.go('writer.book.article', {
            //     'bid': bid, // need ???
            //     'aid': aid
            //   });
            // } else if ($state.is("writer.book")) {
            //   $state.go('.article', {
            //     'aid': aid
            //   });
            // } else {
            //   console.log('$state is Neither writer.book.article Nor writer.book But is ', $state);
            // }

            // 状态的切换 $state.go ：
            $state.go('writer.book.article', {
              'aid': aid
            });
          }).catch(function(err) {
            console.log('In appArticlePanel.addArticle, err :', err);
          });
      };

      // 丢弃文章
      scope.abandonArticle = function(aid) {
        ArticleManageService.abandonArticle(aid, 1)
          .then(function(resp) {
            // 修改文章状态为 2 - abandoned
            var arti = scope.articles.filter(function(elem) {
              return parseInt(elem.aid) === parseInt(aid);
            })[0];
            var index = scope.articles.indexOf(arti);
            scope.articles.splice(index, 1); // scope.articles[index].abandoned = '1';

            // 隐藏 menu
            scope.toggleMenu();

            // // 修改当前的 state
            // var bid = scope.book.bid;
            // $state.go('^');
          })
          .catch(function(err) {
            console.log('abandon failed..', err);
          });
      };
    }
  };
}]);

'use strict';

angular.module('app', ['ui.router', 'ngCookies', 'validation']).run(RootCtrl);

RootCtrl.$inject = ['$rootScope', '$state', 'ShowInfoService'];

function RootCtrl($rootScope, $state, ShowInfoService) {
  $rootScope.submitInfo = {
    info: "",
    theme: "default",
    opacity: "opacity-one"
  };

  $rootScope.loggedIn = false;

  // fortest todo..
  // $rootScope.testInfo = {
  //   info: '竟然可以直接从 子 scope 中找到 $rootScope 中的',
  //   theme: 'default'
  // };

  // ui-router doc: https://github.com/angular-ui/ui-router/wiki

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    // do nothing..
  });

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    if (error.authenticated === false) {
      $state.go('signin');
      ShowInfoService.popup("请先登录！", "warn");
    } else if (error.is404) {
      $state.go('404');
    }
  });
}

// 别忘了 index.html 里的 ng-app="app" ！！

'use strict';

// 隐式声明方式，
// 需要使用一个插件转换成显示声明的方式，
// 否则会对压缩造成影响
// angular.module('app').config(function(x,y) {});

// 显示声明方式
angular.module('app').config(Config);

Config.$inject = ['$stateProvider', '$urlRouterProvider'];

function Config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: 'view/signin.html',
      controller: 'SignInCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'view/signup.html',
      controller: 'SignUpCtrl'
    })
    .state('verify', {
      url: '/verify/:email/:hash',
      templateUrl: 'view/verify.html',
      controller: 'VerifyCtrl',
      resolve: VerifyCtrl.resolve
    })
    .state('home', {
      url: '/home',
      templateUrl: 'view/home.html',
      controller: 'HomeCtrl',
      resolve: HomeCtrl.resolve
    })
    .state('user', {
      url: '/user/:uid',
      templateUrl: 'view/user.html',
      controller: 'UserCtrl',
      resolve: UserCtrl.resolve
    })
    .state('writer', {
      // abstract: true,
      url: '/writer',
      templateUrl: 'view/writer.html',
      controller: 'WriterCtrl',
      resolve: WriterCtrl.resolve
    })
    // .state('writer.booklist', {
    //   url: '/book',
    //   templateUrl: 'view/writer.booklist.html'
    // })
    .state('writer.book', {
      url: '/book/:bid',
      templateUrl: 'view/writer.book.html',
      controller: 'BookCtrl',
      resolve: BookCtrl.resolve
    })
    .state('writer.book.article', {
      url: '/article/:aid',
      templateUrl: 'view/writer.book.article.html',
      controller: 'ArticleCtrl',
      resolve: ArticleCtrl.resolve
    })
    .state('writer.draft', {
      url: '/draft',
      templateUrl: 'view/writer.draft.html',
      controller: 'DraftCtrl',
      resolve: DraftCtrl.resolve
    })
    .state('writer.draft.article', {
      url: '/article/:aid',
      templateUrl: 'view/writer.draft.article.html',
      controller: 'ArticleCtrl',
      resolve: ArticleCtrl.resolve
    })
    .state('article', {
      url: '/article/:aid',
      templateUrl: 'view/article.html',
      controller: 'ArticlePageCtrl',
      resolve: ArticlePageCtrl.resolve
    })
    .state('404', {
      url: '/404',
      templateUrl: 'view/404.html'
    });

  // $urlRouterProvider.otherwise('home');
}

'use strict';

angular.module('app').controller('ArticleCtrl', ArticleCtrl);

ArticleCtrl.resolve = {
  _articleInfo: ['$stateParams', '_articlesInfo', '$q', function($stateParams, _articlesInfo, $q) {
    console.log('ArticleCtrl-RESO: _articlesInfo : ', _articlesInfo);

    var aid = $stateParams.aid;

    var curArticleObj = _articlesInfo.filter(function(elem) {
      return elem.aid === aid;
    })[0];

    if (curArticleObj === undefined) {
      // 如果当前文集（book）中没有文章的话，无法访问 writer.book.article 状态
      return $q.reject({
        is404: true
      });
    } else {
      return $q.when(curArticleObj);
    }
  }]
};

ArticleCtrl.$inject = ['$scope', '_articleInfo'];

function ArticleCtrl($scope, _articleInfo) {
  console.log("ARTICLE-Init: _articleInfo : ", _articleInfo);
  console.log("++++++++++++++++++++++++");

  $scope.articleInfo = _articleInfo;
}

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

'use strict';

angular.module('app').controller('HomeCtrl', HomeCtrl);

HomeCtrl.resolve = {
  _allArticles: ['FetchInfoService', 'MarkdownRenderService', function(FetchInfoService, MarkdownRenderService) {
    return FetchInfoService.getAllPublishedArticles()
      .then(function(resp) {
        var articles = (resp || []).map(function(elem) {
          elem.contentText = MarkdownRenderService.renderToText(elem.content);
          elem.cover = MarkdownRenderService.renderCover(elem.content);
          return elem;
        });
        return articles;
      })
      .catch(function(err) {
        return err;
      });
  }]
};

HomeCtrl.$inject = ['$scope', '_allArticles'];

function HomeCtrl($scope, _allArticles) {
  // fortest
  console.log('HomeCtrl INIT : ', _allArticles);

  $scope.articles = _allArticles;
}

'use strict';

angular.module('app').controller('SignInCtrl', SignInCtrl);

SignInCtrl.$inject = ['$scope', 'AuthenticationService'];

function SignInCtrl($scope, AuthenticationService) {
  $scope.signInInfo = {
    account: "",
    password: ""
  };

  // 密码的显示/隐藏
  $scope.pwdInputType = "password";
  $scope.iconEyeWhich = "icon-eye-close";
  $scope.showEyeIcon = false;
  $scope.changePwdInputType = function() {
    if ($scope.pwdInputType === "password") {
      $scope.pwdInputType = "text";
      $scope.iconEyeWhich = "icon-eye-open";
    } else {
      $scope.pwdInputType = "password";
      $scope.iconEyeWhich = "icon-eye-close";
    }
  };

  // 点击“登录”按钮提交表单
  $scope.signUserIn = function() {
    var account = $scope.signInInfo.account;
    var password = $scope.signInInfo.password;
    AuthenticationService.signin(account, password);
  };
}

'use strict';

angular.module('app').controller('SignUpCtrl', SignUpCtrl);

SignUpCtrl.$inject = ['$scope', 'ShowInfoService', 'CheckInfoService', 'AuthenticationService'];

function SignUpCtrl($scope, ShowInfoService, CheckInfoService, AuthenticationService) {
  $scope.signUpInfo = {
    username: "",
    email: "",
    password: "",
    repeatpwd: ""
  };

  $scope.warningInfo = {
    username: "",
    email: "",
    password: "",
    repeatpwd: ""
  };

  // 密码的显示/隐藏
  $scope.pwdInputType = "password";
  $scope.iconEyeWhich = "icon-eye-close";
  $scope.showEyeIcon = false;
  $scope.changePwdInputType = function() {
    if ($scope.pwdInputType === "password") {
      $scope.pwdInputType = "text";
      $scope.iconEyeWhich = "icon-eye-open";
    } else {
      $scope.pwdInputType = "password";
      $scope.iconEyeWhich = "icon-eye-close";
    }
  };

  // 检查每一项
  $scope.check = function($event) {
    var id = $event.target && $event.target.id;

    CheckInfoService.check(id, $scope.signUpInfo[id], $scope.signUpInfo.password)
      .then(function() {
        // 检查通过，清空提示信息
        $scope.warningInfo[id] = "";
      })
      .catch(function(err) {
        // 检查未通过，显示提示信息
        $scope.warningInfo[id] = err.msg;
      });
  };

  // 点击“注册”按钮提交表单
  $scope.signUserUp = function() {
    CheckInfoService.checkAll($scope.signUpInfo)
      .then(function() {
        var username = $scope.signUpInfo.username;
        var email = $scope.signUpInfo.email;
        var password = $scope.signUpInfo.password;
        for (var key in $scope.warningInfo) {
          $scope.warningInfo[key] = "";
        }
        ShowInfoService.popup("注册中，请稍候～");
        AuthenticationService.signup(username, email, password);
      })
      .catch(function(err) {
        $scope.warningInfo[err.name] = err.msg;
      });
  };
}

'use strict';

angular.module('app').controller('UserCtrl', UserCtrl);

UserCtrl.resolve = {
  // _userInfo: ['$stateParams', 'FetchInfoService', '$q', function($stateParams, FetchInfoService, $q) {
  //   var uid = $stateParams.uid;
  //
  //   return FetchInfoService.getAuthor(uid)
  //     .then(function(resp) {
  //       return resp;
  //     })
  //     .catch(function(err) {
  //       if (err.status === 404) {
  //         return $q.reject({
  //           is404: true
  //         });
  //       }
  //     });
  // }],
  _allArticlesWithUser: ['$stateParams', 'FetchInfoService', 'MarkdownRenderService', '$q', function($stateParams, FetchInfoService, MarkdownRenderService, $q) {
    var uid = $stateParams.uid;

    console.log('uid : ', uid);
    console.log('typeof uid : ', typeof uid);

    return FetchInfoService.getArticlesPublishedWithAuthor(uid)
      .then(function(resp) {
        var articles = resp.articles.map(function(elem) {
          elem.contentText = MarkdownRenderService.renderToText(elem.content);
          elem.cover = MarkdownRenderService.renderCover(elem.content);
          return elem;
        });
        return {
          author: resp.author,
          articles: articles
        };
      })
      .catch(function(err) {
        if (err.status === 404) {
          return $q.reject({
            is404: true
          });
        } else {
          console.log("_allArticlesWithUser ERRR : ", err);
          return err;
        }
      });
  }]
};

UserCtrl.$inject = ['$scope', '_allArticlesWithUser'];

function UserCtrl($scope, _allArticlesWithUser) {
  // $scope.user = ;
  $scope.userInfo = _allArticlesWithUser.author;
  $scope.articles = _allArticlesWithUser.articles;
  console.log('UserCtrl INIT, _allArticlesWithUser : ', _allArticlesWithUser);
}

'use strict';

angular.module('app').controller('VerifyCtrl', VerifyCtrl);

VerifyCtrl.resolve = {
  _verifyInfo: ['$state', '$stateParams', 'AuthenticationService', '$q', function($state, $stateParams, AuthenticationService, $q) {
    var email = $stateParams.email;
    var hash = $stateParams.hash;
    return AuthenticationService.verify(email, hash)
      .then(function(resp) {
        if (resp.status === 200) {
          return {
            msg: resp.data,
            icon: 'icon-ok-circle'
          };
        }
      })
      .catch(function(err) {
        if (err.status === 404) {
          return $q.reject({
            is404: true
          }); // 可行么???
        } else if (err.status === 400) {
          return {
            msg: err.data,
            icon: 'icon-remove-circle'
          };
        }
      });
  }]
};

VerifyCtrl.$inject = ['$scope', '_verifyInfo'];

function VerifyCtrl($scope, _verifyInfo) {
  $scope.verifyInfo = _verifyInfo;
}

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

'use strict';

angular.module('app').directive('appArticleContentEditor', ['ArticleManageService', function(ArticleManageService) {
  return {
    restrict: 'A',
    // replace: true,
    // templateUrl: 'view/template/articleContentEditor.html',
    scope: {
      appNgModel: '=',
      onImgDrop: '&'
    },
    link: function(scope, element) { // , attrs , controller
      // At the very beginning,
      //   When replace === true ,element is <textarea>
      //   When replace === false ,element is <textarea>'s parent
      // Now, (after changed the caller even with replace === false),
      // element is <textarea>
      var area = element[0];

      area.addEventListener('dragover', function(e) {
        if (e.preventDefault) e.preventDefault();
      }, false);

      area.addEventListener('dragenter', function(e) {
        if (e.preventDefault) e.preventDefault();
      }, false);

      area.addEventListener('dragleave', function(e) {
        if (e.preventDefault) e.preventDefault();
      }, false);

      area.addEventListener('drop', function(event) {
        event.preventDefault();

        scope.$apply(function() { // ???
          var params = {
            'files': event.dataTransfer.files
          };
          scope.onImgDrop({
            params: params
          });
        });

        return false;
      }, false);
    }
  };
}]);

'use strict';

angular.module('app').directive('appArticleContentRender', ['MarkdownRenderService', function(MarkdownRenderService) {
  return {
    restrict: 'A',
    // replace: true,
    // templateUrl: 'view/template/articleContentRender.html',
    scope: {
      appNgModel: '='
    },
    link: function(scope, element) {
      element.html(MarkdownRenderService.renderToHtml(scope.appNgModel));
    }
  };
}]);

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

'use strict';

angular.module('app').directive('appDraftEditor', ['ArticleManageService', 'ShowInfoService', '$state', function(ArticleManageService, ShowInfoService, $state) {
  return {
    restrict: 'A',
    // replace: true,
    templateUrl: 'view/template/draftEditor.html',
    scope: {
      article: '=',
      articles: '=',
      // updateArticlePanel: '&',
      recover: '&'
    },
    link: function(scope, element) {
      // console.log("In draftEditor, article : ", scope.article);

      scope.recover = function() {
        var aid = scope.article.aid;

        ArticleManageService.recoverArticle(aid)
          .then(function(resp) {
            var aid = resp.data.toString(); // => string
            var aids = scope.articles.map(function(elem) {
              return elem.aid;
            });
            var index = aids.indexOf(aid);
            scope.articles.splice(index, 1);

            // 显示提示信息
            ShowInfoService.popup("已恢复(,, ･∀･)ﾉ゛");

            // 去往父状态
            $state.go('writer.draft');
          })
          .catch(function(err) {
            console.log(err);
            // 显示提示信息
            ShowInfoService.popup("恢复失败 Orz。。\n错误码：" + err.status, 'warn');
          });
      };

      scope.delete = function() {
        var aid = scope.article.aid;
        console.log('In draftEditor.delete, aid : ', aid);

        ArticleManageService.deleteArticle(aid)
          .then(function(resp) {
            console.log(resp);
            var aid = resp.data.toString(); // => string
            var aids = scope.articles.map(function(elem) {
              return elem.aid;
            });
            var index = aids.indexOf(aid);
            scope.articles.splice(index, 1);

            // 显示提示信息
            ShowInfoService.popup("已删除=。=");

            // 去往父状态
            $state.go('writer.draft');
          })
          .catch(function(err) {
            console.log(err);
            ShowInfoService.popup("删除失败 Orz。。\n错误码：" + err.status, 'warn');
          });
      };
    }
  };
}]);

'use strict';

angular.module('app').directive('appEditor', ['AuthenticationService', 'ArticleManageService', '$timeout', function(AuthenticationService, ArticleManageService, $timeout) {
  return {
    restrict: 'A',
    // replace: true,
    templateUrl: 'view/template/editor.html',
    scope: {
      article: '='
    },
    link: function(scope, element) {
      // 获取输入框
      var inputElem = element.find('input');
      var textareaElem = element.find('textarea');
      var inputs = [inputElem, textareaElem];
      var saveTimeout = null;

      // 为输入框绑定 keydown 事件
      inputs.forEach(function(elem) {
        elem.on('keydown', function(event) {
          // console.log(event);
          var keyCode = event.keyCode;
          if ([16, 17, 18, 20, 91].indexOf(keyCode) !== -1) { // 分别对应 shift,ctrl,alt,CapsLock,cmd
            // 如果只是输入功能键，什么也不会发生
          } else if (event.ctrlKey && keyCode === 83 || event.metaKey && keyCode === 83) { // Ctrl + S || Cmd + S
            // 用户的手动保存
            event.preventDefault();
            scope.save();
          } else {
            // 系统的自动保存
            $timeout.cancel(saveTimeout);
            saveTimeout = $timeout(function() {
              scope.autoSave();
            }, 1500);
          }
        });
      });

      // 用户信息（主要是图片上传存放路径需要：e.g. image/$uid/$aid/*.jpg）
      scope.user = AuthenticationService.getLoggedInCache();

      // “保存”相关的提示信息
      scope.saveMsg = "";

      // 清除“保存”相关的提示信息
      scope.clearSaveMsg = function() {
        $timeout(function() {
          scope.saveMsg = "";
        }, 1000);
      };

      // 保存文章（手动）
      scope.save = function(auto) {
        scope.saveMsg = "正在保存..";
        var prefix = auto ? "自动" : "";
        var aid = scope.article.aid;
        var title = scope.article.title;
        var content = scope.article.content;

        ArticleManageService.updateArticle(aid, title, content)
          .then(function(okMsg) {
            scope.saveMsg = prefix + okMsg;
            scope.clearSaveMsg();
          })
          .catch(function(errMsg) {
            scope.saveMsg = prefix + errMsg;
            scope.clearSaveMsg();
          });
      };
      // 保存文章（自动）
      scope.autoSave = function() {
        scope.save(true);
      };

      // 改变文章的发布状态
      scope.changePublish = function() {
        var aid = scope.article.aid;
        var published = (scope.article.published === '0') ? '1' : '0';
        ArticleManageService.publishArticle(aid, published)
          .then(function(resp) {
            console.log("In appEditor.publish, resp : ", resp);
            scope.article.published = published;
          })
          .catch(function(err) {
            console.log("In appEditor.publish, err : ", err);
          });
      };

      // 当发生 drop 事件的时候，上传图片
      scope.uploadImgFile = function(params) {
        // fortest
        console.log('uploadImgFile func...');
        console.log('uploadImgFile\'s params: ', params);

        var files = params.files;
        var uid = scope.user.uid;
        var aid = scope.article.aid;

        // 准备 formdata 和 appendText
        var uploadFormData = new FormData();
        var tmpContent = scope.article.content;
        var appendUploadingText = "";
        var appendFinishedText = "";
        // uploadFormData.append('file', files[0]);
        if (files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            // 这里要先判断文件的类型：
            // 如果不是图片（png,jpg,gif）的话直接退出函数
            if (files[i].type.indexOf('image') !== -1) {
              uploadFormData.append('file' + i, files[i]);
              appendUploadingText += ("\n\n![图片 " + files[i].name + " 上传中..]");
            } else {
              alert("请上传图片，而不是其他文件！");
              return false;
            }
          }
        } else {
          alert("files.length === 0 OAO..");
          return false;
        }
        uploadFormData.append('uid', uid);
        uploadFormData.append('aid', aid);

        // Display the key/value pairs
        // for (var pair of uploadFormData.entries()) {
        //   console.log(pair[0] + ', ' + pair[1]);
        // }

        // 在文章内容中添加“图片上传中”字样
        // 简单起见，暂时放在最末尾吧
        scope.article.content += appendUploadingText;

        // 上传图片
        ArticleManageService.uploadImage(uploadFormData)
          .then(function(resp) {
            console.log('In appEditor.uploadImgFile, resp : ', resp);

            // 在文章内容中将“图片上传中”字样替换为对应的 url 或者提示信息
            // 简单起见，暂时放在最末尾吧
            for (var i = 0; i < files.length; i++) {
              var piece = resp.data[i];
              appendFinishedText += ("\n\n![" + piece.name + "](" + piece.url + ")");
            }
            scope.article.content = tmpContent + appendFinishedText;
            scope.autoSave();
          })
          .catch(function(err) {
            console.log('In appEditor.uploadImgFile, err : ', err);

            // 在文章内容中将“图片上传中”字样替换为对应的 url 或者提示信息
            // 简单起见，暂时放在最末尾吧
            for (var i = 0; i < files.length; i++) {
              var piece = err.data[i];
              appendFinishedText += ("\n\n![" + piece.name + "](" + piece.url + ")");
            }
            scope.article.content = tmpContent + appendFinishedText;
            scope.autoSave();
          });
      };
    }
  };
}]);

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

// 'use strict';
//
// angular.module('app').directive('appSubmitInfo', [function() {
//   return {
//     restrict: 'A',
//     // replace: true,
//     // templateUrl: 'view/template/submitInfo.html',
//     scope: {
//       // theme: '=',
//       // info: '='
//     }
//   };
// }]);

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

'use strict';

angular.module('app').factory('ArticleManageService', ArticleManageService);

ArticleManageService.$inject = ['$http', '$q'];

function ArticleManageService($http, $q) {
  var ROOT = "http://localhost/blog/build/";

  // 新建文章
  function addArticle(uid, bid) {
    var data = {
      'uid': uid,
      'bid': bid
    };

    var deferred = $q.defer();

    $http.post(ROOT + 'api/article/new.php', data)
      .then(function(resp) {
        deferred.resolve(resp);
      })
      .catch(function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  // 更新（保存）文章
  function updateArticle(aid, title, content) {
    var data = {
      'aid': aid,
      'title': title,
      'content': content
    };

    var deferred = $q.defer();
    var msg = "";

    $http.post(ROOT + 'api/article/update.php', data)
      .then(function(resp) {
        // if (resp.status === 200) {
        //   msg = "保存成功 :P";
        // } else if (resp.status === 204) {
        //   msg = "已是最新 :)";
        // }
        msg = "保存成功 :P";
        deferred.resolve(msg);
      })
      .catch(function(err) {
        msg = "保存失败 XO";
        deferred.reject(msg);
      });

    return deferred.promise;
  }

  // 发布/取消发布文章
  function publishArticle(aid, published) {
    var data = {
      'aid': aid,
      'published': published
    };

    var deferred = $q.defer();

    $http.post(ROOT + 'api/article/publish.php', data)
      .then(function(resp) {
        deferred.resolve(resp);
      })
      .catch(function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  // 文章放入废纸箱
  function abandonArticle(aid, abandoned) {
    var data = {
      'aid': aid,
      'abandoned': abandoned
    };

    return $http.post(ROOT + 'api/article/abandon.php', data);
  }

  // 文章取消放入废纸箱
  function recoverArticle(aid) {
    return abandonArticle(aid, 0);
  }

  // 彻底删除文章
  function deleteArticle(aid) {
    var data = {
      'aid': aid
    };

    return $http.post(ROOT + 'api/article/deleteDevOnly.php', data);
  }

  // 上传图片
  function uploadImage(uploadImgData) {
    var data = uploadImgData;

    var deferred = $q.defer();

    $http.post(ROOT + 'api/image/uploadDevOnly.php', data, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
        // headers: {
        //   (x) 'Content-Type': 'multipart/form-data; charset=utf-8'
        // }
      })
      .then(function(resp) {
        deferred.resolve(resp);
      })
      .catch(function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  return {
    addArticle: addArticle,
    updateArticle: updateArticle,
    publishArticle: publishArticle,
    abandonArticle: abandonArticle,
    recoverArticle: recoverArticle,
    deleteArticle: deleteArticle,
    uploadImage: uploadImage
  };
}

'use strict';

angular.module('app').factory('AuthenticationService', AuthenticationService);

AuthenticationService.$inject = ['$http', '$q', '$state', 'cache', 'ShowInfoService'];

function AuthenticationService($http, $q, $state, cache, ShowInfoService) {
  var ROOT = "http://localhost/blog/build/";

  function signup(username, email, password) {
    var data = {
      'username': username,
      'email': email,
      'password': password
    };

    $http.post(ROOT + 'api/user/signup.php', data).then(function(resp) {
      ShowInfoService.popup("注册成功！！" + resp.data);

      $state.go('signin');
    }).catch(function(err) {
      // 显示提示信息
      var msg = "";
      var thm = "warn";
      if (err.status === 400) {
        msg = "注册失败，请检查输入 :/";
      } else if (err.status === 409) {
        msg = "注册失败，用户名或者邮箱已被使用 :/";
      } else {
        msg = "注册失败（错误码：" + err.status + "）请联系开发人员解决QAQQ";
      }
      ShowInfoService.popup(msg, thm);
    });
  }

  function signin(account, password) {
    var data = {
      'account': account,
      'password': password
    };

    $http.post(ROOT + 'api/user/signin.php', data).then(function(resp) {
      // 缓存登录信息
      cache.put('isLoggedin', true);
      cache.put('uid', resp.data.id);
      cache.put('username', resp.data.name);
      cache.put('avatar', resp.data.avatar);
      cache.put('role', resp.data.role);
      cache.put('active', resp.data.active);

      // 本来想保存是否已登陆的信息的，
      // 但是，只是缓存 true 感觉没卵用，应该缓存信息（因为头像显示需要。。）
      // 而且，感觉和上面 cache 有所重复。。【决定放到 header.js 里了！
      // $rootScope.loggedIn = true;

      // 显示提示信息
      var msg = "登录成功！！";
      // var thm = "default";
      ShowInfoService.popup(msg);

      // 页面发生跳转
      $state.go('home');
    }).catch(function(err) {
      // 显示提示信息
      var msg = "登录失败，用户名不存在或者密码错误。";
      var thm = "warn";
      ShowInfoService.popup(msg, thm);
    });
  }

  function signout() {
    cache.remove('isLoggedin');
    cache.remove('uid');
    cache.remove('username');
    cache.remove('avatar');
    cache.remove('role');
    cache.remove('active');

    // 退出没必要跳转
    // $state.go('signin');
  }

  function getLoggedInCache() {
    if (cache.get('isLoggedin')) {
      return {
        uid: cache.get('uid'),
        username: cache.get('username'),
        avatar: cache.get('avatar'),
        role: cache.get('role'),
        active: cache.get('active')
      };
    }
    return null;
  }

  function verify(email, hash) {
    var data = {
      'email': email,
      'hash': hash
    };

    var deferred = $q.defer();

    $http.post(ROOT + 'api/user/verify.php', data).then(function(resp) {
      if (getLoggedInCache()) {
        cache.put('active', '1');
      }

      deferred.resolve(resp);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  return {
    signup: signup,
    signin: signin,
    signout: signout,
    verify: verify,
    getLoggedInCache: getLoggedInCache
  };
}

'use strict';

angular.module('app').factory('BookManageService', BookManageService);

BookManageService.$inject = ['$http'];

function BookManageService($http) {
  var ROOT = "http://localhost/blog/build/";

  function addBook(uid, title) {
    var data = {
      'uid': uid,
      'title': title
    };

    return $http.post(ROOT + 'api/book/new.php', data)
      .then(function(resp) {
        return resp.data;
      })
      .catch(function(err) {
        return err;
      });
  }

  function abandonBook(uid, bid) {
    // todo..
  }

  return {
    addBook: addBook
  };
}

'user strict';

angular.module('app').service('CheckInfoService', CheckInfoService);

CheckInfoService.$inject = ['$http', '$q'];

function CheckInfoService($http, $q) {
  // 用于检查“用户名”或者“邮箱”是否已经存在
  var checkDuplicat = function(key, value) {
    var deferred = $q.defer();

    $http.get('api/user/checkdup.php?key=' + key + '&value=' + value).then(function(resp) {
      deferred.resolve(resp);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  // 检查用户名
  var checkUsername = function(value) {
    var key = "username";
    var name = "用户名";
    var msg = "";

    var deferred = $q.defer();

    if (/^\s*$/.test(value)) {
      msg = name + "不能为空。";
      deferred.reject({
        'name': key,
        'msg': msg
      });
    }

    if (/[^_a-zA-Z0-9\u4e00-\u9fa5]/.test(value)) {
      msg = name + "格式无效，只能包含英文、汉字、数字及下划线，不能包含空格。";
      deferred.reject({
        'name': key,
        'msg': msg
      });
    }

    if (value.length > 15) {
      msg = name + "过长（最长15个字符）。";
      deferred.reject({
        'name': key,
        'msg': msg
      });
    }

    checkDuplicat(key, value)
      .then(function(resp) {
        deferred.resolve(resp);
      }).catch(function(err) {
        if (err.status === 409) {
          msg = name + "已经被使用。";
        } else {
          msg = name + "查重失败 qwq 错误码：" + err.status;
        }
        deferred.reject({
          'name': key,
          'msg': msg
        });
      });

    return deferred.promise;
  };

  // 检查邮箱
  var checkEmail = function(value) {
    var key = "email";
    var name = "邮箱";
    var msg = "";

    var deferred = $q.defer();

    if (/^\s*$/.test(value)) {
      msg = name + "不能为空。";
      deferred.reject({
        'name': key,
        'msg': msg
      });
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      msg = name + "格式应为example@example.example。";
      deferred.reject({
        'name': key,
        'msg': msg
      });
    }

    checkDuplicat(key, value)
      .then(function(resp) {
        deferred.resolve(resp);
      }).catch(function(err) {
        if (err.status === 409) {
          msg = name + "已经被使用。";
        } else {
          msg = name + "查重失败 qwq 错误码：" + err.status;
        }
        deferred.reject({
          'name': key,
          'msg': msg
        });
      });

    return deferred.promise;
  };

  // 检查密码
  var checkPassword = function(value) {
    var key = "password";
    var name = "密码";
    var msg = "";

    var deferred = $q.defer();

    if (value.length < 6 || value.length > 16) {
      msg = name + "长度需不少于6个字符，不超过16个字符。";
      deferred.reject({
        'name': key,
        'msg': msg
      });
    }

    if (!(/\d/.test(value) && /[a-zA-Z]/.test(value))) {
      msg = name + "需至少包含字母和数字。";
      deferred.reject({
        'name': key,
        'msg': msg
      });
    }

    deferred.resolve(msg);

    return deferred.promise;
  };

  // 检查两次密码输入是否一致
  var checkRepeatpwd = function(pwd1, pwd2) {
    var key = "repeatpwd";
    var msg = "";
    var deferred = $q.defer();

    if (pwd1 !== pwd2) {
      msg = "两次密码输入不一致！";
      deferred.reject({
        'name': key,
        'msg': msg
      });
    }

    deferred.resolve(msg);

    return deferred.promise;
  };

  // 检查每一项
  this.check = function(key, value, value2) {
    var deferred = $q.defer();

    if (key === 'username') {
      checkUsername(value)
        .then(function() {
          deferred.resolve();
        })
        .catch(function(err) {
          deferred.reject(err);
        });
    } else if (key === "email") {
      checkEmail(value)
        .then(function() {
          deferred.resolve();
        })
        .catch(function(err) {
          deferred.reject(err);
        });
    } else if (key === "password") {
      checkPassword(value)
        .then(function() {
          deferred.resolve();
        })
        .catch(function(err) {
          deferred.reject(err);
        });
    } else if (key === "repeatpwd") {
      checkRepeatpwd(value, value2)
        .then(function() {
          deferred.resolve();
        })
        .catch(function(err) {
          deferred.reject(err);
        });
    }

    return deferred.promise;
  };

  // 检查所有项
  this.checkAll = function(info) {
    var deferred = $q.defer();

    $q.all([
        checkUsername(info.username),
        checkEmail(info.email),
        checkPassword(info.password),
        checkRepeatpwd(info.repeatpwd, info.password)
      ])
      .then(function(resp) {
        deferred.resolve(resp);
      })
      .catch(function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  };
}

'use strict';

angular.module('app').factory('FetchInfoService', FetchInfoService);

FetchInfoService.$inject = ['$http', '$q'];

function FetchInfoService($http, $q) {
  // var ROOT = "http://localhost/blog/build/";

  // 获取某个作者的所有文集（过滤暂时放在 resolve 部分）
  function getAllBooksBy(uid) {
    var deferred = $q.defer();

    $http.get('api/book/byuser.php?uid=' + uid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取某个文集的所有文章（过滤暂时放在 resolve 部分）
  function getAllArticlesFrom(bid) {
    var deferred = $q.defer();

    $http.get('api/article/frombook.php?bid=' + bid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取某篇已发布的文章的信息
  function getPublishedArticle(aid) {
    var deferred = $q.defer();

    $http.get('api/article/single.php?aid=' + aid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取全部已发布的文章的信息（包含首图和作者信息）
  function getAllPublishedArticles() {
    var deferred = $q.defer();

    $http.get('api/article/allPublished.php').then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取某个作者全部已发布的文章的信息（包含首图和作者信息）
  function getArticlesPublishedWithAuthor(uid) {
    var deferred = $q.defer();

    $http.get('api/article/publishedWithUser.php?uid=' + uid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取某个作者全部已丢弃的文章的信息
  function getArticlesAbandonedByUser(uid) {
    return $http.get('api/article/abandonedByUser.php?uid=' + uid);
  }

  // 获取某篇文章的作者信息
  function getAuthor(uid) {
    var deferred = $q.defer();

    $http.get('api/user/author.php?uid=' + uid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  return {
    getAllBooksBy: getAllBooksBy,
    getAllArticlesFrom: getAllArticlesFrom,
    getPublishedArticle: getPublishedArticle,
    getAllPublishedArticles: getAllPublishedArticles,
    getArticlesPublishedWithAuthor: getArticlesPublishedWithAuthor,
    getArticlesAbandonedByUser: getArticlesAbandonedByUser,
    getAuthor: getAuthor
  };
}

'use strict';

angular.module('app').factory('MarkdownRenderService', [function() {
  // 生成含类名的 HTML 标签
  var wrapTextIn = function(tagname, classname) {
    var clsn = classname || '';
    var openingTag = '<' + tagname + ' class="' + clsn + '">';
    var closingTag = '</' + tagname + '>';
    return openingTag + this + closingTag;
  };

  // 生成图片及说明文字
  var toImgTag = function(line) {
    var img = line.replace(/^\!\[(.*)\]\((.+)\)$/,
      '<div class="image-wrapper">' +
      '<img alt="$1" src="$2" />' +
      // '<br />' +
      '<div class="image-caption">' +
      '$1' +
      '</div></div>');
    return img;
  };

  // 生成链接
  var toAnchor = function(line) {
    var a = line.replace(/\[(.+?)\]\((.+?)\)/,
      '<a href="$2">' +
      '$1' +
      '</a>');
    return a;
  };

  // 生成有序和无序列表
  var toList = function(line) {
    function toNestedList(item, hier) {
      // When hier === 0, re = /(?:^[*] )|(?:\n[*] )/
      // When hier === 1, re = /(?:^[ ]{4}[*] )|(?:\n[ ]{4}[*] )/

      // 当前的层级（缩进）
      var spaceNum = hier * 4;

      // ul 和 ol 的正则
      var ure = new RegExp("(?:^[ ]{" + spaceNum + "}[*+-] )|(?:\\n[ ]{" + spaceNum + "}[*+-] )");
      var ore = new RegExp("(?:^[ ]{" + spaceNum + "}[0-9]+[.] )|(?:\\n[ ]{" + spaceNum + "}[0-9]+[.] )");

      var list = null;
      if (ure.test(item)) {
        // ul
        list = item.split(ure).map(function(item, index) {
          if (index === 0) {
            return item;
          } else {
            return '<li class="hierarchy-' + hier + '">' + toNestedList(item, hier + 1) + '</li>';
          }
        });
        return list[0] + '<ul class="hierarchy-' + hier + '">' + list.slice(1).join('') + '</ul>';
      } else if (ore.test(item)) {
        // ol
        list = item.split(ore).map(function(item, index) {
          if (index === 0) {
            return item;
          } else {
            return '<li class="hierarchy-' + hier + '">' + toNestedList(item, hier + 1) + '</li>';
          }
        });
        return list[0] + '<ol class="hierarchy-' + hier + '">' + list.slice(1).join('') + '</ol>';
      }

      return item;
    }

    // Way 1. 第一层展开写，后代层使用递归函数 toNestedList
    // var listContent = line.split(/(?:^[*] )|(?:\n[*] )/).map(function(item) {
    //   return '<li class="hierarchy-0">' + toNestedList(item, 1) + '</li>';
    // });
    // return '<ul class="hierarchy-0">' + listContent.slice(1).join('') + '</ul>';

    // Way 2. 全使用递归函数 toNestedList
    return toNestedList(line, 0);
  };

  // 渲染函数：将 MD 格式的文本转成 HTML
  function renderToHtml(string) {
    var result = "";

    // 1. 换行符 & 空格
    //   1.1. 保留单个换行符
    //   1.2. 多个换行符视为两个换行
    //   1.3. 首尾的空格会被去除
    //   1.4. ~~行内的多个空格（包括 Tab）视为一个空格~~
    var lines = string.replace(/\n{2,}/, '\n\n')
      .split('\n\n')
      .map(function(line) {
        return line.trim(); // .replace(/[ \t]+/, ' ')
      });

    // 2. 先检查行内 HTML 标签
    lines = lines.map(function(line) {
      // 删除线
      while (/[~]{2}.+[~]{2}/.test(line)) {
        line = line.replace(/[~]{2}(.+?)[~]{2}/, "<del>$1</del>");
      }
      // 加粗
      while (/[*]{2}.+[*]{2}/.test(line)) {
        line = line.replace(/[*]{2}(.+?)[*]{2}/, "<strong>$1</strong>");
      }
      // 斜体
      while (/[*]{1}.+[*]{1}/.test(line)) {
        line = line.replace(/[*]{1}(.+?)[*]{1}/, "<em>$1</em>");
      }
      // 行内代码
      while (/`.+`/.test(line)) {
        line = line.replace(/`(.+?)`/, "<code>$1</code>");
      }

      return line;
    });

    // 3. 添加非行内的 HTML 标签
    lines = lines.map(function(line) {
      if (/^> /.test(line)) {
        var quoteArr = line.split(/(?:^> )|(?:\n> )/).slice(1);
        quoteArr = quoteArr.map(function(elem) {
          if (elem.length === 0) {
            return '\n';
          }
          return elem;
        });
        // 引言中的部分视为一个新的 string （递归使用 render 进行渲染）
        var quoteStr = quoteArr.join('\n'); // quoteStr 相当于去掉了最左侧的一层'> '
        return '<blockquote>' + renderToHtml(quoteStr) + '</blockquote>';
      }

      if (/^\!\[.*\]\(.+\)$/.test(line)) {
        // 图片
        line = toImgTag(line);
      } else if (/^#/.test(line)) {
        // 标题（h1-h6）
        var sharpNum = line.match(/^#+/)[0].length;
        sharpNum = Math.min(sharpNum, 6);
        var text = line.replace(/^#+\s*/, '');
        line = wrapTextIn.call(text, 'h' + sharpNum);
      } else if (/(?:^[*] )|(?:^1\. )/.test(line)) {
        // 无序列表/有序列表
        line = toList(line);
      } else {
        // 段落
        line = wrapTextIn.call(line, 'p');
      }

      // 链接（严格说算行内，但是在图片后判断相对会更简单）
      while (/\[.+\]\(.+\)/.test(line)) {
        line = toAnchor(line);
      }

      return line;
    });

    // result += "<div>" + lines.join('') + "</div>";
    result += lines.join('');

    return result;
  }

  function renderToText(string) {
    var html = renderToHtml(string);
    // todo..不知道下面的 dom 操作有没有更 NG 的写法（估计是用 jqLite）
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.innerText;
  }

  function renderCover(string) {
    var html = renderToHtml(string);
    // todo..不知道下面的 dom 操作有没有更 NG 的写法（估计是用 jqLite）
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    var firstImg = wrapper.getElementsByTagName('img')[0];
    var cover = firstImg && firstImg.src || "";

    return cover;
  }

  return {
    renderToHtml: renderToHtml,
    renderToText: renderToText,
    renderCover: renderCover
  };
}]);

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

'use strict';

angular.module('app').service('cache', ['$cookies', function($cookies) {
  this.put = function(key, value) {
    $cookies.put(key, value);
  };

  this.get = function(key) {
    return $cookies.get(key);
  };

  this.remove = function(key) {
    $cookies.remove(key);
  };
}]);

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

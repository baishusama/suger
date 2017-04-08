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

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

"use strict";function RootCtrl(e,t,r){e.submitInfo={info:"",theme:"default",opacity:"opacity-one"},e.loggedIn=!1,e.$on("$stateChangeSuccess",function(e,t,r,n,o){}),e.$on("$stateChangeError",function(e,n,o,i,a,c){c.authenticated===!1?(t.go("signin"),r.popup("请先登录！","warn")):c.is404&&t.go("404")})}function Config(e,t){e.state("signin",{url:"/signin",templateUrl:"view/signin.html",controller:"SignInCtrl"}).state("signup",{url:"/signup",templateUrl:"view/signup.html",controller:"SignUpCtrl"}).state("verify",{url:"/verify/:email/:hash",templateUrl:"view/verify.html",controller:"VerifyCtrl",resolve:VerifyCtrl.resolve}).state("home",{url:"/home",templateUrl:"view/home.html",controller:"HomeCtrl",resolve:HomeCtrl.resolve}).state("user",{url:"/user/:uid",templateUrl:"view/user.html",controller:"UserCtrl",resolve:UserCtrl.resolve}).state("writer",{url:"/writer",templateUrl:"view/writer.html",controller:"WriterCtrl",resolve:WriterCtrl.resolve}).state("writer.book",{url:"/book/:bid",templateUrl:"view/writer.book.html",controller:"BookCtrl",resolve:BookCtrl.resolve}).state("writer.book.article",{url:"/article/:aid",templateUrl:"view/writer.book.article.html",controller:"ArticleCtrl",resolve:ArticleCtrl.resolve}).state("writer.draft",{url:"/draft",templateUrl:"view/writer.draft.html",controller:"DraftCtrl",resolve:DraftCtrl.resolve}).state("writer.draft.article",{url:"/article/:aid",templateUrl:"view/writer.draft.article.html",controller:"ArticleCtrl",resolve:ArticleCtrl.resolve}).state("article",{url:"/article/:aid",templateUrl:"view/article.html",controller:"ArticlePageCtrl",resolve:ArticlePageCtrl.resolve}).state("404",{url:"/404",templateUrl:"view/404.html"})}function ArticleCtrl(e,t){e.articleInfo=t}function ArticlePageCtrl(e,t,r,n){e.authorInfo=t,e.articleInfo=r,e.userInfo=n.getLoggedInCache()||{}}function BookCtrl(e,t,r){e.bookInfo=t,e.articlesInfo=r}function DraftCtrl(e,t){e.abandonedArticles=t}function HomeCtrl(e,t){e.articles=t}function SignInCtrl(e,t){e.signInInfo={account:"",password:""},e.pwdInputType="password",e.iconEyeWhich="icon-eye-close",e.showEyeIcon=!1,e.changePwdInputType=function(){"password"===e.pwdInputType?(e.pwdInputType="text",e.iconEyeWhich="icon-eye-open"):(e.pwdInputType="password",e.iconEyeWhich="icon-eye-close")},e.signUserIn=function(){var r=e.signInInfo.account,n=e.signInInfo.password;t.signin(r,n)}}function SignUpCtrl(e,t,r,n){e.signUpInfo={username:"",email:"",password:"",repeatpwd:""},e.warningInfo={username:"",email:"",password:"",repeatpwd:""},e.pwdInputType="password",e.iconEyeWhich="icon-eye-close",e.showEyeIcon=!1,e.changePwdInputType=function(){"password"===e.pwdInputType?(e.pwdInputType="text",e.iconEyeWhich="icon-eye-open"):(e.pwdInputType="password",e.iconEyeWhich="icon-eye-close")},e.check=function(t){var n=t.target&&t.target.id;r.check(n,e.signUpInfo[n],e.signUpInfo.password).then(function(){e.warningInfo[n]=""}).catch(function(t){e.warningInfo[n]=t.msg})},e.signUserUp=function(){r.checkAll(e.signUpInfo).then(function(){var r=e.signUpInfo.username,o=e.signUpInfo.email,i=e.signUpInfo.password;for(var a in e.warningInfo)e.warningInfo[a]="";t.popup("注册中，请稍候～"),n.signup(r,o,i)}).catch(function(t){e.warningInfo[t.name]=t.msg})}}function UserCtrl(e,t){e.userInfo=t.author,e.articles=t.articles}function VerifyCtrl(e,t){e.verifyInfo=t}function WriterCtrl(e,t,r){e.userInfo=t,e.booksInfo=r}function ArticleManageService(e,t){function r(r,n){var o={uid:r,bid:n},i=t.defer();return e.post(u+"api/article/new.php",o).then(function(e){i.resolve(e)}).catch(function(e){i.reject(e)}),i.promise}function n(r,n,o){var i={aid:r,title:n,content:o},a=t.defer(),c="";return e.post(u+"api/article/update.php",i).then(function(e){c="保存成功 :P",a.resolve(c)}).catch(function(e){c="保存失败 XO",a.reject(c)}),a.promise}function o(r,n){var o={aid:r,published:n},i=t.defer();return e.post(u+"api/article/publish.php",o).then(function(e){i.resolve(e)}).catch(function(e){i.reject(e)}),i.promise}function i(t,r){var n={aid:t,abandoned:r};return e.post(u+"api/article/abandon.php",n)}function a(e){return i(e,0)}function c(t){var r={aid:t};return e.post(u+"api/article/delete.php",r)}function l(r){var n=r,o=t.defer();return e.post(u+"api/image/upload.php",n,{transformRequest:angular.identity,headers:{"Content-Type":void 0}}).then(function(e){o.resolve(e)}).catch(function(e){o.reject(e)}),o.promise}var u="http://baishu.applinzi.com/blog/";return{addArticle:r,updateArticle:n,publishArticle:o,abandonArticle:i,recoverArticle:a,deleteArticle:c,uploadImage:l}}function AuthenticationService(e,t,r,n,o){function i(t,n,i){var a={username:t,email:n,password:i};e.post(s+"api/user/signup.php",a).then(function(e){o.popup("注册成功！！"+e.data),r.go("signin")}).catch(function(e){var t="";t=400===e.status?"注册失败，请检查输入 :/":409===e.status?"注册失败，用户名或者邮箱已被使用 :/":"注册失败（错误码："+e.status+"）请联系开发人员解决QAQQ",o.popup(t,"warn")})}function a(t,i){var a={account:t,password:i};e.post(s+"api/user/signin.php",a).then(function(e){n.put("isLoggedin",!0),n.put("uid",e.data.id),n.put("username",e.data.name),n.put("avatar",e.data.avatar),n.put("role",e.data.role),n.put("active",e.data.active);o.popup("登录成功！！"),r.go("home")}).catch(function(e){o.popup("登录失败，用户名不存在或者密码错误。","warn")})}function c(){n.remove("isLoggedin"),n.remove("uid"),n.remove("username"),n.remove("avatar"),n.remove("role"),n.remove("active")}function l(){return n.get("isLoggedin")?{uid:n.get("uid"),username:n.get("username"),avatar:n.get("avatar"),role:n.get("role"),active:n.get("active")}:null}function u(r,o){var i={email:r,hash:o},a=t.defer();return e.post(s+"api/user/verify.php",i).then(function(e){l()&&n.put("active","1"),a.resolve(e)}).catch(function(e){a.reject(e)}),a.promise}var s="http://baishu.applinzi.com/blog/";return{signup:i,signin:a,signout:c,verify:u,getLoggedInCache:l}}function BookManageService(e){function t(t,n){var o={uid:t,title:n};return e.post(r+"api/book/new.php",o).then(function(e){return e.data}).catch(function(e){return e})}var r="http://baishu.applinzi.com/blog/";return{addBook:t}}function CheckInfoService(e,t){var r=function(r,n){var o=t.defer();return e.get("api/user/checkdup.php?key="+r+"&value="+n).then(function(e){o.resolve(e)}).catch(function(e){o.reject(e)}),o.promise},n=function(e){var n="username",o="",i=t.defer();return/^\s*$/.test(e)&&(o="用户名不能为空。",i.reject({name:n,msg:o})),/[^_a-zA-Z0-9\u4e00-\u9fa5]/.test(e)&&(o="用户名格式无效，只能包含英文、汉字、数字及下划线，不能包含空格。",i.reject({name:n,msg:o})),e.length>15&&(o="用户名过长（最长15个字符）。",i.reject({name:n,msg:o})),r(n,e).then(function(e){i.resolve(e)}).catch(function(e){o=409===e.status?"用户名已经被使用。":"用户名查重失败 qwq 错误码："+e.status,i.reject({name:n,msg:o})}),i.promise},o=function(e){var n="email",o="",i=t.defer();return/^\s*$/.test(e)&&(o="邮箱不能为空。",i.reject({name:n,msg:o})),/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)||(o="邮箱格式应为example@example.example。",i.reject({name:n,msg:o})),r(n,e).then(function(e){i.resolve(e)}).catch(function(e){o=409===e.status?"邮箱已经被使用。":"邮箱查重失败 qwq 错误码："+e.status,i.reject({name:n,msg:o})}),i.promise},i=function(e){var r="",n=t.defer();return(e.length<6||e.length>16)&&(r="密码长度需不少于6个字符，不超过16个字符。",n.reject({name:"password",msg:r})),/\d/.test(e)&&/[a-zA-Z]/.test(e)||(r="密码需至少包含字母和数字。",n.reject({name:"password",msg:r})),n.resolve(r),n.promise},a=function(e,r){var n="",o=t.defer();return e!==r&&(n="两次密码输入不一致！",o.reject({name:"repeatpwd",msg:n})),o.resolve(n),o.promise};this.check=function(e,r,c){var l=t.defer();return"username"===e?n(r).then(function(){l.resolve()}).catch(function(e){l.reject(e)}):"email"===e?o(r).then(function(){l.resolve()}).catch(function(e){l.reject(e)}):"password"===e?i(r).then(function(){l.resolve()}).catch(function(e){l.reject(e)}):"repeatpwd"===e&&a(r,c).then(function(){l.resolve()}).catch(function(e){l.reject(e)}),l.promise},this.checkAll=function(e){var r=t.defer();return t.all([n(e.username),o(e.email),i(e.password),a(e.repeatpwd,e.password)]).then(function(e){r.resolve(e)}).catch(function(e){r.reject(e)}),r.promise}}function FetchInfoService(e,t){function r(r){var n=t.defer();return e.get("api/book/byuser.php?uid="+r).then(function(e){n.resolve(e.data)}).catch(function(e){n.reject(e)}),n.promise}function n(r){var n=t.defer();return e.get("api/article/frombook.php?bid="+r).then(function(e){n.resolve(e.data)}).catch(function(e){n.reject(e)}),n.promise}function o(r){var n=t.defer();return e.get("api/article/single.php?aid="+r).then(function(e){n.resolve(e.data)}).catch(function(e){n.reject(e)}),n.promise}function i(){var r=t.defer();return e.get("api/article/allPublished.php").then(function(e){r.resolve(e.data)}).catch(function(e){r.reject(e)}),r.promise}function a(r){var n=t.defer();return e.get("api/article/publishedWithUser.php?uid="+r).then(function(e){n.resolve(e.data)}).catch(function(e){n.reject(e)}),n.promise}function c(t){return e.get("api/article/abandonedByUser.php?uid="+t)}function l(r){var n=t.defer();return e.get("api/user/author.php?uid="+r).then(function(e){n.resolve(e.data)}).catch(function(e){n.reject(e)}),n.promise}return{getAllBooksBy:r,getAllArticlesFrom:n,getPublishedArticle:o,getAllPublishedArticles:i,getArticlesPublishedWithAuthor:a,getArticlesAbandonedByUser:c,getAuthor:l}}function ShowInfoService(e,t){this.popup=function(r,n){e.submitInfo.info=r,e.submitInfo.theme=n||"default",t(function(){e.submitInfo.opacity="opacity-zero"},2e3),t(function(){e.submitInfo.opacity="opacity-one",e.submitInfo.info=""},3e3)}}angular.module("app",["ui.router","ngCookies","validation"]).run(RootCtrl),RootCtrl.$inject=["$rootScope","$state","ShowInfoService"],angular.module("app").config(Config),Config.$inject=["$stateProvider","$urlRouterProvider"],angular.module("app").controller("ArticleCtrl",ArticleCtrl),ArticleCtrl.resolve={_articleInfo:["$stateParams","_articlesInfo","$q",function(e,t,r){var n=e.aid,o=t.filter(function(e){return e.aid===n})[0];return void 0===o?r.reject({is404:!0}):r.when(o)}]},ArticleCtrl.$inject=["$scope","_articleInfo"],angular.module("app").controller("ArticlePageCtrl",ArticlePageCtrl),ArticlePageCtrl.resolve={_articlePageInfo:["$stateParams","FetchInfoService","$q",function(e,t,r){var n=e.aid;return t.getPublishedArticle(n).then(function(e){return e}).catch(function(e){if(404===e.status)return r.reject({is404:!0})})}],_authorInfo:["_articlePageInfo","FetchInfoService","$q",function(e,t,r){var n=e.author;return t.getAuthor(n).then(function(e){return e}).catch(function(e){if(404===e.status)return r.reject({is404:!0})})}]},ArticlePageCtrl.$inject=["$scope","_authorInfo","_articlePageInfo","AuthenticationService"],angular.module("app").controller("BookCtrl",BookCtrl),BookCtrl.resolve={_bookInfo:["$stateParams","_booksInfo",function(e,t){var r=e.bid;return t.filter(function(e){return e.bid===r})[0]}],_articlesInfo:["_bookInfo","FetchInfoService",function(e,t){return t.getAllArticlesFrom(e.bid).then(function(e){return e||[]})}]},BookCtrl.$inject=["$scope","_bookInfo","_articlesInfo"],angular.module("app").controller("DraftCtrl",DraftCtrl),DraftCtrl.resolve={_articlesInfo:["AuthenticationService","FetchInfoService",function(e,t){var r=e.getLoggedInCache().uid;return t.getArticlesAbandonedByUser(r).then(function(e){return e.data}).catch(function(e){})}]},DraftCtrl.$inject=["$scope","_articlesInfo"],angular.module("app").controller("HomeCtrl",HomeCtrl),HomeCtrl.resolve={_allArticles:["FetchInfoService","MarkdownRenderService",function(e,t){return e.getAllPublishedArticles().then(function(e){return(e||[]).map(function(e){return e.contentText=t.renderToText(e.content),e.cover=t.renderCover(e.content),e})}).catch(function(e){return e})}]},HomeCtrl.$inject=["$scope","_allArticles"],angular.module("app").controller("SignInCtrl",SignInCtrl),SignInCtrl.$inject=["$scope","AuthenticationService"],angular.module("app").controller("SignUpCtrl",SignUpCtrl),SignUpCtrl.$inject=["$scope","ShowInfoService","CheckInfoService","AuthenticationService"],angular.module("app").controller("UserCtrl",UserCtrl),UserCtrl.resolve={_allArticlesWithUser:["$stateParams","FetchInfoService","MarkdownRenderService","$q",function(e,t,r,n){var o=e.uid;return t.getArticlesPublishedWithAuthor(o).then(function(e){var t=e.articles.map(function(e){return e.contentText=r.renderToText(e.content),e.cover=r.renderCover(e.content),e});return{author:e.author,articles:t}}).catch(function(e){return 404===e.status?n.reject({is404:!0}):e})}]},UserCtrl.$inject=["$scope","_allArticlesWithUser"],angular.module("app").controller("VerifyCtrl",VerifyCtrl),VerifyCtrl.resolve={_verifyInfo:["$state","$stateParams","AuthenticationService","$q",function(e,t,r,n){var o=t.email,i=t.hash;return r.verify(o,i).then(function(e){if(200===e.status)return{msg:e.data,icon:"icon-ok-circle"}}).catch(function(e){return 404===e.status?n.reject({is404:!0}):400===e.status?{msg:e.data,icon:"icon-remove-circle"}:void 0})}]},VerifyCtrl.$inject=["$scope","_verifyInfo"],angular.module("app").controller("WriterCtrl",WriterCtrl),WriterCtrl.resolve={_loggedInMsg:["$q","AuthenticationService",function(e,t){var r=t.getLoggedInCache();return r?e.when(r):e.reject({authenticated:!1})}],_booksInfo:["_loggedInMsg","FetchInfoService",function(e,t){return t.getAllBooksBy(e.uid).then(function(e){return(e||[]).filter(function(e){return parseInt(e.state)<2})})}]},WriterCtrl.$inject=["$scope","_loggedInMsg","_booksInfo"],angular.module("app").directive("appArticleContentEditor",["ArticleManageService",function(e){return{restrict:"A",scope:{appNgModel:"=",onImgDrop:"&"},link:function(e,t){var r=t[0];r.addEventListener("dragover",function(e){e.preventDefault&&e.preventDefault()},!1),r.addEventListener("dragenter",function(e){e.preventDefault&&e.preventDefault()},!1),r.addEventListener("dragleave",function(e){e.preventDefault&&e.preventDefault()},!1),r.addEventListener("drop",function(t){return t.preventDefault(),e.$apply(function(){var r={files:t.dataTransfer.files};e.onImgDrop({params:r})}),!1},!1)}}}]),angular.module("app").directive("appArticleContentRender",["MarkdownRenderService",function(e){return{restrict:"A",scope:{appNgModel:"="},link:function(t,r){r.html(e.renderToHtml(t.appNgModel))}}}]),angular.module("app").directive("appArticlePanel",["$stateParams","ArticleManageService","$state",function(e,t,r){return{restrict:"A",templateUrl:"view/template/articlePanel.html",scope:{articles:"=",book:"=",user:"=",type:"="},link:function(n){n.curArticle=e.aid,n.showMenu=!1,n.active=function(e){n.curArticle!==e&&(n.showMenu=!1,n.curArticle=e)},n.toggleMenu=function(){n.showMenu?n.showMenu=!1:n.showMenu=!0},n.goToArticle=function(e){var t=n.type||"book";r.go("writer."+t+".article",{aid:e})},n.addNewArticle=function(){var e=n.user.uid,o=n.book.bid;t.addArticle(e,o).then(function(t){var i=t.data.newAid;n.active(i),n.articles.unshift({aid:i,uid:e,bid:o,title:"无标题文章",content:"",published:0}),r.go("writer.book.article",{aid:i})}).catch(function(e){})},n.abandonArticle=function(e){t.abandonArticle(e,1).then(function(t){var r=n.articles.filter(function(t){return parseInt(t.aid)===parseInt(e)})[0],o=n.articles.indexOf(r);n.articles.splice(o,1),n.toggleMenu()}).catch(function(e){})}}}}]),angular.module("app").directive("appDraftEditor",["ArticleManageService","ShowInfoService","$state",function(e,t,r){return{restrict:"A",templateUrl:"view/template/draftEditor.html",scope:{article:"=",articles:"=",recover:"&"},link:function(n,o){n.recover=function(){var o=n.article.aid;e.recoverArticle(o).then(function(e){var o=e.data.toString(),i=n.articles.map(function(e){return e.aid}),a=i.indexOf(o);n.articles.splice(a,1),t.popup("已恢复(,, ･∀･)ﾉ゛"),r.go("writer.draft")}).catch(function(e){t.popup("恢复失败 Orz。。\n错误码："+e.status,"warn")})},n.delete=function(){var o=n.article.aid;e.deleteArticle(o).then(function(e){var o=e.data.toString(),i=n.articles.map(function(e){return e.aid}),a=i.indexOf(o);n.articles.splice(a,1),t.popup("已删除=。="),r.go("writer.draft")}).catch(function(e){t.popup("删除失败 Orz。。\n错误码："+e.status,"warn")})}}}}]),angular.module("app").directive("appEditor",["AuthenticationService","ArticleManageService","$timeout",function(e,t,r){return{restrict:"A",templateUrl:"view/template/editor.html",scope:{article:"="},link:function(n,o){var i=o.find("input"),a=o.find("textarea"),c=[i,a],l=null;c.forEach(function(e){e.on("keydown",function(e){var t=e.keyCode;[16,17,18,20,91].indexOf(t)!==-1||(e.ctrlKey&&83===t||e.metaKey&&83===t?(e.preventDefault(),n.save()):(r.cancel(l),l=r(function(){n.autoSave()},1500)))})}),n.user=e.getLoggedInCache(),n.saveMsg="",n.clearSaveMsg=function(){r(function(){n.saveMsg=""},1e3)},n.save=function(e){n.saveMsg="正在保存..";var r=e?"自动":"",o=n.article.aid,i=n.article.title,a=n.article.content;t.updateArticle(o,i,a).then(function(e){n.saveMsg=r+e,n.clearSaveMsg()}).catch(function(e){n.saveMsg=r+e,n.clearSaveMsg()})},n.autoSave=function(){n.save(!0)},n.changePublish=function(){var e=n.article.aid,r="0"===n.article.published?"1":"0";t.publishArticle(e,r).then(function(e){n.article.published=r}).catch(function(e){})},n.uploadImgFile=function(e){var r=e.files,o=n.user.uid,i=n.article.aid,a=new FormData,c=n.article.content,l="",u="";if(!(r.length>0))return alert("files.length === 0 OAO.."),!1;for(var s=0;s<r.length;s++){if(r[s].type.indexOf("image")===-1)return alert("请上传图片，而不是其他文件！"),!1;a.append("file"+s,r[s]),l+="\n\n![图片 "+r[s].name+" 上传中..]"}a.append("uid",o),a.append("aid",i),n.article.content+=l,t.uploadImage(a).then(function(e){for(var t=0;t<r.length;t++){var o=e.data[t];u+="\n\n!["+o.name+"]("+o.url+")"}n.article.content=c+u,n.autoSave()}).catch(function(e){for(var t=0;t<r.length;t++){var o=e.data[t];u+="\n\n!["+o.name+"]("+o.url+")"}n.article.content=c+u,n.autoSave()})}}}}]),angular.module("app").directive("appFooter",[function(){return{restrict:"A",templateUrl:"view/template/footer.html",scope:{},link:function(e){}}}]),angular.module("app").directive("appHeader",["AuthenticationService","ShowInfoService","$state",function(e,t,r){return{restrict:"A",templateUrl:"view/template/header.html",scope:{},link:function(n){n.userInfo=e.getLoggedInCache(),n.logout=function(){e.signout(),n.userInfo=null,t.popup("已成功登出～")},n.goToWriter=function(){n.userInfo&&"1"===n.userInfo.active?r.go("writer"):n.userInfo&&"0"===n.userInfo.active?t.popup("请先查收邮件并激活账号！","warn"):(t.popup("请先登录或者注册！","warn"),r.go("signin"))}}}}]),angular.module("app").directive("appPanel",["$stateParams","BookManageService","$state",function(e,t,r){return{restrict:"A",templateUrl:"view/template/panel.html",scope:{books:"=",user:"="},link:function(n){n.curBook=e.bid,n.active=function(e){n.curBook=e},n.bookTitle="",n.showAddBookForm=!1,n.toggleAddBookForm=function(){n.showAddBookForm?n.showAddBookForm=!1:n.showAddBookForm=!0},n.cancelAddBookForm=function(){n.bookTitle="",n.toggleAddBookForm()},n.submitAddBookForm=function(){var e=n.user.uid,o=n.bookTitle;t.addBook(e,o).then(function(t){var i=t.newBid;n.books.unshift({bid:i,uid:e,title:o}),n.active(i),n.cancelAddBookForm(),r.go("writer.book",{bid:i})}).catch(function(e){})}}}}]),angular.module("app").directive("appWarningInfo",[function(){return{restrict:"A",templateUrl:"view/template/warningInfo.html",scope:{info:"="}}}]),angular.module("app").factory("ArticleManageService",ArticleManageService),ArticleManageService.$inject=["$http","$q"],angular.module("app").factory("AuthenticationService",AuthenticationService),AuthenticationService.$inject=["$http","$q","$state","cache","ShowInfoService"],angular.module("app").factory("BookManageService",BookManageService),BookManageService.$inject=["$http"],angular.module("app").service("CheckInfoService",CheckInfoService),CheckInfoService.$inject=["$http","$q"],angular.module("app").factory("FetchInfoService",FetchInfoService),FetchInfoService.$inject=["$http","$q"],angular.module("app").factory("MarkdownRenderService",[function(){function e(t){var r="",c=t.replace(/\n{2,}/,"\n\n").split("\n\n").map(function(e){return e.trim()});return c=c.map(function(e){for(;/[~]{2}.+[~]{2}/.test(e);)e=e.replace(/[~]{2}(.+?)[~]{2}/,"<del>$1</del>");for(;/[*]{2}.+[*]{2}/.test(e);)e=e.replace(/[*]{2}(.+?)[*]{2}/,"<strong>$1</strong>");for(;/[*]{1}.+[*]{1}/.test(e);)e=e.replace(/[*]{1}(.+?)[*]{1}/,"<em>$1</em>");for(;/`.+`/.test(e);)e=e.replace(/`(.+?)`/,"<code>$1</code>");return e}),c=c.map(function(t){if(/^> /.test(t)){var r=t.split(/(?:^> )|(?:\n> )/).slice(1);r=r.map(function(e){return 0===e.length?"\n":e});return"<blockquote>"+e(r.join("\n"))+"</blockquote>"}if(/^\!\[.*\]\(.+\)$/.test(t))t=o(t);else if(/^#/.test(t)){var c=t.match(/^#+/)[0].length;c=Math.min(c,6);var l=t.replace(/^#+\s*/,"");t=n.call(l,"h"+c)}else t=/(?:^[*] )|(?:^1\. )/.test(t)?a(t):n.call(t,"p");for(;/\[.+\]\(.+\)/.test(t);)t=i(t);return t}),r+=c.join("")}function t(t){var r=e(t),n=document.createElement("div");return n.innerHTML=r,n.innerText}function r(t){var r=e(t),n=document.createElement("div");n.innerHTML=r;var o=n.getElementsByTagName("img")[0];return o&&o.src||""}var n=function(e,t){return"<"+e+' class="'+(t||"")+'">'+this+"</"+e+">"},o=function(e){return e.replace(/^\!\[(.*)\]\((.+)\)$/,'<div class="image-wrapper"><img alt="$1" src="$2" /><div class="image-caption">$1</div></div>')},i=function(e){return e.replace(/\[(.+?)\]\((.+?)\)/,'<a href="$2">$1</a>')},a=function(e){function t(e,r){var n=4*r,o=new RegExp("(?:^[ ]{"+n+"}[*+-] )|(?:\\n[ ]{"+n+"}[*+-] )"),i=new RegExp("(?:^[ ]{"+n+"}[0-9]+[.] )|(?:\\n[ ]{"+n+"}[0-9]+[.] )"),a=null;return o.test(e)?(a=e.split(o).map(function(e,n){return 0===n?e:'<li class="hierarchy-'+r+'">'+t(e,r+1)+"</li>"}),a[0]+'<ul class="hierarchy-'+r+'">'+a.slice(1).join("")+"</ul>"):i.test(e)?(a=e.split(i).map(function(e,n){return 0===n?e:'<li class="hierarchy-'+r+'">'+t(e,r+1)+"</li>"}),a[0]+'<ol class="hierarchy-'+r+'">'+a.slice(1).join("")+"</ol>"):e}return t(e,0)};return{renderToHtml:e,renderToText:t,renderCover:r}}]),angular.module("app").service("ShowInfoService",ShowInfoService),ShowInfoService.$inject=["$rootScope","$timeout"],angular.module("app").service("cache",["$cookies",function(e){this.put=function(t,r){e.put(t,r)},this.get=function(t){return e.get(t)},this.remove=function(t){e.remove(t)}}]);
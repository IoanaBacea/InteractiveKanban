'use strict';

angular.module('myApp.archive', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/archive', {
    templateUrl: 'archive/archive.html',
    controller: 'ArchiveCtrl'
  });
}])

.controller('ArchiveCtrl', ['$scope','$firebaseArray', '$location','CommonProp',function($scope,$firebaseArray,$location,CommonProp) {
    
    /* user in cookies */
    var user;
    $.cookie("id", null);

    if($.cookie("user") === "null"){
        user = CommonProp.getUser();
        $.cookie("user", user);
    
    } else {
        user=$.cookie("user");
    }
    $scope.username = user;

    /*get tickets from data base and order them by date */
    var firebaseObj = new Firebase("https://licentawebapp.firebaseio.com/Articles/");

    var sync = $firebaseArray(firebaseObj.orderByChild("date"));

    $scope.articles = sync;
    console.log(sync);
    
    /* cookies for unique ticket id*/
    $scope.setId = function(id) {
         CommonProp.setId(id);
         $.cookie("id", id);
         console.log(id);
    }

}]);


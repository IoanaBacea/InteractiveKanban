'use strict';

angular.module('myApp.story', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/story', {
    templateUrl: 'story/story.html',
    controller: 'StoryCtrl'
  });
}])

.controller('StoryCtrl', ['$scope','$firebaseArray', '$location','CommonProp',function($scope,$firebaseArray,$location,CommonProp) {
    var user;
    $.cookie("id", null);

    if($.cookie("user") === "null"){
        user = CommonProp.getUser();
        $.cookie("user", user);
    
    } else {
        user=$.cookie("user");
    }

    $scope.username = user;
    var firebaseObj = new Firebase("https://licentawebapp.firebaseio.com/Articles/");

    var sync = $firebaseArray(firebaseObj.orderByChild("date"));

    sync.$loaded().then(function(data){
    var openTickets = [];

    data.forEach(function(result){

    if(result.story === "open"){
        openTickets.push(result);
    }
     });

     $scope.open = openTickets;
    });

    $scope.articles = sync;
	console.log(sync);
    
    $scope.setId = function(id) {
         CommonProp.setId(id);
         $.cookie("id", id);
         console.log(id);
    }

}]);


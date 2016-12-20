'use strict';

angular.module('myApp.ticketPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/ticketPage', {
		templateUrl: 'ticketPage/ticketPage.html',
		controller: 'ticketPageCtrl'
	});
}])

.controller('ticketPageCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$location', 'CommonProp', function($scope,$firebaseArray, $firebaseObject,$location,CommonProp){
	 var user;
	 var id;

    if($.cookie("user") === "null"){
        user = CommonProp.getUser();
        $.cookie("user", user);
    
    } else {
        user=$.cookie("user");
    }


    if($.cookie("id") === "null"){
        id = CommonProp.getId();
        $.cookie("id", id);
    } else {
        id=$.cookie("id");
    }

    var firebaseObj = new Firebase("https://licentawebapp.firebaseio.com/Users/");
    var users = $firebaseArray(firebaseObj);

    users.$loaded().then(function(data){
        $scope.Users = data;
    });

    $scope.username = user;
    var firebaseObj = new Firebase("https://licentawebapp.firebaseio.com/Articles/" + id);

    var sync = $firebaseObject(firebaseObj);
    $scope.article = sync;
    console.log(id);
	console.log(sync);

    $scope.editTicket = function(id) {
        console.log(id);
        var firebaseObj = new Firebase("https://licentawebapp.firebaseio.com/Articles/" + id);

        var syn = $firebaseObject(firebaseObj);
        $scope.postToUpdate = syn;

        $('#editModal').modal();
    }

    $scope.update = function() {
        console.log($scope.postToUpdate.$id);
        var article = new Firebase("https://licentawebapp.firebaseio.com/Articles/" + $scope.postToUpdate.$id);
        var onComplete = function(error){
            if(error){
                console.log("Error:", error);
            } else{
                console.log(article.key()); // bar
                $('#editModal').modal('hide');
            }
        }
        article.update({
            title: $scope.postToUpdate.title,
            type: $scope.postToUpdate.type,
            priority: $scope.postToUpdate.priority,
            dificulty: $scope.postToUpdate.dificulty,
            due: $scope.postToUpdate.due,
            post: $scope.postToUpdate.post,
            assign: $scope.postToUpdate.assign,
            emailId: $scope.postToUpdate.emailId
        }, onComplete);
    }

    $scope.confirmDelete = function(id) {
        var fb = new Firebase("https://licentawebapp.firebaseio.com/Articles/" + id);
        var article = $firebaseObject(fb);
        $scope.postToDelete = article;
        $('#deleteModal').modal();
    }

    $scope.deleteTicket = function() {
        var article = new Firebase("https://licentawebapp.firebaseio.com/Articles/" + $scope.postToDelete.$id);
        var onComplete = function(error){
            if(error) {
                console.log(error);
            } else {
                $('#deleteModal').modal('hide');
            }
        }
        article.remove(onComplete);

        $location.path('/welcome');
        $scope.$apply();          
    }
    
    $scope.setId = function(id) {
         CommonProp.setId(id);
         console.log(id);
    }

    function print() {
    window.print();
}
}]);


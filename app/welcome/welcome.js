'use strict';

angular.module('myApp.welcome', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/welcome', {
        templateUrl: 'welcome/welcome.html',
        controller: 'WelcomeCtrl'
    });
}])


.controller('WelcomeCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$location', 'CommonProp', function($scope, $firebaseArray, $firebaseObject, $location, CommonProp) {
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
    var inProgressTickets = [];
    var codeReviewTickets = [];
    var doneTickets = [];

    data.forEach(function(result){

    if(result.story === "open"){
        openTickets.push(result);
    } else if (result.story === "in_progress"){
        inProgressTickets.push(result);
    } else if(result.story === "code_review"){
        codeReviewTickets.push(result);
    } else {
        doneTickets.push(result);
    }
     });

     $scope.inProgress = inProgressTickets;
     $scope.codeReview = codeReviewTickets;
     $scope.done = doneTickets;
    });
    //==========================================================
    //          Reload Page if data changed
    //==========================================================
    sync.$watch(function(data){
        if(data.event === "child_changed"){
            location.reload();
        }
    })

	console.log(sync);

    $scope.editPost = function(id) {
        console.log(id);
        var firebaseObj = new Firebase("https://licentawebapp.firebaseio.com/Articles/" + id);


        var syn = $firebaseObject(firebaseObj);
        $scope.postToUpdate = syn;

        $('#editModal').modal();
    }

    $scope.update = function() {
        console.log($scope.postToUpdate.$id);
        var article = new Firebase("https://licentawebapp.firebaseio.com/Articles/" + $scope.postToUpdate.$id);
        article.$update({
            title: $scope.postToUpdate.title,
            type: $scope.postToUpdate.type,
            priority: $scope.postToUpdate.priority,
            dificulty: $scope.postToUpdate.dificulty,
            due: $scope.postToUpdate.due,
            post: $scope.postToUpdate.post,
            qr: $scope.postToUpdate.qr,
            emailId: $scope.postToUpdate.emailId
        }).then(function(ref) {
            console.log(ref.key()); // bar
            $('#editModal').modal('hide')
        }, function(error) {
            console.log("Error:", error);
        });
    }

    $scope.confirmDelete = function(id) {
        var fb = new Firebase("https://licentawebapp.firebaseio.com/Articles/" + id);
        var article = $firebaseObject(fb);
        $scope.postToDelete = article;
        $('#deleteModal').modal();
    }

    $scope.deletePost = function() {
        var article = new Firebase("https://licentawebapp.firebaseio.com/Articles/" + $scope.postToDelete.$id);
        article.$remove().then(function(ref) {
            $('#deleteModal').modal('hide');
        }, function(error) {
            console.log("Error:", error);
        });
    }

    $scope.setId = function(id) {
         CommonProp.setId(id);
         $.cookie("id", id);
         console.log(id);
    }
}]);

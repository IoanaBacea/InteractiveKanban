'use strict';

angular.module('myApp.addTicket', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/addTicket', {
    templateUrl: 'addTicket/addTicket.html',
    controller: 'addTicketCtrl'
  });
}])

.controller('addTicketCtrl', ['$scope','$firebaseObject', '$firebaseArray', '$location','CommonProp',function($scope,$firebaseObject,$firebaseArray,$location,CommonProp) {

	/* Adding cookies */
	var user;
	$.cookie("id", null);

	if($.cookie("user") === "null"){
		user = CommonProp.getUser();
        $.cookie("user", user);
    } else {
        user=$.cookie("user");
    }

    /**verify user**/
    var login={};
	$scope.login=login;
    $scope.username = user;

    var firebaseObj = new Firebase("https://licentawebapp.firebaseio.com/Users/");
    var users = $firebaseArray(firebaseObj);

    users.$loaded().then(function(data){
    	$scope.Users = data;
    });

    $scope.addTicket = function(e){
    	login.loading = true; //load animation
		var title = $scope.article.title; //asociating form items into firebase
		var type = $scope.article.type;
		var priority = $scope.article.priority;
		var dificulty = $scope.article.dificulty;
		var due = $scope.article.due;
        var post = $scope.article.post;
        var assign = $scope.article.assign;
        var story = "open";

        /* saving current date into a string in firebase*/
        var today = new Date();
	 	var dd = today.getDate();
	 	var mm = today.getMonth()+1; //January is 0!
	 	var yyyy = today.getFullYear();

	 	if(dd<10) {
	 		dd='0'+dd
	 	}

	 	if(mm<10) {
	 		mm='0'+mm
	 	} 
	 	today = yyyy+'-'+mm+'-'+dd;

	 	var fb = new Firebase("https://licentawebapp.firebaseio.com/Articles");
	 	var user = CommonProp.getUser();

	 	/* Getting the ticked unique id and redirect user to /welcome */
	 	var onComplete = function(error){

	 		if(error){
	 			console.log(error);
	 		} else {
	 			login.loading = false;

	 			var QRkey = fb.key();
	 			console.log("Key is", QRkey);

	 			$location.path('/welcome');
	 			$scope.$apply();
	 		}
	 	}

	 	/* pushing data into database*/
	 	fb.push({
	 		title: title,
	 		type: type,
	 		priority: priority,
	 		dificulty: dificulty,
	 		story : story,
	 		due: due,
	 		post: post,
	 		date: today,
	 		assign : assign,
	 		emailId: user,'.priority': user
	 	}, onComplete);
	 }

	 $("enter").keyup(function(event){
	 	if(event.keyCode == 13){
	 		$("#id_of_button").click();
	 	}
});

}]);


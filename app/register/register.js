'use strict';

angular.module('myApp.register', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'RegisterCtrl'
  });
}])

.controller('RegisterCtrl', ['$scope','$location','$firebaseAuth', function($scope,$location,$firebaseAuth) {

 	var firebaseObj = new Firebase("https://licentawebapp.firebaseio.com");
    var auth = $firebaseAuth(firebaseObj);

    $scope.signUp = function() {
        if (!$scope.regForm.$invalid) {
            var email = $scope.user.email;
            var password = $scope.user.password;

            if (email && password) {
                auth.$createUser({
                    email: email,
                    password: password
                })

                .then(function() {
                    console.log('User creation success');
                    addUserToList(email);
                    $location.path('/home');
                }, function(error) {
                    $scope.regError = true;
                    $scope.regErrorMessage = error.message;
                    console.log(error);
                });
        }
    }

};
}]);
 /** push user for assign**/
function addUserToList(email){
    var add = new Firebase("https://licentawebapp.firebaseio.com/Users");

    add.push({
        email : email,
    });
};

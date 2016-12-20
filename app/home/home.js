'use strict';

angular.module('myApp.home', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','$location','CommonProp','$firebaseAuth',function($scope,$location,CommonProp,$firebaseAuth) {

    var firebaseObj = new Firebase("https://licentawebapp.firebaseio.com");
    var loginObj = $firebaseAuth(firebaseObj);

    $scope.user = {};
    var login={};

    $scope.test = function(){
        login.loading = true;
    }

    $scope.login=login;
    $scope.SignIn = function(e) {
        login.loading = true;
        e.preventDefault();

        var username = $scope.user.email;
        var password = $scope.user.password;

        loginObj.$authWithPassword({
            email: username,
            password: password
        })
        .then(function(user) {
            //Success callback
		login.loading = false;
            console.log('Authentication successful');
            $.cookie("user", null);
	CommonProp.setUser(user.password.email);
		$location.path('/welcome');
        }, function(error) {
            //Failure callback
		login.loading = false;
            console.log('Authentication failure');
        });
}
}])

.service('CommonProp', function() {
    var user = '';
    var id = '';
 
    return {
        getUser: function() {
            return user;
        },
        setUser: function(value) {
            user = value;
        },
        getId: function() {
            console.log("Returning id: " + id);
            return id;
        },
        setId: function(value){
            id = value;
            console.log("id set to " + id);
        }
    };
})

/**button animation theme**/
.directive('laddaLoading', [
    function() {
        return {
            link: function(scope, element, attrs) {
                var Ladda = window.Ladda;
                var ladda = Ladda.create(element[0]);
                // Watching login.loading for change
                scope.$watch(attrs.laddaLoading, function(newVal, oldVal) {
                    // if true show loading indicator
                    if (newVal) {
                        ladda.start();
                    } else {
                        ladda.stop();
                    }
                });
            }
        };
    }
]);


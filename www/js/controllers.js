angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})


.controller('loginCtrl', function ($scope, $rootScope, $ionicHistory, sharedUtils, $state, $ionicSideMenuDelegate, auth, restApi) {
    $rootScope.extras = false;
    // For hiding the side bar and nav ico
    // When the user logs out and reaches login page,
    // we clear all the history and cache to prevent back link
    $scope.$on('$ionicView.enter', function (ev) {
        if (ev.targetScope !== $scope) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        }
    });

    if (auth.hasToken()) {
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
        $rootScope.extras = true;
        sharedUtils.hideLoading();
        $state.go('app', {}, {location: "replace"});

    }



    //chekear si ya esta logeado

    $scope.login = function (formName, cred) {

        auth.getToken();

        if (formName.$valid)
        
        {  // Check if the form data is valid or not

            sharedUtils.showLoading();

            restApi.call(
                    {
                method: 'post',
                url: 'auth/autenticar',
                data: {
                    Correo: cred.email,
                    Password: cred.password
                },
                response: function (r) 
                {

                    if (r.response) 
                    {

                        auth.setToken(r.result);
                        $ionicHistory.nextViewOptions({
                            historyRoot: true
                        });
                        $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
                        $rootScope.extras = true;
                        sharedUtils.hideLoading();
                        $state.go('app', {}, {location: "replace"});
                    } else 
                    
                    {
                        sharedUtils.hideLoading();
                        sharedUtils.showAlert("Please note", "Authentication Error");
                        alert(r.message);

                    }
                },
                error: function (r) {

                },
                validationError: function (r) {

                }
            });



        } else {
            sharedUtils.showAlert("Please note", "Entered data is not valid");
        }



    }




    $scope.loginFb = function () {
        //Facebook Login
    };

    $scope.loginGmail = function () {
        //Gmail Login
    };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

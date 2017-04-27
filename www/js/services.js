angular.module('app.services', [])
    .factory('sharedUtils', ['$ionicLoading', '$ionicPopup', function ($ionicLoading, $ionicPopup) {
        var functionObj = {};
        functionObj.showLoading = function () {
            $ionicLoading.show({
                content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
                animation: 'fade-in', // The animation to use
                showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
                maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
                showDelay: 0 // The delay in showing the indicator
            });
        };
        functionObj.hideLoading = function () {
            $ionicLoading.hide();
        };
        functionObj.showAlert = function (title, message) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: message
            });
        };
        return functionObj;
    }])

    .factory('auth', ['$location', '$state', function ($location, $state) {
            var auth = {
                setToken: function (token) {
                    localStorage[API.token_name] = token;
                },
                getToken: function () {
                    return localStorage[API.token_name];
                },
                getUserData: function () {
                    try
                    {
                        var token = localStorage[API.token_name];
                        if (token === '')
                            return;
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-', '+').replace('_', '/');
                        return JSON.parse(window.atob(base64)).data;
                    } catch (err) {
                        $location.path('/');
                    }
                },
                logout: function () {
                    localStorage[API.token_name] = '';
                    //                                                                        $state.go('login');
                },
                hasToken: function () {
                    return (localStorage[API.token_name] !== '');
                },
                redirectIfNotExists: function () {
                    if (!auth.hasToken()) {
                        $state.go('login');
                    }
                }
            };
            return auth;
        }])

    .service('restApi', ['$http', 'auth', function ($http, auth) {
            this.call = function (config) {
            var headers = {};
            headers[API.token_name] = auth.getToken();
            var http_config = {
                method: config.method,
                url: API.base_url + config.url,
                data: typeof (config.data) === 'undefined' ? null : config.data,
                headers: headers
            };
            $http(http_config).then(function successCallback(response) {

                config.response(response.data);
            }, function errorCallback(response) {
                switch (response.status) {
                    case 401: // No autorizado
                        auth.logout();
                        break;
                    case 422: // Validación
                        config.validationError(response.data);
                        break;
                    default:
                        config.error(response);
                        console.log(response.statusText);
                        break;
                }
            });
        };
    }]);






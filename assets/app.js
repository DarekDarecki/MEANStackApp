var app = angular.module('app', ['ngRoute', 'ngAnimate'])
    //angular.module('app', ['ngRoute'])

app.service('PostsSvc', function($http) {
    this.fetch = function() {
        return $http.get('/api/posts')
    }
    this.create = function(post) {
        return $http.post('/api/posts', post)
    }
})

app.service('AuthSvc', function($q, $location) {
    var t = this;
    t.responseError = function(response) {
        if (response.status == 401) {

        }
        return $q.reject(response);
    };
})

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthSvc');
}])

app.service('UserSvc', function($http) {
    var t = this
    t.getUser = function() {
        return $http.get('/api/users')
    }
    t.register = function(username, password) {
        return $http.post('/api/users', {
                username: username,
                password: password
            })
            .then(function() {
                //return t.login(username, password)
            })
    }
    t.login = function(username, password) {
        return $http.post('/api/sessions', {
                username: username,
                password: password
            })
            .then(function(val, response) {
                t.token = val.data
                $http.defaults.headers.common['X-Auth'] = val.data
                return t.getUser()
            })
    }
    t.logout = function() {
        delete $http.defaults.headers.common['X-Auth']
        Materialize.toast('Pomyślnie wylogowano!', 3000)
    }
})

app.controller('ApplicationCtrl', function($scope, UserSvc, AuthSvc) {
    $scope.$on('login', function(_, user) {
        $scope.currentUser = user
    })
    $scope.logout = function() {
        $scope.currentUser = undefined;
        UserSvc.logout();
    }
})

app.controller('PostsCtrl', function($scope, PostsSvc) {
    var t = this
    $scope.addPost = function() {
        if ($scope.postBody) {
            PostsSvc.create({
                body: $scope.postBody,
                dateparsed: $scope.dateParse()
            }).success(function(post) {
                $scope.posts.unshift(post)
                $scope.postBody = null
                Materialize.toast('Dodano post!', 3000)
            })
        }
    }
    $scope.dateParse = function() {
        var date = new Date()
        var dd = date.getDate()
        var mm = date.getMonth()
        var yyyy = date.getFullYear()
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        return date = mm + '.' + dd + '.' + yyyy + ',  ' + date.toString().split(' ')[4];
    }
    PostsSvc.fetch().success(function(posts) {
        $scope.posts = posts
    })
})

app.controller('LoginCtrl', function($scope, UserSvc, $location) {
    var t = this
    $scope.login = function(username, password) {
        UserSvc.login(username, password)
            .then(function(response) {
                $scope.$emit('login', response.data)
                $location.path('/posts')
                setTimeout(function () { Materialize.toast('Pomyślnie zalogowano!', 4000)}, 50)
            })
            .catch(function() {
                return t.error()
            })
    }
    t.error = function() {
        $scope.class = "invalid"
        $scope.error = "Nieprawidłowy login lub hasło"
        $scope.username = ""
        $scope.password = ""
    }
})

app.controller('RegisterCtrl', function($scope, UserSvc, $location, $timeout) {
    var t = this
    $scope.register = function(username, password) {
        UserSvc.register(username, password)
            .then(function(user) {
                //$scope.$emit('login', user)
                setTimeout(function () { Materialize.toast('Pomyślnie utworzono nowe konto!', 2000)}, 50)
                $timeout(function () { $location.path('/login'); Materialize.toast('Teraz możesz się zalogować.', 3000)}, 800)

            })
            .catch(function(response) {
                return t.error(response)
            })
    }
    t.error = function($scope) {
        $scope.class = "invalid"
        $scope.error = "Podana nazwa użytkownika już istnieje"

    }

    t.scorePassword = function(password) {
        var score = 0;
        if (!password)
            return score;

        // award every unique letter until 5 repetitions
        var letters = new Object();
        for (var i = 0; i < password.length; i++) {
            letters[password[i]] = (letters[password[i]] || 0) + 1;
            score += 5.0 / letters[password[i]];
        }

        // bonus points for mixing it up
        var variations = {
            digits: /\d/.test(password),
            lower: /[a-z]/.test(password),
            upper: /[A-Z]/.test(password),
            nonWords: /\W/.test(password),
        }

        variationCount = 0;
        for (var check in variations) {
            variationCount += (variations[check] == true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;

        return parseInt(score);
    }
    $scope.checkPassStrength = function(password) {
        var score = t.scorePassword(password);
        console.log(score);

        if (score > 90) {
            $scope.xd = "nie do złamania!"
            $scope.background = "rgba(3, 169, 244, 0.8)";
            $scope.width = "100%"
            return
        }
        if (score > 80) {
            $scope.xd = "bardzo dobre"
            $scope.background = "rgba(76, 175, 80, 0.8)";
            $scope.width = "81%"
            return
        }
        if (score > 60) {
            $scope.xd = "dobre"
            $scope.background = "rgba(118, 255, 3, 0.8)";
            $scope.width = "65%"
            return
        }
        if (score > 40) {
            $scope.xd = "ok"
            $scope.background = "rgba(255, 202, 40, 0.8)";
            $scope.width = "50%"
            return
        }
        if (score > 30) {
            $scope.xd = "słabe"
            $scope.background = "rgba(255, 111, 0, 0.8)";
            $scope.width = "33%"
            return
        }
        if (score > 0) {
            $scope.xd = "bardzo słabe"
            $scope.background = "rgba(244, 67, 54, 0.8)";
            $scope.width = "16%"
            return
        }
    }
})

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/posts', {
            controller: 'PostsCtrl',
            templateUrl: 'posts.html'
        })
        .when('/register', {
            controller: 'RegisterCtrl',
            templateUrl: 'register.html'
        })
        .when('/login', {
            controller: 'LoginCtrl',
            templateUrl: 'login.html'
        })
})

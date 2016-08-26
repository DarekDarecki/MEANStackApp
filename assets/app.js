var app = angular.module('app', ['ngRoute'])
    //angular.module('app', ['ngRoute'])

app.service('PostsSvc', function($http) {
    this.fetch = function() {
        return $http.get('/api/posts')
    }
    this.create = function(post) {
        return $http.post('/api/posts', post)
    }
})

app.service('UserSvc', function($http) {
    var t = this
    t.getUser = function() {
        return $http.get('/api/users')
    }
    t.createUser = function() {

    }
    t.register = function(username, password) {
        return $http.post('/api/users', {
            username: username,
            password: password
        }).then(function() {
            return t.login(username, password)
        })
    }
    t.login = function(username, password) {
        return $http.post('/api/sessions', {
                username: username,
                password: password
            })
            .then(function(val) {
                t.token = val.data
                $http.defaults.headers.common['X-Auth'] = val.data
                return t.getUser()
            })
    }
})

app.controller('ApplicationCtrl', function($scope) {
    $scope.$on('login', function(_, user) {
        $scope.currentUser = user
    })
})

app.controller('PostsCtrl', function($scope, PostsSvc) {
    $scope.addPost = function() {
        if ($scope.postBody) {
            PostsSvc.create({
                username: "Darcio",
                body: $scope.postBody
            }).success(function(post) {
                $scope.posts.unshift(post)
                $scope.postBody = null
            })
        }
    }
    PostsSvc.fetch().success(function(posts) {
        $scope.posts = posts
    })
})

app.controller('LoginCtrl', function($scope, UserSvc) {
    $scope.login = function(username, password) {
        UserSvc.login(username, password)
            .then(function(response) {
                $scope.$emit('login', response.data)
            })
    }
})

app.controller('RegisterCtrl', function($scope, UserSvc) {
    $scope.register = function(username, password) {
        UserSvc.register(username, password)
            .then(function(user) {
                $scope.$emit('login', user)
            })
    }
})

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/', {
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

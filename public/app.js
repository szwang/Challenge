angular.module('challengeApp', [
  'challengeApp.challenge',
  'challengeApp.createChallenge',
  'challengeApp.userChallenge',
  'challengeApp.services',
  'challengeApp.dashboard',
  'challengeApp.auth',
  'ui.router'
])

.config(function($stateProvider, $urlRouterProvider) {
  // TODO: reroute to login/landing page
  $urlRouterProvider.otherwise('/auth');
  $stateProvider
    // .state('signout', {
    //   url: '/signout',
    //   controller: function($scope, $state) {
    //     $scope.logout();
    //     $state.go('signin');
    //   }
    // })
    .state('auth', {
      url: '/auth',
      templateUrl: 'html/auth.html',
      controller: 'AuthController'
    })
    .state('challenge_create', {
      url: '/challenge/create',
      templateUrl: './html/create.html',
      controller: 'CreateChallengeController'
    })
    .state('challenge_view', {
      url: '/challenge/:id',
      templateUrl: './html/challenge.html',
      controller: 'ChallengeController',
      resolve: {
        authorize: isLoggedIn
      }
    })
    .state('dashboard.detail', {
      url: '/challenge/:itemId',
      templateUrl: './html/detail.html',
      controller: 'DetailController',
      resolve: {
        authorize: isLoggedIn
      }
    })
    .state('dashboard.ranking', {
      url: '/ranking',
      templateUrl: './html/ranking.html',
      controller: 'RankingController',
      resolve: {
        authorize: isLoggedIn
      }
    })
    .state('dashboard.allChallenges', {
      url: '/allChallenges',
      templateUrl: './html/allChallenges.html',
      controller: 'AllChallengesController',
      resolve: {
        authorize: isLoggedIn
      }
    })
    .state('dashboard.create', {
      url: '/create',
      templateUrl: './html/create.html',
      controller: 'CreateChallengeController',
      resolve: {
        authorize: isLoggedIn
      }
    })
    .state('dashboard.list', {
      url: '/dashboard/list',
      templateUrl: './html/allchallenges.html',
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: './html/dashboard.html',
      controller: 'dashboardController'
    })
    .state('user', {
      url: '/user',
      templateUrl: './html/user.html',
      controller: 'UserChallengesController'
    });

}).controller('ChallengeAppController', function($scope, $state, Auth) {
  $scope.user = {};

  $scope.signIn = function(username, pw) {
    $scope.user.username = username;
    $scope.user.password = pw;
    Auth.getUserInfo(username, pw);
  }

  // $scope.setCurrentUser = function() {
  //   Auth.getUserInfo().then(function(user) {
  //     $scope.user = user;
  //   }, function() {
  //     $state.go('signin');
  //   });
  // };

  // $scope.logout = function() {
  //   Auth.logout().then(function() {
  //     $scope.user = null;
  //   });
  // };

  // $scope.setCurrentUser();
}).filter('challengeFilter', function() {
  return function(input, accepted, started, complete, user) {
    user = (user !== undefined) ? parseInt(user) : undefined;
    accepted = (accepted !== undefined && user !== undefined) ? !!parseInt(accepted) : null;
    started = (started !== undefined) ? !!parseInt(started) : null;
    complete = (complete !== undefined) ? !!parseInt(complete) : null;

    return input.filter(function(challenge) {
      var has_accepted = true;

      if (accepted !== null) {
        has_accepted = challenge.participants.some(function(participant) {
          return (participant.accepted === accepted && participant.id === user);
        });
      }

      return (
        ((challenge.started === started) || started === null) && ((challenge.complete === complete) || complete === null) && has_accepted
      );
    });
  };
}).directive('challengeTable', function() {
  return {
    'scope': {
      'challenges': '=',
      'user': '@',
      'accepted': '@',
      'started': '@',
      'complete': '@',
      'caption': '@'
    },
    'restrict': 'E',
    'templateUrl': './html/challengeTable.html'
  };
});

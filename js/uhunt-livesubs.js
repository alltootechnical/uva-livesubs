'use strict';

angular.module('uHunt.livesubs', ['uHunt.base'])

.factory('livesubs_db', function (create_uhunt_db) {
  return create_uhunt_db('livesubs', {
    'show': 'bool',
    'limit': 'int',
  });
})

.directive('uhuntLivesubs', function (livesubs_db, uhunt_poll, uhunt) {
  return {
    replace: false,
    templateUrl: 'partials/livesubs.html',
    link: function (scope, element, attrs) {
      scope.Math = window.Math;
      scope.limit = livesubs_db.get('limit') || 15;
      scope.show = livesubs_db.exists('show') ? livesubs_db.get('show') : true;
      livesubs_db.scope_setter(scope, ['limit', 'show']);
      scope.live_submissions = uhunt_poll.live_submissions;
      scope.livesub_url = uhunt.livesub_url;
      scope.pending_runs = function () {
          var count = 0;
          for (var i = 0; i < scope.limit; i++) {
              try {
                  if (scope.live_submissions[i].ver == 0) count++;
              } catch(ex) {}
          }
          return count;
      };
    }
  }
})

function TimeCtrl($scope, $timeout) {
    $scope.clock = Date.now();
    $scope.tickInterval = 1000 //ms

    var tick = function() {
        $scope.clock = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    // Start the timer
    $timeout(tick, $scope.tickInterval);
}

;

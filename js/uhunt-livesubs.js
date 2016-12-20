'use strict';
var livesubs = {};
var inqueue = {};
var ver_map = {
       0: "- In queue -",
      10: "Submission error",
      15: "Can't be judged",
      20: "- In queue -",
      30: "Compile error",
      35: "Restricted function",
      40: "Runtime error",
      45: "Output limit exceeded",
      50: "Time limit exceeded",
      60: "Memory limit exceeded",
      70: "Wrong answer",
      80: "Presentation error",
      90: "Accepted",
    };
var icon_map = {
       0: "",
      10: "",
      15: "",
      20: "",
      30: "exclamation-circle",
      35: "ban",
      40: "exclamation-triangle",
      45: "",
      50: "clock-o",
      60: "microchip",
      70: "times",
      80: "pencil-square-o",
      90: "check",
    };
var language_map = {
      1: 'ANSI C',
      2: 'Java',  
      3: 'C++',   
      4: 'Pascal',
      5: 'C++11', 
      6: 'Python'
    };

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
      scope.Notification = window.Notification;
      scope.limit = livesubs_db.get('limit') || 15;
      scope.show = livesubs_db.exists('show') ? livesubs_db.get('show') : true;
      livesubs_db.scope_setter(scope, ['limit', 'show']);
      scope.live_submissions = uhunt_poll.live_submissions;
      livesubs = scope.live_submissions;
      scope.livesub_url = uhunt.livesub_url;
      scope.icons = icon_map;
      scope.pending_runs = function () {
          var count = 0;
          for (var i = 0; i < scope.limit; i++) {
              try {
                  if (scope.live_submissions[i].ver == 0) {
                      count++;
                      inqueue.push(i);
                  }
                  if(inqueue.length > 0) console.log(inqueue);
              } catch(ex) {}
          }
          //flip();
          return count;
      };
      //flip();
    }
  }
})

function TimeCtrl($scope, $timeout) {
    $scope.clock = Date.now();
    $scope.tickInterval = 10;
    var tick = function() {
        $scope.clock = Date.now()
        $timeout(tick, $scope.tickInterval);
        //flip();
    }

    $timeout(tick, $scope.tickInterval);
}

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

var notifications = new Array();

function notifyNew(lst) {
  if (!Notification) {
    console.err('Desktop notifications not available in your browser'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('New run', {
      icon: 'https://cdn2.iconfinder.com/data/icons/office-icon-set-3/512/hours.png',
      body: lst.name + " (" + lst.uname + ")\n" + lst.p.num + ": " + lst.p.tit
    });
    notifications.push(notification);
    notification.onclick = function () {
      //window.open("http://stackoverflow.com/a/13328397/1269037");      
    };
    
  }

}

function notifyMe(lst) {
  if (!Notification) {
    console.err('Desktop notifications not available in your browser'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification(ver_map[lst.ver], {
      icon: 'imgs/vr_'+ lst.ver + ".png",
      body: lst.name + " (" + lst.uname + ")\n" + lst.p.num + ": " + lst.p.tit + "\nRun in " + (lst.run/1000).toFixed(3) + "s using " + language_map[lst.lan],
    });
    //notifications.push(notification);
    setTimeout(function() { notification.close() }, 5000);
    notification.onclick = function () {
      notification.close();
      //window.open("http://stackoverflow.com/a/13328397/1269037");      
    };
    
  }

}

function notifyWarning(str) {
  if (!Notification) {
    console.err('Desktop notifications not available in your browser'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification("WARNING", {
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Feedbin-Icon-error.svg/2000px-Feedbin-Icon-error.svg.png',
      body: str,
    });
    notification.onclick = function () {
      //window.open("http://stackoverflow.com/a/13328397/1269037");      
    };
    
  }

}

function closeAll(){
  for (var i = 0; i < notifications.length; i++) {
    notifications[i].close();
  }
}

function close(){
  if (notifications.length > 0) {
    notifications[0].close();
    notifications.pop();
  }
}

function flip(k) {
  $(".rot").eq(k).textrotator({
        animation: "flipUp",
        separator: "\\",
    speed: 2000
    });
}

;

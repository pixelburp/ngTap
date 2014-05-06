(function(window, angular, undefined) {

  'use strict';

  var ngTap = angular.module('ngTap', []);

  ngTap.directive('ngTap', [ '$location', '$parse', '$window', 'touchData',
    function($location, $parse, $window, touchData) {
    console.log('blah');
      var isTouchDevice,
          clsActive = 'ng-tap-active',
          setAction;

      isTouchDevice = !!('ontouchend' in $window);

      setAction = function(scope, attributes, evt) {
        var ngTap = attributes.ngTap,
            isPath = /^#*\//.test(ngTap),
            isUrl = /^(http|https):\/\//.test(ngTap),
            fn;

        if(isUrl) {
          return $window.open(ngTap, '_blank');
        }

        // let's assume URLs will start with '/' or '#/'
        if(isPath) {
          scope.$apply($location.url(ngTap));
        } else {
          fn = $parse(ngTap);
          scope.$apply(function() {
            fn(scope, { $event: evt });
          });
        }
      };


      return function(scope, element, attrs) {
        if (isTouchDevice) {
          var touch = touchData.init();

          element.on('touchstart', function(e) {
            element.addClass(clsActive);
            touch.start(e);
          });

          element.on('touchmove', function(e) {
            touch.isTouchMove(e);
          });

          element.on('touchend', function(e) {
            element.removeClass(clsActive);
            if(touch.isSingleTap) {
              setAction(scope, attrs, e);
            }
            touch.end();
          });
        } else {
          element.on('mousedown', function() {
            element.addClass(clsActive);
          });
          element.on('mouseup', function(e) {
            element.removeClass(clsActive);
            setAction(scope, attrs, e);
          });
        }
      };

    }
  ]);

})(window, window.angular);

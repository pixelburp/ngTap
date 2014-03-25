(function(window, angular, undefined) {

  'use strict';

  var ngTap = angular.module('ngTap', []);

  ngTap.directive('ngTap', [ '$location', '$parse', '$window',
    function($location, $parse, $window) {
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
          var tapping = false;
          element.on('touchstart', function() {
            element.addClass(clsActive);
            tapping = true;
          });
          element.on('touchmove', function() { tapping = false; });
          element.on('touchend', function(e) {
            e.preventDefault();
            element.removeClass(clsActive);
            tapping && setAction(scope, attrs, e);
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

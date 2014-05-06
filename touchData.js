'use strict';

angular.module('testApp')
  .service('touchData', function() {
    var TouchData = function() {
      return {
        pointX: 0,
        pointY: 0,

        distanceX: 0,
        distanceY: 0,

        isSingleTap: false,

        start: function(e) {
          if(!e.touches && !e.originalEvent.touches) {
            return this.isSingleTap = true;
          }
          var point = e.touches || e.originalEvent.touches[0];

          this.pointX = point.pageX || 0;
          this.pointY = point.pageY || 0;
          this.distanceX = 0;
          this.distanceY = 0;

          return this.isSingleTap = true;
        },

        isTouchMove: function(e) {
          if(!e.touches && !e.originalEvent.touches) {
            return this.isSingleTap = false;
          }

          var point = e.touches || e.originalEvent.touches[0],
              deltaX = point.pageX - this.pointX,
              deltaY = point.pageY - this.pointY,
              absDistX,
              absDistY;

          this.pointX = point.pageX;
          this.pointY = point.pageY;

          this.distanceX += deltaX;
          this.distanceY += deltaY;

          absDistX = Math.abs(this.distanceX);
          absDistY = Math.abs(this.distanceY);

          // arbitrary 'distance' for touchmove to travel to constitute a drag
          return this.isSingleTap = absDistX < 10 && absDistY < 10;
        },

        end: function() {
          return this.isSingleTap = false;
        }

      };
    };

    return {
      init: function() {
        return new TouchData();
      }
    };

  });

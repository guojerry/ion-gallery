(function(){
  'use strict';

  angular
    .module('ion-gallery')
    .directive('spinnerWhenLoad', spinnerWhenLoad);
    
    spinnerWhenLoad.$inject = [];

    function spinnerWhenLoad() {
        return {
            restrict: 'A',
            require: '^ionImgLoader',
            link: function(scope, element, attr, imgLoaderController) {
                element.on('load', function() {
                    imgLoaderController.hideSpinner();
                });
            }
        };
    }
    
})();
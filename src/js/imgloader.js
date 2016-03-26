
(function(){
  'use strict';

  angular
    .module('ion-gallery')
    .directive('ionImgLoader',ionImgLoader);

  ionImgLoader.$inject = [];

  function ionImgLoader(){
    
    return {
      restrict: 'E',
      controller : controller,
      transclude: true,
      templateUrl: 'imgloader.html'
    };

    function controller($scope) {
      /*jshint validthis: true */
      $scope.loaded = false;

      this.hideSpinner = function(){
        // Use apply because this function is not called from this controller ($scope)
        $scope.$apply(function () {
          $scope.loaded = true;
        });
      };
    }
  }
})();

// (function () {
//   'use strict';

//   angular
//     .module('ion-gallery', ['templates'])
//     .directive('ionImgLoader', ionImgLoader);
    
//     ionImgLoader.$inject = [];

//   function ionImgLoader() {
//     return {
//             restrict: 'E',
//             transclude: true,
//             controller: controller,
//             templateUrl: 'imgloader.html'
//     };

//     function controller($scope) {
//         $scope.loaded = false;

//         $scope.hideSpinner = function(){
//             // Use apply because this function is not called from this controller ($scope)
//             $scope.$apply(function () {
//                 $scope.loaded = true;
//             });
//         };
//     }
//   }

// })();  
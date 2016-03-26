(function(){
  'use strict';

  angular
    .module('ion-gallery')
    .directive('ionSlider',ionSlider);

  ionSlider.$inject = ['$ionicModal','ionGalleryHelper','$ionicPlatform','$timeout','$ionicScrollDelegate', '$ionicLoading'];

  function ionSlider($ionicModal,ionGalleryHelper,$ionicPlatform,$timeout,$ionicScrollDelegate, $ionicLoading){
    
    return {
      restrict: 'A',
      controller: controller,
      link : link
    };
    
    function controller($scope){
      var lastSlideIndex;
      var currentImage;
      
      var rowSize = $scope.ionGalleryRowSize;
      var zoomStart = false;
          
      $scope.selectedSlide = 1;
      $scope.hideAll = false;
      $scope.displayIndex = 1;
      
      $scope.showImage = function(index) {
        $scope.slides = [];
        currentImage = index;
        $scope.displayIndex = index+1;

        var galleryLength = $scope.ionGalleryItems.length;
        var previndex = index - 1 < 0 ? galleryLength - 1 : index - 1;
        var nextindex = index + 1 >= galleryLength ? 0 : index + 1;
        
        $scope.slides[0] = $scope.ionGalleryItems[previndex];
        $scope.slides[1] = $scope.ionGalleryItems[index];
        $scope.slides[2] = $scope.ionGalleryItems[nextindex];
        
        lastSlideIndex = 1;
        $scope.loadModal();
      };

      $scope.slideChanged = function(currentSlideIndex) {
        
        if(currentSlideIndex === lastSlideIndex){
          return;
        }

        var slideToLoad = $scope.slides.length - lastSlideIndex - currentSlideIndex;
        var galleryLength = $scope.ionGalleryItems.length;
        var imageToLoad;
        var slidePosition = lastSlideIndex + '>' + currentSlideIndex;
        
        if(slidePosition === '0>1' || slidePosition === '1>2' || slidePosition === '2>0'){
          currentImage++;
          
          if(currentImage >= galleryLength){
            currentImage = 0;
          }
          
          imageToLoad = currentImage + 1;
          
          if( imageToLoad >= galleryLength){
            imageToLoad = 0;
          }
        }
        else if(slidePosition === '0>2' || slidePosition === '1>0' || slidePosition === '2>1'){
          currentImage--;
          
          if(currentImage < 0){
            currentImage = galleryLength - 1 ;
          }
          
          imageToLoad = currentImage - 1;
          
          if(imageToLoad < 0){
            imageToLoad = galleryLength - 1;
          }
        }
        
        //Clear zoom
        $ionicScrollDelegate.$getByHandle('slide-' + slideToLoad).zoomTo(1);
        
        $scope.slides[slideToLoad] = $scope.ionGalleryItems[imageToLoad];

        lastSlideIndex = currentSlideIndex;
        $scope.displayIndex = currentImage+1;
      };
      
      $scope.saveImage = function() {
        var success = function(){
            $ionicLoading.show({
                noBackdrop: true,
                template: '保存成功',
                duration: 1500
            });
        };

        var error = function(){
            $ionicLoading.show({
                noBackdrop: true,
                template: '保存失败',
                duration: 1500
            });
        };

        $ionicLoading.show({
            noBackdrop: true,
            template: '保存图片',
            duration: 999900
        });
        
        _saveImageToPhone($scope.ionGalleryItems[currentImage].src, success, error);
      };

      $scope.$on('ZoomStarted', function(e){
        $timeout(function () {
          zoomStart = true;
          //$scope.hideAll = true;
        });
        
      });
      
      $scope.$on('TapEvent', function(e){
        $timeout(function () {
          _onTap();
        });
        
      });
      
      $scope.$on('DoubleTapEvent', function(event,position){
        $timeout(function () {
          _onDoubleTap(position);
        });
        
      });
      
      var _onTap = function _onTap(){
        
        if(zoomStart === true){
          $ionicScrollDelegate.$getByHandle('slide-'+lastSlideIndex).zoomTo(1,true);
          
          $timeout(function () {
            _isOriginalSize();
          },300);
          
          return;
        }
        
        if(($scope.hasOwnProperty('ionSliderToggle') && $scope.ionSliderToggle === false && $scope.hideAll === false) || zoomStart === true){
          return;
        }

        $scope.closeModal();
        
        //$scope.hideAll = !$scope.hideAll;
      };
      
      var _onDoubleTap = function _onDoubleTap(position){
        if(zoomStart === false){
          $ionicScrollDelegate.$getByHandle('slide-'+lastSlideIndex).zoomTo(3,true,position.x,position.y);
          zoomStart = true;
          //$scope.hideAll = true;
        }
        else{
          _onTap();
        }
      };

      var _saveImageToPhone = function _saveImageToPhone(url, success, error) {
        var canvas, context, imageDataUrl, imageData;
        var img = new Image();
        img.onload = function() {
            canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
            try {
                imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
                imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
                cordova.exec(
                    success,
                    error,
                    'Canvas2ImagePlugin',
                    'saveImageDataToLibrary',
                    [imageData]
                );
            }
            catch (e) {
                error(e.message);
            }
        };
        try {
            img.src = url;
        }
        catch(e) {
            error(e.message);
        }
      };
      
      function _isOriginalSize(){
        zoomStart = false;
        //_onTap();
      }
      
    }

    function link(scope, element, attrs) {
      var _modal;

      scope.loadModal = function(){
        $ionicModal.fromTemplateUrl('slider.html', {
          scope: scope,
          animation: 'fade-in'
        }).then(function(modal) {
          _modal = modal;
          scope.openModal();
        });
      };

      scope.openModal = function() {
        _modal.show();
      };

      scope.closeModal = function() {
        _modal.hide();
      };

      scope.$on('$destroy', function() {
        try{
          _modal.remove();
        } catch(err) {
          console.log(err.message);
        }
      });
    }
  }
})();
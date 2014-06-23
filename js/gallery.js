var  app = angular.module("GalleryModule",["ngRoute",
  "ngTouch",
  "mobile-angular-ui"
  ]);

app.directive( "carouselExampleItem", function($rootScope, $swipe){
  return function(scope, element, attrs){
      var startX = null;
      var startY = null;
      var endAction = "cancel";
      var carouselId = element.parent().parent().attr("id");

      var translateAndRotate = function(x, y, z, deg){
        element[0].style["-webkit-transform"] = "translate3d("+x+"px,"+ y +"px," + z + "px) rotate("+ deg +"deg)";
        element[0].style["-moz-transform"] = "translate3d("+x+"px," + y +"px," + z + "px) rotate("+ deg +"deg)";
        element[0].style["-ms-transform"] = "translate3d("+x+"px," + y + "px," + z + "px) rotate("+ deg +"deg)";
        element[0].style["-o-transform"] = "translate3d("+x+"px," + y  + "px," + z + "px) rotate("+ deg +"deg)";
        element[0].style["transform"] = "translate3d("+x+"px," + y + "px," + z + "px) rotate("+ deg +"deg)";
      }

      $swipe.bind(element, {
        start: function(coords){
          endAction = null;
          startX = coords.x;
          startY = coords.y;
        },

        cancel: function(e) {
          endAction = null;
          translateAndRotate(0, 0, 0, 0);
          e.stopPropagation();
        },

        end: function(coords, e) {
          if (endAction == "prev") {
            $rootScope.carouselPrev(carouselId);
          } else if (endAction == "next") {
            $rootScope.carouselNext(carouselId);
          }
          translateAndRotate(0, 0, 0, 0);
          e.stopPropagation();
        },

        move: function(coords) {
          if( startX != null) {
            var deltaX = coords.x - startX;
            var deltaXRatio = deltaX / element[0].clientWidth;
            if (deltaXRatio > 0.3) {
              endAction = "next";
            } else if (deltaXRatio < -0.3){
              endAction = "prev";
            } else {
              endAction = null;
            }
            translateAndRotate(deltaXRatio * 200, 0, 0, deltaXRatio * 15);
          }
        }
      });
    }
});

app.controller("GalleryController", function(){
	this.images = [ {name: 'Twitter Bird', 
					 url:'images/image1.png', 
					 description:'Hey I am a tweety bird!! ', 
					 favorite: 0, 
					 comments: [
							{text:'One Comment Given By me.. ',by:'Sowmiya'},
							{text:'Second comment by me.. ',by:'Priya'},
						]
					}, 
					{name: 'What?? Emoji', 
					 url:'images/image2.png', 
					 description:'What the hell happened??!!!', 
					 favorite: 0, 
					 comments: [ ]	
					},
					{name: 'LOL Smiley', 
					 url:'images/image3.png', 
					 description:'Hey I always LOL !! ', 
					 favorite: 0, 
					 comments: []	
					}];
					
	this.faveImage = function(image){
		image.favorite = image.favorite + 1;
		
	}

});

app.controller("TabController", function() {
	this.tab = 1;
	
	this.isSet = function(value){
		return this.tab === value;
	}
	this.setTab = function(value){
		this.tab = value; 
	}
});

app.directive("imageDescription", function(){
	return {
		restrict: 'E',
		templateUrl: "image-description.html"
	};
});

app.directive("imageComments", function(){
	return {
		restrict: 'E',
		templateUrl: "image-comments.html",
		controller: function(){
			this.comment = {};
			
			this.addComment = function(image){
				image.comments.push(this.comment);
				this.comment = {};
			};
			
			this.hasComments = function(){
				return (this.comment.text != undefined && this.comment.text != "");
			};
		},
		controllerAs: 'commentCtrl'
	};
});
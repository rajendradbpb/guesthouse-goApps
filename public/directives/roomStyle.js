app.directive("roomStyle",function(Constants){
  return {
    restrict: 'A',
    // controller:'RoomStyleController',
    scope:{
      inputObject:'='
    },
    link: function(scope, element, attrs) {
    // console.log("inputObject  ",scope.inputObject.bookingStatus);
     if(scope.inputObject && scope.inputObject.bookingStatus == "AVAILABLE" )
     {
      //  element.css({background: red})
      // console.log("red");
      // element.addClass('custom_roomlist');
      var css = {
        "border" : "2px solid "+Constants.availableColor,
        "color"  : Constants.availableColor,
      }
      var spanCss = {
        "background" : Constants.availableColor
      }
      $(element[0]).find(".room-listing-box").css(css);
      $(element[0]).find(".room-listing-box span").css(spanCss);
     }
     else
       if(scope.inputObject && scope.inputObject.bookingStatus == "CHECKED-IN"){
         var css = {
           "border" : "2px solid "+Constants.checkedInColor,
           "color"  : Constants.checkedInColor,
         }
         var spanCss = {
           "background" : Constants.checkedInColor
         }
         $(element[0]).find(".room-listing-box").css(css);
         $(element[0]).find(".room-listing-box span").css(spanCss);
     }
    }
  };
})
// .controller("RoomStyleController",["$scope",function($scope) {
//   console.log($scope.availableRooms);
//   if(availableRooms.bookingStatus == 'AVAILABLE'){
//     element.css()
//   }
//
// }])

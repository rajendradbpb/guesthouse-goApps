/**
* directive :roomFilter
* Info : this is used to dynamically create the filter view as per the type value passed
  currently its using the parent controller where the directive is called
* input :
      @type - refer to the type of the filter view
      type==1 will show the room list view
      type==2 will show the transaction list view
* output :...
* createdDate -8-9-16
* updated on -  8-9-16 // reason for update
*/
app.directive("roomFilter",function(){
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/roomFilter.html',
    controller:'RoomFilterController',
    scope:{
      filter:"=",
      modelValue:'='
    },
    link: function(scope, element, attrs) {
      console.log(scope.modelValue);
      scope.$watch('filtered_array', function(value) {
          scope.modelValue = value;
      });
    }
  };
})
.controller("RoomFilterController",["$scope","$rootScope","transactionService","GuesthouseService",function($scope,$rootScope,transactionService,GuesthouseService) {
  $scope.find = {};
  $scope.room = {};
  $scope.roomFeature = [
    {"name":"AC SINGLE_BED","value":'AC-SB'},
    {"name":"AC DOUBLE_BED","value":'AC-DB'},
    {"name":"NON-AC SINGLE_BED","value":'NON-AC-SB'},
    {"name":" NON-AC DOUBLE_BED","value":'NON-AC-DB'}
  ];
  $scope.getRoomInfo = function(filter){
   var obj = {
     "minPrice" :$scope.find.minPrice,
     "maxPrice" :$scope.find.maxPrice,
   }
    if(filter=="1"){
      var checked_count = 0;
     GuesthouseService.getRoom(obj,function(response){
      ///  $rootScope.showPreloader = true;
       $scope.filtered_array = [];
       $scope.room_list = response.data;
       angular.forEach($scope.room_list, function(item){
         checked_count = 0;
         if($scope.room.roomType == item.roomType){
           checked_count ++;
           $scope.filtered_array.push(item);
         }
         angular.forEach($scope.facilities, function(obj){
          if(obj.isChecked){
            checked_count++;
            angular.forEach(item.facility,function(facility){
              if(facility.name == obj.name ){
                if ($scope.filtered_array.indexOf(item) < 0) {
                  $scope.filtered_array.push(item);
                }
              }
            })
          }
        })
      })
     //used for search rooms without checking the facilities
     if(checked_count == 0){
         $scope.filtered_array = $scope.room_list;
     }
   })
 }
    else if(filter=="2"){
      transactionService.getTransaction(obj,function(response) {
        //$rootScope.showPreloader = true;
        $scope.filtered_array = [];
        $scope.trasactionList = response.data;
        angular.forEach($scope.trasactionList,function(item){
           $scope.filtered_array.push(item);
        })
      })
    }
}
$scope.newRoomInit = function() {
  transactionService.getFacilities(
    function(response){
        if(response.statusCode == 200){
            $scope.facilities = response.data;
        }
        else {
            Util.alertMessage('danger', response.message);
        }
    },
    function(err){
          Util.alertMessage('danger', err.message);
    }
  )
}
}])

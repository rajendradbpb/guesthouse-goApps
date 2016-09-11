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
    require: "ngModel",
    restrict: 'EA',
    templateUrl: 'directives/views/roomFilter.html',
    // link: link, //DOM manipulation
     controller:'RoomFilterController',
    scope:{
      filter:"=",
      ngModel:'='
    }
  };
})
.controller("RoomFilterController",["$scope","$rootScope","transactionService","GuesthouseService",function($scope,$rootScope,transactionService,GuesthouseService) {
  $scope.find ={};

  $scope.getRoomInfo = function(filter){
   //$rootScope.showPreloader = false;
   var obj = {
     "minPrice" :$scope.find.minPrice,
     "maxPrice" :$scope.find.maxPrice,
   }
    if(filter=="1"){
     GuesthouseService.getRoom(obj,function(response){
      ///  $rootScope.showPreloader = true;
       console.log(response);
       
       room_list= response.data;
       console.log( room_list);
     })
    }
    else if(filter=="2"){
      transactionService.getTransaction(obj,function(response) {
      //$rootScope.showPreloader = true;
      trasactionList = response.data
        console.log(trasactionList);
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

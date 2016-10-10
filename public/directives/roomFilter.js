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
      scope.$watch('modelValue', function(value) {
          // console.log(value);
          scope.modelValue = value;
      });
    }
  };
})
.controller("RoomFilterController",function($scope,$rootScope,transactionService,GuesthouseService,UtilityService,Util,$timeout,Events) {
  $scope.find = {};
  $scope.room = {};
  $scope.minDate = new Date();
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  $rootScope.$on(Events.ROOM_DELETED,function(data){
      $scope.getRoomInfo("1");
  })
  /**
   * functionName : getRoomInfo
   * Info : keeps the data of the current selected transaction and show in the transaction detials
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.getRoomInfo = function(filter){
  // adding facilities selected
  var selectedFacilities = [];
  for(var i in $scope.facilities) {
    if($scope.facilities[i].isChecked)
    {
      selectedFacilities.push($scope.facilities[i]._id);
    }
  }
   var obj = {
     "minPrice" :$scope.find.minPrice,
     "maxPrice" :$scope.find.maxPrice,
     "checkInDate":moment($scope.find.checkInDate).format('MM-DD-YYYY'),
     "roomType":$scope.find.roomType,
     "facilities" : selectedFacilities.toString()
   }
    if(filter=="1"){
      var checked_count = 0;
     GuesthouseService.getRoom(obj,function(response){
      $timeout(function () {
        $scope.modelValue.availableRooms = response.data.availableRooms;
        $scope.modelValue.nonAvailebleRooms = response.data.nonAvailebleRooms;
        console.log($scope.modelValue);
      });
   })
 }
    else if(filter=="2"){
      transactionService.getTransaction(obj,function(response) {
        $scope.filtered_array = [];
        console.log(response);
        // $rootScope.showPreloader = true;
        $scope.modelValue = response.data;
      })
    }
}
/**
 * functionName : allroomLists()
 * Info : keeps the data of the current selected transaction and show in the transaction detials
 * input : ...
 * output :...
 * createdDate - 4-9-2016
 * updated on -  4-9-2016 // reason for update
 */
$scope.allroomLists = function(){
  $rootScope.showPreloader = true;
    var obj = {
      "checkInDate":moment($scope.find.checkInDate).format('MM-DD-YYYY'),
    }
    GuesthouseService.getRoom(obj,function(response){
      // $scope.filtered_array = [];
      $rootScope.showPreloader = false;
      $scope.modelValue.availableRooms = response.data.availableRooms;
      $scope.modelValue.nonAvailebleRooms = response.data.nonAvailebleRooms;
      $scope.find = {};
      $scope.room.roomType = false;
      angular.forEach($scope.facilities,function(item){
        item.isChecked = false;
      })
    })
}
/**
 * functionName : allTransactions()
 * Info : keeps the data of the current selected transaction and show in the transaction detials
 * input : ...
 * output :...
 * createdDate - 4-9-2016
 * updated on -  4-9-2016 // reason for update
 */
  $scope.allTransactions = function(){
    transactionService.getTransaction(function(response) {
      //$rootScope.showPreloader = true;
      // $scope.filtered_array = [];
      $scope.trasactionList = response.data;
      // angular.forEach($scope.trasactionList,function(item){
      //    $scope.filtered_array.push(item);
      // })
      $scope.find = {};
    })
  }
/**
 * functionName : newRoomInit()
 * Info : keeps the data of the current selected transaction and show in the transaction detials
 * input : ...
 * output :...
 * createdDate - 4-9-2016
 * updated on -  4-9-2016 // reason for update
 */
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
$scope.open = function() {
 $scope.popup.opened = true;
};
$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];
$scope.altInputFormats = ['M!/d!/yyyy'];
$scope.popup = {
  opened: false
};
function getDayClass(data) {
  var date = data.date,
    mode = data.mode;
  if (mode === 'day') {
    var dayToCheck = new Date(date).setHours(0,0,0,0);

    for (var i = 0; i < $scope.events.length; i++) {
      var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

      if (dayToCheck === currentDay) {
        return $scope.events[i].status;
      }
    }
  }
  return '';
}
})

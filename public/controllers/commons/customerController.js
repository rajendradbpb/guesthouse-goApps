app.controller("CustomerController", function($scope,$rootScope,$state,$stateParams,CustomerService,Util) {
$scope.currentTab = 'customerList';
$scope.find = {};

$scope.changeTab = function(tab){
  if(tab == 'customerList'){
    $scope.loadAllCustomer();
  }
  $scope.currentTab = tab;
}
$scope.currentTab1 = 'customerdetail';
$scope.changeBookingTab = function(tab){
  $scope.currentTab1 = tab;
}
/*******************************************************/
/********This is use for submitting customer details******/
/*******************************************************/
$scope.submitCustDetails = function(){
      $rootScope.showPreloader = true;
  CustomerService.submitCustDetails($scope.customer,function(response){
      $rootScope.showPreloader = false;
    if(response.statusCode == 200){
        Util.alertMessage('success', response.message);
    }
  },function(err) {
    Util.alertMessage('danger', err.message);
  })
}
/*******************************************************/
/********This is use to load all customer details******/
/*******************************************************/
$scope.loadAllCustomer = function(){
  $rootScope.showPreloader = true;
  CustomerService.getCustomerList(function(response){
    $rootScope.showPreloader = false;
      $scope.allcoustomers = response.data;
  })
}
/*******************************************************/
/********This is use to edit customer data by using id******/
/*******************************************************/
$scope.goToEdit = function(_id){
    $state.go('edit-customer',{_id:_id})
  }
  /*******************************************************/
  /********This is use for loading customer data using their id******/
  /*******************************************************/
$scope.getCustomerbyID = function(){
    var obj ={
      "id":$stateParams._id
    }
    $rootScope.showPreloader = true;
    CustomerService.getCustomerList(obj,function(response){
     $rootScope.showPreloader = false;
      $scope.customer = response.data[0];
    })
  }
  /*******************************************************/
  /********This is use to update customer data******/
  /*******************************************************/
  $scope.updateCustomer = function(){
    $rootScope.showPreloader = true;
    CustomerService.updateCustomerbyID($scope.customer,function(response){
      $rootScope.showPreloader = false;
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
      }

   },function(err) {
     Util.alertMessage('danger', err.message);
   })
 }
 /*******************************************************/
 /********This is use to delete customer data from list******/
 /*******************************************************/
 $scope.deletecustomer = function(id){
     var obj = {
      "_id":id
     }
     $rootScope.showPreloader = true;
     CustomerService.deleteCustomer(obj,function(response) {
       $rootScope.showPreloader = false;
       $scope.loadAllCustomer();
    })
   }
   /*******************************************************/
   /********This is use to search customer using mobile no******/
   /*******************************************************/
   $scope.getCustomerInfo = function(){
     $scope.customer = {};
     $scope.is_searched = true;
     var mobile = {
       "mobile" :$scope.find.mobile
     }
     $rootScope.showPreloader = true;
     CustomerService.getCustomerList(mobile,function(response) {
       $rootScope.showPreloader = false;
       if(response.data.length > 0){
        $scope.customer =  response.data[0];
        $scope.customerFound = true;
       }
       else{
         $scope.customer = {};
         $scope.customer.mobile = $scope.find.mobile;
       }
     },function(err) {
       Util.alertMessage('danger', err.message);
     })
   }
})

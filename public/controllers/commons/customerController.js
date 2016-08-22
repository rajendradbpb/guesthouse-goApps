app.controller("CustomerController", function($scope,$rootScope,CommonService,$state,Constants,$localStorage, $window,UserService,$stateParams,CustomerService,Util) {
$scope.currentTab = 'customerList';
$scope.changeTab = function(tab){
  if(tab == 'customerList'){
    $scope.loadAllCustomer();
  }
  $scope.currentTab = tab;
}
/*******************************************************/
/********This is use for submitting customer details******/
/*******************************************************/
$scope.submitCustDetails = function(){
  var obj={
    "firstName"  : $scope.customer.firstName,
    "middleName" : $scope.customer.middleName,
    "lastName"   : $scope.customer.lastName,
    "email"      : $scope.customer.email,
    "mobile"     : $scope.customer.mobile,
    "state"      : $scope.customer.address.state,
    "country"     : $scope.customer.address.country,
    "pin"        : $scope.customer.pinno
  }
  CustomerService.submitCustDetails(obj,function(response){
    if(response.statusCode == 200){
        Util.alertMessage('success', response.message);
    }
    else {
        Util.alertMessage('danger', response.message);
    }
  });
}
/*******************************************************/
/********This is use to load all customer details******/
/*******************************************************/
$scope.loadAllCustomer = function(){
  CustomerService.getCustomerList(function(response){
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
    CustomerService.getCustomerbyID(obj,function(response){
       console.log(response);
        $scope.customer = response.data[0];
    })
  }
  $scope.updateCustomer = function(){
    CustomerService.updateCustomerbyID($scope.customer,function(response){
    if(response.statusCode == 200){
        Util.alertMessage('success', response.message);
    }
    else {
        Util.alertMessage('danger', response.message);
    }
   })
 }
 $scope.deletecustomer = function(_id){
     var obj = {
      "_id":_id
     }
     CustomerService.deleteCustomer(obj,function(response) {
       console.log(response);
        $scope.loadAllCustomer();
    })
   }
})

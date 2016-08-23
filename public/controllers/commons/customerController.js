app.controller("CustomerController", function($scope,$rootScope,CommonService,$state,Constants,$localStorage, $window,UserService,$stateParams,CustomerService,Util) {
$scope.currentTab = 'customerList';
$scope.changeTab = function(tab){
  if(tab == 'customerList'){
    $scope.loadAllCustomer();
  }
  $scope.currentTab = tab;
}
$scope.currentTab1 = 'customerdetail';
$scope.changeTab1 = function(tab){
  $scope.currentTab1 = tab;
}
/*******************************************************/
/********This is use for submitting customer details******/
/*******************************************************/
$scope.submitCustDetails = function(){
  CustomerService.submitCustDetails($scope.customer,function(response){
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
  /*******************************************************/
  /********This is use to update customer data******/
  /*******************************************************/
  $scope.updateCustomer = function(){
    CustomerService.updateCustomerbyID($scope.customer,function(response){
      console.log($scope.customer);
    if(response.statusCode == 200){
        Util.alertMessage('success', response.message);
    }
    else {
        Util.alertMessage('danger', response.message);
    }
   })
 }
 /*******************************************************/
 /********This is use to delete customer data from list******/
 /*******************************************************/
 $scope.deletecustomer = function(_id){
     var obj = {
      "_id":_id
     }
     CustomerService.deleteCustomer(obj,function(response) {
       $scope.loadAllCustomer();
    })
   }
   /*******************************************************/
   /********This is use to search customer using mobile no******/
   /*******************************************************/
   $scope.getCustomerInfo = function(mobile){
     $scope.is_searched = true;
     var mobile = {
       "mobile" :mobile
     }
     CustomerService.getCustomerList(mobile,function(response) {
       $scope.customer = response.data[0];
       response.data.length > 0 ? $scope.customerFound = true : $scope.customerFound = false;
     },function(err) {
       Util.alertMessage('danger', err.message);
     })
   }
})

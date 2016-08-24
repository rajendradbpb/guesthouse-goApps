app.factory("CustomerService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
     submitCustDetails:{
        method: 'POST',
        url:"/customer",
        headers:"application/json"
     },
     getCustomerList: {
        method: 'GET',
        url:"/customer",
        headers:"application/json"
     },
     updateCustomerbyID : {
       method: 'PUT',
       url:"/customer",
       headers:"application/json"
     },
     deleteCustomer : {
       method: 'DELETE',
       url:"/customer",
       headers:"application/json"
     },
     addNewBooking: {
        method: 'GET',
        url:"/customer",
        headers:"application/json"
     }
  });
})

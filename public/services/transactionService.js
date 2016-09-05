app.factory("transactionService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
    addTransaction:{
       method: 'POST',
       url:"/transaction",
       headers:"application/json"
    },
    getTransaction:{
       method: 'GET',
       url:"/transaction",
       headers:"application/json"
    },
    updateTransaction:{
       method: 'PUT',
       url:"/transaction",
       headers:"application/json"
    }
  });
})

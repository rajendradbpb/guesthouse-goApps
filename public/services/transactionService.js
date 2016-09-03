app.factory("transactionService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
    addTransaction:{
       method: 'POST',
       url:"/transaction",
       headers:"application/json"
    }
  });
})

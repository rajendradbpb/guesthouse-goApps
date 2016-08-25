app.factory("GuesthouseService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
    getuser: {
      method:'GET',
      url:"/user",
      headers:"application/json"
    },
  submitguestHouse:{
     method: 'POST',
     url:"/guestHouse",
     headers:"application/json"
  }

  });
})

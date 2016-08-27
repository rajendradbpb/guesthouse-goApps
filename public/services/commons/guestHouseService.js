app.factory("GuesthouseService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
    getuser: {
      method:'GET',
      url:"/user",
      headers:"application/json"
    },
    addRoom: {
      method:'POST',
      url:"/guestHouse/room",
      headers:"application/json"
    },
    getFacilities: {
      method:'GET',
      url:"/facility",
      headers:"application/json"
    },
  submitguestHouse:{
     method: 'POST',
     url:"/guestHouse",
     headers:"application/json"
  }

  });
})

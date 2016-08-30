app.factory("GuesthouseService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
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
  },
  getRoom : {
       method:'GET',
       url:"/guestHouse/room",
       headers:"application/json"
  },
  updateroomByID : {
      method:'PUT',
      url:"/guestHouse/room",
      headers:"application/json"
  },
  deleteRoom : {
      method: 'DELETE',
      url:"/guestHouse/room",
      headers:"application/json"
  },
  loadRoomByStatus :{
      method:'GET',
      url:"/guestHouse/room?isDash=1",
      headers:"application/json"
  }
  });
})

app.factory("UserService", function($http,$resource) {
  return $resource('/',null,{
      updateUser: {
          method: 'PUT',
          url:"/user",
          headers:"application/json"
      }
  });
})

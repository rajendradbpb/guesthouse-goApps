app.factory("UserService", function($http,$resource) {
  return $resource('/',null,{
      updateUser: {
          method: 'PUT',
          url:"/user",
          headers:"application/json"
      },
      changePassword: {
          method: 'POST',
          url:"/user/changePassword",
          headers:"application/json"
      },
      getRoleType: {
        method:'GET',
        url:"/admin/role",
        headers:"application/json"
      },
      submitUserDetails:{
        method: 'POST',
        url:"/user",
        headers:"application/json"
      }
  });
})

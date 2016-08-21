app.factory("UserService", function($http,$resource,$localStorage,Constants) {
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
      loggedIn: {
        method:'GET',
        url:"/user/loggedin",
        headers:{
          "Content-type" : "application/json" ,
          "Authorization" : "bearer "+$localStorage[Constants.getTokenKey()] ,
        }
      },
      submitUserDetails:{
        method: 'POST',
        url:"/user",
        headers:"application/json"
      },
      onForgotPassword:{
        method: 'PUT',
        url:"/user/forgetPassword",
        headers:{"Content-type":"application/json"}
      }
  });
})

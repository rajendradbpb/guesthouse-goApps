app.filter('dateformat', function(){
  return function(date){
    if(date){
      return moment(date).format("YYYY-MM-DD");
    }
  }
})

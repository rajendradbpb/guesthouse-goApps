app.factory("UtilityService", function($http,$resource,$localStorage,Constants) {
  var getSelectedIds = function(array,prop,matchValue){
    var arr = [];
    angular.forEach(array,function(value,key) {
      console.log(value);
      if(value[prop] == matchValue)
        arr.push(value._id);
    });
    return arr;
  }

  return{
    getSelectedIds:getSelectedIds
  }
})

app.factory("UtilityService", function($http,$resource,$localStorage,Constants) {
  var getSelectedIds = function(array,prop,matchValue){
    var arr = [];
    angular.forEach(array,function(value,key) {

      if(value[prop] == matchValue)
        arr.push(value._id);
    });
    return arr;
  };
  /**
   * functionName :getSelectedItemByProp
   * Info : this is used to give the required property on matching the condition given and give the result in array
   * input :
        @array - input array
        @prop - prop to be parse (in case of null skip the conditon checking and loop for all iterration)
        @matchValue - condition to match @prop
        @returnProp - property to be returned
   * output : array
   * createdDate - 5-9-2016
   * updated on -  5-9-2016 // reason for update
   */
  var getSelectedItemByProp = function(array,prop,matchValue,returnProp){
    var arr = [];
    angular.forEach(array,function(value,key) {

      if(prop && value[prop] == matchValue)
        arr.push(value[returnProp]);
      else if (!prop) {
        // in case of the match property not mentioned then add the Required property
        arr.push(value[returnProp]);
      }
    });
    return arr;
  };
  var getSelectedItemByID = function(array,prop,matchValue,returnProp){
    var arr = [];
    angular.forEach(array,function(value,key) {

      if(value[prop] == matchValue)
        arr.push(value[returnProp]);
    });
    return arr;
  };
  return{
    getSelectedIds:getSelectedIds,
    getSelectedItemByProp:getSelectedItemByProp,
    getSelectedItemByID:getSelectedItemByID
  }
})

app.constant("Constants", {
        "storagePrefix": "goAppGh$",
        "getTokenKey" : function() {return this.storagePrefix + "token";},
        "getLoggedIn" : function() {return this.storagePrefix + "loggedin";},
        "availableColor" : "#3955dd",
        "checkedInColor" : "#ff0000",
        "bookedColor" : "yellow",
})

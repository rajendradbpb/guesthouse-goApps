app.constant("Constants", {
        "storagePrefix": "goAppGh$",
        "getTokenKey" : function() {return this.storagePrefix + "token";},
        "getLoggedIn" : function() {return this.storagePrefix + "loggedin";},
})

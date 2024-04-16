sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History"
    ],
    function (Controller, History) {
        "use strict";
        return Controller.extend("finalproject.finalprojectfiorischool.controller.BaseController", {
            // Implement a function named getRouter and return the router of the component.
            getRouter: function () {
                return this.getOwnerComponent().getRouter();
            },

            // Implement a getListSelector function and return the reference of the oListSelector object from the component.
            getListSelector: function() {
                return this.getOwnerComponent().oListSelector;
            },

            // Implement a getResourceBundle function and return a reference to the i18n model of the application.
            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            // Implement a function named onNavBack. The function should navigate back to the master list using the masterlist route.
            onNavBack: function() {
                var sPreviousHash = History.getInstance().getPreviousHash();
                if (sPreviousHash !== undefined) {
                    // The history contains a previous entry
                    history.go(-1);
                } else {
                    // Otherwise we go backwards with a forward history
                    var bReplace = true;
                    this.getRouter().navTo("masterlist", {}, bReplace);
                }
            }
    });
   }
);
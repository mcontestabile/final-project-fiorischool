    sap.ui.define(
        [
          "./BaseController",
          "sap/ui/model/json/JSONModel"
        ],
        function(BaseController, JSONModel) {
          "use strict";
      
          return BaseController.extend("finalproject.finalprojectfiorischool.controller.App", {
            onInit: function() {
              //  Create an JSON-Model with an attribute layout and assign the created Model to the App view.
              var oViewModel = new JSONModel({
                layout : "OneColumn"
              });
              
              this.getView().setModel(oViewModel, "mainView");
            }
          });
        }
      );
      
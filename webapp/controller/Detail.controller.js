sap.ui.define(
    [
        "finalproject/finalprojectfiorischool/controller/BaseController",
        "../model/formatter",
        "sap/ui/core/routing/History",
        "sap/m/MessageToast",
        "sap/base/i18n/ResourceBundle",
        "sap/m/Dialog",
        "sap/m/Text",
        "sap/m/Button",
        "sap/m/library"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, History, MessageToast, ResourceBundle, Dialog, Text, Button, mobileLibrary) {
        "use strict";

        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;

        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("finalproject.finalprojectfiorischool.controller.Detail", {

            formatter : formatter,

                        
            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("masterlist", {}, true);
            },

            // Implement the onInit function. Register the _onObjectMatched event handler for the pattern matching event of the bookings route.
            onInit: function () {
                this.getRouter().getRoute("bookings").attachPatternMatched(this._onObjectMatched, this);
                
                /*
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "travel");
                console.log(oModel);
                */
            },

            // Define a function named _onBindingChange. The function should check whether the view is bound to
            // an entity or not. If not, a target with the name detailObjectNotFound should be displayed and the
            // selection on the master list should be cleared. To clear the selection, call the function clearListSelection
            // on the ListSelector. If the view is bound to an entity, get the binding path of the entity and
            // invoke the selectAListItem function from the ListSelector. Pass the binding path as an argument.

            _onBindingChange: function() {
			    var oView = this.getView();
			    var oElementBinding = oView.getElementBinding();
                console.log("oElementBinding : " + oElementBinding);
			    if (!oElementBinding.getBoundContext()) {
				    this.getRouter().getTargets().display("detailObjectNotFound");
				    this.getOwnerComponent().oListSelector.clearMasterListSelection();
				    return;
			    }
			    var sPath = oElementBinding.getPath();
			    this.getOwnerComponent().oListSelector.selectAListItem(sPath);
		    },

            onApproveDialog: function (oEvent) {
                var data = oEvent.getSource().getBindingContext().getObject();
                console.log(data);

                if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Are you sure you want to approve?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.onApprove(data);
                                this.oApproveDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this.oApproveDialog.close();
                            }.bind(this)
                        })
                    });
                }
    
                this.oApproveDialog.open();
            },

            onRejectDialog: function (oEvent) {
                var data = oEvent.getSource().getBindingContext().getObject();
                console.log(data);

                if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Are you sure you want to reject?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.onReject(data);
                                this.oApproveDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this.oApproveDialog.close();
                            }.bind(this)
                        })
                    });
                }
    
                this.oApproveDialog.open();
            },

            onApprove : function(data) {
                var oResourceBundle = ResourceBundle.create({ url: "i18n/i18n.properties" });
                var oDataModel = this.getView().getModel();
                console.log(oDataModel);
                //var oObject = oEvent.getSource().getBindingContext().getObject();
                var sObjectPath = this.getView().getBindingContext().getPath();
                console.log(sObjectPath);
                var travelID = data.TravelID;
                var agencyID = data.AgencyID;
                var customerID = data.CustomerID;
                var beginDate = data.BeginDate;
                var endDate = data.EndDate;

                var data = {
                    TravelID : travelID,
                    Status : "P",
                    AgencyID : agencyID,
                    CustomerID : customerID,
                    BeginDate : beginDate,
                    EndDate : endDate
                };

                var that = this;

                this.getView().setBusy(true);

                //var mParameters = {};
                //mParameters.eTag = "*";

                //oDataModel.update(sObjectPath, data, mParameters, { 
                oDataModel.update(sObjectPath, data, { 
                    context:null,
                    success: function(oDataModel, oResponse) { 	
                        //that.getView().byId("list").getBinding("items").refresh();
                        //that.getView().getElementBinding().refresh();				
                        that.getView().setBusy(false);
                        MessageToast.show(oResourceBundle.getText("approvedMessage"));
                        },
                    error: function(err) {
                        that.getView().setBusy(false);
                        MessageToast.show(oResourceBundle.getText("notWorking"));
                    }
                } );
                
                this.onNavBack();
            },

            onReject : function(data) {
                var oResourceBundle = ResourceBundle.create({ url: "i18n/i18n.properties" });
                var oDataModel = this.getView().getModel();
                console.log(oDataModel);
                //var oObject = oEvent.getSource().getBindingContext().getObject();
                var sObjectPath = this.getView().getBindingContext().getPath();
                console.log(sObjectPath);
                var travelID = data.TravelID;
                var agencyID = data.AgencyID;
                var customerID = data.CustomerID;
                var beginDate = data.BeginDate;
                var endDate = data.EndDate;

                var data = {
                    TravelID : travelID,
                    Status : "X",
                    AgencyID : agencyID,
                    CustomerID : customerID,
                    BeginDate : beginDate,
                    EndDate : endDate
                };

                var that = this;

                this.getView().setBusy(true);

                //var mParameters = {};
                //mParameters.eTag = "*";

                //oDataModel.update(sObjectPath, data, mParameters, { 
                oDataModel.update(sObjectPath, data, { 
                    context:null,
                    success: function(oDataModel, oResponse) { 	
                        //that.getView().byId("list").getBinding("items").refresh();
                        //that.getView().getElementBinding().refresh();				
                        that.getView().setBusy(false);
                        MessageToast.show(oResourceBundle.getText("rejectedMessage"));
                        },
                    error: function(err) {
                        that.getView().setBusy(false);
                        MessageToast.show(oResourceBundle.getText("notWorking"));
                    }
                } );
                
                this.onNavBack();
            },
            
            // Implement a function named _bindView. The function takes one argument named sObjectPath.
            // The variable contains the path to the selected Object from the master list. Update the
            // binding of the view using the bindElement function. Pass a literal object to the bindElement
            // function. Add a property named path to the literal object and assign the sObjectPath variable
            // to the property. Then add an events property to the literal object. Assign another literal
            // object to the events property. Define three attributes to the events object. The first property
            // is called change. Assign the reference to the function _onBindingChangeto the property. Add a
            // property dataRequested and dataReceived. Assign a function to each property. Implement the function
            // for dataRequested and show that the view is busy. Implement the function for dataReceived and
            // hide the busy indicator for the view.         
            _bindView: function(sObjectPath) {
			    var oView = this.getView();

			    this.getView().bindElement({
				    path: sObjectPath,
				    events: {
					    change: this._onBindingChange.bind(this),
					    dataRequested: function() {
						    oView.setBusy(true);
					    },
					    dataReceived: function() {
						    oView.setBusy(false);
					    }
				    }
			    });
		    },

            // Implement a function named _onObjectMatched. This function is an event handler function for the
            // Pattern-Matched event during navigation. Read the navigation property objectId from the events
            // arguments and call the _bindView function of the controller. Pass the objectId to the function.
            // In addition, change the layout attribute of the mainView Model to TwoColumnsMidExpanded to adjust
            // the layout behavior of your sap.f.flexibleColumnLayout.     
            _onObjectMatched: function(oEvent) {
                this.getView().getModel("mainView").setProperty("/layout", "TwoColumnsMidExpanded");
			    var sObjectPath = "/Travel('" + oEvent.getParameter("arguments").objectId + "')";
			    this._bindView(sObjectPath);
                console.log(sObjectPath);
		    }
        });
    });
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

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("masterlist", {}, true);
                }
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

            mySuccessHandler : function() {
                MessageToast.show(oResourceBundle.getText("approvedMessage"));
            },

            myErrorHandler : function() {
                MessageToast.show(oResourceBundle.getText("notWorking"));
            },

            onApproveDialog: function (oEvent) {
                if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Are you sure you want to approve?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.onApprove(oEvent);
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

            onRejectDialog: function () {
                if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Are you sure you want to reject?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                onReject(oEvent);
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

            onApprove : function(oEvent) {
                var oResourceBundle = ResourceBundle.create({ url: "i18n/i18n.properties" });

                // Render the OData service
                var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZUI_EXERCISE3_TRAVEL_02");
                var travelID = this.getView().byId("title1").getText();

                // Read data
                oDataModel.read("/Travel('" + travelID + "')", null, null, true, function(oData) {
                    console.log(oData);

                    // Ottenere l'etag dalla risposta della lettura
                    var etag = oData.__metadata.etag;
                    console.log(etag);

                    // Creare i dati per l'aggiornamento
                    var data = {};
                    
                    data.AgencyID = oData.AgencyID;
                    data.BeginDate = oData.BeginDate;
                    data.BookingFee = oData.BookingFee;
                    data.Createdat = oData.Createdat;
                    data.Createdby = oData.Createdby;
                    data.CurrencyCode = oData.CurrencyCode;
                    data.CustomerID = oData.CustomerID;
                    data.Delete_mc = oData.Delete_mc;
                    data.Description = oData.Description;
                    data.EndDate = oData.EndDate;
                    data.Lastchangedat = oData.Lastchangedat;
                    data.Lastchangedby = oData.Lastchangedby;
                    data.TotalPrice = oData.TotalPrice;
                    data.TravelID = oData.TravelID;
                    data.Status = "A";

                    // Esegui una richiesta GET per ottenere il token CSRF
                    $.ajax({
                        url: '/sap/opu/odata/sap/ZUI_EXERCISE3_TRAVEL_02',
                        method: 'GET',
                        headers: {
                            'X-CSRF-Token': 'Fetch'
                        },
                        success: function(dataToken, textStatus, xhr) {
                            // Una volta ottenuto il token CSRF, lo salva in una variabile per l'uso successivo
                            var csrfToken = xhr.getResponseHeader('X-CSRF-Token');

                            console.log("Sto per chiamare l'update");
                    
                            oDataModel.setHeaders({
                                "If-Match" : etag,
                                'X-CSRF-Token': csrfToken
                            });

                            //debugger;
                            oDataModel.update("/Travel('" + travelID + "')", data, function() {
                                //MessageToast.show(oResourceBundle.getText("approvedMessage"));
                                alert(oResourceBundle.getText("approvedMessage"));
                            }, function() {
                                MessageToast.show(oResourceBundle.getText("notWorking"));
                            });
                        }
                    });
                }, function(error){
                    alert("ERROR");
                });
                
                this.onNavBack();

                //var oModel = this.oDataModel;
                //console.log("oModel: " + oModel);
                //console.log("TravelID: " + oEvent.getParameter("title1").getText());
                //var oBindingContext = oEvent.getParameter("list").getBindingContext();
                //console.log("oBindingContext: " + oBindingContext);
                //oModelData = oModel.getData();
                //console.log("oModelData:" + oModelData);
                //console.log(this.getOwnerComponent().oListSelector);
                /*
                debugger;
                var oMyComp = this.getOwnerComponent();
                var oMyListSel = oMyComp.oListSelector;
                var sMyPath = oMyListSel.getBindingPath();
                console.log(sMyPath);
                console.log("getModel " + this._bindView().oModel);
                console.log("onApprove TravelID " + this.getOwnerComponent().oListSelector.getBindingPath());
                oModel = this._bindView().oModel;
                */
                //oModel.update("/Travel('" + this.byId("title1").getText() + "')", oData, {success: mySuccessHandler, error: myErrorHandler});
                
                /*
                this.byId("list").getBinding("items").update({
                    "Status": "A"
                }).update().then(function () {
                    MessageToast.show(oResourceBundle.getText("customerCreatedMessage"));
                });
                */
            },

            onReject : function() {
                var oModelData = this.getView().getModel("customer").getData();
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                if (oModelData.Discount === undefined) { oModelData.Discount = 0; }

                this.byId("customerTable").getBinding("items").create({
                    "Form": oModelData.Form,
                    "CustomerName": oModelData.CustomerName,
                    "Discount": oModelData.Discount + "", //Values for property 'Discount' must be quoted in the payload
                    "Street": oModelData.Street,
                    "PostCode": oModelData.PostCode,
                    "City": oModelData.City,
                    "Country": oModelData.Country,
                    "Email": oModelData.Email,
                    "Telephone": oModelData.Telephone
                }).created().then(function () {
                    MessageToast.show(oResourceBundle.getText("rejectedMessage"));
                });
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
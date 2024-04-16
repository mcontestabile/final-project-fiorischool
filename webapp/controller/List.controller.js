sap.ui.define(
    [
        "finalproject/finalprojectfiorischool/controller/BaseController",
        "sap/ui/Device",
        "../model/formatter",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, formatter, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("finalproject.finalprojectfiorischool.controller.List", {
            formatter : formatter,

            // Implement the onInit function. Get a reference to the master list of your view and
            // store the reference in a variable named oList. Assign the reference to oList to a
            // member variable named _oList. Add a eventhandler for onBeforeFirstShow of the view
            // using addEventDelegate-function and invoke the setBoundMasterList of the ListSelector
            // and pass the reference to the oList object to the function. Implement a behavior when
            // the masterlist route is invoked by the router. If this is the case, the _onListMatched
            // function should be invoked. Implement a behavior when the router bypasses the list
            // route, register the onBypassed function when this event occurs. 
            onInit: function () {
                var oList = this.byId("list");
                this._oList = oList;
                this.getView().addEventDelegate({
                    onBeforeFirstShow: function () {
                        this.getOwnerComponent().oListSelector.setBoundMasterList(this._oList);
                    }.bind(this)
                }); 
                this.getRouter().getRoute("masterlist").attachPatternMatched(this._onListMatched, this);
                this.getRouter().attachBypassed(this.onBypassed, this);
            },

            onFilterTravels: function (oEvent) {
                // build filter array
                var aFilter = [];
                var sQuery = oEvent.getParameter("query");
                if (sQuery && sQuery.length > 0) {
                    if(sQuery === "Open") {
                        sQuery = "O";
                    } else if(sQuery === "Canceled") {
                        sQuery = "X";
                    } else if(sQuery === "Accepted") {
                        sQuery = "A";
                    }
                    
                    aFilter.push(new Filter("Status", FilterOperator.Contains, sQuery));
                }

                // filter binding
                var oTable = this.byId("list");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilter);
            },

            // Implement a _navigateToBookingsDetails function. The function takes two arguments.
            // Name the first argument sTravelID and the second bReplace. The function should
            // navigate to the bookings route and pass a sTravelID value as a parameter.
            _navigateToBookingsDetails : function(sTravelID,bReplace) {
                console.log("Selected TravelID:", sTravelID);
                this.getRouter().navTo("bookings", {
                    objectId: sTravelID
                }, bReplace);
            },

            // Add a _showDetail function. The function takes one argument. Name the argument
            // oItem. This variable will contain during runtime the item selected by the user
            // from the master list. Read the property TravelID from the oItemand store it in a
            // variable sTravelID. Check also if the app is running on a mobile device or not.
            // Store the result in a local variable bReplace. Invoke the _navigateToBookingsDetails
            // function and pass both variables as an argument.
            _showDetail: function(oItem) {
                // Check whether the app is running on a mobile device or on a desktop
                // and store the result in a local variable. Then read the TravelID property
                // from the bindingContext of the oItem object and store it in a variable.
                // Pass both variables to the _navigateToBookingsDetails function. Add the
                // following code into the _showDetail function
                var bReplace = !Device.system.phone;
                var sTravelID = oItem.getBindingContext().getProperty("TravelID");
                this._navigateToBookingsDetails(sTravelID,bReplace);
            },

            // Implement the event handler for the select event of the list. The assign
            // function to handle the event was called onSelect. Invoke the _showDetail
            // method and pass the selected item to the function. The selection behavior
            // of the table depends on whether the app is running on a mobile device or not.
            onSelect: function(oEvent) {
                this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
            },

            // Implement an onBypassed function. This function should handle the case that
            // when the router bypasses the target. Inside the function, invoke the removeSelections
            // function on the list object.
            onBypassed: function() {
                this._oList.removeSelections(true);
            },

            // Add an _onListMatched function to the implementation. The function takes no argument.
            // The function will be called when the list route is invoked by the router. React on the
            // case when the promise oWhenListLoadingIsDone is resolved. If the promise is resolved,
            // the details of the first item from the master list should be displayed inside the details
            // view. This should only be processed when the mode of list is not None.
            _onListMatched: function() {
                this.getListSelector().oWhenListLoadingIsDone.then(
                    function(mParams) {
                        if (mParams.list.getMode() === "None") {
                            return;
                        }
                        var sObjectId = mParams.firstListitem.getBindingContext().getProperty("TravelID");
                        this._navigateToBookingsDetails(sObjectId,true);
                    }.bind(this)
                );
            }
        });
    });

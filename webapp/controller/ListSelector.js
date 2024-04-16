
sap.ui.define(
   [
    "sap/ui/base/Object",
    "../model/formatter"
   ],
   function(BaseObject, formatter) {
   "use strict";
   
   return BaseObject.extend("finalproject.finalprojectfiorischool.controller.ListSelector", 
    {
        formatter : formatter,
        
        constructor : function () {
            // Inside the constructor function, create a Promise instance and assign the instance
            // to a member variable called _oWhenListHasBeenSet. Pass an anonymous function to the
            // Promise-constructor. The function should take an argument with the name fnResolveListHasBeenSet.
            // Assign this argument to a public variable _fnResolveListHasBeenSet of function object.
            // Make sure that the reference of the anonymous function points to the right object.
            this._oWhenListHasBeenSet = new Promise(function (fnResolveListHasBeenSet) {
                this._fnResolveListHasBeenSet = fnResolveListHasBeenSet;
            }.bind(this));

            // Create another Promise instance and assign the object to a member variable with the
            // name oWhenListLoadingIsDone. The constructor function of the Promise should take an
            // anonymous function with two arguments. Name the first argument fnResolve and the second
            // fnReject. Make sure that the reference inside the promise points to the correct object.
            this.oWhenListLoadingIsDone = new Promise(function (fnResolve, fnReject) {
                // Implement the anonymous function created in previous step in a way that when the
                // _oWhenListHasBeenSet promise is resolved, an anonymous function with an oList parameter is called.
                this._oWhenListHasBeenSet
                    .then(function (oList) {
                        // The oList object will contain a reference at runtime to a list of the List view.
                        // Register an event handler for the dataReceived event for the items binding. The
                        // event handler registered for that event should check whether data are received
                        // from the backend during binding or not. When no data received from a backend call
                        // the fnReject function point should be invoked. Pass a literal javascript object
                        // with a property list and a property error. Assign the oList list object to the list
                        // property and a true value to the error property.
                        oList.getBinding("items").attachEventOnce("dataReceived",
                            function (oData) {
                                if (!oData.getParameter("data")) {
                                    fnReject(
                                        {
                                            list : oList,
                                            error: true
                                        }
                                    );
                                }

                            // Continue with the implementation and enhance the event handler for the dataReceived
                            // event. Check whether the list referenced by the oList object contains at least one
                            // item. If this is the case, call the function point, fnResolve. Pass a literal
                            // javascript object with a property list and a property firstListitem. Assign the oList
                            // list object to the list property and the first item of the list to the firstListitemproperty.
                            // If there is not at least one item in the list, call fnReject. Pass a literal javascript
                            // object with a property list and a property error. Assign the oList list object to the
                            // list property and a false value to the error property.
                            var oFirstListItem = oList.getItems()[0];  
                            if(oFirstListItem) {
                                fnResolve(
                                    {
                                        list: oList,
                                        oFirstListItem: oFirstListItem
                                    }
                                )
                            } else {
                                // No items in the list
                                fnReject(
                                    {
                                        list : oList,
                                        error: false
                                    }
                                );
                            }
                        }
                    );
            });
            }.bind(this));
        },

        // Implement a setBoundMasterList function. The function should take one argument named oList.
        // Assign the oList parameter to a member variable named _oList and call the function pointer
        // stored in _fnResolveListHasBeenSet. Pass the oList object to that function pointer.
        setBoundMasterList: function(oList) {
            this._oList = oList;
            this._fnResolveListHasBeenSet(oList);
        },

        // Implement a function named selectAListItem. The function should take one argument named sBindingPath.
        // The sBindingPath argument will contain the path to an item of the master list. The function should
        // react when the oWhenListLoadingIsDone promise is resolved and should check whether the sBindingPath
        // variable points to the same entity of the list that was already selected. If this, or the mode of the
        // list, equals None, the processing should return to the caller. Otherwise, the item of the list should be selected.
        selectAListItem : function (sBindingPath) {
            this.oWhenListLoadingIsDone.then(
                function () {
                    var oList = this._oList,
                    oSelectedItem;
                
                    if (oList.getMode() === "None") {
                        return;
                    }
                
                    oSelectedItem = oList.getSelectedItem();
                
                    // skip update if the current selection is already matching the object path
                    if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sBindingPath) {
                        return;
                    }
                
                    oList.getItems().some(function (oItem) {
                        if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === sBindingPath) {
                            oList.setSelectedItem(oItem);
                            return true;
                        }
                    });
                }.bind(this)
            );
        },

        // Implement a clearListSelection function. This function should reset the statuses selected at all items
        // of the list. The deselection should be done when the promise stored in _oWhenListHasBeenSet is resolved.
        clearMasterListSelection: function() {
            this._oWhenListHasBeenSet.then(function() {
                this._oList.removeSelections(true);
            }.bind(this));
        },

        getBindingPath : function() {
            return this._oList.mBindingInfos.items.path;
        }
    });
});
   
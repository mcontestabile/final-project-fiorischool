sap.ui.define([
	"sap/base/i18n/ResourceBundle"
], (ResourceBundle) => {
	"use strict";

	return {

        statusLabel: function (sStatus) {
            var oResourceBundle = ResourceBundle.create({ url: "i18n/i18n.properties" });

            switch (sStatus) {
                case "P":
                    return oResourceBundle.getText("statusP");
                case "B":
                    return oResourceBundle.getText("statusB");
                case "X":
                    return oResourceBundle.getText("statusX");
                case "N":
                    return oResourceBundle.getText("statusN");
                default:
                    return sStatus;
            }
        }

    };
});

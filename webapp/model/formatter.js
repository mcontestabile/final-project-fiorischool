sap.ui.define([
	"sap/base/i18n/ResourceBundle"
], (ResourceBundle) => {
	"use strict";

	return {

        statusLabel: function (sStatus) {
            var oResourceBundle = ResourceBundle.create({ url: "i18n/i18n.properties" });

            switch (sStatus) {
                case "O":
                    return oResourceBundle.getText("statusO");
                case "A":
                    return oResourceBundle.getText("statusA");
                case "X":
                    return oResourceBundle.getText("statusX");
                default:
                    return sStatus;
            }
        }

    };
});

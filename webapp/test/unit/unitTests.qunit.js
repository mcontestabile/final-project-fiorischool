/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"finalproject/final-project-fiorischool/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

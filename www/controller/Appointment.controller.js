sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/m/MessageToast', 'sap/m/MessageBox', "sap/ui/model/json/JSONModel", "sap/dm/model/formatter",
	'sap/dm/util/Beacon'
], function(Controller, MessageToast, MessageBox, JSONModel, formatter, Beacon) {
	return Controller.extend("sap.dm.controller.Appointment", {

		formatter: formatter,

		onInit: function() {
			var oComponent = this.getOwnerComponent();

			this._router = oComponent.getRouter();
			this._router.getRoute("appointment").attachPatternMatched(this._loadAppointment, this);
			this.oSplitContainer = this.getView().byId("idSplitContainer");
			if (this.oSplitContainer) {
				this.oSplitContainer.setShowSecondaryContent(false);
			}

			Beacon.startBeaconRegion();
		},

		_loadAppointment: function(oEvent) {
			this.oAppointmentModel = new JSONModel("model/appointment.json");
			this.getView().setModel(this.oAppointmentModel, "oAppointmentModel");
		},

		onPressMenuBtn: function() {
			Beacon.getCurrentBeacon();

			if (this.oSplitContainer) {
				var bIsAsideShows = this.oSplitContainer.getShowSecondaryContent();
				if (bIsAsideShows) {
					this.oSplitContainer.setShowSecondaryContent(false);
				} else {
					this.oSplitContainer.setShowSecondaryContent(true);
				}
			}
		},

		onPressAppointment: function(oEvent) {
			var oListItem = oEvent.getSource().getParent();
			var oDetailContainer = oListItem.findAggregatedObjects(false, function(oElement) {
				if (oElement.getMetadata().getName() === "sap.m.VBox") {
					return oElement;
				}
			});
			if (oDetailContainer && oDetailContainer.length === 1) {
				if (oDetailContainer[0].getVisible()) {
					oDetailContainer[0].setVisible(false);
					return;
				}
				oDetailContainer[0].setVisible(true);
			}
		},

		onPressMap: function(oEvent) {
			var oListItem = oEvent.getSource().getParent().getParent();
			var oBindingCtx = oListItem.getBindingContext("oAppointmentModel");
			if (!_.isEmpty(oBindingCtx.getObject())) {
				this._router.navTo("appointmentDetail", {
					id: oBindingCtx.getObject().id
				});
			}
		},

		onUserMenuAction: function(oEvent) {
			var oItem = oEvent.getParameter("item"), sItemPath = "";
			while (oItem instanceof sap.m.MenuItem) {
				sItemPath = oItem.getText() + " > " + sItemPath;
				oItem = oItem.getParent();
			}
			sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));
			sap.m.MessageToast.show("Action triggered on item: " + sItemPath);
		},

// onPressAppointment: function() {
// this._router.navTo("appointment");
// },

		onPressMenuSitemap: function() {
			this._router.navTo("sitemap");
			this.oSplitContainer.setShowSecondaryContent(false);
		}

	});
});

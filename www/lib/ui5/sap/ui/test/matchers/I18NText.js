/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Matcher'],function(q,M){"use strict";return M.extend("sap.ui.test.matchers.I18NText",{metadata:{publicMethods:["isMatching"],properties:{propertyName:{type:"string"},key:{type:"string"},parameters:{type:"any"},modelName:{type:"string",defaultValue:"i18n"}}},isMatching:function(c){var k=this.getKey(),p=this.getPropertyName(),P=this.getParameters(),m=this.getModelName(),o=c.getModel(m),b,f=c["get"+q.sap.charToUpperCase(p,0)],s,t,r;if(!o){this._oLogger.debug("The '"+c+"' has no model with name '"+m+"'");return false;}if(!o.getResourceBundle){this._oLogger.debug("The model '"+o+"' is not a valid resource model");return false;}b=o.getResourceBundle();if(b instanceof Promise){if(o._oResourceBundle instanceof Object&&o._oResourceBundle.getText){b=o._oResourceBundle;}else{this._oLogger.debug("The model '"+m+"' of '"+c+"' is in async mode and not loaded yet");return false;}}if(!f){this._oLogger.debug("The '"+c+"' has no '"+p+"' property");return false;}s=f.call(c);t=b.getText(k,P);if(t===k){var a="No value for the key '"+k+"' in the model '"+m+"' of '"+c+"'";this._oLogger.debug(a);return false;}r=s===t;if(!r){this._oLogger.debug("The text '"+t+"' does not match the value '"+s+"' of the '"+p+"' property for '"+c+"'");}return r;}});},true);

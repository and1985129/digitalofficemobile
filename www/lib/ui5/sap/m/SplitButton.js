/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','./Button','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool'],function(q,l,C,B,E,I){"use strict";var S=C.extend("sap.m.SplitButton",{metadata:{library:"sap.m",properties:{text:{type:"string",group:"Misc",defaultValue:null},type:{type:"sap.m.ButtonType",group:"Appearance",defaultValue:sap.m.ButtonType.Default},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},activeIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconDensityAware:{type:"boolean",group:"Misc",defaultValue:true},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit}},aggregations:{_textButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_arrowButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{press:{},arrowPress:{}}}});E.call(S.prototype);S.prototype.exit=function(){if(this._oInvisibleTooltipInfoLabel){this._oInvisibleTooltipInfoLabel.destroy();this._oInvisibleTooltipInfoLabel=null;}};S.prototype.onAfterRendering=function(){var $=this._getTextButton().$(),a=this._getArrowButton().$();$.attr("tabindex","-1");a.attr("tabindex","-1");$.removeAttr("title");a.removeAttr("title");$.removeAttr("aria-describedby");a.removeAttr("aria-describedby");};S.prototype._handleAction=function(i){if(i){this.fireArrowPress();}else{this.firePress();}};S.prototype.setArrowState=function(i){var a=this.getAggregation("_arrowButton");if(!a){return;}if(i){a.$().addClass('sapMSBActive');}else{a.$().removeClass('sapMSBActive');}};S.prototype._getTextButton=function(){var c=this.getAggregation("_textButton");if(!c){c=new B({width:'100%',icon:this.getIcon(),text:this.getText(),press:this._handleAction.bind(this,false)}).addStyleClass('sapMSBText');if(sap.ui.Device.browser.msie){c.addStyleClass('sapMSBTextIE');}this.setAggregation("_textButton",c);}return c;};S.prototype._getArrowButton=function(){var c=this.getAggregation("_arrowButton");if(!c){c=new B({icon:"sap-icon://slim-arrow-down",press:this._handleAction.bind(this,true)}).addStyleClass("sapMSBArrow");this.setAggregation("_arrowButton",c);}return c;};S.prototype.setTooltip=function(t){var T;C.prototype.setTooltip.apply(this,arguments);T=this.getTooltip_AsString();this.getTooltipInfoLabel(T);return this;};S.prototype.setProperty=function(p,v,s){if(p==="type"&&(v===sap.m.ButtonType.Up||v===sap.m.ButtonType.Back||v===sap.m.ButtonType.Unstyled)){return this;}var r=C.prototype.setProperty.apply(this,arguments);if(p==="activeIcon"||p==="iconDensityAware"||p==="textDirection"){B.prototype.setProperty.apply(this._getTextButton(),arguments);}else if(p==="text"||p==="type"||p==="icon"){var a="set"+_(p);B.prototype[a].call(this._getTextButton(),v);if(p==="type"){B.prototype[a].call(this._getArrowButton(),v);}}return r;};function _(t){return t.charAt(0).toUpperCase()+t.slice(1);}S.prototype.onsapenter=function(e){this._getTextButton().firePress();};S.prototype.onsapspace=function(e){this._getTextButton().firePress();};S.prototype.onsapup=function(e){this._getArrowButton().firePress();};S.prototype.onsapdown=function(e){this._getArrowButton().firePress();};S.prototype.onsapupmodifiers=function(e){this._getArrowButton().firePress();};S.prototype.onsapdownmodifiers=function(e){this._getArrowButton().firePress();};S.prototype.onsapshow=function(e){this._getArrowButton().firePress();e.preventDefault();};S.prototype.getSplitButtonAriaLabel=function(){var r,t;if(!sap.m.SplitButton._oStaticSplitButtonAriaLabel){r=sap.ui.getCore().getLibraryResourceBundle("sap.m");t=r.getText("SPLIT_BUTTON_DESCRIPTION");sap.m.SplitButton._oStaticSplitButtonAriaLabel=new sap.ui.core.InvisibleText({text:t});sap.m.SplitButton._oStaticSplitButtonAriaLabel.toStatic();}return sap.m.SplitButton._oStaticSplitButtonAriaLabel;};S.prototype.getKeyboardDescriptionAriaLabel=function(){var r,t;if(!sap.m.SplitButton._oStaticSplitButtonDescription){r=sap.ui.getCore().getLibraryResourceBundle("sap.m");t=r.getText("SPLIT_BUTTON_KEYBOARD_HINT");sap.m.SplitButton._oStaticSplitButtonDescription=new sap.ui.core.InvisibleText({text:t});sap.m.SplitButton._oStaticSplitButtonDescription.toStatic();}return sap.m.SplitButton._oStaticSplitButtonDescription;};S.prototype.getButtonTypeAriaLabel=function(){var t,b=this._getTextButton().getType();switch(b){case sap.m.ButtonType.Accept:t=sap.m.Button._oStaticAcceptText;break;case sap.m.ButtonType.Reject:t=sap.m.Button._oStaticRejectText;break;case sap.m.ButtonType.Emphasized:t=sap.m.Button._oStaticEmphasizedText;break;}return t;};S.prototype.getTooltipInfoLabel=function(t){if(!this._oInvisibleTooltipInfoLabel){this._oInvisibleTooltipInfoLabel=new sap.ui.core.InvisibleText();this._oInvisibleTooltipInfoLabel.toStatic();}this._oInvisibleTooltipInfoLabel.setText(t);return this._oInvisibleTooltipInfoLabel;};S.prototype.getTitleAttributeValue=function(){var t=this.getTooltip_AsString(),i=I.getIconInfo(this.getIcon()),r;if(t||(i&&i.text&&!this.getText())){r=t||i.text;}return r;};return S;},false);

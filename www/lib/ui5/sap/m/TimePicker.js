/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./InputBase','./MaskInput','./MaskInputRule','./ResponsivePopover','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool','sap/ui/model/type/Time','./TimePickerSliders'],function(q,I,M,a,R,E,b,T,c){"use strict";var d=M.extend("sap.m.TimePicker",{metadata:{library:"sap.m",properties:{displayFormat:{type:"string",group:"Appearance",defaultValue:null},valueFormat:{type:"string",group:"Data",defaultValue:null},localeId:{type:"string",group:"Data"},dateValue:{type:"object",group:"Data",defaultValue:null},title:{type:"string",group:"Misc",defaultValue:null},minutesStep:{type:"int",group:"Misc",defaultValue:1},secondsStep:{type:"int",group:"Misc",defaultValue:1}},aggregations:{_picker:{type:"sap.m.ResponsivePopover",multiple:false,visibility:"hidden"}}}});b.insertFontFaceStyle();E.call(d.prototype,true);var e={Short:"short",Medium:"medium",Long:"long"},f={Hour:"hour",Minute:"minute",Second:"second"},P='-';d.prototype.init=function(){M.prototype.init.apply(this,arguments);this.setDisplayFormat(h());this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._bValid=false;this._sUsedDisplayPattern=null;this._sUsedValuePattern=null;this._oDisplayFormat=null;this._sValueFormat=null;this._oPopoverKeydownEventDelegate=null;this._rPlaceholderRegEx=new RegExp(P,'g');this._sLastChangeValue=null;};d.prototype.exit=function(){if(this._oTimeSemanticMaskHelper){this._oTimeSemanticMaskHelper.destroy();}M.prototype.exit.apply(this,arguments);this._removePickerEvents();this._oResourceBundle=null;this._bValid=false;this._sUsedDisplayPattern=null;this._oDisplayFormat=null;this._oPopoverKeydownEventDelegate=null;this._sUsedValuePattern=null;this._sValueFormat=null;this._sLastChangeValue=null;};d.prototype.onBeforeRendering=function(){M.prototype.onBeforeRendering.apply(this,arguments);};d.prototype.ontap=function(o){var i,p;if(!(this.getEditable()&&this.getEnabled())){return;}i=q(o.target).hasClass("sapUiIcon");p=this._getPicker()&&this._getPicker().isOpen();if(!p&&i){this._openPicker();}else if(i&&!sap.ui.Device.system.phone){this._closePicker();}};d.prototype.onfocusin=function(o){var p=this._getPicker();var i=q(o.target).hasClass("sapUiIcon");M.prototype.onfocusin.apply(this,arguments);if(p&&p.isOpen()&&!i){this._closePicker();}};d.prototype.oninput=function(o){M.prototype.oninput.apply(this,arguments);};d.prototype.onfocusout=function(o){M.prototype.onfocusout.apply(this,arguments);};d.prototype.onBeforeOpen=function(){var s=this._getSliders();s.setTimeValues(this.getDateValue());s.collapseAll();this.$().addClass("sapMTPInputActive");};d.prototype.onAfterOpen=function(){var s=this._getSliders();if(s){s._initFocus();this._handleAriaOnExpandCollapse();}};d.prototype.onAfterClose=function(){this.$().removeClass("sapMTPInputActive");this._handleAriaOnExpandCollapse();};d.prototype._handleInputChange=function(v){var D;v=v||this._$input.val();this._bValid=true;if(v!==""){D=this._parseValue(v,true);if(!D){this._bValid=false;}else{v=this._formatValue(D);}}if(this.isActive()&&(this._$input.val()!==v)){this.updateDomValue(v);if(this.bShowLabelAsPlaceholder){this.$("placeholder").css("display",v?"none":"inline");}}if(D){v=this._formatValue(D,true);}this.setProperty("value",v,true);if(this._bValid){this.setProperty("dateValue",D,true);}this.fireChangeEvent(v,{valid:this._bValid});return true;};d.prototype.onChange=function(o){var v=o?o.value:null;if(this.getEditable()&&this.getEnabled()){return this._handleInputChange(v);}return false;};d.prototype.setMinutesStep=function(s){var S=this._getSliders();if(S){S.setMinutesStep(s);}return this.setProperty("minutesStep",s,true);};d.prototype.setSecondsStep=function(s){var S=this._getSliders();if(S){S.setSecondsStep(s);}return this.setProperty("secondsStep",s,true);};d.prototype.setTitle=function(t){var s=this._getSliders();if(s){s.setLabelText(t);}this.setProperty("title",t,true);return this;};d.prototype.setValueFormat=function(v){var V=this.getValue(),D;this.setProperty("valueFormat",v,true);if(V){D=this._parseValue(V);if(!D){this._bValid=false;q.sap.log.warning("Value can not be converted to a valid date",this);}else{this._bValid=true;this.setProperty("dateValue",D,true);V=this._formatValue(D);if(this.isActive()){this._synchronizeInput(V);}else{this.setProperty("value",V,true);this._sLastChangeValue=V;}}}return this;};d.prototype.setDisplayFormat=function(D){var o,i;this.setProperty("displayFormat",D,true);this._initMask();i=this.getDateValue();if(!i){return this;}o=this._formatValue(i);if(this.isActive()){this._synchronizeInput(o);}return this;};d.prototype.setValue=function(v){var D,o;v=this.validateProperty('value',v);this._initMask();M.prototype.setValue.call(this,v);this._sLastChangeValue=v;this._bValid=true;if(v){D=this._parseValue(v);if(!D){this._bValid=false;q.sap.log.warning("Value can not be converted to a valid date",this);}}if(this._bValid){this.setProperty("dateValue",D,true);}if(D){o=this._formatValue(D);}else{o=v;}if(this.isActive()){this._synchronizeInput(o);}return this;};d.prototype.setDateValue=function(D){var v;if(D&&!(D instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}if(q.sap.equal(this.getDateValue(),D)){return this;}this._bValid=true;this.setProperty("dateValue",D,true);v=this._formatValue(D,true);this.setProperty("value",v,true);this._sLastChangeValue=v;if(this.isActive()){v=this._formatValue(D);if(this._$input.val()!==v){this.updateDomValue(v);}}return this;};d.prototype.setLocaleId=function(l){var C=this.getValue();this.setProperty("localeId",l,true);this._initMask();this._oDisplayFormat=null;this._sValueFormat=null;if(C){this.setValue(C);}return this;};d.prototype.getPlaceholder=function(){var p=this.getProperty("placeholder");if(!p){p=this._getFormat();}return p;};d.prototype._getFormat=function(){var F=this._getDisplayFormatPattern();if(!F){F=e.Medium;}if(Object.keys(e).indexOf(F)!==-1){F=h();}return F;};d.prototype.onsappageup=function(o){this._increaseTime(1,f.Hour);o.preventDefault();};d.prototype.onsappageupmodifiers=function(o){if(!(o.ctrlKey||o.metaKey||o.altKey)&&o.shiftKey){this._increaseTime(1,f.Minute);}if(!o.altKey&&o.shiftKey&&(o.ctrlKey||o.metaKey)){this._increaseTime(1,f.Second);}o.preventDefault();};d.prototype.onsappagedown=function(o){this._increaseTime(-1,f.Hour);o.preventDefault();};d.prototype.onsappagedownmodifiers=function(o){if(!(o.ctrlKey||o.metaKey||o.altKey)&&o.shiftKey){this._increaseTime(-1,f.Minute);}if(!o.altKey&&o.shiftKey&&(o.ctrlKey||o.metaKey)){this._increaseTime(-1,f.Second);}o.preventDefault();};d.prototype.onkeydown=function(o){var k=q.sap.KeyCodes,K=o.which||o.keyCode,A=o.altKey,p;if(K===k.F4||(A&&(K===k.ARROW_UP||K===k.ARROW_DOWN))){p=this._getPicker()&&this._getPicker().isOpen();if(!p){this._openPicker();}else{this._closePicker();}o.preventDefault();}else{M.prototype.onkeydown.call(this,o);}};d.prototype._getPicker=function(){return this.getAggregation("_picker");};d.prototype._removePickerEvents=function(){var p,o=this._getPicker();if(o){p=o.getAggregation("_popup");if(typeof this._oPopoverKeydownEventDelegate==='function'){p.removeEventDelegate(this._oPopoverKeydownEventDelegate);}}};d.prototype._openPicker=function(){var p=this._getPicker(),s;if(!p){p=this._createPicker(this._getDisplayFormatPattern());}p.open();s=this._getSliders();q.sap.delayedCall(0,s,s.updateSlidersValues);return p;};d.prototype._closePicker=function(){var p=this._getPicker();if(p){p.close();}else{q.sap.log.warning("There is no picker to close.");}return p;};d.prototype._synchronizeInput=function(v){if((this._$input.val()!==v)){this.updateDomValue(v);}};d.prototype._createPicker=function(F){var t=this,p,o,r,O,C,s;r=sap.ui.getCore().getLibraryResourceBundle("sap.m");O=r.getText("TIMEPICKER_SET");C=r.getText("TIMEPICKER_CANCEL");s=this.getTitle();o=new R(t.getId()+"-RP",{showCloseButton:false,showHeader:false,horizontalScrolling:false,verticalScrolling:false,placement:sap.m.PlacementType.VerticalPreferedBottom,beginButton:new sap.m.Button({text:O,press:q.proxy(this._handleOkPress,this)}),endButton:new sap.m.Button({text:C,press:q.proxy(this._handleCancelPress,this)}),content:[new c(this.getId()+"-sliders",{format:F,labelText:s?s:"",invokedBy:t.getId(),minutesStep:this.getMinutesStep(),secondsStep:this.getSecondsStep()})],contentHeight:d._PICKER_CONTENT_HEIGHT});p=o.getAggregation("_popup");if(p.setShowArrow){p.setShowArrow(false);}p.oPopup.setAutoCloseAreas([this.getDomRef("icon")]);o.addStyleClass(this.getRenderer().CSS_CLASS+"DropDown").attachBeforeOpen(this.onBeforeOpen,this).attachAfterOpen(this.onAfterOpen,this).attachAfterClose(this.onAfterClose,this);o.open=function(){return this.openBy(t);};if(sap.ui.Device.system.desktop){this._oPopoverKeydownEventDelegate={onkeydown:function(i){var k=q.sap.KeyCodes,K=i.which||i.keyCode,A=i.altKey;if((A&&(K===k.ARROW_UP||K===k.ARROW_DOWN))||K===k.F4){this._handleOkPress(i);this.focus();i.preventDefault();}}};p.addEventDelegate(this._oPopoverKeydownEventDelegate,this);p._afterAdjustPositionAndArrowHook=function(){t._getSliders()._onOrientationChanged();};}this.setAggregation("_picker",o,true);return o;};d.prototype._getSliders=function(){var p=this._getPicker();if(!p){return null;}return p.getContent()[0];};d.prototype._handleOkPress=function(o){var D=this._getSliders().getTimeValues(),v=this._formatValue(D);this.updateDomValue(v);this._handleInputChange();this._closePicker();};d.prototype._handleCancelPress=function(o){this._closePicker();};d.prototype._parseValue=function(v,D){var F=this._getFormatter(D);if(D){v=this._oTimeSemanticMaskHelper.stripValueOfLeadingSpaces(v);v=v.replace(this._rPlaceholderRegEx,'');}return F.parse(v);};d.prototype._formatValue=function(D,v){var V="",F;if(D){F=this._getFormatter(!v);V=F.format(D);if(!v&&this._oTimeSemanticMaskHelper){V=this._oTimeSemanticMaskHelper.formatValueWithLeadingTrailingSpaces(V);}}return V;};d.prototype._handleAriaOnExpandCollapse=function(){this.getFocusDomRef().setAttribute("aria-expanded",this._getPicker().isOpen());};d.prototype._increaseTime=function(n,u){var o=this.getDateValue(),D,m;if(o&&this.getEditable()&&this.getEnabled()){D=new Date(o.getTime());switch(u){case f.Hour:D.setHours(D.getHours()+n);m=60*60*1000;break;case f.Minute:D.setMinutes(D.getMinutes()+n);m=60*1000;break;case f.Second:m=1000;D.setSeconds(D.getSeconds()+n);}if(n<0&&D.getTime()-o.getTime()!==n*m){D=new Date(o.getTime()+n*m);}this.setDateValue(D);this.fireChangeEvent(this.getValue(),{valid:true});}};d.prototype._getFormatter=function(D){var p="",r=false,F,B=this.getBinding("value");if(B&&B.oType&&(B.oType instanceof T)){p=B.oType.getOutputPattern();r=!!B.oType.oOutputFormat.oFormatOptions.relative;}if(!p){if(D){p=(this.getDisplayFormat()||e.Medium);}else{p=(this.getValueFormat()||e.Medium);}}if(D){if(p===this._sUsedDisplayPattern){F=this._oDisplayFormat;}}else{if(p===this._sUsedValuePattern){F=this._sValueFormat;}}if(F){return F;}if(p===e.Short||p===e.Medium||p===e.Long){F=sap.ui.core.format.DateFormat.getTimeInstance({style:p,strictParsing:true,relative:r},new sap.ui.core.Locale(this.getLocaleId()));}else{F=sap.ui.core.format.DateFormat.getTimeInstance({pattern:p,strictParsing:true,relative:r},new sap.ui.core.Locale(this.getLocaleId()));}if(D){this._sUsedDisplayPattern=p;this._oDisplayFormat=F;}else{this._sUsedValuePattern=p;this._sValueFormat=F;}return F;};d.prototype._initMask=function(){if(this._oTimeSemanticMaskHelper){this._oTimeSemanticMaskHelper.destroy();}this._oTimeSemanticMaskHelper=new g(this);};d.prototype.fireChangeEvent=function(v,p){if(v){v=v.trim();}if(v!==this._sLastChangeValue){this._sLastChangeValue=v;I.prototype.fireChangeEvent.call(this,v,p);}};var g=function(t){var D=t._getDisplayFormatPattern(),m=D,A,l=t.getLocaleId()||sap.ui.getCore().getConfiguration().getFormatLocale(),L=new sap.ui.core.Locale(l),i;t.setProperty("localeId",l,true);this._oTimePicker=t;this.aOriginalAmPmValues=sap.ui.core.LocaleData.getInstance(L).getDayPeriods("abbreviated");this.aAmPmValues=this.aOriginalAmPmValues.slice(0);this.iAmPmValueMaxLength=Math.max(this.aAmPmValues[0].length,this.aAmPmValues[1].length);for(i=0;i<this.aAmPmValues.length;i++){while(this.aAmPmValues[i].length<this.iAmPmValueMaxLength){this.aAmPmValues[i]+=" ";}}this.b24H=D.indexOf("H")!==-1;this.bLeadingZero=D.indexOf("HH")!==-1||D.indexOf("hh")!==-1;this.sLeadingChar=this.bLeadingZero?"0":" ";this.sAlternativeLeadingChar=this.bLeadingZero?" ":"0";this.sLeadingRegexChar=this.bLeadingZero?"0":"\\s";t.setPlaceholderSymbol(P);m=m.replace(/hh/ig,"h").replace(/h/ig,"h9");if(this.b24H){A="["+this.sLeadingRegexChar+"012]";}else{A="["+this.sLeadingRegexChar+"1]";}this._maskRuleHours=new a({maskFormatSymbol:"h",regex:A});t.addRule(this._maskRuleHours);this.iHourNumber1Index=m.indexOf("h9");this.iHourNumber2Index=this.iHourNumber1Index!==-1?this.iHourNumber1Index+1:-1;this.iMinuteNumber1Index=m.indexOf("mm");m=m.replace(/mm/g,"59");this.iSecondNumber1Index=m.indexOf("ss");m=m.replace(/ss/g,"59");this._maskRuleMinSec=new a({maskFormatSymbol:"5",regex:"[0-5]"});t.addRule(this._maskRuleMinSec);this.aAllowedHours=p.call(this,this.b24H,this.sLeadingChar);this.aAllowedMinutesAndSeconds=r.call(this);this.iAmPmChar1Index=m.indexOf("a");this.iAfterAmPmValueIndex=-1;if(this.iAmPmChar1Index!==-1){this.iAfterAmPmValueIndex=this.iAmPmChar1Index+this.iAmPmValueMaxLength;var C=this.iAmPmValueMaxLength-"a".length;this.shiftIndexes(C);var j=65;var s="";var k="";var n="";for(i=0;i<this.iAmPmValueMaxLength;i++){k="[";if(this.aAmPmValues[0][i]){k+=this.aAmPmValues[0][i];}else{k+="\\s";}if(this.aAmPmValues[1][i]!==this.aAmPmValues[0][i]){if(this.aAmPmValues[1][i]){k+=this.aAmPmValues[1][i];}else{k+="\\s";}}k+="]";n=String.fromCharCode(j++);s+=n;this._maskRuleChars=new a({maskFormatSymbol:n,regex:k});t.addRule(this._maskRuleChars);}m=m.replace(/a/g,s);}t.setMask(m);function o(S,u,v){var w=[],x,i;for(i=S;i<=u;i++){x=i.toString();if(i<10){x=v+x;}w.push(x);}return w;}function p(u,v){var S=u?0:1,w=u?23:12;return o(S,w,v);}function r(){return o(0,59,"0");}};g.prototype.replaceChar=function(C,p,s){var A=p-this.iAmPmChar1Index,j,k,l,S,m,n,i;if(p===this.iHourNumber1Index&&this.sAlternativeLeadingChar===C){if(this.aAllowedHours.indexOf(this.sLeadingChar+C)!==-1){return this.sLeadingChar+C;}else{return this.sLeadingChar;}}else if(p===this.iHourNumber1Index&&!this._oTimePicker._isCharAllowed(C,p)&&this.aAllowedHours.indexOf(this.sLeadingChar+C)!==-1){return this.sLeadingChar+C;}else if(p===this.iHourNumber2Index&&this.aAllowedHours.indexOf(s[this.iHourNumber1Index]+C)===-1){return"";}else if((p===this.iMinuteNumber1Index||p===this.iSecondNumber1Index)&&!this._oTimePicker._isCharAllowed(C,p)&&this.aAllowedMinutesAndSeconds.indexOf("0"+C)!==-1){return"0"+C;}else if(A>=0&&p<this.iAfterAmPmValueIndex){j=s.slice(this.iAmPmChar1Index,p);k=this.aAmPmValues[0].slice(0,A);l=this.aAmPmValues[1].slice(0,A);m=this.aAmPmValues[0].slice(A,this.iAfterAmPmValueIndex);n=this.aAmPmValues[1].slice(A,this.iAfterAmPmValueIndex);S=(k===l);var o="";for(i=A;i<this.iAmPmValueMaxLength;i++){if(this.aAmPmValues[0][i]===this.aAmPmValues[1][i]){o+=this.aAmPmValues[0][i];}else{break;}}if(i===this.iAmPmValueMaxLength||i!==A){return o;}else{if(!S){if(j===k){return m;}else if(j===l){return n;}else{return C;}}else{if(this.aAmPmValues[0][A].toLowerCase()===C.toLowerCase()&&this.aAmPmValues[0]===j+m){return m;}else if(this.aAmPmValues[1][A].toLowerCase()===C.toLowerCase()&&this.aAmPmValues[1]===j+n){return n;}else{return C;}}}}else{return C;}};g.prototype.formatValueWithLeadingTrailingSpaces=function(v){var m=this._oTimePicker.getMask().length;if(this.aOriginalAmPmValues[0]!==this.aAmPmValues[0]){v=v.replace(this.aOriginalAmPmValues[0],this.aAmPmValues[0]);}if(this.aOriginalAmPmValues[1]!==this.aAmPmValues[1]){v=v.replace(this.aOriginalAmPmValues[1],this.aAmPmValues[1]);}while(m>v.length){v=[v.slice(0,this.iHourNumber1Index)," ",v.slice(this.iHourNumber1Index)].join('');}return v;};g.prototype.stripValueOfLeadingSpaces=function(v){if(v[this.iHourNumber1Index]===" "){v=[v.slice(0,this.iHourNumber1Index),v.slice(this.iHourNumber1Index+1)].join('');}return v;};g.prototype.shiftIndexes=function(s){if(this.iAmPmChar1Index<this.iHourNumber1Index){this.iHourNumber1Index+=s;this.iHourNumber2Index+=s;}if(this.iAmPmChar1Index<this.iMinuteNumber1Index){this.iMinuteNumber1Index+=s;}if(this.iAmPmChar1Index<this.iSecondNumber1Index){this.iSecondNumber1Index+=s;}};g.prototype.destroy=function(){if(this._maskRuleHours){this._maskRuleHours.destroy();this._maskRuleHours=null;}if(this._maskRuleMinSec){this._maskRuleMinSec.destroy();this._maskRuleMinSec=null;}if(this._maskRuleChars){this._maskRuleChars.destroy();this._maskRuleChars=null;}};d.prototype._feedReplaceChar=function(C,p,s){return this._oTimeSemanticMaskHelper.replaceChar(C,p,s);};d.prototype.getAccessibilityInfo=function(){var r=this.getRenderer();var i=M.prototype.getAccessibilityInfo.apply(this,arguments);var v=this.getValue()||"";if(this._bValid){var D=this.getDateValue();if(D){v=this._formatValue(D);}}i.role="combobox";i.type=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_TIMEINPUT");i.description=[v,r.getLabelledByAnnouncement(this),r.getDescribedByAnnouncement(this)].join(" ").trim();return i;};function h(){var l=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),L=sap.ui.core.LocaleData.getInstance(l);return L.getTimePattern(e.Medium);}d.prototype._getDisplayFormatPattern=function(){var B=this.getBinding("value");if(B&&B.oType&&(B.oType instanceof T)){return B.oType.getOutputPattern();}return this.getDisplayFormat();};d._PICKER_CONTENT_HEIGHT="25rem";return d;},true);

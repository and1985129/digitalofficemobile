/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/LocaleData','sap/ui/model/type/Date','sap/ui/unified/calendar/CalendarUtils','./calendar/Header','./calendar/Month','./calendar/MonthPicker','./calendar/YearPicker','sap/ui/core/date/UniversalDate','./library'],function(q,C,L,D,a,H,M,b,Y,U,l){"use strict";var c=C.extend("sap.ui.unified.Calendar",{metadata:{library:"sap.ui.unified",properties:{intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},singleSelection:{type:"boolean",group:"Behavior",defaultValue:true},months:{type:"int",group:"Appearance",defaultValue:1},firstDayOfWeek:{type:"int",group:"Appearance",defaultValue:-1},nonWorkingDays:{type:"int[]",group:"Appearance",defaultValue:null},primaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance",defaultValue:null},secondaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},minDate:{type:"object",group:"Misc",defaultValue:null},maxDate:{type:"object",group:"Misc",defaultValue:null}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},disabledDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"disabledDate"},header:{type:"sap.ui.unified.calendar.Header",multiple:false,visibility:"hidden"},month:{type:"sap.ui.unified.calendar.Month",multiple:true,visibility:"hidden"},monthPicker:{type:"sap.ui.unified.calendar.MonthPicker",multiple:false,visibility:"hidden"},yearPicker:{type:"sap.ui.unified.calendar.YearPicker",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{},cancel:{},startDateChange:{}}}});c.prototype.init=function(){this._iBreakPointTablet=sap.ui.Device.media._predefinedRangeSets[sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0];this._iBreakPointDesktop=sap.ui.Device.media._predefinedRangeSets[sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[1];this._iBreakPointLargeDesktop=sap.ui.Device.media._predefinedRangeSets[sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[2];var i=sap.ui.getCore().getConfiguration().getCalendarType();this.setProperty("primaryCalendarType",i);this.setProperty("secondaryCalendarType",i);this._iMode=0;this._oYearFormat=sap.ui.core.format.DateFormat.getDateInstance({format:"y",calendarType:i});this.data("sap-ui-fastnavgroup","true",true);this._oMinDate=this._newUniversalDate(new Date(Date.UTC(1,0,1)));this._oMinDate.getJSDate().setUTCFullYear(1);this._oMaxDate=this._newUniversalDate(new Date(Date.UTC(9999,11,31)));var E=new H(this.getId()+"--Head");E.attachEvent("pressPrevious",this._handlePrevious,this);E.attachEvent("pressNext",this._handleNext,this);E.attachEvent("pressButton1",p,this);E.attachEvent("pressButton2",r,this);this.setAggregation("header",E);var F=this._createMonth(this.getId()+"--Month0");F.attachEvent("focus",u,this);F.attachEvent("select",t,this);F.attachEvent("_renderMonth",s,this);F.attachEvent("_bindMousemove",v,this);F.attachEvent("_unbindMousemove",w,this);F._bNoThemeChange=true;this.addAggregation("month",F);var G=new b(this.getId()+"--MP");G.attachEvent("select",x,this);G._bNoThemeChange=true;this.setAggregation("monthPicker",G);var I=new Y(this.getId()+"--YP");I.attachEvent("select",y,this);this.setAggregation("yearPicker",I);this._resizeProxy=q.proxy(A,this);this._oSelectedDay=undefined;};c.prototype.exit=function(){if(this._sInvalidateMonth){q.sap.clearDelayedCall(this._sInvalidateMonth);}if(this._sResizeListener){sap.ui.core.ResizeHandler.deregister(this._sResizeListener);this._sResizeListener=undefined;}};c.prototype._createMonth=function(i){var E=new M(i,{width:"100%"});return E;};c.prototype.onBeforeRendering=function(){var E=this.getAggregation("month");var F;var G=E[0].getDate();var I=this._getFocusedDate();if(E.length>1&&G){F=a._createUniversalUTCDate(G,this.getPrimaryCalendarType());}else if(E.length>1){F=B.call(this,this._getFocusedDate());}else{F=I;}for(var i=0;i<E.length;i++){G=this._newUniversalDate(F);if(i>0){G.setUTCDate(1);G.setUTCMonth(G.getUTCMonth()+i);}var J=G;if(I.getUTCFullYear()==G.getUTCFullYear()&&I.getUTCMonth()==G.getUTCMonth()){J=I;}E[i].displayDate(a._createLocalDate(J));}this._updateHeader(F);this._iSize=0;};c.prototype.onAfterRendering=function(E){j.call(this);if(o.call(this)>1||this._bInitMonth){E.size={width:this.getDomRef().offsetWidth};A.call(this,E,true);if(!this._sResizeListener){this._sResizeListener=sap.ui.core.ResizeHandler.register(this,this._resizeProxy);}this._bInitMonth=undefined;}};c.prototype.invalidate=function(O){if(!this._bDateRangeChanged&&(!O||!(O instanceof sap.ui.unified.DateRange))){C.prototype.invalidate.apply(this,arguments);}else if(this.getDomRef()&&this._iMode==0&&!this._sInvalidateMonth){this._sInvalidateMonth=q.sap.delayedCall(0,this,z,[this]);}};c.prototype.removeAllSelectedDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("selectedDates");return R;};c.prototype.destroySelectedDates=function(){this._bDateRangeChanged=true;var i=this.destroyAggregation("selectedDates");return i;};c.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("specialDates");return R;};c.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;var i=this.destroyAggregation("specialDates");return i;};c.prototype.getSpecialDates=function(){var P=this.getParent();if(P&&P.getSpecialDates){return P.getSpecialDates();}else{return this.getAggregation("specialDates",[]);}};c.prototype.removeAllDisabledDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("disabledDates");return R;};c.prototype.destroyDisabledDates=function(){this._bDateRangeChanged=true;var i=this.destroyAggregation("disabledDates");return i;};c.prototype.setLocale=function(i){if(this._sLocale!=i){this._sLocale=i;this._oLocaleData=undefined;this.invalidate();}return this;};c.prototype.getLocale=function(){if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;};c.prototype._getFocusedDate=function(){if(!this._oFocusedDate){d.call(this);}return this._oFocusedDate;};c.prototype._setFocusedDate=function(i){if(!(i instanceof U)){throw new Error("Date must be a UniversalDate object "+this);}this._oFocusedDate=this._newUniversalDate(i);};c.prototype.focusDate=function(i){n.call(this,i,false);return this;};c.prototype.displayDate=function(i){n.call(this,i,true);return this;};c.prototype.getStartDate=function(){var S;if(this.getDomRef()){var i=this.getAggregation("month");S=a._createUniversalUTCDate(i[0].getDate(),this.getPrimaryCalendarType());}else{S=this._newUniversalDate(this._getFocusedDate());}S.setUTCDate(1);return a._createLocalDate(S);};c.prototype.setPopupMode=function(P){this._bPoupupMode=P;return this;};c.prototype.setMonths=function(E){this._bDateRangeChanged=undefined;this.setProperty("months",E,false);E=o.call(this);var F=this.getAggregation("month");var i=0;var G;if(F.length<E){for(i=F.length;i<E;i++){G=this._createMonth(this.getId()+"--Month"+i);G.attachEvent("focus",u,this);G.attachEvent("select",t,this);G.attachEvent("_renderMonth",s,this);G.attachEvent("_bindMousemove",v,this);G.attachEvent("_unbindMousemove",w,this);G._bNoThemeChange=true;this.addAggregation("month",G);}}else if(F.length>E){for(i=F.length;i>E;i--){G=this.removeAggregation("month",i-1);G.destroy();}if(E==1){this._bInitMonth=true;}}if(E>1&&F[0].getDate()){F[0].setProperty("date",null,true);}return this;};c.prototype.setPrimaryCalendarType=function(E){var F=this.getAggregation("month");var R=false;if(F.length>1){R=true;}this.setProperty("primaryCalendarType",E,!R);this._oYearFormat=sap.ui.core.format.DateFormat.getDateInstance({format:"y",calendarType:E});if(this._oFocusedDate){this._oFocusedDate=U.getInstance(this._oFocusedDate.getJSDate(),E);}this._oMinDate=U.getInstance(this._oMinDate.getJSDate(),E);this._oMaxDate=U.getInstance(this._oMaxDate.getJSDate(),E);for(var i=0;i<F.length;i++){var G=F[i];G.setPrimaryCalendarType(E);}var I=this.getAggregation("monthPicker");I.setPrimaryCalendarType(E);var J=this.getAggregation("yearPicker");J.setPrimaryCalendarType(E);if(this.getDomRef()){this._updateHeader(this._oFocusedDate);if(this.iMode!=1&&I.getDomRef()){I.$().remove();}if(this.iMode!=2&&J.getDomRef()){J.$().remove();}}return this;};c.prototype._newUniversalDate=function(i){var J;if((i instanceof U)){J=new Date(i.getJSDate().getTime());}else{J=new Date(i.getTime());}return U.getInstance(J,this.getPrimaryCalendarType());};c.prototype.setSecondaryCalendarType=function(E){this._bSecondaryCalendarTypeSet=true;this.setProperty("secondaryCalendarType",E,true);this._oYearFormatSecondary=sap.ui.core.format.DateFormat.getDateInstance({format:"y",calendarType:E});var F=this.getAggregation("month");for(var i=0;i<F.length;i++){var G=F[i];G.setSecondaryCalendarType(E);}if(this.getDomRef()){this._updateHeader(this._getFocusedDate());this.$().toggleClass("sapUiCalSecType",!!this._getSecondaryCalendarType());}return this;};c.prototype._getSecondaryCalendarType=function(){var S;if(this._bSecondaryCalendarTypeSet){S=this.getSecondaryCalendarType();var P=this.getPrimaryCalendarType();if(S==P){S=undefined;}}return S;};c.prototype.setMinDate=function(i){if(q.sap.equal(i,this.getMinDate())){return this;}if(!i){this._oMinDate.getJSDate().setUTCFullYear(1);this._oMinDate.getJSDate().setUTCMonth(0);this._oMinDate.getJSDate().setUTCDate(1);}else{if(!(i instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}this._oMinDate=a._createUniversalUTCDate(i,this.getPrimaryCalendarType());var E=this._oMinDate.getUTCFullYear();if(E<1||E>9999){throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); "+this);}if(this._oMaxDate.getTime()<this._oMinDate.getTime()){q.sap.log.warning("minDate > maxDate -> maxDate set to end of the month",this);this._oMaxDate=a._createUniversalUTCDate(i,this.getPrimaryCalendarType());this._oMaxDate.setUTCMonth(this._oMaxDate.getUTCMonth()+1,0);this.setProperty("maxDate",a._createLocalDate(this._oMaxDate),true);}this._setMinMaxDateExtend(i);}this.setProperty("minDate",i,false);var F=this.getAggregation("yearPicker");F._oMinDate.setUTCFullYear(this._oMinDate.getUTCFullYear());return this;};c.prototype.setMaxDate=function(i){if(q.sap.equal(i,this.getMaxDate())){return this;}if(!i){this._oMaxDate.getJSDate().setUTCFullYear(9999);this._oMaxDate.getJSDate().setUTCMonth(11);this._oMaxDate.getJSDate().setUTCDate(31);}else{if(!(i instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}this._oMaxDate=a._createUniversalUTCDate(i,this.getPrimaryCalendarType());var E=this._oMaxDate.getUTCFullYear();if(E<1||E>9999){throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); "+this);}if(this._oMinDate.getTime()>this._oMaxDate.getTime()){q.sap.log.warning("maxDate < minDate -> minDate set to begin of the month",this);this._oMinDate=a._createUniversalUTCDate(i,this.getPrimaryCalendarType());this._oMinDate.setUTCDate(1);this.setProperty("minDate",a._createLocalDate(this._oMinDate),true);}this._setMinMaxDateExtend(i);}this.setProperty("maxDate",i,false);var F=this.getAggregation("yearPicker");F._oMaxDate.setUTCFullYear(this._oMaxDate.getUTCFullYear());return this;};c.prototype._setMinMaxDateExtend=function(i){if(this._oFocusedDate){if(this._oFocusedDate.getTime()<this._oMinDate.getTime()){q.sap.log.warning("focused date < minDate -> minDate focused",this);this.focusDate(i);}else if(this._oFocusedDate.getTime()>this._oMaxDate.getTime()){q.sap.log.warning("focused date > maxDate -> maxDate focused",this);this.focusDate(i);}}};c.prototype._getLocaleData=function(){if(!this._oLocaleData){var i=this.getLocale();var E=new sap.ui.core.Locale(i);this._oLocaleData=L.getInstance(E);}return this._oLocaleData;};c.prototype._getShowMonthHeader=function(){var i=o.call(this);if(i>2){return true;}else{return false;}};c.prototype.setWidth=function(W){this.setProperty("width",W,true);if(this.getDomRef()){W=this.getWidth();this.$().css("width",W);if(W){this.$().addClass("sapUiCalWidth");}else{this.$().removeClass("sapUiCalWidth");}}return this;};c.prototype.onclick=function(E){if(E.isMarked("delayedMouseEvent")){return;}if(E.target.id==this.getId()+"-cancel"){this.onsapescape(E);}};c.prototype.onmousedown=function(E){E.preventDefault();E.setMark("cancelAutoClose");};c.prototype.onsapescape=function(E){if(this._iMode==0){this.fireCancel();}this._closedPickers();};c.prototype.onsapshow=function(E){if(this._bPoupupMode){this._closedPickers();this.fireCancel();E.preventDefault();}};c.prototype.onsaphide=c.prototype.onsapshow;c.prototype.onsaptabnext=function(E){var F=this.getAggregation("header");if(q.sap.containsOrEquals(this.getDomRef("content"),E.target)){q.sap.focus(F.getDomRef("B1"));if(!this._bPoupupMode){var G=this.getAggregation("month");var I=this.getAggregation("monthPicker");var J=this.getAggregation("yearPicker");for(var i=0;i<G.length;i++){var K=G[i];q(K._oItemNavigation.getItemDomRefs()[K._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}if(I.getDomRef()){q(I._oItemNavigation.getItemDomRefs()[I._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}if(J.getDomRef()){q(J._oItemNavigation.getItemDomRefs()[J._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}}E.preventDefault();}else if(E.target.id==F.getId()+"-B1"){q.sap.focus(F.getDomRef("B2"));E.preventDefault();}};c.prototype.onsaptabprevious=function(E){var F=this.getAggregation("header");if(q.sap.containsOrEquals(this.getDomRef("content"),E.target)){if(this._bPoupupMode){q.sap.focus(F.getDomRef("B2"));E.preventDefault();}}else if(E.target.id==F.getId()+"-B1"){var G=this.getAggregation("month");var I=this.getAggregation("monthPicker");var J=this.getAggregation("yearPicker");var K;switch(this._iMode){case 0:K=this._getFocusedDate();for(var i=0;i<G.length;i++){var N=G[i];var O=a._createUniversalUTCDate(N.getDate(),this.getPrimaryCalendarType());if(K.getTime()==O.getTime()){N._oItemNavigation.focusItem(N._oItemNavigation.getFocusedIndex());}else{q(N._oItemNavigation.getItemDomRefs()[N._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}}break;case 1:I._oItemNavigation.focusItem(I._oItemNavigation.getFocusedIndex());break;case 2:J._oItemNavigation.focusItem(J._oItemNavigation.getFocusedIndex());break;}E.preventDefault();}else if(E.target.id==F.getId()+"-B2"){q.sap.focus(F.getDomRef("B1"));E.preventDefault();}};c.prototype.onfocusin=function(E){if(E.target.id==this.getId()+"-end"){var F=this.getAggregation("header");var G=this.getAggregation("month");var I=this.getAggregation("monthPicker");var J=this.getAggregation("yearPicker");q.sap.focus(F.getDomRef("B2"));if(!this._bPoupupMode){for(var i=0;i<G.length;i++){var K=G[i];q(K._oItemNavigation.getItemDomRefs()[K._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}if(I.getDomRef()){q(I._oItemNavigation.getItemDomRefs()[I._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}if(J.getDomRef()){q(J._oItemNavigation.getItemDomRefs()[J._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}}}this.$("end").attr("tabindex","-1");};c.prototype.onsapfocusleave=function(E){if(!E.relatedControlId||!q.sap.containsOrEquals(this.getDomRef(),sap.ui.getCore().byId(E.relatedControlId).getFocusDomRef())){this.$("end").attr("tabindex","0");if(!this._bPoupupMode){var F=this.getAggregation("month");var G=this.getAggregation("monthPicker");var I=this.getAggregation("yearPicker");switch(this._iMode){case 0:for(var i=0;i<F.length;i++){var J=F[i];q(J._oItemNavigation.getItemDomRefs()[J._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}break;case 1:q(G._oItemNavigation.getItemDomRefs()[G._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");break;case 2:q(I._oItemNavigation.getItemDomRefs()[I._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");break;}}}};c.prototype.getFocusDomRef=function(){var i=this.getAggregation("month");var E=i[0];return E._oItemNavigation.getItemDomRefs()[E._oItemNavigation.getFocusedIndex()];};c.prototype.onThemeChanged=function(){if(!this.getDomRef()){return;}this._bNamesLengthChecked=undefined;var E=this.getAggregation("monthPicker");e.call(this,true);E._bNoThemeChange=false;E.onThemeChanged(arguments);E._bNoThemeChange=true;this._bLongMonth=E._bLongMonth;f.call(this,true);var F=this.getAggregation("month");for(var i=0;i<F.length;i++){var G=F[i];G._bNoThemeChange=false;G.onThemeChanged(arguments);G._bNoThemeChange=true;}var I;if(F.length>1){I=a._createUniversalUTCDate(F[0].getDate(),this.getPrimaryCalendarType());}else{I=this._getFocusedDate();}m.call(this,I);j.call(this);};c.prototype._updateHeader=function(i){m.call(this,i);this._togglePrevNext(i,true);};c.prototype._togglePrevNext=function(i,E){var F=this._oMaxDate.getJSDate().getUTCFullYear();var G=this._oMinDate.getJSDate().getUTCFullYear();var I=this._oMaxDate.getJSDate().getUTCMonth();var J=this._oMinDate.getJSDate().getUTCMonth();var K=this.getAggregation("header");var N=o.call(this);var O=this._newUniversalDate(i);if(this._iMode==0&&N>1){O=B.call(this,i);O.setUTCMonth(O.getUTCMonth()+N,0);}else{O.setUTCMonth(O.getUTCMonth()+1,0);}var P=O.getJSDate().getUTCFullYear();var Q=O.getJSDate().getUTCMonth();if(P>F||(P==F&&(!E||Q>=I))||(this._iMode==1&&this.getPickerPopup&&this.getPickerPopup())){K.setEnabledNext(false);}else{K.setEnabledNext(true);}if(this._iMode==0&&N>1){O.setUTCMonth(O.getUTCMonth()-N+1,1);}else{O.setUTCDate(1);}P=O.getJSDate().getUTCFullYear();Q=O.getJSDate().getUTCMonth();if(P<G||(P==G&&(!E||Q<=J))||(this._iMode==1&&this.getPickerPopup&&this.getPickerPopup())){K.setEnabledPrevious(false);}else{K.setEnabledPrevious(true);}};c.prototype._togglePrevNexYearPicker=function(){var i=this.getAggregation("yearPicker");var E=i.getYears();var F=a._createUniversalUTCDate(i.getFirstRenderedDate());F.setUTCFullYear(F.getUTCFullYear()+Math.floor(E/2));var G=this.getAggregation("header");var I=this._newUniversalDate(this._oMaxDate);I.setUTCFullYear(I.getUTCFullYear()-Math.ceil(E/2));I.setUTCMonth(11,31);var J=this._newUniversalDate(this._oMinDate);J.setUTCFullYear(J.getUTCFullYear()+Math.floor(E/2)+1);J.setUTCMonth(0,1);if(F.getTime()>I.getTime()){G.setEnabledNext(false);}else{G.setEnabledNext(true);}if(F.getTime()<J.getTime()){G.setEnabledPrevious(false);}else{G.setEnabledPrevious(true);}};c.prototype._handlePrevious=function(E){var F=this._getFocusedDate();var i=this.getAggregation("header");var G=this.getAggregation("yearPicker");var I=o.call(this);var J;var K;var N=false;switch(this._iMode){case 0:if(I>1){J=a._createUniversalUTCDate(this.getAggregation("month")[0].getDate(),this.getPrimaryCalendarType());J.setUTCDate(1);this._setFocusedDate(J);F=this._getFocusedDate();}else{F.setUTCDate(1);}F.setUTCDate(F.getUTCDate()-1);_.call(this,N,true);break;case 1:F.setUTCFullYear(F.getUTCFullYear()-1);i.setTextButton2(this._oYearFormat.format(F,true));var S=this._getSecondaryCalendarType();if(S){K=U.getInstance(new Date(F.getJSDate()),S);K.setUTCMonth(0,1);i.setAdditionalTextButton2(this._oYearFormatSecondary.format(K,true));}else{i.setAdditionalTextButton2();}this._togglePrevNext(F);this._setDisabledMonths(F.getUTCFullYear());break;case 2:G.previousPage();this._togglePrevNexYearPicker();break;}};c.prototype._handleNext=function(E){var F=this._getFocusedDate();var i=this.getAggregation("header");var G=this.getAggregation("yearPicker");var I=o.call(this);var J;var K;switch(this._iMode){case 0:if(I>1){J=a._createUniversalUTCDate(this.getAggregation("month")[0].getDate(),this.getPrimaryCalendarType());this._setFocusedDate(J);F=this._getFocusedDate();}F.setUTCMonth(F.getUTCMonth()+I,1);_.call(this);break;case 1:F.setUTCFullYear(F.getUTCFullYear()+1);i.setTextButton2(this._oYearFormat.format(F,true));var S=this._getSecondaryCalendarType();if(S){K=U.getInstance(new Date(F.getJSDate()),S);K.setUTCMonth(0,1);i.setAdditionalTextButton2(this._oYearFormatSecondary.format(K,true));}else{i.setAdditionalTextButton2();}this._togglePrevNext(F);this._setDisabledMonths(F.getUTCFullYear());break;case 2:G.nextPage();this._togglePrevNexYearPicker();break;}};c.prototype._getDisplayedMonths=function(E){var F=[];var G=E.getUTCMonth();var I=o.call(this);if(I>1){for(var i=0;i<I;i++){F.push((G+i)%12);}}else{F.push(G);}return F;};c.prototype._getDisplayedSecondaryMonths=function(P,S){var i=this.getAggregation("month");var F=a._createUniversalUTCDate(i[0].getDate(),P);F.setUTCDate(1);F=U.getInstance(F.getJSDate(),S);var E=F.getUTCMonth();var G=a._createUniversalUTCDate(i[i.length-1].getDate(),P);G.setUTCMonth(G.getUTCMonth()+1,0);G=U.getInstance(G.getJSDate(),S);var I=G.getUTCMonth();return{start:E,end:I};};c.prototype._closedPickers=function(){switch(this._iMode){case 0:break;case 1:f.call(this);break;case 2:h.call(this);break;}};c.prototype._setDisabledMonths=function(i,E){var F=0;var G=11;if(i==this._oMinDate.getUTCFullYear()){F=this._oMinDate.getUTCMonth();}if(i==this._oMaxDate.getUTCFullYear()){G=this._oMaxDate.getUTCMonth();}if(!E){E=this.getAggregation("monthPicker");}E.setMinMax(F,G);};function _(N,I,E){var F=this._getFocusedDate();var G=this.getAggregation("month");var J=false;var K;var O;var P;var i=0;for(i=0;i<G.length;i++){K=G[i];if(K.checkDateFocusable(a._createLocalDate(F))){J=true;}if(J||G.length==1){if(!N){K.setDate(a._createLocalDate(F));}else{K.displayDate(a._createLocalDate(F));}break;}}if(!J){P=this._newUniversalDate(F);if(G.length>1){P=B.call(this,P);for(i=0;i<G.length;i++){K=G[i];O=this._newUniversalDate(P);O.setUTCMonth(P.getUTCMonth()+i);if(!N&&O.getUTCFullYear()==F.getUTCFullYear()&&O.getUTCMonth()==F.getUTCMonth()){K.setDate(a._createLocalDate(F));}else{K.displayDate(a._createLocalDate(O));}}}this._updateHeader(P);if(!E){this.fireStartDateChange();}}}function d(){var S=this.getSelectedDates();var i=this.getPrimaryCalendarType();if(S&&S[0]&&S[0].getStartDate()){this._oFocusedDate=a._createUniversalUTCDate(S[0].getStartDate(),i);}else{var N=new Date();this._oFocusedDate=a._createUniversalUTCDate(N,i);}if(this._oFocusedDate.getTime()<this._oMinDate.getTime()){this._oFocusedDate=this._newUniversalDate(this._oMinDate);}else if(this._oFocusedDate.getTime()>this._oMaxDate.getTime()){this._oFocusedDate=this._newUniversalDate(this._oMaxDate);}}function e(N){if(this._iMode==2){h.call(this,true);}var E=this._getFocusedDate();var F=this.getAggregation("monthPicker");if(!this.getPickerPopup||!this.getPickerPopup()){if(F.getDomRef()){F.$().css("display","");}else{var R=sap.ui.getCore().createRenderManager();var $=this.$("content");R.renderControl(F);R.flush($[0],false,true);R.destroy();}}else{this._openPickerPopup(F);}this.$("contentOver").css("display","");if(!N){F.setMonth(E.getUTCMonth());this._setDisabledMonths(E.getUTCFullYear(),F);if(this._iMode==0){var G=this.getAggregation("month");for(var i=0;i<G.length;i++){var I=G[i];q(I._oItemNavigation.getItemDomRefs()[I._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}}}this._iMode=1;this._togglePrevNext(E,false);}function f(N){this._iMode=0;if(!this.getPickerPopup||!this.getPickerPopup()){var E=this.getAggregation("monthPicker");E.$().css("display","none");}else if(this._oPopup.isOpen()){this._oPopup.close();}this.$("contentOver").css("display","none");if(!N){_.call(this);if(o.call(this)>1){var F=this.getAggregation("month");for(var i=0;i<F.length;i++){var G=F[i];q(G._oItemNavigation.getItemDomRefs()[G._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}}}this._togglePrevNext(this._getFocusedDate(),true);}function g(){if(this._iMode==1){f.call(this,true);}var E=this._getFocusedDate();var F=this.getAggregation("yearPicker");if(!this.getPickerPopup||!this.getPickerPopup()){if(F.getDomRef()){F.$().css("display","");}else{var R=sap.ui.getCore().createRenderManager();var $=this.$("content");R.renderControl(F);R.flush($[0],false,true);R.destroy();}}else{this._openPickerPopup(F);}this.$("contentOver").css("display","");F.setDate(E.getJSDate());var G;if(o.call(this)==1){G=this.getAggregation("month")[0];var I=G.$("days").find(".sapUiCalItem");if(I.length==28){F.$().addClass("sapUiCalYearNoTop");}else{F.$().removeClass("sapUiCalYearNoTop");}}if(this._iMode==0){var J=this.getAggregation("month");for(var i=0;i<J.length;i++){G=J[i];q(G._oItemNavigation.getItemDomRefs()[G._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}}this._togglePrevNexYearPicker();this._iMode=2;}function h(N){this._iMode=0;if(!this.getPickerPopup||!this.getPickerPopup()){var E=this.getAggregation("yearPicker");E.$().css("display","none");}else if(this._oPopup.isOpen()){this._oPopup.close();}this.$("contentOver").css("display","none");if(!N){_.call(this);if(o.call(this)>1){var F=this.getAggregation("month");for(var i=0;i<F.length;i++){var G=F[i];q(G._oItemNavigation.getItemDomRefs()[G._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}}}this._togglePrevNext(this._getFocusedDate(),true);}function j(){if(!this._bNamesLengthChecked){e.call(this,true);f.call(this,true);var i=this.getAggregation("monthPicker");this._bLongMonth=i._bLongMonth;this._bNamesLengthChecked=true;if(!this._bLongMonth){var E=this.getAggregation("month");var F;if(E.length>1){F=a._createUniversalUTCDate(E[0].getDate(),this.getPrimaryCalendarType());}else{F=this._getFocusedDate();}m.call(this,F);}}else if(o.call(this)>1){k.call(this,this._getFocusedDate(),true,true);}}function k(i,O,N){var F;var E=false;var G=false;if(i.getTime()<this._oMinDate.getTime()){F=this._oMinDate;E=true;}else if(i.getTime()>this._oMaxDate.getTime()){F=this._oMaxDate;E=true;}else{F=i;}if(this._focusDateExtend){G=this._focusDateExtend(i,O,N);}var I=F.getTime()<this._getFocusedDate().getTime();this._setFocusedDate(F);if(E||O){_.call(this,false,I,N);}if(G){this.fireStartDateChange();}}function m(i){var E=this.getAggregation("header");var F=this._getLocaleData();var G=[];var I=[];var J=[];var K;var S=false;var T;var P;var N=this.getPrimaryCalendarType();var O=this._getSecondaryCalendarType();if(this._bLongMonth||!this._bNamesLengthChecked){G=F.getMonthsStandAlone("wide",N);}else{S=true;G=F.getMonthsStandAlone("abbreviated",N);I=F.getMonthsStandAlone("wide",N);}if(O){J=F.getMonthsStandAlone("abbreviated",O);var Q=this._getDisplayedSecondaryMonths(N,O);if(Q.start==Q.end){T=J[Q.start];}else{P=F.getIntervalPattern();T=P.replace(/\{0\}/,J[Q.start]).replace(/\{1\}/,J[Q.end]);}}E.setAdditionalTextButton1(T);var R=this._getDisplayedMonths(i);if(R.length>1){if(!P){P=F.getIntervalPattern();}T=P.replace(/\{0\}/,G[R[0]]).replace(/\{1\}/,G[R[R.length-1]]);if(S){K=P.replace(/\{0\}/,I[R[0]]).replace(/\{1\}/,I[R[R.length-1]]);}}else{T=G[R[0]];if(S){K=I[R[0]];}}E.setTextButton1(T);if(S){E.setAriaLabelButton1(K);}var V=this._newUniversalDate(i);V.setUTCDate(1);E.setTextButton2(this._oYearFormat.format(V,true));if(O){V=U.getInstance(V.getJSDate(),O);E.setAdditionalTextButton2(this._oYearFormatSecondary.format(V,true));}else{E.setAdditionalTextButton2();}}function n(i,N){if(i&&(!this._oFocusedDate||this._oFocusedDate.getTime()!=i.getTime())){if(!(i instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}i=a._createUniversalUTCDate(i,this.getPrimaryCalendarType());var E=i.getUTCFullYear();if(E<1||E>9999){throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); "+this);}if(i.getTime()<this._oMinDate.getTime()||i.getTime()>this._oMaxDate.getTime()){throw new Error("Date must not be in valid range (minDate and maxDate); "+this);}this._setFocusedDate(i);if(this.getDomRef()&&this._iMode==0){_.call(this,N,false,true);}}}function o(){if(sap.ui.Device.system.phone){return 1;}else{return this.getMonths();}}function p(E){if(this._iMode!=1){e.call(this);}else{f.call(this);}}function r(E){if(this._iMode!=2){g.call(this);}else{h.call(this);}}function s(E){this.fireEvent("_renderMonth",{days:E.getParameter("days")});}function t(E){if(o.call(this)>1){var F=this.getAggregation("month");for(var i=0;i<F.length;i++){var G=F[i];if(G.getId()!=E.oSource.getId()){G._updateSelection(this._oSelectedDay);}}}this.fireSelect();}function u(E){var i=a._createUniversalUTCDate(E.getParameter("date"),this.getPrimaryCalendarType());var O=E.getParameter("otherMonth");var R=E.getParameter("restoreOldDate");if(R){if(!q.sap.equal(this._getFocusedDate(),i)){_.call(this,false,false,true);}}else{k.call(this,i,O);}}function v(E){if(o.call(this)>1){var F=this.getAggregation("month");for(var i=0;i<F.length;i++){var G=F[i];if(G.getId()!=E.oSource.getId()){G._bindMousemove();}}}}function w(E){if(o.call(this)>1){var F=this.getAggregation("month");for(var i=0;i<F.length;i++){var G=F[i];if(G.getId()!=E.oSource.getId()){G._unbindMousemove();}}}}function x(E){var F=this._newUniversalDate(this._getFocusedDate());var i=this.getAggregation("monthPicker");var G=i.getMonth();F.setUTCMonth(G);if(G!=F.getUTCMonth()){F.setUTCDate(0);}k.call(this,F,true);f.call(this);}function y(E){var F=this._newUniversalDate(this._getFocusedDate());var i=this.getAggregation("yearPicker");var G=a._createUniversalUTCDate(i.getDate(),this.getPrimaryCalendarType());G.setUTCMonth(F.getUTCMonth(),F.getUTCDate());F=G;k.call(this,F,true);h.call(this);}function z(){this._sInvalidateMonth=undefined;var E=this.getAggregation("month");for(var i=0;i<E.length;i++){var F=E[i];F._bDateRangeChanged=true;F._bInvalidateSync=true;if(E.length>1){F._bNoFocus=true;}F.invalidate();F._bInvalidateSync=undefined;}if(E.length>1){k.call(this,this._getFocusedDate(),true,true);}this._bDateRangeChanged=undefined;}function A(E){var W=E.size.width;if(W<=0){return;}var O=this._iSize;if(W<this._iBreakPointTablet){this._iSize=0;}else if(W<this._iBreakPointDesktop){this._iSize=1;}else if(W<this._iBreakPointLargeDesktop){this._iSize=2;}else{this._iSize=3;}var F=o.call(this);var G;if(O!=this._iSize||this._bInitMonth){switch(this._iSize){case 1:G=2;break;case 2:G=3;break;case 3:G=4;break;default:G=1;break;}if(F<G){G=F;}if(G>2&&F>G){var I=G;var J=0.0;var K=G;while(I>=2){var N=F%I;if(N==0){K=I;break;}else{var P=N/I;if(P>J){J=P;K=I;}}I--;}G=K;}var Q;var R=this.getAggregation("month");if(G>1){Q=100/G+"%";this.$("content").removeClass("sapUiCalContentSingle");}else{Q="100%";this.$("content").addClass("sapUiCalContentSingle");}for(var i=0;i<R.length;i++){var S=R[i];S.setWidth(Q);}}}function B(i){var F=this._newUniversalDate(i);F.setUTCDate(1);var E=o.call(this);if(E<=12){var G=i.getUTCMonth();G=G-G%E;if(12%E>0&&G+E>11){G=12-E;}F.setUTCMonth(G);}return F;}return c;},true);

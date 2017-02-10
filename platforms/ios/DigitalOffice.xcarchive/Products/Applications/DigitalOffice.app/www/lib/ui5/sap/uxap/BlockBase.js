/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/CustomData","./BlockBaseMetadata","./ModelMapping","sap/ui/model/Context","sap/ui/Device","sap/ui/layout/form/ResponsiveGridLayout","./library"],function(C,a,B,M,b,D,R,l){"use strict";var c=C.extend("sap.uxap.BlockBase",{metadata:{library:"sap.uxap",properties:{"mode":{type:"string",group:"Appearance"},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"columnLayout":{type:"sap.uxap.BlockBaseColumnLayout",group:"Behavior",defaultValue:"auto"},"formAdjustment":{type:"sap.uxap.BlockBaseFormAdjustment",group:"Behavior",defaultValue:sap.uxap.BlockBaseFormAdjustment.BlockColumns},"showSubSectionMore":{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"mappings",aggregations:{"mappings":{type:"sap.uxap.ModelMapping",multiple:true,singularName:"mapping"},"_views":{type:"sap.ui.core.Control",multiple:true,singularName:"view",visibility:"hidden"}},associations:{"selectedView":{type:"sap.ui.core.Control",multiple:false}},views:{}},renderer:"sap.uxap.BlockBaseRenderer"},B);c.prototype.init=function(){if(!this.getMetadata().hasViews()){this.getMetadata().setView("defaultXML",{viewName:this.getMetadata().getName(),type:"XML"});}this._oMappingApplied={};this._bLazyLoading=false;this._bConnected=false;this._oUpdatedModels={};};c.prototype.onBeforeRendering=function(){this._applyMapping();if(!this.getMode()||this.getMode()===""){if(this.getMetadata().getView("defaultXML")){this.setMode("defaultXML");}else{jQuery.sap.log.error("BlockBase ::: there is no mode defined for rendering "+this.getMetadata().getName()+". You can either set a default mode on the block metadata or set the mode property before rendering the block.");}}this._applyFormAdjustment();this._bLazyLoading=this._getObjectPageLayout()&&(this._getObjectPageLayout().getEnableLazyLoading()||this._getObjectPageLayout().getUseIconTabBar());};c.prototype.onAfterRendering=function(){if(this._getObjectPageLayout()){this._getObjectPageLayout()._requestAdjustLayout();}};c.prototype.setParent=function(p,A,s){C.prototype.setParent.call(this,p,A,s);if(p instanceof l.ObjectPageSubSection){this._bLazyLoading=true;this._oParentObjectPageSubSection=p;}};c.prototype.setModel=function(m,n){this._applyMapping(n);return C.prototype.setModel.call(this,m,n);};c.prototype._applyMapping=function(){if(this._bLazyLoading&&!this._bConnected){jQuery.sap.log.debug("BlockBase ::: Ignoring the _applyMapping as the block is not connected");}else{this.getMappings().forEach(function(m,i){var o,I=m.getInternalModelName(),e=m.getExternalPath(),E=m.getExternalModelName(),p;if(e){if(I==""||e==""){throw new Error("BlockBase :: incorrect mapping, one of the modelMapping property is empty");}if(!this._isMappingApplied(I)||(this.getModel(I)!=this.getModel(E))){jQuery.sap.log.info("BlockBase :: mapping external model "+E+" to "+I);o=this.getModel(E);if(o){p=o.resolve(e,this.getBindingContext(E));this._oMappingApplied[I]=true;C.prototype.setModel.call(this,o,I);this.setBindingContext(new b(o,p),I);}}}},this);}};c.prototype._isMappingApplied=function(i){return this.getModel(i)&&this._oMappingApplied[i];};c.prototype.propagateProperties=function(n){if(this._bLazyLoading&&!this._bConnected&&!this._oUpdatedModels.hasOwnProperty(n)){this._oUpdatedModels[n]=true;}else{this._applyMapping(n);}return C.prototype.propagateProperties.call(this,n);};c.prototype.getSupportedModes=function(){var s=jQuery.extend({},this.getMetadata().getViews());for(var k in s){s[k]=k;}return s;};c.prototype.setMode=function(m){m=this._validateMode(m);if(this.getMode()!==m){this.setProperty("mode",m,false);if(!this._bLazyLoading||this._bConnected){this._initView(m);}}return this;};c.prototype.setColumnLayout=function(L){if(this._oParentObjectPageSubSection){this._oParentObjectPageSubSection.invalidate();}this.setProperty("columnLayout",L);};c.prototype.clone=function(){var A=-1,s=this.getAssociation("selectedView"),v=this.getAggregation("_views")||[];if(s){v.forEach(function(V,i){if(V.getId()===s){A=i;}return A<0;});}var n=C.prototype.clone.call(this);if(A>=0){n.setAssociation("selectedView",n.getAggregation("_views")[A]);}return n;};c.prototype._validateMode=function(m){this.validateProperty("mode",m);if(!this.getMetadata().getView(m)){var s=this.getMetadata()._sClassName||this.getId();if(this.getMetadata().getView("defaultXML")){jQuery.sap.log.warning("BlockBase :: no view defined for block "+s+" for mode "+m+", loading defaultXML instead");m="defaultXML";}else{throw new Error("BlockBase :: no view defined for block "+s+" for mode "+m);}}return m;};c.prototype._getSelectedViewContent=function(){var v=null,s,V;s=this.getAssociation("selectedView");V=this.getAggregation("_views");if(V){for(var i=0;!v&&i<V.length;i++){if(V[i].getId()===s){v=V[i];}}}return v;};c.prototype.createView=function(p,m){return sap.ui.xmlview(this.getId()+"-"+m,p);};c.prototype._initView=function(m){var v,V=this.getAggregation("_views")||[],p=this.getMetadata().getView(m);V.forEach(function(o,i){if(o.data("layoutMode")===m){v=o;}});if(!v){v=this._initNewView(m);}this.setAssociation("selectedView",v,true);if(v.getController()&&v.getController().onParentBlockModeChange){v.getController().onParentBlockModeChange(m);}else{jQuery.sap.log.info("BlockBase ::: could not notify "+p.viewName+" of loading in mode "+m+": missing controller onParentBlockModeChange method");}return v;};c.prototype._initNewView=function(m){var v=this._getSelectedViewContent(),p=this.getMetadata().getView(m);if(!v||p.viewName!=v.getViewName()){v=this.createView(p,m);if(v){if(v.getController()){v.getController().oParentBlock=this;}v.addCustomData(new a({"key":"layoutMode","value":m}));this.addAggregation("_views",v,true);}else{throw new Error("BlockBase :: no view defined in metadata.views for mode "+m);}}return v;};c.FORM_ADUSTMENT_OFFSET=32;c._FORM_ADJUSTMENT_CONST={breakpoints:{XL:D.media._predefinedRangeSets.StdExt.points[2]-c.FORM_ADUSTMENT_OFFSET,L:D.media._predefinedRangeSets.StdExt.points[1]-c.FORM_ADUSTMENT_OFFSET,M:D.media._predefinedRangeSets.StdExt.points[0]-c.FORM_ADUSTMENT_OFFSET},labelSpan:{XL:12,L:12,M:12,S:12},emptySpan:{XL:0,L:0,M:0,S:0},columns:{XL:1,L:1,M:1}};c._PARENT_GRID_SIZE=12;c.prototype._computeFormAdjustmentFields=function(v,L,f,p){if(v&&L&&f&&p){var o=this._computeFormColumns(L,f,p),d=this._computeFormBreakpoints(L,f);return jQuery.extend({},c._FORM_ADJUSTMENT_CONST,{columns:o},{breakpoints:d});}};c.prototype._computeFormColumns=function(L,f,p){var o=jQuery.extend({},c._FORM_ADJUSTMENT_CONST.columns);if(f===sap.uxap.BlockBaseFormAdjustment.BlockColumns){var i=c._PARENT_GRID_SIZE/p.XL,d=c._PARENT_GRID_SIZE/p.L,e=c._PARENT_GRID_SIZE/p.M;o.XL=L.getSpanXL()/i;o.L=L.getSpanL()/d;o.M=L.getSpanM()/e;}return o;};c.prototype._computeFormBreakpoints=function(L,f){var o=jQuery.extend({},c._FORM_ADJUSTMENT_CONST.breakpoints);if(f===sap.uxap.BlockBaseFormAdjustment.BlockColumns){o.XL=Math.round(o.XL*L.getSpanXL()/c._PARENT_GRID_SIZE);o.L=Math.round(o.L*L.getSpanL()/c._PARENT_GRID_SIZE);o.M=Math.round(o.M*L.getSpanM()/c._PARENT_GRID_SIZE);}return o;};c.prototype._applyFormAdjustment=function(){var L=this.getLayoutData(),f=this.getFormAdjustment(),v=this._getSelectedViewContent(),p=this._oParentObjectPageSubSection,F;if(f&&(f!==sap.uxap.BlockBaseFormAdjustment.None)&&v&&L&&p){var P=p._oLayoutConfig;v.getContent().forEach(function(i){if(i.getMetadata().getName()==="sap.ui.layout.form.SimpleForm"){i.setLayout(sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout);if(!F){F=this._computeFormAdjustmentFields(v,L,f,P);}this._applyFormAdjustmentFields(F,i);i.setWidth("100%");}else if(i.getMetadata().getName()==="sap.ui.layout.form.Form"){var o=i.getLayout(),r;if(o&&o.getMetadata().getName()==="sap.ui.layout.form.ResponsiveGridLayout"){r=o;}else{r=new R();i.setLayout(r);}if(!F){F=this._computeFormAdjustmentFields(v,L,f,P);}this._applyFormAdjustmentFields(F,r);i.setWidth("100%");}},this);}};c.prototype._applyFormAdjustmentFields=function(f,F){F.setColumnsXL(f.columns.XL);F.setColumnsL(f.columns.L);F.setColumnsM(f.columns.M);F.setLabelSpanXL(f.labelSpan.XL);F.setLabelSpanL(f.labelSpan.L);F.setLabelSpanM(f.labelSpan.M);F.setLabelSpanS(f.labelSpan.S);F.setEmptySpanXL(f.emptySpan.XL);F.setEmptySpanL(f.emptySpan.L);F.setEmptySpanM(f.emptySpan.M);F.setEmptySpanS(f.emptySpan.S);F.setBreakpointXL(f.breakpoints.XL);F.setBreakpointL(f.breakpoints.L);F.setBreakpointM(f.breakpoints.M);};c.prototype._getObjectPageLayout=function(){if(!this._oParentObjectPageLayout){this._oParentObjectPageLayout=l.Utilities.getClosestOPL(this);}return this._oParentObjectPageLayout;};c.prototype.setVisible=function(v,s){this.setProperty("visible",v,s);this._getObjectPageLayout()&&this._getObjectPageLayout()._adjustLayoutAndUxRules();return this;};c.prototype.setShowSubSectionMore=function(v,i){if(v!=this.getShowSubSectionMore()){this.setProperty("showSubSectionMore",v,true);if(this._oParentObjectPageSubSection){this._oParentObjectPageSubSection.refreshSeeMoreVisibility();}}return this;};c.prototype.connectToModels=function(){if(!this._bConnected){jQuery.sap.log.debug("BlockBase :: Connecting block to the UI5 model tree");this._bConnected=true;if(this._bLazyLoading){var m=this.getMode();m&&this._initView(m);}this.invalidate();}};c.prototype._allowPropagationToLoadedViews=function(A){if(!this._bConnected){return;}this.mSkipPropagation._views=!A;};c.prototype.updateBindingContext=function(s,S,m,u){if(!this._bLazyLoading||this._bConnected){return C.prototype.updateBindingContext.call(this,s,S,m,u);}else{jQuery.sap.log.debug("BlockBase ::: Ignoring the updateBindingContext as the block is not visible for now in the ObjectPageLayout");}};c.prototype.updateBindings=function(u,m){if(!this._bLazyLoading||this._bConnected){return C.prototype.updateBindings.call(this,u,m);}else{jQuery.sap.log.debug("BlockBase ::: Ignoring the updateBindingContext as the block is not visible for now in the ObjectPageLayout");}};return c;});

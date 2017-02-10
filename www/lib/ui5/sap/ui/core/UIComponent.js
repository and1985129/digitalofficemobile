/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','../base/ManagedObject','./Component','./library','./UIComponentMetadata','./mvc/Controller','./mvc/View'],function(q,M,C,l,U,a,V){"use strict";var b=l.mvc.ViewType;var c=C.extend("sap.ui.core.UIComponent",{constructor:function(i,s){try{C.apply(this,arguments);}catch(e){this._destroyCreatedInstances();throw e;}},metadata:{"abstract":true,rootView:null,publicMethods:["render"],aggregations:{"rootControl":{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},routing:{}}},U);c._fnOnInstanceInitialized=null;c._fnOnInstanceDestroy=null;c.prototype.init=function(){var t=this;var p={};if(this.getAutoPrefixId()){p.id=function(i){return t.createId(i);};}var r=this._getManifestEntry("/sap.ui5/routing",true)||{},R=r.config||{},v=r.routes;if(v){var d=sap.ui.requireSync("sap/ui/core/routing/Router");var f=g(R.routerClass||d);this._oRouter=new f(v,R,this,r.targets);this._oTargets=this._oRouter.getTargets();this._oViews=this._oRouter.getViews();}else if(r.targets){var T=sap.ui.requireSync("sap/ui/core/routing/Targets");var e=sap.ui.requireSync("sap/ui/core/routing/Views");this._oViews=new e({component:this});var h=g(R.targetsClass||T);this._oTargets=new h({targets:r.targets,config:R,views:this._oViews});}this.runAsOwner(function(){M.runWithPreprocessors(function(){t.setAggregation("rootControl",t.createContent());},p);});var o=this.getAggregation("rootControl");if(o instanceof V){if(R.targetParent===undefined){R.targetParent=o.getId();}if(this._oTargets){this._oTargets._setRootViewId(o.getId());}}if(typeof c._fnOnInstanceInitialized==="function"){c._fnOnInstanceInitialized(this);}};function g(r){var f;if(typeof r==="string"){f=q.sap.getObject(r);if(!f){q.sap.log.error("The specified class for router or targets '"+r+"' is undefined.",this);}}else{f=r;}return f;}c.prototype.destroy=function(){if(typeof c._fnOnInstanceDestroy==="function"){c._fnOnInstanceDestroy(this);}this._destroyCreatedInstances();C.prototype.destroy.apply(this,arguments);};c.prototype._destroyCreatedInstances=function(){if(this._oRouter){this._oRouter.destroy();delete this._oRouter;}if(this._oTargets){this._oTargets.destroy();this._oTargets=null;}if(this._oViews){this._oViews.destroy();this._oViews=null;}};c.getRouterFor=function(o){var v=o;if(v instanceof a){v=v.getView();}if(v instanceof V){var d=C.getOwnerComponentFor(v);if(d){return d.getRouter();}else{return undefined;}}};c.prototype.getRouter=function(){return this._oRouter;};c.prototype.getTargets=function(){return this._oTargets;};c.prototype.getAutoPrefixId=function(){return!!this.getManifestObject().getEntry("/sap.ui5/autoPrefixId");};c.prototype.byId=function(i){return sap.ui.getCore().byId(this.createId(i));};c.prototype.createId=function(i){if(!this.isPrefixedId(i)){i=this.getId()+"---"+i;}return i;};c.prototype.getLocalId=function(i){var p=this.getId()+"---";return(i&&i.indexOf(p)===0)?i.slice(p.length):null;};c.prototype.isPrefixedId=function(i){return!!(i&&i.indexOf(this.getId()+"---")===0);};c.prototype.createContent=function(){var r=this._getManifestEntry("/sap.ui5/rootView",true);if(r&&typeof r==="string"){return sap.ui.view({viewName:r,type:b.XML});}else if(r&&typeof r==="object"){if(r.id){r.id=this.createId(r.id);}return sap.ui.view(r);}else if(r){throw new Error("Configuration option 'rootView' of component '"+this.getMetadata().getName()+"' is invalid! 'rootView' must be type of string or object!");}return null;};c.prototype.render=function(r){var o=this.getAggregation("rootControl");if(o&&r){r.renderControl(o);}};c.prototype.getUIArea=function(){return(this.oContainer?this.oContainer.getUIArea():null);};c.prototype.getEventingParent=function(){return this.getUIArea();};c.prototype.setContainer=function(o){this.oContainer=o;return this;};c.prototype.onBeforeRendering=function(){};c.prototype.onAfterRendering=function(){};return c;});

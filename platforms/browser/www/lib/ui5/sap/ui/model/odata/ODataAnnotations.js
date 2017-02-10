/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./AnnotationParser','jquery.sap.global','sap/ui/Device','sap/ui/base/EventProvider'],function(A,q,D,E){"use strict";var O=E.extend("sap.ui.model.odata.ODataAnnotations",{constructor:function(o){E.apply(this,arguments);if(arguments.length!==1){if(typeof arguments[2]==="object"){o=arguments[2];}o.urls=arguments[0];o.metadata=arguments[1];}this.oMetadata=o.metadata;this.oAnnotations=o.annotationData?o.annotationData:{};this.bLoaded=false;this.bAsync=o&&o.async;this.xPath=null;this.oError=null;this.bValidXML=true;this.oRequestHandles=[];this.oLoadEvent=null;this.oFailedEvent=null;this.mCustomHeaders=o.headers?q.extend({},o.headers):{};if(o.urls){this.addUrl(o.urls);if(!this.bAsync){if(this.oError){q.sap.log.error("OData annotations could not be loaded: "+this.oError.message);}}}},metadata:{publicMethods:["parse","getAnnotationsData","attachFailed","detachFailed","attachLoaded","detachLoaded"]}});O.prototype.getAnnotationsData=function(){return this.oAnnotations;};O.prototype.isLoaded=function(){return this.bLoaded;};O.prototype.isFailed=function(){return this.oError!==null;};O.prototype.fireLoaded=function(a){this.fireEvent("loaded",a);return this;};O.prototype.attachLoaded=function(d,f,l){this.attachEvent("loaded",d,f,l);return this;};O.prototype.detachLoaded=function(f,l){this.detachEvent("loaded",f,l);return this;};O.prototype.fireFailed=function(a){this.fireEvent("failed",a);return this;};O.prototype.attachFailed=function(d,f,l){this.attachEvent("failed",d,f,l);return this;};O.prototype.detachFailed=function(f,l){this.detachEvent("failed",f,l);return this;};O.prototype.setHeaders=function(h){this.mCustomHeaders=q.extend({},h);};O.prototype._createXMLDocument=function(x,X){var o=null;if(typeof x==="string"){X=x;x=null;}if(D.browser.msie){o=new ActiveXObject("Microsoft.XMLDOM");o.preserveWhiteSpace=true;if(X.indexOf(" xmlns:xml=")>-1){X=X.replace(' xmlns:xml="http://www.w3.org/XML/1998/namespace"',"").replace(" xmlns:xml='http://www.w3.org/XML/1998/namespace'","");}o.loadXML(X);}else if(x){o=x;}else if(window.DOMParser){o=new DOMParser().parseFromString(X,'application/xml');}else{q.sap.log.fatal("The browser does not support XML parsing. Annotations are not available.");}return o;};O.prototype._documentHasErrors=function(x){return(x.getElementsByTagName("parsererror").length>0||(x.parseError&&x.parseError.errorCode!==0));};O.prototype._mergeAnnotationData=function(a,s){if(!this.oAnnotations){this.oAnnotations={};}function m(n,c,d){if(Array.isArray(c[n])){d[n]=c[n].slice(0);}else{d[n]=d[n]||{};for(var k in c[n]){d[n][k]=c[n][k];}}}var t,T;var S=["propertyAnnotations","EntityContainer","annotationReferences"];for(t in a){if(S.indexOf(t)!==-1){continue;}m(t,a,this.oAnnotations);}for(var i=0;i<S.length;++i){var b=S[i];this.oAnnotations[b]=this.oAnnotations[b]||{};for(t in a[b]){for(T in a[b][t]){this.oAnnotations[b][t]=this.oAnnotations[b][t]||{};m(T,a[b][t],this.oAnnotations[b][t]);}}}this.bLoaded=true;if(!s){this.fireLoaded({annotations:a});}};O.prototype.setXML=function(x,X,o){var d={success:function(){},error:function(){},fireEvents:false};o=q.extend({},d,o);var a=this._createXMLDocument(x,X);var p=function(a){var r={xmlDoc:a};var b=A.parse(this.oMetadata,a);if(b){r.annotations=b;o.success(r);this._mergeAnnotationData(b,!o.fireEvents);}else{o.error(r);if(o.fireEvents){this.fireFailed(r);}}}.bind(this,a);if(this._documentHasErrors(a)){o.error({xmlDoc:a});return false;}else{var m=this.oMetadata.getServiceMetadata();if(!m||q.isEmptyObject(m)){this.oMetadata.attachLoaded(p);}else{p();}return true;}};O.prototype.addUrl=function(u){var t=this;var U=u;if(Array.isArray(u)&&u.length==0){return Promise.resolve({annotations:this.oAnnotations});}if(!Array.isArray(u)){U=[u];}return new Promise(function(r,R){var l=0;var m={annotations:null,success:[],fail:[]};var f=function(a){l++;if(a.type==="success"){m.success.push(a);}else{m.fail.push(a);}if(l===U.length){m.annotations=t.oAnnotations;if(m.success.length>0){var s={annotations:t.oAnnotations,results:m};t.fireLoaded(s);}if(m.success.length<U.length){var e=new Error("At least one annotation failed to load/parse/merge");e.annotations=m.annotations;e.success=m.success;e.fail=m.fail;R(e);}else{r(m);}}};var i=0;if(t.bAsync){var p=Promise.resolve();for(i=0;i<U.length;++i){var L=t._loadFromUrl.bind(t,U[i]);p=p.then(L,L).then(f,f);}}else{for(i=0;i<U.length;++i){t._loadFromUrl(U[i]).then(f,f);}}});};O.prototype._loadFromUrl=function(u){var t=this;return new Promise(function(r,R){var a={url:u,async:t.bAsync,headers:q.extend({},t.mCustomHeaders,{"Accept-Language":sap.ui.getCore().getConfiguration().getLanguageTag()})};var o;var f=function(j,S){if(o&&o.bSuppressErrorHandlerCall){return;}t.oError={type:"fail",url:u,message:S,statusCode:j.statusCode,statusText:j.statusText,responseText:j.responseText};if(t.bAsync){t.oFailedEvent=q.sap.delayedCall(0,t,t.fireFailed,[t.oError]);}else{t.fireFailed(t.oError);}R(t.oError);};var s=function(d,S,j){t.setXML(j.responseXML,j.responseText,{success:function(m){r({type:"success",url:u,message:S,statusCode:j.statusCode,statusText:j.statusText,responseText:j.responseText});},error:function(m){f(j,"Malformed XML document");},url:u});};q.ajax(a).done(s).fail(f);});};O.prototype.destroy=function(){for(var i=0;i<this.oRequestHandles.length;++i){if(this.oRequestHandles[i]){this.oRequestHandles[i].bSuppressErrorHandlerCall=true;this.oRequestHandles[i].abort();this.oRequestHandles[i]=null;}}E.prototype.destroy.apply(this,arguments);if(this.oLoadEvent){q.sap.clearDelayedCall(this.oLoadEvent);}if(this.oFailedEvent){q.sap.clearDelayedCall(this.oFailedEvent);}};return O;});

/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./lib/_Cache","./lib/_Helper","./lib/_Parser","sap/ui/model/FilterOperator","sap/ui/model/odata/OperationMode","sap/ui/model/Sorter"],function(_,a,b,F,O,S){"use strict";var c,r=/^\w+$/,d=/\([^/]*|\/\d+|^\d+\//g;function e(g,A){if(typeof g==="string"&&r.test(g)){return true;}if(!A){return g===undefined||g==="$auto"||g==="$direct";}return false;}function f(D,s,E){var i;for(i=s;i<E;i+=1){if(D[i]===undefined){return true;}}return false;}c={aAllowedSystemQueryOptions:["$expand","$filter","$orderby","$select"],buildBindingParameters:function(p,A){var R={};if(p){Object.keys(p).forEach(function(k){var v=p[k];if(k.indexOf("$$")!==0){return;}if(!A||A.indexOf(k)<0){throw new Error("Unsupported binding parameter: "+k);}if(k==="$$groupId"||k==="$$updateGroupId"){if(!e(v)){throw new Error("Unsupported value '"+v+"' for binding parameter '"+k+"'");}}else if(k==="$$operationMode"){if(v!==O.Server){throw new Error("Unsupported operation mode: "+v);}}R[k]=v;});}return R;},buildOrderbyOption:function(s,o){var g=[];s.forEach(function(h){if(h instanceof S){g.push(h.sPath+(h.bDescending?" desc":""));}else{throw new Error("Unsupported sorter: '"+h+"' ("+typeof h+")");}});if(o){g.push(o);}return g.join(',');},buildQueryOptions:function(m,o,A,s){var R=JSON.parse(JSON.stringify(m||{}));function v(E){var h;if(typeof E==="object"){for(h in E){g(h,E[h]);}}}function g(h,V){var p;if(!A||A.indexOf(h)<0){throw new Error("System query option "+h+" is not supported");}if(h==="$expand"){for(p in V){v(V[p]);}}}if(o){Object.keys(o).forEach(function(k){var V=o[k];if(k.indexOf("$$")===0){return;}if(k[0]==="@"){throw new Error("Parameter "+k+" is not supported");}if(k[0]==="$"){if((k==="$expand"||k==="$select")&&typeof V==="string"){V=b.parseSystemQueryOption(k+"="+V)[k];}g(k,V);}else if(!s&&k.indexOf("sap-")===0){throw new Error("Custom query option "+k+" is not supported");}R[k]=V;});}return R;},checkGroupId:function(g,A,E){if(!e(g,A)){throw new Error((E||"Invalid group ID: ")+g);}},createCacheProxy:function(B,C,p,o){var g;if(B.oCache){B.oCache.deregisterChange();}g={deregisterChange:function(){},hasPendingChanges:function(){return false;},post:function(){throw new Error("POST request not allowed");},read:function(){var R=arguments;return this.promise.then(function(h){return h.read.apply(h,R);},function(E){throw new Error("Cannot read from cache, cache creation failed: "+E);});},refresh:function(){},resetChanges:function(){},update:function(){throw new Error("PATCH request not allowed");}};g.promise=Promise.all([p,o]).then(function(R){var h,s=R[0];if(B.oCache!==g){return B.oCache;}B.mCacheByContext=B.mCacheByContext||{};h=s?B.mCacheByContext[s]=B.mCacheByContext[s]||C(s,R[1]):C(s,R[1]);return h;});return g;},createContextCacheProxy:function(B,C){var o;function g(p){return _.createSingle(B.oModel.oRequestor,a.buildPath(p,B.sPath).slice(1),c.getQueryOptions(B,"",C));}o=c.createCacheProxy(B,g,C.requestCanonicalPath());o.promise.then(function(h){B.oCache=h;})["catch"](function(E){B.oModel.reportError("Failed to create cache for binding "+B,"sap.ui.model.odata.v4._ODataHelper",E);});return o;},createListCacheProxy:function(B,C){var o,g,p,q;function h(P,s){var i=c.buildOrderbyOption(B.aSorters,q&&q.$orderby);return _.create(B.oModel.oRequestor,a.buildPath(P,B.sPath).slice(1),c.mergeQueryOptions(q,i,s));}if(B.bRelative){if(!C||(!B.mQueryOptions&&!B.aSorters.length&&!B.aFilters.length&&!B.aApplicationFilters.length)){return undefined;}}else{C=undefined;}q=c.getQueryOptions(B,"",C);p=C&&C.requestCanonicalPath();g=c.requestFilter(B,C,B.aApplicationFilters,B.aFilters,q&&q.$filter);o=c.createCacheProxy(B,h,p,g);o.promise.then(function(i){B.oCache=i;})["catch"](function(E){B.oModel.reportError("Failed to create cache for binding "+B,"sap.ui.model.odata.v4._ODataHelper",E);});return o;},getKeyPredicate:function(E,o){var k=[],s=E.$Key.length===1;if(!o){throw new Error("No instance to calculate key predicate");}E.$Key.forEach(function(n){var v=o[n];if(v===undefined){throw new Error("Missing value for key property '"+n+"'");}v=encodeURIComponent(a.formatLiteral(v,E[n].$Type));k.push(s?v:encodeURIComponent(n)+"="+v);});return"("+k.join(",")+")";},getQueryOptions:function(B,p,C){var R=B.mQueryOptions;if(!R){return C&&C.getQueryOptions(a.buildPath(B.sPath,p));}if(!p){return R;}p=p.replace(d,"");p.split("/").some(function(s){R=R.$expand&&R.$expand[s];if(!R||R===true){R=undefined;return true;}});return c.buildQueryOptions(B.oModel.mUriParameters,R,c.aAllowedSystemQueryOptions);},getReadRange:function(C,s,l,m,M){var g,i=Math.min(s+l+m/2,M),h=Math.max(s-m/2,0),j=f(C,s,i),R;if(m===0){return!j||s>=M?undefined:{length:l,start:s};}g=f(C,h,s);if(g||j){R={start:g?s-m:s,length:l+m};if(g&&j){R.length+=m;}if(R.start<0){R.length+=R.start;R.start=0;}if(R.start>=M){R=undefined;}}return R;},hasPendingChanges:function(B,A,p){var R;if(p!==undefined){if(B.oCache){return B.oCache.hasPendingChanges(p);}if(B.oContext){return B.oContext.hasPendingChanges(a.buildPath(B.sPath,p));}return false;}if(B.oCache){R=B.oCache.hasPendingChanges("");}else if(B.oContext&&A){R=B.oContext.hasPendingChanges(B.sPath);}if(R){return R;}return B.oModel.getDependentBindings(B).some(function(D){return c.hasPendingChanges(D,false);});},mergeQueryOptions:function(q,o,s){var R;function g(p,v){if(v&&(!q||q[p]!==v)){if(!R){R=q?JSON.parse(JSON.stringify(q)):{};}R[p]=v;}}g("$orderby",o);g("$filter",s);return R||q;},requestDiff:function(B,D,s,l){var m,M,n,R;function g(){var i,h=D.length,j,p=B.aPreviousData;j=jQuery.sap.arraySymbolDiff(p.slice(s,s+l),n);for(i=0;i<h;i+=1){p[s+i]=n[i];}if(h<l){p.length=s+h;}return j;}if(!D){return Promise.resolve([]);}if(B.bDetectUpdates){n=D.map(function(E){return JSON.stringify(E);});return Promise.resolve(g());}R=B.oModel.resolve(B.sPath,B.oContext);m=B.oModel.getMetaModel();M=m.getMetaContext(R);return m.fetchObject("$Type/$Key",M).then(function(k){var h={};if(k){n=D.map(function(E){return k.reduce(function(p,K){p[K]=E[K];if(E[K]===undefined){h[K]=true;}return p;},{});});}if(Object.keys(h).length>0||!k){B.aPreviousData=[];jQuery.sap.log.warning("Disable extended change detection as"+" diff computation failed: "+B,!k?"Type for path "+R+" has no keys":"Missing key(s): "+Object.keys(h),"sap.ui.model.odata.v4.ODataListBinding");return undefined;}return g();});},requestFilter:function(B,C,A,g,s){var n=[];function h(l,m){var o=l.join(m);return l.length>1?"("+o+")":o;}function i(o,E){var l,v=a.formatLiteral(o.oValue1,E),m=decodeURIComponent(o.sPath);switch(o.sOperator){case F.BT:l=m+" ge "+v+" and "+m+" le "+a.formatLiteral(o.oValue2,E);break;case F.EQ:case F.GE:case F.GT:case F.LE:case F.LT:case F.NE:l=m+" "+o.sOperator.toLowerCase()+" "+v;break;case F.Contains:case F.EndsWith:case F.StartsWith:l=o.sOperator.toLowerCase()+"("+m+","+v+")";break;default:throw new Error("Unsupported operator: "+o.sOperator);}return l;}function j(l,m){var o=[],p={};l.forEach(function(q){p[q.sPath]=p[q.sPath]||[];p[q.sPath].push(q);});l.forEach(function(q){var t;if(q.aFilters){o.push(j(q.aFilters,q.bAnd).then(function(u){return"("+u+")";}));return;}t=p[q.sPath];if(!t){return;}delete p[q.sPath];o.push(k(t));});return Promise.all(o).then(function(q){return q.join(m?" and ":" or ");});}function k(G){var m=B.oModel.oMetaModel,M=m.getMetaContext(B.oModel.resolve(B.sPath,C)),p=m.requestObject(G[0].sPath,M);return p.then(function(P){var l;if(!P){throw new Error("Type cannot be determined, no metadata for path: "+M.getPath());}l=G.map(function(o){return i(o,P.$Type);});return h(l," or ");});}return Promise.all([j(A,true),j(g,true)]).then(function(l){if(l[0]){n.push(l[0]);}if(l[1]){n.push(l[1]);}if(s){n.push(s);}return h(n,") and (");});},resetChanges:function(B,A,p){if(p!==undefined){if(B.oCache){B.oCache.resetChanges(p);}else if(B.oContext){B.oContext.resetChanges(a.buildPath(B.sPath,p));}return;}if(B.oCache){B.oCache.resetChanges("");}else if(B.oContext&&A){B.oContext.resetChanges(B.sPath);}B.oModel.getDependentBindings(B).forEach(function(D){c.resetChanges(D,false);});},toArray:function(E){if(E===undefined||E===null){return[];}if(Array.isArray(E)){return E;}return[E];}};return c;},false);

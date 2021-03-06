/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./_Helper","./_SyncPromise"],function(q,_,a){"use strict";var C;function b(M,p,i){if(i){if(!M[p]){M[p]=[i];}else if(M[p].indexOf(i)>=0){return;}else{M[p].push(i);}}}function c(Q,R,D){Object.keys(Q).forEach(function(K){var v=Q[K];if(D&&K[0]==='$'){return;}switch(K){case"$expand":v=C.convertExpand(v);break;case"$filter":case"$orderby":break;case"$select":if(Array.isArray(v)){v=v.join(",");}break;default:if(K[0]==='$'){throw new Error("Unsupported system query option "+K);}}R(K,v);});}function d(p,v){return p.reduceRight(function(V,s){var R={};R[s]=V;return R;},v);}function e(R,p,L){if(p){p.split("/").every(function(s){if(!R||typeof R!=="object"){L(s);R=undefined;return false;}R=R[s];if(R===undefined){L(s);return false;}return true;});}return R;}function f(A,v,s,E){var i;for(i=s;i<E;i++){A[i]=v;}}function h(p,P){var R;for(R in p){if(g(R,P)){return true;}}return false;}function g(R,p){return p===""||R===p||R.indexOf(p+"/")===0;}function r(M,p,i){var I=M[p],n;if(I){n=I.indexOf(i);if(n>=0){if(I.length===1){delete M[p];}else{I.splice(n,1);}}}}function j(o){var i,p,P;for(p in o.mPatchRequests){P=o.mPatchRequests[p];for(i=0;i<P.length;i++){o.oRequestor.removePatch(P[i]);}}}function k(o,s,E,G){var n=o.aElements,p=E-s,P,R=o.sResourcePath+"$skip="+s+"&$top="+p;P=o.oRequestor.request("GET",R,G).then(function(t){var i,v=t.value.length,w;if(n!==o.aElements){w=new Error("Refresh canceled pending request: "+o.oRequestor.getServiceUrl()+R);w.canceled=true;throw w;}o.sContext=t["@odata.context"];if(v<p){o.iMaxElements=s+v;o.aElements.splice(o.iMaxElements,p-v);}for(i=0;i<v;i++){o.aElements[s+i]=t.value[i];}})["catch"](function(i){if(n===o.aElements){f(o.aElements,undefined,s,E);}throw i;});f(o.aElements,P,s,E);}function l(o,p){var i,R,P;for(R in o.mPatchRequests){if(g(R,p)){P=o.mPatchRequests[R];for(i=0;i<P.length;i++){o.oRequestor.removePatch(P[i]);}delete o.mPatchRequests[R];}}}function u(o,G,p,v,E,P,i){var B,H,O,n=p.split("/"),U=_.buildPath(P,o.bSingleProperty?"value":p),s;if(!i){throw new Error("Cannot update '"+p+"': '"+P+"' does not exist");}E+=C.buildQueryString(o.mQueryOptions,true);H={"If-Match":i["@odata.etag"]};B=d(n,v);if(o.bSingleProperty){n=["value"];}O=n.reduce(function(V,t){return V&&V[t];},i);_.updateCache(o.mChangeListeners,P,i,d(n,v));s=o.oRequestor.request("PATCH",E,G,H,B);b(o.mPatchRequests,U,s);return s.then(function(t){r(o.mPatchRequests,U,s);_.updateCache(o.mChangeListeners,P,i,o.bSingleProperty?{value:t[p]}:t);return t;},function(t){r(o.mPatchRequests,U,s);if(t.canceled){_.updateCache(o.mChangeListeners,P,i,d(n,O));}throw t;});}function m(R,s,Q){var i=C.buildQueryString(Q);this.sContext=undefined;this.aElements=[];this.iMaxElements=-1;this.mChangeListeners={};this.mPatchRequests={};this.mQueryOptions=Q;this.oRequestor=R;this.sResourcePath=s+i+(i.length?"&":"?");}m.prototype._delete=function(G,E,p,i){var s=p.split("/"),I=Number(s.shift()),D=s.pop(),t=this;return this.read(I,1,G,s.join("/")).then(function(o){var n,H;if(!D){o=t.aElements;D=I;}n=o[D];if(n["$ui5.deleting"]){throw new Error("Must not delete twice: "+E);}n["$ui5.deleting"]=true;H={"If-Match":n["@odata.etag"]};E+=C.buildQueryString(t.mQueryOptions,true);return t.oRequestor.request("DELETE",E,G,H)["catch"](function(v){if(v.status!==404){delete n["$ui5.deleting"];throw v;}}).then(function(){if(o[D]!==n){D=o.indexOf(n);}o.splice(D,1);i(Number(D));});});};m.prototype.deregisterChange=function(i,p,L){if(arguments.length){r(this.mChangeListeners,i+"/"+p,L);}else{this.mChangeListeners={};}};m.prototype.hasPendingChanges=function(p){return h(this.mPatchRequests,p);};m.prototype.read=function(I,L,G,p,D,o){var i,E=I+L,n=-1,s=false,t=this;if(I<0){throw new Error("Illegal index "+I+", must be >= 0");}if(L<0){throw new Error("Illegal length "+L+", must be >= 0");}else if(L!==1&&p!==undefined){throw new Error("Cannot drill-down for length "+L);}if(this.iMaxElements>=0&&E>this.iMaxElements){E=this.iMaxElements;}for(i=I;i<E;i++){if(this.aElements[i]!==undefined){if(n>=0){k(this,n,i,G);s=true;n=-1;}}else if(n<0){n=i;}}if(n>=0){k(this,n,E,G);s=true;}if(s&&D){D();}return a.all(this.aElements.slice(I,E)).then(function(){var R;if(p!==undefined){b(t.mChangeListeners,I+"/"+p,o);R=t.aElements[I];return e(R,p,function(v){q.sap.log.error("Failed to drill-down into "+t.sResourcePath+"$skip="+I+"&$top=1 via "+p+", invalid segment: "+v,null,"sap.ui.model.odata.v4.lib._Cache");});}return{"@odata.context":t.sContext,value:t.aElements.slice(I,E)};});};m.prototype.refresh=function(){this.sContext=undefined;this.iMaxElements=-1;this.aElements=[];j(this);};m.prototype.resetChanges=function(p){l(this,p);};m.prototype.toString=function(){return this.oRequestor.getServiceUrl()+this.sResourcePath;};m.prototype.update=function(G,p,v,E,P){var s=P.split("/"),i=parseInt(s.shift(),10);return this.read(i,1,G,s.join("/")).then(u.bind(null,this,G,p,v,E,P));};function S(R,s,Q,i,p){this.mChangeListeners={};this.mPatchRequests={};this.bPost=p;this.bPosting=false;this.oPromise=null;this.mQueryOptions=Q;this.oRequestor=R;this.sResourcePath=s+C.buildQueryString(Q);this.bSingleProperty=i;}S.prototype._delete=function(G,E,p,i){var s=p.split("/"),D=s.pop(),P=s.join("/"),t=this;return this.read(G,P).then(function(v){var o=D?v[D]:v,H={"If-Match":o["@odata.etag"]};if(o["$ui5.deleting"]){throw new Error("Must not delete twice: "+E);}o["$ui5.deleting"]=true;E+=C.buildQueryString(t.mQueryOptions,true);return t.oRequestor.request("DELETE",E,G,H)["catch"](function(n){if(n.status!==404){delete o["$ui5.deleting"];throw n;}}).then(function(){if(Array.isArray(v)){if(v[D]!==o){D=v.indexOf(o);}v.splice(D,1);i(Number(D));}else{if(D){v[D]=null;}else{o["$ui5.deleted"]=true;}i();}});});};S.prototype.deregisterChange=function(p,L){if(arguments.length){r(this.mChangeListeners,this.bSingleProperty?"value":p,L);}else{this.mChangeListeners={};}};S.prototype.hasPendingChanges=function(p){return h(this.mPatchRequests,p);};S.prototype.post=function(G,D,E){var t=this;if(!this.bPost){throw new Error("POST request not allowed");}if(this.bPosting){throw new Error("Parallel POST requests not allowed");}this.oPromise=a.resolve(this.oRequestor.request("POST",this.sResourcePath,G,{"If-Match":E},D).then(function(R){t.bPosting=false;return R;},function(o){t.bPosting=false;throw o;}));this.bPosting=true;return this.oPromise;};S.prototype.read=function(G,p,D,L){var t=this,P,R=this.sResourcePath;if(!this.oPromise){if(this.bPost){throw new Error("Read before a POST request");}P=a.resolve(this.oRequestor.request("GET",R,G).then(function(o){var E;if(t.oPromise!==P){E=new Error("Refresh canceled pending request: "+t);E.canceled=true;throw E;}return o;}));if(D){D();}this.oPromise=P;}return this.oPromise.then(function(o){if(t.bSingleProperty){o=o?o.value:null;}else if(o["$ui5.deleted"]){throw new Error("Cannot read a deleted entity");}b(t.mChangeListeners,t.bSingleProperty?"value":p,L);if(p){return e(o,p,function(s){q.sap.log.error("Failed to drill-down into "+R+"/"+p+", invalid segment: "+s,null,"sap.ui.model.odata.v4.lib._Cache");});}return o;});};S.prototype.refresh=function(){if(this.bPost){throw new Error("Refresh not allowed when using POST");}this.oPromise=undefined;j(this);};S.prototype.resetChanges=function(p){l(this,p);};S.prototype.toString=function(){return this.oRequestor.getServiceUrl()+this.sResourcePath;};S.prototype.update=function(G,p,v,E,P){return(this.bSingleProperty?this.oPromise:this.read(G,P)).then(u.bind(null,this,G,p,v,E,P));};C={buildQueryString:function(Q,D){return _.buildQuery(C.convertQueryOptions(Q,D));},convertExpand:function(E){var R=[];if(!E||typeof E!=="object"){throw new Error("$expand must be a valid object");}Object.keys(E).forEach(function(s){var v=E[s];if(v&&typeof v==="object"){R.push(C.convertExpandOptions(s,v));}else{R.push(s);}});return R.join(",");},convertExpandOptions:function(E,v){var i=[];c(v,function(o,O){i.push(o+'='+O);});return i.length?E+"("+i.join(";")+")":E;},convertQueryOptions:function(Q,D){var i={};if(!Q){return undefined;}c(Q,function(K,v){i[K]=v;},D);return i;},create:function _create(R,s,Q){return new m(R,s,Q);},createSingle:function _createSingle(R,s,Q,i,p){return new S(R,s,Q,i,p);}};return C;},false);

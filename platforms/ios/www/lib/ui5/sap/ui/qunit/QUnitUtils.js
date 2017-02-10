/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define('sap/ui/qunit/QUnitUtils',['jquery.sap.global','sap/ui/Device','sap/ui/base/DataType'],function(q,D,f){"use strict";if(typeof QUnit!=='undefined'){var p=q.sap.getUriParameters();QUnit.equals=window.equals=window.equal;var t=p.get("sap-ui-qunittimeout");if(!t||isNaN(t)){t="30000";}QUnit.config.testTimeout=parseInt(t,10);QUnit.config.reorder=false;if(window["sap-ui-qunit-coverage"]!=="client"&&/x|true/i.test(q.sap.getUriParameters().get("coverage-report"))){QUnit.done(function(a,b){if(window._$blanket&&document.addEventListener){var c=window.QUnit;window.QUnit=undefined;q.sap.require("sap.ui.thirdparty.blanket");window.QUnit=c;window.blanket.report({});}});}if(D.browser.internet_explorer&&D.browser.version==9){QUnit.begin(function(){if(window.sinon&&window.sinon.xhr){window.sinon.xhr.supportsCORS=true;}});}}if(D.browser.phantomJS){var $=q.fn.is;q.fn.is=function(s){if(s===":focus"){return this.get(0)===document.activeElement;}return $.apply(this,arguments);};}q.now=function(){return Date.now();};if(D.browser.phantomJS){var g=Date,h=g.parse;Date=function(d){if(arguments.length===1&&typeof d==='string'){return new g(Date.parse(d));}var a=Array.prototype.slice.call(arguments);a.unshift(window);if(this instanceof g){return new(Function.prototype.bind.apply(g,a));}else{return g.apply(window,a);}};var k=function(d){var M=h.apply(Date,arguments);if(d&&typeof d==="string"){var m=/^(\d{4})(?:-(\d+)?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/.exec(d);if(m&&parseInt(m[1],10)>=2034){M+=24*60*60*1000;}}return M;};Object.defineProperties(Date,{"parse":{value:k,enumerable:false},"toString":{value:function(){return g.toString.call(this);},enumerable:false},"now":{value:g.now,enumerable:false},"UTC":{value:g.UTC,enumerable:false},"prototype":{value:g.prototype,enumerable:false}});}var Q={};Q.delayTestStart=function(d){QUnit.config.autostart=false;if(d){window.setTimeout(function(){QUnit.start();},d);}else{q(function(){QUnit.start();});}};var u=q.noop;try{new q.Event({type:"mousedown"}).preventDefault();}catch(e){u=function(o){if(o){o.preventDefault=o.preventDefault||q.noop;o.stopPropagation=o.stopPropagation||q.noop;o.stopImmediatePropagation=o.stopImmediatePropagation||q.noop;}};var O=q.Event;q.Event=function(s,a){var b=new O(s,a);u(b.originalEvent);return b;};q.Event.prototype=O.prototype;}function w(E,T,P){var o=q.Event({type:E});if(T!=null){o.target=T;}if(P){for(var x in P){o[x]=P[x];if(x==='originalEvent'){u(o[x]);}else{o.originalEvent[x]=P[x];}}}return o;}Q.triggerEvent=function(E,T,P){if(typeof(T)=="string"){T=q.sap.domById(T);}var o=w(E,null,P);q(T).trigger(o);};Q.triggerTouchEvent=function(E,T,P,s){if(typeof(T)=="string"){T=q.sap.domById(T);}var o=w(E,T,P),a=q(T).control(0),b=(s==null?'on':s)+E;if(a&&a[b]){a[b].call(a,o);}};Q.triggerKeyEvent=function(E,T,K,s,a,c){var P={};P.keyCode=isNaN(K)?q.sap.KeyCodes[K]:K;P.which=P.keyCode;P.shiftKey=s;P.altKey=a;P.metaKey=c;P.ctrlKey=c;Q.triggerEvent(E,T,P);};Q.triggerKeydown=function(T,K,s,a,c){Q.triggerKeyEvent("keydown",T,K,s,a,c);};Q.triggerKeyup=function(T,K,s,a,c){Q.triggerKeyEvent("keyup",T,K,s,a,c);};Q.triggerKeyboardEvent=function(T,K,s,a,c){Q.triggerKeydown(T,K,s,a,c);};Q.triggerKeypress=function(T,c,s,a,C){var _=c&&c.toUpperCase();if(q.sap.KeyCodes[_]===null){QUnit.ok(false,"Invalid character for triggerKeypress: '"+c+"'");}var b=c.charCodeAt(0);var P={};P.charCode=b;P.which=b;P.shiftKey=!!s;P.altKey=!!a;P.metaKey=!!C;P.ctrlKey=!!C;Q.triggerEvent("keypress",T,P);};Q.triggerCharacterInput=function(i,c){Q.triggerKeypress(i,c);if(typeof(i)=="string"){i=q.sap.domById(i);}var I=q(i);I.val(I.val()+c);};Q.triggerMouseEvent=function(T,E,o,i,P,a,b){var c={};c.offsetX=o;c.offsetY=i;c.pageX=P;c.pageY=a;c.button=b;Q.triggerEvent(E,T,c);};var F={'normal':400,'bold':700};q.fn.extend({_sapTest_dataEvents:function(){var a=this[0];return a?q._data(a,"events"):null;},_sapTest_cssFontWeight:function(){var v=this.css("font-weight");return v?F[v]||v:v;}});(function(){function m(a){q.sap.log.info(a);}var M={"boolean":[false,true],"int":[0,1,5,10,100],"float":[NaN,0.0,0.01,3.14,97.7],"string":["","some","very long otherwise not normal and so on whatever","<"+"script>alert('XSS attack!');</"+"script>"]};var v=q.sap.newObject(M);function x(o){return o&&!(o instanceof Array)?[o]:o;}Q.resetDefaultTestValues=function(T){if(typeof T==="string"){delete v[T];}else{v=q.sap.newObject(M);}};Q.setDefaultTestValues=function(T,V){if(typeof T==="string"){v[T]=x(V);}else if(typeof T==="object"){q.extend(v,T);}};Q.createSettingsDomain=function(c,P){function a(T){if(v[T]){return v[T];}try{q.sap.require(T);}catch(e){}var i=q.sap.getObject(T);if(!(i instanceof f)){var r=[];for(var n in i){r.push(i[n]);}v[T]=r;return r;}return[];}var c=new c().getMetadata().getClass();var P=P||{};var b={};var o=c.getMetadata().getAllProperties();for(var d in o){b[d]=x(P[d])||a(o[d].type);}return b;};Q.genericTest=function(c,U,T){if(T&&T.skip===true){return;}var c=new c().getMetadata().getClass();var T=T||{};var o=Q.createSettingsDomain(c,T.allPairTestValues||{});m("domain");for(var n in o){var l=o[n].length;var s=[];s.push("  ",n,":","[");for(var i=0;i<l;i++){s.push(o[n][i],",");}s.push("]");m(s.join(""));}function a(P,N){return P+N.substring(0,1).toUpperCase()+N.substring(1);}function b(C,S){var r={};for(var B in S){if(C[a("get",B)]){r[B]=C[a("get",B)]();}}return r;}var C;var S;var d=new Q.AllPairsGenerator(o);var j=[];while(d.hasNext()){j.push(d.next());}var y=0;function z(){m("testNextCombination("+y+")");if(y>=j.length){m("last combination -> done");QUnit.start();return;}C=new c(S);var r=b(C,S);QUnit.deepEqual(r,S,"settings");C.placeAt(U);m("before explicit rerender");C.getUIArea().rerender();m("after explicit rerender");m("info");setTimeout(A,0);}QUnit.stop(15000);z();function A(){m("continueAfterRendering("+y+")");var B=j[j.length-y-1];for(var E in B){var r=C[a("set",E)](B[E]);QUnit.equal(C[a("get",E)](),B[E],"setter for property '"+E+"'");QUnit.ok(r==C,"setter for property '"+E+"' supports chaining (after rendering)");}y=y+1;setTimeout(z,0);}};Q.suppressErrors=function(s){if(s!==false){m("suppress global errors");}else{m("reenable global errors");}};Q.RandomPairsGenerator=function(d){var C=0;for(var n in d){if(d[n]&&!(d[n]instanceof Array)){d[n]=[d[n]];}if(d[n]&&d[n].length>0){if(C==0){C=d[n].length;}else{C=C*d[n].length;}}}function a(i){var s={};for(var b in d){var l=d[b]&&d[b].length;if(l==1){s[b]=d[b][0];}else if(l>1){var c=i%l;s[b]=d[b][c];i=(i-c)/l;}}return s;}this.hasNext=function(){return true;};this.next=function(){return a(Math.floor(100*C*Math.random()));};};Q.AllPairsGenerator=function(o){var l=[];for(var n in o){l.push({name:n,n:o[n].length,values:o[n]});}var N=l.length;var r=[];var s=[];var y=0;for(var a=0;a<N-1;a++){var z=l[a];for(var b=a+1;b<N;b++){var A=l[b];s[a*N+b]=y;for(var i=z.n*A.n;i>0;i--){r[y++]=0;}}}function B(a,b,c,d){return s[a*N+b]+c*l[b].n+d;}function C(){var H=[];function I(a,L){var R={va:L,pairs:0,redundant:0};for(var c=0;c<N;c++){var S;if(c<a){S=r[B(c,a,H[c],L)];}else if(c>a){var j=B(a,c,L,0),T=j+l[c].n;for(S=r[j];S>0&&i<T;j++){if(r[j]<S){S=r[j];}}}R.redundant=R.redundant+S;if(S==0){R.pairs++;}}return R;}for(var d=0;d<N;d++){var J=l[d];var K=I(d,0);for(var L=1;L<J.n;L++){var P=I(d,L);if(P.pairs>K.pairs||(P.pairs==K.pairs&&P.redundant<K.redundant)){K=P;}}H[d]=K.va;}return H;}this.hasNext=function(){return y>0;};var E;var G=-1;this.next=function(){E=C();G=0;var c={};for(var a=0;a<N;a++){for(var b=a+1;b<N;b++){var i=B(a,b,E[a],E[b]);if(r[i]==0){y--;G++;}r[i]++;}c[l[a].name]=l[a].values[E[a]];}return c;};this.lastPairs=function(){return G;};};}());q.sap.setObject("sap.ui.test.qunit",Q);window.qutils=Q;return Q;},true);

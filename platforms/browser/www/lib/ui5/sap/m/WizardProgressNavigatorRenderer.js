/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./WizardProgressNavigator"],function(W){"use strict";var C=W.CLASSES,A=W.ATTRIBUTES,a={};a.render=function(r,c){this.startNavigator(r,c);this.renderList(r,c);this.endNavigator(r);};a.startNavigator=function(r,c){var w=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("WIZARD_LABEL");r.write("<nav");r.writeControlData(c);r.writeAttribute("class",C.NAVIGATION+" sapContrastPlus");r.writeAttribute(A.STEP_COUNT,c.getStepCount());r.writeAccessibilityState({"role":"navigation","label":w});r.write(">");};a.renderList=function(r,c){this.startList(r,c);this.renderSteps(r,c);this.endList(r);};a.startList=function(r,c){var s=c.getStepTitles();r.write("<ul");if(c.getVaryingStepCount()){r.addClass(C.LIST_VARYING);}else{r.addClass(C.LIST);}if(!s.length){r.addClass(C.LIST_NO_TITLES);}r.writeAccessibilityState({"role":"list"});r.writeClasses();r.write(">");};a.renderSteps=function(r,c){var s=c.getStepCount(),S=c.getStepTitles(),b=c.getStepIcons();for(var i=1;i<=s;i++){this.startStep(r,i);this.renderAnchor(r,c,i,S[i-1],b[i-1]);this.endStep(r);}};a.startStep=function(r,s){r.write("<li");r.writeAttribute("class",C.STEP);r.writeAttribute(A.STEP,s);r.writeAccessibilityState({"role":"listitem"});r.write(">");};a.renderAnchor=function(r,c,s,S,i){var b=c._cachedSteps,o=b[s],d=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("WIZARD_PROG_NAV_STEP_TITLE");r.write("<a tabindex='-1' ");if(!o||!!parseInt(o.style.zIndex,10)){r.write("aria-disabled='true'");}r.writeAttribute("class",C.ANCHOR);if(S){r.writeAttributeEscaped("title",s+". "+S);}else{r.writeAttributeEscaped("title",d+" "+s);}r.write(">");r.write("<span");r.writeAttribute("class",C.ANCHOR_CIRCLE);r.write(">");if(i){r.writeIcon(i,[C.ANCHOR_ICON],{title:null});}else{r.write(s);}r.write("</span>");if(S){r.write("<span");r.writeAttribute("class",C.ANCHOR_TITLE);r.write(">");r.writeEscaped(S);r.write("</span>");}r.write("</a>");};a.endStep=function(r){r.write("</li>");};a.endList=function(r){r.write("</ul>");};a.endNavigator=function(r){r.write("</nav>");};return a;},true);

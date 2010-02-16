YUI.add("console",function(D){var G=D.ClassNameManager.getClassName,B="checked",s="clear",r="click",T="collapsed",AE="console",d="contentBox",h="disabled",o="entry",l="error",j="height",P="info",y="innerHTML",M="lastTime",F="pause",f="paused",x="reset",v="startTime",p="title",i="warn",Z=".",X=G(AE,"button"),b=G(AE,"checkbox"),AD=G(AE,s),w=G(AE,"collapse"),S=G(AE,T),E=G(AE,"controls"),e=G(AE,"hd"),c=G(AE,"bd"),C=G(AE,"ft"),k=G(AE,p),z=G(AE,o),t=G(AE,o,"cat"),a=G(AE,o,"content"),U=G(AE,o,"meta"),g=G(AE,o,"src"),A=G(AE,o,"time"),Q=G(AE,F),W=G(AE,F,"label"),n=/^(\S+)\s/,AA=/&/g,u=/>/g,J=/</g,H="&#38;",R="&#62;",m="&#60;",O='<div class="{entry_class} {cat_class} {src_class}">'+'<p class="{entry_meta_class}">'+'<span class="{entry_src_class}">'+"{sourceAndDetail}"+"</span>"+'<span class="{entry_cat_class}">'+"{category}</span>"+'<span class="{entry_time_class}">'+" {totalTime}ms (+{elapsedTime}) {localTime}"+"</span>"+"</p>"+'<pre class="{entry_content_class}">{message}</pre>'+"</div>",I=D.Lang,K=D.Node.create,AC=I.isNumber,N=I.isString,q=D.merge,AB=D.substitute;function V(){V.superclass.constructor.apply(this,arguments);}D.Console=D.extend(V,D.Widget,{_evtCat:null,_head:null,_body:null,_foot:null,_printLoop:null,buffer:null,log:function(){D.log.apply(D,arguments);return this;},clearConsole:function(){this._body.set(y,"");this._cancelPrintLoop();this.buffer=[];return this;},reset:function(){this.fire(x);return this;},collapse:function(){this.set(T,true);return this;},expand:function(){this.set(T,false);return this;},printBuffer:function(Y){var AK=this.buffer,AF=D.config.debug,L=[],AH=this.get("consoleLimit"),AJ=this.get("newestOnTop"),AG=AJ?this._body.get("firstChild"):null,AI;if(AK.length>AH){AK.splice(0,AK.length-AH);}Y=Math.min(AK.length,(Y||AK.length));D.config.debug=false;if(!this.get(f)&&this.get("rendered")){for(AI=0;AI<Y&&AK.length;++AI){L[AI]=this._createEntryHTML(AK.shift());}if(!AK.length){this._cancelPrintLoop();}if(L.length){if(AJ){L.reverse();}this._body.insertBefore(K(L.join("")),AG);if(this.get("scrollIntoView")){this.scrollToLatest();}this._trimOldEntries();}}D.config.debug=AF;return this;},initializer:function(){this._evtCat=D.stamp(this)+"|";this.buffer=[];this.get("logSource").on(this._evtCat+this.get("logEvent"),D.bind("_onLogEvent",this));this.publish(o,{defaultFn:this._defEntryFn});this.publish(x,{defaultFn:this._defResetFn});this.after("rendered",this._schedulePrint);},destructor:function(){var L=this.get("boundingBox");this._cancelPrintLoop();this.get("logSource").detach(this._evtCat+"*");D.Event.purgeElement(L,true);L.set("innerHTML","");},renderUI:function(){this._initHead();this._initBody();this._initFoot();var L=this.get("style");if(L!=="block"){this.get("boundingBox").addClass("yui3-"+L+"-console");}},syncUI:function(){this._uiUpdatePaused(this.get(f));this._uiUpdateCollapsed(this.get(T));this._uiSetHeight(this.get(j));},bindUI:function(){this.get(d).one("button."+w).on(r,this._onCollapseClick,this);this.get(d).one("input[type=checkbox]."+Q).on(r,this._onPauseClick,this);this.get(d).one("button."+AD).on(r,this._onClearClick,this);this.after(this._evtCat+"stringsChange",this._afterStringsChange);this.after(this._evtCat+"pausedChange",this._afterPausedChange);this.after(this._evtCat+"consoleLimitChange",this._afterConsoleLimitChange);this.after(this._evtCat+"collapsedChange",this._afterCollapsedChange);},_initHead:function(){var L=this.get(d),Y=q(V.CHROME_CLASSES,{str_collapse:this.get("strings.collapse"),str_title:this.get("strings.title")});this._head=K(AB(V.HEADER_TEMPLATE,Y));L.insertBefore(this._head,L.get("firstChild"));},_initBody:function(){this._body=K(AB(V.BODY_TEMPLATE,V.CHROME_CLASSES));this.get(d).appendChild(this._body);},_initFoot:function(){var L=q(V.CHROME_CLASSES,{id_guid:D.guid(),str_pause:this.get("strings.pause"),str_clear:this.get("strings.clear")});this._foot=K(AB(V.FOOTER_TEMPLATE,L));this.get(d).appendChild(this._foot);},_isInLogLevel:function(AF){var L=AF.cat,Y=this.get("logLevel");if(Y!==P){L=L||P;if(N(L)){L=L.toLowerCase();}if((L===i&&Y===l)||(L===P&&Y!==P)){return false;}}return true;},_normalizeMessage:function(AF){var AH=AF.msg,Y=AF.cat,AG=AF.src,L={time:new Date(),message:AH,category:Y||this.get("defaultCategory"),sourceAndDetail:AG||this.get("defaultSource"),source:null,localTime:null,elapsedTime:null,totalTime:null};L.source=n.test(L.sourceAndDetail)?RegExp.$1:L.sourceAndDetail;L.localTime=L.time.toLocaleTimeString?L.time.toLocaleTimeString():(L.time+"");L.elapsedTime=L.time-this.get(M);L.totalTime=L.time-this.get(v);this._set(M,L.time);return L;},_schedulePrint:function(){if(!this._printLoop&&!this.get(f)&&this.get("rendered")){this._printLoop=D.later(this.get("printTimeout"),this,this.printBuffer,this.get("printLimit"),true);}},_createEntryHTML:function(L){L=q(this._htmlEscapeMessage(L),V.ENTRY_CLASSES,{cat_class:this.getClassName(o,L.category),src_class:this.getClassName(o,L.source)});return this.get("entryTemplate").replace(/\{(\w+)\}/g,function(Y,AF){return AF in L?L[AF]:"";});},scrollToLatest:function(){var L=this.get("newestOnTop")?0:this._body.get("scrollHeight");this._body.set("scrollTop",L);},_htmlEscapeMessage:function(L){L.message=this._encodeHTML(L.message);L.source=this._encodeHTML(L.source);L.sourceAndDetail=this._encodeHTML(L.sourceAndDetail);L.category=this._encodeHTML(L.category);return L;},_trimOldEntries:function(){D.config.debug=false;var AI=this._body,AF=this.get("consoleLimit"),AG=D.config.debug,L,AJ,AH,Y;if(AI){L=AI.all(Z+z);Y=L.size()-AF;if(Y>0){if(this.get("newestOnTop")){AH=AF;Y=L.size();}else{AH=0;}this._body.setStyle("display","none");for(;AH<Y;++AH){AJ=L.item(AH);if(AJ){AJ.remove();}}this._body.setStyle("display","");}}D.config.debug=AG;},_encodeHTML:function(L){return N(L)?L.replace(AA,H).replace(J,m).replace(u,R):L;},_cancelPrintLoop:function(){if(this._printLoop){this._printLoop.cancel();this._printLoop=null;}},_validateStyle:function(L){return L==="inline"||L==="block"||L==="separate";},_onPauseClick:function(L){this.set(f,L.target.get(B));
},_onClearClick:function(L){this.clearConsole();},_onCollapseClick:function(L){this.set(T,!this.get(T));},_validateLogSource:function(L){return L&&D.Lang.isFunction(L.on);},_setLogLevel:function(L){if(N(L)){L=L.toLowerCase();}return(L===i||L===l)?L:P;},_getUseBrowserConsole:function(){var L=this.get("logSource");return L instanceof YUI?L.config.useBrowserConsole:null;},_setUseBrowserConsole:function(L){var Y=this.get("logSource");if(Y instanceof YUI){L=!!L;Y.config.useBrowserConsole=L;return L;}else{return D.Attribute.INVALID_VALUE;}},_uiSetHeight:function(L){V.superclass._uiSetHeight.apply(this,arguments);if(this._head&&this._foot){var Y=this.get("boundingBox").get("offsetHeight")-this._head.get("offsetHeight")-this._foot.get("offsetHeight");this._body.setStyle(j,Y+"px");}},_afterStringsChange:function(AF){var AH=AF.subAttrName?AF.subAttrName.split(Z)[1]:null,L=this.get(d),Y=AF.prevVal,AG=AF.newVal;if((!AH||AH===p)&&Y.title!==AG.title){L.all(Z+k).set(y,AG.title);}if((!AH||AH===F)&&Y.pause!==AG.pause){L.all(Z+W).set(y,AG.pause);}if((!AH||AH===s)&&Y.clear!==AG.clear){L.all(Z+AD).set("value",AG.clear);}},_afterPausedChange:function(Y){var L=Y.newVal;if(Y.src!==D.Widget.SRC_UI){this._uiUpdatePaused(L);}if(!L){this._schedulePrint();}else{if(this._printLoop){this._cancelPrintLoop();}}},_uiUpdatePaused:function(L){var Y=this._foot.all("input[type=checkbox]."+Q);if(Y){Y.set(B,L);}},_afterConsoleLimitChange:function(){this._trimOldEntries();},_afterCollapsedChange:function(L){this._uiUpdateCollapsed(L.newVal);},_uiUpdateCollapsed:function(L){var AG=this.get("boundingBox"),Y=AG.all("button."+w),AH=L?"addClass":"removeClass",AF=this.get("strings."+(L?"expand":"collapse"));AG[AH](S);if(Y){Y.set("innerHTML",AF);}this._uiSetHeight(L?this._head.get("offsetHeight"):this.get(j));},_afterVisibleChange:function(L){V.superclass._afterVisibleChange.apply(this,arguments);this._uiUpdateFromHideShow(L.newVal);},_uiUpdateFromHideShow:function(L){if(L){this._uiSetHeight(this.get(j));}},_onLogEvent:function(Y){if(!this.get(h)&&this._isInLogLevel(Y)){var L=D.config.debug;D.config.debug=false;this.fire(o,{message:this._normalizeMessage(Y)});D.config.debug=L;}},_defResetFn:function(){this.clearConsole();this.set(v,new Date());this.set(h,false);this.set(f,false);},_defEntryFn:function(L){if(L.message){this.buffer.push(L.message);this._schedulePrint();}}},{NAME:AE,LOG_LEVEL_INFO:P,LOG_LEVEL_WARN:i,LOG_LEVEL_ERROR:l,ENTRY_CLASSES:{entry_class:z,entry_meta_class:U,entry_cat_class:t,entry_src_class:g,entry_time_class:A,entry_content_class:a},CHROME_CLASSES:{console_hd_class:e,console_bd_class:c,console_ft_class:C,console_controls_class:E,console_checkbox_class:b,console_pause_class:Q,console_pause_label_class:W,console_button_class:X,console_clear_class:AD,console_collapse_class:w,console_title_class:k},HEADER_TEMPLATE:'<div class="{console_hd_class}">'+'<h4 class="{console_title_class}">{str_title}</h4>'+'<button type="button" class="'+'{console_button_class} {console_collapse_class}">{str_collapse}'+"</button>"+"</div>",BODY_TEMPLATE:'<div class="{console_bd_class}"></div>',FOOTER_TEMPLATE:'<div class="{console_ft_class}">'+'<div class="{console_controls_class}">'+'<label for="{id_guid}" class="{console_pause_label_class}">'+'<input type="checkbox" class="{console_checkbox_class} '+'{console_pause_class}" value="1" id="{id_guid}"> '+"{str_pause}</label>"+'<button type="button" class="'+'{console_button_class} {console_clear_class}">{str_clear}'+"</button>"+"</div>"+"</div>",ENTRY_TEMPLATE:O,ATTRS:{logEvent:{value:"yui:log",writeOnce:true,validator:N},logSource:{value:D,writeOnce:true,validator:function(L){return this._validateLogSource(L);}},strings:{value:{title:"Log Console",pause:"Pause",clear:"Clear",collapse:"Collapse",expand:"Expand"}},paused:{value:false,validator:I.isBoolean},defaultCategory:{value:P,validator:N},defaultSource:{value:"global",validator:N},entryTemplate:{value:O,validator:N},logLevel:{value:D.config.logLevel||P,setter:function(L){return this._setLogLevel(L);}},printTimeout:{value:100,validator:AC},printLimit:{value:50,validator:AC},consoleLimit:{value:300,validator:AC},newestOnTop:{value:true},scrollIntoView:{value:true},startTime:{value:new Date()},lastTime:{value:new Date(),readOnly:true},collapsed:{value:false},height:{value:"300px"},width:{value:"300px"},useBrowserConsole:{lazyAdd:false,value:false,getter:function(){return this._getUseBrowserConsole();},setter:function(L){return this._setUseBrowserConsole(L);}},style:{value:"separate",writeOnce:true,validator:function(L){return this._validateStyle(L);}}}});},"@VERSION@",{requires:["substitute","widget"]});
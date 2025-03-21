define("@optimizely/optimizely-sdk",["exports"],(function(e){"use strict"
var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{}
function r(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function n(e,t){return e(t={exports:{}},t.exports),t.exports}var i=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0})
var r=function(){function e(){}return e.prototype.handleError=function(e){},e}()
t.NoopErrorHandler=r
var n=new r
t.setErrorHandler=function(e){n=e},t.getErrorHandler=function(){return n},t.resetErrorHandler=function(){n=new r}}))
r(i)
i.NoopErrorHandler,i.setErrorHandler,i.getErrorHandler,i.resetErrorHandler
var o=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.NOTSET=0]="NOTSET",e[e.DEBUG=1]="DEBUG",e[e.INFO=2]="INFO",e[e.WARNING=3]="WARNING",e[e.ERROR=4]="ERROR"}(t.LogLevel||(t.LogLevel={}))}))
r(o)
o.LogLevel
for(var a=n((function(e){var t="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)
if(t){var r=new Uint8Array(16)
e.exports=function(){return t(r),r}}else{var n=new Array(16)
e.exports=function(){for(var e,t=0;t<16;t++)0==(3&t)&&(e=4294967296*Math.random()),n[t]=e>>>((3&t)<<3)&255
return n}}})),s=[],u=0;u<256;++u)s[u]=(u+256).toString(16).substr(1)
var l,c,E=function(e,t){var r=t||0,n=s
return[n[e[r++]],n[e[r++]],n[e[r++]],n[e[r++]],"-",n[e[r++]],n[e[r++]],"-",n[e[r++]],n[e[r++]],"-",n[e[r++]],n[e[r++]],"-",n[e[r++]],n[e[r++]],n[e[r++]],n[e[r++]],n[e[r++]],n[e[r++]]].join("")},f=0,d=0
var p=function(e,t,r){var n=t&&r||0,i=t||[],o=(e=e||{}).node||l,s=void 0!==e.clockseq?e.clockseq:c
if(null==o||null==s){var u=a()
null==o&&(o=l=[1|u[0],u[1],u[2],u[3],u[4],u[5]]),null==s&&(s=c=16383&(u[6]<<8|u[7]))}var p=void 0!==e.msecs?e.msecs:(new Date).getTime(),g=void 0!==e.nsecs?e.nsecs:d+1,I=p-f+(g-d)/1e4
if(I<0&&void 0===e.clockseq&&(s=s+1&16383),(I<0||p>f)&&void 0===e.nsecs&&(g=0),g>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec")
f=p,d=g,c=s
var _=(1e4*(268435455&(p+=122192928e5))+g)%4294967296
i[n++]=_>>>24&255,i[n++]=_>>>16&255,i[n++]=_>>>8&255,i[n++]=255&_
var v=p/4294967296*1e4&268435455
i[n++]=v>>>8&255,i[n++]=255&v,i[n++]=v>>>24&15|16,i[n++]=v>>>16&255,i[n++]=s>>>8|128,i[n++]=255&s
for(var h=0;h<6;++h)i[n+h]=o[h]
return t||E(i)}
var g=function(e,t,r){var n=t&&r||0
"string"==typeof e&&(t="binary"===e?new Array(16):null,e=null)
var i=(e=e||{}).random||(e.rng||a)()
if(i[6]=15&i[6]|64,i[8]=63&i[8]|128,t)for(var o=0;o<16;++o)t[n+o]=i[o]
return t||E(i)},I=g
I.v1=p,I.v4=g
var _=I,v=n((function(e,t){function r(e){return Object.keys(e).map((function(t){return e[t]}))}Object.defineProperty(t,"__esModule",{value:!0}),t.generateUUID=function(){return _.v4()},t.getTimestamp=function(){return(new Date).getTime()},t.isValidEnum=function(e,t){for(var r=!1,n=Object.keys(e),i=0;i<n.length;i++)if(t===e[n[i]]){r=!0
break}return r},t.groupBy=function(e,t){var n={}
return e.forEach((function(e){var r=t(e)
n[r]=n[r]||[],n[r].push(e)})),r(n)},t.objectValues=r,t.objectEntries=function(e){return Object.keys(e).map((function(t){return[t,e[t]]}))},t.find=function(e,t){for(var r,n=0,i=e;n<i.length;n++){var o=i[n]
if(t(o)){r=o
break}}return r},t.keyBy=function(e,t){var r={}
return e.forEach((function(e){var n=t(e)
r[n]=e})),r},t.sprintf=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r]
var n=0
return e.replace(/%s/g,(function(){var e=t[n++],r=typeof e
return"function"===r?e():"string"===r?e:String(e)}))},function(e){e.ACTIVATE="ACTIVATE:experiment, user_id,attributes, variation, event",e.DECISION="DECISION:type, userId, attributes, decisionInfo",e.LOG_EVENT="LOG_EVENT:logEvent",e.OPTIMIZELY_CONFIG_UPDATE="OPTIMIZELY_CONFIG_UPDATE",e.TRACK="TRACK:event_key, user_id, attributes, event_tags, event"}(t.NOTIFICATION_TYPES||(t.NOTIFICATION_TYPES={}))}))
r(v)
v.generateUUID,v.getTimestamp,v.isValidEnum,v.groupBy,v.objectValues,v.objectEntries,v.find,v.keyBy,v.sprintf,v.NOTIFICATION_TYPES
var h=n((function(e,r){var n=t&&t.__spreadArrays||function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length
var n=Array(e),i=0
for(t=0;t<r;t++)for(var o=arguments[t],a=0,s=o.length;a<s;a++,i++)n[i]=o[a]
return n}
Object.defineProperty(r,"__esModule",{value:!0})
var a={NOTSET:0,DEBUG:1,INFO:2,WARNING:3,ERROR:4}
function s(e){return"string"!=typeof e?e:("WARN"===(e=e.toUpperCase())&&(e="WARNING"),a[e]?a[e]:e)}var u=function(){function e(){this.defaultLoggerFacade=new f,this.loggers={}}return e.prototype.getLogger=function(e){return e?(this.loggers[e]||(this.loggers[e]=new f({messagePrefix:e})),this.loggers[e]):this.defaultLoggerFacade},e}(),l=function(){function e(e){void 0===e&&(e={}),this.logLevel=o.LogLevel.NOTSET,void 0!==e.logLevel&&v.isValidEnum(o.LogLevel,e.logLevel)&&this.setLogLevel(e.logLevel),this.logToConsole=void 0===e.logToConsole||!!e.logToConsole,this.prefix=void 0!==e.prefix?e.prefix:"[OPTIMIZELY]"}return e.prototype.log=function(e,t){if(this.shouldLog(e)&&this.logToConsole){var r=this.prefix+" - "+this.getLogLevelName(e)+" "+this.getTime()+" "+t
this.consoleLog(e,[r])}},e.prototype.setLogLevel=function(e){e=s(e),v.isValidEnum(o.LogLevel,e)&&void 0!==e?this.logLevel=e:this.logLevel=o.LogLevel.ERROR},e.prototype.getTime=function(){return(new Date).toISOString()},e.prototype.shouldLog=function(e){return e>=this.logLevel},e.prototype.getLogLevelName=function(e){switch(e){case o.LogLevel.DEBUG:return"DEBUG"
case o.LogLevel.INFO:return"INFO "
case o.LogLevel.WARNING:return"WARN "
case o.LogLevel.ERROR:return"ERROR"
default:return"NOTSET"}},e.prototype.consoleLog=function(e,t){switch(e){case o.LogLevel.DEBUG:console.log.apply(console,t)
break
case o.LogLevel.INFO:console.info.apply(console,t)
break
case o.LogLevel.WARNING:console.warn.apply(console,t)
break
case o.LogLevel.ERROR:console.error.apply(console,t)
break
default:console.log.apply(console,t)}},e}()
r.ConsoleLogHandler=l
var c=o.LogLevel.NOTSET,E=null,f=function(){function e(e){void 0===e&&(e={}),this.messagePrefix="",e.messagePrefix&&(this.messagePrefix=e.messagePrefix)}return e.prototype.log=function(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n]
this.internalLog(s(e),{message:t,splat:r})},e.prototype.info=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r]
this.namedLog(o.LogLevel.INFO,e,t)},e.prototype.debug=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r]
this.namedLog(o.LogLevel.DEBUG,e,t)},e.prototype.warn=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r]
this.namedLog(o.LogLevel.WARNING,e,t)},e.prototype.error=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r]
this.namedLog(o.LogLevel.ERROR,e,t)},e.prototype.format=function(e){return(this.messagePrefix?this.messagePrefix+": ":"")+v.sprintf.apply(void 0,n([e.message],e.splat))},e.prototype.internalLog=function(e,t){E&&(e<c||(E.log(e,this.format(t)),t.error&&t.error instanceof Error&&i.getErrorHandler().handleError(t.error)))},e.prototype.namedLog=function(e,t,r){var n
if(t instanceof Error)return t=(n=t).message,void this.internalLog(e,{error:n,message:t,splat:r})
if(0!==r.length){var i=r[r.length-1]
i instanceof Error&&(n=i,r.splice(-1)),this.internalLog(e,{message:t,error:n,splat:r})}else this.internalLog(e,{message:t,splat:r})},e}(),d=new u
r.getLogger=function(e){return d.getLogger(e)},r.setLogHandler=function(e){E=e},r.setLogLevel=function(e){e=s(e),c=v.isValidEnum(o.LogLevel,e)&&void 0!==e?e:o.LogLevel.ERROR},r.getLogLevel=function(){return c},r.resetLogger=function(){d=new u,c=o.LogLevel.NOTSET}}))
r(h)
h.ConsoleLogHandler,h.getLogger,h.setLogHandler,h.setLogLevel,h.getLogLevel,h.resetLogger
var O=n((function(e,t){function r(e){for(var r in e)t.hasOwnProperty(r)||(t[r]=e[r])}Object.defineProperty(t,"__esModule",{value:!0}),r(i),r(o),r(h)}))
r(O)
var R=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.areEventContextsEqual=void 0,t.areEventContextsEqual=function(e,t){var r=e.context,n=t.context
return r.accountId===n.accountId&&r.projectId===n.projectId&&r.clientName===n.clientName&&r.clientVersion===n.clientVersion&&r.revision===n.revision&&r.anonymizeIP===n.anonymizeIP&&r.botFiltering===n.botFiltering}}))
r(R)
R.areEventContextsEqual
var T=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.DefaultEventQueue=t.SingleEventQueue=void 0
var r=O.getLogger("EventProcessor"),n=function(){function e(e){var t=e.timeout,r=e.callback
this.timeout=Math.max(t,0),this.callback=r}return e.prototype.start=function(){this.timeoutId=setTimeout(this.callback,this.timeout)},e.prototype.refresh=function(){this.stop(),this.start()},e.prototype.stop=function(){this.timeoutId&&clearTimeout(this.timeoutId)},e}(),i=function(){function e(e){var t=e.sink
this.sink=t}return e.prototype.start=function(){},e.prototype.stop=function(){return Promise.resolve()},e.prototype.enqueue=function(e){this.sink([e])},e}()
t.SingleEventQueue=i
var o=function(){function e(e){var t=e.flushInterval,r=e.maxQueueSize,i=e.sink,o=e.batchComparator
this.buffer=[],this.maxQueueSize=Math.max(r,1),this.sink=i,this.batchComparator=o,this.timer=new n({callback:this.flush.bind(this),timeout:t}),this.started=!1}return e.prototype.start=function(){this.started=!0},e.prototype.stop=function(){this.started=!1
var e=this.sink(this.buffer)
return this.buffer=[],this.timer.stop(),e},e.prototype.enqueue=function(e){if(this.started){var t=this.buffer[0]
t&&!this.batchComparator(t,e)&&this.flush(),0===this.buffer.length&&this.timer.refresh(),this.buffer.push(e),this.buffer.length>=this.maxQueueSize&&this.flush()}else r.warn("Queue is stopped, not accepting event")},e.prototype.flush=function(){this.sink(this.buffer),this.buffer=[],this.timer.stop()},e}()
t.DefaultEventQueue=o}))
r(T)
T.DefaultEventQueue,T.SingleEventQueue
var N=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.sendEventNotification=t.getQueue=t.validateAndGetBatchSize=t.validateAndGetFlushInterval=t.DEFAULT_BATCH_SIZE=t.DEFAULT_FLUSH_INTERVAL=void 0,t.DEFAULT_FLUSH_INTERVAL=3e4,t.DEFAULT_BATCH_SIZE=10
var r=O.getLogger("EventProcessor")
t.validateAndGetFlushInterval=function(e){return e<=0&&(r.warn("Invalid flushInterval "+e+", defaulting to "+t.DEFAULT_FLUSH_INTERVAL),e=t.DEFAULT_FLUSH_INTERVAL),e},t.validateAndGetBatchSize=function(e){return(e=Math.floor(e))<1&&(r.warn("Invalid batchSize "+e+", defaulting to "+t.DEFAULT_BATCH_SIZE),e=t.DEFAULT_BATCH_SIZE),e=Math.max(1,e)},t.getQueue=function(e,t,r,n){return e>1?new T.DefaultEventQueue({flushInterval:t,maxQueueSize:e,sink:r,batchComparator:n}):new T.SingleEventQueue({sink:r})},t.sendEventNotification=function(e,t){e&&e.sendNotifications(v.NOTIFICATION_TYPES.LOG_EVENT,t)}}))
r(N)
N.sendEventNotification,N.getQueue,N.validateAndGetBatchSize,N.validateAndGetFlushInterval,N.DEFAULT_BATCH_SIZE,N.DEFAULT_FLUSH_INTERVAL
var y=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0})}))
r(y)
var A=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0})}))
r(A)
var m=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.LocalStorageStore=void 0
var r=O.getLogger("EventProcessor"),n=function(){function e(e){var t=e.key,r=e.maxValues,n=void 0===r?1e3:r
this.LS_KEY=t,this.maxValues=n}return e.prototype.get=function(e){return this.getMap()[e]||null},e.prototype.set=function(e,t){var r=this.getMap()
r[e]=t,this.replace(r)},e.prototype.remove=function(e){var t=this.getMap()
delete t[e],this.replace(t)},e.prototype.values=function(){return v.objectValues(this.getMap())},e.prototype.clear=function(){this.replace({})},e.prototype.replace=function(e){try{window.localStorage&&localStorage.setItem(this.LS_KEY,JSON.stringify(e)),this.clean()}catch(t){r.error(t)}},e.prototype.clean=function(){var e=this.getMap(),t=Object.keys(e),r=t.length-this.maxValues
if(!(r<1)){var n=t.map((function(t){return{key:t,value:e[t]}}))
n.sort((function(e,t){return e.value.timestamp-t.value.timestamp}))
for(var i=0;i<r;i++)delete e[n[i].key]
this.replace(e)}},e.prototype.getMap=function(){try{var e=window.localStorage&&localStorage.getItem(this.LS_KEY)
if(e)return JSON.parse(e)||{}}catch(t){r.error(t)}return{}},e}()
t.LocalStorageStore=n}))
r(m)
m.LocalStorageStore
var L=n((function(e,r){var n,i=t&&t.__extends||(n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])},n(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)})
Object.defineProperty(r,"__esModule",{value:!0}),r.LocalStoragePendingEventsDispatcher=r.PendingEventsDispatcher=void 0
var o=O.getLogger("EventProcessor"),a=function(){function e(e){var t=e.eventDispatcher,r=e.store
this.dispatcher=t,this.store=r}return e.prototype.dispatchEvent=function(e,t){this.send({uuid:v.generateUUID(),timestamp:v.getTimestamp(),request:e},t)},e.prototype.sendPendingEvents=function(){var e=this,t=this.store.values()
o.debug("Sending %s pending events from previous page",t.length),t.forEach((function(t){try{e.send(t,(function(){}))}catch(r){}}))},e.prototype.send=function(e,t){var r=this
this.store.set(e.uuid,e),this.dispatcher.dispatchEvent(e.request,(function(n){r.store.remove(e.uuid),t(n)}))},e}()
r.PendingEventsDispatcher=a
var s=function(e){function t(t){var r=t.eventDispatcher
return e.call(this,{eventDispatcher:r,store:new m.LocalStorageStore({maxValues:100,key:"fs_optly_pending_events"})})||this}return i(t,e),t}(a)
r.LocalStoragePendingEventsDispatcher=s}))
r(L)
L.LocalStoragePendingEventsDispatcher,L.PendingEventsDispatcher
var D=n((function(e,r){var n=t&&t.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])
return e},n.apply(this,arguments)}
Object.defineProperty(r,"__esModule",{value:!0}),r.formatEvents=r.buildConversionEventV1=r.buildImpressionEventV1=r.makeBatchedEventV1=void 0
var i="campaign_activated",o="custom",a="$opt_bot_filtering"
function s(e){var t=[],r=e[0]
return e.forEach((function(e){if("conversion"===e.type||"impression"===e.type){var r=c(e)
"impression"===e.type?r.snapshots.push(l(e)):"conversion"===e.type&&r.snapshots.push(u(e)),t.push(r)}})),{client_name:r.context.clientName,client_version:r.context.clientVersion,account_id:r.context.accountId,project_id:r.context.projectId,revision:r.context.revision,anonymize_ip:r.context.anonymizeIP,enrich_decisions:!0,visitors:t}}function u(e){var t=n({},e.tags)
delete t.revenue,delete t.value
var r={entity_id:e.event.id,key:e.event.key,timestamp:e.timestamp,uuid:e.uuid}
return e.tags&&(r.tags=e.tags),null!=e.value&&(r.value=e.value),null!=e.revenue&&(r.revenue=e.revenue),{events:[r]}}function l(e){var t,r,n=e.layer,o=e.experiment,a=e.variation,s=e.ruleKey,u=e.flagKey,l=e.ruleType,c=e.enabled,E=n?n.id:null
return{decisions:[{campaign_id:E,experiment_id:null!==(t=null==o?void 0:o.id)&&void 0!==t?t:"",variation_id:null!==(r=null==a?void 0:a.id)&&void 0!==r?r:"",metadata:{flag_key:u,rule_key:s,rule_type:l,variation_key:a?a.key:"",enabled:c}}],events:[{entity_id:E,timestamp:e.timestamp,key:i,uuid:e.uuid}]}}function c(e){var t={snapshots:[],visitor_id:e.user.id,attributes:[]}
return e.user.attributes.forEach((function(e){t.attributes.push({entity_id:e.entityId,key:e.key,type:"custom",value:e.value})})),"boolean"==typeof e.context.botFiltering&&t.attributes.push({entity_id:a,key:a,type:o,value:e.context.botFiltering}),t}r.makeBatchedEventV1=s,r.buildImpressionEventV1=function(e){var t=c(e)
return t.snapshots.push(l(e)),{client_name:e.context.clientName,client_version:e.context.clientVersion,account_id:e.context.accountId,project_id:e.context.projectId,revision:e.context.revision,anonymize_ip:e.context.anonymizeIP,enrich_decisions:!0,visitors:[t]}},r.buildConversionEventV1=function(e){var t=c(e)
return t.snapshots.push(u(e)),{client_name:e.context.clientName,client_version:e.context.clientVersion,account_id:e.context.accountId,project_id:e.context.projectId,revision:e.context.revision,anonymize_ip:e.context.anonymizeIP,enrich_decisions:!0,visitors:[t]}},r.formatEvents=function(e){return{url:"https://logx.optimizely.com/v1/events",httpVerb:"POST",params:s(e)}}}))
r(D)
D.formatEvents,D.buildConversionEventV1,D.buildImpressionEventV1,D.makeBatchedEventV1
var U=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0})
var r=function(){function e(){this.reqsInFlightCount=0,this.reqsCompleteResolvers=[]}return e.prototype.trackRequest=function(e){var t=this
this.reqsInFlightCount++
var r=function(){t.reqsInFlightCount--,0===t.reqsInFlightCount&&(t.reqsCompleteResolvers.forEach((function(e){return e()})),t.reqsCompleteResolvers=[])}
e.then(r,r)},e.prototype.onRequestsComplete=function(){var e=this
return new Promise((function(t){0===e.reqsInFlightCount?t():e.reqsCompleteResolvers.push(t)}))},e}()
t.default=r}))
r(U)
var S=n((function(e,r){var n=t&&t.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function a(e){try{u(n.next(e))}catch(t){o(t)}}function s(e){try{u(n.throw(e))}catch(t){o(t)}}function u(e){var t
e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,s)}u((n=n.apply(e,t||[])).next())}))},i=t&&t.__generator||function(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1]
return i[1]},trys:[],ops:[]}
return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o
function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.")
for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i
switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o
break
case 4:return a.label++,{value:o[1],done:!1}
case 5:a.label++,n=o[1],o=[0]
continue
case 7:o=a.ops.pop(),a.trys.pop()
continue
default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0
continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1]
break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o
break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o)
break}i[2]&&a.ops.pop(),a.trys.pop()
continue}o=t.call(e,a)}catch(s){o=[6,s],n=0}finally{r=i=0}if(5&o[0])throw o[1]
return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},o=t&&t.__importDefault||function(e){return e&&e.__esModule?e:{default:e}}
Object.defineProperty(r,"__esModule",{value:!0}),r.LogTierV1EventProcessor=void 0
var a=o(U),s=O.getLogger("LogTierV1EventProcessor"),u=function(){function e(e){var t=e.dispatcher,r=e.flushInterval,n=void 0===r?N.DEFAULT_FLUSH_INTERVAL:r,i=e.batchSize,o=void 0===i?N.DEFAULT_BATCH_SIZE:i,s=e.notificationCenter
this.dispatcher=t,this.notificationCenter=s,this.requestTracker=new a.default,n=N.validateAndGetFlushInterval(n),o=N.validateAndGetBatchSize(o),this.queue=N.getQueue(o,n,this.drainQueue.bind(this),R.areEventContextsEqual)}return e.prototype.drainQueue=function(e){var t=this,r=new Promise((function(r){if(s.debug("draining queue with %s events",e.length),0!==e.length){var n=D.formatEvents(e)
t.dispatcher.dispatchEvent(n,(function(){r()})),N.sendEventNotification(t.notificationCenter,n)}else r()}))
return this.requestTracker.trackRequest(r),r},e.prototype.process=function(e){this.queue.enqueue(e)},e.prototype.stop=function(){try{return this.queue.stop(),this.requestTracker.onRequestsComplete()}catch(e){s.error('Error stopping EventProcessor: "%s"',e.message,e)}return Promise.resolve()},e.prototype.start=function(){return n(this,void 0,void 0,(function(){return i(this,(function(e){return this.queue.start(),[2]}))}))},e}()
r.LogTierV1EventProcessor=u}))
r(S)
S.LogTierV1EventProcessor
var C=n((function(e,r){var n=t&&t.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),i=t&&t.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||n(t,e,r)}
Object.defineProperty(r,"__esModule",{value:!0}),i(R,r),i(N,r),i(y,r),i(A,r),i(L,r),i(D,r),i(S,r)}))
r(C)
var V=n((function(e){(function(){function t(e,t){var r,n,i,o,a,s,u,l
for(r=3&e.length,n=e.length-r,i=t,a=3432918353,s=461845907,l=0;l<n;)u=255&e.charCodeAt(l)|(255&e.charCodeAt(++l))<<8|(255&e.charCodeAt(++l))<<16|(255&e.charCodeAt(++l))<<24,++l,i=27492+(65535&(o=5*(65535&(i=(i^=u=(65535&(u=(u=(65535&u)*a+(((u>>>16)*a&65535)<<16)&4294967295)<<15|u>>>17))*s+(((u>>>16)*s&65535)<<16)&4294967295)<<13|i>>>19))+((5*(i>>>16)&65535)<<16)&4294967295))+((58964+(o>>>16)&65535)<<16)
switch(u=0,r){case 3:u^=(255&e.charCodeAt(l+2))<<16
case 2:u^=(255&e.charCodeAt(l+1))<<8
case 1:i^=u=(65535&(u=(u=(65535&(u^=255&e.charCodeAt(l)))*a+(((u>>>16)*a&65535)<<16)&4294967295)<<15|u>>>17))*s+(((u>>>16)*s&65535)<<16)&4294967295}return i^=e.length,i=2246822507*(65535&(i^=i>>>16))+((2246822507*(i>>>16)&65535)<<16)&4294967295,i=3266489909*(65535&(i^=i>>>13))+((3266489909*(i>>>16)&65535)<<16)&4294967295,(i^=i>>>16)>>>0}var r=t
r.v2=function(e,t){for(var r,n=e.length,i=t^n,o=0;n>=4;)r=1540483477*(65535&(r=255&e.charCodeAt(o)|(255&e.charCodeAt(++o))<<8|(255&e.charCodeAt(++o))<<16|(255&e.charCodeAt(++o))<<24))+((1540483477*(r>>>16)&65535)<<16),i=1540483477*(65535&i)+((1540483477*(i>>>16)&65535)<<16)^(r=1540483477*(65535&(r^=r>>>24))+((1540483477*(r>>>16)&65535)<<16)),n-=4,++o
switch(n){case 3:i^=(255&e.charCodeAt(o+2))<<16
case 2:i^=(255&e.charCodeAt(o+1))<<8
case 1:i=1540483477*(65535&(i^=255&e.charCodeAt(o)))+((1540483477*(i>>>16)&65535)<<16)}return i=1540483477*(65535&(i^=i>>>13))+((1540483477*(i>>>16)&65535)<<16),(i^=i>>>15)>>>0},r.v3=t,e.exports=r})()})),P=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.DEFAULT_UPDATE_INTERVAL=3e5,t.MIN_UPDATE_INTERVAL=1e3,t.DEFAULT_URL_TEMPLATE="https://cdn.optimizely.com/datafiles/%s.json",t.DEFAULT_AUTHENTICATED_URL_TEMPLATE="https://config.optimizely.com/datafiles/auth/%s.json",t.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT=[0,8,16,32,64,128,256,512],t.REQUEST_TIMEOUT_MS=6e4}))
r(P)
P.DEFAULT_UPDATE_INTERVAL,P.MIN_UPDATE_INTERVAL,P.DEFAULT_URL_TEMPLATE,P.DEFAULT_AUTHENTICATED_URL_TEMPLATE,P.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT,P.REQUEST_TIMEOUT_MS
var b=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0})
var r=O.getLogger("DatafileManager")
t.makeGetRequest=function(e,t){var n=new XMLHttpRequest
return{responsePromise:new Promise((function(i,o){n.open("GET",e,!0),function(e,t){Object.keys(e).forEach((function(r){var n=e[r]
t.setRequestHeader(r,n)}))}(t,n),n.onreadystatechange=function(){if(4===n.readyState){if(0===n.status)return void o(new Error("Request error"))
var e=function(e){var t=e.getAllResponseHeaders()
if(null===t)return{}
var r=t.split("\r\n"),n={}
return r.forEach((function(e){var t=e.indexOf(": ")
if(t>-1){var r=e.slice(0,t),i=e.slice(t+2)
i.length>0&&(n[r]=i)}})),n}(n),t={statusCode:n.status,body:n.responseText,headers:e}
i(t)}},n.timeout=P.REQUEST_TIMEOUT_MS,n.ontimeout=function(){r.error("Request timed out")},n.send()})),abort:function(){n.abort()}}}}))
r(b)
b.makeGetRequest
var F=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0})
var r=function(){function e(){this.listeners={},this.listenerId=1}return e.prototype.on=function(e,t){var r=this
this.listeners[e]||(this.listeners[e]={})
var n=String(this.listenerId)
return this.listenerId++,this.listeners[e][n]=t,function(){r.listeners[e]&&delete r.listeners[e][n]}},e.prototype.emit=function(e,t){var r=this.listeners[e]
r&&Object.keys(r).forEach((function(e){(0,r[e])(t)}))},e.prototype.removeAllListeners=function(){this.listeners={}},e}()
t.default=r}))
r(F)
var M=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0})
var r=function(){function e(){this.errorCount=0}return e.prototype.getDelay=function(){return 0===this.errorCount?0:1e3*P.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT[Math.min(P.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT.length-1,this.errorCount)]+Math.round(1e3*Math.random())},e.prototype.countError=function(){this.errorCount<P.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT.length-1&&this.errorCount++},e.prototype.reset=function(){this.errorCount=0},e}()
t.default=r}))
r(M)
var k=n((function(e,r){var n=t&&t.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])
return e},n.apply(this,arguments)},i=t&&t.__importDefault||function(e){return e&&e.__esModule?e:{default:e}}
Object.defineProperty(r,"__esModule",{value:!0})
var o=i(F),a=i(M),s=O.getLogger("DatafileManager")
function u(e){return e>=200&&e<400}var l={get:function(){return Promise.resolve("")},set:function(){return Promise.resolve()},contains:function(){return Promise.resolve(!1)},remove:function(){return Promise.resolve()}},c=function(){function e(e){var t=this,r=n(n({},this.getConfigDefaults()),e),i=r.datafile,u=r.autoUpdate,c=void 0!==u&&u,E=r.sdkKey,f=r.updateInterval,d=void 0===f?P.DEFAULT_UPDATE_INTERVAL:f,p=r.urlTemplate,g=void 0===p?P.DEFAULT_URL_TEMPLATE:p,I=r.cache,_=void 0===I?l:I
this.cache=_,this.cacheKey="opt-datafile-"+E,this.isReadyPromiseSettled=!1,this.readyPromiseResolver=function(){},this.readyPromiseRejecter=function(){},this.readyPromise=new Promise((function(e,r){t.readyPromiseResolver=e,t.readyPromiseRejecter=r})),i?(this.currentDatafile=i,E||this.resolveReadyPromise()):this.currentDatafile="",this.isStarted=!1,this.datafileUrl=v.sprintf(g,E),this.emitter=new o.default,this.autoUpdate=c,!function(e){return e>=P.MIN_UPDATE_INTERVAL}(d)?(s.warn("Invalid updateInterval %s, defaulting to %s",d,P.DEFAULT_UPDATE_INTERVAL),this.updateInterval=P.DEFAULT_UPDATE_INTERVAL):this.updateInterval=d,this.currentTimeout=null,this.currentRequest=null,this.backoffController=new a.default,this.syncOnCurrentRequestComplete=!1}return e.prototype.get=function(){return this.currentDatafile},e.prototype.start=function(){this.isStarted||(s.debug("Datafile manager started"),this.isStarted=!0,this.backoffController.reset(),this.setDatafileFromCacheIfAvailable(),this.syncDatafile())},e.prototype.stop=function(){return s.debug("Datafile manager stopped"),this.isStarted=!1,this.currentTimeout&&(clearTimeout(this.currentTimeout),this.currentTimeout=null),this.emitter.removeAllListeners(),this.currentRequest&&(this.currentRequest.abort(),this.currentRequest=null),Promise.resolve()},e.prototype.onReady=function(){return this.readyPromise},e.prototype.on=function(e,t){return this.emitter.on(e,t)},e.prototype.onRequestRejected=function(e){this.isStarted&&(this.backoffController.countError(),e instanceof Error?s.error("Error fetching datafile: %s",e.message,e):"string"==typeof e?s.error("Error fetching datafile: %s",e):s.error("Error fetching datafile"))},e.prototype.onRequestResolved=function(e){if(this.isStarted){void 0!==e.statusCode&&u(e.statusCode)?this.backoffController.reset():this.backoffController.countError(),this.trySavingLastModified(e.headers)
var t=this.getNextDatafileFromResponse(e)
if(""!==t)if(s.info("Updating datafile from response"),this.currentDatafile=t,this.cache.set(this.cacheKey,t),this.isReadyPromiseSettled){var r={datafile:t}
this.emitter.emit("update",r)}else this.resolveReadyPromise()}},e.prototype.onRequestComplete=function(){this.isStarted&&(this.currentRequest=null,this.isReadyPromiseSettled||this.autoUpdate||this.rejectReadyPromise(new Error("Failed to become ready")),this.autoUpdate&&this.syncOnCurrentRequestComplete&&this.syncDatafile(),this.syncOnCurrentRequestComplete=!1)},e.prototype.syncDatafile=function(){var e=this,t={}
this.lastResponseLastModified&&(t["if-modified-since"]=this.lastResponseLastModified),s.debug("Making datafile request to url %s with headers: %s",this.datafileUrl,(function(){return JSON.stringify(t)})),this.currentRequest=this.makeGetRequest(this.datafileUrl,t)
var r=function(){e.onRequestComplete()}
this.currentRequest.responsePromise.then((function(t){e.onRequestResolved(t)}),(function(t){e.onRequestRejected(t)})).then(r,r),this.autoUpdate&&this.scheduleNextUpdate()},e.prototype.resolveReadyPromise=function(){this.readyPromiseResolver(),this.isReadyPromiseSettled=!0},e.prototype.rejectReadyPromise=function(e){this.readyPromiseRejecter(e),this.isReadyPromiseSettled=!0},e.prototype.scheduleNextUpdate=function(){var e=this,t=this.backoffController.getDelay(),r=Math.max(t,this.updateInterval)
s.debug("Scheduling sync in %s ms",r),this.currentTimeout=setTimeout((function(){e.currentRequest?e.syncOnCurrentRequestComplete=!0:e.syncDatafile()}),r)},e.prototype.getNextDatafileFromResponse=function(e){return s.debug("Response status code: %s",e.statusCode),void 0===e.statusCode||304===e.statusCode?"":u(e.statusCode)?e.body:""},e.prototype.trySavingLastModified=function(e){var t=e["last-modified"]||e["Last-Modified"]
void 0!==t&&(this.lastResponseLastModified=t,s.debug("Saved last modified header value from response: %s",this.lastResponseLastModified))},e.prototype.setDatafileFromCacheIfAvailable=function(){var e=this
this.cache.get(this.cacheKey).then((function(t){e.isStarted&&!e.isReadyPromiseSettled&&""!==t&&(s.debug("Using datafile from cache"),e.currentDatafile=t,e.resolveReadyPromise())}))},e}()
r.default=c}))
r(k)
var x=n((function(e,r){var n,i=t&&t.__extends||(n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},n(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=t&&t.__importDefault||function(e){return e&&e.__esModule?e:{default:e}}
Object.defineProperty(r,"__esModule",{value:!0})
var a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return i(t,e),t.prototype.makeGetRequest=function(e,t){return b.makeGetRequest(e,t)},t.prototype.getConfigDefaults=function(){return{autoUpdate:!1}},t}(o(k).default)
r.default=a}))
r(x)
var B=n((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.HttpPollingDatafileManager=x.default}))
r(B)
B.HttpPollingDatafileManager
var K=n((function(e,t){function r(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(t,"__esModule",{value:!0})
var n=O,i=C,o=r(_),a=r(V),s=B,u=function(){return(u=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])
return e}).apply(this,arguments)}
function l(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length
var n=Array(e),i=0
for(t=0;t<r;t++)for(var o=arguments[t],a=0,s=o.length;a<s;a++,i++)n[i]=o[a]
return n}var c=Math.pow(2,53)
function E(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r]
if(!e)return{}
if("function"==typeof Object.assign)return Object.assign.apply(Object,l([e],t))
for(var n=Object(e),i=0;i<t.length;i++){var o=t[i]
if(null!=o)for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(n[a]=o[a])}return n}function f(e,t){return e?I(e,(function(e){return e[t]})):{}}function d(e){return Object.keys(e).map((function(t){return e[t]}))}function p(e){return Object.keys(e).map((function(t){return[t,e[t]]}))}function g(e,t){for(var r,n=0,i=e;n<i.length;n++){var o=i[n]
if(t(o)){r=o
break}}return r}function I(e,t){var r={}
return e.forEach((function(e){var n=t(e)
r[n]=e})),r}function v(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r]
var n=0
return e.replace(/%s/g,(function(){var e=t[n++],r=typeof e
return"function"===r?e():"string"===r?e:String(e)}))}var h,R={assign:E,currentTimestamp:function(){return Math.round((new Date).getTime())},isSafeInteger:function(e){return"number"==typeof e&&Math.abs(e)<=c},keyBy:f,uuid:function(){return o()},isNumber:function(e){return"number"==typeof e},getTimestamp:function(){return(new Date).getTime()},isValidEnum:function(e,t){for(var r=!1,n=Object.keys(e),i=0;i<n.length;i++)if(t===e[n[i]]){r=!0
break}return r},groupBy:function(e,t){var r={}
return e.forEach((function(e){var n=t(e)
r[n]=r[n]||[],r[n].push(e)})),d(r)},objectValues:d,objectEntries:p,find:g,keyByUtil:I,sprintf:v},T={NOTSET:0,DEBUG:1,INFO:2,WARNING:3,ERROR:4},N={CONDITION_EVALUATOR_ERROR:"%s: Error evaluating audience condition of type %s: %s",DATAFILE_AND_SDK_KEY_MISSING:"%s: You must provide at least one of sdkKey or datafile. Cannot start Optimizely",EXPERIMENT_KEY_NOT_IN_DATAFILE:"%s: Experiment key %s is not in datafile.",FEATURE_NOT_IN_DATAFILE:"%s: Feature key %s is not in datafile.",IMPROPERLY_FORMATTED_EXPERIMENT:"%s: Experiment key %s is improperly formatted.",INVALID_ATTRIBUTES:"%s: Provided attributes are in an invalid format.",INVALID_BUCKETING_ID:"%s: Unable to generate hash for bucketing ID %s: %s",INVALID_DATAFILE:"%s: Datafile is invalid - property %s: %s",INVALID_DATAFILE_MALFORMED:"%s: Datafile is invalid because it is malformed.",INVALID_CONFIG:"%s: Provided Optimizely config is in an invalid format.",INVALID_JSON:"%s: JSON object is not valid.",INVALID_ERROR_HANDLER:'%s: Provided "errorHandler" is in an invalid format.',INVALID_EVENT_DISPATCHER:'%s: Provided "eventDispatcher" is in an invalid format.',INVALID_EVENT_TAGS:"%s: Provided event tags are in an invalid format.",INVALID_EXPERIMENT_KEY:"%s: Experiment key %s is not in datafile. It is either invalid, paused, or archived.",INVALID_EXPERIMENT_ID:"%s: Experiment ID %s is not in datafile.",INVALID_GROUP_ID:"%s: Group ID %s is not in datafile.",INVALID_LOGGER:'%s: Provided "logger" is in an invalid format.',INVALID_ROLLOUT_ID:"%s: Invalid rollout ID %s attached to feature %s",INVALID_USER_ID:"%s: Provided user ID is in an invalid format.",INVALID_USER_PROFILE_SERVICE:"%s: Provided user profile service instance is in an invalid format: %s.",NO_DATAFILE_SPECIFIED:"%s: No datafile specified. Cannot start optimizely.",NO_JSON_PROVIDED:"%s: No JSON object to validate against schema.",NO_VARIATION_FOR_EXPERIMENT_KEY:"%s: No variation key %s defined in datafile for experiment %s.",UNDEFINED_ATTRIBUTE:"%s: Provided attribute: %s has an undefined value.",UNRECOGNIZED_ATTRIBUTE:"%s: Unrecognized attribute %s provided. Pruning before sending event to Optimizely.",UNABLE_TO_CAST_VALUE:"%s: Unable to cast value %s to type %s, returning null.",USER_NOT_IN_FORCED_VARIATION:"%s: User %s is not in the forced variation map. Cannot remove their forced variation.",USER_PROFILE_LOOKUP_ERROR:'%s: Error while looking up user profile for user ID "%s": %s.',USER_PROFILE_SAVE_ERROR:'%s: Error while saving user profile for user ID "%s": %s.',VARIABLE_KEY_NOT_IN_DATAFILE:'%s: Variable with key "%s" associated with feature with key "%s" is not in datafile.',VARIATION_ID_NOT_IN_DATAFILE:"%s: No variation ID %s defined in datafile for experiment %s.",VARIATION_ID_NOT_IN_DATAFILE_NO_EXPERIMENT:"%s: Variation ID %s is not in the datafile.",INVALID_INPUT_FORMAT:"%s: Provided %s is in an invalid format.",INVALID_DATAFILE_VERSION:"%s: This version of the JavaScript SDK does not support the given datafile version: %s",INVALID_VARIATION_KEY:"%s: Provided variation key is in an invalid format."},y={ACTIVATE_USER:"%s: Activating user %s in experiment %s.",DISPATCH_CONVERSION_EVENT:"%s: Dispatching conversion event to URL %s with params %s.",DISPATCH_IMPRESSION_EVENT:"%s: Dispatching impression event to URL %s with params %s.",DEPRECATED_EVENT_VALUE:"%s: Event value is deprecated in %s call.",EVENT_KEY_NOT_FOUND:"%s: Event key %s is not in datafile.",EXPERIMENT_NOT_RUNNING:"%s: Experiment %s is not running.",FEATURE_ENABLED_FOR_USER:"%s: Feature %s is enabled for user %s.",FEATURE_NOT_ENABLED_FOR_USER:"%s: Feature %s is not enabled for user %s.",FEATURE_HAS_NO_EXPERIMENTS:"%s: Feature %s is not attached to any experiments.",FAILED_TO_PARSE_VALUE:'%s: Failed to parse event value "%s" from event tags.',FAILED_TO_PARSE_REVENUE:'%s: Failed to parse revenue value "%s" from event tags.',FORCED_BUCKETING_FAILED:"%s: Variation key %s is not in datafile. Not activating user %s.",INVALID_OBJECT:"%s: Optimizely object is not valid. Failing %s.",INVALID_CLIENT_ENGINE:"%s: Invalid client engine passed: %s. Defaulting to node-sdk.",INVALID_DEFAULT_DECIDE_OPTIONS:"%s: Provided default decide options is not an array.",INVALID_DECIDE_OPTIONS:"%s: Provided decide options is not an array. Using default decide options.",INVALID_VARIATION_ID:"%s: Bucketed into an invalid variation ID. Returning null.",NOTIFICATION_LISTENER_EXCEPTION:"%s: Notification listener for (%s) threw exception: %s",NO_ROLLOUT_EXISTS:"%s: There is no rollout of feature %s.",NOT_ACTIVATING_USER:"%s: Not activating user %s for experiment %s.",NOT_TRACKING_USER:"%s: Not tracking user %s.",PARSED_REVENUE_VALUE:'%s: Parsed revenue value "%s" from event tags.',PARSED_NUMERIC_VALUE:'%s: Parsed event value "%s" from event tags.',RETURNING_STORED_VARIATION:'%s: Returning previously activated variation "%s" of experiment "%s" for user "%s" from user profile.',ROLLOUT_HAS_NO_EXPERIMENTS:"%s: Rollout of feature %s has no experiments",SAVED_VARIATION:'%s: Saved variation "%s" of experiment "%s" for user "%s".',SAVED_VARIATION_NOT_FOUND:"%s: User %s was previously bucketed into variation with ID %s for experiment %s, but no matching variation was found.",SHOULD_NOT_DISPATCH_ACTIVATE:'%s: Experiment %s is not in "Running" state. Not activating user.',SKIPPING_JSON_VALIDATION:"%s: Skipping JSON schema validation.",TRACK_EVENT:"%s: Tracking event %s for user %s.",UNRECOGNIZED_DECIDE_OPTION:"%s: Unrecognized decide option %s provided.",USER_ASSIGNED_TO_EXPERIMENT_BUCKET:"%s: Assigned bucket %s to user with bucketing ID %s.",USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP:"%s: User %s is in experiment %s of group %s.",USER_BUCKETED_INTO_TARGETING_RULE:"%s: User %s bucketed into targeting rule %s.",USER_IN_FEATURE_EXPERIMENT:"%s: User %s is in variation %s of experiment %s on the feature %s.",USER_IN_ROLLOUT:"%s: User %s is in rollout of feature %s.",USER_NOT_BUCKETED_INTO_EVERYONE_TARGETING_RULE:"%s: User %s not bucketed into everyone targeting rule due to traffic allocation.",USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP:"%s: User %s is not in experiment %s of group %s.",USER_NOT_BUCKETED_INTO_ANY_EXPERIMENT_IN_GROUP:"%s: User %s is not in any experiment of group %s.",USER_NOT_BUCKETED_INTO_TARGETING_RULE:"%s User %s not bucketed into targeting rule %s due to traffic allocation. Trying everyone rule.",USER_NOT_IN_FEATURE_EXPERIMENT:"%s: User %s is not in any experiment on the feature %s.",USER_NOT_IN_ROLLOUT:"%s: User %s is not in rollout of feature %s.",USER_FORCED_IN_VARIATION:"%s: User %s is forced in variation %s.",USER_MAPPED_TO_FORCED_VARIATION:"%s: Set variation %s for experiment %s and user %s in the forced variation map.",USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE:"%s: User %s does not meet conditions for targeting rule %s.",USER_MEETS_CONDITIONS_FOR_TARGETING_RULE:"%s: User %s meets conditions for targeting rule %s.",USER_HAS_VARIATION:"%s: User %s is in variation %s of experiment %s.",USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED:"Variation (%s) is mapped to flag (%s), rule (%s) and user (%s) in the forced decision map.",USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED:"Variation (%s) is mapped to flag (%s) and user (%s) in the forced decision map.",USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED_BUT_INVALID:"Invalid variation is mapped to flag (%s), rule (%s) and user (%s) in the forced decision map.",USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED_BUT_INVALID:"Invalid variation is mapped to flag (%s) and user (%s) in the forced decision map.",USER_HAS_FORCED_VARIATION:"%s: Variation %s is mapped to experiment %s and user %s in the forced variation map.",USER_HAS_NO_VARIATION:"%s: User %s is in no variation of experiment %s.",USER_HAS_NO_FORCED_VARIATION:"%s: User %s is not in the forced variation map.",USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT:"%s: No experiment %s mapped to user %s in the forced variation map.",USER_NOT_IN_ANY_EXPERIMENT:"%s: User %s is not in any experiment of group %s.",USER_NOT_IN_EXPERIMENT:"%s: User %s does not meet conditions to be in experiment %s.",USER_RECEIVED_DEFAULT_VARIABLE_VALUE:'%s: User "%s" is not in any variation or rollout rule. Returning default value for variable "%s" of feature flag "%s".',FEATURE_NOT_ENABLED_RETURN_DEFAULT_VARIABLE_VALUE:'%s: Feature "%s" is not enabled for user %s. Returning the default variable value "%s".',VARIABLE_NOT_USED_RETURN_DEFAULT_VARIABLE_VALUE:'%s: Variable "%s" is not used in variation "%s". Returning default value.',USER_RECEIVED_VARIABLE_VALUE:'%s: Got variable value "%s" for variable "%s" of feature flag "%s"',VALID_DATAFILE:"%s: Datafile is valid.",VALID_USER_PROFILE_SERVICE:"%s: Valid user profile service provided.",VARIATION_REMOVED_FOR_USER:"%s: Variation mapped to experiment %s has been removed for user %s.",VARIABLE_REQUESTED_WITH_WRONG_TYPE:'%s: Requested variable type "%s", but variable is of type "%s". Use correct API to retrieve value. Returning None.',VALID_BUCKETING_ID:'%s: BucketingId is valid: "%s"',BUCKETING_ID_NOT_STRING:"%s: BucketingID attribute is not a string. Defaulted to userId",EVALUATING_AUDIENCE:'%s: Starting to evaluate audience "%s" with conditions: %s.',EVALUATING_AUDIENCES_COMBINED:'%s: Evaluating audiences for %s "%s": %s.',AUDIENCE_EVALUATION_RESULT:'%s: Audience "%s" evaluated to %s.',AUDIENCE_EVALUATION_RESULT_COMBINED:"%s: Audiences for %s %s collectively evaluated to %s.",MISSING_ATTRIBUTE_VALUE:'%s: Audience condition %s evaluated to UNKNOWN because no value was passed for user attribute "%s".',UNEXPECTED_CONDITION_VALUE:"%s: Audience condition %s evaluated to UNKNOWN because the condition value is not supported.",UNEXPECTED_TYPE:'%s: Audience condition %s evaluated to UNKNOWN because a value of type "%s" was passed for user attribute "%s".',UNEXPECTED_TYPE_NULL:'%s: Audience condition %s evaluated to UNKNOWN because a null value was passed for user attribute "%s".',UNKNOWN_CONDITION_TYPE:"%s: Audience condition %s has an unknown condition type. You may need to upgrade to a newer release of the Optimizely SDK.",UNKNOWN_MATCH_TYPE:"%s: Audience condition %s uses an unknown match type. You may need to upgrade to a newer release of the Optimizely SDK.",UPDATED_OPTIMIZELY_CONFIG:"%s: Updated Optimizely config to revision %s (project id %s)",OUT_OF_BOUNDS:'%s: Audience condition %s evaluated to UNKNOWN because the number value for user attribute "%s" is not in the range [-2^53, +2^53].',UNABLE_TO_ATTACH_UNLOAD:'%s: unable to bind optimizely.close() to page unload event: "%s"'},A={BOT_FILTERING:"$opt_bot_filtering",BUCKETING_ID:"$opt_bucketing_id",STICKY_BUCKETING_KEY:"$opt_experiment_bucket_map",USER_AGENT:"$opt_user_agent",FORCED_DECISION_NULL_RULE_KEY:"$opt_null_rule_key"},m={AB_TEST:"ab-test",FEATURE:"feature",FEATURE_TEST:"feature-test",FEATURE_VARIABLE:"feature-variable",ALL_FEATURE_VARIABLES:"all-feature-variables",FLAG:"flag"},L={FEATURE_TEST:"feature-test",ROLLOUT:"rollout",EXPERIMENT:"experiment"},D={RULE:"rule",EXPERIMENT:"experiment"},U={BOOLEAN:"boolean",DOUBLE:"double",INTEGER:"integer",STRING:"string",JSON:"json"},S={V2:"2",V3:"3",V4:"4"},P={SDK_NOT_READY:"Optimizely SDK not configured properly yet.",FLAG_KEY_INVALID:'No flag was found for key "%s".',VARIABLE_VALUE_INVALID:'Variable value for key "%s" is invalid or wrong type.'}
!function(e){e.ACTIVATE="ACTIVATE:experiment, user_id,attributes, variation, event",e.DECISION="DECISION:type, userId, attributes, decisionInfo",e.LOG_EVENT="LOG_EVENT:logEvent",e.OPTIMIZELY_CONFIG_UPDATE="OPTIMIZELY_CONFIG_UPDATE",e.TRACK="TRACK:event_key, user_id, attributes, event_tags, event"}(h||(h={}))
var b=Object.freeze({__proto__:null,LOG_LEVEL:T,ERROR_MESSAGES:N,LOG_MESSAGES:y,CONTROL_ATTRIBUTES:A,JAVASCRIPT_CLIENT_ENGINE:"javascript-sdk",NODE_CLIENT_ENGINE:"node-sdk",REACT_CLIENT_ENGINE:"react-sdk",REACT_NATIVE_CLIENT_ENGINE:"react-native-sdk",REACT_NATIVE_JS_CLIENT_ENGINE:"react-native-js-sdk",BROWSER_CLIENT_VERSION:"4.9.4",NODE_CLIENT_VERSION:"4.9.4",DECISION_NOTIFICATION_TYPES:m,DECISION_SOURCES:L,AUDIENCE_EVALUATION_TYPES:D,FEATURE_VARIABLE_TYPES:U,DATAFILE_VERSIONS:S,DECISION_MESSAGES:P,get NOTIFICATION_TYPES(){return h}}),F="CONFIG_VALIDATOR",M=[S.V2,S.V3,S.V4],k={handleError:function(){}},x={dispatchEvent:function(e,t){var r,n=e.params,i=e.url
"POST"===e.httpVerb?((r=new XMLHttpRequest).open("POST",i,!0),r.setRequestHeader("Content-Type","application/json"),r.onreadystatechange=function(){if(4===r.readyState&&t&&"function"==typeof t)try{t({statusCode:r.status})}catch(e){}},r.send(JSON.stringify(n))):(i+="?wxhr=true",n&&(i+="&"+function(e){return Object.keys(e).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")}(n)),(r=new XMLHttpRequest).open("GET",i,!0),r.onreadystatechange=function(){if(4===r.readyState&&t&&"function"==typeof t)try{t({statusCode:r.status})}catch(e){}},r.send())}},K=function(){function e(){}return e.prototype.log=function(){},e}()
function w(e){return new n.ConsoleLogHandler(e)}var G,j,H=Object.freeze({__proto__:null,NoOpLogger:K,createLogger:w,createNoOpLogger:function(){return new K}})
function Y(e,t,r){return{variationKey:null,enabled:!1,variables:{},ruleKey:null,flagKey:e,userContext:t,reasons:r}}!function(e){e.BOOLEAN="boolean",e.DOUBLE="double",e.INTEGER="integer",e.STRING="string",e.JSON="json"}(G||(G={})),(j=t.OptimizelyDecideOption||(t.OptimizelyDecideOption={})).DISABLE_DECISION_EVENT="DISABLE_DECISION_EVENT",j.ENABLED_FLAGS_ONLY="ENABLED_FLAGS_ONLY",j.IGNORE_USER_PROFILE_SERVICE="IGNORE_USER_PROFILE_SERVICE",j.INCLUDE_REASONS="INCLUDE_REASONS",j.EXCLUDE_VARIABLES="EXCLUDE_VARIABLES"
var z=function(){function e(e){var t,r=e.optimizely,n=e.userId,i=e.attributes
this.optimizely=r,this.userId=n,this.attributes=null!==(t=u({},i))&&void 0!==t?t:{},this.forcedDecisionsMap={}}return e.prototype.setAttribute=function(e,t){this.attributes[e]=t},e.prototype.getUserId=function(){return this.userId},e.prototype.getAttributes=function(){return u({},this.attributes)},e.prototype.getOptimizely=function(){return this.optimizely},e.prototype.decide=function(e,t){return void 0===t&&(t=[]),this.optimizely.decide(this.cloneUserContext(),e,t)},e.prototype.decideForKeys=function(e,t){return void 0===t&&(t=[]),this.optimizely.decideForKeys(this.cloneUserContext(),e,t)},e.prototype.decideAll=function(e){return void 0===e&&(e=[]),this.optimizely.decideAll(this.cloneUserContext(),e)},e.prototype.trackEvent=function(e,t){this.optimizely.track(e,this.userId,this.attributes,t)},e.prototype.setForcedDecision=function(e,t){var r,n=e.flagKey,i=null!==(r=e.ruleKey)&&void 0!==r?r:A.FORCED_DECISION_NULL_RULE_KEY,o={variationKey:t.variationKey}
return this.forcedDecisionsMap[n]||(this.forcedDecisionsMap[n]={}),this.forcedDecisionsMap[n][i]=o,!0},e.prototype.getForcedDecision=function(e){return this.findForcedDecision(e)},e.prototype.removeForcedDecision=function(e){var t,r=null!==(t=e.ruleKey)&&void 0!==t?t:A.FORCED_DECISION_NULL_RULE_KEY,n=e.flagKey,i=!1
return this.forcedDecisionsMap.hasOwnProperty(n)&&(this.forcedDecisionsMap[n].hasOwnProperty(r)&&(delete this.forcedDecisionsMap[n][r],i=!0),0===Object.keys(this.forcedDecisionsMap[n]).length&&delete this.forcedDecisionsMap[n]),i},e.prototype.removeAllForcedDecisions=function(){return this.forcedDecisionsMap={},!0},e.prototype.findForcedDecision=function(e){var t,r=null!==(t=e.ruleKey)&&void 0!==t?t:A.FORCED_DECISION_NULL_RULE_KEY,n=e.flagKey
if(this.forcedDecisionsMap.hasOwnProperty(e.flagKey)){var i=this.forcedDecisionsMap[n]
if(i.hasOwnProperty(r))return{variationKey:i[r].variationKey}}return null},e.prototype.cloneUserContext=function(){var t=new e({optimizely:this.getOptimizely(),userId:this.getUserId(),attributes:this.getAttributes()})
return Object.keys(this.forcedDecisionsMap).length>0&&(t.forcedDecisionsMap=u({},this.forcedDecisionsMap)),t},e}(),X=["and","or","not"]
function q(e,t){if(Array.isArray(e)){var r=e[0],n=e.slice(1)
switch("string"==typeof r&&-1===X.indexOf(r)&&(r="or",n=e),r){case"and":return function(e,t){var r=!1
if(Array.isArray(e)){for(var n=0;n<e.length;n++){var i=q(e[n],t)
if(!1===i)return!1
null===i&&(r=!0)}return!r||null}return null}(n,t)
case"not":return function(e,t){if(Array.isArray(e)&&e.length>0){var r=q(e[0],t)
return null===r?null:!r}return null}(n,t)
default:return function(e,t){var r=!1
if(Array.isArray(e)){for(var n=0;n<e.length;n++){var i=q(e[n],t)
if(!0===i)return!0
null===i&&(r=!0)}return!!r&&null}return null}(n,t)}}return t(e)}var J=function(){function e(t,r){var n,i
this.sdkKey=null!==(n=t.sdkKey)&&void 0!==n?n:"",this.environmentKey=null!==(i=t.environmentKey)&&void 0!==i?i:"",this.attributes=t.attributes,this.audiences=e.getAudiences(t),this.events=t.events,this.revision=t.revision
var o=(t.featureFlags||[]).reduce((function(e,t){return e[t.id]=t.variables,e}),{}),a=e.getVariableIdMap(t),s=e.getExperimentsMapById(t,o,a)
this.experimentsMap=e.getExperimentsKeyMap(s),this.featuresMap=e.getFeaturesMap(t,o,s,a),this.datafile=r}return e.prototype.getDatafile=function(){return this.datafile},e.getAudiences=function(e){var t=[],r=[]
return(e.typedAudiences||[]).forEach((function(e){t.push({id:e.id,conditions:JSON.stringify(e.conditions),name:e.name}),r.push(e.id)})),(e.audiences||[]).forEach((function(e){-1===r.indexOf(e.id)&&"$opt_dummy_audience"!=e.id&&t.push({id:e.id,conditions:JSON.stringify(e.conditions),name:e.name})})),t},e.getSerializedAudiences=function(t,r){var n=""
if(t){var i=""
t.forEach((function(t){var o=""
if(t instanceof Array)o="("+(o=e.getSerializedAudiences(t,r))+")"
else if(X.indexOf(t)>-1)i=t.toUpperCase()
else{var a=r[t]?r[t].name:t
n||"NOT"===i?(i=""===i?"OR":i,n=""===n?i+' "'+r[t].name+'"':n.concat(" "+i+' "'+a+'"')):n='"'+a+'"'}""!==o&&(""!==n||"NOT"===i?(i=""===i?"OR":i,n=""===n?i+" "+o:n.concat(" "+i+" "+o)):n=n.concat(o))}))}return n},e.getExperimentAudiences=function(t,r){return t.audienceConditions?e.getSerializedAudiences(t.audienceConditions,r.audiencesById):""},e.mergeFeatureVariables=function(e,t,r,n,i){var o=(e[r]||[]).reduce((function(e,t){return e[t.key]={id:t.id,key:t.key,type:t.type,value:t.defaultValue},e}),{})
return(n||[]).forEach((function(e){var r=t[e.id],n={id:e.id,key:r.key,type:r.type,value:i?e.value:r.defaultValue}
o[r.key]=n})),o},e.getVariationsMap=function(t,r,n,i){return t.reduce((function(t,o){var a=e.mergeFeatureVariables(r,n,i,o.variables,o.featureEnabled)
return t[o.key]={id:o.id,key:o.key,featureEnabled:o.featureEnabled,variablesMap:a},t}),{})},e.getVariableIdMap=function(e){return(e.featureFlags||[]).reduce((function(e,t){return t.variables.forEach((function(t){e[t.id]=t})),e}),{})},e.getDeliveryRules=function(t,r,n,i,o){return i.map((function(i){return{id:i.id,key:i.key,audiences:e.getExperimentAudiences(i,t),variationsMap:e.getVariationsMap(i.variations,r,o,n)}}))},e.getRolloutExperimentIds=function(e){var t=[]
return(e||[]).forEach((function(e){e.experiments.forEach((function(e){t.push(e.id)}))})),t},e.getExperimentsMapById=function(t,r,n){var i=this.getRolloutExperimentIds(t.rollouts)
return(t.experiments||[]).reduce((function(o,a){if(-1===i.indexOf(a.id)){var s=t.experimentFeatureMap[a.id],u=""
s&&s.length>0&&(u=s[0])
var l=e.getVariationsMap(a.variations,r,n,u.toString())
o[a.id]={id:a.id,key:a.key,audiences:e.getExperimentAudiences(a,t),variationsMap:l}}return o}),{})},e.getExperimentsKeyMap=function(e){var t={}
for(var r in e){var n=e[r]
t[n.key]=n}return t},e.getFeaturesMap=function(t,r,n,i){var o={}
return t.featureFlags.forEach((function(a){var s={},u=[]
a.experimentIds.forEach((function(e){var t=n[e]
t&&(s[t.key]=t),u.push(n[e])}))
var l=(a.variables||[]).reduce((function(e,t){return e[t.key]={id:t.id,key:t.key,type:t.type,value:t.defaultValue},e}),{}),c=[],E=t.rolloutIdMap[a.rolloutId]
E&&(c=e.getDeliveryRules(t,r,a.id,E.experiments,i)),o[a.key]={id:a.id,key:a.key,experimentRules:u,deliveryRules:c,experimentsMap:s,variablesMap:l}})),o},e}(),W="PROJECT_CONFIG",Z=function(e,t){void 0===t&&(t=null)
var r,n,i,o,a=((o=E({},r=e)).audiences=(r.audiences||[]).map((function(e){return E({},e)})),o.experiments=(r.experiments||[]).map((function(e){return E({},e)})),o.featureFlags=(r.featureFlags||[]).map((function(e){return E({},e)})),o.groups=(r.groups||[]).map((function(e){var t=E({},e)
return t.experiments=(e.experiments||[]).map((function(e){return E({},e)})),t})),o.rollouts=(r.rollouts||[]).map((function(e){var t=E({},e)
return t.experiments=(e.experiments||[]).map((function(e){return E({},e)})),t})),o.environmentKey=null!==(n=r.environmentKey)&&void 0!==n?n:"",o.sdkKey=null!==(i=r.sdkKey)&&void 0!==i?i:"",o)
return a.__datafileStr=null===t?JSON.stringify(e):t,(a.audiences||[]).forEach((function(e){e.conditions=JSON.parse(e.conditions)})),a.audiencesById=f(a.audiences,"id"),E(a.audiencesById,f(a.typedAudiences,"id")),a.attributeKeyMap=f(a.attributes,"key"),a.eventKeyMap=f(a.events,"key"),a.groupIdMap=f(a.groups,"id"),Object.keys(a.groupIdMap||{}).forEach((function(e){(a.groupIdMap[e].experiments||[]).forEach((function(t){a.experiments.push(E(t,{groupId:e}))}))})),a.rolloutIdMap=f(a.rollouts||[],"id"),d(a.rolloutIdMap||{}).forEach((function(e){(e.experiments||[]).forEach((function(e){a.experiments.push(e),e.variationKeyMap=f(e.variations,"key")}))})),a.experimentKeyMap=f(a.experiments,"key"),a.experimentIdMap=f(a.experiments,"id"),a.variationIdMap={},a.variationVariableUsageMap={},(a.experiments||[]).forEach((function(e){e.variationKeyMap=f(e.variations,"key"),E(a.variationIdMap,f(e.variations,"id")),d(e.variationKeyMap||{}).forEach((function(e){e.variables&&(a.variationVariableUsageMap[e.id]=f(e.variables,"id"))}))})),a.experimentFeatureMap={},a.featureKeyMap=f(a.featureFlags||[],"key"),d(a.featureKeyMap||{}).forEach((function(e){e.variables.forEach((function(e){e.type===U.STRING&&e.subType===U.JSON&&(e.type=U.JSON,delete e.subType)})),e.variableKeyMap=f(e.variables,"key"),(e.experimentIds||[]).forEach((function(t){a.experimentFeatureMap[t]?a.experimentFeatureMap[t].push(e.id):a.experimentFeatureMap[t]=[e.id]}))})),a.flagRulesMap={},(a.featureFlags||[]).forEach((function(e){var t=[]
e.experimentIds.forEach((function(e){var r=a.experimentIdMap[e]
r&&t.push(r)}))
var r=a.rolloutIdMap[e.rolloutId]
r&&t.push.apply(t,r.experiments),a.flagRulesMap[e.key]=t})),a.flagVariationsMap={},p(a.flagRulesMap||{}).forEach((function(e){var t=e[0],r=e[1],n=[]
r.forEach((function(e){e.variations.forEach((function(e){g(n,(function(t){return t.id===e.id}))||n.push(e)}))})),a.flagVariationsMap[t]=n})),a},Q=function(e,t){var r=e.experimentIdMap[t]
if(!r)throw new Error(v(N.INVALID_EXPERIMENT_ID,W,t))
return r.layerId},$=function(e,t,r){var n=e.attributeKeyMap[t],i=0===t.indexOf("$opt_")
return n?(i&&r.log(T.WARNING,"Attribute %s unexpectedly has reserved prefix %s; using attribute ID instead of reserved attribute name.",t,"$opt_"),n.id):i?t:(r.log(T.DEBUG,N.UNRECOGNIZED_ATTRIBUTE,W,t),null)},ee=function(e,t){var r=e.eventKeyMap[t]
return r?r.id:null},te=function(e,t){var r=e.experimentKeyMap[t]
if(!r)throw new Error(v(N.INVALID_EXPERIMENT_KEY,W,t))
return r.status},re=function(e,t){return e.variationIdMap.hasOwnProperty(t)?e.variationIdMap[t].key:null},ne=function(e,t){if(e.experimentKeyMap.hasOwnProperty(t)){var r=e.experimentKeyMap[t]
if(r)return r}throw new Error(v(N.EXPERIMENT_KEY_NOT_IN_DATAFILE,W,t))},ie=function(e,t){var r=e.experimentIdMap[t]
if(!r)throw new Error(v(N.INVALID_EXPERIMENT_ID,W,t))
return r.trafficAllocation},oe=function(e,t,r){if(e.experimentIdMap.hasOwnProperty(t)){var n=e.experimentIdMap[t]
if(n)return n}return r.log(T.ERROR,N.INVALID_EXPERIMENT_ID,W,t),null},ae=function(e,t,r){if(!e)return null
var n=g(e.flagVariationsMap[t],(function(e){return e.key===r}))
return n||null},se=function(e,t,r){if(e.featureKeyMap.hasOwnProperty(t)){var n=e.featureKeyMap[t]
if(n)return n}return r.log(T.ERROR,N.FEATURE_NOT_IN_DATAFILE,W,t),null},ue=function(e){return e.__datafileStr},le=function(e){var t
try{t=function(e){if(!e)throw new Error(v(N.NO_DATAFILE_SPECIFIED,F))
if("string"==typeof e)try{e=JSON.parse(e)}catch(e){throw new Error(v(N.INVALID_DATAFILE_MALFORMED,F))}if("object"==typeof e&&!Array.isArray(e)&&null!==e&&-1===M.indexOf(e.version))throw new Error(v(N.INVALID_DATAFILE_VERSION,F,e.version))
return e}(e.datafile)}catch(e){return{configObj:null,error:e}}if(e.jsonSchemaValidator)try{e.jsonSchemaValidator.validate(t),e.logger.log(T.INFO,y.VALID_DATAFILE,W)}catch(e){return{configObj:null,error:e}}else e.logger.log(T.INFO,y.SKIPPING_JSON_VALIDATION,W)
var r=[t]
return"string"==typeof e.datafile&&r.push(e.datafile),{configObj:Z.apply(void 0,r),error:null}},ce=function(e){return!!e.sendFlagDecisions},Ee=n.getLogger()
function fe(e,t){return e instanceof Error?e.message:t||"Unknown error"}var de=function(){function e(e){this.updateListeners=[],this.configObj=null,this.optimizelyConfigObj=null,this.datafileManager=null
try{if(this.jsonSchemaValidator=e.jsonSchemaValidator,!e.datafile&&!e.sdkKey){var t=new Error(v(N.DATAFILE_AND_SDK_KEY_MISSING,"PROJECT_CONFIG_MANAGER"))
return this.readyPromise=Promise.resolve({success:!1,reason:fe(t)}),void Ee.error(t)}var r=null
e.datafile&&(r=this.handleNewDatafile(e.datafile)),e.sdkKey&&e.datafileManager?(this.datafileManager=e.datafileManager,this.datafileManager.start(),this.readyPromise=this.datafileManager.onReady().then(this.onDatafileManagerReadyFulfill.bind(this),this.onDatafileManagerReadyReject.bind(this)),this.datafileManager.on("update",this.onDatafileManagerUpdate.bind(this))):this.configObj?this.readyPromise=Promise.resolve({success:!0}):this.readyPromise=Promise.resolve({success:!1,reason:fe(r,"Invalid datafile")})}catch(e){Ee.error(e),this.readyPromise=Promise.resolve({success:!1,reason:fe(e,"Error in initialize")})}}return e.prototype.onDatafileManagerReadyFulfill=function(){if(this.datafileManager){var e=this.handleNewDatafile(this.datafileManager.get())
return e?{success:!1,reason:fe(e)}:{success:!0}}return{success:!1,reason:fe(null,"Datafile manager is not provided")}},e.prototype.onDatafileManagerReadyReject=function(e){return{success:!1,reason:fe(e,"Failed to become ready")}},e.prototype.onDatafileManagerUpdate=function(){this.datafileManager&&this.handleNewDatafile(this.datafileManager.get())},e.prototype.handleNewDatafile=function(e){var t=le({datafile:e,jsonSchemaValidator:this.jsonSchemaValidator,logger:Ee}),r=t.configObj,n=t.error
if(n)Ee.error(n)
else{var i=this.configObj?this.configObj.revision:"null"
r&&i!==r.revision&&(this.configObj=r,this.optimizelyConfigObj=null,this.updateListeners.forEach((function(e){return e(r)})))}return n},e.prototype.getConfig=function(){return this.configObj},e.prototype.getOptimizelyConfig=function(){var e,t
return!this.optimizelyConfigObj&&this.configObj&&(this.optimizelyConfigObj=(e=this.configObj,t=ue(this.configObj),new J(e,t))),this.optimizelyConfigObj},e.prototype.onReady=function(){return this.readyPromise},e.prototype.onUpdate=function(e){var t=this
return this.updateListeners.push(e),function(){var r=t.updateListeners.indexOf(e)
r>-1&&t.updateListeners.splice(r,1)}},e.prototype.stop=function(){this.datafileManager&&this.datafileManager.stop(),this.updateListeners=[]},e}(),pe=Math.pow(2,32),ge=function(e){var t=[],r=e.experimentIdMap[e.experimentId].groupId
if(r){var n=e.groupIdMap[r]
if(!n)throw new Error(v(N.INVALID_GROUP_ID,"BUCKETER",r))
if("random"===n.policy){var i=Ie(n,e.bucketingId,e.userId,e.logger)
if(null===i)return e.logger.log(T.INFO,y.USER_NOT_IN_ANY_EXPERIMENT,"BUCKETER",e.userId,r),t.push([y.USER_NOT_IN_ANY_EXPERIMENT,"BUCKETER",e.userId,r]),{result:null,reasons:t}
if(i!==e.experimentId)return e.logger.log(T.INFO,y.USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP,"BUCKETER",e.userId,e.experimentKey,r),t.push([y.USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP,"BUCKETER",e.userId,e.experimentKey,r]),{result:null,reasons:t}
e.logger.log(T.INFO,y.USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP,"BUCKETER",e.userId,e.experimentKey,r),t.push([y.USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP,"BUCKETER",e.userId,e.experimentKey,r])}}var o=""+e.bucketingId+e.experimentId,a=ve(o)
e.logger.log(T.DEBUG,y.USER_ASSIGNED_TO_EXPERIMENT_BUCKET,"BUCKETER",a,e.userId),t.push([y.USER_ASSIGNED_TO_EXPERIMENT_BUCKET,"BUCKETER",a,e.userId])
var s=_e(a,e.trafficAllocationConfig)
return null===s||e.variationIdMap[s]?{result:s,reasons:t}:(s&&(e.logger.log(T.WARNING,y.INVALID_VARIATION_ID,"BUCKETER"),t.push([y.INVALID_VARIATION_ID,"BUCKETER"])),{result:null,reasons:t})},Ie=function(e,t,r,n){var i=""+t+e.id,o=ve(i)
n.log(T.DEBUG,y.USER_ASSIGNED_TO_EXPERIMENT_BUCKET,"BUCKETER",o,r)
var a=e.trafficAllocation
return _e(o,a)},_e=function(e,t){for(var r=0;r<t.length;r++)if(e<t[r].endOfRange)return t[r].entityId
return null},ve=function(e){try{var t=a.v3(e,1)/pe
return Math.floor(1e4*t)}catch(t){throw new Error(v(N.INVALID_BUCKETING_ID,"BUCKETER",e,t.message))}},he=n.getLogger()
function Oe(e){return/^\d+$/.test(e)}function Re(e){var t=e.indexOf("-"),r=e.indexOf("+")
return!(t<0)&&(r<0||t<r)}function Te(e){var t=e.indexOf("-"),r=e.indexOf("+")
return!(r<0)&&(t<0||r<t)}function Ne(e){var t=e,r=""
if(function(e){return/\s/.test(e)}(e))return he.warn(y.UNKNOWN_MATCH_TYPE,"SEMANTIC VERSION",e),null
if(Re(e)?(t=e.substring(0,e.indexOf("-")),r=e.substring(e.indexOf("-")+1)):Te(e)&&(t=e.substring(0,e.indexOf("+")),r=e.substring(e.indexOf("+")+1)),"string"!=typeof t||"string"!=typeof r)return null
var n=t.split(".").length-1
if(n>2)return he.warn(y.UNKNOWN_MATCH_TYPE,"SEMANTIC VERSION",e),null
var i=t.split(".")
if(i.length!=n+1)return he.warn(y.UNKNOWN_MATCH_TYPE,"SEMANTIC VERSION",e),null
for(var o=0,a=i;o<a.length;o++)if(!Oe(a[o]))return he.warn(y.UNKNOWN_MATCH_TYPE,"SEMANTIC VERSION",e),null
return r&&i.push(r),i}var ye="CUSTOM_ATTRIBUTE_CONDITION_EVALUATOR",Ae=n.getLogger(),me=["exact","exists","gt","ge","lt","le","substring","semver_eq","semver_lt","semver_le","semver_gt","semver_ge"],Le={}
function De(e){return"string"==typeof e||"boolean"==typeof e||R.isNumber(e)}function Ue(e,t){var r=e.value,n=typeof r,i=e.name,o=t[i],a=typeof o
return!De(r)||R.isNumber(r)&&!R.isSafeInteger(r)?(Ae.warn(y.UNEXPECTED_CONDITION_VALUE,ye,JSON.stringify(e)),null):null===o?(Ae.debug(y.UNEXPECTED_TYPE_NULL,ye,JSON.stringify(e),i),null):De(o)&&n===a?R.isNumber(o)&&!R.isSafeInteger(o)?(Ae.warn(y.OUT_OF_BOUNDS,ye,JSON.stringify(e),i),null):r===o:(Ae.warn(y.UNEXPECTED_TYPE,ye,JSON.stringify(e),a,i),null)}function Se(e,t){var r=e.name,n=t[r],i=typeof n,o=e.value
return null!==o&&R.isSafeInteger(o)?null===n?(Ae.debug(y.UNEXPECTED_TYPE_NULL,ye,JSON.stringify(e),r),!1):R.isNumber(n)?!!R.isSafeInteger(n)||(Ae.warn(y.OUT_OF_BOUNDS,ye,JSON.stringify(e),r),!1):(Ae.warn(y.UNEXPECTED_TYPE,ye,JSON.stringify(e),i,r),!1):(Ae.warn(y.UNEXPECTED_CONDITION_VALUE,ye,JSON.stringify(e)),!1)}function Ce(e,t){var r=e.name,n=t[r],i=typeof n,o=e.value
return"string"!=typeof o?(Ae.warn(y.UNEXPECTED_CONDITION_VALUE,ye,JSON.stringify(e)),null):null===n?(Ae.debug(y.UNEXPECTED_TYPE_NULL,ye,JSON.stringify(e),r),null):"string"!=typeof n?(Ae.warn(y.UNEXPECTED_TYPE,ye,JSON.stringify(e),i,r),null):function(e,t){var r=Ne(t),n=Ne(e)
if(!r||!n)return null
for(var i=r.length,o=0;o<n.length;o++){if(i<=o)return Re(e)||Te(e)?1:-1
if(Oe(r[o])){var a=parseInt(r[o]),s=parseInt(n[o])
if(a>s)return 1
if(a<s)return-1}else{if(r[o]<n[o])return Re(e)&&!Re(t)?1:-1
if(r[o]>n[o])return!Re(e)&&Re(t)?-1:1}}return Re(t)&&!Re(e)?-1:0}(o,n)}Le.exact=Ue,Le.exists=function(e,t){return null!=t[e.name]},Le.gt=function(e,t){var r=t[e.name],n=e.value
return Se(e,t)&&null!==n?r>n:null},Le.ge=function(e,t){var r=t[e.name],n=e.value
return Se(e,t)&&null!==n?r>=n:null},Le.lt=function(e,t){var r=t[e.name],n=e.value
return Se(e,t)&&null!==n?r<n:null},Le.le=function(e,t){var r=t[e.name],n=e.value
return Se(e,t)&&null!==n?r<=n:null},Le.substring=function(e,t){var r=e.name,n=t[e.name],i=typeof n,o=e.value
return"string"!=typeof o?(Ae.warn(y.UNEXPECTED_CONDITION_VALUE,ye,JSON.stringify(e)),null):null===n?(Ae.debug(y.UNEXPECTED_TYPE_NULL,ye,JSON.stringify(e),r),null):"string"!=typeof n?(Ae.warn(y.UNEXPECTED_TYPE,ye,JSON.stringify(e),i,r),null):-1!==n.indexOf(o)},Le.semver_eq=function(e,t){var r=Ce(e,t)
return null===r?null:0===r},Le.semver_gt=function(e,t){var r=Ce(e,t)
return null===r?null:r>0},Le.semver_ge=function(e,t){var r=Ce(e,t)
return null===r?null:r>=0},Le.semver_lt=function(e,t){var r=Ce(e,t)
return null===r?null:r<0},Le.semver_le=function(e,t){var r=Ce(e,t)
return null===r?null:r<=0}
var Ve=Object.freeze({__proto__:null,evaluate:function(e,t){var r=e.match
if(void 0!==r&&-1===me.indexOf(r))return Ae.warn(y.UNKNOWN_MATCH_TYPE,ye,JSON.stringify(e)),null
var n=e.name
return t.hasOwnProperty(n)||"exists"==r?(r&&Le[r]||Ue)(e,t):(Ae.debug(y.MISSING_ATTRIBUTE_VALUE,ye,JSON.stringify(e),n),null)}}),Pe=n.getLogger(),be=function(){function e(e){this.typeToEvaluatorMap=R.assign({},e,{custom_attribute:Ve})}return e.prototype.evaluate=function(e,t,r){var n=this
return void 0===r&&(r={}),!e||0===e.length||!!q(e,(function(e){var i=t[e]
if(i){Pe.log(T.DEBUG,y.EVALUATING_AUDIENCE,"AUDIENCE_EVALUATOR",e,JSON.stringify(i.conditions))
var o=q(i.conditions,n.evaluateConditionWithUserAttributes.bind(n,r)),a=null===o?"UNKNOWN":o.toString().toUpperCase()
return Pe.log(T.DEBUG,y.AUDIENCE_EVALUATION_RESULT,"AUDIENCE_EVALUATOR",e,a),o}return null}))},e.prototype.evaluateConditionWithUserAttributes=function(e,t){var r=this.typeToEvaluatorMap[t.type]
if(!r)return Pe.log(T.WARNING,y.UNKNOWN_CONDITION_TYPE,"AUDIENCE_EVALUATOR",JSON.stringify(t)),null
try{return r.evaluate(t,e)}catch(e){Pe.log(T.ERROR,N.CONDITION_EVALUATOR_ERROR,"AUDIENCE_EVALUATOR",t.type,e.message)}return null},e}()
function Fe(e){return"string"==typeof e&&""!==e}var Me="DECISION_SERVICE",ke=function(){function e(e){var t
this.audienceEvaluator=(t=e.UNSTABLE_conditionEvaluators,new be(t)),this.forcedVariationMap={},this.logger=e.logger,this.userProfileService=e.userProfileService||null}return e.prototype.getVariation=function(e,r,n,i){void 0===i&&(i={})
var o=n.getUserId(),a=n.getAttributes(),s=this.getBucketingId(o,a),u=[],l=r.key
if(!this.checkIfExperimentIsActive(e,l))return this.logger.log(T.INFO,y.EXPERIMENT_NOT_RUNNING,Me,l),u.push([y.EXPERIMENT_NOT_RUNNING,Me,l]),{result:null,reasons:u}
var c=this.getForcedVariation(e,l,o)
u.push.apply(u,c.reasons)
var E=c.result
if(E)return{result:E,reasons:u}
var f=this.getWhitelistedVariation(r,o)
u.push.apply(u,f.reasons)
var d=f.result
if(d)return{result:d.key,reasons:u}
var p=i[t.OptimizelyDecideOption.IGNORE_USER_PROFILE_SERVICE],g=this.resolveExperimentBucketMap(o,a)
if(!p&&(d=this.getStoredVariation(e,r,o,g)))return this.logger.log(T.INFO,y.RETURNING_STORED_VARIATION,Me,d.key,l,o),u.push([y.RETURNING_STORED_VARIATION,Me,d.key,l,o]),{result:d.key,reasons:u}
var I=this.checkIfUserIsInAudience(e,r,D.EXPERIMENT,a,"")
if(u.push.apply(u,I.reasons),!I.result)return this.logger.log(T.INFO,y.USER_NOT_IN_EXPERIMENT,Me,o,l),u.push([y.USER_NOT_IN_EXPERIMENT,Me,o,l]),{result:null,reasons:u}
var _=this.buildBucketerParams(e,r,s,o),v=ge(_)
u.push.apply(u,v.reasons)
var h=v.result
return h&&(d=e.variationIdMap[h]),d?(this.logger.log(T.INFO,y.USER_HAS_VARIATION,Me,o,d.key,l),u.push([y.USER_HAS_VARIATION,Me,o,d.key,l]),p||this.saveUserProfile(r,d,o,g),{result:d.key,reasons:u}):(this.logger.log(T.DEBUG,y.USER_HAS_NO_VARIATION,Me,o,l),u.push([y.USER_HAS_NO_VARIATION,Me,o,l]),{result:null,reasons:u})},e.prototype.resolveExperimentBucketMap=function(e,t){t=t||{}
var r=this.getUserProfile(e)||{},n=t[A.STICKY_BUCKETING_KEY]
return R.assign({},r.experiment_bucket_map,n)},e.prototype.checkIfExperimentIsActive=function(e,t){return function(e,t){return"Running"===te(e,t)}(e,t)},e.prototype.getWhitelistedVariation=function(e,t){var r=[]
if(e.forcedVariations&&e.forcedVariations.hasOwnProperty(t)){var n=e.forcedVariations[t]
return e.variationKeyMap.hasOwnProperty(n)?(this.logger.log(T.INFO,y.USER_FORCED_IN_VARIATION,Me,t,n),r.push([y.USER_FORCED_IN_VARIATION,Me,t,n]),{result:e.variationKeyMap[n],reasons:r}):(this.logger.log(T.ERROR,y.FORCED_BUCKETING_FAILED,Me,n,t),r.push([y.FORCED_BUCKETING_FAILED,Me,n,t]),{result:null,reasons:r})}return{result:null,reasons:r}},e.prototype.checkIfUserIsInAudience=function(e,t,r,n,i){var o=[],a=function(e,t){var r=e.experimentIdMap[t]
if(!r)throw new Error(v(N.INVALID_EXPERIMENT_ID,W,t))
return r.audienceConditions||r.audienceIds}(e,t.id),s=e.audiencesById
this.logger.log(T.DEBUG,y.EVALUATING_AUDIENCES_COMBINED,Me,r,i||t.key,JSON.stringify(a)),o.push([y.EVALUATING_AUDIENCES_COMBINED,Me,r,i||t.key,JSON.stringify(a)])
var u=this.audienceEvaluator.evaluate(a,s,n)
return this.logger.log(T.INFO,y.AUDIENCE_EVALUATION_RESULT_COMBINED,Me,r,i||t.key,u.toString().toUpperCase()),o.push([y.AUDIENCE_EVALUATION_RESULT_COMBINED,Me,r,i||t.key,u.toString().toUpperCase()]),{result:u,reasons:o}},e.prototype.buildBucketerParams=function(e,t,r,n){return{bucketingId:r,experimentId:t.id,experimentKey:t.key,experimentIdMap:e.experimentIdMap,experimentKeyMap:e.experimentKeyMap,groupIdMap:e.groupIdMap,logger:this.logger,trafficAllocationConfig:ie(e,t.id),userId:n,variationIdMap:e.variationIdMap}},e.prototype.getStoredVariation=function(e,t,r,n){if(n.hasOwnProperty(t.id)){var i=n[t.id],o=i.variation_id
if(e.variationIdMap.hasOwnProperty(o))return e.variationIdMap[i.variation_id]
this.logger.log(T.INFO,y.SAVED_VARIATION_NOT_FOUND,Me,r,o,t.key)}return null},e.prototype.getUserProfile=function(e){var t={user_id:e,experiment_bucket_map:{}}
if(!this.userProfileService)return t
try{return this.userProfileService.lookup(e)}catch(t){this.logger.log(T.ERROR,N.USER_PROFILE_LOOKUP_ERROR,Me,e,t.message)}return null},e.prototype.saveUserProfile=function(e,t,r,n){if(this.userProfileService)try{n[e.id]={variation_id:t.id},this.userProfileService.save({user_id:r,experiment_bucket_map:n}),this.logger.log(T.INFO,y.SAVED_VARIATION,Me,t.key,e.key,r)}catch(e){this.logger.log(T.ERROR,N.USER_PROFILE_SAVE_ERROR,Me,r,e.message)}},e.prototype.getVariationForFeature=function(e,t,r,n){void 0===n&&(n={})
var i=[],o=this.getVariationForFeatureExperiment(e,t,r,n)
i.push.apply(i,o.reasons)
var a=o.result
if(null!==a.variation)return{result:a,reasons:i}
var s=this.getVariationForRollout(e,t,r)
i.push.apply(i,s.reasons)
var u=s.result,l=r.getUserId()
return u.variation?(this.logger.log(T.DEBUG,y.USER_IN_ROLLOUT,Me,l,t.key),i.push([y.USER_IN_ROLLOUT,Me,l,t.key]),{result:u,reasons:i}):(this.logger.log(T.DEBUG,y.USER_NOT_IN_ROLLOUT,Me,l,t.key),i.push([y.USER_NOT_IN_ROLLOUT,Me,l,t.key]),{result:u,reasons:i})},e.prototype.getVariationForFeatureExperiment=function(e,t,r,n){void 0===n&&(n={})
var i,o,a=[],s=null
if(t.experimentIds.length>0)for(o=0;o<t.experimentIds.length;o++){var u=oe(e,t.experimentIds[o],this.logger)
if(u&&(i=this.getVariationFromExperimentRule(e,t.key,u,r,n),a.push.apply(a,i.reasons),s=i.result)){var l=null
return(l=u.variationKeyMap[s])||(l=ae(e,t.key,s)),{result:{experiment:u,variation:l,decisionSource:L.FEATURE_TEST},reasons:a}}}else this.logger.log(T.DEBUG,y.FEATURE_HAS_NO_EXPERIMENTS,Me,t.key),a.push([y.FEATURE_HAS_NO_EXPERIMENTS,Me,t.key])
return{result:{experiment:null,variation:null,decisionSource:L.FEATURE_TEST},reasons:a}},e.prototype.getVariationForRollout=function(e,t,r){var n=[]
if(!t.rolloutId)return this.logger.log(T.DEBUG,y.NO_ROLLOUT_EXISTS,Me,t.key),n.push([y.NO_ROLLOUT_EXISTS,Me,t.key]),{result:{experiment:null,variation:null,decisionSource:L.ROLLOUT},reasons:n}
var i=e.rolloutIdMap[t.rolloutId]
if(!i)return this.logger.log(T.ERROR,N.INVALID_ROLLOUT_ID,Me,t.rolloutId,t.key),n.push([N.INVALID_ROLLOUT_ID,Me,t.rolloutId,t.key]),{result:{experiment:null,variation:null,decisionSource:L.ROLLOUT},reasons:n}
var o,a,s,u=i.experiments
if(0===u.length)return this.logger.log(T.ERROR,y.ROLLOUT_HAS_NO_EXPERIMENTS,Me,t.rolloutId),n.push([y.ROLLOUT_HAS_NO_EXPERIMENTS,Me,t.rolloutId]),{result:{experiment:null,variation:null,decisionSource:L.ROLLOUT},reasons:n}
for(var l=0;l<u.length;){if(o=this.getVariationFromDeliveryRule(e,t.key,u,l,r),n.push.apply(n,o.reasons),s=o.result,a=o.skipToEveryoneElse,s)return{result:{experiment:e.experimentIdMap[u[l].id],variation:s,decisionSource:L.ROLLOUT},reasons:n}
l=a?u.length-1:l+1}return{result:{experiment:null,variation:null,decisionSource:L.ROLLOUT},reasons:n}},e.prototype.getBucketingId=function(e,t){var r=e
return null!=t&&"object"==typeof t&&t.hasOwnProperty(A.BUCKETING_ID)&&("string"==typeof t[A.BUCKETING_ID]?(r=t[A.BUCKETING_ID],this.logger.log(T.DEBUG,y.VALID_BUCKETING_ID,Me,r)):this.logger.log(T.WARNING,y.BUCKETING_ID_NOT_STRING,Me)),r},e.prototype.findValidatedForcedDecision=function(e,t,r,n){var i,o=[],a=t.getForcedDecision({flagKey:r,ruleKey:n}),s=null,u=t.getUserId()
return e&&a&&(i=a.variationKey,(s=ae(e,r,i))?n?(this.logger.log(T.INFO,y.USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED,i,r,n,u),o.push([y.USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED,i,r,n,u])):(this.logger.log(T.INFO,y.USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED,i,r,u),o.push([y.USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED,i,r,u])):n?(this.logger.log(T.INFO,y.USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED_BUT_INVALID,r,n,u),o.push([y.USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED_BUT_INVALID,r,n,u])):(this.logger.log(T.INFO,y.USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED_BUT_INVALID,r,u),o.push([y.USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED_BUT_INVALID,r,u]))),{result:s,reasons:o}},e.prototype.removeForcedVariation=function(e,t,r){if(!e)throw new Error(v(N.INVALID_USER_ID,Me))
if(!this.forcedVariationMap.hasOwnProperty(e))throw new Error(v(N.USER_NOT_IN_FORCED_VARIATION,Me,e))
delete this.forcedVariationMap[e][t],this.logger.log(T.DEBUG,y.VARIATION_REMOVED_FOR_USER,Me,r,e)},e.prototype.setInForcedVariationMap=function(e,t,r){this.forcedVariationMap.hasOwnProperty(e)||(this.forcedVariationMap[e]={}),this.forcedVariationMap[e][t]=r,this.logger.log(T.DEBUG,y.USER_MAPPED_TO_FORCED_VARIATION,Me,r,t,e)},e.prototype.getForcedVariation=function(e,t,r){var n,i=[],o=this.forcedVariationMap[r]
if(!o)return this.logger.log(T.DEBUG,y.USER_HAS_NO_FORCED_VARIATION,Me,r),{result:null,reasons:i}
try{var a=ne(e,t)
if(!a.hasOwnProperty("id"))return this.logger.log(T.ERROR,N.IMPROPERLY_FORMATTED_EXPERIMENT,Me,t),i.push([N.IMPROPERLY_FORMATTED_EXPERIMENT,Me,t]),{result:null,reasons:i}
n=a.id}catch(e){return this.logger.log(T.ERROR,e.message),i.push(e.message),{result:null,reasons:i}}var s=o[n]
if(!s)return this.logger.log(T.DEBUG,y.USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT,Me,t,r),{result:null,reasons:i}
var u=re(e,s)
return u?(this.logger.log(T.DEBUG,y.USER_HAS_FORCED_VARIATION,Me,u,t,r),i.push([y.USER_HAS_FORCED_VARIATION,Me,u,t,r])):this.logger.log(T.DEBUG,y.USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT,Me,t,r),{result:u,reasons:i}},e.prototype.setForcedVariation=function(e,t,r,n){if(null!=n&&!Fe(n))return this.logger.log(T.ERROR,N.INVALID_VARIATION_KEY,Me),!1
var i
try{var o=ne(e,t)
if(!o.hasOwnProperty("id"))return this.logger.log(T.ERROR,N.IMPROPERLY_FORMATTED_EXPERIMENT,Me,t),!1
i=o.id}catch(e){return this.logger.log(T.ERROR,e.message),!1}if(null==n)try{return this.removeForcedVariation(r,i,t),!0}catch(e){return this.logger.log(T.ERROR,e.message),!1}var a=function(e,t,r){var n=e.experimentKeyMap[t]
return n.variationKeyMap.hasOwnProperty(r)?n.variationKeyMap[r].id:null}(e,t,n)
if(!a)return this.logger.log(T.ERROR,N.NO_VARIATION_FOR_EXPERIMENT_KEY,Me,n,t),!1
try{return this.setInForcedVariationMap(r,i,a),!0}catch(e){return this.logger.log(T.ERROR,e.message),!1}},e.prototype.getVariationFromExperimentRule=function(e,t,r,n,i){void 0===i&&(i={})
var o=[],a=this.findValidatedForcedDecision(e,n,t,r.key)
o.push.apply(o,a.reasons)
var s=a.result
if(s)return{result:s.key,reasons:o}
var u=this.getVariation(e,r,n,i)
return o.push.apply(o,u.reasons),{result:u.result,reasons:o}},e.prototype.getVariationFromDeliveryRule=function(e,t,r,n,i){var o=[],a=!1,s=r[n],u=this.findValidatedForcedDecision(e,i,t,s.key)
o.push.apply(o,u.reasons)
var l=u.result
if(l)return{result:l,reasons:o,skipToEveryoneElse:a}
var c,E,f,d,p,g=i.getUserId(),I=i.getAttributes(),_=this.getBucketingId(g,I),v=n===r.length-1,h=v?"Everyone Else":n+1,O=null,R=this.checkIfUserIsInAudience(e,s,D.RULE,I,h)
return o.push.apply(o,R.reasons),R.result?(this.logger.log(T.DEBUG,y.USER_MEETS_CONDITIONS_FOR_TARGETING_RULE,Me,g,h),o.push([y.USER_MEETS_CONDITIONS_FOR_TARGETING_RULE,Me,g,h]),E=this.buildBucketerParams(e,s,_,g),f=ge(E),o.push.apply(o,f.reasons),(c=f.result)&&(p=c,O=(d=e).variationIdMap.hasOwnProperty(p)?d.variationIdMap[p]:null),O?(this.logger.log(T.DEBUG,y.USER_BUCKETED_INTO_TARGETING_RULE,Me,g,h),o.push([y.USER_BUCKETED_INTO_TARGETING_RULE,Me,g,h])):v||(this.logger.log(T.DEBUG,y.USER_NOT_BUCKETED_INTO_TARGETING_RULE,Me,g,h),o.push([y.USER_NOT_BUCKETED_INTO_TARGETING_RULE,Me,g,h]),a=!0)):(this.logger.log(T.DEBUG,y.USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE,Me,g,h),o.push([y.USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE,Me,g,h])),{result:O,reasons:o,skipToEveryoneElse:a}},e}()
function xe(e,t){if(e.hasOwnProperty("revenue")){var r=e.revenue,n=void 0
return"string"==typeof r?(n=parseInt(r),isNaN(n)?(t.log(T.INFO,y.FAILED_TO_PARSE_REVENUE,"EVENT_TAG_UTILS",r),null):(t.log(T.INFO,y.PARSED_REVENUE_VALUE,"EVENT_TAG_UTILS",n),n)):"number"==typeof r?(n=r,t.log(T.INFO,y.PARSED_REVENUE_VALUE,"EVENT_TAG_UTILS",n),n):null}return null}function Be(e,t){if(e.hasOwnProperty("value")){var r=e.value,n=void 0
return"string"==typeof r?(n=parseFloat(r),isNaN(n)?(t.log(T.INFO,y.FAILED_TO_PARSE_VALUE,"EVENT_TAG_UTILS",r),null):(t.log(T.INFO,y.PARSED_NUMERIC_VALUE,"EVENT_TAG_UTILS",n),n)):"number"==typeof r?(n=r,t.log(T.INFO,y.PARSED_NUMERIC_VALUE,"EVENT_TAG_UTILS",n),n):null}return null}function Ke(e,t){return"string"==typeof e&&("string"==typeof t||"boolean"==typeof t||R.isNumber(t)&&R.isSafeInteger(t))}var we="https://logx.optimizely.com/v1/events"
function Ge(e){var t=e.attributes,r=e.userId,n=e.clientEngine,i=e.clientVersion,o=e.configObj,a=e.logger,s=!!o.anonymizeIP&&o.anonymizeIP,u=o.botFiltering,l={snapshots:[],visitor_id:r,attributes:[]},c={account_id:o.accountId,project_id:o.projectId,visitors:[l],revision:o.revision,client_name:n,client_version:i,anonymize_ip:s,enrich_decisions:!0}
return t&&Object.keys(t||{}).forEach((function(e){if(Ke(e,t[e])){var r=$(o,e,a)
r&&c.visitors[0].attributes.push({entity_id:r,key:e,type:"custom",value:t[e]})}})),"boolean"==typeof u&&c.visitors[0].attributes.push({entity_id:A.BOT_FILTERING,key:A.BOT_FILTERING,type:"custom",value:u}),c}function je(e){var t,r
return null!==(r=null===(t=e.experiment)||void 0===t?void 0:t.key)&&void 0!==r?r:""}function He(e){var t,r
return null!==(r=null===(t=e.variation)||void 0===t?void 0:t.key)&&void 0!==r?r:""}function Ye(e){var t,r
return null!==(r=null===(t=e.variation)||void 0===t?void 0:t.featureEnabled)&&void 0!==r&&r}function ze(e){var t,r
return null!==(r=null===(t=e.experiment)||void 0===t?void 0:t.id)&&void 0!==r?r:null}function Xe(e){var t,r
return null!==(r=null===(t=e.variation)||void 0===t?void 0:t.id)&&void 0!==r?r:null}var qe=n.getLogger("EVENT_BUILDER")
function Je(e,t){var r=[]
return t&&Object.keys(t||{}).forEach((function(n){if(Ke(n,t[n])){var i=$(e,n,qe)
i&&r.push({entityId:i,key:n,value:t[n]})}})),r}var We="USER_PROFILE_SERVICE_VALIDATOR",Ze=function(){function e(e){var r,n=this,i=e.clientEngine
i||(e.logger.log(T.INFO,y.INVALID_CLIENT_ENGINE,"OPTIMIZELY",i),i="node-sdk"),this.clientEngine=i,this.clientVersion=e.clientVersion||"4.9.4",this.errorHandler=e.errorHandler,this.isOptimizelyConfigValid=e.isValidInstance,this.logger=e.logger
var o=null!==(r=e.defaultDecideOptions)&&void 0!==r?r:[]
Array.isArray(o)||(this.logger.log(T.DEBUG,y.INVALID_DEFAULT_DECIDE_OPTIONS,"OPTIMIZELY"),o=[])
var a={}
o.forEach((function(e){t.OptimizelyDecideOption[e]?a[e]=!0:n.logger.log(T.WARNING,y.UNRECOGNIZED_DECIDE_OPTION,"OPTIMIZELY",e)})),this.defaultDecideOptions=a,this.projectConfigManager=function(e){return new de(e)}({datafile:e.datafile,jsonSchemaValidator:e.jsonSchemaValidator,sdkKey:e.sdkKey,datafileManager:e.datafileManager}),this.disposeOnUpdate=this.projectConfigManager.onUpdate((function(e){n.logger.log(T.INFO,y.UPDATED_OPTIMIZELY_CONFIG,"OPTIMIZELY",e.revision,e.projectId),n.notificationCenter.sendNotifications(h.OPTIMIZELY_CONFIG_UPDATE)}))
var s,u=this.projectConfigManager.onReady(),l=null
if(e.userProfileService)try{(function(e){if("object"==typeof e&&null!==e){if("function"!=typeof e.lookup)throw new Error(v(N.INVALID_USER_PROFILE_SERVICE,We,"Missing function 'lookup'"))
if("function"!=typeof e.save)throw new Error(v(N.INVALID_USER_PROFILE_SERVICE,We,"Missing function 'save'"))
return!0}throw new Error(v(N.INVALID_USER_PROFILE_SERVICE,We))})(e.userProfileService)&&(l=e.userProfileService,this.logger.log(T.INFO,y.VALID_USER_PROFILE_SERVICE,"OPTIMIZELY"))}catch(e){this.logger.log(T.WARNING,e.message)}this.decisionService=(s={userProfileService:l,logger:this.logger,UNSTABLE_conditionEvaluators:e.UNSTABLE_conditionEvaluators},new ke(s)),this.notificationCenter=e.notificationCenter,this.eventProcessor=e.eventProcessor
var c=this.eventProcessor.start()
this.readyPromise=Promise.all([u,c]).then((function(e){return e[0]})),this.readyTimeouts={},this.nextReadyTimeoutId=0}return e.prototype.isValidInstance=function(){return this.isOptimizelyConfigValid&&!!this.projectConfigManager.getConfig()},e.prototype.activate=function(e,t,r){try{if(!this.isValidInstance())return this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","activate"),null
if(!this.validateInputs({experiment_key:e,user_id:t},r))return this.notActivatingExperiment(e,t)
var n=this.projectConfigManager.getConfig()
if(!n)return null
try{var i=this.getVariation(e,t,r)
if(null===i)return this.notActivatingExperiment(e,t)
if(!function(e,t){return"Running"===te(e,t)}(n,e))return this.logger.log(T.DEBUG,y.SHOULD_NOT_DISPATCH_ACTIVATE,"OPTIMIZELY",e),i
var o=ne(n,e),a={experiment:o,variation:o.variationKeyMap[i],decisionSource:L.EXPERIMENT}
return this.sendImpressionEvent(a,"",t,!0,r),i}catch(r){return this.logger.log(T.ERROR,r.message),this.logger.log(T.INFO,y.NOT_ACTIVATING_USER,"OPTIMIZELY",t,e),this.errorHandler.handleError(r),null}}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.sendImpressionEvent=function(e,t,r,n,i){var o=this.projectConfigManager.getConfig()
if(o){var a=function(e){var t=e.configObj,r=e.decisionObj,n=e.userId,i=e.flagKey,o=e.enabled,a=e.userAttributes,s=e.clientEngine,u=e.clientVersion,l=r.decisionSource,c=je(r),E=ze(r),f=He(r),d=Xe(r),p=null!==E?Q(t,E):null
return{type:"impression",timestamp:R.currentTimestamp(),uuid:R.uuid(),user:{id:n,attributes:Je(t,a)},context:{accountId:t.accountId,projectId:t.projectId,revision:t.revision,clientName:s,clientVersion:u,anonymizeIP:t.anonymizeIP||!1,botFiltering:t.botFiltering},layer:{id:p},experiment:{id:E,key:c},variation:{id:d,key:f},ruleKey:c,flagKey:i,ruleType:l,enabled:o}}({decisionObj:e,flagKey:t,enabled:n,userId:r,userAttributes:i,clientEngine:this.clientEngine,clientVersion:this.clientVersion,configObj:o})
this.eventProcessor.process(a),this.emitNotificationCenterActivate(e,t,r,n,i)}},e.prototype.emitNotificationCenterActivate=function(e,t,r,n,i){var o=this.projectConfigManager.getConfig()
if(o){var a,s=e.decisionSource,u=je(e),l=ze(e),c=He(e),E=Xe(e)
null!==l&&""!==c&&(a=o.experimentIdMap[l])
var f,d=function(e){var t,r,n,i,o,a,s,u,l=Ge(e),c=(t=e.configObj,r=e.experimentId,n=e.variationId,i=e.ruleKey,o=e.ruleType,a=e.flagKey,s=e.enabled,{decisions:[{campaign_id:u=r?Q(t,r):null,experiment_id:r,variation_id:n,metadata:{flag_key:a,rule_key:i,rule_type:o,variation_key:(n?re(t,n):null)||"",enabled:s}}],events:[{entity_id:u,timestamp:R.currentTimestamp(),key:"campaign_activated",uuid:R.uuid()}]})
return l.visitors[0].snapshots.push(c),{httpVerb:"POST",url:we,params:l}}({attributes:i,clientEngine:this.clientEngine,clientVersion:this.clientVersion,configObj:o,experimentId:l,ruleKey:u,flagKey:t,ruleType:s,userId:r,enabled:n,variationId:E,logger:this.logger})
a&&a.variationKeyMap&&""!==c&&(f=a.variationKeyMap[c]),this.notificationCenter.sendNotifications(h.ACTIVATE,{experiment:a,userId:r,attributes:i,variation:f,logEvent:d})}},e.prototype.track=function(e,t,r,n){try{if(!this.isValidInstance())return void this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","track")
if(!this.validateInputs({user_id:t,event_key:e},r,n))return
var i=this.projectConfigManager.getConfig()
if(!i)return
if(!function(e,t){return e.eventKeyMap.hasOwnProperty(t)}(i,e))return this.logger.log(T.WARNING,y.EVENT_KEY_NOT_FOUND,"OPTIMIZELY",e),void this.logger.log(T.WARNING,y.NOT_TRACKING_USER,"OPTIMIZELY",t)
var o=function(e){var t=e.configObj,r=e.userId,n=e.userAttributes,i=e.clientEngine,o=e.clientVersion,a=e.eventKey,s=e.eventTags,u=ee(t,a),l=s?xe(s,qe):null,c=s?Be(s,qe):null
return{type:"conversion",timestamp:R.currentTimestamp(),uuid:R.uuid(),user:{id:r,attributes:Je(t,n)},context:{accountId:t.accountId,projectId:t.projectId,revision:t.revision,clientName:i,clientVersion:o,anonymizeIP:t.anonymizeIP||!1,botFiltering:t.botFiltering},event:{id:u,key:a},revenue:l,value:c,tags:s}}({eventKey:e,eventTags:n=this.filterEmptyValues(n),userId:t,userAttributes:r,clientEngine:this.clientEngine,clientVersion:this.clientVersion,configObj:i})
this.logger.log(T.INFO,y.TRACK_EVENT,"OPTIMIZELY",e,t),this.eventProcessor.process(o),this.emitNotificationCenterTrack(e,t,r,n)}catch(e){this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),this.logger.log(T.ERROR,y.NOT_TRACKING_USER,"OPTIMIZELY",t)}},e.prototype.emitNotificationCenterTrack=function(e,t,r,n){try{var i=this.projectConfigManager.getConfig()
if(!i)return
var o=function(e){var t=Ge(e),r=function(e,t,r,n){var i={events:[]},o={entity_id:ee(e,t),timestamp:R.currentTimestamp(),uuid:R.uuid(),key:t}
if(n){var a=xe(n,r)
null!==a&&(o.revenue=a)
var s=Be(n,r)
null!==s&&(o.value=s),o.tags=n}return i.events.push(o),i}(e.configObj,e.eventKey,e.logger,e.eventTags)
return t.visitors[0].snapshots=[r],{httpVerb:"POST",url:we,params:t}}({attributes:r,clientEngine:this.clientEngine,clientVersion:this.clientVersion,configObj:i,eventKey:e,eventTags:n,logger:this.logger,userId:t})
this.notificationCenter.sendNotifications(h.TRACK,{eventKey:e,userId:t,attributes:r,eventTags:n,logEvent:o})}catch(e){this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e)}},e.prototype.getVariation=function(e,t,r){try{if(!this.isValidInstance())return this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","getVariation"),null
try{if(!this.validateInputs({experiment_key:e,user_id:t},r))return null
var n=this.projectConfigManager.getConfig()
if(!n)return null
var i=n.experimentKeyMap[e]
if(!i)return this.logger.log(T.DEBUG,N.INVALID_EXPERIMENT_KEY,"OPTIMIZELY",e),null
var o=this.decisionService.getVariation(n,i,this.createUserContext(t,r)).result,a=(s=n,u=i.id,s.experimentFeatureMap.hasOwnProperty(u)?m.FEATURE_TEST:m.AB_TEST)
return this.notificationCenter.sendNotifications(h.DECISION,{type:a,userId:t,attributes:r||{},decisionInfo:{experimentKey:e,variationKey:o}}),o}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}var s,u},e.prototype.setForcedVariation=function(e,t,r){if(!this.validateInputs({experiment_key:e,user_id:t}))return!1
var n=this.projectConfigManager.getConfig()
if(!n)return!1
try{return this.decisionService.setForcedVariation(n,e,t,r)}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),!1}},e.prototype.getForcedVariation=function(e,t){if(!this.validateInputs({experiment_key:e,user_id:t}))return null
var r=this.projectConfigManager.getConfig()
if(!r)return null
try{return this.decisionService.getForcedVariation(r,e,t).result}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.validateInputs=function(e,t,r){try{if(e.hasOwnProperty("user_id")){var n=e.user_id
if("string"!=typeof n||null===n||"undefined"===n)throw new Error(v(N.INVALID_INPUT_FORMAT,"OPTIMIZELY","user_id"))
delete e.user_id}return Object.keys(e).forEach((function(t){if(!Fe(e[t]))throw new Error(v(N.INVALID_INPUT_FORMAT,"OPTIMIZELY",t))})),t&&function(e){if("object"!=typeof e||Array.isArray(e)||null===e)throw new Error(v(N.INVALID_ATTRIBUTES,"ATTRIBUTES_VALIDATOR"))
Object.keys(e).forEach((function(t){if(void 0===e[t])throw new Error(v(N.UNDEFINED_ATTRIBUTE,"ATTRIBUTES_VALIDATOR",t))}))}(t),r&&function(e){if("object"!=typeof e||Array.isArray(e)||null===e)throw new Error(v(N.INVALID_EVENT_TAGS,"EVENT_TAGS_VALIDATOR"))}(r),!0}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),!1}},e.prototype.notActivatingExperiment=function(e,t){return this.logger.log(T.INFO,y.NOT_ACTIVATING_USER,"OPTIMIZELY",t,e),null},e.prototype.filterEmptyValues=function(e){for(var t in e)!e.hasOwnProperty(t)||null!==e[t]&&void 0!==e[t]||delete e[t]
return e},e.prototype.isFeatureEnabled=function(e,t,r){try{if(!this.isValidInstance())return this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","isFeatureEnabled"),!1
if(!this.validateInputs({feature_key:e,user_id:t},r))return!1
var n=this.projectConfigManager.getConfig()
if(!n)return!1
var i=se(n,e,this.logger)
if(!i)return!1
var o={},a=this.createUserContext(t,r),s=this.decisionService.getVariationForFeature(n,i,a).result,u=s.decisionSource,l=je(s),c=He(s),E=Ye(s)
u===L.FEATURE_TEST&&(o={experimentKey:l,variationKey:c}),(u===L.FEATURE_TEST||u===L.ROLLOUT&&ce(n))&&this.sendImpressionEvent(s,i.key,t,E,r),!0===E?this.logger.log(T.INFO,y.FEATURE_ENABLED_FOR_USER,"OPTIMIZELY",e,t):(this.logger.log(T.INFO,y.FEATURE_NOT_ENABLED_FOR_USER,"OPTIMIZELY",e,t),E=!1)
var f={featureKey:e,featureEnabled:E,source:s.decisionSource,sourceInfo:o}
return this.notificationCenter.sendNotifications(h.DECISION,{type:m.FEATURE,userId:t,attributes:r||{},decisionInfo:f}),E}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),!1}},e.prototype.getEnabledFeatures=function(e,t){var r=this
try{var n=[]
if(!this.isValidInstance())return this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","getEnabledFeatures"),n
if(!this.validateInputs({user_id:e}))return n
var i=this.projectConfigManager.getConfig()
return i?(d(i.featureKeyMap).forEach((function(i){r.isFeatureEnabled(i.key,e,t)&&n.push(i.key)})),n):n}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),[]}},e.prototype.getFeatureVariable=function(e,t,r,n){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,null,r,n):(this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariable"),null)}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableForType=function(e,t,r,n,i){if(!this.validateInputs({feature_key:e,variable_key:t,user_id:n},i))return null
var o=this.projectConfigManager.getConfig()
if(!o)return null
var a=se(o,e,this.logger)
if(!a)return null
var s=function(e,t,r,n){var i=e.featureKeyMap[t]
return i?i.variableKeyMap[r]||(n.log(T.ERROR,N.VARIABLE_KEY_NOT_IN_DATAFILE,W,r,t),null):(n.log(T.ERROR,N.FEATURE_NOT_IN_DATAFILE,W,t),null)}(o,e,t,this.logger)
if(!s)return null
if(r&&s.type!==r)return this.logger.log(T.WARNING,y.VARIABLE_REQUESTED_WITH_WRONG_TYPE,"OPTIMIZELY",r,s.type),null
var u=this.createUserContext(n,i),l=this.decisionService.getVariationForFeature(o,a,u).result,c=Ye(l),E=this.getFeatureVariableValueFromVariation(e,c,l.variation,s,n),f={}
return l.decisionSource===L.FEATURE_TEST&&null!==l.experiment&&null!==l.variation&&(f={experimentKey:l.experiment.key,variationKey:l.variation.key}),this.notificationCenter.sendNotifications(h.DECISION,{type:m.FEATURE_VARIABLE,userId:n,attributes:i||{},decisionInfo:{featureKey:e,featureEnabled:c,source:l.decisionSource,variableKey:t,variableValue:E,variableType:s.type,sourceInfo:f}}),E},e.prototype.getFeatureVariableValueFromVariation=function(e,t,r,n,i){var o=this.projectConfigManager.getConfig()
if(!o)return null
var a=n.defaultValue
if(null!==r){var s=function(e,t,r,n){if(!t||!r)return null
if(!e.variationVariableUsageMap.hasOwnProperty(r.id))return n.log(T.ERROR,N.VARIATION_ID_NOT_IN_DATAFILE_NO_EXPERIMENT,W,r.id),null
var i=e.variationVariableUsageMap[r.id][t.id]
return i?i.value:null}(o,n,r,this.logger)
null!==s?t?(a=s,this.logger.log(T.INFO,y.USER_RECEIVED_VARIABLE_VALUE,"OPTIMIZELY",a,n.key,e)):this.logger.log(T.INFO,y.FEATURE_NOT_ENABLED_RETURN_DEFAULT_VARIABLE_VALUE,"OPTIMIZELY",e,i,a):this.logger.log(T.INFO,y.VARIABLE_NOT_USED_RETURN_DEFAULT_VARIABLE_VALUE,"OPTIMIZELY",n.key,r.key)}else this.logger.log(T.INFO,y.USER_RECEIVED_DEFAULT_VARIABLE_VALUE,"OPTIMIZELY",i,n.key,e)
return function(e,t,r){var n
switch(t){case U.BOOLEAN:"true"!==e&&"false"!==e?(r.log(T.ERROR,N.UNABLE_TO_CAST_VALUE,W,e,t),n=null):n="true"===e
break
case U.INTEGER:n=parseInt(e,10),isNaN(n)&&(r.log(T.ERROR,N.UNABLE_TO_CAST_VALUE,W,e,t),n=null)
break
case U.DOUBLE:n=parseFloat(e),isNaN(n)&&(r.log(T.ERROR,N.UNABLE_TO_CAST_VALUE,W,e,t),n=null)
break
case U.JSON:try{n=JSON.parse(e)}catch(i){r.log(T.ERROR,N.UNABLE_TO_CAST_VALUE,W,e,t),n=null}break
default:n=e}return n}(a,n.type,this.logger)},e.prototype.getFeatureVariableBoolean=function(e,t,r,n){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,U.BOOLEAN,r,n):(this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableBoolean"),null)}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableDouble=function(e,t,r,n){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,U.DOUBLE,r,n):(this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableDouble"),null)}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableInteger=function(e,t,r,n){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,U.INTEGER,r,n):(this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableInteger"),null)}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableString=function(e,t,r,n){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,U.STRING,r,n):(this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableString"),null)}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableJSON=function(e,t,r,n){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,U.JSON,r,n):(this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableJSON"),null)}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getAllFeatureVariables=function(e,t,r){var n=this
try{if(!this.isValidInstance())return this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","getAllFeatureVariables"),null
if(!this.validateInputs({feature_key:e,user_id:t},r))return null
var i=this.projectConfigManager.getConfig()
if(!i)return null
var o=se(i,e,this.logger)
if(!o)return null
var a=this.createUserContext(t,r),s=this.decisionService.getVariationForFeature(i,o,a).result,u=Ye(s),l={}
o.variables.forEach((function(r){l[r.key]=n.getFeatureVariableValueFromVariation(e,u,s.variation,r,t)}))
var c={}
return s.decisionSource===L.FEATURE_TEST&&null!==s.experiment&&null!==s.variation&&(c={experimentKey:s.experiment.key,variationKey:s.variation.key}),this.notificationCenter.sendNotifications(h.DECISION,{type:m.ALL_FEATURE_VARIABLES,userId:t,attributes:r||{},decisionInfo:{featureKey:e,featureEnabled:u,source:s.decisionSource,variableValues:l,sourceInfo:c}}),l}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getOptimizelyConfig=function(){try{return this.projectConfigManager.getConfig()?this.projectConfigManager.getOptimizelyConfig():null}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.close=function(){var e=this
try{var t=this.eventProcessor.stop()
return this.disposeOnUpdate&&(this.disposeOnUpdate(),this.disposeOnUpdate=null),this.projectConfigManager&&this.projectConfigManager.stop(),Object.keys(this.readyTimeouts).forEach((function(t){var r=e.readyTimeouts[t]
clearTimeout(r.readyTimeout),r.onClose()})),this.readyTimeouts={},t.then((function(){return{success:!0}}),(function(e){return{success:!1,reason:String(e)}}))}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),Promise.resolve({success:!1,reason:String(e)})}},e.prototype.onReady=function(e){var t,r,n=this
"object"==typeof e&&null!==e&&void 0!==e.timeout&&(t=e.timeout),R.isSafeInteger(t)||(t=3e4)
var i=new Promise((function(e){r=e})),o=this.nextReadyTimeoutId
this.nextReadyTimeoutId++
var a=setTimeout((function(){delete n.readyTimeouts[o],r({success:!1,reason:v("onReady timeout expired after %s ms",t)})}),t)
return this.readyTimeouts[o]={readyTimeout:a,onClose:function(){r({success:!1,reason:"Instance closed"})}},this.readyPromise.then((function(){clearTimeout(a),delete n.readyTimeouts[o],r({success:!0})})),Promise.race([this.readyPromise,i])},e.prototype.createUserContext=function(e,t){return this.validateInputs({user_id:e},t)?new z({optimizely:this,userId:e,attributes:t}):null},e.prototype.decide=function(e,r,n){var i,o,a,s,u=this
void 0===n&&(n=[])
var c,E=e.getUserId(),f=e.getAttributes(),d=this.projectConfigManager.getConfig(),p=[]
if(!this.isValidInstance()||!d)return this.logger.log(T.INFO,y.INVALID_OBJECT,"OPTIMIZELY","decide"),Y(r,e,[P.SDK_NOT_READY])
var g=d.featureKeyMap[r]
if(!g)return this.logger.log(T.ERROR,N.FEATURE_NOT_IN_DATAFILE,"OPTIMIZELY",r),Y(r,e,[v(P.FLAG_KEY_INVALID,r)])
var I=this.getAllDecideOptions(n),_=this.decisionService.findValidatedForcedDecision(d,e,r)
p.push.apply(p,_.reasons)
var O=_.result
if(O)c={experiment:null,variation:O,decisionSource:L.FEATURE_TEST}
else{var R=this.decisionService.getVariationForFeature(d,g,e,I)
p.push.apply(p,R.reasons),c=R.result}var A=c.decisionSource,D=null!==(o=null===(i=c.experiment)||void 0===i?void 0:i.key)&&void 0!==o?o:null,U=null!==(s=null===(a=c.variation)||void 0===a?void 0:a.key)&&void 0!==s?s:null,S=Ye(c)
!0===S?this.logger.log(T.INFO,y.FEATURE_ENABLED_FOR_USER,"OPTIMIZELY",r,E):this.logger.log(T.INFO,y.FEATURE_NOT_ENABLED_FOR_USER,"OPTIMIZELY",r,E)
var C={},V=!1
I[t.OptimizelyDecideOption.EXCLUDE_VARIABLES]||g.variables.forEach((function(e){C[e.key]=u.getFeatureVariableValueFromVariation(r,S,c.variation,e,E)})),!I[t.OptimizelyDecideOption.DISABLE_DECISION_EVENT]&&(A===L.FEATURE_TEST||A===L.ROLLOUT&&ce(d))&&(this.sendImpressionEvent(c,r,E,S,f),V=!0)
var b=[]
I[t.OptimizelyDecideOption.INCLUDE_REASONS]&&(b=p.map((function(e){return v.apply(void 0,l([e[0]],e.slice(1)))})))
var F={flagKey:r,enabled:S,variationKey:U,ruleKey:D,variables:C,reasons:b,decisionEventDispatched:V}
return this.notificationCenter.sendNotifications(h.DECISION,{type:m.FLAG,userId:E,attributes:f,decisionInfo:F}),{variationKey:U,enabled:S,variables:C,ruleKey:D,flagKey:r,userContext:e,reasons:b}},e.prototype.getAllDecideOptions=function(e){var r=this,n=u({},this.defaultDecideOptions)
return Array.isArray(e)?e.forEach((function(e){t.OptimizelyDecideOption[e]?n[e]=!0:r.logger.log(T.WARNING,y.UNRECOGNIZED_DECIDE_OPTION,"OPTIMIZELY",e)})):this.logger.log(T.DEBUG,y.INVALID_DECIDE_OPTIONS,"OPTIMIZELY"),n},e.prototype.decideForKeys=function(e,r,n){var i=this
void 0===n&&(n=[])
var o={}
if(!this.isValidInstance())return this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","decideForKeys"),o
if(0===r.length)return o
var a=this.getAllDecideOptions(n)
return r.forEach((function(r){var s=i.decide(e,r,n)
a[t.OptimizelyDecideOption.ENABLED_FLAGS_ONLY]&&!s.enabled||(o[r]=s)})),o},e.prototype.decideAll=function(e,t){void 0===t&&(t=[])
var r=this.projectConfigManager.getConfig()
if(!this.isValidInstance()||!r)return this.logger.log(T.ERROR,y.INVALID_OBJECT,"OPTIMIZELY","decideAll"),{}
var n=Object.keys(r.featureKeyMap)
return this.decideForKeys(e,n,t)},e}(),Qe=function(){function e(e){var t=this
this.logger=e.logger,this.errorHandler=e.errorHandler,this.notificationListeners={},d(h).forEach((function(e){t.notificationListeners[e]=[]})),this.listenerId=1}return e.prototype.addNotificationListener=function(e,t){try{if(!(d(h).indexOf(e)>-1))return-1
this.notificationListeners[e]||(this.notificationListeners[e]=[])
var r=!1
if((this.notificationListeners[e]||[]).forEach((function(e){e.callback!==t||(r=!0)})),r)return-1
this.notificationListeners[e].push({id:this.listenerId,callback:t})
var n=this.listenerId
return this.listenerId+=1,n}catch(e){return this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e),-1}},e.prototype.removeNotificationListener=function(e){var t=this
try{var r,n
if(Object.keys(this.notificationListeners).some((function(i){return(t.notificationListeners[i]||[]).every((function(t,o){return t.id!==e||(r=o,n=i,!1)})),void 0!==r&&void 0!==n})),void 0!==r&&void 0!==n)return this.notificationListeners[n].splice(r,1),!0}catch(e){this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e)}return!1},e.prototype.clearAllNotificationListeners=function(){var e=this
try{d(h).forEach((function(t){e.notificationListeners[t]=[]}))}catch(e){this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e)}},e.prototype.clearNotificationListeners=function(e){try{this.notificationListeners[e]=[]}catch(e){this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e)}},e.prototype.sendNotifications=function(e,t){var r=this
try{(this.notificationListeners[e]||[]).forEach((function(n){var i=n.callback
try{i(t)}catch(t){r.logger.log(T.ERROR,y.NOTIFICATION_LISTENER_EXCEPTION,"NOTIFICATION_CENTER",e,t.message)}}))}catch(e){this.logger.log(T.ERROR,e.message),this.errorHandler.handleError(e)}},e}(),$e=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t]
return new(i.LogTierV1EventProcessor.bind.apply(i.LogTierV1EventProcessor,l([void 0],e)))}
i.LocalStoragePendingEventsDispatcher
function et(e,t,r,n){var i={sdkKey:e}
if((void 0===n||"object"==typeof n&&null!==n)&&R.assign(i,n),r){var o=le({datafile:r,jsonSchemaValidator:void 0,logger:t}),a=o.configObj,u=o.error
u&&t.error(u),a&&(i.datafile=ue(a))}return new s.HttpPollingDatafileManager(i)}var tt=n.getLogger()
n.setLogHandler(w()),n.setLogLevel(n.LogLevel.INFO)
var rt=!1,nt=function(e){try{var t=!1
e.errorHandler&&n.setErrorHandler(e.errorHandler),e.logger&&(n.setLogHandler(e.logger),n.setLogLevel(n.LogLevel.NOTSET)),void 0!==e.logLevel&&n.setLogLevel(e.logLevel)
try{(function(e){if("object"==typeof e&&null!==e){var t=e,r=t.errorHandler,n=t.eventDispatcher,i=t.logger
if(r&&"function"!=typeof r.handleError)throw new Error(v(N.INVALID_ERROR_HANDLER,F))
if(n&&"function"!=typeof n.dispatchEvent)throw new Error(v(N.INVALID_EVENT_DISPATCHER,F))
if(i&&"function"!=typeof i.log)throw new Error(v(N.INVALID_LOGGER,F))
return!0}throw new Error(v(N.INVALID_CONFIG,F))})(e),t=!0}catch(e){tt.error(e)}var r=void 0
null==e.eventDispatcher?(r=new i.LocalStoragePendingEventsDispatcher({eventDispatcher:x}),rt||(r.sendPendingEvents(),rt=!0)):r=e.eventDispatcher
var o=e.eventBatchSize,a=e.eventFlushInterval;(function(e){return!("number"!=typeof e||!R.isSafeInteger(e))&&e>=1})(e.eventBatchSize)||(tt.warn("Invalid eventBatchSize %s, defaulting to %s",e.eventBatchSize,10),o=10),function(e){return!("number"!=typeof e||!R.isSafeInteger(e))&&e>0}(e.eventFlushInterval)||(tt.warn("Invalid eventFlushInterval %s, defaulting to %s",e.eventFlushInterval,1e3),a=1e3)
var s=n.getErrorHandler(),l=new Qe({logger:tt,errorHandler:s}),c={dispatcher:r,flushInterval:a,batchSize:o,maxQueueSize:e.eventMaxQueueSize||1e4,notificationCenter:l},E=u(u({clientEngine:"javascript-sdk"},e),{eventProcessor:$e(c),logger:tt,errorHandler:s,datafileManager:e.sdkKey?et(e.sdkKey,tt,e.datafile,e.datafileOptions):void 0,notificationCenter:l,isValidInstance:t}),f=new Ze(E)
try{if("function"==typeof window.addEventListener){var d="onpagehide"in window?"pagehide":"unload"
window.addEventListener(d,(function(){f.close()}),!1)}}catch(e){tt.error(y.UNABLE_TO_ATTACH_UNLOAD,"INDEX_BROWSER",e.message)}return f}catch(e){return tt.error(e),null}},it=function(){rt=!1},ot={logging:H,errorHandler:k,eventDispatcher:x,enums:b,setLogger:n.setLogHandler,setLogLevel:n.setLogLevel,createInstance:nt,__internalResetRetryState:it,OptimizelyDecideOption:t.OptimizelyDecideOption}
Object.defineProperty(t,"setLogLevel",{enumerable:!0,get:function(){return n.setLogLevel}}),Object.defineProperty(t,"setLogger",{enumerable:!0,get:function(){return n.setLogHandler}}),t.__internalResetRetryState=it,t.createInstance=nt,t.default=ot,t.enums=b,t.errorHandler=k,t.eventDispatcher=x,t.logging=H})),w=r(K),G=K.OptimizelyDecideOption,j=K.__internalResetRetryState,H=K.createInstance,Y=K.enums,z=K.errorHandler,X=K.eventDispatcher,q=K.logging
e.OptimizelyDecideOption=G,e.__internalResetRetryState=j,e.createInstance=H,e.default=w,e.enums=Y,e.errorHandler=z,e.eventDispatcher=X,e.logging=q,Object.defineProperty(e,"__esModule",{value:!0})}))

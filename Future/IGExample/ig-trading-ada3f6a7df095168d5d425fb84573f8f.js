(function(){"use strict"
var e=Object.prototype.hasOwnProperty,t="~"
function r(){}function i(e,t,r){this.fn=e,this.context=t,this.once=r||!1}function n(){this._events=new r,this._eventsCount=0}Object.create&&(r.prototype=Object.create(null),(new r).__proto__||(t=!1)),n.prototype.eventNames=function(){var r,i,n=[]
if(0===this._eventsCount)return n
for(i in r=this._events)e.call(r,i)&&n.push(t?i.slice(1):i)
return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(r)):n},n.prototype.listeners=function(e,r){var i=t?t+e:e,n=this._events[i]
if(r)return!!n
if(!n)return[]
if(n.fn)return[n.fn]
for(var o=0,a=n.length,s=new Array(a);o<a;o++)s[o]=n[o].fn
return s},n.prototype.emit=function(e,r,i,n,o,a){var s=t?t+e:e
if(!this._events[s])return!1
var u,l,c=this._events[s],p=arguments.length
if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),p){case 1:return c.fn.call(c.context),!0
case 2:return c.fn.call(c.context,r),!0
case 3:return c.fn.call(c.context,r,i),!0
case 4:return c.fn.call(c.context,r,i,n),!0
case 5:return c.fn.call(c.context,r,i,n,o),!0
case 6:return c.fn.call(c.context,r,i,n,o,a),!0}for(l=1,u=new Array(p-1);l<p;l++)u[l-1]=arguments[l]
c.fn.apply(c.context,u)}else{var f,d=c.length
for(l=0;l<d;l++)switch(c[l].once&&this.removeListener(e,c[l].fn,void 0,!0),p){case 1:c[l].fn.call(c[l].context)
break
case 2:c[l].fn.call(c[l].context,r)
break
case 3:c[l].fn.call(c[l].context,r,i)
break
case 4:c[l].fn.call(c[l].context,r,i,n)
break
default:if(!u)for(f=1,u=new Array(p-1);f<p;f++)u[f-1]=arguments[f]
c[l].fn.apply(c[l].context,u)}}return!0},n.prototype.on=function(e,r,n){var o=new i(r,n||this),a=t?t+e:e
return this._events[a]?this._events[a].fn?this._events[a]=[this._events[a],o]:this._events[a].push(o):(this._events[a]=o,this._eventsCount++),this},n.prototype.once=function(e,r,n){var o=new i(r,n||this,!0),a=t?t+e:e
return this._events[a]?this._events[a].fn?this._events[a]=[this._events[a],o]:this._events[a].push(o):(this._events[a]=o,this._eventsCount++),this},n.prototype.removeListener=function(e,i,n,o){var a=t?t+e:e
if(!this._events[a])return this
if(!i)return 0==--this._eventsCount?this._events=new r:delete this._events[a],this
var s=this._events[a]
if(s.fn)s.fn!==i||o&&!s.once||n&&s.context!==n||(0==--this._eventsCount?this._events=new r:delete this._events[a])
else{for(var u=0,l=[],c=s.length;u<c;u++)(s[u].fn!==i||o&&!s[u].once||n&&s[u].context!==n)&&l.push(s[u])
l.length?this._events[a]=1===l.length?l[0]:l:0==--this._eventsCount?this._events=new r:delete this._events[a]}return this},n.prototype.removeAllListeners=function(e){var i
return e?(i=t?t+e:e,this._events[i]&&(0==--this._eventsCount?this._events=new r:delete this._events[i])):(this._events=new r,this._eventsCount=0),this},n.prototype.off=n.prototype.removeListener,n.prototype.addListener=n.prototype.on,n.prototype.setMaxListeners=function(){return this},n.prefixed=t,n.EventEmitter=n,"undefined"!=typeof module&&(module.exports=n),define("eventemitter3",[],(function(){return{default:n}}))})(),define("ig-trading",["lodash","fetch","set-util","eventemitter3"],(function(e,t,r,i){return function(e){var t={}
function r(i){if(t[i])return t[i].exports
var n=t[i]={i:i,l:!1,exports:{}}
return e[i].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.i=function(e){return e},r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e}
return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=156)}([function(t,r){t.exports=e},function(e,t,r){var i,n
i=[t,r(118),r(80),r(1)],n=function(e,t,r,i){"use strict"
function n(e){if(e.status>=200&&e.status<300)return e
var t=new Error(e.statusText)
return t.url=e.url,t.status=e.status,t.statusText=e.statusText,t.body=e.body,e.json().then((function(e){return t.response=e})).finally((function(){throw t}))}function o(e){return e.clone().text().then((function(t){return t?e.json():e.text()}))}function a(e,i,a){var s=arguments.length>3&&void 0!==arguments[3]&&arguments[3],u=""+a.environment.origin+e,l=i.headers=i.headers||{}
return l["Content-Type"]="application/json",l["x-device-user-agent"]=l["x-device-user-agent"]||(0,t.default)(a.environment),l["X-SECURITY-TOKEN"]=a.user.ssoToken,s||(a.user.cstToken&&(l.CST=a.user.cstToken),l["IG-ACCOUNT-ID"]||(l["IG-ACCOUNT-ID"]=a.user.broker&&a.user.broker.currentAccountId||a.user.accountId)),i.preventCaching&&(u=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"_"
t=encodeURI(t)
var r=+new Date
return e+=-1===e.indexOf("?")?"?":"&",e+(t+"=")+r}(u)),(0,r.default)(u,i).then(n).then(o)}Object.defineProperty(e,"__esModule",{value:!0}),e.send=a,e.get=function(e,t,r,i){return a(e,{preventCaching:!0,headers:i},t,r)},e.post=function(e,t,r,n,o){var a={method:"POST",contentType:"application/json",body:JSON.stringify(r),headers:n,abortController:o}
o&&(a.signal=o.signal)
return(0,i.send)(e,a,t)},e.put=function(e,t,r,i){return a(e,{method:"PUT",body:JSON.stringify(r),headers:i},t)},e.del=function(e,t,r,n){var o={method:"DELETE"},a=e
r&&(o.body=JSON.stringify(r),o.method="PUT",a+=(e.indexOf("?")>-1?"&":"?")+"_method=DELETE")
n&&(o.headers=n)
return(0,i.send)(a,o,t)}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var t=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
e.default=function(){for(var e=arguments.length,r=Array(e),i=0;i<e;i++)r[i]=arguments[i]
return function(e,i,n){for(var o=t({},e._computedMap)||Object.create(null),a=0,s=r.length;a<s;a++){var u=r[a]
o[u]=(o[u]||[]).concat(i)}return e._computedMap=function(e){var t=[]
return Object.keys(e).forEach((function(r){for(var i=0,n=e[r].length;i<n;i++){var o=e[r][i],a=e[o]
if(a){for(var s=0,u=a.length;s<u;s++)e[r].includes(a[s])||e[r].push(a[s])
t.push(o)}}})),t.forEach((function(t){return delete e[t]})),e}(o),n}}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(0),r(19),r(10),r(8),r(9),r(121),r(32),r(17),r(14),r(30),r(3)],n=function(e,t,r,i,n,o,a,s,u,l,c,p){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.direction=function(e){return{field:"direction",valid:!!e.direction,error:{key:r.default.Reason.DIRECTION_NOT_SET}}},e.limit=function(e){var r=e.limitLevel,i=e.limitType,n=t.default.isNumber(r)||e.limitRequired?(0,a.default)(r,i,e.market.dealingRules&&e.market.dealingRules.maxStopOrLimitDistance,e.scalingFactor,e.decimalPlacesFactor,e.triggerLevel||(e.position?e.position.firstTierLatest:e.currentMarketLevel),e.isBuy,e.limitRequired):{isValid:!0},o=n.isValid,s=n.error
return{field:"limit",valid:o,error:s}},e.technicalIssues=function(e){return{field:"technicalIssues",valid:Boolean(e.market.displayOffer||e.market.displayBid),error:{key:r.default.Reason.TECHNICAL_ISSUES}}},e.stop=function(e){var n=e.stopType,o=void 0,a=void 0
if(function(e){return t.default.some(["stopLevel","stopType","stopStep","stopTrailingDistance","stopLevelType"],(function(r){return t.default.get(e,r,null)!==t.default.get(e,"position."+r,null)}))}(e))if(e.allowsForStopType(n)){var u=i.default.isValid(e.stopLevel,e.stopType,e.stopLevelType,(0,s.getMinimumDistanceFromMarket)(n,e.market),e.minStepDistance,e.market.dealingRules&&e.market.dealingRules.maxStopOrLimitDistance,e.scalingFactor,e.decimalPlacesFactor,e.triggerLevel||(e.position?e.position.latest:e.currentMarketLevel),e.triggerLevel||(e.position?e.position.firstTierLatest:e.currentFirstTierMarketLevel),e.isPriceInSizeEnabled,e.isBuy,e.stopStep,e.stopTrailingDistance,e.canEditTrailingDistance,e.controlledRisk,e.stopAllowed,e.position,e.market.isKnockout,e.koUnderlyingDistance,e.stopRequired,e.isUSFx,e.isOrder)
o=u.isValid,a=u.error}else o=!1,a={key:r.default.Reason.INVALID_STOP_TYPE}
else o=!0
return{field:"stop",valid:o,error:a}},e.controlledRiskUser=function(e){var i=!0,n={},o=e.controlledRisk,a=e.position||e.order,s=a&&t.default.isNumber(a.stopLevel)&&!t.default.isNumber(e.stopLevel)
o&&s&&(i=!1,n={key:r.default.Reason.STOP_GUARANTEED_CAN_NOT_BE_REMOVED})
return{field:"stop",valid:i,error:n}},e.guaranteedStopIsEmptyValidator=function(e){var n=!0,o={},a=e.stopLevel
e.stopType!==i.default.Type.GUARANTEED||t.default.isNumber(a)&&0!==a||(n=!1,o={key:r.default.Reason.STOP_GUARANTEED_CAN_NOT_BE_REMOVED})
return{field:"stop",valid:n,error:o}},e.stopSizeChangeAllowed=function(e){var t=e.market.marketStatus,a=e.stopType===i.default.Type.GUARANTEED,s=!0
if(a&&(t===o.default.EDIT||t===o.default.AUCTION)){var u=e.triggerLevel||e.currentMarketLevel,l=e.decimalPlacesFactor,c=e.position||e.order
if(c){var p=n.default.distanceFrom(c.stopLevel,c.stopLevelType,u,l)
s=n.default.distanceFrom(e.stopLevel,e.stopLevelType,u,l)>=p}else s=!1}return{field:"stop",valid:s,error:{key:s?null:r.default.Reason.STOP_GUARANTEED_MOVE_AWAY}}},e.marketDealable=function(e){return{field:"marketDealable",valid:e.isMarketDealable,error:{key:r.default.Reason.MARKET_NOT_DEALABLE}}},e.dateBelowMin=function(e){var t=+e.heartbeat.timestamp,i=e.expiryTime,n=e.timeInForce,o=!1
o=n?"GOOD_TILL_DATE"===n&&+i>=t:!i||+i>=t
return{field:"expiryTime",valid:o,error:{key:r.default.Reason.DATE_BELOW_MIN,data:{minDate:t}}}},e.sizeBelowMax=function(e){return{field:"size",valid:0!==e.maxSize&&(+e.size||0)<=(+e.maxSize||1/0),error:{key:r.default.Reason.SIZE_ABOVE_MAX}}},e.dmaSizeBelowMax=function(e){return{field:"size",valid:0!==e.maxSize&&(+e.size||0)<=(+e.maxSize||1/0),error:{key:r.default.Reason.SIZE_ABOVE_ORIGINAL}}},e.dmaSizeAboveFilled=function(e){return{field:"size",valid:e.size>e.filledQuantity,error:{key:r.default.Reason.SIZE_BELOW_PARTIAL}}},e.sizeAboveMin=function(e){var t=e.minDealSize&&+e.minDealSize.value
return{field:"size",valid:!t||+e.size>=t,error:{key:r.default.Reason.SIZE_BELOW_MIN,data:{min:t}}}},e.sizeAboveZero=function(e){return{field:"size",valid:+e.size>0,error:{key:r.default.Reason.SIZE_NOT_ABOVE_ZERO}}},e.shareDealingSizeAboveZero=function(e){var t=r.default.Reason.SIZE_NOT_ABOVE_ZERO
l.default.isConsideration(e.sizeUnit)&&(t=r.default.Reason.VALUE_NOT_ABOVE_ZERO)
return{field:"size",valid:+e.size>0,error:{key:t}}},e.levelAboveZero=function(e){return{field:"level",valid:e.orderType===u.default.MARKET||+e.level>0,error:{key:r.default.Reason.LEVEL_REQUIRED}}},e.triggerLevelAboveZero=function(e){return{field:"triggerLevel",valid:+e.triggerLevel>0,error:{key:r.default.Reason.TRIGGER_LEVEL_REQUIRED}}},e.triggerLevelDmaCorrectIncrementTick=function(e){var t=+e.triggerLevel
if(!t||!(e.market&&e.market.dmaMarketData&&e.market.dmaMarketData.rangeData))return{field:"triggerLevel",valid:!0,error:null}
var i=(o=e.market.dmaMarketData.rangeData,a=t,o.find((function(e){return a>=e.start&&a<=e.end})).step),n=Math.abs(t/i-Math.round(t/i))<1e-6
var o,a
return{field:"triggerLevel",valid:t&&n,error:{key:r.default.Reason.TRIGGER_LEVEL_INVALID_TICK,data:{step:i}}}},e.triggerLevelAboveZeroForNonMarketOrder=function(e){var t=e.orderType===u.default.MARKET
return{field:"triggerLevel",valid:t||+e.triggerLevel>0,error:t?null:{key:r.default.Reason.TRIGGER_LEVEL_REQUIRED}}},e.triggerLevelAboveZeroForLimitOrder=function(e){var t=e.orderType&&e.orderType.includes("LIMIT")
return{field:"triggerLevel",valid:!t||t&&+e.triggerLevel>0,error:{key:r.default.Reason.TRIGGER_LEVEL_REQUIRED}}},e.stopPriceAboveZeroForStopOrder=function(e){var t=e.orderType&&e.orderType.includes("STOP")
return{field:"stop",valid:!t||t&&+e.stopPrice>0,error:{key:r.default.Reason.STOP_REQUIRES_LEVEL}}},e.stopPriceNotInRangeOfBidOfferPrice=function(e){var t=e.orderType&&e.orderType.includes("STOP"),i="sell"===e.direction,n=+e.stopPrice,o=!!n,a=void 0
t&&(i?(o&=+e.stopPrice<e.market.bid,a=r.default.Reason.STOP_LEVEL_SELL_ABOVE_BID):(o&=+e.stopPrice>e.market.offer,a=r.default.Reason.STOP_LEVEL_BUY_BELOW_OFFER))
return{field:"stop",valid:Boolean(!t||!n||o),error:{key:a}}},e.stopPriceRightSideOfBidOfferPriceForDMATicket=function(e){var t=e.orderType===u.default.STOP,i=+e.triggerLevel,n=!0,o=null
t&&i&&(e.isSell?(n=e.triggerLevel<=e.market.bid,o={key:r.default.Reason.STOP_LEVEL_SELL_ABOVE_BID}):(n=e.triggerLevel>=e.market.offer,o={key:r.default.Reason.STOP_LEVEL_BUY_BELOW_OFFER}))
return{field:"triggerLevel",valid:n,error:o}},e.triggerLevelValidForOrderType=function(e){var t=!1,i=void 0
if(e.order){var n=e.currentMarketLevel,o=e.triggerLevel
i=e.order.level<n?(t=o<n)?null:{key:r.default.Reason.TRIGGER_LEVEL_TOO_HIGH}:(t=o>n)?null:{key:r.default.Reason.TRIGGER_LEVEL_TOO_LOW}}else t=!1
return{field:"triggerLevel",valid:t,error:i}},e.triggerLevelWithinValidDistance=function(e){var t=e.currentMarketLevel,i=e.triggerLevel,n=e.maxOrderDistance
return{field:"triggerLevel",valid:!n||i>=t-n.value&&i<=t+n.value,error:{key:r.default.Reason.TRIGGER_LEVEL_TOO_FAR}}},e.orderTypeLimitForOption=function(e){return{field:"triggerLevel",valid:!e.isOptionOrderEnabled||!e.market.isOption||"LIMIT"===e.orderType,error:{key:r.default.Reason.ORDER_TYPE_NOT_LIMIT_FOR_OPTION}}},e.controlledRiskTradingAvailable=function(e){return{field:"marketDealable",valid:e.market.isLimitedRisk||!(e.controlledRisk&&!e.market.guaranteedStopsAllowed),error:{key:r.default.Reason.CONTROLLED_RISK_TRADING_UNAVAILABLE}}},e.hasLiveData=function(e){return{field:"delayedPrice",valid:e.market.isDelayed===e.market.isAuditing,error:{key:r.default.Reason.NOT_AUDITING}}},e.quantityBelowFilled=function(e){var t=void 0
t=0===e.order.filledQuantity?r.default.Reason.QUANTITY_NOT_ABOVE_ZERO:r.default.Reason.QUANTITY_BELOW_FILLED
return{field:"quantity",valid:e.quantity>e.order.filledQuantity,error:{key:t}}}
e.bookCostFilled=function(e){return{field:"bookCost",valid:e.bookCost>0,error:{key:r.default.Reason.BOOK_COST_FILLED}}},e.orderSizeAboveZero=function(e){var t=e.sizeUnit,i=e.orderSize
return{field:"orderSize",valid:!l.default.isConsideration(t)||null===i||i>0,error:{key:r.default.Reason.ORDER_SIZE_ABOVE_ZERO}}},e.noBuyingStopMarketOrders=function(e){return{field:"orderType",valid:"sell"===e.direction||"STOP_MARKET"!==e.orderType,error:{key:r.default.Reason.BUY_ORDER_TYPE_CANNOT_BE_STOP_MARKET}}},e.stopOnlyForOTCTradeableMarket=function(e){if(!e.market.otcTradeable)return{field:"stop",valid:!0,error:null}
return p.stop(e)},e.limitOnlyForOTCTradeableMarketAndNonLimitDayOrderType=function(e){var t=e.orderType===u.default.LIMIT&&e.timeInForce===c.default.GOOD_FOR_DAY
if(!e.market.otcTradeable||t)return{field:"limit",valid:!0,error:null}
return p.limit(e)},e.orderTypeAndExpiry=function(e){return{field:"timeInForce",valid:e.checkForValidOrderTypeAndExpiry(),error:{key:r.default.Reason.TIME_IN_FORCE_NOT_VALID_FOR_ORDER_TYPE}}}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(130),r(6),r(38),r(24),r(0),r(28)],n=function(e,t,r,i,n,o,a){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var s=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var u=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var l=function(e){function r(e,t,n){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{inProgress:!1,isComplete:!1,isConfirmed:!1,isRejected:!1}))
return o._data=e,o._session=t,o._confirmationStreamingClient=n,o.setState(i.NOT_STARTED,null),o._onFirstPoll=o._onFirstPoll.bind(o),o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),s(r,[{key:"_onFirstPoll",value:function(){this.trigger(n.default.FIRST_POLL),this._confirmationPoller.off(n.default.FIRST_POLL,this._onFirstPoll)}},{key:"start",value:function(){var e=this,r=this._data.dealReference
this.setState(i.STARTED,null),this._doRequest().then(this._handleDealPlaced.bind(this)).catch((function(t){e.isComplete||(e.trigger(n.default.DEAL_FAILED),e.setState(i.FAILED,t.statusText),e.destroy())})),this._data.isDMA||this._confirmationStreamingClient.waitForConfirm(r).then(this._createResolved.bind(this),this._createRejected.bind(this)),this._confirmationPoller=new t.default(this._session,r),this._confirmationPoller.on(n.default.FIRST_POLL,this._onFirstPoll),this._confirmationPoller.pollForConfirm().then(this._createResolved.bind(this),this._createRejected.bind(this)),this.setState(i.PENDING,{dealReference:r})}},{key:"_doRequest",value:function(){throw new Error("Not implemented.")}},{key:"abort",value:function(){this.trigger(n.default.DEAL_FAILED),this.setState(i.ABORTED,null),this.destroy()}},{key:"setState",value:function(e,t){this.setProperties({state:e,details:t,isConfirmed:e===i.CONFIRMED,isRejected:e===i.REJECTED,inProgress:o.default.includes(i.IN_PROGRESS_STATES,e),isComplete:o.default.includes(i.COMPLETED_STATES,e)}),this.trigger("state",e)}},{key:"destroy",value:function(){delete this._data,this._confirmationPoller&&(this._confirmationPoller.destroy(),this._confirmationPoller=null),u(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"destroy",this).call(this)}},{key:"_handleDealPlaced",value:function(e){var t=e.dealReference
this._data.isDMA&&(this._confirmationPoller.updateDealReference(t),this._confirmationStreamingClient.waitForConfirm(t).then(this._createResolved.bind(this),this._createRejected.bind(this))),this.trigger(n.default.INITIAL_DEAL_RESPONSE)}},{key:"_createResolved",value:function(e){this.trigger(n.default.FINAL_DEAL_RESPONSE),this.setState(i.CONFIRMED,e),this.destroy()}},{key:"_createRejected",value:function(e){if(this.trigger(n.default.DEAL_FAILED),"RETRY_COUNT_EXCEEDED"===e)this.setState(i.UNVERIFIED,null)
else{var t=o.default.get(e,"category"),r=o.default.get(e,"content.reportType")
"EXCHANGE"===t&&r===a.CANCELLED?this.setState(i.CANCELLED,e):this.setState(i.REJECTED,e)}this.destroy()}}]),r}(r.default)
e.default=l}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0),r(2),r(77),r(128),r(125),r(126),r(74),r(72),r(9),r(22)],n=function(e,t,r,i,n,o,a,s,u,l,c){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.INSTRUMENT_TYPES=e.KNOCKOUT_TYPES=e.OPTION_TYPES=e.UNITS=e.PIS_FID_SCHEMA=e.PIS_MAX_CURRENCY_COUNT=e.MARKET_V4_FID_SCHEMA=e.V2_TO_V4_FID_MAPPING=e.OPTION_TYPE_TO_KNOCKOUT_TYPE=e.KO_FID_SCHEMA=void 0
var p=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],i=!0,n=!1,o=void 0
try{for(var a,s=e[Symbol.iterator]();!(i=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);i=!0);}catch(u){n=!0,o=u}finally{try{!i&&s.return&&s.return()}finally{if(n)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}
var f,d,y,h,v,g,_,O,b,m,T,k,P,S,E,L,w,D,C,I,A,R,j,M,F,N,U,z,x,V,B,G,K,W,q,Q,H,Y,J,Z,X,$,ee,te,re,ie,ne,oe,ae,se,ue=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
function le(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}function ce(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}for(var pe=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e},fe=e.KO_FID_SCHEMA=Object.freeze({KO_UND_BID:"displayUnderlyingBid",KO_UND_ASK:"displayUnderlyingOffer",KO_PREMIUM:"knockoutPremium"}),de=Object.freeze({KO_PREMIUM:"knockoutPremium"}),ye=e.OPTION_TYPE_TO_KNOCKOUT_TYPE=Object.freeze({CALL:"BULL",PUT:"BEAR"}),he=e.V2_TO_V4_FID_MAPPING=Object.freeze({BID:"BID",BID_QUOTE_ID:"BID_QUOTE",CPT:"CHANGE",CPC:"CHANGE_PCT",HIG:"HIGH",LOW:"LOW",MKT:"MARKET_NAME",OFR:"OFFER",OFR_QUOTE_ID:"OFFER_QUOTE",UBS:"MARKET_STATUS",UTM:"UPDATE_TIME",FINANCIAL_MID:"MID"}),ve=e.MARKET_V4_FID_SCHEMA=Object.freeze({BID:"displayBid",BID_QUOTE:"bidQuoteId",CHANGE:"netChange",CHANGE_PCT:"percentageChange",HIGH:"high",LOW:"low",MARKET_NAME:"instrumentName",MARKET_STATUS:"rawMarketStatus",OFFER:"displayOffer",OFFER_QUOTE:"offerQuoteId",UPDATE_TIME:"updateTime",MID:"referencePrice"}),ge=Object.freeze({BIDQUOTEID:"bidQuoteId",ASKQUOTEID:"offerQuoteId",HIGH:"high",LOW:"low",MIDPRICE:"referencePrice",NET_CHG:"netChange",NET_CHG_PCT:"percentageChange",DLG_FLAG:"rawMarketStatus",TIMESTAMP:"updateTime"}),_e=e.PIS_MAX_CURRENCY_COUNT=6,Oe={CURRENCY0:""},be=1;be<=5;be++)Oe["BIDPRICE"+be]="displayBid"+be,Oe["ASKPRICE"+be]="displayOffer"+be
for(var me=0;me<_e;me++){me>0&&(Oe["CURRENCY"+me]="")
for(var Te=1;Te<=5;Te++){var ke=me>0?"C"+me:""
Oe[ke+"BIDSIZE"+Te]="",Oe[ke+"ASKSIZE"+Te]=""}}var Pe=e.PIS_FID_SCHEMA=Object.freeze(pe({},Oe,ge,de)),Se=new RegExp("^CURRENCY([0-"+(_e-1)+"])$"),Ee=new RegExp("^(?:C([1-"+(_e-1)+"]))??(BID|ASK)SIZE([1-5])$"),Le=Array.from({length:8},(function(e,t){return t+1})),we=Object.freeze(Le.reduce((function(e,t){var r
return pe(e,(ce(r={},"SWAP_"+t+"_SHORT","swapRateShort"),ce(r,"SWAP_"+t+"_LONG","swapRateLong"),r))}),{})),De=Object.freeze(pe({},ve,we,fe)),Ce=/^(.+?)@t\[(.+?)@t\](.+)?/,Ie=e.UNITS=Object.freeze({AMOUNT:"A",CONTRACTS:"C",SHARES:"S"}),Ae=(e.OPTION_TYPES=Object.freeze({CALL:"CALL",PUT:"PUT"}),e.KNOCKOUT_TYPES=Object.freeze({BULL:"BULL",BEAR:"BEAR"}),e.INSTRUMENT_TYPES=Object.freeze({BINARY:"BINARY",EQUITY_KNOCKOUT:"KNOCKOUTS_SHARES",FX_KNOCKOUT:"KNOCKOUTS_CURRENCIES",FX:"CURRENCIES",COMMODITY:"COMMODITIES"})),Re=function(e){return null==e},je=function(e){return Number.isFinite(e)?e:0}
function Me(e){var r=t.default.get(e,"instrumentData.instrumentType","")
return r===Ae.BINARY||/^XSTOCKS_/.test(r)?t.default.get(e,"instrumentData.chartEpic",null):t.default.get(e,"instrumentData.epic",null)}var Fe=(f=(0,r.default)("displayBid"),d=(0,r.default)("displayBid1"),y=(0,r.default)("displayBid2"),h=(0,r.default)("displayBid3"),v=(0,r.default)("displayBid4"),g=(0,r.default)("displayBid5"),_=(0,r.default)("displayUnderlyingBid"),O=(0,r.default)("instrumentType"),b=(0,r.default)("instrumentType"),m=(0,r.default)("unit"),T=(0,r.default)("delayTime"),k=(0,r.default)("instrumentType"),P=(0,r.default)("isFx","isCryptocurrency"),S=(0,r.default)("instrumentType"),E=(0,r.default)("instrumentType"),L=(0,r.default)("unit","share"),w=(0,r.default)("rawMarketStatus","isShare"),D=(0,r.default)("bid","offer"),C=(0,r.default)("bid","offer"),I=(0,r.default)("displayOffer"),A=(0,r.default)("displayOffer1"),R=(0,r.default)("displayOffer2"),j=(0,r.default)("displayOffer3"),M=(0,r.default)("displayOffer4"),F=(0,r.default)("displayOffer5"),N=(0,r.default)("displayUnderlyingOffer"),U=(0,r.default)("midPrice","range"),z=(0,r.default)("midPrice","spread","scalingFactor"),x=(0,r.default)("high","low"),V=(0,r.default)("bid","offer","scalingFactor"),B=(0,r.default)("bid1","offer1","scalingFactor"),G=(0,r.default)("bid2","offer2","scalingFactor"),K=(0,r.default)("bid3","offer3","scalingFactor"),W=(0,r.default)("bid4","offer4","scalingFactor"),q=(0,r.default)("bid5","offer5","scalingFactor"),Q=(0,r.default)("unit"),H=(0,r.default)("currencies"),Y=(0,r.default)("lotSize","scalingFactor","unit"),J=(0,r.default)("bidQuoteId"),Z=(0,r.default)("offerQuoteId"),X=(0,r.default)("viewPermission","isDelayed","hasCompleteMarketData"),$=(0,r.default)("isKnockout","isOption"),ee=(0,r.default)("isKnockout","isOption","dealingRules"),te=(0,r.default)("instrumentType"),re=(0,r.default)("instrumentType"),ie=(0,r.default)("swapRateLong","isKnockout","knockoutType","isFx","isCommodity"),ne=(0,r.default)("swapRateShort","isKnockout","knockoutType","isFx","isCommodity"),oe=(0,r.default)("isKnockout","isOption","dealingRules"),ae=(0,r.default)("dealingRules"),se=function(e){function r(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
var t=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,e))
return t.pisCurrencies=new Array(_e).fill(null),t.pisCurrenciesFromStreaming=new Array(_e).fill(null),t.pisDisplaySizeThresholds=Array.from({length:_e},(function(){return{bid:new Array(5).fill(null),offer:new Array(5).fill(null)}})),t.boundOnStreamedV2Update=t.onStreamedV2Update.bind(t),t.boundOnStreamedV4Update=t.onStreamedV4Update.bind(t),t.boundOnStreamedPriceUpdate=t.onStreamedPriceUpdate.bind(t),t}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),ue(r,[{key:"_calculateSpread",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=this["offer"+e],r=this["bid"+e],i=this.scalingFactor
return[t,r].some(Re)?null:+(Math.abs(t-r)*i).toFixed(this.decimalPlacesFactor)}},{key:"_getDisplaySwapRate",value:function(e){var t=this.isKnockout,r=this.isFx,i=this.knockoutType,n=this.isCommodity
return r||t&&i===(e?"BULL":"BEAR")||n?e?this.swapRateLong:this.swapRateShort:null}},{key:"_toAccountTimeInBinaryName",value:function(e){var t=e.match(Ce)
if(!t)return e
var r=p(t,4),i=r[1],n=r[2],o=r[3],a=void 0===o?"":o
return""+i+(0,u.toAccountTimeFromLondonTime)(n,this.timezoneOffset)+a}},{key:"getSubscriptionModifiers",value:function(){var e=[]
return this.scaled&&e.push("SCALED"),e}},{key:"onStreamedV2Update",value:function(e){var t=this,r={}
e.forEachChangedField((function(e,t,i){var n=he[e]||e,o="UBS"===e?l.MARKET_STATUS_NUMBER_MAP[+i]:i
r[De[n]]=o})),["displayUnderlyingBid","displayUnderlyingOffer"].forEach((function(e){r[e]&&(r[e]=parseFloat(r[e]).toFixed(t.decimalPlacesFactor))})),r.instrumentName&&(r.instrumentName=this._toAccountTimeInBinaryName(r.instrumentName)),this.isAuditing&&(e.isValueChanged("BID")||e.isValueChanged("OFR"))&&(r.auditCount=this.auditCount+1),this.setProperties(r)}},{key:"onStreamedV4Update",value:function(e){var t=this
if(!this.isAuditing){var r={}
e.forEachChangedField((function(e,t,i){return r[De[e]]=i})),["displayUnderlyingBid","displayUnderlyingOffer"].forEach((function(e){r[e]&&(r[e]=parseFloat(r[e]).toFixed(t.decimalPlacesFactor))})),r.instrumentName&&(r.instrumentName=this._toAccountTimeInBinaryName(r.instrumentName)),this.setProperties(r)}}},{key:"onStreamedPriceUpdate",value:function(e){var t=this,i={}
e.forEachChangedField((function(e,n,o){var a=Se.exec(e),s=Ee.exec(e)
if(a){var u=parseInt(a[1],10)
i.pisCurrenciesFromStreaming=i.pisCurrenciesFromStreaming||t.pisCurrenciesFromStreaming.slice(),i.pisCurrenciesFromStreaming[u]=o}else if(s){var c=parseInt(s[1]||"0",10),p={BID:"bid",ASK:"offer"}[s[2]],f=parseInt(s[3],10)-1,d=i.pisCurrenciesFromStreaming||t.pisCurrenciesFromStreaming,y=t.getApiPiSCurrencyIndexFromStreamedPiSCurrencyIndex(d,c)
void 0!==y&&(i.pisDisplaySizeThresholds=i.pisDisplaySizeThresholds||t.pisDisplaySizeThresholds.slice(),i.pisDisplaySizeThresholds[y][p][f]=o)}else"DLG_FLAG"===e?i[Pe[e]]=(0,l.convertDealingFlagToMarketStatus)(o):"TIMESTAMP"===e?i[Pe[e]]=r.convertTimestampToLondonTime(o):(i[Pe[e]]=o,"BIDPRICE1"===e?i.displayBid=o:"ASKPRICE1"===e&&(i.displayOffer=o))})),this.isAuditing&&(i.displayBid&&i.displayBid!==this.displayBid||i.displayOffer&&i.displayOffer!==this.displayOffer)&&(i.auditCount=this.auditCount+1),this.setProperties(i)}},{key:"getApiPiSCurrencyIndexFromStreamedPiSCurrencyIndex",value:function(e,t){var r=e[t]
return this.getPiSCurrencyIndex(r)}},{key:"getPiSCurrencyIndex",value:function(e){var t=this.pisCurrencies,r=-1
return e&&(r=t.indexOf(e)),-1===r?void 0:r}},{key:"getPiSLadder",value:function(e,t){var r=this.getPiSCurrencyIndex(t)
if(void 0===r||!["buy","sell"].includes(e))return[]
for(var i={buy:"offer",sell:"bid"}[e],n=this.pisDisplaySizeThresholds[r][i],o=[],a=1;a<=5;a++){var u=n[a-1]
if(null===u)break
var l=(0,s.default)(u),p=l/this.lotSize,f=""+p,d=this["spread"+a]
o.push({rawDisplaySize:u,rawSize:l,displaySize:f,size:p,spread:d})}return(0,c.adjustPrecisionOfTierSizeData)(o,this.dealSizeDecimalPlaces)}},{key:"arePricesAvailableForAnyPiSLaddersTierAboveTierOne",value:function(){for(var e=2;e<=5;e++){var t=this["offer"+e],r=this["bid"+e]
if(![null,void 0].includes(t)&&![null,void 0].includes(r))return!0}return!1}},{key:"populateWith",value:function(e){e.displayBid=e.bid||e.displayBid,e.displayOffer=e.offer||e.displayOffer,e.rawMarketStatus=e.ncrMarketStatus,e.bidQuoteId="-"===e.bidQuoteId?null:e.bidQuoteId,e.offerQuoteId="-"===e.offerQuoteId?null:e.offerQuoteId,this.setProperties(e)}},{key:"updateCurrencyExchangeRate",value:function(e,r){var i=this.currencies,n=t.default.find(i,(function(t){return t.name===e}))
n&&n.set("exchangeRate",r)}},{key:"bid",get:function(){return(0,s.default)(this.displayBid)}},{key:"bid1",get:function(){return(0,s.default)(this.displayBid1)}},{key:"bid2",get:function(){return(0,s.default)(this.displayBid2)}},{key:"bid3",get:function(){return(0,s.default)(this.displayBid3)}},{key:"bid4",get:function(){return(0,s.default)(this.displayBid4)}},{key:"bid5",get:function(){return(0,s.default)(this.displayBid5)}},{key:"underlyingBid",get:function(){return(0,s.default)(this.displayUnderlyingBid)}},{key:"isOption",get:function(){return/^OPT_/i.test(this.instrumentType)}},{key:"isBinary",get:function(){return this.instrumentType===Ae.BINARY}},{key:"isContract",get:function(){return this.unit===Ie.CONTRACTS}},{key:"isDelayed",get:function(){return 0!==this.delayTime}},{key:"isFx",get:function(){return this.instrumentType===Ae.FX}},{key:"isNonCryptoFx",get:function(){return this.isFx&&!this.isCryptocurrency}},{key:"isEquityKnockout",get:function(){return this.instrumentType===Ae.EQUITY_KNOCKOUT}},{key:"isFXKnockout",get:function(){return this.instrumentType===Ae.FX_KNOCKOUT}},{key:"isShare",get:function(){return this.unit===Ie.SHARES||!!this.share}},{key:"marketStatus",get:function(){return l.default.resolve({rawMarketStatus:this.rawMarketStatus,instrumentType:this.instrumentType,isShare:this.isShare})}},{key:"midPrice",get:function(){return r.getMidPrice(this.bid,this.offer,this.decimalPlacesFactor)}},{key:"calculatedMidPrice",get:function(){return r.getCalculatedMidPrice(this.bid,this.offer,this.decimalPlacesFactor)}},{key:"offer",get:function(){return(0,s.default)(this.displayOffer)}},{key:"offer1",get:function(){return(0,s.default)(this.displayOffer1)}},{key:"offer2",get:function(){return(0,s.default)(this.displayOffer2)}},{key:"offer3",get:function(){return(0,s.default)(this.displayOffer3)}},{key:"offer4",get:function(){return(0,s.default)(this.displayOffer4)}},{key:"offer5",get:function(){return(0,s.default)(this.displayOffer5)}},{key:"underlyingOffer",get:function(){return(0,s.default)(this.displayUnderlyingOffer)}},{key:"percentRange",get:function(){var e=this.midPrice,t=this.range
return[t,e].some(Re)?null:+je(t/e*100).toFixed(Math.min(this.decimalPlacesFactor+2,6))}},{key:"percentSpread",get:function(){var e=this.midPrice,t=this.scalingFactor,r=this.spread
return[r,t,e].some(Re)?null:+je((r/=t)/e*100).toFixed(Math.min(this.decimalPlacesFactor+2,6))}},{key:"range",get:function(){var e=(0,s.default)(this.high),t=(0,s.default)(this.low)
return[e,t].some(Re)?null:+(e-t).toFixed(this.decimalPlacesFactor)}},{key:"spread",get:function(){return this._calculateSpread()}},{key:"spread1",get:function(){return this._calculateSpread("1")}},{key:"spread2",get:function(){return this._calculateSpread("2")}},{key:"spread3",get:function(){return this._calculateSpread("3")}},{key:"spread4",get:function(){return this._calculateSpread("4")}},{key:"spread5",get:function(){return this._calculateSpread("5")}},{key:"dealSizeDecimalPlaces",get:function(){return this.unit===Ie.SHARES?0:2}},{key:"ticketDefaultCurrency",get:function(){var e=this.currencies.find((function(e){return e.ticketDefault}))
return e||(this.currencies&&this.currencies.length>0?this.currencies[0]:null)}},{key:"valueOfOnePoint",get:function(){var e=this.unit,t=this.lotSize
return e===Ie.CONTRACTS&&t?t:e===Ie.SHARES?this.scalingFactor/100:null}},{key:"sanitisedBidQuoteId",get:function(){var e=this.bidQuoteId
return t.default.isString(e)?e:null}},{key:"sanitisedOfferQuoteId",get:function(){var e=this.offerQuoteId
return t.default.isString(e)?e:null}},{key:"isFree",get:function(){var e=(this.viewPermission||"").toUpperCase()
return this.hasCompleteMarketData&&!("L1"===e||"L2"===e)&&!this.isDelayed}},{key:"marketOrderAllowed",get:function(){return!this.isKnockout&&!this.isOption}},{key:"guaranteedStopsAllowed",get:function(){return!1!==this.dealingRules.guaranteedStopsAllowed&&!this.isOption&&!this.isKnockout}},{key:"isLimitedRisk",get:function(){return/^OPT|^BINARY|^KNOCKOUTS/i.test(this.instrumentType)}},{key:"isCommodity",get:function(){return this.instrumentType===Ae.COMMODITY}},{key:"displaySwapRateLong",get:function(){return this._getDisplaySwapRate(!0)}},{key:"displaySwapRateShort",get:function(){return this._getDisplaySwapRate(!1)}},{key:"trailingStopsAllowedPreference",get:function(){return"HIDE"!==this.dealingRules.trailingStopPreference&&!this.isOption&&!this.isKnockout}},{key:"minDealSize",get:function(){return this.dealingRules.minDealSize}}],[{key:"getMidPrice",value:function(e,t,r){return[t,e].some(Re)?null:+((e+t)/2).toFixed(r)}},{key:"getCalculatedMidPrice",value:function(e,t,r){return t||0===t||e||0===e?t||0===t?e||0===e?+((e+t)/2).toFixed(r):+t.toFixed(r):+e.toFixed(r):null}},{key:"getFidsForSwapRate",value:function(e,t){return!e||e<1||e>8?[]:t.map((function(t){return"SWAP_"+e+"_"+t}))}},{key:"convertV3MarketDetailsJsonToV2",value:function(e){var t=e.instrumentData,r=e.marketSnapshotData||{},n=e.dealingRulesData||{},o=e.metaData||{}
t.expiryDetails={expiryDate:t.expiryDate},t.stopsLimitsAllowed=!!t.stopAllowed,i.default.isUnpriced(t.epic)&&(t.viewPermission=r.viewPermission),r.midFormatted=r.mid,r.bidFormatted=r.bestBidFormatted=r.bid,r.offerFormatted=r.bestOfferFormatted=r.ask,r.highFormatted=r.high,r.lowFormatted=r.low,r.offerQuoteId=r.askQuoteId,r.referenceEpic=t.referenceEpic,n.currencyOffset=o.currencyOffset,n.marketOrderPreference=t.marketOrderPreference}},{key:"populateWithV2MarketData",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],s=e.instrumentData
if(i.default.isUnpriced(s.epic))return n.default.populateWithV2MarketData(e)
var u=e.marketSnapshotData,c=e.dealingRulesData||{},p=e.metaData||{},f=e.dealSettings||{},d=e.knockoutData||{},y=e.commissionsRateData||{},h=s.instrumentType
t&&r.normalisePiSBidAndAskPrices(u)
var v=new r({epic:s.epic})
return v.populateWith({controlledRisk:!!p.controlledRisk,dealingRules:c,chartCode:s.chartCode,chartEpic:Me(e),commissionsMinCharge:y.minChargeWeb,commissionsCharge:y.charge,commissionsRateType:y.rateType,commissionsCurrencyIsoCode:y.currencyIsoCode,instrumentName:s.marketName,igInstrumentId:s.igInstrumentId,marketId:s.marketId,exchangeId:s.exchangeId,expiryDetails:s.expiryDetails,latestPossibleDealingTimestamp:s.instrumentLatestPossibleDealingTimestamp,displayPeriod:s.displayPrompt,isin:s.isin,mtfAvailable:s.mtfAvailable,otcTradeable:s.otcTradeable,instrumentDmaL1Tradeable:"???",dmaTradeable:s.dmaTradeable,dmaL1Tradeable:s.dmaL1Tradeable,dynamicHierarchyEpic:s.dynamicHierarchyEpic,instrumentType:h,securityType:s.securityType,stopsLimitsAllowed:s.stopsLimitsAllowed,stopAllowed:s.stopAllowed,limitAllowed:s.limitAllowed,unit:s.unit,ncrMarketStatus:l.MARKET_STATUS_NUMBER_MAP[u.marketStatus],high:u.highFormatted,low:u.lowFormatted,percentageChange:u.percentageChange,netChange:u.netChange,displayBid:u.bidFormatted,displayOffer:u.offerFormatted,referencePrice:u.midFormatted,displayUnderlyingBid:parseFloat(u.underlyingBid).toFixed(u.decimalPlacesFactor),displayUnderlyingOffer:parseFloat(u.underlyingAsk).toFixed(u.decimalPlacesFactor),knockoutPremium:u.knockoutPremium,knockoutRelatedEpic:d.relatedEpic,knockoutLevels:d.levels,knockoutDefaultLevel:d.defaultLevel,isKnockout:s.knockout,share:s.share,knockoutType:s.knockout?ye[s.optionType]:null,bidQuoteId:u.bidQuoteId,offerQuoteId:u.offerQuoteId,bestBid:u.bestBidFormatted,bestOffer:u.bestOfferFormatted,scalingFactor:u.scalingFactor,decimalPlacesFactor:u.decimalPlacesFactor,updateTime:u.updateTime,viewPermission:u.viewPermission||s.viewPermission,delayTime:u.delayTime,isAuditing:!1,scaled:u.scaled,marketAnalysisAvailable:s.marketAnalysisAvailable,alertsAllowed:s.alertsAllowed,countryCode:s.countryCode,newsSymbol:s.newsCode,firstFxCurrency:s.firstFxCurrency,currency:s.currency,isCryptocurrency:s.cryptocurrency,currencies:s.currencies?s.currencies.map(o.default.populateWithJson):[],collateralHaircut:s.collateralHaircut,defaultOrderType:f.defaultOrderType,defaultOrderExpiry:f.defaultOrderExpiry,defaultStopType:f.defaultStopType,defaultDealSize:+f.defaultDealSize||void 0,lastSelectedEpic:e.lastSelectedEpic,lastTradedPointsThroughCurrent:f.lastTradedPointsThroughCurrent,lastTradedSize:+f.lastTradedDealSize||void 0,lastTradedCurrency:f.lastTradedDealCurrency,lastTradedLimitDistance:+f.lastTradedLimitDistance||void 0,lastTradedStopDistance:+f.lastTradedStopDistance||void 0,lastTradedStopType:f.lastTradedStopType,lastTradedTrailingStopIncrement:+f.lastTradedTrailingStopIncrement||void 0,lastTradedOrderExpiry:f.lastTradedOrderExpiry,lastTradedOrderType:f.lastTradedOrderType,lotSize:s.lotSize,prompt:s.prompt,timezoneOffset:p.timezoneOffset,hasCompleteMarketData:!0,limitedRiskPremium:s.limitedRiskPremium,valueOfOnePip:s.valueOfOnePip,contractSize:s.contractSize,swapRateLong:s.swapRateLong,swapRateShort:s.swapRateShort,optionType:s.optionType,strikePrice:s.strikeLevel||e.strikePrice,strikeLevel:s.strikeLevel||e.strikePrice,multiplier:s.multiplier,underlyingEpic:e.underlyingEpic,underlyingId:e.underlyingId,referenceEpic:u.referenceEpic,expiry:s.expiry||e.expiry,dmaMarketData:a.default.populateWithJson(s.dmaMarketData,u.scalingFactor),atQuoteEnabled:s.atQuoteEnabled,taxRequirement:s.taxRequirement,kiidUrl:s.kiidUrl,w8benUrl:s.w8benUrl}),t&&r.parsePiSSnapshotData(v,u),v}},{key:"normalisePiSBidAndAskPrices",value:function(e){delete e.bid,delete e.ask,Array.isArray(e.priceLadder)&&e.priceLadder.length&&(e.bid=e.priceLadder[0].bid,e.ask=e.priceLadder[0].ask)}},{key:"parsePiSSnapshotData",value:function(e,t){e.ncrMarketStatus=e.rawMarketStatus=(0,l.convertDealingFlagToMarketStatus)(t.marketStatus)
var r={}
Array.isArray(t.priceLadder)&&t.priceLadder.forEach((function(e,t){var i=t+1
r["displayBid"+i]=e.bid,r["displayOffer"+i]=e.ask})),Array.isArray(t.currencyLadders)&&(r.pisCurrencies=e.pisCurrencies.slice(),r.pisDisplaySizeThresholds=e.pisDisplaySizeThresholds.slice(),t.currencyLadders.forEach((function(e,t){if("string"==typeof(i=e.currency)&&i.trim().length>0){var i
r.pisCurrencies[t]=e.currency
var n=e.bidSizes
Array.isArray(n)&&n.forEach((function(e,i){r.pisDisplaySizeThresholds[t].bid[i]=""+e}))
var o=e.askSizes
Array.isArray(o)&&o.forEach((function(e,i){r.pisDisplaySizeThresholds[t].offer[i]=""+e}))}}))),e.setProperties(r)}},{key:"populateWithV3MarketData",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=e.marketSnapshotData
t&&r.normalisePiSBidAndAskPrices(i),r.convertV3MarketDetailsJsonToV2(e)
var n=r.populateWithV2MarketData(e)
return t&&r.parsePiSSnapshotData(n,i),n}},{key:"populateFromPositionResponse",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=e.openPosition.openPositionData||e.openPosition,n=e.marketDetails||e.market
if(n){n.instrumentData.displayPrompt=n.instrumentData.displayPrompt||i.displayPeriod,t&&r.normalisePiSBidAndAskPrices(n.marketSnapshotData)
var o=r.populateWithV2MarketData(n)
return t&&r.parsePiSSnapshotData(o,n.marketSnapshotData),o}}},{key:"populateWithMarketLiteData",value:function(e){var t=e.marketSnapshotData||e.referenceMarketSnapshotData,i=new r({epic:e.epic})
return i.populateWith({instrumentName:e.instrumentName,ncrMarketStatus:l.MARKET_STATUS_NUMBER_MAP[t.marketStatus],high:t.highFormatted,low:t.lowFormatted,percentageChange:t.percentageChange,netChange:t.netChange,displayBid:t.bidFormatted,displayOffer:t.offerFormatted,referencePrice:t.midFormatted,displayUnderlyingBid:t.underlyingBid,displayUnderlyingOffer:t.underlyingAsk,knockoutPremium:t.knockoutPremium,bestBid:t.bestBidFormatted,bestOffer:t.bestOfferFormatted,scalingFactor:t.scalingFactor,decimalPlacesFactor:t.decimalPlacesFactor,updateTime:t.updateTime,delayTime:t.delayTime,isAuditing:!1,scaled:t.scaled,hasCompleteMarketData:!1,underlyingName:e.underlyingName,underlyingId:e.underlyingId,referenceEpic:e.referenceEpic,id:e.id,lastSelectedEpic:e.lastSelectedEpic,isKnockout:!!e.knockoutType,knockoutType:e.knockoutType,strikeLevel:e.strikeLevel,epic:e.epic,share:e.share,optionType:e.optionType,baseCurrency:e.baseCurrency,bloombergCode:e.bloombergCode,availableForTrade:e.availableForTrade,instrumentType:e.instrumentType}),i}},{key:"convertTimestampToLondonTime",value:function(e){return new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1,timeZone:"Europe/London"}).format(new Date(parseInt(e,10)))}}]),r}(i.default),le(se.prototype,"bid",[f],Object.getOwnPropertyDescriptor(se.prototype,"bid"),se.prototype),le(se.prototype,"bid1",[d],Object.getOwnPropertyDescriptor(se.prototype,"bid1"),se.prototype),le(se.prototype,"bid2",[y],Object.getOwnPropertyDescriptor(se.prototype,"bid2"),se.prototype),le(se.prototype,"bid3",[h],Object.getOwnPropertyDescriptor(se.prototype,"bid3"),se.prototype),le(se.prototype,"bid4",[v],Object.getOwnPropertyDescriptor(se.prototype,"bid4"),se.prototype),le(se.prototype,"bid5",[g],Object.getOwnPropertyDescriptor(se.prototype,"bid5"),se.prototype),le(se.prototype,"underlyingBid",[_],Object.getOwnPropertyDescriptor(se.prototype,"underlyingBid"),se.prototype),le(se.prototype,"isOption",[O],Object.getOwnPropertyDescriptor(se.prototype,"isOption"),se.prototype),le(se.prototype,"isBinary",[b],Object.getOwnPropertyDescriptor(se.prototype,"isBinary"),se.prototype),le(se.prototype,"isContract",[m],Object.getOwnPropertyDescriptor(se.prototype,"isContract"),se.prototype),le(se.prototype,"isDelayed",[T],Object.getOwnPropertyDescriptor(se.prototype,"isDelayed"),se.prototype),le(se.prototype,"isFx",[k],Object.getOwnPropertyDescriptor(se.prototype,"isFx"),se.prototype),le(se.prototype,"isNonCryptoFx",[P],Object.getOwnPropertyDescriptor(se.prototype,"isNonCryptoFx"),se.prototype),le(se.prototype,"isEquityKnockout",[S],Object.getOwnPropertyDescriptor(se.prototype,"isEquityKnockout"),se.prototype),le(se.prototype,"isFXKnockout",[E],Object.getOwnPropertyDescriptor(se.prototype,"isFXKnockout"),se.prototype),le(se.prototype,"isShare",[L],Object.getOwnPropertyDescriptor(se.prototype,"isShare"),se.prototype),le(se.prototype,"marketStatus",[w],Object.getOwnPropertyDescriptor(se.prototype,"marketStatus"),se.prototype),le(se.prototype,"midPrice",[D],Object.getOwnPropertyDescriptor(se.prototype,"midPrice"),se.prototype),le(se.prototype,"calculatedMidPrice",[C],Object.getOwnPropertyDescriptor(se.prototype,"calculatedMidPrice"),se.prototype),le(se.prototype,"offer",[I],Object.getOwnPropertyDescriptor(se.prototype,"offer"),se.prototype),le(se.prototype,"offer1",[A],Object.getOwnPropertyDescriptor(se.prototype,"offer1"),se.prototype),le(se.prototype,"offer2",[R],Object.getOwnPropertyDescriptor(se.prototype,"offer2"),se.prototype),le(se.prototype,"offer3",[j],Object.getOwnPropertyDescriptor(se.prototype,"offer3"),se.prototype),le(se.prototype,"offer4",[M],Object.getOwnPropertyDescriptor(se.prototype,"offer4"),se.prototype),le(se.prototype,"offer5",[F],Object.getOwnPropertyDescriptor(se.prototype,"offer5"),se.prototype),le(se.prototype,"underlyingOffer",[N],Object.getOwnPropertyDescriptor(se.prototype,"underlyingOffer"),se.prototype),le(se.prototype,"percentRange",[U],Object.getOwnPropertyDescriptor(se.prototype,"percentRange"),se.prototype),le(se.prototype,"percentSpread",[z],Object.getOwnPropertyDescriptor(se.prototype,"percentSpread"),se.prototype),le(se.prototype,"range",[x],Object.getOwnPropertyDescriptor(se.prototype,"range"),se.prototype),le(se.prototype,"spread",[V],Object.getOwnPropertyDescriptor(se.prototype,"spread"),se.prototype),le(se.prototype,"spread1",[B],Object.getOwnPropertyDescriptor(se.prototype,"spread1"),se.prototype),le(se.prototype,"spread2",[G],Object.getOwnPropertyDescriptor(se.prototype,"spread2"),se.prototype),le(se.prototype,"spread3",[K],Object.getOwnPropertyDescriptor(se.prototype,"spread3"),se.prototype),le(se.prototype,"spread4",[W],Object.getOwnPropertyDescriptor(se.prototype,"spread4"),se.prototype),le(se.prototype,"spread5",[q],Object.getOwnPropertyDescriptor(se.prototype,"spread5"),se.prototype),le(se.prototype,"dealSizeDecimalPlaces",[Q],Object.getOwnPropertyDescriptor(se.prototype,"dealSizeDecimalPlaces"),se.prototype),le(se.prototype,"ticketDefaultCurrency",[H],Object.getOwnPropertyDescriptor(se.prototype,"ticketDefaultCurrency"),se.prototype),le(se.prototype,"valueOfOnePoint",[Y],Object.getOwnPropertyDescriptor(se.prototype,"valueOfOnePoint"),se.prototype),le(se.prototype,"sanitisedBidQuoteId",[J],Object.getOwnPropertyDescriptor(se.prototype,"sanitisedBidQuoteId"),se.prototype),le(se.prototype,"sanitisedOfferQuoteId",[Z],Object.getOwnPropertyDescriptor(se.prototype,"sanitisedOfferQuoteId"),se.prototype),le(se.prototype,"isFree",[X],Object.getOwnPropertyDescriptor(se.prototype,"isFree"),se.prototype),le(se.prototype,"marketOrderAllowed",[$],Object.getOwnPropertyDescriptor(se.prototype,"marketOrderAllowed"),se.prototype),le(se.prototype,"guaranteedStopsAllowed",[ee],Object.getOwnPropertyDescriptor(se.prototype,"guaranteedStopsAllowed"),se.prototype),le(se.prototype,"isLimitedRisk",[te],Object.getOwnPropertyDescriptor(se.prototype,"isLimitedRisk"),se.prototype),le(se.prototype,"isCommodity",[re],Object.getOwnPropertyDescriptor(se.prototype,"isCommodity"),se.prototype),le(se.prototype,"displaySwapRateLong",[ie],Object.getOwnPropertyDescriptor(se.prototype,"displaySwapRateLong"),se.prototype),le(se.prototype,"displaySwapRateShort",[ne],Object.getOwnPropertyDescriptor(se.prototype,"displaySwapRateShort"),se.prototype),le(se.prototype,"trailingStopsAllowedPreference",[oe],Object.getOwnPropertyDescriptor(se.prototype,"trailingStopsAllowedPreference"),se.prototype),le(se.prototype,"minDealSize",[ae],Object.getOwnPropertyDescriptor(se.prototype,"minDealSize"),se.prototype),se)
e.default=Fe}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(7),r(81)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.addDistinct=void 0
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var a=Symbol("existing-values"),s=Symbol("proxy-handlers")
function u(e,t,r){var i=this.batchChangesForKeys(r,e)
t.call(this,e,r,i)}function l(e,t,r){r.length&&this.trigger("change",r)}var c=e.addDistinct=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]
if(e)for(var r=0,i=e.length;r<i;r++){var n=e[r]
t.includes(n)||t.push(n)}return t},p=function e(t){var r=Object.getPrototypeOf(t),i=Object.getOwnPropertyNames(t)
return r?i.concat(e(r)):i},f=function(e){function t(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))
return r._computed=r.constructor.prototype._computedMap||{},i(r,e),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"batchChangesForKeys",value:function(e,t){for(var r=[],i=t?t+".":"",n=0,o=e.length;n<o;n++)c(this._computed[""+i+e[n]],r)
return r}},{key:"proxyChangesFor",value:function(){for(var e=this,t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n]
var o="function"==typeof r[r.length-1]?r.pop():l
this[a]=i(this[a]||{},r.reduce((function(e,t){return e[t]=void 0,e}),{})),this[s]=i(this[s]||{},r.reduce((function(t,r){return t[r]=u.bind(e,r,o),t}),{})),this.on("change",this._proxyValuesHandler,this),this._proxyValuesHandler(r)}},{key:"_proxyValuesHandler",value:function(e){var t=!0,r=!1,i=void 0
try{for(var n,o=e[Symbol.iterator]();!(t=(n=o.next()).done);t=!0){var u=n.value
Object.prototype.hasOwnProperty.call(this[a],u)&&this[a][u]!==this[u]&&(this[a][u]&&"function"==typeof this[a][u].off&&this[a][u].off("change",this[s][u],this),this[u]&&"function"==typeof this[u].on&&this[u].on("change",this[s][u],this),this[a][u]=this[u])}}catch(l){r=!0,i=l}finally{try{!t&&o.return&&o.return()}finally{if(r)throw i}}}},{key:"set",value:function(e,t){if(this[e]!==t){(0,r.default)(this,e,t)
var i=[e],n=this._computed[e]
if(n)for(var o=0,a=n.length;o<a;o++)i.push(n[o])
this.trigger("change",i)}}},{key:"snapshot",value:function(){var e=this
return p(this).filter((function(t){return"_"!==t[0]&&"function"!=typeof e[t]})).reduce((function(t,r){return t[r]=e[r],t}),{})}},{key:"setProperties",value:function(e){for(var t=Object.keys(e),i=[],n=0,o=t.length;n<o;n++){var a=t[n]
this[a]!==e[a]&&((0,r.default)(this,a,e[a]),i.push(a),c(this._computed[a],i))}i.length&&this.trigger("change",i)}},{key:"destroy",value:function(){if(this.trigger("destroyed"),this[a]){var e=!0,r=!1,i=void 0
try{for(var n,u=Object.keys(this[a])[Symbol.iterator]();!(e=(n=u.next()).done);e=!0){var l=n.value
this[a][l]&&"function"==typeof this[a][l].off&&this[a][l].off("change",this[s][l],this)}}catch(c){r=!0,i=c}finally{try{!e&&u.return&&u.return()}finally{if(r)throw i}}delete this[a],delete this[s]}o(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}}],[{key:"clone",value:function(e){return new(0,e.constructor)(Object.keys(e).filter((function(e){return"_"!==e[0]})).reduce((function(t,r){return t[r]=e[r],t}),{}))}},{key:"isModel",value:function(e){return e instanceof t}}]),t}(t.default)
e.default=f}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(155)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._observeable=new t.default}return r(e,[{key:"trigger",value:function(e,t){this._observeable.emit(e,t)}},{key:"on",value:function(e,t,r){this._observeable.on(e,t,r)}},{key:"once",value:function(e,t,r){this._observeable.once(e,t,r)}},{key:"off",value:function(e,t,r){e?this._observeable.removeListener(e,t,r):this._observeable.removeAllListeners()}},{key:"destroy",value:function(){this.off()}}]),e}()
e.default=i}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(21)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var r={ABSOLUTE:"ABSOLUTE",RELATIVE:"RELATIVE"}
e.default={pointsAway:function(e,i,n,o){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1
return"number"!=typeof e?null:i===r.ABSOLUTE?(0,t.round)((n-e)*o,2):(0,t.round)(e,a)},distanceFrom:function(e,i,n){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:2
return"number"!=typeof e?null:i===r.ABSOLUTE?(0,t.round)(n-e,o):e},absolute:function(e,i,n,o,a){if("number"!=typeof e)return null
if(i===r.RELATIVE){var s=n+e/o
return s<0?null:(0,t.round)(s,a)}return i===r.ABSOLUTE?e:void 0},distanceInCurrencyFromPoints:function(e,t){return e*t},distanceInPointsFromCurrency:function(e,t){return e/t},Type:r,POINTS_AWAY_DECIMAL_PLACES:2}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.convertDealingFlagToMarketStatus=function(e){var t=(""+e).trim()
return o[t]||"CLOSED"}
var t=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e},i=Object.freeze({AUCTION:"AUCTION",AUCTION_NO_EDIT:"AUCTION_NO_EDIT",OFFLINE:"OFFLINE",CLOSED:"CLOSED",CLOSE_ONLY:"CLOSE_ONLY",EDIT:"EDIT",SUSPENDED:"SUSPENDED",TRADEABLE:"TRADEABLE",UNAVAILABLE:"UNAVAILABLE"}),n=e.MARKET_STATUS_NUMBER_MAP=Object.freeze({"-2":i.CLOSED,"-1":i.CLOSED,0:i.CLOSED,1:i.OFFLINE,2:i.TRADEABLE,3:i.EDIT,4:i.CLOSE_ONLY,7:i.AUCTION,8:i.AUCTION_NO_EDIT,9:i.SUSPENDED}),o=Object.freeze({XCON:"CLOSED",UNIVERSE:"CLOSED",CLOSED:"CLOSED",CALL:"OFFLINE",DEAL:"TRADEABLE",EDIT:"EDIT",CLOSINGSONLY:"CLOSE_ONLY",DEALNOEDIT:"CLOSED",AUCTION:"AUCTION",AUCTIONNOEDIT:"AUCTION_NO_EDIT",SUSPEND:"SUSPENDED"}),a=r({},i,{AUCTION:"CLOSED",AUCTION_NO_EDIT:"CLOSED",EDIT:"CLOSED"}),s=r({},i,{AUCTION:"CLOSED",AUCTION_NO_EDIT:"CLOSED",SUSPENDED:"CLOSED","-1":"UNAVAILABLE",7:"CLOSED",8:"CLOSED",9:"CLOSED"}),u=function(){function e(){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),r(this,i,n)}return t(e,[{key:"resolve",value:function(e){var t=e.rawMarketStatus,o=e.instrumentType,u=e.isMTF,l=e.isShareDealing,c=e.isShare,p=e.availableForTrade
if(null!=t){if(void 0===p){if(l&&!1===c)return i.UNAVAILABLE}else if(!p)return i.UNAVAILABLE
var f=/BINARY/.test(o)?a:i
return u&&(f=s),r({},n,f)[t]||i.CLOSED}}}]),e}()
e.default=new u}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(0),r(19),r(8),r(31),r(21),r(32),r(23)],n=function(e,t,r,i,n,o,a,s){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var u=function(e){var r=t.default.find(e,(function(e){return e.valid}))
return r?r.value:s.default.NON_GUARANTEED},l=function(e,t,r){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null,u=arguments.length>6&&void 0!==arguments[6]&&arguments[6],l=(0,n.default)(r,i,e,o)
return s&&!u&&(l=(0,a.getMinimumDistanceValueForExistingPosition)(s,l,t)),{unit:"pts",value:l}}
e.default={isValid:function(e,a,u,c,p,f,d,y,h,v){var g=arguments.length>10&&void 0!==arguments[10]&&arguments[10],_=arguments[11],O=arguments[12],b=arguments[13],m=arguments.length>14&&void 0!==arguments[14]&&arguments[14],T=arguments.length>15&&void 0!==arguments[15]&&arguments[15],k=!(arguments.length>16&&void 0!==arguments[16])||arguments[16],P=arguments.length>17&&void 0!==arguments[17]?arguments[17]:null,S=arguments.length>18&&void 0!==arguments[18]&&arguments[18],E=arguments[19],L=arguments[20],w=arguments.length>21&&void 0!==arguments[21]&&arguments[21],D=arguments.length>22&&void 0!==arguments[22]&&arguments[22],C=u===i.default.Type.ABSOLUTE,I=a===s.default.TRAILING,A=i.default.distanceFrom(e,u,v,y),R=l(u,a,c,v,d,P,w).value||0
!g||D||C||(R+=Math.abs(h-v))
var j=(0,n.default)(f,h,u,d)
if(isNaN(e))return{isValid:!1,error:{key:r.default.Reason.INVALID_LEVEL}}
if(I&&O&&!t.default.isNumber(e))return{isValid:!1,error:{key:C?r.default.Reason.STOP_REQUIRES_LEVEL:r.default.Reason.STOP_REQUIRES_DISTANCE}}
if(I&&C&&e&&(_&&e>h||!_&&e<h))return{isValid:!1,error:{key:r.default.Reason.STOP_WRONG_SIDE}}
if(I&&A&&(O||0)<p.value)return{isValid:!1,error:{key:r.default.Reason.TRAILING_STEP_BELOW_MIN,min:p.value}}
if(m&&I&&null!=R&&A){if((b||0)/(d||1)<R)return{isValid:!1,error:{key:r.default.Reason.TRAILING_DISTANCE_BELOW_MIN,min:Math.ceil(R*(d||1))}}
var M=(b+O)/(d||1)
if(A>=M)return{isValid:!1,error:{key:r.default.Reason.STOP_LEVEL_BELOW_TRAILING,min:h-M}}}if(!S&&T&&k&&(!t.default.isNumber(e)||0===e))return{isValid:!1,error:{key:u===i.default.Type.RELATIVE?r.default.Reason.STOP_REQUIRES_DISTANCE:r.default.Reason.STOP_REQUIRES_LEVEL}}
if(e&&C&&(_&&e>v||!_&&e<v))return{isValid:!1,error:{key:r.default.Reason.STOP_WRONG_SIDE}}
if(t.default.isNumber(R)&&t.default.isNumber(A)&&A<R){var F=(0,o.ceil)(R,y)
return D?{isValid:!1,error:{key:r.default.Reason.STOP_TOO_CLOSE_POINTS,data:{min:F}}}:{isValid:!1,error:{key:r.default.Reason.STOP_TOO_CLOSE,data:{min:F}}}}return t.default.isNumber(j)&&t.default.isNumber(A)&&A>j?{isValid:!1,error:{key:r.default.Reason.STOP_TOO_FAR}}:S&&E&&t.default.isNumber(A)&&t.default.isNumber(E)&&A>E?{isValid:!1,error:{key:r.default.Reason.STOP_WRONG_SIDE_OF_KNOCKOUT_LEVEL}}:L&&!A?{isValid:!1,error:{key:r.default.Reason.STOP_REQUIRED}}:{isValid:!0}},getStopTypes:function(e,r,i,n){return t.default.values(s.default).map((function(t){var o=!e||n
return t===s.default.GUARANTEED?o=r:t===s.default.TRAILING&&(o=!e&&i),{valid:o,value:t}}))},getFirstValidStopType:u,getValidStopType:function(e,r){if(!r)return u(e)
var i=t.default.find(e,(function(e){return e.value===r}))
return i&&i.valid?r:u(e)},getMinimumDistanceRuleInPoints:l,Type:s.default}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default={POSITION:"POSITION",ORDER:"ORDER",TICKET:"TICKET"}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default={ADDED:"ADDED",REMOVED:"REMOVED",UPDATED:"UPDATED"}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(6),r(81),r(2),r(8),r(19),r(9),r(10),r(31),r(123),r(32),r(24),r(11),r(38),r(45),r(44),r(46),r(71),r(74),r(0),r(18),r(5),r(21),r(49),r(36),r(22)],n=function(e,t,r,i,n,o,a,s,u,l,c,p,f,d,y,h,v,g,_,O,b,m,T,k,P,S){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var E=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var L,w,D,C,I,A,R,j,M,F,N,U,z,x,V,B,G,K,W,q,Q,H,Y,J,Z,X,$,ee,te,re,ie,ne,oe,ae,se,ue,le,ce,pe,fe,de,ye=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function he(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var ve=["direction","size","currency","marginService","controlledRisk","forceOpen","showForceOpen","stopType","stopLevel","stopLevelType","stopStep","limitLevel","limitType","knockoutLevel"],ge=["size","direction","triggerLevel","knockoutLevel","tolerance","timeInForce","stopType","stopLevel","stopLevelType","stopStep","stopPrice","orderStopLevel","limitLevel","limitType","currency","indicativeCostsAndChargesService","indicativeCostsAndChargesEditType","showClosing","skipICCRequest","_orderType"],_e=(L=(0,i.default)("market.isAuditing"),w=(0,i.default)("settings","settings.defaultLevelType"),D=(0,i.default)("direction"),C=(0,i.default)("direction"),I=(0,i.default)("direction","market","market.sanitisedBidQuoteId","market.sanitisedOfferQuoteId"),A=(0,i.default)("market.minDealSize"),R=(0,i.default)("currency","currency.exchangeRate","minDealSizePts"),j=(0,i.default)("isSell","bidPrice","offerPrice"),M=(0,i.default)("orderLevel"),F=(0,i.default)("size","direction","market","market.offer","market.bid","triggerLevel","currentMarketLevel"),N=(0,i.default)("size","market","market.valueOfOnePoint"),U=(0,i.default)("isSell","bidPrice","offerPrice"),z=(0,i.default)("isSell","bidPrice","offerPrice"),x=(0,i.default)("market.underlyingOffer","market.underlyingBid","knockoutLevel"),V=(0,i.default)("settings","settings.showForceOpen","market.isKnockout","market.isOption"),B=(0,i.default)("knockoutLevel","market.bid","market.offer","sellTierOrdinal","rdwBid.size"),G=(0,i.default)("knockoutLevel","market.bid","market.offer","buyTierOrdinal","rdwOffer.size"),K=(0,i.default)("direction","size","rdwBid.size","rdwOffer.size"),W=(0,i.default)("ladder"),q=(0,i.default)("direction","sizeIncludingRDW","minimumTierSize"),Q=(0,i.default)("ladder"),H=(0,i.default)("size","sizeIncludingRDW","ladder"),Y=(0,i.default)("size","sizeIncludingRDW","ladder"),J=(0,i.default)("direction","size","sizeIncludingRDW","ladder"),Z=(0,i.default)("direction","currency","market.pisDisplaySizeThresholds","market.spread1","market.spread2","market.spread3","market.spread4","market.spread5"),X=(0,i.default)("bidPrice","offerPrice","market.scalingFactor"),$=(0,i.default)("stopLevel","stopLevelType"),ee=(0,i.default)("stopLevel","stopLevelType","orderLevel","direction"),te=(0,i.default)("orderLevel","market","market.bid","market.offer","market.dealingRules"),re=(0,i.default)("stopType","orderLevel","market","market.dealingRules","stopLevelType"),ie=(0,i.default)("currency","minStopDistance"),ne=(0,i.default)("orderLevel","market","market.dealingRules","stopLevelType"),oe=(0,i.default)("direction","stopLevelType","orderLevel","market","market.dealingRules"),ae=(0,i.default)("limitLevel","limitType"),se=(0,i.default)("limitLevel","limitType","orderLevel","direction"),ue=(0,i.default)("limitLevel","limitType","openLevel","market","market.lotSize","size","direction"),le=(0,i.default)("stopLevel","stopLevelType","openLevel","market","market.lotSize","size","direction"),ce=(0,i.default)("errors.hasErrors"),pe=(0,i.default)("market","market.marketStatus"),fe=(0,i.default)("market"),de=function(e){function t(e,r,i,a,u,l,c){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var p=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,O.default.merge({dealReference:l.generateDealReference(),dealSizeDecimalPlaces:"S"===i.unit?0:2,direction:null,errors:new o.default,isEditTicket:!1,margin:null,indicativeCostsAndCharges:null,indicativeCostsAndChargesState:P.ICC_API_STATES.NOT_FETCHED,indicativeCostsAndChargesEditType:null,_indicativeCostsAndChargesAbortController:null,limitType:n.default.Type.ABSOLUTE,limitLevel:null,limitUnit:null,limitUnitValue:null,marginService:null,indicativeCostsAndChargesService:null,showClosing:!1,market:i,heartbeat:a,currency:i.ticketDefaultCurrency,currencies:i.currencies,controlledRisk:i.controlledRisk,settings:u,scalingFactor:i.scalingFactor,decimalPlacesFactor:i.decimalPlacesFactor,knockoutLevel:null,size:null,rdwBid:null,rdwOffer:null,skipICCRequest:!1,stopStep:null,stopTrailingDistance:null,stopLevel:null,stopLevelType:n.default.Type.ABSOLUTE,stopsLimitsAllowed:i.stopsLimitsAllowed,stopAllowed:i.stopAllowed,limitAllowed:i.limitAllowed,stopUnit:null,stopUnitValue:null,shouldUpdateFieldsOnSettingsChange:!1,canEditTrailingDistance:!1,pointsThroughCurrentSelected:u.rememberLastTradedPointsThroughCurrent,forceOpen:u.forceOpen,isPosition:null,isOrder:null,_lastTransactionState:null},e)))
return p.set("defaultStopType",s.default.getFirstValidStopType(p.stopTypes)||s.default.Type.NON_GUARANTEED),p.set("stopType",s.default.getValidStopType(p.stopTypes||e.stopTypes)),p._dealReferenceGenerator=l,p._restService=r,p._session=c,p._validators=p._getValidators(),p._throttledGetMargin=O.default.throttle(p._getMarginHelper.bind(p),2e3),p._throttledGetIndicativeCostsAndCharges=O.default.throttle(p._getIndicativeCostsAndCharges.bind(p),2e3),p._marginAborted=!1,p.on("change",p._onChange,p),p.market.on("change",p._onMarketChange,p),p.settings.on("change",p._onSettingsChange,p),p.errors.on("change",p._onErrorsChange,p),p.currency&&p._updateCurrencyListeners(),p.proxyChangesFor("rdwOffer","rdwBid"),p._validate(),p}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),E(t,[{key:"_updateCurrencyListeners",value:function(){this._removeCurrencyListener(),this.currency&&(this.currency.on("change",this._onCurrencyChange,this),this._oldCurrency=this.currency)}},{key:"_removeCurrencyListener",value:function(){var e=this._oldCurrency
e&&e.off("change",this._onCurrencyChange,this),this._oldCurrency=null}},{key:"_onCurrencyChange",value:function(e){var t=this.batchChangesForKeys(e,"currency")
t.length&&this.trigger("change",t)}},{key:"_onErrorsChange",value:function(e){var t=this.batchChangesForKeys(e,"errors")
t.length&&this.trigger("change",t)}},{key:"_onMarketChange",value:function(e){var t=this.batchChangesForKeys(e,"market")
t.length&&this.trigger("change",t),this.shouldUpdateFieldsOnSettingsChange&&(e.includes("lastTradedSize")&&this.settings.applyLastTradedSizeAndCurrency(this),(e.includes("lastTradedStopDistance")||e.includes("lastTradedStopType")||e.includes("lastTradedTrailingStopIncrement"))&&this.settings.applyLastTradedStop(this),e.includes("lastTradedLimitDistance")&&this.settings.applyLastTradedLimit(this),e.includes("lastTradedPointsThroughCurrent")&&this.settings.applyLastTradedPointsThroughCurrent(this)),(e.includes("marketStatus")||e.includes("dealingRules")||e.includes("isDelayed"))&&this._validate()}},{key:"_onSettingsChange",value:function(e){var t=this.batchChangesForKeys(e,"settings")
e.includes("rememberLastTradedPointsThroughCurrent")&&this.pointsThroughCurrentSelected!==this.settings.rememberLastTradedPointsThroughCurrent&&((0,r.default)(this,"pointsThroughCurrentSelected",this.settings.rememberLastTradedPointsThroughCurrent),t.push("pointsThroughCurrentSelected")),e.includes("forceOpen")&&this.forceOpen!==this.settings.forceOpen&&((0,r.default)(this,"forceOpen",!this.isDMA&&this.settings.forceOpen),t.push("forceOpen")),t.length&&this.trigger("change",t),this.shouldUpdateFieldsOnSettingsChange&&(e.includes("rememberLastTradedSize")&&(this.settings.rememberLastTradedSize?this.settings.applyLastTradedSizeAndCurrency(this):this.resetSizeAndCurrency()),e.includes("rememberLastTradedStopTypeAndDistance")&&(this.settings.rememberLastTradedStopTypeAndDistance?this.settings.applyLastTradedStop(this):this.resetStop()),e.includes("rememberLastTradedLimitDistance")&&(this.settings.rememberLastTradedLimitDistance?this.settings.applyLastTradedLimit(this):this.resetLimit()),e.includes("rememberLastTradedPointsThroughCurrent")&&(this.settings.rememberLastTradedPointsThroughCurrent?this.settings.applyLastTradedPointsThroughCurrent(this):this.resetPointsThroughCurrent(this)))}},{key:"_onChange",value:function(e){e.includes("currency")&&this._updateCurrencyListeners(),e.includes("stopType")&&this._clearStepOnTypeChange(),(0,h.default)(ve,e)&&this._updateMargin(),(0,h.default)(this._validationDependentKeys,e)&&this._validate(),(0,h.default)(ge,e)&&this._updateIndicativeCostsAndCharges()}},{key:"_clearStepOnTypeChange",value:function(){this.stopType!==s.default.Type.TRAILING&&this.setProperties({stopStep:null,stopTrailingDistance:null})}},{key:"_getValidators",value:function(){return[]}},{key:"resetSizeAndCurrency",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=this.settings
e&&t.rememberLastTradedSize?t.applyLastTradedSizeAndCurrency(this):this.setProperties({size:null,currency:this.market.ticketDefaultCurrency})}},{key:"getDefaultStopType",value:function(){if(this.market&&this.market.defaultStopType)return s.default.getValidStopType(this.stopTypes,this.market.defaultStopType)}},{key:"resetStop",value:function(){this.setProperties({levelType:this.defaultLevelType,stopType:s.default.getValidStopType(this.stopTypes,this.getDefaultStopType()),stopLevel:null,stopLevelType:n.default.Type.ABSOLUTE,stopStep:null,stopTrailingDistance:null})}},{key:"resetLimit",value:function(){this.setProperties({limitLevel:null,limitType:this.defaultLevelType})}},{key:"resetPointsThroughCurrent",value:function(){this.set("pointsThroughCurrent",null)}},{key:"_updateMargin",value:function(){var e=this.triggerLevel||this.orderLevel
if(this._abortMarginRequest(),!this.marginService||this.controlledRisk&&this.stopAllowed&&!this.stopLevel||!this.size||!this.direction||!e)return this._throttledGetMargin.cancel(),void this.set("margin",null)
this._throttledGetMargin()}},{key:"_getMarginHelper",value:function(){var e=this
this.set("margin",null)
var t=this._getMargin()
this._marginAborted=!1,this.set("marginRequest",t),t&&t.then((function(t){e._marginAborted||e.setProperties({marginRequest:null,margin:t})})).catch((function(t){e.setProperties({marginRequest:null,margin:null}),(0,y.default)(t)}))}},{key:"_getMargin",value:function(){return this.triggerLevel?this.marginService.getOrderMargin(this):this.marginService.getPositionMargin(this)}},{key:"_updateIndicativeCostsAndCharges",value:function(){if(this.indicativeCostsAndChargesService){var e=this.market.isOption?null!==this.iccPriceLevel&&void 0!==this.iccPriceLevel:this.iccPriceLevel
if(!this.currency||!this.iccSize||!this.direction||this._isInvalidIccEdit()||!e)return this._throttledGetIndicativeCostsAndCharges.cancel(),void this.indicativeCostsAndChargesService.reset(this)
this.indicativeCostsAndChargesService.abortQuoteRequest(this),this.setProperties({indicativeCostsAndCharges:null,indicativeCostsAndChargesState:P.ICC_API_STATES.FETCHING}),this._throttledGetIndicativeCostsAndCharges()}}},{key:"_getIndicativeCostsAndCharges",value:function(){return Promise.resolve(P.INITIAL_ICC)}},{key:"_submitDeal",value:function(){return this._restService.create(this)}},{key:"submit",value:function(){var e=this
return this.trigger(p.default.DEAL_SUBMIT),this._ticketTransaction=this._submitDeal(),this._ticketTransaction.on("state",this._onTransactionChange,this),[p.default.FIRST_POLL,p.default.DEAL_FAILED,p.default.INITIAL_DEAL_RESPONSE,p.default.FINAL_DEAL_RESPONSE].forEach((function(t){e._ticketTransaction.on(t,(function r(){e.trigger(t),e._ticketTransaction.off(t,r,e)}),e)})),this._ticketTransaction}},{key:"_onTransactionChange",value:function(){var e=this._ticketTransaction
this._lastTransactionState=e.state,e.state===d.PENDING&&this._updatePerMarketSettings(),e.isComplete&&(e.off("state",this._onTransactionChange,this),this.set("dealReference",this._dealReferenceGenerator.generateDealReference()))}},{key:"_updatePerMarketSettings",value:function(){var e=(0,v.default)(this.settings,this.toJSON())
this.market.setProperties(e)}},{key:"_hasGuaranteedStop",value:function(){return this.stopType===s.default.Type.GUARANTEED}},{key:"_hasTrailingStop",value:function(){return this.stopType===s.default.Type.TRAILING}},{key:"_calculateMarketLevel",value:function(){var e=this.isSell?this.bidPrice:this.offerPrice
return(0,_.default)(e)}},{key:"_calculateFirstTierMarketLevel",value:function(){var e=this.isSell?this.market.displayBid:this.market.displayOffer
return this.market.isKnockout&&void 0!==this.knockoutLevel?this.market.knockoutType===m.KNOCKOUT_TYPES.BEAR?Math.max(0,this.knockoutLevel-(0,_.default)(e)).toFixed(this.market.decimalPlacesFactor):Math.max(0,(0,_.default)(e)-this.knockoutLevel).toFixed(this.market.decimalPlacesFactor):(0,_.default)(e)}},{key:"getTierOrdinal",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1]
return(0,S.calculateTierOrdinal)(this.market,this.currency&&this.currency.name,this.size,e,this.rdwBid,this.rdwOffer,t)}},{key:"getPiSLadder",value:function(e,t){return this.market?this.market.getPiSLadder(e,t):[]}},{key:"_calculateDistance",value:function(e,t){return n.default.pointsAway(e,t,this.orderLevel,this.scalingFactor,this.decimalPlacesFactor)}},{key:"_calculateLevel",value:function(e,t,r){var i=t===n.default.Type.RELATIVE
return n.default.absolute(e&&(i&&this.isBuy===r?-1:1)*e,t,this.orderLevel,this.scalingFactor,this.decimalPlacesFactor)}},{key:"_calculateIndicativeProfitLoss",value:function(e,t,r){if(!e||!this.size)return null
var i=t===n.default.Type.ABSOLUTE
if(i&&(r&&(this.isBuy&&e<this.openLevel||this.isSell&&e>this.openLevel)||!r&&(this.isBuy&&e>this.openLevel||this.isSell&&e<this.openLevel)))return null
var o=this.market,a=o.lotSize,s=void 0===a?1:a,u=o.scalingFactor,l=(0,b.calculateProfitAndLoss)(e,i?this.openLevel:0,s*(i?u:1),this.size)
return l&&(r?1:-1)*Math.abs(l)}},{key:"allowsForStopType",value:function(e){return!!O.default.find(this.stopTypes,(function(t){return t.value===e&&t.valid}))}},{key:"_validate",value:function(){var e=this,t=this._validators.reduce((function(t,r){var i=r(e)
return i.valid||(t[i.field]=i.error),t}),{})
this.errors.setProperties(t)}},{key:"getLastTransactionState",value:function(){return this._ticketTransaction&&this._ticketTransaction.state||this._lastTransactionState}},{key:"toString",value:function(){return f.default.TICKET}},{key:"_abortMarginRequest",value:function(){this._marginAborted=!0}},{key:"destroy",value:function(){this._throttledGetMargin.cancel(),this._throttledGetIndicativeCostsAndCharges.cancel(),this._ticketTransaction&&(this._ticketTransaction.destroy(),this._ticketTransaction=null),this._abortMarginRequest(),this.indicativeCostsAndChargesService&&this.indicativeCostsAndChargesService.abortQuoteRequest(this),this._removeCurrencyListener(),this.settings.off("change",this._onSettingsChange,this),this.market.off("change",this._onMarketChange,this),ye(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}},{key:"_getSubmittedTimestamp",value:function(){return this.heartbeat.getTime()}},{key:"_isInvalidIccEdit",value:function(){return this.isEditTicket&&(!this.isSubmittable||!this.settings.forceExAnteOpenEndpointForEdits&&(!this.iccStopLevel&&!this.iccLimitLevel||this.indicativeCostsAndChargesEditType===P.ICC_EDIT_TYPES.STOP&&!this.iccStopLevel||this.indicativeCostsAndChargesEditType===P.ICC_EDIT_TYPES.LIMIT&&!this.iccLimitLevel))}},{key:"_getPrecision",value:function(e){try{return e.toString().split(".")[1].length}catch(t){return 0}}},{key:"iccOpeningLevel",get:function(){return this.iccPriceLevel}},{key:"iccPriceLevel",get:function(){return this.triggerLevel||this.orderLevel}},{key:"iccStopLevel",get:function(){return this.absoluteStopLevel}},{key:"iccLimitLevel",get:function(){return this.absoluteLimitLevel}},{key:"iccSize",get:function(){return this.size}},{key:"iccDirection",get:function(){return this.direction}},{key:"isAuditing",get:function(){return this.market.isAuditing}},{key:"defaultLevelType",get:function(){return this.settings.defaultLevelType}},{key:"isBuy",get:function(){return"buy"===this.direction}},{key:"isSell",get:function(){return"sell"===this.direction}},{key:"isPriceInSizeEnabled",get:function(){return this._session.featureFlags.priceInSizeEnabled}},{key:"quoteId",get:function(){return"buy"===this.direction?this.market.sanitisedOfferQuoteId:this.market.sanitisedBidQuoteId}},{key:"minDealSizePts",get:function(){return this.market.minDealSize&&this.market.minDealSize.value}},{key:"minDealSize",get:function(){var e=(0,l.default)(this.minDealSizePts,this.currency?this.currency.exchangeRate:1,this.market.unit)
return{unit:"pts",value:Math.round(100*e)/100}}},{key:"orderLevel",get:function(){return this._calculateMarketLevel()}},{key:"openLevel",get:function(){return this.orderLevel}},{key:"notionalValue",get:function(){var e=null
return this.isPriceInSizeEnabled?e=this.currentMarketLevel:this.triggerLevel?e=this.triggerLevel:this.isBuy?e=this.market.offer:this.isSell&&(e=this.market.bid),Boolean(this._session&&this._session.user&&this._session.user.isSpreadbet)?this.size*e:(0,g.default)(this.market.unit,e,this.size,this.market.scalingFactor,this.market.lotSize,this.market.scaled)}},{key:"profitLossPerPoint",get:function(){return this.market.valueOfOnePoint*this.size}},{key:"currentMarketLevel",get:function(){return this._calculateMarketLevel()}},{key:"currentFirstTierMarketLevel",get:function(){return this._calculateFirstTierMarketLevel()}},{key:"koUnderlyingDistance",get:function(){return this.market.knockoutType===m.KNOCKOUT_TYPES.BEAR?(0,T.round)(Math.abs(this.market.underlyingBid-this.knockoutLevel),this.market.decimalPlacesFactor):(0,T.round)(Math.abs(this.market.underlyingOffer-this.knockoutLevel),this.market.decimalPlacesFactor)}},{key:"showForceOpen",get:function(){return!(this.market.isKnockout||this._session.user.isFifo||this.market.isOption&&this.isOrder||this.isDMA)&&this.settings.showForceOpen}},{key:"bidPrice",get:function(){var e=this.isPriceInSizeEnabled?this.market["displayBid"+this.sellTierOrdinal]:this.market.displayBid
return this.market.isKnockout&&void 0!==this.knockoutLevel?this.market.knockoutType===m.KNOCKOUT_TYPES.BEAR?Math.max(0,this.knockoutLevel-(0,_.default)(e)).toFixed(this.market.decimalPlacesFactor):Math.max(0,(0,_.default)(e)-this.knockoutLevel).toFixed(this.market.decimalPlacesFactor):e}},{key:"offerPrice",get:function(){var e=this.isPriceInSizeEnabled?this.market["displayOffer"+this.buyTierOrdinal]:this.market.displayOffer
return this.market.isKnockout&&void 0!==this.knockoutLevel?this.market.knockoutType===m.KNOCKOUT_TYPES.BEAR?Math.max(0,this.knockoutLevel-(0,_.default)(e)).toFixed(this.market.decimalPlacesFactor):Math.max(0,(0,_.default)(e)-this.knockoutLevel).toFixed(this.market.decimalPlacesFactor):e}},{key:"sizeIncludingRDW",get:function(){return(0,S.calculateSizeIncludingRDW)(this.direction,this.size,this.rdwBid,this.rdwOffer)}},{key:"minimumTierSize",get:function(){var e=this.ladder
if(e.length)return e[0].size}},{key:"isSizeAboveMinimumTier",get:function(){var e=this.sizeIncludingRDW,t=this.minimumTierSize
return null!=e&&!isNaN(e)&&void 0!==t&&e>this.minimumTierSize}},{key:"isPiSLaddersDataAvailableForAnyTierAboveTierOne",get:function(){var e=this.ladder,t=this.market
return e.length>1&&t.arePricesAvailableForAnyPiSLaddersTierAboveTierOne}},{key:"buyTierOrdinal",get:function(){return this.getTierOrdinal("buy")}},{key:"sellTierOrdinal",get:function(){return this.getTierOrdinal("sell")}},{key:"tierOrdinal",get:function(){return this.getTierOrdinal(this.direction)}},{key:"ladder",get:function(){return this.direction?this.getPiSLadder(this.direction,this.currency&&this.currency.name):this.getPiSLadder("buy",this.currency&&this.currency.name)}},{key:"spread",get:function(){var e=parseFloat(this.offerPrice),t=parseFloat(this.bidPrice),r=this.market.scalingFactor||1,i=Math.max(this._getPrecision(e),this._getPrecision(t))
if(!Number.isNaN(e)&&!Number.isNaN(t)){var n=void 0
return n=e-t,n=(n*=r).toFixed(i),(n=parseFloat(n.toString())).toString()}}},{key:"stopDistance",get:function(){return this._calculateDistance(this.stopLevel,this.stopLevelType)}},{key:"absoluteStopLevel",get:function(){return this._calculateLevel(this.stopLevel,this.stopLevelType,!0)}},{key:"minStepDistance",get:function(){if(null===this.market.dealingRules)return null
var e=this.market.dealingRules.minStepDistance,t=(0,u.default)(e,this.orderLevel,n.default.Type.RELATIVE,this.scalingFactor)
return{unit:"pts",value:e&&"pct"===e.unit?Math.ceil(t):t}}},{key:"minStopDistance",get:function(){if(!this.market.dealingRules)return null
var e=s.default.getMinimumDistanceRuleInPoints(this.stopLevelType,this.stopType,(0,c.getMinimumDistanceFromMarket)(this.stopType,this.market),this.isOrder?this.orderLevel:this.currentFirstTierMarketLevel,this.scalingFactor)
if(this.isPriceInSizeEnabled&&!this.isOrder){var t=Math.max(this._getPrecision(this.currentMarketLevel),this._getPrecision(this.currentFirstTierMarketLevel)),r=Math.pow(10,t),i=Math.abs((this.currentMarketLevel*r-this.currentFirstTierMarketLevel*r)/r),o=this.stopLevelType===n.default.Type.ABSOLUTE
return this.scalingFactor&&!o&&(i*=this.scalingFactor),{unit:e.unit,value:i+e.value}}return e}},{key:"minStopDistanceDisplay",get:function(){var e="JPY"===this.currency.name?0:n.default.POINTS_AWAY_DECIMAL_PLACES
return O.default.ceil(this.minStopDistance.value,e)}},{key:"minTrailingDistance",get:function(){var e=this.market.dealingRules&&this.market.dealingRules.minNormalStopOrLimitDistance
if(!e)return null
var t=s.default.getMinimumDistanceRuleInPoints(n.default.Type.RELATIVE,s.default.Type.TRAILING,(0,c.getMinimumDistanceFromMarket)(s.default.Type.TRAILING,this.market),this.orderLevel,this.scalingFactor)
return"pct"===e.unit&&(t.value=Math.ceil(t.value)),t}},{key:"maxStopOrLimitDistance",get:function(){return this.direction&&this.market.dealingRules?{unit:"pts",value:(0,u.default)(this.market.dealingRules.maxStopOrLimitDistance,this.orderLevel,this.stopLevelType,this.scalingFactor)}:null}},{key:"limitDistance",get:function(){return this._calculateDistance(this.limitLevel,this.limitType)}},{key:"absoluteLimitLevel",get:function(){return this._calculateLevel(this.limitLevel,this.limitType,!1)}},{key:"indicativeProfit",get:function(){return this._calculateIndicativeProfitLoss(this.limitLevel,this.limitType,!0)}},{key:"indicativeLoss",get:function(){return this._calculateIndicativeProfitLoss(this.stopLevel,this.stopLevelType,!1)}},{key:"isSubmittable",get:function(){return!this.errors.hasErrors}},{key:"isMarketDealable",get:function(){return this.market.marketStatus===a.default.TRADEABLE}},{key:"_validationDependentKeys",get:function(){return["direction","size","market","limitType","limitLevel","stopStep","stopTrailingDistance","stopType","stopLevel","maxStopOrLimitDistance","minStopDistance","minDealSize","isAuditing"]}},{key:"isNewJapaneseTicket",get:function(){return(0,k.default)(this.market,this._session)}},{key:"isUSFx",get:function(){return this._session&&this._session.user&&this._session.user.isUSFx}},{key:"isOptionOrderEnabled",get:function(){return this._session.featureFlags.optionOrderEnabled}}]),t}(t.default),he(de.prototype,"isAuditing",[L],Object.getOwnPropertyDescriptor(de.prototype,"isAuditing"),de.prototype),he(de.prototype,"defaultLevelType",[w],Object.getOwnPropertyDescriptor(de.prototype,"defaultLevelType"),de.prototype),he(de.prototype,"isBuy",[D],Object.getOwnPropertyDescriptor(de.prototype,"isBuy"),de.prototype),he(de.prototype,"isSell",[C],Object.getOwnPropertyDescriptor(de.prototype,"isSell"),de.prototype),he(de.prototype,"quoteId",[I],Object.getOwnPropertyDescriptor(de.prototype,"quoteId"),de.prototype),he(de.prototype,"minDealSizePts",[A],Object.getOwnPropertyDescriptor(de.prototype,"minDealSizePts"),de.prototype),he(de.prototype,"minDealSize",[R],Object.getOwnPropertyDescriptor(de.prototype,"minDealSize"),de.prototype),he(de.prototype,"orderLevel",[j],Object.getOwnPropertyDescriptor(de.prototype,"orderLevel"),de.prototype),he(de.prototype,"openLevel",[M],Object.getOwnPropertyDescriptor(de.prototype,"openLevel"),de.prototype),he(de.prototype,"notionalValue",[F],Object.getOwnPropertyDescriptor(de.prototype,"notionalValue"),de.prototype),he(de.prototype,"profitLossPerPoint",[N],Object.getOwnPropertyDescriptor(de.prototype,"profitLossPerPoint"),de.prototype),he(de.prototype,"currentMarketLevel",[U],Object.getOwnPropertyDescriptor(de.prototype,"currentMarketLevel"),de.prototype),he(de.prototype,"currentFirstTierMarketLevel",[z],Object.getOwnPropertyDescriptor(de.prototype,"currentFirstTierMarketLevel"),de.prototype),he(de.prototype,"koUnderlyingDistance",[x],Object.getOwnPropertyDescriptor(de.prototype,"koUnderlyingDistance"),de.prototype),he(de.prototype,"showForceOpen",[V],Object.getOwnPropertyDescriptor(de.prototype,"showForceOpen"),de.prototype),he(de.prototype,"bidPrice",[B],Object.getOwnPropertyDescriptor(de.prototype,"bidPrice"),de.prototype),he(de.prototype,"offerPrice",[G],Object.getOwnPropertyDescriptor(de.prototype,"offerPrice"),de.prototype),he(de.prototype,"sizeIncludingRDW",[K],Object.getOwnPropertyDescriptor(de.prototype,"sizeIncludingRDW"),de.prototype),he(de.prototype,"minimumTierSize",[W],Object.getOwnPropertyDescriptor(de.prototype,"minimumTierSize"),de.prototype),he(de.prototype,"isSizeAboveMinimumTier",[q],Object.getOwnPropertyDescriptor(de.prototype,"isSizeAboveMinimumTier"),de.prototype),he(de.prototype,"isPiSLaddersDataAvailableForAnyTierAboveTierOne",[Q],Object.getOwnPropertyDescriptor(de.prototype,"isPiSLaddersDataAvailableForAnyTierAboveTierOne"),de.prototype),he(de.prototype,"buyTierOrdinal",[H],Object.getOwnPropertyDescriptor(de.prototype,"buyTierOrdinal"),de.prototype),he(de.prototype,"sellTierOrdinal",[Y],Object.getOwnPropertyDescriptor(de.prototype,"sellTierOrdinal"),de.prototype),he(de.prototype,"tierOrdinal",[J],Object.getOwnPropertyDescriptor(de.prototype,"tierOrdinal"),de.prototype),he(de.prototype,"ladder",[Z],Object.getOwnPropertyDescriptor(de.prototype,"ladder"),de.prototype),he(de.prototype,"spread",[X],Object.getOwnPropertyDescriptor(de.prototype,"spread"),de.prototype),he(de.prototype,"stopDistance",[$],Object.getOwnPropertyDescriptor(de.prototype,"stopDistance"),de.prototype),he(de.prototype,"absoluteStopLevel",[ee],Object.getOwnPropertyDescriptor(de.prototype,"absoluteStopLevel"),de.prototype),he(de.prototype,"minStepDistance",[te],Object.getOwnPropertyDescriptor(de.prototype,"minStepDistance"),de.prototype),he(de.prototype,"minStopDistance",[re],Object.getOwnPropertyDescriptor(de.prototype,"minStopDistance"),de.prototype),he(de.prototype,"minStopDistanceDisplay",[ie],Object.getOwnPropertyDescriptor(de.prototype,"minStopDistanceDisplay"),de.prototype),he(de.prototype,"minTrailingDistance",[ne],Object.getOwnPropertyDescriptor(de.prototype,"minTrailingDistance"),de.prototype),he(de.prototype,"maxStopOrLimitDistance",[oe],Object.getOwnPropertyDescriptor(de.prototype,"maxStopOrLimitDistance"),de.prototype),he(de.prototype,"limitDistance",[ae],Object.getOwnPropertyDescriptor(de.prototype,"limitDistance"),de.prototype),he(de.prototype,"absoluteLimitLevel",[se],Object.getOwnPropertyDescriptor(de.prototype,"absoluteLimitLevel"),de.prototype),he(de.prototype,"indicativeProfit",[ue],Object.getOwnPropertyDescriptor(de.prototype,"indicativeProfit"),de.prototype),he(de.prototype,"indicativeLoss",[le],Object.getOwnPropertyDescriptor(de.prototype,"indicativeLoss"),de.prototype),he(de.prototype,"isSubmittable",[ce],Object.getOwnPropertyDescriptor(de.prototype,"isSubmittable"),de.prototype),he(de.prototype,"isMarketDealable",[pe],Object.getOwnPropertyDescriptor(de.prototype,"isMarketDealable"),de.prototype),he(de.prototype,"isNewJapaneseTicket",[fe],Object.getOwnPropertyDescriptor(de.prototype,"isNewJapaneseTicket"),de.prototype),de)
e.default=_e}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default={QUANTITY:"QUANTITY",VALUE:"VALUE",VALUE_MARKET:"VALUE-MARKET",isConsideration:function(e){return"VALUE"===e||"VALUE-MARKET"===e}}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(0),r(150)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),n=function(){function e(t,r){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"MERGE",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],a=arguments[5];(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this.lightstreamerService=t,this._subscriptionStr=r,this._subscribeMode=i,this._tickRate=n,this._dataAdapter=a,this._fakeSnapshot=o,this._handlers={},this._handlerCounters={},this._subscriptions={},this._snapshots={}}return i(e,[{key:"add",value:function(e,t,i){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],o=void 0,a=t.slice().sort(),s=n.length?":"+n.slice().sort().join(","):"",u=e+":"+a.join(",")+s,l=this._subscriptions[u]
if(this._subscriptions[u])-1===(o=this._handlers[u].indexOf(i))?(this._handlers[u].push(i),this._handlerCounters[u].push(1)):this._handlerCounters[u][o]++
else{var c=this._subscriptionStr.replace("{id}",e).replace("{fids}",a).replace("{modifiers}",s)
this._subscriptions[u]=this.lightstreamerService.subscribe(c,a,this._subscribeMode,this.onUpdate.bind(this,u),this._tickRate,this._dataAdapter),this._handlers[u]=[i],this._handlerCounters[u]=[1],this._fakeSnapshot&&(this._snapshots[u]=new r.default(!0))}if(this._fakeSnapshot&&l){var p=this._snapshots[u]
p.hasData()&&i(p)}}},{key:"remove",value:function(e){var t=this._handlers,r=this._snapshots,i=this._handlerCounters,n=this._subscriptions,o=!0
return Object.keys(n).some((function(a){var s=t[a].indexOf(e)
if(s>-1)return--i[a][s]||(t[a].splice(s,1),i[a].splice(s,1),t[a].length||(n[a].unsubscribe(),delete n[a],delete t[a],delete r[a],delete i[a],o=!1)),!0})),o}},{key:"onUpdate",value:function(e,t){var r=this;((this._handlers||{})[e]||[]).forEach((function(e){return e(t)})),this._fakeSnapshot&&t.forEachChangedField((function(t,i,n){r._snapshots[e].setField(t,n)}))}},{key:"removeAll",value:function(){t.default.invokeMap(this._subscriptions,"unsubscribe"),this._subscriptions={},this._handlerCounters={},this._handlers={}}},{key:"destroy",value:function(){this.removeAll(),this._subscriptions=null,this._handlerCounters=null,this._handlers=null}}]),e}()
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(31),r(9),r(8),r(47),r(3),r(2),r(73)],n=function(e,t,r,i,n,o,a,s){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var u=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var l,c,p,f,d,y,h,v,g=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function _(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var O=(l=(0,a.default)("direction","stopType","triggerLevel"),c=(0,a.default)("direction","stopType","triggerLevel"),p=(0,a.default)("triggerLevel"),f=(0,a.default)("stopLevel","stopLevelType","orderLevel","direction","triggerLevel"),d=(0,a.default)("limitLevel","limitType","orderLevel","direction","triggerLevel"),y=(0,a.default)("market","market.bid","market.offer","direction","triggerLevel"),h=(0,a.default)("size","pointsThroughCurrent","triggerLevel","marketOrder"),v=function(e){function n(e,t,r,i,o,a,s,u){var l;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,n)
var c=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(l=n.__proto__||Object.getPrototypeOf(n)).call.apply(l,[this,{expiryTime:null,triggerLevel:null,stopRequired:!1,limitRequired:!1,isOneClickOrMicroDMA:!!u}].concat(Array.prototype.slice.call(arguments))))
return i.applyLastTradedStop(c),i.applyLastTradedLimit(c),i.applyLastTradedSizeAndCurrency(c),i.applyDefaultLevel(c),c}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(n,e),u(n,[{key:"_calculateDistance",value:function(e,t){return i.default.pointsAway(e,t,this.triggerLevel,this.scalingFactor,this.decimalPlacesFactor)}},{key:"_getValidators",value:function(){return[o.controlledRiskTradingAvailable,o.dateBelowMin,o.direction,o.limit,o.marketDealable,o.triggerLevelWithinValidDistance,o.orderTypeLimitForOption,o.triggerLevelAboveZero,o.sizeAboveMin,o.stop,o.hasLiveData]}},{key:"_getIndicativeCostsAndCharges",value:function(){return this.indicativeCostsAndChargesService.getIndicativeOpenQuote(this)}},{key:"toJSON",value:function(){var e=this.direction,t=this.expiryTime,r=this._hasTrailingStop(),i=this.market,n=this._session.user.broker,o={currencyCode:this.currency&&this.currency.name,dealReference:this.dealReference,direction:e?e.toUpperCase():null,epic:i.epic,expiry:i.prompt,goodTillDate:t,guaranteedStop:this._hasGuaranteedStop(),level:this.triggerLevel,limitDistance:this.limitDistance,size:this.size,stopDistance:this.stopDistance,submittedTimestamp:this.heartbeat.timestamp,timeInForce:t?"GOOD_TILL_DATE":"GOOD_TILL_CANCELLED",type:this.orderType,trailingStop:r,trailingStopIncrement:r?this.stopStep:null,quoteId:this.quoteId}
return n&&n.decisionMakerAccountId&&(o.decisionMakerAccountId=n.decisionMakerAccountId),i.isOption||(o.forceOpen=this.forceOpen),o}},{key:"minStopDistance",get:function(){return g(n.prototype.__proto__||Object.getPrototypeOf(n.prototype),"minStopDistance",this)}},{key:"maxStopOrLimitDistance",get:function(){return g(n.prototype.__proto__||Object.getPrototypeOf(n.prototype),"maxStopOrLimitDistance",this)}},{key:"isMarketDealable",get:function(){return this.market.marketStatus===r.default.TRADEABLE||this.market.marketStatus===r.default.AUCTION||this.market.marketStatus===r.default.EDIT}},{key:"maxOrderDistance",get:function(){return this.direction&&null!==this.market.dealingRules&&Object.prototype.hasOwnProperty.call(this.market.dealingRules,"maxStopOrLimitDistance")?{unit:"pts",value:(0,t.default)(this.market.dealingRules.maxStopOrLimitDistance,this.currentMarketLevel,i.default.Type.ABSOLUTE,this.scalingFactor)}:null}},{key:"orderLevel",get:function(){return this.triggerLevel}},{key:"absoluteStopLevel",get:function(){return this._calculateLevel(this.stopLevel,this.stopLevelType,!0)}},{key:"absoluteLimitLevel",get:function(){return this._calculateLevel(this.limitLevel,this.limitType,!1)}},{key:"orderType",get:function(){var e=this._session.featureFlags.priceInSizeEnabled?this.currentFirstTierMarketLevel:this.currentMarketLevel,t=this.triggerLevel
return this.direction&&t?this.isBuy&&t>e||this.isSell&&t<e?"STOP":"LIMIT":null}},{key:"maximumRisk",get:function(){return this.isSell?(0,s.default)(this.size,this.pointsThroughCurrent,this.triggerLevel,this.market.valueOfOnePoint,this.marketOrder):this.size&&this.triggerLevel?0:null}},{key:"_validationDependentKeys",get:function(){return[].concat(function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}(g(n.prototype.__proto__||Object.getPrototypeOf(n.prototype),"_validationDependentKeys",this)),["triggerLevel","expiryTime","timeInForce","maxOrderDistance","stopRequired","limitRequired"])}}]),n}(n.default),_(v.prototype,"minStopDistance",[l],Object.getOwnPropertyDescriptor(v.prototype,"minStopDistance"),v.prototype),_(v.prototype,"maxStopOrLimitDistance",[c],Object.getOwnPropertyDescriptor(v.prototype,"maxStopOrLimitDistance"),v.prototype),_(v.prototype,"orderLevel",[p],Object.getOwnPropertyDescriptor(v.prototype,"orderLevel"),v.prototype),_(v.prototype,"absoluteStopLevel",[f],Object.getOwnPropertyDescriptor(v.prototype,"absoluteStopLevel"),v.prototype),_(v.prototype,"absoluteLimitLevel",[d],Object.getOwnPropertyDescriptor(v.prototype,"absoluteLimitLevel"),v.prototype),_(v.prototype,"orderType",[y],Object.getOwnPropertyDescriptor(v.prototype,"orderType"),v.prototype),_(v.prototype,"maximumRisk",[h],Object.getOwnPropertyDescriptor(v.prototype,"maximumRisk"),v.prototype),v)
e.default=O}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default={MARKET:"Market",LIMIT:"MarketLimit",STOP:"MarketStop"}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.calculateProfitAndLoss=function(e,t,r,i){var n=arguments.length>4&&void 0!==arguments[4]&&arguments[4],o=arguments.length>5&&void 0!==arguments[5]&&arguments[5],a=0
if(!1===e||null===e)return a
a=(e-t)*i*(r||1),n&&(a*=-1)
o&&(a+=parseFloat(i))
return Math.round(1e4*a)/1e4},e.calculateProfitAndLossPercentage=function(e,t){var r=e/t*100
if(isNaN(r)||Math.abs(r)===1/0)return null
return Math.round(100*r)/100},e.calculateProfitLossFromBookCost=function(e,t,r){return(t-e)/r}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(0),r(6),r(2)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o,a,s=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var u,l,c,p,f,d,y=Object.keys({bookCost:null,direction:null,expiryTime:null,level:null,limit:null,marketStatus:null,marketDealable:null,orderSize:null,orderType:null,timeInForce:null,size:null,stop:null,triggerLevel:null,delayedPrice:null,quantity:null,technicalIssues:null}),h=(o=i.default.apply(void 0,function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}(y)),a=function(e){function r(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
var i={bookCost:null,direction:null,expiryTime:null,level:null,limit:null,marketStatus:null,marketDealable:null,orderSize:null,orderType:null,timeInForce:null,size:null,stop:null,triggerLevel:null,delayedPrice:null,quantity:null,technicalIssues:null}
return function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,t.default.merge(i,e)))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),n(r,[{key:"setProperties",value:function(e){s(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"setProperties",this).call(this,t.default.merge({bookCost:null,direction:null,expiryTime:null,level:null,limit:null,marketStatus:null,marketDealable:null,orderSize:null,orderType:null,timeInForce:null,size:null,stop:null,triggerLevel:null,delayedPrice:null,quantity:null,technicalIssues:null},e))}},{key:"hasErrors",get:function(){for(var e=0,t=y.length;e<t;e++)if(this[y[e]])return!0
return!1}}]),r}(r.default),u=a.prototype,l="hasErrors",c=[o],p=Object.getOwnPropertyDescriptor(a.prototype,"hasErrors"),f=a.prototype,d={},Object.keys(p).forEach((function(e){d[e]=p[e]})),d.enumerable=!!d.enumerable,d.configurable=!!d.configurable,("value"in d||d.initializer)&&(d.writable=!0),d=c.slice().reverse().reduce((function(e,t){return t(u,l,e)||e}),d),f&&void 0!==d.initializer&&(d.value=d.initializer?d.initializer.call(f):void 0,d.initializer=void 0),void 0===d.initializer&&(Object.defineProperty(u,l,d),d=null),a)
h.Reason={BOOK_COST_FILLED:"BOOK_COST_FILLED",BUY_ORDER_TYPE_CANNOT_BE_STOP_MARKET:"BUY_ORDER_TYPE_CANNOT_BE_STOP_MARKET",CONTROLLED_RISK_TRADING_UNAVAILABLE:"CONTROLLED_RISK_TRADING_UNAVAILABLE",DATE_BELOW_MIN:"DATE_BELOW_MIN",DELAYED_PRICE:"DELAYED_PRICE",DIRECTION_NOT_SET:"DIRECTION_NOT_SET",INVALID_STOP_TYPE:"INVALID_STOP_TYPE",INVALID_LEVEL:"INVALID_LEVEL",LEVEL_REQUIRED:"LEVEL_REQUIRED",LIMIT_REQUIRED:"LIMIT_REQUIRED",LIMIT_BELOW_MIN_DISTANCE:"LIMIT_BELOW_MIN_DISTANCE",LIMIT_TOO_CLOSE:"LIMIT_TOO_CLOSE",LIMIT_TOO_FAR:"LIMIT_TOO_FAR",LIMIT_WRONG_SIDE:"LIMIT_WRONG_SIDE",LIMIT_SAME_AS_CURRENT_LEVEL:"LIMIT_SAME_AS_CURRENT_LEVEL",MARKET_NOT_DEALABLE:"MARKET_NOT_DEALABLE",NOT_AUDITING:"NOT_AUDITING",ORDER_TYPE_NOT_LIMIT_FOR_OPTION:"ORDER_TYPE_NOT_LIMIT_FOR_OPTION",ORDER_SIZE_ABOVE_ZERO:"ORDER_SIZE_ABOVE_ZERO",TECHNICAL_ISSUES:"TECHNICAL_ISSUES",SIZE_ABOVE_MAX:"SIZE_ABOVE_MAX",SIZE_ABOVE_ORIGINAL:"SIZE_ABOVE_ORIGINAL",SIZE_BELOW_PARTIAL:"SIZE_BELOW_PARTIAL",SIZE_BELOW_MIN:"SIZE_BELOW_MIN",SIZE_NOT_ABOVE_ZERO:"SIZE_NOT_ABOVE_ZERO",VALUE_NOT_ABOVE_ZERO:"VALUE_NOT_ABOVE_ZERO",STOP_REQUIRED:"STOP_REQUIRED",STOP_GUARANTEED_MOVE_AWAY:"STOP_GUARANTEED_MOVE_AWAY",STOP_GUARANTEED_CAN_NOT_BE_REMOVED:"STOP_GUARANTEED_CAN_NOT_BE_REMOVED",STOP_LEVEL_BELOW_TRAILING:"STOP_LEVEL_BELOW_TRAILING",STOP_LEVEL_BUY_BELOW_OFFER:"STOP_LEVEL_BUY_BELOW_OFFER",STOP_LEVEL_SELL_ABOVE_BID:"STOP_LEVEL_SELL_ABOVE_BID",STOP_REQUIRES_LEVEL:"STOP_REQUIRES_LEVEL",STOP_REQUIRES_DISTANCE:"STOP_REQUIRES_DISTANCE",STOP_TOO_CLOSE:"STOP_TOO_CLOSE",STOP_TOO_CLOSE_POINTS:"STOP_TOO_CLOSE_POINTS",STOP_TOO_FAR:"STOP_TOO_FAR",STOP_TYPE_CHANGE_INVALID:"STOP_TYPE_CHANGE_INVALID",STOP_WRONG_SIDE:"STOP_WRONG_SIDE",STOP_WRONG_SIDE_OF_KNOCKOUT_LEVEL:"STOP_WRONG_SIDE_OF_KNOCKOUT_LEVEL",TIME_IN_FORCE_NOT_VALID_FOR_ORDER_TYPE:"TIME_IN_FORCE_NOT_VALID_FOR_ORDER_TYPE",TRAILING_DISTANCE_BELOW_MIN:"TRAILING_DISTANCE_BELOW_MIN",TRAILING_STEP_BELOW_MIN:"TRAILING_STEP_BELOW_MIN",TRIGGER_LEVEL_REQUIRED:"TRIGGER_LEVEL_REQUIRED",TRIGGER_LEVEL_TOO_FAR:"TRIGGER_LEVEL_TOO_FAR",TRIGGER_LEVEL_TOO_HIGH:"TRIGGER_LEVEL_TOO_HIGH",TRIGGER_LEVEL_TOO_LOW:"TRIGGER_LEVEL_TOO_LOW",TRIGGER_LEVEL_INVALID_TICK:"TRIGGER_LEVEL_INVALID_TICK",QUANTITY_BELOW_FILLED:"QUANTITY_BELOW_FILLED",QUANTITY_NOT_ABOVE_ZERO:"QUANTITY_NOT_ABOVE_ZERO"},e.default=h}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(78),r(0),r(2),r(8),r(18),r(70),r(71),r(75),r(76),r(21),r(5),r(22)],n=function(e,t,r,i,n,o,a,s,u,l,c,p,f){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.POSITION_FID_SCHEMA=void 0
var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var y=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var h,v,g,_,O,b,m,T,k,P,S,E,L,w,D,C,I,A,R,j=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function M(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var F=e.POSITION_FID_SCHEMA={OPU_FMT_LIMIT_LEVEL:"limitLevel",OPU_SIZE:"dealSize",OPU_OPEN_LEVEL:"openLevel",OPU_FMT_STOP_LEVEL:"stopLevel",OPU_STOP_TYPE_ENUM:"stopType",OPU_TRAILING_STOP_DISTANCE:"trailingStopDistance",OPU_TRAILING_STEP:"trailingStep",OPU_BOOK_COST:"bookCost"},N=r.default.invert(F),U=(h=(0,i.default)("currency","currency.exchangeRate"),v=(0,i.default)("market","currencyCodeISO"),g=(0,i.default)("market","optionPrice","epicPrice","knockoutLevel","tierOrdinal"),_=(0,i.default)("market","optionPrice","epicPrice","knockoutLevel"),O=(0,i.default)("latest","dealSize","direction","contractSize"),b=(0,i.default)("positionValue","exchangeRate","sterlingToAccountCurrencyRate"),m=(0,i.default)("market","market.offer","market.bid"),T=(0,i.default)("latest","dealSize","direction"),k=(0,i.default)("currencyCodeISO"),P=(0,i.default)("notionalValue","exchangeRate","sterlingToAccountCurrencyRate","market"),S=(0,i.default)("market","market.displayUnderlyingBid","market.displayUnderlyingOffer"),E=(0,i.default)("market","epicPrice","knockoutLevel"),L=(0,i.default)("direction","dealSize","latest","rdwOffer.size","rdwBid.size"),w=(0,i.default)("dealSize","latest"),D=(0,i.default)("latest"),C=(0,i.default)("profitLoss","exchangeRate","sterlingToAccountCurrencyRate"),I=(0,i.default)("profitLoss","bookCost"),A=(0,i.default)("openLevel","latest"),R=function(e){function t(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,d({},e,{sterlingToAccountCurrencyRate:1,rdwBid:null,rdwOffer:null})))
return r.boundOnSterlingToAccountRateStreamedUpdate=r.onSterlingToAccountRateStreamedUpdate.bind(r),r.boundOnPositionRateStreamedUpdate=r.onPositionRateStreamedUpdate.bind(r),r.currency&&r._updateCurrencyListeners(),r.on("change",(function(e){e.includes("currency")&&r._updateCurrencyListeners()})),r.proxyChangesFor("rdwOffer","rdwBid"),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),y(t,[{key:"_updateCurrencyListeners",value:function(){this._removeCurrencyListener(),this.currency&&(this.currency.on("change",this._onCurrencyChange,this),this._oldCurrency=this.currency)}},{key:"_removeCurrencyListener",value:function(){var e=this._oldCurrency
e&&e.off("change",this._onCurrencyChange,this),this._oldCurrency=null}},{key:"_onCurrencyChange",value:function(e){var t=this.batchChangesForKeys(e,"currency")
t.length&&this.trigger("change",t)}},{key:"_parseOpenLevelUpdate",value:function(e){var t=parseFloat(e)
return r.default.isFinite(t)?t:null}},{key:"shouldHideNotionalValue",value:function(){return/^OPT|^BINARY|^KNOCKOUTS/i.test(this.market.instrumentType)}},{key:"profitLossTieredPricesPartialClose",value:function(e){var t=this.isShort()?"buy":"sell",r=(0,f.calculateTierOrdinal)(this.market,this.currencyCodeISO,e,t,this.rdwBid,this.rdwOffer),i=(0,f.getTieredLatestPrice)(this.market,t,r)
return(0,o.calculateProfitAndLoss)(i,this.openLevel,this.contractSize,e,this.isShort(),this.isPriceTypeBackOnly())}},{key:"onStreamedUpdate",value:function(e){var t=function(t){return e.getValue(N[t])},r=t("dealSize")
if(null!==r){var i=(0,u.default)(t("stopLevel")||-1),n=(0,u.default)(t("limitLevel")||-1),o=(0,u.default)(t("trailingStopDistance")),a=(0,u.default)(t("trailingStep")),s=t("stopType"),l=+t("bookCost"),c=this._parseOpenLevelUpdate(t("openLevel"))
this.setProperties({bookCost:l,dealSize:+r,limitLevel:n,openLevel:c,stopTrailingDistance:o,stopLevel:i,stopStep:a,stopType:s})}}},{key:"onSterlingToAccountRateStreamedUpdate",value:function(e){this.set("sterlingToAccountCurrencyRate",1/+e.getValue("OFR"))}},{key:"onPositionRateStreamedUpdate",value:function(e){var t=+e.getValue("OFR")
this.market.updateCurrencyExchangeRate(this.currencyCodeISO,1/t)}},{key:"updateFromOther",value:function(e){j(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"updateFromOther",this).call(this,e),this.setProperties(r.default.pick(e,["stopLevel","stopType","stopStep","stopTrailingDistance","limitLevel","openLevel","dealSize","bookCost","sterlingToAccountCurrencyRate"]))}},{key:"canEdit",value:function(){return l.canEditPosition(this)}},{key:"canClose",value:function(){return l.canClosePosition(this)}},{key:"destroy",value:function(){j(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this),this._removeCurrencyListener()}},{key:"exchangeRate",get:function(){return this.currency?this.currency.exchangeRate:null}},{key:"currency",get:function(){if(!this.market)return null
var e=this.market.currencies,t=this.currencyCodeISO
return r.default.find(e,(function(e){return e.name===t}))}},{key:"latest",get:function(){if(!this.market)return null
if(this.priceInSizeShown){var e=this.isShort()?"buy":"sell"
return(0,f.getTieredLatestPrice)(this.market,e,this.tierOrdinal,this.knockoutLevel)}var t=this.market.isKnockout?this.optionPrice:this.epicPrice
return isNaN(t)?null:t}},{key:"firstTierLatest",get:function(){if(!this.market)return null
if(this.priceInSizeShown){var e=this.isShort()?"buy":"sell"
return(0,f.getTieredLatestPrice)(this.market,e,1,this.knockoutLevel)}var t=this.market.isKnockout?this.optionPrice:this.epicPrice
return isNaN(t)?null:t}},{key:"positionValue",get:function(){var e=this.isShort()?-1:1,t=this.contractSize||1
return this.latest*this.dealSize*t*e}},{key:"positionValueInBaseCurrency",get:function(){return this.currency?1===this.currency.baseExchangeRate?this.positionValue:(0,a.default)(this.sterlingToAccountCurrencyRate/this.currency.exchangeRate,this.positionValue):null}},{key:"epicPrice",get:function(){return this.market?this.isShort()?this.market.offer:this.market.bid:null}},{key:"notionalValue",get:function(){return this.shouldHideNotionalValue()?null:this.isSpreadbetAccount?this.dealSize*this.latest:(0,s.default)(this.market.unit,this.latest,this.dealSize,this.market.scalingFactor,this.market.lotSize,this.market.scaled)}},{key:"notionalValueCurrencyCodeISO",get:function(){return this.currencyCodeISO}},{key:"notionalValueInBaseCurrency",get:function(){return!this.currency||this.shouldHideNotionalValue()?null:this.market.isNonCryptoFx&&!this.isSpreadbetAccount?this.currency&&1===this.currency.baseExchangeRate?this.notionalValue:(0,a.default)(this.currency.baseExchangeRate,this.notionalValue):this.currency&&1===this.currency.baseExchangeRate?this.notionalValue:(0,a.default)(this.sterlingToAccountCurrencyRate/this.currency.exchangeRate,this.notionalValue)}},{key:"underlyingPrice",get:function(){return this.market?this.market.knockoutType===p.KNOCKOUT_TYPES.BEAR||this.isShort()?this.market.displayUnderlyingOffer:this.market.displayUnderlyingBid:null}},{key:"optionPrice",get:function(){return this.market?this.market.knockoutType===p.KNOCKOUT_TYPES.BEAR?(0,c.round)(Math.max(0,this.knockoutLevel-this.epicPrice),this.market.decimalPlacesFactor):(0,c.round)(Math.max(0,this.epicPrice-this.knockoutLevel),this.market.decimalPlacesFactor):null}},{key:"tierOrdinal",get:function(){var e=this.isShort()?"buy":"sell"
return(0,f.calculateTierOrdinal)(this.market,this.currencyCodeISO,this.dealSize,e,this.rdwBid,this.rdwOffer)}},{key:"profitLoss",get:function(){return(0,o.calculateProfitAndLoss)(this.latest,this.openLevel,this.contractSize,this.dealSize,this.isShort(),this.isPriceTypeBackOnly())}},{key:"profitLossInBaseCurrency",get:function(){return this.currency?1===this.currency.baseExchangeRate?this.profitLoss:(0,a.default)(this.sterlingToAccountCurrencyRate/this.currency.exchangeRate,this.profitLoss):null}},{key:"profitLossPercentage",get:function(){return(0,o.calculateProfitAndLossPercentage)(this.profitLoss,this.bookCost)}},{key:"pointsMoved",get:function(){return t.getPointsMoved(this)}}],[{key:"getPointsMoved",value:function(e){if(!e.market)return null
var t=(e.latest-e.openLevel)*e.market.scalingFactor
return e.isShort()&&(t*=-1),isNaN(t)&&(t=0),t}},{key:"isValidEpic",value:function(e){return"string"==typeof e&&!e.match(/^FM\./)}},{key:"fromOPU",value:function(e,r){var i=e.epic,n=e.openPosition
return n.contractSize=(i.lotSize||1)*i.scalingFactor,n.createdDate=n.createdUTCDate,n.limitLevel=n.formattedLimitLevel,n.stopLevel=n.formattedStopLevel,n.displayName=i.displayName,t.fromDealingRestPosition(e,r)}},{key:"fromDealingRestPosition",value:function(e,r){var i=e.openPosition.openPositionData||e.openPosition,o=i.epic
if(o&&!t.isValidEpic(o))return null
var a=i.trailingStep||-1,s=a>-1,l={epic:o,exchangeRateFid:i.exchangeRateFid,bookCost:i.bookCost,indicativeCollateralValue:i.indicativeCollateralValue,contractSize:i.contractSize,currencyCodeISO:i.currencyCodeISO,currencySymbol:i.currencySymbol,createdDate:new Date(i.createdDate),channel:i.channel,dealId:i.dealId,dealSize:i.dealSize,direction:i.direction,displayPeriod:i.displayPeriod,period:i.period,epicOpenLevel:i.epicOpenLevel,isDMA:Object.prototype.hasOwnProperty.call(i,"isDMA")?i.isDMA:!!i.dma,limitLevel:(0,u.default)(i.limitLevel),limitType:n.default.Type.ABSOLUTE,stopLevelType:n.default.Type.ABSOLUTE,openLevel:i.openLevel,priceType:i.priceType,stopLevel:(0,u.default)(i.stopLevel),stopType:i.stopType,knockoutLevel:i.knockoutLevel,displayName:i.displayName,dmaOrderType:i.dma&&i.dma.orderType,dmaTimeInForce:i.dma&&i.dma.timeInForce,dmaPartiallyFilled:i.dma&&"Y"===i.dma.isPseudoPosition,priceInSizeShown:r&&r.featureFlags&&r.featureFlags.priceInSizeEnabled}
return s&&(l.stopStep=a,l.stopTrailingDistance=i.trailingStopDistance),l.isSpreadbetAccount=Boolean(r&&r.user&&r.user.isSpreadbet),new t(l)}}]),t}(t.default),M(R.prototype,"exchangeRate",[h],Object.getOwnPropertyDescriptor(R.prototype,"exchangeRate"),R.prototype),M(R.prototype,"currency",[v],Object.getOwnPropertyDescriptor(R.prototype,"currency"),R.prototype),M(R.prototype,"latest",[g],Object.getOwnPropertyDescriptor(R.prototype,"latest"),R.prototype),M(R.prototype,"firstTierLatest",[_],Object.getOwnPropertyDescriptor(R.prototype,"firstTierLatest"),R.prototype),M(R.prototype,"positionValue",[O],Object.getOwnPropertyDescriptor(R.prototype,"positionValue"),R.prototype),M(R.prototype,"positionValueInBaseCurrency",[b],Object.getOwnPropertyDescriptor(R.prototype,"positionValueInBaseCurrency"),R.prototype),M(R.prototype,"epicPrice",[m],Object.getOwnPropertyDescriptor(R.prototype,"epicPrice"),R.prototype),M(R.prototype,"notionalValue",[T],Object.getOwnPropertyDescriptor(R.prototype,"notionalValue"),R.prototype),M(R.prototype,"notionalValueCurrencyCodeISO",[k],Object.getOwnPropertyDescriptor(R.prototype,"notionalValueCurrencyCodeISO"),R.prototype),M(R.prototype,"notionalValueInBaseCurrency",[P],Object.getOwnPropertyDescriptor(R.prototype,"notionalValueInBaseCurrency"),R.prototype),M(R.prototype,"underlyingPrice",[S],Object.getOwnPropertyDescriptor(R.prototype,"underlyingPrice"),R.prototype),M(R.prototype,"optionPrice",[E],Object.getOwnPropertyDescriptor(R.prototype,"optionPrice"),R.prototype),M(R.prototype,"tierOrdinal",[L],Object.getOwnPropertyDescriptor(R.prototype,"tierOrdinal"),R.prototype),M(R.prototype,"profitLoss",[w],Object.getOwnPropertyDescriptor(R.prototype,"profitLoss"),R.prototype),M(R.prototype,"profitLossTieredPricesPartialClose",[D],Object.getOwnPropertyDescriptor(R.prototype,"profitLossTieredPricesPartialClose"),R.prototype),M(R.prototype,"profitLossInBaseCurrency",[C],Object.getOwnPropertyDescriptor(R.prototype,"profitLossInBaseCurrency"),R.prototype),M(R.prototype,"profitLossPercentage",[I],Object.getOwnPropertyDescriptor(R.prototype,"profitLossPercentage"),R.prototype),M(R.prototype,"pointsMoved",[A],Object.getOwnPropertyDescriptor(R.prototype,"pointsMoved"),R.prototype),R)
e.default=U}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.ceil=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1
if("number"!=typeof e)return null
var r=Math.pow(10,t)
return Math.ceil(Math.abs(e)*r)/r},e.round=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1
if("number"!=typeof e)return null
var r=Math.pow(10,t)
return Math.round(Math.abs(e)*r)/r}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(5)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.calculateTierOrdinal=function(e,t,r,n,o,a){var s=arguments.length>6&&void 0!==arguments[6]&&arguments[6]
if(!e)return 1
var u=e.getPiSLadder(n,t),l=u.length
if(l){var c=!0===s?r:i(n,r,o,a)
if(null!==c&&!isNaN(c)){var p=u.findIndex((function(e){return c<=e.size}))
return-1!==p?p+1:l}}return 1},e.calculateSizeIncludingRDW=i,e.getTieredLatestPrice=function(e,r){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,n=arguments[3],o=e[("sell"===r?"bid":"offer")+i]
return e.isKnockout&&void 0!==n?function(e,r,i){var n=Math.pow(10,e.decimalPlacesFactor)
return e.knockoutType===t.KNOCKOUT_TYPES.BEAR?Math.round(Math.max(0,i-r)*n)/n:Math.round(Math.max(0,r-i)*n)/n}(e,o,n):o},e.adjustPrecisionOfTierSizeData=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1]
if(!e||!Array.isArray(e))return[]
return e.map((function(e){return r(e,{displaySize:e.displaySize&&n(parseFloat(e.displaySize),t).toString(),size:e.size&&n(e.size,t)})}))}
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
function i(e,t,r,i){return!["buy","sell"].includes(e)||null===t||isNaN(t)?t:t+("buy"===e&&i&&i.size||"sell"===e&&r&&r.size||0||0)}function n(e,t){var r=Math.pow(10,t)
return Math.trunc(e*r)/r}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
e.default={NON_GUARANTEED:"NON_GUARANTEED",GUARANTEED:"GUARANTEED",TRAILING:"TRAILING"}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default={DEAL_SUBMIT:"DEAL_SUBMIT",DEAL_FAILED:"DEAL_FAILED",FIRST_POLL:"FIRST_POLL",FINAL_DEAL_RESPONSE:"FINAL_DEAL_RESPONSE",INITIAL_DEAL_RESPONSE:"INITIAL_DEAL_RESPONSE"}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(9),r(17),r(30),r(0)],n=function(e,t,r,i,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.getValidDMAOrderTypesFromMarketData=function(e,r,i,n){var o=!(arguments.length>4&&void 0!==arguments[4])||arguments[4]
if(!e)return[]
var a=i===t.default.AUCTION,s=i===t.default.EDIT,u=r?e.close:e.new,l=a?u.AUCTION:u.CONTINUOUS
if(o&&s)return l.filter((function(e){return e.suitableForQueuedOrder}))
if(o&&n)return l.filter((function(e){return e.suitableForConsiderationOrder}))
return l},e.getValidExpiries=a,e.getFirstValidDMAOrderTypeFromMarketData=function(e,t,i,a){if(!e||!e.length)return{}
var s=o(e,1)[0]
if(i&&t)return(0,n.find)(e,{orderType:r.default[i]})||s
if(a)return(0,n.find)(e,{orderType:r.default[a]})||s
return s},e.getFirstValidOrderExpiry=function(e,t,r,n,o){var s=a(e,t.orderType),u=i.default[n],l=i.default[o]
if(u&&s.includes(u)&&r)return u
if(l&&s.includes(l))return l
return t.timeInForce}
var o=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],i=!0,n=!1,o=void 0
try{for(var a,s=e[Symbol.iterator]();!(i=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);i=!0);}catch(u){n=!0,o=u}finally{try{!i&&s.return&&s.return()}finally{if(n)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}
function a(e,t){return e.filter((function(e){return e.orderType===t})).map((function(e){return e.timeInForce}))}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var t=e.Condition={HIGHER:"HIGHER",LOWER:"LOWER"},r=e.PriceType={SELL_PRICE:"BID_PRICE",BUY_PRICE:"OFFER_PRICE"},i=e.ChangeType={PERCENT:"PERCENT",POINTS:"POINTS"},n=e.TimePeriod={FIVE_MINUTES:"FIVE_MINUTES",ONE_HOUR:"ONE_HOUR",ONE_DAY:"ONE_DAY"},o=e.Type={PRICE_CHANGE_ALERT:"PRICE_CHANGE_ALERT",PRICE_LEVEL_ALERT:"PRICE_ALERT",INDICATOR_ALERT:"INDICATOR_ALERT",ECON_ALERT:"ECON_ALERT",ECON_NEWSLETTER:"ECON_NEWSLETTER"},a=e.Status={TRIGGERED:"TRIGGERED",WAITING:"WAITING"}
e.default={Type:o,PriceType:r,ChangeType:i,Condition:t,Status:a,TimePeriod:n}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(78),r(8),r(10),r(0),r(2),r(75),r(122),r(76),r(72)],n=function(e,t,r,i,n,o,a,s,u,l){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.ORDER_FID_SCHEMA=void 0
var c=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var p,f,d,y,h,v=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function g(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var _=Object.freeze({WORKING:"WORKING",NOT_WORKING:"NOT_WORKING"}),O=e.ORDER_FID_SCHEMA={WO_LEVEL:"level",WO_CONTRACT_SIZE:"size",WO_RESERVED_CASH:"reservedCash",WO_STOP:"contingentStop",WO_STOP_TYPE_ENUM:"stopType",WO_TRAILING_STOP_DISTANCE:"trailingStopDistance",WO_TRAILING_STOP_INCREMENT:"trailingStopIncrement",WO_LIMIT:"contingentLimit",WO_TRAILING_TRIGGER_DISTANCE:"trailingTriggerDistance",WO_TRAILING_TRIGGER_INCREMENT:"trailingTriggerIncrement",WO_GOOD_TILL:"goodTill",WO_REQUEST_TYPE:"requestType",WO_WORKING_INDICATOR:"workingIndicator",WO_RELATIONSHIPS:"relationships",WO_RESTATED_SIZE:"restatedSize"},b=n.default.invert(O),m=(p=(0,o.default)("market","market.bid","market.offer"),f=(0,o.default)("goodTill","normalisedGoodTill","market"),d=(0,o.default)("triggeredBy","market.delayTime"),y=(0,o.default)("quantity","dealSize"),h=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),c(t,[{key:"canEdit",value:function(){return u.canEditOrder(this)}},{key:"canClose",value:function(){return u.canDeleteOrder(this)}},{key:"onStreamedUpdate",value:function(e){var t=function(t){return e.getValue(b[t])},r=(0,a.default)(t("contingentStop")||-1),i=(0,a.default)(t("trailingStopDistance")),n=(0,a.default)(t("trailingStopIncrement")),o=t("goodTill"),u=t("stopType"),l=t("workingIndicator"),c=t("relationships")||null,p=!1
if(c)try{p=JSON.parse(c)}catch(v){console.error("Cannot parse streamed order relationships!")}var f=(0,s.parseRelationships)(p),d=f.triggersOtherOrders,y=f.triggeredBy,h=f.cancelledBy
this.setProperties({dealSize:parseFloat(t("size")),quantity:parseFloat(t("restatedSize")),goodTill:o,openLevel:parseFloat(t("level")),orderType:t("requestType"),limitLevel:(0,a.default)(t("contingentLimit")),stopTrailingDistance:i,stopLevel:r,stopStep:n,stopType:u,isWorking:l===_.WORKING,relationships:p,triggersOtherOrders:d,triggeredBy:y,cancelledBy:h,reservedCash:parseFloat(t("reservedCash"))})}},{key:"updateFromOther",value:function(e){v(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"updateFromOther",this).call(this,e),this.setProperties(n.default.pick(e,["stopLevel","stopType","stopStep","stopTrailingDistance","limitLevel","openLevel","dealSize","quantity","goodTill","orderType","isWorking","reservedCash","relationships","triggersOtherOrders","triggeredBy","cancelledBy"]))}},{key:"latest",get:function(){if(!this.market)return null
var e=parseFloat(this.isShort()?this.market.bid:this.market.offer)
return isNaN(e)?null:e}},{key:"goodTillUTCMillis",get:function(){return this.market?(0,l.toUTCMillisFromAccountTime)(this.normalisedGoodTill||this.goodTill,this.market.timezoneOffset):null}},{key:"triggerLevelEditable",get:function(){return!(this.triggeredBy||this.market&&this.market.delayTime)}},{key:"filledQuantity",get:function(){return this.quantity&&this.dealSize?this.quantity-this.dealSize:null}}],[{key:"fromWOU",value:function(e){return e.createdDate=e.createdUTCDate,e.dma=e.DMA,t.fromDealingRestOrder({workingOrder:{workingOrderData:e}})}},{key:"fromDealingRestOrder",value:function(e){var n=e.workingOrderData||e.workingOrder.workingOrderData,o=n.epic,u=n.trailingStopIncrement||-1,l=u>-1,c=(0,s.parseRelationships)(n.relationships),p=c.triggersOtherOrders,f=c.triggeredBy,d=c.cancelledBy,y={epic:o,currencyCodeISO:n.currencyCodeISO,currencySymbol:n.currency,createdDate:new Date(n.createdDate),clientOrderId:n.clientOrderId,dealId:n.dealId,dealSize:parseFloat(n.size),direction:n.direction,displayPeriod:n.displayPeriod,isDMA:n.isDMA,limitType:r.default.Type.RELATIVE,limitLevel:(0,a.default)(n.contingentLimit),openLevel:parseFloat(n.level),orderType:n.requestType,goodTill:n.goodTill,level:parseFloat(n.level),orderStopLevel:parseFloat(n.orderStopLevel),stopLevel:(0,a.default)(n.contingentStop),stopLevelType:r.default.Type.RELATIVE,stopType:n.stopType||i.default.Type.NON_GUARANTEED,isWorking:n.workingIndicator===_.WORKING,relationships:n.relationships||[],triggersOtherOrders:p,triggeredBy:f,cancelledBy:d,reservedCash:n.reservedCash,reservedCashCurrency:n.reservedCashCurrency,igInstrumentId:n.igInstrumentId,quantity:n.dma&&n.dma.fullDMASize,dmaOrderType:n.dma&&n.dma.orderType,dmaTimeInForce:n.dma&&n.dma.timeInForce}
return l&&(y.stopStep=u,y.stopTrailingDistance=n.trailingStopDistance),new t(y)}}]),t}(t.default),g(h.prototype,"latest",[p],Object.getOwnPropertyDescriptor(h.prototype,"latest"),h.prototype),g(h.prototype,"goodTillUTCMillis",[f],Object.getOwnPropertyDescriptor(h.prototype,"goodTillUTCMillis"),h.prototype),g(h.prototype,"triggerLevelEditable",[d],Object.getOwnPropertyDescriptor(h.prototype,"triggerLevelEditable"),h.prototype),g(h.prototype,"filledQuantity",[y],Object.getOwnPropertyDescriptor(h.prototype,"filledQuantity"),h.prototype),h)
e.default=m}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
var t
function r(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(e,"__esModule",{value:!0})
var i="ACKNOWLEDGE",n="CANCELED",o="EDIT",a="EDIT_BOOKCOST",s="FULL_FILL",u="PARTIAL_FILL",l="REJECTION",c="UNSUPPORTED",p=(r(t={},l,7),r(t,s,6),r(t,u,5),r(t,n,4),r(t,o,3),r(t,a,2),r(t,i,1),r(t,c,0),t),f=[l,s]
e.ACKNOWLEDGE=i,e.CANCELLED=n,e.EDIT=o,e.EDIT_BOOKCOST=a,e.FULL_FILL=s,e.PARTIAL_FILL=u,e.REJECTION=l,e.UNSUPPORTED=c,e.REPORT_TYPE_PRIORITIES=p,e.IMMEDIATE_RESPONSE_REPORT_TYPES=f}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(79),r(3),r(2),r(73),r(119),r(0)],n=function(e,t,r,i,n,o,a){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var s=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var u,l,c,p,f,d,y=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function h(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var v=(u=(0,i.default)("size","pointsThroughCurrent","isSell","offerPrice","bidPrice","marketOrder"),l=(0,i.default)("maximumRisk","currency"),c=(0,i.default)("size","market.commissionsRateType","market.commissionsCharge","market.commissionsMinCharge"),p=(0,i.default)("size","direction","market.swapRateShort","market.swapRateLong","market.valueOfOnePip"),f=(0,i.default)("swapCost","currency"),d=function(e){function t(e,r,i,n,o,a,s,u){var l;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var c=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(l=t.__proto__||Object.getPrototypeOf(t)).call.apply(l,[this,{stopRequired:!1,limitRequired:!1}].concat(Array.prototype.slice.call(arguments))))
if(u&&(c.aggregatePositionOpenLevel=u.openLevel),c.market.isOption&&c.market.strikeLevel||(n.applyLastTradedStop(c),n.applyLastTradedLimit(c),n.applyLastTradedSizeAndCurrency(c),n.applyLastTradedPointsThroughCurrent(c)),n.applyDefaultLevel(c),c.market&&c.market.isKnockout&&!c.knockoutLevel){var p=c.market.knockoutLevels&&c.market.knockoutLevels[0]
c.knockoutLevel=c.market.knockoutDefaultLevel||p}return c._validate(),c}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"_getValidators",value:function(){var e=[r.direction,r.marketDealable,r.sizeAboveMin,r.sizeAboveZero,r.controlledRiskTradingAvailable,r.hasLiveData],t=this.market.instrumentType
return t.match(/^OPT|^BINARY/i)||(e=e.concat([r.stop])),"BINARY"!==t&&(e=e.concat([r.limit])),e}},{key:"toJSON",value:function(){var e=this.market,t=this.settings,r=this._hasTrailingStop(),i=this.direction,n=t.showPartialFill?this.partialFill:t.partialFill,o=this.pointsThroughCurrent,a=this.margin,s=this.knockoutLevel,u=this._session.user.broker,l={currencyCode:this.currency.name,dealReference:this.dealReference,direction:i?i.toUpperCase():null,guaranteedStop:this._hasGuaranteedStop(),level:this.orderLevel,epic:e.epic,limitDistance:this.limitDistance,orderType:this.orderType,size:this.size,stopDistance:this.stopDistance,submittedTimestamp:+this._getSubmittedTimestamp(),timeInForce:n?"EXECUTE_AND_ELIMINATE":"FILL_OR_KILL",trailingStop:r,trailingStopIncrement:r?this.stopStep:null,expiry:e.prompt,quoteId:this.quoteId}
if(u&&u.decisionMakerAccountId&&(l.decisionMakerAccountId=u.decisionMakerAccountId),e.isKnockout||(l.forceOpen=this.forceOpen),(0===o||o>0)&&(l.pointsThroughCurrent=o),s&&(l.knockoutLevel=s),a){var c=a.depositDeltaAccountCcy.currencyCode,p=a.depositDeltaAccountCcy.amount
l.dealTicketMargin={},c&&(l.dealTicketMargin.marginCurrency=c),p&&(l.dealTicketMargin.marginValue=String(p))}return l}},{key:"_getIndicativeCostsAndCharges",value:function(){return this.showClosing?this.indicativeCostsAndChargesService.getIndicativeCloseQuote(this):this.indicativeCostsAndChargesService.getIndicativeOpenQuote(this)}},{key:"iccDirection",get:function(){return this.showClosing?"sell"===this.direction?"buy":"sell":this.direction}},{key:"roundedOpenLevel",get:function(){return Math.round(this.aggregatePositionOpenLevel*Math.pow(10,this.market.decimalPlacesFactor))/Math.pow(10,this.market.decimalPlacesFactor)}},{key:"iccOpeningLevel",get:function(){return this.aggregatePositionOpenLevel?this.roundedOpenLevel:y(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"iccOpeningLevel",this)}},{key:"maximumRisk",get:function(){return(0,n.default)(this.size,this.pointsThroughCurrent,this.isSell?this.bidPrice:this.offerPrice,this.market.valueOfOnePoint,this.marketOrder)}},{key:"maximumRiskInAccountCurrency",get:function(){return this.currency.baseExchangeRate?this.maximumRisk/this.currency.baseExchangeRate:null}},{key:"commission",get:function(){return(0,o.default)(this.size,this.market.commissionsRateType,this.market.commissionsCharge,this.market.commissionsMinCharge)}},{key:"swapCost",get:function(){var e=this.size,t=this.direction,r=this.isSell?this.market.swapRateShort:this.market.swapRateLong,i=this.market&&this.market.valueOfOnePip
return e&&t&&!(0,a.isNil)(r)&&i?r*e*i:null}},{key:"swapCostInAccountCurrency",get:function(){return(0,a.isNil)(this.swapCost)?null:this.swapCost/this.currency.baseExchangeRate}},{key:"_validationDependentKeys",get:function(){return[].concat(function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}(y(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_validationDependentKeys",this)),["stopRequired","limitRequired"])}}]),t}(t.default),h(d.prototype,"maximumRisk",[u],Object.getOwnPropertyDescriptor(d.prototype,"maximumRisk"),d.prototype),h(d.prototype,"maximumRiskInAccountCurrency",[l],Object.getOwnPropertyDescriptor(d.prototype,"maximumRiskInAccountCurrency"),d.prototype),h(d.prototype,"commission",[c],Object.getOwnPropertyDescriptor(d.prototype,"commission"),d.prototype),h(d.prototype,"swapCost",[p],Object.getOwnPropertyDescriptor(d.prototype,"swapCost"),d.prototype),h(d.prototype,"swapCostInAccountCurrency",[f],Object.getOwnPropertyDescriptor(d.prototype,"swapCostInAccountCurrency"),d.prototype),d)
e.default=v}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default={GOOD_FOR_DAY:"GoodForDay",GOOD_FOR_DAY_ALL_SESSIONS:"GoodForDayAllSessions",GOOD_TILL_CANCELLED:"GoodTillCancelled",EXECUTE_AND_ELIMINATE:"ExecuteAndEliminate",FILL_OR_KILL:"FillOrKill"}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(8),r(0)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,i,n){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,a=n===t.default.Type.ABSOLUTE
if((0,r.isEmpty)(e))return null
if("pts"===e.unit)return a?e.value/o:e.value
if("pct"===e.unit&&i)return a||(i*=o),i*e.value/100
return null}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(23),r(8),r(0)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.getMinimumDistanceFromMarket=function(e,r){if(i.default.isEmpty(e)||i.default.isEmpty(r)||i.default.isEmpty(r.dealingRules))return null
if(e===t.default.GUARANTEED)return r.dealingRules.minControlledRiskStopDistance
return r.dealingRules.minNormalStopOrLimitDistance},e.getMinimumDistanceValueForExistingPosition=function(e,n,o){var a=function(e){return e===t.default.GUARANTEED}
if(e.stopLevelType!==r.default.Type.ABSOLUTE||i.default.isNil(n)||i.default.isNil(e.stopLevel)||a(e.stopType)!==a(o))return n
var s=("-"===e.direction?1:-1)*(e.stopLevel-e.firstTierLatest)
return Math.min(Math.max(0,s),n)}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(7)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var n=function(e){function t(e,r,i){var n=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))
return o._subscriptionString=e,o._messageKey=r,o._lightstreamerService=i,o._isJson=n,o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"_handleMessage",value:function(e){var r=this._messageKey,i=r.length,n=e.getValue(r)
if(n.substring(0,i)===r&&(n=n.substring(i+1)),this._isJson)try{this.trigger(t.Events.UPDATED,JSON.parse(n))}catch(o){}else this.trigger(t.Events.UPDATED,n)}},{key:"startListening",value:function(e){if(!this._subscription){var t=this._subscriptionString.replace("{identifier}",e)
this._subscription=this._lightstreamerService.subscribe(t,[this._messageKey],"RAW",this._handleMessage.bind(this))}return this}},{key:"stopListening",value:function(){return this._subscription&&(this._subscription.unsubscribe(),this._subscription=null),this}},{key:"destroy",value:function(){i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this),this.stopListening()}}]),t}(t.default)
n.Events={UPDATED:"UPDATED"},e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(6),r(20),r(10),r(8),r(2),r(0),r(23),r(18),r(22),r(70)],n=function(e,t,r,i,n,o,a,s,u,l,c){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var p=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var f,d,y,h,v,g,_,O,b,m,T,k,P,S=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function E(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var L=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],i=!0,n=!1,o=void 0
try{for(var a,s=e[Symbol.iterator]();!(i=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);i=!0);}catch(u){n=!0,o=u}finally{try{!i&&s.return&&s.return()}finally{if(n)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}
var w=(f=(0,o.default)("dealSize","positions"),d=(0,o.default)("dealSize","positions"),y=(0,o.default)("market","latest"),h=(0,o.default)("market","direction","dealSize","latest","rdwOffer","rdwBid"),v=(0,o.default)("latest"),g=(0,o.default)("latest","openLevel"),_=(0,o.default)("profitLoss"),O=(0,o.default)("dealSize","latest"),b=(0,o.default)("dealSize","latest"),m=(0,o.default)("latest","dealSize","direction","market"),T=(0,o.default)("positionValue","contractSize"),k=(0,o.default)("notionalValue"),P=function(e){function t(e){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var i=e[0],o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,{epic:i.epic,contractSize:i.contractSize,currency:i.currency,currencyCodeISO:i.currencyCodeISO,displayName:i.displayName,displayPeriod:i.displayPeriod,direction:i.direction,id:t.generateAggregateId(i),isPriceTypeBackOnly:null,isUS:r,market:i.market,period:i.period,positions:[],riskType:i.riskType,limitType:n.default.Type.ABSOLUTE,stopLevelType:n.default.Type.ABSOLUTE,rdwBid:null,rdwOffer:null,priceInSizeShown:i.priceInSizeShown,sterlingToAccountCurrencyRate:i.sterlingToAccountCurrencyRate}))
return o._latestWithDependencies=["latest"].concat(o.batchChangesForKeys(["latest"])),e.forEach(o.addPosition,o),o.proxyChangesFor("rdwOffer","rdwBid"),o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),p(t,[{key:"addPosition",value:function(e){var r=this.positions
r.length||this._subscribeToFirstPosition(e),r.push(e),this._onPositionChange(t.positionKeys),e.on("change",this._onPositionChange,this)}},{key:"_onFirstPositionChange",value:function(e){var t=[]
e.includes("latest")&&(t=t.concat(this._latestWithDependencies)),(e.includes("exchangeRate")||e.includes("sterlingToAccountCurrencyRate"))&&t.push("profitLossInBaseCurrency","notionalValueInBaseCurrency"),e.includes("underlyingPrice")&&t.push("underlyingPrice"),t.length&&this.trigger("change",t)}},{key:"_onPositionChange",value:function(e){var r=a.default.intersection(t.positionKeys,e)
r.length&&this.trigger("change",r.concat(this.batchChangesForKeys(r)))}},{key:"removePosition",value:function(e){var r=this.positions
if(r.length){var i=r.indexOf(e);-1!==i&&(e.off("change",this._onPositionChange,this),e.off("change",this._onFirstPositionChange,this),r.splice(i,1),0===i&&r[0]&&this._subscribeToFirstPosition(r[0])),this._onPositionChange(t.positionKeys)}}},{key:"_subscribeToFirstPosition",value:function(e){this.setProperties({isPriceTypeBackOnly:e.isPriceTypeBackOnly()}),e.on("change",this._onFirstPositionChange,this)}},{key:"canEdit",value:function(){return this.positions.every((function(e){return e.canEdit()}))}},{key:"canClose",value:function(){return this.positions.every((function(e){return e.canClose()}))}},{key:"isShort",value:function(){return"-"===this.direction}},{key:"_calculateWeightedAverage",value:function(e){return this.positions.length?a.default.sumBy(this.positions,(function(t){return t[e]*t.dealSize}))/this.dealSize:null}},{key:"profitLossTieredPricesPartialClose",value:function(e){var t=this.isShort()?"buy":"sell",r=(0,l.calculateTierOrdinal)(this.market,this.currencyCodeISO,e,t,this.rdwBid,this.rdwOffer),i=(0,l.getTieredLatestPrice)(this.market,t,r)
return(0,u.calculateProfitAndLoss)(i,this.openLevel,this.contractSize,e,this.isShort(),this.isPriceTypeBackOnly)}},{key:"_sumOfPositions",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=this.positions
return r.length?t&&r.every((function(t){return null===t[e]}))?null:Math.round(1e4*a.default.sumBy(r,(function(t){return+t[e]||0})))/1e4:null}},{key:"destroy",value:function(){var e=this
this.positions.forEach((function(t){t.off("change",e._onPositionChange,e),t.off("change",e._onFirstPositionChange,e)})),S(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}},{key:"dmaPartiallyFilled",get:function(){return this.positions.some((function(e){return e.dmaPartiallyFilled}))}},{key:"isDMA",get:function(){return this.positions.some((function(e){return e.isDMA}))}},{key:"isAllDMAPositions",get:function(){return this.positions.every((function(e){return e.isDMA}))}},{key:"openLevel",get:function(){return this._calculateWeightedAverage("openLevel")}},{key:"epicOpenLevel",get:function(){return this._calculateWeightedAverage("epicOpenLevel")}},{key:"latest",get:function(){if(this.priceInSizeShown){var e=this.isShort()?"buy":"sell"
return(0,l.getTieredLatestPrice)(this.market,e,this.tierOrdinal,this.knockoutLevel)}return this.positions.length?this.positions[0].latest:null}},{key:"firstTierLatest",get:function(){if(this.priceInSizeShown){var e=this.isShort()?"buy":"sell"
return(0,l.getTieredLatestPrice)(this.market,e,1,this.knockoutLevel)}return this.positions.length?this.positions[0].latest:null}},{key:"tierOrdinal",get:function(){var e=this.isShort()?"buy":"sell"
return(0,l.calculateTierOrdinal)(this.market,this.currencyCodeISO,this.dealSize,e,this.rdwBid,this.rdwOffer)}},{key:"underlyingPrice",get:function(){return this.positions.length?this.positions[0].underlyingPrice:null}},{key:"optionPrice",get:function(){return this.positions.length?this.positions[0].optionPrice:null}},{key:"knockoutLevel",get:function(){return this.positions.length?this.positions[0].knockoutLevel:null}},{key:"pointsMoved",get:function(){return r.default.getPointsMoved(this)}},{key:"limitLevel",get:function(){var e=this.positions.map((function(e){return e.limitLevel}))
return function(e){if(!e.length)return!1
var t=e[0]
return!!t&&e.every((function(e){return e===t}))}(e)?e[0]:null}},{key:"stopLevel",get:function(){var e=this.positions.map((function(e){return{level:e.stopLevel,type:e.stopType,trailingStopDistance:e.stopTrailingDistance,trailingStopIncrement:e.stopStep}}))
return function(e,t){if(!e.length)return!1
var r=L(e,1)[0],n=r.level,o=r.type,a=r.trailingStopDistance,s=r.trailingStopIncrement
return!(!n||t&&o===i.default.Type.GUARANTEED||!t&&o===i.default.Type.TRAILING)&&e.every((function(e){var r=!0
return t&&o===i.default.Type.TRAILING&&(r=e.trailingStopDistance===a&&e.trailingStopIncrement===s),e.level===n&&e.type===o&&r}))}(e,this.isUS)?e[0].level:null}},{key:"stopTrailingDistance",get:function(){if(this.isUS&&this.stopLevel){var e=this.positions.length&&this.positions[0].stopTrailingDistance
if(e&&this.positions.every((function(t){return t.stopTrailingDistance===e})))return e}return null}},{key:"stopStep",get:function(){if(this.isUS&&this.stopLevel){var e=this.positions.length&&this.positions[0].stopStep
if(e&&this.positions.every((function(t){return t.stopStep===e})))return e}return null}},{key:"stopType",get:function(){var e=this.positions.length&&this.positions[0].stopType===i.default.Type.GUARANTEED,t=this.isUS&&this.positions.length&&this.positions[0].stopType===i.default.Type.TRAILING
return e?i.default.Type.GUARANTEED:t?i.default.Type.TRAILING:i.default.Type.NON_GUARANTEED}},{key:"dealSize",get:function(){return this._sumOfPositions("dealSize")}},{key:"profitLossInBaseCurrency",get:function(){return this.priceInSizeShown?this.currency?1===this.currency.exchangeRate?this.profitLoss:(0,c.default)(this.currency.baseExchangeRate,this.profitLoss):null:this._sumOfPositions("profitLossInBaseCurrency")}},{key:"profitLoss",get:function(){return this.priceInSizeShown?(0,u.calculateProfitAndLoss)(this.latest,this.openLevel,this.contractSize,this.dealSize,this.isShort(),this.isPriceTypeBackOnly):this._sumOfPositions("profitLoss")}},{key:"positionValue",get:function(){return this._sumOfPositions("positionValue")}},{key:"notionalValue",get:function(){return this._sumOfPositions("notionalValue",!0)}},{key:"notionalValueInBaseCurrency",get:function(){return this._sumOfPositions("notionalValueInBaseCurrency",!0)}},{key:"notionalValueCurrencyCodeISO",get:function(){return this.positions.length?this.positions[0].notionalValueCurrencyCodeISO:null}}],[{key:"generateAggregateId",value:function(e){var t=e.knockoutLevel?"-"+e.knockoutLevel:"",r=e.period&&e.market&&e.market.isKnockout?"-"+e.period.trim():"",i=e.stopType===s.default.GUARANTEED?2:1
return e.epic+"-"+e.direction+"-"+e.currencyCodeISO+"-"+i+t+r}},{key:"positionKeys",get:function(){return["dealSize","limitLevel","stopLevel","stopType","stopStep","stopTrailingDistance"]}}]),t}(t.default),E(P.prototype,"openLevel",[f],Object.getOwnPropertyDescriptor(P.prototype,"openLevel"),P.prototype),E(P.prototype,"epicOpenLevel",[d],Object.getOwnPropertyDescriptor(P.prototype,"epicOpenLevel"),P.prototype),E(P.prototype,"firstTierLatest",[y],Object.getOwnPropertyDescriptor(P.prototype,"firstTierLatest"),P.prototype),E(P.prototype,"tierOrdinal",[h],Object.getOwnPropertyDescriptor(P.prototype,"tierOrdinal"),P.prototype),E(P.prototype,"optionPrice",[v],Object.getOwnPropertyDescriptor(P.prototype,"optionPrice"),P.prototype),E(P.prototype,"pointsMoved",[g],Object.getOwnPropertyDescriptor(P.prototype,"pointsMoved"),P.prototype),E(P.prototype,"profitLossInBaseCurrency",[_],Object.getOwnPropertyDescriptor(P.prototype,"profitLossInBaseCurrency"),P.prototype),E(P.prototype,"profitLoss",[O],Object.getOwnPropertyDescriptor(P.prototype,"profitLoss"),P.prototype),E(P.prototype,"profitLossTieredPricesPartialClose",[b],Object.getOwnPropertyDescriptor(P.prototype,"profitLossTieredPricesPartialClose"),P.prototype),E(P.prototype,"positionValue",[m],Object.getOwnPropertyDescriptor(P.prototype,"positionValue"),P.prototype),E(P.prototype,"notionalValue",[T],Object.getOwnPropertyDescriptor(P.prototype,"notionalValue"),P.prototype),E(P.prototype,"notionalValueInBaseCurrency",[k],Object.getOwnPropertyDescriptor(P.prototype,"notionalValueInBaseCurrency"),P.prototype),P)
e.default=w}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(6),r(10),r(8),r(0)],n=function(e,t,r,i,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.defaultSettings=void 0
var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var a=e.defaultSettings={defaultLevelType:i.default.Type.RELATIVE,forceOpen:!1,marketOrder:!1,partialFill:!1,rememberLastTradedLimitDistance:!1,rememberLastTradedSize:!1,rememberLastTradedStopTypeAndDistance:!1,rememberLastTradedPointsThroughCurrent:!1,rememberLastTradedOrderTypeAndExpiry:!1,showForceOpen:!1,showMarketOrder:!1,showPartialFill:!1,showPointsThroughCurrent:!1,showNotionalValue:!1,_usedDefaultForceOpen:!1,_usedDefaultShowForceOpen:!1},s=function(e){function t(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,n.default.merge({},a,e)))
return r._usedDefaultForceOpen=!e||!Object.prototype.hasOwnProperty.call(e,"forceOpen")||Object.prototype.hasOwnProperty.call(e,"_usedDefaultForceOpen")&&e._usedDefaultForceOpen,r._usedDefaultShowForceOpen=!e||!Object.prototype.hasOwnProperty.call(e,"showForceOpen")||Object.prototype.hasOwnProperty.call(e,"_usedDefaultShowForceOpen")&&e._usedDefaultShowForceOpen,r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"applyLastTradedCurrency",value:function(e){if(this.rememberLastTradedSize){var t=n.default.find(e.currencies,(function(t){return t.name===e.market.lastTradedCurrency}))
e.set("currency",t||e.currency)}}},{key:"applyLastTradedSizeAndCurrency",value:function(e){if(this.rememberLastTradedSize){var t=n.default.find(e.currencies,(function(t){return t.name===e.market.lastTradedCurrency}))
e.set("currency",t||e.currency),e.set("size",e.market.lastTradedSize)}}},{key:"applyLastTradedStop",value:function(e){var t=e.getDefaultStopType()
if(this.rememberLastTradedStopTypeAndDistance){var n=this.defaultLevelType
e.set("stopType",r.default.getValidStopType(e.stopTypes,e.market.lastTradedStopType||t||r.default.Type.NON_GUARANTEED))
var o=null
n===i.default.Type.RELATIVE&&(o=e.market.lastTradedStopDistance||null),e.setProperties({stopStep:e.market.lastTradedTrailingStopIncrement,stopLevel:o,stopLevelType:n})}else t&&e.set("stopType",t)}},{key:"applyLastTradedLimit",value:function(e){if(this.rememberLastTradedLimitDistance){var t=this.defaultLevelType,r=void 0
r=t===i.default.Type.RELATIVE?e.market.lastTradedLimitDistance:null,e.setProperties({limitLevel:r,limitType:t})}}},{key:"applyLastTradedPointsThroughCurrent",value:function(e){this.rememberLastTradedPointsThroughCurrent&&e.set("pointsThroughCurrent",e.market.lastTradedPointsThroughCurrent)}},{key:"applyDefaultLevel",value:function(e){var t=this.defaultLevelType
e.setProperties({stopLevelType:t,limitType:t})}}]),t}(t.default)
e.default=s}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(1),r(80)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.INITIAL_ICC=e.ICC_EDIT_TYPES=e.ICC_API_STATES=void 0
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),o=Object.freeze(["atm","atf","dem","def","det","esm","esf","est","frm","frf","frt","itm","itf","itt","nlm","nlf","nlt","nom","nof","not","sem","sef","set","iem","ief","iet","iei","eng","enf","ent","por","pof"]),a=Object.freeze(["atm","atf","dem","def","esm","esf","frm","frf","itm","itf","nlm","nlf","nom","nof","sem","sef","iem","ief","iei","eng","enf","por","pof"]),s=Object.freeze(["igm","igi"]),u=Object.freeze(["sgx"]),l=Object.freeze(["aum","cnm"]),c=Object.freeze(["dbm"]),p=e.ICC_API_STATES=Object.freeze({NOT_FETCHED:"NOT_FETCHED",FETCHING:"FETCHING",FETCHED:"FETCHED",ERROR:"ERROR"}),f=Object.freeze({OPEN:"/open",EDIT:"/edit",CLOSE:"/close"}),d=(e.ICC_EDIT_TYPES=Object.freeze({STOP:"STOP",LIMIT:"LIMIT"}),e.INITIAL_ICC={indicativeCostsAndCharges:null,indicativeCostsAndChargesState:p.NOT_FETCHED}),y=function(){function e(t,r){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._heartbeat=r
var n=t.environment,p=void 0===n?{}:n,f=t.user,d=void 0===f?{}:f,y="PWA_IG"===p.platform,h=y?a:o,v=y?[]:s,g=y?[]:u,_=y?[]:c
this.showExAnteCostsAndCharges=i||!0===d.isRetailAccount&&h.includes(d.siteId),this.showUkCostsAndCharges=!0===d.isRetailAccount&&v.includes(d.siteId),this.showSingaporeanCostsAndCharges=g.includes(d.siteId),this.showAustralianCostsAndCharges=!y&&l.includes(d.siteId),this.showDubaianCostsAndCharges=_.includes(d.siteId)}return n(e,[{key:"reset",value:function(e){this.abortQuoteRequest(e),e.setProperties(d)}},{key:"abortQuoteRequest",value:function(e){e._indicativeCostsAndChargesAbortController&&(e._indicativeCostsAndChargesAbortController.abort(),e._indicativeCostsAndChargesAbortController=null)}},{key:"getIndicativeOpenQuote",value:function(e){return this._getIndicativeQuote(e,f.OPEN,{priceLevel:e.iccPriceLevel,stop:e.iccStopLevel,limit:e.iccLimitLevel,epic:e.market.epic,dma:e.isDMA})}},{key:"getIndicativeEditQuote",value:function(e){var t=e.position&&this._isDmaCostQuote(e.position)
return this._getIndicativeQuote(e,f.EDIT,{openingLevel:e.iccPriceLevel,stopLevel:e.iccStopLevel,limitLevel:e.iccLimitLevel,dma:t})}},{key:"getIndicativeCloseQuote",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r={openingLevel:e.iccOpeningLevel,stopLevel:e.iccStopLevel,dma:e.isDMA}
return t&&(r.priceLevel=e.iccPriceLevel),this._getIndicativeQuote(e,f.CLOSE,r)}},{key:"_isDmaCostQuote",value:function(e){var t=e.positions,r=e.isAllDMAPositions,i=e.isDMA
return t?r:i}},{key:"_getIndicativeQuote",value:function(e,n){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}
if(this.abortQuoteRequest(e),e._indicativeCostsAndChargesAbortController=new r.AbortController,e.setProperties({indicativeCostsAndCharges:null,indicativeCostsAndChargesState:p.FETCHING}),e.skipICCRequest)return Promise.resolve()
var a=this._session.user,s=a.broker&&a.broker.currentAccountId?"/dealing-gateway/costsandcharges/broker/"+a.clientId+"/account/"+a.accountId+"/proxyAccount/"+a.broker.currentAccountId+n:"/dealing-gateway/costsandcharges/"+a.accountId+n,u=i({},this._createCommonQuoteJSON(e),o)
return n===f.EDIT&&(u.editType=e.indicativeCostsAndChargesEditType),t.post(s,this._session,u,{},e._indicativeCostsAndChargesAbortController).then((function(t){e.setProperties({indicativeCostsAndCharges:t,indicativeCostsAndChargesState:p.FETCHED})})).catch((function(t){"AbortError"!==t.name&&e.setProperties({indicativeCostsAndCharges:null,indicativeCostsAndChargesState:p.ERROR})})).finally((function(){e._indicativeCostsAndChargesAbortController=null}))}},{key:"_createCommonQuoteJSON",value:function(e){var t=this._session.user.isSpreadbet&&e.isEditTicket&&e.isOrder,r=this._session.user.isSpreadbet&&e.isCloseTicket&&e.isPosition,i=t||r,n=null
return i&&(n=t?e.order.currencyCodeISO:e.position.currencyCodeISO),{accountId:this._session.user.accountId,ask:parseFloat(e.offerPrice),bid:parseFloat(e.bidPrice),dealCurrencyCode:i?n:e.currency.name,dealReference:e.dealReference,direction:e.iccDirection.toUpperCase(),editType:null,guaranteedStop:e._hasGuaranteedStop(),instrumentId:e.market.igInstrumentId,knockoutPremium:e.market.knockoutPremium?e.market.knockoutPremium:null,size:e.iccSize}}}]),e}()
e.default=y}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(27),r(5),r(137),r(138),r(139),r(60),r(1),r(0)],n=function(e,t,r,i,n,o,a,s,u){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var l=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),c=function(){function e(t,r,i){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._confirmationStreamingClient=r,this._dealReferenceGenerator=i}return l(e,[{key:"create",value:function(e){return new i.default(e,this._session,this._confirmationStreamingClient)}},{key:"delete",value:function(e){return new n.default(e,this._session,this._confirmationStreamingClient)}},{key:"getAll",value:function(){var r="/"+this._session.environment.path+"/wtp/orders/workingorders"
return s.get(r,this._session).then((function(r){var i=e.parseMarkets(r)
return{orders:r.map((function(e){return e.marketData?t.default.fromDealingRestOrder(e):null})).filter(u.default.identity),markets:i}}))}},{key:"edit",value:function(e){return new o.default(e,this._session,this._confirmationStreamingClient)}},{key:"destroy",value:function(){this._session=null,this._dealReferenceGenerator=null}}],[{key:"getStreamingClient",value:function(e){return new a.default(e)}},{key:"parseMarkets",value:function(e){var t=u.default.uniqBy(e,"workingOrderData.epic").map((function(e){var t=e.marketData
return r.default.populateWithV2MarketData(t)})).filter(Boolean)
return u.default.keyBy(t,"epic")}}]),e}()
e.default=c}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var t="STARTED",r="PENDING",i="CANCELED",n="CONFIRMED",o="REJECTED",a="UNVERIFIED",s="FAILED",u="ABORTED",l=[u,s,o,a,i],c=l.concat(n),p=[t,r]
e.NOT_STARTED="NOT_STARTED",e.STARTED=t,e.PENDING=r,e.CONFIRMED=n,e.CANCELLED=i,e.REJECTED=o,e.UNVERIFIED=a,e.FAILED=s,e.ABORTED=u,e.IN_PROGRESS_STATES=p,e.UNSUCCESSFUL_COMPLETED_STATES=l,e.COMPLETED_STATES=c}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(0),r(7),r(28)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var a=function(e){function r(e,t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
var i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this))
return i._lightstreamerService=e,i._accountId=t,i._listeners=[],i._updates=[],i._removeListenersImmediately=!0,i._startListening(),i}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),n(r,[{key:"waitForConfirm",value:function(e){var t=this
return new Promise((function(r,i){t._listeners.push(t.getListener(e,r,i)),t._tryResolveOrReject()}))}},{key:"getListener",value:function(e,t,r){return{dealReference:e,resolve:t,reject:r}}},{key:"destroy",value:function(){this._subscription&&(this._subscription.unsubscribe(),this._subscription=null),this._updates=null,this._listeners=null,o(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"destroy",this).call(this)}},{key:"_startListening",value:function(){var e=this._accountId
this._subscription=this._lightstreamerService.subscribe("V2-M-MESSAGE_EVENT_HANDLER|"+e+"-ERS",["update"],"RAW",this._handleUpdateFromLightstreamer.bind(this),2)}},{key:"_tryResolveOrReject",value:function(){var e=this,r=t.default.map(this._updates,"content.dealReference"),n=t.default.map(this._listeners,"dealReference"),o=t.default.intersection(r,n)
t.default.filter(this._updates,(function(e){return t.default.includes(o,e.content.dealReference)})).forEach((function(r){var n=t.default.get(r,"content.reportType"),o=t.default.filter(e._listeners,(function(e){return e.dealReference===r.content.dealReference}))
"DMA"===r.category||"OTC"===r.category||"EXCHANGE"===r.category&&n!==i.CANCELLED?o.forEach((function(e){return e.resolve(r)})):(["OTC_REJECTED","EXCHANGE_REJECTED","DMA_REJECTED"].includes(r.category)||"EXCHANGE"===r.category&&n===i.CANCELLED)&&o.forEach((function(e){return e.reject(r)})),e._removeListenersImmediately&&(e._listeners=t.default.difference(e._listeners,o))})),this._updates=t.default.takeRight(this._updates,500)}},{key:"_handleUpdateFromLightstreamer",value:function(e){var t=e.getValue("update")
if("INV"!==t){var r=JSON.parse(t)
r.category&&(this._updateRDW(r),this._updates.push(r),this._tryResolveOrReject())}}},{key:"_updateRDW",value:function(e){var t=e.content.epic,r=e.content.currency,i=e.content.direction,n=e.content.repeatDealingWindow&&e.content.repeatDealingWindow.entries
t&&r&&i&&n&&this.trigger("rdw",[t,r,i.toLowerCase(),n])}}]),r}(r.default)
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(15),r(5)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var o=function(e){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=arguments[2];(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var n="PRICE:"+i.user.accountId+":{id}{modifiers}",o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n,"MERGE",r,!0,"Pricing"))
return o._session=i,o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"add",value:function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]
if(!e.isUnpriced){var o=Object.keys(r.PIS_FID_SCHEMA)
e.isKnockout||(o=o.filter((function(e){return"KO_PREMIUM"!==e}))),this._session.user.isMTF&&(o=o.filter((function(e){return"MIDPRICE"!==e}))),n(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"add",this).call(this,e.epic,o,e.boundOnStreamedPriceUpdate,i)}}},{key:"remove",value:function(e){return!e.isUnpriced&&n(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"remove",this).call(this,e.boundOnStreamedPriceUpdate)}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(20),r(15)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var o=Object.keys(t.POSITION_FID_SCHEMA),a=function(e){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null
return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,"V2-M-{fids}{modifiers}|{id}","MERGE",r))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"add",value:function(e){n(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"add",this).call(this,e.dealId,this.getFids(),e.boundOnStreamedUpdate)}},{key:"remove",value:function(e){return n(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"remove",this).call(this,e.boundOnStreamedUpdate)}},{key:"getFids",value:function(){return o}}]),t}(r.default)
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(15),r(5)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.BINARY_FIDS=e.KO_FIDS=e.FIDS=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var o=e.FIDS=Object.keys(r.V2_TO_V4_FID_MAPPING).filter((function(e){return"MKT"!==e})),a=e.KO_FIDS=Object.keys(r.KO_FID_SCHEMA),s=e.BINARY_FIDS=Object.keys(r.V2_TO_V4_FID_MAPPING),u=/(?:\.FREE)*$/,l=function(e){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null
return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,"V2-F-{fids}{modifiers}|{id}","MERGE",r,!0))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"add",value:function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],u=arguments[2]
if(!e.isUnpriced){var l=e.isBinary?s:o,c=r.default.getFidsForSwapRate(u,["LONG","SHORT"]),p=e.isKnockout?a:[]
n(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"add",this).call(this,this._getEpicForStreaming(e),l.concat(c,p),e.boundOnStreamedV2Update,i.concat(e.getSubscriptionModifiers()))}}},{key:"remove",value:function(e){if(!e.isUnpriced)return n(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"remove",this).call(this,e.boundOnStreamedV2Update)}},{key:"_getEpicForStreaming",value:function(e){var t=e.epic
return e.isFree?t.replace(u,".FREE"):t}}]),t}(t.default)
e.default=l}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0),r(29),r(3),r(2),r(9),r(22)],n=function(e,t,r,i,n,o,a){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var u=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var l,c,p,f,d,y,h=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function v(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var g=(l=(0,n.default)("size","position","position.priceInSizeShown","position.profitLoss","position.dealSize"),c=(0,n.default)("market","market.marketStatus"),p=(0,n.default)("position.latest","market.lotSize","size"),f=(0,n.default)("direction","size","sizeIncludingRDW","ladder","position.currency"),d=(0,n.default)("position.dealSize"),y=function(e){function r(e,t){var i;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
for(var n=arguments.length,o=Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a]
var s=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i=r.__proto__||Object.getPrototypeOf(r)).call.apply(i,[this,e,t.market].concat(o)))
return s.set("isCloseTicket",!0),s.set("position",t),s.set("stopLevel",t.stopLevel),s.set("stopType",t.stopType),s.set("stopLevelType",t.stopLevelType),s.set("limitLevel",t.limitLevel),s.set("limitType",t.limitType),s.set("size",t.dealSize),s.set("direction","+"===t.direction?"sell":"buy"),s.set("sizeMaxDecimalPlaces","S"===t.market.unit?0:2),s.position.on("change",s._onPositionChange,s),s.market&&s.market.isKnockout&&(s.knockoutLevel=t.knockoutLevel),s}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),u(r,[{key:"_onPositionChange",value:function(e){var t=this.batchChangesForKeys(e,"position")
t.length&&this.trigger("change",t),e.includes("stopLevel")&&this.set("stopLevel",this.position.stopLevel)}},{key:"_getValidators",value:function(){return[i.direction,i.marketDealable,i.sizeBelowMax,i.sizeAboveZero]}},{key:"_getMargin",value:function(){return this.marginService.getClosePositionMargin(this)}},{key:"_submitDeal",value:function(){return this._restService.delete(this)}},{key:"_updatePerMarketSettings",value:function(){}},{key:"toJSON",value:function(){var e=this.position,i=!!e.positions,n=e.market.epic,o=e.dealId,a=t.default.pick(h(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"toJSON",this).call(this),["currencyCode","dealReference","decisionMakerAccountId","submittedTimestamp","size","direction","orderType","timeInForce","quoteId","pointsThroughCurrent","dealTicketMargin"])
a.pointsThroughCurrent&&(a.pointsThroughCurrentPrice=a.pointsThroughCurrent,delete a.pointsThroughCurrent)
var u={expiry:e.market.isKnockout&&e.period?e.period:e.market.displayPeriod,level:e.latest,currencyCodeISO:e.currencyCodeISO,guaranteed:this._hasGuaranteedStop()}
return i?u.epic=n:u.dealId=o,this.knockoutLevel&&(u.knockoutLevel=this.knockoutLevel),s({},a,u)}},{key:"getTierOrdinal",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=arguments[2]
return(0,a.calculateTierOrdinal)(this.market,r&&r.name||this.currency&&this.currency.name,this.size,e,this.rdwBid,this.rdwOffer,t)}},{key:"_getIndicativeCostsAndCharges",value:function(){return this.indicativeCostsAndChargesService.getIndicativeCloseQuote(this)}},{key:"destroy",value:function(){this.position.off("change",this._onPositionChange,this),h(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"destroy",this).call(this)}},{key:"roundedOpenLevel",get:function(){return Math.round(this.position.openLevel*Math.pow(10,this.market.decimalPlacesFactor))/Math.pow(10,this.market.decimalPlacesFactor)}},{key:"iccPriceLevel",get:function(){return this.roundedOpenLevel||h(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"iccPriceLevel",this)||this.position&&this.position.latest}},{key:"iccDirection",get:function(){return"sell"===this.direction?"buy":"sell"}},{key:"profitLoss",get:function(){var e=this.position.dealSize
return e&&0!==this.size?this.position.priceInSizeShown?this.size<e?this.position.profitLossTieredPricesPartialClose(this.size):this.position.profitLoss:this.position.profitLoss/e*this.size:0}},{key:"isMarketDealable",get:function(){return this.market.marketStatus===o.default.TRADEABLE||this.market.marketStatus===o.default.CLOSE_ONLY}},{key:"premiumValue",get:function(){return this.position.latest*this.market.lotSize*this.size}},{key:"tierOrdinal",get:function(){return this.getTierOrdinal(this.direction,!1,this.position.currency)}},{key:"maxSize",get:function(){return this.position&&this.position.dealSize||-1}}]),r}(r.default),v(y.prototype,"profitLoss",[l],Object.getOwnPropertyDescriptor(y.prototype,"profitLoss"),y.prototype),v(y.prototype,"isMarketDealable",[c],Object.getOwnPropertyDescriptor(y.prototype,"isMarketDealable"),y.prototype),v(y.prototype,"premiumValue",[p],Object.getOwnPropertyDescriptor(y.prototype,"premiumValue"),y.prototype),v(y.prototype,"tierOrdinal",[f],Object.getOwnPropertyDescriptor(y.prototype,"tierOrdinal"),y.prototype),v(y.prototype,"maxSize",[d],Object.getOwnPropertyDescriptor(y.prototype,"maxSize"),y.prototype),y)
e.default=g}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,t){return t.some((function(t){return e.includes(t)}))}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e){if(0===e.status)return
if(e.status>0){var t=JSON.stringify({url:e.url,statusText:e.status+" "+e.statusText,status:e.status})
throw new Error("Failed request: "+t)}throw e}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(23)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,r,i){var n={},o=t.default.GUARANTEED,a=t.default.NON_GUARANTEED,s=t.default.TRAILING
e.rememberLastTradedSize&&(Object.prototype.hasOwnProperty.call(r,"displayOrderSize")||Object.prototype.hasOwnProperty.call(r,"size"))&&(n.lastTradedSize=r.displayOrderSize||r.size,n.lastTradedCurrency=r.currencyCode)
e.rememberLastTradedStopTypeAndDistance&&Object.prototype.hasOwnProperty.call(r,"stopDistance")&&(n.lastTradedStopDistance=r.stopDistance,r.trailingStop?(n.lastTradedStopType=s,n.lastTradedTrailingStopIncrement=r.trailingStopIncrement):r.guaranteedStop?(n.lastTradedStopType=o,n.lastTradedTrailingStopIncrement=null):(n.lastTradedStopType=a,n.lastTradedTrailingStopIncrement=null))
e.rememberLastTradedLimitDistance&&Object.prototype.hasOwnProperty.call(r,"limitDistance")&&(n.lastTradedLimitDistance=r.limitDistance)
e.rememberLastTradedPointsThroughCurrent&&Object.prototype.hasOwnProperty.call(r,"pointsThroughCurrent")&&(n.lastTradedPointsThroughCurrent=r.pointsThroughCurrent)
e.rememberLastTradedOrderTypeAndExpiry&&i&&(n.lastTradedOrderType=i)
return n}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(10),r(13),r(11)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var a=function(e){function r(e,t,i,n,o,a,s){var u;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
for(var l=arguments.length,c=Array(l>7?l-7:0),p=7;p<l;p++)c[p-7]=arguments[p]
var f=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(u=r.__proto__||Object.getPrototypeOf(r)).call.apply(u,[this,e,t,i,n,o,a,s].concat(c)))
return f.isOrder=!0,f}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),n(r,[{key:"_onChange",value:function(e){o(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"_onChange",this).call(this,e),e.includes("triggerLevel")&&this._updateMargin()}},{key:"toString",value:function(){return i.default.ORDER}},{key:"stopTypes",get:function(){var e=this.market.controlledRisk,r=this.market.guaranteedStopsAllowed,i=this.market.trailingStopsAllowedPreference,n=this.market.isLimitedRisk
return t.default.getStopTypes(e,r,i,n).filter((function(e){return e.value!==t.default.Type.TRAILING}))}}]),r}(r.default)
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var t=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),r="0123456789ABCDEFGHJKMNPQRSTVWXYZ",i=function(){function e(t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._accountId=t,this._generatedCount=1}return t(e,[{key:"generateDealReference",value:function(e){return""+this._toAlphaNumeric(this._convertAccountIdToNumber(this._accountId))+this._toAlphaNumeric(e||Date.now())+this._toAlphaNumeric(this._generatedCount++).substr(0,2)}},{key:"_convertAccountIdToNumber",value:function(e){return parseInt(e.toUpperCase().replace(/[A-Z]/g,(function(e){var t=e.charCodeAt(0)-64
return(t<10?"0":"")+t})),10)}},{key:"_toAlphaNumeric",value:function(e){for(var t=[],i=15,n=e,o=void 0;--i>=0;)o=31&n,t[i]=r[o],n=Math.floor(n/32)
return this._removePadding(t.join(""))}},{key:"_removePadding",value:function(e){return e.replace(/^0+/,"")}}]),e}()
e.default=i}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,t){if(!t||!t.user||!e)return!1
var r=t.user,i=t.featureFlags,n=r.igCompany,o=r.assetClass,a="igjp"===n&&("FOREX"===o||i.forceJapaneseTicket||i.showNewJapaneseTicket&&["COMMODITIES","INDICES","BONDS","FOREX"].includes(o)),s=e.isKnockout,u=e.isOption,l=e.isBinary,c=!s&&!u&&!l
return Boolean(a&&c)}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(6)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var n=function(e){function t(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,{timestamp:void 0,offset:void 0}))
return r._lsService=e,r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"getTime",value:function(){return Date.now()+("number"==typeof this.offset?this.offset:0)}},{key:"prepare",value:function(){var e=this
return this._subscription||(this._subscription=this._lsService.subscribe("V2-M-HEARTBEAT|HB.U.HEARTBEAT.IP",["MSG_UPDATE"],"MERGE",this._handleUpdate.bind(this))),"number"==typeof this.timestamp?Promise.resolve(this):new Promise((function(t,r){e.once("change",(function(){return t(e)}),e),e.once("destroyed",(function(){return r(new Error("Heartbeat model destroyed before heartbeat started streaming"))}),e)}))}},{key:"_handleUpdate",value:function(e){var r=t.convertToJSTimestamp(e.getValue("MSG_UPDATE"))
if("number"==typeof r){var i=r-Date.now()
this.setProperties({timestamp:r,offset:i})}}},{key:"destroy",value:function(){this._subscription&&(this._subscription.unsubscribe(),delete this._subscription),delete this.timestamp,delete this.offset,i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}}],[{key:"convertToJSTimestamp",value:function(e){var t=void 0
if("string"==typeof e){if(e.includes(".")){var r=e.match(/^(\d+)/)
if(!r)return null
e=r[1]}if(10===e.length)t=parseInt(e+"000",10)
else{if(13!==e.length)return null
t=parseInt(e,10)}}else if("number"==typeof e)if(e>=1e9&&e<1e10)t=1e3*e
else{if(!(e>=1e12&&e<1e13))return null
t=e}return Number.isNaN(t)||Math.abs(Date.now()-t)>31536e6?null:t}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
e.default={E0_20:.2,E0_50:.5,E1_00:1}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(12),r(1),r(26),r(124),r(5),r(7),r(58),r(0)],n=function(e,t,r,i,n,o,a,s,u){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var l,c=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
function p(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var f="/signals-gateway/alerts/",d=(p(l={},i.default.Type.PRICE_LEVEL_ALERT,f+"price/"),p(l,i.default.Type.PRICE_CHANGE_ALERT,f+"price/change/"),l),y=function(e){function a(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.default.Type.PRICE_LEVEL_ALERT;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,a)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(a.__proto__||Object.getPrototypeOf(a)).apply(this,arguments))
return r._session=e,r._alertType=t,r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(a,e),c(a,[{key:"getAll",value:function(){var e=this
return r.get(this.getUrl(),this._session).then((function(e){return a.enrichMarkets(e)})).then((function(t){var r=t.priceAlerts,i=t.markets
return r.filter((function(e){return i[e.epic]})).map((function(t){return a.createAlertObjectFromMarkets(t,i,e._alertType)}))}))}},{key:"delete",value:function(e){var i=this
return r.del(""+this.getUrl()+e,this._session).then((function(){return i.trigger(t.default.REMOVED,e),{id:e}}))}},{key:"create",value:function(e){var i=this,n=this._alertType
return r.post(this.getUrl(),this._session,a.createPostData(e,n)).then((function(e){var r=o.default.populateWithV2MarketData(e.market),s=a.createAlertObject(e.priceAlert,r,n)
return i.trigger(t.default.ADDED,s),s}))}},{key:"update",value:function(e){var i=this,n=u.default.omit(e,["id"])
return r.put(""+this.getUrl()+e.id,this._session,n).then((function(r){return i.trigger(t.default.UPDATED,e),r}))}},{key:"getUrl",value:function(){return d[this._alertType]}}],[{key:"createPostData",value:function(e,t){return t!==i.default.Type.PRICE_LEVEL_ALERT?e:{message:e.message,level:e.level,marketAttribute:e.priceType,epic:e.epic,notifications:[]}}},{key:"createAlertObjectFromMarkets",value:function(e,t,r){var i=t[e.epic]
return a.createAlertObject(e,i,r)}},{key:"createAlertObject",value:function(e,t,r){return r&&r!==i.default.Type.PRICE_LEVEL_ALERT?a.createPriceChangeDealingRestAlert(e,t):a.createPriceLevelDealingRestAlert(e,t)}},{key:"enrichMarkets",value:function(e){var t=e.priceAlerts,r=e.markets
return{priceAlerts:t,markets:Object.keys(r).reduce((function(e,t){return e[t]=o.default.populateWithV2MarketData(r[t]),e}),{})}}},{key:"getStreamingClient",value:function(e){return new s.default(e)}},{key:"createPriceLevelDealingRestAlert",value:function(e,t){return n.default.fromDealingRestAlert({id:e.id,message:e.message,status:e.status,timestamp:e.timestamp,epic:e.epic,condition:e.condition,marketAttribute:e.marketAttribute,level:e.level,market:t})}},{key:"createPriceChangeDealingRestAlert",value:function(e,t){return n.default.fromDealingRestAlert({id:e.id,message:e.message,epic:e.epic,priceChange:e.priceChange,timePeriod:e.timePeriod,changeType:e.changeType,creationTime:e.creationTime,triggeredTime:e.triggeredTime,market:t})}}]),a}(a.default)
e.default=y}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(1)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t}return r(e,[{key:"getPositionMargin",value:function(e){return t.post("/"+this._session.environment.path+"/v3/margin/positions/otc",this._session,e)}},{key:"getClosePositionMargin",value:function(e){var r="/"+this._session.environment.path+"/v3/margin/positions/",i=e.isDMA?r+"dma":r+"otc"
return"function"==typeof e.toMarginJSON&&(e=e.toMarginJSON()),t.del(i,this._session,e)}},{key:"getEditOrderMargin",value:function(e){return t.put("/"+this._session.environment.path+"/v3/margin/workingorders/otc/"+e.order.dealId,this._session,e)}},{key:"getEditAggregatePositionMargin",value:function(e){return t.put("/"+this._session.environment.path+"/v3/margin/positions/otc/aggr",this._session,e)}},{key:"getEditPositionMargin",value:function(e){return t.put("/"+this._session.environment.path+"/v3/margin/positions/otc/"+e.position.dealId,this._session,e)}},{key:"getOrderMargin",value:function(e){var r="/"+this._session.environment.path+"/v3/margin/workingorders/",i=e.isDMA?r+"dma":r+"otc"
return"function"==typeof e.toMarginJSON&&(e=e.toMarginJSON()),t.post(i,this._session,e)}}]),e}()
e.default=i}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(5),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),n=function(){function e(t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t}return i(e,[{key:"findByEpic",value:function(e){var i=this._session,n=i.featureFlags.usePriceSubscription,o=new URLSearchParams("epic="+e)
n&&o.set("priceInSizeFlag","true")
var a="/"+i.environment.path+"/v3/markets/details?"+o.toString()
return r.get(a,i,!1,{"IG-ACCOUNT-ID":i.user.accountId}).then((function(e){return t.default.populateWithV3MarketData(e,n)}))}},{key:"findByEpics",value:function(e){var t=this
return Promise.all(e.map((function(e){return t.findByEpic(e)})))}},{key:"getMarketInfo",value:function(e){var t=this._session,i="/"+t.environment.path+"/markets/summary/"+e
return r.get(i,t)}},{key:"getByWatchlist",value:function(e){var i=this._session,n=i.featureFlags.usePriceSubscription,o=n?"?priceInSizeFlag=true":"",a="/"+i.environment.path+"/wtp/markets/watchlists/"+e+o
return r.get(a,i,!1,{"IG-ACCOUNT-ID":this._session.user.accountId}).then((function(e){return e.map((function(e){return e.dynamicHierarchyEpic=e.instrumentData.dynamicHierarchyEpic,e}))})).then((function(e){return e.map((function(e){return t.default.populateWithV2MarketData(e,n)}))}))}},{key:"getDealingRules",value:function(e){var t="/"+this._session.environment.path+"/wtp/markets/dealingrules/"+e
return r.get(t,this._session)}}]),e}()
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(20),r(5),r(141),r(140),r(142),r(61),r(1),r(0)],n=function(e,t,r,i,n,o,a,s,u){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var l=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),c=function(){function e(t,r,i){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._confirmationStreamingClient=r,this._dealReferenceGenerator=i}return l(e,[{key:"getAll",value:function(){var r=this._session,i=r.featureFlags.usePriceSubscription,n=i?"?priceInSizeFlag=true":"",o="/"+r.environment.path+"/wtp/orders/positions"+n
return s.get(o,r).then((function(n){var o=e.parseMarkets(n,i)
return{positions:n.map((function(e){return e.marketDetails||e.market?(e.marketDetails=e.marketDetails||e.market,t.default.fromDealingRestPosition(e,r)):null})).filter(u.default.identity),markets:o}}))}},{key:"create",value:function(e){return new i.default(e,this._session,this._confirmationStreamingClient)}},{key:"delete",value:function(e){return new n.default(e,this._session,this._confirmationStreamingClient)}},{key:"edit",value:function(e){return new o.default(e,this._session,this._confirmationStreamingClient)}},{key:"destroy",value:function(){this._session=null,this._dealReferenceGenerator=null}}],[{key:"getStreamingClient",value:function(e,t){return new a.default(e,t)}},{key:"parseMarkets",value:function(e,t){var i=u.default.uniqBy(e,"openPosition.openPositionData.epic").map((function(e){return r.default.populateFromPositionResponse(e,t)})).filter(Boolean)
return u.default.keyBy(i,"epic")}}]),e}()
e.default=c}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(35)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(t,r){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._userPreferencesService=r,this._settings=null}return r(e,[{key:"_getSettings",value:function(e){return this._settings||(this._settings=new t.default(e)),this._settings}},{key:"getSettings",value:function(){var e=this
return this._userPreferencesService?this._userPreferencesService.getPreferences().then((function(t){return e._getSettings(t)})):Promise.resolve(this._getSettings())}},{key:"saveSettings",value:function(e){return this._userPreferencesService.setPreferences(e.snapshot())}},{key:"destroy",value:function(){this._settings.destroy(),this._settings=null}}]),e}()
e.default=i}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(7),r(152),r(12),r(69),r(148)],n=function(e,t,r,i,n,o){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var s=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var u=function(e){function t(e,r,n,a,s){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var u=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))
return u._store=new o.default(e,r,n,a),u._store.on(i.default.ADDED,(function(e){return u.trigger(i.default.ADDED,e)}),u),u._store.on(i.default.REMOVED,(function(e){return u.trigger(i.default.REMOVED,e)}),u),u._lsService=s,u}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),a(t,[{key:"getTrades",value:function(){var e=this
return this._reconnectionMonitor||(this._reconnectionMonitor=new r.default(this._lsService),this._reconnectionMonitor.on(n.default.RECONNECTED,this.update,this)),this._tradesPromise&&!this._pendingUpdate?Promise.resolve(this._store.getCurrentTrades()):(this._tradesPromise&&this._pendingUpdate||(this._pendingUpdate=!0,this._tradesPromise=this._store.updateTrades().catch((function(t){throw delete e._tradesPromise,t})).finally((function(){e._pendingUpdate=!1}))),this._tradesPromise)}},{key:"update",value:function(){delete this._tradesPromise,delete this._pendingUpdate,this.getTrades()}},{key:"destroy",value:function(){this._tradesPromise&&(delete this._tradesPromise,delete this._pendingUpdate),this._reconnectionMonitor&&(this._reconnectionMonitor.destroy(),delete this._reconnectionMonitor),this._store&&(this._store.destroy(),delete this._store),delete this._lsService,s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}}]),t}(t.default)
e.default=u}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(12),r(33),r(7)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],i=!0,n=!1,o=void 0
try{for(var a,s=e[Symbol.iterator]();!(i=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);i=!0);}catch(u){n=!0,o=u}finally{try{!i&&s.return&&s.return()}finally{if(n)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}
var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var a=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var s=function(e){function i(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,i)
var t=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i.__proto__||Object.getPrototypeOf(i)).call(this))
return t._lightstreamerService=e,t}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(i,e),o(i,[{key:"startListening",value:function(e){return this._subscription=new r.default("V2-M-MESSAGE_EVENT_HANDLER|{identifier}-ACTION","ALU",this._lightstreamerService,!1).startListening(e),this._subscription.on(r.default.Events.UPDATED,this._handleStreamingUpdate.bind(this)),this}},{key:"_handleStreamingUpdate",value:function(e){var r=e.split("|").reduce((function(e,t){var r=t.split("="),i=n(r,2),o=i[0],a=i[1]
return e[o]=a,e}),{})
this.trigger(t.default.UPDATED,r)}},{key:"stopListening",value:function(){this._subscription&&(this._subscription.destroy(),this._subscription=null),this.off()}},{key:"destroy",value:function(){this.stopListening(),a(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"destroy",this).call(this),this._lightstreamerService=null}}]),i}(i.default)
e.default=s}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(27),r(41)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=Object.keys(t.ORDER_FID_SCHEMA),o=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"getFids",value:function(){return n}}]),t}(r.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(12),r(33),r(7),r(27)],n=function(e,t,r,i,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var a=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var s=function(e){function i(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,i)
var t=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i.__proto__||Object.getPrototypeOf(i)).call(this))
return t._lightstreamerService=e,t}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(i,e),o(i,[{key:"startListening",value:function(e){return this._subscription=new r.default("V2-M-MESSAGE_EVENT_HANDLER|{identifier}-WO-JSON","WOU",this._lightstreamerService).startListening(e),this._subscription.on(r.default.Events.UPDATED,this._handleStreamingUpdate.bind(this)),this}},{key:"_handleStreamingUpdate",value:function(e){var r=e.header.contentType,i=e.body
if(r.match(/Add$/)){var o=n.default.fromWOU(i.workingOrder)
this.trigger(t.default.ADDED,o)}else r.match(/Delete$/)&&this.trigger(t.default.REMOVED,i.workingOrder.dealId)}},{key:"stopListening",value:function(){this._subscription&&(this._subscription.destroy(),this._subscription=null),this.off()}},{key:"destroy",value:function(){this.stopListening(),a(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"destroy",this).call(this),this._lightstreamerService=null}}]),i}(i.default)
e.default=s}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(12),r(33),r(7),r(20)],n=function(e,t,r,i,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var a=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var s=function(e){function i(e,t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,i)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i.__proto__||Object.getPrototypeOf(i)).call(this))
return r._lightstreamerService=e,r._session=t,r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(i,e),o(i,[{key:"startListening",value:function(e){return this._subscription=new r.default("V2-M-MESSAGE_EVENT_HANDLER|{identifier}-OP-JSON","OPU",this._lightstreamerService).startListening(e),this._subscription.on(r.default.Events.UPDATED,this._handleStreamingUpdate.bind(this)),this}},{key:"_handleStreamingUpdate",value:function(e){var r=e.header.contentType,i=e.body
if(r.match(/Add$/)){var o=i.openPosition.epic
if(n.default.isValidEpic(o)){var a=n.default.fromOPU(i,this._session)
this.trigger(t.default.ADDED,a)}}else r.match(/Delete$/)&&this.trigger(t.default.REMOVED,i.openPosition.dealId)}},{key:"stopListening",value:function(){this._subscription&&(this._subscription.destroy(),this._subscription=null),this.off()}},{key:"destroy",value:function(){this.stopListening(),a(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"destroy",this).call(this),this._lightstreamerService=null}}]),i}(i.default)
e.default=s}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(127),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],i=!0,n=!1,o=void 0
try{for(var a,s=e[Symbol.iterator]();!(i=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);i=!0);}catch(u){n=!0,o=u}finally{try{!i&&s.return&&s.return()}finally{if(n)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),o=Object.freeze({EPIC:"E",IG_INSTRUMENT_ID:"G",ISIN:"I",L2_INSTRUMENT_ID:"L",UV_MARKET_COMMODITY:"M",RIC:"R"}),a=function(){function e(t,n,o){var a=this;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._streamingClient=n,this._heartbeat=o,this._rdws=new Map,this._objectsToUpdate=new Set,this._objectChangeCallbacks=new Map,this._objectDestroyCallbacks=new Map,this._boundRDWUpdateCallback=function(e){return a._setRDWValues.apply(a,function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}(e))}
var s=this._heartbeat.prepare()
Promise.all([r.get("/dealing-gateway/repeat-deal-window/"+t.user.accountId,t),s]).then((function(e){var t=i(e,1)[0]
a._rdws&&t.repeatDealingEntryList&&a._processRDWRESTPayload(t.repeatDealingEntryList)})),s.then((function(){a._streamingClient&&a._streamingClient.on("rdw",a._boundRDWUpdateCallback,a)}))}return n(e,[{key:"add",value:function(e){var t=this
if(!this._objectsToUpdate.has(e)){var r=function(r){(r.includes("market")||r.includes("currency"))&&t._setRDWOnObject(e)},i=function(){return t.remove(e)}
e.on("change",r,this),e.once("destroyed",i,this),this._objectsToUpdate.add(e),this._objectChangeCallbacks.set(e,r),this._objectDestroyCallbacks.set(e,i),this._setRDWOnObject(e)}}},{key:"remove",value:function(e){return!!this._objectsToUpdate.has(e)&&(e.off("change",this._objectChangeCallbacks.get(e),this),e.off("destroyed",this._objectDestroyCallbacks.get(e),this),this._objectsToUpdate.delete(e),this._objectChangeCallbacks.delete(e),this._objectDestroyCallbacks.delete(e),(e.rdwOffer||e.rdwBid)&&e.setProperties({rdwOffer:e.rdwOffer&&e.rdwOffer.snapshot()||null,rdwBid:e.rdwBid&&e.rdwBid.snapshot()||null}),!0)}},{key:"removeAll",value:function(){this._objectsToUpdate.forEach(this.remove,this)}},{key:"getRDW",value:function(e,r,i){var n=e+"|"+r+"|"+i
if(this._rdws.has(n))return this._rdws.get(n)
var o=new t.default(this._heartbeat,[],e,r,i)
return this._rdws.set(n,o),o}},{key:"_setRDWOnObject",value:function(e){var t=e.market&&e.market.epic,r=e.currency&&e.currency.name
t&&r?e.setProperties({rdwOffer:this.getRDW(t,r,"buy"),rdwBid:this.getRDW(t,r,"sell")}):(e.rdwOffer||e.rdwBid)&&e.setProperties({rdwOffer:null,rdwBid:null})}},{key:"_setRDWValues",value:function(e,t,r,i){this.getRDW(e,t,r).setRDW(i)}},{key:"_processRDWRESTPayload",value:function(e){var t=!0,r=!1,i=void 0
try{for(var n,a=e[Symbol.iterator]();!(t=(n=a.next()).done);t=!0){var s=n.value,u=s.instrumentSource,l=s.instrumentValue,c=s.currencyList
if(u===o.EPIC&&c){var p=!0,f=!1,d=void 0
try{for(var y,h=c[Symbol.iterator]();!(p=(y=h.next()).done);p=!0){var v=y.value,g=v.currency,_=v.buy,O=v.sell
this._setRDWValues(l,g,"buy",_),this._setRDWValues(l,g,"sell",O)}}catch(b){f=!0,d=b}finally{try{!p&&h.return&&h.return()}finally{if(f)throw d}}}}}catch(b){r=!0,i=b}finally{try{!t&&a.return&&a.return()}finally{if(r)throw i}}}},{key:"destroy",value:function(){this._streamingClient&&(this._streamingClient.off("rdw",this._boundRDWUpdateCallback,this),delete this._streamingClient),this._objectsToUpdate&&(this.removeAll(),delete this._objectsToUpdate,delete this._objectChangeCallbacks,delete this._objectDestroyCallbacks),this._rdws&&(this._rdws.forEach((function(e){return e.destroy()})),this._rdws.clear(),delete this._rdws)}}]),e}()
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(5),r(15)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.BINARY_FIDS=e.KO_FIDS=e.FIDS=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var o=e.FIDS=Object.keys(t.MARKET_V4_FID_SCHEMA).filter((function(e){return"MARKET_NAME"!==e})),a=e.KO_FIDS=Object.keys(t.KO_FID_SCHEMA),s=e.BINARY_FIDS=Object.keys(t.MARKET_V4_FID_SCHEMA),u=Object.freeze(["MARKET_NAME","KO_UND_BID","KO_UND_ASK","DELTA","SWAP_1_SHORT","SWAP_1_LONG","SWAP_2_SHORT","SWAP_2_LONG","SWAP_3_SHORT","SWAP_3_LONG","SWAP_4_SHORT","SWAP_4_LONG","SWAP_5_SHORT","SWAP_5_LONG","SWAP_6_SHORT","SWAP_6_LONG","SWAP_7_SHORT","SWAP_7_LONG","SWAP_8_SHORT","SWAP_8_LONG"]),l=function(e){function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=arguments[2];(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,e,"MARKET_V4:"+i.user.accountId+":{id}{modifiers}","MERGE",t,!0))
return n._session=i,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),i(r,[{key:"add",value:function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],l=arguments[2]
if(!e.isUnpriced){var c=e.isBinary?s:o,p=t.default.getFidsForSwapRate(l,["LONG","SHORT"]),f=e.isKnockout?a:[],d=c.concat(p,f),y=this._session.user.isMTF?d.filter((function(e){return"MID"!==e})):d
this._session.featureFlags.usePriceSubscription&&(y=y.filter((function(e){return u.includes(e)}))),n(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"add",this).call(this,e.epic,y,e.boundOnStreamedV4Update,i)}}},{key:"remove",value:function(e){if(!e.isUnpriced)return n(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"remove",this).call(this,e.boundOnStreamedV4Update)}}]),r}(r.default)
e.default=l}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(47),r(3)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var o=function(e){function t(e,r){var i;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var n=arguments.length,o=Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a]
var s=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i=t.__proto__||Object.getPrototypeOf(t)).call.apply(i,[this,{},e,r.market].concat(o)))
return s.setProperties({order:r,dealId:r.dealId,isDMA:r.isDMA}),s}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_getValidators",value:function(){return[r.marketDealable]}},{key:"_submitDeal",value:function(){return this._restService.delete(this)}},{key:"toJSON",value:function(){var e={timeStamp:this.heartbeat.timestamp,dealReference:this.dealReference},t=this._session.user.broker
return t&&t.decisionMakerAccountId&&(e.decisionMakerAccountId=t.decisionMakerAccountId),e}},{key:"isMarketDealable",get:function(){var e=this.order
return e&&e.canClose()}},{key:"_validationDependentKeys",get:function(){return[].concat(function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}(n(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_validationDependentKeys",this)),["order"])}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0),r(16),r(10),r(3),r(2)],n=function(e,t,r,i,n,o){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var s,u,l=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var c,p,f,d,y,h,v=(s=(0,o.default)("order","order.stopType"),u=function(e){function r(e,t){var n;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
for(var o=arguments.length,a=Array(o>2?o-2:0),s=2;s<o;s++)a[s-2]=arguments[s]
var u=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(n=r.__proto__||Object.getPrototypeOf(r)).call.apply(n,[this,e,t.market].concat(a)))
return u.setProperties({expiryTime:t.goodTillUTCMillis,isEditTicket:!0,order:t,direction:"+"===t.direction?"buy":"sell",limitLevel:t.limitLevel,limitType:t.limitType,size:t.dealSize,triggerLevel:t.openLevel,stopStep:t.stopStep,stopTrailingDistance:t.stopTrailingDistance,stopLevel:t.stopLevel,stopLevelType:t.stopLevelType,stopType:t.stopType}),u.set("stopType",t.stopType||i.default.getFirstValidStopType(u.stopTypes)),u.order.on("change",u._onOrderChange,u),u}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),a(r,[{key:"_onOrderChange",value:function(e){var t=this.batchChangesForKeys(e,"order")
t.length&&this.trigger("change",t),e.includes("goodTillUTCMillis")&&this.set("expiryTime",this.order.goodTillUTCMillis),e.includes("limitLevel")&&this.set("limitLevel",this.order.limitLevel),e.includes("stopLevel")&&this.set("stopLevel",this.order.stopLevel)}},{key:"_getMargin",value:function(){return this.marginService.getEditOrderMargin(this)}},{key:"_getIndicativeCostsAndCharges",value:function(){return this.settings.forceExAnteOpenEndpointForEdits?this.indicativeCostsAndChargesService.getIndicativeOpenQuote(this):this.indicativeCostsAndChargesService.getIndicativeEditQuote(this)}},{key:"_getValidators",value:function(){return[n.dateBelowMin,n.direction,n.limit,n.marketDealable,n.triggerLevelWithinValidDistance,n.triggerLevelValidForOrderType,n.orderTypeLimitForOption,n.triggerLevelAboveZero,n.stop,n.stopSizeChangeAllowed,n.controlledRiskUser,n.hasLiveData]}},{key:"_submitDeal",value:function(){return this._restService.edit(this)}},{key:"toJSON",value:function(){return t.default.pick(l(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"toJSON",this).call(this),["dealReference","decisionMakerAccountId","goodTillDate","guaranteedStop","level","limitDistance","stopDistance","submittedTimestamp","timeInForce","trailingStop","trailingStopIncrement","type","quoteId"])}},{key:"destroy",value:function(){this.order.off("change",this._onOrderChange,this),l(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"destroy",this).call(this)}},{key:"stopTypes",get:function(){return i.default.getStopTypes(this.market.controlledRisk,this.market.guaranteedStopsAllowed,this.market.trailingStopsAllowedPreference,this.market.isLimitedRisk).filter((function(e){return!0===e.valid&&e.value!==i.default.Type.TRAILING}))}},{key:"openLevel",get:function(){return this.order.openLevel}},{key:"isMarketDealable",get:function(){var e=this.order
return e&&e.canEdit()}}]),r}(r.default),c=u.prototype,p="stopTypes",f=[s],d=Object.getOwnPropertyDescriptor(u.prototype,"stopTypes"),y=u.prototype,h={},Object.keys(d).forEach((function(e){h[e]=d[e]})),h.enumerable=!!h.enumerable,h.configurable=!!h.configurable,("value"in h||h.initializer)&&(h.writable=!0),h=f.slice().reverse().reduce((function(e,t){return t(c,p,e)||e}),h),y&&void 0!==h.initializer&&(h.value=h.initializer?h.initializer.call(y):void 0,h.initializer=void 0),void 0===h.initializer&&(Object.defineProperty(c,p,h),h=null),u)
e.default=v}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0),r(79),r(10),r(3),r(32),r(2),r(23)],n=function(e,t,r,i,n,o,a,s){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var u=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var l,c,p,f=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function d(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var y=(l=(0,a.default)("position","position.stopType","session"),c=(0,a.default)("position","position.latest"),p=function(e){function r(e,t,n,o,a,s){var u,l=!(arguments.length>6&&void 0!==arguments[6])||arguments[6];(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
for(var c=arguments.length,p=Array(c>7?c-7:0),f=7;f<c;f++)p[f-7]=arguments[f]
var d=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(u=r.__proto__||Object.getPrototypeOf(r)).call.apply(u,[this,{isEditTicket:!0,currency:t.currency,direction:"+"===t.direction?"buy":"sell",size:t.dealSize,limitLevel:t.limitLevel,limitType:t.limitType,position:t,stopStep:t.stopStep,stopLevel:t.stopLevel,stopLevelType:t.stopLevelType,stopTrailingDistance:t.stopTrailingDistance,canEditTrailingDistance:!0,allowGuaranteedStopRemoval:l},e,t.market,n,o,a,s].concat(p)))
return d.market&&d.market.isKnockout&&!d.knockoutLevel&&(d.knockoutLevel=t.knockoutLevel),d.set("isUS",s.user&&s.user.isUSFx||!1),d.set("stopType",t.stopType||i.default.getFirstValidStopType(d.stopTypes)),d.position.on("change",d._onPositionChange,d),d}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),u(r,[{key:"_onPositionChange",value:function(e){var t=this.batchChangesForKeys(e,"position")
t.length&&this.trigger("change",t),e.includes("stopLevel")&&this.set("stopLevel",this.position.stopLevel),e.includes("limitLevel")&&this.set("limitLevel",this.position.limitLevel),e.includes("stopType")&&this.set("stopType",this.position.stopType||this.defaultStopType)}},{key:"_getMargin",value:function(){return this.position.positions?this.marginService.getEditAggregatePositionMargin(this):this.marginService.getEditPositionMargin(this)}},{key:"_getValidators",value:function(){var e=[n.direction,n.marketDealable,n.stop,n.stopSizeChangeAllowed,n.limit,n.controlledRiskUser,n.hasLiveData]
return this.allowGuaranteedStopRemoval||e.push(n.guaranteedStopIsEmptyValidator),e}},{key:"_submitDeal",value:function(){return this._restService.edit(this)}},{key:"toJSON",value:function(){var e=this._session.user.broker,t=this.position.positions?this._toAggregatePositionJson():this._toSinglePositionJson()
return e&&e.decisionMakerAccountId&&(t.decisionMakerAccountId=e.decisionMakerAccountId),t}},{key:"_toSinglePositionJson",value:function(){var e=this.position,r=this.stopLevel,n=this.stopTrailingDistance,o=this.stopStep,a=!!(r&&n&&o),s={limitLevel:this.limitLevel,stopLevel:r,trailingStop:a&&this.stopType===i.default.Type.TRAILING,trailingStopDistance:n,trailingStopIncrement:o}
return t.default.assign({dealReference:this.dealReference,guaranteedStop:this._hasGuaranteedStop(),limitLevel:e.limitLevel,stopLevel:e.stopLevel,trailingStop:this._hasTrailingStop(),trailingStopDistance:e.stopTrailingDistance,trailingStopIncrement:e.stopStep,submittedTimestamp:this._getSubmittedTimestamp(),quoteId:this.quoteId},s)}},{key:"_toAggregatePositionJson",value:function(){var e=this.position,t=this.stopLevel,r=this.stopType,i=this.stopTrailingDistance,n=this.stopStep,o=this.limitLevel||"",a=!(!e.limitLevel||o),u=!(!e.stopLevel||t)
return{dealReference:this.dealReference,token2:"",tokenVO:"",dealLevelBid:""+e.market.bid,dealLevelOffer:""+e.market.offer,guaranteedStop:r===s.default.GUARANTEED,limitLevel:""+o,lsServerName:"",stopLevel:""+(t||""),timeStamp:this.heartbeat.timestamp,trailingStopDistance:i,trailingStopIncrement:n,trailingStop:r===s.default.TRAILING,dealIds:e.positions.map((function(e){return e.dealId})),removeLimits:a,removeStops:u,quoteId:this.quoteId}}},{key:"_getIndicativeCostsAndCharges",value:function(){return this.indicativeCostsAndChargesService.getIndicativeEditQuote(this)}},{key:"destroy",value:function(){this.position.off("change",this._onPositionChange,this),f(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"destroy",this).call(this)}},{key:"isMarketDealable",get:function(){return this.position.canEdit()}},{key:"stopTypes",get:function(){return!this.isUS&&this.position.positions?i.default.getStopTypes(this.market.controlledRisk,this.market.guaranteedStopsAllowed,this.market.trailingStopsAllowedPreference,this.market.isLimitedRisk).filter((function(e){return e.value!==i.default.Type.TRAILING})):i.default.getStopTypes(this.market.controlledRisk,!this.position.isDMA&&this.market.guaranteedStopsAllowed,!this.position.isDMA&&this.market.trailingStopsAllowedPreference,this.market.isLimitedRisk)}},{key:"roundedOpenLevel",get:function(){return Math.round(this.position.openLevel*Math.pow(10,this.market.decimalPlacesFactor))/Math.pow(10,this.market.decimalPlacesFactor)}},{key:"iccPriceLevel",get:function(){return this.roundedOpenLevel||f(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"iccPriceLevel",this)||this.position&&this.position.latest}},{key:"orderLevel",get:function(){return this.position.latest}},{key:"openLevel",get:function(){return this.position.openLevel}},{key:"minStopDistance",get:function(){if(!this.market.dealingRules)return null
var e=this.stopType
return i.default.getMinimumDistanceRuleInPoints(this.stopLevelType,e,(0,o.getMinimumDistanceFromMarket)(e,this.market),this.position.firstTierLatest,this.scalingFactor,this.position)}}]),r}(r.default),d(p.prototype,"stopTypes",[l],Object.getOwnPropertyDescriptor(p.prototype,"stopTypes"),p.prototype),d(p.prototype,"orderLevel",[c],Object.getOwnPropertyDescriptor(p.prototype,"orderLevel"),p.prototype),p)
e.default=y}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(29),r(2),r(8),r(120)],n=function(e,t,r,i,n){"use strict"
function o(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var s=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var u,l,c,p,f,d,y,h,v,g,_,O=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function b(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var m=(u=(0,r.default)("direction","referencePosition"),l=(0,r.default)("hasPositionInSameDirection","referencePosition.stopLevel"),c=(0,r.default)("hasPositionInSameDirection","referencePosition.limitLevel"),p=(0,r.default)("_stopLevel","isPositionStopUsed","referencePosition"),f=(0,r.default)("_stopStep","isPositionStopUsed","referencePosition","referencePosition.stopStep"),d=(0,r.default)("_stopType","isPositionStopUsed","referencePosition","referencePosition.stopType"),y=(0,r.default)("_stopLevelType","isPositionStopUsed","referencePosition"),h=(0,r.default)("_stopTrailingDistance","isPositionStopUsed","referencePosition","referencePosition.stopTrailingDistance"),v=(0,r.default)("_limitLevel","isPositionLimitUsed","referencePosition","referencePosition.limitLevel"),g=(0,r.default)("_limitType","isPositionLimitUsed","referencePosition","referencePosition.limitType"),_=function(e){function t(e,r,i,n,o,s,u){var l;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var c=arguments.length,p=Array(c>7?c-7:0),f=7;f<c;f++)p[f-7]=arguments[f]
var d=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(l=t.__proto__||Object.getPrototypeOf(t)).call.apply(l,[this,e,r,i,n,o,s,u].concat(p)))
return a(d,{_stopLevel:d.stopLevel,_stopStep:d.stopStep,_stopType:d.stopType,_stopLevelType:d.stopLevelType,_stopTrailingDistance:d.stopTrailingDistance,_limitLevel:d.limitLevel,_limitType:d.limitType,referencePosition:u}),d._updateReferencePositionListeners(),d}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"_onChange",value:function(e){O(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_onChange",this).call(this,e),e.includes("referencePosition")&&this._updateReferencePositionListeners()}},{key:"_updateReferencePositionListeners",value:function(){this._removeReferencePositionListener(),this.referencePosition&&(this.referencePosition.on("change",this._onReferencePositionChange,this),this._oldReferencePosition=this.referencePosition)}},{key:"_removeReferencePositionListener",value:function(){var e=this._oldReferencePosition
e&&e.off("change",this._onReferencePositionChange,this),this._oldReferencePosition=null}},{key:"_onReferencePositionChange",value:function(e){var t=[]
e.includes("stopLevel")&&t.push.apply(t,o(this.batchChangesForKeys(["referencePosition.stopLevel"]))),e.includes("limitLevel")&&t.push.apply(t,o(this.batchChangesForKeys(["referencePosition.limitLevel"]))),t.length&&this.trigger("change",t)}},{key:"toJSON",value:function(){var e=O(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"toJSON",this).call(this)
return this.isPositionStopUsed&&delete e.stopDistance,this.isPositionLimitUsed&&delete e.limitDistance,e}},{key:"destroy",value:function(){this._removeReferencePositionListener(),O(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}},{key:"hasPositionInSameDirection",get:function(){return!(!this.referencePosition||!(0,n.default)(this.direction,this.referencePosition.direction))}},{key:"isPositionStopUsed",get:function(){return!(!this.hasPositionInSameDirection||!this.referencePosition.stopLevel)}},{key:"isPositionLimitUsed",get:function(){return!(!this.hasPositionInSameDirection||!this.referencePosition.limitLevel)}},{key:"stopLevel",get:function(){return this.isPositionStopUsed?this.referencePosition.stopLevel:this._stopLevel},set:function(e){this.isPositionStopUsed||(this._stopLevel=e)}},{key:"stopStep",get:function(){return this.isPositionStopUsed?this.referencePosition.stopStep:this._stopStep},set:function(e){this.isPositionStopUsed||(this._stopStep=e)}},{key:"stopType",get:function(){return this.isPositionStopUsed?this.referencePosition.stopType:this._stopType},set:function(e){this.isPositionStopUsed||(this._stopType=e)}},{key:"stopLevelType",get:function(){return this.isPositionStopUsed?i.default.Type.ABSOLUTE:this._stopLevelType},set:function(e){this.isPositionStopUsed||(this._stopLevelType=e)}},{key:"stopTrailingDistance",get:function(){return this.isPositionStopUsed?this.referencePosition.stopTrailingDistance:this._stopTrailingDistance},set:function(e){this.isPositionStopUsed||(this._stopTrailingDistance=e)}},{key:"limitLevel",get:function(){return this.isPositionLimitUsed?this.referencePosition.limitLevel:this._limitLevel},set:function(e){this.isPositionLimitUsed||(this._limitLevel=e)}},{key:"limitType",get:function(){return this.isPositionLimitUsed?this.referencePosition.limitType:this._limitType},set:function(e){this.isPositionLimitUsed||(this._limitType=e)}}]),t}(t.default),b(_.prototype,"hasPositionInSameDirection",[u],Object.getOwnPropertyDescriptor(_.prototype,"hasPositionInSameDirection"),_.prototype),b(_.prototype,"isPositionStopUsed",[l],Object.getOwnPropertyDescriptor(_.prototype,"isPositionStopUsed"),_.prototype),b(_.prototype,"isPositionLimitUsed",[c],Object.getOwnPropertyDescriptor(_.prototype,"isPositionLimitUsed"),_.prototype),b(_.prototype,"stopLevel",[p],Object.getOwnPropertyDescriptor(_.prototype,"stopLevel"),_.prototype),b(_.prototype,"stopStep",[f],Object.getOwnPropertyDescriptor(_.prototype,"stopStep"),_.prototype),b(_.prototype,"stopType",[d],Object.getOwnPropertyDescriptor(_.prototype,"stopType"),_.prototype),b(_.prototype,"stopLevelType",[y],Object.getOwnPropertyDescriptor(_.prototype,"stopLevelType"),_.prototype),b(_.prototype,"stopTrailingDistance",[h],Object.getOwnPropertyDescriptor(_.prototype,"stopTrailingDistance"),_.prototype),b(_.prototype,"limitLevel",[v],Object.getOwnPropertyDescriptor(_.prototype,"limitLevel"),_.prototype),b(_.prototype,"limitType",[g],Object.getOwnPropertyDescriptor(_.prototype,"limitType"),_.prototype),_)
e.default=m}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default={QUOTE:"QUOTE",EXCHANGE:"EXCHANGE"}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default={RECONNECTED:"RECONNECTED"}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:5,i=void 0
isNaN(e)||isNaN(t)||0===e||(i=t/e)
isNaN(i)||parseInt(i,10)===i||(i=+i.toFixed(r))
return i}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(5)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,r,i,n,o,a){if(i&&r){if(e===t.UNITS.SHARES)return r*(n*o)*i
if(e===t.UNITS.CONTRACTS)return(a?r*n:r)*(i*o)}return null}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var t=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],i=!0,n=!1,o=void 0
try{for(var a,s=e[Symbol.iterator]();!(i=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);i=!0);}catch(u){n=!0,o=u}finally{try{!i&&s.return&&s.return()}finally{if(n)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")},r=/(\d{2})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/,i=/0?(\d\d?):?(\d\d)?(am)?/,n=(e.toUTCMillisFromAccountTime=function(e,i){var o=e&&e.match(r)
if(!o)return null
var a=t(o,6),s=a[1],u=a[2],l=a[3],c=a[4],p=a[5]
return n(l=20+l,u,s,c,p)&&c--,Date.UTC(l,u-1,s,c,p)-60*i*60*1e3},e.toAccountTimeFromLondonTime=function(e,r){var n=e.match(i)
if(!n)return null
var o=t(n,4),a=o[1],s=void 0===a?0:a,u=o[2],l=void 0===u?0:u,c=o[3]
s=+s,c&&12===s?s=0:c||12===s||(s+=12)
var p=(s=((s+=+r)+24)%24)<12?"am":"pm"
return s=s%12||12,l?s+":"+l+p:""+s+p},function(e,t,r,i,n){var o=new Date(e,t-1,r,i,n),a=new Date(e,2,24),s=new Date(e,9,24)
return a.setDate(31-a.getDay()),a.setHours(1),s.setDate(31-s.getDay()),s.setHours(2),o>=a&&o<s})}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,t,r,i,n){if(n)return 1/0
if(t=t||0,i=i||1,!e||!r)return null
return i*(+r+ +t)*e}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(0)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e){var r=parseFloat(e)
return t.default.isNaN(r)?null:r}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e){e&&(e=parseFloat(e))
return t.default.isFinite(e)&&e>0?e:null}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(9)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.canEditPosition=function(e){var r=e.market
return r.isAvailableForOnlineTrading()&&r.areEditsAndOrdersAllowed()&&[t.default.TRADEABLE,t.default.EDIT,t.default.AUCTION].includes(r.marketStatus)&&(e.isDMA?r.canTradeDMA():r.canTradeOTC())},e.canClosePosition=function(e){var r=e.market
return!e.isDMA&&r.isAvailableForOnlineTrading()&&r.marketStatus===t.default.TRADEABLE&&r.canTradeOTC()},e.canEditOrder=function(e){var r=e.market
return r.isAvailableForOnlineTrading()&&r.areEditsAndOrdersAllowed()&&[t.default.TRADEABLE,t.default.EDIT,t.default.AUCTION].includes(r.marketStatus)&&(e.isDMA?r.canTradeDMA():r.canTradeOTC())},e.canDeleteOrder=function(e){var r=e.market
return r.isAvailableForOnlineTrading()&&r.areEditsAndOrdersAllowed()&&[t.default.TRADEABLE,t.default.EDIT,t.default.AUCTION].includes(r.marketStatus)&&(e.isDMA?r.canTradeDMA():r.canTradeOTC())}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(6),r(9),r(2)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var o,a,s=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var u,l,c,p,f,d,y=(o=(0,i.default)("epic"),a=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,n({auditCount:0,displayBid:null,displayOffer:null,currencies:[],isAuditing:!1},e)))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"populateWith",value:function(e){this.setProperties(e)}},{key:"isAvailableForOnlineTrading",value:function(){var e=this.marketStatus
return e!==r.default.CLOSED&&(e!==r.default.OFFLINE&&e!==r.default.SUSPENDED)}},{key:"areEditsAndOrdersAllowed",value:function(){return!(!this.stopAllowed&&!this.limitAllowed)}},{key:"canTradeOTC",value:function(){var e="CURRENCIES"===(this.instrumentType||"").toUpperCase(),t=(this.viewPermission||"").toUpperCase()
return!(!this.otcTradeable||this.canTradeDMA()&&e&&"L2"===t)}},{key:"canTradeDMA",value:function(){return!!this.dmaTradeable}},{key:"isUnpriced",get:function(){return t.isUnpriced(this.epic)}}],[{key:"isUnpriced",value:function(e){return e===t.unpricedEpic}},{key:"unpricedEpic",get:function(){return"ZZ.Z.UNPRICED.DEAL.IP"}}]),t}(t.default),u=a.prototype,l="isUnpriced",c=[o],p=Object.getOwnPropertyDescriptor(a.prototype,"isUnpriced"),f=a.prototype,d={},Object.keys(p).forEach((function(e){d[e]=p[e]})),d.enumerable=!!d.enumerable,d.configurable=!!d.configurable,("value"in d||d.initializer)&&(d.writable=!0),d=c.slice().reverse().reduce((function(e,t){return t(u,l,e)||e}),d),f&&void 0!==d.initializer&&(d.value=d.initializer?d.initializer.call(f):void 0,d.initializer=void 0),void 0===d.initializer&&(Object.defineProperty(u,l,d),d=null),a)
e.default=y}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(6)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var n=function(e){function t(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return r.boundOnStreamedUpdate=r.onStreamedUpdate.bind(r),r.market&&r._updateMarketListeners(),r.on("change",(function(e){e.includes("market")&&r._updateMarketListeners()})),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"_updateMarketListeners",value:function(){this._removeMarketListener(),this.market&&(this.market.on("change",this._onMarketChange,this),this._oldMarket=this.market)}},{key:"_removeMarketListener",value:function(){var e=this._oldMarket
e&&e.off("change",this._onMarketChange,this),this._oldMarket=null}},{key:"_onMarketChange",value:function(e){var t=this.batchChangesForKeys(e,"market")
t.length&&this.trigger("change",t)}},{key:"isShort",value:function(){return"-"===this.direction}},{key:"isPriceTypeBackOnly",value:function(){return"B"===this.priceType}},{key:"onStreamedUpdate",value:function(){}},{key:"updateFromOther",value:function(e){if(e.dealId!==this.dealId)throw new Error("Attempted to update trade from an incompatible instance: "+this.dealId+" is different from "+e.dealId)}},{key:"destroy",value:function(){i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this),this._removeMarketListener()}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(10),r(13),r(11),r(2),r(0)],n=function(e,t,r,i,n,o){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var s,u,l,c,p,f,d,y=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function h(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var v=(s=(0,n.default)("settings","settings.showPartialFill"),u=(0,n.default)("settings","settings.showPointsThroughCurrent"),l=(0,n.default)("pointsThroughCurrent","market","bidPrice","market.scalingFactor"),c=(0,n.default)("pointsThroughCurrent","market","offerPrice","market.scalingFactor"),p=(0,n.default)("marketOrder","pointsThroughCurrent","market"),f=(0,n.default)("settings","settings.showMarketOrder","market","market.dealingRules"),d=function(e){function r(e,t,i,n,a,s,u){var l;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
var c=a.showPointsThroughCurrent&&a.rememberLastTradedPointsThroughCurrent
o.default.merge(e,{pointsThroughCurrent:c?i.lastTradedPointsThroughCurrent:null,partialFill:a.partialFill})
for(var p=arguments.length,f=Array(p>7?p-7:0),d=7;d<p;d++)f[d-7]=arguments[d]
var y=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(l=r.__proto__||Object.getPrototypeOf(r)).call.apply(l,[this,e,t,i,n,a,s,u].concat(f)))
return y.marketOrder=y._getMarketOrder(),y.isPosition=!0,y}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),a(r,[{key:"_onChange",value:function(e){y(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"_onChange",this).call(this,e),e.includes("marketOrder")&&(this.isNewJapaneseTicket?this.marketOrder&&this.set("pointsThroughCurrent",void 0):this.set("pointsThroughCurrent",void 0)),e.includes("market")&&this.set("marketOrder",this._getMarketOrder())}},{key:"_onMarketChange",value:function(e){y(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"_onMarketChange",this).call(this,e),e.includes("dealingRules")&&this.set("marketOrder",this._getMarketOrder())}},{key:"_onSettingsChange",value:function(e){y(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"_onSettingsChange",this).call(this,e),e.includes("marketOrder")&&this.set("marketOrder",this._getMarketOrder()),e.includes("partialFill")&&this.set("partialFill",this.settings.partialFill)}},{key:"_getMarketOrder",value:function(){var e=!!this.market&&this.market.dealingRules
return!!e&&"HIDE"!==e.marketOrderPreference&&this.settings.marketOrder&&this.market.marketOrderAllowed}},{key:"toString",value:function(){return i.default.POSITION}},{key:"showPartialFill",get:function(){return this.settings.showPartialFill}},{key:"showPointsThroughCurrent",get:function(){return this.settings.showPointsThroughCurrent}},{key:"stopTypes",get:function(){var e=this.market,r=e.controlledRisk,i=e.guaranteedStopsAllowed,n=e.trailingStopsAllowedPreference,o=e.isLimitedRisk
return t.default.getStopTypes(r,i,n,o)}},{key:"minBid",get:function(){var e=+this.pointsThroughCurrent/this.market.scalingFactor
return e?Math.max(this.bidPrice-e,0).toFixed(this.market.decimalPlacesFactor):null}},{key:"maxOffer",get:function(){var e=+this.pointsThroughCurrent/this.market.scalingFactor,t=+this.offerPrice,r=void 0
return r="Binary"===this.market.instrumentType?Math.min(t+e,100):t+e,e?r.toFixed(this.market.decimalPlacesFactor):null}},{key:"orderType",get:function(){return this.isNewJapaneseTicket?0===this.pointsThroughCurrent||"0"===this.pointsThroughCurrent?"QUOTE":this.pointsThroughCurrent?"LIMIT":"MARKET":this.marketOrder&&this.market.marketOrderAllowed?"MARKET":this.pointsThroughCurrent?"LIMIT":"QUOTE"}},{key:"showMarketOrder",get:function(){return"HIDE"!==this.market.dealingRules.marketOrderPreference&&this.settings.showMarketOrder}}]),r}(r.default),h(d.prototype,"showPartialFill",[s],Object.getOwnPropertyDescriptor(d.prototype,"showPartialFill"),d.prototype),h(d.prototype,"showPointsThroughCurrent",[u],Object.getOwnPropertyDescriptor(d.prototype,"showPointsThroughCurrent"),d.prototype),h(d.prototype,"minBid",[l],Object.getOwnPropertyDescriptor(d.prototype,"minBid"),d.prototype),h(d.prototype,"maxOffer",[c],Object.getOwnPropertyDescriptor(d.prototype,"maxOffer"),d.prototype),h(d.prototype,"orderType",[p],Object.getOwnPropertyDescriptor(d.prototype,"orderType"),d.prototype),h(d.prototype,"showMarketOrder",[f],Object.getOwnPropertyDescriptor(d.prototype,"showMarketOrder"),d.prototype),d)
e.default=v}.apply(t,i),void 0===n||(e.exports=n)},function(e,r){e.exports=t},function(e,t){e.exports=r},function(e,t,r){var i,n
i=[t,r(0),r(6),r(26),r(50),r(56),r(53),r(55),r(57),r(37),r(54),r(52),r(42),r(59),r(41),r(67),r(29),r(16),r(66),r(43),r(65),r(64),r(11),r(48),r(39),r(36),r(40),r(62),r(63)],n=function(e,t,r,i,n,o,a,s,u,l,c,p,f,d,y,h,v,g,_,O,b,m,T,k,P,S,E,L,w){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var D=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],i=!0,n=!1,o=void 0
try{for(var a,s=e[Symbol.iterator]();!(i=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);i=!0);}catch(u){n=!0,o=u}finally{try{!i&&s.return&&s.return()}finally{if(n)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}
var C=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),I=function(){function e(t,r,u,h){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._lightstreamerService=r,this._dealReferenceGenerator=new k.default(t.user.accountId),this._marketService=new c.default(t),this._marginService=new a.default(this._session),this._alertPriceLevelService=new p.default(t,i.default.Type.PRICE_LEVEL_ALERT),this._alertPriceChangeService=new p.default(t,i.default.Type.PRICE_CHANGE_ALERT),this._alertService=new p.default(t),this._confirmationStreamingClient=new P.default(this._lightstreamerService,this._session.user.accountId),this._heartbeat=new n.default(r),this._indicativeCostsAndChargesService=new S.default(this._session,this._heartbeat),this._v2InstrumentGroupSubscription=new f.default(r,5),this._v4InstrumentGroupSubscription=new w.default(r,5,t),this._instrumentPriceGroupSubscription=new E.default(r,5,t),this._orderGroupSubscription=new d.default(r,1),this._positionGroupSubscription=new y.default(r,1),this._settingsService=new o.default(t,h),this._positionService=new s.default(t,this._confirmationStreamingClient,this._dealReferenceGenerator),this._orderService=new l.default(t,this._confirmationStreamingClient,this._dealReferenceGenerator),this._dependenciesPromise=Promise.all([this._settingsService.getSettings(),this._heartbeat.prepare()])}return C(e,[{key:"getMarketService",value:function(){return this._marketService}},{key:"getAlertService",value:function(){return this._alertService}},{key:"getAlertPriceLevelService",value:function(){return this._alertPriceLevelService}},{key:"getAlertPriceChangeService",value:function(){return this._alertPriceChangeService}},{key:"getMarginService",value:function(){return this._marginService}},{key:"getIndicativeCostsAndChargesService",value:function(){return this._indicativeCostsAndChargesService}},{key:"getPositionService",value:function(){return this._positionService}},{key:"getOrderService",value:function(){return this._orderService}},{key:"getSettingsService",value:function(){return this._settingsService}},{key:"getHeartbeat",value:function(){return this._heartbeat}},{key:"getV2InstrumentGroupSubscription",value:function(){return this._v2InstrumentGroupSubscription}},{key:"getV4InstrumentGroupSubscription",value:function(){return this._v4InstrumentGroupSubscription}},{key:"getInstrumentPriceGroupSubscription",value:function(){return this._instrumentPriceGroupSubscription}},{key:"getOrderGroupSubscription",value:function(){return this._orderGroupSubscription}},{key:"getPositionGroupSubscription",value:function(){return this._positionGroupSubscription}},{key:"getRepeatDealWindowGroupSubscription",value:function(){return this._rdwGroupSubscription||(this._rdwGroupSubscription=new L.default(this._session,this._confirmationStreamingClient,this._heartbeat)),this._rdwGroupSubscription}},{key:"getPositionStore",value:function(){var e=s.default.getStreamingClient(this._lightstreamerService,this._session)
return new u.default(this._session,this._positionService,this._marketService,e,this._lightstreamerService)}},{key:"getOrderStore",value:function(){var e=l.default.getStreamingClient(this._lightstreamerService)
return new u.default(this._session,this._orderService,this._marketService,e,this._lightstreamerService)}},{key:"createOpenPositionTickets",value:function(e){var t=this
return this._getOpenTicketDependenciesFor(e).then((function(e){var r=D(e,2),i=r[0],n=D(r[1],2),o=n[0],a=n[1]
return i.map((function(e){return new v.default(t._positionService,e,a,o,t._dealReferenceGenerator,t._session)}))}))}},{key:"createOpenPositionTicket",value:function(e){return this.createOpenPositionTickets([e]).then(t.default.head)}},{key:"createOpenFifoPositionTicket",value:function(e,r){var i=this
return this._getOpenTicketDependenciesFor([e]).then((function(e){var t=D(e,2),n=t[0],o=D(t[1],2),a=o[0],s=o[1]
return n.map((function(e){return new h.default(i._positionService,e,s,a,i._dealReferenceGenerator,i._session,r)}))})).then(t.default.head)}},{key:"createOpenOrderTickets",value:function(e){var t=this
return this._getOpenTicketDependenciesFor(e).then((function(e){var r=D(e,2),i=r[0],n=D(r[1],2),o=n[0],a=n[1]
return i.map((function(e){return new g.default(t._orderService,e,a,o,t._dealReferenceGenerator,t._session)}))}))}},{key:"createOpenOrderTicket",value:function(e){return this.createOpenOrderTickets([e]).then(t.default.head)}},{key:"createEditPositionTickets",value:function(e){var t=this
return this._dependenciesPromise.then((function(r){var i=D(r,2),n=i[0],o=i[1]
return e.map((function(e){return new _.default(t._positionService,e,o,n,t._dealReferenceGenerator,t._session)}))}))}},{key:"createEditPositionTicket",value:function(e){return this.createEditPositionTickets([e]).then(t.default.head)}},{key:"createClosePositionTickets",value:function(e){var t=this
return this._dependenciesPromise.then((function(r){var i=D(r,2),n=i[0],o=i[1]
return e.map((function(e){return new O.default(t._positionService,e,o,n,t._dealReferenceGenerator,t._session)}))}))}},{key:"createClosePositionTicket",value:function(e){return this.createClosePositionTickets([e]).then(t.default.head)}},{key:"createEditOrderTickets",value:function(e){var t=this
return this._dependenciesPromise.then((function(r){var i=D(r,2),n=i[0],o=i[1]
return e.map((function(e){return new b.default(t._orderService,e,o,n,t._dealReferenceGenerator,t._session)}))}))}},{key:"createDeleteOrderTicket",value:function(e){return this.createDeleteOrderTickets([e]).then(t.default.head)}},{key:"createDeleteOrderTickets",value:function(e){var t=this
return this._dependenciesPromise.then((function(r){var i=D(r,2),n=i[0],o=i[1]
return e.map((function(e){return new m.default(t._orderService,e,o,n,t._dealReferenceGenerator,t._session)}))}))}},{key:"createEditOrderTicket",value:function(e){return this.createEditOrderTickets([e]).then(t.default.head)}},{key:"switchTicket",value:function(e,t){var r=e.market,i=e.toString(),n=void 0
if(i===t)return Promise.resolve(e)
switch(t){case T.default.ORDER:n=this.createOpenOrderTicket(r)
break
case T.default.POSITION:n=this.createOpenPositionTicket(r)
break
default:n=i===T.default.POSITION?this.createOpenOrderTicket(r):this.createOpenPositionTicket(r)}return n.then((function(t){return t.allowsForStopType(e.stopType)&&t.setProperties({stopLevel:e.stopLevel,stopLevelType:e.stopLevelType,stopType:e.stopType,stopStep:e.stopStep}),t.setProperties({currency:e.currency,direction:e.direction,limitLevel:e.limitLevel,limitType:e.limitType,size:e.size,shouldUpdateFieldsOnSettingsChange:e.shouldUpdateFieldsOnSettingsChange}),t}))}},{key:"_getOpenTicketDependenciesFor",value:function(e){return Promise.all([r.default.isModel(e[0])?Promise.resolve(e):this._marketService.findByEpics(e),this._dependenciesPromise])}},{key:"getTicketDependencies",value:function(){return{dependenciesPromise:this._dependenciesPromise,dealReferenceGenerator:this._dealReferenceGenerator,confirmationClient:this._confirmationStreamingClient,session:this._session}}},{key:"destroy",value:function(){var e=this
this._dependenciesPromise.then((function(t){D(t,2)[1].destroy()
for(var r=["_positionService","_orderService","_settingsService","_confirmationStreamingClient","_v2InstrumentGroupSubscription","_v4InstrumentGroupSubscription","_instrumentPriceGroupSubscription","_rdwGroupSubscription","_orderGroupSubscription","_positionGroupSubscription"],i=0;i<r.length;i++){var n=r[i]
e[n]&&(e[n].destroy(),e[n]=null)}}))}}]),e}()
e.default=I}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,t,r,i,n){return+(e/t/n/r).toFixed(i)}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100
return e*(1-t/100)}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e){var t=e.buyPrice,r=e.sellPrice
if(null===t&&null===r)return!1
return(t=t||0)-(r=r||0)>.1*t||0===t||0===r}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
function t(e){var t=void 0
return 0===e.length?t="empty":/^\d*$/.test(e)?e.length<8||e.length>9?t="length":"123456782"!==e&&function(e){for(var t=[10,7,8,4,6,3,5,2,1],r=parseInt(e,10),i=t.length-1,n=0;i>=0;)n+=t[i]*(r%10),8===e.length&&8===i?i-=2:i--,r=Math.floor(r/10)
return n%11==0}(e)||(t="other"):t="character",t?{isValid:!1,error:{key:t}}:{isValid:!0}}function r(e){return["000000000","00000000","333333333","444444441","444444442","555555555","666666666","777777777","888888888","987654321"].includes(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.isValid=t,e.isExempt=r,e.default={isValid:t,isExempt:r}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
e.default=function e(t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this.currentAccountId=null,this.decisionMakerAccountId=null,this.accounts=t}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
e.default=function e(t,r,i,n){var o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"",s=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"deal",u=arguments.length>7&&void 0!==arguments[7]?arguments[7]:"",l=arguments.length>8&&void 0!==arguments[8]?arguments[8]:"";(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this.origin=t||"",this.path=s,this.applicationType=r,this.deviceType=o,this.platform=i,this.view=a,this.version=n,this.component=u,this.componentVersion=l,Object.freeze(this)}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
e.default=function e(t,r){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this.environment=t,this.user=r,this.featureFlags=i,Object.freeze(this)}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(0),r(35)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var a=function(e){function a(e,n){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,a)
var o=t.without.apply(void 0,[Object.keys(r.defaultSettings)].concat(function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}(Object.keys(e)))),s=o.reduce((function(e,t){return e[t]=n[t],e}),{}),u=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,i({},s,e)))
return u._globalSettingsKeys=o,u._globalSettings=n,u._globalSettings.on("change",u._onGlobalSettingsChange,u),u}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(a,e),n(a,[{key:"_onGlobalSettingsChange",value:function(e){var r=(0,t.intersection)(e,this._globalSettingsKeys),i=r.length
if(i){for(var n={},o=0;o<i;o++){var a=r[o]
n[a]=this._globalSettings[a]}this.setProperties(n)}}},{key:"destroy",value:function(){this._globalSettings.off("change",this._onGlobalSettingsChange,this),o(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),"destroy",this).call(this)}}]),a}(r.default)
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var t=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),r=function(){function e(t,r,i,n,o,a,s,u,l,c,p){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),Object.defineProperties(this,{accountId:{value:t,enumerable:!0,writable:!1},ssoToken:{value:r,enumerable:!0,writable:!1},cstToken:{value:i,enumerable:!0,writable:!1},locale:{value:n,enumerable:!0,writable:!1},siteId:{value:o,enumerable:!0,writable:!1},siteType:{value:a,enumerable:!0,writable:!1},productCode:{value:s,enumerable:!0,writable:!1},igCompany:{value:u,enumerable:!0,writable:!1},assetClass:{value:l,enumerable:!0,writable:!1},isRetailAccount:{value:c,enumerable:!0,writable:!1},clientId:{value:p,enumerable:!0,writable:!1},broker:{value:null,enumerable:!0,writable:!0}}),Object.seal(this)}return t(e,[{key:"isUSFx",get:function(){return"usa"===this.siteId}},{key:"isCFD",get:function(){return"CFD"===this.siteType}},{key:"isSpreadbet",get:function(){return"SPREAD_BET"===this.siteType}},{key:"isOptions",get:function(){return"IGFUTOPT"===this.productCode}},{key:"isFifo",get:function(){return["usa","usi"].includes(this.siteId)}},{key:"isMTF",get:function(){return"PHYSICAL"===this.siteType&&"MTFTURBO"===this.productCode}}]),e}()
e.default=r}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(37),r(131),r(132),r(133)],n=function(e,t,r,i,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var a=function(e){function t(e,r,i,n){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,r,i))
return o._lsServerName=n,o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"delete",value:function(e){return new r.default(e,this._session,this._confirmationStreamingClient,this._lsServerName)}},{key:"edit",value:function(e){return new i.default(e,this._session,this._confirmationStreamingClient)}},{key:"close",value:function(e){return new n.default(e,this._session,this._confirmationStreamingClient)}},{key:"lightstreamerServerAddress",get:function(){return this._lsServerName}}]),t}(t.default)
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(7),r(149),r(0)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function(e){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:15e3;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))
return i.debounceTime=r,i.lightstreamerService=e,i.subscriptions={},i}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"_handleMarketUpdate",value:function(e){this.trigger(e)}},{key:"add",value:function(e,n){if(!this.subscriptions[e]){var o=t.generateEventName(e),a=new r.default(this.lightstreamerService)
n.length&&(n.forEach((function(e){return a.add(e)})),this.subscriptions[e]=a,a.on(r.default.UPDATE_EVENT,i.default.debounce(this._handleMarketUpdate.bind(this,o),this.debounceTime),this))}}},{key:"remove",value:function(e){this.subscriptions[e]&&(this.subscriptions[e].destroy(),this.subscriptions[e]=null)}},{key:"destroy",value:function(){var e=this
Object.keys(this.subscriptions).forEach((function(t){e.remove(t)})),this.off()}}],[{key:"generateEventName",value:function(e){return"watchlist-change-"+i.default.kebabCase(e)}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(1),r(0)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),o=function(){function e(t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t}return n(e,[{key:"queryApi",value:function(e,n,o,a){var s=i({},e,{fields:encodeURIComponent(n.join(",")),includes:encodeURIComponent(o.join(",")),sort:encodeURIComponent(e.sort||a.join(",")),pageSize:e.pageSize||1e3}),u=r.default.pickBy(s),l="/findergateway/v2/instruments"+this.createUrlParams(u)
return t.get(l,this._session)}},{key:"queryApiWithInstrumentType",value:function(e,n,o,a,s){var u=i({},e,{fields:encodeURIComponent(n.join(",")),includes:encodeURIComponent(o.join(",")),instrumentType:s||"",sort:encodeURIComponent(e.sort||a.join(",")),pageSize:e.pageSize||1e3}),l=r.default.pickBy(u),c="/findergateway/v2/instruments"+this.createUrlParams(l)
return t.get(c,this._session)}},{key:"createUrlParams",value:function(e){return"?"+Object.keys(e).map((function(t){return t+"="+e[t]})).join("&")}}]),e}()
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(154)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i="function"==typeof t.get?t:t.default&&"function"==typeof t.default.get?t.default:(console.warn("Could not import js-cookie, using a dummy implementation"),Object.freeze({get:function(){return null},set:function(){}})),n=function(){function e(t,r){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._deprecatedLocalStorageKey=r,this._localStorageKey=this._session.user.accountId+"_"+r,this._migrationCookieKey=this._localStorageKey+"_awsMigration"}return r(e,[{key:"getData",value:function(){var e=this._getLocalStorageItem()
return e||(e=this._getMigrateCookie(),localStorage.setItem(this._localStorageKey,e)),JSON.parse(e||"{}")[this._session.user.accountId]||null}},{key:"setData",value:function(e){var t=JSON.stringify(function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}({},this._session.user.accountId,e))
localStorage.setItem(this._localStorageKey,t),this._setMigrateCookie(t)}},{key:"_getLocalStorageItem",value:function(){return localStorage.getItem(this._localStorageKey)||localStorage.getItem(this._deprecatedLocalStorageKey)}},{key:"_getMigrateCookie",value:function(){return i.get(this._migrationCookieKey)}},{key:"_setMigrateCookie",value:function(e){i.set(this._migrationCookieKey,e,{domain:"ig.com",expires:365})}}]),e}()
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(134),r(135),r(136),r(1)],n=function(e,t,r,i,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),a=function(){function e(t,r,i){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._confirmationStreamingClient=r,this._dealReferenceGenerator=i}return o(e,[{key:"create",value:function(e){return new t.default(e,this._session,this._confirmationStreamingClient)}},{key:"edit",value:function(e){return new i.default(e,this._session,this._confirmationStreamingClient)}},{key:"delete",value:function(e){return new r.default(e,this._session,this._confirmationStreamingClient)}},{key:"getEstimatedCharges",value:function(e){var t="/"+this._session.environment.path+"/orders/considerations/estimatecharges",r={currencyCode:e.currency.name,direction:e.direction.toUpperCase(),epic:e.market.epic,size:e.size}
return"LIMIT"===e.orderType||"STOP_LIMIT"===e.orderType?r.level=e.triggerLevel:"STOP_MARKET"===e.orderType?r.level=e.stopPrice:"MARKET"===e.orderType?r.level=e.priceWithTolerance:"buy"===e.direction?r.level=e.market.offer:r.level=e.market.bid,n.post(t,this._session,r)}}]),e}()
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(1),r(0),r(14)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),a=function(){function e(t,r){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1e4;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._lightstreamerService=t,this._session=r,this._subscriptionString="V2-M-MESSAGE_EVENT_HANDLER|QMS_"+r.user.accountId,this._listeners={},this._pollTimeoutIds={},this._pollTimeout=i,this._startListening(this._subscriptionString)}return o(e,[{key:"getQuote",value:function(e,o){var a=this,s=i.default.isConsideration(e.sizeUnit),u="/"+o.environment.path+"/stockbroking/"+(s?"consideration":"")+"quote",l={dealReference:e.quoteDealReference,direction:e.direction.toUpperCase(),epic:e.market.epic},c={isoCurrencyCode:e.currency.name,size:e.size,submittedTimestamp:e.heartbeat.timestamp},p={considerationAmount:e.size,considerationCurrencyCode:e.sizeUnit===i.default.VALUE?e.considerationCurrency:e.currency.name,orderLevel:e.openLevel,tradeCurrencyCode:e.currency.name,submittedTimestamp:e.heartbeat.timestamp/1e3},f=n({},l,s?p:c),d="/"+o.environment.path+"/stockbroking/quote/"+e.quoteDealReference
return new Promise((function(i,n){var s=(0,r.curry)((function(t,r){a._clearPoll(e.quoteDealReference),delete a._listeners[e.quoteDealReference],t(r)}))
a._listeners[e.quoteDealReference]={resolve:s(i),reject:s(n)},t.post(u,o,f).then((function(){a._listeners[e.quoteDealReference]&&a._schedulePoll(s(n),0,a._pollTimeout,e.quoteDealReference,d)})).catch((function(t){delete a._listeners[e.quoteDealReference],n(t)}))}))}},{key:"destroy",value:function(){this._stopListening(),this._clearAllPolls()}},{key:"_stopListening",value:function(){this._subscription&&(this._subscription.unsubscribe(),this._subscription=null)}},{key:"_clearAllPolls",value:function(){var e=this
Object.keys(this._pollTimeoutIds).forEach((function(t){clearTimeout(e._pollTimeoutIds[t])})),this._pollTimeoutIds={}}},{key:"_clearPoll",value:function(e){this._pollTimeoutIds[e]&&(clearTimeout(this._pollTimeoutIds[e]),delete this._pollTimeoutIds[e])}},{key:"_startListening",value:function(e){this._subscription=this._lightstreamerService.subscribe(e,["update"],"RAW",this._handleLightstreamerMessage.bind(this))}},{key:"_handleLightstreamerMessage",value:function(e){var t=e.getValue("update")
if("INV"!==t){var r=JSON.parse(t)
this._resolveOrReject(r)}}},{key:"_resolveOrReject",value:function(e){var t=this._listeners[e.content.requestId]
t&&("QUOTE"===e.category?t.resolve(e):"QUOTE_REJECTED"===e.category&&t.reject(e))}},{key:"_schedulePoll",value:function(e,t,r,i,n){var o=this
this._pollTimeoutIds[i]=setTimeout((function(){delete o._pollTimeoutIds[i],o._poll(e,t,i,n)}),r)}},{key:"_poll",value:function(e,r,i,n){var o=this
t.get(n,this._session).then(this._resolveOrReject.bind(this)).catch((function(){var t=void 0,a=void 0;++r>=7?e("RETRY_COUNT_EXCEEDED"):(a=.4*(t=o._pollTimeout*Math.pow(1.3,r)),t=t+Math.random()*a-.5*a,o._schedulePoll(e,r,t,i,n))}))}}]),e}()
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(5),r(1),r(0)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),a=function(){function e(t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t}return o(e,[{key:"getDerivativesForUnderlying",value:function(e){var t=this
return this._get("/findergateway/v2/derivatives?q="+encodeURIComponent(e)).then((function(e){return t.enrichSearchMarkets(e)}))}},{key:"getDerivativesForMarket",value:function(e){var t=this
return this._get("/findergateway/v2/derivatives/contract?q="+encodeURIComponent(e)).then((function(e){return t.enrichSearchMarkets(e)}))}},{key:"search",value:function(e,t){var r=this
return(t=t||{}).q=encodeURIComponent(e),this._get("/findergateway/search/global"+this.createUrlParams(t)).then((function(e){return r.enrichSearchMarkets(e)}))}},{key:"v1Search",value:function(e,t){return this.getUnderlyingInstruments(n({},t,{searchTerm:encodeURIComponent(e),includes:["permissionStatus","marketSnapshotData"]}))}},{key:"inlineSearch",value:function(e){return this._get("/findergateway/inline?q="+encodeURIComponent(e))}},{key:"getBinariesForUnderlying",value:function(e){return this._get("/findergateway/binaries?q="+encodeURIComponent(e))}},{key:"getUnderlyingInstruments",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]
return this.queryApi(e,["epic","underlyingId","underlyingName","name","knockoutType","baseCurrency","bloombergCode","availableForTrade","instrumentType"],["marketSnapshotData"],r).then((function(e){return t.enrichSearchInstruments(e)}))}},{key:"getCategory",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],i=n({distinct:!0,category:e},arguments[2])
return this.queryApi(i,["referenceEpic","underlyingName"],["referenceMarketSnapshotData"],r).then((function(e){return t.enrichSearchInstruments(e)}))}},{key:"queryApi",value:function(e,t,r){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],a=n({},e,{fields:encodeURIComponent(t.join(",")),includes:encodeURIComponent(e.includes||r.join(",")),sort:encodeURIComponent(e.sort||o.join(",")),pageSize:e.pageSize||1e3}),s=i.default.pickBy(a),u="/findergateway/v2/instruments"+this.createUrlParams(s)
return this._get(u)}},{key:"enrichSearchInstruments",value:function(e){var r=e.results.instruments
r=r.map((function(e){var r={marketSnapshotData:e.marketSnapshotData||e.referenceMarketSnapshotData,permissionStatus:e.permissionStatus}
return r.id=e.epic,r.epic=e.epic||e.referenceEpic,r.referenceEpic=e.referenceEpic,r.instrumentName=e.name,r.underlyingName=e.underlyingName,r.underlyingId=e.underlyingId,r.knockoutType=e.knockoutType,r.baseCurrency=e.baseCurrency,r.bloombergCode=e.bloombergCode,r.availableForTrade=e.availableForTrade,r.instrumentType=e.instrumentType,t.default.populateWithMarketLiteData(r)}),this),e.results.instruments=r
var n=e.filters||[]
return n=n.map((function(e){return e.all=e.fullList,i.default.pick(e,["displayName","key","lookupKey","shortList","all"])})),e.filters=n,e}},{key:"enrichSearchMarkets",value:function(e){var r=e.markets||e.results.markets
return r=r.map((function(e){var r=e.market
return r.epic=e.epic,r.lastSelectedEpic=e.lastSelectedEpic,r.instrumentName=e.instrumentName,r.underlyingName=e.underlyingName,r.underlyingId=e.underlyingId,r.knockoutType=e.knockoutType,r.id=e.id,r=r.instrumentData?t.default.populateWithV2MarketData(r):t.default.populateWithMarketLiteData(r)}),this),e.markets?e.markets=r:e.results.markets=r,e}},{key:"_get",value:function(e){return r.get(e,this._session,!1,{"IG-ACCOUNT-ID":this._session.user.accountId})}},{key:"createUrlParams",value:function(e){return e?"?"+Object.keys(e).map((function(t){return t+"="+e[t]})).join("&"):""}}]),e}()
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(145),r(144),r(146),r(147),r(143),r(1),r(14)],n=function(e,t,r,i,n,o,a,s){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var u=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),l=function(){function e(t,r,i,n){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._confirmationStreamingClient=r,this._dealReferenceGenerator=i,this._quoteService=n}return u(e,[{key:"getQuote",value:function(e){return this._quoteService.getQuote(e,this._session)}},{key:"getCharges",value:function(e){var t=e.sizeUnit!==s.default.QUANTITY,r=e.effectiveLevel||e.currentMarketLevel,i={currencyCode:e.currency.name,direction:e.direction.toUpperCase(),epic:e.market.epic,level:r,size:e.size},n={considerationAmount:e.size,considerationCurrencyCode:e.sizeUnit===s.default.VALUE?e.considerationCurrency:e.currency.name,direction:e.direction.toUpperCase(),epic:e.market.epic,orderLevel:r,tradeCurrencyCode:e.currency.name},o=t?"estimateordersize":"estimatecharges",u=t?n:i,l="/"+this._session.environment.path+"/orders/considerations/"+o
return a.post(l,this._session,u)}},{key:"createQuoteOrder",value:function(e){return new r.default(e,this._session,this._confirmationStreamingClient)}},{key:"createExchangeOrder",value:function(e){return new o.default(e,this._session,this._confirmationStreamingClient)}},{key:"editOrder",value:function(e){return new i.default(e,this._session,this._confirmationStreamingClient)}},{key:"editPosition",value:function(e){return new n.default(e,this._session,this._confirmationStreamingClient)}},{key:"deleteOrder",value:function(e){return new t.default(e,this._session,this._confirmationStreamingClient)}}]),e}()
e.default=l}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),n=function(){function e(t,r){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._settings={},this._localForceOpenSettingCache=r}return i(e,[{key:"getPreferences",value:function(){var e=this
return r.get("/usermanagement/preferences/DEAL",this._session,!0).then((function(r){return e._settings=t.default.cloneDeep(r),e._localForceOpenSettingCache.setData(r.forceOpen),r})).catch((function(){var t=e._localForceOpenSettingCache.getData()
return"boolean"==typeof t?{forceOpen:t}:{}}))}},{key:"getModifiedProperties",value:function(e){var r=this
return t.default.pickBy(e,(function(t,i){return r._settings[i]!==e[i]}))}},{key:"setPreferences",value:function(e){var i=this,n=this.getModifiedProperties(e)
return"boolean"==typeof n.forceOpen&&this._localForceOpenSettingCache.setData(n.forceOpen),r.put("/usermanagement/preferences/DEAL",this._session,n).then((function(){t.default.assign(i._settings,n)}))}}]),e}()
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(129),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),n=function(){function e(t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._session=t,this._requestHeaders={"IG-ACCOUNT-ID":t.user.accountId}}return i(e,[{key:"createWatchlist",value:function(e){var i="/"+this._session.environment.path+"/markets/watchlists"
return r.post(i,this._session,{name:e},this._requestHeaders).then((function(r){var i=r.watchlistId
if("SUCCESS_CREATED"!==r.status)throw new Error("Watchlist creating was unsuccessful")
return t.default.fromDealingRestWatchlist({id:i,name:e,count:0,editable:!0,deleteable:!0})}))}},{key:"deleteWatchlist",value:function(e){if(!e.deleteable)return Promise.reject(new Error("Cannot remove non-deleteable watchlist"))
var t="/"+this._session.environment.path+"/markets/watchlists/"+e.id
return r.del(t,this._session,null,this._requestHeaders)}},{key:"renameWatchlist",value:function(e,t){return e.editable?r.put("/"+this._session.environment.path+"/markets/watchlists/"+e.id,this._session,{name:t},this._requestHeaders):Promise.reject(new Error("Cannot rename non-editable watchlist"))}},{key:"getWatchlists",value:function(){var e="/"+this._session.environment.path+"/markets/watchlists"
return r.get(e,this._session,!1,this._requestHeaders).then((function(e){return e.map(t.default.fromDealingRestWatchlist)}))}},{key:"addMarketToWatchlist",value:function(e,t){if(!e.editable)return Promise.reject(new Error("Cannot add to non-editable watchlist"))
var i="/"+this._session.environment.path+"/markets/watchlists/"+e.id
return r.post(i,this._session,{epicId:t},this._requestHeaders)}},{key:"removeMarketFromWatchlist",value:function(e,t){if(!e.editable)return Promise.reject(new Error("Cannot remove from non-editable watchlist"))
var i="/"+this._session.environment.path+"/markets/watchlists/"+e.id+"/"+t
return r.del(i,this._session,null,this._requestHeaders)}},{key:"persistMarketOrder",value:function(e,t){var i="/"+this._session.environment.path+"/markets/watchlists/"+e.id
return r.put(i,this._session,{epics:t},this._requestHeaders)}}]),e}()
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(42)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"add",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments[2]
i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"add",this).call(this,e,r.concat("ADT_LIMIT"),n),e.setProperties({auditCount:0,isAuditing:!0})}},{key:"remove",value:function(e){var r=i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"remove",this).call(this,e)
return r||e.set("isAuditing",!1),r}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(15)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var n="CI.U.GBPGBP.IP",o=function(e){function t(e,r){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,"V2-F-{fids}{modifiers}|{id}","MERGE",i))
return n._currentAccountCurrencyFid=r,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"add",value:function(e,r,o){e!==n&&i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"add",this).call(this,e,["OFR"],r),this._currentAccountCurrencyFid!==n&&i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"add",this).call(this,this._currentAccountCurrencyFid,["OFR"],o)}},{key:"remove",value:function(e,r){var n=i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"remove",this).call(this,r),o=i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"remove",this).call(this,e)
return n&&o}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(40)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"add",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]
i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"add",this).call(this,e,r),e.setProperties({auditCount:0,isAuditing:!0})}},{key:"remove",value:function(e){var r=i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"remove",this).call(this,e)
return r||e.set("isAuditing",!1),r}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0),r(39),r(151)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function(e){function r(e,t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
var i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,e,t))
return i._removeListenersImmediately=!1,i}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),n(r,[{key:"getListener",value:function(e,t,r){return new i.default(e,t,r,this.removeListeners.bind(this))}},{key:"removeListeners",value:function(e){var r=t.default.filter(this._listeners,(function(t){return t.dealReference===e}))
this._listeners=t.default.difference(this._listeners,r)}}]),r}(r.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(12),r(33),r(7)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var a=function(e){function i(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,i)
var t=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i.__proto__||Object.getPrototypeOf(i)).call(this))
return t._lightstreamerService=e,t}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(i,e),n(i,[{key:"startListening",value:function(e){return this._subscription=new r.default("V2-M-MESSAGE_EVENT_HANDLER|SIGNAL_CENTRE_{identifier}","MSG",this._lightstreamerService).startListening(e),this._subscription.on(r.default.Events.UPDATED,this._handleStreamingUpdate.bind(this)),this}},{key:"_handleStreamingUpdate",value:function(e){var r=e.status
"REMOVE"===r?this.trigger(t.default.REMOVED,e.signalId):"NEW"===r&&this.trigger(t.default.UPDATED,e)}},{key:"stopListening",value:function(){this._subscription&&(this._subscription.destroy(),this._subscription=null),this.off()}},{key:"destroy",value:function(){this.stopListening(),o(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"destroy",this).call(this),this._lightstreamerService=null}}]),i}(i.default)
e.default=a}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0),r(43),r(34),r(3),r(2),r(25),r(17),r(9)],n=function(e,t,r,i,n,o,a,s,u){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var c=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var p,f,d,y,h,v,g,_=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function O(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var b=Object.freeze({0:"GoodForDay",1:"GoodTillCancelled",3:"ExecuteAndEliminate",4:"FillOrKill",6:"GoodForDay",X:"GoodForDayAllSessions"}),m=Object.freeze({1:"Market",2:"MarketLimit",3:"MarketStop",4:"MarketLimit",5:"MarketLimit",7:"MarketLimit",8:"MarketLimit",9:"MarketLimit",A:"MarketLimit",B:"MarketLimit",C:"Market",D:"MarketLimit",E:"MarketLimit",F:"MarketLimit"}),T=(p=(0,o.default)("market","market.dmaMarketData","market.marketStatus","isSell"),f=(0,o.default)("_orderType","position.dmaOrderType"),d=(0,o.default)("_timeInForce","position.dmaTimeInForce"),y=(0,o.default)("_orderType"),h=(0,o.default)("isSell","bidPrice","offerPrice","triggerLevel"),v=(0,o.default)("market","market.marketStatus"),g=function(e){function r(e,t){var i;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
for(var n=arguments.length,o=Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a]
var s=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i=r.__proto__||Object.getPrototypeOf(r)).call.apply(i,[this,e,t].concat(o)))
return s.setProperties({position:t,size:t.dealSize,direction:"+"===t.direction?"sell":"buy",isDMA:t.isDMA,_orderType:null,_timeInForce:null,hasOrderFields:!1,updateInitialDMAOrderTypesAndExpiries:!1}),t.isDMA||s.setInitialOrderTypeAndExpiry(),s}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),c(r,[{key:"_getValidators",value:function(){return[n.direction,n.marketDealable,n.sizeBelowMax,n.sizeAboveZero,n.stopPriceRightSideOfBidOfferPriceForDMATicket,n.triggerLevelAboveZeroForNonMarketOrder,n.triggerLevelDmaCorrectIncrementTick]}},{key:"_onChange",value:function(e){_(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"_onChange",this).call(this,e),(e.includes("_orderType")||e.includes("triggerLevel")||e.includes("_timeInForce"))&&this._updateMargin()}},{key:"_onMarketChange",value:function(e){_(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"_onMarketChange",this).call(this,e),this.updateInitialDMAOrderTypesAndExpiries&&e.includes("dmaMarketData")&&this.market.dmaMarketData&&(this.set("updateInitialDMAOrderTypesAndExpiries",!1),this.setInitialOrderTypeAndExpiry())}},{key:"_getMargin",value:function(){return this.marginService.getClosePositionMargin(this)}},{key:"setInitialOrderTypeAndExpiry",value:function(){var e=this.settings.rememberLastTradedOrderTypeAndExpiry,t=(0,a.getFirstValidDMAOrderTypeFromMarketData)(this.availableOrderTypeAndExpiryValues,e,this.market.lastTradedOrderType,this.market.defaultOrderType),r=(0,a.getFirstValidOrderExpiry)(this.availableOrderTypeAndExpiryValues,t,e,this.market.lastTradedOrderExpiry,this.market.defaultOrderExpiry)
this.setProperties({orderType:t.orderType,timeInForce:r,hasOrderFields:!0})}},{key:"checkForValidOrderTypeAndExpiry",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0]
if(!this.position||!this.market.dmaMarketData||!this.orderType&&!this.timeInForce)return!0
var t=(0,a.getValidExpiries)(this.availableOrderTypeAndExpiryValues,this.orderType),r=t.includes(this.timeInForce)
return!r&&e?(this.set("timeInForce",t[0]),!0):r}},{key:"getFirstDmaPositionFromAggregate",value:function(){return this.position.positions.find((function(e){return e.isDMA}))}},{key:"_submitDeal",value:function(){return this._restService.close(this)}},{key:"_updatePerMarketSettings",value:function(){}},{key:"toJSON",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=this.position,o=_(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"toJSON",this).call(this),a=void 0
a=e?t.default.pick(o,["currencyCode","dealReference","dealTicketMargin","marginCurrency","quoteId","submittedTimestamp"]):t.default.pick(o,["dealTicketMargin","dealReference"])
var s=this._session.user.broker
s&&s.decisionMakerAccountId&&(a.decisionMakerAccountId=s.decisionMakerAccountId)
var u={lsServerName:this._restService.lightstreamerServerAddress,orderLevel:this.orderLevel,orderSize:this.size,orderType:this.orderType,pricePreference:this.direction.toUpperCase(),timeInForce:this.timeInForce,timeStamp:+this._getSubmittedTimestamp(),dealReference:a.dealReference},c={dealId:n.dealId,direction:this.direction.toUpperCase(),epic:n.market.epic,orderLevel:this.orderLevel,orderSize:this.size,orderType:this.orderType,pricePreference:this.direction.toUpperCase(),timeInForce:this.timeInForce}
if(n instanceof i.default){var p=n.positions
e?(delete c.dealId,c.dealIds=p.map((function(e){return e.dealId}))):(u.epic=n.market.epic,u.direction="+"===n.direction?"-":"+",u.currencyCode=o.currencyCode)}return l({},a,e?c:u)}},{key:"toMarginJSON",value:function(){return this.toJSON(!0)}},{key:"_getIndicativeCostsAndCharges",value:function(){return this.indicativeCostsAndChargesService.getIndicativeCloseQuote(this)}},{key:"destroy",value:function(){_(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"destroy",this).call(this)}},{key:"_validationDependentKeys",get:function(){var e=_(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"_validationDependentKeys",this)
return this.hasOrderFields&&e.push("orderType","triggerLevel","timeInForce"),e}},{key:"availableOrderTypeAndExpiryValues",get:function(){if(this.market.dmaMarketData)return(0,a.getValidDMAOrderTypesFromMarketData)(this.market.dmaMarketData.orderTypesAvailable,this.isSell,this.market.marketStatus,null,!1)}},{key:"orderType",get:function(){if(this.position){if(this._orderType)return this._orderType
var e=this.position
if(e instanceof i.default){var t=this.getFirstDmaPositionFromAggregate()
return t?m[t.dmaOrderType]:void 0}return m[e.dmaOrderType]}},set:function(e){this.set("_orderType",e),this.checkForValidOrderTypeAndExpiry(!0)}},{key:"timeInForce",get:function(){if(this.position){if(this._timeInForce)return this._timeInForce
var e=this.position
if(e instanceof i.default){var t=this.getFirstDmaPositionFromAggregate()
return t?b[t.dmaTimeInForce]:void 0}return b[e.dmaTimeInForce]}},set:function(e){this.set("_timeInForce",e)}},{key:"ignoreOrderLevel",get:function(){return this.orderType===s.default.MARKET}},{key:"orderLevel",get:function(){return this.orderType===s.default.MARKET?this._calculateMarketLevel():this.triggerLevel}},{key:"isMarketDealable",get:function(){return[u.default.TRADEABLE,u.default.AUCTION,u.default.CLOSE_ONLY].includes(this.market.marketStatus)}},{key:"iccDirection",get:function(){return this.direction}}]),r}(r.default),O(g.prototype,"availableOrderTypeAndExpiryValues",[p],Object.getOwnPropertyDescriptor(g.prototype,"availableOrderTypeAndExpiryValues"),g.prototype),O(g.prototype,"orderType",[f],Object.getOwnPropertyDescriptor(g.prototype,"orderType"),g.prototype),O(g.prototype,"timeInForce",[d],Object.getOwnPropertyDescriptor(g.prototype,"timeInForce"),g.prototype),O(g.prototype,"ignoreOrderLevel",[y],Object.getOwnPropertyDescriptor(g.prototype,"ignoreOrderLevel"),g.prototype),O(g.prototype,"orderLevel",[h],Object.getOwnPropertyDescriptor(g.prototype,"orderLevel"),g.prototype),O(g.prototype,"isMarketDealable",[v],Object.getOwnPropertyDescriptor(g.prototype,"isMarketDealable"),g.prototype),g)
e.default=T}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(47),r(3)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(e,r){var i;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var n=arguments.length,o=Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a]
var s=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i=t.__proto__||Object.getPrototypeOf(t)).call.apply(i,[this,{},e,r.market].concat(o)))
return s.set("order",r),s.set("dealId",r.dealId),s}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_getValidators",value:function(){return[r.marketDealable]}},{key:"_submitDeal",value:function(){return this._restService.delete(this)}},{key:"toJSON",value:function(){return{timeStamp:this.heartbeat.timestamp,dealReference:this.dealReference}}},{key:"isMarketDealable",get:function(){var e=this.order
return e&&e.canClose()}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(13),r(3),r(11)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function(e){function t(e,r){var i;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var n=arguments.length,o=Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a]
return function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i=t.__proto__||Object.getPrototypeOf(t)).call.apply(i,[this,{order:r,dealId:r.dealId},e,r.market].concat(o)))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"_getValidators",value:function(){return[r.marketDealable]}},{key:"toString",value:function(){return i.default.ORDER}},{key:"_submitDeal",value:function(){return this._restService.deleteOrder(this)}},{key:"toJSON",value:function(){var e={timeStamp:this.heartbeat.timestamp,dealReference:this.dealReference},t=this._session.user.broker
return t&&t.decisionMakerAccountId&&(e.decisionMakerAccountId=t.decisionMakerAccountId),e}},{key:"isMarketDealable",get:function(){var e=this.order
return e&&e.canClose()}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(16),r(3),r(2)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o,a,s=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var u,l,c,p,f,d,y=Object.freeze({0:"GoodForDay",1:"GoodTillCancelled",3:"ExecuteAndEliminate",4:"FillOrKill",6:"GoodTillDate",X:"GoodForDayAllSessions"}),h=Object.freeze({1:"Market",2:"MarketLimit",3:"MarketStop"}),v=(o=(0,i.default)("isDMA","order.dmaOrderType"),a=function(e){function t(e,r){var i;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var n=arguments.length,o=Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a]
var s=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i=t.__proto__||Object.getPrototypeOf(t)).call.apply(i,[this,e,r.market].concat(o)))
return s.setProperties({isEditTicket:!0,order:r,direction:"+"===r.direction?"buy":"sell",size:r.quantity,filledQuantity:r.filledQuantity,triggerLevel:r.openLevel,stopStep:r.stopStep,stopTrailingDistance:r.stopTrailingDistance,maxSize:r.quantity,isDMA:r.isDMA}),s}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"_getMargin",value:function(){return this.marginService.getEditOrderMargin(this)}},{key:"_getIndicativeCostsAndCharges",value:function(){return this.settings.forceExAnteOpenEndpointForEdits?this.indicativeCostsAndChargesService.getIndicativeOpenQuote(this):this.indicativeCostsAndChargesService.getIndicativeEditQuote(this)}},{key:"_getValidators",value:function(){return[r.dateBelowMin,r.direction,r.marketDealable,r.triggerLevelWithinValidDistance,r.triggerLevelAboveZero,r.triggerLevelDmaCorrectIncrementTick,r.controlledRiskUser,r.hasLiveData,r.dmaSizeBelowMax,r.sizeAboveZero,r.dmaSizeAboveFilled]}},{key:"_submitDeal",value:function(){return this._restService.edit(this)}},{key:"toJSON",value:function(){var e=this.order,t=this.market,r=this.direction,i={dealId:e.dealId,direction:r.toUpperCase(),pricePreference:r.toUpperCase(),epic:t.epic,orderLevel:parseFloat(this.triggerLevel),orderSize:parseFloat(this.size),orderType:this.dmaOrderType,timeInForce:y[e.dmaTimeInForce],timeStamp:this.heartbeat.timestamp,lsServerName:this._restService._lsServerName},n=this._session.user.broker
return n&&n.decisionMakerAccountId&&(i.decisionMakerAccountId=n.decisionMakerAccountId),i}},{key:"destroy",value:function(){this.order.off("change",this._onOrderChange,this),s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}},{key:"openLevel",get:function(){return this.order.openLevel}},{key:"isMarketDealable",get:function(){var e=this.order
return e&&e.canEdit()}},{key:"dmaOrderType",get:function(){if(this.isDMA&&this.order)return h[this.order.dmaOrderType]}}]),t}(t.default),u=a.prototype,l="dmaOrderType",c=[o],p=Object.getOwnPropertyDescriptor(a.prototype,"dmaOrderType"),f=a.prototype,d={},Object.keys(p).forEach((function(e){d[e]=p[e]})),d.enumerable=!!d.enumerable,d.configurable=!!d.configurable,("value"in d||d.initializer)&&(d.writable=!0),d=c.slice().reverse().reduce((function(e,t){return t(u,l,e)||e}),d),f&&void 0!==d.initializer&&(d.value=d.initializer?d.initializer.call(f):void 0,d.initializer=void 0),void 0===d.initializer&&(Object.defineProperty(u,l,d),d=null),a)
e.default=v}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(16),r(3),r(2)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o,a,s=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var u,l,c,p,f,d,y=Object.freeze({0:"GOOD_FOR_DAY",1:"GOOD_TILL_CANCELLED",2:"GOOD_TILL_DATE",3:"FILL_OR_KILL",4:"IMMEDIATE_OR_CANCEL"}),h=Object.freeze({1:"MARKET",2:"LIMIT",3:"STOP_MARKET",4:"STOP_LIMIT"}),v=(o=(0,i.default)("order.dmaOrderType"),a=function(e){function t(e,r){var i;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var n=arguments.length,o=Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a]
var s=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i=t.__proto__||Object.getPrototypeOf(t)).call.apply(i,[this,e,r.market].concat(o)))
return s.setProperties({order:r,direction:"+"===r.direction?"buy":"sell",triggerLevel:r.openLevel,orderStopLevel:r.orderStopLevel}),s._validate(),s}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"_getMargin",value:function(){}},{key:"_getValidators",value:function(){return[r.marketDealable,r.hasLiveData,r.triggerLevelAboveZeroForLimitOrder]}},{key:"_getIndicativeCostsAndCharges",value:function(){return this.isBuy?this.indicativeCostsAndChargesService.getIndicativeOpenQuote(this):this.indicativeCostsAndChargesService.getIndicativeCloseQuote(this,!0)}},{key:"_submitDeal",value:function(){return this._restService.edit(this)}},{key:"toJSON",value:function(){var e=this.order,t=this.market,r=this.currency,i=this.direction
return{currency:r.name,direction:i.toUpperCase(),epic:t.epic,igInstrumentId:e.igInstrumentId,orderType:this.orderType,timeInForce:y[e.dmaTimeInForce],price:this.triggerLevel,stopPrice:this.orderStopLevel||0,strikePrice:this.market.strikePrice,quantity:{quantityType:"CONTRACTS",value:e.quantity}}}},{key:"openLevel",get:function(){return this.order.openLevel}},{key:"isMarketDealable",get:function(){var e=this.order
return e&&e.canEdit()}},{key:"orderType",get:function(){if(this.order)return h[this.order.dmaOrderType]}},{key:"iccPriceLevel",get:function(){return"STOP_MARKET"===this.orderType?this.orderStopLevel:s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"iccPriceLevel",this)}},{key:"iccStopLevel",get:function(){return null}},{key:"iccLimitLevel",get:function(){return null}},{key:"iccSize",get:function(){return this.order.quantity}},{key:"iccDirection",get:function(){return"buy"}}]),t}(t.default),u=a.prototype,l="orderType",c=[o],p=Object.getOwnPropertyDescriptor(a.prototype,"orderType"),f=a.prototype,d={},Object.keys(p).forEach((function(e){d[e]=p[e]})),d.enumerable=!!d.enumerable,d.configurable=!!d.configurable,("value"in d||d.initializer)&&(d.writable=!0),d=c.slice().reverse().reduce((function(e,t){return t(u,l,e)||e}),d),f&&void 0!==d.initializer&&(d.value=d.initializer?d.initializer.call(f):void 0,d.initializer=void 0),void 0===d.initializer&&(Object.defineProperty(u,l,d),d=null),a)
e.default=v}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(13),r(11),r(3),r(2)],n=function(e,t,r,i,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var o,a,s=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var u,l,c,p,f,d,y=(o=(0,n.default)("quantity","order.filledQuantity"),a=function(e){function t(e,r){var i;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var n=arguments.length,o=Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a]
return function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i=t.__proto__||Object.getPrototypeOf(t)).call.apply(i,[this,{order:r,quantity:r.quantity,triggerLevel:r.openLevel},e,r.market].concat(o)))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"_getValidators",value:function(){return[i.quantityBelowFilled,i.triggerLevelAboveZero]}},{key:"toString",value:function(){return r.default.ORDER}},{key:"_submitDeal",value:function(){return this._restService.editOrder(this)}},{key:"toJSON",value:function(){var e={size:this.quantity,level:this.triggerLevel,dealReference:this.dealReference,submittedTimestamp:+this.heartbeat.timestamp},t=this._session.user.broker
return t&&t.decisionMakerAccountId&&(e.decisionMakerAccountId=t.decisionMakerAccountId),e}},{key:"_validationDependentKeys",get:function(){return["quantity","triggerLevel"]}},{key:"workingQuantity",get:function(){return!this.quantity||this.quantity<=this.order.filledQuantity?this.order.dealSize:this.quantity-this.order.filledQuantity}}]),t}(t.default),u=a.prototype,l="workingQuantity",c=[o],p=Object.getOwnPropertyDescriptor(a.prototype,"workingQuantity"),f=a.prototype,d={},Object.keys(p).forEach((function(e){d[e]=p[e]})),d.enumerable=!!d.enumerable,d.configurable=!!d.configurable,("value"in d||d.initializer)&&(d.writable=!0),d=c.slice().reverse().reduce((function(e,t){return t(u,l,e)||e}),d),f&&void 0!==d.initializer&&(d.value=d.initializer?d.initializer.call(f):void 0,d.initializer=void 0),void 0===d.initializer&&(Object.defineProperty(u,l,d),d=null),a)
e.default=y}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(13),r(11),r(3)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function(e){function t(e,r){var i;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var n=arguments.length,o=Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a]
return function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i=t.__proto__||Object.getPrototypeOf(t)).call.apply(i,[this,{position:r,size:r.dealSize,bookCost:r.bookCost},e,r.market].concat(o)))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"_getValidators",value:function(){return[i.sizeAboveZero,i.bookCostFilled]}},{key:"toString",value:function(){return r.default.POSITION}},{key:"_submitDeal",value:function(){return this._restService.editPosition(this)}},{key:"toJSON",value:function(){var e={bookCost:this.bookCost,currentPositionSize:""+this.size,dealReference:this.dealReference,submittedTimestamp:+this.heartbeat.timestamp},t=this._session.user.broker
return t&&t.decisionMakerAccountId&&(e.decisionMakerAccountId=t.decisionMakerAccountId),e}},{key:"_validationDependentKeys",get:function(){return["size","bookCost"]}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(16),r(2),r(25),r(3),r(17),r(30),r(10)],n=function(e,t,r,i,n,o,a,s){"use strict"
function u(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var l=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var c,p,f,d,y,h,v,g=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function _(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var O=(c=(0,r.default)("market","market.marketStatus","isSell"),p=(0,r.default)("_orderType"),f=(0,r.default)("_orderType"),d=(0,r.default)("isSell","bidPrice","offerPrice","triggerLevel"),y=(0,r.default)("market","market.otcTradeable"),h=(0,r.default)("_orderType","timeInForce"),v=function(e){function t(e,r,n,s,u,l,c,p,f){var d;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var y=arguments.length,h=Array(y>9?y-9:0),v=9;v<y;v++)h[v-9]=arguments[v]
var g=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(d=t.__proto__||Object.getPrototypeOf(t)).call.apply(d,[this,e,r,n,s,u,l,c,f].concat(h)))
if(f){var _=a.default.GOOD_FOR_DAY,O="limitgoodforday"===f.preferenceDmaDefaultOrderType?o.default.LIMIT:o.default.MARKET
g.setProperties({forceOpen:!1,isDMA:!0,orderType:O,timeInForce:_})}else{var b=s.rememberLastTradedOrderTypeAndExpiry,m=(0,i.getFirstValidDMAOrderTypeFromMarketData)(g.availableOrderTypeAndExpiryValues,b,g.market.lastTradedOrderType,g.market.defaultOrderType),T=(0,i.getFirstValidOrderExpiry)(g.availableOrderTypeAndExpiryValues,m,b,g.market.lastTradedOrderExpiry,g.market.defaultOrderExpiry)
g.setProperties({forceOpen:!1,isDMA:!0,orderType:m.orderType,timeInForce:T})}return g}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),l(t,[{key:"_onChange",value:function(e){g(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_onChange",this).call(this,e),e.includes("_orderType")&&this._updateMargin()}},{key:"_getMargin",value:function(){return this.marginService.getOrderMargin(this)}},{key:"checkForValidOrderTypeAndExpiry",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0]
if(!this.orderType&&!this.timeInForce)return!0
if(this.market.dmaMarketData){var t=(0,i.getValidExpiries)(this.availableOrderTypeAndExpiryValues,this.orderType),r=t.includes(this.timeInForce)
return!r&&e?(this.set("timeInForce",t[0]),!0):r}return!0}},{key:"_getValidators",value:function(){return[n.marketDealable,n.direction,n.orderTypeAndExpiry,n.sizeAboveMin,n.sizeAboveZero,n.stopPriceRightSideOfBidOfferPriceForDMATicket].concat(u(this.isOneClickOrMicroDMA?[]:[n.triggerLevelAboveZeroForNonMarketOrder]),[n.stopOnlyForOTCTradeableMarket,n.limitOnlyForOTCTradeableMarketAndNonLimitDayOrderType,n.triggerLevelDmaCorrectIncrementTick])}},{key:"toJSON",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=this.market,r=this.direction,i=this.orderType,n=this.currency,o=this.stopDistance,a=this.limitDistance,s=+this._getSubmittedTimestamp(),u=this._hasTrailingStop(),l=null,c=null
r&&(l=r.toUpperCase(),c=this.isSell?"-":"+")
var p={currencyCode:n&&n.name,dealReference:this.dealReference,direction:c,pricePreference:l,epic:t.epic,expiry:t.prompt,timeInForce:this.timeInForce,guaranteedStop:this._hasGuaranteedStop(),trailingStop:u,trailingStopIncrement:u?this.stopStep:null,quoteId:this.quoteId,lsServerName:this._restService.lightstreamerServerAddress,stopDistance:o,limitDistance:a,stopLevel:o,limitLevel:a,orderType:i,type:i,level:this.orderLevel,orderLevel:this.orderLevel,size:this.size,orderSize:this.size,timeStamp:s,submittedTimestamp:s}
this.ignoreOrderLevel&&!e?(delete p.level,delete p.orderLevel):this.isOneClickOrMicroDMA&&(p.level=this.isSell?t.bid:t.offer,p.orderLevel=this.isSell?t.bid:t.offer),this.ignoreLimitDistance&&(delete p.limitDistance,delete p.limitLevel),this.isStopsLimitsPlacingAllowed||(delete p.guaranteedStop,delete p.trailingStop,delete p.trailingStopIncrement,delete p.stopDistance,delete p.limitDistance,delete p.stopLevel,delete p.limitLevel)
var f=this._session.user.broker
return f&&f.decisionMakerAccountId&&(p.decisionMakerAccountId=f.decisionMakerAccountId),e&&(delete p.stopLevel,delete p.limitLevel,delete p.orderType,delete p.orderLevel,delete p.orderSize,delete p.timeStamp),p}},{key:"toMarginJSON",value:function(){var e=this.toJSON(!0)
return e.direction=e.pricePreference,delete e.pricePreference,e}},{key:"availableOrderTypeAndExpiryValues",get:function(){if(this.market.dmaMarketData)return(0,i.getValidDMAOrderTypesFromMarketData)(this.market.dmaMarketData.orderTypesAvailable,this.isSell,this.market.marketStatus,null,!1)}},{key:"orderType",get:function(){return this._orderType},set:function(e){this.set("_orderType",e),this.checkForValidOrderTypeAndExpiry(!0)}},{key:"ignoreOrderLevel",get:function(){return this.orderType===o.default.MARKET}},{key:"orderLevel",get:function(){return this.orderType===o.default.MARKET?this._calculateMarketLevel():this.triggerLevel}},{key:"isStopsLimitsPlacingAllowed",get:function(){return this.market.otcTradeable}},{key:"stopTypes",get:function(){var e=this.market
return s.default.getStopTypes(e.controlledRisk,!1,e.trailingStopsAllowedPreference,e.isLimitedRisk).filter((function(e){return e.value!==s.default.Type.TRAILING}))}},{key:"ignoreLimitDistance",get:function(){return this.orderType===o.default.LIMIT&&this.timeInForce===a.default.GOOD_FOR_DAY}},{key:"_validationDependentKeys",get:function(){return[].concat(u(g(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_validationDependentKeys",this)),["_orderType"])}},{key:"iccPriceLevel",get:function(){var e=g(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"iccPriceLevel",this)
return this.isOneClickOrMicroDMA&&!e?this.isSell?this.market.bid:this.market.offer:e}}]),t}(t.default),_(v.prototype,"availableOrderTypeAndExpiryValues",[c],Object.getOwnPropertyDescriptor(v.prototype,"availableOrderTypeAndExpiryValues"),v.prototype),_(v.prototype,"orderType",[p],Object.getOwnPropertyDescriptor(v.prototype,"orderType"),v.prototype),_(v.prototype,"ignoreOrderLevel",[f],Object.getOwnPropertyDescriptor(v.prototype,"ignoreOrderLevel"),v.prototype),_(v.prototype,"orderLevel",[d],Object.getOwnPropertyDescriptor(v.prototype,"orderLevel"),v.prototype),_(v.prototype,"isStopsLimitsPlacingAllowed",[y],Object.getOwnPropertyDescriptor(v.prototype,"isStopsLimitsPlacingAllowed"),v.prototype),_(v.prototype,"ignoreLimitDistance",[h],Object.getOwnPropertyDescriptor(v.prototype,"ignoreLimitDistance"),v.prototype),v)
e.default=O}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(13),r(11),r(2),r(17),r(9),r(14),r(45),r(44),r(3),r(0),r(25),r(46)],n=function(e,t,r,i,n,o,a,s,u,l,c,p,f){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var y=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var h,v,g=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var _,O,b,m,T,k,P=(h=(0,i.default)("level","currentMarketLevel","orderType"),v=function(e){function t(e,r,i,n,o,s,u){var l;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var f=arguments.length,d=Array(f>7?f-7:0),y=7;y<f;y++)d[y-7]=arguments[y]
var h=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(l=t.__proto__||Object.getPrototypeOf(t)).call.apply(l,[this,{sizeUnit:a.default.QUANTITY,isExchangeTraded:!0},e,r,i,n,o,s,u].concat(d)))
h._shareDealingService=e,h._dealReferenceGenerator=o,h._throttledGetCharges=(0,c.throttle)(h.getCharges.bind(h),5e3)
var v=n.rememberLastTradedOrderTypeAndExpiry,g=(0,p.getValidDMAOrderTypesFromMarketData)(h.market.dmaMarketData.orderTypesAvailable,h.isSell,h.market.marketStatus,h.sizeUnit!==a.default.QUANTITY),_=(0,p.getFirstValidDMAOrderTypeFromMarketData)(g,v,h.market.lastTradedOrderType,h.market.defaultOrderType),O=(0,p.getFirstValidOrderExpiry)(g,_,v,h.market.lastTradedOrderExpiry,h.market.defaultOrderExpiry)
return h.setProperties({orderType:_.orderType,timeInForce:O}),h}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),y(t,[{key:"toString",value:function(){return r.default.ORDER}},{key:"toJSON",value:function(){var e=this.considerationCurrency,t=this.currency,r=this.dealReference,i=this.effectiveLevel,n=this.direction,s=this.market,u=s.epic,l=s.marketStatus,c=this.orderType,p=this.size,f=this.timeInForce,y={dealReference:r,direction:n.toUpperCase(),epic:u,submittedTimestamp:+this._getSubmittedTimestamp(),timeInForce:f,queueIfClosed:l===o.default.EDIT},h=this._session.user.broker
h&&h.decisionMakerAccountId&&(y.decisionMakerAccountId=h.decisionMakerAccountId)
var v={currencyCode:t.name,level:i,size:p,type:c},g={considerationAmount:p,instrumentCurrencyCode:t.name,orderLevel:i,considerationCurrency:this.sizeUnit===a.default.VALUE?e:t.name},_=a.default.isConsideration(this.sizeUnit)
return d({},y,_?g:v)}},{key:"_updateCharges",value:function(){var e=this.size,t=this.direction,r=this.effectiveLevel
if(!e||!t||!r)return this.setProperties({charges:null,orderSize:null}),void this._throttledGetCharges.cancel()
this._throttledGetCharges()}},{key:"getCharges",value:function(){var e=this,t=this._shareDealingService.getCharges(this)
if(this.setProperties({chargesRequest:t,_chargesRequestAborted:!1}),t)return t.then((function(t){if(!e._chargesRequestAborted){var r=a.default.isConsideration(e.sizeUnit)?t.chargesEstimateResponse:t
e.setProperties({charges:r,chargesRequest:null,orderSize:t.orderSize})}})).catch((function(t){e.set("chargesRequest",null),(0,s.default)(t)}))}},{key:"_onChange",value:function(e){g(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_onChange",this).call(this,e),(0,u.default)(e,["size","sizeUnit","effectiveLevel","direction","currency"])&&this._updateCharges()}},{key:"_abortChargesRequest",value:function(){this._chargesRequestAborted=!0}},{key:"_getValidators",value:function(){return[l.direction,l.marketDealable,l.shareDealingSizeAboveZero,l.sizeBelowMax,l.levelAboveZero,l.technicalIssues,l.orderSizeAboveZero]}},{key:"_submitDeal",value:function(){return this._restService.createExchangeOrder(this)}},{key:"_getMargin",value:function(){return null}},{key:"_updatePerMarketSettings",value:function(){var e=this.toJSON(),t=c.default.invert(n.default)[e.type],r=(0,f.default)(this.settings,e,t)
this.market.setProperties(r)}},{key:"destroy",value:function(){this._abortChargesRequest(),this._throttledGetCharges.cancel(),g(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}},{key:"isMarketDealable",get:function(){return[o.default.TRADEABLE,o.default.AUCTION,o.default.EDIT].includes(this.market.marketStatus)}},{key:"_validationDependentKeys",get:function(){return[].concat(function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}(g(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_validationDependentKeys",this)),["orderSize","orderType","level","market.displayOffer","market.displayBid","sizeUnit"])}},{key:"effectiveLevel",get:function(){return this.orderType===n.default.MARKET?this.currentMarketLevel:this.level}}]),t}(t.default),_=v.prototype,O="effectiveLevel",b=[h],m=Object.getOwnPropertyDescriptor(v.prototype,"effectiveLevel"),T=v.prototype,k={},Object.keys(m).forEach((function(e){k[e]=m[e]})),k.enumerable=!!k.enumerable,k.configurable=!!k.configurable,("value"in k||k.initializer)&&(k.writable=!0),k=b.slice().reverse().reduce((function(e,t){return t(_,O,e)||e}),k),T&&void 0!==k.initializer&&(k.value=k.initializer?k.initializer.call(T):void 0,k.initializer=void 0),void 0===k.initializer&&(Object.defineProperty(_,O,k),k=null),v)
e.default=P}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(13),r(11),r(44),r(14),r(3),r(0),r(45),r(68),r(46)],n=function(e,t,r,i,n,o,a,s,u,l){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var c=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var p=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var f=function(e){function t(e,r,i,o,s,u,l){var c;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var p=arguments.length,f=Array(p>7?p-7:0),d=7;d<p;d++)f[d-7]=arguments[d]
var y=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(c=t.__proto__||Object.getPrototypeOf(t)).call.apply(c,[this,{sizeUnit:n.default.QUANTITY,isExchangeTraded:!0},e,r,i,o,s,u,l].concat(f)))
return y._shareDealingService=e,y._dealReferenceGenerator=s,y._throttledGetCharges=a.default.throttle(y.getCharges.bind(y),5e3),y}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),c(t,[{key:"toString",value:function(){return r.default.ORDER}},{key:"toJSON",value:function(){var e=this.dealReference,t=this.direction,r=this.market.epic,i=this.quoteDetails,n=i.bidPrice,o=i.offerPrice,a=i.quoteId,s=i.rspName,u=i.currency,l=i.reportData.quantity.value,c={currencyCode:u,dealReference:e,direction:t.toUpperCase(),epic:r,level:this.isSell?n:o,quoteId:a,quoteOriginId:s,size:l,submittedTimestamp:+this._getSubmittedTimestamp()},p=this._session.user.broker
return p&&p.decisionMakerAccountId&&(c.decisionMakerAccountId=p.decisionMakerAccountId),c}},{key:"_submitDeal",value:function(){return this._restService.createQuoteOrder(this)}},{key:"_updateCharges",value:function(){var e=this.size,t=this.direction,r=this.currentMarketLevel
if(this._abortChargesRequest(),!e||!t||!r)return this.setProperties({charges:null,orderSize:null}),void this._throttledGetCharges.cancel()
this._throttledGetCharges()}},{key:"getCharges",value:function(){var e=this,t=this._shareDealingService.getCharges(this)
if(this.setProperties({chargesRequest:t,_chargesRequestAborted:!1}),t)return t.then((function(t){if(!e._chargesRequestAborted){var r=n.default.isConsideration(e.sizeUnit)?t.chargesEstimateResponse:t
e.setProperties({charges:r,chargesRequest:null,orderSize:t.orderSize})}})).catch((function(t){e.set("chargesRequest",null),(0,s.default)(t)}))}},{key:"_onChange",value:function(e){p(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_onChange",this).call(this,e),(0,i.default)(e,["size","sizeUnit","direction","currentMarketLevel"])&&this._updateCharges()}},{key:"_abortChargesRequest",value:function(){this._chargesRequestAborted=!0}},{key:"_getValidators",value:function(){return[o.direction,o.marketDealable,o.shareDealingSizeAboveZero,o.sizeBelowMax,o.technicalIssues,o.orderSizeAboveZero]}},{key:"updateQuote",value:function(){var e=this
return this.setProperties({quoteDetails:null,quoteError:null,isFetchingQuote:!0}),this._refreshQuoteDealReference(),this._submitQuoteRequest().then((function(t){var r=t.content
e.set("quoteDetails",r)})).catch((function(t){e.set("quoteError",t.content||t.response||t)})).finally((function(){return e.set("isFetchingQuote",!1)}))}},{key:"_submitQuoteRequest",value:function(){return this._shareDealingService.getQuote(this)}},{key:"_refreshQuoteDealReference",value:function(){this.quoteDealReference=this._dealReferenceGenerator.generateDealReference()}},{key:"_updatePerMarketSettings",value:function(){var e=(0,l.default)(this.settings,this.toJSON(),u.default.QUOTE)
this.market.setProperties(e)}},{key:"_getMargin",value:function(){return null}},{key:"destroy",value:function(){this._abortChargesRequest(),this._throttledGetCharges.cancel(),p(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}},{key:"_validationDependentKeys",get:function(){return[].concat(function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}(p(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_validationDependentKeys",this)),["market.displayOffer","market.displayBid","orderSize","sizeUnit"])}}]),t}(t.default)
e.default=f}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(153)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function(e){function t(e,r,i,n,o,a,s){var u;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var l=arguments.length,c=Array(l>7?l-7:0),p=7;p<l;p++)c[p-7]=arguments[p]
return function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(u=t.__proto__||Object.getPrototypeOf(t)).call.apply(u,[this,e,r,i,n,o,a,s].concat(c)))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"toJSON",value:function(){var e=this.market,t={currency:this.currency.name,direction:this.direction.toUpperCase(),epic:e.epic,igInstrumentId:e.igInstrumentId,timeInForce:this.timeInForce,orderType:this.orderType,strikePrice:this.market.strikePrice,quantity:{quantityType:"CONTRACTS",value:this.size}}
return"GOOD_TILL_DATE"===this.timeInForce&&(t.expiresAt=this.goodTillDate),"MARKET"===this.orderType?(t.orderType="LIMIT",t.price=this.priceWithTolerance):(this.orderType.includes("LIMIT")&&(t.price=this.triggerLevel),this.orderType.includes("STOP")&&(t.stopPrice=this.stopPrice)),t}}]),t}(t.default)
e.default=i}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e){var t=[]
t.push(["vendor","IG Group"]),t.push(["applicationType",e.applicationType||"ig"]),t.push(["platform",e.platform]),e.deviceType&&t.push(["deviceType",e.deviceType])
e.view&&t.push(["view",e.view])
t.push(["version",e.version]),e.component&&t.push(["component",e.component.replace("|","_")])
e.componentVersion&&t.push(["componentVersion",e.componentVersion])
return t.filter((function(e){return e[1]})).map((function(e){return e[0]+"="+e[1].toString()})).join(" | ")}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,r,i,n){var o=null
e&&r&&i&&r===t.rate&&(o=e*i)<n&&(o=n)
return o}
var t=Object.freeze({percent:"PERCENT",rate:"RATE"})}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,r){return e=t[e]||e,r=t[r]||r,!e&&!r||e===r}
var t={"+":"buy","-":"sell"}}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(19),r(8),r(31)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,n,o,a,s,u,l,c){var p=n===r.default.Type.ABSOLUTE,f=r.default.distanceFrom(e,n,u,s),d=(0,i.default)(o,u,n,a)
if(c&&!f)return{isValid:!1,error:{key:t.default.Reason.LIMIT_REQUIRED}}
if(isNaN(e))return{isValid:!1,error:{key:t.default.Reason.INVALID_LEVEL}}
if(p&&(l&&e<u||!l&&e>u))return{isValid:!1,error:{key:t.default.Reason.LIMIT_WRONG_SIDE}}
if(f<0||!p&&0===f)return{isValid:!1,error:{key:t.default.Reason.LIMIT_TOO_CLOSE}}
if(p&&0===f)return{isValid:!1,error:{key:t.default.Reason.LIMIT_SAME_AS_CURRENT_LEVEL}}
if(null!==d&&f>d)return{isValid:!1,error:{key:t.default.Reason.LIMIT_TOO_FAR}}
return{isValid:!0}}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.parseRelationships=void 0
var r="OCO",i="OTO",n="SOURCE",o="TARGET",a=(e.parseRelationships=function(e){if(!e)return{triggersOtherOrders:!1,triggeredBy:null,cancelledBy:null}
var t=!!a(e,i,n).length,s=a(e,i,o),u=a(e,r,o)
return{triggersOtherOrders:t,triggeredBy:s.length?s[0].refOrderId:null,cancelledBy:u.length?u[0].refOrderId:null}},function(e,r,i){return e?t.default.filter(e,{instruction:r,association:i}):null})}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(5)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,r,i){i!==t.UNITS.AMOUNT&&(r=1)
return e/r}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(6),r(26)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var o=function(e){function t(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return r.market.on("change",r._onMarketChange,r),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_onMarketChange",value:function(e){(e.includes("bid")||e.includes("offer"))&&this.trigger("change",["latest"])}},{key:"destroy",value:function(){return this.market.off("change",this._onMarketChange,this),n(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}},{key:"latest",get:function(){var e=this.marketAttribute===r.default.PriceType.BUY_PRICE?this.market.offer:this.market.bid
return parseFloat(e)}}],[{key:"fromDealingRestAlert",value:function(e){return new t(e)}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(6)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,{name:e.name,code:e.code,symbol:e.symbol,ticketDefault:e.ticketDefault,exchangeRate:e.exchangeRate,baseExchangeRate:e.baseExchangeRate,isDefault:e.isDefault}))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,null,[{key:"populateWithJson",value:function(e){return new t(e)}}]),t}(t.default)
e.default=i}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var t=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),r=function(){function e(t){var r=t.rangeData,i=t.orderTypesAvailable;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this.rangeData=r,this.orderTypesAvailable=i}return t(e,null,[{key:"parseRangeData",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,i="Default Tick Matrix"===t
return e.map((function(e){var t=e.startRange,n=e.endRange,o=e.increment
return Object.freeze({start:t,end:-1===n?1/0:n,step:i?o/r:o})}))}},{key:"populateWithJson",value:function(t,r){var i=t||{},n=i.orderTypesAvailable,o=i.tickMatrixData,a=(o=void 0===o?{}:o).rangeData,s=o.name,u=null
if(a)u=e.parseRangeData(a,s,r)
else if(!n)return null
return new e({rangeData:u,orderTypesAvailable:n})}}]),e}()
e.default=r}.apply(t,[t]),void 0===i||(e.exports=i)},function(e,t,r){var i,n
i=[t,r(6)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0},i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=["size","expiryClosest","expiryFurthest"],o=function(e){function t(e,r,i,n,o){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))
return a._entries=[],a._timeouts=[],a._heartbeat=e,a.epic=i,a.currency=n,a.direction=o,a.setRDW(r),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"size",get:function(){return this._entries&&this._entries.length?this._entries[0].size:0}},{key:"expiryClosest",get:function(){var e="number"==typeof this._heartbeat.offset?this._heartbeat.offset:0
return this._entries&&this._entries.length?this._entries[0].expiry-e:null}},{key:"expiryFurthest",get:function(){var e="number"==typeof this._heartbeat.offset?this._heartbeat.offset:0
return this._entries&&this._entries.length?this._entries[this._entries.length-1].expiry-e:null}}]),i(t,[{key:"setRDW",value:function(e){var t=this,r=this._heartbeat.getTime(),i=e.slice().sort((function(e,t){return e.expiry-t.expiry})).filter((function(e){return e.expiry-r>0}))
if(this._timeouts.forEach((function(e){return clearTimeout(e)})),i.length){var n=i.map((function(e){return setTimeout((function(){var r=i.indexOf(e)
r>-1&&t._triggerChangeEvent((function(){i.splice(r,1),n.splice(r,1)}))}),e.expiry-r)}))
this._triggerChangeEvent((function(){t._entries=i,t._timeouts=n}))}else this._entries.length&&this._triggerChangeEvent((function(){t._entries=[],t._timeouts=[]}))}},{key:"_triggerChangeEvent",value:function(e){var t=this,r=n.map((function(e){return t[e]}))
e()
var i=n.filter((function(e,i){return t[e]!==r[i]}))
i.length&&this.trigger("change",i)}},{key:"destroy",value:function(){this._entries&&this.setRDW([]),r(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this),delete this._entries,delete this._timeouts}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(77),r(9)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function n(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,{epic:t.default.unpricedEpic}))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(n,e),i(n,null,[{key:"populateWithV2MarketData",value:function(e){var t=e.instrumentData,i=new n,o=e.dealSettings||{}
return i.populateWith({controlledRisk:!1,dealingRules:null,guaranteedStopsAllowed:!1,trailingStopsAllowedPreference:!0,instrumentName:t.marketName,marketId:t.marketId,exchangeId:t.exchangeId,expiryDetails:t.expiryDetails,displayPeriod:t.displayPrompt,isin:t.isin,mtfAvailable:t.mtfAvailable,otcTradeable:t.otcTradeable,instrumentDmaL1Tradeable:"???",dmaTradeable:t.dmaTradeable,dmaL1Tradeable:t.dmaL1Tradeable,dxdTradeable:"???",instrumentType:t.instrumentType||"UNKNOWN",stopsLimitsAllowed:!1,stopAllowed:!1,limitAllowed:!1,unit:t.unit,marketStatus:r.default.resolve({rawMarketStatus:0}),high:null,low:null,percentageChange:null,netChange:null,bid:null,offer:null,bestBid:null,bestOffer:null,scalingFactor:null,decimalPlacesFactor:null,updateTime:null,viewPermission:t.viewPermission,delayTime:null,scaled:null,marketAnalysisAvailable:t.marketAnalysisAvailable,alertsAllowed:t.alertsAllowed,countryCode:t.countryCode,newsSymbol:t.newsCode,currency:t.currency,currencies:[],minDealSize:0,defaultOrderType:o.defaultOrderType,defaultOrderExpiry:o.defaultOrderExpiry,lastTradedPointsThroughCurrent:o.lastTradedPointsThroughCurrent||null,lastTradedSize:o.lastTradedDealSize||null,lastTradedCurrency:o.lastTradedDealCurrency||null,lastTradedLimitDistance:o.lastTradedLimitDistance||null,lastTradedStopDistance:o.lastTradedStopDistance||null,lastTradedStopType:o.lastTradedStopType||null,lastTradedTrailingStopIncrement:o.lastTradedTrailingStopIncrement||null,lastTradedOrderExpiry:o.lastTradedOrderExpiry||null,lastTradedOrderType:o.lastTradedOrderType||null,lotSize:t.lotSize,prompt:t.prompt,hasCompleteMarketData:!1}),i}}]),n}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(6)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,null,[{key:"fromDealingRestWatchlist",value:function(e){return new t(e)}}]),t}(t.default)
e.default=i}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(1),r(24),r(7)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function(e){function i(e,t){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,i)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(i.__proto__||Object.getPrototypeOf(i)).call(this))
return r._session=e,r._pollTimeoutId=null,r.updateDealReference(t),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(i,e),n(i,[{key:"updateDealReference",value:function(e){this._dealReference=e}},{key:"pollForConfirm",value:function(){var e=this
return new Promise((function(t,r){e._schedulePoll(t,r,0,i.INITIAL_TIMEOUT)}))}},{key:"destroy",value:function(){this.off(),this._pollTimeoutId&&(clearTimeout(this._pollTimeoutId),this._pollTimeoutId=null)}},{key:"_schedulePoll",value:function(e,t,r,i){var n=this
this._pollTimeoutId=setTimeout((function(){n._pollTimeoutId=null,n._poll(e,t,r)}),i)}},{key:"_poll",value:function(e,n,o){var a=this,s="/"+this._session.environment.path+"/executionreport/"+this._dealReference
0===o&&this.trigger(r.default.FIRST_POLL),t.get(s,this._session).then((function(t){t.content.reportData.rejectionMessage?n(t):e(t)})).catch((function(){var t=void 0,r=void 0;++o>=i.MAX_RETRIES?n("RETRY_COUNT_EXCEEDED"):(r=.4*(t=i.BASE_TIMEOUT*Math.pow(1.3,o)),t=t+Math.random()*r-.5*r,a._schedulePoll(e,n,o,t))}))}}]),i}(i.default)
e.default=o
o.INITIAL_TIMEOUT=2e3,o.BASE_TIMEOUT=1e4,o.MAX_RETRIES=10,o.stubTimeout=function(e){o.INITIAL_TIMEOUT=e,o.BASE_TIMEOUT=e},o.restoreTimeout=function(){o.INITIAL_TIMEOUT=2e3,o.BASE_TIMEOUT=1e4}}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(e,r,i,n){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))
return o._lsServerName=n,o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.order,t="/"+this._session.environment.path+"/orders/workingorders/dma/"+e.dealId
return r.del(t,this._session,{lsServerName:this._lsServerName,timeStamp:""+Date.now()})}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.order.dealId,t="/"+this._session.environment.path+"/orders/workingorders/dma/"+e
return r.put(t,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1),r(34)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"_doRequest",value:function(){var e=this._data.position.dealId,t=this._data.position instanceof i.default?"/"+this._session.environment.path+"/orders/positions/dma":"/"+this._session.environment.path+"/orders/positions/dma/"+e
return r.del(t,this._session,this._data)}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e={"X-CLIENT-REQUEST-ID":this._data.dealReference,accountId:this._session.user.accountId}
return r.post("/platform-order-entry-gateway/orders",this._session,this._data,e)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.order,t="/platform-order-entry-gateway/orders/"+e.dealId,i={"X-CLIENT-REQUEST-ID":this._data.dealReference,"X-ORIGINAL-CLIENT-REQUEST-ID":e.clientOrderId,accountId:this._session.user.accountId,igInstrumentId:e.market.igInstrumentId,epic:e.epic}
return r.del(t,this._session,null,i)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.order,t="/platform-order-entry-gateway/orders/"+e.dealId,i={"X-CLIENT-REQUEST-ID":this._data.dealReference,"X-ORIGINAL-CLIENT-REQUEST-ID":e.clientOrderId,accountId:this._session.user.accountId}
return r.put(t,this._session,this._data,i)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.isDMA?"/"+this._session.environment.path+"/orders/workingorders/dma":"/"+this._session.environment.path+"/v3/orders/workingorders/otc"
return r.post(e,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.order.dealId,t="/"+this._session.environment.path+"/v3/orders/workingorders/otc/"+e
return r.del(t,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.order.dealId,t="/"+this._session.environment.path+"/v3/orders/workingorders/otc/"+e
return r.put(t,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e="/"+this._session.environment.path+"/v3/orders/positions/otc"
return r.del(e,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e="/"+this._session.environment.path+"/v3/orders/positions/otc"
return r.post(e,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.position.dealId
return!!this._data.position.positions?r.put("/"+this._session.environment.path+"/v3/orders/positions/otc/agg",this._session,this._data):r.put("/"+this._session.environment.path+"/v3/orders/positions/otc/"+e,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1),r(14)],n=function(e,t,r,i){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"_doRequest",value:function(){var e=i.default.isConsideration(this._data.sizeUnit)?"consideration/":"",t="/"+this._session.environment.path+"/orders/workingorders/"+e+"stockbroking"
return r.post(t,this._session,this._data)}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e="/"+this._session.environment.path+"/orders/workingorders/onquote/stockbroking"
return r.post(e,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.order.dealId,t="/"+this._session.environment.path+"/orders/workingorders/stockbroking/"+e
return r.del(t,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.order.dealId,t="/"+this._session.environment.path+"/orders/workingorders/stockbroking/"+e
return r.put(t,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(4),r(1)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"_doRequest",value:function(){var e=this._data.position.dealId,t="/"+this._session.environment.path+"/orders/positions/stockbroking/"+e
return r.put(t,this._session,this._data)}}]),t}(t.default)
e.default=n}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(12),r(7)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0},n=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var o=function(e){function r(e,t,i,n){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,r)
var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this))
return o._trades=new Map,o._tradesPending=new Map,o._subscribedToUpdates=!1,o._session=e,o._restService=t,o._marketService=i,o._streamingClient=n,o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,e),n(r,[{key:"_isDestroyed",get:function(){return!this._session}}]),n(r,[{key:"getCurrentTrades",value:function(){return Array.from(this._trades.values())}},{key:"updateTrades",value:function(){var e=this
return this._subscribedToUpdates||(this._subscribedToUpdates=!0,this._streamingClient.startListening(this._session.user.accountId),this._streamingClient.on(t.default.ADDED,this._handleTradeAdded,this),this._streamingClient.on(t.default.REMOVED,this._handleTradeRemoved,this)),this._restService.getAll().then((function(t){return e._isDestroyed?[]:(e._processResponse(t),e.getCurrentTrades())}))}},{key:"_processResponse",value:function(e){var r=e.positions,i=e.orders,n=e.markets,o=r||i
if(!o)throw new Error("Need to be able to get either positions or orders from the REST service")
var a=new Set,s=new Map(this._trades),u=new Map(this._tradesPending),l=!0,c=!1,p=void 0
try{for(var f,d=o[Symbol.iterator]();!(l=(f=d.next()).done);l=!0){var y=f.value,h=this._trades.get(y.dealId),v=this._tradesPending.get(y.dealId)
h?(h.updateFromOther(y),s.delete(y.dealId),y.destroy()):v?(v.updateFromOther(y),u.delete(y.dealId),this._addTrade(v,n[y.epic]),a.add(v),y.destroy()):(this._addTrade(y,n[y.epic]),a.add(y))}}catch(g){c=!0,p=g}finally{try{!l&&d.return&&d.return()}finally{if(c)throw p}}u.size&&u.forEach(this._removeTrade.bind(this)),s.size&&(this.trigger(t.default.REMOVED,Array.from(s.values())),s.forEach(this._removeTrade.bind(this))),a.size&&this.trigger(t.default.ADDED,Array.from(a))}},{key:"_addTrade",value:function(e,t){e.set("market",t),this._tradesPending.delete(e.dealId),this._trades.set(e.dealId,e)}},{key:"_removeTrade",value:function(e){this._trades.delete(e.dealId),this._tradesPending.delete(e.dealId),e.destroy()}},{key:"_handleTradeAdded",value:function(e){var r=this
this._tradesPending.set(e.dealId,e),this._marketService.findByEpic(e.epic).then((function(i){r._isDestroyed||r._tradesPending.has(e.dealId)&&(r._addTrade(e,i),r.trigger(t.default.ADDED,[e]))}))}},{key:"_handleTradeRemoved",value:function(e){var r=this._trades.get(e),i=this._tradesPending.get(e)
r?(this.trigger(t.default.REMOVED,[r]),this._removeTrade(r)):i&&this._removeTrade(i)}},{key:"destroy",value:function(){this._streamingClient&&(this._streamingClient.off(t.default.ADDED,this._handleTradeAdded,this),this._streamingClient.off(t.default.REMOVED,this._handleTradeRemoved,this),this._streamingClient.stopListening(),delete this._streamingClient),this._trades.size&&(this.trigger(t.default.REMOVED,Array.from(this._trades.values())),this._trades.forEach((function(e){return e.destroy()})),this._trades.clear()),this._tradesPending.size&&(this._tradesPending.forEach((function(e){return e.destroy()})),this._tradesPending.clear()),delete this._restService,delete this._marketService,delete this._session,this._subscribedToUpdates=!1,i(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"destroy",this).call(this)}}]),r}(r.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(7)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var i=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
var n="V2-F-MKT|{epic}",o=function(e){function t(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))
return r.lightstreamerService=e,r.subscriptions={},r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"add",value:function(e){var t=n.replace("{epic}",e)
this.subscriptions[e]||(this.subscriptions[e]=this.lightstreamerService.subscribe(t,["MKT"],"MERGE",this._onUpdate.bind(this,e),1))}},{key:"remove",value:function(e){this.subscriptions[e]&&(this.subscriptions[e].unsubscribe(),this.subscriptions[e]=null)}},{key:"_onUpdate",value:function(e,r){r.isSnapshot()||this.trigger(t.UPDATE_EVENT,e)}},{key:"destroy",value:function(){Object.keys(this.subscriptions).forEach(this.remove,this),this.subscriptions=null,i(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}}],[{key:"UPDATE_EVENT",get:function(){return"UPDATED"}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(0)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(){var r=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i=arguments[1];(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._isSnapshot=r,this._fields=i?t.default.clone(i):{}}return r(e,[{key:"setField",value:function(e,t){this._fields[e]=t}},{key:"isValueChanged",value:function(e){return Object.prototype.hasOwnProperty.call(this._fields,e)}},{key:"isSnapshot",value:function(){return this._isSnapshot}},{key:"getValue",value:function(e){return this._fields[e]}},{key:"forEachChangedField",value:function(e){var r=this
t.default.forEach(this._fields,(function(t,i){e(i,0,t,r)}))}},{key:"hasData",value:function(){return Boolean(t.default.size(this._fields))}}]),e}()
e.default=i}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(28)],n=function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.PRIORITISED_RESPONSE_WAIT_TIME=e.default=void 0
var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(t,r,i,n){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this._resolve=r,this._reject=i,this._removeListenerCallback=n,this._storedUpdate=null,this._timerHandle=setTimeout(this._timerFired.bind(this),500),this.dealReference=t}return r(e,[{key:"resolve",value:function(e){this._handleResponse("resolve",e)}},{key:"reject",value:function(e){this._handleResponse("reject",e)}},{key:"_handleResponse",value:function(e,r){if(!this._timerHandle||t.IMMEDIATE_RESPONSE_REPORT_TYPES.includes(r.content.reportType))this._storedUpdate={type:e,update:r},this._resolveOrReject()
else if(this._storedUpdate){var i=t.REPORT_TYPE_PRIORITIES[this._storedUpdate.update.content.reportType]
t.REPORT_TYPE_PRIORITIES[r.content.reportType]>i&&(this._storedUpdate={type:e,update:r})}else this._storedUpdate={type:e,update:r}}},{key:"_timerFired",value:function(){this._timerHandle=null,this._storedUpdate&&this._resolveOrReject()}},{key:"_resolveOrReject",value:function(){this._timerHandle&&(clearTimeout(this._timerHandle),this._timerHandle=null),this._removeListenerCallback(this.dealReference),"resolve"===this._storedUpdate.type?this._resolve(this._storedUpdate.update):this._reject(this._storedUpdate.update)}}]),e}()
e.default=i,e.PRIORITISED_RESPONSE_WAIT_TIME=500}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(7),r(69)],n=function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
function n(e){return"STREAMING"===e||"POLLING"===e||"CONNECTED"===e.substr(0,9)&&"CONNECTED:STREAM-SENSING"!==e}var o=function(e){function t(e){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))
return r._lightstreamerService=e,r._lightstreamerService.on(e.STATUS_CHANGE_EVENT,r._updateStreamingStatus.bind(r),r),r._isStreaming=n(r._lightstreamerService.getStatus()),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"destroy",value:function(){this._lightstreamerService.un(null,this),this._lightstreamerService=null}},{key:"_updateStreamingStatus",value:function(e){var t=this._isStreaming;(this._isStreaming=n(e))&&!t&&this.trigger(r.default.RECONNECTED)}}]),t}(t.default)
e.default=o}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i,n
i=[t,r(13),r(11),r(3),r(2),r(18),r(51),r(21)],n=function(e,t,r,i,n,o,a,s){"use strict"
function u(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}
var c=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}()
var p,f,d,y,h,v,g,_,O,b,m=function e(t,r,i){null===t&&(t=Function.prototype)
var n=Object.getOwnPropertyDescriptor(t,r)
if(void 0===n){var o=Object.getPrototypeOf(t)
return null===o?void 0:e(o,r,i)}if("value"in n)return n.value
var a=n.get
return void 0!==a?a.call(i):void 0}
function T(e,t,r,i,n){var o={}
return Object.keys(i).forEach((function(e){o[e]=i[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),o),n&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(n):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}var k=(p=(0,n.default)("direction","referencePosition","sellOrdersQuantity","referencePosition.dealSize"),f=(0,n.default)("direction","triggerLevel","stopPrice","size","bidPrice","offerPrice","orderType"),d=(0,n.default)("consideration","currency","market"),y=(0,n.default)("currentMarketLevel","tolerance"),h=(0,n.default)("priceWithTolerance","decimalPlacesFactor"),v=(0,n.default)("priceWithTolerance","size"),g=(0,n.default)("considerationWithTolerance","currency","market"),_=(0,n.default)("size","triggerLevel","orderType","referencePosition","referencePosition.profitLoss","referencePosition.dealSize","referencePosition.latest"),O=(0,n.default)("profitLoss","currency"),b=function(e){function t(e,r,i,n,o,s,u){var c;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
for(var p=arguments.length,f=Array(p>7?p-7:0),d=7;d<p;d++)f[d-7]=arguments[d]
var y=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(c=t.__proto__||Object.getPrototypeOf(t)).call.apply(c,[this,{},e,r,i,n,o,s,u].concat(f)))
return l(y,{orderType:"LIMIT",timeInForce:"GOOD_FOR_DAY",tolerance:a.default.E0_20,dealSizeDecimalPlaces:0,sellOrdersQuantity:null,triggerLevel:null,stopPrice:null,referencePosition:u,isExchangeTraded:!0}),!r.defaultDealSize||r.lastTradedSize&&n.rememberLastTradedSize||y.set("size",r.defaultDealSize),y._updateReferencePositionListeners(),y._validate(),y}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),c(t,[{key:"_onChange",value:function(e){m(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_onChange",this).call(this,e),e.includes("referencePosition")&&this._updateReferencePositionListeners(),e.includes("orderType")&&this._updateIndicativeCostsAndCharges()}},{key:"_onMarketChange",value:function(e){m(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_onMarketChange",this).call(this,e),(e.includes("displayBid")||e.includes("displayOffer"))&&this._validate()}},{key:"_updateReferencePositionListeners",value:function(){this._removeReferencePositionListener(),this.referencePosition&&(this.referencePosition.on("change",this._onReferencePositionChange,this),this._oldReferencePosition=this.referencePosition)}},{key:"_removeReferencePositionListener",value:function(){var e=this._oldReferencePosition
e&&e.off("change",this._onReferencePositionChange,this),this._oldReferencePosition=null}},{key:"_onReferencePositionChange",value:function(e){var t=this,r=[];["dealSize","latest","profitLoss"].forEach((function(i){e.includes(i)&&r.push.apply(r,u(t.batchChangesForKeys(["referencePosition."+i])))})),r.length&&this.trigger("change",r)}},{key:"destroy",value:function(){this._removeReferencePositionListener(),m(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this)}},{key:"_getMargin",value:function(){return null}},{key:"_getValidators",value:function(){return[i.direction,i.marketDealable,i.sizeAboveZero,i.sizeBelowMax,i.controlledRiskTradingAvailable,i.hasLiveData,i.stopPriceAboveZeroForStopOrder,i.stopPriceNotInRangeOfBidOfferPrice,i.triggerLevelAboveZeroForLimitOrder,i.technicalIssues,i.noBuyingStopMarketOrders]}},{key:"_convertConsiderationToAccountCurrency",value:function(e){var t=1/this.currency.baseExchangeRate,r=this.market.dealingRules.currencyOffset
if(e&&t&&r){var i=t*r*.01
return e*(this.isSell?t-i:t+i)}return null}},{key:"addConsiderationWithoutTolerance",value:function(e){var t=JSON.parse(JSON.stringify(e))
return t.minMaxConsiderationTradeCurrency=t.totalConsiderationTradeCurrency,t.minMaxConsiderationUsersBaseCurrency=t.totalConsiderationUsersBaseCurrency,t.totalConsiderationTradeCurrency={amount:this.consideration,currencyCode:e.totalConsiderationTradeCurrency.currencyCode},t.totalConsiderationUsersBaseCurrency={amount:this.considerationInAccountCurrency,currencyCode:e.totalConsiderationUsersBaseCurrency.currencyCode},t}},{key:"getEstimatedCharges",value:function(){var e=this._restService.getEstimatedCharges(this)
return"MARKET"===this.orderType?e.then(this.addConsiderationWithoutTolerance.bind(this)):e}},{key:"toString",value:function(){return r.default.POSITION}},{key:"_getIndicativeCostsAndCharges",value:function(){return this.showClosing?this.indicativeCostsAndChargesService.getIndicativeCloseQuote(this,!0):this.indicativeCostsAndChargesService.getIndicativeOpenQuote(this)}},{key:"_validationDependentKeys",get:function(){return[].concat(u(m(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"_validationDependentKeys",this)),["orderType","timeInForce","triggerLevel","stopPrice","sellOrdersQuantity","market.displayOffer","market.displayBid"])}},{key:"roundedOpenLevel",get:function(){return Math.round(this.referencePosition.openLevel*Math.pow(10,this.market.decimalPlacesFactor))/Math.pow(10,this.market.decimalPlacesFactor)}},{key:"iccOpeningLevel",get:function(){return this.showClosing&&this.referencePosition?this.roundedOpenLevel:this.iccPriceLevel}},{key:"iccPriceLevel",get:function(){return"MARKET"===this.orderType?this.currentMarketLevel:"STOP_MARKET"===this.orderType?this.stopPrice:"STOP_LIMIT"!==this.orderType||this.stopPrice?this.triggerLevel:null}},{key:"iccStopLevel",get:function(){return null}},{key:"iccLimitLevel",get:function(){return null}},{key:"iccDirection",get:function(){return this.showClosing?"buy":this.direction}},{key:"maxSize",get:function(){var e=this.referencePosition&&this.referencePosition.dealSize,t=this.sellOrdersQuantity||0,r=Math.max(e-t,0)
return this.isSell?r:null}},{key:"consideration",get:function(){var e=this.isSell?this.bidPrice:this.offerPrice
return("MARKET"===this.orderType?e*this.size:"STOP_MARKET"===this.orderType?this.stopPrice*this.size:this.triggerLevel*this.size)||null}},{key:"considerationInAccountCurrency",get:function(){return this._convertConsiderationToAccountCurrency(this.consideration)}},{key:"priceWithTolerance",get:function(){return this.isBuy?(0,s.round)(this.currentMarketLevel+this.tolerance,10):(0,s.round)(Math.max(this.currentMarketLevel-this.tolerance,.01),10)}},{key:"displayPriceWithTolerance",get:function(){return this.priceWithTolerance.toFixed(this.decimalPlacesFactor)}},{key:"considerationWithTolerance",get:function(){return this.size?this.priceWithTolerance*this.size:null}},{key:"considerationWithToleranceInAccountCurrency",get:function(){return this._convertConsiderationToAccountCurrency(this.considerationWithTolerance)}},{key:"profitLoss",get:function(){var e=this.referencePosition&&this.referencePosition.dealSize,t=this.size
if(!e||!t||"STOP_MARKET"===this.orderType&&!this.stopPrice||this.orderType.includes("LIMIT")&&!this.triggerLevel)return null
var r=void 0
if("MARKET"===this.orderType)r=this.referencePosition.profitLoss
else if(this.orderType.includes("LIMIT")||"STOP_MARKET"===this.orderType){var i=this.orderType.includes("LIMIT")?this.triggerLevel:this.stopPrice
r=(0,o.calculateProfitAndLoss)(i,this.referencePosition.openLevel,this.referencePosition.contractSize,this.referencePosition.dealSize,this.referencePosition.isShort(),this.referencePosition.isPriceTypeBackOnly())}return r/e*t}},{key:"profitLossInAccountCurrency",get:function(){return this.profitLoss&&this.currency.baseExchangeRate?this.profitLoss/this.currency.baseExchangeRate:null}}]),t}(t.default),T(b.prototype,"maxSize",[p],Object.getOwnPropertyDescriptor(b.prototype,"maxSize"),b.prototype),T(b.prototype,"consideration",[f],Object.getOwnPropertyDescriptor(b.prototype,"consideration"),b.prototype),T(b.prototype,"considerationInAccountCurrency",[d],Object.getOwnPropertyDescriptor(b.prototype,"considerationInAccountCurrency"),b.prototype),T(b.prototype,"priceWithTolerance",[y],Object.getOwnPropertyDescriptor(b.prototype,"priceWithTolerance"),b.prototype),T(b.prototype,"displayPriceWithTolerance",[h],Object.getOwnPropertyDescriptor(b.prototype,"displayPriceWithTolerance"),b.prototype),T(b.prototype,"considerationWithTolerance",[v],Object.getOwnPropertyDescriptor(b.prototype,"considerationWithTolerance"),b.prototype),T(b.prototype,"considerationWithToleranceInAccountCurrency",[g],Object.getOwnPropertyDescriptor(b.prototype,"considerationWithToleranceInAccountCurrency"),b.prototype),T(b.prototype,"profitLoss",[_],Object.getOwnPropertyDescriptor(b.prototype,"profitLoss"),b.prototype),T(b.prototype,"profitLossInAccountCurrency",[O],Object.getOwnPropertyDescriptor(b.prototype,"profitLossInAccountCurrency"),b.prototype),b)
e.default=k}.apply(t,i),void 0===n||(e.exports=n)},function(e,t,r){var i
i=function(){"use strict"
function e(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var i in r)e[i]=r[i]}return e}var t=function t(r,i){function n(t,n,o){if("undefined"!=typeof document){"number"==typeof(o=e({},i,o)).expires&&(o.expires=new Date(Date.now()+864e5*o.expires)),o.expires&&(o.expires=o.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape)
var a=""
for(var s in o)o[s]&&(a+="; "+s,!0!==o[s]&&(a+="="+o[s].split(";")[0]))
return document.cookie=t+"="+r.write(n,t)+a}}return Object.create({set:n,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],i={},n=0;n<t.length;n++){var o=t[n].split("="),a=o.slice(1).join("=")
try{var s=decodeURIComponent(o[0])
if(i[s]=r.read(a,s),e===s)break}catch(u){}}return e?i[e]:i}},remove:function(t,r){n(t,"",e({},r,{expires:-1}))},withAttributes:function(r){return t(this.converter,e({},this.attributes,r))},withConverter:function(r){return t(e({},this.converter,r),this.attributes)}},{attributes:{value:Object.freeze(i)},converter:{value:Object.freeze(r)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})
return t},e.exports=i()},function(e,t){e.exports=i},function(e,t,r){var i,n
i=[t,r(38),r(28),r(34),r(26),r(52),r(58),r(102),r(104),r(87),r(107),r(43),r(39),r(24),r(48),r(64),r(108),r(109),r(92),r(93),r(110),r(111),r(65),r(66),r(112),r(113),r(88),r(19),r(82),r(103),r(15),r(50),r(36),r(5),r(94),r(8),r(53),r(54),r(9),r(6),r(96),r(16),r(114),r(29),r(67),r(117),r(27),r(59),r(37),r(60),r(20),r(41),r(55),r(61),r(105),r(97),r(62),r(57),r(98),r(12),r(89),r(35),r(90),r(56),r(115),r(17),r(68),r(116),r(99),r(14),r(30),r(106),r(10),r(86),r(11),r(51),r(91),r(100),r(95),r(40),r(42),r(63),r(101),r(18),r(84),r(83),r(25),r(49),r(85)],n=function(e,t,r,i,n,o,a,s,u,l,c,p,f,d,y,h,v,g,_,O,b,m,T,k,P,S,E,L,w,D,C,I,A,R,j,M,F,N,U,z,x,V,B,G,K,W,q,Q,H,Y,J,Z,X,$,ee,te,re,ie,ne,oe,ae,se,ue,le,ce,pe,fe,de,ye,he,ve,ge,_e,Oe,be,me,Te,ke,Pe,Se,Ee,Le,we,De,Ce,Ie,Ae,Re,je){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.hasWideSpread=e.isNewJapaneseTicket=e.getFirstValidDMAOrderTypeFromMarketData=e.getValidDMAOrderTypesFromMarketData=e.getValidExpiries=e.addDistinct=e.calculateIndicativeCollateralValue=e.calculateProfitLossFromBookCost=e.calculateProfitAndLossPercentage=e.calculateProfitAndLoss=e.calculateAveragePrice=e.WatchlistService=e.V4InstrumentGroupSubscription=e.V2InstrumentGroupSubscription=e.LocalAccountStorage=e.UserPreferencesService=e.User=e.Tolerance=e.TransactionState=e.TicketTypes=e.tfn=e.Stop=e.SignalsStreamingClient=e.ShareDealingTimeInForce=e.ShareDealingSizeUnits=e.ShareDealingService=e.ShareDealingQuoteOrderTicket=e.ShareDealingOrderTypes=e.ShareDealingTicketTypes=e.ShareDealingExchangeOrderTicket=e.SettingsService=e.SettingsProxy=e.Settings=e.Session=e.ServiceEvents=e.SearchService=e.ReportType=e.ReconnectableTradeStore=e.RepeatDealWindowGroupSubscription=e.QuoteService=e.PrioritisedConfirmationStreamingClient=e.PositionStreamingClient=e.PositionService=e.PositionGroupSubscription=e.Position=e.OrderStreamingClient=e.OrderService=e.OrderGroupSubscription=e.Order=e.OPTION_TYPES=e.TurboOrderTicket=e.OpenFifoPositionTicket=e.OpenPositionTicket=e.OpenDMAOrderTicket=e.OpenOrderTicket=e.MTFService=e.Model=e.MarketStatus=e.MarketService=e.MarginService=e.Level=e.KNOCKOUT_TYPES=e.InstrumentsService=e.InstrumentPriceGroupSubscription=e.Instrument=e.IndicativeCostsAndChargesService=e.ICC_EDIT_TYPES=e.ICC_API_STATES=e.Heartbeat=e.GroupSubscription=e.ForeignExchangeGroupSubscription=e.Factory=e.Errors=e.Environment=e.EditShareDealingPositionTicket=e.EditShareDealingOrderTicket=e.EditPositionTicket=e.EditOrderTicket=e.EditDmaOrderTicket=e.DynamicWatchlistService=e.DMAService=e.DeleteShareDealingOrderTicket=e.DeleteMTFOrderTicket=e.EditMTFOrderTicket=e.DeleteOrderTicket=e.DealingEvents=e.DealReferenceGenerator=e.ConfirmationStreamingClient=e.ClosePositionTicket=e.CloseDMAPositionTicket=e.Broker=e.InstrumentPriceAuditGroupSubscription=e.AuditGroupSubscription=e.AlertsStreamingClient=e.AlertService=e.AlertEnums=e.AggregatePosition=void 0,e.AggregatePosition=i.default,e.AlertEnums=n.default,e.AlertService=o.default,e.AlertsStreamingClient=a.default,e.AuditGroupSubscription=s.default,e.InstrumentPriceAuditGroupSubscription=u.default,e.Broker=l.default,e.CloseDMAPositionTicket=c.default,e.ClosePositionTicket=p.default,e.ConfirmationStreamingClient=f.default,e.DealReferenceGenerator=y.default,e.DealingEvents=d.default,e.DeleteOrderTicket=h.default,e.EditMTFOrderTicket=m.default,e.DeleteMTFOrderTicket=v.default,e.DeleteShareDealingOrderTicket=g.default,e.DMAService=_.default,e.DynamicWatchlistService=O.default,e.EditDmaOrderTicket=b.default,e.EditOrderTicket=T.default,e.EditPositionTicket=k.default,e.EditShareDealingOrderTicket=P.default,e.EditShareDealingPositionTicket=S.default,e.Environment=E.default,e.Errors=L.default,e.Factory=w.default,e.ForeignExchangeGroupSubscription=D.default,e.GroupSubscription=C.default
e.Heartbeat=I.default,e.ICC_API_STATES=A.ICC_API_STATES,e.ICC_EDIT_TYPES=A.ICC_EDIT_TYPES,e.IndicativeCostsAndChargesService=A.default,e.Instrument=R.default,e.InstrumentPriceGroupSubscription=Se.default,e.InstrumentsService=j.default,e.KNOCKOUT_TYPES=R.KNOCKOUT_TYPES,e.Level=M.default,e.MarginService=F.default,e.MarketService=N.default,e.MarketStatus=U.default,e.Model=z.default,e.MTFService=x.default,e.OpenOrderTicket=V.default,e.OpenDMAOrderTicket=B.default,e.OpenPositionTicket=G.default,e.OpenFifoPositionTicket=K.default,e.TurboOrderTicket=W.default,e.OPTION_TYPES=R.OPTION_TYPES,e.Order=q.default,e.OrderGroupSubscription=Q.default,e.OrderService=H.default,e.OrderStreamingClient=Y.default,e.Position=J.default,e.PositionGroupSubscription=Z.default,e.PositionService=X.default,e.PositionStreamingClient=$.default,e.PrioritisedConfirmationStreamingClient=ee.default,e.QuoteService=te.default
e.RepeatDealWindowGroupSubscription=re.default,e.ReconnectableTradeStore=ie.default,e.ReportType=r,e.SearchService=ne.default,e.ServiceEvents=oe.default,e.Session=ae.default,e.Settings=se.default,e.SettingsProxy=ue.default,e.SettingsService=le.default,e.ShareDealingExchangeOrderTicket=ce.default,e.ShareDealingTicketTypes=fe.default,e.ShareDealingOrderTypes=pe.default,e.ShareDealingQuoteOrderTicket=de.default,e.ShareDealingService=ye.default,e.ShareDealingSizeUnits=he.default,e.ShareDealingTimeInForce=ve.default,e.SignalsStreamingClient=ge.default,e.Stop=_e.default,e.tfn=Oe.default,e.TicketTypes=be.default,e.TransactionState=t,e.Tolerance=me.default,e.User=Te.default,e.UserPreferencesService=ke.default,e.LocalAccountStorage=Pe.default,e.V2InstrumentGroupSubscription=Ee.default,e.V4InstrumentGroupSubscription=Le.default,e.WatchlistService=we.default,e.calculateAveragePrice=Ie.default,e.calculateProfitAndLoss=De.calculateProfitAndLoss
e.calculateProfitAndLossPercentage=De.calculateProfitAndLossPercentage,e.calculateProfitLossFromBookCost=De.calculateProfitLossFromBookCost,e.calculateIndicativeCollateralValue=Ce.default,e.addDistinct=z.addDistinct,e.getValidExpiries=Ae.getValidExpiries,e.getValidDMAOrderTypesFromMarketData=Ae.getValidDMAOrderTypesFromMarketData,e.getFirstValidDMAOrderTypeFromMarketData=Ae.getFirstValidDMAOrderTypeFromMarketData,e.isNewJapaneseTicket=Re.default,e.hasWideSpread=je.default}.apply(t,i),void 0===n||(e.exports=n)}])})),define("set-util",["exports"],(function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=function(e,t,r){e[t]=r}}))

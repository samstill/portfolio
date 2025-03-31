import{r as m,a as Ci,m as Ei,d as I,R as Ti,j as f,u as Zt,L as pt,f as Fi}from"./index-I4BBwYdS.js";import{F as Oi,a as Vi,b as et,c as zi,d as Mi,e as $i,f as Ni,g as Li,h as Ui,i as qi,j as Qi}from"./index-DjBvL98p.js";import{G as Di}from"./iconBase-VHV16drN.js";import{m as Hi}from"./messageService-BFQPd58Q.js";import{m as Me}from"./proxy-DMLGpHM7.js";import{A as Bi}from"./index-C2QpgPxn.js";function Yi(e){return Di({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M13.66 7c-.56-1.18-1.76-2-3.16-2H6V3h12v2h-3.26c.48.58.84 1.26 1.05 2H18v2h-2.02c-.25 2.8-2.61 5-5.48 5h-.73l6.73 7h-2.77L7 14v-2h3.5c1.76 0 3.22-1.3 3.46-3H6V7h7.66z"},child:[]}]})(e)}var mt=ye(),x=e=>ve(e,mt),gt=ye();x.write=e=>ve(e,gt);var $e=ye();x.onStart=e=>ve(e,$e);var vt=ye();x.onFrame=e=>ve(e,vt);var yt=ye();x.onFinish=e=>ve(e,yt);var X=[];x.setTimeout=(e,t)=>{const i=x.now()+t,n=()=>{const r=X.findIndex(o=>o.cancel==n);~r&&X.splice(r,1),D-=~r?1:0},s={time:i,handler:e,cancel:n};return X.splice(Xt(i),0,s),D+=1,Kt(),s};var Xt=e=>~(~X.findIndex(t=>t.time>e)||~X.length);x.cancel=e=>{$e.delete(e),vt.delete(e),yt.delete(e),mt.delete(e),gt.delete(e)};x.sync=e=>{tt=!0,x.batchedUpdates(e),tt=!1};x.throttle=e=>{let t;function i(){try{e(...t)}finally{t=null}}function n(...s){t=s,x.onStart(i)}return n.handler=e,n.cancel=()=>{$e.delete(i),t=null},n};var bt=typeof window<"u"?window.requestAnimationFrame:()=>{};x.use=e=>bt=e;x.now=typeof performance<"u"?()=>performance.now():Date.now;x.batchedUpdates=e=>e();x.catch=console.error;x.frameLoop="always";x.advance=()=>{x.frameLoop!=="demand"?console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand"):ei()};var Q=-1,D=0,tt=!1;function ve(e,t){tt?(t.delete(e),e(0)):(t.add(e),Kt())}function Kt(){Q<0&&(Q=0,x.frameLoop!=="demand"&&bt(Jt))}function Gi(){Q=-1}function Jt(){~Q&&(bt(Jt),x.batchedUpdates(ei))}function ei(){const e=Q;Q=x.now();const t=Xt(Q);if(t&&(ti(X.splice(0,t),i=>i.handler()),D-=t),!D){Gi();return}$e.flush(),mt.flush(e?Math.min(64,Q-e):16.667),vt.flush(),gt.flush(),yt.flush()}function ye(){let e=new Set,t=e;return{add(i){D+=t==e&&!e.has(i)?1:0,e.add(i)},delete(i){return D-=t==e&&e.has(i)?1:0,e.delete(i)},flush(i){t.size&&(e=new Set,D-=t.size,ti(t,n=>n(i)&&e.add(n)),D+=e.size,t=e)}}}function ti(e,t){e.forEach(i=>{try{t(i)}catch(n){x.catch(n)}})}var Wi=Object.defineProperty,Zi=(e,t)=>{for(var i in t)Wi(e,i,{get:t[i],enumerable:!0})},$={};Zi($,{assign:()=>Ki,colors:()=>H,createStringInterpolator:()=>wt,skipAnimation:()=>ni,to:()=>ii,willAdvance:()=>_t});function it(){}var Xi=(e,t,i)=>Object.defineProperty(e,t,{value:i,writable:!0,configurable:!0}),u={arr:Array.isArray,obj:e=>!!e&&e.constructor.name==="Object",fun:e=>typeof e=="function",str:e=>typeof e=="string",num:e=>typeof e=="number",und:e=>e===void 0};function L(e,t){if(u.arr(e)){if(!u.arr(t)||e.length!==t.length)return!1;for(let i=0;i<e.length;i++)if(e[i]!==t[i])return!1;return!0}return e===t}var P=(e,t)=>e.forEach(t);function U(e,t,i){if(u.arr(e)){for(let n=0;n<e.length;n++)t.call(i,e[n],`${n}`);return}for(const n in e)e.hasOwnProperty(n)&&t.call(i,e[n],n)}var O=e=>u.und(e)?[]:u.arr(e)?e:[e];function re(e,t){if(e.size){const i=Array.from(e);e.clear(),P(i,t)}}var se=(e,...t)=>re(e,i=>i(...t)),xt=()=>typeof window>"u"||!window.navigator||/ServerSideRendering|^Deno\//.test(window.navigator.userAgent),wt,ii,H=null,ni=!1,_t=it,Ki=e=>{e.to&&(ii=e.to),e.now&&(x.now=e.now),e.colors!==void 0&&(H=e.colors),e.skipAnimation!=null&&(ni=e.skipAnimation),e.createStringInterpolator&&(wt=e.createStringInterpolator),e.requestAnimationFrame&&x.use(e.requestAnimationFrame),e.batchedUpdates&&(x.batchedUpdates=e.batchedUpdates),e.willAdvance&&(_t=e.willAdvance),e.frameLoop&&(x.frameLoop=e.frameLoop)},ae=new Set,F=[],He=[],Ce=0,Ne={get idle(){return!ae.size&&!F.length},start(e){Ce>e.priority?(ae.add(e),x.onStart(Ji)):(si(e),x(nt))},advance:nt,sort(e){if(Ce)x.onFrame(()=>Ne.sort(e));else{const t=F.indexOf(e);~t&&(F.splice(t,1),ri(e))}},clear(){F=[],ae.clear()}};function Ji(){ae.forEach(si),ae.clear(),x(nt)}function si(e){F.includes(e)||ri(e)}function ri(e){F.splice(en(F,t=>t.priority>e.priority),0,e)}function nt(e){const t=He;for(let i=0;i<F.length;i++){const n=F[i];Ce=n.priority,n.idle||(_t(n),n.advance(e),n.idle||t.push(n))}return Ce=0,He=F,He.length=0,F=t,F.length>0}function en(e,t){const i=e.findIndex(t);return i<0?e.length:i}var tn=(e,t,i)=>Math.min(Math.max(i,e),t),nn={transparent:0,aliceblue:4042850303,antiquewhite:4209760255,aqua:16777215,aquamarine:2147472639,azure:4043309055,beige:4126530815,bisque:4293182719,black:255,blanchedalmond:4293643775,blue:65535,blueviolet:2318131967,brown:2771004159,burlywood:3736635391,burntsienna:3934150143,cadetblue:1604231423,chartreuse:2147418367,chocolate:3530104575,coral:4286533887,cornflowerblue:1687547391,cornsilk:4294499583,crimson:3692313855,cyan:16777215,darkblue:35839,darkcyan:9145343,darkgoldenrod:3095792639,darkgray:2846468607,darkgreen:6553855,darkgrey:2846468607,darkkhaki:3182914559,darkmagenta:2332068863,darkolivegreen:1433087999,darkorange:4287365375,darkorchid:2570243327,darkred:2332033279,darksalmon:3918953215,darkseagreen:2411499519,darkslateblue:1211993087,darkslategray:793726975,darkslategrey:793726975,darkturquoise:13554175,darkviolet:2483082239,deeppink:4279538687,deepskyblue:12582911,dimgray:1768516095,dimgrey:1768516095,dodgerblue:512819199,firebrick:2988581631,floralwhite:4294635775,forestgreen:579543807,fuchsia:4278255615,gainsboro:3705462015,ghostwhite:4177068031,gold:4292280575,goldenrod:3668254975,gray:2155905279,green:8388863,greenyellow:2919182335,grey:2155905279,honeydew:4043305215,hotpink:4285117695,indianred:3445382399,indigo:1258324735,ivory:4294963455,khaki:4041641215,lavender:3873897215,lavenderblush:4293981695,lawngreen:2096890111,lemonchiffon:4294626815,lightblue:2916673279,lightcoral:4034953471,lightcyan:3774873599,lightgoldenrodyellow:4210742015,lightgray:3553874943,lightgreen:2431553791,lightgrey:3553874943,lightpink:4290167295,lightsalmon:4288707327,lightseagreen:548580095,lightskyblue:2278488831,lightslategray:2005441023,lightslategrey:2005441023,lightsteelblue:2965692159,lightyellow:4294959359,lime:16711935,limegreen:852308735,linen:4210091775,magenta:4278255615,maroon:2147483903,mediumaquamarine:1724754687,mediumblue:52735,mediumorchid:3126187007,mediumpurple:2473647103,mediumseagreen:1018393087,mediumslateblue:2070474495,mediumspringgreen:16423679,mediumturquoise:1221709055,mediumvioletred:3340076543,midnightblue:421097727,mintcream:4127193855,mistyrose:4293190143,moccasin:4293178879,navajowhite:4292783615,navy:33023,oldlace:4260751103,olive:2155872511,olivedrab:1804477439,orange:4289003775,orangered:4282712319,orchid:3664828159,palegoldenrod:4008225535,palegreen:2566625535,paleturquoise:2951671551,palevioletred:3681588223,papayawhip:4293907967,peachpuff:4292524543,peru:3448061951,pink:4290825215,plum:3718307327,powderblue:2967529215,purple:2147516671,rebeccapurple:1714657791,red:4278190335,rosybrown:3163525119,royalblue:1097458175,saddlebrown:2336560127,salmon:4202722047,sandybrown:4104413439,seagreen:780883967,seashell:4294307583,sienna:2689740287,silver:3233857791,skyblue:2278484991,slateblue:1784335871,slategray:1887473919,slategrey:1887473919,snow:4294638335,springgreen:16744447,steelblue:1182971135,tan:3535047935,teal:8421631,thistle:3636451583,tomato:4284696575,turquoise:1088475391,violet:4001558271,wheat:4125012991,white:4294967295,whitesmoke:4126537215,yellow:4294902015,yellowgreen:2597139199},M="[-+]?\\d*\\.?\\d+",Ee=M+"%";function Le(...e){return"\\(\\s*("+e.join(")\\s*,\\s*(")+")\\s*\\)"}var sn=new RegExp("rgb"+Le(M,M,M)),rn=new RegExp("rgba"+Le(M,M,M,M)),an=new RegExp("hsl"+Le(M,Ee,Ee)),on=new RegExp("hsla"+Le(M,Ee,Ee,M)),ln=/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,cn=/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,un=/^#([0-9a-fA-F]{6})$/,dn=/^#([0-9a-fA-F]{8})$/;function fn(e){let t;return typeof e=="number"?e>>>0===e&&e>=0&&e<=4294967295?e:null:(t=un.exec(e))?parseInt(t[1]+"ff",16)>>>0:H&&H[e]!==void 0?H[e]:(t=sn.exec(e))?(Z(t[1])<<24|Z(t[2])<<16|Z(t[3])<<8|255)>>>0:(t=rn.exec(e))?(Z(t[1])<<24|Z(t[2])<<16|Z(t[3])<<8|Rt(t[4]))>>>0:(t=ln.exec(e))?parseInt(t[1]+t[1]+t[2]+t[2]+t[3]+t[3]+"ff",16)>>>0:(t=dn.exec(e))?parseInt(t[1],16)>>>0:(t=cn.exec(e))?parseInt(t[1]+t[1]+t[2]+t[2]+t[3]+t[3]+t[4]+t[4],16)>>>0:(t=an.exec(e))?(At(jt(t[1]),_e(t[2]),_e(t[3]))|255)>>>0:(t=on.exec(e))?(At(jt(t[1]),_e(t[2]),_e(t[3]))|Rt(t[4]))>>>0:null}function Be(e,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?e+(t-e)*6*i:i<1/2?t:i<2/3?e+(t-e)*(2/3-i)*6:e}function At(e,t,i){const n=i<.5?i*(1+t):i+t-i*t,s=2*i-n,r=Be(s,n,e+1/3),o=Be(s,n,e),c=Be(s,n,e-1/3);return Math.round(r*255)<<24|Math.round(o*255)<<16|Math.round(c*255)<<8}function Z(e){const t=parseInt(e,10);return t<0?0:t>255?255:t}function jt(e){return(parseFloat(e)%360+360)%360/360}function Rt(e){const t=parseFloat(e);return t<0?0:t>1?255:Math.round(t*255)}function _e(e){const t=parseFloat(e);return t<0?0:t>100?1:t/100}function Ct(e){let t=fn(e);if(t===null)return e;t=t||0;const i=(t&4278190080)>>>24,n=(t&16711680)>>>16,s=(t&65280)>>>8,r=(t&255)/255;return`rgba(${i}, ${n}, ${s}, ${r})`}var ce=(e,t,i)=>{if(u.fun(e))return e;if(u.arr(e))return ce({range:e,output:t,extrapolate:i});if(u.str(e.output[0]))return wt(e);const n=e,s=n.output,r=n.range||[0,1],o=n.extrapolateLeft||n.extrapolate||"extend",c=n.extrapolateRight||n.extrapolate||"extend",d=n.easing||(a=>a);return a=>{const v=pn(a,r);return hn(a,r[v],r[v+1],s[v],s[v+1],d,o,c,n.map)}};function hn(e,t,i,n,s,r,o,c,d){let a=d?d(e):e;if(a<t){if(o==="identity")return a;o==="clamp"&&(a=t)}if(a>i){if(c==="identity")return a;c==="clamp"&&(a=i)}return n===s?n:t===i?e<=t?n:s:(t===-1/0?a=-a:i===1/0?a=a-t:a=(a-t)/(i-t),a=r(a),n===-1/0?a=-a:s===1/0?a=a+n:a=a*(s-n)+n,a)}function pn(e,t){for(var i=1;i<t.length-1&&!(t[i]>=e);++i);return i-1}var mn=(e,t="end")=>i=>{i=t==="end"?Math.min(i,.999):Math.max(i,.001);const n=i*e,s=t==="end"?Math.floor(n):Math.ceil(n);return tn(0,1,s/e)},Te=1.70158,Se=Te*1.525,Et=Te+1,Tt=2*Math.PI/3,Ft=2*Math.PI/4.5,ke=e=>e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375,gn={linear:e=>e,easeInQuad:e=>e*e,easeOutQuad:e=>1-(1-e)*(1-e),easeInOutQuad:e=>e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2,easeInCubic:e=>e*e*e,easeOutCubic:e=>1-Math.pow(1-e,3),easeInOutCubic:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,easeInQuart:e=>e*e*e*e,easeOutQuart:e=>1-Math.pow(1-e,4),easeInOutQuart:e=>e<.5?8*e*e*e*e:1-Math.pow(-2*e+2,4)/2,easeInQuint:e=>e*e*e*e*e,easeOutQuint:e=>1-Math.pow(1-e,5),easeInOutQuint:e=>e<.5?16*e*e*e*e*e:1-Math.pow(-2*e+2,5)/2,easeInSine:e=>1-Math.cos(e*Math.PI/2),easeOutSine:e=>Math.sin(e*Math.PI/2),easeInOutSine:e=>-(Math.cos(Math.PI*e)-1)/2,easeInExpo:e=>e===0?0:Math.pow(2,10*e-10),easeOutExpo:e=>e===1?1:1-Math.pow(2,-10*e),easeInOutExpo:e=>e===0?0:e===1?1:e<.5?Math.pow(2,20*e-10)/2:(2-Math.pow(2,-20*e+10))/2,easeInCirc:e=>1-Math.sqrt(1-Math.pow(e,2)),easeOutCirc:e=>Math.sqrt(1-Math.pow(e-1,2)),easeInOutCirc:e=>e<.5?(1-Math.sqrt(1-Math.pow(2*e,2)))/2:(Math.sqrt(1-Math.pow(-2*e+2,2))+1)/2,easeInBack:e=>Et*e*e*e-Te*e*e,easeOutBack:e=>1+Et*Math.pow(e-1,3)+Te*Math.pow(e-1,2),easeInOutBack:e=>e<.5?Math.pow(2*e,2)*((Se+1)*2*e-Se)/2:(Math.pow(2*e-2,2)*((Se+1)*(e*2-2)+Se)+2)/2,easeInElastic:e=>e===0?0:e===1?1:-Math.pow(2,10*e-10)*Math.sin((e*10-10.75)*Tt),easeOutElastic:e=>e===0?0:e===1?1:Math.pow(2,-10*e)*Math.sin((e*10-.75)*Tt)+1,easeInOutElastic:e=>e===0?0:e===1?1:e<.5?-(Math.pow(2,20*e-10)*Math.sin((20*e-11.125)*Ft))/2:Math.pow(2,-20*e+10)*Math.sin((20*e-11.125)*Ft)/2+1,easeInBounce:e=>1-ke(1-e),easeOutBounce:ke,easeInOutBounce:e=>e<.5?(1-ke(1-2*e))/2:(1+ke(2*e-1))/2,steps:mn},ue=Symbol.for("FluidValue.get"),J=Symbol.for("FluidValue.observers"),T=e=>!!(e&&e[ue]),R=e=>e&&e[ue]?e[ue]():e,Ot=e=>e[J]||null;function vn(e,t){e.eventObserved?e.eventObserved(t):e(t)}function de(e,t){const i=e[J];i&&i.forEach(n=>{vn(n,t)})}var ai=class{constructor(e){if(!e&&!(e=this.get))throw Error("Unknown getter");yn(this,e)}},yn=(e,t)=>oi(e,ue,t);function be(e,t){if(e[ue]){let i=e[J];i||oi(e,J,i=new Set),i.has(t)||(i.add(t),e.observerAdded&&e.observerAdded(i.size,t))}return t}function fe(e,t){const i=e[J];if(i&&i.has(t)){const n=i.size-1;n?i.delete(t):e[J]=null,e.observerRemoved&&e.observerRemoved(n,t)}}var oi=(e,t,i)=>Object.defineProperty(e,t,{value:i,writable:!0,configurable:!0}),je=/[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,bn=/(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi,Vt=new RegExp(`(${je.source})(%|[a-z]+)`,"i"),xn=/rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi,Ue=/var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/,li=e=>{const[t,i]=wn(e);if(!t||xt())return e;const n=window.getComputedStyle(document.documentElement).getPropertyValue(t);if(n)return n.trim();if(i&&i.startsWith("--")){const s=window.getComputedStyle(document.documentElement).getPropertyValue(i);return s||e}else{if(i&&Ue.test(i))return li(i);if(i)return i}return e},wn=e=>{const t=Ue.exec(e);if(!t)return[,];const[,i,n]=t;return[i,n]},Ye,_n=(e,t,i,n,s)=>`rgba(${Math.round(t)}, ${Math.round(i)}, ${Math.round(n)}, ${s})`,ci=e=>{Ye||(Ye=H?new RegExp(`(${Object.keys(H).join("|")})(?!\\w)`,"g"):/^\b$/);const t=e.output.map(r=>R(r).replace(Ue,li).replace(bn,Ct).replace(Ye,Ct)),i=t.map(r=>r.match(je).map(Number)),s=i[0].map((r,o)=>i.map(c=>{if(!(o in c))throw Error('The arity of each "output" value must be equal');return c[o]})).map(r=>ce({...e,output:r}));return r=>{var d;const o=!Vt.test(t[0])&&((d=t.find(a=>Vt.test(a)))==null?void 0:d.replace(je,""));let c=0;return t[0].replace(je,()=>`${s[c++](r)}${o||""}`).replace(xn,_n)}},ui="react-spring: ",di=e=>{const t=e;let i=!1;if(typeof t!="function")throw new TypeError(`${ui}once requires a function parameter`);return(...n)=>{i||(t(...n),i=!0)}},Sn=di(console.warn);function kn(){Sn(`${ui}The "interpolate" function is deprecated in v9 (use "to" instead)`)}di(console.warn);function qe(e){return u.str(e)&&(e[0]=="#"||/\d/.test(e)||!xt()&&Ue.test(e)||e in(H||{}))}var fi=xt()?m.useEffect:m.useLayoutEffect,In=()=>{const e=m.useRef(!1);return fi(()=>(e.current=!0,()=>{e.current=!1}),[]),e};function Pn(){const e=m.useState()[1],t=In();return()=>{t.current&&e(Math.random())}}function Fe(e,t){const[i]=m.useState(()=>({inputs:t,result:e()})),n=m.useRef(),s=n.current;let r=s;return r?t&&r.inputs&&An(t,r.inputs)||(r={inputs:t,result:e()}):r=i,m.useEffect(()=>{n.current=r,s==i&&(i.inputs=i.result=void 0)},[r]),r.result}function An(e,t){if(e.length!==t.length)return!1;for(let i=0;i<e.length;i++)if(e[i]!==t[i])return!1;return!0}var Oe=e=>m.useEffect(e,jn),jn=[],he=Symbol.for("Animated:node"),Rn=e=>!!e&&e[he]===e,N=e=>e&&e[he],St=(e,t)=>Xi(e,he,t),Qe=e=>e&&e[he]&&e[he].getPayload(),hi=class{constructor(){St(this,this)}getPayload(){return this.payload||[]}},xe=class extends hi{constructor(e){super(),this._value=e,this.done=!0,this.durationProgress=0,u.num(this._value)&&(this.lastPosition=this._value)}static create(e){return new xe(e)}getPayload(){return[this]}getValue(){return this._value}setValue(e,t){return u.num(e)&&(this.lastPosition=e,t&&(e=Math.round(e/t)*t,this.done&&(this.lastPosition=e))),this._value===e?!1:(this._value=e,!0)}reset(){const{done:e}=this;this.done=!1,u.num(this._value)&&(this.elapsedTime=0,this.durationProgress=0,this.lastPosition=this._value,e&&(this.lastVelocity=null),this.v0=null)}},pe=class extends xe{constructor(e){super(0),this._string=null,this._toString=ce({output:[e,e]})}static create(e){return new pe(e)}getValue(){const e=this._string;return e??(this._string=this._toString(this._value))}setValue(e){if(u.str(e)){if(e==this._string)return!1;this._string=e,this._value=1}else if(super.setValue(e))this._string=null;else return!1;return!0}reset(e){e&&(this._toString=ce({output:[this.getValue(),e]})),this._value=0,super.reset()}},Ve={dependencies:null},De=class extends hi{constructor(e){super(),this.source=e,this.setValue(e)}getValue(e){const t={};return U(this.source,(i,n)=>{Rn(i)?t[n]=i.getValue(e):T(i)?t[n]=R(i):e||(t[n]=i)}),t}setValue(e){this.source=e,this.payload=this._makePayload(e)}reset(){this.payload&&P(this.payload,e=>e.reset())}_makePayload(e){if(e){const t=new Set;return U(e,this._addToPayload,t),Array.from(t)}}_addToPayload(e){Ve.dependencies&&T(e)&&Ve.dependencies.add(e);const t=Qe(e);t&&P(t,i=>this.add(i))}},pi=class extends De{constructor(e){super(e)}static create(e){return new pi(e)}getValue(){return this.source.map(e=>e.getValue())}setValue(e){const t=this.getPayload();return e.length==t.length?t.map((i,n)=>i.setValue(e[n])).some(Boolean):(super.setValue(e.map(Cn)),!0)}};function Cn(e){return(qe(e)?pe:xe).create(e)}function st(e){const t=N(e);return t?t.constructor:u.arr(e)?pi:qe(e)?pe:xe}var zt=(e,t)=>{const i=!u.fun(e)||e.prototype&&e.prototype.isReactComponent;return m.forwardRef((n,s)=>{const r=m.useRef(null),o=i&&m.useCallback(g=>{r.current=Fn(s,g)},[s]),[c,d]=Tn(n,t),a=Pn(),v=()=>{const g=r.current;if(i&&!g)return;(g?t.applyAnimatedValues(g,c.getValue(!0)):!1)===!1&&a()},h=new En(v,d),p=m.useRef();fi(()=>(p.current=h,P(d,g=>be(g,h)),()=>{p.current&&(P(p.current.deps,g=>fe(g,p.current)),x.cancel(p.current.update))})),m.useEffect(v,[]),Oe(()=>()=>{const g=p.current;P(g.deps,y=>fe(y,g))});const l=t.getComponentProps(c.getValue());return m.createElement(e,{...l,ref:o})})},En=class{constructor(e,t){this.update=e,this.deps=t}eventObserved(e){e.type=="change"&&x.write(this.update)}};function Tn(e,t){const i=new Set;return Ve.dependencies=i,e.style&&(e={...e,style:t.createAnimatedStyle(e.style)}),e=new De(e),Ve.dependencies=null,[e,i]}function Fn(e,t){return e&&(u.fun(e)?e(t):e.current=t),t}var Mt=Symbol.for("AnimatedComponent"),On=(e,{applyAnimatedValues:t=()=>!1,createAnimatedStyle:i=s=>new De(s),getComponentProps:n=s=>s}={})=>{const s={applyAnimatedValues:t,createAnimatedStyle:i,getComponentProps:n},r=o=>{const c=$t(o)||"Anonymous";return u.str(o)?o=r[o]||(r[o]=zt(o,s)):o=o[Mt]||(o[Mt]=zt(o,s)),o.displayName=`Animated(${c})`,o};return U(e,(o,c)=>{u.arr(e)&&(c=$t(o)),r[c]=r(o)}),{animated:r}},$t=e=>u.str(e)?e:e&&u.str(e.displayName)?e.displayName:u.fun(e)&&e.name||null;function B(e,...t){return u.fun(e)?e(...t):e}var oe=(e,t)=>e===!0||!!(t&&e&&(u.fun(e)?e(t):O(e).includes(t))),mi=(e,t)=>u.obj(e)?t&&e[t]:e,gi=(e,t)=>e.default===!0?e[t]:e.default?e.default[t]:void 0,Vn=e=>e,vi=(e,t=Vn)=>{let i=zn;e.default&&e.default!==!0&&(e=e.default,i=Object.keys(e));const n={};for(const s of i){const r=t(e[s],s);u.und(r)||(n[s]=r)}return n},zn=["config","onProps","onStart","onChange","onPause","onResume","onRest"],Mn={config:1,from:1,to:1,ref:1,loop:1,reset:1,pause:1,cancel:1,reverse:1,immediate:1,default:1,delay:1,onProps:1,onStart:1,onChange:1,onPause:1,onResume:1,onRest:1,onResolve:1,items:1,trail:1,sort:1,expires:1,initial:1,enter:1,update:1,leave:1,children:1,onDestroyed:1,keys:1,callId:1,parentId:1};function $n(e){const t={};let i=0;if(U(e,(n,s)=>{Mn[s]||(t[s]=n,i++)}),i)return t}function yi(e){const t=$n(e);if(t){const i={to:t};return U(e,(n,s)=>s in t||(i[s]=n)),i}return{...e}}function me(e){return e=R(e),u.arr(e)?e.map(me):qe(e)?$.createStringInterpolator({range:[0,1],output:[e,e]})(1):e}function rt(e){return u.fun(e)||u.arr(e)&&u.obj(e[0])}var bi={default:{tension:170,friction:26},gentle:{tension:120,friction:14},wobbly:{tension:180,friction:12},stiff:{tension:210,friction:20},slow:{tension:280,friction:60},molasses:{tension:280,friction:120}},at={...bi.default,mass:1,damping:1,easing:gn.linear,clamp:!1},Nn=class{constructor(){this.velocity=0,Object.assign(this,at)}};function Ln(e,t,i){i&&(i={...i},Nt(i,t),t={...i,...t}),Nt(e,t),Object.assign(e,t);for(const o in at)e[o]==null&&(e[o]=at[o]);let{frequency:n,damping:s}=e;const{mass:r}=e;return u.und(n)||(n<.01&&(n=.01),s<0&&(s=0),e.tension=Math.pow(2*Math.PI/n,2)*r,e.friction=4*Math.PI*s*r/n),e}function Nt(e,t){if(!u.und(t.decay))e.duration=void 0;else{const i=!u.und(t.tension)||!u.und(t.friction);(i||!u.und(t.frequency)||!u.und(t.damping)||!u.und(t.mass))&&(e.duration=void 0,e.decay=void 0),i&&(e.frequency=void 0)}}var Lt=[],Un=class{constructor(){this.changed=!1,this.values=Lt,this.toValues=null,this.fromValues=Lt,this.config=new Nn,this.immediate=!1}};function xi(e,{key:t,props:i,defaultProps:n,state:s,actions:r}){return new Promise((o,c)=>{let d,a,v=oe(i.cancel??(n==null?void 0:n.cancel),t);if(v)l();else{u.und(i.pause)||(s.paused=oe(i.pause,t));let g=n==null?void 0:n.pause;g!==!0&&(g=s.paused||oe(g,t)),d=B(i.delay||0,t),g?(s.resumeQueue.add(p),r.pause()):(r.resume(),p())}function h(){s.resumeQueue.add(p),s.timeouts.delete(a),a.cancel(),d=a.time-x.now()}function p(){d>0&&!$.skipAnimation?(s.delayed=!0,a=x.setTimeout(l,d),s.pauseQueue.add(h),s.timeouts.add(a)):l()}function l(){s.delayed&&(s.delayed=!1),s.pauseQueue.delete(h),s.timeouts.delete(a),e<=(s.cancelId||0)&&(v=!0);try{r.start({...i,callId:e,cancel:v},o)}catch(g){c(g)}}})}var kt=(e,t)=>t.length==1?t[0]:t.some(i=>i.cancelled)?K(e.get()):t.every(i=>i.noop)?wi(e.get()):z(e.get(),t.every(i=>i.finished)),wi=e=>({value:e,noop:!0,finished:!0,cancelled:!1}),z=(e,t,i=!1)=>({value:e,finished:t,cancelled:i}),K=e=>({value:e,cancelled:!0,finished:!1});function _i(e,t,i,n){const{callId:s,parentId:r,onRest:o}=t,{asyncTo:c,promise:d}=i;return!r&&e===c&&!t.reset?d:i.promise=(async()=>{i.asyncId=s,i.asyncTo=e;const a=vi(t,(w,S)=>S==="onRest"?void 0:w);let v,h;const p=new Promise((w,S)=>(v=w,h=S)),l=w=>{const S=s<=(i.cancelId||0)&&K(n)||s!==i.asyncId&&z(n,!1);if(S)throw w.result=S,h(w),w},g=(w,S)=>{const _=new Ut,b=new qt;return(async()=>{if($.skipAnimation)throw ge(i),b.result=z(n,!1),h(b),b;l(_);const k=u.obj(w)?{...w}:{...S,to:w};k.parentId=s,U(a,(j,C)=>{u.und(k[C])&&(k[C]=j)});const A=await n.start(k);return l(_),i.paused&&await new Promise(j=>{i.resumeQueue.add(j)}),A})()};let y;if($.skipAnimation)return ge(i),z(n,!1);try{let w;u.arr(e)?w=(async S=>{for(const _ of S)await g(_)})(e):w=Promise.resolve(e(g,n.stop.bind(n))),await Promise.all([w.then(v),p]),y=z(n.get(),!0,!1)}catch(w){if(w instanceof Ut)y=w.result;else if(w instanceof qt)y=w.result;else throw w}finally{s==i.asyncId&&(i.asyncId=r,i.asyncTo=r?c:void 0,i.promise=r?d:void 0)}return u.fun(o)&&x.batchedUpdates(()=>{o(y,n,n.item)}),y})()}function ge(e,t){re(e.timeouts,i=>i.cancel()),e.pauseQueue.clear(),e.resumeQueue.clear(),e.asyncId=e.asyncTo=e.promise=void 0,t&&(e.cancelId=t)}var Ut=class extends Error{constructor(){super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise.")}},qt=class extends Error{constructor(){super("SkipAnimationSignal")}},ot=e=>e instanceof It,qn=1,It=class extends ai{constructor(){super(...arguments),this.id=qn++,this._priority=0}get priority(){return this._priority}set priority(e){this._priority!=e&&(this._priority=e,this._onPriorityChange(e))}get(){const e=N(this);return e&&e.getValue()}to(...e){return $.to(this,e)}interpolate(...e){return kn(),$.to(this,e)}toJSON(){return this.get()}observerAdded(e){e==1&&this._attach()}observerRemoved(e){e==0&&this._detach()}_attach(){}_detach(){}_onChange(e,t=!1){de(this,{type:"change",parent:this,value:e,idle:t})}_onPriorityChange(e){this.idle||Ne.sort(this),de(this,{type:"priority",parent:this,priority:e})}},Y=Symbol.for("SpringPhase"),Si=1,lt=2,ct=4,Ge=e=>(e[Y]&Si)>0,q=e=>(e[Y]&lt)>0,te=e=>(e[Y]&ct)>0,Qt=(e,t)=>t?e[Y]|=lt|Si:e[Y]&=~lt,Dt=(e,t)=>t?e[Y]|=ct:e[Y]&=~ct,Qn=class extends It{constructor(e,t){if(super(),this.animation=new Un,this.defaultProps={},this._state={paused:!1,delayed:!1,pauseQueue:new Set,resumeQueue:new Set,timeouts:new Set},this._pendingCalls=new Set,this._lastCallId=0,this._lastToId=0,this._memoizedDuration=0,!u.und(e)||!u.und(t)){const i=u.obj(e)?{...e}:{...t,from:e};u.und(i.default)&&(i.default=!0),this.start(i)}}get idle(){return!(q(this)||this._state.asyncTo)||te(this)}get goal(){return R(this.animation.to)}get velocity(){const e=N(this);return e instanceof xe?e.lastVelocity||0:e.getPayload().map(t=>t.lastVelocity||0)}get hasAnimated(){return Ge(this)}get isAnimating(){return q(this)}get isPaused(){return te(this)}get isDelayed(){return this._state.delayed}advance(e){let t=!0,i=!1;const n=this.animation;let{toValues:s}=n;const{config:r}=n,o=Qe(n.to);!o&&T(n.to)&&(s=O(R(n.to))),n.values.forEach((a,v)=>{if(a.done)return;const h=a.constructor==pe?1:o?o[v].lastPosition:s[v];let p=n.immediate,l=h;if(!p){if(l=a.lastPosition,r.tension<=0){a.done=!0;return}let g=a.elapsedTime+=e;const y=n.fromValues[v],w=a.v0!=null?a.v0:a.v0=u.arr(r.velocity)?r.velocity[v]:r.velocity;let S;const _=r.precision||(y==h?.005:Math.min(1,Math.abs(h-y)*.001));if(u.und(r.duration))if(r.decay){const b=r.decay===!0?.998:r.decay,k=Math.exp(-(1-b)*g);l=y+w/(1-b)*(1-k),p=Math.abs(a.lastPosition-l)<=_,S=w*k}else{S=a.lastVelocity==null?w:a.lastVelocity;const b=r.restVelocity||_/10,k=r.clamp?0:r.bounce,A=!u.und(k),j=y==h?a.v0>0:y<h;let C,we=!1;const E=1,ee=Math.ceil(e/E);for(let V=0;V<ee&&(C=Math.abs(S)>b,!(!C&&(p=Math.abs(h-l)<=_,p)));++V){A&&(we=l==h||l>h==j,we&&(S=-S*k,l=h));const G=-r.tension*1e-6*(l-h),W=-r.friction*.001*S,Ri=(G+W)/r.mass;S=S+Ri*E,l=l+S*E}}else{let b=1;r.duration>0&&(this._memoizedDuration!==r.duration&&(this._memoizedDuration=r.duration,a.durationProgress>0&&(a.elapsedTime=r.duration*a.durationProgress,g=a.elapsedTime+=e)),b=(r.progress||0)+g/this._memoizedDuration,b=b>1?1:b<0?0:b,a.durationProgress=b),l=y+r.easing(b)*(h-y),S=(l-a.lastPosition)/e,p=b==1}a.lastVelocity=S,Number.isNaN(l)&&(console.warn("Got NaN while animating:",this),p=!0)}o&&!o[v].done&&(p=!1),p?a.done=!0:t=!1,a.setValue(l,r.round)&&(i=!0)});const c=N(this),d=c.getValue();if(t){const a=R(n.to);(d!==a||i)&&!r.decay?(c.setValue(a),this._onChange(a)):i&&r.decay&&this._onChange(d),this._stop()}else i&&this._onChange(d)}set(e){return x.batchedUpdates(()=>{this._stop(),this._focus(e),this._set(e)}),this}pause(){this._update({pause:!0})}resume(){this._update({pause:!1})}finish(){if(q(this)){const{to:e,config:t}=this.animation;x.batchedUpdates(()=>{this._onStart(),t.decay||this._set(e,!1),this._stop()})}return this}update(e){return(this.queue||(this.queue=[])).push(e),this}start(e,t){let i;return u.und(e)?(i=this.queue||[],this.queue=[]):i=[u.obj(e)?e:{...t,to:e}],Promise.all(i.map(n=>this._update(n))).then(n=>kt(this,n))}stop(e){const{to:t}=this.animation;return this._focus(this.get()),ge(this._state,e&&this._lastCallId),x.batchedUpdates(()=>this._stop(t,e)),this}reset(){this._update({reset:!0})}eventObserved(e){e.type=="change"?this._start():e.type=="priority"&&(this.priority=e.priority+1)}_prepareNode(e){const t=this.key||"";let{to:i,from:n}=e;i=u.obj(i)?i[t]:i,(i==null||rt(i))&&(i=void 0),n=u.obj(n)?n[t]:n,n==null&&(n=void 0);const s={to:i,from:n};return Ge(this)||(e.reverse&&([i,n]=[n,i]),n=R(n),u.und(n)?N(this)||this._set(i):this._set(n)),s}_update({...e},t){const{key:i,defaultProps:n}=this;e.default&&Object.assign(n,vi(e,(o,c)=>/^on/.test(c)?mi(o,i):o)),Bt(this,e,"onProps"),ne(this,"onProps",e,this);const s=this._prepareNode(e);if(Object.isFrozen(this))throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");const r=this._state;return xi(++this._lastCallId,{key:i,props:e,defaultProps:n,state:r,actions:{pause:()=>{te(this)||(Dt(this,!0),se(r.pauseQueue),ne(this,"onPause",z(this,ie(this,this.animation.to)),this))},resume:()=>{te(this)&&(Dt(this,!1),q(this)&&this._resume(),se(r.resumeQueue),ne(this,"onResume",z(this,ie(this,this.animation.to)),this))},start:this._merge.bind(this,s)}}).then(o=>{if(e.loop&&o.finished&&!(t&&o.noop)){const c=ki(e);if(c)return this._update(c,!0)}return o})}_merge(e,t,i){if(t.cancel)return this.stop(!0),i(K(this));const n=!u.und(e.to),s=!u.und(e.from);if(n||s)if(t.callId>this._lastToId)this._lastToId=t.callId;else return i(K(this));const{key:r,defaultProps:o,animation:c}=this,{to:d,from:a}=c;let{to:v=d,from:h=a}=e;s&&!n&&(!t.default||u.und(v))&&(v=h),t.reverse&&([v,h]=[h,v]);const p=!L(h,a);p&&(c.from=h),h=R(h);const l=!L(v,d);l&&this._focus(v);const g=rt(t.to),{config:y}=c,{decay:w,velocity:S}=y;(n||s)&&(y.velocity=0),t.config&&!g&&Ln(y,B(t.config,r),t.config!==o.config?B(o.config,r):void 0);let _=N(this);if(!_||u.und(v))return i(z(this,!0));const b=u.und(t.reset)?s&&!t.default:!u.und(h)&&oe(t.reset,r),k=b?h:this.get(),A=me(v),j=u.num(A)||u.arr(A)||qe(A),C=!g&&(!j||oe(o.immediate||t.immediate,r));if(l){const V=st(v);if(V!==_.constructor)if(C)_=this._set(A);else throw Error(`Cannot animate between ${_.constructor.name} and ${V.name}, as the "to" prop suggests`)}const we=_.constructor;let E=T(v),ee=!1;if(!E){const V=b||!Ge(this)&&p;(l||V)&&(ee=L(me(k),A),E=!ee),(!L(c.immediate,C)&&!C||!L(y.decay,w)||!L(y.velocity,S))&&(E=!0)}if(ee&&q(this)&&(c.changed&&!b?E=!0:E||this._stop(d)),!g&&((E||T(d))&&(c.values=_.getPayload(),c.toValues=T(v)?null:we==pe?[1]:O(A)),c.immediate!=C&&(c.immediate=C,!C&&!b&&this._set(d)),E)){const{onRest:V}=c;P(Dn,W=>Bt(this,t,W));const G=z(this,ie(this,d));se(this._pendingCalls,G),this._pendingCalls.add(i),c.changed&&x.batchedUpdates(()=>{var W;c.changed=!b,V==null||V(G,this),b?B(o.onRest,G):(W=c.onStart)==null||W.call(c,G,this)})}b&&this._set(k),g?i(_i(t.to,t,this._state,this)):E?this._start():q(this)&&!l?this._pendingCalls.add(i):i(wi(k))}_focus(e){const t=this.animation;e!==t.to&&(Ot(this)&&this._detach(),t.to=e,Ot(this)&&this._attach())}_attach(){let e=0;const{to:t}=this.animation;T(t)&&(be(t,this),ot(t)&&(e=t.priority+1)),this.priority=e}_detach(){const{to:e}=this.animation;T(e)&&fe(e,this)}_set(e,t=!0){const i=R(e);if(!u.und(i)){const n=N(this);if(!n||!L(i,n.getValue())){const s=st(i);!n||n.constructor!=s?St(this,s.create(i)):n.setValue(i),n&&x.batchedUpdates(()=>{this._onChange(i,t)})}}return N(this)}_onStart(){const e=this.animation;e.changed||(e.changed=!0,ne(this,"onStart",z(this,ie(this,e.to)),this))}_onChange(e,t){t||(this._onStart(),B(this.animation.onChange,e,this)),B(this.defaultProps.onChange,e,this),super._onChange(e,t)}_start(){const e=this.animation;N(this).reset(R(e.to)),e.immediate||(e.fromValues=e.values.map(t=>t.lastPosition)),q(this)||(Qt(this,!0),te(this)||this._resume())}_resume(){$.skipAnimation?this.finish():Ne.start(this)}_stop(e,t){if(q(this)){Qt(this,!1);const i=this.animation;P(i.values,s=>{s.done=!0}),i.toValues&&(i.onChange=i.onPause=i.onResume=void 0),de(this,{type:"idle",parent:this});const n=t?K(this.get()):z(this.get(),ie(this,e??i.to));se(this._pendingCalls,n),i.changed&&(i.changed=!1,ne(this,"onRest",n,this))}}};function ie(e,t){const i=me(t),n=me(e.get());return L(n,i)}function ki(e,t=e.loop,i=e.to){const n=B(t);if(n){const s=n!==!0&&yi(n),r=(s||e).reverse,o=!s||s.reset;return ut({...e,loop:t,default:!1,pause:void 0,to:!r||rt(i)?i:void 0,from:o?e.from:void 0,reset:o,...s})}}function ut(e){const{to:t,from:i}=e=yi(e),n=new Set;return u.obj(t)&&Ht(t,n),u.obj(i)&&Ht(i,n),e.keys=n.size?Array.from(n):null,e}function Ht(e,t){U(e,(i,n)=>i!=null&&t.add(n))}var Dn=["onStart","onRest","onChange","onPause","onResume"];function Bt(e,t,i){e.animation[i]=t[i]!==gi(t,i)?mi(t[i],e.key):void 0}function ne(e,t,...i){var n,s,r,o;(s=(n=e.animation)[t])==null||s.call(n,...i),(o=(r=e.defaultProps)[t])==null||o.call(r,...i)}var Hn=["onStart","onChange","onRest"],Bn=1,Ii=class{constructor(e,t){this.id=Bn++,this.springs={},this.queue=[],this._lastAsyncId=0,this._active=new Set,this._changed=new Set,this._started=!1,this._state={paused:!1,pauseQueue:new Set,resumeQueue:new Set,timeouts:new Set},this._events={onStart:new Map,onChange:new Map,onRest:new Map},this._onFrame=this._onFrame.bind(this),t&&(this._flush=t),e&&this.start({default:!0,...e})}get idle(){return!this._state.asyncTo&&Object.values(this.springs).every(e=>e.idle&&!e.isDelayed&&!e.isPaused)}get item(){return this._item}set item(e){this._item=e}get(){const e={};return this.each((t,i)=>e[i]=t.get()),e}set(e){for(const t in e){const i=e[t];u.und(i)||this.springs[t].set(i)}}update(e){return e&&this.queue.push(ut(e)),this}start(e){let{queue:t}=this;return e?t=O(e).map(ut):this.queue=[],this._flush?this._flush(this,t):(Ai(this,t),Yn(this,t))}stop(e,t){if(e!==!!e&&(t=e),t){const i=this.springs;P(O(t),n=>i[n].stop(!!e))}else ge(this._state,this._lastAsyncId),this.each(i=>i.stop(!!e));return this}pause(e){if(u.und(e))this.start({pause:!0});else{const t=this.springs;P(O(e),i=>t[i].pause())}return this}resume(e){if(u.und(e))this.start({pause:!1});else{const t=this.springs;P(O(e),i=>t[i].resume())}return this}each(e){U(this.springs,e)}_onFrame(){const{onStart:e,onChange:t,onRest:i}=this._events,n=this._active.size>0,s=this._changed.size>0;(n&&!this._started||s&&!this._started)&&(this._started=!0,re(e,([c,d])=>{d.value=this.get(),c(d,this,this._item)}));const r=!n&&this._started,o=s||r&&i.size?this.get():null;s&&t.size&&re(t,([c,d])=>{d.value=o,c(d,this,this._item)}),r&&(this._started=!1,re(i,([c,d])=>{d.value=o,c(d,this,this._item)}))}eventObserved(e){if(e.type=="change")this._changed.add(e.parent),e.idle||this._active.add(e.parent);else if(e.type=="idle")this._active.delete(e.parent);else return;x.onFrame(this._onFrame)}};function Yn(e,t){return Promise.all(t.map(i=>Pi(e,i))).then(i=>kt(e,i))}async function Pi(e,t,i){const{keys:n,to:s,from:r,loop:o,onRest:c,onResolve:d}=t,a=u.obj(t.default)&&t.default;o&&(t.loop=!1),s===!1&&(t.to=null),r===!1&&(t.from=null);const v=u.arr(s)||u.fun(s)?s:void 0;v?(t.to=void 0,t.onRest=void 0,a&&(a.onRest=void 0)):P(Hn,y=>{const w=t[y];if(u.fun(w)){const S=e._events[y];t[y]=({finished:_,cancelled:b})=>{const k=S.get(w);k?(_||(k.finished=!1),b&&(k.cancelled=!0)):S.set(w,{value:null,finished:_||!1,cancelled:b||!1})},a&&(a[y]=t[y])}});const h=e._state;t.pause===!h.paused?(h.paused=t.pause,se(t.pause?h.pauseQueue:h.resumeQueue)):h.paused&&(t.pause=!0);const p=(n||Object.keys(e.springs)).map(y=>e.springs[y].start(t)),l=t.cancel===!0||gi(t,"cancel")===!0;(v||l&&h.asyncId)&&p.push(xi(++e._lastAsyncId,{props:t,state:h,actions:{pause:it,resume:it,start(y,w){l?(ge(h,e._lastAsyncId),w(K(e))):(y.onRest=c,w(_i(v,y,h,e)))}}})),h.paused&&await new Promise(y=>{h.resumeQueue.add(y)});const g=kt(e,await Promise.all(p));if(o&&g.finished&&!(i&&g.noop)){const y=ki(t,o,s);if(y)return Ai(e,[y]),Pi(e,y,!0)}return d&&x.batchedUpdates(()=>d(g,e,e.item)),g}function Gn(e,t){const i=new Qn;return i.key=e,t&&be(i,t),i}function Wn(e,t,i){t.keys&&P(t.keys,n=>{(e[n]||(e[n]=i(n)))._prepareNode(t)})}function Ai(e,t){P(t,i=>{Wn(e.springs,i,n=>Gn(n,e))})}var Pt=({children:e,...t})=>{const i=m.useContext(ze),n=t.pause||!!i.pause,s=t.immediate||!!i.immediate;t=Fe(()=>({pause:n,immediate:s}),[n,s]);const{Provider:r}=ze;return m.createElement(r,{value:t},e)},ze=Zn(Pt,{});Pt.Provider=ze.Provider;Pt.Consumer=ze.Consumer;function Zn(e,t){return Object.assign(e,m.createContext(t)),e.Provider._context=e,e.Consumer._context=e,e}var Xn=class extends It{constructor(e,t){super(),this.source=e,this.idle=!0,this._active=new Set,this.calc=ce(...t);const i=this._get(),n=st(i);St(this,n.create(i))}advance(e){const t=this._get(),i=this.get();L(t,i)||(N(this).setValue(t),this._onChange(t,this.idle)),!this.idle&&Yt(this._active)&&We(this)}_get(){const e=u.arr(this.source)?this.source.map(R):O(R(this.source));return this.calc(...e)}_start(){this.idle&&!Yt(this._active)&&(this.idle=!1,P(Qe(this),e=>{e.done=!1}),$.skipAnimation?(x.batchedUpdates(()=>this.advance()),We(this)):Ne.start(this))}_attach(){let e=1;P(O(this.source),t=>{T(t)&&be(t,this),ot(t)&&(t.idle||this._active.add(t),e=Math.max(e,t.priority+1))}),this.priority=e,this._start()}_detach(){P(O(this.source),e=>{T(e)&&fe(e,this)}),this._active.clear(),We(this)}eventObserved(e){e.type=="change"?e.idle?this.advance():(this._active.add(e.parent),this._start()):e.type=="idle"?this._active.delete(e.parent):e.type=="priority"&&(this.priority=O(this.source).reduce((t,i)=>Math.max(t,(ot(i)?i.priority:0)+1),0))}};function Kn(e){return e.idle!==!1}function Yt(e){return!e.size||Array.from(e).every(Kn)}function We(e){e.idle||(e.idle=!0,P(Qe(e),t=>{t.done=!0}),de(e,{type:"idle",parent:e}))}$.assign({createStringInterpolator:ci,to:(e,t)=>new Xn(e,t)});var ji=/^--/;function Jn(e,t){return t==null||typeof t=="boolean"||t===""?"":typeof t=="number"&&t!==0&&!ji.test(e)&&!(le.hasOwnProperty(e)&&le[e])?t+"px":(""+t).trim()}var Gt={};function es(e,t){if(!e.nodeType||!e.setAttribute)return!1;const i=e.nodeName==="filter"||e.parentNode&&e.parentNode.nodeName==="filter",{className:n,style:s,children:r,scrollTop:o,scrollLeft:c,viewBox:d,...a}=t,v=Object.values(a),h=Object.keys(a).map(p=>i||e.hasAttribute(p)?p:Gt[p]||(Gt[p]=p.replace(/([A-Z])/g,l=>"-"+l.toLowerCase())));r!==void 0&&(e.textContent=r);for(const p in s)if(s.hasOwnProperty(p)){const l=Jn(p,s[p]);ji.test(p)?e.style.setProperty(p,l):e.style[p]=l}h.forEach((p,l)=>{e.setAttribute(p,v[l])}),n!==void 0&&(e.className=n),o!==void 0&&(e.scrollTop=o),c!==void 0&&(e.scrollLeft=c),d!==void 0&&e.setAttribute("viewBox",d)}var le={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ts=(e,t)=>e+t.charAt(0).toUpperCase()+t.substring(1),is=["Webkit","Ms","Moz","O"];le=Object.keys(le).reduce((e,t)=>(is.forEach(i=>e[ts(i,t)]=e[t]),e),le);var ns=/^(matrix|translate|scale|rotate|skew)/,ss=/^(translate)/,rs=/^(rotate|skew)/,Ze=(e,t)=>u.num(e)&&e!==0?e+t:e,Re=(e,t)=>u.arr(e)?e.every(i=>Re(i,t)):u.num(e)?e===t:parseFloat(e)===t,as=class extends De{constructor({x:e,y:t,z:i,...n}){const s=[],r=[];(e||t||i)&&(s.push([e||0,t||0,i||0]),r.push(o=>[`translate3d(${o.map(c=>Ze(c,"px")).join(",")})`,Re(o,0)])),U(n,(o,c)=>{if(c==="transform")s.push([o||""]),r.push(d=>[d,d===""]);else if(ns.test(c)){if(delete n[c],u.und(o))return;const d=ss.test(c)?"px":rs.test(c)?"deg":"";s.push(O(o)),r.push(c==="rotate3d"?([a,v,h,p])=>[`rotate3d(${a},${v},${h},${Ze(p,d)})`,Re(p,0)]:a=>[`${c}(${a.map(v=>Ze(v,d)).join(",")})`,Re(a,c.startsWith("scale")?1:0)])}}),s.length&&(n.transform=new os(s,r)),super(n)}},os=class extends ai{constructor(e,t){super(),this.inputs=e,this.transforms=t,this._value=null}get(){return this._value||(this._value=this._get())}_get(){let e="",t=!0;return P(this.inputs,(i,n)=>{const s=R(i[0]),[r,o]=this.transforms[n](u.arr(s)?s:i.map(R));e+=" "+r,t=t&&o}),t?"none":e}observerAdded(e){e==1&&P(this.inputs,t=>P(t,i=>T(i)&&be(i,this)))}observerRemoved(e){e==0&&P(this.inputs,t=>P(t,i=>T(i)&&fe(i,this)))}eventObserved(e){e.type=="change"&&(this._value=null),de(this,e)}},ls=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"];$.assign({batchedUpdates:Ci.unstable_batchedUpdates,createStringInterpolator:ci,colors:nn});var cs=On(ls,{applyAnimatedValues:es,createAnimatedStyle:e=>new as(e),getComponentProps:({scrollTop:e,scrollLeft:t,...i})=>i}),dt=cs.animated,ft=m.createContext(null);function Xe(e){return e?"scrollLeft":"scrollTop"}function ht(e,t){const i=n=>n.type?n.type===m.Fragment:n===m.Fragment;return m.Children.map(e,n=>i(n)?ht(n.props.children,t):t(n))}var Wt="translate3d(0px,0px,0px)",Ie="translate(0px,0px)",Ke=m.memo(m.forwardRef(({horizontal:e,factor:t=1,offset:i=0,speed:n=0,sticky:s,...r},o)=>{const c=m.useContext(ft),d=Fe(()=>{let l;if(s)l=(s.start||0)*c.space;else{const g=Math.floor(i)*c.space,y=c.space*i+g*n;l=-(c.current*n)+y}return new Ii({space:s?c.space:c.space*t,translate:l})},[]),a=Fe(()=>({horizontal:e===void 0||s?c.horizontal:e,sticky:void 0,isSticky:!1,setPosition(l,g,y=!1){if(s)h(l,g);else{const w=Math.floor(i)*l,S=l*i+w*n;d.start({translate:-(g*n)+S,config:c.config,immediate:y})}},setHeight(l,g=!1){d.start({space:s?l:l*t,config:c.config,immediate:g})}}),[]);Oe(()=>{if(s){const l=s.start||0,g=s.end||l+1;a.sticky={start:l,end:g}}}),m.useImperativeHandle(o,()=>a);const v=m.useRef(),h=(l,g)=>{const y=a.sticky.start*l,w=a.sticky.end*l,S=g>=y&&g<=w;if(S===a.isSticky)return;a.isSticky=S;const _=v.current;_.style.position=S?"sticky":"absolute",d.set({translate:S?0:g<y?y:w})};Oe(()=>{if(c)return c.layers.add(a),c.update(),()=>{c.layers.delete(a),c.update()}});const p=d.springs.translate.to(a.horizontal?l=>`translate3d(${l}px,0,0)`:l=>`translate3d(0,${l}px,0)`);return m.createElement(dt.div,{...r,ref:v,style:{position:"absolute",top:0,bottom:0,left:0,right:0,backgroundSize:"auto",backgroundRepeat:"no-repeat",willChange:"transform",[a.horizontal?"height":"width"]:"100%",[a.horizontal?"width":"height"]:d.springs.space,WebkitTransform:p,msTransform:p,transform:p,...r.style}})})),us=m.memo(m.forwardRef((e,t)=>{const[i,n]=m.useState(!1),{pages:s,innerStyle:r,config:o=bi.slow,enabled:c=!0,horizontal:d=!1,children:a,...v}=e,h=m.useRef(),p=m.useRef(),l=Fe(()=>({config:o,horizontal:d,busy:!1,space:0,current:0,offset:0,controller:new Ii({scroll:0}),layers:new Set,container:h,content:p,update:()=>g(),scrollTo:_=>y(_),stop:()=>l.controller.stop()}),[]);m.useEffect(()=>{l.config=o},[o]),m.useImperativeHandle(t,()=>l);const g=()=>{const _=h.current;if(!_)return;const b=d?"clientWidth":"clientHeight";l.space=_[b];const k=Xe(d);c?l.current=_[k]:_[k]=l.current=l.offset*l.space;const A=p.current;if(A){const j=d?"width":"height";A.style[j]=`${l.space*s}px`}l.layers.forEach(j=>{j.setHeight(l.space,!0),j.setPosition(l.space,l.current,!0)})},y=_=>{const b=h.current,k=Xe(d);l.offset=_,l.controller.set({scroll:l.current}),l.controller.stop().start({scroll:_*l.space,config:o,onChange({value:{scroll:A}}){b[k]=A}})},w=_=>{l.busy||(l.busy=!0,l.current=_.target[Xe(d)],x.onStart(()=>{l.layers.forEach(b=>b.setPosition(l.space,l.current)),l.busy=!1}))};m.useEffect(()=>l.update()),Oe(()=>{n(!0);const _=()=>{const b=()=>l.update();x.onFrame(b),setTimeout(b,150)};return window.addEventListener("resize",_,!1),()=>window.removeEventListener("resize",_,!1)});const S=c?{overflowY:d?"hidden":"scroll",overflowX:d?"scroll":"hidden"}:{overflowY:"hidden",overflowX:"hidden"};return m.createElement(dt.div,{...v,ref:h,onScroll:w,onWheel:c?l.stop:void 0,onTouchStart:c?l.stop:void 0,style:{position:"absolute",width:"100%",height:"100%",...S,WebkitOverflowScrolling:"touch",WebkitTransform:Ie,msTransform:Ie,transform:Wt,...v.style}},i&&m.createElement(m.Fragment,null,m.createElement(dt.div,{ref:p,style:{overflow:"hidden",position:"absolute",[d?"height":"width"]:"100%",[d?"width":"height"]:l.space*s,WebkitTransform:Ie,msTransform:Ie,transform:Wt,...e.innerStyle}},m.createElement(ft.Provider,{value:l},ht(a,_=>!_.props.sticky&&_))),m.createElement(ft.Provider,{value:l},ht(a,_=>_.props.sticky&&_))))}));const ds=Ei`
  0% {
    text-shadow: 0 0 10px rgba(74, 108, 247, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(74, 108, 247, 0.8), 0 0 30px rgba(74, 108, 247, 0.4);
  }
  100% {
    text-shadow: 0 0 10px rgba(74, 108, 247, 0.5);
  }
`,fs=I.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
`,hs=I.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.theme.text};
  margin: 0;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${ds} 3s ease-in-out infinite;

  span.dot {
    color: #4a6cf7;
    -webkit-text-fill-color: initial;
  }

  span.domain {
    font-weight: 500;
    font-size: 1.2rem;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    
    span.domain {
      font-size: 1rem;
    }
  }
`,ps=I.div`
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  border-radius: 8px;
  transform: rotate(45deg);
  position: relative;
  box-shadow: 0 2px 10px rgba(74, 108, 247, 0.3);

  &::before {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    background: white;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
  }
`,ms=()=>(Ti.useEffect(()=>{document.title="Harshit Padha | Portfolio"},[]),f.jsxs(fs,{children:[f.jsx(ps,{}),f.jsxs(hs,{children:["Harshit Padha",f.jsx("span",{className:"dot",children:"."}),f.jsx("span",{className:"domain",children:"me"})]})]})),gs=e=>{m.useEffect(()=>{const t=document.title;return document.title=`${e} | Harshit Padha`,()=>{document.title=t}},[e])},vs=I.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  transform: translateY(${e=>e.$isVisible?"0":"-100%"});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`,ys=I.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,bs=I.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 20px;
    transform: translateY(${e=>e.$isOpen?"0":"-100vh"});
    transition: transform 0.3s ease-in-out;
  }
`,Pe=I(pt)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`,xs=I.button`
  display: none;
  background: none;
  border: none;
  color: ${e=>e.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 768px) {
    display: block;
  }
`,ws=({isVisible:e})=>{const[t,i]=m.useState(!1),{currentUser:n}=Zt();return m.useEffect(()=>{const s=r=>{const o=r.target;!o.closest("#nav-links")&&!o.closest("#menu-button")&&i(!1)};return document.addEventListener("click",s),()=>document.removeEventListener("click",s)},[]),f.jsx(vs,{$isVisible:e,children:f.jsxs(ys,{children:[f.jsx(xs,{id:"menu-button",onClick:()=>i(!t),children:t?f.jsx(Oi,{}):f.jsx(Vi,{})}),f.jsxs(bs,{id:"nav-links",$isOpen:t,children:[n&&f.jsxs(f.Fragment,{children:[f.jsx(Pe,{to:"/events",children:"Events"}),f.jsx(Pe,{to:"/tickets",children:"Tickets"})]}),!n&&f.jsxs(f.Fragment,{children:[f.jsxs(Pe,{to:"/login",children:[f.jsx(et,{size:18}),"Sign In"]}),f.jsxs(Pe,{to:"/signup",children:[f.jsx(et,{size:18}),"Sign Up"]})]})]})]})})},_s=Fi`
  html {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
  }

  /* Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  body {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
  }
`,Ss=I.div`
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`,ks=I.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  color: ${e=>e.theme.text};
  position: relative;
`,Is=I.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`,Ps=I.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`,As=I.div`
  display: flex;
  gap: 20px;
  opacity: ${e=>e.$isNavVisible?0:1};
  transition: opacity 0.3s ease;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`,Je=I(pt)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`,js=I(Me.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: ${e=>e.theme.text};
  cursor: pointer;
  padding: 16px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    font-weight: 500;
    opacity: 0.9;
    white-space: nowrap;
    text-align: center;
    margin: 0;
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`,Rs=I(Me.div)`
  position: fixed;
  bottom: 8vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: fit-content;
  opacity: ${({$scrollY:e})=>e>10?0:1};
  visibility: ${({$scrollY:e})=>e>10?"hidden":"visible"};
  pointer-events: ${({$scrollY:e})=>e>10?"none":"auto"};
  transform: translateY(${({$scrollY:e})=>Math.min(e*.5,10)}px);
  transition: transform 0.2s ease;
  z-index: 10;
  
  @media (max-width: 768px) {
    bottom: 5vh;
  }
`,Cs=I.div`
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  perspective: 1000px;
  opacity: ${e=>e.$isVisible?1:0};
  transform: translateY(${e=>e.$isVisible?"0":"30px"});
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  will-change: opacity, transform;
  visibility: ${e=>e.$isVisible?"visible":"hidden"};
  position: relative;
  z-index: ${e=>e.$isVisible?1:-1};
`,Es=I.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  transform-style: preserve-3d;
  transform: rotateX(5deg);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 24px;
    width: 95%;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 16px;
    width: 98%;
  }
`,Ts=I.h2`
  color: ${e=>e.theme.text};
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  transform: translateZ(30px);
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`,Fs=I.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 95%;
  margin: 0 auto;
  opacity: ${e=>e.$isSubmitting?.7:1};
  pointer-events: ${e=>e.$isSubmitting?"none":"auto"};
  box-sizing: border-box;
`,Os=I.textarea`
  width: 100%;
  padding: 16px;
  margin: 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: ${e=>e.theme.text};
  font-size: 16px;
  min-height: 150px;
  max-height: 50vh;
  transition: all 0.3s ease;
  resize: vertical;
  box-sizing: border-box;

  @media (max-width: 768px) {
    min-height: 120px;
    font-size: 14px;
    padding: 14px;
  }

  @media (max-width: 480px) {
    min-height: 100px;
    max-height: 40vh;
    padding: 12px;
  }

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.25);
  }

  &::placeholder {
    color: ${e=>e.theme.text}80;
  }
`,Vs=I.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateZ(20px);

  &:hover {
    transform: translateZ(25px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`,zs=I(Me.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 1rem;
  color: ${e=>e.theme.text};
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  svg {
    color: #4a6cf7;
  }
`,Ms=I.footer`
  position: relative;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: auto;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 12px;
    gap: 16px;
    flex-wrap: wrap;
  }
`,Ae=I(pt)`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${e=>e.theme.text};
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: all 0.3s ease;
  padding: 6px 12px;
  border-radius: 8px;
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
`,Ds=()=>{gs("Home");const{currentUser:e}=Zt(),t=m.useRef(null),[i,n]=m.useState(!1),s=m.useRef(null),[r,o]=m.useState(!1),[c,d]=m.useState(!1),[a,v]=m.useState(""),[h,p]=m.useState(!1),[l,g]=m.useState(!1),[y,w]=m.useState(0);m.useEffect(()=>{d(!0),(()=>{window.pageYOffset>window.innerHeight*.5&&n(!0)})()},[]),m.useEffect(()=>{const b={root:null,rootMargin:"-10% 0px -10% 0px",threshold:[.1,.5]},k=new IntersectionObserver(A=>{A.forEach(j=>{j.isIntersecting?n(!0):j.boundingClientRect.top>0&&n(!1)})},b);return s.current&&k.observe(s.current),()=>{s.current&&k.unobserve(s.current)}},[c]),m.useEffect(()=>{let b=0;const k=()=>{const A=window.pageYOffset;o(A>100&&A>b),b=A,w(window.scrollY)};return window.addEventListener("scroll",k,{passive:!0}),()=>window.removeEventListener("scroll",k)},[]);const S=async b=>{if(b.preventDefault(),!!a.trim()){p(!0);try{await Hi.createMessage(a),v(""),g(!0),setTimeout(()=>g(!1),3e3)}catch(k){console.error("Failed to send message:",k)}finally{p(!1)}}},_=()=>{var b;(b=t.current)==null||b.scrollTo(1)};return f.jsxs(f.Fragment,{children:[f.jsx(_s,{}),f.jsx(ms,{}),f.jsx(ws,{isVisible:r}),f.jsxs(Ss,{children:[f.jsxs(us,{ref:t,pages:2,style:{top:"0",left:"0"},config:{tension:170,friction:26},children:[f.jsx(Ke,{offset:0,speed:.5,style:{display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}),f.jsx(Ke,{offset:0,speed:.1,children:f.jsxs(ks,{children:[f.jsx(Is,{children:"Hi! Welcome to Harshit Padha"}),f.jsx(Ps,{children:"Discover and manage amazing events all in one place. Join our community and start exploring today!"}),f.jsx(As,{$isNavVisible:r,children:e?f.jsxs(Je,{to:"/events",children:[f.jsx(zi,{size:20}),"View Events"]}):f.jsxs(f.Fragment,{children:[f.jsxs(Je,{to:"/login",children:[f.jsx(et,{size:20}),"Sign In"]}),f.jsxs(Je,{to:"/signup",children:[f.jsx(Mi,{size:20}),"Sign Up"]})]})})]})}),f.jsxs(Ke,{offset:1,speed:.2,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},children:[f.jsx(Cs,{ref:s,$isVisible:i,children:f.jsxs(Es,{children:[f.jsx(Ts,{children:"Send an Anonymous Message"}),f.jsxs(Fs,{onSubmit:S,$isSubmitting:h,children:[f.jsx(Os,{placeholder:"Type your message here... Surprise me!",required:!0,value:a,onChange:b=>v(b.target.value),disabled:h}),f.jsxs(Vs,{type:"submit",disabled:h,children:[f.jsx($i,{size:20}),h?"Sending...":"Send Message"]})]}),f.jsx(Bi,{children:l&&f.jsxs(zs,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.3,ease:"easeOut"},children:[f.jsx(Ni,{size:20}),"Message sent successfully!"]})})]})}),f.jsxs(Ms,{children:[f.jsxs(Ae,{to:"/legal/terms-conditions",children:[f.jsx(Li,{size:16}),"Terms"]}),f.jsxs(Ae,{to:"/legal/privacy-policy",children:[f.jsx(Ui,{size:16}),"Privacy"]}),f.jsxs(Ae,{to:"/legal/refund-policy",children:[f.jsx(Yi,{size:16}),"Refunds"]}),f.jsxs(Ae,{to:"/legal/about-us",children:[f.jsx(qi,{size:16}),"About Us"]})]})]})]}),f.jsx(Rs,{$scrollY:y,children:f.jsxs(js,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{type:"spring",stiffness:260,damping:20,delay:1},whileHover:{scale:1.05},whileTap:{scale:.95},onClick:_,children:[f.jsx("p",{children:"Scroll to send anonymous message"}),f.jsx(Me.div,{animate:{y:[0,6,0],scale:[1,1.1,1]},transition:{repeat:1/0,duration:2,ease:"easeInOut",times:[0,.5,1]},children:f.jsx(Qi,{size:22})})]})})]})]})};export{Ds as default};

import{r as f,R as ne,d as a,b as ye,P as we,j as r,y as ve}from"./index-I4BBwYdS.js";import{c as se,G as Te,H as $e,I as ke,B as je,J as Se,K as Ce,F as Ee,L as Ie,y as le,e as Pe,E as De}from"./index-DjBvL98p.js";import{G as Fe}from"./iconBase-VHV16drN.js";import{c as ze}from"./clsx-B-dksMZM.js";import{m as w}from"./proxy-DMLGpHM7.js";import{M as Ae}from"./index-COrAMwZg.js";import{A as Re}from"./index-C2QpgPxn.js";function Oe(e){return Fe({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M17 6V4H6v2h3.5c1.302 0 2.401.838 2.815 2H6v2h6.315A2.994 2.994 0 0 1 9.5 12H6v2.414L11.586 20h2.828l-6-6H9.5a5.007 5.007 0 0 0 4.898-4H17V8h-2.602a4.933 4.933 0 0 0-.924-2H17z"},child:[]}]})(e)}var Q={exports:{}},ee,ce;function Le(){if(ce)return ee;ce=1;var e="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return ee=e,ee}var te,de;function Ne(){if(de)return te;de=1;var e=Le();function s(){}function t(){}return t.resetWarningCache=s,te=function(){function i(h,v,I,x,$,z){if(z!==e){var P=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw P.name="Invariant Violation",P}}i.isRequired=i;function g(){return i}var p={array:i,bigint:i,bool:i,func:i,number:i,object:i,string:i,symbol:i,any:i,arrayOf:g,element:i,elementType:i,instanceOf:g,node:i,objectOf:g,oneOf:g,oneOfType:g,shape:g,exact:g,checkPropTypes:t,resetWarningCache:s};return p.PropTypes=p,p},te}var pe;function Me(){return pe||(pe=1,Q.exports=Ne()()),Q.exports}var fe=Me();function ie(e){return s=>!!s.type&&s.type.tabsRole===e}const B=ie("Tab"),V=ie("TabList"),X=ie("TabPanel");function _e(e){return B(e)||V(e)||X(e)}function oe(e,s){return f.Children.map(e,t=>t===null?null:_e(t)?s(t):t.props&&t.props.children&&typeof t.props.children=="object"?f.cloneElement(t,Object.assign({},t.props,{children:oe(t.props.children,s)})):t)}function G(e,s){return f.Children.forEach(e,t=>{t!==null&&(B(t)||X(t)?s(t):t.props&&t.props.children&&typeof t.props.children=="object"&&(V(t)&&s(t),G(t.props.children,s)))})}function he(e,s,t){let i,g=0,p=0,h=!1;const v=[],I=e[s];return G(I,x=>{V(x)&&(x.props&&x.props.children&&typeof x.props.children=="object"&&G(x.props.children,$=>v.push($)),h&&(i=new Error("Found multiple 'TabList' components inside 'Tabs'. Only one is allowed.")),h=!0),B(x)?((!h||v.indexOf(x)===-1)&&(i=new Error("Found a 'Tab' component outside of the 'TabList' component. 'Tab' components have to be inside the 'TabList' component.")),g++):X(x)&&p++}),!i&&g!==p&&(i=new Error(`There should be an equal number of 'Tab' and 'TabPanel' in \`${t}\`. Received ${g} 'Tab' and ${p} 'TabPanel'.`)),i}function qe(e,s,t,i,g){const p=e[s],h=g||s;let v=null;return p&&typeof p!="function"?v=new Error(`Invalid ${i} \`${h}\` of type \`${typeof p}\` supplied to \`${t}\`, expected \`function\`.`):e.selectedIndex!=null&&p==null&&(v=new Error(`The ${i} \`${h}\` is marked as required in \`${t}\`, but its value is \`undefined\` or \`null\`.
\`onSelect\` is required when \`selectedIndex\` is also set. Not doing so will make the tabs not do anything, as \`selectedIndex\` indicates that you want to handle the selected tab yourself.
If you only want to set the inital tab replace \`selectedIndex\` with \`defaultIndex\`.`)),v}function He(e,s,t,i,g){const p=e[s],h=g||s;let v=null;if(p!=null&&typeof p!="number")v=new Error(`Invalid ${i} \`${h}\` of type \`${typeof p}\` supplied to \`${t}\`, expected \`number\`.`);else if(e.defaultIndex!=null&&p!=null)return new Error(`The ${i} \`${h}\` cannot be used together with \`defaultIndex\` in \`${t}\`.
Either remove \`${h}\` to let \`${t}\` handle the selected tab internally or remove \`defaultIndex\` to handle it yourself.`);return v}function xe(e){let s=0;return G(e,t=>{B(t)&&s++}),s}const Ue=["children","className","disabledTabClassName","domRef","focus","forceRenderTabPanel","onSelect","selectedIndex","selectedTabClassName","selectedTabPanelClassName","environment","disableUpDownKeys","disableLeftRightKeys"];function We(e,s){if(e==null)return{};var t={};for(var i in e)if({}.hasOwnProperty.call(e,i)){if(s.includes(i))continue;t[i]=e[i]}return t}function me(e){return e&&"getAttribute"in e}function ue(e){return me(e)&&e.getAttribute("data-rttab")}function N(e){return me(e)&&e.getAttribute("aria-disabled")==="true"}let Y;function Ke(e){const s=e||(typeof window<"u"?window:void 0);try{Y=!!(typeof s<"u"&&s.document&&s.document.activeElement)}catch{Y=!1}}const Be={className:"react-tabs",focus:!1},Je={children:he},Ge=e=>{fe.checkPropTypes(Je,e,"prop","UncontrolledTabs");let s=f.useRef([]),t=f.useRef([]);const i=f.useRef();function g(n,l){if(n<0||n>=x())return;const{onSelect:y,selectedIndex:R}=e;y(n,R,l)}function p(n){const l=x();for(let y=n+1;y<l;y++)if(!N($(y)))return y;for(let y=0;y<n;y++)if(!N($(y)))return y;return n}function h(n){let l=n;for(;l--;)if(!N($(l)))return l;for(l=x();l-- >n;)if(!N($(l)))return l;return n}function v(){const n=x();for(let l=0;l<n;l++)if(!N($(l)))return l;return null}function I(){let n=x();for(;n--;)if(!N($(n)))return n;return null}function x(){const{children:n}=e;return xe(n)}function $(n){return s.current[`tabs-${n}`]}function z(){let n=0;const{children:l,disabledTabClassName:y,focus:R,forceRenderTabPanel:k,selectedIndex:F,selectedTabClassName:o,selectedTabPanelClassName:u,environment:d}=e;t.current=t.current||[];let c=t.current.length-x();const T=f.useId();for(;c++<0;)t.current.push(`${T}${t.current.length}`);return oe(l,m=>{let S=m;if(V(m)){let b=0,H=!1;Y==null&&Ke(d);const U=d||(typeof window<"u"?window:void 0);Y&&U&&(H=ne.Children.toArray(m.props.children).filter(B).some((W,C)=>U.document.activeElement===$(C))),S=f.cloneElement(m,{children:oe(m.props.children,W=>{const C=`tabs-${b}`,L=F===b,Z={tabRef:be=>{s.current[C]=be},id:t.current[b],selected:L,focus:L&&(R||H)};return o&&(Z.selectedClassName=o),y&&(Z.disabledClassName=y),b++,f.cloneElement(W,Z)})})}else if(X(m)){const b={id:t.current[n],selected:F===n};k&&(b.forceRender=k),u&&(b.selectedClassName=u),n++,S=f.cloneElement(m,b)}return S})}function P(n){const{direction:l,disableUpDownKeys:y,disableLeftRightKeys:R}=e;if(j(n.target)){let{selectedIndex:k}=e,F=!1,o=!1;(n.code==="Space"||n.keyCode===32||n.code==="Enter"||n.keyCode===13)&&(F=!0,o=!1,E(n)),!R&&(n.keyCode===37||n.code==="ArrowLeft")||!y&&(n.keyCode===38||n.code==="ArrowUp")?(l==="rtl"?k=p(k):k=h(k),F=!0,o=!0):!R&&(n.keyCode===39||n.code==="ArrowRight")||!y&&(n.keyCode===40||n.code==="ArrowDown")?(l==="rtl"?k=h(k):k=p(k),F=!0,o=!0):n.keyCode===35||n.code==="End"?(k=I(),F=!0,o=!0):(n.keyCode===36||n.code==="Home")&&(k=v(),F=!0,o=!0),F&&n.preventDefault(),o&&g(k,n)}}function E(n){let l=n.target;do if(j(l)){if(N(l))return;const y=[].slice.call(l.parentNode.children).filter(ue).indexOf(l);g(y,n);return}while((l=l.parentNode)!=null)}function j(n){if(!ue(n))return!1;let l=n.parentElement;do{if(l===i.current)return!0;if(l.getAttribute("data-rttabs"))break;l=l.parentElement}while(l);return!1}const D=Object.assign({},Be,e),{className:A,domRef:M}=D,O=We(D,Ue);return ne.createElement("div",Object.assign({},O,{className:ze(A),onClick:E,onKeyDown:P,ref:n=>{i.current=n,M&&M(n)},"data-rttabs":!0}),z())},Ye=["children","defaultFocus","defaultIndex","focusTabOnClick","onSelect"];function Ve(e,s){if(e==null)return{};var t={};for(var i in e)if({}.hasOwnProperty.call(e,i)){if(s.includes(i))continue;t[i]=e[i]}return t}const Xe=0,J=1,Ze={children:he,onSelect:qe,selectedIndex:He},Qe={defaultFocus:!1,focusTabOnClick:!0,forceRenderTabPanel:!1,selectedIndex:null,defaultIndex:null,environment:null,disableUpDownKeys:!1,disableLeftRightKeys:!1},et=e=>e.selectedIndex===null?J:Xe,ge=e=>{fe.checkPropTypes(Ze,e,"prop","Tabs");const s=Object.assign({},Qe,e),{children:t,defaultFocus:i,defaultIndex:g,focusTabOnClick:p,onSelect:h}=s,v=Ve(s,Ye),[I,x]=f.useState(i),[$]=f.useState(et(v)),[z,P]=f.useState($===J?g||0:null);if(f.useEffect(()=>{x(!1)},[]),$===J){const D=xe(t);f.useEffect(()=>{if(z!=null){const A=Math.max(0,D-1);P(Math.min(z,A))}},[D])}const E=(D,A,M)=>{typeof h=="function"&&h(D,A,M)===!1||(p&&x(!0),$===J&&P(D))};let j=Object.assign({},e,v);return j.focus=I,j.onSelect=E,z!=null&&(j.selectedIndex=z),delete j.defaultFocus,delete j.defaultIndex,delete j.focusTabOnClick,ne.createElement(Ge,j,t)};ge.tabsRole="Tabs";const tt=a.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${e=>e.theme.background};
  display: flex;
  justify-content: center;
`,rt=a(w.div)`
  width: 100%;
  max-width: 1000px;
  display: flex;
  gap: 32px;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`,nt=a(w.div)`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`,ot=a(w.div)`
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 968px) {
    width: 100%;
  }
`,it=a.h1`
  font-size: 1.75rem;
  color: ${e=>e.theme.text};
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
`,at=a.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,_=a.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`,q=a.label`
  color: ${e=>e.theme.text};
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 0.85rem;
    opacity: 0.7;
    font-weight: normal;
  }
`,K=a.input`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${e=>e.theme.text};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
  }

  &::placeholder {
    color: ${e=>e.theme.text}60;
  }
`;a.textarea`
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: ${e=>e.theme.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;const st=a.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`,ae=a(w.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${e=>{switch(e.$variant){case"primary":return"linear-gradient(135deg, #6e8efb, #4a6cf7)";case"danger":return"linear-gradient(135deg, #ff6b6b, #ff4757)";default:return"rgba(255, 255, 255, 0.1)"}}};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${e=>e.$variant==="danger"?"rgba(255, 71, 87, 0.4)":"rgba(74, 108, 247, 0.4)"};
  }
`;a.div`
  position: relative;
  width: 100%;
`;a.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${e=>e.theme.text};
  opacity: 0.8;
  font-size: 1rem;
  pointer-events: none;
`;const lt=a(K)`
  padding-left: 32px; // Make space for the rupee symbol
`,ct=a.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,dt=a(w.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.2);
  border-radius: 12px;
  color: #ff4757;
  margin-bottom: 20px;
  font-size: 0.95rem;
`,pt=a(ae).attrs({$variant:"primary"})`
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
`,ut=a(ae).attrs({$variant:"danger"})`
  padding: 12px 24px;
`,ft=a.div`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:focus-within {
    border-color: #4a6cf7;
    box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
  }
`,ht=a.textarea`
  width: 100%;
  min-height: 300px;
  padding: 16px;
  background: transparent;
  border: none;
  color: ${e=>e.theme.text};
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${e=>e.theme.text}60;
  }
`,xt=a.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  color: ${e=>e.theme.text};
  min-height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1em;
    margin-bottom: 0.5em;
    color: ${e=>e.theme.text};
  }

  p {
    margin-bottom: 1em;
    line-height: 1.6;
  }

  ul, ol {
    margin-left: 1.5em;
    margin-bottom: 1em;
  }

  a {
    color: #4a6cf7;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  blockquote {
    border-left: 4px solid #4a6cf7;
    padding-left: 1em;
    margin-left: 0;
    color: ${e=>e.theme.text}CC;
  }

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
  }

  pre {
    background: rgba(255, 255, 255, 0.1);
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;
    
    code {
      background: none;
      padding: 0;
    }
  }
`,mt=a(w.div)`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`,gt=a.h2`
  font-size: 1.25rem;
  color: ${e=>e.theme.text};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;a(ge)`
  .react-tabs__tab-list {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 15px;
  }

  .react-tabs__tab {
    color: ${e=>e.theme.text}CC;
    border: none;
    padding: 8px 16px;
    
    &--selected {
      background: rgba(255, 255, 255, 0.1);
      color: ${e=>e.theme.text};
      border-radius: 8px 8px 0 0;
    }
  }
`;a(w.div)`
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100;

  @media (max-width: 768px) {
    right: 15px;
    top: 15px;
  }
`;a(w.input)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 12px 50px 12px 45px; // Adjusted padding for both icons
  color: ${e=>e.theme.text};
  font-size: 1rem;
  width: 400px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }

  &::placeholder {
    color: ${e=>e.theme.text}80;
  }

  @media (max-width: 768px) {
    width: 240px;
    font-size: 0.9rem;
    padding: 10px 40px 10px 35px;
  }

  @media (max-width: 480px) {
    width: 180px;
    font-size: 0.85rem;
  }
`;a(w.button)`
  position: ${e=>e.$isExpanded?"absolute":"relative"};
  right: ${e=>e.$isExpanded?"5px":"0"};
  background: linear-gradient(135deg, #FF69B4, #9370DB);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 15px rgba(147, 112, 219, 0.4);
  z-index: 1;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;a(w.button)`
  position: absolute;
  left: 5px; // Position it to the left of the input
  background: none;
  border: none;
  color: ${e=>e.theme.text}80;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  z-index: 1;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${e=>e.theme.text};
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;const bt=a(w.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
`,yt=a(w.div)`
  position: relative;
  width: 100%;
  display: ${e=>e.$isVisible?"flex":"none"};
  align-items: center;
  gap: 20px;
  flex-direction: row;
  margin-top: auto;
`,wt=a(w.input)`
  width: 100%;
  padding: 16px 48px 16px 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${e=>e.theme.text};
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }

  &::placeholder {
    color: #6c757d;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 14px 40px 14px 16px;
  }
`,vt=a(w.button)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    transform: translateY(-50%);
    box-shadow: 0 4px 15px rgba(74, 108, 247, 0.4);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;a(w.div)`
  color: ${e=>e.theme.text};
  
  h1, h2, h3, h4, h5, h6 {
    color: ${e=>e.theme.text};
    margin: 1em 0 0.5em;
    &:first-child { margin-top: 0; }
  }

  p { margin-bottom: 1em; }

  .meta-info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.9rem;
    opacity: 0.8;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
`;a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;const Tt=a(w.div)`
  width: 100%;
  overflow: hidden;
  order: -1; // This moves it above the AI prompt
`,$t=a(w.div)`
  width: 100%;
  max-height: 500px;
  min-height: 100px; // Reduced minimum height
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
`,kt=a.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
  min-height: 100px; // Add minimum height
  max-height: 400px; // Add maximum height

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`,jt=a.div`
  font-size: 0.7rem;
  color: ${e=>e.theme.text}80;
  align-self: ${e=>e.$type==="user"?"flex-end":"flex-start"};
  margin: 0 4px 8px;
`,St=a.div`
  align-self: ${e=>e.$type==="user"?"flex-end":"flex-start"};
  max-width: 85%;
  padding: 12px 16px;
  border-radius: ${e=>e.$type==="user"?"12px 12px 0 12px":"12px 12px 12px 0"};
  background: ${e=>{switch(e.$type){case"user":return"linear-gradient(135deg, #6e8efb, #4a6cf7)";case"info":return"rgba(255, 255, 255, 0.05)";default:return"rgba(255, 255, 255, 0.1)"}}};
  color: ${e=>e.$type==="user"?"white":e.theme.text};
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 4px;

  strong {
    font-weight: 600;
    color: ${e=>e.$type==="user"?"white":"#4a6cf7"};
    display: inline-block;
    margin: 8px 0 4px;
  }

  /* Style bullet points */
  ul {
    margin: 8px 0;
    padding-left: 8px;
    list-style: none;
  }

  li {
    margin: 4px 0;
    padding-left: 16px;
    position: relative;
    
    &:before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${e=>e.$type==="user"?"white":"#4a6cf7"};
    }
  }

  /* Style sections */
  p {
    margin: 8px 0;
  }

  /* Style examples/scenarios */
  div.scenario {
    margin: 12px 0;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  /* Style inline examples */
  .example {
    opacity: 0.8;
    font-size: 0.9em;
    margin-left: 16px;
    display: block;
  }
`,Ct=a.div`
  display: flex;
  flex-direction: column;
  align-self: ${e=>e.$type==="user"?"flex-end":"flex-start"};
  max-width: 80%;
`,Et=a.div`
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 12px;
  align-items: center;
`,It=a.input`
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${e=>e.theme.text};
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.1);
  }

  &::placeholder {
    color: ${e=>e.theme.text}60;
  }
`;a.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
`;a.div`
  align-self: ${e=>e.$type==="ai"?"flex-start":"flex-end"};
  background: ${e=>e.$type==="ai"?"#eee":"#6e8efb"};
  color: ${e=>e.$type==="ai"?"#000":"#fff"};
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
`;const re=e=>e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/•\s*/g,"• ").replace(/\n{3,}/g,`

`).replace(/^\d+\.\s+/gm,s=>`${s.trim()} `).replace(/^(Scenario \d+:)/gm,`
$1`).replace(/[_*`]/g,"").replace(/\((e\.g\.,.*?)\)/g,`
    $1`).replace(/\s{2,}/g," ").replace(/:\s*/g,": ").replace(/^[-•]\s/gm,"  • "),Lt=()=>{const e=ye(),{selectedModel:s}=we(),[t,i]=f.useState({title:"",description:"",date:"",location:"",price:"",totalTickets:""}),[g,p]=f.useState("");f.useState(!1);const[h,v]=f.useState(""),[I,x]=f.useState(!1);f.useState(!1);const[$,z]=f.useState(!1),[P,E]=f.useState([{type:"info",content:"Welcome! I can help you create detailed events. Try describing your event with specific details like title, date, location, and any special features.",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),[j,D]=f.useState("");f.useState(!1),f.useState(!1);const A=f.useRef(null);f.useEffect(()=>{A.current&&(A.current.scrollTop=A.current.scrollHeight)},[P]);const M=async o=>{if(o.preventDefault(),!t.title||!t.location||!t.date){p("Please fill in all required fields.");return}if(new Date(t.date)<=new Date){p("Please choose a future date for the event.");return}p("");try{const u=t.description.replace(/\/[^\n]*$/,"").trim();await ve.createEvent(t),e("/events")}catch(u){console.error("Error creating event:",u),p("Something went wrong. Please try again.")}},O=o=>{const{name:u,value:d}=o.target;i(c=>({...c,[u]:d}))},n=async o=>s.provider==="google"?await l(o):await y(o);async function l(o){var u,d,c,T,m;try{const S=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDy4LMuyBVh3Ui52BX3SH4jdz0s9rrmoyE",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:o}]}]})});if(!S.ok){const H=await S.json();throw new Error(((u=H.error)==null?void 0:u.message)||S.statusText)}return((m=(T=(c=(d=(await S.json()).candidates[0])==null?void 0:d.content)==null?void 0:c.parts)==null?void 0:T[0])==null?void 0:m.text)||"No response from AI"}catch(S){throw console.error("Google API error details:",S),S}}async function y(o){var u,d,c,T;try{const m=P.slice(-10),S=[{role:"system",content:`You are an event planning assistant. Always respond with a complete JSON object in this exact format, and nothing else before or after the JSON:
          {
            "title": "Event Title",
            "description": "Detailed markdown description with sections",
            "location": "Venue with full address",
            "price": number,
            "totalTickets": number,
            "suggestedDate": "YYYY-MM-DDTHH:mm"
          }
          
          For follow-up questions and modifications:
          1. Maintain context from previous messages
          2. Update only the fields that are relevant to the user's request
          3. Keep other fields unchanged from the previous state
          4. Always return the complete event object with all fields
          5. Keep the response concise and within token limits`},{role:"system",content:`Current event state: ${JSON.stringify({title:t.title,description:t.description,location:t.location,price:parseFloat(t.price)||0,totalTickets:parseInt(t.totalTickets)||0,suggestedDate:t.date})}`},...m.map(C=>{var L;return{role:C.type==="user"?"user":"assistant",content:C.type==="user"?C.content:C.content.includes("Event Updated Successfully")&&((L=C.content.split("Changes made:")[1])==null?void 0:L.split(`
`).slice(0,-1).join(`
`))||C.content}}),{role:"user",content:`${o}
Respond only with the JSON object, no additional text.`}],b=await fetch("https://api.deepseek.com/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer undefined",Accept:"application/json"},body:JSON.stringify({model:"deepseek-chat",messages:S,temperature:.7,max_tokens:2e3,stream:!1})});if(!b.ok){const C=await b.json();throw new Error(((u=C.error)==null?void 0:u.message)||b.statusText)}const U=((T=(c=(d=(await b.json()).choices)==null?void 0:d[0])==null?void 0:c.message)==null?void 0:T.content)||"",W=U.trim().replace(/^```json\s*/,"").replace(/\s*```$/,"").replace(/^\s*\{/,"{").replace(/\}\s*$/,"}");try{return JSON.parse(W),W}catch{const L=U.match(/\{[\s\S]*\}/);if(L)return L[0];throw new Error("Invalid JSON response from API")}}catch(m){throw console.error("Deepseek API error details:",m),m}}const R=async()=>{if(!h.trim()){p("Please provide a description for the event");return}x(!0);try{const o=await n(h);E(u=>[...u,{type:"user",content:h,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);try{const u=o.match(/\{[\s\S]*\}/);if(u){const d=JSON.parse(u[0]);i({title:d.title||"",description:d.description||"",date:d.suggestedDate||"",location:d.location||"",price:String(d.price||"0"),totalTickets:String(d.totalTickets||"100")});const c=re(`✨ **Event Created Successfully!**

📌 **Title**
${d.title}

📍 **Location**
${d.location}

📅 **Date & Time**
${new Date(d.suggestedDate).toLocaleString()}

💰 **Price**
₹${d.price}

🎟️ **Total Tickets**
${d.totalTickets}

📝 **Description**
${d.description.substring(0,150)}...

I've filled in all the details in the form. Feel free to review and adjust anything!`);E(T=>[...T,{type:"ai",content:c,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}else throw new Error("No valid JSON found in response")}catch(u){console.error("Error parsing AI response:",u),E(d=>[...d,{type:"ai",content:o,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}v(""),z(!0)}catch(o){console.error("Generation error:",o),E(u=>[...u,{type:"ai",content:o instanceof Error?o.message:"Failed to generate event",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}finally{x(!1)}},k=async()=>{if(!j.trim())return;const o=j.trim();D("");const u=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});E(d=>[...d,{type:"user",content:o,timestamp:u}]);try{x(!0);const d=await n(o);try{const c=JSON.parse(d),T={...t};i(b=>({title:c.title||b.title,description:c.description||b.description,date:c.suggestedDate||b.date,location:c.location||b.location,price:String(c.price||b.price),totalTickets:String(c.totalTickets||b.totalTickets)}));const m=[];c.title!==T.title&&m.push(`📌 **Title**: ${c.title}`),c.location!==T.location&&m.push(`📍 **Location**: ${c.location}`),c.suggestedDate!==T.date&&m.push(`📅 **Date & Time**: ${new Date(c.suggestedDate).toLocaleString()}`),String(c.price)!==T.price&&m.push(`💰 **Price**: ₹${c.price}`),String(c.totalTickets)!==T.totalTickets&&m.push(`🎟️ **Total Tickets**: ${c.totalTickets}`),c.description!==T.description&&m.push(`📝 **Description Update**: ${c.description.substring(0,150)}...`);const S=re(m.length>0?`✨ **Event Updated Successfully!**

Changes made:
${m.join(`
`)}

All changes have been applied to the form. Feel free to review and make any additional adjustments!`:"No changes were needed. The event details already match your request.");E(b=>[...b,{type:"ai",content:S,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}catch(c){console.error("Error parsing AI response:",c),E(T=>[...T,{type:"ai",content:"I apologize, but I encountered an error processing the update. Please try rephrasing your request.",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}}catch(d){console.error("Chat error:",d),E(c=>[...c,{type:"ai",content:d instanceof Error?d.message:"Sorry, I encountered an error processing your request.",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}finally{x(!1)}},F=(o,u)=>r.jsxs(Ct,{$type:o.type,children:[r.jsx(St,{$type:o.type,dangerouslySetInnerHTML:{__html:o.type==="user"?o.content:re(o.content)}}),o.type!=="info"&&o.timestamp&&r.jsx(jt,{$type:o.type,children:o.timestamp})]},u);return r.jsx(tt,{children:r.jsxs(rt,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[r.jsxs(nt,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:.2},children:[r.jsxs(it,{children:[r.jsx(se,{size:24}),"Create New Event"]}),r.jsxs(at,{onSubmit:M,children:[g&&r.jsxs(dt,{children:[r.jsx(Te,{size:16}),g]}),r.jsxs(_,{children:[r.jsxs(q,{htmlFor:"title",children:[r.jsx($e,{size:16}),"Event Title"]}),r.jsx(K,{type:"text",id:"title",name:"title",value:t.title,onChange:O,placeholder:"Enter event title",required:!0})]}),r.jsxs(_,{children:[r.jsxs(q,{htmlFor:"date",children:[r.jsx(se,{size:16}),"Date & Time"]}),r.jsx(K,{type:"datetime-local",id:"date",name:"date",value:t.date,onChange:O,required:!0})]}),r.jsxs(_,{children:[r.jsxs(q,{htmlFor:"location",children:[r.jsx(ke,{size:16}),"Location"]}),r.jsx(K,{type:"text",id:"location",name:"location",value:t.location,onChange:O,placeholder:"Enter event location",required:!0})]}),r.jsxs(ct,{children:[r.jsxs(_,{children:[r.jsxs(q,{children:[r.jsx(Oe,{size:16}),"Price"]}),r.jsx(lt,{type:"number",name:"price",value:t.price,onChange:O,placeholder:"0.00",min:"0",step:"any",required:!0})]}),r.jsxs(_,{children:[r.jsxs(q,{children:[r.jsx(je,{size:16}),"Total Tickets"]}),r.jsx(K,{type:"number",name:"totalTickets",value:t.totalTickets,onChange:O,placeholder:"100",min:"1",required:!0})]})]}),r.jsxs(_,{children:[r.jsxs(q,{htmlFor:"description",children:[r.jsx(Se,{size:16}),"Description",r.jsx("span",{children:"(Markdown supported)"})]}),r.jsx(ft,{children:r.jsx(ht,{id:"description",name:"description",value:t.description,onChange:O,placeholder:"Write your event description here..."})})]}),r.jsxs(st,{children:[r.jsxs(pt,{type:"submit",whileHover:{scale:1.02},whileTap:{scale:.98},children:[r.jsx(Ce,{size:18}),"Save Event"]}),r.jsxs(ut,{type:"button",onClick:()=>e("/events"),whileHover:{scale:1.02},whileTap:{scale:.98},children:[r.jsx(Ee,{size:18}),"Cancel"]})]})]}),r.jsxs(mt,{children:[r.jsxs(gt,{children:[r.jsx(Ie,{size:20}),"Preview"]}),r.jsx(xt,{children:r.jsx(Ae,{children:t.description})})]})]}),r.jsx(ot,{children:r.jsxs(bt,{children:[r.jsx(Re,{children:$&&r.jsx(Tt,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.3},children:r.jsxs($t,{children:[r.jsx(kt,{ref:A,children:P.map((o,u)=>F(o,u))}),r.jsxs(Et,{children:[r.jsx(It,{placeholder:"Type your message...",value:j,onChange:o=>D(o.target.value),onKeyDown:o=>{o.key==="Enter"&&!o.shiftKey&&j.trim()&&(o.preventDefault(),k())}}),r.jsx(ae,{onClick:k,disabled:!j.trim()||I,whileHover:{scale:1.05},whileTap:{scale:.95},children:I?r.jsx(w.div,{animate:{rotate:360},transition:{duration:1,repeat:1/0,ease:"linear"},children:r.jsx(le,{size:18})}):r.jsx(Pe,{size:18})})]})]})})}),r.jsxs(yt,{$isVisible:!$,children:[r.jsx(wt,{placeholder:"Ask AI to help create your event...",value:h,onChange:o=>v(o.target.value),onKeyDown:o=>{o.key==="Enter"&&!o.shiftKey&&h.trim()&&(o.preventDefault(),R())}}),r.jsx(vt,{onClick:R,disabled:!h.trim()||I,children:I?r.jsx(w.div,{animate:{rotate:360},transition:{duration:1,repeat:1/0,ease:"linear"},children:r.jsx(le,{size:18})}):r.jsx(De,{size:18})})]})]})})]})})};export{Lt as default};

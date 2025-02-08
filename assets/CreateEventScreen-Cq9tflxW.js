import{r as g,R as ie,d as s,b as $e,P as ke,j as n,y as Se}from"./index-DrMew4sM.js";import{G as je,c as pe,H as Ce,I as De,J as Ee,B as Ie,K as Pe,L as Fe,F as Ae,M as Re,y as ue,e as Oe,E as ze}from"./index-D3m6aTdR.js";import{c as Le}from"./clsx-B-dksMZM.js";import{m as k}from"./proxy-Cep0RPS3.js";import{M as Ne}from"./index-CFlzQuoD.js";import{A as Me}from"./index-DbcgzZ7_.js";function _e(e){return je({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M17 6V4H6v2h3.5c1.302 0 2.401.838 2.815 2H6v2h6.315A2.994 2.994 0 0 1 9.5 12H6v2.414L11.586 20h2.828l-6-6H9.5a5.007 5.007 0 0 0 4.898-4H17V8h-2.602a4.933 4.933 0 0 0-.924-2H17z"},child:[]}]})(e)}var te={exports:{}},ne,fe;function He(){if(fe)return ne;fe=1;var e="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return ne=e,ne}var re,he;function qe(){if(he)return re;he=1;var e=He();function a(){}function t(){}return t.resetWarningCache=a,re=function(){function i(x,S,A,b,j,L){if(L!==e){var F=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw F.name="Invariant Violation",F}}i.isRequired=i;function m(){return i}var u={array:i,bigint:i,bool:i,func:i,number:i,object:i,string:i,symbol:i,any:i,arrayOf:m,element:i,elementType:i,instanceOf:m,node:i,objectOf:m,oneOf:m,oneOfType:m,shape:m,exact:m,checkPropTypes:t,resetWarningCache:a};return u.PropTypes=u,u},re}var ge;function Ue(){return ge||(ge=1,te.exports=qe()()),te.exports}var be=Ue();function se(e){return a=>!!a.type&&a.type.tabsRole===e}const J=se("Tab"),Q=se("TabList"),ee=se("TabPanel");function Ye(e){return J(e)||Q(e)||ee(e)}function ae(e,a){return g.Children.map(e,t=>t===null?null:Ye(t)?a(t):t.props&&t.props.children&&typeof t.props.children=="object"?g.cloneElement(t,Object.assign({},t.props,{children:ae(t.props.children,a)})):t)}function X(e,a){return g.Children.forEach(e,t=>{t!==null&&(J(t)||ee(t)?a(t):t.props&&t.props.children&&typeof t.props.children=="object"&&(Q(t)&&a(t),X(t.props.children,a)))})}function ye(e,a,t){let i,m=0,u=0,x=!1;const S=[],A=e[a];return X(A,b=>{Q(b)&&(b.props&&b.props.children&&typeof b.props.children=="object"&&X(b.props.children,j=>S.push(j)),x&&(i=new Error("Found multiple 'TabList' components inside 'Tabs'. Only one is allowed.")),x=!0),J(b)?((!x||S.indexOf(b)===-1)&&(i=new Error("Found a 'Tab' component outside of the 'TabList' component. 'Tab' components have to be inside the 'TabList' component.")),m++):ee(b)&&u++}),!i&&m!==u&&(i=new Error(`There should be an equal number of 'Tab' and 'TabPanel' in \`${t}\`. Received ${m} 'Tab' and ${u} 'TabPanel'.`)),i}function We(e,a,t,i,m){const u=e[a],x=m||a;let S=null;return u&&typeof u!="function"?S=new Error(`Invalid ${i} \`${x}\` of type \`${typeof u}\` supplied to \`${t}\`, expected \`function\`.`):e.selectedIndex!=null&&u==null&&(S=new Error(`The ${i} \`${x}\` is marked as required in \`${t}\`, but its value is \`undefined\` or \`null\`.
\`onSelect\` is required when \`selectedIndex\` is also set. Not doing so will make the tabs not do anything, as \`selectedIndex\` indicates that you want to handle the selected tab yourself.
If you only want to set the inital tab replace \`selectedIndex\` with \`defaultIndex\`.`)),S}function Ke(e,a,t,i,m){const u=e[a],x=m||a;let S=null;if(u!=null&&typeof u!="number")S=new Error(`Invalid ${i} \`${x}\` of type \`${typeof u}\` supplied to \`${t}\`, expected \`number\`.`);else if(e.defaultIndex!=null&&u!=null)return new Error(`The ${i} \`${x}\` cannot be used together with \`defaultIndex\` in \`${t}\`.
Either remove \`${x}\` to let \`${t}\` handle the selected tab internally or remove \`defaultIndex\` to handle it yourself.`);return S}function we(e){let a=0;return X(e,t=>{J(t)&&a++}),a}const Be=["children","className","disabledTabClassName","domRef","focus","forceRenderTabPanel","onSelect","selectedIndex","selectedTabClassName","selectedTabPanelClassName","environment","disableUpDownKeys","disableLeftRightKeys"];function Ge(e,a){if(e==null)return{};var t={};for(var i in e)if({}.hasOwnProperty.call(e,i)){if(a.includes(i))continue;t[i]=e[i]}return t}function ve(e){return e&&"getAttribute"in e}function me(e){return ve(e)&&e.getAttribute("data-rttab")}function U(e){return ve(e)&&e.getAttribute("aria-disabled")==="true"}let Z;function Je(e){const a=e||(typeof window<"u"?window:void 0);try{Z=!!(typeof a<"u"&&a.document&&a.document.activeElement)}catch{Z=!1}}const Ve={className:"react-tabs",focus:!1},Xe={children:ye},Ze=e=>{be.checkPropTypes(Xe,e,"prop","UncontrolledTabs");let a=g.useRef([]),t=g.useRef([]);const i=g.useRef();function m(r,c){if(r<0||r>=b())return;const{onSelect:v,selectedIndex:H}=e;v(r,H,c)}function u(r){const c=b();for(let v=r+1;v<c;v++)if(!U(j(v)))return v;for(let v=0;v<r;v++)if(!U(j(v)))return v;return r}function x(r){let c=r;for(;c--;)if(!U(j(c)))return c;for(c=b();c-- >r;)if(!U(j(c)))return c;return r}function S(){const r=b();for(let c=0;c<r;c++)if(!U(j(c)))return c;return null}function A(){let r=b();for(;r--;)if(!U(j(r)))return r;return null}function b(){const{children:r}=e;return we(r)}function j(r){return a.current[`tabs-${r}`]}function L(){let r=0;const{children:c,disabledTabClassName:v,focus:H,forceRenderTabPanel:C,selectedIndex:O,selectedTabClassName:o,selectedTabPanelClassName:f,environment:h}=e;t.current=t.current||[];let p=t.current.length-b();const $=g.useId();for(;p++<0;)t.current.push(`${$}${t.current.length}`);return ae(c,l=>{let y=l;if(Q(l)){let T=0,D=!1;Z==null&&Je(h);const M=h||(typeof window<"u"?window:void 0);Z&&M&&(D=ie.Children.toArray(l.props.children).filter(J).some((E,w)=>M.document.activeElement===j(w))),y=g.cloneElement(l,{children:ae(l.props.children,E=>{const w=`tabs-${T}`,d=O===T,z={tabRef:_=>{a.current[w]=_},id:t.current[T],selected:d,focus:d&&(H||D)};return o&&(z.selectedClassName=o),v&&(z.disabledClassName=v),T++,g.cloneElement(E,z)})})}else if(ee(l)){const T={id:t.current[r],selected:O===r};C&&(T.forceRender=C),f&&(T.selectedClassName=f),r++,y=g.cloneElement(l,T)}return y})}function F(r){const{direction:c,disableUpDownKeys:v,disableLeftRightKeys:H}=e;if(I(r.target)){let{selectedIndex:C}=e,O=!1,o=!1;(r.code==="Space"||r.keyCode===32||r.code==="Enter"||r.keyCode===13)&&(O=!0,o=!1,P(r)),!H&&(r.keyCode===37||r.code==="ArrowLeft")||!v&&(r.keyCode===38||r.code==="ArrowUp")?(c==="rtl"?C=u(C):C=x(C),O=!0,o=!0):!H&&(r.keyCode===39||r.code==="ArrowRight")||!v&&(r.keyCode===40||r.code==="ArrowDown")?(c==="rtl"?C=x(C):C=u(C),O=!0,o=!0):r.keyCode===35||r.code==="End"?(C=A(),O=!0,o=!0):(r.keyCode===36||r.code==="Home")&&(C=S(),O=!0,o=!0),O&&r.preventDefault(),o&&m(C,r)}}function P(r){let c=r.target;do if(I(c)){if(U(c))return;const v=[].slice.call(c.parentNode.children).filter(me).indexOf(c);m(v,r);return}while((c=c.parentNode)!=null)}function I(r){if(!me(r))return!1;let c=r.parentElement;do{if(c===i.current)return!0;if(c.getAttribute("data-rttabs"))break;c=c.parentElement}while(c);return!1}const R=Object.assign({},Ve,e),{className:N,domRef:W}=R,q=Ge(R,Be);return ie.createElement("div",Object.assign({},q,{className:Le(N),onClick:P,onKeyDown:F,ref:r=>{i.current=r,W&&W(r)},"data-rttabs":!0}),L())},Qe=["children","defaultFocus","defaultIndex","focusTabOnClick","onSelect"];function et(e,a){if(e==null)return{};var t={};for(var i in e)if({}.hasOwnProperty.call(e,i)){if(a.includes(i))continue;t[i]=e[i]}return t}const tt=0,V=1,nt={children:ye,onSelect:We,selectedIndex:Ke},rt={defaultFocus:!1,focusTabOnClick:!0,forceRenderTabPanel:!1,selectedIndex:null,defaultIndex:null,environment:null,disableUpDownKeys:!1,disableLeftRightKeys:!1},ot=e=>e.selectedIndex===null?V:tt,Te=e=>{be.checkPropTypes(nt,e,"prop","Tabs");const a=Object.assign({},rt,e),{children:t,defaultFocus:i,defaultIndex:m,focusTabOnClick:u,onSelect:x}=a,S=et(a,Qe),[A,b]=g.useState(i),[j]=g.useState(ot(S)),[L,F]=g.useState(j===V?m||0:null);if(g.useEffect(()=>{b(!1)},[]),j===V){const R=we(t);g.useEffect(()=>{if(L!=null){const N=Math.max(0,R-1);F(Math.min(L,N))}},[R])}const P=(R,N,W)=>{typeof x=="function"&&x(R,N,W)===!1||(u&&b(!0),j===V&&F(R))};let I=Object.assign({},e,S);return I.focus=A,I.onSelect=P,L!=null&&(I.selectedIndex=L),delete I.defaultFocus,delete I.defaultIndex,delete I.focusTabOnClick,ie.createElement(Ze,I,t)};Te.tabsRole="Tabs";const it=s.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${e=>e.theme.background};
  display: flex;
  justify-content: center;
`,at=s(k.div)`
  width: 100%;
  max-width: 1000px;
  display: flex;
  gap: 32px;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`,st=s(k.div)`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`,lt=s(k.div)`
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 968px) {
    width: 100%;
  }
`,ct=s.h1`
  font-size: 1.75rem;
  color: ${e=>e.theme.text};
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
`,dt=s.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,K=s.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`,B=s.label`
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
`,G=s.input`
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
`;s.textarea`
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
`;const pt=s.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`,le=s(k.button)`
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
`;s.div`
  position: relative;
  width: 100%;
`;s.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${e=>e.theme.text};
  opacity: 0.8;
  font-size: 1rem;
  pointer-events: none;
`;const ut=s(G)`
  padding-left: 32px; // Make space for the rupee symbol
`,ft=s.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,ht=s(k.div)`
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
`,gt=s(le).attrs({$variant:"primary"})`
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
`,mt=s(le).attrs({$variant:"danger"})`
  padding: 12px 24px;
`,xt=s.div`
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
`,bt=s.textarea`
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
`,yt=s.div`
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
`,wt=s(k.div)`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`,vt=s.h2`
  font-size: 1.25rem;
  color: ${e=>e.theme.text};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;s(Te)`
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
`;s(k.div)`
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
`;s(k.input)`
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
`;s(k.button)`
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
`;s(k.button)`
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
`;const Tt=s(k.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
`,$t=s(k.div)`
  position: relative;
  width: 100%;
  display: ${e=>e.$isVisible?"flex":"none"};
  align-items: center;
  gap: 20px;
  flex-direction: row;
  margin-top: auto;
`,kt=s(k.input)`
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
`,St=s(k.button)`
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
`;s(k.div)`
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
`;s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;const jt=s(k.div)`
  width: 100%;
  overflow: hidden;
  order: -1; // This moves it above the AI prompt
`,Ct=s(k.div)`
  width: 100%;
  max-height: 500px;
  min-height: 100px; // Reduced minimum height
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
`,Dt=s.div`
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
`,Et=s.div`
  font-size: 0.7rem;
  color: ${e=>e.theme.text}80;
  align-self: ${e=>e.$type==="user"?"flex-end":"flex-start"};
  margin: 0 4px 8px;
`,It=s.div`
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
`,Pt=s.div`
  display: flex;
  flex-direction: column;
  align-self: ${e=>e.$type==="user"?"flex-end":"flex-start"};
  max-width: 80%;
`,Ft=s.div`
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 12px;
  align-items: center;
`,At=s.input`
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
`;s.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
`;s.div`
  align-self: ${e=>e.$type==="ai"?"flex-start":"flex-end"};
  background: ${e=>e.$type==="ai"?"#eee":"#6e8efb"};
  color: ${e=>e.$type==="ai"?"#000":"#fff"};
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
`;const oe=e=>{const a=e.getFullYear(),t=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0"),m=String(e.getHours()).padStart(2,"0"),u=String(e.getMinutes()).padStart(2,"0");return`${a}-${t}-${i}T${m}:${u}`},xe=e=>{if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(e))return e;try{if(/^\d{4}-\d{2}-\d{2}$/.test(e))return`${e}T12:00`;const a=new Date(e);return isNaN(a.getTime())?oe(new Date):oe(a)}catch{return oe(new Date)}},Y=e=>e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/•\s*/g,"• ").replace(/\n{3,}/g,`

`).replace(/^\d+\.\s+/gm,a=>`${a.trim()} `).replace(/^(Scenario \d+:)/gm,`
$1`).replace(/[_*`]/g,"").replace(/\((e\.g\.,.*?)\)/g,`
    $1`).replace(/\s{2,}/g," ").replace(/:\s*/g,": ").replace(/^[-•]\s/gm,"  • "),_t=()=>{const e=$e(),{selectedModel:a}=ke(),[t,i]=g.useState({title:"",description:"",date:"",location:"",price:"",totalTickets:""}),[m,u]=g.useState("");g.useState(!1);const[x,S]=g.useState(""),[A,b]=g.useState(!1);g.useState(!1);const[j,L]=g.useState(!1),[F,P]=g.useState([{type:"info",content:"Welcome! I can help you create detailed events. Try describing your event with specific details like title, date, location, and any special features.",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),[I,R]=g.useState("");g.useState(!1),g.useState(!1);const N=g.useRef(null);g.useEffect(()=>{N.current&&(N.current.scrollTop=N.current.scrollHeight)},[F]);const W=async o=>{if(o.preventDefault(),!t.title||!t.location||!t.date){u("Please fill in all required fields.");return}if(new Date(t.date)<=new Date){u("Please choose a future date for the event.");return}u("");try{const f=t.description.replace(/\/[^\n]*$/,"").trim();await Se.createEvent(t),e("/events")}catch(f){console.error("Error creating event:",f),u("Something went wrong. Please try again.")}},q=o=>{const{name:f,value:h}=o.target;if(f==="date"){const p=xe(h);i($=>({...$,[f]:p}))}else i(p=>({...p,[f]:h}))},r=async o=>a.provider==="google"?await c(o):await v(o);async function c(o){var f,h,p,$,l,y;try{const T=[{role:"user",parts:[{text:`You are an AI event planner assistant. Help create and modify event details.
          Current event state:
          Title: ${t.title}
          Description: ${t.description}
          Location: ${t.location}
          Price: ${t.price}
          Total Tickets: ${t.totalTickets}
          Date: ${t.date}

          Recent conversation:
          ${F.slice(-5).map(w=>`${w.type}: ${w.content}`).join(`
`)}

          User request: ${o}

          Respond with a JSON object in this format:
          {
            "event": {
              "title": "Event Title",
              "description": "Detailed description",
              "location": "Venue address",
              "price": number,
              "totalTickets": number,
              "suggestedDate": "YYYY-MM-DDTHH:mm"
            },
            "message": "Your conversational response here"
          }`}]}],D=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDy4LMuyBVh3Ui52BX3SH4jdz0s9rrmoyE",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:T,generationConfig:{temperature:.7,topK:40,topP:.95,maxOutputTokens:1024}})});if(!D.ok){const w=await D.json();throw new Error(((f=w.error)==null?void 0:f.message)||`Google API error: ${D.statusText}`)}const E=((y=(l=($=(p=(h=(await D.json()).candidates)==null?void 0:h[0])==null?void 0:p.content)==null?void 0:$.parts)==null?void 0:l[0])==null?void 0:y.text)||"";try{const w=E.match(/\{[\s\S]*\}/);if(w){const d=JSON.parse(w[0]),z={...t};let _=[];if(d.event&&(d.event.title&&d.event.title!==t.title&&(z.title=d.event.title,_.push(`📝 Title updated to: ${d.event.title}`)),d.event.description&&d.event.description!==t.description&&(z.description=d.event.description,_.push("📄 Description updated")),d.event.location&&d.event.location!==t.location&&(z.location=d.event.location,_.push(`📍 Location updated to: ${d.event.location}`)),d.event.price&&d.event.price!==t.price&&(z.price=String(d.event.price),_.push(`💰 Price updated to: ${d.event.price}`)),d.event.totalTickets&&d.event.totalTickets!==t.totalTickets&&(z.totalTickets=String(d.event.totalTickets),_.push(`🎟️ Total tickets updated to: ${d.event.totalTickets}`)),d.event.suggestedDate)){const de=xe(d.event.suggestedDate);z.date=de,_.push(`📅 Date updated to: ${new Date(de).toLocaleDateString()}`)}i(z);let ce=d.message||E;return _.length>0&&(ce+=`

Changes made:
`+_.join(`
`)),ce}}catch(w){console.error("Error parsing Google API response:",w)}return E}catch(T){throw console.error("Error calling Google API:",T),new Error("Failed to generate with Google AI")}}async function v(o){var f,h,p,$;try{const l=F.slice(-10),y=[{role:"system",content:`You are an event planning assistant. Always respond with a complete JSON object in this exact format, and nothing else before or after the JSON:
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
          5. Keep the response concise and within token limits`},{role:"system",content:`Current event state: ${JSON.stringify({title:t.title,description:t.description,location:t.location,price:parseFloat(t.price)||0,totalTickets:parseInt(t.totalTickets)||0,suggestedDate:t.date})}`},...l.map(w=>{var d;return{role:w.type==="user"?"user":"assistant",content:w.type==="user"?w.content:w.content.includes("Event Updated Successfully")&&((d=w.content.split("Changes made:")[1])==null?void 0:d.split(`
`).slice(0,-1).join(`
`))||w.content}}),{role:"user",content:`${o}
Respond only with the JSON object, no additional text.`}],T=await fetch("https://api.deepseek.com/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer undefined",Accept:"application/json"},body:JSON.stringify({model:"deepseek-chat",messages:y,temperature:.7,max_tokens:2e3,stream:!1})});if(!T.ok){const w=await T.json();throw new Error(((f=w.error)==null?void 0:f.message)||T.statusText)}const M=(($=(p=(h=(await T.json()).choices)==null?void 0:h[0])==null?void 0:p.message)==null?void 0:$.content)||"",E=M.trim().replace(/^```json\s*/,"").replace(/\s*```$/,"").replace(/^\s*\{/,"{").replace(/\}\s*$/,"}");try{return JSON.parse(E),E}catch{const d=M.match(/\{[\s\S]*\}/);if(d)return d[0];throw new Error("Invalid JSON response from API")}}catch(l){throw console.error("Deepseek API error details:",l),l}}const H=async()=>{if(!x.trim()){u("Please provide a description for the event");return}b(!0);try{const o=await r(x);P(f=>[...f,{type:"user",content:x,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);try{const f=o.match(/\{[\s\S]*?\}/);if(f){const h=f[0],p=JSON.parse(h),$=p.suggestedDate?new Date(p.suggestedDate).toISOString().slice(0,16):"";i(y=>({title:p.title||y.title,description:p.description||y.description,date:$,location:p.location||y.location,price:String(p.price||y.price||"0"),totalTickets:String(p.totalTickets||y.totalTickets||"100")}));const l=Y(`✨ **Event Created Successfully!**

📌 **Title**
${p.title}

📍 **Location**
${p.location}

📅 **Date & Time**
${$?new Date($).toLocaleString():"Not specified"}

💰 **Price**
₹${p.price||"0"}

🎟️ **Total Tickets**
${p.totalTickets||"100"}

📝 **Description**
${(p.description||"").substring(0,150)}...

I've filled in all the details in the form. Feel free to review and adjust anything!`);P(y=>[...y,{type:"ai",content:l,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}else P(h=>[...h,{type:"ai",content:Y(o),timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}catch(f){console.error("Error parsing AI response:",f),P(h=>[...h,{type:"ai",content:Y(o),timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}S(""),L(!0)}catch(o){console.error("Generation error:",o),P(f=>[...f,{type:"ai",content:o instanceof Error?o.message:"Failed to generate event",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}finally{b(!1)}},C=async()=>{if(!I.trim())return;const o=I.trim();R("");const f=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});P(h=>[...h,{type:"user",content:o,timestamp:f}]);try{b(!0);const h=await r(o);try{const p=h.match(/\{[\s\S]*?\}/);if(p){const $=p[0],l=JSON.parse($),y={...t},T=l.suggestedDate?new Date(l.suggestedDate).toISOString().slice(0,16):y.date;i(E=>({title:l.title||E.title,description:l.description||E.description,date:T,location:l.location||E.location,price:String(l.price||E.price||"0"),totalTickets:String(l.totalTickets||E.totalTickets||"100")}));const D=[];l.title&&l.title!==y.title&&D.push(`📌 **Title**: ${l.title}`),l.location&&l.location!==y.location&&D.push(`📍 **Location**: ${l.location}`),l.suggestedDate&&T!==y.date&&D.push(`📅 **Date & Time**: ${new Date(T).toLocaleString()}`),l.price&&String(l.price)!==y.price&&D.push(`💰 **Price**: ₹${l.price}`),l.totalTickets&&String(l.totalTickets)!==y.totalTickets&&D.push(`🎟️ **Total Tickets**: ${l.totalTickets}`),l.description&&l.description!==y.description&&D.push(`📝 **Description Update**: ${l.description.substring(0,150)}...`);let M=h.replace($,"").trim();M||(M=D.length>0?`✨ **Event Updated Successfully!**

Changes made:
${D.join(`
`)}

All changes have been applied to the form. Feel free to review and make any additional adjustments!`:"No changes were needed. The event details already match your request."),P(E=>[...E,{type:"ai",content:Y(M),timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}else P($=>[...$,{type:"ai",content:Y(h),timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}catch(p){console.error("Error parsing AI response:",p),P($=>[...$,{type:"ai",content:Y(h),timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}}catch(h){console.error("Chat error:",h),P(p=>[...p,{type:"ai",content:h instanceof Error?h.message:"Sorry, I encountered an error processing your request.",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}])}finally{b(!1)}},O=(o,f)=>n.jsxs(Pt,{$type:o.type,children:[n.jsx(It,{$type:o.type,dangerouslySetInnerHTML:{__html:o.type==="user"?o.content:Y(o.content)}}),o.type!=="info"&&o.timestamp&&n.jsx(Et,{$type:o.type,children:o.timestamp})]},f);return n.jsx(it,{children:n.jsxs(at,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[n.jsxs(st,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:.2},children:[n.jsxs(ct,{children:[n.jsx(pe,{size:24}),"Create New Event"]}),n.jsxs(dt,{onSubmit:W,children:[m&&n.jsxs(ht,{children:[n.jsx(Ce,{size:16}),m]}),n.jsxs(K,{children:[n.jsxs(B,{htmlFor:"title",children:[n.jsx(De,{size:16}),"Event Title"]}),n.jsx(G,{type:"text",id:"title",name:"title",value:t.title,onChange:q,placeholder:"Enter event title",required:!0})]}),n.jsxs(K,{children:[n.jsxs(B,{htmlFor:"date",children:[n.jsx(pe,{size:16}),"Date & Time"]}),n.jsx(G,{type:"datetime-local",id:"date",name:"date",value:t.date,onChange:q,required:!0})]}),n.jsxs(K,{children:[n.jsxs(B,{htmlFor:"location",children:[n.jsx(Ee,{size:16}),"Location"]}),n.jsx(G,{type:"text",id:"location",name:"location",value:t.location,onChange:q,placeholder:"Enter event location",required:!0})]}),n.jsxs(ft,{children:[n.jsxs(K,{children:[n.jsxs(B,{children:[n.jsx(_e,{size:16}),"Price"]}),n.jsx(ut,{type:"number",name:"price",value:t.price,onChange:q,placeholder:"0.00",min:"0",step:"any",required:!0})]}),n.jsxs(K,{children:[n.jsxs(B,{children:[n.jsx(Ie,{size:16}),"Total Tickets"]}),n.jsx(G,{type:"number",name:"totalTickets",value:t.totalTickets,onChange:q,placeholder:"100",min:"1",required:!0})]})]}),n.jsxs(K,{children:[n.jsxs(B,{htmlFor:"description",children:[n.jsx(Pe,{size:16}),"Description",n.jsx("span",{children:"(Markdown supported)"})]}),n.jsx(xt,{children:n.jsx(bt,{id:"description",name:"description",value:t.description,onChange:q,placeholder:"Write your event description here..."})})]}),n.jsxs(pt,{children:[n.jsxs(gt,{type:"submit",whileHover:{scale:1.02},whileTap:{scale:.98},children:[n.jsx(Fe,{size:18}),"Save Event"]}),n.jsxs(mt,{type:"button",onClick:()=>e("/events"),whileHover:{scale:1.02},whileTap:{scale:.98},children:[n.jsx(Ae,{size:18}),"Cancel"]})]})]}),n.jsxs(wt,{children:[n.jsxs(vt,{children:[n.jsx(Re,{size:20}),"Preview"]}),n.jsx(yt,{children:n.jsx(Ne,{children:t.description})})]})]}),n.jsx(lt,{children:n.jsxs(Tt,{children:[n.jsx(Me,{children:j&&n.jsx(jt,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.3},children:n.jsxs(Ct,{children:[n.jsx(Dt,{ref:N,children:F.map((o,f)=>O(o,f))}),n.jsxs(Ft,{children:[n.jsx(At,{placeholder:"Type your message...",value:I,onChange:o=>R(o.target.value),onKeyDown:o=>{o.key==="Enter"&&!o.shiftKey&&I.trim()&&(o.preventDefault(),C())}}),n.jsx(le,{onClick:C,disabled:!I.trim()||A,whileHover:{scale:1.05},whileTap:{scale:.95},children:A?n.jsx(k.div,{animate:{rotate:360},transition:{duration:1,repeat:1/0,ease:"linear"},children:n.jsx(ue,{size:18})}):n.jsx(Oe,{size:18})})]})]})})}),n.jsxs($t,{$isVisible:!j,children:[n.jsx(kt,{placeholder:"Ask AI to help create your event...",value:x,onChange:o=>S(o.target.value),onKeyDown:o=>{o.key==="Enter"&&!o.shiftKey&&x.trim()&&(o.preventDefault(),H())}}),n.jsx(St,{onClick:H,disabled:!x.trim()||A,children:A?n.jsx(k.div,{animate:{rotate:360},transition:{duration:1,repeat:1/0,ease:"linear"},children:n.jsx(ue,{size:18})}):n.jsx(ze,{size:18})})]})]})})]})})};export{_t as default};

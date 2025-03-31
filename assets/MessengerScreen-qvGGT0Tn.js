import{m as $,d as r,S as k,u as G,T as N,r as c,t as _,i as D,v as J,w as K,U as Q,o as Z,V as ee,h as te,j as t,b as re,W as ae,X as ie}from"./index-I4BBwYdS.js";import{b as oe,c as ne,d as I,e as q,f as se,g as de,h as le,i as ce,j as he,k as ge,l as xe}from"./index-DFRYBWvR.js";import{U as pe}from"./UserSearch-yu9ofzsz.js";import"./iconBase-VHV16drN.js";const be=$`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;$`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;const V=$`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`,W=$`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`,h={light:{background:"rgba(255, 255, 255, 0.6)",backgroundSecondary:"rgba(255, 255, 255, 0.3)",text:"#1a1b25",textSecondary:"#666",primary:"#4a6cf7",border:"rgba(225, 228, 232, 0.4)",shadow:"0 4px 15px rgba(0, 0, 0, 0.05)",cardShadow:"0 5px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",bubbleMine:"rgba(74, 108, 247, 0.9)",bubbleOther:"rgba(255, 255, 255, 0.8)",backgroundActive:"rgba(255, 255, 255, 0.9)"},dark:{background:"rgba(25, 28, 39, 0.8)",backgroundSecondary:"rgba(32, 36, 48, 0.7)",text:"#e1e5ee",textSecondary:"#a8b0c5",primary:"#6e8efb",border:"rgba(65, 70, 90, 0.6)",shadow:"0 4px 15px rgba(0, 0, 0, 0.15)",cardShadow:"0 5px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",bubbleMine:"rgba(74, 108, 247, 0.9)",bubbleOther:"rgba(41, 45, 62, 0.9)",backgroundActive:"rgba(42, 46, 60, 0.9)"}},P=r.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${e=>`${h[e.$theme].primary}40`};
    border-radius: 6px;
  }
`,me=r.div`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid ${e=>h[e.$theme].border};
  cursor: pointer;
  background-color: ${e=>e.$isActive?h[e.$theme].backgroundActive:"transparent"};
  transition: all 0.2s ease;
  position: relative;
  ${e=>k`animation: ${W} 0.4s ease-out;`}
  backdrop-filter: ${e=>e.$isActive?"blur(10px)":"blur(0px)"};
  
  &:hover {
    background-color: ${e=>e.$isActive?h[e.$theme].backgroundActive:e.$theme==="light"?"rgba(255, 255, 255, 0.5)":"rgba(42, 46, 60, 0.5)"};
    backdrop-filter: blur(5px);
  }
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background-color: ${e=>h[e.$theme].primary};
    opacity: ${e=>e.$isActive?1:0};
    transition: opacity 0.3s ease;
  }
`,ue=r.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${e=>e.$imageUrl?`url(${e.$imageUrl}) no-repeat center/cover`:e.$theme==="light"?"linear-gradient(135deg, #6e8efb, #4a6cf7)":"linear-gradient(135deg, #845ef7, #5e3bd1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid ${e=>e.$theme==="light"?"rgba(255, 255, 255, 0.9)":"rgba(42, 46, 60, 0.9)"};
  position: relative;
  
  ${e=>e.$isOnline&&k`
    &:after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 0px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #10b981;
      border: 2px solid ${e.$theme==="light"?"rgba(255, 255, 255, 0.9)":"rgba(42, 46, 60, 0.9)"};
    }
  `}
`,fe=r.div`
  flex: 1;
  min-width: 0;
  position: relative;
`,$e=r.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  align-items: center;
`,ve=r.div`
  font-weight: 600;
  font-size: 15px;
  color: ${e=>h[e.$theme].text};
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  svg {
    font-size: 12px;
    opacity: 0.7;
  }
`,ye=r.div`
  font-size: 0.8rem;
  color: ${e=>h[e.$theme].textSecondary};
  white-space: nowrap;
`,we=r.div`
  color: ${e=>e.$unread?h[e.$theme].text:h[e.$theme].textSecondary};
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: ${e=>e.$unread?"600":"400"};
  
  svg {
    flex-shrink: 0;
  }
`,ke=r.div`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: ${e=>h[e.$theme].primary};
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,je=r.div`
  padding: 20px;
  background-color: ${e=>e.$theme==="light"?"rgba(255, 245, 245, 0.8)":"rgba(61, 44, 44, 0.8)"};
  border-radius: 8px;
  margin: 16px;
  border: 1px solid ${e=>e.$theme==="light"?"rgba(254, 202, 202, 0.8)":"rgba(127, 29, 29, 0.5)"};
  backdrop-filter: blur(10px);
  
  h3 {
    color: ${e=>e.$theme==="light"?"#e53e3e":"#fc8181"};
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 0;
  }
`,Se=r.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: ${e=>e.$theme==="light"?"#e53e3e":"#fc8181"};
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  margin: 16px 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`,Ue=r.div`
  text-align: center;
  padding: 32px 16px;
  color: ${e=>h[e.$theme].textSecondary};
  
  h3 {
    color: ${e=>h[e.$theme].primary};
  }
`,Ce=r.div`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid ${e=>h[e.$theme].border};
  ${e=>k`animation: ${W} 0.4s ease-out;`}
`,Ae=r.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  background: linear-gradient(
    90deg,
    ${e=>e.$theme==="light"?"rgba(240, 240, 240, 0.8)":"rgba(42, 46, 60, 0.8)"},
    ${e=>e.$theme==="light"?"rgba(248, 248, 248, 0.8)":"rgba(54, 60, 78, 0.8)"},
    ${e=>e.$theme==="light"?"rgba(240, 240, 240, 0.8)":"rgba(42, 46, 60, 0.8)"}
  );
  background-size: 200% 100%;
  ${e=>k`animation: ${V} 1.5s infinite;`}
`;r.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;r.div`
  height: ${e=>e.$height||"10px"};
  width: ${e=>e.$width||"100%"};
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    ${e=>e.$theme==="light"?"rgba(240, 240, 240, 0.8)":"rgba(42, 46, 60, 0.8)"},
    ${e=>e.$theme==="light"?"rgba(248, 248, 248, 0.8)":"rgba(54, 60, 78, 0.8)"},
    ${e=>e.$theme==="light"?"rgba(240, 240, 240, 0.8)":"rgba(42, 46, 60, 0.8)"}
  );
  background-size: 200% 100%;
  ${e=>k`animation: ${V} 1.5s infinite;`}
`;r(se)`
  ${e=>k`animation: ${be} 1s linear infinite;`}
  font-size: 24px;
  color: ${e=>e.color||"#4a6cf7"};
`;r.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: ${e=>h[e.$theme].textSecondary};
`;const ze=({onSelectConversation:e,theme:n})=>{const{currentUser:f}=G(),{conversationId:v}=N(),[j,A]=c.useState([]),[y,S]=c.useState(!0),[M,U]=c.useState(null),[z,T]=c.useState(null);c.useEffect(()=>{if(f){S(!0),U("");try{const a=_(D,"conversations"),i=J(a,K("participantIds","array-contains",f.uid),Q("updatedAt","desc"));return Z(i,async x=>{const m=await Promise.all(x.docs.map(async g=>{const o=g.data(),d=o.participantIds.find(s=>s!==f.uid);let p=null;if(d)try{const s=await ee(te(D,"users",d));if(s.exists()){const b=s.data();p={id:d,username:b.username||b.displayName,email:b.email,photoURL:b.photoURL,profilePicture:b.profilePicture,isOnline:b.isOnline}}}catch(s){console.error("Error fetching other user:",s)}return{id:g.id,...o,otherUser:p}})),u=new Map;m.forEach(g=>{var d,p,s;if(!((d=g.otherUser)!=null&&d.id))return;const o=((p=g.updatedAt)==null?void 0:p.toMillis())||0;(!u.has(g.otherUser.id)||o>(((s=u.get(g.otherUser.id).updatedAt)==null?void 0:s.toMillis())||0))&&u.set(g.otherUser.id,g)});const C=Array.from(u.values());A(C),S(!1)},x=>{if(console.error("Error fetching conversations:",x),U(x.message),x.message.includes("index")){const m=x.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);m&&T(m[0])}S(!1)})}catch(a){console.error("Error setting up conversations listener:",a),U("Failed to set up conversations listener"),S(!1)}}},[f]);const F=a=>{if(!a)return"";const i=a.toDate(),w=new Date;return i.toDateString()===w.toDateString()?i.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):Math.floor((w.getTime()-i.getTime())/(1e3*60*60*24))<7?i.toLocaleDateString([],{weekday:"short"}):i.toLocaleDateString([],{month:"short",day:"numeric"})},E=a=>a?a.split("@")[0].charAt(0).toUpperCase():"U",O=a=>a?a.split("@")[0]:"User";return y?t.jsx(P,{$theme:n,children:[1,2,3,4,5].map(a=>t.jsxs(Ce,{$theme:n,children:[t.jsx(Ae,{$theme:n}),t.jsxs("div",{style:{flex:1},children:[t.jsx("div",{style:{height:14,width:"60%",background:n==="light"?"rgba(240, 240, 240, 0.8)":"rgba(42, 46, 60, 0.8)",borderRadius:4,marginBottom:8}}),t.jsx("div",{style:{height:10,width:"85%",background:n==="light"?"rgba(240, 240, 240, 0.8)":"rgba(42, 46, 60, 0.8)",borderRadius:4}})]})]},a))}):M?t.jsxs(je,{$theme:n,children:[t.jsxs("h3",{children:[t.jsx(oe,{})," Firestore Index Required"]}),t.jsx("p",{children:"This query requires a special database index to work efficiently."}),z?t.jsxs(t.Fragment,{children:[t.jsx("p",{children:"Click below to create the index in Firebase (you'll need to be logged in to Firebase):"}),t.jsxs(Se,{href:z,target:"_blank",rel:"noopener noreferrer",$theme:n,children:[t.jsx(ne,{})," Create Firestore Index"]}),t.jsx("p",{style:{fontSize:"0.9rem",marginTop:20},children:"After creating the index, return here and refresh the page. The index may take a minute to activate."})]}):t.jsx("p",{children:"Please check the console for the exact error details."})]}):j.length===0?t.jsxs(Ue,{$theme:n,children:[t.jsx("h3",{children:"No conversations yet"}),t.jsx("p",{children:"Start chatting by searching for users using the Search tab"})]}):t.jsx(P,{$theme:n,children:j.map(a=>{var x,m,u,C,g,o,d,p,s;const i=a.unreadCount>0,w=((x=a.otherUser)==null?void 0:x.isOnline)===!0;return t.jsxs(me,{$isActive:a.id===v,$theme:n,onClick:()=>e(a),children:[t.jsx(ue,{$imageUrl:((m=a.otherUser)==null?void 0:m.photoURL)||((u=a.otherUser)==null?void 0:u.profilePicture),$theme:n,$isOnline:w,children:!((C=a.otherUser)!=null&&C.photoURL)&&!((g=a.otherUser)!=null&&g.profilePicture)&&E(((o=a.otherUser)==null?void 0:o.username)||((d=a.otherUser)==null?void 0:d.email)||"")}),t.jsxs(fe,{$theme:n,children:[t.jsxs($e,{children:[t.jsxs(ve,{$theme:n,children:[((p=a.otherUser)==null?void 0:p.username)||((s=a.otherUser)==null?void 0:s.email)&&O(a.otherUser.email)||"User",t.jsx(I,{title:"End-to-end encrypted"})]}),t.jsx(ye,{$theme:n,children:a.updatedAt&&F(a.updatedAt)})]}),t.jsxs(we,{$theme:n,$unread:i,children:[i&&t.jsx(q,{size:8,color:h[n].primary}),a.lastMessage||"No messages yet"]}),i&&a.unreadCount>0&&t.jsx(ke,{$theme:n,children:a.unreadCount})]})]},a.id)})})};$`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;$`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;const Ee=$`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;$`
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;const l={light:{background:"rgba(255, 255, 255, 0.6)",backgroundSecondary:"rgba(255, 255, 255, 0.3)",text:"#1a1b25",textSecondary:"#666",primary:"#4a6cf7",border:"rgba(225, 228, 232, 0.4)",shadow:"0 10px 25px rgba(0, 0, 0, 0.08)",cardShadow:"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",bubbleMine:"rgba(74, 108, 247, 0.9)",bubbleOther:"rgba(255, 255, 255, 0.8)",backgroundActive:"rgba(74, 108, 247, 0.1)"},dark:{background:"rgba(25, 28, 39, 0.8)",backgroundSecondary:"rgba(32, 36, 48, 0.7)",text:"#e1e5ee",textSecondary:"#a8b0c5",primary:"#6e8efb",border:"rgba(65, 70, 90, 0.6)",shadow:"0 10px 25px rgba(0, 0, 0, 0.2)",cardShadow:"0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",bubbleMine:"rgba(74, 108, 247, 0.9)",bubbleOther:"rgba(41, 45, 62, 0.9)",backgroundActive:"rgba(74, 108, 247, 0.2)"}},Oe=r.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    height: 100%;
    /* Add safe area insets for iOS devices */
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`,Me=r.div`
  background: ${e=>l[e.$theme].background};
  backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid ${e=>e.$theme==="light"?"rgba(255, 255, 255, 0.8)":"rgba(255, 255, 255, 0.1)"};
  box-shadow: ${e=>l[e.$theme].cardShadow};
  margin: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  ${e=>k`animation: ${Ee} 0.5s ease-out;`}
  
  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
    height: 100%;
  }
`,Te=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${e=>l[e.$theme].border};
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${e=>l[e.$theme].background};
  backdrop-filter: blur(20px);
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    padding-top: max(12px, env(safe-area-inset-top, 12px));
  }
`,Fe=r.div`
  display: flex;
  align-items: center;
`,R=r.div`
  display: flex;
  flex-direction: column;
`,Y=r.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>l[e.$theme].text};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`,Ie=r.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${e=>e.$imageUrl?`url(${e.$imageUrl}) no-repeat center/cover`:e.$theme==="light"?"linear-gradient(135deg, #6e8efb, #4a6cf7)":"linear-gradient(135deg, #845ef7, #5e3bd1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`,H=r.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: ${e=>e.$online?"#10b981":l[e.$theme].textSecondary};
  margin-top: 2px;
  font-weight: ${e=>e.$online?"500":"400"};
  
  svg {
    font-size: 0.7rem;
  }
`,Le=r.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,X=r.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${e=>e.$theme==="light"?"rgba(255, 255, 255, 0.8)":"rgba(42, 46, 60, 0.8)"};
  color: ${e=>l[e.$theme].text};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-right: 12px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: ${e=>e.$theme==="light"?"rgba(255, 255, 255, 0.9)":"rgba(52, 56, 70, 0.9)"};
  }
  
  &:active {
    transform: translateY(0);
  }
`,De=r.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${e=>e.$theme==="light"?"rgba(255, 255, 255, 0.8)":l.dark.backgroundSecondary};
  color: ${e=>e.$theme==="light"?"#6e8efb":"#ffd43b"};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`,Pe=r(X)`
  color: ${e=>l[e.$theme].primary};
`,Re=r.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`,Ye=r.div`
  width: 350px;
  border-right: 1px solid ${e=>l[e.$theme].border};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${e=>l[e.$theme].backgroundSecondary};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    position: absolute;
    left: ${e=>e.$isVisible?"0":"-100%"};
    width: 100%;
    height: calc(100% - 56px - env(safe-area-inset-top, 0px));
    top: 56px;
    top: calc(56px + env(safe-area-inset-top, 0px));
    z-index: 20;
    border-right: none;
  }
`,He=r.div`
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid ${e=>l[e.$theme].border};
  background: ${e=>l[e.$theme].backgroundSecondary};
  position: sticky;
  top: 0;
  z-index: 5;
`,B=r.div`
  flex: 1;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  color: ${e=>e.$active?l[e.$theme].primary:l[e.$theme].textSecondary};
  font-weight: ${e=>e.$active?"600":"500"};
  border-bottom: 2px solid ${e=>e.$active?l[e.$theme].primary:"transparent"};
  transition: all 0.3s ease;
  background-color: ${e=>e.$active?e.$theme==="light"?"rgba(255, 255, 255, 0.6)":"rgba(42, 46, 60, 0.6)":"transparent"};
  backdrop-filter: ${e=>e.$active?"blur(8px)":"none"};
  
  &:hover {
    background-color: ${e=>!e.$active&&(e.$theme==="light"?"rgba(255, 255, 255, 0.4)":"rgba(42, 46, 60, 0.4)")};
    color: ${e=>!e.$active&&(e.$theme==="light"?"#4a4a4a":"#d1d5db")};
  }
`,Be=r.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  height: 100%;
`,Ne=r.div`
  flex: 1;
  overflow-y: auto;
  /* Add momentum-based scrolling for iOS */
  -webkit-overflow-scrolling: touch;
  
  /* Make sure it fills the available space */
  display: flex;
  flex-direction: column;
  height: 100%;
`,qe=r.div`
  flex: 1;
  position: relative;
  background-color: ${e=>l[e.$theme].backgroundSecondary};
  backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    display: ${e=>e.$sidebarVisible?"none":"block"};
  }
`,_e=()=>{const{conversationId:e}=N(),n=re(),[f,v]=c.useState(!0),[j,A]=c.useState("conversations"),[y,S]=c.useState(window.innerWidth<=768),[M,U]=c.useState(null),[z,T]=c.useState(null),[F,E]=c.useState(""),[O,a]=c.useState(!1),[i,w]=c.useState("light");c.useEffect(()=>{const o=()=>{const d=window.innerWidth<=768;S(d),d||v(!0)};return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),c.useEffect(()=>{e&&y&&v(!1)},[e,y]);const x=(o,d,p,s)=>{if(U(o),T(d||null),a(p||!1),s){const b=s.split("@")[0].charAt(0).toUpperCase();E(b)}else o&&E(o.charAt(0).toUpperCase())},m=()=>{v(!0),U(null)},u=()=>{w(i==="light"?"dark":"light")},C=()=>{n("/events")},g=!!e&&!f;return t.jsxs(Oe,{children:[t.jsx(ae,{}),t.jsxs(Me,{$theme:i,children:[t.jsxs(Te,{$theme:i,children:[t.jsx(Fe,{children:g&&y?t.jsxs(t.Fragment,{children:[t.jsx(X,{$theme:i,onClick:m,children:t.jsx(de,{})}),t.jsx(Ie,{$imageUrl:z||void 0,$theme:i,children:!z&&F}),t.jsxs(R,{children:[t.jsx(Y,{$theme:i,children:M||"Chat"}),t.jsx(H,{$theme:i,$online:O,children:O?t.jsxs(t.Fragment,{children:[t.jsx(q,{size:8})," Online"]}):t.jsxs(t.Fragment,{children:[t.jsx(I,{})," End-to-End Encrypted"]})})]})]}):t.jsxs(t.Fragment,{children:[t.jsx(Pe,{$theme:i,onClick:C,children:t.jsx(le,{})}),t.jsxs(R,{children:[t.jsx(Y,{$theme:i,children:"Secure Private Conversations"}),t.jsxs(H,{$theme:i,$online:!1,children:[t.jsx(I,{})," End-to-End Encrypted"]})]})]})}),t.jsx(Le,{children:t.jsx(De,{$theme:i,onClick:u,children:i==="light"?t.jsx(ce,{}):t.jsx(he,{})})})]}),t.jsxs(Re,{children:[t.jsxs(Ye,{$isVisible:f,$theme:i,children:[t.jsxs(He,{$theme:i,children:[t.jsxs(B,{$active:j==="conversations",$theme:i,onClick:()=>A("conversations"),children:[t.jsx(ge,{})," Conversations"]}),t.jsxs(B,{$active:j==="search",$theme:i,onClick:()=>A("search"),children:[t.jsx(xe,{})," Search"]})]}),j==="search"?t.jsx(Be,{$theme:i,children:t.jsx(pe,{onSelectUser:o=>{n(`/messenger/chat/${o._id}`),A("conversations"),y&&v(!1)},theme:i})}):t.jsx(Ne,{$theme:i,children:t.jsx(ze,{onSelectConversation:o=>{var d,p,s,b,L;n(`/messenger/chat/${o.id}`),y&&v(!1),x((d=o.otherUser)!=null&&d.email?o.otherUser.email.split("@")[0]:"Chat",((p=o.otherUser)==null?void 0:p.photoURL)||((s=o.otherUser)==null?void 0:s.profilePicture),(b=o.otherUser)==null?void 0:b.isOnline,(L=o.otherUser)==null?void 0:L.email)},theme:i})})]}),t.jsx(qe,{$sidebarVisible:f,$theme:i,children:t.jsx(ie,{context:{updateOtherUserName:x,theme:i}})})]})]})]})};export{_e as default};

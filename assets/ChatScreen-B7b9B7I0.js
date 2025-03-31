import{m as C,d as n,T as Ie,u as Ce,r as s,Y as Ue,b as Me,v as Te,U as Pe,w as Re,t as L,o as Ae,j as t,h as S,i as f,V as ae,F as De,G as Ee,Z as Be,J as Oe,_ as se,$ as z,K as le}from"./index-I4BBwYdS.js";import{b as de,g as Le,d as Ne,m as We,a as _e,n as He,o as ce,p as pe,q as I,f as Ve,r as Ye}from"./index-DFRYBWvR.js";import"./iconBase-VHV16drN.js";const Ge=e=>{const a=e.type.split("/")[0];return a==="image"?"image":a==="video"?"video":a==="audio"?"audio":["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","text/plain"].includes(e.type)?"document":"other"},N=e=>e<1024?e+" bytes":e<1024*1024?(e/1024).toFixed(1)+" KB":e<1024*1024*1024?(e/(1024*1024)).toFixed(1)+" MB":(e/(1024*1024*1024)).toFixed(1)+" GB";C`
  from { opacity: 0; }
  to { opacity: 1; }
`;const qe=C`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,Ke=C`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`,Xe=C`
  0% { opacity: 0; transform: translateY(10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
`,i={light:{background:"rgba(255, 255, 255, 0.6)",backgroundSecondary:"rgba(255, 255, 255, 0.3)",text:"#1a1b25",textSecondary:"#666",primary:"#4a6cf7",border:"rgba(225, 228, 232, 0.4)",shadow:"0 10px 25px rgba(0, 0, 0, 0.08)",bubbleMine:"rgba(74, 108, 247, 0.9)",bubbleOther:"rgba(255, 255, 255, 0.8)"},dark:{background:"rgba(25, 28, 39, 0.8)",backgroundSecondary:"rgba(32, 36, 48, 0.7)",text:"#e1e5ee",textSecondary:"#a8b0c5",primary:"#6e8efb",border:"rgba(65, 70, 90, 0.6)",shadow:"0 10px 25px rgba(0, 0, 0, 0.2)",bubbleMine:"rgba(74, 108, 247, 0.9)",bubbleOther:"rgba(42, 46, 60, 0.8)"}},Ze=n.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: ${e=>i[e.$theme].background};
  border-bottom: 1px solid ${e=>i[e.$theme].border};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  width: 100%;
  box-sizing: border-box;
  height: 60px;
  backdrop-filter: blur(8px);
  box-shadow: ${e=>i[e.$theme].shadow};

  @media (max-width: 768px) {
    display: none; /* Hide the header on mobile devices */
  }
`,Je=n.button`
  background: none;
  border: none;
  color: ${e=>i[e.$theme].text};
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`,Qe=n.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #6e8efb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 12px;
`,et=n.div`
  flex: 1;
`,tt=n.div`
  font-weight: 600;
  color: ${e=>i[e.$theme].text};
  font-size: 16px;
`,ot=n.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${e=>i[e.$theme].textSecondary};
  
  svg {
    margin-right: 5px;
    color: ${e=>i[e.$theme].primary};
  }
`,rt=n.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  flex: 1;
  overflow: hidden; /* Prevent any overflow issues */
  max-width: 100%; /* Ensure content doesn't extend beyond container */
  width: 100%; /* Take full width */
  box-sizing: border-box; /* Include padding in width calculation */
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color: ${e=>e.$theme==="light"?"rgba(248, 250, 252, 0.9)":"rgba(28, 31, 42, 0.9)"};
  }
`,nt=n.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  padding: 20px;
  padding-top: 80px; /* Add extra padding at top to account for fixed header */
  padding-bottom: 90px; /* Add extra padding at bottom to account for fixed input container */
  background-color: ${e=>e.$theme==="light"?"rgba(248, 250, 252, 0.5)":"rgba(28, 31, 42, 0.5)"};
  height: 100%; /* Take full height, padding will account for fixed elements */
  width: 100%; /* Take full width */
  scroll-behavior: smooth; /* Add smooth scrolling for all scroll actions */
  max-width: 100%; /* Ensure content doesn't overflow horizontally */
  box-sizing: border-box; /* Include padding in width calculation */
  margin: 0;
  
  /* Custom Scrollbar Styling */
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: ${e=>e.$theme==="light"?"rgba(180, 190, 210, 0.7) rgba(240, 242, 245, 0.6)":"rgba(80, 90, 110, 0.7) rgba(40, 44, 52, 0.6)"}; /* For Firefox */
  
  /* Only show scrollbar on hover for a cleaner look */
  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
    opacity: 0.2;
  }
  
  &::-webkit-scrollbar-track {
    background: ${e=>e.$theme==="light"?"rgba(240, 242, 245, 0.6)":"rgba(40, 44, 52, 0.6)"};
    border-radius: 10px;
    margin: 4px 0;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${e=>e.$theme==="light"?"rgba(180, 190, 210, 0.7)":"rgba(80, 90, 110, 0.7)"};
    border-radius: 10px;
    transition: background 0.3s ease;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${e=>e.$theme==="light"?"rgba(150, 160, 180, 0.9)":"rgba(100, 110, 130, 0.9)"};
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  /* Hide scrollbar when not needed (but keep functionality) */
  &::-webkit-scrollbar-thumb:vertical {
    min-height: 30px;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    padding-top: 15px; /* Reset padding on mobile since header is hidden */
    padding-bottom: 80px; /* Add extra padding at bottom for mobile */
    height: 100%; /* Take full height */
  }
`,it=n.div`
  display: flex;
  flex-direction: column;
  align-items: ${e=>e.$isMine?"flex-end":"flex-start"};
  margin-bottom: 12px;
  max-width: 100%;
  box-sizing: border-box;
`,at=n.div`
  max-width: 70%;
  padding: 10px 16px;
  border-radius: 18px;
  background-color: ${e=>e.$isMine?i[e.$theme].bubbleMine:i[e.$theme].bubbleOther};
  color: ${e=>e.$isMine?"white":e.$theme==="light"?"#1a1b25":"#e1e5ee"};
  box-shadow: ${e=>i[e.$theme].shadow};
  word-break: break-word; /* Break long words */
  white-space: pre-wrap; /* Preserve line breaks but wrap text */
  overflow-wrap: break-word; /* Ensure long words don't overflow */
  hyphens: auto; /* Allow hyphenation */
  box-sizing: border-box;
  margin: 0;
  
  @media (max-width: 480px) {
    max-width: 85%;
  }
`,st=n.div`
  font-size: 0.7rem;
  margin-top: 4px;
  color: ${e=>e.$theme==="light"?"#999":"#a8b0c5"};
  display: flex;
  align-items: center;
  gap: 4px;
`,he=n.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  color: ${e=>i[e.$theme].textSecondary};
  
  svg {
    margin-bottom: 16px;
    color: ${e=>i[e.$theme].primary};
    animation: ${Ke} 1.5s ease infinite;
  }
`,lt=n.div`
  padding: 16px;
  background-color: ${e=>i[e.$theme].background};
  border-top: 1px solid ${e=>i[e.$theme].border};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 20;
  backdrop-filter: blur(8px);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  margin: 0;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`,dt=n.div`
  display: flex;
  align-items: center;
  background-color: ${e=>i[e.$theme].backgroundSecondary};
  border-radius: 24px;
  padding: 0 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`,ct=n.input`
  flex: 1;
  border: none;
  padding: 12px;
  background: transparent;
  color: ${e=>i[e.$theme].text};
  font-size: 0.95rem;
  outline: none;
  
  &::placeholder {
    color: ${e=>e.$theme==="light"?"#aaa":"#777"};
  }
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`,pt=n.button`
  background: none;
  border: none;
  color: ${e=>i[e.$theme].primary};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${e=>e.$theme==="light"?"rgba(74, 108, 247, 0.1)":"rgba(110, 142, 251, 0.1)"};
  }
`,ht=n.button`
  background: none;
  border: none;
  color: ${e=>i[e.$theme].primary};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${e=>e.$theme==="light"?"rgba(74, 108, 247, 0.1)":"rgba(110, 142, 251, 0.1)"};
  }
  
  &:disabled {
    color: ${e=>e.$theme==="light"?"#ccc":"#555"};
    cursor: default;
    
    &:hover {
      background-color: transparent;
    }
  }
`,xt=n.div`
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${e=>e.$theme==="light"?"rgba(255, 250, 230, 0.9)":"rgba(66, 60, 40, 0.9)"};
  color: ${e=>e.$theme==="light"?"#856404":"#ffd350"};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${Xe} 5s ease forwards;
  max-width: 90%;
  text-align: center;
  
  svg {
    flex-shrink: 0;
  }
`,W=n.input`
  display: none;
`,gt=n.div`
  position: absolute;
  bottom: 70px;
  left: 16px;
  background-color: ${e=>i[e.$theme].background};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: ${e=>e.$show?"block":"none"};
  z-index: 100;
  width: 180px;
`,v=n.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  color: ${e=>i[e.$theme].text};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${e=>e.$theme==="light"?"rgba(0, 0, 0, 0.05)":"rgba(255, 255, 255, 0.05)"};
  }
  
  svg {
    color: ${e=>i[e.$theme].primary};
  }
`,xe=n(Ve)`
  animation: ${qe} 1s linear infinite;
`,mt=n.div`
  margin-bottom: 16px;
  padding: 12px;
  background-color: ${e=>e.$theme==="light"?"rgba(248, 250, 252, 0.8)":"rgba(32, 36, 48, 0.8)"};
  border-radius: 12px;
  border: 1px solid ${e=>i[e.$theme].border};
  position: relative;
`,ft=n.div`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 100%;
`,ut=n.div`
  flex: 1;
  min-width: 0;
  
  h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: ${e=>i[e.$theme].text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  span {
    font-size: 12px;
    color: ${e=>i[e.$theme].textSecondary};
  }
`,bt=n.div`
  width: 60px;
  height: 60px;
  background: ${e=>e.$theme==="light"?"#f0f2f5":"#2d3748"};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    font-size: 24px;
    color: ${e=>i[e.$theme].primary};
  }
`,$t=n.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${e=>e.$theme==="light"?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)"};
  color: ${e=>e.$theme==="light"?"#333":"#eee"};
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: ${e=>e.$theme==="light"?"rgba(0,0,0,0.2)":"rgba(255,255,255,0.2)"};
  }
`,wt=n.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$theme==="light"?"rgba(255, 255, 255, 0.8)":"rgba(28, 31, 42, 0.8)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
`,vt=n.div`
  width: 80%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 12px 0;
  overflow: hidden;
`,yt=n.div`
  height: 100%;
  width: ${e=>e.$progress}%;
  background-color: ${e=>i[e.$theme].primary};
  border-radius: 4px;
  transition: width 0.3s ease;
`,jt=n.div`
  color: ${e=>i[e.$theme].text};
  font-size: 14px;
  margin-top: 8px;
`,_=n(I)`
  color: ${e=>i[e.$theme].primary};
  font-size: 24px;
`,ge=n(Ye)`
  color: ${e=>i[e.$theme].primary};
  font-size: 24px;
`,kt=n(I)`
  color: ${e=>i[e.$theme].primary};
  font-size: 24px;
`,Ft=n.div`
  margin-top: 12px;
  padding: 8px 12px;
  background-color: ${e=>e.$theme==="light"?"rgba(255, 255, 255, 0.7)":"rgba(42, 46, 60, 0.7)"};
  border-radius: 8px;
  display: flex;
  align-items: center;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`,me=n.div`
  margin-left: 12px;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  
  .file-name {
    color: ${e=>i[e.$theme].text};
    font-weight: 500;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  
  .file-size {
    color: ${e=>i[e.$theme].textSecondary};
    font-size: 12px;
  }
`,Ct=()=>{const{conversationId:e}=Ie(),{currentUser:a}=Ce(),[H,fe]=s.useState([]),[m,U]=s.useState(""),[ue,M]=s.useState(!0),[V,Y]=s.useState(null),[G,u]=s.useState(!1),[be,q]=s.useState(!1),[$e,we]=s.useState(!1),[h,K]=s.useState(null),[k,T]=s.useState(null),[y,X]=s.useState(null),[Z,j]=s.useState(!1),[J,Q]=s.useState(0),[ee,ve]=s.useState("User"),P=s.useRef(null),R=s.useRef(null),A=s.useRef(null),D=s.useRef(null),{updateOtherUserName:te,theme:r}=Ue(),ye=Me();s.useEffect(()=>{const o=()=>{const d=navigator.userAgent||navigator.vendor||window.opera;we(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(d))};return o(),window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),s.useEffect(()=>{if(!a||!e)return;(async()=>{var g;try{const c=S(f,"conversations",e),p=await ae(c);if(!p.exists()){Y("Conversation not found"),M(!1);return}const O=p.data(),F=Object.keys(O.participants).find(b=>b!==a.uid);if(F){const b=S(f,"users",F),$=await ae(b);if($.exists()){const w=$.data(),x=w.displayName||((g=w.email)==null?void 0:g.split("@")[0])||"User";ve(x),te(x,w.photoURL,w.isOnline,w.email)}}M(!1)}catch(c){console.error("Error fetching conversation:",c),Y("Failed to load conversation"),M(!1)}})();const d=Te(L(f,"messages"),Re("conversationId","==",e),Pe("createdAt","asc")),l=Ae(d,g=>{const c=g.docs.map(p=>({id:p.id,...p.data()}));fe(c),setTimeout(()=>{var p;(p=D.current)==null||p.scrollIntoView({behavior:"smooth"})},100)});return()=>l()},[e,a,te]);const oe=o=>{o.preventDefault(),P.current&&P.current.click(),u(!1)},je=o=>{o.preventDefault(),R.current&&R.current.click(),u(!1)},re=o=>{o.preventDefault(),A.current&&A.current.click(),u(!1)},ke=o=>{o.preventDefault(),alert("Webcam functionality would be implemented here"),u(!1)},E=o=>{const d=o.target.files;if(!d||d.length===0)return;const l=d[0],g=5*1024*1024*1024;if(l.size>g){alert("File is too large. Maximum size is 5GB.");return}K(l);const c=Ge(l);if(X(c),c==="image"||c==="video"||c==="audio"){const p=URL.createObjectURL(l);T(p)}else T(null);q(!0),setTimeout(()=>q(!1),5e3),u(!1)},B=()=>{k&&URL.revokeObjectURL(k),K(null),T(null),X(null)},Fe=async o=>{if(!(!a||!e))try{await se(L(f,"messages"),{conversationId:e,senderId:a.uid,text:o,createdAt:z(),read:!1});const d=S(f,"conversations",e);return await le(d,{lastMessage:o||"Sent a message",updatedAt:z()}),!0}catch(d){return console.error("Error sending text message:",d),!1}},ne=async o=>{var d;if(o&&o.preventDefault(),!(!m.trim()&&!h)){if(!a||!e){console.error("User not authenticated or conversation ID missing");return}try{let l=null;if(h)try{j(!0),Q(0);const c=Date.now()+24*60*60*1e3,p=Date.now().toString(),O=De(Ee,`chat_files/${e}/${p}_${h.name}`),F={customMetadata:{expiresAt:c.toString(),conversationId:e,messageId:p,uploadedBy:a.uid}},b=Be(O,h,F);await new Promise(($,w)=>{b.on("state_changed",x=>{const ie=x.bytesTransferred/x.totalBytes*100;Q(ie),console.log(`Upload progress: ${ie}%`)},x=>{console.error("Upload error:",x),j(!1),$()},async()=>{try{l={url:await Oe(b.snapshot.ref),fileName:h.name,fileType:h.type,fileSize:h.size,contentType:y||"other",expiresAt:c},j(!1),$()}catch(x){console.error("Error getting download URL:",x),j(!1),$()}})})}catch(c){if(console.error("Error uploading file:",c),j(!1),m.trim()&&await Fe(m)){U(""),B();return}alert("Failed to upload file. Please try again or send text only.")}await se(L(f,"messages"),{conversationId:e,senderId:a.uid,text:m,createdAt:z(),read:!1,...l&&{file:l}});const g=S(f,"conversations",e);await le(g,{lastMessage:l?`Sent a ${l.contentType}: ${l.fileName}`:m||"Sent a message",updatedAt:z()}),U(""),B(),(d=D.current)==null||d.scrollIntoView({behavior:"smooth"})}catch(l){console.error("Error sending message:",l),alert("Failed to send message. Please try again.")}}},Se=o=>o?(o.toDate?o.toDate():new Date(o)).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";if(ue)return t.jsxs(he,{$theme:r,children:[t.jsx(xe,{}),t.jsx("div",{children:"Loading conversation..."})]});if(V)return t.jsxs(he,{$theme:r,children:[t.jsx(de,{size:24}),t.jsx("div",{children:V})]});const ze=()=>{ye("/messenger")};return t.jsxs(rt,{$theme:r,children:[t.jsxs(Ze,{$theme:r,children:[t.jsx(Je,{$theme:r,onClick:ze,children:t.jsx(Le,{})}),t.jsx(Qe,{$theme:r,children:ee.charAt(0).toUpperCase()}),t.jsxs(et,{children:[t.jsx(tt,{$theme:r,children:ee}),t.jsxs(ot,{$theme:r,children:[t.jsx(Ne,{})," End-to-End Encrypted"]})]})]}),t.jsxs(nt,{$theme:r,children:[H.map(o=>t.jsxs(it,{$isMine:o.senderId===(a==null?void 0:a.uid),children:[t.jsxs(at,{$isMine:o.senderId===(a==null?void 0:a.uid),$theme:r,children:[o.text,o.file&&t.jsx(Ft,{$theme:r,children:o.file.contentType==="image"?t.jsx("a",{href:o.file.url,target:"_blank",rel:"noopener noreferrer",style:{width:"100%"},children:t.jsx("img",{src:o.file.url,alt:o.file.fileName,style:{width:"100%",maxHeight:"200px",borderRadius:"8px",objectFit:"contain"}})}):o.file.contentType==="video"?t.jsxs("a",{href:o.file.url,target:"_blank",rel:"noopener noreferrer",style:{width:"100%",display:"flex",alignItems:"center"},children:[t.jsx(ge,{$theme:r}),t.jsxs(me,{$theme:r,children:[t.jsx("div",{className:"file-name",children:o.file.fileName}),t.jsx("div",{className:"file-size",children:N(o.file.fileSize)})]})]}):t.jsxs("a",{href:o.file.url,target:"_blank",rel:"noopener noreferrer",style:{width:"100%",display:"flex",alignItems:"center",textDecoration:"none"},children:[t.jsx(_,{$theme:r}),t.jsxs(me,{$theme:r,children:[t.jsx("div",{className:"file-name",children:o.file.fileName}),t.jsx("div",{className:"file-size",children:N(o.file.fileSize)})]})]})})]}),t.jsx(st,{$isMine:o.senderId===(a==null?void 0:a.uid),$theme:r,children:o.createdAt&&Se(o.createdAt)})]},o.id)),t.jsx("div",{ref:D})]}),h&&t.jsxs(mt,{$theme:r,children:[t.jsxs(ft,{children:[t.jsx(bt,{$theme:r,children:y==="image"&&k?t.jsx("img",{src:k,alt:"Preview"}):y==="video"?t.jsx(ge,{$theme:r}):y==="audio"?t.jsx(kt,{$theme:r}):y==="document"?t.jsx(_,{$theme:r}):t.jsx(_,{$theme:r})}),t.jsxs(ut,{$theme:r,children:[t.jsx("h4",{children:h.name}),t.jsx("span",{children:N(h.size)})]})]}),!Z&&t.jsx($t,{$theme:r,onClick:B,children:t.jsx(We,{})}),Z&&t.jsxs(wt,{$theme:r,children:[t.jsx(xe,{}),t.jsx(vt,{children:t.jsx(yt,{$progress:J,$theme:r})}),t.jsxs(jt,{$theme:r,children:["Uploading: ",Math.round(J),"%"]})]})]}),t.jsx("form",{onSubmit:ne,children:t.jsxs(lt,{$theme:r,children:[be&&t.jsxs(xt,{$theme:r,children:[t.jsx(de,{}),"Uploaded files will be deleted from the server after 24 hours"]}),t.jsxs(dt,{$theme:r,children:[t.jsx(pt,{$theme:r,onClick:o=>{o.preventDefault(),u(!G)},type:"button",children:t.jsx(_e,{})}),t.jsx(ct,{$theme:r,placeholder:"Type a message...",value:m,onChange:o=>U(o.target.value)}),t.jsx(ht,{$theme:r,onClick:o=>{o.preventDefault(),ne()},disabled:!m.trim()&&!h,type:"button",children:t.jsx(He,{})})]}),t.jsx(gt,{$theme:r,$show:G,children:$e?t.jsxs(t.Fragment,{children:[t.jsxs(v,{$theme:r,onClick:je,children:[t.jsx(ce,{})," Take Photo"]}),t.jsxs(v,{$theme:r,onClick:re,children:[t.jsx(pe,{})," Photo Library"]}),t.jsxs(v,{$theme:r,onClick:oe,children:[t.jsx(I,{})," Browse Files"]})]}):t.jsxs(t.Fragment,{children:[t.jsxs(v,{$theme:r,onClick:oe,children:[t.jsx(I,{})," Upload Files"]}),t.jsxs(v,{$theme:r,onClick:re,children:[t.jsx(pe,{})," Upload Images"]}),t.jsxs(v,{$theme:r,onClick:ke,children:[t.jsx(ce,{})," Use Webcam"]})]})}),t.jsx(W,{type:"file",ref:P,onChange:E,accept:"*/*"}),t.jsx(W,{type:"file",ref:R,onChange:E,accept:"image/*",capture:"environment"}),t.jsx(W,{type:"file",ref:A,onChange:E,accept:"image/*"})]})})]})};export{Ct as default};

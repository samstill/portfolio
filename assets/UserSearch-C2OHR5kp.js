import{d as i,r as u,u as q,j as a,t as f,i as b,v as y,w as l,x as v,a1 as z,_ as F,$ as U,a2 as E}from"./index-DMA27xvW.js";import{l as M}from"./index-BbVT8vbN.js";const p={light:{background:"rgba(255, 255, 255, 0.6)",backgroundSecondary:"rgba(255, 255, 255, 0.3)",text:"#1a1b25",textSecondary:"#666",primary:"#4a6cf7",border:"rgba(225, 228, 232, 0.4)",shadow:"0 4px 15px rgba(0, 0, 0, 0.05)"},dark:{background:"rgba(25, 28, 39, 0.8)",backgroundSecondary:"rgba(32, 36, 48, 0.7)",text:"#e1e5ee",textSecondary:"#a8b0c5",primary:"#6e8efb",border:"rgba(65, 70, 90, 0.6)",shadow:"0 4px 15px rgba(0, 0, 0, 0.15)"}},T=i.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`,D=i.div`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
`,L=i.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border-radius: 12px;
  border: 1px solid ${r=>p[r.$theme].border};
  background-color: ${r=>r.$theme==="light"?"rgba(255, 255, 255, 0.8)":"rgba(42, 46, 60, 0.8)"};
  color: ${r=>p[r.$theme].text};
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    border-color: ${r=>p[r.$theme].primary};
    box-shadow: 0 0 0 2px ${r=>`${p[r.$theme].primary}30`};
  }
  
  &::placeholder {
    color: ${r=>p[r.$theme].textSecondary};
    opacity: 0.7;
  }
  
  @media (max-width: 480px) {
    padding: 10px 14px 10px 36px;
    font-size: 14px;
  }
`,N=i.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${r=>p[r.$theme].textSecondary};
  opacity: 0.8;
  
  @media (max-width: 480px) {
    left: 10px;
  }
`,_=i.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`,B=i.li`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f7fb;
  }
`,Q=i.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${r=>r.$imageUrl?`url(${r.$imageUrl}) no-repeat center/cover`:"linear-gradient(135deg, #6e8efb, #4a6cf7)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin-right: 12px;
`,Y=i.div`
  flex: 1;
`,W=i.div`
  font-weight: 600;
  color: #333;
`,G=i.div`
  font-size: 14px;
  color: #666;
`,H=i.div`
  text-align: center;
  padding: 20px;
  color: #666;
`,J=i.div`
  color: #e53935;
  padding: 12px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(229, 57, 53, 0.1);
  margin-bottom: 20px;
`,K=i.div`
  padding: 20px;
  text-align: center;
  color: #666;
`,X=({onSelectUser:r})=>{const[c,C]=u.useState(""),[$,w]=u.useState([]),[P,S]=u.useState(!1),[k,d]=u.useState(""),{currentUser:t}=q();u.useEffect(()=>{if(!c.trim()||!t){w([]);return}const e=async()=>{try{S(!0);const s=f(b,"users"),x=y(s,l("username",">=",c),l("username","<=",c+"")),j=y(s,l("email",">=",c),l("email","<=",c+"")),[g,m]=await Promise.all([v(x),v(j)]),h=new Map;g.forEach(n=>{n.id!==t.uid&&h.set(n.id,{id:n.id,...n.data()})}),m.forEach(n=>{n.id!==t.uid&&!h.has(n.id)&&h.set(n.id,{id:n.id,...n.data()})});const R=Array.from(h.values());w(R),d("")}catch(s){console.error("Error searching users:",s),s instanceof z&&s.code==="failed-precondition"&&s.message.includes("index")?d("Your search requires a database index. Please create it using the link in the console."):d("Failed to search users. Please try again.")}finally{S(!1)}},o=setTimeout(()=>{e()},300);return()=>clearTimeout(o)},[c,t]);const A=async e=>{if(!(!t||!r))try{d("");const o=y(f(b,"conversations"),l(`participants.${t.uid}`,"==",!0),l(`participants.${e.id}`,"==",!0)),s=await v(o);if(!s.empty){const m={_id:s.docs[0].id,...s.docs[0].data(),otherUser:e};r(m);return}const x=[t.uid,e.id],g={_id:(await F(f(b,"conversations"),{participants:{[t.uid]:!0,[e.id]:!0},participantIds:x,createdBy:t.uid,createdAt:U(),updatedAt:U(),lastMessage:null,type:"private"})).id,participants:{[t.uid]:!0,[e.id]:!0},participantIds:x,createdBy:t.uid,createdAt:new Date,type:"private",otherUser:e,lastMessage:null};r(g)}catch(o){console.error("Error starting conversation:",o),o instanceof E&&o.code==="permission-denied"?d("Permission denied. Please check your access rights."):o instanceof E&&o.message.includes("index")?d("Database index required. Please contact the administrator."):d("Failed to start conversation. Please try again.")}},I=e=>e?e.charAt(0).toUpperCase():"?";return a.jsxs(T,{children:[a.jsxs(D,{$theme:t?"light":"dark",children:[a.jsx(N,{$theme:t?"light":"dark",children:a.jsx(M,{})}),a.jsx(L,{type:"text",placeholder:"Search by username or email...",value:c,onChange:e=>C(e.target.value),$theme:t?"light":"dark"})]}),k&&a.jsx(J,{children:k}),P?a.jsx(H,{children:"Searching..."}):$.length>0?a.jsx(_,{children:$.map(e=>a.jsxs(B,{onClick:()=>A(e),children:[a.jsx(Q,{$imageUrl:e.profilePicture,children:!e.profilePicture&&I(e.username)}),a.jsxs(Y,{children:[a.jsx(W,{children:e.username||"Unknown User"}),a.jsx(G,{children:e.email||"No email"})]})]},e.id))}):c.trim()!==""?a.jsx(K,{children:"No users found"}):null]})};export{X as U};

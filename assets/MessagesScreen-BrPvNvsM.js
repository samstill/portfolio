import{d as a,r as o,j as e}from"./index-DMA27xvW.js";import{t as f,f as u,M as b,A as y}from"./index-DSFE_B1z.js";import{m as n}from"./messageService-aBjgCbfQ.js";import{B as j}from"./BackButton-BYoU-Jf6.js";import{m as c}from"./proxy-BDBy7vtW.js";import{A as M}from"./index-DaRb_9d1.js";import"./iconBase-BGw-mJW2.js";const k=a.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${t=>t.theme.background};
`,w=a(c.div)`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`,v=a.h1`
  font-size: 2rem;
  color: ${t=>t.theme.text};
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`,R=a(c.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: ${t=>t.$isRead?.7:1};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`,A=a.p`
  color: ${t=>t.theme.text};
  font-size: 1rem;
  margin-bottom: 10px;
  line-height: 1.5;
`,C=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${t=>t.theme.text}80;
  font-size: 0.85rem;
`,S=a.div`
  display: flex;
  align-items: center;
  gap: 5px;
`,$=a.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,z=a(c.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 0, 0, 0.1);
  color: #ff4444;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`,E=a.div`
  text-align: center;
  padding: 40px;
  color: ${t=>t.theme.text}80;
`,q=()=>{const[t,i]=o.useState([]),[l,p]=o.useState(!0);o.useEffect(()=>{x()},[]);const x=async()=>{try{const s=await n.getAllMessages();i(s)}catch(s){console.error("Error fetching messages:",s)}finally{p(!1)}},g=async s=>{if(!s.isRead)try{await n.markAsRead(s.id),i(t.map(r=>r.id===s.id?{...r,isRead:!0}:r))}catch(r){console.error("Error marking message as read:",r)}},m=async s=>{if(window.confirm("Are you sure you want to delete this message?"))try{await n.deleteMessage(s),i(t.filter(r=>r.id!==s))}catch(r){console.error("Error deleting message:",r)}};return e.jsxs(k,{children:[e.jsx(j,{}),e.jsxs(w,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[e.jsxs(v,{children:[e.jsx(f,{size:24}),"Anonymous Messages"]}),e.jsx(M,{children:t.length>0?t.map((s,r)=>{var d;return e.jsxs(R,{$isRead:s.isRead,onClick:()=>g(s),initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:r*.1},children:[e.jsx(A,{children:s.content}),e.jsxs(C,{children:[e.jsx("span",{children:(d=s.timestamp)==null?void 0:d.toLocaleString()}),e.jsxs($,{children:[e.jsx(S,{children:s.isRead?e.jsxs(e.Fragment,{children:[e.jsx(u,{size:16,color:"#4a6cf7"}),"Read"]}):e.jsxs(e.Fragment,{children:[e.jsx(b,{size:16}),"Unread"]})}),e.jsx(z,{onClick:h=>{h.stopPropagation(),m(s.id)},whileHover:{scale:1.1},whileTap:{scale:.9},children:e.jsx(y,{size:16})})]})]})]},s.id)}):e.jsx(E,{children:l?"Loading messages...":"No messages yet"})})]})]})};export{q as default};

import{d as i,r as n,u as h,b as f,j as t,O as b}from"./index-I4BBwYdS.js";import{o as k,c as y,p as v,M as j}from"./index-DjBvL98p.js";import{B as w}from"./BackButton-Cfbj4dkC.js";import{c as T}from"./index-Cl0ZZ_yY.js";import{m as o}from"./proxy-DMLGpHM7.js";import{A as C}from"./index-C2QpgPxn.js";import"./iconBase-VHV16drN.js";const z=i.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${e=>e.theme.background};
`,F=i.div`
  max-width: 1200px;
  margin: 0 auto 40px;
`,E=i(o.h1)`
  font-size: 2.5rem;
  color: ${e=>e.theme.text};
  margin: 20px 0;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`,D=i(o.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`,S=i(o.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  }
`,$=i.h3`
  font-size: 1.4rem;
  color: ${e=>e.theme.text};
  margin-bottom: 15px;
`,A=i.span`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${e=>{switch(e.status){case"valid":return"rgba(76, 175, 80, 0.2)";case"used":return"rgba(255, 193, 7, 0.2)";case"cancelled":return"rgba(244, 67, 54, 0.2)";default:return"rgba(158, 158, 158, 0.2)"}}};
  color: ${e=>{switch(e.status){case"valid":return"#4CAF50";case"used":return"#FFC107";case"cancelled":return"#F44336";default:return"#9E9E9E"}}};
  backdrop-filter: blur(5px);
`,c=i.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${e=>e.theme.text}CC;
  font-size: 0.9rem;
  margin-bottom: 10px;

  svg {
    color: #6e8efb;
  }
`,B=i(o.div)`
  text-align: center;
  padding: 40px;
  color: ${e=>e.theme.text}CC;

  svg {
    font-size: 48px;
    margin-bottom: 20px;
    color: #6e8efb;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    opacity: 0.7;
  }
`,Y=()=>{const[e,l]=n.useState([]),[p,x]=n.useState(!0),{currentUser:r}=h(),d=f();n.useEffect(()=>{(async()=>{try{if(!(r!=null&&r.uid))return;const s=await b.getTicketsByUserId(r.uid);l(s.sort((m,g)=>new Date(g.purchasedAt).getTime()-new Date(m.purchasedAt).getTime()))}catch(s){console.error("Error fetching tickets:",s),T.error("Failed to load tickets")}finally{x(!1)}})()},[r]);const u=a=>{d(`/tickets/${a}`)};return t.jsxs(z,{children:[t.jsxs(F,{children:[t.jsx(w,{onClick:()=>d("/events")}),t.jsx(E,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:"My Tickets"})]}),t.jsx(C,{children:!p&&e.length===0?t.jsxs(B,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{duration:.5},children:[t.jsx(k,{size:48}),t.jsx("h3",{children:"No Tickets Found"}),t.jsx("p",{children:"You haven't purchased any tickets yet."})]}):t.jsx(D,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.5},children:e.map((a,s)=>t.jsxs(S,{onClick:()=>u(a.id),initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:s*.1},whileHover:{scale:1.02},whileTap:{scale:.98},children:[t.jsx(A,{status:a.status,children:a.status.toUpperCase()}),t.jsx($,{children:a.eventDetails.title}),t.jsxs(c,{children:[t.jsx(y,{size:16}),new Date(a.eventDetails.date).toLocaleDateString()]}),t.jsxs(c,{children:[t.jsx(v,{size:16}),a.eventDetails.location]}),t.jsxs(c,{children:[t.jsx(j,{size:16}),"Purchased: ",new Date(a.purchasedAt).toLocaleString()]})]},a.id))})})]})};export{Y as default};

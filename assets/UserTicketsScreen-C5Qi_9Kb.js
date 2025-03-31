import{d as a,T as S,b as $,r as s,j as t,N as T,O as F}from"./index-I4BBwYdS.js";import{n as L,F as D,o as u,c as z,p as E,M as A}from"./index-DjBvL98p.js";import{c as B}from"./index-Cl0ZZ_yY.js";import{L as h}from"./LoadingCard-BAkm2dwO.js";import{m as o}from"./proxy-DMLGpHM7.js";import{A as U}from"./index-C2QpgPxn.js";import"./iconBase-VHV16drN.js";const g=a.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${e=>e.theme.background};
  background: linear-gradient(135deg, ${e=>e.theme.background}, ${e=>e.theme.background}F2);

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`,N=a.div`
  max-width: 1200px;
  margin: 0 auto 30px;
`,P=a(o.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${e=>e.theme.text};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 25px;
  padding: 0;

  &:hover {
    color: ${e=>e.theme.primary};
  }
`,H=a.h1`
  font-size: 2rem;
  color: ${e=>e.theme.text};
  margin: 0 0 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
`,I=a.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto 30px;
  padding: 0 15px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 15px;
    margin: 0 auto 20px;
    max-width: 100%;
  }
`,_=a(o.input)`
  width: 100%;
  padding: 15px 20px;
  padding-right: 45px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${e=>e.theme.text};
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
  }

  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }

  @media (max-width: 768px) {
    padding: 12px 40px 12px 15px;
    font-size: 0.95rem;
  }
`,G=a(o.button)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${e=>e.theme.textSecondary};
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${e=>e.theme.text};
  }
`,M=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`,Q=a(o.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }
`,R=a.h3`
  font-size: 1.2rem;
  color: ${e=>e.theme.text};
  margin: 0 0 15px;
  padding-right: 80px;
`,Y=a.span`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${e=>{switch(e.status){case"valid":return"rgba(76, 175, 80, 0.2)";case"partially_used":return"rgba(255, 152, 0, 0.2)";case"used":return"rgba(255, 193, 7, 0.2)";case"cancelled":return"rgba(244, 67, 54, 0.2)";default:return"rgba(158, 158, 158, 0.2)"}}};
  color: ${e=>{switch(e.status){case"valid":return"#4CAF50";case"partially_used":return"#FF9800";case"used":return"#FFC107";case"cancelled":return"#F44336";default:return"#9E9E9E"}}};
`,n=a.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 8px;

  svg {
    color: ${e=>e.theme.primary};
  }
`,O=a(o.div)`
  text-align: center;
  padding: 60px 20px;
  color: ${e=>e.theme.textSecondary};

  svg {
    font-size: 48px;
    margin-bottom: 20px;
    color: ${e=>e.theme.primary};
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: ${e=>e.theme.text};
  }

  p {
    font-size: 1rem;
  }
`,X=a.div`
  max-width: 1200px;
  margin: 0 auto;
`,q=a.div`
  margin-bottom: 30px;
`,J=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`,K=()=>t.jsx(g,{children:t.jsxs(X,{children:[t.jsx(q,{children:t.jsx(h,{})}),t.jsx(J,{children:[1,2,3,4,5,6].map(e=>t.jsx(h,{},e))})]})}),ie=()=>{const{userId:e}=S(),l=$(),[p,b]=s.useState([]),[c,f]=s.useState(null),[y,j]=s.useState(!0),[d,x]=s.useState("");s.useEffect(()=>{(async()=>{if(e)try{const[i,w]=await Promise.all([T.getUserById(e),F.getTicketsByUserId(e)]);f(i),b(w.sort((k,C)=>new Date(C.purchasedAt).getTime()-new Date(k.purchasedAt).getTime()))}catch(i){console.error("Error fetching data:",i),B.error("Failed to load tickets")}finally{j(!1)}})()},[e]);const m=p.filter(r=>{const i=d.toLowerCase();return r.eventDetails.title.toLowerCase().includes(i)||r.ticketNumber.toLowerCase().includes(i)||r.status.toLowerCase().includes(i)}),v=r=>{l(`/tickets/${r}`)};return y?t.jsx(K,{}):t.jsxs(g,{children:[t.jsxs(N,{children:[t.jsxs(P,{onClick:()=>l(`/admin/users/${e}`),whileHover:{x:-4},children:[t.jsx(L,{})," Back to User Details"]}),t.jsxs(H,{children:["Tickets for ",c==null?void 0:c.email]})]}),t.jsxs(I,{children:[t.jsx(_,{placeholder:"Search tickets by event name, ticket number, or status...",value:d,onChange:r=>x(r.target.value),initial:{opacity:0},animate:{opacity:1}}),d&&t.jsx(G,{onClick:()=>x(""),whileHover:{scale:1.1},whileTap:{scale:.95},children:t.jsx(D,{size:18})})]}),t.jsx(U,{children:m.length===0?t.jsxs(O,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},children:[t.jsx(u,{}),t.jsx("h3",{children:"No Tickets Found"}),t.jsx("p",{children:p.length===0?"This user has no tickets yet.":"No tickets match your search."})]}):t.jsx(M,{children:m.map(r=>t.jsxs(Q,{onClick:()=>v(r.id),initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},whileHover:{scale:1.02},whileTap:{scale:.98},children:[t.jsx(Y,{status:r.status,children:r.status==="partially_used"?"Partially Used":r.status.charAt(0).toUpperCase()+r.status.slice(1)}),t.jsx(R,{children:r.eventDetails.title}),t.jsxs(n,{children:[t.jsx(z,{}),new Date(r.eventDetails.date).toLocaleDateString()]}),t.jsxs(n,{children:[t.jsx(E,{}),r.eventDetails.location]}),t.jsxs(n,{children:[t.jsx(u,{}),r.ticketNumber]}),t.jsxs(n,{children:[t.jsx(A,{}),"Purchased: ",new Date(r.purchasedAt).toLocaleDateString()]})]},r.id))})})]})};export{ie as default};

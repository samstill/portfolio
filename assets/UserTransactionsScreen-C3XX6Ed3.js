import{d as a,T as $,b as S,r as i,j as t,N as F,O as z}from"./index-DMA27xvW.js";import{n as L,F as D,Q as u,M as I,o as N,c as A}from"./index-DSFE_B1z.js";import{c as B}from"./index-e2yIpbwy.js";import{L as s}from"./LoadingCard-BRHIa-31.js";import{m as d}from"./proxy-BDBy7vtW.js";import{A as H}from"./index-DaRb_9d1.js";import"./iconBase-BGw-mJW2.js";const b=a.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${e=>e.theme.background};
  background: linear-gradient(135deg, ${e=>e.theme.background}, ${e=>e.theme.background}F2);

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`,y=a.div`
  max-width: 1000px;
  margin: 0 auto;
`,E=a.div`
  margin-bottom: 30px;
`,M=a(d.button)`
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
`,U=a.h1`
  font-size: 2rem;
  color: ${e=>e.theme.text};
  margin: 0 0 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
`,P=a.div`
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
`,Q=a(d.input)`
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
`,Y=a(d.button)`
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
`,O=a(d.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`,R=a.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`,W=a.h3`
  font-size: 1.2rem;
  color: ${e=>e.theme.text};
  margin: 0;
  font-weight: 500;
`,X=a.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${e=>e.type==="payment"?"#4CAF50":"#F44336"};
  display: flex;
  align-items: center;
  gap: 6px;
`,q=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`,c=a.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.95rem;

  svg {
    color: ${e=>e.theme.primary};
  }
`,G=a(d.div)`
  text-align: center;
  padding: 60px 20px;
  color: ${e=>e.theme.textSecondary};
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

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
`,J=a.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,K=()=>t.jsx(b,{children:t.jsx(y,{children:t.jsxs(J,{children:[t.jsx(s,{}),t.jsx(s,{}),t.jsx(s,{}),t.jsx(s,{}),t.jsx(s,{})]})})}),oe=()=>{const{userId:e}=$(),x=S(),[m,f]=i.useState([]),[l,j]=i.useState(null),[v,w]=i.useState(!0),[p,h]=i.useState("");i.useEffect(()=>{(async()=>{if(e)try{const[n,T]=await Promise.all([F.getUserById(e),z.getTicketsByUserId(e)]);j(n);const k=T.map(o=>({id:o.id,eventTitle:o.eventDetails.title,amount:o.amountPaid,type:"payment",date:o.purchasedAt,paymentMode:o.paymentMode,ticketNumber:o.ticketNumber,transactionId:o.transactionId})).sort((o,C)=>new Date(C.date).getTime()-new Date(o.date).getTime());f(k)}catch(n){console.error("Error fetching data:",n),B.error("Failed to load transactions")}finally{w(!1)}})()},[e]);const g=m.filter(r=>{const n=p.toLowerCase();return r.eventTitle.toLowerCase().includes(n)||r.ticketNumber.toLowerCase().includes(n)||r.paymentMode.toLowerCase().includes(n)});return v?t.jsx(K,{}):t.jsx(b,{children:t.jsxs(y,{children:[t.jsxs(E,{children:[t.jsxs(M,{onClick:()=>x(`/admin/users/${e}`),whileHover:{x:-4},children:[t.jsx(L,{})," Back to User Details"]}),t.jsxs(U,{children:["Transaction History - ",l==null?void 0:l.email]})]}),t.jsxs(P,{children:[t.jsx(Q,{placeholder:"Search by event name, ticket number, or payment mode...",value:p,onChange:r=>h(r.target.value),initial:{opacity:0},animate:{opacity:1}}),p&&t.jsx(Y,{onClick:()=>h(""),whileHover:{scale:1.1},whileTap:{scale:.95},children:t.jsx(D,{size:18})})]}),t.jsx(H,{children:g.length===0?t.jsxs(G,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},children:[t.jsx(u,{}),t.jsx("h3",{children:"No Transactions Found"}),t.jsx("p",{children:m.length===0?"This user has no transactions yet.":"No transactions match your search."})]}):g.map(r=>t.jsxs(O,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},whileHover:{scale:1.01},onClick:()=>x(`/tickets/${r.id}`),children:[t.jsxs(R,{children:[t.jsx(W,{children:r.eventTitle}),t.jsxs(X,{type:r.type,children:[t.jsx("span",{style:{fontFamily:"Arial"},children:"₹"}),r.amount.toFixed(2)]})]}),t.jsxs(q,{children:[t.jsxs(c,{children:[t.jsx(I,{}),new Date(r.date).toLocaleDateString()]}),t.jsxs(c,{children:[t.jsx(u,{}),r.paymentMode]}),t.jsxs(c,{children:[t.jsx(N,{}),r.ticketNumber]}),t.jsxs(c,{children:[t.jsx(A,{}),"Transaction ID: ",r.transactionId]})]})]},r.id))})]})})};export{oe as default};

import{d as r,W as u,b as j,r as o,j as t,O as s}from"./index-PlYeJ5aB.js";import{c as b}from"./index-B0SUQqO9.js";import{B as h}from"./BackButton-BZLRX6Ps.js";import{p as f,T as v}from"./TicketValidation-BgG6f2S9.js";import{S as e}from"./Skeleton-BjhEYg2A.js";import{m as x}from"./proxy-2E1gdO7q.js";import"./index-CoLBoNy-.js";const c=r.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${i=>i.theme.background};
  background: linear-gradient(135deg, ${i=>i.theme.background}, ${i=>i.theme.background}F2);

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`,p=r(x.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;r.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;r(x.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #4a6cf7;
`;const y=r(x.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
`,T=r.div`
  margin-bottom: 30px;
`,S=r.div`
  width: 200px;
  height: 200px;
  margin: 20px auto;
`,w=r.div`
  display: grid;
  gap: 20px;
  margin-top: 30px;
`,d=r.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`,C=()=>t.jsxs(c,{children:[t.jsx(h,{onClick:()=>navigate(-1)}),t.jsxs(y,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[t.jsx(T,{children:t.jsx(e,{height:32,width:"60%"})}),t.jsx(S,{children:t.jsx(e,{height:"100%"})}),t.jsxs(w,{children:[t.jsxs(d,{children:[t.jsx(e,{height:24}),t.jsx(e,{height:24})]}),t.jsxs(d,{children:[t.jsx(e,{height:24}),t.jsx(e,{height:24})]}),t.jsxs(d,{children:[t.jsx(e,{height:24}),t.jsx(e,{height:24})]})]}),t.jsx(e,{height:50,width:"100%",style:{marginTop:"30px"}})]})]}),L=()=>{const{ticketId:i}=u(),g=j(),[a,l]=o.useState(null),[m,k]=o.useState(!0);return o.useEffect(()=>{(async()=>{try{if(!i)return;const n=await s.getTicket(i);l(n)}catch(n){console.error("Error fetching ticket:",n),b.error("Failed to load ticket details")}finally{k(!1)}})()},[i]),m?t.jsx(C,{}):a?t.jsxs(c,{children:[t.jsx(h,{onClick:()=>g("/admin/tickets")}),t.jsx(p,{initial:"initial",animate:"animate",exit:"exit",variants:f,children:t.jsx(v,{ticket:a,onValidationComplete:()=>{a.id&&Promise.all([s.getTicket(a.id).then(l),s.getAllTickets()])}})})]}):t.jsx(c,{children:t.jsx(p,{children:t.jsxs("div",{style:{textAlign:"center"},children:[t.jsx("h2",{children:"Ticket Not Found"}),t.jsx("p",{children:"The requested ticket could not be found."})]})})})};export{L as default};

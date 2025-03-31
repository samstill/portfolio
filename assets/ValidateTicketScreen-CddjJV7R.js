import{d as n,T as f,u as j,b as v,r,O as u,j as t}from"./index-DMA27xvW.js";import{c as d}from"./index-e2yIpbwy.js";import{B as x}from"./BackButton-BYoU-Jf6.js";import{F as y,f as T}from"./index-DSFE_B1z.js";import"./iconBase-BGw-mJW2.js";const p=n.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${e=>e.theme.background};
`,g=n.div`
  max-width: 500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  color: ${e=>e.theme.text};
`,$=n.div`
  margin: 20px 0;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  p {
    margin: 8px 0;
    color: ${e=>e.theme.textSecondary};
  }
`,V=n.button`
  width: 100%;
  padding: 15px;
  background: ${e=>e.$status==="used"?"rgba(255, 71, 87, 0.2)":e.$status==="partially_used"?"rgba(255, 165, 0, 0.2)":"linear-gradient(135deg, #6e8efb, #4a6cf7)"};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: ${e=>e.$status==="used"?"not-allowed":"pointer"};
  font-weight: 600;
  opacity: ${e=>e.$status==="used"?.7:1};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
`,w=n.div`
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-align: center;

  h3 {
    margin-bottom: 10px;
  }

  .count-input {
    width: 100px;
    padding: 8px;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    margin: 0 10px;
  }
`,B=()=>{const{ticketId:e=""}=f(),{currentUser:o}=j();v();const[c,l]=r.useState(!1),[i,m]=r.useState(null),[a,h]=r.useState(1);r.useEffect(()=>{if(!e)return;const s=u.subscribeToTicketUpdates(e,k=>{m(k)});return()=>s()},[e]);const b=async()=>{if(!(!e||!i||!o)){if(a>i.validationsRemaining){d.error(`Only ${i.validationsRemaining} validations remaining`);return}l(!0);try{await u.validateTicket(e,a,o.uid),d.success(`Successfully validated ${a} ticket(s)`)}catch(s){d.error(s.message||"Failed to validate ticket")}finally{l(!1)}}};return i?t.jsxs(p,{children:[t.jsx(x,{}),t.jsxs(g,{children:[t.jsxs($,{children:[t.jsx("h2",{children:i.eventDetails.title}),t.jsxs("p",{children:["Ticket #: ",i.ticketNumber]}),t.jsxs("p",{children:["Total Tickets: ",i.quantity]}),t.jsxs("p",{children:["Validations Remaining: ",i.validationsRemaining]}),t.jsxs("p",{children:["Status: ",i.status.replace("_"," ")]})]}),t.jsxs(w,{children:[t.jsx("h3",{children:"Number of Tickets to Validate"}),t.jsx("input",{type:"number",className:"count-input",value:a,onChange:s=>h(Math.max(1,Math.min(i.validationsRemaining,parseInt(s.target.value)||1))),min:1,max:i.validationsRemaining,disabled:i.status==="used"})]}),t.jsx(V,{onClick:b,disabled:c||i.status==="used",$status:i.status,children:c?"Validating...":i.status==="used"?t.jsxs(t.Fragment,{children:[t.jsx(y,{size:18}),"Ticket Already Used"]}):t.jsxs(t.Fragment,{children:[t.jsx(T,{size:18}),"Validate ",a," Ticket",a>1?"s":""]})})]})]}):t.jsxs(p,{children:[t.jsx(x,{}),t.jsx(g,{children:t.jsx("h2",{children:"Loading ticket..."})})]})};export{B as default};

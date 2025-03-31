import{d as t,r as y,j as a,O as h}from"./index-DMA27xvW.js";import{c as o}from"./index-e2yIpbwy.js";import{Z as T,P as B,f}from"./index-DSFE_B1z.js";import{m as x}from"./proxy-BDBy7vtW.js";const A={initial:{opacity:0,y:20,scale:.98},animate:{opacity:1,y:0,scale:1,transition:{duration:.4,ease:[.4,0,.2,1],scale:{type:"spring",damping:25,stiffness:400}}},exit:{opacity:0,y:-20,scale:.98,transition:{duration:.3,ease:[.4,0,.2,1]}}},O={initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1,transition:{duration:.4,ease:[.4,0,.2,1],scale:{type:"spring",damping:25,stiffness:400}}},exit:{opacity:0,scale:.95,transition:{duration:.3,ease:[.4,0,.2,1]}}},q={animate:{transition:{staggerChildren:.08,delayChildren:.1}}},M={active:{scale:1,opacity:1,y:0,transition:{type:"spring",stiffness:400,damping:25,mass:1}},inactive:{scale:.95,opacity:.7,y:2,transition:{type:"spring",stiffness:400,damping:25,mass:1}}},U={active:{scale:1,rotate:[0,15,-15,0],transition:{rotate:{duration:.5,ease:"easeInOut",delay:.1},scale:{type:"spring",stiffness:400,damping:25}}},inactive:{scale:.9,rotate:0,transition:{type:"spring",stiffness:400,damping:25}}},C=t.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 20px 0;
`,N=t.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
`,v=t(x.button)`
  background: rgba(74, 108, 247, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${e=>e.theme.text};
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,R=t.div`
  font-size: 1.5rem;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
`,k=t.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
`,p=t.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  
  .label {
    color: ${e=>e.theme.textSecondary};
  }
  
  .value {
    font-weight: bold;
  }
`,z=t(x.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,F=t.div`
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
`,$=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`,D=t.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .timestamp {
    font-size: 0.85rem;
    color: ${e=>e.theme.textSecondary};
  }
`,H=t(x.button)`
  padding: 6px 12px;
  background: rgba(74, 108, 247, 0.2);
  border: none;
  border-radius: 8px;
  color: ${e=>e.theme.text};
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,I=t.div`
  margin-top: 20px;
  font-size: 0.9rem;
  color: ${e=>e.theme.textSecondary};
  text-align: center;
`,Z=({ticket:e,onValidationComplete:m})=>{var g,u;const[s,d]=y.useState(1),[l,r]=y.useState(!1),b=()=>{s<e.validationsRemaining&&d(i=>i+1)},j=()=>{s>1&&d(i=>i-1)},w=async()=>{try{r(!0),await h.validateTicket(e.id,s),o.success(`Successfully validated ${s} ticket${s>1?"s":""}`),m(),d(1)}catch(i){o.error(i.message||"Failed to validate tickets")}finally{r(!1)}},V=async()=>{try{r(!0),await h.validateTicket(e.id,1),o.success("Successfully validated 1 ticket"),m()}catch(i){o.error(i.message||"Failed to validate ticket")}finally{r(!1)}},n=()=>l||e.validationsRemaining===0||e.status==="used"||e.status==="cancelled",c=()=>e.status==="used"?"Ticket is already used":e.status==="cancelled"?"Ticket is cancelled":e.validationsRemaining===0?"No validations remaining":"";return a.jsxs(C,{children:[a.jsx("h3",{children:"Validate Tickets"}),a.jsxs(k,{children:[a.jsxs(p,{children:[a.jsx("span",{className:"label",children:"Total Tickets"}),a.jsx("span",{className:"value",children:e.quantity})]}),a.jsxs(p,{children:[a.jsx("span",{className:"label",children:"Used"}),a.jsx("span",{className:"value",children:e.usedCount})]}),a.jsxs(p,{children:[a.jsx("span",{className:"label",children:"Remaining"}),a.jsx("span",{className:"value",children:e.validationsRemaining})]})]}),a.jsxs(N,{children:[a.jsx(v,{whileHover:{scale:1.1},whileTap:{scale:.9},onClick:j,disabled:s<=1||l||n(),children:a.jsx(T,{})}),a.jsx(R,{children:s}),a.jsx(v,{whileHover:{scale:1.1},whileTap:{scale:.9},onClick:b,disabled:s>=e.validationsRemaining||l||n(),children:a.jsx(B,{})})]}),a.jsxs("div",{style:{display:"flex",gap:"10px",marginBottom:"20px"},children:[a.jsx(z,{whileHover:!n()&&{scale:1.02},whileTap:!n()&&{scale:.98},onClick:w,disabled:n(),title:c(),style:{flex:2},children:l?a.jsx(a.Fragment,{children:"Processing..."}):a.jsxs(a.Fragment,{children:[a.jsx(f,{size:18}),"Validate ",s," Ticket",s>1?"s":""]})}),a.jsxs(H,{whileHover:!n()&&{scale:1.02},whileTap:!n()&&{scale:.98},onClick:V,disabled:n(),title:c(),style:{flex:1},children:[a.jsx(f,{size:16}),"Single"]})]}),n()&&a.jsx("div",{style:{textAlign:"center",color:"#ff4757",fontSize:"0.9rem",marginTop:"-10px",marginBottom:"20px"},children:c()}),a.jsxs(F,{children:[a.jsx("h4",{style:{padding:"15px",borderBottom:"1px solid rgba(255, 255, 255, 0.1)"},children:"Validation History"}),(g=e.validations)==null?void 0:g.map((i,S)=>a.jsxs($,{children:[a.jsxs(D,{children:[a.jsxs("div",{children:[i.count," ticket",i.count>1?"s":""," validated"]}),a.jsx("div",{className:"timestamp",children:new Date(i.timestamp).toLocaleString()})]}),i.validatedBy&&a.jsxs("div",{className:"validator",children:["By: ",i.validatedBy]})]},S)),(!e.validations||e.validations.length===0)&&a.jsx("div",{style:{padding:"15px",textAlign:"center",color:i=>i.theme.textSecondary},children:"No validations yet"})]}),((u=e.validationSummary)==null?void 0:u.lastBatchValidation)&&a.jsxs(I,{children:["Last batch: ",e.validationSummary.lastBatchValidation.count," tickets at"," ",new Date(e.validationSummary.lastBatchValidation.timestamp).toLocaleString()]})]})};export{Z as T,O as c,U as i,A as p,q as s,M as t};

import{d as r,m as J,T as ee,b as ie,r as x,j as e,N as j,O as te}from"./index-DMA27xvW.js";import{n as ae,l as re,B as se,U as S,c as ne,V as oe,o as w,W as le,X as de,M as ce,Q as y,Y as xe,A as v,y as pe}from"./index-DSFE_B1z.js";import{c as o}from"./index-e2yIpbwy.js";import{m as c}from"./proxy-BDBy7vtW.js";import{A as he}from"./index-DaRb_9d1.js";import"./iconBase-BGw-mJW2.js";const $=r.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${i=>i.theme.background};
  background: linear-gradient(135deg, ${i=>i.theme.background}, ${i=>i.theme.background}F2);

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`,I=r(c.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 25px;
  }
`,P=r(c.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${i=>i.theme.text};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 25px;
  padding: 0;

  &:hover {
    color: ${i=>i.theme.primary};
  }
`,R=r.div`
  margin-bottom: 35px;
`,me=r.h1`
  font-size: 2rem;
  color: ${i=>i.theme.text};
  margin: 0 0 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
`,ge=r.div`
  font-size: 1.1rem;
  color: ${i=>i.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
  word-break: break-all;
  overflow-wrap: break-word;
  line-height: 1.4;
  max-width: 100%;

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    
    svg {
      margin-bottom: 2px;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 0 10px;
  }
`,d=r.div`
  margin-bottom: 35px;

  h2 {
    font-size: 1.3rem;
    color: ${i=>i.theme.text};
    margin: 0 0 20px;
    font-weight: 600;
  }
`,T=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`,l=r.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  .label {
    font-size: 0.9rem;
    color: ${i=>i.theme.textSecondary};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .value {
    font-size: 1.1rem;
    color: ${i=>i.theme.text};
    font-weight: 500;
    word-break: break-all;
    overflow-wrap: break-word;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    padding: 15px;
    
    .label {
      font-size: 0.85rem;
    }
    
    .value {
      font-size: 1rem;
    }
  }
`,h=r(c.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${i=>i.$variant==="primary"?"linear-gradient(135deg, #6e8efb, #4a6cf7)":"rgba(244, 67, 54, 0.1)"};
  color: ${i=>i.$variant==="primary"?"white":"#F44336"};
  border: 1px solid ${i=>i.$variant==="primary"?"transparent":"#F44336"};
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${i=>i.$variant==="primary"?"0 8px 20px rgba(74, 108, 247, 0.3)":"0 8px 20px rgba(244, 67, 54, 0.2)"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`,C=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`,B={initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.3,ease:"easeInOut"}},H=r.div`
  display: flex;
  align-items: center;
  gap: 25px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`,L=r.div`
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`,ue=r.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${i=>i.$imageUrl?`url(${i.$imageUrl}) no-repeat center/cover`:"linear-gradient(135deg, #6e8efb, #4a6cf7)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.1);
`,M=r.div`
  flex: 1;
`,be=r(d)`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    color: #dc3545;
  }
`,N=r(h)`
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid #dc3545;

  &:hover {
    background: rgba(220, 53, 69, 0.2);
    box-shadow: 0 8px 20px rgba(220, 53, 69, 0.2);
  }
`,fe=r(c.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  backdrop-filter: blur(5px);
`,je=r(c.div)`
  background: ${i=>i.theme.background};
  padding: 35px;
  border-radius: 24px;
  max-width: 450px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  position: relative;

  h3 {
    color: #dc3545;
    margin: 0 0 20px;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      font-size: 1.6rem;
    }
  }

  p {
    color: ${i=>i.theme.textSecondary};
    margin-bottom: 30px;
    line-height: 1.6;
    font-size: 1.05rem;
  }

  @media (max-width: 768px) {
    padding: 25px;
    margin: 0 15px;

    h3 {
      font-size: 1.3rem;
      margin: 0 0 15px;
    }

    p {
      font-size: 1rem;
      margin-bottom: 25px;
    }
  }
`,ve=r.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;

    button {
      width: 100%;
    }
  }
`,we=r(c.div)`
  display: inline-block;
  margin-right: 8px;
`,F=J`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`,p=r.div`
  width: ${({width:i})=>i||"100%"};
  height: ${({height:i})=>i||"20px"};
  margin: ${({margin:i})=>i||"10px 0"};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${F} 1.5s infinite;
  }
`,ye=r.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${F} 1.5s infinite;
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`,E=r.div`
  width: 140px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${F} 1.5s infinite;
  }
`;r(d)`
  margin-top: 20px;
`;const ke=r(c.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`,$e=r.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`,Te=r.h3`
  font-size: 1.1rem;
  color: ${i=>i.theme.text};
  margin: 0;
  font-weight: 500;
`,Ce=r.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${i=>i.type==="payment"?"#4CAF50":"#F44336"};
  display: flex;
  align-items: center;
  gap: 6px;
`,Fe=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`,k=r.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${i=>i.theme.textSecondary};
  font-size: 0.9rem;

  svg {
    color: ${i=>i.theme.primary};
  }
`,De=r(h)`
  margin-top: 20px;
`,Ae=r(c.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);

  h3 {
    font-size: 1.4rem;
    color: ${i=>i.theme.text};
    margin: 20px 0 10px;
  }

  p {
    font-size: 1rem;
    color: ${i=>i.theme.textSecondary};
  }
`,Ue=()=>e.jsx($,{children:e.jsxs(I,{...B,children:[e.jsx(P,{as:"div",initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.5},children:e.jsx(p,{width:"120px",height:"24px",margin:"0"})}),e.jsx(R,{children:e.jsxs(H,{children:[e.jsx(L,{children:e.jsx(ye,{})}),e.jsxs(M,{children:[e.jsx(p,{width:"200px",height:"32px",margin:"0 0 15px 0"}),e.jsx(p,{width:"250px",height:"20px",margin:"0"})]})]})}),e.jsxs(d,{children:[e.jsx(p,{width:"180px",height:"24px",margin:"0 0 20px 0"}),e.jsx(T,{children:[1,2,3,4].map(i=>e.jsxs(l,{as:"div",children:[e.jsx(p,{width:"100px",height:"16px",margin:"0 0 8px 0"}),e.jsx(p,{width:"140px",height:"20px",margin:"0"})]},i))})]}),e.jsxs(d,{children:[e.jsx(p,{width:"120px",height:"24px",margin:"0 0 20px 0"}),e.jsxs(C,{children:[e.jsx(E,{}),e.jsx(E,{})]})]})]})}),Re=()=>{const{userId:i}=ee(),g=ie(),[t,D]=x.useState(null),[V,O]=x.useState(!0),[u,Y]=x.useState([]),[G,m]=x.useState(!1),[b,A]=x.useState(!1),[U,X]=x.useState([]);x.useEffect(()=>{(async()=>{if(i)try{const s=await j.getUserById(i);D(s);const z=await te.getTicketsByUserId(i);Y(z);const _=z.map(n=>({id:n.id,eventTitle:n.eventDetails.title,amount:n.amountPaid,type:"payment",date:n.purchasedAt,paymentMode:n.paymentMode,ticketNumber:n.ticketNumber,transactionId:n.transactionId})).sort((n,q)=>new Date(q.date).getTime()-new Date(n.date).getTime()).slice(0,3);X(_)}catch(s){console.error("Error fetching user data:",s),o.error("Failed to load user data")}finally{O(!1)}})()},[i]);const f={total:u.length,valid:u.filter(a=>a.status==="valid").length,used:u.filter(a=>a.status==="used"||a.status==="partially_used").length,cancelled:u.filter(a=>a.status==="cancelled").length},Z=async()=>{if(t)try{const a=t.role==="admin"?"user":"admin";await j.updateUserRole(t.uid,a),D(s=>s?{...s,role:a}:null),o.success(`User role updated to ${a}`)}catch(a){console.error("Error updating role:",a),o.error("Failed to update user role")}},K=async()=>{if(t)try{await j.sendPasswordResetEmail(t.email),o.success("Password reset email sent successfully")}catch(a){console.error("Error sending reset email:",a),o.error("Failed to send password reset email")}},Q=async()=>{if(t){A(!0);try{if(t.role==="admin"){o.error("Cannot delete admin users"),m(!1);return}const a=await j.deleteUser(t.uid);a.success&&(m(!1),a.partialDeletion?o(s=>e.jsxs("div",{children:[e.jsx("b",{children:"⚠️ Partial Deletion"}),e.jsx("br",{}),a.message,e.jsx("br",{}),e.jsx("small",{children:"Please contact support for assistance."})]}),{duration:8e3,style:{background:"#FFF3CD",color:"#856404",border:"1px solid #FFEEBA",padding:"16px"}}):o.success(a.message),setTimeout(()=>{g("/admin",{replace:!0})},1e3))}catch(a){console.error("Error deleting user:",a),o.error(e.jsxs("div",{children:[e.jsx("b",{children:"Error Deleting User"}),e.jsx("br",{}),a instanceof Error?a.message:"Failed to delete user",e.jsx("br",{}),e.jsx("small",{children:"Please try again or contact support."})]}),{duration:5e3})}finally{A(!1)}}},W=a=>a.split("@")[0].split(".").map(s=>s[0]).join("").toUpperCase().slice(0,2);return V?e.jsx(Ue,{}):t?e.jsxs($,{children:[e.jsxs(I,{...B,children:[e.jsxs(P,{onClick:()=>g("/admin"),whileHover:{x:-4},children:[e.jsx(ae,{})," Back to Users"]}),e.jsx(R,{children:e.jsxs(H,{children:[e.jsx(L,{children:e.jsx(ue,{$imageUrl:t==null?void 0:t.profilePhoto,children:!(t!=null&&t.profilePhoto)&&(t==null?void 0:t.email)&&W(t.email)})}),e.jsxs(M,{children:[e.jsx(me,{children:"User Details"}),e.jsxs(ge,{children:[e.jsx(re,{}),t==null?void 0:t.email]})]})]})}),e.jsxs(d,{children:[e.jsx("h2",{children:"User Information"}),e.jsxs(T,{children:[e.jsxs(l,{children:[e.jsxs("div",{className:"label",children:[e.jsx(se,{})," User ID"]}),e.jsx("div",{className:"value",children:t==null?void 0:t.uid})]}),e.jsxs(l,{children:[e.jsxs("div",{className:"label",children:[e.jsx(S,{})," Role"]}),e.jsx("div",{className:"value",style:{textTransform:"capitalize"},children:t==null?void 0:t.role})]}),e.jsxs(l,{children:[e.jsxs("div",{className:"label",children:[e.jsx(ne,{})," Created At"]}),e.jsx("div",{className:"value",children:(t==null?void 0:t.createdAt)&&new Date(t.createdAt).toLocaleDateString()})]}),e.jsxs(l,{children:[e.jsxs("div",{className:"label",children:[e.jsx(oe,{})," Total Tickets"]}),e.jsx("div",{className:"value",children:f.total})]})]})]}),e.jsxs(d,{children:[e.jsx("h2",{children:"Ticket Statistics"}),e.jsxs(T,{children:[e.jsxs(l,{children:[e.jsxs("div",{className:"label",children:[e.jsx(w,{})," Available Tickets"]}),e.jsx("div",{className:"value",style:{color:"#4CAF50"},children:f.valid})]}),e.jsxs(l,{children:[e.jsxs("div",{className:"label",children:[e.jsx(le,{})," Used Tickets"]}),e.jsx("div",{className:"value",style:{color:"#FFC107"},children:f.used})]}),e.jsxs(l,{children:[e.jsxs("div",{className:"label",children:[e.jsx(de,{})," Cancelled Tickets"]}),e.jsx("div",{className:"value",style:{color:"#F44336"},children:f.cancelled})]})]}),e.jsxs(h,{$variant:"primary",onClick:()=>g(`/admin/users/${i}/tickets`),whileHover:{scale:1.02},whileTap:{scale:.98},style:{marginTop:"20px",width:"fit-content"},children:[e.jsx(w,{}),"View All Tickets"]})]}),e.jsxs(d,{children:[e.jsx("h2",{children:"Recent Transactions"}),U.length>0?e.jsxs(e.Fragment,{children:[U.map(a=>e.jsxs(ke,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},whileHover:{scale:1.01},children:[e.jsxs($e,{children:[e.jsx(Te,{children:a.eventTitle}),e.jsxs(Ce,{type:a.type,children:[e.jsx("span",{style:{fontFamily:"Arial"},children:"₹"}),a.amount.toFixed(2)]})]}),e.jsxs(Fe,{children:[e.jsxs(k,{children:[e.jsx(ce,{}),new Date(a.date).toLocaleDateString()]}),e.jsxs(k,{children:[e.jsx(y,{}),a.paymentMode]}),e.jsxs(k,{children:[e.jsx(w,{}),a.ticketNumber]})]})]},a.id)),e.jsxs(De,{$variant:"primary",onClick:()=>g(`/admin/users/${i}/transactions`),whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(y,{}),"View All Transactions"]})]}):e.jsxs(Ae,{initial:{opacity:0},animate:{opacity:1},children:[e.jsx(y,{size:32}),e.jsx("h3",{children:"No Transactions"}),e.jsx("p",{children:"This user hasn't made any transactions yet."})]})]}),e.jsxs(d,{children:[e.jsx("h2",{children:"Actions"}),e.jsxs(C,{children:[e.jsxs(h,{$variant:"primary",onClick:Z,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(S,{}),(t==null?void 0:t.role)==="admin"?"Remove Admin":"Make Admin"]}),e.jsxs(h,{$variant:"primary",onClick:K,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(xe,{}),"Reset Password"]})]})]}),(t==null?void 0:t.role)!=="admin"&&e.jsxs(be,{children:[e.jsxs("h2",{children:[e.jsx(v,{})," Danger Zone"]}),e.jsx(C,{children:e.jsxs(N,{$variant:"danger",onClick:()=>m(!0),whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(v,{}),"Delete User Account"]})})]})]}),e.jsx(he,{children:G&&e.jsx(fe,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>!b&&m(!1),children:e.jsxs(je,{initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},onClick:a=>a.stopPropagation(),children:[e.jsxs("h3",{children:[e.jsx(v,{})," Delete User Account"]}),e.jsxs("p",{children:["Are you sure you want to delete this user account? This action is permanent and will:",e.jsx("br",{}),"• Remove all user data",e.jsx("br",{}),"• Delete associated authentication",e.jsx("br",{}),"• Remove access to all services"]}),e.jsxs(ve,{children:[e.jsx(h,{$variant:"primary",onClick:()=>m(!1),disabled:b,whileHover:{scale:1.02},whileTap:{scale:.98},children:"Cancel"}),e.jsx(N,{$variant:"danger",onClick:Q,disabled:b,whileHover:{scale:1.02},whileTap:{scale:.98},children:b?e.jsxs(e.Fragment,{children:[e.jsx(we,{animate:{rotate:360},transition:{duration:1,repeat:1/0,ease:"linear"},children:e.jsx(pe,{size:16})}),"Deleting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(v,{size:16}),"Delete Account"]})})]})]})})})]}):e.jsx($,{children:"User not found"})};export{Re as default};

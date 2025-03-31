import{d as n,b as l,k as p,j as e}from"./index-I4BBwYdS.js";import{T as x,n as m,S as g}from"./index-DjBvL98p.js";import{m as s}from"./proxy-DMLGpHM7.js";import"./iconBase-VHV16drN.js";const u=n.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${t=>t.theme.background};
`,h=n(s.div)`
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`,b=n(g)`
  color: #ef4444;
  font-size: 64px;
  margin-bottom: 20px;
`,f=n.h1`
  color: ${t=>t.theme.text};
  font-size: 2rem;
  margin-bottom: 15px;
`,y=n.p`
  color: ${t=>t.theme.text}CC;
  margin-bottom: 25px;
  font-size: 1.1rem;
  line-height: 1.5;
`,j=n.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  text-align: left;
  color: ${t=>t.theme.text}CC;

  p {
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`,v=n.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`,o=n(s.button)`
  padding: 12px 24px;
  background: ${t=>t.$variant==="primary"?"linear-gradient(135deg, #6e8efb, #4a6cf7)":"rgba(255, 255, 255, 0.1)"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
`,E=()=>{const t=l(),d=p(),{error:r,paymentId:i,eventId:a}=d.state||{},c=()=>{t(`/events/${a}/book`)};return e.jsx(u,{children:e.jsxs(h,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[e.jsx(b,{}),e.jsx(f,{children:"Payment Failed"}),e.jsx(y,{children:(r==null?void 0:r.message)||"We encountered an issue while processing your payment. Your money is safe and will be refunded if deducted."}),e.jsxs(j,{children:[i&&e.jsxs("p",{children:["Payment Reference: ",i]}),e.jsx("p",{children:"Status: Failed"}),(r==null?void 0:r.code)&&e.jsxs("p",{children:["Error Code: ",r.code]}),e.jsx("p",{children:"If any amount was deducted, it will be automatically refunded within 5-7 business days."})]}),e.jsxs(v,{children:[e.jsxs(o,{$variant:"primary",onClick:c,whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(x,{}),"Try Again"]}),e.jsxs(o,{onClick:()=>t(`/events/${a}`),whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(m,{}),"Back to Event"]})]})]})})};export{E as default};

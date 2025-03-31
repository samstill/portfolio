import{d as t,j as e,L as o}from"./index-DMA27xvW.js";import{k as i}from"./index-DSFE_B1z.js";import"./iconBase-BGw-mJW2.js";const r=t.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  color: ${n=>n.theme.text};
`,a=t.h1`
  font-size: 8rem;
  margin: 0;
  color: #4a6cf7;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`,s=t.h2`
  font-size: 2rem;
  margin: 20px 0;
`,x=t.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 500px;
`,d=t(o)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`,m=()=>e.jsxs(r,{children:[e.jsx(a,{children:"404"}),e.jsx(s,{children:"Page Not Found"}),e.jsx(x,{children:"The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}),e.jsxs(d,{to:"/",children:[e.jsx(i,{size:20}),"Back to Home"]})]});export{m as default};

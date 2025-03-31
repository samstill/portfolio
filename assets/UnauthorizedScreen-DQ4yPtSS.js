import{d as t,b as a,j as e}from"./index-I4BBwYdS.js";import{S as o,n as s}from"./index-DjBvL98p.js";import{B as d}from"./BackButton-Cfbj4dkC.js";import{m as r}from"./proxy-DMLGpHM7.js";import"./iconBase-VHV16drN.js";const c=t.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${i=>i.theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
`,p=t(r.div)`
  max-width: 500px;
  width: 100%;
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
  color: ${i=>i.theme.text};
`,l=t(r.div)`
  font-size: 64px;
  color: #f44336;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;

  svg {
    filter: drop-shadow(0 0 10px rgba(244, 67, 54, 0.5));
  }
`,x=t(r.h1)`
  font-size: 2rem;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`,g=t(r.p)`
  margin-bottom: 32px;
  opacity: 0.8;
  font-size: 1.1rem;
  line-height: 1.6;
`,m=t(r.button)`
  padding: 12px 32px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`,h={hidden:{opacity:0},visible:{opacity:1,transition:{when:"beforeChildren",staggerChildren:.2}}},n={hidden:{y:20,opacity:0},visible:{y:0,opacity:1,transition:{type:"spring",damping:15,stiffness:100}}},w=()=>{const i=a();return e.jsxs(c,{children:[e.jsx(d,{}),e.jsxs(p,{variants:h,initial:"hidden",animate:"visible",children:[e.jsx(l,{variants:n,children:e.jsx(o,{})}),e.jsx(x,{variants:n,children:"Unauthorized Access"}),e.jsx(g,{variants:n,children:"You don't have permission to access this resource. Please make sure you have the necessary permissions."}),e.jsxs(m,{variants:n,whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>i("/"),children:[e.jsx(s,{}),"Return to Home"]})]})]})};export{w as default};

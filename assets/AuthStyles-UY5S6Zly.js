import{m as r,d as e,j as i}from"./index-DMA27xvW.js";import{m as o}from"./proxy-BDBy7vtW.js";const n=r`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`,p=e.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`,d=e(o.div)`
  max-width: 400px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 25px;
  }
`,a=e.div`
  width: ${({width:t})=>t||"100%"};
  height: ${({height:t})=>t||"20px"};
  margin: ${({margin:t})=>t||"10px 0"};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
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
      transparent 0%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: ${n} 2s infinite linear;
  }
`,x=e.div`
  width: 100%;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  margin-top: 25px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: ${n} 2s infinite linear;
  }
`,s=e(o.div)`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-top: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
`,l={initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1,transition:{duration:.5,ease:"easeOut"}},exit:{opacity:0,y:-20,scale:.95,transition:{duration:.3,ease:"easeIn"}}},g=({text:t="Loading..."})=>i.jsx(p,{children:i.jsxs(d,{...l,children:[i.jsx(a,{width:"70%",height:"32px",margin:"0 0 30px 0"}),i.jsx(a,{width:"100%",height:"20px",margin:"0 0 8px 0"}),i.jsx(a,{width:"90%",height:"45px",margin:"0 0 20px 0"}),i.jsx(a,{width:"100%",height:"20px",margin:"0 0 8px 0"}),i.jsx(a,{width:"90%",height:"45px",margin:"0 0 20px 0"}),i.jsx(x,{}),i.jsx(s,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.2},children:t})]})}),h=e.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: ${t=>t.theme.background};
  width: 100vw;
  max-width: 100%;
  overflow-x: hidden;
`,b=e.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }

  @media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
  }
  max-width: 100vw;
  overflow-x: hidden;
`,w=e.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: clamp(20px, 5vw, 40px);
  width: 100%;
  max-width: min(400px, 100%);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    background: transparent;
    box-shadow: none;
    padding: 1rem;
    width: 100%;
    max-width: 100%;
  }
`,f=e.h2`
  color: ${t=>t.theme.text};
  margin-bottom: clamp(20px, 4vw, 30px);
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 1.5rem;
  }
`,u=e.form`
  display: flex;
  flex-direction: column;
  gap: clamp(15px, 3vw, 20px);

  @media (max-width: 768px) {
    width: 100%;
    gap: 1.5rem;
  }
  max-width: 100%;
`,v=e.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,k=e.div`
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    height: 50px; // Larger touch target
  }
  max-width: 100%;
  box-sizing: border-box;
`,y=e.label`
  color: ${t=>t.theme.text};
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 500;
  margin-left: 4px;
`,z=e.input`
  width: 100%;
  padding: clamp(10px, 2vw, 12px) 12px clamp(10px, 2vw, 12px) 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.25);
  color: ${t=>t.theme.text};
  font-size: clamp(14px, 3vw, 16px);
  transition: all 0.3s ease;
  box-sizing: border-box;
  -webkit-appearance: none;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.35);
  }

  &::placeholder {
    color: ${t=>t.theme.text}80;
  }

  @media (max-width: 768px) {
    font-size: 16px; // Prevent zoom on iOS
    padding: 12px 40px;
  }
  max-width: 100%;
  box-sizing: border-box;
`,j=e.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${t=>t.theme.text}CC;
  display: flex;
  align-items: center;
  pointer-events: none;
`,$=e.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: clamp(12px, 2.5vw, 14px);
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: clamp(14px, 3vw, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 50px;
    font-size: 16px;
    margin-top: 1rem;
  }
`,C=e.p`
  color: #ff6b6b;
  text-align: center;
  margin-top: 10px;
  font-size: clamp(12px, 3vw, 14px);
`,I=e.div`
  text-align: center;
  margin-top: 20px;
  color: ${t=>t.theme.text};
  font-size: clamp(14px, 3vw, 16px);
  
  a {
    color: #4a6cf7;
    text-decoration: none;
    font-weight: 500;
    margin-left: 5px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;export{g as A,$ as B,C as E,u as F,v as I,y as L,f as T,h as a,b,w as c,k as d,j as e,z as f,I as g};

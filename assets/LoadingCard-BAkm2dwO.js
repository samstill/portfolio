import{m as r,d as e,j as a}from"./index-I4BBwYdS.js";import{m as o}from"./proxy-DMLGpHM7.js";const n=r`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`,s=r`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`,d=e(o.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.2),
    0 4px 8px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  height: 200px;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${n} 2s infinite linear;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.02) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.02) 100%
    );
    background-size: 200% 200%;
    animation: ${s} 3s ease infinite;
  }
`,t=e.div`
  width: ${({width:i})=>i};
  height: ${({height:i})=>i||"15px"};
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  margin: 12px 0;
  position: relative;
  overflow: hidden;
  transform-origin: left;
  animation: ${n} 2s infinite linear;
  animation-delay: ${({delay:i})=>i}ms;

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
    animation-delay: ${({delay:i})=>i}ms;
  }
`,g=e(o.div)`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-top: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
`,p={initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1,transition:{duration:.5,ease:"easeOut"}},exit:{opacity:0,y:-20,scale:.95,transition:{duration:.3,ease:"easeIn"}}},l={initial:{opacity:0},animate:{opacity:1,transition:{duration:.3,delay:.2}}},b=({text:i="Loading..."})=>a.jsxs(o.div,{initial:"initial",animate:"animate",exit:"exit",variants:p,children:[a.jsxs(d,{children:[a.jsx(t,{width:"80%",height:"24px",delay:0}),a.jsx(t,{width:"60%",delay:200}),a.jsx(t,{width:"70%",delay:400}),a.jsx(t,{width:"40%",delay:600})]}),a.jsx(g,{variants:l,children:i})]});export{b as L};

import{d as i,b as J,r as l,h as be,i as me,o as fe,j as e,m as ve,k as we,u as ce,l as ye,n as je,p as pe,c as xe,q as ke,t as $e,v as re,w as M,x as Y,L as ge,y as ne}from"./index-I4BBwYdS.js";import{o as X,c as B,p as ze,q as he,F as Z,r as H,s as W,k as G,a as Ce,t as K,u as V,v as Q,w as Fe,x as Se}from"./index-DjBvL98p.js";import{m as Ee}from"./messageService-BFQPd58Q.js";import{c as O,D as De}from"./index-Cl0ZZ_yY.js";import{m as o}from"./proxy-DMLGpHM7.js";import{A as I}from"./index-C2QpgPxn.js";import{S as P}from"./Skeleton-DUCGPrHy.js";import{F as Te,a as Pe}from"./index-DFRYBWvR.js";import"./iconBase-VHV16drN.js";const Me=i.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${t=>t.$isFull?"rgba(238, 82, 83, 0.2)":"rgba(74, 108, 247, 0.1)"};  // Light blue background
  backdrop-filter: blur(4px);
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: ${t=>t.$isFull?"#ee5253":"#4a6cf7"};  // Blue color for available tickets
  font-weight: 600;
  z-index: 1;
`,Le=i(o.div)`
  position: relative;  // Add this to handle absolute positioning of badge
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`,Ie=i.h3`
  color: ${t=>t.theme.text};
  font-size: 1.2rem;
  margin-bottom: 10px;
`,se=i.p`
  color: ${t=>t.theme.text}CC;
  font-size: 0.9rem;
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,Ne=i.div`
  color: #4a6cf7;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 10px;
`,Re=i(o.div)`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 480px) {
    gap: 8px;
  }
`,oe=i(o.button)`
  padding: 8px 20px;
  border: none;
  border-radius: 12px;
  cursor: ${t=>t.$disabled?"not-allowed":"pointer"};
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${t=>t.$disabled?"rgba(255, 255, 255, 0.08)":t.$variant==="danger"?"linear-gradient(135deg, #ff6b6b, #ee5253)":"linear-gradient(135deg, #6e8efb, #4a6cf7)"};
  color: ${t=>t.$disabled?t.theme.text+"99":"white"};
  opacity: ${t=>t.$disabled?.8:1}; // Increased opacity for better visibility
  min-width: ${t=>t.$variant==="danger"?"120px":"140px"};
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    transform: ${t=>t.$disabled?"none":"translateY(-2px)"};
    box-shadow: ${t=>t.$disabled?"none":t.$variant==="danger"?"0 8px 20px rgba(238, 82, 83, 0.3)":"0 8px 20px rgba(74, 108, 247, 0.3)"};
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9rem;
    min-width: 0;
  }
`,Ae=i.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${t=>t.theme.text};
  font-size: 0.9rem;
  margin-top: 8px;
`,Oe=({event:t,isAdmin:n,onDelete:p,onBook:b})=>{const d=J(),[c,g]=l.useState(null);l.useEffect(()=>{const h=be(me,"events",t.id),x=fe(h,w=>{if(w.exists()){const s=w.data();g(s.availableTickets||0)}});return()=>x()},[t.id]);const y=()=>{d(`/events/${t.id}`)};return e.jsxs(Le,{onClick:y,whileHover:{scale:1.02,rotateX:2,rotateY:2,transition:{duration:.3}},children:[e.jsxs(Me,{$isFull:c===0,children:[e.jsx(X,{size:16}),c===0?"House Full":e.jsx("span",{children:c!==null?`${c} left`:"Loading..."})]}),e.jsxs(o.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.2},children:[e.jsx(Ie,{children:t.title}),e.jsxs(se,{children:[e.jsx(B,{size:14}),new Date(t.date).toLocaleString()]}),e.jsxs(se,{children:[e.jsx(ze,{size:14}),t.location]}),e.jsxs(Ne,{children:["₹",t.price]}),e.jsxs(Ae,{children:[e.jsx(he,{size:16}),c!==null?`${c} tickets left`:"Loading..."]}),e.jsxs(Re,{children:[e.jsx(oe,{onClick:h=>{h.stopPropagation(),c!==0&&b(t.id)},whileHover:{scale:c===0?1:1.05},whileTap:{scale:c===0?1:.95},$disabled:c===0,children:c===0?"Sold Out":"Book Ticket"}),n&&e.jsxs(oe,{$variant:"danger",onClick:h=>{h.stopPropagation(),p(t.id)},whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Z,{size:16}),"Delete"]})]})]})]})},Be=i(o.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: ${t=>{switch(t.$size){case"small":return"16px";case"large":return"24px";default:return"20px"}}};
  height: ${t=>{switch(t.$size){case"small":return"16px";case"large":return"24px";default:return"20px"}}};
  padding: 0 4px;
  border-radius: 999px;
  background: ${t=>{switch(t.$variant){case"danger":return"linear-gradient(135deg, #ff4b4b, #f70000)";case"success":return"linear-gradient(135deg, #4ade80, #22c55e)";default:return"linear-gradient(135deg, #6e8efb, #4a6cf7)"}}};
  color: white;
  font-size: ${t=>{switch(t.$size){case"small":return"0.7rem";case"large":return"0.9rem";default:return"0.8rem"}}};
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border: 2px solid ${t=>t.theme.background};
  z-index: 10;
`,_=({count:t,size:n="medium",variant:p="primary",maxCount:b=99})=>{if(t===0)return null;const d=t>b?`${b}+`:t.toString();return e.jsx(Be,{$size:n,$variant:p,initial:{scale:0,opacity:0},animate:{scale:1,opacity:1},exit:{scale:0,opacity:0},transition:{type:"spring",stiffness:500,damping:25},children:d})},He=ve`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`,Ue=i(o.div)`
  position: relative;
  width: ${({$size:t})=>t||"100px"};
  height: ${({$size:t})=>t||"100px"};
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
`,Ye=i.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.loaded {
    opacity: 1;
  }
`,qe=i(o.div)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({$bgColor:t})=>t||"linear-gradient(135deg, #6e8efb, #4a6cf7)"};
  color: white;
  font-size: 2rem;
  font-weight: 600;

  svg {
    width: 50%;
    height: 50%;
  }
`,Xe=i(o.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  
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
      rgba(255, 255, 255, 0.15) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: ${He} 1.5s infinite;
  }
`,We=({imageUrl:t,name:n="",size:p="100px",bgColor:b})=>{const[d,c]=l.useState(!!t),[g,y]=l.useState(!1),h=s=>s.split(" ").map(r=>r[0]).join("").toUpperCase().slice(0,2),x=()=>{c(!1)},w=()=>{c(!1),y(!0)};return e.jsx(Ue,{$size:p,children:t&&!g?e.jsxs(e.Fragment,{children:[e.jsx(Ye,{src:t,alt:n||"User avatar",onLoad:x,onError:w,className:d?"":"loaded"}),e.jsx(I,{children:d&&e.jsx(Xe,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0}})})]}):e.jsx(qe,{$bgColor:b,initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},transition:{duration:.2},children:n?h(n):e.jsx(H,{})})})},Ge=i(o.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 20px;
`,Ke=i.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,Ve=i.div`
  display: flex;
  align-items: center;
  gap: 20px;
`,Qe=i.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${t=>t.theme.text};
  cursor: pointer;
`,_e=i.div`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    display: none;
  }
`,le=i(o.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: ${t=>t.theme.text};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    display: none;
  }
`,Je=i(o.button)`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: ${t=>t.theme.text};
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`,Ze=i(o.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  z-index: 999;
  overflow-y: auto;

  /* Add a pseudo-element for additional background blur */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    z-index: -1;
  }
`,F=i(o.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${t=>t.$active?"linear-gradient(135deg, #6e8efb, #4a6cf7)":"rgba(255, 255, 255, 0.1)"};
  border: 1px solid rgba(255, 255, 255, ${t=>t.$active?"0.2":"0.1"});
  border-radius: 12px;
  color: ${t=>t.$active?"white":t.theme.text};
  cursor: pointer;
  font-size: 1.1rem;
  width: 100%;
  text-align: left;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: ${t=>t.$active?"linear-gradient(135deg, #6e8efb, #4a6cf7)":"rgba(255, 255, 255, 0.15)"};
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, ${t=>t.$active?"0.3":"0.2"});
  }
`,et=i(o.div)`
  position: absolute;
  top: 100%;
  right: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 6px;
`,A=i(o.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 12px;
  color: ${t=>t.theme.text};
  cursor: pointer;
  font-size: 0.9rem;
  width: 100%;
  text-align: left;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
`,tt=i(o.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: ${t=>t.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`,it=i(o.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  margin-right: 16px;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    display: none;
  }
`,at=({unreadMessages:t=0})=>{const n=J(),p=we(),{currentUser:b,isAdmin:d}=ce(),{profileImage:c}=ye();je();const[g,y]=l.useState(!1),[h,x]=l.useState(!1),w=l.useRef(null);l.useEffect(()=>{const u=S=>{w.current&&!w.current.contains(S.target)&&y(!1)};return document.addEventListener("mousedown",u),()=>document.removeEventListener("mousedown",u)},[]);const s=async()=>{try{await pe(xe),n("/login")}catch(u){console.error("Failed to log out:",u),O.error("Failed to log out")}},r=u=>p.pathname===u;return e.jsx(Ge,{initial:{y:-100},animate:{y:0},transition:{type:"spring",stiffness:100},children:e.jsxs(Ke,{children:[e.jsx(Ve,{children:e.jsxs(Qe,{onClick:()=>n("/"),children:[e.jsx(B,{size:24}),"Events"]})}),e.jsxs(_e,{children:[e.jsxs(it,{onClick:()=>n("/my-tickets"),whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(X,{size:18})," ","View Tickets"]}),d&&e.jsxs(le,{className:"hide-mobile",whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>n("/events/create"),children:[e.jsx(W,{size:16}),"Create Event"]}),e.jsxs(le,{className:"hide-mobile",whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>n("/"),children:[e.jsx(G,{size:16}),"Home"]}),e.jsx(tt,{onClick:()=>y(!g),whileHover:{scale:1.05},whileTap:{scale:.95},children:e.jsx(We,{imageUrl:c,name:(b==null?void 0:b.email)||"",size:"32px"})})]}),e.jsx(Je,{onClick:()=>x(!h),whileHover:{scale:1.05},whileTap:{scale:.95},children:h?e.jsx(Z,{size:24}):e.jsx(Ce,{size:24})}),e.jsx(I,{children:g&&e.jsxs(et,{ref:w,initial:{opacity:0,y:-20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},children:[e.jsxs(A,{onClick:()=>n("/profile"),children:[e.jsx(H,{size:18}),"Profile"]}),d&&e.jsxs(e.Fragment,{children:[e.jsxs(A,{onClick:()=>n("/messages"),children:[e.jsx(K,{size:18}),"Messages",t>0&&e.jsx(_,{count:t})]}),e.jsxs(A,{onClick:()=>n("/admin"),children:[e.jsx(V,{size:18}),"Admin Panel"]})]}),e.jsxs(A,{onClick:s,children:[e.jsx(Q,{size:18}),"Logout"]})]})}),e.jsx(I,{children:h&&e.jsx(Ze,{initial:{opacity:0,height:0},animate:{opacity:1,height:"calc(100vh - 70px)"},exit:{opacity:0,height:0},transition:{type:"spring",stiffness:100,damping:20},children:e.jsxs(o.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsxs(F,{$active:r("/events"),onClick:()=>{n("/events"),x(!1)},children:[e.jsx(B,{size:20}),"Events"]}),e.jsxs(F,{$active:r("/my-tickets"),onClick:()=>{n("/my-tickets"),x(!1)},children:[e.jsx(X,{size:20}),"View Tickets"]}),e.jsxs(F,{$active:r("/"),onClick:()=>{n("/"),x(!1)},children:[e.jsx(G,{size:20}),"Home"]}),d&&e.jsxs(e.Fragment,{children:[e.jsxs(F,{onClick:()=>{n("/events/create"),x(!1)},children:[e.jsx(W,{size:20}),"Create Event"]}),e.jsxs(F,{onClick:()=>{n("/messages"),x(!1)},children:[e.jsx(K,{size:20}),"Messages",t>0&&e.jsx(_,{count:t})]}),e.jsxs(F,{onClick:()=>{n("/admin"),x(!1)},children:[e.jsx(V,{size:20}),"Admin Panel"]})]}),e.jsxs(F,{onClick:()=>{n("/profile"),x(!1)},children:[e.jsx(H,{size:20}),"Profile"]}),e.jsxs(F,{onClick:s,children:[e.jsx(Q,{size:20}),"Logout"]})]})})})]})})},rt=i.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${t=>t.theme.background};
`;i(o.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.3rem 1.5rem;
  background: rgba(17, 25, 40, 0.98);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
`;i.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;i.h1`
  font-size: 1.2rem;
  color: ${t=>t.theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
`;i.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;

  @media (max-width: 768px) {
    .hide-mobile {
      display: none;
    }
  }
`;const L=i(o.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  color: ${t=>t.theme.text};
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(4px);
  }

  svg {
    color: #4a6cf7;
  }

  .badge {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ff4757;
    color: white;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-left: auto;
    box-shadow: 0 2px 5px rgba(255, 71, 87, 0.3);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  ${t=>t.$variant==="navbar"&&`
    padding: 6px 12px;
    background: linear-gradient(135deg, #6e8efb, #4a6cf7);
    color: white;
    font-size: 0.85rem;
    font-weight: 500;
    width: auto;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
      background: linear-gradient(135deg, #5d7cfa, #3955d3);
    }

    svg {
      color: white;
    }

    .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      min-width: 18px;
      height: 18px;
      font-size: 0.7rem;
      margin: 0;
      border: 2px solid ${n=>n.theme.background};
    }
  `}
`,nt=i(o.div)`
  position: absolute;
  top: 70px;
  right: 20px;
  background: rgba(17, 25, 40, 0.98);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 16px 48px rgba(0, 0, 0, 0.3);
  z-index: 1000;

  @media (max-width: 768px) {
    right: 16px;
    min-width: 180px;
  }
`;i(o.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px) saturate(180%);
  z-index: 999;
`;const de=i(o.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
  z-index: 1;
`;i.div`
  position: relative;
`;i.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${t=>t.$imageUrl?`url(${t.$imageUrl}) no-repeat center/cover`:"linear-gradient(135deg, #6e8efb, #4a6cf7)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`;i.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;const ue=i(o.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  color: ${t=>t.theme.text};
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;i(o.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: rgba(17, 25, 40, 0.98);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border-radius: 12px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 16px 48px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 99;

  > ${ue} {
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;i(ue)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;

  > span {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;i(o.div)`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;i.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff4757;
  color: white;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: auto;
  box-shadow: 0 2px 5px rgba(255, 71, 87, 0.3);
`;const st=i.div`
  width: 100%;
  margin-bottom: 20px;
`,ot=i.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`,lt=i.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:focus-within {
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
`,dt=i.input`
  width: 100%;
  padding: 14px 20px;
  padding-left: 50px;
  padding-right: 100px;
  background: transparent;
  border: none;
  color: ${t=>t.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${t=>t.theme.text}80;
  }

  @media (max-width: 768px) {
    padding: 12px 18px;
    padding-left: 45px;
    padding-right: 90px;
    font-size: 0.95rem;
  }
`,ct=i.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: ${t=>t.theme.text}80;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;

  svg {
    width: 20px;
    height: 20px;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    left: 15px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`,pt=i(o.button)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  min-width: fit-content;
  z-index: 2;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #4a6cf7, #6e8efb);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
`,xt=i(o.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
`,q=i.div`
  margin-bottom: 20px;

  h3 {
    font-size: 1rem;
    color: ${t=>t.theme.text};
    margin-bottom: 10px;
  }
`,gt=i.div`
  display: flex;
  gap: 10px;
  align-items: center;

  input {
    width: 100px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: ${t=>t.theme.text};
    outline: none;

    &:focus {
      border-color: #4a6cf7;
    }
  }
`,ht=i.div`
  display: flex;
  gap: 10px;
  align-items: center;

  input {
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: ${t=>t.theme.text};
    outline: none;

    &:focus {
      border-color: #4a6cf7;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`,ut=i.select`
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: ${t=>t.theme.text};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #4a6cf7;
  }
`,bt=({onFilterChange:t,onSortChange:n})=>{const[p,b]=l.useState(!1),[d,c]=l.useState({searchTerm:"",startDate:void 0,endDate:void 0,minPrice:void 0,maxPrice:void 0}),g=l.useCallback(async s=>{var u;const r={...d,...s};c(r);try{const S=ke(),C=$e(S,"events");let z=[];if((u=r.searchTerm)!=null&&u.trim()){const E=r.searchTerm.toLowerCase().trim(),D=re(C,M("title",">=",E),M("title","<=",E+"")),U=(await Y(D)).docs.map(a=>({id:a.id,...a.data()}));t(r,U);return}r.startDate&&z.push(M("date",">=",r.startDate)),r.endDate&&z.push(M("date","<=",r.endDate)),r.minPrice!==void 0&&r.minPrice!==null&&z.push(M("price",">=",Number(r.minPrice))),r.maxPrice!==void 0&&r.maxPrice!==null&&z.push(M("price","<=",Number(r.maxPrice)));let N=[];if(z.length===0)N=(await Y(C)).docs.map(D=>({id:D.id,...D.data()}));else{const E=re(C,...z);N=(await Y(E)).docs.map(R=>({id:R.id,...R.data()}))}t(r,N)}catch(S){console.error("Error filtering events:",S),t(r,[])}},[d,t]),y=l.useCallback(s=>{const r=s.target.value;g({searchTerm:r})},[g]),h=l.useCallback(s=>{if(s.key==="Enter"){s.preventDefault();const r=s.target.value;g({searchTerm:r})}},[g]),x=l.useCallback((s,r)=>{g({[s]:r?new Date(r):void 0})},[g]),w=l.useCallback((s,r)=>{g({[s]:r?Number(r):void 0})},[g]);return e.jsxs(st,{children:[e.jsx(ot,{children:e.jsxs(lt,{children:[e.jsx(ct,{children:e.jsx(Fe,{size:20})}),e.jsx(dt,{placeholder:"Search events...",value:d.searchTerm,onChange:y,onKeyPress:h,"aria-label":"Search events"}),e.jsxs(pt,{onClick:()=>b(!p),type:"button",children:[p?e.jsx(Z,{size:18}):e.jsx(Se,{size:18}),p?"Close":"Filter"]})]})}),e.jsx(I,{children:p&&e.jsxs(xt,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.3},children:[e.jsxs(q,{children:[e.jsx("h3",{children:"Date Range"}),e.jsxs(ht,{children:[e.jsx("input",{type:"date",onChange:s=>x("startDate",s.target.value),value:d.startDate?new Date(d.startDate).toISOString().split("T")[0]:""}),e.jsx("span",{children:"to"}),e.jsx("input",{type:"date",onChange:s=>x("endDate",s.target.value),value:d.endDate?new Date(d.endDate).toISOString().split("T")[0]:""})]})]}),e.jsxs(q,{children:[e.jsx("h3",{children:"Price Range"}),e.jsxs(gt,{children:[e.jsx("input",{type:"number",placeholder:"Min",onChange:s=>w("minPrice",s.target.value),value:d.minPrice||""}),e.jsx("span",{children:"to"}),e.jsx("input",{type:"number",placeholder:"Max",onChange:s=>w("maxPrice",s.target.value),value:d.maxPrice||""})]})]}),e.jsxs(q,{children:[e.jsx("h3",{children:"Sort By"}),e.jsxs(ut,{onChange:s=>n==null?void 0:n(s.target.value),children:[e.jsx("option",{value:"date-desc",children:"Date (Newest)"}),e.jsx("option",{value:"date-asc",children:"Date (Oldest)"}),e.jsx("option",{value:"price-asc",children:"Price (Low to High)"}),e.jsx("option",{value:"price-desc",children:"Price (High to Low)"})]})]})]})})]})},mt=i(o.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 999;
`,ft=i.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  background: ${t=>t.$available>0?"rgba(74, 222, 128, 0.2)":"rgba(239, 68, 68, 0.2)"};
  color: ${t=>t.$available>0?"#4ade80":"#ef4444"};
`,vt=i.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`,wt=i(o.div)`
  text-align: center;
  padding: 40px 20px;
  color: ${t=>t.theme.textSecondary};
  font-size: 1.1rem;
  width: 100%;
  max-width: calc(100vw - 40px);
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  svg {
    margin-bottom: 15px;
    opacity: 0.7;
    font-size: 48px;
  }

  p {
    margin: 0;
    max-width: 80%;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    padding: 30px 15px;
    font-size: 1rem;
    margin: 15px auto;
    min-height: 180px;
    max-width: calc(100vw - 30px);

    svg {
      font-size: 40px;
      margin-bottom: 12px;
    }

    p {
      max-width: 90%;
    }
  }

  @media (max-width: 480px) {
    padding: 25px 15px;
    min-height: 160px;
    
    svg {
      font-size: 36px;
      margin-bottom: 10px;
    }
  }
`,yt=()=>e.jsxs(o.div,{style:{background:"rgba(255, 255, 255, 0.05)",borderRadius:"15px",padding:"25px",border:"1px solid rgba(255, 255, 255, 0.1)",height:"100%"},children:[e.jsx(P,{height:"24px",width:"70%",marginbottom:"15px",borderradius:"4px"}),e.jsx(P,{height:"16px",width:"40%",marginbottom:"20px",borderradius:"4px"}),e.jsx(P,{height:"100px",width:"100%",marginbottom:"15px",borderradius:"4px"}),e.jsx(P,{height:"16px",width:"60%",marginbottom:"10px",borderradius:"4px"}),e.jsx(P,{height:"16px",width:"50%",marginbottom:"20px",borderradius:"4px"}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(P,{height:"32px",width:"100px",borderradius:"16px"}),e.jsx(P,{height:"32px",width:"80px",borderradius:"16px"})]})]});i.div`
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`;const jt=i(ge)`
  position: fixed;
  bottom: 80px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4a6cf7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, background-color 0.2s;
  z-index: 10;
  
  &:hover {
    transform: scale(1.05);
    background-color: #3a5ce5;
  }
  
  svg {
    font-size: 1.5rem;
  }
`,Pt=()=>{const{currentUser:t,isAdmin:n}=ce(),p=J(),[b,d]=l.useState(!1),[c,g]=l.useState(0),[y,h]=l.useState(!0),[x,w]=l.useState([]),[s,r]=l.useState([]),[u,S]=l.useState({searchTerm:"",dateRange:{start:null,end:null},priceRange:{min:null,max:null},sortOrder:"date-desc"}),C=l.useCallback((a,m)=>{var ee,te,ie,ae;if(!m.length)return[];let j=[...m];try{if(a.searchTerm){const f=a.searchTerm.toLowerCase().trim();j=j.filter(v=>v.title.toLowerCase().includes(f)||v.description.toLowerCase().includes(f)||v.location.toLowerCase().includes(f))}return((ee=a.dateRange)!=null&&ee.start||(te=a.dateRange)!=null&&te.end)&&(j=j.filter(f=>{var v,T;try{const k=new Date(f.date);if(!k.getTime())return!1;if((v=a.dateRange)!=null&&v.start){const $=new Date(a.dateRange.start);if($.setHours(0,0,0,0),k<$)return!1}if((T=a.dateRange)!=null&&T.end){const $=new Date(a.dateRange.end);if($.setHours(23,59,59,999),k>$)return!1}return!0}catch(k){return console.error("Error filtering by date:",k),!1}})),(((ie=a.priceRange)==null?void 0:ie.min)!==null||((ae=a.priceRange)==null?void 0:ae.max)!==null)&&(j=j.filter(f=>{var v,T;try{const k=parseFloat(f.price.toString());if(isNaN(k))return!1;if(((v=a.priceRange)==null?void 0:v.min)!==null){const $=parseFloat(a.priceRange.min.toString());if(!isNaN($)&&k<$)return!1}if(((T=a.priceRange)==null?void 0:T.max)!==null){const $=parseFloat(a.priceRange.max.toString());if(!isNaN($)&&k>$)return!1}return!0}catch(k){return console.error("Error filtering by price:",k),!1}})),a.sortOrder&&j.sort((f,v)=>{try{switch(a.sortOrder){case"date-asc":return new Date(f.date).getTime()-new Date(v.date).getTime();case"date-desc":return new Date(v.date).getTime()-new Date(f.date).getTime();case"price-asc":return parseFloat(f.price.toString())-parseFloat(v.price.toString());case"price-desc":return parseFloat(v.price.toString())-parseFloat(f.price.toString());default:return 0}}catch(T){return console.error("Error sorting events:",T),0}}),j}catch(f){return console.error("Error in filterEvents:",f),[]}},[]),z=l.useCallback(a=>{S(m=>({...m,...a}))},[]),N=l.useCallback(a=>{z({sortOrder:a})},[z]);l.useEffect(()=>{(async()=>{h(!0);try{const m=await ne.getEvents();w(m);const j=C(u,m);r(j)}catch(m){console.error("Error fetching events:",m),O.error("Failed to load events")}finally{h(!1)}})()},[C,u]),l.useEffect(()=>{n&&(async()=>{const m=await Ee.getUnreadCount();g(m)})()},[n]);const E=async()=>{try{await pe(xe),p("/login")}catch{console.error("Failed to log out")}},D=()=>{p("/events/create")},R=async a=>{if(window.confirm("Are you sure you want to delete this event?"))try{await ne.deleteEvent(a),O.success("Event deleted successfully")}catch{O.error("Failed to delete event")}},U=a=>{p(`/events/${a}/book`)};return l.useEffect(()=>{if(!y){const a=C(u,x);r(a)}},[x,u,C,y]),e.jsxs(rt,{children:[e.jsx(De,{position:"top-right"}),e.jsx(at,{unreadMessages:c}),e.jsx(bt,{filters:u,onFilterChange:z,onSortChange:N}),e.jsx(I,{children:b&&e.jsxs(e.Fragment,{children:[e.jsx(mt,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>d(!1)}),e.jsxs(nt,{initial:{opacity:0,y:-20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-20,scale:.95},transition:{duration:.2},children:[n&&e.jsxs(e.Fragment,{children:[e.jsxs(L,{$variant:"navbar",onClick:D,children:[e.jsx(W,{size:18}),"Create Event"]}),e.jsxs(L,{onClick:()=>p("/messages"),children:[e.jsxs(vt,{children:[e.jsx(K,{size:18}),c>0&&e.jsx(_,{count:c,size:"small",variant:"primary"})]}),"Messages"]}),e.jsxs(L,{onClick:()=>p("/admin"),children:[e.jsx(V,{size:18}),"Admin Panel"]})]}),e.jsxs(L,{onClick:()=>p("/"),children:[e.jsx(G,{size:18}),"Home"]}),e.jsxs(L,{onClick:()=>p("/profile"),children:[e.jsx(H,{size:18}),"Profile"]}),e.jsxs(L,{onClick:E,children:[e.jsx(Q,{size:18}),"Logout"]})]})]})}),e.jsx(I,{mode:"wait",children:y?e.jsx(de,{children:[...Array(6)].map((a,m)=>e.jsx(yt,{},m))}):s.length===0?e.jsxs(wt,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},children:[e.jsx(B,{size:40}),e.jsx("p",{children:"No events found"})]}):e.jsx(de,{children:s.map(a=>e.jsx(Oe,{event:a,isAdmin:n,onDelete:R,onBook:U,ticketInfo:e.jsxs(ft,{$available:a.availableTickets||0,children:[e.jsx(he,{size:14}),a.availableTickets||0," available"]})},a.id))})}),t&&e.jsx(jt,{to:"/messenger",title:"Open Messenger",children:e.jsx(Te,{})}),(t==null?void 0:t.isAdmin)&&e.jsx(ge,{to:"/create-event",className:"create-event-button",children:e.jsx(Pe,{})})]})};export{Pt as default};

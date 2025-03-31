import{d as r,T as $,b as z,r as u,h as I,o as L,j as e,i as B}from"./index-I4BBwYdS.js";import{n as R}from"./index-DjBvL98p.js";import{c as h}from"./index-Cl0ZZ_yY.js";import{F as A}from"./FirebaseEventRepository-DBVeqBwi.js";import{m as T}from"./proxy-DMLGpHM7.js";import"./iconBase-VHV16drN.js";const w=r.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${t=>t.theme.background};

  @media (max-width: 768px) {
    padding: 60px 15px;
  }
`,H=r(T.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: ${t=>t.theme.text};
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`,O=r.form`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 15px;
  }
`,d=r.div`
  margin-bottom: 20px;
`,c=r.label`
  display: block;
  margin-bottom: 8px;
  color: ${t=>t.theme.text};
  font-weight: 500;
`,l=r.input`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: ${t=>t.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`,P=r.textarea`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: ${t=>t.theme.text};
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`,G=r(T.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  margin-top: 20px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,V=()=>{const{id:t}=$(),x=z(),[y,S]=u.useState(!0),[b,g]=u.useState(!1),[v,F]=u.useState(null),E=new A,[i,f]=u.useState({title:"",description:"",date:"",time:"",location:"",price:"",availableTickets:""});u.useEffect(()=>{if(!t)return;const p=I(B,"events",t),n=L(p,o=>{var m,j;if(o.exists()){const s=o.data();F({...s,id:o.id});const k=new Date(s.date),D=k.toISOString().split("T")[0],q=k.toTimeString().split(" ")[0].slice(0,5);f({title:s.title||"",description:s.description||"",date:D,time:q,location:s.location||"",price:((m=s.price)==null?void 0:m.toString())||"",availableTickets:((j=s.availableTickets)==null?void 0:j.toString())||""}),S(!1)}else h.error("Event not found"),x("/events")});return()=>n()},[t,x]);const a=p=>{const{name:n,value:o}=p.target;f(m=>({...m,[n]:o}))},C=async p=>{if(p.preventDefault(),!(!t||!v))try{g(!0);const n=new Date(i.date+"T"+i.time),o={...v,title:i.title,description:i.description,date:n.toISOString(),location:i.location,price:parseFloat(i.price),availableTickets:parseInt(i.availableTickets,10)};await E.updateEvent(t,o),h.success("Event updated successfully"),x(`/events/${t}`)}catch(n){console.error("Error updating event:",n),h.error("Failed to update event")}finally{g(!1)}};return y?e.jsx(w,{children:e.jsx("div",{children:"Loading..."})}):e.jsxs(w,{children:[e.jsxs(H,{onClick:()=>x(`/events/${t}`),whileHover:{x:-5},whileTap:{scale:.95},children:[e.jsx(R,{size:18}),"Back to Event"]}),e.jsxs(O,{onSubmit:C,children:[e.jsxs(d,{children:[e.jsx(c,{htmlFor:"title",children:"Title"}),e.jsx(l,{type:"text",id:"title",name:"title",value:i.title,onChange:a,required:!0})]}),e.jsxs(d,{children:[e.jsx(c,{htmlFor:"description",children:"Description (Markdown supported)"}),e.jsx(P,{id:"description",name:"description",value:i.description,onChange:a,required:!0})]}),e.jsxs(d,{children:[e.jsx(c,{htmlFor:"date",children:"Date"}),e.jsx(l,{type:"date",id:"date",name:"date",value:i.date,onChange:a,required:!0})]}),e.jsxs(d,{children:[e.jsx(c,{htmlFor:"time",children:"Time"}),e.jsx(l,{type:"time",id:"time",name:"time",value:i.time,onChange:a,required:!0})]}),e.jsxs(d,{children:[e.jsx(c,{htmlFor:"location",children:"Location"}),e.jsx(l,{type:"text",id:"location",name:"location",value:i.location,onChange:a,required:!0})]}),e.jsxs(d,{children:[e.jsx(c,{htmlFor:"price",children:"Price (₹)"}),e.jsx(l,{type:"number",id:"price",name:"price",value:i.price,onChange:a,min:"0",step:"0.01",required:!0})]}),e.jsxs(d,{children:[e.jsx(c,{htmlFor:"availableTickets",children:"Available Tickets"}),e.jsx(l,{type:"number",id:"availableTickets",name:"availableTickets",value:i.availableTickets,onChange:a,min:"0",required:!0})]}),e.jsx(G,{type:"submit",disabled:b,whileHover:{scale:1.02},whileTap:{scale:.98},children:b?"Saving...":"Save Changes"})]})]})};export{V as default};

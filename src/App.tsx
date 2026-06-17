import{useState}from'react'
  function b64d(s:string){try{return JSON.parse(atob(s.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(s.length/4)*4,"=")))}catch{return null}}
  const EX=[
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IjFTdWx0YW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTc2MDAwMDAsImV4cCI6MTcxNzY4NjQwMH0.signature",
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfMDAxIiwiZW1haWwiOiJoZWxsb0BleGFtcGxlLmNvbSIsImlhdCI6MTcxNzYwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ.signature"
  ]
  export default function App(){
    const[token,setToken]=useState(EX[0])
    const[cp,setCp]=useState("")
    const parts=token.trim().split(".")
    const header=parts[0]?b64d(parts[0]):null
    const payload=parts[1]?b64d(parts[1]):null
    const sig=parts[2]||""
    const exp=payload?.exp
    const iat=payload?.iat
    const isExpired=exp&&exp<Date.now()/1000
    const fmt=(ts:number)=>new Date(ts*1000).toLocaleString()
    const copy=(text:string,key:string)=>{navigator.clipboard.writeText(text);setCp(key);setTimeout(()=>setCp(""),2000)}
    return(
      <div style={{minHeight:"100vh",fontFamily:"Inter,system-ui,sans-serif",color:"#e2e8f0",padding:"2rem"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <h1 style={{fontWeight:800,fontSize:"1.75rem",marginBottom:"0.5rem",color:"#f8fafc"}}>🔑 JWT Decoder</h1>
          <p style={{color:"#94a3b8",marginBottom:"1.5rem",fontSize:"0.9rem"}}>Decode and inspect JSON Web Tokens — client-side only, nothing is sent to any server</p>
          <textarea value={token} onChange={e=>setToken(e.target.value)} rows={4} placeholder="Paste your JWT here..." style={{width:"100%",background:"#111827",border:"1px solid #334155",borderRadius:10,padding:"1rem",color:"#e2e8f0",outline:"none",fontSize:"0.82rem",fontFamily:"JetBrains Mono,monospace",resize:"vertical",marginBottom:"0.75rem"}}/>
          <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
            {EX.map((e,i)=><button key={i} onClick={()=>setToken(e)} style={{padding:"0.35rem 0.85rem",background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",borderRadius:6,cursor:"pointer",fontSize:"0.78rem"}}>Example {i+1}</button>)}
            <button onClick={()=>setToken("")} style={{padding:"0.35rem 0.75rem",background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",borderRadius:6,cursor:"pointer",fontSize:"0.78rem"}}>Clear</button>
          </div>
          {parts.length===3&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              {[{label:"HEADER",data:header,color:"#38bdf8",key:"hdr"},{label:"PAYLOAD",data:payload,color:"#22c55e",key:"pld"}].map(({label,data,color,key})=>(
                <div key={label} style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,overflow:"hidden"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.6rem 1rem",borderBottom:"1px solid #1e293b"}}>
                    <span style={{fontWeight:700,color,fontSize:"0.78rem",letterSpacing:"0.08em"}}>{label}</span>
                    <button onClick={()=>copy(JSON.stringify(data,null,2),key)} style={{padding:"0.2rem 0.6rem",background:"#1e293b",color:cp===key?"#22c55e":"#94a3b8",border:"1px solid #334155",borderRadius:4,cursor:"pointer",fontSize:"0.72rem"}}>{cp===key?"✓":"Copy"}</button>
                  </div>
                  <pre style={{padding:"1rem",margin:0,fontSize:"0.78rem",fontFamily:"JetBrains Mono,monospace",color:"#94a3b8",overflowX:"auto",lineHeight:1.7}}>{data?JSON.stringify(data,null,2):"Invalid"}</pre>
                </div>
              ))}
            </div>
          )}
          {payload&&(
            <div style={{marginTop:"1rem",background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"1rem"}}>
              <div style={{fontWeight:700,color:"#94a3b8",fontSize:"0.78rem",letterSpacing:"0.08em",marginBottom:"0.75rem"}}>TOKEN INFO</div>
              <div style={{display:"flex",gap:"2rem",flexWrap:"wrap"}}>
                {exp&&<div><div style={{color:isExpired?"#f87171":"#22c55e",fontWeight:700,fontSize:"0.9rem"}}>{isExpired?"⚠ Expired":"✓ Valid"}</div><div style={{color:"#475569",fontSize:"0.75rem"}}>Expires: {fmt(exp)}</div></div>}
                {iat&&<div><div style={{color:"#38bdf8",fontWeight:700,fontSize:"0.9rem"}}>Issued</div><div style={{color:"#475569",fontSize:"0.75rem"}}>{fmt(iat)}</div></div>}
                {payload.sub&&<div><div style={{color:"#f59e0b",fontWeight:700,fontSize:"0.9rem"}}>Subject</div><div style={{color:"#475569",fontSize:"0.75rem"}}>{payload.sub}</div></div>}
                <div><div style={{color:"#a855f7",fontWeight:700,fontSize:"0.9rem"}}>Algorithm</div><div style={{color:"#475569",fontSize:"0.75rem"}}>{header?.alg||"Unknown"}</div></div>
              </div>
              <div style={{marginTop:"1rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
                <div style={{flex:1,fontFamily:"JetBrains Mono,monospace",fontSize:"0.72rem",color:"#334155",background:"#0f172a",borderRadius:4,padding:"0.4rem 0.6rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Signature: {sig.slice(0,30)}...</div>
                <div style={{background:"#f59e0b22",border:"1px solid #f59e0b44",borderRadius:4,padding:"0.2rem 0.6rem",fontSize:"0.72rem",color:"#f59e0b"}}>Not verified</div>
              </div>
            </div>
          )}
          {parts.length!==3&&token.trim()&&<div style={{background:"#1a0c10",border:"1px solid #7f1d1d",borderRadius:8,padding:"1rem",color:"#f87171",fontSize:"0.85rem"}}>⚠ Invalid JWT format. A valid JWT has 3 parts separated by dots.</div>}
        </div>
      </div>
    )
  }
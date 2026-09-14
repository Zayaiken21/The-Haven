/*
  THE HAVEN
  Deterministic project generator. No AI/network calls.
  GitHub Pages compatible.
*/
"use strict";

const state = { files: {}, current: null };

const $ = id => document.getElementById(id);
const safeName = s => (s || "My-Haven-Project").trim()
  .replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0,60) || "My-Haven-Project";

function escXml(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");}

function detectFeatures(text){
  const t=text.toLowerCase();
  return {
    game:/game|player|enemy|score|level|keyboard|joystick|racing|platform/.test(t),
    form:/form|login|signup|contact|input/.test(t),
    api:/api|server|backend|database|supabase|express/.test(t),
    python:/python|flask|fastapi|pandas/.test(t),
    node:/node|express|npm/.test(t)
  };
}

function makeWeb(name, req, game=false){
  const title = name.replace(/[-_]/g," ");
  const gameJS = game ? `
const canvas=document.querySelector("#game");
const ctx=canvas.getContext("2d");
let player={x:100,y:100,w:30,h:30,vx:0,vy:0};
let score=0, keys={};
addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true);
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
function loop(){
  player.vx=(keys["arrowright"]||keys["d"]?3:0)-(keys["arrowleft"]||keys["a"]?3:0);
  player.vy=(keys["arrowdown"]||keys["s"]?3:0)-(keys["arrowup"]||keys["w"]?3:0);
  player.x=Math.max(0,Math.min(canvas.width-player.w,player.x+player.vx));
  player.y=Math.max(0,Math.min(canvas.height-player.h,player.y+player.vy));
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#60a5fa";ctx.fillRect(player.x,player.y,player.w,player.h);
  ctx.fillStyle="#fff";ctx.font="18px system-ui";ctx.fillText("Score: "+score,15,25);
  requestAnimationFrame(loop);
} loop();` : `
document.querySelector("#app").innerHTML="<h2>Project created successfully.</h2><p>${escXml(req).replace(/'/g,"\\'")}</p>";`;

  return {
    "index.html": `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escXml(title)}</title><link rel="stylesheet" href="styles.css"></head>
<body><main id="app"><h1>${escXml(title)}</h1>${game?'<canvas id="game" width="800" height="450"></canvas>':''}</main>
<script src="app.js"></script></body></html>`,
    "styles.css": `body{margin:0;background:#0b1020;color:#eef2ff;font-family:system-ui;min-height:100vh;display:grid;place-items:center}main{width:min(900px,92%);text-align:center}canvas{max-width:100%;border:1px solid #475569;background:#020617;border-radius:12px}`,
    "app.js": `// The Haven generated this deterministic starter from the request.\n${gameJS}`
  };
}

function makeNode(name, req){
  return {
    "package.json": JSON.stringify({name:name.toLowerCase(),version:"1.0.0",private:true,scripts:{start:"node src/index.js"}},null,2),
    "src/index.js": `const http=require("http");\nconst server=http.createServer((req,res)=>{res.writeHead(200,{"Content-Type":"text/plain"});res.end(${JSON.stringify(req)});});\nserver.listen(3000,()=>console.log("The Haven server running on http://localhost:3000"));`
  };
}

function makePython(name, req){
  return {
    "app.py": `from http.server import BaseHTTPRequestHandler, HTTPServer\n\nREQUEST=${JSON.stringify(req)}\nclass Handler(BaseHTTPRequestHandler):\n    def do_GET(self):\n        body=f"The Haven project: ${name}\\\\nRequest: {REQUEST}".encode()\n        self.send_response(200); self.send_header("Content-Type","text/plain"); self.end_headers(); self.wfile.write(body)\n\nif __name__=="__main__":\n    print("The Haven server: http://localhost:8000")\n    HTTPServer(("0.0.0.0",8000),Handler).serve_forever()\n`,
    "requirements.txt": "# No third-party packages required.\n"
  };
}

function build(){
  const name=safeName($("projectName").value), req=$("request").value.trim();
  if(!req){$("output").textContent="Enter what you want to build first.";return}
  const type=$("projectType").value;
  if(type==="node") state.files=makeNode(name,req);
  else if(type==="python") state.files=makePython(name,req);
  else state.files=makeWeb(name,req,type==="game");
  state.current=Object.keys(state.files)[0];
  render();
  $("status").textContent=`Built ${Object.keys(state.files).length} deterministic files.`;
  $("downloadBtn").disabled=false;$("saveBtn").disabled=false;$("validateBtn").disabled=false;
  speak(`The Haven built ${Object.keys(state.files).length} files for ${name}.`);
}

function render(){
  $("tree").textContent=Object.keys(state.files).map((f,i)=>`${i===0?"└─":"├─"} ${f}`).join("\n");
  $("fileTabs").innerHTML="";
  for(const f of Object.keys(state.files)){
    const b=document.createElement("button");b.className="tab"+(f===state.current?" active":"");b.textContent=f;
    b.onclick=()=>{saveCurrent();state.current=f;render()};
    $("fileTabs").appendChild(b);
  }
  $("editor").value=state.files[state.current]||"";
}

function saveCurrent(){if(state.current)state.files[state.current]=$("editor").value}
function validate(){
  saveCurrent();let messages=[];
  for(const [f,c] of Object.entries(state.files)){
    if(!c.trim()) messages.push(`✗ ${f}: empty`);
    else if(f.endsWith(".json")){try{JSON.parse(c);messages.push(`✓ ${f}: valid JSON`)}catch(e){messages.push(`✗ ${f}: invalid JSON — ${e.message}`)}}
    else messages.push(`✓ ${f}: non-empty`);
  }
  $("output").textContent=messages.join("\n");
}
function speak(text){
  if("speechSynthesis" in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text))}
}
$("buildBtn").onclick=build;
$("clearBtn").onclick=()=>{state.files={};state.current=null;$("tree").textContent="No project yet.";$("fileTabs").innerHTML="";$("editor").value="";$("output").textContent="Cleared.";$("downloadBtn").disabled=true;$("saveBtn").disabled=true;$("validateBtn").disabled=true};
$("saveBtn").onclick=()=>{saveCurrent();$("status").textContent=`Saved ${state.current}.`};
$("validateBtn").onclick=validate;
$("speakBtn").onclick=()=>speak($("output").textContent);
$("editor").addEventListener("input",()=>state.current&& (state.files[state.current]=$("editor").value));

/* Minimal ZIP writer: store-only ZIP, no external library. */
function u16(n){return [n&255,(n>>>8)&255]}
function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
function zipBlob(files){
  const enc=new TextEncoder(), local=[], central=[];let offset=0;
  for(const [name,text] of Object.entries(files)){
    const nb=enc.encode(name), data=enc.encode(text), crc=crc32(data);
    const lh=[0x50,0x4b,0x03,0x04,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(data.length),...u32(data.length),...u16(nb.length),0,...nb,...data];
    local.push(...lh);
    const ch=[0x50,0x4b,0x01,0x02,20,0,20,0,0,0,0,0,0,0,...u32(crc),...u32(data.length),...u32(data.length),...u16(nb.length),0,0,0,0,0,0,0,0,...u32(offset),...nb];
    central.push(...ch);offset+=lh.length;
  }
  const cdStart=offset, cdSize=central.length;
  const end=[0x50,0x4b,0x05,0x06,0,0,0,0,...u16(Object.keys(files).length),...u16(Object.keys(files).length),...u32(cdSize),...u32(cdStart),0,0];
  return new Blob([new Uint8Array([...local,...central,...end])],{type:"application/zip"});
}
$("downloadBtn").onclick=()=>{saveCurrent();const blob=zipBlob(state.files),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=safeName($("projectName").value)+".zip";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};

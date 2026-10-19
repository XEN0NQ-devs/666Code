(function(){
const $=id=>document.getElementById(id);
// zakładki
document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tool-view').forEach(v=>v.classList.remove('active-tool'));
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
  $(b.dataset.tool).classList.add('active-tool'); b.classList.add('active');
}));

// ---------- SMALL CAPS ----------
const sc={a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'};
$('inputText').addEventListener('input',()=>{
  $('outputText').value=[...$('inputText').value.toLowerCase()].map(c=>sc[c]||c).join('');
});
$('copySmallCapsBtn').addEventListener('click',()=>copyText($('outputText').value,$('copySmallCapsText')));

// ---------- GRADIENT ----------
let gradColors=['#e11d2e','#ff6a3d','#ffffff'];
const gfmt={bold:false,underline:false,strike:false,italic:false};
const hexRe=/^#[0-9a-f]{6}$/i;
const toRgb=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const toHex=c=>'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');
function colorAt(i,n){
  const rgb=gradColors.map(toRgb), f=n<2?0:i/(n-1)*(rgb.length-1), k=Math.min(Math.floor(f),rgb.length-1), t=f-k;
  const a=rgb[k], b=rgb[Math.min(k+1,rgb.length-1)];
  return toHex(a.map((v,j)=>Math.round(v+t*(b[j]-v))));
}
function renderGradColors(){
  const list=$('colorList'); list.innerHTML='';
  gradColors.forEach((hex,i)=>{
    const row=document.createElement('div'); row.className='color-row';
    row.innerHTML=`<input type="color" value="${hex}"><input type="text" value="${hex}" maxlength="7">`+(gradColors.length>2?`<button class="rm-btn" aria-label="Usuń kolor"><i class="fa-solid fa-xmark"></i></button>`:'');
    const [pk,tx]=row.querySelectorAll('input');
    pk.addEventListener('input',()=>{gradColors[i]=pk.value;tx.value=pk.value;updateGrad();});
    tx.addEventListener('input',()=>{if(hexRe.test(tx.value)){gradColors[i]=tx.value;pk.value=tx.value;updateGrad();}});
    const rm=row.querySelector('.rm-btn'); if(rm) rm.addEventListener('click',()=>{gradColors.splice(i,1);renderGradColors();});
    list.appendChild(row);
  });
  updateGrad();
}
function updateGrad(){
  const text=$('gradText').value, chars=[...text];
  if(!chars.length){$('gradPreview').innerHTML='';$('gradOutput').value='';return;}
  const legacyFmt=(gfmt.bold?'&l':'')+(gfmt.underline?'&n':'')+(gfmt.strike?'&m':'')+(gfmt.italic?'&o':'');
  if($('gradFormat').value==='minimessage'){
    const open=(gfmt.bold?'<b>':'')+(gfmt.underline?'<u>':'')+(gfmt.strike?'<st>':'')+(gfmt.italic?'<i>':'');
    $('gradOutput').value=`${open}<gradient:${gradColors.join(':')}>${text}</gradient>`;
  } else {
    $('gradOutput').value=chars.map((c,i)=>c===' '?c:`&#${colorAt(i,chars.length).slice(1)}${legacyFmt}${c}`).join('');
  }
  const dec=[gfmt.underline&&'underline',gfmt.strike&&'line-through'].filter(Boolean).join(' ');
  const box=$('gradPreview'); box.textContent='';
  chars.forEach((c,i)=>{
    const s=document.createElement('span'); s.textContent=c===' '?'\u00a0':c; s.style.color=colorAt(i,chars.length);
    if(gfmt.bold) s.style.fontWeight='bold'; if(gfmt.italic) s.style.fontStyle='italic'; if(dec) s.style.textDecoration=dec;
    box.appendChild(s);
  });
}
document.querySelectorAll('[data-gfmt]').forEach(b=>b.addEventListener('click',()=>{
  gfmt[b.dataset.gfmt]=!gfmt[b.dataset.gfmt]; b.classList.toggle('active-fmt'); updateGrad();
}));
$('addColorBtn').addEventListener('click',()=>{if(gradColors.length<6){gradColors.push('#ffffff');renderGradColors();}});
$('gradText').addEventListener('input',updateGrad);
$('gradFormat').addEventListener('change',updateGrad);
$('copyGradBtn').addEventListener('click',()=>copyText($('gradOutput').value,$('copyGradText')));
renderGradColors();

// ---------- PREFIX ----------
const F={
A:[[0,1,1,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],B:[[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0]],
C:[[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,1]],D:[[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
E:[[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,1,1,1]],F:[[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0]],
G:[[0,1,1,1,1],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[0,1,1,1,1]],H:[[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
I:[[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],J:[[0,0,1,1,1],[0,0,0,1,0],[0,0,0,1,0],[1,0,0,1,0],[0,1,1,0,0]],
K:[[1,0,0,0,1],[1,0,0,1,0],[1,1,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],L:[[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
M:[[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],N:[[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]],
O:[[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],P:[[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0]],
Q:[[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,1,1],[0,1,1,1,1]],R:[[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,1,0],[1,0,0,0,1]],
S:[[0,1,1,1,1],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],T:[[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
U:[[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],V:[[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0]],
W:[[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1]],X:[[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]],
Y:[[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],Z:[[1,1,1,1,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],
'0':[[0,1,1,1,0],[1,0,0,1,1],[1,0,1,0,1],[1,1,0,0,1],[0,1,1,1,0]],'1':[[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
'2':[[1,1,1,1,0],[0,0,0,0,1],[0,1,1,1,0],[1,0,0,0,0],[1,1,1,1,1]],'3':[[1,1,1,1,0],[0,0,0,0,1],[0,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],
'4':[[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0]],'5':[[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],
'6':[[0,1,1,1,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0]],'7':[[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0]],
'8':[[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0]],'9':[[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,1,1,1,0]],
'-':[[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],' ':[[0,0],[0,0],[0,0],[0,0],[0,0]]};
const zooms=[1,2,4,6,8,10]; let zi=3;
const rc=$('rankCanvas'), rctx=rc.getContext('2d');
const pf=['bg','text','shadow','border'].map(k=>[$(k+'Color'),$(k+'ColorText')]);
function drawRank(){
  const raw=$('prefixName').value||'CEO';
  const text=[...raw.toUpperCase()].filter(c=>F[c]).join('')||'CEO';
  let tw=0; for(const c of text) tw+=F[c][0].length+1; tw-=1;
  const w=tw+8,h=12; rc.width=w; rc.height=h;
  const [bg,tc,sh,bd]=pf.map(p=>p[0].value);
  rctx.clearRect(0,0,w,h);
  rctx.fillStyle=bd; rctx.fillRect(1,0,w-2,h); rctx.fillRect(0,1,w,h-2);
  rctx.fillStyle=bg; rctx.fillRect(1,1,w-2,h-2);
  rctx.fillStyle=sh; rctx.fillRect(1,h-2,w-2,1);
  let x=4; const y=3;
  for(const c of text){
    const m=F[c];
    m.forEach((row,r)=>row.forEach((v,cc)=>{ if(v){ rctx.fillStyle='#1b1b1b'; rctx.fillRect(x+cc,y+r+1,1,1); rctx.fillStyle=tc; rctx.fillRect(x+cc,y+r,1,1);} }));
    x+=m[0].length+1;
  }
  rc.style.width=(w*zooms[zi])+'px'; rc.style.height=(h*zooms[zi])+'px';
  $('zoomVal').textContent=zooms[zi]+'x';
  const name=(text.toLowerCase().replace(/ /g,'_'))||'ceo';
  $('downloadFileName').textContent=name+'.png';
  $('ymlOutput').value=`${name}:\n  font: minecraft:default\n  texture: ranks/${name}\n  ascent: 8\n  height: 9`;
}
['#e11d2e','#ff7f00','#ffd400','#00c853','#00e5ff','#007fff','#ff00ff','#ffffff','#aaaaaa','#555555','#222222'].forEach(hex=>{
  const b=document.createElement('button'); b.className='color-dot'; b.style.background=hex; b.setAttribute('aria-label',hex);
  b.onclick=()=>{pf[0][0].value=hex;pf[0][1].value=hex;drawRank();}; $('colorPalette').appendChild(b);
});
pf.forEach(([p,t])=>{
  p.addEventListener('input',()=>{t.value=p.value;drawRank();});
  t.addEventListener('input',()=>{if(hexRe.test(t.value)){p.value=t.value;drawRank();}});
});
$('prefixName').addEventListener('input',drawRank);
$('zoomIn').onclick=()=>{zi=Math.min(zooms.length-1,zi+1);drawRank();};
$('zoomOut').onclick=()=>{zi=Math.max(0,zi-1);drawRank();};
$('downloadPngBtn').addEventListener('click',()=>{
  const a=document.createElement('a'); a.download=$('downloadFileName').textContent; a.href=rc.toDataURL('image/png'); a.click();
});
drawRank();

// ---------- MOTD ----------
const MC={'0':'#000000','1':'#0000aa','2':'#00aa00','3':'#00aaaa','4':'#aa0000','5':'#aa00aa','6':'#ffaa00','7':'#aaaaaa','8':'#555555','9':'#5555ff',a:'#55ff55',b:'#55ffff',c:'#ff5555',d:'#ff55ff',e:'#ffff55',f:'#ffffff'};
let active=$('motdLine1');
['motdLine1','motdLine2','motdHover'].forEach(id=>{$(id).addEventListener('focus',()=>active=$(id));$(id).addEventListener('input',updateMotd);});
function insertFmt(code){
  const s=active.selectionStart,e=active.selectionEnd,v=active.value;
  active.value=v.slice(0,s)+code+v.slice(e); active.focus();
  active.setSelectionRange(s+code.length,s+code.length); updateMotd();
}
Object.keys(MC).forEach(k=>{
  const b=document.createElement('button'); b.className='color-dot-mc'; b.style.background=MC[k]; b.title='&'+k; b.setAttribute('aria-label','&'+k);
  b.onclick=()=>insertFmt('&'+k); $('mcColorsPalette').appendChild(b);
});
document.querySelectorAll('[data-ins]').forEach(b=>b.addEventListener('click',()=>insertFmt(b.dataset.ins)));
function mcHtml(text){
  const st={c:'#ffffff',b:0,i:0,u:0,s:0};
  const frag=document.createDocumentFragment();
  for(let i=0;i<text.length;i++){
    if(text[i]==='&'&&i+1<text.length){
      const k=text[i+1].toLowerCase(); let hit=true;
      if(MC[k]){st.c=MC[k];st.b=st.i=st.u=st.s=0;}
      else if(k==='l')st.b=1; else if(k==='o')st.i=1; else if(k==='n')st.u=1; else if(k==='m')st.s=1;
      else if(k==='r'){st.c='#ffffff';st.b=st.i=st.u=st.s=0;}
      else if(k==='k'){} else hit=false;
      if(hit){i++;continue;}
    }
    const sp=document.createElement('span'); sp.textContent=text[i]===' '?'\u00a0':text[i]; sp.style.color=st.c;
    if(st.b)sp.style.fontWeight='bold'; if(st.i)sp.style.fontStyle='italic';
    const d=[st.u&&'underline',st.s&&'line-through'].filter(Boolean).join(' '); if(d)sp.style.textDecoration=d;
    frag.appendChild(sp);
  }
  return frag;
}
const toProps=t=>t.replace(/&([0-9a-fk-or])/gi,'\\u00A7$1');
function updateMotd(){
  const p=$('motdPreviewRender'); p.textContent='';
  p.appendChild(mcHtml($('motdLine1').value)); p.appendChild(document.createElement('br')); p.appendChild(mcHtml($('motdLine2').value));
  const h=$('motdHoverRender'); h.textContent='';
  $('motdHover').value.split('\n').forEach((l,i)=>{ if(i) h.appendChild(document.createElement('br')); h.appendChild(mcHtml(l)); });
  $('motdPropertiesOutput').value='motd='+toProps($('motdLine1').value)+'\\n'+toProps($('motdLine2').value);
}
$('copyMotdBtn').addEventListener('click',()=>copyText($('motdPropertiesOutput').value,$('copyMotdText')));
$('copyHoverBtn').addEventListener('click',()=>copyText($('motdHover').value,$('copyHoverText')));
updateMotd();

// ---------- PIXEL ART ----------
const pc=$('pixelartCanvas'), pctx=pc.getContext('2d'), N=16, PS=24;
const blank=()=>Array.from({length:N},()=>Array(N).fill(null));
let grid=blank(), undo=[], redo=[], tool='pencil', down=false, pz=24;
const snap=()=>JSON.parse(JSON.stringify(grid));
function save(){undo.push(snap()); if(undo.length>25)undo.shift(); redo=[];}
function setTool(t){
  tool=t; document.querySelectorAll('[data-ptool]').forEach(b=>b.classList.toggle('active',b.dataset.ptool===t));
}
document.querySelectorAll('[data-ptool]').forEach(b=>b.addEventListener('click',()=>setTool(b.dataset.ptool)));
function render(){
  pctx.clearRect(0,0,pc.width,pc.height);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++) if(grid[r][c]){pctx.fillStyle=grid[r][c];pctx.fillRect(c*PS,r*PS,PS,PS);}
  pctx.strokeStyle='rgba(255,255,255,.1)'; pctx.lineWidth=1; pctx.beginPath();
  for(let i=0;i<=N;i++){pctx.moveTo(i*PS+.5,0);pctx.lineTo(i*PS+.5,N*PS);pctx.moveTo(0,i*PS+.5);pctx.lineTo(N*PS,i*PS+.5);}
  pctx.stroke();
}
function fill(r,c,from,to){
  const q=[[r,c]];
  while(q.length){
    const [y,x]=q.pop();
    if(y<0||y>=N||x<0||x>=N||grid[y][x]!==from) continue;
    grid[y][x]=to; q.push([y+1,x],[y-1,x],[y,x+1],[y,x-1]);
  }
}
function paint(e){
  const rc2=pc.getBoundingClientRect();
  const c=Math.floor((e.clientX-rc2.left)/(rc2.width/N)), r=Math.floor((e.clientY-rc2.top)/(rc2.height/N));
  if(r<0||r>=N||c<0||c>=N) return;
  const col=$('pixelColorPicker').value;
  if(tool==='pencil') grid[r][c]=col;
  else if(tool==='eraser') grid[r][c]=null;
  else if(grid[r][c]!==col) fill(r,c,grid[r][c],col);
  render();
}
pc.addEventListener('pointerdown',e=>{e.preventDefault();down=true;pc.setPointerCapture(e.pointerId);save();paint(e);});
pc.addEventListener('pointermove',e=>{if(down&&tool!=='bucket')paint(e);});
['pointerup','pointercancel'].forEach(ev=>pc.addEventListener(ev,()=>down=false));
function doUndo(){if(undo.length){redo.push(snap());grid=undo.pop();render();}}
function doRedo(){if(redo.length){undo.push(snap());grid=redo.pop();render();}}
$('undoBtn').onclick=doUndo; $('redoBtn').onclick=doRedo;
$('clearBtn').onclick=()=>{save();grid=blank();render();};
function zoomPx(d){
  pz=Math.max(12,Math.min(36,pz+d*4)); $('pixelZoomVal').textContent=pz+'x';
  pc.style.width=pc.style.height=(N*pz)+'px';
}
$('pzIn').onclick=()=>zoomPx(1); $('pzOut').onclick=()=>zoomPx(-1);
$('downloadPixelArtBtn').addEventListener('click',()=>{
  const ex=document.createElement('canvas'); ex.width=ex.height=N; const x=ex.getContext('2d');
  for(let r=0;r<N;r++)for(let c=0;c<N;c++) if(grid[r][c]){x.fillStyle=grid[r][c];x.fillRect(c,r,1,1);}
  const a=document.createElement('a'); a.download='pixelart_icon.png'; a.href=ex.toDataURL('image/png'); a.click();
});
window.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  if($('pixelart-tool').classList.contains('active-tool')){
    const k=e.key.toLowerCase();
    if((e.ctrlKey||e.metaKey)&&k==='z'){e.preventDefault();doUndo();return;}
    if((e.ctrlKey||e.metaKey)&&k==='y'){e.preventDefault();doRedo();return;}
    if(k==='b')setTool('pencil'); if(k==='e')setTool('eraser'); if(k==='f')setTool('bucket');
  }
});
render();
})();

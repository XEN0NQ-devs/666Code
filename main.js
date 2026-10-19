(function(){
  const body=document.body, icon=document.getElementById('themeIcon');
  function setIcon(){ if(icon) icon.className=body.classList.contains('light-theme')?'fa-solid fa-moon':'fa-solid fa-sun'; }
  try{ if(localStorage.getItem('666_theme')==='light') body.classList.add('light-theme'); }catch(e){}
  setIcon();
  const tg=document.getElementById('themeToggle');
  if(tg) tg.addEventListener('click',()=>{
    body.classList.toggle('light-theme'); setIcon();
    try{ localStorage.setItem('666_theme',body.classList.contains('light-theme')?'light':'dark'); }catch(e){}
  });
  const mt=document.getElementById('menuToggle'), menu=document.querySelector('.nav-menu');
  if(mt&&menu){
    mt.addEventListener('click',()=>menu.classList.toggle('open'));
    menu.addEventListener('click',e=>{ if(e.target.closest('a')) menu.classList.remove('open'); });
  }
  // podświetlanie sekcji w menu (tylko strona główna)
  const secs=document.querySelectorAll('main section[id]');
  if(secs.length){
    const links={home:'nav-home',oferta:'nav-oferta',opinie:'nav-opinie'};
    const upd=()=>{
      const y=window.scrollY+200;
      secs.forEach(s=>{
        if(y>=s.offsetTop&&y<s.offsetTop+s.offsetHeight){
          Object.values(links).forEach(id=>{const l=document.getElementById(id); if(l) l.classList.remove('active');});
          const a=document.getElementById(links[s.id]); if(a) a.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll',upd); window.addEventListener('load',upd);
  }
  window.copyText=function(text,labelEl,msg){
    if(!text) return;
    const done=()=>{const o=labelEl.innerText; labelEl.innerText=msg||'Skopiowano!'; setTimeout(()=>labelEl.innerText=o,2000);};
    if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(text).then(done).catch(()=>fb()); } else fb();
    function fb(){const t=document.createElement('textarea'); t.value=text; document.body.appendChild(t); t.select(); try{document.execCommand('copy');}catch(e){} t.remove(); done();}
  };
})();

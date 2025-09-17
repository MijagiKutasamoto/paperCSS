/* PaperCSS interakcje – wersja uproszczona 0.3.0 (cleanup)
 * Naprawy:
 * - Usunięto zduplikowane IIFE powodujące błędy składni i redeklaracje
 * - Ujednolicono API: PaperToast, PaperProgress, PaperSkeleton, PaperOffcanvas, PaperAlert
 * - Poprawiono reveal (klasa .is-visible) i fallback .no-js
 */

// Skróty selektorów
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

document.documentElement.classList.remove('no-js');

/* ========================= SCROLL LOCK ========================= */
let scrollLockCount = 0;
function lockScroll() {
  scrollLockCount++; if (scrollLockCount === 1) { document.body.dataset.prevOverflow = document.body.style.overflow || ''; document.body.style.overflow='hidden'; }
}
function unlockScroll() {
  scrollLockCount = Math.max(0, scrollLockCount-1); if (!scrollLockCount) { document.body.style.overflow = document.body.dataset.prevOverflow || ''; delete document.body.dataset.prevOverflow; }
}

/* ========================= NAVBAR TOGGLE ========================= */
(() => {
  const navToggle = $('.navbar-toggle');
  const navMenu = $('.navbar-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }
})();

/* ========================= TABS ========================= */
(() => {
  $$('.tabs').forEach(tabs => {
    const buttons = $$('.tab-list button', tabs);
    const panels = $$('.tab-panel', tabs);
    
    // Ustaw tabindex dla fokus management
    buttons.forEach((btn, index) => {
      btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
    
    // Funkcja aktywacji taba
    function activateTab(targetButton) {
      const id = targetButton.getAttribute('data-tab');
      
      // Ustaw aria-selected i tabindex
      buttons.forEach(btn => {
        const isActive = btn === targetButton;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      
      // Przełącz panele
      panels.forEach(panel => {
        const active = panel.id === id;
        panel.classList.toggle('active', active);
        panel.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      
      // Focus na aktywnym tabie
      targetButton.focus();
    }
    
    // Obsługa kliknięć
    buttons.forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn));
    });
    
    // Obsługa klawiatury według WAI-ARIA APG
    buttons.forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        const currentIndex = buttons.indexOf(btn);
        let targetIndex = -1;
        
        switch(e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            targetIndex = (currentIndex + 1) % buttons.length;
            break;
            
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            targetIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            break;
            
          case 'Home':
            e.preventDefault();
            targetIndex = 0;
            break;
            
          case 'End':
            e.preventDefault();
            targetIndex = buttons.length - 1;
            break;
            
          case 'Enter':
          case ' ':
            e.preventDefault();
            activateTab(btn);
            return;
        }
        
        // Aktywuj nowy tab jeśli znaleziono target
        if (targetIndex >= 0) {
          activateTab(buttons[targetIndex]);
        }
      });
    });
  });
})();

/* ========================= ACCORDION ========================= */
(() => {
  $$('.accordion').forEach(acc => {
    $$('.accordion-item', acc).forEach(item => {
      const btn = item.querySelector('.accordion-button');
      const content = item.querySelector('.accordion-content');
      if (!btn || !content) return;
      btn.addEventListener('click', () => {
        const exp = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', (!exp).toString());
        content.classList.toggle('open', !exp);
      });
    });
  });
})();

/* ========================= MODALS ========================= */
(() => {
  function openModal(id){
    const backdrop=document.getElementById(id); if(!backdrop) return;
    const wasOpen = backdrop.classList.contains('open');
    backdrop.classList.add('open');
    if(!wasOpen) lockScroll();
    const f=backdrop.querySelector('button,[href],input,select,textarea,[tabindex]'); if(f) f.focus();
  }
  
  function closeModal(id){
    const backdrop = document.getElementById(id);
    if(!backdrop) return;
    if(backdrop.classList.contains('open')){
      backdrop.classList.remove('open');
      // Zawsze odblokuj scroll po zamknięciu modala
      unlockScroll();
    }
  }
  
  $$('[data-open-modal]').forEach(btn => btn.addEventListener('click',()=>openModal(btn.getAttribute('data-open-modal'))));
  $$('.modal-backdrop').forEach(b => {
    b.addEventListener('click', e => { if(e.target===b) closeModal(b.id); });
    const c=b.querySelector('.modal-close'); if(c) c.addEventListener('click',()=>closeModal(b.id));
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ const opened=[...document.querySelectorAll('.modal-backdrop.open')]; if(opened.length) closeModal(opened.at(-1).id); }});
})();

/* ========================= OFFCANVAS ========================= */
(() => {
  function open(id){
    const backdrop=$(`#${id}-backdrop`); const panel=$(`#${id}`); if(!backdrop||!panel) return;
    const wasOpen = panel.classList.contains('show');
    backdrop.classList.add('show'); panel.classList.add('show');
    if(!wasOpen) lockScroll();
    const f=panel.querySelector('button,[href],input,select,textarea,[tabindex]'); if(f) f.focus();
  }
  function close(id){ const backdrop=$(`#${id}-backdrop`); const panel=$(`#${id}`); if(!backdrop||!panel) return; backdrop.classList.remove('show'); panel.classList.remove('show'); unlockScroll(); }
  $$('[data-open-offcanvas]').forEach(btn=>btn.addEventListener('click',()=>open(btn.getAttribute('data-open-offcanvas'))));
  $$('.offcanvas-backdrop').forEach(b=>b.addEventListener('click',e=>{ if(e.target===b){ close(b.id.replace('-backdrop','')); }}));
  $$('.offcanvas-close').forEach(btn=>btn.addEventListener('click',()=>{ const p=btn.closest('.offcanvas'); if(p) close(p.id); }));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ const openPanel=document.querySelector('.offcanvas.show'); if(openPanel) close(openPanel.id); }});
  window.PaperOffcanvas = { open, close };
})();

/* ========================= DROPDOWN ========================= */
(() => {
  $$('.dropdown').forEach(drop => {
    const toggle = drop.querySelector('[data-dropdown-toggle]');
    const menu = drop.querySelector('.dropdown-menu');
    if(!toggle||!menu) return;
    
    toggle.addEventListener('click', e => { 
      e.preventDefault(); 
      e.stopPropagation(); 
      
      // Close other dropdowns first
      $$('.dropdown.show').forEach(other => {
        if(other !== drop) other.classList.remove('show');
      });
      
      if(!drop.classList.contains('show')) {
        drop.classList.add('show');
        
        // Position adjustment for viewport edges
        const rect = menu.getBoundingClientRect();
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        
        // Reset any previous positioning
        menu.style.left = '';
        menu.style.right = '';
        menu.style.top = '';
        menu.style.bottom = '';
        menu.removeAttribute('data-align');
        menu.removeAttribute('data-direction');
        drop.removeAttribute('data-direction');
        
        // Check right edge
        if(rect.right > viewport.width - 20) {
          menu.setAttribute('data-align', 'right');
        }
        
        // Check bottom edge - if too close, flip upward
        if(rect.bottom > viewport.height - 20) {
          drop.setAttribute('data-direction', 'up');
        }
      } else {
        drop.classList.remove('show');
      }
    });
    
    document.addEventListener('click', e => { 
      if(!drop.contains(e.target)) drop.classList.remove('show'); 
    });
    
    document.addEventListener('keydown', e => { 
      if(e.key==='Escape' && drop.classList.contains('show')) { 
        drop.classList.remove('show'); 
        toggle.focus(); 
      }
    });
  });
})();

/* ========================= CHIP CLOSE ========================= */
(() => { $$('.chip-close').forEach(btn=>btn.addEventListener('click',e=>{ e.stopPropagation(); const chip=btn.closest('.chip'); if(!chip) return; chip.style.opacity='0'; chip.style.transform='scale(.85)'; setTimeout(()=>chip.remove(),180); })); })();

/* ========================= PROGRESS API ========================= */
(() => { 
  function animate(selector, target, duration=1000){ 
    const el = document.querySelector(selector); 
    if(!el) return; 
    
    // Reset starting position
    el.style.width = '0%';
    
    let start = null;
    function step(timestamp) {
      if(!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = progress * target;
      
      el.style.width = current + '%';
      
      if(progress < 1) {
        requestAnimationFrame(step);
      }
    }
    
    requestAnimationFrame(step);
  } 
  
  function set(selector, value) {
    const el = document.querySelector(selector);
    if(!el) return;
    el.style.width = value + '%';
  }
  
  window.PaperProgress = { animate, set }; 
})();

/* ========================= SKELETON ========================= */
(() => { function create(type='text', count=3){ const wrap=document.createElement('div'); for(let i=0;i<count;i++){ const s=document.createElement('div'); s.className=`skeleton skeleton-${type}`; wrap.appendChild(s);} return wrap; } function show(sel){ const el=document.querySelector(sel); if(!el||el.dataset.originalContent) return; el.dataset.originalContent = el.innerHTML; el.innerHTML=''; el.appendChild(create()); } function hide(sel){ const el=document.querySelector(sel); if(!el||!el.dataset.originalContent) return; el.innerHTML=el.dataset.originalContent; delete el.dataset.originalContent; } window.PaperSkeleton={ show, hide, create }; })();

/* ========================= TOASTY ========================= */
(() => {
  let container=null; let id=0;
  function ensure(){ if(!container){ container=document.createElement('div'); container.className='toast-container'; container.setAttribute('aria-live','polite'); document.body.appendChild(container);} return container; }
  function build(message,type,opts={}){
    const { title=null, duration=5000, closable=true, showProgress=true } = opts;
    const c=ensure(); const toast=document.createElement('div'); const tid=`toast-${++id}`; toast.className=`toast toast-${type}`; toast.id=tid; toast.setAttribute('role','alert'); toast.setAttribute('aria-live','polite');
    let html=''; if(title) html+=`<div class="toast-header">${title}</div>`; html+=`<div class="toast-body">${message}</div>`; if(closable) html+='<button class="toast-close" aria-label="Zamknij">×</button>'; if(showProgress && duration>0) html+='<div class="toast-progress"></div>';
    toast.innerHTML=html; c.appendChild(toast); requestAnimationFrame(()=>toast.classList.add('show'));
    if(closable){ toast.querySelector('.toast-close').addEventListener('click',()=>remove(tid)); }
    if(showProgress && duration>0){ const bar=toast.querySelector('.toast-progress'); if(bar){ bar.style.width='100%'; bar.style.transitionDuration=duration+'ms'; requestAnimationFrame(()=>bar.style.width='0%'); }}
    if(duration>0){ setTimeout(()=>remove(tid), duration); }
    return tid;
  }
  function remove(tid){ const t=document.getElementById(tid); if(!t) return; t.classList.add('hide'); setTimeout(()=>{ t.remove(); if(container && !container.children.length){ container.remove(); container=null;} },380); }
  const api = {
    show:(m,o)=>build(m,'info',o||{}),
    success:(m,o)=>build(m,'success',o||{}),
    warning:(m,o)=>build(m,'warning',o||{}),
    error:(m,o)=>build(m,'danger',o||{}),
    remove
  };
  window.PaperToast = api;
})();

/* ========================= ALERT (dynamic) ========================= */
(() => {
  function create(message, type='info', dismissible=true){
    const el=document.createElement('div'); el.className=`alert alert-${type}${dismissible?' alert-dismissible':''}`; el.innerHTML=`${message}${dismissible?'<button class="alert-close" aria-label="Zamknij alert">×</button>':''}`; if(dismissible){ el.querySelector('.alert-close').addEventListener('click',()=>dismiss(el)); } return el;
  }
  function dismiss(el){ el.style.opacity='0'; el.style.transform='translateY(-8px)'; setTimeout(()=>el.remove(),180); }
  window.PaperAlert={ create, show:(msg,type='info',dismissible=true)=>{ const a=create(msg,type,dismissible); document.body.appendChild(a); return a; } };
  $$('.alert-close').forEach(btn=>btn.addEventListener('click',()=>{ const a=btn.closest('.alert'); if(a) dismiss(a); }));
})();

/* ========================= FILTER BUTTONS ========================= */
(() => { $$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{ const group=btn.closest('.filter-group'); if(!group) return; btn.classList.toggle('active'); group.dispatchEvent(new CustomEvent('filterChange',{ detail:{ filter:btn.textContent.trim(), active:btn.classList.contains('active') } })); })); })();

/* ========================= THEME TOGGLE ========================= */
(() => { const toggle=$('[data-theme-toggle]'); if(!toggle) return; const label=toggle.querySelector('[data-theme-label]'); function setTheme(next){ document.documentElement.setAttribute('data-theme', next); localStorage.setItem('paper-theme', next); if(label) label.textContent = next==='dark' ? 'Jasny':'Ciemny'; }
  const saved=localStorage.getItem('paper-theme'); if(saved) setTheme(saved); toggle.addEventListener('click',()=>{ const isDark=document.documentElement.getAttribute('data-theme')==='dark'; setTheme(isDark?'light':'dark'); }); })();

/* ========================= SCROLL PROGRESS ========================= */
(() => { const bar=$('#scrollProgress'); if(!bar) return; function update(){ const st=window.scrollY||document.documentElement.scrollTop; const h=document.documentElement.scrollHeight - window.innerHeight; const p=h>0?(st/h)*100:0; bar.style.width=p+'%'; if(p>97) bar.dataset.complete='true'; else delete bar.dataset.complete; } window.addEventListener('scroll', update, {passive:true}); update(); })();

/* ========================= SCROLLSPY + NAVBAR ELEVATION ========================= */
(() => { const navbar=$('.navbar'); if(!navbar) return; const navLinks=[...navbar.querySelectorAll('a[href^="#"]')]; const sections=navLinks.map(l=>{ const id=l.getAttribute('href').slice(1); const s=document.getElementById(id); return s?{link:l, section:s}:null; }).filter(Boolean); const spy=new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting){ sections.forEach(s=>s.link.classList.remove('is-active')); const item=sections.find(s=>s.section===en.target); if(item) item.link.classList.add('is-active'); }}); }, { rootMargin:'-45% 0px -45% 0px', threshold:0 }); sections.forEach(s=>spy.observe(s.section)); function elev(){ navbar.setAttribute('data-scroll-elevated', (window.scrollY>8).toString()); } window.addEventListener('scroll', elev, {passive:true}); elev(); })();

/* ========================= BACK TO TOP ========================= */
(() => { const btn=$('#backToTop'); if(!btn) return; btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'})); function toggle(){ btn.classList.toggle('visible', window.scrollY > window.innerHeight*0.4); } window.addEventListener('scroll', toggle, {passive:true}); toggle(); })();

/* ========================= REVEAL ========================= */
(() => { const items=$$('[data-reveal]'); if(!items.length) return; const io=new IntersectionObserver(ents=>{ ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); setTimeout(()=>{ e.target.style.willChange='auto'; },800); io.unobserve(e.target); } }); }, { threshold:0.18, rootMargin:'0px 0px -5% 0px' }); items.forEach(el=>io.observe(el)); })();

/* ========================= DEMO SUBMIT LOADER ========================= */
(() => { $$('.demo-submit').forEach(btn=>btn.addEventListener('click',()=>{ if(!btn.querySelector('.btn__content')){ const label=document.createElement('span'); label.className='btn__content'; label.textContent=btn.textContent.trim(); const sp=document.createElement('span'); sp.className='btn__spinner'; btn.textContent=''; btn.append(label, sp);} btn.classList.add('is-loading'); btn.setAttribute('aria-busy','true'); btn.setAttribute('disabled','true'); setTimeout(()=>{ btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); btn.removeAttribute('disabled'); btn.classList.remove('btn-submit'); btn.classList.add('btn-success'); const c=btn.querySelector('.btn__content'); if(c) c.textContent='Gotowe!'; },1500); })); })();

/* ========================= TOOLTIP (data-tip) ========================= */
(() => { let tipEl; function ensure(){ if(!tipEl){ tipEl=document.createElement('div'); tipEl.className='tooltip-float'; document.body.appendChild(tipEl);} return tipEl; } function pos(el){ const r=el.getBoundingClientRect(); tipEl.style.top=(r.top+window.scrollY-8)+'px'; tipEl.style.left=(r.left+r.width/2)+'px'; }
  document.addEventListener('pointerover',e=>{ const el=e.target.closest('[data-tip]'); if(el){ const t=ensure(); t.textContent=el.getAttribute('data-tip'); pos(el); requestAnimationFrame(()=>t.style.opacity='1'); }});
  document.addEventListener('pointermove',e=>{ const el=e.target.closest('[data-tip]'); if(el&&tipEl) pos(el); });
  document.addEventListener('pointerout',e=>{ if(tipEl && !e.relatedTarget?.closest('[data-tip]')) tipEl.style.opacity='0'; }); })();

/* ========================= FILTER BUTTONS ========================= */
(() => {
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.filter-group');
      if(!group) return;
      
      // Remove active from siblings
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      
      // Add active to clicked
      btn.classList.add('active');
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('filterChange', {
        detail: { filter: btn.textContent, button: btn }
      }));
    });
  });
})();

// Koniec – powodzenia!
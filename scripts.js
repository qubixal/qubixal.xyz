/* ── CURSOR ── */
(function(){
    const STORAGE_KEY = 'qubixal-cursor';
    const saved = localStorage.getItem(STORAGE_KEY);
    const cursorEnabled = saved === null ? true : saved === 'true';
    function applyCursorState(enabled){
        const dot = document.getElementById('c-dot');
        const ring = document.getElementById('c-ring');
        if(enabled){
            document.body.classList.add('hide-cursor');
            if(dot){ dot.style.display='block'; dot.style.opacity='0'; }
            if(ring){ ring.style.display='block'; ring.style.opacity='0'; }
        } else {
            document.body.classList.remove('hide-cursor');
            if(dot){ dot.style.display='none'; dot.style.opacity='0'; }
            if(ring){ ring.style.display='none'; ring.style.opacity='0'; }
        }
        const btn = document.getElementById('cursor-toggle');
        if(btn){ btn.classList.toggle('on', enabled); btn.classList.toggle('off', !enabled); }
    }
    if(window.matchMedia("(any-pointer: fine)").matches){
        applyCursorState(cursorEnabled);
        if(cursorEnabled){
            const dot = document.getElementById('c-dot');
            const ring = document.getElementById('c-ring');
            if(!dot||!ring) return;
            let mx=0,my=0,rx=0,ry=0,isMoving=false;
            document.addEventListener('mousemove',e=>{
                if(!isMoving){rx=e.clientX;ry=e.clientY;dot.style.opacity='1';ring.style.opacity='1';isMoving=true}
                mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';
            });
            (function animRing(){rx+=(mx-rx)*0.11;ry+=(my-ry)*0.11;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();
        }
    } else { applyCursorState(false); }

    // ── CURSOR TOGGLE BUTTON ──
    const cursorToggleBtn = document.getElementById('cursor-toggle');
    if(cursorToggleBtn){
        const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
        const _themeSaved = localStorage.getItem('qubixal-theme');
        const isDark = _themeSaved === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark';
        const cursorOnSrc = isDark ? 'assets/cursor-light.svg' : 'assets/cursor-dark.svg';
        if(!hasFinePointer){
            cursorToggleBtn.classList.add('disabled','off');
            cursorToggleBtn.setAttribute('aria-disabled','true');
            cursorToggleBtn.title = 'Custom cursor not available on this device';
        } else {
            const offSrcInit = isDark ? 'assets/cursor-off-light.svg' : 'assets/cursor-off.svg';
            if(cursorEnabled){
                cursorToggleBtn.classList.remove('off');cursorToggleBtn.classList.add('on');
                cursorToggleBtn.querySelector('.ct-icon-on').src=cursorOnSrc;
                cursorToggleBtn.querySelector('.ct-icon-off').src=offSrcInit;
                cursorToggleBtn.title='Custom cursor: on';
            } else {
                cursorToggleBtn.classList.add('off');cursorToggleBtn.classList.remove('on');
                cursorToggleBtn.querySelector('.ct-icon-off').src=offSrcInit;
                cursorToggleBtn.title='Custom cursor: off';
            }
            cursorToggleBtn.addEventListener('click',()=>{
                const c=localStorage.getItem(STORAGE_KEY);const n=!(c===null?true:c==='true');localStorage.setItem(STORAGE_KEY,n);applyCursorState(n);
                const nowDark=document.documentElement.getAttribute('data-theme')==='dark';
                const newSrc=nowDark?'assets/cursor-light.svg':'assets/cursor-dark.svg';
                const offSrc=nowDark?'assets/cursor-off-light.svg':'assets/cursor-off.svg';
                if(n){cursorToggleBtn.classList.remove('off');cursorToggleBtn.classList.add('on');cursorToggleBtn.querySelector('.ct-icon-on').src=newSrc;cursorToggleBtn.querySelector('.ct-icon-off').src=offSrc;cursorToggleBtn.title='Custom cursor: on'}
                else{cursorToggleBtn.classList.add('off');cursorToggleBtn.classList.remove('on');cursorToggleBtn.title='Custom cursor: off'}
                if(n)location.reload();
            });
        }
    }
})();

// ── THEME TOGGLE ──
(function(){
    const THEME_KEY='qubixal-theme';
    const savedTheme=localStorage.getItem(THEME_KEY);
    if(savedTheme==='dark'){document.documentElement.setAttribute('data-theme','dark')}
    const navFrame=document.getElementById('nav-frame');
    if(navFrame&&savedTheme==='dark'){navFrame.src='assets/frame-white.png'}
    const themeBtn=document.getElementById('theme-toggle');
    if(themeBtn){themeBtn.addEventListener('click',()=>{
        const wasDark=document.documentElement.getAttribute('data-theme')==='dark';
        if(wasDark){document.documentElement.removeAttribute('data-theme');localStorage.setItem(THEME_KEY,'light');}
        else{document.documentElement.setAttribute('data-theme','dark');localStorage.setItem(THEME_KEY,'dark');}
        const nowDark=!wasDark;
        const newOnSrc=nowDark?'assets/cursor-light.svg':'assets/cursor-dark.svg';
        const newOffSrc=nowDark?'assets/cursor-off-light.svg':'assets/cursor-off.svg';
        const cursorBtn=document.getElementById('cursor-toggle');
        if(cursorBtn){cursorBtn.querySelector('.ct-icon-on').src=newOnSrc;cursorBtn.querySelector('.ct-icon-off').src=newOffSrc;}
        const nf=document.getElementById('nav-frame');if(nf){nf.src=wasDark?'assets/frame.png':'assets/frame-white.png';}
    });}
})();

// ── NAV MORE (desktop hover + click) ──
(function(){
    const navMore=document.getElementById('nav-more');
    const navMain=document.getElementById('nav-main');
    const btn=navMore?navMore.querySelector('.nav-more-btn'):null;
    if(!navMore||!navMain||!btn) return;
    let closeTimer=null;
    let isOpen=false;
    function openNav(){clearTimeout(closeTimer);if(!isOpen){navMain.classList.add('open');isOpen=true;btn.setAttribute('aria-expanded','true');}}
    function closeNav(){closeTimer=setTimeout(()=>{navMain.classList.remove('open');isOpen=false;btn.setAttribute('aria-expanded','false');},200);}
    function toggleNav(){if(isOpen){closeNav();}else{openNav();}}
    // Hover
    navMore.addEventListener('mouseenter',openNav);
    navMore.addEventListener('mouseleave',closeNav);
    // Click
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleNav();});
    // Close on outside click
    document.addEventListener('click',function(e){if(isOpen&&!navMore.contains(e.target)){navMain.classList.remove('open');isOpen=false;btn.setAttribute('aria-expanded','false');}});
    const reveal=navMain.querySelector('.nav-pages-reveal');
    if(reveal){reveal.addEventListener('mouseenter',()=>clearTimeout(closeTimer));reveal.addEventListener('mouseleave',closeNav);}
})();

// ── MOBILE NAV TOGGLE ──
(function(){
    const t=document.querySelector('.nav-toggle');
    const m=document.getElementById('main-nav');
    if(!t||!m)return;
    t.addEventListener('click',()=>{const o=m.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');});
    m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');t.setAttribute('aria-expanded','false');}));
})();

// ── MOBILE SUBMENU TOGGLE ──
(function(){
    document.querySelectorAll('.has-sub-mobile .sub-toggle').forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            e.preventDefault();const p=btn.closest('.has-sub-mobile');if(!p)return;const o=p.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false');const s=p.querySelector('.sub-links');if(s)s.setAttribute('aria-hidden',o?'false':'true');
        });
    });
})();

// ── FOOTER AVOIDANCE ──
(function(){
    const dock=document.getElementById('toggle-dock');
    const backTop=document.getElementById('back-top');
    const footer=document.querySelector('footer');
    if(!footer)return;
    const observer=new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if(e.isIntersecting){if(dock)dock.classList.add('above-footer');if(backTop)backTop.classList.add('above-footer');}
            else{if(dock)dock.classList.remove('above-footer');if(backTop)backTop.classList.remove('above-footer');}
        });
    },{threshold:0.1});
    observer.observe(footer);
})();

// ── HOVERING CLASS ──
document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));});

// ── GSAP SCROLL REVEALS ──
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.reveal').forEach((el,i)=>{
    const inHero=el.closest('#hero');
    gsap.fromTo(el,{opacity:0,y:22},{opacity:1,y:0,duration:.75,ease:'power2.out',delay:inHero?i*0.1:0,scrollTrigger:inHero?null:{trigger:el,start:'top 90%',once:true}});
});

// ── VERSION NUMBER ──
const now=new Date();const ver=document.getElementById('ver-num');if(ver)ver.textContent=`v0.${now.getFullYear()-2000}.${String(now.getMonth()+1).padStart(2,'0')}`;

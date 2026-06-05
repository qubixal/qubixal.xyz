// ── THEME INIT ──
(function(){
    const savedTheme=localStorage.getItem('qubixal-theme');
    if(savedTheme==='dark'){document.documentElement.setAttribute('data-theme','dark')}
    const navFrame=document.getElementById('nav-frame');
    if(navFrame&&savedTheme==='dark'){navFrame.src='assets/frame-white.png'}
    const themeBtn=document.getElementById('theme-toggle');
    if(themeBtn){themeBtn.addEventListener('click',()=>{
        const wasDark=document.documentElement.getAttribute('data-theme')==='dark';
        if(wasDark){document.documentElement.removeAttribute('data-theme');localStorage.setItem('qubixal-theme','light');}
        else{document.documentElement.setAttribute('data-theme','dark');localStorage.setItem('qubixal-theme','dark');}
        const nowDark=!wasDark;
        const newOnSrc=nowDark?'assets/cursor-light.svg':'assets/cursor-dark.svg';
        const newOffSrc=nowDark?'assets/cursor-off-light.svg':'assets/cursor-off.svg';
        const cursorBtn=document.getElementById('cursor-toggle');
        if(cursorBtn){cursorBtn.querySelector('.ct-icon-on').src=newOnSrc;cursorBtn.querySelector('.ct-icon-off').src=newOffSrc;}
        const nf=document.getElementById('nav-frame');if(nf){nf.src=wasDark?'assets/frame.png':'assets/frame-white.png';}
    });}
})();

// ── CURSOR INIT ──
(function(){
    const STORAGE_KEY='qubixal-cursor';
    const cursorEnabled=localStorage.getItem(STORAGE_KEY)===null?true:localStorage.getItem(STORAGE_KEY)==='true';
    const hasFinePointer=window.matchMedia("(any-pointer: fine)").matches;

    function applyCursorState(enabled){
        const dot=document.getElementById('c-dot');
        const ring=document.getElementById('c-ring');
        if(enabled){
            document.body.classList.add('hide-cursor');
            if(dot){dot.style.display='block';dot.style.opacity='0';}
            if(ring){ring.style.display='block';ring.style.opacity='0';}
            document.body.style.cursor='none';
        } else {
            document.body.classList.remove('hide-cursor');
            if(dot){dot.style.display='none';dot.style.opacity='0';}
            if(ring){ring.style.display='none';ring.style.opacity='0';}
            document.body.style.cursor='default';
        }
        const btn=document.getElementById('cursor-toggle');
        if(btn){btn.classList.toggle('on',enabled);btn.setAttribute('aria-pressed',enabled?'true':'false');}
    }

    if(hasFinePointer){
        applyCursorState(cursorEnabled);
        if(cursorEnabled){
            const dot=document.getElementById('c-dot');
            const ring=document.getElementById('c-ring');
            if(!dot||!ring) return;
            let mx=0,my=0,rx=0,ry=0,isMoving=false,rafId=null;
            document.addEventListener('mousemove',e=>{
                if(!isMoving){rx=e.clientX;ry=e.clientY;dot.style.opacity='1';ring.style.opacity='1';isMoving=true}
                mx=e.clientX;my=e.clientY;
                if(!rafId){
                    rafId=requestAnimationFrame(()=>{
                        dot.style.left=mx+'px';dot.style.top=my+'px';
                        rx+=(mx-rx)*0.11;ry+=(my-ry)*0.11;
                        ring.style.left=rx+'px';ring.style.top=ry+'px';
                        rafId=null;
                    });
                }
            });
        }
    } else { applyCursorState(false); }

    // Cursor toggle button
    const cursorToggleBtn=document.getElementById('cursor-toggle');
    if(cursorToggleBtn){
        const _themeSaved=localStorage.getItem('qubixal-theme');
        const isDark=_themeSaved==='dark'||document.documentElement.getAttribute('data-theme')==='dark';
        const cursorOnSrc=isDark?'assets/cursor-light.svg':'assets/cursor-dark.svg';
        if(!hasFinePointer){
            cursorToggleBtn.classList.add('disabled','off');
            cursorToggleBtn.setAttribute('aria-disabled','true');
            cursorToggleBtn.title='Custom cursor not available on this device';
        } else {
            const offSrcInit=isDark?'assets/cursor-off-light.svg':'assets/cursor-off.svg';
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

// ── NAV (MORE, Desktop) ──
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
    navMore.addEventListener('mouseenter',openNav);
    navMore.addEventListener('mouseleave',closeNav);
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleNav();});
    document.addEventListener('click',function(e){if(isOpen&&!navMore.contains(e.target)){navMain.classList.remove('open');isOpen=false;btn.setAttribute('aria-expanded','false');}});
    const reveal=navMain.querySelector('.nav-pages-reveal');
    if(reveal){reveal.addEventListener('mouseenter',()=>clearTimeout(closeTimer));reveal.addEventListener('mouseleave',closeNav);}
})();

// ── NAV (Mobile) ──
(function(){
    const t=document.querySelector('.nav-toggle');
    const m=document.getElementById('main-nav');
    if(!t||!m)return;
    t.addEventListener('click',()=>{const o=m.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');});
    m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');t.setAttribute('aria-expanded','false');}));
})();

// ── NAV (MORE, Mobile) ──
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

// ── VERSION NUMBER ──
const now=new Date();const ver=document.getElementById('ver-num');if(ver)ver.textContent=`v0.${now.getFullYear()-2000}.${String(now.getMonth()+1).padStart(2,'0')}`;

// ── NAV BACKGROUND ON SCROLL ──
const backTop=document.getElementById('back-top');
window.addEventListener('scroll',()=>{
    const nav=document.querySelector('nav');
    if(window.scrollY>60){
        nav.style.background='var(--bg)';
        nav.style.boxShadow='0 1px 0 var(--pale)';
    } else {
        nav.style.background='linear-gradient(to bottom,var(--bg) 60%,transparent)';
        nav.style.boxShadow='none';
    }
    if(backTop){
        if(window.scrollY>400){backTop.classList.add('visible')}
        else{backTop.classList.remove('visible')}
    }
});
if(backTop){backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}))}

// ── MODEL VIEWER ──
(function(){
    const cubeWrap=document.querySelector('.cube-wrap');
    if(!cubeWrap)return;
    const observer=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                const script=document.createElement('script');
                script.type='module';
                script.src='https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
                script.onload=function(){
                    // lazy load
                    const mv=document.getElementById('mv');
                    if(mv){
                        mv.cameraTarget='0m 0m 0m';
                        mv.addEventListener('camera-change',function(){
                            try{mv.cameraTarget='0m 0m 0m';}catch(e){}
                        });
                        try{mv.exposure=0.8;mv.shadowIntensity=2;}catch(e){}
                    }
                };
                document.body.appendChild(script);
                observer.disconnect();
            }
        });
    },{rootMargin:'200px'});
    observer.observe(cubeWrap);
})();

// ── GSAP REVEAL animations ──
function initGsap(){
    if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined'){
        setTimeout(initGsap,100);
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach((el,i)=>{
        const inHero=el.closest('#hero');
        gsap.fromTo(el,{opacity:0,y:22},{opacity:1,y:0,duration:.75,ease:'power2.out',delay:inHero?i*0.1:0,scrollTrigger:inHero?null:{trigger:el,start:'top 90%',once:true}});
    });
    document.querySelectorAll('.sk-fill').forEach(bar=>{
        const w=bar.style.width;
        bar.style.width='0';
        ScrollTrigger.create({
            trigger:bar,start:'top 88%',once:true,
            onEnter:()=>{gsap.to(bar,{width:w,duration:1.1,ease:'power2.out',delay:Math.random()*.3});}
        });
    });
}

if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(initGsap,50));
} else {
    setTimeout(initGsap,50);
}

// ── HERO SCRAMBLE ──
const SCRAMBLE_CHARS="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}\\/|!?+-=*#%&";
const CHINESE_SCRAMBLE="你嫌贵我还嫌贵呢！到底买不？这瓜皮是金子做的"; // 找到此彩蛋时可以dm我说“卖瓜吗”，我会给你一个小奖励（可能是个表情包）(不过也可能没有)

function decodeElement(el,delay=0){
    const finalText=el.dataset.final;
    if(!finalText)return;
    setTimeout(()=>{
        let iteration=0;
        const interval=setInterval(()=>{
            el.textContent=finalText.split("").map((char,index)=>{
                if(index<iteration)return finalText[index];
                if(char===" ")return" ";
                if(/[\u4e00-\u9fff]/.test(char))return CHINESE_SCRAMBLE[Math.floor(Math.random()*CHINESE_SCRAMBLE.length)];
                return SCRAMBLE_CHARS[Math.floor(Math.random()*SCRAMBLE_CHARS.length)];
            }).join("");
            iteration+=0.45;
            if(iteration>=finalText.length){el.textContent=finalText;clearInterval(interval);}
        },20);
    },delay);
}

window.addEventListener("load",()=>{
    decodeElement(document.getElementById("hero-line-2"),2);
    decodeElement(document.getElementById("hero-line-3"),2);
    decodeElement(document.getElementById("hero-sub"),2);
});

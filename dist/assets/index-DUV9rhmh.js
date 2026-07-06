(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=2e3,t=new WeakMap;function n(t){let n=t.dataset.timeout,r=n?Number(n):NaN;return Number.isFinite(r)&&r>0?r:e}function r(e){let r=t.get(e);r&&window.clearInterval(r.timer);let i=e.classList.contains(`carousel-tall`),a=Array.from(e.querySelectorAll(`img`)).map(e=>e.getAttribute(`src`)??``);if(a.length===0)return;e.textContent=``;let o=a.map((t,n)=>{let r=document.createElement(`img`);return r.src=t,r.className=`slide-item ${i?`slide-item-tall`:``} ${n===0?`fade-in`:`fade-out`}`,e.appendChild(r),r}),s=n(e),c=0,l=window.setInterval(()=>{o[c].classList.remove(`fade-in`),o[c].classList.add(`fade-out`),c=c+1>=o.length?0:c+1,o[c].classList.remove(`fade-out`),o[c].classList.add(`fade-in`)},s);t.set(e,{container:e,images:o,timer:l})}function i(e=document){e.querySelectorAll(`.carousel-wrapper`).forEach(r)}var a={"marquee-left-to-right":`ltr`,"marquee-ltr":`ltr`,"marquee-right-to-left":`rtl`,"marquee-rtl":`rtl`,"marquee-top-to-bottom":`ttb`,"marquee-ttb":`ttb`,"marquee-bottom-to-top":`btt`,"marquee-btt":`btt`},o={"marquee-slow":60,"marquee-normal":120,"marquee-fast":220},s=`rtl`,c=120,l=.6,u=.5,d=new WeakMap,f=new Set,p=null;function m(e){for(let t in a)if(e.classList.contains(t))return a[t];return s}function h(e){for(let t in o)if(e.classList.contains(t))return o[t];return c}function g(e){f.add(e),p===null&&(p=requestAnimationFrame(()=>{p=null;let e=Array.from(f);f.clear();for(let t of e)v(t)}))}function _(e){let t=d.get(e);t&&t.resizeObserver.disconnect();let n=m(e),r=n===`ttb`||n===`btt`?`y`:`x`,i=e.textContent?.trim()??``;e.textContent=``,e.dataset.marqueeAxis=r;let a=document.createElement(`div`);a.className=`marquee-track`;let o=document.createElement(r===`x`?`span`:`div`);o.className=`marquee-segment`,o.textContent=i,a.appendChild(o),e.appendChild(a);let s=new ResizeObserver(()=>g(e));s.observe(e),d.set(e,{container:e,track:a,direction:n,axis:r,resizeObserver:s}),g(e)}function v(e){let t=d.get(e);if(!t)return;let{track:n,direction:r,axis:i}=t,a=Array.from(n.children);if(a.length===0)return;let o=a[0],s=i===`x`?e.clientWidth:e.clientHeight,c=i===`x`?e.clientHeight:e.clientWidth;if(s===0||c===0)return;let f=Math.max(8,c*l),p=f*u;n.style.fontSize=`${f}px`;for(let e of a)i===`x`?(e.style.marginRight=`${p}px`,e.style.marginBottom=``):(e.style.marginBottom=`${p}px`,e.style.marginRight=``);let m=(i===`x`?o.offsetWidth:o.offsetHeight)+p;if(m===0)return;let g=Math.max(2,Math.ceil(s/m)+1);for(;n.children.length<g;)n.appendChild(o.cloneNode(!0));for(;n.children.length>g;)n.removeChild(n.lastElementChild);let _=m/h(e),v=r===`ltr`||r===`ttb`;n.style.setProperty(`--marquee-distance`,`${-m}px`),n.style.animationName=i===`x`?`marquee-scroll-x`:`marquee-scroll-y`,n.style.animationDuration=`${_}s`,n.style.animationTimingFunction=`linear`,n.style.animationIterationCount=`infinite`,n.style.animationDirection=v?`reverse`:`normal`,n.style.animationPlayState=`running`}function y(e=document){e.querySelectorAll(`.marquee`).forEach(_)}function b(e,t=document){return Array.from(t.querySelectorAll(e))}function x(e,t=document){let n=t.querySelector(e);if(!n)throw Error(`Required element not found: "${e}"`);return n}function S(e,t){let n=document.createElement(e);if(!t)return n;if(t.id&&(n.id=t.id),t.class){let e=Array.isArray(t.class)?t.class:t.class.split(` `).filter(Boolean);n.classList.add(...e)}if(t.style&&Object.assign(n.style,t.style),t.attrs)for(let[e,r]of Object.entries(t.attrs))n.setAttribute(e,r);if(t.data)for(let[e,r]of Object.entries(t.data))n.dataset[e]=r;if(t.props&&Object.assign(n,t.props),t.text==null?t.html!=null&&(n.innerHTML=t.html):n.textContent=t.text,t.children&&n.append(...t.children),t.on)for(let[e,r]of Object.entries(t.on))n.addEventListener(e,r);return n}var C=`data-viewport-classes`,ee=`(max-width: 1024px)`;function w(e){return e.split(/\s+/).filter(Boolean)}function T(e,t){let n=e.getAttribute(C);if(!n)return;let r=w(n);r.length!==0&&(t?e.classList.add(...r):e.classList.remove(...r))}function E(e,t){let n=b(`[${C}]`,e);for(let e of n)T(e,t)}function D(e=document){let t=window.matchMedia(ee),n=t=>{E(e,t.matches)};return n(t),t.addEventListener(`change`,n),()=>t.removeEventListener(`change`,n)}var O=new Map,k=!1;function A(e){e.key===`Escape`&&O.forEach((e,t)=>{e.closable&&e.element.classList.contains(`show`)&&F(t)})}function j(e){let t=e.id;if(!t||O.has(t))return;let n=e.dataset.closable!==`false`,r=e.dataset.backdrop!==`false`;e.classList.add(`modal`,`fade`),e.setAttribute(`tabindex`,`-1`),e.setAttribute(`role`,`dialog`),e.setAttribute(`aria-modal`,`true`),e.setAttribute(`aria-hidden`,`true`),e.style.display=`none`;let i={element:e,backdrop:null,closable:n,useBackdrop:r,open:()=>P(t),close:()=>F(t)};O.set(t,i),e.querySelectorAll(`[data-dismiss="modal"], .btn-close`).forEach(e=>{e.dataset.modalWired!==`true`&&(e.dataset.modalWired=`true`,e.addEventListener(`click`,()=>F(t)))})}function M(e){e.querySelectorAll(`[data-toggle="modal"]`).forEach(e=>{if(e.dataset.modalWired===`true`)return;let t=e.dataset.target;if(!t)return;let n=t.replace(/^#/,``);e.dataset.modalWired=`true`,e.addEventListener(`click`,e=>{e.preventDefault(),P(n)})})}function N(e=document){e.querySelectorAll(`.modal`).forEach(j),M(e),k||(k=!0,document.addEventListener(`keydown`,A))}function P(e){let t=O.get(e);if(!t)return;let{element:n,useBackdrop:r}=t;if(n.classList.add(`show`),n.style.display=`flex`,n.setAttribute(`aria-hidden`,`false`),r&&!t.backdrop){let n=document.createElement(`div`);n.className=`modal-backdrop fade show`,n.addEventListener(`click`,()=>F(e)),document.body.append(n),t.backdrop=n}}function F(e){let t=O.get(e);if(!t)return;let{element:n}=t;n.classList.remove(`show`),n.style.display=`none`,n.setAttribute(`aria-hidden`,`true`),t.backdrop?.remove(),t.backdrop=null}var te=`
    <div class="section section-1 marquee">brutal</div>
    <div class="section section-2">
        <div class="desktop">
            <div class="carousel-left carousel-wrapper carousel-tall"></div>
        </div>
        <div class="mobile">
            <div
            class="carousel-mobile carousel-wrapper carousel-tall"
            data-timeout="2000"
            ></div>
        </div>
    </div>
    <div class="section section-3">
        <div style="height: 100%;display: flex;justify-content: space-between;flex-direction: column">
            <div>bogdan-florin cîrstoiu - web developer</div>
            <div class="desktop">"If you wish to make an apple pie from scratch, you must first invent the universe."<br> - Carl Sagan</div>
            <div>javascript typescript react node bun git docker linux php(kinda)</div>
        </div>
    </div>
    <div class="section section-4" data-viewport-classes="button">
        <div class="desktop">
            <div
            class="carousel-right carousel-wrapper carousel-tall"
            data-timeout="3000"
            ></div>
        </div>
        <div class="mobile">
            <div class="text-fit">
                projects
            </div>
        </div>
    </div>
    <div class="section section-5 button">
        <div class="mobile">
            <div class="text-fit" data-toggle="modal" data-target="#about">
                about
            </div>
        </div>
        <div class="desktop">
            <div class="text-fit">
                projects
            </div>
        </div>
    </div>
    <div class="section section-6">
        <div class="desktop">
            <div
            class="carousel-center carousel-wrapper carousel-tall "
            data-timeout="3000"
            ></div>
        </div>
        <div class="mobile">
            <div style="margin-bottom: 8px">
            copyright @ 2026.<br />
            all rights reserved.
            </div>

            <div
            style="
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            "
            >
            <div>
                <a href="#">github</a>
                <a href="#">contact</a>
            </div>

            <div>
                <button data-toggle="modal" data-target="#theme">theme</button>
            </div>
            </div>    
        </div>
    </div>
    <div class="section section-7 text-fit button centered">
        about
    </div>
    <div class="section section-8">
        <div>
        copyright @ 2026.<br />
        all rights reserved.
        </div>

        <div
        style="
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        "
        >
        <div>
            <a href="#">github</a>
            <a href="#">contact</a>
        </div>

        <div>
            <button data-toggle="modal" data-target="#theme">theme</button>
        </div>
        </div>
    </div>
    <div id="theme" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">theme</h5>
                    <div class="btn-close" data-dismiss="modal">x</div>
                </div>
                <div class="modal-body">
                    <button type="button" class="dark theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="dark">dark</span>
                        <span class="hex">hex 000000</span>
                    </button>
                    <button type="button" class="light theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="light">light</span>
                        <span class="hex">hex ffffff</span>
                    </button>
                    <button type="button" class="ocean theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="ocean">ocean</span>
                        <span class="hex">hex 03045e</span>
                    </button>
                    <button type="button" class="child theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="child">child</span>
                        <span class="hex">hex 9b5de5</span>
                    </button>
                    <button type="button" class="soft theme-btn" style="justify-content: space-between"> 
                        <span class="title" data-theme="soft">soft</span>
                        <span class="hex">hex 780116</span>
                    </button>
                </div>
                <div class="modal-footer">
                    <button type="button" data-dismiss="modal">cancel</button>
                    <button type="button" id="theme-apply-btn">apply</button>
                </div>
            </div>
        </div>
    </div>
    <div id="about" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">about</h5>
                    <div class="btn-close" data-dismiss="modal">x</div>
                </div>
                <div class="modal-body">
                    <p>Bogdan-Florin Cîrstoiu<br>Bucharest - Romania</p>
                    <p>Aspiring web developer, with a passion for the inner-workings of day-to-day things, always ready for a challenge, and extremely curious by nature.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" data-dismiss="modal">close</button>
                </div>
            </div>
        </div>
    </div>
`,I=`
    loading...
`,L=S(`div`,{class:`fancy-grid`,html:te}),R=S(`div`,{text:I,style:{position:`absolute`,left:`0`,right:`0`,width:`100dvw`,height:`100dvh`,backgroundColor:`inherit`,color:`inherit`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:`999999999`}}),z=100,B=.9,V=new WeakMap,H=new Set,U=new Set,W=null,G=!1;function K(){H.forEach(Y)}function q(e){let t=e.parentElement;if(!t||getComputedStyle(t).display!==`contents`)return e;let n=t;for(;n.parentElement&&getComputedStyle(n.parentElement).display===`contents`;)n=n.parentElement;return n.parentElement??e}function J(e){let t=getComputedStyle(e),n=parseFloat(t.paddingLeft)+parseFloat(t.paddingRight),r=parseFloat(t.paddingTop)+parseFloat(t.paddingBottom);return{width:e.clientWidth-n,height:e.clientHeight-r}}function Y(e){U.add(e),W===null&&(W=requestAnimationFrame(()=>{W=null;let e=Array.from(U);U.clear();for(let t of e)Z(t)}))}function X(e){let t=V.get(e);t&&t.resizeObserver.disconnect();let n=e.textContent?.trim()??``;e.textContent=``;let r=document.createElement(`span`);r.className=`text-fit-inner`,r.textContent=n,e.appendChild(r);let i=new ResizeObserver(()=>Y(e));i.observe(e);let a=q(e);a!==e&&i.observe(a),V.set(e,{container:e,span:r,resizeObserver:i}),H.add(e),G||(G=!0,window.addEventListener(`resize`,K)),Y(e)}function Z(e){let t=V.get(e);if(!t)return;let{span:n}=t,{width:r,height:i}=J(q(e));if(r===0||i===0)return;n.style.fontSize=`${z}px`;let a=n.scrollWidth;if(a===0)return;let o=r/a*z,s=i*B,c=Math.max(1,Math.min(o,s));n.style.fontSize=`${c}px`}function ne(e=document){e.querySelectorAll(`.text-fit`).forEach(X)}var Q=`light`,re=()=>{let e=b(`.theme-btn`),t=x(`#theme-apply-btn`),n=localStorage.getItem(`theme`);n&&(Q=n,document.body.className=`${Q}`);let r=()=>{e.forEach(e=>{let t=x(`.title`,e),n=t.dataset.theme??`dark`;e.className.includes(Q)?(e.classList.add(`active`),t.append(` - selected`)):(e.classList.remove(`active`),t.textContent=n),e.onclick=()=>{Q=n,localStorage.setItem(`theme`,n),r()}})};r(),t.onclick=()=>{document.body.className=`${Q}`,F(`theme`)}};function $(e,t,n){let r=x(e);r.innerHTML=``,[...Array(n)].forEach((e,n)=>{let i=S(`img`,{props:{src:`/images/pattern-${t+n}.jpg`}});r.append(i)})}document.body.append(R),document.addEventListener(`DOMContentLoaded`,()=>{document.body.append(L),y(),$(`.carousel-left`,1,5),$(`.carousel-right`,6,5),$(`.carousel-center`,11,5),$(`.carousel-mobile`,1,15),i(),ne(),N(),re(),D(),setTimeout(()=>{R.style.display=`none`},1e3)});
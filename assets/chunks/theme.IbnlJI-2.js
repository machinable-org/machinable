import{d as f,c as s,r as m,n as T,o as i,a as J,t as w,b as y,w as p,T as ee,e as b,_ as k,u as De,i as $e,f as We,g as ue,h as v,j as h,k as l,l as H,m as re,p as j,q as L,s as ne,v as U,x as pe,y as be,z as Ve,A as Je,F as P,B as O,C as B,D as ae,E as _,G as we,H as W,I as Ne,J as te,K as G,L as oe,M as Le,N as fe,O as Be,P as _e,Q as Ie,R as ie,S as qe,U as je,V as Ee,W as Ge,X as Ue,Y as He,Z as se,$ as Te,a0 as Ye,a1 as Ke}from"./framework.3Urx35Pr.js";const Qe=f({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(e){return(n,a)=>(i(),s("span",{class:T(["VPBadge",e.type])},[m(n.$slots,"default",{},()=>[J(w(e.text),1)])],2))}}),Ze={key:0,class:"VPBackdrop"},Xe=f({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(e){return(n,a)=>(i(),y(ee,{name:"fade"},{default:p(()=>[e.show?(i(),s("div",Ze)):b("",!0)]),_:1}))}}),en=k(Xe,[["__scopeId","data-v-54a304ca"]]),C=De;function nn(e,n){let a,t=!1;return()=>{a&&clearTimeout(a),t?a=setTimeout(e,n):(e(),(t=!0)&&setTimeout(()=>t=!1,n))}}function me(e){return e.startsWith("/")?e:`/${e}`}function ge(e){const{pathname:n,search:a,hash:t,protocol:o}=new URL(e,"http://a.com");if($e(e)||e.startsWith("#")||!o.startsWith("http")||!We(n))return e;const{site:c}=C(),r=n.endsWith("/")||n.endsWith(".html")?e:e.replace(/(?:(^\.+)\/)?.*$/,`$1${n.replace(/(\.md)?$/,c.value.cleanUrls?"":".html")}${a}${t}`);return ue(r)}function K({correspondingLink:e=!1}={}){const{site:n,localeIndex:a,page:t,theme:o,hash:c}=C(),r=v(()=>{var d,x;return{label:(d=n.value.locales[a.value])==null?void 0:d.label,link:((x=n.value.locales[a.value])==null?void 0:x.link)||(a.value==="root"?"/":`/${a.value}/`)}});return{localeLinks:v(()=>Object.entries(n.value.locales).flatMap(([d,x])=>r.value.label===x.label?[]:{text:x.label,link:an(x.link||(d==="root"?"/":`/${d}/`),o.value.i18nRouting!==!1&&e,t.value.relativePath.slice(r.value.link.length-1),!n.value.cleanUrls)+c.value})),currentLang:r}}function an(e,n,a,t){return n?e.replace(/\/$/,"")+me(a.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,t?".html":"")):e}const tn={class:"NotFound"},on={class:"code"},ln={class:"title"},cn={class:"quote"},rn={class:"action"},sn=["href","aria-label"],mn=f({__name:"NotFound",setup(e){const{theme:n}=C(),{currentLang:a}=K();return(t,o)=>{var c,r,u,d,x;return i(),s("div",tn,[h("p",on,w(((c=l(n).notFound)==null?void 0:c.code)??"404"),1),h("h1",ln,w(((r=l(n).notFound)==null?void 0:r.title)??"PAGE NOT FOUND"),1),o[0]||(o[0]=h("div",{class:"divider"},null,-1)),h("blockquote",cn,w(((u=l(n).notFound)==null?void 0:u.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),h("div",rn,[h("a",{class:"link",href:l(ue)(l(a).link),"aria-label":((d=l(n).notFound)==null?void 0:d.linkLabel)??"go to home"},w(((x=l(n).notFound)==null?void 0:x.linkText)??"Take me home"),9,sn)])])}}}),dn=k(mn,[["__scopeId","data-v-6ff51ddd"]]);function Ae(e,n){if(Array.isArray(e))return Z(e);if(e==null)return[];n=me(n);const a=Object.keys(e).sort((o,c)=>c.split("/").length-o.split("/").length).find(o=>n.startsWith(me(o))),t=a?e[a]:[];return Array.isArray(t)?Z(t):Z(t.items,t.base)}function hn(e){const n=[];let a=0;for(const t in e){const o=e[t];if(o.items){a=n.push(o);continue}n[a]||n.push({items:[]}),n[a].items.push(o)}return n}function un(e){const n=[];function a(t){for(const o of t)o.text&&o.link&&n.push({text:o.text,link:o.link,docFooterText:o.docFooterText}),o.items&&a(o.items)}return a(e),n}function de(e,n){return Array.isArray(n)?n.some(a=>de(e,a)):H(e,n.link)?!0:n.items?de(e,n.items):!1}function Z(e,n){return[...e].map(a=>{const t={...a},o=t.base||n;return o&&t.link&&(t.link=o+t.link),t.items&&(t.items=Z(t.items,o)),t})}function q(){const{frontmatter:e,page:n,theme:a}=C(),t=re("(min-width: 960px)"),o=j(!1),c=v(()=>{const z=a.value.sidebar,R=n.value.relativePath;return z?Ae(z,R):[]}),r=j(c.value);L(c,(z,R)=>{JSON.stringify(z)!==JSON.stringify(R)&&(r.value=c.value)});const u=v(()=>e.value.sidebar!==!1&&r.value.length>0&&e.value.layout!=="home"),d=v(()=>x?e.value.aside==null?a.value.aside==="left":e.value.aside==="left":!1),x=v(()=>e.value.layout==="home"?!1:e.value.aside!=null?!!e.value.aside:a.value.aside!==!1),g=v(()=>u.value&&t.value),S=v(()=>u.value?hn(r.value):[]);function I(){o.value=!0}function A(){o.value=!1}function F(){o.value?A():I()}return{isOpen:o,sidebar:r,sidebarGroups:S,hasSidebar:u,hasAside:x,leftAside:d,isSidebarEnabled:g,open:I,close:A,toggle:F}}function pn(e,n){let a;ne(()=>{a=e.value?document.activeElement:void 0}),U(()=>{window.addEventListener("keyup",t)}),pe(()=>{window.removeEventListener("keyup",t)});function t(o){o.key==="Escape"&&e.value&&(n(),a==null||a.focus())}}function bn(e){const{page:n,hash:a}=C(),t=j(!1),o=v(()=>e.value.collapsed!=null),c=v(()=>!!e.value.link),r=j(!1),u=()=>{r.value=H(n.value.relativePath,e.value.link)};L([n,e,a],u),U(u);const d=v(()=>r.value?!0:e.value.items?de(n.value.relativePath,e.value.items):!1),x=v(()=>!!(e.value.items&&e.value.items.length));ne(()=>{t.value=!!(o.value&&e.value.collapsed)}),be(()=>{(r.value||d.value)&&(t.value=!1)});function g(){o.value&&(t.value=!t.value)}return{collapsed:t,collapsible:o,isLink:c,isActiveLink:r,hasActiveLink:d,hasChildren:x,toggle:g}}function fn(){const{hasSidebar:e}=q(),n=re("(min-width: 960px)"),a=re("(min-width: 1280px)");return{isAsideEnabled:v(()=>!a.value&&!n.value?!1:e.value?a.value:n.value)}}const _n=/\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/,he=[];function Pe(e){return typeof e.outline=="object"&&!Array.isArray(e.outline)&&e.outline.label||e.outlineTitle||"On this page"}function ye(e){const n=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(a=>a.id&&a.hasChildNodes()).map(a=>{const t=Number(a.tagName[1]);return{element:a,title:gn(a),link:"#"+a.id,level:t}});return yn(n,e)}function gn(e){let n="";for(const a of e.childNodes)if(a.nodeType===1){if(_n.test(a.className))continue;n+=a.textContent}else a.nodeType===3&&(n+=a.textContent);return n.trim()}function yn(e,n){if(n===!1)return[];const a=(typeof n=="object"&&!Array.isArray(n)?n.level:n)||2,[t,o]=typeof a=="number"?[a,a]:a==="deep"?[2,6]:a;return xn(e,t,o)}function kn(e,n){const{isAsideEnabled:a}=fn(),t=nn(c,100);let o=null;U(()=>{requestAnimationFrame(c),window.addEventListener("scroll",t)}),Ve(()=>{r(location.hash)}),pe(()=>{window.removeEventListener("scroll",t)});function c(){if(!a.value)return;const u=window.scrollY,d=window.innerHeight,x=document.body.offsetHeight,g=Math.abs(u+d-x)<1,S=he.map(({element:A,link:F})=>({link:F,top:vn(A)})).filter(({top:A})=>!Number.isNaN(A)).sort((A,F)=>A.top-F.top);if(!S.length){r(null);return}if(u<1){r(null);return}if(g){r(S[S.length-1].link);return}let I=null;for(const{link:A,top:F}of S){if(F>u+Je()+4)break;I=A}r(I)}function r(u){o&&o.classList.remove("active"),u==null?o=null:o=e.value.querySelector(`a[href="${decodeURIComponent(u)}"]`);const d=o;d?(d.classList.add("active"),n.value.style.top=d.offsetTop+39+"px",n.value.style.opacity="1"):(n.value.style.top="33px",n.value.style.opacity="0")}}function vn(e){let n=0;for(;e!==document.body;){if(e===null)return NaN;n+=e.offsetTop,e=e.offsetParent}return n}function xn(e,n,a){he.length=0;const t=[],o=[];return e.forEach(c=>{const r={...c,children:[]};let u=o[o.length-1];for(;u&&u.level>=r.level;)o.pop(),u=o[o.length-1];if(r.element.classList.contains("ignore-header")||u&&"shouldIgnore"in u){o.push({level:r.level,shouldIgnore:!0});return}r.level>a||r.level<n||(he.push({element:r.element,link:r.link}),u?u.children.push(r):t.push(r),o.push(r))}),t}const Sn=["href","title"],Cn=f({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(e){function n({target:a}){const t=a.href.split("#")[1],o=document.getElementById(decodeURIComponent(t));o==null||o.focus({preventScroll:!0})}return(a,t)=>{const o=B("VPDocOutlineItem",!0);return i(),s("ul",{class:T(["VPDocOutlineItem",e.root?"root":"nested"])},[(i(!0),s(P,null,O(e.headers,({children:c,link:r,title:u})=>(i(),s("li",null,[h("a",{class:"outline-link",href:r,onClick:n,title:u},w(u),9,Sn),c!=null&&c.length?(i(),y(o,{key:0,headers:c},null,8,["headers"])):b("",!0)]))),256))],2)}}}),Fe=k(Cn,[["__scopeId","data-v-53c99d69"]]),wn={class:"content"},Nn={"aria-level":"2",class:"outline-title",id:"doc-outline-aria-label",role:"heading"},In=f({__name:"VPDocAsideOutline",setup(e){const{frontmatter:n,theme:a}=C(),t=we([]);ae(()=>{t.value=ye(n.value.outline??a.value.outline)});const o=j(),c=j();return kn(o,c),(r,u)=>(i(),s("nav",{"aria-labelledby":"doc-outline-aria-label",class:T(["VPDocAsideOutline",{"has-outline":t.value.length>0}]),ref_key:"container",ref:o},[h("div",wn,[h("div",{class:"outline-marker",ref_key:"marker",ref:c},null,512),h("div",Nn,w(l(Pe)(l(a))),1),_(Fe,{headers:t.value,root:!0},null,8,["headers"])])],2))}}),jn=k(In,[["__scopeId","data-v-f610f197"]]),En={class:"VPDocAsideCarbonAds"},Tn=f({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(e){const n=()=>null;return(a,t)=>(i(),s("div",En,[_(l(n),{"carbon-ads":e.carbonAds},null,8,["carbon-ads"])]))}}),An={class:"VPDocAside"},Pn=f({__name:"VPDocAside",setup(e){const{theme:n}=C();return(a,t)=>(i(),s("div",An,[m(a.$slots,"aside-top",{},void 0,!0),m(a.$slots,"aside-outline-before",{},void 0,!0),_(jn),m(a.$slots,"aside-outline-after",{},void 0,!0),t[0]||(t[0]=h("div",{class:"spacer"},null,-1)),m(a.$slots,"aside-ads-before",{},void 0,!0),l(n).carbonAds?(i(),y(Tn,{key:0,"carbon-ads":l(n).carbonAds},null,8,["carbon-ads"])):b("",!0),m(a.$slots,"aside-ads-after",{},void 0,!0),m(a.$slots,"aside-bottom",{},void 0,!0)]))}}),Fn=k(Pn,[["__scopeId","data-v-cb998dce"]]);function zn(){const{theme:e,page:n}=C();return v(()=>{const{text:a="Edit this page",pattern:t=""}=e.value.editLink||{};let o;return typeof t=="function"?o=t(n.value):o=t.replace(/:path/g,n.value.filePath),{url:o,text:a}})}function Rn(){const{page:e,theme:n,frontmatter:a}=C();return v(()=>{var x,g,S,I,A,F,z,R;const t=Ae(n.value.sidebar,e.value.relativePath),o=un(t),c=On(o,M=>M.link.replace(/[?#].*$/,"")),r=c.findIndex(M=>H(e.value.relativePath,M.link)),u=((x=n.value.docFooter)==null?void 0:x.prev)===!1&&!a.value.prev||a.value.prev===!1,d=((g=n.value.docFooter)==null?void 0:g.next)===!1&&!a.value.next||a.value.next===!1;return{prev:u?void 0:{text:(typeof a.value.prev=="string"?a.value.prev:typeof a.value.prev=="object"?a.value.prev.text:void 0)??((S=c[r-1])==null?void 0:S.docFooterText)??((I=c[r-1])==null?void 0:I.text),link:(typeof a.value.prev=="object"?a.value.prev.link:void 0)??((A=c[r-1])==null?void 0:A.link)},next:d?void 0:{text:(typeof a.value.next=="string"?a.value.next:typeof a.value.next=="object"?a.value.next.text:void 0)??((F=c[r+1])==null?void 0:F.docFooterText)??((z=c[r+1])==null?void 0:z.text),link:(typeof a.value.next=="object"?a.value.next.link:void 0)??((R=c[r+1])==null?void 0:R.link)}}})}function On(e,n){const a=new Set;return e.filter(t=>{const o=n(t);return a.has(o)?!1:a.add(o)})}const V=f({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(e){const n=e,a=v(()=>n.tag??(n.href?"a":"span")),t=v(()=>n.href&&Ne.test(n.href)||n.target==="_blank");return(o,c)=>(i(),y(W(a.value),{class:T(["VPLink",{link:e.href,"vp-external-link-icon":t.value,"no-icon":e.noIcon}]),href:e.href?l(ge)(e.href):void 0,target:e.target??(t.value?"_blank":void 0),rel:e.rel??(t.value?"noreferrer":void 0)},{default:p(()=>[m(o.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Mn={class:"VPLastUpdated"},Dn=["datetime"],$n=f({__name:"VPDocFooterLastUpdated",setup(e){const{theme:n,page:a,lang:t}=C(),o=v(()=>new Date(a.value.lastUpdated)),c=v(()=>o.value.toISOString()),r=j("");return U(()=>{ne(()=>{var u,d,x;r.value=new Intl.DateTimeFormat((d=(u=n.value.lastUpdated)==null?void 0:u.formatOptions)!=null&&d.forceLocale?t.value:void 0,((x=n.value.lastUpdated)==null?void 0:x.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(o.value)})}),(u,d)=>{var x;return i(),s("p",Mn,[J(w(((x=l(n).lastUpdated)==null?void 0:x.text)||l(n).lastUpdatedText||"Last updated")+": ",1),h("time",{datetime:c.value},w(r.value),9,Dn)])}}}),Wn=k($n,[["__scopeId","data-v-1bb0c8a8"]]),Vn={key:0,class:"VPDocFooter"},Jn={key:0,class:"edit-info"},Ln={key:0,class:"edit-link"},Bn={key:1,class:"last-updated"},qn={key:1,class:"prev-next","aria-labelledby":"doc-footer-aria-label"},Gn={class:"pager"},Un=["innerHTML"],Hn=["innerHTML"],Yn={class:"pager"},Kn=["innerHTML"],Qn=["innerHTML"],Zn=f({__name:"VPDocFooter",setup(e){const{theme:n,page:a,frontmatter:t}=C(),o=zn(),c=Rn(),r=v(()=>n.value.editLink&&t.value.editLink!==!1),u=v(()=>a.value.lastUpdated),d=v(()=>r.value||u.value||c.value.prev||c.value.next);return(x,g)=>{var S,I,A,F;return d.value?(i(),s("footer",Vn,[m(x.$slots,"doc-footer-before",{},void 0,!0),r.value||u.value?(i(),s("div",Jn,[r.value?(i(),s("div",Ln,[_(V,{class:"edit-link-button",href:l(o).url,"no-icon":!0},{default:p(()=>[g[0]||(g[0]=h("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),J(" "+w(l(o).text),1)]),_:1},8,["href"])])):b("",!0),u.value?(i(),s("div",Bn,[_(Wn)])):b("",!0)])):b("",!0),(S=l(c).prev)!=null&&S.link||(I=l(c).next)!=null&&I.link?(i(),s("nav",qn,[g[1]||(g[1]=h("span",{class:"visually-hidden",id:"doc-footer-aria-label"},"Pager",-1)),h("div",Gn,[(A=l(c).prev)!=null&&A.link?(i(),y(V,{key:0,class:"pager-link prev",href:l(c).prev.link},{default:p(()=>{var z;return[h("span",{class:"desc",innerHTML:((z=l(n).docFooter)==null?void 0:z.prev)||"Previous page"},null,8,Un),h("span",{class:"title",innerHTML:l(c).prev.text},null,8,Hn)]}),_:1},8,["href"])):b("",!0)]),h("div",Yn,[(F=l(c).next)!=null&&F.link?(i(),y(V,{key:0,class:"pager-link next",href:l(c).next.link},{default:p(()=>{var z;return[h("span",{class:"desc",innerHTML:((z=l(n).docFooter)==null?void 0:z.next)||"Next page"},null,8,Kn),h("span",{class:"title",innerHTML:l(c).next.text},null,8,Qn)]}),_:1},8,["href"])):b("",!0)])])):b("",!0)])):b("",!0)}}}),Xn=k(Zn,[["__scopeId","data-v-1bcd8184"]]),ea={class:"container"},na={class:"aside-container"},aa={class:"aside-content"},ta={class:"content"},oa={class:"content-container"},ia={class:"main"},la=f({__name:"VPDoc",setup(e){const{theme:n}=C(),a=te(),{hasSidebar:t,hasAside:o,leftAside:c}=q(),r=v(()=>a.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(u,d)=>{const x=B("Content");return i(),s("div",{class:T(["VPDoc",{"has-sidebar":l(t),"has-aside":l(o)}])},[m(u.$slots,"doc-top",{},void 0,!0),h("div",ea,[l(o)?(i(),s("div",{key:0,class:T(["aside",{"left-aside":l(c)}])},[d[0]||(d[0]=h("div",{class:"aside-curtain"},null,-1)),h("div",na,[h("div",aa,[_(Fn,null,{"aside-top":p(()=>[m(u.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":p(()=>[m(u.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":p(()=>[m(u.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":p(()=>[m(u.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":p(()=>[m(u.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":p(()=>[m(u.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):b("",!0),h("div",ta,[h("div",oa,[m(u.$slots,"doc-before",{},void 0,!0),h("main",ia,[_(x,{class:T(["vp-doc",[r.value,l(n).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),_(Xn,null,{"doc-footer-before":p(()=>[m(u.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),m(u.$slots,"doc-after",{},void 0,!0)])])]),m(u.$slots,"doc-bottom",{},void 0,!0)],2)}}}),ca=k(la,[["__scopeId","data-v-e6f2a212"]]),ra=f({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(e){const n=e,a=v(()=>n.href&&Ne.test(n.href)),t=v(()=>n.tag||(n.href?"a":"button"));return(o,c)=>(i(),y(W(t.value),{class:T(["VPButton",[e.size,e.theme]]),href:e.href?l(ge)(e.href):void 0,target:n.target??(a.value?"_blank":void 0),rel:n.rel??(a.value?"noreferrer":void 0)},{default:p(()=>[J(w(e.text),1)]),_:1},8,["class","href","target","rel"]))}}),sa=k(ra,[["__scopeId","data-v-93dc4167"]]),ma=["src","alt"],da=f({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(e){return(n,a)=>{const t=B("VPImage",!0);return e.image?(i(),s(P,{key:0},[typeof e.image=="string"||"src"in e.image?(i(),s("img",G({key:0,class:"VPImage"},typeof e.image=="string"?n.$attrs:{...e.image,...n.$attrs},{src:l(ue)(typeof e.image=="string"?e.image:e.image.src),alt:e.alt??(typeof e.image=="string"?"":e.image.alt||"")}),null,16,ma)):(i(),s(P,{key:1},[_(t,G({class:"dark",image:e.image.dark,alt:e.image.alt},n.$attrs),null,16,["image","alt"]),_(t,G({class:"light",image:e.image.light,alt:e.image.alt},n.$attrs),null,16,["image","alt"])],64))],64)):b("",!0)}}}),X=k(da,[["__scopeId","data-v-ab19afbb"]]),ha={class:"container"},ua={class:"main"},pa={class:"heading"},ba=["innerHTML"],fa=["innerHTML"],_a=["innerHTML"],ga={key:0,class:"actions"},ya={key:0,class:"image"},ka={class:"image-container"},va=f({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(e){const n=oe("hero-image-slot-exists");return(a,t)=>(i(),s("div",{class:T(["VPHero",{"has-image":e.image||l(n)}])},[h("div",ha,[h("div",ua,[m(a.$slots,"home-hero-info-before",{},void 0,!0),m(a.$slots,"home-hero-info",{},()=>[h("h1",pa,[e.name?(i(),s("span",{key:0,innerHTML:e.name,class:"name clip"},null,8,ba)):b("",!0),e.text?(i(),s("span",{key:1,innerHTML:e.text,class:"text"},null,8,fa)):b("",!0)]),e.tagline?(i(),s("p",{key:0,innerHTML:e.tagline,class:"tagline"},null,8,_a)):b("",!0)],!0),m(a.$slots,"home-hero-info-after",{},void 0,!0),e.actions?(i(),s("div",ga,[(i(!0),s(P,null,O(e.actions,o=>(i(),s("div",{key:o.link,class:"action"},[_(sa,{tag:"a",size:"medium",theme:o.theme,text:o.text,href:o.link,target:o.target,rel:o.rel},null,8,["theme","text","href","target","rel"])]))),128))])):b("",!0),m(a.$slots,"home-hero-actions-after",{},void 0,!0)]),e.image||l(n)?(i(),s("div",ya,[h("div",ka,[t[0]||(t[0]=h("div",{class:"image-bg"},null,-1)),m(a.$slots,"home-hero-image",{},()=>[e.image?(i(),y(X,{key:0,class:"image-src",image:e.image},null,8,["image"])):b("",!0)],!0)])])):b("",!0)])],2))}}),xa=k(va,[["__scopeId","data-v-dd8814ff"]]),Sa=f({__name:"VPHomeHero",setup(e){const{frontmatter:n}=C();return(a,t)=>l(n).hero?(i(),y(xa,{key:0,class:"VPHomeHero",name:l(n).hero.name,text:l(n).hero.text,tagline:l(n).hero.tagline,image:l(n).hero.image,actions:l(n).hero.actions},{"home-hero-info-before":p(()=>[m(a.$slots,"home-hero-info-before")]),"home-hero-info":p(()=>[m(a.$slots,"home-hero-info")]),"home-hero-info-after":p(()=>[m(a.$slots,"home-hero-info-after")]),"home-hero-actions-after":p(()=>[m(a.$slots,"home-hero-actions-after")]),"home-hero-image":p(()=>[m(a.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):b("",!0)}}),Ca={class:"box"},wa={key:0,class:"icon"},Na=["innerHTML"],Ia=["innerHTML"],ja=["innerHTML"],Ea={key:4,class:"link-text"},Ta={class:"link-text-value"},Aa=f({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(e){return(n,a)=>(i(),y(V,{class:"VPFeature",href:e.link,rel:e.rel,target:e.target,"no-icon":!0,tag:e.link?"a":"div"},{default:p(()=>[h("article",Ca,[typeof e.icon=="object"&&e.icon.wrap?(i(),s("div",wa,[_(X,{image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])])):typeof e.icon=="object"?(i(),y(X,{key:1,image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])):e.icon?(i(),s("div",{key:2,class:"icon",innerHTML:e.icon},null,8,Na)):b("",!0),h("h2",{class:"title",innerHTML:e.title},null,8,Ia),e.details?(i(),s("p",{key:3,class:"details",innerHTML:e.details},null,8,ja)):b("",!0),e.linkText?(i(),s("div",Ea,[h("p",Ta,[J(w(e.linkText)+" ",1),a[0]||(a[0]=h("span",{class:"vpi-arrow-right link-text-icon"},null,-1))])])):b("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),Pa=k(Aa,[["__scopeId","data-v-bd37d1a2"]]),Fa={key:0,class:"VPFeatures"},za={class:"container"},Ra={class:"items"},Oa=f({__name:"VPFeatures",props:{features:{}},setup(e){const n=e,a=v(()=>{const t=n.features.length;if(t){if(t===2)return"grid-2";if(t===3)return"grid-3";if(t%3===0)return"grid-6";if(t>3)return"grid-4"}else return});return(t,o)=>e.features?(i(),s("div",Fa,[h("div",za,[h("div",Ra,[(i(!0),s(P,null,O(e.features,c=>(i(),s("div",{key:c.title,class:T(["item",[a.value]])},[_(Pa,{icon:c.icon,title:c.title,details:c.details,link:c.link,"link-text":c.linkText,rel:c.rel,target:c.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):b("",!0)}}),Ma=k(Oa,[["__scopeId","data-v-b1eea84a"]]),Da=f({__name:"VPHomeFeatures",setup(e){const{frontmatter:n}=C();return(a,t)=>l(n).features?(i(),y(Ma,{key:0,class:"VPHomeFeatures",features:l(n).features},null,8,["features"])):b("",!0)}}),$a=f({__name:"VPHomeContent",setup(e){const{width:n}=Le({initialWidth:0,includeScrollbar:!1});return(a,t)=>(i(),s("div",{class:"vp-doc container",style:fe(l(n)?{"--vp-offset":`calc(50% - ${l(n)/2}px)`}:{})},[m(a.$slots,"default",{},void 0,!0)],4))}}),Wa=k($a,[["__scopeId","data-v-c141a4bd"]]),Va=f({__name:"VPHome",setup(e){const{frontmatter:n,theme:a}=C();return(t,o)=>{const c=B("Content");return i(),s("div",{class:T(["VPHome",{"external-link-icon-enabled":l(a).externalLinkIcon}])},[m(t.$slots,"home-hero-before",{},void 0,!0),_(Sa,null,{"home-hero-info-before":p(()=>[m(t.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":p(()=>[m(t.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":p(()=>[m(t.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":p(()=>[m(t.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":p(()=>[m(t.$slots,"home-hero-image",{},void 0,!0)]),_:3}),m(t.$slots,"home-hero-after",{},void 0,!0),m(t.$slots,"home-features-before",{},void 0,!0),_(Da),m(t.$slots,"home-features-after",{},void 0,!0),l(n).markdownStyles!==!1?(i(),y(Wa,{key:0},{default:p(()=>[_(c)]),_:1})):(i(),y(c,{key:1}))],2)}}}),Ja=k(Va,[["__scopeId","data-v-e07eaea7"]]),La={},Ba={class:"VPPage"};function qa(e,n){const a=B("Content");return i(),s("div",Ba,[m(e.$slots,"page-top"),_(a),m(e.$slots,"page-bottom")])}const Ga=k(La,[["render",qa]]),Ua=f({__name:"VPContent",setup(e){const{page:n,frontmatter:a}=C(),{hasSidebar:t}=q();return(o,c)=>(i(),s("div",{class:T(["VPContent",{"has-sidebar":l(t),"is-home":l(a).layout==="home"}]),id:"VPContent"},[l(n).isNotFound?m(o.$slots,"not-found",{key:0},()=>[_(dn)],!0):l(a).layout==="page"?(i(),y(Ga,{key:1},{"page-top":p(()=>[m(o.$slots,"page-top",{},void 0,!0)]),"page-bottom":p(()=>[m(o.$slots,"page-bottom",{},void 0,!0)]),_:3})):l(a).layout==="home"?(i(),y(Ja,{key:2},{"home-hero-before":p(()=>[m(o.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":p(()=>[m(o.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":p(()=>[m(o.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":p(()=>[m(o.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":p(()=>[m(o.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":p(()=>[m(o.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":p(()=>[m(o.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":p(()=>[m(o.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":p(()=>[m(o.$slots,"home-features-after",{},void 0,!0)]),_:3})):l(a).layout&&l(a).layout!=="doc"?(i(),y(W(l(a).layout),{key:3})):(i(),y(ca,{key:4},{"doc-top":p(()=>[m(o.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":p(()=>[m(o.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":p(()=>[m(o.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":p(()=>[m(o.$slots,"doc-before",{},void 0,!0)]),"doc-after":p(()=>[m(o.$slots,"doc-after",{},void 0,!0)]),"aside-top":p(()=>[m(o.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":p(()=>[m(o.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":p(()=>[m(o.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":p(()=>[m(o.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":p(()=>[m(o.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":p(()=>[m(o.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),Ha=k(Ua,[["__scopeId","data-v-9a6c75ad"]]),Ya={class:"container"},Ka=["innerHTML"],Qa=["innerHTML"],Za=f({__name:"VPFooter",setup(e){const{theme:n,frontmatter:a}=C(),{hasSidebar:t}=q();return(o,c)=>l(n).footer&&l(a).footer!==!1?(i(),s("footer",{key:0,class:T(["VPFooter",{"has-sidebar":l(t)}])},[h("div",Ya,[l(n).footer.message?(i(),s("p",{key:0,class:"message",innerHTML:l(n).footer.message},null,8,Ka)):b("",!0),l(n).footer.copyright?(i(),s("p",{key:1,class:"copyright",innerHTML:l(n).footer.copyright},null,8,Qa)):b("",!0)])],2)):b("",!0)}}),Xa=k(Za,[["__scopeId","data-v-566314d4"]]);function et(){const{theme:e,frontmatter:n}=C(),a=we([]),t=v(()=>a.value.length>0);return ae(()=>{a.value=ye(n.value.outline??e.value.outline)}),{headers:a,hasLocalNav:t}}const nt={class:"menu-text"},at={class:"header"},tt={class:"outline"},ot=f({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(e){const n=e,{theme:a}=C(),t=j(!1),o=j(0),c=j(),r=j();function u(S){var I;(I=c.value)!=null&&I.contains(S.target)||(t.value=!1)}L(t,S=>{if(S){document.addEventListener("click",u);return}document.removeEventListener("click",u)}),Be("Escape",()=>{t.value=!1}),ae(()=>{t.value=!1});function d(){t.value=!t.value,o.value=window.innerHeight+Math.min(window.scrollY-n.navHeight,0)}function x(S){S.target.classList.contains("outline-link")&&(r.value&&(r.value.style.transition="none"),_e(()=>{t.value=!1}))}function g(){t.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(S,I)=>(i(),s("div",{class:"VPLocalNavOutlineDropdown",style:fe({"--vp-vh":o.value+"px"}),ref_key:"main",ref:c},[e.headers.length>0?(i(),s("button",{key:0,onClick:d,class:T({open:t.value})},[h("span",nt,w(l(Pe)(l(a))),1),I[0]||(I[0]=h("span",{class:"vpi-chevron-right icon"},null,-1))],2)):(i(),s("button",{key:1,onClick:g},w(l(a).returnToTopLabel||"Return to top"),1)),_(ee,{name:"flyout"},{default:p(()=>[t.value?(i(),s("div",{key:0,ref_key:"items",ref:r,class:"items",onClick:x},[h("div",at,[h("a",{class:"top-link",href:"#",onClick:g},w(l(a).returnToTopLabel||"Return to top"),1)]),h("div",tt,[_(Fe,{headers:e.headers},null,8,["headers"])])],512)):b("",!0)]),_:1})],4))}}),it=k(ot,[["__scopeId","data-v-6b867909"]]),lt={class:"container"},ct=["aria-expanded"],rt={class:"menu-text"},st=f({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(e){const{theme:n,frontmatter:a}=C(),{hasSidebar:t}=q(),{headers:o}=et(),{y:c}=Ie(),r=j(0);U(()=>{r.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),ae(()=>{o.value=ye(a.value.outline??n.value.outline)});const u=v(()=>o.value.length===0),d=v(()=>u.value&&!t.value),x=v(()=>({VPLocalNav:!0,"has-sidebar":t.value,empty:u.value,fixed:d.value}));return(g,S)=>l(a).layout!=="home"&&(!d.value||l(c)>=r.value)?(i(),s("div",{key:0,class:T(x.value)},[h("div",lt,[l(t)?(i(),s("button",{key:0,class:"menu","aria-expanded":e.open,"aria-controls":"VPSidebarNav",onClick:S[0]||(S[0]=I=>g.$emit("open-menu"))},[S[1]||(S[1]=h("span",{class:"vpi-align-left menu-icon"},null,-1)),h("span",rt,w(l(n).sidebarMenuLabel||"Menu"),1)],8,ct)):b("",!0),_(it,{headers:l(o),navHeight:r.value},null,8,["headers","navHeight"])])],2)):b("",!0)}}),mt=k(st,[["__scopeId","data-v-2488c25a"]]);function dt(){const e=j(!1);function n(){e.value=!0,window.addEventListener("resize",o)}function a(){e.value=!1,window.removeEventListener("resize",o)}function t(){e.value?a():n()}function o(){window.outerWidth>=768&&a()}const c=te();return L(()=>c.path,a),{isScreenOpen:e,openScreen:n,closeScreen:a,toggleScreen:t}}const ht={},ut={class:"VPSwitch",type:"button",role:"switch"},pt={class:"check"},bt={key:0,class:"icon"};function ft(e,n){return i(),s("button",ut,[h("span",pt,[e.$slots.default?(i(),s("span",bt,[m(e.$slots,"default",{},void 0,!0)])):b("",!0)])])}const _t=k(ht,[["render",ft],["__scopeId","data-v-b4ccac88"]]),gt=f({__name:"VPSwitchAppearance",setup(e){const{isDark:n,theme:a}=C(),t=oe("toggle-appearance",()=>{n.value=!n.value}),o=j("");return be(()=>{o.value=n.value?a.value.lightModeSwitchTitle||"Switch to light theme":a.value.darkModeSwitchTitle||"Switch to dark theme"}),(c,r)=>(i(),y(_t,{title:o.value,class:"VPSwitchAppearance","aria-checked":l(n),onClick:l(t)},{default:p(()=>[...r[0]||(r[0]=[h("span",{class:"vpi-sun sun"},null,-1),h("span",{class:"vpi-moon moon"},null,-1)])]),_:1},8,["title","aria-checked","onClick"]))}}),ke=k(gt,[["__scopeId","data-v-be9742d9"]]),yt={key:0,class:"VPNavBarAppearance"},kt=f({__name:"VPNavBarAppearance",setup(e){const{site:n}=C();return(a,t)=>l(n).appearance&&l(n).appearance!=="force-dark"&&l(n).appearance!=="force-auto"?(i(),s("div",yt,[_(ke)])):b("",!0)}}),vt=k(kt,[["__scopeId","data-v-3f90c1a5"]]),ve=j();let ze=!1,ce=0;function xt(e){const n=j(!1);if(ie){!ze&&St(),ce++;const a=L(ve,t=>{var o,c,r;t===e.el.value||(o=e.el.value)!=null&&o.contains(t)?(n.value=!0,(c=e.onFocus)==null||c.call(e)):(n.value=!1,(r=e.onBlur)==null||r.call(e))});pe(()=>{a(),ce--,ce||Ct()})}return qe(n)}function St(){document.addEventListener("focusin",Re),ze=!0,ve.value=document.activeElement}function Ct(){document.removeEventListener("focusin",Re)}function Re(){ve.value=document.activeElement}const wt={class:"VPMenuLink"},Nt=["innerHTML"],It=f({__name:"VPMenuLink",props:{item:{}},setup(e){const{page:n}=C();return(a,t)=>(i(),s("div",wt,[_(V,{class:T({active:l(H)(l(n).relativePath,e.item.activeMatch||e.item.link,!!e.item.activeMatch)}),href:e.item.link,target:e.item.target,rel:e.item.rel,"no-icon":e.item.noIcon},{default:p(()=>[h("span",{innerHTML:e.item.text},null,8,Nt)]),_:1},8,["class","href","target","rel","no-icon"])]))}}),le=k(It,[["__scopeId","data-v-7eeeb2dc"]]),jt={class:"VPMenuGroup"},Et={key:0,class:"title"},Tt=f({__name:"VPMenuGroup",props:{text:{},items:{}},setup(e){return(n,a)=>(i(),s("div",jt,[e.text?(i(),s("p",Et,w(e.text),1)):b("",!0),(i(!0),s(P,null,O(e.items,t=>(i(),s(P,null,["link"in t?(i(),y(le,{key:0,item:t},null,8,["item"])):b("",!0)],64))),256))]))}}),At=k(Tt,[["__scopeId","data-v-a6b0397c"]]),Pt={class:"VPMenu"},Ft={key:0,class:"items"},zt=f({__name:"VPMenu",props:{items:{}},setup(e){return(n,a)=>(i(),s("div",Pt,[e.items?(i(),s("div",Ft,[(i(!0),s(P,null,O(e.items,t=>(i(),s(P,{key:JSON.stringify(t)},["link"in t?(i(),y(le,{key:0,item:t},null,8,["item"])):"component"in t?(i(),y(W(t.component),G({key:1,ref_for:!0},t.props),null,16)):(i(),y(At,{key:2,text:t.text,items:t.items},null,8,["text","items"]))],64))),128))])):b("",!0),m(n.$slots,"default",{},void 0,!0)]))}}),Rt=k(zt,[["__scopeId","data-v-20ed86d6"]]),Ot=["aria-expanded","aria-label"],Mt={key:0,class:"text"},Dt=["innerHTML"],$t={key:1,class:"vpi-more-horizontal icon"},Wt={class:"menu"},Vt=f({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(e){const n=j(!1),a=j();xt({el:a,onBlur:t});function t(){n.value=!1}return(o,c)=>(i(),s("div",{class:"VPFlyout",ref_key:"el",ref:a,onMouseenter:c[1]||(c[1]=r=>n.value=!0),onMouseleave:c[2]||(c[2]=r=>n.value=!1)},[h("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":n.value,"aria-label":e.label,onClick:c[0]||(c[0]=r=>n.value=!n.value)},[e.button||e.icon?(i(),s("span",Mt,[e.icon?(i(),s("span",{key:0,class:T([e.icon,"option-icon"])},null,2)):b("",!0),e.button?(i(),s("span",{key:1,innerHTML:e.button},null,8,Dt)):b("",!0),c[3]||(c[3]=h("span",{class:"vpi-chevron-down text-icon"},null,-1))])):(i(),s("span",$t))],8,Ot),h("div",Wt,[_(Rt,{items:e.items},{default:p(()=>[m(o.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),xe=k(Vt,[["__scopeId","data-v-bfe7971f"]]),Jt=["href","aria-label","innerHTML"],Lt=f({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(e){const n=e,a=j();U(async()=>{var c;await _e();const o=(c=a.value)==null?void 0:c.children[0];o instanceof HTMLElement&&o.className.startsWith("vpi-social-")&&(getComputedStyle(o).maskImage||getComputedStyle(o).webkitMaskImage)==="none"&&o.style.setProperty("--icon",`url('https://api.iconify.design/simple-icons/${n.icon}.svg')`)});const t=v(()=>typeof n.icon=="object"?n.icon.svg:`<span class="vpi-social-${n.icon}"></span>`);return(o,c)=>(i(),s("a",{ref_key:"el",ref:a,class:"VPSocialLink no-icon",href:e.link,"aria-label":e.ariaLabel??(typeof e.icon=="string"?e.icon:""),target:"_blank",rel:"noopener",innerHTML:t.value},null,8,Jt))}}),Bt=k(Lt,[["__scopeId","data-v-60a9a2d3"]]),qt={class:"VPSocialLinks"},Gt=f({__name:"VPSocialLinks",props:{links:{}},setup(e){return(n,a)=>(i(),s("div",qt,[(i(!0),s(P,null,O(e.links,({link:t,icon:o,ariaLabel:c})=>(i(),y(Bt,{key:t,icon:o,link:t,ariaLabel:c},null,8,["icon","link","ariaLabel"]))),128))]))}}),Se=k(Gt,[["__scopeId","data-v-e71e869c"]]),Ut={key:0,class:"group translations"},Ht={class:"trans-title"},Yt={key:1,class:"group"},Kt={class:"item appearance"},Qt={class:"label"},Zt={class:"appearance-action"},Xt={key:2,class:"group"},eo={class:"item social-links"},no=f({__name:"VPNavBarExtra",setup(e){const{site:n,theme:a}=C(),{localeLinks:t,currentLang:o}=K({correspondingLink:!0}),c=v(()=>t.value.length&&o.value.label||n.value.appearance||a.value.socialLinks);return(r,u)=>c.value?(i(),y(xe,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:p(()=>[l(t).length&&l(o).label?(i(),s("div",Ut,[h("p",Ht,w(l(o).label),1),(i(!0),s(P,null,O(l(t),d=>(i(),y(le,{key:d.link,item:d},null,8,["item"]))),128))])):b("",!0),l(n).appearance&&l(n).appearance!=="force-dark"&&l(n).appearance!=="force-auto"?(i(),s("div",Yt,[h("div",Kt,[h("p",Qt,w(l(a).darkModeSwitchLabel||"Appearance"),1),h("div",Zt,[_(ke)])])])):b("",!0),l(a).socialLinks?(i(),s("div",Xt,[h("div",eo,[_(Se,{class:"social-links-list",links:l(a).socialLinks},null,8,["links"])])])):b("",!0)]),_:1})):b("",!0)}}),ao=k(no,[["__scopeId","data-v-f953d92f"]]),to=["aria-expanded"],oo=f({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(e){return(n,a)=>(i(),s("button",{type:"button",class:T(["VPNavBarHamburger",{active:e.active}]),"aria-label":"mobile navigation","aria-expanded":e.active,"aria-controls":"VPNavScreen",onClick:a[0]||(a[0]=t=>n.$emit("click"))},[...a[1]||(a[1]=[h("span",{class:"container"},[h("span",{class:"top"}),h("span",{class:"middle"}),h("span",{class:"bottom"})],-1)])],10,to))}}),io=k(oo,[["__scopeId","data-v-6bee1efd"]]),lo=["innerHTML"],co=f({__name:"VPNavBarMenuLink",props:{item:{}},setup(e){const{page:n}=C();return(a,t)=>(i(),y(V,{class:T({VPNavBarMenuLink:!0,active:l(H)(l(n).relativePath,e.item.activeMatch||e.item.link,!!e.item.activeMatch)}),href:e.item.link,target:e.item.target,rel:e.item.rel,"no-icon":e.item.noIcon,tabindex:"0"},{default:p(()=>[h("span",{innerHTML:e.item.text},null,8,lo)]),_:1},8,["class","href","target","rel","no-icon"]))}}),ro=k(co,[["__scopeId","data-v-815115f5"]]),so=f({__name:"VPNavBarMenuGroup",props:{item:{}},setup(e){const n=e,{page:a}=C(),t=c=>"component"in c?!1:"link"in c?H(a.value.relativePath,c.link,!!n.item.activeMatch):c.items.some(t),o=v(()=>t(n.item));return(c,r)=>(i(),y(xe,{class:T({VPNavBarMenuGroup:!0,active:l(H)(l(a).relativePath,e.item.activeMatch,!!e.item.activeMatch)||o.value}),button:e.item.text,items:e.item.items},null,8,["class","button","items"]))}}),mo={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},ho=f({__name:"VPNavBarMenu",setup(e){const{theme:n}=C();return(a,t)=>l(n).nav?(i(),s("nav",mo,[t[0]||(t[0]=h("span",{id:"main-nav-aria-label",class:"visually-hidden"}," Main Navigation ",-1)),(i(!0),s(P,null,O(l(n).nav,o=>(i(),s(P,{key:JSON.stringify(o)},["link"in o?(i(),y(ro,{key:0,item:o},null,8,["item"])):"component"in o?(i(),y(W(o.component),G({key:1,ref_for:!0},o.props),null,16)):(i(),y(so,{key:2,item:o},null,8,["item"]))],64))),128))])):b("",!0)}}),uo=k(ho,[["__scopeId","data-v-afb2845e"]]);function po(e){const{localeIndex:n,theme:a}=C();function t(o){var F,z,R;const c=o.split("."),r=(F=a.value.search)==null?void 0:F.options,u=r&&typeof r=="object",d=u&&((R=(z=r.locales)==null?void 0:z[n.value])==null?void 0:R.translations)||null,x=u&&r.translations||null;let g=d,S=x,I=e;const A=c.pop();for(const M of c){let $=null;const N=I==null?void 0:I[M];N&&($=I=N);const E=S==null?void 0:S[M];E&&($=S=E);const D=g==null?void 0:g[M];D&&($=g=D),N||(I=$),E||(S=$),D||(g=$)}return(g==null?void 0:g[A])??(S==null?void 0:S[A])??(I==null?void 0:I[A])??""}return t}const bo=["aria-label"],fo={class:"DocSearch-Button-Container"},_o={class:"DocSearch-Button-Placeholder"},Ce=f({__name:"VPNavBarSearchButton",setup(e){const a=po({button:{buttonText:"Search",buttonAriaLabel:"Search"}});return(t,o)=>(i(),s("button",{type:"button",class:"DocSearch DocSearch-Button","aria-label":l(a)("button.buttonAriaLabel")},[h("span",fo,[o[0]||(o[0]=h("span",{class:"vp-icon DocSearch-Search-Icon"},null,-1)),h("span",_o,w(l(a)("button.buttonText")),1)]),o[1]||(o[1]=h("span",{class:"DocSearch-Button-Keys"},[h("kbd",{class:"DocSearch-Button-Key"}),h("kbd",{class:"DocSearch-Button-Key"},"K")],-1))],8,bo))}}),go={class:"VPNavBarSearch"},yo={id:"local-search"},ko={key:1,id:"docsearch"},vo=f({__name:"VPNavBarSearch",setup(e){const n=()=>null,a=()=>null,{theme:t}=C(),o=j(!1),c=j(!1);U(()=>{});function r(){o.value||(o.value=!0,setTimeout(u,16))}function u(){const g=new Event("keydown");g.key="k",g.metaKey=!0,window.dispatchEvent(g),setTimeout(()=>{document.querySelector(".DocSearch-Modal")||u()},16)}const d=j(!1),x="";return(g,S)=>{var I;return i(),s("div",go,[l(x)==="local"?(i(),s(P,{key:0},[d.value?(i(),y(l(n),{key:0,onClose:S[0]||(S[0]=A=>d.value=!1)})):b("",!0),h("div",yo,[_(Ce,{onClick:S[1]||(S[1]=A=>d.value=!0)})])],64)):l(x)==="algolia"?(i(),s(P,{key:1},[o.value?(i(),y(l(a),{key:0,algolia:((I=l(t).search)==null?void 0:I.options)??l(t).algolia,onVnodeBeforeMount:S[2]||(S[2]=A=>c.value=!0)},null,8,["algolia"])):b("",!0),c.value?b("",!0):(i(),s("div",ko,[_(Ce,{onClick:r})]))],64)):b("",!0)])}}}),xo=f({__name:"VPNavBarSocialLinks",setup(e){const{theme:n}=C();return(a,t)=>l(n).socialLinks?(i(),y(Se,{key:0,class:"VPNavBarSocialLinks",links:l(n).socialLinks},null,8,["links"])):b("",!0)}}),So=k(xo,[["__scopeId","data-v-ef6192dc"]]),Co=["href","rel","target"],wo=["innerHTML"],No={key:2},Io=f({__name:"VPNavBarTitle",setup(e){const{site:n,theme:a}=C(),{hasSidebar:t}=q(),{currentLang:o}=K(),c=v(()=>{var d;return typeof a.value.logoLink=="string"?a.value.logoLink:(d=a.value.logoLink)==null?void 0:d.link}),r=v(()=>{var d;return typeof a.value.logoLink=="string"||(d=a.value.logoLink)==null?void 0:d.rel}),u=v(()=>{var d;return typeof a.value.logoLink=="string"||(d=a.value.logoLink)==null?void 0:d.target});return(d,x)=>(i(),s("div",{class:T(["VPNavBarTitle",{"has-sidebar":l(t)}])},[h("a",{class:"title",href:c.value??l(ge)(l(o).link),rel:r.value,target:u.value},[m(d.$slots,"nav-bar-title-before",{},void 0,!0),l(a).logo?(i(),y(X,{key:0,class:"logo",image:l(a).logo},null,8,["image"])):b("",!0),l(a).siteTitle?(i(),s("span",{key:1,innerHTML:l(a).siteTitle},null,8,wo)):l(a).siteTitle===void 0?(i(),s("span",No,w(l(n).title),1)):b("",!0),m(d.$slots,"nav-bar-title-after",{},void 0,!0)],8,Co)],2))}}),jo=k(Io,[["__scopeId","data-v-9f43907a"]]),Eo={class:"items"},To={class:"title"},Ao=f({__name:"VPNavBarTranslations",setup(e){const{theme:n}=C(),{localeLinks:a,currentLang:t}=K({correspondingLink:!0});return(o,c)=>l(a).length&&l(t).label?(i(),y(xe,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:l(n).langMenuLabel||"Change language"},{default:p(()=>[h("div",Eo,[h("p",To,w(l(t).label),1),(i(!0),s(P,null,O(l(a),r=>(i(),y(le,{key:r.link,item:r},null,8,["item"]))),128))])]),_:1},8,["label"])):b("",!0)}}),Po=k(Ao,[["__scopeId","data-v-acee064b"]]),Fo={class:"wrapper"},zo={class:"container"},Ro={class:"title"},Oo={class:"content"},Mo={class:"content-body"},Do=f({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(e){const n=e,{y:a}=Ie(),{hasSidebar:t}=q(),{frontmatter:o}=C(),c=j({});return be(()=>{c.value={"has-sidebar":t.value,home:o.value.layout==="home",top:a.value===0,"screen-open":n.isScreenOpen}}),(r,u)=>(i(),s("div",{class:T(["VPNavBar",c.value])},[h("div",Fo,[h("div",zo,[h("div",Ro,[_(jo,null,{"nav-bar-title-before":p(()=>[m(r.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":p(()=>[m(r.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),h("div",Oo,[h("div",Mo,[m(r.$slots,"nav-bar-content-before",{},void 0,!0),_(vo,{class:"search"}),_(uo,{class:"menu"}),_(Po,{class:"translations"}),_(vt,{class:"appearance"}),_(So,{class:"social-links"}),_(ao,{class:"extra"}),m(r.$slots,"nav-bar-content-after",{},void 0,!0),_(io,{class:"hamburger",active:e.isScreenOpen,onClick:u[0]||(u[0]=d=>r.$emit("toggle-screen"))},null,8,["active"])])])])]),u[1]||(u[1]=h("div",{class:"divider"},[h("div",{class:"divider-line"})],-1))],2))}}),$o=k(Do,[["__scopeId","data-v-9fd4d1dd"]]),Wo={key:0,class:"VPNavScreenAppearance"},Vo={class:"text"},Jo=f({__name:"VPNavScreenAppearance",setup(e){const{site:n,theme:a}=C();return(t,o)=>l(n).appearance&&l(n).appearance!=="force-dark"&&l(n).appearance!=="force-auto"?(i(),s("div",Wo,[h("p",Vo,w(l(a).darkModeSwitchLabel||"Appearance"),1),_(ke)])):b("",!0)}}),Lo=k(Jo,[["__scopeId","data-v-a3e2920d"]]),Bo=["innerHTML"],qo=f({__name:"VPNavScreenMenuLink",props:{item:{}},setup(e){const n=oe("close-screen");return(a,t)=>(i(),y(V,{class:"VPNavScreenMenuLink",href:e.item.link,target:e.item.target,rel:e.item.rel,"no-icon":e.item.noIcon,onClick:l(n)},{default:p(()=>[h("span",{innerHTML:e.item.text},null,8,Bo)]),_:1},8,["href","target","rel","no-icon","onClick"]))}}),Go=k(qo,[["__scopeId","data-v-fa963d97"]]),Uo=["innerHTML"],Ho=f({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(e){const n=oe("close-screen");return(a,t)=>(i(),y(V,{class:"VPNavScreenMenuGroupLink",href:e.item.link,target:e.item.target,rel:e.item.rel,"no-icon":e.item.noIcon,onClick:l(n)},{default:p(()=>[h("span",{innerHTML:e.item.text},null,8,Uo)]),_:1},8,["href","target","rel","no-icon","onClick"]))}}),Oe=k(Ho,[["__scopeId","data-v-e04f3e85"]]),Yo={class:"VPNavScreenMenuGroupSection"},Ko={key:0,class:"title"},Qo=f({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(e){return(n,a)=>(i(),s("div",Yo,[e.text?(i(),s("p",Ko,w(e.text),1)):b("",!0),(i(!0),s(P,null,O(e.items,t=>(i(),y(Oe,{key:t.text,item:t},null,8,["item"]))),128))]))}}),Zo=k(Qo,[["__scopeId","data-v-f60dbfa7"]]),Xo=["aria-controls","aria-expanded"],ei=["innerHTML"],ni=["id"],ai={key:0,class:"item"},ti={key:1,class:"item"},oi={key:2,class:"group"},ii=f({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(e){const n=e,a=j(!1),t=v(()=>`NavScreenGroup-${n.text.replace(" ","-").toLowerCase()}`);function o(){a.value=!a.value}return(c,r)=>(i(),s("div",{class:T(["VPNavScreenMenuGroup",{open:a.value}])},[h("button",{class:"button","aria-controls":t.value,"aria-expanded":a.value,onClick:o},[h("span",{class:"button-text",innerHTML:e.text},null,8,ei),r[0]||(r[0]=h("span",{class:"vpi-plus button-icon"},null,-1))],8,Xo),h("div",{id:t.value,class:"items"},[(i(!0),s(P,null,O(e.items,u=>(i(),s(P,{key:JSON.stringify(u)},["link"in u?(i(),s("div",ai,[_(Oe,{item:u},null,8,["item"])])):"component"in u?(i(),s("div",ti,[(i(),y(W(u.component),G({ref_for:!0},u.props,{"screen-menu":""}),null,16))])):(i(),s("div",oi,[_(Zo,{text:u.text,items:u.items},null,8,["text","items"])]))],64))),128))],8,ni)],2))}}),li=k(ii,[["__scopeId","data-v-d99bfeec"]]),ci={key:0,class:"VPNavScreenMenu"},ri=f({__name:"VPNavScreenMenu",setup(e){const{theme:n}=C();return(a,t)=>l(n).nav?(i(),s("nav",ci,[(i(!0),s(P,null,O(l(n).nav,o=>(i(),s(P,{key:JSON.stringify(o)},["link"in o?(i(),y(Go,{key:0,item:o},null,8,["item"])):"component"in o?(i(),y(W(o.component),G({key:1,ref_for:!0},o.props,{"screen-menu":""}),null,16)):(i(),y(li,{key:2,text:o.text||"",items:o.items},null,8,["text","items"]))],64))),128))])):b("",!0)}}),si=f({__name:"VPNavScreenSocialLinks",setup(e){const{theme:n}=C();return(a,t)=>l(n).socialLinks?(i(),y(Se,{key:0,class:"VPNavScreenSocialLinks",links:l(n).socialLinks},null,8,["links"])):b("",!0)}}),mi={class:"list"},di=f({__name:"VPNavScreenTranslations",setup(e){const{localeLinks:n,currentLang:a}=K({correspondingLink:!0}),t=j(!1);function o(){t.value=!t.value}return(c,r)=>l(n).length&&l(a).label?(i(),s("div",{key:0,class:T(["VPNavScreenTranslations",{open:t.value}])},[h("button",{class:"title",onClick:o},[r[0]||(r[0]=h("span",{class:"vpi-languages icon lang"},null,-1)),J(" "+w(l(a).label)+" ",1),r[1]||(r[1]=h("span",{class:"vpi-chevron-down icon chevron"},null,-1))]),h("ul",mi,[(i(!0),s(P,null,O(l(n),u=>(i(),s("li",{key:u.link,class:"item"},[_(V,{class:"link",href:u.link},{default:p(()=>[J(w(u.text),1)]),_:2},1032,["href"])]))),128))])],2)):b("",!0)}}),hi=k(di,[["__scopeId","data-v-516e4bc3"]]),ui={class:"container"},pi=f({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(e){const n=j(null),a=je(ie?document.body:null);return(t,o)=>(i(),y(ee,{name:"fade",onEnter:o[0]||(o[0]=c=>a.value=!0),onAfterLeave:o[1]||(o[1]=c=>a.value=!1)},{default:p(()=>[e.open?(i(),s("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:n,id:"VPNavScreen"},[h("div",ui,[m(t.$slots,"nav-screen-content-before",{},void 0,!0),_(ri,{class:"menu"}),_(hi,{class:"translations"}),_(Lo,{class:"appearance"}),_(si,{class:"social-links"}),m(t.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):b("",!0)]),_:3}))}}),bi=k(pi,[["__scopeId","data-v-2dd6d0c7"]]),fi={key:0,class:"VPNav"},_i=f({__name:"VPNav",setup(e){const{isScreenOpen:n,closeScreen:a,toggleScreen:t}=dt(),{frontmatter:o}=C(),c=v(()=>o.value.navbar!==!1);return Ee("close-screen",a),ne(()=>{ie&&document.documentElement.classList.toggle("hide-nav",!c.value)}),(r,u)=>c.value?(i(),s("header",fi,[_($o,{"is-screen-open":l(n),onToggleScreen:l(t)},{"nav-bar-title-before":p(()=>[m(r.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":p(()=>[m(r.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":p(()=>[m(r.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":p(()=>[m(r.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),_(bi,{open:l(n)},{"nav-screen-content-before":p(()=>[m(r.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":p(()=>[m(r.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):b("",!0)}}),gi=k(_i,[["__scopeId","data-v-7ad780c2"]]),yi=["role","tabindex"],ki={key:1,class:"items"},vi=f({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(e){const n=e,{collapsed:a,collapsible:t,isLink:o,isActiveLink:c,hasActiveLink:r,hasChildren:u,toggle:d}=bn(v(()=>n.item)),x=v(()=>u.value?"section":"div"),g=v(()=>o.value?"a":"div"),S=v(()=>u.value?n.depth+2===7?"p":`h${n.depth+2}`:"p"),I=v(()=>o.value?void 0:"button"),A=v(()=>[[`level-${n.depth}`],{collapsible:t.value},{collapsed:a.value},{"is-link":o.value},{"is-active":c.value},{"has-active":r.value}]);function F(R){"key"in R&&R.key!=="Enter"||!n.item.link&&d()}function z(){n.item.link&&d()}return(R,M)=>{const $=B("VPSidebarItem",!0);return i(),y(W(x.value),{class:T(["VPSidebarItem",A.value])},{default:p(()=>[e.item.text?(i(),s("div",G({key:0,class:"item",role:I.value},Ge(e.item.items?{click:F,keydown:F}:{},!0),{tabindex:e.item.items&&0}),[M[1]||(M[1]=h("div",{class:"indicator"},null,-1)),e.item.link?(i(),y(V,{key:0,tag:g.value,class:"link",href:e.item.link,rel:e.item.rel,target:e.item.target},{default:p(()=>[(i(),y(W(S.value),{class:"text",innerHTML:e.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(i(),y(W(S.value),{key:1,class:"text",innerHTML:e.item.text},null,8,["innerHTML"])),e.item.collapsed!=null&&e.item.items&&e.item.items.length?(i(),s("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:z,onKeydown:Ue(z,["enter"]),tabindex:"0"},[...M[0]||(M[0]=[h("span",{class:"vpi-chevron-right caret-icon"},null,-1)])],32)):b("",!0)],16,yi)):b("",!0),e.item.items&&e.item.items.length?(i(),s("div",ki,[e.depth<5?(i(!0),s(P,{key:0},O(e.item.items,N=>(i(),y($,{key:N.text,item:N,depth:e.depth+1},null,8,["item","depth"]))),128)):b("",!0)])):b("",!0)]),_:1},8,["class"])}}}),xi=k(vi,[["__scopeId","data-v-0009425e"]]),Si=f({__name:"VPSidebarGroup",props:{items:{}},setup(e){const n=j(!0);let a=null;return U(()=>{a=setTimeout(()=>{a=null,n.value=!1},300)}),He(()=>{a!=null&&(clearTimeout(a),a=null)}),(t,o)=>(i(!0),s(P,null,O(e.items,c=>(i(),s("div",{key:c.text,class:T(["group",{"no-transition":n.value}])},[_(xi,{item:c,depth:0},null,8,["item"])],2))),128))}}),Ci=k(Si,[["__scopeId","data-v-51288d80"]]),wi={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},Ni=f({__name:"VPSidebar",props:{open:{type:Boolean}},setup(e){const{sidebarGroups:n,hasSidebar:a}=q(),t=e,o=j(null),c=je(ie?document.body:null);L([t,o],()=>{var u;t.open?(c.value=!0,(u=o.value)==null||u.focus()):c.value=!1},{immediate:!0,flush:"post"});const r=j(0);return L(n,()=>{r.value+=1},{deep:!0}),(u,d)=>l(a)?(i(),s("aside",{key:0,class:T(["VPSidebar",{open:e.open}]),ref_key:"navEl",ref:o,onClick:d[0]||(d[0]=se(()=>{},["stop"]))},[d[2]||(d[2]=h("div",{class:"curtain"},null,-1)),h("nav",wi,[d[1]||(d[1]=h("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),m(u.$slots,"sidebar-nav-before",{},void 0,!0),(i(),y(Ci,{items:l(n),key:r.value},null,8,["items"])),m(u.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):b("",!0)}}),Ii=k(Ni,[["__scopeId","data-v-42c4c606"]]),ji=f({__name:"VPSkipLink",setup(e){const{theme:n}=C(),a=te(),t=j();L(()=>a.path,()=>t.value.focus());function o({target:c}){const r=document.getElementById(decodeURIComponent(c.hash).slice(1));if(r){const u=()=>{r.removeAttribute("tabindex"),r.removeEventListener("blur",u)};r.setAttribute("tabindex","-1"),r.addEventListener("blur",u),r.focus(),window.scrollTo(0,0)}}return(c,r)=>(i(),s(P,null,[h("span",{ref_key:"backToTop",ref:t,tabindex:"-1"},null,512),h("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:o},w(l(n).skipToContentLabel||"Skip to content"),1)],64))}}),Ei=k(ji,[["__scopeId","data-v-fcbfc0e0"]]),Ti=f({__name:"Layout",setup(e){const{isOpen:n,open:a,close:t}=q(),o=te();L(()=>o.path,t),pn(n,t);const{frontmatter:c}=C(),r=Te(),u=v(()=>!!r["home-hero-image"]);return Ee("hero-image-slot-exists",u),(d,x)=>{const g=B("Content");return l(c).layout!==!1?(i(),s("div",{key:0,class:T(["Layout",l(c).pageClass])},[m(d.$slots,"layout-top",{},void 0,!0),_(Ei),_(en,{class:"backdrop",show:l(n),onClick:l(t)},null,8,["show","onClick"]),_(gi,null,{"nav-bar-title-before":p(()=>[m(d.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":p(()=>[m(d.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":p(()=>[m(d.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":p(()=>[m(d.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":p(()=>[m(d.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":p(()=>[m(d.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),_(mt,{open:l(n),onOpenMenu:l(a)},null,8,["open","onOpenMenu"]),_(Ii,{open:l(n)},{"sidebar-nav-before":p(()=>[m(d.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":p(()=>[m(d.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),_(Ha,null,{"page-top":p(()=>[m(d.$slots,"page-top",{},void 0,!0)]),"page-bottom":p(()=>[m(d.$slots,"page-bottom",{},void 0,!0)]),"not-found":p(()=>[m(d.$slots,"not-found",{},void 0,!0)]),"home-hero-before":p(()=>[m(d.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":p(()=>[m(d.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":p(()=>[m(d.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":p(()=>[m(d.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":p(()=>[m(d.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":p(()=>[m(d.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":p(()=>[m(d.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":p(()=>[m(d.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":p(()=>[m(d.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":p(()=>[m(d.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":p(()=>[m(d.$slots,"doc-before",{},void 0,!0)]),"doc-after":p(()=>[m(d.$slots,"doc-after",{},void 0,!0)]),"doc-top":p(()=>[m(d.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":p(()=>[m(d.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":p(()=>[m(d.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":p(()=>[m(d.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":p(()=>[m(d.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":p(()=>[m(d.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":p(()=>[m(d.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":p(()=>[m(d.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),_(Xa),m(d.$slots,"layout-bottom",{},void 0,!0)],2)):(i(),y(g,{key:1}))}}}),Ai=k(Ti,[["__scopeId","data-v-d8b57b2d"]]),Pi={Layout:Ai,enhanceApp:({app:e})=>{e.component("Badge",Qe)}},Fi={class:"pydoc-icon","aria-hidden":"true"},zi={class:"pydoc-label"},Ri={class:"pydoc-panel-header"},Oi={class:"pydoc-panel-kind"},Mi={class:"pydoc-panel-path"},Di={key:0,class:"pydoc-panel-sig"},$i={key:1,class:"pydoc-panel-parents"},Wi={key:2,class:"pydoc-panel-doc"},Vi={key:3,class:"pydoc-panel-file"},Ji={key:4,class:"pydoc-panel-unknown"},Me={__name:"Pydoc",props:{caption:String},setup(e){const n=e,a=Te(),o=Ye().appContext.config.globalProperties.$pydocData,c=j(!1),r=j(null),u=j(null),d=j({});function x(N){return N?typeof N=="string"?N:(Array.isArray(N)||(N=[N]),N.map(E=>typeof E=="string"?E:typeof E=="number"?String(E):E==null?"":typeof E.children=="string"?E.children:Array.isArray(E.children)?x(E.children):"").join("").trim()):""}const g=v(()=>{var D;const N=(D=a.default)==null?void 0:D.call(a),E=x(N)||"<undefined>";return E in o?o[E]:{kind:"unknown",name:E,path:E}}),S=v(()=>{switch(g.value.kind){case"class":return"C";case"routine":return"f";case"module":return"M";default:return"?"}}),I=v(()=>{if(n.caption)return n.caption;let N=g.value.path;return g.value.kind==="routine"&&(N=N+"()"),N.startsWith("machinable.")&&(N=N.substring(11)),N}),A=v(()=>`${g.value.realname||g.value.path.split(".").pop()}${g.value.signature||"()"}`);function F(){c.value=!1}function z(N){var E;(E=r.value)!=null&&E.contains(N.target)||F()}function R(N){N.key==="Escape"&&F()}async function M(){c.value=!c.value,c.value&&(await _e(),$())}L(c,N=>{N?setTimeout(()=>{document.addEventListener("click",z),document.addEventListener("keydown",R)},0):(document.removeEventListener("click",z),document.removeEventListener("keydown",R))});function $(){if(!r.value||!u.value)return;const N=r.value.getBoundingClientRect(),E=420,D=12;let Q=N.bottom+6,Y=N.left;if(Y+E>window.innerWidth-D&&(Y=window.innerWidth-E-D),Y<D&&(Y=D),Q+200>window.innerHeight){Q=N.top-6,d.value={position:"fixed",left:Y+"px",bottom:window.innerHeight-Q+"px",top:"auto",width:E+"px"};return}d.value={position:"fixed",left:Y+"px",top:Q+"px",width:E+"px"}}return(N,E)=>{const D=B("ClientOnly");return i(),s("span",{class:"pydoc-wrapper",ref_key:"wrapperRef",ref:r},[h("a",{href:"#",class:T(["pydoc-link",[`pydoc-${g.value.kind}`]]),onClick:se(M,["prevent","stop"])},[h("span",Fi,w(S.value),1),h("span",zi,w(I.value),1)],2),_(D,null,{default:p(()=>[(i(),y(Ke,{to:"body"},[_(ee,{name:"pydoc-fade"},{default:p(()=>[c.value?(i(),s("div",{key:0,class:"pydoc-panel",ref_key:"panelRef",ref:u,style:fe(d.value),onClick:E[0]||(E[0]=se(()=>{},["stop"]))},[h("div",Ri,[h("span",Oi,w(g.value.kind),1),h("button",{class:"pydoc-panel-close",onClick:F,"aria-label":"Close"},"×")]),h("div",Mi,w(g.value.path),1),g.value.signature?(i(),s("div",Di,[h("code",null,w(A.value),1)])):b("",!0),g.value.parents&&g.value.parents.length?(i(),s("div",$i,[E[1]||(E[1]=J(" Inherits from: ",-1)),h("code",null,w(g.value.parents.join(", ")),1)])):b("",!0),g.value.doc?(i(),s("div",Wi,w(g.value.doc),1)):b("",!0),g.value.file?(i(),s("div",Vi,[E[2]||(E[2]=h("span",{class:"pydoc-panel-file-icon"},"📁",-1)),J(" "+w(g.value.file),1)])):b("",!0),g.value.kind==="unknown"?(i(),s("div",Ji," No API entry found for this symbol. ")):b("",!0)],4)):b("",!0)]),_:1})]))]),_:1})],512)}}},Li={name:"Tree",components:{Pydoc:Me},props:{items:Array}};function Bi(e,n,a,t,o,c){const r=B("Pydoc"),u=B("Tree",!0);return i(),s("ul",null,[(i(!0),s(P,null,O(a.items,d=>(i(),s("li",{key:d.path},[_(r,{caption:d.id},{default:p(()=>[J(w(d.path),1)]),_:2},1032,["caption"]),d.children&&d.children.length>0?(i(),y(u,{key:0,items:d.children},null,8,["items"])):b("",!0)]))),128))])}const qi=k(Li,[["render",Bi]]),Gi={"machinable.Component.all":{kind:"routine",realname:"all",name:"machinable",path:"machinable.Component.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.Component.ancestor":{kind:"routine",realname:null,name:"machinable",path:"machinable.Component.ancestor",signature:null,doc:null},"machinable.Component.as_default":{kind:"routine",realname:"as_default",name:"machinable",path:"machinable.Component.as_default",signature:"(self) -> Self",doc:null},"machinable.Component.as_json":{kind:"routine",realname:"as_json",name:"machinable",path:"machinable.Component.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.Component.cached":{kind:"routine",realname:"cached",name:"machinable",path:"machinable.Component.cached",signature:"(self, cached: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.Component.clone":{kind:"routine",realname:"clone",name:"machinable",path:"machinable.Component.clone",signature:"(self)",doc:null},"machinable.Component.collect":{kind:"routine",realname:"collect",name:"machinable",path:"machinable.Component.collect",signature:null,doc:null},"machinable.Component.commit":{kind:"routine",realname:"commit",name:"machinable",path:"machinable.Component.commit",signature:"(self) -> Self",doc:null},"machinable.Component.compute_context":{kind:"routine",realname:"compute_context",name:"machinable",path:"machinable.Component.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.Component.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable",path:"machinable.Component.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.Component.connected":{kind:"routine",realname:"connected",name:"machinable",path:"machinable.Component.connected",signature:null,doc:null},"machinable.Component.created_at":{kind:"routine",realname:"created_at",name:"machinable",path:"machinable.Component.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.Component.derive":{kind:"routine",realname:"derive",name:"machinable",path:"machinable.Component.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.Component.derived":{kind:"routine",realname:null,name:"machinable",path:"machinable.Component.derived",signature:null,doc:null},"machinable.Component.dispatch":{kind:"routine",realname:"dispatch",name:"machinable",path:"machinable.Component.dispatch",signature:"(self) -> Self",doc:"Dispatch the component lifecycle"},"machinable.Component.dispatch_code":{kind:"routine",realname:"dispatch_code",name:"machinable",path:"machinable.Component.dispatch_code",signature:"(self, inline: bool = True, project_directory: str | None = None, python: str | None = None) -> str | None",doc:null},"machinable.Component.executions":{kind:"routine",realname:null,name:"machinable",path:"machinable.Component.executions",signature:null,doc:null},"machinable.Component.fetch":{kind:"routine",realname:"fetch",name:"machinable",path:"machinable.Component.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.Component.find":{kind:"routine",realname:"find",name:"machinable",path:"machinable.Component.find",signature:null,doc:null},"machinable.Component.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable",path:"machinable.Component.find_by_hash",signature:null,doc:null},"machinable.Component.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable",path:"machinable.Component.find_by_id",signature:null,doc:null},"machinable.Component.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable",path:"machinable.Component.find_many_by_id",signature:null,doc:null},"machinable.Component.from_directory":{kind:"routine",realname:"from_directory",name:"machinable",path:"machinable.Component.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.Component.from_json":{kind:"routine",realname:"from_json",name:"machinable",path:"machinable.Component.from_json",signature:null,doc:null},"machinable.Component.from_model":{kind:"routine",realname:"from_model",name:"machinable",path:"machinable.Component.from_model",signature:null,doc:null},"machinable.Component.future":{kind:"routine",realname:"future",name:"machinable",path:"machinable.Component.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.Component.get":{kind:"routine",realname:"get",name:"machinable",path:"machinable.Component.get",signature:null,doc:null},"machinable.Component.hidden":{kind:"routine",realname:"hidden",name:"machinable",path:"machinable.Component.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.Component.instance":{kind:"routine",realname:"instance",name:"machinable",path:"machinable.Component.instance",signature:null,doc:null},"machinable.Component.is_committed":{kind:"routine",realname:"is_committed",name:"machinable",path:"machinable.Component.is_committed",signature:"(self) -> bool",doc:null},"machinable.Component.is_connected":{kind:"routine",realname:"is_connected",name:"machinable",path:"machinable.Component.is_connected",signature:null,doc:null},"machinable.Component.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable",path:"machinable.Component.is_mounted",signature:"(self) -> bool",doc:null},"machinable.Component.is_staged":{kind:"routine",realname:"is_staged",name:"machinable",path:"machinable.Component.is_staged",signature:"(self) -> bool",doc:null},"machinable.Component.launch":{kind:"routine",realname:"launch",name:"machinable",path:"machinable.Component.launch",signature:"(self) -> Self",doc:null},"machinable.Component.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable",path:"machinable.Component.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Component.load_file":{kind:"routine",realname:"load_file",name:"machinable",path:"machinable.Component.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Component.local_directory":{kind:"routine",realname:"local_directory",name:"machinable",path:"machinable.Component.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.Component.make":{kind:"routine",realname:"make",name:"machinable",path:"machinable.Component.make",signature:null,doc:null},"machinable.Component.matches":{kind:"routine",realname:"matches",name:"machinable",path:"machinable.Component.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.Component.model":{kind:"routine",realname:"model",name:"machinable",path:"machinable.Component.model",signature:null,doc:null},"machinable.Component.new":{kind:"routine",realname:"new",name:"machinable",path:"machinable.Component.new",signature:"(self) -> Self",doc:null},"machinable.Component.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable",path:"machinable.Component.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.Component.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable",path:"machinable.Component.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.Component.on_after_dispatch":{kind:"routine",realname:"on_after_dispatch",name:"machinable",path:"machinable.Component.on_after_dispatch",signature:"(self, success: bool)",doc:`Lifecycle event triggered at the end of the dispatch.

This is triggered independent of whether the execution has been successful or not.

# Arguments
success: Whether the execution finished sucessfully`},"machinable.Component.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable",path:"machinable.Component.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.Component.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable",path:"machinable.Component.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Component.on_before_dispatch":{kind:"routine",realname:"on_before_dispatch",name:"machinable",path:"machinable.Component.on_before_dispatch",signature:"(self) -> bool | None",doc:"Event triggered before the dispatch of the component"},"machinable.Component.on_commit":{kind:"routine",realname:"on_commit",name:"machinable",path:"machinable.Component.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.Component.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable",path:"machinable.Component.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.Component.on_configure":{kind:"routine",realname:"on_configure",name:"machinable",path:"machinable.Component.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Component.on_failure":{kind:"routine",realname:"on_failure",name:"machinable",path:"machinable.Component.on_failure",signature:"(self, exception: Exception) -> None",doc:`Lifecycle event triggered iff the execution finished with an exception

# Arguments
exception: Execution exception`},"machinable.Component.on_finish":{kind:"routine",realname:"on_finish",name:"machinable",path:"machinable.Component.on_finish",signature:"(self, success: bool)",doc:`Lifecycle event triggered right before the end of the component execution

# Arguments
success: Whether the execution finished sucessfully`},"machinable.Component.on_heartbeat":{kind:"routine",realname:"on_heartbeat",name:"machinable",path:"machinable.Component.on_heartbeat",signature:"(self) -> None",doc:"Event triggered on heartbeat every 15 seconds"},"machinable.Component.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable",path:"machinable.Component.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.Component.on_seeding":{kind:"routine",realname:"on_seeding",name:"machinable",path:"machinable.Component.on_seeding",signature:"(self)",doc:"Lifecycle event to implement custom seeding using `self.seed`"},"machinable.Component.on_success":{kind:"routine",realname:"on_success",name:"machinable",path:"machinable.Component.on_success",signature:"(self)",doc:"Lifecycle event triggered iff execution finishes successfully"},"machinable.Component.on_write_meta_data":{kind:"routine",realname:"on_write_meta_data",name:"machinable",path:"machinable.Component.on_write_meta_data",signature:"(self) -> bool | None",doc:`Event triggered before meta-data such as creation time etc. is written to the storage

Return False to prevent writing of meta-data`},"machinable.Component.project":{kind:"routine",realname:null,name:"machinable",path:"machinable.Component.project",signature:null,doc:null},"machinable.Component.push_related":{kind:"routine",realname:"push_related",name:"machinable",path:"machinable.Component.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.Component.related":{kind:"routine",realname:"related",name:"machinable",path:"machinable.Component.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.Component.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable",path:"machinable.Component.related_iterator",signature:"(self)",doc:null},"machinable.Component.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable",path:"machinable.Component.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.Component.save_file":{kind:"routine",realname:"save_file",name:"machinable",path:"machinable.Component.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.Component.serialize":{kind:"routine",realname:"serialize",name:"machinable",path:"machinable.Component.serialize",signature:"(self) -> dict",doc:null},"machinable.Component.set_default":{kind:"routine",realname:"set_default",name:"machinable",path:"machinable.Component.set_default",signature:null,doc:null},"machinable.Component.set_model":{kind:"routine",realname:"set_model",name:"machinable",path:"machinable.Component.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.Component.singleton":{kind:"routine",realname:"singleton",name:"machinable",path:"machinable.Component.singleton",signature:null,doc:null},"machinable.Component.stage":{kind:"routine",realname:"stage",name:"machinable",path:"machinable.Component.stage",signature:"(self) -> Self",doc:null},"machinable.Component.to_cli":{kind:"routine",realname:"to_cli",name:"machinable",path:"machinable.Component.to_cli",signature:"(self) -> str",doc:null},"machinable.Component.to_directory":{kind:"routine",realname:"to_directory",name:"machinable",path:"machinable.Component.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.Component.unserialize":{kind:"routine",realname:"unserialize",name:"machinable",path:"machinable.Component.unserialize",signature:null,doc:null},"machinable.Component.used_by":{kind:"routine",realname:null,name:"machinable",path:"machinable.Component.used_by",signature:null,doc:null},"machinable.Component.uses":{kind:"routine",realname:null,name:"machinable",path:"machinable.Component.uses",signature:null,doc:null},"machinable.Component.version":{kind:"routine",realname:"version",name:"machinable",path:"machinable.Component.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.Component":{kind:"class",realname:"Component",name:"machinable",path:"machinable.Component",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/component.py"},"machinable.Element.as_default":{kind:"routine",realname:"as_default",name:"machinable",path:"machinable.Element.as_default",signature:"(self) -> Self",doc:null},"machinable.Element.as_json":{kind:"routine",realname:"as_json",name:"machinable",path:"machinable.Element.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.Element.clone":{kind:"routine",realname:"clone",name:"machinable",path:"machinable.Element.clone",signature:"(self)",doc:null},"machinable.Element.collect":{kind:"routine",realname:"collect",name:"machinable",path:"machinable.Element.collect",signature:null,doc:null},"machinable.Element.compute_context":{kind:"routine",realname:"compute_context",name:"machinable",path:"machinable.Element.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.Element.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable",path:"machinable.Element.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.Element.connected":{kind:"routine",realname:"connected",name:"machinable",path:"machinable.Element.connected",signature:null,doc:null},"machinable.Element.created_at":{kind:"routine",realname:"created_at",name:"machinable",path:"machinable.Element.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.Element.from_json":{kind:"routine",realname:"from_json",name:"machinable",path:"machinable.Element.from_json",signature:null,doc:null},"machinable.Element.from_model":{kind:"routine",realname:"from_model",name:"machinable",path:"machinable.Element.from_model",signature:null,doc:null},"machinable.Element.get":{kind:"routine",realname:"get",name:"machinable",path:"machinable.Element.get",signature:null,doc:null},"machinable.Element.instance":{kind:"routine",realname:"instance",name:"machinable",path:"machinable.Element.instance",signature:null,doc:null},"machinable.Element.is_connected":{kind:"routine",realname:"is_connected",name:"machinable",path:"machinable.Element.is_connected",signature:null,doc:null},"machinable.Element.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable",path:"machinable.Element.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Element.make":{kind:"routine",realname:"make",name:"machinable",path:"machinable.Element.make",signature:null,doc:null},"machinable.Element.matches":{kind:"routine",realname:"matches",name:"machinable",path:"machinable.Element.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.Element.model":{kind:"routine",realname:"model",name:"machinable",path:"machinable.Element.model",signature:null,doc:null},"machinable.Element.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable",path:"machinable.Element.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.Element.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable",path:"machinable.Element.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Element.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable",path:"machinable.Element.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.Element.on_configure":{kind:"routine",realname:"on_configure",name:"machinable",path:"machinable.Element.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Element.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable",path:"machinable.Element.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.Element.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable",path:"machinable.Element.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.Element.serialize":{kind:"routine",realname:"serialize",name:"machinable",path:"machinable.Element.serialize",signature:"(self) -> dict",doc:null},"machinable.Element.set_default":{kind:"routine",realname:"set_default",name:"machinable",path:"machinable.Element.set_default",signature:null,doc:null},"machinable.Element.set_model":{kind:"routine",realname:"set_model",name:"machinable",path:"machinable.Element.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.Element.singleton":{kind:"routine",realname:"singleton",name:"machinable",path:"machinable.Element.singleton",signature:null,doc:null},"machinable.Element.unserialize":{kind:"routine",realname:"unserialize",name:"machinable",path:"machinable.Element.unserialize",signature:null,doc:null},"machinable.Element.version":{kind:"routine",realname:"version",name:"machinable",path:"machinable.Element.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.Element":{kind:"class",realname:"Element",name:"machinable",path:"machinable.Element",parents:["machinable.mixin.Mixin","machinable.utils.Jsonable"],doc:"Element baseclass",file:"src/machinable/element.py"},"machinable.Execution.add":{kind:"routine",realname:"add",name:"machinable",path:"machinable.Execution.add",signature:"(self, executable: machinable.component.Component | list[machinable.component.Component]) -> Self",doc:null},"machinable.Execution.all":{kind:"routine",realname:"all",name:"machinable",path:"machinable.Execution.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.Execution.ancestor":{kind:"routine",realname:null,name:"machinable",path:"machinable.Execution.ancestor",signature:null,doc:null},"machinable.Execution.as_default":{kind:"routine",realname:"as_default",name:"machinable",path:"machinable.Execution.as_default",signature:"(self) -> Self",doc:null},"machinable.Execution.as_json":{kind:"routine",realname:"as_json",name:"machinable",path:"machinable.Execution.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.Execution.cached":{kind:"routine",realname:"cached",name:"machinable",path:"machinable.Execution.cached",signature:"(self)",doc:null},"machinable.Execution.canonicalize_resources":{kind:"routine",realname:"canonicalize_resources",name:"machinable",path:"machinable.Execution.canonicalize_resources",signature:"(self, resources: dict) -> dict",doc:null},"machinable.Execution.clone":{kind:"routine",realname:"clone",name:"machinable",path:"machinable.Execution.clone",signature:"(self)",doc:null},"machinable.Execution.collect":{kind:"routine",realname:"collect",name:"machinable",path:"machinable.Execution.collect",signature:null,doc:null},"machinable.Execution.commit":{kind:"routine",realname:"commit",name:"machinable",path:"machinable.Execution.commit",signature:"(self) -> Self",doc:null},"machinable.Execution.component_directory":{kind:"routine",realname:"component_directory",name:"machinable",path:"machinable.Execution.component_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.Execution.compute_context":{kind:"routine",realname:"compute_context",name:"machinable",path:"machinable.Execution.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.Execution.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable",path:"machinable.Execution.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.Execution.computed_resources":{kind:"routine",realname:"computed_resources",name:"machinable",path:"machinable.Execution.computed_resources",signature:"(self, executable: Optional[ForwardRef('Component')] = None) -> dict | None",doc:null},"machinable.Execution.connected":{kind:"routine",realname:"connected",name:"machinable",path:"machinable.Execution.connected",signature:null,doc:null},"machinable.Execution.created_at":{kind:"routine",realname:"created_at",name:"machinable",path:"machinable.Execution.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.Execution.deferred":{kind:"routine",realname:"deferred",name:"machinable",path:"machinable.Execution.deferred",signature:"(self, defer: bool = True)",doc:null},"machinable.Execution.derive":{kind:"routine",realname:"derive",name:"machinable",path:"machinable.Execution.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.Execution.derived":{kind:"routine",realname:null,name:"machinable",path:"machinable.Execution.derived",signature:null,doc:null},"machinable.Execution.dispatch":{kind:"routine",realname:"dispatch",name:"machinable",path:"machinable.Execution.dispatch",signature:"(self) -> Self",doc:null},"machinable.Execution.executable":{kind:"routine",realname:"executable",name:"machinable",path:"machinable.Execution.executable",signature:"(self, executable: machinable.component.Component | None = None) -> machinable.component.Component | None",doc:null},"machinable.Execution.executables":{kind:"routine",realname:null,name:"machinable",path:"machinable.Execution.executables",signature:null,doc:null},"machinable.Execution.fetch":{kind:"routine",realname:"fetch",name:"machinable",path:"machinable.Execution.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.Execution.find":{kind:"routine",realname:"find",name:"machinable",path:"machinable.Execution.find",signature:null,doc:null},"machinable.Execution.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable",path:"machinable.Execution.find_by_hash",signature:null,doc:null},"machinable.Execution.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable",path:"machinable.Execution.find_by_id",signature:null,doc:null},"machinable.Execution.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable",path:"machinable.Execution.find_many_by_id",signature:null,doc:null},"machinable.Execution.finished_at":{kind:"routine",realname:"finished_at",name:"machinable",path:"machinable.Execution.finished_at",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"Returns the finishing time"},"machinable.Execution.from_directory":{kind:"routine",realname:"from_directory",name:"machinable",path:"machinable.Execution.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.Execution.from_json":{kind:"routine",realname:"from_json",name:"machinable",path:"machinable.Execution.from_json",signature:null,doc:null},"machinable.Execution.from_model":{kind:"routine",realname:"from_model",name:"machinable",path:"machinable.Execution.from_model",signature:null,doc:null},"machinable.Execution.future":{kind:"routine",realname:"future",name:"machinable",path:"machinable.Execution.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.Execution.get":{kind:"routine",realname:"get",name:"machinable",path:"machinable.Execution.get",signature:null,doc:null},"machinable.Execution.heartbeat_at":{kind:"routine",realname:"heartbeat_at",name:"machinable",path:"machinable.Execution.heartbeat_at",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"Returns the last heartbeat time"},"machinable.Execution.hidden":{kind:"routine",realname:"hidden",name:"machinable",path:"machinable.Execution.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.Execution.instance":{kind:"routine",realname:"instance",name:"machinable",path:"machinable.Execution.instance",signature:null,doc:null},"machinable.Execution.is_active":{kind:"routine",realname:"is_active",name:"machinable",path:"machinable.Execution.is_active",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if not finished and last heartbeat occurred less than 30 seconds ago"},"machinable.Execution.is_committed":{kind:"routine",realname:"is_committed",name:"machinable",path:"machinable.Execution.is_committed",signature:"(self) -> bool",doc:null},"machinable.Execution.is_connected":{kind:"routine",realname:"is_connected",name:"machinable",path:"machinable.Execution.is_connected",signature:null,doc:null},"machinable.Execution.is_finished":{kind:"routine",realname:"is_finished",name:"machinable",path:"machinable.Execution.is_finished",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if finishing time has been written"},"machinable.Execution.is_incomplete":{kind:"routine",realname:"is_incomplete",name:"machinable",path:"machinable.Execution.is_incomplete",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"Shorthand for is_started() and not is_live()"},"machinable.Execution.is_live":{kind:"routine",realname:"is_live",name:"machinable",path:"machinable.Execution.is_live",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if active or finished"},"machinable.Execution.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable",path:"machinable.Execution.is_mounted",signature:"(self) -> bool",doc:null},"machinable.Execution.is_resumed":{kind:"routine",realname:"is_resumed",name:"machinable",path:"machinable.Execution.is_resumed",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if resumed time has been written"},"machinable.Execution.is_staged":{kind:"routine",realname:"is_staged",name:"machinable",path:"machinable.Execution.is_staged",signature:"(self) -> bool",doc:null},"machinable.Execution.is_started":{kind:"routine",realname:"is_started",name:"machinable",path:"machinable.Execution.is_started",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if starting time has been written"},"machinable.Execution.launch":{kind:"routine",realname:"launch",name:"machinable",path:"machinable.Execution.launch",signature:"(self) -> Self",doc:null},"machinable.Execution.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable",path:"machinable.Execution.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Execution.load_file":{kind:"routine",realname:"load_file",name:"machinable",path:"machinable.Execution.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Execution.local_directory":{kind:"routine",realname:"local_directory",name:"machinable",path:"machinable.Execution.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.Execution.make":{kind:"routine",realname:"make",name:"machinable",path:"machinable.Execution.make",signature:null,doc:null},"machinable.Execution.matches":{kind:"routine",realname:"matches",name:"machinable",path:"machinable.Execution.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.Execution.model":{kind:"routine",realname:"model",name:"machinable",path:"machinable.Execution.model",signature:null,doc:null},"machinable.Execution.new":{kind:"routine",realname:"new",name:"machinable",path:"machinable.Execution.new",signature:"(self) -> Self",doc:null},"machinable.Execution.of":{kind:"routine",realname:"of",name:"machinable",path:"machinable.Execution.of",signature:"(self, executable: None | machinable.component.Component) -> Self",doc:null},"machinable.Execution.on_add":{kind:"routine",realname:"on_add",name:"machinable",path:"machinable.Execution.on_add",signature:"(self, executable: machinable.component.Component)",doc:"Event when executable is added"},"machinable.Execution.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable",path:"machinable.Execution.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.Execution.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable",path:"machinable.Execution.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.Execution.on_after_dispatch":{kind:"routine",realname:"on_after_dispatch",name:"machinable",path:"machinable.Execution.on_after_dispatch",signature:"(self) -> None",doc:"Event triggered after the dispatch of an execution"},"machinable.Execution.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable",path:"machinable.Execution.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.Execution.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable",path:"machinable.Execution.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Execution.on_before_dispatch":{kind:"routine",realname:"on_before_dispatch",name:"machinable",path:"machinable.Execution.on_before_dispatch",signature:"(self) -> bool | None",doc:`Event triggered before dispatch of an execution

Return False to prevent the dispatch`},"machinable.Execution.on_commit":{kind:"routine",realname:"on_commit",name:"machinable",path:"machinable.Execution.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.Execution.on_compute_default_resources":{kind:"routine",realname:"on_compute_default_resources",name:"machinable",path:"machinable.Execution.on_compute_default_resources",signature:"(self, executable: 'Component') -> dict | None",doc:"Event triggered to compute default resources"},"machinable.Execution.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable",path:"machinable.Execution.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.Execution.on_configure":{kind:"routine",realname:"on_configure",name:"machinable",path:"machinable.Execution.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Execution.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable",path:"machinable.Execution.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.Execution.on_verify_schedule":{kind:"routine",realname:"on_verify_schedule",name:"machinable",path:"machinable.Execution.on_verify_schedule",signature:"(self) -> bool",doc:"Event to verify compatibility of the schedule"},"machinable.Execution.output":{kind:"routine",realname:"output",name:"machinable",path:"machinable.Execution.output",signature:"(self, executable: Optional[ForwardRef('Component')] = None, incremental: bool = False) -> str | None",doc:"Returns the output log"},"machinable.Execution.output_filepath":{kind:"routine",realname:"output_filepath",name:"machinable",path:"machinable.Execution.output_filepath",signature:"(self, executable: Optional[ForwardRef('Component')] = None) -> str",doc:null},"machinable.Execution.project":{kind:"routine",realname:null,name:"machinable",path:"machinable.Execution.project",signature:null,doc:null},"machinable.Execution.push_related":{kind:"routine",realname:"push_related",name:"machinable",path:"machinable.Execution.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.Execution.related":{kind:"routine",realname:"related",name:"machinable",path:"machinable.Execution.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.Execution.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable",path:"machinable.Execution.related_iterator",signature:"(self)",doc:null},"machinable.Execution.resumed_at":{kind:"routine",realname:"resumed_at",name:"machinable",path:"machinable.Execution.resumed_at",signature:"(self, executable: Optional[ForwardRef('Component')] = None) -> arrow.arrow.Arrow | None",doc:"Returns the resumed time"},"machinable.Execution.retrieve_status":{kind:"routine",realname:"retrieve_status",name:"machinable",path:"machinable.Execution.retrieve_status",signature:"(self, executable: Optional[ForwardRef('Component')] = None, status: Literal['started', 'heartbeat', 'finished', 'resumed'] = 'heartbeat') -> arrow.arrow.Arrow | None",doc:null},"machinable.Execution.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable",path:"machinable.Execution.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.Execution.save_file":{kind:"routine",realname:"save_file",name:"machinable",path:"machinable.Execution.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.Execution.schedule":{kind:"routine",realname:null,name:"machinable",path:"machinable.Execution.schedule",signature:null,doc:null},"machinable.Execution.serialize":{kind:"routine",realname:"serialize",name:"machinable",path:"machinable.Execution.serialize",signature:"(self) -> dict",doc:null},"machinable.Execution.set_default":{kind:"routine",realname:"set_default",name:"machinable",path:"machinable.Execution.set_default",signature:null,doc:null},"machinable.Execution.set_model":{kind:"routine",realname:"set_model",name:"machinable",path:"machinable.Execution.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.Execution.singleton":{kind:"routine",realname:"singleton",name:"machinable",path:"machinable.Execution.singleton",signature:null,doc:null},"machinable.Execution.stage":{kind:"routine",realname:"stage",name:"machinable",path:"machinable.Execution.stage",signature:"(self) -> Self",doc:null},"machinable.Execution.started_at":{kind:"routine",realname:"started_at",name:"machinable",path:"machinable.Execution.started_at",signature:"(self, executable: Optional[ForwardRef('Component')] = None) -> arrow.arrow.Arrow | None",doc:"Returns the starting time"},"machinable.Execution.stream_output":{kind:"routine",realname:"stream_output",name:"machinable",path:"machinable.Execution.stream_output",signature:"(self, executable: Optional[ForwardRef('Component')] = None, refresh_every: int | float = 1, stream=<built-in function print>)",doc:null},"machinable.Execution.to_cli":{kind:"routine",realname:"to_cli",name:"machinable",path:"machinable.Execution.to_cli",signature:"(self) -> str",doc:null},"machinable.Execution.to_directory":{kind:"routine",realname:"to_directory",name:"machinable",path:"machinable.Execution.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.Execution.unserialize":{kind:"routine",realname:"unserialize",name:"machinable",path:"machinable.Execution.unserialize",signature:null,doc:null},"machinable.Execution.update_status":{kind:"routine",realname:"update_status",name:"machinable",path:"machinable.Execution.update_status",signature:"(self, executable: Optional[ForwardRef('Component')] = None, status: Literal['started', 'heartbeat', 'finished', 'resumed'] = 'heartbeat', timestamp: float | int | arrow.arrow.Arrow | None = None) -> float | int | arrow.arrow.Arrow",doc:null},"machinable.Execution.used_by":{kind:"routine",realname:null,name:"machinable",path:"machinable.Execution.used_by",signature:null,doc:null},"machinable.Execution.uses":{kind:"routine",realname:null,name:"machinable",path:"machinable.Execution.uses",signature:null,doc:null},"machinable.Execution.version":{kind:"routine",realname:"version",name:"machinable",path:"machinable.Execution.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.Execution":{kind:"class",realname:"Execution",name:"machinable",path:"machinable.Execution",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/execution.py"},"machinable.Index.all":{kind:"routine",realname:"all",name:"machinable",path:"machinable.Index.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.Index.ancestor":{kind:"routine",realname:null,name:"machinable",path:"machinable.Index.ancestor",signature:null,doc:null},"machinable.Index.as_default":{kind:"routine",realname:"as_default",name:"machinable",path:"machinable.Index.as_default",signature:"(self) -> Self",doc:null},"machinable.Index.as_json":{kind:"routine",realname:"as_json",name:"machinable",path:"machinable.Index.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.Index.cached":{kind:"routine",realname:"cached",name:"machinable",path:"machinable.Index.cached",signature:"(self)",doc:null},"machinable.Index.clone":{kind:"routine",realname:"clone",name:"machinable",path:"machinable.Index.clone",signature:"(self)",doc:null},"machinable.Index.collect":{kind:"routine",realname:"collect",name:"machinable",path:"machinable.Index.collect",signature:null,doc:null},"machinable.Index.commit":{kind:"routine",realname:"commit",name:"machinable",path:"machinable.Index.commit",signature:"(self, model: machinable.schema.Interface) -> bool",doc:null},"machinable.Index.compute_context":{kind:"routine",realname:"compute_context",name:"machinable",path:"machinable.Index.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.Index.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable",path:"machinable.Index.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.Index.config_in_directory":{kind:"routine",realname:"config_in_directory",name:"machinable",path:"machinable.Index.config_in_directory",signature:"(self, relative_path: str) -> str",doc:null},"machinable.Index.connected":{kind:"routine",realname:"connected",name:"machinable",path:"machinable.Index.connected",signature:null,doc:null},"machinable.Index.create_relation":{kind:"routine",realname:"create_relation",name:"machinable",path:"machinable.Index.create_relation",signature:"(self, relation: str, uuid: str, related_uuid: str | list[str], priority: int = 0, timestamp: int | None = None) -> None",doc:null},"machinable.Index.created_at":{kind:"routine",realname:"created_at",name:"machinable",path:"machinable.Index.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.Index.derive":{kind:"routine",realname:"derive",name:"machinable",path:"machinable.Index.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.Index.derived":{kind:"routine",realname:null,name:"machinable",path:"machinable.Index.derived",signature:null,doc:null},"machinable.Index.fetch":{kind:"routine",realname:"fetch",name:"machinable",path:"machinable.Index.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.Index.find":{kind:"routine",realname:"find",name:"machinable",path:"machinable.Index.find",signature:"(self, interface: machinable.schema.Interface | machinable.interface.Interface, by: Literal['id', 'uuid', 'hash'] = 'hash') -> list[machinable.schema.Interface]",doc:null},"machinable.Index.find_by_context":{kind:"routine",realname:"find_by_context",name:"machinable",path:"machinable.Index.find_by_context",signature:"(self, context: dict) -> list[machinable.schema.Interface]",doc:null},"machinable.Index.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable",path:"machinable.Index.find_by_hash",signature:"(self, context_hash: str) -> list[machinable.schema.Interface]",doc:null},"machinable.Index.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable",path:"machinable.Index.find_by_id",signature:"(self, uuid: str) -> machinable.schema.Interface | None",doc:null},"machinable.Index.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable",path:"machinable.Index.find_many_by_id",signature:null,doc:null},"machinable.Index.find_related":{kind:"routine",realname:"find_related",name:"machinable",path:"machinable.Index.find_related",signature:"(self, relation: str, uuid: str, inverse: bool = False) -> None | list[machinable.schema.Interface]",doc:null},"machinable.Index.from_directory":{kind:"routine",realname:"from_directory",name:"machinable",path:"machinable.Index.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.Index.from_json":{kind:"routine",realname:"from_json",name:"machinable",path:"machinable.Index.from_json",signature:null,doc:null},"machinable.Index.from_model":{kind:"routine",realname:"from_model",name:"machinable",path:"machinable.Index.from_model",signature:null,doc:null},"machinable.Index.future":{kind:"routine",realname:"future",name:"machinable",path:"machinable.Index.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.Index.get":{kind:"routine",realname:"get",name:"machinable",path:"machinable.Index.get",signature:null,doc:null},"machinable.Index.hidden":{kind:"routine",realname:"hidden",name:"machinable",path:"machinable.Index.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.Index.import_directory":{kind:"routine",realname:"import_directory",name:"machinable",path:"machinable.Index.import_directory",signature:"(self, directory: str, relations: bool = True, file_importer: collections.abc.Callable[[str, str], None] = functools.partial(<function copytree at 0x7fcadf316520>, symlinks=True))",doc:null},"machinable.Index.instance":{kind:"routine",realname:"instance",name:"machinable",path:"machinable.Index.instance",signature:null,doc:null},"machinable.Index.is_committed":{kind:"routine",realname:"is_committed",name:"machinable",path:"machinable.Index.is_committed",signature:"(self) -> bool",doc:null},"machinable.Index.is_connected":{kind:"routine",realname:"is_connected",name:"machinable",path:"machinable.Index.is_connected",signature:null,doc:null},"machinable.Index.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable",path:"machinable.Index.is_mounted",signature:"(self) -> bool",doc:null},"machinable.Index.is_staged":{kind:"routine",realname:"is_staged",name:"machinable",path:"machinable.Index.is_staged",signature:"(self) -> bool",doc:null},"machinable.Index.launch":{kind:"routine",realname:"launch",name:"machinable",path:"machinable.Index.launch",signature:"(self) -> Self",doc:null},"machinable.Index.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable",path:"machinable.Index.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Index.load_file":{kind:"routine",realname:"load_file",name:"machinable",path:"machinable.Index.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Index.local_directory":{kind:"routine",realname:"local_directory",name:"machinable",path:"machinable.Index.local_directory",signature:"(self, uuid: str, *append: str) -> str",doc:null},"machinable.Index.make":{kind:"routine",realname:"make",name:"machinable",path:"machinable.Index.make",signature:null,doc:null},"machinable.Index.matches":{kind:"routine",realname:"matches",name:"machinable",path:"machinable.Index.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.Index.model":{kind:"routine",realname:"model",name:"machinable",path:"machinable.Index.model",signature:null,doc:null},"machinable.Index.new":{kind:"routine",realname:"new",name:"machinable",path:"machinable.Index.new",signature:"(self) -> Self",doc:null},"machinable.Index.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable",path:"machinable.Index.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.Index.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable",path:"machinable.Index.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.Index.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable",path:"machinable.Index.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.Index.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable",path:"machinable.Index.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Index.on_commit":{kind:"routine",realname:"on_commit",name:"machinable",path:"machinable.Index.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.Index.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable",path:"machinable.Index.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.Index.on_configure":{kind:"routine",realname:"on_configure",name:"machinable",path:"machinable.Index.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Index.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable",path:"machinable.Index.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.Index.project":{kind:"routine",realname:null,name:"machinable",path:"machinable.Index.project",signature:null,doc:null},"machinable.Index.push_related":{kind:"routine",realname:"push_related",name:"machinable",path:"machinable.Index.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.Index.related":{kind:"routine",realname:"related",name:"machinable",path:"machinable.Index.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.Index.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable",path:"machinable.Index.related_iterator",signature:"(self)",doc:null},"machinable.Index.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable",path:"machinable.Index.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.Index.save_file":{kind:"routine",realname:"save_file",name:"machinable",path:"machinable.Index.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.Index.serialize":{kind:"routine",realname:"serialize",name:"machinable",path:"machinable.Index.serialize",signature:"(self) -> dict",doc:null},"machinable.Index.set_default":{kind:"routine",realname:"set_default",name:"machinable",path:"machinable.Index.set_default",signature:null,doc:null},"machinable.Index.set_model":{kind:"routine",realname:"set_model",name:"machinable",path:"machinable.Index.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.Index.singleton":{kind:"routine",realname:"singleton",name:"machinable",path:"machinable.Index.singleton",signature:null,doc:null},"machinable.Index.stage":{kind:"routine",realname:"stage",name:"machinable",path:"machinable.Index.stage",signature:"(self) -> Self",doc:null},"machinable.Index.to_cli":{kind:"routine",realname:"to_cli",name:"machinable",path:"machinable.Index.to_cli",signature:"(self) -> str",doc:null},"machinable.Index.to_directory":{kind:"routine",realname:"to_directory",name:"machinable",path:"machinable.Index.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.Index.unserialize":{kind:"routine",realname:"unserialize",name:"machinable",path:"machinable.Index.unserialize",signature:null,doc:null},"machinable.Index.used_by":{kind:"routine",realname:null,name:"machinable",path:"machinable.Index.used_by",signature:null,doc:null},"machinable.Index.uses":{kind:"routine",realname:null,name:"machinable",path:"machinable.Index.uses",signature:null,doc:null},"machinable.Index.version":{kind:"routine",realname:"version",name:"machinable",path:"machinable.Index.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.Index":{kind:"class",realname:"Index",name:"machinable",path:"machinable.Index",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/index.py"},"machinable.Interface.all":{kind:"routine",realname:"all",name:"machinable",path:"machinable.Interface.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.Interface.ancestor":{kind:"routine",realname:null,name:"machinable",path:"machinable.Interface.ancestor",signature:null,doc:null},"machinable.Interface.as_default":{kind:"routine",realname:"as_default",name:"machinable",path:"machinable.Interface.as_default",signature:"(self) -> Self",doc:null},"machinable.Interface.as_json":{kind:"routine",realname:"as_json",name:"machinable",path:"machinable.Interface.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.Interface.cached":{kind:"routine",realname:"cached",name:"machinable",path:"machinable.Interface.cached",signature:"(self)",doc:null},"machinable.Interface.clone":{kind:"routine",realname:"clone",name:"machinable",path:"machinable.Interface.clone",signature:"(self)",doc:null},"machinable.Interface.collect":{kind:"routine",realname:"collect",name:"machinable",path:"machinable.Interface.collect",signature:null,doc:null},"machinable.Interface.commit":{kind:"routine",realname:"commit",name:"machinable",path:"machinable.Interface.commit",signature:"(self) -> Self",doc:null},"machinable.Interface.compute_context":{kind:"routine",realname:"compute_context",name:"machinable",path:"machinable.Interface.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.Interface.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable",path:"machinable.Interface.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.Interface.connected":{kind:"routine",realname:"connected",name:"machinable",path:"machinable.Interface.connected",signature:null,doc:null},"machinable.Interface.created_at":{kind:"routine",realname:"created_at",name:"machinable",path:"machinable.Interface.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.Interface.derive":{kind:"routine",realname:"derive",name:"machinable",path:"machinable.Interface.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.Interface.derived":{kind:"routine",realname:null,name:"machinable",path:"machinable.Interface.derived",signature:null,doc:null},"machinable.Interface.fetch":{kind:"routine",realname:"fetch",name:"machinable",path:"machinable.Interface.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.Interface.find":{kind:"routine",realname:"find",name:"machinable",path:"machinable.Interface.find",signature:null,doc:null},"machinable.Interface.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable",path:"machinable.Interface.find_by_hash",signature:null,doc:null},"machinable.Interface.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable",path:"machinable.Interface.find_by_id",signature:null,doc:null},"machinable.Interface.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable",path:"machinable.Interface.find_many_by_id",signature:null,doc:null},"machinable.Interface.from_directory":{kind:"routine",realname:"from_directory",name:"machinable",path:"machinable.Interface.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.Interface.from_json":{kind:"routine",realname:"from_json",name:"machinable",path:"machinable.Interface.from_json",signature:null,doc:null},"machinable.Interface.from_model":{kind:"routine",realname:"from_model",name:"machinable",path:"machinable.Interface.from_model",signature:null,doc:null},"machinable.Interface.future":{kind:"routine",realname:"future",name:"machinable",path:"machinable.Interface.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.Interface.get":{kind:"routine",realname:"get",name:"machinable",path:"machinable.Interface.get",signature:null,doc:null},"machinable.Interface.hidden":{kind:"routine",realname:"hidden",name:"machinable",path:"machinable.Interface.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.Interface.instance":{kind:"routine",realname:"instance",name:"machinable",path:"machinable.Interface.instance",signature:null,doc:null},"machinable.Interface.is_committed":{kind:"routine",realname:"is_committed",name:"machinable",path:"machinable.Interface.is_committed",signature:"(self) -> bool",doc:null},"machinable.Interface.is_connected":{kind:"routine",realname:"is_connected",name:"machinable",path:"machinable.Interface.is_connected",signature:null,doc:null},"machinable.Interface.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable",path:"machinable.Interface.is_mounted",signature:"(self) -> bool",doc:null},"machinable.Interface.is_staged":{kind:"routine",realname:"is_staged",name:"machinable",path:"machinable.Interface.is_staged",signature:"(self) -> bool",doc:null},"machinable.Interface.launch":{kind:"routine",realname:"launch",name:"machinable",path:"machinable.Interface.launch",signature:"(self) -> Self",doc:null},"machinable.Interface.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable",path:"machinable.Interface.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Interface.load_file":{kind:"routine",realname:"load_file",name:"machinable",path:"machinable.Interface.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Interface.local_directory":{kind:"routine",realname:"local_directory",name:"machinable",path:"machinable.Interface.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.Interface.make":{kind:"routine",realname:"make",name:"machinable",path:"machinable.Interface.make",signature:null,doc:null},"machinable.Interface.matches":{kind:"routine",realname:"matches",name:"machinable",path:"machinable.Interface.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.Interface.model":{kind:"routine",realname:"model",name:"machinable",path:"machinable.Interface.model",signature:null,doc:null},"machinable.Interface.new":{kind:"routine",realname:"new",name:"machinable",path:"machinable.Interface.new",signature:"(self) -> Self",doc:null},"machinable.Interface.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable",path:"machinable.Interface.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.Interface.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable",path:"machinable.Interface.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.Interface.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable",path:"machinable.Interface.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.Interface.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable",path:"machinable.Interface.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Interface.on_commit":{kind:"routine",realname:"on_commit",name:"machinable",path:"machinable.Interface.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.Interface.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable",path:"machinable.Interface.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.Interface.on_configure":{kind:"routine",realname:"on_configure",name:"machinable",path:"machinable.Interface.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Interface.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable",path:"machinable.Interface.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.Interface.project":{kind:"routine",realname:null,name:"machinable",path:"machinable.Interface.project",signature:null,doc:null},"machinable.Interface.push_related":{kind:"routine",realname:"push_related",name:"machinable",path:"machinable.Interface.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.Interface.related":{kind:"routine",realname:"related",name:"machinable",path:"machinable.Interface.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.Interface.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable",path:"machinable.Interface.related_iterator",signature:"(self)",doc:null},"machinable.Interface.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable",path:"machinable.Interface.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.Interface.save_file":{kind:"routine",realname:"save_file",name:"machinable",path:"machinable.Interface.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.Interface.serialize":{kind:"routine",realname:"serialize",name:"machinable",path:"machinable.Interface.serialize",signature:"(self) -> dict",doc:null},"machinable.Interface.set_default":{kind:"routine",realname:"set_default",name:"machinable",path:"machinable.Interface.set_default",signature:null,doc:null},"machinable.Interface.set_model":{kind:"routine",realname:"set_model",name:"machinable",path:"machinable.Interface.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.Interface.singleton":{kind:"routine",realname:"singleton",name:"machinable",path:"machinable.Interface.singleton",signature:null,doc:null},"machinable.Interface.stage":{kind:"routine",realname:"stage",name:"machinable",path:"machinable.Interface.stage",signature:"(self) -> Self",doc:null},"machinable.Interface.to_cli":{kind:"routine",realname:"to_cli",name:"machinable",path:"machinable.Interface.to_cli",signature:"(self) -> str",doc:null},"machinable.Interface.to_directory":{kind:"routine",realname:"to_directory",name:"machinable",path:"machinable.Interface.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.Interface.unserialize":{kind:"routine",realname:"unserialize",name:"machinable",path:"machinable.Interface.unserialize",signature:null,doc:null},"machinable.Interface.used_by":{kind:"routine",realname:null,name:"machinable",path:"machinable.Interface.used_by",signature:null,doc:null},"machinable.Interface.uses":{kind:"routine",realname:null,name:"machinable",path:"machinable.Interface.uses",signature:null,doc:null},"machinable.Interface.version":{kind:"routine",realname:"version",name:"machinable",path:"machinable.Interface.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.Interface":{kind:"class",realname:"Interface",name:"machinable",path:"machinable.Interface",parents:["machinable.element.Element"],doc:"Element baseclass",file:"src/machinable/interface.py"},"machinable.Mixin":{kind:"class",realname:"Mixin",name:"machinable",path:"machinable.Mixin",parents:["builtins.object"],doc:"Mixin base class",file:"src/machinable/mixin.py"},"machinable.Project.add_to_path":{kind:"routine",realname:"add_to_path",name:"machinable",path:"machinable.Project.add_to_path",signature:"(self) -> None",doc:null},"machinable.Project.all":{kind:"routine",realname:"all",name:"machinable",path:"machinable.Project.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.Project.ancestor":{kind:"routine",realname:null,name:"machinable",path:"machinable.Project.ancestor",signature:null,doc:null},"machinable.Project.as_default":{kind:"routine",realname:"as_default",name:"machinable",path:"machinable.Project.as_default",signature:"(self) -> Self",doc:null},"machinable.Project.as_json":{kind:"routine",realname:"as_json",name:"machinable",path:"machinable.Project.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.Project.cached":{kind:"routine",realname:"cached",name:"machinable",path:"machinable.Project.cached",signature:"(self)",doc:null},"machinable.Project.clone":{kind:"routine",realname:"clone",name:"machinable",path:"machinable.Project.clone",signature:"(self)",doc:null},"machinable.Project.collect":{kind:"routine",realname:"collect",name:"machinable",path:"machinable.Project.collect",signature:null,doc:null},"machinable.Project.commit":{kind:"routine",realname:"commit",name:"machinable",path:"machinable.Project.commit",signature:"(self) -> Self",doc:null},"machinable.Project.compute_context":{kind:"routine",realname:"compute_context",name:"machinable",path:"machinable.Project.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.Project.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable",path:"machinable.Project.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.Project.connected":{kind:"routine",realname:"connected",name:"machinable",path:"machinable.Project.connected",signature:null,doc:null},"machinable.Project.created_at":{kind:"routine",realname:"created_at",name:"machinable",path:"machinable.Project.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.Project.derive":{kind:"routine",realname:"derive",name:"machinable",path:"machinable.Project.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.Project.derived":{kind:"routine",realname:null,name:"machinable",path:"machinable.Project.derived",signature:null,doc:null},"machinable.Project.element":{kind:"routine",realname:"element",name:"machinable",path:"machinable.Project.element",signature:"(self, module: str | machinable.element.Element, version: str | dict | None | list[str | dict | None] = None, base_class: Any = None, **constructor_kwargs) -> 'Element'",doc:null},"machinable.Project.exists":{kind:"routine",realname:"exists",name:"machinable",path:"machinable.Project.exists",signature:"(self) -> bool",doc:null},"machinable.Project.fetch":{kind:"routine",realname:"fetch",name:"machinable",path:"machinable.Project.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.Project.find":{kind:"routine",realname:"find",name:"machinable",path:"machinable.Project.find",signature:null,doc:null},"machinable.Project.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable",path:"machinable.Project.find_by_hash",signature:null,doc:null},"machinable.Project.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable",path:"machinable.Project.find_by_id",signature:null,doc:null},"machinable.Project.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable",path:"machinable.Project.find_many_by_id",signature:null,doc:null},"machinable.Project.from_directory":{kind:"routine",realname:"from_directory",name:"machinable",path:"machinable.Project.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.Project.from_json":{kind:"routine",realname:"from_json",name:"machinable",path:"machinable.Project.from_json",signature:null,doc:null},"machinable.Project.from_model":{kind:"routine",realname:"from_model",name:"machinable",path:"machinable.Project.from_model",signature:null,doc:null},"machinable.Project.future":{kind:"routine",realname:"future",name:"machinable",path:"machinable.Project.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.Project.get":{kind:"routine",realname:"get",name:"machinable",path:"machinable.Project.get",signature:null,doc:null},"machinable.Project.get_code_version":{kind:"routine",realname:"get_code_version",name:"machinable",path:"machinable.Project.get_code_version",signature:"(self) -> dict",doc:null},"machinable.Project.get_diff":{kind:"routine",realname:"get_diff",name:"machinable",path:"machinable.Project.get_diff",signature:"(self) -> str | None",doc:null},"machinable.Project.get_host_info":{kind:"routine",realname:"get_host_info",name:"machinable",path:"machinable.Project.get_host_info",signature:"(self) -> dict",doc:"Returned dictionary will be recorded as host information"},"machinable.Project.get_root":{kind:"routine",realname:"get_root",name:"machinable",path:"machinable.Project.get_root",signature:"(self) -> 'Project'",doc:null},"machinable.Project.get_vendors":{kind:"routine",realname:"get_vendors",name:"machinable",path:"machinable.Project.get_vendors",signature:"(self) -> list[str]",doc:null},"machinable.Project.hidden":{kind:"routine",realname:"hidden",name:"machinable",path:"machinable.Project.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.Project.instance":{kind:"routine",realname:"instance",name:"machinable",path:"machinable.Project.instance",signature:null,doc:null},"machinable.Project.is_committed":{kind:"routine",realname:"is_committed",name:"machinable",path:"machinable.Project.is_committed",signature:"(self) -> bool",doc:null},"machinable.Project.is_connected":{kind:"routine",realname:"is_connected",name:"machinable",path:"machinable.Project.is_connected",signature:null,doc:null},"machinable.Project.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable",path:"machinable.Project.is_mounted",signature:"(self) -> bool",doc:null},"machinable.Project.is_root":{kind:"routine",realname:"is_root",name:"machinable",path:"machinable.Project.is_root",signature:"(self) -> bool",doc:null},"machinable.Project.is_staged":{kind:"routine",realname:"is_staged",name:"machinable",path:"machinable.Project.is_staged",signature:"(self) -> bool",doc:null},"machinable.Project.launch":{kind:"routine",realname:"launch",name:"machinable",path:"machinable.Project.launch",signature:"(self) -> Self",doc:null},"machinable.Project.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable",path:"machinable.Project.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Project.load_file":{kind:"routine",realname:"load_file",name:"machinable",path:"machinable.Project.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Project.local_directory":{kind:"routine",realname:"local_directory",name:"machinable",path:"machinable.Project.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.Project.make":{kind:"routine",realname:"make",name:"machinable",path:"machinable.Project.make",signature:null,doc:null},"machinable.Project.matches":{kind:"routine",realname:"matches",name:"machinable",path:"machinable.Project.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.Project.model":{kind:"routine",realname:"model",name:"machinable",path:"machinable.Project.model",signature:null,doc:null},"machinable.Project.name":{kind:"routine",realname:"name",name:"machinable",path:"machinable.Project.name",signature:"(self) -> str",doc:null},"machinable.Project.new":{kind:"routine",realname:"new",name:"machinable",path:"machinable.Project.new",signature:"(self) -> Self",doc:null},"machinable.Project.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable",path:"machinable.Project.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.Project.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable",path:"machinable.Project.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.Project.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable",path:"machinable.Project.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.Project.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable",path:"machinable.Project.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Project.on_commit":{kind:"routine",realname:"on_commit",name:"machinable",path:"machinable.Project.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.Project.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable",path:"machinable.Project.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.Project.on_configure":{kind:"routine",realname:"on_configure",name:"machinable",path:"machinable.Project.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Project.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable",path:"machinable.Project.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.Project.on_resolve_element":{kind:"routine",realname:"on_resolve_element",name:"machinable",path:"machinable.Project.on_resolve_element",signature:"(self, module: str | machinable.element.Element) -> tuple[str | machinable.element.Element, machinable.element.Element | None]",doc:`Override element resolution

Return altered module and/or resolved Element class to be used instead.`},"machinable.Project.on_resolve_remotes":{kind:"routine",realname:"on_resolve_remotes",name:"machinable",path:"machinable.Project.on_resolve_remotes",signature:"(self) -> dict[str, str]",doc:`Event triggered during remote resolution

Return a dictionary of module names and their remote source.`},"machinable.Project.on_resolve_vendor":{kind:"routine",realname:"on_resolve_vendor",name:"machinable",path:"machinable.Project.on_resolve_vendor",signature:"(self, name: str, source: str, target: str) -> bool | None",doc:`Event triggered when vendor is resolved

# Arguments
name: The name of the vendor
source: The source configuration
target: The target directory (may or may not exists yet)

Return False to prevent the default automatic resolution`},"machinable.Project.path":{kind:"routine",realname:"path",name:"machinable",path:"machinable.Project.path",signature:"(self, *append: str) -> str",doc:null},"machinable.Project.project":{kind:"routine",realname:null,name:"machinable",path:"machinable.Project.project",signature:null,doc:null},"machinable.Project.provider":{kind:"routine",realname:"provider",name:"machinable",path:"machinable.Project.provider",signature:"(self, reload: str | bool = False) -> 'Project'",doc:"Resolves and returns the provider instance"},"machinable.Project.push_related":{kind:"routine",realname:"push_related",name:"machinable",path:"machinable.Project.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.Project.related":{kind:"routine",realname:"related",name:"machinable",path:"machinable.Project.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.Project.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable",path:"machinable.Project.related_iterator",signature:"(self)",doc:null},"machinable.Project.resolve_remotes":{kind:"routine",realname:"resolve_remotes",name:"machinable",path:"machinable.Project.resolve_remotes",signature:"(self, module: str) -> machinable.element.Element | None",doc:null},"machinable.Project.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable",path:"machinable.Project.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.Project.save_file":{kind:"routine",realname:"save_file",name:"machinable",path:"machinable.Project.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.Project.serialize":{kind:"routine",realname:"serialize",name:"machinable",path:"machinable.Project.serialize",signature:"(self) -> dict",doc:null},"machinable.Project.set_default":{kind:"routine",realname:"set_default",name:"machinable",path:"machinable.Project.set_default",signature:null,doc:null},"machinable.Project.set_model":{kind:"routine",realname:"set_model",name:"machinable",path:"machinable.Project.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.Project.singleton":{kind:"routine",realname:"singleton",name:"machinable",path:"machinable.Project.singleton",signature:null,doc:null},"machinable.Project.stage":{kind:"routine",realname:"stage",name:"machinable",path:"machinable.Project.stage",signature:"(self) -> Self",doc:null},"machinable.Project.to_cli":{kind:"routine",realname:"to_cli",name:"machinable",path:"machinable.Project.to_cli",signature:"(self) -> str",doc:null},"machinable.Project.to_directory":{kind:"routine",realname:"to_directory",name:"machinable",path:"machinable.Project.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.Project.unserialize":{kind:"routine",realname:"unserialize",name:"machinable",path:"machinable.Project.unserialize",signature:null,doc:null},"machinable.Project.used_by":{kind:"routine",realname:null,name:"machinable",path:"machinable.Project.used_by",signature:null,doc:null},"machinable.Project.uses":{kind:"routine",realname:null,name:"machinable",path:"machinable.Project.uses",signature:null,doc:null},"machinable.Project.version":{kind:"routine",realname:"version",name:"machinable",path:"machinable.Project.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.Project":{kind:"class",realname:"Project",name:"machinable",path:"machinable.Project",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/project.py"},"machinable.Schedule.all":{kind:"routine",realname:"all",name:"machinable",path:"machinable.Schedule.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.Schedule.ancestor":{kind:"routine",realname:null,name:"machinable",path:"machinable.Schedule.ancestor",signature:null,doc:null},"machinable.Schedule.as_default":{kind:"routine",realname:"as_default",name:"machinable",path:"machinable.Schedule.as_default",signature:"(self) -> Self",doc:null},"machinable.Schedule.as_json":{kind:"routine",realname:"as_json",name:"machinable",path:"machinable.Schedule.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.Schedule.cached":{kind:"routine",realname:"cached",name:"machinable",path:"machinable.Schedule.cached",signature:"(self)",doc:null},"machinable.Schedule.clone":{kind:"routine",realname:"clone",name:"machinable",path:"machinable.Schedule.clone",signature:"(self)",doc:null},"machinable.Schedule.collect":{kind:"routine",realname:"collect",name:"machinable",path:"machinable.Schedule.collect",signature:null,doc:null},"machinable.Schedule.commit":{kind:"routine",realname:"commit",name:"machinable",path:"machinable.Schedule.commit",signature:"(self) -> Self",doc:null},"machinable.Schedule.compute_context":{kind:"routine",realname:"compute_context",name:"machinable",path:"machinable.Schedule.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.Schedule.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable",path:"machinable.Schedule.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.Schedule.connected":{kind:"routine",realname:"connected",name:"machinable",path:"machinable.Schedule.connected",signature:null,doc:null},"machinable.Schedule.created_at":{kind:"routine",realname:"created_at",name:"machinable",path:"machinable.Schedule.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.Schedule.derive":{kind:"routine",realname:"derive",name:"machinable",path:"machinable.Schedule.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.Schedule.derived":{kind:"routine",realname:null,name:"machinable",path:"machinable.Schedule.derived",signature:null,doc:null},"machinable.Schedule.fetch":{kind:"routine",realname:"fetch",name:"machinable",path:"machinable.Schedule.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.Schedule.find":{kind:"routine",realname:"find",name:"machinable",path:"machinable.Schedule.find",signature:null,doc:null},"machinable.Schedule.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable",path:"machinable.Schedule.find_by_hash",signature:null,doc:null},"machinable.Schedule.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable",path:"machinable.Schedule.find_by_id",signature:null,doc:null},"machinable.Schedule.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable",path:"machinable.Schedule.find_many_by_id",signature:null,doc:null},"machinable.Schedule.from_directory":{kind:"routine",realname:"from_directory",name:"machinable",path:"machinable.Schedule.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.Schedule.from_json":{kind:"routine",realname:"from_json",name:"machinable",path:"machinable.Schedule.from_json",signature:null,doc:null},"machinable.Schedule.from_model":{kind:"routine",realname:"from_model",name:"machinable",path:"machinable.Schedule.from_model",signature:null,doc:null},"machinable.Schedule.future":{kind:"routine",realname:"future",name:"machinable",path:"machinable.Schedule.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.Schedule.get":{kind:"routine",realname:"get",name:"machinable",path:"machinable.Schedule.get",signature:null,doc:null},"machinable.Schedule.hidden":{kind:"routine",realname:"hidden",name:"machinable",path:"machinable.Schedule.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.Schedule.instance":{kind:"routine",realname:"instance",name:"machinable",path:"machinable.Schedule.instance",signature:null,doc:null},"machinable.Schedule.is_committed":{kind:"routine",realname:"is_committed",name:"machinable",path:"machinable.Schedule.is_committed",signature:"(self) -> bool",doc:null},"machinable.Schedule.is_connected":{kind:"routine",realname:"is_connected",name:"machinable",path:"machinable.Schedule.is_connected",signature:null,doc:null},"machinable.Schedule.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable",path:"machinable.Schedule.is_mounted",signature:"(self) -> bool",doc:null},"machinable.Schedule.is_staged":{kind:"routine",realname:"is_staged",name:"machinable",path:"machinable.Schedule.is_staged",signature:"(self) -> bool",doc:null},"machinable.Schedule.launch":{kind:"routine",realname:"launch",name:"machinable",path:"machinable.Schedule.launch",signature:"(self) -> Self",doc:null},"machinable.Schedule.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable",path:"machinable.Schedule.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Schedule.load_file":{kind:"routine",realname:"load_file",name:"machinable",path:"machinable.Schedule.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Schedule.local_directory":{kind:"routine",realname:"local_directory",name:"machinable",path:"machinable.Schedule.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.Schedule.make":{kind:"routine",realname:"make",name:"machinable",path:"machinable.Schedule.make",signature:null,doc:null},"machinable.Schedule.matches":{kind:"routine",realname:"matches",name:"machinable",path:"machinable.Schedule.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.Schedule.model":{kind:"routine",realname:"model",name:"machinable",path:"machinable.Schedule.model",signature:null,doc:null},"machinable.Schedule.new":{kind:"routine",realname:"new",name:"machinable",path:"machinable.Schedule.new",signature:"(self) -> Self",doc:null},"machinable.Schedule.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable",path:"machinable.Schedule.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.Schedule.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable",path:"machinable.Schedule.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.Schedule.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable",path:"machinable.Schedule.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.Schedule.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable",path:"machinable.Schedule.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Schedule.on_commit":{kind:"routine",realname:"on_commit",name:"machinable",path:"machinable.Schedule.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.Schedule.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable",path:"machinable.Schedule.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.Schedule.on_configure":{kind:"routine",realname:"on_configure",name:"machinable",path:"machinable.Schedule.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Schedule.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable",path:"machinable.Schedule.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.Schedule.project":{kind:"routine",realname:null,name:"machinable",path:"machinable.Schedule.project",signature:null,doc:null},"machinable.Schedule.push_related":{kind:"routine",realname:"push_related",name:"machinable",path:"machinable.Schedule.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.Schedule.related":{kind:"routine",realname:"related",name:"machinable",path:"machinable.Schedule.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.Schedule.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable",path:"machinable.Schedule.related_iterator",signature:"(self)",doc:null},"machinable.Schedule.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable",path:"machinable.Schedule.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.Schedule.save_file":{kind:"routine",realname:"save_file",name:"machinable",path:"machinable.Schedule.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.Schedule.serialize":{kind:"routine",realname:"serialize",name:"machinable",path:"machinable.Schedule.serialize",signature:"(self) -> dict",doc:null},"machinable.Schedule.set_default":{kind:"routine",realname:"set_default",name:"machinable",path:"machinable.Schedule.set_default",signature:null,doc:null},"machinable.Schedule.set_model":{kind:"routine",realname:"set_model",name:"machinable",path:"machinable.Schedule.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.Schedule.singleton":{kind:"routine",realname:"singleton",name:"machinable",path:"machinable.Schedule.singleton",signature:null,doc:null},"machinable.Schedule.stage":{kind:"routine",realname:"stage",name:"machinable",path:"machinable.Schedule.stage",signature:"(self) -> Self",doc:null},"machinable.Schedule.to_cli":{kind:"routine",realname:"to_cli",name:"machinable",path:"machinable.Schedule.to_cli",signature:"(self) -> str",doc:null},"machinable.Schedule.to_directory":{kind:"routine",realname:"to_directory",name:"machinable",path:"machinable.Schedule.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.Schedule.unserialize":{kind:"routine",realname:"unserialize",name:"machinable",path:"machinable.Schedule.unserialize",signature:null,doc:null},"machinable.Schedule.used_by":{kind:"routine",realname:null,name:"machinable",path:"machinable.Schedule.used_by",signature:null,doc:null},"machinable.Schedule.uses":{kind:"routine",realname:null,name:"machinable",path:"machinable.Schedule.uses",signature:null,doc:null},"machinable.Schedule.version":{kind:"routine",realname:"version",name:"machinable",path:"machinable.Schedule.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.Schedule":{kind:"class",realname:"Schedule",name:"machinable",path:"machinable.Schedule",parents:["machinable.interface.Interface"],doc:"Schedule base class",file:"src/machinable/schedule.py"},"machinable.Scope.all":{kind:"routine",realname:"all",name:"machinable",path:"machinable.Scope.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.Scope.ancestor":{kind:"routine",realname:null,name:"machinable",path:"machinable.Scope.ancestor",signature:null,doc:null},"machinable.Scope.as_default":{kind:"routine",realname:"as_default",name:"machinable",path:"machinable.Scope.as_default",signature:"(self) -> Self",doc:null},"machinable.Scope.as_json":{kind:"routine",realname:"as_json",name:"machinable",path:"machinable.Scope.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.Scope.cached":{kind:"routine",realname:"cached",name:"machinable",path:"machinable.Scope.cached",signature:"(self)",doc:null},"machinable.Scope.clone":{kind:"routine",realname:"clone",name:"machinable",path:"machinable.Scope.clone",signature:"(self)",doc:null},"machinable.Scope.collect":{kind:"routine",realname:"collect",name:"machinable",path:"machinable.Scope.collect",signature:null,doc:null},"machinable.Scope.commit":{kind:"routine",realname:"commit",name:"machinable",path:"machinable.Scope.commit",signature:"(self) -> Self",doc:null},"machinable.Scope.compute_context":{kind:"routine",realname:"compute_context",name:"machinable",path:"machinable.Scope.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.Scope.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable",path:"machinable.Scope.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.Scope.connected":{kind:"routine",realname:"connected",name:"machinable",path:"machinable.Scope.connected",signature:null,doc:null},"machinable.Scope.created_at":{kind:"routine",realname:"created_at",name:"machinable",path:"machinable.Scope.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.Scope.derive":{kind:"routine",realname:"derive",name:"machinable",path:"machinable.Scope.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.Scope.derived":{kind:"routine",realname:null,name:"machinable",path:"machinable.Scope.derived",signature:null,doc:null},"machinable.Scope.fetch":{kind:"routine",realname:"fetch",name:"machinable",path:"machinable.Scope.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.Scope.find":{kind:"routine",realname:"find",name:"machinable",path:"machinable.Scope.find",signature:null,doc:null},"machinable.Scope.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable",path:"machinable.Scope.find_by_hash",signature:null,doc:null},"machinable.Scope.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable",path:"machinable.Scope.find_by_id",signature:null,doc:null},"machinable.Scope.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable",path:"machinable.Scope.find_many_by_id",signature:null,doc:null},"machinable.Scope.from_directory":{kind:"routine",realname:"from_directory",name:"machinable",path:"machinable.Scope.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.Scope.from_json":{kind:"routine",realname:"from_json",name:"machinable",path:"machinable.Scope.from_json",signature:null,doc:null},"machinable.Scope.from_model":{kind:"routine",realname:"from_model",name:"machinable",path:"machinable.Scope.from_model",signature:null,doc:null},"machinable.Scope.future":{kind:"routine",realname:"future",name:"machinable",path:"machinable.Scope.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.Scope.get":{kind:"routine",realname:"get",name:"machinable",path:"machinable.Scope.get",signature:null,doc:null},"machinable.Scope.hidden":{kind:"routine",realname:"hidden",name:"machinable",path:"machinable.Scope.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.Scope.instance":{kind:"routine",realname:"instance",name:"machinable",path:"machinable.Scope.instance",signature:null,doc:null},"machinable.Scope.is_committed":{kind:"routine",realname:"is_committed",name:"machinable",path:"machinable.Scope.is_committed",signature:"(self) -> bool",doc:null},"machinable.Scope.is_connected":{kind:"routine",realname:"is_connected",name:"machinable",path:"machinable.Scope.is_connected",signature:null,doc:null},"machinable.Scope.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable",path:"machinable.Scope.is_mounted",signature:"(self) -> bool",doc:null},"machinable.Scope.is_staged":{kind:"routine",realname:"is_staged",name:"machinable",path:"machinable.Scope.is_staged",signature:"(self) -> bool",doc:null},"machinable.Scope.launch":{kind:"routine",realname:"launch",name:"machinable",path:"machinable.Scope.launch",signature:"(self) -> Self",doc:null},"machinable.Scope.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable",path:"machinable.Scope.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Scope.load_file":{kind:"routine",realname:"load_file",name:"machinable",path:"machinable.Scope.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Scope.local_directory":{kind:"routine",realname:"local_directory",name:"machinable",path:"machinable.Scope.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.Scope.make":{kind:"routine",realname:"make",name:"machinable",path:"machinable.Scope.make",signature:null,doc:null},"machinable.Scope.matches":{kind:"routine",realname:"matches",name:"machinable",path:"machinable.Scope.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.Scope.model":{kind:"routine",realname:"model",name:"machinable",path:"machinable.Scope.model",signature:null,doc:null},"machinable.Scope.new":{kind:"routine",realname:"new",name:"machinable",path:"machinable.Scope.new",signature:"(self) -> Self",doc:null},"machinable.Scope.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable",path:"machinable.Scope.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.Scope.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable",path:"machinable.Scope.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.Scope.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable",path:"machinable.Scope.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.Scope.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable",path:"machinable.Scope.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Scope.on_commit":{kind:"routine",realname:"on_commit",name:"machinable",path:"machinable.Scope.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.Scope.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable",path:"machinable.Scope.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.Scope.on_configure":{kind:"routine",realname:"on_configure",name:"machinable",path:"machinable.Scope.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Scope.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable",path:"machinable.Scope.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.Scope.project":{kind:"routine",realname:null,name:"machinable",path:"machinable.Scope.project",signature:null,doc:null},"machinable.Scope.push_related":{kind:"routine",realname:"push_related",name:"machinable",path:"machinable.Scope.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.Scope.related":{kind:"routine",realname:"related",name:"machinable",path:"machinable.Scope.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.Scope.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable",path:"machinable.Scope.related_iterator",signature:"(self)",doc:null},"machinable.Scope.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable",path:"machinable.Scope.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.Scope.save_file":{kind:"routine",realname:"save_file",name:"machinable",path:"machinable.Scope.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.Scope.serialize":{kind:"routine",realname:"serialize",name:"machinable",path:"machinable.Scope.serialize",signature:"(self) -> dict",doc:null},"machinable.Scope.set_default":{kind:"routine",realname:"set_default",name:"machinable",path:"machinable.Scope.set_default",signature:null,doc:null},"machinable.Scope.set_model":{kind:"routine",realname:"set_model",name:"machinable",path:"machinable.Scope.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.Scope.singleton":{kind:"routine",realname:"singleton",name:"machinable",path:"machinable.Scope.singleton",signature:null,doc:null},"machinable.Scope.stage":{kind:"routine",realname:"stage",name:"machinable",path:"machinable.Scope.stage",signature:"(self) -> Self",doc:null},"machinable.Scope.to_cli":{kind:"routine",realname:"to_cli",name:"machinable",path:"machinable.Scope.to_cli",signature:"(self) -> str",doc:null},"machinable.Scope.to_directory":{kind:"routine",realname:"to_directory",name:"machinable",path:"machinable.Scope.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.Scope.unserialize":{kind:"routine",realname:"unserialize",name:"machinable",path:"machinable.Scope.unserialize",signature:null,doc:null},"machinable.Scope.used_by":{kind:"routine",realname:null,name:"machinable",path:"machinable.Scope.used_by",signature:null,doc:null},"machinable.Scope.uses":{kind:"routine",realname:null,name:"machinable",path:"machinable.Scope.uses",signature:null,doc:null},"machinable.Scope.version":{kind:"routine",realname:"version",name:"machinable",path:"machinable.Scope.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.Scope":{kind:"class",realname:"Scope",name:"machinable",path:"machinable.Scope",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/scope.py"},"machinable.Storage.all":{kind:"routine",realname:"all",name:"machinable",path:"machinable.Storage.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.Storage.ancestor":{kind:"routine",realname:null,name:"machinable",path:"machinable.Storage.ancestor",signature:null,doc:null},"machinable.Storage.as_default":{kind:"routine",realname:"as_default",name:"machinable",path:"machinable.Storage.as_default",signature:"(self) -> Self",doc:null},"machinable.Storage.as_json":{kind:"routine",realname:"as_json",name:"machinable",path:"machinable.Storage.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.Storage.cached":{kind:"routine",realname:"cached",name:"machinable",path:"machinable.Storage.cached",signature:"(self)",doc:null},"machinable.Storage.clone":{kind:"routine",realname:"clone",name:"machinable",path:"machinable.Storage.clone",signature:"(self)",doc:null},"machinable.Storage.collect":{kind:"routine",realname:"collect",name:"machinable",path:"machinable.Storage.collect",signature:null,doc:null},"machinable.Storage.commit":{kind:"routine",realname:"commit",name:"machinable",path:"machinable.Storage.commit",signature:"(self, interface: 'Interface') -> None",doc:null},"machinable.Storage.compute_context":{kind:"routine",realname:"compute_context",name:"machinable",path:"machinable.Storage.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.Storage.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable",path:"machinable.Storage.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.Storage.connected":{kind:"routine",realname:"connected",name:"machinable",path:"machinable.Storage.connected",signature:null,doc:null},"machinable.Storage.contains":{kind:"routine",realname:"contains",name:"machinable",path:"machinable.Storage.contains",signature:"(self, uuid: str) -> bool",doc:null},"machinable.Storage.created_at":{kind:"routine",realname:"created_at",name:"machinable",path:"machinable.Storage.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.Storage.derive":{kind:"routine",realname:"derive",name:"machinable",path:"machinable.Storage.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.Storage.derived":{kind:"routine",realname:null,name:"machinable",path:"machinable.Storage.derived",signature:null,doc:null},"machinable.Storage.download":{kind:"routine",realname:"download",name:"machinable",path:"machinable.Storage.download",signature:"(self, uuid: str, destination: str | None = None, related: bool | int = True) -> list[str]",doc:`Download to destination

uuid: str
    Primary interface UUID
destination: str | None
    If None, download will be imported into active index. If directory filepath, download will be placed
    in directory without import to index
related: bool | int
    - 0/False: Do not upload related interfaces
    - 1/True: Upload immediately related interfaces
    - 2: Upload related interfaces and their related interfaces

Returns:
    List of downloaded directories`},"machinable.Storage.fetch":{kind:"routine",realname:"fetch",name:"machinable",path:"machinable.Storage.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.Storage.find":{kind:"routine",realname:"find",name:"machinable",path:"machinable.Storage.find",signature:null,doc:null},"machinable.Storage.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable",path:"machinable.Storage.find_by_hash",signature:null,doc:null},"machinable.Storage.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable",path:"machinable.Storage.find_by_id",signature:null,doc:null},"machinable.Storage.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable",path:"machinable.Storage.find_many_by_id",signature:null,doc:null},"machinable.Storage.from_directory":{kind:"routine",realname:"from_directory",name:"machinable",path:"machinable.Storage.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.Storage.from_json":{kind:"routine",realname:"from_json",name:"machinable",path:"machinable.Storage.from_json",signature:null,doc:null},"machinable.Storage.from_model":{kind:"routine",realname:"from_model",name:"machinable",path:"machinable.Storage.from_model",signature:null,doc:null},"machinable.Storage.future":{kind:"routine",realname:"future",name:"machinable",path:"machinable.Storage.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.Storage.get":{kind:"routine",realname:"get",name:"machinable",path:"machinable.Storage.get",signature:null,doc:null},"machinable.Storage.hidden":{kind:"routine",realname:"hidden",name:"machinable",path:"machinable.Storage.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.Storage.instance":{kind:"routine",realname:"instance",name:"machinable",path:"machinable.Storage.instance",signature:null,doc:null},"machinable.Storage.is_committed":{kind:"routine",realname:"is_committed",name:"machinable",path:"machinable.Storage.is_committed",signature:"(self) -> bool",doc:null},"machinable.Storage.is_connected":{kind:"routine",realname:"is_connected",name:"machinable",path:"machinable.Storage.is_connected",signature:null,doc:null},"machinable.Storage.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable",path:"machinable.Storage.is_mounted",signature:"(self) -> bool",doc:null},"machinable.Storage.is_staged":{kind:"routine",realname:"is_staged",name:"machinable",path:"machinable.Storage.is_staged",signature:"(self) -> bool",doc:null},"machinable.Storage.launch":{kind:"routine",realname:"launch",name:"machinable",path:"machinable.Storage.launch",signature:"(self) -> Self",doc:null},"machinable.Storage.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable",path:"machinable.Storage.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Storage.load_file":{kind:"routine",realname:"load_file",name:"machinable",path:"machinable.Storage.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.Storage.local_directory":{kind:"routine",realname:"local_directory",name:"machinable",path:"machinable.Storage.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.Storage.make":{kind:"routine",realname:"make",name:"machinable",path:"machinable.Storage.make",signature:null,doc:null},"machinable.Storage.matches":{kind:"routine",realname:"matches",name:"machinable",path:"machinable.Storage.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.Storage.model":{kind:"routine",realname:"model",name:"machinable",path:"machinable.Storage.model",signature:null,doc:null},"machinable.Storage.new":{kind:"routine",realname:"new",name:"machinable",path:"machinable.Storage.new",signature:"(self) -> Self",doc:null},"machinable.Storage.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable",path:"machinable.Storage.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.Storage.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable",path:"machinable.Storage.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.Storage.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable",path:"machinable.Storage.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.Storage.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable",path:"machinable.Storage.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Storage.on_commit":{kind:"routine",realname:"on_commit",name:"machinable",path:"machinable.Storage.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.Storage.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable",path:"machinable.Storage.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.Storage.on_configure":{kind:"routine",realname:"on_configure",name:"machinable",path:"machinable.Storage.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.Storage.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable",path:"machinable.Storage.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.Storage.project":{kind:"routine",realname:null,name:"machinable",path:"machinable.Storage.project",signature:null,doc:null},"machinable.Storage.push_related":{kind:"routine",realname:"push_related",name:"machinable",path:"machinable.Storage.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.Storage.related":{kind:"routine",realname:"related",name:"machinable",path:"machinable.Storage.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.Storage.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable",path:"machinable.Storage.related_iterator",signature:"(self)",doc:null},"machinable.Storage.retrieve":{kind:"routine",realname:"retrieve",name:"machinable",path:"machinable.Storage.retrieve",signature:"(self, uuid: str, local_directory: str) -> bool",doc:null},"machinable.Storage.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable",path:"machinable.Storage.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.Storage.save_file":{kind:"routine",realname:"save_file",name:"machinable",path:"machinable.Storage.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.Storage.search_for":{kind:"routine",realname:"search_for",name:"machinable",path:"machinable.Storage.search_for",signature:"(self, interface: 'Interface') -> list[str]",doc:null},"machinable.Storage.serialize":{kind:"routine",realname:"serialize",name:"machinable",path:"machinable.Storage.serialize",signature:"(self) -> dict",doc:null},"machinable.Storage.set_default":{kind:"routine",realname:"set_default",name:"machinable",path:"machinable.Storage.set_default",signature:null,doc:null},"machinable.Storage.set_model":{kind:"routine",realname:"set_model",name:"machinable",path:"machinable.Storage.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.Storage.singleton":{kind:"routine",realname:"singleton",name:"machinable",path:"machinable.Storage.singleton",signature:null,doc:null},"machinable.Storage.stage":{kind:"routine",realname:"stage",name:"machinable",path:"machinable.Storage.stage",signature:"(self) -> Self",doc:null},"machinable.Storage.to_cli":{kind:"routine",realname:"to_cli",name:"machinable",path:"machinable.Storage.to_cli",signature:"(self) -> str",doc:null},"machinable.Storage.to_directory":{kind:"routine",realname:"to_directory",name:"machinable",path:"machinable.Storage.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.Storage.unserialize":{kind:"routine",realname:"unserialize",name:"machinable",path:"machinable.Storage.unserialize",signature:null,doc:null},"machinable.Storage.update":{kind:"routine",realname:"update",name:"machinable",path:"machinable.Storage.update",signature:"(self, interface: 'Interface') -> None",doc:null},"machinable.Storage.upload":{kind:"routine",realname:"upload",name:"machinable",path:"machinable.Storage.upload",signature:"(self, interface: 'Interface', related: bool | int = True) -> None",doc:`Upload the interface to the storage

interface: Interface
related: bool | int
    - 0/False: Do not save related interfaces
    - 1/True: Save immediately related interfaces
    - 2: Save related interfaces and their related interfaces`},"machinable.Storage.used_by":{kind:"routine",realname:null,name:"machinable",path:"machinable.Storage.used_by",signature:null,doc:null},"machinable.Storage.uses":{kind:"routine",realname:null,name:"machinable",path:"machinable.Storage.uses",signature:null,doc:null},"machinable.Storage.version":{kind:"routine",realname:"version",name:"machinable",path:"machinable.Storage.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.Storage":{kind:"class",realname:"Storage",name:"machinable",path:"machinable.Storage",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/storage.py"},"machinable.from_cli":{kind:"routine",realname:"from_cli",name:"machinable",path:"machinable.from_cli",signature:"(args: list | None = None) -> 'VersionType'",doc:null},"machinable.mixin":{kind:"module",name:"machinable.mixin",path:"machinable.mixin",doc:null,file:"src/machinable/mixin.py"},machinable:{kind:"module",name:"machinable",path:"machinable",doc:"A modular system for machinable research code",file:"src/machinable/__init__.py"},"machinable.cli.from_cli":{kind:"routine",realname:"from_cli",name:"machinable.cli",path:"machinable.cli.from_cli",signature:"(args: list | None = None) -> 'VersionType'",doc:null},"machinable.cli.main":{kind:"routine",realname:"main",name:"machinable.cli",path:"machinable.cli.main",signature:"(args: list | None = None)",doc:null},"machinable.cli.parse":{kind:"routine",realname:"parse",name:"machinable.cli",path:"machinable.cli.parse",signature:"(args: list) -> tuple",doc:null},"machinable.cli":{kind:"module",name:"machinable.cli",path:"machinable.cli",doc:null,file:"src/machinable/cli.py"},"machinable.collection.Collection.all":{kind:"routine",realname:"all",name:"machinable.collection",path:"machinable.collection.Collection.all",signature:"(self)",doc:`Get all of the items in the collection.

Returns the underlying list represented by the
collection

\`\`\` python
Collection([1, 2, 3]).all()

# [1, 2, 3]
\`\`\``},"machinable.collection.Collection.append":{kind:"routine",realname:"append",name:"machinable.collection",path:"machinable.collection.Collection.append",signature:"(self, value)",doc:`Add an item onto the end of the collection.

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.push(5)

collection.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.Collection.as_dataframe":{kind:"routine",realname:"as_dataframe",name:"machinable.collection",path:"machinable.collection.Collection.as_dataframe",signature:"(self)",doc:"Returns collection as Pandas dataframe"},"machinable.collection.Collection.as_json":{kind:"routine",realname:"as_json",name:"machinable.collection",path:"machinable.collection.Collection.as_json",signature:"(self, **options)",doc:`Converts the collection into JSON

# Arguments
options: JSON encoding options

\`\`\` python
collection = Collection([{'name': 'Desk', 'price': 200}])

collection.as_json()

# '[{"name": "Desk", "price": 200}]'
\`\`\``},"machinable.collection.Collection.as_numpy":{kind:"routine",realname:"as_numpy",name:"machinable.collection",path:"machinable.collection.Collection.as_numpy",signature:"(self)",doc:"Converts the collection into a numpy array"},"machinable.collection.Collection.as_table":{kind:"routine",realname:"as_table",name:"machinable.collection",path:"machinable.collection.Collection.as_table",signature:"(self, mode='html', headers=(), **kwargs)",doc:`Converts the collection into a table

# Arguments
mode: String 'html' or any other mode of the tabulate package
headers: Optional header row
**kwargs: Options to pass to tabulate`},"machinable.collection.Collection.avg":{kind:"routine",realname:"avg",name:"machinable.collection",path:"machinable.collection.Collection.avg",signature:"(self, key=None)",doc:`Get the average value of a given key.

# Arguments
key: The key to get the average for

\`\`\` python
Collection([1, 2, 3, 4, 5]).avg()
# 3
\`\`\`

If the collection contains nested objects or dictionaries, you must pass
a key to use for determining which values to calculate the average:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])
# 636
collection.avg('pages')
\`\`\``},"machinable.collection.Collection.chunk":{kind:"routine",realname:"chunk",name:"machinable.collection",path:"machinable.collection.Collection.chunk",signature:"(self, size)",doc:`Chunk the underlying collection.

The \`chunk\` method breaks the collection into multiple, smaller
collections of a given size:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5, 6, 7])

chunks = collection.chunk(4)

chunks.serialize()

# [[1, 2, 3, 4], [5, 6, 7]]
\`\`\`

# Arguments
size: The chunk size`},"machinable.collection.Collection.collapse":{kind:"routine",realname:"collapse",name:"machinable.collection",path:"machinable.collection.Collection.collapse",signature:"(self)",doc:`Collapses a collection of lists into a flat collection

\`\`\` python
collection = Collection([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
collapsed = collection.collapse()
collapsed.all()
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\``},"machinable.collection.Collection.contains":{kind:"routine",realname:"contains",name:"machinable.collection",path:"machinable.collection.Collection.contains",signature:"(self, key, value=None)",doc:`Determines if an element is in the collection

# Arguments
key: \`\`Integer\`\`|\`\`String\`\`|\`\`callable\`\` The element
value: The value of the element

\`\`\` python
collection = Collection(['foo', 'bar'])

collection.contains('foo')

# True
\`\`\`

You can also use the \`in\` keyword:

\`\`\` python
'foo' in collection

# True
\`\`\`

You can also pass a key / value pair to the \`contains\` method, which
will determine if the given pair exists in the collection:

\`\`\` python
collection = Collection([
    {'name': 'John', 'id': 1},
    {'name': 'Jane', 'id': 2}
])

collection.contains('name', 'Simon')

# False
\`\`\`

Finally, you may also pass a callback to the \`contains\` method to
perform your own truth test:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])

collection.contains(lambda item: item > 5)

# False
\`\`\``},"machinable.collection.Collection.count":{kind:"routine",realname:"count",name:"machinable.collection",path:"machinable.collection.Collection.count",signature:"(self)",doc:`Returns the total number of items in the collection:

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.count()

# 4
\`\`\`

The \`len\` function can also be used:

\`\`\` python
len(collection)

# 4
\`\`\``},"machinable.collection.Collection.diff":{kind:"routine",realname:"diff",name:"machinable.collection",path:"machinable.collection.Collection.diff",signature:"(self, items)",doc:"Compares the collection against another collection, a `list` or a `dict`\n\n# Arguments\nitems: The items to diff with\n\n``` python\ncollection = Collection([1, 2, 3, 4, 5])\ndiff = collection.diff([2, 4, 6, 8])\ndiff.all()\n# [1, 3, 5]\n```"},"machinable.collection.Collection.each":{kind:"routine",realname:"each",name:"machinable.collection",path:"machinable.collection.Collection.each",signature:"(self, callback)",doc:`Iterates over the items in the collection and passes each item to a given callback

# Arguments
callback: \`\`callable\`\` The callback to execute

\`\`\` python
collection = Collection([1, 2, 3])
collection.each(lambda x: x + 3)
\`\`\`

Return \`False\` from your callback to break out of the loop:

\`\`\` python
observations.each(lambda data: data.save() if data.name == 'mnist' else False)
\`\`\`

::: tip
It only applies the callback but does not modify the collection's items.
Use the [transform()](#transform) method to
modify the collection.
:::`},"machinable.collection.Collection.empty":{kind:"routine",realname:"empty",name:"machinable.collection",path:"machinable.collection.Collection.empty",signature:"(self)",doc:"Returns `True` if the collection is empty; otherwise, `False` is returned"},"machinable.collection.Collection.every":{kind:"routine",realname:"every",name:"machinable.collection",path:"machinable.collection.Collection.every",signature:"(self, step, offset=0)",doc:"Create a new collection consisting of every n-th element.\n\n# Arguments\nstep: ``int`` The step size\noffset: ``int`` The start offset\n\n``` python\ncollection = Collection(['a', 'b', 'c', 'd', 'e', 'f'])\n\ncollection.every(4).all()\n\n# ['a', 'e']\n```\n\nYou can optionally pass the offset as the second argument:\n\n``` python\ncollection.every(4, 1).all()\n\n# ['b', 'f']\n```"},"machinable.collection.Collection.filter":{kind:"routine",realname:"filter",name:"machinable.collection",path:"machinable.collection.Collection.filter",signature:"(self, callback=None)",doc:"Filters the collection by a given callback, keeping only those items that pass a given truth test\n\n# Arguments\ncallback: ``callable``|``None`` The filter callback\n\n``` python\ncollection = Collection([1, 2, 3, 4])\n\nfiltered = collection.filter(lambda item: item > 2)\n\nfiltered.all()\n\n# [3, 4]\n```"},"machinable.collection.Collection.first":{kind:"routine",realname:"first",name:"machinable.collection",path:"machinable.collection.Collection.first",signature:"(self, callback=None, default=None)",doc:`Returns the first element in the collection that passes a given truth test

# Arguments
callback: Optional callable truth condition to find first element
default: A default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.first(lambda item: item > 2)

# 3
\`\`\`

You can also call the \`first\` method with no arguments to get the first
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.first()

# 1
\`\`\``},"machinable.collection.Collection.flatten":{kind:"routine",realname:"flatten",name:"machinable.collection",path:"machinable.collection.Collection.flatten",signature:"(self)",doc:`Flattens a multi-dimensional collection into a single dimension

\`\`\` python
collection = Collection([1, 2, [3, 4, 5, {'foo': 'bar'}]])

flattened = collection.flatten()

flattened.all()

# [1, 2, 3, 4, 5, 'bar']
\`\`\``},"machinable.collection.Collection.forget":{kind:"routine",realname:"forget",name:"machinable.collection",path:"machinable.collection.Collection.forget",signature:"(self, *keys)",doc:`Remove an item from the collection by key.

# Arguments
keys: The keys to remove

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.forget(1)
collection.all()
# [1, 3, 4, 5]
\`\`\`

::: warning
Unlike most other collection methods, \`forget\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.Collection.get":{kind:"routine",realname:"get",name:"machinable.collection",path:"machinable.collection.Collection.get",signature:"(self, key, default=None)",doc:`Returns the item at a given key. If the key does not exist, \`None\` is returned

# Arguments
key: The index of the element
default: The default value to return

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3)
# None
\`\`\`

You can optionally pass a default value as the second argument:

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3, 'default-value')
# default-value
\`\`\``},"machinable.collection.Collection.implode":{kind:"routine",realname:"implode",name:"machinable.collection",path:"machinable.collection.Collection.implode",signature:"(self, value, glue='')",doc:`Joins the items in a collection. Its arguments depend on the type of items in the collection.

# Arguments
value: The value
glue: The glue

If the collection contains dictionaries or objects, you must pass the
key of the attributes you wish to join, and the "glue" string you wish
to place between the values:

\`\`\` python
collection = Collection([
    {'account_id': 1, 'product': 'Desk'},
    {'account_id': 2, 'product': 'Chair'}
])

collection.implode('product', ', ')

# Desk, Chair
\`\`\`

If the collection contains simple strings, simply pass the "glue" as the
only argument to the method:

\`\`\` python
collection = Collection(['foo', 'bar', 'baz'])

collection.implode('-')

# foo-bar-baz
\`\`\``},"machinable.collection.Collection.last":{kind:"routine",realname:"last",name:"machinable.collection",path:"machinable.collection.Collection.last",signature:"(self, callback=None, default=None)",doc:`Returns the last element in the collection that passes a given truth test

# Arguments
callback: Optional \`\`callable\`\` truth condition
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

last = collection.last(lambda item: item < 3)

# 2
\`\`\`

You can also call the \`last\` method with no arguments to get the last
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.last()

# 4
\`\`\``},"machinable.collection.Collection.make":{kind:"routine",realname:"make",name:"machinable.collection",path:"machinable.collection.Collection.make",signature:null,doc:"Create a new Collection instance if the value isn't one already\n\n# Arguments\nitems: ``list``|``Collection``|``map`` of items to collect"},"machinable.collection.Collection.map":{kind:"routine",realname:"map",name:"machinable.collection",path:"machinable.collection.Collection.map",signature:"(self, callback)",doc:`Iterates through the collection and passes each value to the given callback.
The callback is free to modify the item and return it, thus forming a new collection of modified items

# Arguments
callback: The map function

\`\`\` python
collection = Collection([1, 2, 3, 4])

multiplied = collection.map(lambda item: item * 2)

multiplied.all()

# [2, 4, 6, 8]
\`\`\`

::: warning
Like most other collection methods, \`map\` returns a new \`Collection\`
instance; it does not modify the collection it is called on. If you want
to transform the original collection, use the [transform](#transform)
method.
:::`},"machinable.collection.Collection.max":{kind:"routine",realname:"max",name:"machinable.collection",path:"machinable.collection.Collection.max",signature:"(self, key=None)",doc:`Get the max value of a given key.

# Arguments
key: The key`},"machinable.collection.Collection.merge":{kind:"routine",realname:"merge",name:"machinable.collection",path:"machinable.collection.Collection.merge",signature:"(self, items)",doc:`Merges the given list into the collection

# Arguments
items: The items to merge

\`\`\` python
collection = Collection(['Desk', 'Chair'])
collection.merge(['Bookcase', 'Door'])
collection.all()
# ['Desk', 'Chair', 'Bookcase', 'Door']
\`\`\`

::: warning
Unlike most other collection methods, \`merge\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.Collection.min":{kind:"routine",realname:"min",name:"machinable.collection",path:"machinable.collection.Collection.min",signature:"(self, key=None)",doc:`Get the min value of a given key.

key: The key`},"machinable.collection.Collection.only":{kind:"routine",realname:"only",name:"machinable.collection",path:"machinable.collection.Collection.only",signature:"(self, *keys)",doc:"Get the items with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to keep"},"machinable.collection.Collection.pluck":{kind:"routine",realname:"pluck",name:"machinable.collection",path:"machinable.collection.Collection.pluck",signature:"(self, value, key=None)",doc:`Retrieves all of the collection values for a given key

# Arguments
value: Value
key: Optional key

\`\`\` python
collection = Collection([
    {'product_id': 1, 'product': 'Desk'},
    {'product_id': 2, 'product': 'Chair'}
])

plucked = collection.pluck('product')

plucked.all()

# ['Desk', 'Chair']
\`\`\`

You can also specify how you wish the resulting collection to be keyed:

\`\`\` python
plucked = collection.pluck('name', 'product_id')

plucked

# {1: 'Desk', 2: 'Chair'}
\`\`\``},"machinable.collection.Collection.pluck_or_nan":{kind:"routine",realname:"pluck_or_nan",name:"machinable.collection",path:"machinable.collection.Collection.pluck_or_nan",signature:"(self, value, key=None)",doc:`Pluck method that returns NaNs if key is not present

# Arguments
value: Value
key: Key`},"machinable.collection.Collection.pluck_or_none":{kind:"routine",realname:"pluck_or_none",name:"machinable.collection",path:"machinable.collection.Collection.pluck_or_none",signature:"(self, value, key=None, none=None)",doc:`Pluck method that returns None if key is not present

# Arguments
value: Value
key: Key
none: Return value if key is not present`},"machinable.collection.Collection.pop":{kind:"routine",realname:"pop",name:"machinable.collection",path:"machinable.collection.Collection.pop",signature:"(self, key=None)",doc:`Removes and returns the last item from the collection.
If no index is specified, returns the last item.

# Arguments
key: The index of the item to return


\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.pop()
# 5

collection.all()
# [1, 2, 3, 4]
\`\`\``},"machinable.collection.Collection.pprint":{kind:"routine",realname:"pprint",name:"machinable.collection",path:"machinable.collection.Collection.pprint",signature:"(self, pformat='json')",doc:null},"machinable.collection.Collection.prepend":{kind:"routine",realname:"prepend",name:"machinable.collection",path:"machinable.collection.Collection.prepend",signature:"(self, value)",doc:`Adds an item to the beginning of the collection

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.prepend(0)

collection.all()

# [0, 1, 2, 3, 4]
\`\`\``},"machinable.collection.Collection.pull":{kind:"routine",realname:"pull",name:"machinable.collection",path:"machinable.collection.Collection.pull",signature:"(self, key, default=None)",doc:`Removes and returns an item from the collection by its key

# Arugments
key: The key
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.pull(1)

collection.all()

# [1, 3, 4]
\`\`\``},"machinable.collection.Collection.put":{kind:"routine",realname:"put",name:"machinable.collection",path:"machinable.collection.Collection.put",signature:"(self, key, value)",doc:`Sets the given key and value in the collection

# Arguments
key: The key
value: The value

\`\`\` python
collection = Collection([1, 2, 3, 4])
collection.put(1, 5)
collection.all()

# [1, 5, 3, 4]
\`\`\`

::: tip
It is equivalent to \`\`collection[1] = 5\`\`
:::`},"machinable.collection.Collection.reduce":{kind:"routine",realname:"reduce",name:"machinable.collection",path:"machinable.collection.Collection.reduce",signature:"(self, callback, initial=None)",doc:`Reduces the collection to a single value, passing the result of each iteration into the subsequent iteration

# Arguments
callback: The callback
initial: The initial value

\`\`\` python
collection = Collection([1, 2, 3])

collection.reduce(lambda result, item: (result or 0) + item)

# 6
\`\`\`

The value for \`result\` on the first iteration is \`None\`; however, you
can specify its initial value by passing a second argument to reduce:

\`\`\` python
collection.reduce(lambda result, item: result + item, 4)

# 10
\`\`\``},"machinable.collection.Collection.reject":{kind:"routine",realname:"reject",name:"machinable.collection",path:"machinable.collection.Collection.reject",signature:"(self, callback)",doc:`Filters the collection using the given callback. The callback should return \`True\` for any items it wishes
to remove from the resulting collection

# Arguments
callback: The truth test

\`\`\` python
collection = Collection([1, 2, 3, 4])

filtered = collection.reject(lambda item: item > 2)

filtered.all()

# [1, 2]
\`\`\`

For the inverse of \`reject\`, see the [filter](#filter) method.`},"machinable.collection.Collection.reverse":{kind:"routine",realname:"reverse",name:"machinable.collection",path:"machinable.collection.Collection.reverse",signature:"(self)",doc:`Reverses the order of the collection's items

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
reverse = collection.reverse()
reverse.all()
# [5, 4, 3, 2, 1]
\`\`\``},"machinable.collection.Collection.section":{kind:"routine",realname:"section",name:"machinable.collection",path:"machinable.collection.Collection.section",signature:"(self, of, reduce=None)",doc:"Performs horizontal reduce through the collection\n\n# Arguments\nof: ``Callable`` Selector of reduce values\nreduce: Optional ``callable`` reduce method"},"machinable.collection.Collection.serialize":{kind:"routine",realname:"serialize",name:"machinable.collection",path:"machinable.collection.Collection.serialize",signature:"(self)",doc:`Converts the collection into a \`list\`

\`\`\` python
collection = Collection([User.find(1)])
collection.serialize()
# [{'id': 1, 'name': 'John'}]
\`\`\`

::: warning
\`serialize\` also converts all of its nested objects. If you want to get
the underlying items as is, use the [all](#all) method instead.
:::`},"machinable.collection.Collection.sort":{kind:"routine",realname:"sort",name:"machinable.collection",path:"machinable.collection.Collection.sort",signature:"(self, callback=None, reverse=False)",doc:`Sorts the collection

# Arguments
callback: Sort callable
reverse: True for reversed sort order

\`\`\` python
collection = Collection([5, 3, 1, 2, 4])

sorted = collection.sort()

sorted.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.Collection.sum":{kind:"routine",realname:"sum",name:"machinable.collection",path:"machinable.collection.Collection.sum",signature:"(self, callback=None)",doc:`Returns the sum of all items in the collection

callback: The callback

\`\`\` python
Collection([1, 2, 3, 4, 5]).sum()

# 15
\`\`\`

If the collection contains dictionaries or objects, you must pass a key
to use for determining which values to sum:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])

collection.sum('pages')

# 1272
\`\`\`

In addition, you can pass your own callback to determine which values of
the collection to sum:

\`\`\` python
collection = Collection([
    {'name': 'Chair', 'colors': ['Black']},
    {'name': 'Desk', 'colors': ['Black', 'Mahogany']},
    {'name': 'Bookcase', 'colors': ['Red', 'Beige', 'Brown']}
])

collection.sum(lambda product: len(product['colors']))

# 6
\`\`\``},"machinable.collection.Collection.take":{kind:"routine",realname:"take",name:"machinable.collection",path:"machinable.collection.Collection.take",signature:"(self, limit)",doc:`Take the first or last n items.

# Arguments
limit: The number of items to take

\`\`\` python
collection = Collection([0, 1, 2, 3, 4, 5])
chunk = collection.take(3)
chunk.all()
# [0, 1, 2]
\`\`\`

You can also pass a negative integer to take the specified amount of
items from the end of the collection:

\`\`\` python
chunk = collection.chunk(-2)
chunk.all()
# [4, 5]
\`\`\``},"machinable.collection.Collection.transform":{kind:"routine",realname:"transform",name:"machinable.collection",path:"machinable.collection.Collection.transform",signature:"(self, callback)",doc:`Transform each item in the collection using a callback.

Iterates over the collection and calls the given callback with each item in the collection.
The items in the collection will be replaced by the values returned by the callback.

# Arguments
callback: The callback

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.transform(lambda item: item * 2)
collection.all()

# [2, 4, 6, 8, 10]
\`\`\`

::: warning
Unlike most other collection methods, \`transform\` modifies the
collection itself. If you wish to create a new collection instead, use
the [map](#map) method.
:::`},"machinable.collection.Collection.unique":{kind:"routine",realname:"unique",name:"machinable.collection",path:"machinable.collection.Collection.unique",signature:"(self, key=None)",doc:`Returns all of the unique items in the collection

# Arguments
key: The key to check uniqueness on

\`\`\` python
collection = Collection([1, 1, 2, 2, 3, 4, 2])

unique = collection.unique()

unique.all()

# [1, 2, 3, 4]
\`\`\`

When dealing with dictionaries or objects, you can specify the key used
to determine uniqueness:

\`\`\` python
collection = Collection([
    {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'iPhone 5', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
    {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
    {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
])

unique = collection.unique('brand')

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'}
# ]
\`\`\`

You can also pass your own callback to determine item uniqueness:

\`\`\` python
unique = collection.unique(lambda item: item['brand'] + item['type'])

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
#     {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
# ]
\`\`\``},"machinable.collection.Collection.where":{kind:"routine",realname:"where",name:"machinable.collection",path:"machinable.collection.Collection.where",signature:"(self, key, value)",doc:`Filter items by the given key value pair.

# Arguments
key: The key to filter by
value: The value to filter by

\`\`\` python
collection = Collection([
    {'name': 'Desk', 'price': 200},
    {'name': 'Chair', 'price': 100},
    {'name': 'Bookcase', 'price': 150},
    {'name': 'Door', 'price': 100},
])

filtered = collection.where('price', 100)

filtered.all()

# [
#     {'name': 'Chair', 'price': 100},
#     {'name': 'Door', 'price': 100}
# ]
\`\`\``},"machinable.collection.Collection.without":{kind:"routine",realname:"without",name:"machinable.collection",path:"machinable.collection.Collection.without",signature:"(self, *keys)",doc:"Get all items except for those with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to remove"},"machinable.collection.Collection.zip":{kind:"routine",realname:"zip",name:"machinable.collection",path:"machinable.collection.Collection.zip",signature:"(self, *items)",doc:`Merges together the values of the given list with the values of the collection at the corresponding index

# Argument
*items: Zip items

\`\`\` python
collection = Collection(['Chair', 'Desk'])
zipped = collection.zip([100, 200])
zipped.all()
# [('Chair', 100), ('Desk', 200)]
\`\`\``},"machinable.collection.Collection":{kind:"class",realname:"Collection",name:"machinable.collection",path:"machinable.collection.Collection",parents:["builtins.object"],doc:null,file:"src/machinable/collection.py"},"machinable.collection.ComponentCollection.all":{kind:"routine",realname:"all",name:"machinable.collection",path:"machinable.collection.ComponentCollection.all",signature:"(self)",doc:`Get all of the items in the collection.

Returns the underlying list represented by the
collection

\`\`\` python
Collection([1, 2, 3]).all()

# [1, 2, 3]
\`\`\``},"machinable.collection.ComponentCollection.append":{kind:"routine",realname:"append",name:"machinable.collection",path:"machinable.collection.ComponentCollection.append",signature:"(self, value)",doc:`Add an item onto the end of the collection.

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.push(5)

collection.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.ComponentCollection.as_dataframe":{kind:"routine",realname:"as_dataframe",name:"machinable.collection",path:"machinable.collection.ComponentCollection.as_dataframe",signature:"(self)",doc:"Returns collection as Pandas dataframe"},"machinable.collection.ComponentCollection.as_json":{kind:"routine",realname:"as_json",name:"machinable.collection",path:"machinable.collection.ComponentCollection.as_json",signature:"(self, **options)",doc:`Converts the collection into JSON

# Arguments
options: JSON encoding options

\`\`\` python
collection = Collection([{'name': 'Desk', 'price': 200}])

collection.as_json()

# '[{"name": "Desk", "price": 200}]'
\`\`\``},"machinable.collection.ComponentCollection.as_numpy":{kind:"routine",realname:"as_numpy",name:"machinable.collection",path:"machinable.collection.ComponentCollection.as_numpy",signature:"(self)",doc:"Converts the collection into a numpy array"},"machinable.collection.ComponentCollection.as_table":{kind:"routine",realname:"as_table",name:"machinable.collection",path:"machinable.collection.ComponentCollection.as_table",signature:"(self, mode='html', headers=(), **kwargs)",doc:`Converts the collection into a table

# Arguments
mode: String 'html' or any other mode of the tabulate package
headers: Optional header row
**kwargs: Options to pass to tabulate`},"machinable.collection.ComponentCollection.avg":{kind:"routine",realname:"avg",name:"machinable.collection",path:"machinable.collection.ComponentCollection.avg",signature:"(self, key=None)",doc:`Get the average value of a given key.

# Arguments
key: The key to get the average for

\`\`\` python
Collection([1, 2, 3, 4, 5]).avg()
# 3
\`\`\`

If the collection contains nested objects or dictionaries, you must pass
a key to use for determining which values to calculate the average:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])
# 636
collection.avg('pages')
\`\`\``},"machinable.collection.ComponentCollection.chunk":{kind:"routine",realname:"chunk",name:"machinable.collection",path:"machinable.collection.ComponentCollection.chunk",signature:"(self, size)",doc:`Chunk the underlying collection.

The \`chunk\` method breaks the collection into multiple, smaller
collections of a given size:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5, 6, 7])

chunks = collection.chunk(4)

chunks.serialize()

# [[1, 2, 3, 4], [5, 6, 7]]
\`\`\`

# Arguments
size: The chunk size`},"machinable.collection.ComponentCollection.collapse":{kind:"routine",realname:"collapse",name:"machinable.collection",path:"machinable.collection.ComponentCollection.collapse",signature:"(self)",doc:`Collapses a collection of lists into a flat collection

\`\`\` python
collection = Collection([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
collapsed = collection.collapse()
collapsed.all()
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\``},"machinable.collection.ComponentCollection.contains":{kind:"routine",realname:"contains",name:"machinable.collection",path:"machinable.collection.ComponentCollection.contains",signature:"(self, key, value=None)",doc:`Determines if an element is in the collection

# Arguments
key: \`\`Integer\`\`|\`\`String\`\`|\`\`callable\`\` The element
value: The value of the element

\`\`\` python
collection = Collection(['foo', 'bar'])

collection.contains('foo')

# True
\`\`\`

You can also use the \`in\` keyword:

\`\`\` python
'foo' in collection

# True
\`\`\`

You can also pass a key / value pair to the \`contains\` method, which
will determine if the given pair exists in the collection:

\`\`\` python
collection = Collection([
    {'name': 'John', 'id': 1},
    {'name': 'Jane', 'id': 2}
])

collection.contains('name', 'Simon')

# False
\`\`\`

Finally, you may also pass a callback to the \`contains\` method to
perform your own truth test:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])

collection.contains(lambda item: item > 5)

# False
\`\`\``},"machinable.collection.ComponentCollection.count":{kind:"routine",realname:"count",name:"machinable.collection",path:"machinable.collection.ComponentCollection.count",signature:"(self)",doc:`Returns the total number of items in the collection:

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.count()

# 4
\`\`\`

The \`len\` function can also be used:

\`\`\` python
len(collection)

# 4
\`\`\``},"machinable.collection.ComponentCollection.diff":{kind:"routine",realname:"diff",name:"machinable.collection",path:"machinable.collection.ComponentCollection.diff",signature:"(self, items)",doc:"Compares the collection against another collection, a `list` or a `dict`\n\n# Arguments\nitems: The items to diff with\n\n``` python\ncollection = Collection([1, 2, 3, 4, 5])\ndiff = collection.diff([2, 4, 6, 8])\ndiff.all()\n# [1, 3, 5]\n```"},"machinable.collection.ComponentCollection.each":{kind:"routine",realname:"each",name:"machinable.collection",path:"machinable.collection.ComponentCollection.each",signature:"(self, callback)",doc:`Iterates over the items in the collection and passes each item to a given callback

# Arguments
callback: \`\`callable\`\` The callback to execute

\`\`\` python
collection = Collection([1, 2, 3])
collection.each(lambda x: x + 3)
\`\`\`

Return \`False\` from your callback to break out of the loop:

\`\`\` python
observations.each(lambda data: data.save() if data.name == 'mnist' else False)
\`\`\`

::: tip
It only applies the callback but does not modify the collection's items.
Use the [transform()](#transform) method to
modify the collection.
:::`},"machinable.collection.ComponentCollection.empty":{kind:"routine",realname:"empty",name:"machinable.collection",path:"machinable.collection.ComponentCollection.empty",signature:"(self)",doc:"Returns `True` if the collection is empty; otherwise, `False` is returned"},"machinable.collection.ComponentCollection.every":{kind:"routine",realname:"every",name:"machinable.collection",path:"machinable.collection.ComponentCollection.every",signature:"(self, step, offset=0)",doc:"Create a new collection consisting of every n-th element.\n\n# Arguments\nstep: ``int`` The step size\noffset: ``int`` The start offset\n\n``` python\ncollection = Collection(['a', 'b', 'c', 'd', 'e', 'f'])\n\ncollection.every(4).all()\n\n# ['a', 'e']\n```\n\nYou can optionally pass the offset as the second argument:\n\n``` python\ncollection.every(4, 1).all()\n\n# ['b', 'f']\n```"},"machinable.collection.ComponentCollection.filter":{kind:"routine",realname:"filter",name:"machinable.collection",path:"machinable.collection.ComponentCollection.filter",signature:"(self, callback=None)",doc:"Filters the collection by a given callback, keeping only those items that pass a given truth test\n\n# Arguments\ncallback: ``callable``|``None`` The filter callback\n\n``` python\ncollection = Collection([1, 2, 3, 4])\n\nfiltered = collection.filter(lambda item: item > 2)\n\nfiltered.all()\n\n# [3, 4]\n```"},"machinable.collection.ComponentCollection.filter_by_context":{kind:"routine",realname:"filter_by_context",name:"machinable.collection",path:"machinable.collection.ComponentCollection.filter_by_context",signature:"(self, module: str, version: str | dict | None | list[str | dict | None] = None, **kwargs)",doc:null},"machinable.collection.ComponentCollection.filter_by_module":{kind:"routine",realname:"filter_by_module",name:"machinable.collection",path:"machinable.collection.ComponentCollection.filter_by_module",signature:"(self, module)",doc:null},"machinable.collection.ComponentCollection.first":{kind:"routine",realname:"first",name:"machinable.collection",path:"machinable.collection.ComponentCollection.first",signature:"(self, callback=None, default=None)",doc:`Returns the first element in the collection that passes a given truth test

# Arguments
callback: Optional callable truth condition to find first element
default: A default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.first(lambda item: item > 2)

# 3
\`\`\`

You can also call the \`first\` method with no arguments to get the first
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.first()

# 1
\`\`\``},"machinable.collection.ComponentCollection.flatten":{kind:"routine",realname:"flatten",name:"machinable.collection",path:"machinable.collection.ComponentCollection.flatten",signature:"(self)",doc:`Flattens a multi-dimensional collection into a single dimension

\`\`\` python
collection = Collection([1, 2, [3, 4, 5, {'foo': 'bar'}]])

flattened = collection.flatten()

flattened.all()

# [1, 2, 3, 4, 5, 'bar']
\`\`\``},"machinable.collection.ComponentCollection.forget":{kind:"routine",realname:"forget",name:"machinable.collection",path:"machinable.collection.ComponentCollection.forget",signature:"(self, *keys)",doc:`Remove an item from the collection by key.

# Arguments
keys: The keys to remove

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.forget(1)
collection.all()
# [1, 3, 4, 5]
\`\`\`

::: warning
Unlike most other collection methods, \`forget\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.ComponentCollection.get":{kind:"routine",realname:"get",name:"machinable.collection",path:"machinable.collection.ComponentCollection.get",signature:"(self, key, default=None)",doc:`Returns the item at a given key. If the key does not exist, \`None\` is returned

# Arguments
key: The index of the element
default: The default value to return

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3)
# None
\`\`\`

You can optionally pass a default value as the second argument:

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3, 'default-value')
# default-value
\`\`\``},"machinable.collection.ComponentCollection.implode":{kind:"routine",realname:"implode",name:"machinable.collection",path:"machinable.collection.ComponentCollection.implode",signature:"(self, value, glue='')",doc:`Joins the items in a collection. Its arguments depend on the type of items in the collection.

# Arguments
value: The value
glue: The glue

If the collection contains dictionaries or objects, you must pass the
key of the attributes you wish to join, and the "glue" string you wish
to place between the values:

\`\`\` python
collection = Collection([
    {'account_id': 1, 'product': 'Desk'},
    {'account_id': 2, 'product': 'Chair'}
])

collection.implode('product', ', ')

# Desk, Chair
\`\`\`

If the collection contains simple strings, simply pass the "glue" as the
only argument to the method:

\`\`\` python
collection = Collection(['foo', 'bar', 'baz'])

collection.implode('-')

# foo-bar-baz
\`\`\``},"machinable.collection.ComponentCollection.last":{kind:"routine",realname:"last",name:"machinable.collection",path:"machinable.collection.ComponentCollection.last",signature:"(self, callback=None, default=None)",doc:`Returns the last element in the collection that passes a given truth test

# Arguments
callback: Optional \`\`callable\`\` truth condition
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

last = collection.last(lambda item: item < 3)

# 2
\`\`\`

You can also call the \`last\` method with no arguments to get the last
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.last()

# 4
\`\`\``},"machinable.collection.ComponentCollection.launch":{kind:"routine",realname:"launch",name:"machinable.collection",path:"machinable.collection.ComponentCollection.launch",signature:"(self) -> 'ComponentCollection'",doc:"Executes all components in the collection"},"machinable.collection.ComponentCollection.make":{kind:"routine",realname:"make",name:"machinable.collection",path:"machinable.collection.ComponentCollection.make",signature:null,doc:"Create a new Collection instance if the value isn't one already\n\n# Arguments\nitems: ``list``|``Collection``|``map`` of items to collect"},"machinable.collection.ComponentCollection.map":{kind:"routine",realname:"map",name:"machinable.collection",path:"machinable.collection.ComponentCollection.map",signature:"(self, callback)",doc:`Iterates through the collection and passes each value to the given callback.
The callback is free to modify the item and return it, thus forming a new collection of modified items

# Arguments
callback: The map function

\`\`\` python
collection = Collection([1, 2, 3, 4])

multiplied = collection.map(lambda item: item * 2)

multiplied.all()

# [2, 4, 6, 8]
\`\`\`

::: warning
Like most other collection methods, \`map\` returns a new \`Collection\`
instance; it does not modify the collection it is called on. If you want
to transform the original collection, use the [transform](#transform)
method.
:::`},"machinable.collection.ComponentCollection.max":{kind:"routine",realname:"max",name:"machinable.collection",path:"machinable.collection.ComponentCollection.max",signature:"(self, key=None)",doc:`Get the max value of a given key.

# Arguments
key: The key`},"machinable.collection.ComponentCollection.merge":{kind:"routine",realname:"merge",name:"machinable.collection",path:"machinable.collection.ComponentCollection.merge",signature:"(self, items)",doc:`Merges the given list into the collection

# Arguments
items: The items to merge

\`\`\` python
collection = Collection(['Desk', 'Chair'])
collection.merge(['Bookcase', 'Door'])
collection.all()
# ['Desk', 'Chair', 'Bookcase', 'Door']
\`\`\`

::: warning
Unlike most other collection methods, \`merge\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.ComponentCollection.min":{kind:"routine",realname:"min",name:"machinable.collection",path:"machinable.collection.ComponentCollection.min",signature:"(self, key=None)",doc:`Get the min value of a given key.

key: The key`},"machinable.collection.ComponentCollection.only":{kind:"routine",realname:"only",name:"machinable.collection",path:"machinable.collection.ComponentCollection.only",signature:"(self, *keys)",doc:"Get the items with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to keep"},"machinable.collection.ComponentCollection.pluck":{kind:"routine",realname:"pluck",name:"machinable.collection",path:"machinable.collection.ComponentCollection.pluck",signature:"(self, value, key=None)",doc:`Retrieves all of the collection values for a given key

# Arguments
value: Value
key: Optional key

\`\`\` python
collection = Collection([
    {'product_id': 1, 'product': 'Desk'},
    {'product_id': 2, 'product': 'Chair'}
])

plucked = collection.pluck('product')

plucked.all()

# ['Desk', 'Chair']
\`\`\`

You can also specify how you wish the resulting collection to be keyed:

\`\`\` python
plucked = collection.pluck('name', 'product_id')

plucked

# {1: 'Desk', 2: 'Chair'}
\`\`\``},"machinable.collection.ComponentCollection.pluck_or_nan":{kind:"routine",realname:"pluck_or_nan",name:"machinable.collection",path:"machinable.collection.ComponentCollection.pluck_or_nan",signature:"(self, value, key=None)",doc:`Pluck method that returns NaNs if key is not present

# Arguments
value: Value
key: Key`},"machinable.collection.ComponentCollection.pluck_or_none":{kind:"routine",realname:"pluck_or_none",name:"machinable.collection",path:"machinable.collection.ComponentCollection.pluck_or_none",signature:"(self, value, key=None, none=None)",doc:`Pluck method that returns None if key is not present

# Arguments
value: Value
key: Key
none: Return value if key is not present`},"machinable.collection.ComponentCollection.pop":{kind:"routine",realname:"pop",name:"machinable.collection",path:"machinable.collection.ComponentCollection.pop",signature:"(self, key=None)",doc:`Removes and returns the last item from the collection.
If no index is specified, returns the last item.

# Arguments
key: The index of the item to return


\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.pop()
# 5

collection.all()
# [1, 2, 3, 4]
\`\`\``},"machinable.collection.ComponentCollection.pprint":{kind:"routine",realname:"pprint",name:"machinable.collection",path:"machinable.collection.ComponentCollection.pprint",signature:"(self, pformat='json')",doc:null},"machinable.collection.ComponentCollection.prepend":{kind:"routine",realname:"prepend",name:"machinable.collection",path:"machinable.collection.ComponentCollection.prepend",signature:"(self, value)",doc:`Adds an item to the beginning of the collection

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.prepend(0)

collection.all()

# [0, 1, 2, 3, 4]
\`\`\``},"machinable.collection.ComponentCollection.pull":{kind:"routine",realname:"pull",name:"machinable.collection",path:"machinable.collection.ComponentCollection.pull",signature:"(self, key, default=None)",doc:`Removes and returns an item from the collection by its key

# Arugments
key: The key
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.pull(1)

collection.all()

# [1, 3, 4]
\`\`\``},"machinable.collection.ComponentCollection.put":{kind:"routine",realname:"put",name:"machinable.collection",path:"machinable.collection.ComponentCollection.put",signature:"(self, key, value)",doc:`Sets the given key and value in the collection

# Arguments
key: The key
value: The value

\`\`\` python
collection = Collection([1, 2, 3, 4])
collection.put(1, 5)
collection.all()

# [1, 5, 3, 4]
\`\`\`

::: tip
It is equivalent to \`\`collection[1] = 5\`\`
:::`},"machinable.collection.ComponentCollection.reduce":{kind:"routine",realname:"reduce",name:"machinable.collection",path:"machinable.collection.ComponentCollection.reduce",signature:"(self, callback, initial=None)",doc:`Reduces the collection to a single value, passing the result of each iteration into the subsequent iteration

# Arguments
callback: The callback
initial: The initial value

\`\`\` python
collection = Collection([1, 2, 3])

collection.reduce(lambda result, item: (result or 0) + item)

# 6
\`\`\`

The value for \`result\` on the first iteration is \`None\`; however, you
can specify its initial value by passing a second argument to reduce:

\`\`\` python
collection.reduce(lambda result, item: result + item, 4)

# 10
\`\`\``},"machinable.collection.ComponentCollection.reject":{kind:"routine",realname:"reject",name:"machinable.collection",path:"machinable.collection.ComponentCollection.reject",signature:"(self, callback)",doc:`Filters the collection using the given callback. The callback should return \`True\` for any items it wishes
to remove from the resulting collection

# Arguments
callback: The truth test

\`\`\` python
collection = Collection([1, 2, 3, 4])

filtered = collection.reject(lambda item: item > 2)

filtered.all()

# [1, 2]
\`\`\`

For the inverse of \`reject\`, see the [filter](#filter) method.`},"machinable.collection.ComponentCollection.reverse":{kind:"routine",realname:"reverse",name:"machinable.collection",path:"machinable.collection.ComponentCollection.reverse",signature:"(self)",doc:`Reverses the order of the collection's items

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
reverse = collection.reverse()
reverse.all()
# [5, 4, 3, 2, 1]
\`\`\``},"machinable.collection.ComponentCollection.section":{kind:"routine",realname:"section",name:"machinable.collection",path:"machinable.collection.ComponentCollection.section",signature:"(self, of, reduce=None)",doc:"Performs horizontal reduce through the collection\n\n# Arguments\nof: ``Callable`` Selector of reduce values\nreduce: Optional ``callable`` reduce method"},"machinable.collection.ComponentCollection.serialize":{kind:"routine",realname:"serialize",name:"machinable.collection",path:"machinable.collection.ComponentCollection.serialize",signature:"(self)",doc:`Converts the collection into a \`list\`

\`\`\` python
collection = Collection([User.find(1)])
collection.serialize()
# [{'id': 1, 'name': 'John'}]
\`\`\`

::: warning
\`serialize\` also converts all of its nested objects. If you want to get
the underlying items as is, use the [all](#all) method instead.
:::`},"machinable.collection.ComponentCollection.singleton":{kind:"routine",realname:"singleton",name:"machinable.collection",path:"machinable.collection.ComponentCollection.singleton",signature:"(self, module: str, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Union[Any, ForwardRef('Component')]",doc:null},"machinable.collection.ComponentCollection.sort":{kind:"routine",realname:"sort",name:"machinable.collection",path:"machinable.collection.ComponentCollection.sort",signature:"(self, callback=None, reverse=False)",doc:`Sorts the collection

# Arguments
callback: Sort callable
reverse: True for reversed sort order

\`\`\` python
collection = Collection([5, 3, 1, 2, 4])

sorted = collection.sort()

sorted.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.ComponentCollection.sum":{kind:"routine",realname:"sum",name:"machinable.collection",path:"machinable.collection.ComponentCollection.sum",signature:"(self, callback=None)",doc:`Returns the sum of all items in the collection

callback: The callback

\`\`\` python
Collection([1, 2, 3, 4, 5]).sum()

# 15
\`\`\`

If the collection contains dictionaries or objects, you must pass a key
to use for determining which values to sum:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])

collection.sum('pages')

# 1272
\`\`\`

In addition, you can pass your own callback to determine which values of
the collection to sum:

\`\`\` python
collection = Collection([
    {'name': 'Chair', 'colors': ['Black']},
    {'name': 'Desk', 'colors': ['Black', 'Mahogany']},
    {'name': 'Bookcase', 'colors': ['Red', 'Beige', 'Brown']}
])

collection.sum(lambda product: len(product['colors']))

# 6
\`\`\``},"machinable.collection.ComponentCollection.take":{kind:"routine",realname:"take",name:"machinable.collection",path:"machinable.collection.ComponentCollection.take",signature:"(self, limit)",doc:`Take the first or last n items.

# Arguments
limit: The number of items to take

\`\`\` python
collection = Collection([0, 1, 2, 3, 4, 5])
chunk = collection.take(3)
chunk.all()
# [0, 1, 2]
\`\`\`

You can also pass a negative integer to take the specified amount of
items from the end of the collection:

\`\`\` python
chunk = collection.chunk(-2)
chunk.all()
# [4, 5]
\`\`\``},"machinable.collection.ComponentCollection.transform":{kind:"routine",realname:"transform",name:"machinable.collection",path:"machinable.collection.ComponentCollection.transform",signature:"(self, callback)",doc:`Transform each item in the collection using a callback.

Iterates over the collection and calls the given callback with each item in the collection.
The items in the collection will be replaced by the values returned by the callback.

# Arguments
callback: The callback

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.transform(lambda item: item * 2)
collection.all()

# [2, 4, 6, 8, 10]
\`\`\`

::: warning
Unlike most other collection methods, \`transform\` modifies the
collection itself. If you wish to create a new collection instead, use
the [map](#map) method.
:::`},"machinable.collection.ComponentCollection.unique":{kind:"routine",realname:"unique",name:"machinable.collection",path:"machinable.collection.ComponentCollection.unique",signature:"(self, key=None)",doc:`Returns all of the unique items in the collection

# Arguments
key: The key to check uniqueness on

\`\`\` python
collection = Collection([1, 1, 2, 2, 3, 4, 2])

unique = collection.unique()

unique.all()

# [1, 2, 3, 4]
\`\`\`

When dealing with dictionaries or objects, you can specify the key used
to determine uniqueness:

\`\`\` python
collection = Collection([
    {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'iPhone 5', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
    {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
    {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
])

unique = collection.unique('brand')

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'}
# ]
\`\`\`

You can also pass your own callback to determine item uniqueness:

\`\`\` python
unique = collection.unique(lambda item: item['brand'] + item['type'])

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
#     {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
# ]
\`\`\``},"machinable.collection.ComponentCollection.where":{kind:"routine",realname:"where",name:"machinable.collection",path:"machinable.collection.ComponentCollection.where",signature:"(self, key, value)",doc:`Filter items by the given key value pair.

# Arguments
key: The key to filter by
value: The value to filter by

\`\`\` python
collection = Collection([
    {'name': 'Desk', 'price': 200},
    {'name': 'Chair', 'price': 100},
    {'name': 'Bookcase', 'price': 150},
    {'name': 'Door', 'price': 100},
])

filtered = collection.where('price', 100)

filtered.all()

# [
#     {'name': 'Chair', 'price': 100},
#     {'name': 'Door', 'price': 100}
# ]
\`\`\``},"machinable.collection.ComponentCollection.without":{kind:"routine",realname:"without",name:"machinable.collection",path:"machinable.collection.ComponentCollection.without",signature:"(self, *keys)",doc:"Get all items except for those with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to remove"},"machinable.collection.ComponentCollection.zip":{kind:"routine",realname:"zip",name:"machinable.collection",path:"machinable.collection.ComponentCollection.zip",signature:"(self, *items)",doc:`Merges together the values of the given list with the values of the collection at the corresponding index

# Argument
*items: Zip items

\`\`\` python
collection = Collection(['Chair', 'Desk'])
zipped = collection.zip([100, 200])
zipped.all()
# [('Chair', 100), ('Desk', 200)]
\`\`\``},"machinable.collection.ComponentCollection":{kind:"class",realname:"ComponentCollection",name:"machinable.collection",path:"machinable.collection.ComponentCollection",parents:["InterfaceCollection"],doc:null,file:"src/machinable/collection.py"},"machinable.collection.ElementCollection.all":{kind:"routine",realname:"all",name:"machinable.collection",path:"machinable.collection.ElementCollection.all",signature:"(self)",doc:`Get all of the items in the collection.

Returns the underlying list represented by the
collection

\`\`\` python
Collection([1, 2, 3]).all()

# [1, 2, 3]
\`\`\``},"machinable.collection.ElementCollection.append":{kind:"routine",realname:"append",name:"machinable.collection",path:"machinable.collection.ElementCollection.append",signature:"(self, value)",doc:`Add an item onto the end of the collection.

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.push(5)

collection.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.ElementCollection.as_dataframe":{kind:"routine",realname:"as_dataframe",name:"machinable.collection",path:"machinable.collection.ElementCollection.as_dataframe",signature:"(self)",doc:"Returns collection as Pandas dataframe"},"machinable.collection.ElementCollection.as_json":{kind:"routine",realname:"as_json",name:"machinable.collection",path:"machinable.collection.ElementCollection.as_json",signature:"(self, **options)",doc:`Converts the collection into JSON

# Arguments
options: JSON encoding options

\`\`\` python
collection = Collection([{'name': 'Desk', 'price': 200}])

collection.as_json()

# '[{"name": "Desk", "price": 200}]'
\`\`\``},"machinable.collection.ElementCollection.as_numpy":{kind:"routine",realname:"as_numpy",name:"machinable.collection",path:"machinable.collection.ElementCollection.as_numpy",signature:"(self)",doc:"Converts the collection into a numpy array"},"machinable.collection.ElementCollection.as_table":{kind:"routine",realname:"as_table",name:"machinable.collection",path:"machinable.collection.ElementCollection.as_table",signature:"(self, mode='html', headers=(), **kwargs)",doc:`Converts the collection into a table

# Arguments
mode: String 'html' or any other mode of the tabulate package
headers: Optional header row
**kwargs: Options to pass to tabulate`},"machinable.collection.ElementCollection.avg":{kind:"routine",realname:"avg",name:"machinable.collection",path:"machinable.collection.ElementCollection.avg",signature:"(self, key=None)",doc:`Get the average value of a given key.

# Arguments
key: The key to get the average for

\`\`\` python
Collection([1, 2, 3, 4, 5]).avg()
# 3
\`\`\`

If the collection contains nested objects or dictionaries, you must pass
a key to use for determining which values to calculate the average:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])
# 636
collection.avg('pages')
\`\`\``},"machinable.collection.ElementCollection.chunk":{kind:"routine",realname:"chunk",name:"machinable.collection",path:"machinable.collection.ElementCollection.chunk",signature:"(self, size)",doc:`Chunk the underlying collection.

The \`chunk\` method breaks the collection into multiple, smaller
collections of a given size:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5, 6, 7])

chunks = collection.chunk(4)

chunks.serialize()

# [[1, 2, 3, 4], [5, 6, 7]]
\`\`\`

# Arguments
size: The chunk size`},"machinable.collection.ElementCollection.collapse":{kind:"routine",realname:"collapse",name:"machinable.collection",path:"machinable.collection.ElementCollection.collapse",signature:"(self)",doc:`Collapses a collection of lists into a flat collection

\`\`\` python
collection = Collection([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
collapsed = collection.collapse()
collapsed.all()
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\``},"machinable.collection.ElementCollection.contains":{kind:"routine",realname:"contains",name:"machinable.collection",path:"machinable.collection.ElementCollection.contains",signature:"(self, key, value=None)",doc:`Determines if an element is in the collection

# Arguments
key: \`\`Integer\`\`|\`\`String\`\`|\`\`callable\`\` The element
value: The value of the element

\`\`\` python
collection = Collection(['foo', 'bar'])

collection.contains('foo')

# True
\`\`\`

You can also use the \`in\` keyword:

\`\`\` python
'foo' in collection

# True
\`\`\`

You can also pass a key / value pair to the \`contains\` method, which
will determine if the given pair exists in the collection:

\`\`\` python
collection = Collection([
    {'name': 'John', 'id': 1},
    {'name': 'Jane', 'id': 2}
])

collection.contains('name', 'Simon')

# False
\`\`\`

Finally, you may also pass a callback to the \`contains\` method to
perform your own truth test:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])

collection.contains(lambda item: item > 5)

# False
\`\`\``},"machinable.collection.ElementCollection.count":{kind:"routine",realname:"count",name:"machinable.collection",path:"machinable.collection.ElementCollection.count",signature:"(self)",doc:`Returns the total number of items in the collection:

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.count()

# 4
\`\`\`

The \`len\` function can also be used:

\`\`\` python
len(collection)

# 4
\`\`\``},"machinable.collection.ElementCollection.diff":{kind:"routine",realname:"diff",name:"machinable.collection",path:"machinable.collection.ElementCollection.diff",signature:"(self, items)",doc:"Compares the collection against another collection, a `list` or a `dict`\n\n# Arguments\nitems: The items to diff with\n\n``` python\ncollection = Collection([1, 2, 3, 4, 5])\ndiff = collection.diff([2, 4, 6, 8])\ndiff.all()\n# [1, 3, 5]\n```"},"machinable.collection.ElementCollection.each":{kind:"routine",realname:"each",name:"machinable.collection",path:"machinable.collection.ElementCollection.each",signature:"(self, callback)",doc:`Iterates over the items in the collection and passes each item to a given callback

# Arguments
callback: \`\`callable\`\` The callback to execute

\`\`\` python
collection = Collection([1, 2, 3])
collection.each(lambda x: x + 3)
\`\`\`

Return \`False\` from your callback to break out of the loop:

\`\`\` python
observations.each(lambda data: data.save() if data.name == 'mnist' else False)
\`\`\`

::: tip
It only applies the callback but does not modify the collection's items.
Use the [transform()](#transform) method to
modify the collection.
:::`},"machinable.collection.ElementCollection.empty":{kind:"routine",realname:"empty",name:"machinable.collection",path:"machinable.collection.ElementCollection.empty",signature:"(self)",doc:"Returns `True` if the collection is empty; otherwise, `False` is returned"},"machinable.collection.ElementCollection.every":{kind:"routine",realname:"every",name:"machinable.collection",path:"machinable.collection.ElementCollection.every",signature:"(self, step, offset=0)",doc:"Create a new collection consisting of every n-th element.\n\n# Arguments\nstep: ``int`` The step size\noffset: ``int`` The start offset\n\n``` python\ncollection = Collection(['a', 'b', 'c', 'd', 'e', 'f'])\n\ncollection.every(4).all()\n\n# ['a', 'e']\n```\n\nYou can optionally pass the offset as the second argument:\n\n``` python\ncollection.every(4, 1).all()\n\n# ['b', 'f']\n```"},"machinable.collection.ElementCollection.filter":{kind:"routine",realname:"filter",name:"machinable.collection",path:"machinable.collection.ElementCollection.filter",signature:"(self, callback=None)",doc:"Filters the collection by a given callback, keeping only those items that pass a given truth test\n\n# Arguments\ncallback: ``callable``|``None`` The filter callback\n\n``` python\ncollection = Collection([1, 2, 3, 4])\n\nfiltered = collection.filter(lambda item: item > 2)\n\nfiltered.all()\n\n# [3, 4]\n```"},"machinable.collection.ElementCollection.filter_by_context":{kind:"routine",realname:"filter_by_context",name:"machinable.collection",path:"machinable.collection.ElementCollection.filter_by_context",signature:"(self, module: str, version: str | dict | None | list[str | dict | None] = None, **kwargs)",doc:null},"machinable.collection.ElementCollection.filter_by_module":{kind:"routine",realname:"filter_by_module",name:"machinable.collection",path:"machinable.collection.ElementCollection.filter_by_module",signature:"(self, module)",doc:null},"machinable.collection.ElementCollection.first":{kind:"routine",realname:"first",name:"machinable.collection",path:"machinable.collection.ElementCollection.first",signature:"(self, callback=None, default=None)",doc:`Returns the first element in the collection that passes a given truth test

# Arguments
callback: Optional callable truth condition to find first element
default: A default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.first(lambda item: item > 2)

# 3
\`\`\`

You can also call the \`first\` method with no arguments to get the first
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.first()

# 1
\`\`\``},"machinable.collection.ElementCollection.flatten":{kind:"routine",realname:"flatten",name:"machinable.collection",path:"machinable.collection.ElementCollection.flatten",signature:"(self)",doc:`Flattens a multi-dimensional collection into a single dimension

\`\`\` python
collection = Collection([1, 2, [3, 4, 5, {'foo': 'bar'}]])

flattened = collection.flatten()

flattened.all()

# [1, 2, 3, 4, 5, 'bar']
\`\`\``},"machinable.collection.ElementCollection.forget":{kind:"routine",realname:"forget",name:"machinable.collection",path:"machinable.collection.ElementCollection.forget",signature:"(self, *keys)",doc:`Remove an item from the collection by key.

# Arguments
keys: The keys to remove

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.forget(1)
collection.all()
# [1, 3, 4, 5]
\`\`\`

::: warning
Unlike most other collection methods, \`forget\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.ElementCollection.get":{kind:"routine",realname:"get",name:"machinable.collection",path:"machinable.collection.ElementCollection.get",signature:"(self, key, default=None)",doc:`Returns the item at a given key. If the key does not exist, \`None\` is returned

# Arguments
key: The index of the element
default: The default value to return

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3)
# None
\`\`\`

You can optionally pass a default value as the second argument:

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3, 'default-value')
# default-value
\`\`\``},"machinable.collection.ElementCollection.implode":{kind:"routine",realname:"implode",name:"machinable.collection",path:"machinable.collection.ElementCollection.implode",signature:"(self, value, glue='')",doc:`Joins the items in a collection. Its arguments depend on the type of items in the collection.

# Arguments
value: The value
glue: The glue

If the collection contains dictionaries or objects, you must pass the
key of the attributes you wish to join, and the "glue" string you wish
to place between the values:

\`\`\` python
collection = Collection([
    {'account_id': 1, 'product': 'Desk'},
    {'account_id': 2, 'product': 'Chair'}
])

collection.implode('product', ', ')

# Desk, Chair
\`\`\`

If the collection contains simple strings, simply pass the "glue" as the
only argument to the method:

\`\`\` python
collection = Collection(['foo', 'bar', 'baz'])

collection.implode('-')

# foo-bar-baz
\`\`\``},"machinable.collection.ElementCollection.last":{kind:"routine",realname:"last",name:"machinable.collection",path:"machinable.collection.ElementCollection.last",signature:"(self, callback=None, default=None)",doc:`Returns the last element in the collection that passes a given truth test

# Arguments
callback: Optional \`\`callable\`\` truth condition
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

last = collection.last(lambda item: item < 3)

# 2
\`\`\`

You can also call the \`last\` method with no arguments to get the last
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.last()

# 4
\`\`\``},"machinable.collection.ElementCollection.make":{kind:"routine",realname:"make",name:"machinable.collection",path:"machinable.collection.ElementCollection.make",signature:null,doc:"Create a new Collection instance if the value isn't one already\n\n# Arguments\nitems: ``list``|``Collection``|``map`` of items to collect"},"machinable.collection.ElementCollection.map":{kind:"routine",realname:"map",name:"machinable.collection",path:"machinable.collection.ElementCollection.map",signature:"(self, callback)",doc:`Iterates through the collection and passes each value to the given callback.
The callback is free to modify the item and return it, thus forming a new collection of modified items

# Arguments
callback: The map function

\`\`\` python
collection = Collection([1, 2, 3, 4])

multiplied = collection.map(lambda item: item * 2)

multiplied.all()

# [2, 4, 6, 8]
\`\`\`

::: warning
Like most other collection methods, \`map\` returns a new \`Collection\`
instance; it does not modify the collection it is called on. If you want
to transform the original collection, use the [transform](#transform)
method.
:::`},"machinable.collection.ElementCollection.max":{kind:"routine",realname:"max",name:"machinable.collection",path:"machinable.collection.ElementCollection.max",signature:"(self, key=None)",doc:`Get the max value of a given key.

# Arguments
key: The key`},"machinable.collection.ElementCollection.merge":{kind:"routine",realname:"merge",name:"machinable.collection",path:"machinable.collection.ElementCollection.merge",signature:"(self, items)",doc:`Merges the given list into the collection

# Arguments
items: The items to merge

\`\`\` python
collection = Collection(['Desk', 'Chair'])
collection.merge(['Bookcase', 'Door'])
collection.all()
# ['Desk', 'Chair', 'Bookcase', 'Door']
\`\`\`

::: warning
Unlike most other collection methods, \`merge\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.ElementCollection.min":{kind:"routine",realname:"min",name:"machinable.collection",path:"machinable.collection.ElementCollection.min",signature:"(self, key=None)",doc:`Get the min value of a given key.

key: The key`},"machinable.collection.ElementCollection.only":{kind:"routine",realname:"only",name:"machinable.collection",path:"machinable.collection.ElementCollection.only",signature:"(self, *keys)",doc:"Get the items with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to keep"},"machinable.collection.ElementCollection.pluck":{kind:"routine",realname:"pluck",name:"machinable.collection",path:"machinable.collection.ElementCollection.pluck",signature:"(self, value, key=None)",doc:`Retrieves all of the collection values for a given key

# Arguments
value: Value
key: Optional key

\`\`\` python
collection = Collection([
    {'product_id': 1, 'product': 'Desk'},
    {'product_id': 2, 'product': 'Chair'}
])

plucked = collection.pluck('product')

plucked.all()

# ['Desk', 'Chair']
\`\`\`

You can also specify how you wish the resulting collection to be keyed:

\`\`\` python
plucked = collection.pluck('name', 'product_id')

plucked

# {1: 'Desk', 2: 'Chair'}
\`\`\``},"machinable.collection.ElementCollection.pluck_or_nan":{kind:"routine",realname:"pluck_or_nan",name:"machinable.collection",path:"machinable.collection.ElementCollection.pluck_or_nan",signature:"(self, value, key=None)",doc:`Pluck method that returns NaNs if key is not present

# Arguments
value: Value
key: Key`},"machinable.collection.ElementCollection.pluck_or_none":{kind:"routine",realname:"pluck_or_none",name:"machinable.collection",path:"machinable.collection.ElementCollection.pluck_or_none",signature:"(self, value, key=None, none=None)",doc:`Pluck method that returns None if key is not present

# Arguments
value: Value
key: Key
none: Return value if key is not present`},"machinable.collection.ElementCollection.pop":{kind:"routine",realname:"pop",name:"machinable.collection",path:"machinable.collection.ElementCollection.pop",signature:"(self, key=None)",doc:`Removes and returns the last item from the collection.
If no index is specified, returns the last item.

# Arguments
key: The index of the item to return


\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.pop()
# 5

collection.all()
# [1, 2, 3, 4]
\`\`\``},"machinable.collection.ElementCollection.pprint":{kind:"routine",realname:"pprint",name:"machinable.collection",path:"machinable.collection.ElementCollection.pprint",signature:"(self, pformat='json')",doc:null},"machinable.collection.ElementCollection.prepend":{kind:"routine",realname:"prepend",name:"machinable.collection",path:"machinable.collection.ElementCollection.prepend",signature:"(self, value)",doc:`Adds an item to the beginning of the collection

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.prepend(0)

collection.all()

# [0, 1, 2, 3, 4]
\`\`\``},"machinable.collection.ElementCollection.pull":{kind:"routine",realname:"pull",name:"machinable.collection",path:"machinable.collection.ElementCollection.pull",signature:"(self, key, default=None)",doc:`Removes and returns an item from the collection by its key

# Arugments
key: The key
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.pull(1)

collection.all()

# [1, 3, 4]
\`\`\``},"machinable.collection.ElementCollection.put":{kind:"routine",realname:"put",name:"machinable.collection",path:"machinable.collection.ElementCollection.put",signature:"(self, key, value)",doc:`Sets the given key and value in the collection

# Arguments
key: The key
value: The value

\`\`\` python
collection = Collection([1, 2, 3, 4])
collection.put(1, 5)
collection.all()

# [1, 5, 3, 4]
\`\`\`

::: tip
It is equivalent to \`\`collection[1] = 5\`\`
:::`},"machinable.collection.ElementCollection.reduce":{kind:"routine",realname:"reduce",name:"machinable.collection",path:"machinable.collection.ElementCollection.reduce",signature:"(self, callback, initial=None)",doc:`Reduces the collection to a single value, passing the result of each iteration into the subsequent iteration

# Arguments
callback: The callback
initial: The initial value

\`\`\` python
collection = Collection([1, 2, 3])

collection.reduce(lambda result, item: (result or 0) + item)

# 6
\`\`\`

The value for \`result\` on the first iteration is \`None\`; however, you
can specify its initial value by passing a second argument to reduce:

\`\`\` python
collection.reduce(lambda result, item: result + item, 4)

# 10
\`\`\``},"machinable.collection.ElementCollection.reject":{kind:"routine",realname:"reject",name:"machinable.collection",path:"machinable.collection.ElementCollection.reject",signature:"(self, callback)",doc:`Filters the collection using the given callback. The callback should return \`True\` for any items it wishes
to remove from the resulting collection

# Arguments
callback: The truth test

\`\`\` python
collection = Collection([1, 2, 3, 4])

filtered = collection.reject(lambda item: item > 2)

filtered.all()

# [1, 2]
\`\`\`

For the inverse of \`reject\`, see the [filter](#filter) method.`},"machinable.collection.ElementCollection.reverse":{kind:"routine",realname:"reverse",name:"machinable.collection",path:"machinable.collection.ElementCollection.reverse",signature:"(self)",doc:`Reverses the order of the collection's items

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
reverse = collection.reverse()
reverse.all()
# [5, 4, 3, 2, 1]
\`\`\``},"machinable.collection.ElementCollection.section":{kind:"routine",realname:"section",name:"machinable.collection",path:"machinable.collection.ElementCollection.section",signature:"(self, of, reduce=None)",doc:"Performs horizontal reduce through the collection\n\n# Arguments\nof: ``Callable`` Selector of reduce values\nreduce: Optional ``callable`` reduce method"},"machinable.collection.ElementCollection.serialize":{kind:"routine",realname:"serialize",name:"machinable.collection",path:"machinable.collection.ElementCollection.serialize",signature:"(self)",doc:`Converts the collection into a \`list\`

\`\`\` python
collection = Collection([User.find(1)])
collection.serialize()
# [{'id': 1, 'name': 'John'}]
\`\`\`

::: warning
\`serialize\` also converts all of its nested objects. If you want to get
the underlying items as is, use the [all](#all) method instead.
:::`},"machinable.collection.ElementCollection.singleton":{kind:"routine",realname:"singleton",name:"machinable.collection",path:"machinable.collection.ElementCollection.singleton",signature:"(self, module: str, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Union[Any, ForwardRef('Component')]",doc:null},"machinable.collection.ElementCollection.sort":{kind:"routine",realname:"sort",name:"machinable.collection",path:"machinable.collection.ElementCollection.sort",signature:"(self, callback=None, reverse=False)",doc:`Sorts the collection

# Arguments
callback: Sort callable
reverse: True for reversed sort order

\`\`\` python
collection = Collection([5, 3, 1, 2, 4])

sorted = collection.sort()

sorted.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.ElementCollection.sum":{kind:"routine",realname:"sum",name:"machinable.collection",path:"machinable.collection.ElementCollection.sum",signature:"(self, callback=None)",doc:`Returns the sum of all items in the collection

callback: The callback

\`\`\` python
Collection([1, 2, 3, 4, 5]).sum()

# 15
\`\`\`

If the collection contains dictionaries or objects, you must pass a key
to use for determining which values to sum:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])

collection.sum('pages')

# 1272
\`\`\`

In addition, you can pass your own callback to determine which values of
the collection to sum:

\`\`\` python
collection = Collection([
    {'name': 'Chair', 'colors': ['Black']},
    {'name': 'Desk', 'colors': ['Black', 'Mahogany']},
    {'name': 'Bookcase', 'colors': ['Red', 'Beige', 'Brown']}
])

collection.sum(lambda product: len(product['colors']))

# 6
\`\`\``},"machinable.collection.ElementCollection.take":{kind:"routine",realname:"take",name:"machinable.collection",path:"machinable.collection.ElementCollection.take",signature:"(self, limit)",doc:`Take the first or last n items.

# Arguments
limit: The number of items to take

\`\`\` python
collection = Collection([0, 1, 2, 3, 4, 5])
chunk = collection.take(3)
chunk.all()
# [0, 1, 2]
\`\`\`

You can also pass a negative integer to take the specified amount of
items from the end of the collection:

\`\`\` python
chunk = collection.chunk(-2)
chunk.all()
# [4, 5]
\`\`\``},"machinable.collection.ElementCollection.transform":{kind:"routine",realname:"transform",name:"machinable.collection",path:"machinable.collection.ElementCollection.transform",signature:"(self, callback)",doc:`Transform each item in the collection using a callback.

Iterates over the collection and calls the given callback with each item in the collection.
The items in the collection will be replaced by the values returned by the callback.

# Arguments
callback: The callback

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.transform(lambda item: item * 2)
collection.all()

# [2, 4, 6, 8, 10]
\`\`\`

::: warning
Unlike most other collection methods, \`transform\` modifies the
collection itself. If you wish to create a new collection instead, use
the [map](#map) method.
:::`},"machinable.collection.ElementCollection.unique":{kind:"routine",realname:"unique",name:"machinable.collection",path:"machinable.collection.ElementCollection.unique",signature:"(self, key=None)",doc:`Returns all of the unique items in the collection

# Arguments
key: The key to check uniqueness on

\`\`\` python
collection = Collection([1, 1, 2, 2, 3, 4, 2])

unique = collection.unique()

unique.all()

# [1, 2, 3, 4]
\`\`\`

When dealing with dictionaries or objects, you can specify the key used
to determine uniqueness:

\`\`\` python
collection = Collection([
    {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'iPhone 5', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
    {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
    {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
])

unique = collection.unique('brand')

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'}
# ]
\`\`\`

You can also pass your own callback to determine item uniqueness:

\`\`\` python
unique = collection.unique(lambda item: item['brand'] + item['type'])

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
#     {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
# ]
\`\`\``},"machinable.collection.ElementCollection.where":{kind:"routine",realname:"where",name:"machinable.collection",path:"machinable.collection.ElementCollection.where",signature:"(self, key, value)",doc:`Filter items by the given key value pair.

# Arguments
key: The key to filter by
value: The value to filter by

\`\`\` python
collection = Collection([
    {'name': 'Desk', 'price': 200},
    {'name': 'Chair', 'price': 100},
    {'name': 'Bookcase', 'price': 150},
    {'name': 'Door', 'price': 100},
])

filtered = collection.where('price', 100)

filtered.all()

# [
#     {'name': 'Chair', 'price': 100},
#     {'name': 'Door', 'price': 100}
# ]
\`\`\``},"machinable.collection.ElementCollection.without":{kind:"routine",realname:"without",name:"machinable.collection",path:"machinable.collection.ElementCollection.without",signature:"(self, *keys)",doc:"Get all items except for those with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to remove"},"machinable.collection.ElementCollection.zip":{kind:"routine",realname:"zip",name:"machinable.collection",path:"machinable.collection.ElementCollection.zip",signature:"(self, *items)",doc:`Merges together the values of the given list with the values of the collection at the corresponding index

# Argument
*items: Zip items

\`\`\` python
collection = Collection(['Chair', 'Desk'])
zipped = collection.zip([100, 200])
zipped.all()
# [('Chair', 100), ('Desk', 200)]
\`\`\``},"machinable.collection.ElementCollection":{kind:"class",realname:"ElementCollection",name:"machinable.collection",path:"machinable.collection.ElementCollection",parents:["Collection"],doc:null,file:"src/machinable/collection.py"},"machinable.collection.ExecutionCollection.all":{kind:"routine",realname:"all",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.all",signature:"(self)",doc:`Get all of the items in the collection.

Returns the underlying list represented by the
collection

\`\`\` python
Collection([1, 2, 3]).all()

# [1, 2, 3]
\`\`\``},"machinable.collection.ExecutionCollection.append":{kind:"routine",realname:"append",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.append",signature:"(self, value)",doc:`Add an item onto the end of the collection.

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.push(5)

collection.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.ExecutionCollection.as_dataframe":{kind:"routine",realname:"as_dataframe",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.as_dataframe",signature:"(self)",doc:"Returns collection as Pandas dataframe"},"machinable.collection.ExecutionCollection.as_json":{kind:"routine",realname:"as_json",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.as_json",signature:"(self, **options)",doc:`Converts the collection into JSON

# Arguments
options: JSON encoding options

\`\`\` python
collection = Collection([{'name': 'Desk', 'price': 200}])

collection.as_json()

# '[{"name": "Desk", "price": 200}]'
\`\`\``},"machinable.collection.ExecutionCollection.as_numpy":{kind:"routine",realname:"as_numpy",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.as_numpy",signature:"(self)",doc:"Converts the collection into a numpy array"},"machinable.collection.ExecutionCollection.as_table":{kind:"routine",realname:"as_table",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.as_table",signature:"(self, mode='html', headers=(), **kwargs)",doc:`Converts the collection into a table

# Arguments
mode: String 'html' or any other mode of the tabulate package
headers: Optional header row
**kwargs: Options to pass to tabulate`},"machinable.collection.ExecutionCollection.avg":{kind:"routine",realname:"avg",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.avg",signature:"(self, key=None)",doc:`Get the average value of a given key.

# Arguments
key: The key to get the average for

\`\`\` python
Collection([1, 2, 3, 4, 5]).avg()
# 3
\`\`\`

If the collection contains nested objects or dictionaries, you must pass
a key to use for determining which values to calculate the average:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])
# 636
collection.avg('pages')
\`\`\``},"machinable.collection.ExecutionCollection.chunk":{kind:"routine",realname:"chunk",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.chunk",signature:"(self, size)",doc:`Chunk the underlying collection.

The \`chunk\` method breaks the collection into multiple, smaller
collections of a given size:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5, 6, 7])

chunks = collection.chunk(4)

chunks.serialize()

# [[1, 2, 3, 4], [5, 6, 7]]
\`\`\`

# Arguments
size: The chunk size`},"machinable.collection.ExecutionCollection.collapse":{kind:"routine",realname:"collapse",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.collapse",signature:"(self)",doc:`Collapses a collection of lists into a flat collection

\`\`\` python
collection = Collection([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
collapsed = collection.collapse()
collapsed.all()
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\``},"machinable.collection.ExecutionCollection.contains":{kind:"routine",realname:"contains",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.contains",signature:"(self, key, value=None)",doc:`Determines if an element is in the collection

# Arguments
key: \`\`Integer\`\`|\`\`String\`\`|\`\`callable\`\` The element
value: The value of the element

\`\`\` python
collection = Collection(['foo', 'bar'])

collection.contains('foo')

# True
\`\`\`

You can also use the \`in\` keyword:

\`\`\` python
'foo' in collection

# True
\`\`\`

You can also pass a key / value pair to the \`contains\` method, which
will determine if the given pair exists in the collection:

\`\`\` python
collection = Collection([
    {'name': 'John', 'id': 1},
    {'name': 'Jane', 'id': 2}
])

collection.contains('name', 'Simon')

# False
\`\`\`

Finally, you may also pass a callback to the \`contains\` method to
perform your own truth test:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])

collection.contains(lambda item: item > 5)

# False
\`\`\``},"machinable.collection.ExecutionCollection.count":{kind:"routine",realname:"count",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.count",signature:"(self)",doc:`Returns the total number of items in the collection:

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.count()

# 4
\`\`\`

The \`len\` function can also be used:

\`\`\` python
len(collection)

# 4
\`\`\``},"machinable.collection.ExecutionCollection.diff":{kind:"routine",realname:"diff",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.diff",signature:"(self, items)",doc:"Compares the collection against another collection, a `list` or a `dict`\n\n# Arguments\nitems: The items to diff with\n\n``` python\ncollection = Collection([1, 2, 3, 4, 5])\ndiff = collection.diff([2, 4, 6, 8])\ndiff.all()\n# [1, 3, 5]\n```"},"machinable.collection.ExecutionCollection.each":{kind:"routine",realname:"each",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.each",signature:"(self, callback)",doc:`Iterates over the items in the collection and passes each item to a given callback

# Arguments
callback: \`\`callable\`\` The callback to execute

\`\`\` python
collection = Collection([1, 2, 3])
collection.each(lambda x: x + 3)
\`\`\`

Return \`False\` from your callback to break out of the loop:

\`\`\` python
observations.each(lambda data: data.save() if data.name == 'mnist' else False)
\`\`\`

::: tip
It only applies the callback but does not modify the collection's items.
Use the [transform()](#transform) method to
modify the collection.
:::`},"machinable.collection.ExecutionCollection.empty":{kind:"routine",realname:"empty",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.empty",signature:"(self)",doc:"Returns `True` if the collection is empty; otherwise, `False` is returned"},"machinable.collection.ExecutionCollection.every":{kind:"routine",realname:"every",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.every",signature:"(self, step, offset=0)",doc:"Create a new collection consisting of every n-th element.\n\n# Arguments\nstep: ``int`` The step size\noffset: ``int`` The start offset\n\n``` python\ncollection = Collection(['a', 'b', 'c', 'd', 'e', 'f'])\n\ncollection.every(4).all()\n\n# ['a', 'e']\n```\n\nYou can optionally pass the offset as the second argument:\n\n``` python\ncollection.every(4, 1).all()\n\n# ['b', 'f']\n```"},"machinable.collection.ExecutionCollection.filter":{kind:"routine",realname:"filter",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.filter",signature:"(self, callback=None)",doc:"Filters the collection by a given callback, keeping only those items that pass a given truth test\n\n# Arguments\ncallback: ``callable``|``None`` The filter callback\n\n``` python\ncollection = Collection([1, 2, 3, 4])\n\nfiltered = collection.filter(lambda item: item > 2)\n\nfiltered.all()\n\n# [3, 4]\n```"},"machinable.collection.ExecutionCollection.filter_by_context":{kind:"routine",realname:"filter_by_context",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.filter_by_context",signature:"(self, module: str, version: str | dict | None | list[str | dict | None] = None, **kwargs)",doc:null},"machinable.collection.ExecutionCollection.filter_by_module":{kind:"routine",realname:"filter_by_module",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.filter_by_module",signature:"(self, module)",doc:null},"machinable.collection.ExecutionCollection.first":{kind:"routine",realname:"first",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.first",signature:"(self, callback=None, default=None)",doc:`Returns the first element in the collection that passes a given truth test

# Arguments
callback: Optional callable truth condition to find first element
default: A default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.first(lambda item: item > 2)

# 3
\`\`\`

You can also call the \`first\` method with no arguments to get the first
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.first()

# 1
\`\`\``},"machinable.collection.ExecutionCollection.flatten":{kind:"routine",realname:"flatten",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.flatten",signature:"(self)",doc:`Flattens a multi-dimensional collection into a single dimension

\`\`\` python
collection = Collection([1, 2, [3, 4, 5, {'foo': 'bar'}]])

flattened = collection.flatten()

flattened.all()

# [1, 2, 3, 4, 5, 'bar']
\`\`\``},"machinable.collection.ExecutionCollection.forget":{kind:"routine",realname:"forget",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.forget",signature:"(self, *keys)",doc:`Remove an item from the collection by key.

# Arguments
keys: The keys to remove

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.forget(1)
collection.all()
# [1, 3, 4, 5]
\`\`\`

::: warning
Unlike most other collection methods, \`forget\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.ExecutionCollection.get":{kind:"routine",realname:"get",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.get",signature:"(self, key, default=None)",doc:`Returns the item at a given key. If the key does not exist, \`None\` is returned

# Arguments
key: The index of the element
default: The default value to return

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3)
# None
\`\`\`

You can optionally pass a default value as the second argument:

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3, 'default-value')
# default-value
\`\`\``},"machinable.collection.ExecutionCollection.implode":{kind:"routine",realname:"implode",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.implode",signature:"(self, value, glue='')",doc:`Joins the items in a collection. Its arguments depend on the type of items in the collection.

# Arguments
value: The value
glue: The glue

If the collection contains dictionaries or objects, you must pass the
key of the attributes you wish to join, and the "glue" string you wish
to place between the values:

\`\`\` python
collection = Collection([
    {'account_id': 1, 'product': 'Desk'},
    {'account_id': 2, 'product': 'Chair'}
])

collection.implode('product', ', ')

# Desk, Chair
\`\`\`

If the collection contains simple strings, simply pass the "glue" as the
only argument to the method:

\`\`\` python
collection = Collection(['foo', 'bar', 'baz'])

collection.implode('-')

# foo-bar-baz
\`\`\``},"machinable.collection.ExecutionCollection.last":{kind:"routine",realname:"last",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.last",signature:"(self, callback=None, default=None)",doc:`Returns the last element in the collection that passes a given truth test

# Arguments
callback: Optional \`\`callable\`\` truth condition
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

last = collection.last(lambda item: item < 3)

# 2
\`\`\`

You can also call the \`last\` method with no arguments to get the last
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.last()

# 4
\`\`\``},"machinable.collection.ExecutionCollection.make":{kind:"routine",realname:"make",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.make",signature:null,doc:"Create a new Collection instance if the value isn't one already\n\n# Arguments\nitems: ``list``|``Collection``|``map`` of items to collect"},"machinable.collection.ExecutionCollection.map":{kind:"routine",realname:"map",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.map",signature:"(self, callback)",doc:`Iterates through the collection and passes each value to the given callback.
The callback is free to modify the item and return it, thus forming a new collection of modified items

# Arguments
callback: The map function

\`\`\` python
collection = Collection([1, 2, 3, 4])

multiplied = collection.map(lambda item: item * 2)

multiplied.all()

# [2, 4, 6, 8]
\`\`\`

::: warning
Like most other collection methods, \`map\` returns a new \`Collection\`
instance; it does not modify the collection it is called on. If you want
to transform the original collection, use the [transform](#transform)
method.
:::`},"machinable.collection.ExecutionCollection.max":{kind:"routine",realname:"max",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.max",signature:"(self, key=None)",doc:`Get the max value of a given key.

# Arguments
key: The key`},"machinable.collection.ExecutionCollection.merge":{kind:"routine",realname:"merge",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.merge",signature:"(self, items)",doc:`Merges the given list into the collection

# Arguments
items: The items to merge

\`\`\` python
collection = Collection(['Desk', 'Chair'])
collection.merge(['Bookcase', 'Door'])
collection.all()
# ['Desk', 'Chair', 'Bookcase', 'Door']
\`\`\`

::: warning
Unlike most other collection methods, \`merge\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.ExecutionCollection.min":{kind:"routine",realname:"min",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.min",signature:"(self, key=None)",doc:`Get the min value of a given key.

key: The key`},"machinable.collection.ExecutionCollection.only":{kind:"routine",realname:"only",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.only",signature:"(self, *keys)",doc:"Get the items with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to keep"},"machinable.collection.ExecutionCollection.pluck":{kind:"routine",realname:"pluck",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.pluck",signature:"(self, value, key=None)",doc:`Retrieves all of the collection values for a given key

# Arguments
value: Value
key: Optional key

\`\`\` python
collection = Collection([
    {'product_id': 1, 'product': 'Desk'},
    {'product_id': 2, 'product': 'Chair'}
])

plucked = collection.pluck('product')

plucked.all()

# ['Desk', 'Chair']
\`\`\`

You can also specify how you wish the resulting collection to be keyed:

\`\`\` python
plucked = collection.pluck('name', 'product_id')

plucked

# {1: 'Desk', 2: 'Chair'}
\`\`\``},"machinable.collection.ExecutionCollection.pluck_or_nan":{kind:"routine",realname:"pluck_or_nan",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.pluck_or_nan",signature:"(self, value, key=None)",doc:`Pluck method that returns NaNs if key is not present

# Arguments
value: Value
key: Key`},"machinable.collection.ExecutionCollection.pluck_or_none":{kind:"routine",realname:"pluck_or_none",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.pluck_or_none",signature:"(self, value, key=None, none=None)",doc:`Pluck method that returns None if key is not present

# Arguments
value: Value
key: Key
none: Return value if key is not present`},"machinable.collection.ExecutionCollection.pop":{kind:"routine",realname:"pop",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.pop",signature:"(self, key=None)",doc:`Removes and returns the last item from the collection.
If no index is specified, returns the last item.

# Arguments
key: The index of the item to return


\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.pop()
# 5

collection.all()
# [1, 2, 3, 4]
\`\`\``},"machinable.collection.ExecutionCollection.pprint":{kind:"routine",realname:"pprint",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.pprint",signature:"(self, pformat='json')",doc:null},"machinable.collection.ExecutionCollection.prepend":{kind:"routine",realname:"prepend",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.prepend",signature:"(self, value)",doc:`Adds an item to the beginning of the collection

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.prepend(0)

collection.all()

# [0, 1, 2, 3, 4]
\`\`\``},"machinable.collection.ExecutionCollection.pull":{kind:"routine",realname:"pull",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.pull",signature:"(self, key, default=None)",doc:`Removes and returns an item from the collection by its key

# Arugments
key: The key
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.pull(1)

collection.all()

# [1, 3, 4]
\`\`\``},"machinable.collection.ExecutionCollection.put":{kind:"routine",realname:"put",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.put",signature:"(self, key, value)",doc:`Sets the given key and value in the collection

# Arguments
key: The key
value: The value

\`\`\` python
collection = Collection([1, 2, 3, 4])
collection.put(1, 5)
collection.all()

# [1, 5, 3, 4]
\`\`\`

::: tip
It is equivalent to \`\`collection[1] = 5\`\`
:::`},"machinable.collection.ExecutionCollection.reduce":{kind:"routine",realname:"reduce",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.reduce",signature:"(self, callback, initial=None)",doc:`Reduces the collection to a single value, passing the result of each iteration into the subsequent iteration

# Arguments
callback: The callback
initial: The initial value

\`\`\` python
collection = Collection([1, 2, 3])

collection.reduce(lambda result, item: (result or 0) + item)

# 6
\`\`\`

The value for \`result\` on the first iteration is \`None\`; however, you
can specify its initial value by passing a second argument to reduce:

\`\`\` python
collection.reduce(lambda result, item: result + item, 4)

# 10
\`\`\``},"machinable.collection.ExecutionCollection.reject":{kind:"routine",realname:"reject",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.reject",signature:"(self, callback)",doc:`Filters the collection using the given callback. The callback should return \`True\` for any items it wishes
to remove from the resulting collection

# Arguments
callback: The truth test

\`\`\` python
collection = Collection([1, 2, 3, 4])

filtered = collection.reject(lambda item: item > 2)

filtered.all()

# [1, 2]
\`\`\`

For the inverse of \`reject\`, see the [filter](#filter) method.`},"machinable.collection.ExecutionCollection.reverse":{kind:"routine",realname:"reverse",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.reverse",signature:"(self)",doc:`Reverses the order of the collection's items

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
reverse = collection.reverse()
reverse.all()
# [5, 4, 3, 2, 1]
\`\`\``},"machinable.collection.ExecutionCollection.section":{kind:"routine",realname:"section",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.section",signature:"(self, of, reduce=None)",doc:"Performs horizontal reduce through the collection\n\n# Arguments\nof: ``Callable`` Selector of reduce values\nreduce: Optional ``callable`` reduce method"},"machinable.collection.ExecutionCollection.serialize":{kind:"routine",realname:"serialize",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.serialize",signature:"(self)",doc:`Converts the collection into a \`list\`

\`\`\` python
collection = Collection([User.find(1)])
collection.serialize()
# [{'id': 1, 'name': 'John'}]
\`\`\`

::: warning
\`serialize\` also converts all of its nested objects. If you want to get
the underlying items as is, use the [all](#all) method instead.
:::`},"machinable.collection.ExecutionCollection.singleton":{kind:"routine",realname:"singleton",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.singleton",signature:"(self, module: str, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Union[Any, ForwardRef('Component')]",doc:null},"machinable.collection.ExecutionCollection.sort":{kind:"routine",realname:"sort",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.sort",signature:"(self, callback=None, reverse=False)",doc:`Sorts the collection

# Arguments
callback: Sort callable
reverse: True for reversed sort order

\`\`\` python
collection = Collection([5, 3, 1, 2, 4])

sorted = collection.sort()

sorted.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.ExecutionCollection.status":{kind:"routine",realname:"status",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.status",signature:"(self, status='started')",doc:`Filters the collection by a status attribute

# Arguments
status: String, status field: 'started', 'finished', 'alive'`},"machinable.collection.ExecutionCollection.sum":{kind:"routine",realname:"sum",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.sum",signature:"(self, callback=None)",doc:`Returns the sum of all items in the collection

callback: The callback

\`\`\` python
Collection([1, 2, 3, 4, 5]).sum()

# 15
\`\`\`

If the collection contains dictionaries or objects, you must pass a key
to use for determining which values to sum:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])

collection.sum('pages')

# 1272
\`\`\`

In addition, you can pass your own callback to determine which values of
the collection to sum:

\`\`\` python
collection = Collection([
    {'name': 'Chair', 'colors': ['Black']},
    {'name': 'Desk', 'colors': ['Black', 'Mahogany']},
    {'name': 'Bookcase', 'colors': ['Red', 'Beige', 'Brown']}
])

collection.sum(lambda product: len(product['colors']))

# 6
\`\`\``},"machinable.collection.ExecutionCollection.take":{kind:"routine",realname:"take",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.take",signature:"(self, limit)",doc:`Take the first or last n items.

# Arguments
limit: The number of items to take

\`\`\` python
collection = Collection([0, 1, 2, 3, 4, 5])
chunk = collection.take(3)
chunk.all()
# [0, 1, 2]
\`\`\`

You can also pass a negative integer to take the specified amount of
items from the end of the collection:

\`\`\` python
chunk = collection.chunk(-2)
chunk.all()
# [4, 5]
\`\`\``},"machinable.collection.ExecutionCollection.transform":{kind:"routine",realname:"transform",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.transform",signature:"(self, callback)",doc:`Transform each item in the collection using a callback.

Iterates over the collection and calls the given callback with each item in the collection.
The items in the collection will be replaced by the values returned by the callback.

# Arguments
callback: The callback

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.transform(lambda item: item * 2)
collection.all()

# [2, 4, 6, 8, 10]
\`\`\`

::: warning
Unlike most other collection methods, \`transform\` modifies the
collection itself. If you wish to create a new collection instead, use
the [map](#map) method.
:::`},"machinable.collection.ExecutionCollection.unique":{kind:"routine",realname:"unique",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.unique",signature:"(self, key=None)",doc:`Returns all of the unique items in the collection

# Arguments
key: The key to check uniqueness on

\`\`\` python
collection = Collection([1, 1, 2, 2, 3, 4, 2])

unique = collection.unique()

unique.all()

# [1, 2, 3, 4]
\`\`\`

When dealing with dictionaries or objects, you can specify the key used
to determine uniqueness:

\`\`\` python
collection = Collection([
    {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'iPhone 5', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
    {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
    {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
])

unique = collection.unique('brand')

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'}
# ]
\`\`\`

You can also pass your own callback to determine item uniqueness:

\`\`\` python
unique = collection.unique(lambda item: item['brand'] + item['type'])

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
#     {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
# ]
\`\`\``},"machinable.collection.ExecutionCollection.where":{kind:"routine",realname:"where",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.where",signature:"(self, key, value)",doc:`Filter items by the given key value pair.

# Arguments
key: The key to filter by
value: The value to filter by

\`\`\` python
collection = Collection([
    {'name': 'Desk', 'price': 200},
    {'name': 'Chair', 'price': 100},
    {'name': 'Bookcase', 'price': 150},
    {'name': 'Door', 'price': 100},
])

filtered = collection.where('price', 100)

filtered.all()

# [
#     {'name': 'Chair', 'price': 100},
#     {'name': 'Door', 'price': 100}
# ]
\`\`\``},"machinable.collection.ExecutionCollection.without":{kind:"routine",realname:"without",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.without",signature:"(self, *keys)",doc:"Get all items except for those with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to remove"},"machinable.collection.ExecutionCollection.zip":{kind:"routine",realname:"zip",name:"machinable.collection",path:"machinable.collection.ExecutionCollection.zip",signature:"(self, *items)",doc:`Merges together the values of the given list with the values of the collection at the corresponding index

# Argument
*items: Zip items

\`\`\` python
collection = Collection(['Chair', 'Desk'])
zipped = collection.zip([100, 200])
zipped.all()
# [('Chair', 100), ('Desk', 200)]
\`\`\``},"machinable.collection.ExecutionCollection":{kind:"class",realname:"ExecutionCollection",name:"machinable.collection",path:"machinable.collection.ExecutionCollection",parents:["ElementCollection"],doc:null,file:"src/machinable/collection.py"},"machinable.collection.InterfaceCollection.all":{kind:"routine",realname:"all",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.all",signature:"(self)",doc:`Get all of the items in the collection.

Returns the underlying list represented by the
collection

\`\`\` python
Collection([1, 2, 3]).all()

# [1, 2, 3]
\`\`\``},"machinable.collection.InterfaceCollection.append":{kind:"routine",realname:"append",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.append",signature:"(self, value)",doc:`Add an item onto the end of the collection.

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.push(5)

collection.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.InterfaceCollection.as_dataframe":{kind:"routine",realname:"as_dataframe",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.as_dataframe",signature:"(self)",doc:"Returns collection as Pandas dataframe"},"machinable.collection.InterfaceCollection.as_json":{kind:"routine",realname:"as_json",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.as_json",signature:"(self, **options)",doc:`Converts the collection into JSON

# Arguments
options: JSON encoding options

\`\`\` python
collection = Collection([{'name': 'Desk', 'price': 200}])

collection.as_json()

# '[{"name": "Desk", "price": 200}]'
\`\`\``},"machinable.collection.InterfaceCollection.as_numpy":{kind:"routine",realname:"as_numpy",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.as_numpy",signature:"(self)",doc:"Converts the collection into a numpy array"},"machinable.collection.InterfaceCollection.as_table":{kind:"routine",realname:"as_table",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.as_table",signature:"(self, mode='html', headers=(), **kwargs)",doc:`Converts the collection into a table

# Arguments
mode: String 'html' or any other mode of the tabulate package
headers: Optional header row
**kwargs: Options to pass to tabulate`},"machinable.collection.InterfaceCollection.avg":{kind:"routine",realname:"avg",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.avg",signature:"(self, key=None)",doc:`Get the average value of a given key.

# Arguments
key: The key to get the average for

\`\`\` python
Collection([1, 2, 3, 4, 5]).avg()
# 3
\`\`\`

If the collection contains nested objects or dictionaries, you must pass
a key to use for determining which values to calculate the average:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])
# 636
collection.avg('pages')
\`\`\``},"machinable.collection.InterfaceCollection.chunk":{kind:"routine",realname:"chunk",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.chunk",signature:"(self, size)",doc:`Chunk the underlying collection.

The \`chunk\` method breaks the collection into multiple, smaller
collections of a given size:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5, 6, 7])

chunks = collection.chunk(4)

chunks.serialize()

# [[1, 2, 3, 4], [5, 6, 7]]
\`\`\`

# Arguments
size: The chunk size`},"machinable.collection.InterfaceCollection.collapse":{kind:"routine",realname:"collapse",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.collapse",signature:"(self)",doc:`Collapses a collection of lists into a flat collection

\`\`\` python
collection = Collection([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
collapsed = collection.collapse()
collapsed.all()
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\``},"machinable.collection.InterfaceCollection.contains":{kind:"routine",realname:"contains",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.contains",signature:"(self, key, value=None)",doc:`Determines if an element is in the collection

# Arguments
key: \`\`Integer\`\`|\`\`String\`\`|\`\`callable\`\` The element
value: The value of the element

\`\`\` python
collection = Collection(['foo', 'bar'])

collection.contains('foo')

# True
\`\`\`

You can also use the \`in\` keyword:

\`\`\` python
'foo' in collection

# True
\`\`\`

You can also pass a key / value pair to the \`contains\` method, which
will determine if the given pair exists in the collection:

\`\`\` python
collection = Collection([
    {'name': 'John', 'id': 1},
    {'name': 'Jane', 'id': 2}
])

collection.contains('name', 'Simon')

# False
\`\`\`

Finally, you may also pass a callback to the \`contains\` method to
perform your own truth test:

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])

collection.contains(lambda item: item > 5)

# False
\`\`\``},"machinable.collection.InterfaceCollection.count":{kind:"routine",realname:"count",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.count",signature:"(self)",doc:`Returns the total number of items in the collection:

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.count()

# 4
\`\`\`

The \`len\` function can also be used:

\`\`\` python
len(collection)

# 4
\`\`\``},"machinable.collection.InterfaceCollection.diff":{kind:"routine",realname:"diff",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.diff",signature:"(self, items)",doc:"Compares the collection against another collection, a `list` or a `dict`\n\n# Arguments\nitems: The items to diff with\n\n``` python\ncollection = Collection([1, 2, 3, 4, 5])\ndiff = collection.diff([2, 4, 6, 8])\ndiff.all()\n# [1, 3, 5]\n```"},"machinable.collection.InterfaceCollection.each":{kind:"routine",realname:"each",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.each",signature:"(self, callback)",doc:`Iterates over the items in the collection and passes each item to a given callback

# Arguments
callback: \`\`callable\`\` The callback to execute

\`\`\` python
collection = Collection([1, 2, 3])
collection.each(lambda x: x + 3)
\`\`\`

Return \`False\` from your callback to break out of the loop:

\`\`\` python
observations.each(lambda data: data.save() if data.name == 'mnist' else False)
\`\`\`

::: tip
It only applies the callback but does not modify the collection's items.
Use the [transform()](#transform) method to
modify the collection.
:::`},"machinable.collection.InterfaceCollection.empty":{kind:"routine",realname:"empty",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.empty",signature:"(self)",doc:"Returns `True` if the collection is empty; otherwise, `False` is returned"},"machinable.collection.InterfaceCollection.every":{kind:"routine",realname:"every",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.every",signature:"(self, step, offset=0)",doc:"Create a new collection consisting of every n-th element.\n\n# Arguments\nstep: ``int`` The step size\noffset: ``int`` The start offset\n\n``` python\ncollection = Collection(['a', 'b', 'c', 'd', 'e', 'f'])\n\ncollection.every(4).all()\n\n# ['a', 'e']\n```\n\nYou can optionally pass the offset as the second argument:\n\n``` python\ncollection.every(4, 1).all()\n\n# ['b', 'f']\n```"},"machinable.collection.InterfaceCollection.filter":{kind:"routine",realname:"filter",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.filter",signature:"(self, callback=None)",doc:"Filters the collection by a given callback, keeping only those items that pass a given truth test\n\n# Arguments\ncallback: ``callable``|``None`` The filter callback\n\n``` python\ncollection = Collection([1, 2, 3, 4])\n\nfiltered = collection.filter(lambda item: item > 2)\n\nfiltered.all()\n\n# [3, 4]\n```"},"machinable.collection.InterfaceCollection.filter_by_context":{kind:"routine",realname:"filter_by_context",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.filter_by_context",signature:"(self, module: str, version: str | dict | None | list[str | dict | None] = None, **kwargs)",doc:null},"machinable.collection.InterfaceCollection.filter_by_module":{kind:"routine",realname:"filter_by_module",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.filter_by_module",signature:"(self, module)",doc:null},"machinable.collection.InterfaceCollection.first":{kind:"routine",realname:"first",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.first",signature:"(self, callback=None, default=None)",doc:`Returns the first element in the collection that passes a given truth test

# Arguments
callback: Optional callable truth condition to find first element
default: A default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.first(lambda item: item > 2)

# 3
\`\`\`

You can also call the \`first\` method with no arguments to get the first
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.first()

# 1
\`\`\``},"machinable.collection.InterfaceCollection.flatten":{kind:"routine",realname:"flatten",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.flatten",signature:"(self)",doc:`Flattens a multi-dimensional collection into a single dimension

\`\`\` python
collection = Collection([1, 2, [3, 4, 5, {'foo': 'bar'}]])

flattened = collection.flatten()

flattened.all()

# [1, 2, 3, 4, 5, 'bar']
\`\`\``},"machinable.collection.InterfaceCollection.forget":{kind:"routine",realname:"forget",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.forget",signature:"(self, *keys)",doc:`Remove an item from the collection by key.

# Arguments
keys: The keys to remove

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.forget(1)
collection.all()
# [1, 3, 4, 5]
\`\`\`

::: warning
Unlike most other collection methods, \`forget\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.InterfaceCollection.get":{kind:"routine",realname:"get",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.get",signature:"(self, key, default=None)",doc:`Returns the item at a given key. If the key does not exist, \`None\` is returned

# Arguments
key: The index of the element
default: The default value to return

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3)
# None
\`\`\`

You can optionally pass a default value as the second argument:

\`\`\` python
collection = Collection([1, 2, 3])
collection.get(3, 'default-value')
# default-value
\`\`\``},"machinable.collection.InterfaceCollection.implode":{kind:"routine",realname:"implode",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.implode",signature:"(self, value, glue='')",doc:`Joins the items in a collection. Its arguments depend on the type of items in the collection.

# Arguments
value: The value
glue: The glue

If the collection contains dictionaries or objects, you must pass the
key of the attributes you wish to join, and the "glue" string you wish
to place between the values:

\`\`\` python
collection = Collection([
    {'account_id': 1, 'product': 'Desk'},
    {'account_id': 2, 'product': 'Chair'}
])

collection.implode('product', ', ')

# Desk, Chair
\`\`\`

If the collection contains simple strings, simply pass the "glue" as the
only argument to the method:

\`\`\` python
collection = Collection(['foo', 'bar', 'baz'])

collection.implode('-')

# foo-bar-baz
\`\`\``},"machinable.collection.InterfaceCollection.last":{kind:"routine",realname:"last",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.last",signature:"(self, callback=None, default=None)",doc:`Returns the last element in the collection that passes a given truth test

# Arguments
callback: Optional \`\`callable\`\` truth condition
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

last = collection.last(lambda item: item < 3)

# 2
\`\`\`

You can also call the \`last\` method with no arguments to get the last
element in the collection. If the collection is empty, \`None\` is
returned:

\`\`\` python
collection.last()

# 4
\`\`\``},"machinable.collection.InterfaceCollection.make":{kind:"routine",realname:"make",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.make",signature:null,doc:"Create a new Collection instance if the value isn't one already\n\n# Arguments\nitems: ``list``|``Collection``|``map`` of items to collect"},"machinable.collection.InterfaceCollection.map":{kind:"routine",realname:"map",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.map",signature:"(self, callback)",doc:`Iterates through the collection and passes each value to the given callback.
The callback is free to modify the item and return it, thus forming a new collection of modified items

# Arguments
callback: The map function

\`\`\` python
collection = Collection([1, 2, 3, 4])

multiplied = collection.map(lambda item: item * 2)

multiplied.all()

# [2, 4, 6, 8]
\`\`\`

::: warning
Like most other collection methods, \`map\` returns a new \`Collection\`
instance; it does not modify the collection it is called on. If you want
to transform the original collection, use the [transform](#transform)
method.
:::`},"machinable.collection.InterfaceCollection.max":{kind:"routine",realname:"max",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.max",signature:"(self, key=None)",doc:`Get the max value of a given key.

# Arguments
key: The key`},"machinable.collection.InterfaceCollection.merge":{kind:"routine",realname:"merge",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.merge",signature:"(self, items)",doc:`Merges the given list into the collection

# Arguments
items: The items to merge

\`\`\` python
collection = Collection(['Desk', 'Chair'])
collection.merge(['Bookcase', 'Door'])
collection.all()
# ['Desk', 'Chair', 'Bookcase', 'Door']
\`\`\`

::: warning
Unlike most other collection methods, \`merge\` does not return a new
modified collection; it modifies the collection it is called on.
:::`},"machinable.collection.InterfaceCollection.min":{kind:"routine",realname:"min",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.min",signature:"(self, key=None)",doc:`Get the min value of a given key.

key: The key`},"machinable.collection.InterfaceCollection.only":{kind:"routine",realname:"only",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.only",signature:"(self, *keys)",doc:"Get the items with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to keep"},"machinable.collection.InterfaceCollection.pluck":{kind:"routine",realname:"pluck",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.pluck",signature:"(self, value, key=None)",doc:`Retrieves all of the collection values for a given key

# Arguments
value: Value
key: Optional key

\`\`\` python
collection = Collection([
    {'product_id': 1, 'product': 'Desk'},
    {'product_id': 2, 'product': 'Chair'}
])

plucked = collection.pluck('product')

plucked.all()

# ['Desk', 'Chair']
\`\`\`

You can also specify how you wish the resulting collection to be keyed:

\`\`\` python
plucked = collection.pluck('name', 'product_id')

plucked

# {1: 'Desk', 2: 'Chair'}
\`\`\``},"machinable.collection.InterfaceCollection.pluck_or_nan":{kind:"routine",realname:"pluck_or_nan",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.pluck_or_nan",signature:"(self, value, key=None)",doc:`Pluck method that returns NaNs if key is not present

# Arguments
value: Value
key: Key`},"machinable.collection.InterfaceCollection.pluck_or_none":{kind:"routine",realname:"pluck_or_none",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.pluck_or_none",signature:"(self, value, key=None, none=None)",doc:`Pluck method that returns None if key is not present

# Arguments
value: Value
key: Key
none: Return value if key is not present`},"machinable.collection.InterfaceCollection.pop":{kind:"routine",realname:"pop",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.pop",signature:"(self, key=None)",doc:`Removes and returns the last item from the collection.
If no index is specified, returns the last item.

# Arguments
key: The index of the item to return


\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.pop()
# 5

collection.all()
# [1, 2, 3, 4]
\`\`\``},"machinable.collection.InterfaceCollection.pprint":{kind:"routine",realname:"pprint",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.pprint",signature:"(self, pformat='json')",doc:null},"machinable.collection.InterfaceCollection.prepend":{kind:"routine",realname:"prepend",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.prepend",signature:"(self, value)",doc:`Adds an item to the beginning of the collection

# Arguments
value: The value to push

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.prepend(0)

collection.all()

# [0, 1, 2, 3, 4]
\`\`\``},"machinable.collection.InterfaceCollection.pull":{kind:"routine",realname:"pull",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.pull",signature:"(self, key, default=None)",doc:`Removes and returns an item from the collection by its key

# Arugments
key: The key
default: The default value

\`\`\` python
collection = Collection([1, 2, 3, 4])

collection.pull(1)

collection.all()

# [1, 3, 4]
\`\`\``},"machinable.collection.InterfaceCollection.put":{kind:"routine",realname:"put",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.put",signature:"(self, key, value)",doc:`Sets the given key and value in the collection

# Arguments
key: The key
value: The value

\`\`\` python
collection = Collection([1, 2, 3, 4])
collection.put(1, 5)
collection.all()

# [1, 5, 3, 4]
\`\`\`

::: tip
It is equivalent to \`\`collection[1] = 5\`\`
:::`},"machinable.collection.InterfaceCollection.reduce":{kind:"routine",realname:"reduce",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.reduce",signature:"(self, callback, initial=None)",doc:`Reduces the collection to a single value, passing the result of each iteration into the subsequent iteration

# Arguments
callback: The callback
initial: The initial value

\`\`\` python
collection = Collection([1, 2, 3])

collection.reduce(lambda result, item: (result or 0) + item)

# 6
\`\`\`

The value for \`result\` on the first iteration is \`None\`; however, you
can specify its initial value by passing a second argument to reduce:

\`\`\` python
collection.reduce(lambda result, item: result + item, 4)

# 10
\`\`\``},"machinable.collection.InterfaceCollection.reject":{kind:"routine",realname:"reject",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.reject",signature:"(self, callback)",doc:`Filters the collection using the given callback. The callback should return \`True\` for any items it wishes
to remove from the resulting collection

# Arguments
callback: The truth test

\`\`\` python
collection = Collection([1, 2, 3, 4])

filtered = collection.reject(lambda item: item > 2)

filtered.all()

# [1, 2]
\`\`\`

For the inverse of \`reject\`, see the [filter](#filter) method.`},"machinable.collection.InterfaceCollection.reverse":{kind:"routine",realname:"reverse",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.reverse",signature:"(self)",doc:`Reverses the order of the collection's items

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
reverse = collection.reverse()
reverse.all()
# [5, 4, 3, 2, 1]
\`\`\``},"machinable.collection.InterfaceCollection.section":{kind:"routine",realname:"section",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.section",signature:"(self, of, reduce=None)",doc:"Performs horizontal reduce through the collection\n\n# Arguments\nof: ``Callable`` Selector of reduce values\nreduce: Optional ``callable`` reduce method"},"machinable.collection.InterfaceCollection.serialize":{kind:"routine",realname:"serialize",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.serialize",signature:"(self)",doc:`Converts the collection into a \`list\`

\`\`\` python
collection = Collection([User.find(1)])
collection.serialize()
# [{'id': 1, 'name': 'John'}]
\`\`\`

::: warning
\`serialize\` also converts all of its nested objects. If you want to get
the underlying items as is, use the [all](#all) method instead.
:::`},"machinable.collection.InterfaceCollection.singleton":{kind:"routine",realname:"singleton",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.singleton",signature:"(self, module: str, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Union[Any, ForwardRef('Component')]",doc:null},"machinable.collection.InterfaceCollection.sort":{kind:"routine",realname:"sort",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.sort",signature:"(self, callback=None, reverse=False)",doc:`Sorts the collection

# Arguments
callback: Sort callable
reverse: True for reversed sort order

\`\`\` python
collection = Collection([5, 3, 1, 2, 4])

sorted = collection.sort()

sorted.all()

# [1, 2, 3, 4, 5]
\`\`\``},"machinable.collection.InterfaceCollection.sum":{kind:"routine",realname:"sum",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.sum",signature:"(self, callback=None)",doc:`Returns the sum of all items in the collection

callback: The callback

\`\`\` python
Collection([1, 2, 3, 4, 5]).sum()

# 15
\`\`\`

If the collection contains dictionaries or objects, you must pass a key
to use for determining which values to sum:

\`\`\` python
collection = Collection([
    {'name': 'JavaScript: The Good Parts', 'pages': 176},
    {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
])

collection.sum('pages')

# 1272
\`\`\`

In addition, you can pass your own callback to determine which values of
the collection to sum:

\`\`\` python
collection = Collection([
    {'name': 'Chair', 'colors': ['Black']},
    {'name': 'Desk', 'colors': ['Black', 'Mahogany']},
    {'name': 'Bookcase', 'colors': ['Red', 'Beige', 'Brown']}
])

collection.sum(lambda product: len(product['colors']))

# 6
\`\`\``},"machinable.collection.InterfaceCollection.take":{kind:"routine",realname:"take",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.take",signature:"(self, limit)",doc:`Take the first or last n items.

# Arguments
limit: The number of items to take

\`\`\` python
collection = Collection([0, 1, 2, 3, 4, 5])
chunk = collection.take(3)
chunk.all()
# [0, 1, 2]
\`\`\`

You can also pass a negative integer to take the specified amount of
items from the end of the collection:

\`\`\` python
chunk = collection.chunk(-2)
chunk.all()
# [4, 5]
\`\`\``},"machinable.collection.InterfaceCollection.transform":{kind:"routine",realname:"transform",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.transform",signature:"(self, callback)",doc:`Transform each item in the collection using a callback.

Iterates over the collection and calls the given callback with each item in the collection.
The items in the collection will be replaced by the values returned by the callback.

# Arguments
callback: The callback

\`\`\` python
collection = Collection([1, 2, 3, 4, 5])
collection.transform(lambda item: item * 2)
collection.all()

# [2, 4, 6, 8, 10]
\`\`\`

::: warning
Unlike most other collection methods, \`transform\` modifies the
collection itself. If you wish to create a new collection instead, use
the [map](#map) method.
:::`},"machinable.collection.InterfaceCollection.unique":{kind:"routine",realname:"unique",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.unique",signature:"(self, key=None)",doc:`Returns all of the unique items in the collection

# Arguments
key: The key to check uniqueness on

\`\`\` python
collection = Collection([1, 1, 2, 2, 3, 4, 2])

unique = collection.unique()

unique.all()

# [1, 2, 3, 4]
\`\`\`

When dealing with dictionaries or objects, you can specify the key used
to determine uniqueness:

\`\`\` python
collection = Collection([
    {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'iPhone 5', 'brand': 'Apple', 'type': 'phone'},
    {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
    {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
    {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
])

unique = collection.unique('brand')

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'}
# ]
\`\`\`

You can also pass your own callback to determine item uniqueness:

\`\`\` python
unique = collection.unique(lambda item: item['brand'] + item['type'])

unique.all()

# [
#     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
#     {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
#     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
#     {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
# ]
\`\`\``},"machinable.collection.InterfaceCollection.where":{kind:"routine",realname:"where",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.where",signature:"(self, key, value)",doc:`Filter items by the given key value pair.

# Arguments
key: The key to filter by
value: The value to filter by

\`\`\` python
collection = Collection([
    {'name': 'Desk', 'price': 200},
    {'name': 'Chair', 'price': 100},
    {'name': 'Bookcase', 'price': 150},
    {'name': 'Door', 'price': 100},
])

filtered = collection.where('price', 100)

filtered.all()

# [
#     {'name': 'Chair', 'price': 100},
#     {'name': 'Door', 'price': 100}
# ]
\`\`\``},"machinable.collection.InterfaceCollection.without":{kind:"routine",realname:"without",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.without",signature:"(self, *keys)",doc:"Get all items except for those with the specified keys.\n\n# Arguments\nkeys: ``tuple`` The keys to remove"},"machinable.collection.InterfaceCollection.zip":{kind:"routine",realname:"zip",name:"machinable.collection",path:"machinable.collection.InterfaceCollection.zip",signature:"(self, *items)",doc:`Merges together the values of the given list with the values of the collection at the corresponding index

# Argument
*items: Zip items

\`\`\` python
collection = Collection(['Chair', 'Desk'])
zipped = collection.zip([100, 200])
zipped.all()
# [('Chair', 100), ('Desk', 200)]
\`\`\``},"machinable.collection.InterfaceCollection":{kind:"class",realname:"InterfaceCollection",name:"machinable.collection",path:"machinable.collection.InterfaceCollection",parents:["ElementCollection"],doc:null,file:"src/machinable/collection.py"},"machinable.collection.collect":{kind:"routine",realname:"collect",name:"machinable.collection",path:"machinable.collection.collect",signature:"(elements)",doc:null},"machinable.collection.data_get":{kind:"routine",realname:"data_get",name:"machinable.collection",path:"machinable.collection.data_get",signature:"(target, key, default=None)",doc:`Get an item from a list, a dict or an object using "dot" notation.

:param target: The target element
:type target: list or dict or object

:param key: The key to get
:type key: string or list

:param default: The default value
:type default: mixed

:rtype: mixed`},"machinable.collection.reduce":{kind:"routine",realname:"reduce",name:"machinable.collection",path:"machinable.collection.reduce",signature:null,doc:`reduce(function, iterable[, initial], /) -> value

Apply a function of two arguments cumulatively to the items of an iterable, from left to right.

This effectively reduces the iterable to a single value.  If initial is present,
it is placed before the items of the iterable in the calculation, and serves as
a default when the iterable is empty.

For example, reduce(lambda x, y: x+y, [1, 2, 3, 4, 5])
calculates ((((1 + 2) + 3) + 4) + 5).`},"machinable.collection":{kind:"module",name:"machinable.collection",path:"machinable.collection",doc:null,file:"src/machinable/collection.py"},"machinable.component.Component.all":{kind:"routine",realname:"all",name:"machinable.component",path:"machinable.component.Component.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.component.Component.ancestor":{kind:"routine",realname:null,name:"machinable.component",path:"machinable.component.Component.ancestor",signature:null,doc:null},"machinable.component.Component.as_default":{kind:"routine",realname:"as_default",name:"machinable.component",path:"machinable.component.Component.as_default",signature:"(self) -> Self",doc:null},"machinable.component.Component.as_json":{kind:"routine",realname:"as_json",name:"machinable.component",path:"machinable.component.Component.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.component.Component.cached":{kind:"routine",realname:"cached",name:"machinable.component",path:"machinable.component.Component.cached",signature:"(self, cached: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.component.Component.clone":{kind:"routine",realname:"clone",name:"machinable.component",path:"machinable.component.Component.clone",signature:"(self)",doc:null},"machinable.component.Component.collect":{kind:"routine",realname:"collect",name:"machinable.component",path:"machinable.component.Component.collect",signature:null,doc:null},"machinable.component.Component.commit":{kind:"routine",realname:"commit",name:"machinable.component",path:"machinable.component.Component.commit",signature:"(self) -> Self",doc:null},"machinable.component.Component.compute_context":{kind:"routine",realname:"compute_context",name:"machinable.component",path:"machinable.component.Component.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.component.Component.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable.component",path:"machinable.component.Component.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.component.Component.connected":{kind:"routine",realname:"connected",name:"machinable.component",path:"machinable.component.Component.connected",signature:null,doc:null},"machinable.component.Component.created_at":{kind:"routine",realname:"created_at",name:"machinable.component",path:"machinable.component.Component.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.component.Component.derive":{kind:"routine",realname:"derive",name:"machinable.component",path:"machinable.component.Component.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.component.Component.derived":{kind:"routine",realname:null,name:"machinable.component",path:"machinable.component.Component.derived",signature:null,doc:null},"machinable.component.Component.dispatch":{kind:"routine",realname:"dispatch",name:"machinable.component",path:"machinable.component.Component.dispatch",signature:"(self) -> Self",doc:"Dispatch the component lifecycle"},"machinable.component.Component.dispatch_code":{kind:"routine",realname:"dispatch_code",name:"machinable.component",path:"machinable.component.Component.dispatch_code",signature:"(self, inline: bool = True, project_directory: str | None = None, python: str | None = None) -> str | None",doc:null},"machinable.component.Component.executions":{kind:"routine",realname:null,name:"machinable.component",path:"machinable.component.Component.executions",signature:null,doc:null},"machinable.component.Component.fetch":{kind:"routine",realname:"fetch",name:"machinable.component",path:"machinable.component.Component.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.component.Component.find":{kind:"routine",realname:"find",name:"machinable.component",path:"machinable.component.Component.find",signature:null,doc:null},"machinable.component.Component.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable.component",path:"machinable.component.Component.find_by_hash",signature:null,doc:null},"machinable.component.Component.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable.component",path:"machinable.component.Component.find_by_id",signature:null,doc:null},"machinable.component.Component.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable.component",path:"machinable.component.Component.find_many_by_id",signature:null,doc:null},"machinable.component.Component.from_directory":{kind:"routine",realname:"from_directory",name:"machinable.component",path:"machinable.component.Component.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.component.Component.from_json":{kind:"routine",realname:"from_json",name:"machinable.component",path:"machinable.component.Component.from_json",signature:null,doc:null},"machinable.component.Component.from_model":{kind:"routine",realname:"from_model",name:"machinable.component",path:"machinable.component.Component.from_model",signature:null,doc:null},"machinable.component.Component.future":{kind:"routine",realname:"future",name:"machinable.component",path:"machinable.component.Component.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.component.Component.get":{kind:"routine",realname:"get",name:"machinable.component",path:"machinable.component.Component.get",signature:null,doc:null},"machinable.component.Component.hidden":{kind:"routine",realname:"hidden",name:"machinable.component",path:"machinable.component.Component.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.component.Component.instance":{kind:"routine",realname:"instance",name:"machinable.component",path:"machinable.component.Component.instance",signature:null,doc:null},"machinable.component.Component.is_committed":{kind:"routine",realname:"is_committed",name:"machinable.component",path:"machinable.component.Component.is_committed",signature:"(self) -> bool",doc:null},"machinable.component.Component.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.component",path:"machinable.component.Component.is_connected",signature:null,doc:null},"machinable.component.Component.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable.component",path:"machinable.component.Component.is_mounted",signature:"(self) -> bool",doc:null},"machinable.component.Component.is_staged":{kind:"routine",realname:"is_staged",name:"machinable.component",path:"machinable.component.Component.is_staged",signature:"(self) -> bool",doc:null},"machinable.component.Component.launch":{kind:"routine",realname:"launch",name:"machinable.component",path:"machinable.component.Component.launch",signature:"(self) -> Self",doc:null},"machinable.component.Component.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable.component",path:"machinable.component.Component.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.component.Component.load_file":{kind:"routine",realname:"load_file",name:"machinable.component",path:"machinable.component.Component.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.component.Component.local_directory":{kind:"routine",realname:"local_directory",name:"machinable.component",path:"machinable.component.Component.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.component.Component.make":{kind:"routine",realname:"make",name:"machinable.component",path:"machinable.component.Component.make",signature:null,doc:null},"machinable.component.Component.matches":{kind:"routine",realname:"matches",name:"machinable.component",path:"machinable.component.Component.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.component.Component.model":{kind:"routine",realname:"model",name:"machinable.component",path:"machinable.component.Component.model",signature:null,doc:null},"machinable.component.Component.new":{kind:"routine",realname:"new",name:"machinable.component",path:"machinable.component.Component.new",signature:"(self) -> Self",doc:null},"machinable.component.Component.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable.component",path:"machinable.component.Component.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.component.Component.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable.component",path:"machinable.component.Component.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.component.Component.on_after_dispatch":{kind:"routine",realname:"on_after_dispatch",name:"machinable.component",path:"machinable.component.Component.on_after_dispatch",signature:"(self, success: bool)",doc:`Lifecycle event triggered at the end of the dispatch.

This is triggered independent of whether the execution has been successful or not.

# Arguments
success: Whether the execution finished sucessfully`},"machinable.component.Component.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable.component",path:"machinable.component.Component.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.component.Component.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable.component",path:"machinable.component.Component.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.component.Component.on_before_dispatch":{kind:"routine",realname:"on_before_dispatch",name:"machinable.component",path:"machinable.component.Component.on_before_dispatch",signature:"(self) -> bool | None",doc:"Event triggered before the dispatch of the component"},"machinable.component.Component.on_commit":{kind:"routine",realname:"on_commit",name:"machinable.component",path:"machinable.component.Component.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.component.Component.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable.component",path:"machinable.component.Component.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.component.Component.on_configure":{kind:"routine",realname:"on_configure",name:"machinable.component",path:"machinable.component.Component.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.component.Component.on_failure":{kind:"routine",realname:"on_failure",name:"machinable.component",path:"machinable.component.Component.on_failure",signature:"(self, exception: Exception) -> None",doc:`Lifecycle event triggered iff the execution finished with an exception

# Arguments
exception: Execution exception`},"machinable.component.Component.on_finish":{kind:"routine",realname:"on_finish",name:"machinable.component",path:"machinable.component.Component.on_finish",signature:"(self, success: bool)",doc:`Lifecycle event triggered right before the end of the component execution

# Arguments
success: Whether the execution finished sucessfully`},"machinable.component.Component.on_heartbeat":{kind:"routine",realname:"on_heartbeat",name:"machinable.component",path:"machinable.component.Component.on_heartbeat",signature:"(self) -> None",doc:"Event triggered on heartbeat every 15 seconds"},"machinable.component.Component.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable.component",path:"machinable.component.Component.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.component.Component.on_seeding":{kind:"routine",realname:"on_seeding",name:"machinable.component",path:"machinable.component.Component.on_seeding",signature:"(self)",doc:"Lifecycle event to implement custom seeding using `self.seed`"},"machinable.component.Component.on_success":{kind:"routine",realname:"on_success",name:"machinable.component",path:"machinable.component.Component.on_success",signature:"(self)",doc:"Lifecycle event triggered iff execution finishes successfully"},"machinable.component.Component.on_write_meta_data":{kind:"routine",realname:"on_write_meta_data",name:"machinable.component",path:"machinable.component.Component.on_write_meta_data",signature:"(self) -> bool | None",doc:`Event triggered before meta-data such as creation time etc. is written to the storage

Return False to prevent writing of meta-data`},"machinable.component.Component.project":{kind:"routine",realname:null,name:"machinable.component",path:"machinable.component.Component.project",signature:null,doc:null},"machinable.component.Component.push_related":{kind:"routine",realname:"push_related",name:"machinable.component",path:"machinable.component.Component.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.component.Component.related":{kind:"routine",realname:"related",name:"machinable.component",path:"machinable.component.Component.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.component.Component.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable.component",path:"machinable.component.Component.related_iterator",signature:"(self)",doc:null},"machinable.component.Component.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable.component",path:"machinable.component.Component.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.component.Component.save_file":{kind:"routine",realname:"save_file",name:"machinable.component",path:"machinable.component.Component.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.component.Component.serialize":{kind:"routine",realname:"serialize",name:"machinable.component",path:"machinable.component.Component.serialize",signature:"(self) -> dict",doc:null},"machinable.component.Component.set_default":{kind:"routine",realname:"set_default",name:"machinable.component",path:"machinable.component.Component.set_default",signature:null,doc:null},"machinable.component.Component.set_model":{kind:"routine",realname:"set_model",name:"machinable.component",path:"machinable.component.Component.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.component.Component.singleton":{kind:"routine",realname:"singleton",name:"machinable.component",path:"machinable.component.Component.singleton",signature:null,doc:null},"machinable.component.Component.stage":{kind:"routine",realname:"stage",name:"machinable.component",path:"machinable.component.Component.stage",signature:"(self) -> Self",doc:null},"machinable.component.Component.to_cli":{kind:"routine",realname:"to_cli",name:"machinable.component",path:"machinable.component.Component.to_cli",signature:"(self) -> str",doc:null},"machinable.component.Component.to_directory":{kind:"routine",realname:"to_directory",name:"machinable.component",path:"machinable.component.Component.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.component.Component.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.component",path:"machinable.component.Component.unserialize",signature:null,doc:null},"machinable.component.Component.used_by":{kind:"routine",realname:null,name:"machinable.component",path:"machinable.component.Component.used_by",signature:null,doc:null},"machinable.component.Component.uses":{kind:"routine",realname:null,name:"machinable.component",path:"machinable.component.Component.uses",signature:null,doc:null},"machinable.component.Component.version":{kind:"routine",realname:"version",name:"machinable.component",path:"machinable.component.Component.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.component.Component":{kind:"class",realname:"Component",name:"machinable.component",path:"machinable.component.Component",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/component.py"},"machinable.component":{kind:"module",name:"machinable.component",path:"machinable.component",doc:null,file:"src/machinable/component.py"},"machinable.config.to_dict":{kind:"routine",realname:"to_dict",name:"machinable.config",path:"machinable.config.to_dict",signature:"(dict_like)",doc:null},"machinable.config":{kind:"module",name:"machinable.config",path:"machinable.config",doc:null,file:"src/machinable/config.py"},"machinable.element.ConfigMethod":{kind:"class",realname:"ConfigMethod",name:"machinable.element",path:"machinable.element.ConfigMethod",parents:["builtins.object"],doc:null,file:"src/machinable/element.py"},"machinable.element.Element.as_default":{kind:"routine",realname:"as_default",name:"machinable.element",path:"machinable.element.Element.as_default",signature:"(self) -> Self",doc:null},"machinable.element.Element.as_json":{kind:"routine",realname:"as_json",name:"machinable.element",path:"machinable.element.Element.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.element.Element.clone":{kind:"routine",realname:"clone",name:"machinable.element",path:"machinable.element.Element.clone",signature:"(self)",doc:null},"machinable.element.Element.collect":{kind:"routine",realname:"collect",name:"machinable.element",path:"machinable.element.Element.collect",signature:null,doc:null},"machinable.element.Element.compute_context":{kind:"routine",realname:"compute_context",name:"machinable.element",path:"machinable.element.Element.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.element.Element.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable.element",path:"machinable.element.Element.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.element.Element.connected":{kind:"routine",realname:"connected",name:"machinable.element",path:"machinable.element.Element.connected",signature:null,doc:null},"machinable.element.Element.created_at":{kind:"routine",realname:"created_at",name:"machinable.element",path:"machinable.element.Element.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.element.Element.from_json":{kind:"routine",realname:"from_json",name:"machinable.element",path:"machinable.element.Element.from_json",signature:null,doc:null},"machinable.element.Element.from_model":{kind:"routine",realname:"from_model",name:"machinable.element",path:"machinable.element.Element.from_model",signature:null,doc:null},"machinable.element.Element.get":{kind:"routine",realname:"get",name:"machinable.element",path:"machinable.element.Element.get",signature:null,doc:null},"machinable.element.Element.instance":{kind:"routine",realname:"instance",name:"machinable.element",path:"machinable.element.Element.instance",signature:null,doc:null},"machinable.element.Element.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.element",path:"machinable.element.Element.is_connected",signature:null,doc:null},"machinable.element.Element.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable.element",path:"machinable.element.Element.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.element.Element.make":{kind:"routine",realname:"make",name:"machinable.element",path:"machinable.element.Element.make",signature:null,doc:null},"machinable.element.Element.matches":{kind:"routine",realname:"matches",name:"machinable.element",path:"machinable.element.Element.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.element.Element.model":{kind:"routine",realname:"model",name:"machinable.element",path:"machinable.element.Element.model",signature:null,doc:null},"machinable.element.Element.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable.element",path:"machinable.element.Element.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.element.Element.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable.element",path:"machinable.element.Element.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.element.Element.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable.element",path:"machinable.element.Element.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.element.Element.on_configure":{kind:"routine",realname:"on_configure",name:"machinable.element",path:"machinable.element.Element.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.element.Element.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable.element",path:"machinable.element.Element.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.element.Element.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable.element",path:"machinable.element.Element.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.element.Element.serialize":{kind:"routine",realname:"serialize",name:"machinable.element",path:"machinable.element.Element.serialize",signature:"(self) -> dict",doc:null},"machinable.element.Element.set_default":{kind:"routine",realname:"set_default",name:"machinable.element",path:"machinable.element.Element.set_default",signature:null,doc:null},"machinable.element.Element.set_model":{kind:"routine",realname:"set_model",name:"machinable.element",path:"machinable.element.Element.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.element.Element.singleton":{kind:"routine",realname:"singleton",name:"machinable.element",path:"machinable.element.Element.singleton",signature:null,doc:null},"machinable.element.Element.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.element",path:"machinable.element.Element.unserialize",signature:null,doc:null},"machinable.element.Element.version":{kind:"routine",realname:"version",name:"machinable.element",path:"machinable.element.Element.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.element.Element":{kind:"class",realname:"Element",name:"machinable.element",path:"machinable.element.Element",parents:["machinable.mixin.Mixin","machinable.utils.Jsonable"],doc:"Element baseclass",file:"src/machinable/element.py"},"machinable.element.compact":{kind:"routine",realname:"compact",name:"machinable.element",path:"machinable.element.compact",signature:"(element: str | list[str | dict | None], version: str | dict | None | list[str | dict | None] = None) -> list[str | dict]",doc:null},"machinable.element.defaultversion":{kind:"routine",realname:"defaultversion",name:"machinable.element",path:"machinable.element.defaultversion",signature:"(module: str | None, version: str | dict | None | list[str | dict | None], element: 'Element') -> tuple[str | None, str | dict | None | list[str | dict | None]]",doc:null},"machinable.element.equaljson":{kind:"routine",realname:"equaljson",name:"machinable.element",path:"machinable.element.equaljson",signature:"(a: Any, b: Any) -> bool",doc:null},"machinable.element.equalversion":{kind:"routine",realname:"equalversion",name:"machinable.element",path:"machinable.element.equalversion",signature:"(a: str | dict | None | list[str | dict | None], b: str | dict | None | list[str | dict | None]) -> bool",doc:null},"machinable.element.extend":{kind:"routine",realname:"extend",name:"machinable.element",path:"machinable.element.extend",signature:"(module: Union[str, ForwardRef('Element'), collections.abc.Iterable, NoneType] = None, version: str | dict | None | list[str | dict | None] = None)",doc:null},"machinable.element.extract":{kind:"routine",realname:"extract",name:"machinable.element",path:"machinable.element.extract",signature:"(compact_element: str | list[str | dict] | None) -> tuple[str | None, list[str | dict] | None]",doc:null},"machinable.element.get_dump":{kind:"routine",realname:"get_dump",name:"machinable.element",path:"machinable.element.get_dump",signature:"(element: 'Element') -> bytes | None",doc:null},"machinable.element.get_lineage":{kind:"routine",realname:"get_lineage",name:"machinable.element",path:"machinable.element.get_lineage",signature:"(element: 'Element') -> tuple[str, ...]",doc:null},"machinable.element.instantiate":{kind:"routine",realname:"instantiate",name:"machinable.element",path:"machinable.element.instantiate",signature:"(module: str, class_: 'Element', version: str | dict | None | list[str | dict | None], **constructor_kwargs)",doc:null},"machinable.element.normversion":{kind:"routine",realname:"normversion",name:"machinable.element",path:"machinable.element.normversion",signature:"(version: str | dict | None | list[str | dict | None] = None) -> list[str | dict]",doc:null},"machinable.element.reset_connections":{kind:"routine",realname:"reset_connections",name:"machinable.element",path:"machinable.element.reset_connections",signature:"() -> None",doc:null},"machinable.element.transfer_to":{kind:"routine",realname:"transfer_to",name:"machinable.element",path:"machinable.element.transfer_to",signature:"(src: 'Element', destination: 'Element') -> 'Element'",doc:null},"machinable.element.uuid_to_id":{kind:"routine",realname:"uuid_to_id",name:"machinable.element",path:"machinable.element.uuid_to_id",signature:"(uuid: str) -> str",doc:null},"machinable.element":{kind:"module",name:"machinable.element",path:"machinable.element",doc:null,file:"src/machinable/element.py"},"machinable.errors.ComponentException.add_note":{kind:"routine",realname:"add_note",name:"machinable.errors",path:"machinable.errors.ComponentException.add_note",signature:"(self, object, /)",doc:`Exception.add_note(note) --
add a note to the exception`},"machinable.errors.ComponentException.with_traceback":{kind:"routine",realname:"with_traceback",name:"machinable.errors",path:"machinable.errors.ComponentException.with_traceback",signature:"(self, object, /)",doc:`Exception.with_traceback(tb) --
set self.__traceback__ to tb and return self.`},"machinable.errors.ComponentException":{kind:"class",realname:"ComponentException",name:"machinable.errors",path:"machinable.errors.ComponentException",parents:["MachinableError"],doc:`Component exception

Bases: MachinableError`,file:"src/machinable/errors.py"},"machinable.errors.ConfigurationError.add_note":{kind:"routine",realname:"add_note",name:"machinable.errors",path:"machinable.errors.ConfigurationError.add_note",signature:"(self, object, /)",doc:`Exception.add_note(note) --
add a note to the exception`},"machinable.errors.ConfigurationError.with_traceback":{kind:"routine",realname:"with_traceback",name:"machinable.errors",path:"machinable.errors.ConfigurationError.with_traceback",signature:"(self, object, /)",doc:`Exception.with_traceback(tb) --
set self.__traceback__ to tb and return self.`},"machinable.errors.ConfigurationError":{kind:"class",realname:"ConfigurationError",name:"machinable.errors",path:"machinable.errors.ConfigurationError",parents:["MachinableError"],doc:`Invalid configuration

Bases: MachinableError`,file:"src/machinable/errors.py"},"machinable.errors.DependencyMissing.add_note":{kind:"routine",realname:"add_note",name:"machinable.errors",path:"machinable.errors.DependencyMissing.add_note",signature:"(self, object, /)",doc:`Exception.add_note(note) --
add a note to the exception`},"machinable.errors.DependencyMissing.with_traceback":{kind:"routine",realname:"with_traceback",name:"machinable.errors",path:"machinable.errors.DependencyMissing.with_traceback",signature:"(self, object, /)",doc:`Exception.with_traceback(tb) --
set self.__traceback__ to tb and return self.`},"machinable.errors.DependencyMissing":{kind:"class",realname:"DependencyMissing",name:"machinable.errors",path:"machinable.errors.DependencyMissing",parents:["MachinableError","builtins.ImportError"],doc:`Missing optional dependency

Bases: ImportError`,file:"src/machinable/errors.py"},"machinable.errors.ExecutionFailed.add_note":{kind:"routine",realname:"add_note",name:"machinable.errors",path:"machinable.errors.ExecutionFailed.add_note",signature:"(self, object, /)",doc:`Exception.add_note(note) --
add a note to the exception`},"machinable.errors.ExecutionFailed.with_traceback":{kind:"routine",realname:"with_traceback",name:"machinable.errors",path:"machinable.errors.ExecutionFailed.with_traceback",signature:"(self, object, /)",doc:`Exception.with_traceback(tb) --
set self.__traceback__ to tb and return self.`},"machinable.errors.ExecutionFailed":{kind:"class",realname:"ExecutionFailed",name:"machinable.errors",path:"machinable.errors.ExecutionFailed",parents:["MachinableError"],doc:`Execution failed

Bases: MachinableError`,file:"src/machinable/errors.py"},"machinable.errors.MachinableError.add_note":{kind:"routine",realname:"add_note",name:"machinable.errors",path:"machinable.errors.MachinableError.add_note",signature:"(self, object, /)",doc:`Exception.add_note(note) --
add a note to the exception`},"machinable.errors.MachinableError.with_traceback":{kind:"routine",realname:"with_traceback",name:"machinable.errors",path:"machinable.errors.MachinableError.with_traceback",signature:"(self, object, /)",doc:`Exception.with_traceback(tb) --
set self.__traceback__ to tb and return self.`},"machinable.errors.MachinableError":{kind:"class",realname:"MachinableError",name:"machinable.errors",path:"machinable.errors.MachinableError",parents:["builtins.Exception"],doc:"All of machinable exception inherit from this baseclass",file:"src/machinable/errors.py"},"machinable.errors.StorageError.add_note":{kind:"routine",realname:"add_note",name:"machinable.errors",path:"machinable.errors.StorageError.add_note",signature:"(self, object, /)",doc:`Exception.add_note(note) --
add a note to the exception`},"machinable.errors.StorageError.with_traceback":{kind:"routine",realname:"with_traceback",name:"machinable.errors",path:"machinable.errors.StorageError.with_traceback",signature:"(self, object, /)",doc:`Exception.with_traceback(tb) --
set self.__traceback__ to tb and return self.`},"machinable.errors.StorageError":{kind:"class",realname:"StorageError",name:"machinable.errors",path:"machinable.errors.StorageError",parents:["MachinableError"],doc:`Storage error

Bases: MachinableError`,file:"src/machinable/errors.py"},"machinable.errors":{kind:"module",name:"machinable.errors",path:"machinable.errors",doc:null,file:"src/machinable/errors.py"},"machinable.execution.Execution.add":{kind:"routine",realname:"add",name:"machinable.execution",path:"machinable.execution.Execution.add",signature:"(self, executable: machinable.component.Component | list[machinable.component.Component]) -> Self",doc:null},"machinable.execution.Execution.all":{kind:"routine",realname:"all",name:"machinable.execution",path:"machinable.execution.Execution.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.execution.Execution.ancestor":{kind:"routine",realname:null,name:"machinable.execution",path:"machinable.execution.Execution.ancestor",signature:null,doc:null},"machinable.execution.Execution.as_default":{kind:"routine",realname:"as_default",name:"machinable.execution",path:"machinable.execution.Execution.as_default",signature:"(self) -> Self",doc:null},"machinable.execution.Execution.as_json":{kind:"routine",realname:"as_json",name:"machinable.execution",path:"machinable.execution.Execution.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.execution.Execution.cached":{kind:"routine",realname:"cached",name:"machinable.execution",path:"machinable.execution.Execution.cached",signature:"(self)",doc:null},"machinable.execution.Execution.canonicalize_resources":{kind:"routine",realname:"canonicalize_resources",name:"machinable.execution",path:"machinable.execution.Execution.canonicalize_resources",signature:"(self, resources: dict) -> dict",doc:null},"machinable.execution.Execution.clone":{kind:"routine",realname:"clone",name:"machinable.execution",path:"machinable.execution.Execution.clone",signature:"(self)",doc:null},"machinable.execution.Execution.collect":{kind:"routine",realname:"collect",name:"machinable.execution",path:"machinable.execution.Execution.collect",signature:null,doc:null},"machinable.execution.Execution.commit":{kind:"routine",realname:"commit",name:"machinable.execution",path:"machinable.execution.Execution.commit",signature:"(self) -> Self",doc:null},"machinable.execution.Execution.component_directory":{kind:"routine",realname:"component_directory",name:"machinable.execution",path:"machinable.execution.Execution.component_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.execution.Execution.compute_context":{kind:"routine",realname:"compute_context",name:"machinable.execution",path:"machinable.execution.Execution.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.execution.Execution.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable.execution",path:"machinable.execution.Execution.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.execution.Execution.computed_resources":{kind:"routine",realname:"computed_resources",name:"machinable.execution",path:"machinable.execution.Execution.computed_resources",signature:"(self, executable: Optional[ForwardRef('Component')] = None) -> dict | None",doc:null},"machinable.execution.Execution.connected":{kind:"routine",realname:"connected",name:"machinable.execution",path:"machinable.execution.Execution.connected",signature:null,doc:null},"machinable.execution.Execution.created_at":{kind:"routine",realname:"created_at",name:"machinable.execution",path:"machinable.execution.Execution.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.execution.Execution.deferred":{kind:"routine",realname:"deferred",name:"machinable.execution",path:"machinable.execution.Execution.deferred",signature:"(self, defer: bool = True)",doc:null},"machinable.execution.Execution.derive":{kind:"routine",realname:"derive",name:"machinable.execution",path:"machinable.execution.Execution.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.execution.Execution.derived":{kind:"routine",realname:null,name:"machinable.execution",path:"machinable.execution.Execution.derived",signature:null,doc:null},"machinable.execution.Execution.dispatch":{kind:"routine",realname:"dispatch",name:"machinable.execution",path:"machinable.execution.Execution.dispatch",signature:"(self) -> Self",doc:null},"machinable.execution.Execution.executable":{kind:"routine",realname:"executable",name:"machinable.execution",path:"machinable.execution.Execution.executable",signature:"(self, executable: machinable.component.Component | None = None) -> machinable.component.Component | None",doc:null},"machinable.execution.Execution.executables":{kind:"routine",realname:null,name:"machinable.execution",path:"machinable.execution.Execution.executables",signature:null,doc:null},"machinable.execution.Execution.fetch":{kind:"routine",realname:"fetch",name:"machinable.execution",path:"machinable.execution.Execution.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.execution.Execution.find":{kind:"routine",realname:"find",name:"machinable.execution",path:"machinable.execution.Execution.find",signature:null,doc:null},"machinable.execution.Execution.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable.execution",path:"machinable.execution.Execution.find_by_hash",signature:null,doc:null},"machinable.execution.Execution.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable.execution",path:"machinable.execution.Execution.find_by_id",signature:null,doc:null},"machinable.execution.Execution.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable.execution",path:"machinable.execution.Execution.find_many_by_id",signature:null,doc:null},"machinable.execution.Execution.finished_at":{kind:"routine",realname:"finished_at",name:"machinable.execution",path:"machinable.execution.Execution.finished_at",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"Returns the finishing time"},"machinable.execution.Execution.from_directory":{kind:"routine",realname:"from_directory",name:"machinable.execution",path:"machinable.execution.Execution.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.execution.Execution.from_json":{kind:"routine",realname:"from_json",name:"machinable.execution",path:"machinable.execution.Execution.from_json",signature:null,doc:null},"machinable.execution.Execution.from_model":{kind:"routine",realname:"from_model",name:"machinable.execution",path:"machinable.execution.Execution.from_model",signature:null,doc:null},"machinable.execution.Execution.future":{kind:"routine",realname:"future",name:"machinable.execution",path:"machinable.execution.Execution.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.execution.Execution.get":{kind:"routine",realname:"get",name:"machinable.execution",path:"machinable.execution.Execution.get",signature:null,doc:null},"machinable.execution.Execution.heartbeat_at":{kind:"routine",realname:"heartbeat_at",name:"machinable.execution",path:"machinable.execution.Execution.heartbeat_at",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"Returns the last heartbeat time"},"machinable.execution.Execution.hidden":{kind:"routine",realname:"hidden",name:"machinable.execution",path:"machinable.execution.Execution.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.execution.Execution.instance":{kind:"routine",realname:"instance",name:"machinable.execution",path:"machinable.execution.Execution.instance",signature:null,doc:null},"machinable.execution.Execution.is_active":{kind:"routine",realname:"is_active",name:"machinable.execution",path:"machinable.execution.Execution.is_active",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if not finished and last heartbeat occurred less than 30 seconds ago"},"machinable.execution.Execution.is_committed":{kind:"routine",realname:"is_committed",name:"machinable.execution",path:"machinable.execution.Execution.is_committed",signature:"(self) -> bool",doc:null},"machinable.execution.Execution.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.execution",path:"machinable.execution.Execution.is_connected",signature:null,doc:null},"machinable.execution.Execution.is_finished":{kind:"routine",realname:"is_finished",name:"machinable.execution",path:"machinable.execution.Execution.is_finished",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if finishing time has been written"},"machinable.execution.Execution.is_incomplete":{kind:"routine",realname:"is_incomplete",name:"machinable.execution",path:"machinable.execution.Execution.is_incomplete",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"Shorthand for is_started() and not is_live()"},"machinable.execution.Execution.is_live":{kind:"routine",realname:"is_live",name:"machinable.execution",path:"machinable.execution.Execution.is_live",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if active or finished"},"machinable.execution.Execution.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable.execution",path:"machinable.execution.Execution.is_mounted",signature:"(self) -> bool",doc:null},"machinable.execution.Execution.is_resumed":{kind:"routine",realname:"is_resumed",name:"machinable.execution",path:"machinable.execution.Execution.is_resumed",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if resumed time has been written"},"machinable.execution.Execution.is_staged":{kind:"routine",realname:"is_staged",name:"machinable.execution",path:"machinable.execution.Execution.is_staged",signature:"(self) -> bool",doc:null},"machinable.execution.Execution.is_started":{kind:"routine",realname:"is_started",name:"machinable.execution",path:"machinable.execution.Execution.is_started",signature:"(self, executable: Optional[ForwardRef('Component')] = None)",doc:"True if starting time has been written"},"machinable.execution.Execution.launch":{kind:"routine",realname:"launch",name:"machinable.execution",path:"machinable.execution.Execution.launch",signature:"(self) -> Self",doc:null},"machinable.execution.Execution.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable.execution",path:"machinable.execution.Execution.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.execution.Execution.load_file":{kind:"routine",realname:"load_file",name:"machinable.execution",path:"machinable.execution.Execution.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.execution.Execution.local_directory":{kind:"routine",realname:"local_directory",name:"machinable.execution",path:"machinable.execution.Execution.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.execution.Execution.make":{kind:"routine",realname:"make",name:"machinable.execution",path:"machinable.execution.Execution.make",signature:null,doc:null},"machinable.execution.Execution.matches":{kind:"routine",realname:"matches",name:"machinable.execution",path:"machinable.execution.Execution.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.execution.Execution.model":{kind:"routine",realname:"model",name:"machinable.execution",path:"machinable.execution.Execution.model",signature:null,doc:null},"machinable.execution.Execution.new":{kind:"routine",realname:"new",name:"machinable.execution",path:"machinable.execution.Execution.new",signature:"(self) -> Self",doc:null},"machinable.execution.Execution.of":{kind:"routine",realname:"of",name:"machinable.execution",path:"machinable.execution.Execution.of",signature:"(self, executable: None | machinable.component.Component) -> Self",doc:null},"machinable.execution.Execution.on_add":{kind:"routine",realname:"on_add",name:"machinable.execution",path:"machinable.execution.Execution.on_add",signature:"(self, executable: machinable.component.Component)",doc:"Event when executable is added"},"machinable.execution.Execution.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable.execution",path:"machinable.execution.Execution.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.execution.Execution.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable.execution",path:"machinable.execution.Execution.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.execution.Execution.on_after_dispatch":{kind:"routine",realname:"on_after_dispatch",name:"machinable.execution",path:"machinable.execution.Execution.on_after_dispatch",signature:"(self) -> None",doc:"Event triggered after the dispatch of an execution"},"machinable.execution.Execution.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable.execution",path:"machinable.execution.Execution.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.execution.Execution.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable.execution",path:"machinable.execution.Execution.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.execution.Execution.on_before_dispatch":{kind:"routine",realname:"on_before_dispatch",name:"machinable.execution",path:"machinable.execution.Execution.on_before_dispatch",signature:"(self) -> bool | None",doc:`Event triggered before dispatch of an execution

Return False to prevent the dispatch`},"machinable.execution.Execution.on_commit":{kind:"routine",realname:"on_commit",name:"machinable.execution",path:"machinable.execution.Execution.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.execution.Execution.on_compute_default_resources":{kind:"routine",realname:"on_compute_default_resources",name:"machinable.execution",path:"machinable.execution.Execution.on_compute_default_resources",signature:"(self, executable: 'Component') -> dict | None",doc:"Event triggered to compute default resources"},"machinable.execution.Execution.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable.execution",path:"machinable.execution.Execution.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.execution.Execution.on_configure":{kind:"routine",realname:"on_configure",name:"machinable.execution",path:"machinable.execution.Execution.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.execution.Execution.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable.execution",path:"machinable.execution.Execution.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.execution.Execution.on_verify_schedule":{kind:"routine",realname:"on_verify_schedule",name:"machinable.execution",path:"machinable.execution.Execution.on_verify_schedule",signature:"(self) -> bool",doc:"Event to verify compatibility of the schedule"},"machinable.execution.Execution.output":{kind:"routine",realname:"output",name:"machinable.execution",path:"machinable.execution.Execution.output",signature:"(self, executable: Optional[ForwardRef('Component')] = None, incremental: bool = False) -> str | None",doc:"Returns the output log"},"machinable.execution.Execution.output_filepath":{kind:"routine",realname:"output_filepath",name:"machinable.execution",path:"machinable.execution.Execution.output_filepath",signature:"(self, executable: Optional[ForwardRef('Component')] = None) -> str",doc:null},"machinable.execution.Execution.project":{kind:"routine",realname:null,name:"machinable.execution",path:"machinable.execution.Execution.project",signature:null,doc:null},"machinable.execution.Execution.push_related":{kind:"routine",realname:"push_related",name:"machinable.execution",path:"machinable.execution.Execution.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.execution.Execution.related":{kind:"routine",realname:"related",name:"machinable.execution",path:"machinable.execution.Execution.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.execution.Execution.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable.execution",path:"machinable.execution.Execution.related_iterator",signature:"(self)",doc:null},"machinable.execution.Execution.resumed_at":{kind:"routine",realname:"resumed_at",name:"machinable.execution",path:"machinable.execution.Execution.resumed_at",signature:"(self, executable: Optional[ForwardRef('Component')] = None) -> arrow.arrow.Arrow | None",doc:"Returns the resumed time"},"machinable.execution.Execution.retrieve_status":{kind:"routine",realname:"retrieve_status",name:"machinable.execution",path:"machinable.execution.Execution.retrieve_status",signature:"(self, executable: Optional[ForwardRef('Component')] = None, status: Literal['started', 'heartbeat', 'finished', 'resumed'] = 'heartbeat') -> arrow.arrow.Arrow | None",doc:null},"machinable.execution.Execution.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable.execution",path:"machinable.execution.Execution.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.execution.Execution.save_file":{kind:"routine",realname:"save_file",name:"machinable.execution",path:"machinable.execution.Execution.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.execution.Execution.schedule":{kind:"routine",realname:null,name:"machinable.execution",path:"machinable.execution.Execution.schedule",signature:null,doc:null},"machinable.execution.Execution.serialize":{kind:"routine",realname:"serialize",name:"machinable.execution",path:"machinable.execution.Execution.serialize",signature:"(self) -> dict",doc:null},"machinable.execution.Execution.set_default":{kind:"routine",realname:"set_default",name:"machinable.execution",path:"machinable.execution.Execution.set_default",signature:null,doc:null},"machinable.execution.Execution.set_model":{kind:"routine",realname:"set_model",name:"machinable.execution",path:"machinable.execution.Execution.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.execution.Execution.singleton":{kind:"routine",realname:"singleton",name:"machinable.execution",path:"machinable.execution.Execution.singleton",signature:null,doc:null},"machinable.execution.Execution.stage":{kind:"routine",realname:"stage",name:"machinable.execution",path:"machinable.execution.Execution.stage",signature:"(self) -> Self",doc:null},"machinable.execution.Execution.started_at":{kind:"routine",realname:"started_at",name:"machinable.execution",path:"machinable.execution.Execution.started_at",signature:"(self, executable: Optional[ForwardRef('Component')] = None) -> arrow.arrow.Arrow | None",doc:"Returns the starting time"},"machinable.execution.Execution.stream_output":{kind:"routine",realname:"stream_output",name:"machinable.execution",path:"machinable.execution.Execution.stream_output",signature:"(self, executable: Optional[ForwardRef('Component')] = None, refresh_every: int | float = 1, stream=<built-in function print>)",doc:null},"machinable.execution.Execution.to_cli":{kind:"routine",realname:"to_cli",name:"machinable.execution",path:"machinable.execution.Execution.to_cli",signature:"(self) -> str",doc:null},"machinable.execution.Execution.to_directory":{kind:"routine",realname:"to_directory",name:"machinable.execution",path:"machinable.execution.Execution.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.execution.Execution.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.execution",path:"machinable.execution.Execution.unserialize",signature:null,doc:null},"machinable.execution.Execution.update_status":{kind:"routine",realname:"update_status",name:"machinable.execution",path:"machinable.execution.Execution.update_status",signature:"(self, executable: Optional[ForwardRef('Component')] = None, status: Literal['started', 'heartbeat', 'finished', 'resumed'] = 'heartbeat', timestamp: float | int | arrow.arrow.Arrow | None = None) -> float | int | arrow.arrow.Arrow",doc:null},"machinable.execution.Execution.used_by":{kind:"routine",realname:null,name:"machinable.execution",path:"machinable.execution.Execution.used_by",signature:null,doc:null},"machinable.execution.Execution.uses":{kind:"routine",realname:null,name:"machinable.execution",path:"machinable.execution.Execution.uses",signature:null,doc:null},"machinable.execution.Execution.version":{kind:"routine",realname:"version",name:"machinable.execution",path:"machinable.execution.Execution.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.execution.Execution":{kind:"class",realname:"Execution",name:"machinable.execution",path:"machinable.execution.Execution",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/execution.py"},"machinable.execution":{kind:"module",name:"machinable.execution",path:"machinable.execution",doc:null,file:"src/machinable/execution.py"},"machinable.index.Index.all":{kind:"routine",realname:"all",name:"machinable.index",path:"machinable.index.Index.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.index.Index.ancestor":{kind:"routine",realname:null,name:"machinable.index",path:"machinable.index.Index.ancestor",signature:null,doc:null},"machinable.index.Index.as_default":{kind:"routine",realname:"as_default",name:"machinable.index",path:"machinable.index.Index.as_default",signature:"(self) -> Self",doc:null},"machinable.index.Index.as_json":{kind:"routine",realname:"as_json",name:"machinable.index",path:"machinable.index.Index.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.index.Index.cached":{kind:"routine",realname:"cached",name:"machinable.index",path:"machinable.index.Index.cached",signature:"(self)",doc:null},"machinable.index.Index.clone":{kind:"routine",realname:"clone",name:"machinable.index",path:"machinable.index.Index.clone",signature:"(self)",doc:null},"machinable.index.Index.collect":{kind:"routine",realname:"collect",name:"machinable.index",path:"machinable.index.Index.collect",signature:null,doc:null},"machinable.index.Index.commit":{kind:"routine",realname:"commit",name:"machinable.index",path:"machinable.index.Index.commit",signature:"(self, model: machinable.schema.Interface) -> bool",doc:null},"machinable.index.Index.compute_context":{kind:"routine",realname:"compute_context",name:"machinable.index",path:"machinable.index.Index.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.index.Index.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable.index",path:"machinable.index.Index.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.index.Index.config_in_directory":{kind:"routine",realname:"config_in_directory",name:"machinable.index",path:"machinable.index.Index.config_in_directory",signature:"(self, relative_path: str) -> str",doc:null},"machinable.index.Index.connected":{kind:"routine",realname:"connected",name:"machinable.index",path:"machinable.index.Index.connected",signature:null,doc:null},"machinable.index.Index.create_relation":{kind:"routine",realname:"create_relation",name:"machinable.index",path:"machinable.index.Index.create_relation",signature:"(self, relation: str, uuid: str, related_uuid: str | list[str], priority: int = 0, timestamp: int | None = None) -> None",doc:null},"machinable.index.Index.created_at":{kind:"routine",realname:"created_at",name:"machinable.index",path:"machinable.index.Index.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.index.Index.derive":{kind:"routine",realname:"derive",name:"machinable.index",path:"machinable.index.Index.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.index.Index.derived":{kind:"routine",realname:null,name:"machinable.index",path:"machinable.index.Index.derived",signature:null,doc:null},"machinable.index.Index.fetch":{kind:"routine",realname:"fetch",name:"machinable.index",path:"machinable.index.Index.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.index.Index.find":{kind:"routine",realname:"find",name:"machinable.index",path:"machinable.index.Index.find",signature:"(self, interface: machinable.schema.Interface | machinable.interface.Interface, by: Literal['id', 'uuid', 'hash'] = 'hash') -> list[machinable.schema.Interface]",doc:null},"machinable.index.Index.find_by_context":{kind:"routine",realname:"find_by_context",name:"machinable.index",path:"machinable.index.Index.find_by_context",signature:"(self, context: dict) -> list[machinable.schema.Interface]",doc:null},"machinable.index.Index.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable.index",path:"machinable.index.Index.find_by_hash",signature:"(self, context_hash: str) -> list[machinable.schema.Interface]",doc:null},"machinable.index.Index.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable.index",path:"machinable.index.Index.find_by_id",signature:"(self, uuid: str) -> machinable.schema.Interface | None",doc:null},"machinable.index.Index.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable.index",path:"machinable.index.Index.find_many_by_id",signature:null,doc:null},"machinable.index.Index.find_related":{kind:"routine",realname:"find_related",name:"machinable.index",path:"machinable.index.Index.find_related",signature:"(self, relation: str, uuid: str, inverse: bool = False) -> None | list[machinable.schema.Interface]",doc:null},"machinable.index.Index.from_directory":{kind:"routine",realname:"from_directory",name:"machinable.index",path:"machinable.index.Index.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.index.Index.from_json":{kind:"routine",realname:"from_json",name:"machinable.index",path:"machinable.index.Index.from_json",signature:null,doc:null},"machinable.index.Index.from_model":{kind:"routine",realname:"from_model",name:"machinable.index",path:"machinable.index.Index.from_model",signature:null,doc:null},"machinable.index.Index.future":{kind:"routine",realname:"future",name:"machinable.index",path:"machinable.index.Index.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.index.Index.get":{kind:"routine",realname:"get",name:"machinable.index",path:"machinable.index.Index.get",signature:null,doc:null},"machinable.index.Index.hidden":{kind:"routine",realname:"hidden",name:"machinable.index",path:"machinable.index.Index.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.index.Index.import_directory":{kind:"routine",realname:"import_directory",name:"machinable.index",path:"machinable.index.Index.import_directory",signature:"(self, directory: str, relations: bool = True, file_importer: collections.abc.Callable[[str, str], None] = functools.partial(<function copytree at 0x7fcadf316520>, symlinks=True))",doc:null},"machinable.index.Index.instance":{kind:"routine",realname:"instance",name:"machinable.index",path:"machinable.index.Index.instance",signature:null,doc:null},"machinable.index.Index.is_committed":{kind:"routine",realname:"is_committed",name:"machinable.index",path:"machinable.index.Index.is_committed",signature:"(self) -> bool",doc:null},"machinable.index.Index.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.index",path:"machinable.index.Index.is_connected",signature:null,doc:null},"machinable.index.Index.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable.index",path:"machinable.index.Index.is_mounted",signature:"(self) -> bool",doc:null},"machinable.index.Index.is_staged":{kind:"routine",realname:"is_staged",name:"machinable.index",path:"machinable.index.Index.is_staged",signature:"(self) -> bool",doc:null},"machinable.index.Index.launch":{kind:"routine",realname:"launch",name:"machinable.index",path:"machinable.index.Index.launch",signature:"(self) -> Self",doc:null},"machinable.index.Index.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable.index",path:"machinable.index.Index.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.index.Index.load_file":{kind:"routine",realname:"load_file",name:"machinable.index",path:"machinable.index.Index.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.index.Index.local_directory":{kind:"routine",realname:"local_directory",name:"machinable.index",path:"machinable.index.Index.local_directory",signature:"(self, uuid: str, *append: str) -> str",doc:null},"machinable.index.Index.make":{kind:"routine",realname:"make",name:"machinable.index",path:"machinable.index.Index.make",signature:null,doc:null},"machinable.index.Index.matches":{kind:"routine",realname:"matches",name:"machinable.index",path:"machinable.index.Index.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.index.Index.model":{kind:"routine",realname:"model",name:"machinable.index",path:"machinable.index.Index.model",signature:null,doc:null},"machinable.index.Index.new":{kind:"routine",realname:"new",name:"machinable.index",path:"machinable.index.Index.new",signature:"(self) -> Self",doc:null},"machinable.index.Index.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable.index",path:"machinable.index.Index.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.index.Index.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable.index",path:"machinable.index.Index.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.index.Index.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable.index",path:"machinable.index.Index.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.index.Index.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable.index",path:"machinable.index.Index.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.index.Index.on_commit":{kind:"routine",realname:"on_commit",name:"machinable.index",path:"machinable.index.Index.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.index.Index.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable.index",path:"machinable.index.Index.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.index.Index.on_configure":{kind:"routine",realname:"on_configure",name:"machinable.index",path:"machinable.index.Index.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.index.Index.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable.index",path:"machinable.index.Index.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.index.Index.project":{kind:"routine",realname:null,name:"machinable.index",path:"machinable.index.Index.project",signature:null,doc:null},"machinable.index.Index.push_related":{kind:"routine",realname:"push_related",name:"machinable.index",path:"machinable.index.Index.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.index.Index.related":{kind:"routine",realname:"related",name:"machinable.index",path:"machinable.index.Index.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.index.Index.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable.index",path:"machinable.index.Index.related_iterator",signature:"(self)",doc:null},"machinable.index.Index.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable.index",path:"machinable.index.Index.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.index.Index.save_file":{kind:"routine",realname:"save_file",name:"machinable.index",path:"machinable.index.Index.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.index.Index.serialize":{kind:"routine",realname:"serialize",name:"machinable.index",path:"machinable.index.Index.serialize",signature:"(self) -> dict",doc:null},"machinable.index.Index.set_default":{kind:"routine",realname:"set_default",name:"machinable.index",path:"machinable.index.Index.set_default",signature:null,doc:null},"machinable.index.Index.set_model":{kind:"routine",realname:"set_model",name:"machinable.index",path:"machinable.index.Index.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.index.Index.singleton":{kind:"routine",realname:"singleton",name:"machinable.index",path:"machinable.index.Index.singleton",signature:null,doc:null},"machinable.index.Index.stage":{kind:"routine",realname:"stage",name:"machinable.index",path:"machinable.index.Index.stage",signature:"(self) -> Self",doc:null},"machinable.index.Index.to_cli":{kind:"routine",realname:"to_cli",name:"machinable.index",path:"machinable.index.Index.to_cli",signature:"(self) -> str",doc:null},"machinable.index.Index.to_directory":{kind:"routine",realname:"to_directory",name:"machinable.index",path:"machinable.index.Index.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.index.Index.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.index",path:"machinable.index.Index.unserialize",signature:null,doc:null},"machinable.index.Index.used_by":{kind:"routine",realname:null,name:"machinable.index",path:"machinable.index.Index.used_by",signature:null,doc:null},"machinable.index.Index.uses":{kind:"routine",realname:null,name:"machinable.index",path:"machinable.index.Index.uses",signature:null,doc:null},"machinable.index.Index.version":{kind:"routine",realname:"version",name:"machinable.index",path:"machinable.index.Index.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.index.Index":{kind:"class",realname:"Index",name:"machinable.index",path:"machinable.index.Index",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/index.py"},"machinable.index.db":{kind:"routine",realname:"db",name:"machinable.index",path:"machinable.index.db",signature:"(database: str, create=False) -> sqlite3.Connection | None",doc:null},"machinable.index.interface_row_factory":{kind:"routine",realname:"interface_row_factory",name:"machinable.index",path:"machinable.index.interface_row_factory",signature:"(row) -> machinable.schema.Interface",doc:null},"machinable.index.load":{kind:"routine",realname:"load",name:"machinable.index",path:"machinable.index.load",signature:"(database: str, create=False) -> sqlite3.Connection",doc:null},"machinable.index.migrate":{kind:"routine",realname:"migrate",name:"machinable.index",path:"machinable.index.migrate",signature:"(db: sqlite3.Connection) -> None",doc:null},"machinable.index":{kind:"module",name:"machinable.index",path:"machinable.index",doc:null,file:"src/machinable/index.py"},"machinable.interface.BelongsTo.collect":{kind:"routine",realname:"collect",name:"machinable.interface",path:"machinable.interface.BelongsTo.collect",signature:"(self, elements: list['Interface']) -> machinable.collection.Collection",doc:null},"machinable.interface.BelongsTo":{kind:"class",realname:"BelongsTo",name:"machinable.interface",path:"machinable.interface.BelongsTo",parents:["Relation"],doc:null,file:"src/machinable/interface.py"},"machinable.interface.BelongsToMany.collect":{kind:"routine",realname:"collect",name:"machinable.interface",path:"machinable.interface.BelongsToMany.collect",signature:"(self, elements: list['Interface']) -> machinable.collection.Collection",doc:null},"machinable.interface.BelongsToMany":{kind:"class",realname:"BelongsToMany",name:"machinable.interface",path:"machinable.interface.BelongsToMany",parents:["Relation"],doc:null,file:"src/machinable/interface.py"},"machinable.interface.HasMany.collect":{kind:"routine",realname:"collect",name:"machinable.interface",path:"machinable.interface.HasMany.collect",signature:"(self, elements: list['Interface']) -> machinable.collection.Collection",doc:null},"machinable.interface.HasMany":{kind:"class",realname:"HasMany",name:"machinable.interface",path:"machinable.interface.HasMany",parents:["Relation"],doc:null,file:"src/machinable/interface.py"},"machinable.interface.HasOne.collect":{kind:"routine",realname:"collect",name:"machinable.interface",path:"machinable.interface.HasOne.collect",signature:"(self, elements: list['Interface']) -> machinable.collection.Collection",doc:null},"machinable.interface.HasOne":{kind:"class",realname:"HasOne",name:"machinable.interface",path:"machinable.interface.HasOne",parents:["Relation"],doc:null,file:"src/machinable/interface.py"},"machinable.interface.Interface.all":{kind:"routine",realname:"all",name:"machinable.interface",path:"machinable.interface.Interface.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.interface.Interface.ancestor":{kind:"routine",realname:null,name:"machinable.interface",path:"machinable.interface.Interface.ancestor",signature:null,doc:null},"machinable.interface.Interface.as_default":{kind:"routine",realname:"as_default",name:"machinable.interface",path:"machinable.interface.Interface.as_default",signature:"(self) -> Self",doc:null},"machinable.interface.Interface.as_json":{kind:"routine",realname:"as_json",name:"machinable.interface",path:"machinable.interface.Interface.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.interface.Interface.cached":{kind:"routine",realname:"cached",name:"machinable.interface",path:"machinable.interface.Interface.cached",signature:"(self)",doc:null},"machinable.interface.Interface.clone":{kind:"routine",realname:"clone",name:"machinable.interface",path:"machinable.interface.Interface.clone",signature:"(self)",doc:null},"machinable.interface.Interface.collect":{kind:"routine",realname:"collect",name:"machinable.interface",path:"machinable.interface.Interface.collect",signature:null,doc:null},"machinable.interface.Interface.commit":{kind:"routine",realname:"commit",name:"machinable.interface",path:"machinable.interface.Interface.commit",signature:"(self) -> Self",doc:null},"machinable.interface.Interface.compute_context":{kind:"routine",realname:"compute_context",name:"machinable.interface",path:"machinable.interface.Interface.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.interface.Interface.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable.interface",path:"machinable.interface.Interface.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.interface.Interface.connected":{kind:"routine",realname:"connected",name:"machinable.interface",path:"machinable.interface.Interface.connected",signature:null,doc:null},"machinable.interface.Interface.created_at":{kind:"routine",realname:"created_at",name:"machinable.interface",path:"machinable.interface.Interface.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.interface.Interface.derive":{kind:"routine",realname:"derive",name:"machinable.interface",path:"machinable.interface.Interface.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.interface.Interface.derived":{kind:"routine",realname:null,name:"machinable.interface",path:"machinable.interface.Interface.derived",signature:null,doc:null},"machinable.interface.Interface.fetch":{kind:"routine",realname:"fetch",name:"machinable.interface",path:"machinable.interface.Interface.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.interface.Interface.find":{kind:"routine",realname:"find",name:"machinable.interface",path:"machinable.interface.Interface.find",signature:null,doc:null},"machinable.interface.Interface.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable.interface",path:"machinable.interface.Interface.find_by_hash",signature:null,doc:null},"machinable.interface.Interface.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable.interface",path:"machinable.interface.Interface.find_by_id",signature:null,doc:null},"machinable.interface.Interface.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable.interface",path:"machinable.interface.Interface.find_many_by_id",signature:null,doc:null},"machinable.interface.Interface.from_directory":{kind:"routine",realname:"from_directory",name:"machinable.interface",path:"machinable.interface.Interface.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.interface.Interface.from_json":{kind:"routine",realname:"from_json",name:"machinable.interface",path:"machinable.interface.Interface.from_json",signature:null,doc:null},"machinable.interface.Interface.from_model":{kind:"routine",realname:"from_model",name:"machinable.interface",path:"machinable.interface.Interface.from_model",signature:null,doc:null},"machinable.interface.Interface.future":{kind:"routine",realname:"future",name:"machinable.interface",path:"machinable.interface.Interface.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.interface.Interface.get":{kind:"routine",realname:"get",name:"machinable.interface",path:"machinable.interface.Interface.get",signature:null,doc:null},"machinable.interface.Interface.hidden":{kind:"routine",realname:"hidden",name:"machinable.interface",path:"machinable.interface.Interface.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.interface.Interface.instance":{kind:"routine",realname:"instance",name:"machinable.interface",path:"machinable.interface.Interface.instance",signature:null,doc:null},"machinable.interface.Interface.is_committed":{kind:"routine",realname:"is_committed",name:"machinable.interface",path:"machinable.interface.Interface.is_committed",signature:"(self) -> bool",doc:null},"machinable.interface.Interface.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.interface",path:"machinable.interface.Interface.is_connected",signature:null,doc:null},"machinable.interface.Interface.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable.interface",path:"machinable.interface.Interface.is_mounted",signature:"(self) -> bool",doc:null},"machinable.interface.Interface.is_staged":{kind:"routine",realname:"is_staged",name:"machinable.interface",path:"machinable.interface.Interface.is_staged",signature:"(self) -> bool",doc:null},"machinable.interface.Interface.launch":{kind:"routine",realname:"launch",name:"machinable.interface",path:"machinable.interface.Interface.launch",signature:"(self) -> Self",doc:null},"machinable.interface.Interface.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable.interface",path:"machinable.interface.Interface.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.interface.Interface.load_file":{kind:"routine",realname:"load_file",name:"machinable.interface",path:"machinable.interface.Interface.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.interface.Interface.local_directory":{kind:"routine",realname:"local_directory",name:"machinable.interface",path:"machinable.interface.Interface.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.interface.Interface.make":{kind:"routine",realname:"make",name:"machinable.interface",path:"machinable.interface.Interface.make",signature:null,doc:null},"machinable.interface.Interface.matches":{kind:"routine",realname:"matches",name:"machinable.interface",path:"machinable.interface.Interface.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.interface.Interface.model":{kind:"routine",realname:"model",name:"machinable.interface",path:"machinable.interface.Interface.model",signature:null,doc:null},"machinable.interface.Interface.new":{kind:"routine",realname:"new",name:"machinable.interface",path:"machinable.interface.Interface.new",signature:"(self) -> Self",doc:null},"machinable.interface.Interface.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable.interface",path:"machinable.interface.Interface.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.interface.Interface.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable.interface",path:"machinable.interface.Interface.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.interface.Interface.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable.interface",path:"machinable.interface.Interface.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.interface.Interface.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable.interface",path:"machinable.interface.Interface.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.interface.Interface.on_commit":{kind:"routine",realname:"on_commit",name:"machinable.interface",path:"machinable.interface.Interface.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.interface.Interface.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable.interface",path:"machinable.interface.Interface.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.interface.Interface.on_configure":{kind:"routine",realname:"on_configure",name:"machinable.interface",path:"machinable.interface.Interface.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.interface.Interface.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable.interface",path:"machinable.interface.Interface.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.interface.Interface.project":{kind:"routine",realname:null,name:"machinable.interface",path:"machinable.interface.Interface.project",signature:null,doc:null},"machinable.interface.Interface.push_related":{kind:"routine",realname:"push_related",name:"machinable.interface",path:"machinable.interface.Interface.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.interface.Interface.related":{kind:"routine",realname:"related",name:"machinable.interface",path:"machinable.interface.Interface.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.interface.Interface.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable.interface",path:"machinable.interface.Interface.related_iterator",signature:"(self)",doc:null},"machinable.interface.Interface.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable.interface",path:"machinable.interface.Interface.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.interface.Interface.save_file":{kind:"routine",realname:"save_file",name:"machinable.interface",path:"machinable.interface.Interface.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.interface.Interface.serialize":{kind:"routine",realname:"serialize",name:"machinable.interface",path:"machinable.interface.Interface.serialize",signature:"(self) -> dict",doc:null},"machinable.interface.Interface.set_default":{kind:"routine",realname:"set_default",name:"machinable.interface",path:"machinable.interface.Interface.set_default",signature:null,doc:null},"machinable.interface.Interface.set_model":{kind:"routine",realname:"set_model",name:"machinable.interface",path:"machinable.interface.Interface.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.interface.Interface.singleton":{kind:"routine",realname:"singleton",name:"machinable.interface",path:"machinable.interface.Interface.singleton",signature:null,doc:null},"machinable.interface.Interface.stage":{kind:"routine",realname:"stage",name:"machinable.interface",path:"machinable.interface.Interface.stage",signature:"(self) -> Self",doc:null},"machinable.interface.Interface.to_cli":{kind:"routine",realname:"to_cli",name:"machinable.interface",path:"machinable.interface.Interface.to_cli",signature:"(self) -> str",doc:null},"machinable.interface.Interface.to_directory":{kind:"routine",realname:"to_directory",name:"machinable.interface",path:"machinable.interface.Interface.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.interface.Interface.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.interface",path:"machinable.interface.Interface.unserialize",signature:null,doc:null},"machinable.interface.Interface.used_by":{kind:"routine",realname:null,name:"machinable.interface",path:"machinable.interface.Interface.used_by",signature:null,doc:null},"machinable.interface.Interface.uses":{kind:"routine",realname:null,name:"machinable.interface",path:"machinable.interface.Interface.uses",signature:null,doc:null},"machinable.interface.Interface.version":{kind:"routine",realname:"version",name:"machinable.interface",path:"machinable.interface.Interface.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.interface.Interface":{kind:"class",realname:"Interface",name:"machinable.interface",path:"machinable.interface.Interface",parents:["machinable.element.Element"],doc:"Element baseclass",file:"src/machinable/interface.py"},"machinable.interface.Relation.collect":{kind:"routine",realname:"collect",name:"machinable.interface",path:"machinable.interface.Relation.collect",signature:"(self, elements: list['Interface']) -> machinable.collection.Collection",doc:null},"machinable.interface.Relation":{kind:"class",realname:"Relation",name:"machinable.interface",path:"machinable.interface.Relation",parents:["builtins.object"],doc:null,file:"src/machinable/interface.py"},"machinable.interface.belongs_to":{kind:"routine",realname:"_wrapper",name:"machinable.interface",path:"machinable.interface.belongs_to",signature:"(f: collections.abc.Callable | None = None, *, cached: bool = True, collection: machinable.collection.Collection | None = None, key: str | None = None) -> Any",doc:null},"machinable.interface.belongs_to_many":{kind:"routine",realname:"_wrapper",name:"machinable.interface",path:"machinable.interface.belongs_to_many",signature:"(f: collections.abc.Callable | None = None, *, cached: bool = True, collection: machinable.collection.Collection | None = None, key: str | None = None) -> Any",doc:null},"machinable.interface.cachable":{kind:"routine",realname:"cachable",name:"machinable.interface",path:"machinable.interface.cachable",signature:"(memory: bool = True, file: bool = True, fail_mode: Literal['ignore', 'raise', 'warn'] = 'ignore') -> collections.abc.Callable",doc:null},"machinable.interface.has_many":{kind:"routine",realname:"_wrapper",name:"machinable.interface",path:"machinable.interface.has_many",signature:"(f: collections.abc.Callable | None = None, *, cached: bool = True, collection: machinable.collection.Collection | None = None, key: str | None = None) -> Any",doc:null},"machinable.interface.has_one":{kind:"routine",realname:"_wrapper",name:"machinable.interface",path:"machinable.interface.has_one",signature:"(f: collections.abc.Callable | None = None, *, cached: bool = True, collection: machinable.collection.Collection | None = None, key: str | None = None) -> Any",doc:null},"machinable.interface":{kind:"module",name:"machinable.interface",path:"machinable.interface",doc:null,file:"src/machinable/interface.py"},"machinable.mixin.Mixin":{kind:"class",realname:"Mixin",name:"machinable.mixin",path:"machinable.mixin.Mixin",parents:["builtins.object"],doc:"Mixin base class",file:"src/machinable/mixin.py"},"machinable.mixin.bind":{kind:"class",realname:"bind",name:"machinable.mixin",path:"machinable.mixin.bind",parents:["builtins.object"],doc:`Allows to dynamically extend object instances

# Example
\`\`\`python
class Extension:
    def greet(self):
        # write an extension for Example class
        # note that self refers to the instance we are extending
        print(self.hello)

class Example:
    def __init__(self):
        self.hello = 'hello world'
        # extend dynamically
        self.extension = Mixin(self, Extension, 'extension')

Example().extension.greet()
>>> 'hello world'
\`\`\``,file:"src/machinable/mixin.py"},"machinable.mixin.mixin":{kind:"routine",realname:"mixin",name:"machinable.mixin",path:"machinable.mixin.mixin",signature:"(f: collections.abc.Callable) -> Any",doc:null},"machinable.project.Project.add_to_path":{kind:"routine",realname:"add_to_path",name:"machinable.project",path:"machinable.project.Project.add_to_path",signature:"(self) -> None",doc:null},"machinable.project.Project.all":{kind:"routine",realname:"all",name:"machinable.project",path:"machinable.project.Project.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.project.Project.ancestor":{kind:"routine",realname:null,name:"machinable.project",path:"machinable.project.Project.ancestor",signature:null,doc:null},"machinable.project.Project.as_default":{kind:"routine",realname:"as_default",name:"machinable.project",path:"machinable.project.Project.as_default",signature:"(self) -> Self",doc:null},"machinable.project.Project.as_json":{kind:"routine",realname:"as_json",name:"machinable.project",path:"machinable.project.Project.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.project.Project.cached":{kind:"routine",realname:"cached",name:"machinable.project",path:"machinable.project.Project.cached",signature:"(self)",doc:null},"machinable.project.Project.clone":{kind:"routine",realname:"clone",name:"machinable.project",path:"machinable.project.Project.clone",signature:"(self)",doc:null},"machinable.project.Project.collect":{kind:"routine",realname:"collect",name:"machinable.project",path:"machinable.project.Project.collect",signature:null,doc:null},"machinable.project.Project.commit":{kind:"routine",realname:"commit",name:"machinable.project",path:"machinable.project.Project.commit",signature:"(self) -> Self",doc:null},"machinable.project.Project.compute_context":{kind:"routine",realname:"compute_context",name:"machinable.project",path:"machinable.project.Project.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.project.Project.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable.project",path:"machinable.project.Project.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.project.Project.connected":{kind:"routine",realname:"connected",name:"machinable.project",path:"machinable.project.Project.connected",signature:null,doc:null},"machinable.project.Project.created_at":{kind:"routine",realname:"created_at",name:"machinable.project",path:"machinable.project.Project.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.project.Project.derive":{kind:"routine",realname:"derive",name:"machinable.project",path:"machinable.project.Project.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.project.Project.derived":{kind:"routine",realname:null,name:"machinable.project",path:"machinable.project.Project.derived",signature:null,doc:null},"machinable.project.Project.element":{kind:"routine",realname:"element",name:"machinable.project",path:"machinable.project.Project.element",signature:"(self, module: str | machinable.element.Element, version: str | dict | None | list[str | dict | None] = None, base_class: Any = None, **constructor_kwargs) -> 'Element'",doc:null},"machinable.project.Project.exists":{kind:"routine",realname:"exists",name:"machinable.project",path:"machinable.project.Project.exists",signature:"(self) -> bool",doc:null},"machinable.project.Project.fetch":{kind:"routine",realname:"fetch",name:"machinable.project",path:"machinable.project.Project.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.project.Project.find":{kind:"routine",realname:"find",name:"machinable.project",path:"machinable.project.Project.find",signature:null,doc:null},"machinable.project.Project.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable.project",path:"machinable.project.Project.find_by_hash",signature:null,doc:null},"machinable.project.Project.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable.project",path:"machinable.project.Project.find_by_id",signature:null,doc:null},"machinable.project.Project.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable.project",path:"machinable.project.Project.find_many_by_id",signature:null,doc:null},"machinable.project.Project.from_directory":{kind:"routine",realname:"from_directory",name:"machinable.project",path:"machinable.project.Project.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.project.Project.from_json":{kind:"routine",realname:"from_json",name:"machinable.project",path:"machinable.project.Project.from_json",signature:null,doc:null},"machinable.project.Project.from_model":{kind:"routine",realname:"from_model",name:"machinable.project",path:"machinable.project.Project.from_model",signature:null,doc:null},"machinable.project.Project.future":{kind:"routine",realname:"future",name:"machinable.project",path:"machinable.project.Project.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.project.Project.get":{kind:"routine",realname:"get",name:"machinable.project",path:"machinable.project.Project.get",signature:null,doc:null},"machinable.project.Project.get_code_version":{kind:"routine",realname:"get_code_version",name:"machinable.project",path:"machinable.project.Project.get_code_version",signature:"(self) -> dict",doc:null},"machinable.project.Project.get_diff":{kind:"routine",realname:"get_diff",name:"machinable.project",path:"machinable.project.Project.get_diff",signature:"(self) -> str | None",doc:null},"machinable.project.Project.get_host_info":{kind:"routine",realname:"get_host_info",name:"machinable.project",path:"machinable.project.Project.get_host_info",signature:"(self) -> dict",doc:"Returned dictionary will be recorded as host information"},"machinable.project.Project.get_root":{kind:"routine",realname:"get_root",name:"machinable.project",path:"machinable.project.Project.get_root",signature:"(self) -> 'Project'",doc:null},"machinable.project.Project.get_vendors":{kind:"routine",realname:"get_vendors",name:"machinable.project",path:"machinable.project.Project.get_vendors",signature:"(self) -> list[str]",doc:null},"machinable.project.Project.hidden":{kind:"routine",realname:"hidden",name:"machinable.project",path:"machinable.project.Project.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.project.Project.instance":{kind:"routine",realname:"instance",name:"machinable.project",path:"machinable.project.Project.instance",signature:null,doc:null},"machinable.project.Project.is_committed":{kind:"routine",realname:"is_committed",name:"machinable.project",path:"machinable.project.Project.is_committed",signature:"(self) -> bool",doc:null},"machinable.project.Project.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.project",path:"machinable.project.Project.is_connected",signature:null,doc:null},"machinable.project.Project.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable.project",path:"machinable.project.Project.is_mounted",signature:"(self) -> bool",doc:null},"machinable.project.Project.is_root":{kind:"routine",realname:"is_root",name:"machinable.project",path:"machinable.project.Project.is_root",signature:"(self) -> bool",doc:null},"machinable.project.Project.is_staged":{kind:"routine",realname:"is_staged",name:"machinable.project",path:"machinable.project.Project.is_staged",signature:"(self) -> bool",doc:null},"machinable.project.Project.launch":{kind:"routine",realname:"launch",name:"machinable.project",path:"machinable.project.Project.launch",signature:"(self) -> Self",doc:null},"machinable.project.Project.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable.project",path:"machinable.project.Project.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.project.Project.load_file":{kind:"routine",realname:"load_file",name:"machinable.project",path:"machinable.project.Project.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.project.Project.local_directory":{kind:"routine",realname:"local_directory",name:"machinable.project",path:"machinable.project.Project.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.project.Project.make":{kind:"routine",realname:"make",name:"machinable.project",path:"machinable.project.Project.make",signature:null,doc:null},"machinable.project.Project.matches":{kind:"routine",realname:"matches",name:"machinable.project",path:"machinable.project.Project.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.project.Project.model":{kind:"routine",realname:"model",name:"machinable.project",path:"machinable.project.Project.model",signature:null,doc:null},"machinable.project.Project.name":{kind:"routine",realname:"name",name:"machinable.project",path:"machinable.project.Project.name",signature:"(self) -> str",doc:null},"machinable.project.Project.new":{kind:"routine",realname:"new",name:"machinable.project",path:"machinable.project.Project.new",signature:"(self) -> Self",doc:null},"machinable.project.Project.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable.project",path:"machinable.project.Project.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.project.Project.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable.project",path:"machinable.project.Project.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.project.Project.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable.project",path:"machinable.project.Project.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.project.Project.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable.project",path:"machinable.project.Project.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.project.Project.on_commit":{kind:"routine",realname:"on_commit",name:"machinable.project",path:"machinable.project.Project.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.project.Project.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable.project",path:"machinable.project.Project.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.project.Project.on_configure":{kind:"routine",realname:"on_configure",name:"machinable.project",path:"machinable.project.Project.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.project.Project.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable.project",path:"machinable.project.Project.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.project.Project.on_resolve_element":{kind:"routine",realname:"on_resolve_element",name:"machinable.project",path:"machinable.project.Project.on_resolve_element",signature:"(self, module: str | machinable.element.Element) -> tuple[str | machinable.element.Element, machinable.element.Element | None]",doc:`Override element resolution

Return altered module and/or resolved Element class to be used instead.`},"machinable.project.Project.on_resolve_remotes":{kind:"routine",realname:"on_resolve_remotes",name:"machinable.project",path:"machinable.project.Project.on_resolve_remotes",signature:"(self) -> dict[str, str]",doc:`Event triggered during remote resolution

Return a dictionary of module names and their remote source.`},"machinable.project.Project.on_resolve_vendor":{kind:"routine",realname:"on_resolve_vendor",name:"machinable.project",path:"machinable.project.Project.on_resolve_vendor",signature:"(self, name: str, source: str, target: str) -> bool | None",doc:`Event triggered when vendor is resolved

# Arguments
name: The name of the vendor
source: The source configuration
target: The target directory (may or may not exists yet)

Return False to prevent the default automatic resolution`},"machinable.project.Project.path":{kind:"routine",realname:"path",name:"machinable.project",path:"machinable.project.Project.path",signature:"(self, *append: str) -> str",doc:null},"machinable.project.Project.project":{kind:"routine",realname:null,name:"machinable.project",path:"machinable.project.Project.project",signature:null,doc:null},"machinable.project.Project.provider":{kind:"routine",realname:"provider",name:"machinable.project",path:"machinable.project.Project.provider",signature:"(self, reload: str | bool = False) -> 'Project'",doc:"Resolves and returns the provider instance"},"machinable.project.Project.push_related":{kind:"routine",realname:"push_related",name:"machinable.project",path:"machinable.project.Project.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.project.Project.related":{kind:"routine",realname:"related",name:"machinable.project",path:"machinable.project.Project.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.project.Project.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable.project",path:"machinable.project.Project.related_iterator",signature:"(self)",doc:null},"machinable.project.Project.resolve_remotes":{kind:"routine",realname:"resolve_remotes",name:"machinable.project",path:"machinable.project.Project.resolve_remotes",signature:"(self, module: str) -> machinable.element.Element | None",doc:null},"machinable.project.Project.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable.project",path:"machinable.project.Project.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.project.Project.save_file":{kind:"routine",realname:"save_file",name:"machinable.project",path:"machinable.project.Project.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.project.Project.serialize":{kind:"routine",realname:"serialize",name:"machinable.project",path:"machinable.project.Project.serialize",signature:"(self) -> dict",doc:null},"machinable.project.Project.set_default":{kind:"routine",realname:"set_default",name:"machinable.project",path:"machinable.project.Project.set_default",signature:null,doc:null},"machinable.project.Project.set_model":{kind:"routine",realname:"set_model",name:"machinable.project",path:"machinable.project.Project.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.project.Project.singleton":{kind:"routine",realname:"singleton",name:"machinable.project",path:"machinable.project.Project.singleton",signature:null,doc:null},"machinable.project.Project.stage":{kind:"routine",realname:"stage",name:"machinable.project",path:"machinable.project.Project.stage",signature:"(self) -> Self",doc:null},"machinable.project.Project.to_cli":{kind:"routine",realname:"to_cli",name:"machinable.project",path:"machinable.project.Project.to_cli",signature:"(self) -> str",doc:null},"machinable.project.Project.to_directory":{kind:"routine",realname:"to_directory",name:"machinable.project",path:"machinable.project.Project.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.project.Project.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.project",path:"machinable.project.Project.unserialize",signature:null,doc:null},"machinable.project.Project.used_by":{kind:"routine",realname:null,name:"machinable.project",path:"machinable.project.Project.used_by",signature:null,doc:null},"machinable.project.Project.uses":{kind:"routine",realname:null,name:"machinable.project",path:"machinable.project.Project.uses",signature:null,doc:null},"machinable.project.Project.version":{kind:"routine",realname:"version",name:"machinable.project",path:"machinable.project.Project.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.project.Project":{kind:"class",realname:"Project",name:"machinable.project",path:"machinable.project.Project",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/project.py"},"machinable.project.fetch_directory":{kind:"routine",realname:"fetch_directory",name:"machinable.project",path:"machinable.project.fetch_directory",signature:"(source, target)",doc:null},"machinable.project.fetch_git":{kind:"routine",realname:"fetch_git",name:"machinable.project",path:"machinable.project.fetch_git",signature:"(source: str, target: str) -> bool",doc:null},"machinable.project.fetch_link":{kind:"routine",realname:"fetch_link",name:"machinable.project",path:"machinable.project.fetch_link",signature:"(source, target)",doc:null},"machinable.project.fetch_vendor":{kind:"routine",realname:"fetch_vendor",name:"machinable.project",path:"machinable.project.fetch_vendor",signature:"(source, target)",doc:null},"machinable.project.fetch_vendors":{kind:"routine",realname:"fetch_vendors",name:"machinable.project",path:"machinable.project.fetch_vendors",signature:"(project: 'Project')",doc:null},"machinable.project.import_element":{kind:"routine",realname:"import_element",name:"machinable.project",path:"machinable.project.import_element",signature:"(directory: str, module: str, base_class: Any = None) -> 'Element'",doc:null},"machinable.project":{kind:"module",name:"machinable.project",path:"machinable.project",doc:null,file:"src/machinable/project.py"},"machinable.query.Query.all":{kind:"routine",realname:"all",name:"machinable.query",path:"machinable.query.Query.all",signature:"(self, module: str | machinable.interface.Interface | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> 'InterfaceCollection'",doc:null},"machinable.query.Query.by_id":{kind:"routine",realname:"by_id",name:"machinable.query",path:"machinable.query.Query.by_id",signature:"(self, uuid: str) -> machinable.interface.Interface | None",doc:null},"machinable.query.Query.from_directory":{kind:"routine",realname:"from_directory",name:"machinable.query",path:"machinable.query.Query.from_directory",signature:"(self, directory: str) -> machinable.interface.Interface",doc:null},"machinable.query.Query.new":{kind:"routine",realname:"new",name:"machinable.query",path:"machinable.query.Query.new",signature:"(self, module: str | machinable.interface.Interface | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> machinable.interface.Interface",doc:null},"machinable.query.Query":{kind:"class",realname:"Query",name:"machinable.query",path:"machinable.query.Query",parents:["builtins.object"],doc:null,file:"src/machinable/query.py"},"machinable.query":{kind:"module",name:"machinable.query",path:"machinable.query",doc:null,file:"src/machinable/query.py"},"machinable.schedule.Schedule.all":{kind:"routine",realname:"all",name:"machinable.schedule",path:"machinable.schedule.Schedule.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.schedule.Schedule.ancestor":{kind:"routine",realname:null,name:"machinable.schedule",path:"machinable.schedule.Schedule.ancestor",signature:null,doc:null},"machinable.schedule.Schedule.as_default":{kind:"routine",realname:"as_default",name:"machinable.schedule",path:"machinable.schedule.Schedule.as_default",signature:"(self) -> Self",doc:null},"machinable.schedule.Schedule.as_json":{kind:"routine",realname:"as_json",name:"machinable.schedule",path:"machinable.schedule.Schedule.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.schedule.Schedule.cached":{kind:"routine",realname:"cached",name:"machinable.schedule",path:"machinable.schedule.Schedule.cached",signature:"(self)",doc:null},"machinable.schedule.Schedule.clone":{kind:"routine",realname:"clone",name:"machinable.schedule",path:"machinable.schedule.Schedule.clone",signature:"(self)",doc:null},"machinable.schedule.Schedule.collect":{kind:"routine",realname:"collect",name:"machinable.schedule",path:"machinable.schedule.Schedule.collect",signature:null,doc:null},"machinable.schedule.Schedule.commit":{kind:"routine",realname:"commit",name:"machinable.schedule",path:"machinable.schedule.Schedule.commit",signature:"(self) -> Self",doc:null},"machinable.schedule.Schedule.compute_context":{kind:"routine",realname:"compute_context",name:"machinable.schedule",path:"machinable.schedule.Schedule.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.schedule.Schedule.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable.schedule",path:"machinable.schedule.Schedule.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.schedule.Schedule.connected":{kind:"routine",realname:"connected",name:"machinable.schedule",path:"machinable.schedule.Schedule.connected",signature:null,doc:null},"machinable.schedule.Schedule.created_at":{kind:"routine",realname:"created_at",name:"machinable.schedule",path:"machinable.schedule.Schedule.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.schedule.Schedule.derive":{kind:"routine",realname:"derive",name:"machinable.schedule",path:"machinable.schedule.Schedule.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.schedule.Schedule.derived":{kind:"routine",realname:null,name:"machinable.schedule",path:"machinable.schedule.Schedule.derived",signature:null,doc:null},"machinable.schedule.Schedule.fetch":{kind:"routine",realname:"fetch",name:"machinable.schedule",path:"machinable.schedule.Schedule.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.schedule.Schedule.find":{kind:"routine",realname:"find",name:"machinable.schedule",path:"machinable.schedule.Schedule.find",signature:null,doc:null},"machinable.schedule.Schedule.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable.schedule",path:"machinable.schedule.Schedule.find_by_hash",signature:null,doc:null},"machinable.schedule.Schedule.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable.schedule",path:"machinable.schedule.Schedule.find_by_id",signature:null,doc:null},"machinable.schedule.Schedule.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable.schedule",path:"machinable.schedule.Schedule.find_many_by_id",signature:null,doc:null},"machinable.schedule.Schedule.from_directory":{kind:"routine",realname:"from_directory",name:"machinable.schedule",path:"machinable.schedule.Schedule.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.schedule.Schedule.from_json":{kind:"routine",realname:"from_json",name:"machinable.schedule",path:"machinable.schedule.Schedule.from_json",signature:null,doc:null},"machinable.schedule.Schedule.from_model":{kind:"routine",realname:"from_model",name:"machinable.schedule",path:"machinable.schedule.Schedule.from_model",signature:null,doc:null},"machinable.schedule.Schedule.future":{kind:"routine",realname:"future",name:"machinable.schedule",path:"machinable.schedule.Schedule.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.schedule.Schedule.get":{kind:"routine",realname:"get",name:"machinable.schedule",path:"machinable.schedule.Schedule.get",signature:null,doc:null},"machinable.schedule.Schedule.hidden":{kind:"routine",realname:"hidden",name:"machinable.schedule",path:"machinable.schedule.Schedule.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.schedule.Schedule.instance":{kind:"routine",realname:"instance",name:"machinable.schedule",path:"machinable.schedule.Schedule.instance",signature:null,doc:null},"machinable.schedule.Schedule.is_committed":{kind:"routine",realname:"is_committed",name:"machinable.schedule",path:"machinable.schedule.Schedule.is_committed",signature:"(self) -> bool",doc:null},"machinable.schedule.Schedule.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.schedule",path:"machinable.schedule.Schedule.is_connected",signature:null,doc:null},"machinable.schedule.Schedule.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable.schedule",path:"machinable.schedule.Schedule.is_mounted",signature:"(self) -> bool",doc:null},"machinable.schedule.Schedule.is_staged":{kind:"routine",realname:"is_staged",name:"machinable.schedule",path:"machinable.schedule.Schedule.is_staged",signature:"(self) -> bool",doc:null},"machinable.schedule.Schedule.launch":{kind:"routine",realname:"launch",name:"machinable.schedule",path:"machinable.schedule.Schedule.launch",signature:"(self) -> Self",doc:null},"machinable.schedule.Schedule.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable.schedule",path:"machinable.schedule.Schedule.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.schedule.Schedule.load_file":{kind:"routine",realname:"load_file",name:"machinable.schedule",path:"machinable.schedule.Schedule.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.schedule.Schedule.local_directory":{kind:"routine",realname:"local_directory",name:"machinable.schedule",path:"machinable.schedule.Schedule.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.schedule.Schedule.make":{kind:"routine",realname:"make",name:"machinable.schedule",path:"machinable.schedule.Schedule.make",signature:null,doc:null},"machinable.schedule.Schedule.matches":{kind:"routine",realname:"matches",name:"machinable.schedule",path:"machinable.schedule.Schedule.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.schedule.Schedule.model":{kind:"routine",realname:"model",name:"machinable.schedule",path:"machinable.schedule.Schedule.model",signature:null,doc:null},"machinable.schedule.Schedule.new":{kind:"routine",realname:"new",name:"machinable.schedule",path:"machinable.schedule.Schedule.new",signature:"(self) -> Self",doc:null},"machinable.schedule.Schedule.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable.schedule",path:"machinable.schedule.Schedule.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.schedule.Schedule.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable.schedule",path:"machinable.schedule.Schedule.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.schedule.Schedule.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable.schedule",path:"machinable.schedule.Schedule.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.schedule.Schedule.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable.schedule",path:"machinable.schedule.Schedule.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.schedule.Schedule.on_commit":{kind:"routine",realname:"on_commit",name:"machinable.schedule",path:"machinable.schedule.Schedule.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.schedule.Schedule.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable.schedule",path:"machinable.schedule.Schedule.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.schedule.Schedule.on_configure":{kind:"routine",realname:"on_configure",name:"machinable.schedule",path:"machinable.schedule.Schedule.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.schedule.Schedule.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable.schedule",path:"machinable.schedule.Schedule.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.schedule.Schedule.project":{kind:"routine",realname:null,name:"machinable.schedule",path:"machinable.schedule.Schedule.project",signature:null,doc:null},"machinable.schedule.Schedule.push_related":{kind:"routine",realname:"push_related",name:"machinable.schedule",path:"machinable.schedule.Schedule.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.schedule.Schedule.related":{kind:"routine",realname:"related",name:"machinable.schedule",path:"machinable.schedule.Schedule.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.schedule.Schedule.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable.schedule",path:"machinable.schedule.Schedule.related_iterator",signature:"(self)",doc:null},"machinable.schedule.Schedule.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable.schedule",path:"machinable.schedule.Schedule.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.schedule.Schedule.save_file":{kind:"routine",realname:"save_file",name:"machinable.schedule",path:"machinable.schedule.Schedule.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.schedule.Schedule.serialize":{kind:"routine",realname:"serialize",name:"machinable.schedule",path:"machinable.schedule.Schedule.serialize",signature:"(self) -> dict",doc:null},"machinable.schedule.Schedule.set_default":{kind:"routine",realname:"set_default",name:"machinable.schedule",path:"machinable.schedule.Schedule.set_default",signature:null,doc:null},"machinable.schedule.Schedule.set_model":{kind:"routine",realname:"set_model",name:"machinable.schedule",path:"machinable.schedule.Schedule.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.schedule.Schedule.singleton":{kind:"routine",realname:"singleton",name:"machinable.schedule",path:"machinable.schedule.Schedule.singleton",signature:null,doc:null},"machinable.schedule.Schedule.stage":{kind:"routine",realname:"stage",name:"machinable.schedule",path:"machinable.schedule.Schedule.stage",signature:"(self) -> Self",doc:null},"machinable.schedule.Schedule.to_cli":{kind:"routine",realname:"to_cli",name:"machinable.schedule",path:"machinable.schedule.Schedule.to_cli",signature:"(self) -> str",doc:null},"machinable.schedule.Schedule.to_directory":{kind:"routine",realname:"to_directory",name:"machinable.schedule",path:"machinable.schedule.Schedule.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.schedule.Schedule.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.schedule",path:"machinable.schedule.Schedule.unserialize",signature:null,doc:null},"machinable.schedule.Schedule.used_by":{kind:"routine",realname:null,name:"machinable.schedule",path:"machinable.schedule.Schedule.used_by",signature:null,doc:null},"machinable.schedule.Schedule.uses":{kind:"routine",realname:null,name:"machinable.schedule",path:"machinable.schedule.Schedule.uses",signature:null,doc:null},"machinable.schedule.Schedule.version":{kind:"routine",realname:"version",name:"machinable.schedule",path:"machinable.schedule.Schedule.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.schedule.Schedule":{kind:"class",realname:"Schedule",name:"machinable.schedule",path:"machinable.schedule.Schedule",parents:["machinable.interface.Interface"],doc:"Schedule base class",file:"src/machinable/schedule.py"},"machinable.schedule":{kind:"module",name:"machinable.schedule",path:"machinable.schedule",doc:null,file:"src/machinable/schedule.py"},"machinable.schema.Component.construct":{kind:"routine",realname:"construct",name:"machinable.schema",path:"machinable.schema.Component.construct",signature:null,doc:null},"machinable.schema.Component.copy":{kind:"routine",realname:"copy",name:"machinable.schema",path:"machinable.schema.Component.copy",signature:"(self, *, include: 'AbstractSetIntStr | MappingIntStrAny | None' = None, exclude: 'AbstractSetIntStr | MappingIntStrAny | None' = None, update: 'Dict[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`Returns a copy of the model.

!!! warning "Deprecated"
    This method is now deprecated; use \`model_copy\` instead.

If you need \`include\` or \`exclude\`, use:

\`\`\`python {test="skip" lint="skip"}
data = self.model_dump(include=include, exclude=exclude, round_trip=True)
data = {**data, **(update or {})}
copied = self.model_validate(data)
\`\`\`

Args:
    include: Optional set or mapping specifying which fields to include in the copied model.
    exclude: Optional set or mapping specifying which fields to exclude in the copied model.
    update: Optional dictionary of field-value pairs to override field values in the copied model.
    deep: If True, the values of fields that are Pydantic models will be deep-copied.

Returns:
    A copy of the model with included, excluded and updated fields as specified.`},"machinable.schema.Component.dict":{kind:"routine",realname:"dict",name:"machinable.schema",path:"machinable.schema.Component.dict",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False) -> 'Dict[str, Any]'",doc:null},"machinable.schema.Component.extra":{kind:"routine",realname:"extra",name:"machinable.schema",path:"machinable.schema.Component.extra",signature:"(self) -> dict",doc:null},"machinable.schema.Component.from_orm":{kind:"routine",realname:"from_orm",name:"machinable.schema",path:"machinable.schema.Component.from_orm",signature:null,doc:null},"machinable.schema.Component.json":{kind:"routine",realname:"json",name:"machinable.schema",path:"machinable.schema.Component.json",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, encoder: 'Callable[[Any], Any] | None' = PydanticUndefined, models_as_dict: 'bool' = PydanticUndefined, **dumps_kwargs: 'Any') -> 'str'",doc:null},"machinable.schema.Component.model_construct":{kind:"routine",realname:"model_construct",name:"machinable.schema",path:"machinable.schema.Component.model_construct",signature:null,doc:"Creates a new instance of the `Model` class with validated data.\n\nCreates a new model setting `__dict__` and `__pydantic_fields_set__` from trusted or pre-validated data.\nDefault values are respected, but no other validation is performed.\n\n!!! note\n    `model_construct()` generally respects the `model_config.extra` setting on the provided model.\n    That is, if `model_config.extra == 'allow'`, then all extra passed values are added to the model instance's `__dict__`\n    and `__pydantic_extra__` fields. If `model_config.extra == 'ignore'` (the default), then all extra passed values are ignored.\n    Because no validation is performed with a call to `model_construct()`, having `model_config.extra == 'forbid'` does not result in\n    an error if extra values are passed, but they will be ignored.\n\nArgs:\n    _fields_set: A set of field names that were originally explicitly set during instantiation. If provided,\n        this is directly used for the [`model_fields_set`][pydantic.BaseModel.model_fields_set] attribute.\n        Otherwise, the field names from the `values` argument will be used.\n    values: Trusted or pre-validated data dictionary.\n\nReturns:\n    A new instance of the `Model` class with validated data."},"machinable.schema.Component.model_copy":{kind:"routine",realname:"model_copy",name:"machinable.schema",path:"machinable.schema.Component.model_copy",signature:"(self, *, update: 'Mapping[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`!!! abstract "Usage Documentation"
    [\`model_copy\`](../concepts/models.md#model-copy)

Returns a copy of the model.

!!! note
    The underlying instance's [\`__dict__\`][object.__dict__] attribute is copied. This
    might have unexpected side effects if you store anything in it, on top of the model
    fields (e.g. the value of [cached properties][functools.cached_property]).

Args:
    update: Values to change/add in the new model. Note: the data is not validated
        before creating the new model. You should trust this data.
    deep: Set to \`True\` to make a deep copy of the model.

Returns:
    New model instance.`},"machinable.schema.Component.model_dump":{kind:"routine",realname:"model_dump",name:"machinable.schema",path:"machinable.schema.Component.model_dump",signature:`(self, *, mode: "Literal['json', 'python'] | str" = 'python', include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'dict[str, Any]'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump\`](../concepts/serialization.md#python-mode)

Generate a dictionary representation of the model, optionally specifying which fields to include or exclude.

Args:
    mode: The mode in which \`to_python\` should run.
        If mode is 'json', the output will only contain JSON serializable types.
        If mode is 'python', the output may contain non-JSON-serializable Python objects.
    include: A set of fields to include in the output.
    exclude: A set of fields to exclude from the output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to use the field's alias in the dictionary key if defined.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A dictionary representation of the model.`},"machinable.schema.Component.model_dump_json":{kind:"routine",realname:"model_dump_json",name:"machinable.schema",path:"machinable.schema.Component.model_dump_json",signature:`(self, *, indent: 'int | None' = None, ensure_ascii: 'bool' = False, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'str'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump_json\`](../concepts/serialization.md#json-mode)

Generates a JSON representation of the model using Pydantic's \`to_json\` method.

Args:
    indent: Indentation to use in the JSON output. If None is passed, the output will be compact.
    ensure_ascii: If \`True\`, the output is guaranteed to have all incoming non-ASCII characters escaped.
        If \`False\` (the default), these characters will be output as-is.
    include: Field(s) to include in the JSON output.
    exclude: Field(s) to exclude from the JSON output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to serialize using field aliases.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A JSON string representation of the model.`},"machinable.schema.Component.model_json_schema":{kind:"routine",realname:"model_json_schema",name:"machinable.schema",path:"machinable.schema.Component.model_json_schema",signature:null,doc:"Generates a JSON schema for a model class.\n\nArgs:\n    by_alias: Whether to use attribute aliases or not.\n    ref_template: The reference template.\n    union_format: The format to use when combining schemas from unions together. Can be one of:\n\n        - `'any_of'`: Use the [`anyOf`](https://json-schema.org/understanding-json-schema/reference/combining#anyOf)\n        keyword to combine schemas (the default).\n        - `'primitive_type_array'`: Use the [`type`](https://json-schema.org/understanding-json-schema/reference/type)\n        keyword as an array of strings, containing each type of the combination. If any of the schemas is not a primitive\n        type (`string`, `boolean`, `null`, `integer` or `number`) or contains constraints/metadata, falls back to\n        `any_of`.\n    schema_generator: To override the logic used to generate the JSON schema, as a subclass of\n        `GenerateJsonSchema` with your desired modifications\n    mode: The mode in which to generate the schema.\n\nReturns:\n    The JSON schema for the given model class."},"machinable.schema.Component.model_parametrized_name":{kind:"routine",realname:"model_parametrized_name",name:"machinable.schema",path:"machinable.schema.Component.model_parametrized_name",signature:null,doc:`Compute the class name for parametrizations of generic classes.

This method can be overridden to achieve a custom naming scheme for generic BaseModels.

Args:
    params: Tuple of types of the class. Given a generic class
        \`Model\` with 2 type variables and a concrete model \`Model[str, int]\`,
        the value \`(str, int)\` would be passed to \`params\`.

Returns:
    String representing the new class where \`params\` are passed to \`cls\` as type variables.

Raises:
    TypeError: Raised when trying to generate concrete names for non-generic models.`},"machinable.schema.Component.model_post_init":{kind:"routine",realname:"init_private_attributes",name:"machinable.schema",path:"machinable.schema.Component.model_post_init",signature:"(self: 'BaseModel', context: 'Any', /) -> 'None'",doc:`This function is meant to behave like a BaseModel method to initialise private attributes.

It takes context as an argument since that's what pydantic-core passes when calling it.

Args:
    self: The BaseModel instance.
    context: The context.`},"machinable.schema.Component.model_rebuild":{kind:"routine",realname:"model_rebuild",name:"machinable.schema",path:"machinable.schema.Component.model_rebuild",signature:null,doc:`Try to rebuild the pydantic-core schema for the model.

This may be necessary when one of the annotations is a ForwardRef which could not be resolved during
the initial attempt to build the schema, and automatic rebuilding fails.

Args:
    force: Whether to force the rebuilding of the model schema, defaults to \`False\`.
    raise_errors: Whether to raise errors, defaults to \`True\`.
    _parent_namespace_depth: The depth level of the parent namespace, defaults to 2.
    _types_namespace: The types namespace, defaults to \`None\`.

Returns:
    Returns \`None\` if the schema is already "complete" and rebuilding was not required.
    If rebuilding _was_ required, returns \`True\` if rebuilding was successful, otherwise \`False\`.`},"machinable.schema.Component.model_validate":{kind:"routine",realname:"model_validate",name:"machinable.schema",path:"machinable.schema.Component.model_validate",signature:null,doc:`Validate a pydantic model instance.

Args:
    obj: The object to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    from_attributes: Whether to extract data from object attributes.
    context: Additional context to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Raises:
    ValidationError: If the object could not be validated.

Returns:
    The validated model instance.`},"machinable.schema.Component.model_validate_json":{kind:"routine",realname:"model_validate_json",name:"machinable.schema",path:"machinable.schema.Component.model_validate_json",signature:null,doc:`!!! abstract "Usage Documentation"
    [JSON Parsing](../concepts/json.md#json-parsing)

Validate the given JSON data against the Pydantic model.

Args:
    json_data: The JSON data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.

Raises:
    ValidationError: If \`json_data\` is not a JSON string or the object could not be validated.`},"machinable.schema.Component.model_validate_strings":{kind:"routine",realname:"model_validate_strings",name:"machinable.schema",path:"machinable.schema.Component.model_validate_strings",signature:null,doc:`Validate the given object with string data against the Pydantic model.

Args:
    obj: The object containing string data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.`},"machinable.schema.Component.parse_file":{kind:"routine",realname:"parse_file",name:"machinable.schema",path:"machinable.schema.Component.parse_file",signature:null,doc:null},"machinable.schema.Component.parse_obj":{kind:"routine",realname:"parse_obj",name:"machinable.schema",path:"machinable.schema.Component.parse_obj",signature:null,doc:null},"machinable.schema.Component.parse_raw":{kind:"routine",realname:"parse_raw",name:"machinable.schema",path:"machinable.schema.Component.parse_raw",signature:null,doc:null},"machinable.schema.Component.schema":{kind:"routine",realname:"schema",name:"machinable.schema",path:"machinable.schema.Component.schema",signature:null,doc:null},"machinable.schema.Component.schema_json":{kind:"routine",realname:"schema_json",name:"machinable.schema",path:"machinable.schema.Component.schema_json",signature:null,doc:null},"machinable.schema.Component.update_forward_refs":{kind:"routine",realname:"update_forward_refs",name:"machinable.schema",path:"machinable.schema.Component.update_forward_refs",signature:null,doc:null},"machinable.schema.Component.validate":{kind:"routine",realname:"validate",name:"machinable.schema",path:"machinable.schema.Component.validate",signature:null,doc:null},"machinable.schema.Component":{kind:"class",realname:"Component",name:"machinable.schema",path:"machinable.schema.Component",parents:["Interface"],doc:`!!! abstract "Usage Documentation"
    [Models](../concepts/models.md)

A base class for creating Pydantic models.

Attributes:
    __class_vars__: The names of the class variables defined on the model.
    __private_attributes__: Metadata about the private attributes of the model.
    __signature__: The synthesized \`__init__\` [\`Signature\`][inspect.Signature] of the model.

    __pydantic_complete__: Whether model building is completed, or if there are still undefined fields.
    __pydantic_core_schema__: The core schema of the model.
    __pydantic_custom_init__: Whether the model has a custom \`__init__\` function.
    __pydantic_decorators__: Metadata containing the decorators defined on the model.
        This replaces \`Model.__validators__\` and \`Model.__root_validators__\` from Pydantic V1.
    __pydantic_generic_metadata__: Metadata for generic models; contains data used for a similar purpose to
        __args__, __origin__, __parameters__ in typing-module generics. May eventually be replaced by these.
    __pydantic_parent_namespace__: Parent namespace of the model, used for automatic rebuilding of models.
    __pydantic_post_init__: The name of the post-init method for the model, if defined.
    __pydantic_root_model__: Whether the model is a [\`RootModel\`][pydantic.root_model.RootModel].
    __pydantic_serializer__: The \`pydantic-core\` \`SchemaSerializer\` used to dump instances of the model.
    __pydantic_validator__: The \`pydantic-core\` \`SchemaValidator\` used to validate instances of the model.

    __pydantic_fields__: A dictionary of field names and their corresponding [\`FieldInfo\`][pydantic.fields.FieldInfo] objects.
    __pydantic_computed_fields__: A dictionary of computed field names and their corresponding [\`ComputedFieldInfo\`][pydantic.fields.ComputedFieldInfo] objects.

    __pydantic_extra__: A dictionary containing extra values, if [\`extra\`][pydantic.config.ConfigDict.extra]
        is set to \`'allow'\`.
    __pydantic_fields_set__: The names of fields explicitly set during instantiation.
    __pydantic_private__: Values of private attributes set on the model instance.`,file:"src/machinable/schema.py"},"machinable.schema.Element.construct":{kind:"routine",realname:"construct",name:"machinable.schema",path:"machinable.schema.Element.construct",signature:null,doc:null},"machinable.schema.Element.copy":{kind:"routine",realname:"copy",name:"machinable.schema",path:"machinable.schema.Element.copy",signature:"(self, *, include: 'AbstractSetIntStr | MappingIntStrAny | None' = None, exclude: 'AbstractSetIntStr | MappingIntStrAny | None' = None, update: 'Dict[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`Returns a copy of the model.

!!! warning "Deprecated"
    This method is now deprecated; use \`model_copy\` instead.

If you need \`include\` or \`exclude\`, use:

\`\`\`python {test="skip" lint="skip"}
data = self.model_dump(include=include, exclude=exclude, round_trip=True)
data = {**data, **(update or {})}
copied = self.model_validate(data)
\`\`\`

Args:
    include: Optional set or mapping specifying which fields to include in the copied model.
    exclude: Optional set or mapping specifying which fields to exclude in the copied model.
    update: Optional dictionary of field-value pairs to override field values in the copied model.
    deep: If True, the values of fields that are Pydantic models will be deep-copied.

Returns:
    A copy of the model with included, excluded and updated fields as specified.`},"machinable.schema.Element.dict":{kind:"routine",realname:"dict",name:"machinable.schema",path:"machinable.schema.Element.dict",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False) -> 'Dict[str, Any]'",doc:null},"machinable.schema.Element.extra":{kind:"routine",realname:"extra",name:"machinable.schema",path:"machinable.schema.Element.extra",signature:"(self) -> dict",doc:null},"machinable.schema.Element.from_orm":{kind:"routine",realname:"from_orm",name:"machinable.schema",path:"machinable.schema.Element.from_orm",signature:null,doc:null},"machinable.schema.Element.json":{kind:"routine",realname:"json",name:"machinable.schema",path:"machinable.schema.Element.json",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, encoder: 'Callable[[Any], Any] | None' = PydanticUndefined, models_as_dict: 'bool' = PydanticUndefined, **dumps_kwargs: 'Any') -> 'str'",doc:null},"machinable.schema.Element.model_construct":{kind:"routine",realname:"model_construct",name:"machinable.schema",path:"machinable.schema.Element.model_construct",signature:null,doc:"Creates a new instance of the `Model` class with validated data.\n\nCreates a new model setting `__dict__` and `__pydantic_fields_set__` from trusted or pre-validated data.\nDefault values are respected, but no other validation is performed.\n\n!!! note\n    `model_construct()` generally respects the `model_config.extra` setting on the provided model.\n    That is, if `model_config.extra == 'allow'`, then all extra passed values are added to the model instance's `__dict__`\n    and `__pydantic_extra__` fields. If `model_config.extra == 'ignore'` (the default), then all extra passed values are ignored.\n    Because no validation is performed with a call to `model_construct()`, having `model_config.extra == 'forbid'` does not result in\n    an error if extra values are passed, but they will be ignored.\n\nArgs:\n    _fields_set: A set of field names that were originally explicitly set during instantiation. If provided,\n        this is directly used for the [`model_fields_set`][pydantic.BaseModel.model_fields_set] attribute.\n        Otherwise, the field names from the `values` argument will be used.\n    values: Trusted or pre-validated data dictionary.\n\nReturns:\n    A new instance of the `Model` class with validated data."},"machinable.schema.Element.model_copy":{kind:"routine",realname:"model_copy",name:"machinable.schema",path:"machinable.schema.Element.model_copy",signature:"(self, *, update: 'Mapping[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`!!! abstract "Usage Documentation"
    [\`model_copy\`](../concepts/models.md#model-copy)

Returns a copy of the model.

!!! note
    The underlying instance's [\`__dict__\`][object.__dict__] attribute is copied. This
    might have unexpected side effects if you store anything in it, on top of the model
    fields (e.g. the value of [cached properties][functools.cached_property]).

Args:
    update: Values to change/add in the new model. Note: the data is not validated
        before creating the new model. You should trust this data.
    deep: Set to \`True\` to make a deep copy of the model.

Returns:
    New model instance.`},"machinable.schema.Element.model_dump":{kind:"routine",realname:"model_dump",name:"machinable.schema",path:"machinable.schema.Element.model_dump",signature:`(self, *, mode: "Literal['json', 'python'] | str" = 'python', include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'dict[str, Any]'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump\`](../concepts/serialization.md#python-mode)

Generate a dictionary representation of the model, optionally specifying which fields to include or exclude.

Args:
    mode: The mode in which \`to_python\` should run.
        If mode is 'json', the output will only contain JSON serializable types.
        If mode is 'python', the output may contain non-JSON-serializable Python objects.
    include: A set of fields to include in the output.
    exclude: A set of fields to exclude from the output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to use the field's alias in the dictionary key if defined.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A dictionary representation of the model.`},"machinable.schema.Element.model_dump_json":{kind:"routine",realname:"model_dump_json",name:"machinable.schema",path:"machinable.schema.Element.model_dump_json",signature:`(self, *, indent: 'int | None' = None, ensure_ascii: 'bool' = False, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'str'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump_json\`](../concepts/serialization.md#json-mode)

Generates a JSON representation of the model using Pydantic's \`to_json\` method.

Args:
    indent: Indentation to use in the JSON output. If None is passed, the output will be compact.
    ensure_ascii: If \`True\`, the output is guaranteed to have all incoming non-ASCII characters escaped.
        If \`False\` (the default), these characters will be output as-is.
    include: Field(s) to include in the JSON output.
    exclude: Field(s) to exclude from the JSON output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to serialize using field aliases.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A JSON string representation of the model.`},"machinable.schema.Element.model_json_schema":{kind:"routine",realname:"model_json_schema",name:"machinable.schema",path:"machinable.schema.Element.model_json_schema",signature:null,doc:"Generates a JSON schema for a model class.\n\nArgs:\n    by_alias: Whether to use attribute aliases or not.\n    ref_template: The reference template.\n    union_format: The format to use when combining schemas from unions together. Can be one of:\n\n        - `'any_of'`: Use the [`anyOf`](https://json-schema.org/understanding-json-schema/reference/combining#anyOf)\n        keyword to combine schemas (the default).\n        - `'primitive_type_array'`: Use the [`type`](https://json-schema.org/understanding-json-schema/reference/type)\n        keyword as an array of strings, containing each type of the combination. If any of the schemas is not a primitive\n        type (`string`, `boolean`, `null`, `integer` or `number`) or contains constraints/metadata, falls back to\n        `any_of`.\n    schema_generator: To override the logic used to generate the JSON schema, as a subclass of\n        `GenerateJsonSchema` with your desired modifications\n    mode: The mode in which to generate the schema.\n\nReturns:\n    The JSON schema for the given model class."},"machinable.schema.Element.model_parametrized_name":{kind:"routine",realname:"model_parametrized_name",name:"machinable.schema",path:"machinable.schema.Element.model_parametrized_name",signature:null,doc:`Compute the class name for parametrizations of generic classes.

This method can be overridden to achieve a custom naming scheme for generic BaseModels.

Args:
    params: Tuple of types of the class. Given a generic class
        \`Model\` with 2 type variables and a concrete model \`Model[str, int]\`,
        the value \`(str, int)\` would be passed to \`params\`.

Returns:
    String representing the new class where \`params\` are passed to \`cls\` as type variables.

Raises:
    TypeError: Raised when trying to generate concrete names for non-generic models.`},"machinable.schema.Element.model_post_init":{kind:"routine",realname:"model_post_init",name:"machinable.schema",path:"machinable.schema.Element.model_post_init",signature:"(self, context: 'Any', /) -> 'None'",doc:"Override this method to perform additional initialization after `__init__` and `model_construct`.\nThis is useful if you want to do some validation that requires the entire model to be initialized."},"machinable.schema.Element.model_rebuild":{kind:"routine",realname:"model_rebuild",name:"machinable.schema",path:"machinable.schema.Element.model_rebuild",signature:null,doc:`Try to rebuild the pydantic-core schema for the model.

This may be necessary when one of the annotations is a ForwardRef which could not be resolved during
the initial attempt to build the schema, and automatic rebuilding fails.

Args:
    force: Whether to force the rebuilding of the model schema, defaults to \`False\`.
    raise_errors: Whether to raise errors, defaults to \`True\`.
    _parent_namespace_depth: The depth level of the parent namespace, defaults to 2.
    _types_namespace: The types namespace, defaults to \`None\`.

Returns:
    Returns \`None\` if the schema is already "complete" and rebuilding was not required.
    If rebuilding _was_ required, returns \`True\` if rebuilding was successful, otherwise \`False\`.`},"machinable.schema.Element.model_validate":{kind:"routine",realname:"model_validate",name:"machinable.schema",path:"machinable.schema.Element.model_validate",signature:null,doc:`Validate a pydantic model instance.

Args:
    obj: The object to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    from_attributes: Whether to extract data from object attributes.
    context: Additional context to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Raises:
    ValidationError: If the object could not be validated.

Returns:
    The validated model instance.`},"machinable.schema.Element.model_validate_json":{kind:"routine",realname:"model_validate_json",name:"machinable.schema",path:"machinable.schema.Element.model_validate_json",signature:null,doc:`!!! abstract "Usage Documentation"
    [JSON Parsing](../concepts/json.md#json-parsing)

Validate the given JSON data against the Pydantic model.

Args:
    json_data: The JSON data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.

Raises:
    ValidationError: If \`json_data\` is not a JSON string or the object could not be validated.`},"machinable.schema.Element.model_validate_strings":{kind:"routine",realname:"model_validate_strings",name:"machinable.schema",path:"machinable.schema.Element.model_validate_strings",signature:null,doc:`Validate the given object with string data against the Pydantic model.

Args:
    obj: The object containing string data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.`},"machinable.schema.Element.parse_file":{kind:"routine",realname:"parse_file",name:"machinable.schema",path:"machinable.schema.Element.parse_file",signature:null,doc:null},"machinable.schema.Element.parse_obj":{kind:"routine",realname:"parse_obj",name:"machinable.schema",path:"machinable.schema.Element.parse_obj",signature:null,doc:null},"machinable.schema.Element.parse_raw":{kind:"routine",realname:"parse_raw",name:"machinable.schema",path:"machinable.schema.Element.parse_raw",signature:null,doc:null},"machinable.schema.Element.schema":{kind:"routine",realname:"schema",name:"machinable.schema",path:"machinable.schema.Element.schema",signature:null,doc:null},"machinable.schema.Element.schema_json":{kind:"routine",realname:"schema_json",name:"machinable.schema",path:"machinable.schema.Element.schema_json",signature:null,doc:null},"machinable.schema.Element.update_forward_refs":{kind:"routine",realname:"update_forward_refs",name:"machinable.schema",path:"machinable.schema.Element.update_forward_refs",signature:null,doc:null},"machinable.schema.Element.validate":{kind:"routine",realname:"validate",name:"machinable.schema",path:"machinable.schema.Element.validate",signature:null,doc:null},"machinable.schema.Element":{kind:"class",realname:"Element",name:"machinable.schema",path:"machinable.schema.Element",parents:["pydantic.main.BaseModel"],doc:`!!! abstract "Usage Documentation"
    [Models](../concepts/models.md)

A base class for creating Pydantic models.

Attributes:
    __class_vars__: The names of the class variables defined on the model.
    __private_attributes__: Metadata about the private attributes of the model.
    __signature__: The synthesized \`__init__\` [\`Signature\`][inspect.Signature] of the model.

    __pydantic_complete__: Whether model building is completed, or if there are still undefined fields.
    __pydantic_core_schema__: The core schema of the model.
    __pydantic_custom_init__: Whether the model has a custom \`__init__\` function.
    __pydantic_decorators__: Metadata containing the decorators defined on the model.
        This replaces \`Model.__validators__\` and \`Model.__root_validators__\` from Pydantic V1.
    __pydantic_generic_metadata__: Metadata for generic models; contains data used for a similar purpose to
        __args__, __origin__, __parameters__ in typing-module generics. May eventually be replaced by these.
    __pydantic_parent_namespace__: Parent namespace of the model, used for automatic rebuilding of models.
    __pydantic_post_init__: The name of the post-init method for the model, if defined.
    __pydantic_root_model__: Whether the model is a [\`RootModel\`][pydantic.root_model.RootModel].
    __pydantic_serializer__: The \`pydantic-core\` \`SchemaSerializer\` used to dump instances of the model.
    __pydantic_validator__: The \`pydantic-core\` \`SchemaValidator\` used to validate instances of the model.

    __pydantic_fields__: A dictionary of field names and their corresponding [\`FieldInfo\`][pydantic.fields.FieldInfo] objects.
    __pydantic_computed_fields__: A dictionary of computed field names and their corresponding [\`ComputedFieldInfo\`][pydantic.fields.ComputedFieldInfo] objects.

    __pydantic_extra__: A dictionary containing extra values, if [\`extra\`][pydantic.config.ConfigDict.extra]
        is set to \`'allow'\`.
    __pydantic_fields_set__: The names of fields explicitly set during instantiation.
    __pydantic_private__: Values of private attributes set on the model instance.`,file:"src/machinable/schema.py"},"machinable.schema.Execution.construct":{kind:"routine",realname:"construct",name:"machinable.schema",path:"machinable.schema.Execution.construct",signature:null,doc:null},"machinable.schema.Execution.copy":{kind:"routine",realname:"copy",name:"machinable.schema",path:"machinable.schema.Execution.copy",signature:"(self, *, include: 'AbstractSetIntStr | MappingIntStrAny | None' = None, exclude: 'AbstractSetIntStr | MappingIntStrAny | None' = None, update: 'Dict[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`Returns a copy of the model.

!!! warning "Deprecated"
    This method is now deprecated; use \`model_copy\` instead.

If you need \`include\` or \`exclude\`, use:

\`\`\`python {test="skip" lint="skip"}
data = self.model_dump(include=include, exclude=exclude, round_trip=True)
data = {**data, **(update or {})}
copied = self.model_validate(data)
\`\`\`

Args:
    include: Optional set or mapping specifying which fields to include in the copied model.
    exclude: Optional set or mapping specifying which fields to exclude in the copied model.
    update: Optional dictionary of field-value pairs to override field values in the copied model.
    deep: If True, the values of fields that are Pydantic models will be deep-copied.

Returns:
    A copy of the model with included, excluded and updated fields as specified.`},"machinable.schema.Execution.dict":{kind:"routine",realname:"dict",name:"machinable.schema",path:"machinable.schema.Execution.dict",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False) -> 'Dict[str, Any]'",doc:null},"machinable.schema.Execution.extra":{kind:"routine",realname:"extra",name:"machinable.schema",path:"machinable.schema.Execution.extra",signature:"(self) -> dict",doc:null},"machinable.schema.Execution.from_orm":{kind:"routine",realname:"from_orm",name:"machinable.schema",path:"machinable.schema.Execution.from_orm",signature:null,doc:null},"machinable.schema.Execution.json":{kind:"routine",realname:"json",name:"machinable.schema",path:"machinable.schema.Execution.json",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, encoder: 'Callable[[Any], Any] | None' = PydanticUndefined, models_as_dict: 'bool' = PydanticUndefined, **dumps_kwargs: 'Any') -> 'str'",doc:null},"machinable.schema.Execution.model_construct":{kind:"routine",realname:"model_construct",name:"machinable.schema",path:"machinable.schema.Execution.model_construct",signature:null,doc:"Creates a new instance of the `Model` class with validated data.\n\nCreates a new model setting `__dict__` and `__pydantic_fields_set__` from trusted or pre-validated data.\nDefault values are respected, but no other validation is performed.\n\n!!! note\n    `model_construct()` generally respects the `model_config.extra` setting on the provided model.\n    That is, if `model_config.extra == 'allow'`, then all extra passed values are added to the model instance's `__dict__`\n    and `__pydantic_extra__` fields. If `model_config.extra == 'ignore'` (the default), then all extra passed values are ignored.\n    Because no validation is performed with a call to `model_construct()`, having `model_config.extra == 'forbid'` does not result in\n    an error if extra values are passed, but they will be ignored.\n\nArgs:\n    _fields_set: A set of field names that were originally explicitly set during instantiation. If provided,\n        this is directly used for the [`model_fields_set`][pydantic.BaseModel.model_fields_set] attribute.\n        Otherwise, the field names from the `values` argument will be used.\n    values: Trusted or pre-validated data dictionary.\n\nReturns:\n    A new instance of the `Model` class with validated data."},"machinable.schema.Execution.model_copy":{kind:"routine",realname:"model_copy",name:"machinable.schema",path:"machinable.schema.Execution.model_copy",signature:"(self, *, update: 'Mapping[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`!!! abstract "Usage Documentation"
    [\`model_copy\`](../concepts/models.md#model-copy)

Returns a copy of the model.

!!! note
    The underlying instance's [\`__dict__\`][object.__dict__] attribute is copied. This
    might have unexpected side effects if you store anything in it, on top of the model
    fields (e.g. the value of [cached properties][functools.cached_property]).

Args:
    update: Values to change/add in the new model. Note: the data is not validated
        before creating the new model. You should trust this data.
    deep: Set to \`True\` to make a deep copy of the model.

Returns:
    New model instance.`},"machinable.schema.Execution.model_dump":{kind:"routine",realname:"model_dump",name:"machinable.schema",path:"machinable.schema.Execution.model_dump",signature:`(self, *, mode: "Literal['json', 'python'] | str" = 'python', include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'dict[str, Any]'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump\`](../concepts/serialization.md#python-mode)

Generate a dictionary representation of the model, optionally specifying which fields to include or exclude.

Args:
    mode: The mode in which \`to_python\` should run.
        If mode is 'json', the output will only contain JSON serializable types.
        If mode is 'python', the output may contain non-JSON-serializable Python objects.
    include: A set of fields to include in the output.
    exclude: A set of fields to exclude from the output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to use the field's alias in the dictionary key if defined.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A dictionary representation of the model.`},"machinable.schema.Execution.model_dump_json":{kind:"routine",realname:"model_dump_json",name:"machinable.schema",path:"machinable.schema.Execution.model_dump_json",signature:`(self, *, indent: 'int | None' = None, ensure_ascii: 'bool' = False, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'str'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump_json\`](../concepts/serialization.md#json-mode)

Generates a JSON representation of the model using Pydantic's \`to_json\` method.

Args:
    indent: Indentation to use in the JSON output. If None is passed, the output will be compact.
    ensure_ascii: If \`True\`, the output is guaranteed to have all incoming non-ASCII characters escaped.
        If \`False\` (the default), these characters will be output as-is.
    include: Field(s) to include in the JSON output.
    exclude: Field(s) to exclude from the JSON output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to serialize using field aliases.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A JSON string representation of the model.`},"machinable.schema.Execution.model_json_schema":{kind:"routine",realname:"model_json_schema",name:"machinable.schema",path:"machinable.schema.Execution.model_json_schema",signature:null,doc:"Generates a JSON schema for a model class.\n\nArgs:\n    by_alias: Whether to use attribute aliases or not.\n    ref_template: The reference template.\n    union_format: The format to use when combining schemas from unions together. Can be one of:\n\n        - `'any_of'`: Use the [`anyOf`](https://json-schema.org/understanding-json-schema/reference/combining#anyOf)\n        keyword to combine schemas (the default).\n        - `'primitive_type_array'`: Use the [`type`](https://json-schema.org/understanding-json-schema/reference/type)\n        keyword as an array of strings, containing each type of the combination. If any of the schemas is not a primitive\n        type (`string`, `boolean`, `null`, `integer` or `number`) or contains constraints/metadata, falls back to\n        `any_of`.\n    schema_generator: To override the logic used to generate the JSON schema, as a subclass of\n        `GenerateJsonSchema` with your desired modifications\n    mode: The mode in which to generate the schema.\n\nReturns:\n    The JSON schema for the given model class."},"machinable.schema.Execution.model_parametrized_name":{kind:"routine",realname:"model_parametrized_name",name:"machinable.schema",path:"machinable.schema.Execution.model_parametrized_name",signature:null,doc:`Compute the class name for parametrizations of generic classes.

This method can be overridden to achieve a custom naming scheme for generic BaseModels.

Args:
    params: Tuple of types of the class. Given a generic class
        \`Model\` with 2 type variables and a concrete model \`Model[str, int]\`,
        the value \`(str, int)\` would be passed to \`params\`.

Returns:
    String representing the new class where \`params\` are passed to \`cls\` as type variables.

Raises:
    TypeError: Raised when trying to generate concrete names for non-generic models.`},"machinable.schema.Execution.model_post_init":{kind:"routine",realname:"init_private_attributes",name:"machinable.schema",path:"machinable.schema.Execution.model_post_init",signature:"(self: 'BaseModel', context: 'Any', /) -> 'None'",doc:`This function is meant to behave like a BaseModel method to initialise private attributes.

It takes context as an argument since that's what pydantic-core passes when calling it.

Args:
    self: The BaseModel instance.
    context: The context.`},"machinable.schema.Execution.model_rebuild":{kind:"routine",realname:"model_rebuild",name:"machinable.schema",path:"machinable.schema.Execution.model_rebuild",signature:null,doc:`Try to rebuild the pydantic-core schema for the model.

This may be necessary when one of the annotations is a ForwardRef which could not be resolved during
the initial attempt to build the schema, and automatic rebuilding fails.

Args:
    force: Whether to force the rebuilding of the model schema, defaults to \`False\`.
    raise_errors: Whether to raise errors, defaults to \`True\`.
    _parent_namespace_depth: The depth level of the parent namespace, defaults to 2.
    _types_namespace: The types namespace, defaults to \`None\`.

Returns:
    Returns \`None\` if the schema is already "complete" and rebuilding was not required.
    If rebuilding _was_ required, returns \`True\` if rebuilding was successful, otherwise \`False\`.`},"machinable.schema.Execution.model_validate":{kind:"routine",realname:"model_validate",name:"machinable.schema",path:"machinable.schema.Execution.model_validate",signature:null,doc:`Validate a pydantic model instance.

Args:
    obj: The object to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    from_attributes: Whether to extract data from object attributes.
    context: Additional context to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Raises:
    ValidationError: If the object could not be validated.

Returns:
    The validated model instance.`},"machinable.schema.Execution.model_validate_json":{kind:"routine",realname:"model_validate_json",name:"machinable.schema",path:"machinable.schema.Execution.model_validate_json",signature:null,doc:`!!! abstract "Usage Documentation"
    [JSON Parsing](../concepts/json.md#json-parsing)

Validate the given JSON data against the Pydantic model.

Args:
    json_data: The JSON data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.

Raises:
    ValidationError: If \`json_data\` is not a JSON string or the object could not be validated.`},"machinable.schema.Execution.model_validate_strings":{kind:"routine",realname:"model_validate_strings",name:"machinable.schema",path:"machinable.schema.Execution.model_validate_strings",signature:null,doc:`Validate the given object with string data against the Pydantic model.

Args:
    obj: The object containing string data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.`},"machinable.schema.Execution.parse_file":{kind:"routine",realname:"parse_file",name:"machinable.schema",path:"machinable.schema.Execution.parse_file",signature:null,doc:null},"machinable.schema.Execution.parse_obj":{kind:"routine",realname:"parse_obj",name:"machinable.schema",path:"machinable.schema.Execution.parse_obj",signature:null,doc:null},"machinable.schema.Execution.parse_raw":{kind:"routine",realname:"parse_raw",name:"machinable.schema",path:"machinable.schema.Execution.parse_raw",signature:null,doc:null},"machinable.schema.Execution.schema":{kind:"routine",realname:"schema",name:"machinable.schema",path:"machinable.schema.Execution.schema",signature:null,doc:null},"machinable.schema.Execution.schema_json":{kind:"routine",realname:"schema_json",name:"machinable.schema",path:"machinable.schema.Execution.schema_json",signature:null,doc:null},"machinable.schema.Execution.update_forward_refs":{kind:"routine",realname:"update_forward_refs",name:"machinable.schema",path:"machinable.schema.Execution.update_forward_refs",signature:null,doc:null},"machinable.schema.Execution.validate":{kind:"routine",realname:"validate",name:"machinable.schema",path:"machinable.schema.Execution.validate",signature:null,doc:null},"machinable.schema.Execution":{kind:"class",realname:"Execution",name:"machinable.schema",path:"machinable.schema.Execution",parents:["Interface"],doc:`!!! abstract "Usage Documentation"
    [Models](../concepts/models.md)

A base class for creating Pydantic models.

Attributes:
    __class_vars__: The names of the class variables defined on the model.
    __private_attributes__: Metadata about the private attributes of the model.
    __signature__: The synthesized \`__init__\` [\`Signature\`][inspect.Signature] of the model.

    __pydantic_complete__: Whether model building is completed, or if there are still undefined fields.
    __pydantic_core_schema__: The core schema of the model.
    __pydantic_custom_init__: Whether the model has a custom \`__init__\` function.
    __pydantic_decorators__: Metadata containing the decorators defined on the model.
        This replaces \`Model.__validators__\` and \`Model.__root_validators__\` from Pydantic V1.
    __pydantic_generic_metadata__: Metadata for generic models; contains data used for a similar purpose to
        __args__, __origin__, __parameters__ in typing-module generics. May eventually be replaced by these.
    __pydantic_parent_namespace__: Parent namespace of the model, used for automatic rebuilding of models.
    __pydantic_post_init__: The name of the post-init method for the model, if defined.
    __pydantic_root_model__: Whether the model is a [\`RootModel\`][pydantic.root_model.RootModel].
    __pydantic_serializer__: The \`pydantic-core\` \`SchemaSerializer\` used to dump instances of the model.
    __pydantic_validator__: The \`pydantic-core\` \`SchemaValidator\` used to validate instances of the model.

    __pydantic_fields__: A dictionary of field names and their corresponding [\`FieldInfo\`][pydantic.fields.FieldInfo] objects.
    __pydantic_computed_fields__: A dictionary of computed field names and their corresponding [\`ComputedFieldInfo\`][pydantic.fields.ComputedFieldInfo] objects.

    __pydantic_extra__: A dictionary containing extra values, if [\`extra\`][pydantic.config.ConfigDict.extra]
        is set to \`'allow'\`.
    __pydantic_fields_set__: The names of fields explicitly set during instantiation.
    __pydantic_private__: Values of private attributes set on the model instance.`,file:"src/machinable/schema.py"},"machinable.schema.Index.construct":{kind:"routine",realname:"construct",name:"machinable.schema",path:"machinable.schema.Index.construct",signature:null,doc:null},"machinable.schema.Index.copy":{kind:"routine",realname:"copy",name:"machinable.schema",path:"machinable.schema.Index.copy",signature:"(self, *, include: 'AbstractSetIntStr | MappingIntStrAny | None' = None, exclude: 'AbstractSetIntStr | MappingIntStrAny | None' = None, update: 'Dict[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`Returns a copy of the model.

!!! warning "Deprecated"
    This method is now deprecated; use \`model_copy\` instead.

If you need \`include\` or \`exclude\`, use:

\`\`\`python {test="skip" lint="skip"}
data = self.model_dump(include=include, exclude=exclude, round_trip=True)
data = {**data, **(update or {})}
copied = self.model_validate(data)
\`\`\`

Args:
    include: Optional set or mapping specifying which fields to include in the copied model.
    exclude: Optional set or mapping specifying which fields to exclude in the copied model.
    update: Optional dictionary of field-value pairs to override field values in the copied model.
    deep: If True, the values of fields that are Pydantic models will be deep-copied.

Returns:
    A copy of the model with included, excluded and updated fields as specified.`},"machinable.schema.Index.dict":{kind:"routine",realname:"dict",name:"machinable.schema",path:"machinable.schema.Index.dict",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False) -> 'Dict[str, Any]'",doc:null},"machinable.schema.Index.extra":{kind:"routine",realname:"extra",name:"machinable.schema",path:"machinable.schema.Index.extra",signature:"(self) -> dict",doc:null},"machinable.schema.Index.from_orm":{kind:"routine",realname:"from_orm",name:"machinable.schema",path:"machinable.schema.Index.from_orm",signature:null,doc:null},"machinable.schema.Index.json":{kind:"routine",realname:"json",name:"machinable.schema",path:"machinable.schema.Index.json",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, encoder: 'Callable[[Any], Any] | None' = PydanticUndefined, models_as_dict: 'bool' = PydanticUndefined, **dumps_kwargs: 'Any') -> 'str'",doc:null},"machinable.schema.Index.model_construct":{kind:"routine",realname:"model_construct",name:"machinable.schema",path:"machinable.schema.Index.model_construct",signature:null,doc:"Creates a new instance of the `Model` class with validated data.\n\nCreates a new model setting `__dict__` and `__pydantic_fields_set__` from trusted or pre-validated data.\nDefault values are respected, but no other validation is performed.\n\n!!! note\n    `model_construct()` generally respects the `model_config.extra` setting on the provided model.\n    That is, if `model_config.extra == 'allow'`, then all extra passed values are added to the model instance's `__dict__`\n    and `__pydantic_extra__` fields. If `model_config.extra == 'ignore'` (the default), then all extra passed values are ignored.\n    Because no validation is performed with a call to `model_construct()`, having `model_config.extra == 'forbid'` does not result in\n    an error if extra values are passed, but they will be ignored.\n\nArgs:\n    _fields_set: A set of field names that were originally explicitly set during instantiation. If provided,\n        this is directly used for the [`model_fields_set`][pydantic.BaseModel.model_fields_set] attribute.\n        Otherwise, the field names from the `values` argument will be used.\n    values: Trusted or pre-validated data dictionary.\n\nReturns:\n    A new instance of the `Model` class with validated data."},"machinable.schema.Index.model_copy":{kind:"routine",realname:"model_copy",name:"machinable.schema",path:"machinable.schema.Index.model_copy",signature:"(self, *, update: 'Mapping[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`!!! abstract "Usage Documentation"
    [\`model_copy\`](../concepts/models.md#model-copy)

Returns a copy of the model.

!!! note
    The underlying instance's [\`__dict__\`][object.__dict__] attribute is copied. This
    might have unexpected side effects if you store anything in it, on top of the model
    fields (e.g. the value of [cached properties][functools.cached_property]).

Args:
    update: Values to change/add in the new model. Note: the data is not validated
        before creating the new model. You should trust this data.
    deep: Set to \`True\` to make a deep copy of the model.

Returns:
    New model instance.`},"machinable.schema.Index.model_dump":{kind:"routine",realname:"model_dump",name:"machinable.schema",path:"machinable.schema.Index.model_dump",signature:`(self, *, mode: "Literal['json', 'python'] | str" = 'python', include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'dict[str, Any]'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump\`](../concepts/serialization.md#python-mode)

Generate a dictionary representation of the model, optionally specifying which fields to include or exclude.

Args:
    mode: The mode in which \`to_python\` should run.
        If mode is 'json', the output will only contain JSON serializable types.
        If mode is 'python', the output may contain non-JSON-serializable Python objects.
    include: A set of fields to include in the output.
    exclude: A set of fields to exclude from the output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to use the field's alias in the dictionary key if defined.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A dictionary representation of the model.`},"machinable.schema.Index.model_dump_json":{kind:"routine",realname:"model_dump_json",name:"machinable.schema",path:"machinable.schema.Index.model_dump_json",signature:`(self, *, indent: 'int | None' = None, ensure_ascii: 'bool' = False, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'str'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump_json\`](../concepts/serialization.md#json-mode)

Generates a JSON representation of the model using Pydantic's \`to_json\` method.

Args:
    indent: Indentation to use in the JSON output. If None is passed, the output will be compact.
    ensure_ascii: If \`True\`, the output is guaranteed to have all incoming non-ASCII characters escaped.
        If \`False\` (the default), these characters will be output as-is.
    include: Field(s) to include in the JSON output.
    exclude: Field(s) to exclude from the JSON output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to serialize using field aliases.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A JSON string representation of the model.`},"machinable.schema.Index.model_json_schema":{kind:"routine",realname:"model_json_schema",name:"machinable.schema",path:"machinable.schema.Index.model_json_schema",signature:null,doc:"Generates a JSON schema for a model class.\n\nArgs:\n    by_alias: Whether to use attribute aliases or not.\n    ref_template: The reference template.\n    union_format: The format to use when combining schemas from unions together. Can be one of:\n\n        - `'any_of'`: Use the [`anyOf`](https://json-schema.org/understanding-json-schema/reference/combining#anyOf)\n        keyword to combine schemas (the default).\n        - `'primitive_type_array'`: Use the [`type`](https://json-schema.org/understanding-json-schema/reference/type)\n        keyword as an array of strings, containing each type of the combination. If any of the schemas is not a primitive\n        type (`string`, `boolean`, `null`, `integer` or `number`) or contains constraints/metadata, falls back to\n        `any_of`.\n    schema_generator: To override the logic used to generate the JSON schema, as a subclass of\n        `GenerateJsonSchema` with your desired modifications\n    mode: The mode in which to generate the schema.\n\nReturns:\n    The JSON schema for the given model class."},"machinable.schema.Index.model_parametrized_name":{kind:"routine",realname:"model_parametrized_name",name:"machinable.schema",path:"machinable.schema.Index.model_parametrized_name",signature:null,doc:`Compute the class name for parametrizations of generic classes.

This method can be overridden to achieve a custom naming scheme for generic BaseModels.

Args:
    params: Tuple of types of the class. Given a generic class
        \`Model\` with 2 type variables and a concrete model \`Model[str, int]\`,
        the value \`(str, int)\` would be passed to \`params\`.

Returns:
    String representing the new class where \`params\` are passed to \`cls\` as type variables.

Raises:
    TypeError: Raised when trying to generate concrete names for non-generic models.`},"machinable.schema.Index.model_post_init":{kind:"routine",realname:"model_post_init",name:"machinable.schema",path:"machinable.schema.Index.model_post_init",signature:"(self, context: 'Any', /) -> 'None'",doc:"Override this method to perform additional initialization after `__init__` and `model_construct`.\nThis is useful if you want to do some validation that requires the entire model to be initialized."},"machinable.schema.Index.model_rebuild":{kind:"routine",realname:"model_rebuild",name:"machinable.schema",path:"machinable.schema.Index.model_rebuild",signature:null,doc:`Try to rebuild the pydantic-core schema for the model.

This may be necessary when one of the annotations is a ForwardRef which could not be resolved during
the initial attempt to build the schema, and automatic rebuilding fails.

Args:
    force: Whether to force the rebuilding of the model schema, defaults to \`False\`.
    raise_errors: Whether to raise errors, defaults to \`True\`.
    _parent_namespace_depth: The depth level of the parent namespace, defaults to 2.
    _types_namespace: The types namespace, defaults to \`None\`.

Returns:
    Returns \`None\` if the schema is already "complete" and rebuilding was not required.
    If rebuilding _was_ required, returns \`True\` if rebuilding was successful, otherwise \`False\`.`},"machinable.schema.Index.model_validate":{kind:"routine",realname:"model_validate",name:"machinable.schema",path:"machinable.schema.Index.model_validate",signature:null,doc:`Validate a pydantic model instance.

Args:
    obj: The object to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    from_attributes: Whether to extract data from object attributes.
    context: Additional context to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Raises:
    ValidationError: If the object could not be validated.

Returns:
    The validated model instance.`},"machinable.schema.Index.model_validate_json":{kind:"routine",realname:"model_validate_json",name:"machinable.schema",path:"machinable.schema.Index.model_validate_json",signature:null,doc:`!!! abstract "Usage Documentation"
    [JSON Parsing](../concepts/json.md#json-parsing)

Validate the given JSON data against the Pydantic model.

Args:
    json_data: The JSON data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.

Raises:
    ValidationError: If \`json_data\` is not a JSON string or the object could not be validated.`},"machinable.schema.Index.model_validate_strings":{kind:"routine",realname:"model_validate_strings",name:"machinable.schema",path:"machinable.schema.Index.model_validate_strings",signature:null,doc:`Validate the given object with string data against the Pydantic model.

Args:
    obj: The object containing string data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.`},"machinable.schema.Index.parse_file":{kind:"routine",realname:"parse_file",name:"machinable.schema",path:"machinable.schema.Index.parse_file",signature:null,doc:null},"machinable.schema.Index.parse_obj":{kind:"routine",realname:"parse_obj",name:"machinable.schema",path:"machinable.schema.Index.parse_obj",signature:null,doc:null},"machinable.schema.Index.parse_raw":{kind:"routine",realname:"parse_raw",name:"machinable.schema",path:"machinable.schema.Index.parse_raw",signature:null,doc:null},"machinable.schema.Index.schema":{kind:"routine",realname:"schema",name:"machinable.schema",path:"machinable.schema.Index.schema",signature:null,doc:null},"machinable.schema.Index.schema_json":{kind:"routine",realname:"schema_json",name:"machinable.schema",path:"machinable.schema.Index.schema_json",signature:null,doc:null},"machinable.schema.Index.update_forward_refs":{kind:"routine",realname:"update_forward_refs",name:"machinable.schema",path:"machinable.schema.Index.update_forward_refs",signature:null,doc:null},"machinable.schema.Index.validate":{kind:"routine",realname:"validate",name:"machinable.schema",path:"machinable.schema.Index.validate",signature:null,doc:null},"machinable.schema.Index":{kind:"class",realname:"Index",name:"machinable.schema",path:"machinable.schema.Index",parents:["Element"],doc:`!!! abstract "Usage Documentation"
    [Models](../concepts/models.md)

A base class for creating Pydantic models.

Attributes:
    __class_vars__: The names of the class variables defined on the model.
    __private_attributes__: Metadata about the private attributes of the model.
    __signature__: The synthesized \`__init__\` [\`Signature\`][inspect.Signature] of the model.

    __pydantic_complete__: Whether model building is completed, or if there are still undefined fields.
    __pydantic_core_schema__: The core schema of the model.
    __pydantic_custom_init__: Whether the model has a custom \`__init__\` function.
    __pydantic_decorators__: Metadata containing the decorators defined on the model.
        This replaces \`Model.__validators__\` and \`Model.__root_validators__\` from Pydantic V1.
    __pydantic_generic_metadata__: Metadata for generic models; contains data used for a similar purpose to
        __args__, __origin__, __parameters__ in typing-module generics. May eventually be replaced by these.
    __pydantic_parent_namespace__: Parent namespace of the model, used for automatic rebuilding of models.
    __pydantic_post_init__: The name of the post-init method for the model, if defined.
    __pydantic_root_model__: Whether the model is a [\`RootModel\`][pydantic.root_model.RootModel].
    __pydantic_serializer__: The \`pydantic-core\` \`SchemaSerializer\` used to dump instances of the model.
    __pydantic_validator__: The \`pydantic-core\` \`SchemaValidator\` used to validate instances of the model.

    __pydantic_fields__: A dictionary of field names and their corresponding [\`FieldInfo\`][pydantic.fields.FieldInfo] objects.
    __pydantic_computed_fields__: A dictionary of computed field names and their corresponding [\`ComputedFieldInfo\`][pydantic.fields.ComputedFieldInfo] objects.

    __pydantic_extra__: A dictionary containing extra values, if [\`extra\`][pydantic.config.ConfigDict.extra]
        is set to \`'allow'\`.
    __pydantic_fields_set__: The names of fields explicitly set during instantiation.
    __pydantic_private__: Values of private attributes set on the model instance.`,file:"src/machinable/schema.py"},"machinable.schema.Interface.construct":{kind:"routine",realname:"construct",name:"machinable.schema",path:"machinable.schema.Interface.construct",signature:null,doc:null},"machinable.schema.Interface.copy":{kind:"routine",realname:"copy",name:"machinable.schema",path:"machinable.schema.Interface.copy",signature:"(self, *, include: 'AbstractSetIntStr | MappingIntStrAny | None' = None, exclude: 'AbstractSetIntStr | MappingIntStrAny | None' = None, update: 'Dict[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`Returns a copy of the model.

!!! warning "Deprecated"
    This method is now deprecated; use \`model_copy\` instead.

If you need \`include\` or \`exclude\`, use:

\`\`\`python {test="skip" lint="skip"}
data = self.model_dump(include=include, exclude=exclude, round_trip=True)
data = {**data, **(update or {})}
copied = self.model_validate(data)
\`\`\`

Args:
    include: Optional set or mapping specifying which fields to include in the copied model.
    exclude: Optional set or mapping specifying which fields to exclude in the copied model.
    update: Optional dictionary of field-value pairs to override field values in the copied model.
    deep: If True, the values of fields that are Pydantic models will be deep-copied.

Returns:
    A copy of the model with included, excluded and updated fields as specified.`},"machinable.schema.Interface.dict":{kind:"routine",realname:"dict",name:"machinable.schema",path:"machinable.schema.Interface.dict",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False) -> 'Dict[str, Any]'",doc:null},"machinable.schema.Interface.extra":{kind:"routine",realname:"extra",name:"machinable.schema",path:"machinable.schema.Interface.extra",signature:"(self) -> dict",doc:null},"machinable.schema.Interface.from_orm":{kind:"routine",realname:"from_orm",name:"machinable.schema",path:"machinable.schema.Interface.from_orm",signature:null,doc:null},"machinable.schema.Interface.json":{kind:"routine",realname:"json",name:"machinable.schema",path:"machinable.schema.Interface.json",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, encoder: 'Callable[[Any], Any] | None' = PydanticUndefined, models_as_dict: 'bool' = PydanticUndefined, **dumps_kwargs: 'Any') -> 'str'",doc:null},"machinable.schema.Interface.model_construct":{kind:"routine",realname:"model_construct",name:"machinable.schema",path:"machinable.schema.Interface.model_construct",signature:null,doc:"Creates a new instance of the `Model` class with validated data.\n\nCreates a new model setting `__dict__` and `__pydantic_fields_set__` from trusted or pre-validated data.\nDefault values are respected, but no other validation is performed.\n\n!!! note\n    `model_construct()` generally respects the `model_config.extra` setting on the provided model.\n    That is, if `model_config.extra == 'allow'`, then all extra passed values are added to the model instance's `__dict__`\n    and `__pydantic_extra__` fields. If `model_config.extra == 'ignore'` (the default), then all extra passed values are ignored.\n    Because no validation is performed with a call to `model_construct()`, having `model_config.extra == 'forbid'` does not result in\n    an error if extra values are passed, but they will be ignored.\n\nArgs:\n    _fields_set: A set of field names that were originally explicitly set during instantiation. If provided,\n        this is directly used for the [`model_fields_set`][pydantic.BaseModel.model_fields_set] attribute.\n        Otherwise, the field names from the `values` argument will be used.\n    values: Trusted or pre-validated data dictionary.\n\nReturns:\n    A new instance of the `Model` class with validated data."},"machinable.schema.Interface.model_copy":{kind:"routine",realname:"model_copy",name:"machinable.schema",path:"machinable.schema.Interface.model_copy",signature:"(self, *, update: 'Mapping[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`!!! abstract "Usage Documentation"
    [\`model_copy\`](../concepts/models.md#model-copy)

Returns a copy of the model.

!!! note
    The underlying instance's [\`__dict__\`][object.__dict__] attribute is copied. This
    might have unexpected side effects if you store anything in it, on top of the model
    fields (e.g. the value of [cached properties][functools.cached_property]).

Args:
    update: Values to change/add in the new model. Note: the data is not validated
        before creating the new model. You should trust this data.
    deep: Set to \`True\` to make a deep copy of the model.

Returns:
    New model instance.`},"machinable.schema.Interface.model_dump":{kind:"routine",realname:"model_dump",name:"machinable.schema",path:"machinable.schema.Interface.model_dump",signature:`(self, *, mode: "Literal['json', 'python'] | str" = 'python', include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'dict[str, Any]'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump\`](../concepts/serialization.md#python-mode)

Generate a dictionary representation of the model, optionally specifying which fields to include or exclude.

Args:
    mode: The mode in which \`to_python\` should run.
        If mode is 'json', the output will only contain JSON serializable types.
        If mode is 'python', the output may contain non-JSON-serializable Python objects.
    include: A set of fields to include in the output.
    exclude: A set of fields to exclude from the output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to use the field's alias in the dictionary key if defined.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A dictionary representation of the model.`},"machinable.schema.Interface.model_dump_json":{kind:"routine",realname:"model_dump_json",name:"machinable.schema",path:"machinable.schema.Interface.model_dump_json",signature:`(self, *, indent: 'int | None' = None, ensure_ascii: 'bool' = False, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'str'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump_json\`](../concepts/serialization.md#json-mode)

Generates a JSON representation of the model using Pydantic's \`to_json\` method.

Args:
    indent: Indentation to use in the JSON output. If None is passed, the output will be compact.
    ensure_ascii: If \`True\`, the output is guaranteed to have all incoming non-ASCII characters escaped.
        If \`False\` (the default), these characters will be output as-is.
    include: Field(s) to include in the JSON output.
    exclude: Field(s) to exclude from the JSON output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to serialize using field aliases.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A JSON string representation of the model.`},"machinable.schema.Interface.model_json_schema":{kind:"routine",realname:"model_json_schema",name:"machinable.schema",path:"machinable.schema.Interface.model_json_schema",signature:null,doc:"Generates a JSON schema for a model class.\n\nArgs:\n    by_alias: Whether to use attribute aliases or not.\n    ref_template: The reference template.\n    union_format: The format to use when combining schemas from unions together. Can be one of:\n\n        - `'any_of'`: Use the [`anyOf`](https://json-schema.org/understanding-json-schema/reference/combining#anyOf)\n        keyword to combine schemas (the default).\n        - `'primitive_type_array'`: Use the [`type`](https://json-schema.org/understanding-json-schema/reference/type)\n        keyword as an array of strings, containing each type of the combination. If any of the schemas is not a primitive\n        type (`string`, `boolean`, `null`, `integer` or `number`) or contains constraints/metadata, falls back to\n        `any_of`.\n    schema_generator: To override the logic used to generate the JSON schema, as a subclass of\n        `GenerateJsonSchema` with your desired modifications\n    mode: The mode in which to generate the schema.\n\nReturns:\n    The JSON schema for the given model class."},"machinable.schema.Interface.model_parametrized_name":{kind:"routine",realname:"model_parametrized_name",name:"machinable.schema",path:"machinable.schema.Interface.model_parametrized_name",signature:null,doc:`Compute the class name for parametrizations of generic classes.

This method can be overridden to achieve a custom naming scheme for generic BaseModels.

Args:
    params: Tuple of types of the class. Given a generic class
        \`Model\` with 2 type variables and a concrete model \`Model[str, int]\`,
        the value \`(str, int)\` would be passed to \`params\`.

Returns:
    String representing the new class where \`params\` are passed to \`cls\` as type variables.

Raises:
    TypeError: Raised when trying to generate concrete names for non-generic models.`},"machinable.schema.Interface.model_post_init":{kind:"routine",realname:"init_private_attributes",name:"machinable.schema",path:"machinable.schema.Interface.model_post_init",signature:"(self: 'BaseModel', context: 'Any', /) -> 'None'",doc:`This function is meant to behave like a BaseModel method to initialise private attributes.

It takes context as an argument since that's what pydantic-core passes when calling it.

Args:
    self: The BaseModel instance.
    context: The context.`},"machinable.schema.Interface.model_rebuild":{kind:"routine",realname:"model_rebuild",name:"machinable.schema",path:"machinable.schema.Interface.model_rebuild",signature:null,doc:`Try to rebuild the pydantic-core schema for the model.

This may be necessary when one of the annotations is a ForwardRef which could not be resolved during
the initial attempt to build the schema, and automatic rebuilding fails.

Args:
    force: Whether to force the rebuilding of the model schema, defaults to \`False\`.
    raise_errors: Whether to raise errors, defaults to \`True\`.
    _parent_namespace_depth: The depth level of the parent namespace, defaults to 2.
    _types_namespace: The types namespace, defaults to \`None\`.

Returns:
    Returns \`None\` if the schema is already "complete" and rebuilding was not required.
    If rebuilding _was_ required, returns \`True\` if rebuilding was successful, otherwise \`False\`.`},"machinable.schema.Interface.model_validate":{kind:"routine",realname:"model_validate",name:"machinable.schema",path:"machinable.schema.Interface.model_validate",signature:null,doc:`Validate a pydantic model instance.

Args:
    obj: The object to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    from_attributes: Whether to extract data from object attributes.
    context: Additional context to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Raises:
    ValidationError: If the object could not be validated.

Returns:
    The validated model instance.`},"machinable.schema.Interface.model_validate_json":{kind:"routine",realname:"model_validate_json",name:"machinable.schema",path:"machinable.schema.Interface.model_validate_json",signature:null,doc:`!!! abstract "Usage Documentation"
    [JSON Parsing](../concepts/json.md#json-parsing)

Validate the given JSON data against the Pydantic model.

Args:
    json_data: The JSON data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.

Raises:
    ValidationError: If \`json_data\` is not a JSON string or the object could not be validated.`},"machinable.schema.Interface.model_validate_strings":{kind:"routine",realname:"model_validate_strings",name:"machinable.schema",path:"machinable.schema.Interface.model_validate_strings",signature:null,doc:`Validate the given object with string data against the Pydantic model.

Args:
    obj: The object containing string data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.`},"machinable.schema.Interface.parse_file":{kind:"routine",realname:"parse_file",name:"machinable.schema",path:"machinable.schema.Interface.parse_file",signature:null,doc:null},"machinable.schema.Interface.parse_obj":{kind:"routine",realname:"parse_obj",name:"machinable.schema",path:"machinable.schema.Interface.parse_obj",signature:null,doc:null},"machinable.schema.Interface.parse_raw":{kind:"routine",realname:"parse_raw",name:"machinable.schema",path:"machinable.schema.Interface.parse_raw",signature:null,doc:null},"machinable.schema.Interface.schema":{kind:"routine",realname:"schema",name:"machinable.schema",path:"machinable.schema.Interface.schema",signature:null,doc:null},"machinable.schema.Interface.schema_json":{kind:"routine",realname:"schema_json",name:"machinable.schema",path:"machinable.schema.Interface.schema_json",signature:null,doc:null},"machinable.schema.Interface.update_forward_refs":{kind:"routine",realname:"update_forward_refs",name:"machinable.schema",path:"machinable.schema.Interface.update_forward_refs",signature:null,doc:null},"machinable.schema.Interface.validate":{kind:"routine",realname:"validate",name:"machinable.schema",path:"machinable.schema.Interface.validate",signature:null,doc:null},"machinable.schema.Interface":{kind:"class",realname:"Interface",name:"machinable.schema",path:"machinable.schema.Interface",parents:["Element"],doc:`!!! abstract "Usage Documentation"
    [Models](../concepts/models.md)

A base class for creating Pydantic models.

Attributes:
    __class_vars__: The names of the class variables defined on the model.
    __private_attributes__: Metadata about the private attributes of the model.
    __signature__: The synthesized \`__init__\` [\`Signature\`][inspect.Signature] of the model.

    __pydantic_complete__: Whether model building is completed, or if there are still undefined fields.
    __pydantic_core_schema__: The core schema of the model.
    __pydantic_custom_init__: Whether the model has a custom \`__init__\` function.
    __pydantic_decorators__: Metadata containing the decorators defined on the model.
        This replaces \`Model.__validators__\` and \`Model.__root_validators__\` from Pydantic V1.
    __pydantic_generic_metadata__: Metadata for generic models; contains data used for a similar purpose to
        __args__, __origin__, __parameters__ in typing-module generics. May eventually be replaced by these.
    __pydantic_parent_namespace__: Parent namespace of the model, used for automatic rebuilding of models.
    __pydantic_post_init__: The name of the post-init method for the model, if defined.
    __pydantic_root_model__: Whether the model is a [\`RootModel\`][pydantic.root_model.RootModel].
    __pydantic_serializer__: The \`pydantic-core\` \`SchemaSerializer\` used to dump instances of the model.
    __pydantic_validator__: The \`pydantic-core\` \`SchemaValidator\` used to validate instances of the model.

    __pydantic_fields__: A dictionary of field names and their corresponding [\`FieldInfo\`][pydantic.fields.FieldInfo] objects.
    __pydantic_computed_fields__: A dictionary of computed field names and their corresponding [\`ComputedFieldInfo\`][pydantic.fields.ComputedFieldInfo] objects.

    __pydantic_extra__: A dictionary containing extra values, if [\`extra\`][pydantic.config.ConfigDict.extra]
        is set to \`'allow'\`.
    __pydantic_fields_set__: The names of fields explicitly set during instantiation.
    __pydantic_private__: Values of private attributes set on the model instance.`,file:"src/machinable/schema.py"},"machinable.schema.Project.construct":{kind:"routine",realname:"construct",name:"machinable.schema",path:"machinable.schema.Project.construct",signature:null,doc:null},"machinable.schema.Project.copy":{kind:"routine",realname:"copy",name:"machinable.schema",path:"machinable.schema.Project.copy",signature:"(self, *, include: 'AbstractSetIntStr | MappingIntStrAny | None' = None, exclude: 'AbstractSetIntStr | MappingIntStrAny | None' = None, update: 'Dict[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`Returns a copy of the model.

!!! warning "Deprecated"
    This method is now deprecated; use \`model_copy\` instead.

If you need \`include\` or \`exclude\`, use:

\`\`\`python {test="skip" lint="skip"}
data = self.model_dump(include=include, exclude=exclude, round_trip=True)
data = {**data, **(update or {})}
copied = self.model_validate(data)
\`\`\`

Args:
    include: Optional set or mapping specifying which fields to include in the copied model.
    exclude: Optional set or mapping specifying which fields to exclude in the copied model.
    update: Optional dictionary of field-value pairs to override field values in the copied model.
    deep: If True, the values of fields that are Pydantic models will be deep-copied.

Returns:
    A copy of the model with included, excluded and updated fields as specified.`},"machinable.schema.Project.dict":{kind:"routine",realname:"dict",name:"machinable.schema",path:"machinable.schema.Project.dict",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False) -> 'Dict[str, Any]'",doc:null},"machinable.schema.Project.extra":{kind:"routine",realname:"extra",name:"machinable.schema",path:"machinable.schema.Project.extra",signature:"(self) -> dict",doc:null},"machinable.schema.Project.from_orm":{kind:"routine",realname:"from_orm",name:"machinable.schema",path:"machinable.schema.Project.from_orm",signature:null,doc:null},"machinable.schema.Project.json":{kind:"routine",realname:"json",name:"machinable.schema",path:"machinable.schema.Project.json",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, encoder: 'Callable[[Any], Any] | None' = PydanticUndefined, models_as_dict: 'bool' = PydanticUndefined, **dumps_kwargs: 'Any') -> 'str'",doc:null},"machinable.schema.Project.model_construct":{kind:"routine",realname:"model_construct",name:"machinable.schema",path:"machinable.schema.Project.model_construct",signature:null,doc:"Creates a new instance of the `Model` class with validated data.\n\nCreates a new model setting `__dict__` and `__pydantic_fields_set__` from trusted or pre-validated data.\nDefault values are respected, but no other validation is performed.\n\n!!! note\n    `model_construct()` generally respects the `model_config.extra` setting on the provided model.\n    That is, if `model_config.extra == 'allow'`, then all extra passed values are added to the model instance's `__dict__`\n    and `__pydantic_extra__` fields. If `model_config.extra == 'ignore'` (the default), then all extra passed values are ignored.\n    Because no validation is performed with a call to `model_construct()`, having `model_config.extra == 'forbid'` does not result in\n    an error if extra values are passed, but they will be ignored.\n\nArgs:\n    _fields_set: A set of field names that were originally explicitly set during instantiation. If provided,\n        this is directly used for the [`model_fields_set`][pydantic.BaseModel.model_fields_set] attribute.\n        Otherwise, the field names from the `values` argument will be used.\n    values: Trusted or pre-validated data dictionary.\n\nReturns:\n    A new instance of the `Model` class with validated data."},"machinable.schema.Project.model_copy":{kind:"routine",realname:"model_copy",name:"machinable.schema",path:"machinable.schema.Project.model_copy",signature:"(self, *, update: 'Mapping[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`!!! abstract "Usage Documentation"
    [\`model_copy\`](../concepts/models.md#model-copy)

Returns a copy of the model.

!!! note
    The underlying instance's [\`__dict__\`][object.__dict__] attribute is copied. This
    might have unexpected side effects if you store anything in it, on top of the model
    fields (e.g. the value of [cached properties][functools.cached_property]).

Args:
    update: Values to change/add in the new model. Note: the data is not validated
        before creating the new model. You should trust this data.
    deep: Set to \`True\` to make a deep copy of the model.

Returns:
    New model instance.`},"machinable.schema.Project.model_dump":{kind:"routine",realname:"model_dump",name:"machinable.schema",path:"machinable.schema.Project.model_dump",signature:`(self, *, mode: "Literal['json', 'python'] | str" = 'python', include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'dict[str, Any]'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump\`](../concepts/serialization.md#python-mode)

Generate a dictionary representation of the model, optionally specifying which fields to include or exclude.

Args:
    mode: The mode in which \`to_python\` should run.
        If mode is 'json', the output will only contain JSON serializable types.
        If mode is 'python', the output may contain non-JSON-serializable Python objects.
    include: A set of fields to include in the output.
    exclude: A set of fields to exclude from the output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to use the field's alias in the dictionary key if defined.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A dictionary representation of the model.`},"machinable.schema.Project.model_dump_json":{kind:"routine",realname:"model_dump_json",name:"machinable.schema",path:"machinable.schema.Project.model_dump_json",signature:`(self, *, indent: 'int | None' = None, ensure_ascii: 'bool' = False, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'str'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump_json\`](../concepts/serialization.md#json-mode)

Generates a JSON representation of the model using Pydantic's \`to_json\` method.

Args:
    indent: Indentation to use in the JSON output. If None is passed, the output will be compact.
    ensure_ascii: If \`True\`, the output is guaranteed to have all incoming non-ASCII characters escaped.
        If \`False\` (the default), these characters will be output as-is.
    include: Field(s) to include in the JSON output.
    exclude: Field(s) to exclude from the JSON output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to serialize using field aliases.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A JSON string representation of the model.`},"machinable.schema.Project.model_json_schema":{kind:"routine",realname:"model_json_schema",name:"machinable.schema",path:"machinable.schema.Project.model_json_schema",signature:null,doc:"Generates a JSON schema for a model class.\n\nArgs:\n    by_alias: Whether to use attribute aliases or not.\n    ref_template: The reference template.\n    union_format: The format to use when combining schemas from unions together. Can be one of:\n\n        - `'any_of'`: Use the [`anyOf`](https://json-schema.org/understanding-json-schema/reference/combining#anyOf)\n        keyword to combine schemas (the default).\n        - `'primitive_type_array'`: Use the [`type`](https://json-schema.org/understanding-json-schema/reference/type)\n        keyword as an array of strings, containing each type of the combination. If any of the schemas is not a primitive\n        type (`string`, `boolean`, `null`, `integer` or `number`) or contains constraints/metadata, falls back to\n        `any_of`.\n    schema_generator: To override the logic used to generate the JSON schema, as a subclass of\n        `GenerateJsonSchema` with your desired modifications\n    mode: The mode in which to generate the schema.\n\nReturns:\n    The JSON schema for the given model class."},"machinable.schema.Project.model_parametrized_name":{kind:"routine",realname:"model_parametrized_name",name:"machinable.schema",path:"machinable.schema.Project.model_parametrized_name",signature:null,doc:`Compute the class name for parametrizations of generic classes.

This method can be overridden to achieve a custom naming scheme for generic BaseModels.

Args:
    params: Tuple of types of the class. Given a generic class
        \`Model\` with 2 type variables and a concrete model \`Model[str, int]\`,
        the value \`(str, int)\` would be passed to \`params\`.

Returns:
    String representing the new class where \`params\` are passed to \`cls\` as type variables.

Raises:
    TypeError: Raised when trying to generate concrete names for non-generic models.`},"machinable.schema.Project.model_post_init":{kind:"routine",realname:"init_private_attributes",name:"machinable.schema",path:"machinable.schema.Project.model_post_init",signature:"(self: 'BaseModel', context: 'Any', /) -> 'None'",doc:`This function is meant to behave like a BaseModel method to initialise private attributes.

It takes context as an argument since that's what pydantic-core passes when calling it.

Args:
    self: The BaseModel instance.
    context: The context.`},"machinable.schema.Project.model_rebuild":{kind:"routine",realname:"model_rebuild",name:"machinable.schema",path:"machinable.schema.Project.model_rebuild",signature:null,doc:`Try to rebuild the pydantic-core schema for the model.

This may be necessary when one of the annotations is a ForwardRef which could not be resolved during
the initial attempt to build the schema, and automatic rebuilding fails.

Args:
    force: Whether to force the rebuilding of the model schema, defaults to \`False\`.
    raise_errors: Whether to raise errors, defaults to \`True\`.
    _parent_namespace_depth: The depth level of the parent namespace, defaults to 2.
    _types_namespace: The types namespace, defaults to \`None\`.

Returns:
    Returns \`None\` if the schema is already "complete" and rebuilding was not required.
    If rebuilding _was_ required, returns \`True\` if rebuilding was successful, otherwise \`False\`.`},"machinable.schema.Project.model_validate":{kind:"routine",realname:"model_validate",name:"machinable.schema",path:"machinable.schema.Project.model_validate",signature:null,doc:`Validate a pydantic model instance.

Args:
    obj: The object to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    from_attributes: Whether to extract data from object attributes.
    context: Additional context to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Raises:
    ValidationError: If the object could not be validated.

Returns:
    The validated model instance.`},"machinable.schema.Project.model_validate_json":{kind:"routine",realname:"model_validate_json",name:"machinable.schema",path:"machinable.schema.Project.model_validate_json",signature:null,doc:`!!! abstract "Usage Documentation"
    [JSON Parsing](../concepts/json.md#json-parsing)

Validate the given JSON data against the Pydantic model.

Args:
    json_data: The JSON data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.

Raises:
    ValidationError: If \`json_data\` is not a JSON string or the object could not be validated.`},"machinable.schema.Project.model_validate_strings":{kind:"routine",realname:"model_validate_strings",name:"machinable.schema",path:"machinable.schema.Project.model_validate_strings",signature:null,doc:`Validate the given object with string data against the Pydantic model.

Args:
    obj: The object containing string data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.`},"machinable.schema.Project.parse_file":{kind:"routine",realname:"parse_file",name:"machinable.schema",path:"machinable.schema.Project.parse_file",signature:null,doc:null},"machinable.schema.Project.parse_obj":{kind:"routine",realname:"parse_obj",name:"machinable.schema",path:"machinable.schema.Project.parse_obj",signature:null,doc:null},"machinable.schema.Project.parse_raw":{kind:"routine",realname:"parse_raw",name:"machinable.schema",path:"machinable.schema.Project.parse_raw",signature:null,doc:null},"machinable.schema.Project.schema":{kind:"routine",realname:"schema",name:"machinable.schema",path:"machinable.schema.Project.schema",signature:null,doc:null},"machinable.schema.Project.schema_json":{kind:"routine",realname:"schema_json",name:"machinable.schema",path:"machinable.schema.Project.schema_json",signature:null,doc:null},"machinable.schema.Project.update_forward_refs":{kind:"routine",realname:"update_forward_refs",name:"machinable.schema",path:"machinable.schema.Project.update_forward_refs",signature:null,doc:null},"machinable.schema.Project.validate":{kind:"routine",realname:"validate",name:"machinable.schema",path:"machinable.schema.Project.validate",signature:null,doc:null},"machinable.schema.Project":{kind:"class",realname:"Project",name:"machinable.schema",path:"machinable.schema.Project",parents:["Interface"],doc:`!!! abstract "Usage Documentation"
    [Models](../concepts/models.md)

A base class for creating Pydantic models.

Attributes:
    __class_vars__: The names of the class variables defined on the model.
    __private_attributes__: Metadata about the private attributes of the model.
    __signature__: The synthesized \`__init__\` [\`Signature\`][inspect.Signature] of the model.

    __pydantic_complete__: Whether model building is completed, or if there are still undefined fields.
    __pydantic_core_schema__: The core schema of the model.
    __pydantic_custom_init__: Whether the model has a custom \`__init__\` function.
    __pydantic_decorators__: Metadata containing the decorators defined on the model.
        This replaces \`Model.__validators__\` and \`Model.__root_validators__\` from Pydantic V1.
    __pydantic_generic_metadata__: Metadata for generic models; contains data used for a similar purpose to
        __args__, __origin__, __parameters__ in typing-module generics. May eventually be replaced by these.
    __pydantic_parent_namespace__: Parent namespace of the model, used for automatic rebuilding of models.
    __pydantic_post_init__: The name of the post-init method for the model, if defined.
    __pydantic_root_model__: Whether the model is a [\`RootModel\`][pydantic.root_model.RootModel].
    __pydantic_serializer__: The \`pydantic-core\` \`SchemaSerializer\` used to dump instances of the model.
    __pydantic_validator__: The \`pydantic-core\` \`SchemaValidator\` used to validate instances of the model.

    __pydantic_fields__: A dictionary of field names and their corresponding [\`FieldInfo\`][pydantic.fields.FieldInfo] objects.
    __pydantic_computed_fields__: A dictionary of computed field names and their corresponding [\`ComputedFieldInfo\`][pydantic.fields.ComputedFieldInfo] objects.

    __pydantic_extra__: A dictionary containing extra values, if [\`extra\`][pydantic.config.ConfigDict.extra]
        is set to \`'allow'\`.
    __pydantic_fields_set__: The names of fields explicitly set during instantiation.
    __pydantic_private__: Values of private attributes set on the model instance.`,file:"src/machinable/schema.py"},"machinable.schema.Schedule.construct":{kind:"routine",realname:"construct",name:"machinable.schema",path:"machinable.schema.Schedule.construct",signature:null,doc:null},"machinable.schema.Schedule.copy":{kind:"routine",realname:"copy",name:"machinable.schema",path:"machinable.schema.Schedule.copy",signature:"(self, *, include: 'AbstractSetIntStr | MappingIntStrAny | None' = None, exclude: 'AbstractSetIntStr | MappingIntStrAny | None' = None, update: 'Dict[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`Returns a copy of the model.

!!! warning "Deprecated"
    This method is now deprecated; use \`model_copy\` instead.

If you need \`include\` or \`exclude\`, use:

\`\`\`python {test="skip" lint="skip"}
data = self.model_dump(include=include, exclude=exclude, round_trip=True)
data = {**data, **(update or {})}
copied = self.model_validate(data)
\`\`\`

Args:
    include: Optional set or mapping specifying which fields to include in the copied model.
    exclude: Optional set or mapping specifying which fields to exclude in the copied model.
    update: Optional dictionary of field-value pairs to override field values in the copied model.
    deep: If True, the values of fields that are Pydantic models will be deep-copied.

Returns:
    A copy of the model with included, excluded and updated fields as specified.`},"machinable.schema.Schedule.dict":{kind:"routine",realname:"dict",name:"machinable.schema",path:"machinable.schema.Schedule.dict",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False) -> 'Dict[str, Any]'",doc:null},"machinable.schema.Schedule.extra":{kind:"routine",realname:"extra",name:"machinable.schema",path:"machinable.schema.Schedule.extra",signature:"(self) -> dict",doc:null},"machinable.schema.Schedule.from_orm":{kind:"routine",realname:"from_orm",name:"machinable.schema",path:"machinable.schema.Schedule.from_orm",signature:null,doc:null},"machinable.schema.Schedule.json":{kind:"routine",realname:"json",name:"machinable.schema",path:"machinable.schema.Schedule.json",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, encoder: 'Callable[[Any], Any] | None' = PydanticUndefined, models_as_dict: 'bool' = PydanticUndefined, **dumps_kwargs: 'Any') -> 'str'",doc:null},"machinable.schema.Schedule.model_construct":{kind:"routine",realname:"model_construct",name:"machinable.schema",path:"machinable.schema.Schedule.model_construct",signature:null,doc:"Creates a new instance of the `Model` class with validated data.\n\nCreates a new model setting `__dict__` and `__pydantic_fields_set__` from trusted or pre-validated data.\nDefault values are respected, but no other validation is performed.\n\n!!! note\n    `model_construct()` generally respects the `model_config.extra` setting on the provided model.\n    That is, if `model_config.extra == 'allow'`, then all extra passed values are added to the model instance's `__dict__`\n    and `__pydantic_extra__` fields. If `model_config.extra == 'ignore'` (the default), then all extra passed values are ignored.\n    Because no validation is performed with a call to `model_construct()`, having `model_config.extra == 'forbid'` does not result in\n    an error if extra values are passed, but they will be ignored.\n\nArgs:\n    _fields_set: A set of field names that were originally explicitly set during instantiation. If provided,\n        this is directly used for the [`model_fields_set`][pydantic.BaseModel.model_fields_set] attribute.\n        Otherwise, the field names from the `values` argument will be used.\n    values: Trusted or pre-validated data dictionary.\n\nReturns:\n    A new instance of the `Model` class with validated data."},"machinable.schema.Schedule.model_copy":{kind:"routine",realname:"model_copy",name:"machinable.schema",path:"machinable.schema.Schedule.model_copy",signature:"(self, *, update: 'Mapping[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`!!! abstract "Usage Documentation"
    [\`model_copy\`](../concepts/models.md#model-copy)

Returns a copy of the model.

!!! note
    The underlying instance's [\`__dict__\`][object.__dict__] attribute is copied. This
    might have unexpected side effects if you store anything in it, on top of the model
    fields (e.g. the value of [cached properties][functools.cached_property]).

Args:
    update: Values to change/add in the new model. Note: the data is not validated
        before creating the new model. You should trust this data.
    deep: Set to \`True\` to make a deep copy of the model.

Returns:
    New model instance.`},"machinable.schema.Schedule.model_dump":{kind:"routine",realname:"model_dump",name:"machinable.schema",path:"machinable.schema.Schedule.model_dump",signature:`(self, *, mode: "Literal['json', 'python'] | str" = 'python', include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'dict[str, Any]'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump\`](../concepts/serialization.md#python-mode)

Generate a dictionary representation of the model, optionally specifying which fields to include or exclude.

Args:
    mode: The mode in which \`to_python\` should run.
        If mode is 'json', the output will only contain JSON serializable types.
        If mode is 'python', the output may contain non-JSON-serializable Python objects.
    include: A set of fields to include in the output.
    exclude: A set of fields to exclude from the output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to use the field's alias in the dictionary key if defined.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A dictionary representation of the model.`},"machinable.schema.Schedule.model_dump_json":{kind:"routine",realname:"model_dump_json",name:"machinable.schema",path:"machinable.schema.Schedule.model_dump_json",signature:`(self, *, indent: 'int | None' = None, ensure_ascii: 'bool' = False, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'str'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump_json\`](../concepts/serialization.md#json-mode)

Generates a JSON representation of the model using Pydantic's \`to_json\` method.

Args:
    indent: Indentation to use in the JSON output. If None is passed, the output will be compact.
    ensure_ascii: If \`True\`, the output is guaranteed to have all incoming non-ASCII characters escaped.
        If \`False\` (the default), these characters will be output as-is.
    include: Field(s) to include in the JSON output.
    exclude: Field(s) to exclude from the JSON output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to serialize using field aliases.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A JSON string representation of the model.`},"machinable.schema.Schedule.model_json_schema":{kind:"routine",realname:"model_json_schema",name:"machinable.schema",path:"machinable.schema.Schedule.model_json_schema",signature:null,doc:"Generates a JSON schema for a model class.\n\nArgs:\n    by_alias: Whether to use attribute aliases or not.\n    ref_template: The reference template.\n    union_format: The format to use when combining schemas from unions together. Can be one of:\n\n        - `'any_of'`: Use the [`anyOf`](https://json-schema.org/understanding-json-schema/reference/combining#anyOf)\n        keyword to combine schemas (the default).\n        - `'primitive_type_array'`: Use the [`type`](https://json-schema.org/understanding-json-schema/reference/type)\n        keyword as an array of strings, containing each type of the combination. If any of the schemas is not a primitive\n        type (`string`, `boolean`, `null`, `integer` or `number`) or contains constraints/metadata, falls back to\n        `any_of`.\n    schema_generator: To override the logic used to generate the JSON schema, as a subclass of\n        `GenerateJsonSchema` with your desired modifications\n    mode: The mode in which to generate the schema.\n\nReturns:\n    The JSON schema for the given model class."},"machinable.schema.Schedule.model_parametrized_name":{kind:"routine",realname:"model_parametrized_name",name:"machinable.schema",path:"machinable.schema.Schedule.model_parametrized_name",signature:null,doc:`Compute the class name for parametrizations of generic classes.

This method can be overridden to achieve a custom naming scheme for generic BaseModels.

Args:
    params: Tuple of types of the class. Given a generic class
        \`Model\` with 2 type variables and a concrete model \`Model[str, int]\`,
        the value \`(str, int)\` would be passed to \`params\`.

Returns:
    String representing the new class where \`params\` are passed to \`cls\` as type variables.

Raises:
    TypeError: Raised when trying to generate concrete names for non-generic models.`},"machinable.schema.Schedule.model_post_init":{kind:"routine",realname:"init_private_attributes",name:"machinable.schema",path:"machinable.schema.Schedule.model_post_init",signature:"(self: 'BaseModel', context: 'Any', /) -> 'None'",doc:`This function is meant to behave like a BaseModel method to initialise private attributes.

It takes context as an argument since that's what pydantic-core passes when calling it.

Args:
    self: The BaseModel instance.
    context: The context.`},"machinable.schema.Schedule.model_rebuild":{kind:"routine",realname:"model_rebuild",name:"machinable.schema",path:"machinable.schema.Schedule.model_rebuild",signature:null,doc:`Try to rebuild the pydantic-core schema for the model.

This may be necessary when one of the annotations is a ForwardRef which could not be resolved during
the initial attempt to build the schema, and automatic rebuilding fails.

Args:
    force: Whether to force the rebuilding of the model schema, defaults to \`False\`.
    raise_errors: Whether to raise errors, defaults to \`True\`.
    _parent_namespace_depth: The depth level of the parent namespace, defaults to 2.
    _types_namespace: The types namespace, defaults to \`None\`.

Returns:
    Returns \`None\` if the schema is already "complete" and rebuilding was not required.
    If rebuilding _was_ required, returns \`True\` if rebuilding was successful, otherwise \`False\`.`},"machinable.schema.Schedule.model_validate":{kind:"routine",realname:"model_validate",name:"machinable.schema",path:"machinable.schema.Schedule.model_validate",signature:null,doc:`Validate a pydantic model instance.

Args:
    obj: The object to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    from_attributes: Whether to extract data from object attributes.
    context: Additional context to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Raises:
    ValidationError: If the object could not be validated.

Returns:
    The validated model instance.`},"machinable.schema.Schedule.model_validate_json":{kind:"routine",realname:"model_validate_json",name:"machinable.schema",path:"machinable.schema.Schedule.model_validate_json",signature:null,doc:`!!! abstract "Usage Documentation"
    [JSON Parsing](../concepts/json.md#json-parsing)

Validate the given JSON data against the Pydantic model.

Args:
    json_data: The JSON data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.

Raises:
    ValidationError: If \`json_data\` is not a JSON string or the object could not be validated.`},"machinable.schema.Schedule.model_validate_strings":{kind:"routine",realname:"model_validate_strings",name:"machinable.schema",path:"machinable.schema.Schedule.model_validate_strings",signature:null,doc:`Validate the given object with string data against the Pydantic model.

Args:
    obj: The object containing string data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.`},"machinable.schema.Schedule.parse_file":{kind:"routine",realname:"parse_file",name:"machinable.schema",path:"machinable.schema.Schedule.parse_file",signature:null,doc:null},"machinable.schema.Schedule.parse_obj":{kind:"routine",realname:"parse_obj",name:"machinable.schema",path:"machinable.schema.Schedule.parse_obj",signature:null,doc:null},"machinable.schema.Schedule.parse_raw":{kind:"routine",realname:"parse_raw",name:"machinable.schema",path:"machinable.schema.Schedule.parse_raw",signature:null,doc:null},"machinable.schema.Schedule.schema":{kind:"routine",realname:"schema",name:"machinable.schema",path:"machinable.schema.Schedule.schema",signature:null,doc:null},"machinable.schema.Schedule.schema_json":{kind:"routine",realname:"schema_json",name:"machinable.schema",path:"machinable.schema.Schedule.schema_json",signature:null,doc:null},"machinable.schema.Schedule.update_forward_refs":{kind:"routine",realname:"update_forward_refs",name:"machinable.schema",path:"machinable.schema.Schedule.update_forward_refs",signature:null,doc:null},"machinable.schema.Schedule.validate":{kind:"routine",realname:"validate",name:"machinable.schema",path:"machinable.schema.Schedule.validate",signature:null,doc:null},"machinable.schema.Schedule":{kind:"class",realname:"Schedule",name:"machinable.schema",path:"machinable.schema.Schedule",parents:["Interface"],doc:`!!! abstract "Usage Documentation"
    [Models](../concepts/models.md)

A base class for creating Pydantic models.

Attributes:
    __class_vars__: The names of the class variables defined on the model.
    __private_attributes__: Metadata about the private attributes of the model.
    __signature__: The synthesized \`__init__\` [\`Signature\`][inspect.Signature] of the model.

    __pydantic_complete__: Whether model building is completed, or if there are still undefined fields.
    __pydantic_core_schema__: The core schema of the model.
    __pydantic_custom_init__: Whether the model has a custom \`__init__\` function.
    __pydantic_decorators__: Metadata containing the decorators defined on the model.
        This replaces \`Model.__validators__\` and \`Model.__root_validators__\` from Pydantic V1.
    __pydantic_generic_metadata__: Metadata for generic models; contains data used for a similar purpose to
        __args__, __origin__, __parameters__ in typing-module generics. May eventually be replaced by these.
    __pydantic_parent_namespace__: Parent namespace of the model, used for automatic rebuilding of models.
    __pydantic_post_init__: The name of the post-init method for the model, if defined.
    __pydantic_root_model__: Whether the model is a [\`RootModel\`][pydantic.root_model.RootModel].
    __pydantic_serializer__: The \`pydantic-core\` \`SchemaSerializer\` used to dump instances of the model.
    __pydantic_validator__: The \`pydantic-core\` \`SchemaValidator\` used to validate instances of the model.

    __pydantic_fields__: A dictionary of field names and their corresponding [\`FieldInfo\`][pydantic.fields.FieldInfo] objects.
    __pydantic_computed_fields__: A dictionary of computed field names and their corresponding [\`ComputedFieldInfo\`][pydantic.fields.ComputedFieldInfo] objects.

    __pydantic_extra__: A dictionary containing extra values, if [\`extra\`][pydantic.config.ConfigDict.extra]
        is set to \`'allow'\`.
    __pydantic_fields_set__: The names of fields explicitly set during instantiation.
    __pydantic_private__: Values of private attributes set on the model instance.`,file:"src/machinable/schema.py"},"machinable.schema.Scope.construct":{kind:"routine",realname:"construct",name:"machinable.schema",path:"machinable.schema.Scope.construct",signature:null,doc:null},"machinable.schema.Scope.copy":{kind:"routine",realname:"copy",name:"machinable.schema",path:"machinable.schema.Scope.copy",signature:"(self, *, include: 'AbstractSetIntStr | MappingIntStrAny | None' = None, exclude: 'AbstractSetIntStr | MappingIntStrAny | None' = None, update: 'Dict[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`Returns a copy of the model.

!!! warning "Deprecated"
    This method is now deprecated; use \`model_copy\` instead.

If you need \`include\` or \`exclude\`, use:

\`\`\`python {test="skip" lint="skip"}
data = self.model_dump(include=include, exclude=exclude, round_trip=True)
data = {**data, **(update or {})}
copied = self.model_validate(data)
\`\`\`

Args:
    include: Optional set or mapping specifying which fields to include in the copied model.
    exclude: Optional set or mapping specifying which fields to exclude in the copied model.
    update: Optional dictionary of field-value pairs to override field values in the copied model.
    deep: If True, the values of fields that are Pydantic models will be deep-copied.

Returns:
    A copy of the model with included, excluded and updated fields as specified.`},"machinable.schema.Scope.dict":{kind:"routine",realname:"dict",name:"machinable.schema",path:"machinable.schema.Scope.dict",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False) -> 'Dict[str, Any]'",doc:null},"machinable.schema.Scope.extra":{kind:"routine",realname:"extra",name:"machinable.schema",path:"machinable.schema.Scope.extra",signature:"(self) -> dict",doc:null},"machinable.schema.Scope.from_orm":{kind:"routine",realname:"from_orm",name:"machinable.schema",path:"machinable.schema.Scope.from_orm",signature:null,doc:null},"machinable.schema.Scope.json":{kind:"routine",realname:"json",name:"machinable.schema",path:"machinable.schema.Scope.json",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, encoder: 'Callable[[Any], Any] | None' = PydanticUndefined, models_as_dict: 'bool' = PydanticUndefined, **dumps_kwargs: 'Any') -> 'str'",doc:null},"machinable.schema.Scope.model_construct":{kind:"routine",realname:"model_construct",name:"machinable.schema",path:"machinable.schema.Scope.model_construct",signature:null,doc:"Creates a new instance of the `Model` class with validated data.\n\nCreates a new model setting `__dict__` and `__pydantic_fields_set__` from trusted or pre-validated data.\nDefault values are respected, but no other validation is performed.\n\n!!! note\n    `model_construct()` generally respects the `model_config.extra` setting on the provided model.\n    That is, if `model_config.extra == 'allow'`, then all extra passed values are added to the model instance's `__dict__`\n    and `__pydantic_extra__` fields. If `model_config.extra == 'ignore'` (the default), then all extra passed values are ignored.\n    Because no validation is performed with a call to `model_construct()`, having `model_config.extra == 'forbid'` does not result in\n    an error if extra values are passed, but they will be ignored.\n\nArgs:\n    _fields_set: A set of field names that were originally explicitly set during instantiation. If provided,\n        this is directly used for the [`model_fields_set`][pydantic.BaseModel.model_fields_set] attribute.\n        Otherwise, the field names from the `values` argument will be used.\n    values: Trusted or pre-validated data dictionary.\n\nReturns:\n    A new instance of the `Model` class with validated data."},"machinable.schema.Scope.model_copy":{kind:"routine",realname:"model_copy",name:"machinable.schema",path:"machinable.schema.Scope.model_copy",signature:"(self, *, update: 'Mapping[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`!!! abstract "Usage Documentation"
    [\`model_copy\`](../concepts/models.md#model-copy)

Returns a copy of the model.

!!! note
    The underlying instance's [\`__dict__\`][object.__dict__] attribute is copied. This
    might have unexpected side effects if you store anything in it, on top of the model
    fields (e.g. the value of [cached properties][functools.cached_property]).

Args:
    update: Values to change/add in the new model. Note: the data is not validated
        before creating the new model. You should trust this data.
    deep: Set to \`True\` to make a deep copy of the model.

Returns:
    New model instance.`},"machinable.schema.Scope.model_dump":{kind:"routine",realname:"model_dump",name:"machinable.schema",path:"machinable.schema.Scope.model_dump",signature:`(self, *, mode: "Literal['json', 'python'] | str" = 'python', include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'dict[str, Any]'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump\`](../concepts/serialization.md#python-mode)

Generate a dictionary representation of the model, optionally specifying which fields to include or exclude.

Args:
    mode: The mode in which \`to_python\` should run.
        If mode is 'json', the output will only contain JSON serializable types.
        If mode is 'python', the output may contain non-JSON-serializable Python objects.
    include: A set of fields to include in the output.
    exclude: A set of fields to exclude from the output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to use the field's alias in the dictionary key if defined.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A dictionary representation of the model.`},"machinable.schema.Scope.model_dump_json":{kind:"routine",realname:"model_dump_json",name:"machinable.schema",path:"machinable.schema.Scope.model_dump_json",signature:`(self, *, indent: 'int | None' = None, ensure_ascii: 'bool' = False, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'str'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump_json\`](../concepts/serialization.md#json-mode)

Generates a JSON representation of the model using Pydantic's \`to_json\` method.

Args:
    indent: Indentation to use in the JSON output. If None is passed, the output will be compact.
    ensure_ascii: If \`True\`, the output is guaranteed to have all incoming non-ASCII characters escaped.
        If \`False\` (the default), these characters will be output as-is.
    include: Field(s) to include in the JSON output.
    exclude: Field(s) to exclude from the JSON output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to serialize using field aliases.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A JSON string representation of the model.`},"machinable.schema.Scope.model_json_schema":{kind:"routine",realname:"model_json_schema",name:"machinable.schema",path:"machinable.schema.Scope.model_json_schema",signature:null,doc:"Generates a JSON schema for a model class.\n\nArgs:\n    by_alias: Whether to use attribute aliases or not.\n    ref_template: The reference template.\n    union_format: The format to use when combining schemas from unions together. Can be one of:\n\n        - `'any_of'`: Use the [`anyOf`](https://json-schema.org/understanding-json-schema/reference/combining#anyOf)\n        keyword to combine schemas (the default).\n        - `'primitive_type_array'`: Use the [`type`](https://json-schema.org/understanding-json-schema/reference/type)\n        keyword as an array of strings, containing each type of the combination. If any of the schemas is not a primitive\n        type (`string`, `boolean`, `null`, `integer` or `number`) or contains constraints/metadata, falls back to\n        `any_of`.\n    schema_generator: To override the logic used to generate the JSON schema, as a subclass of\n        `GenerateJsonSchema` with your desired modifications\n    mode: The mode in which to generate the schema.\n\nReturns:\n    The JSON schema for the given model class."},"machinable.schema.Scope.model_parametrized_name":{kind:"routine",realname:"model_parametrized_name",name:"machinable.schema",path:"machinable.schema.Scope.model_parametrized_name",signature:null,doc:`Compute the class name for parametrizations of generic classes.

This method can be overridden to achieve a custom naming scheme for generic BaseModels.

Args:
    params: Tuple of types of the class. Given a generic class
        \`Model\` with 2 type variables and a concrete model \`Model[str, int]\`,
        the value \`(str, int)\` would be passed to \`params\`.

Returns:
    String representing the new class where \`params\` are passed to \`cls\` as type variables.

Raises:
    TypeError: Raised when trying to generate concrete names for non-generic models.`},"machinable.schema.Scope.model_post_init":{kind:"routine",realname:"model_post_init",name:"machinable.schema",path:"machinable.schema.Scope.model_post_init",signature:"(self, context: 'Any', /) -> 'None'",doc:"Override this method to perform additional initialization after `__init__` and `model_construct`.\nThis is useful if you want to do some validation that requires the entire model to be initialized."},"machinable.schema.Scope.model_rebuild":{kind:"routine",realname:"model_rebuild",name:"machinable.schema",path:"machinable.schema.Scope.model_rebuild",signature:null,doc:`Try to rebuild the pydantic-core schema for the model.

This may be necessary when one of the annotations is a ForwardRef which could not be resolved during
the initial attempt to build the schema, and automatic rebuilding fails.

Args:
    force: Whether to force the rebuilding of the model schema, defaults to \`False\`.
    raise_errors: Whether to raise errors, defaults to \`True\`.
    _parent_namespace_depth: The depth level of the parent namespace, defaults to 2.
    _types_namespace: The types namespace, defaults to \`None\`.

Returns:
    Returns \`None\` if the schema is already "complete" and rebuilding was not required.
    If rebuilding _was_ required, returns \`True\` if rebuilding was successful, otherwise \`False\`.`},"machinable.schema.Scope.model_validate":{kind:"routine",realname:"model_validate",name:"machinable.schema",path:"machinable.schema.Scope.model_validate",signature:null,doc:`Validate a pydantic model instance.

Args:
    obj: The object to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    from_attributes: Whether to extract data from object attributes.
    context: Additional context to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Raises:
    ValidationError: If the object could not be validated.

Returns:
    The validated model instance.`},"machinable.schema.Scope.model_validate_json":{kind:"routine",realname:"model_validate_json",name:"machinable.schema",path:"machinable.schema.Scope.model_validate_json",signature:null,doc:`!!! abstract "Usage Documentation"
    [JSON Parsing](../concepts/json.md#json-parsing)

Validate the given JSON data against the Pydantic model.

Args:
    json_data: The JSON data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.

Raises:
    ValidationError: If \`json_data\` is not a JSON string or the object could not be validated.`},"machinable.schema.Scope.model_validate_strings":{kind:"routine",realname:"model_validate_strings",name:"machinable.schema",path:"machinable.schema.Scope.model_validate_strings",signature:null,doc:`Validate the given object with string data against the Pydantic model.

Args:
    obj: The object containing string data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.`},"machinable.schema.Scope.parse_file":{kind:"routine",realname:"parse_file",name:"machinable.schema",path:"machinable.schema.Scope.parse_file",signature:null,doc:null},"machinable.schema.Scope.parse_obj":{kind:"routine",realname:"parse_obj",name:"machinable.schema",path:"machinable.schema.Scope.parse_obj",signature:null,doc:null},"machinable.schema.Scope.parse_raw":{kind:"routine",realname:"parse_raw",name:"machinable.schema",path:"machinable.schema.Scope.parse_raw",signature:null,doc:null},"machinable.schema.Scope.schema":{kind:"routine",realname:"schema",name:"machinable.schema",path:"machinable.schema.Scope.schema",signature:null,doc:null},"machinable.schema.Scope.schema_json":{kind:"routine",realname:"schema_json",name:"machinable.schema",path:"machinable.schema.Scope.schema_json",signature:null,doc:null},"machinable.schema.Scope.update_forward_refs":{kind:"routine",realname:"update_forward_refs",name:"machinable.schema",path:"machinable.schema.Scope.update_forward_refs",signature:null,doc:null},"machinable.schema.Scope.validate":{kind:"routine",realname:"validate",name:"machinable.schema",path:"machinable.schema.Scope.validate",signature:null,doc:null},"machinable.schema.Scope":{kind:"class",realname:"Scope",name:"machinable.schema",path:"machinable.schema.Scope",parents:["Element"],doc:`!!! abstract "Usage Documentation"
    [Models](../concepts/models.md)

A base class for creating Pydantic models.

Attributes:
    __class_vars__: The names of the class variables defined on the model.
    __private_attributes__: Metadata about the private attributes of the model.
    __signature__: The synthesized \`__init__\` [\`Signature\`][inspect.Signature] of the model.

    __pydantic_complete__: Whether model building is completed, or if there are still undefined fields.
    __pydantic_core_schema__: The core schema of the model.
    __pydantic_custom_init__: Whether the model has a custom \`__init__\` function.
    __pydantic_decorators__: Metadata containing the decorators defined on the model.
        This replaces \`Model.__validators__\` and \`Model.__root_validators__\` from Pydantic V1.
    __pydantic_generic_metadata__: Metadata for generic models; contains data used for a similar purpose to
        __args__, __origin__, __parameters__ in typing-module generics. May eventually be replaced by these.
    __pydantic_parent_namespace__: Parent namespace of the model, used for automatic rebuilding of models.
    __pydantic_post_init__: The name of the post-init method for the model, if defined.
    __pydantic_root_model__: Whether the model is a [\`RootModel\`][pydantic.root_model.RootModel].
    __pydantic_serializer__: The \`pydantic-core\` \`SchemaSerializer\` used to dump instances of the model.
    __pydantic_validator__: The \`pydantic-core\` \`SchemaValidator\` used to validate instances of the model.

    __pydantic_fields__: A dictionary of field names and their corresponding [\`FieldInfo\`][pydantic.fields.FieldInfo] objects.
    __pydantic_computed_fields__: A dictionary of computed field names and their corresponding [\`ComputedFieldInfo\`][pydantic.fields.ComputedFieldInfo] objects.

    __pydantic_extra__: A dictionary containing extra values, if [\`extra\`][pydantic.config.ConfigDict.extra]
        is set to \`'allow'\`.
    __pydantic_fields_set__: The names of fields explicitly set during instantiation.
    __pydantic_private__: Values of private attributes set on the model instance.`,file:"src/machinable/schema.py"},"machinable.schema.Storage.construct":{kind:"routine",realname:"construct",name:"machinable.schema",path:"machinable.schema.Storage.construct",signature:null,doc:null},"machinable.schema.Storage.copy":{kind:"routine",realname:"copy",name:"machinable.schema",path:"machinable.schema.Storage.copy",signature:"(self, *, include: 'AbstractSetIntStr | MappingIntStrAny | None' = None, exclude: 'AbstractSetIntStr | MappingIntStrAny | None' = None, update: 'Dict[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`Returns a copy of the model.

!!! warning "Deprecated"
    This method is now deprecated; use \`model_copy\` instead.

If you need \`include\` or \`exclude\`, use:

\`\`\`python {test="skip" lint="skip"}
data = self.model_dump(include=include, exclude=exclude, round_trip=True)
data = {**data, **(update or {})}
copied = self.model_validate(data)
\`\`\`

Args:
    include: Optional set or mapping specifying which fields to include in the copied model.
    exclude: Optional set or mapping specifying which fields to exclude in the copied model.
    update: Optional dictionary of field-value pairs to override field values in the copied model.
    deep: If True, the values of fields that are Pydantic models will be deep-copied.

Returns:
    A copy of the model with included, excluded and updated fields as specified.`},"machinable.schema.Storage.dict":{kind:"routine",realname:"dict",name:"machinable.schema",path:"machinable.schema.Storage.dict",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False) -> 'Dict[str, Any]'",doc:null},"machinable.schema.Storage.extra":{kind:"routine",realname:"extra",name:"machinable.schema",path:"machinable.schema.Storage.extra",signature:"(self) -> dict",doc:null},"machinable.schema.Storage.from_orm":{kind:"routine",realname:"from_orm",name:"machinable.schema",path:"machinable.schema.Storage.from_orm",signature:null,doc:null},"machinable.schema.Storage.json":{kind:"routine",realname:"json",name:"machinable.schema",path:"machinable.schema.Storage.json",signature:"(self, *, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, by_alias: 'bool' = False, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, encoder: 'Callable[[Any], Any] | None' = PydanticUndefined, models_as_dict: 'bool' = PydanticUndefined, **dumps_kwargs: 'Any') -> 'str'",doc:null},"machinable.schema.Storage.model_construct":{kind:"routine",realname:"model_construct",name:"machinable.schema",path:"machinable.schema.Storage.model_construct",signature:null,doc:"Creates a new instance of the `Model` class with validated data.\n\nCreates a new model setting `__dict__` and `__pydantic_fields_set__` from trusted or pre-validated data.\nDefault values are respected, but no other validation is performed.\n\n!!! note\n    `model_construct()` generally respects the `model_config.extra` setting on the provided model.\n    That is, if `model_config.extra == 'allow'`, then all extra passed values are added to the model instance's `__dict__`\n    and `__pydantic_extra__` fields. If `model_config.extra == 'ignore'` (the default), then all extra passed values are ignored.\n    Because no validation is performed with a call to `model_construct()`, having `model_config.extra == 'forbid'` does not result in\n    an error if extra values are passed, but they will be ignored.\n\nArgs:\n    _fields_set: A set of field names that were originally explicitly set during instantiation. If provided,\n        this is directly used for the [`model_fields_set`][pydantic.BaseModel.model_fields_set] attribute.\n        Otherwise, the field names from the `values` argument will be used.\n    values: Trusted or pre-validated data dictionary.\n\nReturns:\n    A new instance of the `Model` class with validated data."},"machinable.schema.Storage.model_copy":{kind:"routine",realname:"model_copy",name:"machinable.schema",path:"machinable.schema.Storage.model_copy",signature:"(self, *, update: 'Mapping[str, Any] | None' = None, deep: 'bool' = False) -> 'Self'",doc:`!!! abstract "Usage Documentation"
    [\`model_copy\`](../concepts/models.md#model-copy)

Returns a copy of the model.

!!! note
    The underlying instance's [\`__dict__\`][object.__dict__] attribute is copied. This
    might have unexpected side effects if you store anything in it, on top of the model
    fields (e.g. the value of [cached properties][functools.cached_property]).

Args:
    update: Values to change/add in the new model. Note: the data is not validated
        before creating the new model. You should trust this data.
    deep: Set to \`True\` to make a deep copy of the model.

Returns:
    New model instance.`},"machinable.schema.Storage.model_dump":{kind:"routine",realname:"model_dump",name:"machinable.schema",path:"machinable.schema.Storage.model_dump",signature:`(self, *, mode: "Literal['json', 'python'] | str" = 'python', include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'dict[str, Any]'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump\`](../concepts/serialization.md#python-mode)

Generate a dictionary representation of the model, optionally specifying which fields to include or exclude.

Args:
    mode: The mode in which \`to_python\` should run.
        If mode is 'json', the output will only contain JSON serializable types.
        If mode is 'python', the output may contain non-JSON-serializable Python objects.
    include: A set of fields to include in the output.
    exclude: A set of fields to exclude from the output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to use the field's alias in the dictionary key if defined.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A dictionary representation of the model.`},"machinable.schema.Storage.model_dump_json":{kind:"routine",realname:"model_dump_json",name:"machinable.schema",path:"machinable.schema.Storage.model_dump_json",signature:`(self, *, indent: 'int | None' = None, ensure_ascii: 'bool' = False, include: 'IncEx | None' = None, exclude: 'IncEx | None' = None, context: 'Any | None' = None, by_alias: 'bool | None' = None, exclude_unset: 'bool' = False, exclude_defaults: 'bool' = False, exclude_none: 'bool' = False, exclude_computed_fields: 'bool' = False, round_trip: 'bool' = False, warnings: "bool | Literal['none', 'warn', 'error']" = True, fallback: 'Callable[[Any], Any] | None' = None, serialize_as_any: 'bool' = False) -> 'str'`,doc:`!!! abstract "Usage Documentation"
    [\`model_dump_json\`](../concepts/serialization.md#json-mode)

Generates a JSON representation of the model using Pydantic's \`to_json\` method.

Args:
    indent: Indentation to use in the JSON output. If None is passed, the output will be compact.
    ensure_ascii: If \`True\`, the output is guaranteed to have all incoming non-ASCII characters escaped.
        If \`False\` (the default), these characters will be output as-is.
    include: Field(s) to include in the JSON output.
    exclude: Field(s) to exclude from the JSON output.
    context: Additional context to pass to the serializer.
    by_alias: Whether to serialize using field aliases.
    exclude_unset: Whether to exclude fields that have not been explicitly set.
    exclude_defaults: Whether to exclude fields that are set to their default value.
    exclude_none: Whether to exclude fields that have a value of \`None\`.
    exclude_computed_fields: Whether to exclude computed fields.
        While this can be useful for round-tripping, it is usually recommended to use the dedicated
        \`round_trip\` parameter instead.
    round_trip: If True, dumped values should be valid as input for non-idempotent types such as Json[T].
    warnings: How to handle serialization errors. False/"none" ignores them, True/"warn" logs errors,
        "error" raises a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError].
    fallback: A function to call when an unknown value is encountered. If not provided,
        a [\`PydanticSerializationError\`][pydantic_core.PydanticSerializationError] error is raised.
    serialize_as_any: Whether to serialize fields with duck-typing serialization behavior.

Returns:
    A JSON string representation of the model.`},"machinable.schema.Storage.model_json_schema":{kind:"routine",realname:"model_json_schema",name:"machinable.schema",path:"machinable.schema.Storage.model_json_schema",signature:null,doc:"Generates a JSON schema for a model class.\n\nArgs:\n    by_alias: Whether to use attribute aliases or not.\n    ref_template: The reference template.\n    union_format: The format to use when combining schemas from unions together. Can be one of:\n\n        - `'any_of'`: Use the [`anyOf`](https://json-schema.org/understanding-json-schema/reference/combining#anyOf)\n        keyword to combine schemas (the default).\n        - `'primitive_type_array'`: Use the [`type`](https://json-schema.org/understanding-json-schema/reference/type)\n        keyword as an array of strings, containing each type of the combination. If any of the schemas is not a primitive\n        type (`string`, `boolean`, `null`, `integer` or `number`) or contains constraints/metadata, falls back to\n        `any_of`.\n    schema_generator: To override the logic used to generate the JSON schema, as a subclass of\n        `GenerateJsonSchema` with your desired modifications\n    mode: The mode in which to generate the schema.\n\nReturns:\n    The JSON schema for the given model class."},"machinable.schema.Storage.model_parametrized_name":{kind:"routine",realname:"model_parametrized_name",name:"machinable.schema",path:"machinable.schema.Storage.model_parametrized_name",signature:null,doc:`Compute the class name for parametrizations of generic classes.

This method can be overridden to achieve a custom naming scheme for generic BaseModels.

Args:
    params: Tuple of types of the class. Given a generic class
        \`Model\` with 2 type variables and a concrete model \`Model[str, int]\`,
        the value \`(str, int)\` would be passed to \`params\`.

Returns:
    String representing the new class where \`params\` are passed to \`cls\` as type variables.

Raises:
    TypeError: Raised when trying to generate concrete names for non-generic models.`},"machinable.schema.Storage.model_post_init":{kind:"routine",realname:"model_post_init",name:"machinable.schema",path:"machinable.schema.Storage.model_post_init",signature:"(self, context: 'Any', /) -> 'None'",doc:"Override this method to perform additional initialization after `__init__` and `model_construct`.\nThis is useful if you want to do some validation that requires the entire model to be initialized."},"machinable.schema.Storage.model_rebuild":{kind:"routine",realname:"model_rebuild",name:"machinable.schema",path:"machinable.schema.Storage.model_rebuild",signature:null,doc:`Try to rebuild the pydantic-core schema for the model.

This may be necessary when one of the annotations is a ForwardRef which could not be resolved during
the initial attempt to build the schema, and automatic rebuilding fails.

Args:
    force: Whether to force the rebuilding of the model schema, defaults to \`False\`.
    raise_errors: Whether to raise errors, defaults to \`True\`.
    _parent_namespace_depth: The depth level of the parent namespace, defaults to 2.
    _types_namespace: The types namespace, defaults to \`None\`.

Returns:
    Returns \`None\` if the schema is already "complete" and rebuilding was not required.
    If rebuilding _was_ required, returns \`True\` if rebuilding was successful, otherwise \`False\`.`},"machinable.schema.Storage.model_validate":{kind:"routine",realname:"model_validate",name:"machinable.schema",path:"machinable.schema.Storage.model_validate",signature:null,doc:`Validate a pydantic model instance.

Args:
    obj: The object to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    from_attributes: Whether to extract data from object attributes.
    context: Additional context to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Raises:
    ValidationError: If the object could not be validated.

Returns:
    The validated model instance.`},"machinable.schema.Storage.model_validate_json":{kind:"routine",realname:"model_validate_json",name:"machinable.schema",path:"machinable.schema.Storage.model_validate_json",signature:null,doc:`!!! abstract "Usage Documentation"
    [JSON Parsing](../concepts/json.md#json-parsing)

Validate the given JSON data against the Pydantic model.

Args:
    json_data: The JSON data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.

Raises:
    ValidationError: If \`json_data\` is not a JSON string or the object could not be validated.`},"machinable.schema.Storage.model_validate_strings":{kind:"routine",realname:"model_validate_strings",name:"machinable.schema",path:"machinable.schema.Storage.model_validate_strings",signature:null,doc:`Validate the given object with string data against the Pydantic model.

Args:
    obj: The object containing string data to validate.
    strict: Whether to enforce types strictly.
    extra: Whether to ignore, allow, or forbid extra data during model validation.
        See the [\`extra\` configuration value][pydantic.ConfigDict.extra] for details.
    context: Extra variables to pass to the validator.
    by_alias: Whether to use the field's alias when validating against the provided input data.
    by_name: Whether to use the field's name when validating against the provided input data.

Returns:
    The validated Pydantic model.`},"machinable.schema.Storage.parse_file":{kind:"routine",realname:"parse_file",name:"machinable.schema",path:"machinable.schema.Storage.parse_file",signature:null,doc:null},"machinable.schema.Storage.parse_obj":{kind:"routine",realname:"parse_obj",name:"machinable.schema",path:"machinable.schema.Storage.parse_obj",signature:null,doc:null},"machinable.schema.Storage.parse_raw":{kind:"routine",realname:"parse_raw",name:"machinable.schema",path:"machinable.schema.Storage.parse_raw",signature:null,doc:null},"machinable.schema.Storage.schema":{kind:"routine",realname:"schema",name:"machinable.schema",path:"machinable.schema.Storage.schema",signature:null,doc:null},"machinable.schema.Storage.schema_json":{kind:"routine",realname:"schema_json",name:"machinable.schema",path:"machinable.schema.Storage.schema_json",signature:null,doc:null},"machinable.schema.Storage.update_forward_refs":{kind:"routine",realname:"update_forward_refs",name:"machinable.schema",path:"machinable.schema.Storage.update_forward_refs",signature:null,doc:null},"machinable.schema.Storage.validate":{kind:"routine",realname:"validate",name:"machinable.schema",path:"machinable.schema.Storage.validate",signature:null,doc:null},"machinable.schema.Storage":{kind:"class",realname:"Storage",name:"machinable.schema",path:"machinable.schema.Storage",parents:["Element"],doc:`!!! abstract "Usage Documentation"
    [Models](../concepts/models.md)

A base class for creating Pydantic models.

Attributes:
    __class_vars__: The names of the class variables defined on the model.
    __private_attributes__: Metadata about the private attributes of the model.
    __signature__: The synthesized \`__init__\` [\`Signature\`][inspect.Signature] of the model.

    __pydantic_complete__: Whether model building is completed, or if there are still undefined fields.
    __pydantic_core_schema__: The core schema of the model.
    __pydantic_custom_init__: Whether the model has a custom \`__init__\` function.
    __pydantic_decorators__: Metadata containing the decorators defined on the model.
        This replaces \`Model.__validators__\` and \`Model.__root_validators__\` from Pydantic V1.
    __pydantic_generic_metadata__: Metadata for generic models; contains data used for a similar purpose to
        __args__, __origin__, __parameters__ in typing-module generics. May eventually be replaced by these.
    __pydantic_parent_namespace__: Parent namespace of the model, used for automatic rebuilding of models.
    __pydantic_post_init__: The name of the post-init method for the model, if defined.
    __pydantic_root_model__: Whether the model is a [\`RootModel\`][pydantic.root_model.RootModel].
    __pydantic_serializer__: The \`pydantic-core\` \`SchemaSerializer\` used to dump instances of the model.
    __pydantic_validator__: The \`pydantic-core\` \`SchemaValidator\` used to validate instances of the model.

    __pydantic_fields__: A dictionary of field names and their corresponding [\`FieldInfo\`][pydantic.fields.FieldInfo] objects.
    __pydantic_computed_fields__: A dictionary of computed field names and their corresponding [\`ComputedFieldInfo\`][pydantic.fields.ComputedFieldInfo] objects.

    __pydantic_extra__: A dictionary containing extra values, if [\`extra\`][pydantic.config.ConfigDict.extra]
        is set to \`'allow'\`.
    __pydantic_fields_set__: The names of fields explicitly set during instantiation.
    __pydantic_private__: Values of private attributes set on the model instance.`,file:"src/machinable/schema.py"},"machinable.schema":{kind:"module",name:"machinable.schema",path:"machinable.schema",doc:null,file:"src/machinable/schema.py"},"machinable.scope.Scope.all":{kind:"routine",realname:"all",name:"machinable.scope",path:"machinable.scope.Scope.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.scope.Scope.ancestor":{kind:"routine",realname:null,name:"machinable.scope",path:"machinable.scope.Scope.ancestor",signature:null,doc:null},"machinable.scope.Scope.as_default":{kind:"routine",realname:"as_default",name:"machinable.scope",path:"machinable.scope.Scope.as_default",signature:"(self) -> Self",doc:null},"machinable.scope.Scope.as_json":{kind:"routine",realname:"as_json",name:"machinable.scope",path:"machinable.scope.Scope.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.scope.Scope.cached":{kind:"routine",realname:"cached",name:"machinable.scope",path:"machinable.scope.Scope.cached",signature:"(self)",doc:null},"machinable.scope.Scope.clone":{kind:"routine",realname:"clone",name:"machinable.scope",path:"machinable.scope.Scope.clone",signature:"(self)",doc:null},"machinable.scope.Scope.collect":{kind:"routine",realname:"collect",name:"machinable.scope",path:"machinable.scope.Scope.collect",signature:null,doc:null},"machinable.scope.Scope.commit":{kind:"routine",realname:"commit",name:"machinable.scope",path:"machinable.scope.Scope.commit",signature:"(self) -> Self",doc:null},"machinable.scope.Scope.compute_context":{kind:"routine",realname:"compute_context",name:"machinable.scope",path:"machinable.scope.Scope.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.scope.Scope.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable.scope",path:"machinable.scope.Scope.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.scope.Scope.connected":{kind:"routine",realname:"connected",name:"machinable.scope",path:"machinable.scope.Scope.connected",signature:null,doc:null},"machinable.scope.Scope.created_at":{kind:"routine",realname:"created_at",name:"machinable.scope",path:"machinable.scope.Scope.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.scope.Scope.derive":{kind:"routine",realname:"derive",name:"machinable.scope",path:"machinable.scope.Scope.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.scope.Scope.derived":{kind:"routine",realname:null,name:"machinable.scope",path:"machinable.scope.Scope.derived",signature:null,doc:null},"machinable.scope.Scope.fetch":{kind:"routine",realname:"fetch",name:"machinable.scope",path:"machinable.scope.Scope.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.scope.Scope.find":{kind:"routine",realname:"find",name:"machinable.scope",path:"machinable.scope.Scope.find",signature:null,doc:null},"machinable.scope.Scope.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable.scope",path:"machinable.scope.Scope.find_by_hash",signature:null,doc:null},"machinable.scope.Scope.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable.scope",path:"machinable.scope.Scope.find_by_id",signature:null,doc:null},"machinable.scope.Scope.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable.scope",path:"machinable.scope.Scope.find_many_by_id",signature:null,doc:null},"machinable.scope.Scope.from_directory":{kind:"routine",realname:"from_directory",name:"machinable.scope",path:"machinable.scope.Scope.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.scope.Scope.from_json":{kind:"routine",realname:"from_json",name:"machinable.scope",path:"machinable.scope.Scope.from_json",signature:null,doc:null},"machinable.scope.Scope.from_model":{kind:"routine",realname:"from_model",name:"machinable.scope",path:"machinable.scope.Scope.from_model",signature:null,doc:null},"machinable.scope.Scope.future":{kind:"routine",realname:"future",name:"machinable.scope",path:"machinable.scope.Scope.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.scope.Scope.get":{kind:"routine",realname:"get",name:"machinable.scope",path:"machinable.scope.Scope.get",signature:null,doc:null},"machinable.scope.Scope.hidden":{kind:"routine",realname:"hidden",name:"machinable.scope",path:"machinable.scope.Scope.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.scope.Scope.instance":{kind:"routine",realname:"instance",name:"machinable.scope",path:"machinable.scope.Scope.instance",signature:null,doc:null},"machinable.scope.Scope.is_committed":{kind:"routine",realname:"is_committed",name:"machinable.scope",path:"machinable.scope.Scope.is_committed",signature:"(self) -> bool",doc:null},"machinable.scope.Scope.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.scope",path:"machinable.scope.Scope.is_connected",signature:null,doc:null},"machinable.scope.Scope.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable.scope",path:"machinable.scope.Scope.is_mounted",signature:"(self) -> bool",doc:null},"machinable.scope.Scope.is_staged":{kind:"routine",realname:"is_staged",name:"machinable.scope",path:"machinable.scope.Scope.is_staged",signature:"(self) -> bool",doc:null},"machinable.scope.Scope.launch":{kind:"routine",realname:"launch",name:"machinable.scope",path:"machinable.scope.Scope.launch",signature:"(self) -> Self",doc:null},"machinable.scope.Scope.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable.scope",path:"machinable.scope.Scope.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.scope.Scope.load_file":{kind:"routine",realname:"load_file",name:"machinable.scope",path:"machinable.scope.Scope.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.scope.Scope.local_directory":{kind:"routine",realname:"local_directory",name:"machinable.scope",path:"machinable.scope.Scope.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.scope.Scope.make":{kind:"routine",realname:"make",name:"machinable.scope",path:"machinable.scope.Scope.make",signature:null,doc:null},"machinable.scope.Scope.matches":{kind:"routine",realname:"matches",name:"machinable.scope",path:"machinable.scope.Scope.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.scope.Scope.model":{kind:"routine",realname:"model",name:"machinable.scope",path:"machinable.scope.Scope.model",signature:null,doc:null},"machinable.scope.Scope.new":{kind:"routine",realname:"new",name:"machinable.scope",path:"machinable.scope.Scope.new",signature:"(self) -> Self",doc:null},"machinable.scope.Scope.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable.scope",path:"machinable.scope.Scope.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.scope.Scope.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable.scope",path:"machinable.scope.Scope.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.scope.Scope.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable.scope",path:"machinable.scope.Scope.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.scope.Scope.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable.scope",path:"machinable.scope.Scope.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.scope.Scope.on_commit":{kind:"routine",realname:"on_commit",name:"machinable.scope",path:"machinable.scope.Scope.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.scope.Scope.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable.scope",path:"machinable.scope.Scope.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.scope.Scope.on_configure":{kind:"routine",realname:"on_configure",name:"machinable.scope",path:"machinable.scope.Scope.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.scope.Scope.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable.scope",path:"machinable.scope.Scope.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.scope.Scope.project":{kind:"routine",realname:null,name:"machinable.scope",path:"machinable.scope.Scope.project",signature:null,doc:null},"machinable.scope.Scope.push_related":{kind:"routine",realname:"push_related",name:"machinable.scope",path:"machinable.scope.Scope.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.scope.Scope.related":{kind:"routine",realname:"related",name:"machinable.scope",path:"machinable.scope.Scope.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.scope.Scope.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable.scope",path:"machinable.scope.Scope.related_iterator",signature:"(self)",doc:null},"machinable.scope.Scope.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable.scope",path:"machinable.scope.Scope.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.scope.Scope.save_file":{kind:"routine",realname:"save_file",name:"machinable.scope",path:"machinable.scope.Scope.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.scope.Scope.serialize":{kind:"routine",realname:"serialize",name:"machinable.scope",path:"machinable.scope.Scope.serialize",signature:"(self) -> dict",doc:null},"machinable.scope.Scope.set_default":{kind:"routine",realname:"set_default",name:"machinable.scope",path:"machinable.scope.Scope.set_default",signature:null,doc:null},"machinable.scope.Scope.set_model":{kind:"routine",realname:"set_model",name:"machinable.scope",path:"machinable.scope.Scope.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.scope.Scope.singleton":{kind:"routine",realname:"singleton",name:"machinable.scope",path:"machinable.scope.Scope.singleton",signature:null,doc:null},"machinable.scope.Scope.stage":{kind:"routine",realname:"stage",name:"machinable.scope",path:"machinable.scope.Scope.stage",signature:"(self) -> Self",doc:null},"machinable.scope.Scope.to_cli":{kind:"routine",realname:"to_cli",name:"machinable.scope",path:"machinable.scope.Scope.to_cli",signature:"(self) -> str",doc:null},"machinable.scope.Scope.to_directory":{kind:"routine",realname:"to_directory",name:"machinable.scope",path:"machinable.scope.Scope.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.scope.Scope.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.scope",path:"machinable.scope.Scope.unserialize",signature:null,doc:null},"machinable.scope.Scope.used_by":{kind:"routine",realname:null,name:"machinable.scope",path:"machinable.scope.Scope.used_by",signature:null,doc:null},"machinable.scope.Scope.uses":{kind:"routine",realname:null,name:"machinable.scope",path:"machinable.scope.Scope.uses",signature:null,doc:null},"machinable.scope.Scope.version":{kind:"routine",realname:"version",name:"machinable.scope",path:"machinable.scope.Scope.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.scope.Scope":{kind:"class",realname:"Scope",name:"machinable.scope",path:"machinable.scope.Scope",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/scope.py"},"machinable.scope":{kind:"module",name:"machinable.scope",path:"machinable.scope",doc:null,file:"src/machinable/scope.py"},"machinable.storage.Storage.all":{kind:"routine",realname:"all",name:"machinable.storage",path:"machinable.storage.Storage.all",signature:"(self) -> 'InterfaceCollection'",doc:null},"machinable.storage.Storage.ancestor":{kind:"routine",realname:null,name:"machinable.storage",path:"machinable.storage.Storage.ancestor",signature:null,doc:null},"machinable.storage.Storage.as_default":{kind:"routine",realname:"as_default",name:"machinable.storage",path:"machinable.storage.Storage.as_default",signature:"(self) -> Self",doc:null},"machinable.storage.Storage.as_json":{kind:"routine",realname:"as_json",name:"machinable.storage",path:"machinable.storage.Storage.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.storage.Storage.cached":{kind:"routine",realname:"cached",name:"machinable.storage",path:"machinable.storage.Storage.cached",signature:"(self)",doc:null},"machinable.storage.Storage.clone":{kind:"routine",realname:"clone",name:"machinable.storage",path:"machinable.storage.Storage.clone",signature:"(self)",doc:null},"machinable.storage.Storage.collect":{kind:"routine",realname:"collect",name:"machinable.storage",path:"machinable.storage.Storage.collect",signature:null,doc:null},"machinable.storage.Storage.commit":{kind:"routine",realname:"commit",name:"machinable.storage",path:"machinable.storage.Storage.commit",signature:"(self, interface: 'Interface') -> None",doc:null},"machinable.storage.Storage.compute_context":{kind:"routine",realname:"compute_context",name:"machinable.storage",path:"machinable.storage.Storage.compute_context",signature:"(self) -> dict | None",doc:`Computes the context contraints of the element

Returns:
    Optional[Dict]: Maps constraint fields their required JSON-able values.
        An empty dict means no constraits, i.e. all elements will be matched.
        Returning None means full constraits, i.e. no element will be matched.`},"machinable.storage.Storage.compute_predicate":{kind:"routine",realname:"compute_predicate",name:"machinable.storage",path:"machinable.storage.Storage.compute_predicate",signature:"(self) -> dict",doc:null},"machinable.storage.Storage.connected":{kind:"routine",realname:"connected",name:"machinable.storage",path:"machinable.storage.Storage.connected",signature:null,doc:null},"machinable.storage.Storage.contains":{kind:"routine",realname:"contains",name:"machinable.storage",path:"machinable.storage.Storage.contains",signature:"(self, uuid: str) -> bool",doc:null},"machinable.storage.Storage.created_at":{kind:"routine",realname:"created_at",name:"machinable.storage",path:"machinable.storage.Storage.created_at",signature:"(self) -> arrow.arrow.Arrow",doc:null},"machinable.storage.Storage.derive":{kind:"routine",realname:"derive",name:"machinable.storage",path:"machinable.storage.Storage.derive",signature:"(self, module: str | machinable.element.Element | None = None, version: str | dict | None | list[str | dict | None] = None, **kwargs) -> Self",doc:null},"machinable.storage.Storage.derived":{kind:"routine",realname:null,name:"machinable.storage",path:"machinable.storage.Storage.derived",signature:null,doc:null},"machinable.storage.Storage.download":{kind:"routine",realname:"download",name:"machinable.storage",path:"machinable.storage.Storage.download",signature:"(self, uuid: str, destination: str | None = None, related: bool | int = True) -> list[str]",doc:`Download to destination

uuid: str
    Primary interface UUID
destination: str | None
    If None, download will be imported into active index. If directory filepath, download will be placed
    in directory without import to index
related: bool | int
    - 0/False: Do not upload related interfaces
    - 1/True: Upload immediately related interfaces
    - 2: Upload related interfaces and their related interfaces

Returns:
    List of downloaded directories`},"machinable.storage.Storage.fetch":{kind:"routine",realname:"fetch",name:"machinable.storage",path:"machinable.storage.Storage.fetch",signature:"(self, directory: str | None = None, force: bool = False) -> bool",doc:null},"machinable.storage.Storage.find":{kind:"routine",realname:"find",name:"machinable.storage",path:"machinable.storage.Storage.find",signature:null,doc:null},"machinable.storage.Storage.find_by_hash":{kind:"routine",realname:"find_by_hash",name:"machinable.storage",path:"machinable.storage.Storage.find_by_hash",signature:null,doc:null},"machinable.storage.Storage.find_by_id":{kind:"routine",realname:"find_by_id",name:"machinable.storage",path:"machinable.storage.Storage.find_by_id",signature:null,doc:null},"machinable.storage.Storage.find_many_by_id":{kind:"routine",realname:"find_many_by_id",name:"machinable.storage",path:"machinable.storage.Storage.find_many_by_id",signature:null,doc:null},"machinable.storage.Storage.from_directory":{kind:"routine",realname:"from_directory",name:"machinable.storage",path:"machinable.storage.Storage.from_directory",signature:null,doc:`Returns an interface from a storage directory

Note that this does not verify the integrity of the directory.
In particular, the interface may be missing or not be indexed.`},"machinable.storage.Storage.from_json":{kind:"routine",realname:"from_json",name:"machinable.storage",path:"machinable.storage.Storage.from_json",signature:null,doc:null},"machinable.storage.Storage.from_model":{kind:"routine",realname:"from_model",name:"machinable.storage",path:"machinable.storage.Storage.from_model",signature:null,doc:null},"machinable.storage.Storage.future":{kind:"routine",realname:"future",name:"machinable.storage",path:"machinable.storage.Storage.future",signature:"(self) -> Optional[Self]",doc:null},"machinable.storage.Storage.get":{kind:"routine",realname:"get",name:"machinable.storage",path:"machinable.storage.Storage.get",signature:null,doc:null},"machinable.storage.Storage.hidden":{kind:"routine",realname:"hidden",name:"machinable.storage",path:"machinable.storage.Storage.hidden",signature:"(self, hidden: bool | None = None, reason: str = 'user') -> bool",doc:null},"machinable.storage.Storage.instance":{kind:"routine",realname:"instance",name:"machinable.storage",path:"machinable.storage.Storage.instance",signature:null,doc:null},"machinable.storage.Storage.is_committed":{kind:"routine",realname:"is_committed",name:"machinable.storage",path:"machinable.storage.Storage.is_committed",signature:"(self) -> bool",doc:null},"machinable.storage.Storage.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.storage",path:"machinable.storage.Storage.is_connected",signature:null,doc:null},"machinable.storage.Storage.is_mounted":{kind:"routine",realname:"is_mounted",name:"machinable.storage",path:"machinable.storage.Storage.is_mounted",signature:"(self) -> bool",doc:null},"machinable.storage.Storage.is_staged":{kind:"routine",realname:"is_staged",name:"machinable.storage",path:"machinable.storage.Storage.is_staged",signature:"(self) -> bool",doc:null},"machinable.storage.Storage.launch":{kind:"routine",realname:"launch",name:"machinable.storage",path:"machinable.storage.Storage.launch",signature:"(self) -> Self",doc:null},"machinable.storage.Storage.load_attribute":{kind:"routine",realname:"load_attribute",name:"machinable.storage",path:"machinable.storage.Storage.load_attribute",signature:"(self, name: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.storage.Storage.load_file":{kind:"routine",realname:"load_file",name:"machinable.storage",path:"machinable.storage.Storage.load_file",signature:"(self, filepath: str | list[str], default=None) -> typing.Any | None",doc:null},"machinable.storage.Storage.local_directory":{kind:"routine",realname:"local_directory",name:"machinable.storage",path:"machinable.storage.Storage.local_directory",signature:"(self, *append: str, create: bool = False) -> str",doc:null},"machinable.storage.Storage.make":{kind:"routine",realname:"make",name:"machinable.storage",path:"machinable.storage.Storage.make",signature:null,doc:null},"machinable.storage.Storage.matches":{kind:"routine",realname:"matches",name:"machinable.storage",path:"machinable.storage.Storage.matches",signature:"(self, context: dict | None = None) -> bool",doc:null},"machinable.storage.Storage.model":{kind:"routine",realname:"model",name:"machinable.storage",path:"machinable.storage.Storage.model",signature:null,doc:null},"machinable.storage.Storage.new":{kind:"routine",realname:"new",name:"machinable.storage",path:"machinable.storage.Storage.new",signature:"(self) -> Self",doc:null},"machinable.storage.Storage.on_after_commit":{kind:"routine",realname:"on_after_commit",name:"machinable.storage",path:"machinable.storage.Storage.on_after_commit",signature:"(self)",doc:"Event hook after interface has been committed."},"machinable.storage.Storage.on_after_configure":{kind:"routine",realname:"on_after_configure",name:"machinable.storage",path:"machinable.storage.Storage.on_after_configure",signature:"(self) -> None",doc:`Configuration event operating on the resolved, read-only configuration
This may be used to validate given the interface instance. If validation
can be performed without the instance, use a config schema instead.`},"machinable.storage.Storage.on_before_commit":{kind:"routine",realname:"on_before_commit",name:"machinable.storage",path:"machinable.storage.Storage.on_before_commit",signature:"(self)",doc:"Event hook before interface is committed."},"machinable.storage.Storage.on_before_configure":{kind:"routine",realname:"on_before_configure",name:"machinable.storage",path:"machinable.storage.Storage.on_before_configure",signature:"(self, config: omegaconf.dictconfig.DictConfig) -> None",doc:`Configuration event operating on the raw configuration
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.storage.Storage.on_commit":{kind:"routine",realname:"on_commit",name:"machinable.storage",path:"machinable.storage.Storage.on_commit",signature:"(self)",doc:`Event hook during interface commit when uuid, config, context
and predicate have been computed and commit is about to be performed`},"machinable.storage.Storage.on_compute_predicate":{kind:"routine",realname:"on_compute_predicate",name:"machinable.storage",path:"machinable.storage.Storage.on_compute_predicate",signature:"(self) -> dict",doc:`Event to compute additional predicates that identify this element.

Returns:
    Dict: Maps the names used during lookup to their JSON-able value.`},"machinable.storage.Storage.on_configure":{kind:"routine",realname:"on_configure",name:"machinable.storage",path:"machinable.storage.Storage.on_configure",signature:"(self) -> None",doc:`Configuration event
This may be used to apply computed configuration updates
Do not use to validate the configuration but use validators in the config schema
that are applied at a later stage.`},"machinable.storage.Storage.on_instantiate":{kind:"routine",realname:"on_instantiate",name:"machinable.storage",path:"machinable.storage.Storage.on_instantiate",signature:"(self) -> None",doc:"Event that is invoked whenever the element is instantiated"},"machinable.storage.Storage.project":{kind:"routine",realname:null,name:"machinable.storage",path:"machinable.storage.Storage.project",signature:null,doc:null},"machinable.storage.Storage.push_related":{kind:"routine",realname:"push_related",name:"machinable.storage",path:"machinable.storage.Storage.push_related",signature:"(self, key: str, value: 'Interface') -> None",doc:null},"machinable.storage.Storage.related":{kind:"routine",realname:"related",name:"machinable.storage",path:"machinable.storage.Storage.related",signature:"(self, deep: bool = False) -> machinable.collection.InterfaceCollection",doc:"Returns a collection of related interfaces"},"machinable.storage.Storage.related_iterator":{kind:"routine",realname:"related_iterator",name:"machinable.storage",path:"machinable.storage.Storage.related_iterator",signature:"(self)",doc:null},"machinable.storage.Storage.retrieve":{kind:"routine",realname:"retrieve",name:"machinable.storage",path:"machinable.storage.Storage.retrieve",signature:"(self, uuid: str, local_directory: str) -> bool",doc:null},"machinable.storage.Storage.save_attribute":{kind:"routine",realname:"save_attribute",name:"machinable.storage",path:"machinable.storage.Storage.save_attribute",signature:"(self, name: str | list[str], data: Any) -> str",doc:null},"machinable.storage.Storage.save_file":{kind:"routine",realname:"save_file",name:"machinable.storage",path:"machinable.storage.Storage.save_file",signature:"(self, filepath: str | list[str], data: Any) -> str",doc:null},"machinable.storage.Storage.search_for":{kind:"routine",realname:"search_for",name:"machinable.storage",path:"machinable.storage.Storage.search_for",signature:"(self, interface: 'Interface') -> list[str]",doc:null},"machinable.storage.Storage.serialize":{kind:"routine",realname:"serialize",name:"machinable.storage",path:"machinable.storage.Storage.serialize",signature:"(self) -> dict",doc:null},"machinable.storage.Storage.set_default":{kind:"routine",realname:"set_default",name:"machinable.storage",path:"machinable.storage.Storage.set_default",signature:null,doc:null},"machinable.storage.Storage.set_model":{kind:"routine",realname:"set_model",name:"machinable.storage",path:"machinable.storage.Storage.set_model",signature:"(self, model: machinable.schema.Element) -> Self",doc:null},"machinable.storage.Storage.singleton":{kind:"routine",realname:"singleton",name:"machinable.storage",path:"machinable.storage.Storage.singleton",signature:null,doc:null},"machinable.storage.Storage.stage":{kind:"routine",realname:"stage",name:"machinable.storage",path:"machinable.storage.Storage.stage",signature:"(self) -> Self",doc:null},"machinable.storage.Storage.to_cli":{kind:"routine",realname:"to_cli",name:"machinable.storage",path:"machinable.storage.Storage.to_cli",signature:"(self) -> str",doc:null},"machinable.storage.Storage.to_directory":{kind:"routine",realname:"to_directory",name:"machinable.storage",path:"machinable.storage.Storage.to_directory",signature:"(self, directory: str, relations: bool = True) -> Self",doc:null},"machinable.storage.Storage.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.storage",path:"machinable.storage.Storage.unserialize",signature:null,doc:null},"machinable.storage.Storage.update":{kind:"routine",realname:"update",name:"machinable.storage",path:"machinable.storage.Storage.update",signature:"(self, interface: 'Interface') -> None",doc:null},"machinable.storage.Storage.upload":{kind:"routine",realname:"upload",name:"machinable.storage",path:"machinable.storage.Storage.upload",signature:"(self, interface: 'Interface', related: bool | int = True) -> None",doc:`Upload the interface to the storage

interface: Interface
related: bool | int
    - 0/False: Do not save related interfaces
    - 1/True: Save immediately related interfaces
    - 2: Save related interfaces and their related interfaces`},"machinable.storage.Storage.used_by":{kind:"routine",realname:null,name:"machinable.storage",path:"machinable.storage.Storage.used_by",signature:null,doc:null},"machinable.storage.Storage.uses":{kind:"routine",realname:null,name:"machinable.storage",path:"machinable.storage.Storage.uses",signature:null,doc:null},"machinable.storage.Storage.version":{kind:"routine",realname:"version",name:"machinable.storage",path:"machinable.storage.Storage.version",signature:"(self, version: str | dict | None | list[str | dict | None] = <object object at 0x7fcadfb81700>, overwrite: bool = False) -> list[str | dict]",doc:null},"machinable.storage.Storage":{kind:"class",realname:"Storage",name:"machinable.storage",path:"machinable.storage.Storage",parents:["machinable.interface.Interface"],doc:"Element baseclass",file:"src/machinable/storage.py"},"machinable.storage.fetch":{kind:"routine",realname:"fetch",name:"machinable.storage",path:"machinable.storage.fetch",signature:"(uuid: str, directory: str) -> bool",doc:null},"machinable.storage":{kind:"module",name:"machinable.storage",path:"machinable.storage",doc:null,file:"src/machinable/storage.py"},"machinable.types":{kind:"module",name:"machinable.types",path:"machinable.types",doc:null,file:"src/machinable/types.py"},"machinable.utils.Connectable.get":{kind:"routine",realname:"get",name:"machinable.utils",path:"machinable.utils.Connectable.get",signature:null,doc:null},"machinable.utils.Connectable.is_connected":{kind:"routine",realname:"is_connected",name:"machinable.utils",path:"machinable.utils.Connectable.is_connected",signature:null,doc:null},"machinable.utils.Connectable":{kind:"class",realname:"Connectable",name:"machinable.utils",path:"machinable.utils.Connectable",parents:["builtins.object"],doc:"Connectable trait",file:"src/machinable/utils.py"},"machinable.utils.Jsonable.as_json":{kind:"routine",realname:"as_json",name:"machinable.utils",path:"machinable.utils.Jsonable.as_json",signature:"(self, stringify=True, default=<function serialize at 0x7fcade534400>, **dumps_kwargs)",doc:null},"machinable.utils.Jsonable.clone":{kind:"routine",realname:"clone",name:"machinable.utils",path:"machinable.utils.Jsonable.clone",signature:"(self)",doc:null},"machinable.utils.Jsonable.from_json":{kind:"routine",realname:"from_json",name:"machinable.utils",path:"machinable.utils.Jsonable.from_json",signature:null,doc:null},"machinable.utils.Jsonable.serialize":{kind:"routine",realname:"serialize",name:"machinable.utils",path:"machinable.utils.Jsonable.serialize",signature:"(self) -> dict",doc:null},"machinable.utils.Jsonable.unserialize":{kind:"routine",realname:"unserialize",name:"machinable.utils",path:"machinable.utils.Jsonable.unserialize",signature:null,doc:null},"machinable.utils.Jsonable":{kind:"class",realname:"Jsonable",name:"machinable.utils",path:"machinable.utils.Jsonable",parents:["builtins.object"],doc:null,file:"src/machinable/utils.py"},"machinable.utils.chmodx":{kind:"routine",realname:"chmodx",name:"machinable.utils",path:"machinable.utils.chmodx",signature:"(filepath: str) -> str",doc:null},"machinable.utils.dot_splitter":{kind:"routine",realname:"dot_splitter",name:"machinable.utils",path:"machinable.utils.dot_splitter",signature:"(flat_key)",doc:null},"machinable.utils.empty_uuid":{kind:"routine",realname:"empty_uuid",name:"machinable.utils",path:"machinable.utils.empty_uuid",signature:"() -> str",doc:null},"machinable.utils.file_hash":{kind:"routine",realname:"file_hash",name:"machinable.utils",path:"machinable.utils.file_hash",signature:"(filepath: str)",doc:null},"machinable.utils.find_installed_extensions":{kind:"routine",realname:"find_installed_extensions",name:"machinable.utils",path:"machinable.utils.find_installed_extensions",signature:"(key: str) -> list[tuple[str, module]]",doc:null},"machinable.utils.find_subclass_in_module":{kind:"routine",realname:"find_subclass_in_module",name:"machinable.utils",path:"machinable.utils.find_subclass_in_module",signature:"(module: module | None, base_class: Any, default: typing.Any | None = None) -> Any",doc:null},"machinable.utils.generate_nickname":{kind:"routine",realname:"generate_nickname",name:"machinable.utils",path:"machinable.utils.generate_nickname",signature:"(categories=None, glue='_')",doc:`Generate a random nickname by chaining words from categories

# Arguments
categories: List of categories, available: 'animal', 'tree', 'color'.
            Can be nested. Defaults to ('color', ('animal', 'tree'))`},"machinable.utils.generate_seed":{kind:"routine",realname:"generate_seed",name:"machinable.utils",path:"machinable.utils.generate_seed",signature:"(random_state=None)",doc:`Generates a seed from a random state

# Arguments
random_state: Random state or None

Returns:
int32 seed value`},"machinable.utils.get_commit":{kind:"routine",realname:"get_commit",name:"machinable.utils",path:"machinable.utils.get_commit",signature:"(repository: str) -> dict",doc:null},"machinable.utils.get_diff":{kind:"routine",realname:"get_diff",name:"machinable.utils",path:"machinable.utils.get_diff",signature:"(repository: str) -> str | None",doc:null},"machinable.utils.get_root_commit":{kind:"routine",realname:"get_root_commit",name:"machinable.utils",path:"machinable.utils.get_root_commit",signature:"(repository: str) -> str | None",doc:null},"machinable.utils.id_from_uuid":{kind:"routine",realname:"id_from_uuid",name:"machinable.utils",path:"machinable.utils.id_from_uuid",signature:"(uuid: str) -> str",doc:null},"machinable.utils.import_from_directory":{kind:"routine",realname:"import_from_directory",name:"machinable.utils",path:"machinable.utils.import_from_directory",signature:"(module_name: str, directory: str, or_fail: bool = False) -> module | None",doc:"Imports a module relative to a given absolute directory"},"machinable.utils.is_directory_version":{kind:"routine",realname:"is_directory_version",name:"machinable.utils",path:"machinable.utils.is_directory_version",signature:"(version: str | dict | None | list[str | dict | None]) -> bool",doc:null},"machinable.utils.is_valid_module_path":{kind:"routine",realname:"is_valid_module_path",name:"machinable.utils",path:"machinable.utils.is_valid_module_path",signature:"(name)",doc:null},"machinable.utils.is_valid_variable_name":{kind:"routine",realname:"is_valid_variable_name",name:"machinable.utils",path:"machinable.utils.is_valid_variable_name",signature:"(name)",doc:null},"machinable.utils.iskeyword":{kind:"routine",realname:"__contains__",name:"machinable.utils",path:"machinable.utils.iskeyword",signature:"(object, /)",doc:"x.__contains__(y) <==> y in x."},"machinable.utils.joinpath":{kind:"routine",realname:"joinpath",name:"machinable.utils",path:"machinable.utils.joinpath",signature:"(filepath: str | list[str]) -> str",doc:null},"machinable.utils.load_file":{kind:"routine",realname:"load_file",name:"machinable.utils",path:"machinable.utils.load_file",signature:"(filepath: str | list[str], default: Any = <object object at 0x7fcadfb81700>, opener=<built-in function open>, **opener_kwargs) -> Any",doc:`Loads a data object from file

# Arguments
filepath: Target filepath. The extension is being used to determine
    the file format. Supported formats are:
    .json (JSON), .jsonl (JSON-lines), .npy (numpy), .p (pickle); all other will be loaded as plain text (e.g. .txt|.log|.diff|.sh)
default: Optional default if reading fails
opener: Customer file opener
opener_kwargs: Optional arguments to pass to the opener`},"machinable.utils.norm_version_call":{kind:"routine",realname:"norm_version_call",name:"machinable.utils",path:"machinable.utils.norm_version_call",signature:"(version: str)",doc:null},"machinable.utils.normjson":{kind:"routine",realname:"normjson",name:"machinable.utils",path:"machinable.utils.normjson",signature:"(data: Any, default: collections.abc.Callable[[typing.Any], typing.Any] | None = <function serialize at 0x7fcade534400>) -> str",doc:null},"machinable.utils.object_hash":{kind:"routine",realname:"object_hash",name:"machinable.utils",path:"machinable.utils.object_hash",signature:"(payload: Any, default: collections.abc.Callable[[typing.Any], typing.Any] | None = <function serialize at 0x7fcade534400>) -> str",doc:null},"machinable.utils.random_str":{kind:"routine",realname:"random_str",name:"machinable.utils",path:"machinable.utils.random_str",signature:"(length: int, random_state=None)",doc:null},"machinable.utils.run_and_stream":{kind:"routine",realname:"run_and_stream",name:"machinable.utils",path:"machinable.utils.run_and_stream",signature:"(args, *, stdout_handler: collections.abc.Callable = <built-in function print>, stderr_handler: collections.abc.Callable = <built-in function print>, check: bool = True, text: bool = True, env: dict | None = <object object at 0x7fcadfb81700>, **kwargs) -> int",doc:null},"machinable.utils.save_file":{kind:"routine",realname:"save_file",name:"machinable.utils",path:"machinable.utils.save_file",signature:"(filepath: str | list[str], data: Any, makedirs: bool | collections.abc.Callable = True, opener=<built-in function open>, **opener_kwargs) -> str",doc:`Saves a data object to file

# Arguments
filepath: Target filepath. The extension is being used to determine
    the file format. Supported formats are:
    .json (JSON), .jsonl (JSON-lines), .npy (numpy), .p (pickle); all other will be written as plain text (e.g. .txt|.log|.diff|.sh)
data: The data object
makedirs: If True or Callable, path will be created
opener: Customer file opener
opener_kwargs: Optional arguments to pass to the opener

Returns the absolute path to the written file`},"machinable.utils.serialize":{kind:"routine",realname:"serialize",name:"machinable.utils",path:"machinable.utils.serialize",signature:"(obj)",doc:"JSON serializer for objects not serializable by default json code"},"machinable.utils.timestamp_to_directory":{kind:"routine",realname:"timestamp_to_directory",name:"machinable.utils",path:"machinable.utils.timestamp_to_directory",signature:"(timestamp: int) -> str",doc:null},"machinable.utils.unflatten_dict":{kind:"routine",realname:"unflatten_dict",name:"machinable.utils",path:"machinable.utils.unflatten_dict",signature:"(d: collections.abc.Mapping, splitter: str | collections.abc.Callable = <function dot_splitter at 0x7fcade1f6ca0>, inverse: bool = False, recursive: bool = True, copy: bool = True) -> dict",doc:`Recursively unflatten a dict-like object

# Arguments
d: The dict-like to unflatten
splitter: The key splitting method
    If a Callable is given, the Callable will be used to split \`d\`.
    'tuple': Use each element in the tuple key as the key of the unflattened dict.
    'path': Use \`pathlib.Path.parts\` to split keys.
    'underscore': Use underscores to split keys.
    'dot': Use underscores to split keys.
inverse: If True, inverts the key and value before flattening
recursive: Perform unflatting recursively
copy: Creates copies to leave d unmodified`},"machinable.utils.update_dict":{kind:"routine",realname:"update_dict",name:"machinable.utils",path:"machinable.utils.update_dict",signature:"(d: collections.abc.Mapping, update: collections.abc.Mapping | None = None, copy: bool = False) -> collections.abc.Mapping",doc:null},"machinable.utils.update_uuid_payload":{kind:"routine",realname:"update_uuid_payload",name:"machinable.utils",path:"machinable.utils.update_uuid_payload",signature:"(uuid: str, payload: dict) -> str",doc:null},"machinable.utils":{kind:"module",name:"machinable.utils",path:"machinable.utils",doc:null,file:"src/machinable/utils.py"}},Hi={extends:Pi,enhanceApp({app:e}){e.config.globalProperties.$pydocData=Gi,e.component("Pydoc",Me),e.component("Tree",qi)}};export{Hi as R,qi as T};

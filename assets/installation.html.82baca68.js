import{_ as r,r as a,o as l,c,a as n,b as t,w as d,F as h,d as e,e as o}from"./app.d39de0a2.js";const p={},_=n("h1",{id:"installation",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#installation","aria-hidden":"true"},"#"),e(" Installation")],-1),u=n("div",{class:"custom-container tip"},[n("p",{class:"custom-container-title"},"TIP"),n("p",null,"machinable requires Python 3.7 or higher and does not support Python 2.")],-1),m=e("Install the latest stable version via "),b={href:"http://www.pip-installer.org/",target:"_blank",rel:"noopener noreferrer"},v=e("pip"),f=e(":"),g=o(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>pip <span class="token function">install</span> machinable
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="for-development" tabindex="-1"><a class="header-anchor" href="#for-development" aria-hidden="true">#</a> For development</h2><p>To test or develop new features you may want to install the latest package version from the repository.</p>`,3),k=e("Clone the source from the "),x={href:"https://github.com/machinable-org/machinable",target:"_blank",rel:"noopener noreferrer"},y=e("public code repository"),w=e(" on GitHub and change into the machinable directory."),I=e("Install the development dependencies using "),V={href:"https://python-poetry.org/",target:"_blank",rel:"noopener noreferrer"},L=e("poetry"),N=e(":"),T=o(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>poetry <span class="token function">install</span> -D
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,1),B=e("To build the "),C={href:"https://vuepress.vuejs.org",target:"_blank",rel:"noopener noreferrer"},E=e("Vuepress"),F=e("-based documentation run:"),P=o(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span>
<span class="token function">npm</span> run docs:dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,1),R=e("If you plan to contribute please read the "),j=e("contribution guide");function q(D,G){const s=a("ExternalLinkIcon"),i=a("RouterLink");return l(),c(h,null,[_,u,n("p",null,[m,n("a",b,[v,t(s)]),f]),g,n("p",null,[k,n("a",x,[y,t(s)]),w]),n("p",null,[I,n("a",V,[L,t(s)]),N]),T,n("p",null,[B,n("a",C,[E,t(s)]),F]),P,n("p",null,[R,t(i,{to:"/miscellaneous/contribution-guide.html"},{default:d(()=>[j]),_:1})])],64)}var S=r(p,[["render",q],["__file","installation.html.vue"]]);export{S as default};

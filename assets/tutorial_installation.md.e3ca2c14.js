import{_ as a,o as s,c as e,d as t}from"./app.c71878a1.js";const C=JSON.parse('{"title":"Installation","description":"","frontmatter":{},"headers":[],"relativePath":"tutorial/installation.md"}'),n={name:"tutorial/installation.md"},l=t(`<h1 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-hidden="true">#</a></h1><p>machinable is available via <a href="https://pypi.org/project/machinable/" target="_blank" rel="noreferrer">pip</a>. Install the current release</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">pip</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">machinable</span></span>
<span class="line"></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>machinable currently supports Python 3.7 and higher</p></div><p>Note that machinable requires the sqlite json1 extension, otherwise, you will likely see the error message: <code>sqlite3.OperationalError: no such function: json_extract</code>. An easy way to obtain a suitable sqlite version is to install the pysqlite package:</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">pip</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">pysqlite3-binary</span></span>
<span class="line"></span></code></pre></div>`,6),o=[l];function i(p,r,c,h,d,_){return s(),e("div",null,o)}const u=a(n,[["render",i]]);export{C as __pageData,u as default};

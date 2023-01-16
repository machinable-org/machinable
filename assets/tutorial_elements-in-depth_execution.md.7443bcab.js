import{_ as s,o as n,c as e,d as a}from"./app.6a92d9d2.js";const d=JSON.parse('{"title":"Execution","description":"","frontmatter":{},"headers":[],"relativePath":"tutorial/elements-in-depth/execution.md"}'),o={name:"tutorial/elements-in-depth/execution.md"},t=a(`<h1 id="execution" tabindex="-1">Execution <a class="header-anchor" href="#execution" aria-hidden="true">#</a></h1><div class="warning custom-block"><p class="custom-block-title">Coming soon</p><p>This section is currently under construction</p></div><p>For instance, execution using a queue system like <a href="https://slurm.schedmd.com/documentation.html" target="_blank" rel="noreferrer">Slurm</a> may be as simple as:</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">with</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">myproject.execution.slurm</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">    experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">launch</span><span style="color:#89DDFF;">()</span></span>
<span class="line"></span></code></pre></div><p>Delegating the execution to an external runner like <a href="https://www.open-mpi.org/" target="_blank" rel="noreferrer">MPI</a> may look like this:</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">with</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">myproject.execution.mpi</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">{</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">n</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> </span><span style="color:#F78C6C;">4</span><span style="color:#89DDFF;">}):</span></span>
<span class="line"><span style="color:#A6ACCD;">    experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">launch</span><span style="color:#89DDFF;">()</span></span>
<span class="line"></span></code></pre></div>`,6),l=[t];function p(c,r,i,F,y,D){return n(),e("div",null,l)}const h=s(o,[["render",p]]);export{d as __pageData,h as default};
import{_ as p,o as t,c,a as n,b as s,e as a,w as l,d as o,r as i}from"./app.6a92d9d2.js";const _=JSON.parse('{"title":"Running experiments","description":"","frontmatter":{},"headers":[{"level":2,"title":"Executing experiments","slug":"executing-experiments","link":"#executing-experiments","children":[]},{"level":2,"title":"Implementing custom execution","slug":"implementing-custom-execution","link":"#implementing-custom-execution","children":[]}],"relativePath":"tutorial/essentials/running-experiments.md"}'),r={name:"tutorial/essentials/running-experiments.md"},y=n("h1",{id:"running-experiments",tabindex:"-1"},[s("Running experiments "),n("a",{class:"header-anchor",href:"#running-experiments","aria-hidden":"true"},"#")],-1),F=n("h2",{id:"executing-experiments",tabindex:"-1"},[s("Executing experiments "),n("a",{class:"header-anchor",href:"#executing-experiments","aria-hidden":"true"},"#")],-1),D=o(`<div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> get</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> experiment </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">estimate_gravity</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">launch</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">Assuming height of </span><span style="color:#F78C6C;">52</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">and</span><span style="color:#A6ACCD;"> time of </span><span style="color:#F78C6C;">0.3</span></span>
<span class="line"><span style="color:#A6ACCD;">The gravity on the exoplanet </span><span style="color:#89DDFF;font-style:italic;">is</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">1155.5555555555557</span></span>
<span class="line"></span></code></pre></div><p>If the execution is successful, the experiment is marked as finished.</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">is_finished</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#89DDFF;">True</span></span>
<span class="line"></span></code></pre></div><p>By design, experiment instances can only be executed once. They are automatically assigned a unique experiment ID, a random seed, as well as a timestamp for easy identification.</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">estimate_gravity</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">experiment_id</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&#39;</span><span style="color:#676E95;font-style:italic;">GDCN4d</span><span style="color:#89DDFF;font-style:italic;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">timestamp</span></span>
<span class="line"><span style="color:#F78C6C;">1673648406</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">seed</span></span>
<span class="line"><span style="color:#F78C6C;">1632827863</span></span>
<span class="line"></span></code></pre></div><p>Invocations of <code>launch()</code> after successful execution, do not trigger another execution since the experiment is already finished. On the other hand, if the execution failed, calling <code>launch()</code> will resume the execution with the same random seed.</p><p>To replicate or reproduce an experiment, create a new experiment instance with the same configuration. Learn more about <a href="./../elements-in-depth/experiments.html#derivation">continuing and repeating experiments</a>.</p><h2 id="implementing-custom-execution" tabindex="-1">Implementing custom execution <a class="header-anchor" href="#implementing-custom-execution" aria-hidden="true">#</a></h2><p>Experiments can be executed in different ways. You may, for example, like to run experiments using multiprocessing or execute on a cloud environment. However, instead of adding the execution logic directly to your experiment code, machinable makes it easy to separate concerns. You can encapsulate the execution implementation in its own execution class that can then be used to execute the experiment.</p>`,9),A=o(`<p><em>multiprocess_execution.py</em></p><div class="language-py"><button title="Copy Code" class="copy"></button><span class="lang">py</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> multiprocessing </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> Pool</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> Execution</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Multiprocess</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">Execution</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Config</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">        processes</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">on_dispatch</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        pool </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Pool</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">processes</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">processes</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#A6ACCD;font-style:italic;">maxtasksperchild</span><span style="color:#89DDFF;">=</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">try</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">            pool</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">imap_unordered</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#C792EA;">lambda</span><span style="color:#82AAFF;"> </span><span style="color:#A6ACCD;font-style:italic;">experiment</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> experiment</span><span style="color:#89DDFF;">(),</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">experiments</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#82AAFF;">            </span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">            pool</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">close</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">            pool</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">join</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">finally</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">            pool</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">terminate</span><span style="color:#89DDFF;">()</span></span>
<span class="line"></span></code></pre></div><p>Much like in the case of experiments, the execution class provides a <code>Config</code> dataclass and implements the <code>on_dispatch</code> event that handles the execution of the given <code>self.experiments</code> by calling them within a subprocess (<code>experiment()</code>).</p><p>Like before, we can instantiate this execution using the module convention:</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> get</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">multiprocessing </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">multiprocess_execution</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">{</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">processes</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">})</span></span>
<span class="line"></span></code></pre></div><p>Then, to use it, we can wrap the launch in the execution context:</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">with</span><span style="color:#A6ACCD;"> multiprocessing</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">launch</span><span style="color:#89DDFF;">()</span></span>
<span class="line"></span></code></pre></div><p>Check out the <a href="./../elements-in-depth/execution.html">execution guide</a> to learn more about executions. You may also be interested in the <a href="./../../examples/execution.html">execution examples</a> that you may like to use in your projects.</p>`,8);function C(m,u,d,h,g,x){const e=i("Pydoc");return t(),c("div",null,[y,F,n("p",null,[s("Once implemented and configured, experiments can be executed by calling "),a(e,{caption:"launch()"},{default:l(()=>[s("machinable.Experiment.launch")]),_:1}),s(":")]),D,n("p",null,[s("To implement an execution, create a module with a class that inherits from the "),a(e,null,{default:l(()=>[s("machinable.Execution")]),_:1}),s(" base class, for example:")]),A])}const b=p(r,[["render",C]]);export{_ as __pageData,b as default};
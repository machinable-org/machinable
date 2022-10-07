import{_ as p,o as t,c,a as n,b as s,d as e,w as o,e as l,r}from"./app.fd76f650.js";const T=JSON.parse('{"title":"Implementing experiments","description":"","frontmatter":{},"headers":[{"level":2,"title":"Events","slug":"events","link":"#events","children":[]},{"level":2,"title":"Configuration","slug":"configuration","link":"#configuration","children":[]},{"level":2,"title":"Design for failure","slug":"design-for-failure","link":"#design-for-failure","children":[]}],"relativePath":"tutorial/essentials/implementing-experiments.md"}'),i={name:"tutorial/essentials/implementing-experiments.md"},y=n("h1",{id:"implementing-experiments",tabindex:"-1"},[s("Implementing experiments "),n("a",{class:"header-anchor",href:"#implementing-experiments","aria-hidden":"true"},"#")],-1),D=n("h2",{id:"events",tabindex:"-1"},[s("Events "),n("a",{class:"header-anchor",href:"#events","aria-hidden":"true"},"#")],-1),F=l(`<div class="language-python"><button class="copy"></button><span class="lang">python</span><pre><code><span class="line"><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> Experiment</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">EstimateGravity</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">Experiment</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;&quot;&quot;</span><span style="color:#676E95;">An experiment to estimate gravity</span><span style="color:#89DDFF;">&quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">on_execute</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">      time_dilation </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1.0</span><span style="color:#A6ACCD;"> </span></span>
<span class="line"><span style="color:#A6ACCD;">      height </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">52</span></span>
<span class="line"><span style="color:#A6ACCD;">      time </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0.3</span></span>
<span class="line"><span style="color:#A6ACCD;">      g </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> height </span><span style="color:#89DDFF;">/</span><span style="color:#A6ACCD;"> time </span><span style="color:#89DDFF;">**</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">The gravity on the exoplanet is: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> g</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span></code></pre></div>`,1),C=n("code",null,"on_",-1),A=n("p",null,"When you implement your algorithm, pick an appropriate event and add your code in the event method. Of course, you are free to add other methods or properties to your class if needed.",-1),d=n("a",{href:"./../../reference/"},"reference documentation",-1),m=l(`<details class="details custom-block"><summary>Aside: How can I use existing code?</summary><p>If you have some existing code, you can call it from the experiment without any additional changes, for example:</p><div class="language-python"><button class="copy"></button><span class="lang">python</span><pre><code><span class="line"><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> Experiment</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> my_code </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> existing_implementation</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">EstimateGravity</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">Experiment</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">on_execute</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#676E95;"># call into your existing code without any further changes</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#82AAFF;">existing_implementation</span><span style="color:#89DDFF;">()</span></span>
<span class="line"></span></code></pre></div></details><h2 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-hidden="true">#</a></h2><p>In practice, of course, experiments tend to have a number of varying parameters.</p><p>We can define configuration options of the experiment using a <code>Config</code> dataclass placed at the top of the experiment class definition:</p><div class="language-python"><button class="copy"></button><span class="lang">python</span><pre><code><span class="line"><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> dataclasses </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> dataclass</span></span>
<span class="line"><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> Experiment</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">EstimateGravity</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">Experiment</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;&quot;&quot;</span><span style="color:#676E95;">An experiment to estimate gravity</span><span style="color:#89DDFF;">&quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">@</span><span style="color:#82AAFF;">dataclass</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Config</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      time_dilation</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">float</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1.0</span></span>
<span class="line"><span style="color:#A6ACCD;">      verbose</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">bool</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">True</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">on_execute</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">      height </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">52</span></span>
<span class="line"><span style="color:#A6ACCD;">      time </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0.3</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">time_dilation</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">if</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">verbose</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">f</span><span style="color:#C3E88D;">&quot;Assuming height of </span><span style="color:#F78C6C;">{</span><span style="color:#82AAFF;">height</span><span style="color:#F78C6C;">}</span><span style="color:#C3E88D;"> and time of </span><span style="color:#F78C6C;">{</span><span style="color:#82AAFF;">time</span><span style="color:#F78C6C;">}</span><span style="color:#C3E88D;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">      g </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> height </span><span style="color:#89DDFF;">/</span><span style="color:#A6ACCD;"> time </span><span style="color:#89DDFF;">**</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">The gravity on the exoplanet is: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> g</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span></span>
<span class="line"></span></code></pre></div><p>The parameters become available under <code>self.config</code> and can be accessed with object-notation (<code>self.config.my.value</code>) or dict-style access (<code>self.config[&#39;my&#39;][&#39;value&#39;]</code>).</p><p>Notably, the <code>Config</code> dataclass allows for many advanced features such as validation, parameter documentation, computed values, etc., which will be covered in <a href="./../elements-in-depth/advanced-configuration.html">later sections of the tutorial</a>.</p><hr>`,8),h=l(`<div class="language-python"><button class="copy"></button><span class="lang">python</span><pre><code><span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> Experiment</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> Experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">instance</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">estimate_gravity</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">time_dilation</span></span>
<span class="line"><span style="color:#F78C6C;">1.0</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> Experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">instance</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">estimate_gravity</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">{</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">time_dilation</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">})</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">time_dilation</span></span>
<span class="line"><span style="color:#F78C6C;">2.0</span></span>
<span class="line"></span></code></pre></div><p>In the last line, it is worth noting that the <code>int</code> 2 was automatically casted to a <code>float</code> as the dataclass specified. Generally, the experiment configuration types will be enforced to prevent subtle configuration errors.</p><h2 id="design-for-failure" tabindex="-1">Design for failure <a class="header-anchor" href="#design-for-failure" aria-hidden="true">#</a></h2><p>As you may have noted above, experiments can be instantiated and accessed without side-effects (e.g. without necessarily triggering the gravity computation). As a result, we can inspect the configuration and catch mistakes like the following typo early:</p><div class="language-python"><button class="copy"></button><span class="lang">python</span><pre><code><span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> Experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">instance</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">estimate_gravity</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">{</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">time_diliation</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">})</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> gravity</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span></span>
<span class="line"><span style="color:#A6ACCD;">E  ValidationError</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;"> validation error </span><span style="color:#89DDFF;">for</span><span style="color:#A6ACCD;"> Config</span></span>
<span class="line"><span style="color:#A6ACCD;">E  time_diliation</span></span>
<span class="line"></span></code></pre></div><p>Early validation is a key design principle of the experiments; when implementing an experiment, we encourage you to perform checks as early as possible and separate them from your main code. Learn more about <a href="./../elements-in-depth/advanced-configuration.html#validation">early-validation techniques</a>.</p><p>Finally, it is good practice to design your code in a way that it can be resumed automatically if failures occur. For example, you may checkpoint and automatically reload intermediate results. Check out the <a href="./../../examples/checkpointing.html">checkpointing example</a> to see this in action.</p>`,7);function u(g,f,_,v,x,E){const a=r("Pydoc");return t(),c("div",null,[y,D,n("p",null,[s("The experiments that we have created so far have been nothing more than an empty shell. Let's add an actual implementation by overriding "),e(a,{caption:"on_execute()"},{default:o(()=>[s("machinable.Experiment.on_execute")]),_:1})]),F,n("p",null,[s("The "),e(a,null,{default:o(()=>[s("machinable.Experiment")]),_:1}),s(" base class provides a variety of these lifecycle event methods that are prefixed with "),C,s(", such as "),e(a,{caption:"on_create()"},{default:o(()=>[s("machinable.Experiment.on_create")]),_:1}),s(", "),e(a,{caption:"on_success()"},{default:o(()=>[s("machinable.Experiment.on_success")]),_:1}),s(", etc.")]),A,n("p",null,[s("The event methods will be called automatically at the appropriate time, so you don't have to call them manually. For example, code placed in the "),e(a,{caption:"on_failure()"},{default:o(()=>[s("machinable.Experiment.on_failure")]),_:1}),s(" event is automatically invoked if an exception occurs.")]),n("p",null,[s("Feel free to explore all available events in the "),d,s("; in most cases, placing your algorithms in the "),e(a,{caption:"on_execute()"},{default:o(()=>[s("machinable.Experiment.on_execute")]),_:1}),s(" method is the right choice.")]),m,n("p",null,[s("To instantiate the experiment with different parameters, you can pass a dictionary as argument to "),e(a,null,{default:o(()=>[s("machinable.Experiment.instance")]),_:1}),s(", for example:")]),h])}const w=p(i,[["render",u]]);export{T as __pageData,w as default};

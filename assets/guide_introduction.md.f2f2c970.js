import{_ as s,o as a,c as n,O as l}from"./chunks/framework.62020867.js";const C=JSON.parse('{"title":"Introduction","description":"","frontmatter":{},"headers":[],"relativePath":"guide/introduction.md","filePath":"guide/introduction.md"}'),o={name:"guide/introduction.md"},p=l(`<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h1><h2 id="what-is-machinable" tabindex="-1">What is machinable? <a class="header-anchor" href="#what-is-machinable" aria-label="Permalink to &quot;What is machinable?&quot;">​</a></h2><p><em>machinable</em> is a Python API for research code. It provides an object-oriented skeleton that helps you develop and experiment in a unified interface while handling tedious housekeeping behind the scenes.</p><p>The key idea is to unify the running of code and the retrieval of produced results in one abstraction. A detailed discussion of this approach can be found in the <a href="./../about/approach.html">about section</a>, but for now, here is a minimal example that illustrates the idea.</p><ol><li>Write some code</li></ol><div class="vp-code-group"><div class="tabs"><input type="radio" name="group-J_fKE" id="tab-vVgUYxJ" checked="checked"><label for="tab-vVgUYxJ">montecarlo.py</label></div><div class="blocks"><div class="language-python active"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> random </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> random</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> pydantic </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> BaseModel</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Field</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> Component</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">EstimatePi</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">Component</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Config</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">BaseModel</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        samples</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">__call__</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        count </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> _ </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">range</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">samples</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">            x</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> y </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">random</span><span style="color:#89DDFF;">(),</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">random</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">            count </span><span style="color:#89DDFF;">+=</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">int</span><span style="color:#89DDFF;">((</span><span style="color:#82AAFF;">x</span><span style="color:#89DDFF;">**</span><span style="color:#F78C6C;">2</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">+</span><span style="color:#82AAFF;"> y</span><span style="color:#89DDFF;">**</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">)</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#82AAFF;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        pi </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">4</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> count </span><span style="color:#89DDFF;">/</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">samples</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        self</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">save_file</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">            </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">result.json</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#82AAFF;">            </span><span style="color:#89DDFF;">{</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">count</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> count</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">pi</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> pi</span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#82AAFF;">        </span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">summary</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">execution</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">is_finished</span><span style="color:#89DDFF;">():</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#C792EA;">f</span><span style="color:#C3E88D;">&quot;After </span><span style="color:#F78C6C;">{</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">samples</span><span style="color:#F78C6C;">}</span><span style="color:#C3E88D;"> samples, &quot;</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#C792EA;">f</span><span style="color:#C3E88D;">&quot;PI is approximately </span><span style="color:#F78C6C;">{</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">load_file</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">result.json</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">pi</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#F78C6C;">}</span><span style="color:#C3E88D;">.&quot;</span></span>
<span class="line"><span style="color:#82AAFF;">            </span><span style="color:#89DDFF;">)</span></span></code></pre></div></div></div><ol start="2"><li>Run and inspect it using a unified abstraction</li></ol><div class="vp-code-group"><div class="tabs"><input type="radio" name="group-kRMo9" id="tab-RNA6gBr" checked="checked"><label for="tab-RNA6gBr">Python</label><input type="radio" name="group-kRMo9" id="tab-p49svhQ"><label for="tab-p49svhQ">Jupyter</label><input type="radio" name="group-kRMo9" id="tab-hepGd3W"><label for="tab-hepGd3W">CLI</label></div><div class="blocks"><div class="language-python active"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> get</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Imports component in \`montecarlo.py\` with samples=150;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># if an component with this configuration exists, it</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># is automatically reloaded.</span></span>
<span class="line"><span style="color:#A6ACCD;">experiment </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">montecarlo</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">{</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">samples</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> </span><span style="color:#F78C6C;">150</span><span style="color:#89DDFF;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Executes the component unless it&#39;s already been computed</span></span>
<span class="line"><span style="color:#A6ACCD;">experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">launch</span><span style="color:#89DDFF;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">summary</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># &gt;&gt;&gt; After 150 samples, PI is approximately 3.1466666666666665.</span></span></code></pre></div><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> get</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> experiment </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">montecarlo</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">{</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">samples</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> </span><span style="color:#F78C6C;">150</span><span style="color:#89DDFF;">})</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">launch</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">Component </span><span style="color:#89DDFF;">&lt;</span><span style="color:#A6ACCD;">24aee0f</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">summary</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">After </span><span style="color:#F78C6C;">150</span><span style="color:#A6ACCD;"> samples</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> PI </span><span style="color:#89DDFF;">is</span><span style="color:#A6ACCD;"> approximately </span><span style="color:#F78C6C;">3.1466666666666665</span><span style="color:#89DDFF;">.</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> experiment</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">execution</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">nickname</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&#39;</span><span style="color:#676E95;font-style:italic;">chocolate_mosquito</span><span style="color:#89DDFF;font-style:italic;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">finished_at</span><span style="color:#89DDFF;">().</span><span style="color:#82AAFF;">humanize</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&#39;</span><span style="color:#676E95;font-style:italic;">finished just now</span><span style="color:#89DDFF;font-style:italic;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;&gt;&gt;</span><span style="color:#A6ACCD;"> experiment</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">local_directory</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&#39;</span><span style="color:#676E95;font-style:italic;">./storage/24aee0fd05024400b116593d1436e9f5</span><span style="color:#89DDFF;font-style:italic;">&#39;</span></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">machinable</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">montecarlo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">samples=</span><span style="color:#F78C6C;">150</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--launch</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--summary</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> After 150 samples, PI is approximately 3.1466666666666665.</span></span></code></pre></div></div></div><p>The above example demonstrates the two core principles of <em>machinable</em> code:</p><ul><li><strong>Enforced modularity</strong> The Monte Carlo algorithm is encapsulated in its own module that can be instantiated with different configuration settings.</li><li><strong>Unified representation</strong> Running code is handled through the same interface that is used to retrieve produced results; multiple invocations simply reload and display the results without re-running the experiment.</li></ul><p>You may already have questions - don&#39;t worry. We will cover the details in the rest of the documentation. For now, please read along so you can have a high-level understanding of what machinable offers.</p><h2 id="what-it-is-not" tabindex="-1">What it is not <a class="header-anchor" href="#what-it-is-not" aria-label="Permalink to &quot;What it is not&quot;">​</a></h2><p>Research is extremely diverse so machinable primarily aims to be an <strong>API-spec</strong> that leaves concrete feature implementation to the user. Check out the <a href="./../examples/">examples</a> to learn what this looks like in practice.</p><h2 id="where-to-go-from-here" tabindex="-1">Where to go from here <a class="header-anchor" href="#where-to-go-from-here" aria-label="Permalink to &quot;Where to go from here&quot;">​</a></h2><div class="info custom-block"><p class="custom-block-title">⚙️   Installation</p><p>We recommend <a href="./installation.html">installing machinable</a> to try things out while following along.</p></div><div class="info custom-block"><p class="custom-block-title">🧑‍🎓   <a href="./element.html">Continue with the Guide</a></p><p>Designed to learn concepts hands-on. Starts with the bare minimum of concepts necessary to start using machinable. Along the way, it will provide pointers to sections that discuss concepts in more detail or cover more advanced functionality.</p></div><div class="info custom-block"><p class="custom-block-title">➡️   <a href="./../examples/">Check out the How-to guides</a></p><p>Explore real-world examples that demonstrate advanced concepts</p></div><div class="info custom-block"><p class="custom-block-title">📖   <a href="./../reference/">Consult the Reference</a></p><p>Describes available APIs in full detail.</p></div>`,18),e=[p];function t(c,r,i,y,F,D){return a(),n("div",null,e)}const d=s(o,[["render",t]]);export{C as __pageData,d as default};
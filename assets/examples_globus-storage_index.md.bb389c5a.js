import{_ as s,o as n,c as a,O as l}from"./chunks/framework.62020867.js";const i=JSON.parse('{"title":"Globus storage","description":"","frontmatter":{},"headers":[],"relativePath":"examples/globus-storage/index.md","filePath":"examples/globus-storage/index.md"}'),o={name:"examples/globus-storage/index.md"},p=l(`<h1 id="globus-storage" tabindex="-1">Globus storage <a class="header-anchor" href="#globus-storage" aria-label="Permalink to &quot;Globus storage&quot;">​</a></h1><p>Integration for <a href="https://www.globus.org/" target="_blank" rel="noreferrer">Globus Compute</a>.</p><h2 id="usage-example" tabindex="-1">Usage example <a class="header-anchor" href="#usage-example" aria-label="Permalink to &quot;Usage example&quot;">​</a></h2><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> get</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">globus</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">{</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">client_id</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#82AAFF;"> ...</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> ...</span><span style="color:#89DDFF;">}).</span><span style="color:#82AAFF;">__enter__</span><span style="color:#89DDFF;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># your code</span></span></code></pre></div><h2 id="source" tabindex="-1">Source <a class="header-anchor" href="#source" aria-label="Permalink to &quot;Source&quot;">​</a></h2><div class="vp-code-group"><div class="tabs"><input type="radio" name="group-UR7Kj" id="tab-NzNeALX" checked="checked"><label for="tab-NzNeALX">globus.py</label></div><div class="blocks"><div class="language-py active"><button title="Copy Code" class="copy"></button><span class="lang">py</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> os</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> dataclasses </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> dataclass</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> globus_sdk </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">    NativeAppAuthClient</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    RefreshTokenAuthorizer</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    TransferClient</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    TransferData</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> globus_sdk</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">scopes </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> TransferScopes</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> globus_sdk</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">services</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">transfer</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">errors </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> TransferAPIError</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> globus_sdk</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">tokenstorage </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> SimpleJSONFileAdapter</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> machinable </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> Storage</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> machinable</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">config </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> RequiredField</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Globus</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">Storage</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">@</span><span style="color:#82AAFF;">dataclass</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Config</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">        client_id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">str</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> RequiredField</span></span>
<span class="line"><span style="color:#A6ACCD;">        local_endpoint_id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">str</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> RequiredField</span></span>
<span class="line"><span style="color:#A6ACCD;">        local_endpoint_directory</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">str</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> RequiredField</span></span>
<span class="line"><span style="color:#A6ACCD;">        remote_endpoint_id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">str</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> RequiredField</span></span>
<span class="line"><span style="color:#A6ACCD;">        remote_endpoint_directory</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">str</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> RequiredField</span></span>
<span class="line"><span style="color:#A6ACCD;">        auth_filepath</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">str</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">~/.globus-tokens.json</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">__init__</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">version</span><span style="color:#89DDFF;">=None):</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#FFCB6B;">super</span><span style="color:#89DDFF;">().</span><span style="color:#82AAFF;">__init__</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">version</span><span style="color:#89DDFF;">=</span><span style="color:#82AAFF;">version</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_auth_client</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None</span></span>
<span class="line"><span style="color:#A6ACCD;">        self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_auth_file</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None</span></span>
<span class="line"><span style="color:#A6ACCD;">        self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_authorizer</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None</span></span>
<span class="line"><span style="color:#A6ACCD;">        self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_transfer_client</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">@</span><span style="color:#FFCB6B;">property</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">auth_client</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_auth_client</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">is</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None:</span></span>
<span class="line"><span style="color:#A6ACCD;">            self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_auth_client</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">NativeAppAuthClient</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">client_id</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_auth_client</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">@</span><span style="color:#FFCB6B;">property</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">auth_file</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_auth_file</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">is</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None:</span></span>
<span class="line"><span style="color:#A6ACCD;">            self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_auth_file</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">SimpleJSONFileAdapter</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">                os</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">path</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">expanduser</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_filepath</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#82AAFF;">            </span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_auth_file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">@</span><span style="color:#FFCB6B;">property</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">authorizer</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_authorizer</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">is</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None:</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">not</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_file</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">file_exists</span><span style="color:#89DDFF;">():</span></span>
<span class="line"><span style="color:#A6ACCD;">                </span><span style="color:#676E95;font-style:italic;"># do a login flow, getting back initial tokens</span></span>
<span class="line"><span style="color:#A6ACCD;">                self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_client</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">oauth2_start_flow</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">                    </span><span style="color:#A6ACCD;font-style:italic;">requested_scopes</span><span style="color:#89DDFF;">=</span><span style="color:#C792EA;">f</span><span style="color:#C3E88D;">&quot;</span><span style="color:#F78C6C;">{</span><span style="color:#82AAFF;">TransferScopes</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">all</span><span style="color:#F78C6C;">}</span><span style="color:#C3E88D;">[*https://auth.globus.org/scopes/</span><span style="color:#F78C6C;">{</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">remote_endpoint_id</span><span style="color:#F78C6C;">}</span><span style="color:#C3E88D;">/data_access]&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#82AAFF;">                    </span><span style="color:#A6ACCD;font-style:italic;">refresh_tokens</span><span style="color:#89DDFF;">=True,</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">                authorize_url </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_client</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">oauth2_get_authorize_url</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">                </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">f</span><span style="color:#C3E88D;">&quot;Please go to this URL and login:</span><span style="color:#A6ACCD;">\\n\\n</span><span style="color:#F78C6C;">{</span><span style="color:#82AAFF;">authorize_url</span><span style="color:#F78C6C;">}</span><span style="color:#A6ACCD;">\\n</span><span style="color:#C3E88D;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">                auth_code </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">input</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Please enter the code here: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">).</span><span style="color:#82AAFF;">strip</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">                tokens </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_client</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">oauth2_exchange_code_for_tokens</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">                    auth_code</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">                self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_file</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">store</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">tokens</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">                tokens </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> tokens</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">by_resource_server</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">transfer.api.globus.org</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">                </span><span style="color:#676E95;font-style:italic;"># otherwise, we already did login; load the tokens</span></span>
<span class="line"><span style="color:#A6ACCD;">                tokens </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_file</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get_token_data</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">                    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">transfer.api.globus.org</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">            self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_authorizer</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">RefreshTokenAuthorizer</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">                tokens</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">refresh_token</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">],</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_client</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#A6ACCD;font-style:italic;">access_token</span><span style="color:#89DDFF;">=</span><span style="color:#82AAFF;">tokens</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">access_token</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">],</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#A6ACCD;font-style:italic;">expires_at</span><span style="color:#89DDFF;">=</span><span style="color:#82AAFF;">tokens</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">expires_at_seconds</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">],</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#A6ACCD;font-style:italic;">on_refresh</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_file</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">on_refresh</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#82AAFF;">            </span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_authorizer</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">@</span><span style="color:#FFCB6B;">property</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">transfer_client</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_transfer_client</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">is</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None:</span></span>
<span class="line"><span style="color:#A6ACCD;">            self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_transfer_client</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">TransferClient</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">authorizer</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">authorizer</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">_transfer_client</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">commit</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">interface</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Interface</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">-&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None:</span></span>
<span class="line"><span style="color:#A6ACCD;">        ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">update</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">interface</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Interface</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">-&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">None:</span></span>
<span class="line"><span style="color:#A6ACCD;">        ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">contains</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">uuid</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">str</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">-&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">bool</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># check if folder exists on globus storage</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">try</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">            response </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">transfer_client</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">operation_ls</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">remote_endpoint_id</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#A6ACCD;font-style:italic;">path</span><span style="color:#89DDFF;">=</span><span style="color:#82AAFF;">os</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">path</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">join</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">remote_endpoint_directory</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> uuid</span><span style="color:#89DDFF;">),</span></span>
<span class="line"><span style="color:#82AAFF;">            </span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">except</span><span style="color:#A6ACCD;"> TransferAPIError </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> e</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> e</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">code</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ClientError.NotFound</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">                </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">False</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">elif</span><span style="color:#A6ACCD;"> e</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">code</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ConsentRequired</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">                </span><span style="color:#89DDFF;font-style:italic;">raise</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">RuntimeError</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#82AAFF;">                    </span><span style="color:#C792EA;">f</span><span style="color:#C3E88D;">&quot;You do not have the right permissions. Try removing </span><span style="color:#F78C6C;">{</span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">config</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">auth_filepath</span><span style="color:#F78C6C;">}</span><span style="color:#C3E88D;"> and authenticating again with the appropriate identity provider.&quot;</span></span>
<span class="line"><span style="color:#82AAFF;">                </span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> e</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">raise</span><span style="color:#A6ACCD;"> e</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> item </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> response</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> item</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">name</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">.machinable</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">                </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">True</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">False</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">retrieve</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;font-style:italic;">self</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">uuid</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">str</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">local_directory</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">str</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">-&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">bool</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># task_data = TransferData(</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;">#     source_endpoint=self.config.remote_endpoint_id,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;">#     destination_endpoint=self.config.local_endpoint_id,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># )</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># task_data.add_item(</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;">#     os.path.join(self.config.remote_endpoint_directory, uuid),</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;">#     target_directory,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># )</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># task_doc = self.transfer_client.submit_transfer(task_data)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># task_id = task_doc[&quot;task_id&quot;]</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># print(f&quot;submitted transfer, task_id={task_id}&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">False</span></span></code></pre></div></div></div>`,6),e=[p];function t(c,r,D,y,F,A){return n(),a("div",null,e)}const f=s(o,[["render",t]]);export{i as __pageData,f as default};

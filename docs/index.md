---
layout: home

hero:
  name: machinable
  text: a modular system for research code
  image:
    src: /logo/logo.png
    alt: machinable-logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: Agents & MCP
      link: /mcp/overview
    - theme: alt
      text: View on GitHub
      link: https://github.com/machinable-org/machinable
---

<script setup>
import { ref, nextTick } from 'vue'
// transcripts live in home.data.mts, highlighted at build time with the
// site's shiki (python grammar)
import { data as sections } from './home.data.mts'

const active = ref(sections.map(() => 0))
const termEls = ref([])

function visibleLines(si) {
  const section = sections[si]
  if (section.accumulate === false) {
    // each step is its own window (e.g. python / bash / jupyter)
    const i = active.value[si]
    return section.steps[i].lines.map((line, j) => ({
      ...line,
      key: `${i}-${j}`,
      fresh: true,
    }))
  }
  return section.steps
    .slice(0, active.value[si] + 1)
    .flatMap((step, i) =>
      step.lines.map((line, j) => ({
        ...line,
        key: `${i}-${j}`,
        fresh: i === active.value[si],
      }))
    )
}

function terminalTitle(si) {
  return sections[si].steps[active.value[si]].term || 'python'
}

function terminalHeight(section) {
  const lines =
    section.accumulate === false
      ? Math.max(...section.steps.map((step) => step.lines.length))
      : section.steps.reduce((n, step) => n + step.lines.length, 0)
  return Math.ceil((lines + 1) * 22.1 + 36) + 'px'
}

const more = [
  {
    title: 'Storage & mirrors',
    details:
      'Results live in a durable home; remote backends mirror them and fetch on demand.',
    link: '/guide/storage',
  },
  {
    title: 'Provenance',
    details:
      'Every run captures the code state that produced it: commit, diff, and environment.',
    link: '/guide/provenance',
  },
  {
    title: 'Relations & lineage',
    details:
      'Runs declare what they use; lineage stays queryable in both directions.',
    link: '/guide/relations',
  },
  {
    title: 'Scopes & grouping',
    details:
      'Seeds, trials, and folds share a config yet stay distinct and findable via predicates.',
    link: '/guide/identity',
  },
  {
    title: 'API server & live view',
    details:
      'Serve projects over HTTP and watch runs live from a terminal UI.',
    link: '/guide/server',
  },
  {
    title: 'Agents & MCP',
    details:
      'Agents drive via MCP; contracts tell them what to write next; you can stay in the loop easily.',
    link: '/mcp/overview',
  },
]

function setStep(si, i) {
  active.value[si] = Math.max(0, Math.min(i, sections[si].steps.length - 1))
  nextTick(() => {
    const el = termEls.value[si]
    if (el) el.scrollTop = el.scrollHeight
  })
}
</script>

<section v-for="(sec, si) in sections" :key="sec.heading" class="loop">
  <h2 class="loop-heading">{{ sec.heading }}</h2>
  <p class="loop-sub">{{ sec.sub }}</p>
  <div class="loop-grid">
    <ol class="loop-steps">
      <li v-for="(step, i) in sec.steps" :key="step.title">
        <button
          class="loop-step"
          :class="{ active: i === active[si], seen: i < active[si] }"
          @click="setStep(si, i)"
        >
          <span class="loop-step-index">{{ i + 1 }}</span>
          <span>
            <strong>{{ step.title }}</strong>
            <small>{{ step.blurb }}</small>
          </span>
        </button>
      </li>
    </ol>
    <div class="loop-terminal-wrap">
      <div class="loop-terminal">
        <div class="loop-terminal-bar">
          <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
          <span class="loop-terminal-title">{{ terminalTitle(si) }}</span>
        </div>
        <pre
          class="loop-terminal-body"
          :style="{ height: terminalHeight(sec) }"
          :ref="el => (termEls[si] = el)"
        ><code><span
          v-for="line in visibleLines(si)"
          :key="line.key"
          class="loop-line"
          :class="[line.t, { fresh: line.fresh }]"
          v-html="line.html + '\n'"
        ></span><span class="loop-cursor">▋</span></code></pre>
      </div>
      <div class="loop-controls">
        <button
          v-if="active[si] < sec.steps.length - 1"
          class="loop-next"
          @click="setStep(si, active[si] + 1)"
        >
          Next: {{ sec.steps[active[si] + 1].title }} →
        </button>
        <template v-else>
          <a v-if="si === 0" class="loop-next" href="/guide/introduction">Get started →</a>
          <button class="loop-replay" @click="setStep(si, 0)">↺ Replay</button>
        </template>
      </div>
    </div>
  </div>
</section>

<section class="more">
  <h2 class="loop-heading">There is more to discover ...</h2>
  <div class="more-grid">
    <a v-for="item in more" :key="item.title" :href="item.link" class="more-card">
      <strong>{{ item.title }}</strong>
      <p>{{ item.details }}</p>
      <span class="more-link">Learn more →</span>
    </a>
  </div>
</section>

<section class="home-cta">
  <h2 class="loop-heading">Ready to get started? Try it!</h2>
  <div class="home-cta-install"><code>pip install machinable</code></div>
  <p class="home-cta-links">
    <a href="/guide/quickstart">Quickstart</a> ·
    <a href="/guide/putting-it-all-together">See the whole loop</a> ·
    <a href="/integrations/">Browse integrations</a>
  </p>
</section>

<style scoped>
.loop {
  max-width: 1152px;
  margin: 96px auto 0;
  padding: 0 24px;
}
.loop-heading {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  border: none;
  margin: 0;
  padding: 0;
}
.loop-sub {
  text-align: center;
  color: var(--vp-c-text-2);
  margin: 8px 0 40px;
}
.loop-grid {
  display: grid;
  grid-template-columns: minmax(280px, 5fr) 7fr;
  gap: 32px;
  align-items: start;
}
@media (max-width: 768px) {
  .loop-grid { grid-template-columns: 1fr; }
}
.loop-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.loop-steps li { margin: 0; }
.loop-step {
  display: flex;
  gap: 12px;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s, opacity 0.2s;
  opacity: 0.75;
}
.loop-step:hover { border-color: var(--vp-c-brand-1); opacity: 1; }
.loop-step.active {
  border-color: var(--vp-c-brand-1);
  opacity: 1;
}
.loop-step.seen { opacity: 0.9; }
.loop-step-index {
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}
.loop-step.active .loop-step-index,
.loop-step.seen .loop-step-index {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.loop-step strong { display: block; font-size: 14px; }
.loop-step small {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  line-height: 1.45;
  margin-top: 2px;
}
.loop-terminal {
  border-radius: 12px;
  overflow: hidden;
  background: #17191e;
  border: 1px solid var(--vp-c-divider);
  box-shadow: var(--vp-shadow-2);
}
.loop-terminal-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #22252c;
}
.loop-terminal-bar .dot { width: 11px; height: 11px; border-radius: 50%; }
.dot.red { background: #ff5f57; }
.dot.yellow { background: #febc2e; }
.dot.green { background: #28c840; }
.loop-terminal-title {
  margin-left: 8px;
  color: #9ca3af;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
}
.loop-terminal-body {
  margin: 0;
  padding: 18px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  overflow: auto;
  background: transparent;
}
.loop-line { display: block; white-space: pre; }
.loop-line.in { color: #e4e4e7; }
.loop-line.out { color: #7dd3a8; }
.loop-line.note { color: #71717a; font-style: italic; }
.loop-line :deep(.hl-prompt) { color: #6b7280; }
.loop-line.fresh { animation: loop-appear 0.35s ease both; }
@keyframes loop-appear {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: none; }
}
.loop-cursor {
  color: #7dd3a8;
  animation: loop-blink 1.1s steps(1) infinite;
}
@keyframes loop-blink { 50% { opacity: 0; } }
.loop-controls {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 14px;
}
.loop-next {
  display: inline-block;
  padding: 8px 18px;
  border-radius: 20px;
  background: var(--vp-c-brand-1);
  color: white;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
  text-decoration: none;
}
.loop-next:hover { background: var(--vp-c-brand-2); color: white; }
.loop-replay {
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.loop-replay:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

.more {
  max-width: 1152px;
  margin: 96px auto 0;
  padding: 0 24px;
}
.more .loop-heading { margin-bottom: 40px; }
.more-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
.more-card {
  display: block;
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s;
}
.more-card:hover { border-color: var(--vp-c-brand-1); }
.more-card strong { font-size: 15px; }
.more-card p {
  margin: 6px 0 10px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.more-link { font-size: 13px; color: var(--vp-c-brand-1); font-weight: 500; }

.home-cta {
  max-width: 960px;
  margin: 96px auto 48px;
  padding: 0 24px;
  text-align: center;
}
.home-cta .loop-heading { margin-bottom: 16px; }
.home-cta-install code {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 15px;
}
.home-cta-links { margin-top: 16px; font-size: 14px; }
.home-cta-links a { color: var(--vp-c-brand-1); text-decoration: none; }
.home-cta-links a:hover { text-decoration: underline; }
</style>

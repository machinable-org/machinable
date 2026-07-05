// Build-time data loader for the homepage terminal walkthroughs.
//
// Runs in Node during dev/build, where VitePress's highlighter (shiki) is
// available, where every input line is tokenized with the real grammar and only
// the resulting HTML ships to the client.
//
// Line types: 'in' (Python input), 'sh' (shell input), 'out' (output),
// 'note' (comment aside). Sections accumulate like a session unless
// `accumulate: false`, in which case each step is its own window and may set
// a `term` title.
import { createHighlighter } from "shiki";

const THEME = "one-dark-pro"; // the terminal is always dark, in both site themes

const sections = [
  {
    heading: "The research loop, in one abstraction",
    sub: "No names to invent, no paths to remember.",
    steps: [
      {
        title: "Run it",
        blurb:
          "An Interface bundles code and configuration. get() builds it; launch() runs it and stores a record.",
        lines: [
          { t: "in", s: `>>> from machinable import get` },
          { t: "in", s: `>>> get("train", {"lr": 0.1}).launch()` },
          { t: "out", s: `Train [9eBFve] · finished in 12s` },
        ],
      },
      {
        title: "Ask again, it’s already there",
        blurb:
          "The configuration is the address so no run names nor paths are needed. Asking for something you already computed simply returns it.",
        lines: [
          { t: "in", s: `>>> get("train", {"lr": 0.1}).loss()` },
          { t: "out", s: `0.087` },
          {
            t: "note",
            s: `# same module + config → same record; nothing recomputed`,
          },
        ],
      },
      {
        title: "Sweeps are incremental",
        blurb:
          "Grids are plain Python loops. Re-running a sweep only does the new work.",
        lines: [
          { t: "in", s: `>>> for lr in (0.1, 0.01, 0.001):` },
          { t: "in", s: `...     get("train", {"lr": lr}).launch()` },
          { t: "out", s: `Train [9eBFve] · reused` },
          { t: "out", s: `Train [k2Pmqa] · finished in 12s` },
          { t: "out", s: `Train [w7Rt3n] · finished in 11s` },
        ],
      },
      {
        title: "Questions are runs too",
        blurb:
          "A statistical comparison is an ordinary interface whose verdict is stored, cached on its operands, and reproducible like any other result.",
        lines: [
          {
            t: "in",
            s: `>>> a, b = get("optimizers", ["~sgd"]), get("optimizers", ["~adam"])`,
          },
          {
            t: "in",
            s: `>>> get("outperforms", {"quantity": "loss"}).of(a, b).launch().verdict()`,
          },
          {
            t: "out",
            s: `{'claim': 'a is less than b on loss', 'holds': True, 'p_value': 0.003}`,
          },
        ],
      },
    ],
  },
  {
    heading: "Configuration, declared once",
    sub: "A typed pydantic model with named variants and computed values.",
    steps: [
      {
        title: "A typed config on the interface",
        blurb:
          "Config is a plain pydantic model: typed, validated, with defaults. Methods next to it define computed values and named variants.",
        lines: [
          { t: "in", s: `>>> class Train(Interface):` },
          { t: "in", s: `...     class Config(BaseModel):` },
          { t: "in", s: `...         optimizer: str = "sgd"` },
          { t: "in", s: `...         batch_size: int = 256` },
          { t: "in", s: `...         lr: float = "scaled(0.1)"` },
          { t: "in", s: `...` },
          { t: "in", s: `...     def config_scaled(self, base):` },
          {
            t: "in",
            s: `...         return base * self.config.batch_size / 256`,
          },
          { t: "in", s: `...` },
          { t: "in", s: `...     def version_adam(self):` },
          {
            t: "in",
            s: `...         return {"optimizer": "adam", "lr": 1e-3}`,
          },
        ],
      },
      {
        title: "Derived values stay consistent",
        blurb:
          'A string default like "scaled(0.1)" names a config method computed from the rest of the config, so the rate follows whenever the batch size changes.',
        lines: [
          { t: "in", s: `>>> get("train").config.lr` },
          { t: "out", s: `0.1` },
          { t: "in", s: `>>> get("train", {"batch_size": 1024}).config.lr` },
          { t: "out", s: `0.4` },
          { t: "note", s: `# the linear scaling rule, encoded once` },
        ],
      },
      {
        title: "Variants are ~versions that compose",
        blurb:
          "version_<name> methods become reusable ~versions; they merge with plain dict updates, left to right.",
        lines: [
          {
            t: "in",
            s: `>>> get("train", ["~adam", {"batch_size": 512}]).launch()`,
          },
          { t: "out", s: `Train [w7Rt3n] · finished in 12s` },
        ],
      },
      {
        title: "Spelling never matters",
        blurb:
          "Identity hashes the canonical configuration, not how you wrote it, so a ~version and its expansion are the same run.",
        lines: [
          {
            t: "in",
            s: `>>> get("train", ["~adam"]).config == get("train", {"optimizer": "adam", "lr": 1e-3}).config`,
          },
          { t: "out", s: `True` },
          { t: "note", s: `# same canonical config → same record` },
        ],
      },
    ],
  },
  {
    heading: "One interface, everywhere",
    sub: "Python, terminal, or notebook: the same expression, the same records. Integrations bring your stack.",
    accumulate: false,
    steps: [
      {
        title: "In Python",
        term: "python",
        blurb:
          "The API that runs code also queries it, with all() returning collections you can filter and map.",
        lines: [
          { t: "in", s: `>>> get("train").all()` },
          { t: "out", s: `Interfaces <7>` },
          { t: "in", s: `>>> get("train").all().map(lambda t: t.loss())` },
          { t: "out", s: `[0.087, 0.081, 0.079, 0.091, 0.084, 0.088, 0.082]` },
        ],
      },
      {
        title: "In the terminal",
        term: "bash",
        blurb:
          "The CLI mirrors get() exactly, so the same arguments address the same records and scripts and shells share everything.",
        lines: [
          {
            t: "sh",
            s: `$ machinable get train ~adam batch_size=512 --launch`,
          },
          { t: "out", s: `Train [w7Rt3n] · reused` },
          {
            t: "note",
            s: `# already computed in Python above, so the CLI finds it`,
          },
        ],
      },
      {
        title: "In a notebook",
        term: "jupyter",
        blurb:
          "Widgets pair results with a rendering module, so figures, controls, and verdicts display live in Jupyter and the API server’s UI.",
        lines: [
          { t: "in", s: `>>> get("loss_curve", uses=get("train").all())` },
          { t: "out", s: `⧉ LossCurve · interactive view renders inline` },
        ],
      },
      {
        title: "On your infrastructure",
        term: "python",
        blurb:
          "Executions, storage mirrors, and components connect as contexts; pull Slurm, MPI, Globus and more from the integrations library.",
        lines: [
          { t: "in", s: `>>> with get("slurm", {"ranks": 8}):` },
          { t: "in", s: `...     get("train", ["~adam"]).launch()` },
          { t: "out", s: `Train [p4Xn8c] · submitted to Slurm` },
          { t: "note", s: `# same code, on the cluster` },
        ],
      },
    ],
  },
];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default {
  async load() {
    const highlighter = await createHighlighter({
      themes: [THEME],
      langs: ["python", "shellsession"],
    });

    const tokens = (src, lang) =>
      highlighter
        .codeToTokensBase(src, { lang, theme: THEME })
        .map((lineTokens) =>
          lineTokens
            .map(
              (t) => `<span style="color:${t.color}">${esc(t.content)}</span>`,
            )
            .join(""),
        )
        .join("");

    const render = (line) => {
      if (line.t === "sh") return tokens(line.s, "shellsession");
      if (line.t !== "in") return esc(line.s);
      // dim the REPL prompt; highlight the rest as Python
      let src = line.s;
      let prompt = "";
      const m = src.match(/^(>>> |\.\.\. |\.\.\.$)/);
      if (m) {
        prompt = `<span class="hl-prompt">${esc(m[1])}</span>`;
        src = src.slice(m[1].length);
      }
      return prompt + tokens(src, "python");
    };

    const data = sections.map((section) => ({
      ...section,
      steps: section.steps.map((step) => ({
        ...step,
        lines: step.lines.map((line) => ({ t: line.t, html: render(line) })),
      })),
    }));
    highlighter.dispose();
    return data;
  },
};

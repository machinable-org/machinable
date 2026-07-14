var Fm = Object.defineProperty;
var Ef = (n) => {
  throw TypeError(n);
};
var Hm = (n, e, t) => e in n ? Fm(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var Mt = (n, e, t) => Hm(n, typeof e != "symbol" ? e + "" : e, t), Ml = (n, e, t) => e.has(n) || Ef("Cannot " + t);
var X = (n, e, t) => (Ml(n, e, "read from private field"), t ? t.call(n) : e.get(n)), be = (n, e, t) => e.has(n) ? Ef("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), ve = (n, e, t, i) => (Ml(n, e, "write to private field"), i ? i.call(n, t) : e.set(n, t), t), Ae = (n, e, t) => (Ml(n, e, "access private method"), t);
var Xc = Array.isArray, Jm = Array.prototype.indexOf, qa = Array.prototype.includes, ll = Array.from, Km = Object.defineProperty, Nr = Object.getOwnPropertyDescriptor, ev = Object.getOwnPropertyDescriptors, tv = Object.prototype, iv = Array.prototype, jO = Object.getPrototypeOf, jf = Object.isExtensible;
const VO = () => {
};
function nv(n) {
  for (var e = 0; e < n.length; e++)
    n[e]();
}
function YO() {
  var n, e, t = new Promise((i, r) => {
    n = i, e = r;
  });
  return { promise: t, resolve: n, reject: e };
}
const Xt = 2, hs = 4, hl = 8, LO = 1 << 24, $i = 16, Ci = 32, Hn = 64, bh = 128, yi = 512, dt = 1024, Rt = 2048, en = 4096, Vt = 8192, fi = 16384, Ss = 32768, Sh = 1 << 25, Jn = 65536, za = 1 << 17, rv = 1 << 18, ys = 1 << 19, sv = 1 << 20, Bi = 1 << 25, wr = 65536, Ma = 1 << 21, Br = 1 << 22, Nn = 1 << 23, br = Symbol("$state"), ov = Symbol("legacy props"), av = Symbol(""), da = Symbol("attributes"), yh = Symbol("class"), kh = Symbol("style"), Ws = Symbol("text"), pa = Symbol("form reset"), cl = new class extends Error {
  constructor() {
    super(...arguments);
    Mt(this, "name", "StaleReactionError");
    Mt(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
var MO;
const lv = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!((MO = globalThis.document) != null && MO.contentType) && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);
function hv() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function cv(n, e, t) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function fv(n) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function uv() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ov(n) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function dv() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function pv(n) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function gv() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function mv() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function vv() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Qv() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const bv = 1, Sv = 2, DO = 4, yv = 8, kv = 16, xv = 1, wv = 4, Pv = 8, _v = 16, Tv = 1, $v = 2, ut = Symbol("uninitialized"), Zv = "http://www.w3.org/1999/xhtml";
function Rv() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Xv() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Cv() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function GO(n) {
  return n === this.v;
}
function Av(n, e) {
  return n != n ? e == e : n !== e || n !== null && typeof n == "object" || typeof n == "function";
}
function IO(n) {
  return !Av(n, this.v);
}
let Yt = null;
function cs(n) {
  Yt = n;
}
function kt(n, e = !1, t) {
  Yt = {
    p: Yt,
    i: !1,
    c: null,
    e: null,
    s: n,
    x: null,
    r: (
      /** @type {Effect} */
      Xe
    ),
    l: null
  };
}
function xt(n) {
  var e = (
    /** @type {ComponentContext} */
    Yt
  ), t = e.e;
  if (t !== null) {
    e.e = null;
    for (var i of t)
      pd(i);
  }
  return e.i = !0, Yt = e.p, /** @type {T} */
  {};
}
function UO() {
  return !0;
}
let cr = [];
function NO() {
  var n = cr;
  cr = [], nv(n);
}
function wn(n) {
  if (cr.length === 0 && !Bs) {
    var e = cr;
    queueMicrotask(() => {
      e === cr && NO();
    });
  }
  cr.push(n);
}
function qv() {
  for (; cr.length > 0; )
    NO();
}
function BO(n) {
  var e = Xe;
  if (e === null)
    return $e.f |= Nn, n;
  if ((e.f & Ss) === 0 && (e.f & hs) === 0)
    throw n;
  Dn(n, e);
}
function Dn(n, e) {
  if (!(e !== null && (e.f & fi) !== 0)) {
    for (; e !== null; ) {
      if ((e.f & bh) !== 0) {
        if ((e.f & Ss) === 0)
          throw n;
        try {
          e.b.error(n);
          return;
        } catch (t) {
          n = t;
        }
      }
      e = e.parent;
    }
    throw n;
  }
}
const zv = -7169;
function ft(n, e) {
  n.f = n.f & zv | e;
}
function Cc(n) {
  (n.f & yi) !== 0 || n.deps === null ? ft(n, dt) : ft(n, en);
}
function FO(n) {
  if (n !== null)
    for (const e of n)
      (e.f & Xt) === 0 || (e.f & wr) === 0 || (e.f ^= wr, FO(
        /** @type {Derived} */
        e.deps
      ));
}
function HO(n, e, t) {
  (n.f & Rt) !== 0 ? e.add(n) : (n.f & en) !== 0 && t.add(n), FO(n.deps), ft(n, dt);
}
let Uo = !1;
function Mv(n) {
  var e = Uo;
  try {
    return Uo = !1, [n(), Uo];
  } finally {
    Uo = e;
  }
}
function Wv(n) {
  let e = 0, t = _r(0), i;
  return () => {
    Mc() && (u(t), Ec(() => (e === 0 && (i = ks(() => n(() => Fs(t)))), e += 1, () => {
      wn(() => {
        e -= 1, e === 0 && (i == null || i(), i = void 0, Fs(t));
      });
    })));
  };
}
var Ev = Jn | ys;
function jv(n, e, t, i) {
  new Vv(n, e, t, i);
}
var pi, Rc, gi, pr, Ut, mi, Wt, oi, vn, gr, Yn, is, $o, Zo, Qn, sl, lt, Yv, Lv, Dv, xh, ga, ma, wh, Ph;
class Vv {
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(e, t, i, r) {
    be(this, lt);
    /** @type {Boundary | null} */
    Mt(this, "parent");
    Mt(this, "is_pending", !1);
    /**
     * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
     * Inherited from parent boundary, or defaults to identity.
     * @type {(error: unknown) => unknown}
     */
    Mt(this, "transform_error");
    /** @type {TemplateNode} */
    be(this, pi);
    /** @type {TemplateNode | null} */
    be(this, Rc, null);
    /** @type {BoundaryProps} */
    be(this, gi);
    /** @type {((anchor: Node) => void)} */
    be(this, pr);
    /** @type {Effect} */
    be(this, Ut);
    /** @type {Effect | null} */
    be(this, mi, null);
    /** @type {Effect | null} */
    be(this, Wt, null);
    /** @type {Effect | null} */
    be(this, oi, null);
    /** @type {DocumentFragment | null} */
    be(this, vn, null);
    be(this, gr, 0);
    be(this, Yn, 0);
    be(this, is, !1);
    /** @type {Set<Effect>} */
    be(this, $o, /* @__PURE__ */ new Set());
    /** @type {Set<Effect>} */
    be(this, Zo, /* @__PURE__ */ new Set());
    /**
     * A source containing the number of pending async deriveds/expressions.
     * Only created if `$effect.pending()` is used inside the boundary,
     * otherwise updating the source results in needless `Batch.ensure()`
     * calls followed by no-op flushes
     * @type {Source<number> | null}
     */
    be(this, Qn, null);
    be(this, sl, Wv(() => (ve(this, Qn, _r(X(this, gr))), () => {
      ve(this, Qn, null);
    })));
    var s;
    ve(this, pi, e), ve(this, gi, t), ve(this, pr, (o) => {
      var a = (
        /** @type {Effect} */
        Xe
      );
      a.b = this, a.f |= bh, i(o);
    }), this.parent = /** @type {Effect} */
    Xe.b, this.transform_error = r ?? ((s = this.parent) == null ? void 0 : s.transform_error) ?? ((o) => o), ve(this, Ut, qo(() => {
      Ae(this, lt, xh).call(this);
    }, Ev));
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(e) {
    HO(e, X(this, $o), X(this, Zo));
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!X(this, gi).pending;
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(e, t) {
    Ae(this, lt, wh).call(this, e, t), ve(this, gr, X(this, gr) + e), !(!X(this, Qn) || X(this, is)) && (ve(this, is, !0), wn(() => {
      ve(this, is, !1), X(this, Qn) && fs(X(this, Qn), X(this, gr));
    }));
  }
  get_effect_pending() {
    return X(this, sl).call(this), u(
      /** @type {Source<number>} */
      X(this, Qn)
    );
  }
  /** @param {unknown} error */
  error(e) {
    if (!X(this, gi).onerror && !X(this, gi).failed)
      throw e;
    fe != null && fe.is_fork ? (X(this, mi) && fe.skip_effect(X(this, mi)), X(this, Wt) && fe.skip_effect(X(this, Wt)), X(this, oi) && fe.skip_effect(X(this, oi)), fe.oncommit(() => {
      Ae(this, lt, Ph).call(this, e);
    })) : Ae(this, lt, Ph).call(this, e);
  }
}
pi = new WeakMap(), Rc = new WeakMap(), gi = new WeakMap(), pr = new WeakMap(), Ut = new WeakMap(), mi = new WeakMap(), Wt = new WeakMap(), oi = new WeakMap(), vn = new WeakMap(), gr = new WeakMap(), Yn = new WeakMap(), is = new WeakMap(), $o = new WeakMap(), Zo = new WeakMap(), Qn = new WeakMap(), sl = new WeakMap(), lt = new WeakSet(), Yv = function() {
  try {
    ve(this, mi, vi(() => X(this, pr).call(this, X(this, pi))));
  } catch (e) {
    this.error(e);
  }
}, /**
 * @param {unknown} error The deserialized error from the server's hydration comment
 */
Lv = function(e) {
  const t = X(this, gi).failed;
  t && ve(this, oi, vi(() => {
    t(
      X(this, pi),
      () => e,
      () => () => {
      }
    );
  }));
}, Dv = function() {
  const e = X(this, gi).pending;
  e && (this.is_pending = !0, ve(this, Wt, vi(() => e(X(this, pi)))), wn(() => {
    var t = ve(this, vn, document.createDocumentFragment()), i = Bn();
    t.append(i), ve(this, mi, Ae(this, lt, ma).call(this, () => vi(() => X(this, pr).call(this, i)))), X(this, Yn) === 0 && (X(this, pi).before(t), ve(this, vn, null), yr(
      /** @type {Effect} */
      X(this, Wt),
      () => {
        ve(this, Wt, null);
      }
    ), Ae(this, lt, ga).call(
      this,
      /** @type {Batch} */
      fe
    ));
  }));
}, xh = function() {
  try {
    if (this.is_pending = this.has_pending_snippet(), ve(this, Yn, 0), ve(this, gr, 0), ve(this, mi, vi(() => {
      X(this, pr).call(this, X(this, pi));
    })), X(this, Yn) > 0) {
      var e = ve(this, vn, document.createDocumentFragment());
      Vc(X(this, mi), e);
      const t = (
        /** @type {(anchor: Node) => void} */
        X(this, gi).pending
      );
      ve(this, Wt, vi(() => t(X(this, pi))));
    } else
      Ae(this, lt, ga).call(
        this,
        /** @type {Batch} */
        fe
      );
  } catch (t) {
    this.error(t);
  }
}, /**
 * @param {Batch} batch
 */
ga = function(e) {
  this.is_pending = !1, e.transfer_effects(X(this, $o), X(this, Zo));
}, /**
 * @template T
 * @param {() => T} fn
 */
ma = function(e) {
  var t = Xe, i = $e, r = Yt;
  tn(X(this, Ut)), ki(X(this, Ut)), cs(X(this, Ut).ctx);
  try {
    return Pr.ensure(), e();
  } catch (s) {
    return BO(s), null;
  } finally {
    tn(t), ki(i), cs(r);
  }
}, /**
 * Updates the pending count associated with the currently visible pending snippet,
 * if any, such that we can replace the snippet with content once work is done
 * @param {1 | -1} d
 * @param {Batch} batch
 */
wh = function(e, t) {
  var i;
  if (!this.has_pending_snippet()) {
    this.parent && Ae(i = this.parent, lt, wh).call(i, e, t);
    return;
  }
  ve(this, Yn, X(this, Yn) + e), X(this, Yn) === 0 && (Ae(this, lt, ga).call(this, t), X(this, Wt) && yr(X(this, Wt), () => {
    ve(this, Wt, null);
  }), X(this, vn) && (X(this, pi).before(X(this, vn)), ve(this, vn, null)));
}, /**
 * @param {unknown} error
 */
Ph = function(e) {
  X(this, mi) && (Ht(X(this, mi)), ve(this, mi, null)), X(this, Wt) && (Ht(X(this, Wt)), ve(this, Wt, null)), X(this, oi) && (Ht(X(this, oi)), ve(this, oi, null));
  var t = X(this, gi).onerror;
  let i = X(this, gi).failed;
  var r = !1, s = !1;
  const o = () => {
    if (r) {
      Cv();
      return;
    }
    r = !0, s && Qv(), X(this, oi) !== null && yr(X(this, oi), () => {
      ve(this, oi, null);
    }), Ae(this, lt, ma).call(this, () => {
      Ae(this, lt, xh).call(this);
    });
  }, a = (l) => {
    try {
      s = !0, t == null || t(l, o), s = !1;
    } catch (h) {
      Dn(h, X(this, Ut) && X(this, Ut).parent);
    }
    i && ve(this, oi, Ae(this, lt, ma).call(this, () => {
      try {
        return vi(() => {
          var h = (
            /** @type {Effect} */
            Xe
          );
          h.b = this, h.f |= bh, i(
            X(this, pi),
            () => l,
            () => o
          );
        });
      } catch (h) {
        return Dn(
          h,
          /** @type {Effect} */
          X(this, Ut).parent
        ), null;
      }
    }));
  };
  wn(() => {
    var l;
    try {
      l = this.transform_error(e);
    } catch (h) {
      Dn(h, X(this, Ut) && X(this, Ut).parent);
      return;
    }
    l !== null && typeof l == "object" && typeof /** @type {any} */
    l.then == "function" ? l.then(
      a,
      /** @param {unknown} e */
      (h) => Dn(h, X(this, Ut) && X(this, Ut).parent)
    ) : a(l);
  });
};
function Gv(n, e, t, i) {
  const r = ho;
  var s = n.filter((d) => !d.settled), o = e.map(r);
  if (t.length === 0 && s.length === 0) {
    i(o);
    return;
  }
  var a = (
    /** @type {Effect} */
    Xe
  ), l = Iv(), h = s.length === 1 ? s[0].promise : s.length > 1 ? Promise.all(s.map((d) => d.promise)) : null;
  function c(d) {
    if ((a.f & fi) === 0) {
      l();
      try {
        i([...o, ...d]);
      } catch (p) {
        Dn(p, a);
      }
      Wa();
    }
  }
  var f = JO();
  if (t.length === 0) {
    h.then(() => c([])).finally(f);
    return;
  }
  function O() {
    Promise.all(t.map((d) => /* @__PURE__ */ Uv(d))).then(c).catch((d) => Dn(d, a)).finally(f);
  }
  h ? h.then(() => {
    l(), O(), Wa();
  }) : O();
}
function Iv() {
  var n = (
    /** @type {Effect} */
    Xe
  ), e = $e, t = Yt, i = (
    /** @type {Batch} */
    fe
  );
  return function(s = !0) {
    tn(n), ki(e), cs(t), s && (n.f & fi) === 0 && (i == null || i.activate(), i == null || i.apply());
  };
}
function Wa(n = !0) {
  tn(null), ki(null), cs(null), n && (fe == null || fe.deactivate());
}
function JO() {
  var n = (
    /** @type {Effect} */
    Xe
  ), e = n.b, t = (
    /** @type {Batch} */
    fe
  ), i = !!(e != null && e.is_rendered());
  return e == null || e.update_pending_count(1, t), t.increment(i, n), () => {
    e == null || e.update_pending_count(-1, t), t.decrement(i, n);
  };
}
// @__NO_SIDE_EFFECTS__
function ho(n) {
  var e = Xt | Rt;
  return Xe !== null && (Xe.f |= ys), {
    ctx: Yt,
    deps: null,
    effects: null,
    equals: GO,
    f: e,
    fn: n,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      ut
    ),
    wv: 0,
    parent: Xe,
    ac: null
  };
}
const Es = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function Uv(n, e, t) {
  let i = (
    /** @type {Effect | null} */
    Xe
  );
  i === null && hv();
  var r = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), s = _r(
    /** @type {V} */
    ut
  ), o = !$e, a = /* @__PURE__ */ new Set();
  return c0(() => {
    var d, p;
    var l = (
      /** @type {Effect} */
      Xe
    ), h = YO();
    r = h.promise;
    try {
      Promise.resolve(n()).then(h.resolve, (g) => {
        g !== cl && h.reject(g);
      }).finally(Wa);
    } catch (g) {
      h.reject(g), Wa();
    }
    var c = (
      /** @type {Batch} */
      fe
    );
    if (o) {
      if ((l.f & Ss) !== 0)
        var f = JO();
      if (
        // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
        (d = i.b) != null && d.is_rendered()
      )
        (p = c.async_deriveds.get(l)) == null || p.reject(Es);
      else
        for (const g of a.values())
          g.reject(Es);
      a.add(h), c.async_deriveds.set(l, h);
    }
    const O = (g, m = void 0) => {
      f == null || f(), a.delete(h), m !== Es && (c.activate(), m ? (s.f |= Nn, fs(s, m)) : ((s.f & Nn) !== 0 && (s.f ^= Nn), fs(s, g)), c.deactivate());
    };
    h.promise.then(O, (g) => O(null, g || "unknown"));
  }), Wc(() => {
    for (const l of a)
      l.reject(Es);
  }), new Promise((l) => {
    function h(c) {
      function f() {
        c === r ? l(s) : h(r);
      }
      c.then(f, f);
    }
    h(r);
  });
}
// @__NO_SIDE_EFFECTS__
function ue(n) {
  const e = /* @__PURE__ */ ho(n);
  return Sd(e), e;
}
// @__NO_SIDE_EFFECTS__
function KO(n) {
  const e = /* @__PURE__ */ ho(n);
  return e.equals = IO, e;
}
function Nv(n) {
  var e = n.effects;
  if (e !== null) {
    n.effects = null;
    for (var t = 0; t < e.length; t += 1)
      Ht(
        /** @type {Effect} */
        e[t]
      );
  }
}
function Ac(n) {
  var e, t = Xe, i = n.parent;
  if (!Tn && i !== null && n.v !== ut && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
  (i.f & (fi | Vt)) !== 0)
    return Rv(), n.v;
  tn(i);
  try {
    n.f &= ~wr, Nv(n), e = wd(n);
  } finally {
    tn(t);
  }
  return e;
}
function ed(n) {
  var e = Ac(n);
  if (!n.equals(e) && (n.wv = kd(), (!(fe != null && fe.is_fork) || n.deps === null) && (fe !== null ? (fe.capture(n, e, !0), Ns == null || Ns.capture(n, e, !0)) : n.v = e, n.deps === null))) {
    ft(n, dt);
    return;
  }
  Tn || (Tt !== null ? (Mc() || fe != null && fe.is_fork) && Tt.set(n, e) : Cc(n));
}
function Bv(n) {
  var e, t;
  if (n.effects !== null)
    for (const i of n.effects)
      (i.teardown || i.ac) && ((e = i.teardown) == null || e.call(i), (t = i.ac) == null || t.abort(cl), i.fn !== null && (i.teardown = VO), i.ac = null, co(i, 0), jc(i));
}
function td(n) {
  if (n.effects !== null)
    for (const e of n.effects)
      e.teardown && e.fn !== null && us(e);
}
let Wl = null, Vr = null, fe = null, Ns = null, Tt = null, _h = null, Bs = !1, El = !1, Gr = null, va = null;
var Vf = 0;
let Fv = 1;
var ns, Ln, mr, rs, ss, os, bn, as, Nt, Ro, Sn, _i, Gi, ls, vr, De, Th, js, $h, id, nd, Lr, Hv, Vs;
const ol = class ol {
  constructor() {
    be(this, De);
    Mt(this, "id", Fv++);
    /** True as soon as `#process` was called */
    be(this, ns, !1);
    Mt(this, "linked", !0);
    /** @type {Batch | null} */
    be(this, Ln, null);
    /** @type {Batch | null} */
    be(this, mr, null);
    /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
    Mt(this, "async_deriveds", /* @__PURE__ */ new Map());
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    Mt(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    Mt(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    be(this, rs, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    be(this, ss, /* @__PURE__ */ new Set());
    /**
     * The number of async effects that are currently in flight
     */
    be(this, os, 0);
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    be(this, bn, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    be(this, as, null);
    /**
     * The root effects that need to be flushed
     * @type {Effect[]}
     */
    be(this, Nt, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    be(this, Ro, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    be(this, Sn, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    be(this, _i, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    be(this, Gi, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    be(this, ls, /* @__PURE__ */ new Set());
    Mt(this, "is_fork", !1);
    be(this, vr, !1);
    Vr === null ? Wl = Vr = this : (ve(Vr, mr, this), ve(this, Ln, Vr)), Vr = this;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(e) {
    X(this, Gi).has(e) || X(this, Gi).set(e, { d: [], m: [] }), X(this, ls).delete(e);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(e, t = (i) => this.schedule(i)) {
    var i = X(this, Gi).get(e);
    if (i) {
      X(this, Gi).delete(e);
      for (var r of i.d)
        ft(r, Rt), t(r);
      for (r of i.m)
        ft(r, en), t(r);
    }
    X(this, ls).add(e);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(e, t, i = !1) {
    e.v !== ut && !this.previous.has(e) && this.previous.set(e, e.v), (e.f & Nn) === 0 && (this.current.set(e, [t, i]), Tt == null || Tt.set(e, t)), this.is_fork || (e.v = t);
  }
  activate() {
    fe = this;
  }
  deactivate() {
    fe = null, Tt = null;
  }
  flush() {
    try {
      El = !0, fe = this, Ae(this, De, js).call(this);
    } finally {
      Vf = 0, _h = null, Gr = null, va = null, El = !1, fe = null, Tt = null, Sr.clear();
    }
  }
  discard() {
    var e;
    for (const t of X(this, ss)) t(this);
    X(this, ss).clear();
    for (const t of this.async_deriveds.values())
      t.reject(Es);
    Ae(this, De, Vs).call(this), (e = X(this, as)) == null || e.resolve();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(e) {
    X(this, Ro).push(e);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(e, t) {
    if (ve(this, os, X(this, os) + 1), e) {
      let i = X(this, bn).get(t) ?? 0;
      X(this, bn).set(t, i + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(e, t) {
    if (ve(this, os, X(this, os) - 1), e) {
      let i = X(this, bn).get(t) ?? 0;
      i === 1 ? X(this, bn).delete(t) : X(this, bn).set(t, i - 1);
    }
    X(this, vr) || (ve(this, vr, !0), wn(() => {
      ve(this, vr, !1), this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(e, t) {
    for (const i of e)
      X(this, Sn).add(i);
    for (const i of t)
      X(this, _i).add(i);
    e.clear(), t.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(e) {
    X(this, rs).add(e);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(e) {
    X(this, ss).add(e);
  }
  settled() {
    return (X(this, as) ?? ve(this, as, YO())).promise;
  }
  static ensure() {
    if (fe === null) {
      const e = fe = new ol();
      !El && !Bs && wn(() => {
        X(e, ns) || e.flush();
      });
    }
    return fe;
  }
  apply() {
    {
      Tt = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(e) {
    var r;
    if (_h = e, (r = e.b) != null && r.is_pending && (e.f & (hs | hl | LO)) !== 0 && (e.f & Ss) === 0) {
      e.b.defer_effect(e);
      return;
    }
    for (var t = e; t.parent !== null; ) {
      t = t.parent;
      var i = t.f;
      if (Gr !== null && t === Xe && ($e === null || ($e.f & Xt) === 0))
        return;
      if ((i & (Hn | Ci)) !== 0) {
        if ((i & dt) === 0)
          return;
        t.f ^= dt;
      }
    }
    X(this, Nt).push(t);
  }
};
ns = new WeakMap(), Ln = new WeakMap(), mr = new WeakMap(), rs = new WeakMap(), ss = new WeakMap(), os = new WeakMap(), bn = new WeakMap(), as = new WeakMap(), Nt = new WeakMap(), Ro = new WeakMap(), Sn = new WeakMap(), _i = new WeakMap(), Gi = new WeakMap(), ls = new WeakMap(), vr = new WeakMap(), De = new WeakSet(), Th = function() {
  if (this.is_fork) return !0;
  for (const i of X(this, bn).keys()) {
    for (var e = i, t = !1; e.parent !== null; ) {
      if (X(this, Gi).has(e)) {
        t = !0;
        break;
      }
      e = e.parent;
    }
    if (!t)
      return !0;
  }
  return !1;
}, js = function() {
  var l, h, c, f;
  ve(this, ns, !0), Vf++ > 1e3 && (Ae(this, De, Vs).call(this), Kv());
  for (const O of X(this, Sn))
    X(this, _i).delete(O), ft(O, Rt), this.schedule(O);
  for (const O of X(this, _i))
    ft(O, en), this.schedule(O);
  const e = X(this, Nt);
  ve(this, Nt, []), this.apply();
  var t = Gr = [], i = [], r = va = [];
  for (const O of e)
    try {
      Ae(this, De, $h).call(this, O, t, i);
    } catch (d) {
      throw od(O), Ae(this, De, Th).call(this) || this.discard(), d;
    }
  if (fe = null, r.length > 0) {
    var s = ol.ensure();
    for (const O of r)
      s.schedule(O);
  }
  if (Gr = null, va = null, Ae(this, De, Th).call(this)) {
    Ae(this, De, Lr).call(this, i), Ae(this, De, Lr).call(this, t);
    for (const [O, d] of X(this, Gi))
      sd(O, d);
    r.length > 0 && /** @type {unknown} */
    Ae(l = fe, De, js).call(l);
    return;
  }
  const o = Ae(this, De, id).call(this);
  if (o) {
    Ae(this, De, Lr).call(this, i), Ae(this, De, Lr).call(this, t), Ae(h = o, De, nd).call(h, this);
    return;
  }
  X(this, Sn).clear(), X(this, _i).clear();
  for (const O of X(this, rs)) O(this);
  X(this, rs).clear(), Ns = this, Yf(i), Yf(t), Ns = null, (c = X(this, as)) == null || c.resolve();
  var a = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    fe
  );
  if (X(this, os) === 0 && (X(this, Nt).length === 0 || a !== null) && Ae(this, De, Vs).call(this), X(this, Nt).length > 0)
    if (a !== null) {
      const O = a;
      X(O, Nt).push(...X(this, Nt).filter((d) => !X(O, Nt).includes(d)));
    } else
      a = this;
  a !== null && Ae(f = a, De, js).call(f);
}, /**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 * @param {Effect[]} effects
 * @param {Effect[]} render_effects
 */
$h = function(e, t, i) {
  e.f ^= dt;
  for (var r = e.first; r !== null; ) {
    var s = r.f, o = (s & (Ci | Hn)) !== 0, a = o && (s & dt) !== 0, l = a || (s & Vt) !== 0 || X(this, Gi).has(r);
    if (!l && r.fn !== null) {
      o ? r.f ^= dt : (s & hs) !== 0 ? t.push(r) : zo(r) && ((s & $i) !== 0 && X(this, _i).add(r), us(r));
      var h = r.first;
      if (h !== null) {
        r = h;
        continue;
      }
    }
    for (; r !== null; ) {
      var c = r.next;
      if (c !== null) {
        r = c;
        break;
      }
      r = r.parent;
    }
  }
}, id = function() {
  for (var e = X(this, Ln); e !== null; ) {
    if (!e.is_fork) {
      for (const [t, [, i]] of this.current)
        if (e.current.has(t) && !i)
          return e;
    }
    e = X(e, Ln);
  }
  return null;
}, /**
 * @param {Batch} batch
 */
nd = function(e) {
  var i;
  for (const [r, s] of e.current)
    !this.previous.has(r) && e.previous.has(r) && this.previous.set(r, e.previous.get(r)), this.current.set(r, s);
  for (const [r, s] of e.async_deriveds) {
    const o = this.async_deriveds.get(r);
    o && s.promise.then(o.resolve).catch(o.reject);
  }
  e.async_deriveds.clear(), this.transfer_effects(X(e, Sn), X(e, _i));
  const t = (r) => {
    var s = r.reactions;
    if (s !== null)
      for (const l of s) {
        var o = l.f;
        if ((o & Xt) !== 0)
          t(
            /** @type {Derived} */
            l
          );
        else {
          var a = (
            /** @type {Effect} */
            l
          );
          o & (Br | $i) && !this.async_deriveds.has(a) && (X(this, _i).delete(a), ft(a, Rt), this.schedule(a));
        }
      }
  };
  for (const r of this.current.keys())
    t(r);
  this.oncommit(() => e.discard()), Ae(i = e, De, Vs).call(i), fe = this, Ae(this, De, js).call(this);
}, /**
 * @param {Effect[]} effects
 */
Lr = function(e) {
  for (var t = 0; t < e.length; t += 1)
    HO(e[t], X(this, Sn), X(this, _i));
}, Hv = function() {
  var f;
  for (let O = Wl; O !== null; O = X(O, mr)) {
    var e = O.id < this.id, t = [];
    for (const [d, [p, g]] of this.current) {
      if (O.current.has(d)) {
        var i = (
          /** @type {[any, boolean]} */
          O.current.get(d)[0]
        );
        if (e && p !== i)
          O.current.set(d, [p, g]);
        else
          continue;
      }
      t.push(d);
    }
    if (e)
      for (const [d, p] of this.async_deriveds) {
        const g = O.async_deriveds.get(d);
        g && p.promise.then(g.resolve).catch(g.reject);
      }
    var r = [...O.current.keys()].filter(
      (d) => !/** @type {[any, boolean]} */
      O.current.get(d)[1]
    );
    if (!(!X(O, ns) || r.length === 0)) {
      var s = r.filter((d) => !this.current.has(d));
      if (s.length === 0)
        e && O.discard();
      else if (t.length > 0) {
        if (e)
          for (const d of X(this, ls))
            O.unskip_effect(d, (p) => {
              var g;
              (p.f & ($i | Br)) !== 0 ? O.schedule(p) : Ae(g = O, De, Lr).call(g, [p]);
            });
        O.activate();
        var o = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
        for (var l of t)
          rd(l, s, o, a);
        a = /* @__PURE__ */ new Map();
        var h = [...O.current].filter(([d, p]) => {
          const g = this.current.get(d);
          return g ? g[0] !== p[0] || g[1] !== p[1] : !0;
        }).map(([d]) => d);
        if (h.length > 0)
          for (const d of X(this, Ro))
            (d.f & (fi | Vt | za)) === 0 && qc(d, h, a) && ((d.f & (Br | $i)) !== 0 ? (ft(d, Rt), O.schedule(d)) : X(O, Sn).add(d));
        if (X(O, Nt).length > 0 && !X(O, vr)) {
          O.apply();
          for (var c of X(O, Nt))
            Ae(f = O, De, $h).call(f, c, [], []);
          ve(O, Nt, []);
        }
        O.deactivate();
      }
    }
  }
}, Vs = function() {
  if (this.linked) {
    var e = X(this, Ln), t = X(this, mr);
    e === null ? Wl = t : ve(e, mr, t), t === null ? Vr = e : ve(t, Ln, e), this.linked = !1;
  }
};
let Pr = ol;
function Jv(n) {
  var e = Bs;
  Bs = !0;
  try {
    for (var t; ; ) {
      if (qv(), fe === null)
        return (
          /** @type {T} */
          t
        );
      fe.flush();
    }
  } finally {
    Bs = e;
  }
}
function Kv() {
  try {
    dv();
  } catch (n) {
    Dn(n, _h);
  }
}
let Pi = null;
function Yf(n) {
  var e = n.length;
  if (e !== 0) {
    for (var t = 0; t < e; ) {
      var i = n[t++];
      if ((i.f & (fi | Vt)) === 0 && zo(i) && (Pi = /* @__PURE__ */ new Set(), us(i), i.deps === null && i.first === null && i.nodes === null && i.teardown === null && i.ac === null && vd(i), (Pi == null ? void 0 : Pi.size) > 0)) {
        Sr.clear();
        for (const r of Pi) {
          if ((r.f & (fi | Vt)) !== 0) continue;
          const s = [r];
          let o = r.parent;
          for (; o !== null; )
            Pi.has(o) && (Pi.delete(o), s.push(o)), o = o.parent;
          for (let a = s.length - 1; a >= 0; a--) {
            const l = s[a];
            (l.f & (fi | Vt)) === 0 && us(l);
          }
        }
        Pi.clear();
      }
    }
    Pi = null;
  }
}
function rd(n, e, t, i) {
  if (!t.has(n) && (t.add(n), n.reactions !== null))
    for (const r of n.reactions) {
      const s = r.f;
      (s & Xt) !== 0 ? rd(
        /** @type {Derived} */
        r,
        e,
        t,
        i
      ) : (s & (Br | $i)) !== 0 && (s & Rt) === 0 && qc(r, e, i) && (ft(r, Rt), zc(
        /** @type {Effect} */
        r
      ));
    }
}
function qc(n, e, t) {
  const i = t.get(n);
  if (i !== void 0) return i;
  if (n.deps !== null)
    for (const r of n.deps) {
      if (qa.call(e, r))
        return !0;
      if ((r.f & Xt) !== 0 && qc(
        /** @type {Derived} */
        r,
        e,
        t
      ))
        return t.set(
          /** @type {Derived} */
          r,
          !0
        ), !0;
    }
  return t.set(n, !1), !1;
}
function zc(n) {
  fe.schedule(n);
}
function sd(n, e) {
  if (!((n.f & Ci) !== 0 && (n.f & dt) !== 0)) {
    (n.f & Rt) !== 0 ? e.d.push(n) : (n.f & en) !== 0 && e.m.push(n), ft(n, dt);
    for (var t = n.first; t !== null; )
      sd(t, e), t = t.next;
  }
}
function od(n) {
  ft(n, dt);
  for (var e = n.first; e !== null; )
    od(e), e = e.next;
}
let Ea = /* @__PURE__ */ new Set();
const Sr = /* @__PURE__ */ new Map();
let ad = !1;
function _r(n, e) {
  var t = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: n,
    reactions: null,
    equals: GO,
    rv: 0,
    wv: 0
  };
  return t;
}
// @__NO_SIDE_EFFECTS__
function D(n, e) {
  const t = _r(n);
  return Sd(t), t;
}
// @__NO_SIDE_EFFECTS__
function e0(n, e = !1, t = !0) {
  const i = _r(n);
  return e || (i.equals = IO), i;
}
function x(n, e, t = !1) {
  $e !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Zi || ($e.f & za) !== 0) && UO() && ($e.f & (Xt | $i | Br | za)) !== 0 && (Ji === null || !Ji.has(n)) && vv();
  let i = t ? Je(e) : e;
  return fs(n, i, va);
}
function fs(n, e, t = null) {
  if (!n.equals(e)) {
    Sr.set(n, Tn ? e : n.v);
    var i = Pr.ensure();
    if (i.capture(n, e), (n.f & Xt) !== 0) {
      const r = (
        /** @type {Derived} */
        n
      );
      (n.f & Rt) !== 0 && Ac(r), Tt === null && Cc(r);
    }
    n.wv = kd(), ld(n, Rt, t), Xe !== null && (Xe.f & dt) !== 0 && (Xe.f & (Ci | Hn)) === 0 && (di === null ? O0([n]) : di.push(n)), !i.is_fork && Ea.size > 0 && !ad && t0();
  }
  return e;
}
function t0() {
  ad = !1;
  for (const n of Ea) {
    (n.f & dt) !== 0 && ft(n, en);
    let e;
    try {
      e = zo(n);
    } catch {
      e = !0;
    }
    e && us(n);
  }
  Ea.clear();
}
function Fs(n) {
  x(n, n.v + 1);
}
function ld(n, e, t) {
  var i = n.reactions;
  if (i !== null)
    for (var r = i.length, s = 0; s < r; s++) {
      var o = i[s], a = o.f, l = (a & Rt) === 0;
      if (l && ft(o, e), (a & za) !== 0)
        Ea.add(
          /** @type {Effect} */
          o
        );
      else if ((a & Xt) !== 0) {
        var h = (
          /** @type {Derived} */
          o
        );
        Tt == null || Tt.delete(h), (a & wr) === 0 && (a & yi && (Xe === null || (Xe.f & Ma) === 0) && (o.f |= wr), ld(h, en, t));
      } else if (l) {
        var c = (
          /** @type {Effect} */
          o
        );
        (a & $i) !== 0 && Pi !== null && Pi.add(c), t !== null ? t.push(c) : zc(c);
      }
    }
}
function Je(n) {
  if (typeof n != "object" || n === null || br in n)
    return n;
  const e = jO(n);
  if (e !== tv && e !== iv)
    return n;
  var t = /* @__PURE__ */ new Map(), i = Xc(n), r = /* @__PURE__ */ D(0), s = kr, o = (a) => {
    if (kr === s)
      return a();
    var l = $e, h = kr;
    ki(null), Uf(s);
    var c = a();
    return ki(l), Uf(h), c;
  };
  return i && t.set("length", /* @__PURE__ */ D(
    /** @type {any[]} */
    n.length
  )), new Proxy(
    /** @type {any} */
    n,
    {
      defineProperty(a, l, h) {
        (!("value" in h) || h.configurable === !1 || h.enumerable === !1 || h.writable === !1) && gv();
        var c = t.get(l);
        return c === void 0 ? o(() => {
          var f = /* @__PURE__ */ D(h.value);
          return t.set(l, f), f;
        }) : x(c, h.value, !0), !0;
      },
      deleteProperty(a, l) {
        var h = t.get(l);
        if (h === void 0) {
          if (l in a) {
            const c = o(() => /* @__PURE__ */ D(ut));
            t.set(l, c), Fs(r);
          }
        } else
          x(h, ut), Fs(r);
        return !0;
      },
      get(a, l, h) {
        var d;
        if (l === br)
          return n;
        var c = t.get(l), f = l in a;
        if (c === void 0 && (!f || (d = Nr(a, l)) != null && d.writable) && (c = o(() => {
          var p = Je(f ? a[l] : ut), g = /* @__PURE__ */ D(p);
          return g;
        }), t.set(l, c)), c !== void 0) {
          var O = u(c);
          return O === ut ? void 0 : O;
        }
        return Reflect.get(a, l, h);
      },
      getOwnPropertyDescriptor(a, l) {
        var h = Reflect.getOwnPropertyDescriptor(a, l);
        if (h && "value" in h) {
          var c = t.get(l);
          c && (h.value = u(c));
        } else if (h === void 0) {
          var f = t.get(l), O = f == null ? void 0 : f.v;
          if (f !== void 0 && O !== ut)
            return {
              enumerable: !0,
              configurable: !0,
              value: O,
              writable: !0
            };
        }
        return h;
      },
      has(a, l) {
        var O;
        if (l === br)
          return !0;
        var h = t.get(l), c = h !== void 0 && h.v !== ut || Reflect.has(a, l);
        if (h !== void 0 || Xe !== null && (!c || (O = Nr(a, l)) != null && O.writable)) {
          h === void 0 && (h = o(() => {
            var d = c ? Je(a[l]) : ut, p = /* @__PURE__ */ D(d);
            return p;
          }), t.set(l, h));
          var f = u(h);
          if (f === ut)
            return !1;
        }
        return c;
      },
      set(a, l, h, c) {
        var S;
        var f = t.get(l), O = l in a;
        if (i && l === "length")
          for (var d = h; d < /** @type {Source<number>} */
          f.v; d += 1) {
            var p = t.get(d + "");
            p !== void 0 ? x(p, ut) : d in a && (p = o(() => /* @__PURE__ */ D(ut)), t.set(d + "", p));
          }
        if (f === void 0)
          (!O || (S = Nr(a, l)) != null && S.writable) && (f = o(() => /* @__PURE__ */ D(void 0)), x(f, Je(h)), t.set(l, f));
        else {
          O = f.v !== ut;
          var g = o(() => Je(h));
          x(f, g);
        }
        var m = Reflect.getOwnPropertyDescriptor(a, l);
        if (m != null && m.set && m.set.call(c, h), !O) {
          if (i && typeof l == "string") {
            var v = (
              /** @type {Source<number>} */
              t.get("length")
            ), w = Number(l);
            Number.isInteger(w) && w >= v.v && x(v, w + 1);
          }
          Fs(r);
        }
        return !0;
      },
      ownKeys(a) {
        u(r);
        var l = Reflect.ownKeys(a).filter((f) => {
          var O = t.get(f);
          return O === void 0 || O.v !== ut;
        });
        for (var [h, c] of t)
          c.v !== ut && !(h in a) && l.push(h);
        return l;
      },
      setPrototypeOf() {
        mv();
      }
    }
  );
}
function Lf(n) {
  try {
    if (n !== null && typeof n == "object" && br in n)
      return n[br];
  } catch {
  }
  return n;
}
function i0(n, e) {
  return Object.is(Lf(n), Lf(e));
}
var Df, hd, cd, fd;
function n0() {
  if (Df === void 0) {
    Df = window, hd = /Firefox/.test(navigator.userAgent);
    var n = Element.prototype, e = Node.prototype, t = Text.prototype;
    cd = Nr(e, "firstChild").get, fd = Nr(e, "nextSibling").get, jf(n) && (n[yh] = void 0, n[da] = null, n[kh] = void 0, n.__e = void 0), jf(t) && (t[Ws] = void 0);
  }
}
function Bn(n = "") {
  return document.createTextNode(n);
}
// @__NO_SIDE_EFFECTS__
function ja(n) {
  return (
    /** @type {TemplateNode | null} */
    cd.call(n)
  );
}
// @__NO_SIDE_EFFECTS__
function Ao(n) {
  return (
    /** @type {TemplateNode | null} */
    fd.call(n)
  );
}
function k(n, e) {
  return /* @__PURE__ */ ja(n);
}
function Ze(n, e = !1) {
  {
    var t = /* @__PURE__ */ ja(n);
    return t instanceof Comment && t.data === "" ? /* @__PURE__ */ Ao(t) : t;
  }
}
function P(n, e = 1, t = !1) {
  let i = n;
  for (; e--; )
    i = /** @type {TemplateNode} */
    /* @__PURE__ */ Ao(i);
  return i;
}
function r0(n) {
  n.textContent = "";
}
function ud() {
  return !1;
}
function s0(n, e, t) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    t ? document.createElement(n, { is: t }) : document.createElement(n)
  );
}
function Od(n, e) {
  {
    const t = document.body;
    n.autofocus = !0, wn(() => {
      document.activeElement === t && n.focus();
    });
  }
}
let Gf = !1;
function o0() {
  Gf || (Gf = !0, document.addEventListener(
    "reset",
    (n) => {
      Promise.resolve().then(() => {
        var e;
        if (!n.defaultPrevented)
          for (
            const t of
            /**@type {HTMLFormElement} */
            n.target.elements
          )
            (e = t[pa]) == null || e.call(t);
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function fl(n) {
  var e = $e, t = Xe;
  ki(null), tn(null);
  try {
    return n();
  } finally {
    ki(e), tn(t);
  }
}
function dd(n, e, t, i = t) {
  n.addEventListener(e, () => fl(t));
  const r = (
    /** @type {any} */
    n[pa]
  );
  r ? n[pa] = () => {
    r(), i(!0);
  } : n[pa] = () => i(!0), o0();
}
function a0(n) {
  Xe === null && ($e === null && Ov(), uv()), Tn && fv();
}
function l0(n, e) {
  var t = e.last;
  t === null ? e.last = e.first = n : (t.next = n, n.prev = t, e.last = n);
}
function An(n, e) {
  var t = Xe;
  t !== null && (t.f & Vt) !== 0 && (n |= Vt);
  var i = {
    ctx: Yt,
    deps: null,
    nodes: null,
    f: n | Rt | yi,
    first: null,
    fn: e,
    last: null,
    next: null,
    parent: t,
    b: t && t.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  fe == null || fe.register_created_effect(i);
  var r = i;
  if ((n & hs) !== 0)
    Gr !== null ? Gr.push(i) : Pr.ensure().schedule(i);
  else if (e !== null) {
    try {
      us(i);
    } catch (o) {
      throw Ht(i), o;
    }
    r.deps === null && r.teardown === null && r.nodes === null && r.first === r.last && // either `null`, or a singular child
    (r.f & ys) === 0 && (r = r.first, (n & $i) !== 0 && (n & Jn) !== 0 && r !== null && (r.f |= Jn));
  }
  if (r !== null && (r.parent = t, t !== null && l0(r, t), $e !== null && ($e.f & Xt) !== 0 && (n & Hn) === 0)) {
    var s = (
      /** @type {Derived} */
      $e
    );
    (s.effects ?? (s.effects = [])).push(r);
  }
  return i;
}
function Mc() {
  return $e !== null && !Zi;
}
function Wc(n) {
  const e = An(hl, null);
  return ft(e, dt), e.teardown = n, e;
}
function Lt(n) {
  a0();
  var e = (
    /** @type {Effect} */
    Xe.f
  ), t = !$e && (e & Ci) !== 0 && Yt !== null && !Yt.i;
  if (t) {
    var i = (
      /** @type {ComponentContext} */
      Yt
    );
    (i.e ?? (i.e = [])).push(n);
  } else
    return pd(n);
}
function pd(n) {
  return An(hs | sv, n);
}
function h0(n) {
  Pr.ensure();
  const e = An(Hn | ys, n);
  return (t = {}) => new Promise((i) => {
    t.outro ? yr(e, () => {
      Ht(e), i(void 0);
    }) : (Ht(e), i(void 0));
  });
}
function gd(n) {
  return An(hs, n);
}
function c0(n) {
  return An(Br | ys, n);
}
function Ec(n, e = 0) {
  return An(hl | e, n);
}
function I(n, e = [], t = [], i = []) {
  Gv(i, e, t, (r) => {
    An(hl, () => {
      n(...r.map(u));
    });
  });
}
function qo(n, e = 0) {
  var t = An($i | e, n);
  return t;
}
function vi(n) {
  return An(Ci | ys, n);
}
function md(n) {
  var e = n.teardown;
  if (e !== null) {
    const t = Tn, i = $e;
    If(!0), ki(null);
    try {
      e.call(null);
    } finally {
      If(t), ki(i);
    }
  }
}
function jc(n, e = !1) {
  var t = n.first;
  for (n.first = n.last = null; t !== null; ) {
    const r = t.ac;
    r !== null && fl(() => {
      r.abort(cl);
    });
    var i = t.next;
    (t.f & Hn) !== 0 ? t.parent = null : Ht(t, e), t = i;
  }
}
function f0(n) {
  for (var e = n.first; e !== null; ) {
    var t = e.next;
    (e.f & Ci) === 0 && Ht(e), e = t;
  }
}
function Ht(n, e = !0) {
  var t = !1;
  (e || (n.f & rv) !== 0) && n.nodes !== null && n.nodes.end !== null && (u0(
    n.nodes.start,
    /** @type {TemplateNode} */
    n.nodes.end
  ), t = !0), n.f |= Sh, jc(n, e && !t), co(n, 0);
  var i = n.nodes && n.nodes.t;
  if (i !== null)
    for (const s of i)
      s.stop();
  md(n), n.f ^= Sh, n.f |= fi;
  var r = n.parent;
  r !== null && r.first !== null && vd(n), n.next = n.prev = n.teardown = n.ctx = n.deps = n.fn = n.nodes = n.ac = n.b = null;
}
function u0(n, e) {
  for (; n !== null; ) {
    var t = n === e ? null : /* @__PURE__ */ Ao(n);
    n.remove(), n = t;
  }
}
function vd(n) {
  var e = n.parent, t = n.prev, i = n.next;
  t !== null && (t.next = i), i !== null && (i.prev = t), e !== null && (e.first === n && (e.first = i), e.last === n && (e.last = t));
}
function yr(n, e, t = !0) {
  var i = [];
  Qd(n, i, !0);
  var r = () => {
    t && Ht(n), e && e();
  }, s = i.length;
  if (s > 0) {
    var o = () => --s || r();
    for (var a of i)
      a.out(o);
  } else
    r();
}
function Qd(n, e, t) {
  if ((n.f & Vt) === 0) {
    n.f ^= Vt;
    var i = n.nodes && n.nodes.t;
    if (i !== null)
      for (const a of i)
        (a.is_global || t) && e.push(a);
    for (var r = n.first; r !== null; ) {
      var s = r.next;
      if ((r.f & Hn) === 0) {
        var o = (r.f & Jn) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (r.f & Ci) !== 0 && (n.f & $i) !== 0;
        Qd(r, e, o ? t : !1);
      }
      r = s;
    }
  }
}
function Va(n) {
  bd(n, !0);
}
function bd(n, e) {
  if ((n.f & Vt) !== 0) {
    n.f ^= Vt, (n.f & dt) === 0 && (ft(n, Rt), Pr.ensure().schedule(n));
    for (var t = n.first; t !== null; ) {
      var i = t.next, r = (t.f & Jn) !== 0 || (t.f & Ci) !== 0;
      bd(t, r ? e : !1), t = i;
    }
    var s = n.nodes && n.nodes.t;
    if (s !== null)
      for (const o of s)
        (o.is_global || e) && o.in();
  }
}
function Vc(n, e) {
  if (n.nodes)
    for (var t = n.nodes.start, i = n.nodes.end; t !== null; ) {
      var r = t === i ? null : /* @__PURE__ */ Ao(t);
      e.append(t), t = r;
    }
}
let Qa = !1, Tn = !1;
function If(n) {
  Tn = n;
}
let $e = null, Zi = !1;
function ki(n) {
  $e = n;
}
let Xe = null;
function tn(n) {
  Xe = n;
}
let Ji = null;
function Sd(n) {
  $e !== null && (Ji ?? (Ji = /* @__PURE__ */ new Set())).add(n);
}
let Bt = null, si = 0, di = null;
function O0(n) {
  di = n;
}
let yd = 1, fr = 0, kr = fr;
function Uf(n) {
  kr = n;
}
function kd() {
  return ++yd;
}
function zo(n) {
  var e = n.f;
  if ((e & Rt) !== 0)
    return !0;
  if (e & Xt && (n.f &= ~wr), (e & en) !== 0) {
    for (var t = (
      /** @type {Value[]} */
      n.deps
    ), i = t.length, r = 0; r < i; r++) {
      var s = t[r];
      if (zo(
        /** @type {Derived} */
        s
      ) && ed(
        /** @type {Derived} */
        s
      ), s.wv > n.wv)
        return !0;
    }
    (e & yi) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Tt === null && ft(n, dt);
  }
  return !1;
}
function xd(n, e, t = !0) {
  var i = n.reactions;
  if (i !== null && !(Ji !== null && Ji.has(n)))
    for (var r = 0; r < i.length; r++) {
      var s = i[r];
      (s.f & Xt) !== 0 ? xd(
        /** @type {Derived} */
        s,
        e,
        !1
      ) : e === s && (t ? ft(s, Rt) : (s.f & dt) !== 0 && ft(s, en), zc(
        /** @type {Effect} */
        s
      ));
    }
}
function wd(n) {
  var g;
  var e = Bt, t = si, i = di, r = $e, s = Ji, o = Yt, a = Zi, l = kr, h = n.f;
  Bt = /** @type {null | Value[]} */
  null, si = 0, di = null, $e = (h & (Ci | Hn)) === 0 ? n : null, Ji = null, cs(n.ctx), Zi = !1, kr = ++fr, n.ac !== null && (fl(() => {
    n.ac.abort(cl);
  }), n.ac = null);
  try {
    n.f |= Ma;
    var c = (
      /** @type {Function} */
      n.fn
    ), f = c();
    n.f |= Ss;
    var O = n.deps, d = fe == null ? void 0 : fe.is_fork;
    if (Bt !== null) {
      var p;
      if (d || co(n, si), O !== null && si > 0)
        for (O.length = si + Bt.length, p = 0; p < Bt.length; p++)
          O[si + p] = Bt[p];
      else
        n.deps = O = Bt;
      if (Mc() && (n.f & yi) !== 0)
        for (p = si; p < O.length; p++)
          ((g = O[p]).reactions ?? (g.reactions = [])).push(n);
    } else !d && O !== null && si < O.length && (co(n, si), O.length = si);
    if (UO() && di !== null && !Zi && O !== null && (n.f & (Xt | en | Rt)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      di.length; p++)
        xd(
          di[p],
          /** @type {Effect} */
          n
        );
    if (r !== null && r !== n) {
      if (fr++, r.deps !== null)
        for (let m = 0; m < t; m += 1)
          r.deps[m].rv = fr;
      if (e !== null)
        for (const m of e)
          m.rv = fr;
      di !== null && (i === null ? i = di : i.push(.../** @type {Source[]} */
      di));
    }
    return (n.f & Nn) !== 0 && (n.f ^= Nn), f;
  } catch (m) {
    return BO(m);
  } finally {
    n.f ^= Ma, Bt = e, si = t, di = i, $e = r, Ji = s, cs(o), Zi = a, kr = l;
  }
}
function d0(n, e) {
  let t = e.reactions;
  if (t !== null) {
    var i = Jm.call(t, n);
    if (i !== -1) {
      var r = t.length - 1;
      r === 0 ? t = e.reactions = null : (t[i] = t[r], t.pop());
    }
  }
  if (t === null && (e.f & Xt) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (Bt === null || !qa.call(Bt, e))) {
    var s = (
      /** @type {Derived} */
      e
    );
    (s.f & yi) !== 0 && (s.f ^= yi, s.f &= ~wr), s.v !== ut && Cc(s), Bv(s), co(s, 0);
  }
}
function co(n, e) {
  var t = n.deps;
  if (t !== null)
    for (var i = e; i < t.length; i++)
      d0(n, t[i]);
}
function us(n) {
  var e = n.f;
  if ((e & fi) === 0) {
    ft(n, dt);
    var t = Xe, i = Qa;
    Xe = n, Qa = !0;
    try {
      (e & ($i | LO)) !== 0 ? f0(n) : jc(n), md(n);
      var r = wd(n);
      n.teardown = typeof r == "function" ? r : null, n.wv = yd;
      var s;
    } finally {
      Qa = i, Xe = t;
    }
  }
}
async function p0() {
  await Promise.resolve(), Jv();
}
function u(n) {
  var e = n.f, t = (e & Xt) !== 0;
  if ($e !== null && !Zi) {
    var i = Xe !== null && (Xe.f & fi) !== 0;
    if (!i && (Ji === null || !Ji.has(n))) {
      var r = $e.deps;
      if (($e.f & Ma) !== 0)
        n.rv < fr && (n.rv = fr, Bt === null && r !== null && r[si] === n ? si++ : Bt === null ? Bt = [n] : Bt.push(n));
      else {
        $e.deps ?? ($e.deps = []), qa.call($e.deps, n) || $e.deps.push(n);
        var s = n.reactions;
        s === null ? n.reactions = [$e] : qa.call(s, $e) || s.push($e);
      }
    }
  }
  if (Tn && Sr.has(n))
    return Sr.get(n);
  if (t) {
    var o = (
      /** @type {Derived} */
      n
    );
    if (Tn) {
      var a = o.v;
      return ((o.f & dt) === 0 && o.reactions !== null || _d(o)) && (a = Ac(o)), Sr.set(o, a), a;
    }
    var l = (o.f & yi) === 0 && !Zi && $e !== null && (Qa || ($e.f & yi) !== 0), h = (o.f & Ss) === 0;
    zo(o) && (l && (o.f |= yi), ed(o)), l && !h && (td(o), Pd(o));
  }
  if (Tt != null && Tt.has(n))
    return Tt.get(n);
  if ((n.f & Nn) !== 0)
    throw n.v;
  return n.v;
}
function Pd(n) {
  if (n.f |= yi, n.deps !== null)
    for (const e of n.deps)
      (e.reactions ?? (e.reactions = [])).push(n), (e.f & Xt) !== 0 && (e.f & yi) === 0 && (td(
        /** @type {Derived} */
        e
      ), Pd(
        /** @type {Derived} */
        e
      ));
}
function _d(n) {
  if (n.v === ut) return !0;
  if (n.deps === null) return !1;
  for (const e of n.deps)
    if (Sr.has(e) || (e.f & Xt) !== 0 && _d(
      /** @type {Derived} */
      e
    ))
      return !0;
  return !1;
}
function ks(n) {
  var e = Zi;
  try {
    return Zi = !0, n();
  } finally {
    Zi = e;
  }
}
const g0 = ["touchstart", "touchmove"];
function m0(n) {
  return g0.includes(n);
}
const ur = Symbol("events"), Td = /* @__PURE__ */ new Set(), Zh = /* @__PURE__ */ new Set();
function v0(n, e, t, i = {}) {
  function r(s) {
    if (i.capture || Rh.call(e, s), !s.cancelBubble)
      return fl(() => t == null ? void 0 : t.call(this, s));
  }
  return n.startsWith("pointer") || n.startsWith("touch") || n === "wheel" ? wn(() => {
    e.addEventListener(n, r, i);
  }) : e.addEventListener(n, r, i), r;
}
function fo(n, e, t, i, r) {
  var s = { capture: i, passive: r }, o = v0(n, e, t, s);
  (e === document.body || // @ts-ignore
  e === window || // @ts-ignore
  e === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  e instanceof HTMLMediaElement) && Wc(() => {
    e.removeEventListener(n, o, s);
  });
}
function K(n, e, t) {
  (e[ur] ?? (e[ur] = {}))[n] = t;
}
function zt(n) {
  for (var e = 0; e < n.length; e++)
    Td.add(n[e]);
  for (var t of Zh)
    t(n);
}
let Nf = null;
function Rh(n) {
  var g, m;
  var e = this, t = (
    /** @type {Node} */
    e.ownerDocument
  ), i = n.type, r = ((g = n.composedPath) == null ? void 0 : g.call(n)) || [], s = (
    /** @type {null | Element} */
    r[0] || n.target
  );
  Nf = n;
  var o = 0, a = Nf === n && n[ur];
  if (a) {
    var l = r.indexOf(a);
    if (l !== -1 && (e === document || e === /** @type {any} */
    window)) {
      n[ur] = e;
      return;
    }
    var h = r.indexOf(e);
    if (h === -1)
      return;
    l <= h && (o = l);
  }
  if (s = /** @type {Element} */
  r[o] || n.target, s !== e) {
    Km(n, "currentTarget", {
      configurable: !0,
      get() {
        return s || t;
      }
    });
    var c = $e, f = Xe;
    ki(null), tn(null);
    try {
      for (var O, d = []; s !== null && s !== e; ) {
        try {
          var p = (m = s[ur]) == null ? void 0 : m[i];
          p != null && (!/** @type {any} */
          s.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          n.target === s) && p.call(s, n);
        } catch (v) {
          O ? d.push(v) : O = v;
        }
        if (n.cancelBubble) break;
        o++, s = o < r.length ? (
          /** @type {Element} */
          r[o]
        ) : null;
      }
      if (O) {
        for (let v of d)
          queueMicrotask(() => {
            throw v;
          });
        throw O;
      }
    } finally {
      n[ur] = e, delete n.currentTarget, ki(c), tn(f);
    }
  }
}
var WO;
const jl = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  ((WO = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : WO.trustedTypes) && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (n) => n
  })
);
function Q0(n) {
  return (
    /** @type {string} */
    (jl == null ? void 0 : jl.createHTML(n)) ?? n
  );
}
function b0(n) {
  var e = s0("template");
  return e.innerHTML = Q0(n.replaceAll("<!>", "<!---->")), e.content;
}
function Xh(n, e) {
  var t = (
    /** @type {Effect} */
    Xe
  );
  t.nodes === null && (t.nodes = { start: n, end: e, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function R(n, e) {
  var t = (e & Tv) !== 0, i = (e & $v) !== 0, r, s = !n.startsWith("<!>");
  return () => {
    r === void 0 && (r = b0(s ? n : "<!>" + n), t || (r = /** @type {TemplateNode} */
    /* @__PURE__ */ ja(r)));
    var o = (
      /** @type {TemplateNode} */
      i || hd ? document.importNode(r, !0) : r.cloneNode(!0)
    );
    if (t) {
      var a = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ ja(o)
      ), l = (
        /** @type {TemplateNode} */
        o.lastChild
      );
      Xh(a, l);
    } else
      Xh(o, o);
    return o;
  };
}
function nn() {
  var n = document.createDocumentFragment(), e = document.createComment(""), t = Bn();
  return n.append(e, t), Xh(e, t), n;
}
function T(n, e) {
  n !== null && n.before(
    /** @type {Node} */
    e
  );
}
function G(n, e) {
  var t = e == null ? "" : typeof e == "object" ? `${e}` : e;
  t !== /** @type {any} */
  (n[Ws] ?? (n[Ws] = n.nodeValue)) && (n[Ws] = t, n.nodeValue = `${t}`);
}
function S0(n, e) {
  return y0(n, e);
}
const No = /* @__PURE__ */ new Map();
function y0(n, { target: e, anchor: t, props: i = {}, events: r, context: s, intro: o = !0, transformError: a }) {
  n0();
  var l = void 0, h = h0(() => {
    var c = t ?? e.appendChild(Bn());
    jv(
      /** @type {TemplateNode} */
      c,
      {
        pending: () => {
        }
      },
      (d) => {
        kt({});
        var p = (
          /** @type {ComponentContext} */
          Yt
        );
        s && (p.c = s), r && (i.$$events = r), l = n(d, i) || {}, xt();
      },
      a
    );
    var f = /* @__PURE__ */ new Set(), O = (d) => {
      for (var p = 0; p < d.length; p++) {
        var g = d[p];
        if (!f.has(g)) {
          f.add(g);
          var m = m0(g);
          for (const S of [e, document]) {
            var v = No.get(S);
            v === void 0 && (v = /* @__PURE__ */ new Map(), No.set(S, v));
            var w = v.get(g);
            w === void 0 ? (S.addEventListener(g, Rh, { passive: m }), v.set(g, 1)) : v.set(g, w + 1);
          }
        }
      }
    };
    return O(ll(Td)), Zh.add(O), () => {
      var m;
      for (var d of f)
        for (const v of [e, document]) {
          var p = (
            /** @type {Map<string, number>} */
            No.get(v)
          ), g = (
            /** @type {number} */
            p.get(d)
          );
          --g == 0 ? (v.removeEventListener(d, Rh), p.delete(d), p.size === 0 && No.delete(v)) : p.set(d, g);
        }
      Zh.delete(O), c !== t && ((m = c.parentNode) == null || m.removeChild(c));
    };
  });
  return Ch.set(l, h), l;
}
let Ch = /* @__PURE__ */ new WeakMap();
function k0(n, e) {
  const t = Ch.get(n);
  return t ? (Ch.delete(n), t(e)) : Promise.resolve();
}
var Ti, Ii, ai, Qr, Xo, Co, al;
class Yc {
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(e, t = !0) {
    /** @type {TemplateNode} */
    Mt(this, "anchor");
    /** @type {Map<Batch, Key>} */
    be(this, Ti, /* @__PURE__ */ new Map());
    /**
     * Map of keys to effects that are currently rendered in the DOM.
     * These effects are visible and actively part of the document tree.
     * Example:
     * ```
     * {#if condition}
     * 	foo
     * {:else}
     * 	bar
     * {/if}
     * ```
     * Can result in the entries `true->Effect` and `false->Effect`
     * @type {Map<Key, Effect>}
     */
    be(this, Ii, /* @__PURE__ */ new Map());
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    be(this, ai, /* @__PURE__ */ new Map());
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    be(this, Qr, /* @__PURE__ */ new Set());
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    be(this, Xo, !0);
    /**
     * @param {Batch} batch
     */
    be(this, Co, (e) => {
      if (X(this, Ti).has(e)) {
        var t = (
          /** @type {Key} */
          X(this, Ti).get(e)
        ), i = X(this, Ii).get(t);
        if (i)
          Va(i), X(this, Qr).delete(t);
        else {
          var r = X(this, ai).get(t);
          r && (Va(r.effect), X(this, Ii).set(t, r.effect), X(this, ai).delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), i = r.effect);
        }
        for (const [s, o] of X(this, Ti)) {
          if (X(this, Ti).delete(s), s === e)
            break;
          const a = X(this, ai).get(o);
          a && (Ht(a.effect), X(this, ai).delete(o));
        }
        for (const [s, o] of X(this, Ii)) {
          if (s === t || X(this, Qr).has(s)) continue;
          const a = () => {
            if (Array.from(X(this, Ti).values()).includes(s)) {
              var h = document.createDocumentFragment();
              Vc(o, h), h.append(Bn()), X(this, ai).set(s, { effect: o, fragment: h });
            } else
              Ht(o);
            X(this, Qr).delete(s), X(this, Ii).delete(s);
          };
          X(this, Xo) || !i ? (X(this, Qr).add(s), yr(o, a, !1)) : a();
        }
      }
    });
    /**
     * @param {Batch} batch
     */
    be(this, al, (e) => {
      X(this, Ti).delete(e);
      const t = Array.from(X(this, Ti).values());
      for (const [i, r] of X(this, ai))
        t.includes(i) || (Ht(r.effect), X(this, ai).delete(i));
    });
    this.anchor = e, ve(this, Xo, t);
  }
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(e, t) {
    var i = (
      /** @type {Batch} */
      fe
    ), r = ud();
    if (t && !X(this, Ii).has(e) && !X(this, ai).has(e))
      if (r) {
        var s = document.createDocumentFragment(), o = Bn();
        s.append(o), X(this, ai).set(e, {
          effect: vi(() => t(o)),
          fragment: s
        });
      } else
        X(this, Ii).set(
          e,
          vi(() => t(this.anchor))
        );
    if (X(this, Ti).set(i, e), r) {
      for (const [a, l] of X(this, Ii))
        a === e ? i.unskip_effect(l) : i.skip_effect(l);
      for (const [a, l] of X(this, ai))
        a === e ? i.unskip_effect(l.effect) : i.skip_effect(l.effect);
      i.oncommit(X(this, Co)), i.ondiscard(X(this, al));
    } else
      X(this, Co).call(this, i);
  }
}
Ti = new WeakMap(), Ii = new WeakMap(), ai = new WeakMap(), Qr = new WeakMap(), Xo = new WeakMap(), Co = new WeakMap(), al = new WeakMap();
function L(n, e, t = !1) {
  var i = new Yc(n), r = t ? Jn : 0;
  function s(o, a) {
    i.ensure(o, a);
  }
  qo(() => {
    var o = !1;
    e((a, l = 0) => {
      o = !0, s(l, a);
    }), o || s(-1, null);
  }, r);
}
function Kn(n, e) {
  return e;
}
function x0(n, e, t) {
  for (var i = [], r = e.length, s, o = e.length, a = 0; a < r; a++) {
    let f = e[a];
    yr(
      f,
      () => {
        if (s) {
          if (s.pending.delete(f), s.done.add(f), s.pending.size === 0) {
            var O = (
              /** @type {Set<EachOutroGroup>} */
              n.outrogroups
            );
            Ah(n, ll(s.done)), O.delete(s), O.size === 0 && (n.outrogroups = null);
          }
        } else
          o -= 1;
      },
      !1
    );
  }
  if (o === 0) {
    var l = i.length === 0 && t !== null;
    if (l) {
      var h = (
        /** @type {Element} */
        t
      ), c = (
        /** @type {Element} */
        h.parentNode
      );
      r0(c), c.append(h), n.items.clear();
    }
    Ah(n, e, !l);
  } else
    s = {
      pending: new Set(e),
      done: /* @__PURE__ */ new Set()
    }, (n.outrogroups ?? (n.outrogroups = /* @__PURE__ */ new Set())).add(s);
}
function Ah(n, e, t = !0) {
  var i;
  if (n.pending.size > 0) {
    i = /* @__PURE__ */ new Set();
    for (const o of n.pending.values())
      for (const a of o)
        i.add(
          /** @type {EachItem} */
          n.items.get(a).e
        );
  }
  for (var r = 0; r < e.length; r++) {
    var s = e[r];
    if (i != null && i.has(s)) {
      s.f |= Bi;
      const o = document.createDocumentFragment();
      Vc(s, o);
    } else
      Ht(e[r], t);
  }
}
var Bf;
function Ke(n, e, t, i, r, s = null) {
  var o = n, a = /* @__PURE__ */ new Map(), l = (e & DO) !== 0;
  if (l) {
    var h = (
      /** @type {Element} */
      n
    );
    o = h.appendChild(Bn());
  }
  var c = null, f = /* @__PURE__ */ KO(() => {
    var S = t();
    return (
      /** @type {V[]} */
      Xc(S) ? S : S == null ? [] : ll(S)
    );
  }), O, d = /* @__PURE__ */ new Map(), p = !0;
  function g(S) {
    (w.effect.f & fi) === 0 && (w.pending.delete(S), w.fallback = c, w0(w, O, o, e, i), c !== null && (O.length === 0 ? (c.f & Bi) === 0 ? Va(c) : (c.f ^= Bi, Ys(c, null, o)) : yr(c, () => {
      c = null;
    })));
  }
  function m(S) {
    w.pending.delete(S);
  }
  var v = qo(() => {
    O = /** @type {V[]} */
    u(f);
    for (var S = O.length, Q = /* @__PURE__ */ new Set(), b = (
      /** @type {Batch} */
      fe
    ), y = ud(), $ = 0; $ < S; $ += 1) {
      var M = O[$], j = i(M, $), z = p ? null : a.get(j);
      z ? (z.v && fs(z.v, M), z.i && fs(z.i, $), y && b.unskip_effect(z.e)) : (z = P0(
        a,
        p ? o : Bf ?? (Bf = Bn()),
        M,
        j,
        $,
        r,
        e,
        t
      ), p || (z.e.f |= Bi), a.set(j, z)), Q.add(j);
    }
    if (S === 0 && s && !c && (p ? c = vi(() => s(o)) : (c = vi(() => s(Bf ?? (Bf = Bn()))), c.f |= Bi)), S > Q.size && cv(), !p)
      if (d.set(b, Q), y) {
        for (const [C, Z] of a)
          Q.has(C) || b.skip_effect(Z.e);
        b.oncommit(g), b.ondiscard(m);
      } else
        g(b);
    u(f);
  }), w = { effect: v, items: a, pending: d, outrogroups: null, fallback: c };
  p = !1;
}
function Xs(n) {
  for (; n !== null && (n.f & Ci) === 0; )
    n = n.next;
  return n;
}
function w0(n, e, t, i, r) {
  var z, C, Z, A, V, U, B, H, oe;
  var s = (i & yv) !== 0, o = e.length, a = n.items, l = Xs(n.effect.first), h, c = null, f, O = [], d = [], p, g, m, v;
  if (s)
    for (v = 0; v < o; v += 1)
      p = e[v], g = r(p, v), m = /** @type {EachItem} */
      a.get(g).e, (m.f & Bi) === 0 && ((C = (z = m.nodes) == null ? void 0 : z.a) == null || C.measure(), (f ?? (f = /* @__PURE__ */ new Set())).add(m));
  for (v = 0; v < o; v += 1) {
    if (p = e[v], g = r(p, v), m = /** @type {EachItem} */
    a.get(g).e, n.outrogroups !== null)
      for (const q of n.outrogroups)
        q.pending.delete(m), q.done.delete(m);
    if ((m.f & Vt) !== 0 && (Va(m), s && ((A = (Z = m.nodes) == null ? void 0 : Z.a) == null || A.unfix(), (f ?? (f = /* @__PURE__ */ new Set())).delete(m))), (m.f & Bi) !== 0)
      if (m.f ^= Bi, m === l)
        Ys(m, null, t);
      else {
        var w = c ? c.next : l;
        m === n.effect.last && (n.effect.last = m.prev), m.prev && (m.prev.next = m.next), m.next && (m.next.prev = m.prev), Wn(n, c, m), Wn(n, m, w), Ys(m, w, t), c = m, O = [], d = [], l = Xs(c.next);
        continue;
      }
    if (m !== l) {
      if (h !== void 0 && h.has(m)) {
        if (O.length < d.length) {
          var S = d[0], Q;
          c = S.prev;
          var b = O[0], y = O[O.length - 1];
          for (Q = 0; Q < O.length; Q += 1)
            Ys(O[Q], S, t);
          for (Q = 0; Q < d.length; Q += 1)
            h.delete(d[Q]);
          Wn(n, b.prev, y.next), Wn(n, c, b), Wn(n, y, S), l = S, c = y, v -= 1, O = [], d = [];
        } else
          h.delete(m), Ys(m, l, t), Wn(n, m.prev, m.next), Wn(n, m, c === null ? n.effect.first : c.next), Wn(n, c, m), c = m;
        continue;
      }
      for (O = [], d = []; l !== null && l !== m; )
        (h ?? (h = /* @__PURE__ */ new Set())).add(l), d.push(l), l = Xs(l.next);
      if (l === null)
        continue;
    }
    (m.f & Bi) === 0 && O.push(m), c = m, l = Xs(m.next);
  }
  if (n.outrogroups !== null) {
    for (const q of n.outrogroups)
      q.pending.size === 0 && (Ah(n, ll(q.done)), (V = n.outrogroups) == null || V.delete(q));
    n.outrogroups.size === 0 && (n.outrogroups = null);
  }
  if (l !== null || h !== void 0) {
    var $ = [];
    if (h !== void 0)
      for (m of h)
        (m.f & Vt) === 0 && $.push(m);
    for (; l !== null; )
      (l.f & Vt) === 0 && l !== n.fallback && $.push(l), l = Xs(l.next);
    var M = $.length;
    if (M > 0) {
      var j = (i & DO) !== 0 && o === 0 ? t : null;
      if (s) {
        for (v = 0; v < M; v += 1)
          (B = (U = $[v].nodes) == null ? void 0 : U.a) == null || B.measure();
        for (v = 0; v < M; v += 1)
          (oe = (H = $[v].nodes) == null ? void 0 : H.a) == null || oe.fix();
      }
      x0(n, $, j);
    }
  }
  s && wn(() => {
    var q, E;
    if (f !== void 0)
      for (m of f)
        (E = (q = m.nodes) == null ? void 0 : q.a) == null || E.apply();
  });
}
function P0(n, e, t, i, r, s, o, a) {
  var l = (o & bv) !== 0 ? (o & kv) === 0 ? /* @__PURE__ */ e0(t, !1, !1) : _r(t) : null, h = (o & Sv) !== 0 ? _r(r) : null;
  return {
    v: l,
    i: h,
    e: vi(() => (s(e, l ?? t, h ?? r, a), () => {
      n.delete(i);
    }))
  };
}
function Ys(n, e, t) {
  if (n.nodes)
    for (var i = n.nodes.start, r = n.nodes.end, s = e && (e.f & Bi) === 0 ? (
      /** @type {EffectNodes} */
      e.nodes.start
    ) : t; i !== null; ) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Ao(i)
      );
      if (s.before(i), i === r)
        return;
      i = o;
    }
}
function Wn(n, e, t) {
  e === null ? n.effect.first = t : e.next = t, t === null ? n.effect.last = e : t.prev = e;
}
function _0(n, e, ...t) {
  var i = new Yc(n);
  qo(() => {
    const r = e() ?? null;
    i.ensure(r, r && ((s) => r(s, ...t)));
  }, Jn);
}
function $d(n, e, t) {
  var i = new Yc(n);
  qo(() => {
    var r = e() ?? null;
    i.ensure(r, r && ((s) => t(s, r)));
  }, Jn);
}
function Zd(n) {
  var e, t, i = "";
  if (typeof n == "string" || typeof n == "number") i += n;
  else if (typeof n == "object") if (Array.isArray(n)) {
    var r = n.length;
    for (e = 0; e < r; e++) n[e] && (t = Zd(n[e])) && (i && (i += " "), i += t);
  } else for (t in n) n[t] && (i && (i += " "), i += t);
  return i;
}
function T0() {
  for (var n, e, t = 0, i = "", r = arguments.length; t < r; t++) (n = arguments[t]) && (e = Zd(n)) && (i && (i += " "), i += e);
  return i;
}
function $0(n) {
  return typeof n == "object" ? T0(n) : n ?? "";
}
const Ff = [...` 	
\r\f \v\uFEFF`];
function Z0(n, e, t) {
  var i = n == null ? "" : "" + n;
  if (e && (i = i ? i + " " + e : e), t) {
    for (var r of Object.keys(t))
      if (t[r])
        i = i ? i + " " + r : r;
      else if (i.length)
        for (var s = r.length, o = 0; (o = i.indexOf(r, o)) >= 0; ) {
          var a = o + s;
          (o === 0 || Ff.includes(i[o - 1])) && (a === i.length || Ff.includes(i[a])) ? i = (o === 0 ? "" : i.substring(0, o)) + i.substring(a + 1) : o = a;
        }
  }
  return i === "" ? null : i;
}
function R0(n, e) {
  return n == null ? null : String(n);
}
function Ee(n, e, t, i, r, s) {
  var o = (
    /** @type {any} */
    n[yh]
  );
  if (o !== t || o === void 0) {
    var a = Z0(t, i, s);
    a == null ? n.removeAttribute("class") : n.className = a, n[yh] = t;
  } else if (s && r !== s)
    for (var l in s) {
      var h = !!s[l];
      (r == null || h !== !!r[l]) && n.classList.toggle(l, h);
    }
  return s;
}
function Fr(n, e, t, i) {
  var r = (
    /** @type {any} */
    n[kh]
  );
  if (r !== e) {
    var s = R0(e);
    s == null ? n.removeAttribute("style") : n.style.cssText = s, n[kh] = e;
  }
  return i;
}
function Rd(n, e, t = !1) {
  if (n.multiple) {
    if (e == null)
      return;
    if (!Xc(e))
      return Xv();
    for (var i of n.options)
      i.selected = e.includes(Hs(i));
    return;
  }
  for (i of n.options) {
    var r = Hs(i);
    if (i0(r, e)) {
      i.selected = !0;
      return;
    }
  }
  (!t || e !== void 0) && (n.selectedIndex = -1);
}
function X0(n) {
  var e = new MutationObserver(() => {
    Rd(n, n.__value);
  });
  e.observe(n, {
    // Listen to option element changes
    childList: !0,
    subtree: !0,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: !0,
    attributeFilter: ["value"]
  }), Wc(() => {
    e.disconnect();
  });
}
function Hf(n, e, t = e) {
  var i = /* @__PURE__ */ new WeakSet(), r = !0;
  dd(n, "change", (s) => {
    var o = s ? "[selected]" : ":checked", a;
    if (n.multiple)
      a = [].map.call(n.querySelectorAll(o), Hs);
    else {
      var l = n.querySelector(o) ?? // will fall back to first non-disabled option if no option is selected
      n.querySelector("option:not([disabled])");
      a = l && Hs(l);
    }
    t(a), n.__value = a, fe !== null && i.add(fe);
  }), gd(() => {
    var s = e();
    if (n === document.activeElement) {
      var o = (
        /** @type {Batch} */
        fe
      );
      if (i.has(o))
        return;
    }
    if (Rd(n, s, r), r && s === void 0) {
      var a = n.querySelector(":checked");
      a !== null && (s = Hs(a), t(s));
    }
    n.__value = s, r = !1;
  }), X0(n);
}
function Hs(n) {
  return "__value" in n ? n.__value : n.value;
}
const C0 = Symbol("is custom element"), A0 = Symbol("is html"), q0 = lv ? "progress" : "PROGRESS";
function ba(n, e) {
  var t = Xd(n);
  t.value === (t.value = // treat null and undefined the same for the initial value
  e ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when it's `0`
  n.value === e && (e !== 0 || n.nodeName !== q0) || (n.value = e ?? "");
}
function Tr(n, e, t, i) {
  var r = Xd(n);
  r[e] !== (r[e] = t) && (e === "loading" && (n[av] = t), t == null ? n.removeAttribute(e) : typeof t != "string" && z0(n).includes(e) ? n[e] = t : n.setAttribute(e, t));
}
function Xd(n) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    /** @type {any} */
    n[da] ?? (n[da] = {
      [C0]: n.nodeName.includes("-"),
      [A0]: n.namespaceURI === Zv
    })
  );
}
var Jf = /* @__PURE__ */ new Map();
function z0(n) {
  var e = n.getAttribute("is") || n.nodeName, t = Jf.get(e);
  if (t) return t;
  Jf.set(e, t = []);
  for (var i, r = n, s = Element.prototype; s !== r; ) {
    i = ev(r);
    for (var o in i)
      i[o].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
      o !== "innerHTML" && o !== "textContent" && o !== "innerText" && t.push(o);
    r = jO(r);
  }
  return t;
}
function xn(n, e, t = e) {
  var i = /* @__PURE__ */ new WeakSet();
  dd(n, "input", async (r) => {
    var s = r ? n.defaultValue : n.value;
    if (s = Vl(n) ? Yl(s) : s, t(s), fe !== null && i.add(fe), await p0(), s !== (s = e())) {
      var o = n.selectionStart, a = n.selectionEnd, l = n.value.length;
      if (n.value = s ?? "", a !== null) {
        var h = n.value.length;
        o === a && a === l && h > l ? (n.selectionStart = h, n.selectionEnd = h) : (n.selectionStart = o, n.selectionEnd = Math.min(a, h));
      }
    }
  }), // If we are hydrating and the value has since changed,
  // then use the updated value from the input instead.
  // If defaultValue is set, then value == defaultValue
  // TODO Svelte 6: remove input.value check and set to empty string?
  ks(e) == null && n.value && (t(Vl(n) ? Yl(n.value) : n.value), fe !== null && i.add(fe)), Ec(() => {
    var r = e();
    if (n === document.activeElement) {
      var s = (
        /** @type {Batch} */
        fe
      );
      if (i.has(s))
        return;
    }
    Vl(n) && r === Yl(n.value) || n.type === "date" && !r && !n.value || r !== n.value && (n.value = r ?? "");
  });
}
function Vl(n) {
  var e = n.type;
  return e === "number" || e === "range";
}
function Yl(n) {
  return n === "" ? null : +n;
}
function Ll(n, e) {
  return n === e || (n == null ? void 0 : n[br]) === e;
}
function Cd(n = {}, e, t, i) {
  var r = (
    /** @type {ComponentContext} */
    Yt.r
  ), s = (
    /** @type {Effect} */
    Xe
  );
  return gd(() => {
    var o, a;
    return Ec(() => {
      o = a, a = [], ks(() => {
        Ll(t(...a), n) || (e(n, ...a), o && Ll(t(...o), n) && e(null, ...o));
      });
    }), () => {
      let l = s;
      for (; l !== r && l.parent !== null && l.parent.f & Sh; )
        l = l.parent;
      const h = () => {
        a && Ll(t(...a), n) && e(null, ...a);
      }, c = l.teardown;
      l.teardown = () => {
        h(), c == null || c();
      };
    };
  }), n;
}
function Le(n, e, t, i) {
  var Q;
  var r = !0, s = (t & Pv) !== 0, o = (t & _v) !== 0, a = (
    /** @type {V} */
    i
  ), l = !0, h = (
    /** @type {Derived<V> | undefined} */
    void 0
  ), c = () => o && r ? (h ?? (h = /* @__PURE__ */ ho(
    /** @type {() => V} */
    i
  )), u(h)) : (l && (l = !1, a = o ? ks(
    /** @type {() => V} */
    i
  ) : (
    /** @type {V} */
    i
  )), a);
  let f;
  if (s) {
    var O = br in n || ov in n;
    f = ((Q = Nr(n, e)) == null ? void 0 : Q.set) ?? (O && e in n ? (b) => n[e] = b : void 0);
  }
  var d, p = !1;
  s ? [d, p] = Mv(() => (
    /** @type {V} */
    n[e]
  )) : d = /** @type {V} */
  n[e], d === void 0 && i !== void 0 && (d = c(), f && (pv(), f(d)));
  var g;
  if (g = () => {
    var b = (
      /** @type {V} */
      n[e]
    );
    return b === void 0 ? c() : (l = !0, b);
  }, (t & wv) === 0)
    return g;
  if (f) {
    var m = n.$$legacy;
    return (
      /** @type {() => V} */
      (function(b, y) {
        return arguments.length > 0 ? ((!y || m || p) && f(y ? g() : b), b) : g();
      })
    );
  }
  var v = !1, w = ((t & xv) !== 0 ? ho : KO)(() => (v = !1, g()));
  s && u(w);
  var S = (
    /** @type {Effect} */
    Xe
  );
  return (
    /** @type {() => V} */
    (function(b, y) {
      if (arguments.length > 0) {
        const $ = y ? u(w) : s ? Je(b) : b;
        return x(w, $), v = !0, a !== void 0 && (a = $), b;
      }
      return Tn && v || (S.f & fi) !== 0 ? w.v : u(w);
    })
  );
}
const M0 = "5";
var EO;
typeof window < "u" && ((EO = window.__svelte ?? (window.__svelte = {})).v ?? (EO.v = /* @__PURE__ */ new Set())).add(M0);
function Gn(n, e) {
  const t = [];
  let i = 0, r = null, s = "";
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    if (r) {
      s += a, a === r && n[o - 1] !== "\\" && (r = null);
      continue;
    }
    if (a === "'" || a === '"') {
      r = a, s += a;
      continue;
    }
    if ((a === "[" || a === "(" || a === "{") && i++, (a === "]" || a === ")" || a === "}") && i--, i === 0 && a === e && e.length === 1) {
      t.push(s), s = "";
      continue;
    }
    s += a;
  }
  return t.push(s), t;
}
function Ad(n) {
  const e = n.trim();
  if (e === "None") return null;
  if (e === "True") return !0;
  if (e === "False") return !1;
  if (/^-?\d+$/.test(e)) return parseInt(e, 10);
  if (/^-?\d*\.\d+(e-?\d+)?$/i.test(e) || /^-?\d+e-?\d+$/i.test(e)) return parseFloat(e);
  const t = e.match(/^(['"])(.*)\1$/s);
  return t ? t[2] : e;
}
function Js(n) {
  let e = (n ?? "").trim();
  if (!e) return { kind: "unknown" };
  const t = e.match(/^<class '([^']+)'>$/);
  if (t && (e = t[1]), e = e.replace(/^typing\./, ""), Gn(e, "|").length > 1) {
    const r = Gn(e, "|").map((l) => l.trim()), s = r.filter((l) => l !== "None" && l !== "NoneType"), o = s.length !== r.length, a = s.length === 1 ? Js(s[0]) : { kind: "unknown", annotation: n };
    return o ? { kind: "optional", inner: a } : a;
  }
  const i = e.match(/^(\w+)\[(.*)\]$/s);
  if (i) {
    const r = i[1], s = i[2];
    switch (r) {
      case "Optional":
        return { kind: "optional", inner: Js(s) };
      case "Literal": {
        const o = Gn(s, ",").map((a) => Ad(a)).filter((a) => typeof a == "string" || typeof a == "number");
        return o.length ? { kind: "enum", options: o } : { kind: "unknown", annotation: n };
      }
      case "list":
      case "List":
      case "Sequence":
      case "tuple":
      case "Tuple":
        return { kind: "list", item: Js(Gn(s, ",")[0]) };
      case "dict":
      case "Dict":
      case "Mapping":
        return { kind: "object", open: !0 };
      default:
        return { kind: "unknown", annotation: n };
    }
  }
  switch (e) {
    case "str":
      return { kind: "str" };
    case "int":
      return { kind: "int" };
    case "float":
      return { kind: "float" };
    case "bool":
      return { kind: "bool" };
    case "dict":
      return { kind: "object", open: !0 };
    case "list":
    case "tuple":
      return { kind: "list", item: { kind: "unknown" } };
    default:
      return { kind: "unknown", annotation: n };
  }
}
function W0(n) {
  if (!n) return [];
  const e = n.trim().replace(/^\(/, "").replace(/\)$/, "");
  if (!e.trim()) return [];
  const t = [];
  for (const i of Gn(e, ",")) {
    const r = i.trim();
    if (!r || r === "self" || r === "*" || r === "/" || r.startsWith("*")) continue;
    const s = Gn(r, "="), o = s[0].trim(), a = s.length > 1 ? s.slice(1).join("=").trim() : void 0, l = Gn(o, ":"), h = l[0].trim();
    if (!h || !/^\w+$/.test(h)) continue;
    const c = l.length > 1 ? l.slice(1).join(":").trim() : void 0;
    t.push({
      name: h,
      type: c ? Js(c) : void 0,
      default: a !== void 0 ? Ad(a) : void 0
    });
  }
  return t;
}
function qh(n, e) {
  return n.kind === "unknown" ? e : n.kind === "optional" ? { kind: "optional", inner: qh(n.inner, e) } : n.kind === "list" ? { kind: "list", item: qh(n.item, e) } : n;
}
function qd(n, e) {
  var i;
  let t = Js(n.type ?? "");
  if ((i = n.fields) != null && i.length) {
    const r = n.fields.map((s) => qd(s));
    t = qh(t, { kind: "object", fields: r });
  }
  return {
    key: n.name,
    type: t,
    default: n.default ?? void 0,
    required: n.required ?? void 0,
    slot: e == null ? void 0 : e(n.name)
  };
}
function E0(n, e, t) {
  var o;
  const i = (e.config_fields ?? []).map(
    (a) => qd(a, t == null ? void 0 : t.slotFor)
  ), r = e.source_file ?? void 0, s = (o = e.version_methods) != null && o.length ? e.version_methods.map((a) => ({
    name: a.name,
    doc: a.doc ?? void 0,
    signature: a.signature,
    params: W0(a.signature),
    sourceRef: r ? { path: r, line: a.source_line ?? void 0, symbol: `version_${a.name}` } : void 0
  })) : (e.versions ?? []).map((a) => ({ name: a, params: [] }));
  return {
    module: e.module ?? n,
    kind: e.kind,
    doc: e.doc ?? void 0,
    fields: i,
    versionMethods: s,
    sourceRef: r ? { path: r, line: e.source_line ?? void 0 } : void 0
  };
}
function zh(n) {
  const e = [];
  for (const t of n)
    if (typeof t == "string") {
      const i = j0(t);
      i && e.push({ kind: "token", name: i.name, args: i.args });
    } else
      e.push({ kind: "dict", value: { ...t } });
  return e;
}
function zd(n, e = (t, i) => i) {
  const t = [];
  for (const i of n)
    i.kind === "dict" ? Object.keys(i.value).length && t.push({ ...i.value }) : t.push(V0(i.name, e(i.name, i.args)));
  return t;
}
function j0(n) {
  var i;
  const e = n.match(/^~(\w+)(?:\((.*)\))?$/s);
  if (!e) return null;
  const t = {};
  if ((i = e[2]) != null && i.trim())
    for (const r of Gn(e[2], ",")) {
      const [s, ...o] = r.split("="), a = o.join("=").trim();
      if (!(!s.trim() || !a))
        try {
          t[s.trim()] = JSON.parse(a.replace(/'/g, '"'));
        } catch {
          t[s.trim()] = a;
        }
    }
  return { name: e[1], args: t };
}
function V0(n, e) {
  const t = Object.entries(e).map(
    ([i, r]) => `${i}=${typeof r == "string" ? `'${r}'` : JSON.stringify(r)}`
  );
  return t.length ? `~${n}(${t.join(", ")})` : `~${n}`;
}
function Or(n) {
  const e = [];
  for (const t of n)
    if (typeof t == "string") e.push(t);
    else
      for (const [i, r] of Object.entries(t))
        e.push(`${i}=${typeof r == "string" && !/[\s"'{}[\],]/.test(r) ? r : JSON.stringify(r)}`);
  return e;
}
function Kf(n) {
  const e = Mh(n);
  let t = 5381;
  for (let i = 0; i < e.length; i++) t = (t << 5) + t + e.charCodeAt(i) | 0;
  return (t >>> 0).toString(16).padStart(8, "0");
}
function Mh(n) {
  return n === null || typeof n != "object" ? JSON.stringify(n) ?? "null" : Array.isArray(n) ? `[${n.map(Mh).join(",")}]` : `{${Object.keys(n).sort().map((t) => `${JSON.stringify(t)}:${Mh(n[t])}`).join(",")}}`;
}
function er(n) {
  switch (n.kind) {
    case "str":
      return "";
    case "int":
    case "float":
      return 0;
    case "bool":
      return !1;
    case "enum":
      return n.options[0] ?? "";
    case "optional":
      return null;
    case "list":
      return [];
    case "object":
      return Object.fromEntries(
        (n.fields ?? []).map((e) => [e.key, e.default ?? er(e.type)])
      );
    default:
      return null;
  }
}
function $r(n) {
  switch (n.kind) {
    case "str":
      return "str";
    case "int":
      return "int";
    case "float":
      return "float";
    case "bool":
      return "bool";
    case "enum":
      return "Literal[…]";
    case "optional":
      return `${$r(n.inner)} | None`;
    case "list":
      return `list[${$r(n.item)}]`;
    case "object":
      return "dict";
    default:
      return n.annotation ?? "?";
  }
}
function Md(n, e) {
  return JSON.stringify(n ?? null) === JSON.stringify(e ?? null);
}
function Y0(n) {
  return n == null ? "null" : Array.isArray(n) ? `${n.length} item${n.length === 1 ? "" : "s"}` : typeof n == "object" ? `{ ${Object.keys(n).length} }` : String(n);
}
var L0 = /* @__PURE__ */ R('<div class="row svelte-yl9j08"><span class="key mono svelte-yl9j08"> </span> <!> <span class="cap mono svelte-yl9j08"> </span></div>'), D0 = /* @__PURE__ */ R('<input class="raw mono svelte-yl9j08" type="text"/>'), G0 = /* @__PURE__ */ R('<div class="body svelte-yl9j08"><!></div>'), I0 = /* @__PURE__ */ R('<div><button class="head svelte-yl9j08"><span class="disc svelte-yl9j08"> </span> <span class="meta mono svelte-yl9j08"> </span></button> <!></div>');
function U0(n, e) {
  kt(e, !0);
  let t = Le(e, "disabled", 3, !1), i = Le(e, "depth", 3, 0), r = /* @__PURE__ */ D(
    i() > 0
    // toggleable; `depth` only seeds the initial collapsed state
  );
  const s = /* @__PURE__ */ ue(() => e.value ?? {});
  function o(S, Q) {
    e.onChange({ ...u(s), [S]: Q });
  }
  let a = /* @__PURE__ */ D(""), l = /* @__PURE__ */ D(!1);
  Lt(() => {
    u(l) || x(a, JSON.stringify(u(s), null, 1).replace(/\n\s*/g, " "), !0);
  });
  function h(S) {
    x(a, S, !0), x(l, !0);
    try {
      const Q = JSON.parse(S);
      Q && typeof Q == "object" && !Array.isArray(Q) && (e.onChange(Q), x(l, !1));
    } catch {
    }
  }
  var c = I0();
  let f;
  var O = k(c), d = k(O), p = k(d), g = P(d, 2), m = k(g), v = P(O, 2);
  {
    var w = (S) => {
      var Q = G0(), b = k(Q);
      {
        var y = (M) => {
          var j = nn(), z = Ze(j);
          Ke(z, 17, () => e.type.fields, (C) => C.key, (C, Z) => {
            var A = L0(), V = k(A), U = k(V), B = P(V, 2);
            {
              let q = /* @__PURE__ */ ue(() => u(s)[u(Z).key] ?? u(Z).default ?? er(u(Z).type)), E = /* @__PURE__ */ ue(() => i() + 1);
              Os(B, {
                get type() {
                  return u(Z).type;
                },
                get value() {
                  return u(q);
                },
                onChange: (le) => o(u(Z).key, le),
                get disabled() {
                  return t();
                },
                get depth() {
                  return u(E);
                }
              });
            }
            var H = P(B, 2), oe = k(H);
            I(
              (q) => {
                Tr(V, "title", u(Z).doc), G(U, u(Z).key), G(oe, q);
              },
              [() => $r(u(Z).type)]
            ), T(C, A);
          }), T(M, j);
        }, $ = (M) => {
          var j = D0();
          I(() => {
            ba(j, u(a)), j.disabled = t();
          }), K("input", j, (z) => h(z.currentTarget.value)), T(M, j);
        };
        L(b, (M) => {
          var j;
          (j = e.type.fields) != null && j.length ? M(y) : M($, -1);
        });
      }
      T(S, Q);
    };
    L(v, (S) => {
      u(r) && S(w);
    });
  }
  I(
    (S) => {
      f = Ee(c, 1, "obj svelte-yl9j08", null, f, { nested: i() > 0 }), G(p, u(r) ? "▾" : "▸"), G(m, `dict · ${S ?? ""}`);
    },
    [() => Y0(u(s))]
  ), K("click", O, () => x(r, !u(r))), T(n, c), xt();
}
zt(["click", "input"]);
var N0 = /* @__PURE__ */ R('<button class="rm svelte-1im9a9p" title="remove">×</button>'), B0 = /* @__PURE__ */ R('<div class="row svelte-1im9a9p"><span class="grip svelte-1im9a9p" title="reorder"><button class="mv svelte-1im9a9p" tabindex="-1">▴</button> <button class="mv svelte-1im9a9p" tabindex="-1">▾</button></span> <span class="idx mono svelte-1im9a9p"></span> <!> <!></div>'), F0 = /* @__PURE__ */ R('<button class="add mono svelte-1im9a9p"> </button>'), H0 = /* @__PURE__ */ R('<div class="list svelte-1im9a9p"><!> <!></div>');
function J0(n, e) {
  kt(e, !0);
  let t = Le(e, "disabled", 3, !1), i = Le(e, "depth", 3, 0);
  const r = /* @__PURE__ */ ue(() => Array.isArray(e.value) ? e.value : []), s = /* @__PURE__ */ ue(() => e.type.item.kind === "object" ? e.type.item.fields ?? [] : null);
  function o(g, m) {
    e.onChange(u(r).map((v, w) => w === g ? m : v));
  }
  function a(g, m, v) {
    const w = u(r)[g] ?? {};
    o(g, { ...w, [m]: v });
  }
  function l(g) {
    e.onChange(u(r).filter((m, v) => v !== g));
  }
  function h() {
    e.onChange([...u(r), er(e.type.item)]);
  }
  function c(g, m) {
    const v = g + m;
    if (v < 0 || v >= u(r).length) return;
    const w = [...u(r)];
    [w[g], w[v]] = [w[v], w[g]], e.onChange(w);
  }
  var f = H0(), O = k(f);
  Ke(O, 17, () => u(r), Kn, (g, m, v) => {
    var w = B0(), S = k(w), Q = k(S), b = P(Q, 2), y = P(S, 2);
    y.textContent = v;
    var $ = P(y, 2);
    {
      var M = (Z) => {
        var A = nn(), V = Ze(A);
        Ke(V, 17, () => u(s), (U) => U.key, (U, B) => {
          {
            let H = /* @__PURE__ */ ue(() => {
              var q;
              return ((q = u(m)) == null ? void 0 : q[u(B).key]) ?? u(B).default ?? er(u(B).type);
            }), oe = /* @__PURE__ */ ue(() => i() + 1);
            Os(U, {
              get type() {
                return u(B).type;
              },
              get value() {
                return u(H);
              },
              onChange: (q) => a(v, u(B).key, q),
              get disabled() {
                return t();
              },
              get depth() {
                return u(oe);
              }
            });
          }
        }), T(Z, A);
      }, j = (Z) => {
        {
          let A = /* @__PURE__ */ ue(() => i() + 1);
          Os(Z, {
            get type() {
              return e.type.item;
            },
            get value() {
              return u(m);
            },
            onChange: (V) => o(v, V),
            get disabled() {
              return t();
            },
            get depth() {
              return u(A);
            }
          });
        }
      };
      L($, (Z) => {
        var A;
        (A = u(s)) != null && A.length ? Z(M) : Z(j, -1);
      });
    }
    var z = P($, 2);
    {
      var C = (Z) => {
        var A = N0();
        K("click", A, () => l(v)), T(Z, A);
      };
      L(z, (Z) => {
        t() || Z(C);
      });
    }
    I(() => {
      Q.disabled = t(), b.disabled = t();
    }), K("click", Q, () => c(v, -1)), K("click", b, () => c(v, 1)), T(g, w);
  });
  var d = P(O, 2);
  {
    var p = (g) => {
      var m = F0(), v = k(m);
      I((w) => G(v, `+ add ${w ?? ""}`), [() => $r(e.type.item)]), K("click", m, h), T(g, m);
    };
    L(d, (g) => {
      t() || g(p);
    });
  }
  T(n, f), xt();
}
zt(["click"]);
var K0 = /* @__PURE__ */ R('<input class="fr-input mono svelte-10okn7m" type="text"/>'), e1 = /* @__PURE__ */ R('<span><button class="fr-step svelte-10okn7m" tabindex="-1">−</button> <input class="fr-num mono svelte-10okn7m" type="number"/> <button class="fr-step svelte-10okn7m" tabindex="-1">+</button></span>'), t1 = /* @__PURE__ */ R('<button role="switch" aria-label="Toggle value"><span class="fr-knob svelte-10okn7m"></span></button> <span class="fr-boolval svelte-10okn7m"> </span>', 1), i1 = /* @__PURE__ */ R("<button> </button>"), n1 = /* @__PURE__ */ R("<span></span>"), r1 = /* @__PURE__ */ R('<span class="fr-none mono svelte-10okn7m">None</span> <button class="fr-set mono svelte-10okn7m">set value</button>', 1), s1 = /* @__PURE__ */ R('<!> <button class="fr-clear mono svelte-10okn7m" title="reset to None">×</button>', 1), o1 = /* @__PURE__ */ R('<input class="fr-input fr-raw mono svelte-10okn7m" type="text"/>');
function Os(n, e) {
  kt(e, !0);
  let t = Le(e, "disabled", 3, !1), i = Le(e, "depth", 3, 0);
  function r() {
    if (e.type.kind === "int") return 1;
    const Q = Math.abs(Number(e.value) || 0);
    if (Q === 0) return 0.1;
    const b = Math.pow(10, Math.floor(Math.log10(Q)));
    return b / 10 >= 1e-3 ? b / 10 : 1e-3;
  }
  function s(Q) {
    const b = r(), y = (Number(e.value) || 0) + Q * b;
    e.onChange(e.type.kind === "int" ? Math.round(y) : Number(y.toPrecision(12)));
  }
  function o(Q) {
    const b = Q.currentTarget.value;
    b !== "" && e.onChange(e.type.kind === "int" ? Math.round(Number(b)) : Number(b));
  }
  let a = /* @__PURE__ */ D(""), l = /* @__PURE__ */ D(!1);
  Lt(() => {
    u(l) || x(a, e.value === void 0 ? "null" : JSON.stringify(e.value), !0);
  });
  function h(Q) {
    x(a, Q, !0), x(l, !0);
    try {
      e.onChange(JSON.parse(Q)), x(l, !1);
    } catch {
    }
  }
  var c = nn(), f = Ze(c);
  {
    var O = (Q) => {
      var b = K0();
      I(
        (y) => {
          ba(b, y), b.disabled = t();
        },
        [() => String(e.value ?? "")]
      ), K("input", b, (y) => e.onChange(y.currentTarget.value)), T(Q, b);
    }, d = (Q) => {
      var b = e1();
      let y;
      var $ = k(b), M = P($, 2), j = P(M, 2);
      I(() => {
        y = Ee(b, 1, "fr-stepper svelte-10okn7m", null, y, { disabled: t() }), $.disabled = t(), ba(M, e.value ?? ""), M.disabled = t(), j.disabled = t();
      }), K("click", $, () => s(-1)), K("input", M, o), K("click", j, () => s(1)), T(Q, b);
    }, p = (Q) => {
      var b = t1(), y = Ze(b);
      let $;
      var M = P(y, 2), j = k(M);
      I(() => {
        $ = Ee(y, 1, "fr-toggle svelte-10okn7m", null, $, { on: !!e.value }), y.disabled = t(), Tr(y, "aria-checked", !!e.value), G(j, e.value ? "true" : "false");
      }), K("click", y, () => e.onChange(!e.value)), T(Q, b);
    }, g = (Q) => {
      var b = n1();
      let y;
      Ke(b, 20, () => e.type.options, ($) => $, ($, M) => {
        var j = i1();
        let z;
        var C = k(j);
        I(() => {
          z = Ee(j, 1, "fr-opt svelte-10okn7m", null, z, { on: e.value === M }), j.disabled = t(), G(C, M);
        }), K("click", j, () => e.onChange(M)), T($, j);
      }), I(() => y = Ee(b, 1, "fr-seg svelte-10okn7m", null, y, { disabled: t() })), T(Q, b);
    }, m = (Q) => {
      var b = nn(), y = Ze(b);
      {
        var $ = (j) => {
          var z = r1(), C = P(Ze(z), 2);
          I(() => C.disabled = t()), K("click", C, () => e.onChange(er(e.type.inner))), T(j, z);
        }, M = (j) => {
          var z = s1(), C = Ze(z);
          Os(C, {
            get type() {
              return e.type.inner;
            },
            get value() {
              return e.value;
            },
            get onChange() {
              return e.onChange;
            },
            get disabled() {
              return t();
            },
            get depth() {
              return i();
            }
          });
          var Z = P(C, 2);
          I(() => Z.disabled = t()), K("click", Z, () => e.onChange(null)), T(j, z);
        };
        L(y, (j) => {
          e.value === null || e.value === void 0 ? j($) : j(M, -1);
        });
      }
      T(Q, b);
    }, v = (Q) => {
      U0(Q, {
        get type() {
          return e.type;
        },
        get value() {
          return e.value;
        },
        get onChange() {
          return e.onChange;
        },
        get disabled() {
          return t();
        },
        get depth() {
          return i();
        }
      });
    }, w = (Q) => {
      J0(Q, {
        get type() {
          return e.type;
        },
        get value() {
          return e.value;
        },
        get onChange() {
          return e.onChange;
        },
        get disabled() {
          return t();
        },
        get depth() {
          return i();
        }
      });
    }, S = (Q) => {
      var b = o1();
      I(
        (y) => {
          ba(b, u(a)), b.disabled = t(), Tr(b, "title", y);
        },
        [
          () => e.type.kind === "unknown" ? e.type.annotation ?? "no schema" : $r(e.type)
        ]
      ), K("input", b, (y) => h(y.currentTarget.value)), T(Q, b);
    };
    L(f, (Q) => {
      e.type.kind === "str" ? Q(O) : e.type.kind === "int" || e.type.kind === "float" ? Q(d, 1) : e.type.kind === "bool" ? Q(p, 2) : e.type.kind === "enum" ? Q(g, 3) : e.type.kind === "optional" ? Q(m, 4) : e.type.kind === "object" ? Q(v, 5) : e.type.kind === "list" ? Q(w, 6) : Q(S, -1);
    });
  }
  T(n, c), xt();
}
zt(["input", "click"]);
var a1 = /* @__PURE__ */ R('<button class="esrc mono svelte-10ggm8s">&lt;/&gt;</button>'), eu = /* @__PURE__ */ R('<span class="ktype mono svelte-10ggm8s"> </span>'), l1 = /* @__PURE__ */ R('<div class="krow svelte-10ggm8s"><span class="kname mono svelte-10ggm8s"> </span> <!> <!> <button class="krm svelte-10ggm8s" title="remove key">×</button></div>'), h1 = /* @__PURE__ */ R('<div class="kempty mono svelte-10ggm8s">empty — add a field below</div>'), c1 = /* @__PURE__ */ R('<button class="kfield mono svelte-10ggm8s"> </button>'), f1 = /* @__PURE__ */ R('<!> <div class="kadd svelte-10ggm8s"><!> <input class="kfree mono svelte-10ggm8s" placeholder="custom.key"/></div>', 1), u1 = /* @__PURE__ */ R('<div class="tdoc svelte-10ggm8s"> </div>'), O1 = /* @__PURE__ */ R('<div class="krow svelte-10ggm8s"><span class="kname mono svelte-10ggm8s"> </span> <!> <!></div>'), d1 = /* @__PURE__ */ R('<div class="kempty mono svelte-10ggm8s">no arguments</div>'), p1 = /* @__PURE__ */ R("<!> <!>", 1), g1 = /* @__PURE__ */ R('<div class="ebody svelte-10ggm8s"><!></div>'), m1 = /* @__PURE__ */ R('<div><div class="ehead svelte-10ggm8s"><button class="etoggle svelte-10ggm8s"><span class="eno mono svelte-10ggm8s"></span> <span> </span></button> <span class="espacer svelte-10ggm8s"></span> <!> <span class="emv svelte-10ggm8s"><button class="mv svelte-10ggm8s" title="move up">▴</button> <button class="mv svelte-10ggm8s" title="move down">▾</button></span> <button class="erm svelte-10ggm8s" title="remove">×</button></div> <!></div>'), v1 = /* @__PURE__ */ R('<div class="kempty mono svelte-10ggm8s">defaults — add overrides or a ~version</div>'), Q1 = /* @__PURE__ */ R('<button class="add mono svelte-10ggm8s">+ ~version</button>'), b1 = /* @__PURE__ */ R('<span class="vdoc svelte-10ggm8s"> </span>'), S1 = /* @__PURE__ */ R('<button class="vrow svelte-10ggm8s"><span class="vname mono svelte-10ggm8s"> </span> <!></button>'), y1 = /* @__PURE__ */ R('<div class="vocab svelte-10ggm8s"></div>'), k1 = /* @__PURE__ */ R('<div class="overlay svelte-10ggm8s"><div class="modal svelte-10ggm8s" role="dialog" aria-label="version editor"><div class="mhead svelte-10ggm8s"><span class="mtitle mono svelte-10ggm8s"> </span> <span class="mspacer svelte-10ggm8s"></span> <button class="mclose svelte-10ggm8s" title="cancel">×</button></div> <div class="mbody svelte-10ggm8s"><!> <div class="addbar svelte-10ggm8s"><button class="add mono svelte-10ggm8s"></button> <!></div> <!></div> <div class="mfoot svelte-10ggm8s"><span class="mprev mono svelte-10ggm8s" title="the compact version, as the CLI writes it"> </span> <span class="mspacer svelte-10ggm8s"></span> <button class="btn svelte-10ggm8s">Cancel</button> <button class="btn primary svelte-10ggm8s">Apply</button></div></div></div>');
function x1(n, e) {
  kt(e, !0);
  let t = /* @__PURE__ */ D(Je(zh(e.version))), i = /* @__PURE__ */ D(Je(u(
    t
    // expanded element
  ).length ? 0 : null)), r = /* @__PURE__ */ D(!1), s = /* @__PURE__ */ D(
    ""
    // free-text key input per open dict
  );
  const o = (W) => e.schema.versionMethods.find((Y) => Y.name === W), a = (W) => e.schema.fields.find((Y) => Y.key === W);
  function l(W, Y) {
    const F = o(W);
    return Object.fromEntries(Object.entries(Y).filter(([ae, Qe]) => {
      const ke = F == null ? void 0 : F.params.find((Ne) => Ne.name === ae);
      return ke === void 0 || !Md(Qe, ke.default);
    }));
  }
  const h = /* @__PURE__ */ ue(() => zd(u(t), l));
  function c(W) {
    if (W.kind === "token") {
      const F = l(W.name, W.args), ae = Object.entries(F).map(([Qe, ke]) => `${Qe}=${typeof ke == "string" ? ke : JSON.stringify(ke)}`);
      return `~${W.name}${ae.length ? `(${ae.join(", ")})` : ""}`;
    }
    const Y = Object.keys(W.value);
    return Y.length ? `{ ${Y.join(", ")} }` : "{ }";
  }
  function f(W, Y) {
    const F = W + Y;
    if (F < 0 || F >= u(t).length) return;
    const ae = [...u(t)];
    [ae[W], ae[F]] = [ae[F], ae[W]], x(t, ae, !0), u(i) === W ? x(i, F) : u(i) === F && x(i, W, !0);
  }
  function O(W) {
    x(t, u(t).filter((Y, F) => F !== W), !0), u(i) === W ? x(i, null) : u(i) !== null && u(i) > W && x(i, u(i) - 1);
  }
  function d() {
    x(t, [...u(t), { kind: "dict", value: {} }], !0), x(i, u(t).length - 1);
  }
  function p(W) {
    const Y = o(W), F = Object.fromEntries(((Y == null ? void 0 : Y.params) ?? []).filter((ae) => ae.default !== void 0).map((ae) => [ae.name, ae.default]));
    x(t, [...u(t), { kind: "token", name: W, args: F }], !0), x(r, !1), x(i, u(t).length - 1);
  }
  function g(W, Y, F) {
    x(
      t,
      u(t).map((ae, Qe) => Qe === W && ae.kind === "dict" ? { kind: "dict", value: { ...ae.value, [Y]: F } } : ae),
      !0
    );
  }
  function m(W, Y) {
    x(
      t,
      u(t).map((F, ae) => {
        if (ae !== W || F.kind !== "dict") return F;
        const { [Y]: Qe, ...ke } = F.value;
        return { kind: "dict", value: ke };
      }),
      !0
    );
  }
  function v(W, Y) {
    const F = a(Y);
    g(W, Y, F ? F.default ?? er(F.type) : "");
  }
  function w(W) {
    const Y = u(s).trim();
    Y && (g(W, Y, ""), x(s, ""));
  }
  function S(W) {
    return e.schema.fields.filter((Y) => !(Y.key in W.value));
  }
  function Q(W, Y, F) {
    x(
      t,
      u(t).map((ae, Qe) => Qe === W && ae.kind === "token" ? { kind: "token", name: ae.name, args: { ...ae.args, [Y]: F } } : ae),
      !0
    );
  }
  const b = /* @__PURE__ */ ue(() => u(h).map((W) => typeof W == "string" ? W : Object.entries(W).map(([Y, F]) => `${Y}=${typeof F == "string" ? F : JSON.stringify(F)}`).join(" ")).join(" ") || "defaults");
  var y = k1(), $ = k(y), M = k($), j = k(M), z = k(j), C = P(j, 4), Z = P(M, 2), A = k(Z);
  Ke(
    A,
    17,
    () => u(t),
    Kn,
    (W, Y, F) => {
      var ae = m1();
      let Qe;
      var ke = k(ae), Ne = k(ke), N = k(Ne);
      N.textContent = F + 1;
      var re = P(N, 2);
      let de;
      var xe = k(re), Be = P(Ne, 4);
      {
        var et = (nt) => {
          var zi = a1();
          K("click", zi, () => e.onViewSource(o(u(Y).name).sourceRef)), T(nt, zi);
        }, _e = /* @__PURE__ */ ue(() => {
          var nt;
          return u(Y).kind === "token" && ((nt = o(u(Y).name)) == null ? void 0 : nt.sourceRef) && e.onViewSource;
        });
        L(Be, (nt) => {
          u(_e) && nt(et);
        });
      }
      var gt = P(Be, 2), Ge = k(gt), he = P(Ge, 2), we = P(gt, 2), Ve = P(ke, 2);
      {
        var mt = (nt) => {
          var zi = g1(), _s = k(zi);
          {
            var Ts = (Mi) => {
              var xi = f1(), Wi = Ze(xi);
              Ke(
                Wi,
                16,
                () => Object.keys(u(Y).value),
                (ze) => ze,
                (ze, Me) => {
                  const Ct = /* @__PURE__ */ ue(() => a(Me));
                  var Kt = l1(), wi = k(Kt), ln = k(wi), hn = P(wi, 2);
                  {
                    let It = /* @__PURE__ */ ue(() => {
                      var ti;
                      return ((ti = u(Ct)) == null ? void 0 : ti.type) ?? { kind: "unknown" };
                    });
                    Os(hn, {
                      get type() {
                        return u(It);
                      },
                      get value() {
                        return u(Y).value[Me];
                      },
                      onChange: (ti) => g(F, Me, ti)
                    });
                  }
                  var zn = P(hn, 2);
                  {
                    var ei = (It) => {
                      var ti = eu(), Zs = k(ti);
                      I((Rs) => G(Zs, Rs), [() => $r(u(Ct).type)]), T(It, ti);
                    };
                    L(zn, (It) => {
                      u(Ct) && It(ei);
                    });
                  }
                  var Ei = P(zn, 2);
                  I(() => G(ln, Me)), K("click", Ei, () => m(F, Me)), T(ze, Kt);
                },
                (ze) => {
                  var Me = h1();
                  T(ze, Me);
                }
              );
              var sn = P(Wi, 2), on = k(sn);
              Ke(on, 17, () => S(u(Y)), (ze) => ze.key, (ze, Me) => {
                var Ct = c1(), Kt = k(Ct);
                I(() => G(Kt, `+ ${u(Me).key ?? ""}`)), K("click", Ct, () => v(F, u(Me).key)), T(ze, Ct);
              });
              var an = P(on, 2);
              K("keydown", an, (ze) => ze.key === "Enter" && w(F)), xn(an, () => u(s), (ze) => x(s, ze)), T(Mi, xi);
            }, $s = (Mi) => {
              const xi = /* @__PURE__ */ ue(() => o(u(Y).name));
              var Wi = p1(), sn = Ze(Wi);
              {
                var on = (ze) => {
                  var Me = u1(), Ct = k(Me);
                  I(() => G(Ct, u(xi).doc)), T(ze, Me);
                };
                L(sn, (ze) => {
                  var Me;
                  (Me = u(xi)) != null && Me.doc && ze(on);
                });
              }
              var an = P(sn, 2);
              Ke(
                an,
                17,
                () => {
                  var ze;
                  return ((ze = u(xi)) == null ? void 0 : ze.params) ?? [];
                },
                (ze) => ze.name,
                (ze, Me) => {
                  var Ct = O1(), Kt = k(Ct), wi = k(Kt), ln = P(Kt, 2);
                  {
                    let ei = /* @__PURE__ */ ue(() => u(Me).type ?? { kind: "unknown" }), Ei = /* @__PURE__ */ ue(() => u(Y).args[u(Me).name] ?? u(Me).default ?? null);
                    Os(ln, {
                      get type() {
                        return u(ei);
                      },
                      get value() {
                        return u(Ei);
                      },
                      onChange: (It) => Q(F, u(Me).name, It)
                    });
                  }
                  var hn = P(ln, 2);
                  {
                    var zn = (ei) => {
                      var Ei = eu(), It = k(Ei);
                      I((ti) => G(It, `def ${ti ?? ""}`), [() => JSON.stringify(u(Me).default)]), T(ei, Ei);
                    };
                    L(hn, (ei) => {
                      u(Me).default !== void 0 && ei(zn);
                    });
                  }
                  I(() => G(wi, u(Me).name)), T(ze, Ct);
                },
                (ze) => {
                  var Me = d1();
                  T(ze, Me);
                }
              ), T(Mi, Wi);
            };
            L(_s, (Mi) => {
              u(Y).kind === "dict" ? Mi(Ts) : Mi($s, -1);
            });
          }
          T(nt, zi);
        };
        L(Ve, (nt) => {
          u(i) === F && nt(mt);
        });
      }
      I(
        (nt) => {
          Qe = Ee(ae, 1, "elem svelte-10ggm8s", null, Qe, { openel: u(i) === F }), de = Ee(re, 1, "echip mono svelte-10ggm8s", null, de, { dict: u(Y).kind === "dict" }), G(xe, nt);
        },
        [() => c(u(Y))]
      ), K("click", Ne, () => x(i, u(i) === F ? null : F, !0)), K("click", Ge, () => f(F, -1)), K("click", he, () => f(F, 1)), K("click", we, () => O(F)), T(W, ae);
    },
    (W) => {
      var Y = v1();
      T(W, Y);
    }
  );
  var V = P(A, 2), U = k(V);
  U.textContent = "+ overrides {}";
  var B = P(U, 2);
  {
    var H = (W) => {
      var Y = Q1();
      K("click", Y, () => x(r, !u(r))), T(W, Y);
    };
    L(B, (W) => {
      e.schema.versionMethods.length && W(H);
    });
  }
  var oe = P(V, 2);
  {
    var q = (W) => {
      var Y = y1();
      Ke(Y, 21, () => e.schema.versionMethods, (F) => F.name, (F, ae) => {
        var Qe = S1(), ke = k(Qe), Ne = k(ke), N = P(ke, 2);
        {
          var re = (de) => {
            var xe = b1(), Be = k(xe);
            I((et) => G(Be, et), [() => u(ae).doc.split(`
`)[0]]), T(de, xe);
          };
          L(N, (de) => {
            u(ae).doc && de(re);
          });
        }
        I(() => G(Ne, `~${u(ae).name ?? ""}`)), K("click", Qe, () => p(u(ae).name)), T(F, Qe);
      }), T(W, Y);
    };
    L(oe, (W) => {
      u(r) && W(q);
    });
  }
  var E = P(Z, 2), le = k(E), ne = k(le), Oe = P(le, 4), ge = P(Oe, 2);
  I(() => {
    G(z, `version · ${e.schema.module ?? ""}`), G(ne, u(b));
  }), K("click", y, function(...W) {
    var Y;
    (Y = e.onCancel) == null || Y.apply(this, W);
  }), K("click", $, (W) => W.stopPropagation()), K("click", C, function(...W) {
    var Y;
    (Y = e.onCancel) == null || Y.apply(this, W);
  }), K("click", U, d), K("click", Oe, function(...W) {
    var Y;
    (Y = e.onCancel) == null || Y.apply(this, W);
  }), K("click", ge, () => e.onApply(u(h))), T(n, y), xt();
}
zt(["click", "keydown"]);
var w1 = /* @__PURE__ */ R('<div class="skl svelte-8pl3d7"><div class="skl-line svelte-8pl3d7" style="width: 55%"></div> <div class="skl-box svelte-8pl3d7"></div> <div class="skl-box svelte-8pl3d7" style="animation-delay: 0.15s"></div></div>'), P1 = /* @__PURE__ */ R("<span> </span>"), _1 = /* @__PURE__ */ R('<span class="defaults mono svelte-8pl3d7">defaults</span>'), T1 = /* @__PURE__ */ R('<button class="edit mono svelte-8pl3d7">✎ edit</button>'), $1 = /* @__PURE__ */ R('<div class="doc svelte-8pl3d7"> </div>'), tu = /* @__PURE__ */ R('<span class="mdot svelte-8pl3d7" title="changed from default"></span>'), iu = /* @__PURE__ */ R('<div class="ierr mono svelte-8pl3d7"> </div>'), Z1 = /* @__PURE__ */ R('<div><div class="slothead svelte-8pl3d7"><span class="key mono svelte-8pl3d7"> </span> <span class="slottag mono svelte-8pl3d7"> </span> <!></div> <!> <!></div>'), R1 = /* @__PURE__ */ R('<div><span class="key mono svelte-8pl3d7"> </span> <span> </span> <span class="cap2 mono svelte-8pl3d7"> </span> <!></div> <!>', 1), X1 = /* @__PURE__ */ R('<div class="frow svelte-8pl3d7"><span class="key mono svelte-8pl3d7"> </span> <span class="val mono svelte-8pl3d7"> </span></div>'), C1 = /* @__PURE__ */ R('<div class="empty mono svelte-8pl3d7">no configurable fields — runs as-is</div>'), A1 = /* @__PURE__ */ R('<div class="vrow svelte-8pl3d7"><!> <!></div> <!> <div class="fields svelte-8pl3d7"><!> <!> <!></div> <!>', 1), q1 = /* @__PURE__ */ R('<div class="cfg svelte-8pl3d7"><!></div>');
function Wd(n, e) {
  kt(e, !0);
  let t = Le(e, "version", 19, () => []), i = Le(e, "issues", 19, () => []), r = Le(e, "disabled", 3, !1), s = /* @__PURE__ */ D(null), o = /* @__PURE__ */ D(Je([])), a = /* @__PURE__ */ D(Je({})), l = /* @__PURE__ */ D(!1);
  Lt(() => {
    e.module;
    const Q = ks(() => t());
    let b = !1;
    return e.adapter.introspect(e.module).then((y) => {
      var $;
      b || (x(s, y, !0), x(o, Q, !0), ($ = e.onVersion) == null || $.call(e, Q));
    }), () => b = !0;
  }), Lt(() => {
    JSON.stringify(u(o)), e.module;
    let Q = !1;
    const b = setTimeout(
      () => {
        e.adapter.resolve(e.module, u(o)).then((y) => {
          var $;
          Q || !y.ok || (x(a, y.config, !0), ($ = e.onValues) == null || $.call(e, { ...y.config }));
        });
      },
      150
    );
    return () => {
      Q = !0, clearTimeout(b);
    };
  });
  function h(Q) {
    var b;
    x(l, !1), x(o, Q, !0), (b = e.onVersion) == null || b.call(e, Q);
  }
  function c(Q, b) {
    const y = zh(u(o)), $ = [...y].reverse().find((M) => M.kind === "dict");
    $ && $.kind === "dict" ? $.value[Q] = b : y.push({ kind: "dict", value: { [Q]: b } }), h(zd(y));
  }
  const f = /* @__PURE__ */ ue(() => {
    var Q;
    return new Set((((Q = u(s)) == null ? void 0 : Q.fields) ?? []).filter((b) => !Md(u(a)[b.key], b.default ?? er(b.type))).map((b) => b.key));
  }), O = /* @__PURE__ */ ue(() => zh(u(o))), d = /* @__PURE__ */ ue(() => {
    var b;
    const Q = new Set((((b = u(s)) == null ? void 0 : b.fields) ?? []).map((y) => y.key));
    return Object.keys(u(a)).filter((y) => !Q.has(y) && !y.startsWith("_"));
  });
  function p(Q) {
    return Q == null ? "None" : typeof Q == "string" ? Q === "" ? '""' : Q : JSON.stringify(Q);
  }
  function g(Q) {
    return i().find((b) => {
      var y;
      return b.path === Q || ((y = b.path) == null ? void 0 : y.startsWith(Q + "."));
    });
  }
  var m = q1(), v = k(m);
  {
    var w = (Q) => {
      var b = w1();
      T(Q, b);
    }, S = (Q) => {
      var b = A1(), y = Ze(b), $ = k(y);
      Ke(
        $,
        17,
        () => u(O),
        Kn,
        (q, E) => {
          var le = P1();
          let ne;
          var Oe = k(le);
          I(
            (ge) => {
              ne = Ee(le, 1, "chip mono svelte-8pl3d7", null, ne, { dict: u(E).kind === "dict" }), G(Oe, ge);
            },
            [
              () => u(E).kind === "dict" ? `{ ${Object.keys(u(E).value).join(", ")} }` : `~${u(E).name}`
            ]
          ), T(q, le);
        },
        (q) => {
          var E = _1();
          T(q, E);
        }
      );
      var M = P($, 2);
      {
        var j = (q) => {
          var E = T1();
          K("click", E, () => x(l, !0)), T(q, E);
        };
        L(M, (q) => {
          r() || q(j);
        });
      }
      var z = P(y, 2);
      {
        var C = (q) => {
          var E = $1(), le = k(E);
          I((ne) => G(le, ne), [() => u(s).doc.split(`

`)[0]]), T(q, E);
        };
        L(z, (q) => {
          u(s).doc && q(C);
        });
      }
      var Z = P(z, 2), A = k(Z);
      Ke(A, 17, () => u(s).fields, (q) => q.key, (q, E) => {
        const le = /* @__PURE__ */ ue(() => {
          var F, ae;
          return u(E).slot ? (ae = (F = e.adapter.slots) == null ? void 0 : F.fields) == null ? void 0 : ae[u(E).slot] : void 0;
        }), ne = /* @__PURE__ */ ue(() => g(u(E).key));
        var Oe = nn(), ge = Ze(Oe);
        {
          var W = (F) => {
            var ae = Z1();
            let Qe;
            var ke = k(ae), Ne = k(ke), N = k(Ne), re = P(Ne, 2), de = k(re), xe = P(re, 2);
            {
              var Be = (he) => {
                var we = tu();
                T(he, we);
              }, et = /* @__PURE__ */ ue(() => u(f).has(u(E).key));
              L(xe, (he) => {
                u(et) && he(Be);
              });
            }
            var _e = P(ke, 2);
            {
              let he = /* @__PURE__ */ ue(() => String(u(a)[u(E).key] ?? ""));
              $d(_e, () => u(le), (we, Ve) => {
                Ve(we, {
                  get value() {
                    return u(he);
                  },
                  onChange: (mt) => c(u(E).key, mt),
                  get disabled() {
                    return r();
                  }
                });
              });
            }
            var gt = P(_e, 2);
            {
              var Ge = (he) => {
                var we = iu(), Ve = k(we);
                I(() => G(Ve, u(ne).message)), T(he, we);
              };
              L(gt, (he) => {
                u(ne) && he(Ge);
              });
            }
            I(() => {
              Qe = Ee(ae, 1, "slotcard svelte-8pl3d7", null, Qe, { bad: !!u(ne) }), Tr(Ne, "title", u(E).doc), G(N, u(E).key), G(de, `HOST SLOT · ${u(E).slot ?? ""}`);
            }), T(F, ae);
          }, Y = (F) => {
            var ae = R1(), Qe = Ze(ae);
            let ke;
            var Ne = k(Qe), N = k(Ne), re = P(Ne, 2);
            let de;
            var xe = k(re), Be = P(re, 2), et = k(Be), _e = P(Be, 2);
            {
              var gt = (Ve) => {
                var mt = tu();
                T(Ve, mt);
              }, Ge = /* @__PURE__ */ ue(() => u(f).has(u(E).key));
              L(_e, (Ve) => {
                u(Ge) && Ve(gt);
              });
            }
            var he = P(Qe, 2);
            {
              var we = (Ve) => {
                var mt = iu(), nt = k(mt);
                I(() => G(nt, u(ne).message)), T(Ve, mt);
              };
              L(he, (Ve) => {
                u(ne) && Ve(we);
              });
            }
            I(
              (Ve, mt, nt) => {
                ke = Ee(Qe, 1, "frow svelte-8pl3d7", null, ke, { bad: !!u(ne) }), Tr(Ne, "title", u(E).doc), G(N, u(E).key), de = Ee(re, 1, "val mono svelte-8pl3d7", null, de, Ve), G(xe, mt), G(et, nt);
              },
              [
                () => ({ isdef: !u(f).has(u(E).key) }),
                () => p(u(a)[u(E).key] ?? u(E).default ?? er(u(E).type)),
                () => $r(u(E).type)
              ]
            ), T(F, ae);
          };
          L(ge, (F) => {
            u(le) ? F(W) : F(Y, -1);
          });
        }
        T(q, Oe);
      });
      var V = P(A, 2);
      Ke(V, 16, () => u(d), (q) => q, (q, E) => {
        var le = X1(), ne = k(le), Oe = k(ne), ge = P(ne, 2), W = k(ge);
        I(
          (Y) => {
            G(Oe, E), G(W, Y);
          },
          [() => p(u(a)[E])]
        ), T(q, le);
      });
      var U = P(V, 2);
      {
        var B = (q) => {
          var E = C1();
          T(q, E);
        };
        L(U, (q) => {
          !u(s).fields.length && !u(d).length && q(B);
        });
      }
      var H = P(Z, 2);
      {
        var oe = (q) => {
          x1(q, {
            get schema() {
              return u(s);
            },
            get version() {
              return u(o);
            },
            onApply: h,
            onCancel: () => x(l, !1),
            get onViewSource() {
              return e.onViewSource;
            }
          });
        };
        L(H, (q) => {
          u(l) && q(oe);
        });
      }
      T(Q, b);
    };
    L(v, (Q) => {
      u(s) ? Q(S, -1) : Q(w);
    });
  }
  T(n, m), xt();
}
zt(["click"]);
var z1 = /* @__PURE__ */ R('<button class="lact mono svelte-94r51u" title="reset — a fresh run instance">↺ new run</button>'), M1 = /* @__PURE__ */ R('<span class="lmv svelte-94r51u"><button class="mv svelte-94r51u" title="move up">▴</button> <button class="mv svelte-94r51u" title="move down">▾</button></span> <button class="lrm svelte-94r51u" title="remove">×</button>', 1), W1 = /* @__PURE__ */ R('<div class="lbody svelte-94r51u"><!></div>'), E1 = /* @__PURE__ */ R('<div role="group"><div class="lhead svelte-94r51u"><button class="ltoggle svelte-94r51u"><span class="lno mono svelte-94r51u"> </span> <span class="lname mono svelte-94r51u"> </span> <span class="lsum mono svelte-94r51u"> </span></button> <span class="lspacer svelte-94r51u"></span> <!> <button class="lsrc mono svelte-94r51u" title="view source">&lt;/&gt;</button> <!></div> <!></div>'), j1 = /* @__PURE__ */ R('<div class="empty mono svelte-94r51u" style="margin-left: 9px">no context layers<br/><span class="emptysub svelte-94r51u">→ runs in the ambient project</span></div>'), V1 = /* @__PURE__ */ R('<button class="mitem svelte-94r51u"><span class="mname mono svelte-94r51u"> </span> <span class="mhint svelte-94r51u"> </span></button>'), Y1 = /* @__PURE__ */ R('<button class="mitem svelte-94r51u"><span class="mname mono svelte-94r51u"> </span></button>'), L1 = /* @__PURE__ */ R('<div class="msep mono svelte-94r51u">any interface</div> <!>', 1), D1 = /* @__PURE__ */ R('<div class="menu svelte-94r51u"><!> <!></div>'), G1 = /* @__PURE__ */ R('<div class="addrow svelte-94r51u"><button class="addbtn mono svelte-94r51u">+ add context</button></div> <!>', 1), I1 = /* @__PURE__ */ R('<div><div class="shead svelte-94r51u"><span class="cap mono svelte-94r51u">CONTEXT · with-stack</span> <span class="hint mono svelte-94r51u">LIFO — enter top→down</span></div> <div class="env mono svelte-94r51u"><span class="envk svelte-94r51u">env</span> <span class="envm svelte-94r51u">project</span> <span class="envv svelte-94r51u"> </span> <span class="amb svelte-94r51u">ambient</span></div> <!> <!></div>');
function U1(n, e) {
  kt(e, !0);
  let t = Le(e, "modules", 19, () => []), i = Le(e, "disabled", 3, !1), r = Le(e, "highlightId", 3, null), s = /* @__PURE__ */ D(Je([])), o = /* @__PURE__ */ D(!1);
  const a = () => Math.random().toString(36).slice(2, 8);
  async function l(Z) {
    x(o, !1);
    let A = "Interface", V = Z.split(".").at(-1) ?? Z;
    try {
      const U = await e.adapter.introspect(Z);
      A = U.kind ?? A, V = U.title ?? V;
    } catch {
    }
    x(
      s,
      [
        ...u(s),
        { id: a(), module: Z, title: V, kind: A, version: [], open: !0 }
      ],
      !0
    );
  }
  function h(Z) {
    x(s, u(s).filter((A) => A.id !== Z), !0);
  }
  function c(Z, A) {
    const V = Z + A;
    if (V < 0 || V >= u(s).length) return;
    const U = [...u(s)];
    [U[Z], U[V]] = [U[V], U[Z]], x(s, U, !0);
  }
  function f(Z, A) {
    const V = u(s).find((U) => U.id === Z);
    !V || JSON.stringify(V.version) === JSON.stringify(A) || x(s, u(s).map((U) => U.id === Z ? { ...U, version: A } : U), !0);
  }
  function O(Z) {
    x(s, u(s).map((A) => A.id === Z ? { ...A, open: !A.open } : A), !0);
  }
  function d(Z) {
    x(s, u(s).map((A) => A.id === Z ? { ...A, id: a() } : A), !0);
  }
  async function p(Z) {
    var A;
    try {
      const V = await e.adapter.introspect(Z);
      V.sourceRef && ((A = e.onViewSource) == null || A.call(e, V.sourceRef));
    } catch {
    }
  }
  function g(Z) {
    const A = Or(Z.version);
    return A.length ? A.join(" ") : "defaults";
  }
  const m = /* @__PURE__ */ ue(() => {
    const Z = [];
    let A, V;
    for (const B of u(s))
      B.kind === "Execution" && !A ? (A = { target: B.module, version: B.version }, V = B.id) : Z.push({ target: B.module, version: B.version });
    const U = u(s).map((B) => ({
      id: B.id,
      module: B.module,
      title: B.title,
      version: B.version
    }));
    return { context: Z, execution: A, executionRef: V, chain: U };
  });
  let v = "";
  Lt(() => {
    var V;
    const Z = u(m), A = JSON.stringify(Z);
    A !== v && (v = A, (V = e.onChange) == null || V.call(e, Z));
  });
  const w = [
    {
      module: "machinable.execution",
      label: "Execution",
      hint: "the runner / container"
    },
    {
      module: "machinable.scope",
      label: "Scope",
      hint: "predicate injection"
    }
  ], S = /* @__PURE__ */ ue(() => t().filter((Z) => !Z.startsWith("machinable.")));
  var Q = I1();
  let b;
  var y = P(k(Q), 2), $ = P(k(y), 4), M = k($), j = P(y, 2);
  Ke(
    j,
    19,
    () => u(s),
    (Z) => Z.id,
    (Z, A, V) => {
      var U = E1();
      let B;
      var H = k(U), oe = k(H), q = k(oe), E = k(q), le = P(q, 2), ne = k(le), Oe = P(le, 2), ge = k(Oe), W = P(oe, 4);
      {
        var Y = (N) => {
          var re = z1();
          K("click", re, () => d(u(A).id)), T(N, re);
        };
        L(W, (N) => {
          u(A).kind === "Execution" && !i() && N(Y);
        });
      }
      var F = P(W, 2), ae = P(F, 2);
      {
        var Qe = (N) => {
          var re = M1(), de = Ze(re), xe = k(de), Be = P(xe, 2), et = P(de, 2);
          K("click", xe, () => c(u(V), -1)), K("click", Be, () => c(u(V), 1)), K("click", et, () => h(u(A).id)), T(N, re);
        };
        L(ae, (N) => {
          i() || N(Qe);
        });
      }
      var ke = P(H, 2);
      {
        var Ne = (N) => {
          var re = W1(), de = k(re);
          Wd(de, {
            get adapter() {
              return e.adapter;
            },
            get module() {
              return u(A).module;
            },
            get version() {
              return u(A).version;
            },
            get disabled() {
              return i();
            },
            onVersion: (xe) => f(u(A).id, xe),
            get onViewSource() {
              return e.onViewSource;
            }
          }), T(N, re);
        };
        L(ke, (N) => {
          u(A).open && N(Ne);
        });
      }
      I(
        (N, re) => {
          B = Ee(U, 1, "layer svelte-94r51u", null, B, { hl: r() === u(A).id }), Fr(U, `margin-left: ${N ?? ""}px`), Tr(oe, "title", u(A).open ? "collapse" : "expand"), G(E, u(V) + 1), G(ne, u(A).title), G(ge, re);
        },
        [
          () => Math.min(u(V), 5) * 16 + 9,
          () => u(A).kind === "Execution" ? "execution · runner" : g(u(A))
        ]
      ), fo("mouseenter", U, () => {
        var N;
        return (N = e.onHighlight) == null ? void 0 : N.call(e, u(A).id);
      }), fo("mouseleave", U, () => {
        var N;
        return (N = e.onHighlight) == null ? void 0 : N.call(e, null);
      }), K("click", oe, () => O(u(A).id)), K("click", F, () => p(u(A).module)), T(Z, U);
    },
    (Z) => {
      var A = j1();
      T(Z, A);
    }
  );
  var z = P(j, 2);
  {
    var C = (Z) => {
      var A = G1(), V = Ze(A), U = k(V), B = P(V, 2);
      {
        var H = (oe) => {
          var q = D1(), E = k(q);
          Ke(E, 17, () => w, (Oe) => Oe.module, (Oe, ge) => {
            var W = V1(), Y = k(W), F = k(Y), ae = P(Y, 2), Qe = k(ae);
            I(() => {
              G(F, u(ge).label), G(Qe, u(ge).hint);
            }), K("click", W, () => l(u(ge).module)), T(Oe, W);
          });
          var le = P(E, 2);
          {
            var ne = (Oe) => {
              var ge = L1(), W = P(Ze(ge), 2);
              Ke(W, 16, () => u(S), (Y) => Y, (Y, F) => {
                var ae = Y1(), Qe = k(ae), ke = k(Qe);
                I(() => G(ke, F)), K("click", ae, () => l(F)), T(Y, ae);
              }), T(Oe, ge);
            };
            L(le, (Oe) => {
              u(S).length && Oe(ne);
            });
          }
          T(oe, q);
        };
        L(B, (oe) => {
          u(o) && oe(H);
        });
      }
      I((oe) => Fr(V, `margin-left: ${oe ?? ""}px`), [() => Math.min(u(s).length, 5) * 16 + 9]), K("click", U, () => x(o, !u(o))), T(Z, A);
    };
    L(z, (Z) => {
      i() || Z(C);
    });
  }
  I(() => {
    b = Ee(Q, 1, "stack svelte-94r51u", null, b, { disabled: i() }), G(M, e.project ?? "default");
  }), T(n, Q), xt();
}
zt(["click"]);
var N1 = /* @__PURE__ */ R('<div class="err mono svelte-dckg3z"> </div>'), B1 = /* @__PURE__ */ R("<span> </span>"), F1 = /* @__PURE__ */ R('<button class="go launch svelte-dckg3z"> <span class="arr svelte-dckg3z">▸</span></button>'), H1 = /* @__PURE__ */ R('<span class="stat mono svelte-dckg3z"><span class="spin svelte-dckg3z">◴</span> running…</span>'), J1 = /* @__PURE__ */ R('<button class="go stop svelte-dckg3z">Interrupt</button>'), K1 = /* @__PURE__ */ R("<!> <!>", 1), eQ = /* @__PURE__ */ R('<span class="stat ready mono svelte-dckg3z">✓ result cached</span>'), tQ = /* @__PURE__ */ R('<button class="go resume svelte-dckg3z">Resume</button>'), iQ = /* @__PURE__ */ R('<div><!> <div class="row svelte-dckg3z"><!> <!></div></div>');
function nQ(n, e) {
  kt(e, !0);
  let t = Le(e, "disabled", 3, !1), i = Le(e, "compact", 3, !1), r = Le(e, "launchLabel", 3, "Launch"), s = /* @__PURE__ */ D("draft"), o = /* @__PURE__ */ D(!1), a = /* @__PURE__ */ D(""), l = /* @__PURE__ */ D(void 0);
  function h(z, C) {
    var Z;
    x(s, z, !0), C && x(l, C, !0), (Z = e.onStatus) == null || Z.call(e, z, u(l));
  }
  Lt(() => {
    if (JSON.stringify(e.version), e.executionRef, f++, ks(() => u(s)) === "running") return;
    let z = !1;
    return e.adapter.find(e.module, e.version, { context: e.context, executionRef: e.executionRef }).then((C) => {
      z || h(C.status, C.executionRef);
    }), () => z = !0;
  });
  async function c() {
    var z;
    x(o, !0), x(a, "");
    try {
      const C = await e.adapter.dispatch(e.module, e.version, {
        context: e.context,
        execution: e.execution,
        executionRef: e.executionRef
      });
      h("running", C.executionRef), (z = e.onRun) == null || z.call(e, { executionRef: C.executionRef, startedAt: Date.now() }), O();
    } catch (C) {
      x(a, C instanceof Error ? C.message : String(C), !0);
    } finally {
      x(o, !1);
    }
  }
  let f = 0;
  async function O() {
    const z = ++f;
    for (; ; ) {
      if (await new Promise((C) => setTimeout(C, 600)), z !== f) return;
      try {
        const C = await e.adapter.find(e.module, e.version, { context: e.context, executionRef: e.executionRef });
        if (z !== f || (C.status !== "draft" && h(C.status, C.executionRef), C.status === "cached" || C.status === "failed")) return;
      } catch {
      }
    }
  }
  async function d() {
    u(l) && await e.adapter.interrupt(u(l));
  }
  var p = iQ();
  let g;
  var m = k(p);
  {
    var v = (z) => {
      var C = N1(), Z = k(C);
      I(() => G(Z, u(a))), T(z, C);
    };
    L(m, (z) => {
      u(a) && z(v);
    });
  }
  var w = P(m, 2), S = k(w);
  {
    var Q = (z) => {
      var C = B1(), Z = k(C);
      I(() => {
        Ee(C, 1, `badge ${u(s) ?? ""}`, "svelte-dckg3z"), G(Z, u(s));
      }), T(z, C);
    };
    L(S, (z) => {
      i() || z(Q);
    });
  }
  var b = P(S, 2);
  {
    var y = (z) => {
      var C = F1(), Z = k(C);
      I(() => {
        C.disabled = u(o) || t(), G(Z, `${r() ?? ""} `);
      }), K("click", C, c), T(z, C);
    }, $ = (z) => {
      var C = K1(), Z = Ze(C);
      {
        var A = (B) => {
          var H = H1();
          T(B, H);
        };
        L(Z, (B) => {
          i() || B(A);
        });
      }
      var V = P(Z, 2);
      {
        var U = (B) => {
          var H = J1();
          K("click", H, d), T(B, H);
        };
        L(V, (B) => {
          u(l) && B(U);
        });
      }
      T(z, C);
    }, M = (z) => {
      var C = nn(), Z = Ze(C);
      {
        var A = (V) => {
          var U = eQ();
          T(V, U);
        };
        L(Z, (V) => {
          i() || V(A);
        });
      }
      T(z, C);
    }, j = (z) => {
      var C = tQ();
      I(() => C.disabled = u(o)), K("click", C, c), T(z, C);
    };
    L(b, (z) => {
      u(s) === "draft" ? z(y) : u(s) === "running" ? z($, 1) : u(s) === "cached" ? z(M, 2) : (u(s) === "failed" || u(s) === "interrupted") && z(j, 3);
    });
  }
  I(() => g = Ee(p, 1, "lifecycle svelte-dckg3z", null, g, { compact: i() })), T(n, p), xt();
}
zt(["click"]);
var rQ = /* @__PURE__ */ R('<div class="empty mono svelte-1pahae8">loading provenance…</div>'), sQ = /* @__PURE__ */ R('<div class="empty mono svelte-1pahae8">no provenance recorded — not yet executed</div>'), oQ = /* @__PURE__ */ R('<span class="cargs svelte-1pahae8"> </span>'), aQ = /* @__PURE__ */ R('<div class="rline svelte-1pahae8"><span class="kw svelte-1pahae8">with</span> <span class="mod svelte-1pahae8"> </span> <!></div>'), lQ = /* @__PURE__ */ R('<div class="rline svelte-1pahae8"><span class="vparts svelte-1pahae8"> </span></div>'), hQ = /* @__PURE__ */ R('<span class="dirty mono svelte-1pahae8">dirty ●</span>'), cQ = /* @__PURE__ */ R('<span class="clean mono svelte-1pahae8">clean</span>'), fQ = /* @__PURE__ */ R('<button class="src mono svelte-1pahae8">view source ▸</button>'), uQ = /* @__PURE__ */ R('<div class="deps mono svelte-1pahae8"> </div>'), OQ = /* @__PURE__ */ R('<div class="erow mf svelte-1pahae8"><span class="mfk mono svelte-1pahae8">uses manifest</span> <span class="commit mono svelte-1pahae8"> </span> <!> <span class="espacer svelte-1pahae8"></span> <!></div> <!>', 1), dQ = /* @__PURE__ */ R('<div class="exec svelte-1pahae8"><div class="erow svelte-1pahae8"><span></span> <span class="est svelte-1pahae8"> </span> <span class="espacer svelte-1pahae8"></span> <span class="ets mono svelte-1pahae8"> </span></div> <!></div>'), pQ = /* @__PURE__ */ R('<div class="empty mono svelte-1pahae8">(not yet executed)</div>'), gQ = /* @__PURE__ */ R('<div class="trunc mono svelte-1pahae8">graph truncated · more layers hidden ▾</div>'), mQ = /* @__PURE__ */ R('<div class="sect svelte-1pahae8"><div class="cap mono svelte-1pahae8">RECIPE · config ⊕ context <span class="capsub svelte-1pahae8">— frozen</span></div> <div class="recipe mono svelte-1pahae8"><!> <div class="rline svelte-1pahae8"><span class="tgt svelte-1pahae8"> </span></div> <!></div></div> <div class="sect svelte-1pahae8"><div class="cap mono svelte-1pahae8">HISTORY · executions · newest first</div> <!></div> <!>', 1), vQ = /* @__PURE__ */ R('<div class="prov svelte-1pahae8"><!></div>');
function Ed(n, e) {
  kt(e, !0);
  let t = /* @__PURE__ */ D(null), i = /* @__PURE__ */ D(!1);
  Lt(() => {
    e.module, JSON.stringify(e.version), x(i, !1), x(t, null);
    let S = !1;
    return e.adapter.provenance(e.module, e.version).then((Q) => {
      S || (x(t, Q, !0), x(i, !0));
    }).catch(() => {
      S || x(i, !0);
    }), () => S = !0;
  });
  function r(S, Q) {
    return S.nodes.find((b) => b.uuid === Q);
  }
  function s(S, Q, b) {
    return S.links.filter((y) => y.source === Q && y.rel === b).map((y) => r(S, y.target)).filter((y) => !!y);
  }
  function o(S) {
    return S && typeof S == "object" ? S : {};
  }
  const a = /* @__PURE__ */ ue(() => u(t) ? r(u(t), u(t).root) : void 0), l = /* @__PURE__ */ ue(() => {
    var S;
    return o((S = u(a)) == null ? void 0 : S.attributes);
  }), h = /* @__PURE__ */ ue(() => {
    const S = u(l).context;
    return Array.isArray(S) ? S.map((Q) => {
      const b = o(Q);
      return {
        target: String(b.target ?? Q),
        version: Array.isArray(b.version) ? b.version : []
      };
    }) : [];
  }), c = /* @__PURE__ */ ue(() => {
    var Q;
    const S = o(u(l).config_layers);
    return Array.isArray(S.version) ? S.version : ((Q = u(a)) == null ? void 0 : Q.version) ?? [];
  }), f = /* @__PURE__ */ ue(() => u(t) ? s(u(t), u(t).root, "runs").map((S) => {
    const Q = o(S.attributes), b = s(u(t), S.uuid, "uses").find(($) => $.kind === "Manifest"), y = o(b == null ? void 0 : b.attributes);
    return {
      uuid: S.uuid,
      ts: typeof Q.timestamp == "number" ? Q.timestamp * 1e3 : void 0,
      status: typeof Q.status == "string" ? Q.status : void 0,
      commit: typeof y.commit == "string" ? y.commit : void 0,
      dirty: !!y.dirty,
      deps: Array.isArray(y.dependencies) ? y.dependencies.map(String) : []
    };
  }).sort((S, Q) => (Q.ts ?? 0) - (S.ts ?? 0)) : []);
  function O(S) {
    if (!S) return "";
    const Q = Math.max(0, (Date.now() - S) / 1e3);
    return Q < 60 ? "just now" : Q < 3600 ? `${Math.floor(Q / 60)}m ago` : Q < 86400 ? `${Math.floor(Q / 3600)}h ago` : `${Math.floor(Q / 86400)}d ago`;
  }
  async function d() {
    var S;
    try {
      const Q = await e.adapter.introspect(e.module);
      Q.sourceRef && ((S = e.onViewSource) == null || S.call(e, Q.sourceRef));
    } catch {
    }
  }
  var p = vQ(), g = k(p);
  {
    var m = (S) => {
      var Q = rQ();
      T(S, Q);
    }, v = (S) => {
      var Q = sQ();
      T(S, Q);
    }, w = (S) => {
      var Q = mQ(), b = Ze(Q), y = P(k(b), 2), $ = k(y);
      Ke($, 17, () => u(h), Kn, (oe, q, E) => {
        var le = aQ();
        Fr(le, `padding-left: ${E * 16}px`);
        var ne = P(k(le), 2), Oe = k(ne), ge = P(ne, 2);
        {
          var W = (F) => {
            var ae = oQ(), Qe = k(ae);
            I((ke) => G(Qe, ke), [() => Or(u(q).version).join(" ")]), T(F, ae);
          }, Y = /* @__PURE__ */ ue(() => Or(u(q).version).length);
          L(ge, (F) => {
            u(Y) && F(W);
          });
        }
        I(() => G(Oe, u(q).target)), T(oe, le);
      });
      var M = P($, 2), j = k(M), z = k(j), C = P(M, 2);
      {
        var Z = (oe) => {
          var q = lQ(), E = k(q), le = k(E);
          I(
            (ne) => {
              Fr(q, `padding-left: ${u(h).length * 16 + 12}px`), G(le, ne);
            },
            [() => Or(u(c)).join(" · ")]
          ), T(oe, q);
        }, A = /* @__PURE__ */ ue(() => Or(u(c)).length);
        L(C, (oe) => {
          u(A) && oe(Z);
        });
      }
      var V = P(b, 2), U = P(k(V), 2);
      Ke(
        U,
        17,
        () => u(f),
        (oe) => oe.uuid,
        (oe, q) => {
          var E = dQ(), le = k(E), ne = k(le);
          let Oe;
          var ge = P(ne, 2), W = k(ge), Y = P(ge, 4), F = k(Y), ae = P(le, 2);
          {
            var Qe = (ke) => {
              var Ne = OQ(), N = Ze(Ne), re = P(k(N), 2), de = k(re), xe = P(re, 2);
              {
                var Be = (we) => {
                  var Ve = hQ();
                  T(we, Ve);
                }, et = (we) => {
                  var Ve = cQ();
                  T(we, Ve);
                };
                L(xe, (we) => {
                  u(q).dirty ? we(Be) : we(et, -1);
                });
              }
              var _e = P(xe, 4);
              {
                var gt = (we) => {
                  var Ve = fQ();
                  K("click", Ve, d), T(we, Ve);
                };
                L(_e, (we) => {
                  e.onViewSource && we(gt);
                });
              }
              var Ge = P(N, 2);
              {
                var he = (we) => {
                  var Ve = uQ(), mt = k(Ve);
                  I((nt) => G(mt, `deps · ${nt ?? ""}`), [() => u(q).deps.join(" · ")]), T(we, Ve);
                };
                L(Ge, (we) => {
                  u(q).deps.length && we(he);
                });
              }
              I(() => G(de, u(q).commit)), T(ke, Ne);
            };
            L(ae, (ke) => {
              u(q).commit && ke(Qe);
            });
          }
          I(
            (ke) => {
              Oe = Ee(ne, 1, "edot svelte-1pahae8", null, Oe, { bad: u(q).status === "failed" }), G(W, u(q).status ?? "run"), G(F, ke);
            },
            [() => O(u(q).ts)]
          ), T(oe, E);
        },
        (oe) => {
          var q = pQ();
          T(oe, q);
        }
      );
      var B = P(V, 2);
      {
        var H = (oe) => {
          var q = gQ();
          T(oe, q);
        };
        L(B, (oe) => {
          u(t).truncated && oe(H);
        });
      }
      I(() => {
        Fr(M, `padding-left: ${u(h).length * 16}px`), G(z, u(a).module ?? e.module);
      }), T(S, Q);
    };
    L(g, (S) => {
      u(i) ? !u(t) || !u(a) ? S(v, 1) : S(w, -1) : S(m);
    });
  }
  T(n, p), xt();
}
zt(["click"]);
var QQ = /* @__PURE__ */ R('<div class="err mono svelte-83jdt3"> </div>'), bQ = /* @__PURE__ */ R('<span class="chip mono svelte-83jdt3"> <button class="x svelte-83jdt3">×</button></span>'), SQ = /* @__PURE__ */ R('<option class="svelte-83jdt3"> </option>'), yQ = /* @__PURE__ */ R('<div class="fform svelte-83jdt3"><input class="fp mono svelte-83jdt3" placeholder="config path — e.g. alpha"/> <select class="fo mono svelte-83jdt3"></select> <input class="fv mono svelte-83jdt3" placeholder="value"/> <button class="fadd svelte-83jdt3">add</button></div>'), kQ = /* @__PURE__ */ R('<button class="newrow svelte-83jdt3"><span class="newplus mono svelte-83jdt3">+</span> <span class="newmeta svelte-83jdt3"><span class="newname svelte-83jdt3">New run</span></span> <span class="chev svelte-83jdt3">›</span></button>'), xQ = /* @__PURE__ */ R('<button class="clear mono svelte-83jdt3">clear filters ×</button>'), wQ = /* @__PURE__ */ R('<div class="hint mono svelte-83jdt3">no runs yet</div>'), PQ = /* @__PURE__ */ R('<div class="nomatch svelte-83jdt3"><div class="nm mono svelte-83jdt3">0 runs match</div> <!></div>'), _Q = /* @__PURE__ */ R('<input class="rename mono svelte-83jdt3"/>'), TQ = /* @__PURE__ */ R('<button class="pen svelte-83jdt3" title="rename">✎</button>'), $Q = /* @__PURE__ */ R('<span class="lbl svelte-83jdt3"> </span> <!>', 1), ZQ = /* @__PURE__ */ R('<span class="ident mono svelte-83jdt3"> </span>'), RQ = /* @__PURE__ */ R('<span class="sp svelte-83jdt3"> </span>'), XQ = /* @__PURE__ */ R('<span class="more svelte-83jdt3"> </span>'), CQ = /* @__PURE__ */ R('<span class="more svelte-83jdt3">defaults</span>'), AQ = /* @__PURE__ */ R('<span class="git mono svelte-83jdt3"> </span>'), qQ = /* @__PURE__ */ R('<span class="meta svelte-83jdt3"> </span>'), zQ = /* @__PURE__ */ R('<div class="peekbody svelte-83jdt3"><!></div>'), MQ = /* @__PURE__ */ R('<div class="row svelte-83jdt3" role="button" tabindex="0"><div class="r1 svelte-83jdt3"><span></span> <!> <span class="spacer svelte-83jdt3"></span> <!> <span class="chev svelte-83jdt3">›</span></div> <div class="r2 mono svelte-83jdt3"><!> <!> <!></div> <div class="r3 svelte-83jdt3"><span> </span> <!> <!> <span class="meta svelte-83jdt3"> </span> <span class="spacer svelte-83jdt3"></span> <button class="peek mono svelte-83jdt3">⌥ provenance</button></div> <!></div>'), WQ = /* @__PURE__ */ R('<button class="morebtn mono svelte-83jdt3"> </button>'), EQ = /* @__PURE__ */ R('<div class="rows svelte-83jdt3"></div> <div class="foot mono svelte-83jdt3"><span class="svelte-83jdt3"> </span> <span class="spacer svelte-83jdt3"></span> <!></div>', 1), jQ = /* @__PURE__ */ R('<div class="cat svelte-83jdt3"><!> <div class="controls svelte-83jdt3"><div class="search svelte-83jdt3"><span class="mag svelte-83jdt3">⌕</span> <input placeholder="search config &amp; labels…" class="svelte-83jdt3"/></div> <div class="chips svelte-83jdt3"><!> <button class="addf mono svelte-83jdt3">+ facet</button> <span class="spacer svelte-83jdt3"></span> <label class="sort mono svelte-83jdt3">sort: <select class="svelte-83jdt3"><option class="svelte-83jdt3">newest</option><option class="svelte-83jdt3">oldest</option><option class="svelte-83jdt3">label</option></select></label></div> <!></div> <!> <!></div>');
function VQ(n, e) {
  kt(e, !0);
  const t = 20;
  let i = /* @__PURE__ */ D(""), r = /* @__PURE__ */ D(Je([])), s = /* @__PURE__ */ D("newest"), o = /* @__PURE__ */ D(Je([])), a = /* @__PURE__ */ D(0), l = /* @__PURE__ */ D(""), h = /* @__PURE__ */ D(!1);
  function c(N) {
    return {
      text: u(i).trim() || void 0,
      facets: u(r).length ? u(r) : void 0,
      sort: u(s) === "label" ? { by: "label", direction: "asc" } : {
        by: "created_at_ns",
        direction: u(s) === "newest" ? "desc" : "asc"
      },
      limit: t,
      offset: N
    };
  }
  async function f() {
    var N;
    x(l, "");
    try {
      const re = await e.adapter.list(c(0));
      x(o, re.items, !0), x(a, re.total, !0), (N = e.onTotal) == null || N.call(e, re.total);
    } catch (re) {
      x(l, re instanceof Error ? re.message : String(re), !0);
    }
  }
  async function O() {
    x(h, !0);
    try {
      const N = await e.adapter.list(c(u(o).length));
      x(o, [...u(o), ...N.items], !0), x(a, N.total, !0);
    } catch (N) {
      x(l, N instanceof Error ? N.message : String(N), !0);
    } finally {
      x(h, !1);
    }
  }
  Lt(() => {
    u(i), JSON.stringify(u(r)), u(s);
    const N = setTimeout(() => void f(), 200);
    return () => clearTimeout(N);
  });
  const d = [
    { op: "eq", label: "=" },
    { op: "ne", label: "≠" },
    { op: "lt", label: "<" },
    { op: "lte", label: "≤" },
    { op: "gt", label: ">" },
    { op: "gte", label: "≥" },
    { op: "contains", label: "⊃" }
  ];
  let p = /* @__PURE__ */ D(!1), g = /* @__PURE__ */ D(""), m = /* @__PURE__ */ D("eq"), v = /* @__PURE__ */ D("");
  function w() {
    if (!u(g).trim() || u(v) === "") return;
    const N = Number(u(v)), re = u(v).trim() !== "" && !Number.isNaN(N) ? N : u(v);
    x(
      r,
      [
        ...u(r),
        { path: u(g).trim(), op: u(m), value: re }
      ],
      !0
    ), x(g, ""), x(v, ""), x(m, "eq"), x(p, !1);
  }
  function S(N) {
    x(r, u(r).filter((re, de) => de !== N), !0);
  }
  function Q(N) {
    var de;
    const re = ((de = d.find((xe) => xe.op === N.op)) == null ? void 0 : de.label) ?? N.op;
    return `${N.path} ${re} ${typeof N.value == "string" ? N.value : JSON.stringify(N.value)}`;
  }
  function b(N) {
    var re;
    return (re = N.version) != null && re.length ? Or(N.version) : Object.entries(N.config).map(([de, xe]) => `${de}=${typeof xe == "string" ? xe : JSON.stringify(xe)}`);
  }
  function y(N) {
    if (!N) return "";
    const re = Math.max(0, (Date.now() - N) / 1e3);
    return re < 60 ? "just now" : re < 3600 ? `${Math.floor(re / 60)}m ago` : re < 86400 ? `${Math.floor(re / 3600)}h ago` : `${Math.floor(re / 86400)}d ago`;
  }
  let $ = /* @__PURE__ */ D(null), M = /* @__PURE__ */ D("");
  async function j(N) {
    const re = u(M).trim();
    if (x($, null), !(!re || re === N.label || !e.adapter.setLabel))
      try {
        await e.adapter.setLabel(N.uuid, re), await f();
      } catch (de) {
        x(l, de instanceof Error ? de.message : String(de), !0);
      }
  }
  let z = /* @__PURE__ */ D(
    null
    // uuid with the provenance peek open
  );
  var C = jQ(), Z = k(C);
  {
    var A = (N) => {
      var re = QQ(), de = k(re);
      I(() => G(de, u(l))), T(N, re);
    };
    L(Z, (N) => {
      u(l) && N(A);
    });
  }
  var V = P(Z, 2), U = k(V), B = P(k(U), 2), H = P(U, 2), oe = k(H);
  Ke(oe, 17, () => u(r), Kn, (N, re, de) => {
    var xe = bQ(), Be = k(xe), et = P(Be);
    I((_e) => G(Be, `${_e ?? ""} `), [() => Q(u(re))]), K("click", et, () => S(de)), T(N, xe);
  });
  var q = P(oe, 2), E = P(q, 4), le = P(k(E)), ne = k(le);
  ne.value = ne.__value = "newest";
  var Oe = P(ne);
  Oe.value = Oe.__value = "oldest";
  var ge = P(Oe);
  ge.value = ge.__value = "label";
  var W = P(H, 2);
  {
    var Y = (N) => {
      var re = yQ(), de = k(re), xe = P(de, 2);
      Ke(xe, 21, () => d, (_e) => _e.op, (_e, gt) => {
        var Ge = SQ(), he = k(Ge), we = {};
        I(() => {
          G(he, u(gt).label), we !== (we = u(gt).op) && (Ge.value = (Ge.__value = u(gt).op) ?? "");
        }), T(_e, Ge);
      });
      var Be = P(xe, 2), et = P(Be, 2);
      xn(de, () => u(g), (_e) => x(g, _e)), Hf(xe, () => u(m), (_e) => x(m, _e)), K("keydown", Be, (_e) => _e.key === "Enter" && w()), xn(Be, () => u(v), (_e) => x(v, _e)), K("click", et, w), T(N, re);
    };
    L(W, (N) => {
      u(p) && N(Y);
    });
  }
  var F = P(V, 2);
  {
    var ae = (N) => {
      var re = kQ();
      K("click", re, function(...de) {
        var xe;
        (xe = e.onNew) == null || xe.apply(this, de);
      }), T(N, re);
    };
    L(F, (N) => {
      e.onNew && N(ae);
    });
  }
  var Qe = P(F, 2);
  {
    var ke = (N) => {
      var re = PQ(), de = P(k(re), 2);
      {
        var xe = (et) => {
          var _e = xQ();
          K("click", _e, () => {
            x(r, [], !0), x(i, "");
          }), T(et, _e);
        }, Be = (et) => {
          var _e = wQ();
          T(et, _e);
        };
        L(de, (et) => {
          u(r).length || u(i) ? et(xe) : et(Be, -1);
        });
      }
      T(N, re);
    }, Ne = (N) => {
      var re = EQ(), de = Ze(re);
      Ke(de, 21, () => u(o), (Ge) => Ge.uuid, (Ge, he) => {
        var we = MQ(), Ve = k(we), mt = k(Ve);
        let nt;
        var zi = P(mt, 2);
        {
          var _s = (me) => {
            var Ce = _Q();
            Od(Ce), K("click", Ce, (tt) => tt.stopPropagation()), K("keydown", Ce, (tt) => {
              tt.stopPropagation(), tt.key === "Enter" && j(u(he)), tt.key === "Escape" && x($, null);
            }), fo("blur", Ce, () => void j(u(he))), xn(Ce, () => u(M), (tt) => x(M, tt)), T(me, Ce);
          }, Ts = (me) => {
            var Ce = $Q(), tt = Ze(Ce), ii = k(tt), Xl = P(tt, 2);
            {
              var J = (Se) => {
                var rt = TQ();
                K("click", rt, (wt) => {
                  wt.stopPropagation(), x($, u(he).uuid, !0), x(M, u(he).label ?? "", !0);
                }), T(Se, rt);
              };
              L(Xl, (Se) => {
                e.adapter.setLabel && Se(J);
              });
            }
            I(() => G(ii, u(he).label ?? u(he).module)), T(me, Ce);
          };
          L(zi, (me) => {
            u($) === u(he).uuid ? me(_s) : me(Ts, -1);
          });
        }
        var $s = P(zi, 4);
        {
          var Mi = (me) => {
            var Ce = ZQ(), tt = k(Ce);
            I(() => G(tt, `#${u(he).identity ?? ""}`)), T(me, Ce);
          };
          L($s, (me) => {
            u(he).identity && me(Mi);
          });
        }
        var xi = P(Ve, 2), Wi = k(xi);
        Ke(Wi, 17, () => b(u(he)).slice(0, 4), Kn, (me, Ce) => {
          var tt = RQ(), ii = k(tt);
          I(() => G(ii, u(Ce))), T(me, tt);
        });
        var sn = P(Wi, 2);
        {
          var on = (me) => {
            var Ce = XQ(), tt = k(Ce);
            I((ii) => G(tt, `+${ii ?? ""} more`), [() => b(u(he)).length - 4]), T(me, Ce);
          }, an = /* @__PURE__ */ ue(() => b(u(he)).length > 4);
          L(sn, (me) => {
            u(an) && me(on);
          });
        }
        var ze = P(sn, 2);
        {
          var Me = (me) => {
            var Ce = CQ();
            T(me, Ce);
          }, Ct = /* @__PURE__ */ ue(() => b(u(he)).length === 0);
          L(ze, (me) => {
            u(Ct) && me(Me);
          });
        }
        var Kt = P(xi, 2), wi = k(Kt), ln = k(wi), hn = P(wi, 2);
        {
          var zn = (me) => {
            var Ce = AQ(), tt = k(Ce);
            I(() => G(tt, `git ${u(he).manifest.commit ?? ""}${u(he).manifest.dirty ? "*" : ""}`)), T(me, Ce);
          };
          L(hn, (me) => {
            u(he).manifest && me(zn);
          });
        }
        var ei = P(hn, 2);
        {
          var Ei = (me) => {
            var Ce = qQ(), tt = k(Ce);
            I(() => G(tt, `${u(he).runCount ?? ""} runs`)), T(me, Ce);
          };
          L(ei, (me) => {
            u(he).runCount && u(he).runCount > 1 && me(Ei);
          });
        }
        var It = P(ei, 2), ti = k(It), Zs = P(It, 4), Rs = P(Kt, 2);
        {
          var Rl = (me) => {
            var Ce = zQ(), tt = k(Ce);
            {
              let ii = /* @__PURE__ */ ue(() => u(he).version ?? [u(he).config]);
              Ed(tt, {
                get adapter() {
                  return e.adapter;
                },
                get module() {
                  return u(he).module;
                },
                get version() {
                  return u(ii);
                }
              });
            }
            K("click", Ce, (ii) => ii.stopPropagation()), K("keydown", Ce, (ii) => ii.stopPropagation()), T(me, Ce);
          };
          L(Rs, (me) => {
            u(z) === u(he).uuid && me(Rl);
          });
        }
        I(
          (me) => {
            nt = Ee(mt, 1, `dot ${u(he).status ?? ""}`, "svelte-83jdt3", nt, { pulse: u(he).status === "running" }), Ee(wi, 1, `st ${u(he).status ?? ""}`, "svelte-83jdt3"), G(ln, u(he).status), G(ti, `${me ?? ""}${u(he).creator ? ` · ${u(he).creator}` : ""}`);
          },
          [() => y(u(he).createdAt)]
        ), K("click", we, () => {
          var me;
          return (me = e.onOpen) == null ? void 0 : me.call(e, u(he));
        }), K("keydown", we, (me) => {
          var Ce;
          return me.key === "Enter" && ((Ce = e.onOpen) == null ? void 0 : Ce.call(e, u(he)));
        }), K("click", Zs, (me) => {
          me.stopPropagation(), x(z, u(z) === u(he).uuid ? null : u(he).uuid, !0);
        }), T(Ge, we);
      });
      var xe = P(de, 2), Be = k(xe), et = k(Be), _e = P(Be, 4);
      {
        var gt = (Ge) => {
          var he = WQ(), we = k(he);
          I(() => {
            he.disabled = u(h), G(we, u(h) ? "loading…" : "load more ▾");
          }), K("click", he, O), T(Ge, he);
        };
        L(_e, (Ge) => {
          u(o).length < u(a) && Ge(gt);
        });
      }
      I(() => G(et, `1–${u(o).length ?? ""} of ${u(a) ?? ""}`)), T(N, re);
    };
    L(Qe, (N) => {
      u(o).length === 0 ? N(ke) : N(Ne, -1);
    });
  }
  xn(B, () => u(i), (N) => x(i, N)), K("click", q, () => x(p, !u(p))), Hf(le, () => u(s), (N) => x(s, N)), T(n, C), xt();
}
zt(["click", "keydown"]);
var YQ = /* @__PURE__ */ R('<span class="pulse svelte-1pj1gvc"></span>'), LQ = /* @__PURE__ */ R("<span><!> </span>");
function DQ(n, e) {
  const t = {
    draft: "DRAFT",
    running: "RUNNING",
    "running-looped": "RUNNING · LOOPED",
    cached: "CACHED",
    "cached-reuse": "CACHED · REUSE ↺",
    failed: "FAILED",
    interrupted: "INTERRUPTED",
    locked: "🔒 LOCKED"
  };
  var i = LQ(), r = k(i);
  {
    var s = (a) => {
      var l = YQ();
      T(a, l);
    };
    L(r, (a) => {
      (e.variant === "running" || e.variant === "running-looped") && a(s);
    });
  }
  var o = P(r);
  I(() => {
    Ee(i, 1, `badge ${e.variant ?? ""}`, "svelte-1pj1gvc"), G(o, ` ${t[e.variant] ?? ""}`);
  }), T(n, i);
}
var GQ = /* @__PURE__ */ R('<span class="ident mono svelte-195uv0s"> </span>'), IQ = /* @__PURE__ */ R('<span class="state mono bad svelte-195uv0s">✕ fix to launch</span>'), UQ = /* @__PURE__ */ R('<div class="issue mono svelte-195uv0s"> </div>'), NQ = /* @__PURE__ */ R('<div class="issues svelte-195uv0s"></div>'), BQ = /* @__PURE__ */ R('<div class="bar svelte-195uv0s"><div class="brow svelte-195uv0s"><!> <!> <!> <span class="spacer svelte-195uv0s"></span> <!></div> <!></div>');
function FQ(n, e) {
  kt(e, !0);
  let t = Le(e, "badge", 3, null), i = /* @__PURE__ */ D(""), r = /* @__PURE__ */ D(Je([]));
  Lt(() => {
    JSON.stringify(e.version), e.module;
    let m = !1;
    const v = setTimeout(
      () => {
        e.adapter.resolve(e.module, e.version).then((w) => {
          var S;
          m || (w.ok ? (x(i, w.identity ?? "", !0), x(r, [], !0)) : (x(i, ""), x(r, w.issues, !0)), (S = e.onResolved) == null || S.call(e, w));
        });
      },
      150
    );
    return () => {
      m = !0, clearTimeout(v);
    };
  });
  var s = BQ(), o = k(s), a = k(o);
  {
    var l = (m) => {
      DQ(m, {
        get variant() {
          return t();
        }
      });
    };
    L(a, (m) => {
      t() && m(l);
    });
  }
  var h = P(a, 2);
  {
    var c = (m) => {
      var v = GQ(), w = k(v);
      I(() => G(w, `#${u(i) ?? ""}`)), T(m, v);
    };
    L(h, (m) => {
      u(i) && m(c);
    });
  }
  var f = P(h, 2);
  {
    var O = (m) => {
      var v = IQ();
      T(m, v);
    };
    L(f, (m) => {
      u(r).length && m(O);
    });
  }
  var d = P(f, 4);
  _0(d, () => e.children ?? VO);
  var p = P(o, 2);
  {
    var g = (m) => {
      var v = NQ();
      Ke(v, 21, () => u(r), Kn, (w, S) => {
        var Q = UQ(), b = k(Q);
        I(() => G(b, `${u(S).path ? `${u(S).path} · ` : ""}${u(S).message ?? ""}`)), T(w, Q);
      }), T(m, v);
    };
    L(p, (m) => {
      u(r).length && m(g);
    });
  }
  T(n, s), xt();
}
var HQ = /* @__PURE__ */ R('<span role="note"> </span> ', 1), JQ = /* @__PURE__ */ R("<span> </span> ", 1), KQ = /* @__PURE__ */ R('<div class="cli mono svelte-1gjwari"><span class="cmd svelte-1gjwari">machinable get</span> <!><span class="tgtspan svelte-1gjwari"></span> <span class="launchflag svelte-1gjwari">--launch</span></div> <button class="copy mono svelte-1gjwari"> </button>', 1), eb = /* @__PURE__ */ R('<div class="cli mono dim svelte-1gjwari">resolving…</div>'), tb = /* @__PURE__ */ R('<div class="cliview svelte-1gjwari"><!></div>');
function ib(n, e) {
  kt(e, !0);
  let t = Le(e, "chain", 19, () => []), i = Le(e, "highlightId", 3, null);
  function r(g) {
    const m = [];
    let v = 0, w = null, S = "";
    for (const Q of g) {
      if (w) {
        S += Q, Q === w && (w = null);
        continue;
      }
      if (Q === "'" || Q === '"') {
        w = Q, S += Q;
        continue;
      }
      if ((Q === "[" || Q === "{" || Q === "(") && v++, (Q === "]" || Q === "}" || Q === ")") && v--, Q === " " && v === 0) {
        S && m.push(S), S = "";
        continue;
      }
      S += Q;
    }
    return S && m.push(S), m;
  }
  const s = /* @__PURE__ */ ue(() => e.cli.replace(/^machinable get /, "")), o = /* @__PURE__ */ ue(() => u(s) ? r(u(s)).map((g) => {
    let m = "plain";
    return g === e.module || g.endsWith(e.module) ? m = "mod" : g.startsWith("~") ? m = "tok" : g.includes("=") && (m = "kv"), { w: g, cls: m };
  }) : []);
  function a(g) {
    return [g.module, ...Or(g.version)].join(" ");
  }
  const l = /* @__PURE__ */ ue(() => [
    "machinable get",
    ...t().map(a),
    u(s),
    "--launch"
  ].filter(Boolean).join(" "));
  let h = /* @__PURE__ */ D(!1);
  async function c() {
    try {
      await navigator.clipboard.writeText(u(l)), x(h, !0), setTimeout(() => x(h, !1), 1200);
    } catch {
    }
  }
  var f = tb(), O = k(f);
  {
    var d = (g) => {
      var m = KQ(), v = Ze(m), w = P(k(v), 1, !0);
      w.nodeValue = " ";
      var S = P(w);
      Ke(S, 17, t, (M) => M.id, (M, j) => {
        var z = HQ(), C = Ze(z);
        let Z;
        var A = k(C), V = P(C, 1, !0);
        V.nodeValue = " ", I(
          (U) => {
            Z = Ee(C, 1, "ctxspan svelte-1gjwari", null, Z, { hl: i() === u(j).id }), G(A, U);
          },
          [() => a(u(j))]
        ), fo("mouseenter", C, () => {
          var U;
          return (U = e.onHighlight) == null ? void 0 : U.call(e, u(j).id);
        }), fo("mouseleave", C, () => {
          var U;
          return (U = e.onHighlight) == null ? void 0 : U.call(e, null);
        }), T(M, z);
      });
      var Q = P(S);
      Ke(Q, 21, () => u(o), Kn, (M, j, z) => {
        var C = JQ(), Z = Ze(C), A = k(Z), V = P(Z, 1, !0);
        I(() => {
          Ee(Z, 1, $0(u(j).cls), "svelte-1gjwari"), G(A, u(j).w), G(V, z < u(o).length - 1 ? " " : "");
        }), T(M, C);
      });
      var b = P(Q, 1, !0);
      b.nodeValue = " ";
      var y = P(v, 2), $ = k(y);
      I(() => G($, u(h) ? "copied ✓" : "copy ⧉")), K("click", y, c), T(g, m);
    }, p = (g) => {
      var m = eb();
      T(g, m);
    };
    L(O, (g) => {
      e.cli ? g(d) : g(p, -1);
    });
  }
  T(n, f), xt();
}
zt(["click"]);
var nb = /* @__PURE__ */ R('<button class="stop svelte-6u7gzy">Interrupt</button>'), rb = /* @__PURE__ */ R('<div class="note mono svelte-6u7gzy">identity <span class="hash svelte-6u7gzy"> </span> · new variant — not a cache hit</div>'), sb = /* @__PURE__ */ R('<div class="banner svelte-6u7gzy"><div class="row svelte-6u7gzy"><span class="spinner svelte-6u7gzy"></span> <div class="what svelte-6u7gzy"><span class="title svelte-6u7gzy">Job · dispatched to <span class="exec mono svelte-6u7gzy"> </span></span> <span class="sub mono svelte-6u7gzy"> </span></div> <!></div> <div class="track svelte-6u7gzy"><span class="fill svelte-6u7gzy"></span></div> <!></div>');
function ob(n, e) {
  kt(e, !0);
  let t = Le(e, "executionLabel", 3, "default execution"), i = /* @__PURE__ */ D(Je(Date.now()));
  Lt(() => {
    const v = setInterval(() => x(i, Date.now(), !0), 500);
    return () => clearInterval(v);
  });
  const r = /* @__PURE__ */ ue(() => {
    const v = Math.max(0, Math.floor((u(i) - e.startedAt) / 1e3)), w = String(Math.floor(v / 60)).padStart(2, "0"), S = String(v % 60).padStart(2, "0");
    return `${w}:${S}`;
  });
  var s = sb(), o = k(s), a = P(k(o), 2), l = k(a), h = P(k(l)), c = k(h), f = P(l, 2), O = k(f), d = P(a, 2);
  {
    var p = (v) => {
      var w = nb();
      K("click", w, function(...S) {
        var Q;
        (Q = e.onInterrupt) == null || Q.apply(this, S);
      }), T(v, w);
    };
    L(d, (v) => {
      e.onInterrupt && v(p);
    });
  }
  var g = P(o, 4);
  {
    var m = (v) => {
      var w = rb(), S = P(k(w)), Q = k(S);
      I(() => G(Q, `#${e.identity ?? ""}`)), T(v, w);
    };
    L(g, (v) => {
      e.identity && v(m);
    });
  }
  I(() => {
    G(c, t()), G(O, `polling · elapsed ${u(r) ?? ""}`);
  }), T(n, s), xt();
}
zt(["click"]);
var ab = /* @__PURE__ */ R('<span class="nick svelte-su2ghu"> </span>'), Dl = /* @__PURE__ */ R("<span> </span>"), lb = /* @__PURE__ */ R('<div class="trim mono svelte-su2ghu"> </div>'), hb = /* @__PURE__ */ R('<!> <pre class="log mono svelte-su2ghu"> </pre>', 1), cb = /* @__PURE__ */ R('<div class="run svelte-su2ghu"><div class="meta mono svelte-su2ghu"><!> <!> <span> </span> <!> <!> <span class="spacer svelte-su2ghu"></span> <button class="otoggle svelte-su2ghu"> </button></div> <!></div>');
function fb(n, e) {
  kt(e, !0);
  const t = 65536, i = 262144;
  let r = /* @__PURE__ */ D(null), s = /* @__PURE__ */ D(null), o = /* @__PURE__ */ D(0), a = 0, l = /* @__PURE__ */ D(!0), h = /* @__PURE__ */ D(Je(Date.now())), c = /* @__PURE__ */ D(null);
  async function f(w) {
    var S, Q;
    try {
      if (x(r, await ((Q = (S = e.adapter).runDetail) == null ? void 0 : Q.call(S, e.executionRef)) ?? null, !0), !e.adapter.runOutput) return;
      const b = w ? await e.adapter.runOutput(e.executionRef, { tail: t }) : await e.adapter.runOutput(e.executionRef, { offset: a });
      if (b.output === null && w) {
        x(s, null), x(o, 0), a = 0;
        return;
      }
      if (w || b.size < a)
        x(s, b.output ?? "", !0), x(o, b.offset, !0);
      else if (b.output) {
        let y = (u(s) ?? "") + b.output;
        y.length > i && (x(o, u(o) + (y.length - i)), y = y.slice(-i)), x(s, y, !0);
      }
      a = b.size, u(c) && (u(c).scrollTop = u(c).scrollHeight);
    } catch {
    }
  }
  let O = null;
  Lt(() => {
    e.executionRef, e.status;
    const w = O !== e.executionRef;
    if (O = e.executionRef, f(w), e.status !== "running") return;
    const S = setInterval(() => void f(!1), 1500), Q = setInterval(() => x(h, Date.now(), !0), 500);
    return () => {
      clearInterval(S), clearInterval(Q);
    };
  });
  function d(w) {
    if (!w) return "—";
    const S = new Date(w);
    return isNaN(S.getTime()) ? String(w) : S.toLocaleTimeString();
  }
  const p = /* @__PURE__ */ ue(() => {
    var y, $;
    const w = (y = u(r)) != null && y.startedAt ? new Date(u(r).startedAt).getTime() : NaN;
    if (isNaN(w)) return null;
    const S = ($ = u(r)) != null && $.finishedAt ? new Date(u(r).finishedAt).getTime() : u(h), Q = Math.max(0, (S - w) / 1e3);
    if (Q < 60) return `${Q.toFixed(1)}s`;
    const b = Math.floor(Q / 60);
    return `${b}m ${Math.round(Q - b * 60)}s`;
  });
  var g = nn(), m = Ze(g);
  {
    var v = (w) => {
      var S = cb(), Q = k(S), b = k(Q);
      {
        var y = (q) => {
          var E = ab(), le = k(E);
          I(() => G(le, u(r).nickname)), T(q, E);
        };
        L(b, (q) => {
          var E;
          (E = u(r)) != null && E.nickname && q(y);
        });
      }
      var $ = P(b, 2);
      {
        var M = (q) => {
          var E = Dl(), le = k(E);
          I(() => G(le, `seed ${u(r).seed ?? ""}`)), T(q, E);
        };
        L($, (q) => {
          var E;
          ((E = u(r)) == null ? void 0 : E.seed) !== void 0 && q(M);
        });
      }
      var j = P($, 2), z = k(j), C = P(j, 2);
      {
        var Z = (q) => {
          var E = Dl(), le = k(E);
          I((ne) => G(le, `finished ${ne ?? ""}`), [() => d(u(r).finishedAt)]), T(q, E);
        };
        L(C, (q) => {
          var E;
          (E = u(r)) != null && E.finishedAt && q(Z);
        });
      }
      var A = P(C, 2);
      {
        var V = (q) => {
          var E = Dl();
          let le;
          var ne = k(E);
          I(() => {
            le = Ee(E, 1, "rt svelte-su2ghu", null, le, { live: e.status === "running" }), G(ne, u(p));
          }), T(q, E);
        };
        L(A, (q) => {
          u(p) && q(V);
        });
      }
      var U = P(A, 4), B = k(U), H = P(Q, 2);
      {
        var oe = (q) => {
          var E = hb(), le = Ze(E);
          {
            var ne = (W) => {
              var Y = lb(), F = k(Y);
              I(() => G(F, `… earlier output trimmed (${u(o) ?? ""} bytes)`)), T(W, Y);
            };
            L(le, (W) => {
              u(o) > 0 && W(ne);
            });
          }
          var Oe = P(le, 2), ge = k(Oe);
          Cd(Oe, (W) => x(c, W), () => u(c)), I((W) => G(ge, W), [() => {
            var W;
            return ((W = u(s)) == null ? void 0 : W.trimEnd()) || "(no output)";
          }]), T(q, E);
        };
        L(H, (q) => {
          u(l) && q(oe);
        });
      }
      I(
        (q) => {
          G(z, `started ${q ?? ""}`), G(B, `${u(l) ? "▾" : "▸"} output`);
        },
        [() => {
          var q;
          return d((q = u(r)) == null ? void 0 : q.startedAt);
        }]
      ), K("click", U, () => x(l, !u(l))), T(w, S);
    };
    L(m, (w) => {
      e.adapter.runDetail && w(v);
    });
  }
  T(n, g), xt();
}
zt(["click"]);
var ub = /* @__PURE__ */ R('<span class="cyc mono svelte-1kkcsr9"><span></span> </span> <span class="cad mono svelte-1kkcsr9"> </span> <span class="spacer svelte-1kkcsr9"></span> <button class="btn svelte-1kkcsr9"> </button> <button class="btn svelte-1kkcsr9">Stop</button>', 1), Ob = /* @__PURE__ */ R('<div class="menu svelte-1kkcsr9"><button class="mopt mono svelte-1kkcsr9">Call</button> <button class="mopt mono svelte-1kkcsr9">Call every 2s</button> <button class="mopt mono svelte-1kkcsr9">Call every 5s</button></div>'), db = /* @__PURE__ */ R('<input class="minput mono svelte-1kkcsr9" placeholder="method — e.g. units"/> <span class="split svelte-1kkcsr9"><button class="btn main svelte-1kkcsr9" title="invoke once"> </button> <button class="btn caret svelte-1kkcsr9" title="call options" aria-label="call options">▾</button> <!></span>', 1), pb = /* @__PURE__ */ R('<div class="cerr mono svelte-1kkcsr9"> </div>'), gb = /* @__PURE__ */ R('<div class="call svelte-1kkcsr9"><div class="chead svelte-1kkcsr9"><span class="cap mono svelte-1kkcsr9"> </span> <span class="hint svelte-1kkcsr9"> </span></div> <div class="crow svelte-1kkcsr9"><!></div> <!></div>');
function mb(n, e) {
  kt(e, !0);
  let t = Le(e, "method", 3, ""), i = Le(e, "args", 19, () => ({})), r = Le(e, "cadenceMs", 3, 2e3), s = Le(e, "disabled", 3, !1), o = /* @__PURE__ */ D(Je(t())), a = /* @__PURE__ */ D(!1), l = /* @__PURE__ */ D(!1), h = /* @__PURE__ */ D(0), c = /* @__PURE__ */ D(!1), f = /* @__PURE__ */ D(""), O = /* @__PURE__ */ D(!1), d = /* @__PURE__ */ D(Je({ top: 0, right: 0 })), p = /* @__PURE__ */ D(Je(r()));
  function g(B) {
    if (!u(O)) {
      const H = B.currentTarget.getBoundingClientRect();
      x(d, { top: H.bottom + 4, right: window.innerWidth - H.right }, !0);
    }
    x(O, !u(O));
  }
  async function m() {
    var B;
    if (!(!u(o).trim() || u(c))) {
      x(c, !0), x(f, "");
      try {
        const H = await e.adapter.call(e.module, u(o).trim(), i(), e.version);
        x(h, u(h) + 1), (B = e.onResult) == null || B.call(e, H, { cycle: u(h), method: u(o).trim() });
      } catch (H) {
        x(f, H instanceof Error ? H.message : String(H), !0), S();
      } finally {
        x(c, !1);
      }
    }
  }
  let v = null;
  function w(B) {
    var H;
    u(o).trim() && (x(p, B, !0), x(a, !0), x(l, !1), x(h, 0), (H = e.onLoop) == null || H.call(e, !0), m(), v = setInterval(
      () => {
        u(l) || m();
      },
      B
    ));
  }
  function S() {
    var B;
    v && clearInterval(v), v = null, x(a, !1), x(l, !1), (B = e.onLoop) == null || B.call(e, !1);
  }
  Lt(() => () => {
    var B;
    v && clearInterval(v), u(a) && ((B = e.onLoop) == null || B.call(e, !1));
  });
  var Q = gb(), b = k(Q), y = k(b), $ = k(y), M = P(y, 2), j = k(M), z = P(b, 2), C = k(z);
  {
    var Z = (B) => {
      var H = ub(), oe = Ze(H), q = k(oe);
      let E;
      var le = P(q), ne = P(oe, 2), Oe = k(ne), ge = P(ne, 4), W = k(ge), Y = P(ge, 2);
      I(
        (F) => {
          E = Ee(q, 1, "dot svelte-1kkcsr9", null, E, { paused: u(l) }), G(le, `cycle ${u(h) ?? ""}`), G(Oe, `every ${F ?? ""}s`), G(W, u(l) ? "Resume" : "Pause");
        },
        [() => (u(p) / 1e3).toFixed(0)]
      ), K("click", ge, () => x(l, !u(l))), K("click", Y, S), T(B, H);
    }, A = (B) => {
      var H = db(), oe = Ze(H), q = P(oe, 2), E = k(q), le = k(E), ne = P(E, 2), Oe = P(ne, 2);
      {
        var ge = (W) => {
          var Y = Ob(), F = k(Y), ae = P(F, 2), Qe = P(ae, 2);
          I(() => Fr(Y, `top: ${u(d).top ?? ""}px; right: ${u(d).right ?? ""}px`)), K("click", F, () => {
            x(O, !1), m();
          }), K("click", ae, () => {
            x(O, !1), w(2e3);
          }), K("click", Qe, () => {
            x(O, !1), w(5e3);
          }), T(W, Y);
        };
        L(Oe, (W) => {
          u(O) && W(ge);
        });
      }
      I(
        (W, Y) => {
          oe.disabled = s(), E.disabled = W, G(le, u(c) ? "…" : "Call"), ne.disabled = Y;
        },
        [
          () => s() || u(c) || !u(o).trim(),
          () => s() || !u(o).trim()
        ]
      ), K("keydown", oe, (W) => W.key === "Enter" && m()), xn(oe, () => u(o), (W) => x(o, W)), K("click", E, m), K("click", ne, g), T(B, H);
    };
    L(C, (B) => {
      u(a) ? B(Z) : B(A, -1);
    });
  }
  var V = P(z, 2);
  {
    var U = (B) => {
      var H = pb(), oe = k(H);
      I(() => G(oe, u(f))), T(B, H);
    };
    L(V, (B) => {
      u(f) && B(U);
    });
  }
  I(() => {
    G($, `CALL${u(a) ? " · looped" : ""}`), G(j, u(a) ? "re-invokes live during a session" : "invoke a result accessor");
  }), T(n, Q), xt();
}
zt(["click", "keydown"]);
var vb = /* @__PURE__ */ R('<pre class="mono svelte-12h03ym"> </pre>'), Qb = /* @__PURE__ */ R('<div class="raw svelte-12h03ym"><button class="rawhead mono svelte-12h03ym"> </button> <!></div>'), bb = /* @__PURE__ */ R('<div class="empty svelte-12h03ym"><div class="ephead mono svelte-12h03ym"> </div></div>'), Sb = /* @__PURE__ */ R('<div class="slot svelte-12h03ym"><!></div>');
function yb(n, e) {
  kt(e, !0);
  let t = Le(e, "result", 3, null), i = Le(e, "waiting", 3, !1);
  const r = /* @__PURE__ */ ue(() => {
    var O;
    return (O = e.adapter.slots) == null ? void 0 : O.result;
  });
  let s = /* @__PURE__ */ D(!0);
  const o = /* @__PURE__ */ ue(() => {
    try {
      return JSON.stringify(t(), null, 2);
    } catch {
      return String(t());
    }
  });
  var a = Sb(), l = k(a);
  {
    var h = (O) => {
      var d = nn(), p = Ze(d);
      $d(p, () => u(r), (g, m) => {
        m(g, {
          get result() {
            return t();
          },
          get module() {
            return e.module;
          },
          get version() {
            return e.version;
          }
        });
      }), T(O, d);
    }, c = (O) => {
      var d = Qb(), p = k(d), g = k(p), m = P(p, 2);
      {
        var v = (w) => {
          var S = vb(), Q = k(S);
          I(() => G(Q, u(o))), T(w, S);
        };
        L(m, (w) => {
          u(s) && w(v);
        });
      }
      I(() => G(g, `${u(s) ? "▾" : "▸"} result`)), K("click", p, () => x(s, !u(s))), T(O, d);
    }, f = (O) => {
      var d = bb(), p = k(d), g = k(p);
      I(() => G(g, i() ? "waiting for the run…" : "no result read yet")), T(O, d);
    };
    L(l, (O) => {
      u(r) && t() !== null ? O(h) : t() !== null ? O(c, 1) : O(f, -1);
    });
  }
  T(n, a), xt();
}
zt(["click"]);
var kb = /* @__PURE__ */ R("<button> </button>"), xb = /* @__PURE__ */ R('<div class="syms svelte-15ml29j"></div>'), wb = /* @__PURE__ */ R('<div class="cerr mono svelte-15ml29j"> </div> <div class="chint svelte-15ml29j">The source API may be disabled or token-gated on this server (enable_source_api).</div>', 1), Pb = /* @__PURE__ */ R('<div class="cload mono svelte-15ml29j">loading source…</div>'), _b = /* @__PURE__ */ R('<div class="editor svelte-15ml29j"></div>'), Tb = /* @__PURE__ */ R('<div class="code svelte-15ml29j"><div class="chead svelte-15ml29j"><span class="mark mono svelte-15ml29j">&lt;/&gt; Code</span> <span class="path mono svelte-15ml29j"> </span> <span class="spacer svelte-15ml29j"></span> <span class="rotag mono svelte-15ml29j">read-only</span></div> <!> <!></div>');
function $b(n, e) {
  kt(e, !0);
  let t = /* @__PURE__ */ D(null), i = /* @__PURE__ */ D(""), r = /* @__PURE__ */ D(null), s = null;
  function o(Q) {
    const b = [], y = Q.split(`
`);
    return /^\s*(?:'''|""")/.test(y[0] ?? "") && b.push({ label: '"""doc', line: 1 }), y.forEach(($, M) => {
      const j = $.match(/^\s*class\s+(\w+)/);
      if (j) {
        b.push({ label: j[1], line: M + 1 });
        return;
      }
      const z = $.match(/^\s*def\s+(\w+)/);
      if (!z) return;
      const C = z[1];
      C === "__call__" ? b.push({ label: "__call__", line: M + 1 }) : C.startsWith("version_") ? b.push({ label: `~${C.slice(8)}`, line: M + 1 }) : C.startsWith("__") || b.push({ label: `${C}()`, line: M + 1 });
    }), b;
  }
  const a = /* @__PURE__ */ ue(() => u(t) ? o(u(t).content) : []);
  let l = /* @__PURE__ */ D(null);
  Lt(() => {
    if (e.path, x(t, null), x(i, ""), !e.adapter.readSource) {
      x(i, "this host has no source API");
      return;
    }
    let Q = !1;
    return e.adapter.readSource(e.path).then((b) => {
      Q || x(t, b, !0);
    }).catch((b) => {
      Q || x(i, b instanceof Error ? b.message : String(b), !0);
    }), () => Q = !0;
  }), Lt(() => {
    const Q = u(r), b = u(t);
    if (!Q || !b) return;
    let y = !1;
    return (async () => {
      const [$, M, j, z] = await Promise.all([
        Promise.resolve().then(() => Sx),
        Promise.resolve().then(() => bS),
        Promise.resolve().then(() => Aw),
        Promise.resolve().then(() => Mx)
      ]);
      if (y) return;
      const { EditorView: C, lineNumbers: Z, highlightActiveLine: A } = $, { EditorState: V } = M, { syntaxHighlighting: U, HighlightStyle: B } = j, { tags: H } = z, oe = b.language === "javascript" ? (await Promise.resolve().then(() => DP)).javascript() : (await Promise.resolve().then(() => sT)).python();
      if (y) return;
      const q = C.theme(
        {
          "&": {
            backgroundColor: "transparent",
            fontSize: "11.5px",
            height: "100%"
          },
          ".cm-scroller": { overflow: "auto" },
          ".cm-content": {
            fontFamily: "var(--font-mono, ui-monospace, monospace)",
            lineHeight: "1.7",
            caretColor: "transparent"
          },
          ".cm-gutters": {
            backgroundColor: "transparent",
            color: "#4f4a3f",
            border: "none"
          },
          ".cm-activeLine": { backgroundColor: "rgba(139, 160, 240, 0.07)" },
          ".cm-activeLineGutter": { backgroundColor: "transparent", color: "#8f8677" },
          "&.cm-focused": { outline: "none" }
        },
        { dark: !0 }
      ), E = B.define([
        {
          tag: [H.keyword, H.controlKeyword, H.definitionKeyword],
          color: "#c2569b"
        },
        { tag: [H.string, H.special(H.string)], color: "#7fc9a6" },
        { tag: [H.number, H.bool, H.null], color: "#e0a06a" },
        {
          tag: [
            H.function(H.variableName),
            H.function(H.definition(H.variableName))
          ],
          color: "#8ba0f0"
        },
        {
          tag: [H.definition(H.variableName), H.className],
          color: "#8ba0f0"
        },
        {
          tag: [H.comment, H.docString],
          color: "#8f8677",
          fontStyle: "italic"
        },
        { tag: [H.propertyName, H.attributeName], color: "#c9c0af" },
        { tag: H.self, color: "#c2a3d6" }
      ]);
      s == null || s.destroy(), s = new C({
        state: V.create({
          doc: b.content,
          extensions: [
            Z(),
            A(),
            oe,
            q,
            U(E),
            V.readOnly.of(!0),
            C.editable.of(!1),
            C.lineWrapping
          ]
        }),
        parent: Q
      }), e.line && h(e.line);
    })(), () => {
      y = !0, s == null || s.destroy(), s = null;
    };
  });
  function h(Q) {
    if (!s) return;
    const b = s.state.doc, y = Math.max(1, Math.min(Q, b.lines)), $ = b.line(y).from;
    s.dispatch({
      selection: { anchor: $ },
      effects: s.constructor.scrollIntoView ? s.constructor.scrollIntoView($, { y: "start", yMargin: 8 }) : void 0,
      scrollIntoView: !0
    }), x(l, y, !0);
  }
  var c = Tb(), f = k(c), O = P(k(f), 2), d = k(O), p = P(f, 2);
  {
    var g = (Q) => {
      var b = xb();
      Ke(b, 21, () => u(a), (y) => y.label + y.line, (y, $) => {
        var M = kb();
        let j;
        var z = k(M);
        I(() => {
          j = Ee(M, 1, "sym mono svelte-15ml29j", null, j, { on: u(l) === u($).line }), G(z, u($).label);
        }), K("click", M, () => h(u($).line)), T(y, M);
      }), T(Q, b);
    };
    L(p, (Q) => {
      u(a).length && Q(g);
    });
  }
  var m = P(p, 2);
  {
    var v = (Q) => {
      var b = wb(), y = Ze(b), $ = k(y);
      I(() => G($, u(i))), T(Q, b);
    }, w = (Q) => {
      var b = Pb();
      T(Q, b);
    }, S = (Q) => {
      var b = _b();
      Cd(b, (y) => x(r, y), () => u(r)), T(Q, b);
    };
    L(m, (Q) => {
      u(i) ? Q(v) : u(t) ? Q(S, -1) : Q(w, 1);
    });
  }
  I(() => G(d, e.path)), T(n, c), xt();
}
zt(["click"]);
var Zb = /* @__PURE__ */ R('<button class="back svelte-eqn6l9" title="back to runs">‹</button>'), Rb = /* @__PURE__ */ R('<span class="target mono svelte-eqn6l9"> </span>'), Xb = /* @__PURE__ */ R('<span class="server mono svelte-eqn6l9"> </span> <!>', 1), Cb = /* @__PURE__ */ R('<span class="server mono svelte-eqn6l9">not connected</span>'), Ab = /* @__PURE__ */ R('<span class="ro mono svelte-eqn6l9" title="Read-only — server widgets are not loaded">read-only</span>'), qb = /* @__PURE__ */ R('<span class="needs mono svelte-eqn6l9">NEEDS TRUST</span>'), zb = /* @__PURE__ */ R('<span class="ro mono svelte-eqn6l9"> </span>'), Mb = /* @__PURE__ */ R("<button> </button>"), Wb = /* @__PURE__ */ R('<!> <div class="hrow tabs svelte-eqn6l9"></div>', 1), Eb = /* @__PURE__ */ R(`<div class="trust svelte-eqn6l9"><div class="trow svelte-eqn6l9"><span class="bang svelte-eqn6l9">!</span> <span class="tq svelte-eqn6l9">Trust this server?</span></div> <p class="tp svelte-eqn6l9">Its widgets run <strong class="svelte-eqn6l9">as code in your session</strong>. Only trust servers you
							control. Read-only inspection stays available either way.</p> <div class="tbtns svelte-eqn6l9"><button class="go fill svelte-eqn6l9">Trust &amp; connect</button> <button class="go svelte-eqn6l9">Read-only</button></div></div>`), jb = /* @__PURE__ */ R('<button class="go fill svelte-eqn6l9"> </button>'), Vb = /* @__PURE__ */ R('<div class="err mono svelte-eqn6l9"> </div> <button class="retry mono svelte-eqn6l9">retry · check URL ▸</button>', 1), Yb = /* @__PURE__ */ R('<div class="connect svelte-eqn6l9"><input class="cinput mono svelte-eqn6l9" placeholder="server url, e.g. http://127.0.0.1:8000" aria-label="server url"/> <input class="cinput mono svelte-eqn6l9" type="password" placeholder="token · optional" aria-label="token"/> <!> <!></div>'), Lb = /* @__PURE__ */ R('<span class="mpkind mono svelte-eqn6l9"> </span>'), Db = /* @__PURE__ */ R('<span class="mpdoc svelte-eqn6l9"> </span>'), Gb = /* @__PURE__ */ R('<button class="mpick svelte-eqn6l9"><span class="mpname mono svelte-eqn6l9"> </span> <!> <!></button>'), Ib = /* @__PURE__ */ R('<div class="mpempty mono svelte-eqn6l9">no modules match</div>'), Ub = /* @__PURE__ */ R('<input class="mfilter mono svelte-eqn6l9" placeholder="find an interface…" aria-label="find an interface"/> <div class="mlist svelte-eqn6l9"></div>', 1), nu = /* @__PURE__ */ R('<div class="lockbar svelte-eqn6l9"><span class="lockmsg mono svelte-eqn6l9">🔒 cached · read-only</span> <button class="fork mono svelte-eqn6l9">Fork as new draft ▸</button></div>'), Nb = /* @__PURE__ */ R('<div class="resulthint mono svelte-eqn6l9"> </div>'), Bb = /* @__PURE__ */ R('<div class="resulthint mono svelte-eqn6l9">no run yet</div>'), Fb = /* @__PURE__ */ R('<div class="panel svelte-eqn6l9"><span class="nomod mono svelte-eqn6l9">no source declared for this module</span></div>'), Hb = /* @__PURE__ */ R('<div class="panel svelte-eqn6l9"><span class="nomod mono svelte-eqn6l9">resolving source…</span></div>'), Jb = /* @__PURE__ */ R("<!> <div><!> <!></div> <div><!> <!></div> <div><!> <!></div> <div><!></div> <div><!></div> <!> <!>", 1), Kb = /* @__PURE__ */ R('<div class="mach svelte-eqn6l9"><div class="head svelte-eqn6l9"><div class="hrow svelte-eqn6l9"><!> <span></span> <!> <span class="spacer svelte-eqn6l9"></span> <!> <!></div> <!></div> <div class="body svelte-eqn6l9"><!></div></div>');
function eS(n, e) {
  kt(e, !0);
  let t = Le(e, "defaultUrl", 3, "http://127.0.0.1:8000"), i = Le(e, "autoConnect", 3, !1), r = Le(e, "initialView", 3, null), s = Le(e, "initialTarget", 3, ""), o = Le(e, "initialVersion", 19, () => []), a = /* @__PURE__ */ D(Je(t())), l = /* @__PURE__ */ D(""), h = /* @__PURE__ */ D(!1), c = /* @__PURE__ */ D(!1), f = /* @__PURE__ */ D(!1), O = /* @__PURE__ */ D(Je([])), d = /* @__PURE__ */ D(Je([])), p = /* @__PURE__ */ D(""), g = /* @__PURE__ */ D(!1), m = /* @__PURE__ */ D(!1), v = /* @__PURE__ */ D(
    ""
    // inline diagnostic on the connect panel
  );
  async function w(J) {
    var Se, rt, wt, vt, Qt, ht, Pt, Oi;
    x(m, !0), x(v, ""), (Se = e.onError) == null || Se.call(e, null);
    try {
      const ye = await e.adapter.connect(u(a), u(l) || void 0, J);
      if (x(f, !!ye.needsTrust), ye.needsTrust) return;
      x(h, ye.connected, !0), x(c, !!ye.readOnly), x(O, ye.modules ?? [], !0), u(h) ? (console.info("[machinable] connected", u(a), `${u(O).length} module(s)`, u(c) ? "(read-only)" : ""), x(d, u(O).map((Ye) => ({ module: Ye })), !0), (wt = (rt = e.adapter).listModules) == null || wt.call(rt).then((Ye) => {
        Ye != null && Ye.length && x(d, Ye, !0);
      }), x(g, !1), (Qt = (vt = e.adapter).listSource) == null || Qt.call(vt).then(() => x(g, !0)).catch(() => {
      }), (ht = e.onConnect) == null || ht.call(e, u(a), u(O), u(c))) : (x(v, ye.message ?? "could not connect (no detail)", !0), console.warn("[machinable] connect failed —", u(a), u(v)), (Pt = e.onError) == null || Pt.call(e, `${u(a)}: ${u(v)}`));
    } catch (ye) {
      x(v, ye instanceof Error ? ye.message : String(ye), !0), console.error("[machinable] connect threw —", u(a), ye), (Oi = e.onError) == null || Oi.call(e, `${u(a)}: ${u(v)}`);
    } finally {
      x(m, !1);
    }
  }
  async function S() {
    await e.adapter.trust(u(a)), x(f, !1), await w();
  }
  let Q = !1;
  Lt(() => {
    !i() || Q || (Q = !0, w().then(() => {
      u(h) && (r() === "item" && s() ? (Ne(s(), o()), x(y, "item")) : x(y, "list"));
    }));
  });
  const b = /* @__PURE__ */ ue(() => u(a).replace(/^https?:\/\//, ""));
  let y = /* @__PURE__ */ D("list"), $ = /* @__PURE__ */ D("config");
  function M() {
    Ne(""), x(y, "item");
  }
  function j(J) {
    Ne(J.module, J.version ?? [J.config]), x(y, "item");
  }
  function z() {
    x(y, "list");
  }
  function C(J) {
    x($, J, !0), J === "code" && !u(_e) && he();
  }
  let Z = /* @__PURE__ */ D(""), A = /* @__PURE__ */ D(Je([])), V = /* @__PURE__ */ D(Je([])), U = /* @__PURE__ */ D(Je({})), B = /* @__PURE__ */ D(""), H = /* @__PURE__ */ D(""), oe = /* @__PURE__ */ D(!0), q = /* @__PURE__ */ D(Je([])), E = /* @__PURE__ */ D(Je({ context: [], chain: [] })), le = /* @__PURE__ */ D(null), ne = /* @__PURE__ */ D("draft"), Oe = /* @__PURE__ */ D(null), ge = /* @__PURE__ */ D(!1), W = /* @__PURE__ */ D(!1), Y = /* @__PURE__ */ D(null), F = /* @__PURE__ */ D(null), ae = /* @__PURE__ */ D(!1), Qe = /* @__PURE__ */ D(null), ke = null;
  function Ne(J, Se = []) {
    x(Z, J, !0), x(V, Se, !0), x(A, Se, !0), x(ne, "draft"), x(Oe, null), x(ge, !1), x(W, !1), x(Y, null), x(F, null), x(ae, !1), ke = null, x($, "config"), x(_e, null), x(gt, void 0), x(Ge, !1);
  }
  function N(J, Se) {
    var rt, wt, vt;
    x(ne, J, !0), Se && x(Oe, Se, !0), J === "running" ? x(ge, !0) : x(
      Y,
      null
      // the run ended (or never was) — drop the banner
    ), (rt = e.onStatus) == null || rt.call(e, J), ke === "running" && J === "cached" && ((wt = e.onCached) == null || wt.call(e, u(Z), u(U)), x(
      $,
      "result"
      // the run this session just completed — land on its payoff
    )), J === "cached" && ke === null && ((vt = e.onCached) == null || vt.call(e, u(
      Z
      // reopened cached
    ), u(U))), ke = J;
  }
  const re = /* @__PURE__ */ ue(() => u(ne) === "cached" && !u(ge)), de = /* @__PURE__ */ ue(() => u(ne) === "cached" && !u(W)), xe = /* @__PURE__ */ ue(() => u(ne) === "running" || u(de)), Be = /* @__PURE__ */ ue(() => !u(h) || !u(Z) || u(y) !== "item" ? null : u(ae) ? "running-looped" : u(re) ? "cached-reuse" : u(ne) === "interrupted" ? "interrupted" : u(ne)), et = /* @__PURE__ */ ue(() => {
    var J;
    return ((J = u(E).chain.find((Se) => Se.id === u(E).executionRef)) == null ? void 0 : J.title) ?? "default execution";
  });
  let _e = /* @__PURE__ */ D(null), gt = /* @__PURE__ */ D(void 0), Ge = /* @__PURE__ */ D(!1);
  async function he() {
    var J;
    x(Ge, !1);
    try {
      const Se = await e.adapter.introspect(u(Z));
      x(_e, ((J = Se.sourceRef) == null ? void 0 : J.path) ?? null, !0), x(Ge, !u(_e));
    } catch {
      x(Ge, !0);
    }
  }
  function we(J) {
    x(_e, J.path, !0), x(gt, J.line, !0), x(Ge, !1), x($, "code");
  }
  function Ve(J) {
    x(E, J, !0);
  }
  function mt(J) {
    x(le, J, !0);
  }
  function nt(J) {
    x(oe, J.ok, !0), x(q, J.ok ? [] : J.issues, !0), J.ok ? (x(U, J.config, !0), x(H, J.identity ?? "", !0), x(B, J.cli, !0)) : x(B, "");
  }
  function zi(J) {
    x(A, J, !0);
  }
  function _s(J) {
    x(Y, J, !0);
  }
  function Ts(J) {
    x(F, J, !0);
  }
  function $s(J) {
    x(ae, J, !0);
  }
  function Mi(J) {
    x(Qe, J, !0);
  }
  function xi() {
    u(Y) && e.adapter.interrupt(u(Y).executionRef);
  }
  const Wi = [
    { id: "config", label: "Config" },
    { id: "context", label: "Context" },
    { id: "result", label: "Result" },
    { id: "execution", label: "Execution" },
    { id: "cli", label: "CLI" },
    { id: "provenance", label: "Provenance" },
    { id: "code", label: "</> Code" }
  ], sn = /* @__PURE__ */ ue(() => Wi.filter((J) => J.id !== "code" || !!e.adapter.readSource && u(g)));
  var on = Kb(), an = k(on), ze = k(an), Me = k(ze);
  {
    var Ct = (J) => {
      var Se = Zb();
      K("click", Se, z), T(J, Se);
    };
    L(Me, (J) => {
      u(h) && u(y) === "item" && J(Ct);
    });
  }
  var Kt = P(Me, 2);
  let wi;
  var ln = P(Kt, 2);
  {
    var hn = (J) => {
      var Se = Xb(), rt = Ze(Se), wt = k(rt), vt = P(rt, 2);
      {
        var Qt = (ht) => {
          var Pt = Rb(), Oi = k(Pt);
          I(() => G(Oi, u(Z))), T(ht, Pt);
        };
        L(vt, (ht) => {
          u(y) === "item" && u(Z) && ht(Qt);
        });
      }
      I(() => {
        Tr(rt, "title", u(a)), G(wt, u(b));
      }), T(J, Se);
    }, zn = (J) => {
      var Se = Cb();
      T(J, Se);
    };
    L(ln, (J) => {
      u(h) ? J(hn) : J(zn, -1);
    });
  }
  var ei = P(ln, 4);
  {
    var Ei = (J) => {
      var Se = Ab();
      T(J, Se);
    };
    L(ei, (J) => {
      u(c) && u(h) && J(Ei);
    });
  }
  var It = P(ei, 2);
  {
    var ti = (J) => {
      var Se = qb();
      T(J, Se);
    }, Zs = (J) => {
      var Se = zb(), rt = k(Se);
      I(() => G(rt, `${u(Qe) ?? ""} run${u(Qe) === 1 ? "" : "s"}`)), T(J, Se);
    };
    L(It, (J) => {
      u(f) && !u(h) ? J(ti) : u(h) && u(y) === "list" && u(Qe) !== null && J(Zs, 1);
    });
  }
  var Rs = P(ze, 2);
  {
    var Rl = (J) => {
      var Se = Wb(), rt = Ze(Se);
      FQ(rt, {
        get adapter() {
          return e.adapter;
        },
        get module() {
          return u(Z);
        },
        get version() {
          return u(A);
        },
        get badge() {
          return u(Be);
        },
        onResolved: nt,
        children: (vt, Qt) => {
          {
            let ht = /* @__PURE__ */ ue(() => !u(oe));
            nQ(vt, {
              get adapter() {
                return e.adapter;
              },
              get module() {
                return u(Z);
              },
              get version() {
                return u(A);
              },
              get context() {
                return u(E).context;
              },
              get execution() {
                return u(E).execution;
              },
              get executionRef() {
                return u(E).executionRef;
              },
              compact: !0,
              get disabled() {
                return u(ht);
              },
              launchLabel: "Launch",
              onStatus: N,
              onRun: _s
            });
          }
        },
        $$slots: { default: !0 }
      });
      var wt = P(rt, 2);
      Ke(wt, 21, () => u(sn), (vt) => vt.id, (vt, Qt) => {
        var ht = Mb();
        let Pt;
        var Oi = k(ht);
        I(() => {
          Pt = Ee(ht, 1, "tab mono-if-code svelte-eqn6l9", null, Pt, { on: u($) === u(Qt).id }), G(Oi, u(Qt).label);
        }), K("click", ht, () => C(u(Qt).id)), T(vt, ht);
      }), T(J, Se);
    };
    L(Rs, (J) => {
      u(h) && u(y) === "item" && u(Z) && J(Rl);
    });
  }
  var me = P(an, 2), Ce = k(me);
  {
    var tt = (J) => {
      var Se = Yb(), rt = k(Se), wt = P(rt, 2), vt = P(wt, 2);
      {
        var Qt = (ye) => {
          var Ye = Eb(), ni = P(k(Ye), 4), ji = k(ni), Mn = P(ji, 2);
          I(() => {
            ji.disabled = u(m), Mn.disabled = u(m);
          }), K("click", ji, S), K("click", Mn, () => w({ readOnly: !0 })), T(ye, Ye);
        }, ht = (ye) => {
          var Ye = jb(), ni = k(Ye);
          I(() => {
            Ye.disabled = u(m), G(ni, u(m) ? "connecting…" : "Connect");
          }), K("click", Ye, () => w()), T(ye, Ye);
        };
        L(vt, (ye) => {
          u(f) ? ye(Qt) : ye(ht, -1);
        });
      }
      var Pt = P(vt, 2);
      {
        var Oi = (ye) => {
          var Ye = Vb(), ni = Ze(Ye), ji = k(ni), Mn = P(ni, 2);
          I(() => G(ji, u(v))), K("click", Mn, () => w()), T(ye, Ye);
        };
        L(Pt, (ye) => {
          u(v) && ye(Oi);
        });
      }
      I(() => {
        rt.disabled = u(m), wt.disabled = u(m);
      }), xn(rt, () => u(a), (ye) => x(a, ye)), xn(wt, () => u(l), (ye) => x(l, ye)), T(J, Se);
    }, ii = (J) => {
      VQ(J, {
        get adapter() {
          return e.adapter;
        },
        onNew: M,
        onOpen: j,
        onTotal: Mi
      });
    }, Xl = (J) => {
      var Se = nn(), rt = Ze(Se);
      {
        var wt = (Qt) => {
          var ht = Ub(), Pt = Ze(ht);
          Od(Pt);
          var Oi = P(Pt, 2);
          Ke(
            Oi,
            21,
            () => u(d).filter((ye) => !u(p) || ye.module.toLowerCase().includes(u(p).toLowerCase())),
            (ye) => ye.module,
            (ye, Ye) => {
              var ni = Gb(), ji = k(ni), Mn = k(ji), Er = P(ji, 2);
              {
                var Do = (cn) => {
                  var fn = Lb(), jr = k(fn);
                  I(() => G(jr, u(Ye).kind)), T(cn, fn);
                };
                L(Er, (cn) => {
                  u(Ye).kind && u(Ye).kind !== "Interface" && cn(Do);
                });
              }
              var Go = P(Er, 2);
              {
                var Cl = (cn) => {
                  var fn = Db(), jr = k(fn);
                  I((Io) => G(jr, Io), [() => u(Ye).doc.split(`
`)[0]]), T(cn, fn);
                };
                L(Go, (cn) => {
                  u(Ye).doc && cn(Cl);
                });
              }
              I(() => G(Mn, u(Ye).module)), K("click", ni, () => Ne(u(Ye).module)), T(ye, ni);
            },
            (ye) => {
              var Ye = Ib();
              T(ye, Ye);
            }
          ), xn(Pt, () => u(p), (ye) => x(p, ye)), T(Qt, ht);
        }, vt = (Qt) => {
          var ht = Jb(), Pt = Ze(ht);
          {
            var Oi = (Te) => {
              ob(Te, {
                get executionLabel() {
                  return u(et);
                },
                get identity() {
                  return u(H);
                },
                get startedAt() {
                  return u(Y).startedAt;
                },
                onInterrupt: xi
              });
            };
            L(Pt, (Te) => {
              u(ne) === "running" && u(Y) && Te(Oi);
            });
          }
          var ye = P(Pt, 2);
          let Ye;
          var ni = k(ye);
          {
            var ji = (Te) => {
              var bt = nu(), or = P(k(bt), 2);
              K("click", or, () => x(W, !0)), T(Te, bt);
            };
            L(ni, (Te) => {
              u(de) && Te(ji);
            });
          }
          var Mn = P(ni, 2);
          Wd(Mn, {
            get adapter() {
              return e.adapter;
            },
            get module() {
              return u(Z);
            },
            get version() {
              return u(V);
            },
            get issues() {
              return u(q);
            },
            get disabled() {
              return u(xe);
            },
            onVersion: zi,
            onViewSource: we
          });
          var Er = P(ye, 2);
          let Do;
          var Go = k(Er);
          {
            var Cl = (Te) => {
              var bt = nu(), or = P(k(bt), 2);
              K("click", or, () => x(W, !0)), T(Te, bt);
            };
            L(Go, (Te) => {
              u(de) && Te(Cl);
            });
          }
          var cn = P(Go, 2);
          U1(cn, {
            get adapter() {
              return e.adapter;
            },
            get modules() {
              return u(O);
            },
            get project() {
              return u(b);
            },
            get disabled() {
              return u(xe);
            },
            get highlightId() {
              return u(le);
            },
            onHighlight: mt,
            onChange: Ve,
            onViewSource: we
          });
          var fn = P(Er, 2);
          let jr;
          var Io = k(fn);
          {
            var zm = (Te) => {
              {
                let bt = /* @__PURE__ */ ue(() => u(ne) === "running");
                yb(Te, {
                  get adapter() {
                    return e.adapter;
                  },
                  get module() {
                    return u(Z);
                  },
                  get version() {
                    return u(A);
                  },
                  get result() {
                    return u(F);
                  },
                  get waiting() {
                    return u(bt);
                  }
                });
              }
            };
            L(Io, (Te) => {
              var bt;
              ((bt = e.adapter.slots) != null && bt.result || u(F) !== null) && Te(zm);
            });
          }
          var Mm = P(Io, 2);
          {
            var Wm = (Te) => {
              mb(Te, {
                get adapter() {
                  return e.adapter;
                },
                get module() {
                  return u(Z);
                },
                get version() {
                  return u(A);
                },
                onResult: Ts,
                onLoop: $s
              });
            }, Em = (Te) => {
              var bt = Nb(), or = k(bt);
              I(() => G(or, u(ne) === "running" ? "running…" : "no result yet — launch first")), T(Te, bt);
            };
            L(Mm, (Te) => {
              u(ne) === "cached" ? Te(Wm) : Te(Em, -1);
            });
          }
          var Al = P(fn, 2);
          let zf;
          var jm = k(Al);
          {
            var Vm = (Te) => {
              fb(Te, {
                get adapter() {
                  return e.adapter;
                },
                get executionRef() {
                  return u(Oe);
                },
                get status() {
                  return u(ne);
                }
              });
            }, Ym = (Te) => {
              var bt = Bb();
              T(Te, bt);
            };
            L(jm, (Te) => {
              u(Oe) ? Te(Vm) : Te(Ym, -1);
            });
          }
          var ql = P(Al, 2);
          let Mf;
          var Lm = k(ql);
          ib(Lm, {
            get cli() {
              return u(B);
            },
            get module() {
              return u(Z);
            },
            get chain() {
              return u(E).chain;
            },
            get highlightId() {
              return u(le);
            },
            onHighlight: mt
          });
          var Wf = P(ql, 2);
          {
            var Dm = (Te) => {
              Ed(Te, {
                get adapter() {
                  return e.adapter;
                },
                get module() {
                  return u(Z);
                },
                get version() {
                  return u(A);
                },
                onViewSource: we
              });
            };
            L(Wf, (Te) => {
              u($) === "provenance" && Te(Dm);
            });
          }
          var Gm = P(Wf, 2);
          {
            var Im = (Te) => {
              var bt = nn(), or = Ze(bt);
              {
                var Um = (un) => {
                  $b(un, {
                    get adapter() {
                      return e.adapter;
                    },
                    get path() {
                      return u(_e);
                    },
                    get line() {
                      return u(gt);
                    }
                  });
                }, Nm = (un) => {
                  var zl = Fb();
                  T(un, zl);
                }, Bm = (un) => {
                  var zl = Hb();
                  T(un, zl);
                };
                L(or, (un) => {
                  u(_e) ? un(Um) : u(Ge) ? un(Nm, 1) : un(Bm, -1);
                });
              }
              T(Te, bt);
            };
            L(Gm, (Te) => {
              u($) === "code" && Te(Im);
            });
          }
          I(() => {
            Ye = Ee(ye, 1, "pane svelte-eqn6l9", null, Ye, { off: u($) !== "config" }), Do = Ee(Er, 1, "pane svelte-eqn6l9", null, Do, { off: u($) !== "context" }), jr = Ee(fn, 1, "pane fill svelte-eqn6l9", null, jr, { off: u($) !== "result" }), zf = Ee(Al, 1, "pane svelte-eqn6l9", null, zf, { off: u($) !== "execution" }), Mf = Ee(ql, 1, "pane svelte-eqn6l9", null, Mf, { off: u($) !== "cli" });
          }), T(Qt, ht);
        };
        L(rt, (Qt) => {
          u(Z) ? Qt(vt, -1) : Qt(wt);
        });
      }
      T(J, Se);
    };
    L(Ce, (J) => {
      u(h) ? u(y) === "list" ? J(ii, 1) : J(Xl, -1) : J(tt);
    });
  }
  I(() => wi = Ee(Kt, 1, "dot svelte-eqn6l9", null, wi, {
    on: u(h),
    run: u(h) && u(ne) === "running"
  })), T(n, on), xt();
}
zt(["click"]);
class ru extends Error {
  constructor(t, i) {
    super(typeof i == "string" ? i : JSON.stringify(i));
    Mt(this, "status");
    Mt(this, "detail");
    this.status = t, this.detail = i;
  }
}
function Gl(n) {
  return { target: n.target, version: n.version ?? [] };
}
function tS(n) {
  if (n.endsWith(".py")) return "python";
  if (n.endsWith(".js") || n.endsWith(".mjs")) return "javascript";
  if (n.endsWith(".ts")) return "typescript";
  if (n.endsWith(".json")) return "json";
  if (n.endsWith(".yaml") || n.endsWith(".yml")) return "yaml";
  if (n.endsWith(".md")) return "markdown";
}
function jd(n, e) {
  let t = (n ?? "http://127.0.0.1:8000").replace(/\/+$/, ""), i = e;
  async function r(o, a = {}) {
    var c;
    const l = {};
    a.body !== void 0 && (l["Content-Type"] = "application/json"), i && (l.Authorization = `Bearer ${i}`);
    const h = await fetch(t + o, {
      method: a.method ?? (a.body !== void 0 ? "POST" : "GET"),
      headers: l,
      body: a.body !== void 0 ? JSON.stringify(a.body) : void 0
    });
    if (!h.ok) {
      let f = h.statusText;
      try {
        f = ((c = await h.json()) == null ? void 0 : c.detail) ?? f;
      } catch {
      }
      throw new ru(h.status, f);
    }
    if (h.status !== 204)
      return await h.json();
  }
  function s(o) {
    return o && typeof o == "object" && Array.isArray(o.issues) ? o.issues.map((a) => ({
      path: a.path ?? void 0,
      message: String(a.message ?? a)
    })) : [{ message: typeof o == "string" ? o : JSON.stringify(o) }];
  }
  return {
    connect: async (o, a) => {
      t = o.replace(/\/+$/, ""), i = a;
      try {
        await r("/v1/health");
        const l = await r(
          "/v1/project"
        );
        return {
          connected: !0,
          modules: (l.modules ?? []).map((h) => h.module),
          project: l.project
        };
      } catch (l) {
        return { connected: !1, message: l instanceof Error ? l.message : String(l) };
      }
    },
    // the default adapter trusts what you point it at; hosts with a security
    // gate (captu) implement their own trust store
    trust: async () => {
    },
    listModules: async () => ((await r(
      "/v1/project"
    )).modules ?? []).map((a) => ({
      module: a.module,
      kind: a.kind,
      doc: a.doc ?? void 0
    })),
    introspect: async (o) => {
      const a = await r(
        `/v1/project/${encodeURIComponent(o)}`
      );
      return E0(o, a);
    },
    resolve: async (o, a) => {
      try {
        const l = await r("/v1/interfaces/resolve", { body: { target: o, version: a } });
        return {
          ok: !0,
          config: l.config,
          cli: l.cli,
          predicate: l.predicate,
          identity: Kf(l.predicate ?? l.config)
        };
      } catch (l) {
        if (l instanceof ru && l.status === 400) return { ok: !1, issues: s(l.detail) };
        throw l;
      }
    },
    dispatch: async (o, a, l) => {
      const h = {
        interfaces: [
          { target: o, version: a, context: ((l == null ? void 0 : l.context) ?? []).map(Gl) }
        ]
      };
      return l != null && l.execution && (h.execution = Gl(l.execution)), l != null && l.executionRef && (h.execution_ref = l.executionRef), { executionRef: (await r("/v1/executions", { body: h })).uuid };
    },
    find: async (o, a, l) => {
      const h = await r("/v1/interfaces/lifecycle", {
        body: { target: o, version: a, context: ((l == null ? void 0 : l.context) ?? []).map(Gl) }
      });
      return {
        status: h.status,
        uuid: h.uuid ?? void 0,
        executionRef: h.execution_uuid ?? void 0
      };
    },
    interrupt: async (o) => {
      await r(`/v1/executions/${encodeURIComponent(o)}/cancel`, {
        method: "POST"
      });
    },
    runDetail: async (o) => {
      const a = await r(
        `/v1/executions/${encodeURIComponent(o)}`
      );
      return {
        uuid: a.uuid,
        nickname: a.nickname ?? void 0,
        seed: a.seed ?? void 0,
        startedAt: a.started_at ?? null,
        finishedAt: a.finished_at ?? null,
        heartbeatAt: a.heartbeat_at ?? null,
        active: a.is_active ?? void 0,
        finished: a.is_finished ?? void 0
      };
    },
    runOutput: async (o, a) => {
      const l = new URLSearchParams();
      (a == null ? void 0 : a.offset) !== void 0 && l.set("offset", String(a.offset)), (a == null ? void 0 : a.tail) !== void 0 && l.set("tail", String(a.tail)), (a == null ? void 0 : a.limit) !== void 0 && l.set("limit", String(a.limit));
      const h = l.size ? `?${l}` : "";
      return r(
        `/v1/executions/${encodeURIComponent(o)}/output${h}`
      );
    },
    call: async (o, a, l, h) => (await r("/v1/interfaces/call", {
      body: { target: o, version: h, method: a, args: [], kwargs: l }
    })).payload,
    list: async (o) => {
      var f, O;
      const a = {
        limit: (o == null ? void 0 : o.limit) ?? 50,
        offset: (o == null ? void 0 : o.offset) ?? 0,
        // per-hit compute status + run count (server derives from the latest run)
        include_status: !0
      };
      o != null && o.module && (a.module = o.module), (f = o == null ? void 0 : o.facets) != null && f.length && (a.config = {
        filters: o.facets.map((d) => ({ path: d.path, op: d.op, value: d.value }))
      }), a.sort = o != null && o.sort ? [
        {
          by: o.sort.by,
          direction: o.sort.direction ?? "desc",
          ...o.sort.configPath ? { config_layer: "resolved" } : {}
        }
      ] : [{ by: "created_at_ns", direction: "desc" }];
      const l = await r(
        "/v1/interfaces/search",
        { body: a }
      );
      let h = l.items.map((d) => ({
        uuid: d.id,
        module: d.module ?? "",
        config: d.config ?? {},
        version: d.version ?? void 0,
        identity: Kf(d.config ?? {}),
        status: d.status ?? "draft",
        executionRef: d.execution_uuid ?? void 0,
        label: d.label ?? void 0,
        createdAt: d.created_at_ns ? Math.floor(d.created_at_ns / 1e6) : void 0,
        creator: d.created_by ?? void 0,
        runCount: d.run_count ?? void 0
      }));
      const c = (O = o == null ? void 0 : o.text) == null ? void 0 : O.trim().toLowerCase();
      return c && (h = h.filter(
        (d) => `${d.label ?? ""} ${d.module} ${d.uuid}`.toLowerCase().includes(c)
      )), { items: h, total: l.total };
    },
    setLabel: async (o, a) => {
      await r(`/v1/interfaces/${encodeURIComponent(o)}/label`, {
        method: "PATCH",
        body: { label: a }
      });
    },
    provenance: async (o, a) => {
      const l = await r("/v1/interfaces/lifecycle", {
        body: { target: o, version: a }
      });
      return l.uuid ? r(
        `/v1/interfaces/${encodeURIComponent(l.uuid)}/provenance`
      ) : null;
    },
    listSource: async () => (await r("/v1/source")).files ?? [],
    readSource: async (o) => {
      const a = await r(
        `/v1/source/${o}`
      );
      return { path: a.path, content: a.content, etag: a.etag, language: tS(a.path) };
    }
  };
}
function Vd(n, e = {}) {
  const t = e.adapter ?? jd(e.url, e.token), i = S0(eS, {
    target: n,
    props: {
      adapter: t,
      defaultUrl: e.url ?? "http://127.0.0.1:8000",
      autoConnect: !!e.view,
      initialView: e.view ?? null,
      initialTarget: e.target ?? "",
      initialVersion: e.version ?? []
    }
  });
  return { unmount: () => void k0(i) };
}
function iS({ model: n, el: e }) {
  const t = (r) => typeof (n == null ? void 0 : n.get) == "function" ? n.get(r) ?? void 0 : void 0;
  e.style.height || (e.style.height = t("height") ?? "440px");
  const i = Vd(e, {
    url: t("url"),
    token: t("token"),
    view: t("view"),
    target: t("target"),
    version: t("version")
  });
  return () => i.unmount();
}
const lT = { render: iS, mount: Vd, createAdapter: jd };
let Wh = [], Yd = [];
(() => {
  let n = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((e) => e ? parseInt(e, 36) : 1);
  for (let e = 0, t = 0; e < n.length; e++)
    (e % 2 ? Yd : Wh).push(t = t + n[e]);
})();
function nS(n) {
  if (n < 768) return !1;
  for (let e = 0, t = Wh.length; ; ) {
    let i = e + t >> 1;
    if (n < Wh[i]) t = i;
    else if (n >= Yd[i]) e = i + 1;
    else return !0;
    if (e == t) return !1;
  }
}
function su(n) {
  return n >= 127462 && n <= 127487;
}
const ou = 8205;
function rS(n, e, t = !0, i = !0) {
  return (t ? Ld : sS)(n, e, i);
}
function Ld(n, e, t) {
  if (e == n.length) return e;
  e && Dd(n.charCodeAt(e)) && Gd(n.charCodeAt(e - 1)) && e--;
  let i = Il(n, e);
  for (e += au(i); e < n.length; ) {
    let r = Il(n, e);
    if (i == ou || r == ou || t && nS(r))
      e += au(r), i = r;
    else if (su(r)) {
      let s = 0, o = e - 2;
      for (; o >= 0 && su(Il(n, o)); )
        s++, o -= 2;
      if (s % 2 == 0) break;
      e += 2;
    } else
      break;
  }
  return e;
}
function sS(n, e, t) {
  for (; e > 1; ) {
    let i = Ld(n, e - 2, t);
    if (i < e) return i;
    e--;
  }
  return 0;
}
function Il(n, e) {
  let t = n.charCodeAt(e);
  if (!Gd(t) || e + 1 == n.length) return t;
  let i = n.charCodeAt(e + 1);
  return Dd(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function Dd(n) {
  return n >= 56320 && n < 57344;
}
function Gd(n) {
  return n >= 55296 && n < 56320;
}
function au(n) {
  return n < 65536 ? 1 : 2;
}
let je = class Id {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, t, i) {
    [e, t] = ds(this, e, t);
    let r = [];
    return this.decompose(
      0,
      e,
      r,
      2
      /* Open.To */
    ), i.length && i.decompose(
      0,
      i.length,
      r,
      3
      /* Open.To */
    ), this.decompose(
      t,
      this.length,
      r,
      1
      /* Open.From */
    ), Ui.from(r, this.length - (t - e) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, t = this.length) {
    [e, t] = ds(this, e, t);
    let i = [];
    return this.decompose(e, t, i, 0), Ui.from(i, t - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let t = this.scanIdentical(e, 1), i = this.length - this.scanIdentical(e, -1), r = new Ks(this), s = new Ks(e);
    for (let o = t, a = t; ; ) {
      if (r.next(o), s.next(o), o = 0, r.lineBreak != s.lineBreak || r.done != s.done || r.value != s.value)
        return !1;
      if (a += r.value.length, r.done || a >= i)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new Ks(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, t = this.length) {
    return new Ud(this, e, t);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, t) {
    let i;
    if (e == null)
      i = this.iter();
    else {
      t == null && (t = this.lines + 1);
      let r = this.line(e).from;
      i = this.iterRange(r, Math.max(r, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
    }
    return new Nd(i);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? Id.empty : e.length <= 32 ? new ct(e) : Ui.from(ct.split(e, []));
  }
};
class ct extends je {
  constructor(e, t = oS(e)) {
    super(), this.text = e, this.length = t;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, t, i, r) {
    for (let s = 0; ; s++) {
      let o = this.text[s], a = r + o.length;
      if ((t ? i : a) >= e)
        return new Bd(r, a, i, o);
      r = a + 1, i++;
    }
  }
  decompose(e, t, i, r) {
    let s = e <= 0 && t >= this.length ? this : new ct(lu(this.text, e, t), Math.min(t, this.length) - Math.max(0, e));
    if (r & 1) {
      let o = i.pop(), a = Sa(s.text, o.text.slice(), 0, s.length);
      if (a.length <= 32)
        i.push(new ct(a, o.length + s.length));
      else {
        let l = a.length >> 1;
        i.push(new ct(a.slice(0, l)), new ct(a.slice(l)));
      }
    } else
      i.push(s);
  }
  replace(e, t, i) {
    if (!(i instanceof ct))
      return super.replace(e, t, i);
    [e, t] = ds(this, e, t);
    let r = Sa(this.text, Sa(i.text, lu(this.text, 0, e)), t), s = this.length + i.length - (t - e);
    return r.length <= 32 ? new ct(r, s) : Ui.from(ct.split(r, []), s);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = ds(this, e, t);
    let r = "";
    for (let s = 0, o = 0; s <= t && o < this.text.length; o++) {
      let a = this.text[o], l = s + a.length;
      s > e && o && (r += i), e < l && t > s && (r += a.slice(Math.max(0, e - s), t - s)), s = l + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.text)
      e.push(t);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, t) {
    let i = [], r = -1;
    for (let s of e)
      i.push(s), r += s.length + 1, i.length == 32 && (t.push(new ct(i, r)), i = [], r = -1);
    return r > -1 && t.push(new ct(i, r)), t;
  }
}
class Ui extends je {
  constructor(e, t) {
    super(), this.children = e, this.length = t, this.lines = 0;
    for (let i of e)
      this.lines += i.lines;
  }
  lineInner(e, t, i, r) {
    for (let s = 0; ; s++) {
      let o = this.children[s], a = r + o.length, l = i + o.lines - 1;
      if ((t ? l : a) >= e)
        return o.lineInner(e, t, i, r);
      r = a + 1, i = l + 1;
    }
  }
  decompose(e, t, i, r) {
    for (let s = 0, o = 0; o <= t && s < this.children.length; s++) {
      let a = this.children[s], l = o + a.length;
      if (e <= l && t >= o) {
        let h = r & ((o <= e ? 1 : 0) | (l >= t ? 2 : 0));
        o >= e && l <= t && !h ? i.push(a) : a.decompose(e - o, t - o, i, h);
      }
      o = l + 1;
    }
  }
  replace(e, t, i) {
    if ([e, t] = ds(this, e, t), i.lines < this.lines)
      for (let r = 0, s = 0; r < this.children.length; r++) {
        let o = this.children[r], a = s + o.length;
        if (e >= s && t <= a) {
          let l = o.replace(e - s, t - s, i), h = this.lines - o.lines + l.lines;
          if (l.lines < h >> 4 && l.lines > h >> 6) {
            let c = this.children.slice();
            return c[r] = l, new Ui(c, this.length - (t - e) + i.length);
          }
          return super.replace(s, a, l);
        }
        s = a + 1;
      }
    return super.replace(e, t, i);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = ds(this, e, t);
    let r = "";
    for (let s = 0, o = 0; s < this.children.length && o <= t; s++) {
      let a = this.children[s], l = o + a.length;
      o > e && s && (r += i), e < l && t > o && (r += a.sliceString(e - o, t - o, i)), o = l + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.children)
      t.flatten(e);
  }
  scanIdentical(e, t) {
    if (!(e instanceof Ui))
      return 0;
    let i = 0, [r, s, o, a] = t > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; r += t, s += t) {
      if (r == o || s == a)
        return i;
      let l = this.children[r], h = e.children[s];
      if (l != h)
        return i + l.scanIdentical(h, t);
      i += l.length + 1;
    }
  }
  static from(e, t = e.reduce((i, r) => i + r.length + 1, -1)) {
    let i = 0;
    for (let d of e)
      i += d.lines;
    if (i < 32) {
      let d = [];
      for (let p of e)
        p.flatten(d);
      return new ct(d, t);
    }
    let r = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), s = r << 1, o = r >> 1, a = [], l = 0, h = -1, c = [];
    function f(d) {
      let p;
      if (d.lines > s && d instanceof Ui)
        for (let g of d.children)
          f(g);
      else d.lines > o && (l > o || !l) ? (O(), a.push(d)) : d instanceof ct && l && (p = c[c.length - 1]) instanceof ct && d.lines + p.lines <= 32 ? (l += d.lines, h += d.length + 1, c[c.length - 1] = new ct(p.text.concat(d.text), p.length + 1 + d.length)) : (l + d.lines > r && O(), l += d.lines, h += d.length + 1, c.push(d));
    }
    function O() {
      l != 0 && (a.push(c.length == 1 ? c[0] : Ui.from(c, h)), h = -1, l = c.length = 0);
    }
    for (let d of e)
      f(d);
    return O(), a.length == 1 ? a[0] : new Ui(a, t);
  }
}
je.empty = /* @__PURE__ */ new ct([""], 0);
function oS(n) {
  let e = -1;
  for (let t of n)
    e += t.length + 1;
  return e;
}
function Sa(n, e, t = 0, i = 1e9) {
  for (let r = 0, s = 0, o = !0; s < n.length && r <= i; s++) {
    let a = n[s], l = r + a.length;
    l >= t && (l > i && (a = a.slice(0, i - r)), r < t && (a = a.slice(t - r)), o ? (e[e.length - 1] += a, o = !1) : e.push(a)), r = l + 1;
  }
  return e;
}
function lu(n, e, t) {
  return Sa(n, [""], e, t);
}
class Ks {
  constructor(e, t = 1) {
    this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof ct ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, t) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, r = this.nodes[i], s = this.offsets[i], o = s >> 1, a = r instanceof ct ? r.text.length : r.children.length;
      if (o == (t > 0 ? a : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        t > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((s & 1) == (t > 0 ? 0 : 1)) {
        if (this.offsets[i] += t, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (r instanceof ct) {
        let l = r.text[o + (t < 0 ? -1 : 0)];
        if (this.offsets[i] += t, l.length > Math.max(0, e))
          return this.value = e == 0 ? l : t > 0 ? l.slice(e) : l.slice(0, l.length - e), this;
        e -= l.length;
      } else {
        let l = r.children[o + (t < 0 ? -1 : 0)];
        e > l.length ? (e -= l.length, this.offsets[i] += t) : (t < 0 && this.offsets[i]--, this.nodes.push(l), this.offsets.push(t > 0 ? 1 : (l instanceof ct ? l.text.length : l.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class Ud {
  constructor(e, t, i) {
    this.value = "", this.done = !1, this.cursor = new Ks(e, t > i ? -1 : 1), this.pos = t > i ? e.length : 0, this.from = Math.min(t, i), this.to = Math.max(t, i);
  }
  nextInner(e, t) {
    if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
    let i = t < 0 ? this.pos - this.from : this.to - this.pos;
    e > i && (e = i), i -= e;
    let { value: r } = this.cursor.next(e);
    return this.pos += (r.length + e) * t, this.value = r.length <= i ? r : t < 0 ? r.slice(r.length - i) : r.slice(0, i), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class Nd {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: t, lineBreak: i, value: r } = this.inner.next(e);
    return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = r, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (je.prototype[Symbol.iterator] = function() {
  return this.iter();
}, Ks.prototype[Symbol.iterator] = Ud.prototype[Symbol.iterator] = Nd.prototype[Symbol.iterator] = function() {
  return this;
});
class Bd {
  /**
  @internal
  */
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.number = i, this.text = r;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function ds(n, e, t) {
  return e = Math.max(0, Math.min(n.length, e)), [e, Math.max(e, Math.min(n.length, t))];
}
function bi(n, e, t = !0, i = !0) {
  return rS(n, e, t, i);
}
function aS(n) {
  return n >= 56320 && n < 57344;
}
function lS(n) {
  return n >= 55296 && n < 56320;
}
function Lc(n, e) {
  let t = n.charCodeAt(e);
  if (!lS(t) || e + 1 == n.length)
    return t;
  let i = n.charCodeAt(e + 1);
  return aS(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function hS(n) {
  return n <= 65535 ? String.fromCharCode(n) : (n -= 65536, String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
}
function Fd(n) {
  return n < 65536 ? 1 : 2;
}
const Eh = /\r\n?|\n/;
var Zt = /* @__PURE__ */ (function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
})(Zt || (Zt = {}));
class Ki {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2)
      e += this.sections[t];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t + 1];
      e += i < 0 ? this.sections[t] : i;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let t = 0, i = 0, r = 0; t < this.sections.length; ) {
      let s = this.sections[t++], o = this.sections[t++];
      o < 0 ? (e(i, r, s), r += s) : r += o, i += s;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, t = !1) {
    jh(this, e, t);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], r = this.sections[t++];
      r < 0 ? e.push(i, r) : e.push(r, i);
    }
    return new Ki(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : Hd(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `this` happened before the ones in `other`.
  */
  mapDesc(e, t = !1) {
    return e.empty ? this : Vh(this, e, t);
  }
  mapPos(e, t = -1, i = Zt.Simple) {
    let r = 0, s = 0;
    for (let o = 0; o < this.sections.length; ) {
      let a = this.sections[o++], l = this.sections[o++], h = r + a;
      if (l < 0) {
        if (h > e)
          return s + (e - r);
        s += a;
      } else {
        if (i != Zt.Simple && h >= e && (i == Zt.TrackDel && r < e && h > e || i == Zt.TrackBefore && r < e || i == Zt.TrackAfter && h > e))
          return null;
        if (h > e || h == e && t < 0 && !a)
          return e == r || t < 0 ? s : s + l;
        s += l;
      }
      r = h;
    }
    if (e > r)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${r}`);
    return s;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, t = e) {
    for (let i = 0, r = 0; i < this.sections.length && r <= t; ) {
      let s = this.sections[i++], o = this.sections[i++], a = r + s;
      if (o >= 0 && r <= t && a >= e)
        return r < e && a > t ? "cover" : !0;
      r = a;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], r = this.sections[t++];
      e += (e ? " " : "") + i + (r >= 0 ? ":" + r : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((t) => typeof t != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new Ki(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new Ki(e);
  }
}
class Ot extends Ki {
  constructor(e, t) {
    super(e), this.inserted = t;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return jh(this, (t, i, r, s, o) => e = e.replace(r, r + (i - t), o), !1), e;
  }
  mapDesc(e, t = !1) {
    return Vh(this, e, t, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let t = this.sections.slice(), i = [];
    for (let r = 0, s = 0; r < t.length; r += 2) {
      let o = t[r], a = t[r + 1];
      if (a >= 0) {
        t[r] = a, t[r + 1] = o;
        let l = r >> 1;
        for (; i.length < l; )
          i.push(je.empty);
        i.push(o ? e.slice(s, s + o) : je.empty);
      }
      s += o;
    }
    return new Ot(t, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : Hd(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, t = !1) {
    return e.empty ? this : Vh(this, e, t, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, t = !1) {
    jh(this, e, t);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return Ki.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let t = [], i = [], r = [], s = new uo(this);
    e: for (let o = 0, a = 0; ; ) {
      let l = o == e.length ? 1e9 : e[o++];
      for (; a < l || a == l && s.len == 0; ) {
        if (s.done)
          break e;
        let c = Math.min(s.len, l - a);
        At(r, c, -1);
        let f = s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0;
        At(t, c, f), f > 0 && In(i, t, s.text), s.forward(c), a += c;
      }
      let h = e[o++];
      for (; a < h; ) {
        if (s.done)
          break e;
        let c = Math.min(s.len, h - a);
        At(t, c, -1), At(r, c, s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0), s.forward(c), a += c;
      }
    }
    return {
      changes: new Ot(t, i),
      filtered: Ki.create(r)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t], r = this.sections[t + 1];
      r < 0 ? e.push(i) : r == 0 ? e.push([i]) : e.push([i].concat(this.inserted[t >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, t, i) {
    let r = [], s = [], o = 0, a = null;
    function l(c = !1) {
      if (!c && !r.length)
        return;
      o < t && At(r, t - o, -1);
      let f = new Ot(r, s);
      a = a ? a.compose(f.map(a)) : f, r = [], s = [], o = 0;
    }
    function h(c) {
      if (Array.isArray(c))
        for (let f of c)
          h(f);
      else if (c instanceof Ot) {
        if (c.length != t)
          throw new RangeError(`Mismatched change set length (got ${c.length}, expected ${t})`);
        l(), a = a ? a.compose(c.map(a)) : c;
      } else {
        let { from: f, to: O = f, insert: d } = c;
        if (f > O || f < 0 || O > t)
          throw new RangeError(`Invalid change range ${f} to ${O} (in doc of length ${t})`);
        let p = d ? typeof d == "string" ? je.of(d.split(i || Eh)) : d : je.empty, g = p.length;
        if (f == O && g == 0)
          return;
        f < o && l(), f > o && At(r, f - o, -1), At(r, O - f, g), In(s, r, p), o = O;
      }
    }
    return h(e), l(!a), a;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new Ot(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let t = [], i = [];
    for (let r = 0; r < e.length; r++) {
      let s = e[r];
      if (typeof s == "number")
        t.push(s, -1);
      else {
        if (!Array.isArray(s) || typeof s[0] != "number" || s.some((o, a) => a && typeof o != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (s.length == 1)
          t.push(s[0], 0);
        else {
          for (; i.length < r; )
            i.push(je.empty);
          i[r] = je.of(s.slice(1)), t.push(s[0], i[r].length);
        }
      }
    }
    return new Ot(t, i);
  }
  /**
  @internal
  */
  static createSet(e, t) {
    return new Ot(e, t);
  }
}
function At(n, e, t, i = !1) {
  if (e == 0 && t <= 0)
    return;
  let r = n.length - 2;
  r >= 0 && t <= 0 && t == n[r + 1] ? n[r] += e : r >= 0 && e == 0 && n[r] == 0 ? n[r + 1] += t : i ? (n[r] += e, n[r + 1] += t) : n.push(e, t);
}
function In(n, e, t) {
  if (t.length == 0)
    return;
  let i = e.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(t);
  else {
    for (; n.length < i; )
      n.push(je.empty);
    n.push(t);
  }
}
function jh(n, e, t) {
  let i = n.inserted;
  for (let r = 0, s = 0, o = 0; o < n.sections.length; ) {
    let a = n.sections[o++], l = n.sections[o++];
    if (l < 0)
      r += a, s += a;
    else {
      let h = r, c = s, f = je.empty;
      for (; h += a, c += l, l && i && (f = f.append(i[o - 2 >> 1])), !(t || o == n.sections.length || n.sections[o + 1] < 0); )
        a = n.sections[o++], l = n.sections[o++];
      e(r, h, s, c, f), r = h, s = c;
    }
  }
}
function Vh(n, e, t, i = !1) {
  let r = [], s = i ? [] : null, o = new uo(n), a = new uo(e);
  for (let l = -1; ; ) {
    if (o.done && a.len || a.done && o.len)
      throw new Error("Mismatched change set lengths");
    if (o.ins == -1 && a.ins == -1) {
      let h = Math.min(o.len, a.len);
      At(r, h, -1), o.forward(h), a.forward(h);
    } else if (a.ins >= 0 && (o.ins < 0 || l == o.i || o.off == 0 && (a.len < o.len || a.len == o.len && !t))) {
      let h = a.len;
      for (At(r, a.ins, -1); h; ) {
        let c = Math.min(o.len, h);
        o.ins >= 0 && l < o.i && o.len <= c && (At(r, 0, o.ins), s && In(s, r, o.text), l = o.i), o.forward(c), h -= c;
      }
      a.next();
    } else if (o.ins >= 0) {
      let h = 0, c = o.len;
      for (; c; )
        if (a.ins == -1) {
          let f = Math.min(c, a.len);
          h += f, c -= f, a.forward(f);
        } else if (a.ins == 0 && a.len < c)
          c -= a.len, a.next();
        else
          break;
      At(r, h, l < o.i ? o.ins : 0), s && l < o.i && In(s, r, o.text), l = o.i, o.forward(o.len - c);
    } else {
      if (o.done && a.done)
        return s ? Ot.createSet(r, s) : Ki.create(r);
      throw new Error("Mismatched change set lengths");
    }
  }
}
function Hd(n, e, t = !1) {
  let i = [], r = t ? [] : null, s = new uo(n), o = new uo(e);
  for (let a = !1; ; ) {
    if (s.done && o.done)
      return r ? Ot.createSet(i, r) : Ki.create(i);
    if (s.ins == 0)
      At(i, s.len, 0, a), s.next();
    else if (o.len == 0 && !o.done)
      At(i, 0, o.ins, a), r && In(r, i, o.text), o.next();
    else {
      if (s.done || o.done)
        throw new Error("Mismatched change set lengths");
      {
        let l = Math.min(s.len2, o.len), h = i.length;
        if (s.ins == -1) {
          let c = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
          At(i, l, c, a), r && c && In(r, i, o.text);
        } else o.ins == -1 ? (At(i, s.off ? 0 : s.len, l, a), r && In(r, i, s.textBit(l))) : (At(i, s.off ? 0 : s.len, o.off ? 0 : o.ins, a), r && !o.off && In(r, i, o.text));
        a = (s.ins > l || o.ins >= 0 && o.len > l) && (a || i.length > h), s.forward2(l), o.forward(l);
      }
    }
  }
}
class uo {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, t = this.i - 2 >> 1;
    return t >= e.length ? je.empty : e[t];
  }
  textBit(e) {
    let { inserted: t } = this.set, i = this.i - 2 >> 1;
    return i >= t.length && !e ? je.empty : t[i].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class yn {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.flags = i, this.goalColumn = r;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  A flag that, when set, makes some selection-extending commands
  treat the range's head and anchor as exchangeable, so that for
  example Shift-ArrowUp will make the lower side of the selection
  the anchor, even if that was the head before. Used to implement
  MacOS-style undirectional selections.
  */
  get undirectional() {
    return (this.flags & 64) > 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, t = -1) {
    let i, r;
    return this.empty ? i = r = e.mapPos(this.from, t) : (i = e.mapPos(this.from, 1), r = e.mapPos(this.to, -1)), i == this.from && r == this.to ? this : new yn(i, r, this.flags, this.goalColumn);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, t = e, i = 0) {
    if (e <= this.anchor && t >= this.anchor)
      return te.range(e, t, void 0, void 0, i);
    let r = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
    return te.range(this.anchor, r, void 0, void 0, i);
  }
  /**
  Compare this range to another range.
  */
  eq(e, t = !1) {
    return this.anchor == e.anchor && this.head == e.head && this.goalColumn == e.goalColumn && (!t || !this.empty || this.assoc == e.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return te.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, t, i, r) {
    return new yn(e, t, i, r);
  }
}
class te {
  constructor(e, t) {
    this.ranges = e, this.mainIndex = t;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, t = -1) {
    return e.empty ? this : te.create(this.ranges.map((i) => i.map(e, t)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(e, t = !1) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let i = 0; i < this.ranges.length; i++)
      if (!this.ranges[i].eq(e.ranges[i], t))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new te([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, t = !0) {
    return te.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, t = this.mainIndex) {
    let i = this.ranges.slice();
    return i[t] = e, te.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new te(e.ranges.map((t) => yn.fromJSON(t)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, t = e) {
    return new te([te.range(e, t)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, t = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, r = 0; r < e.length; r++) {
      let s = e[r];
      if (s.empty ? s.from <= i : s.from < i)
        return te.normalized(e.slice(), t);
      i = s.to;
    }
    return new te(e, t);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, t = 0, i, r) {
    return yn.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (i == null ? 7 : Math.min(6, i)), r);
  }
  /**
  Create a selection range.
  */
  static range(e, t, i, r, s) {
    let o = r == null ? 7 : Math.min(6, r);
    return !s && e != t && (s = t < e ? 1 : -1), s && (o |= s < 0 ? 8 : 16), t < e ? yn.create(t, e, o | 32, i) : yn.create(e, t, o, i);
  }
  /**
  Create an [undirectional](https://codemirror.net/6/docs/ref/#state.SelectionRange.undirectional)
  selection range.
  */
  static undirectionalRange(e, t) {
    return yn.create(e, t, 64, void 0);
  }
  /**
  @internal
  */
  static normalized(e, t = 0) {
    let i = e[t];
    e.sort((r, s) => r.from - s.from), t = e.indexOf(i);
    for (let r = 1; r < e.length; r++) {
      let s = e[r], o = e[r - 1];
      if (s.empty ? s.from <= o.to : s.from < o.to) {
        let a = o.from, l = Math.max(s.to, o.to);
        r <= t && t--, e.splice(--r, 2, s.anchor > s.head ? te.range(l, a) : te.range(a, l));
      }
    }
    return new te(e, t);
  }
}
function Jd(n, e) {
  for (let t of n.ranges)
    if (t.to > e)
      throw new RangeError("Selection points outside of document");
}
let Dc = 0;
class se {
  constructor(e, t, i, r, s) {
    this.combine = e, this.compareInput = t, this.compare = i, this.isStatic = r, this.id = Dc++, this.default = e([]), this.extensions = typeof s == "function" ? s(this) : s;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new se(e.combine || ((t) => t), e.compareInput || ((t, i) => t === i), e.compare || (e.combine ? (t, i) => t === i : Gc), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new ya([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new ya(e, this, 1, t);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new ya(e, this, 2, t);
  }
  from(e, t) {
    return t || (t = (i) => i), this.compute([e], (i) => t(i.field(e)));
  }
}
function Gc(n, e) {
  return n == e || n.length == e.length && n.every((t, i) => t === e[i]);
}
class ya {
  constructor(e, t, i, r) {
    this.dependencies = e, this.facet = t, this.type = i, this.value = r, this.id = Dc++;
  }
  dynamicSlot(e) {
    var t;
    let i = this.value, r = this.facet.compareInput, s = this.id, o = e[s] >> 1, a = this.type == 2, l = !1, h = !1, c = [];
    for (let f of this.dependencies)
      f == "doc" ? l = !0 : f == "selection" ? h = !0 : (((t = e[f.id]) !== null && t !== void 0 ? t : 1) & 1) == 0 && c.push(e[f.id]);
    return {
      create(f) {
        return f.values[o] = i(f), 1;
      },
      update(f, O) {
        if (l && O.docChanged || h && (O.docChanged || O.selection) || Yh(f, c)) {
          let d = i(f);
          if (a ? !hu(d, f.values[o], r) : !r(d, f.values[o]))
            return f.values[o] = d, 1;
        }
        return 0;
      },
      reconfigure: (f, O) => {
        let d, p = O.config.address[s];
        if (p != null) {
          let g = La(O, p);
          if (this.dependencies.every((m) => m instanceof se ? O.facet(m) === f.facet(m) : m instanceof ui ? O.field(m, !1) == f.field(m, !1) : !0) || (a ? hu(d = i(f), g, r) : r(d = i(f), g)))
            return f.values[o] = g, 0;
        } else
          d = i(f);
        return f.values[o] = d, 1;
      }
    };
  }
  get extension() {
    return this;
  }
}
function hu(n, e, t) {
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!t(n[i], e[i]))
      return !1;
  return !0;
}
function Yh(n, e) {
  let t = !1;
  for (let i of e)
    eo(n, i) & 1 && (t = !0);
  return t;
}
function cS(n, e, t) {
  let i = t.map((l) => n[l.id]), r = t.map((l) => l.type), s = i.filter((l) => !(l & 1)), o = n[e.id] >> 1;
  function a(l) {
    let h = [];
    for (let c = 0; c < i.length; c++) {
      let f = La(l, i[c]);
      if (r[c] == 2)
        for (let O of f)
          h.push(O);
      else
        h.push(f);
    }
    return e.combine(h);
  }
  return {
    create(l) {
      for (let h of i)
        eo(l, h);
      return l.values[o] = a(l), 1;
    },
    update(l, h) {
      if (!Yh(l, s))
        return 0;
      let c = a(l);
      return e.compare(c, l.values[o]) ? 0 : (l.values[o] = c, 1);
    },
    reconfigure(l, h) {
      let c = Yh(l, i), f = h.config.facets[e.id], O = h.facet(e);
      if (f && !c && Gc(t, f))
        return l.values[o] = O, 0;
      let d = a(l);
      return e.compare(d, O) ? (l.values[o] = O, 0) : (l.values[o] = d, 1);
    }
  };
}
const Bo = /* @__PURE__ */ se.define({ static: !0 });
class ui {
  constructor(e, t, i, r, s) {
    this.id = e, this.createF = t, this.updateF = i, this.compareF = r, this.spec = s, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let t = new ui(Dc++, e.create, e.update, e.compare || ((i, r) => i === r), e);
    return e.provide && (t.provides = e.provide(t)), t;
  }
  create(e) {
    let t = e.facet(Bo).find((i) => i.field == this);
    return ((t == null ? void 0 : t.create) || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let t = e[this.id] >> 1;
    return {
      create: (i) => (i.values[t] = this.create(i), 1),
      update: (i, r) => {
        let s = i.values[t], o = this.updateF(s, r);
        return this.compareF(s, o) ? 0 : (i.values[t] = o, 1);
      },
      reconfigure: (i, r) => {
        let s = i.facet(Bo), o = r.facet(Bo), a;
        return (a = s.find((l) => l.field == this)) && a != o.find((l) => l.field == this) ? (i.values[t] = a.create(i), 1) : r.config.address[this.id] != null ? (i.values[t] = r.field(this), 0) : (i.values[t] = this.create(i), 1);
      }
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, Bo.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const hr = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function Cs(n) {
  return (e) => new Kd(e, n);
}
const Mr = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ Cs(hr.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ Cs(hr.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ Cs(hr.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ Cs(hr.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ Cs(hr.lowest)
};
class Kd {
  constructor(e, t) {
    this.inner = e, this.prec = t;
  }
  get extension() {
    return this;
  }
}
class Mo {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new Lh(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return Mo.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class Lh {
  constructor(e, t) {
    this.compartment = e, this.inner = t;
  }
  get extension() {
    return this;
  }
}
class Ya {
  constructor(e, t, i, r, s, o) {
    for (this.base = e, this.compartments = t, this.dynamicSlots = i, this.address = r, this.staticValues = s, this.facets = o, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let t = this.address[e.id];
    return t == null ? e.default : this.staticValues[t >> 1];
  }
  static resolve(e, t, i) {
    let r = [], s = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ new Map();
    for (let O of fS(e, t, o))
      O instanceof ui ? r.push(O) : (s[O.facet.id] || (s[O.facet.id] = [])).push(O);
    let a = /* @__PURE__ */ Object.create(null), l = [], h = [];
    for (let O of r)
      a[O.id] = h.length << 1, h.push((d) => O.slot(d));
    let c = i == null ? void 0 : i.config.facets;
    for (let O in s) {
      let d = s[O], p = d[0].facet, g = c && c[O] || [];
      if (d.every(
        (m) => m.type == 0
        /* Provider.Static */
      ))
        if (a[p.id] = l.length << 1 | 1, Gc(g, d))
          l.push(i.facet(p));
        else {
          let m = p.combine(d.map((v) => v.value));
          l.push(i && p.compare(m, i.facet(p)) ? i.facet(p) : m);
        }
      else {
        for (let m of d)
          m.type == 0 ? (a[m.id] = l.length << 1 | 1, l.push(m.value)) : (a[m.id] = h.length << 1, h.push((v) => m.dynamicSlot(v)));
        a[p.id] = h.length << 1, h.push((m) => cS(m, p, d));
      }
    }
    let f = h.map((O) => O(a));
    return new Ya(e, o, f, a, l, s);
  }
}
function fS(n, e, t) {
  let i = [[], [], [], [], []], r = /* @__PURE__ */ new Map();
  function s(o, a) {
    let l = r.get(o);
    if (l != null) {
      if (l <= a)
        return;
      let h = i[l].indexOf(o);
      h > -1 && i[l].splice(h, 1), o instanceof Lh && t.delete(o.compartment);
    }
    if (r.set(o, a), Array.isArray(o))
      for (let h of o)
        s(h, a);
    else if (o instanceof Lh) {
      if (t.has(o.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = e.get(o.compartment) || o.inner;
      t.set(o.compartment, h), s(h, a);
    } else if (o instanceof Kd)
      s(o.inner, o.prec);
    else if (o instanceof ui)
      i[a].push(o), o.provides && s(o.provides, a);
    else if (o instanceof ya)
      i[a].push(o), o.facet.extensions && s(o.facet.extensions, hr.default);
    else {
      let h = o.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${o}).`);
      if (h == o)
        throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      s(h, a);
    }
  }
  return s(n, hr.default), i.reduce((o, a) => o.concat(a));
}
function eo(n, e) {
  if (e & 1)
    return 2;
  let t = e >> 1, i = n.status[t];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[t] = 4;
  let r = n.computeSlot(n, n.config.dynamicSlots[t]);
  return n.status[t] = 2 | r;
}
function La(n, e) {
  return e & 1 ? n.config.staticValues[e >> 1] : n.values[e >> 1];
}
const ep = /* @__PURE__ */ se.define(), Dh = /* @__PURE__ */ se.define({
  combine: (n) => n.some((e) => e),
  static: !0
}), tp = /* @__PURE__ */ se.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), ip = /* @__PURE__ */ se.define(), np = /* @__PURE__ */ se.define(), rp = /* @__PURE__ */ se.define(), sp = /* @__PURE__ */ se.define({
  combine: (n) => n.length ? n[0] : !1
});
class sr {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new op();
  }
}
class op {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new sr(this, e);
  }
}
class ap {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new qe(this, e);
  }
}
class qe {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let t = this.type.map(this.value, e);
    return t === void 0 ? void 0 : t == this.value ? this : new qe(this.type, t);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new ap(e.map || ((t) => t));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, t) {
    if (!e.length)
      return e;
    let i = [];
    for (let r of e) {
      let s = r.map(t);
      s && i.push(s);
    }
    return i;
  }
}
qe.reconfigure = /* @__PURE__ */ qe.define();
qe.appendConfig = /* @__PURE__ */ qe.define();
class St {
  constructor(e, t, i, r, s, o) {
    this.startState = e, this.changes = t, this.selection = i, this.effects = r, this.annotations = s, this.scrollIntoView = o, this._doc = null, this._state = null, i && Jd(i, t.newLength), s.some((a) => a.type == St.time) || (this.annotations = s.concat(St.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, t, i, r, s, o) {
    return new St(e, t, i, r, s, o);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let t of this.annotations)
      if (t.type == e)
        return t.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let t = this.annotation(St.userEvent);
    return !!(t && (t == e || t.length > e.length && t.slice(0, e.length) == e && t[e.length] == "."));
  }
}
St.time = /* @__PURE__ */ sr.define();
St.userEvent = /* @__PURE__ */ sr.define();
St.addToHistory = /* @__PURE__ */ sr.define();
St.remote = /* @__PURE__ */ sr.define();
function uS(n, e) {
  let t = [];
  for (let i = 0, r = 0; ; ) {
    let s, o;
    if (i < n.length && (r == e.length || e[r] >= n[i]))
      s = n[i++], o = n[i++];
    else if (r < e.length)
      s = e[r++], o = e[r++];
    else
      return t;
    !t.length || t[t.length - 1] < s ? t.push(s, o) : t[t.length - 1] < o && (t[t.length - 1] = o);
  }
}
function lp(n, e, t) {
  var i;
  let r, s, o;
  return t ? (r = e.changes, s = Ot.empty(e.changes.length), o = n.changes.compose(e.changes)) : (r = e.changes.map(n.changes), s = n.changes.mapDesc(e.changes, !0), o = n.changes.compose(r)), {
    changes: o,
    selection: e.selection ? e.selection.map(s) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(r),
    effects: qe.mapEffects(n.effects, r).concat(qe.mapEffects(e.effects, s)),
    annotations: n.annotations.length ? n.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: n.scrollIntoView || e.scrollIntoView
  };
}
function Gh(n, e, t) {
  let i = e.selection, r = Hr(e.annotations);
  return e.userEvent && (r = r.concat(St.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof Ot ? e.changes : Ot.of(e.changes || [], t, n.facet(tp)),
    selection: i && (i instanceof te ? i : te.single(i.anchor, i.head)),
    effects: Hr(e.effects),
    annotations: r,
    scrollIntoView: !!e.scrollIntoView
  };
}
function hp(n, e, t) {
  let i = Gh(n, e.length ? e[0] : {}, n.doc.length);
  e.length && e[0].filter === !1 && (t = !1);
  for (let s = 1; s < e.length; s++) {
    e[s].filter === !1 && (t = !1);
    let o = !!e[s].sequential;
    i = lp(i, Gh(n, e[s], o ? i.changes.newLength : n.doc.length), o);
  }
  let r = St.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return dS(t ? OS(r) : r);
}
function OS(n) {
  let e = n.startState, t = !0;
  for (let r of e.facet(ip)) {
    let s = r(n);
    if (s === !1) {
      t = !1;
      break;
    }
    Array.isArray(s) && (t = t === !0 ? s : uS(t, s));
  }
  if (t !== !0) {
    let r, s;
    if (t === !1)
      s = n.changes.invertedDesc, r = Ot.empty(e.doc.length);
    else {
      let o = n.changes.filter(t);
      r = o.changes, s = o.filtered.mapDesc(o.changes).invertedDesc;
    }
    n = St.create(e, r, n.selection && n.selection.map(s), qe.mapEffects(n.effects, s), n.annotations, n.scrollIntoView);
  }
  let i = e.facet(np);
  for (let r = i.length - 1; r >= 0; r--) {
    let s = i[r](n);
    s instanceof St ? n = s : Array.isArray(s) && s.length == 1 && s[0] instanceof St ? n = s[0] : n = hp(e, Hr(s), !1);
  }
  return n;
}
function dS(n) {
  let e = n.startState, t = e.facet(rp), i = n;
  for (let r = t.length - 1; r >= 0; r--) {
    let s = t[r](n);
    s && Object.keys(s).length && (i = lp(i, Gh(e, s, n.changes.newLength), !0));
  }
  return i == n ? n : St.create(e, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const pS = [];
function Hr(n) {
  return n == null ? pS : Array.isArray(n) ? n : [n];
}
var Fi = /* @__PURE__ */ (function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
})(Fi || (Fi = {}));
const gS = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let Ih;
try {
  Ih = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function mS(n) {
  if (Ih)
    return Ih.test(n);
  for (let e = 0; e < n.length; e++) {
    let t = n[e];
    if (/\w/.test(t) || t > "" && (t.toUpperCase() != t.toLowerCase() || gS.test(t)))
      return !0;
  }
  return !1;
}
function vS(n) {
  return (e) => {
    if (!/\S/.test(e))
      return Fi.Space;
    if (mS(e))
      return Fi.Word;
    for (let t = 0; t < n.length; t++)
      if (e.indexOf(n[t]) > -1)
        return Fi.Word;
    return Fi.Other;
  };
}
class We {
  constructor(e, t, i, r, s, o) {
    this.config = e, this.doc = t, this.selection = i, this.values = r, this.status = e.statusTemplate.slice(), this.computeSlot = s, o && (o._state = this);
    for (let a = 0; a < this.config.dynamicSlots.length; a++)
      eo(this, a << 1);
    this.computeSlot = null;
  }
  field(e, t = !0) {
    let i = this.config.address[e.id];
    if (i == null) {
      if (t)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return eo(this, i), La(this, i);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return hp(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let t = this.config, { base: i, compartments: r } = t;
    for (let a of e.effects)
      a.is(Mo.reconfigure) ? (t && (r = /* @__PURE__ */ new Map(), t.compartments.forEach((l, h) => r.set(h, l)), t = null), r.set(a.value.compartment, a.value.extension)) : a.is(qe.reconfigure) ? (t = null, i = a.value) : a.is(qe.appendConfig) && (t = null, i = Hr(i).concat(a.value));
    let s;
    t ? s = e.startState.values.slice() : (t = Ya.resolve(i, r, this), s = new We(t, this.doc, this.selection, t.dynamicSlots.map(() => null), (l, h) => h.reconfigure(l, this), null).values);
    let o = e.startState.facet(Dh) ? e.newSelection : e.newSelection.asSingle();
    new We(t, e.newDoc, o, s, (a, l) => l.update(a, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
      changes: { from: t.from, to: t.to, insert: e },
      range: te.cursor(t.from + e.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let t = this.selection, i = e(t.ranges[0]), r = this.changes(i.changes), s = [i.range], o = Hr(i.effects);
    for (let a = 1; a < t.ranges.length; a++) {
      let l = e(t.ranges[a]), h = this.changes(l.changes), c = h.map(r);
      for (let O = 0; O < a; O++)
        s[O] = s[O].map(c);
      let f = r.mapDesc(h, !0);
      s.push(l.range.map(f)), r = r.compose(c), o = qe.mapEffects(o, c).concat(qe.mapEffects(Hr(l.effects), f));
    }
    return {
      changes: r,
      selection: te.create(s, t.mainIndex),
      effects: o
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof Ot ? e : Ot.of(e, this.doc.length, this.facet(We.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return je.of(e.split(this.facet(We.lineSeparator) || Eh));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, t = this.doc.length) {
    return this.doc.sliceString(e, t, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let t = this.config.address[e.id];
    return t == null ? e.default : (eo(this, t), La(this, t));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let t = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let i in e) {
        let r = e[i];
        r instanceof ui && this.config.address[r.id] != null && (t[i] = r.spec.toJSON(this.field(e[i]), this));
      }
    return t;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, t = {}, i) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let r = [];
    if (i) {
      for (let s in i)
        if (Object.prototype.hasOwnProperty.call(e, s)) {
          let o = i[s], a = e[s];
          r.push(o.init((l) => o.spec.fromJSON(a, l)));
        }
    }
    return We.create({
      doc: e.doc,
      selection: te.fromJSON(e.selection),
      extensions: t.extensions ? r.concat([t.extensions]) : r
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let t = Ya.resolve(e.extensions || [], /* @__PURE__ */ new Map()), i = e.doc instanceof je ? e.doc : je.of((e.doc || "").split(t.staticFacet(We.lineSeparator) || Eh)), r = e.selection ? e.selection instanceof te ? e.selection : te.single(e.selection.anchor, e.selection.head) : te.single(0);
    return Jd(r, i.length), t.staticFacet(Dh) || (r = r.asSingle()), new We(t, i, r, t.dynamicSlots.map(() => null), (s, o) => o.create(s), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(We.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(We.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(sp);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...t) {
    for (let i of this.facet(We.phrases))
      if (Object.prototype.hasOwnProperty.call(i, e)) {
        e = i[e];
        break;
      }
    return t.length && (e = e.replace(/\$(\$|\d*)/g, (i, r) => {
      if (r == "$")
        return "$";
      let s = +(r || 1);
      return !s || s > t.length ? i : t[s - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, t, i = -1) {
    let r = [];
    for (let s of this.facet(ep))
      for (let o of s(this, t, i))
        Object.prototype.hasOwnProperty.call(o, e) && r.push(o[e]);
    return r;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    let t = this.languageDataAt("wordChars", e);
    return vS(t.length ? t[0] : "");
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: t, from: i, length: r } = this.doc.lineAt(e), s = this.charCategorizer(e), o = e - i, a = e - i;
    for (; o > 0; ) {
      let l = bi(t, o, !1);
      if (s(t.slice(l, o)) != Fi.Word)
        break;
      o = l;
    }
    for (; a < r; ) {
      let l = bi(t, a);
      if (s(t.slice(a, l)) != Fi.Word)
        break;
      a = l;
    }
    return o == a ? null : te.range(o + i, a + i);
  }
}
We.allowMultipleSelections = Dh;
We.tabSize = /* @__PURE__ */ se.define({
  combine: (n) => n.length ? n[0] : 4
});
We.lineSeparator = tp;
We.readOnly = sp;
We.phrases = /* @__PURE__ */ se.define({
  compare(n, e) {
    let t = Object.keys(n), i = Object.keys(e);
    return t.length == i.length && t.every((r) => n[r] == e[r]);
  }
});
We.languageData = ep;
We.changeFilter = ip;
We.transactionFilter = np;
We.transactionExtender = rp;
Mo.reconfigure = /* @__PURE__ */ qe.define();
function xs(n, e, t = {}) {
  let i = {};
  for (let r of n)
    for (let s of Object.keys(r)) {
      let o = r[s], a = i[s];
      if (a === void 0)
        i[s] = o;
      else if (!(a === o || o === void 0)) if (Object.hasOwnProperty.call(t, s))
        i[s] = t[s](a, o);
      else
        throw new Error("Config merge conflict for field " + s);
    }
  for (let r in e)
    i[r] === void 0 && (i[r] = e[r]);
  return i;
}
class $n {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, t = e) {
    return Da.create(e, t, this);
  }
}
$n.prototype.startSide = $n.prototype.endSide = 0;
$n.prototype.point = !1;
$n.prototype.mapMode = Zt.TrackDel;
function Ic(n, e) {
  return n == e || n.constructor == e.constructor && n.eq(e);
}
let Da = class cp {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.value = i;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new cp(e, t, i);
  }
};
function Uh(n, e) {
  return n.from - e.from || n.value.startSide - e.value.startSide;
}
class Uc {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.value = i, this.maxPoint = r;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, t, i, r = 0) {
    let s = i ? this.to : this.from;
    for (let o = r, a = s.length; ; ) {
      if (o == a)
        return o;
      let l = o + a >> 1, h = s[l] - e || (i ? this.value[l].endSide : this.value[l].startSide) - t;
      if (l == o)
        return h >= 0 ? o : a;
      h >= 0 ? a = l : o = l + 1;
    }
  }
  between(e, t, i, r) {
    for (let s = this.findIndex(t, -1e9, !0), o = this.findIndex(i, 1e9, !1, s); s < o; s++)
      if (r(this.from[s] + e, this.to[s] + e, this.value[s]) === !1)
        return !1;
  }
  map(e, t) {
    let i = [], r = [], s = [], o = -1, a = -1;
    for (let l = 0; l < this.value.length; l++) {
      let h = this.value[l], c = this.from[l] + e, f = this.to[l] + e, O, d;
      if (c == f) {
        let p = t.mapPos(c, h.startSide, h.mapMode);
        if (p == null || (O = d = p, h.startSide != h.endSide && (d = t.mapPos(c, h.endSide), d < O)))
          continue;
      } else if (O = t.mapPos(c, h.startSide), d = t.mapPos(f, h.endSide), O > d || O == d && h.startSide > 0 && h.endSide <= 0)
        continue;
      (d - O || h.endSide - h.startSide) < 0 || (o < 0 && (o = O), h.point && (a = Math.max(a, d - O)), i.push(h), r.push(O - o), s.push(d - o));
    }
    return { mapped: i.length ? new Uc(r, s, i, a) : null, pos: o };
  }
}
class Pe {
  constructor(e, t, i, r) {
    this.chunkPos = e, this.chunk = t, this.nextLayer = i, this.maxPoint = r;
  }
  /**
  @internal
  */
  static create(e, t, i, r) {
    return new Pe(e, t, i, r);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let t of this.chunk)
      e += t.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: t = [], sort: i = !1, filterFrom: r = 0, filterTo: s = this.length } = e, o = e.filter;
    if (t.length == 0 && !o)
      return this;
    if (i && (t = t.slice().sort(Uh)), this.isEmpty)
      return t.length ? Pe.of(t) : this;
    let a = new fp(this, null, -1).goto(0), l = 0, h = [], c = new Zn();
    for (; a.value || l < t.length; )
      if (l < t.length && (a.from - t[l].from || a.startSide - t[l].value.startSide) >= 0) {
        let f = t[l++];
        c.addInner(f.from, f.to, f.value) || h.push(f);
      } else a.rangeIndex == 1 && a.chunkIndex < this.chunk.length && (l == t.length || this.chunkEnd(a.chunkIndex) < t[l].from) && (!o || r > this.chunkEnd(a.chunkIndex) || s < this.chunkPos[a.chunkIndex]) && c.addChunk(this.chunkPos[a.chunkIndex], this.chunk[a.chunkIndex]) ? a.nextChunk() : ((!o || r > a.to || s < a.from || o(a.from, a.to, a.value)) && (c.addInner(a.from, a.to, a.value) || h.push(Da.create(a.from, a.to, a.value))), a.next());
    return c.finishInner(this.nextLayer.isEmpty && !h.length ? Pe.empty : this.nextLayer.update({ add: h, filter: o, filterFrom: r, filterTo: s }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let t = [], i = [], r = -1;
    for (let o = 0; o < this.chunk.length; o++) {
      let a = this.chunkPos[o], l = this.chunk[o], h = e.touchesRange(a, a + l.length);
      if (h === !1)
        r = Math.max(r, l.maxPoint), t.push(l), i.push(e.mapPos(a));
      else if (h === !0) {
        let { mapped: c, pos: f } = l.map(a, e);
        c && (r = Math.max(r, c.maxPoint), t.push(c), i.push(f));
      }
    }
    let s = this.nextLayer.map(e);
    return t.length == 0 ? s : new Pe(i, t, s || Pe.empty, r);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, t, i) {
    if (!this.isEmpty) {
      for (let r = 0; r < this.chunk.length; r++) {
        let s = this.chunkPos[r], o = this.chunk[r];
        if (t >= s && e <= s + o.length && o.between(s, e - s, t - s, i) === !1)
          return;
      }
      this.nextLayer.between(e, t, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return Oo.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, t = 0) {
    return Oo.from(e).goto(t);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, t, i, r, s = -1) {
    let o = e.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= s), a = t.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= s), l = cu(o, a, i), h = new As(o, l, s), c = new As(a, l, s);
    i.iterGaps((f, O, d) => fu(h, f, c, O, d, r)), i.empty && i.length == 0 && fu(h, 0, c, 0, 0, r);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, t, i = 0, r) {
    r == null && (r = 999999999);
    let s = e.filter((c) => !c.isEmpty && t.indexOf(c) < 0), o = t.filter((c) => !c.isEmpty && e.indexOf(c) < 0);
    if (s.length != o.length)
      return !1;
    if (!s.length)
      return !0;
    let a = cu(s, o), l = new As(s, a, 0).goto(i), h = new As(o, a, 0).goto(i);
    for (; ; ) {
      if (l.to != h.to || !Nh(l.active, h.active) || l.point && (!h.point || !Ic(l.point, h.point)))
        return !1;
      if (l.to > r)
        return !0;
      l.next(), h.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, t, i, r, s = -1) {
    let o = new As(e, null, s).goto(t), a = t, l = o.openStart;
    for (; ; ) {
      let h = Math.min(o.to, i);
      if (o.point) {
        let c = o.activeForPoint(o.to), f = o.pointFrom < t ? c.length + 1 : o.point.startSide < 0 ? c.length : Math.min(c.length, l);
        r.point(a, h, o.point, c, f, o.pointRank), l = Math.min(o.openEnd(h), c.length);
      } else h > a && (r.span(a, h, o.active, l), l = o.openEnd(h));
      if (o.to > i)
        return l + (o.point && o.to > i ? 1 : 0);
      a = o.to, o.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, t = !1) {
    let i = new Zn();
    for (let r of e instanceof Da ? [e] : t ? QS(e) : e)
      i.add(r.from, r.to, r.value);
    return i.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(e) {
    if (!e.length)
      return Pe.empty;
    let t = e[e.length - 1];
    for (let i = e.length - 2; i >= 0; i--)
      for (let r = e[i]; r != Pe.empty; r = r.nextLayer)
        t = new Pe(r.chunkPos, r.chunk, t, Math.max(r.maxPoint, t.maxPoint));
    return t;
  }
}
Pe.empty = /* @__PURE__ */ new Pe([], [], null, -1);
function QS(n) {
  if (n.length > 1)
    for (let e = n[0], t = 1; t < n.length; t++) {
      let i = n[t];
      if (Uh(e, i) > 0)
        return n.slice().sort(Uh);
      e = i;
    }
  return n;
}
Pe.empty.nextLayer = Pe.empty;
class Zn {
  finishChunk(e) {
    this.chunks.push(new Uc(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, t, i) {
    this.addInner(e, t, i) || (this.nextLayer || (this.nextLayer = new Zn())).add(e, t, i);
  }
  /**
  @internal
  */
  addInner(e, t, i) {
    let r = e - this.lastTo || i.startSide - this.last.endSide;
    if (r <= 0 && (e - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return r < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = i, this.lastFrom = e, this.lastTo = t, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, t) {
    if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
    let i = t.value.length - 1;
    return this.last = t.value[i], this.lastFrom = t.from[i] + e, this.lastTo = t.to[i] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(Pe.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let t = Pe.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, t;
  }
}
function cu(n, e, t) {
  let i = /* @__PURE__ */ new Map();
  for (let s of n)
    for (let o = 0; o < s.chunk.length; o++)
      s.chunk[o].maxPoint <= 0 && i.set(s.chunk[o], s.chunkPos[o]);
  let r = /* @__PURE__ */ new Set();
  for (let s of e)
    for (let o = 0; o < s.chunk.length; o++) {
      let a = i.get(s.chunk[o]);
      a != null && (t ? t.mapPos(a) : a) == s.chunkPos[o] && !(t != null && t.touchesRange(a, a + s.chunk[o].length)) && r.add(s.chunk[o]);
    }
  return r;
}
class fp {
  constructor(e, t, i, r = 0) {
    this.layer = e, this.skip = t, this.minPoint = i, this.rank = r;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, t = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, t, !1), this;
  }
  gotoInner(e, t, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let r = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(r) || this.layer.chunkEnd(this.chunkIndex) < e || r.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let r = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
      (!i || this.rangeIndex < r) && this.setRangeIndex(r);
    }
    this.next();
  }
  forward(e, t) {
    (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], i = e + t.from[this.rangeIndex];
        if (this.from = i, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class Oo {
  constructor(e) {
    this.heap = e;
  }
  static from(e, t = null, i = -1) {
    let r = [];
    for (let s = 0; s < e.length; s++)
      for (let o = e[s]; !o.isEmpty; o = o.nextLayer)
        o.maxPoint >= i && r.push(new fp(o, t, i, s));
    return r.length == 1 ? r[0] : new Oo(r);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, t = -1e9) {
    for (let i of this.heap)
      i.goto(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Ul(this.heap, i);
    return this.next(), this;
  }
  forward(e, t) {
    for (let i of this.heap)
      i.forward(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Ul(this.heap, i);
    (this.to - e || this.value.endSide - t) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), Ul(this.heap, 0);
    }
  }
}
function Ul(n, e) {
  for (let t = n[e]; ; ) {
    let i = (e << 1) + 1;
    if (i >= n.length)
      break;
    let r = n[i];
    if (i + 1 < n.length && r.compare(n[i + 1]) >= 0 && (r = n[i + 1], i++), t.compare(r) < 0)
      break;
    n[i] = t, n[e] = r, e = i;
  }
}
class As {
  constructor(e, t, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = Oo.from(e, t, i);
  }
  goto(e, t = -1e9) {
    return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
  }
  forward(e, t) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, t);
  }
  removeActive(e) {
    Fo(this.active, e), Fo(this.activeTo, e), Fo(this.activeRank, e), this.minActive = uu(this.active, this.activeTo);
  }
  addActive(e) {
    let t = 0, { value: i, to: r, rank: s } = this.cursor;
    for (; t < this.activeRank.length && (s - this.activeRank[t] || r - this.activeTo[t]) > 0; )
      t++;
    Ho(this.active, t, i), Ho(this.activeTo, t, r), Ho(this.activeRank, t, s), e && Ho(e, t, this.cursor.from), this.minActive = uu(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, t = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let r = this.minActive;
      if (r > -1 && (this.activeTo[r] - this.cursor.from || this.active[r].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[r] > e) {
          this.to = this.activeTo[r], this.endSide = this.active[r].endSide;
          break;
        }
        this.removeActive(r), i && Fo(i, r);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let s = this.cursor.value;
          if (!s.point)
            this.addActive(i), this.cursor.next();
          else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = s, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = s.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (i) {
      this.openStart = 0;
      for (let r = i.length - 1; r >= 0 && i[r] < e; r--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let t = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > e || this.activeTo[i] == e && this.active[i].endSide >= this.point.endSide) && t.push(this.active[i]);
    return t.reverse();
  }
  openEnd(e) {
    let t = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > e; i--)
      t++;
    return t;
  }
}
function fu(n, e, t, i, r, s) {
  n.goto(e), t.goto(i);
  let o = i + r, a = i, l = i - e, h = !!s.boundChange;
  for (let c = !1; ; ) {
    let f = n.to + l - t.to, O = f || n.endSide - t.endSide, d = O < 0 ? n.to + l : t.to, p = Math.min(d, o);
    if (n.point || t.point ? (n.point && t.point && Ic(n.point, t.point) && Nh(n.activeForPoint(n.to), t.activeForPoint(t.to)) || s.comparePoint(a, p, n.point, t.point), c = !1) : (c && s.boundChange(a), p > a && !Nh(n.active, t.active) && s.compareRange(a, p, n.active, t.active), h && p < o && (f || n.openEnd(d) != t.openEnd(d)) && (c = !0)), d > o)
      break;
    a = d, O <= 0 && n.next(), O >= 0 && t.next();
  }
}
function Nh(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] != e[t] && !Ic(n[t], e[t]))
      return !1;
  return !0;
}
function Fo(n, e) {
  for (let t = e, i = n.length - 1; t < i; t++)
    n[t] = n[t + 1];
  n.pop();
}
function Ho(n, e, t) {
  for (let i = n.length - 1; i >= e; i--)
    n[i + 1] = n[i];
  n[e] = t;
}
function uu(n, e) {
  let t = -1, i = 1e9;
  for (let r = 0; r < e.length; r++)
    (e[r] - i || n[r].endSide - n[t].endSide) < 0 && (t = r, i = e[r]);
  return t;
}
function ul(n, e, t = n.length) {
  let i = 0;
  for (let r = 0; r < t && r < n.length; )
    n.charCodeAt(r) == 9 ? (i += e - i % e, r++) : (i++, r = bi(n, r));
  return i;
}
function Ga(n, e, t, i) {
  for (let r = 0, s = 0; ; ) {
    if (s >= e)
      return r;
    if (r == n.length)
      break;
    s += n.charCodeAt(r) == 9 ? t - s % t : 1, r = bi(n, r);
  }
  return i === !0 ? -1 : n.length;
}
const bS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Annotation: sr,
  AnnotationType: op,
  ChangeDesc: Ki,
  ChangeSet: Ot,
  get CharCategory() {
    return Fi;
  },
  Compartment: Mo,
  EditorSelection: te,
  EditorState: We,
  Facet: se,
  Line: Bd,
  get MapMode() {
    return Zt;
  },
  Prec: Mr,
  Range: Da,
  RangeSet: Pe,
  RangeSetBuilder: Zn,
  RangeValue: $n,
  SelectionRange: yn,
  StateEffect: qe,
  StateEffectType: ap,
  StateField: ui,
  Text: je,
  Transaction: St,
  codePointAt: Lc,
  codePointSize: Fd,
  combineConfig: xs,
  countColumn: ul,
  findClusterBreak: bi,
  findColumn: Ga,
  fromCodePoint: hS
}, Symbol.toStringTag, { value: "Module" })), Bh = "ͼ", Ou = typeof Symbol > "u" ? "__" + Bh : Symbol.for(Bh), Fh = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), du = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class tr {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, t) {
    this.rules = [];
    let { finish: i } = t || {};
    function r(o) {
      return /^@/.test(o) ? [o] : o.split(/,\s*/);
    }
    function s(o, a, l, h) {
      let c = [], f = /^@(\w+)\b/.exec(o[0]), O = f && f[1] == "keyframes";
      if (f && a == null) return l.push(o[0] + ";");
      for (let d in a) {
        let p = a[d];
        if (/&/.test(d))
          s(
            d.split(/,\s*/).map((g) => o.map((m) => g.replace(/&/, m))).reduce((g, m) => g.concat(m)),
            p,
            l
          );
        else if (p && typeof p == "object") {
          if (!f) throw new RangeError("The value of a property (" + d + ") should be a primitive value.");
          s(r(d), p, c, O);
        } else p != null && c.push(d.replace(/_.*/, "").replace(/[A-Z]/g, (g) => "-" + g.toLowerCase()) + ": " + p + ";");
      }
      (c.length || O) && l.push((i && !f && !h ? o.map(i) : o).join(", ") + " {" + c.join(" ") + "}");
    }
    for (let o in e) s(r(o), e[o], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = du[Ou] || 1;
    return du[Ou] = e + 1, Bh + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, t, i) {
    let r = e[Fh], s = i && i.nonce;
    r ? s && r.setNonce(s) : r = new SS(e, s), r.mount(Array.isArray(t) ? t : [t], e);
  }
}
let pu = /* @__PURE__ */ new Map();
class SS {
  constructor(e, t) {
    let i = e.ownerDocument || e, r = i.defaultView;
    if (!e.head && e.adoptedStyleSheets && r.CSSStyleSheet) {
      let s = pu.get(i);
      if (s) return e[Fh] = s;
      this.sheet = new r.CSSStyleSheet(), pu.set(i, this);
    } else
      this.styleTag = i.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
    this.modules = [], e[Fh] = this;
  }
  mount(e, t) {
    let i = this.sheet, r = 0, s = 0;
    for (let o = 0; o < e.length; o++) {
      let a = e[o], l = this.modules.indexOf(a);
      if (l < s && l > -1 && (this.modules.splice(l, 1), s--, l = -1), l == -1) {
        if (this.modules.splice(s++, 0, a), i) for (let h = 0; h < a.rules.length; h++)
          i.insertRule(a.rules[h], r++);
      } else {
        for (; s < l; ) r += this.modules[s++].rules.length;
        r += a.rules.length, s++;
      }
    }
    if (i)
      t.adoptedStyleSheets.indexOf(this.sheet) < 0 && (t.adoptedStyleSheets = [this.sheet, ...t.adoptedStyleSheets]);
    else {
      let o = "";
      for (let l = 0; l < this.modules.length; l++)
        o += this.modules[l].getRules() + `
`;
      this.styleTag.textContent = o;
      let a = t.head || t;
      this.styleTag.parentNode != a && a.insertBefore(this.styleTag, a.firstChild);
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var ir = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, po = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, yS = typeof navigator < "u" && /Mac/.test(navigator.platform), kS = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var $t = 0; $t < 10; $t++) ir[48 + $t] = ir[96 + $t] = String($t);
for (var $t = 1; $t <= 24; $t++) ir[$t + 111] = "F" + $t;
for (var $t = 65; $t <= 90; $t++)
  ir[$t] = String.fromCharCode($t + 32), po[$t] = String.fromCharCode($t);
for (var Nl in ir) po.hasOwnProperty(Nl) || (po[Nl] = ir[Nl]);
function xS(n) {
  var e = yS && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || kS && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? po : ir)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
function Yr() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var e = 1, t = arguments[1];
  if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
    for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i)) {
      var r = t[i];
      typeof r == "string" ? n.setAttribute(i, r) : r != null && (n[i] = r);
    }
    e++;
  }
  for (; e < arguments.length; e++) up(n, arguments[e]);
  return n;
}
function up(n, e) {
  if (typeof e == "string")
    n.appendChild(document.createTextNode(e));
  else if (e != null) if (e.nodeType != null)
    n.appendChild(e);
  else if (Array.isArray(e))
    for (var t = 0; t < e.length; t++) up(n, e[t]);
  else
    throw new RangeError("Unsupported child node: " + e);
}
let Et = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, Hh = typeof document < "u" ? document : { documentElement: { style: {} } };
const Jh = /* @__PURE__ */ /Edge\/(\d+)/.exec(Et.userAgent), Op = /* @__PURE__ */ /MSIE \d/.test(Et.userAgent), Kh = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Et.userAgent), Ol = !!(Op || Kh || Jh), gu = !Ol && /* @__PURE__ */ /gecko\/(\d+)/i.test(Et.userAgent), Bl = !Ol && /* @__PURE__ */ /Chrome\/(\d+)/.exec(Et.userAgent), mu = "webkitFontSmoothing" in Hh.documentElement.style, ec = !Ol && /* @__PURE__ */ /Apple Computer/.test(Et.vendor), vu = ec && (/* @__PURE__ */ /Mobile\/\w+/.test(Et.userAgent) || Et.maxTouchPoints > 2);
var ie = {
  mac: vu || /* @__PURE__ */ /Mac/.test(Et.platform),
  windows: /* @__PURE__ */ /Win/.test(Et.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(Et.platform),
  ie: Ol,
  ie_version: Op ? Hh.documentMode || 6 : Kh ? +Kh[1] : Jh ? +Jh[1] : 0,
  gecko: gu,
  gecko_version: gu ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(Et.userAgent) || [0, 0])[1] : 0,
  chrome: !!Bl,
  chrome_version: Bl ? +Bl[1] : 0,
  ios: vu,
  android: /* @__PURE__ */ /Android\b/.test(Et.userAgent),
  webkit: mu,
  webkit_version: mu ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(Et.userAgent) || [0, 0])[1] : 0,
  safari: ec,
  safari_version: ec ? +(/* @__PURE__ */ /\bVersion\/(\d+(\.\d+)?)/.exec(Et.userAgent) || [0, 0])[1] : 0,
  tabSize: Hh.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
function Nc(n, e) {
  for (let t in n)
    t == "class" && e.class ? e.class += " " + n.class : t == "style" && e.style ? e.style += ";" + n.style : e[t] = n[t];
  return e;
}
const Ia = /* @__PURE__ */ Object.create(null);
function Bc(n, e, t) {
  if (n == e)
    return !0;
  n || (n = Ia), e || (e = Ia);
  let i = Object.keys(n), r = Object.keys(e);
  if (i.length - 0 != r.length - 0)
    return !1;
  for (let s of i)
    if (s != t && (r.indexOf(s) == -1 || n[s] !== e[s]))
      return !1;
  return !0;
}
function wS(n, e) {
  for (let t = n.attributes.length - 1; t >= 0; t--) {
    let i = n.attributes[t].name;
    e[i] == null && n.removeAttribute(i);
  }
  for (let t in e) {
    let i = e[t];
    t == "style" ? n.style.cssText = i : n.getAttribute(t) != i && n.setAttribute(t, i);
  }
}
function Qu(n, e, t) {
  let i = !1;
  if (e)
    for (let r in e)
      t && r in t || (i = !0, r == "style" ? n.style.cssText = "" : n.removeAttribute(r));
  if (t)
    for (let r in t)
      e && e[r] == t[r] || (i = !0, r == "style" ? n.style.cssText = t[r] : n.setAttribute(r, t[r]));
  return i;
}
function PS(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t = 0; t < n.attributes.length; t++) {
    let i = n.attributes[t];
    e[i.name] = i.value;
  }
  return e;
}
class qi {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, t, i) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, t, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var yt = /* @__PURE__ */ (function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
})(yt || (yt = {}));
class pe extends $n {
  constructor(e, t, i, r) {
    super(), this.startSide = e, this.endSide = t, this.widget = i, this.spec = r;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new Wo(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), i = !!e.block;
    return t += i && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new Zr(e, t, t, i, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let t = !!e.block, i, r;
    if (e.isBlockGap)
      i = -5e8, r = 4e8;
    else {
      let { start: s, end: o } = dp(e, t);
      i = (s ? t ? -3e8 : -1 : 5e8) - 1, r = (o ? t ? 2e8 : 1 : -6e8) + 1;
    }
    return new Zr(e, i, r, t, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new Eo(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, t = !1) {
    return Pe.of(e, t);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
pe.none = Pe.empty;
class Wo extends pe {
  constructor(e) {
    let { start: t, end: i } = dp(e);
    super(t ? -1 : 5e8, i ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.attrs = e.class && e.attributes ? Nc(e.attributes, { class: e.class }) : e.class ? { class: e.class } : e.attributes || Ia;
  }
  eq(e) {
    return this == e || e instanceof Wo && this.tagName == e.tagName && Bc(this.attrs, e.attrs);
  }
  range(e, t = e) {
    if (e >= t)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, t);
  }
}
Wo.prototype.point = !1;
class Eo extends pe {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof Eo && this.spec.class == e.spec.class && Bc(this.spec.attributes, e.spec.attributes);
  }
  range(e, t = e) {
    if (t != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, t);
  }
}
Eo.prototype.mapMode = Zt.TrackBefore;
Eo.prototype.point = !0;
class Zr extends pe {
  constructor(e, t, i, r, s, o) {
    super(t, i, s, e), this.block = r, this.isReplace = o, this.mapMode = r ? t <= 0 ? Zt.TrackBefore : Zt.TrackAfter : Zt.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? yt.WidgetRange : this.startSide <= 0 ? yt.WidgetBefore : yt.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof Zr && _S(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, t = e) {
    if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && t != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, t);
  }
}
Zr.prototype.point = !0;
function dp(n, e = !1) {
  let { inclusiveStart: t, inclusiveEnd: i } = n;
  return t == null && (t = n.inclusive), i == null && (i = n.inclusive), { start: t ?? e, end: i ?? e };
}
function _S(n, e) {
  return n == e || !!(n && e && n.compare(e));
}
function Jr(n, e, t, i = 0) {
  let r = t.length - 1;
  r >= 0 && t[r] + i >= n ? t[r] = Math.max(t[r], e) : t.push(n, e);
}
class ps extends $n {
  constructor(e, t, i) {
    super(), this.tagName = e, this.attributes = t, this.rank = i;
  }
  eq(e) {
    return e == this || e instanceof ps && this.tagName == e.tagName && Bc(this.attributes, e.attributes);
  }
  /**
  Create a block wrapper object with the given tag name and
  attributes.
  */
  static create(e) {
    return new ps(e.tagName, e.attributes || Ia, e.rank == null ? 50 : Math.max(0, Math.min(e.rank, 100)));
  }
  /**
  Create a range set from the given block wrapper ranges.
  */
  static set(e, t = !1) {
    return Pe.of(e, t);
  }
}
ps.prototype.startSide = ps.prototype.endSide = -1;
function go(n) {
  let e;
  return n.nodeType == 11 ? e = n.getSelection ? n : n.ownerDocument : e = n, e.getSelection();
}
function tc(n, e) {
  return e ? n == e || n.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function to(n, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return tc(n, e.anchorNode);
  } catch {
    return !1;
  }
}
function io(n) {
  return n.nodeType == 3 ? vo(n, 0, n.nodeValue.length).getClientRects() : n.nodeType == 1 ? n.getClientRects() : [];
}
function no(n, e, t, i) {
  return t ? bu(n, e, t, i, -1) || bu(n, e, t, i, 1) : !1;
}
function nr(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}
function Ua(n) {
  return n.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
function bu(n, e, t, i, r) {
  for (; ; ) {
    if (n == t && e == i)
      return !0;
    if (e == (r < 0 ? 0 : Rn(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let s = n.parentNode;
      if (!s || s.nodeType != 1)
        return !1;
      e = nr(n) + (r < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (r < 0 ? -1 : 0)], n.nodeType == 1 && n.contentEditable == "false")
        return !1;
      e = r < 0 ? Rn(n) : 0;
    } else
      return !1;
  }
}
function Rn(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function mo(n, e) {
  let { left: t, right: i } = n;
  if (t == i)
    return n;
  let r = e ? t : i;
  return { left: r, right: r, top: n.top, bottom: n.bottom };
}
function TS(n) {
  let e = n.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function pp(n, e) {
  let t = e.width / n.offsetWidth, i = e.height / n.offsetHeight;
  return (t > 0.995 && t < 1.005 || !isFinite(t) || Math.abs(e.width - n.offsetWidth) < 1) && (t = 1), (i > 0.995 && i < 1.005 || !isFinite(i) || Math.abs(e.height - n.offsetHeight) < 1) && (i = 1), { scaleX: t, scaleY: i };
}
function $S(n, e, t, i, r, s, o, a) {
  let l = n.ownerDocument, h = l.defaultView || window;
  for (let c = n, f = !1; c && !f; )
    if (c.nodeType == 1) {
      let O, d = c == l.body, p = 1, g = 1;
      if (d)
        O = TS(h);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(c).position) && (f = !0), c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth) {
          c = c.assignedSlot || c.parentNode;
          continue;
        }
        let w = c.getBoundingClientRect();
        ({ scaleX: p, scaleY: g } = pp(c, w)), O = {
          left: w.left,
          right: w.left + c.clientWidth * p,
          top: w.top,
          bottom: w.top + c.clientHeight * g
        };
      }
      let m = 0, v = 0;
      if (r == "nearest")
        e.top < O.top + o ? (v = e.top - (O.top + o), t > 0 && e.bottom > O.bottom + v && (v = e.bottom - O.bottom + o)) : e.bottom > O.bottom - o && (v = e.bottom - O.bottom + o, t < 0 && e.top - v < O.top && (v = e.top - (O.top + o)));
      else {
        let w = e.bottom - e.top, S = O.bottom - O.top;
        v = (r == "center" && w <= S ? e.top + w / 2 - S / 2 : r == "start" || r == "center" && t < 0 ? e.top - o : e.bottom - S + o) - O.top;
      }
      if (i == "nearest" ? e.left < O.left + s ? (m = e.left - (O.left + s), t > 0 && e.right > O.right + m && (m = e.right - O.right + s)) : e.right > O.right - s && (m = e.right - O.right + s, t < 0 && e.left < O.left + m && (m = e.left - (O.left + s))) : m = (i == "center" ? e.left + (e.right - e.left) / 2 - (O.right - O.left) / 2 : i == "start" == a ? e.left - s : e.right - (O.right - O.left) + s) - O.left, m || v)
        if (d)
          h.scrollBy(m, v);
        else {
          let w = 0, S = 0;
          if (v) {
            let Q = c.scrollTop;
            c.scrollTop += v / g, S = (c.scrollTop - Q) * g;
          }
          if (m) {
            let Q = c.scrollLeft;
            c.scrollLeft += m / p, w = (c.scrollLeft - Q) * p;
          }
          e = {
            left: e.left - w,
            top: e.top - S,
            right: e.right - w,
            bottom: e.bottom - S
          }, w && Math.abs(w - m) < 1 && (i = "nearest"), S && Math.abs(S - v) < 1 && (r = "nearest");
        }
      if (d)
        break;
      (e.top < O.top || e.bottom > O.bottom || e.left < O.left || e.right > O.right) && (e = {
        left: Math.max(e.left, O.left),
        right: Math.min(e.right, O.right),
        top: Math.max(e.top, O.top),
        bottom: Math.min(e.bottom, O.bottom)
      }), c = c.assignedSlot || c.parentNode;
    } else if (c.nodeType == 11)
      c = c.host;
    else
      break;
}
function gp(n, e = !0) {
  let t = n.ownerDocument, i = null, r = null;
  for (let s = n.parentNode; s && !(s == t.body || (!e || i) && r); )
    if (s.nodeType == 1)
      !r && s.scrollHeight > s.clientHeight && (r = s), e && !i && s.scrollWidth > s.clientWidth && (i = s), s = s.assignedSlot || s.parentNode;
    else if (s.nodeType == 11)
      s = s.host;
    else
      break;
  return { x: i, y: r };
}
class ZS {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: t, focusNode: i } = e;
    this.set(t, Math.min(e.anchorOffset, t ? Rn(t) : 0), i, Math.min(e.focusOffset, i ? Rn(i) : 0));
  }
  set(e, t, i, r) {
    this.anchorNode = e, this.anchorOffset = t, this.focusNode = i, this.focusOffset = r;
  }
}
let lr = null;
ie.safari && ie.safari_version >= 26 && (lr = !1);
function mp(n) {
  if (n.setActive)
    return n.setActive();
  if (lr)
    return n.focus(lr);
  let e = [];
  for (let t = n; t && (e.push(t, t.scrollTop, t.scrollLeft), t != t.ownerDocument); t = t.parentNode)
    ;
  if (n.focus(lr == null ? {
    get preventScroll() {
      return lr = { preventScroll: !0 }, !0;
    }
  } : void 0), !lr) {
    lr = !1;
    for (let t = 0; t < e.length; ) {
      let i = e[t++], r = e[t++], s = e[t++];
      i.scrollTop != r && (i.scrollTop = r), i.scrollLeft != s && (i.scrollLeft = s);
    }
  }
}
let Su;
function vo(n, e, t = e) {
  let i = Su || (Su = document.createRange());
  return i.setEnd(n, t), i.setStart(n, e), i;
}
function Kr(n, e, t, i) {
  let r = { key: e, code: e, keyCode: t, which: t, cancelable: !0 };
  i && ({ altKey: r.altKey, ctrlKey: r.ctrlKey, shiftKey: r.shiftKey, metaKey: r.metaKey } = i);
  let s = new KeyboardEvent("keydown", r);
  s.synthetic = !0, n.dispatchEvent(s);
  let o = new KeyboardEvent("keyup", r);
  return o.synthetic = !0, n.dispatchEvent(o), s.defaultPrevented || o.defaultPrevented;
}
function RS(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function XS(n, e) {
  let t = e.focusNode, i = e.focusOffset;
  if (!t || e.anchorNode != t || e.anchorOffset != i)
    return !1;
  for (i = Math.min(i, Rn(t)); ; )
    if (i) {
      if (t.nodeType != 1)
        return !1;
      let r = t.childNodes[i - 1];
      r.contentEditable == "false" ? i-- : (t = r, i = Rn(t));
    } else {
      if (t == n)
        return !0;
      i = nr(t), t = t.parentNode;
    }
}
function vp(n) {
  return n instanceof Window ? n.pageYOffset > Math.max(0, n.document.documentElement.scrollHeight - n.innerHeight - 4) : n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
function Qp(n, e) {
  for (let t = n, i = e; ; ) {
    if (t.nodeType == 3 && i > 0)
      return { node: t, offset: i };
    if (t.nodeType == 1 && i > 0) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i - 1], i = Rn(t);
    } else if (t.parentNode && !Ua(t))
      i = nr(t), t = t.parentNode;
    else
      return null;
  }
}
function bp(n, e) {
  for (let t = n, i = e; ; ) {
    if (t.nodeType == 3 && i < t.nodeValue.length)
      return { node: t, offset: i };
    if (t.nodeType == 1 && i < t.childNodes.length) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i], i = 0;
    } else if (t.parentNode && !Ua(t))
      i = nr(t) + 1, t = t.parentNode;
    else
      return null;
  }
}
class Ri {
  constructor(e, t, i = !0) {
    this.node = e, this.offset = t, this.precise = i;
  }
  static before(e, t) {
    return new Ri(e.parentNode, nr(e), t);
  }
  static after(e, t) {
    return new Ri(e.parentNode, nr(e) + 1, t);
  }
}
var Ie = /* @__PURE__ */ (function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
})(Ie || (Ie = {}));
const Rr = Ie.LTR, Fc = Ie.RTL;
function Sp(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    e.push(1 << +n[t]);
  return e;
}
const CS = /* @__PURE__ */ Sp("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), AS = /* @__PURE__ */ Sp("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), ic = /* @__PURE__ */ Object.create(null), Vi = [];
for (let n of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ n.charCodeAt(0), t = /* @__PURE__ */ n.charCodeAt(1);
  ic[e] = t, ic[t] = -e;
}
function yp(n) {
  return n <= 247 ? CS[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? AS[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8204 ? 256 : 64336 <= n && n <= 65023 ? 4 : 1;
}
const qS = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class Xi {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Fc : Rr;
  }
  /**
  @internal
  */
  constructor(e, t, i) {
    this.from = e, this.to = t, this.level = i;
  }
  /**
  @internal
  */
  side(e, t) {
    return this.dir == t == e ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(e, t) {
    return e == (this.dir == t);
  }
  /**
  @internal
  */
  static find(e, t, i, r) {
    let s = -1;
    for (let o = 0; o < e.length; o++) {
      let a = e[o];
      if (a.from <= t && a.to >= t) {
        if (a.level == i)
          return o;
        (s < 0 || (r != 0 ? r < 0 ? a.from < t : a.to > t : e[s].level > a.level)) && (s = o);
      }
    }
    if (s < 0)
      throw new RangeError("Index out of range");
    return s;
  }
}
function kp(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++) {
    let i = n[t], r = e[t];
    if (i.from != r.from || i.to != r.to || i.direction != r.direction || !kp(i.inner, r.inner))
      return !1;
  }
  return !0;
}
const He = [];
function zS(n, e, t, i, r) {
  for (let s = 0; s <= i.length; s++) {
    let o = s ? i[s - 1].to : e, a = s < i.length ? i[s].from : t, l = s ? 256 : r;
    for (let h = o, c = l, f = l; h < a; h++) {
      let O = yp(n.charCodeAt(h));
      O == 512 ? O = c : O == 8 && f == 4 && (O = 16), He[h] = O == 4 ? 2 : O, O & 7 && (f = O), c = O;
    }
    for (let h = o, c = l, f = l; h < a; h++) {
      let O = He[h];
      if (O == 128)
        h < a - 1 && c == He[h + 1] && c & 24 ? O = He[h] = c : He[h] = 256;
      else if (O == 64) {
        let d = h + 1;
        for (; d < a && He[d] == 64; )
          d++;
        let p = h && c == 8 || d < t && He[d] == 8 ? f == 1 ? 1 : 8 : 256;
        for (let g = h; g < d; g++)
          He[g] = p;
        h = d - 1;
      } else O == 8 && f == 1 && (He[h] = 1);
      c = O, O & 7 && (f = O);
    }
  }
}
function MS(n, e, t, i, r) {
  let s = r == 1 ? 2 : 1;
  for (let o = 0, a = 0, l = 0; o <= i.length; o++) {
    let h = o ? i[o - 1].to : e, c = o < i.length ? i[o].from : t;
    for (let f = h, O, d, p; f < c; f++)
      if (d = ic[O = n.charCodeAt(f)])
        if (d < 0) {
          for (let g = a - 3; g >= 0; g -= 3)
            if (Vi[g + 1] == -d) {
              let m = Vi[g + 2], v = m & 2 ? r : m & 4 ? m & 1 ? s : r : 0;
              v && (He[f] = He[Vi[g]] = v), a = g;
              break;
            }
        } else {
          if (Vi.length == 189)
            break;
          Vi[a++] = f, Vi[a++] = O, Vi[a++] = l;
        }
      else if ((p = He[f]) == 2 || p == 1) {
        let g = p == r;
        l = g ? 0 : 1;
        for (let m = a - 3; m >= 0; m -= 3) {
          let v = Vi[m + 2];
          if (v & 2)
            break;
          if (g)
            Vi[m + 2] |= 2;
          else {
            if (v & 4)
              break;
            Vi[m + 2] |= 4;
          }
        }
      }
  }
}
function WS(n, e, t, i) {
  for (let r = 0, s = i; r <= t.length; r++) {
    let o = r ? t[r - 1].to : n, a = r < t.length ? t[r].from : e;
    for (let l = o; l < a; ) {
      let h = He[l];
      if (h == 256) {
        let c = l + 1;
        for (; ; )
          if (c == a) {
            if (r == t.length)
              break;
            c = t[r++].to, a = r < t.length ? t[r].from : e;
          } else if (He[c] == 256)
            c++;
          else
            break;
        let f = s == 1, O = (c < e ? He[c] : i) == 1, d = f == O ? f ? 1 : 2 : i;
        for (let p = c, g = r, m = g ? t[g - 1].to : n; p > l; )
          p == m && (p = t[--g].from, m = g ? t[g - 1].to : n), He[--p] = d;
        l = c;
      } else
        s = h, l++;
    }
  }
}
function nc(n, e, t, i, r, s, o) {
  let a = i % 2 ? 2 : 1;
  if (i % 2 == r % 2)
    for (let l = e, h = 0; l < t; ) {
      let c = !0, f = !1;
      if (h == s.length || l < s[h].from) {
        let g = He[l];
        g != a && (c = !1, f = g == 16);
      }
      let O = !c && a == 1 ? [] : null, d = c ? i : i + 1, p = l;
      e: for (; ; )
        if (h < s.length && p == s[h].from) {
          if (f)
            break e;
          let g = s[h];
          if (!c)
            for (let m = g.to, v = h + 1; ; ) {
              if (m == t)
                break e;
              if (v < s.length && s[v].from == m)
                m = s[v++].to;
              else {
                if (He[m] == a)
                  break e;
                break;
              }
            }
          if (h++, O)
            O.push(g);
          else {
            g.from > l && o.push(new Xi(l, g.from, d));
            let m = g.direction == Rr != !(d % 2);
            rc(n, m ? i + 1 : i, r, g.inner, g.from, g.to, o), l = g.to;
          }
          p = g.to;
        } else {
          if (p == t || (c ? He[p] != a : He[p] == a))
            break;
          p++;
        }
      O ? nc(n, l, p, i + 1, r, O, o) : l < p && o.push(new Xi(l, p, d)), l = p;
    }
  else
    for (let l = t, h = s.length; l > e; ) {
      let c = !0, f = !1;
      if (!h || l > s[h - 1].to) {
        let g = He[l - 1];
        g != a && (c = !1, f = g == 16);
      }
      let O = !c && a == 1 ? [] : null, d = c ? i : i + 1, p = l;
      e: for (; ; )
        if (h && p == s[h - 1].to) {
          if (f)
            break e;
          let g = s[--h];
          if (!c)
            for (let m = g.from, v = h; ; ) {
              if (m == e)
                break e;
              if (v && s[v - 1].to == m)
                m = s[--v].from;
              else {
                if (He[m - 1] == a)
                  break e;
                break;
              }
            }
          if (O)
            O.push(g);
          else {
            g.to < l && o.push(new Xi(g.to, l, d));
            let m = g.direction == Rr != !(d % 2);
            rc(n, m ? i + 1 : i, r, g.inner, g.from, g.to, o), l = g.from;
          }
          p = g.from;
        } else {
          if (p == e || (c ? He[p - 1] != a : He[p - 1] == a))
            break;
          p--;
        }
      O ? nc(n, p, l, i + 1, r, O, o) : p < l && o.push(new Xi(p, l, d)), l = p;
    }
}
function rc(n, e, t, i, r, s, o) {
  let a = e % 2 ? 2 : 1;
  zS(n, r, s, i, a), MS(n, r, s, i, a), WS(r, s, i, a), nc(n, r, s, e, t, i, o);
}
function xp(n, e, t) {
  if (!n)
    return [new Xi(0, 0, e == Fc ? 1 : 0)];
  if (e == Rr && !t.length && !qS.test(n))
    return wp(n.length);
  if (t.length)
    for (; n.length > He.length; )
      He[He.length] = 256;
  let i = [], r = e == Rr ? 0 : 1;
  return rc(n, r, r, t, 0, n.length, i), i;
}
function wp(n) {
  return [new Xi(0, n, 0)];
}
let Pp = "";
function _p(n, e, t, i, r) {
  var s;
  let o = i.head - n.from, a = Xi.find(e, o, (s = i.bidiLevel) !== null && s !== void 0 ? s : -1, i.assoc), l = e[a], h = l.side(r, t);
  if (o == h) {
    let O = a += r ? 1 : -1;
    if (O < 0 || O >= e.length)
      return null;
    l = e[a = O], o = l.side(!r, t), h = l.side(r, t);
  }
  let c = bi(n.text, o, l.forward(r, t));
  (c < l.from || c > l.to) && (c = h), Pp = n.text.slice(Math.min(o, c), Math.max(o, c));
  let f = a == (r ? e.length - 1 : 0) ? null : e[a + (r ? 1 : -1)];
  return f && c == h && f.level + (r ? 0 : 1) < l.level ? te.cursor(f.side(!r, t) + n.from, f.forward(r, t) ? 1 : -1, f.level) : te.cursor(c + n.from, l.forward(r, t) ? -1 : 1, l.level);
}
function ES(n, e, t) {
  for (let i = e; i < t; i++) {
    let r = yp(n.charCodeAt(i));
    if (r == 1)
      return Rr;
    if (r == 2 || r == 4)
      return Fc;
  }
  return Rr;
}
const Tp = /* @__PURE__ */ se.define(), $p = /* @__PURE__ */ se.define(), Zp = /* @__PURE__ */ se.define(), Rp = /* @__PURE__ */ se.define(), sc = /* @__PURE__ */ se.define(), Xp = /* @__PURE__ */ se.define(), Cp = /* @__PURE__ */ se.define(), Hc = /* @__PURE__ */ se.define(), Jc = /* @__PURE__ */ se.define(), Ap = /* @__PURE__ */ se.define({
  combine: (n) => n.some((e) => e)
}), qp = /* @__PURE__ */ se.define({
  combine: (n) => n.some((e) => e)
}), zp = /* @__PURE__ */ se.define();
class es {
  constructor(e, t, i, r, s, o = !1) {
    this.range = e, this.y = t, this.x = i, this.yMargin = r, this.xMargin = s, this.isSnapshot = o;
  }
  map(e) {
    return e.empty ? this : new es(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new es(te.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const Jo = /* @__PURE__ */ qe.define({ map: (n, e) => n.map(e) }), Mp = /* @__PURE__ */ qe.define();
function Si(n, e, t) {
  let i = n.facet(Rp);
  i.length ? i[0](e) : window.onerror && window.onerror(String(e), t, void 0, void 0, e) || (t ? console.error(t + ":", e) : console.error(e));
}
const kn = /* @__PURE__ */ se.define({ combine: (n) => n.length ? n[0] : !0 });
let jS = 0;
const Ir = /* @__PURE__ */ se.define({
  combine(n) {
    return n.filter((e, t) => {
      for (let i = 0; i < t; i++)
        if (n[i].plugin == e.plugin)
          return !1;
      return !0;
    });
  }
});
class ot {
  constructor(e, t, i, r, s) {
    this.id = e, this.create = t, this.domEventHandlers = i, this.domEventObservers = r, this.baseExtensions = s(this), this.extension = this.baseExtensions.concat(Ir.of({ plugin: this, arg: void 0 }));
  }
  /**
  Create an extension for this plugin with the given argument.
  */
  of(e) {
    return this.baseExtensions.concat(Ir.of({ plugin: this, arg: e }));
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, t) {
    const { eventHandlers: i, eventObservers: r, provide: s, decorations: o } = t || {};
    return new ot(jS++, e, i, r, (a) => {
      let l = [];
      return o && l.push(pl.of((h) => {
        let c = h.plugin(a);
        return c ? o(c) : pe.none;
      })), s && l.push(s(a)), l;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, t) {
    return ot.define((i, r) => new e(i, r), t);
  }
}
class Fl {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  get plugin() {
    return this.spec && this.spec.plugin;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(t);
          } catch (i) {
            if (Si(t.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.plugin.create(e, this.spec.arg);
      } catch (t) {
        Si(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var t;
    if (!((t = this.value) === null || t === void 0) && t.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        Si(e.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const Wp = /* @__PURE__ */ se.define(), dl = /* @__PURE__ */ se.define(), pl = /* @__PURE__ */ se.define(), Ep = /* @__PURE__ */ se.define(), Kc = /* @__PURE__ */ se.define(), jo = /* @__PURE__ */ se.define(), jp = /* @__PURE__ */ se.define();
function yu(n, e) {
  let t = n.state.facet(jp);
  if (!t.length)
    return t;
  let i = t.map((s) => s instanceof Function ? s(n) : s), r = [];
  return Pe.spans(i, e.from, e.to, {
    point() {
    },
    span(s, o, a, l) {
      let h = s - e.from, c = o - e.from, f = r;
      for (let O = a.length - 1; O >= 0; O--, l--) {
        let d = a[O].spec.bidiIsolate, p;
        if (d == null && (d = ES(e.text, h, c)), l > 0 && f.length && (p = f[f.length - 1]).to == h && p.direction == d)
          p.to = c, f = p.inner;
        else {
          let g = { from: h, to: c, direction: d, inner: [] };
          f.push(g), f = g.inner;
        }
      }
    }
  }), r;
}
const Vp = /* @__PURE__ */ se.define();
function ef(n) {
  let e = 0, t = 0, i = 0, r = 0;
  for (let s of n.state.facet(Vp)) {
    let o = s(n);
    o && (o.left != null && (e = Math.max(e, o.left)), o.right != null && (t = Math.max(t, o.right)), o.top != null && (i = Math.max(i, o.top)), o.bottom != null && (r = Math.max(r, o.bottom)));
  }
  return { left: e, right: t, top: i, bottom: r };
}
const Ls = /* @__PURE__ */ se.define();
class ci {
  constructor(e, t, i, r) {
    this.fromA = e, this.toA = t, this.fromB = i, this.toB = r;
  }
  join(e) {
    return new ci(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let t = e.length, i = this;
    for (; t > 0; t--) {
      let r = e[t - 1];
      if (!(r.fromA > i.toA)) {
        if (r.toA < i.fromA)
          break;
        i = i.join(r), e.splice(t - 1, 1);
      }
    }
    return e.splice(t, 0, i), e;
  }
  // Extend a set to cover all the content in `ranges`, which is a
  // flat array with each pair of numbers representing fromB/toB
  // positions. These pairs are generated in unchanged ranges, so the
  // offset between doc A and doc B is the same for their start and
  // end points.
  static extendWithRanges(e, t) {
    if (t.length == 0)
      return e;
    let i = [];
    for (let r = 0, s = 0, o = 0; ; ) {
      let a = r < e.length ? e[r].fromB : 1e9, l = s < t.length ? t[s] : 1e9, h = Math.min(a, l);
      if (h == 1e9)
        break;
      let c = h + o, f = h, O = c;
      for (; ; )
        if (s < t.length && t[s] <= f) {
          let d = t[s + 1];
          s += 2, f = Math.max(f, d);
          for (let p = r; p < e.length && e[p].fromB <= f; p++)
            o = e[p].toA - e[p].toB;
          O = Math.max(O, d + o);
        } else if (r < e.length && e[r].fromB <= f) {
          let d = e[r++];
          f = Math.max(f, d.toB), O = Math.max(O, d.toA), o = d.toA - d.toB;
        } else
          break;
      i.push(new ci(c, O, h, f));
    }
    return i;
  }
}
class Qo {
  constructor(e, t, i) {
    this.view = e, this.state = t, this.transactions = i, this.flags = 0, this.startState = e.state, this.changes = Ot.empty(this.startState.doc.length);
    for (let s of i)
      this.changes = this.changes.compose(s.changes);
    let r = [];
    this.changes.iterChangedRanges((s, o, a, l) => r.push(new ci(s, o, a, l))), this.changedRanges = r;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Qo(e, t, i);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Returns true when
  [`viewportChanged`](https://codemirror.net/6/docs/ref/#view.ViewUpdate.viewportChanged) is true
  and the viewport change is not just the result of mapping it in
  response to document changes.
  */
  get viewportMoved() {
    return (this.flags & 8) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 18) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
const VS = [];
class at {
  constructor(e, t, i = 0) {
    this.dom = e, this.length = t, this.flags = i, this.parent = null, e.cmTile = this;
  }
  get breakAfter() {
    return this.flags & 1;
  }
  get children() {
    return VS;
  }
  isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  isComposite() {
    return !1;
  }
  isLine() {
    return !1;
  }
  isText() {
    return !1;
  }
  isBlock() {
    return !1;
  }
  get domAttrs() {
    return null;
  }
  sync(e) {
    if (this.flags |= 2, this.flags & 4) {
      this.flags &= -5;
      let t = this.domAttrs;
      t && wS(this.dom, t);
    }
  }
  toString() {
    return this.constructor.name + (this.children.length ? `(${this.children})` : "") + (this.breakAfter ? "#" : "");
  }
  destroy() {
    this.parent = null;
  }
  setDOM(e) {
    this.dom = e, e.cmTile = this;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e, t = this.posAtStart) {
    let i = t;
    for (let r of this.children) {
      if (r == e)
        return i;
      i += r.length + r.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  covers(e) {
    return !0;
  }
  coordsIn(e, t, i) {
    return null;
  }
  domPosFor(e, t) {
    let i = nr(this.dom), r = this.length ? e > 0 : t > 0;
    return new Ri(this.parent.dom, i + (r ? 1 : 0), e == 0 || e == this.length);
  }
  markDirty(e) {
    this.flags &= -3, e && (this.flags |= 4), this.parent && this.parent.flags & 2 && this.parent.markDirty(!1);
  }
  get overrideDOMText() {
    return null;
  }
  get root() {
    for (let e = this; e; e = e.parent)
      if (e instanceof ml)
        return e;
    return null;
  }
  static get(e) {
    return e.cmTile;
  }
}
class gl extends at {
  constructor(e) {
    super(e, 0), this._children = [];
  }
  isComposite() {
    return !0;
  }
  get children() {
    return this._children;
  }
  get lastChild() {
    return this.children.length ? this.children[this.children.length - 1] : null;
  }
  append(e) {
    this.children.push(e), e.parent = this;
  }
  sync(e) {
    if (this.flags & 2)
      return;
    super.sync(e);
    let t = this.dom, i = null, r, s = (e == null ? void 0 : e.node) == t ? e : null, o = 0;
    for (let a of this.children) {
      if (a.sync(e), o += a.length + a.breakAfter, r = i ? i.nextSibling : t.firstChild, s && r != a.dom && (s.written = !0), a.dom.parentNode == t)
        for (; r && r != a.dom; )
          r = ku(r);
      else
        t.insertBefore(a.dom, r);
      i = a.dom;
    }
    for (r = i ? i.nextSibling : t.firstChild, s && r && (s.written = !0); r; )
      r = ku(r);
    this.length = o;
  }
}
function ku(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class ml extends gl {
  constructor(e, t) {
    super(t), this.view = e;
  }
  owns(e) {
    for (; e; e = e.parent)
      if (e == this)
        return !0;
    return !1;
  }
  isBlock() {
    return !0;
  }
  nearest(e) {
    for (; ; ) {
      if (!e)
        return null;
      let t = at.get(e);
      if (t && this.owns(t))
        return t;
      e = e.parentNode;
    }
  }
  blockTiles(e) {
    for (let t = [], i = this, r = 0, s = 0; ; )
      if (r == i.children.length) {
        if (!t.length)
          return;
        i = i.parent, i.breakAfter && s++, r = t.pop();
      } else {
        let o = i.children[r++];
        if (o instanceof Pn)
          t.push(r), i = o, r = 0;
        else {
          let a = s + o.length, l = e(o, s);
          if (l !== void 0)
            return l;
          s = a + o.breakAfter;
        }
      }
  }
  // Find the block at the given position. If side < -1, make sure to
  // stay before block widgets at that position, if side > 1, after
  // such widgets (used for selection drawing, which needs to be able
  // to get coordinates for positions that aren't valid cursor positions).
  resolveBlock(e, t) {
    let i, r = -1, s, o = -1;
    if (this.blockTiles((a, l) => {
      let h = l + a.length;
      if (e >= l && e <= h) {
        if (a.isWidget() && t >= -1 && t <= 1) {
          if (a.flags & 32)
            return !0;
          a.flags & 16 && (i = void 0);
        }
        (l < e || e == h && (t < -1 ? a.length : a.covers(1))) && (!i || !a.isWidget() && i.isWidget()) && (i = a, r = e - l), (h > e || e == l && (t > 1 ? a.length : a.covers(-1))) && (!s || !a.isWidget() && s.isWidget()) && (s = a, o = e - l);
      }
    }), !i && !s)
      throw new Error("No tile at position " + e);
    return i && t < 0 || !s ? { tile: i, offset: r } : { tile: s, offset: o };
  }
}
class Pn extends gl {
  constructor(e, t) {
    super(e), this.wrapper = t;
  }
  isBlock() {
    return !0;
  }
  covers(e) {
    return this.children.length ? e < 0 ? this.children[0].covers(-1) : this.lastChild.covers(1) : !1;
  }
  get domAttrs() {
    return this.wrapper.attributes;
  }
  static of(e, t) {
    let i = new Pn(t || document.createElement(e.tagName), e);
    return t || (i.flags |= 4), i;
  }
}
class gs extends gl {
  constructor(e, t) {
    super(e), this.attrs = t;
  }
  isLine() {
    return !0;
  }
  static start(e, t, i) {
    let r = new gs(t || document.createElement("div"), e);
    return (!t || !i) && (r.flags |= 4), r;
  }
  get domAttrs() {
    return this.attrs;
  }
  // Find the tile associated with a given position in this line.
  resolveInline(e, t, i) {
    let r = null, s = -1, o = null, a = -1;
    function l(c, f) {
      for (let O = 0, d = 0; O < c.children.length && d <= f; O++) {
        let p = c.children[O], g = d + p.length;
        g >= f && (p.isComposite() ? l(p, f - d) : (!o || o.isHidden && (t > 0 && !(o.flags & 32) || i && LS(o, p))) && (g > f || p.flags & 32) ? (o = p, a = f - d) : (d < f || p.flags & 16 && !p.isHidden) && (r = p, s = f - d)), d = g;
      }
    }
    l(this, e);
    let h = (t < 0 ? r : o) || r || o;
    return h ? { tile: h, offset: h == r ? s : a } : null;
  }
  coordsIn(e, t, i) {
    let r = this.resolveInline(e, t, !0);
    return r ? r.tile.coordsIn(Math.max(0, r.offset), t, i) : YS(this);
  }
  domIn(e, t) {
    let i = this.resolveInline(e, t);
    if (i) {
      let { tile: r, offset: s } = i;
      if (this.dom.contains(r.dom))
        return r.isText() ? new Ri(r.dom, Math.min(r.dom.nodeValue.length, s)) : r.domPosFor(s, r.flags & 16 ? 1 : r.flags & 32 ? -1 : t);
      let o = i.tile.parent, a = !1;
      for (let l of o.children) {
        if (a)
          return new Ri(l.dom, 0);
        l == i.tile && (a = !0);
      }
    }
    return new Ri(this.dom, 0);
  }
}
function YS(n) {
  let e = n.dom.lastChild;
  if (!e)
    return n.dom.getBoundingClientRect();
  let t = io(e);
  return t[t.length - 1] || null;
}
function LS(n, e) {
  let t = n.coordsIn(0, 1), i = e.coordsIn(0, 1);
  return t && i && i.top < t.bottom;
}
class Ft extends gl {
  constructor(e, t) {
    super(e), this.mark = t;
  }
  get domAttrs() {
    return this.mark.attrs;
  }
  static of(e, t) {
    let i = new Ft(t || document.createElement(e.tagName), e);
    return t || (i.flags |= 4), i;
  }
}
class dr extends at {
  constructor(e, t) {
    super(e, t.length), this.text = t;
  }
  sync(e) {
    this.flags & 2 || (super.sync(e), this.dom.nodeValue != this.text && (e && e.node == this.dom && (e.written = !0), this.dom.nodeValue = this.text));
  }
  isText() {
    return !0;
  }
  toString() {
    return JSON.stringify(this.text);
  }
  coordsIn(e, t, i) {
    let r = this.dom.nodeValue.length;
    e > r && (e = r);
    let s = e, o = e, a = 0;
    e == 0 && t < 0 || e == r && t >= 0 ? ie.chrome || ie.gecko || (e ? (s--, a = 1) : o < r && (o++, a = -1)) : t < 0 ? s-- : o < r && o++;
    let l = vo(this.dom, s, o).getClientRects();
    if (!l.length)
      return null;
    let h = l[(a ? a < 0 : t >= 0) ? 0 : l.length - 1];
    return ie.safari && !a && h.width == 0 && (h = Array.prototype.find.call(l, (c) => c.width) || h), i == null ? h : mo(h, (a ? a > 0 : t < 0) == i);
  }
  static of(e, t) {
    let i = new dr(t || document.createTextNode(e), e);
    return t || (i.flags |= 2), i;
  }
}
class Xr extends at {
  constructor(e, t, i, r) {
    super(e, t, r), this.widget = i;
  }
  isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  covers(e) {
    return this.flags & 48 ? !1 : (this.flags & (e < 0 ? 64 : 128)) > 0;
  }
  coordsIn(e, t) {
    return this.coordsInWidget(e, t, !1);
  }
  coordsInWidget(e, t, i) {
    let r = this.widget.coordsAt(this.dom, e, t);
    if (r)
      return r;
    if (i)
      return mo(this.dom.getBoundingClientRect(), this.length ? e == 0 : t <= 0);
    {
      let s = this.dom.getClientRects(), o = null;
      if (!s.length)
        return null;
      let a = this.flags & 16 ? !0 : this.flags & 32 ? !1 : e > 0;
      for (let l = a ? s.length - 1 : 0; o = s[l], !(e > 0 ? l == 0 : l == s.length - 1 || o.top < o.bottom); l += a ? -1 : 1)
        ;
      return mo(o, !a);
    }
  }
  get overrideDOMText() {
    if (!this.length)
      return je.empty;
    let { root: e } = this;
    if (!e)
      return je.empty;
    let t = this.posAtStart;
    return e.view.state.doc.slice(t, t + this.length);
  }
  destroy() {
    super.destroy(), this.widget.destroy(this.dom);
  }
  static of(e, t, i, r, s) {
    return s || (s = e.toDOM(t), e.editable || (s.contentEditable = "false")), new Xr(s, i, e, r);
  }
}
class Na extends at {
  constructor(e) {
    let t = document.createElement("img");
    t.className = "cm-widgetBuffer", t.setAttribute("aria-hidden", "true"), super(t, 0, e);
  }
  get isHidden() {
    return !0;
  }
  get overrideDOMText() {
    return je.empty;
  }
  coordsIn(e, t, i) {
    let r = this.dom.getBoundingClientRect();
    return i == null ? r : mo(r, t > 0 == i);
  }
}
class DS {
  constructor(e) {
    this.index = 0, this.beforeBreak = !1, this.parents = [], this.tile = e;
  }
  // Advance by the given distance. If side is -1, stop leaving or
  // entering tiles, or skipping zero-length tiles, once the distance
  // has been traversed. When side is 1, leave, enter, or skip
  // everything at the end position.
  advance(e, t, i) {
    let { tile: r, index: s, beforeBreak: o, parents: a } = this;
    for (; e || t > 0; )
      if (r.isComposite())
        if (o) {
          if (!e)
            break;
          i && i.break(), e--, o = !1;
        } else if (s == r.children.length) {
          if (!e && !a.length)
            break;
          i && i.leave(r), o = !!r.breakAfter, { tile: r, index: s } = a.pop(), s++;
        } else {
          let l = r.children[s], h = l.breakAfter;
          (t > 0 ? l.length <= e : l.length < e) && (!i || i.skip(l, 0, l.length) !== !1 || !l.isComposite) ? (o = !!h, s++, e -= l.length) : (a.push({ tile: r, index: s }), r = l, s = 0, i && l.isComposite() && i.enter(l));
        }
      else if (s == r.length)
        o = !!r.breakAfter, { tile: r, index: s } = a.pop(), s++;
      else if (e) {
        let l = Math.min(e, r.length - s);
        i && i.skip(r, s, s + l), e -= l, s += l;
      } else
        break;
    return this.tile = r, this.index = s, this.beforeBreak = o, this;
  }
  get root() {
    return this.parents.length ? this.parents[0].tile : this.tile;
  }
}
class GS {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.wrapper = i, this.rank = r;
  }
}
class IS {
  constructor(e, t, i) {
    this.cache = e, this.root = t, this.blockWrappers = i, this.curLine = null, this.lastBlock = null, this.afterWidget = null, this.pos = 0, this.wrappers = [], this.wrapperPos = 0;
  }
  addText(e, t, i, r) {
    var s;
    this.flushBuffer();
    let o = this.ensureMarks(t, i), a = o.lastChild;
    if (a && a.isText() && !(a.flags & 8) && a.length + e.length < 512) {
      this.cache.reused.set(
        a,
        2
        /* Reused.DOM */
      );
      let l = o.children[o.children.length - 1] = new dr(a.dom, a.text + e);
      l.parent = o;
    } else
      o.append(r || dr.of(e, (s = this.cache.find(dr)) === null || s === void 0 ? void 0 : s.dom));
    this.pos += e.length, this.afterWidget = null;
  }
  addComposition(e, t) {
    let i = this.curLine;
    i.dom != t.line.dom && (i.setDOM(this.cache.reused.has(t.line) ? Hl(t.line.dom) : t.line.dom), this.cache.reused.set(
      t.line,
      2
      /* Reused.DOM */
    ));
    let r = i;
    for (let a = t.marks.length - 1; a >= 0; a--) {
      let l = t.marks[a], h = r.lastChild;
      if (h instanceof Ft && h.mark.eq(l.mark))
        h.dom != l.dom && h.setDOM(Hl(l.dom)), r = h;
      else {
        if (this.cache.reused.get(l)) {
          let f = at.get(l.dom);
          f && f.setDOM(Hl(l.dom));
        }
        let c = Ft.of(l.mark, l.dom);
        r.append(c), r = c;
      }
      this.cache.reused.set(
        l,
        2
        /* Reused.DOM */
      );
    }
    let s = at.get(e.text);
    s && this.cache.reused.set(
      s,
      2
      /* Reused.DOM */
    );
    let o = new dr(e.text, e.text.nodeValue);
    o.flags |= 8, this.pos = e.range.toB, r.append(o);
  }
  addInlineWidget(e, t, i) {
    let r = this.afterWidget && e.flags & 48 && (this.afterWidget.flags & 48) == (e.flags & 48);
    r || this.flushBuffer();
    let s = this.ensureMarks(t, i);
    !r && !(e.flags & 16) && s.append(this.getBuffer(1)), s.append(e), this.pos += e.length, this.afterWidget = e;
  }
  addMark(e, t, i) {
    this.flushBuffer(), this.ensureMarks(t, i).append(e), this.pos += e.length, this.afterWidget = null;
  }
  addBlockWidget(e) {
    this.getBlockPos().append(e), this.pos += e.length, this.lastBlock = e, this.endLine();
  }
  continueWidget(e) {
    let t = this.afterWidget || this.lastBlock;
    t.length += e, this.pos += e;
  }
  addLineStart(e, t) {
    var i;
    e || (e = Yp);
    let r = gs.start(e, t || ((i = this.cache.find(gs)) === null || i === void 0 ? void 0 : i.dom), !!t);
    this.getBlockPos().append(this.lastBlock = this.curLine = r);
  }
  addLine(e) {
    this.getBlockPos().append(e), this.pos += e.length, this.lastBlock = e, this.endLine();
  }
  addBreak() {
    this.lastBlock.flags |= 1, this.endLine(), this.pos++;
  }
  addLineStartIfNotCovered(e) {
    this.blockPosCovered() || this.addLineStart(e);
  }
  ensureLine(e) {
    this.curLine || this.addLineStart(e);
  }
  ensureMarks(e, t) {
    var i;
    let r = this.curLine;
    for (let s = e.length - 1; s >= 0; s--) {
      let o = e[s], a;
      if (t > 0 && (a = r.lastChild) && a instanceof Ft && a.mark.eq(o))
        r = a, t--;
      else {
        let l = Ft.of(o, (i = this.cache.find(Ft, (h) => h.mark.eq(o))) === null || i === void 0 ? void 0 : i.dom);
        r.append(l), r = l, t = 0;
      }
    }
    return r;
  }
  endLine() {
    if (this.curLine) {
      this.flushBuffer();
      let e = this.curLine.lastChild;
      (!e || !xu(this.curLine, !1) || e.dom.nodeName != "BR" && e.isWidget() && !(ie.ios && xu(this.curLine, !0))) && this.curLine.append(this.cache.findWidget(
        Jl,
        0,
        32
        /* TileFlag.After */
      ) || new Xr(
        Jl.toDOM(),
        0,
        Jl,
        32
        /* TileFlag.After */
      )), this.curLine = this.afterWidget = null;
    }
  }
  updateBlockWrappers() {
    this.wrapperPos > this.pos + 1e4 && (this.blockWrappers.goto(this.pos), this.wrappers.length = 0);
    for (let e = this.wrappers.length - 1; e >= 0; e--)
      this.wrappers[e].to < this.pos && this.wrappers.splice(e, 1);
    for (let e = this.blockWrappers; e.value && e.from <= this.pos; e.next())
      if (e.to >= this.pos) {
        let t = e.rank * 102 + e.value.rank, i = new GS(e.from, e.to, e.value, t), r = this.wrappers.length;
        for (; r > 0 && (this.wrappers[r - 1].rank - i.rank || this.wrappers[r - 1].to - i.to) < 0; )
          r--;
        this.wrappers.splice(r, 0, i);
      }
    this.wrapperPos = this.pos;
  }
  getBlockPos() {
    var e;
    this.updateBlockWrappers();
    let t = this.root;
    for (let i of this.wrappers) {
      let r = t.lastChild;
      if (i.from < this.pos && r instanceof Pn && r.wrapper.eq(i.wrapper))
        t = r;
      else {
        let s = Pn.of(i.wrapper, (e = this.cache.find(Pn, (o) => o.wrapper.eq(i.wrapper))) === null || e === void 0 ? void 0 : e.dom);
        t.append(s), t = s;
      }
    }
    return t;
  }
  blockPosCovered() {
    let e = this.lastBlock;
    return e != null && !e.breakAfter && (!e.isWidget() || (e.flags & 160) > 0);
  }
  getBuffer(e) {
    let t = 2 | (e < 0 ? 16 : 32), i = this.cache.find(
      Na,
      void 0,
      1
      /* Reused.Full */
    );
    return i && (i.flags = t), i || new Na(t);
  }
  flushBuffer() {
    this.afterWidget && !(this.afterWidget.flags & 32) && (this.afterWidget.parent.append(this.getBuffer(-1)), this.afterWidget = null);
  }
}
class US {
  constructor(e) {
    this.skipCount = 0, this.text = "", this.textOff = 0, this.cursor = e.iter();
  }
  skip(e) {
    this.textOff + e <= this.text.length ? this.textOff += e : (this.skipCount += e - (this.text.length - this.textOff), this.text = "", this.textOff = 0);
  }
  next(e) {
    if (this.textOff == this.text.length) {
      let { value: r, lineBreak: s, done: o } = this.cursor.next(this.skipCount);
      if (this.skipCount = 0, o)
        throw new Error("Ran out of text content when drawing inline views");
      this.text = r;
      let a = this.textOff = Math.min(e, r.length);
      return s ? null : r.slice(0, a);
    }
    let t = Math.min(this.text.length, this.textOff + e), i = this.text.slice(this.textOff, t);
    return this.textOff = t, i;
  }
}
const Ba = [Xr, gs, dr, Ft, Na, Pn, ml];
for (let n = 0; n < Ba.length; n++)
  Ba[n].bucket = n;
class NS {
  constructor(e) {
    this.view = e, this.buckets = Ba.map(() => []), this.index = Ba.map(() => 0), this.reused = /* @__PURE__ */ new Map();
  }
  // Put a tile in the cache.
  add(e) {
    let t = e.constructor.bucket, i = this.buckets[t];
    i.length < 6 ? i.push(e) : i[
      this.index[t] = (this.index[t] + 1) % 6
      /* C.Bucket */
    ] = e;
  }
  find(e, t, i = 2) {
    let r = e.bucket, s = this.buckets[r], o = this.index[r];
    for (let a = 0; a < s.length; a++) {
      let l = (a + o) % s.length, h = s[l];
      if ((!t || t(h)) && !this.reused.has(h))
        return s.splice(l, 1), l < o && this.index[r]--, this.reused.set(h, i), h;
    }
    return null;
  }
  findWidget(e, t, i) {
    let r = this.buckets[0];
    if (r.length)
      for (let s = 0, o = 0; ; s++) {
        if (s == r.length) {
          if (o)
            return null;
          o = 1, s = 0;
        }
        let a = r[s];
        if (!this.reused.has(a) && (o == 0 ? a.widget.compare(e) : a.widget.constructor == e.constructor && e.updateDOM(a.dom, this.view, a.widget)))
          return r.splice(s, 1), s < this.index[0] && this.index[0]--, a.widget == e && a.length == t && (a.flags & 497) == i ? (this.reused.set(
            a,
            1
            /* Reused.Full */
          ), a) : (this.reused.set(
            a,
            2
            /* Reused.DOM */
          ), new Xr(a.dom, t, e, a.flags & -498 | i));
      }
  }
  reuse(e) {
    return this.reused.set(
      e,
      1
      /* Reused.Full */
    ), e;
  }
  maybeReuse(e, t = 2) {
    if (!this.reused.has(e))
      return this.reused.set(e, t), e.dom;
  }
  clear() {
    for (let e = 0; e < this.buckets.length; e++)
      this.buckets[e].length = this.index[e] = 0;
  }
}
class BS {
  constructor(e, t, i, r, s) {
    this.view = e, this.decorations = r, this.disallowBlockEffectsFor = s, this.openWidget = !1, this.openMarks = 0, this.cache = new NS(e), this.text = new US(e.state.doc), this.builder = new IS(this.cache, new ml(e, e.contentDOM), Pe.iter(i)), this.cache.reused.set(
      t,
      2
      /* Reused.DOM */
    ), this.old = new DS(t), this.reuseWalker = {
      skip: (o, a, l) => {
        if (this.cache.add(o), o.isComposite())
          return !1;
      },
      enter: (o) => this.cache.add(o),
      leave: () => {
      },
      break: () => {
      }
    };
  }
  run(e, t) {
    let i = t && this.getCompositionContext(t.text);
    for (let r = 0, s = 0, o = 0; ; ) {
      let a = o < e.length ? e[o++] : null, l = a ? a.fromA : this.old.root.length;
      if (l > r) {
        let h = l - r;
        this.preserve(h, !o, !a), r = l, s += h;
      }
      if (!a)
        break;
      t && a.fromA <= t.range.fromA && a.toA >= t.range.toA ? (this.forward(a.fromA, t.range.fromA, t.range.fromA < t.range.toA ? 1 : -1), this.emit(s, t.range.fromB), this.builder.flushBuffer(), this.cache.clear(), this.builder.addComposition(t, i), this.text.skip(t.range.toB - t.range.fromB), this.forward(t.range.fromA, a.toA), this.emit(t.range.toB, a.toB)) : (this.forward(a.fromA, a.toA), this.emit(s, a.toB)), s = a.toB, r = a.toA;
    }
    return this.builder.curLine && this.builder.endLine(), this.builder.root;
  }
  preserve(e, t, i) {
    let r = JS(this.old), s = this.openMarks;
    this.old.advance(e, i ? 1 : -1, {
      skip: (o, a, l) => {
        if (o.isWidget())
          if (this.openWidget)
            this.builder.continueWidget(l - a);
          else {
            let h = l > 0 || a < o.length ? Xr.of(o.widget, this.view, l - a, o.flags & 496, this.cache.maybeReuse(o)) : this.cache.reuse(o);
            h.flags & 256 ? (h.flags &= -2, this.builder.addBlockWidget(h)) : (this.builder.ensureLine(null), this.builder.addInlineWidget(h, r, s), s = r.length);
          }
        else if (o.isText())
          this.builder.ensureLine(null), !a && l == o.length && !this.cache.reused.has(o) ? this.builder.addText(o.text, r, s, this.cache.reuse(o)) : (this.cache.add(o), this.builder.addText(o.text.slice(a, l), r, s)), s = r.length;
        else if (o.isLine())
          o.flags &= -2, this.cache.reused.set(
            o,
            1
            /* Reused.Full */
          ), this.builder.addLine(o);
        else if (o instanceof Na)
          this.cache.add(o);
        else if (o instanceof Ft)
          this.builder.ensureLine(null), this.builder.addMark(o, r, s), this.cache.reused.set(
            o,
            1
            /* Reused.Full */
          ), s = r.length;
        else
          return !1;
        this.openWidget = !1;
      },
      enter: (o) => {
        o.isLine() ? this.builder.addLineStart(o.attrs, this.cache.maybeReuse(o)) : (this.cache.add(o), o instanceof Ft && r.unshift(o.mark)), this.openWidget = !1;
      },
      leave: (o) => {
        o.isLine() ? r.length && (r.length = s = 0) : o instanceof Ft && (r.shift(), s = Math.min(s, r.length));
      },
      break: () => {
        this.builder.addBreak(), this.openWidget = !1;
      }
    }), this.text.skip(e);
  }
  emit(e, t) {
    let i = null, r = this.builder, s = 0, o = Pe.spans(this.decorations, e, t, {
      point: (a, l, h, c, f, O) => {
        if (h instanceof Zr) {
          if (this.disallowBlockEffectsFor[O]) {
            if (h.block)
              throw new RangeError("Block decorations may not be specified via plugins");
            if (l > this.view.state.doc.lineAt(a).to)
              throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
          }
          if (s = c.length, f > c.length)
            r.continueWidget(l - a);
          else {
            let d = h.widget || (h.block ? ms.block : ms.inline), p = FS(h), g = this.cache.findWidget(d, l - a, p) || Xr.of(d, this.view, l - a, p);
            h.block ? (h.startSide > 0 && r.addLineStartIfNotCovered(i), r.addBlockWidget(g)) : (r.ensureLine(i), r.addInlineWidget(g, c, f));
          }
          i = null;
        } else
          i = HS(i, h);
        l > a && this.text.skip(l - a);
      },
      span: (a, l, h, c) => {
        for (let f = a; f < l; ) {
          let O = this.text.next(Math.min(512, l - f));
          O == null ? (r.addLineStartIfNotCovered(i), r.addBreak(), f++) : (r.ensureLine(i), r.addText(O, h, f == a ? c : h.length), f += O.length), i = null;
        }
        s = h.length;
      }
    });
    this.openWidget = o > s, this.openWidget || r.addLineStartIfNotCovered(i), this.openMarks = o;
  }
  forward(e, t, i = 1) {
    t - e <= 10 ? this.old.advance(t - e, i, this.reuseWalker) : (this.old.advance(5, -1, this.reuseWalker), this.old.advance(t - e - 10, -1), this.old.advance(5, i, this.reuseWalker));
  }
  getCompositionContext(e) {
    let t = [], i = null;
    for (let r = e.parentNode; ; r = r.parentNode) {
      let s = at.get(r);
      if (r == this.view.contentDOM)
        break;
      s instanceof Ft ? t.push(s) : s != null && s.isLine() ? i = s : s instanceof Pn || (r.nodeName == "DIV" && !i && r != this.view.contentDOM ? i = new gs(r, Yp) : i || t.push(Ft.of(new Wo({ tagName: r.nodeName.toLowerCase(), attributes: PS(r) }), r)));
    }
    return { line: i, marks: t };
  }
}
function xu(n, e) {
  let t = (i) => {
    for (let r of i.children)
      if ((e ? r.isText() : r.length) || t(r))
        return !0;
    return !1;
  };
  return t(n);
}
function FS(n) {
  let e = n.isReplace ? (n.startSide < 0 ? 64 : 0) | (n.endSide > 0 ? 128 : 0) : n.startSide > 0 ? 32 : 16;
  return n.block && (e |= 256), e;
}
const Yp = { class: "cm-line" };
function HS(n, e) {
  let t = e.spec.attributes, i = e.spec.class;
  return !t && !i || (n || (n = { class: "cm-line" }), t && Nc(t, n), i && (n.class += " " + i)), n;
}
function JS(n) {
  let e = [];
  for (let t = n.parents.length; t > 1; t--) {
    let i = t == n.parents.length ? n.tile : n.parents[t].tile;
    i instanceof Ft && e.push(i.mark);
  }
  return e;
}
function Hl(n) {
  let e = at.get(n);
  return e && e.setDOM(n.cloneNode()), n;
}
class ms extends qi {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
ms.inline = /* @__PURE__ */ new ms("span");
ms.block = /* @__PURE__ */ new ms("div");
const Jl = /* @__PURE__ */ new class extends qi {
  toDOM() {
    return document.createElement("br");
  }
  get isHidden() {
    return !0;
  }
  get editable() {
    return !0;
  }
}();
class wu {
  constructor(e) {
    this.view = e, this.decorations = [], this.blockWrappers = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.editContextFormatting = pe.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.updateDeco(), this.tile = new ml(e, e.contentDOM), this.updateInner([new ci(0, 0, 0, e.state.doc.length)], null);
  }
  // Update the document view to a given state.
  update(e) {
    var t;
    let i = e.changedRanges;
    this.minWidth > 0 && i.length && (i.every(({ fromA: c, toA: f }) => f < this.minWidthFrom || c > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(e);
    let r = -1;
    this.view.inputState.composing >= 0 && !this.view.observer.editContext && (!((t = this.domChanged) === null || t === void 0) && t.newSel ? r = this.domChanged.newSel.head : !ay(e.changes, this.hasComposition) && !e.selectionSet && (r = e.state.selection.main.head));
    let s = r > -1 ? ey(this.view, e.changes, r) : null;
    if (this.domChanged = null, this.hasComposition) {
      let { from: c, to: f } = this.hasComposition;
      i = new ci(c, f, e.changes.mapPos(c, -1), e.changes.mapPos(f, 1)).addToSet(i.slice());
    }
    this.hasComposition = s ? { from: s.range.fromB, to: s.range.toB } : null, (ie.ie || ie.chrome) && !s && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let o = this.decorations, a = this.blockWrappers;
    this.updateDeco();
    let l = ny(o, this.decorations, e.changes);
    l.length && (i = ci.extendWithRanges(i, l));
    let h = sy(a, this.blockWrappers, e.changes);
    return h.length && (i = ci.extendWithRanges(i, h)), s && !i.some((c) => c.fromA <= s.range.fromA && c.toA >= s.range.toA) && (i = s.range.addToSet(i.slice())), this.tile.flags & 2 && i.length == 0 ? !1 : (this.updateInner(i, s), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, t) {
    this.view.viewState.mustMeasureContent = !0;
    let { observer: i } = this.view;
    i.ignore(() => {
      if (t || e.length) {
        let o = this.tile, a = new BS(this.view, o, this.blockWrappers, this.decorations, this.dynamicDecorationMap);
        t && at.get(t.text) && a.cache.reused.set(
          at.get(t.text),
          2
          /* Reused.DOM */
        ), this.tile = a.run(e, t), oc(o, a.cache.reused);
      }
      this.tile.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.tile.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let s = ie.chrome || ie.ios ? { node: i.selectionRange.focusNode, written: !1 } : void 0;
      this.tile.sync(s), s && (s.written || i.selectionRange.focusNode != s.node || !this.tile.dom.contains(s.node)) && (this.forceSelection = !0), this.tile.dom.style.height = "";
    });
    let r = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let s of this.tile.children)
        s.isWidget() && s.widget instanceof Kl && r.push(s.dom);
    i.updateGaps(r);
  }
  updateEditContextFormatting(e) {
    this.editContextFormatting = this.editContextFormatting.map(e.changes);
    for (let t of e.transactions)
      for (let i of t.effects)
        i.is(Mp) && (this.editContextFormatting = i.value);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, t = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let { dom: i } = this.tile, r = this.view.root.activeElement, s = r == i, o = !s && !(this.view.state.facet(kn) || i.tabIndex > -1) && to(i, this.view.observer.selectionRange) && !(r && i.contains(r));
    if (!(s || t || o))
      return;
    let a = this.forceSelection;
    this.forceSelection = !1;
    let l = this.view.state.selection.main, h, c;
    if (l.empty ? c = h = this.inlineDOMNearPos(l.anchor, l.assoc || 1) : (c = this.inlineDOMNearPos(l.head, l.head == l.from ? 1 : -1), h = this.inlineDOMNearPos(l.anchor, l.anchor == l.from ? 1 : -1)), ie.gecko && l.empty && !this.hasComposition && KS(h)) {
      let O = document.createTextNode("");
      this.view.observer.ignore(() => h.node.insertBefore(O, h.node.childNodes[h.offset] || null)), h = c = new Ri(O, 0), a = !0;
    }
    let f = this.view.observer.selectionRange;
    (a || !f.focusNode || (!no(h.node, h.offset, f.anchorNode, f.anchorOffset) || !no(c.node, c.offset, f.focusNode, f.focusOffset)) && !this.suppressWidgetCursorChange(f, l)) && (this.view.observer.ignore(() => {
      ie.android && ie.chrome && i.contains(f.focusNode) && oy(f.focusNode, i) && (i.blur(), i.focus({ preventScroll: !0 }));
      let O = go(this.view.root);
      if (O) if (l.empty) {
        if (ie.gecko) {
          let d = ty(h.node, h.offset);
          if (d && d != 3) {
            let p = (d == 1 ? Qp : bp)(h.node, h.offset);
            p && (h = new Ri(p.node, p.offset));
          }
        }
        O.collapse(h.node, h.offset), l.bidiLevel != null && O.caretBidiLevel !== void 0 && (O.caretBidiLevel = l.bidiLevel);
      } else if (O.extend) {
        O.collapse(h.node, h.offset);
        try {
          O.extend(c.node, c.offset);
        } catch {
        }
      } else {
        let d = document.createRange();
        l.anchor > l.head && ([h, c] = [c, h]), d.setEnd(c.node, c.offset), d.setStart(h.node, h.offset), O.removeAllRanges(), O.addRange(d);
      }
      o && this.view.root.activeElement == i && (i.blur(), r && r.focus());
    }), this.view.observer.setSelectionRange(h, c)), this.impreciseAnchor = h.precise ? null : new Ri(f.anchorNode, f.anchorOffset), this.impreciseHead = c.precise ? null : new Ri(f.focusNode, f.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(e, t) {
    return this.hasComposition && t.empty && no(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, t = e.state.selection.main, i = go(e.root), { anchorNode: r, anchorOffset: s } = e.observer.selectionRange;
    if (!i || !t.empty || !t.assoc || !i.modify)
      return;
    let o = this.lineAt(t.head, t.assoc);
    if (!o)
      return;
    let a = o.posAtStart;
    if (t.head == a || t.head == a + o.length)
      return;
    let l = this.coordsAt(t.head, -1), h = this.coordsAt(t.head, 1);
    if (!l || !h || l.bottom > h.top)
      return;
    let c = this.domAtPos(t.head + t.assoc, t.assoc);
    i.collapse(c.node, c.offset), i.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let f = e.observer.selectionRange;
    e.docView.posFromDOM(f.anchorNode, f.anchorOffset) != t.from && i.collapse(r, s);
  }
  posFromDOM(e, t) {
    let i = this.tile.nearest(e);
    if (!i)
      return this.tile.dom.compareDocumentPosition(e) & 2 ? 0 : this.view.state.doc.length;
    let r = i.posAtStart;
    if (i.isComposite()) {
      let s;
      if (e == i.dom)
        s = i.dom.childNodes[t];
      else {
        let o = Rn(e) == 0 ? 0 : t == 0 ? -1 : 1;
        for (; ; ) {
          let a = e.parentNode;
          if (a == i.dom)
            break;
          o == 0 && a.firstChild != a.lastChild && (e == a.firstChild ? o = -1 : o = 1), e = a;
        }
        o < 0 ? s = e : s = e.nextSibling;
      }
      if (s == i.dom.firstChild)
        return r;
      for (; s && !at.get(s); )
        s = s.nextSibling;
      if (!s)
        return r + i.length;
      for (let o = 0, a = r; ; o++) {
        let l = i.children[o];
        if (l.dom == s)
          return a;
        a += l.length + l.breakAfter;
      }
    } else return i.isText() ? e == i.dom ? r + t : r + (t ? i.length : 0) : r;
  }
  domAtPos(e, t) {
    let { tile: i, offset: r } = this.tile.resolveBlock(e, t);
    return i.isWidget() ? i.domPosFor(r, t) : i.domIn(r, t);
  }
  inlineDOMNearPos(e, t) {
    let i, r = -1, s = !1, o, a = -1, l = !1;
    return this.tile.blockTiles((h, c) => {
      if (h.isWidget()) {
        if (h.flags & 32 && c >= e)
          return !0;
        h.flags & 16 && (s = !0);
      } else {
        let f = c + h.length;
        if (c <= e && (i = h, r = e - c, s = f < e), f >= e && !o && (o = h, a = e - c, l = c > e), c > e && o)
          return !0;
      }
    }), !i && !o ? this.domAtPos(e, t) : (s && o ? i = null : l && i && (o = null), i && t < 0 || !o ? i.domIn(r, t) : o.domIn(a, t));
  }
  // Get the coord of the element at the given side of the given
  // position. If rtl is given, flatten it using that text direction.
  coordsAt(e, t, i) {
    let { tile: r, offset: s } = this.tile.resolveBlock(e, t);
    return r.isWidget() ? r.widget instanceof Kl ? null : r.coordsInWidget(s, t, !0) : r.coordsIn(s, t, i);
  }
  lineAt(e, t) {
    let { tile: i } = this.tile.resolveBlock(e, t);
    return i.isLine() ? i : null;
  }
  coordsForChar(e) {
    let { tile: t, offset: i } = this.tile.resolveBlock(e, 1);
    if (!t.isLine())
      return null;
    function r(s, o) {
      if (s.isComposite())
        for (let a of s.children) {
          if (a.length >= o) {
            let l = r(a, o);
            if (l)
              return l;
          }
          if (o -= a.length, o < 0)
            break;
        }
      else if (s.isText() && o < s.length) {
        let a = bi(s.text, o);
        if (a == o)
          return null;
        let l = vo(s.dom, o, a).getClientRects();
        for (let h = 0; h < l.length; h++) {
          let c = l[h];
          if (h == l.length - 1 || c.top < c.bottom && c.left < c.right)
            return c;
        }
      }
      return null;
    }
    return r(t, i);
  }
  measureVisibleLineHeights(e) {
    let t = [], { from: i, to: r } = e, s = this.view.contentDOM.clientWidth, o = s > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, a = -1, l = this.view.textDirection == Ie.LTR, h = 0, c = (f, O, d) => {
      for (let p = 0; p < f.children.length && !(O > r); p++) {
        let g = f.children[p], m = O + g.length, v = g.dom.getBoundingClientRect(), { height: w } = v;
        if (d && !p && (h += v.top - d.top), g instanceof Pn)
          m > i && c(g, O, v);
        else if (O >= i && (h > 0 && t.push(-h), t.push(w + h), h = 0, o)) {
          let S = g.dom.lastChild, Q = S ? io(S) : [];
          if (Q.length) {
            let b = Q[Q.length - 1], y = l ? b.right - v.left : v.right - b.left;
            y > a && (a = y, this.minWidth = s, this.minWidthFrom = O, this.minWidthTo = m);
          }
        }
        d && p == f.children.length - 1 && (h += d.bottom - v.bottom), O = m + g.breakAfter;
      }
    };
    return c(this.tile, 0, null), t;
  }
  textDirectionAt(e) {
    let { tile: t } = this.tile.resolveBlock(e, 1);
    return getComputedStyle(t.dom).direction == "rtl" ? Ie.RTL : Ie.LTR;
  }
  measureTextSize() {
    let e = this.tile.blockTiles((o) => {
      if (o.isLine() && o.children.length && o.length <= 20) {
        let a = 0, l;
        for (let h of o.children) {
          if (!h.isText() || /[^ -~]/.test(h.text))
            return;
          let c = io(h.dom);
          if (c.length != 1)
            return;
          a += c[0].width, l = c[0].height;
        }
        if (a)
          return {
            lineHeight: o.dom.getBoundingClientRect().height,
            charWidth: a / o.length,
            textHeight: l
          };
      }
    });
    if (e)
      return e;
    let t = document.createElement("div"), i, r, s;
    return t.className = "cm-line", t.style.width = "99999px", t.style.position = "absolute", t.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.tile.dom.appendChild(t);
      let o = io(t.firstChild)[0];
      i = t.getBoundingClientRect().height, r = o && o.width ? o.width / 27 : 7, s = o && o.height ? o.height : i, t.remove();
    }), { lineHeight: i, charWidth: r, textHeight: s };
  }
  computeBlockGapDeco() {
    let e = [], t = this.view.viewState;
    for (let i = 0, r = 0; ; r++) {
      let s = r == t.viewports.length ? null : t.viewports[r], o = s ? s.from - 1 : this.view.state.doc.length;
      if (o > i) {
        let a = (t.lineBlockAt(o).bottom - t.lineBlockAt(i).top) / this.view.scaleY;
        e.push(pe.replace({
          widget: new Kl(a),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, o));
      }
      if (!s)
        break;
      i = s.to + 1;
    }
    return pe.set(e);
  }
  updateDeco() {
    let e = 1, t = this.view.state.facet(pl).map((s) => (this.dynamicDecorationMap[e++] = typeof s == "function") ? s(this.view) : s), i = !1, r = this.view.state.facet(Kc).map((s, o) => {
      let a = typeof s == "function";
      return a && (i = !0), a ? s(this.view) : s;
    });
    for (r.length && (this.dynamicDecorationMap[e++] = i, t.push(Pe.join(r))), this.decorations = [
      this.editContextFormatting,
      ...t,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ]; e < this.decorations.length; )
      this.dynamicDecorationMap[e++] = !1;
    this.blockWrappers = this.view.state.facet(Ep).map((s) => typeof s == "function" ? s(this.view) : s);
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let h = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = h.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    for (let h of this.view.state.facet(zp))
      try {
        if (h(this.view, e.range, e))
          return !0;
      } catch (c) {
        Si(this.view.state, c, "scroll handler");
      }
    let { range: t } = e, i = this.coordsAt(t.head, t.assoc || (t.head > t.anchor ? -1 : 1)), r;
    if (!i)
      return;
    !t.empty && (r = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (i = {
      left: Math.min(i.left, r.left),
      top: Math.min(i.top, r.top),
      right: Math.max(i.right, r.right),
      bottom: Math.max(i.bottom, r.bottom)
    });
    let s = ef(this.view), o = {
      left: i.left - s.left,
      top: i.top - s.top,
      right: i.right + s.right,
      bottom: i.bottom + s.bottom
    }, { offsetWidth: a, offsetHeight: l } = this.view.scrollDOM;
    if ($S(this.view.scrollDOM, o, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, a), -a), Math.max(Math.min(e.yMargin, l), -l), this.view.textDirection == Ie.LTR), window.visualViewport && window.innerHeight - window.visualViewport.height > 1 && (i.top > window.pageYOffset + window.visualViewport.offsetTop + window.visualViewport.height || i.bottom < window.pageYOffset + window.visualViewport.offsetTop)) {
      let h = this.view.docView.lineAt(t.head, 1);
      h && h.dom.scrollIntoView({ block: "nearest" });
    }
  }
  lineHasWidget(e) {
    let t = (i) => i.isWidget() || i.children.some(t);
    return t(this.tile.resolveBlock(e, 1).tile);
  }
  destroy() {
    oc(this.tile);
  }
}
function oc(n, e) {
  let t = e == null ? void 0 : e.get(n);
  if (t != 1) {
    t == null && n.destroy();
    for (let i of n.children)
      oc(i, e);
  }
}
function KS(n) {
  return n.node.nodeType == 1 && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
function Lp(n, e) {
  let t = n.observer.selectionRange;
  if (!t.focusNode)
    return null;
  let i = Qp(t.focusNode, t.focusOffset), r = bp(t.focusNode, t.focusOffset), s = i || r;
  if (r && i && r.node != i.node) {
    let a = at.get(r.node);
    if (!a || a.isText() && a.text != r.node.nodeValue)
      s = r;
    else if (n.docView.lastCompositionAfterCursor) {
      let l = at.get(i.node);
      !l || l.isText() && l.text != i.node.nodeValue || (s = r);
    }
  }
  if (n.docView.lastCompositionAfterCursor = s != i, !s)
    return null;
  let o = e - s.offset;
  return { from: o, to: o + s.node.nodeValue.length, node: s.node };
}
function ey(n, e, t) {
  let i = Lp(n, t);
  if (!i)
    return null;
  let { node: r, from: s, to: o } = i, a = r.nodeValue;
  if (/[\n\r]/.test(a) || n.state.doc.sliceString(i.from, i.to) != a)
    return null;
  let l = e.invertedDesc;
  return { range: new ci(l.mapPos(s), l.mapPos(o), s, o), text: r };
}
function ty(n, e) {
  return n.nodeType != 1 ? 0 : (e && n.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < n.childNodes.length && n.childNodes[e].contentEditable == "false" ? 2 : 0);
}
let iy = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    Jr(e, t, this.changes);
  }
  comparePoint(e, t) {
    Jr(e, t, this.changes);
  }
  boundChange(e) {
    Jr(e, e, this.changes);
  }
};
function ny(n, e, t) {
  let i = new iy();
  return Pe.compare(n, e, t, i), i.changes;
}
class ry {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    Jr(e, t, this.changes);
  }
  comparePoint() {
  }
  boundChange(e) {
    Jr(e, e, this.changes);
  }
}
function sy(n, e, t) {
  let i = new ry();
  return Pe.compare(n, e, t, i), i.changes;
}
function oy(n, e) {
  for (let t = n; t && t != e; t = t.assignedSlot || t.parentNode)
    if (t.nodeType == 1 && t.contentEditable == "false")
      return !0;
  return !1;
}
function ay(n, e) {
  let t = !1;
  return e && n.iterChangedRanges((i, r) => {
    i < e.to && r > e.from && (t = !0);
  }), t;
}
class Kl extends qi {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return e.className = "cm-gap", this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
  ignoreEvent() {
    return !1;
  }
}
function ly(n, e, t = 1) {
  let i = n.charCategorizer(e), r = n.doc.lineAt(e), s = e - r.from;
  if (r.length == 0)
    return te.cursor(e);
  s == 0 ? t = 1 : s == r.length && (t = -1);
  let o = s, a = s;
  t < 0 ? o = bi(r.text, s, !1) : a = bi(r.text, s);
  let l = i(r.text.slice(o, a));
  for (; o > 0; ) {
    let h = bi(r.text, o, !1);
    if (i(r.text.slice(h, o)) != l)
      break;
    o = h;
  }
  for (; a < r.length; ) {
    let h = bi(r.text, a);
    if (i(r.text.slice(a, h)) != l)
      break;
    a = h;
  }
  return te.undirectionalRange(o + r.from, a + r.from);
}
function hy(n, e, t, i, r) {
  let s = Math.round((i - e.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && t.height > n.defaultLineHeight * 1.5) {
    let a = n.viewState.heightOracle.textHeight, l = Math.floor((r - t.top - (n.defaultLineHeight - a) * 0.5) / a);
    s += l * n.viewState.heightOracle.lineLength;
  }
  let o = n.state.sliceDoc(t.from, t.to);
  return t.from + Ga(o, s, n.state.tabSize);
}
function ac(n, e, t) {
  let i = n.lineBlockAt(e);
  if (Array.isArray(i.type)) {
    let r;
    for (let s of i.type) {
      if (s.from > e)
        break;
      if (!(s.to < e)) {
        if (s.from < e && s.to > e)
          return s;
        (!r || s.type == yt.Text && (r.type != s.type || (t < 0 ? s.from < e : s.to > e))) && (r = s);
      }
    }
    return r || i;
  }
  return i;
}
function cy(n, e, t, i) {
  let r = ac(n, e.head, e.assoc || -1), s = !i || r.type != yt.Text || !(n.lineWrapping || r.widgetLineBreaks) ? null : n.coordsAtPos(e.assoc < 0 && e.head > r.from ? e.head - 1 : e.head);
  if (s) {
    let o = n.dom.getBoundingClientRect(), a = n.textDirectionAt(r.from), l = n.posAtCoords({
      x: t == (a == Ie.LTR) ? o.right - 1 : o.left + 1,
      y: (s.top + s.bottom) / 2
    });
    if (l != null)
      return te.cursor(l, t ? -1 : 1);
  }
  return te.cursor(t ? r.to : r.from, t ? -1 : 1);
}
function Pu(n, e, t, i) {
  let r = n.state.doc.lineAt(e.head), s = n.bidiSpans(r), o = n.textDirectionAt(r.from);
  for (let a = e, l = null; ; ) {
    let h = _p(r, s, o, a, t), c = Pp;
    if (!h) {
      if (r.number == (t ? n.state.doc.lines : 1))
        return a;
      c = `
`, r = n.state.doc.line(r.number + (t ? 1 : -1)), s = n.bidiSpans(r), h = n.visualLineSide(r, !t);
    }
    if (l) {
      if (!l(c))
        return a;
    } else {
      if (!i)
        return h;
      l = i(c);
    }
    a = h;
  }
}
function fy(n, e, t) {
  let i = n.state.charCategorizer(e), r = i(t);
  return (s) => {
    let o = i(s);
    return r == Fi.Space && (r = o), r == o;
  };
}
function uy(n, e, t, i) {
  let r = e.head, s = t ? 1 : -1;
  if (r == (t ? n.state.doc.length : 0))
    return te.cursor(r, e.assoc);
  let o = e.goalColumn, a, l = n.contentDOM.getBoundingClientRect(), h = n.coordsAtPos(r, e.assoc || ((e.empty ? t : e.head == e.from) ? 1 : -1)), c = n.documentTop;
  if (h)
    o == null && (o = h.left - l.left), a = s < 0 ? h.top : h.bottom;
  else {
    let p = n.viewState.lineBlockAt(r);
    o == null && (o = Math.min(l.right - l.left, n.defaultCharacterWidth * (r - p.from))), a = (s < 0 ? p.top : p.bottom) + c;
  }
  let f = l.left + o, O = n.viewState.heightOracle.textHeight >> 1, d = i ?? O;
  for (let p = 0; ; p += O) {
    let g = a + (d + p) * s, m = lc(n, { x: f, y: g }, !1, s);
    if (t ? g > l.bottom : g < l.top)
      return te.cursor(m.pos, m.assoc);
    let v = n.coordsAtPos(m.pos, m.assoc), w = v ? (v.top + v.bottom) / 2 : 0;
    if (!v || (t ? w > a : w < a))
      return te.cursor(m.pos, m.assoc, void 0, o);
  }
}
function ro(n, e, t) {
  for (; ; ) {
    let i = 0;
    for (let r of n)
      r.between(e - 1, e + 1, (s, o, a) => {
        if (e > s && e < o) {
          let l = i || t || (e - s < o - e ? -1 : 1);
          e = l < 0 ? s : o, i = l;
        }
      });
    if (!i)
      return e;
  }
}
function Dp(n, e) {
  let t = null;
  for (let i = 0; i < e.ranges.length; i++) {
    let r = e.ranges[i], s = null;
    if (r.empty) {
      let o = ro(n, r.from, 0);
      o != r.from && (s = te.cursor(o, -1));
    } else {
      let o = ro(n, r.from, -1), a = ro(n, r.to, 1);
      (o != r.from || a != r.to) && (r.undirectional ? s = te.undirectionalRange(r.from, r.to) : s = te.range(r.from == r.anchor ? o : a, r.from == r.head ? o : a));
    }
    s && (t || (t = e.ranges.slice()), t[i] = s);
  }
  return t ? te.create(t, e.mainIndex) : e;
}
function eh(n, e, t) {
  let i = ro(n.state.facet(jo).map((r) => r(n)), t.from, e.head > t.from ? -1 : 1);
  return i == t.from ? t : te.cursor(i, i < t.from ? 1 : -1);
}
class Ni {
  constructor(e, t) {
    this.pos = e, this.assoc = t;
  }
}
function lc(n, e, t, i) {
  let r = n.contentDOM.getBoundingClientRect(), s = r.top + n.viewState.paddingTop, { x: o, y: a } = e, l = a - s, h;
  for (; ; ) {
    if (l < 0)
      return new Ni(0, 1);
    if (l > n.viewState.docHeight)
      return new Ni(n.state.doc.length, -1);
    if (h = n.elementAtHeight(l), i == null)
      break;
    if (h.type == yt.Text) {
      if (i < 0 ? h.to < n.viewport.from : h.from > n.viewport.to)
        break;
      let O = n.docView.coordsAt(i < 0 ? h.from : h.to, i > 0 ? -1 : 1);
      if (O && (i < 0 ? O.top <= l + s : O.bottom >= l + s))
        break;
    }
    let f = n.viewState.heightOracle.textHeight / 2;
    l = i > 0 ? h.bottom + f : h.top - f;
  }
  if (n.viewport.from >= h.to || n.viewport.to <= h.from) {
    if (t)
      return null;
    if (h.type == yt.Text) {
      let f = hy(n, r, h, o, a);
      return new Ni(f, f == h.from ? 1 : -1);
    }
  }
  if (h.type != yt.Text)
    return l < (h.top + h.bottom) / 2 ? new Ni(h.from, 1) : new Ni(h.to, -1);
  let c = n.docView.lineAt(h.from, 2);
  return (!c || c.length != h.length) && (c = n.docView.lineAt(h.from, -2)), new Oy(n, o, a, n.textDirectionAt(h.from)).scanTile(c, h.from);
}
class Oy {
  constructor(e, t, i, r) {
    this.view = e, this.x = t, this.y = i, this.baseDir = r, this.line = null, this.spans = null;
  }
  bidiSpansAt(e) {
    return (!this.line || this.line.from > e || this.line.to < e) && (this.line = this.view.state.doc.lineAt(e), this.spans = this.view.bidiSpans(this.line)), this;
  }
  baseDirAt(e, t) {
    let { line: i, spans: r } = this.bidiSpansAt(e);
    return r[Xi.find(r, e - i.from, -1, t)].level == this.baseDir;
  }
  dirAt(e, t) {
    let { line: i, spans: r } = this.bidiSpansAt(e);
    return r[Xi.find(r, e - i.from, -1, t)].dir;
  }
  // Used to short-circuit bidi tests for content with a uniform direction
  bidiIn(e, t) {
    let { spans: i, line: r } = this.bidiSpansAt(e);
    return i.length > 1 || i.length && (i[0].level != this.baseDir || i[0].to + r.from < t);
  }
  // Scan through the rectangles for the content of a tile with inline
  // content, looking for one that overlaps the queried position
  // vertically and is closest horizontally. The caller is responsible
  // for dividing its content into N pieces, and pass an array with
  // N+1 positions (including the position after the last piece). For
  // a text tile, these will be character clusters, for a composite
  // tile, these will be child tiles.
  scan(e, t, i = !1) {
    let r = 0, s = e.length - 1, o = /* @__PURE__ */ new Set(), a = this.bidiIn(e[0], e[s]), l, h, c = -1, f = 1e9, O;
    e: for (; r < s; ) {
      let p = s - r, g = r + s >> 1;
      t: if (o.has(g)) {
        let v = r + Math.floor(Math.random() * p);
        for (let w = 0; w < p; w++) {
          if (!o.has(v)) {
            g = v;
            break t;
          }
          v++, v == s && (v = r);
        }
        break e;
      }
      o.add(g);
      let m = t(g);
      if (m)
        for (let v = 0; v < m.length; v++) {
          let w = m[v], S = 0;
          if (!(w.width == 0 && m.length > 1)) {
            if (w.bottom < this.y)
              (!l || l.bottom < w.bottom) && (l = w), S = 1;
            else if (w.top > this.y)
              (!h || h.top > w.top) && (h = w), S = -1;
            else {
              let Q = w.left > this.x ? this.x - w.left : w.right < this.x ? this.x - w.right : 0, b = Math.abs(Q);
              b < f && (c = g, f = b, O = w), Q && (S = Q < 0 == (this.baseDir == Ie.LTR) ? -1 : 1);
            }
            S == -1 && (!a || this.baseDirAt(e[g], 1)) ? s = g : S == 1 && (!a || this.baseDirAt(e[g + 1], -1)) && (r = g + 1);
          }
        }
    }
    if (!O) {
      if (!h && !l)
        return { i: e[0], after: !1 };
      let p = l && (!h || this.y - l.bottom < h.top - this.y) ? l : h;
      return this.y = (p.top + p.bottom) / 2, this.scan(e, t, !0);
    }
    if (f && !i) {
      let { top: p, bottom: g } = O;
      if (l && l.bottom > (p + p + g) / 3)
        return this.y = l.bottom - 1, this.scan(e, t, !0);
      if (h && h.top < (p + g + g) / 3)
        return this.y = h.top + 1, this.scan(e, t, !0);
    }
    let d = (a ? this.dirAt(e[c], 1) : this.baseDir) == Ie.LTR;
    return {
      i: c,
      // Test whether x is closes to the start or end of this element
      after: this.x > (O.left + O.right) / 2 == d
    };
  }
  scanText(e, t) {
    let i = [];
    for (let s = 0; s < e.length; s = bi(e.text, s))
      i.push(t + s);
    i.push(t + e.length);
    let r = this.scan(i, (s) => {
      let o = i[s] - t, a = i[s + 1] - t;
      return vo(e.dom, o, a).getClientRects();
    });
    return r.after ? new Ni(i[r.i + 1], -1) : new Ni(i[r.i], 1);
  }
  scanTile(e, t) {
    if (!e.length)
      return new Ni(t, 1);
    if (e.children.length == 1) {
      let a = e.children[0];
      if (a.isText())
        return this.scanText(a, t);
      if (a.isComposite())
        return this.scanTile(a, t);
    }
    let i = [t];
    for (let a = 0, l = t; a < e.children.length; a++)
      i.push(l += e.children[a].length);
    let r = this.scan(i, (a) => {
      let l = e.children[a];
      return l.flags & 48 ? null : (l.dom.nodeType == 1 ? l.dom : vo(l.dom, 0, l.length)).getClientRects();
    }), s = e.children[r.i], o = i[r.i];
    return s.isText() ? this.scanText(s, o) : s.isComposite() ? this.scanTile(s, o) : r.after ? new Ni(i[r.i + 1], -1) : new Ni(o, 1);
  }
}
const Dr = "￿";
class dy {
  constructor(e, t) {
    this.points = e, this.view = t, this.text = "", this.lineSeparator = t.state.facet(We.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += Dr;
  }
  readRange(e, t) {
    if (!e)
      return this;
    let i = e.parentNode;
    for (let r = e; ; ) {
      this.findPointBefore(i, r);
      let s = this.text.length;
      this.readNode(r);
      let o = at.get(r), a = r.nextSibling;
      if (a == t) {
        o != null && o.breakAfter && !a && i != this.view.contentDOM && this.lineBreak();
        break;
      }
      let l = at.get(a);
      (o && l ? o.breakAfter : (o ? o.breakAfter : Ua(r)) || Ua(a) && (r.nodeName != "BR" || o != null && o.isWidget()) && this.text.length > s) && !gy(a, t) && this.lineBreak(), r = a;
    }
    return this.findPointBefore(i, t), this;
  }
  readTextNode(e) {
    let t = e.nodeValue;
    for (let i of this.points)
      i.node == e && (i.pos = this.text.length + Math.min(i.offset, t.length));
    for (let i = 0, r = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let s = -1, o = 1, a;
      if (this.lineSeparator ? (s = t.indexOf(this.lineSeparator, i), o = this.lineSeparator.length) : (a = r.exec(t)) && (s = a.index, o = a[0].length), this.append(t.slice(i, s < 0 ? t.length : s)), s < 0)
        break;
      if (this.lineBreak(), o > 1)
        for (let l of this.points)
          l.node == e && l.pos > this.text.length && (l.pos -= o - 1);
      i = s + o;
    }
  }
  readNode(e) {
    let t = at.get(e), i = t && t.overrideDOMText;
    if (i != null) {
      this.findPointInside(e, i.length);
      for (let r = i.iter(); !r.next().done; )
        r.lineBreak ? this.lineBreak() : this.append(r.value);
    } else e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, t) {
    for (let i of this.points)
      i.node == e && e.childNodes[i.offset] == t && (i.pos = this.text.length);
  }
  findPointInside(e, t) {
    for (let i of this.points)
      (e.nodeType == 3 ? i.node == e : e.contains(i.node)) && (i.pos = this.text.length + (py(e, i.node, i.offset) ? t : 0));
  }
}
function py(n, e, t) {
  for (; ; ) {
    if (!e || t < Rn(e))
      return !1;
    if (e == n)
      return !0;
    t = nr(e) + 1, e = e.parentNode;
  }
}
function gy(n, e) {
  let t;
  for (; !(n == e || !n); n = n.nextSibling) {
    let i = at.get(n);
    if (!(i != null && i.isWidget()))
      return !1;
    i && (t || (t = [])).push(i);
  }
  if (t)
    for (let i of t) {
      let r = i.overrideDOMText;
      if (r != null && r.length)
        return !1;
    }
  return !0;
}
class _u {
  constructor(e, t) {
    this.node = e, this.offset = t, this.pos = -1;
  }
}
class my {
  constructor(e, t, i, r) {
    this.typeOver = r, this.bounds = null, this.text = "", this.domChanged = t > -1;
    let { impreciseHead: s, impreciseAnchor: o } = e.docView, a = e.state.selection;
    if (e.state.readOnly && t > -1)
      this.newSel = null;
    else if (t > -1 && (this.bounds = Gp(e.docView.tile, t, i, 0))) {
      let l = s || o ? [] : Qy(e), h = new dy(l, e);
      h.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = h.text, this.newSel = by(l, this.bounds.from);
    } else {
      let l = e.observer.selectionRange, h = s && s.node == l.focusNode && s.offset == l.focusOffset || !tc(e.contentDOM, l.focusNode) ? a.main.head : e.docView.posFromDOM(l.focusNode, l.focusOffset), c = o && o.node == l.anchorNode && o.offset == l.anchorOffset || !tc(e.contentDOM, l.anchorNode) ? a.main.anchor : e.docView.posFromDOM(l.anchorNode, l.anchorOffset), f = e.viewport;
      if ((ie.ios || ie.chrome) && h != c && Math.min(h, c) <= a.main.from && Math.max(h, c) >= a.main.to && (f.from > 0 || f.to < e.state.doc.length)) {
        let O = Math.min(h, c), d = Math.max(h, c), p = f.from - O, g = f.to - d;
        (p == 0 || p == 1 || O == 0) && (g == 0 || g == -1 || d == e.state.doc.length) && (h = 0, c = e.state.doc.length);
      }
      if (e.inputState.composing > -1 && a.ranges.length > 1)
        this.newSel = a.replaceRange(te.range(c, h));
      else if (e.lineWrapping && c == h && !(a.main.empty && a.main.head == h) && e.inputState.lastTouchTime > Date.now() - 100) {
        let O = e.coordsAtPos(h, -1), d = 0;
        O && (d = e.inputState.lastTouchY <= O.bottom ? -1 : 1), this.newSel = te.create([te.cursor(h, d)]);
      } else
        this.newSel = te.single(c, h);
    }
  }
}
function Gp(n, e, t, i) {
  if (n.isComposite()) {
    let r = -1, s = -1, o = -1, a = -1;
    for (let l = 0, h = i, c = i; l < n.children.length; l++) {
      let f = n.children[l], O = h + f.length;
      if (h < e && O > t)
        return Gp(f, e, t, h);
      if (O >= e && r == -1 && (r = l, s = h), h > t && f.dom.parentNode == n.dom) {
        o = l, a = c;
        break;
      }
      c = O, h = O + f.breakAfter;
    }
    return {
      from: s,
      to: a < 0 ? i + n.length : a,
      startDOM: (r ? n.children[r - 1].dom.nextSibling : null) || n.dom.firstChild,
      endDOM: o < n.children.length && o >= 0 ? n.children[o].dom : null
    };
  } else return n.isText() ? { from: i, to: i + n.length, startDOM: n.dom, endDOM: n.dom.nextSibling } : null;
}
function Ip(n, e) {
  let t, { newSel: i } = e, { state: r } = n, s = r.selection.main, o = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: a, to: l } = e.bounds, h = s.from, c = null;
    (o === 8 || ie.android && e.text.length < l - a) && (h = s.to, c = "end");
    let f = r.doc.sliceString(a, l, Dr), O, d;
    !s.empty && s.from >= a && s.to <= l && (e.typeOver || f != e.text) && f.slice(0, s.from - a) == e.text.slice(0, s.from - a) && f.slice(s.to - a) == e.text.slice(O = e.text.length - (f.length - (s.to - a))) ? t = {
      from: s.from,
      to: s.to,
      insert: je.of(e.text.slice(s.from - a, O).split(Dr))
    } : (d = Up(f, e.text, h - a, c)) && (ie.chrome && o == 13 && d.toB == d.from + 2 && e.text.slice(d.from, d.toB) == Dr + Dr && d.toB--, t = {
      from: a + d.from,
      to: a + d.toA,
      insert: je.of(e.text.slice(d.from, d.toB).split(Dr))
    });
  } else i && (!n.hasFocus && r.facet(kn) || Fa(i, s)) && (i = null);
  if (!t && !i)
    return !1;
  if ((ie.mac || ie.android) && t && t.from == t.to && t.from == s.head - 1 && /^\. ?$/.test(t.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && t.insert.length == 2 && (i = te.single(i.main.anchor - 1, i.main.head - 1)), t = { from: t.from, to: t.to, insert: je.of([t.insert.toString().replace(".", " ")]) }) : r.doc.lineAt(s.from).to < s.to && n.docView.lineHasWidget(s.to) && n.inputState.insertingTextAt > Date.now() - 50 ? t = {
    from: s.from,
    to: s.to,
    insert: r.toText(n.inputState.insertingText)
  } : ie.chrome && t && t.from == t.to && t.from == s.head && t.insert.toString() == `
 ` && n.lineWrapping && (i && (i = te.single(i.main.anchor - 1, i.main.head - 1)), t = { from: s.from, to: s.to, insert: je.of([" "]) }), t)
    return tf(n, t, i, o);
  if (i && !Fa(i, s)) {
    let a = !1, l = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (a = !0), l = n.inputState.lastSelectionOrigin, l == "select.pointer" && (i = Dp(r.facet(jo).map((h) => h(n)), i))), n.dispatch({ selection: i, scrollIntoView: a, userEvent: l }), !0;
  } else
    return !1;
}
function tf(n, e, t, i = -1) {
  if (ie.ios && n.inputState.flushIOSKey(e))
    return !0;
  let r = n.state.selection.main;
  if (ie.android && (e.to == r.to && // GBoard will sometimes remove a space it just inserted
  // after a completion when you press enter
  (e.from == r.from || e.from == r.from - 1 && n.state.sliceDoc(e.from, r.from) == " ") && e.insert.length == 1 && e.insert.lines == 2 && Kr(n.contentDOM, "Enter", 13) || (e.from == r.from - 1 && e.to == r.to && e.insert.length == 0 || i == 8 && e.insert.length < e.to - e.from && e.to > r.head) && Kr(n.contentDOM, "Backspace", 8) || e.from == r.from && e.to == r.to + 1 && e.insert.length == 0 && Kr(n.contentDOM, "Delete", 46)))
    return !0;
  let s = e.insert.toString();
  n.inputState.composing >= 0 && n.inputState.composing++;
  let o, a = () => o || (o = vy(n, e, t));
  return n.state.facet(Xp).some((l) => l(n, e.from, e.to, s, a)) || n.dispatch(a()), !0;
}
function vy(n, e, t) {
  let i, r = n.state, s = r.selection.main, o = -1;
  if (e.from == e.to && e.from < s.from || e.from > s.to) {
    let l = e.from < s.from ? -1 : 1, h = l < 0 ? s.from : s.to, c = ro(r.facet(jo).map((f) => f(n)), h, l);
    e.from == c && (o = c);
  }
  if (o > -1)
    i = {
      changes: e,
      selection: te.cursor(e.from + e.insert.length, -1)
    };
  else if (e.from >= s.from && e.to <= s.to && e.to - e.from >= (s.to - s.from) / 3 && (!t || t.main.empty && t.main.from == e.from + e.insert.length) && n.inputState.composing < 0) {
    let l = s.from < e.from ? r.sliceDoc(s.from, e.from) : "", h = s.to > e.to ? r.sliceDoc(e.to, s.to) : "";
    i = r.replaceSelection(n.state.toText(l + e.insert.sliceString(0, void 0, n.state.lineBreak) + h));
  } else {
    let l = r.changes(e), h = t && t.main.to <= l.newLength ? t.main : void 0;
    if (r.selection.ranges.length > 1 && (n.inputState.composing >= 0 || n.inputState.compositionPendingChange) && e.to <= s.to + 10 && e.to >= s.to - 10) {
      let c = n.state.sliceDoc(e.from, e.to), f, O = t && Lp(n, t.main.head);
      if (O) {
        let p = e.insert.length - (e.to - e.from);
        f = { from: O.from, to: O.to - p };
      } else
        f = n.state.doc.lineAt(s.head);
      let d = s.to - e.to;
      i = r.changeByRange((p) => {
        if (p.from == s.from && p.to == s.to)
          return { changes: l, range: h || p.map(l) };
        let g = p.to - d, m = g - c.length;
        if (n.state.sliceDoc(m, g) != c || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        g >= f.from && m <= f.to)
          return { range: p };
        let v = r.changes({ from: m, to: g, insert: e.insert }), w = p.to - s.to;
        return {
          changes: v,
          range: h ? te.range(Math.max(0, h.anchor + w), Math.max(0, h.head + w)) : p.map(v)
        };
      });
    } else
      i = {
        changes: l,
        selection: h && r.selection.replaceRange(h)
      };
  }
  let a = "input.type";
  return (n.composing || n.inputState.compositionPendingChange && n.inputState.compositionEndedAt > Date.now() - 50) && (n.inputState.compositionPendingChange = !1, a += ".compose", n.inputState.compositionFirstChange && (a += ".start", n.inputState.compositionFirstChange = !1)), r.update(i, { userEvent: a, scrollIntoView: !0 });
}
function Up(n, e, t, i) {
  let r = Math.min(n.length, e.length), s = 0;
  for (; s < r && n.charCodeAt(s) == e.charCodeAt(s); )
    s++;
  if (s == r && n.length == e.length)
    return null;
  let o = n.length, a = e.length;
  for (; o > 0 && a > 0 && n.charCodeAt(o - 1) == e.charCodeAt(a - 1); )
    o--, a--;
  if (i == "end") {
    let l = Math.max(0, s - Math.min(o, a));
    t -= o + l - s;
  }
  if (o < s && n.length < e.length) {
    let l = t <= s && t >= o ? s - t : 0;
    s -= l, a = s + (a - o), o = s;
  } else if (a < s) {
    let l = t <= s && t >= a ? s - t : 0;
    s -= l, o = s + (o - a), a = s;
  }
  return { from: s, toA: o, toB: a };
}
function Qy(n) {
  let e = [];
  if (n.root.activeElement != n.contentDOM)
    return e;
  let { anchorNode: t, anchorOffset: i, focusNode: r, focusOffset: s } = n.observer.selectionRange;
  return t && (e.push(new _u(t, i)), (r != t || s != i) && e.push(new _u(r, s))), e;
}
function by(n, e) {
  if (n.length == 0)
    return null;
  let t = n[0].pos, i = n.length == 2 ? n[1].pos : t;
  return t > -1 && i > -1 ? te.single(t + e, i + e) : null;
}
function Fa(n, e) {
  return e.head == n.main.head && e.anchor == n.main.anchor;
}
class Sy {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.touchActive = !1, this.lastTouchTime = 0, this.lastTouchX = 0, this.lastTouchY = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.lastWheelEvent = 0, this.pendingIOSKey = void 0, this.lastIOSMomentumScroll = 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.insertingText = "", this.insertingTextAt = 0, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, ie.safari && e.contentDOM.addEventListener("input", () => null), ie.gecko && My(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !Zy(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || (this.view.updateState != 0 ? Promise.resolve().then(() => this.runHandlers(e.type, e)) : this.runHandlers(e.type, e));
  }
  runHandlers(e, t) {
    let i = this.handlers[e];
    if (i) {
      for (let r of i.observers)
        r(this.view, t);
      for (let r of i.handlers) {
        if (t.defaultPrevented)
          break;
        if (r(this.view, t)) {
          t.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let t = ky(e), i = this.handlers, r = this.view.contentDOM;
    for (let s in t)
      if (s != "scroll") {
        let o = !t[s].handlers.length, a = i[s];
        a && o != !a.handlers.length && (r.removeEventListener(s, this.handleEvent), a = null), a || r.addEventListener(s, this.handleEvent, { passive: o });
      }
    for (let s in i)
      s != "scroll" && !t[s] && r.removeEventListener(s, this.handleEvent);
    this.handlers = t;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode))
      return !0;
    if (this.tabFocusMode > 0 && e.keyCode != 27 && Bp.indexOf(e.keyCode) < 0 && (this.tabFocusMode = -1), ie.android && ie.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    if (ie.ios && !e.synthetic && !e.altKey && !e.metaKey && (Np.some((t) => t.keyCode == e.keyCode) && !e.ctrlKey || xy.indexOf(e.key) > -1 && e.ctrlKey)) {
      let t = { ctrlKey: e.ctrlKey, altKey: e.altKey, metaKey: e.metaKey, shiftKey: e.shiftKey };
      return t.shiftKey && ie.ios && !/^(off|none)$/.test(this.view.contentDOM.autocapitalize) && yy(this.view.win) && (t.shiftKey = !1), this.pendingIOSKey = { key: e.key, keyCode: e.keyCode, mods: t }, setTimeout(() => this.flushIOSKey(), 250), !0;
    }
    return e.keyCode != 229 && this.view.observer.forceFlush(), !1;
  }
  flushIOSKey(e) {
    let t = this.pendingIOSKey;
    return !t || t.key == "Enter" && e && e.from < e.to && /^\S+$/.test(e.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, Kr(this.view.contentDOM, t.key, t.keyCode, t.mods));
  }
  ignoreDuringComposition(e) {
    return !/^key/.test(e.type) || e.synthetic ? !1 : this.composing > 0 ? !0 : ie.safari && !ie.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.view.observer.update(e), this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function yy(n) {
  return n.visualViewport ? n.visualViewport.height * n.visualViewport.scale / n.document.documentElement.clientHeight < 0.85 : !1;
}
function Tu(n, e) {
  return (t, i) => {
    try {
      return e.call(n, i, t);
    } catch (r) {
      Si(t.state, r);
    }
  };
}
function ky(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(i) {
    return e[i] || (e[i] = { observers: [], handlers: [] });
  }
  for (let i of n) {
    let r = i.spec, s = r && r.plugin.domEventHandlers, o = r && r.plugin.domEventObservers;
    if (s)
      for (let a in s) {
        let l = s[a];
        l && t(a).handlers.push(Tu(i.value, l));
      }
    if (o)
      for (let a in o) {
        let l = o[a];
        l && t(a).observers.push(Tu(i.value, l));
      }
  }
  for (let i in Ai)
    t(i).handlers.push(Ai[i]);
  for (let i in Dt)
    t(i).observers.push(Dt[i]);
  return e;
}
const Np = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], xy = "dthko", Bp = [16, 17, 18, 20, 91, 92, 224, 225], Ko = 6;
function ea(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function wy(n, e) {
  return Math.max(Math.abs(n.clientX - e.clientX), Math.abs(n.clientY - e.clientY));
}
class Py {
  constructor(e, t, i, r) {
    this.view = e, this.startEvent = t, this.style = i, this.mustSelect = r, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = t, this.scrollParents = gp(e.contentDOM), this.atoms = e.state.facet(jo).map((o) => o(e));
    let s = e.contentDOM.ownerDocument;
    s.addEventListener("mousemove", this.move = this.move.bind(this)), s.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(We.allowMultipleSelections) && _y(e, t), this.dragging = $y(e, t) && Jp(t) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && wy(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let t = 0, i = 0, r = 0, s = 0, o = this.view.win.innerWidth, a = this.view.win.innerHeight;
    this.scrollParents.x && ({ left: r, right: o } = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({ top: s, bottom: a } = this.scrollParents.y.getBoundingClientRect());
    let l = ef(this.view);
    e.clientX - l.left <= r + Ko ? t = -ea(r - e.clientX) : e.clientX + l.right >= o - Ko && (t = ea(e.clientX - o)), e.clientY - l.top <= s + Ko ? i = -ea(s - e.clientY) : e.clientY + l.bottom >= a - Ko && (i = ea(e.clientY - a)), this.setScrollSpeed(t, i);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, t) {
    this.scrollSpeed = { x: e, y: t }, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    let { x: e, y: t } = this.scrollSpeed;
    e && this.scrollParents.x && (this.scrollParents.x.scrollLeft += e, e = 0), t && this.scrollParents.y && (this.scrollParents.y.scrollTop += t, t = 0), (e || t) && this.view.win.scrollBy(e, t), this.dragging === !1 && this.select(this.lastEvent);
  }
  select(e) {
    let { view: t } = this, i = Dp(this.atoms, this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !i.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    e.transactions.some((t) => t.isUserEvent("input.type")) ? this.destroy() : this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function _y(n, e) {
  let t = n.state.facet(Tp);
  return t.length ? t[0](e) : ie.mac ? e.metaKey : e.ctrlKey;
}
function Ty(n, e) {
  let t = n.state.facet($p);
  return t.length ? t[0](e) : ie.mac ? !e.altKey : !e.ctrlKey;
}
function $y(n, e) {
  let { main: t } = n.state.selection;
  if (t.empty)
    return !1;
  let i = go(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let r = i.getRangeAt(0).getClientRects();
  for (let s = 0; s < r.length; s++) {
    let o = r[s];
    if (o.left <= e.clientX && o.right >= e.clientX && o.top <= e.clientY && o.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function Zy(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target, i; t != n.contentDOM; t = t.parentNode)
    if (!t || t.nodeType == 11 || (i = at.get(t)) && i.isWidget() && !i.isHidden && i.widget.ignoreEvent(e))
      return !1;
  return !0;
}
const Ai = /* @__PURE__ */ Object.create(null), Dt = /* @__PURE__ */ Object.create(null), Fp = ie.ie && ie.ie_version < 15 || ie.ios && ie.webkit_version < 604;
function Ry(n) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let t = e.appendChild(document.createElement("textarea"));
  t.style.cssText = "position: fixed; left: -10000px; top: 10px", t.focus(), setTimeout(() => {
    n.focus(), t.remove(), Hp(n, t.value);
  }, 50);
}
function vl(n, e, t) {
  for (let i of n.facet(e))
    t = i(t, n);
  return t;
}
function Hp(n, e) {
  e = vl(n.state, Hc, e);
  let { state: t } = n, i, r = 1, s = t.toText(e), o = s.lines == t.selection.ranges.length;
  if (hc != null && t.selection.ranges.every((l) => l.empty) && hc == s.toString()) {
    let l = -1;
    i = t.changeByRange((h) => {
      let c = t.doc.lineAt(h.from);
      if (c.from == l)
        return { range: h };
      l = c.from;
      let f = t.toText((o ? s.line(r++).text : e) + t.lineBreak);
      return {
        changes: { from: c.from, insert: f },
        range: te.cursor(h.from + f.length)
      };
    });
  } else o ? i = t.changeByRange((l) => {
    let h = s.line(r++);
    return {
      changes: { from: l.from, to: l.to, insert: h.text },
      range: te.cursor(l.from + h.length)
    };
  }) : i = t.replaceSelection(s);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
Dt.scroll = (n) => {
  let e = n.inputState;
  e.lastScrollTop = n.scrollDOM.scrollTop, e.lastScrollLeft = n.scrollDOM.scrollLeft, ie.ios && !e.touchActive && (e.lastIOSMomentumScroll = Date.now());
};
Dt.wheel = Dt.mousewheel = (n) => {
  n.inputState.lastWheelEvent = Date.now();
};
Ai.keydown = (n, e) => (n.inputState.setSelectionOrigin("select"), e.keyCode == 27 && n.inputState.tabFocusMode != 0 && (n.inputState.tabFocusMode = Date.now() + 2e3), !1);
Dt.touchstart = (n, e) => {
  let t = n.inputState, i = e.targetTouches[0];
  t.touchActive = !0, t.lastTouchTime = Date.now(), i && (t.lastTouchX = i.clientX, t.lastTouchY = i.clientY), t.setSelectionOrigin("select.pointer");
};
Dt.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
Dt.touchend = (n, e) => {
  n.inputState.touchActive = !1;
};
Ai.mousedown = (n, e) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let t = null;
  for (let i of n.state.facet(Zp))
    if (t = i(n, e), t)
      break;
  if (!t && e.button == 0 && (t = Cy(n, e)), t) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new Py(n, e, t, i)), i && n.observer.ignore(() => {
      mp(n.contentDOM);
      let s = n.root.activeElement;
      s && !s.contains(n.contentDOM) && s.blur();
    });
    let r = n.inputState.mouseSelection;
    if (r)
      return r.start(e), r.dragging === !1;
  } else
    n.inputState.setSelectionOrigin("select.pointer");
  return !1;
};
function $u(n, e, t, i) {
  if (i == 1)
    return te.cursor(e, t);
  if (i == 2)
    return ly(n.state, e, t);
  {
    let r = n.docView.lineAt(e, t), s = n.state.doc.lineAt(r ? r.posAtEnd : e), o = r ? r.posAtStart : s.from, a = r ? r.posAtEnd : s.to;
    return a < n.state.doc.length && a == s.to && a++, te.undirectionalRange(o, a);
  }
}
const Xy = ie.ie && ie.ie_version <= 11;
let Zu = null, Ru = 0, Xu = 0;
function Jp(n) {
  if (!Xy)
    return n.detail;
  let e = Zu, t = Xu;
  return Zu = n, Xu = Date.now(), Ru = !e || t > Date.now() - 400 && Math.abs(e.clientX - n.clientX) < 2 && Math.abs(e.clientY - n.clientY) < 2 ? (Ru + 1) % 3 : 1;
}
function Cy(n, e) {
  let t = n.posAndSideAtCoords({ x: e.clientX, y: e.clientY }, !1), i = Jp(e), r = n.state.selection;
  return {
    update(s) {
      s.docChanged && (t.pos = s.changes.mapPos(t.pos), r = r.map(s.changes));
    },
    get(s, o, a) {
      let l = n.posAndSideAtCoords({ x: s.clientX, y: s.clientY }, !1), h, c = $u(n, l.pos, l.assoc, i);
      if (t.pos != l.pos && !o) {
        let f = $u(n, t.pos, t.assoc, i), O = Math.min(f.from, c.from), d = Math.max(f.to, c.to);
        c = O < c.from ? te.range(O, d, c.assoc) : te.range(d, O, c.assoc);
      }
      return o ? r.replaceRange(r.main.extend(c.from, c.to, c.assoc)) : a && i == 1 && r.ranges.length > 1 && (h = Ay(r, l.pos)) ? h : a ? r.addRange(c) : te.create([c]);
    }
  };
}
function Ay(n, e) {
  for (let t = 0; t < n.ranges.length; t++) {
    let { from: i, to: r } = n.ranges[t];
    if (i <= e && r >= e)
      return te.create(n.ranges.slice(0, t).concat(n.ranges.slice(t + 1)), n.mainIndex == t ? 0 : n.mainIndex - (n.mainIndex > t ? 1 : 0));
  }
  return null;
}
Ai.dragstart = (n, e) => {
  let { selection: { main: t } } = n.state;
  if (e.target.draggable) {
    let r = n.docView.tile.nearest(e.target);
    if (r && r.isWidget()) {
      let s = r.posAtStart, o = s + r.length;
      (s >= t.to || o <= t.from) && (t = te.undirectionalRange(s, o));
    }
  }
  let { inputState: i } = n;
  return i.mouseSelection && (i.mouseSelection.dragging = !0), i.draggedContent = t, e.dataTransfer && (e.dataTransfer.setData("Text", vl(n.state, Jc, n.state.sliceDoc(t.from, t.to))), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
Ai.dragend = (n) => (n.inputState.draggedContent = null, !1);
function Cu(n, e, t, i) {
  if (t = vl(n.state, Hc, t), !t)
    return;
  let r = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: s } = n.inputState, o = i && s && Ty(n, e) ? { from: s.from, to: s.to } : null, a = { from: r, insert: t }, l = n.state.changes(o ? [o, a] : a);
  n.focus(), n.dispatch({
    changes: l,
    selection: { anchor: l.mapPos(r, -1), head: l.mapPos(r, 1) },
    userEvent: o ? "move.drop" : "input.drop"
  }), n.inputState.draggedContent = null;
}
Ai.drop = (n, e) => {
  if (!e.dataTransfer)
    return !1;
  if (n.state.readOnly)
    return !0;
  let t = e.dataTransfer.files;
  if (t && t.length) {
    let i = Array(t.length), r = 0, s = () => {
      ++r == t.length && Cu(n, e, i.filter((o) => o != null).join(n.state.lineBreak), !1);
    };
    for (let o = 0; o < t.length; o++) {
      let a = new FileReader();
      a.onerror = s, a.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(a.result) || (i[o] = a.result), s();
      }, a.readAsText(t[o]);
    }
    return !0;
  } else {
    let i = e.dataTransfer.getData("Text");
    if (i)
      return Cu(n, e, i, !0), !0;
  }
  return !1;
};
Ai.paste = (n, e) => {
  if (n.state.readOnly)
    return !0;
  n.observer.flush();
  let t = Fp ? null : e.clipboardData;
  return t ? (Hp(n, t.getData("text/plain") || t.getData("text/uri-list")), !0) : (Ry(n), !1);
};
function qy(n, e) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let i = t.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = e, i.focus(), i.selectionEnd = e.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function zy(n) {
  let e = [], t = [], i = !1;
  for (let r of n.selection.ranges)
    r.empty || (e.push(n.sliceDoc(r.from, r.to)), t.push(r));
  if (!e.length) {
    let r = -1;
    for (let { from: s } of n.selection.ranges) {
      let o = n.doc.lineAt(s);
      o.number > r && (e.push(o.text), t.push({ from: o.from, to: Math.min(n.doc.length, o.to + 1) })), r = o.number;
    }
    i = !0;
  }
  return { text: vl(n, Jc, e.join(n.lineBreak)), ranges: t, linewise: i };
}
let hc = null;
Ai.copy = Ai.cut = (n, e) => {
  if (!to(n.contentDOM, n.observer.selectionRange))
    return !1;
  let { text: t, ranges: i, linewise: r } = zy(n.state);
  if (!t && !r)
    return !1;
  hc = r ? t : null, e.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let s = Fp ? null : e.clipboardData;
  return s ? (s.clearData(), s.setData("text/plain", t), !0) : (qy(n, t), !1);
};
const Kp = /* @__PURE__ */ sr.define();
function eg(n, e) {
  let t = [];
  for (let i of n.facet(Cp)) {
    let r = i(n, e);
    r && t.push(r);
  }
  return t.length ? n.update({ effects: t, annotations: Kp.of(!0) }) : null;
}
function tg(n) {
  setTimeout(() => {
    let e = n.hasFocus;
    if (e != n.inputState.notifiedFocused) {
      let t = eg(n.state, e);
      t ? n.dispatch(t) : n.update([]);
    }
  }, 10);
}
Dt.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), tg(n);
};
Dt.blur = (n) => {
  n.observer.clearSelectionRange(), tg(n);
};
Dt.compositionstart = Dt.compositionupdate = (n) => {
  n.observer.editContext || (n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0 && (n.inputState.composing = 0));
};
Dt.compositionend = (n) => {
  n.observer.editContext || (n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, ie.chrome && ie.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50));
};
Dt.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
Ai.beforeinput = (n, e) => {
  var t, i;
  if ((e.inputType == "insertText" || e.inputType == "insertCompositionText") && (n.inputState.insertingText = e.data, n.inputState.insertingTextAt = Date.now()), e.inputType == "insertReplacementText" && n.observer.editContext) {
    let s = (t = e.dataTransfer) === null || t === void 0 ? void 0 : t.getData("text/plain"), o = e.getTargetRanges();
    if (s && o.length) {
      let a = o[0], l = n.posAtDOM(a.startContainer, a.startOffset), h = n.posAtDOM(a.endContainer, a.endOffset);
      return tf(n, { from: l, to: h, insert: n.state.toText(s) }, null), !0;
    }
  }
  let r;
  if (ie.chrome && ie.android && (r = Np.find((s) => s.inputType == e.inputType)) && (n.observer.delayAndroidKey(r.key, r.keyCode), r.key == "Backspace" || r.key == "Delete")) {
    let s = ((i = window.visualViewport) === null || i === void 0 ? void 0 : i.height) || 0;
    setTimeout(() => {
      var o;
      (((o = window.visualViewport) === null || o === void 0 ? void 0 : o.height) || 0) > s + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
  return ie.ios && e.inputType == "deleteContentForward" && n.observer.flushSoon(), ie.safari && e.inputType == "insertText" && n.inputState.composing >= 0 && setTimeout(() => Dt.compositionend(n, e), 20), !1;
};
const Au = /* @__PURE__ */ new Set();
function My(n) {
  Au.has(n) || (Au.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const qu = ["pre-wrap", "normal", "pre-line", "break-spaces"];
let Cr = !1;
function cc() {
  Cr = !1;
}
class ig {
  constructor(e) {
    this.lineWrapping = e, this.doc = je.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30;
  }
  heightForGap(e, t) {
    let i = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((t - e - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / Math.max(1, this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return qu.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let t = !1;
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      r < 0 ? i++ : this.heightSamples[Math.floor(r * 10)] || (t = !0, this.heightSamples[Math.floor(r * 10)] = !0);
    }
    return t;
  }
  refresh(e, t, i, r, s, o) {
    let a = qu.indexOf(e) > -1, l = Math.abs(t - this.lineHeight) > 0.3 || this.lineWrapping != a;
    if (this.lineWrapping = a, this.lineHeight = t, this.charWidth = i, this.textHeight = r, this.lineLength = s, l) {
      this.heightSamples = {};
      for (let h = 0; h < o.length; h++) {
        let c = o[h];
        c < 0 ? h++ : this.heightSamples[Math.floor(c * 10)] = !0;
      }
    }
    return l;
  }
}
class ng {
  constructor(e, t) {
    this.from = e, this.heights = t, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class Qi {
  /**
  @internal
  */
  constructor(e, t, i, r, s) {
    this.from = e, this.length = t, this.top = i, this.height = r, this._content = s;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? yt.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof Zr ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let t = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new Qi(this.from, this.length + e.length, this.top, this.height + e.height, t);
  }
}
var Fe = /* @__PURE__ */ (function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
})(Fe || (Fe = {}));
const ka = 1e-3;
class qt {
  constructor(e, t, i = 2) {
    this.length = e, this.height = t, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e) {
    this.height != e && (Math.abs(this.height - e) > ka && (Cr = !0), this.height = e);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, t, i) {
    return qt.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, t) {
    t.push(this);
  }
  decomposeRight(e, t) {
    t.push(this);
  }
  applyChanges(e, t, i, r) {
    let s = this, o = i.doc;
    for (let a = r.length - 1; a >= 0; a--) {
      let { fromA: l, toA: h, fromB: c, toB: f } = r[a], O = s.lineAt(l, Fe.ByPosNoHeight, i.setDoc(t), 0, 0), d = O.to >= h ? O : s.lineAt(h, Fe.ByPosNoHeight, i, 0, 0);
      for (f += d.to - h, h = d.to; a > 0 && O.from <= r[a - 1].toA; )
        l = r[a - 1].fromA, c = r[a - 1].fromB, a--, l < O.from && (O = s.lineAt(l, Fe.ByPosNoHeight, i, 0, 0));
      c += O.from - l, l = O.from;
      let p = nf.build(i.setDoc(o), e, c, f);
      s = Ha(s, s.replace(l, h, p));
    }
    return s.updateHeight(i, 0);
  }
  static empty() {
    return new li(0, 0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let t = 0, i = e.length, r = 0, s = 0;
    for (; ; )
      if (t == i)
        if (r > s * 2) {
          let a = e[t - 1];
          a.break ? e.splice(--t, 1, a.left, null, a.right) : e.splice(--t, 1, a.left, a.right), i += 1 + a.break, r -= a.size;
        } else if (s > r * 2) {
          let a = e[i];
          a.break ? e.splice(i, 1, a.left, null, a.right) : e.splice(i, 1, a.left, a.right), i += 2 + a.break, s -= a.size;
        } else
          break;
      else if (r < s) {
        let a = e[t++];
        a && (r += a.size);
      } else {
        let a = e[--i];
        a && (s += a.size);
      }
    let o = 0;
    return e[t - 1] == null ? (o = 1, t--) : e[t] == null && (o = 1, i++), new Ey(qt.of(e.slice(0, t)), o, qt.of(e.slice(i)));
  }
}
function Ha(n, e) {
  return n == e ? n : (n.constructor != e.constructor && (Cr = !0), e);
}
qt.prototype.size = 1;
const Wy = /* @__PURE__ */ pe.replace({});
class rg extends qt {
  constructor(e, t, i) {
    super(e, t), this.deco = i, this.spaceAbove = 0;
  }
  mainBlock(e, t) {
    return new Qi(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.deco || 0);
  }
  blockAt(e, t, i, r) {
    return this.spaceAbove && e < i + this.spaceAbove ? new Qi(r, 0, i, this.spaceAbove, Wy) : this.mainBlock(i, r);
  }
  lineAt(e, t, i, r, s) {
    let o = this.mainBlock(r, s);
    return this.spaceAbove ? this.blockAt(0, i, r, s).join(o) : o;
  }
  forEachLine(e, t, i, r, s, o) {
    e <= s + this.length && t >= s && o(this.lineAt(0, Fe.ByPos, i, r, s));
  }
  setMeasuredHeight(e) {
    let t = e.heights[e.index++];
    t < 0 ? (this.spaceAbove = -t, t = e.heights[e.index++]) : this.spaceAbove = 0, this.setHeight(t);
  }
  updateHeight(e, t = 0, i = !1, r) {
    return r && r.from <= t && r.more && this.setMeasuredHeight(r), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class li extends rg {
  constructor(e, t, i) {
    super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0, this.spaceAbove = i;
  }
  mainBlock(e, t) {
    return new Qi(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.breaks);
  }
  replace(e, t, i) {
    let r = i[0];
    return i.length == 1 && (r instanceof li || r instanceof _t && r.flags & 4) && Math.abs(this.length - r.length) < 10 ? (r instanceof _t ? r = new li(r.length, this.height, this.spaceAbove) : r.height = this.height, this.outdated || (r.outdated = !1), r) : qt.of(i);
  }
  updateHeight(e, t = 0, i = !1, r) {
    return r && r.from <= t && r.more ? this.setMeasuredHeight(r) : (i || this.outdated) && (this.spaceAbove = 0, this.setHeight(Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight)), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class _t extends qt {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, t) {
    let i = e.doc.lineAt(t).number, r = e.doc.lineAt(t + this.length).number, s = r - i + 1, o, a = 0;
    if (e.lineWrapping) {
      let l = Math.min(this.height, e.lineHeight * s);
      o = l / s, this.length > s + 1 && (a = (this.height - l) / (this.length - s - 1));
    } else
      o = this.height / s;
    return { firstLine: i, lastLine: r, perLine: o, perChar: a };
  }
  blockAt(e, t, i, r) {
    let { firstLine: s, lastLine: o, perLine: a, perChar: l } = this.heightMetrics(t, r);
    if (t.lineWrapping) {
      let h = r + (e < t.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (e - i) / this.height)) * this.length)), c = t.doc.lineAt(h), f = a + c.length * l, O = Math.max(i, e - f / 2);
      return new Qi(c.from, c.length, O, f, 0);
    } else {
      let h = Math.max(0, Math.min(o - s, Math.floor((e - i) / a))), { from: c, length: f } = t.doc.line(s + h);
      return new Qi(c, f, i + a * h, a, 0);
    }
  }
  lineAt(e, t, i, r, s) {
    if (t == Fe.ByHeight)
      return this.blockAt(e, i, r, s);
    if (t == Fe.ByPosNoHeight) {
      let { from: d, to: p } = i.doc.lineAt(e);
      return new Qi(d, p - d, 0, 0, 0);
    }
    let { firstLine: o, perLine: a, perChar: l } = this.heightMetrics(i, s), h = i.doc.lineAt(e), c = a + h.length * l, f = h.number - o, O = r + a * f + l * (h.from - s - f);
    return new Qi(h.from, h.length, Math.max(r, Math.min(O, r + this.height - c)), c, 0);
  }
  forEachLine(e, t, i, r, s, o) {
    e = Math.max(e, s), t = Math.min(t, s + this.length);
    let { firstLine: a, perLine: l, perChar: h } = this.heightMetrics(i, s);
    for (let c = e, f = r; c <= t; ) {
      let O = i.doc.lineAt(c);
      if (c == e) {
        let p = O.number - a;
        f += l * p + h * (e - s - p);
      }
      let d = l + h * O.length;
      o(new Qi(O.from, O.length, f, d, 0)), f += d, c = O.to + 1;
    }
  }
  replace(e, t, i) {
    let r = this.length - t;
    if (r > 0) {
      let s = i[i.length - 1];
      s instanceof _t ? i[i.length - 1] = new _t(s.length + r) : i.push(null, new _t(r - 1));
    }
    if (e > 0) {
      let s = i[0];
      s instanceof _t ? i[0] = new _t(e + s.length) : i.unshift(new _t(e - 1), null);
    }
    return qt.of(i);
  }
  decomposeLeft(e, t) {
    t.push(new _t(e - 1), null);
  }
  decomposeRight(e, t) {
    t.push(null, new _t(this.length - e - 1));
  }
  updateHeight(e, t = 0, i = !1, r) {
    let s = t + this.length;
    if (r && r.from <= t + this.length && r.more) {
      let o = [], a = Math.max(t, r.from), l = -1;
      for (r.from > t && o.push(new _t(r.from - t - 1).updateHeight(e, t)); a <= s && r.more; ) {
        let c = e.doc.lineAt(a).length;
        o.length && o.push(null);
        let f = r.heights[r.index++], O = 0;
        f < 0 && (O = -f, f = r.heights[r.index++]), l == -1 ? l = f : Math.abs(f - l) >= ka && (l = -2);
        let d = new li(c, f, O);
        d.outdated = !1, o.push(d), a += c + 1;
      }
      a <= s && o.push(null, new _t(s - a).updateHeight(e, a));
      let h = qt.of(o);
      return (l < 0 || Math.abs(h.height - this.height) >= ka || Math.abs(l - this.heightMetrics(e, t).perLine) >= ka) && (Cr = !0), Ha(this, h);
    } else (i || this.outdated) && (this.setHeight(e.heightForGap(t, t + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class Ey extends qt {
  constructor(e, t, i) {
    super(e.length + t + i.length, e.height + i.height, t | (e.outdated || i.outdated ? 2 : 0)), this.left = e, this.right = i, this.size = e.size + i.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(e, t, i, r) {
    let s = i + this.left.height;
    return e < s ? this.left.blockAt(e, t, i, r) : this.right.blockAt(e, t, s, r + this.left.length + this.break);
  }
  lineAt(e, t, i, r, s) {
    let o = r + this.left.height, a = s + this.left.length + this.break, l = t == Fe.ByHeight ? e < o : e < a, h = l ? this.left.lineAt(e, t, i, r, s) : this.right.lineAt(e, t, i, o, a);
    if (this.break || (l ? h.to < a : h.from > a))
      return h;
    let c = t == Fe.ByPosNoHeight ? Fe.ByPosNoHeight : Fe.ByPos;
    return l ? h.join(this.right.lineAt(a, c, i, o, a)) : this.left.lineAt(a, c, i, r, s).join(h);
  }
  forEachLine(e, t, i, r, s, o) {
    let a = r + this.left.height, l = s + this.left.length + this.break;
    if (this.break)
      e < l && this.left.forEachLine(e, t, i, r, s, o), t >= l && this.right.forEachLine(e, t, i, a, l, o);
    else {
      let h = this.lineAt(l, Fe.ByPos, i, r, s);
      e < h.from && this.left.forEachLine(e, h.from - 1, i, r, s, o), h.to >= e && h.from <= t && o(h), t > h.to && this.right.forEachLine(h.to + 1, t, i, a, l, o);
    }
  }
  replace(e, t, i) {
    let r = this.left.length + this.break;
    if (t < r)
      return this.balanced(this.left.replace(e, t, i), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - r, t - r, i));
    let s = [];
    e > 0 && this.decomposeLeft(e, s);
    let o = s.length;
    for (let a of i)
      s.push(a);
    if (e > 0 && zu(s, o - 1), t < this.length) {
      let a = s.length;
      this.decomposeRight(t, s), zu(s, a);
    }
    return qt.of(s);
  }
  decomposeLeft(e, t) {
    let i = this.left.length;
    if (e <= i)
      return this.left.decomposeLeft(e, t);
    t.push(this.left), this.break && (i++, e >= i && t.push(null)), e > i && this.right.decomposeLeft(e - i, t);
  }
  decomposeRight(e, t) {
    let i = this.left.length, r = i + this.break;
    if (e >= r)
      return this.right.decomposeRight(e - r, t);
    e < i && this.left.decomposeRight(e, t), this.break && e < r && t.push(null), t.push(this.right);
  }
  balanced(e, t) {
    return e.size > 2 * t.size || t.size > 2 * e.size ? qt.of(this.break ? [e, null, t] : [e, t]) : (this.left = Ha(this.left, e), this.right = Ha(this.right, t), this.setHeight(e.height + t.height), this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
  }
  updateHeight(e, t = 0, i = !1, r) {
    let { left: s, right: o } = this, a = t + s.length + this.break, l = null;
    return r && r.from <= t + s.length && r.more ? l = s = s.updateHeight(e, t, i, r) : s.updateHeight(e, t, i), r && r.from <= a + o.length && r.more ? l = o = o.updateHeight(e, a, i, r) : o.updateHeight(e, a, i), l ? this.balanced(s, o) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function zu(n, e) {
  let t, i;
  n[e] == null && (t = n[e - 1]) instanceof _t && (i = n[e + 1]) instanceof _t && n.splice(e - 1, 3, new _t(t.length + 1 + i.length));
}
const jy = 5;
class nf {
  constructor(e, t) {
    this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, t) {
    if (this.lineStart > -1) {
      let i = Math.min(t, this.lineEnd), r = this.nodes[this.nodes.length - 1];
      r instanceof li ? r.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new li(i - this.pos, -1, 0)), this.writtenTo = i, t > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = t;
  }
  point(e, t, i) {
    if (e < t || i.heightRelevant) {
      let r = i.widget ? i.widget.estimatedHeight : 0, s = i.widget ? i.widget.lineBreaks : 0;
      r < 0 && (r = this.oracle.lineHeight);
      let o = t - e;
      i.block ? this.addBlock(new rg(o, r, i)) : (o || s || r >= jy) && this.addLineDeco(r, s, o);
    } else t > e && this.span(e, t);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new li(this.pos - e, -1, 0)), this.writtenTo = this.pos;
  }
  blankContent(e, t) {
    let i = new _t(t - e);
    return this.oracle.doc.lineAt(e).to == t && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof li)
      return e;
    let t = new li(0, -1, 0);
    return this.nodes.push(t), t;
  }
  addBlock(e) {
    this.enterLine();
    let t = e.deco;
    t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, t && t.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, t, i) {
    let r = this.ensureLine();
    r.length += i, r.collapsed += i, r.widgetHeight = Math.max(r.widgetHeight, e), r.breaks += t, this.writtenTo = this.pos = this.pos + i;
  }
  finish(e) {
    let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(t instanceof li) && !this.isCovered ? this.nodes.push(new li(0, -1, 0)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = e;
    for (let r of this.nodes)
      r instanceof li && r.updateHeight(this.oracle, i), i += r ? r.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, t, i, r) {
    let s = new nf(i, e);
    return Pe.spans(t, i, r, s, 0), s.finish(i);
  }
}
function Vy(n, e, t) {
  let i = new Yy();
  return Pe.compare(n, e, t, i, 0), i.changes;
}
class Yy {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, t, i, r) {
    (e < t || i && i.heightRelevant || r && r.heightRelevant) && Jr(e, t, this.changes, 5);
  }
}
function Ly(n, e) {
  let t = n.getBoundingClientRect(), i = n.ownerDocument, r = i.defaultView || window, s = Math.max(0, t.left), o = Math.min(r.innerWidth, t.right), a = Math.max(0, t.top), l = Math.min(r.innerHeight, t.bottom);
  for (let h = n.parentNode; h && h != i.body; )
    if (h.nodeType == 1) {
      let c = h, f = window.getComputedStyle(c);
      if ((c.scrollHeight > c.clientHeight || c.scrollWidth > c.clientWidth) && f.overflow != "visible") {
        let O = c.getBoundingClientRect();
        s = Math.max(s, O.left), o = Math.min(o, O.right), a = Math.max(a, O.top), l = Math.min(h == n.parentNode ? r.innerHeight : l, O.bottom);
      }
      h = f.position == "absolute" || f.position == "fixed" ? c.offsetParent : c.parentNode;
    } else if (h.nodeType == 11)
      h = h.host;
    else
      break;
  return {
    left: s - t.left,
    right: Math.max(s, o) - t.left,
    top: a - (t.top + e),
    bottom: Math.max(a, l) - (t.top + e)
  };
}
function Dy(n) {
  let e = n.getBoundingClientRect(), t = n.ownerDocument.defaultView || window;
  return e.left < t.innerWidth && e.right > 0 && e.top < t.innerHeight && e.bottom > 0;
}
function Gy(n, e) {
  let t = n.getBoundingClientRect();
  return {
    left: 0,
    right: t.right - t.left,
    top: e,
    bottom: t.bottom - (t.top + e)
  };
}
class th {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.size = i, this.displaySize = r;
  }
  static same(e, t) {
    if (e.length != t.length)
      return !1;
    for (let i = 0; i < e.length; i++) {
      let r = e[i], s = t[i];
      if (r.from != s.from || r.to != s.to || r.size != s.size)
        return !1;
    }
    return !0;
  }
  draw(e, t) {
    return pe.replace({
      widget: new Iy(this.displaySize * (t ? e.scaleY : e.scaleX), t)
    }).range(this.from, this.to);
  }
}
class Iy extends qi {
  constructor(e, t) {
    super(), this.size = e, this.vertical = t;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class Mu {
  constructor(e, t) {
    this.view = e, this.state = t, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scaleX = 1, this.scaleY = 1, this.scrollOffset = 0, this.scrolledToBottom = !1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = Wu, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = Ie.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let i = t.facet(dl).some((r) => typeof r != "function" && r.class == "cm-lineWrapping");
    this.heightOracle = new ig(i), this.stateDeco = Eu(t), this.heightMap = qt.empty().applyChanges(this.stateDeco, je.empty, this.heightOracle.setDoc(t.doc), [new ci(0, 0, 0, t.doc.length)]);
    for (let r = 0; r < 2 && (this.viewport = this.getViewport(0, null), !!this.updateForViewport()); r++)
      ;
    this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = pe.set(this.lineGaps.map((r) => r.draw(this, !1))), this.scrollParent = e.scrollDOM, this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: t } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let r = i ? t.head : t.anchor;
      if (!e.some(({ from: s, to: o }) => r >= s && r <= o)) {
        let { from: s, to: o } = this.lineBlockAt(r);
        e.push(new ta(s, o));
      }
    }
    return this.viewports = e.sort((i, r) => i.from - r.from), this.updateScaler();
  }
  updateScaler() {
    let e = this.scaler;
    return this.scaler = this.heightMap.height <= 7e6 ? Wu : new rf(this.heightOracle, this.heightMap, this.viewports), e.eq(this.scaler) ? 0 : 2;
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(Ds(e, this.scaler));
    });
  }
  update(e, t = null) {
    this.state = e.state;
    let i = this.stateDeco;
    this.stateDeco = Eu(this.state);
    let r = e.changedRanges, s = ci.extendWithRanges(r, Vy(i, this.stateDeco, e ? e.changes : Ot.empty(this.state.doc.length))), o = this.heightMap.height, a = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollOffset);
    cc(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), s), (this.heightMap.height != o || Cr) && (e.flags |= 2), a ? (this.scrollAnchorPos = e.changes.mapPos(a.from, -1), this.scrollAnchorHeight = a.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = o);
    let l = s.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (t && (t.range.head < l.from || t.range.head > l.to) || !this.viewportIsAppropriate(l)) && (l = this.getViewport(0, t));
    let h = l.from != this.viewport.from || l.to != this.viewport.to;
    this.viewport = l, e.flags |= this.updateForViewport(), (h || !e.changes.empty || e.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(e.changes), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && (e.selectionSet || e.focusChanged) && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(qp) && (this.mustEnforceCursorAssoc = !0);
  }
  measure() {
    let { view: e } = this, t = e.contentDOM, i = window.getComputedStyle(t), r = this.heightOracle, s = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? Ie.RTL : Ie.LTR;
    let o = this.heightOracle.mustRefreshForWrapping(s) || this.mustMeasureContent === "refresh", a = t.getBoundingClientRect(), l = o || this.mustMeasureContent || this.contentDOMHeight != a.height;
    this.contentDOMHeight = a.height, this.mustMeasureContent = !1;
    let h = 0, c = 0;
    if (a.width && a.height) {
      let { scaleX: b, scaleY: y } = pp(t, a);
      (b > 5e-3 && Math.abs(this.scaleX - b) > 5e-3 || y > 5e-3 && Math.abs(this.scaleY - y) > 5e-3) && (this.scaleX = b, this.scaleY = y, h |= 16, o = l = !0);
    }
    let f = (parseInt(i.paddingTop) || 0) * this.scaleY, O = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != f || this.paddingBottom != O) && (this.paddingTop = f, this.paddingBottom = O, h |= 18), this.editorWidth != e.scrollDOM.clientWidth && (r.lineWrapping && (l = !0), this.editorWidth = e.scrollDOM.clientWidth, h |= 16);
    let d = gp(this.view.contentDOM, !1).y;
    d != this.scrollParent && (this.scrollParent = d, this.scrollAnchorHeight = -1, this.scrollOffset = 0);
    let p = this.getScrollOffset();
    this.scrollOffset != p && (this.scrollAnchorHeight = -1, this.scrollOffset = p), this.scrolledToBottom = vp(this.scrollParent || e.win);
    let g = (this.printing ? Gy : Ly)(t, this.paddingTop), m = g.top - this.pixelViewport.top, v = g.bottom - this.pixelViewport.bottom;
    this.pixelViewport = g;
    let w = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (w != this.inView && (this.inView = w, w && (l = !0)), !this.inView && !this.scrollTarget && !Dy(e.dom))
      return 0;
    let S = a.width;
    if ((this.contentDOMWidth != S || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = a.width, this.editorHeight = e.scrollDOM.clientHeight, h |= 16), l) {
      let b = e.docView.measureVisibleLineHeights(this.viewport);
      if (r.mustRefreshForHeights(b) && (o = !0), o || r.lineWrapping && Math.abs(S - this.contentDOMWidth) > r.charWidth) {
        let { lineHeight: y, charWidth: $, textHeight: M } = e.docView.measureTextSize();
        o = y > 0 && r.refresh(s, y, $, M, Math.max(5, S / $), b), o && (e.docView.minWidth = 0, h |= 16);
      }
      m > 0 && v > 0 ? c = Math.max(m, v) : m < 0 && v < 0 && (c = Math.min(m, v)), cc();
      for (let y of this.viewports) {
        let $ = y.from == this.viewport.from ? b : e.docView.measureVisibleLineHeights(y);
        this.heightMap = (o ? qt.empty().applyChanges(this.stateDeco, je.empty, this.heightOracle, [new ci(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(r, 0, o, new ng(y.from, $));
      }
      Cr && (h |= 2);
    }
    let Q = !this.viewportIsAppropriate(this.viewport, c) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return Q && (h & 2 && (h |= this.updateScaler()), this.viewport = this.getViewport(c, this.scrollTarget), h |= this.updateForViewport()), (h & 2 || Q) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, e)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, t) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), r = this.heightMap, s = this.heightOracle, { visibleTop: o, visibleBottom: a } = this, l = new ta(r.lineAt(o - i * 1e3, Fe.ByHeight, s, 0, 0).from, r.lineAt(a + (1 - i) * 1e3, Fe.ByHeight, s, 0, 0).to);
    if (t) {
      let { head: h } = t.range;
      if (h < l.from || h > l.to) {
        let c = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), f = r.lineAt(h, Fe.ByPos, s, 0, 0), O;
        t.y == "center" ? O = (f.top + f.bottom) / 2 - c / 2 : t.y == "start" || t.y == "nearest" && h < l.from ? O = f.top : O = f.bottom - c, l = new ta(r.lineAt(O - 1e3 / 2, Fe.ByHeight, s, 0, 0).from, r.lineAt(O + c + 1e3 / 2, Fe.ByHeight, s, 0, 0).to);
      }
    }
    return l;
  }
  mapViewport(e, t) {
    let i = t.mapPos(e.from, -1), r = t.mapPos(e.to, 1);
    return new ta(this.heightMap.lineAt(i, Fe.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(r, Fe.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: t }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: r } = this.heightMap.lineAt(e, Fe.ByPos, this.heightOracle, 0, 0), { bottom: s } = this.heightMap.lineAt(t, Fe.ByPos, this.heightOracle, 0, 0), { visibleTop: o, visibleBottom: a } = this;
    return (e == 0 || r <= o - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (t == this.state.doc.length || s >= a + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && r > o - 2 * 1e3 && s < a + 2 * 1e3;
  }
  mapLineGaps(e, t) {
    if (!e.length || t.empty)
      return e;
    let i = [];
    for (let r of e)
      t.touchesRange(r.from, r.to) || i.push(new th(t.mapPos(r.from), t.mapPos(r.to), r.size, r.displaySize));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, t) {
    let i = this.heightOracle.lineWrapping, r = i ? 1e4 : 2e3, s = r >> 1, o = r << 1;
    if (this.defaultTextDirection != Ie.LTR && !i)
      return [];
    let a = [], l = (c, f, O, d) => {
      if (f - c < s)
        return;
      let p = this.state.selection.main, g = [p.from];
      p.empty || g.push(p.to);
      for (let v of g)
        if (v > c && v < f) {
          l(c, v - 10, O, d), l(v + 10, f, O, d);
          return;
        }
      let m = Ny(e, (v) => v.from >= O.from && v.to <= O.to && Math.abs(v.from - c) < s && Math.abs(v.to - f) < s && !g.some((w) => v.from < w && v.to > w));
      if (!m) {
        if (f < O.to && t && i && t.visibleRanges.some((S) => S.from <= f && S.to >= f)) {
          let S = t.moveToLineBoundary(te.cursor(f), !1, !0).head;
          S > c && (f = S);
        }
        let v = this.gapSize(O, c, f, d), w = i || v < 2e6 ? v : 2e6;
        m = new th(c, f, v, w);
      }
      a.push(m);
    }, h = (c) => {
      if (c.length < o || c.type != yt.Text)
        return;
      let f = Uy(c.from, c.to, this.stateDeco);
      if (f.total < o)
        return;
      let O = this.scrollTarget ? this.scrollTarget.range.head : null, d, p;
      if (i) {
        let g = r / this.heightOracle.lineLength * this.heightOracle.lineHeight, m, v;
        if (O != null) {
          let w = na(f, O), S = ((this.visibleBottom - this.visibleTop) / 2 + g) / c.height;
          m = w - S, v = w + S;
        } else
          m = (this.visibleTop - c.top - g) / c.height, v = (this.visibleBottom - c.top + g) / c.height;
        d = ia(f, m), p = ia(f, v);
      } else {
        let g = f.total * this.heightOracle.charWidth, m = r * this.heightOracle.charWidth, v = 0;
        if (g > 2e6)
          for (let y of e)
            y.from >= c.from && y.from < c.to && y.size != y.displaySize && y.from * this.heightOracle.charWidth + v < this.pixelViewport.left && (v = y.size - y.displaySize);
        let w = this.pixelViewport.left + v, S = this.pixelViewport.right + v, Q, b;
        if (O != null) {
          let y = na(f, O), $ = ((S - w) / 2 + m) / g;
          Q = y - $, b = y + $;
        } else
          Q = (w - m) / g, b = (S + m) / g;
        d = ia(f, Q), p = ia(f, b);
      }
      d > c.from && l(c.from, d, c, f), p < c.to && l(p, c.to, c, f);
    };
    for (let c of this.viewportLines)
      Array.isArray(c.type) ? c.type.forEach(h) : h(c);
    return a;
  }
  gapSize(e, t, i, r) {
    let s = na(r, i) - na(r, t);
    return this.heightOracle.lineWrapping ? e.height * s : r.total * this.heightOracle.charWidth * s;
  }
  updateLineGaps(e) {
    th.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = pe.set(e.map((t) => t.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges(e) {
    let t = this.stateDeco;
    this.lineGaps.length && (t = t.concat(this.lineGapDeco));
    let i = [];
    Pe.spans(t, this.viewport.from, this.viewport.to, {
      span(s, o) {
        i.push({ from: s, to: o });
      },
      point() {
      }
    }, 20);
    let r = 0;
    if (i.length != this.visibleRanges.length)
      r = 12;
    else
      for (let s = 0; s < i.length && !(r & 8); s++) {
        let o = this.visibleRanges[s], a = i[s];
        (o.from != a.from || o.to != a.to) && (r |= 4, e && e.mapPos(o.from, -1) == a.from && e.mapPos(o.to, 1) == a.to || (r |= 8));
      }
    return this.visibleRanges = i, r;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || Ds(this.heightMap.lineAt(e, Fe.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return e >= this.viewportLines[0].top && e <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((t) => t.top <= e && t.bottom >= e) || Ds(this.heightMap.lineAt(this.scaler.fromDOM(e), Fe.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  getScrollOffset() {
    return (this.scrollParent == this.view.scrollDOM ? this.scrollParent.scrollTop : (this.scrollParent ? this.scrollParent.getBoundingClientRect().top : 0) - this.view.contentDOM.getBoundingClientRect().top) * this.scaleY;
  }
  scrollAnchorAt(e) {
    let t = this.lineBlockAtHeight(e + 8);
    return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return Ds(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class ta {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
function Uy(n, e, t) {
  let i = [], r = n, s = 0;
  return Pe.spans(t, n, e, {
    span() {
    },
    point(o, a) {
      o > r && (i.push({ from: r, to: o }), s += o - r), r = a;
    }
  }, 20), r < e && (i.push({ from: r, to: e }), s += e - r), { total: s, ranges: i };
}
function ia({ total: n, ranges: e }, t) {
  if (t <= 0)
    return e[0].from;
  if (t >= 1)
    return e[e.length - 1].to;
  let i = Math.floor(n * t);
  for (let r = 0; ; r++) {
    let { from: s, to: o } = e[r], a = o - s;
    if (i <= a)
      return s + i;
    i -= a;
  }
}
function na(n, e) {
  let t = 0;
  for (let { from: i, to: r } of n.ranges) {
    if (e <= r) {
      t += e - i;
      break;
    }
    t += r - i;
  }
  return t / n.total;
}
function Ny(n, e) {
  for (let t of n)
    if (e(t))
      return t;
}
const Wu = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1,
  eq(n) {
    return n == this;
  }
};
function Eu(n) {
  let e = n.facet(pl).filter((i) => typeof i != "function"), t = n.facet(Kc).filter((i) => typeof i != "function");
  return t.length && e.push(Pe.join(t)), e;
}
class rf {
  constructor(e, t, i) {
    let r = 0, s = 0, o = 0;
    this.viewports = i.map(({ from: a, to: l }) => {
      let h = t.lineAt(a, Fe.ByPos, e, 0, 0).top, c = t.lineAt(l, Fe.ByPos, e, 0, 0).bottom;
      return r += c - h, { from: a, to: l, top: h, bottom: c, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - r) / (t.height - r);
    for (let a of this.viewports)
      a.domTop = o + (a.top - s) * this.scale, o = a.domBottom = a.domTop + (a.bottom - a.top), s = a.bottom;
  }
  toDOM(e) {
    for (let t = 0, i = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.top)
        return r + (e - i) * this.scale;
      if (e <= s.bottom)
        return s.domTop + (e - s.top);
      i = s.bottom, r = s.domBottom;
    }
  }
  fromDOM(e) {
    for (let t = 0, i = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.domTop)
        return i + (e - r) / this.scale;
      if (e <= s.domBottom)
        return s.top + (e - s.domTop);
      i = s.bottom, r = s.domBottom;
    }
  }
  eq(e) {
    return e instanceof rf ? this.scale == e.scale && this.viewports.length == e.viewports.length && this.viewports.every((t, i) => t.from == e.viewports[i].from && t.to == e.viewports[i].to) : !1;
  }
}
function Ds(n, e) {
  if (e.scale == 1)
    return n;
  let t = e.toDOM(n.top), i = e.toDOM(n.bottom);
  return new Qi(n.from, n.length, t, i - t, Array.isArray(n._content) ? n._content.map((r) => Ds(r, e)) : n._content);
}
const ra = /* @__PURE__ */ se.define({ combine: (n) => n.join(" ") }), fc = /* @__PURE__ */ se.define({ combine: (n) => n.indexOf(!0) > -1 }), uc = /* @__PURE__ */ tr.newName(), sg = /* @__PURE__ */ tr.newName(), og = /* @__PURE__ */ tr.newName(), ag = { "&light": "." + sg, "&dark": "." + og };
function Oc(n, e, t) {
  return new tr(e, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (r) => {
        if (r == "&")
          return n;
        if (!t || !t[r])
          throw new RangeError(`Unsupported selector: ${r}`);
        return t[r];
      }) : n + " " + i;
    }
  });
}
const By = /* @__PURE__ */ Oc("." + uc, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0,
    overflowAnchor: "none"
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // Issue #456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    userSelect: "none",
    // #1708
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#ddd"
  },
  ".cm-selectionHandle": {
    backgroundColor: "currentColor",
    width: "1.5px"
  },
  ".cm-selectionHandle-start::before, .cm-selectionHandle-end::before": {
    content: '""',
    backgroundColor: "inherit",
    borderRadius: "50%",
    width: "8px",
    height: "8px",
    position: "absolute",
    left: "-3.25px"
  },
  ".cm-selectionHandle-start::before": { top: "-8px" },
  ".cm-selectionHandle-end::before": { bottom: "-8px" },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    zIndex: 200
  },
  ".cm-gutters-before": { insetInlineStart: 0 },
  ".cm-gutters-after": { insetInlineEnd: 0 },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    border: "0px solid #ddd",
    "&.cm-gutters-before": { borderRightWidth: "1px" },
    "&.cm-gutters-after": { borderLeftWidth: "1px" }
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0,
    zIndex: 300
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-dialog": {
    padding: "2px 19px 4px 6px",
    position: "relative",
    "& label": { fontSize: "80%" }
  },
  ".cm-dialog-close": {
    position: "absolute",
    top: "3px",
    right: "4px",
    backgroundColor: "inherit",
    border: "none",
    font: "inherit",
    fontSize: "14px",
    padding: "0"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top",
    userSelect: "none"
  },
  ".cm-highlightSpace": {
    backgroundImage: "radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",
    backgroundPosition: "center"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, ag), Fy = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, ih = ie.ie && ie.ie_version <= 11;
class Hy {
  constructor(e) {
    this.view = e, this.active = !1, this.editContext = null, this.selectionRange = new ZS(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
      for (let i of t)
        this.queue.push(i);
      (ie.ie && ie.ie_version <= 11 || ie.ios && e.composing) && t.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), window.EditContext && ie.android && e.constructor.EDIT_CONTEXT !== !1 && // Chrome <126 doesn't support inverted selections in edit context (#1392)
    !(ie.chrome && ie.chrome_version < 126) && (this.editContext = new Ky(e), e.state.facet(kn) && (e.contentDOM.editContext = this.editContext.editContext)), ih && (this.onCharData = (t) => {
      this.queue.push({
        target: t.target,
        type: "characterData",
        oldValue: t.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var t;
      ((t = this.view.docView) === null || t === void 0 ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((t) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((t) => {
      t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(!1), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint(e) {
    (e.type == "change" || !e.type) && !e.matches || (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500));
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, i) => t != e[i]))) {
      this.gapIntersection.disconnect();
      for (let t of e)
        this.gapIntersection.observe(t);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let t = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, r = this.selectionRange;
    if (i.state.facet(kn) ? i.root.activeElement != this.dom : !to(this.dom, r))
      return;
    let s = r.anchorNode && i.docView.tile.nearest(r.anchorNode);
    if (s && s.isWidget() && s.widget.ignoreEvent(e)) {
      t || (this.selectionChanged = !1);
      return;
    }
    (ie.ie && ie.ie_version <= 11 || ie.android && ie.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    r.focusNode && no(r.focusNode, r.focusOffset, r.anchorNode, r.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, t = go(e.root);
    if (!t)
      return !1;
    let i = ie.safari && e.root.nodeType == 11 && e.root.activeElement == this.dom && Jy(this.view, t) || t;
    if (!i || this.selectionRange.eq(i))
      return !1;
    let r = to(this.dom, i);
    return r && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && XS(this.dom, i) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(i), r && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, t) {
    this.selectionRange.set(e.node, e.offset, t.node, t.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, t = null;
    for (let i = this.dom; i; )
      if (i.nodeType == 1)
        !t && e < this.scrollTargets.length && this.scrollTargets[e] == i ? e++ : t || (t = this.scrollTargets.slice(0, e)), t && t.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = t)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, Fy), ih && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), ih && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, t) {
    var i;
    if (!this.delayedAndroidKey) {
      let r = () => {
        let s = this.delayedAndroidKey;
        s && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = s.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && s.force && Kr(this.dom, s.key, s.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(r);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: t,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((i = this.delayedAndroidKey) === null || i === void 0) && i.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let t = -1, i = -1, r = !1;
    for (let s of e) {
      let o = this.readMutation(s);
      o && (o.typeOver && (r = !0), t == -1 ? { from: t, to: i } = o : (t = Math.min(o.from, t), i = Math.max(o.to, i)));
    }
    return { from: t, to: i, typeOver: r };
  }
  readChange() {
    let { from: e, to: t, typeOver: i } = this.processRecords(), r = this.selectionChanged && to(this.dom, this.selectionRange);
    if (e < 0 && !r)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let s = new my(this.view, e, t, i);
    return this.view.docView.domChanged = { newSel: s.newSel ? s.newSel.main : null }, s;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let t = this.readChange();
    if (!t)
      return this.view.requestMeasure(), !1;
    let i = this.view.state, r = Ip(this.view, t);
    return this.view.state == i && (t.domChanged || t.newSel && !Fa(this.view.state.selection, t.newSel.main)) && this.view.update([]), r;
  }
  readMutation(e) {
    let t = this.view.docView.tile.nearest(e.target);
    if (!t || t.isWidget())
      return null;
    if (t.markDirty(e.type == "attributes"), e.type == "childList") {
      let i = ju(t, e.previousSibling || e.target.previousSibling, -1), r = ju(t, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: i ? t.posAfter(i) : t.posAtStart,
        to: r ? t.posBefore(r) : t.posAtEnd,
        typeOver: !1
      };
    } else return e.type == "characterData" ? { from: t.posAtStart, to: t.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), this.printQuery ? this.printQuery.addEventListener ? this.printQuery.addEventListener("change", this.onPrint) : this.printQuery.addListener(this.onPrint) : e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), this.printQuery ? this.printQuery.removeEventListener ? this.printQuery.removeEventListener("change", this.onPrint) : this.printQuery.removeListener(this.onPrint) : e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  update(e) {
    this.editContext && (this.editContext.update(e), e.startState.facet(kn) != e.state.facet(kn) && (e.view.contentDOM.editContext = e.state.facet(kn) ? this.editContext.editContext : null));
  }
  destroy() {
    var e, t, i;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (t = this.gapIntersection) === null || t === void 0 || t.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
    for (let r of this.scrollTargets)
      r.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy());
  }
}
function ju(n, e, t) {
  for (; e; ) {
    let i = at.get(e);
    if (i && i.parent == n)
      return i;
    let r = e.parentNode;
    e = r != n.dom ? r : t > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function Vu(n, e) {
  let t = e.startContainer, i = e.startOffset, r = e.endContainer, s = e.endOffset, o = n.docView.domAtPos(n.state.selection.main.anchor, 1);
  return no(o.node, o.offset, r, s) && ([t, i, r, s] = [r, s, t, i]), { anchorNode: t, anchorOffset: i, focusNode: r, focusOffset: s };
}
function Jy(n, e) {
  if (e.getComposedRanges) {
    let r = e.getComposedRanges(n.root)[0];
    if (r)
      return Vu(n, r);
  }
  let t = null;
  function i(r) {
    r.preventDefault(), r.stopImmediatePropagation(), t = r.getTargetRanges()[0];
  }
  return n.contentDOM.addEventListener("beforeinput", i, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", i, !0), t ? Vu(n, t) : null;
}
class Ky {
  constructor(e) {
    this.from = 0, this.to = 0, this.pendingContextChange = null, this.handlers = /* @__PURE__ */ Object.create(null), this.composing = null, this.resetRange(e.state);
    let t = this.editContext = new window.EditContext({
      text: e.state.doc.sliceString(this.from, this.to),
      selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, e.state.selection.main.anchor))),
      selectionEnd: this.toContextPos(e.state.selection.main.head)
    });
    this.handlers.textupdate = (i) => {
      let r = e.state.selection.main, { anchor: s, head: o } = r, a = this.toEditorPos(i.updateRangeStart), l = this.toEditorPos(i.updateRangeEnd);
      e.inputState.composing >= 0 && !this.composing && (this.composing = { contextBase: i.updateRangeStart, editorBase: a, drifted: !1 });
      let h = l - a > i.text.length;
      a == this.from && s < this.from ? a = s : l == this.to && s > this.to && (l = s);
      let c = Up(e.state.sliceDoc(a, l), i.text, (h ? r.from : r.to) - a, h ? "end" : null);
      if (!c) {
        let O = te.single(this.toEditorPos(i.selectionStart), this.toEditorPos(i.selectionEnd));
        Fa(O, r) || e.dispatch({ selection: O, userEvent: "select" });
        return;
      }
      let f = {
        from: c.from + a,
        to: c.toA + a,
        insert: je.of(i.text.slice(c.from, c.toB).split(`
`))
      };
      if ((ie.mac || ie.android) && f.from == o - 1 && /^\. ?$/.test(i.text) && e.contentDOM.getAttribute("autocorrect") == "off" && (f = { from: a, to: l, insert: je.of([i.text.replace(".", " ")]) }), this.pendingContextChange = f, !e.state.readOnly) {
        let O = this.to - this.from + (f.to - f.from + f.insert.length);
        tf(e, f, te.single(this.toEditorPos(i.selectionStart, O), this.toEditorPos(i.selectionEnd, O)));
      }
      this.pendingContextChange && (this.revertPending(e.state), this.setSelection(e.state)), f.from < f.to && !f.insert.length && e.inputState.composing >= 0 && !/[\\p{Alphabetic}\\p{Number}_]/.test(t.text.slice(Math.max(0, i.updateRangeStart - 1), Math.min(t.text.length, i.updateRangeStart + 1))) && this.handlers.compositionend(i);
    }, this.handlers.characterboundsupdate = (i) => {
      let r = [], s = null;
      for (let o = this.toEditorPos(i.rangeStart), a = this.toEditorPos(i.rangeEnd); o < a; o++) {
        let l = e.coordsForChar(o);
        s = l && new DOMRect(l.left, l.top, l.right - l.left, l.bottom - l.top) || s || new DOMRect(), r.push(s);
      }
      t.updateCharacterBounds(i.rangeStart, r);
    }, this.handlers.textformatupdate = (i) => {
      let r = [];
      for (let s of i.getTextFormats()) {
        let o = s.underlineStyle, a = s.underlineThickness;
        if (!/none/i.test(o) && !/none/i.test(a)) {
          let l = this.toEditorPos(s.rangeStart), h = this.toEditorPos(s.rangeEnd);
          if (l < h) {
            let c = `text-decoration: underline ${/^[a-z]/.test(o) ? o + " " : o == "Dashed" ? "dashed " : o == "Squiggle" ? "wavy " : ""}${/thin/i.test(a) ? 1 : 2}px`;
            r.push(pe.mark({ attributes: { style: c } }).range(l, h));
          }
        }
      }
      e.dispatch({ effects: Mp.of(pe.set(r)) });
    }, this.handlers.compositionstart = () => {
      e.inputState.composing < 0 && (e.inputState.composing = 0, e.inputState.compositionFirstChange = !0);
    }, this.handlers.compositionend = () => {
      if (e.inputState.composing = -1, e.inputState.compositionFirstChange = null, this.composing) {
        let { drifted: i } = this.composing;
        this.composing = null, i && this.reset(e.state);
      }
    };
    for (let i in this.handlers)
      t.addEventListener(i, this.handlers[i]);
    this.measureReq = { read: (i) => {
      let r = go(i.root);
      r && r.rangeCount && this.editContext.updateSelectionBounds(r.getRangeAt(0).getBoundingClientRect());
    } };
  }
  applyEdits(e) {
    let t = 0, i = !1, r = this.pendingContextChange;
    return e.changes.iterChanges((s, o, a, l, h) => {
      if (i)
        return;
      let c = h.length - (o - s);
      if (r && o >= r.to)
        if (r.from == s && r.to == o && r.insert.eq(h)) {
          r = this.pendingContextChange = null, t += c, this.to += c;
          return;
        } else
          r = null, this.revertPending(e.state);
      if (s += t, o += t, o <= this.from)
        this.from += c, this.to += c;
      else if (s < this.to) {
        if (s < this.from || o > this.to || this.to - this.from + h.length > 3e4) {
          i = !0;
          return;
        }
        this.editContext.updateText(this.toContextPos(s), this.toContextPos(o), h.toString()), this.to += c;
      }
      t += c;
    }), r && !i && this.revertPending(e.state), !i;
  }
  update(e) {
    let t = this.pendingContextChange, i = e.startState.selection.main;
    this.composing && (this.composing.drifted || !e.changes.touchesRange(i.from, i.to) && e.transactions.some((r) => !r.isUserEvent("input.type") && r.changes.touchesRange(this.from, this.to))) ? (this.composing.drifted = !0, this.composing.editorBase = e.changes.mapPos(this.composing.editorBase)) : !this.applyEdits(e) || !this.rangeIsValid(e.state) ? (this.pendingContextChange = null, this.reset(e.state)) : (e.docChanged || e.selectionSet || t) && this.setSelection(e.state), (e.geometryChanged || e.docChanged || e.selectionSet) && e.view.requestMeasure(this.measureReq);
  }
  resetRange(e) {
    let { head: t } = e.selection.main;
    this.from = Math.max(
      0,
      t - 1e4
      /* CxVp.Margin */
    ), this.to = Math.min(
      e.doc.length,
      t + 1e4
      /* CxVp.Margin */
    );
  }
  reset(e) {
    this.resetRange(e), this.editContext.updateText(0, this.editContext.text.length, e.doc.sliceString(this.from, this.to)), this.setSelection(e);
  }
  revertPending(e) {
    let t = this.pendingContextChange;
    this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(t.from), this.toContextPos(t.from + t.insert.length), e.doc.sliceString(t.from, t.to));
  }
  setSelection(e) {
    let { main: t } = e.selection, i = this.toContextPos(Math.max(this.from, Math.min(this.to, t.anchor))), r = this.toContextPos(t.head);
    (this.editContext.selectionStart != i || this.editContext.selectionEnd != r) && this.editContext.updateSelection(i, r);
  }
  rangeIsValid(e) {
    let { head: t } = e.selection.main;
    return !(this.from > 0 && t - this.from < 500 || this.to < e.doc.length && this.to - t < 500 || this.to - this.from > 1e4 * 3);
  }
  toEditorPos(e, t = this.to - this.from) {
    e = Math.min(e, t);
    let i = this.composing;
    return i && i.drifted ? i.editorBase + (e - i.contextBase) : e + this.from;
  }
  toContextPos(e) {
    let t = this.composing;
    return t && t.drifted ? t.contextBase + (e - t.editorBase) : e - this.from;
  }
  destroy() {
    for (let e in this.handlers)
      this.editContext.removeEventListener(e, this.handlers[e]);
  }
}
class ce {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return !!this.inputState && this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return !!this.inputState && this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    var t;
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: i } = e;
    this.dispatchTransactions = e.dispatchTransactions || i && ((r) => r.forEach((s) => i(s, this))) || ((r) => this.update(r)), this.dispatch = this.dispatch.bind(this), this._root = e.root || RS(e.parent) || document, this.viewState = new Mu(this, e.state || We.create(e)), e.scrollTo && e.scrollTo.is(Jo) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(Ir).map((r) => new Fl(r));
    for (let r of this.plugins)
      r.update(this);
    this.observer = new Hy(this), this.inputState = new Sy(this), this.inputState.ensureHandlers(this.plugins), this.docView = new wu(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), !((t = document.fonts) === null || t === void 0) && t.ready && document.fonts.ready.then(() => {
      this.viewState.mustMeasureContent = "refresh", this.requestMeasure();
    });
  }
  dispatch(...e) {
    let t = e.length == 1 && e[0] instanceof St ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(t, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let t = !1, i = !1, r, s = this.state;
    for (let O of e) {
      if (O.startState != s)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      s = O.state;
    }
    if (this.destroyed) {
      this.viewState.state = s;
      return;
    }
    let o = this.hasFocus, a = 0, l = null;
    e.some((O) => O.annotation(Kp)) ? (this.inputState.notifiedFocused = o, a = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, l = eg(s, o), l || (a = 1));
    let h = this.observer.delayedAndroidKey, c = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), c = this.observer.readChange(), (c && !this.state.doc.eq(s.doc) || !this.state.selection.eq(s.selection)) && (c = null)) : this.observer.clear(), s.facet(We.phrases) != this.state.facet(We.phrases))
      return this.setState(s);
    r = Qo.create(this, s, e), r.flags |= a;
    let f = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let O of e) {
        if (f && (f = f.map(O.changes)), O.scrollIntoView) {
          let { main: d } = O.state.selection, { x: p, y: g } = this.state.facet(ce.cursorScrollMargin);
          f = new es(d.empty ? d : te.cursor(d.head, d.head > d.anchor ? -1 : 1), "nearest", "nearest", g, p);
        }
        for (let d of O.effects)
          d.is(Jo) && (f = d.value.clip(this.state));
      }
      this.viewState.update(r, f), this.bidiCache = Ja.update(this.bidiCache, r.changes), r.empty || (this.updatePlugins(r), this.inputState.update(r)), t = this.docView.update(r), this.state.facet(Ls) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(t, e.some((O) => O.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (r.startState.facet(ra) != r.state.facet(ra) && (this.viewState.mustMeasureContent = !0), (t || i || f || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), t && this.docViewUpdate(), !r.empty)
      for (let O of this.state.facet(sc))
        try {
          O(r);
        } catch (d) {
          Si(this.state, d, "update listener");
        }
    (l || c) && Promise.resolve().then(() => {
      l && this.state == l.startState && this.dispatch(l), c && !Ip(this, c) && h.force && Kr(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let t = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new Mu(this, e), this.plugins = e.facet(Ir).map((i) => new Fl(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView.destroy(), this.docView = new wu(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    t && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let t = e.startState.facet(Ir), i = e.state.facet(Ir);
    if (t != i) {
      let r = [];
      for (let s of i) {
        let o = t.indexOf(s);
        if (o < 0)
          r.push(new Fl(s));
        else {
          let a = this.plugins[o];
          a.mustUpdate = e, r.push(a);
        }
      }
      for (let s of this.plugins)
        s.mustUpdate != e && s.destroy(this);
      this.plugins = r, this.pluginMap.clear();
    } else
      for (let r of this.plugins)
        r.mustUpdate = e;
    for (let r = 0; r < this.plugins.length; r++)
      this.plugins[r].update(this);
    t != i && this.inputState.ensureHandlers(this.plugins);
  }
  docViewUpdate() {
    for (let e of this.plugins) {
      let t = e.value;
      if (t && t.docViewUpdate)
        try {
          t.docViewUpdate(this);
        } catch (i) {
          Si(this.state, i, "doc view update listener");
        }
    }
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let t = null, i = this.viewState.scrollParent, r = this.viewState.getScrollOffset(), { scrollAnchorPos: s, scrollAnchorHeight: o } = this.viewState;
    Math.abs(r - this.viewState.scrollOffset) > 1 && (o = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let a = 0; ; a++) {
        if (o < 0)
          if (vp(i || this.win))
            s = -1, o = this.viewState.heightMap.height;
          else {
            let d = this.viewState.scrollAnchorAt(r);
            s = d.from, o = d.top;
          }
        this.updateState = 1;
        let l = this.viewState.measure();
        if (!l && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (a > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let h = [];
        l & 4 || ([this.measureRequests, h] = [h, this.measureRequests]);
        let c = h.map((d) => {
          try {
            return d.read(this);
          } catch (p) {
            return Si(this.state, p), Yu;
          }
        }), f = Qo.create(this, this.state, []), O = !1;
        f.flags |= l, t ? t.flags |= l : t = f, this.updateState = 2, f.empty || (this.updatePlugins(f), this.inputState.update(f), this.updateAttrs(), O = this.docView.update(f), O && this.docViewUpdate());
        for (let d = 0; d < h.length; d++)
          if (c[d] != Yu)
            try {
              let p = h[d];
              p.write && p.write(c[d], this);
            } catch (p) {
              Si(this.state, p);
            }
        if (O && this.docView.updateSelection(!0), !f.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, o = -1;
              continue;
            } else {
              let p = ((s < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(s).top) - o) / this.scaleY;
              if ((p > 1 || p < -1) && !(ie.ios && this.inputState.lastIOSMomentumScroll > Date.now() - 100) && (i == this.scrollDOM || this.hasFocus || Math.max(this.inputState.lastWheelEvent, this.inputState.lastTouchTime) > Date.now() - 100)) {
                r = r + p, i ? i.scrollTop += p : this.win.scrollBy(0, p), o = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (t && !t.empty)
      for (let a of this.state.facet(sc))
        a(t);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return uc + " " + (this.state.facet(fc) ? og : sg) + " " + this.state.facet(ra);
  }
  updateAttrs() {
    let e = Lu(this, Wp, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), t = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      writingsuggestions: "false",
      translate: "no",
      contenteditable: this.state.facet(kn) ? "true" : "false",
      class: "cm-content",
      style: `${ie.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (t["aria-readonly"] = "true"), Lu(this, dl, t);
    let i = this.observer.ignore(() => {
      let r = Qu(this.contentDOM, this.contentAttrs, t), s = Qu(this.dom, this.editorAttrs, e);
      return r || s;
    });
    return this.editorAttrs = e, this.contentAttrs = t, i;
  }
  showAnnouncements(e) {
    let t = !0;
    for (let i of e)
      for (let r of i.effects)
        if (r.is(ce.announce)) {
          t && (this.announceDOM.textContent = ""), t = !1;
          let s = this.announceDOM.appendChild(document.createElement("div"));
          s.textContent = r.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(Ls);
    let e = this.state.facet(ce.cspNonce);
    tr.mount(this.root, this.styleModules.concat(By).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let t = 0; t < this.measureRequests.length; t++)
          if (this.measureRequests[t].key === e.key) {
            this.measureRequests[t] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let t = this.pluginMap.get(e);
    return (t === void 0 || t && t.plugin != e) && this.pluginMap.set(e, t = this.plugins.find((i) => i.plugin == e) || null), t && t.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt)) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line break, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, t, i) {
    return eh(this, e, Pu(this, e, t, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, t) {
    return eh(this, e, Pu(this, e, t, (i) => fy(this, e.head, i)));
  }
  /**
  Get the cursor position visually at the start or end of a line.
  Note that this may differ from the _logical_ position at its
  start or end (which is simply at `line.from`/`line.to`) if text
  at the start or end goes against the line's base text direction.
  */
  visualLineSide(e, t) {
    let i = this.bidiSpans(e), r = this.textDirectionAt(e.from), s = i[t ? i.length - 1 : 0];
    return te.cursor(s.side(t, r) + e.from, s.forward(!t, r) ? 1 : -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, t, i = !0) {
    return cy(this, e, t, i);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, t, i) {
    return eh(this, e, uy(this, e, t, i));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e, t = 1) {
    return this.docView.domAtPos(e, t);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, t = 0) {
    return this.docView.posFromDOM(e, t);
  }
  posAtCoords(e, t = !0) {
    this.readMeasured();
    let i = lc(this, e, t);
    return i && i.pos;
  }
  posAndSideAtCoords(e, t = !0) {
    return this.readMeasured(), lc(this, e, t);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, t = 1) {
    this.readMeasured();
    let i = this.state.doc.lineAt(e), r = this.bidiSpans(i), s = r[Xi.find(r, e - i.from, -1, t)];
    return this.docView.coordsAt(e, t, s.dir == Ie.RTL);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(Ap) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > ek)
      return wp(e.length);
    let t = this.textDirectionAt(e.from), i;
    for (let s of this.bidiCache)
      if (s.from == e.from && s.dir == t && (s.fresh || kp(s.isolates, i = yu(this, e))))
        return s.order;
    i || (i = yu(this, e));
    let r = xp(e.text, t, i);
    return this.bidiCache.push(new Ja(e.from, e.to, t, i, !0, r)), r;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || ie.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      mp(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    this.root.activeElement == this.contentDOM && this.contentDOM.blur();
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, t = {}) {
    var i, r, s, o;
    return Jo.of(new es(typeof e == "number" ? te.cursor(e) : e, (i = t.y) !== null && i !== void 0 ? i : "nearest", (r = t.x) !== null && r !== void 0 ? r : "nearest", (s = t.yMargin) !== null && s !== void 0 ? s : 5, (o = t.xMargin) !== null && o !== void 0 ? o : 5));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: t } = this.scrollDOM, i = this.viewState.scrollAnchorAt(e);
    return Jo.of(new es(te.cursor(i.from), "start", "start", i.top - e, t, !0));
  }
  /**
  Enable or disable tab-focus mode, which disables key bindings
  for Tab and Shift-Tab, letting the browser's default
  focus-changing behavior go through instead. This is useful to
  prevent trapping keyboard users in your editor.
  
  Without argument, this toggles the mode. With a boolean, it
  enables (true) or disables it (false). Given a number, it
  temporarily enables the mode until that number of milliseconds
  have passed or another non-Tab key is pressed.
  */
  setTabFocusMode(e) {
    e == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof e == "boolean" ? this.inputState.tabFocusMode = e ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + e);
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return ot.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return ot.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://code.haverbeke.berlin/marijn/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, t) {
    let i = tr.newName(), r = [ra.of(i), Ls.of(Oc(`.${i}`, e))];
    return t && t.dark && r.push(fc.of(!0)), r;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return Mr.lowest(Ls.of(Oc("." + uc, e, ag)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var t;
    let i = e.querySelector(".cm-content"), r = i && at.get(i) || at.get(e);
    return ((t = r == null ? void 0 : r.root) === null || t === void 0 ? void 0 : t.view) || null;
  }
}
ce.styleModule = Ls;
ce.inputHandler = Xp;
ce.clipboardInputFilter = Hc;
ce.clipboardOutputFilter = Jc;
ce.scrollHandler = zp;
ce.focusChangeEffect = Cp;
ce.perLineTextDirection = Ap;
ce.exceptionSink = Rp;
ce.updateListener = sc;
ce.editable = kn;
ce.mouseSelectionStyle = Zp;
ce.dragMovesSelection = $p;
ce.clickAddsSelectionRange = Tp;
ce.decorations = pl;
ce.blockWrappers = Ep;
ce.outerDecorations = Kc;
ce.atomicRanges = jo;
ce.bidiIsolatedRanges = jp;
ce.cursorScrollMargin = /* @__PURE__ */ se.define({
  combine: (n) => {
    let e = 5, t = 5;
    for (let i of n)
      typeof i == "number" ? e = t = i : { x: e, y: t } = i;
    return { x: e, y: t };
  }
});
ce.scrollMargins = Vp;
ce.darkTheme = fc;
ce.cspNonce = /* @__PURE__ */ se.define({ combine: (n) => n.length ? n[0] : "" });
ce.contentAttributes = dl;
ce.editorAttributes = Wp;
ce.lineWrapping = /* @__PURE__ */ ce.contentAttributes.of({ class: "cm-lineWrapping" });
ce.announce = /* @__PURE__ */ qe.define();
const ek = 4096, Yu = {};
class Ja {
  constructor(e, t, i, r, s, o) {
    this.from = e, this.to = t, this.dir = i, this.isolates = r, this.fresh = s, this.order = o;
  }
  static update(e, t) {
    if (t.empty && !e.some((s) => s.fresh))
      return e;
    let i = [], r = e.length ? e[e.length - 1].dir : Ie.LTR;
    for (let s = Math.max(0, e.length - 10); s < e.length; s++) {
      let o = e[s];
      o.dir == r && !t.touchesRange(o.from, o.to) && i.push(new Ja(t.mapPos(o.from, 1), t.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
    }
    return i;
  }
}
function Lu(n, e, t) {
  for (let i = n.state.facet(e), r = i.length - 1; r >= 0; r--) {
    let s = i[r], o = typeof s == "function" ? s(n) : s;
    o && Nc(o, t);
  }
  return t;
}
const tk = ie.mac ? "mac" : ie.windows ? "win" : ie.linux ? "linux" : "key";
function ik(n, e) {
  const t = n.split(/-(?!$)/);
  let i = t[t.length - 1];
  i == "Space" && (i = " ");
  let r, s, o, a;
  for (let l = 0; l < t.length - 1; ++l) {
    const h = t[l];
    if (/^(cmd|meta|m)$/i.test(h))
      a = !0;
    else if (/^a(lt)?$/i.test(h))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      s = !0;
    else if (/^s(hift)?$/i.test(h))
      o = !0;
    else if (/^mod$/i.test(h))
      e == "mac" ? a = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return r && (i = "Alt-" + i), s && (i = "Ctrl-" + i), a && (i = "Meta-" + i), o && (i = "Shift-" + i), i;
}
function sa(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
const nk = /* @__PURE__ */ Mr.default(/* @__PURE__ */ ce.domEventHandlers({
  keydown(n, e) {
    return hg(lg(e.state), n, e, "editor");
  }
})), sf = /* @__PURE__ */ se.define({ enables: nk }), Du = /* @__PURE__ */ new WeakMap();
function lg(n) {
  let e = n.facet(sf), t = Du.get(e);
  return t || Du.set(e, t = ok(e.reduce((i, r) => i.concat(r), []))), t;
}
function rk(n, e, t) {
  return hg(lg(n.state), e, n, t);
}
let Vn = null;
const sk = 4e3;
function ok(n, e = tk) {
  let t = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), r = (o, a) => {
    let l = i[o];
    if (l == null)
      i[o] = a;
    else if (l != a)
      throw new Error("Key binding " + o + " is used both as a regular binding and as a multi-stroke prefix");
  }, s = (o, a, l, h, c) => {
    var f, O;
    let d = t[o] || (t[o] = /* @__PURE__ */ Object.create(null)), p = a.split(/ (?!$)/).map((v) => ik(v, e));
    for (let v = 1; v < p.length; v++) {
      let w = p.slice(0, v).join(" ");
      r(w, !0), d[w] || (d[w] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(S) => {
          let Q = Vn = { view: S, prefix: w, scope: o };
          return setTimeout(() => {
            Vn == Q && (Vn = null);
          }, sk), !0;
        }]
      });
    }
    let g = p.join(" ");
    r(g, !1);
    let m = d[g] || (d[g] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((O = (f = d._any) === null || f === void 0 ? void 0 : f.run) === null || O === void 0 ? void 0 : O.slice()) || []
    });
    l && m.run.push(l), h && (m.preventDefault = !0), c && (m.stopPropagation = !0);
  };
  for (let o of n) {
    let a = o.scope ? o.scope.split(" ") : ["editor"];
    if (o.any)
      for (let h of a) {
        let c = t[h] || (t[h] = /* @__PURE__ */ Object.create(null));
        c._any || (c._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        let { any: f } = o;
        for (let O in c)
          c[O].run.push((d) => f(d, dc));
      }
    let l = o[e] || o.key;
    if (l)
      for (let h of a)
        s(h, l, o.run, o.preventDefault, o.stopPropagation), o.shift && s(h, "Shift-" + l, o.shift, o.preventDefault, o.stopPropagation);
  }
  return t;
}
let dc = null;
function hg(n, e, t, i) {
  dc = e;
  let r = xS(e), s = Lc(r, 0), o = Fd(s) == r.length && r != " ", a = "", l = !1, h = !1, c = !1;
  Vn && Vn.view == t && Vn.scope == i && (a = Vn.prefix + " ", Bp.indexOf(e.keyCode) < 0 && (h = !0, Vn = null));
  let f = /* @__PURE__ */ new Set(), O = (m) => {
    if (m) {
      for (let v of m.run)
        if (!f.has(v) && (f.add(v), v(t)))
          return m.stopPropagation && (c = !0), !0;
      m.preventDefault && (m.stopPropagation && (c = !0), h = !0);
    }
    return !1;
  }, d = n[i], p, g;
  return d && (O(d[a + sa(r, e, !o)]) ? l = !0 : o && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(ie.windows && e.ctrlKey && e.altKey) && // Alt-combinations on macOS tend to be typed characters
  !(ie.mac && e.altKey && !(e.ctrlKey || e.metaKey)) && (p = ir[e.keyCode]) && p != r ? (O(d[a + sa(p, e, !0)]) || e.shiftKey && (g = po[e.keyCode]) != r && g != p && O(d[a + sa(g, e, !1)])) && (l = !0) : o && e.shiftKey && O(d[a + sa(r, e, !0)]) && (l = !0), !l && O(d._any) && (l = !0)), h && (l = !0), l && c && e.stopPropagation(), dc = null, l;
}
class Fn {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, t, i, r, s) {
    this.className = e, this.left = t, this.top = i, this.width = r, this.height = s;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, t) {
    return t.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, t, i) {
    if (i.empty) {
      let r = e.coordsAtPos(i.head, i.assoc || 1);
      if (!r)
        return [];
      let s = cg(e);
      return [new Fn(t, r.left - s.left, r.top - s.top, null, r.bottom - r.top)];
    } else
      return ak(e, t, i);
  }
}
function cg(n) {
  let e = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == Ie.LTR ? e.left : e.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: e.top - n.scrollDOM.scrollTop * n.scaleY };
}
function Gu(n, e, t, i) {
  let r = n.coordsAtPos(e, t * 2);
  if (!r)
    return i;
  let s = n.dom.getBoundingClientRect(), o = (r.top + r.bottom) / 2, a = n.posAtCoords({ x: s.left + 1, y: o }), l = n.posAtCoords({ x: s.right - 1, y: o });
  return a == null || l == null ? i : { from: Math.max(i.from, Math.min(a, l)), to: Math.min(i.to, Math.max(a, l)) };
}
function ak(n, e, t) {
  if (t.to <= n.viewport.from || t.from >= n.viewport.to)
    return [];
  let i = Math.max(t.from, n.viewport.from), r = Math.min(t.to, n.viewport.to), s = n.textDirection == Ie.LTR, o = n.contentDOM, a = o.getBoundingClientRect(), l = cg(n), h = o.querySelector(".cm-line"), c = h && window.getComputedStyle(h), f = a.left + (c ? parseInt(c.paddingLeft) + Math.min(0, parseInt(c.textIndent)) : 0), O = a.right - (c ? parseInt(c.paddingRight) : 0), d = ac(n, i, 1), p = ac(n, r, -1), g = d.type == yt.Text ? d : null, m = p.type == yt.Text ? p : null;
  if (g && (n.lineWrapping || d.widgetLineBreaks) && (g = Gu(n, i, 1, g)), m && (n.lineWrapping || p.widgetLineBreaks) && (m = Gu(n, r, -1, m)), g && m && g.from == m.from && g.to == m.to)
    return w(S(t.from, t.to, g));
  {
    let b = g ? S(t.from, null, g) : Q(d, !1), y = m ? S(null, t.to, m) : Q(p, !0), $ = [];
    return (g || d).to < (m || p).from - (g && m ? 1 : 0) || d.widgetLineBreaks > 1 && b.bottom + n.defaultLineHeight / 2 < y.top ? $.push(v(f, b.bottom, O, y.top)) : b.bottom < y.top && n.elementAtHeight((b.bottom + y.top) / 2).type == yt.Text && (b.bottom = y.top = (b.bottom + y.top) / 2), w(b).concat($).concat(w(y));
  }
  function v(b, y, $, M) {
    return new Fn(e, b - l.left, y - l.top, Math.max(0, $ - b), M - y);
  }
  function w({ top: b, bottom: y, horizontal: $ }) {
    let M = [];
    for (let j = 0; j < $.length; j += 2)
      M.push(v($[j], b, $[j + 1], y));
    return M;
  }
  function S(b, y, $) {
    let M = 1e9, j = -1e9, z = [];
    function C(V, U, B, H, oe) {
      let q = n.coordsAtPos(V, V == $.to ? -2 : 2), E = n.coordsAtPos(B, B == $.from ? 2 : -2);
      !q || !E || (M = Math.min(q.top, E.top, M), j = Math.max(q.bottom, E.bottom, j), oe == Ie.LTR ? z.push(s && U ? f : q.left, s && H ? O : E.right) : z.push(!s && H ? f : E.left, !s && U ? O : q.right));
    }
    let Z = b ?? $.from, A = y ?? $.to;
    for (let V of n.visibleRanges)
      if (V.to > Z && V.from < A)
        for (let U = Math.max(V.from, Z), B = Math.min(V.to, A); ; ) {
          let H = n.state.doc.lineAt(U);
          for (let oe of n.bidiSpans(H)) {
            let q = oe.from + H.from, E = oe.to + H.from;
            if (q >= B)
              break;
            E > U && C(Math.max(q, U), b == null && q <= Z, Math.min(E, B), y == null && E >= A, oe.dir);
          }
          if (U = H.to + 1, U >= B)
            break;
        }
    return z.length == 0 && C(Z, b == null, A, y == null, n.textDirection), { top: M, bottom: j, horizontal: z };
  }
  function Q(b, y) {
    let $ = a.top + (y ? b.top : b.bottom);
    return { top: $, bottom: $, horizontal: [] };
  }
}
function lk(n, e) {
  return n.constructor == e.constructor && n.eq(e);
}
class hk {
  constructor(e, t) {
    this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(xa) != e.state.facet(xa) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  docViewUpdate(e) {
    this.layer.updateOnDocViewUpdate !== !1 && e.requestMeasure(this.measureReq);
  }
  setOrder(e) {
    let t = 0, i = e.facet(xa);
    for (; t < i.length && i[t] != this.layer; )
      t++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: t } = this.view;
    (e != this.scaleX || t != this.scaleY) && (this.scaleX = e, this.scaleY = t, this.dom.style.transform = `scale(${1 / e}, ${1 / t})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((t, i) => !lk(t, this.drawn[i]))) {
      let t = this.dom.firstChild, i = 0;
      for (let r of e)
        r.update && t && r.constructor && this.drawn[i].constructor && r.update(t, this.drawn[i]) ? (t = t.nextSibling, i++) : this.dom.insertBefore(r.draw(), t);
      for (; t; ) {
        let r = t.nextSibling;
        t.remove(), t = r;
      }
      this.drawn = e, ie.webkit && (this.dom.style.display = this.dom.firstChild ? "" : "none");
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const xa = /* @__PURE__ */ se.define();
function of(n) {
  return [
    ot.define((e) => new hk(e, n)),
    xa.of(n)
  ];
}
const Ar = /* @__PURE__ */ se.define({
  combine(n) {
    return xs(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0,
      iosSelectionHandles: !0
    }, {
      cursorBlinkRate: (e, t) => Math.min(e, t),
      drawRangeCursor: (e, t) => e || t
    });
  }
});
function ck(n = {}) {
  return [
    Ar.of(n),
    uk,
    Ok,
    dk,
    qp.of(!0)
  ];
}
function fk(n) {
  return n.facet(Ar);
}
function fg(n) {
  return n.startState.facet(Ar) != n.state.facet(Ar);
}
const uk = /* @__PURE__ */ of({
  above: !0,
  markers(n) {
    let { state: e } = n, t = e.facet(Ar), i = [];
    for (let r of e.selection.ranges) {
      let s = r == e.selection.main;
      if (r.empty || t.drawRangeCursor && !(s && ie.ios && t.iosSelectionHandles)) {
        let o = s ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", a = r.empty ? r : te.cursor(r.head, r.assoc);
        for (let l of Fn.forRange(n, o, a))
          i.push(l);
      }
    }
    return i;
  },
  update(n, e) {
    n.transactions.some((i) => i.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let t = fg(n);
    return t && Iu(n.state, e), n.docChanged || n.selectionSet || t;
  },
  mount(n, e) {
    Iu(e.state, n);
  },
  class: "cm-cursorLayer"
});
function Iu(n, e) {
  e.style.animationDuration = n.facet(Ar).cursorBlinkRate + "ms";
}
const Ok = /* @__PURE__ */ of({
  above: !1,
  markers(n) {
    let e = [], { main: t, ranges: i } = n.state.selection;
    for (let r of i)
      if (!r.empty)
        for (let s of Fn.forRange(n, "cm-selectionBackground", r))
          e.push(s);
    if (ie.ios && !t.empty && n.state.facet(Ar).iosSelectionHandles) {
      for (let r of Fn.forRange(n, "cm-selectionHandle cm-selectionHandle-start", te.cursor(t.from, 1)))
        e.push(r);
      for (let r of Fn.forRange(n, "cm-selectionHandle cm-selectionHandle-end", te.cursor(t.to, 1)))
        e.push(r);
    }
    return e;
  },
  update(n, e) {
    return n.docChanged || n.selectionSet || n.viewportChanged || fg(n);
  },
  class: "cm-selectionLayer"
}), dk = /* @__PURE__ */ Mr.highest(/* @__PURE__ */ ce.theme({
  ".cm-line": {
    "& ::selection, &::selection": { backgroundColor: "transparent !important" },
    caretColor: "transparent !important"
  },
  ".cm-content": {
    caretColor: "transparent !important",
    "& :focus": {
      caretColor: "initial !important",
      "&::selection, & ::selection": {
        backgroundColor: "Highlight !important"
      }
    }
  }
})), ug = /* @__PURE__ */ qe.define({
  map(n, e) {
    return n == null ? null : e.mapPos(n);
  }
}), Gs = /* @__PURE__ */ ui.define({
  create() {
    return null;
  },
  update(n, e) {
    return n != null && (n = e.changes.mapPos(n)), e.effects.reduce((t, i) => i.is(ug) ? i.value : t, n);
  }
}), pk = /* @__PURE__ */ ot.fromClass(class {
  constructor(n) {
    this.view = n, this.cursor = null, this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
  }
  update(n) {
    var e;
    let t = n.state.field(Gs);
    t == null ? this.cursor != null && ((e = this.cursor) === null || e === void 0 || e.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (n.startState.field(Gs) != t || n.docChanged || n.geometryChanged) && this.view.requestMeasure(this.measureReq));
  }
  readPos() {
    let { view: n } = this, e = n.state.field(Gs), t = e != null && n.coordsAtPos(e);
    if (!t)
      return null;
    let i = n.scrollDOM.getBoundingClientRect();
    return {
      left: t.left - i.left + n.scrollDOM.scrollLeft * n.scaleX,
      top: t.top - i.top + n.scrollDOM.scrollTop * n.scaleY,
      height: t.bottom - t.top
    };
  }
  drawCursor(n) {
    if (this.cursor) {
      let { scaleX: e, scaleY: t } = this.view;
      n ? (this.cursor.style.left = n.left / e + "px", this.cursor.style.top = n.top / t + "px", this.cursor.style.height = n.height / t + "px") : this.cursor.style.left = "-100000px";
    }
  }
  destroy() {
    this.cursor && this.cursor.remove();
  }
  setDropPos(n) {
    this.view.state.field(Gs) != n && this.view.dispatch({ effects: ug.of(n) });
  }
}, {
  eventObservers: {
    dragover(n) {
      this.setDropPos(this.view.posAtCoords({ x: n.clientX, y: n.clientY }));
    },
    dragleave(n) {
      (n.target == this.view.contentDOM || !this.view.contentDOM.contains(n.relatedTarget)) && this.setDropPos(null);
    },
    dragend() {
      this.setDropPos(null);
    },
    drop() {
      this.setDropPos(null);
    }
  }
});
function gk() {
  return [Gs, pk];
}
function Uu(n, e, t, i, r) {
  e.lastIndex = 0;
  for (let s = n.iterRange(t, i), o = t, a; !s.next().done; o += s.value.length)
    if (!s.lineBreak)
      for (; a = e.exec(s.value); )
        r(o + a.index, a);
}
function mk(n, e) {
  let t = n.visibleRanges;
  if (t.length == 1 && t[0].from == n.viewport.from && t[0].to == n.viewport.to)
    return t;
  let i = [];
  for (let { from: r, to: s } of t)
    r = Math.max(n.state.doc.lineAt(r).from, r - e), s = Math.min(n.state.doc.lineAt(s).to, s + e), i.length && i[i.length - 1].to >= r ? i[i.length - 1].to = s : i.push({ from: r, to: s });
  return i;
}
class Ql {
  /**
  Create a decorator.
  */
  constructor(e) {
    const { regexp: t, decoration: i, decorate: r, boundary: s, maxLength: o = 1e3 } = e;
    if (!t.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = t, r)
      this.addMatch = (a, l, h, c) => r(c, h, h + a[0].length, a, l);
    else if (typeof i == "function")
      this.addMatch = (a, l, h, c) => {
        let f = i(a, l, h);
        f && c(h, h + a[0].length, f);
      };
    else if (i)
      this.addMatch = (a, l, h, c) => c(h, h + a[0].length, i);
    else
      throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
    this.boundary = s, this.maxLength = o;
  }
  /**
  Compute the full set of decorations for matches in the given
  view's viewport. You'll want to call this when initializing your
  plugin.
  */
  createDeco(e) {
    let t = new Zn(), i = t.add.bind(t);
    for (let { from: r, to: s } of mk(e, this.maxLength))
      Uu(e.state.doc, this.regexp, r, s, (o, a) => this.addMatch(a, e, o, i));
    return t.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(e, t) {
    let i = 1e9, r = -1;
    return e.docChanged && e.changes.iterChanges((s, o, a, l) => {
      l >= e.view.viewport.from && a <= e.view.viewport.to && (i = Math.min(a, i), r = Math.max(l, r));
    }), e.viewportMoved || r - i > 1e3 ? this.createDeco(e.view) : r > -1 ? this.updateRange(e.view, t.map(e.changes), i, r) : t;
  }
  updateRange(e, t, i, r) {
    for (let s of e.visibleRanges) {
      let o = Math.max(s.from, i), a = Math.min(s.to, r);
      if (a >= o) {
        let l = e.state.doc.lineAt(o), h = l.to < a ? e.state.doc.lineAt(a) : l, c = Math.max(s.from, l.from), f = Math.min(s.to, h.to);
        if (this.boundary) {
          for (; o > l.from; o--)
            if (this.boundary.test(l.text[o - 1 - l.from])) {
              c = o;
              break;
            }
          for (; a < h.to; a++)
            if (this.boundary.test(h.text[a - h.from])) {
              f = a;
              break;
            }
        }
        let O = [], d, p = (g, m, v) => O.push(v.range(g, m));
        if (l == h)
          for (this.regexp.lastIndex = c - l.from; (d = this.regexp.exec(l.text)) && d.index < f - l.from; )
            this.addMatch(d, e, d.index + l.from, p);
        else
          Uu(e.state.doc, this.regexp, c, f, (g, m) => this.addMatch(m, e, g, p));
        t = t.update({ filterFrom: c, filterTo: f, filter: (g, m) => g < c || m > f, add: O });
      }
    }
    return t;
  }
}
const pc = /x/.unicode != null ? "gu" : "g", vk = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, pc), Qk = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8237: "left-to-right override",
  8238: "right-to-left override",
  8294: "left-to-right isolate",
  8295: "right-to-left isolate",
  8297: "pop directional isolate",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
let nh = null;
function bk() {
  var n;
  if (nh == null && typeof document < "u" && document.body) {
    let e = document.body.style;
    nh = ((n = e.tabSize) !== null && n !== void 0 ? n : e.MozTabSize) != null;
  }
  return nh || !1;
}
const wa = /* @__PURE__ */ se.define({
  combine(n) {
    let e = xs(n, {
      render: null,
      specialChars: vk,
      addSpecialChars: null
    });
    return (e.replaceTabs = !bk()) && (e.specialChars = new RegExp("	|" + e.specialChars.source, pc)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, pc)), e;
  }
});
function Sk(n = {}) {
  return [wa.of(n), yk()];
}
let Nu = null;
function yk() {
  return Nu || (Nu = ot.fromClass(class {
    constructor(n) {
      this.view = n, this.decorations = pe.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(n.state.facet(wa)), this.decorations = this.decorator.createDeco(n);
    }
    makeDecorator(n) {
      return new Ql({
        regexp: n.specialChars,
        decoration: (e, t, i) => {
          let { doc: r } = t.state, s = Lc(e[0], 0);
          if (s == 9) {
            let o = r.lineAt(i), a = t.state.tabSize, l = ul(o.text, a, i - o.from);
            return pe.replace({
              widget: new Pk((a - l % a) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[s] || (this.decorationCache[s] = pe.replace({ widget: new wk(n, s) }));
        },
        boundary: n.replaceTabs ? void 0 : /[^]/
      });
    }
    update(n) {
      let e = n.state.facet(wa);
      n.startState.facet(wa) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(n.view)) : this.decorations = this.decorator.updateDeco(n, this.decorations);
    }
  }, {
    decorations: (n) => n.decorations
  }));
}
const kk = "•";
function xk(n) {
  return n >= 32 ? kk : n == 10 ? "␤" : String.fromCharCode(9216 + n);
}
class wk extends qi {
  constructor(e, t) {
    super(), this.options = e, this.code = t;
  }
  eq(e) {
    return e.code == this.code;
  }
  toDOM(e) {
    let t = xk(this.code), i = e.state.phrase("Control character") + " " + (Qk[this.code] || "0x" + this.code.toString(16)), r = this.options.render && this.options.render(this.code, i, t);
    if (r)
      return r;
    let s = document.createElement("span");
    return s.textContent = t, s.title = i, s.setAttribute("aria-label", i), s.className = "cm-specialChar", s;
  }
  ignoreEvent() {
    return !1;
  }
}
class Pk extends qi {
  constructor(e) {
    super(), this.width = e;
  }
  eq(e) {
    return e.width == this.width;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.textContent = "	", e.className = "cm-tab", e.style.width = this.width + "px", e;
  }
  ignoreEvent() {
    return !1;
  }
}
const Bu = /* @__PURE__ */ ot.fromClass(class {
  constructor() {
    this.height = 1e3, this.attrs = { style: "padding-bottom: 1000px" };
  }
  update(n) {
    let { view: e } = n, t = e.viewState.editorHeight - e.defaultLineHeight - e.documentPadding.top - 0.5;
    t >= 0 && t != this.height && (this.height = t, this.attrs = { style: `padding-bottom: ${t}px` });
  }
});
function _k() {
  return [Bu, dl.of((n) => {
    var e;
    return ((e = n.plugin(Bu)) === null || e === void 0 ? void 0 : e.attrs) || null;
  })];
}
function Tk() {
  return Zk;
}
const $k = /* @__PURE__ */ pe.line({ class: "cm-activeLine" }), Zk = /* @__PURE__ */ ot.fromClass(class {
  constructor(n) {
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.docChanged || n.selectionSet) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = -1, t = [];
    for (let i of n.state.selection.ranges) {
      let r = n.lineBlockAt(i.head);
      r.from > e && (t.push($k.range(r.from)), e = r.from);
    }
    return pe.set(t);
  }
}, {
  decorations: (n) => n.decorations
});
class Rk extends qi {
  constructor(e) {
    super(), this.content = e;
  }
  toDOM(e) {
    let t = document.createElement("span");
    return t.className = "cm-placeholder", t.style.pointerEvents = "none", t.appendChild(typeof this.content == "string" ? document.createTextNode(this.content) : typeof this.content == "function" ? this.content(e) : this.content.cloneNode(!0)), t.setAttribute("aria-hidden", "true"), t;
  }
  coordsAt(e) {
    let t = e.firstChild ? io(e.firstChild) : [];
    if (!t.length)
      return null;
    let i = window.getComputedStyle(e.parentNode), r = mo(t[0], i.direction != "rtl"), s = parseInt(i.lineHeight);
    return r.bottom - r.top > s * 1.5 ? { left: r.left, right: r.right, top: r.top, bottom: r.top + s } : r;
  }
  ignoreEvent() {
    return !1;
  }
}
function Xk(n) {
  let e = ot.fromClass(class {
    constructor(t) {
      this.view = t, this.placeholder = n ? pe.set([pe.widget({ widget: new Rk(n), side: 1 }).range(0)]) : pe.none;
    }
    get decorations() {
      return this.view.state.doc.length ? pe.none : this.placeholder;
    }
  }, { decorations: (t) => t.decorations });
  return typeof n == "string" ? [
    e,
    ce.contentAttributes.of({ "aria-placeholder": n })
  ] : e;
}
const gc = 2e3;
function Ck(n, e, t) {
  let i = Math.min(e.line, t.line), r = Math.max(e.line, t.line), s = [];
  if (e.off > gc || t.off > gc || e.col < 0 || t.col < 0) {
    let o = Math.min(e.off, t.off), a = Math.max(e.off, t.off);
    for (let l = i; l <= r; l++) {
      let h = n.doc.line(l);
      h.length <= a && s.push(te.range(h.from + o, h.to + a));
    }
  } else {
    let o = Math.min(e.col, t.col), a = Math.max(e.col, t.col);
    for (let l = i; l <= r; l++) {
      let h = n.doc.line(l), c = Ga(h.text, o, n.tabSize, !0);
      if (c < 0)
        s.push(te.cursor(h.to));
      else {
        let f = Ga(h.text, a, n.tabSize);
        s.push(te.range(h.from + c, h.from + f));
      }
    }
  }
  return s;
}
function Ak(n, e) {
  let t = n.coordsAtPos(n.viewport.from);
  return t ? Math.round(Math.abs((t.left - e) / n.defaultCharacterWidth)) : -1;
}
function Fu(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), i = n.state.doc.lineAt(t), r = t - i.from, s = r > gc ? -1 : r == i.length ? Ak(n, e.clientX) : ul(i.text, n.state.tabSize, t - i.from);
  return { line: i.number, col: s, off: r };
}
function qk(n, e) {
  let t = Fu(n, e), i = n.state.selection;
  return t ? {
    update(r) {
      if (r.docChanged) {
        let s = r.changes.mapPos(r.startState.doc.line(t.line).from), o = r.state.doc.lineAt(s);
        t = { line: o.number, col: t.col, off: Math.min(t.off, o.length) }, i = i.map(r.changes);
      }
    },
    get(r, s, o) {
      let a = Fu(n, r);
      if (!a)
        return i;
      let l = Ck(n.state, t, a);
      return l.length ? o ? te.create(l.concat(i.ranges)) : te.create(l) : i;
    }
  } : null;
}
function zk(n) {
  let e = (n == null ? void 0 : n.eventFilter) || ((t) => t.altKey && t.button == 0);
  return ce.mouseSelectionStyle.of((t, i) => e(i) ? qk(t, i) : null);
}
const Mk = {
  Alt: [18, (n) => !!n.altKey],
  Control: [17, (n) => !!n.ctrlKey],
  Shift: [16, (n) => !!n.shiftKey],
  Meta: [91, (n) => !!n.metaKey]
}, Wk = { style: "cursor: crosshair" };
function Ek(n = {}) {
  let [e, t] = Mk[n.key || "Alt"], i = ot.fromClass(class {
    constructor(r) {
      this.view = r, this.isDown = !1;
    }
    set(r) {
      this.isDown != r && (this.isDown = r, this.view.update([]));
    }
  }, {
    eventObservers: {
      keydown(r) {
        this.set(r.keyCode == e || t(r));
      },
      keyup(r) {
        (r.keyCode == e || !t(r)) && this.set(!1);
      },
      mousemove(r) {
        this.set(t(r));
      }
    }
  });
  return [
    i,
    ce.contentAttributes.of((r) => {
      var s;
      return !((s = r.plugin(i)) === null || s === void 0) && s.isDown ? Wk : null;
    })
  ];
}
const oa = "-10000px";
class Og {
  constructor(e, t, i, r) {
    this.facet = t, this.createTooltipView = i, this.removeTooltipView = r, this.input = e.state.facet(t), this.tooltips = this.input.filter((o) => o);
    let s = null;
    this.tooltipViews = this.tooltips.map((o) => s = i(o, s));
  }
  update(e, t) {
    var i;
    let r = e.state.facet(this.facet), s = r.filter((l) => l);
    if (r === this.input) {
      for (let l of this.tooltipViews)
        l.update && l.update(e);
      return !1;
    }
    let o = [], a = t ? [] : null;
    for (let l = 0; l < s.length; l++) {
      let h = s[l], c = -1;
      if (h) {
        for (let f = 0; f < this.tooltips.length; f++) {
          let O = this.tooltips[f];
          O && O.create == h.create && (c = f);
        }
        if (c < 0)
          o[l] = this.createTooltipView(h, l ? o[l - 1] : null), a && (a[l] = !!h.above);
        else {
          let f = o[l] = this.tooltipViews[c];
          a && (a[l] = t[c]), f.update && f.update(e);
        }
      }
    }
    for (let l of this.tooltipViews)
      o.indexOf(l) < 0 && (this.removeTooltipView(l), (i = l.destroy) === null || i === void 0 || i.call(l));
    return t && (a.forEach((l, h) => t[h] = l), t.length = a.length), this.input = r, this.tooltips = s, this.tooltipViews = o, !0;
  }
}
function jk(n = {}) {
  return Pa.of(n);
}
function Vk(n) {
  let e = n.dom.ownerDocument.documentElement;
  return { top: 0, left: 0, bottom: e.clientHeight, right: e.clientWidth };
}
const Pa = /* @__PURE__ */ se.define({
  combine: (n) => {
    var e, t, i;
    return {
      position: ie.ios ? "absolute" : ((e = n.find((r) => r.position)) === null || e === void 0 ? void 0 : e.position) || "fixed",
      parent: ((t = n.find((r) => r.parent)) === null || t === void 0 ? void 0 : t.parent) || null,
      tooltipSpace: ((i = n.find((r) => r.tooltipSpace)) === null || i === void 0 ? void 0 : i.tooltipSpace) || Vk
    };
  }
}), Hu = /* @__PURE__ */ new WeakMap(), bl = /* @__PURE__ */ ot.fromClass(class {
  constructor(n) {
    this.view = n, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let e = n.state.facet(Pa);
    this.position = e.position, this.parent = e.parent, this.classes = n.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new Og(n, af, (t, i) => this.createTooltip(t, i), (t) => {
      this.resizeObserver && this.resizeObserver.unobserve(t.dom), t.dom.remove();
    }), this.above = this.manager.tooltips.map((t) => !!t.above), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((t) => {
      Date.now() > this.lastTransaction - 50 && t.length > 0 && t[t.length - 1].intersectionRatio < 1 && this.measureSoon();
    }, { threshold: [1] }) : null, this.observeIntersection(), n.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
  }
  createContainer() {
    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
  }
  observeIntersection() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      for (let n of this.manager.tooltipViews)
        this.intersectionObserver.observe(n.dom);
    }
  }
  measureSoon() {
    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
      this.measureTimeout = -1, this.maybeMeasure();
    }, 50));
  }
  update(n) {
    n.transactions.length && (this.lastTransaction = Date.now());
    let e = this.manager.update(n, this.above);
    e && this.observeIntersection();
    let t = e || n.geometryChanged, i = n.state.facet(Pa);
    if (i.position != this.position && !this.madeAbsolute) {
      this.position = i.position;
      for (let r of this.manager.tooltipViews)
        r.dom.style.position = this.position;
      t = !0;
    }
    if (i.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = i.parent, this.createContainer();
      for (let r of this.manager.tooltipViews)
        this.container.appendChild(r.dom);
      t = !0;
    } else this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    t && this.maybeMeasure();
  }
  createTooltip(n, e) {
    let t = n.create(this.view), i = e ? e.dom : null;
    if (t.dom.classList.add("cm-tooltip"), n.arrow && !t.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let r = document.createElement("div");
      r.className = "cm-tooltip-arrow", t.dom.appendChild(r);
    }
    return t.dom.style.position = this.position, t.dom.style.top = oa, t.dom.style.left = "0px", this.container.insertBefore(t.dom, i), t.mount && t.mount(this.view), this.resizeObserver && this.resizeObserver.observe(t.dom), t;
  }
  destroy() {
    var n, e, t;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let i of this.manager.tooltipViews)
      i.dom.remove(), (n = i.destroy) === null || n === void 0 || n.call(i);
    this.parent && this.container.remove(), (e = this.resizeObserver) === null || e === void 0 || e.disconnect(), (t = this.intersectionObserver) === null || t === void 0 || t.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let n = 1, e = 1, t = !1;
    if (this.position == "fixed" && this.manager.tooltipViews.length) {
      let { dom: s } = this.manager.tooltipViews[0];
      if (ie.safari) {
        let o = s.getBoundingClientRect();
        t = Math.abs(o.top + 1e4) > 1 || Math.abs(o.left) > 1;
      } else
        t = !!s.offsetParent && s.offsetParent != this.container.ownerDocument.body;
    }
    if (t || this.position == "absolute")
      if (this.parent) {
        let s = this.parent.getBoundingClientRect();
        s.width && s.height && (n = s.width / this.parent.offsetWidth, e = s.height / this.parent.offsetHeight);
      } else
        ({ scaleX: n, scaleY: e } = this.view.viewState);
    let i = this.view.scrollDOM.getBoundingClientRect(), r = ef(this.view);
    return {
      visible: {
        left: i.left + r.left,
        top: i.top + r.top,
        right: i.right - r.right,
        bottom: i.bottom - r.bottom
      },
      parent: this.parent ? this.container.getBoundingClientRect() : this.view.dom.getBoundingClientRect(),
      pos: this.manager.tooltips.map((s, o) => {
        let a = this.manager.tooltipViews[o];
        return a.getCoords ? a.getCoords(s.pos) : this.view.coordsAtPos(s.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: s }) => s.getBoundingClientRect()),
      space: this.view.state.facet(Pa).tooltipSpace(this.view),
      scaleX: n,
      scaleY: e,
      makeAbsolute: t
    };
  }
  writeMeasure(n) {
    var e;
    if (n.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let a of this.manager.tooltipViews)
        a.dom.style.position = "absolute";
    }
    let { visible: t, space: i, scaleX: r, scaleY: s } = n, o = [];
    for (let a = 0; a < this.manager.tooltips.length; a++) {
      let l = this.manager.tooltips[a], h = this.manager.tooltipViews[a], { dom: c } = h, f = n.pos[a], O = n.size[a];
      if (!f || l.clip !== !1 && (f.bottom <= Math.max(t.top, i.top) || f.top >= Math.min(t.bottom, i.bottom) || f.right < Math.max(t.left, i.left) - 0.1 || f.left > Math.min(t.right, i.right) + 0.1)) {
        c.style.top = oa;
        continue;
      }
      let d = l.arrow ? h.dom.querySelector(".cm-tooltip-arrow") : null, p = d ? 7 : 0, g = O.right - O.left, m = (e = Hu.get(h)) !== null && e !== void 0 ? e : O.bottom - O.top, v = h.offset || Lk, w = this.view.textDirection == Ie.LTR, S = O.width > i.right - i.left ? w ? i.left : i.right - O.width : w ? Math.max(i.left, Math.min(f.left - (d ? 14 : 0) + v.x, i.right - g)) : Math.min(Math.max(i.left, f.left - g + (d ? 14 : 0) - v.x), i.right - g), Q = this.above[a];
      !l.strictSide && (Q ? f.top - m - p - v.y < i.top : f.bottom + m + p + v.y > i.bottom) && Q == i.bottom - f.bottom > f.top - i.top && (Q = this.above[a] = !Q);
      let b = (Q ? f.top - i.top : i.bottom - f.bottom) - p;
      if (b < m && h.resize !== !1) {
        if (b < this.view.defaultLineHeight) {
          c.style.top = oa;
          continue;
        }
        Hu.set(h, m), c.style.height = (m = b) / s + "px";
      } else c.style.height && (c.style.height = "");
      let y = Q ? f.top - m - p - v.y : f.bottom + p + v.y, $ = S + g;
      if (h.overlap !== !0)
        for (let M of o)
          M.left < $ && M.right > S && M.top < y + m && M.bottom > y && (y = Q ? M.top - m - 2 - p : M.bottom + p + 2);
      if (this.position == "absolute" ? (c.style.top = (y - n.parent.top) / s + "px", Ju(c, (S - n.parent.left) / r)) : (c.style.top = y / s + "px", Ju(c, S / r)), d) {
        let M = f.left + (w ? v.x : -v.x) - (S + 14 - 7);
        d.style.left = M / r + "px";
      }
      h.overlap !== !0 && o.push({ left: S, top: y, right: $, bottom: y + m }), c.classList.toggle("cm-tooltip-above", Q), c.classList.toggle("cm-tooltip-below", !Q), h.positioned && h.positioned(n.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let n of this.manager.tooltipViews)
        n.dom.style.top = oa;
  }
}, {
  eventObservers: {
    scroll() {
      this.maybeMeasure();
    }
  }
});
function Ju(n, e) {
  let t = parseInt(n.style.left, 10);
  (isNaN(t) || Math.abs(e - t) > 1) && (n.style.left = e + "px");
}
const Yk = /* @__PURE__ */ ce.baseTheme({
  ".cm-tooltip": {
    zIndex: 500,
    boxSizing: "border-box"
  },
  "&light .cm-tooltip": {
    border: "1px solid #bbb",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #bbb"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tooltip-arrow": {
    height: "7px",
    width: "14px",
    position: "absolute",
    zIndex: -1,
    overflow: "hidden",
    "&:before, &:after": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent"
    },
    ".cm-tooltip-above &": {
      bottom: "-7px",
      "&:before": {
        borderTop: "7px solid #bbb"
      },
      "&:after": {
        borderTop: "7px solid #f5f5f5",
        bottom: "1px"
      }
    },
    ".cm-tooltip-below &": {
      top: "-7px",
      "&:before": {
        borderBottom: "7px solid #bbb"
      },
      "&:after": {
        borderBottom: "7px solid #f5f5f5",
        top: "1px"
      }
    }
  },
  "&dark .cm-tooltip .cm-tooltip-arrow": {
    "&:before": {
      borderTopColor: "#333338",
      borderBottomColor: "#333338"
    },
    "&:after": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    }
  }
}), Lk = { x: 0, y: 0 }, af = /* @__PURE__ */ se.define({
  enables: [bl, Yk]
}), bo = /* @__PURE__ */ se.define({
  combine: (n) => n.reduce((e, t) => e.concat(t), [])
});
class Sl {
  // Needs to be static so that host tooltip instances always match
  static create(e) {
    return new Sl(e);
  }
  constructor(e) {
    this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new Og(e, bo, (t, i) => this.createHostedView(t, i), (t) => t.dom.remove());
  }
  createHostedView(e, t) {
    let i = e.create(this.view);
    return i.dom.classList.add("cm-tooltip-section"), this.dom.insertBefore(i.dom, t ? t.dom.nextSibling : this.dom.firstChild), this.mounted && i.mount && i.mount(this.view), i;
  }
  mount(e) {
    for (let t of this.manager.tooltipViews)
      t.mount && t.mount(e);
    this.mounted = !0;
  }
  positioned(e) {
    for (let t of this.manager.tooltipViews)
      t.positioned && t.positioned(e);
  }
  update(e) {
    this.manager.update(e);
  }
  destroy() {
    var e;
    for (let t of this.manager.tooltipViews)
      (e = t.destroy) === null || e === void 0 || e.call(t);
  }
  passProp(e) {
    let t;
    for (let i of this.manager.tooltipViews) {
      let r = i[e];
      if (r !== void 0) {
        if (t === void 0)
          t = r;
        else if (t !== r)
          return;
      }
    }
    return t;
  }
  get offset() {
    return this.passProp("offset");
  }
  get getCoords() {
    return this.passProp("getCoords");
  }
  get overlap() {
    return this.passProp("overlap");
  }
  get resize() {
    return this.passProp("resize");
  }
}
const Dk = /* @__PURE__ */ af.compute([bo], (n) => {
  let e = n.facet(bo);
  return e.length === 0 ? null : {
    pos: Math.min(...e.map((t) => t.pos)),
    end: Math.max(...e.map((t) => {
      var i;
      return (i = t.end) !== null && i !== void 0 ? i : t.pos;
    })),
    create: Sl.create,
    above: e[0].above,
    arrow: e.some((t) => t.arrow)
  };
}), dg = /* @__PURE__ */ se.define();
class Gk {
  constructor(e, t, i, r, s, o) {
    this.view = e, this.source = t, this.field = i, this.locked = r, this.setHover = s, this.hoverTime = o, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: e.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), e.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), e.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update(e) {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active.length)
      return;
    let e = Date.now() - this.lastMove.time;
    e < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - e) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: e, lastMove: t } = this, i = e.docView.tile.nearest(t.target);
    if (!i)
      return;
    let r, s = 1;
    if (i.isWidget())
      r = i.posAtStart;
    else {
      if (r = e.posAtCoords(t), r == null)
        return;
      let o = e.coordsAtPos(r);
      if (!o || t.y < o.top || t.y > o.bottom || t.x < o.left - e.defaultCharacterWidth || t.x > o.right + e.defaultCharacterWidth)
        return;
      let a = e.bidiSpans(e.state.doc.lineAt(r)).find((h) => h.from <= r && h.to >= r), l = a && a.dir == Ie.RTL ? -1 : 1;
      s = t.x < o.left ? -l : l;
    }
    this.activateHover(e, r, s);
  }
  activateHover(e, t, i, r) {
    let s = this.source(e, t, i), o = (a) => {
      if (a && !(Array.isArray(a) && !a.length)) {
        let l = Array.isArray(a) ? a : [a];
        r && this.locked.set(l, r), e.dispatch({ effects: this.setHover.of(l) });
      }
    };
    if (s && "then" in s) {
      let a = this.pending = { pos: t };
      s.then((l) => {
        this.pending == a && (this.pending = null, o(l));
      }, (l) => Si(e.state, l, "hover tooltip"));
    } else
      o(s);
  }
  get tooltip() {
    let e = this.view.plugin(bl), t = e ? e.manager.tooltips.findIndex((i) => i.create == Sl.create) : -1;
    return t > -1 ? e.manager.tooltipViews[t] : null;
  }
  mousemove(e) {
    var t, i;
    this.lastMove = { x: e.clientX, y: e.clientY, target: e.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let { active: r, tooltip: s } = this;
    if (r.length && !this.locked.has(r) && s && !Ik(s.dom, e) || this.pending) {
      let { pos: o } = r[0] || this.pending, a = (i = (t = r[0]) === null || t === void 0 ? void 0 : t.end) !== null && i !== void 0 ? i : o;
      (o == a ? this.view.posAtCoords(this.lastMove) != o : !Uk(this.view, o, a, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of([]) }), this.pending = null);
    }
  }
  mouseleave(e) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
    let { active: t } = this;
    if (t.length && !this.locked.has(t)) {
      let { tooltip: i } = this;
      i && i.dom.contains(e.relatedTarget) ? this.watchTooltipLeave(i.dom) : this.view.dispatch({ effects: this.setHover.of([]) });
    }
  }
  watchTooltipLeave(e) {
    let t = (i) => {
      e.removeEventListener("mouseleave", t);
      let { active: r } = this;
      r.length && !this.locked.has(r) && !this.view.dom.contains(i.relatedTarget) && this.view.dispatch({ effects: this.setHover.of([]) });
    };
    e.addEventListener("mouseleave", t);
  }
  destroy() {
    clearTimeout(this.hoverTimeout), clearTimeout(this.restartTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
const aa = 4;
function Ik(n, e) {
  let { left: t, right: i, top: r, bottom: s } = n.getBoundingClientRect(), o;
  if (o = n.querySelector(".cm-tooltip-arrow")) {
    let a = o.getBoundingClientRect();
    r = Math.min(a.top, r), s = Math.max(a.bottom, s);
  }
  return e.clientX >= t - aa && e.clientX <= i + aa && e.clientY >= r - aa && e.clientY <= s + aa;
}
function Uk(n, e, t, i, r, s) {
  let o = n.scrollDOM.getBoundingClientRect(), a = n.documentTop + n.documentPadding.top + n.contentHeight;
  if (o.left > i || o.right < i || o.top > r || Math.min(o.bottom, a) < r)
    return !1;
  let l = n.posAtCoords({ x: i, y: r }, !1);
  return l >= e && l <= t;
}
function Nk(n, e = {}) {
  let t = qe.define(), i = /* @__PURE__ */ new WeakMap(), r = ui.define({
    create() {
      return [];
    },
    update(o, a) {
      let l = i.get(o);
      if (o.length && (e.hideOnChange && (a.docChanged || a.selection) ? o = [] : l && l(a) ? o = [] : e.hideOn && (o = o.filter((h) => !e.hideOn(a, h)))), a.docChanged && o.length) {
        let h = [];
        for (let c of o) {
          let f = a.changes.mapPos(c.pos, -1, Zt.TrackDel);
          if (f != null) {
            let O = Object.assign(/* @__PURE__ */ Object.create(null), c);
            O.pos = f, O.end != null && (O.end = a.changes.mapPos(O.end)), h.push(O);
          }
        }
        o = h;
      }
      for (let h of a.effects)
        h.is(t) && (o = h.value, l = void 0), (h.is(lf) && !h.value || h.value == r) && (o = []);
      return o.length && l && i.set(o, l), o;
    },
    provide: (o) => bo.from(o)
  });
  const s = ot.define((o) => new Gk(
    o,
    n,
    r,
    i,
    t,
    e.hoverTime || 300
    /* Hover.Time */
  ));
  return {
    active: r,
    extension: [
      r,
      s,
      dg.of(s),
      Dk
    ]
  };
}
function Bk(n, e, t, i = {}) {
  var r;
  let s = n.state.facet(dg).map((o) => n.plugin(o)).filter((o) => !!o);
  if (i.tooltip && i.tooltip.active) {
    let o = s.find((a) => a.field == i.tooltip.active);
    o && (s = [o]);
  }
  for (let o of s)
    o.activateHover(n, e, t, (r = i.until) !== null && r !== void 0 ? r : (() => !1));
}
function Fk(n, e) {
  let t = n.plugin(bl);
  if (!t)
    return null;
  let i = t.manager.tooltips.indexOf(e);
  return i < 0 ? null : t.manager.tooltipViews[i];
}
function Hk(n) {
  return n.facet(bo).some((e) => e);
}
const lf = /* @__PURE__ */ qe.define(), Jk = /* @__PURE__ */ lf.of(null);
function Kk(n) {
  return lf.of(n.active);
}
function ex(n) {
  let e = n.plugin(bl);
  e && e.maybeMeasure();
}
const mc = /* @__PURE__ */ se.define({
  combine(n) {
    let e, t;
    for (let i of n)
      e = e || i.topContainer, t = t || i.bottomContainer;
    return { topContainer: e, bottomContainer: t };
  }
});
function tx(n) {
  return n ? [mc.of(n)] : [];
}
function pg(n, e) {
  let t = n.plugin(gg), i = t ? t.specs.indexOf(e) : -1;
  return i > -1 ? t.panels[i] : null;
}
const gg = /* @__PURE__ */ ot.fromClass(class {
  constructor(n) {
    this.input = n.state.facet(Ka), this.specs = this.input.filter((t) => t), this.panels = this.specs.map((t) => t(n));
    let e = n.state.facet(mc);
    this.top = new la(n, !0, e.topContainer), this.bottom = new la(n, !1, e.bottomContainer), this.top.sync(this.panels.filter((t) => t.top)), this.bottom.sync(this.panels.filter((t) => !t.top));
    for (let t of this.panels)
      t.dom.classList.add("cm-panel"), t.mount && t.mount();
  }
  update(n) {
    let e = n.state.facet(mc);
    this.top.container != e.topContainer && (this.top.sync([]), this.top = new la(n.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new la(n.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let t = n.state.facet(Ka);
    if (t != this.input) {
      let i = t.filter((l) => l), r = [], s = [], o = [], a = [];
      for (let l of i) {
        let h = this.specs.indexOf(l), c;
        h < 0 ? (c = l(n.view), a.push(c)) : (c = this.panels[h], c.update && c.update(n)), r.push(c), (c.top ? s : o).push(c);
      }
      this.specs = i, this.panels = r, this.top.sync(s), this.bottom.sync(o);
      for (let l of a)
        l.dom.classList.add("cm-panel"), l.mount && l.mount();
    } else
      for (let i of this.panels)
        i.update && i.update(n);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (n) => ce.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return t && { top: t.top.scrollMargin(), bottom: t.bottom.scrollMargin() };
  })
});
class la {
  constructor(e, t, i) {
    this.view = e, this.top = t, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(e) {
    for (let t of this.panels)
      t.destroy && e.indexOf(t) < 0 && t.destroy();
    this.panels = e, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let e = this.dom.firstChild;
    for (let t of this.panels)
      if (t.dom.parentNode == this.dom) {
        for (; e != t.dom; )
          e = Ku(e);
        e = e.nextSibling;
      } else
        this.dom.insertBefore(t.dom, e);
    for (; e; )
      e = Ku(e);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let e of this.classes.split(" "))
        e && this.container.classList.remove(e);
      for (let e of (this.classes = this.view.themeClasses).split(" "))
        e && this.container.classList.add(e);
    }
  }
}
function Ku(n) {
  let e = n.nextSibling;
  return n.remove(), e;
}
const Ka = /* @__PURE__ */ se.define({
  enables: gg
});
function ix(n, e) {
  let t, i = new Promise((o) => t = o), r = (o) => rx(o, e, t);
  n.state.field(_a, !1) ? n.dispatch({ effects: mg.of(r) }) : n.dispatch({ effects: qe.appendConfig.of(_a.init(() => [r])) });
  let s = vg.of(r);
  return { close: s, result: i.then((o) => ((n.win.queueMicrotask || ((l) => n.win.setTimeout(l, 10)))(() => {
    n.state.field(_a).indexOf(r) > -1 && n.dispatch({ effects: s });
  }), o)) };
}
function nx(n, e) {
  let t = n.state.field(_a, !1) || [];
  for (let i of t) {
    let r = pg(n, i);
    if (r && r.dom.classList.contains(e))
      return r;
  }
  return null;
}
const _a = /* @__PURE__ */ ui.define({
  create() {
    return [];
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(mg) ? n = [t.value].concat(n) : t.is(vg) && (n = n.filter((i) => i != t.value));
    return n;
  },
  provide: (n) => Ka.computeN([n], (e) => e.field(n))
}), mg = /* @__PURE__ */ qe.define(), vg = /* @__PURE__ */ qe.define();
function rx(n, e, t) {
  let i = e.content ? e.content(n, () => o(null)) : null;
  if (!i) {
    if (i = Yr("form"), e.input) {
      let a = Yr("input", e.input);
      /^(text|password|number|email|tel|url)$/.test(a.type) && a.classList.add("cm-textfield"), a.name || (a.name = "input"), i.appendChild(Yr("label", (e.label || "") + ": ", a));
    } else
      i.appendChild(document.createTextNode(e.label || ""));
    i.appendChild(document.createTextNode(" ")), i.appendChild(Yr("button", { class: "cm-button", type: "submit" }, e.submitLabel || "OK"));
  }
  let r = i.nodeName == "FORM" ? [i] : i.querySelectorAll("form");
  for (let a = 0; a < r.length; a++) {
    let l = r[a];
    l.addEventListener("keydown", (h) => {
      h.keyCode == 27 ? (h.preventDefault(), o(null)) : h.keyCode == 13 && (h.preventDefault(), o(l));
    }), l.addEventListener("submit", (h) => {
      h.preventDefault(), o(l);
    });
  }
  let s = Yr("div", i, Yr("button", {
    onclick: () => o(null),
    "aria-label": n.state.phrase("close"),
    class: "cm-dialog-close",
    type: "button"
  }, ["×"]));
  e.class && (s.className = e.class), s.classList.add("cm-dialog");
  function o(a) {
    s.contains(s.ownerDocument.activeElement) && n.focus(), t(a);
  }
  return {
    dom: s,
    top: e.top,
    mount: () => {
      if (e.focus) {
        let a;
        typeof e.focus == "string" ? a = i.querySelector(e.focus) : a = i.querySelector("input") || i.querySelector("button"), a && "select" in a ? a.select() : a && "focus" in a && a.focus();
      }
    }
  };
}
class rn extends $n {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
rn.prototype.elementClass = "";
rn.prototype.toDOM = void 0;
rn.prototype.mapMode = Zt.TrackBefore;
rn.prototype.startSide = rn.prototype.endSide = -1;
rn.prototype.point = !0;
const so = /* @__PURE__ */ se.define(), Qg = /* @__PURE__ */ se.define(), sx = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => Pe.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {},
  side: "before"
}, oo = /* @__PURE__ */ se.define();
function bg(n) {
  return [hf(), oo.of({ ...sx, ...n })];
}
const vc = /* @__PURE__ */ se.define({
  combine: (n) => n.some((e) => e)
});
function hf(n) {
  let e = [
    ox
  ];
  return n && n.fixed === !1 && e.push(vc.of(!0)), e;
}
const ox = /* @__PURE__ */ ot.fromClass(class {
  constructor(n) {
    this.view = n, this.domAfter = null, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters cm-gutters-before", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(oo).map((e) => new tO(n, e)), this.fixed = !n.state.facet(vc);
    for (let e of this.gutters)
      e.config.side == "after" ? this.getDOMAfter().appendChild(e.dom) : this.dom.appendChild(e.dom);
    this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  getDOMAfter() {
    return this.domAfter || (this.domAfter = document.createElement("div"), this.domAfter.className = "cm-gutters cm-gutters-after", this.domAfter.setAttribute("aria-hidden", "true"), this.domAfter.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.domAfter.style.position = this.fixed ? "sticky" : "", this.view.scrollDOM.appendChild(this.domAfter)), this.domAfter;
  }
  update(n) {
    if (this.updateGutters(n)) {
      let e = this.prevViewport, t = n.view.viewport, i = Math.min(e.to, t.to) - Math.max(e.from, t.from);
      this.syncGutters(i < (t.to - t.from) * 0.8);
    }
    if (n.geometryChanged) {
      let e = this.view.contentHeight / this.view.scaleY + "px";
      this.dom.style.minHeight = e, this.domAfter && (this.domAfter.style.minHeight = e);
    }
    this.view.state.facet(vc) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : "", this.domAfter && (this.domAfter.style.position = this.fixed ? "sticky" : "")), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let e = this.dom.nextSibling;
    n && (this.dom.remove(), this.domAfter && this.domAfter.remove());
    let t = Pe.iter(this.view.state.facet(so), this.view.viewport.from), i = [], r = this.gutters.map((s) => new ax(s, this.view.viewport, -this.view.documentPadding.top));
    for (let s of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(s.type)) {
        let o = !0;
        for (let a of s.type)
          if (a.type == yt.Text && o) {
            Qc(t, i, a.from);
            for (let l of r)
              l.line(this.view, a, i);
            o = !1;
          } else if (a.widget)
            for (let l of r)
              l.widget(this.view, a);
      } else if (s.type == yt.Text) {
        Qc(t, i, s.from);
        for (let o of r)
          o.line(this.view, s, i);
      } else if (s.widget)
        for (let o of r)
          o.widget(this.view, s);
    for (let s of r)
      s.finish();
    n && (this.view.scrollDOM.insertBefore(this.dom, e), this.domAfter && this.view.scrollDOM.appendChild(this.domAfter));
  }
  updateGutters(n) {
    let e = n.startState.facet(oo), t = n.state.facet(oo), i = n.docChanged || n.heightChanged || n.viewportChanged || !Pe.eq(n.startState.facet(so), n.state.facet(so), n.view.viewport.from, n.view.viewport.to);
    if (e == t)
      for (let r of this.gutters)
        r.update(n) && (i = !0);
    else {
      i = !0;
      let r = [];
      for (let s of t) {
        let o = e.indexOf(s);
        o < 0 ? r.push(new tO(this.view, s)) : (this.gutters[o].update(n), r.push(this.gutters[o]));
      }
      for (let s of this.gutters)
        s.dom.remove(), r.indexOf(s) < 0 && s.destroy();
      for (let s of r)
        s.config.side == "after" ? this.getDOMAfter().appendChild(s.dom) : this.dom.appendChild(s.dom);
      this.gutters = r;
    }
    return i;
  }
  destroy() {
    for (let n of this.gutters)
      n.destroy();
    this.dom.remove(), this.domAfter && this.domAfter.remove();
  }
}, {
  provide: (n) => ce.scrollMargins.of((e) => {
    let t = e.plugin(n);
    if (!t || t.gutters.length == 0 || !t.fixed)
      return null;
    let i = t.dom.offsetWidth * e.scaleX, r = t.domAfter ? t.domAfter.offsetWidth * e.scaleX : 0;
    return e.textDirection == Ie.LTR ? { left: i, right: r } : { right: i, left: r };
  })
});
function eO(n) {
  return Array.isArray(n) ? n : [n];
}
function Qc(n, e, t) {
  for (; n.value && n.from <= t; )
    n.from == t && e.push(n.value), n.next();
}
class ax {
  constructor(e, t, i) {
    this.gutter = e, this.height = i, this.i = 0, this.cursor = Pe.iter(e.markers, t.from);
  }
  addElement(e, t, i) {
    let { gutter: r } = this, s = (t.top - this.height) / e.scaleY, o = t.height / e.scaleY;
    if (this.i == r.elements.length) {
      let a = new Sg(e, o, s, i);
      r.elements.push(a), r.dom.appendChild(a.dom);
    } else
      r.elements[this.i].update(e, o, s, i);
    this.height = t.bottom, this.i++;
  }
  line(e, t, i) {
    let r = [];
    Qc(this.cursor, r, t.from), i.length && (r = r.concat(i));
    let s = this.gutter.config.lineMarker(e, t, r);
    s && r.unshift(s);
    let o = this.gutter;
    r.length == 0 && !o.config.renderEmptyElements || this.addElement(e, t, r);
  }
  widget(e, t) {
    let i = this.gutter.config.widgetMarker(e, t.widget, t), r = i ? [i] : null;
    for (let s of e.state.facet(Qg)) {
      let o = s(e, t.widget, t);
      o && (r || (r = [])).push(o);
    }
    r && this.addElement(e, t, r);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let t = e.elements.pop();
      e.dom.removeChild(t.dom), t.destroy();
    }
  }
}
class tO {
  constructor(e, t) {
    this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in t.domEventHandlers)
      this.dom.addEventListener(i, (r) => {
        let s = r.target, o;
        if (s != this.dom && this.dom.contains(s)) {
          for (; s.parentNode != this.dom; )
            s = s.parentNode;
          let l = s.getBoundingClientRect();
          o = (l.top + l.bottom) / 2;
        } else
          o = r.clientY;
        let a = e.lineBlockAtHeight(o - e.documentTop);
        t.domEventHandlers[i](e, a, r) && r.preventDefault();
      });
    this.markers = eO(t.markers(e)), t.initialSpacer && (this.spacer = new Sg(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let t = this.markers;
    if (this.markers = eO(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let r = this.config.updateSpacer(this.spacer.markers[0], e);
      r != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [r]);
    }
    let i = e.view.viewport;
    return !Pe.eq(this.markers, t, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class Sg {
  constructor(e, t, i, r) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, i, r);
  }
  update(e, t, i, r) {
    this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""), lx(this.markers, r) || this.setMarkers(e, r);
  }
  setMarkers(e, t) {
    let i = "cm-gutterElement", r = this.dom.firstChild;
    for (let s = 0, o = 0; ; ) {
      let a = o, l = s < t.length ? t[s++] : null, h = !1;
      if (l) {
        let c = l.elementClass;
        c && (i += " " + c);
        for (let f = o; f < this.markers.length; f++)
          if (this.markers[f].compare(l)) {
            a = f, h = !0;
            break;
          }
      } else
        a = this.markers.length;
      for (; o < a; ) {
        let c = this.markers[o++];
        if (c.toDOM) {
          c.destroy(r);
          let f = r.nextSibling;
          r.remove(), r = f;
        }
      }
      if (!l)
        break;
      l.toDOM && (h ? r = r.nextSibling : this.dom.insertBefore(l.toDOM(e), r)), h && o++;
    }
    this.dom.className = i, this.markers = t;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function lx(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].compare(e[t]))
      return !1;
  return !0;
}
const yg = /* @__PURE__ */ se.define(), kg = /* @__PURE__ */ se.define(), Ur = /* @__PURE__ */ se.define({
  combine(n) {
    return xs(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, t) {
        let i = Object.assign({}, e);
        for (let r in t) {
          let s = i[r], o = t[r];
          i[r] = s ? (a, l, h) => s(a, l, h) || o(a, l, h) : o;
        }
        return i;
      }
    });
  }
});
class rh extends rn {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function sh(n, e) {
  return n.state.facet(Ur).formatNumber(e, n.state);
}
const hx = /* @__PURE__ */ oo.compute([Ur], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(yg);
  },
  lineMarker(e, t, i) {
    return i.some((r) => r.toDOM) ? null : new rh(sh(e, e.state.doc.lineAt(t.from).number));
  },
  widgetMarker: (e, t, i) => {
    for (let r of e.state.facet(kg)) {
      let s = r(e, t, i);
      if (s)
        return s;
    }
    return null;
  },
  lineMarkerChange: (e) => e.startState.facet(Ur) != e.state.facet(Ur),
  initialSpacer(e) {
    return new rh(sh(e, iO(e.state.doc.lines)));
  },
  updateSpacer(e, t) {
    let i = sh(t.view, iO(t.view.state.doc.lines));
    return i == e.number ? e : new rh(i);
  },
  domEventHandlers: n.facet(Ur).domEventHandlers,
  side: "before"
}));
function cx(n = {}) {
  return [
    Ur.of(n),
    hf(),
    hx
  ];
}
function iO(n) {
  let e = 9;
  for (; e < n; )
    e = e * 10 + 9;
  return e;
}
const fx = /* @__PURE__ */ new class extends rn {
  constructor() {
    super(...arguments), this.elementClass = "cm-activeLineGutter";
  }
}(), ux = /* @__PURE__ */ so.compute(["selection"], (n) => {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let r = n.doc.lineAt(i.head).from;
    r > t && (t = r, e.push(fx.range(r)));
  }
  return Pe.of(e);
});
function Ox() {
  return ux;
}
function xg(n) {
  return ot.define((e) => ({
    decorations: n.createDeco(e),
    update(t) {
      this.decorations = n.updateDeco(t, this.decorations);
    }
  }), {
    decorations: (e) => e.decorations
  });
}
const dx = /* @__PURE__ */ pe.mark({ class: "cm-highlightTab" }), px = /* @__PURE__ */ pe.mark({ class: "cm-highlightSpace" }), gx = /* @__PURE__ */ xg(/* @__PURE__ */ new Ql({
  regexp: /\t| /g,
  decoration: (n) => n[0] == "	" ? dx : px,
  boundary: /\S/
}));
function mx() {
  return gx;
}
const vx = /* @__PURE__ */ xg(/* @__PURE__ */ new Ql({
  regexp: /\s+$/g,
  decoration: /* @__PURE__ */ pe.mark({ class: "cm-trailingSpace" })
}));
function Qx() {
  return vx;
}
const bx = {
  HeightMap: qt,
  HeightOracle: ig,
  MeasuredHeights: ng,
  QueryType: Fe,
  ChangedRange: ci,
  computeOrder: xp,
  moveVisually: _p,
  clearHeightChangeFlag: cc,
  getHeightChangeFlag: () => Cr
}, Sx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BidiSpan: Xi,
  BlockInfo: Qi,
  get BlockType() {
    return yt;
  },
  BlockWrapper: ps,
  Decoration: pe,
  get Direction() {
    return Ie;
  },
  EditorView: ce,
  GutterMarker: rn,
  MatchDecorator: Ql,
  RectangleMarker: Fn,
  ViewPlugin: ot,
  ViewUpdate: Qo,
  WidgetType: qi,
  __test: bx,
  activateHover: Bk,
  closeHoverTooltip: Kk,
  closeHoverTooltips: Jk,
  crosshairCursor: Ek,
  drawSelection: ck,
  dropCursor: gk,
  getDialog: nx,
  getDrawSelectionConfig: fk,
  getPanel: pg,
  getTooltip: Fk,
  gutter: bg,
  gutterLineClass: so,
  gutterWidgetClass: Qg,
  gutters: hf,
  hasHoverTooltips: Hk,
  highlightActiveLine: Tk,
  highlightActiveLineGutter: Ox,
  highlightSpecialChars: Sk,
  highlightTrailingWhitespace: Qx,
  highlightWhitespace: mx,
  hoverTooltip: Nk,
  keymap: sf,
  layer: of,
  lineNumberMarkers: yg,
  lineNumberWidgetMarker: kg,
  lineNumbers: cx,
  logException: Si,
  panels: tx,
  placeholder: Xk,
  rectangularSelection: zk,
  repositionTooltips: ex,
  runScopeHandlers: rk,
  scrollPastEnd: _k,
  showDialog: ix,
  showPanel: Ka,
  showTooltip: af,
  tooltips: jk
}, Symbol.toStringTag, { value: "Module" })), wg = 1024;
let yx = 0;
class oh {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
class Re {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = yx++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    }), this.combine = e.combine || null;
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = Gt.match(e)), (t) => {
      let i = e(t);
      return i === void 0 ? null : [this, i];
    };
  }
}
Re.closedBy = new Re({ deserialize: (n) => n.split(" ") });
Re.openedBy = new Re({ deserialize: (n) => n.split(" ") });
Re.group = new Re({ deserialize: (n) => n.split(" ") });
Re.isolate = new Re({ deserialize: (n) => {
  if (n && n != "rtl" && n != "ltr" && n != "auto")
    throw new RangeError("Invalid value for isolate: " + n);
  return n || "auto";
} });
Re.contextHash = new Re({ perNode: !0 });
Re.lookAhead = new Re({ perNode: !0 });
Re.mounted = new Re({ perNode: !0 });
class ao {
  constructor(e, t, i, r = !1) {
    this.tree = e, this.overlay = t, this.parser = i, this.bracketed = r;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[Re.mounted.id];
  }
}
const kx = /* @__PURE__ */ Object.create(null);
class Gt {
  /**
  @internal
  */
  constructor(e, t, i, r = 0) {
    this.name = e, this.props = t, this.id = i, this.flags = r;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let t = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : kx, i = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), r = new Gt(e.name || "", t, e.id, i);
    if (e.props) {
      for (let s of e.props)
        if (Array.isArray(s) || (s = s(r)), s) {
          if (s[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          t[s[0].id] = s[1];
        }
    }
    return r;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let t = this.prop(Re.group);
      return t ? t.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e)
      for (let r of i.split(" "))
        t[r] = e[i];
    return (i) => {
      for (let r = i.prop(Re.group), s = -1; s < (r ? r.length : 0); s++) {
        let o = t[s < 0 ? i.name : r[s]];
        if (o)
          return o;
      }
    };
  }
}
Gt.none = new Gt(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class yl {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(e) {
    this.types = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].id != t)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...e) {
    let t = [];
    for (let i of this.types) {
      let r = null;
      for (let s of e) {
        let o = s(i);
        if (o) {
          r || (r = Object.assign({}, i.props));
          let a = o[1], l = o[0];
          l.combine && l.id in r && (a = l.combine(r[l.id], a)), r[l.id] = a;
        }
      }
      t.push(r ? new Gt(i.name, r, i.id, i.flags) : i);
    }
    return new yl(t);
  }
}
const ha = /* @__PURE__ */ new WeakMap(), nO = /* @__PURE__ */ new WeakMap();
var it;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays", n[n.EnterBracketed = 16] = "EnterBracketed";
})(it || (it = {}));
class Ue {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, t, i, r, s) {
    if (this.type = e, this.children = t, this.positions = i, this.length = r, this.props = null, s && s.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [o, a] of s)
        this.props[typeof o == "number" ? o : o.id] = a;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = ao.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let t = "";
    for (let i of this.children) {
      let r = i.toString();
      r && (t && (t += ","), t += r);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new Sc(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, t = 0, i = 0) {
    let r = ha.get(this) || this.topNode, s = new Sc(r);
    return s.moveTo(e, t), ha.set(this, s._tree), s;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new Jt(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, t = 0) {
    let i = So(ha.get(this) || this.topNode, e, t, !1);
    return ha.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, t = 0) {
    let i = So(nO.get(this) || this.topNode, e, t, !0);
    return nO.set(this, i), i;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, t = 0) {
    return Px(this, e, t);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: t, leave: i, from: r = 0, to: s = this.length } = e, o = e.mode || 0, a = (o & it.IncludeAnonymous) > 0;
    for (let l = this.cursor(o | it.IncludeAnonymous); ; ) {
      let h = !1;
      if (l.from <= s && l.to >= r && (!a && l.type.isAnonymous || t(l) !== !1)) {
        if (l.firstChild())
          continue;
        h = !0;
      }
      for (; h && i && (a || !l.type.isAnonymous) && i(l), !l.nextSibling(); ) {
        if (!l.parent())
          return;
        h = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let t in this.props)
        e.push([+t, this.props[t]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : uf(Gt.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, i, r) => new Ue(this.type, t, i, r, this.propValues), e.makeTree || ((t, i, r) => new Ue(Gt.none, t, i, r)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return _x(e);
  }
}
Ue.empty = new Ue(Gt.none, [], [], 0);
class cf {
  constructor(e, t) {
    this.buffer = e, this.index = t;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new cf(this.buffer, this.index);
  }
}
class rr {
  /**
  Create a tree buffer.
  */
  constructor(e, t, i) {
    this.buffer = e, this.length = t, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return Gt.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let t = 0; t < this.buffer.length; )
      e.push(this.childString(t)), t = this.buffer[t + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let t = this.buffer[e], i = this.buffer[e + 3], r = this.set.types[t], s = r.name;
    if (/\W/.test(s) && !r.isError && (s = JSON.stringify(s)), e += 4, i == e)
      return s;
    let o = [];
    for (; e < i; )
      o.push(this.childString(e)), e = this.buffer[e + 3];
    return s + "(" + o.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, t, i, r, s) {
    let { buffer: o } = this, a = -1;
    for (let l = e; l != t && !(Pg(s, r, o[l + 1], o[l + 2]) && (a = l, i > 0)); l = o[l + 3])
      ;
    return a;
  }
  /**
  @internal
  */
  slice(e, t, i) {
    let r = this.buffer, s = new Uint16Array(t - e), o = 0;
    for (let a = e, l = 0; a < t; ) {
      s[l++] = r[a++], s[l++] = r[a++] - i;
      let h = s[l++] = r[a++] - i;
      s[l++] = r[a++] - e, o = Math.max(o, h);
    }
    return new rr(s, o, this.set);
  }
}
function Pg(n, e, t, i) {
  switch (n) {
    case -2:
      return t < e;
    case -1:
      return i >= e && t < e;
    case 0:
      return t < e && i > e;
    case 1:
      return t <= e && i > e;
    case 2:
      return i > e;
    case 4:
      return !0;
  }
}
function So(n, e, t, i) {
  for (var r; n.from == n.to || (t < 1 ? n.from >= e : n.from > e) || (t > -1 ? n.to <= e : n.to < e); ) {
    let o = !i && n instanceof Jt && n.index < 0 ? null : n.parent;
    if (!o)
      return n;
    n = o;
  }
  let s = i ? 0 : it.IgnoreOverlays;
  if (i)
    for (let o = n, a = o.parent; a; o = a, a = o.parent)
      o instanceof Jt && o.index < 0 && ((r = a.enter(e, t, s)) === null || r === void 0 ? void 0 : r.from) != o.from && (n = a);
  for (; ; ) {
    let o = n.enter(e, t, s);
    if (!o)
      return n;
    n = o;
  }
}
class _g {
  cursor(e = 0) {
    return new Sc(this, e);
  }
  getChild(e, t = null, i = null) {
    let r = rO(this, e, t, i);
    return r.length ? r[0] : null;
  }
  getChildren(e, t = null, i = null) {
    return rO(this, e, t, i);
  }
  resolve(e, t = 0) {
    return So(this, e, t, !1);
  }
  resolveInner(e, t = 0) {
    return So(this, e, t, !0);
  }
  matchContext(e) {
    return bc(this.parent, e);
  }
  enterUnfinishedNodesBefore(e) {
    let t = this.childBefore(e), i = this;
    for (; t; ) {
      let r = t.lastChild;
      if (!r || r.to != t.to)
        break;
      r.type.isError && r.from == r.to ? (i = t, t = r.prevSibling) : t = r;
    }
    return i;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class Jt extends _g {
  constructor(e, t, i, r) {
    super(), this._tree = e, this.from = t, this.index = i, this._parent = r;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, t, i, r, s = 0) {
    for (let o = this; ; ) {
      for (let { children: a, positions: l } = o._tree, h = t > 0 ? a.length : -1; e != h; e += t) {
        let c = a[e], f = l[e] + o.from, O;
        if (!(!(s & it.EnterBracketed && c instanceof Ue && (O = ao.get(c)) && !O.overlay && O.bracketed && i >= f && i <= f + c.length) && !Pg(r, i, f, f + c.length))) {
          if (c instanceof rr) {
            if (s & it.ExcludeBuffers)
              continue;
            let d = c.findChild(0, c.buffer.length, t, i - f, r);
            if (d > -1)
              return new Hi(new xx(o, c, e, f), null, d);
          } else if (s & it.IncludeAnonymous || !c.type.isAnonymous || ff(c)) {
            let d;
            if (!(s & it.IgnoreMounts) && (d = ao.get(c)) && !d.overlay)
              return new Jt(d.tree, f, e, o);
            let p = new Jt(c, f, e, o);
            return s & it.IncludeAnonymous || !p.type.isAnonymous ? p : p.nextChild(t < 0 ? c.children.length - 1 : 0, t, i, r, s);
          }
        }
      }
      if (s & it.IncludeAnonymous || !o.type.isAnonymous || (o.index >= 0 ? e = o.index + t : e = t < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  prop(e) {
    return this._tree.prop(e);
  }
  enter(e, t, i = 0) {
    let r;
    if (!(i & it.IgnoreOverlays) && (r = ao.get(this._tree)) && r.overlay) {
      let s = e - this.from, o = i & it.EnterBracketed && r.bracketed;
      for (let { from: a, to: l } of r.overlay)
        if ((t > 0 || o ? a <= s : a < s) && (t < 0 || o ? l >= s : l > s))
          return new Jt(r.tree, r.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, t, i);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function rO(n, e, t, i) {
  let r = n.cursor(), s = [];
  if (!r.firstChild())
    return s;
  if (t != null) {
    for (let o = !1; !o; )
      if (o = r.type.is(t), !r.nextSibling())
        return s;
  }
  for (; ; ) {
    if (i != null && r.type.is(i))
      return s;
    if (r.type.is(e) && s.push(r.node), !r.nextSibling())
      return i == null ? s : [];
  }
}
function bc(n, e, t = e.length - 1) {
  for (let i = n; t >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (e[t] && e[t] != i.name)
        return !1;
      t--;
    }
  }
  return !0;
}
class xx {
  constructor(e, t, i, r) {
    this.parent = e, this.buffer = t, this.index = i, this.start = r;
  }
}
class Hi extends _g {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, t, i) {
    super(), this.context = e, this._parent = t, this.index = i, this.type = e.buffer.set.types[e.buffer.buffer[i]];
  }
  child(e, t, i) {
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.context.start, i);
    return s < 0 ? null : new Hi(this.context, this, s);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  prop(e) {
    return this.type.prop(e);
  }
  enter(e, t, i = 0) {
    if (i & it.ExcludeBuffers)
      return null;
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], t > 0 ? 1 : -1, e - this.context.start, t);
    return s < 0 ? null : new Hi(this.context, this, s);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, t = e.buffer[this.index + 3];
    return t < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new Hi(this.context, this._parent, t) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, t = this._parent ? this._parent.index + 4 : 0;
    return this.index == t ? this.externalSibling(-1) : new Hi(this.context, this._parent, e.findChild(
      t,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], t = [], { buffer: i } = this.context, r = this.index + 4, s = i.buffer[this.index + 3];
    if (s > r) {
      let o = i.buffer[this.index + 1];
      e.push(i.slice(r, s, o)), t.push(0);
    }
    return new Ue(this.type, e, t, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function Tg(n) {
  if (!n.length)
    return null;
  let e = 0, t = n[0];
  for (let s = 1; s < n.length; s++) {
    let o = n[s];
    (o.from > t.from || o.to < t.to) && (t = o, e = s);
  }
  let i = t instanceof Jt && t.index < 0 ? null : t.parent, r = n.slice();
  return i ? r[e] = i : r.splice(e, 1), new wx(r, t);
}
class wx {
  constructor(e, t) {
    this.heads = e, this.node = t;
  }
  get next() {
    return Tg(this.heads);
  }
}
function Px(n, e, t) {
  let i = n.resolveInner(e, t), r = null;
  for (let s = i instanceof Jt ? i : i.context.parent; s; s = s.parent)
    if (s.index < 0) {
      let o = s.parent;
      (r || (r = [i])).push(o.resolve(e, t)), s = o;
    } else {
      let o = ao.get(s.tree);
      if (o && o.overlay && o.overlay[0].from <= e && o.overlay[o.overlay.length - 1].to >= e) {
        let a = new Jt(o.tree, o.overlay[0].from + s.from, -1, s);
        (r || (r = [i])).push(So(a, e, t, !1));
      }
    }
  return r ? Tg(r) : i;
}
class Sc {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, t = 0) {
    if (this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, this.mode = t & ~it.EnterBracketed, e instanceof Jt)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let i = e._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, t) {
    this.index = e;
    let { start: i, buffer: r } = this.buffer;
    return this.type = t || r.set.types[r.buffer[e]], this.from = i + r.buffer[e + 1], this.to = i + r.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof Jt ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, t, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, i, this.mode));
    let { buffer: r } = this.buffer, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.buffer.start, i);
    return s < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(s));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, t, i = this.mode) {
    return this.buffer ? i & it.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & it.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & it.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: t } = this.buffer, i = this.stack.length - 1;
    if (e < 0) {
      let r = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != r)
        return this.yieldBuf(t.findChild(
          r,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let r = t.buffer[this.index + 3];
      if (r < (i < 0 ? t.buffer.length : t.buffer[this.stack[i] + 3]))
        return this.yieldBuf(r);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let t, i, { buffer: r } = this;
    if (r) {
      if (e > 0) {
        if (this.index < r.buffer.buffer.length)
          return !1;
      } else
        for (let s = 0; s < this.index; s++)
          if (r.buffer.buffer[s + 3] < this.index)
            return !1;
      ({ index: t, parent: i } = r);
    } else
      ({ index: t, _parent: i } = this._tree);
    for (; i; { index: t, _parent: i } = i)
      if (t > -1)
        for (let s = t + e, o = e < 0 ? -1 : i._tree.children.length; s != o; s += e) {
          let a = i._tree.children[s];
          if (this.mode & it.IncludeAnonymous || a instanceof rr || !a.type.isAnonymous || ff(a))
            return !1;
        }
    return !0;
  }
  move(e, t) {
    if (t && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traversal. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, t = 0) {
    for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, t); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, t = null, i = 0;
    if (e && e.context == this.buffer)
      e: for (let r = this.index, s = this.stack.length; s >= 0; ) {
        for (let o = e; o; o = o._parent)
          if (o.index == r) {
            if (r == this.index)
              return o;
            t = o, i = s + 1;
            break e;
          }
        r = this.stack[--s];
      }
    for (let r = i; r < this.stack.length; r++)
      t = new Hi(this.buffer, t, this.stack[r]);
    return this.bufferNode = new Hi(this.buffer, t, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, t) {
    for (let i = 0; ; ) {
      let r = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (r = !0);
      }
      for (; ; ) {
        if (r && t && t(this), r = this.type.isAnonymous, !i)
          return;
        if (this.nextSibling())
          break;
        this.parent(), i--, r = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return bc(this.node.parent, e);
    let { buffer: t } = this.buffer, { types: i } = t.set;
    for (let r = e.length - 1, s = this.stack.length - 1; r >= 0; s--) {
      if (s < 0)
        return bc(this._tree, e, r);
      let o = i[t.buffer[this.stack[s]]];
      if (!o.isAnonymous) {
        if (e[r] && e[r] != o.name)
          return !1;
        r--;
      }
    }
    return !0;
  }
}
function ff(n) {
  return n.children.some((e) => e instanceof rr || !e.type.isAnonymous || ff(e));
}
function _x(n) {
  var e;
  let { buffer: t, nodeSet: i, maxBufferLength: r = wg, reused: s = [], minRepeatType: o = i.types.length } = n, a = Array.isArray(t) ? new cf(t, t.length) : t, l = i.types, h = 0, c = 0;
  function f(b, y, $, M, j, z) {
    let { id: C, start: Z, end: A, size: V } = a, U = c, B = h;
    if (V < 0)
      if (a.next(), V == -1) {
        let le = s[C];
        $.push(le), M.push(Z - b);
        return;
      } else if (V == -3) {
        h = C;
        return;
      } else if (V == -4) {
        c = C;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${V}`);
    let H = l[C], oe, q, E = Z - b;
    if (A - Z <= r && (q = m(a.pos - y, j))) {
      let le = new Uint16Array(q.size - q.skip), ne = a.pos - q.size, Oe = le.length;
      for (; a.pos > ne; )
        Oe = v(q.start, le, Oe);
      oe = new rr(le, A - q.start, i), E = q.start - b;
    } else {
      let le = a.pos - V;
      a.next();
      let ne = [], Oe = [], ge = C >= o ? C : -1, W = 0, Y = A;
      for (; a.pos > le; )
        ge >= 0 && a.id == ge && a.size >= 0 ? (a.end <= Y - r && (p(ne, Oe, Z, W, a.end, Y, ge, U, B), W = ne.length, Y = a.end), a.next()) : z > 2500 ? O(Z, le, ne, Oe) : f(Z, le, ne, Oe, ge, z + 1);
      if (ge >= 0 && W > 0 && W < ne.length && p(ne, Oe, Z, W, Z, Y, ge, U, B), ne.reverse(), Oe.reverse(), ge > -1 && W > 0) {
        let F = d(H, B);
        oe = uf(H, ne, Oe, 0, ne.length, 0, A - Z, F, F);
      } else
        oe = g(H, ne, Oe, A - Z, U - A, B);
    }
    $.push(oe), M.push(E);
  }
  function O(b, y, $, M) {
    let j = [], z = 0, C = -1;
    for (; a.pos > y; ) {
      let { id: Z, start: A, end: V, size: U } = a;
      if (U > 4)
        a.next();
      else {
        if (C > -1 && A < C)
          break;
        C < 0 && (C = V - r), j.push(Z, A, V), z++, a.next();
      }
    }
    if (z) {
      let Z = new Uint16Array(z * 4), A = j[j.length - 2];
      for (let V = j.length - 3, U = 0; V >= 0; V -= 3)
        Z[U++] = j[V], Z[U++] = j[V + 1] - A, Z[U++] = j[V + 2] - A, Z[U++] = U;
      $.push(new rr(Z, j[2] - A, i)), M.push(A - b);
    }
  }
  function d(b, y) {
    return ($, M, j) => {
      let z = 0, C = $.length - 1, Z, A;
      if (C >= 0 && (Z = $[C]) instanceof Ue) {
        if (!C && Z.type == b && Z.length == j)
          return Z;
        (A = Z.prop(Re.lookAhead)) && (z = M[C] + Z.length + A);
      }
      return g(b, $, M, j, z, y);
    };
  }
  function p(b, y, $, M, j, z, C, Z, A) {
    let V = [], U = [];
    for (; b.length > M; )
      V.push(b.pop()), U.push(y.pop() + $ - j);
    b.push(g(i.types[C], V, U, z - j, Z - z, A)), y.push(j - $);
  }
  function g(b, y, $, M, j, z, C) {
    if (z) {
      let Z = [Re.contextHash, z];
      C = C ? [Z].concat(C) : [Z];
    }
    if (j > 25) {
      let Z = [Re.lookAhead, j];
      C = C ? [Z].concat(C) : [Z];
    }
    return new Ue(b, y, $, M, C);
  }
  function m(b, y) {
    let $ = a.fork(), M = 0, j = 0, z = 0, C = $.end - r, Z = { size: 0, start: 0, skip: 0 };
    e: for (let A = $.pos - b; $.pos > A; ) {
      let V = $.size;
      if ($.id == y && V >= 0) {
        Z.size = M, Z.start = j, Z.skip = z, z += 4, M += 4, $.next();
        continue;
      }
      let U = $.pos - V;
      if (V < 0 || U < A || $.start < C)
        break;
      let B = $.id >= o ? 4 : 0, H = $.start;
      for ($.next(); $.pos > U; ) {
        if ($.size < 0)
          if ($.size == -3 || $.size == -4)
            B += 4;
          else
            break e;
        else $.id >= o && (B += 4);
        $.next();
      }
      j = H, M += V, z += B;
    }
    return (y < 0 || M == b) && (Z.size = M, Z.start = j, Z.skip = z), Z.size > 4 ? Z : void 0;
  }
  function v(b, y, $) {
    let { id: M, start: j, end: z, size: C } = a;
    if (a.next(), C >= 0 && M < o) {
      let Z = $;
      if (C > 4) {
        let A = a.pos - (C - 4);
        for (; a.pos > A; )
          $ = v(b, y, $);
      }
      y[--$] = Z, y[--$] = z - b, y[--$] = j - b, y[--$] = M;
    } else C == -3 ? h = M : C == -4 && (c = M);
    return $;
  }
  let w = [], S = [];
  for (; a.pos > 0; )
    f(n.start || 0, n.bufferStart || 0, w, S, -1, 0);
  let Q = (e = n.length) !== null && e !== void 0 ? e : w.length ? S[0] + w[0].length : 0;
  return new Ue(l[n.topID], w.reverse(), S.reverse(), Q);
}
const sO = /* @__PURE__ */ new WeakMap();
function Ta(n, e) {
  if (!n.isAnonymous || e instanceof rr || e.type != n)
    return 1;
  let t = sO.get(e);
  if (t == null) {
    t = 1;
    for (let i of e.children) {
      if (i.type != n || !(i instanceof Ue)) {
        t = 1;
        break;
      }
      t += Ta(n, i);
    }
    sO.set(e, t);
  }
  return t;
}
function uf(n, e, t, i, r, s, o, a, l) {
  let h = 0;
  for (let p = i; p < r; p++)
    h += Ta(n, e[p]);
  let c = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), f = [], O = [];
  function d(p, g, m, v, w) {
    for (let S = m; S < v; ) {
      let Q = S, b = g[S], y = Ta(n, p[S]);
      for (S++; S < v; S++) {
        let $ = Ta(n, p[S]);
        if (y + $ >= c)
          break;
        y += $;
      }
      if (S == Q + 1) {
        if (y > c) {
          let $ = p[Q];
          d($.children, $.positions, 0, $.children.length, g[Q] + w);
          continue;
        }
        f.push(p[Q]);
      } else {
        let $ = g[S - 1] + p[S - 1].length - b;
        f.push(uf(n, p, g, Q, S, b, $, null, l));
      }
      O.push(b + w - s);
    }
  }
  return d(e, t, i, r, 0), (a || l)(f, O, o);
}
class $g {
  constructor() {
    this.map = /* @__PURE__ */ new WeakMap();
  }
  setBuffer(e, t, i) {
    let r = this.map.get(e);
    r || this.map.set(e, r = /* @__PURE__ */ new Map()), r.set(t, i);
  }
  getBuffer(e, t) {
    let i = this.map.get(e);
    return i && i.get(t);
  }
  /**
  Set the value for this syntax node.
  */
  set(e, t) {
    e instanceof Hi ? this.setBuffer(e.context.buffer, e.index, t) : e instanceof Jt && this.map.set(e.tree, t);
  }
  /**
  Retrieve value for this syntax node, if it exists in the map.
  */
  get(e) {
    return e instanceof Hi ? this.getBuffer(e.context.buffer, e.index) : e instanceof Jt ? this.map.get(e.tree) : void 0;
  }
  /**
  Set the value for the node that a cursor currently points to.
  */
  cursorSet(e, t) {
    e.buffer ? this.setBuffer(e.buffer.buffer, e.index, t) : this.map.set(e.tree, t);
  }
  /**
  Retrieve the value for the node that a cursor currently points
  to.
  */
  cursorGet(e) {
    return e.buffer ? this.getBuffer(e.buffer.buffer, e.index) : this.map.get(e.tree);
  }
}
class xr {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, t, i, r, s = !1, o = !1) {
    this.from = e, this.to = t, this.tree = i, this.offset = r, this.open = (s ? 1 : 0) | (o ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, t = [], i = !1) {
    let r = [new xr(0, e.length, e, 0, !1, i)];
    for (let s of t)
      s.to > e.length && r.push(s);
    return r;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, t, i = 128) {
    if (!t.length)
      return e;
    let r = [], s = 1, o = e.length ? e[0] : null;
    for (let a = 0, l = 0, h = 0; ; a++) {
      let c = a < t.length ? t[a] : null, f = c ? c.fromA : 1e9;
      if (f - l >= i)
        for (; o && o.from < f; ) {
          let O = o;
          if (l >= O.from || f <= O.to || h) {
            let d = Math.max(O.from, l) - h, p = Math.min(O.to, f) - h;
            O = d >= p ? null : new xr(d, p, O.tree, O.offset + h, a > 0, !!c);
          }
          if (O && r.push(O), o.to > f)
            break;
          o = s < e.length ? e[s++] : null;
        }
      if (!c)
        break;
      l = c.toA, h = c.toA - c.toB;
    }
    return r;
  }
}
class Of {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, t, i) {
    return typeof e == "string" && (e = new Tx(e)), i = i ? i.length ? i.map((r) => new oh(r.from, r.to)) : [new oh(0, 0)] : [new oh(0, e.length)], this.createParse(e, t || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, t, i) {
    let r = this.startParse(e, t, i);
    for (; ; ) {
      let s = r.advance();
      if (s)
        return s;
    }
  }
}
class Tx {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, t) {
    return this.string.slice(e, t);
  }
}
new Re({ perNode: !0 });
let $x = 0;
class hi {
  /**
  @internal
  */
  constructor(e, t, i, r) {
    this.name = e, this.set = t, this.base = i, this.modified = r, this.id = $x++;
  }
  toString() {
    let { name: e } = this;
    for (let t of this.modified)
      t.name && (e = `${t.name}(${e})`);
    return e;
  }
  static define(e, t) {
    let i = typeof e == "string" ? e : "?";
    if (e instanceof hi && (t = e), t != null && t.base)
      throw new Error("Can not derive from a modified tag");
    let r = new hi(i, [], null, []);
    if (r.set.push(r), t)
      for (let s of t.set)
        r.set.push(s);
    return r;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier(e) {
    let t = new el(e);
    return (i) => i.modified.indexOf(t) > -1 ? i : el.get(i.base || i, i.modified.concat(t).sort((r, s) => r.id - s.id));
  }
}
let Zx = 0;
class el {
  constructor(e) {
    this.name = e, this.instances = [], this.id = Zx++;
  }
  static get(e, t) {
    if (!t.length)
      return e;
    let i = t[0].instances.find((a) => a.base == e && Rx(t, a.modified));
    if (i)
      return i;
    let r = [], s = new hi(e.name, r, e, t);
    for (let a of t)
      a.instances.push(s);
    let o = Xx(t);
    for (let a of e.set)
      if (!a.modified.length)
        for (let l of o)
          r.push(el.get(a, l));
    return s;
  }
}
function Rx(n, e) {
  return n.length == e.length && n.every((t, i) => t == e[i]);
}
function Xx(n) {
  let e = [[]];
  for (let t = 0; t < n.length; t++)
    for (let i = 0, r = e.length; i < r; i++)
      e.push(e[i].concat(n[t]));
  return e.sort((t, i) => i.length - t.length);
}
function kl(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let i = n[t];
    Array.isArray(i) || (i = [i]);
    for (let r of t.split(" "))
      if (r) {
        let s = [], o = 2, a = r;
        for (let f = 0; ; ) {
          if (a == "..." && f > 0 && f + 3 == r.length) {
            o = 1;
            break;
          }
          let O = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(a);
          if (!O)
            throw new RangeError("Invalid path: " + r);
          if (s.push(O[0] == "*" ? "" : O[0][0] == '"' ? JSON.parse(O[0]) : O[0]), f += O[0].length, f == r.length)
            break;
          let d = r[f++];
          if (f == r.length && d == "!") {
            o = 0;
            break;
          }
          if (d != "/")
            throw new RangeError("Invalid path: " + r);
          a = r.slice(f);
        }
        let l = s.length - 1, h = s[l];
        if (!h)
          throw new RangeError("Invalid path: " + r);
        let c = new yo(i, o, l > 0 ? s.slice(0, l) : null);
        e[h] = c.sort(e[h]);
      }
  }
  return Zg.add(e);
}
const Zg = new Re({
  combine(n, e) {
    let t, i, r;
    for (; n || e; ) {
      if (!n || e && n.depth >= e.depth ? (r = e, e = e.next) : (r = n, n = n.next), t && t.mode == r.mode && !r.context && !t.context)
        continue;
      let s = new yo(r.tags, r.mode, r.context);
      t ? t.next = s : i = s, t = s;
    }
    return i;
  }
});
class yo {
  constructor(e, t, i, r) {
    this.tags = e, this.mode = t, this.context = i, this.next = r;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
yo.empty = new yo([], 2, null);
function df(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let s of n)
    if (!Array.isArray(s.tag))
      t[s.tag.id] = s.class;
    else
      for (let o of s.tag)
        t[o.id] = s.class;
  let { scope: i, all: r = null } = e || {};
  return {
    style: (s) => {
      let o = r;
      for (let a of s)
        for (let l of a.set) {
          let h = t[l.id];
          if (h) {
            o = o ? o + " " + h : h;
            break;
          }
        }
      return o;
    },
    scope: i
  };
}
function Cx(n, e) {
  let t = null;
  for (let i of n) {
    let r = i.style(e);
    r && (t = t ? t + " " + r : r);
  }
  return t;
}
function pf(n, e, t, i = 0, r = n.length) {
  let s = new qx(i, Array.isArray(e) ? e : [e], t);
  s.highlightRange(n.cursor(), i, r, "", s.highlighters), s.flush(r);
}
function Ax(n, e, t, i, r, s = 0, o = n.length) {
  let a = s;
  function l(h, c) {
    if (!(h <= a)) {
      for (let f = n.slice(a, h), O = 0; ; ) {
        let d = f.indexOf(`
`, O), p = d < 0 ? f.length : d;
        if (p > O && i(f.slice(O, p), c), d < 0)
          break;
        r(), O = d + 1;
      }
      a = h;
    }
  }
  pf(e, t, (h, c, f) => {
    l(h, ""), l(c, f);
  }, s, o), l(o, "");
}
class qx {
  constructor(e, t, i) {
    this.at = e, this.highlighters = t, this.span = i, this.class = "";
  }
  startSpan(e, t) {
    t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, t, i, r, s) {
    let { type: o, from: a, to: l } = e;
    if (a >= i || l <= t)
      return;
    o.isTop && (s = this.highlighters.filter((d) => !d.scope || d.scope(o)));
    let h = r, c = Rg(e) || yo.empty, f = Cx(s, c.tags);
    if (f && (h && (h += " "), h += f, c.mode == 1 && (r += (r ? " " : "") + f)), this.startSpan(Math.max(t, a), h), c.opaque)
      return;
    let O = e.tree && e.tree.prop(Re.mounted);
    if (O && O.overlay) {
      let d = e.node.enter(O.overlay[0].from + a, 1), p = this.highlighters.filter((m) => !m.scope || m.scope(O.tree.type)), g = e.firstChild();
      for (let m = 0, v = a; ; m++) {
        let w = m < O.overlay.length ? O.overlay[m] : null, S = w ? w.from + a : l, Q = Math.max(t, v), b = Math.min(i, S);
        if (Q < b && g)
          for (; e.from < b && (this.highlightRange(e, Q, b, r, s), this.startSpan(Math.min(b, e.to), h), !(e.to >= S || !e.nextSibling())); )
            ;
        if (!w || S > i)
          break;
        v = w.to + a, v > t && (this.highlightRange(d.cursor(), Math.max(t, w.from + a), Math.min(i, v), "", p), this.startSpan(Math.min(i, v), h));
      }
      g && e.parent();
    } else if (e.firstChild()) {
      O && (r = "");
      do
        if (!(e.to <= t)) {
          if (e.from >= i)
            break;
          this.highlightRange(e, t, i, r, s), this.startSpan(Math.min(i, e.to), h);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function Rg(n) {
  let e = n.type.prop(Zg);
  for (; e && e.context && !n.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const ee = hi.define, ca = ee(), En = ee(), oO = ee(En), aO = ee(En), jn = ee(), fa = ee(jn), ah = ee(jn), Di = ee(), ar = ee(Di), Yi = ee(), Li = ee(), yc = ee(), qs = ee(yc), ua = ee(), _ = {
  /**
  A comment.
  */
  comment: ca,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: ee(ca),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: ee(ca),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: ee(ca),
  /**
  Any kind of identifier.
  */
  name: En,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: ee(En),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: oO,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: ee(oO),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: aO,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: ee(aO),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: ee(En),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: ee(En),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: ee(En),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: ee(En),
  /**
  A literal value.
  */
  literal: jn,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: fa,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: ee(fa),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: ee(fa),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: ee(fa),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: ah,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: ee(ah),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: ee(ah),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: ee(jn),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: ee(jn),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: ee(jn),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: ee(jn),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: ee(jn),
  /**
  A language keyword.
  */
  keyword: Yi,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: ee(Yi),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: ee(Yi),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: ee(Yi),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: ee(Yi),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: ee(Yi),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: ee(Yi),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: ee(Yi),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: ee(Yi),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: ee(Yi),
  /**
  An operator.
  */
  operator: Li,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: ee(Li),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: ee(Li),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: ee(Li),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: ee(Li),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: ee(Li),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: ee(Li),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: ee(Li),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: ee(Li),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: ee(Li),
  /**
  Program or markup punctuation.
  */
  punctuation: yc,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: ee(yc),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: qs,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: ee(qs),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: ee(qs),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: ee(qs),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: ee(qs),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: Di,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: ar,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: ee(ar),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: ee(ar),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: ee(ar),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: ee(ar),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: ee(ar),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: ee(ar),
  /**
  A prose [content](#highlight.tags.content) separator (such as a horizontal rule).
  */
  contentSeparator: ee(Di),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: ee(Di),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: ee(Di),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: ee(Di),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: ee(Di),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: ee(Di),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: ee(Di),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: ee(Di),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: ee(),
  /**
  Deleted text.
  */
  deleted: ee(),
  /**
  Changed text.
  */
  changed: ee(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: ee(),
  /**
  Metadata or meta-instruction.
  */
  meta: ua,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: ee(ua),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: ee(ua),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: ee(ua),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: hi.defineModifier("definition"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: hi.defineModifier("constant"),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: hi.defineModifier("function"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: hi.defineModifier("standard"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: hi.defineModifier("local"),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: hi.defineModifier("special")
};
for (let n in _) {
  let e = _[n];
  e instanceof hi && (e.name = n);
}
const zx = df([
  { tag: _.link, class: "tok-link" },
  { tag: _.heading, class: "tok-heading" },
  { tag: _.emphasis, class: "tok-emphasis" },
  { tag: _.strong, class: "tok-strong" },
  { tag: _.keyword, class: "tok-keyword" },
  { tag: _.atom, class: "tok-atom" },
  { tag: _.bool, class: "tok-bool" },
  { tag: _.url, class: "tok-url" },
  { tag: _.labelName, class: "tok-labelName" },
  { tag: _.inserted, class: "tok-inserted" },
  { tag: _.deleted, class: "tok-deleted" },
  { tag: _.literal, class: "tok-literal" },
  { tag: _.string, class: "tok-string" },
  { tag: _.number, class: "tok-number" },
  { tag: [_.regexp, _.escape, _.special(_.string)], class: "tok-string2" },
  { tag: _.variableName, class: "tok-variableName" },
  { tag: _.local(_.variableName), class: "tok-variableName tok-local" },
  { tag: _.definition(_.variableName), class: "tok-variableName tok-definition" },
  { tag: _.special(_.variableName), class: "tok-variableName2" },
  { tag: _.definition(_.propertyName), class: "tok-propertyName tok-definition" },
  { tag: _.typeName, class: "tok-typeName" },
  { tag: _.namespace, class: "tok-namespace" },
  { tag: _.className, class: "tok-className" },
  { tag: _.macroName, class: "tok-macroName" },
  { tag: _.propertyName, class: "tok-propertyName" },
  { tag: _.operator, class: "tok-operator" },
  { tag: _.comment, class: "tok-comment" },
  { tag: _.meta, class: "tok-meta" },
  { tag: _.invalid, class: "tok-invalid" },
  { tag: _.punctuation, class: "tok-punctuation" }
]), Mx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Tag: hi,
  classHighlighter: zx,
  getStyleTags: Rg,
  highlightCode: Ax,
  highlightTree: pf,
  styleTags: kl,
  tagHighlighter: df,
  tags: _
}, Symbol.toStringTag, { value: "Module" }));
var lh;
const Un = /* @__PURE__ */ new Re();
function xl(n) {
  return se.define({
    combine: n ? (e) => e.concat(n) : void 0
  });
}
const wl = /* @__PURE__ */ new Re();
class jt {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, t, i = [], r = "") {
    this.data = e, this.name = r, We.prototype.hasOwnProperty("tree") || Object.defineProperty(We.prototype, "tree", { get() {
      return pt(this);
    } }), this.parser = t, this.extension = [
      Xn.of(this),
      We.languageData.of((s, o, a) => {
        let l = lO(s, o, a), h = l.type.prop(Un);
        if (!h)
          return [];
        let c = s.facet(h), f = l.type.prop(wl);
        if (f) {
          let O = l.resolve(o - l.from, a);
          for (let d of f)
            if (d.test(O, s)) {
              let p = s.facet(d.facet);
              return d.type == "replace" ? p : p.concat(c);
            }
        }
        return c;
      })
    ].concat(i);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, t, i = -1) {
    return lO(e, t, i).type.prop(Un) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let t = e.facet(Xn);
    if ((t == null ? void 0 : t.data) == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!t || !t.allowsNesting)
      return [];
    let i = [], r = (s, o) => {
      if (s.prop(Un) == this.data) {
        i.push({ from: o, to: o + s.length });
        return;
      }
      let a = s.prop(Re.mounted);
      if (a) {
        if (a.tree.prop(Un) == this.data) {
          if (a.overlay)
            for (let l of a.overlay)
              i.push({ from: l.from + o, to: l.to + o });
          else
            i.push({ from: o, to: o + s.length });
          return;
        } else if (a.overlay) {
          let l = i.length;
          if (r(a.tree, a.overlay[0].from + o), i.length > l)
            return;
        }
      }
      for (let l = 0; l < s.children.length; l++) {
        let h = s.children[l];
        h instanceof Ue && r(h, s.positions[l] + o);
      }
    };
    return r(pt(e), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
jt.setState = /* @__PURE__ */ qe.define();
function lO(n, e, t) {
  let i = n.facet(Xn), r = pt(n).topNode;
  if (!i || i.allowsNesting)
    for (let s = r; s; s = s.enter(e, t, it.ExcludeBuffers | it.EnterBracketed))
      s.type.isTop && (r = s);
  return r;
}
class vs extends jt {
  constructor(e, t, i) {
    super(e, t, [], i), this.parser = t;
  }
  /**
  Define a language from a parser.
  */
  static define(e) {
    let t = xl(e.languageData);
    return new vs(t, e.parser.configure({
      props: [Un.add((i) => i.isTop ? t : void 0)]
    }), e.name);
  }
  /**
  Create a new instance of this language with a reconfigured
  version of its parser and optionally a new name.
  */
  configure(e, t) {
    return new vs(this.data, this.parser.configure(e), t || this.name);
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function pt(n) {
  let e = n.field(jt.state, !1);
  return e ? e.tree : Ue.empty;
}
function Xg(n, e, t = 50) {
  var i;
  let r = (i = n.field(jt.state, !1)) === null || i === void 0 ? void 0 : i.context;
  if (!r)
    return null;
  let s = r.viewport;
  r.updateViewport({ from: 0, to: e });
  let o = r.isDone(e) || r.work(t, e) ? r.tree : null;
  return r.updateViewport(s), o;
}
function Wx(n, e = n.doc.length) {
  var t;
  return ((t = n.field(jt.state, !1)) === null || t === void 0 ? void 0 : t.context.isDone(e)) || !1;
}
function Ex(n, e = n.viewport.to, t = 100) {
  let i = Xg(n.state, e, t);
  return i != pt(n.state) && n.dispatch({}), !!i;
}
function jx(n) {
  var e;
  return ((e = n.plugin(qg)) === null || e === void 0 ? void 0 : e.isWorking()) || !1;
}
class Cg {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, t) {
    let i = this.cursorPos - this.string.length;
    return e < i || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - i, t - i);
  }
}
let zs = null;
class qr {
  constructor(e, t, i = [], r, s, o, a, l) {
    this.parser = e, this.state = t, this.fragments = i, this.tree = r, this.treeLen = s, this.viewport = o, this.skipped = a, this.scheduleOn = l, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new qr(e, t, [], Ue.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new Cg(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, t) {
    return t != null && t >= this.state.doc.length && (t = void 0), this.tree != Ue.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof e == "number") {
        let r = Date.now() + e;
        e = () => Date.now() > r;
      }
      for (this.parse || (this.parse = this.startParse()), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t); ; ) {
        let r = this.parse.advance();
        if (r)
          if (this.fragments = this.withoutTempSkipped(xr.addTree(r, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = r, this.parse = null, this.treeLen < (t ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, t;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(t = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(xr.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let t = zs;
    zs = this;
    try {
      return e();
    } finally {
      zs = t;
    }
  }
  withoutTempSkipped(e) {
    for (let t; t = this.tempSkipped.pop(); )
      e = hO(e, t.from, t.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, t) {
    let { fragments: i, tree: r, treeLen: s, viewport: o, skipped: a } = this;
    if (this.takeTree(), !e.empty) {
      let l = [];
      if (e.iterChangedRanges((h, c, f, O) => l.push({ fromA: h, toA: c, fromB: f, toB: O })), i = xr.applyChanges(i, l), r = Ue.empty, s = 0, o = { from: e.mapPos(o.from, -1), to: e.mapPos(o.to, 1) }, this.skipped.length) {
        a = [];
        for (let h of this.skipped) {
          let c = e.mapPos(h.from, 1), f = e.mapPos(h.to, -1);
          c < f && a.push({ from: c, to: f });
        }
      }
    }
    return new qr(this.parser, t, i, r, s, o, a, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let t = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: r, to: s } = this.skipped[i];
      r < e.to && s > e.from && (this.fragments = hO(this.fragments, r, s), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= t ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, t) {
    this.skipped.push({ from: e, to: t });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends Of {
      createParse(t, i, r) {
        let s = r[0].from, o = r[r.length - 1].to;
        return {
          parsedPos: s,
          advance() {
            let l = zs;
            if (l) {
              for (let h of r)
                l.tempSkipped.push(h);
              e && (l.scheduleOn = l.scheduleOn ? Promise.all([l.scheduleOn, e]) : e);
            }
            return this.parsedPos = o, new Ue(Gt.none, [], [], o - s);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let t = this.fragments;
    return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return zs;
  }
}
function hO(n, e, t) {
  return xr.applyChanges(n, [{ fromA: e, toA: t, fromB: e, toB: t }]);
}
class Qs {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let t = this.context.changes(e.changes, e.state), i = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
    return t.work(20, i) || t.takeTree(), new Qs(t);
  }
  static init(e) {
    let t = Math.min(3e3, e.doc.length), i = qr.create(e.facet(Xn).parser, e, { from: 0, to: t });
    return i.work(20, t) || i.takeTree(), new Qs(i);
  }
}
jt.state = /* @__PURE__ */ ui.define({
  create: Qs.init,
  update(n, e) {
    for (let t of e.effects)
      if (t.is(jt.setState))
        return t.value;
    return e.startState.facet(Xn) != e.state.facet(Xn) ? Qs.init(e.state) : n.apply(e);
  }
});
let Ag = (n) => {
  let e = setTimeout(
    () => n(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (Ag = (n) => {
  let e = -1, t = setTimeout(
    () => {
      e = requestIdleCallback(n, {
        timeout: 400
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(t) : cancelIdleCallback(e);
});
const hh = typeof navigator < "u" && (!((lh = navigator.scheduling) === null || lh === void 0) && lh.isInputPending) ? () => navigator.scheduling.isInputPending() : null, qg = /* @__PURE__ */ ot.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let t = this.view.state.field(jt.state).context;
    (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, t = e.field(jt.state);
    (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = Ag(this.work));
  }
  work(e) {
    this.working = null;
    let t = Date.now();
    if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: r } } = this.view, s = i.field(jt.state);
    if (s.tree == s.context.tree && s.context.isDone(
      r + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let o = Date.now() + Math.min(this.chunkBudget, 100, e && !hh ? Math.max(25, e.timeRemaining() - 5) : 1e9), a = s.context.treeLen < r && i.doc.length > r + 1e3, l = s.context.work(() => hh && hh() || Date.now() > o, r + (a ? 0 : 1e5));
    this.chunkBudget -= Date.now() - t, (l || this.chunkBudget <= 0) && (s.context.takeTree(), this.view.dispatch({ effects: jt.setState.of(new Qs(s.context)) })), this.chunkBudget > 0 && !(l && !a) && this.scheduleWork(), this.checkAsyncSchedule(s.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((t) => Si(this.view.state, t)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), Xn = /* @__PURE__ */ se.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    jt.state,
    qg,
    ce.contentAttributes.compute([n], (e) => {
      let t = e.facet(n);
      return t && t.name ? { "data-language": t.name } : {};
    })
  ]
});
class gf {
  /**
  Create a language support object.
  */
  constructor(e, t = []) {
    this.language = e, this.support = t, this.extension = [e, t];
  }
}
class mf {
  constructor(e, t, i, r, s, o = void 0) {
    this.name = e, this.alias = t, this.extensions = i, this.filename = r, this.loadFunc = s, this.support = o, this.loading = null;
  }
  /**
  Start loading the the language. Will return a promise that
  resolves to a [`LanguageSupport`](https://codemirror.net/6/docs/ref/#language.LanguageSupport)
  object when the language successfully loads.
  */
  load() {
    return this.loading || (this.loading = this.loadFunc().then((e) => this.support = e, (e) => {
      throw this.loading = null, e;
    }));
  }
  /**
  Create a language description.
  */
  static of(e) {
    let { load: t, support: i } = e;
    if (!t) {
      if (!i)
        throw new RangeError("Must pass either 'load' or 'support' to LanguageDescription.of");
      t = () => Promise.resolve(i);
    }
    return new mf(e.name, (e.alias || []).concat(e.name).map((r) => r.toLowerCase()), e.extensions || [], e.filename, t, i);
  }
  /**
  Look for a language in the given array of descriptions that
  matches the filename. Will first match
  [`filename`](https://codemirror.net/6/docs/ref/#language.LanguageDescription.filename) patterns,
  and then [extensions](https://codemirror.net/6/docs/ref/#language.LanguageDescription.extensions),
  and return the first language that matches.
  */
  static matchFilename(e, t) {
    for (let r of e)
      if (r.filename && r.filename.test(t))
        return r;
    let i = /\.([^.]+)$/.exec(t);
    if (i) {
      for (let r of e)
        if (r.extensions.indexOf(i[1]) > -1)
          return r;
    }
    return null;
  }
  /**
  Look for a language whose name or alias matches the the given
  name (case-insensitively). If `fuzzy` is true, and no direct
  matchs is found, this'll also search for a language whose name
  or alias occurs in the string (for names shorter than three
  characters, only when surrounded by non-word characters).
  */
  static matchLanguageName(e, t, i = !0) {
    t = t.toLowerCase();
    for (let r of e)
      if (r.alias.some((s) => s == t))
        return r;
    if (i)
      for (let r of e)
        for (let s of r.alias) {
          let o = t.indexOf(s);
          if (o > -1 && (s.length > 2 || !/\w/.test(t[o - 1]) && !/\w/.test(t[o + s.length])))
            return r;
        }
    return null;
  }
}
const zg = /* @__PURE__ */ se.define(), Pl = /* @__PURE__ */ se.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let e = n[0];
    if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return e;
  }
});
function ko(n) {
  let e = n.facet(Pl);
  return e.charCodeAt(0) == 9 ? n.tabSize * e.length : e.length;
}
function vf(n, e) {
  let t = "", i = n.tabSize, r = n.facet(Pl)[0];
  if (r == "	") {
    for (; e >= i; )
      t += "	", e -= i;
    r = " ";
  }
  for (let s = 0; s < e; s++)
    t += r;
  return t;
}
function Qf(n, e) {
  n instanceof We && (n = new _l(n));
  for (let i of n.state.facet(zg)) {
    let r = i(n, e);
    if (r !== void 0)
      return r;
  }
  let t = pt(n.state);
  return t.length >= e ? Yx(n, t, e) : null;
}
function Vx(n, e, t) {
  let i = /* @__PURE__ */ Object.create(null), r = new _l(n, { overrideIndentation: (o) => {
    var a;
    return (a = i[o]) !== null && a !== void 0 ? a : -1;
  } }), s = [];
  for (let o = e; o <= t; ) {
    let a = n.doc.lineAt(o);
    o = a.to + 1;
    let l = Qf(r, a.from);
    if (l == null)
      continue;
    /\S/.test(a.text) || (l = 0);
    let h = /^\s*/.exec(a.text)[0], c = vf(n, l);
    h != c && (i[a.from] = l, s.push({ from: a.from, to: a.from + h.length, insert: c }));
  }
  return n.changes(s);
}
class _l {
  /**
  Create an indent context.
  */
  constructor(e, t = {}) {
    this.state = e, this.options = t, this.unit = ko(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, t = 1) {
    let i = this.state.doc.lineAt(e), { simulateBreak: r, simulateDoubleBreak: s } = this.options;
    return r != null && r >= i.from && r <= i.to ? s && r == e ? { text: "", from: e } : (t < 0 ? r < e : r <= e) ? { text: i.text.slice(r - i.from), from: r } : { text: i.text.slice(0, r - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, t = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: i, from: r } = this.lineAt(e, t);
    return i.slice(e - r, Math.min(i.length, e + 100 - r));
  }
  /**
  Find the column for the given position.
  */
  column(e, t = 1) {
    let { text: i, from: r } = this.lineAt(e, t), s = this.countColumn(i, e - r), o = this.options.overrideIndentation ? this.options.overrideIndentation(r) : -1;
    return o > -1 && (s += o - this.countColumn(i, i.search(/\S|$/))), s;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, t = e.length) {
    return ul(e, this.state.tabSize, t);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, t = 1) {
    let { text: i, from: r } = this.lineAt(e, t), s = this.options.overrideIndentation;
    if (s) {
      let o = s(r);
      if (o > -1)
        return o;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Vo = /* @__PURE__ */ new Re();
function Yx(n, e, t) {
  let i = e.resolveStack(t), r = e.resolveInner(t, -1).resolve(t, 0).enterUnfinishedNodesBefore(t);
  if (r != i.node) {
    let s = [];
    for (let o = r; o && !(o.from < i.node.from || o.to > i.node.to || o.from == i.node.from && o.type == i.node.type); o = o.parent)
      s.push(o);
    for (let o = s.length - 1; o >= 0; o--)
      i = { node: s[o], next: i };
  }
  return Mg(i, n, t);
}
function Mg(n, e, t) {
  for (let i = n; i; i = i.next) {
    let r = Dx(i.node);
    if (r)
      return r(Tl.create(e, t, i));
  }
  return 0;
}
function Lx(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function Dx(n) {
  let e = n.type.prop(Vo);
  if (e)
    return e;
  let t = n.firstChild, i;
  if (t && (i = t.type.prop(Re.closedBy))) {
    let r = n.lastChild, s = r && i.indexOf(r.name) > -1;
    return (o) => Wg(o, !0, 1, void 0, s && !Lx(o) ? r.from : void 0);
  }
  return n.parent == null ? Gx : null;
}
function Gx() {
  return 0;
}
class Tl extends _l {
  constructor(e, t, i) {
    super(e.state, e.options), this.base = e, this.pos = t, this.context = i;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Tl(e, t, i);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let t = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let i = e.resolve(t.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if (Ix(i, e))
        break;
      t = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(t.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return Mg(this.context.next, this.base, this.pos);
  }
}
function Ix(n, e) {
  for (let t = e; t; t = t.parent)
    if (n == t)
      return !0;
  return !1;
}
function Ux(n) {
  let e = n.node, t = e.childAfter(e.from), i = e.lastChild;
  if (!t)
    return null;
  let r = n.options.simulateBreak, s = n.state.doc.lineAt(t.from), o = r == null || r <= s.from ? s.to : Math.min(s.to, r);
  for (let a = t.to; ; ) {
    let l = e.childAfter(a);
    if (!l || l == i)
      return null;
    if (!l.type.isSkipped) {
      if (l.from >= o)
        return null;
      let h = /^ */.exec(s.text.slice(t.to - s.from))[0].length;
      return { from: t.from, to: t.to + h };
    }
    a = l.to;
  }
}
function lo({ closing: n, align: e = !0, units: t = 1 }) {
  return (i) => Wg(i, e, t, n);
}
function Wg(n, e, t, i, r) {
  let s = n.textAfter, o = s.match(/^\s*/)[0].length, a = i && s.slice(o, o + i.length) == i || r == n.pos + o, l = e ? Ux(n) : null;
  return l ? a ? n.column(l.from) : n.column(l.to) : n.baseIndent + (a ? 0 : n.unit * t);
}
const Eg = (n) => n.baseIndent;
function $a({ except: n, units: e = 1 } = {}) {
  return (t) => {
    let i = n && n.test(t.textAfter);
    return t.baseIndent + (i ? 0 : e * t.unit);
  };
}
const Nx = 200;
function Bx() {
  return We.transactionFilter.of((n) => {
    if (!n.docChanged || !n.isUserEvent("input.type") && !n.isUserEvent("input.complete"))
      return n;
    let e = n.startState.languageDataAt("indentOnInput", n.startState.selection.main.head);
    if (!e.length)
      return n;
    let t = n.newDoc, { head: i } = n.newSelection.main, r = t.lineAt(i);
    if (i > r.from + Nx)
      return n;
    let s = t.sliceString(r.from, i);
    if (!e.some((h) => h.test(s)))
      return n;
    let { state: o } = n, a = -1, l = [];
    for (let { head: h } of o.selection.ranges) {
      let c = o.doc.lineAt(h);
      if (c.from == a)
        continue;
      a = c.from;
      let f = Qf(o, c.from);
      if (f == null)
        continue;
      let O = /^\s*/.exec(c.text)[0], d = vf(o, f);
      O != d && l.push({ from: c.from, to: c.from + O.length, insert: d });
    }
    return l.length ? [n, { changes: l, sequential: !0 }] : n;
  });
}
const jg = /* @__PURE__ */ se.define(), $l = /* @__PURE__ */ new Re();
function bf(n) {
  let e = n.firstChild, t = n.lastChild;
  return e && e.to < t.from ? { from: e.to, to: t.type.isError ? n.to : t.from } : null;
}
function Fx(n, e, t) {
  let i = pt(n);
  if (i.length < t)
    return null;
  let r = i.resolveStack(t, 1), s = null;
  for (let o = r; o; o = o.next) {
    let a = o.node;
    if (a.to <= t || a.from > t)
      continue;
    if (s && a.from < e)
      break;
    let l = a.type.prop($l);
    if (l && (a.to < i.length - 50 || i.length == n.doc.length || !Hx(a))) {
      let h = l(a, n);
      h && h.from <= t && h.from >= e && h.to > t && (s = h);
    }
  }
  return s;
}
function Hx(n) {
  let e = n.lastChild;
  return e && e.to == n.to && e.type.isError;
}
function bs(n, e, t) {
  for (let i of n.facet(jg)) {
    let r = i(n, e, t);
    if (r)
      return r;
  }
  return Fx(n, e, t);
}
function Vg(n, e) {
  let t = e.mapPos(n.from, 1), i = e.mapPos(n.to, -1);
  return t >= i ? void 0 : { from: t, to: i };
}
const ws = /* @__PURE__ */ qe.define({ map: Vg }), Wr = /* @__PURE__ */ qe.define({ map: Vg });
function Sf(n) {
  let e = [];
  for (let { head: t } of n.state.selection.ranges)
    e.some((i) => i.from <= t && i.to >= t) || e.push(n.lineBlockAt(t));
  return e;
}
const Cn = /* @__PURE__ */ ui.define({
  create() {
    return pe.none;
  },
  update(n, e) {
    e.isUserEvent("delete") && e.changes.iterChangedRanges((i, r) => n = cO(n, i, r)), n = n.map(e.changes);
    let t = [];
    for (let i of e.effects)
      i.is(ws) && !Kx(n, i.value.from, i.value.to) ? t.push(i.value) : i.is(Wr) && (n = n.update({
        filter: (r, s) => i.value.from != r || i.value.to != s,
        filterFrom: i.value.from,
        filterTo: i.value.to
      }));
    if (t.length) {
      let { preparePlaceholder: i } = e.state.facet(kf), r = t.map((s) => (i ? pe.replace({ widget: new rw(i(e.state, s)) }) : fO).range(s.from, s.to));
      n = n.update({ add: r });
    }
    return e.selection && (n = cO(n, e.selection.main.head)), n;
  },
  provide: (n) => ce.decorations.from(n),
  toJSON(n, e) {
    let t = [];
    return n.between(0, e.doc.length, (i, r) => {
      t.push(i, r);
    }), t;
  },
  fromJSON(n) {
    if (!Array.isArray(n) || n.length % 2)
      throw new RangeError("Invalid JSON for fold state");
    let e = [];
    for (let t = 0; t < n.length; ) {
      let i = n[t++], r = n[t++];
      if (typeof i != "number" || typeof r != "number")
        throw new RangeError("Invalid JSON for fold state");
      e.push(fO.range(i, r));
    }
    return pe.set(e, !0);
  }
});
function cO(n, e, t = e) {
  let i = !1;
  return n.between(e, t, (r, s) => {
    r < t && s > e && (i = !0);
  }), i ? n.update({
    filterFrom: e,
    filterTo: t,
    filter: (r, s) => r >= t || s <= e
  }) : n;
}
function Jx(n) {
  return n.field(Cn, !1) || Pe.empty;
}
function xo(n, e, t) {
  var i;
  let r = null;
  return (i = n.field(Cn, !1)) === null || i === void 0 || i.between(e, t, (s, o) => {
    (!r || r.from > s) && (r = { from: s, to: o });
  }), r;
}
function Kx(n, e, t) {
  let i = !1;
  return n.between(e, e, (r, s) => {
    r == e && s == t && (i = !0);
  }), i;
}
function yf(n, e) {
  return n.field(Cn, !1) ? e : e.concat(qe.appendConfig.of(xf()));
}
const Yg = (n) => {
  for (let e of Sf(n)) {
    let t = bs(n.state, e.from, e.to);
    if (t)
      return n.dispatch({ effects: yf(n.state, [ws.of(t), tl(n, t)]) }), !0;
  }
  return !1;
}, Lg = (n) => {
  if (!n.state.field(Cn, !1))
    return !1;
  let e = [];
  for (let t of Sf(n)) {
    let i = xo(n.state, t.from, t.to);
    i && e.push(Wr.of(i), tl(n, i, !1));
  }
  return e.length && n.dispatch({ effects: e }), e.length > 0;
};
function tl(n, e, t = !0) {
  let i = n.state.doc.lineAt(e.from).number, r = n.state.doc.lineAt(e.to).number;
  return ce.announce.of(`${n.state.phrase(t ? "Folded lines" : "Unfolded lines")} ${i} ${n.state.phrase("to")} ${r}.`);
}
const Dg = (n) => {
  let { state: e } = n, t = [];
  for (let i = 0; i < e.doc.length; ) {
    let r = n.lineBlockAt(i), s = bs(e, r.from, r.to);
    s && t.push(ws.of(s)), i = (s ? n.lineBlockAt(s.to) : r).to + 1;
  }
  return t.length && n.dispatch({ effects: yf(n.state, t) }), !!t.length;
}, Gg = (n) => {
  let e = n.state.field(Cn, !1);
  if (!e || !e.size)
    return !1;
  let t = [];
  return e.between(0, n.state.doc.length, (i, r) => {
    t.push(Wr.of({ from: i, to: r }));
  }), n.dispatch({ effects: t }), !0;
};
function ew(n, e) {
  for (let t = e; ; ) {
    let i = bs(n.state, t.from, t.to);
    if (i && i.to > e.from)
      return i;
    if (!t.from)
      return null;
    t = n.lineBlockAt(t.from - 1);
  }
}
const tw = (n) => {
  let e = [];
  for (let t of Sf(n)) {
    let i = xo(n.state, t.from, t.to);
    if (i)
      e.push(Wr.of(i), tl(n, i, !1));
    else {
      let r = ew(n, t);
      r && e.push(ws.of(r), tl(n, r));
    }
  }
  return e.length > 0 && n.dispatch({ effects: yf(n.state, e) }), !!e.length;
}, iw = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: Yg },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: Lg },
  { key: "Ctrl-Alt-[", run: Dg },
  { key: "Ctrl-Alt-]", run: Gg }
], nw = {
  placeholderDOM: null,
  preparePlaceholder: null,
  placeholderText: "…"
}, kf = /* @__PURE__ */ se.define({
  combine(n) {
    return xs(n, nw);
  }
});
function xf(n) {
  let e = [Cn, aw];
  return n && e.push(kf.of(n)), e;
}
function Ig(n, e) {
  let { state: t } = n, i = t.facet(kf), r = (o) => {
    let a = n.lineBlockAt(n.posAtDOM(o.target)), l = xo(n.state, a.from, a.to);
    l && n.dispatch({ effects: Wr.of(l) }), o.preventDefault();
  };
  if (i.placeholderDOM)
    return i.placeholderDOM(n, r, e);
  let s = document.createElement("span");
  return s.textContent = i.placeholderText, s.setAttribute("aria-label", t.phrase("folded code")), s.title = t.phrase("unfold"), s.className = "cm-foldPlaceholder", s.onclick = r, s;
}
const fO = /* @__PURE__ */ pe.replace({ widget: /* @__PURE__ */ new class extends qi {
  toDOM(n) {
    return Ig(n, null);
  }
}() });
class rw extends qi {
  constructor(e) {
    super(), this.value = e;
  }
  eq(e) {
    return this.value == e.value;
  }
  toDOM(e) {
    return Ig(e, this.value);
  }
}
const sw = {
  openText: "⌄",
  closedText: "›",
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => !1
};
class ch extends rn {
  constructor(e, t) {
    super(), this.config = e, this.open = t;
  }
  eq(e) {
    return this.config == e.config && this.open == e.open;
  }
  toDOM(e) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let t = document.createElement("span");
    return t.textContent = this.open ? this.config.openText : this.config.closedText, t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line"), t;
  }
}
function ow(n = {}) {
  let e = { ...sw, ...n }, t = new ch(e, !0), i = new ch(e, !1), r = ot.fromClass(class {
    constructor(o) {
      this.from = o.viewport.from, this.markers = this.buildMarkers(o);
    }
    update(o) {
      (o.docChanged || o.viewportChanged || o.startState.facet(Xn) != o.state.facet(Xn) || o.startState.field(Cn, !1) != o.state.field(Cn, !1) || pt(o.startState) != pt(o.state) || e.foldingChanged(o)) && (this.markers = this.buildMarkers(o.view));
    }
    buildMarkers(o) {
      let a = new Zn();
      for (let l of o.viewportLineBlocks) {
        let h = xo(o.state, l.from, l.to) ? i : bs(o.state, l.from, l.to) ? t : null;
        h && a.add(l.from, l.from, h);
      }
      return a.finish();
    }
  }), { domEventHandlers: s } = e;
  return [
    r,
    bg({
      class: "cm-foldGutter",
      markers(o) {
        var a;
        return ((a = o.plugin(r)) === null || a === void 0 ? void 0 : a.markers) || Pe.empty;
      },
      initialSpacer() {
        return new ch(e, !1);
      },
      domEventHandlers: {
        ...s,
        click: (o, a, l) => {
          if (s.click && s.click(o, a, l))
            return !0;
          let h = xo(o.state, a.from, a.to);
          if (h)
            return o.dispatch({ effects: Wr.of(h) }), !0;
          let c = bs(o.state, a.from, a.to);
          return c ? (o.dispatch({ effects: ws.of(c) }), !0) : !1;
        }
      }
    }),
    xf()
  ];
}
const aw = /* @__PURE__ */ ce.baseTheme({
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    color: "#888",
    borderRadius: ".2em",
    margin: "0 1px",
    padding: "0 1px",
    cursor: "pointer"
  },
  ".cm-foldGutter span": {
    padding: "0 1px",
    cursor: "pointer"
  }
});
class Yo {
  constructor(e, t) {
    this.specs = e;
    let i;
    function r(a) {
      let l = tr.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + l] = a, l;
    }
    const s = typeof t.all == "string" ? t.all : t.all ? r(t.all) : void 0, o = t.scope;
    this.scope = o instanceof jt ? (a) => a.prop(Un) == o.data : o ? (a) => a == o : void 0, this.style = df(e.map((a) => ({
      tag: a.tag,
      class: a.class || r(Object.assign({}, a, { tag: null }))
    })), {
      all: s
    }).style, this.module = i ? new tr(i) : null, this.themeType = t.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://code.haverbeke.berlin/marijn/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, t) {
    return new Yo(e, t || {});
  }
}
const kc = /* @__PURE__ */ se.define(), Ug = /* @__PURE__ */ se.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function Za(n) {
  let e = n.facet(kc);
  return e.length ? e : n.facet(Ug);
}
function lw(n, e) {
  let t = [fw], i;
  return n instanceof Yo && (n.module && t.push(ce.styleModule.of(n.module)), i = n.themeType), e != null && e.fallback ? t.push(Ug.of(n)) : i ? t.push(kc.computeN([ce.darkTheme], (r) => r.facet(ce.darkTheme) == (i == "dark") ? [n] : [])) : t.push(kc.of(n)), t;
}
function hw(n, e, t) {
  let i = Za(n), r = null;
  if (i) {
    for (let s of i)
      if (!s.scope || t && s.scope(t)) {
        let o = s.style(e);
        o && (r = r ? r + " " + o : o);
      }
  }
  return r;
}
class cw {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = pt(e.state), this.decorations = this.buildDeco(e, Za(e.state)), this.decoratedTo = e.viewport.to;
  }
  update(e) {
    let t = pt(e.state), i = Za(e.state), r = i != Za(e.startState), { viewport: s } = e.view, o = e.changes.mapPos(this.decoratedTo, 1);
    t.length < s.to && !r && t.type == this.tree.type && o >= s.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = o) : (t != this.tree || e.viewportChanged || r) && (this.tree = t, this.decorations = this.buildDeco(e.view, i), this.decoratedTo = s.to);
  }
  buildDeco(e, t) {
    if (!t || !this.tree.length)
      return pe.none;
    let i = new Zn();
    for (let { from: r, to: s } of e.visibleRanges)
      pf(this.tree, t, (o, a, l) => {
        i.add(o, a, this.markCache[l] || (this.markCache[l] = pe.mark({ class: l })));
      }, r, s);
    return i.finish();
  }
}
const fw = /* @__PURE__ */ Mr.high(/* @__PURE__ */ ot.fromClass(cw, {
  decorations: (n) => n.decorations
})), uw = /* @__PURE__ */ Yo.define([
  {
    tag: _.meta,
    color: "#404740"
  },
  {
    tag: _.link,
    textDecoration: "underline"
  },
  {
    tag: _.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: _.emphasis,
    fontStyle: "italic"
  },
  {
    tag: _.strong,
    fontWeight: "bold"
  },
  {
    tag: _.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: _.keyword,
    color: "#708"
  },
  {
    tag: [_.atom, _.bool, _.url, _.contentSeparator, _.labelName],
    color: "#219"
  },
  {
    tag: [_.literal, _.inserted],
    color: "#164"
  },
  {
    tag: [_.string, _.deleted],
    color: "#a11"
  },
  {
    tag: [_.regexp, _.escape, /* @__PURE__ */ _.special(_.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ _.definition(_.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ _.local(_.variableName),
    color: "#30a"
  },
  {
    tag: [_.typeName, _.namespace],
    color: "#085"
  },
  {
    tag: _.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ _.special(_.variableName), _.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ _.definition(_.propertyName),
    color: "#00c"
  },
  {
    tag: _.comment,
    color: "#940"
  },
  {
    tag: _.invalid,
    color: "#f00"
  }
]), Ow = /* @__PURE__ */ ce.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), Ng = 1e4, Bg = "()[]{}", Fg = /* @__PURE__ */ se.define({
  combine(n) {
    return xs(n, {
      afterCursor: !0,
      brackets: Bg,
      maxScanDistance: Ng,
      renderMatch: gw
    });
  }
}), dw = /* @__PURE__ */ pe.mark({ class: "cm-matchingBracket" }), pw = /* @__PURE__ */ pe.mark({ class: "cm-nonmatchingBracket" });
function gw(n) {
  let e = [], t = n.matched ? dw : pw;
  return e.push(t.range(n.start.from, n.start.to)), n.end && e.push(t.range(n.end.from, n.end.to)), e;
}
function uO(n) {
  let e = [], t = n.facet(Fg);
  for (let i of n.selection.ranges) {
    if (!i.empty)
      continue;
    let r = Is(n, i.head, -1, t) || i.head > 0 && Is(n, i.head - 1, 1, t) || t.afterCursor && (Is(n, i.head, 1, t) || i.head < n.doc.length && Is(n, i.head + 1, -1, t));
    r && (e = e.concat(t.renderMatch(r, n)));
  }
  return pe.set(e, !0);
}
const mw = /* @__PURE__ */ ot.fromClass(class {
  constructor(n) {
    this.paused = !1, this.decorations = uO(n.state);
  }
  update(n) {
    (n.docChanged || n.selectionSet || this.paused) && (n.view.composing ? (this.decorations = this.decorations.map(n.changes), this.paused = !0) : (this.decorations = uO(n.state), this.paused = !1));
  }
}, {
  decorations: (n) => n.decorations
}), vw = [
  mw,
  Ow
];
function Qw(n = {}) {
  return [Fg.of(n), vw];
}
const Hg = /* @__PURE__ */ new Re();
function xc(n, e, t) {
  let i = n.prop(e < 0 ? Re.openedBy : Re.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let r = t.indexOf(n.name);
    if (r > -1 && r % 2 == (e < 0 ? 1 : 0))
      return [t[r + e]];
  }
  return null;
}
function wc(n) {
  let e = n.type.prop(Hg);
  return e ? e(n.node) : n;
}
function Is(n, e, t, i = {}) {
  let r = i.maxScanDistance || Ng, s = i.brackets || Bg, o = pt(n), a = o.resolveInner(e, t);
  for (let l = a; l; l = l.parent) {
    let h = xc(l.type, t, s);
    if (h && l.from < l.to) {
      let c = wc(l);
      if (c && (t > 0 ? e >= c.from && e < c.to : e > c.from && e <= c.to))
        return bw(n, e, t, l, c, h, s);
    }
  }
  return Sw(n, e, t, o, a.type, r, s);
}
function bw(n, e, t, i, r, s, o) {
  let a = i.parent, l = { from: r.from, to: r.to }, h = 0, c = a == null ? void 0 : a.cursor();
  if (c && (t < 0 ? c.childBefore(i.from) : c.childAfter(i.to)))
    do
      if (t < 0 ? c.to <= i.from : c.from >= i.to) {
        if (h == 0 && s.indexOf(c.type.name) > -1 && c.from < c.to) {
          let f = wc(c);
          return { start: l, end: f ? { from: f.from, to: f.to } : void 0, matched: !0 };
        } else if (xc(c.type, t, o))
          h++;
        else if (xc(c.type, -t, o)) {
          if (h == 0) {
            let f = wc(c);
            return {
              start: l,
              end: f && f.from < f.to ? { from: f.from, to: f.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (t < 0 ? c.prevSibling() : c.nextSibling());
  return { start: l, matched: !1 };
}
function Sw(n, e, t, i, r, s, o) {
  if (t < 0 ? !e : e == n.doc.length)
    return null;
  let a = t < 0 ? n.sliceDoc(e - 1, e) : n.sliceDoc(e, e + 1), l = o.indexOf(a);
  if (l < 0 || l % 2 == 0 != t > 0)
    return null;
  let h = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e }, c = n.doc.iterRange(e, t > 0 ? n.doc.length : 0), f = 0;
  for (let O = 0; !c.next().done && O <= s; ) {
    let d = c.value;
    t < 0 && (O += d.length);
    let p = e + O * t;
    for (let g = t > 0 ? 0 : d.length - 1, m = t > 0 ? d.length : -1; g != m; g += t) {
      let v = o.indexOf(d[g]);
      if (!(v < 0 || i.resolveInner(p + g, 1).type != r))
        if (v % 2 == 0 == t > 0)
          f++;
        else {
          if (f == 1)
            return { start: h, end: { from: p + g, to: p + g + 1 }, matched: v >> 1 == l >> 1 };
          f--;
        }
    }
    t > 0 && (O += d.length);
  }
  return c.done ? { start: h, matched: !1 } : null;
}
function OO(n, e, t, i = 0, r = 0) {
  e == null && (e = n.search(/[^\s\u00a0]/), e == -1 && (e = n.length));
  let s = r;
  for (let o = i; o < e; o++)
    n.charCodeAt(o) == 9 ? s += t - s % t : s++;
  return s;
}
class wf {
  /**
  Create a stream.
  */
  constructor(e, t, i, r) {
    this.string = e, this.tabSize = t, this.indentUnit = i, this.overrideIndent = r, this.pos = 0, this.start = 0, this.lastColumnPos = 0, this.lastColumnValue = 0;
  }
  /**
  True if we are at the end of the line.
  */
  eol() {
    return this.pos >= this.string.length;
  }
  /**
  True if we are at the start of the line.
  */
  sol() {
    return this.pos == 0;
  }
  /**
  Get the next code unit after the current position, or undefined
  if we're at the end of the line.
  */
  peek() {
    return this.string.charAt(this.pos) || void 0;
  }
  /**
  Read the next code unit and advance `this.pos`.
  */
  next() {
    if (this.pos < this.string.length)
      return this.string.charAt(this.pos++);
  }
  /**
  Match the next character against the given string, regular
  expression, or predicate. Consume and return it if it matches.
  */
  eat(e) {
    let t = this.string.charAt(this.pos), i;
    if (typeof e == "string" ? i = t == e : i = t && (e instanceof RegExp ? e.test(t) : e(t)), i)
      return ++this.pos, t;
  }
  /**
  Continue matching characters that match the given string,
  regular expression, or predicate function. Return true if any
  characters were consumed.
  */
  eatWhile(e) {
    let t = this.pos;
    for (; this.eat(e); )
      ;
    return this.pos > t;
  }
  /**
  Consume whitespace ahead of `this.pos`. Return true if any was
  found.
  */
  eatSpace() {
    let e = this.pos;
    for (; /[\s\u00a0]/.test(this.string.charAt(this.pos)); )
      ++this.pos;
    return this.pos > e;
  }
  /**
  Move to the end of the line.
  */
  skipToEnd() {
    this.pos = this.string.length;
  }
  /**
  Move to directly before the given character, if found on the
  current line.
  */
  skipTo(e) {
    let t = this.string.indexOf(e, this.pos);
    if (t > -1)
      return this.pos = t, !0;
  }
  /**
  Move back `n` characters.
  */
  backUp(e) {
    this.pos -= e;
  }
  /**
  Get the column position at `this.pos`.
  */
  column() {
    return this.lastColumnPos < this.start && (this.lastColumnValue = OO(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue;
  }
  /**
  Get the indentation column of the current line.
  */
  indentation() {
    var e;
    return (e = this.overrideIndent) !== null && e !== void 0 ? e : OO(this.string, null, this.tabSize);
  }
  /**
  Match the input against the given string or regular expression
  (which should start with a `^`). Return true or the regexp match
  if it matches.
  
  Unless `consume` is set to `false`, this will move `this.pos`
  past the matched text.
  
  When matching a string `caseInsensitive` can be set to true to
  make the match case-insensitive.
  */
  match(e, t, i) {
    if (typeof e == "string") {
      let r = (o) => i ? o.toLowerCase() : o, s = this.string.substr(this.pos, e.length);
      return r(s) == r(e) ? (t !== !1 && (this.pos += e.length), !0) : null;
    } else {
      let r = this.string.slice(this.pos).match(e);
      return r && r.index > 0 ? null : (r && t !== !1 && (this.pos += r[0].length), r);
    }
  }
  /**
  Get the current token.
  */
  current() {
    return this.string.slice(this.start, this.pos);
  }
}
function yw(n) {
  return {
    name: n.name || "",
    token: n.token,
    blankLine: n.blankLine || (() => {
    }),
    startState: n.startState || (() => !0),
    copyState: n.copyState || kw,
    indent: n.indent || (() => null),
    languageData: n.languageData || {},
    tokenTable: n.tokenTable || Tf,
    mergeTokens: n.mergeTokens !== !1
  };
}
function kw(n) {
  if (typeof n != "object")
    return n;
  let e = {};
  for (let t in n) {
    let i = n[t];
    e[t] = i instanceof Array ? i.slice() : i;
  }
  return e;
}
const dO = /* @__PURE__ */ new WeakMap();
class Pf extends jt {
  constructor(e) {
    let t = xl(e.languageData), i = yw(e), r, s = new class extends Of {
      createParse(o, a, l) {
        return new ww(r, o, a, l);
      }
    }();
    super(t, s, [], e.name), this.topNode = Tw(t, this), r = this, this.streamParser = i, this.stateAfter = new Re({ perNode: !0 }), this.tokenTable = e.tokenTable ? new tm(i.tokenTable) : _w;
  }
  /**
  Define a stream language.
  */
  static define(e) {
    return new Pf(e);
  }
  /**
  @internal
  */
  getIndent(e) {
    let t, { overrideIndentation: i } = e.options;
    i && (t = dO.get(e.state), t != null && t < e.pos - 1e4 && (t = void 0));
    let r = _f(this, e.node.tree, e.node.from, e.node.from, t ?? e.pos), s, o;
    if (r ? (o = r.state, s = r.pos + 1) : (o = this.streamParser.startState(e.unit), s = e.node.from), e.pos - s > 1e4)
      return null;
    for (; s < e.pos; ) {
      let l = e.state.doc.lineAt(s), h = Math.min(e.pos, l.to);
      if (l.length) {
        let c = i ? i(l.from) : -1, f = new wf(l.text, e.state.tabSize, e.unit, c < 0 ? void 0 : c);
        for (; f.pos < h - l.from; )
          Kg(this.streamParser.token, f, o);
      } else
        this.streamParser.blankLine(o, e.unit);
      if (h == e.pos)
        break;
      s = l.to + 1;
    }
    let a = e.lineAt(e.pos);
    return i && t == null && dO.set(e.state, a.from), this.streamParser.indent(o, /^\s*(.*)/.exec(a.text)[1], e);
  }
  get allowsNesting() {
    return !1;
  }
}
function _f(n, e, t, i, r) {
  let s = t >= i && t + e.length <= r && e.prop(n.stateAfter);
  if (s)
    return { state: n.streamParser.copyState(s), pos: t + e.length };
  for (let o = e.children.length - 1; o >= 0; o--) {
    let a = e.children[o], l = t + e.positions[o], h = a instanceof Ue && l < r && _f(n, a, l, i, r);
    if (h)
      return h;
  }
  return null;
}
function Jg(n, e, t, i, r) {
  if (r && t <= 0 && i >= e.length)
    return e;
  !r && t == 0 && e.type == n.topNode && (r = !0);
  for (let s = e.children.length - 1; s >= 0; s--) {
    let o = e.positions[s], a = e.children[s], l;
    if (o < i && a instanceof Ue) {
      if (!(l = Jg(n, a, t - o, i - o, r)))
        break;
      return r ? new Ue(e.type, e.children.slice(0, s).concat(l), e.positions.slice(0, s + 1), o + l.length) : l;
    }
  }
  return null;
}
function xw(n, e, t, i, r) {
  for (let s of e) {
    let o = s.from + (s.openStart ? 25 : 0), a = s.to - (s.openEnd ? 25 : 0), l = o <= t && a > t && _f(n, s.tree, 0 - s.offset, t, a), h;
    if (l && l.pos <= i && (h = Jg(n, s.tree, t + s.offset, l.pos + s.offset, !1)))
      return { state: l.state, tree: h };
  }
  return { state: n.streamParser.startState(r ? ko(r) : 4), tree: Ue.empty };
}
let ww = class {
  constructor(e, t, i, r) {
    this.lang = e, this.input = t, this.fragments = i, this.ranges = r, this.stoppedAt = null, this.chunks = [], this.chunkPos = [], this.chunk = [], this.chunkReused = void 0, this.rangeIndex = 0, this.to = r[r.length - 1].to;
    let s = qr.get(), o = r[0].from, { state: a, tree: l } = xw(e, i, o, this.to, s == null ? void 0 : s.state);
    this.state = a, this.parsedPos = this.chunkStart = o + l.length;
    for (let h = 0; h < l.children.length; h++)
      this.chunks.push(l.children[h]), this.chunkPos.push(l.positions[h]);
    s && this.parsedPos < s.viewport.from - 1e5 && r.some((h) => h.from <= s.viewport.from && h.to >= s.viewport.from) && (this.state = this.lang.streamParser.startState(ko(s.state)), s.skipUntilInView(this.parsedPos, s.viewport.from), this.parsedPos = s.viewport.from), this.moveRangeIndex();
  }
  advance() {
    let e = qr.get(), t = this.stoppedAt == null ? this.to : Math.min(this.to, this.stoppedAt), i = Math.min(
      t,
      this.chunkStart + 512
      /* C.ChunkSize */
    );
    for (e && (i = Math.min(i, e.viewport.to)); this.parsedPos < i; )
      this.parseLine(e);
    return this.chunkStart < this.parsedPos && this.finishChunk(), this.parsedPos >= t ? this.finish() : e && this.parsedPos >= e.viewport.to ? (e.skipUntilInView(this.parsedPos, t), this.finish()) : null;
  }
  stopAt(e) {
    this.stoppedAt = e;
  }
  lineAfter(e) {
    let t = this.input.chunk(e);
    if (this.input.lineChunks)
      t == `
` && (t = "");
    else {
      let i = t.indexOf(`
`);
      i > -1 && (t = t.slice(0, i));
    }
    return e + t.length <= this.to ? t : t.slice(0, this.to - e);
  }
  nextLine() {
    let e = this.parsedPos, t = this.lineAfter(e), i = e + t.length;
    for (let r = this.rangeIndex; ; ) {
      let s = this.ranges[r].to;
      if (s >= i || (t = t.slice(0, s - (i - t.length)), r++, r == this.ranges.length))
        break;
      let o = this.ranges[r].from, a = this.lineAfter(o);
      t += a, i = o + a.length;
    }
    return { line: t, end: i };
  }
  skipGapsTo(e, t, i) {
    for (; ; ) {
      let r = this.ranges[this.rangeIndex].to, s = e + t;
      if (i > 0 ? r > s : r >= s)
        break;
      let o = this.ranges[++this.rangeIndex].from;
      t += o - r;
    }
    return t;
  }
  moveRangeIndex() {
    for (; this.ranges[this.rangeIndex].to < this.parsedPos; )
      this.rangeIndex++;
  }
  emitToken(e, t, i, r) {
    let s = 4;
    if (this.ranges.length > 1) {
      r = this.skipGapsTo(t, r, 1), t += r;
      let a = this.chunk.length;
      r = this.skipGapsTo(i, r, -1), i += r, s += this.chunk.length - a;
    }
    let o = this.chunk.length - 4;
    return this.lang.streamParser.mergeTokens && s == 4 && o >= 0 && this.chunk[o] == e && this.chunk[o + 2] == t ? this.chunk[o + 2] = i : this.chunk.push(e, t, i, s), r;
  }
  parseLine(e) {
    let { line: t, end: i } = this.nextLine(), r = 0, { streamParser: s } = this.lang, o = new wf(t, e ? e.state.tabSize : 4, e ? ko(e.state) : 2);
    if (o.eol())
      s.blankLine(this.state, o.indentUnit);
    else
      for (; !o.eol(); ) {
        let a = Kg(s.token, o, this.state);
        if (a && (r = this.emitToken(this.lang.tokenTable.resolve(a), this.parsedPos + o.start, this.parsedPos + o.pos, r)), o.start > 1e4)
          break;
      }
    this.parsedPos = i, this.moveRangeIndex(), this.parsedPos < this.to && this.parsedPos++;
  }
  finishChunk() {
    let e = Ue.build({
      buffer: this.chunk,
      start: this.chunkStart,
      length: this.parsedPos - this.chunkStart,
      nodeSet: Pw,
      topID: 0,
      maxBufferLength: 512,
      reused: this.chunkReused
    });
    e = new Ue(e.type, e.children, e.positions, e.length, [[this.lang.stateAfter, this.lang.streamParser.copyState(this.state)]]), this.chunks.push(e), this.chunkPos.push(this.chunkStart - this.ranges[0].from), this.chunk = [], this.chunkReused = void 0, this.chunkStart = this.parsedPos;
  }
  finish() {
    return new Ue(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
  }
};
function Kg(n, e, t) {
  e.start = e.pos;
  for (let i = 0; i < 10; i++) {
    let r = n(e, t);
    if (e.pos > e.start)
      return r;
  }
  throw new Error("Stream parser failed to advance stream.");
}
const Tf = /* @__PURE__ */ Object.create(null), wo = [Gt.none], Pw = /* @__PURE__ */ new yl(wo), pO = [], gO = /* @__PURE__ */ Object.create(null), em = /* @__PURE__ */ Object.create(null);
for (let [n, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  em[n] = /* @__PURE__ */ im(Tf, e);
class tm {
  constructor(e) {
    this.extra = e, this.table = Object.assign(/* @__PURE__ */ Object.create(null), em);
  }
  resolve(e) {
    return e ? this.table[e] || (this.table[e] = im(this.extra, e)) : 0;
  }
}
const _w = /* @__PURE__ */ new tm(Tf);
function fh(n, e) {
  pO.indexOf(n) > -1 || (pO.push(n), console.warn(e));
}
function im(n, e) {
  let t = [];
  for (let a of e.split(" ")) {
    let l = [];
    for (let h of a.split(".")) {
      let c = n[h] || _[h];
      c ? typeof c == "function" ? l.length ? l = l.map(c) : fh(h, `Modifier ${h} used at start of tag`) : l.length ? fh(h, `Tag ${h} used as modifier`) : l = Array.isArray(c) ? c : [c] : fh(h, `Unknown highlighting tag ${h}`);
    }
    for (let h of l)
      t.push(h);
  }
  if (!t.length)
    return 0;
  let i = e.replace(/ /g, "_"), r = i + " " + t.map((a) => a.id), s = gO[r];
  if (s)
    return s.id;
  let o = gO[r] = Gt.define({
    id: wo.length,
    name: i,
    props: [kl({ [i]: t })]
  });
  return wo.push(o), o.id;
}
function Tw(n, e) {
  let t = Gt.define({ id: wo.length, name: "Document", props: [
    Un.add(() => n),
    Vo.add(() => (i) => e.getIndent(i))
  ], top: !0 });
  return wo.push(t), t;
}
function nm(n) {
  return n.length <= 4096 && /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/.test(n);
}
function rm(n) {
  for (let e = n.iter(); !e.next().done; )
    if (nm(e.value))
      return !0;
  return !1;
}
function $w(n) {
  let e = !1;
  return n.iterChanges((t, i, r, s, o) => {
    !e && rm(o) && (e = !0);
  }), e;
}
const Pc = /* @__PURE__ */ se.define({ combine: (n) => n.some((e) => e) });
function Zw(n = {}) {
  let e = [Rw];
  return n.alwaysIsolate && e.push(Pc.of(!0)), e;
}
const Rw = /* @__PURE__ */ ot.fromClass(class {
  constructor(n) {
    this.always = n.state.facet(Pc) || n.textDirection != Ie.LTR || n.state.facet(ce.perLineTextDirection), this.hasRTL = !this.always && rm(n.state.doc), this.tree = pt(n.state), this.decorations = this.always || this.hasRTL ? mO(n, this.tree, this.always) : pe.none;
  }
  update(n) {
    let e = n.state.facet(Pc) || n.view.textDirection != Ie.LTR || n.state.facet(ce.perLineTextDirection);
    if (!e && !this.hasRTL && $w(n.changes) && (this.hasRTL = !0), !e && !this.hasRTL)
      return;
    let t = pt(n.state);
    (e != this.always || t != this.tree || n.docChanged || n.viewportChanged) && (this.tree = t, this.always = e, this.decorations = mO(n.view, t, e));
  }
}, {
  provide: (n) => {
    function e(t) {
      var i, r;
      return (r = (i = t.plugin(n)) === null || i === void 0 ? void 0 : i.decorations) !== null && r !== void 0 ? r : pe.none;
    }
    return [
      ce.outerDecorations.of(e),
      Mr.lowest(ce.bidiIsolatedRanges.of(e))
    ];
  }
});
function mO(n, e, t) {
  let i = new Zn(), r = n.visibleRanges;
  t || (r = Xw(r, n.state.doc));
  for (let { from: s, to: o } of r)
    e.iterate({
      enter: (a) => {
        let l = a.type.prop(Re.isolate);
        l && i.add(a.from, a.to, Cw[l]);
      },
      from: s,
      to: o
    });
  return i.finish();
}
function Xw(n, e) {
  let t = e.iter(), i = 0, r = [], s = null;
  for (let { from: o, to: a } of n)
    if (!(s && s.to > o && (o = s.to, o >= a)))
      for (i + t.value.length < o && (t.next(o - (i + t.value.length)), i = o); ; ) {
        let l = i, h = i + t.value.length;
        if (!t.lineBreak && nm(t.value) && (s && s.to > l - 10 ? s.to = Math.min(a, h) : r.push(s = { from: l, to: Math.min(a, h) })), h >= a)
          break;
        i = h, t.next();
      }
  return r;
}
const Cw = {
  rtl: /* @__PURE__ */ pe.mark({ class: "cm-iso", inclusive: !0, attributes: { dir: "rtl" }, bidiIsolate: Ie.RTL }),
  ltr: /* @__PURE__ */ pe.mark({ class: "cm-iso", inclusive: !0, attributes: { dir: "ltr" }, bidiIsolate: Ie.LTR }),
  auto: /* @__PURE__ */ pe.mark({ class: "cm-iso", inclusive: !0, attributes: { dir: "auto" }, bidiIsolate: null })
}, Aw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DocInput: Cg,
  HighlightStyle: Yo,
  IndentContext: _l,
  LRLanguage: vs,
  Language: jt,
  LanguageDescription: mf,
  LanguageSupport: gf,
  ParseContext: qr,
  StreamLanguage: Pf,
  StringStream: wf,
  TreeIndentContext: Tl,
  bidiIsolates: Zw,
  bracketMatching: Qw,
  bracketMatchingHandle: Hg,
  codeFolding: xf,
  continuedIndent: $a,
  defaultHighlightStyle: uw,
  defineLanguageFacet: xl,
  delimitedIndent: lo,
  ensureSyntaxTree: Xg,
  flatIndent: Eg,
  foldAll: Dg,
  foldCode: Yg,
  foldEffect: ws,
  foldGutter: ow,
  foldInside: bf,
  foldKeymap: iw,
  foldNodeProp: $l,
  foldService: jg,
  foldState: Cn,
  foldable: bs,
  foldedRanges: Jx,
  forceParsing: Ex,
  getIndentUnit: ko,
  getIndentation: Qf,
  highlightingFor: hw,
  indentNodeProp: Vo,
  indentOnInput: Bx,
  indentRange: Vx,
  indentService: zg,
  indentString: vf,
  indentUnit: Pl,
  language: Xn,
  languageDataProp: Un,
  matchBrackets: Is,
  sublanguageProp: wl,
  syntaxHighlighting: lw,
  syntaxParserRunning: jx,
  syntaxTree: pt,
  syntaxTreeAvailable: Wx,
  toggleFold: tw,
  unfoldAll: Gg,
  unfoldCode: Lg,
  unfoldEffect: Wr
}, Symbol.toStringTag, { value: "Module" }));
class il {
  /**
  @internal
  */
  constructor(e, t, i, r, s, o, a, l, h, c = 0, f) {
    this.p = e, this.stack = t, this.state = i, this.reducePos = r, this.pos = s, this.score = o, this.buffer = a, this.bufferBase = l, this.curContext = h, this.lookAhead = c, this.parent = f;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(e, t, i = 0) {
    let r = e.parser.context;
    return new il(e, [], t, i, i, 0, [], 0, r ? new vO(r, r.start) : null, 0, null);
  }
  /**
  The stack's current [context](#lr.ContextTracker) value, if
  any. Its type will depend on the context tracker's type
  parameter, or it will be `null` if there is no context
  tracker.
  */
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  // Push a state onto the stack, tracking its start position as well
  // as the buffer base at that point.
  /**
  @internal
  */
  pushState(e, t) {
    this.stack.push(this.state, t, this.bufferBase + this.buffer.length), this.state = e;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(e) {
    var t;
    let i = e >> 19, r = e & 65535, { parser: s } = this.p, o = this.reducePos < this.pos - 25 && this.setLookAhead(this.pos), a = s.dynamicPrecedence(r);
    if (a && (this.score += a), i == 0) {
      r < s.minRepeatTerm && this.reducePos < this.pos && (this.reducePos = this.pos), this.pushState(s.getGoto(this.state, r, !0), this.reducePos), r < s.minRepeatTerm && this.storeNode(r, this.reducePos, this.reducePos, o ? 8 : 4, !0), this.reduceContext(r, this.reducePos);
      return;
    }
    let l = this.stack.length - (i - 1) * 3 - (e & 262144 ? 6 : 0), h = l ? this.stack[l - 2] : this.p.ranges[0].from;
    r < s.minRepeatTerm && h == this.reducePos && this.reducePos < this.pos && (this.reducePos = this.pos);
    let c = this.reducePos - h;
    c >= 2e3 && !(!((t = this.p.parser.nodeSet.types[r]) === null || t === void 0) && t.isAnonymous) && (h == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = c) : this.p.lastBigReductionSize < c && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = h, this.p.lastBigReductionSize = c));
    let f = l ? this.stack[l - 1] : 0, O = this.bufferBase + this.buffer.length - f;
    if (r < s.minRepeatTerm || e & 131072) {
      let d = s.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(r, h, d, O + 4, !0);
    }
    if (e & 262144)
      this.state = this.stack[l];
    else {
      let d = this.stack[l - 3];
      this.state = s.getGoto(d, r, !0);
    }
    for (; this.stack.length > l; )
      this.stack.pop();
    this.reduceContext(r, h);
  }
  // Shift a value into the buffer
  /**
  @internal
  */
  storeNode(e, t, i, r = 4, s = !1) {
    if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let o = this.buffer.length;
      if (o > 0 && this.buffer[o - 4] == 0 && this.buffer[o - 1] > -1) {
        if (t == i)
          return;
        if (this.buffer[o - 2] >= t) {
          this.buffer[o - 2] = i;
          return;
        }
      }
    }
    if (!s || this.pos == i)
      this.buffer.push(e, t, i, r);
    else {
      let o = this.buffer.length;
      if (o > 0 && (this.buffer[o - 4] != 0 || this.buffer[o - 1] < 0)) {
        let a = !1;
        for (let l = o; l > 0 && this.buffer[l - 2] > i; l -= 4)
          if (this.buffer[l - 1] >= 0) {
            a = !0;
            break;
          }
        if (a)
          for (; o > 0 && this.buffer[o - 2] > i; )
            this.buffer[o] = this.buffer[o - 4], this.buffer[o + 1] = this.buffer[o - 3], this.buffer[o + 2] = this.buffer[o - 2], this.buffer[o + 3] = this.buffer[o - 1], o -= 4, r > 4 && (r -= 4);
      }
      this.buffer[o] = e, this.buffer[o + 1] = t, this.buffer[o + 2] = i, this.buffer[o + 3] = r;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(e, t, i, r) {
    if (e & 131072)
      this.pushState(e & 65535, this.pos);
    else if ((e & 262144) == 0) {
      let s = e, { parser: o } = this.p;
      this.pos = r;
      let a = o.stateFlag(
        s,
        1
        /* StateFlag.Skipped */
      );
      !a && (r > i || t <= o.maxNode) && (this.reducePos = r), this.pushState(s, a ? i : Math.min(i, this.reducePos)), this.shiftContext(t, i), t <= o.maxNode && this.buffer.push(t, i, r, 4);
    } else
      this.pos = r, this.shiftContext(t, i), t <= this.p.parser.maxNode && this.buffer.push(t, i, r, 4);
  }
  // Apply an action
  /**
  @internal
  */
  apply(e, t, i, r) {
    e & 65536 ? this.reduce(e) : this.shift(e, t, i, r);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(e, t) {
    let i = this.p.reused.length - 1;
    (i < 0 || this.p.reused[i] != e) && (this.p.reused.push(e), i++);
    let r = this.pos;
    this.reducePos = this.pos = r + e.length, this.pushState(t, r), this.buffer.push(
      i,
      r,
      this.reducePos,
      -1
      /* size == -1 means this is a reused value */
    ), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
  }
  // Split the stack. Due to the buffer sharing and the fact
  // that `this.stack` tends to stay quite shallow, this isn't very
  // expensive.
  /**
  @internal
  */
  split() {
    let e = this, t = e.buffer.length;
    for (t && e.buffer[t - 4] == 0 && (t -= 4); t > 0 && e.buffer[t - 2] > e.reducePos; )
      t -= 4;
    let i = e.buffer.slice(t), r = e.bufferBase + t;
    for (; e && r == e.bufferBase; )
      e = e.parent;
    return new il(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, i, r, this.curContext, this.lookAhead, e);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(e, t) {
    let i = e <= this.p.parser.maxNode;
    i && this.storeNode(e, this.pos, t, 4), this.storeNode(0, this.pos, t, i ? 8 : 4), this.pos = this.reducePos = t, this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(e) {
    for (let t = new qw(this); ; ) {
      let i = this.p.parser.stateSlot(
        t.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(t.state, e);
      if (i == 0)
        return !1;
      if ((i & 65536) == 0)
        return !0;
      t.reduce(i);
    }
  }
  // Apply up to Recover.MaxNext recovery actions that conceptually
  // inserts some missing token or rule.
  /**
  @internal
  */
  recoverByInsert(e) {
    if (this.stack.length >= 300)
      return [];
    let t = this.p.parser.nextStates(this.state);
    if (t.length > 8 || this.stack.length >= 120) {
      let r = [];
      for (let s = 0, o; s < t.length; s += 2)
        (o = t[s + 1]) != this.state && this.p.parser.hasAction(o, e) && r.push(t[s], o);
      if (this.stack.length < 120)
        for (let s = 0; r.length < 8 && s < t.length; s += 2) {
          let o = t[s + 1];
          r.some((a, l) => l & 1 && a == o) || r.push(t[s], o);
        }
      t = r;
    }
    let i = [];
    for (let r = 0; r < t.length && i.length < 4; r += 2) {
      let s = t[r + 1];
      if (s == this.state)
        continue;
      let o = this.split();
      o.pushState(s, this.pos), o.storeNode(0, o.pos, o.pos, 4, !0), o.shiftContext(t[r], this.pos), o.reducePos = this.pos, o.score -= 200, i.push(o);
    }
    return i;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: e } = this.p, t = e.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if ((t & 65536) == 0)
      return !1;
    if (!e.validAction(this.state, t)) {
      let i = t >> 19, r = t & 65535, s = this.stack.length - i * 3;
      if (s < 0 || e.getGoto(this.stack[s], r, !1) < 0) {
        let o = this.findForcedReduction();
        if (o == null)
          return !1;
        t = o;
      }
      this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
    }
    return this.reducePos = this.pos, this.reduce(t), !0;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: e } = this.p, t = [], i = (r, s) => {
      if (!t.includes(r))
        return t.push(r), e.allActions(r, (o) => {
          if (!(o & 393216)) if (o & 65536) {
            let a = (o >> 19) - s;
            if (a > 1) {
              let l = o & 65535, h = this.stack.length - a * 3;
              if (h >= 0 && e.getGoto(this.stack[h], l, !1) >= 0)
                return a << 19 | 65536 | l;
            }
          } else {
            let a = i(o, s + 1);
            if (a != null)
              return a;
          }
        });
    };
    return i(this.state, 0);
  }
  /**
  @internal
  */
  forceAll() {
    for (; !this.p.parser.stateFlag(
      this.state,
      2
      /* StateFlag.Accepting */
    ); )
      if (!this.forceReduce()) {
        this.storeNode(0, this.pos, this.pos, 4, !0);
        break;
      }
    return this;
  }
  /**
  Check whether this state has no further actions (assumed to be a direct descendant of the
  top state, since any other states must be able to continue
  somehow). @internal
  */
  get deadEnd() {
    if (this.stack.length != 3)
      return !1;
    let { parser: e } = this.p;
    return e.data[e.stateSlot(
      this.state,
      1
      /* ParseState.Actions */
    )] == 65535 && !e.stateSlot(
      this.state,
      4
      /* ParseState.DefaultReduce */
    );
  }
  /**
  Restart the stack (put it back in its start state). Only safe
  when this.stack.length == 3 (state is directly below the top
  state). @internal
  */
  restart() {
    this.storeNode(0, this.pos, this.pos, 4, !0), this.state = this.stack[0], this.stack.length = 0;
  }
  /**
  @internal
  */
  sameState(e) {
    if (this.state != e.state || this.stack.length != e.stack.length)
      return !1;
    for (let t = 0; t < this.stack.length; t += 3)
      if (this.stack[t] != e.stack[t])
        return !1;
    return !0;
  }
  /**
  Get the parser used by this stack.
  */
  get parser() {
    return this.p.parser;
  }
  /**
  Test whether a given dialect (by numeric ID, as exported from
  the terms file) is enabled.
  */
  dialectEnabled(e) {
    return this.p.parser.dialect.flags[e];
  }
  shiftContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  reduceContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  /**
  @internal
  */
  emitContext() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -3) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
  }
  /**
  @internal
  */
  emitLookAhead() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
  }
  updateContext(e) {
    if (e != this.curContext.context) {
      let t = new vO(this.curContext.tracker, e);
      t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
    }
  }
  /**
  @internal
  */
  setLookAhead(e) {
    return e <= this.lookAhead ? !1 : (this.emitLookAhead(), this.lookAhead = e, !0);
  }
  /**
  @internal
  */
  close() {
    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
  }
}
class vO {
  constructor(e, t) {
    this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
  }
}
class qw {
  constructor(e) {
    this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
  }
  reduce(e) {
    let t = e & 65535, i = e >> 19;
    i == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (i - 1) * 3;
    let r = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
    this.state = r;
  }
}
class nl {
  constructor(e, t, i) {
    this.stack = e, this.pos = t, this.index = i, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
  }
  static create(e, t = e.bufferBase + e.buffer.length) {
    return new nl(e, t, t - e.bufferBase);
  }
  maybeNext() {
    let e = this.stack.parent;
    e != null && (this.index = this.stack.bufferBase - e.bufferBase, this.stack = e, this.buffer = e.buffer);
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    this.index -= 4, this.pos -= 4, this.index == 0 && this.maybeNext();
  }
  fork() {
    return new nl(this.stack, this.pos, this.index);
  }
}
function Us(n, e = Uint16Array) {
  if (typeof n != "string")
    return n;
  let t = null;
  for (let i = 0, r = 0; i < n.length; ) {
    let s = 0;
    for (; ; ) {
      let o = n.charCodeAt(i++), a = !1;
      if (o == 126) {
        s = 65535;
        break;
      }
      o >= 92 && o--, o >= 34 && o--;
      let l = o - 32;
      if (l >= 46 && (l -= 46, a = !0), s += l, a)
        break;
      s *= 46;
    }
    t ? t[r++] = s : t = new e(s);
  }
  return t;
}
class Ra {
  constructor() {
    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
  }
}
const QO = new Ra();
class zw {
  /**
  @internal
  */
  constructor(e, t) {
    this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = QO, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(e, t) {
    let i = this.range, r = this.rangeIndex, s = this.pos + e;
    for (; s < i.from; ) {
      if (!r)
        return null;
      let o = this.ranges[--r];
      s -= i.from - o.to, i = o;
    }
    for (; t < 0 ? s > i.to : s >= i.to; ) {
      if (r == this.ranges.length - 1)
        return null;
      let o = this.ranges[++r];
      s += o.from - i.to, i = o;
    }
    return s;
  }
  /**
  @internal
  */
  clipPos(e) {
    if (e >= this.range.from && e < this.range.to)
      return e;
    for (let t of this.ranges)
      if (t.to > e)
        return Math.max(e, t.from);
    return this.end;
  }
  /**
  Look at a code unit near the stream position. `.peek(0)` equals
  `.next`, `.peek(-1)` gives you the previous character, and so
  on.
  
  Note that looking around during tokenizing creates dependencies
  on potentially far-away content, which may reduce the
  effectiveness incremental parsing—when looking forward—or even
  cause invalid reparses when looking backward more than 25 code
  units, since the library does not track lookbehind.
  */
  peek(e) {
    let t = this.chunkOff + e, i, r;
    if (t >= 0 && t < this.chunk.length)
      i = this.pos + e, r = this.chunk.charCodeAt(t);
    else {
      let s = this.resolveOffset(e, 1);
      if (s == null)
        return -1;
      if (i = s, i >= this.chunk2Pos && i < this.chunk2Pos + this.chunk2.length)
        r = this.chunk2.charCodeAt(i - this.chunk2Pos);
      else {
        let o = this.rangeIndex, a = this.range;
        for (; a.to <= i; )
          a = this.ranges[++o];
        this.chunk2 = this.input.chunk(this.chunk2Pos = i), i + this.chunk2.length > a.to && (this.chunk2 = this.chunk2.slice(0, a.to - i)), r = this.chunk2.charCodeAt(0);
      }
    }
    return i >= this.token.lookAhead && (this.token.lookAhead = i + 1), r;
  }
  /**
  Accept a token. By default, the end of the token is set to the
  current stream position, but you can pass an offset (relative to
  the stream position) to change that.
  */
  acceptToken(e, t = 0) {
    let i = t ? this.resolveOffset(t, -1) : this.pos;
    if (i == null || i < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = e, this.token.end = i;
  }
  /**
  Accept a token ending at a specific given position.
  */
  acceptTokenTo(e, t) {
    this.token.value = e, this.token.end = t;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: e, chunkPos: t } = this;
      this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = e, this.chunk2Pos = t, this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
      let e = this.input.chunk(this.pos), t = this.pos + e.length;
      this.chunk = t > this.range.to ? e.slice(0, this.range.to - this.pos) : e, this.chunkPos = this.pos, this.chunkOff = 0;
    }
  }
  readNext() {
    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  /**
  Move the stream forward N (defaults to 1) code units. Returns
  the new value of [`next`](#lr.InputStream.next).
  */
  advance(e = 1) {
    for (this.chunkOff += e; this.pos + e >= this.range.to; ) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      e -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
    }
    return this.pos += e, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
  }
  setDone() {
    return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
  }
  /**
  @internal
  */
  reset(e, t) {
    if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = QO, this.pos != e) {
      if (this.pos = e, e == this.end)
        return this.setDone(), this;
      for (; e < this.range.from; )
        this.range = this.ranges[--this.rangeIndex];
      for (; e >= this.range.to; )
        this.range = this.ranges[++this.rangeIndex];
      e >= this.chunkPos && e < this.chunkPos + this.chunk.length ? this.chunkOff = e - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
    }
    return this;
  }
  /**
  @internal
  */
  read(e, t) {
    if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
    if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
    if (e >= this.range.from && t <= this.range.to)
      return this.input.read(e, t);
    let i = "";
    for (let r of this.ranges) {
      if (r.from >= t)
        break;
      r.to > e && (i += this.input.read(Math.max(r.from, e), Math.min(r.to, t)));
    }
    return i;
  }
}
class ts {
  constructor(e, t) {
    this.data = e, this.id = t;
  }
  token(e, t) {
    let { parser: i } = t.p;
    sm(this.data, e, t, this.id, i.data, i.tokenPrecTable);
  }
}
ts.prototype.contextual = ts.prototype.fallback = ts.prototype.extend = !1;
class _c {
  constructor(e, t, i) {
    this.precTable = t, this.elseToken = i, this.data = typeof e == "string" ? Us(e) : e;
  }
  token(e, t) {
    let i = e.pos, r = 0;
    for (; ; ) {
      let s = e.next < 0, o = e.resolveOffset(1, 1);
      if (sm(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1)
        break;
      if (this.elseToken == null)
        return;
      if (s || r++, o == null)
        break;
      e.reset(o, e.token);
    }
    r && (e.reset(i, e.token), e.acceptToken(this.elseToken, r));
  }
}
_c.prototype.contextual = ts.prototype.fallback = ts.prototype.extend = !1;
class qn {
  /**
  Create a tokenizer. The first argument is the function that,
  given an input stream, scans for the types of tokens it
  recognizes at the stream's position, and calls
  [`acceptToken`](#lr.InputStream.acceptToken) when it finds
  one.
  */
  constructor(e, t = {}) {
    this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
  }
}
function sm(n, e, t, i, r, s) {
  let o = 0, a = 1 << i, { dialect: l } = t.p.parser;
  e: for (; (a & n[o]) != 0; ) {
    let h = n[o + 1];
    for (let d = o + 3; d < h; d += 2)
      if ((n[d + 1] & a) > 0) {
        let p = n[d];
        if (l.allows(p) && (e.token.value == -1 || e.token.value == p || Mw(p, e.token.value, r, s))) {
          e.acceptToken(p);
          break;
        }
      }
    let c = e.next, f = 0, O = n[o + 2];
    if (e.next < 0 && O > f && n[h + O * 3 - 3] == 65535) {
      o = n[h + O * 3 - 1];
      continue e;
    }
    for (; f < O; ) {
      let d = f + O >> 1, p = h + d + (d << 1), g = n[p], m = n[p + 1] || 65536;
      if (c < g)
        O = d;
      else if (c >= m)
        f = d + 1;
      else {
        o = n[p + 2], e.advance();
        continue e;
      }
    }
    break;
  }
}
function bO(n, e, t) {
  for (let i = e, r; (r = n[i]) != 65535; i++)
    if (r == t)
      return i - e;
  return -1;
}
function Mw(n, e, t, i) {
  let r = bO(t, i, e);
  return r < 0 || bO(t, i, n) < r;
}
const ri = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG);
let uh = null;
function SO(n, e, t) {
  let i = n.cursor(it.IncludeAnonymous);
  for (i.moveTo(e); ; )
    if (!(t < 0 ? i.childBefore(e) : i.childAfter(e)))
      for (; ; ) {
        if ((t < 0 ? i.to < e : i.from > e) && !i.type.isError)
          return t < 0 ? Math.max(0, Math.min(
            i.to - 1,
            e - 25
            /* Lookahead.Margin */
          )) : Math.min(n.length, Math.max(
            i.from + 1,
            e + 25
            /* Lookahead.Margin */
          ));
        if (t < 0 ? i.prevSibling() : i.nextSibling())
          break;
        if (!i.parent())
          return t < 0 ? 0 : n.length;
      }
}
class Ww {
  constructor(e, t) {
    this.fragments = e, this.nodeSet = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
  }
  nextFragment() {
    let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (e) {
      for (this.safeFrom = e.openStart ? SO(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? SO(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length; )
        this.trees.pop(), this.start.pop(), this.index.pop();
      this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
    } else
      this.nextStart = 1e9;
  }
  // `pos` must be >= any previously given `pos` for this cursor
  nodeAt(e) {
    if (e < this.nextStart)
      return null;
    for (; this.fragment && this.safeTo <= e; )
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let t = this.trees.length - 1;
      if (t < 0)
        return this.nextFragment(), null;
      let i = this.trees[t], r = this.index[t];
      if (r == i.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let s = i.children[r], o = this.start[t] + i.positions[r];
      if (o > e)
        return this.nextStart = o, null;
      if (s instanceof Ue) {
        if (o == e) {
          if (o < this.safeFrom)
            return null;
          let a = o + s.length;
          if (a <= this.safeTo) {
            let l = s.prop(Re.lookAhead);
            if (!l || a + l < this.fragment.to)
              return s;
          }
        }
        this.index[t]++, o + s.length >= Math.max(this.safeFrom, e) && (this.trees.push(s), this.start.push(o), this.index.push(0));
      } else
        this.index[t]++, this.nextStart = o + s.length;
    }
  }
}
class Ew {
  constructor(e, t) {
    this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((i) => new Ra());
  }
  getActions(e) {
    let t = 0, i = null, { parser: r } = e.p, { tokenizers: s } = r, o = r.stateSlot(
      e.state,
      3
      /* ParseState.TokenizerMask */
    ), a = e.curContext ? e.curContext.hash : 0, l = 0;
    for (let h = 0; h < s.length; h++) {
      if ((1 << h & o) == 0)
        continue;
      let c = s[h], f = this.tokens[h];
      if (!(i && !c.fallback) && ((c.contextual || f.start != e.pos || f.mask != o || f.context != a) && (this.updateCachedToken(f, c, e), f.mask = o, f.context = a), f.lookAhead > f.end + 25 && (l = Math.max(f.lookAhead, l)), f.value != 0)) {
        let O = t;
        if (f.extended > -1 && (t = this.addActions(e, f.extended, f.end, t)), t = this.addActions(e, f.value, f.end, t), !c.extend && (i = f, t > O))
          break;
      }
    }
    for (; this.actions.length > t; )
      this.actions.pop();
    return l && e.setLookAhead(l), !i && e.pos == this.stream.end && (i = new Ra(), i.value = e.p.parser.eofTerm, i.start = i.end = e.pos, t = this.addActions(e, i.value, i.end, t)), this.mainToken = i, this.actions;
  }
  getMainToken(e) {
    if (this.mainToken)
      return this.mainToken;
    let t = new Ra(), { pos: i, p: r } = e;
    return t.start = i, t.end = Math.min(i + 1, r.stream.end), t.value = i == r.stream.end ? r.parser.eofTerm : 0, t;
  }
  updateCachedToken(e, t, i) {
    let r = this.stream.clipPos(i.pos);
    if (t.token(this.stream.reset(r, e), i), e.value > -1) {
      let { parser: s } = i.p;
      for (let o = 0; o < s.specialized.length; o++)
        if (s.specialized[o] == e.value) {
          let a = s.specializers[o](this.stream.read(e.start, e.end), i);
          if (a >= 0 && i.p.parser.dialect.allows(a >> 1)) {
            (a & 1) == 0 ? e.value = a >> 1 : e.extended = a >> 1;
            break;
          }
        }
    } else
      e.value = 0, e.end = this.stream.clipPos(r + 1);
  }
  putAction(e, t, i, r) {
    for (let s = 0; s < r; s += 3)
      if (this.actions[s] == e)
        return r;
    return this.actions[r++] = e, this.actions[r++] = t, this.actions[r++] = i, r;
  }
  addActions(e, t, i, r) {
    let { state: s } = e, { parser: o } = e.p, { data: a } = o;
    for (let l = 0; l < 2; l++)
      for (let h = o.stateSlot(
        s,
        l ? 2 : 1
        /* ParseState.Actions */
      ); ; h += 3) {
        if (a[h] == 65535)
          if (a[h + 1] == 1)
            h = mn(a, h + 2);
          else {
            r == 0 && a[h + 1] == 2 && (r = this.putAction(mn(a, h + 2), t, i, r));
            break;
          }
        a[h] == t && (r = this.putAction(mn(a, h + 1), t, i, r));
      }
    return r;
  }
}
class jw {
  constructor(e, t, i, r) {
    this.parser = e, this.input = t, this.ranges = r, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new zw(t, r), this.tokens = new Ew(e, this.stream), this.topTerm = e.top[1];
    let { from: s } = r[0];
    this.stacks = [il.start(this, e.top[0], s)], this.fragments = i.length && this.stream.end - s > e.bufferLength * 4 ? new Ww(i, e.nodeSet) : null;
  }
  get parsedPos() {
    return this.minStackPos;
  }
  // Move the parser forward. This will process all parse stacks at
  // `this.pos` and try to advance them to a further position. If no
  // stack for such a position is found, it'll start error-recovery.
  //
  // When the parse is finished, this will return a syntax tree. When
  // not, it returns `null`.
  advance() {
    let e = this.stacks, t = this.minStackPos, i = this.stacks = [], r, s;
    if (this.bigReductionCount > 300 && e.length == 1) {
      let [o] = e;
      for (; o.forceReduce() && o.stack.length && o.stack[o.stack.length - 2] >= this.lastBigReductionStart; )
        ;
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let o = 0; o < e.length; o++) {
      let a = e[o];
      for (; ; ) {
        if (this.tokens.mainToken = null, a.pos > t)
          i.push(a);
        else {
          if (this.advanceStack(a, i, e))
            continue;
          {
            r || (r = [], s = []), r.push(a);
            let l = this.tokens.getMainToken(a);
            s.push(l.value, l.end);
          }
        }
        break;
      }
    }
    if (!i.length) {
      let o = r && Yw(r);
      if (o)
        return ri && console.log("Finish with " + this.stackID(o)), this.stackToTree(o);
      if (this.parser.strict)
        throw ri && r && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + t);
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && r) {
      let o = this.stoppedAt != null && r[0].pos > this.stoppedAt ? r[0] : this.runRecovery(r, s, i);
      if (o)
        return ri && console.log("Force-finish " + this.stackID(o)), this.stackToTree(o.forceAll());
    }
    if (this.recovering) {
      let o = this.recovering == 1 ? 1 : this.recovering * 3;
      if (i.length > o)
        for (i.sort((a, l) => l.score - a.score); i.length > o; )
          i.pop();
      i.some((a) => a.reducePos > t) && this.recovering--;
    } else if (i.length > 1) {
      e: for (let o = 0; o < i.length - 1; o++) {
        let a = i[o];
        for (let l = o + 1; l < i.length; l++) {
          let h = i[l];
          if (a.sameState(h) || a.buffer.length > 500 && h.buffer.length > 500)
            if ((a.score - h.score || a.buffer.length - h.buffer.length) > 0)
              i.splice(l--, 1);
            else {
              i.splice(o--, 1);
              continue e;
            }
        }
      }
      i.length > 12 && (i.sort((o, a) => a.score - o.score), i.splice(
        12,
        i.length - 12
        /* Rec.MaxStackCount */
      ));
    }
    this.minStackPos = i[0].pos;
    for (let o = 1; o < i.length; o++)
      i[o].pos < this.minStackPos && (this.minStackPos = i[o].pos);
    return null;
  }
  stopAt(e) {
    if (this.stoppedAt != null && this.stoppedAt < e)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = e;
  }
  // Returns an updated version of the given stack, or null if the
  // stack can't advance normally. When `split` and `stacks` are
  // given, stacks split off by ambiguous operations will be pushed to
  // `split`, or added to `stacks` if they move `pos` forward.
  advanceStack(e, t, i) {
    let r = e.pos, { parser: s } = this, o = ri ? this.stackID(e) + " -> " : "";
    if (this.stoppedAt != null && r > this.stoppedAt)
      return e.forceReduce() ? e : null;
    if (this.fragments) {
      let h = e.curContext && e.curContext.tracker.strict, c = h ? e.curContext.hash : 0;
      for (let f = this.fragments.nodeAt(r); f; ) {
        let O = this.parser.nodeSet.types[f.type.id] == f.type ? s.getGoto(e.state, f.type.id) : -1;
        if (O > -1 && f.length && (!h || (f.prop(Re.contextHash) || 0) == c))
          return e.useNode(f, O), ri && console.log(o + this.stackID(e) + ` (via reuse of ${s.getName(f.type.id)})`), !0;
        if (!(f instanceof Ue) || f.children.length == 0 || f.positions[0] > 0)
          break;
        let d = f.children[0];
        if (d instanceof Ue && f.positions[0] == 0)
          f = d;
        else
          break;
      }
    }
    let a = s.stateSlot(
      e.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (a > 0)
      return e.reduce(a), ri && console.log(o + this.stackID(e) + ` (via always-reduce ${s.getName(
        a & 65535
        /* Action.ValueMask */
      )})`), !0;
    if (e.stack.length >= 8400)
      for (; e.stack.length > 6e3 && e.forceReduce(); )
        ;
    let l = this.tokens.getActions(e);
    for (let h = 0; h < l.length; ) {
      let c = l[h++], f = l[h++], O = l[h++], d = h == l.length || !i, p = d ? e : e.split(), g = this.tokens.mainToken;
      if (p.apply(c, f, g ? g.start : p.pos, O), ri && console.log(o + this.stackID(p) + ` (via ${(c & 65536) == 0 ? "shift" : `reduce of ${s.getName(
        c & 65535
        /* Action.ValueMask */
      )}`} for ${s.getName(f)} @ ${r}${p == e ? "" : ", split"})`), d)
        return !0;
      p.pos > r ? t.push(p) : i.push(p);
    }
    return !1;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(e, t) {
    let i = e.pos;
    for (; ; ) {
      if (!this.advanceStack(e, null, null))
        return !1;
      if (e.pos > i)
        return yO(e, t), !0;
    }
  }
  runRecovery(e, t, i) {
    let r = null, s = !1;
    for (let o = 0; o < e.length; o++) {
      let a = e[o], l = t[o << 1], h = t[(o << 1) + 1], c = ri ? this.stackID(a) + " -> " : "";
      if (a.deadEnd && (s || (s = !0, a.restart(), ri && console.log(c + this.stackID(a) + " (restarted)"), this.advanceFully(a, i))))
        continue;
      let f = a.split(), O = c;
      for (let d = 0; d < 10 && f.forceReduce() && (ri && console.log(O + this.stackID(f) + " (via force-reduce)"), !this.advanceFully(f, i)); d++)
        ri && (O = this.stackID(f) + " -> ");
      for (let d of a.recoverByInsert(l))
        ri && console.log(c + this.stackID(d) + " (via recover-insert)"), this.advanceFully(d, i);
      this.stream.end > a.pos ? (h == a.pos && (h++, l = 0), a.recoverByDelete(l, h), ri && console.log(c + this.stackID(a) + ` (via recover-delete ${this.parser.getName(l)})`), yO(a, i)) : (!r || r.score < f.score) && (r = f);
    }
    return r;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(e) {
    return e.close(), Ue.build({
      buffer: nl.create(e),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: e.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(e) {
    let t = (uh || (uh = /* @__PURE__ */ new WeakMap())).get(e);
    return t || uh.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
  }
}
function yO(n, e) {
  for (let t = 0; t < e.length; t++) {
    let i = e[t];
    if (i.pos == n.pos && i.sameState(n)) {
      e[t].score < n.score && (e[t] = n);
      return;
    }
  }
  e.push(n);
}
class Vw {
  constructor(e, t, i) {
    this.source = e, this.flags = t, this.disabled = i;
  }
  allows(e) {
    return !this.disabled || this.disabled[e] == 0;
  }
}
const Oh = (n) => n;
class om {
  /**
  Define a context tracker.
  */
  constructor(e) {
    this.start = e.start, this.shift = e.shift || Oh, this.reduce = e.reduce || Oh, this.reuse = e.reuse || Oh, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
  }
}
class Po extends Of {
  /**
  @internal
  */
  constructor(e) {
    if (super(), this.wrappers = [], e.version != 14)
      throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
    let t = e.nodeNames.split(" ");
    this.minRepeatTerm = t.length;
    for (let a = 0; a < e.repeatNodeCount; a++)
      t.push("");
    let i = Object.keys(e.topRules).map((a) => e.topRules[a][1]), r = [];
    for (let a = 0; a < t.length; a++)
      r.push([]);
    function s(a, l, h) {
      r[a].push([l, l.deserialize(String(h))]);
    }
    if (e.nodeProps)
      for (let a of e.nodeProps) {
        let l = a[0];
        typeof l == "string" && (l = Re[l]);
        for (let h = 1; h < a.length; ) {
          let c = a[h++];
          if (c >= 0)
            s(c, l, a[h++]);
          else {
            let f = a[h + -c];
            for (let O = -c; O > 0; O--)
              s(a[h++], l, f);
            h++;
          }
        }
      }
    this.nodeSet = new yl(t.map((a, l) => Gt.define({
      name: l >= this.minRepeatTerm ? void 0 : a,
      id: l,
      props: r[l],
      top: i.indexOf(l) > -1,
      error: l == 0,
      skipped: e.skippedNodes && e.skippedNodes.indexOf(l) > -1
    }))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = wg;
    let o = Us(e.tokenData);
    this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let a = 0; a < this.specializerSpecs.length; a++)
      this.specialized[a] = this.specializerSpecs[a].term;
    this.specializers = this.specializerSpecs.map(kO), this.states = Us(e.states, Uint32Array), this.data = Us(e.stateData), this.goto = Us(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((a) => typeof a == "number" ? new ts(o, a) : a), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(e, t, i) {
    let r = new jw(this, e, t, i);
    for (let s of this.wrappers)
      r = s(r, e, t, i);
    return r;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(e, t, i = !1) {
    let r = this.goto;
    if (t >= r[0])
      return -1;
    for (let s = r[t + 1]; ; ) {
      let o = r[s++], a = o & 1, l = r[s++];
      if (a && i)
        return l;
      for (let h = s + (o >> 1); s < h; s++)
        if (r[s] == e)
          return l;
      if (a)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(e, t) {
    let i = this.data;
    for (let r = 0; r < 2; r++)
      for (let s = this.stateSlot(
        e,
        r ? 2 : 1
        /* ParseState.Actions */
      ), o; ; s += 3) {
        if ((o = i[s]) == 65535)
          if (i[s + 1] == 1)
            o = i[s = mn(i, s + 2)];
          else {
            if (i[s + 1] == 2)
              return mn(i, s + 2);
            break;
          }
        if (o == t || o == 0)
          return mn(i, s + 1);
      }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(e, t) {
    return this.states[e * 6 + t];
  }
  /**
  @internal
  */
  stateFlag(e, t) {
    return (this.stateSlot(
      e,
      0
      /* ParseState.Flags */
    ) & t) > 0;
  }
  /**
  @internal
  */
  validAction(e, t) {
    return !!this.allActions(e, (i) => i == t ? !0 : null);
  }
  /**
  @internal
  */
  allActions(e, t) {
    let i = this.stateSlot(
      e,
      4
      /* ParseState.DefaultReduce */
    ), r = i ? t(i) : void 0;
    for (let s = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); r == null; s += 3) {
      if (this.data[s] == 65535)
        if (this.data[s + 1] == 1)
          s = mn(this.data, s + 2);
        else
          break;
      r = t(mn(this.data, s + 1));
    }
    return r;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(e) {
    let t = [];
    for (let i = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); ; i += 3) {
      if (this.data[i] == 65535)
        if (this.data[i + 1] == 1)
          i = mn(this.data, i + 2);
        else
          break;
      if ((this.data[i + 2] & 1) == 0) {
        let r = this.data[i + 1];
        t.some((s, o) => o & 1 && s == r) || t.push(this.data[i], r);
      }
    }
    return t;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(e) {
    let t = Object.assign(Object.create(Po.prototype), this);
    if (e.props && (t.nodeSet = this.nodeSet.extend(...e.props)), e.top) {
      let i = this.topRules[e.top];
      if (!i)
        throw new RangeError(`Invalid top rule name ${e.top}`);
      t.top = i;
    }
    return e.tokenizers && (t.tokenizers = this.tokenizers.map((i) => {
      let r = e.tokenizers.find((s) => s.from == i);
      return r ? r.to : i;
    })), e.specializers && (t.specializers = this.specializers.slice(), t.specializerSpecs = this.specializerSpecs.map((i, r) => {
      let s = e.specializers.find((a) => a.from == i.external);
      if (!s)
        return i;
      let o = Object.assign(Object.assign({}, i), { external: s.to });
      return t.specializers[r] = kO(o), o;
    })), e.contextTracker && (t.context = e.contextTracker), e.dialect && (t.dialect = this.parseDialect(e.dialect)), e.strict != null && (t.strict = e.strict), e.wrap && (t.wrappers = t.wrappers.concat(e.wrap)), e.bufferLength != null && (t.bufferLength = e.bufferLength), t;
  }
  /**
  Tells you whether any [parse wrappers](#lr.ParserConfig.wrap)
  are registered for this parser.
  */
  hasWrappers() {
    return this.wrappers.length > 0;
  }
  /**
  Returns the name associated with a given term. This will only
  work for all terms when the parser was generated with the
  `--names` option. By default, only the names of tagged terms are
  stored.
  */
  getName(e) {
    return this.termNames ? this.termNames[e] : String(e <= this.maxNode && this.nodeSet.types[e].name || e);
  }
  /**
  The eof term id is always allocated directly after the node
  types. @internal
  */
  get eofTerm() {
    return this.maxNode + 1;
  }
  /**
  The type of top node produced by the parser.
  */
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  /**
  @internal
  */
  dynamicPrecedence(e) {
    let t = this.dynamicPrecedences;
    return t == null ? 0 : t[e] || 0;
  }
  /**
  @internal
  */
  parseDialect(e) {
    let t = Object.keys(this.dialects), i = t.map(() => !1);
    if (e)
      for (let s of e.split(" ")) {
        let o = t.indexOf(s);
        o >= 0 && (i[o] = !0);
      }
    let r = null;
    for (let s = 0; s < t.length; s++)
      if (!i[s])
        for (let o = this.dialects[t[s]], a; (a = this.data[o++]) != 65535; )
          (r || (r = new Uint8Array(this.maxTerm + 1)))[a] = 1;
    return new Vw(e, i, r);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(e) {
    return new Po(e);
  }
}
function mn(n, e) {
  return n[e] | n[e + 1] << 16;
}
function Yw(n) {
  let e = null;
  for (let t of n) {
    let i = t.p.stoppedAt;
    (t.pos == t.p.stream.end || i != null && t.pos > i) && t.p.parser.stateFlag(
      t.state,
      2
      /* StateFlag.Accepting */
    ) && (!e || e.score < t.score) && (e = t);
  }
  return e;
}
function kO(n) {
  if (n.external) {
    let e = n.extend ? 1 : 0;
    return (t, i) => n.external(t, i) << 1 | e;
  }
  return n.get;
}
const Lw = 316, Dw = 317, xO = 1, Gw = 2, Iw = 3, Uw = 4, Nw = 318, Bw = 320, Fw = 321, Hw = 5, Jw = 6, Kw = 0, Tc = [
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
], am = 125, eP = 59, $c = 47, tP = 42, iP = 43, nP = 45, rP = 60, sP = 44, oP = 63, aP = 46, lP = 91, hP = new om({
  start: !1,
  shift(n, e) {
    return e == Hw || e == Jw || e == Bw ? n : e == Fw;
  },
  strict: !1
}), cP = new qn((n, e) => {
  let { next: t } = n;
  (t == am || t == -1 || e.context) && n.acceptToken(Nw);
}, { contextual: !0, fallback: !0 }), fP = new qn((n, e) => {
  let { next: t } = n, i;
  Tc.indexOf(t) > -1 || t == $c && ((i = n.peek(1)) == $c || i == tP) || t != am && t != eP && t != -1 && !e.context && n.acceptToken(Lw);
}, { contextual: !0 }), uP = new qn((n, e) => {
  n.next == lP && !e.context && n.acceptToken(Dw);
}, { contextual: !0 }), OP = new qn((n, e) => {
  let { next: t } = n;
  if (t == iP || t == nP) {
    if (n.advance(), t == n.next) {
      n.advance();
      let i = !e.context && e.canShift(xO);
      n.acceptToken(i ? xO : Gw);
    }
  } else t == oP && n.peek(1) == aP && (n.advance(), n.advance(), (n.next < 48 || n.next > 57) && n.acceptToken(Iw));
}, { contextual: !0 });
function dh(n, e) {
  return n >= 65 && n <= 90 || n >= 97 && n <= 122 || n == 95 || n >= 192 || !e && n >= 48 && n <= 57;
}
const dP = new qn((n, e) => {
  if (n.next != rP || !e.dialectEnabled(Kw) || (n.advance(), n.next == $c)) return;
  let t = 0;
  for (; Tc.indexOf(n.next) > -1; )
    n.advance(), t++;
  if (dh(n.next, !0)) {
    for (n.advance(), t++; dh(n.next, !1); )
      n.advance(), t++;
    for (; Tc.indexOf(n.next) > -1; )
      n.advance(), t++;
    if (n.next == sP) return;
    for (let i = 0; ; i++) {
      if (i == 7) {
        if (!dh(n.next, !0)) return;
        break;
      }
      if (n.next != "extends".charCodeAt(i)) break;
      n.advance(), t++;
    }
  }
  n.acceptToken(Uw, -t);
}), pP = kl({
  "get set async static": _.modifier,
  "for while do if else switch try catch finally return throw break continue default case defer": _.controlKeyword,
  "in of await yield void typeof delete instanceof as satisfies": _.operatorKeyword,
  "let var const using function class extends": _.definitionKeyword,
  "import export from": _.moduleKeyword,
  "with debugger new": _.keyword,
  TemplateString: _.special(_.string),
  super: _.atom,
  BooleanLiteral: _.bool,
  this: _.self,
  null: _.null,
  Star: _.modifier,
  VariableName: _.variableName,
  "CallExpression/VariableName TaggedTemplateExpression/VariableName": _.function(_.variableName),
  VariableDefinition: _.definition(_.variableName),
  Label: _.labelName,
  PropertyName: _.propertyName,
  PrivatePropertyName: _.special(_.propertyName),
  "CallExpression/MemberExpression/PropertyName": _.function(_.propertyName),
  "FunctionDeclaration/VariableDefinition": _.function(_.definition(_.variableName)),
  "ClassDeclaration/VariableDefinition": _.definition(_.className),
  "NewExpression/VariableName": _.className,
  PropertyDefinition: _.definition(_.propertyName),
  PrivatePropertyDefinition: _.definition(_.special(_.propertyName)),
  UpdateOp: _.updateOperator,
  "LineComment Hashbang": _.lineComment,
  BlockComment: _.blockComment,
  Number: _.number,
  String: _.string,
  Escape: _.escape,
  ArithOp: _.arithmeticOperator,
  LogicOp: _.logicOperator,
  BitOp: _.bitwiseOperator,
  CompareOp: _.compareOperator,
  RegExp: _.regexp,
  Equals: _.definitionOperator,
  Arrow: _.function(_.punctuation),
  ": Spread": _.punctuation,
  "( )": _.paren,
  "[ ]": _.squareBracket,
  "{ }": _.brace,
  "InterpolationStart InterpolationEnd": _.special(_.brace),
  ".": _.derefOperator,
  ", ;": _.separator,
  "@": _.meta,
  TypeName: _.typeName,
  TypeDefinition: _.definition(_.typeName),
  "type enum interface implements namespace module declare": _.definitionKeyword,
  "abstract global Privacy readonly override": _.modifier,
  "is keyof unique infer asserts": _.operatorKeyword,
  JSXAttributeValue: _.attributeValue,
  JSXText: _.content,
  "JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": _.angleBracket,
  "JSXIdentifier JSXNameSpacedName": _.tagName,
  "JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": _.attributeName,
  "JSXBuiltin/JSXIdentifier": _.standard(_.tagName)
}), gP = { __proto__: null, export: 20, as: 25, from: 33, default: 36, async: 41, function: 42, in: 52, out: 55, const: 56, extends: 60, this: 64, true: 72, false: 72, null: 84, void: 88, typeof: 92, super: 108, new: 142, delete: 154, yield: 163, await: 167, class: 172, public: 235, private: 235, protected: 235, readonly: 237, instanceof: 256, satisfies: 259, import: 292, keyof: 349, unique: 353, infer: 359, asserts: 395, is: 397, abstract: 417, implements: 419, type: 421, let: 424, var: 426, using: 429, interface: 435, enum: 439, namespace: 445, module: 447, declare: 451, global: 455, defer: 471, for: 476, of: 485, while: 488, with: 492, do: 496, if: 500, else: 502, switch: 506, case: 512, try: 518, catch: 522, finally: 526, return: 530, throw: 534, break: 538, continue: 542, debugger: 546 }, mP = { __proto__: null, async: 129, get: 131, set: 133, declare: 195, public: 197, private: 197, protected: 197, static: 199, abstract: 201, override: 203, readonly: 209, accessor: 211, new: 401 }, vP = { __proto__: null, "<": 193 }, QP = Po.deserialize({
  version: 14,
  states: "$F|Q%TQlOOO%[QlOOO'_QpOOP(lO`OOO*zQ!0MxO'#CiO+RO#tO'#CjO+aO&jO'#CjO+oO#@ItO'#DaO.QQlO'#DgO.bQlO'#DrO%[QlO'#DzO0fQlO'#ESOOQ!0Lf'#E['#E[O1PQ`O'#EXOOQO'#Ep'#EpOOQO'#Il'#IlO1XQ`O'#GsO1dQ`O'#EoO1iQ`O'#EoO3hQ!0MxO'#JrO6[Q!0MxO'#JsO6uQ`O'#F]O6zQ,UO'#FtOOQ!0Lf'#Ff'#FfO7VO7dO'#FfO9XQMhO'#F|O9`Q`O'#F{OOQ!0Lf'#Js'#JsOOQ!0Lb'#Jr'#JrO9eQ`O'#GwOOQ['#K_'#K_O9pQ`O'#IYO9uQ!0LrO'#IZOOQ['#J`'#J`OOQ['#I_'#I_Q`QlOOQ`QlOOO9}Q!L^O'#DvO:UQlO'#EOO:]QlO'#EQO9kQ`O'#GsO:dQMhO'#CoO:rQ`O'#EnO:}Q`O'#EyO;hQMhO'#FeO;xQ`O'#GsOOQO'#K`'#K`O;}Q`O'#K`O<]Q`O'#G{O<]Q`O'#G|O<]Q`O'#HOO9kQ`O'#HRO=SQ`O'#HUO>kQ`O'#CeO>{Q`O'#HcO?TQ`O'#HiO?TQ`O'#HkO`QlO'#HmO?TQ`O'#HoO?TQ`O'#HrO?YQ`O'#HxO?_Q!0LsO'#IOO%[QlO'#IQO?jQ!0LsO'#ISO?uQ!0LsO'#IUO9uQ!0LrO'#IWO@QQ!0MxO'#CiOASQpO'#DlQOQ`OOO%[QlO'#EQOAjQ`O'#ETO:dQMhO'#EnOAuQ`O'#EnOBQQ!bO'#FeOOQ['#Cg'#CgOOQ!0Lb'#Dq'#DqOOQ!0Lb'#Jv'#JvO%[QlO'#JvOOQO'#Jy'#JyOOQO'#Ih'#IhOCQQpO'#EgOOQ!0Lb'#Ef'#EfOOQ!0Lb'#J}'#J}OC|Q!0MSO'#EgODWQpO'#EWOOQO'#Jx'#JxODlQpO'#JyOEyQpO'#EWODWQpO'#EgPFWO&2DjO'#CbPOOO)CD})CD}OOOO'#I`'#I`OFcO#tO,59UOOQ!0Lh,59U,59UOOOO'#Ia'#IaOFqO&jO,59UOGPQ!L^O'#DcOOOO'#Ic'#IcOGWO#@ItO,59{OOQ!0Lf,59{,59{OGfQlO'#IdOGyQ`O'#JtOIxQ!fO'#JtO+}QlO'#JtOJPQ`O,5:ROJgQ`O'#EpOJtQ`O'#KTOKPQ`O'#KSOKPQ`O'#KSOKXQ`O,5;^OK^Q`O'#KROOQ!0Ln,5:^,5:^OKeQlO,5:^OMcQ!0MxO,5:fONSQ`O,5:nONmQ!0LrO'#KQONtQ`O'#KPO9eQ`O'#KPO! YQ`O'#KPO! bQ`O,5;]O! gQ`O'#KPO!#lQ!fO'#JsOOQ!0Lh'#Ci'#CiO%[QlO'#ESO!$[Q!fO,5:sOOQS'#Jz'#JzOOQO-E<j-E<jO9kQ`O,5=_O!$rQ`O,5=_O!$wQlO,5;ZO!&zQMhO'#EkO!(eQ`O,5;ZO!(jQlO'#DyO!(tQpO,5;dO!(|QpO,5;dO%[QlO,5;dOOQ['#FT'#FTOOQ['#FV'#FVO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eOOQ['#FZ'#FZO!)[QlO,5;tOOQ!0Lf,5;y,5;yOOQ!0Lf,5;z,5;zOOQ!0Lf,5;|,5;|O%[QlO'#IpO!+_Q!0LrO,5<iO%[QlO,5;eO!&zQMhO,5;eO!+|QMhO,5;eO!-nQMhO'#E^O%[QlO,5;wOOQ!0Lf,5;{,5;{O!-uQ,UO'#FjO!.rQ,UO'#KXO!.^Q,UO'#KXO!.yQ,UO'#KXOOQO'#KX'#KXO!/_Q,UO,5<SOOOW,5<`,5<`O!/pQlO'#FvOOOW'#Io'#IoO7VO7dO,5<QO!/wQ,UO'#FxOOQ!0Lf,5<Q,5<QO!0hQ$IUO'#CyOOQ!0Lh'#C}'#C}O!0{O#@ItO'#DRO!1iQMjO,5<eO!1pQ`O,5<hO!3YQ(CWO'#GXO!3jQ`O'#GYO!3oQ`O'#GYO!5_Q(CWO'#G^O!6dQpO'#GbOOQO'#Gn'#GnO!,TQMhO'#GmOOQO'#Gp'#GpO!,TQMhO'#GoO!7VQ$IUO'#JlOOQ!0Lh'#Jl'#JlO!7aQ`O'#JkO!7oQ`O'#JjO!7wQ`O'#CuOOQ!0Lh'#C{'#C{O!8YQ`O'#C}OOQ!0Lh'#DV'#DVOOQ!0Lh'#DX'#DXO!8_Q`O,5<eO1SQ`O'#DZO!,TQMhO'#GPO!,TQMhO'#GRO!8gQ`O'#GTO!8lQ`O'#GUO!3oQ`O'#G[O!,TQMhO'#GaO<]Q`O'#JkO!8qQ`O'#EqO!9`Q`O,5<gOOQ!0Lb'#Cr'#CrO!9hQ`O'#ErO!:bQpO'#EsOOQ!0Lb'#KR'#KRO!:iQ!0LrO'#KaO9uQ!0LrO,5=cO`QlO,5>tOOQ['#Jh'#JhOOQ[,5>u,5>uOOQ[-E<]-E<]O!<hQ!0MxO,5:bO!:]QpO,5:`O!?RQ!0MxO,5:jO%[QlO,5:jO!AiQ!0MxO,5:lOOQO,5@z,5@zO!BYQMhO,5=_O!BhQ!0LrO'#JiO9`Q`O'#JiO!ByQ!0LrO,59ZO!CUQpO,59ZO!C^QMhO,59ZO:dQMhO,59ZO!CiQ`O,5;ZO!CqQ`O'#HbO!DVQ`O'#KdO%[QlO,5;}O!:]QpO,5<PO!D_Q`O,5=zO!DdQ`O,5=zO!DiQ`O,5=zO!DwQ`O,5=zO9uQ!0LrO,5=zO<]Q`O,5=jOOQO'#Cy'#CyO!EOQpO,5=gO!EWQMhO,5=hO!EcQ`O,5=jO!EhQ!bO,5=mO!EpQ`O'#K`O?YQ`O'#HWO9kQ`O'#HYO!EuQ`O'#HYO:dQMhO'#H[O!EzQ`O'#H[OOQ[,5=p,5=pO!FPQ`O'#H]O!FbQ`O'#CoO!FgQ`O,59PO!FqQ`O,59PO!HvQlO,59POOQ[,59P,59PO!IWQ!0LrO,59PO%[QlO,59PO!KcQlO'#HeOOQ['#Hf'#HfOOQ['#Hg'#HgO`QlO,5=}O!KyQ`O,5=}O`QlO,5>TO`QlO,5>VO!LOQ`O,5>XO`QlO,5>ZO!LTQ`O,5>^O!LYQlO,5>dOOQ[,5>j,5>jO%[QlO,5>jO9uQ!0LrO,5>lOOQ[,5>n,5>nO#!dQ`O,5>nOOQ[,5>p,5>pO#!dQ`O,5>pOOQ[,5>r,5>rO##QQpO'#D_O%[QlO'#JvO##sQpO'#JvO##}QpO'#DmO#$`QpO'#DmO#&qQlO'#DmO#&xQ`O'#JuO#'QQ`O,5:WO#'VQ`O'#EtO#'eQ`O'#KUO#'mQ`O,5;_O#'rQpO'#DmO#(PQpO'#EVOOQ!0Lf,5:o,5:oO%[QlO,5:oO#(WQ`O,5:oO?YQ`O,5;YO!CUQpO,5;YO!C^QMhO,5;YO:dQMhO,5;YO#(`Q`O,5@bO#(eQ07dO,5:sOOQO-E<f-E<fO#)kQ!0MSO,5;RODWQpO,5:rO#)uQpO,5:rODWQpO,5;RO!ByQ!0LrO,5:rOOQ!0Lb'#Ej'#EjOOQO,5;R,5;RO%[QlO,5;RO#*SQ!0LrO,5;RO#*_Q!0LrO,5;RO!CUQpO,5:rOOQO,5;X,5;XO#*mQ!0LrO,5;RPOOO'#I^'#I^P#+RO&2DjO,58|POOO,58|,58|OOOO-E<^-E<^OOQ!0Lh1G.p1G.pOOOO-E<_-E<_OOOO,59},59}O#+^Q!bO,59}OOOO-E<a-E<aOOQ!0Lf1G/g1G/gO#+cQ!fO,5?OO+}QlO,5?OOOQO,5?U,5?UO#+mQlO'#IdOOQO-E<b-E<bO#+zQ`O,5@`O#,SQ!fO,5@`O#,ZQ`O,5@nOOQ!0Lf1G/m1G/mO%[QlO,5@oO#,cQ`O'#IjOOQO-E<h-E<hO#,ZQ`O,5@nOOQ!0Lb1G0x1G0xOOQ!0Ln1G/x1G/xOOQ!0Ln1G0Y1G0YO%[QlO,5@lO#,wQ!0LrO,5@lO#-YQ!0LrO,5@lO#-aQ`O,5@kO9eQ`O,5@kO#-iQ`O,5@kO#-wQ`O'#ImO#-aQ`O,5@kOOQ!0Lb1G0w1G0wO!(tQpO,5:uO!)PQpO,5:uOOQS,5:w,5:wO#.iQdO,5:wO#.qQMhO1G2yO9kQ`O1G2yOOQ!0Lf1G0u1G0uO#/PQ!0MxO1G0uO#0UQ!0MvO,5;VOOQ!0Lh'#GW'#GWO#0rQ!0MzO'#JlO!$wQlO1G0uO#2}Q!fO'#JwO%[QlO'#JwO#3XQ`O,5:eOOQ!0Lh'#D_'#D_OOQ!0Lf1G1O1G1OO%[QlO1G1OOOQ!0Lf1G1f1G1fO#3^Q`O1G1OO#5rQ!0MxO1G1PO#5yQ!0MxO1G1PO#8aQ!0MxO1G1PO#8hQ!0MxO1G1PO#;OQ!0MxO1G1PO#=fQ!0MxO1G1PO#=mQ!0MxO1G1PO#=tQ!0MxO1G1PO#@[Q!0MxO1G1PO#@cQ!0MxO1G1PO#BpQ?MtO'#CiO#DkQ?MtO1G1`O#DrQ?MtO'#JsO#EVQ!0MxO,5?[OOQ!0Lb-E<n-E<nO#GdQ!0MxO1G1PO#HaQ!0MzO1G1POOQ!0Lf1G1P1G1PO#IdQMjO'#J|O#InQ`O,5:xO#IsQ!0MxO1G1cO#JgQ,UO,5<WO#JoQ,UO,5<XO#JwQ,UO'#FoO#K`Q`O'#FnOOQO'#KY'#KYOOQO'#In'#InO#KeQ,UO1G1nOOQ!0Lf1G1n1G1nOOOW1G1y1G1yO#KvQ?MtO'#JrO#LQQ`O,5<bO!)[QlO,5<bOOOW-E<m-E<mOOQ!0Lf1G1l1G1lO#LVQpO'#KXOOQ!0Lf,5<d,5<dO#L_QpO,5<dO#LdQMhO'#DTOOOO'#Ib'#IbO#LkO#@ItO,59mOOQ!0Lh,59m,59mO%[QlO1G2PO!8lQ`O'#IrO#LvQ`O,5<zOOQ!0Lh,5<w,5<wO!,TQMhO'#IuO#MdQMjO,5=XO!,TQMhO'#IwO#NVQMjO,5=ZO!&zQMhO,5=]OOQO1G2S1G2SO#NaQ!dO'#CrO#NtQ(CWO'#ErO$ |QpO'#GbO$!dQ!dO,5<sO$!kQ`O'#K[O9eQ`O'#K[O$!yQ`O,5<uO$#aQ!dO'#C{O!,TQMhO,5<tO$#kQ`O'#GZO$$PQ`O,5<tO$$UQ!dO'#GWO$$cQ!dO'#K]O$$mQ`O'#K]O!&zQMhO'#K]O$$rQ`O,5<xO$$wQlO'#JvO$%RQpO'#GcO#$`QpO'#GcO$%dQ`O'#GgO!3oQ`O'#GkO$%iQ!0LrO'#ItO$%tQpO,5<|OOQ!0Lp,5<|,5<|O$%{QpO'#GcO$&YQpO'#GdO$&kQpO'#GdO$&pQMjO,5=XO$'QQMjO,5=ZOOQ!0Lh,5=^,5=^O!,TQMhO,5@VO!,TQMhO,5@VO$'bQ`O'#IyO$'vQ`O,5@UO$(OQ`O,59aOOQ!0Lh,59i,59iO$(TQ`O,5@VO$)TQ$IYO,59uOOQ!0Lh'#Jp'#JpO$)vQMjO,5<kO$*iQMjO,5<mO@zQ`O,5<oOOQ!0Lh,5<p,5<pO$*sQ`O,5<vO$*xQMjO,5<{O$+YQ`O'#KPO!$wQlO1G2RO$+_Q`O1G2RO9eQ`O'#KSO9eQ`O'#EtO%[QlO'#EtO9eQ`O'#I{O$+dQ!0LrO,5@{OOQ[1G2}1G2}OOQ[1G4`1G4`OOQ!0Lf1G/|1G/|OOQ!0Lf1G/z1G/zO$-fQ!0MxO1G0UOOQ[1G2y1G2yO!&zQMhO1G2yO%[QlO1G2yO#.tQ`O1G2yO$/jQMhO'#EkOOQ!0Lb,5@T,5@TO$/wQ!0LrO,5@TOOQ[1G.u1G.uO!ByQ!0LrO1G.uO!CUQpO1G.uO!C^QMhO1G.uO$0YQ`O1G0uO$0_Q`O'#CiO$0jQ`O'#KeO$0rQ`O,5=|O$0wQ`O'#KeO$0|Q`O'#KeO$1[Q`O'#JRO$1jQ`O,5AOO$1rQ!fO1G1iOOQ!0Lf1G1k1G1kO9kQ`O1G3fO@zQ`O1G3fO$1yQ`O1G3fO$2OQ`O1G3fO!DiQ`O1G3fO9uQ!0LrO1G3fOOQ[1G3f1G3fO!EcQ`O1G3UO!&zQMhO1G3RO$2TQ`O1G3ROOQ[1G3S1G3SO!&zQMhO1G3SO$2YQ`O1G3SO$2bQpO'#HQOOQ[1G3U1G3UO!6_QpO'#I}O!EhQ!bO1G3XOOQ[1G3X1G3XOOQ[,5=r,5=rO$2jQMhO,5=tO9kQ`O,5=tO$%dQ`O,5=vO9`Q`O,5=vO!CUQpO,5=vO!C^QMhO,5=vO:dQMhO,5=vO$2xQ`O'#KcO$3TQ`O,5=wOOQ[1G.k1G.kO$3YQ!0LrO1G.kO@zQ`O1G.kO$3eQ`O1G.kO9uQ!0LrO1G.kO$5mQ!fO,5AQO$5zQ`O,5AQO9eQ`O,5AQO$6VQlO,5>PO$6^Q`O,5>POOQ[1G3i1G3iO`QlO1G3iOOQ[1G3o1G3oOOQ[1G3q1G3qO?TQ`O1G3sO$6cQlO1G3uO$:gQlO'#HtOOQ[1G3x1G3xO$:tQ`O'#HzO?YQ`O'#H|OOQ[1G4O1G4OO$:|QlO1G4OO9uQ!0LrO1G4UOOQ[1G4W1G4WOOQ!0Lb'#G_'#G_O9uQ!0LrO1G4YO9uQ!0LrO1G4[O$?TQ`O,5@bO!)[QlO,5;`O9eQ`O,5;`O?YQ`O,5:XO!)[QlO,5:XO!CUQpO,5:XO$?YQ?MtO,5:XOOQO,5;`,5;`O$?dQpO'#IeO$?zQ`O,5@aOOQ!0Lf1G/r1G/rO$@SQpO'#IkO$@^Q`O,5@pOOQ!0Lb1G0y1G0yO#$`QpO,5:XOOQO'#Ig'#IgO$@fQpO,5:qOOQ!0Ln,5:q,5:qO#(ZQ`O1G0ZOOQ!0Lf1G0Z1G0ZO%[QlO1G0ZOOQ!0Lf1G0t1G0tO?YQ`O1G0tO!CUQpO1G0tO!C^QMhO1G0tOOQ!0Lb1G5|1G5|O!ByQ!0LrO1G0^OOQO1G0m1G0mO%[QlO1G0mO$@mQ!0LrO1G0mO$@xQ!0LrO1G0mO!CUQpO1G0^ODWQpO1G0^O$AWQ!0LrO1G0mOOQO1G0^1G0^O$AlQ!0MxO1G0mPOOO-E<[-E<[POOO1G.h1G.hOOOO1G/i1G/iO$AvQ!bO,5<iO$BOQ!fO1G4jOOQO1G4p1G4pO%[QlO,5?OO$BYQ`O1G5zO$BbQ`O1G6YO$BjQ!fO1G6ZO9eQ`O,5?UO$BtQ!0MxO1G6WO%[QlO1G6WO$CUQ!0LrO1G6WO$CgQ`O1G6VO$CgQ`O1G6VO9eQ`O1G6VO$CoQ`O,5?XO9eQ`O,5?XOOQO,5?X,5?XO$DTQ`O,5?XO$+YQ`O,5?XOOQO-E<k-E<kOOQS1G0a1G0aOOQS1G0c1G0cO#.lQ`O1G0cOOQ[7+(e7+(eO!&zQMhO7+(eO%[QlO7+(eO$DcQ`O7+(eO$DnQMhO7+(eO$D|Q!0MzO,5=XO$GXQ!0MzO,5=ZO$IdQ!0MzO,5=XO$KuQ!0MzO,5=ZO$NWQ!0MzO,59uO%!]Q!0MzO,5<kO%$hQ!0MzO,5<mO%&sQ!0MzO,5<{OOQ!0Lf7+&a7+&aO%)UQ!0MxO7+&aO%)xQlO'#IfO%*VQ`O,5@cO%*_Q!fO,5@cOOQ!0Lf1G0P1G0PO%*iQ`O7+&jOOQ!0Lf7+&j7+&jO%*nQ?MtO,5:fO%[QlO7+&zO%*xQ?MtO,5:bO%+VQ?MtO,5:jO%+aQ?MtO,5:lO%+kQMhO'#IiO%+uQ`O,5@hOOQ!0Lh1G0d1G0dOOQO1G1r1G1rOOQO1G1s1G1sO%+}Q!jO,5<ZO!)[QlO,5<YOOQO-E<l-E<lOOQ!0Lf7+'Y7+'YOOOW7+'e7+'eOOOW1G1|1G1|O%,YQ`O1G1|OOQ!0Lf1G2O1G2OOOOO,59o,59oO%,_Q!dO,59oOOOO-E<`-E<`OOQ!0Lh1G/X1G/XO%,fQ!0MxO7+'kOOQ!0Lh,5?^,5?^O%-YQMhO1G2fP%-aQ`O'#IrPOQ!0Lh-E<p-E<pO%-}QMjO,5?aOOQ!0Lh-E<s-E<sO%.pQMjO,5?cOOQ!0Lh-E<u-E<uO%.zQ!dO1G2wO%/RQ!dO'#CrO%/iQMhO'#KSO$$wQlO'#JvOOQ!0Lh1G2_1G2_O%/sQ`O'#IqO%0[Q`O,5@vO%0[Q`O,5@vO%0dQ`O,5@vO%0oQ`O,5@vOOQO1G2a1G2aO%0}QMjO1G2`O$+YQ`O'#K[O!,TQMhO1G2`O%1_Q(CWO'#IsO%1lQ`O,5@wO!&zQMhO,5@wO%1tQ!dO,5@wOOQ!0Lh1G2d1G2dO%4UQ!fO'#CiO%4`Q`O,5=POOQ!0Lb,5<},5<}O%4hQpO,5<}OOQ!0Lb,5=O,5=OOCwQ`O,5<}O%4sQpO,5<}OOQ!0Lb,5=R,5=RO$+YQ`O,5=VOOQO,5?`,5?`OOQO-E<r-E<rOOQ!0Lp1G2h1G2hO#$`QpO,5<}O$$wQlO,5=PO%5RQ`O,5=OO%5^QpO,5=OO!,TQMhO'#IuO%6WQMjO1G2sO!,TQMhO'#IwO%6yQMjO1G2uO%7TQMjO1G5qO%7_QMjO1G5qOOQO,5?e,5?eOOQO-E<w-E<wOOQO1G.{1G.{O!,TQMhO1G5qO!,TQMhO1G5qO!:]QpO,59wO%[QlO,59wOOQ!0Lh,5<j,5<jO%7lQ`O1G2ZO!,TQMhO1G2bO%7qQ!0MxO7+'mOOQ!0Lf7+'m7+'mO!$wQlO7+'mO%8eQ`O,5;`OOQ!0Lb,5?g,5?gOOQ!0Lb-E<y-E<yO%8jQ!dO'#K^O#(ZQ`O7+(eO4UQ!fO7+(eO$DfQ`O7+(eO%8tQ!0MvO'#CiO%9XQ!0MvO,5=SO%9lQ`O,5=SO%9tQ`O,5=SOOQ!0Lb1G5o1G5oOOQ[7+$a7+$aO!ByQ!0LrO7+$aO!CUQpO7+$aO!$wQlO7+&aO%9yQ`O'#JQO%:bQ`O,5APOOQO1G3h1G3hO9kQ`O,5APO%:bQ`O,5APO%:jQ`O,5APOOQO,5?m,5?mOOQO-E=P-E=POOQ!0Lf7+'T7+'TO%:oQ`O7+)QO9uQ!0LrO7+)QO9kQ`O7+)QO@zQ`O7+)QO%:tQ`O7+)QOOQ[7+)Q7+)QOOQ[7+(p7+(pO%:yQ!0MvO7+(mO!&zQMhO7+(mO!E^Q`O7+(nOOQ[7+(n7+(nO!&zQMhO7+(nO%;TQ`O'#KbO%;`Q`O,5=lOOQO,5?i,5?iOOQO-E<{-E<{OOQ[7+(s7+(sO%<rQpO'#HZOOQ[1G3`1G3`O!&zQMhO1G3`O%[QlO1G3`O%<yQ`O1G3`O%=UQMhO1G3`O9uQ!0LrO1G3bO$%dQ`O1G3bO9`Q`O1G3bO!CUQpO1G3bO!C^QMhO1G3bO%=dQ`O'#JPO%=xQ`O,5@}O%>QQpO,5@}OOQ!0Lb1G3c1G3cOOQ[7+$V7+$VO@zQ`O7+$VO9uQ!0LrO7+$VO%>]Q`O7+$VO%[QlO1G6lO%[QlO1G6mO%>bQ!0LrO1G6lO%>lQlO1G3kO%>sQ`O1G3kO%>xQlO1G3kOOQ[7+)T7+)TO9uQ!0LrO7+)_O`QlO7+)aOOQ['#Kh'#KhOOQ['#JS'#JSO%?PQlO,5>`OOQ[,5>`,5>`O%[QlO'#HuO%?^Q`O'#HwOOQ[,5>f,5>fO9eQ`O,5>fOOQ[,5>h,5>hOOQ[7+)j7+)jOOQ[7+)p7+)pOOQ[7+)t7+)tOOQ[7+)v7+)vO%?cQpO1G5|O%?}Q?MtO1G0zO%@XQ`O1G0zOOQO1G/s1G/sO%@dQ?MtO1G/sO?YQ`O1G/sO!)[QlO'#DmOOQO,5?P,5?POOQO-E<c-E<cOOQO,5?V,5?VOOQO-E<i-E<iO!CUQpO1G/sOOQO-E<e-E<eOOQ!0Ln1G0]1G0]OOQ!0Lf7+%u7+%uO#(ZQ`O7+%uOOQ!0Lf7+&`7+&`O?YQ`O7+&`O!CUQpO7+&`OOQO7+%x7+%xO$AlQ!0MxO7+&XOOQO7+&X7+&XO%[QlO7+&XO%@nQ!0LrO7+&XO!ByQ!0LrO7+%xO!CUQpO7+%xO%@yQ!0LrO7+&XO%AXQ!0MxO7++rO%[QlO7++rO%AiQ`O7++qO%AiQ`O7++qOOQO1G4s1G4sO9eQ`O1G4sO%AqQ`O1G4sOOQS7+%}7+%}O#(ZQ`O<<LPO4UQ!fO<<LPO%BPQ`O<<LPOOQ[<<LP<<LPO!&zQMhO<<LPO%[QlO<<LPO%BXQ`O<<LPO%BdQ!0MzO,5?aO%DoQ!0MzO,5?cO%FzQ!0MzO1G2`O%I]Q!0MzO1G2sO%KhQ!0MzO1G2uO%MsQ!fO,5?QO%[QlO,5?QOOQO-E<d-E<dO%M}Q`O1G5}OOQ!0Lf<<JU<<JUO%NVQ?MtO1G0uO&!^Q?MtO1G1PO&!eQ?MtO1G1PO&$fQ?MtO1G1PO&$mQ?MtO1G1PO&&nQ?MtO1G1PO&(oQ?MtO1G1PO&(vQ?MtO1G1PO&(}Q?MtO1G1PO&+OQ?MtO1G1PO&+VQ?MtO1G1PO&+^Q!0MxO<<JfO&-UQ?MtO1G1PO&.RQ?MvO1G1PO&/UQ?MvO'#JlO&1[Q?MtO1G1cO&1iQ?MtO1G0UO&1sQMjO,5?TOOQO-E<g-E<gO!)[QlO'#FqOOQO'#KZ'#KZOOQO1G1u1G1uO&1}Q`O1G1tO&2SQ?MtO,5?[OOOW7+'h7+'hOOOO1G/Z1G/ZO&2^Q!dO1G4xOOQ!0Lh7+(Q7+(QP!&zQMhO,5?^O!,TQMhO7+(cO&2eQ`O,5?]O9eQ`O,5?]O$+YQ`O,5?]OOQO-E<o-E<oO&2sQ`O1G6bO&2sQ`O1G6bO&2{Q`O1G6bO&3WQMjO7+'zO&3hQ!dO,5?_O&3rQ`O,5?_O!&zQMhO,5?_OOQO-E<q-E<qO&3wQ!dO1G6cO&4RQ`O1G6cO&4ZQ`O1G2kO!&zQMhO1G2kOOQ!0Lb1G2i1G2iOOQ!0Lb1G2j1G2jO%4hQpO1G2iO!CUQpO1G2iOCwQ`O1G2iOOQ!0Lb1G2q1G2qO&4`QpO1G2iO&4nQ`O1G2kO$+YQ`O1G2jOCwQ`O1G2jO$$wQlO1G2kO&4vQ`O1G2jO&5jQMjO,5?aOOQ!0Lh-E<t-E<tO&6]QMjO,5?cOOQ!0Lh-E<v-E<vO!,TQMhO7++]O&6gQMjO7++]O&6qQMjO7++]OOQ!0Lh1G/c1G/cO&7OQ`O1G/cOOQ!0Lh7+'u7+'uO&7TQMjO7+'|O&7eQ!0MxO<<KXOOQ!0Lf<<KX<<KXO&8XQ`O1G0zO!&zQMhO'#IzO&8^Q`O,5@xO&:`Q!fO<<LPO!&zQMhO1G2nO&:gQ!0LrO1G2nOOQ[<<G{<<G{O!ByQ!0LrO<<G{O&:xQ!0MxO<<I{OOQ!0Lf<<I{<<I{OOQO,5?l,5?lO&;lQ`O,5?lO&;qQ`O,5?lOOQO-E=O-E=OO&<PQ`O1G6kO&<PQ`O1G6kO9kQ`O1G6kO@zQ`O<<LlOOQ[<<Ll<<LlO&<XQ`O<<LlO9uQ!0LrO<<LlO9kQ`O<<LlOOQ[<<LX<<LXO%:yQ!0MvO<<LXOOQ[<<LY<<LYO!E^Q`O<<LYO&<^QpO'#I|O&<iQ`O,5@|O!)[QlO,5@|OOQ[1G3W1G3WOOQO'#JO'#JOO9uQ!0LrO'#JOO&<qQpO,5=uOOQ[,5=u,5=uO&<xQpO'#EgO&=PQpO'#GeO&=UQ`O7+(zO&=ZQ`O7+(zOOQ[7+(z7+(zO!&zQMhO7+(zO%[QlO7+(zO&=cQ`O7+(zOOQ[7+(|7+(|O9uQ!0LrO7+(|O$%dQ`O7+(|O9`Q`O7+(|O!CUQpO7+(|O&=nQ`O,5?kOOQO-E<}-E<}OOQO'#H^'#H^O&=yQ`O1G6iO9uQ!0LrO<<GqOOQ[<<Gq<<GqO@zQ`O<<GqO&>RQ`O7+,WO&>WQ`O7+,XO%[QlO7+,WO%[QlO7+,XOOQ[7+)V7+)VO&>]Q`O7+)VO&>bQlO7+)VO&>iQ`O7+)VOOQ[<<Ly<<LyOOQ[<<L{<<L{OOQ[-E=Q-E=QOOQ[1G3z1G3zO&>nQ`O,5>aOOQ[,5>c,5>cO&>sQ`O1G4QO9eQ`O7+&fO!)[QlO7+&fOOQO7+%_7+%_O&>xQ?MtO1G6ZO?YQ`O7+%_OOQ!0Lf<<Ia<<IaOOQ!0Lf<<Iz<<IzO?YQ`O<<IzOOQO<<Is<<IsO$AlQ!0MxO<<IsO%[QlO<<IsOOQO<<Id<<IdO!ByQ!0LrO<<IdO&?SQ!0LrO<<IsO&?_Q!0MxO<= ^O&?oQ`O<= ]OOQO7+*_7+*_O9eQ`O7+*_OOQ[ANAkANAkO&?wQ!fOANAkO!&zQMhOANAkO#(ZQ`OANAkO4UQ!fOANAkO&@OQ`OANAkO%[QlOANAkO&@WQ!0MzO7+'zO&BiQ!0MzO,5?aO&DtQ!0MzO,5?cO&GPQ!0MzO7+'|O&IbQ!fO1G4lO&IlQ?MtO7+&aO&KpQ?MvO,5=XO&MwQ?MvO,5=ZO&NXQ?MvO,5=XO&NiQ?MvO,5=ZO&NyQ?MvO,59uO'#PQ?MvO,5<kO'%SQ?MvO,5<mO''hQ?MvO,5<{O')^Q?MtO7+'kO')kQ?MtO7+'mO')xQ`O,5<]OOQO7+'`7+'`OOQ!0Lh7+*d7+*dO')}QMjO<<K}OOQO1G4w1G4wO'*UQ`O1G4wO'*aQ`O1G4wO'*oQ`O7++|O'*oQ`O7++|O!&zQMhO1G4yO'*wQ!dO1G4yO'+RQ`O7++}O'+ZQ`O7+(VO'+fQ!dO7+(VOOQ!0Lb7+(T7+(TOOQ!0Lb7+(U7+(UO!CUQpO7+(TOCwQ`O7+(TO'+pQ`O7+(VO!&zQMhO7+(VO$+YQ`O7+(UO'+uQ`O7+(VOCwQ`O7+(UO'+}QMjO<<NwO!,TQMhO<<NwOOQ!0Lh7+$}7+$}O',XQ!dO,5?fOOQO-E<x-E<xO',cQ!0MvO7+(YO!&zQMhO7+(YOOQ[AN=gAN=gO9kQ`O1G5WOOQO1G5W1G5WO',sQ`O1G5WO',xQ`O7+,VO',xQ`O7+,VO9uQ!0LrOANBWO@zQ`OANBWOOQ[ANBWANBWO'-QQ`OANBWOOQ[ANAsANAsOOQ[ANAtANAtO'-VQ`O,5?hOOQO-E<z-E<zO'-bQ?MtO1G6hOOQO,5?j,5?jOOQO-E<|-E<|OOQ[1G3a1G3aO'-lQ`O,5=POOQ[<<Lf<<LfO!&zQMhO<<LfO&=UQ`O<<LfO'-qQ`O<<LfO%[QlO<<LfOOQ[<<Lh<<LhO9uQ!0LrO<<LhO$%dQ`O<<LhO9`Q`O<<LhO'-yQpO1G5VO'.UQ`O7+,TOOQ[AN=]AN=]O9uQ!0LrOAN=]OOQ[<= r<= rOOQ[<= s<= sO'.^Q`O<= rO'.cQ`O<= sOOQ[<<Lq<<LqO'.hQ`O<<LqO'.mQlO<<LqOOQ[1G3{1G3{O?YQ`O7+)lO'.tQ`O<<JQO'/PQ?MtO<<JQOOQO<<Hy<<HyOOQ!0LfAN?fAN?fOOQOAN?_AN?_O$AlQ!0MxOAN?_OOQOAN?OAN?OO%[QlOAN?_OOQO<<My<<MyOOQ[G27VG27VO!&zQMhOG27VO#(ZQ`OG27VO'/ZQ!fOG27VO4UQ!fOG27VO'/bQ`OG27VO'/jQ?MtO<<JfO'/wQ?MvO1G2`O'1mQ?MvO,5?aO'3pQ?MvO,5?cO'5sQ?MvO1G2sO'7vQ?MvO1G2uO'9yQ?MtO<<KXO':WQ?MtO<<I{OOQO1G1w1G1wO!,TQMhOANAiOOQO7+*c7+*cO':eQ`O7+*cO':pQ`O<= hO':xQ!dO7+*eOOQ!0Lb<<Kq<<KqO$+YQ`O<<KqOCwQ`O<<KqO';SQ`O<<KqO!&zQMhO<<KqOOQ!0Lb<<Ko<<KoO!CUQpO<<KoO';_Q!dO<<KqOOQ!0Lb<<Kp<<KpO';iQ`O<<KqO!&zQMhO<<KqO$+YQ`O<<KpO';nQMjOANDcO';xQ!0MvO<<KtOOQO7+*r7+*rO9kQ`O7+*rO'<YQ`O<= qOOQ[G27rG27rO9uQ!0LrOG27rO@zQ`OG27rO!)[QlO1G5SO'<bQ`O7+,SO'<jQ`O1G2kO&=UQ`OANBQOOQ[ANBQANBQO!&zQMhOANBQO'<oQ`OANBQOOQ[ANBSANBSO9uQ!0LrOANBSO$%dQ`OANBSOOQO'#H_'#H_OOQO7+*q7+*qOOQ[G22wG22wOOQ[ANE^ANE^OOQ[ANE_ANE_OOQ[ANB]ANB]O'<wQ`OANB]OOQ[<<MW<<MWO!)[QlOAN?lOOQOG24yG24yO$AlQ!0MxOG24yO#(ZQ`OLD,qOOQ[LD,qLD,qO!&zQMhOLD,qO'<|Q!fOLD,qO'=TQ?MvO7+'zO'>yQ?MvO,5?aO'@|Q?MvO,5?cO'CPQ?MvO7+'|O'DuQMjOG27TOOQO<<M}<<M}OOQ!0LbANA]ANA]O$+YQ`OANA]OCwQ`OANA]O'EVQ!dOANA]OOQ!0LbANAZANAZO'E^Q`OANA]O!&zQMhOANA]O'EiQ!dOANA]OOQ!0LbANA[ANA[OOQO<<N^<<N^OOQ[LD-^LD-^O9uQ!0LrOLD-^O'EsQ?MtO7+*nOOQO'#Gf'#GfOOQ[G27lG27lO&=UQ`OG27lO!&zQMhOG27lOOQ[G27nG27nO9uQ!0LrOG27nOOQ[G27wG27wO'E}Q?MtOG25WOOQOLD*eLD*eOOQ[!$(!]!$(!]O#(ZQ`O!$(!]O!&zQMhO!$(!]O'FXQ!0MzOG27TOOQ!0LbG26wG26wO$+YQ`OG26wO'HjQ`OG26wOCwQ`OG26wO'HuQ!dOG26wO!&zQMhOG26wOOQ[!$(!x!$(!xOOQ[LD-WLD-WO&=UQ`OLD-WOOQ[LD-YLD-YOOQ[!)9Ew!)9EwO#(ZQ`O!)9EwOOQ!0LbLD,cLD,cO$+YQ`OLD,cOCwQ`OLD,cO'H|Q`OLD,cO'IXQ!dOLD,cOOQ[!$(!r!$(!rOOQ[!.K;c!.K;cO'I`Q?MvOG27TOOQ!0Lb!$( }!$( }O$+YQ`O!$( }OCwQ`O!$( }O'KUQ`O!$( }OOQ!0Lb!)9Ei!)9EiO$+YQ`O!)9EiOCwQ`O!)9EiOOQ!0Lb!.K;T!.K;TO$+YQ`O!.K;TOOQ!0Lb!4/0o!4/0oO!)[QlO'#DzO1PQ`O'#EXO'KaQ!fO'#JrO'KhQ!L^O'#DvO'KoQlO'#EOO'KvQ!fO'#CiO'N^Q!fO'#CiO!)[QlO'#EQO'NnQlO,5;ZO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO'#IpO(!qQ`O,5<iO!)[QlO,5;eO(!yQMhO,5;eO($dQMhO,5;eO!)[QlO,5;wO!&zQMhO'#GmO(!yQMhO'#GmO!&zQMhO'#GoO(!yQMhO'#GoO1SQ`O'#DZO1SQ`O'#DZO!&zQMhO'#GPO(!yQMhO'#GPO!&zQMhO'#GRO(!yQMhO'#GRO!&zQMhO'#GaO(!yQMhO'#GaO!)[QlO,5:jO($kQpO'#D_O($uQpO'#JvO!)[QlO,5@oO'NnQlO1G0uO(%PQ?MtO'#CiO!)[QlO1G2PO!&zQMhO'#IuO(!yQMhO'#IuO!&zQMhO'#IwO(!yQMhO'#IwO(%ZQ!dO'#CrO!&zQMhO,5<tO(!yQMhO,5<tO'NnQlO1G2RO!)[QlO7+&zO!&zQMhO1G2`O(!yQMhO1G2`O!&zQMhO'#IuO(!yQMhO'#IuO!&zQMhO'#IwO(!yQMhO'#IwO!&zQMhO1G2bO(!yQMhO1G2bO'NnQlO7+'mO'NnQlO7+&aO!&zQMhOANAiO(!yQMhOANAiO(%nQ`O'#EoO(%sQ`O'#EoO(%{Q`O'#F]O(&QQ`O'#EyO(&VQ`O'#KTO(&bQ`O'#KRO(&mQ`O,5;ZO(&rQMjO,5<eO(&yQ`O'#GYO('OQ`O'#GYO('TQ`O,5<eO(']Q`O,5<gO('eQ`O,5;ZO('mQ?MtO1G1`O('tQ`O,5<tO('yQ`O,5<tO((OQ`O,5<vO((TQ`O,5<vO((YQ`O1G2RO((_Q`O1G0uO((dQMjO<<K}O((kQMjO<<K}O((rQMhO'#F|O9`Q`O'#F{OAuQ`O'#EnO!)[QlO,5;tO!3oQ`O'#GYO!3oQ`O'#GYO!3oQ`O'#G[O!3oQ`O'#G[O!,TQMhO7+(cO!,TQMhO7+(cO%.zQ!dO1G2wO%.zQ!dO1G2wO!&zQMhO,5=]O!&zQMhO,5=]",
  stateData: "()x~O'|OS'}OSTOS(ORQ~OPYOQYOSfOY!VOaqOdzOeyOl!POpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!uwO!xxO!|]O$W|O$niO%h}O%j!QO%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO%y!UO&W!WO&^!XO&`!YO&b!ZO&d![O&g!]O&m!^O&s!_O&u!`O&w!aO&y!bO&{!cO(TSO(VTO(YUO(aVO(o[O~OWtO~P`OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oa!wOs!nO!S!oO!b!yO!c!vO!d!vO!|<VO#T!pO#U!pO#V!xO#W!pO#X!pO#[!zO#]!zO(U!lO(VTO(YUO(e!mO(o!sO~O(O!{O~OP]XR]X[]Xa]Xj]Xr]X!Q]X!S]X!]]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X'z]X(a]X(r]X(y]X(z]X~O!g%RX~P(qO_!}O(V#PO(W!}O(X#PO~O_#QO(X#PO(Y#PO(Z#QO~Ox#SO!U#TO(b#TO(c#VO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T<ZO(VTO(YUO(aVO(o[O~O![#ZO!]#WO!Y(hP!Y(vP~P+}O!^#cO~P`OPYOQYOSfOd!jOe!iOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(VTO(YUO(aVO(o[O~Op#mO![#iO!|]O#i#lO#j#iO(T<[O!k(sP~P.iO!l#oO(T#nO~O!x#sO!|]O%h#tO~O#k#uO~O!g#vO#k#uO~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!]$_O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~Oa(fX'z(fX'w(fX!k(fX!Y(fX!_(fX%i(fX!g(fX~P1qO#S$dO#`$eO$Q$eOP(gXR(gX[(gXj(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX!_(gX%i(gX~Oa(gX'z(gX'w(gX!Y(gX!k(gXv(gX!g(gX~P4UO#`$eO~O$]$hO$_$gO$f$mO~OSfO!_$nO$i$oO$k$qO~Oh%VOj%dOk%dOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#j%cO$W%`O$t%^O$v%_O$y%aO(T$sO(VTO(YUO(a$uO(y$}O(z%POg(^P~Ol%[O~P7eO!l%eO~O!S%hO!_%iO(T%gO~O!g%mO~Oa%nO'z%nO~O!Q%rO~P%[O(U!lO~P%[O%n%vO~P%[Oh%VO!l%eO(T%gO(U!lO~Oe%}O!l%eO(T%gO~Oj$RO~O!_&PO(T%gO(U!lO(VTO(YUO`)WP~O!Q&SO!l&RO%j&VO&T&WO~P;SO!x#sO~O%s&YO!S)SX!_)SX(T)SX~O(T&ZO~Ol!PO!u&`O%j!QO%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO~Od&eOe&dO!x&bO%h&cO%{&aO~P<bOd&hOeyOl!PO!_&gO!u&`O!xxO!|]O%h}O%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO%y!UO~Ob&kO#`&nO%j&iO(U!lO~P=gO!l&oO!u&sO~O!l#oO~O!_XO~Oa%nO'x&{O'z%nO~Oa%nO'x'OO'z%nO~Oa%nO'x'QO'z%nO~O'w]X!Y]Xv]X!k]X&[]X!_]X%i]X!g]X~P(qO!b'_O!c'WO!d'WO(U!lO(VTO(YUO~Os'UO!S'TO!['XO(e'SO!^(iP!^(xP~P@nOn'bO!_'`O(T%gO~Oe'gO!l%eO(T%gO~O!Q&SO!l&RO~Os!nO!S!oO!|<VO#T!pO#U!pO#W!pO#X!pO(U!lO(VTO(YUO(e!mO(o!sO~O!b'mO!c'lO!d'lO#V!pO#['nO#]'nO~PBYOa%nOh%VO!g#vO!l%eO'z%nO(r'pO~O!p'tO#`'rO~PChOs!nO!S!oO(VTO(YUO(e!mO(o!sO~O!_XOs(mX!S(mX!b(mX!c(mX!d(mX!|(mX#T(mX#U(mX#V(mX#W(mX#X(mX#[(mX#](mX(U(mX(V(mX(Y(mX(e(mX(o(mX~O!c'lO!d'lO(U!lO~PDWO(P'xO(Q'xO(R'zO~O_!}O(V'|O(W!}O(X'|O~O_#QO(X'|O(Y'|O(Z#QO~Ov(OO~P%[Ox#SO!U#TO(b#TO(c(RO~O![(TO!Y'WX!Y'^X!]'WX!]'^X~P+}O!](VO!Y(hX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!](VO!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~O!Y(hX~PHRO!Y([O~O!Y(uX!](uX!g(uX!k(uX(r(uX~O#`(uX#k#dX!^(uX~PJUO#`(]O!Y(wX!](wX~O!](^O!Y(vX~O!Y(aO~O#`$eO~PJUO!^(bO~P`OR#zO!Q#yO!S#{O!l#xO(aVOP!na[!naj!nar!na!]!na!p!na#R!na#n!na#o!na#p!na#q!na#r!na#s!na#t!na#u!na#v!na#x!na#z!na#{!na(r!na(y!na(z!na~Oa!na'z!na'w!na!Y!na!k!nav!na!_!na%i!na!g!na~PKlO!k(cO~O!g#vO#`(dO(r'pO!](tXa(tX'z(tX~O!k(tX~PNXO!S%hO!_%iO!|]O#i(iO#j(hO(T%gO~O!](jO!k(sX~O!k(lO~O!S%hO!_%iO#j(hO(T%gO~OP(gXR(gX[(gXj(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX~O!g#vO!k(gX~P! uOR(nO!Q(mO!l#xO#S$dO!|!{a!S!{a~O!x!{a%h!{a!_!{a#i!{a#j!{a(T!{a~P!#vO!x(rO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~O#k(xO~O![(zO!k(kP~P%[O(e(|O(o[O~O!S)OO!l#xO(e(|O(o[O~OP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_!eO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(T)]O(VTO(YUO(aVO(o[O~O!]$_Oa$qa'z$qa'w$qa!k$qa!Y$qa!_$qa%i$qa!g$qa~Ol)dO~P!&zOh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#j%cO$W%`O$t%^O$v%_O$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~Og(pP~P!,TO!Q)iO!g)hO!_$^X$Z$^X$]$^X$_$^X$f$^X~O!g)hO!_({X$Z({X$]({X$_({X$f({X~O!Q)iO~P!.^O!Q)iO!_({X$Z({X$]({X$_({X$f({X~O!_)kO$Z)oO$])jO$_)jO$f)pO~O![)sO~P!)[O$]$hO$_$gO$f)wO~On$zX!Q$zX#S$zX'y$zX(y$zX(z$zX~OgmXg$zXnmX!]mX#`mX~P!0SOx)yO(b)zO(c)|O~On*VO!Q*OO'y*PO(y$}O(z%PO~Og)}O~P!1WOg*WO~Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<sO!S*YO!_*ZO!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(VTO(YUO(a$uO(y$}O(z%PO~Op*`O![*^O(T*XO!k)OP~P!1uO#k*aO~O!l*bO~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(T*dO(VTO(YUO(a$uO(y$}O(z%PO~O![*gO!Y)PP~P!3tOr*sOs!nO!S*iO!b*qO!c*kO!d*kO!l*bO#[*rO%`*mO(U!lO(VTO(YUO(e!mO~O!^*pO~P!5iO#S$dOn(`X!Q(`X'y(`X(y(`X(z(`X!](`X#`(`X~Og(`X$O(`X~P!6kOn*xO#`*wOg(_X!](_X~O!]*yOg(^X~Oj%dOk%dOl%dO(T&ZOg(^P~Os*|O~Og)}O(T&ZO~O!l+SO~O(T(vO~Op+WO!S%hO![#iO!_%iO!|]O#i#lO#j#iO(T%gO!k(sP~O!g#vO#k+XO~O!S%hO![+ZO!](^O!_%iO(T%gO!Y(vP~Os'[O!S+]O![+[O(VTO(YUO(e(|O~O!^(xP~P!9|O!]+^Oa)TX'z)TX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~Oa!ja!]!ja'z!ja'w!ja!Y!ja!k!jav!ja!_!ja%i!ja!g!ja~P!:tOR#zO!Q#yO!S#{O!l#xO(aVOP!ra[!raj!rar!ra!]!ra!p!ra#R!ra#n!ra#o!ra#p!ra#q!ra#r!ra#s!ra#t!ra#u!ra#v!ra#x!ra#z!ra#{!ra(r!ra(y!ra(z!ra~Oa!ra'z!ra'w!ra!Y!ra!k!rav!ra!_!ra%i!ra!g!ra~P!=[OR#zO!Q#yO!S#{O!l#xO(aVOP!ta[!taj!tar!ta!]!ta!p!ta#R!ta#n!ta#o!ta#p!ta#q!ta#r!ta#s!ta#t!ta#u!ta#v!ta#x!ta#z!ta#{!ta(r!ta(y!ta(z!ta~Oa!ta'z!ta'w!ta!Y!ta!k!tav!ta!_!ta%i!ta!g!ta~P!?rOh%VOn+gO!_'`O%i+fO~O!g+iOa(]X!_(]X'z(]X!](]X~Oa%nO!_XO'z%nO~Oh%VO!l%eO~Oh%VO!l%eO(T%gO~O!g#vO#k(xO~Ob+tO%j+uO(T+qO(VTO(YUO!^)XP~O!]+vO`)WX~O[+zO~O`+{O~O!_&PO(T%gO(U!lO`)WP~O%j,OO~P;SOh%VO#`,SO~Oh%VOn,VO!_$|O~O!_,XO~O!Q,ZO!_XO~O%n%vO~O!x,`O~Oe,eO~Ob,fO(T#nO(VTO(YUO!^)VP~Oe%}O~O%j!QO(T&ZO~P=gO[,kO`,jO~OPYOQYOSfOdzOeyOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!iuO!lZO!oYO!pYO!qYO!svO!xxO!|]O$niO%h}O(VTO(YUO(aVO(o[O~O!_!eO!u!gO$W!kO(T!dO~P!FyO`,jOa%nO'z%nO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oa,pOl!OO!uwO%l!OO%m!OO%n!OO~P!IcO!l&oO~O&^,vO~O!_,xO~O&o,zO&q,{OP&laQ&laS&laY&laa&lad&lae&lal&lap&lar&las&lat&laz&la|&la!O&la!S&la!W&la!X&la!_&la!i&la!l&la!o&la!p&la!q&la!s&la!u&la!x&la!|&la$W&la$n&la%h&la%j&la%l&la%m&la%n&la%q&la%s&la%v&la%w&la%y&la&W&la&^&la&`&la&b&la&d&la&g&la&m&la&s&la&u&la&w&la&y&la&{&la'w&la(T&la(V&la(Y&la(a&la(o&la!^&la&e&lab&la&j&la~O(T-QO~Oh!eX!]!RX!^!RX!g!RX!g!eX!l!eX#`!RX~O!]!eX!^!eX~P#!iO!g-VO#`-UOh(jX!]#hX!^#hX!g(jX!l(jX~O!](jX!^(jX~P##[Oh%VO!g-XO!l%eO!]!aX!^!aX~Os!nO!S!oO(VTO(YUO(e!mO~OP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_!eO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(VTO(YUO(aVO(o[O~O(T=QO~P#$qO!]-]O!^(iX~O!^-_O~O!g-VO#`-UO!]#hX!^#hX~O!]-`O!^(xX~O!^-bO~O!c-cO!d-cO(U!lO~P#$`O!^-fO~P'_On-iO!_'`O~O!Y-nO~Os!{a!b!{a!c!{a!d!{a#T!{a#U!{a#V!{a#W!{a#X!{a#[!{a#]!{a(U!{a(V!{a(Y!{a(e!{a(o!{a~P!#vO!p-sO#`-qO~PChO!c-uO!d-uO(U!lO~PDWOa%nO#`-qO'z%nO~Oa%nO!g#vO#`-qO'z%nO~Oa%nO!g#vO!p-sO#`-qO'z%nO(r'pO~O(P'xO(Q'xO(R-zO~Ov-{O~O!Y'Wa!]'Wa~P!:tO![.PO!Y'WX!]'WX~P%[O!](VO!Y(ha~O!Y(ha~PHRO!](^O!Y(va~O!S%hO![.TO!_%iO(T%gO!Y'^X!]'^X~O#`.VO!](ta!k(taa(ta'z(ta~O!g#vO~P#,wO!](jO!k(sa~O!S%hO!_%iO#j.ZO(T%gO~Op.`O!S%hO![.]O!_%iO!|]O#i._O#j.]O(T%gO!]'aX!k'aX~OR.dO!l#xO~Oh%VOn.gO!_'`O%i.fO~Oa#ci!]#ci'z#ci'w#ci!Y#ci!k#civ#ci!_#ci%i#ci!g#ci~P!:tOn>]O!Q*OO'y*PO(y$}O(z%PO~O#k#_aa#_a#`#_a'z#_a!]#_a!k#_a!_#_a!Y#_a~P#/sO#k(`XP(`XR(`X[(`Xa(`Xj(`Xr(`X!S(`X!l(`X!p(`X#R(`X#n(`X#o(`X#p(`X#q(`X#r(`X#s(`X#t(`X#u(`X#v(`X#x(`X#z(`X#{(`X'z(`X(a(`X(r(`X!k(`X!Y(`X'w(`Xv(`X!_(`X%i(`X!g(`X~P!6kO!].tO!k(kX~P!:tO!k.wO~O!Y.yO~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(aVO[#mia#mij#mir#mi!]#mi#R#mi#o#mi#p#mi#q#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#n#mi~P#3cO#n$OO~P#3cOP$[OR#zOr$aO!Q#yO!S#{O!l#xO!p$[O#n$OO#o$PO#p$PO#q$PO(aVO[#mia#mij#mi!]#mi#R#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#r#mi~P#6QO#r$QO~P#6QOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO(aVOa#mi!]#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#v#mi~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO(aVO(z#}Oa#mi!]#mi#z#mi#{#mi'z#mi(r#mi(y#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#x$UO~P#;VO#x#mi~P#;VO#v$SO~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO(aVO(y#|O(z#}Oa#mi!]#mi#{#mi'z#mi(r#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#z#mi~P#={O#z$WO~P#={OP]XR]X[]Xj]Xr]X!Q]X!S]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X!]]X!^]X~O$O]X~P#@jOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO#x<eO#z<gO#{<hO(aVO(r$YO(y#|O(z#}O~O$O.{O~P#BwO#S$dO#`<nO$Q<nO$O(gX!^(gX~P! uOa'da!]'da'z'da'w'da!k'da!Y'dav'da!_'da%i'da!g'da~P!:tO[#mia#mij#mir#mi!]#mi#R#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#n$OO#o$PO#p$PO#q$PO(aVO(y#mi(z#mi~P#EyOn>]O!Q*OO'y*PO(y$}O(z%POP#miR#mi!S#mi!l#mi!p#mi#n#mi#o#mi#p#mi#q#mi(a#mi~P#EyO!]/POg(pX~P!1WOg/RO~Oa$Pi!]$Pi'z$Pi'w$Pi!Y$Pi!k$Piv$Pi!_$Pi%i$Pi!g$Pi~P!:tO$]/SO$_/SO~O$]/TO$_/TO~O!g)hO#`/UO!_$cX$Z$cX$]$cX$_$cX$f$cX~O![/VO~O!_)kO$Z/XO$])jO$_)jO$f/YO~O!]<iO!^(fX~P#BwO!^/ZO~O!g)hO$f({X~O$f/]O~Ov/^O~P!&zOx)yO(b)zO(c/aO~O!S/dO~O(y$}On%aa!Q%aa'y%aa(z%aa!]%aa#`%aa~Og%aa$O%aa~P#L{O(z%POn%ca!Q%ca'y%ca(y%ca!]%ca#`%ca~Og%ca$O%ca~P#MnO!]fX!gfX!kfX!k$zX(rfX~P!0SOp%WO![/mO!](^O(T/lO!Y(vP!Y)PP~P!1uOr*sO!b*qO!c*kO!d*kO!l*bO#[*rO%`*mO(U!lO(VTO(YUO~Os<}O!S/nO![+[O!^*pO(e<|O!^(xP~P$ [O!k/oO~P#/sO!]/pO!g#vO(r'pO!k)OX~O!k/uO~OnoX!QoX'yoX(yoX(zoX~O!g#vO!koX~P$#OOp/wO!S%hO![*^O!_%iO(T%gO!k)OP~O#k/xO~O!Y$zX!]$zX!g%RX~P!0SO!]/yO!Y)PX~P#/sO!g/{O~O!Y/}O~OpkO(T0OO~P.iOh%VOr0TO!g#vO!l%eO(r'pO~O!g+iO~Oa%nO!]0XO'z%nO~O!^0ZO~P!5iO!c0[O!d0[O(U!lO~P#$`Os!nO!S0]O(VTO(YUO(e!mO~O#[0_O~Og%aa!]%aa#`%aa$O%aa~P!1WOg%ca!]%ca#`%ca$O%ca~P!1WOj%dOk%dOl%dO(T&ZOg'mX!]'mX~O!]*yOg(^a~Og0hO~On0jO#`0iOg(_a!](_a~OR0kO!Q0kO!S0lO#S$dOn}a'y}a(y}a(z}a!]}a#`}a~Og}a$O}a~P$(cO!Q*OO'y*POn$sa(y$sa(z$sa!]$sa#`$sa~Og$sa$O$sa~P$)_O!Q*OO'y*POn$ua(y$ua(z$ua!]$ua#`$ua~Og$ua$O$ua~P$*QO#k0oO~Og%Ta!]%Ta#`%Ta$O%Ta~P!1WO!g#vO~O#k0rO~O!]+^Oa)Ta'z)Ta~OR#zO!Q#yO!S#{O!l#xO(aVOP!ri[!rij!rir!ri!]!ri!p!ri#R!ri#n!ri#o!ri#p!ri#q!ri#r!ri#s!ri#t!ri#u!ri#v!ri#x!ri#z!ri#{!ri(r!ri(y!ri(z!ri~Oa!ri'z!ri'w!ri!Y!ri!k!riv!ri!_!ri%i!ri!g!ri~P$+oOh%VOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(VTO(YUO(a$uO(y$}O(z%PO~Op0{O%]0|O(T0zO~P$.VO!g+iOa(]a!_(]a'z(]a!](]a~O#k1SO~O[]X!]fX!^fX~O!]1TO!^)XX~O!^1VO~O[1WO~Ob1YO(T+qO(VTO(YUO~O!_&PO(T%gO`'uX!]'uX~O!]+vO`)Wa~O!k1]O~P!:tO[1`O~O`1aO~O#`1fO~On1iO!_$|O~O(e(|O!^)UP~Oh%VOn1rO!_1oO%i1qO~O[1|O!]1zO!^)VX~O!^1}O~O`2POa%nO'z%nO~O(T#nO(VTO(YUO~O#S$dO#`$eO$Q$eOP(gXR(gX[(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX~Oj2SO&[2TOa(gX~P$3pOj2SO#`$eO&[2TO~Oa2VO~P%[Oa2XO~O&e2[OP&ciQ&ciS&ciY&cia&cid&cie&cil&cip&cir&cis&cit&ciz&ci|&ci!O&ci!S&ci!W&ci!X&ci!_&ci!i&ci!l&ci!o&ci!p&ci!q&ci!s&ci!u&ci!x&ci!|&ci$W&ci$n&ci%h&ci%j&ci%l&ci%m&ci%n&ci%q&ci%s&ci%v&ci%w&ci%y&ci&W&ci&^&ci&`&ci&b&ci&d&ci&g&ci&m&ci&s&ci&u&ci&w&ci&y&ci&{&ci'w&ci(T&ci(V&ci(Y&ci(a&ci(o&ci!^&cib&ci&j&ci~Ob2bO!^2`O&j2aO~P`O!_XO!l2dO~O&q,{OP&liQ&liS&liY&lia&lid&lie&lil&lip&lir&lis&lit&liz&li|&li!O&li!S&li!W&li!X&li!_&li!i&li!l&li!o&li!p&li!q&li!s&li!u&li!x&li!|&li$W&li$n&li%h&li%j&li%l&li%m&li%n&li%q&li%s&li%v&li%w&li%y&li&W&li&^&li&`&li&b&li&d&li&g&li&m&li&s&li&u&li&w&li&y&li&{&li'w&li(T&li(V&li(Y&li(a&li(o&li!^&li&e&lib&li&j&li~O!Y2jO~O!]!aa!^!aa~P#BwOs!nO!S!oO![2pO(e!mO!]'XX!^'XX~P@nO!]-]O!^(ia~O!]'_X!^'_X~P!9|O!]-`O!^(xa~O!^2wO~P'_Oa%nO#`3QO'z%nO~Oa%nO!g#vO#`3QO'z%nO~Oa%nO!g#vO!p3UO#`3QO'z%nO(r'pO~Oa%nO'z%nO~P!:tO!]$_Ov$qa~O!Y'Wi!]'Wi~P!:tO!](VO!Y(hi~O!](^O!Y(vi~O!Y(wi!](wi~P!:tO!](ti!k(tia(ti'z(ti~P!:tO#`3WO!](ti!k(tia(ti'z(ti~O!](jO!k(si~O!S%hO!_%iO!|]O#i3]O#j3[O(T%gO~O!S%hO!_%iO#j3[O(T%gO~On3dO!_'`O%i3cO~Oh%VOn3dO!_'`O%i3cO~O#k%aaP%aaR%aa[%aaa%aaj%aar%aa!S%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa'z%aa(a%aa(r%aa!k%aa!Y%aa'w%aav%aa!_%aa%i%aa!g%aa~P#L{O#k%caP%caR%ca[%caa%caj%car%ca!S%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca'z%ca(a%ca(r%ca!k%ca!Y%ca'w%cav%ca!_%ca%i%ca!g%ca~P#MnO#k%aaP%aaR%aa[%aaa%aaj%aar%aa!S%aa!]%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa'z%aa(a%aa(r%aa!k%aa!Y%aa'w%aa#`%aav%aa!_%aa%i%aa!g%aa~P#/sO#k%caP%caR%ca[%caa%caj%car%ca!S%ca!]%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca'z%ca(a%ca(r%ca!k%ca!Y%ca'w%ca#`%cav%ca!_%ca%i%ca!g%ca~P#/sO#k}aP}a[}aa}aj}ar}a!l}a!p}a#R}a#n}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#x}a#z}a#{}a'z}a(a}a(r}a!k}a!Y}a'w}av}a!_}a%i}a!g}a~P$(cO#k$saP$saR$sa[$saa$saj$sar$sa!S$sa!l$sa!p$sa#R$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#t$sa#u$sa#v$sa#x$sa#z$sa#{$sa'z$sa(a$sa(r$sa!k$sa!Y$sa'w$sav$sa!_$sa%i$sa!g$sa~P$)_O#k$uaP$uaR$ua[$uaa$uaj$uar$ua!S$ua!l$ua!p$ua#R$ua#n$ua#o$ua#p$ua#q$ua#r$ua#s$ua#t$ua#u$ua#v$ua#x$ua#z$ua#{$ua'z$ua(a$ua(r$ua!k$ua!Y$ua'w$uav$ua!_$ua%i$ua!g$ua~P$*QO#k%TaP%TaR%Ta[%Taa%Taj%Tar%Ta!S%Ta!]%Ta!l%Ta!p%Ta#R%Ta#n%Ta#o%Ta#p%Ta#q%Ta#r%Ta#s%Ta#t%Ta#u%Ta#v%Ta#x%Ta#z%Ta#{%Ta'z%Ta(a%Ta(r%Ta!k%Ta!Y%Ta'w%Ta#`%Tav%Ta!_%Ta%i%Ta!g%Ta~P#/sOa#cq!]#cq'z#cq'w#cq!Y#cq!k#cqv#cq!_#cq%i#cq!g#cq~P!:tO![3lO!]'YX!k'YX~P%[O!].tO!k(ka~O!].tO!k(ka~P!:tO!Y3oO~O$O!na!^!na~PKlO$O!ja!]!ja!^!ja~P#BwO$O!ra!^!ra~P!=[O$O!ta!^!ta~P!?rOg']X!]']X~P!,TO!]/POg(pa~OSfO!_4TO$d4UO~O!^4YO~Ov4ZO~P#/sOa$mq!]$mq'z$mq'w$mq!Y$mq!k$mqv$mq!_$mq%i$mq!g$mq~P!:tO!Y4]O~P!&zO!S4^O~O!Q*OO'y*PO(z%POn'ia(y'ia!]'ia#`'ia~Og'ia$O'ia~P%-fO!Q*OO'y*POn'ka(y'ka(z'ka!]'ka#`'ka~Og'ka$O'ka~P%.XO(r$YO~P#/sO!YfX!Y$zX!]fX!]$zX!g%RX#`fX~P!0SOp%WO(T=WO~P!1uOp4bO!S%hO![4aO!_%iO(T%gO!]'eX!k'eX~O!]/pO!k)Oa~O!]/pO!g#vO!k)Oa~O!]/pO!g#vO(r'pO!k)Oa~Og$|i!]$|i#`$|i$O$|i~P!1WO![4jO!Y'gX!]'gX~P!3tO!]/yO!Y)Pa~O!]/yO!Y)Pa~P#/sOP]XR]X[]Xj]Xr]X!Q]X!S]X!Y]X!]]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X~Oj%YX!g%YX~P%2OOj4oO!g#vO~Oh%VO!g#vO!l%eO~Oh%VOr4tO!l%eO(r'pO~Or4yO!g#vO(r'pO~Os!nO!S4zO(VTO(YUO(e!mO~O(y$}On%ai!Q%ai'y%ai(z%ai!]%ai#`%ai~Og%ai$O%ai~P%5oO(z%POn%ci!Q%ci'y%ci(y%ci!]%ci#`%ci~Og%ci$O%ci~P%6bOg(_i!](_i~P!1WO#`5QOg(_i!](_i~P!1WO!k5VO~Oa$oq!]$oq'z$oq'w$oq!Y$oq!k$oqv$oq!_$oq%i$oq!g$oq~P!:tO!Y5ZO~O!]5[O!_)QX~P#/sOa$zX!_$zX%^]X'z$zX!]$zX~P!0SO%^5_OaoX!_oX'zoX!]oX~P$#OOp5`O(T#nO~O%^5_O~Ob5fO%j5gO(T+qO(VTO(YUO!]'tX!^'tX~O!]1TO!^)Xa~O[5kO~O`5lO~O[5pO~Oa%nO'z%nO~P#/sO!]5uO#`5wO!^)UX~O!^5xO~Or6OOs!nO!S*iO!b!yO!c!vO!d!vO!|<VO#T!pO#U!pO#V!pO#W!pO#X!pO#[5}O#]!zO(U!lO(VTO(YUO(e!mO(o!sO~O!^5|O~P%;eOn6TO!_1oO%i6SO~Oh%VOn6TO!_1oO%i6SO~Ob6[O(T#nO(VTO(YUO!]'sX!^'sX~O!]1zO!^)Va~O(VTO(YUO(e6^O~O`6bO~Oj6eO&[6fO~PNXO!k6gO~P%[Oa6iO~Oa6iO~P%[Ob2bO!^6nO&j2aO~P`O!g6pO~O!g6rOh(ji!](ji!^(ji!g(ji!l(jir(ji(r(ji~O!]#hi!^#hi~P#BwO#`6sO!]#hi!^#hi~O!]!ai!^!ai~P#BwOa%nO#`6|O'z%nO~Oa%nO!g#vO#`6|O'z%nO~O!](tq!k(tqa(tq'z(tq~P!:tO!](jO!k(sq~O!S%hO!_%iO#j7TO(T%gO~O!_'`O%i7WO~On7[O!_'`O%i7WO~O#k'iaP'iaR'ia['iaa'iaj'iar'ia!S'ia!l'ia!p'ia#R'ia#n'ia#o'ia#p'ia#q'ia#r'ia#s'ia#t'ia#u'ia#v'ia#x'ia#z'ia#{'ia'z'ia(a'ia(r'ia!k'ia!Y'ia'w'iav'ia!_'ia%i'ia!g'ia~P%-fO#k'kaP'kaR'ka['kaa'kaj'kar'ka!S'ka!l'ka!p'ka#R'ka#n'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#x'ka#z'ka#{'ka'z'ka(a'ka(r'ka!k'ka!Y'ka'w'kav'ka!_'ka%i'ka!g'ka~P%.XO#k$|iP$|iR$|i[$|ia$|ij$|ir$|i!S$|i!]$|i!l$|i!p$|i#R$|i#n$|i#o$|i#p$|i#q$|i#r$|i#s$|i#t$|i#u$|i#v$|i#x$|i#z$|i#{$|i'z$|i(a$|i(r$|i!k$|i!Y$|i'w$|i#`$|iv$|i!_$|i%i$|i!g$|i~P#/sO#k%aiP%aiR%ai[%aia%aij%air%ai!S%ai!l%ai!p%ai#R%ai#n%ai#o%ai#p%ai#q%ai#r%ai#s%ai#t%ai#u%ai#v%ai#x%ai#z%ai#{%ai'z%ai(a%ai(r%ai!k%ai!Y%ai'w%aiv%ai!_%ai%i%ai!g%ai~P%5oO#k%ciP%ciR%ci[%cia%cij%cir%ci!S%ci!l%ci!p%ci#R%ci#n%ci#o%ci#p%ci#q%ci#r%ci#s%ci#t%ci#u%ci#v%ci#x%ci#z%ci#{%ci'z%ci(a%ci(r%ci!k%ci!Y%ci'w%civ%ci!_%ci%i%ci!g%ci~P%6bO!]'Ya!k'Ya~P!:tO!].tO!k(ki~O$O#ci!]#ci!^#ci~P#BwOP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(aVO[#mij#mir#mi#R#mi#o#mi#p#mi#q#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#n#mi~P%NdO#n<_O~P%NdOP$[OR#zOr<kO!Q#yO!S#{O!l#xO!p$[O#n<_O#o<`O#p<`O#q<`O(aVO[#mij#mi#R#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#r#mi~P&!lO#r<aO~P&!lOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO(aVO#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#v#mi~P&$tOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO(aVO(z#}O#z#mi#{#mi$O#mi(r#mi(y#mi!]#mi!^#mi~O#x<eO~P&&uO#x#mi~P&&uO#v<cO~P&$tOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO#x<eO(aVO(y#|O(z#}O#{#mi$O#mi(r#mi!]#mi!^#mi~O#z#mi~P&)UO#z<gO~P&)UOa#|y!]#|y'z#|y'w#|y!Y#|y!k#|yv#|y!_#|y%i#|y!g#|y~P!:tO[#mij#mir#mi#R#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi!]#mi!^#mi~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#n<_O#o<`O#p<`O#q<`O(aVO(y#mi(z#mi~P&,QOn>^O!Q*OO'y*PO(y$}O(z%POP#miR#mi!S#mi!l#mi!p#mi#n#mi#o#mi#p#mi#q#mi(a#mi~P&,QO#S$dOP(`XR(`X[(`Xj(`Xn(`Xr(`X!Q(`X!S(`X!l(`X!p(`X#R(`X#n(`X#o(`X#p(`X#q(`X#r(`X#s(`X#t(`X#u(`X#v(`X#x(`X#z(`X#{(`X$O(`X'y(`X(a(`X(r(`X(y(`X(z(`X!](`X!^(`X~O$O$Pi!]$Pi!^$Pi~P#BwO$O!ri!^!ri~P$+oOg']a!]']a~P!1WO!^7nO~O!]'da!^'da~P#BwO!Y7oO~P#/sO!g#vO(r'pO!]'ea!k'ea~O!]/pO!k)Oi~O!]/pO!g#vO!k)Oi~Og$|q!]$|q#`$|q$O$|q~P!1WO!Y'ga!]'ga~P#/sO!g7vO~O!]/yO!Y)Pi~P#/sO!]/yO!Y)Pi~O!Y7yO~Oh%VOr8OO!l%eO(r'pO~Oj8QO!g#vO~Or8TO!g#vO(r'pO~O!Q*OO'y*PO(z%POn'ja(y'ja!]'ja#`'ja~Og'ja$O'ja~P&5RO!Q*OO'y*POn'la(y'la(z'la!]'la#`'la~Og'la$O'la~P&5tOg(_q!](_q~P!1WO#`8VOg(_q!](_q~P!1WO!Y8WO~Og%Oq!]%Oq#`%Oq$O%Oq~P!1WOa$oy!]$oy'z$oy'w$oy!Y$oy!k$oyv$oy!_$oy%i$oy!g$oy~P!:tO!g6rO~O!]5[O!_)Qa~O!_'`OP$TaR$Ta[$Taj$Tar$Ta!Q$Ta!S$Ta!]$Ta!l$Ta!p$Ta#R$Ta#n$Ta#o$Ta#p$Ta#q$Ta#r$Ta#s$Ta#t$Ta#u$Ta#v$Ta#x$Ta#z$Ta#{$Ta(a$Ta(r$Ta(y$Ta(z$Ta~O%i7WO~P&8fO%^8[Oa%[i!_%[i'z%[i!]%[i~Oa#cy!]#cy'z#cy'w#cy!Y#cy!k#cyv#cy!_#cy%i#cy!g#cy~P!:tO[8^O~Ob8`O(T+qO(VTO(YUO~O!]1TO!^)Xi~O`8dO~O(e(|O!]'pX!^'pX~O!]5uO!^)Ua~O!^8nO~P%;eO(o!sO~P$&YO#[8oO~O!_1oO~O!_1oO%i8qO~On8tO!_1oO%i8qO~O[8yO!]'sa!^'sa~O!]1zO!^)Vi~O!k8}O~O!k9OO~O!k9RO~O!k9RO~P%[Oa9TO~O!g9UO~O!k9VO~O!](wi!^(wi~P#BwOa%nO#`9_O'z%nO~O!](ty!k(tya(ty'z(ty~P!:tO!](jO!k(sy~O%i9bO~P&8fO!_'`O%i9bO~O#k$|qP$|qR$|q[$|qa$|qj$|qr$|q!S$|q!]$|q!l$|q!p$|q#R$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#t$|q#u$|q#v$|q#x$|q#z$|q#{$|q'z$|q(a$|q(r$|q!k$|q!Y$|q'w$|q#`$|qv$|q!_$|q%i$|q!g$|q~P#/sO#k'jaP'jaR'ja['jaa'jaj'jar'ja!S'ja!l'ja!p'ja#R'ja#n'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#x'ja#z'ja#{'ja'z'ja(a'ja(r'ja!k'ja!Y'ja'w'jav'ja!_'ja%i'ja!g'ja~P&5RO#k'laP'laR'la['laa'laj'lar'la!S'la!l'la!p'la#R'la#n'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#x'la#z'la#{'la'z'la(a'la(r'la!k'la!Y'la'w'lav'la!_'la%i'la!g'la~P&5tO#k%OqP%OqR%Oq[%Oqa%Oqj%Oqr%Oq!S%Oq!]%Oq!l%Oq!p%Oq#R%Oq#n%Oq#o%Oq#p%Oq#q%Oq#r%Oq#s%Oq#t%Oq#u%Oq#v%Oq#x%Oq#z%Oq#{%Oq'z%Oq(a%Oq(r%Oq!k%Oq!Y%Oq'w%Oq#`%Oqv%Oq!_%Oq%i%Oq!g%Oq~P#/sO!]'Yi!k'Yi~P!:tO$O#cq!]#cq!^#cq~P#BwO(y$}OP%aaR%aa[%aaj%aar%aa!S%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa$O%aa(a%aa(r%aa!]%aa!^%aa~On%aa!Q%aa'y%aa(z%aa~P&IyO(z%POP%caR%ca[%caj%car%ca!S%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca$O%ca(a%ca(r%ca!]%ca!^%ca~On%ca!Q%ca'y%ca(y%ca~P&LQOn>^O!Q*OO'y*PO(z%PO~P&IyOn>^O!Q*OO'y*PO(y$}O~P&LQOR0kO!Q0kO!S0lO#S$dOP}a[}aj}an}ar}a!l}a!p}a#R}a#n}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#x}a#z}a#{}a$O}a'y}a(a}a(r}a(y}a(z}a!]}a!^}a~O!Q*OO'y*POP$saR$sa[$saj$san$sar$sa!S$sa!l$sa!p$sa#R$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#t$sa#u$sa#v$sa#x$sa#z$sa#{$sa$O$sa(a$sa(r$sa(y$sa(z$sa!]$sa!^$sa~O!Q*OO'y*POP$uaR$ua[$uaj$uan$uar$ua!S$ua!l$ua!p$ua#R$ua#n$ua#o$ua#p$ua#q$ua#r$ua#s$ua#t$ua#u$ua#v$ua#x$ua#z$ua#{$ua$O$ua(a$ua(r$ua(y$ua(z$ua!]$ua!^$ua~On>^O!Q*OO'y*PO(y$}O(z%PO~OP%TaR%Ta[%Taj%Tar%Ta!S%Ta!l%Ta!p%Ta#R%Ta#n%Ta#o%Ta#p%Ta#q%Ta#r%Ta#s%Ta#t%Ta#u%Ta#v%Ta#x%Ta#z%Ta#{%Ta$O%Ta(a%Ta(r%Ta!]%Ta!^%Ta~P''VO$O$mq!]$mq!^$mq~P#BwO$O$oq!]$oq!^$oq~P#BwO!^9oO~O$O9pO~P!1WO!g#vO!]'ei!k'ei~O!g#vO(r'pO!]'ei!k'ei~O!]/pO!k)Oq~O!Y'gi!]'gi~P#/sO!]/yO!Y)Pq~Or9wO!g#vO(r'pO~O[9yO!Y9xO~P#/sO!Y9xO~Oj:PO!g#vO~Og(_y!](_y~P!1WO!]'na!_'na~P#/sOa%[q!_%[q'z%[q!]%[q~P#/sO[:UO~O!]1TO!^)Xq~O`:YO~O#`:ZO!]'pa!^'pa~O!]5uO!^)Ui~P#BwO!S:]O~O!_1oO%i:`O~O(VTO(YUO(e:eO~O!]1zO!^)Vq~O!k:hO~O!k:iO~O!k:jO~O!k:jO~P%[O#`:mO!]#hy!^#hy~O!]#hy!^#hy~P#BwO%i:rO~P&8fO!_'`O%i:rO~O$O#|y!]#|y!^#|y~P#BwOP$|iR$|i[$|ij$|ir$|i!S$|i!l$|i!p$|i#R$|i#n$|i#o$|i#p$|i#q$|i#r$|i#s$|i#t$|i#u$|i#v$|i#x$|i#z$|i#{$|i$O$|i(a$|i(r$|i!]$|i!^$|i~P''VO!Q*OO'y*PO(z%POP'iaR'ia['iaj'ian'iar'ia!S'ia!l'ia!p'ia#R'ia#n'ia#o'ia#p'ia#q'ia#r'ia#s'ia#t'ia#u'ia#v'ia#x'ia#z'ia#{'ia$O'ia(a'ia(r'ia(y'ia!]'ia!^'ia~O!Q*OO'y*POP'kaR'ka['kaj'kan'kar'ka!S'ka!l'ka!p'ka#R'ka#n'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#x'ka#z'ka#{'ka$O'ka(a'ka(r'ka(y'ka(z'ka!]'ka!^'ka~O(y$}OP%aiR%ai[%aij%ain%air%ai!Q%ai!S%ai!l%ai!p%ai#R%ai#n%ai#o%ai#p%ai#q%ai#r%ai#s%ai#t%ai#u%ai#v%ai#x%ai#z%ai#{%ai$O%ai'y%ai(a%ai(r%ai(z%ai!]%ai!^%ai~O(z%POP%ciR%ci[%cij%cin%cir%ci!Q%ci!S%ci!l%ci!p%ci#R%ci#n%ci#o%ci#p%ci#q%ci#r%ci#s%ci#t%ci#u%ci#v%ci#x%ci#z%ci#{%ci$O%ci'y%ci(a%ci(r%ci(y%ci!]%ci!^%ci~O$O$oy!]$oy!^$oy~P#BwO$O#cy!]#cy!^#cy~P#BwO!g#vO!]'eq!k'eq~O!]/pO!k)Oy~O!Y'gq!]'gq~P#/sOr:|O!g#vO(r'pO~O[;QO!Y;PO~P#/sO!Y;PO~Og(_!R!](_!R~P!1WOa%[y!_%[y'z%[y!]%[y~P#/sO!]1TO!^)Xy~O!]5uO!^)Uq~O(T;XO~O!_1oO%i;[O~O!k;_O~O%i;dO~P&8fOP$|qR$|q[$|qj$|qr$|q!S$|q!l$|q!p$|q#R$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#t$|q#u$|q#v$|q#x$|q#z$|q#{$|q$O$|q(a$|q(r$|q!]$|q!^$|q~P''VO!Q*OO'y*PO(z%POP'jaR'ja['jaj'jan'jar'ja!S'ja!l'ja!p'ja#R'ja#n'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#x'ja#z'ja#{'ja$O'ja(a'ja(r'ja(y'ja!]'ja!^'ja~O!Q*OO'y*POP'laR'la['laj'lan'lar'la!S'la!l'la!p'la#R'la#n'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#x'la#z'la#{'la$O'la(a'la(r'la(y'la(z'la!]'la!^'la~OP%OqR%Oq[%Oqj%Oqr%Oq!S%Oq!l%Oq!p%Oq#R%Oq#n%Oq#o%Oq#p%Oq#q%Oq#r%Oq#s%Oq#t%Oq#u%Oq#v%Oq#x%Oq#z%Oq#{%Oq$O%Oq(a%Oq(r%Oq!]%Oq!^%Oq~P''VOg%e!Z!]%e!Z#`%e!Z$O%e!Z~P!1WO!Y;hO~P#/sOr;iO!g#vO(r'pO~O[;kO!Y;hO~P#/sO!]'pq!^'pq~P#BwO!]#h!Z!^#h!Z~P#BwO#k%e!ZP%e!ZR%e!Z[%e!Za%e!Zj%e!Zr%e!Z!S%e!Z!]%e!Z!l%e!Z!p%e!Z#R%e!Z#n%e!Z#o%e!Z#p%e!Z#q%e!Z#r%e!Z#s%e!Z#t%e!Z#u%e!Z#v%e!Z#x%e!Z#z%e!Z#{%e!Z'z%e!Z(a%e!Z(r%e!Z!k%e!Z!Y%e!Z'w%e!Z#`%e!Zv%e!Z!_%e!Z%i%e!Z!g%e!Z~P#/sOr;tO!g#vO(r'pO~O!Y;uO~P#/sOr;|O!g#vO(r'pO~O!Y;}O~P#/sOP%e!ZR%e!Z[%e!Zj%e!Zr%e!Z!S%e!Z!l%e!Z!p%e!Z#R%e!Z#n%e!Z#o%e!Z#p%e!Z#q%e!Z#r%e!Z#s%e!Z#t%e!Z#u%e!Z#v%e!Z#x%e!Z#z%e!Z#{%e!Z$O%e!Z(a%e!Z(r%e!Z!]%e!Z!^%e!Z~P''VOr<QO!g#vO(r'pO~Ov(fX~P1qO!Q%rO~P!)[O(U!lO~P!)[O!YfX!]fX#`fX~P%2OOP]XR]X[]Xj]Xr]X!Q]X!S]X!]]X!]fX!l]X!p]X#R]X#S]X#`]X#`fX#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X~O!gfX!k]X!kfX(rfX~P'LTOP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_XO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(T)]O(VTO(YUO(aVO(o[O~O!]<iO!^$qa~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<tO!S${O!_$|O!i>WO!l$xO#j<zO$W%`O$t<vO$v<xO$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~Ol)dO~P(!yOr!eX(r!eX~P#!iOr(jX(r(jX~P##[O!^]X!^fX~P'LTO!YfX!Y$zX!]fX!]$zX#`fX~P!0SO#k<^O~O!g#vO#k<^O~O#`<nO~Oj<bO~O#`=OO!](wX!^(wX~O#`<nO!](uX!^(uX~O#k=PO~Og=RO~P!1WO#k=XO~O#k=YO~Og=RO(T&ZO~O!g#vO#k=ZO~O!g#vO#k=PO~O$O=[O~P#BwO#k=]O~O#k=^O~O#k=cO~O#k=dO~O#k=eO~O#k=fO~O$O=gO~P!1WO$O=hO~P!1WOl=sO~P7eOk#S#T#U#W#X#[#i#j#u$n$t$v$y%]%^%h%i%j%q%s%v%w%y%{~(OT#o!X'|(U#ps#n#qr!Q'}$]'}(T$_(e~",
  goto: "$9Y)]PPPPPP)^PP)aP)rP+W/]PPPP6mPP7TPP=QPPP@tPA^PA^PPPA^PCfPA^PA^PA^PCjPCoPD^PIWPPPI[PPPPI[L_PPPLeMVPI[PI[PP! eI[PPPI[PI[P!#lI[P!'S!(X!(bP!)U!)Y!)U!,gPPPPPPP!-W!(XPP!-h!/YP!2iI[I[!2n!5z!:h!:h!>gPPP!>oI[PPPPPPPPP!BOP!C]PPI[!DnPI[PI[I[I[I[I[PI[!FQP!I[P!LbP!Lf!Lp!Lt!LtP!IXP!Lx!LxP#!OP#!SI[PI[#!Y#%_CjA^PA^PA^A^P#&lA^A^#)OA^#+vA^#.SA^A^#.r#1W#1W#1]#1f#1W#1qPP#1WPA^#2ZA^#6YA^A^6mPPP#:_PPP#:x#:xP#:xP#;`#:xPP#;fP#;]P#;]#;y#;]#<e#<k#<n)aP#<q)aP#<z#<z#<zP)aP)aP)aP)aPP)aP#=Q#=TP#=T)aP#=XP#=[P)aP)aP)aP)aP)aP)a)aPP#=b#=h#=s#=y#>P#>V#>]#>k#>q#>{#?R#?]#?c#?s#?y#@k#@}#AT#AZ#Ai#BO#Cs#DR#DY#Et#FS#Gt#HS#HY#H`#Hf#Hp#Hv#H|#IW#Ij#IpPPPPPPPPPPP#IvPPPPPPP#Jk#Mx$ b$ i$ qPPP$']P$'f$*_$0x$0{$1O$1}$2Q$2X$2aP$2g$2jP$3W$3[$4S$5b$5g$5}PP$6S$6Y$6^$6a$6e$6i$7e$7|$8e$8i$8l$8o$8y$8|$9Q$9UR!|RoqOXst!Z#d%m&r&t&u&w,s,x2[2_Y!vQ'`-e1o5{Q%tvQ%|yQ&T|Q&j!VS'W!e-]Q'f!iS'l!r!yU*k$|*Z*oQ+o%}S+|&V&WQ,d&dQ-c'_Q-m'gQ-u'mQ0[*qQ1b,OQ1y,eR<{<Y%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+],p,s,x-i-q.P.V.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3l4z6T6e6f6i6|8t9T9_S#q]<V!r)_$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SU+P%]<s<tQ+t&PQ,f&gQ,m&oQ0x+gQ0}+iQ1Y+uQ2R,kQ3`.gQ5`0|Q5f1TQ6[1zQ7Y3dQ8`5gR9e7['QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S!S!nQ!r!v!y!z$|'W'_'`'l'm'n*k*o*q*r-]-c-e-u0[0_1o5{5}%[$ti#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^Q&X|Q'U!eS'[%i-`Q+t&PQ,P&WQ,f&gQ0n+SQ1Y+uQ1_+{Q2Q,jQ2R,kQ5f1TQ5o1aQ6[1zQ6_1|Q6`2PQ8`5gQ8c5lQ8|6bQ:X8dQ:f8yQ;V:YR<}*ZrnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_R,h&k&z^OPXYstuvwz!Z!`!g!j!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'b'r(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>R>S[#]WZ#W#Z'X(T!b%jm#h#i#l$x%e%h(^(h(i(j*Y*^*b+Z+[+^,o-V.T.Z.[.]._/m/p2d3[3]4a6r7TQ%wxQ%{yW&Q|&V&W,OQ&_!TQ'c!hQ'e!iQ(q#sS+n%|%}Q+r&PQ,_&bQ,c&dS-l'f'gQ.i(rQ1R+oQ1X+uQ1Z+vQ1^+zQ1t,`S1x,d,eQ2|-mQ5e1TQ5i1WQ5n1`Q6Z1yQ8_5gQ8b5kQ8f5pQ:T8^R;T:U!U$zi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y!^%yy!i!u%{%|%}'V'e'f'g'k'u*j+n+o-Y-l-m-t0R0U1R2u2|3T4r4s4v7}9{Q+h%wQ,T&[Q,W&]Q,b&dQ.h(qQ1s,_U1w,c,d,eQ3e.iQ6U1tS6Y1x1yQ8x6Z#f>T#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^o>U<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hW%Ti%V*y>PS&[!Q&iQ&]!RQ&^!SU*}%[%d=sR,R&Y%]%Si#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^T)z$u){V+P%]<s<tW'[!e%i*Z-`S(}#y#zQ+c%rQ+y&SS.b(m(nQ1j,XQ5T0kR8i5u'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S$i$^c#Y#e%q%s%u(S(Y(t(y)R)S)T)U)V)W)X)Y)Z)[)^)`)b)g)q+d+x-Z-x-}.S.U.s.v.z.|.}/O/b0p2k2n3O3V3k3p3q3r3s3t3u3v3w3x3y3z3{3|4P4Q4X5X5c6u6{7Q7a7b7k7l8k9X9]9g9m9n:o;W;`<W=vT#TV#U'RkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ'Y!eR2q-]!W!nQ!e!r!v!y!z$|'W'_'`'l'm'n*Z*k*o*q*r-]-c-e-u0[0_1o5{5}R1l,ZnqOXst!Z#d%m&r&t&u&w,s,x2[2_Q&y!^Q'v!xS(s#u<^Q+l%zQ,]&_Q,^&aQ-j'dQ-w'oS.r(x=PS0q+X=ZQ1P+mQ1n,[Q2c,zQ2e,{Q2m-WQ2z-kQ2}-oS5Y0r=eQ5a1QS5d1S=fQ6t2oQ6x2{Q6}3SQ8]5bQ9Y6vQ9Z6yQ9^7OR:l9V$d$]c#Y#e%s%u(S(Y(t(y)R)S)T)U)V)W)X)Y)Z)[)^)`)b)g)q+d+x-Z-x-}.S.U.s.v.z.}/O/b0p2k2n3O3V3k3p3q3r3s3t3u3v3w3x3y3z3{3|4P4Q4X5X5c6u6{7Q7a7b7k7l8k9X9]9g9m9n:o;W;`<W=vS(o#p'iQ)P#zS+b%q.|S.c(n(pR3^.d'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SS#q]<VQ&t!XQ&u!YQ&w![Q&x!]R2Z,vQ'a!hQ+e%wQ-h'cS.e(q+hQ2x-gW3b.h.i0w0yQ6w2yW7U3_3a3e5^U9a7V7X7ZU:q9c9d9fS;b:p:sQ;p;cR;x;qU!wQ'`-eT5y1o5{!Q_OXZ`st!V!Z#d#h%e%m&i&k&r&t&u&w(j,s,x.[2[2_]!pQ!r'`-e1o5{T#q]<V%^{OPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_S(}#y#zS.b(m(n!s=l$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SU$fd)_,mS(p#p'iU*v%R(w4OU0m+O.n7gQ5^0xQ7V3`Q9d7YR:s9em!tQ!r!v!y!z'`'l'm'n-e-u1o5{5}Q't!uS(f#g2US-s'k'wQ/s*]Q0R*jQ3U-vQ4f/tQ4r0TQ4s0UQ4x0^Q7r4`S7}4t4vS8R4y4{Q9r7sQ9v7yQ9{8OQ:Q8TS:{9w9xS;g:|;PS;s;h;iS;{;t;uS<P;|;}R<S<QQ#wbQ's!uS(e#g2US(g#m+WQ+Y%fQ+j%xQ+p&OU-r'k't'wQ.W(fU/r*]*`/wQ0S*jQ0V*lQ1O+kQ1u,aS3R-s-vQ3Z.`S4e/s/tQ4n0PS4q0R0^Q4u0WQ6W1vQ7P3US7q4`4bQ7u4fU7|4r4x4{Q8P4wQ8v6XS9q7r7sQ9u7yQ9}8RQ:O8SQ:c8wQ:y9rS:z9v9xQ;S:QQ;^:dS;f:{;PS;r;g;hS;z;s;uS<O;{;}Q<R<PQ<T<SQ=o=jQ={=tR=|=uV!wQ'`-e%^aOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_S#wz!j!r=i$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SR=o>R%^bOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_Q%fj!^%xy!i!u%{%|%}'V'e'f'g'k'u*j+n+o-Y-l-m-t0R0U1R2u2|3T4r4s4v7}9{S&Oz!jQ+k%yQ,a&dW1v,b,c,d,eU6X1w1x1yS8w6Y6ZQ:d8x!r=j$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ=t>QR=u>R%QeOPXYstuvw!Z!`!g!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_Y#bWZ#W#Z(T!b%jm#h#i#l$x%e%h(^(h(i(j*Y*^*b+Z+[+^,o-V.T.Z.[.]._/m/p2d3[3]4a6r7TQ,n&o!p=k$Z$n)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SR=n'XU']!e%i*ZR2s-`%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+],p,s,x-i-q.P.V.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3l4z6T6e6f6i6|8t9T9_!r)_$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ,m&oQ0x+gQ3`.gQ7Y3dR9e7[!b$Tc#Y%q(S(Y(t(y)Z)[)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<W!P<d)^)q-Z.|2k2n3p3y3z4P4X6u7b7k7l8k9X9g9m9n;W;`=v!f$Vc#Y%q(S(Y(t(y)W)X)Z)[)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<W!T<f)^)q-Z.|2k2n3p3v3w3y3z4P4X6u7b7k7l8k9X9g9m9n;W;`=v!^$Zc#Y%q(S(Y(t(y)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<WQ4_/kz>S)^)q-Z.|2k2n3p4P4X6u7b7k7l8k9X9g9m9n;W;`=vQ>X>ZR>Y>['QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SS$oh$pR4U/U'XgOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/U/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>ST$kf$qQ$ifS)j$l)nR)v$qT$jf$qT)l$l)n'XhOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/U/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>ST$oh$pQ$rhR)u$p%^jOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_!s>Q$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S#glOPXZst!Z!`!o#S#d#o#{$n%m&k&n&o&r&t&u&w&{'T'b)O)s*i+]+g,p,s,x-i.g/V/n0]0l1r2S2T2V2X2[2_2a3d4T4z6T6e6f6i7[8t9T!U%Ri$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y#f(w#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^Q+T%aQ/c*Oo4O<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!U$yi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>YQ*c$zU*l$|*Z*oQ+U%bQ0W*m#f=q#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n=r<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hQ=w>TQ=x>UQ=y>VR=z>W!U%Ri$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y#f(w#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^o4O<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hnoOXst!Z#d%m&r&t&u&w,s,x2[2_S*f${*YQ-R'OQ-S'QR4i/y%[%Si#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^Q,U&]Q1h,WQ5s1gR8h5tV*n$|*Z*oU*n$|*Z*oT5z1o5{S0P*i/nQ4w0]T8S4z:]Q+j%xQ0V*lQ1O+kQ1u,aQ6W1vQ8v6XQ:c8wR;^:d!U%Oi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Yx*R$v)e*S*u+V/v0d0e4R4g5R5S5W7p8U:R:x=p=}>OS0`*t0a#f<o#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n<p<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!d=S(u)c*[*e.j.m.q/_/k/|0v1e3h4[4h4l5r7]7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[`=T3}7c7f7j9h:t:w;yS=_.l3iT=`7e9k!U%Qi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y|*T$v)e*U*t+V/g/v0d0e4R4g4|5R5S5W7p8U:R:x=p=}>OS0b*u0c#f<q#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n<r<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!h=U(u)c*[*e.k.l.q/_/k/|0v1e3f3h4[4h4l5r7]7^7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[d=V3}7d7e7j9h9i:t:u:w;yS=a.m3jT=b7f9lrnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_Q&f!UR,p&ornOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_R&f!UQ,Y&^R1d,RsnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_Q1p,_S6R1s1tU8p6P6Q6US:_8r8sS;Y:^:aQ;m;ZR;w;nQ&m!VR,i&iR6_1|R:f8yW&Q|&V&W,OR1Z+vQ&r!WR,s&sR,y&xT2],x2_R,}&yQ,|&yR2f,}Q'y!{R-y'ySsOtQ#dXT%ps#dQ#OTR'{#OQ#RUR'}#RQ){$uR/`){Q#UVR(Q#UQ#XWU(W#X(X.QQ(X#YR.Q(YQ-^'YR2r-^Q.u(yS3m.u3nR3n.vQ-e'`R2v-eY!rQ'`-e1o5{R'j!rQ/Q)eR4S/QU#_W%h*YU(_#_(`.RQ(`#`R.R(ZQ-a']R2t-at`OXst!V!Z#d%m&i&k&r&t&u&w,s,x2[2_S#hZ%eU#r`#h.[R.[(jQ(k#jQ.X(gW.a(k.X3X7RQ3X.YR7R3YQ)n$lR/W)nQ$phR)t$pQ$`cU)a$`-|<jQ-|<WR<j)qQ/q*]W4c/q4d7t9sU4d/r/s/tS7t4e4fR9s7u$e*Q$v(u)c)e*[*e*t*u+Q+R+V.l.m.o.p.q/_/g/i/k/v/|0d0e0v1e3f3g3h3}4R4[4g4h4l4|5O5R5S5W5r7]7^7_7`7e7f7h7i7j7p7w7z8U8X8Z9h9i9j9t9|:R:S:t:u:v:w:x:};R;e;j;v;y=p=}>O>Z>[Q/z*eU4k/z4m7xQ4m/|R7x4lS*o$|*ZR0Y*ox*S$v)e*t*u+V/v0d0e4R4g5R5S5W7p8U:R:x=p=}>O!d.j(u)c*[*e.l.m.q/_/k/|0v1e3h4[4h4l5r7]7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[U/h*S.j7ca7c3}7e7f7j9h:t:w;yQ0a*tQ3i.lU4}0a3i9kR9k7e|*U$v)e*t*u+V/g/v0d0e4R4g4|5R5S5W7p8U:R:x=p=}>O!h.k(u)c*[*e.l.m.q/_/k/|0v1e3f3h4[4h4l5r7]7^7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[U/j*U.k7de7d3}7e7f7j9h9i:t:u:w;yQ0c*uQ3j.mU5P0c3j9lR9l7fQ*z%UR0g*zQ5]0vR8Y5]Q+_%kR0u+_Q5v1jS8j5v:[R:[8kQ,[&_R1m,[Q5{1oR8m5{Q1{,fS6]1{8zR8z6_Q1U+rW5h1U5j8a:VQ5j1XQ8a5iR:V8bQ+w&QR1[+wQ2_,xR6m2_YrOXst#dQ&v!ZQ+a%mQ,r&rQ,t&tQ,u&uQ,w&wQ2Y,sS2],x2_R6l2[Q%opQ&z!_Q&}!aQ'P!bQ'R!cQ'q!uQ+`%lQ+l%zQ,Q&XQ,h&mQ-P&|W-p'k's't'wQ-w'oQ0X*nQ1P+mQ1c,PS2O,i,lQ2g-OQ2h-RQ2i-SQ2}-oW3P-r-s-v-xQ5a1QQ5m1_Q5q1eQ6V1uQ6a2QQ6k2ZU6z3O3R3UQ6}3SQ8]5bQ8e5oQ8g5rQ8l5zQ8u6WQ8{6`S9[6{7PQ9^7OQ:W8cQ:b8vQ:g8|Q:n9]Q;U:XQ;]:cQ;a:oQ;l;VR;o;^Q%zyQ'd!iQ'o!uU+m%{%|%}Q-W'VU-k'e'f'gS-o'k'uQ0Q*jS1Q+n+oQ2o-YS2{-l-mQ3S-tS4p0R0UQ5b1RQ6v2uQ6y2|Q7O3TU7{4r4s4vQ9z7}R;O9{S$wi>PR*{%VU%Ui%V>PR0f*yQ$viS(u#v+iS)c$b$cQ)e$dQ*[$xS*e${*YQ*t%OQ*u%QQ+Q%^Q+R%_Q+V%cQ.l<oQ.m<qQ.o<uQ.p<wQ.q<yQ/_)yQ/g*RQ/i*TQ/k*VQ/v*aS/|*g/mQ0d*wQ0e*xl0v+f,V.f1i1q3c6S7W8q9b:`:r;[;dQ1e,SQ3f=SQ3g=UQ3h=XS3}<l<mQ4R/PS4[/d4^Q4g/xQ4h/yQ4l/{Q4|0`Q5O0bQ5R0iQ5S0jQ5W0oQ5r1fQ7]=]Q7^=_Q7_=aQ7`=cQ7e<pQ7f<rQ7h<vQ7i<xQ7j<zQ7p4_Q7w4jQ7z4oQ8U5QQ8X5[Q8Z5_Q9h=YQ9i=TQ9j=VQ9t7vQ9|8QQ:R8VQ:S8[Q:t=^Q:u=`Q:v=bQ:w=dQ:x9pQ:}9yQ;R:PQ;e=gQ;j;QQ;v;kQ;y=hQ=p>PQ=}>XQ>O>YQ>Z>]R>[>^Q+O%]Q.n<sR7g<tnpOXst!Z#d%m&r&t&u&w,s,x2[2_Q!fPS#fZ#oQ&|!`W'h!o*i0]4zQ(P#SQ)Q#{Q)r$nS,l&k&nQ,q&oQ-O&{S-T'T/nQ-g'bQ.x)OQ/[)sQ0s+]Q0y+gQ2W,pQ2y-iQ3a.gQ4W/VQ5U0lQ6Q1rQ6c2SQ6d2TQ6h2VQ6j2XQ6o2aQ7Z3dQ7m4TQ8s6TQ9P6eQ9Q6fQ9S6iQ9f7[Q:a8tR:k9T#[cOPXZst!Z!`!o#d#o#{%m&k&n&o&r&t&u&w&{'T'b)O*i+]+g,p,s,x-i.g/n0]0l1r2S2T2V2X2[2_2a3d4z6T6e6f6i7[8t9TQ#YWQ#eYQ%quQ%svS%uw!gS(S#W(VQ(Y#ZQ(t#uQ(y#xQ)R$OQ)S$PQ)T$QQ)U$RQ)V$SQ)W$TQ)X$UQ)Y$VQ)Z$WQ)[$XQ)^$ZQ)`$_Q)b$aQ)g$eW)q$n)s/V4TQ+d%tQ+x&RS-Z'X2pQ-x'rS-}(T.PQ.S(]Q.U(dQ.s(xQ.v(zQ.z<UQ.|<XQ.}<YQ/O<]Q/b)}Q0p+XQ2k-UQ2n-XQ3O-qQ3V.VQ3k.tQ3p<^Q3q<_Q3r<`Q3s<aQ3t<bQ3u<cQ3v<dQ3w<eQ3x<fQ3y<gQ3z<hQ3{.{Q3|<kQ4P<nQ4Q<{Q4X<iQ5X0rQ5c1SQ6u=OQ6{3QQ7Q3WQ7a3lQ7b=PQ7k=RQ7l=ZQ8k5wQ9X6sQ9]6|Q9g=[Q9m=eQ9n=fQ:o9_Q;W:ZQ;`:mQ<W#SR=v>SR#[WR'Z!el!tQ!r!v!y!z'`'l'm'n-e-u1o5{5}S'V!e-]U*j$|*Z*oS-Y'W'_S0U*k*qQ0^*rQ2u-cQ4v0[R4{0_R({#xQ!fQT-d'`-e]!qQ!r'`-e1o5{Q#p]R'i<VR)f$dY!uQ'`-e1o5{Q'k!rS'u!v!yS'w!z5}S-t'l'mQ-v'nR3T-uT#kZ%eS#jZ%eS%km,oU(g#h#i#lS.Y(h(iQ.^(jQ0t+^Q3Y.ZU3Z.[.]._S7S3[3]R9`7Td#^W#W#Z%h(T(^*Y+Z.T/mr#gZm#h#i#l%e(h(i(j+^.Z.[.]._3[3]7TS*]$x*bQ/t*^Q2U,oQ2l-VQ4`/pQ6q2dQ7s4aQ9W6rT=m'X+[V#aW%h*YU#`W%h*YS(U#W(^U(Z#Z+Z/mS-['X+[T.O(T.TV'^!e%i*ZQ$lfR)x$qT)m$l)nR4V/UT*_$x*bT*h${*YQ0w+fQ1g,VQ3_.fQ5t1iQ6P1qQ7X3cQ8r6SQ9c7WQ:^8qQ:p9bQ;Z:`Q;c:rQ;n;[R;q;dnqOXst!Z#d%m&r&t&u&w,s,x2[2_Q&l!VR,h&itmOXst!U!V!Z#d%m&i&r&t&u&w,s,x2[2_R,o&oT%lm,oR1k,XR,g&gQ&U|S+}&V&WR1^,OR+s&PT&p!W&sT&q!W&sT2^,x2_",
  nodeNames: "⚠ ArithOp ArithOp ?. JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList in out const TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewTarget new NewExpression ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression TypeArgList CompareOp < declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression InstantiationExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast < ArrowFunction TypeParamList SequenceExpression InstantiationExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate asserts is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration defer ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
  maxTerm: 380,
  context: hP,
  nodeProps: [
    ["isolate", -8, 5, 6, 14, 37, 39, 51, 53, 55, ""],
    ["group", -26, 9, 17, 19, 68, 207, 211, 215, 216, 218, 221, 224, 234, 237, 243, 245, 247, 249, 252, 258, 264, 266, 268, 270, 272, 274, 275, "Statement", -34, 13, 14, 32, 35, 36, 42, 51, 54, 55, 57, 62, 70, 72, 76, 80, 82, 84, 85, 110, 111, 120, 121, 136, 139, 141, 142, 143, 144, 145, 147, 148, 167, 169, 171, "Expression", -23, 31, 33, 37, 41, 43, 45, 173, 175, 177, 178, 180, 181, 182, 184, 185, 186, 188, 189, 190, 201, 203, 205, 206, "Type", -3, 88, 103, 109, "ClassItem"],
    ["openedBy", 23, "<", 38, "InterpolationStart", 56, "[", 60, "{", 73, "(", 160, "JSXStartCloseTag"],
    ["closedBy", -2, 24, 168, ">", 40, "InterpolationEnd", 50, "]", 61, "}", 74, ")", 165, "JSXEndTag"]
  ],
  propSources: [pP],
  skippedNodes: [0, 5, 6, 278],
  repeatNodeCount: 37,
  tokenData: "$Fq07[R!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#:O!R![#<_![!]#I_!]!^#Jk!^!_#Ku!_!`$![!`!a$$v!a!b$*T!b!c$,r!c!}Er!}#O$-|#O#P$/W#P#Q$4o#Q#R$5y#R#SEr#S#T$7W#T#o$8b#o#p$<r#p#q$=h#q#r$>x#r#s$@U#s$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$I|Er$I|$I}$Dk$I}$JO$Dk$JO$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr(n%d_$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$i&j(Z!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU(Z!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$i&j(WpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(WpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z07[+rq$i&j(Wp(Z!b'|0/lOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z07[.ST(X#S$i&j'}0/lO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c07[.n_$i&j(Wp(Z!b'}0/lOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)3p/x`$i&j!p),Q(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW1V`#v(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW2d_#v(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At3l_(V':f$i&j(Z!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$i&j(Z!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$i&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$d`$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$d``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$d`$i&j(Z!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ(Z!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$d`(Z!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k%9[:hh$i&j(Wp(Z!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__WS$i&j(Wp(Z!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]WS$i&j(Z!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXWS$i&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSWSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWWS(Z!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]WS$i&j(WpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWWS(WpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYWS(Wp(Z!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S%9[C}i$i&j(o%1l(Wp(Z!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr%9[EoP;=`<%lCr07[FRk$i&j(Wp(Z!b$]#t(T,2j(e$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$i&j(Wp(Z!b$]#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv07[JPP;=`<%lEr(KWJ_`$i&j(Wp(Z!b#p(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWKl_$i&j$Q(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,#xLva(z+JY$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWNW`$i&j#z(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At! c_(Y';W$i&j(WpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$i&j(WpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$i&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$d`$i&j(WpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(WpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$d`(WpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b/5|!'t_!l/.^$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&U!)O_!k!Lf$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z-!n!*[b$i&j(Wp(Z!b(U%&f#q(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW!+o`$i&j(Wp(Z!b#n(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;x!,|`$i&j(Wp(Z!br+4YOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,$U!.Z_!]+Jf$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!/ec$i&j(Wp(Z!b!Q.2^OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!0ya$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!2Z_![!L^$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!3eg$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!5Vg$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!6wc$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!8_c$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!9uf$i&j(Wp(Z!b#o(ChOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcxz!;Zz{#-}{!P!;Z!P!Q#/d!Q!^!;Z!^!_#(i!_!`#7S!`!a#8i!a!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z?O!;fb$i&j(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z>^!<w`$i&j(Z!b!X7`OY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eq!Q!^!<n!^!_!Gr!_!}!<n!}#O!KS#O#P!Dy#P#o!<n#o#p!Gr#p;'S!<n;'S;=`!L]<%lO!<n<z!>Q^$i&j!X7`OY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@c!_!}!=y!}#O!CW#O#P!Dy#P#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!?Td$i&j!X7`O!^&c!_#W&c#W#X!>|#X#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#k!>|#k#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&c7`!@hX!X7`OY!@cZ!P!@c!P!Q!AT!Q!}!@c!}#O!Ar#O#P!Bq#P;'S!@c;'S;=`!CQ<%lO!@c7`!AYW!X7`#W#X!AT#Z#[!AT#]#^!AT#a#b!AT#g#h!AT#i#j!AT#j#k!AT#m#n!AT7`!AuVOY!ArZ#O!Ar#O#P!B[#P#Q!@c#Q;'S!Ar;'S;=`!Bk<%lO!Ar7`!B_SOY!ArZ;'S!Ar;'S;=`!Bk<%lO!Ar7`!BnP;=`<%l!Ar7`!BtSOY!@cZ;'S!@c;'S;=`!CQ<%lO!@c7`!CTP;=`<%l!@c<z!C][$i&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#O!CW#O#P!DR#P#Q!=y#Q#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DWX$i&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DvP;=`<%l!CW<z!EOX$i&jOY!=yYZ&cZ!^!=y!^!_!@c!_#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!EnP;=`<%l!=y>^!Ezl$i&j(Z!b!X7`OY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#W&}#W#X!Eq#X#Z&}#Z#[!Eq#[#]&}#]#^!Eq#^#a&}#a#b!Eq#b#g&}#g#h!Eq#h#i&}#i#j!Eq#j#k!Eq#k#m&}#m#n!Eq#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}8r!GyZ(Z!b!X7`OY!GrZw!Grwx!@cx!P!Gr!P!Q!Hl!Q!}!Gr!}#O!JU#O#P!Bq#P;'S!Gr;'S;=`!J|<%lO!Gr8r!Hse(Z!b!X7`OY'}Zw'}x#O'}#P#W'}#W#X!Hl#X#Z'}#Z#[!Hl#[#]'}#]#^!Hl#^#a'}#a#b!Hl#b#g'}#g#h!Hl#h#i'}#i#j!Hl#j#k!Hl#k#m'}#m#n!Hl#n;'S'};'S;=`(f<%lO'}8r!JZX(Z!bOY!JUZw!JUwx!Arx#O!JU#O#P!B[#P#Q!Gr#Q;'S!JU;'S;=`!Jv<%lO!JU8r!JyP;=`<%l!JU8r!KPP;=`<%l!Gr>^!KZ^$i&j(Z!bOY!KSYZ&cZw!KSwx!CWx!^!KS!^!_!JU!_#O!KS#O#P!DR#P#Q!<n#Q#o!KS#o#p!JU#p;'S!KS;'S;=`!LV<%lO!KS>^!LYP;=`<%l!KS>^!L`P;=`<%l!<n=l!Ll`$i&j(Wp!X7`OY!LcYZ&cZr!Lcrs!=ys!P!Lc!P!Q!Mn!Q!^!Lc!^!_# o!_!}!Lc!}#O#%P#O#P!Dy#P#o!Lc#o#p# o#p;'S!Lc;'S;=`#&Y<%lO!Lc=l!Mwl$i&j(Wp!X7`OY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#W(r#W#X!Mn#X#Z(r#Z#[!Mn#[#](r#]#^!Mn#^#a(r#a#b!Mn#b#g(r#g#h!Mn#h#i(r#i#j!Mn#j#k!Mn#k#m(r#m#n!Mn#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r8Q# vZ(Wp!X7`OY# oZr# ors!@cs!P# o!P!Q#!i!Q!}# o!}#O#$R#O#P!Bq#P;'S# o;'S;=`#$y<%lO# o8Q#!pe(Wp!X7`OY)rZr)rs#O)r#P#W)r#W#X#!i#X#Z)r#Z#[#!i#[#])r#]#^#!i#^#a)r#a#b#!i#b#g)r#g#h#!i#h#i)r#i#j#!i#j#k#!i#k#m)r#m#n#!i#n;'S)r;'S;=`*Z<%lO)r8Q#$WX(WpOY#$RZr#$Rrs!Ars#O#$R#O#P!B[#P#Q# o#Q;'S#$R;'S;=`#$s<%lO#$R8Q#$vP;=`<%l#$R8Q#$|P;=`<%l# o=l#%W^$i&j(WpOY#%PYZ&cZr#%Prs!CWs!^#%P!^!_#$R!_#O#%P#O#P!DR#P#Q!Lc#Q#o#%P#o#p#$R#p;'S#%P;'S;=`#&S<%lO#%P=l#&VP;=`<%l#%P=l#&]P;=`<%l!Lc?O#&kn$i&j(Wp(Z!b!X7`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#W%Z#W#X#&`#X#Z%Z#Z#[#&`#[#]%Z#]#^#&`#^#a%Z#a#b#&`#b#g%Z#g#h#&`#h#i%Z#i#j#&`#j#k#&`#k#m%Z#m#n#&`#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z9d#(r](Wp(Z!b!X7`OY#(iZr#(irs!Grsw#(iwx# ox!P#(i!P!Q#)k!Q!}#(i!}#O#+`#O#P!Bq#P;'S#(i;'S;=`#,`<%lO#(i9d#)th(Wp(Z!b!X7`OY*gZr*grs'}sw*gwx)rx#O*g#P#W*g#W#X#)k#X#Z*g#Z#[#)k#[#]*g#]#^#)k#^#a*g#a#b#)k#b#g*g#g#h#)k#h#i*g#i#j#)k#j#k#)k#k#m*g#m#n#)k#n;'S*g;'S;=`+Z<%lO*g9d#+gZ(Wp(Z!bOY#+`Zr#+`rs!JUsw#+`wx#$Rx#O#+`#O#P!B[#P#Q#(i#Q;'S#+`;'S;=`#,Y<%lO#+`9d#,]P;=`<%l#+`9d#,cP;=`<%l#(i?O#,o`$i&j(Wp(Z!bOY#,fYZ&cZr#,frs!KSsw#,fwx#%Px!^#,f!^!_#+`!_#O#,f#O#P!DR#P#Q!;Z#Q#o#,f#o#p#+`#p;'S#,f;'S;=`#-q<%lO#,f?O#-tP;=`<%l#,f?O#-zP;=`<%l!;Z07[#.[b$i&j(Wp(Z!b(O0/l!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z07[#/o_$i&j(Wp(Z!bT0/lOY#/dYZ&cZr#/drs#0nsw#/dwx#4Ox!^#/d!^!_#5}!_#O#/d#O#P#1p#P#o#/d#o#p#5}#p;'S#/d;'S;=`#6|<%lO#/d06j#0w]$i&j(Z!bT0/lOY#0nYZ&cZw#0nwx#1px!^#0n!^!_#3R!_#O#0n#O#P#1p#P#o#0n#o#p#3R#p;'S#0n;'S;=`#3x<%lO#0n05W#1wX$i&jT0/lOY#1pYZ&cZ!^#1p!^!_#2d!_#o#1p#o#p#2d#p;'S#1p;'S;=`#2{<%lO#1p0/l#2iST0/lOY#2dZ;'S#2d;'S;=`#2u<%lO#2d0/l#2xP;=`<%l#2d05W#3OP;=`<%l#1p01O#3YW(Z!bT0/lOY#3RZw#3Rwx#2dx#O#3R#O#P#2d#P;'S#3R;'S;=`#3r<%lO#3R01O#3uP;=`<%l#3R06j#3{P;=`<%l#0n05x#4X]$i&j(WpT0/lOY#4OYZ&cZr#4Ors#1ps!^#4O!^!_#5Q!_#O#4O#O#P#1p#P#o#4O#o#p#5Q#p;'S#4O;'S;=`#5w<%lO#4O00^#5XW(WpT0/lOY#5QZr#5Qrs#2ds#O#5Q#O#P#2d#P;'S#5Q;'S;=`#5q<%lO#5Q00^#5tP;=`<%l#5Q05x#5zP;=`<%l#4O01p#6WY(Wp(Z!bT0/lOY#5}Zr#5}rs#3Rsw#5}wx#5Qx#O#5}#O#P#2d#P;'S#5};'S;=`#6v<%lO#5}01p#6yP;=`<%l#5}07[#7PP;=`<%l#/d)3h#7ab$i&j$Q(Ch(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;ZAt#8vb$Z#t$i&j(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z'Ad#:Zp$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#U%Z#U#V#?i#V#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#d#Bq#d#l%Z#l#m#Es#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#<jk$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#>j_$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#?rd$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#A]f$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Bzc$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Dbe$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#E|g$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Gpi$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x#Il_!g$b$i&j$O)Lv(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#Jv_al$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f#LS^h#)`#R-<U(Wp(Z!b$n7`OY*gZr*grs'}sw*gwx)rx!P*g!P!Q#MO!Q!^*g!^!_#Mt!_!`$ f!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#MXX$k&j(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El#M}Z#r(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#Np!`#O*g#P;'S*g;'S;=`+Z<%lO*g(El#NyX$Q(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El$ oX#s(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g*)x$!ga#`*!Y$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$#l!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(K[$#w_#k(Cl$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x$%Vag!*r#s(Ch$f#|$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$&[!`!a$'f!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$&g_#s(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$'qa#r(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$(v!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$)R`#r(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(Kd$*`a(r(Ct$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!a%Z!a!b$+e!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$+p`$i&j#{(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`$,}_!|$Ip$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f$.X_!S0,v$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/]Z$i&jO!^$0O!^!_$0f!_#i$0O#i#j$0k#j#l$0O#l#m$2^#m#o$0O#o#p$0f#p;'S$0O;'S;=`$4i<%lO$0O(n$0VT_#S$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0kO_#S(n$0p[$i&jO!Q&c!Q![$1f![!^&c!_!c&c!c!i$1f!i#T&c#T#Z$1f#Z#o&c#o#p$3|#p;'S&c;'S;=`&w<%lO&c(n$1kZ$i&jO!Q&c!Q![$2^![!^&c!_!c&c!c!i$2^!i#T&c#T#Z$2^#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2cZ$i&jO!Q&c!Q![$3U![!^&c!_!c&c!c!i$3U!i#T&c#T#Z$3U#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3ZZ$i&jO!Q&c!Q![$0O![!^&c!_!c&c!c!i$0O!i#T&c#T#Z$0O#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$4PR!Q![$4Y!c!i$4Y#T#Z$4Y#S$4]S!Q![$4Y!c!i$4Y#T#Z$4Y#q#r$0f(n$4lP;=`<%l$0O#1[$4z_!Y#)l$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$6U`#x(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;p$7c_$i&j(Wp(Z!b(a+4QOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$8qk$i&j(Wp(Z!b(T,2j$_#t(e$I[OY%ZYZ&cZr%Zrs&}st%Ztu$8buw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$8b![!^%Z!^!_*g!_!c%Z!c!}$8b!}#O%Z#O#P&c#P#R%Z#R#S$8b#S#T%Z#T#o$8b#o#p*g#p$g%Z$g;'S$8b;'S;=`$<l<%lO$8b+d$:qk$i&j(Wp(Z!b$_#tOY%ZYZ&cZr%Zrs&}st%Ztu$:fuw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$:f![!^%Z!^!_*g!_!c%Z!c!}$:f!}#O%Z#O#P&c#P#R%Z#R#S$:f#S#T%Z#T#o$:f#o#p*g#p$g%Z$g;'S$:f;'S;=`$<f<%lO$:f+d$<iP;=`<%l$:f07[$<oP;=`<%l$8b#Jf$<{X!_#Hb(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g,#x$=sa(y+JY$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+e#q;'S%Z;'S;=`+a<%lO%Z)>v$?V_!^(CdvBr$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z?O$@a_!q7`$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$Aq|$i&j(Wp(Z!b'|0/l$]#t(T,2j(e$I[OX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr07[$D|k$i&j(Wp(Z!b'}0/l$]#t(T,2j(e$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
  tokenizers: [fP, uP, OP, dP, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, cP, new _c("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOx~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!U~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(c~~", 141, 340), new _c("j~RQYZXz{^~^O(Q~~aP!P!Qd~iO(R~~", 25, 323)],
  topRules: { Script: [0, 7], SingleExpression: [1, 276], SingleClassItem: [2, 277] },
  dialects: { jsx: 0, ts: 15175 },
  dynamicPrecedences: { 80: 1, 82: 1, 94: 1, 169: 1, 199: 1 },
  specialized: [{ term: 327, get: (n) => gP[n] || -1 }, { term: 343, get: (n) => mP[n] || -1 }, { term: 95, get: (n) => vP[n] || -1 }],
  tokenPrec: 15201
});
function wO(n) {
  let e = Object.keys(n).join(""), t = /\w/.test(e);
  return t && (e = e.replace(/\w/g, "")), `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function bP(n) {
  let e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  for (let { label: r } of n) {
    e[r[0]] = !0;
    for (let s = 1; s < r.length; s++)
      t[r[s]] = !0;
  }
  let i = wO(e) + wO(t) + "*$";
  return [new RegExp("^" + i), new RegExp(i)];
}
function lm(n) {
  let e = n.map((r) => typeof r == "string" ? { label: r } : r), [t, i] = e.every((r) => /^\w+$/.test(r.label)) ? [/\w*$/, /\w+$/] : bP(e);
  return (r) => {
    let s = r.matchBefore(i);
    return s || r.explicit ? { from: s ? s.from : r.pos, options: e, validFor: t } : null;
  };
}
function hm(n, e) {
  return (t) => {
    for (let i = pt(t.state).resolveInner(t.pos, -1); i; i = i.parent) {
      if (n.indexOf(i.name) > -1)
        return null;
      if (i.type.isTop)
        break;
    }
    return e(t);
  };
}
const SP = /* @__PURE__ */ sr.define(), yP = /* @__PURE__ */ ce.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center",
    cursor: "pointer"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box",
    whiteSpace: "pre-line"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
});
class kP {
  constructor(e, t, i, r) {
    this.field = e, this.line = t, this.from = i, this.to = r;
  }
}
class $f {
  constructor(e, t, i) {
    this.field = e, this.from = t, this.to = i;
  }
  map(e) {
    let t = e.mapPos(this.from, -1, Zt.TrackDel), i = e.mapPos(this.to, 1, Zt.TrackDel);
    return t == null || i == null ? null : new $f(this.field, t, i);
  }
}
class Zf {
  constructor(e, t) {
    this.lines = e, this.fieldPositions = t;
  }
  instantiate(e, t) {
    let i = [], r = [t], s = e.doc.lineAt(t), o = /^\s*/.exec(s.text)[0];
    for (let l of this.lines) {
      if (i.length) {
        let h = o, c = /^\t*/.exec(l)[0].length;
        for (let f = 0; f < c; f++)
          h += e.facet(Pl);
        r.push(t + h.length - c), l = h + l.slice(c);
      }
      i.push(l), t += l.length + 1;
    }
    let a = this.fieldPositions.map((l) => new $f(l.field, r[l.line] + l.from, r[l.line] + l.to));
    return { text: i, ranges: a };
  }
  static parse(e) {
    let t = [], i = [], r = [], s;
    for (let o of e.split(/\r\n?|\n/)) {
      for (; s = /[#$]\{(?:(\d+)(?::([^{}]*))?|((?:\\[{}]|[^{}])*))\}/.exec(o); ) {
        let a = s[1] ? +s[1] : null, l = s[2] || s[3] || "", h = -1;
        a === 0 && (a = 1e9);
        let c = l.replace(/\\[{}]/g, (f) => f[1]);
        for (let f = 0; f < t.length; f++)
          (a != null ? t[f].seq == a : c && t[f].name == c) && (h = f);
        if (h < 0) {
          let f = 0;
          for (; f < t.length && (a == null || t[f].seq != null && t[f].seq < a); )
            f++;
          t.splice(f, 0, { seq: a, name: c }), h = f;
          for (let O of r)
            O.field >= h && O.field++;
        }
        for (let f of r)
          if (f.line == i.length && f.from > s.index) {
            let O = s[2] ? 3 + (s[1] || "").length : 2;
            f.from -= O, f.to -= O;
          }
        r.push(new kP(h, i.length, s.index, s.index + c.length)), o = o.slice(0, s.index) + l + o.slice(s.index + s[0].length);
      }
      o = o.replace(/\\([{}])/g, (a, l, h) => {
        for (let c of r)
          c.line == i.length && c.from > h && (c.from--, c.to--);
        return l;
      }), i.push(o);
    }
    return new Zf(i, r);
  }
}
let xP = /* @__PURE__ */ pe.widget({ widget: /* @__PURE__ */ new class extends qi {
  toDOM() {
    let n = document.createElement("span");
    return n.className = "cm-snippetFieldPosition", n;
  }
  ignoreEvent() {
    return !1;
  }
}() }), wP = /* @__PURE__ */ pe.mark({ class: "cm-snippetField" });
class Ps {
  constructor(e, t) {
    this.ranges = e, this.active = t, this.deco = pe.set(e.map((i) => (i.from == i.to ? xP : wP).range(i.from, i.to)), !0);
  }
  map(e) {
    let t = [];
    for (let i of this.ranges) {
      let r = i.map(e);
      if (!r)
        return null;
      t.push(r);
    }
    return new Ps(t, this.active);
  }
  selectionInsideField(e) {
    return e.ranges.every((t) => this.ranges.some((i) => i.field == this.active && i.from <= t.from && i.to >= t.to));
  }
}
const Lo = /* @__PURE__ */ qe.define({
  map(n, e) {
    return n && n.map(e);
  }
}), PP = /* @__PURE__ */ qe.define(), _o = /* @__PURE__ */ ui.define({
  create() {
    return null;
  },
  update(n, e) {
    for (let t of e.effects) {
      if (t.is(Lo))
        return t.value;
      if (t.is(PP) && n)
        return new Ps(n.ranges, t.value);
    }
    return n && e.docChanged && (n = n.map(e.changes)), n && e.selection && !n.selectionInsideField(e.selection) && (n = null), n;
  },
  provide: (n) => ce.decorations.from(n, (e) => e ? e.deco : pe.none)
});
function Rf(n, e) {
  return te.create(n.filter((t) => t.field == e).map((t) => te.range(t.from, t.to)));
}
function _P(n) {
  let e = Zf.parse(n);
  return (t, i, r, s) => {
    let { text: o, ranges: a } = e.instantiate(t.state, r), { main: l } = t.state.selection, h = {
      changes: { from: r, to: s == l.from ? l.to : s, insert: je.of(o) },
      scrollIntoView: !0,
      annotations: i ? [SP.of(i), St.userEvent.of("input.complete")] : void 0
    };
    if (a.length && (h.selection = Rf(a, 0)), a.some((c) => c.field > 0)) {
      let c = new Ps(a, 0), f = h.effects = [Lo.of(c)];
      t.state.field(_o, !1) === void 0 && f.push(qe.appendConfig.of([_o, XP, CP, yP]));
    }
    t.dispatch(t.state.update(h));
  };
}
function cm(n) {
  return ({ state: e, dispatch: t }) => {
    let i = e.field(_o, !1);
    if (!i || n < 0 && i.active == 0)
      return !1;
    let r = i.active + n, s = n > 0 && !i.ranges.some((o) => o.field == r + n);
    return t(e.update({
      selection: Rf(i.ranges, r),
      effects: Lo.of(s ? null : new Ps(i.ranges, r)),
      scrollIntoView: !0
    })), !0;
  };
}
const TP = ({ state: n, dispatch: e }) => n.field(_o, !1) ? (e(n.update({ effects: Lo.of(null) })), !0) : !1, $P = /* @__PURE__ */ cm(1), ZP = /* @__PURE__ */ cm(-1), RP = [
  { key: "Tab", run: $P, shift: ZP },
  { key: "Escape", run: TP }
], PO = /* @__PURE__ */ se.define({
  combine(n) {
    return n.length ? n[0] : RP;
  }
}), XP = /* @__PURE__ */ Mr.highest(/* @__PURE__ */ sf.compute([PO], (n) => n.facet(PO)));
function st(n, e) {
  return { ...e, apply: _P(n) };
}
const CP = /* @__PURE__ */ ce.domEventHandlers({
  mousedown(n, e) {
    let t = e.state.field(_o, !1), i;
    if (!t || (i = e.posAtCoords({ x: n.clientX, y: n.clientY })) == null)
      return !1;
    let r = t.ranges.find((s) => s.from <= i && s.to >= i);
    return !r || r.field == t.active ? !1 : (e.dispatch({
      selection: Rf(t.ranges, r.field),
      effects: Lo.of(t.ranges.some((s) => s.field > r.field) ? new Ps(t.ranges, r.field) : null),
      scrollIntoView: !0
    }), !0);
  }
}), fm = /* @__PURE__ */ new class extends $n {
}();
fm.startSide = 1;
fm.endSide = -1;
const Xf = [
  /* @__PURE__ */ st("function ${name}(${params}) {\n	${}\n}", {
    label: "function",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ st("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ st("for (let ${name} of ${collection}) {\n	${}\n}", {
    label: "for",
    detail: "of loop",
    type: "keyword"
  }),
  /* @__PURE__ */ st("do {\n	${}\n} while (${})", {
    label: "do",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ st("while (${}) {\n	${}\n}", {
    label: "while",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ st(`try {
	\${}
} catch (\${error}) {
	\${}
}`, {
    label: "try",
    detail: "/ catch block",
    type: "keyword"
  }),
  /* @__PURE__ */ st("if (${}) {\n	${}\n}", {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  /* @__PURE__ */ st(`if (\${}) {
	\${}
} else {
	\${}
}`, {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  /* @__PURE__ */ st(`class \${name} {
	constructor(\${params}) {
		\${}
	}
}`, {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ st('import {${names}} from "${module}"\n${}', {
    label: "import",
    detail: "named",
    type: "keyword"
  }),
  /* @__PURE__ */ st('import ${name} from "${module}"\n${}', {
    label: "import",
    detail: "default",
    type: "keyword"
  })
], um = /* @__PURE__ */ Xf.concat([
  /* @__PURE__ */ st("interface ${name} {\n	${}\n}", {
    label: "interface",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ st("type ${name} = ${type}", {
    label: "type",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ st("enum ${name} {\n	${}\n}", {
    label: "enum",
    detail: "definition",
    type: "keyword"
  })
]), _O = /* @__PURE__ */ new $g(), Om = /* @__PURE__ */ new Set([
  "Script",
  "Block",
  "FunctionExpression",
  "FunctionDeclaration",
  "ArrowFunction",
  "MethodDeclaration",
  "ForStatement"
]);
function Ms(n) {
  return (e, t) => {
    let i = e.node.getChild("VariableDefinition");
    return i && t(i, n), !0;
  };
}
const AP = ["FunctionDeclaration"], qP = {
  FunctionDeclaration: /* @__PURE__ */ Ms("function"),
  ClassDeclaration: /* @__PURE__ */ Ms("class"),
  ClassExpression: () => !0,
  EnumDeclaration: /* @__PURE__ */ Ms("constant"),
  TypeAliasDeclaration: /* @__PURE__ */ Ms("type"),
  NamespaceDeclaration: /* @__PURE__ */ Ms("namespace"),
  VariableDefinition(n, e) {
    n.matchContext(AP) || e(n, "variable");
  },
  TypeDefinition(n, e) {
    e(n, "type");
  },
  __proto__: null
};
function dm(n, e) {
  let t = _O.get(e);
  if (t)
    return t;
  let i = [], r = !0;
  function s(o, a) {
    let l = n.sliceString(o.from, o.to);
    i.push({ label: l, type: a });
  }
  return e.cursor(it.IncludeAnonymous).iterate((o) => {
    if (r)
      r = !1;
    else if (o.name) {
      let a = qP[o.name];
      if (a && a(o, s) || Om.has(o.name))
        return !1;
    } else if (o.to - o.from > 8192) {
      for (let a of dm(n, o.node))
        i.push(a);
      return !1;
    }
  }), _O.set(e, i), i;
}
const rl = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/, Cf = [
  "TemplateString",
  "String",
  "RegExp",
  "LineComment",
  "BlockComment",
  "VariableDefinition",
  "TypeDefinition",
  "Label",
  "PropertyDefinition",
  "PropertyName",
  "PrivatePropertyDefinition",
  "PrivatePropertyName",
  "JSXText",
  "JSXAttributeValue",
  "JSXOpenTag",
  "JSXCloseTag",
  "JSXSelfClosingTag",
  ".",
  "?."
];
function pm(n) {
  let e = pt(n.state).resolveInner(n.pos, -1);
  if (Cf.indexOf(e.name) > -1)
    return null;
  let t = e.name == "VariableName" || e.to - e.from < 20 && rl.test(n.state.sliceDoc(e.from, e.to));
  if (!t && !n.explicit)
    return null;
  let i = [];
  for (let r = e; r; r = r.parent)
    Om.has(r.name) && (i = i.concat(dm(n.state.doc, r)));
  return {
    options: i,
    from: t ? e.from : n.pos,
    validFor: rl
  };
}
function ph(n, e, t) {
  var i;
  let r = [];
  for (; ; ) {
    let s = e.firstChild, o;
    if ((s == null ? void 0 : s.name) == "VariableName")
      return r.push(n(s)), { path: r.reverse(), name: t };
    if ((s == null ? void 0 : s.name) == "MemberExpression" && ((i = o = s.lastChild) === null || i === void 0 ? void 0 : i.name) == "PropertyName")
      r.push(n(o)), e = s;
    else
      return null;
  }
}
function gm(n) {
  let e = (i) => n.state.doc.sliceString(i.from, i.to), t = pt(n.state).resolveInner(n.pos, -1);
  return t.name == "PropertyName" ? ph(e, t.parent, e(t)) : (t.name == "." || t.name == "?.") && t.parent.name == "MemberExpression" ? ph(e, t.parent, "") : Cf.indexOf(t.name) > -1 ? null : t.name == "VariableName" || t.to - t.from < 20 && rl.test(e(t)) ? { path: [], name: e(t) } : t.name == "MemberExpression" ? ph(e, t, "") : n.explicit ? { path: [], name: "" } : null;
}
function zP(n, e) {
  let t = n, i = [], r = /* @__PURE__ */ new Set();
  for (let s = 0; ; s++) {
    for (let a of (Object.getOwnPropertyNames || Object.keys)(n)) {
      if (!/^[a-zA-Z_$\xaa-\uffdc][\w$\xaa-\uffdc]*$/.test(a) || r.has(a))
        continue;
      r.add(a);
      let l;
      try {
        l = t[a];
      } catch {
        continue;
      }
      i.push({
        label: a,
        type: typeof l == "function" ? /^[A-Z]/.test(a) ? "class" : e ? "function" : "method" : e ? "variable" : "property",
        boost: -s
      });
    }
    let o = Object.getPrototypeOf(n);
    if (!o)
      return i;
    n = o;
  }
}
function MP(n) {
  let e = /* @__PURE__ */ new Map();
  return (t) => {
    let i = gm(t);
    if (!i)
      return null;
    let r = n;
    for (let o of i.path)
      if (r = r[o], !r)
        return null;
    let s = e.get(r);
    return s || e.set(r, s = zP(r, !i.path.length)), {
      from: t.pos - i.name.length,
      options: s,
      validFor: rl
    };
  };
}
const _n = /* @__PURE__ */ vs.define({
  name: "javascript",
  parser: /* @__PURE__ */ QP.configure({
    props: [
      /* @__PURE__ */ Vo.add({
        IfStatement: /* @__PURE__ */ $a({ except: /^\s*({|else\b)/ }),
        TryStatement: /* @__PURE__ */ $a({ except: /^\s*({|catch\b|finally\b)/ }),
        LabeledStatement: Eg,
        SwitchBody: (n) => {
          let e = n.textAfter, t = /^\s*\}/.test(e), i = /^\s*(case|default)\b/.test(e);
          return n.baseIndent + (t ? 0 : i ? 1 : 2) * n.unit;
        },
        Block: /* @__PURE__ */ lo({ closing: "}" }),
        ArrowFunction: (n) => n.baseIndent + n.unit,
        "TemplateString BlockComment": () => null,
        "Statement Property": /* @__PURE__ */ $a({ except: /^\s*{/ }),
        JSXElement(n) {
          let e = /^\s*<\//.test(n.textAfter);
          return n.lineIndent(n.node.from) + (e ? 0 : n.unit);
        },
        JSXEscape(n) {
          let e = /\s*\}/.test(n.textAfter);
          return n.lineIndent(n.node.from) + (e ? 0 : n.unit);
        },
        "JSXOpenTag JSXSelfClosingTag"(n) {
          return n.column(n.node.from) + n.unit;
        }
      }),
      /* @__PURE__ */ $l.add({
        "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": bf,
        BlockComment(n) {
          return { from: n.from + 2, to: n.to - 2 };
        },
        JSXElement(n) {
          let e = n.firstChild;
          if (!e || e.name == "JSXSelfClosingTag")
            return null;
          let t = n.lastChild;
          return { from: e.to, to: t.type.isError ? n.to : t.from };
        },
        "JSXSelfClosingTag JSXOpenTag"(n) {
          var e;
          let t = (e = n.firstChild) === null || e === void 0 ? void 0 : e.nextSibling, i = n.lastChild;
          return !t || t.type.isError ? null : { from: t.to, to: i.type.isError ? n.to : i.from };
        }
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
    wordChars: "$"
  }
}), mm = {
  test: (n) => /^JSX/.test(n.name),
  facet: /* @__PURE__ */ xl({ commentTokens: { block: { open: "{/*", close: "*/}" } } })
}, vm = /* @__PURE__ */ _n.configure({ dialect: "ts" }, "typescript"), Qm = /* @__PURE__ */ _n.configure({
  dialect: "jsx",
  props: [/* @__PURE__ */ wl.add((n) => n.isTop ? [mm] : void 0)]
}), bm = /* @__PURE__ */ _n.configure({
  dialect: "jsx ts",
  props: [/* @__PURE__ */ wl.add((n) => n.isTop ? [mm] : void 0)]
}, "typescript");
let Sm = (n) => ({ label: n, type: "keyword" });
const ym = /* @__PURE__ */ "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(Sm), WP = /* @__PURE__ */ ym.concat(/* @__PURE__ */ ["declare", "implements", "private", "protected", "public"].map(Sm));
function EP(n = {}) {
  let e = n.jsx ? n.typescript ? bm : Qm : n.typescript ? vm : _n, t = n.typescript ? um.concat(WP) : Xf.concat(ym);
  return new gf(e, [
    _n.data.of({
      autocomplete: hm(Cf, lm(t))
    }),
    _n.data.of({
      autocomplete: pm
    }),
    n.jsx ? km : []
  ]);
}
function jP(n) {
  for (; ; ) {
    if (n.name == "JSXOpenTag" || n.name == "JSXSelfClosingTag" || n.name == "JSXFragmentTag")
      return n;
    if (n.name == "JSXEscape" || !n.parent)
      return null;
    n = n.parent;
  }
}
function TO(n, e, t = n.length) {
  for (let i = e == null ? void 0 : e.firstChild; i; i = i.nextSibling)
    if (i.name == "JSXIdentifier" || i.name == "JSXBuiltin" || i.name == "JSXNamespacedName" || i.name == "JSXMemberExpression")
      return n.sliceString(i.from, Math.min(i.to, t));
  return "";
}
const VP = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), km = /* @__PURE__ */ ce.inputHandler.of((n, e, t, i, r) => {
  if ((VP ? n.composing : n.compositionStarted) || n.state.readOnly || e != t || i != ">" && i != "/" || !_n.isActiveAt(n.state, e, -1))
    return !1;
  let s = r(), { state: o } = s, a = o.changeByRange((l) => {
    var h;
    let { head: c } = l, f = pt(o).resolveInner(c - 1, -1), O;
    if (f.name == "JSXStartTag" && (f = f.parent), !(o.doc.sliceString(c - 1, c) != i || f.name == "JSXAttributeValue" && f.to > c)) {
      if (i == ">" && f.name == "JSXFragmentTag")
        return { range: l, changes: { from: c, insert: "</>" } };
      if (i == "/" && f.name == "JSXStartCloseTag") {
        let d = f.parent, p = d.parent;
        if (p && d.from == c - 2 && ((O = TO(o.doc, p.firstChild, c)) || ((h = p.firstChild) === null || h === void 0 ? void 0 : h.name) == "JSXFragmentTag")) {
          let g = `${O}>`;
          return { range: te.cursor(c + g.length, -1), changes: { from: c, insert: g } };
        }
      } else if (i == ">") {
        let d = jP(f);
        if (d && d.name == "JSXOpenTag" && !/^\/?>|^<\//.test(o.doc.sliceString(c, c + 2)) && (O = TO(o.doc, d, c)))
          return { range: l, changes: { from: c, insert: `</${O}>` } };
      }
    }
    return { range: l };
  });
  return a.changes.empty ? !1 : (n.dispatch([
    s,
    o.update(a, { userEvent: "input.complete", scrollIntoView: !0 })
  ]), !0);
});
function YP(n, e) {
  return e || (e = {
    parserOptions: { ecmaVersion: 2019, sourceType: "module" },
    env: { browser: !0, node: !0, es6: !0, es2015: !0, es2017: !0, es2020: !0 },
    rules: {}
  }, n.getRules().forEach((t, i) => {
    var r;
    !((r = t.meta.docs) === null || r === void 0) && r.recommended && (e.rules[i] = 2);
  })), (t) => {
    let { state: i } = t, r = [];
    for (let { from: s, to: o } of _n.findRegions(i)) {
      let a = i.doc.lineAt(s), l = { line: a.number - 1, col: s - a.from, pos: s };
      for (let h of n.verify(i.sliceDoc(s, o), e))
        r.push(LP(h, i.doc, l));
    }
    return r;
  };
}
function $O(n, e, t, i) {
  return t.line(n + i.line).from + e + (n == 1 ? i.col - 1 : -1);
}
function LP(n, e, t) {
  let i = $O(n.line, n.column, e, t), r = {
    from: i,
    to: n.endLine != null && n.endColumn != 1 ? $O(n.endLine, n.endColumn, e, t) : i,
    message: n.message,
    source: n.ruleId ? "eslint:" + n.ruleId : "eslint",
    severity: n.severity == 1 ? "warning" : "error"
  };
  if (n.fix) {
    let { range: s, text: o } = n.fix, a = s[0] + t.pos - i, l = s[1] + t.pos - i;
    r.actions = [{
      name: "fix",
      apply(h, c) {
        h.dispatch({ changes: { from: c + a, to: c + l, insert: o }, scrollIntoView: !0 });
      }
    }];
  }
  return r;
}
const DP = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  autoCloseTags: km,
  completionPath: gm,
  esLint: YP,
  javascript: EP,
  javascriptLanguage: _n,
  jsxLanguage: Qm,
  localCompletionSource: pm,
  scopeCompletionSource: MP,
  snippets: Xf,
  tsxLanguage: bm,
  typescriptLanguage: vm,
  typescriptSnippets: um
}, Symbol.toStringTag, { value: "Module" })), GP = 1, xm = 194, wm = 195, IP = 196, ZO = 197, UP = 198, NP = 199, BP = 200, FP = 2, Pm = 3, RO = 201, HP = 24, JP = 25, KP = 49, e_ = 50, t_ = 55, i_ = 56, n_ = 57, r_ = 59, s_ = 60, o_ = 61, a_ = 62, l_ = 63, h_ = 65, c_ = 238, f_ = 71, u_ = 241, O_ = 242, d_ = 243, p_ = 244, g_ = 245, m_ = 246, v_ = 247, Q_ = 248, _m = 72, b_ = 249, S_ = 250, y_ = 251, k_ = 252, x_ = 253, w_ = 254, P_ = 255, __ = 256, T_ = 73, $_ = 77, Z_ = 263, R_ = 112, X_ = 130, C_ = 151, A_ = 152, q_ = 155, zr = 10, To = 13, Af = 32, Zl = 9, qf = 35, z_ = 40, M_ = 46, Zc = 123, XO = 125, Tm = 39, $m = 34, CO = 92, W_ = 111, E_ = 120, j_ = 78, V_ = 117, Y_ = 85, L_ = /* @__PURE__ */ new Set([
  JP,
  KP,
  e_,
  Z_,
  h_,
  X_,
  i_,
  n_,
  c_,
  a_,
  l_,
  _m,
  T_,
  $_,
  s_,
  o_,
  C_,
  A_,
  q_,
  R_
]);
function gh(n) {
  return n == zr || n == To;
}
function mh(n) {
  return n >= 48 && n <= 57 || n >= 65 && n <= 70 || n >= 97 && n <= 102;
}
const D_ = new qn((n, e) => {
  let t;
  if (n.next < 0)
    n.acceptToken(NP);
  else if (e.context.flags & Xa)
    gh(n.next) && n.acceptToken(UP, 1);
  else if (((t = n.peek(-1)) < 0 || gh(t)) && e.canShift(ZO)) {
    let i = 0;
    for (; n.next == Af || n.next == Zl; )
      n.advance(), i++;
    (n.next == zr || n.next == To || n.next == qf) && n.acceptToken(ZO, -i);
  } else gh(n.next) && n.acceptToken(IP, 1);
}, { contextual: !0 }), G_ = new qn((n, e) => {
  let t = e.context;
  if (t.flags) return;
  let i = n.peek(-1);
  if (i == zr || i == To) {
    let r = 0, s = 0;
    for (; ; ) {
      if (n.next == Af) r++;
      else if (n.next == Zl) r += 8 - r % 8;
      else break;
      n.advance(), s++;
    }
    r != t.indent && n.next != zr && n.next != To && n.next != qf && (r < t.indent ? n.acceptToken(wm, -s) : n.acceptToken(xm));
  }
}), Xa = 1, Zm = 2, On = 4, dn = 8, pn = 16, gn = 32;
function Ca(n, e, t) {
  this.parent = n, this.indent = e, this.flags = t, this.hash = (n ? n.hash + n.hash << 8 : 0) + e + (e << 4) + t + (t << 6);
}
const I_ = new Ca(null, 0, 0);
function U_(n) {
  let e = 0;
  for (let t = 0; t < n.length; t++)
    e += n.charCodeAt(t) == Zl ? 8 - e % 8 : 1;
  return e;
}
const AO = new Map([
  [u_, 0],
  [O_, On],
  [d_, dn],
  [p_, dn | On],
  [g_, pn],
  [m_, pn | On],
  [v_, pn | dn],
  [Q_, pn | dn | On],
  [b_, gn],
  [S_, gn | On],
  [y_, gn | dn],
  [k_, gn | dn | On],
  [x_, gn | pn],
  [w_, gn | pn | On],
  [P_, gn | pn | dn],
  [__, gn | pn | dn | On]
].map(([n, e]) => [n, e | Zm])), N_ = new om({
  start: I_,
  reduce(n, e, t, i) {
    return n.flags & Xa && L_.has(e) || (e == f_ || e == _m) && n.flags & Zm ? n.parent : n;
  },
  shift(n, e, t, i) {
    return e == xm ? new Ca(n, U_(i.read(i.pos, t.pos)), 0) : e == wm ? n.parent : e == HP || e == t_ || e == r_ || e == Pm ? new Ca(n, 0, Xa) : AO.has(e) ? new Ca(n, 0, AO.get(e) | n.flags & Xa) : n;
  },
  hash(n) {
    return n.hash;
  }
}), B_ = new qn((n) => {
  for (let e = 0; e < 5; e++) {
    if (n.next != "print".charCodeAt(e)) return;
    n.advance();
  }
  if (!/\w/.test(String.fromCharCode(n.next)))
    for (let e = 0; ; e++) {
      let t = n.peek(e);
      if (!(t == Af || t == Zl)) {
        t != z_ && t != M_ && t != zr && t != To && t != qf && n.acceptToken(GP);
        return;
      }
    }
}), F_ = new qn((n, e) => {
  let { flags: t } = e.context, i = t & On ? $m : Tm, r = (t & dn) > 0, s = !(t & pn), o = (t & gn) > 0, a = n.pos;
  for (; !(n.next < 0); )
    if (o && n.next == Zc)
      if (n.peek(1) == Zc)
        n.advance(2);
      else {
        if (n.pos == a) {
          n.acceptToken(Pm, 1);
          return;
        }
        break;
      }
    else if (s && n.next == CO) {
      if (n.pos == a) {
        n.advance();
        let l = n.next;
        l >= 0 && (n.advance(), H_(n, l)), n.acceptToken(FP);
        return;
      }
      break;
    } else if (n.next == CO && !s && n.peek(1) > -1)
      n.advance(2);
    else if (n.next == i && (!r || n.peek(1) == i && n.peek(2) == i)) {
      if (n.pos == a) {
        n.acceptToken(RO, r ? 3 : 1);
        return;
      }
      break;
    } else if (n.next == zr) {
      if (r)
        n.advance();
      else if (n.pos == a) {
        n.acceptToken(RO);
        return;
      }
      break;
    } else
      n.advance();
  n.pos > a && n.acceptToken(BP);
});
function H_(n, e) {
  if (e == W_)
    for (let t = 0; t < 2 && n.next >= 48 && n.next <= 55; t++) n.advance();
  else if (e == E_)
    for (let t = 0; t < 2 && mh(n.next); t++) n.advance();
  else if (e == V_)
    for (let t = 0; t < 4 && mh(n.next); t++) n.advance();
  else if (e == Y_)
    for (let t = 0; t < 8 && mh(n.next); t++) n.advance();
  else if (e == j_ && n.next == Zc) {
    for (n.advance(); n.next >= 0 && n.next != XO && n.next != Tm && n.next != $m && n.next != zr; ) n.advance();
    n.next == XO && n.advance();
  }
}
const J_ = kl({
  'async "*" "**" FormatConversion FormatSpec': _.modifier,
  "for while if elif else try except finally return raise break continue with pass assert await yield match case": _.controlKeyword,
  "in not and or is del": _.operatorKeyword,
  "from def class global nonlocal lambda": _.definitionKeyword,
  import: _.moduleKeyword,
  "with as print": _.keyword,
  Boolean: _.bool,
  None: _.null,
  VariableName: _.variableName,
  "CallExpression/VariableName": _.function(_.variableName),
  "FunctionDefinition/VariableName": _.function(_.definition(_.variableName)),
  "ClassDefinition/VariableName": _.definition(_.className),
  PropertyName: _.propertyName,
  "CallExpression/MemberExpression/PropertyName": _.function(_.propertyName),
  Comment: _.lineComment,
  Number: _.number,
  String: _.string,
  FormatString: _.special(_.string),
  Escape: _.escape,
  UpdateOp: _.updateOperator,
  "ArithOp!": _.arithmeticOperator,
  BitOp: _.bitwiseOperator,
  CompareOp: _.compareOperator,
  AssignOp: _.definitionOperator,
  Ellipsis: _.punctuation,
  At: _.meta,
  "( )": _.paren,
  "[ ]": _.squareBracket,
  "{ }": _.brace,
  ".": _.derefOperator,
  ", ;": _.separator
}), K_ = { __proto__: null, await: 44, or: 54, and: 56, in: 60, not: 62, is: 64, if: 70, else: 72, lambda: 76, yield: 94, from: 96, async: 102, for: 104, None: 162, True: 164, False: 164, del: 178, pass: 182, break: 186, continue: 190, return: 194, raise: 202, import: 206, as: 208, global: 212, nonlocal: 214, assert: 218, type: 223, elif: 236, while: 240, try: 246, except: 248, finally: 250, with: 254, def: 258, class: 268, match: 279, case: 285 }, eT = Po.deserialize({
  version: 14,
  states: "##jQ`QeOOP$}OSOOO&WQtO'#HUOOQS'#Co'#CoOOQS'#Cp'#CpO'vQdO'#CnO*UQtO'#HTOOQS'#HU'#HUOOQS'#DU'#DUOOQS'#HT'#HTO*rQdO'#D_O+VQdO'#DfO+gQdO'#DjO+zOWO'#DuO,VOWO'#DvO.[QtO'#GuOOQS'#Gu'#GuO'vQdO'#GtO0ZQtO'#GtOOQS'#Eb'#EbO0rQdO'#EcOOQS'#Gs'#GsO0|QdO'#GrOOQV'#Gr'#GrO1XQdO'#FYOOQS'#G^'#G^O1^QdO'#FXOOQV'#IS'#ISOOQV'#Gq'#GqOOQV'#Fq'#FqQ`QeOOO'vQdO'#CqO1lQdO'#C}O1sQdO'#DRO2RQdO'#HYO2cQtO'#EVO'vQdO'#EWOOQS'#EY'#EYOOQS'#E['#E[OOQS'#E^'#E^O2wQdO'#E`O3_QdO'#EdO3rQdO'#EfO3zQtO'#EfO1XQdO'#EiO0rQdO'#ElO1XQdO'#EnO0rQdO'#EtO0rQdO'#EwO4VQdO'#EyO4^QdO'#FOO4iQdO'#EzO0rQdO'#FOO1XQdO'#FQO1XQdO'#FVO4nQdO'#F[P4uOdO'#GpPOOO)CBd)CBdOOQS'#Ce'#CeOOQS'#Cf'#CfOOQS'#Cg'#CgOOQS'#Ch'#ChOOQS'#Ci'#CiOOQS'#Cj'#CjOOQS'#Cl'#ClO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO5TQdO'#DoOOQS,5:Y,5:YO5hQdO'#HdOOQS,5:],5:]O5uQ!fO,5:]O5zQtO,59YO1lQdO,59bO1lQdO,59bO1lQdO,59bO8jQdO,59bO8oQdO,59bO8vQdO,59jO8}QdO'#HTO:TQdO'#HSOOQS'#HS'#HSOOQS'#D['#D[O:lQdO,59aO'vQdO,59aO:zQdO,59aOOQS,59y,59yO;PQdO,5:RO'vQdO,5:ROOQS,5:Q,5:QO;_QdO,5:QO;dQdO,5:XO'vQdO,5:XO'vQdO,5:VOOQS,5:U,5:UO;uQdO,5:UO;zQdO,5:WOOOW'#Fy'#FyO<POWO,5:aOOQS,5:a,5:aO<[QdO'#HwOOOW'#Dw'#DwOOOW'#Fz'#FzO<lOWO,5:bOOQS,5:b,5:bOOQS'#F}'#F}O<zQtO,5:iO?lQtO,5=`O@VQ#xO,5=`O@vQtO,5=`OOQS,5:},5:}OA_QeO'#GWOBqQdO,5;^OOQV,5=^,5=^OB|QtO'#IPOCkQdO,5;tOOQS-E:[-E:[OOQV,5;s,5;sO4dQdO'#FQOOQV-E9o-E9oOCsQtO,59]OEzQtO,59iOFeQdO'#HVOFpQdO'#HVO1XQdO'#HVOF{QdO'#DTOGTQdO,59mOGYQdO'#HZO'vQdO'#HZO0rQdO,5=tOOQS,5=t,5=tO0rQdO'#EROOQS'#ES'#ESOGwQdO'#GPOHXQdO,58|OHXQdO,58|O*xQdO,5:oOHgQtO'#H]OOQS,5:r,5:rOOQS,5:z,5:zOHzQdO,5;OOI]QdO'#IOO1XQdO'#H}OOQS,5;Q,5;QOOQS'#GT'#GTOIqQtO,5;QOJPQdO,5;QOJUQdO'#IQOOQS,5;T,5;TOJdQdO'#H|OOQS,5;W,5;WOJuQdO,5;YO4iQdO,5;`O4iQdO,5;cOJ}QtO'#ITO'vQdO'#ITOKXQdO,5;eO4VQdO,5;eO0rQdO,5;jO1XQdO,5;lOK^QeO'#EuOLjQgO,5;fO!!kQdO'#IUO4iQdO,5;jO!!vQdO,5;lO!#OQdO,5;qO!#ZQtO,5;vO'vQdO,5;vPOOO,5=[,5=[P!#bOSO,5=[P!#jOdO,5=[O!&bQtO1G.jO!&iQtO1G.jO!)YQtO1G.jO!)dQtO1G.jO!+}QtO1G.jO!,bQtO1G.jO!,uQdO'#HcO!-TQtO'#GuO0rQdO'#HcO!-_QdO'#HbOOQS,5:Z,5:ZO!-gQdO,5:ZO!-lQdO'#HeO!-wQdO'#HeO!.[QdO,5>OOOQS'#Ds'#DsOOQS1G/w1G/wOOQS1G.|1G.|O!/[QtO1G.|O!/cQtO1G.|O1lQdO1G.|O!0OQdO1G/UOOQS'#DZ'#DZO0rQdO,59tOOQS1G.{1G.{O!0VQdO1G/eO!0gQdO1G/eO!0oQdO1G/fO'vQdO'#H[O!0tQdO'#H[O!0yQtO1G.{O!1ZQdO,59iO!2aQdO,5=zO!2qQdO,5=zO!2yQdO1G/mO!3OQtO1G/mOOQS1G/l1G/lO!3`QdO,5=uO!4VQdO,5=uO0rQdO1G/qO!4tQdO1G/sO!4yQtO1G/sO!5ZQtO1G/qOOQS1G/p1G/pOOQS1G/r1G/rOOOW-E9w-E9wOOQS1G/{1G/{O!5kQdO'#HxO0rQdO'#HxO!5|QdO,5>cOOOW-E9x-E9xOOQS1G/|1G/|OOQS-E9{-E9{O!6[Q#xO1G2zO!6{QtO1G2zO'vQdO,5<jOOQS,5<j,5<jOOQS-E9|-E9|OOQS,5<r,5<rOOQS-E:U-E:UOOQV1G0x1G0xO1XQdO'#GRO!7dQtO,5>kOOQS1G1`1G1`O!8RQdO1G1`OOQS'#DV'#DVO0rQdO,5=qOOQS,5=q,5=qO!8WQdO'#FrO!8cQdO,59oO!8kQdO1G/XO!8uQtO,5=uOOQS1G3`1G3`OOQS,5:m,5:mO!9fQdO'#GtOOQS,5<k,5<kOOQS-E9}-E9}O!9wQdO1G.hOOQS1G0Z1G0ZO!:VQdO,5=wO!:gQdO,5=wO0rQdO1G0jO0rQdO1G0jO!:xQdO,5>jO!;ZQdO,5>jO1XQdO,5>jO!;lQdO,5>iOOQS-E:R-E:RO!;qQdO1G0lO!;|QdO1G0lO!<RQdO,5>lO!<aQdO,5>lO!<oQdO,5>hO!=VQdO,5>hO!=hQdO'#EpO0rQdO1G0tO!=sQdO1G0tO!=xQgO1G0zO!AvQgO1G0}O!EqQdO,5>oO!E{QdO,5>oO!FTQtO,5>oO0rQdO1G1PO!F_QdO1G1PO4iQdO1G1UO!!vQdO1G1WOOQV,5;a,5;aO!FdQfO,5;aO!FiQgO1G1QO!JjQdO'#GZO4iQdO1G1QO4iQdO1G1QO!JzQdO,5>pO!KXQdO,5>pO1XQdO,5>pOOQV1G1U1G1UO!KaQdO'#FSO!KrQ!fO1G1WO!KzQdO1G1WOOQV1G1]1G1]O4iQdO1G1]O!LPQdO1G1]O!LXQdO'#F^OOQV1G1b1G1bO!#ZQtO1G1bPOOO1G2v1G2vP!L^OSO1G2vOOQS,5=},5=}OOQS'#Dp'#DpO0rQdO,5=}O!LfQdO,5=|O!LyQdO,5=|OOQS1G/u1G/uO!MRQdO,5>PO!McQdO,5>PO!MkQdO,5>PO!NOQdO,5>PO!N`QdO,5>POOQS1G3j1G3jOOQS7+$h7+$hO!8kQdO7+$pO#!RQdO1G.|O#!YQdO1G.|OOQS1G/`1G/`OOQS,5<`,5<`O'vQdO,5<`OOQS7+%P7+%PO#!aQdO7+%POOQS-E9r-E9rOOQS7+%Q7+%QO#!qQdO,5=vO'vQdO,5=vOOQS7+$g7+$gO#!vQdO7+%PO##OQdO7+%QO##TQdO1G3fOOQS7+%X7+%XO##eQdO1G3fO##mQdO7+%XOOQS,5<_,5<_O'vQdO,5<_O##rQdO1G3aOOQS-E9q-E9qO#$iQdO7+%]OOQS7+%_7+%_O#$wQdO1G3aO#%fQdO7+%_O#%kQdO1G3gO#%{QdO1G3gO#&TQdO7+%]O#&YQdO,5>dO#&sQdO,5>dO#&sQdO,5>dOOQS'#Dx'#DxO#'UO&jO'#DzO#'aO`O'#HyOOOW1G3}1G3}O#'fQdO1G3}O#'nQdO1G3}O#'yQ#xO7+(fO#(jQtO1G2UP#)TQdO'#GOOOQS,5<m,5<mOOQS-E:P-E:POOQS7+&z7+&zOOQS1G3]1G3]OOQS,5<^,5<^OOQS-E9p-E9pOOQS7+$s7+$sO#)bQdO,5=`O#){QdO,5=`O#*^QtO,5<aO#*qQdO1G3cOOQS-E9s-E9sOOQS7+&U7+&UO#+RQdO7+&UO#+aQdO,5<nO#+uQdO1G4UOOQS-E:Q-E:QO#,WQdO1G4UOOQS1G4T1G4TOOQS7+&W7+&WO#,iQdO7+&WOOQS,5<p,5<pO#,tQdO1G4WOOQS-E:S-E:SOOQS,5<l,5<lO#-SQdO1G4SOOQS-E:O-E:OO1XQdO'#EqO#-jQdO'#EqO#-uQdO'#IRO#-}QdO,5;[OOQS7+&`7+&`O0rQdO7+&`O#.SQgO7+&fO!JmQdO'#GXO4iQdO7+&fO4iQdO7+&iO#2QQtO,5<tO'vQdO,5<tO#2[QdO1G4ZOOQS-E:W-E:WO#2fQdO1G4ZO4iQdO7+&kO0rQdO7+&kOOQV7+&p7+&pO!KrQ!fO7+&rO!KzQdO7+&rO`QeO1G0{OOQV-E:X-E:XO4iQdO7+&lO4iQdO7+&lOOQV,5<u,5<uO#2nQdO,5<uO!JmQdO,5<uOOQV7+&l7+&lO#2yQgO7+&lO#6tQdO,5<vO#7PQdO1G4[OOQS-E:Y-E:YO#7^QdO1G4[O#7fQdO'#IWO#7tQdO'#IWO1XQdO'#IWOOQS'#IW'#IWO#8PQdO'#IVOOQS,5;n,5;nO#8XQdO,5;nO0rQdO'#FUOOQV7+&r7+&rO4iQdO7+&rOOQV7+&w7+&wO4iQdO7+&wO#8^QfO,5;xOOQV7+&|7+&|POOO7+(b7+(bO#8cQdO1G3iOOQS,5<c,5<cO#8qQdO1G3hOOQS-E9u-E9uO#9UQdO,5<dO#9aQdO,5<dO#9tQdO1G3kOOQS-E9v-E9vO#:UQdO1G3kO#:^QdO1G3kO#:nQdO1G3kO#:UQdO1G3kOOQS<<H[<<H[O#:yQtO1G1zOOQS<<Hk<<HkP#;WQdO'#FtO8vQdO1G3bO#;eQdO1G3bO#;jQdO<<HkOOQS<<Hl<<HlO#;zQdO7+)QOOQS<<Hs<<HsO#<[QtO1G1yP#<{QdO'#FsO#=YQdO7+)RO#=jQdO7+)RO#=rQdO<<HwO#=wQdO7+({OOQS<<Hy<<HyO#>nQdO,5<bO'vQdO,5<bOOQS-E9t-E9tOOQS<<Hw<<HwOOQS,5<g,5<gO0rQdO,5<gO#>sQdO1G4OOOQS-E9y-E9yO#?^QdO1G4OO<[QdO'#H{OOOO'#D{'#D{OOOO'#F|'#F|O#?oO&jO,5:fOOOW,5>e,5>eOOOW7+)i7+)iO#?zQdO7+)iO#@SQdO1G2zO#@mQdO1G2zP'vQdO'#FuO0rQdO<<IpO1XQdO1G2YP1XQdO'#GSO#AOQdO7+)pO#AaQdO7+)pOOQS<<Ir<<IrP1XQdO'#GUP0rQdO'#GQOOQS,5;],5;]O#ArQdO,5>mO#BQQdO,5>mOOQS1G0v1G0vOOQS<<Iz<<IzOOQV-E:V-E:VO4iQdO<<JQOOQV,5<s,5<sO4iQdO,5<sOOQV<<JQ<<JQOOQV<<JT<<JTO#BYQtO1G2`P#BdQdO'#GYO#BkQdO7+)uO#BuQgO<<JVO4iQdO<<JVOOQV<<J^<<J^O4iQdO<<J^O!KrQ!fO<<J^O#FpQgO7+&gOOQV<<JW<<JWO#FzQgO<<JWOOQV1G2a1G2aO1XQdO1G2aO#JuQdO1G2aO4iQdO<<JWO1XQdO1G2bP0rQdO'#G[O#KQQdO7+)vO#K_QdO7+)vOOQS'#FT'#FTO0rQdO,5>rO#KgQdO,5>rO#KrQdO,5>rO#K}QdO,5>qO#L`QdO,5>qOOQS1G1Y1G1YOOQS,5;p,5;pOOQV<<Jc<<JcO#LhQdO1G1dOOQS7+)T7+)TP#LmQdO'#FwO#L}QdO1G2OO#MbQdO1G2OO#MrQdO1G2OP#M}QdO'#FxO#N[QdO7+)VO#NlQdO7+)VO#NlQdO7+)VO#NtQdO7+)VO$ UQdO7+(|O8vQdO7+(|OOQSAN>VAN>VO$ oQdO<<LmOOQSAN>cAN>cO0rQdO1G1|O$!PQtO1G1|P$!ZQdO'#FvOOQS1G2R1G2RP$!hQdO'#F{O$!uQdO7+)jO$#`QdO,5>gOOOO-E9z-E9zOOOW<<MT<<MTO$#nQdO7+(fOOQSAN?[AN?[OOQS7+'t7+'tO$$XQdO<<M[OOQS,5<q,5<qO$$jQdO1G4XOOQS-E:T-E:TOOQVAN?lAN?lOOQV1G2_1G2_O4iQdOAN?qO$$xQgOAN?qOOQVAN?xAN?xO4iQdOAN?xOOQV<<JR<<JRO4iQdOAN?rO4iQdO7+'{OOQV7+'{7+'{O1XQdO7+'{OOQVAN?rAN?rOOQS7+'|7+'|O$(sQdO<<MbOOQS1G4^1G4^O0rQdO1G4^OOQS,5<w,5<wO$)QQdO1G4]OOQS-E:Z-E:ZOOQU'#G_'#G_O$)cQfO7+'OO$)nQdO'#F_O$*uQdO7+'jO$+VQdO7+'jOOQS7+'j7+'jO$+bQdO<<LqO$+rQdO<<LqO$+rQdO<<LqO$+zQdO'#H^OOQS<<Lh<<LhO$,UQdO<<LhOOQS7+'h7+'hOOQS'#D|'#D|OOOO1G4R1G4RO$,oQdO1G4RO$,wQdO1G4RP!=hQdO'#GVOOQVG25]G25]O4iQdOG25]OOQVG25dG25dOOQVG25^G25^OOQV<<Kg<<KgO4iQdO<<KgOOQS7+)x7+)xP$-SQdO'#G]OOQU-E:]-E:]OOQV<<Jj<<JjO$-vQtO'#FaOOQS'#Fc'#FcO$.WQdO'#FbO$.xQdO'#FbOOQS'#Fb'#FbO$.}QdO'#IYO$)nQdO'#FiO$)nQdO'#FiO$/fQdO'#FjO$)nQdO'#FkO$/mQdO'#IZOOQS'#IZ'#IZO$0[QdO,5;yOOQS<<KU<<KUO$0dQdO<<KUO$0tQdOANB]O$1UQdOANB]O$1^QdO'#H_OOQS'#H_'#H_O1sQdO'#DcO$1wQdO,5=xOOQSANBSANBSOOOO7+)m7+)mO$2`QdO7+)mOOQVLD*wLD*wOOQVANARANARO5uQ!fO'#GaO$2hQtO,5<SO$)nQdO'#FmOOQS,5<W,5<WOOQS'#Fd'#FdO$3YQdO,5;|O$3_QdO,5;|OOQS'#Fg'#FgO$)nQdO'#G`O$4PQdO,5<QO$4kQdO,5>tO$4{QdO,5>tO1XQdO,5<PO$5^QdO,5<TO$5cQdO,5<TO$)nQdO'#I[O$5hQdO'#I[O$5mQdO,5<UOOQS,5<V,5<VO0rQdO'#FpOOQU1G1e1G1eO4iQdO1G1eOOQSAN@pAN@pO$5rQdOG27wO$6SQdO,59}OOQS1G3d1G3dOOOO<<MX<<MXOOQS,5<{,5<{OOQS-E:_-E:_O$6XQtO'#FaO$6`QdO'#I]O$6nQdO'#I]O$6vQdO,5<XOOQS1G1h1G1hO$6{QdO1G1hO$7QQdO,5<zOOQS-E:^-E:^O$7lQdO,5=OO$8TQdO1G4`OOQS-E:b-E:bOOQS1G1k1G1kOOQS1G1o1G1oO$8eQdO,5>vO$)nQdO,5>vOOQS1G1p1G1pOOQS,5<[,5<[OOQU7+'P7+'PO$+zQdO1G/iO$)nQdO,5<YO$8sQdO,5>wO$8zQdO,5>wOOQS1G1s1G1sOOQS7+'S7+'SP$)nQdO'#GdO$9SQdO1G4bO$9^QdO1G4bO$9fQdO1G4bOOQS7+%T7+%TO$9tQdO1G1tO$:SQtO'#FaO$:ZQdO,5<}OOQS,5<},5<}O$:iQdO1G4cOOQS-E:a-E:aO$)nQdO,5<|O$:pQdO,5<|O$:uQdO7+)|OOQS-E:`-E:`O$;PQdO7+)|O$)nQdO,5<ZP$)nQdO'#GcO$;XQdO1G2hO$)nQdO1G2hP$;gQdO'#GbO$;nQdO<<MhO$;xQdO1G1uO$<WQdO7+(SO8vQdO'#C}O8vQdO,59bO8vQdO,59bO8vQdO,59bO$<fQtO,5=`O8vQdO1G.|O0rQdO1G/XO0rQdO7+$pP$<yQdO'#GOO'vQdO'#GtO$=WQdO,59bO$=]QdO,59bO$=dQdO,59mO$=iQdO1G/UO1sQdO'#DRO8vQdO,59j",
  stateData: "$>S~O%cOS%^OSSOS%]PQ~OPdOVaOfoOhYOopOs!POvqO!PrO!Q{O!T!SO!U!RO!XZO!][O!h`O!r`O!s`O!t`O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#l!QO#o!TO#s!UO#u!VO#z!WO#}hO$P!XO%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~O%]!YO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%j![O%k!]O%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aO~Ok%xXl%xXm%xXn%xXo%xXp%xXs%xXz%xX{%xX!x%xX#g%xX%[%xX%_%xX%z%xXg%xX!T%xX!U%xX%{%xX!W%xX![%xX!Q%xX#[%xXt%xX!m%xX~P%SOfoOhYO!XZO!][O!h`O!r`O!s`O!t`O%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~Oz%wX{%wX#g%wX%[%wX%_%wX%z%wX~Ok!pOl!qOm!oOn!oOo!rOp!sOs!tO!x%wX~P)pOV!zOg!|Oo0cOv0qO!PrO~P'vOV#OOo0cOv0qO!W#PO~P'vOV#SOa#TOo0cOv0qO![#UO~P'vOQ#XO%`#XO%a#ZO~OQ#^OR#[O%`#^O%a#`O~OV%iX_%iXa%iXh%iXk%iXl%iXm%iXn%iXo%iXp%iXs%iXz%iX!X%iX!f%iX%j%iX%k%iX%l%iX%m%iX%n%iX%o%iX%p%iX%q%iX%r%iX%s%iXg%iX!T%iX!U%iX~O&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O{%iX!x%iX#g%iX%[%iX%_%iX%z%iX%{%iX!W%iX![%iX!Q%iX#[%iXt%iX!m%iX~P,eOz#dO{%hX!x%hX#g%hX%[%hX%_%hX%z%hX~Oo0cOv0qO~P'vO#g#gO%[#iO%_#iO~O%uWO~O!T#nO#u!VO#z!WO#}hO~OopO~P'vOV#sOa#tO%uWO{wP~OV#xOo0cOv0qO!Q#yO~P'vO{#{O!x$QO%z#|O#g!yX%[!yX%_!yX~OV#xOo0cOv0qO#g#SX%[#SX%_#SX~P'vOo0cOv0qO#g#WX%[#WX%_#WX~P'vOh$WO%uWO~O!f$YO!r$YO%uWO~OV$eO~P'vO!U$gO#s$hO#u$iO~O{$jO~OV$qO~P'vOS$sO%[$rO%_$rO%c$tO~OV$}Oa$}Og%POo0cOv0qO~P'vOo0cOv0qO{%SO~P'vO&Y%UO~Oa!bOh!iO!X!kO!f!mOVba_bakbalbambanbaobapbasbazba{ba!xba#gba%[ba%_ba%jba%kba%lba%mba%nba%oba%pba%qba%rba%sba%zbagba!Tba!Uba%{ba!Wba![ba!Qba#[batba!mba~On%ZO~Oo%ZO~P'vOo0cO~P'vOk0eOl0fOm0dOn0dOo0mOp0nOs0rOg%wX!T%wX!U%wX%{%wX!W%wX![%wX!Q%wX#[%wX!m%wX~P)pO%{%]Og%vXz%vX!T%vX!U%vX!W%vX{%vX~Og%_Oz%`O!T%dO!U%cO~Og%_O~Oz%gO!T%dO!U%cO!W&SX~O!W%kO~Oz%lO{%nO!T%dO!U%cO![%}X~O![%rO~O![%sO~OQ#XO%`#XO%a%uO~OV%wOo0cOv0qO!PrO~P'vOQ#^OR#[O%`#^O%a%zO~OV!qa_!qaa!qah!qak!qal!qam!qan!qao!qap!qas!qaz!qa{!qa!X!qa!f!qa!x!qa#g!qa%[!qa%_!qa%j!qa%k!qa%l!qa%m!qa%n!qa%o!qa%p!qa%q!qa%r!qa%s!qa%z!qag!qa!T!qa!U!qa%{!qa!W!qa![!qa!Q!qa#[!qat!qa!m!qa~P#yOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P%SOV&OOopOvqO{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P'vOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#g$zX%[$zX%_$zX~P'vO#g#gO%[&TO%_&TO~O!f&UOh&sX%[&sXz&sX#[&sX#g&sX%_&sX#Z&sXg&sX~Oh!iO%[&WO~Okealeameaneaoeapeaseazea{ea!xea#gea%[ea%_ea%zeagea!Tea!Uea%{ea!Wea![ea!Qea#[eatea!mea~P%SOsqazqa{qa#gqa%[qa%_qa%zqa~Ok!pOl!qOm!oOn!oOo!rOp!sO!xqa~PEcO%z&YOz%yX{%yX~O%uWOz%yX{%yX~Oz&]O{wX~O{&_O~Oz%lO#g%}X%[%}X%_%}Xg%}X{%}X![%}X!m%}X%z%}X~OV0lOo0cOv0qO!PrO~P'vO%z#|O#gUa%[Ua%_Ua~Oz&hO#g&PX%[&PX%_&PXn&PX~P%SOz&kO!Q&jO#g#Wa%[#Wa%_#Wa~Oz&lO#[&nO#g&rX%[&rX%_&rXg&rX~O!f$YO!r$YO#Z&qO%uWO~O#Z&qO~Oz&sO#g&tX%[&tX%_&tX~Oz&uO#g&pX%[&pX%_&pX{&pX~O!X&wO%z&xO~Oz&|On&wX~P%SOn'PO~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO%['UO~P'vOt'YO#p'WO#q'XOP#naV#naf#nah#nao#nas#nav#na!P#na!Q#na!T#na!U#na!X#na!]#na!h#na!r#na!s#na!t#na!{#na!}#na#P#na#R#na#T#na#X#na#Z#na#^#na#_#na#a#na#c#na#l#na#o#na#s#na#u#na#z#na#}#na$P#na%X#na%o#na%p#na%t#na%u#na&Z#na&[#na&]#na&^#na&_#na&`#na&a#na&b#na&c#na&d#na&e#na&f#na&g#na&h#na&i#na&j#na%Z#na%_#na~Oz'ZO#[']O{&xX~Oh'_O!X&wO~Oh!iO{$jO!X&wO~O{'eO~P%SO%['hO%_'hO~OS'iO%['hO%_'hO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%k!]O~P!#uO%kWi~P!#uOV!aO_!aOa!bOh!iO!X!kO!f!mO%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%m!_O%n!_O~P!&pO%mWi%nWi~P!&pOa!bOh!iO!X!kO!f!mOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%mWi%nWi%oWi%pWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~OV!aO_!aO%q!aO%r!aO%s!aO~P!)nOVWi_Wi%qWi%rWi%sWi~P!)nO!T%dO!U%cOg&VXz&VX~O%z'kO%{'kO~P,eOz'mOg&UX~Og'oO~Oz'pO{'rO!W&XX~Oo0cOv0qOz'pO{'sO!W&XX~P'vO!W'uO~Om!oOn!oOo!rOp!sOkjisjizji{ji!xji#gji%[ji%_ji%zji~Ol!qO~P!.aOlji~P!.aOk0eOl0fOm0dOn0dOo0mOp0nO~Ot'wO~P!/jOV'|Og'}Oo0cOv0qO~P'vOg'}Oz(OO~Og(QO~O!U(SO~Og(TOz(OO!T%dO!U%cO~P%SOk0eOl0fOm0dOn0dOo0mOp0nOgqa!Tqa!Uqa%{qa!Wqa![qa!Qqa#[qatqa!mqa~PEcOV'|Oo0cOv0qO!W&Sa~P'vOz(WO!W&Sa~O!W(XO~Oz(WO!T%dO!U%cO!W&Sa~P%SOV(]Oo0cOv0qO![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~P'vOz(^O![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~O![(aO~Oz(^O!T%dO!U%cO![%}a~P%SOz(dO!T%dO!U%cO![&Ta~P%SOz(gO{&lX![&lX!m&lX%z&lX~O{(kO![(mO!m(nO%z(jO~OV&OOopOvqO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~P'vOz(pO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~O!f&UOh&sa%[&saz&sa#[&sa#g&sa%_&sa#Z&sag&sa~O%[(uO~OV#sOa#tO%uWO~Oz&]O{wa~OopOvqO~P'vOz(^O#g%}a%[%}a%_%}ag%}a{%}a![%}a!m%}a%z%}a~P%SOz(zO#g%hX%[%hX%_%hX%z%hX~O%z#|O#gUi%[Ui%_Ui~O#g&Pa%[&Pa%_&Pan&Pa~P'vOz(}O#g&Pa%[&Pa%_&Pan&Pa~O%uWO#g&ra%[&ra%_&rag&ra~Oz)SO#g&ra%[&ra%_&rag&ra~Og)VO~OV)WOh$WO%uWO~O#Z)XO~O%uWO#g&ta%[&ta%_&ta~Oz)ZO#g&ta%[&ta%_&ta~Oo0cOv0qO#g&pa%[&pa%_&pa{&pa~P'vOz)^O#g&pa%[&pa%_&pa{&pa~OV)`Oa)`O%uWO~O%z)eO~Ot)hO#j)gOP#hiV#hif#hih#hio#his#hiv#hi!P#hi!Q#hi!T#hi!U#hi!X#hi!]#hi!h#hi!r#hi!s#hi!t#hi!{#hi!}#hi#P#hi#R#hi#T#hi#X#hi#Z#hi#^#hi#_#hi#a#hi#c#hi#l#hi#o#hi#s#hi#u#hi#z#hi#}#hi$P#hi%X#hi%o#hi%p#hi%t#hi%u#hi&Z#hi&[#hi&]#hi&^#hi&_#hi&`#hi&a#hi&b#hi&c#hi&d#hi&e#hi&f#hi&g#hi&h#hi&i#hi&j#hi%Z#hi%_#hi~Ot)iOP#kiV#kif#kih#kio#kis#kiv#ki!P#ki!Q#ki!T#ki!U#ki!X#ki!]#ki!h#ki!r#ki!s#ki!t#ki!{#ki!}#ki#P#ki#R#ki#T#ki#X#ki#Z#ki#^#ki#_#ki#a#ki#c#ki#l#ki#o#ki#s#ki#u#ki#z#ki#}#ki$P#ki%X#ki%o#ki%p#ki%t#ki%u#ki&Z#ki&[#ki&]#ki&^#ki&_#ki&`#ki&a#ki&b#ki&c#ki&d#ki&e#ki&f#ki&g#ki&h#ki&i#ki&j#ki%Z#ki%_#ki~OV)kOn&wa~P'vOz)lOn&wa~Oz)lOn&wa~P%SOn)pO~O%Y)tO~Ot)wO#p'WO#q)vOP#niV#nif#nih#nio#nis#niv#ni!P#ni!Q#ni!T#ni!U#ni!X#ni!]#ni!h#ni!r#ni!s#ni!t#ni!{#ni!}#ni#P#ni#R#ni#T#ni#X#ni#Z#ni#^#ni#_#ni#a#ni#c#ni#l#ni#o#ni#s#ni#u#ni#z#ni#}#ni$P#ni%X#ni%o#ni%p#ni%t#ni%u#ni&Z#ni&[#ni&]#ni&^#ni&_#ni&`#ni&a#ni&b#ni&c#ni&d#ni&e#ni&f#ni&g#ni&h#ni&i#ni&j#ni%Z#ni%_#ni~OV)zOo0cOv0qO{$jO~P'vOo0cOv0qO{&xa~P'vOz*OO{&xa~OV*SOa*TOg*WO%q*UO%uWO~O{$jO&{*YO~Oh'_O~Oh!iO{$jO~O%[*_O~O%[*aO%_*aO~OV$}Oa$}Oo0cOv0qOg&Ua~P'vOz*dOg&Ua~Oo0cOv0qO{*gO!W&Xa~P'vOz*hO!W&Xa~Oo0cOv0qOz*hO{*kO!W&Xa~P'vOo0cOv0qOz*hO!W&Xa~P'vOz*hO{*kO!W&Xa~Om0dOn0dOo0mOp0nOgjikjisjizji!Tji!Uji%{ji!Wji{ji![ji#gji%[ji%_ji!Qji#[jitji!mji%zji~Ol0fO~P!NkOlji~P!NkOV'|Og*pOo0cOv0qO~P'vOn*rO~Og*pOz*tO~Og*uO~OV'|Oo0cOv0qO!W&Si~P'vOz*vO!W&Si~O!W*wO~OV(]Oo0cOv0qO![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~P'vOz*zO!T%dO!U%cO![&Ti~Oz*}O![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~O![+OO~Oa+QOo0cOv0qO![&Ti~P'vOz*zO![&Ti~O![+SO~OV+UOo0cOv0qO{&la![&la!m&la%z&la~P'vOz+VO{&la![&la!m&la%z&la~O!]+YO&n+[O![!nX~O![+^O~O{(kO![+_O~O{(kO![+_O!m+`O~OV&OOopOvqO{%hq!x%hq#g%hq%[%hq%_%hq%z%hq~P'vOz$ri{$ri!x$ri#g$ri%[$ri%_$ri%z$ri~P%SOV&OOopOvqO~P'vOV&OOo0cOv0qO#g%ha%[%ha%_%ha%z%ha~P'vOz+aO#g%ha%[%ha%_%ha%z%ha~Oz$ia#g$ia%[$ia%_$ian$ia~P%SO#g&Pi%[&Pi%_&Pin&Pi~P'vOz+dO#g#Wq%[#Wq%_#Wq~O#[+eOz$va#g$va%[$va%_$vag$va~O%uWO#g&ri%[&ri%_&rig&ri~Oz+gO#g&ri%[&ri%_&rig&ri~OV+iOh$WO%uWO~O%uWO#g&ti%[&ti%_&ti~Oo0cOv0qO#g&pi%[&pi%_&pi{&pi~P'vO{#{Oz#eX!W#eX~Oz+mO!W&uX~O!W+oO~Ot+rO#j)gOP#hqV#hqf#hqh#hqo#hqs#hqv#hq!P#hq!Q#hq!T#hq!U#hq!X#hq!]#hq!h#hq!r#hq!s#hq!t#hq!{#hq!}#hq#P#hq#R#hq#T#hq#X#hq#Z#hq#^#hq#_#hq#a#hq#c#hq#l#hq#o#hq#s#hq#u#hq#z#hq#}#hq$P#hq%X#hq%o#hq%p#hq%t#hq%u#hq&Z#hq&[#hq&]#hq&^#hq&_#hq&`#hq&a#hq&b#hq&c#hq&d#hq&e#hq&f#hq&g#hq&h#hq&i#hq&j#hq%Z#hq%_#hq~On$|az$|a~P%SOV)kOn&wi~P'vOz+yOn&wi~Oz,TO{$jO#[,TO~O#q,VOP#nqV#nqf#nqh#nqo#nqs#nqv#nq!P#nq!Q#nq!T#nq!U#nq!X#nq!]#nq!h#nq!r#nq!s#nq!t#nq!{#nq!}#nq#P#nq#R#nq#T#nq#X#nq#Z#nq#^#nq#_#nq#a#nq#c#nq#l#nq#o#nq#s#nq#u#nq#z#nq#}#nq$P#nq%X#nq%o#nq%p#nq%t#nq%u#nq&Z#nq&[#nq&]#nq&^#nq&_#nq&`#nq&a#nq&b#nq&c#nq&d#nq&e#nq&f#nq&g#nq&h#nq&i#nq&j#nq%Z#nq%_#nq~O#[,WOz%Oa{%Oa~Oo0cOv0qO{&xi~P'vOz,YO{&xi~O{#{O%z,[Og&zXz&zX~O%uWOg&zXz&zX~Oz,`Og&yX~Og,bO~O%Y,eO~O!T%dO!U%cOg&Viz&Vi~OV$}Oa$}Oo0cOv0qOg&Ui~P'vO{,hOz$la!W$la~Oo0cOv0qO{,iOz$la!W$la~P'vOo0cOv0qO{*gO!W&Xi~P'vOz,lO!W&Xi~Oo0cOv0qOz,lO!W&Xi~P'vOz,lO{,oO!W&Xi~Og$hiz$hi!W$hi~P%SOV'|Oo0cOv0qO~P'vOn,qO~OV'|Og,rOo0cOv0qO~P'vOV'|Oo0cOv0qO!W&Sq~P'vOz$gi![$gi#g$gi%[$gi%_$gig$gi{$gi!m$gi%z$gi~P%SOV(]Oo0cOv0qO~P'vOa+QOo0cOv0qO![&Tq~P'vOz,sO![&Tq~O![,tO~OV(]Oo0cOv0qO![%}q#g%}q%[%}q%_%}qg%}q{%}q!m%}q%z%}q~P'vO{,uO~OV+UOo0cOv0qO{&li![&li!m&li%z&li~P'vOz,zO{&li![&li!m&li%z&li~O!]+YO&n+[O![!na~O{(kO![,}O~OV&OOo0cOv0qO#g%hi%[%hi%_%hi%z%hi~P'vOz-OO#g%hi%[%hi%_%hi%z%hi~O%uWO#g&rq%[&rq%_&rqg&rq~Oz-RO#g&rq%[&rq%_&rqg&rq~OV)`Oa)`O%uWO!W&ua~Oz-TO!W&ua~On$|iz$|i~P%SOV)kO~P'vOV)kOn&wq~P'vOt-XOP#myV#myf#myh#myo#mys#myv#my!P#my!Q#my!T#my!U#my!X#my!]#my!h#my!r#my!s#my!t#my!{#my!}#my#P#my#R#my#T#my#X#my#Z#my#^#my#_#my#a#my#c#my#l#my#o#my#s#my#u#my#z#my#}#my$P#my%X#my%o#my%p#my%t#my%u#my&Z#my&[#my&]#my&^#my&_#my&`#my&a#my&b#my&c#my&d#my&e#my&f#my&g#my&h#my&i#my&j#my%Z#my%_#my~O%Z-]O%_-]O~P`O#q-^OP#nyV#nyf#nyh#nyo#nys#nyv#ny!P#ny!Q#ny!T#ny!U#ny!X#ny!]#ny!h#ny!r#ny!s#ny!t#ny!{#ny!}#ny#P#ny#R#ny#T#ny#X#ny#Z#ny#^#ny#_#ny#a#ny#c#ny#l#ny#o#ny#s#ny#u#ny#z#ny#}#ny$P#ny%X#ny%o#ny%p#ny%t#ny%u#ny&Z#ny&[#ny&]#ny&^#ny&_#ny&`#ny&a#ny&b#ny&c#ny&d#ny&e#ny&f#ny&g#ny&h#ny&i#ny&j#ny%Z#ny%_#ny~Oz-aO{$jO#[-aO~Oo0cOv0qO{&xq~P'vOz-dO{&xq~O%z,[Og&zaz&za~O{#{Og&zaz&za~OV*SOa*TO%q*UO%uWOg&ya~Oz-hOg&ya~O$S-lO~OV$}Oa$}Oo0cOv0qO~P'vOo0cOv0qO{-mOz$li!W$li~P'vOo0cOv0qOz$li!W$li~P'vO{-mOz$li!W$li~Oo0cOv0qO{*gO~P'vOo0cOv0qO{*gO!W&Xq~P'vOz-pO!W&Xq~Oo0cOv0qOz-pO!W&Xq~P'vOs-sO!T%dO!U%cOg&Oq!W&Oq![&Oqz&Oq~P!/jOa+QOo0cOv0qO![&Ty~P'vOz$ji![$ji~P%SOa+QOo0cOv0qO~P'vOV+UOo0cOv0qO~P'vOV+UOo0cOv0qO{&lq![&lq!m&lq%z&lq~P'vO{(kO![-xO!m-yO%z-wO~OV&OOo0cOv0qO#g%hq%[%hq%_%hq%z%hq~P'vO%uWO#g&ry%[&ry%_&ryg&ry~OV)`Oa)`O%uWO!W&ui~Ot-}OP#m!RV#m!Rf#m!Rh#m!Ro#m!Rs#m!Rv#m!R!P#m!R!Q#m!R!T#m!R!U#m!R!X#m!R!]#m!R!h#m!R!r#m!R!s#m!R!t#m!R!{#m!R!}#m!R#P#m!R#R#m!R#T#m!R#X#m!R#Z#m!R#^#m!R#_#m!R#a#m!R#c#m!R#l#m!R#o#m!R#s#m!R#u#m!R#z#m!R#}#m!R$P#m!R%X#m!R%o#m!R%p#m!R%t#m!R%u#m!R&Z#m!R&[#m!R&]#m!R&^#m!R&_#m!R&`#m!R&a#m!R&b#m!R&c#m!R&d#m!R&e#m!R&f#m!R&g#m!R&h#m!R&i#m!R&j#m!R%Z#m!R%_#m!R~Oo0cOv0qO{&xy~P'vOV*SOa*TO%q*UO%uWOg&yi~O$S-lO%Z.VO%_.VO~OV.aOh._O!X.^O!].`O!h.YO!s.[O!t.[O%p.XO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O~Oo0cOv0qOz$lq!W$lq~P'vO{.fOz$lq!W$lq~Oo0cOv0qO{*gO!W&Xy~P'vOz.gO!W&Xy~Oo0cOv.kO~P'vOs-sO!T%dO!U%cOg&Oy!W&Oy![&Oyz&Oy~P!/jO{(kO![.nO~O{(kO![.nO!m.oO~OV*SOa*TO%q*UO%uWO~Oh.tO!f.rOz$TX#[$TX%j$TXg$TX~Os$TX{$TX!W$TX![$TX~P$-bO%o.vO%p.vOs$UXz$UX{$UX#[$UX%j$UX!W$UXg$UX![$UX~O!h.xO~Oz.|O#[/OO%j.yOs&|X{&|X!W&|Xg&|X~Oa/RO~P$)zOh.tOs&}Xz&}X{&}X#[&}X%j&}X!W&}Xg&}X![&}X~Os/VO{$jO~Oo0cOv0qOz$ly!W$ly~P'vOo0cOv0qO{*gO!W&X!R~P'vOz/ZO!W&X!R~Og&RXs&RX!T&RX!U&RX!W&RX![&RXz&RX~P!/jOs-sO!T%dO!U%cOg&Qa!W&Qa![&Qaz&Qa~O{(kO![/^O~O!f.rOh$[as$[az$[a{$[a#[$[a%j$[a!W$[ag$[a![$[a~O!h/eO~O%o.vO%p.vOs$Uaz$Ua{$Ua#[$Ua%j$Ua!W$Uag$Ua![$Ua~O%j.yOs$Yaz$Ya{$Ya#[$Ya!W$Yag$Ya![$Ya~Os&|a{&|a!W&|ag&|a~P$)nOz/jOs&|a{&|a!W&|ag&|a~O!W/mO~Og/mO~O{/oO~O![/pO~Oo0cOv0qO{*gO!W&X!Z~P'vO{/sO~O%z/tO~P$-bOz/uO#[/OO%j.yOg'PX~Oz/uOg'PX~Og/wO~O!h/xO~O#[/OOs%Saz%Sa{%Sa%j%Sa!W%Sag%Sa![%Sa~O#[/OO%j.yOs%Waz%Wa{%Wa!W%Wag%Wa~Os&|i{&|i!W&|ig&|i~P$)nOz/zO#[/OO%j.yO!['Oa~Og'Pa~P$)nOz0SOg'Pa~Oa0UO!['Oi~P$)zOz0WO!['Oi~Oz0WO#[/OO%j.yO!['Oi~O#[/OO%j.yOg$biz$bi~O%z0ZO~P$-bO#[/OO%j.yOg%Vaz%Va~Og'Pi~P$)nO{0^O~Oa0UO!['Oq~P$)zOz0`O!['Oq~O#[/OO%j.yOz%Ui![%Ui~Oa0UO~P$)zOa0UO!['Oy~P$)zO#[/OO%j.yOg$ciz$ci~O#[/OO%j.yOz%Uq![%Uq~Oz+aO#g%ha%[%ha%_%ha%z%ha~P%SOV&OOo0cOv0qO~P'vOn0hO~Oo0hO~P'vO{0iO~Ot0jO~P!/jO&]&Z&j&h&i&g&f&d&e&c&b&`&a&_&^&[%u~",
  goto: "!=j'QPPPPPP'RP'Z*s+[+t,_,y-fP.SP'Z.r.r'ZPPP'Z2[PPPPPP2[5PPP5PP7b7k=sPP=v>h>kPP'Z'ZPP>zPP'Z'ZPP'Z'Z'Z'Z'Z?O?w'ZP?zP@QDXGuGyPG|HWH['ZPPPH_Hk'RP'R'RP'RP'RP'RP'RP'R'R'RP'RPP'RPP'RP'RPHqH}IVPI^IdPI^PI^I^PPPI^PKrPK{LVL]KrPI^LfPI^PLmLsPLwM]MzNeLwLwNkNxLwLwLwLw! ^! d! g! l! o! y!!P!!]!!o!!u!#P!#V!#s!#y!$P!$Z!$a!$g!$y!%T!%Z!%a!%k!%q!%w!%}!&T!&Z!&e!&k!&u!&{!'U!'[!'k!'s!'}!(UPPPPPPPPPPP!([!(_!(e!(n!(x!)TPPPPPPPPPPPP!-u!/Z!3^!6oPP!6w!7W!7a!8Y!8P!8c!8i!8l!8o!8r!8z!9jPPPPPPPPPPPPPPPPP!9m!9q!9wP!:]!:a!:m!:v!;S!;j!;m!;p!;v!;|!<S!<VP!<_!<h!=d!=g]eOn#g$j)t,P'}`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r{!cQ#c#p$R$d$p%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g}!dQ#c#p$R$d$p$u%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!P!eQ#c#p$R$d$p$u$v%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!R!fQ#c#p$R$d$p$u$v$w%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!T!gQ#c#p$R$d$p$u$v$w$x%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!V!hQ#c#p$R$d$p$u$v$w$x$y%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!Z!hQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g'}TOTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r&eVOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0r%oXOYZ[dnrxy}!P!Q!U!i!k#[#d#g#y#{#}$Q$h$j$}%S%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#vqQ/[.kR0o0q't`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rh#jhz{$W$Z&l&q)S)X+f+g-RW#rq&].k0qQ$]|Q$a!OQ$n!VQ$o!WW$|!i'm*d,gS&[#s#tQ'S$iQ(s&UQ)U&nU)Y&s)Z+jW)a&w+m-T-{Q*Q']W*R'_,`-h.TQ+l)`S,_*S*TQ-Q+eQ-_,TQ-c,WQ.R-al.W-l.^._.a.z.|/R/j/o/t/y0U0Z0^Q/S.`Q/a.tQ/l/OU0P/u0S0[X0V/z0W0_0`R&Z#r!_!wYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZR%^!vQ!{YQ%x#[Q&d#}Q&g$QR,{+YT.j-s/s!Y!jQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gQ&X#kQ'c$oR*^'dR'l$|Q%V!mR/_.r'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rS#a_#b!P.[-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rT#a_#bT#^^#_R(o%xa(l%x(n(o+`,{-y-z.oT+[(k+]R-z,{Q$PsQ+l)aQ,^*RR-e,_X#}s$O$P&fQ&y$aQ'a$nQ'd$oR)s'SQ)b&wV-S+m-T-{ZgOn$j)t,PXkOn)t,PQ$k!TQ&z$bQ&{$cQ'^$mQ'b$oQ)q'RQ)x'WQ){'XQ)|'YQ*Z'`S*]'c'dQ+s)gQ+u)hQ+v)iQ+z)oS+|)r*[Q,Q)vQ,R)wS,S)y)zQ,d*^Q-V+rQ-W+tQ-Y+{S-Z+},OQ-`,UQ-b,VQ-|-XQ.O-[Q.P-^Q.Q-_Q.p-}Q.q.RQ/W.dR/r/XWkOn)t,PR#mjQ'`$nS)r'S'aR,O)sQ,]*RR-f,^Q*['`Q+})rR-[,OZiOjn)t,PQ'f$pR*`'gT-j,e-ku.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^t.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^Q/S.`X0V/z0W0_0`!P.Z-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`Q.w.YR/f.xg.z.].{/b/i/n/|0O0Q0]0a0bu.b-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^X.u.W.b/a0PR/c.tV0R/u0S0[R/X.dQnOS#on,PR,P)tQ&^#uR(x&^S%m#R#wS(_%m(bT(b%p&`Q%a!yQ%h!}W(P%a%h(U(YQ(U%eR(Y%jQ&i$RR)O&iQ(e%qQ*{(`T+R(e*{Q'n%OR*e'nS'q%R%SY*i'q*j,m-q.hU*j'r's'tU,m*k*l*mS-q,n,oR.h-rQ#Y]R%t#YQ#_^R%y#_Q(h%vS+W(h+XR+X(iQ+](kR,|+]Q#b_R%{#bQ#ebQ%}#cW&Q#e%}({+bQ({&cR+b0gQ$OsS&e$O&fR&f$PQ&v$_R)_&vQ&V#jR(t&VQ&m$VS)T&m+hR+h)UQ$Z{R&p$ZQ&t$]R)[&tQ+n)bR-U+nQ#hfR&S#hQ)f&zR+q)fQ&}$dS)m&})nR)n'OQ'V$kR)u'VQ'[$lS*P'[,ZR,Z*QQ,a*VR-i,aWjOn)t,PR#ljQ-k,eR.U-kd.{.]/b/i/n/|0O0Q0]0a0bR/h.{U.s.W/a0PR/`.sQ/{/nS0X/{0YR0Y/|S/v/b/cR0T/vQ.}.]R/k.}R!ZPXmOn)t,PWlOn)t,PR'T$jYfOn$j)t,PR&R#g[sOn#g$j)t,PR&d#}&dQOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0rQ!nTQ#caQ#poU$Rt%c(SS$d!R$gQ$p!XQ$u!cQ$v!dQ$w!eQ$x!fQ$y!gQ$z!hQ%e!zQ%j#OQ%p#SQ%q#TQ&`#xQ'O$eQ'g$qQ(q&OU(|&h(}+cW)j&|)l+x+yQ*o'|Q*x(]Q+w)kQ,v+QR0g0lQ!yYQ!}ZQ$b!PQ$c!QQ%R!kQ't%S^'{%`%g(O(W*q*t*v^*f'p*h,k,l-p.g/ZQ*l'rQ*m'sQ+t)gQ,j*gQ,n*kQ-n,hQ-o,iQ-r,oQ.e-mR/Y.f[bOn#g$j)t,P!^!vYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZQ#R[Q#fdS#wrxQ$UyW$_}$Q'P)pS$l!U$hW${!i'm*d,gS%v#[+Y`&P#d%|(p(r(z+a-O0kQ&a#yQ&b#{Q&c#}Q'j$}Q'z%^W([%l(^*y*}Q(`%nQ(i%wQ(v&ZS(y&_0iQ)P&jQ)Q&kU)]&u)^+kQ)d&xQ)y'WY)}'Z*O,X,Y-dQ*b'lS*n'w0jW+P(d*z,s,wW+T(g+V,y,zQ+p)eQ,U)zQ,c*YQ,x+UQ-P+dQ-e,]Q-v,uQ.S-fR/q/VhUOn#d#g$j%|&_'w(p(r)t,P%U!uYZ[drxy}!P!Q!U!i!k#[#y#{#}$Q$h$}%S%^%`%g%l%n%w&Z&j&k&u&x'P'W'Z'l'm'p'r's(O(W(^(d(g(z)^)e)g)p)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#qpW%W!o!s0d0nQ%X!pQ%Y!qQ%[!tQ%f0cS'v%Z0hQ'x0eQ'y0fQ,p*rQ-u,qS.i-s/sR0p0rU#uq.k0qR(w&][cOn#g$j)t,PZ!xY#[#}$Q+YQ#W[Q#zrR$TxQ%b!yQ%i!}Q%o#RQ'j${Q(V%eQ(Z%jQ(c%pQ(f%qQ*|(`Q,f*bQ-t,pQ.m-uR/].lQ$StQ(R%cR*s(SQ.l-sR/}/sR#QZR#V[R%Q!iQ%O!iV*c'm*d,g!Z!lQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gR%T!kT#]^#_Q%x#[R,{+YQ(m%xS+_(n(oQ,}+`Q-x,{S.n-y-zR/^.oT+Z(k+]Q$`}Q&g$QQ)o'PR+{)pQ$XzQ)W&qR+i)XQ$XzQ&o$WQ)W&qR+i)XQ#khW$Vz$W&q)XQ$[{Q&r$ZZ)R&l)S+f+g-RR$^|R)c&wXlOn)t,PQ$f!RR'Q$gQ$m!UR'R$hR*X'_Q*V'_V-g,`-h.TQ.d-lQ/P.^R/Q._U.]-l.^._Q/U.aQ/b.tQ/g.zU/i.|/j/yQ/n/RQ/|/oQ0O/tU0Q/u0S0[Q0]0UQ0a0ZR0b0^R/T.`R/d.t",
  nodeNames: "⚠ print Escape { Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ) ( ParenthesizedExpression BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from TupleExpression ComprehensionExpression async for LambdaExpression ] [ ArrayExpression ArrayComprehensionExpression } { DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatSelfDoc FormatConversion FormatSpec FormatReplacement FormatSelfDoc ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert TypeDefinition type TypeParamList TypeParam StatementGroup ; IfStatement Body elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At MatchStatement match MatchBody MatchClause case CapturePattern LiteralPattern ArithOp ArithOp AsPattern OrPattern LogicOp AttributePattern SequencePattern MappingPattern StarPattern ClassPattern PatternArgList KeywordPattern KeywordPattern Guard",
  maxTerm: 277,
  context: N_,
  nodeProps: [
    ["isolate", -5, 4, 71, 72, 73, 77, ""],
    ["group", -15, 6, 85, 87, 88, 90, 92, 94, 96, 98, 99, 100, 102, 105, 108, 110, "Statement Statement", -22, 8, 18, 21, 25, 40, 49, 50, 56, 57, 60, 61, 62, 63, 64, 67, 70, 71, 72, 79, 80, 81, 82, "Expression", -10, 114, 116, 119, 121, 122, 126, 128, 133, 135, 138, "Statement", -9, 143, 144, 147, 148, 150, 151, 152, 153, 154, "Pattern"],
    ["openedBy", 23, "(", 54, "[", 58, "{"],
    ["closedBy", 24, ")", 55, "]", 59, "}"]
  ],
  propSources: [J_],
  skippedNodes: [0, 4],
  repeatNodeCount: 34,
  tokenData: "!2|~R!`OX%TXY%oY[%T[]%o]p%Tpq%oqr'ars)Yst*xtu%Tuv,dvw-hwx.Uxy/tyz0[z{0r{|2S|}2p}!O3W!O!P4_!P!Q:Z!Q!R;k!R![>_![!]Do!]!^Es!^!_FZ!_!`Gk!`!aHX!a!b%T!b!cIf!c!dJU!d!eK^!e!hJU!h!i!#f!i!tJU!t!u!,|!u!wJU!w!x!.t!x!}JU!}#O!0S#O#P&o#P#Q!0j#Q#R!1Q#R#SJU#S#T%T#T#UJU#U#VK^#V#YJU#Y#Z!#f#Z#fJU#f#g!,|#g#iJU#i#j!.t#j#oJU#o#p!1n#p#q!1s#q#r!2a#r#s!2f#s$g%T$g;'SJU;'S;=`KW<%lOJU`%YT&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T`%lP;=`<%l%To%v]&n`%c_OX%TXY%oY[%T[]%o]p%Tpq%oq#O%T#O#P&o#P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To&tX&n`OY%TYZ%oZ]%T]^%o^#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc'f[&n`O!_%T!_!`([!`#T%T#T#U(r#U#f%T#f#g(r#g#h(r#h#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(cTmR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(yT!mR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk)aV&n`&[ZOr%Trs)vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk){V&n`Or%Trs*bs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk*iT&n`&^ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To+PZS_&n`OY*xYZ%TZ]*x]^%T^#o*x#o#p+r#p#q*x#q#r+r#r;'S*x;'S;=`,^<%lO*x_+wTS_OY+rZ]+r^;'S+r;'S;=`,W<%lO+r_,ZP;=`<%l+ro,aP;=`<%l*xj,kV%rQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-XT!xY&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-oV%lQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.]V&n`&ZZOw%Twx.rx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.wV&n`Ow%Twx/^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/eT&n`&]ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/{ThZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc0cTgR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk0yXVZ&n`Oz%Tz{1f{!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk1mVaR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk2ZV%oZ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc2wTzR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To3_W%pZ&n`O!_%T!_!`-Q!`!a3w!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Td4OT&{S&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk4fX!fQ&n`O!O%T!O!P5R!P!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5WV&n`O!O%T!O!P5m!P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5tT!rZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti6[a!hX&n`O!Q%T!Q![6T![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S6T#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti7fZ&n`O{%T{|8X|}%T}!O8X!O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8^V&n`O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8z]!hX&n`O!Q%T!Q![8s![!l%T!l!m9s!m#R%T#R#S8s#S#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti9zT!hX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk:bX%qR&n`O!P%T!P!Q:}!Q!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj;UV%sQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti;ro!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!d%T!d!e?q!e!g%T!g!h7a!h!l%T!l!m9s!m!q%T!q!rA]!r!z%T!z!{Bq!{#R%T#R#S>_#S#U%T#U#V?q#V#X%T#X#Y7a#Y#^%T#^#_9s#_#c%T#c#dA]#d#l%T#l#mBq#m#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti=xV&n`O!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti>fc!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S>_#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti?vY&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti@mY!hX&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiAbX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBUX!hX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBv]&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiCv]!hX&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToDvV{_&n`O!_%T!_!`E]!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TcEdT%{R&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkEzT#gZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkFbXmR&n`O!^%T!^!_F}!_!`([!`!a([!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjGUV%mQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkGrV%zZ&n`O!_%T!_!`([!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkH`WmR&n`O!_%T!_!`([!`!aHx!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjIPV%nQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkIoV_Q#}P&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToJ_]&n`&YS%uZO!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoKZP;=`<%lJUoKge&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!tJU!t!uLx!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#gLx#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoMRa&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUkN_V&n`&`ZOr%TrsNts#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkNyV&n`Or%Trs! `s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! gT&n`&bZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! }V&n`&_ZOw%Twx!!dx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!!iV&n`Ow%Twx!#Ox#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!#VT&n`&aZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!#oe&n`&YS%uZOr%Trs!%Qsw%Twx!&px!Q%T!Q![JU![!c%T!c!tJU!t!u!(`!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#g!(`#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!%XV&n`&dZOr%Trs!%ns#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!%sV&n`Or%Trs!&Ys#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&aT&n`&fZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&wV&n`&cZOw%Twx!'^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!'cV&n`Ow%Twx!'xx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!(PT&n`&eZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!(ia&n`&YS%uZOr%Trs!)nsw%Twx!+^x!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!)uV&n`&hZOr%Trs!*[s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*aV&n`Or%Trs!*vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*}T&n`&jZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!+eV&n`&gZOw%Twx!+zx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,PV&n`Ow%Twx!,fx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,mT&n`&iZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!-Vi&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!dJU!d!eLx!e!hJU!h!i!(`!i!}JU!}#R%T#R#SJU#S#T%T#T#UJU#U#VLx#V#YJU#Y#Z!(`#Z#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUo!.}a&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!0ZT!XZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc!0qT!WR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj!1XV%kQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!1sO!]~k!1zV%jR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!2fO![~i!2mT%tX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T",
  tokenizers: [B_, G_, D_, F_, 0, 1, 2, 3, 4],
  topRules: { Script: [0, 5] },
  specialized: [{ term: 221, get: (n) => K_[n] || -1 }],
  tokenPrec: 7668
}), qO = /* @__PURE__ */ new $g(), Rm = /* @__PURE__ */ new Set([
  "Script",
  "Body",
  "FunctionDefinition",
  "ClassDefinition",
  "LambdaExpression",
  "ForStatement",
  "MatchClause"
]);
function Oa(n) {
  return (e, t, i) => {
    if (i)
      return !1;
    let r = e.node.getChild("VariableName");
    return r && t(r, n), !0;
  };
}
const tT = {
  FunctionDefinition: /* @__PURE__ */ Oa("function"),
  ClassDefinition: /* @__PURE__ */ Oa("class"),
  ForStatement(n, e, t) {
    if (t) {
      for (let i = n.node.firstChild; i; i = i.nextSibling)
        if (i.name == "VariableName")
          e(i, "variable");
        else if (i.name == "in")
          break;
    }
  },
  ImportStatement(n, e) {
    var t, i;
    let { node: r } = n, s = ((t = r.firstChild) === null || t === void 0 ? void 0 : t.name) == "from";
    for (let o = r.getChild("import"); o; o = o.nextSibling)
      o.name == "VariableName" && ((i = o.nextSibling) === null || i === void 0 ? void 0 : i.name) != "as" && e(o, s ? "variable" : "namespace");
  },
  AssignStatement(n, e) {
    for (let t = n.node.firstChild; t; t = t.nextSibling)
      if (t.name == "VariableName")
        e(t, "variable");
      else if (t.name == ":" || t.name == "AssignOp")
        break;
  },
  ParamList(n, e) {
    for (let t = null, i = n.node.firstChild; i; i = i.nextSibling)
      i.name == "VariableName" && (!t || !/\*|AssignOp/.test(t.name)) && e(i, "variable"), t = i;
  },
  CapturePattern: /* @__PURE__ */ Oa("variable"),
  AsPattern: /* @__PURE__ */ Oa("variable"),
  __proto__: null
};
function Xm(n, e) {
  let t = qO.get(e);
  if (t)
    return t;
  let i = [], r = !0;
  function s(o, a) {
    let l = n.sliceString(o.from, o.to);
    i.push({ label: l, type: a });
  }
  return e.cursor(it.IncludeAnonymous).iterate((o) => {
    if (o.name) {
      let a = tT[o.name];
      if (a && a(o, s, r) || !r && Rm.has(o.name))
        return !1;
      r = !1;
    } else if (o.to - o.from > 8192) {
      for (let a of Xm(n, o.node))
        i.push(a);
      return !1;
    }
  }), qO.set(e, i), i;
}
const zO = /^[\w\xa1-\uffff][\w\d\xa1-\uffff]*$/, Cm = ["String", "FormatString", "Comment", "PropertyName"];
function Am(n) {
  let e = pt(n.state).resolveInner(n.pos, -1);
  if (Cm.indexOf(e.name) > -1)
    return null;
  let t = e.name == "VariableName" || e.to - e.from < 20 && zO.test(n.state.sliceDoc(e.from, e.to));
  if (!t && !n.explicit)
    return null;
  let i = [];
  for (let r = e; r; r = r.parent)
    Rm.has(r.name) && (i = i.concat(Xm(n.state.doc, r)));
  return {
    options: i,
    from: t ? e.from : n.pos,
    validFor: zO
  };
}
const iT = /* @__PURE__ */ [
  "__annotations__",
  "__builtins__",
  "__debug__",
  "__doc__",
  "__import__",
  "__name__",
  "__loader__",
  "__package__",
  "__spec__",
  "False",
  "None",
  "True"
].map((n) => ({ label: n, type: "constant" })).concat(/* @__PURE__ */ [
  "ArithmeticError",
  "AssertionError",
  "AttributeError",
  "BaseException",
  "BlockingIOError",
  "BrokenPipeError",
  "BufferError",
  "BytesWarning",
  "ChildProcessError",
  "ConnectionAbortedError",
  "ConnectionError",
  "ConnectionRefusedError",
  "ConnectionResetError",
  "DeprecationWarning",
  "EOFError",
  "Ellipsis",
  "EncodingWarning",
  "EnvironmentError",
  "Exception",
  "FileExistsError",
  "FileNotFoundError",
  "FloatingPointError",
  "FutureWarning",
  "GeneratorExit",
  "IOError",
  "ImportError",
  "ImportWarning",
  "IndentationError",
  "IndexError",
  "InterruptedError",
  "IsADirectoryError",
  "KeyError",
  "KeyboardInterrupt",
  "LookupError",
  "MemoryError",
  "ModuleNotFoundError",
  "NameError",
  "NotADirectoryError",
  "NotImplemented",
  "NotImplementedError",
  "OSError",
  "OverflowError",
  "PendingDeprecationWarning",
  "PermissionError",
  "ProcessLookupError",
  "RecursionError",
  "ReferenceError",
  "ResourceWarning",
  "RuntimeError",
  "RuntimeWarning",
  "StopAsyncIteration",
  "StopIteration",
  "SyntaxError",
  "SyntaxWarning",
  "SystemError",
  "SystemExit",
  "TabError",
  "TimeoutError",
  "TypeError",
  "UnboundLocalError",
  "UnicodeDecodeError",
  "UnicodeEncodeError",
  "UnicodeError",
  "UnicodeTranslateError",
  "UnicodeWarning",
  "UserWarning",
  "ValueError",
  "Warning",
  "ZeroDivisionError"
].map((n) => ({ label: n, type: "type" }))).concat(/* @__PURE__ */ [
  "bool",
  "bytearray",
  "bytes",
  "classmethod",
  "complex",
  "float",
  "frozenset",
  "int",
  "list",
  "map",
  "memoryview",
  "object",
  "range",
  "set",
  "staticmethod",
  "str",
  "super",
  "tuple",
  "type"
].map((n) => ({ label: n, type: "class" }))).concat(/* @__PURE__ */ [
  "abs",
  "aiter",
  "all",
  "anext",
  "any",
  "ascii",
  "bin",
  "breakpoint",
  "callable",
  "chr",
  "compile",
  "delattr",
  "dict",
  "dir",
  "divmod",
  "enumerate",
  "eval",
  "exec",
  "exit",
  "filter",
  "format",
  "getattr",
  "globals",
  "hasattr",
  "hash",
  "help",
  "hex",
  "id",
  "input",
  "isinstance",
  "issubclass",
  "iter",
  "len",
  "license",
  "locals",
  "max",
  "min",
  "next",
  "oct",
  "open",
  "ord",
  "pow",
  "print",
  "property",
  "quit",
  "repr",
  "reversed",
  "round",
  "setattr",
  "slice",
  "sorted",
  "sum",
  "vars",
  "zip"
].map((n) => ({ label: n, type: "function" }))), nT = [
  /* @__PURE__ */ st("def ${name}(${params}):\n	${}", {
    label: "def",
    detail: "function",
    type: "keyword"
  }),
  /* @__PURE__ */ st("for ${name} in ${collection}:\n	${}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ st("while ${}:\n	${}", {
    label: "while",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ st("try:\n	${}\nexcept ${error}:\n	${}", {
    label: "try",
    detail: "/ except block",
    type: "keyword"
  }),
  /* @__PURE__ */ st(`if \${}:
	
`, {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  /* @__PURE__ */ st("if ${}:\n	${}\nelse:\n	${}", {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  /* @__PURE__ */ st("class ${name}:\n	def __init__(self, ${params}):\n			${}", {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ st("import ${module}", {
    label: "import",
    detail: "statement",
    type: "keyword"
  }),
  /* @__PURE__ */ st("from ${module} import ${names}", {
    label: "from",
    detail: "import",
    type: "keyword"
  })
], qm = /* @__PURE__ */ hm(Cm, /* @__PURE__ */ lm(/* @__PURE__ */ iT.concat(nT)));
function vh(n) {
  let { node: e, pos: t } = n, i = n.lineIndent(t, -1), r = null;
  for (; ; ) {
    let s = e.childBefore(t);
    if (s)
      if (s.name == "Comment")
        t = s.from;
      else if (s.name == "Body" || s.name == "MatchBody")
        n.baseIndentFor(s) + n.unit <= i && (r = s), e = s;
      else if (s.name == "MatchClause")
        e = s;
      else if (s.type.is("Statement"))
        e = s;
      else
        break;
    else break;
  }
  return r;
}
function Qh(n, e) {
  let t = n.baseIndentFor(e), i = n.lineAt(n.pos, -1), r = i.from + i.text.length;
  return /^\s*($|#)/.test(i.text) && n.node.to < r + 100 && !/\S/.test(n.state.sliceDoc(r, n.node.to)) && n.lineIndent(n.pos, -1) <= t || /^\s*(else:|elif |except |finally:|case\s+[^=:]+:)/.test(n.textAfter) && n.lineIndent(n.pos, -1) > t ? null : t + n.unit;
}
const Aa = /* @__PURE__ */ vs.define({
  name: "python",
  parser: /* @__PURE__ */ eT.configure({
    props: [
      /* @__PURE__ */ Vo.add({
        Body: (n) => {
          var e;
          let t = /^\s*(#|$)/.test(n.textAfter) && vh(n) || n.node;
          return (e = Qh(n, t)) !== null && e !== void 0 ? e : n.continue();
        },
        MatchBody: (n) => {
          var e;
          let t = vh(n);
          return (e = Qh(n, t || n.node)) !== null && e !== void 0 ? e : n.continue();
        },
        IfStatement: (n) => /^\s*(else:|elif )/.test(n.textAfter) ? n.baseIndent : n.continue(),
        "ForStatement WhileStatement": (n) => /^\s*else:/.test(n.textAfter) ? n.baseIndent : n.continue(),
        TryStatement: (n) => /^\s*(except[ :]|finally:|else:)/.test(n.textAfter) ? n.baseIndent : n.continue(),
        MatchStatement: (n) => /^\s*case /.test(n.textAfter) ? n.baseIndent + n.unit : n.continue(),
        "TupleExpression ComprehensionExpression ParamList ArgList ParenthesizedExpression": /* @__PURE__ */ lo({ closing: ")" }),
        "DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression": /* @__PURE__ */ lo({ closing: "}" }),
        "ArrayExpression ArrayComprehensionExpression": /* @__PURE__ */ lo({ closing: "]" }),
        MemberExpression: (n) => n.baseIndent + n.unit,
        "String FormatString": () => null,
        Script: (n) => {
          var e;
          let t = vh(n);
          return (e = t && Qh(n, t)) !== null && e !== void 0 ? e : n.continue();
        }
      }),
      /* @__PURE__ */ $l.add({
        "ArrayExpression DictionaryExpression SetExpression TupleExpression": bf,
        Body: (n, e) => ({ from: n.from + 1, to: n.to - (n.to == e.doc.length ? 0 : 1) }),
        "String FormatString": (n, e) => ({ from: e.doc.lineAt(n.from).to, to: n.to })
      })
    ]
  }),
  languageData: {
    closeBrackets: {
      brackets: ["(", "[", "{", "'", '"', "'''", '"""'],
      stringPrefixes: [
        "f",
        "fr",
        "rf",
        "r",
        "u",
        "b",
        "br",
        "rb",
        "F",
        "FR",
        "RF",
        "R",
        "U",
        "B",
        "BR",
        "RB"
      ]
    },
    commentTokens: { line: "#" },
    // Indent logic logic are triggered upon below input patterns
    indentOnInput: /^\s*([\}\]\)]|else:|elif |except |finally:|case\s+[^:]*:?)$/
  }
});
function rT() {
  return new gf(Aa, [
    Aa.data.of({ autocomplete: Am }),
    Aa.data.of({ autocomplete: qm })
  ]);
}
const sT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  globalCompletion: qm,
  localCompletionSource: Am,
  python: rT,
  pythonLanguage: Aa
}, Symbol.toStringTag, { value: "Module" }));
export {
  VQ as Browser,
  mb as CallLoop,
  ib as CliView,
  $b as CodeView,
  Wd as ConfigPicker,
  U1 as ContextStack,
  Os as FieldRenderer,
  nQ as Lifecycle,
  eS as Machinable,
  Ed as Provenance,
  FQ as ResolvedBar,
  yb as ResultSlot,
  ob as RunBanner,
  fb as RunPanel,
  DQ as StatusBadge,
  x1 as VersionEditor,
  jd as createAdapter,
  lT as default,
  zd as elementsToVersion,
  E0 as moduleSchemaFromServer,
  Vd as mount,
  Js as parseAnnotation,
  W0 as parseSignature,
  j0 as parseVersionToken,
  iS as render,
  V0 as serializeVersionToken,
  Kf as shortIdentity,
  zh as versionToElements
};

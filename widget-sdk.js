// \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, r = Array.isArray, i = Array.prototype.indexOf, a = Array.prototype.includes, o = Array.from, s = Object.defineProperty, c = Object.getOwnPropertyDescriptor, l = Object.getOwnPropertyDescriptors, u = Object.prototype, d = Array.prototype, f = Object.getPrototypeOf, p = Object.isExtensible, m = () => {};
function h(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function g() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var _ = 1024, v = 2048, y = 4096, b = 8192, x = 16384, S = 32768, C = 1 << 25, w = 65536, ee = 1 << 19, te = 1 << 20, ne = 1 << 25, T = 1 << 21, re = 1 << 22, ie = 1 << 23, ae = Symbol("$state"), oe = Symbol("component"), se = Symbol("legacy props"), ce = Symbol(""), le = Symbol("attributes"), ue = Symbol("class"), de = Symbol("style"), fe = Symbol("text"), pe = Symbol("form reset"), me = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), he = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), ge = {}, _e = Symbol("uninitialized"), ve = "http://www.w3.org/1999/xhtml";
function ye() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function be(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function xe() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Se() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/svelte/src/internal/client/dom/hydration.js
var E = !1;
function Ce(e) {
	E = e;
}
var D;
function we(e) {
	if (e === null) throw be(), ge;
	return D = e;
}
function Te() {
	return we(/* @__PURE__ */ sn(D));
}
function O(e) {
	if (E) {
		if (/* @__PURE__ */ sn(D) !== null) throw be(), ge;
		D = e;
	}
}
function Ee(e = 1) {
	if (E) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ sn(n);
		D = n;
	}
}
function De(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ sn(n);
		e && n.remove(), n = i;
	}
}
function Oe(e) {
	if (!e || e.nodeType !== 8) throw be(), ge;
	return e.data;
}
// node_modules/svelte/src/internal/client/reactivity/equality.js
function ke(e) {
	return e === this.v;
}
function Ae(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function je(e) {
	return !Ae(e, this.v);
}
// node_modules/svelte/src/internal/client/errors.js
function Me() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ne(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Pe(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Fe() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ie(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Le() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Re(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ze() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Be() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ve() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function He() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/svelte/src/internal/client/context.js
var Ue = null;
function We(e) {
	Ue = e;
}
function Ge(e, t = !1, n) {
	Ue = {
		p: Ue,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: z,
		l: null
	};
}
function Ke(e) {
	var t = Ue, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) bn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ue = t.p, qe(e);
}
function qe(e = {}) {
	return s(e, oe, { value: !0 }), e;
}
function Je() {
	return !0;
}
// node_modules/svelte/src/internal/client/dom/task.js
var Ye = [];
function Xe() {
	var e = Ye;
	Ye = [], h(e);
}
function Ze(e) {
	if (Ye.length === 0 && !Tt) {
		var t = Ye;
		queueMicrotask(() => {
			t === Ye && Xe();
		});
	}
	Ye.push(e);
}
function Qe() {
	for (; Ye.length > 0;) Xe();
}
// node_modules/svelte/src/internal/client/reactivity/status.js
var $e = ~(v | y | _);
function et(e, t) {
	e.f = e.f & $e | t;
}
function tt(e) {
	e.f & 512 || e.deps === null ? et(e, _) : et(e, y);
}
// node_modules/svelte/src/internal/client/reactivity/utils.js
function nt(e, t) {
	e.f & 2048 ? t.set(e, v) : e.f & 4096 && t.get(e) !== 2048 && t.set(e, y), et(e, _);
}
// node_modules/svelte/src/internal/client/dom/elements/misc.js
function rt(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, Ze(() => {
			document.activeElement === t && e.focus();
		});
	}
}
var it = !1;
function at() {
	it || (it = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[pe]?.();
		});
	}, { capture: !0 }));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ot(e) {
	var t = R, n = z;
	Hn(null), Un(null);
	try {
		return e();
	} finally {
		Hn(t), Un(n);
	}
}
function st(e, t, n, r = n) {
	e.addEventListener(t, () => ot(n));
	let i = e[pe];
	e[pe] = i ? () => {
		i(), r(!0);
	} : () => r(!0), at();
}
// node_modules/svelte/src/internal/client/reactivity/async.js
function ct(e, t, n, r) {
	let i = Je() ? ft : ht;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = z, c = lt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				pn(e, s);
			}
			ut();
		}
	}
	var d = dt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ mt(e))).then(u).catch((e) => pn(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), ut());
	}) : f();
}
function lt() {
	var e = z, t = R, n = Ue, r = A;
	return function(i = !0) {
		Un(e), Hn(t), We(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ut(e = !0) {
	Un(null), Hn(null), We(null), e && A?.deactivate();
}
function dt() {
	var e = z, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ft(e) {
	var t = 2 | v;
	return z !== null && (z.f |= ee), {
		ctx: Ue,
		deps: null,
		effects: null,
		equals: ke,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: _e,
		wv: 0,
		parent: z,
		ac: null
	};
}
var pt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function mt(e, t, n) {
	let r = z;
	r === null && Me();
	var i = void 0, a = Ht(_e), o = !R, s = /* @__PURE__ */ new Set();
	return Cn(() => {
		var t = z, n = g();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== me && n.reject(e);
			}).finally(ut);
		} catch (e) {
			n.reject(e), ut();
		}
		var c = A;
		if (o) {
			if (t.f & 32768) var l = dt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(pt);
			else for (let e of s.values()) e.reject(pt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== pt && (c.activate(), t ? (a.f |= ie, Kt(a, t)) : (a.f & 8388608 && (a.f ^= ie), Kt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), vn(() => {
		for (let e of s) e.reject(pt);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function k(e) {
	let t = /* @__PURE__ */ ft(e);
	return Gn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function ht(e) {
	let t = /* @__PURE__ */ ft(e);
	return t.equals = je, t;
}
function gt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) An(t[n]);
	}
}
function _t(e) {
	var t, n = z, r = e.parent;
	if (!zn && r !== null && e.v !== _e && r.f & 24576) return ye(), e.v;
	Un(r);
	try {
		gt(e), t = rr(e);
	} finally {
		Un(n);
	}
	return t;
}
function vt(e) {
	var t = _t(e);
	!e.equals(t) && (e.wv = er(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), St?.capture(e, t, !0)), e.deps === null)) ? et(e, _) : zn || (Ct === null ? tt(e) : (_n() || A?.is_fork) && Ct.set(e, t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ot(() => {
		t.ac.abort(me), t.ac = null;
	}), t.fn !== null && (t.teardown = m), or(t, 0), On(t));
}
function bt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && sr(t);
}
// node_modules/svelte/src/internal/client/reactivity/batch.js
var xt = null, A = null, St = null, Ct = null, wt = null, Tt = !1, Et = !1, Dt = null, Ot = null, kt = 0, At = 1, jt = class e {
	id = At++;
	started = !1;
	linked = !0;
	prev = null;
	next = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#e = /* @__PURE__ */ new Set();
	#t = /* @__PURE__ */ new Set();
	#n = 0;
	#r = /* @__PURE__ */ new Map();
	#i = null;
	#a = [];
	#o = [];
	#s = /* @__PURE__ */ new Map();
	#c = /* @__PURE__ */ new Map();
	#l = /* @__PURE__ */ new Set();
	is_fork = !1;
	#u = !1;
	constructor() {
		xt === null ? xt = this : (xt.next = this, this.prev = xt), xt = this;
	}
	#d() {
		if (this.is_fork) return !0;
		for (let e of this.#r.keys()) if (!this.#f(e)) return !0;
		return !1;
	}
	#f(e) {
		for (var t = e; t !== null; t = t.parent) if (this.#c.has(t)) return !0;
		return !1;
	}
	skip_effect(e) {
		this.#c.has(e) || this.#c.set(e, {
			d: [],
			m: []
		}), this.#l.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#c.get(e);
		if (n) {
			this.#c.delete(e);
			for (var r of n.d) et(r, v), t(r);
			for (r of n.m) et(r, y), t(r);
		}
		this.#l.add(e);
	}
	#p() {
		var e = [];
		for (let i of this.#a) if (!(i.f & 16384 || !(i.f & 6144))) {
			for (var t = i, n = !1; t.parent !== null;) {
				t = t.parent;
				var r = t.f;
				if (r & 96) {
					if (!(r & 1024)) {
						n = !0;
						break;
					}
					t.f ^= _;
				}
			}
			n || e.push(t);
		}
		return this.#a = [], e;
	}
	#m() {
		this.started = !0;
		for (let [e, t] of this.#s) et(e, t), this.schedule(e);
		this.apply();
		for (var t = Dt = [], n = [], r = Ot = []; this.#a.length > 0;) {
			kt++ > 1e3 && (this.#b(), Nt());
			for (let e of this.#p()) try {
				this.#h(e, t, n);
			} catch (t) {
				throw Rt(e), this.#d() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Dt = null, Ot = null, this.#d()) {
			this.#y(n), this.#y(t);
			for (let [e, t] of this.#c) Lt(e, t);
			r.length > 0 && A.#m();
			return;
		}
		let a = this.#g();
		if (a) this.#y(n), this.#y(t), a.#v(this);
		else {
			this.#s.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), St = this, Ft(n), Ft(t), St = null, this.#i?.resolve();
			var o = A;
			this.#n === 0 && (this.#a.length === 0 || o !== null) && this.#b(), o !== null && (Bt.clear(), o.#m());
		}
	}
	#h(e, t, n) {
		e.f ^= _;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#c.has(r)) && r.fn !== null) {
				a ? r.f ^= _ : i & 4 ? t.push(r) : tr(r) && (i & 16 && this.add_dirty_reaction(r, y), sr(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#g() {
		for (var e = this.prev; e !== null; e = e.prev) if (!e.is_fork && this.#_(e)) return e;
		return null;
	}
	#_(e) {
		for (let [t, [, n]] of this.current) if (!n && e.current.has(t)) return !0;
		return !1;
	}
	#v(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_reactions(e.#s);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#s.delete(i), et(i, v), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#b(), A = this, this.#m();
	}
	#y(e) {
		for (var t = 0; t < e.length; t += 1) nt(e[t], this.#s);
	}
	capture(e, t, n = !1) {
		e.v !== _e && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Ct?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, Ct = null;
	}
	flush() {
		try {
			Et = !0, A = this, this.#m();
		} finally {
			kt = 0, wt = null, Dt = null, Ot = null, Et = !1, A = null, Ct = null, Bt.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear();
		for (let e of this.async_deriveds.values()) e.reject(pt);
		this.#b(), this.#i?.resolve();
	}
	register_created_effect(e) {
		this.#o.push(e);
	}
	increment(e, t) {
		if (this.#n += 1, e) {
			let e = this.#r.get(t) ?? 0;
			this.#r.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#n, e) {
			let e = this.#r.get(t) ?? 0;
			e === 1 ? this.#r.delete(t) : this.#r.set(t, e - 1);
		}
		this.#u || (this.#u = !0, Ze(() => {
			this.#u = !1, this.linked && this.flush();
		}));
	}
	transfer_reactions(e) {
		for (let [t, n] of e) this.add_dirty_reaction(t, n);
		e.clear();
	}
	add_dirty_reaction(e, t) {
		(t === 2048 || this.#s.get(e) !== 2048) && this.#s.set(e, t);
	}
	oncommit(e) {
		this.#e.add(e);
	}
	ondiscard(e) {
		this.#t.add(e);
	}
	settled() {
		return (this.#i ??= g()).promise;
	}
	static ensure() {
		if (A === null) {
			let t = A = new e();
			!Et && !Tt && Ze(() => {
				t.started || t.flush();
			});
		}
		return A;
	}
	apply() {
		Ct = null;
	}
	schedule(e) {
		wt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#a.push(e);
	}
	#b() {
		if (this.linked) {
			var e = this.prev, t = this.next;
			e === null || (e.next = t), t === null ? xt = e : t.prev = e, this.linked = !1;
		}
	}
};
function Mt(e) {
	var t = Tt, n = St;
	St = null, Tt = !0;
	try {
		var r;
		for (e && (Mt(), r = e());;) {
			if (Qe(), A === null) return r;
			A.flush();
		}
	} finally {
		Tt = t, St = n;
	}
}
function Nt() {
	try {
		Le();
	} catch (e) {
		pn(e, wt);
	}
}
var Pt = null;
function Ft(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && tr(r) && (Pt = /* @__PURE__ */ new Set(), sr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Mn(r), Pt?.size > 0)) {
				Bt.clear();
				for (let e of Pt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Pt.has(n) && (Pt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || sr(n);
					}
				}
				Pt.clear();
			}
		}
		Pt = null;
	}
}
function It(e) {
	A.schedule(e);
}
function Lt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), et(e, _);
		for (var n = e.first; n !== null;) Lt(n, t), n = n.next;
	}
}
function Rt(e) {
	et(e, _);
	for (var t = e.first; t !== null;) Rt(t), t = t.next;
}
// node_modules/svelte/src/internal/client/reactivity/sources.js
var zt = /* @__PURE__ */ new Set(), Bt = /* @__PURE__ */ new Map(), Vt = !1;
function Ht(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: ke,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function j(e, t) {
	let n = Ht(e, t);
	return Gn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ut(e, t = !1, n = !0) {
	let r = Ht(e);
	return t || (r.equals = je), r;
}
function M(e, t, n = !1) {
	return R !== null && (!Vn || R.f & 131072) && Je() && R.f & 4325394 && (Wn === null || !Wn.has(e)) && Ve(), Kt(e, n ? Xt(t) : t, Ot);
}
var Wt = null, Gt = 0;
function Kt(e, t, n = null) {
	if (!e.equals(t)) {
		zn ? Bt.set(e, t) : Bt.has(e) || Bt.set(e, e.v);
		var r = jt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && _t(t), Ct === null && tt(t);
		}
		e.wv = er(), Wt = null, Gt = 0, Yt(e, v, n), Wt = null, Je() && z !== null && z.f & 1024 && !(z.f & 96) && (Jn === null ? Yn([e]) : Jn.push(e)), !r.is_fork && zt.size > 0 && !Vt && qt();
	}
	return t;
}
function qt() {
	Vt = !1;
	for (let e of zt) {
		e.f & 1024 && et(e, y);
		let t;
		try {
			t = tr(e);
		} catch {
			t = !0;
		}
		t && sr(e);
	}
	zt.clear();
}
function Jt(e) {
	M(e, e.v + 1);
}
function Yt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Je(), a = r.length;
		if (Gt += a, Gt > 1e5 && Wt === null && (Wt = /* @__PURE__ */ new Set()), Wt !== null) {
			if (Wt.has(e)) return;
			Wt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== z) {
				var l = (c & v) === 0;
				if (l && et(s, t), c & 131072) zt.add(s);
				else if (c & 2) {
					var u = s;
					Ct?.delete(u), Yt(u, y, n);
				} else if (l) {
					var d = s;
					c & 16 && Pt !== null && Pt.add(d), n === null ? It(d) : n.push(d);
				}
			}
		}
	}
}
function Xt(e) {
	if (typeof e != "object" || !e || ae in e || oe in e) return e;
	let t = f(e);
	if (t !== u && t !== d) return e;
	var n = /* @__PURE__ */ new Map(), i = r(e), a = /* @__PURE__ */ j(0), o = null, s = Qn, l = (e) => {
		if (Qn === s) return e();
		var t = R, n = Qn;
		Hn(null), $n(s);
		var r = e();
		return Hn(t), $n(n), r;
	};
	return i && n.set("length", /* @__PURE__ */ j(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			"value" in r && r.configurable !== !1 && r.enumerable !== !1 && r.writable !== !1 || ze();
			var i = n.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ j(r.value, o);
				return n.set(t, e), e;
			}) : M(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ j(_e, o));
					n.set(t, e), Jt(a);
				}
			} else M(r, _e), Jt(a);
			return !0;
		},
		get(t, r, i) {
			if (r === ae) return e;
			var a = n.get(r), s = r in t;
			if (a === void 0 && (!s || c(t, r)?.writable) && (a = l(() => /* @__PURE__ */ j(Xt(s ? t[r] : _e), o)), n.set(r, a)), a !== void 0) {
				var u = B(a);
				return u === _e ? void 0 : u;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = B(i);
				if (a === _e) return;
				if (r && "value" in r) r.value = a;
				else return {
					enumerable: !0,
					configurable: !0,
					value: a,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === ae) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== _e || Reflect.has(e, t);
			return (r !== void 0 || (z !== null || R !== null) && (!i || c(e, t)?.writable)) && (r === void 0 && (r = l(() => /* @__PURE__ */ j(i ? Xt(e[t]) : _e, o)), n.set(t, r)), B(r) === _e) ? !1 : i;
		},
		set(e, t, r, s) {
			var u = n.get(t), d = t in e;
			if (i && t === "length") for (var f = r; f < u.v; f += 1) {
				var p = n.get(f + "");
				p === void 0 ? f in e && (p = l(() => /* @__PURE__ */ j(_e, o)), n.set(f + "", p)) : M(p, _e);
			}
			if (u === void 0) (!d || c(e, t)?.writable) && (u = l(() => /* @__PURE__ */ j(void 0, o)), M(u, Xt(r)), n.set(t, u));
			else {
				d = u.v !== _e;
				var m = l(() => Xt(r));
				M(u, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, r), !d) {
				if (i && typeof t == "string") {
					var g = n.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && M(g, _ + 1);
				}
				Jt(a);
			}
			return !0;
		},
		ownKeys(e) {
			B(a);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== _e;
			});
			for (var [r, i] of n) i.v !== _e && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Be();
		}
	});
}
function Zt(e) {
	try {
		if (typeof e == "object" && e && ae in e) return e[ae];
	} catch {}
	return e;
}
function Qt(e, t) {
	return Object.is(Zt(e), Zt(t));
}
var $t, en, tn, nn;
function rn() {
	if ($t === void 0) {
		$t = window, en = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		tn = c(t, "firstChild").get, nn = c(t, "nextSibling").get, p(e) && (e[ue] = void 0, e[le] = null, e[de] = void 0, e.__e = void 0), p(n) && (n[fe] = void 0);
	}
}
function an(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function on(e) {
	return tn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function sn(e) {
	return nn.call(e);
}
function N(e, t) {
	if (!E) return /* @__PURE__ */ on(e);
	var n = /* @__PURE__ */ on(D);
	if (n === null) n = D.appendChild(an());
	else if (t && n.nodeType !== 3) {
		var r = an();
		return n?.before(r), we(r), r;
	}
	return t && dn(n), we(n), n;
}
function P(e, t = !1) {
	if (!E) {
		var n = /* @__PURE__ */ on(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ sn(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = an();
			return D?.before(r), we(r), r;
		}
		dn(D);
	}
	return D;
}
function F(e, t = !1) {
	if (!E) return /* @__PURE__ */ on(e);
	var n = N(e, t);
	return O(e), n;
}
function I(e, t = 1, n = !1) {
	let r = E ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ sn(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = an();
			return r === null ? i?.after(a) : r.before(a), we(a), a;
		}
		dn(r);
	}
	return we(r), r;
}
function cn(e) {
	e.textContent = "";
}
function ln() {
	return !1;
}
function un(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function dn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function fn(e) {
	var t = z;
	if (t === null) return R.f |= ie, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	pn(e, t);
}
function pn(e, t) {
	if (e === ge) throw e;
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
// node_modules/svelte/src/internal/client/reactivity/effects.js
function mn(e) {
	z === null && (R === null && Ie(e), Fe()), zn && Pe(e);
}
function hn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function gn(e, t) {
	var n = z;
	n !== null && n.f & 8192 && (e |= b);
	var r = {
		ctx: Ue,
		deps: null,
		nodes: null,
		f: e | v | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	A?.register_created_effect(r);
	var i = r;
	if (e & 4) Dt === null ? jt.ensure().schedule(r) : Dt.push(r);
	else if (t !== null) {
		try {
			sr(r);
		} catch (e) {
			throw An(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= w));
	}
	if (i !== null && (i.parent = n, n !== null && hn(i, n), R !== null && R.f & 2 && !(e & 64))) {
		var a = R;
		(a.effects ??= []).push(i);
	}
	return r;
}
function _n() {
	return R !== null && !Vn;
}
function vn(e) {
	let t = gn(8, null);
	return et(t, _), t.teardown = e, t;
}
function yn(e) {
	mn("$effect");
	var t = z.f;
	if (!R && t & 32 && Ue !== null && !Ue.i) {
		var n = Ue;
		(n.e ??= []).push(e);
	} else return bn(e);
}
function bn(e) {
	return gn(4 | te, e);
}
function xn(e) {
	jt.ensure();
	let t = gn(64 | ee, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Nn(t, () => {
			An(t), n(void 0);
		}) : (An(t), n(void 0));
	});
}
function Sn(e) {
	return gn(4, e);
}
function Cn(e) {
	return gn(re | ee, e);
}
function wn(e, t = 0) {
	return gn(8 | t, e);
}
function L(e, t = [], n = [], r = []) {
	ct(r, t, n, (t) => {
		gn(8, () => {
			e(...t.map(B));
		});
	});
}
function Tn(e, t = 0) {
	return gn(16 | t, e);
}
function En(e) {
	return gn(32 | ee, e);
}
function Dn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = zn, r = R;
		Bn(!0), Hn(null);
		try {
			t.call(null);
		} catch (t) {
			pn(t, e.parent);
		} finally {
			Bn(n), Hn(r);
		}
	}
}
function On(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ot(() => {
			e.abort(me);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : An(n, t), n = r;
	}
}
function kn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || An(t), t = n;
	}
}
function An(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (jn(e.nodes.start, e.nodes.end), n = !0), e.f |= C, On(e, t && !n), or(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Dn(e), e.f ^= C, e.f |= x;
	var i = e.parent;
	i !== null && i.first !== null && Mn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function jn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ sn(e);
		e.remove(), e = n;
	}
}
function Mn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Nn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Pn(e, r, !0);
	var i = () => {
		n && An(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Pn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= b;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Pn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Fn(e) {
	e.f &= -257, In(e, !0);
}
function In(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= b, e.f & 1024 || (et(e, v), jt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			In(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Ln(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ sn(n);
		t.append(n), n = i;
	}
}
// node_modules/svelte/src/internal/client/legacy.js
var Rn = null, zn = !1;
function Bn(e) {
	zn = e;
}
var R = null, Vn = !1;
function Hn(e) {
	R = e;
}
var z = null;
function Un(e) {
	z = e;
}
var Wn = null;
function Gn(e) {
	R !== null && (R.f & 2097152 || R.f & 2) && (Wn ??= /* @__PURE__ */ new Set()).add(e);
}
var Kn = null, qn = 0, Jn = null;
function Yn(e) {
	Jn = e;
}
var Xn = 1, Zn = 0, Qn = Zn;
function $n(e) {
	Qn = e;
}
function er() {
	return ++Xn;
}
function tr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (tr(a) && vt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Ct === null && et(e, _);
	}
	return !1;
}
function nr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Wn !== null && Wn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? nr(a, t, !1) : t === a && (n ? et(a, v) : a.f & 1024 && et(a, y), It(a));
	}
}
function rr(e) {
	var t = Kn, n = qn, r = Jn, i = R, a = Wn, o = Ue, s = Vn, c = Qn, l = e.f;
	Kn = null, qn = 0, Jn = null, R = l & 96 ? null : e, Wn = null, We(e.ctx), Vn = !1, Qn = ++Zn, e.ac !== null && (ot(() => {
		e.ac.abort(me);
	}), e.ac = null);
	try {
		e.f |= T;
		var u = e.fn, d = u();
		e.f |= S;
		var f = ir(e);
		if (Je() && Jn !== null && !Vn && f !== null && !(e.f & 6146)) for (var p = 0; p < Jn.length; p++) nr(Jn[p], e);
		if (i !== null && i !== e) {
			if (Zn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Zn;
			if (t !== null) for (let e of t) e.rv = Zn;
			Jn !== null && (r === null ? r = Jn : r.push(...Jn));
		}
		return e.f & 8388608 && (e.f ^= ie), d;
	} catch (t) {
		return ir(e), fn(t);
	} finally {
		e.f ^= T, Kn = t, qn = n, Jn = r, R = i, Wn = a, We(o), Vn = s, Qn = c;
	}
}
function ir(e) {
	var t = e.deps, n = A?.is_fork;
	if (Kn !== null) {
		var r;
		if (n || or(e, qn), t !== null && qn > 0) for (t.length = qn + Kn.length, r = 0; r < Kn.length; r++) t[qn + r] = Kn[r];
		else e.deps = t = Kn;
		if (_n() && e.f & 512) for (r = qn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && qn < t.length && (or(e, qn), t.length = qn);
	return t;
}
function ar(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = i.call(n, e);
		if (r !== -1) {
			var o = n.length - 1;
			o === 0 ? n = t.reactions = null : (n[r] = n[o], n.pop());
		}
	}
	if (n === null && t.f & 2 && (Kn === null || !a.call(Kn, t))) {
		var s = t;
		s.f & 512 && (s.f ^= 512), s.v !== _e && tt(s), s.ac !== null && ot(() => {
			s.ac.abort(me), s.ac = null, et(s, v);
		}), yt(s), or(s, 0);
	}
}
function or(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ar(e, n[r]);
}
function sr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		et(e, _);
		var n = z;
		z = e;
		try {
			t & 16777232 ? kn(e) : On(e), Dn(e);
			var r = rr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Xn;
		} finally {
			z = n;
		}
	}
}
async function cr() {
	await Promise.resolve(), Mt();
}
function B(e) {
	var t = !!(e.f & 2);
	if (Rn?.add(e), R !== null && !Vn && !(z !== null && z.f & 16384) && (Wn === null || !Wn.has(e))) {
		var n = R.deps;
		if (R.f & 2097152) e.rv < Zn && (e.rv = Zn, Kn === null && n !== null && n[qn] === e ? qn++ : Kn === null ? Kn = [e] : Kn.push(e));
		else {
			R.deps ??= [], a.call(R.deps, e) || R.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [R] : a.call(r, R) || r.push(R);
		}
	}
	if (zn && Bt.has(e)) return Bt.get(e);
	if (t) {
		var i = e;
		if (zn) {
			var o = i.v;
			return (!(i.f & 1024) && i.reactions !== null || ur(i)) && (o = _t(i)), Bt.set(i, o), o;
		}
		var s = !(i.f & 512) && !Vn && R !== null && !!(R.f & 512), c = (i.f & S) === 0;
		tr(i) && (s && (i.f |= 512), vt(i)), s && !c && (bt(i), lr(i));
	}
	if (Ct?.has(e)) return Ct.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function lr(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : a.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (bt(n), lr(n));
	}
}
function ur(e) {
	if (e.v === _e) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Bt.has(t) || t.f & 2 && ur(t)) return !0;
	return !1;
}
function dr(e) {
	var t = Vn;
	try {
		return Vn = !0, e();
	} finally {
		Vn = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var fr = ["touchstart", "touchmove"];
function pr(e) {
	return fr.includes(e);
}
// node_modules/svelte/src/internal/client/dom/elements/events.js
var mr = Symbol("events"), hr = /* @__PURE__ */ new Set(), gr = /* @__PURE__ */ new Set();
function _r(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Sr.call(t, e), !e.cancelBubble) return ot(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Ze(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function vr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = _r(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && vn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function V(e, t, n) {
	(t[mr] ??= {})[e] = n;
}
function yr(e) {
	for (var t = 0; t < e.length; t++) hr.add(e[t]);
	for (var n of gr) n(e);
}
var br = null, xr = !1;
function Sr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	br = e, xr || (xr = !0, setTimeout(() => {
		xr = !1, br = null;
	}));
	var o = 0, c = br === e && e[mr];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[mr] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		l <= u && (o = l);
	}
	if (a = i[o] || e.target, a !== t) {
		s(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = R, f = z;
		Hn(null), Un(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[mr]?.[r];
					h == null || a.disabled && e.target !== a || h.call(a, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[mr] = t, delete e.currentTarget, Hn(d), Un(f);
		}
	}
}
// node_modules/svelte/src/internal/client/dom/reconciler.js
var Cr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function wr(e) {
	return Cr?.createHTML(e) ?? e;
}
function Tr(e) {
	var t = un("template");
	return t.innerHTML = wr(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/svelte/src/internal/client/dom/template.js
function Er(e, t) {
	var n = z;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function H(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (E) return Er(D, null), D;
		i === void 0 && (i = Tr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ on(i)));
		var t = r || en ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ on(t), s = t.lastChild;
			Er(o, s);
		} else Er(t, t);
		return t;
	};
}
function Dr() {
	if (E) return Er(D, null), D;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = an();
	return e.append(t, n), Er(t, n), e;
}
function U(e, t) {
	if (E) {
		var n = z;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = D), Te();
	} else e !== null && e.before(t);
}
// node_modules/svelte/src/reactivity/create-subscriber.js
function Or(e) {
	let t = 0, n = Ht(0), r;
	return () => {
		_n() && (B(n), wn(() => (t === 0 && (r = dr(() => e(() => Jt(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, Jt(n));
			});
		})));
	};
}
// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var kr = w | ee;
function Ar(e, t, n, r) {
	new jr(e, t, n, r);
}
var jr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = E ? D : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Map();
	#p = null;
	#m = Or(() => (this.#p = Ht(this.#l), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = z;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = z.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Tn(() => {
			if (E) {
				let e = Oe(this.#t);
				Te();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#g(t);
				} else t ? this.#y() : this.#h();
			} else this.#b();
		}, kr), E && (this.#e = D);
	}
	#h() {
		try {
			this.#a = En(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#g(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#_(e);
		Ze(r), t && (this.#s = En(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#_(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#v() || (t ? Se() : (t = !0, n && He(), this.#s !== null && Nn(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#v()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					pn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#v() {
		return (this.#i.f & (x | C)) !== 0;
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = En(() => e(this.#e)), Ze(() => {
			if (!this.#v()) {
				var e = this.#c = document.createDocumentFragment(), t = an(), n = !1;
				e.append(t), this.#a = this.#S(() => {
					try {
						return En(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							pn(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#x(A)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Nn(this.#o, () => {
					this.#o = null;
				}), this.#x(A));
			}
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = En(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Ln(this.#a, e);
				let t = this.#n.pending;
				this.#o = En(() => t(this.#e));
			} else this.#x(A);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_reactions(this.#f);
	}
	defer_effect(e) {
		nt(e, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = z, n = R, r = Ue;
		Un(this.#i), Hn(this.#i), We(this.#i.ctx);
		try {
			return jt.ensure(), e();
		} finally {
			Un(t), Hn(n), We(r);
		}
	}
	#C(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Nn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#C(e, t);
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !this.#p || this.#d || (this.#d = !0, Ze(() => {
			this.#d = !1, this.#p && Kt(this.#p, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#m(), B(this.#p);
	}
	error(e) {
		if (e === ge || !this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#v() || this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (An(this.#a), null), this.#o &&= (An(this.#o), null), this.#s &&= (An(this.#s), null), E && (we(this.#t), Ee(), we(De()));
		let t = this.#n.failed, n = (e) => {
			if (this.#v()) return;
			let { reset: n, invoke_onerror: r } = this.#_(e);
			r(), t && !this.#v() && (this.#s = this.#S(() => {
				try {
					return En(() => {
						var r = z;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return pn(e, this.#i.parent), null;
				}
			}));
		};
		Ze(() => {
			if (!this.#v()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					pn(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => pn(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function W(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[fe] ??= e.nodeValue) && (e[fe] = n, e.nodeValue = `${n}`);
}
function Mr(e, t) {
	return Pr(e, t);
}
var Nr = /* @__PURE__ */ new Map();
function Pr(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: s = !0, transformError: c }) {
	rn();
	var l = void 0, u = xn(() => {
		var s = n ?? t.appendChild(an());
		Ar(s, { pending: () => {} }, (t) => {
			Ge({});
			var n = Ue;
			if (a && (n.c = a), i && (r.$$events = i), E && Er(t, null), l = e(t, r) || qe(), E && (z.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw be(), ge;
			Ke();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = pr(r);
					for (let e of [t, document]) {
						var a = Nr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Nr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Sr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(o(hr)), gr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Nr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Sr), r.delete(e), r.size === 0 && Nr.delete(n)) : r.set(e, i);
			}
			gr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Fr.set(l, u), l;
}
var Fr = /* @__PURE__ */ new WeakMap();
function Ir(e, t) {
	let n = Fr.get(e);
	return n ? (Fr.delete(e), n(t)) : Promise.resolve();
}
// node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Lr = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Fn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Fn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (An(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Ln(r, t), t.append(an()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else An(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Nn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (An(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = ln();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = an();
				i.append(a), this.#n.set(e, {
					effect: En(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, En(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else E && (this.anchor = D), this.#a(n);
	}
};
// node_modules/svelte/src/internal/client/dom/blocks/if.js
function G(e, t, n = !1) {
	var r;
	E && (r = D, Te());
	var i = new Lr(e), a = n ? w : 0;
	function o(e, t) {
		if (E) {
			var n = Oe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = De();
				we(a), i.anchor = a, Ce(!1), i.ensure(e, t), Ce(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Tn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// node_modules/svelte/src/internal/client/dom/blocks/each.js
function Rr(e, t) {
	return t;
}
function zr(e, t, n) {
	for (var r = [], i = t.length, a, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		Nn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Br(e, o(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = r.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			cn(d), d.append(u), e.items.clear();
		}
		Br(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Br(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, Ln(a, document.createDocumentFragment())) : An(t[i], n);
	}
}
var Vr;
function Hr(e, t, n, i, a, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = E ? we(/* @__PURE__ */ on(u)) : u.appendChild(an());
	}
	E && Te();
	var d = null, f = /* @__PURE__ */ ht(() => {
		var e = n();
		return r(e) ? e : e == null ? [] : o(e);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var n = B(f);
			_.fallback = d, Wr(_, n, c, t, i), d !== null && (n.length === 0 ? d.f & 33554432 ? (d.f ^= ne, Kr(d, null, c)) : Fn(d) : Nn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: Tn(() => {
			var e = B(f), r = e.length;
			let o = !1;
			E && Oe(c) === "[!" != (r === 0) && (c = De(), we(c), Ce(!1), o = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = A, v = ln(), y = 0; y < r; y += 1) {
				E && D.nodeType === 8 && D.data === "]" && (c = D, o = !0, Ce(!1));
				var b = e[y], x = i(b, y), S = m ? null : l.get(x);
				S ? (S.v && Kt(S.v, b), S.i && Kt(S.i, y), v && _.unskip_effect(S.e)) : (S = Gr(l, m ? c : Vr ??= an(), b, x, y, a, t, n), m || (S.e.f |= ne), l.set(x, S)), u.add(x);
			}
			if (r === 0 && s && !d && (m ? d = En(() => s(c)) : (d = En(() => s(Vr ??= an())), d.f |= ne)), r > u.size && Ne("", "", ""), E && r > 0 && we(De()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			o && Ce(!0), B(f);
		}),
		flags: t,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, E && (c = D);
}
function Ur(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Wr(e, t, n, r, i) {
	var a = !!(r & 8), s = t.length, c = e.items, l = Ur(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Fn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) Kr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), qr(e, d, _), qr(e, _, y), Kr(_, y, n), d = _, p = [], m = [], l = Ur(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Kr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					qr(e, S.prev, C.next), qr(e, d, S), qr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Kr(_, l, n), qr(e, _.prev, _.next), qr(e, _, d === null ? e.effect.first : d.next), qr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Ur(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Ur(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Br(e, o(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Ur(l.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && s === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			zr(e, w, te);
		}
	}
	a && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Gr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Ht(n) : /* @__PURE__ */ Ut(n, !1, !1) : null, l = o & 2 ? Ht(i) : null;
	return {
		v: c,
		i: l,
		e: En(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Kr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ sn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function qr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function Jr(e, t, ...n) {
	var r = new Lr(e);
	Tn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, w);
}
// node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Yr(e, t, n) {
	var r;
	E && (r = D, Te());
	var i = new Lr(e);
	Tn(() => {
		var e = t() ?? null;
		if (E && Oe(r) === "[" != (e !== null)) {
			var a = De();
			we(a), i.anchor = a, Ce(!1), i.ensure(e, e && ((t) => n(t, e))), Ce(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, w);
}
// node_modules/clsx/dist/clsx.mjs
function Xr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Xr(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Zr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Xr(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/svelte/src/internal/shared/attributes.js
function Qr(e) {
	return typeof e == "object" ? Zr(e) : e ?? "";
}
var $r = [..." 	\n\r\f\xA0\v﻿"];
function ei(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || $r.includes(r[o - 1])) && (s === r.length || $r.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ti(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ni(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function ri(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ni)), i && c.push(...Object.keys(i).map(ni));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ni(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += ti(r)), i && (n += ti(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
// node_modules/svelte/src/internal/client/dom/elements/class.js
function ii(e, t, n, r, i, a) {
	var o = e[ue];
	if (E || o !== n || o === void 0) {
		var s = ei(n, r, a);
		E && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ue] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// node_modules/svelte/src/internal/client/dom/elements/style.js
function ai(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function oi(e, t, n, r) {
	var i = e[de];
	if (E || i !== t) {
		var a = ri(t, r);
		E && a === e.getAttribute("style") || (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[de] = t;
	} else r && (Array.isArray(r) ? (ai(e, n?.[0], r[0]), ai(e, n?.[1], r[1], "important")) : ai(e, n, r));
	return r;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function si(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ci(e, t) {
	var n = e.__defaultValue, i = e.multiple, a = i ? n ?? [] : null;
	if (!i || r(a)) {
		var o = e.selectedIndex, s = t && i ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = fi(c);
			si(c, i ? a.includes(l) : Qt(l, n));
		}
		if (t) {
			if (s !== null) for (c of e.options) {
				var u = s.has(c);
				c.selected !== u && (c.selected = u);
			}
			else e.selectedIndex !== o && (e.selectedIndex = o);
		}
	}
}
function li(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!r(t)) return xe();
		for (var i of e.options) i.selected = t.includes(fi(i));
	} else {
		for (i of e.options) if (Qt(fi(i), t)) {
			i.selected = !0;
			return;
		}
		n && t === void 0 || (e.selectedIndex = -1);
	}
}
function ui(e) {
	var t = new MutationObserver((t) => {
		t.every(pi) || ("__defaultValue" in e && ci(e, !1), "__value" in e && li(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), vn(() => {
		t.disconnect();
	});
}
function di(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	st(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), fi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && fi(o);
		}
		n(a), e.__value = a, A !== null && r.add(A);
	}), Sn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = A;
			if (r.has(o)) return;
		}
		if (li(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = fi(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function fi(e) {
	return "__value" in e ? e.__value : e.value;
}
function pi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var mi = Symbol("is custom element"), hi = Symbol("is html"), gi = he ? "link" : "LINK", _i = he ? "progress" : "PROGRESS";
function vi(e) {
	if (E) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					bi(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					bi(e, "checked", null), e.checked = r;
				}
			}
		};
		e[pe] = n, Ze(n), at();
	}
}
function yi(e, t) {
	var n = xi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === _i) && (e.value = t ?? "");
}
function bi(e, t, n, r) {
	var i = xi(e);
	if (!(E && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === gi))) {
		var a = i[t];
		a !== (i[t] = n) && (t === "loading" && (e[ce] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ci(e).has(t) ? e[t] = n : (!E || typeof n != "number" && typeof n != "boolean" || a !== String(n)) && e.setAttribute(t, n));
	}
}
function xi(e) {
	return e[le] ??= {
		[mi]: e.nodeName.includes("-"),
		[hi]: e.namespaceURI === ve
	};
}
var Si = /* @__PURE__ */ new Map();
function Ci(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Si.get(t);
	if (n) return n;
	Si.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = l(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = f(i);
	}
	return n;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function wi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	st(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Ti(e) ? Ei(a) : a, n(a), A !== null && r.add(A), await cr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (E && e.defaultValue !== e.value || dr(t) == null && e.value) && (n(Ti(e) ? Ei(e.value) : e.value), A !== null && r.add(A)), wn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = A;
			if (r.has(i)) return;
		}
		Ti(e) && n === Ei(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Ti(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ei(e) {
	return e === "" ? null : +e;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Di(e, t) {
	return e === t || e?.[ae] === t;
}
function Oi(e = qe(), t, n, r) {
	var i = Ue.r, a = z;
	return Sn(() => {
		var o, s;
		return wn(() => {
			o = s, s = r?.() || [], dr(() => {
				Di(n(...s), e) || (t(e, ...s), o && Di(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Di(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// node_modules/svelte/src/internal/client/reactivity/store.js
var ki = !1;
function Ai(e) {
	var t = ki;
	try {
		return ki = !1, [e(), ki];
	} finally {
		ki = t;
	}
}
// node_modules/svelte/src/internal/client/reactivity/props.js
function ji(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, l = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ ft(r), B(u)) : (l && (l = !1, s = o ? dr(r) : r), s);
	let f;
	if (a) {
		var p = ae in e || se in e;
		f = c(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = Ai(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Re(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (l = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? ft : ht)(() => (v = !1, g()));
	a && B(y);
	var b = z;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? B(y) : i && a ? Xt(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return zn && v || b.f & 16384 ? y.v : B(y);
	});
}
// node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
// src/introspection.ts
function Mi(e, t) {
	let n = [], r = 0, i = null, a = "";
	for (let o = 0; o < e.length; o++) {
		let s = e[o];
		i ? (a += s, s === i && e[o - 1] !== "\\" && (i = null)) : s === "'" || s === "\"" ? (i = s, a += s) : ((s === "[" || s === "(" || s === "{") && r++, (s === "]" || s === ")" || s === "}") && r--, r === 0 && s === t && t.length === 1 ? (n.push(a), a = "") : a += s);
	}
	return n.push(a), n;
}
function Ni(e) {
	let t = e.trim();
	if (t === "None") return null;
	if (t === "True") return !0;
	if (t === "False") return !1;
	if (/^-?\d+$/.test(t)) return parseInt(t, 10);
	if (/^-?\d*\.\d+(e-?\d+)?$/i.test(t) || /^-?\d+e-?\d+$/i.test(t)) return parseFloat(t);
	let n = t.match(/^(['"])(.*)\1$/s);
	return n ? n[2] : t;
}
function Pi(e) {
	let t = (e ?? "").trim();
	if (!t) return { kind: "unknown" };
	let n = t.match(/^<class '([^']+)'>$/);
	if (n && (t = n[1]), t = t.replace(/^typing\./, ""), Mi(t, "|").length > 1) {
		let n = Mi(t, "|").map((e) => e.trim()), r = n.filter((e) => e !== "None" && e !== "NoneType"), i = r.length !== n.length, a = r.length === 1 ? Pi(r[0]) : {
			kind: "unknown",
			annotation: e
		};
		return i ? {
			kind: "optional",
			inner: a
		} : a;
	}
	let r = t.match(/^(\w+)\[(.*)\]$/s);
	if (r) {
		let t = r[1], n = r[2];
		switch (t) {
			case "Optional": return {
				kind: "optional",
				inner: Pi(n)
			};
			case "Literal": {
				let t = Mi(n, ",").map((e) => Ni(e)).filter((e) => typeof e == "string" || typeof e == "number");
				return t.length ? {
					kind: "enum",
					options: t
				} : {
					kind: "unknown",
					annotation: e
				};
			}
			case "list":
			case "List":
			case "Sequence":
			case "tuple":
			case "Tuple": return {
				kind: "list",
				item: Pi(Mi(n, ",")[0])
			};
			case "dict":
			case "Dict":
			case "Mapping": return {
				kind: "object",
				open: !0
			};
			default: return {
				kind: "unknown",
				annotation: e
			};
		}
	}
	switch (t) {
		case "str": return { kind: "str" };
		case "int": return { kind: "int" };
		case "float": return { kind: "float" };
		case "bool": return { kind: "bool" };
		case "dict": return {
			kind: "object",
			open: !0
		};
		case "list":
		case "tuple": return {
			kind: "list",
			item: { kind: "unknown" }
		};
		default: return {
			kind: "unknown",
			annotation: e
		};
	}
}
function Fi(e) {
	if (!e) return [];
	let t = e.trim().replace(/^\(/, "").replace(/\)$/, "");
	if (!t.trim()) return [];
	let n = [];
	for (let e of Mi(t, ",")) {
		let t = e.trim();
		if (!t || t === "self" || t === "*" || t === "/" || t.startsWith("*")) continue;
		let r = Mi(t, "="), i = r[0].trim(), a = r.length > 1 ? r.slice(1).join("=").trim() : void 0, o = Mi(i, ":"), s = o[0].trim();
		if (!s || !/^\w+$/.test(s)) continue;
		let c = o.length > 1 ? o.slice(1).join(":").trim() : void 0;
		n.push({
			name: s,
			type: c ? Pi(c) : void 0,
			default: a === void 0 ? void 0 : Ni(a)
		});
	}
	return n;
}
function Ii(e, t) {
	return e.kind === "unknown" ? t : e.kind === "optional" ? {
		kind: "optional",
		inner: Ii(e.inner, t)
	} : e.kind === "list" ? {
		kind: "list",
		item: Ii(e.item, t)
	} : e;
}
function Li(e) {
	if (!e) return;
	let t = {};
	for (let n of [
		"gt",
		"ge",
		"lt",
		"le",
		"multipleOf"
	]) {
		let r = e[n === "multipleOf" ? "multiple_of" : n];
		typeof r == "number" && (t[n] = r);
	}
	for (let [n, r] of [["minLength", "min_length"], ["maxLength", "max_length"]]) {
		let i = e[r];
		typeof i == "number" && (t[n] = i);
	}
	return typeof e.pattern == "string" && (t.pattern = e.pattern), Object.keys(t).length ? t : void 0;
}
function Ri(e, t) {
	let n = Pi(e.type ?? "");
	if (e.fields?.length) {
		let t = e.fields.map((e) => Ri(e));
		n = Ii(n, {
			kind: "object",
			fields: t
		});
	}
	return {
		key: e.name,
		type: n,
		default: e.default ?? void 0,
		required: e.required ?? void 0,
		doc: e.description ?? void 0,
		constraints: Li(e.constraints),
		slot: t?.(e.name)
	};
}
function zi(e, t, n) {
	let r = (t.config_fields ?? []).map((e) => Ri(e, n?.slotFor)), i = t.source_file ?? void 0, a = t.version_methods?.length ? t.version_methods.map((e) => ({
		name: e.name,
		doc: e.doc ?? void 0,
		signature: e.signature,
		params: Fi(e.signature),
		sourceRef: i ? {
			path: i,
			line: e.source_line ?? void 0,
			symbol: `version_${e.name}`
		} : void 0
	})) : (t.versions ?? []).map((e) => ({
		name: e,
		params: []
	}));
	return {
		module: t.module ?? e,
		kind: t.kind,
		doc: t.doc ?? void 0,
		fields: r,
		versionMethods: a,
		sourceRef: i ? {
			path: i,
			line: t.source_line ?? void 0
		} : void 0
	};
}
function Bi(e) {
	let t = [];
	for (let n of e) if (typeof n == "string") {
		let e = Hi(n);
		e && t.push({
			kind: "token",
			name: e.name,
			args: e.args
		});
	} else t.push({
		kind: "dict",
		value: { ...n }
	});
	return t;
}
function Vi(e, t = (e, t) => t) {
	let n = [];
	for (let r of e) r.kind === "dict" ? Object.keys(r.value).length && n.push({ ...r.value }) : n.push(Ui(r.name, t(r.name, r.args)));
	return n;
}
function Hi(e) {
	let t = e.match(/^~(\w+)(?:\((.*)\))?$/s);
	if (!t) return null;
	let n = {};
	if (t[2]?.trim()) for (let e of Mi(t[2], ",")) {
		let [t, ...r] = e.split("="), i = r.join("=").trim();
		if (t.trim() && i) try {
			n[t.trim()] = JSON.parse(i.replace(/'/g, "\""));
		} catch {
			n[t.trim()] = i;
		}
	}
	return {
		name: t[1],
		args: n
	};
}
function Ui(e, t) {
	let n = Object.entries(t).map(([e, t]) => `${e}=${typeof t == "string" ? `'${t}'` : JSON.stringify(t)}`);
	return n.length ? `~${e}(${n.join(", ")})` : `~${e}`;
}
function Wi(e) {
	let t = [];
	for (let n of e) if (typeof n == "string") t.push(n);
	else for (let [e, r] of Object.entries(n)) t.push(`${e}=${typeof r == "string" && !/[\s"'{}[\],]/.test(r) ? r : JSON.stringify(r)}`);
	return t;
}
function Gi(e) {
	let t = Ki(e), n = 5381;
	for (let e = 0; e < t.length; e++) n = (n << 5) + n + t.charCodeAt(e) | 0;
	return (n >>> 0).toString(16).padStart(8, "0");
}
function Ki(e) {
	return typeof e != "object" || !e ? JSON.stringify(e) ?? "null" : Array.isArray(e) ? `[${e.map(Ki).join(",")}]` : `{${Object.keys(e).sort().map((t) => `${JSON.stringify(t)}:${Ki(e[t])}`).join(",")}}`;
}
// src/fields/util.ts
function qi(e) {
	switch (e.kind) {
		case "str": return "";
		case "int":
		case "float": return 0;
		case "bool": return !1;
		case "enum": return e.options[0] ?? "";
		case "optional": return null;
		case "list": return [];
		case "object": return Object.fromEntries((e.fields ?? []).map((e) => [e.key, e.default ?? qi(e.type)]));
		default: return null;
	}
}
function Ji(e) {
	switch (e.kind) {
		case "str": return "str";
		case "int": return "int";
		case "float": return "float";
		case "bool": return "bool";
		case "enum": return "Literal[…]";
		case "optional": return `${Ji(e.inner)} | None`;
		case "list": return `list[${Ji(e.item)}]`;
		case "object": return "dict";
		default: return e.annotation ?? "?";
	}
}
function Yi(e, t) {
	return JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
}
function Xi(e) {
	return e == null ? "null" : Array.isArray(e) ? `${e.length} item${e.length === 1 ? "" : "s"}` : typeof e == "object" ? `{ ${Object.keys(e).length} }` : String(e);
}
// src/fields/ObjectField.svelte
var Zi = /* @__PURE__ */ H("<div class=\"row svelte-yl9j08\"><span class=\"key mono svelte-yl9j08\"> </span> <!> <span class=\"cap mono svelte-yl9j08\"> </span></div>"), Qi = /* @__PURE__ */ H("<input class=\"raw mono svelte-yl9j08\" type=\"text\"/>"), $i = /* @__PURE__ */ H("<div class=\"body svelte-yl9j08\"><!></div>"), ea = /* @__PURE__ */ H("<div><button class=\"head svelte-yl9j08\"><span class=\"disc svelte-yl9j08\"> </span> <span class=\"meta mono svelte-yl9j08\"> </span></button> <!></div>");
function ta(e, t) {
	Ge(t, !0);
	let n = ji(t, "disabled", 3, !1), r = ji(t, "depth", 3, 0), i = /* @__PURE__ */ j(r() > 0), a = /* @__PURE__ */ k(() => t.value ?? {});
	function o(e, n) {
		t.onChange({
			...B(a),
			[e]: n
		});
	}
	let s = /* @__PURE__ */ j(""), c = /* @__PURE__ */ j(!1);
	yn(() => {
		B(c) || M(s, JSON.stringify(B(a), null, 1).replace(/\n\s*/g, " "), !0);
	});
	function l(e) {
		M(s, e, !0), M(c, !0);
		try {
			let n = JSON.parse(e);
			n && typeof n == "object" && !Array.isArray(n) && (t.onChange(n), M(c, !1));
		} catch {}
	}
	var u = ea();
	let d;
	var f = N(u), p = N(f), m = F(p, !0), h = F(I(p, 2));
	O(f);
	var g = I(f, 2), _ = (e) => {
		var i = $i(), c = N(i), u = (e) => {
			var i = Dr();
			Hr(P(i), 17, () => t.type.fields, (e) => e.key, (e, t) => {
				var i = Zi(), s = N(i), c = F(s, !0), l = I(s, 2);
				{
					let e = /* @__PURE__ */ k(() => B(a)[B(t).key] ?? B(t).default ?? qi(B(t).type)), i = /* @__PURE__ */ k(() => r() + 1);
					ga(l, {
						get type() {
							return B(t).type;
						},
						get value() {
							return B(e);
						},
						onChange: (e) => o(B(t).key, e),
						get disabled() {
							return n();
						},
						get depth() {
							return B(i);
						}
					});
				}
				var u = F(I(l, 2), !0);
				O(i), L((e) => {
					bi(s, "title", B(t).doc), W(c, B(t).key), W(u, e);
				}, [() => Ji(B(t).type)]), U(e, i);
			}), U(e, i);
		}, d = (e) => {
			var t = Qi();
			vi(t), L(() => {
				yi(t, B(s)), t.disabled = n();
			}), V("input", t, (e) => l(e.currentTarget.value)), U(e, t);
		};
		G(c, (e) => {
			t.type.fields?.length ? e(u) : e(d, -1);
		}), O(i), U(e, i);
	};
	G(g, (e) => {
		B(i) && e(_);
	}), O(u), L((e) => {
		d = ii(u, 1, "obj svelte-yl9j08", null, d, { nested: r() > 0 }), W(m, B(i) ? "▾" : "▸"), W(h, `dict · ${e ?? ""}`);
	}, [() => Xi(B(a))]), V("click", f, () => M(i, !B(i))), U(e, u), Ke();
}
yr(["click", "input"]);
// src/fields/ListField.svelte
var na = /* @__PURE__ */ H("<button class=\"rm svelte-1im9a9p\" title=\"remove\">×</button>"), ra = /* @__PURE__ */ H("<div class=\"row svelte-1im9a9p\"><span class=\"grip svelte-1im9a9p\" title=\"reorder\"><button class=\"mv svelte-1im9a9p\" tabindex=\"-1\">▴</button> <button class=\"mv svelte-1im9a9p\" tabindex=\"-1\">▾</button></span> <span class=\"idx mono svelte-1im9a9p\"></span> <!> <!></div>"), ia = /* @__PURE__ */ H("<button class=\"add mono svelte-1im9a9p\"> </button>"), aa = /* @__PURE__ */ H("<div class=\"list svelte-1im9a9p\"><!> <!></div>");
function oa(e, t) {
	Ge(t, !0);
	let n = ji(t, "disabled", 3, !1), r = ji(t, "depth", 3, 0), i = /* @__PURE__ */ k(() => Array.isArray(t.value) ? t.value : []), a = /* @__PURE__ */ k(() => t.type.item.kind === "object" ? t.type.item.fields ?? [] : null);
	function o(e, n) {
		t.onChange(B(i).map((t, r) => r === e ? n : t));
	}
	function s(e, t, n) {
		o(e, {
			...B(i)[e] ?? {},
			[t]: n
		});
	}
	function c(e) {
		t.onChange(B(i).filter((t, n) => n !== e));
	}
	function l() {
		t.onChange([...B(i), qi(t.type.item)]);
	}
	function u(e, n) {
		let r = e + n;
		if (r < 0 || r >= B(i).length) return;
		let a = [...B(i)];
		[a[e], a[r]] = [a[r], a[e]], t.onChange(a);
	}
	var d = aa(), f = N(d);
	Hr(f, 17, () => B(i), Rr, (e, i, l) => {
		var d = ra(), f = N(d), p = N(f), m = I(p, 2);
		O(f);
		var h = I(f, 2);
		h.textContent = l;
		var g = I(h, 2), _ = (e) => {
			var t = Dr();
			Hr(P(t), 17, () => B(a), (e) => e.key, (e, t) => {
				{
					let a = /* @__PURE__ */ k(() => B(i)?.[B(t).key] ?? B(t).default ?? qi(B(t).type)), o = /* @__PURE__ */ k(() => r() + 1);
					ga(e, {
						get type() {
							return B(t).type;
						},
						get value() {
							return B(a);
						},
						onChange: (e) => s(l, B(t).key, e),
						get disabled() {
							return n();
						},
						get depth() {
							return B(o);
						}
					});
				}
			}), U(e, t);
		}, v = (e) => {
			{
				let a = /* @__PURE__ */ k(() => r() + 1);
				ga(e, {
					get type() {
						return t.type.item;
					},
					get value() {
						return B(i);
					},
					onChange: (e) => o(l, e),
					get disabled() {
						return n();
					},
					get depth() {
						return B(a);
					}
				});
			}
		};
		G(g, (e) => {
			B(a)?.length ? e(_) : e(v, -1);
		});
		var y = I(g, 2), b = (e) => {
			var t = na();
			V("click", t, () => c(l)), U(e, t);
		};
		G(y, (e) => {
			n() || e(b);
		}), O(d), L(() => {
			p.disabled = n(), m.disabled = n();
		}), V("click", p, () => u(l, -1)), V("click", m, () => u(l, 1)), U(e, d);
	});
	var p = I(f, 2), m = (e) => {
		var n = ia(), r = F(n);
		L((e) => W(r, `+ add ${e ?? ""}`), [() => Ji(t.type.item)]), V("click", n, l), U(e, n);
	};
	G(p, (e) => {
		n() || e(m);
	}), O(d), U(e, d), Ke();
}
yr(["click"]);
// src/fields/FieldRenderer.svelte
var sa = /* @__PURE__ */ H("<input class=\"fr-input mono svelte-10okn7m\" type=\"text\"/>"), ca = /* @__PURE__ */ H("<span class=\"fr-bounds mono svelte-10okn7m\"> </span>"), la = /* @__PURE__ */ H("<span><button class=\"fr-step svelte-10okn7m\" tabindex=\"-1\">−</button> <input class=\"fr-num mono svelte-10okn7m\" type=\"number\"/> <button class=\"fr-step svelte-10okn7m\" tabindex=\"-1\">+</button></span> <!>", 1), ua = /* @__PURE__ */ H("<button role=\"switch\" aria-label=\"Toggle value\"><span class=\"fr-knob svelte-10okn7m\"></span></button> <span class=\"fr-boolval svelte-10okn7m\"> </span>", 1), da = /* @__PURE__ */ H("<button> </button>"), fa = /* @__PURE__ */ H("<span></span>"), pa = /* @__PURE__ */ H("<span class=\"fr-none mono svelte-10okn7m\">None</span> <button class=\"fr-set mono svelte-10okn7m\">set value</button>", 1), ma = /* @__PURE__ */ H("<!> <button class=\"fr-clear mono svelte-10okn7m\" title=\"reset to None\">×</button>", 1), ha = /* @__PURE__ */ H("<input class=\"fr-input fr-raw mono svelte-10okn7m\" type=\"text\"/>");
function ga(e, t) {
	Ge(t, !0);
	let n = ji(t, "disabled", 3, !1), r = ji(t, "depth", 3, 0), i = /* @__PURE__ */ k(() => {
		if (t.constraints?.ge !== void 0) return t.constraints.ge;
		if (t.constraints?.gt !== void 0) return t.constraints.gt + +(t.type.kind === "int");
	}), a = /* @__PURE__ */ k(() => {
		if (t.constraints?.le !== void 0) return t.constraints.le;
		if (t.constraints?.lt !== void 0) return t.constraints.lt - +(t.type.kind === "int");
	}), o = /* @__PURE__ */ k(() => B(i) !== void 0 || B(a) !== void 0 ? `${B(i) ?? "−∞"} … ${B(a) ?? "∞"}` : void 0);
	function s() {
		if (t.type.kind === "int") return 1;
		let e = Math.abs(Number(t.value) || 0);
		if (e === 0) return .1;
		let n = 10 ** Math.floor(Math.log10(e));
		return n / 10 >= .001 ? n / 10 : .001;
	}
	function c(e) {
		let n = s(), r = (Number(t.value) || 0) + e * n;
		t.onChange(t.type.kind === "int" ? Math.round(r) : Number(r.toPrecision(12)));
	}
	function l(e) {
		let n = e.currentTarget.value;
		n !== "" && t.onChange(t.type.kind === "int" ? Math.round(Number(n)) : Number(n));
	}
	let u = /* @__PURE__ */ j(""), d = /* @__PURE__ */ j(!1);
	yn(() => {
		B(d) || M(u, t.value === void 0 ? "null" : JSON.stringify(t.value), !0);
	});
	function f(e) {
		M(u, e, !0), M(d, !0);
		try {
			t.onChange(JSON.parse(e)), M(d, !1);
		} catch {}
	}
	var p = Dr(), m = P(p), h = (e) => {
		var r = sa();
		vi(r), L((e) => {
			yi(r, e), r.disabled = n(), bi(r, "minlength", t.constraints?.minLength), bi(r, "maxlength", t.constraints?.maxLength), bi(r, "pattern", t.constraints?.pattern), bi(r, "title", t.constraints?.pattern ? `must match ${t.constraints.pattern}` : void 0);
		}, [() => String(t.value ?? "")]), V("input", r, (e) => t.onChange(e.currentTarget.value)), U(e, r);
	}, g = (e) => {
		var r = la(), s = P(r);
		let u;
		var d = N(s), f = I(d, 2);
		vi(f);
		var p = I(f, 2);
		O(s);
		var m = I(s, 2), h = (e) => {
			var t = ca(), n = F(t, !0);
			L(() => W(n, B(o))), U(e, t);
		};
		G(m, (e) => {
			B(o) && e(h);
		}), L(() => {
			u = ii(s, 1, "fr-stepper svelte-10okn7m", null, u, { disabled: n() }), d.disabled = n(), yi(f, t.value ?? ""), f.disabled = n(), bi(f, "min", B(i)), bi(f, "max", B(a)), bi(f, "step", t.constraints?.multipleOf), bi(f, "title", B(o)), p.disabled = n();
		}), V("click", d, () => c(-1)), V("input", f, l), V("click", p, () => c(1)), U(e, r);
	}, _ = (e) => {
		var r = ua(), i = P(r);
		let a;
		var o = F(I(i, 2), !0);
		L(() => {
			a = ii(i, 1, "fr-toggle svelte-10okn7m", null, a, { on: !!t.value }), i.disabled = n(), bi(i, "aria-checked", !!t.value), W(o, t.value ? "true" : "false");
		}), V("click", i, () => t.onChange(!t.value)), U(e, r);
	}, v = (e) => {
		var r = fa();
		let i;
		Hr(r, 20, () => t.type.options, (e) => e, (e, r) => {
			var i = da();
			let a;
			var o = F(i, !0);
			L(() => {
				a = ii(i, 1, "fr-opt svelte-10okn7m", null, a, { on: t.value === r }), i.disabled = n(), W(o, r);
			}), V("click", i, () => t.onChange(r)), U(e, i);
		}), O(r), L(() => i = ii(r, 1, "fr-seg svelte-10okn7m", null, i, { disabled: n() })), U(e, r);
	}, y = (e) => {
		var i = Dr(), a = P(i), o = (e) => {
			var r = pa(), i = I(P(r), 2);
			L(() => i.disabled = n()), V("click", i, () => t.onChange(qi(t.type.inner))), U(e, r);
		}, s = (e) => {
			var i = ma(), a = P(i);
			ga(a, {
				get type() {
					return t.type.inner;
				},
				get value() {
					return t.value;
				},
				get onChange() {
					return t.onChange;
				},
				get disabled() {
					return n();
				},
				get depth() {
					return r();
				}
			});
			var o = I(a, 2);
			L(() => o.disabled = n()), V("click", o, () => t.onChange(null)), U(e, i);
		};
		G(a, (e) => {
			t.value === null || t.value === void 0 ? e(o) : e(s, -1);
		}), U(e, i);
	}, b = (e) => {
		ta(e, {
			get type() {
				return t.type;
			},
			get value() {
				return t.value;
			},
			get onChange() {
				return t.onChange;
			},
			get disabled() {
				return n();
			},
			get depth() {
				return r();
			}
		});
	}, x = (e) => {
		oa(e, {
			get type() {
				return t.type;
			},
			get value() {
				return t.value;
			},
			get onChange() {
				return t.onChange;
			},
			get disabled() {
				return n();
			},
			get depth() {
				return r();
			}
		});
	}, S = (e) => {
		var r = ha();
		vi(r), L((e) => {
			yi(r, B(u)), r.disabled = n(), bi(r, "title", e);
		}, [() => t.type.kind === "unknown" ? t.type.annotation ?? "no schema" : Ji(t.type)]), V("input", r, (e) => f(e.currentTarget.value)), U(e, r);
	};
	G(m, (e) => {
		t.type.kind === "str" ? e(h) : t.type.kind === "int" || t.type.kind === "float" ? e(g, 1) : t.type.kind === "bool" ? e(_, 2) : t.type.kind === "enum" ? e(v, 3) : t.type.kind === "optional" ? e(y, 4) : t.type.kind === "object" ? e(b, 5) : t.type.kind === "list" ? e(x, 6) : e(S, -1);
	}), U(e, p), Ke();
}
yr(["input", "click"]);
// src/VersionEditor.svelte
var _a = /* @__PURE__ */ H("<button class=\"esrc mono svelte-10ggm8s\">&lt;/&gt;</button>"), va = /* @__PURE__ */ H("<span class=\"ktype mono svelte-10ggm8s\"> </span>"), ya = /* @__PURE__ */ H("<div class=\"krow svelte-10ggm8s\"><span class=\"kname mono svelte-10ggm8s\"> </span> <!> <!> <button class=\"krm svelte-10ggm8s\" title=\"remove key\">×</button></div>"), ba = /* @__PURE__ */ H("<div class=\"kempty mono svelte-10ggm8s\">empty — add a field below</div>"), xa = /* @__PURE__ */ H("<button class=\"kfield mono svelte-10ggm8s\"> </button>"), Sa = /* @__PURE__ */ H("<!> <div class=\"kadd svelte-10ggm8s\"><!> <input class=\"kfree mono svelte-10ggm8s\" placeholder=\"custom.key\"/></div>", 1), Ca = /* @__PURE__ */ H("<div class=\"tdoc svelte-10ggm8s\"> </div>"), wa = /* @__PURE__ */ H("<div class=\"krow svelte-10ggm8s\"><span class=\"kname mono svelte-10ggm8s\"> </span> <!> <!></div>"), Ta = /* @__PURE__ */ H("<div class=\"kempty mono svelte-10ggm8s\">no arguments</div>"), Ea = /* @__PURE__ */ H("<!> <!>", 1), Da = /* @__PURE__ */ H("<div class=\"ebody svelte-10ggm8s\"><!></div>"), Oa = /* @__PURE__ */ H("<div><div class=\"ehead svelte-10ggm8s\"><button class=\"etoggle svelte-10ggm8s\"><span class=\"eno mono svelte-10ggm8s\"></span> <span> </span></button> <span class=\"espacer svelte-10ggm8s\"></span> <!> <span class=\"emv svelte-10ggm8s\"><button class=\"mv svelte-10ggm8s\" title=\"move up\">▴</button> <button class=\"mv svelte-10ggm8s\" title=\"move down\">▾</button></span> <button class=\"erm svelte-10ggm8s\" title=\"remove\">×</button></div> <!></div>"), ka = /* @__PURE__ */ H("<div class=\"kempty mono svelte-10ggm8s\">defaults — add overrides or a ~version</div>"), Aa = /* @__PURE__ */ H("<button class=\"add mono svelte-10ggm8s\">+ ~version</button>"), ja = /* @__PURE__ */ H("<span class=\"vdoc svelte-10ggm8s\"> </span>"), Ma = /* @__PURE__ */ H("<button class=\"vrow svelte-10ggm8s\"><span class=\"vname mono svelte-10ggm8s\"> </span> <!></button>"), Na = /* @__PURE__ */ H("<div class=\"vocab svelte-10ggm8s\"></div>"), Pa = /* @__PURE__ */ H("<div class=\"overlay svelte-10ggm8s\"><div class=\"modal svelte-10ggm8s\" role=\"dialog\" aria-label=\"version editor\"><div class=\"mhead svelte-10ggm8s\"><span class=\"mtitle mono svelte-10ggm8s\"> </span> <span class=\"mspacer svelte-10ggm8s\"></span> <button class=\"mclose svelte-10ggm8s\" title=\"cancel\">×</button></div> <div class=\"mbody svelte-10ggm8s\"><!> <div class=\"addbar svelte-10ggm8s\"><button class=\"add mono svelte-10ggm8s\"></button> <!></div> <!></div> <div class=\"mfoot svelte-10ggm8s\"><span class=\"mprev mono svelte-10ggm8s\" title=\"the compact version, as the CLI writes it\"> </span> <span class=\"mspacer svelte-10ggm8s\"></span> <button class=\"btn svelte-10ggm8s\">Cancel</button> <button class=\"btn primary svelte-10ggm8s\">Apply</button></div></div></div>");
function Fa(e, t) {
	Ge(t, !0);
	let n = /* @__PURE__ */ j(Xt(Bi(t.version))), r = /* @__PURE__ */ j(Xt(B(n).length ? 0 : null)), i = /* @__PURE__ */ j(!1), a = /* @__PURE__ */ j(""), o = (e) => t.schema.versionMethods.find((t) => t.name === e), s = (e) => t.schema.fields.find((t) => t.key === e);
	function c(e, t) {
		let n = o(e);
		return Object.fromEntries(Object.entries(t).filter(([e, t]) => {
			let r = n?.params.find((t) => t.name === e);
			return r === void 0 || !Yi(t, r.default);
		}));
	}
	let l = /* @__PURE__ */ k(() => Vi(B(n), c));
	function u(e) {
		if (e.kind === "token") {
			let t = c(e.name, e.args), n = Object.entries(t).map(([e, t]) => `${e}=${typeof t == "string" ? t : JSON.stringify(t)}`);
			return `~${e.name}${n.length ? `(${n.join(", ")})` : ""}`;
		}
		let t = Object.keys(e.value);
		return t.length ? `{ ${t.join(", ")} }` : "{ }";
	}
	function d(e, t) {
		let i = e + t;
		if (i < 0 || i >= B(n).length) return;
		let a = [...B(n)];
		[a[e], a[i]] = [a[i], a[e]], M(n, a, !0), B(r) === e ? M(r, i) : B(r) === i && M(r, e, !0);
	}
	function f(e) {
		M(n, B(n).filter((t, n) => n !== e), !0), B(r) === e ? M(r, null) : B(r) !== null && B(r) > e && M(r, B(r) - 1);
	}
	function p() {
		M(n, [...B(n), {
			kind: "dict",
			value: {}
		}], !0), M(r, B(n).length - 1);
	}
	function m(e) {
		let t = o(e), a = Object.fromEntries((t?.params ?? []).filter((e) => e.default !== void 0).map((e) => [e.name, e.default]));
		M(n, [...B(n), {
			kind: "token",
			name: e,
			args: a
		}], !0), M(i, !1), M(r, B(n).length - 1);
	}
	function h(e, t, r) {
		M(n, B(n).map((n, i) => i === e && n.kind === "dict" ? {
			kind: "dict",
			value: {
				...n.value,
				[t]: r
			}
		} : n), !0);
	}
	function g(e, t) {
		M(n, B(n).map((n, r) => {
			if (r !== e || n.kind !== "dict") return n;
			let { [t]: i, ...a } = n.value;
			return {
				kind: "dict",
				value: a
			};
		}), !0);
	}
	function _(e, t) {
		let n = s(t);
		h(e, t, n ? n.default ?? qi(n.type) : "");
	}
	function v(e) {
		let t = B(a).trim();
		t && (h(e, t, ""), M(a, ""));
	}
	function y(e) {
		return t.schema.fields.filter((t) => !(t.key in e.value));
	}
	function b(e, t, r) {
		M(n, B(n).map((n, i) => i === e && n.kind === "token" ? {
			kind: "token",
			name: n.name,
			args: {
				...n.args,
				[t]: r
			}
		} : n), !0);
	}
	let x = /* @__PURE__ */ k(() => B(l).map((e) => typeof e == "string" ? e : Object.entries(e).map(([e, t]) => `${e}=${typeof t == "string" ? t : JSON.stringify(t)}`).join(" ")).join(" ") || "defaults");
	var S = Pa(), C = N(S), w = N(C), ee = N(w), te = F(ee), ne = I(ee, 4);
	O(w);
	var T = I(w, 2), re = N(T);
	Hr(re, 17, () => B(n), Rr, (e, n, i) => {
		var c = Oa();
		let l;
		var p = N(c), m = N(p), x = N(m);
		x.textContent = i + 1;
		var S = I(x, 2);
		let C;
		var w = F(S, !0);
		O(m);
		var ee = I(m, 4), te = (e) => {
			var r = _a();
			V("click", r, () => t.onViewSource(o(B(n).name).sourceRef)), U(e, r);
		}, ne = /* @__PURE__ */ k(() => B(n).kind === "token" && o(B(n).name)?.sourceRef && t.onViewSource);
		G(ee, (e) => {
			B(ne) && e(te);
		});
		var T = I(ee, 2), re = N(T), ie = I(re, 2);
		O(T);
		var ae = I(T, 2);
		O(p);
		var oe = I(p, 2), se = (e) => {
			var t = Da(), r = N(t), c = (e) => {
				var t = Sa(), r = P(t);
				Hr(r, 16, () => Object.keys(B(n).value), (e) => e, (e, t) => {
					let r = /* @__PURE__ */ k(() => s(t));
					var a = ya(), o = N(a), c = F(o, !0), l = I(o, 2);
					{
						let e = /* @__PURE__ */ k(() => B(r)?.type ?? { kind: "unknown" }), a = /* @__PURE__ */ k(() => B(r)?.constraints);
						ga(l, {
							get type() {
								return B(e);
							},
							get value() {
								return B(n).value[t];
							},
							get constraints() {
								return B(a);
							},
							onChange: (e) => h(i, t, e)
						});
					}
					var u = I(l, 2), d = (e) => {
						var t = va(), n = F(t, !0);
						L((e) => {
							bi(t, "title", B(r).doc), W(n, e);
						}, [() => Ji(B(r).type)]), U(e, t);
					};
					G(u, (e) => {
						B(r) && e(d);
					});
					var f = I(u, 2);
					O(a), L(() => W(c, t)), V("click", f, () => g(i, t)), U(e, a);
				}, (e) => {
					U(e, ba());
				});
				var o = I(r, 2), c = N(o);
				Hr(c, 17, () => y(B(n)), (e) => e.key, (e, t) => {
					var n = xa(), r = F(n);
					L(() => W(r, `+ ${B(t).key ?? ""}`)), V("click", n, () => _(i, B(t).key)), U(e, n);
				});
				var l = I(c, 2);
				vi(l), O(o), V("keydown", l, (e) => e.key === "Enter" && v(i)), wi(l, () => B(a), (e) => M(a, e)), U(e, t);
			}, l = (e) => {
				let t = /* @__PURE__ */ k(() => o(B(n).name));
				var r = Ea(), a = P(r), s = (e) => {
					var n = Ca(), r = F(n, !0);
					L(() => W(r, B(t).doc)), U(e, n);
				};
				G(a, (e) => {
					B(t)?.doc && e(s);
				}), Hr(I(a, 2), 17, () => B(t)?.params ?? [], (e) => e.name, (e, t) => {
					var r = wa(), a = N(r), o = F(a, !0), s = I(a, 2);
					{
						let e = /* @__PURE__ */ k(() => B(t).type ?? { kind: "unknown" }), r = /* @__PURE__ */ k(() => B(n).args[B(t).name] ?? B(t).default ?? null);
						ga(s, {
							get type() {
								return B(e);
							},
							get value() {
								return B(r);
							},
							onChange: (e) => b(i, B(t).name, e)
						});
					}
					var c = I(s, 2), l = (e) => {
						var n = va(), r = F(n);
						L((e) => W(r, `def ${e ?? ""}`), [() => JSON.stringify(B(t).default)]), U(e, n);
					};
					G(c, (e) => {
						B(t).default !== void 0 && e(l);
					}), O(r), L(() => W(o, B(t).name)), U(e, r);
				}, (e) => {
					U(e, Ta());
				}), U(e, r);
			};
			G(r, (e) => {
				B(n).kind === "dict" ? e(c) : e(l, -1);
			}), O(t), U(e, t);
		};
		G(oe, (e) => {
			B(r) === i && e(se);
		}), O(c), L((e) => {
			l = ii(c, 1, "elem svelte-10ggm8s", null, l, { openel: B(r) === i }), C = ii(S, 1, "echip mono svelte-10ggm8s", null, C, { dict: B(n).kind === "dict" }), W(w, e);
		}, [() => u(B(n))]), V("click", m, () => M(r, B(r) === i ? null : i, !0)), V("click", re, () => d(i, -1)), V("click", ie, () => d(i, 1)), V("click", ae, () => f(i)), U(e, c);
	}, (e) => {
		U(e, ka());
	});
	var ie = I(re, 2), ae = N(ie);
	ae.textContent = "+ overrides {}";
	var oe = I(ae, 2), se = (e) => {
		var t = Aa();
		V("click", t, () => M(i, !B(i))), U(e, t);
	};
	G(oe, (e) => {
		t.schema.versionMethods.length && e(se);
	}), O(ie);
	var ce = I(ie, 2), le = (e) => {
		var n = Na();
		Hr(n, 21, () => t.schema.versionMethods, (e) => e.name, (e, t) => {
			var n = Ma(), r = N(n), i = F(r), a = I(r, 2), o = (e) => {
				var n = ja(), r = F(n, !0);
				L((e) => W(r, e), [() => B(t).doc.split("\n")[0]]), U(e, n);
			};
			G(a, (e) => {
				B(t).doc && e(o);
			}), O(n), L(() => W(i, `~${B(t).name ?? ""}`)), V("click", n, () => m(B(t).name)), U(e, n);
		}), O(n), U(e, n);
	};
	G(ce, (e) => {
		B(i) && e(le);
	}), O(T);
	var ue = I(T, 2), de = N(ue), fe = F(de, !0), pe = I(de, 4), me = I(pe, 2);
	O(ue), O(C), O(S), L(() => {
		W(te, `version · ${t.schema.module ?? ""}`), W(fe, B(x));
	}), V("click", S, function(...e) {
		t.onCancel?.apply(this, e);
	}), V("click", C, (e) => e.stopPropagation()), V("click", ne, function(...e) {
		t.onCancel?.apply(this, e);
	}), V("click", ae, p), V("click", pe, function(...e) {
		t.onCancel?.apply(this, e);
	}), V("click", me, () => t.onApply(B(l))), U(e, S), Ke();
}
yr(["click", "keydown"]);
// src/ConfigPicker.svelte
var Ia = /* @__PURE__ */ H("<div class=\"skl svelte-8pl3d7\"><div class=\"skl-line svelte-8pl3d7\" style=\"width: 55%\"></div> <div class=\"skl-box svelte-8pl3d7\"></div> <div class=\"skl-box svelte-8pl3d7\" style=\"animation-delay: 0.15s\"></div></div>"), La = /* @__PURE__ */ H("<span> </span>"), Ra = /* @__PURE__ */ H("<span class=\"defaults mono svelte-8pl3d7\">defaults</span>"), za = /* @__PURE__ */ H("<button class=\"edit mono svelte-8pl3d7\">✎ edit</button>"), Ba = /* @__PURE__ */ H("<div class=\"doc svelte-8pl3d7\"> </div>"), Va = /* @__PURE__ */ H("<span class=\"mdot svelte-8pl3d7\" title=\"changed from default\"></span>"), Ha = /* @__PURE__ */ H("<div class=\"ierr mono svelte-8pl3d7\"> </div>"), Ua = /* @__PURE__ */ H("<div><div class=\"slothead svelte-8pl3d7\"><span class=\"key mono svelte-8pl3d7\"> </span> <!></div> <!> <!></div>"), Wa = /* @__PURE__ */ H("<div><span class=\"key mono svelte-8pl3d7\"> </span> <span> </span> <span class=\"cap2 mono svelte-8pl3d7\"> </span> <!></div> <!>", 1), Ga = /* @__PURE__ */ H("<div class=\"frow svelte-8pl3d7\"><span class=\"key mono svelte-8pl3d7\"> </span> <span class=\"val mono svelte-8pl3d7\"> </span></div>"), Ka = /* @__PURE__ */ H("<div class=\"empty mono svelte-8pl3d7\">no configurable fields — runs as-is</div>"), qa = /* @__PURE__ */ H("<div class=\"vrow svelte-8pl3d7\"><!> <!></div> <!> <div class=\"fields svelte-8pl3d7\"><!> <!> <!></div> <!>", 1), Ja = /* @__PURE__ */ H("<div class=\"cfg svelte-8pl3d7\"><!></div>");
function Ya(e, t) {
	Ge(t, !0);
	let n = ji(t, "version", 19, () => []), r = ji(t, "issues", 19, () => []), i = ji(t, "disabled", 3, !1), a = /* @__PURE__ */ j(null), o = /* @__PURE__ */ j(Xt([])), s = /* @__PURE__ */ j(Xt({})), c = /* @__PURE__ */ j(!1);
	yn(() => {
		t.module;
		let e = dr(() => n()), r = !1;
		return t.adapter.introspect(t.module).then((n) => {
			r || (M(a, n, !0), M(o, e, !0), t.onVersion?.(e));
		}), () => r = !0;
	}), yn(() => {
		JSON.stringify(B(o)), t.module;
		let e = !1, n = setTimeout(() => {
			t.adapter.resolve(t.module, B(o)).then((n) => {
				!e && n.ok && (M(s, n.config, !0), t.onValues?.({ ...n.config }));
			});
		}, 150);
		return () => {
			e = !0, clearTimeout(n);
		};
	});
	function l(e) {
		M(c, !1), M(o, e, !0), t.onVersion?.(e);
	}
	function u(e, t) {
		let n = Bi(B(o)), r = [...n].reverse().find((e) => e.kind === "dict");
		r && r.kind === "dict" ? r.value[e] = t : n.push({
			kind: "dict",
			value: { [e]: t }
		}), l(Vi(n));
	}
	let d = /* @__PURE__ */ k(() => new Set((B(a)?.fields ?? []).filter((e) => !Yi(B(s)[e.key], e.default ?? qi(e.type))).map((e) => e.key))), f = /* @__PURE__ */ k(() => Bi(B(o))), p = /* @__PURE__ */ k(() => {
		let e = new Set((B(a)?.fields ?? []).map((e) => e.key));
		return Object.keys(B(s)).filter((t) => !e.has(t) && !t.startsWith("_"));
	});
	function m(e) {
		return e == null ? "None" : typeof e == "string" ? e === "" ? "\"\"" : e : JSON.stringify(e);
	}
	function h(e) {
		return r().find((t) => t.path === e || t.path?.startsWith(e + "."));
	}
	var g = Ja(), _ = N(g), v = (e) => {
		U(e, Ia());
	}, y = (e) => {
		var n = qa(), r = P(n), g = N(r);
		Hr(g, 17, () => B(f), Rr, (e, t) => {
			var n = La();
			let r;
			var i = F(n, !0);
			L((e) => {
				r = ii(n, 1, "chip mono svelte-8pl3d7", null, r, { dict: B(t).kind === "dict" }), W(i, e);
			}, [() => B(t).kind === "dict" ? `{ ${Object.keys(B(t).value).join(", ")} }` : `~${B(t).name}`]), U(e, n);
		}, (e) => {
			U(e, Ra());
		});
		var _ = I(g, 2), v = (e) => {
			var t = za();
			V("click", t, () => M(c, !0)), U(e, t);
		};
		G(_, (e) => {
			i() || e(v);
		}), O(r);
		var y = I(r, 2), b = (e) => {
			var t = Ba(), n = F(t, !0);
			L((e) => W(n, e), [() => B(a).doc.split("\n\n")[0]]), U(e, t);
		};
		G(y, (e) => {
			B(a).doc && e(b);
		});
		var x = I(y, 2), S = N(x);
		Hr(S, 17, () => B(a).fields, (e) => e.key, (e, n) => {
			let r = /* @__PURE__ */ k(() => B(n).slot ?? B(n).key), a = /* @__PURE__ */ k(() => t.adapter.slots?.fields?.[B(r)]), o = /* @__PURE__ */ k(() => h(B(n).key));
			var c = Dr(), l = P(c), f = (e) => {
				var t = Ua();
				let r;
				var c = N(t), l = N(c), f = F(l, !0), p = I(l, 2), m = (e) => {
					U(e, Va());
				}, h = /* @__PURE__ */ k(() => B(d).has(B(n).key));
				G(p, (e) => {
					B(h) && e(m);
				}), O(c);
				var g = I(c, 2);
				{
					let e = /* @__PURE__ */ k(() => B(s)[B(n).key] ?? B(n).default ?? qi(B(n).type));
					Yr(g, () => B(a), (t, r) => {
						r(t, {
							get value() {
								return B(e);
							},
							onChange: (e) => u(B(n).key, e),
							get disabled() {
								return i();
							},
							get config() {
								return B(s);
							}
						});
					});
				}
				var _ = I(g, 2), v = (e) => {
					var t = Ha(), n = F(t, !0);
					L(() => W(n, B(o).message)), U(e, t);
				};
				G(_, (e) => {
					B(o) && e(v);
				}), O(t), L(() => {
					r = ii(t, 1, "slotcard svelte-8pl3d7", null, r, { bad: !!B(o) }), bi(l, "title", B(n).doc), W(f, B(n).key);
				}), U(e, t);
			}, p = (e) => {
				var t = Wa(), r = P(t);
				let i;
				var a = N(r), c = F(a, !0), l = I(a, 2);
				let u;
				var f = F(l, !0), p = I(l, 2), h = F(p, !0), g = I(p, 2), _ = (e) => {
					U(e, Va());
				}, v = /* @__PURE__ */ k(() => B(d).has(B(n).key));
				G(g, (e) => {
					B(v) && e(_);
				}), O(r);
				var y = I(r, 2), b = (e) => {
					var t = Ha(), n = F(t, !0);
					L(() => W(n, B(o).message)), U(e, t);
				};
				G(y, (e) => {
					B(o) && e(b);
				}), L((e, t, s) => {
					i = ii(r, 1, "frow svelte-8pl3d7", null, i, { bad: !!B(o) }), bi(a, "title", B(n).doc), W(c, B(n).key), u = ii(l, 1, "val mono svelte-8pl3d7", null, u, { isdef: e }), W(f, t), W(h, s);
				}, [
					() => !B(d).has(B(n).key),
					() => m(B(s)[B(n).key] ?? B(n).default ?? qi(B(n).type)),
					() => Ji(B(n).type)
				]), U(e, t);
			};
			G(l, (e) => {
				B(a) ? e(f) : e(p, -1);
			}), U(e, c);
		});
		var C = I(S, 2);
		Hr(C, 16, () => B(p), (e) => e, (e, t) => {
			var n = Ga(), r = N(n), i = F(r, !0), a = F(I(r, 2), !0);
			O(n), L((e) => {
				W(i, t), W(a, e);
			}, [() => m(B(s)[t])]), U(e, n);
		});
		var w = I(C, 2), ee = (e) => {
			U(e, Ka());
		};
		G(w, (e) => {
			!B(a).fields.length && !B(p).length && e(ee);
		}), O(x);
		var te = I(x, 2), ne = (e) => {
			Fa(e, {
				get schema() {
					return B(a);
				},
				get version() {
					return B(o);
				},
				onApply: l,
				onCancel: () => M(c, !1),
				get onViewSource() {
					return t.onViewSource;
				}
			});
		};
		G(te, (e) => {
			B(c) && e(ne);
		}), U(e, n);
	};
	G(_, (e) => {
		B(a) ? e(y, -1) : e(v);
	}), O(g), U(e, g), Ke();
}
yr(["click"]);
// src/ContextStack.svelte
var Xa = /* @__PURE__ */ H("<button class=\"lact mono svelte-94r51u\" title=\"reset — a fresh run instance\">↺ new run</button>"), Za = /* @__PURE__ */ H("<span class=\"lmv svelte-94r51u\"><button class=\"mv svelte-94r51u\" title=\"move up\">▴</button> <button class=\"mv svelte-94r51u\" title=\"move down\">▾</button></span> <button class=\"lrm svelte-94r51u\" title=\"remove\">×</button>", 1), Qa = /* @__PURE__ */ H("<div class=\"lbody svelte-94r51u\"><!></div>"), $a = /* @__PURE__ */ H("<div role=\"group\"><div class=\"lhead svelte-94r51u\"><button class=\"ltoggle svelte-94r51u\"><span class=\"lno mono svelte-94r51u\"> </span> <span class=\"lname mono svelte-94r51u\"> </span> <span class=\"lsum mono svelte-94r51u\"> </span></button> <span class=\"lspacer svelte-94r51u\"></span> <!> <button class=\"lsrc mono svelte-94r51u\" title=\"view source\">&lt;/&gt;</button> <!></div> <!></div>"), eo = /* @__PURE__ */ H("<div class=\"empty mono svelte-94r51u\" style=\"margin-left: 9px\">no context layers<br/><span class=\"emptysub svelte-94r51u\">→ runs in the ambient project</span></div>"), to = /* @__PURE__ */ H("<button class=\"mitem svelte-94r51u\"><span class=\"mname mono svelte-94r51u\"> </span> <span class=\"mhint svelte-94r51u\"> </span></button>"), no = /* @__PURE__ */ H("<button class=\"mitem svelte-94r51u\"><span class=\"mname mono svelte-94r51u\"> </span></button>"), ro = /* @__PURE__ */ H("<div class=\"msep mono svelte-94r51u\">any interface</div> <!>", 1), io = /* @__PURE__ */ H("<div class=\"menu svelte-94r51u\"><!> <!></div>"), ao = /* @__PURE__ */ H("<div class=\"addrow svelte-94r51u\"><button class=\"addbtn mono svelte-94r51u\">+ add context</button></div> <!>", 1), oo = /* @__PURE__ */ H("<div><div class=\"shead svelte-94r51u\"><span class=\"cap mono svelte-94r51u\">CONTEXT · with-stack</span> <span class=\"hint mono svelte-94r51u\">LIFO — enter top→down</span></div> <div class=\"env mono svelte-94r51u\"><span class=\"envk svelte-94r51u\">env</span> <span class=\"envm svelte-94r51u\">project</span> <span class=\"envv svelte-94r51u\"> </span> <span class=\"amb svelte-94r51u\">ambient</span></div> <!> <!></div>");
function so(e, t) {
	Ge(t, !0);
	let n = ji(t, "modules", 19, () => []), r = ji(t, "disabled", 3, !1), i = ji(t, "highlightId", 3, null), a = /* @__PURE__ */ j(Xt([])), o = /* @__PURE__ */ j(!1), s = () => Math.random().toString(36).slice(2, 8);
	async function c(e) {
		M(o, !1);
		let n = "Interface", r = e.split(".").at(-1) ?? e;
		try {
			let i = await t.adapter.introspect(e);
			n = i.kind ?? n, r = i.title ?? r;
		} catch {}
		M(a, [...B(a), {
			id: s(),
			module: e,
			title: r,
			kind: n,
			version: [],
			open: !0
		}], !0);
	}
	function l(e) {
		M(a, B(a).filter((t) => t.id !== e), !0);
	}
	function u(e, t) {
		let n = e + t;
		if (n < 0 || n >= B(a).length) return;
		let r = [...B(a)];
		[r[e], r[n]] = [r[n], r[e]], M(a, r, !0);
	}
	function d(e, t) {
		let n = B(a).find((t) => t.id === e);
		n && JSON.stringify(n.version) !== JSON.stringify(t) && M(a, B(a).map((n) => n.id === e ? {
			...n,
			version: t
		} : n), !0);
	}
	function f(e) {
		M(a, B(a).map((t) => t.id === e ? {
			...t,
			open: !t.open
		} : t), !0);
	}
	function p(e) {
		M(a, B(a).map((t) => t.id === e ? {
			...t,
			id: s()
		} : t), !0);
	}
	async function m(e) {
		try {
			let n = await t.adapter.introspect(e);
			n.sourceRef && t.onViewSource?.(n.sourceRef);
		} catch {}
	}
	function h(e) {
		let t = Wi(e.version);
		return t.length ? t.join(" ") : "defaults";
	}
	let g = /* @__PURE__ */ k(() => {
		let e = [], t, n;
		for (let r of B(a)) r.kind === "Execution" && !t ? (t = {
			target: r.module,
			version: r.version
		}, n = r.id) : e.push({
			target: r.module,
			version: r.version
		});
		let r = B(a).map((e) => ({
			id: e.id,
			module: e.module,
			title: e.title,
			version: e.version
		}));
		return {
			context: e,
			execution: t,
			executionRef: n,
			chain: r
		};
	}), _ = "";
	yn(() => {
		let e = B(g), n = JSON.stringify(e);
		n !== _ && (_ = n, t.onChange?.(e));
	});
	let v = [{
		module: "machinable.execution",
		label: "Execution",
		hint: "the runner / container"
	}, {
		module: "machinable.scope",
		label: "Scope",
		hint: "predicate injection"
	}], y = /* @__PURE__ */ k(() => n().filter((e) => !e.startsWith("machinable.")));
	var b = oo();
	let x;
	var S = I(N(b), 2), C = F(I(N(S), 4), !0);
	Ee(2), O(S);
	var w = I(S, 2);
	Hr(w, 19, () => B(a), (e) => e.id, (e, n, a) => {
		var o = $a();
		let s;
		var c = N(o), g = N(c), _ = N(g), v = F(_, !0), y = I(_, 2), b = F(y, !0), x = F(I(y, 2), !0);
		O(g);
		var S = I(g, 4), C = (e) => {
			var t = Xa();
			V("click", t, () => p(B(n).id)), U(e, t);
		};
		G(S, (e) => {
			B(n).kind === "Execution" && !r() && e(C);
		});
		var w = I(S, 2), ee = I(w, 2), te = (e) => {
			var t = Za(), r = P(t), i = N(r), o = I(i, 2);
			O(r);
			var s = I(r, 2);
			V("click", i, () => u(B(a), -1)), V("click", o, () => u(B(a), 1)), V("click", s, () => l(B(n).id)), U(e, t);
		};
		G(ee, (e) => {
			r() || e(te);
		}), O(c);
		var ne = I(c, 2), T = (e) => {
			var i = Qa();
			Ya(N(i), {
				get adapter() {
					return t.adapter;
				},
				get module() {
					return B(n).module;
				},
				get version() {
					return B(n).version;
				},
				get disabled() {
					return r();
				},
				onVersion: (e) => d(B(n).id, e),
				get onViewSource() {
					return t.onViewSource;
				}
			}), O(i), U(e, i);
		};
		G(ne, (e) => {
			B(n).open && e(T);
		}), O(o), L((e, t) => {
			s = ii(o, 1, "layer svelte-94r51u", null, s, { hl: i() === B(n).id }), oi(o, `margin-left: ${e ?? ""}px`), bi(g, "title", B(n).open ? "collapse" : "expand"), W(v, B(a) + 1), W(b, B(n).title), W(x, t);
		}, [() => Math.min(B(a), 5) * 16 + 9, () => B(n).kind === "Execution" ? "execution · runner" : h(B(n))]), vr("mouseenter", o, () => t.onHighlight?.(B(n).id)), vr("mouseleave", o, () => t.onHighlight?.(null)), V("click", g, () => f(B(n).id)), V("click", w, () => m(B(n).module)), U(e, o);
	}, (e) => {
		U(e, eo());
	});
	var ee = I(w, 2), te = (e) => {
		var t = ao(), n = P(t), r = F(n), i = I(n, 2), s = (e) => {
			var t = io(), n = N(t);
			Hr(n, 17, () => v, (e) => e.module, (e, t) => {
				var n = to(), r = N(n), i = F(r, !0), a = F(I(r, 2), !0);
				O(n), L(() => {
					W(i, B(t).label), W(a, B(t).hint);
				}), V("click", n, () => c(B(t).module)), U(e, n);
			});
			var r = I(n, 2), i = (e) => {
				var t = ro();
				Hr(I(P(t), 2), 16, () => B(y), (e) => e, (e, t) => {
					var n = no(), r = F(N(n), !0);
					O(n), L(() => W(r, t)), V("click", n, () => c(t)), U(e, n);
				}), U(e, t);
			};
			G(r, (e) => {
				B(y).length && e(i);
			}), O(t), U(e, t);
		};
		G(i, (e) => {
			B(o) && e(s);
		}), L((e) => oi(n, `margin-left: ${e ?? ""}px`), [() => Math.min(B(a).length, 5) * 16 + 9]), V("click", r, () => M(o, !B(o))), U(e, t);
	};
	G(ee, (e) => {
		r() || e(te);
	}), O(b), L(() => {
		x = ii(b, 1, "stack svelte-94r51u", null, x, { disabled: r() }), W(C, t.project ?? "default");
	}), U(e, b), Ke();
}
yr(["click"]);
// src/Lifecycle.svelte
var co = /* @__PURE__ */ H("<div class=\"err mono svelte-dckg3z\"> </div>"), lo = /* @__PURE__ */ H("<span> </span>"), uo = /* @__PURE__ */ H("<button class=\"go launch svelte-dckg3z\"> <span class=\"arr svelte-dckg3z\">▸</span></button>"), fo = /* @__PURE__ */ H("<span class=\"stat mono svelte-dckg3z\"><span class=\"spin svelte-dckg3z\">◴</span> running…</span>"), po = /* @__PURE__ */ H("<button class=\"go stop svelte-dckg3z\">Interrupt</button>"), mo = /* @__PURE__ */ H("<!> <!>", 1), ho = /* @__PURE__ */ H("<span class=\"stat ready mono svelte-dckg3z\">✓ result cached</span>"), go = /* @__PURE__ */ H("<button class=\"go resume svelte-dckg3z\">Resume</button>"), _o = /* @__PURE__ */ H("<div><!> <div class=\"row svelte-dckg3z\"><!> <!></div></div>");
function vo(e, t) {
	Ge(t, !0);
	let n = ji(t, "disabled", 3, !1), r = ji(t, "compact", 3, !1), i = ji(t, "launchLabel", 3, "Launch"), a = /* @__PURE__ */ j("draft"), o = /* @__PURE__ */ j(!1), s = /* @__PURE__ */ j(""), c = /* @__PURE__ */ j(void 0);
	function l(e, n) {
		M(a, e, !0), n && M(c, n, !0), t.onStatus?.(e, B(c)), e === "failed" ? d(B(c)) : u && (u = null, t.onFailure?.(null));
	}
	let u = null;
	async function d(e) {
		if (e && t.adapter.runOutput && u !== e) {
			u = e;
			try {
				let n = ((await t.adapter.runOutput(e, { tail: 8192 })).output ?? "").split("\n").map((e) => e.trimEnd()).filter((e) => e.trim().length > 0).pop();
				if (!n || B(a) !== "failed") return;
				let r = n.length > 400 ? `${n.slice(0, 400)}…` : n;
				M(s, r, !0), t.onFailure?.(r);
			} catch {
				u = null;
			}
		}
	}
	yn(() => {
		if (JSON.stringify(t.version), t.executionRef, p++, dr(() => B(a)) === "running") return;
		let e = !1;
		return t.adapter.find(t.module, t.version, {
			context: t.context,
			executionRef: t.executionRef
		}).then((t) => {
			e || (M(s, ""), l(t.status, t.executionRef));
		}).catch((t) => {
			e || M(s, t instanceof Error ? t.message : String(t), !0);
		}), () => e = !0;
	});
	async function f() {
		M(o, !0), M(s, "");
		try {
			let e = await t.adapter.dispatch(t.module, t.version, {
				context: t.context,
				execution: t.execution,
				executionRef: t.executionRef
			});
			l("running", e.executionRef), t.onRun?.({
				executionRef: e.executionRef,
				startedAt: Date.now()
			}), m();
		} catch (e) {
			M(s, e instanceof Error ? e.message : String(e), !0);
		} finally {
			M(o, !1);
		}
	}
	let p = 0;
	async function m() {
		let e = ++p;
		for (;;) {
			if (await new Promise((e) => setTimeout(e, 600)), e !== p) return;
			try {
				let n = await t.adapter.find(t.module, t.version, {
					context: t.context,
					executionRef: t.executionRef
				});
				if (e !== p || (n.status !== "draft" && l(n.status, n.executionRef), n.status === "cached" || n.status === "failed")) return;
			} catch {}
		}
	}
	async function h() {
		if (B(c)) try {
			await t.adapter.interrupt(B(c));
		} catch (e) {
			M(s, e instanceof Error ? e.message : String(e), !0);
		}
	}
	var g = _o();
	let _;
	var v = N(g), y = (e) => {
		var t = co(), n = F(t, !0);
		L(() => W(n, B(s))), U(e, t);
	};
	G(v, (e) => {
		B(s) && e(y);
	});
	var b = I(v, 2), x = N(b), S = (e) => {
		var t = lo(), n = F(t, !0);
		L(() => {
			ii(t, 1, `badge ${B(a) ?? ""}`, "svelte-dckg3z"), W(n, B(a));
		}), U(e, t);
	};
	G(x, (e) => {
		r() || e(S);
	});
	var C = I(x, 2), w = (e) => {
		var t = uo(), r = N(t);
		Ee(), O(t), L(() => {
			t.disabled = B(o) || n(), W(r, `${i() ?? ""} `);
		}), V("click", t, f), U(e, t);
	}, ee = (e) => {
		var t = mo(), n = P(t), i = (e) => {
			U(e, fo());
		};
		G(n, (e) => {
			r() || e(i);
		});
		var a = I(n, 2), o = (e) => {
			var t = po();
			V("click", t, h), U(e, t);
		};
		G(a, (e) => {
			B(c) && e(o);
		}), U(e, t);
	}, te = (e) => {
		var t = Dr(), n = P(t), i = (e) => {
			U(e, ho());
		};
		G(n, (e) => {
			r() || e(i);
		}), U(e, t);
	}, ne = (e) => {
		var t = go();
		L(() => t.disabled = B(o)), V("click", t, f), U(e, t);
	};
	G(C, (e) => {
		B(a) === "draft" ? e(w) : B(a) === "running" ? e(ee, 1) : B(a) === "cached" ? e(te, 2) : (B(a) === "failed" || B(a) === "interrupted") && e(ne, 3);
	}), O(b), O(g), L(() => _ = ii(g, 1, "lifecycle svelte-dckg3z", null, _, { compact: r() })), U(e, g), Ke();
}
yr(["click"]);
// src/Provenance.svelte
var yo = /* @__PURE__ */ H("<div class=\"empty mono svelte-1pahae8\">loading provenance…</div>"), bo = /* @__PURE__ */ H("<div class=\"empty mono svelte-1pahae8\">no provenance recorded — not yet executed</div>"), xo = /* @__PURE__ */ H("<span class=\"cargs svelte-1pahae8\"> </span>"), So = /* @__PURE__ */ H("<div class=\"rline svelte-1pahae8\"><span class=\"kw svelte-1pahae8\">with</span> <span class=\"mod svelte-1pahae8\"> </span> <!></div>"), Co = /* @__PURE__ */ H("<div class=\"rline svelte-1pahae8\"><span class=\"vparts svelte-1pahae8\"> </span></div>"), wo = /* @__PURE__ */ H("<span class=\"dirty mono svelte-1pahae8\">dirty ●</span>"), To = /* @__PURE__ */ H("<span class=\"clean mono svelte-1pahae8\">clean</span>"), Eo = /* @__PURE__ */ H("<button class=\"src mono svelte-1pahae8\">view source ▸</button>"), Do = /* @__PURE__ */ H("<div class=\"deps mono svelte-1pahae8\"> </div>"), Oo = /* @__PURE__ */ H("<div class=\"erow mf svelte-1pahae8\"><span class=\"mfk mono svelte-1pahae8\">uses manifest</span> <span class=\"commit mono svelte-1pahae8\"> </span> <!> <span class=\"espacer svelte-1pahae8\"></span> <!></div> <!>", 1), ko = /* @__PURE__ */ H("<div class=\"exec svelte-1pahae8\"><div class=\"erow svelte-1pahae8\"><span></span> <span class=\"est svelte-1pahae8\"> </span> <span class=\"espacer svelte-1pahae8\"></span> <span class=\"ets mono svelte-1pahae8\"> </span></div> <!></div>"), Ao = /* @__PURE__ */ H("<div class=\"empty mono svelte-1pahae8\">(not yet executed)</div>"), jo = /* @__PURE__ */ H("<div class=\"trunc mono svelte-1pahae8\">graph truncated · more layers hidden ▾</div>"), Mo = /* @__PURE__ */ H("<div class=\"sect svelte-1pahae8\"><div class=\"cap mono svelte-1pahae8\">RECIPE · config ⊕ context <span class=\"capsub svelte-1pahae8\">— frozen</span></div> <div class=\"recipe mono svelte-1pahae8\"><!> <div class=\"rline svelte-1pahae8\"><span class=\"tgt svelte-1pahae8\"> </span></div> <!></div></div> <div class=\"sect svelte-1pahae8\"><div class=\"cap mono svelte-1pahae8\">HISTORY · executions · newest first</div> <!></div> <!>", 1), No = /* @__PURE__ */ H("<div class=\"prov svelte-1pahae8\"><!></div>");
function Po(e, t) {
	Ge(t, !0);
	let n = /* @__PURE__ */ j(null), r = /* @__PURE__ */ j(!1);
	yn(() => {
		t.module, JSON.stringify(t.version), M(r, !1), M(n, null);
		let e = !1;
		return t.adapter.provenance(t.module, t.version).then((t) => {
			e || (M(n, t, !0), M(r, !0));
		}).catch(() => {
			e || M(r, !0);
		}), () => e = !0;
	});
	function i(e, t) {
		return e.nodes.find((e) => e.uuid === t);
	}
	function a(e, t, n) {
		return e.links.filter((e) => e.source === t && e.rel === n).map((t) => i(e, t.target)).filter((e) => !!e);
	}
	function o(e) {
		return e && typeof e == "object" ? e : {};
	}
	let s = /* @__PURE__ */ k(() => B(n) ? i(B(n), B(n).root) : void 0), c = /* @__PURE__ */ k(() => o(B(s)?.attributes)), l = /* @__PURE__ */ k(() => {
		let e = B(c).context;
		return Array.isArray(e) ? e.map((e) => {
			let t = o(e);
			return {
				target: String(t.target ?? e),
				version: Array.isArray(t.version) ? t.version : []
			};
		}) : [];
	}), u = /* @__PURE__ */ k(() => {
		let e = o(B(c).config_layers);
		return Array.isArray(e.version) ? e.version : B(s)?.version ?? [];
	}), d = /* @__PURE__ */ k(() => B(n) ? a(B(n), B(n).root, "runs").map((e) => {
		let t = o(e.attributes), r = o(a(B(n), e.uuid, "uses").find((e) => e.kind === "Manifest")?.attributes);
		return {
			uuid: e.uuid,
			ts: typeof t.timestamp == "number" ? t.timestamp * 1e3 : void 0,
			status: typeof t.status == "string" ? t.status : void 0,
			commit: typeof r.commit == "string" ? r.commit : void 0,
			dirty: !!r.dirty,
			deps: Array.isArray(r.dependencies) ? r.dependencies.map(String) : []
		};
	}).sort((e, t) => (t.ts ?? 0) - (e.ts ?? 0)) : []);
	function f(e) {
		if (!e) return "";
		let t = Math.max(0, (Date.now() - e) / 1e3);
		return t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago`;
	}
	async function p() {
		try {
			let e = await t.adapter.introspect(t.module);
			e.sourceRef && t.onViewSource?.(e.sourceRef);
		} catch {}
	}
	var m = No(), h = N(m), g = (e) => {
		U(e, yo());
	}, _ = (e) => {
		U(e, bo());
	}, v = (e) => {
		var r = Mo(), i = P(r), a = I(N(i), 2), o = N(a);
		Hr(o, 17, () => B(l), Rr, (e, t, n) => {
			var r = So();
			oi(r, `padding-left: ${n * 16}px`);
			var i = I(N(r), 2), a = F(i, !0), o = I(i, 2), s = (e) => {
				var n = xo(), r = F(n, !0);
				L((e) => W(r, e), [() => Wi(B(t).version).join(" ")]), U(e, n);
			}, c = /* @__PURE__ */ k(() => Wi(B(t).version).length);
			G(o, (e) => {
				B(c) && e(s);
			}), O(r), L(() => W(a, B(t).target)), U(e, r);
		});
		var c = I(o, 2), m = F(N(c), !0);
		O(c);
		var h = I(c, 2), g = (e) => {
			var t = Co(), n = F(N(t), !0);
			O(t), L((e) => {
				oi(t, `padding-left: ${B(l).length * 16 + 12}px`), W(n, e);
			}, [() => Wi(B(u)).join(" · ")]), U(e, t);
		}, _ = /* @__PURE__ */ k(() => Wi(B(u)).length);
		G(h, (e) => {
			B(_) && e(g);
		}), O(a), O(i);
		var v = I(i, 2);
		Hr(I(N(v), 2), 17, () => B(d), (e) => e.uuid, (e, n) => {
			var r = ko(), i = N(r), a = N(i);
			let o;
			var s = I(a, 2), c = F(s, !0), l = F(I(s, 4), !0);
			O(i);
			var u = I(i, 2), d = (e) => {
				var r = Oo(), i = P(r), a = I(N(i), 2), o = F(a, !0), s = I(a, 2), c = (e) => {
					U(e, wo());
				}, l = (e) => {
					U(e, To());
				};
				G(s, (e) => {
					B(n).dirty ? e(c) : e(l, -1);
				});
				var u = I(s, 4), d = (e) => {
					var t = Eo();
					V("click", t, p), U(e, t);
				};
				G(u, (e) => {
					t.onViewSource && e(d);
				}), O(i);
				var f = I(i, 2), m = (e) => {
					var t = Do(), r = F(t);
					L((e) => W(r, `deps · ${e ?? ""}`), [() => B(n).deps.join(" · ")]), U(e, t);
				};
				G(f, (e) => {
					B(n).deps.length && e(m);
				}), L(() => W(o, B(n).commit)), U(e, r);
			};
			G(u, (e) => {
				B(n).commit && e(d);
			}), O(r), L((e) => {
				o = ii(a, 1, "edot svelte-1pahae8", null, o, { bad: B(n).status === "failed" }), W(c, B(n).status ?? "run"), W(l, e);
			}, [() => f(B(n).ts)]), U(e, r);
		}, (e) => {
			U(e, Ao());
		}), O(v);
		var y = I(v, 2), b = (e) => {
			U(e, jo());
		};
		G(y, (e) => {
			B(n).truncated && e(b);
		}), L(() => {
			oi(c, `padding-left: ${B(l).length * 16}px`), W(m, B(s).module ?? t.module);
		}), U(e, r);
	};
	G(h, (e) => {
		B(r) ? !B(n) || !B(s) ? e(_, 1) : e(v, -1) : e(g);
	}), O(m), U(e, m), Ke();
}
yr(["click"]);
// src/Browser.svelte
var Fo = /* @__PURE__ */ H("<div class=\"err mono svelte-83jdt3\"> </div>"), Io = /* @__PURE__ */ H("<span class=\"chip mono svelte-83jdt3\"> <button class=\"x svelte-83jdt3\">×</button></span>"), Lo = /* @__PURE__ */ H("<option class=\"svelte-83jdt3\"> </option>"), Ro = /* @__PURE__ */ H("<div class=\"fform svelte-83jdt3\"><input class=\"fp mono svelte-83jdt3\" placeholder=\"config path — e.g. alpha\"/> <select class=\"fo mono svelte-83jdt3\"></select> <input class=\"fv mono svelte-83jdt3\" placeholder=\"value\"/> <button class=\"fadd svelte-83jdt3\">add</button></div>"), zo = /* @__PURE__ */ H("<button class=\"newrow svelte-83jdt3\"><span class=\"newplus mono svelte-83jdt3\">+</span> <span class=\"newmeta svelte-83jdt3\"><span class=\"newname svelte-83jdt3\">New run</span></span> <span class=\"chev svelte-83jdt3\">›</span></button>"), Bo = /* @__PURE__ */ H("<button class=\"clear mono svelte-83jdt3\">clear filters ×</button>"), Vo = /* @__PURE__ */ H("<div class=\"hint mono svelte-83jdt3\">no runs yet</div>"), Ho = /* @__PURE__ */ H("<div class=\"nomatch svelte-83jdt3\"><div class=\"nm mono svelte-83jdt3\">0 runs match</div> <!></div>"), Uo = /* @__PURE__ */ H("<input class=\"rename mono svelte-83jdt3\"/>"), Wo = /* @__PURE__ */ H("<button class=\"pen svelte-83jdt3\" title=\"rename\">✎</button>"), Go = /* @__PURE__ */ H("<span class=\"lbl svelte-83jdt3\"> </span> <!>", 1), Ko = /* @__PURE__ */ H("<span class=\"ident mono svelte-83jdt3\"> </span>"), qo = /* @__PURE__ */ H("<span class=\"sp svelte-83jdt3\"> </span>"), Jo = /* @__PURE__ */ H("<span class=\"more svelte-83jdt3\"> </span>"), Yo = /* @__PURE__ */ H("<span class=\"more svelte-83jdt3\">defaults</span>"), Xo = /* @__PURE__ */ H("<span class=\"git mono svelte-83jdt3\"> </span>"), Zo = /* @__PURE__ */ H("<span class=\"meta svelte-83jdt3\"> </span>"), Qo = /* @__PURE__ */ H("<div class=\"peekbody svelte-83jdt3\"><!></div>"), $o = /* @__PURE__ */ H("<div class=\"row svelte-83jdt3\" role=\"button\" tabindex=\"0\"><div class=\"r1 svelte-83jdt3\"><span></span> <!> <span class=\"spacer svelte-83jdt3\"></span> <!> <span class=\"chev svelte-83jdt3\">›</span></div> <div class=\"r2 mono svelte-83jdt3\"><!> <!> <!></div> <div class=\"r3 svelte-83jdt3\"><span> </span> <!> <!> <span class=\"meta svelte-83jdt3\"> </span> <span class=\"spacer svelte-83jdt3\"></span> <button class=\"peek mono svelte-83jdt3\">⌥ provenance</button></div> <!></div>"), es = /* @__PURE__ */ H("<button class=\"morebtn mono svelte-83jdt3\"> </button>"), ts = /* @__PURE__ */ H("<div class=\"rows svelte-83jdt3\"></div> <div class=\"foot mono svelte-83jdt3\"><span class=\"svelte-83jdt3\"> </span> <span class=\"spacer svelte-83jdt3\"></span> <!></div>", 1), ns = /* @__PURE__ */ H("<div class=\"cat svelte-83jdt3\"><!> <div class=\"controls svelte-83jdt3\"><div class=\"search svelte-83jdt3\"><span class=\"mag svelte-83jdt3\">⌕</span> <input placeholder=\"search config &amp; labels…\" class=\"svelte-83jdt3\"/></div> <div class=\"chips svelte-83jdt3\"><!> <button class=\"addf mono svelte-83jdt3\">+ facet</button> <span class=\"spacer svelte-83jdt3\"></span> <label class=\"sort mono svelte-83jdt3\">sort: <select class=\"svelte-83jdt3\"><option class=\"svelte-83jdt3\">newest</option><option class=\"svelte-83jdt3\">oldest</option><option class=\"svelte-83jdt3\">label</option></select></label></div> <!></div> <!> <!></div>");
function rs(e, t) {
	Ge(t, !0);
	let n = /* @__PURE__ */ j(""), r = /* @__PURE__ */ j(Xt([])), i = /* @__PURE__ */ j("newest"), a = /* @__PURE__ */ j(Xt([])), o = /* @__PURE__ */ j(0), s = /* @__PURE__ */ j(""), c = /* @__PURE__ */ j(!1);
	function l(e) {
		return {
			text: B(n).trim() || void 0,
			facets: B(r).length ? B(r) : void 0,
			sort: B(i) === "label" ? {
				by: "label",
				direction: "asc"
			} : {
				by: "created_at_ns",
				direction: B(i) === "newest" ? "desc" : "asc"
			},
			limit: 20,
			offset: e
		};
	}
	async function u() {
		M(s, "");
		try {
			let e = await t.adapter.list(l(0));
			M(a, e.items, !0), M(o, e.total, !0), t.onTotal?.(e.total);
		} catch (e) {
			M(s, e instanceof Error ? e.message : String(e), !0);
		}
	}
	async function d() {
		M(c, !0);
		try {
			let e = await t.adapter.list(l(B(a).length));
			M(a, [...B(a), ...e.items], !0), M(o, e.total, !0);
		} catch (e) {
			M(s, e instanceof Error ? e.message : String(e), !0);
		} finally {
			M(c, !1);
		}
	}
	yn(() => {
		B(n), JSON.stringify(B(r)), B(i);
		let e = setTimeout(() => void u(), 200);
		return () => clearTimeout(e);
	});
	let f = [
		{
			op: "eq",
			label: "="
		},
		{
			op: "ne",
			label: "≠"
		},
		{
			op: "lt",
			label: "<"
		},
		{
			op: "lte",
			label: "≤"
		},
		{
			op: "gt",
			label: ">"
		},
		{
			op: "gte",
			label: "≥"
		},
		{
			op: "contains",
			label: "⊃"
		}
	], p = /* @__PURE__ */ j(!1), m = /* @__PURE__ */ j(""), h = /* @__PURE__ */ j("eq"), g = /* @__PURE__ */ j("");
	function _() {
		if (!B(m).trim() || B(g) === "") return;
		let e = Number(B(g)), t = B(g).trim() !== "" && !Number.isNaN(e) ? e : B(g);
		M(r, [...B(r), {
			path: B(m).trim(),
			op: B(h),
			value: t
		}], !0), M(m, ""), M(g, ""), M(h, "eq"), M(p, !1);
	}
	function v(e) {
		M(r, B(r).filter((t, n) => n !== e), !0);
	}
	function y(e) {
		let t = f.find((t) => t.op === e.op)?.label ?? e.op;
		return `${e.path} ${t} ${typeof e.value == "string" ? e.value : JSON.stringify(e.value)}`;
	}
	function b(e) {
		return e.version?.length ? Wi(e.version) : Object.entries(e.config).map(([e, t]) => `${e}=${typeof t == "string" ? t : JSON.stringify(t)}`);
	}
	function x(e) {
		if (!e) return "";
		let t = Math.max(0, (Date.now() - e) / 1e3);
		return t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago`;
	}
	let S = /* @__PURE__ */ j(null), C = /* @__PURE__ */ j("");
	async function w(e) {
		let n = B(C).trim();
		if (M(S, null), n && n !== e.label && t.adapter.setLabel) try {
			await t.adapter.setLabel(e.uuid, n), await u();
		} catch (e) {
			M(s, e instanceof Error ? e.message : String(e), !0);
		}
	}
	let ee = /* @__PURE__ */ j(null);
	var te = ns(), ne = N(te), T = (e) => {
		var t = Fo(), n = F(t, !0);
		L(() => W(n, B(s))), U(e, t);
	};
	G(ne, (e) => {
		B(s) && e(T);
	});
	var re = I(ne, 2), ie = N(re), ae = I(N(ie), 2);
	vi(ae), O(ie);
	var oe = I(ie, 2), se = N(oe);
	Hr(se, 17, () => B(r), Rr, (e, t, n) => {
		var r = Io(), i = N(r), a = I(i);
		O(r), L((e) => W(i, `${e ?? ""} `), [() => y(B(t))]), V("click", a, () => v(n)), U(e, r);
	});
	var ce = I(se, 2), le = I(ce, 4), ue = I(N(le)), de = N(ue);
	de.value = de.__value = "newest";
	var fe = I(de);
	fe.value = fe.__value = "oldest";
	var pe = I(fe);
	pe.value = pe.__value = "label", O(ue), ui(ue), O(le), O(oe);
	var me = I(oe, 2), he = (e) => {
		var t = Ro(), n = N(t);
		vi(n);
		var r = I(n, 2);
		Hr(r, 21, () => f, (e) => e.op, (e, t) => {
			var n = Lo(), r = F(n, !0), i = {};
			L(() => {
				W(r, B(t).label), i !== (i = B(t).op) && (n.value = (n.__value = i) ?? "");
			}), U(e, n);
		}), O(r), ui(r);
		var i = I(r, 2);
		vi(i);
		var a = I(i, 2);
		O(t), wi(n, () => B(m), (e) => M(m, e)), di(r, () => B(h), (e) => M(h, e)), V("keydown", i, (e) => e.key === "Enter" && _()), wi(i, () => B(g), (e) => M(g, e)), V("click", a, _), U(e, t);
	};
	G(me, (e) => {
		B(p) && e(he);
	}), O(re);
	var ge = I(re, 2), _e = (e) => {
		var n = zo();
		V("click", n, function(...e) {
			t.onNew?.apply(this, e);
		}), U(e, n);
	};
	G(ge, (e) => {
		t.onNew && e(_e);
	});
	var ve = I(ge, 2), ye = (e) => {
		var t = Ho(), i = I(N(t), 2), a = (e) => {
			var t = Bo();
			V("click", t, () => {
				M(r, [], !0), M(n, "");
			}), U(e, t);
		}, o = (e) => {
			U(e, Vo());
		};
		G(i, (e) => {
			B(r).length || B(n) ? e(a) : e(o, -1);
		}), O(t), U(e, t);
	}, be = (e) => {
		var n = ts(), r = P(n);
		Hr(r, 21, () => B(a), (e) => e.uuid, (e, n) => {
			var r = $o(), i = N(r), a = N(i);
			let o;
			var s = I(a, 2), c = (e) => {
				var t = Uo();
				vi(t), rt(t, !0), V("click", t, (e) => e.stopPropagation()), V("keydown", t, (e) => {
					e.stopPropagation(), e.key === "Enter" && w(B(n)), e.key === "Escape" && M(S, null);
				}), vr("blur", t, () => void w(B(n))), wi(t, () => B(C), (e) => M(C, e)), U(e, t);
			}, l = (e) => {
				var r = Go(), i = P(r), a = F(i, !0), o = I(i, 2), s = (e) => {
					var t = Wo();
					V("click", t, (e) => {
						e.stopPropagation(), M(S, B(n).uuid, !0), M(C, B(n).label ?? "", !0);
					}), U(e, t);
				};
				G(o, (e) => {
					t.adapter.setLabel && e(s);
				}), L(() => W(a, B(n).label ?? B(n).module)), U(e, r);
			};
			G(s, (e) => {
				B(S) === B(n).uuid ? e(c) : e(l, -1);
			});
			var u = I(s, 4), d = (e) => {
				var t = Ko(), r = F(t);
				L(() => W(r, `#${B(n).identity ?? ""}`)), U(e, t);
			};
			G(u, (e) => {
				B(n).identity && e(d);
			}), Ee(2), O(i);
			var f = I(i, 2), p = N(f);
			Hr(p, 17, () => b(B(n)).slice(0, 4), Rr, (e, t) => {
				var n = qo(), r = F(n, !0);
				L(() => W(r, B(t))), U(e, n);
			});
			var m = I(p, 2), h = (e) => {
				var t = Jo(), r = F(t);
				L((e) => W(r, `+${e ?? ""} more`), [() => b(B(n)).length - 4]), U(e, t);
			}, g = /* @__PURE__ */ k(() => b(B(n)).length > 4);
			G(m, (e) => {
				B(g) && e(h);
			});
			var _ = I(m, 2), v = (e) => {
				U(e, Yo());
			}, y = /* @__PURE__ */ k(() => b(B(n)).length === 0);
			G(_, (e) => {
				B(y) && e(v);
			}), O(f);
			var te = I(f, 2), ne = N(te), T = F(ne, !0), re = I(ne, 2), ie = (e) => {
				var t = Xo(), r = F(t);
				L(() => W(r, `git ${B(n).manifest.commit ?? ""}${B(n).manifest.dirty ? "*" : ""}`)), U(e, t);
			};
			G(re, (e) => {
				B(n).manifest && e(ie);
			});
			var ae = I(re, 2), oe = (e) => {
				var t = Zo(), r = F(t);
				L(() => W(r, `${B(n).runCount ?? ""} runs`)), U(e, t);
			};
			G(ae, (e) => {
				B(n).runCount && B(n).runCount > 1 && e(oe);
			});
			var se = I(ae, 2), ce = F(se), le = I(se, 4);
			O(te);
			var ue = I(te, 2), de = (e) => {
				var r = Qo(), i = N(r);
				{
					let e = /* @__PURE__ */ k(() => B(n).version ?? [B(n).config]);
					Po(i, {
						get adapter() {
							return t.adapter;
						},
						get module() {
							return B(n).module;
						},
						get version() {
							return B(e);
						}
					});
				}
				O(r), V("click", r, (e) => e.stopPropagation()), V("keydown", r, (e) => e.stopPropagation()), U(e, r);
			};
			G(ue, (e) => {
				B(ee) === B(n).uuid && e(de);
			}), O(r), L((e) => {
				o = ii(a, 1, `dot ${B(n).status ?? ""}`, "svelte-83jdt3", o, { pulse: B(n).status === "running" }), ii(ne, 1, `st ${B(n).status ?? ""}`, "svelte-83jdt3"), W(T, B(n).status), W(ce, `${e ?? ""}${B(n).creator ? ` · ${B(n).creator}` : ""}`);
			}, [() => x(B(n).createdAt)]), V("click", r, () => t.onOpen?.(B(n))), V("keydown", r, (e) => e.key === "Enter" && t.onOpen?.(B(n))), V("click", le, (e) => {
				e.stopPropagation(), M(ee, B(ee) === B(n).uuid ? null : B(n).uuid, !0);
			}), U(e, r);
		}), O(r);
		var i = I(r, 2), s = N(i), l = F(s), u = I(s, 4), f = (e) => {
			var t = es(), n = F(t, !0);
			L(() => {
				t.disabled = B(c), W(n, B(c) ? "loading…" : "load more ▾");
			}), V("click", t, d), U(e, t);
		};
		G(u, (e) => {
			B(a).length < B(o) && e(f);
		}), O(i), L(() => W(l, `1–${B(a).length ?? ""} of ${B(o) ?? ""}`)), U(e, n);
	};
	G(ve, (e) => {
		B(a).length === 0 ? e(ye) : e(be, -1);
	}), O(te), wi(ae, () => B(n), (e) => M(n, e)), V("click", ce, () => M(p, !B(p))), di(ue, () => B(i), (e) => M(i, e)), U(e, te), Ke();
}
yr(["click", "keydown"]);
// src/StatusBadge.svelte
var is = /* @__PURE__ */ H("<span class=\"pulse svelte-1pj1gvc\"></span>"), as = /* @__PURE__ */ H("<span><!> </span>");
function os(e, t) {
	let n = {
		draft: "DRAFT",
		pending: "PENDING",
		running: "RUNNING",
		"running-looped": "RUNNING · LOOPED",
		cached: "CACHED",
		"cached-reuse": "CACHED · REUSE ↺",
		failed: "FAILED",
		interrupted: "INTERRUPTED",
		locked: "🔒 LOCKED"
	};
	var r = as(), i = N(r), a = (e) => {
		U(e, is());
	};
	G(i, (e) => {
		(t.variant === "running" || t.variant === "running-looped") && e(a);
	});
	var o = I(i);
	O(r), L(() => {
		ii(r, 1, `badge ${t.variant ?? ""}`, "svelte-1pj1gvc"), W(o, ` ${n[t.variant] ?? ""}`);
	}), U(e, r);
}
// src/ResolvedBar.svelte
var ss = /* @__PURE__ */ H("<span class=\"ident mono svelte-195uv0s\"> </span>"), cs = /* @__PURE__ */ H("<span class=\"state mono bad svelte-195uv0s\">✕ fix to launch</span>"), ls = /* @__PURE__ */ H("<div class=\"issue mono svelte-195uv0s\"> </div>"), us = /* @__PURE__ */ H("<div class=\"issues svelte-195uv0s\"></div>"), ds = /* @__PURE__ */ H("<div class=\"bar svelte-195uv0s\"><div class=\"brow svelte-195uv0s\"><!> <!> <!> <span class=\"spacer svelte-195uv0s\"></span> <!></div> <!></div>");
function fs(e, t) {
	Ge(t, !0);
	let n = ji(t, "badge", 3, null), r = /* @__PURE__ */ j(""), i = /* @__PURE__ */ j(Xt([]));
	yn(() => {
		JSON.stringify(t.version), t.module;
		let e = !1, n = setTimeout(() => {
			t.adapter.resolve(t.module, t.version).then((n) => {
				e || (n.ok ? (M(r, n.identity ?? "", !0), M(i, [], !0)) : (M(r, ""), M(i, n.issues, !0)), t.onResolved?.(n));
			}).catch((n) => {
				if (e) return;
				let a = { message: n instanceof Error ? n.message : String(n) };
				M(r, ""), M(i, [a], !0), t.onResolved?.({
					ok: !1,
					issues: B(i)
				});
			});
		}, 150);
		return () => {
			e = !0, clearTimeout(n);
		};
	});
	var a = ds(), o = N(a), s = N(o), c = (e) => {
		os(e, { get variant() {
			return n();
		} });
	};
	G(s, (e) => {
		n() && e(c);
	});
	var l = I(s, 2), u = (e) => {
		var t = ss(), n = F(t);
		L(() => W(n, `#${B(r) ?? ""}`)), U(e, t);
	};
	G(l, (e) => {
		B(r) && e(u);
	});
	var d = I(l, 2), f = (e) => {
		U(e, cs());
	};
	G(d, (e) => {
		B(i).length && e(f);
	}), Jr(I(d, 4), () => t.children ?? m), O(o);
	var p = I(o, 2), h = (e) => {
		var t = us();
		Hr(t, 21, () => B(i), Rr, (e, t) => {
			var n = ls(), r = F(n);
			L(() => W(r, `${B(t).path ? `${B(t).path} · ` : ""}${B(t).message ?? ""}`)), U(e, n);
		}), O(t), U(e, t);
	};
	G(p, (e) => {
		B(i).length && e(h);
	}), O(a), U(e, a), Ke();
}
// src/CliView.svelte
var ps = /* @__PURE__ */ H("<button class=\"copy mono svelte-1gjwari\"> </button>"), ms = /* @__PURE__ */ H("<span role=\"note\"> </span> ", 1), hs = /* @__PURE__ */ H("<span> </span> ", 1), gs = /* @__PURE__ */ H("<div class=\"cli mono svelte-1gjwari\"><span class=\"cmd svelte-1gjwari\">machinable get</span> <!><span class=\"tgtspan svelte-1gjwari\"></span> <span class=\"launchflag svelte-1gjwari\">--launch</span></div>"), _s = /* @__PURE__ */ H("<div class=\"cli mono dim svelte-1gjwari\">resolving…</div>"), vs = /* @__PURE__ */ H("<div class=\"cliview svelte-1gjwari\"><div class=\"crow svelte-1gjwari\"><span class=\"cap mono svelte-1gjwari\">CLI</span> <span class=\"spacer svelte-1gjwari\"></span> <!></div> <!></div>");
function ys(e, t) {
	Ge(t, !0);
	let n = ji(t, "chain", 19, () => []), r = ji(t, "highlightId", 3, null);
	function i(e) {
		let t = [], n = 0, r = null, i = "";
		for (let a of e) r ? (i += a, a === r && (r = null)) : a === "'" || a === "\"" ? (r = a, i += a) : ((a === "[" || a === "{" || a === "(") && n++, (a === "]" || a === "}" || a === ")") && n--, a === " " && n === 0 ? (i && t.push(i), i = "") : i += a);
		return i && t.push(i), t;
	}
	let a = /* @__PURE__ */ k(() => t.cli.replace(/^machinable get /, "")), o = /* @__PURE__ */ k(() => B(a) ? i(B(a)).map((e) => {
		let n = "plain";
		return e === t.module || e.endsWith(t.module) ? n = "mod" : e.startsWith("~") ? n = "tok" : e.includes("=") && (n = "kv"), {
			w: e,
			cls: n
		};
	}) : []);
	function s(e) {
		return [e.module, ...Wi(e.version)].join(" ");
	}
	let c = /* @__PURE__ */ k(() => [
		"machinable get",
		...n().map(s),
		B(a),
		"--launch"
	].filter(Boolean).join(" ")), l = /* @__PURE__ */ j(!1);
	async function u() {
		try {
			await navigator.clipboard.writeText(B(c)), M(l, !0), setTimeout(() => M(l, !1), 1200);
		} catch {}
	}
	var d = vs(), f = N(d), p = I(N(f), 4), m = (e) => {
		var t = ps(), n = F(t, !0);
		L(() => W(n, B(l) ? "copied ✓" : "copy ⧉")), V("click", t, u), U(e, t);
	};
	G(p, (e) => {
		t.cli && e(m);
	}), O(f);
	var h = I(f, 2), g = (e) => {
		var i = gs(), a = I(N(i), 1, !0);
		a.nodeValue = " ";
		var c = I(a);
		Hr(c, 17, n, (e) => e.id, (e, n) => {
			var i = ms(), a = P(i);
			let o;
			var c = F(a, !0), l = I(a, 1, !0);
			l.nodeValue = " ", L((e) => {
				o = ii(a, 1, "ctxspan svelte-1gjwari", null, o, { hl: r() === B(n).id }), W(c, e);
			}, [() => s(B(n))]), vr("mouseenter", a, () => t.onHighlight?.(B(n).id)), vr("mouseleave", a, () => t.onHighlight?.(null)), U(e, i);
		});
		var l = I(c);
		Hr(l, 21, () => B(o), Rr, (e, t, n) => {
			var r = hs(), i = P(r), a = F(i, !0), s = I(i, 1, !0);
			L(() => {
				ii(i, 1, Qr(B(t).cls), "svelte-1gjwari"), W(a, B(t).w), W(s, n < B(o).length - 1 ? " " : "");
			}), U(e, r);
		}), O(l);
		var u = I(l, 1, !0);
		u.nodeValue = " ", Ee(), O(i), U(e, i);
	}, _ = (e) => {
		U(e, _s());
	};
	G(h, (e) => {
		t.cli ? e(g) : e(_, -1);
	}), O(d), U(e, d), Ke();
}
yr(["click"]);
// src/RunBanner.svelte
var bs = /* @__PURE__ */ H("<button class=\"stop svelte-6u7gzy\">Interrupt</button>"), xs = /* @__PURE__ */ H("<div class=\"note mono svelte-6u7gzy\">identity <span class=\"hash svelte-6u7gzy\"> </span> · new variant — not a cache hit</div>"), Ss = /* @__PURE__ */ H("<div class=\"banner svelte-6u7gzy\"><div class=\"row svelte-6u7gzy\"><span class=\"spinner svelte-6u7gzy\"></span> <div class=\"what svelte-6u7gzy\"><span class=\"title svelte-6u7gzy\">Job · dispatched to <span class=\"exec mono svelte-6u7gzy\"> </span></span> <span class=\"sub mono svelte-6u7gzy\"> </span></div> <!></div> <div class=\"track svelte-6u7gzy\"><span class=\"fill svelte-6u7gzy\"></span></div> <!></div>");
function Cs(e, t) {
	Ge(t, !0);
	let n = ji(t, "executionLabel", 3, "default execution"), r = /* @__PURE__ */ j(Xt(Date.now()));
	yn(() => {
		let e = setInterval(() => M(r, Date.now(), !0), 500);
		return () => clearInterval(e);
	});
	let i = /* @__PURE__ */ k(() => {
		let e = Math.max(0, Math.floor((B(r) - t.startedAt) / 1e3));
		return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
	});
	var a = Ss(), o = N(a), s = I(N(o), 2), c = N(s), l = F(I(N(c)), !0);
	O(c);
	var u = F(I(c, 2));
	O(s);
	var d = I(s, 2), f = (e) => {
		var n = bs();
		V("click", n, function(...e) {
			t.onInterrupt?.apply(this, e);
		}), U(e, n);
	};
	G(d, (e) => {
		t.onInterrupt && e(f);
	}), O(o);
	var p = I(o, 4), m = (e) => {
		var n = xs(), r = F(I(N(n)));
		Ee(), O(n), L(() => W(r, `#${t.identity ?? ""}`)), U(e, n);
	};
	G(p, (e) => {
		t.identity && e(m);
	}), O(a), L(() => {
		W(l, n()), W(u, `polling · elapsed ${B(i) ?? ""}`);
	}), U(e, a), Ke();
}
yr(["click"]);
// src/RunPanel.svelte
var ws = /* @__PURE__ */ H("<span class=\"nick svelte-su2ghu\"> </span>"), Ts = /* @__PURE__ */ H("<span> </span>"), Es = /* @__PURE__ */ H("<div class=\"trim mono svelte-su2ghu\"> </div>"), Ds = /* @__PURE__ */ H("<!> <pre class=\"log mono svelte-su2ghu\"> </pre>", 1), Os = /* @__PURE__ */ H("<div class=\"run svelte-su2ghu\"><div class=\"meta mono svelte-su2ghu\"><!> <!> <!> <!> <!> <span class=\"spacer svelte-su2ghu\"></span> <button class=\"otoggle svelte-su2ghu\"> </button></div> <!></div>");
function ks(e, t) {
	Ge(t, !0);
	let n = 262144, r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ j(null), a = /* @__PURE__ */ j(0), o = 0, s = /* @__PURE__ */ j(!0), c = /* @__PURE__ */ j(Xt(Date.now())), l = /* @__PURE__ */ j(null);
	async function u(e) {
		try {
			if (M(r, await t.adapter.runDetail?.(t.executionRef) ?? null, !0), !t.adapter.runOutput) return;
			let s = e ? await t.adapter.runOutput(t.executionRef, { tail: 65536 }) : await t.adapter.runOutput(t.executionRef, { offset: o });
			if (s.output === null && e) {
				M(i, null), M(a, 0), o = 0;
				return;
			}
			if (e || s.size < o) M(i, s.output ?? "", !0), M(a, s.offset, !0);
			else if (s.output) {
				let e = (B(i) ?? "") + s.output;
				e.length > n && (M(a, B(a) + (e.length - n)), e = e.slice(-262144)), M(i, e, !0);
			}
			o = s.size, B(l) && (B(l).scrollTop = B(l).scrollHeight);
		} catch {}
	}
	let d = null;
	yn(() => {
		t.executionRef, t.status;
		let e = d !== t.executionRef;
		if (d = t.executionRef, u(e), t.status !== "running") return;
		let n = setInterval(() => void u(!1), 1500), r = setInterval(() => M(c, Date.now(), !0), 500);
		return () => {
			clearInterval(n), clearInterval(r);
		};
	});
	function f(e) {
		if (!e) return "—";
		let t = new Date(e);
		return isNaN(t.getTime()) ? String(e) : t.toLocaleTimeString();
	}
	let p = /* @__PURE__ */ k(() => {
		let e = B(r)?.startedAt ? new Date(B(r).startedAt).getTime() : NaN;
		if (isNaN(e)) return null;
		let t = B(r)?.finishedAt ? new Date(B(r).finishedAt).getTime() : B(c), n = Math.max(0, (t - e) / 1e3);
		if (n < 60) return `${n.toFixed(1)}s`;
		let i = Math.floor(n / 60);
		return `${i}m ${Math.round(n - i * 60)}s`;
	});
	var m = Dr(), h = P(m), g = (e) => {
		var n = Os(), o = N(n), c = N(o), u = (e) => {
			var t = ws(), n = F(t, !0);
			L(() => W(n, B(r).nickname)), U(e, t);
		};
		G(c, (e) => {
			B(r)?.nickname && e(u);
		});
		var d = I(c, 2), m = (e) => {
			var t = Ts(), n = F(t);
			L(() => W(n, `seed ${B(r).seed ?? ""}`)), U(e, t);
		};
		G(d, (e) => {
			B(r)?.seed !== void 0 && e(m);
		});
		var h = I(d, 2), g = (e) => {
			var t = Ts(), n = F(t);
			L((e) => W(n, `started ${e ?? ""}`), [() => f(B(r)?.startedAt)]), U(e, t);
		};
		G(h, (e) => {
			t.adapter.runDetail && e(g);
		});
		var _ = I(h, 2), v = (e) => {
			var t = Ts(), n = F(t);
			L((e) => W(n, `finished ${e ?? ""}`), [() => f(B(r).finishedAt)]), U(e, t);
		};
		G(_, (e) => {
			B(r)?.finishedAt && e(v);
		});
		var y = I(_, 2), b = (e) => {
			var n = Ts();
			let r;
			var i = F(n, !0);
			L(() => {
				r = ii(n, 1, "rt svelte-su2ghu", null, r, { live: t.status === "running" }), W(i, B(p));
			}), U(e, n);
		};
		G(y, (e) => {
			B(p) && e(b);
		});
		var x = I(y, 4), S = F(x);
		O(o);
		var C = I(o, 2), w = (e) => {
			var t = Ds(), n = P(t), r = (e) => {
				var t = Es(), n = F(t);
				L(() => W(n, `… earlier output trimmed (${B(a) ?? ""} bytes)`)), U(e, t);
			};
			G(n, (e) => {
				B(a) > 0 && e(r);
			});
			var o = I(n, 2), s = F(o, !0);
			Oi(o, (e) => M(l, e), () => B(l)), L((e) => W(s, e), [() => B(i)?.trimEnd() || "(no output)"]), U(e, t);
		};
		G(C, (e) => {
			B(s) && e(w);
		}), O(n), L(() => W(S, `${B(s) ? "▾" : "▸"} output`)), V("click", x, () => M(s, !B(s))), U(e, n);
	};
	G(h, (e) => {
		(t.adapter.runDetail || t.adapter.runOutput) && e(g);
	}), U(e, m), Ke();
}
yr(["click"]);
// src/CallLoop.svelte
var As = /* @__PURE__ */ H("<span class=\"cyc mono svelte-1kkcsr9\"><span></span> </span> <span class=\"cad mono svelte-1kkcsr9\"> </span> <span class=\"spacer svelte-1kkcsr9\"></span> <button class=\"btn svelte-1kkcsr9\"> </button> <button class=\"btn svelte-1kkcsr9\">Stop</button>", 1), js = /* @__PURE__ */ H("<div class=\"menu svelte-1kkcsr9\"><button class=\"mopt mono svelte-1kkcsr9\">Call</button> <button class=\"mopt mono svelte-1kkcsr9\">Call every 2s</button> <button class=\"mopt mono svelte-1kkcsr9\">Call every 5s</button></div>"), Ms = /* @__PURE__ */ H("<input class=\"minput mono svelte-1kkcsr9\" placeholder=\"method — e.g. units\"/> <span class=\"split svelte-1kkcsr9\"><button class=\"btn main svelte-1kkcsr9\" title=\"invoke once\"> </button> <button class=\"btn caret svelte-1kkcsr9\" title=\"call options\" aria-label=\"call options\">▾</button> <!></span>", 1), Ns = /* @__PURE__ */ H("<div class=\"cerr mono svelte-1kkcsr9\"> </div>"), Ps = /* @__PURE__ */ H("<div class=\"call svelte-1kkcsr9\"><div class=\"chead svelte-1kkcsr9\"><span class=\"cap mono svelte-1kkcsr9\"> </span> <span class=\"hint svelte-1kkcsr9\"> </span></div> <div class=\"crow svelte-1kkcsr9\"><!></div> <!></div>");
function Fs(e, t) {
	Ge(t, !0);
	let n = ji(t, "method", 3, ""), r = ji(t, "args", 19, () => ({})), i = ji(t, "cadenceMs", 3, 2e3), a = ji(t, "disabled", 3, !1), o = /* @__PURE__ */ j(Xt(n())), s = /* @__PURE__ */ j(!1), c = /* @__PURE__ */ j(!1), l = /* @__PURE__ */ j(0), u = /* @__PURE__ */ j(!1), d = /* @__PURE__ */ j(""), f = /* @__PURE__ */ j(!1), p = /* @__PURE__ */ j(Xt({
		top: 0,
		right: 0
	})), m = /* @__PURE__ */ j(Xt(i()));
	function h(e) {
		if (!B(f)) {
			let t = e.currentTarget.getBoundingClientRect();
			M(p, {
				top: t.bottom + 4,
				right: window.innerWidth - t.right
			}, !0);
		}
		M(f, !B(f));
	}
	async function g() {
		if (B(o).trim() && !B(u)) {
			M(u, !0), M(d, "");
			try {
				let e = await t.adapter.call(t.module, B(o).trim(), r(), t.version);
				M(l, B(l) + 1), t.onResult?.(e, {
					cycle: B(l),
					method: B(o).trim()
				});
			} catch (e) {
				M(d, e instanceof Error ? e.message : String(e), !0), y();
			} finally {
				M(u, !1);
			}
		}
	}
	let _ = null;
	function v(e) {
		B(o).trim() && (M(m, e, !0), M(s, !0), M(c, !1), M(l, 0), t.onLoop?.(!0), g(), _ = setInterval(() => {
			B(c) || g();
		}, e));
	}
	function y() {
		_ && clearInterval(_), _ = null, M(s, !1), M(c, !1), t.onLoop?.(!1);
	}
	yn(() => () => {
		_ && clearInterval(_), B(s) && t.onLoop?.(!1);
	});
	var b = Ps(), x = N(b), S = N(x), C = F(S), w = F(I(S, 2), !0);
	O(x);
	var ee = I(x, 2), te = N(ee), ne = (e) => {
		var t = As(), n = P(t), r = N(n);
		let i;
		var a = I(r);
		O(n);
		var o = I(n, 2), s = F(o), u = I(o, 4), d = F(u, !0), f = I(u, 2);
		L((e) => {
			i = ii(r, 1, "dot svelte-1kkcsr9", null, i, { paused: B(c) }), W(a, `cycle ${B(l) ?? ""}`), W(s, `every ${e ?? ""}s`), W(d, B(c) ? "Resume" : "Pause");
		}, [() => (B(m) / 1e3).toFixed(0)]), V("click", u, () => M(c, !B(c))), V("click", f, y), U(e, t);
	}, T = (e) => {
		var t = Ms(), n = P(t);
		vi(n);
		var r = I(n, 2), i = N(r), s = F(i, !0), c = I(i, 2), l = I(c, 2), d = (e) => {
			var t = js(), n = N(t), r = I(n, 2), i = I(r, 2);
			O(t), L(() => oi(t, `top: ${B(p).top ?? ""}px; right: ${B(p).right ?? ""}px`)), V("click", n, () => {
				M(f, !1), g();
			}), V("click", r, () => {
				M(f, !1), v(2e3);
			}), V("click", i, () => {
				M(f, !1), v(5e3);
			}), U(e, t);
		};
		G(l, (e) => {
			B(f) && e(d);
		}), O(r), L((e, t) => {
			n.disabled = a(), i.disabled = e, W(s, B(u) ? "…" : "Call"), c.disabled = t;
		}, [() => a() || B(u) || !B(o).trim(), () => a() || !B(o).trim()]), V("keydown", n, (e) => e.key === "Enter" && g()), wi(n, () => B(o), (e) => M(o, e)), V("click", i, g), V("click", c, h), U(e, t);
	};
	G(te, (e) => {
		B(s) ? e(ne) : e(T, -1);
	}), O(ee);
	var re = I(ee, 2), ie = (e) => {
		var t = Ns(), n = F(t, !0);
		L(() => W(n, B(d))), U(e, t);
	};
	G(re, (e) => {
		B(d) && e(ie);
	}), O(b), L(() => {
		W(C, `CALL${B(s) ? " · looped" : ""}`), W(w, B(s) ? "re-invokes live during a session" : "invoke a result accessor");
	}), U(e, b), Ke();
}
yr(["click", "keydown"]);
// src/widgetModel.ts
function Is(e, t, n, r) {
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), s = !1;
	function c(e, ...t) {
		for (let n of a.get(e) ?? []) n(...t);
	}
	function l(e, t) {
		r?.(`${e}: ${t instanceof Error ? t.message : String(t)}`);
	}
	function u(e) {
		if (!s && e && typeof e == "object") for (let [t, n] of Object.entries(e)) i.set(t, n), c(`change:${t}`, n), c("change", t, n);
	}
	let d = (r, i) => e.call(t, r, i, n);
	return d("widget_state", {}).then(u).catch((e) => l("widget_state", e)), {
		close() {
			s = !0, a.clear();
		},
		get(e) {
			return i.get(e);
		},
		set(e, t) {
			i.set(e, t), o.add(e), c(`change:${e}`, t), c("change", e, t);
		},
		save_changes() {
			if (o.size === 0) return;
			let e = {};
			for (let t of o) e[t] = i.get(t);
			o.clear(), d("widget_update", { changes: e }).then(u).catch((e) => l("widget_update", e));
		},
		on(e, t) {
			let n = a.get(e);
			n || a.set(e, n = /* @__PURE__ */ new Set()), n.add(t);
		},
		off(e, t) {
			t ? a.get(e)?.delete(t) : a.delete(e);
		},
		send(e) {
			d("widget_message", { content: e }).then((e) => {
				e != null && c("msg:custom", e);
			}).catch((e) => l("widget_message", e));
		}
	};
}
// src/ResultSlot.svelte
var Ls = /* @__PURE__ */ H("<div class=\"mounterr mono svelte-12h03ym\"> </div>"), Rs = /* @__PURE__ */ H("<!> <div class=\"embed svelte-12h03ym\"></div>", 1), zs = /* @__PURE__ */ H("<pre class=\"mono svelte-12h03ym\"> </pre>"), Bs = /* @__PURE__ */ H("<div class=\"raw svelte-12h03ym\"><button class=\"rawhead mono svelte-12h03ym\"> </button> <!></div>"), Vs = /* @__PURE__ */ H("<div class=\"empty svelte-12h03ym\"><div class=\"ephead mono svelte-12h03ym\"> </div></div>"), Hs = /* @__PURE__ */ H("<div class=\"slot svelte-12h03ym\"><!></div>");
function Us(e, t) {
	Ge(t, !0);
	let n = ji(t, "status", 3, null), r = ji(t, "result", 3, null), i = ji(t, "waiting", 19, () => n() === "running"), a = /* @__PURE__ */ k(() => t.adapter.slots?.result), o = /* @__PURE__ */ j(null), s = /* @__PURE__ */ j(null), c = /* @__PURE__ */ j(void 0);
	yn(() => {
		let e = B(a) ? void 0 : t.adapter.widgetAssets, n = t.module;
		if (M(o, null), M(s, null), !e) return;
		let r = !1;
		return e.call(t.adapter, n).then((e) => {
			r || M(o, e?.esm ? e : null, !0);
		}).catch(() => {
			r || M(o, null);
		}), () => {
			r = !0;
		};
	});
	let l = /* @__PURE__ */ k(() => JSON.stringify(t.version ?? []));
	yn(() => {
		let e = B(c), r = B(o), i = t.module;
		if (B(l), n(), !e || !r) return;
		let a = dr(() => t.version) ?? [], u = !1, d, f = t.adapter.widgetModel?.(i, a) ?? Is(t.adapter, i, a, (e) => M(s, e, !0)), p = e.shadowRoot ?? e.attachShadow({ mode: "open" });
		p.innerHTML = "";
		let m = document.createElement("div");
		return m.style.cssText = "width:100%;height:100%;min-height:0", p.append(m), (async () => {
			try {
				let e = URL.createObjectURL(new Blob([r.esm], { type: "text/javascript" })), t = await import(
					/* @vite-ignore */
					e
);
				if (URL.revokeObjectURL(e), u) return;
				let n = t.default?.render ?? t.render;
				if (typeof n != "function") throw Error("widget module exports no render()");
				let i = r.css ?? t.default?.css ?? t.css;
				if (i) {
					let e = document.createElement("style");
					e.textContent = i, p.prepend(e);
				}
				d = n({
					el: m,
					model: f
				});
			} catch (e) {
				u || M(s, e instanceof Error ? e.message : String(e), !0);
			}
		})(), () => {
			u = !0, f.close?.(), typeof d == "function" ? d() : d?.destroy?.(), p.innerHTML = "";
		};
	});
	let u = /* @__PURE__ */ j(!0), d = /* @__PURE__ */ k(() => {
		try {
			return JSON.stringify(r(), null, 2);
		} catch {
			return String(r());
		}
	});
	var f = Hs(), p = N(f), m = (e) => {
		var n = Dr();
		Yr(P(n), () => B(a), (e, n) => {
			n(e, {
				get result() {
					return r();
				},
				get module() {
					return t.module;
				},
				get version() {
					return t.version;
				}
			});
		}), U(e, n);
	}, h = (e) => {
		var t = Rs(), n = P(t), r = (e) => {
			var t = Ls(), n = F(t, !0);
			L(() => W(n, B(s))), U(e, t);
		};
		G(n, (e) => {
			B(s) && e(r);
		}), Oi(I(n, 2), (e) => M(c, e), () => B(c)), U(e, t);
	}, g = (e) => {
		var t = Bs(), n = N(t), r = F(n), i = I(n, 2), a = (e) => {
			var t = zs(), n = F(t, !0);
			L(() => W(n, B(d))), U(e, t);
		};
		G(i, (e) => {
			B(u) && e(a);
		}), O(t), L(() => W(r, `${B(u) ? "▾" : "▸"} result`)), V("click", n, () => M(u, !B(u))), U(e, t);
	}, _ = (e) => {
		var t = Vs(), n = F(N(t), !0);
		O(t), L(() => W(n, i() ? "waiting for the run…" : "no result read yet")), U(e, t);
	};
	G(p, (e) => {
		B(a) && r() !== null ? e(m) : B(o) ? e(h, 1) : r() === null ? e(_, -1) : e(g, 2);
	}), O(f), U(e, f), Ke();
}
yr(["click"]);
// node_modules/@marijn/find-cluster-break/src/index.js
function Ws(e) {
	if (e < 768) return !1;
	for (let t = 0, n = $s.length;;) {
		let r = t + n >> 1;
		if (e < $s[r]) n = r;
		else if (e >= ec[r]) t = r + 1;
		else return !0;
		if (t == n) return !1;
	}
}
function Gs(e) {
	return e >= 127462 && e <= 127487;
}
function Ks(e, t, n = !0, r = !0) {
	return (n ? qs : Js)(e, t, r);
}
function qs(e, t, n) {
	if (t == e.length) return t;
	t && Xs(e.charCodeAt(t)) && Zs(e.charCodeAt(t - 1)) && t--;
	let r = Ys(e, t);
	for (t += Qs(r); t < e.length;) {
		let i = Ys(e, t);
		if (r == tc || i == tc || n && Ws(i)) t += Qs(i), r = i;
		else if (Gs(i)) {
			let n = 0, r = t - 2;
			for (; r >= 0 && Gs(Ys(e, r));) n++, r -= 2;
			if (n % 2 == 0) break;
			t += 2;
		} else break;
	}
	return t;
}
function Js(e, t, n) {
	for (; t > 1;) {
		let r = qs(e, t - 2, n);
		if (r < t) return r;
		t--;
	}
	return 0;
}
function Ys(e, t) {
	let n = e.charCodeAt(t);
	if (!Zs(n) || t + 1 == e.length) return n;
	let r = e.charCodeAt(t + 1);
	return Xs(r) ? (n - 55296 << 10) + (r - 56320) + 65536 : n;
}
function Xs(e) {
	return e >= 56320 && e < 57344;
}
function Zs(e) {
	return e >= 55296 && e < 56320;
}
function Qs(e) {
	return e < 65536 ? 1 : 2;
}
var $s, ec, tc, nc = t((() => {
	$s = [], ec = [], (() => {
		let e = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,1n,9,16,o,,x,1i,3,,i,,7,a,2,t,3,1k,,,7,2,2,2,3,9,,a,2,q,,2,3,1k,,,5,4,2,2,3,3,,u,2,3,,b,3,1k,,,8,,3,,3,k,2,m,6,,3,1k,,,7,2,2,2,3,7,3,a,2,u,,1n,5,3,3,,4,9,,14,5,1j,,,7,,3,,4,7,2,b,2,t,3,1k,,,7,,3,,4,7,2,b,2,f,,c,4,1j,2,,7,,3,,4,9,,a,2,t,3,1y,,4,6,,,,8,i,2,1p,,,8,c,8,2q,,,a,b,7,21,2,r,,,,,,4,2,1d,k,,2,5,b,,10,9,,2u,b,,6,n,4,4,3,g,4,d,,,3,6,,f,,jj,3,qa,4,s,3,t,2,u,2,1s,w,9,,19,3,,,39,2,y,,3a,c,4,c,63,5,1l,a,,,,,2,o,2,,1c,1a,2,c,k,5,1b,h,12,9,c,3,u,d,1k,e,1c,k,48,3,,l,4,,6,,2,3,5i,1s,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,n,5,4,,2b,2,1e,i,q,i,d,,12,8,p,d,18,4,1b,e,10,,1v,e,c,,8,2,1a,,1f,,,3,2,2,5,2,,,15,5,5,2,6k,8,,2,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,1t,5,8t,2,25,6,1y,b,1d,4,3e,3,1h,f,15,,2,2,a,4,19,b,7,,1p,3,10,e,g,2,18,,c,3,1c,e,8,4,,2,2k,c,6,,2,,4d,c,l,4,1j,2,,7,2,2,2,3,9,,a,2,2,7,3,5,1v,9,,,2,,,4,,5,,,e,2,2a,i,n,,29,k,6j,7,2,9,r,2,2a,h,2y,d,2t,3,2,a,74,f,6t,6,,2,2,4,,,,2,3x,7,2,7,3,,s,a,14,7,,4,8,,9,b,1a,g,5i,8,5j,8,,8,2a,m,,e,3e,6,3,,,2,,7,,,1u,5,,2,,5,9n,4,9,2,,,1c,7,3,5,n,,44l,,6,f,8ug,i,1xc,5,1n,7,t4,,,1j,7,4,29,,b,2,f57,2,3mp,1a,2,n,f2,5,3,6,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,2s,,4g,7,af,,1p,4,e4,4,72,2,6r,,2,,7,2,5,,d6,7,31,7,240,5".split(",").map((e) => e ? parseInt(e, 36) : 1);
		for (let t = 0, n = 0; t < e.length; t++) (t % 2 ? ec : $s).push(n += e[t]);
	})(), tc = 8205;
})), rc = /* @__PURE__ */ n({
	Annotation: () => Dl,
	AnnotationType: () => Ol,
	ChangeDesc: () => ol,
	ChangeSet: () => sl,
	CharCategory: () => Nl,
	Compartment: () => _l,
	EditorSelection: () => K,
	EditorState: () => Il,
	Facet: () => q,
	Line: () => rl,
	MapMode: () => al,
	Prec: () => hl,
	Range: () => Rl,
	RangeSet: () => Bl,
	RangeSetBuilder: () => Vl,
	RangeValue: () => Ll,
	SelectionRange: () => ll,
	StateEffect: () => Al,
	StateEffectType: () => kl,
	StateField: () => pl,
	Text: () => Zc,
	Transaction: () => jl,
	codePointAt: () => dc,
	codePointSize: () => pc,
	combineConfig: () => Lc,
	countColumn: () => Yc,
	findClusterBreak: () => cc,
	findColumn: () => Xc,
	fromCodePoint: () => fc
});
function ic(e) {
	let t = -1;
	for (let n of e) t += n.length + 1;
	return t;
}
function ac(e, t, n = 0, r = 1e9) {
	for (let i = 0, a = 0, o = !0; a < e.length && i <= r; a++) {
		let s = e[a], c = i + s.length;
		c >= n && (c > r && (s = s.slice(0, r - i)), i < n && (s = s.slice(n - i)), o ? (t[t.length - 1] += s, o = !1) : t.push(s)), i = c + 1;
	}
	return t;
}
function oc(e, t, n) {
	return ac(e, [""], t, n);
}
function sc(e, t, n) {
	return t = Math.max(0, Math.min(e.length, t)), [t, Math.max(t, Math.min(e.length, n))];
}
function cc(e, t, n = !0, r = !0) {
	return Ks(e, t, n, r);
}
function lc(e) {
	return e >= 56320 && e < 57344;
}
function uc(e) {
	return e >= 55296 && e < 56320;
}
function dc(e, t) {
	let n = e.charCodeAt(t);
	if (!uc(n) || t + 1 == e.length) return n;
	let r = e.charCodeAt(t + 1);
	return lc(r) ? (n - 55296 << 10) + (r - 56320) + 65536 : n;
}
function fc(e) {
	return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
}
function pc(e) {
	return e < 65536 ? 1 : 2;
}
function mc(e, t, n, r = !1) {
	if (t == 0 && n <= 0) return;
	let i = e.length - 2;
	i >= 0 && n <= 0 && n == e[i + 1] ? e[i] += t : i >= 0 && t == 0 && e[i] == 0 ? e[i + 1] += n : r ? (e[i] += t, e[i + 1] += n) : e.push(t, n);
}
function hc(e, t, n) {
	if (n.length == 0) return;
	let r = t.length - 2 >> 1;
	if (r < e.length) e[e.length - 1] = e[e.length - 1].append(n);
	else {
		for (; e.length < r;) e.push(Zc.empty);
		e.push(n);
	}
}
function gc(e, t, n) {
	let r = e.inserted;
	for (let i = 0, a = 0, o = 0; o < e.sections.length;) {
		let s = e.sections[o++], c = e.sections[o++];
		if (c < 0) i += s, a += s;
		else {
			let l = i, u = a, d = Zc.empty;
			for (; l += s, u += c, c && r && (d = d.append(r[o - 2 >> 1])), !(n || o == e.sections.length || e.sections[o + 1] < 0);) s = e.sections[o++], c = e.sections[o++];
			t(i, l, a, u, d), i = l, a = u;
		}
	}
}
function _c(e, t, n, r = !1) {
	let i = [], a = r ? [] : null, o = new cl(e), s = new cl(t);
	for (let e = -1;;) if (o.done && s.len || s.done && o.len) throw Error("Mismatched change set lengths");
	else if (o.ins == -1 && s.ins == -1) {
		let e = Math.min(o.len, s.len);
		mc(i, e, -1), o.forward(e), s.forward(e);
	} else if (s.ins >= 0 && (o.ins < 0 || e == o.i || o.off == 0 && (s.len < o.len || s.len == o.len && !n))) {
		let t = s.len;
		for (mc(i, s.ins, -1); t;) {
			let n = Math.min(o.len, t);
			o.ins >= 0 && e < o.i && o.len <= n && (mc(i, 0, o.ins), a && hc(a, i, o.text), e = o.i), o.forward(n), t -= n;
		}
		s.next();
	} else if (o.ins >= 0) {
		let t = 0, n = o.len;
		for (; n;) if (s.ins == -1) {
			let e = Math.min(n, s.len);
			t += e, n -= e, s.forward(e);
		} else if (s.ins == 0 && s.len < n) n -= s.len, s.next();
		else break;
		mc(i, t, e < o.i ? o.ins : 0), a && e < o.i && hc(a, i, o.text), e = o.i, o.forward(o.len - n);
	} else if (o.done && s.done) return a ? sl.createSet(i, a) : ol.create(i);
	else throw Error("Mismatched change set lengths");
}
function vc(e, t, n = !1) {
	let r = [], i = n ? [] : null, a = new cl(e), o = new cl(t);
	for (let e = !1;;) if (a.done && o.done) return i ? sl.createSet(r, i) : ol.create(r);
	else if (a.ins == 0) mc(r, a.len, 0, e), a.next();
	else if (o.len == 0 && !o.done) mc(r, 0, o.ins, e), i && hc(i, r, o.text), o.next();
	else if (a.done || o.done) throw Error("Mismatched change set lengths");
	else {
		let t = Math.min(a.len2, o.len), n = r.length;
		if (a.ins == -1) {
			let n = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
			mc(r, t, n, e), i && n && hc(i, r, o.text);
		} else o.ins == -1 ? (mc(r, a.off ? 0 : a.len, t, e), i && hc(i, r, a.textBit(t))) : (mc(r, a.off ? 0 : a.len, o.off ? 0 : o.ins, e), i && !o.off && hc(i, r, o.text));
		e = (a.ins > t || o.ins >= 0 && o.len > t) && (e || r.length > n), a.forward2(t), o.forward(t);
	}
}
function yc(e, t) {
	for (let n of e.ranges) if (n.to > t) throw RangeError("Selection points outside of document");
}
function bc(e, t) {
	return e == t || e.length == t.length && e.every((e, n) => e === t[n]);
}
function xc(e, t, n) {
	if (e.length != t.length) return !1;
	for (let r = 0; r < e.length; r++) if (!n(e[r], t[r])) return !1;
	return !0;
}
function Sc(e, t) {
	let n = !1;
	for (let r of t) Ec(e, r) & 1 && (n = !0);
	return n;
}
function Cc(e, t, n) {
	let r = n.map((t) => e[t.id]), i = n.map((e) => e.type), a = r.filter((e) => !(e & 1)), o = e[t.id] >> 1;
	function s(e) {
		let n = [];
		for (let t = 0; t < r.length; t++) {
			let a = Dc(e, r[t]);
			if (i[t] == 2) for (let e of a) n.push(e);
			else n.push(a);
		}
		return t.combine(n);
	}
	return {
		create(e) {
			for (let t of r) Ec(e, t);
			return e.values[o] = s(e), 1;
		},
		update(e, n) {
			if (!Sc(e, a)) return 0;
			let r = s(e);
			return t.compare(r, e.values[o]) ? 0 : (e.values[o] = r, 1);
		},
		reconfigure(e, i) {
			let a = Sc(e, r), c = i.config.facets[t.id], l = i.facet(t);
			if (c && !a && bc(n, c)) return e.values[o] = l, 0;
			let u = s(e);
			return t.compare(u, l) ? (e.values[o] = l, 0) : (e.values[o] = u, 1);
		}
	};
}
function wc(e) {
	return (t) => new gl(t, e);
}
function Tc(e, t, n) {
	let r = [
		[],
		[],
		[],
		[],
		[]
	], i = /* @__PURE__ */ new Map();
	function a(e, o) {
		let s = i.get(e);
		if (s != null) {
			if (s <= o) return;
			let t = r[s].indexOf(e);
			t > -1 && r[s].splice(t, 1), e instanceof vl && n.delete(e.compartment);
		}
		if (i.set(e, o), Array.isArray(e)) for (let t of e) a(t, o);
		else if (e instanceof vl) {
			if (n.has(e.compartment)) throw RangeError("Duplicate use of compartment in extensions");
			let r = t.get(e.compartment) || e.inner;
			n.set(e.compartment, r), a(r, o);
		} else if (e instanceof gl) a(e.inner, e.prec);
		else if (e instanceof pl) r[o].push(e), e.provides && a(e.provides, o);
		else if (e instanceof dl) r[o].push(e), e.facet.extensions && a(e.facet.extensions, ml.default);
		else {
			let t = e.extension;
			if (!t) throw Error(`Unrecognized extension value in extension set (${e}).`);
			if (t == e) throw Error(`Unrecognized extension value in extension set (${e}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
			a(t, o);
		}
	}
	return a(e, ml.default), r.reduce((e, t) => e.concat(t));
}
function Ec(e, t) {
	if (t & 1) return 2;
	let n = t >> 1, r = e.status[n];
	if (r == 4) throw Error("Cyclic dependency between fields and/or facets");
	if (r & 2) return r;
	e.status[n] = 4;
	let i = e.computeSlot(e, e.config.dynamicSlots[n]);
	return e.status[n] = 2 | i;
}
function Dc(e, t) {
	return t & 1 ? e.config.staticValues[t >> 1] : e.values[t >> 1];
}
function Oc(e, t) {
	let n = [];
	for (let r = 0, i = 0;;) {
		let a, o;
		if (r < e.length && (i == t.length || t[i] >= e[r])) a = e[r++], o = e[r++];
		else if (i < t.length) a = t[i++], o = t[i++];
		else return n;
		!n.length || n[n.length - 1] < a ? n.push(a, o) : n[n.length - 1] < o && (n[n.length - 1] = o);
	}
}
function kc(e, t, n) {
	let r, i, a;
	return n ? (r = t.changes, i = sl.empty(t.changes.length), a = e.changes.compose(t.changes)) : (r = t.changes.map(e.changes), i = e.changes.mapDesc(t.changes, !0), a = e.changes.compose(r)), {
		changes: a,
		selection: t.selection ? t.selection.map(i) : e.selection?.map(r),
		effects: Al.mapEffects(e.effects, r).concat(Al.mapEffects(t.effects, i)),
		annotations: e.annotations.length ? e.annotations.concat(t.annotations) : t.annotations,
		scrollIntoView: e.scrollIntoView || t.scrollIntoView
	};
}
function Ac(e, t, n) {
	let r = t.selection, i = Pc(t.annotations);
	return t.userEvent && (i = i.concat(jl.userEvent.of(t.userEvent))), {
		changes: t.changes instanceof sl ? t.changes : sl.of(t.changes || [], n, e.facet(Sl)),
		selection: r && (r instanceof K ? r : K.single(r.anchor, r.head)),
		effects: Pc(t.effects),
		annotations: i,
		scrollIntoView: !!t.scrollIntoView
	};
}
function jc(e, t, n) {
	let r = Ac(e, t.length ? t[0] : {}, e.doc.length);
	t.length && t[0].filter === !1 && (n = !1);
	for (let i = 1; i < t.length; i++) {
		t[i].filter === !1 && (n = !1);
		let a = !!t[i].sequential;
		r = kc(r, Ac(e, t[i], a ? r.changes.newLength : e.doc.length), a);
	}
	let i = jl.create(e, r.changes, r.selection, r.effects, r.annotations, r.scrollIntoView);
	return Nc(n ? Mc(i) : i);
}
function Mc(e) {
	let t = e.startState, n = !0;
	for (let r of t.facet(Cl)) {
		let t = r(e);
		if (t === !1) {
			n = !1;
			break;
		}
		Array.isArray(t) && (n = n === !0 ? t : Oc(n, t));
	}
	if (n !== !0) {
		let r, i;
		if (n === !1) i = e.changes.invertedDesc, r = sl.empty(t.doc.length);
		else {
			let t = e.changes.filter(n);
			r = t.changes, i = t.filtered.mapDesc(t.changes).invertedDesc;
		}
		e = jl.create(t, r, e.selection && e.selection.map(i), Al.mapEffects(e.effects, i), e.annotations, e.scrollIntoView);
	}
	let r = t.facet(wl);
	for (let n = r.length - 1; n >= 0; n--) {
		let i = r[n](e);
		e = i instanceof jl ? i : Array.isArray(i) && i.length == 1 && i[0] instanceof jl ? i[0] : jc(t, Pc(i), !1);
	}
	return e;
}
function Nc(e) {
	let t = e.startState, n = t.facet(Tl), r = e;
	for (let i = n.length - 1; i >= 0; i--) {
		let a = n[i](e);
		a && Object.keys(a).length && (r = kc(r, Ac(t, a, e.changes.newLength), !0));
	}
	return r == e ? e : jl.create(t, e.changes, e.selection, r.effects, r.annotations, r.scrollIntoView);
}
function Pc(e) {
	return e == null ? Ml : Array.isArray(e) ? e : [e];
}
function Fc(e) {
	if (Fl) return Fl.test(e);
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (/\w/.test(n) || n > "" && (n.toUpperCase() != n.toLowerCase() || Pl.test(n))) return !0;
	}
	return !1;
}
function Ic(e) {
	return (t) => {
		if (!/\S/.test(t)) return Nl.Space;
		if (Fc(t)) return Nl.Word;
		for (let n = 0; n < e.length; n++) if (t.indexOf(e[n]) > -1) return Nl.Word;
		return Nl.Other;
	};
}
function Lc(e, t, n = {}) {
	let r = {};
	for (let t of e) for (let e of Object.keys(t)) {
		let i = t[e], a = r[e];
		if (a === void 0) r[e] = i;
		else if (a !== i && i !== void 0) {
			if (Object.hasOwnProperty.call(n, e)) r[e] = n[e](a, i);
			else throw Error("Config merge conflict for field " + e);
		}
	}
	for (let e in t) r[e] === void 0 && (r[e] = t[e]);
	return r;
}
function Rc(e, t) {
	return e == t || e.constructor == t.constructor && e.eq(t);
}
function zc(e, t) {
	return e.from - t.from || e.value.startSide - t.value.startSide;
}
function Bc(e) {
	return e[e.length - 1];
}
function Vc(e) {
	if (e.length > 1) for (let t = e[0], n = 1; n < e.length; n++) {
		let r = e[n];
		if (zc(t, r) > 0) return e.slice().sort(zc);
		t = r;
	}
	return e;
}
function Hc(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let t of e) for (let e = 0; e < t.chunk.length; e++) t.chunk[e].maxPoint <= 0 && r.set(t.chunk[e], t.chunkPos[e]);
	let i = /* @__PURE__ */ new Set();
	for (let e of t) for (let t = 0; t < e.chunk.length; t++) {
		let a = r.get(e.chunk[t]);
		a != null && (n ? n.mapPos(a) : a) == e.chunkPos[t] && !n?.touchesRange(a, a + e.chunk[t].length) && i.add(e.chunk[t]);
	}
	return i;
}
function Uc(e, t) {
	for (let n = e[t];;) {
		let r = (t << 1) + 1;
		if (r >= e.length) break;
		let i = e[r];
		if (r + 1 < e.length && i.compare(e[r + 1]) >= 0 && (i = e[r + 1], r++), n.compare(i) < 0) break;
		e[r] = n, e[t] = i, t = r;
	}
}
function Wc(e, t, n, r, i, a) {
	e.goto(t), n.goto(r);
	let o = r + i, s = r, c = r - t, l = !!a.boundChange;
	for (let t = !1;;) {
		let r = e.to + c - n.to, i = r || e.endSide - n.endSide, u = i < 0 ? e.to + c : n.to, d = Math.min(u, o);
		if (e.point || n.point ? (e.point && n.point && Rc(e.point, n.point) && Gc(e.activeForPoint(e.to), n.activeForPoint(n.to)) || a.comparePoint(s, d, e.point, n.point), t = !1) : (t &&= (a.boundChange(s), !1), d > s && !Gc(e.active, n.active) && a.compareRange(s, d, e.active, n.active), l && d < o && (r || e.openEnd(u) != n.openEnd(u)) && (t = !0)), u > o) break;
		s = u, i <= 0 && e.next(), i >= 0 && n.next();
	}
}
function Gc(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (e[n] != t[n] && !Rc(e[n], t[n])) return !1;
	return !0;
}
function Kc(e, t) {
	for (let n = t, r = e.length - 1; n < r; n++) e[n] = e[n + 1];
	e.pop();
}
function qc(e, t, n) {
	for (let n = e.length - 1; n >= t; n--) e[n + 1] = e[n];
	e[t] = n;
}
function Jc(e, t) {
	let n = -1, r = 1e9;
	for (let i = 0; i < t.length; i++) (t[i] - r || e[i].endSide - e[n].endSide) < 0 && (n = i, r = t[i]);
	return n;
}
function Yc(e, t, n = e.length) {
	let r = 0;
	for (let i = 0; i < n && i < e.length;) e.charCodeAt(i) == 9 ? (r += t - r % t, i++) : (r++, i = cc(e, i));
	return r;
}
function Xc(e, t, n, r) {
	for (let r = 0, i = 0;;) {
		if (i >= t) return r;
		if (r == e.length) break;
		i += e.charCodeAt(r) == 9 ? n - i % n : 1, r = cc(e, r);
	}
	return r === !0 ? -1 : e.length;
}
var Zc, Qc, $c, el, tl, nl, rl, il, al, ol, sl, cl, ll, K, ul, q, dl, fl, pl, ml, hl, gl, _l, vl, yl, bl, xl, Sl, Cl, wl, Tl, El, Dl, Ol, kl, Al, jl, Ml, Nl, Pl, Fl, Il, Ll, Rl, zl, Bl, Vl, Hl, Ul, Wl, Gl = t((() => {
	nc(), Zc = class e {
		lineAt(e) {
			if (e < 0 || e > this.length) throw RangeError(`Invalid position ${e} in document of length ${this.length}`);
			return this.lineInner(e, !1, 1, 0);
		}
		line(e) {
			if (e < 1 || e > this.lines) throw RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
			return this.lineInner(e, !0, 1, 0);
		}
		replace(e, t, n) {
			[e, t] = sc(this, e, t);
			let r = [];
			return this.decompose(0, e, r, 2), n.length && n.decompose(0, n.length, r, 3), this.decompose(t, this.length, r, 1), $c.from(r, this.length - (t - e) + n.length);
		}
		append(e) {
			return this.replace(this.length, this.length, e);
		}
		slice(e, t = this.length) {
			[e, t] = sc(this, e, t);
			let n = [];
			return this.decompose(e, t, n, 0), $c.from(n, t - e);
		}
		eq(e) {
			if (e == this) return !0;
			if (e.length != this.length || e.lines != this.lines) return !1;
			let t = this.scanIdentical(e, 1), n = this.length - this.scanIdentical(e, -1), r = new el(this), i = new el(e);
			for (let e = t, a = t;;) {
				if (r.next(e), i.next(e), e = 0, r.lineBreak != i.lineBreak || r.done != i.done || r.value != i.value) return !1;
				if (a += r.value.length, r.done || a >= n) return !0;
			}
		}
		iter(e = 1) {
			return new el(this, e);
		}
		iterRange(e, t = this.length) {
			return new tl(this, e, t);
		}
		iterLines(e, t) {
			let n;
			if (e == null) n = this.iter();
			else {
				t ??= this.lines + 1;
				let r = this.line(e).from;
				n = this.iterRange(r, Math.max(r, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
			}
			return new nl(n);
		}
		toString() {
			return this.sliceString(0);
		}
		toJSON() {
			let e = [];
			return this.flatten(e), e;
		}
		constructor() {}
		static of(t) {
			if (t.length == 0) throw RangeError("A document must have at least one line");
			return t.length == 1 && !t[0] ? e.empty : t.length <= 32 ? new Qc(t) : $c.from(Qc.split(t, []));
		}
	}, Qc = class e extends Zc {
		constructor(e, t = ic(e)) {
			super(), this.text = e, this.length = t;
		}
		get lines() {
			return this.text.length;
		}
		get children() {
			return null;
		}
		lineInner(e, t, n, r) {
			for (let i = 0;; i++) {
				let a = this.text[i], o = r + a.length;
				if ((t ? n : o) >= e) return new rl(r, o, n, a);
				r = o + 1, n++;
			}
		}
		decompose(t, n, r, i) {
			let a = t <= 0 && n >= this.length ? this : new e(oc(this.text, t, n), Math.min(n, this.length) - Math.max(0, t));
			if (i & 1) {
				let t = r.pop(), n = ac(a.text, t.text.slice(), 0, a.length);
				if (n.length <= 32) r.push(new e(n, t.length + a.length));
				else {
					let t = n.length >> 1;
					r.push(new e(n.slice(0, t)), new e(n.slice(t)));
				}
			} else r.push(a);
		}
		replace(t, n, r) {
			if (!(r instanceof e)) return super.replace(t, n, r);
			[t, n] = sc(this, t, n);
			let i = ac(this.text, ac(r.text, oc(this.text, 0, t)), n), a = this.length + r.length - (n - t);
			return i.length <= 32 ? new e(i, a) : $c.from(e.split(i, []), a);
		}
		sliceString(e, t = this.length, n = "\n") {
			[e, t] = sc(this, e, t);
			let r = "";
			for (let i = 0, a = 0; i <= t && a < this.text.length; a++) {
				let o = this.text[a], s = i + o.length;
				i > e && a && (r += n), e < s && t > i && (r += o.slice(Math.max(0, e - i), t - i)), i = s + 1;
			}
			return r;
		}
		flatten(e) {
			for (let t of this.text) e.push(t);
		}
		scanIdentical() {
			return 0;
		}
		static split(t, n) {
			let r = [], i = -1;
			for (let a of t) r.push(a), i += a.length + 1, r.length == 32 && (n.push(new e(r, i)), r = [], i = -1);
			return i > -1 && n.push(new e(r, i)), n;
		}
	}, $c = class e extends Zc {
		constructor(e, t) {
			super(), this.children = e, this.length = t, this.lines = 0;
			for (let t of e) this.lines += t.lines;
		}
		lineInner(e, t, n, r) {
			for (let i = 0;; i++) {
				let a = this.children[i], o = r + a.length, s = n + a.lines - 1;
				if ((t ? s : o) >= e) return a.lineInner(e, t, n, r);
				r = o + 1, n = s + 1;
			}
		}
		decompose(e, t, n, r) {
			for (let i = 0, a = 0; a <= t && i < this.children.length; i++) {
				let o = this.children[i], s = a + o.length;
				if (e <= s && t >= a) {
					let i = r & (a <= e | (s >= t ? 2 : 0));
					a >= e && s <= t && !i ? n.push(o) : o.decompose(e - a, t - a, n, i);
				}
				a = s + 1;
			}
		}
		replace(t, n, r) {
			if ([t, n] = sc(this, t, n), r.lines < this.lines) for (let i = 0, a = 0; i < this.children.length; i++) {
				let o = this.children[i], s = a + o.length;
				if (t >= a && n <= s) {
					let c = o.replace(t - a, n - a, r), l = this.lines - o.lines + c.lines;
					if (c.lines < l >> 4 && c.lines > l >> 6) {
						let a = this.children.slice();
						return a[i] = c, new e(a, this.length - (n - t) + r.length);
					}
					return super.replace(a, s, c);
				}
				a = s + 1;
			}
			return super.replace(t, n, r);
		}
		sliceString(e, t = this.length, n = "\n") {
			[e, t] = sc(this, e, t);
			let r = "";
			for (let i = 0, a = 0; i < this.children.length && a <= t; i++) {
				let o = this.children[i], s = a + o.length;
				a > e && i && (r += n), e < s && t > a && (r += o.sliceString(e - a, t - a, n)), a = s + 1;
			}
			return r;
		}
		flatten(e) {
			for (let t of this.children) t.flatten(e);
		}
		scanIdentical(t, n) {
			if (!(t instanceof e)) return 0;
			let r = 0, [i, a, o, s] = n > 0 ? [
				0,
				0,
				this.children.length,
				t.children.length
			] : [
				this.children.length - 1,
				t.children.length - 1,
				-1,
				-1
			];
			for (;; i += n, a += n) {
				if (i == o || a == s) return r;
				let e = this.children[i], c = t.children[a];
				if (e != c) return r + e.scanIdentical(c, n);
				r += e.length + 1;
			}
		}
		static from(t, n = t.reduce((e, t) => e + t.length + 1, -1)) {
			let r = 0;
			for (let e of t) r += e.lines;
			if (r < 32) {
				let e = [];
				for (let n of t) n.flatten(e);
				return new Qc(e, n);
			}
			let i = Math.max(32, r >> 5), a = i << 1, o = i >> 1, s = [], c = 0, l = -1, u = [];
			function d(t) {
				let n;
				if (t.lines > a && t instanceof e) for (let e of t.children) d(e);
				else t.lines > o && (c > o || !c) ? (f(), s.push(t)) : t instanceof Qc && c && (n = u[u.length - 1]) instanceof Qc && t.lines + n.lines <= 32 ? (c += t.lines, l += t.length + 1, u[u.length - 1] = new Qc(n.text.concat(t.text), n.length + 1 + t.length)) : (c + t.lines > i && f(), c += t.lines, l += t.length + 1, u.push(t));
			}
			function f() {
				c != 0 && (s.push(u.length == 1 ? u[0] : e.from(u, l)), l = -1, c = u.length = 0);
			}
			for (let e of t) d(e);
			return f(), s.length == 1 ? s[0] : new e(s, n);
		}
	}, Zc.empty = /*@__PURE__*/ new Qc([""], 0), el = class {
		constructor(e, t = 1) {
			this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof Qc ? e.text.length : e.children.length) << 1];
		}
		nextInner(e, t) {
			for (this.done = this.lineBreak = !1;;) {
				let n = this.nodes.length - 1, r = this.nodes[n], i = this.offsets[n], a = i >> 1, o = r instanceof Qc ? r.text.length : r.children.length;
				if (a == (t > 0 ? o : 0)) {
					if (n == 0) return this.done = !0, this.value = "", this;
					t > 0 && this.offsets[n - 1]++, this.nodes.pop(), this.offsets.pop();
				} else if ((i & 1) == (t > 0 ? 0 : 1)) {
					if (this.offsets[n] += t, e == 0) return this.lineBreak = !0, this.value = "\n", this;
					e--;
				} else if (r instanceof Qc) {
					let i = r.text[a + (t < 0 ? -1 : 0)];
					if (this.offsets[n] += t, i.length > Math.max(0, e)) return this.value = e == 0 ? i : t > 0 ? i.slice(e) : i.slice(0, i.length - e), this;
					e -= i.length;
				} else {
					let i = r.children[a + (t < 0 ? -1 : 0)];
					e > i.length ? (e -= i.length, this.offsets[n] += t) : (t < 0 && this.offsets[n]--, this.nodes.push(i), this.offsets.push(t > 0 ? 1 : (i instanceof Qc ? i.text.length : i.children.length) << 1));
				}
			}
		}
		next(e = 0) {
			return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
		}
	}, tl = class {
		constructor(e, t, n) {
			this.value = "", this.done = !1, this.cursor = new el(e, t > n ? -1 : 1), this.pos = t > n ? e.length : 0, this.from = Math.min(t, n), this.to = Math.max(t, n);
		}
		nextInner(e, t) {
			if (t < 0 ? this.pos <= this.from : this.pos >= this.to) return this.value = "", this.done = !0, this;
			e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
			let n = t < 0 ? this.pos - this.from : this.to - this.pos;
			e > n && (e = n), n -= e;
			let { value: r } = this.cursor.next(e);
			return this.pos += (r.length + e) * t, this.value = r.length <= n ? r : t < 0 ? r.slice(r.length - n) : r.slice(0, n), this.done = !this.value, this;
		}
		next(e = 0) {
			return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
		}
		get lineBreak() {
			return this.cursor.lineBreak && this.value != "";
		}
	}, nl = class {
		constructor(e) {
			this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
		}
		next(e = 0) {
			let { done: t, lineBreak: n, value: r } = this.inner.next(e);
			return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : n ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = r, this.afterBreak = !1), this;
		}
		get lineBreak() {
			return !1;
		}
	}, typeof Symbol < "u" && (Zc.prototype[Symbol.iterator] = function() {
		return this.iter();
	}, el.prototype[Symbol.iterator] = tl.prototype[Symbol.iterator] = nl.prototype[Symbol.iterator] = function() {
		return this;
	}), rl = class {
		constructor(e, t, n, r) {
			this.from = e, this.to = t, this.number = n, this.text = r;
		}
		get length() {
			return this.to - this.from;
		}
	}, il = /\r\n?|\n/, al = /*@__PURE__*/ (function(e) {
		return e[e.Simple = 0] = "Simple", e[e.TrackDel = 1] = "TrackDel", e[e.TrackBefore = 2] = "TrackBefore", e[e.TrackAfter = 3] = "TrackAfter", e;
	})(al ||= {}), ol = class e {
		constructor(e) {
			this.sections = e;
		}
		get length() {
			let e = 0;
			for (let t = 0; t < this.sections.length; t += 2) e += this.sections[t];
			return e;
		}
		get newLength() {
			let e = 0;
			for (let t = 0; t < this.sections.length; t += 2) {
				let n = this.sections[t + 1];
				e += n < 0 ? this.sections[t] : n;
			}
			return e;
		}
		get empty() {
			return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
		}
		iterGaps(e) {
			for (let t = 0, n = 0, r = 0; t < this.sections.length;) {
				let i = this.sections[t++], a = this.sections[t++];
				a < 0 ? (e(n, r, i), r += i) : r += a, n += i;
			}
		}
		iterChangedRanges(e, t = !1) {
			gc(this, e, t);
		}
		get invertedDesc() {
			let t = [];
			for (let e = 0; e < this.sections.length;) {
				let n = this.sections[e++], r = this.sections[e++];
				r < 0 ? t.push(n, r) : t.push(r, n);
			}
			return new e(t);
		}
		composeDesc(e) {
			return this.empty ? e : e.empty ? this : vc(this, e);
		}
		mapDesc(e, t = !1) {
			return e.empty ? this : _c(this, e, t);
		}
		mapPos(e, t = -1, n = al.Simple) {
			let r = 0, i = 0;
			for (let a = 0; a < this.sections.length;) {
				let o = this.sections[a++], s = this.sections[a++], c = r + o;
				if (s < 0) {
					if (c > e) return i + (e - r);
					i += o;
				} else {
					if (n != al.Simple && c >= e && (n == al.TrackDel && r < e && c > e || n == al.TrackBefore && r < e || n == al.TrackAfter && c > e)) return null;
					if (c > e || c == e && t < 0 && !o) return e == r || t < 0 ? i : i + s;
					i += s;
				}
				r = c;
			}
			if (e > r) throw RangeError(`Position ${e} is out of range for changeset of length ${r}`);
			return i;
		}
		touchesRange(e, t = e) {
			for (let n = 0, r = 0; n < this.sections.length && r <= t;) {
				let i = this.sections[n++], a = this.sections[n++], o = r + i;
				if (a >= 0 && r <= t && o >= e) return r < e && o > t ? "cover" : !0;
				r = o;
			}
			return !1;
		}
		toString() {
			let e = "";
			for (let t = 0; t < this.sections.length;) {
				let n = this.sections[t++], r = this.sections[t++];
				e += (e ? " " : "") + n + (r >= 0 ? ":" + r : "");
			}
			return e;
		}
		toJSON() {
			return this.sections;
		}
		static fromJSON(t) {
			if (!Array.isArray(t) || t.length % 2 || t.some((e) => typeof e != "number")) throw RangeError("Invalid JSON representation of ChangeDesc");
			return new e(t);
		}
		static create(t) {
			return new e(t);
		}
	}, sl = class e extends ol {
		constructor(e, t) {
			super(e), this.inserted = t;
		}
		apply(e) {
			if (this.length != e.length) throw RangeError("Applying change set to a document with the wrong length");
			return gc(this, (t, n, r, i, a) => e = e.replace(r, r + (n - t), a), !1), e;
		}
		mapDesc(e, t = !1) {
			return _c(this, e, t, !0);
		}
		invert(t) {
			let n = this.sections.slice(), r = [];
			for (let e = 0, i = 0; e < n.length; e += 2) {
				let a = n[e], o = n[e + 1];
				if (o >= 0) {
					n[e] = o, n[e + 1] = a;
					let s = e >> 1;
					for (; r.length < s;) r.push(Zc.empty);
					r.push(a ? t.slice(i, i + a) : Zc.empty);
				}
				i += a;
			}
			return new e(n, r);
		}
		compose(e) {
			return this.empty ? e : e.empty ? this : vc(this, e, !0);
		}
		map(e, t = !1) {
			return e.empty ? this : _c(this, e, t, !0);
		}
		iterChanges(e, t = !1) {
			gc(this, e, t);
		}
		get desc() {
			return ol.create(this.sections);
		}
		filter(t) {
			let n = [], r = [], i = [], a = new cl(this);
			done: for (let e = 0, o = 0;;) {
				let s = e == t.length ? 1e9 : t[e++];
				for (; o < s || o == s && a.len == 0;) {
					if (a.done) break done;
					let e = Math.min(a.len, s - o);
					mc(i, e, -1);
					let t = a.ins == -1 ? -1 : a.off == 0 ? a.ins : 0;
					mc(n, e, t), t > 0 && hc(r, n, a.text), a.forward(e), o += e;
				}
				let c = t[e++];
				for (; o < c;) {
					if (a.done) break done;
					let e = Math.min(a.len, c - o);
					mc(n, e, -1), mc(i, e, a.ins == -1 ? -1 : a.off == 0 ? a.ins : 0), a.forward(e), o += e;
				}
			}
			return {
				changes: new e(n, r),
				filtered: ol.create(i)
			};
		}
		toJSON() {
			let e = [];
			for (let t = 0; t < this.sections.length; t += 2) {
				let n = this.sections[t], r = this.sections[t + 1];
				r < 0 ? e.push(n) : r == 0 ? e.push([n]) : e.push([n].concat(this.inserted[t >> 1].toJSON()));
			}
			return e;
		}
		static of(t, n, r) {
			let i = [], a = [], o = 0, s = null;
			function c(t = !1) {
				if (!t && !i.length) return;
				o < n && mc(i, n - o, -1);
				let r = new e(i, a);
				s = s ? s.compose(r.map(s)) : r, i = [], a = [], o = 0;
			}
			function l(t) {
				if (Array.isArray(t)) for (let e of t) l(e);
				else if (t instanceof e) {
					if (t.length != n) throw RangeError(`Mismatched change set length (got ${t.length}, expected ${n})`);
					c(), s = s ? s.compose(t.map(s)) : t;
				} else {
					let { from: e, to: s = e, insert: l } = t;
					if (e > s || e < 0 || s > n) throw RangeError(`Invalid change range ${e} to ${s} (in doc of length ${n})`);
					let u = l ? typeof l == "string" ? Zc.of(l.split(r || il)) : l : Zc.empty, d = u.length;
					if (e == s && d == 0) return;
					e < o && c(), e > o && mc(i, e - o, -1), mc(i, s - e, d), hc(a, i, u), o = s;
				}
			}
			return l(t), c(!s), s;
		}
		static empty(t) {
			return new e(t ? [t, -1] : [], []);
		}
		static fromJSON(t) {
			if (!Array.isArray(t)) throw RangeError("Invalid JSON representation of ChangeSet");
			let n = [], r = [];
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				if (typeof i == "number") n.push(i, -1);
				else if (!Array.isArray(i) || typeof i[0] != "number" || i.some((e, t) => t && typeof e != "string")) throw RangeError("Invalid JSON representation of ChangeSet");
				else if (i.length == 1) n.push(i[0], 0);
				else {
					for (; r.length < e;) r.push(Zc.empty);
					r[e] = Zc.of(i.slice(1)), n.push(i[0], r[e].length);
				}
			}
			return new e(n, r);
		}
		static createSet(t, n) {
			return new e(t, n);
		}
	}, cl = class {
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
			return t >= e.length ? Zc.empty : e[t];
		}
		textBit(e) {
			let { inserted: t } = this.set, n = this.i - 2 >> 1;
			return n >= t.length && !e ? Zc.empty : t[n].slice(this.off, e == null ? void 0 : this.off + e);
		}
		forward(e) {
			e == this.len ? this.next() : (this.len -= e, this.off += e);
		}
		forward2(e) {
			this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
		}
	}, ll = class e {
		constructor(e, t, n, r) {
			this.from = e, this.to = t, this.flags = n, this.goalColumn = r;
		}
		get anchor() {
			return this.flags & 32 ? this.to : this.from;
		}
		get head() {
			return this.flags & 32 ? this.from : this.to;
		}
		get empty() {
			return this.from == this.to;
		}
		get assoc() {
			return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
		}
		get undirectional() {
			return (this.flags & 64) > 0;
		}
		get bidiLevel() {
			let e = this.flags & 7;
			return e == 7 ? null : e;
		}
		map(t, n = -1) {
			let r, i;
			return this.empty ? r = i = t.mapPos(this.from, n) : (r = t.mapPos(this.from, 1), i = t.mapPos(this.to, -1)), r == this.from && i == this.to ? this : new e(r, i, this.flags, this.goalColumn);
		}
		extend(e, t = e, n = 0) {
			if (e <= this.anchor && t >= this.anchor) return K.range(e, t, void 0, void 0, n);
			let r = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
			return K.range(this.anchor, r, void 0, void 0, n);
		}
		eq(e, t = !1) {
			return this.anchor == e.anchor && this.head == e.head && this.goalColumn == e.goalColumn && (!t || !this.empty || this.assoc == e.assoc);
		}
		toJSON() {
			return {
				anchor: this.anchor,
				head: this.head
			};
		}
		static fromJSON(e) {
			if (!e || typeof e.anchor != "number" || typeof e.head != "number") throw RangeError("Invalid JSON representation for SelectionRange");
			return K.range(e.anchor, e.head);
		}
		static create(t, n, r, i) {
			return new e(t, n, r, i);
		}
	}, K = class e {
		constructor(e, t) {
			this.ranges = e, this.mainIndex = t;
		}
		map(t, n = -1) {
			return t.empty ? this : e.create(this.ranges.map((e) => e.map(t, n)), this.mainIndex);
		}
		eq(e, t = !1) {
			if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex) return !1;
			for (let n = 0; n < this.ranges.length; n++) if (!this.ranges[n].eq(e.ranges[n], t)) return !1;
			return !0;
		}
		get main() {
			return this.ranges[this.mainIndex];
		}
		asSingle() {
			return this.ranges.length == 1 ? this : new e([this.main], 0);
		}
		addRange(t, n = !0) {
			return e.create([t].concat(this.ranges), n ? 0 : this.mainIndex + 1);
		}
		replaceRange(t, n = this.mainIndex) {
			let r = this.ranges.slice();
			return r[n] = t, e.create(r, this.mainIndex);
		}
		toJSON() {
			return {
				ranges: this.ranges.map((e) => e.toJSON()),
				main: this.mainIndex
			};
		}
		static fromJSON(t) {
			if (!t || !Array.isArray(t.ranges) || typeof t.main != "number" || t.main >= t.ranges.length) throw RangeError("Invalid JSON representation for EditorSelection");
			return new e(t.ranges.map((e) => ll.fromJSON(e)), t.main);
		}
		static single(t, n = t) {
			return new e([e.range(t, n)], 0);
		}
		static create(t, n = 0) {
			if (t.length == 0) throw RangeError("A selection needs at least one range");
			for (let r = 0, i = 0; i < t.length; i++) {
				let a = t[i];
				if (a.empty ? a.from <= r : a.from < r) return e.normalized(t.slice(), n);
				r = a.to;
			}
			return new e(t, n);
		}
		static cursor(e, t = 0, n, r) {
			return ll.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (n == null ? 7 : Math.min(6, n)), r);
		}
		static range(e, t, n, r, i) {
			let a = r == null ? 7 : Math.min(6, r);
			return !i && e != t && (i = t < e ? 1 : -1), i && (a |= i < 0 ? 8 : 16), t < e ? ll.create(t, e, a | 32, n) : ll.create(e, t, a, n);
		}
		static undirectionalRange(e, t) {
			return ll.create(e, t, 64, void 0);
		}
		static normalized(t, n = 0) {
			let r = t[n];
			t.sort((e, t) => e.from - t.from), n = t.indexOf(r);
			for (let r = 1; r < t.length; r++) {
				let i = t[r], a = t[r - 1];
				if (i.empty ? i.from <= a.to : i.from < a.to) {
					let o = a.from, s = Math.max(i.to, a.to);
					r <= n && n--, t.splice(--r, 2, i.anchor > i.head ? e.range(s, o) : e.range(o, s));
				}
			}
			return new e(t, n);
		}
	}, ul = 0, q = class e {
		constructor(e, t, n, r, i) {
			this.combine = e, this.compareInput = t, this.compare = n, this.isStatic = r, this.id = ul++, this.default = e([]), this.extensions = typeof i == "function" ? i(this) : i;
		}
		get reader() {
			return this;
		}
		static define(t = {}) {
			return new e(t.combine || ((e) => e), t.compareInput || ((e, t) => e === t), t.compare || (t.combine ? (e, t) => e === t : bc), !!t.static, t.enables);
		}
		of(e) {
			return new dl([], this, 0, e);
		}
		compute(e, t) {
			if (this.isStatic) throw Error("Can't compute a static facet");
			return new dl(e, this, 1, t);
		}
		computeN(e, t) {
			if (this.isStatic) throw Error("Can't compute a static facet");
			return new dl(e, this, 2, t);
		}
		from(e, t) {
			return t ||= (e) => e, this.compute([e], (n) => t(n.field(e)));
		}
	}, dl = class {
		constructor(e, t, n, r) {
			this.dependencies = e, this.facet = t, this.type = n, this.value = r, this.id = ul++;
		}
		dynamicSlot(e) {
			let t = this.value, n = this.facet.compareInput, r = this.id, i = e[r] >> 1, a = this.type == 2, o = !1, s = !1, c = [];
			for (let t of this.dependencies) t == "doc" ? o = !0 : t == "selection" ? s = !0 : (e[t.id] ?? 1) & 1 || c.push(e[t.id]);
			return {
				create(e) {
					return e.values[i] = t(e), 1;
				},
				update(e, r) {
					if (o && r.docChanged || s && (r.docChanged || r.selection) || Sc(e, c)) {
						let r = t(e);
						if (a ? !xc(r, e.values[i], n) : !n(r, e.values[i])) return e.values[i] = r, 1;
					}
					return 0;
				},
				reconfigure: (e, o) => {
					let s, c = o.config.address[r];
					if (c != null) {
						let r = Dc(o, c);
						if (this.dependencies.every((t) => t instanceof q ? o.facet(t) === e.facet(t) : t instanceof pl ? o.field(t, !1) == e.field(t, !1) : !0) || (a ? xc(s = t(e), r, n) : n(s = t(e), r))) return e.values[i] = r, 0;
					} else s = t(e);
					return e.values[i] = s, 1;
				}
			};
		}
		get extension() {
			return this;
		}
	}, fl = /*@__PURE__*/ q.define({ static: !0 }), pl = class e {
		constructor(e, t, n, r, i) {
			this.id = e, this.createF = t, this.updateF = n, this.compareF = r, this.spec = i, this.provides = void 0;
		}
		static define(t) {
			let n = new e(ul++, t.create, t.update, t.compare || ((e, t) => e === t), t);
			return t.provide && (n.provides = t.provide(n)), n;
		}
		create(e) {
			return (e.facet(fl).find((e) => e.field == this)?.create || this.createF)(e);
		}
		slot(e) {
			let t = e[this.id] >> 1;
			return {
				create: (e) => (e.values[t] = this.create(e), 1),
				update: (e, n) => {
					let r = e.values[t], i = this.updateF(r, n);
					return this.compareF(r, i) ? 0 : (e.values[t] = i, 1);
				},
				reconfigure: (e, n) => {
					let r = e.facet(fl), i = n.facet(fl), a;
					return (a = r.find((e) => e.field == this)) && a != i.find((e) => e.field == this) ? (e.values[t] = a.create(e), 1) : n.config.address[this.id] == null ? (e.values[t] = this.create(e), 1) : (e.values[t] = n.field(this), 0);
				}
			};
		}
		init(e) {
			return [this, fl.of({
				field: this,
				create: e
			})];
		}
		get extension() {
			return this;
		}
	}, ml = {
		lowest: 4,
		low: 3,
		default: 2,
		high: 1,
		highest: 0
	}, hl = {
		highest: /*@__PURE__*/ wc(ml.highest),
		high: /*@__PURE__*/ wc(ml.high),
		default: /*@__PURE__*/ wc(ml.default),
		low: /*@__PURE__*/ wc(ml.low),
		lowest: /*@__PURE__*/ wc(ml.lowest)
	}, gl = class {
		constructor(e, t) {
			this.inner = e, this.prec = t;
		}
		get extension() {
			return this;
		}
	}, _l = class e {
		of(e) {
			return new vl(this, e);
		}
		reconfigure(t) {
			return e.reconfigure.of({
				compartment: this,
				extension: t
			});
		}
		get(e) {
			return e.config.compartments.get(this);
		}
	}, vl = class {
		constructor(e, t) {
			this.compartment = e, this.inner = t;
		}
		get extension() {
			return this;
		}
	}, yl = class e {
		constructor(e, t, n, r, i, a) {
			for (this.base = e, this.compartments = t, this.dynamicSlots = n, this.address = r, this.staticValues = i, this.facets = a, this.statusTemplate = []; this.statusTemplate.length < n.length;) this.statusTemplate.push(0);
		}
		staticFacet(e) {
			let t = this.address[e.id];
			return t == null ? e.default : this.staticValues[t >> 1];
		}
		static resolve(t, n, r) {
			let i = [], a = Object.create(null), o = /* @__PURE__ */ new Map();
			for (let e of Tc(t, n, o)) e instanceof pl ? i.push(e) : (a[e.facet.id] || (a[e.facet.id] = [])).push(e);
			let s = Object.create(null), c = [], l = [];
			for (let e of i) s[e.id] = l.length << 1, l.push((t) => e.slot(t));
			let u = r?.config.facets;
			for (let e in a) {
				let t = a[e], n = t[0].facet, i = u && u[e] || [];
				if (t.every((e) => e.type == 0)) {
					if (s[n.id] = c.length << 1 | 1, bc(i, t)) c.push(r.facet(n));
					else {
						let e = n.combine(t.map((e) => e.value));
						c.push(r && n.compare(e, r.facet(n)) ? r.facet(n) : e);
					}
				} else {
					for (let e of t) e.type == 0 ? (s[e.id] = c.length << 1 | 1, c.push(e.value)) : (s[e.id] = l.length << 1, l.push((t) => e.dynamicSlot(t)));
					s[n.id] = l.length << 1, l.push((e) => Cc(e, n, t));
				}
			}
			let d = l.map((e) => e(s));
			return new e(t, o, d, s, c, a);
		}
	}, bl = /*@__PURE__*/ q.define(), xl = /*@__PURE__*/ q.define({
		combine: (e) => e.some((e) => e),
		static: !0
	}), Sl = /*@__PURE__*/ q.define({
		combine: (e) => e.length ? e[0] : void 0,
		static: !0
	}), Cl = /*@__PURE__*/ q.define(), wl = /*@__PURE__*/ q.define(), Tl = /*@__PURE__*/ q.define(), El = /*@__PURE__*/ q.define({ combine: (e) => e.length ? e[0] : !1 }), Dl = class {
		constructor(e, t) {
			this.type = e, this.value = t;
		}
		static define() {
			return new Ol();
		}
	}, Ol = class {
		of(e) {
			return new Dl(this, e);
		}
	}, kl = class {
		constructor(e) {
			this.map = e;
		}
		of(e) {
			return new Al(this, e);
		}
	}, Al = class e {
		constructor(e, t) {
			this.type = e, this.value = t;
		}
		map(t) {
			let n = this.type.map(this.value, t);
			return n === void 0 ? void 0 : n == this.value ? this : new e(this.type, n);
		}
		is(e) {
			return this.type == e;
		}
		static define(e = {}) {
			return new kl(e.map || ((e) => e));
		}
		static mapEffects(e, t) {
			if (!e.length) return e;
			let n = [];
			for (let r of e) {
				let e = r.map(t);
				e && n.push(e);
			}
			return n;
		}
	}, Al.reconfigure = /*@__PURE__*/ Al.define(), Al.appendConfig = /*@__PURE__*/ Al.define(), jl = class e {
		constructor(t, n, r, i, a, o) {
			this.startState = t, this.changes = n, this.selection = r, this.effects = i, this.annotations = a, this.scrollIntoView = o, this._doc = null, this._state = null, r && yc(r, n.newLength), a.some((t) => t.type == e.time) || (this.annotations = a.concat(e.time.of(Date.now())));
		}
		static create(t, n, r, i, a, o) {
			return new e(t, n, r, i, a, o);
		}
		get newDoc() {
			return this._doc ||= this.changes.apply(this.startState.doc);
		}
		get newSelection() {
			return this.selection || this.startState.selection.map(this.changes);
		}
		get state() {
			return this._state || this.startState.applyTransaction(this), this._state;
		}
		annotation(e) {
			for (let t of this.annotations) if (t.type == e) return t.value;
		}
		get docChanged() {
			return !this.changes.empty;
		}
		get reconfigured() {
			return this.startState.config != this.state.config;
		}
		isUserEvent(t) {
			let n = this.annotation(e.userEvent);
			return !!(n && (n == t || n.length > t.length && n.slice(0, t.length) == t && n[t.length] == "."));
		}
	}, jl.time = /*@__PURE__*/ Dl.define(), jl.userEvent = /*@__PURE__*/ Dl.define(), jl.addToHistory = /*@__PURE__*/ Dl.define(), jl.remote = /*@__PURE__*/ Dl.define(), Ml = [], Nl = /*@__PURE__*/ (function(e) {
		return e[e.Word = 0] = "Word", e[e.Space = 1] = "Space", e[e.Other = 2] = "Other", e;
	})(Nl ||= {}), Pl = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
	try {
		Fl = /*@__PURE__*/ RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
	} catch {}
	Il = class e {
		constructor(e, t, n, r, i, a) {
			this.config = e, this.doc = t, this.selection = n, this.values = r, this.status = e.statusTemplate.slice(), this.computeSlot = i, a && (a._state = this);
			for (let e = 0; e < this.config.dynamicSlots.length; e++) Ec(this, e << 1);
			this.computeSlot = null;
		}
		field(e, t = !0) {
			let n = this.config.address[e.id];
			if (n == null) {
				if (t) throw RangeError("Field is not present in this state");
			} else return Ec(this, n), Dc(this, n);
		}
		update(...e) {
			return jc(this, e, !0);
		}
		applyTransaction(t) {
			let n = this.config, { base: r, compartments: i } = n;
			for (let e of t.effects) e.is(_l.reconfigure) ? (n &&= (i = /* @__PURE__ */ new Map(), n.compartments.forEach((e, t) => i.set(t, e)), null), i.set(e.value.compartment, e.value.extension)) : e.is(Al.reconfigure) ? (n = null, r = e.value) : e.is(Al.appendConfig) && (n = null, r = Pc(r).concat(e.value));
			let a;
			n ? a = t.startState.values.slice() : (n = yl.resolve(r, i, this), a = new e(n, this.doc, this.selection, n.dynamicSlots.map(() => null), (e, t) => t.reconfigure(e, this), null).values);
			let o = t.startState.facet(xl) ? t.newSelection : t.newSelection.asSingle();
			new e(n, t.newDoc, o, a, (e, n) => n.update(e, t), t);
		}
		replaceSelection(e) {
			return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
				changes: {
					from: t.from,
					to: t.to,
					insert: e
				},
				range: K.cursor(t.from + e.length, -1)
			}));
		}
		changeByRange(e) {
			let t = this.selection, n = e(t.ranges[0]), r = this.changes(n.changes), i = [n.range], a = Pc(n.effects);
			for (let n = 1; n < t.ranges.length; n++) {
				let o = e(t.ranges[n]), s = this.changes(o.changes), c = s.map(r);
				for (let e = 0; e < n; e++) i[e] = i[e].map(c);
				let l = r.mapDesc(s, !0);
				i.push(o.range.map(l)), r = r.compose(c), a = Al.mapEffects(a, c).concat(Al.mapEffects(Pc(o.effects), l));
			}
			return {
				changes: r,
				selection: K.create(i, t.mainIndex),
				effects: a
			};
		}
		changes(t = []) {
			return t instanceof sl ? t : sl.of(t, this.doc.length, this.facet(e.lineSeparator));
		}
		toText(t) {
			return Zc.of(t.split(this.facet(e.lineSeparator) || il));
		}
		sliceDoc(e = 0, t = this.doc.length) {
			return this.doc.sliceString(e, t, this.lineBreak);
		}
		facet(e) {
			let t = this.config.address[e.id];
			return t == null ? e.default : (Ec(this, t), Dc(this, t));
		}
		toJSON(e) {
			let t = {
				doc: this.sliceDoc(),
				selection: this.selection.toJSON()
			};
			if (e) for (let n in e) {
				let r = e[n];
				r instanceof pl && this.config.address[r.id] != null && (t[n] = r.spec.toJSON(this.field(e[n]), this));
			}
			return t;
		}
		static fromJSON(t, n = {}, r) {
			if (!t || typeof t.doc != "string") throw RangeError("Invalid JSON representation for EditorState");
			let i = [];
			if (r) {
				for (let e in r) if (Object.prototype.hasOwnProperty.call(t, e)) {
					let n = r[e], a = t[e];
					i.push(n.init((e) => n.spec.fromJSON(a, e)));
				}
			}
			return e.create({
				doc: t.doc,
				selection: K.fromJSON(t.selection),
				extensions: n.extensions ? i.concat([n.extensions]) : i
			});
		}
		static create(t = {}) {
			let n = yl.resolve(t.extensions || [], /* @__PURE__ */ new Map()), r = t.doc instanceof Zc ? t.doc : Zc.of((t.doc || "").split(n.staticFacet(e.lineSeparator) || il)), i = t.selection ? t.selection instanceof K ? t.selection : K.single(t.selection.anchor, t.selection.head) : K.single(0);
			return yc(i, r.length), n.staticFacet(xl) || (i = i.asSingle()), new e(n, r, i, n.dynamicSlots.map(() => null), (e, t) => t.create(e), null);
		}
		get tabSize() {
			return this.facet(e.tabSize);
		}
		get lineBreak() {
			return this.facet(e.lineSeparator) || "\n";
		}
		get readOnly() {
			return this.facet(El);
		}
		phrase(t, ...n) {
			for (let n of this.facet(e.phrases)) if (Object.prototype.hasOwnProperty.call(n, t)) {
				t = n[t];
				break;
			}
			return n.length && (t = t.replace(/\$(\$|\d*)/g, (e, t) => {
				if (t == "$") return "$";
				let r = +(t || 1);
				return !r || r > n.length ? e : n[r - 1];
			})), t;
		}
		languageDataAt(e, t, n = -1) {
			let r = [];
			for (let i of this.facet(bl)) for (let a of i(this, t, n)) Object.prototype.hasOwnProperty.call(a, e) && r.push(a[e]);
			return r;
		}
		charCategorizer(e) {
			let t = this.languageDataAt("wordChars", e);
			return Ic(t.length ? t[0] : "");
		}
		wordAt(e) {
			let { text: t, from: n, length: r } = this.doc.lineAt(e), i = this.charCategorizer(e), a = e - n, o = e - n;
			for (; a > 0;) {
				let e = cc(t, a, !1);
				if (i(t.slice(e, a)) != Nl.Word) break;
				a = e;
			}
			for (; o < r;) {
				let e = cc(t, o);
				if (i(t.slice(o, e)) != Nl.Word) break;
				o = e;
			}
			return a == o ? null : K.range(a + n, o + n);
		}
	}, Il.allowMultipleSelections = xl, Il.tabSize = /*@__PURE__*/ q.define({ combine: (e) => e.length ? e[0] : 4 }), Il.lineSeparator = Sl, Il.readOnly = El, Il.phrases = /*@__PURE__*/ q.define({ compare(e, t) {
		let n = Object.keys(e), r = Object.keys(t);
		return n.length == r.length && n.every((n) => e[n] == t[n]);
	} }), Il.languageData = bl, Il.changeFilter = Cl, Il.transactionFilter = wl, Il.transactionExtender = Tl, _l.reconfigure = /*@__PURE__*/ Al.define(), Ll = class {
		eq(e) {
			return this == e;
		}
		range(e, t = e) {
			return Rl.create(e, t, this);
		}
	}, Ll.prototype.startSide = Ll.prototype.endSide = 0, Ll.prototype.point = !1, Ll.prototype.mapMode = al.TrackDel, Rl = class e {
		constructor(e, t, n) {
			this.from = e, this.to = t, this.value = n;
		}
		static create(t, n, r) {
			return new e(t, n, r);
		}
	}, zl = class e {
		constructor(e, t, n, r) {
			this.from = e, this.to = t, this.value = n, this.maxPoint = r;
		}
		get length() {
			return Bc(this.to);
		}
		findIndex(e, t, n, r = 0) {
			let i = n ? this.to : this.from;
			for (let a = r, o = i.length;;) {
				if (a == o) return a;
				let r = a + o >> 1, s = i[r] - e || (n ? this.value[r].endSide : this.value[r].startSide) - t;
				if (r == a) return s >= 0 ? a : o;
				s >= 0 ? o = r : a = r + 1;
			}
		}
		between(e, t, n, r) {
			for (let i = this.findIndex(t, -1e9, !0), a = this.findIndex(n, 1e9, !1, i); i < a; i++) if (r(this.from[i] + e, this.to[i] + e, this.value[i]) === !1) return !1;
		}
		map(t, n, r, i, a) {
			let o = [], s = [], c = [], l = -1, u = -1;
			iter: for (let e = 0; e < this.value.length; e++) {
				let d = this.value[e], f = this.from[e] + t, p = this.to[e] + t, m, h;
				if (f == p) {
					let e = n.mapPos(f, d.startSide, d.mapMode);
					if (e == null || (m = h = e, d.startSide != d.endSide && (h = n.mapPos(f, d.endSide), h < m))) continue;
				} else if (m = n.mapPos(f, d.startSide), h = n.mapPos(p, d.endSide), m > h || m == h && d.startSide > 0 && d.endSide <= 0) continue;
				if (!((h - m || d.endSide - d.startSide) < 0)) {
					if (l < 0 && (l = m), d.point && (u = Math.max(u, h - m)), (m - r || d.startSide - i) >= 0) o.push(d), s.push(m - l), c.push(h - l), r = h, i = d.endSide;
					else {
						if (m == h) for (let e = o.length; e > 0; e--) {
							if ((m - (c[e - 1] + l) || d.startSide - o[e - 1].endSide) >= 0) {
								o.splice(e, 0, d), s.splice(e, 0, m - l), c.splice(e, 0, h - l);
								continue iter;
							}
							if ((m - (s[e - 1] + l) || d.endSide - o[e - 1].startSide) > 0) break;
						}
						a(m, h, d);
					}
				}
			}
			return {
				mapped: o.length ? new e(s, c, o, u) : null,
				pos: l
			};
		}
	}, Bl = class e {
		constructor(e, t, n, r) {
			this.chunkPos = e, this.chunk = t, this.nextLayer = n, this.maxPoint = r;
		}
		static create(t, n, r, i) {
			return new e(t, n, r, i);
		}
		get length() {
			let e = this.chunk.length - 1;
			return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
		}
		get size() {
			if (this.isEmpty) return 0;
			let e = this.nextLayer.size;
			for (let t of this.chunk) e += t.value.length;
			return e;
		}
		chunkEnd(e) {
			return this.chunkPos[e] + this.chunk[e].length;
		}
		update(t) {
			let { add: n = [], sort: r = !1, filterFrom: i = 0, filterTo: a = this.length } = t, o = t.filter;
			if (n.length == 0 && !o) return this;
			if (r && (n = n.slice().sort(zc)), this.isEmpty) return n.length ? e.of(n) : this;
			let s = new Hl(this, null, -1).goto(0), c = 0, l = [], u = new Vl();
			for (; s.value || c < n.length;) if (c < n.length && (s.from - n[c].from || s.startSide - n[c].value.startSide) >= 0) {
				let e = n[c++];
				u.addInner(e.from, e.to, e.value, !1) || l.push(e);
			} else s.rangeIndex == 1 && s.chunkIndex < this.chunk.length && (c == n.length || this.chunkEnd(s.chunkIndex) < n[c].from) && (!o || i > this.chunkEnd(s.chunkIndex) || a < this.chunkPos[s.chunkIndex]) && u.addChunk(this.chunkPos[s.chunkIndex], this.chunk[s.chunkIndex]) ? s.nextChunk() : ((!o || i > s.to || a < s.from || o(s.from, s.to, s.value)) && (u.addInner(s.from, s.to, s.value, !1) || l.push(Rl.create(s.from, s.to, s.value))), s.next());
			return u.finishInner(this.nextLayer.isEmpty && !l.length ? e.empty : this.nextLayer.update({
				add: l,
				filter: o,
				filterFrom: i,
				filterTo: a
			}));
		}
		map(t) {
			if (t.empty || this.isEmpty) return this;
			let n = [], r = [], i = -1, a, o = (e, t, n) => {
				a ||= new Vl(), a.addRange(e, t, n, !1);
			};
			for (let e = 0; e < this.chunk.length; e++) {
				let a = this.chunkPos[e], s = this.chunk[e], c = t.touchesRange(a, a + s.length);
				if (c === !1) i = Math.max(i, s.maxPoint), n.push(s), r.push(t.mapPos(a));
				else if (c === !0) {
					let [e, c] = n.length ? [Bc(r) + Bc(n).length, Bc(Bc(n).value).endSide] : [-1, -1], { mapped: l, pos: u } = s.map(a, t, e, c, o);
					l && (i = Math.max(i, l.maxPoint), n.push(l), r.push(u));
				}
			}
			let s = this.nextLayer.map(t);
			return a && (s = a.finishInner(s)), n.length == 0 ? s : new e(r, n, s || e.empty, i);
		}
		between(e, t, n) {
			if (!this.isEmpty) {
				for (let r = 0; r < this.chunk.length; r++) {
					let i = this.chunkPos[r], a = this.chunk[r];
					if (t >= i && e <= i + a.length && a.between(i, e - i, t - i, n) === !1) return;
				}
				this.nextLayer.between(e, t, n);
			}
		}
		iter(e = 0) {
			return Ul.from([this]).goto(e);
		}
		get isEmpty() {
			return this.nextLayer == this;
		}
		static iter(e, t = 0) {
			return Ul.from(e).goto(t);
		}
		static compare(e, t, n, r, i = -1) {
			let a = e.filter((e) => e.maxPoint > 0 || !e.isEmpty && e.maxPoint >= i), o = t.filter((e) => e.maxPoint > 0 || !e.isEmpty && e.maxPoint >= i), s = Hc(a, o, n), c = new Wl(a, s, i), l = new Wl(o, s, i);
			n.iterGaps((e, t, n) => Wc(c, e, l, t, n, r)), n.empty && n.length == 0 && Wc(c, 0, l, 0, 0, r);
		}
		static eq(e, t, n = 0, r) {
			r ??= 1e9 - 1;
			let i = e.filter((e) => !e.isEmpty && t.indexOf(e) < 0), a = t.filter((t) => !t.isEmpty && e.indexOf(t) < 0);
			if (i.length != a.length) return !1;
			if (!i.length) return !0;
			let o = Hc(i, a), s = new Wl(i, o, 0).goto(n), c = new Wl(a, o, 0).goto(n);
			for (;;) {
				if (s.to != c.to || !Gc(s.active, c.active) || s.point && (!c.point || !Rc(s.point, c.point))) return !1;
				if (s.to > r) return !0;
				s.next(), c.next();
			}
		}
		static spans(e, t, n, r, i = -1) {
			let a = new Wl(e, null, i).goto(t), o = t, s = a.openStart;
			for (;;) {
				let e = Math.min(a.to, n);
				if (a.point) {
					let n = a.activeForPoint(a.to), i = a.pointFrom < t ? n.length + 1 : a.point.startSide < 0 ? n.length : Math.min(n.length, s);
					r.point(o, e, a.point, n, i, a.pointRank), s = Math.min(a.openEnd(e), n.length);
				} else e > o && (r.span(o, e, a.active, s), s = a.openEnd(e));
				if (a.to > n) return s + (a.point && a.to > n ? 1 : 0);
				o = a.to, a.next();
			}
		}
		static of(e, t = !1) {
			let n = new Vl();
			for (let r of e instanceof Rl ? [e] : t ? Vc(e) : e) n.add(r.from, r.to, r.value);
			return n.finish();
		}
		static join(t) {
			if (!t.length) return e.empty;
			let n = Bc(t);
			for (let r = t.length - 2; r >= 0; r--) for (let i = t[r]; i != e.empty; i = i.nextLayer) n = new e(i.chunkPos, i.chunk, n, Math.max(i.maxPoint, n.maxPoint));
			return n;
		}
	}, Bl.empty = /*@__PURE__*/ new Bl([], [], null, -1), Bl.empty.nextLayer = Bl.empty, Vl = class e {
		finishChunk(e) {
			this.chunks.push(new zl(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
		}
		constructor() {
			this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
		}
		add(e, t, n) {
			this.addRange(e, t, n, !0);
		}
		addRange(t, n, r, i) {
			this.addInner(t, n, r, i) || (this.nextLayer ||= new e()).addRange(t, n, r, i);
		}
		addInner(e, t, n, r) {
			let i = e - this.lastTo || n.startSide - this.last.endSide;
			if (r && i <= 0 && (e - this.lastFrom || n.startSide - this.last.startSide) < 0) throw Error("Ranges must be added sorted by `from` position and `startSide`");
			return i < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = n, this.lastFrom = e, this.lastTo = t, this.value.push(n), n.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
		}
		addChunk(e, t) {
			if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0) return !1;
			this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
			let n = t.value.length - 1;
			return this.last = t.value[n], this.lastFrom = t.from[n] + e, this.lastTo = t.to[n] + e, !0;
		}
		finish() {
			return this.finishInner(Bl.empty);
		}
		finishInner(e) {
			if (this.from.length && this.finishChunk(!1), this.chunks.length == 0) return e;
			let t = Bl.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
			return this.from = null, t;
		}
	}, Hl = class {
		constructor(e, t, n, r = 0) {
			this.layer = e, this.skip = t, this.minPoint = n, this.rank = r;
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
		gotoInner(e, t, n) {
			for (; this.chunkIndex < this.layer.chunk.length;) {
				let t = this.layer.chunk[this.chunkIndex];
				if (!(this.skip && this.skip.has(t) || this.layer.chunkEnd(this.chunkIndex) < e || t.maxPoint < this.minPoint)) break;
				this.chunkIndex++, n = !1;
			}
			if (this.chunkIndex < this.layer.chunk.length) {
				let r = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
				(!n || this.rangeIndex < r) && this.setRangeIndex(r);
			}
			this.next();
		}
		forward(e, t) {
			(this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
		}
		next() {
			for (;;) if (this.chunkIndex == this.layer.chunk.length) {
				this.from = this.to = 1e9, this.value = null;
				break;
			} else {
				let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], n = e + t.from[this.rangeIndex];
				if (this.from = n, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint) break;
			}
		}
		setRangeIndex(e) {
			if (e == this.layer.chunk[this.chunkIndex].value.length) {
				if (this.chunkIndex++, this.skip) for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]);) this.chunkIndex++;
				this.rangeIndex = 0;
			} else this.rangeIndex = e;
		}
		nextChunk() {
			this.chunkIndex++, this.rangeIndex = 0, this.next();
		}
		compare(e) {
			return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
		}
	}, Ul = class e {
		constructor(e) {
			this.heap = e;
		}
		static from(t, n = null, r = -1) {
			let i = [];
			for (let e = 0; e < t.length; e++) for (let a = t[e]; !a.isEmpty; a = a.nextLayer) a.maxPoint >= r && i.push(new Hl(a, n, r, e));
			return i.length == 1 ? i[0] : new e(i);
		}
		get startSide() {
			return this.value ? this.value.startSide : 0;
		}
		goto(e, t = -1e9) {
			for (let n of this.heap) n.goto(e, t);
			for (let e = this.heap.length >> 1; e >= 0; e--) Uc(this.heap, e);
			return this.next(), this;
		}
		forward(e, t) {
			for (let n of this.heap) n.forward(e, t);
			for (let e = this.heap.length >> 1; e >= 0; e--) Uc(this.heap, e);
			(this.to - e || this.value.endSide - t) < 0 && this.next();
		}
		next() {
			if (this.heap.length == 0) this.from = this.to = 1e9, this.value = null, this.rank = -1;
			else {
				let e = this.heap[0];
				this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), Uc(this.heap, 0);
			}
		}
	}, Wl = class {
		constructor(e, t, n) {
			this.minPoint = n, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = Ul.from(e, t, n);
		}
		goto(e, t = -1e9) {
			return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
		}
		forward(e, t) {
			for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0;) this.removeActive(this.minActive);
			this.cursor.forward(e, t);
		}
		removeActive(e) {
			Kc(this.active, e), Kc(this.activeTo, e), Kc(this.activeRank, e), this.minActive = Jc(this.active, this.activeTo);
		}
		addActive(e) {
			let t = 0, { value: n, to: r, rank: i } = this.cursor;
			for (; t < this.activeRank.length && (i - this.activeRank[t] || r - this.activeTo[t]) > 0;) t++;
			qc(this.active, t, n), qc(this.activeTo, t, r), qc(this.activeRank, t, i), e && qc(e, t, this.cursor.from), this.minActive = Jc(this.active, this.activeTo);
		}
		next() {
			let e = this.to, t = this.point;
			this.point = null;
			let n = this.openStart < 0 ? [] : null;
			for (;;) {
				let r = this.minActive;
				if (r > -1 && (this.activeTo[r] - this.cursor.from || this.active[r].endSide - this.cursor.startSide) < 0) {
					if (this.activeTo[r] > e) {
						this.to = this.activeTo[r], this.endSide = this.active[r].endSide;
						break;
					}
					this.removeActive(r), n && Kc(n, r);
				} else if (!this.cursor.value) {
					this.to = this.endSide = 1e9;
					break;
				} else if (this.cursor.from > e) {
					this.to = this.cursor.from, this.endSide = this.cursor.startSide;
					break;
				} else {
					let e = this.cursor.value;
					if (!e.point) this.addActive(n), this.cursor.next();
					else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to) this.cursor.next();
					else {
						this.point = e, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = e.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
						break;
					}
				}
			}
			if (n) {
				this.openStart = 0;
				for (let t = n.length - 1; t >= 0 && n[t] < e; t--) this.openStart++;
			}
		}
		activeForPoint(e) {
			if (!this.active.length) return this.active;
			let t = [];
			for (let n = this.active.length - 1; n >= 0 && !(this.activeRank[n] < this.pointRank); n--) (this.activeTo[n] > e || this.activeTo[n] == e && this.active[n].endSide >= this.point.endSide) && t.push(this.active[n]);
			return t.reverse();
		}
		openEnd(e) {
			let t = 0;
			for (let n = this.activeTo.length - 1; n >= 0 && this.activeTo[n] > e; n--) t++;
			return t;
		}
	};
})), Kl, ql, Jl, Yl, Xl, Zl, Ql, $l = t((() => {
	Kl = "ͼ", ql = typeof Symbol > "u" ? "__ͼ" : Symbol.for(Kl), Jl = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), Yl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {}, Xl = class {
		constructor(e, t) {
			this.rules = [];
			let { finish: n } = t || {};
			function r(e) {
				return /^@/.test(e) ? [e] : e.split(/,\s*/);
			}
			function i(e, t, a, o) {
				let s = [], c = /^@(\w+)\b/.exec(e[0]), l = c && c[1] == "keyframes";
				if (c && t == null) return a.push(e[0] + ";");
				for (let n in t) {
					let o = t[n];
					if (/&/.test(n)) i(n.split(/,\s*/).map((t) => e.map((e) => t.replace(/&/, e))).reduce((e, t) => e.concat(t)), o, a);
					else if (o && typeof o == "object") {
						if (!c) throw RangeError("The value of a property (" + n + ") should be a primitive value.");
						i(r(n), o, s, l);
					} else o != null && s.push(n.replace(/_.*/, "").replace(/[A-Z]/g, (e) => "-" + e.toLowerCase()) + ": " + o + ";");
				}
				(s.length || l) && a.push((n && !c && !o ? e.map(n) : e).join(", ") + " {" + s.join(" ") + "}");
			}
			for (let t in e) i(r(t), e[t], this.rules);
		}
		getRules() {
			return this.rules.join("\n");
		}
		static newName() {
			let e = Yl[ql] || 1;
			return Yl[ql] = e + 1, Kl + e.toString(36);
		}
		static mount(e, t, n) {
			let r = e[Jl], i = n && n.nonce;
			r ? i && r.setNonce(i) : r = new Ql(e, i), r.mount(Array.isArray(t) ? t : [t], e);
		}
	}, Zl = /* @__PURE__ */ new Map(), Ql = class {
		constructor(e, t) {
			let n = e.ownerDocument || e, r = n.defaultView;
			if (!e.head && e.adoptedStyleSheets && r.CSSStyleSheet) {
				let t = Zl.get(n);
				if (t) return e[Jl] = t;
				this.sheet = new r.CSSStyleSheet(), Zl.set(n, this);
			} else this.styleTag = n.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
			this.modules = [], e[Jl] = this;
		}
		mount(e, t) {
			let n = this.sheet, r = 0, i = 0, a = !1;
			for (let t = 0; t < e.length; t++) {
				let o = e[t], s = this.modules.indexOf(o);
				if (s < i && s > -1 && (this.modules.splice(s, 1), a = !0, i--, s = -1), s == -1) {
					if (this.modules.splice(i++, 0, o), a = !0, n) for (let e = 0; e < o.rules.length; e++) n.insertRule(o.rules[e], r++);
				} else {
					for (; i < s;) r += this.modules[i++].rules.length;
					r += o.rules.length, i++;
				}
			}
			if (n) t.adoptedStyleSheets.indexOf(this.sheet) < 0 && (t.adoptedStyleSheets = [this.sheet, ...t.adoptedStyleSheets]);
			else {
				if (a) {
					let e = "";
					for (let t = 0; t < this.modules.length; t++) e += this.modules[t].getRules() + "\n";
					this.styleTag.textContent = e;
				}
				let e = t.head || t;
				this.styleTag.parentNode != e && e.insertBefore(this.styleTag, e.firstChild);
			}
		}
		setNonce(e) {
			this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
		}
	};
}));
// node_modules/w3c-keyname/index.js
function eu(e) {
	var t = !(ru && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey || iu && e.shiftKey && e.key && e.key.length == 1 || e.key == "Unidentified") && e.key || (e.shiftKey ? nu : tu)[e.keyCode] || e.key || "Unidentified";
	return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
var tu, nu, ru, iu, au, ou = t((() => {
	for (tu = {
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
	}, nu = {
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
		222: "\""
	}, ru = typeof navigator < "u" && /Mac/.test(navigator.platform), iu = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), au = 0; au < 10; au++) tu[48 + au] = tu[96 + au] = String(au);
	for (au = 1; au <= 24; au++) tu[au + 111] = "F" + au;
	for (au = 65; au <= 90; au++) tu[au] = String.fromCharCode(au + 32), nu[au] = String.fromCharCode(au);
	for (var e in tu) nu.hasOwnProperty(e) || (nu[e] = tu[e]);
}));
// node_modules/crelt/index.js
function su() {
	var e = arguments[0];
	typeof e == "string" && (e = document.createElement(e));
	var t = 1, n = arguments[1];
	if (n && typeof n == "object" && n.nodeType == null && !Array.isArray(n)) {
		for (var r in n) if (Object.prototype.hasOwnProperty.call(n, r)) {
			var i = n[r];
			typeof i == "string" ? e.setAttribute(r, i) : i != null && (e[r] = i);
		}
		t++;
	}
	for (; t < arguments.length; t++) cu(e, arguments[t]);
	return e;
}
function cu(e, t) {
	if (typeof t == "string") e.appendChild(document.createTextNode(t));
	else if (t != null) {
		if (t.nodeType != null) e.appendChild(t);
		else if (Array.isArray(t)) for (var n = 0; n < t.length; n++) cu(e, t[n]);
		else throw RangeError("Unsupported child node: " + t);
	}
}
var lu = t((() => {})), uu = /* @__PURE__ */ n({
	BidiSpan: () => hm,
	BlockInfo: () => Gh,
	BlockType: () => Xp,
	BlockWrapper: () => em,
	Decoration: () => Y,
	Direction: () => sm,
	EditorView: () => X,
	GutterMarker: () => O_,
	MatchDecorator: () => Hg,
	RectangleMarker: () => Ag,
	ViewPlugin: () => Im,
	ViewUpdate: () => Jm,
	WidgetType: () => Yp,
	__test: () => Y_,
	activateHover: () => mp,
	closeHoverTooltip: () => _p,
	closeHoverTooltips: () => b_,
	crosshairCursor: () => op,
	drawSelection: () => Vf,
	dropCursor: () => Gf,
	getDialog: () => Cp,
	getDrawSelectionConfig: () => Hf,
	getPanel: () => bp,
	getTooltip: () => hp,
	gutter: () => Tp,
	gutterLineClass: () => k_,
	gutterWidgetClass: () => A_,
	gutters: () => Ep,
	hasHoverTooltips: () => gp,
	highlightActiveLine: () => $f,
	highlightActiveLineGutter: () => Np,
	highlightSpecialChars: () => Yf,
	highlightTrailingWhitespace: () => Ip,
	highlightWhitespace: () => Fp,
	hoverTooltip: () => pp,
	keymap: () => Tg,
	layer: () => Bf,
	lineNumberMarkers: () => R_,
	lineNumberWidgetMarker: () => z_,
	lineNumbers: () => jp,
	logException: () => td,
	panels: () => yp,
	placeholder: () => ep,
	rectangularSelection: () => ap,
	repositionTooltips: () => vp,
	runScopeHandlers: () => Nf,
	scrollPastEnd: () => Qf,
	showDialog: () => Sp,
	showPanel: () => w_,
	showTooltip: () => f_,
	tooltips: () => sp
});
function du(e, t) {
	for (let n in e) n == "class" && t.class ? t.class += " " + e.class : n == "style" && t.style ? t.style += ";" + e.style : t[n] = e[n];
	return t;
}
function fu(e, t, n) {
	if (e == t) return !0;
	e ||= Jp, t ||= Jp;
	let r = Object.keys(e), i = Object.keys(t);
	if (r.length - 0 != i.length - 0) return !1;
	for (let a of r) if (a != n && (i.indexOf(a) == -1 || e[a] !== t[a])) return !1;
	return !0;
}
function pu(e, t) {
	for (let n = e.attributes.length - 1; n >= 0; n--) {
		let r = e.attributes[n].name;
		t[r] ?? e.removeAttribute(r);
	}
	for (let n in t) {
		let r = t[n];
		n == "style" ? e.style.cssText = r : e.getAttribute(n) != r && e.setAttribute(n, r);
	}
}
function mu(e, t, n) {
	let r = !1;
	if (t) for (let i in t) n && i in n || (r = !0, i == "style" ? e.style.cssText = "" : e.removeAttribute(i));
	if (n) for (let i in n) t && t[i] == n[i] || (r = !0, i == "style" ? e.style.cssText = n[i] : e.setAttribute(i, n[i]));
	return r;
}
function hu(e) {
	let t = Object.create(null);
	for (let n = 0; n < e.attributes.length; n++) {
		let r = e.attributes[n];
		t[r.name] = r.value;
	}
	return t;
}
function gu(e, t = !1) {
	let { inclusiveStart: n, inclusiveEnd: r } = e;
	return n ??= e.inclusive, r ??= e.inclusive, {
		start: n ?? t,
		end: r ?? t
	};
}
function _u(e, t) {
	return e == t || !!(e && t && e.compare(t));
}
function vu(e, t, n, r = 0) {
	let i = n.length - 1;
	i >= 0 && n[i] + r >= e ? n[i] = Math.max(n[i], t) : n.push(e, t);
}
function yu(e) {
	let t;
	return t = e.nodeType == 11 ? e.getSelection ? e : e.ownerDocument : e, t.getSelection();
}
function bu(e, t) {
	return t ? e == t || e.contains(t.nodeType == 1 ? t : t.parentNode) : !1;
}
function xu(e, t) {
	if (!t.anchorNode) return !1;
	try {
		return bu(e, t.anchorNode);
	} catch {
		return !1;
	}
}
function Su(e) {
	return nm(e) ? Iu(e, 0, e.nodeValue.length).getClientRects() : tm(e) ? e.getClientRects() : [];
}
function Cu(e, t, n, r) {
	return n ? Eu(e, t, n, r, -1) || Eu(e, t, n, r, 1) : !1;
}
function wu(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}
function Tu(e) {
	return tm(e) && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(e.nodeName);
}
function Eu(e, t, n, r, i) {
	for (;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : Du(e))) {
			if (e.nodeName == "DIV") return !1;
			let n = e.parentNode;
			if (!n || !tm(n)) return !1;
			t = wu(e) + (i < 0 ? 0 : 1), e = n;
		} else if (tm(e)) {
			if (e = e.childNodes[t + (i < 0 ? -1 : 0)], tm(e) && (e.nodeName == "IMG" || e.nodeName == "BR" || e.contentEditable == "false")) return !1;
			t = i < 0 ? Du(e) : 0;
		} else return !1;
	}
}
function Du(e) {
	return nm(e) ? e.nodeValue.length : e.childNodes.length;
}
function Ou(e, t) {
	let { left: n, right: r } = e;
	if (n == r) return e;
	let i = t ? n : r;
	return {
		left: i,
		right: i,
		top: e.top,
		bottom: e.bottom
	};
}
function ku(e) {
	let t = e.visualViewport;
	return t ? {
		left: 0,
		right: t.width,
		top: 0,
		bottom: t.height
	} : {
		left: 0,
		right: e.innerWidth,
		top: 0,
		bottom: e.innerHeight
	};
}
function Au(e, t) {
	let n = t.width / e.offsetWidth, r = t.height / e.offsetHeight;
	return (n > .995 && n < 1.005 || !isFinite(n) || Math.abs(t.width - e.offsetWidth) < 1) && (n = 1), (r > .995 && r < 1.005 || !isFinite(r) || Math.abs(t.height - e.offsetHeight) < 1) && (r = 1), {
		scaleX: n,
		scaleY: r
	};
}
function ju(e, t, n, r, i, a, o, s) {
	let c = e.ownerDocument, l = c.defaultView || window;
	for (let u = e, d = !1; u && !d;) if (tm(u)) {
		let e, f = u == c.body, p = 1, m = 1, h = !0, g = !0;
		if (f) e = ku(l);
		else {
			let t = getComputedStyle(u);
			if (/^(fixed|sticky)$/.test(t.position) && (d = !0), (u.scrollHeight <= u.clientHeight || !/auto|scroll/.test(t.overflowY)) && (g = !1), (u.scrollWidth <= u.clientWidth || !/auto|scroll/.test(t.overflowX)) && (h = !1), !h && !g) {
				u = u.assignedSlot || u.parentNode;
				continue;
			}
			let n = u.getBoundingClientRect();
			({scaleX: p, scaleY: m} = Au(u, n)), e = {
				left: n.left,
				right: n.left + u.clientWidth * p,
				top: n.top,
				bottom: n.top + u.clientHeight * m
			};
		}
		let _ = 0, v = 0;
		if (g) {
			if (i == "nearest") t.top < e.top + o ? (v = t.top - (e.top + o), n > 0 && t.bottom > e.bottom + v && (v = t.bottom - e.bottom + o)) : t.bottom > e.bottom - o && (v = t.bottom - e.bottom + o, n < 0 && t.top - v < e.top && (v = t.top - (e.top + o)));
			else {
				let r = t.bottom - t.top, a = e.bottom - e.top;
				v = (i == "center" && r <= a ? t.top + r / 2 - a / 2 : i == "start" || i == "center" && n < 0 ? t.top - o : t.bottom - a + o) - e.top;
			}
		}
		if (h && (r == "nearest" ? t.left < e.left + a ? (_ = t.left - (e.left + a), n > 0 && t.right > e.right + _ && (_ = t.right - e.right + a)) : t.right > e.right - a && (_ = t.right - e.right + a, n < 0 && t.left < e.left + _ && (_ = t.left - (e.left + a))) : _ = (r == "center" ? t.left + (t.right - t.left) / 2 - (e.right - e.left) / 2 : r == "start" == s ? t.left - a : t.right - (e.right - e.left) + a) - e.left), _ || v) {
			if (f) l.scrollBy(_, v);
			else {
				let e = 0, n = 0;
				if (v) {
					let e = u.scrollTop;
					u.scrollTop += v / m, n = (u.scrollTop - e) * m;
				}
				if (_) {
					let t = u.scrollLeft;
					u.scrollLeft += _ / p, e = (u.scrollLeft - t) * p;
				}
				t = {
					left: t.left - e,
					top: t.top - n,
					right: t.right - e,
					bottom: t.bottom - n
				}, e && Math.abs(e - _) < 1 && (r = "nearest"), n && Math.abs(n - v) < 1 && (i = "nearest");
			}
		}
		if (f) break;
		(t.top < e.top || t.bottom > e.bottom || t.left < e.left || t.right > e.right) && (t = {
			left: Math.max(t.left, e.left),
			right: Math.min(t.right, e.right),
			top: Math.max(t.top, e.top),
			bottom: Math.min(t.bottom, e.bottom)
		}), u = u.assignedSlot || u.parentNode;
	} else if (u.nodeType == 11) u = u.host;
	else break;
}
function Mu(e, t = !0) {
	let n = e.ownerDocument, r = null, i = null;
	for (let a = e.parentNode; a && !(a == n.body || (!t || r) && i);) if (tm(a)) !i && a.scrollHeight > a.clientHeight && /scroll|auto/.test(getComputedStyle(a).overflowY) && (i = a), t && !r && a.scrollWidth > a.clientWidth && /scroll|auto/.test(getComputedStyle(a).overflowX) && (r = a), a = a.assignedSlot || a.parentNode;
	else if (a.nodeType == 11) a = a.host;
	else break;
	return {
		x: r,
		y: i
	};
}
function Nu(e) {
	let t = [];
	for (let n = e; n; n = n.nodeType == 11 ? n.host : n.parentNode) tm(n) && t.push({
		node: n,
		left: n.scrollLeft,
		top: n.scrollTop
	});
	return t;
}
function Pu(e, t = !0) {
	for (let { node: n, left: r, top: i } of e) t && n.scrollTop != i && (n.scrollTop = i), n.scrollLeft != r && (n.scrollLeft = r);
}
function Fu(e) {
	if (e.setActive) return e.setActive();
	if (im) return e.focus(im);
	let t = Nu(e);
	e.focus(im == null ? { get preventScroll() {
		return im = { preventScroll: !0 }, !0;
	} } : void 0), im || (im = !1, Pu(t));
}
function Iu(e, t, n = t) {
	let r = am ||= document.createRange();
	return r.setEnd(e, n), r.setStart(e, t), r;
}
function Lu(e, t, n, r) {
	let i = {
		key: t,
		code: t,
		keyCode: n,
		which: n,
		cancelable: !0
	};
	r && ({altKey: i.altKey, ctrlKey: i.ctrlKey, shiftKey: i.shiftKey, metaKey: i.metaKey} = r);
	let a = new KeyboardEvent("keydown", i);
	a.synthetic = !0, e.dispatchEvent(a);
	let o = new KeyboardEvent("keyup", i);
	return o.synthetic = !0, e.dispatchEvent(o), a.defaultPrevented || o.defaultPrevented;
}
function Ru(e) {
	for (; e;) {
		if (e && (e.nodeType == 9 || e.nodeType == 11 && e.host)) return e;
		e = e.assignedSlot || e.parentNode;
	}
	return null;
}
function zu(e, t) {
	let n = t.focusNode, r = t.focusOffset;
	if (!n || t.anchorNode != n || t.anchorOffset != r) return !1;
	for (r = Math.min(r, Du(n));;) if (r) {
		if (!tm(n)) return !1;
		let e = n.childNodes[r - 1];
		e.contentEditable == "false" ? r-- : (n = e, r = Du(n));
	} else if (n == e) return !0;
	else r = wu(n), n = n.parentNode;
}
function Bu(e) {
	return e instanceof Window ? e.pageYOffset > Math.max(0, e.document.documentElement.scrollHeight - e.innerHeight - 4) : e.scrollTop > Math.max(1, e.scrollHeight - e.clientHeight - 4);
}
function Vu(e, t) {
	for (let n = e, r = t;;) if (nm(n) && r > 0) return {
		node: n,
		offset: r
	};
	else if (tm(n) && r > 0) {
		if (n.contentEditable == "false") return null;
		n = n.childNodes[r - 1], r = Du(n);
	} else if (n.parentNode && !Tu(n)) r = wu(n), n = n.parentNode;
	else return null;
}
function Hu(e, t) {
	for (let n = e, r = t;;) if (nm(n) && r < n.nodeValue.length) return {
		node: n,
		offset: r
	};
	else if (tm(n) && r < n.childNodes.length) {
		if (n.contentEditable == "false") return null;
		n = n.childNodes[r], r = 0;
	} else if (n.parentNode && !Tu(n)) r = wu(n) + 1, n = n.parentNode;
	else return null;
}
function Uu(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t.push(1 << e[n]);
	return t;
}
function Wu(e) {
	return e <= 247 ? um[e] : 1424 <= e && e <= 1524 ? 2 : 1536 <= e && e <= 1785 ? dm[e - 1536] : 1774 <= e && e <= 2220 ? 4 : 8192 <= e && e <= 8204 ? 256 : 64336 <= e && e <= 65023 ? 4 : 1;
}
function Gu(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) {
		let r = e[n], i = t[n];
		if (r.from != i.from || r.to != i.to || r.direction != i.direction || !Gu(r.inner, i.inner)) return !1;
	}
	return !0;
}
function Ku(e, t, n, r, i) {
	for (let a = 0; a <= r.length; a++) {
		let o = a ? r[a - 1].to : t, s = a < r.length ? r[a].from : n, c = a ? 256 : i;
		for (let t = o, n = c, r = c; t < s; t++) {
			let i = Wu(e.charCodeAt(t));
			i == 512 ? i = n : i == 8 && r == 4 && (i = 16), gm[t] = i == 4 ? 2 : i, i & 7 && (r = i), n = i;
		}
		for (let e = o, t = c, r = c; e < s; e++) {
			let i = gm[e];
			if (i == 128) e < s - 1 && t == gm[e + 1] && t & 24 ? i = gm[e] = t : gm[e] = 256;
			else if (i == 64) {
				let i = e + 1;
				for (; i < s && gm[i] == 64;) i++;
				let a = e && t == 8 || i < n && gm[i] == 8 ? r == 1 ? 1 : 8 : 256;
				for (let t = e; t < i; t++) gm[t] = a;
				e = i - 1;
			} else i == 8 && r == 1 && (gm[e] = 1);
			t = i, i & 7 && (r = i);
		}
	}
}
function qu(e, t, n, r, i) {
	let a = i == 1 ? 2 : 1;
	for (let o = 0, s = 0, c = 0; o <= r.length; o++) {
		let l = o ? r[o - 1].to : t, u = o < r.length ? r[o].from : n;
		for (let t = l, n, r, o; t < u; t++) if (r = fm[n = e.charCodeAt(t)]) {
			if (r < 0) {
				for (let e = s - 3; e >= 0; e -= 3) if (pm[e + 1] == -r) {
					let n = pm[e + 2], r = n & 2 ? i : n & 4 ? n & 1 ? a : i : 0;
					r && (gm[t] = gm[pm[e]] = r), s = e;
					break;
				}
			} else if (pm.length == 189) break;
			else pm[s++] = t, pm[s++] = n, pm[s++] = c;
		} else if ((o = gm[t]) == 2 || o == 1) {
			let e = o == i;
			c = +!e;
			for (let t = s - 3; t >= 0; t -= 3) {
				let n = pm[t + 2];
				if (n & 2) break;
				if (e) pm[t + 2] |= 2;
				else {
					if (n & 4) break;
					pm[t + 2] |= 4;
				}
			}
		}
	}
}
function Ju(e, t, n, r) {
	for (let i = 0, a = r; i <= n.length; i++) {
		let o = i ? n[i - 1].to : e, s = i < n.length ? n[i].from : t;
		for (let c = o; c < s;) {
			let o = gm[c];
			if (o == 256) {
				let o = c + 1;
				for (;;) if (o == s) {
					if (i == n.length) break;
					o = n[i++].to, s = i < n.length ? n[i].from : t;
				} else if (gm[o] == 256) o++;
				else break;
				let l = a == 1, u = l == ((o < t ? gm[o] : r) == 1) ? l ? 1 : 2 : r;
				for (let t = o, r = i, a = r ? n[r - 1].to : e; t > c;) t == a && (t = n[--r].from, a = r ? n[r - 1].to : e), gm[--t] = u;
				c = o;
			} else a = o, c++;
		}
	}
}
function Yu(e, t, n, r, i, a, o) {
	let s = r % 2 ? 2 : 1;
	if (r % 2 == i % 2) for (let c = t, l = 0; c < n;) {
		let t = !0, u = !1;
		if (l == a.length || c < a[l].from) {
			let e = gm[c];
			e != s && (t = !1, u = e == 16);
		}
		let d = !t && s == 1 ? [] : null, f = t ? r : r + 1, p = c;
		run: for (;;) if (l < a.length && p == a[l].from) {
			if (u) break run;
			let m = a[l];
			if (!t) for (let e = m.to, t = l + 1;;) {
				if (e == n) break run;
				if (t < a.length && a[t].from == e) e = a[t++].to;
				else if (gm[e] == s) break run;
				else break;
			}
			l++, d ? d.push(m) : (m.from > c && o.push(new hm(c, m.from, f)), Xu(e, m.direction == cm == !(f % 2) ? r : r + 1, i, m.inner, m.from, m.to, o), c = m.to), p = m.to;
		} else if (p == n || (t ? gm[p] != s : gm[p] == s)) break;
		else p++;
		d ? Yu(e, c, p, r + 1, i, d, o) : c < p && o.push(new hm(c, p, f)), c = p;
	}
	else for (let c = n, l = a.length; c > t;) {
		let n = !0, u = !1;
		if (!l || c > a[l - 1].to) {
			let e = gm[c - 1];
			e != s && (n = !1, u = e == 16);
		}
		let d = !n && s == 1 ? [] : null, f = n ? r : r + 1, p = c;
		run: for (;;) if (l && p == a[l - 1].to) {
			if (u) break run;
			let m = a[--l];
			if (!n) for (let e = m.from, n = l;;) {
				if (e == t) break run;
				if (n && a[n - 1].to == e) e = a[--n].from;
				else if (gm[e - 1] == s) break run;
				else break;
			}
			d ? d.push(m) : (m.to < c && o.push(new hm(m.to, c, f)), Xu(e, m.direction == cm == !(f % 2) ? r : r + 1, i, m.inner, m.from, m.to, o), c = m.from), p = m.from;
		} else if (p == t || (n ? gm[p - 1] != s : gm[p - 1] == s)) break;
		else p--;
		d ? Yu(e, p, c, r + 1, i, d, o) : p < c && o.push(new hm(p, c, f)), c = p;
	}
}
function Xu(e, t, n, r, i, a, o) {
	let s = t % 2 ? 2 : 1;
	Ku(e, i, a, r, s), qu(e, i, a, r, s), Ju(i, a, r, s), Yu(e, i, a, t, n, r, o);
}
function Zu(e, t, n) {
	if (!e) return [new hm(0, 0, +(t == lm))];
	if (t == cm && !n.length && !mm.test(e)) return Qu(e.length);
	if (n.length) for (; e.length > gm.length;) gm[gm.length] = 256;
	let r = [], i = t == cm ? 0 : 1;
	return Xu(e, i, i, n, 0, e.length, r), r;
}
function Qu(e) {
	return [new hm(0, e, 0)];
}
function $u(e, t, n, r, i) {
	if (!e.length) return null;
	let a = r.head - e.from, o;
	if (r.head == e.from && r.assoc < 0) {
		if (!i) return null;
		a = t[o = 0].side(!1, n);
	} else if (r.head == e.to && r.assoc > 0) {
		if (i) return null;
		a = t[o = t.length - 1].side(!0, n);
	} else o = hm.find(t, a, r.bidiLevel ?? -1, r.assoc);
	let s = t[o], c = s.side(i, n);
	if (a == c) {
		let e = o += i ? 1 : -1;
		if (e < 0 || e >= t.length) return null;
		s = t[o = e], a = s.side(!i, n), c = s.side(i, n);
	}
	let l = cc(e.text, a, s.forward(i, n));
	(l < s.from || l > s.to) && (l = c), _m = e.text.slice(Math.min(a, l), Math.max(a, l));
	let u = o == (i ? t.length - 1 : 0) ? null : t[o + (i ? 1 : -1)];
	if (l == c) {
		if (!u) return i ? K.cursor(e.to, 1) : K.cursor(e.from, -1);
		if (u.level + +!i < s.level) return K.cursor(u.side(!i, n) + e.from, u.forward(i, n) ? 1 : -1, u.level);
	}
	return K.cursor(l + e.from, s.forward(i, n) ? -1 : 1, s.level);
}
function ed(e, t, n) {
	for (let r = t; r < n; r++) {
		let t = Wu(e.charCodeAt(r));
		if (t == 1) return cm;
		if (t == 2 || t == 4) return lm;
	}
}
function td(e, t, n) {
	let r = e.facet(xm);
	r.length ? r[0](t) : window.onerror && window.onerror(String(t), n, void 0, void 0, t) || (n ? console.error(n + ":", t) : console.error(t));
}
function nd(e, t) {
	let n = e.state.facet(Wm);
	if (!n.length) return n;
	let r = n.map((t) => t instanceof Function ? t(e) : t), i = [];
	return Bl.spans(r, t.from, t.to, {
		point() {},
		span(e, n, r, a) {
			let o = e - t.from, s = n - t.from, c = i;
			for (let e = r.length - 1; e >= 0; e--, a--) {
				let t = r[e].spec.bidiIsolate, n;
				if (a > 0 && c.length && (n = c[c.length - 1]).to == o && n.direction == t) n.to = s, c = n.inner;
				else {
					let e = {
						from: o,
						to: s,
						direction: t,
						inner: []
					};
					c.push(e), c = e.inner;
				}
			}
		}
	}), rd(t.text, i);
}
function rd(e, t) {
	for (let n of t) {
		if (n.direction == null) {
			for (let t = n.from, r = 0; t < n.to; r++) {
				let i = r < n.inner.length ? n.inner[r] : null, a = ed(e, t, i ? i.from : n.to);
				if (a) {
					n.direction = a;
					break;
				}
				if (!i) break;
				t = i.to;
			}
			n.direction ??= sm.LTR;
		}
		rd(e, n.inner);
	}
	return t;
}
function id(e) {
	let t = 0, n = 0, r = 0, i = 0;
	for (let a of e.state.facet(Gm)) {
		let o = a(e);
		o && (o.left != null && (t = Math.max(t, o.left)), o.right != null && (n = Math.max(n, o.right)), o.top != null && (r = Math.max(r, o.top)), o.bottom != null && (i = Math.max(i, o.bottom)));
	}
	return {
		left: t,
		right: n,
		top: r,
		bottom: i
	};
}
function ad(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
function od(e) {
	let t = e.dom.lastChild;
	if (!t) return e.dom.getBoundingClientRect();
	let n = Su(t);
	return n[n.length - 1] || null;
}
function sd(e, t) {
	let n = e.coordsIn(0, 1), r = t.coordsIn(0, 1);
	return n && r && r.top < n.bottom;
}
function cd(e, t) {
	let n = (e) => {
		for (let r of e.children) if ((t ? r.isText() : r.length) || n(r)) return !0;
		return !1;
	};
	return n(e);
}
function ld(e) {
	let t = e.isReplace ? (e.startSide < 0 ? 64 : 0) | (e.endSide > 0 ? 128 : 0) : e.startSide > 0 ? 32 : 16;
	return e.block && (t |= 256), t;
}
function ud(e, t) {
	let n = t.spec.attributes, r = t.spec.class;
	return !n && !r || (e ||= { class: "cm-line" }, n && du(n, e), r && (e.class += " " + r)), e;
}
function dd(e) {
	let t = [];
	for (let n = e.parents.length; n > 1; n--) {
		let r = n == e.parents.length ? e.tile : e.parents[n].tile;
		r instanceof th && t.push(r.mark);
	}
	return t;
}
function fd(e) {
	let t = Xm.get(e);
	return t && t.setDOM(e.cloneNode()), e;
}
function pd(e, t) {
	let n = t?.get(e);
	if (n != 1) {
		n ?? e.destroy();
		for (let n of e.children) pd(n, t);
	}
}
function md(e) {
	return tm(e.node) && e.node.firstChild && (e.offset == 0 || e.node.childNodes[e.offset - 1].contentEditable == "false") && (e.offset == e.node.childNodes.length || e.node.childNodes[e.offset].contentEditable == "false");
}
function hd(e, t) {
	let n = e.observer.selectionRange;
	if (!n.focusNode) return null;
	let r = Vu(n.focusNode, n.focusOffset), i = Hu(n.focusNode, n.focusOffset), a = r || i;
	if (i && r && i.node != r.node) {
		let t = Xm.get(i.node);
		if (!t || t.isText() && t.text != i.node.nodeValue) a = i;
		else if (e.docView.lastCompositionAfterCursor) {
			let e = Xm.get(r.node);
			!e || e.isText() && e.text != r.node.nodeValue || (a = i);
		}
	}
	if (e.docView.lastCompositionAfterCursor = a != r, !a) return null;
	let o = t - a.offset;
	return {
		from: o,
		to: o + a.node.nodeValue.length,
		node: a.node
	};
}
function gd(e, t, n) {
	let r = hd(e, n);
	if (!r) return null;
	let { node: i, from: a, to: o } = r, s = i.nodeValue;
	if (/[\n\r]/.test(s) || e.state.doc.sliceString(r.from, r.to) != s) return null;
	let c = t.invertedDesc;
	return {
		range: new qm(c.mapPos(a), c.mapPos(o), a, o),
		text: i
	};
}
function _d(e, t) {
	return tm(e) ? (t && e.childNodes[t - 1].contentEditable == "false" ? 1 : 0) | (t < e.childNodes.length && e.childNodes[t].contentEditable == "false" ? 2 : 0) : 0;
}
function vd(e, t, n) {
	let r = new gh();
	return Bl.compare(e, t, n, r), r.changes;
}
function yd(e, t, n) {
	let r = new _h();
	return Bl.compare(e, t, n, r), r.changes;
}
function bd(e, t) {
	for (let n = e; n && n != t; n = n.assignedSlot || n.parentNode) if (tm(n) && n.contentEditable == "false") return !0;
	return !1;
}
function xd(e, t) {
	let n = !1;
	return t && e.iterChangedRanges((e, r) => {
		e < t.to && r > t.from && (n = !0);
	}), n;
}
function Sd(e, t, n = 1) {
	let r = e.charCategorizer(t), i = e.doc.lineAt(t), a = t - i.from;
	if (i.length == 0) return K.cursor(t);
	a == 0 ? n = 1 : a == i.length && (n = -1);
	let o = a, s = a;
	n < 0 ? o = cc(i.text, a, !1) : s = cc(i.text, a);
	let c = r(i.text.slice(o, s));
	for (; o > 0;) {
		let e = cc(i.text, o, !1);
		if (r(i.text.slice(e, o)) != c) break;
		o = e;
	}
	for (; s < i.length;) {
		let e = cc(i.text, s);
		if (r(i.text.slice(s, e)) != c) break;
		s = e;
	}
	return K.undirectionalRange(o + i.from, s + i.from);
}
function Cd(e, t, n, r, i) {
	let a = Math.round((r - t.left) * e.defaultCharacterWidth);
	if (e.lineWrapping && n.height > e.defaultLineHeight * 1.5) {
		let t = e.viewState.heightOracle.textHeight, r = Math.floor((i - n.top - (e.defaultLineHeight - t) * .5) / t);
		a += r * e.viewState.heightOracle.lineLength;
	}
	let o = e.state.sliceDoc(n.from, n.to);
	return n.from + Xc(o, a, e.state.tabSize);
}
function wd(e, t, n) {
	let r = e.lineBlockAt(t);
	if (Array.isArray(r.type)) {
		let e;
		for (let i of r.type) {
			if (i.from > t) break;
			if (!(i.to < t)) {
				if (i.from < t && i.to > t) return i;
				(!e || i.type == Xp.Text && (e.type != i.type || (n < 0 ? i.from < t : i.to > t))) && (e = i);
			}
		}
		return e || r;
	}
	return r;
}
function Td(e, t, n, r) {
	let i = wd(e, t.head, t.assoc || -1), a = !r || i.type != Xp.Text || !(e.lineWrapping || i.widgetLineBreaks) ? null : e.coordsAtPos(t.assoc < 0 && t.head > i.from ? t.head - 1 : t.head);
	if (a) {
		let t = e.dom.getBoundingClientRect(), r = e.textDirectionAt(i.from), o = e.posAndSideAtCoords({
			x: n == (r == sm.LTR) ? t.right - 1 : t.left + 1,
			y: (a.top + a.bottom) / 2
		});
		if (o) return K.cursor(o.pos, o.assoc);
	}
	return K.cursor(n ? i.to : i.from, n ? 1 : -1);
}
function Ed(e, t, n, r) {
	let i = e.state.doc.lineAt(t.head), a = e.bidiSpans(i), o = e.textDirectionAt(i.from);
	for (let s = t, c = null;;) {
		let t = $u(i, a, o, s, n), l = _m;
		if (!t) {
			if (i.number == (n ? e.state.doc.lines : 1)) return s;
			l = "\n", i = e.state.doc.line(i.number + (n ? 1 : -1)), a = e.bidiSpans(i), t = n ? K.cursor(i.from, -1) : K.cursor(i.to, 1);
		}
		if (!c) {
			if (!r) return t;
			c = r(l);
		} else if (!c(l)) return s;
		s = t;
	}
}
function Dd(e, t, n) {
	let r = e.state.charCategorizer(t), i = r(n);
	return (e) => {
		let t = r(e);
		return i == Nl.Space && (i = t), i == t;
	};
}
function Od(e, t, n, r) {
	let i = t.head, a = n ? 1 : -1;
	if (i == (n ? e.state.doc.length : 0)) return K.cursor(i, t.assoc);
	let o = t.goalColumn, s, c = e.contentDOM.getBoundingClientRect(), l = e.coordsAtPos(i, t.assoc || ((t.empty ? n : t.head == t.from) ? 1 : -1)), u = e.documentTop;
	if (l) o ??= l.left - c.left, s = a < 0 ? l.top : l.bottom;
	else {
		let t = e.viewState.lineBlockAt(i);
		o ??= Math.min(c.right - c.left, e.defaultCharacterWidth * (i - t.from)), s = (a < 0 ? t.top : t.bottom) + u;
	}
	let d = c.left + o, f = e.viewState.heightOracle.textHeight >> 1, p = r ?? f;
	for (let t = 0;; t += f) {
		let r = s + (p + t) * a, i = Md(e, {
			x: d,
			y: r
		}, !1, a);
		if (n ? r > c.bottom : r < c.top) return K.cursor(i.pos, i.assoc);
		let l = e.coordsAtPos(i.pos, i.assoc), u = l ? (l.top + l.bottom) / 2 : 0;
		if (!l || (n ? u > s : u < s)) return K.cursor(i.pos, i.assoc, void 0, o);
	}
}
function kd(e, t, n) {
	for (;;) {
		let r = 0;
		for (let i of e) i.between(t - 1, t + 1, (e, i, a) => {
			if (t > e && t < i) {
				let a = r || n || (t - e < i - t ? -1 : 1);
				t = a < 0 ? e : i, r = a;
			}
		});
		if (!r) return t;
	}
}
function Ad(e, t) {
	let n = null;
	for (let r = 0; r < t.ranges.length; r++) {
		let i = t.ranges[r], a = null;
		if (i.empty) {
			let t = kd(e, i.from, 0);
			t != i.from && (a = K.cursor(t, -1));
		} else {
			let t = kd(e, i.from, -1), n = kd(e, i.to, 1);
			(t != i.from || n != i.to) && (a = i.undirectional ? K.undirectionalRange(i.from, i.to) : K.range(i.from == i.anchor ? t : n, i.from == i.head ? t : n));
		}
		a && (n ||= t.ranges.slice(), n[r] = a);
	}
	return n ? K.create(n, t.mainIndex) : t;
}
function jd(e, t, n) {
	let r = kd(e.state.facet(Um).map((t) => t(e)), n.from, t.head > n.from ? -1 : 1);
	return r == n.from ? n : K.cursor(r, r < n.from ? 1 : -1);
}
function Md(e, t, n, r) {
	let i = e.contentDOM.getBoundingClientRect(), a = i.top + e.viewState.paddingTop, { x: o, y: s } = t, c = s - a, l;
	for (;;) {
		if (c < 0) return new yh(0, 1);
		if (c > e.viewState.docHeight) return new yh(e.state.doc.length, -1);
		if (l = e.elementAtHeight(c), r == null) break;
		if (l.type == Xp.Text) {
			if (r < 0 ? l.to < e.viewport.from : l.from > e.viewport.to) break;
			let t = e.docView.coordsAt(r < 0 ? l.from : l.to, r > 0 ? -1 : 1);
			if (t && (r < 0 ? t.top <= c + a : t.bottom >= c + a)) break;
		}
		let t = e.viewState.heightOracle.textHeight / 2;
		c = r > 0 ? l.bottom + t : l.top - t;
	}
	if (e.viewport.from >= l.to || e.viewport.to <= l.from) {
		if (n) return null;
		if (l.type == Xp.Text) {
			let t = Cd(e, i, l, o, s);
			return new yh(t, t == l.from ? 1 : -1);
		}
	}
	if (l.type != Xp.Text) return c < (l.top + l.bottom) / 2 ? new yh(l.from, 1) : new yh(l.to, -1);
	let u = e.docView.lineAt(l.from, 2);
	return u && u.length == l.length || (u = e.docView.lineAt(l.from, -2)), new bh(e, o, s, e.textDirectionAt(l.from)).scanTile(u, l.from);
}
function Nd(e, t, n) {
	for (;;) {
		if (!t || n < Du(t)) return !1;
		if (t == e) return !0;
		n = wu(t) + 1, t = t.parentNode;
	}
}
function Pd(e, t) {
	let n;
	for (; e != t && e; e = e.nextSibling) {
		let t = Xm.get(e);
		if (!t?.isWidget()) return !1;
		t && (n ||= []).push(t);
	}
	if (n) {
		for (let e of n) if (e.overrideDOMText?.length) return !1;
	}
	return !0;
}
function Fd(e, t, n, r) {
	if (e.isComposite()) {
		let i = -1, a = -1, o = -1, s = -1;
		for (let c = 0, l = r, u = r; c < e.children.length; c++) {
			let r = e.children[c], d = l + r.length;
			if (l < t && d > n) return Fd(r, t, n, l);
			if (d >= t && i == -1 && (i = c, a = l), l > n && r.dom.parentNode == e.dom) {
				o = c, s = u;
				break;
			}
			u = d, l = d + r.breakAfter;
		}
		return {
			from: a,
			to: s < 0 ? r + e.length : s,
			startDOM: (i ? e.children[i - 1].dom.nextSibling : null) || e.dom.firstChild,
			endDOM: o < e.children.length && o >= 0 ? e.children[o].dom : null
		};
	}
	return e.isText() ? {
		from: r,
		to: r + e.length,
		startDOM: e.dom,
		endDOM: e.dom.nextSibling
	} : null;
}
function Id(e, t) {
	let n, { newSel: r } = t, { state: i } = e, a = i.selection.main, o = e.inputState.lastKeyTime > Date.now() - 100 ? e.inputState.lastKeyCode : -1;
	if (t.bounds) {
		let { from: e, to: r } = t.bounds, s = a.from, c = null;
		(o === 8 || J.android && t.text.length < r - e) && (s = a.to, c = "end");
		let l = i.doc.sliceString(e, r, xh), u, d;
		!a.empty && a.from >= e && a.to <= r && (t.typeOver || l != t.text) && l.slice(0, a.from - e) == t.text.slice(0, a.from - e) && l.slice(a.to - e) == t.text.slice(u = t.text.length - (l.length - (a.to - e))) ? n = {
			from: a.from,
			to: a.to,
			insert: Zc.of(t.text.slice(a.from - e, u).split(xh))
		} : (d = zd(l, t.text, s - e, c)) && (J.chrome && o == 13 && d.toB == d.from + 2 && t.text.slice(d.from, d.toB) == "￿￿" && d.toB--, n = {
			from: e + d.from,
			to: e + d.toA,
			insert: Zc.of(t.text.slice(d.from, d.toB).split(xh))
		});
	} else r && (!e.hasFocus && i.facet(Nm) || Hd(r, a)) && (r = null);
	if (!n && !r) return !1;
	if ((J.mac || J.android) && n && n.from == n.to && n.from == a.head - 1 && /^\. ?$/.test(n.insert.toString()) && e.contentDOM.getAttribute("autocorrect") == "off" ? (r && n.insert.length == 2 && (r = K.single(r.main.anchor - 1, r.main.head - 1)), n = {
		from: n.from,
		to: n.to,
		insert: Zc.of([n.insert.toString().replace(".", " ")])
	}) : i.doc.lineAt(a.from).to < a.to && e.docView.lineHasWidget(a.to) && e.inputState.insertingTextAt > Date.now() - 50 ? n = {
		from: a.from,
		to: a.to,
		insert: i.toText(e.inputState.insertingText)
	} : J.chrome && n && n.from == n.to && n.from == a.head && n.insert.toString() == "\n " && e.lineWrapping && (r &&= K.single(r.main.anchor - 1, r.main.head - 1), n = {
		from: a.from,
		to: a.to,
		insert: Zc.of([" "])
	}), n) return Ld(e, n, r, o);
	if (r && !Hd(r, a)) {
		let t = !1, n = "select";
		return e.inputState.lastSelectionTime > Date.now() - 50 && (e.inputState.lastSelectionOrigin == "select" && (t = !0), n = e.inputState.lastSelectionOrigin, n == "select.pointer" && (r = Ad(i.facet(Um).map((t) => t(e)), r))), e.dispatch({
			selection: r,
			scrollIntoView: t,
			userEvent: n
		}), !0;
	}
	return !1;
}
function Ld(e, t, n, r = -1) {
	if (J.ios && e.inputState.flushIOSKey(t)) return !0;
	let i = e.state.selection.main;
	if (J.android && (t.to == i.to && (t.from == i.from || t.from == i.from - 1 && e.state.sliceDoc(t.from, i.from) == " ") && t.insert.length == 1 && t.insert.lines == 2 && Lu(e.contentDOM, "Enter", 13) || (t.from == i.from - 1 && t.to == i.to && t.insert.length == 0 || r == 8 && t.insert.length < t.to - t.from && t.to > i.head) && Lu(e.contentDOM, "Backspace", 8) || t.from == i.from && t.to == i.to + 1 && t.insert.length == 0 && Lu(e.contentDOM, "Delete", 46))) return !0;
	let a = t.insert.toString();
	e.inputState.composing >= 0 && e.inputState.composing++;
	let o, s = () => o ||= Rd(e, t, n);
	return e.state.facet(Cm).some((n) => n(e, t.from, t.to, a, s)) || e.dispatch(s()), !0;
}
function Rd(e, t, n) {
	let r, i = e.state, a = i.selection.main, o = -1;
	if (t.from == t.to && t.from < a.from || t.from > a.to) {
		let n = t.from < a.from ? -1 : 1, r = n < 0 ? a.from : a.to, s = kd(i.facet(Um).map((t) => t(e)), r, n);
		t.from == s && (o = s);
	}
	if (o > -1) r = {
		changes: t,
		selection: K.cursor(t.from + t.insert.length, -1)
	};
	else if (t.from >= a.from && t.to <= a.to && t.to - t.from >= (a.to - a.from) / 3 && (!n || n.main.empty && n.main.from == t.from + t.insert.length) && e.inputState.composing < 0) {
		let n = a.from < t.from ? i.sliceDoc(a.from, t.from) : "", o = a.to > t.to ? i.sliceDoc(t.to, a.to) : "";
		r = i.replaceSelection(e.state.toText(n + t.insert.sliceString(0, void 0, e.state.lineBreak) + o));
	} else {
		let o = i.changes(t), s = n && n.main.to <= o.newLength ? n.main : void 0;
		if (i.selection.ranges.length > 1 && (e.inputState.composing >= 0 || e.inputState.compositionPendingChange) && t.to <= a.to + 10 && t.to >= a.to - 10) {
			let c = e.state.sliceDoc(t.from, t.to), l, u = n && hd(e, n.main.head);
			if (u) {
				let e = t.insert.length - (t.to - t.from);
				l = {
					from: u.from,
					to: u.to - e
				};
			} else l = e.state.doc.lineAt(a.head);
			let d = a.to - t.to;
			r = i.changeByRange((n) => {
				if (n.from == a.from && n.to == a.to) return {
					changes: o,
					range: s || n.map(o)
				};
				let r = n.to - d, u = r - c.length;
				if (e.state.sliceDoc(u, r) != c || r >= l.from && u <= l.to) return { range: n };
				let f = i.changes({
					from: u,
					to: r,
					insert: t.insert
				}), p = n.to - a.to;
				return {
					changes: f,
					range: s ? K.range(Math.max(0, s.anchor + p), Math.max(0, s.head + p)) : n.map(f)
				};
			});
		} else r = {
			changes: o,
			selection: s && i.selection.replaceRange(s)
		};
	}
	let s = "input.type";
	return (e.composing || e.inputState.compositionPendingChange && e.inputState.compositionEndedAt > Date.now() - 50) && (e.inputState.compositionPendingChange = !1, s += ".compose", e.inputState.compositionFirstChange && (s += ".start", e.inputState.compositionFirstChange = !1)), i.update(r, {
		userEvent: s,
		scrollIntoView: !0
	});
}
function zd(e, t, n, r) {
	let i = Math.min(e.length, t.length), a = 0;
	for (; a < i && e.charCodeAt(a) == t.charCodeAt(a);) a++;
	if (a == i && e.length == t.length) return null;
	let o = e.length, s = t.length;
	for (; o > 0 && s > 0 && e.charCodeAt(o - 1) == t.charCodeAt(s - 1);) o--, s--;
	if (r == "end") {
		let e = Math.max(0, a - Math.min(o, s));
		n -= o + e - a;
	}
	if (o < a && e.length < t.length) {
		let e = n <= a && n >= o ? a - n : 0;
		a -= e, s = a + (s - o), o = a;
	} else if (s < a) {
		let e = n <= a && n >= s ? a - n : 0;
		a -= e, o = a + (o - s), s = a;
	}
	return {
		from: a,
		toA: o,
		toB: s
	};
}
function Bd(e) {
	let t = [];
	if (e.root.activeElement != e.contentDOM) return t;
	let { anchorNode: n, anchorOffset: r, focusNode: i, focusOffset: a } = e.observer.selectionRange;
	return n && (t.push(new Ch(n, r)), (i != n || a != r) && t.push(new Ch(i, a))), t;
}
function Vd(e, t) {
	if (e.length == 0) return null;
	let n = e[0].pos, r = e.length == 2 ? e[1].pos : n;
	return n < 0 || r < 0 ? null : n == r ? K.create([K.cursor(r + t, -1)]) : K.single(n + t, r + t);
}
function Hd(e, t) {
	return t.head == e.main.head && t.anchor == e.main.anchor;
}
function Ud(e) {
	return e.visualViewport ? e.visualViewport.height * e.visualViewport.scale / e.document.documentElement.clientHeight < .85 : !1;
}
function Wd(e, t) {
	return (n, r) => {
		try {
			return t.call(e, r, n);
		} catch (e) {
			td(n.state, e);
		}
	};
}
function Gd(e) {
	let t = Object.create(null);
	function n(e) {
		return t[e] || (t[e] = {
			observers: [],
			handlers: []
		});
	}
	for (let t of e) {
		let e = t.spec, r = e && e.plugin.domEventHandlers, i = e && e.plugin.domEventObservers;
		if (r) for (let e in r) {
			let i = r[e];
			i && n(e).handlers.push(Wd(t.value, i));
		}
		if (i) for (let e in i) {
			let r = i[e];
			r && n(e).observers.push(Wd(t.value, r));
		}
	}
	for (let e in jh) n(e).handlers.push(jh[e]);
	for (let e in Mh) n(e).observers.push(Mh[e]);
	return t;
}
function Kd(e) {
	return Math.max(0, e) * .7 + 8;
}
function qd(e, t) {
	return Math.max(Math.abs(e.clientX - t.clientX), Math.abs(e.clientY - t.clientY));
}
function Jd(e, t) {
	let n = e.state.facet(vm);
	return n.length ? n[0](t) : J.mac ? t.metaKey : t.ctrlKey;
}
function Yd(e, t) {
	let n = e.state.facet(ym);
	return n.length ? n[0](t) : J.mac ? !t.altKey : !t.ctrlKey;
}
function Xd(e, t) {
	let { main: n } = e.state.selection;
	if (n.empty) return !1;
	let r = yu(e.root);
	if (!r || r.rangeCount == 0) return !0;
	let i = r.getRangeAt(0).getClientRects();
	for (let e = 0; e < i.length; e++) {
		let n = i[e];
		if (n.left <= t.clientX && n.right >= t.clientX && n.top <= t.clientY && n.bottom >= t.clientY) return !0;
	}
	return !1;
}
function Zd(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target, r; n != e.contentDOM; n = n.parentNode) if (!n || n.nodeType == 11 || (r = Xm.get(n)) && r.isWidget() && !r.isHidden && r.widget.ignoreEvent(t)) return !1;
	return !0;
}
function Qd(e) {
	let t = e.dom.parentNode;
	if (!t) return;
	let n = t.appendChild(document.createElement("textarea"));
	n.style.cssText = "position: fixed; left: -10000px; top: 10px", n.focus(), setTimeout(() => {
		e.focus(), n.remove(), ef(e, n.value);
	}, 50);
}
function $d(e, t, n) {
	for (let r of e.facet(t)) n = r(n, e);
	return n;
}
function ef(e, t) {
	t = $d(e.state, Tm, t);
	let { state: n } = e, r, i = 1, a = n.toText(t), o = a.lines == n.selection.ranges.length;
	if (Rh != null && n.selection.ranges.every((e) => e.empty) && Rh == a.toString()) {
		let e = -1;
		r = n.changeByRange((r) => {
			let s = n.doc.lineAt(r.from);
			if (s.from == e) return { range: r };
			e = s.from;
			let c = n.toText((o ? a.line(i++).text : t) + n.lineBreak);
			return {
				changes: {
					from: s.from,
					insert: c
				},
				range: K.cursor(r.from + c.length, -1)
			};
		});
	} else r = o ? n.changeByRange((e) => {
		let t = a.line(i++);
		return {
			changes: {
				from: e.from,
				to: e.to,
				insert: t.text
			},
			range: K.cursor(e.from + t.length, -1)
		};
	}) : n.replaceSelection(a);
	e.dispatch(r, {
		userEvent: "input.paste",
		scrollIntoView: !0
	});
}
function tf(e, t, n, r) {
	if (r == 1) return K.cursor(t, n);
	if (r == 2) return Sd(e.state, t, n);
	{
		let r = e.docView.lineAt(t, n), i = e.state.doc.lineAt(r ? r.posAtEnd : t), a = r ? r.posAtStart : i.from, o = r ? r.posAtEnd : i.to;
		return o < e.state.doc.length && o == i.to && o++, K.undirectionalRange(a, o);
	}
}
function nf(e) {
	if (!Ph) return e.detail;
	let t = Fh, n = Lh;
	return Fh = e, Lh = Date.now(), Ih = !t || n > Date.now() - 400 && Math.abs(t.clientX - e.clientX) < 2 && Math.abs(t.clientY - e.clientY) < 2 ? (Ih + 1) % 3 : 1;
}
function rf(e, t) {
	let n = e.posAndSideAtCoords({
		x: t.clientX,
		y: t.clientY
	}, !1), r = nf(t), i = e.state.selection;
	return {
		update(e) {
			e.docChanged && (n.pos = e.changes.mapPos(n.pos), i = i.map(e.changes));
		},
		get(t, a, o) {
			let s = e.posAndSideAtCoords({
				x: t.clientX,
				y: t.clientY
			}, !1), c, l = tf(e, s.pos, s.assoc, r);
			if (n.pos != s.pos && !a) {
				let t = tf(e, n.pos, n.assoc, r), i = Math.min(t.from, l.from), a = Math.max(t.to, l.to);
				l = i < l.from ? K.range(i, a, l.assoc) : K.range(a, i, l.assoc);
			}
			return a ? i.replaceRange(i.main.extend(l.from, l.to, l.assoc)) : o && r == 1 && i.ranges.length > 1 && (c = af(i, s.pos)) ? c : o ? i.addRange(l) : K.create([l]);
		}
	};
}
function af(e, t) {
	for (let n = 0; n < e.ranges.length; n++) {
		let { from: r, to: i } = e.ranges[n];
		if (r <= t && i >= t) return K.create(e.ranges.slice(0, n).concat(e.ranges.slice(n + 1)), e.mainIndex == n ? 0 : e.mainIndex - +(e.mainIndex > n));
	}
	return null;
}
function of(e, t, n, r) {
	if (n = $d(e.state, Tm, n), !n) return;
	let i = e.posAtCoords({
		x: t.clientX,
		y: t.clientY
	}, !1), { draggedContent: a } = e.inputState, o = r && a && Yd(e, t) ? {
		from: a.from,
		to: a.to
	} : null, s = {
		from: i,
		insert: n
	}, c = e.state.changes(o ? [o, s] : s);
	e.focus(), e.dispatch({
		changes: c,
		selection: {
			anchor: c.mapPos(i, -1),
			head: c.mapPos(i, 1)
		},
		userEvent: o ? "move.drop" : "input.drop"
	}), e.inputState.draggedContent = null;
}
function sf(e, t) {
	let n = e.dom.parentNode;
	if (!n) return;
	let r = n.appendChild(document.createElement("textarea"));
	r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.value = t, r.focus(), r.selectionEnd = t.length, r.selectionStart = 0, setTimeout(() => {
		r.remove(), e.focus();
	}, 50);
}
function cf(e) {
	let t = [], n = [], r = !1;
	for (let r of e.selection.ranges) r.empty || (t.push(e.sliceDoc(r.from, r.to)), n.push(r));
	if (!t.length) {
		let i = -1;
		for (let { from: r } of e.selection.ranges) {
			let a = e.doc.lineAt(r);
			a.number > i && (t.push(a.text), n.push({
				from: a.from,
				to: Math.min(e.doc.length, a.to + 1)
			})), i = a.number;
		}
		r = !0;
	}
	return {
		text: $d(e, Em, t.join(e.lineBreak)),
		ranges: n,
		linewise: r
	};
}
function lf(e, t) {
	let n = [];
	for (let r of e.facet(wm)) {
		let i = r(e, t);
		i && n.push(i);
	}
	return n.length ? e.update({
		effects: n,
		annotations: zh.of(!0)
	}) : null;
}
function uf(e) {
	setTimeout(() => {
		let t = e.hasFocus;
		if (t != e.inputState.notifiedFocused) {
			let n = lf(e.state, t);
			n ? e.dispatch(n) : e.update([]);
		}
	}, 10);
}
function df(e) {
	Bh.has(e) || (Bh.add(e), e.addEventListener("copy", () => {}), e.addEventListener("cut", () => {}));
}
function ff() {
	Hh = !1;
}
function pf(e, t) {
	return e == t ? e : (e.constructor != t.constructor && (Hh = !0), t);
}
function mf(e, t) {
	let n, r;
	e[t] == null && (n = e[t - 1]) instanceof Qh && (r = e[t + 1]) instanceof Qh && e.splice(t - 1, 3, new Qh(n.length + 1 + r.length));
}
function hf(e, t, n) {
	let r = new ng();
	return Bl.compare(e, t, n, r, 0), r.changes;
}
function gf(e, t) {
	let n = e.getBoundingClientRect(), r = e.ownerDocument, i = r.defaultView || window, a = Math.max(0, n.left), o = Math.min(i.innerWidth, n.right), s = Math.max(0, n.top), c = Math.min(i.innerHeight, n.bottom);
	for (let t = e.parentNode; t && t != r.body;) if (tm(t)) {
		let n = window.getComputedStyle(t);
		if ((t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth) && n.overflow != "visible") {
			let n = t.getBoundingClientRect();
			a = Math.max(a, n.left), o = Math.min(o, n.right), s = Math.max(s, n.top), c = Math.min(t == e.parentNode ? i.innerHeight : c, n.bottom);
		}
		t = n.position == "absolute" || n.position == "fixed" ? t.offsetParent : t.parentNode;
	} else if (t.nodeType == 11) t = t.host;
	else break;
	return {
		left: a - n.left,
		right: Math.max(a, o) - n.left,
		top: s - (n.top + t),
		bottom: Math.max(s, c) - (n.top + t)
	};
}
function _f(e) {
	let t = e.getBoundingClientRect(), n = e.ownerDocument.defaultView || window;
	return t.left < n.innerWidth && t.right > 0 && t.top < n.innerHeight && t.bottom > 0;
}
function vf(e, t) {
	let n = e.getBoundingClientRect();
	return {
		left: 0,
		right: n.right - n.left,
		top: t,
		bottom: n.bottom - (n.top + t)
	};
}
function yf(e, t, n) {
	let r = [], i = e, a = 0;
	return Bl.spans(n, e, t, {
		span() {},
		point(e, t) {
			e > i && (r.push({
				from: i,
				to: e
			}), a += e - i), i = t;
		}
	}, 20), i < t && (r.push({
		from: i,
		to: t
	}), a += t - i), {
		total: a,
		ranges: r
	};
}
function bf({ total: e, ranges: t }, n) {
	if (n <= 0) return t[0].from;
	if (n >= 1) return t[t.length - 1].to;
	let r = Math.floor(e * n);
	for (let e = 0;; e++) {
		let { from: n, to: i } = t[e], a = i - n;
		if (r <= a) return n + r;
		r -= a;
	}
}
function xf(e, t) {
	let n = 0;
	for (let { from: r, to: i } of e.ranges) {
		if (t <= i) {
			n += t - r;
			break;
		}
		n += i - r;
	}
	return n / e.total;
}
function Sf(e, t) {
	for (let n of e) if (t(n)) return n;
}
function Cf(e) {
	let t = e.facet(Bm).filter((e) => typeof e != "function"), n = e.facet(Hm).filter((e) => typeof e != "function");
	return n.length && t.push(Bl.join(n)), t;
}
function wf(e, t) {
	if (t.scale == 1) return e;
	let n = t.toDOM(e.top), r = t.toDOM(e.bottom);
	return new Gh(e.from, e.length, n, r - n, Array.isArray(e._content) ? e._content.map((e) => wf(e, t)) : e._content);
}
function Tf(e, t, n) {
	return new Xl(t, { finish(t) {
		return /&/.test(t) ? t.replace(/&\w*/, (t) => {
			if (t == "&") return e;
			if (!n || !n[t]) throw RangeError(`Unsupported selector: ${t}`);
			return n[t];
		}) : e + " " + t;
	} });
}
function Ef(e, t, n) {
	for (; t;) {
		let r = Xm.get(t);
		if (r && r.parent == e) return r;
		let i = t.parentNode;
		t = i == e.dom ? n > 0 ? t.nextSibling : t.previousSibling : i;
	}
	return null;
}
function Df(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.docView.domAtPos(e.state.selection.main.anchor, 1);
	return Cu(o.node, o.offset, i, a) && ([n, r, i, a] = [
		i,
		a,
		n,
		r
	]), {
		anchorNode: n,
		anchorOffset: r,
		focusNode: i,
		focusOffset: a
	};
}
function Of(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return Df(e, n);
	}
	let n = null;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.contentDOM.addEventListener("beforeinput", r, !0), e.dom.ownerDocument.execCommand("indent"), e.contentDOM.removeEventListener("beforeinput", r, !0), n ? Df(e, n) : null;
}
function kf(e, t, n) {
	for (let r = e.state.facet(t), i = r.length - 1; i >= 0; i--) {
		let t = r[i], a = typeof t == "function" ? t(e) : t;
		a && du(a, n);
	}
	return n;
}
function Af(e, t) {
	let n = e.split(/-(?!$)/), r = n[n.length - 1];
	r == "Space" && (r = " ");
	let i, a, o, s;
	for (let e = 0; e < n.length - 1; ++e) {
		let r = n[e];
		if (/^(cmd|meta|m)$/i.test(r)) s = !0;
		else if (/^a(lt)?$/i.test(r)) i = !0;
		else if (/^(c|ctrl|control)$/i.test(r)) a = !0;
		else if (/^s(hift)?$/i.test(r)) o = !0;
		else if (/^mod$/i.test(r)) t == "mac" ? s = !0 : a = !0;
		else throw Error("Unrecognized modifier name: " + r);
	}
	return i && (r = "Alt-" + r), a && (r = "Ctrl-" + r), s && (r = "Meta-" + r), o && (r = "Shift-" + r), r;
}
function jf(e, t, n) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n !== !1 && t.shiftKey && (e = "Shift-" + e), e;
}
function Mf(e) {
	let t = e.facet(Tg), n = Eg.get(t);
	return n || Eg.set(t, n = Pf(t.reduce((e, t) => e.concat(t), []))), n;
}
function Nf(e, t, n) {
	return Ff(Mf(e.state), t, e, n);
}
function Pf(e, t = Cg) {
	let n = Object.create(null), r = Object.create(null), i = (e, t) => {
		let n = r[e];
		if (n == null) r[e] = t;
		else if (n != t) throw Error("Key binding " + e + " is used both as a regular binding and as a multi-stroke prefix");
	}, a = (e, r, a, o, s) => {
		let c = n[e] || (n[e] = Object.create(null)), l = r.split(/ (?!$)/).map((e) => Af(e, t));
		for (let t = 1; t < l.length; t++) {
			let n = l.slice(0, t).join(" ");
			i(n, !0), c[n] || (c[n] = {
				preventDefault: !0,
				stopPropagation: !1,
				run: [(t) => {
					let r = Dg = {
						view: t,
						prefix: n,
						scope: e
					};
					return setTimeout(() => {
						Dg == r && (Dg = null);
					}, Og), !0;
				}]
			});
		}
		let u = l.join(" ");
		i(u, !1);
		let d = c[u] || (c[u] = {
			preventDefault: !1,
			stopPropagation: !1,
			run: (c._any?.run)?.slice() || []
		});
		a && d.run.push(a), o && (d.preventDefault = !0), s && (d.stopPropagation = !0);
	};
	for (let r of e) {
		let e = r.scope ? r.scope.split(" ") : ["editor"];
		if (r.any) for (let t of e) {
			let e = n[t] || (n[t] = Object.create(null));
			e._any ||= {
				preventDefault: !1,
				stopPropagation: !1,
				run: []
			};
			let { any: i } = r;
			for (let t in e) e[t].run.push((e) => i(e, kg));
		}
		let i = r[t] || r.key;
		if (i) for (let t of e) a(t, i, r.run, r.preventDefault, r.stopPropagation), r.shift && a(t, "Shift-" + i, r.shift, r.preventDefault, r.stopPropagation);
	}
	return n;
}
function Ff(e, t, n, r) {
	kg = t;
	let i = eu(t), a = pc(dc(i, 0)) == i.length && i != " ", o = "", s = !1, c = !1, l = !1;
	Dg && Dg.view == n && Dg.scope == r && (o = Dg.prefix + " ", Oh.indexOf(t.keyCode) < 0 && (c = !0, Dg = null));
	let u = /* @__PURE__ */ new Set(), d = (e) => {
		if (e) {
			for (let t of e.run) if (!u.has(t) && (u.add(t), t(n))) return e.stopPropagation && (l = !0), !0;
			e.preventDefault && (e.stopPropagation && (l = !0), c = !0);
		}
		return !1;
	}, f = e[r], p, m;
	return f && (d(f[o + jf(i, t, !a)]) ? s = !0 : a && (t.altKey || t.metaKey || t.ctrlKey) && !(J.windows && t.ctrlKey && t.altKey) && !(J.mac && t.altKey && !(t.ctrlKey || t.metaKey)) && (p = tu[t.keyCode]) && p != i ? (d(f[o + jf(p, t, !0)]) || t.shiftKey && (m = nu[t.keyCode]) != i && m != p && d(f[o + jf(m, t, !1)])) && (s = !0) : a && t.shiftKey && d(f[o + jf(i, t, !0)]) && (s = !0), !s && d(f._any) && (s = !0)), c && (s = !0), s && l && t.stopPropagation(), kg = null, s;
}
function If(e) {
	let t = e.scrollDOM.getBoundingClientRect();
	return {
		left: (e.textDirection == sm.LTR ? t.left : t.right - e.scrollDOM.clientWidth * e.scaleX) - e.scrollDOM.scrollLeft * e.scaleX,
		top: t.top - e.scrollDOM.scrollTop * e.scaleY
	};
}
function Lf(e, t, n, r) {
	let i = e.coordsAtPos(t, n * 2);
	if (!i) return r;
	let a = e.dom.getBoundingClientRect(), o = (i.top + i.bottom) / 2, s = e.posAtCoords({
		x: a.left + 1,
		y: o
	}), c = e.posAtCoords({
		x: a.right - 1,
		y: o
	});
	return s == null || c == null ? r : {
		from: Math.max(r.from, Math.min(s, c)),
		to: Math.min(r.to, Math.max(s, c))
	};
}
function Rf(e, t, n) {
	if (n.to <= e.viewport.from || n.from >= e.viewport.to) return [];
	let r = Math.max(n.from, e.viewport.from), i = Math.min(n.to, e.viewport.to), a = e.textDirection == sm.LTR, o = e.contentDOM, s = o.getBoundingClientRect(), c = If(e), l = o.querySelector(".cm-line"), u = l && window.getComputedStyle(l), d = s.left + (u ? parseInt(u.paddingLeft) + Math.min(0, parseInt(u.textIndent)) : 0), f = s.right - (u ? parseInt(u.paddingRight) : 0), p = wd(e, r, 1), m = wd(e, i, -1), h = p.type == Xp.Text ? p : null, g = m.type == Xp.Text ? m : null;
	if (h && (e.lineWrapping || p.widgetLineBreaks) && (h = Lf(e, r, 1, h)), g && (e.lineWrapping || m.widgetLineBreaks) && (g = Lf(e, i, -1, g)), h && g && h.from == g.from && h.to == g.to) return v(y(n.from, n.to, h));
	{
		let t = h ? y(n.from, null, h) : b(p, !1), r = g ? y(null, n.to, g) : b(m, !0), i = [];
		return (h || p).to < (g || m).from - (h && g ? 1 : 0) || p.widgetLineBreaks > 1 && t.bottom + e.defaultLineHeight / 2 < r.top ? i.push(_(d, t.bottom, f, r.top)) : t.bottom < r.top && e.elementAtHeight((t.bottom + r.top) / 2).type == Xp.Text && (t.bottom = r.top = (t.bottom + r.top) / 2), v(t).concat(i).concat(v(r));
	}
	function _(e, n, r, i) {
		return new Ag(t, e - c.left, n - c.top, Math.max(0, r - e), i - n);
	}
	function v({ top: e, bottom: t, horizontal: n }) {
		let r = [];
		for (let i = 0; i < n.length; i += 2) r.push(_(n[i], e, n[i + 1], t));
		return r;
	}
	function y(t, n, r) {
		let i = 1e9, o = -1e9, s = [];
		function c(t, n, c, l, u) {
			let p = e.coordsAtPos(t, t == r.to ? -2 : 2), m = e.coordsAtPos(c, c == r.from ? 2 : -2);
			p && m && (i = Math.min(p.top, m.top, i), o = Math.max(p.bottom, m.bottom, o), u == sm.LTR ? s.push(a && n ? d : p.left, a && l ? f : m.right) : s.push(!a && l ? d : m.left, !a && n ? f : p.right));
		}
		let l = t ?? r.from, u = n ?? r.to;
		for (let r of e.visibleRanges) if (r.to > l && r.from < u) for (let i = Math.max(r.from, l), a = Math.min(r.to, u);;) {
			let r = e.state.doc.lineAt(i);
			for (let o of e.bidiSpans(r)) {
				let e = o.from + r.from, s = o.to + r.from;
				if (e >= a) break;
				s > i && c(Math.max(e, i), t == null && e <= l, Math.min(s, a), n == null && s >= u, o.dir);
			}
			if (i = r.to + 1, i >= a) break;
		}
		return s.length == 0 && c(l, t == null, u, n == null, e.textDirection), {
			top: i,
			bottom: o,
			horizontal: s
		};
	}
	function b(e, t) {
		let n = s.top + (t ? e.top : e.bottom);
		return {
			top: n,
			bottom: n,
			horizontal: []
		};
	}
}
function zf(e, t) {
	return e.constructor == t.constructor && e.eq(t);
}
function Bf(e) {
	return [Im.define((t) => new jg(t, e)), Mg.of(e)];
}
function Vf(e = {}) {
	return [
		Pg.of(e),
		Fg,
		Ig,
		Rg,
		Om.of(!0)
	];
}
function Hf(e) {
	return e.facet(Pg);
}
function Uf(e) {
	return e.startState.facet(Pg) != e.state.facet(Pg);
}
function Wf(e, t) {
	t.style.animationDuration = e.facet(Pg).cursorBlinkRate + "ms";
}
function Gf() {
	return [Bg, Vg];
}
function Kf(e, t, n, r, i) {
	t.lastIndex = 0;
	for (let a = e.iterRange(n, r), o = n, s; !a.next().done; o += a.value.length) if (!a.lineBreak) for (; s = t.exec(a.value);) i(o + s.index, s);
}
function qf(e, t) {
	let n = e.visibleRanges;
	if (n.length == 1 && n[0].from == e.viewport.from && n[0].to == e.viewport.to) return n;
	let r = [];
	for (let { from: i, to: a } of n) i = Math.max(e.state.doc.lineAt(i).from, i - t), a = Math.min(e.state.doc.lineAt(a).to, a + t), r.length && r[r.length - 1].to >= i ? r[r.length - 1].to = a : r.push({
		from: i,
		to: a
	});
	return r;
}
function Jf() {
	if (Kg == null && typeof document < "u" && document.body) {
		let e = document.body.style;
		Kg = (e.tabSize ?? e.MozTabSize) != null;
	}
	return Kg || !1;
}
function Yf(e = {}) {
	return [qg.of(e), Xf()];
}
function Xf() {
	return Jg ||= Im.fromClass(class {
		constructor(e) {
			this.view = e, this.decorations = Y.none, this.decorationCache = Object.create(null), this.decorator = this.makeDecorator(e.state.facet(qg)), this.decorations = this.decorator.createDeco(e);
		}
		makeDecorator(e) {
			return new Hg({
				regexp: e.specialChars,
				decoration: (t, n, r) => {
					let { doc: i } = n.state, a = dc(t[0], 0);
					if (a == 9) {
						let e = i.lineAt(r), t = n.state.tabSize, a = Yc(e.text, t, r - e.from);
						return Y.replace({ widget: new Zg((t - a % t) * this.view.defaultCharacterWidth / this.view.scaleX) });
					}
					return this.decorationCache[a] || (this.decorationCache[a] = Y.replace({ widget: new Xg(e, a) }));
				},
				boundary: e.replaceTabs ? void 0 : /[^]/
			});
		}
		update(e) {
			let t = e.state.facet(qg);
			e.startState.facet(qg) == t ? this.decorations = this.decorator.updateDeco(e, this.decorations) : (this.decorator = this.makeDecorator(t), this.decorations = this.decorator.createDeco(e.view));
		}
	}, { decorations: (e) => e.decorations });
}
function Zf(e) {
	return e >= 32 ? Yg : e == 10 ? "␤" : String.fromCharCode(9216 + e);
}
function Qf() {
	return [Qg, zm.of((e) => e.plugin(Qg)?.attrs || null)];
}
function $f() {
	return e_;
}
function ep(e) {
	let t = Im.fromClass(class {
		constructor(t) {
			this.view = t, this.placeholder = e ? Y.set([Y.widget({
				widget: new t_(e),
				side: 1
			}).range(0)]) : Y.none;
		}
		get decorations() {
			return this.view.state.doc.length ? Y.none : this.placeholder;
		}
	}, { decorations: (e) => e.decorations });
	return typeof e == "string" ? [t, X.contentAttributes.of({ "aria-placeholder": e })] : t;
}
function tp(e, t, n) {
	let r = Math.min(t.line, n.line), i = Math.max(t.line, n.line), a = [];
	if (t.off > n_ || n.off > n_ || t.col < 0 || n.col < 0) {
		let o = Math.min(t.off, n.off), s = Math.max(t.off, n.off);
		for (let t = r; t <= i; t++) {
			let n = e.doc.line(t);
			n.length <= s && a.push(K.range(n.from + o, n.to + s));
		}
	} else {
		let o = Math.min(t.col, n.col), s = Math.max(t.col, n.col);
		for (let t = r; t <= i; t++) {
			let n = e.doc.line(t), r = Xc(n.text, o, e.tabSize, !0);
			if (r < 0) a.push(K.cursor(n.to));
			else {
				let t = Xc(n.text, s, e.tabSize);
				a.push(K.range(n.from + r, n.from + t));
			}
		}
	}
	return a;
}
function np(e, t) {
	let n = e.coordsAtPos(e.viewport.from);
	return n ? Math.round(Math.abs((n.left - t) / e.defaultCharacterWidth)) : -1;
}
function rp(e, t) {
	let n = e.posAtCoords({
		x: t.clientX,
		y: t.clientY
	}, !1), r = e.state.doc.lineAt(n), i = n - r.from, a = i > n_ ? -1 : i == r.length ? np(e, t.clientX) : Yc(r.text, e.state.tabSize, n - r.from);
	return {
		line: r.number,
		col: a,
		off: i
	};
}
function ip(e, t) {
	let n = rp(e, t), r = e.state.selection;
	return n ? {
		update(e) {
			if (e.docChanged) {
				let t = e.changes.mapPos(e.startState.doc.line(n.line).from), i = e.state.doc.lineAt(t);
				n = {
					line: i.number,
					col: n.col,
					off: Math.min(n.off, i.length)
				}, r = r.map(e.changes);
			}
		},
		get(t, i, a) {
			let o = rp(e, t);
			if (!o) return r;
			let s = tp(e.state, n, o);
			return s.length ? a ? K.create(s.concat(r.ranges)) : K.create(s) : r;
		}
	} : null;
}
function ap(e) {
	let t = e?.eventFilter || ((e) => e.altKey && e.button == 0);
	return X.mouseSelectionStyle.of((e, n) => t(n) ? ip(e, n) : null);
}
function op(e = {}) {
	let [t, n] = r_[e.key || "Alt"], r = Im.fromClass(class {
		constructor(e) {
			this.view = e, this.isDown = !1;
		}
		set(e) {
			this.isDown != e && (this.isDown = e, this.view.update([]));
		}
	}, { eventObservers: {
		keydown(e) {
			this.set(e.keyCode == t || n(e));
		},
		keyup(e) {
			e.keyCode != t && n(e) || this.set(!1);
		},
		mousemove(e) {
			this.set(n(e));
		}
	} });
	return [r, X.contentAttributes.of((e) => e.plugin(r)?.isDown ? i_ : null)];
}
function sp(e = {}) {
	return s_.of(e);
}
function cp(e) {
	let t = e.dom.ownerDocument.documentElement, n = t.clientWidth, r = getComputedStyle(t);
	if (!/stable/.test(r.scrollbarGutter || "")) return {
		left: 0,
		right: n
	};
	let i = t.getBoundingClientRect(), a = e.win.scrollX;
	return {
		left: Math.max(0, i.left + a - parseFloat(r.marginLeft)),
		right: Math.min(n, i.right + a + parseFloat(r.marginRight))
	};
}
function lp(e) {
	let { left: t, right: n } = cp(e);
	return {
		top: 0,
		left: t,
		right: n,
		bottom: e.dom.ownerDocument.documentElement.clientHeight
	};
}
function up(e, t) {
	let n = parseInt(e.style.left, 10);
	(isNaN(n) || Math.abs(t - n) > 1) && (e.style.left = t + "px");
}
function dp(e, t) {
	let { left: n, right: r, top: i, bottom: a } = e.getBoundingClientRect(), o;
	if (o = e.querySelector(".cm-tooltip-arrow")) {
		let e = o.getBoundingClientRect();
		i = Math.min(e.top, i), a = Math.max(e.bottom, a);
	}
	return t.clientX >= n - v_ && t.clientX <= r + v_ && t.clientY >= i - v_ && t.clientY <= a + v_;
}
function fp(e, t, n, r, i, a) {
	let o = e.scrollDOM.getBoundingClientRect(), s = e.documentTop + e.documentPadding.top + e.contentHeight;
	if (o.left > r || o.right < r || o.top > i || Math.min(o.bottom, s) < i) return !1;
	let c = e.posAtCoords({
		x: r,
		y: i
	}, !1);
	return c >= t && c <= n;
}
function pp(e, t = {}) {
	let n = Al.define(), r = /* @__PURE__ */ new WeakMap(), i = pl.define({
		create() {
			return [];
		},
		update(e, a) {
			let o = r.get(e);
			if (e.length && (t.hideOnChange && (a.docChanged || a.selection) || o && o(a) ? e = [] : t.hideOn && (e = e.filter((e) => !t.hideOn(a, e)))), a.docChanged && e.length) {
				let t = [];
				for (let n of e) {
					let e = a.changes.mapPos(n.pos, -1, al.TrackDel);
					if (e != null) {
						let r = Object.assign(Object.create(null), n);
						r.pos = e, r.end != null && (r.end = a.changes.mapPos(r.end)), t.push(r);
					}
				}
				e = t;
			}
			for (let t of a.effects) t.is(n) && (e = t.value, o = void 0), (t.is(y_) && !t.value || t.value == i) && (e = []);
			return e.length && o && r.set(e, o), e;
		},
		provide: (e) => p_.from(e)
	}), a = Im.define((a) => new __(a, e, i, r, n, t.hoverTime || 300));
	return {
		active: i,
		extension: [
			i,
			a,
			g_.of(a),
			h_
		]
	};
}
function mp(e, t, n, r = {}) {
	let i = e.state.facet(g_).map((t) => e.plugin(t)).filter((e) => !!e);
	if (r.tooltip && r.tooltip.active) {
		let e = i.find((e) => e.field == r.tooltip.active);
		e && (i = [e]);
	}
	for (let a of i) a.activateHover(e, t, n, r.until ?? (() => !1));
}
function hp(e, t) {
	let n = e.plugin(l_);
	if (!n) return null;
	let r = n.manager.tooltips.indexOf(t);
	return r < 0 ? null : n.manager.tooltipViews[r];
}
function gp(e) {
	return e.facet(p_).some((e) => e);
}
function _p(e) {
	return y_.of(e.active);
}
function vp(e) {
	let t = e.plugin(l_);
	t && t.maybeMeasure();
}
function yp(e) {
	return e ? [x_.of(e)] : [];
}
function bp(e, t) {
	let n = e.plugin(S_), r = n ? n.specs.indexOf(t) : -1;
	return r > -1 ? n.panels[r] : null;
}
function xp(e) {
	let t = e.nextSibling;
	return e.remove(), t;
}
function Sp(e, t) {
	let n, r = new Promise((e) => n = e), i = (e) => wp(e, t, n);
	e.state.field(T_, !1) ? e.dispatch({ effects: E_.of(i) }) : e.dispatch({ effects: Al.appendConfig.of(T_.init(() => [i])) });
	let a = D_.of(i);
	return {
		close: a,
		result: r.then((t) => ((e.win.queueMicrotask || ((t) => e.win.setTimeout(t, 10)))(() => {
			e.state.field(T_).indexOf(i) > -1 && e.dispatch({ effects: a });
		}), t))
	};
}
function Cp(e, t) {
	let n = e.state.field(T_, !1) || [];
	for (let r of n) {
		let n = bp(e, r);
		if (n && n.dom.classList.contains(t)) return n;
	}
	return null;
}
function wp(e, t, n) {
	let r = t.content ? t.content(e, () => s(null)) : null;
	if (!r) {
		if (r = su("form"), t.input) {
			let e = su("input", t.input);
			/^(text|password|number|email|tel|url)$/.test(e.type) && e.classList.add("cm-textfield"), e.name ||= "input", r.appendChild(su("label", (t.label || "") + ": ", e));
		} else r.appendChild(document.createTextNode(t.label || ""));
		r.appendChild(document.createTextNode(" ")), r.appendChild(su("button", {
			class: "cm-button",
			type: "submit"
		}, t.submitLabel || "OK"));
	}
	let i = r.nodeName == "FORM" ? [r] : r.querySelectorAll("form");
	for (let e = 0; e < i.length; e++) {
		let t = i[e];
		t.addEventListener("keydown", (e) => {
			e.keyCode == 27 ? (e.preventDefault(), s(null)) : e.keyCode == 13 && (e.preventDefault(), s(t));
		}), t.addEventListener("submit", (e) => {
			e.preventDefault(), s(t);
		});
	}
	let a = su("div", r, su("button", {
		onclick: () => s(null),
		"aria-label": e.state.phrase("close"),
		class: "cm-dialog-close",
		type: "button"
	}, ["×"]));
	t.class && (a.className = t.class), a.classList.add("cm-dialog");
	let o = typeof t.focus == "string" ? r.querySelector(t.focus) : t.focus ? r.querySelector("input") || r.querySelector("button") : null;
	function s(t) {
		a.contains(a.ownerDocument.activeElement) && e.focus(), n(t);
	}
	return {
		dom: a,
		top: t.top,
		mount: () => {
			o && ("select" in o ? o.select() : "focus" in o && o.focus());
		},
		destroy: () => n(null)
	};
}
function Tp(e) {
	return [Ep(), M_.of({
		...j_,
		...e
	})];
}
function Ep(e) {
	let t = [P_];
	return e && e.fixed === !1 && t.push(N_.of(!0)), t;
}
function Dp(e) {
	return Array.isArray(e) ? e : [e];
}
function Op(e, t, n) {
	for (; e.value && e.from <= n;) e.from == n && t.push(e.value), e.next();
}
function kp(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].compare(t[n])) return !1;
	return !0;
}
function Ap(e, t) {
	return e.state.facet(B_).formatNumber(t, e.state);
}
function jp(e = {}) {
	return [
		B_.of(e),
		Ep(),
		H_
	];
}
function Mp(e) {
	let t = 9;
	for (; t < e;) t = t * 10 + 9;
	return t;
}
function Np() {
	return W_;
}
function Pp(e) {
	return Im.define((t) => ({
		decorations: e.createDeco(t),
		update(t) {
			this.decorations = e.updateDeco(t, this.decorations);
		}
	}), { decorations: (e) => e.decorations });
}
function Fp() {
	return q_;
}
function Ip() {
	return J_;
}
var Lp, Rp, zp, Bp, Vp, Hp, Up, Wp, Gp, Kp, qp, J, Jp, Yp, Xp, Y, Zp, Qp, $p, em, tm, nm, rm, im, am, om, sm, cm, lm, um, dm, fm, pm, mm, hm, gm, _m, vm, ym, bm, xm, Sm, Cm, wm, Tm, Em, Dm, Om, km, Am, jm, Mm, Nm, Pm, Fm, Im, Lm, Rm, zm, Bm, Vm, Hm, Um, Wm, Gm, Km, qm, Jm, Ym, Xm, Zm, Qm, $m, eh, th, nh, rh, ih, ah, oh, sh, ch, lh, uh, dh, fh, ph, mh, hh, gh, _h, vh, yh, bh, xh, Sh, Ch, wh, Th, Eh, Dh, Oh, kh, Ah, jh, Mh, Nh, Ph, Fh, Ih, Lh, Rh, zh, Bh, Vh, Hh, Uh, Wh, Gh, Kh, qh, Jh, Yh, Xh, Zh, Qh, $h, eg, tg, ng, rg, ig, ag, og, sg, cg, lg, ug, dg, fg, pg, mg, hg, gg, _g, vg, yg, X, bg, xg, Sg, Cg, wg, Tg, Eg, Dg, Og, kg, Ag, jg, Mg, Ng, Pg, Fg, Ig, Lg, Rg, zg, Bg, Vg, Hg, Ug, Wg, Gg, Kg, qg, Jg, Yg, Xg, Zg, Qg, $g, e_, t_, n_, r_, i_, a_, o_, s_, c_, l_, u_, d_, f_, p_, m_, h_, g_, __, v_, y_, b_, x_, S_, C_, w_, T_, E_, D_, O_, k_, A_, j_, M_, N_, P_, F_, I_, L_, R_, z_, B_, V_, H_, U_, W_, G_, K_, q_, J_, Y_, X_ = t((() => {
	Gl(), $l(), ou(), lu(), Lp = typeof navigator < "u" ? navigator : {
		userAgent: "",
		vendor: "",
		platform: ""
	}, Rp = typeof document < "u" ? document : { documentElement: { style: {} } }, zp = /*@__PURE__*/ /Edge\/(\d+)/.exec(Lp.userAgent), Bp = /*@__PURE__*/ /MSIE \d/.test(Lp.userAgent), Vp = /*@__PURE__*/ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Lp.userAgent), Hp = !!(Bp || Vp || zp), Up = !Hp && /*@__PURE__*/ /gecko\/(\d+)/i.test(Lp.userAgent), Wp = !Hp && /*@__PURE__*/ /Chrome\/(\d+)/.exec(Lp.userAgent), Gp = "webkitFontSmoothing" in Rp.documentElement.style, Kp = !Hp && /*@__PURE__*/ /Apple Computer/.test(Lp.vendor), qp = Kp && (/*@__PURE__*/ /Mobile\/\w+/.test(Lp.userAgent) || Lp.maxTouchPoints > 2), J = {
		mac: qp || /*@__PURE__*/ /Mac/.test(Lp.platform),
		windows: /*@__PURE__*/ /Win/.test(Lp.platform),
		linux: /*@__PURE__*/ /Linux|X11/.test(Lp.platform),
		ie: Hp,
		ie_version: Bp ? Rp.documentMode || 6 : Vp ? +Vp[1] : zp ? +zp[1] : 0,
		gecko: Up,
		gecko_version: Up ? +(/*@__PURE__*/ /Firefox\/(\d+)/.exec(Lp.userAgent) || [0, 0])[1] : 0,
		chrome: !!Wp,
		chrome_version: Wp ? +Wp[1] : 0,
		ios: qp,
		android: /*@__PURE__*/ /Android\b/.test(Lp.userAgent),
		webkit: Gp,
		webkit_version: Gp ? +(/*@__PURE__*/ /\bAppleWebKit\/(\d+)/.exec(Lp.userAgent) || [0, 0])[1] : 0,
		safari: Kp,
		safari_version: Kp ? +(/*@__PURE__*/ /\bVersion\/(\d+(\.\d+)?)/.exec(Lp.userAgent) || [0, 0])[1] : 0,
		tabSize: Rp.documentElement.style.tabSize == null ? "-moz-tab-size" : "tab-size"
	}, Jp = /*@__PURE__*/ Object.create(null), Yp = class {
		eq(e) {
			return !1;
		}
		updateDOM(e, t, n) {
			return !1;
		}
		compare(e) {
			return this == e || this.constructor == e.constructor && this.eq(e);
		}
		get estimatedHeight() {
			return -1;
		}
		get lineBreaks() {
			return 0;
		}
		ignoreEvent(e) {
			return !0;
		}
		coordsAt(e, t, n) {
			return null;
		}
		get isHidden() {
			return !1;
		}
		get editable() {
			return !1;
		}
		destroy(e) {}
	}, Xp = /*@__PURE__*/ (function(e) {
		return e[e.Text = 0] = "Text", e[e.WidgetBefore = 1] = "WidgetBefore", e[e.WidgetAfter = 2] = "WidgetAfter", e[e.WidgetRange = 3] = "WidgetRange", e;
	})(Xp ||= {}), Y = class extends Ll {
		constructor(e, t, n, r) {
			super(), this.startSide = e, this.endSide = t, this.widget = n, this.spec = r;
		}
		get heightRelevant() {
			return !1;
		}
		static mark(e) {
			return new Zp(e);
		}
		static widget(e) {
			let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), n = !!e.block;
			return t += n && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new $p(e, t, t, n, e.widget || null, !1);
		}
		static replace(e) {
			let t = !!e.block, n, r;
			if (e.isBlockGap) n = -5e8, r = 4e8;
			else {
				let { start: i, end: a } = gu(e, t);
				n = (i ? t ? -3e8 : -1 : 5e8) - 1, r = (a ? t ? 2e8 : 1 : -6e8) + 1;
			}
			return new $p(e, n, r, t, e.widget || null, !0);
		}
		static line(e) {
			return new Qp(e);
		}
		static set(e, t = !1) {
			return Bl.of(e, t);
		}
		hasHeight() {
			return this.widget ? this.widget.estimatedHeight > -1 : !1;
		}
	}, Y.none = Bl.empty, Zp = class e extends Y {
		constructor(e) {
			let { start: t, end: n } = gu(e);
			super(t ? -1 : 5e8, n ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.attrs = e.class && e.attributes ? du(e.attributes, { class: e.class }) : e.class ? { class: e.class } : e.attributes || Jp;
		}
		eq(t) {
			return this == t || t instanceof e && this.tagName == t.tagName && fu(this.attrs, t.attrs);
		}
		range(e, t = e) {
			if (e >= t) throw RangeError("Mark decorations may not be empty");
			return super.range(e, t);
		}
	}, Zp.prototype.point = !1, Qp = class e extends Y {
		constructor(e) {
			super(-2e8, -2e8, null, e);
		}
		eq(t) {
			return t instanceof e && this.spec.class == t.spec.class && fu(this.spec.attributes, t.spec.attributes);
		}
		range(e, t = e) {
			if (t != e) throw RangeError("Line decoration ranges must be zero-length");
			return super.range(e, t);
		}
	}, Qp.prototype.mapMode = al.TrackBefore, Qp.prototype.point = !0, $p = class e extends Y {
		constructor(e, t, n, r, i, a) {
			super(t, n, i, e), this.block = r, this.isReplace = a, this.mapMode = r ? t <= 0 ? al.TrackBefore : al.TrackAfter : al.TrackDel;
		}
		get type() {
			return this.startSide == this.endSide ? this.startSide <= 0 ? Xp.WidgetBefore : Xp.WidgetAfter : Xp.WidgetRange;
		}
		get heightRelevant() {
			return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
		}
		eq(t) {
			return t instanceof e && _u(this.widget, t.widget) && this.block == t.block && this.startSide == t.startSide && this.endSide == t.endSide;
		}
		range(e, t = e) {
			if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0)) throw RangeError("Invalid range for replacement decoration");
			if (!this.isReplace && t != e) throw RangeError("Widget decorations can only have zero-length ranges");
			return super.range(e, t);
		}
	}, $p.prototype.point = !0, em = class e extends Ll {
		constructor(e, t, n) {
			super(), this.tagName = e, this.attributes = t, this.rank = n;
		}
		eq(t) {
			return t == this || t instanceof e && this.tagName == t.tagName && fu(this.attributes, t.attributes);
		}
		static create(t) {
			return new e(t.tagName, t.attributes || Jp, t.rank == null ? 50 : Math.max(0, Math.min(t.rank, 100)));
		}
		static set(e, t = !1) {
			return Bl.of(e, t);
		}
	}, em.prototype.startSide = em.prototype.endSide = -1, tm = (e) => e.nodeType == 1, nm = (e) => e.nodeType == 3, rm = class {
		constructor() {
			this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
		}
		eq(e) {
			return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
		}
		setRange(e) {
			let { anchorNode: t, focusNode: n } = e;
			this.set(t, Math.min(e.anchorOffset, t ? Du(t) : 0), n, Math.min(e.focusOffset, n ? Du(n) : 0));
		}
		set(e, t, n, r) {
			this.anchorNode = e, this.anchorOffset = t, this.focusNode = n, this.focusOffset = r;
		}
	}, im = null, J.safari && J.safari_version >= 26 && (im = !1), om = class e {
		constructor(e, t, n = !0) {
			this.node = e, this.offset = t, this.precise = n;
		}
		static before(t, n) {
			return new e(t.parentNode, wu(t), n);
		}
		static after(t, n) {
			return new e(t.parentNode, wu(t) + 1, n);
		}
	}, sm = /*@__PURE__*/ (function(e) {
		return e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL", e;
	})(sm ||= {}), cm = sm.LTR, lm = sm.RTL, um = /*@__PURE__*/ Uu("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), dm = /*@__PURE__*/ Uu("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), fm = /*@__PURE__*/ Object.create(null), pm = [];
	for (let e of [
		"()",
		"[]",
		"{}"
	]) {
		let t = /*@__PURE__*/ e.charCodeAt(0), n = /*@__PURE__*/ e.charCodeAt(1);
		fm[t] = n, fm[n] = -t;
	}
	mm = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/, hm = class {
		get dir() {
			return this.level % 2 ? lm : cm;
		}
		constructor(e, t, n) {
			this.from = e, this.to = t, this.level = n;
		}
		side(e, t) {
			return this.dir == t == e ? this.to : this.from;
		}
		forward(e, t) {
			return e == (this.dir == t);
		}
		static find(e, t, n, r) {
			let i = -1;
			for (let a = 0; a < e.length; a++) {
				let o = e[a];
				if (o.from <= t && o.to >= t) {
					if (o.level == n) return a;
					(i < 0 || (r == 0 ? e[i].level > o.level : r < 0 ? o.from < t : o.to > t)) && (i = a);
				}
			}
			if (i < 0) throw RangeError("Index out of range");
			return i;
		}
	}, gm = [], _m = "", vm = /*@__PURE__*/ q.define(), ym = /*@__PURE__*/ q.define(), bm = /*@__PURE__*/ q.define(), xm = /*@__PURE__*/ q.define(), Sm = /*@__PURE__*/ q.define(), Cm = /*@__PURE__*/ q.define(), wm = /*@__PURE__*/ q.define(), Tm = /*@__PURE__*/ q.define(), Em = /*@__PURE__*/ q.define(), Dm = /*@__PURE__*/ q.define({ combine: (e) => e.some((e) => e) }), Om = /*@__PURE__*/ q.define({ combine: (e) => e.some((e) => e) }), km = /*@__PURE__*/ q.define(), Am = class e {
		constructor(e, t, n, r, i, a = !1) {
			this.range = e, this.y = t, this.x = n, this.yMargin = r, this.xMargin = i, this.isSnapshot = a;
		}
		map(t) {
			return t.empty ? this : new e(this.range.map(t), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
		}
		clip(t) {
			return this.range.to <= t.doc.length ? this : new e(K.cursor(t.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
		}
	}, jm = /*@__PURE__*/ Al.define({ map: (e, t) => e.map(t) }), Mm = /*@__PURE__*/ Al.define(), Nm = /*@__PURE__*/ q.define({ combine: (e) => !e.length || e[0] }), Pm = 0, Fm = /*@__PURE__*/ q.define({ combine(e) {
		return e.filter((t, n) => {
			for (let r = 0; r < n; r++) if (e[r].plugin == t.plugin) return !1;
			return !0;
		});
	} }), Im = class e {
		constructor(e, t, n, r, i) {
			this.id = e, this.create = t, this.domEventHandlers = n, this.domEventObservers = r, this.baseExtensions = i(this), this.extension = this.baseExtensions.concat(Fm.of({
				plugin: this,
				arg: void 0
			}));
		}
		of(e) {
			return this.baseExtensions.concat(Fm.of({
				plugin: this,
				arg: e
			}));
		}
		static define(t, n) {
			let { eventHandlers: r, eventObservers: i, provide: a, decorations: o } = n || {};
			return new e(Pm++, t, r, i, (e) => {
				let t = [];
				return o && t.push(Bm.of((t) => {
					let n = t.plugin(e);
					return n ? o(n) : Y.none;
				})), a && t.push(a(e)), t;
			});
		}
		static fromClass(t, n) {
			return e.define((e, n) => new t(e, n), n);
		}
	}, Lm = class {
		constructor(e) {
			this.spec = e, this.mustUpdate = null, this.value = null;
		}
		get plugin() {
			return this.spec && this.spec.plugin;
		}
		update(e) {
			if (!this.value) {
				if (this.spec) try {
					this.value = this.spec.plugin.create(e, this.spec.arg);
				} catch (t) {
					td(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
				}
			} else if (this.mustUpdate) {
				let e = this.mustUpdate;
				if (this.mustUpdate = null, this.value.update) try {
					this.value.update(e);
				} catch (t) {
					if (td(e.state, t, "CodeMirror plugin crashed"), this.value.destroy) try {
						this.value.destroy();
					} catch {}
					this.deactivate();
				}
			}
			return this;
		}
		destroy(e) {
			if (this.value?.destroy) try {
				this.value.destroy();
			} catch (t) {
				td(e.state, t, "CodeMirror plugin crashed");
			}
		}
		deactivate() {
			this.spec = this.value = null;
		}
	}, Rm = /*@__PURE__*/ q.define(), zm = /*@__PURE__*/ q.define(), Bm = /*@__PURE__*/ q.define(), Vm = /*@__PURE__*/ q.define(), Hm = /*@__PURE__*/ q.define(), Um = /*@__PURE__*/ q.define(), Wm = /*@__PURE__*/ q.define(), Gm = /*@__PURE__*/ q.define(), Km = /*@__PURE__*/ q.define(), qm = class e {
		constructor(e, t, n, r) {
			this.fromA = e, this.toA = t, this.fromB = n, this.toB = r;
		}
		join(t) {
			return new e(Math.min(this.fromA, t.fromA), Math.max(this.toA, t.toA), Math.min(this.fromB, t.fromB), Math.max(this.toB, t.toB));
		}
		addToSet(e) {
			let t = e.length, n = this;
			for (; t > 0; t--) {
				let r = e[t - 1];
				if (!(r.fromA > n.toA)) {
					if (r.toA < n.fromA) break;
					n = n.join(r), e.splice(t - 1, 1);
				}
			}
			return e.splice(t, 0, n), e;
		}
		static extendWithRanges(t, n) {
			if (n.length == 0) return t;
			let r = [];
			for (let i = 0, a = 0, o = 0;;) {
				let s = i < t.length ? t[i].fromB : 1e9, c = a < n.length ? n[a] : 1e9, l = Math.min(s, c);
				if (l == 1e9) break;
				let u = l + o, d = l, f = u;
				for (;;) if (a < n.length && n[a] <= d) {
					let e = n[a + 1];
					a += 2, d = Math.max(d, e);
					for (let e = i; e < t.length && t[e].fromB <= d; e++) o = t[e].toA - t[e].toB;
					f = Math.max(f, e + o);
				} else if (i < t.length && t[i].fromB <= d) {
					let e = t[i++];
					d = Math.max(d, e.toB), f = Math.max(f, e.toA), o = e.toA - e.toB;
				} else break;
				r.push(new e(u, f, l, d));
			}
			return r;
		}
	}, Jm = class e {
		constructor(e, t, n) {
			this.view = e, this.state = t, this.transactions = n, this.flags = 0, this.startState = e.state, this.changes = sl.empty(this.startState.doc.length);
			for (let e of n) this.changes = this.changes.compose(e.changes);
			let r = [];
			this.changes.iterChangedRanges((e, t, n, i) => r.push(new qm(e, t, n, i))), this.changedRanges = r;
		}
		static create(t, n, r) {
			return new e(t, n, r);
		}
		get viewportChanged() {
			return (this.flags & 4) > 0;
		}
		get viewportMoved() {
			return (this.flags & 8) > 0;
		}
		get heightChanged() {
			return (this.flags & 2) > 0;
		}
		get geometryChanged() {
			return this.docChanged || (this.flags & 18) > 0;
		}
		get focusChanged() {
			return (this.flags & 1) > 0;
		}
		get docChanged() {
			return !this.changes.empty;
		}
		get selectionSet() {
			return this.transactions.some((e) => e.selection);
		}
		get empty() {
			return this.flags == 0 && this.transactions.length == 0;
		}
	}, Ym = [], Xm = class {
		constructor(e, t, n = 0) {
			this.dom = e, this.length = t, this.flags = n, this.parent = null, e.cmTile = this;
		}
		get breakAfter() {
			return this.flags & 1;
		}
		get children() {
			return Ym;
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
				let e = this.domAttrs;
				e && pu(this.dom, e);
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
			let n = t;
			for (let t of this.children) {
				if (t == e) return n;
				n += t.length + t.breakAfter;
			}
			throw RangeError("Invalid child in posBefore");
		}
		posAfter(e) {
			return this.posBefore(e) + e.length;
		}
		covers(e) {
			return !0;
		}
		coordsIn(e, t, n) {
			return null;
		}
		domPosFor(e, t) {
			let n = wu(this.dom), r = this.length ? e > 0 : t > 0;
			return new om(this.parent.dom, n + +!!r, e == 0 || e == this.length);
		}
		markDirty(e) {
			this.flags &= -3, e && (this.flags |= 4), this.parent && this.parent.flags & 2 && this.parent.markDirty(!1);
		}
		get overrideDOMText() {
			return null;
		}
		get root() {
			for (let e = this; e; e = e.parent) if (e instanceof Qm) return e;
			return null;
		}
		static get(e) {
			return e.cmTile;
		}
	}, Zm = class extends Xm {
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
			if (this.flags & 2) return;
			super.sync(e);
			let t = this.dom, n = null, r, i = e?.node == t ? e : null, a = 0;
			for (let o of this.children) {
				if (o.sync(e), a += o.length + o.breakAfter, r = n ? n.nextSibling : t.firstChild, i && r != o.dom && (i.written = !0), o.dom.parentNode == t) for (; r && r != o.dom;) r = ad(r);
				else t.insertBefore(o.dom, r);
				n = o.dom;
			}
			for (r = n ? n.nextSibling : t.firstChild, i && r && (i.written = !0); r;) r = ad(r);
			this.length = a;
		}
	}, Qm = class extends Zm {
		constructor(e, t) {
			super(t), this.view = e;
		}
		owns(e) {
			for (; e; e = e.parent) if (e == this) return !0;
			return !1;
		}
		isBlock() {
			return !0;
		}
		nearest(e) {
			for (;;) {
				if (!e) return null;
				let t = Xm.get(e);
				if (t && this.owns(t)) return t;
				e = e.parentNode;
			}
		}
		blockTiles(e) {
			for (let t = [], n = this, r = 0, i = 0;;) if (r == n.children.length) {
				if (!t.length) return;
				n = n.parent, n.breakAfter && i++, r = t.pop();
			} else {
				let a = n.children[r++];
				if (a instanceof $m) t.push(r), n = a, r = 0;
				else {
					let t = i + a.length, n = e(a, i);
					if (n !== void 0) return n;
					i = t + a.breakAfter;
				}
			}
		}
		resolveBlock(e, t) {
			let n, r = -1, i, a = -1;
			if (this.blockTiles((o, s) => {
				let c = s + o.length;
				if (e >= s && e <= c) {
					if (o.isWidget() && t >= -1 && t <= 1) {
						if (o.flags & 32) return !0;
						o.flags & 16 && (n = void 0);
					}
					(s < e || e == c && (t < -1 ? o.length : o.covers(1))) && (!n || !o.isWidget() && n.isWidget()) && (n = o, r = e - s), (c > e || e == s && (t > 1 ? o.length : o.covers(-1))) && (!i || !o.isWidget() && i.isWidget()) && (i = o, a = e - s);
				}
			}), !n && !i) throw Error("No tile at position " + e);
			return n && t < 0 || !i ? {
				tile: n,
				offset: r
			} : {
				tile: i,
				offset: a
			};
		}
	}, $m = class e extends Zm {
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
		static of(t, n) {
			let r = new e(n || document.createElement(t.tagName), t);
			return n || (r.flags |= 4), r;
		}
	}, eh = class e extends Zm {
		constructor(e, t) {
			super(e), this.attrs = t;
		}
		isLine() {
			return !0;
		}
		static start(t, n, r) {
			let i = new e(n || document.createElement("div"), t);
			return n && r || (i.flags |= 4), i;
		}
		get domAttrs() {
			return this.attrs;
		}
		resolveInline(e, t, n = !1) {
			let r = null, i = -1, a = null, o = -1;
			function s(e, c) {
				for (let l = 0, u = 0; l < e.children.length && u <= c; l++) {
					let d = e.children[l], f = u + d.length;
					f >= c && (d.isComposite() ? s(d, c - u) : (!a || n && a.isHidden && (t > 0 && !(a.flags & 32) || n && sd(a, d))) && (f > c || d.flags & 32 && t <= 1) ? (a = d, o = c - u) : (u < c || d.flags & 16 && !(n && d.isHidden) && t >= -1) && (r = d, i = c - u)), u = f;
				}
			}
			s(this, e);
			let c = (t < 0 ? r : a) || r || a;
			return c ? {
				tile: c,
				offset: c == r ? i : o
			} : null;
		}
		coordsIn(e, t, n) {
			let r = this.resolveInline(e, t, !0);
			return r ? r.tile.coordsIn(Math.max(0, r.offset), t, n) : od(this);
		}
		domIn(e, t) {
			let n = this.resolveInline(e, t);
			if (n) {
				let { tile: e, offset: r } = n;
				if (this.dom.contains(e.dom)) return e.isText() ? new om(e.dom, Math.min(e.dom.nodeValue.length, r)) : e.domPosFor(r, e.flags & 16 ? 1 : e.flags & 32 ? -1 : t);
				let i = n.tile.parent, a = !1;
				for (let e of i.children) {
					if (a) return new om(e.dom, 0);
					e == n.tile && (a = !0);
				}
			}
			return new om(this.dom, 0);
		}
	}, th = class e extends Zm {
		constructor(e, t) {
			super(e), this.mark = t;
		}
		get domAttrs() {
			return this.mark.attrs;
		}
		static of(t, n) {
			let r = new e(n || document.createElement(t.tagName), t);
			return n || (r.flags |= 4), r;
		}
	}, nh = class e extends Xm {
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
		coordsIn(e, t, n) {
			let r = this.dom.nodeValue.length;
			e > r && (e = r);
			let i = e, a = e, o = 0;
			e == 0 && t < 0 || e == r && t >= 0 ? J.chrome || J.gecko || (e ? (i--, o = 1) : a < r && (a++, o = -1)) : t < 0 ? i-- : a < r && a++;
			let s = Iu(this.dom, i, a).getClientRects();
			if (!s.length) return null;
			let c = s[(o ? o < 0 : t >= 0) ? 0 : s.length - 1];
			return J.safari && !o && c.width == 0 && (c = Array.prototype.find.call(s, (e) => e.width) || c), n == null ? c : Ou(c, (o ? o > 0 : t < 0) == n);
		}
		static of(t, n) {
			let r = new e(n || document.createTextNode(t), t);
			return n || (r.flags |= 2), r;
		}
	}, rh = class e extends Xm {
		constructor(e, t, n, r) {
			super(e, t, r), this.widget = n;
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
		coordsInWidget(e, t, n) {
			let r = this.widget.coordsAt(this.dom, e, t);
			if (r) return r;
			if (n) return Ou(this.dom.getBoundingClientRect(), this.length ? e == 0 : t <= 0);
			{
				let t = this.dom.getClientRects(), n = null;
				if (!t.length) return null;
				let r = this.flags & 16 ? !0 : this.flags & 32 ? !1 : e > 0;
				for (let i = r ? t.length - 1 : 0; n = t[i], !(e > 0 ? i == 0 : i == t.length - 1 || n.top < n.bottom); i += r ? -1 : 1);
				return Ou(n, !r);
			}
		}
		get overrideDOMText() {
			if (!this.length) return Zc.empty;
			let { root: e } = this;
			if (!e) return Zc.empty;
			let t = this.posAtStart;
			return e.view.state.doc.slice(t, t + this.length);
		}
		destroy() {
			super.destroy(), this.widget.destroy(this.dom);
		}
		static of(t, n, r, i, a) {
			return a || (a = t.toDOM(n), t.editable || (a.contentEditable = "false")), new e(a, r, t, i);
		}
	}, ih = class extends Xm {
		constructor(e) {
			let t = document.createElement("img");
			t.className = "cm-widgetBuffer", t.setAttribute("aria-hidden", "true"), super(t, 0, e);
		}
		get isHidden() {
			return !0;
		}
		get overrideDOMText() {
			return Zc.empty;
		}
		coordsIn(e, t, n) {
			let r = this.dom.getBoundingClientRect();
			return n == null ? r : Ou(r, t > 0 == n);
		}
	}, ah = class {
		constructor(e) {
			this.index = 0, this.beforeBreak = !1, this.parents = [], this.tile = e;
		}
		advance(e, t, n) {
			let { tile: r, index: i, beforeBreak: a, parents: o } = this;
			for (; e || t > 0;) if (!r.isComposite()) {
				let t = r.length;
				if (i < t && e) {
					let a = Math.min(e, t - i);
					n && n.skip(r, i, i + a), e -= a, i += a;
				}
				if (i == t) a = !!r.breakAfter, {tile: r, index: i} = o.pop(), i++;
				else if (!e) break;
			} else if (a) {
				if (!e) break;
				n && n.break(), e--, a = !1;
			} else if (i == r.children.length) {
				if (!e && !o.length) break;
				n && n.leave(r), a = !!r.breakAfter, {tile: r, index: i} = o.pop(), i++;
			} else {
				let s = r.children[i], c = s.breakAfter;
				(t > 0 ? s.length <= e : s.length < e) && (!n || n.skip(s, 0, s.length) !== !1 || !s.isComposite) ? (a = !!c, i++, e -= s.length) : (o.push({
					tile: r,
					index: i
				}), r = s, i = 0, n && s.isComposite() && n.enter(s));
			}
			return this.tile = r, this.index = i, this.beforeBreak = a, this;
		}
		get root() {
			return this.parents.length ? this.parents[0].tile : this.tile;
		}
	}, oh = class {
		constructor(e, t, n, r) {
			this.from = e, this.to = t, this.wrapper = n, this.rank = r;
		}
	}, sh = class {
		constructor(e, t, n) {
			this.cache = e, this.root = t, this.blockWrappers = n, this.curLine = null, this.lastBlock = null, this.afterWidget = null, this.pos = 0, this.wrappers = [], this.wrapperPos = 0;
		}
		addText(e, t, n, r) {
			this.flushBuffer();
			let i = this.ensureMarks(t, n), a = i.lastChild;
			if (a && a.isText() && !(a.flags & 8) && a.length + e.length < 512) {
				this.cache.reused.set(a, 2);
				let t = i.children[i.children.length - 1] = new nh(a.dom, a.text + e);
				t.parent = i;
			} else i.append(r || nh.of(e, this.cache.find(nh)?.dom));
			this.pos += e.length, this.afterWidget = null;
		}
		addComposition(e, t) {
			let n = this.curLine;
			n.dom != t.line.dom && (n.setDOM(this.cache.reused.has(t.line) ? fd(t.line.dom) : t.line.dom), this.cache.reused.set(t.line, 2));
			let r = n;
			for (let e = t.marks.length - 1; e >= 0; e--) {
				let n = t.marks[e], i = r.lastChild;
				if (i instanceof th && i.mark.eq(n.mark)) i.dom != n.dom && i.setDOM(fd(n.dom)), r = i;
				else {
					let { dom: e } = n;
					this.cache.reused.get(n) && Xm.get(n.dom) && (e = fd(n.dom));
					let t = th.of(n.mark, e);
					r.append(t), r = t;
				}
				this.cache.reused.set(n, 2);
			}
			let i = Xm.get(e.text);
			i && this.cache.reused.set(i, 2);
			let a = new nh(e.text, e.text.nodeValue);
			a.flags |= 8, this.pos = e.range.toB, r.append(a);
		}
		addInlineWidget(e, t, n) {
			let r = this.afterWidget && e.flags & 48 && (this.afterWidget.flags & 48) == (e.flags & 48);
			r || this.flushBuffer();
			let i = this.ensureMarks(t, n);
			!r && !(e.flags & 16) && i.append(this.getBuffer(1)), i.append(e), this.pos += e.length, this.afterWidget = e;
		}
		addMark(e, t, n) {
			this.flushBuffer(), this.ensureMarks(t, n).append(e), this.pos += e.length, this.afterWidget = null;
		}
		addBlockWidget(e) {
			this.getBlockPos().append(e), this.pos += e.length, this.lastBlock = e, this.endLine();
		}
		continueWidget(e) {
			let t = this.afterWidget || this.lastBlock;
			t.length += e, this.pos += e;
		}
		addLineStart(e, t) {
			e ||= fh;
			let n = eh.start(e, t || this.cache.find(eh)?.dom, !!t);
			this.getBlockPos().append(this.lastBlock = this.curLine = n);
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
			let n = this.curLine;
			for (let r = e.length - 1; r >= 0; r--) {
				let i = e[r], a;
				if (t > 0 && (a = n.lastChild) && a instanceof th && a.mark.eq(i)) n = a, t--;
				else {
					let e = th.of(i, this.cache.find(th, (e) => e.mark.eq(i))?.dom);
					n.append(e), n = e, t = 0;
				}
			}
			return n;
		}
		endLine() {
			if (this.curLine) {
				this.flushBuffer();
				let e = this.curLine.lastChild;
				(!e || !cd(this.curLine, !1) || e.dom.nodeName != "BR" && e.isWidget() && !(J.ios && cd(this.curLine, !0))) && this.curLine.append(this.cache.findWidget(mh, 0, 32) || new rh(mh.toDOM(), 0, mh, 32)), this.curLine = this.afterWidget = null;
			}
		}
		updateBlockWrappers() {
			this.wrapperPos > this.pos + 1e4 && (this.blockWrappers.goto(this.pos), this.wrappers.length = 0);
			for (let e = this.wrappers.length - 1; e >= 0; e--) this.wrappers[e].to < this.pos && this.wrappers.splice(e, 1);
			for (let e = this.blockWrappers; e.value && e.from <= this.pos; e.next()) if (e.to >= this.pos) {
				let t = e.rank * 102 + e.value.rank, n = new oh(e.from, e.to, e.value, t), r = this.wrappers.length;
				for (; r > 0 && (this.wrappers[r - 1].rank - n.rank || this.wrappers[r - 1].to - n.to) < 0;) r--;
				this.wrappers.splice(r, 0, n);
			}
			this.wrapperPos = this.pos;
		}
		getBlockPos() {
			this.updateBlockWrappers();
			let e = this.root;
			for (let t of this.wrappers) {
				let n = e.lastChild;
				if (t.from < this.pos && n instanceof $m && n.wrapper.eq(t.wrapper)) e = n;
				else {
					let n = $m.of(t.wrapper, this.cache.find($m, (e) => e.wrapper.eq(t.wrapper))?.dom);
					e.append(n), e = n;
				}
			}
			return e;
		}
		blockPosCovered() {
			let e = this.lastBlock;
			return e != null && !e.breakAfter && (!e.isWidget() || (e.flags & 160) > 0);
		}
		getBuffer(e) {
			let t = 2 | (e < 0 ? 16 : 32), n = this.cache.find(ih, void 0, 1);
			return n && (n.flags = t), n || new ih(t);
		}
		flushBuffer() {
			this.afterWidget && !(this.afterWidget.flags & 32) && (this.afterWidget.parent.append(this.getBuffer(-1)), this.afterWidget = null);
		}
	}, ch = class {
		constructor(e) {
			this.skipCount = 0, this.text = "", this.textOff = 0, this.cursor = e.iter();
		}
		skip(e) {
			this.textOff + e <= this.text.length ? this.textOff += e : (this.skipCount += e - (this.text.length - this.textOff), this.text = "", this.textOff = 0);
		}
		next(e) {
			if (this.textOff == this.text.length) {
				let { value: t, lineBreak: n, done: r } = this.cursor.next(this.skipCount);
				if (this.skipCount = 0, r) throw Error("Ran out of text content when drawing inline views");
				this.text = t;
				let i = this.textOff = Math.min(e, t.length);
				return n ? null : t.slice(0, i);
			}
			let t = Math.min(this.text.length, this.textOff + e), n = this.text.slice(this.textOff, t);
			return this.textOff = t, n;
		}
	}, lh = [
		rh,
		eh,
		nh,
		th,
		ih,
		$m,
		Qm
	];
	for (let e = 0; e < lh.length; e++) lh[e].bucket = e;
	uh = class {
		constructor(e) {
			this.view = e, this.buckets = lh.map(() => []), this.index = lh.map(() => 0), this.reused = /* @__PURE__ */ new Map();
		}
		add(e) {
			let t = e.constructor.bucket, n = this.buckets[t];
			n.length < 6 ? n.push(e) : n[this.index[t] = (this.index[t] + 1) % 6] = e;
		}
		find(e, t, n = 2) {
			let r = e.bucket, i = this.buckets[r], a = this.index[r];
			for (let e = 0; e < i.length; e++) {
				let o = (e + a) % i.length, s = i[o];
				if ((!t || t(s)) && !this.reused.has(s)) return i.splice(o, 1), o < a && this.index[r]--, this.reused.set(s, n), s;
			}
			return null;
		}
		findWidget(e, t, n) {
			let r = this.buckets[0];
			if (r.length) for (let i = 0, a = 0;; i++) {
				if (i == r.length) {
					if (a) return null;
					a = 1, i = 0;
				}
				let o = r[i];
				if (!this.reused.has(o) && (a == 0 ? o.widget.compare(e) : o.widget.constructor == e.constructor && e.updateDOM(o.dom, this.view, o.widget))) return r.splice(i, 1), i < this.index[0] && this.index[0]--, o.widget == e && o.length == t && (o.flags & 497) == n ? (this.reused.set(o, 1), o) : (this.reused.set(o, 2), new rh(o.dom, t, e, o.flags & -498 | n));
			}
		}
		reuse(e) {
			return this.reused.set(e, 1), e;
		}
		maybeReuse(e, t = 2) {
			if (!this.reused.has(e)) return this.reused.set(e, t), e.dom;
		}
		clear() {
			for (let e = 0; e < this.buckets.length; e++) this.buckets[e].length = this.index[e] = 0;
		}
	}, dh = class {
		constructor(e, t, n, r, i) {
			this.view = e, this.decorations = r, this.disallowBlockEffectsFor = i, this.openWidget = !1, this.openMarks = 0, this.cache = new uh(e), this.text = new ch(e.state.doc), this.builder = new sh(this.cache, new Qm(e, e.contentDOM), Bl.iter(n)), this.cache.reused.set(t, 2), this.old = new ah(t), this.reuseWalker = {
				skip: (e, t, n) => {
					if (this.cache.add(e), e.isComposite()) return !1;
				},
				enter: (e) => this.cache.add(e),
				leave: () => {},
				break: () => {}
			};
		}
		run(e, t) {
			let n = t && this.getCompositionContext(t.text);
			for (let r = 0, i = 0, a = 0;;) {
				let o = a < e.length ? e[a++] : null, s = o ? o.fromA : this.old.root.length;
				if (s > r) {
					let e = s - r;
					this.preserve(e, !a, !o), r = s, i += e;
				}
				if (!o) break;
				t && o.fromA <= t.range.fromA && o.toA >= t.range.toA ? (this.forward(o.fromA, t.range.fromA, t.range.fromA < t.range.toA ? 1 : -1), this.emit(i, t.range.fromB), this.builder.flushBuffer(), this.cache.clear(), this.builder.addComposition(t, n), this.text.skip(t.range.toB - t.range.fromB), this.forward(t.range.fromA, o.toA), this.emit(t.range.toB, o.toB)) : (this.forward(o.fromA, o.toA), this.emit(i, o.toB)), i = o.toB, r = o.toA;
			}
			return this.builder.curLine && this.builder.endLine(), this.builder.root;
		}
		preserve(e, t, n) {
			let r = dd(this.old), i = this.openMarks;
			this.old.advance(e, n ? 1 : -1, {
				skip: (e, t, n) => {
					if (e.isWidget()) {
						if (this.openWidget) this.builder.continueWidget(n - t);
						else {
							let a = n > 0 || t < e.length ? rh.of(e.widget, this.view, n - t, e.flags & 496, this.cache.maybeReuse(e)) : this.cache.reuse(e);
							a.flags & 256 ? (a.flags &= -2, this.builder.addBlockWidget(a)) : (this.builder.ensureLine(null), this.builder.addInlineWidget(a, r, i), i = r.length);
						}
					} else if (e.isText()) this.builder.ensureLine(null), !t && n == e.length && !this.cache.reused.has(e) ? this.builder.addText(e.text, r, i, this.cache.reuse(e)) : (this.cache.add(e), this.builder.addText(e.text.slice(t, n), r, i)), i = r.length;
					else if (e.isLine()) e.flags &= -2, this.cache.reused.set(e, 1), this.builder.addLine(e);
					else if (e instanceof ih) this.cache.add(e);
					else if (e instanceof th) this.builder.ensureLine(null), this.builder.addMark(e, r, i), this.cache.reused.set(e, 1), i = r.length;
					else return !1;
					this.openWidget = !1;
				},
				enter: (e) => {
					e.isLine() ? this.builder.addLineStart(e.attrs, this.cache.maybeReuse(e)) : (this.cache.add(e), e instanceof th && r.unshift(e.mark)), this.openWidget = !1;
				},
				leave: (e) => {
					e.isLine() ? r.length &&= i = 0 : e instanceof th && (r.shift(), i = Math.min(i, r.length));
				},
				break: () => {
					this.builder.addBreak(), this.openWidget = !1;
				}
			}), this.text.skip(e);
		}
		emit(e, t) {
			let n = null, r = this.builder, i = -1, a = Bl.spans(this.decorations, e, t, {
				point: (e, t, a, o, s, c) => {
					if (a instanceof $p) {
						if (this.disallowBlockEffectsFor[c]) {
							if (a.block) throw RangeError("Block decorations may not be specified via plugins");
							if (t > this.view.state.doc.lineAt(e).to) throw RangeError("Decorations that replace line breaks may not be specified via plugins");
						}
						if (i = o.length, s > o.length) r.continueWidget(t - e);
						else {
							let i = a.widget || (a.block ? ph.block : ph.inline), c = ld(a), l = this.cache.findWidget(i, t - e, c) || rh.of(i, this.view, t - e, c);
							a.block ? (a.startSide > 0 && r.addLineStartIfNotCovered(n), r.addBlockWidget(l)) : (r.ensureLine(n), r.addInlineWidget(l, o, s));
						}
						n = null;
					} else n = ud(n, a);
					t > e && this.text.skip(t - e);
				},
				span: (e, t, a, o) => {
					for (let i = e; i < t;) {
						let s = this.text.next(Math.min(512, t - i));
						s == null ? (r.addLineStartIfNotCovered(n), r.addBreak(), i++) : (r.ensureLine(n), r.addText(s, a, i == e ? o : a.length), i += s.length), n = null;
					}
					i = a.length;
				}
			});
			i > -1 && (this.openWidget = a > i), this.openWidget || r.addLineStartIfNotCovered(n), this.openMarks = a;
		}
		forward(e, t, n = 1) {
			t - e <= 10 ? this.old.advance(t - e, n, this.reuseWalker) : (this.old.advance(5, -1, this.reuseWalker), this.old.advance(t - e - 10, -1), this.old.advance(5, n, this.reuseWalker));
		}
		getCompositionContext(e) {
			let t = [], n = null;
			for (let r = e.parentNode;; r = r.parentNode) {
				let e = Xm.get(r);
				if (r == this.view.contentDOM) break;
				e instanceof th ? t.push(e) : e?.isLine() ? n = e : e instanceof $m || (r.nodeName == "DIV" && !n ? n = new eh(r, fh) : n || t.push(th.of(new Zp({
					tagName: r.nodeName.toLowerCase(),
					attributes: hu(r)
				}), r)));
			}
			return n ? {
				line: n,
				marks: t
			} : null;
		}
	}, fh = { class: "cm-line" }, ph = class extends Yp {
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
	}, ph.inline = /*@__PURE__*/ new ph("span"), ph.block = /*@__PURE__*/ new ph("div"), mh = /*@__PURE__*/ new class extends Yp {
		toDOM() {
			return document.createElement("br");
		}
		get isHidden() {
			return !0;
		}
		get editable() {
			return !0;
		}
	}(), hh = class {
		constructor(e) {
			this.view = e, this.decorations = [], this.blockWrappers = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.editContextFormatting = Y.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.updateDeco(), this.tile = new Qm(e, e.contentDOM), this.updateInner([new qm(0, 0, 0, e.state.doc.length)], null);
		}
		update(e) {
			let t = e.changedRanges;
			this.minWidth > 0 && t.length && (t.every(({ fromA: e, toA: t }) => t < this.minWidthFrom || e > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(e);
			let n = -1;
			this.view.inputState.composing >= 0 && !this.view.observer.editContext && (this.domChanged?.newSel ? n = this.domChanged.newSel.head : !xd(e.changes, this.hasComposition) && !e.selectionSet && (n = e.state.selection.main.head));
			let r = n > -1 ? gd(this.view, e.changes, n) : null;
			if (this.domChanged = null, this.hasComposition) {
				let { from: n, to: r } = this.hasComposition;
				t = new qm(n, r, e.changes.mapPos(n, -1), e.changes.mapPos(r, 1)).addToSet(t.slice());
			}
			this.hasComposition = r ? {
				from: r.range.fromB,
				to: r.range.toB
			} : null, (J.ie || J.chrome) && !r && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
			let i = this.decorations, a = this.blockWrappers;
			this.updateDeco();
			let o = vd(i, this.decorations, e.changes);
			o.length && (t = qm.extendWithRanges(t, o));
			let s = yd(a, this.blockWrappers, e.changes);
			return s.length && (t = qm.extendWithRanges(t, s)), r && !t.some((e) => e.fromA <= r.range.fromA && e.toA >= r.range.toA) && (t = r.range.addToSet(t.slice())), this.tile.flags & 2 && t.length == 0 ? !1 : (this.updateInner(t, r), e.transactions.length && (this.lastUpdate = Date.now()), !0);
		}
		updateInner(e, t) {
			this.view.viewState.mustMeasureContent = !0;
			let { observer: n } = this.view;
			n.ignore(() => {
				if (t || e.length) {
					let n = this.tile, r = new dh(this.view, n, this.blockWrappers, this.decorations, this.dynamicDecorationMap);
					t && Xm.get(t.text) && r.cache.reused.set(Xm.get(t.text), 2), this.tile = r.run(e, t), pd(n, r.cache.reused);
				}
				this.tile.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.tile.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
				let r = J.chrome || J.ios ? {
					node: n.selectionRange.focusNode,
					written: !1
				} : void 0;
				this.tile.sync(r), r && (r.written || n.selectionRange.focusNode != r.node || !this.tile.dom.contains(r.node)) && (this.forceSelection = !0), this.tile.dom.style.height = "";
			});
			let r = [];
			if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length) for (let e of this.tile.children) e.isWidget() && e.widget instanceof vh && r.push(e.dom);
			n.updateGaps(r);
		}
		updateEditContextFormatting(e) {
			this.editContextFormatting = this.editContextFormatting.map(e.changes);
			for (let t of e.transactions) for (let e of t.effects) e.is(Mm) && (this.editContextFormatting = e.value);
		}
		updateSelection(e = !1, t = !1) {
			(e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
			let { dom: n } = this.tile, r = this.view.root.activeElement, i = r == n, a = !i && !(this.view.state.facet(Nm) || n.tabIndex > -1) && xu(n, this.view.observer.selectionRange) && !(r && n.contains(r));
			if (!(i || t || a)) return;
			let o = this.forceSelection;
			this.forceSelection = !1;
			let s = this.view.state.selection.main, c, l;
			if (s.empty ? l = c = this.inlineDOMNearPos(s.anchor, s.assoc || 1) : (l = this.inlineDOMNearPos(s.head, s.head == s.from ? 1 : -1), c = this.inlineDOMNearPos(s.anchor, s.anchor == s.from ? 1 : -1)), J.gecko && s.empty && !this.hasComposition && md(c)) {
				let e = document.createTextNode("");
				this.view.observer.ignore(() => c.node.insertBefore(e, c.node.childNodes[c.offset] || null)), c = l = new om(e, 0), o = !0;
			}
			let u = this.view.observer.selectionRange;
			!o && u.focusNode && (Cu(c.node, c.offset, u.anchorNode, u.anchorOffset) && Cu(l.node, l.offset, u.focusNode, u.focusOffset) || this.suppressWidgetCursorChange(u, s)) || (this.view.observer.ignore(() => {
				J.android && J.chrome && n.contains(u.focusNode) && bd(u.focusNode, n) && (n.blur(), n.focus({ preventScroll: !0 }));
				let e = yu(this.view.root);
				if (e) {
					if (s.empty) {
						if (J.gecko) {
							let e = _d(c.node, c.offset);
							if (e && e != 3) {
								let t = (e == 1 ? Vu : Hu)(c.node, c.offset);
								t && (c = new om(t.node, t.offset));
							}
						}
						e.collapse(c.node, c.offset), s.bidiLevel != null && e.caretBidiLevel !== void 0 && (e.caretBidiLevel = s.bidiLevel);
					} else if (e.extend) {
						e.collapse(c.node, c.offset);
						try {
							e.extend(l.node, l.offset);
						} catch {}
					} else {
						let t = document.createRange();
						s.anchor > s.head && ([c, l] = [l, c]), t.setEnd(l.node, l.offset), t.setStart(c.node, c.offset), e.removeAllRanges(), e.addRange(t);
					}
				}
				a && this.view.root.activeElement == n && (n.blur(), r && r.focus());
			}), this.view.observer.setSelectionRange(c, l)), this.impreciseAnchor = c.precise ? null : new om(u.anchorNode, u.anchorOffset), this.impreciseHead = l.precise ? null : new om(u.focusNode, u.focusOffset);
		}
		suppressWidgetCursorChange(e, t) {
			return this.hasComposition && t.empty && Cu(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
		}
		enforceCursorAssoc() {
			if (this.hasComposition) return;
			let { view: e } = this, t = e.state.selection.main, n = yu(e.root), { anchorNode: r, anchorOffset: i } = e.observer.selectionRange;
			if (!n || !t.empty || !t.assoc || !n.modify) return;
			let a = this.lineAt(t.head, t.assoc);
			if (!a) return;
			let o = a.posAtStart;
			if (t.head == o || t.head == o + a.length) return;
			let s = this.coordsAt(t.head, -1), c = this.coordsAt(t.head, 1);
			if (!s || !c || s.bottom > c.top) return;
			let l = this.domAtPos(t.head + t.assoc, t.assoc);
			n.collapse(l.node, l.offset), n.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
			let u = e.observer.selectionRange;
			e.docView.posFromDOM(u.anchorNode, u.anchorOffset) != t.from && n.collapse(r, i);
		}
		posFromDOM(e, t) {
			let n = this.tile.nearest(e);
			if (!n) return this.tile.dom.compareDocumentPosition(e) & 2 ? 0 : this.view.state.doc.length;
			let r = n.posAtStart;
			if (n.isComposite()) {
				let i;
				if (e == n.dom) i = n.dom.childNodes[t];
				else {
					let r = Du(e) == 0 ? 0 : t == 0 ? -1 : 1;
					for (;;) {
						let t = e.parentNode;
						if (t == n.dom) break;
						r == 0 && t.firstChild != t.lastChild && (r = e == t.firstChild ? -1 : 1), e = t;
					}
					i = r < 0 ? e : e.nextSibling;
				}
				if (i == n.dom.firstChild) return r;
				for (; i && !Xm.get(i);) i = i.nextSibling;
				if (!i) return r + n.length;
				for (let e = 0, t = r;; e++) {
					let r = n.children[e];
					if (r.dom == i) return t;
					t += r.length + r.breakAfter;
				}
			} else if (n.isText()) return e == n.dom ? r + t : r + (t ? n.length : 0);
			else return r;
		}
		domAtPos(e, t) {
			let { tile: n, offset: r } = this.tile.resolveBlock(e, t);
			return n.isWidget() ? n.domPosFor(r, t) : n.domIn(r, t);
		}
		inlineDOMNearPos(e, t) {
			let n, r = -1, i = !1, a, o = -1, s = !1;
			return this.tile.blockTiles((t, c) => {
				if (t.isWidget()) {
					if (t.flags & 32 && c >= e) return !0;
					t.flags & 16 && (i = !0);
				} else {
					let l = c + t.length;
					if (c <= e && (n = t, r = e - c, i = l < e), l >= e && !a && (a = t, o = e - c, s = c > e), c > e && a) return !0;
				}
			}), !n && !a ? this.domAtPos(e, t) : (i && a ? n = null : s && n && (a = null), n && t < 0 || !a ? n.domIn(r, t) : a.domIn(o, t));
		}
		coordsAt(e, t, n) {
			let { tile: r, offset: i } = this.tile.resolveBlock(e, t);
			return r.isWidget() ? r.widget instanceof vh ? null : r.coordsInWidget(i, t, !0) : r.coordsIn(i, t, n);
		}
		lineAt(e, t) {
			let { tile: n } = this.tile.resolveBlock(e, t);
			return n.isLine() ? n : null;
		}
		coordsForChar(e) {
			let { tile: t, offset: n } = this.tile.resolveBlock(e, 1);
			if (!t.isLine()) return null;
			function r(e, t) {
				if (e.isComposite()) for (let n of e.children) {
					if (n.length >= t) {
						let e = r(n, t);
						if (e) return e;
					}
					if (t -= n.length, t < 0) break;
				}
				else if (e.isText() && t < e.length) {
					let n = cc(e.text, t);
					if (n == t) return null;
					let r = Iu(e.dom, t, n).getClientRects();
					for (let e = 0; e < r.length; e++) {
						let t = r[e];
						if (e == r.length - 1 || t.top < t.bottom && t.left < t.right) return t;
					}
				}
				return null;
			}
			return r(t, n);
		}
		measureVisibleLineHeights(e) {
			let t = [], { from: n, to: r } = e, i = this.view.contentDOM.clientWidth, a = i > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, o = -1, s = this.view.textDirection == sm.LTR, c = 0, l = (e, u, d) => {
				for (let f = 0; f < e.children.length && !(u > r); f++) {
					let r = e.children[f], p = u + r.length, m = r.dom.getBoundingClientRect(), { height: h } = m;
					if (d && !f && (c += m.top - d.top), r instanceof $m) p > n && l(r, u, m);
					else if (u >= n && (c > 0 && t.push(-c), t.push(h + c), c = 0, a)) {
						let e = r.dom.lastChild, t = e ? Su(e) : [];
						if (t.length) {
							let e = t[t.length - 1], n = s ? e.right - m.left : m.right - e.left;
							n > o && (o = n, this.minWidth = i, this.minWidthFrom = u, this.minWidthTo = p);
						}
					}
					d && f == e.children.length - 1 && (c += d.bottom - m.bottom), u = p + r.breakAfter;
				}
			};
			return l(this.tile, 0, null), t;
		}
		textDirectionAt(e) {
			let { tile: t } = this.tile.resolveBlock(e, 1);
			return getComputedStyle(t.dom).direction == "rtl" ? sm.RTL : sm.LTR;
		}
		measureTextSize() {
			let e = this.tile.blockTiles((e) => {
				if (e.isLine() && e.children.length && e.length <= 20) {
					let t = 0, n;
					for (let r of e.children) {
						if (!r.isText() || /[^ -~]/.test(r.text)) return;
						let e = Su(r.dom);
						if (e.length != 1) return;
						t += e[0].width, n = e[0].height;
					}
					if (t) return {
						lineHeight: e.dom.getBoundingClientRect().height,
						charWidth: t / e.length,
						textHeight: n
					};
				}
			});
			if (e) return e;
			let t = document.createElement("div"), n, r, i;
			return t.className = "cm-line", t.style.width = "99999px", t.style.position = "absolute", t.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
				this.tile.dom.appendChild(t);
				let e = Su(t.firstChild)[0];
				n = t.getBoundingClientRect().height, r = e && e.width ? e.width / 27 : 7, i = e && e.height ? e.height : n, t.remove();
			}), {
				lineHeight: n,
				charWidth: r,
				textHeight: i
			};
		}
		computeBlockGapDeco() {
			let e = [], t = this.view.viewState;
			for (let n = 0, r = 0;; r++) {
				let i = r == t.viewports.length ? null : t.viewports[r], a = i ? i.from - 1 : this.view.state.doc.length;
				if (a > n) {
					let r = (t.lineBlockAt(a).bottom - t.lineBlockAt(n).top) / this.view.scaleY;
					e.push(Y.replace({
						widget: new vh(r),
						block: !0,
						inclusive: !0,
						isBlockGap: !0
					}).range(n, a));
				}
				if (!i) break;
				n = i.to + 1;
			}
			return Y.set(e);
		}
		updateDeco() {
			let e = 1, t = this.view.state.facet(Bm).map((t) => (this.dynamicDecorationMap[e++] = typeof t == "function") ? t(this.view) : t), n = !1, r = this.view.state.facet(Hm).map((e, t) => {
				let r = typeof e == "function";
				return r && (n = !0), r ? e(this.view) : e;
			});
			for (r.length && (this.dynamicDecorationMap[e++] = n, t.push(Bl.join(r))), this.decorations = [
				this.editContextFormatting,
				...t,
				this.computeBlockGapDeco(),
				this.view.viewState.lineGapDeco
			]; e < this.decorations.length;) this.dynamicDecorationMap[e++] = !1;
			this.blockWrappers = this.view.state.facet(Vm).map((e) => typeof e == "function" ? e(this.view) : e);
		}
		scrollIntoView(e) {
			if (e.isSnapshot) {
				let t = this.view.viewState.lineBlockAt(e.range.head);
				this.view.scrollDOM.scrollTop = t.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
				return;
			}
			for (let t of this.view.state.facet(km)) try {
				if (t(this.view, e.range, e)) return !0;
			} catch (e) {
				td(this.view.state, e, "scroll handler");
			}
			let { range: t } = e, n = this.coordsAt(t.head, t.assoc || (t.head > t.anchor ? -1 : 1)), r;
			if (!n) return;
			!t.empty && (r = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (n = {
				left: Math.min(n.left, r.left),
				top: Math.min(n.top, r.top),
				right: Math.max(n.right, r.right),
				bottom: Math.max(n.bottom, r.bottom)
			});
			let i = id(this.view), a = {
				left: n.left - i.left,
				top: n.top - i.top,
				right: n.right + i.right,
				bottom: n.bottom + i.bottom
			}, { offsetWidth: o, offsetHeight: s } = this.view.scrollDOM;
			if (ju(this.view.scrollDOM, a, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, o), -o), Math.max(Math.min(e.yMargin, s), -s), this.view.textDirection == sm.LTR), window.visualViewport && window.innerHeight - window.visualViewport.height > 1 && (n.top > window.visualViewport.offsetTop + window.visualViewport.height || n.bottom < window.visualViewport.offsetTop)) {
				let e = this.view.docView.lineAt(t.head, 1);
				if (e) {
					let t = Nu(e.dom);
					e.dom.scrollIntoView({ block: "nearest" }), Pu(t, !1);
				}
			}
		}
		lineHasWidget(e) {
			let t = (e) => e.isWidget() || e.children.some(t);
			return t(this.tile.resolveBlock(e, 1).tile);
		}
		destroy() {
			pd(this.tile);
		}
	}, gh = class {
		constructor() {
			this.changes = [];
		}
		compareRange(e, t) {
			vu(e, t, this.changes);
		}
		comparePoint(e, t) {
			vu(e, t, this.changes);
		}
		boundChange(e) {
			vu(e, e, this.changes);
		}
	}, _h = class {
		constructor() {
			this.changes = [];
		}
		compareRange(e, t) {
			vu(e, t, this.changes);
		}
		comparePoint() {}
		boundChange(e) {
			vu(e, e, this.changes);
		}
	}, vh = class extends Yp {
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
	}, yh = class {
		constructor(e, t) {
			this.pos = e, this.assoc = t;
		}
	}, bh = class {
		constructor(e, t, n, r) {
			this.view = e, this.x = t, this.y = n, this.baseDir = r, this.line = null, this.spans = null;
		}
		bidiSpansAt(e) {
			return (!this.line || this.line.from > e || this.line.to < e) && (this.line = this.view.state.doc.lineAt(e), this.spans = this.view.bidiSpans(this.line)), this;
		}
		baseDirAt(e, t) {
			let { line: n, spans: r } = this.bidiSpansAt(e);
			return r[hm.find(r, e - n.from, -1, t)].level == this.baseDir;
		}
		dirAt(e, t) {
			let { line: n, spans: r } = this.bidiSpansAt(e);
			return r[hm.find(r, e - n.from, -1, t)].dir;
		}
		bidiIn(e, t) {
			let { spans: n, line: r } = this.bidiSpansAt(e);
			return n.length > 1 || n.length && (n[0].level != this.baseDir || n[0].to + r.from < t);
		}
		scan(e, t, n = !1) {
			let r = 0, i = e.length - 1, a = /* @__PURE__ */ new Set(), o = this.bidiIn(e[0], e[i]), s, c, l = -1, u = 1e9, d;
			search: for (; r < i;) {
				let n = i - r, f = r + i >> 1;
				adjust: if (a.has(f)) {
					for (let e = 1; e < n; e++) {
						let t = f + e;
						if (t >= i && (t -= n), !a.has(t)) {
							f = t;
							break adjust;
						}
					}
					break search;
				}
				a.add(f);
				let p = t(f), m = 0;
				if (p) for (let e = 0; e < p.length; e++) {
					let t = p[e];
					if (!(t.width == 0 && p.length > 1)) {
						if (t.bottom < this.y) (!s || s.bottom < t.bottom) && (s = t), m = 1;
						else if (t.top > this.y) (!c || c.top > t.top) && (c = t), m = -1;
						else {
							let e = t.left > this.x ? this.x - t.left : t.right < this.x ? this.x - t.right : 0, n = Math.abs(e);
							n < u && (l = f, u = n, d = t), e && (m = e < 0 == (this.baseDir == sm.LTR) ? -1 : 1);
						}
					}
				}
				m == -1 && (!o || this.baseDirAt(e[f], 1)) ? i = f : m == 1 && (!o || this.baseDirAt(e[f + 1], -1)) && (r = f + 1);
			}
			if (!d) {
				if (!c && !s) return {
					i: 0,
					after: !1
				};
				let n = s && (!c || this.y - s.bottom < c.top - this.y) ? s : c;
				return this.y = (n.top + n.bottom) / 2, this.scan(e, t, !0);
			}
			if (u && !n) {
				let { top: n, bottom: r } = d;
				if (s && s.bottom > (n + n + r) / 3) return this.y = s.bottom - 1, this.scan(e, t, !0);
				if (c && c.top < (n + r + r) / 3) return this.y = c.top + 1, this.scan(e, t, !0);
			}
			let f = (o ? this.dirAt(e[l], 1) : this.baseDir) == sm.LTR;
			return {
				i: l,
				after: this.x > (d.left + d.right) / 2 == f
			};
		}
		scanText(e, t) {
			let n = [];
			for (let r = 0; r < e.length; r = cc(e.text, r)) n.push(t + r);
			n.push(t + e.length);
			let r = this.scan(n, (r) => {
				let i = n[r] - t, a = n[r + 1] - t;
				return Iu(e.dom, i, a).getClientRects();
			});
			return r.after ? new yh(n[r.i + 1], -1) : new yh(n[r.i], 1);
		}
		scanTile(e, t) {
			if (!e.length) return new yh(t, 1);
			if (e.children.length == 1) {
				let n = e.children[0];
				if (n.isText()) return this.scanText(n, t);
				if (n.isComposite()) return this.scanTile(n, t);
			}
			let n = [t];
			for (let r = 0, i = t; r < e.children.length; r++) n.push(i += e.children[r].length);
			let r = this.scan(n, (t) => {
				let n = e.children[t];
				return n.flags & 48 ? null : (tm(n.dom) ? n.dom : Iu(n.dom, 0, n.length)).getClientRects();
			}), i = e.children[r.i], a = n[r.i];
			return i.isText() ? this.scanText(i, a) : i.isComposite() ? this.scanTile(i, a) : r.after ? new yh(n[r.i + 1], -1) : new yh(a, 1);
		}
	}, xh = "￿", Sh = class {
		constructor(e, t) {
			this.points = e, this.view = t, this.text = "", this.lineSeparator = t.state.facet(Il.lineSeparator);
		}
		append(e) {
			this.text += e;
		}
		lineBreak() {
			this.text += xh;
		}
		readRange(e, t) {
			if (!e) return this;
			let n = e.parentNode;
			for (let r = e;;) {
				this.findPointBefore(n, r);
				let e = this.text.length;
				this.readNode(r);
				let i = Xm.get(r), a = r.nextSibling;
				if (a == t) {
					i?.breakAfter && !a && n != this.view.contentDOM && this.lineBreak();
					break;
				}
				let o = Xm.get(a);
				(i && o ? i.breakAfter : (i ? i.breakAfter : Tu(r)) || Tu(a) && (r.nodeName != "BR" || i?.isWidget()) && this.text.length > e) && !Pd(a, t) && this.lineBreak(), r = a;
			}
			return this.findPointBefore(n, t), this;
		}
		readTextNode(e) {
			let t = e.nodeValue;
			for (let n of this.points) n.node == e && (n.pos = this.text.length + Math.min(n.offset, t.length));
			for (let n = 0, r = this.lineSeparator ? null : /\r\n?|\n/g;;) {
				let i = -1, a = 1, o;
				if (this.lineSeparator ? (i = t.indexOf(this.lineSeparator, n), a = this.lineSeparator.length) : (o = r.exec(t)) && (i = o.index, a = o[0].length), this.append(t.slice(n, i < 0 ? t.length : i)), i < 0) break;
				if (this.lineBreak(), a > 1) for (let t of this.points) t.node == e && t.pos > this.text.length && (t.pos -= a - 1);
				n = i + a;
			}
		}
		readNode(e) {
			let t = Xm.get(e), n = t && t.overrideDOMText;
			if (n != null) {
				this.findPointInside(e, n.length);
				for (let e = n.iter(); !e.next().done;) e.lineBreak ? this.lineBreak() : this.append(e.value);
			} else nm(e) ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : tm(e) && this.readRange(e.firstChild, null);
		}
		findPointBefore(e, t) {
			for (let n of this.points) n.node == e && e.childNodes[n.offset] == t && (n.pos = this.text.length);
		}
		findPointInside(e, t) {
			for (let n of this.points) (nm(e) ? n.node == e : e.contains(n.node)) && (n.pos = this.text.length + (Nd(e, n.node, n.offset) ? t : 0));
		}
	}, Ch = class {
		constructor(e, t) {
			this.node = e, this.offset = t, this.pos = -1;
		}
	}, wh = class {
		constructor(e, t, n, r) {
			this.typeOver = r, this.bounds = null, this.text = "", this.domChanged = t > -1;
			let { impreciseHead: i, impreciseAnchor: a } = e.docView, o = e.state.selection;
			if (e.state.readOnly && t > -1) this.newSel = null;
			else if (t > -1 && (this.bounds = Fd(e.docView.tile, t, n, 0))) {
				let t = i || a ? [] : Bd(e), n = new Sh(t, e);
				n.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = n.text, this.newSel = Vd(t, this.bounds.from);
			} else {
				let t = e.observer.selectionRange, n = i && i.node == t.focusNode && i.offset == t.focusOffset || !bu(e.contentDOM, t.focusNode) ? o.main.head : e.docView.posFromDOM(t.focusNode, t.focusOffset), r = a && a.node == t.anchorNode && a.offset == t.anchorOffset || !bu(e.contentDOM, t.anchorNode) ? o.main.anchor : e.docView.posFromDOM(t.anchorNode, t.anchorOffset), s = e.viewport;
				if ((J.ios || J.chrome) && n != r && Math.min(n, r) <= o.main.from && Math.max(n, r) >= o.main.to && (s.from > 0 || s.to < e.state.doc.length)) {
					let t = Math.min(n, r), i = Math.max(n, r), a = s.from - t, o = s.to - i;
					a != 0 && a != 1 && t != 0 || o != 0 && o != -1 && i != e.state.doc.length || (n = 0, r = e.state.doc.length);
				}
				if (e.inputState.composing > -1 && o.ranges.length > 1) this.newSel = o.replaceRange(K.range(r, n));
				else if (e.lineWrapping && r == n && !(o.main.empty && o.main.head == n) && e.inputState.lastTouchTime > Date.now() - 100) {
					let t = e.coordsAtPos(n, -1), r = 0;
					t && (r = e.inputState.lastTouchY <= t.bottom ? -1 : 1), this.newSel = K.create([K.cursor(n, r)]);
				} else this.newSel = K.single(r, n);
			}
		}
	}, Th = class {
		setSelectionOrigin(e) {
			this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
		}
		constructor(e) {
			this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.touchActive = !1, this.lastTouchTime = 0, this.lastTouchX = 0, this.lastTouchY = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.lastWheelEvent = 0, this.pendingIOSKey = void 0, this.lastIOSMomentumScroll = 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.insertingText = "", this.insertingTextAt = 0, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, J.safari && e.contentDOM.addEventListener("input", () => null), J.gecko && df(e.contentDOM.ownerDocument);
		}
		handleEvent(e) {
			Zd(this.view, e) && !this.ignoreDuringComposition(e) && (e.type == "keydown" && this.keydown(e) || (this.view.updateState == 0 ? this.runHandlers(e.type, e) : Promise.resolve().then(() => this.runHandlers(e.type, e))));
		}
		runHandlers(e, t) {
			let n = this.handlers[e];
			if (n) {
				for (let e of n.observers) e(this.view, t);
				for (let e of n.handlers) {
					if (t.defaultPrevented) break;
					if (e(this.view, t)) {
						t.preventDefault();
						break;
					}
				}
			}
		}
		ensureHandlers(e) {
			let t = Gd(e), n = this.handlers, r = this.view.contentDOM;
			for (let e in t) if (e != "scroll") {
				let i = !t[e].handlers.length, a = n[e];
				a && i != !a.handlers.length && (r.removeEventListener(e, this.handleEvent), a = null), a || r.addEventListener(e, this.handleEvent, { passive: i });
			}
			for (let e in n) e != "scroll" && !t[e] && r.removeEventListener(e, this.handleEvent);
			this.handlers = t;
		}
		keydown(e) {
			if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode)) return !0;
			if (this.tabFocusMode > 0 && e.keyCode != 27 && Oh.indexOf(e.keyCode) < 0 && (this.tabFocusMode = -1), J.android && J.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8)) return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
			if (J.ios && !e.synthetic && !e.altKey && !e.metaKey && (Eh.some((t) => t.keyCode == e.keyCode) && !e.ctrlKey || Dh.indexOf(e.key) > -1 && e.ctrlKey)) {
				let t = {
					ctrlKey: e.ctrlKey,
					altKey: e.altKey,
					metaKey: e.metaKey,
					shiftKey: e.shiftKey
				};
				t.shiftKey && J.ios && !/^(off|none)$/.test(this.view.contentDOM.autocapitalize) && Ud(this.view.win) && (t.shiftKey = !1);
				let n = this.pendingIOSKey = {
					key: e.key,
					keyCode: e.keyCode,
					mods: t
				};
				return setTimeout(() => {
					this.pendingIOSKey == n && this.flushIOSKey();
				}, 50), !0;
			}
			return e.keyCode != 229 && this.view.observer.forceFlush(), !1;
		}
		flushIOSKey(e) {
			let t = this.pendingIOSKey;
			return !t || this.view.observer.pendingRecords().length || t.key == "Enter" && e && e.from < e.to && /^\S+$/.test(e.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, Lu(this.view.contentDOM, t.key, t.keyCode, t.mods));
		}
		ignoreDuringComposition(e) {
			return !/^key/.test(e.type) || e.synthetic ? !1 : this.composing > 0 ? !0 : J.safari && !J.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1;
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
	}, Eh = [
		{
			key: "Backspace",
			keyCode: 8,
			inputType: "deleteContentBackward"
		},
		{
			key: "Enter",
			keyCode: 13,
			inputType: "insertParagraph"
		},
		{
			key: "Enter",
			keyCode: 13,
			inputType: "insertLineBreak"
		},
		{
			key: "Delete",
			keyCode: 46,
			inputType: "deleteContentForward"
		}
	], Dh = "dthko", Oh = [
		16,
		17,
		18,
		20,
		91,
		92,
		224,
		225
	], kh = 6, Ah = class {
		constructor(e, t, n, r) {
			this.view = e, this.startEvent = t, this.style = n, this.mustSelect = r, this.scrollSpeed = {
				x: 0,
				y: 0
			}, this.scrolling = -1, this.lastEvent = t, this.scrollParents = Mu(e.contentDOM), this.atoms = e.state.facet(Um).map((t) => t(e));
			let i = e.contentDOM.ownerDocument;
			i.addEventListener("mousemove", this.move = this.move.bind(this)), i.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(Il.allowMultipleSelections) && Jd(e, t), this.dragging = Xd(e, t) && nf(t) == 1 ? null : !1;
		}
		start(e) {
			this.dragging === !1 && this.select(e);
		}
		move(e) {
			if (e.buttons == 0) return this.destroy();
			if (this.dragging || this.dragging == null && qd(this.startEvent, e) < 10) return;
			this.select(this.lastEvent = e);
			let t = 0, n = 0, r = 0, i = 0, a = this.view.win.innerWidth, o = this.view.win.innerHeight;
			this.scrollParents.x && ({left: r, right: a} = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({top: i, bottom: o} = this.scrollParents.y.getBoundingClientRect());
			let s = id(this.view);
			e.clientX - s.left <= r + kh ? t = -Kd(r - e.clientX) : e.clientX + s.right >= a - kh && (t = Kd(e.clientX - a)), e.clientY - s.top <= i + kh ? n = -Kd(i - e.clientY) : e.clientY + s.bottom >= o - kh && (n = Kd(e.clientY - o)), this.setScrollSpeed(t, n);
		}
		up(e) {
			this.dragging ?? this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
		}
		destroy() {
			this.setScrollSpeed(0, 0);
			let e = this.view.contentDOM.ownerDocument;
			e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
		}
		setScrollSpeed(e, t) {
			this.scrollSpeed = {
				x: e,
				y: t
			}, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
		}
		scroll() {
			let { x: e, y: t } = this.scrollSpeed;
			e && this.scrollParents.x && (this.scrollParents.x.scrollLeft += e, e = 0), t && this.scrollParents.y && (this.scrollParents.y.scrollTop += t, t = 0), (e || t) && this.view.win.scrollBy(e, t), this.dragging === !1 && this.select(this.lastEvent);
		}
		select(e) {
			let { view: t } = this, n = Ad(this.atoms, this.style.get(e, this.extend, this.multiple));
			(this.mustSelect || !n.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
				selection: n,
				userEvent: "select.pointer"
			}), this.mustSelect = !1;
		}
		update(e) {
			e.transactions.some((e) => e.isUserEvent("input.type")) ? this.destroy() : this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
		}
	}, jh = /*@__PURE__*/ Object.create(null), Mh = /*@__PURE__*/ Object.create(null), Nh = J.ie && J.ie_version < 15 || J.ios && J.webkit_version < 604, Mh.scroll = (e) => {
		let t = e.inputState;
		t.lastScrollTop = e.scrollDOM.scrollTop, t.lastScrollLeft = e.scrollDOM.scrollLeft, J.ios && !t.touchActive && (t.lastIOSMomentumScroll = Date.now());
	}, Mh.wheel = Mh.mousewheel = (e) => {
		e.inputState.lastWheelEvent = Date.now();
	}, jh.keydown = (e, t) => (e.inputState.setSelectionOrigin("select"), t.keyCode == 27 && e.inputState.tabFocusMode != 0 && (e.inputState.tabFocusMode = Date.now() + 2e3), !1), Mh.touchstart = (e, t) => {
		let n = e.inputState, r = t.targetTouches[0];
		n.touchActive = !0, n.lastTouchTime = Date.now(), r && (n.lastTouchX = r.clientX, n.lastTouchY = r.clientY), n.setSelectionOrigin("select.pointer");
	}, Mh.touchmove = (e) => {
		e.inputState.setSelectionOrigin("select.pointer");
	}, Mh.touchend = (e, t) => {
		e.inputState.touchActive = !1;
	}, jh.mousedown = (e, t) => {
		if (e.observer.flush(), e.inputState.lastTouchTime > Date.now() - 2e3) return !1;
		let n = null;
		for (let r of e.state.facet(bm)) if (n = r(e, t), n) break;
		if (!n && t.button == 0 && (n = rf(e, t)), n) {
			let r = !e.hasFocus;
			e.inputState.startMouseSelection(new Ah(e, t, n, r)), r && e.observer.ignore(() => {
				Fu(e.contentDOM);
				let t = e.root.activeElement;
				t && !t.contains(e.contentDOM) && t.blur();
			});
			let i = e.inputState.mouseSelection;
			if (i) return i.start(t), i.dragging === !1;
		} else e.inputState.setSelectionOrigin("select.pointer");
		return !1;
	}, Ph = J.ie && J.ie_version <= 11, Fh = null, Ih = 0, Lh = 0, jh.dragstart = (e, t) => {
		let { selection: { main: n } } = e.state;
		if (t.target.draggable) {
			let r = e.docView.tile.nearest(t.target);
			if (r && r.isWidget()) {
				let e = r.posAtStart, t = e + r.length;
				(e >= n.to || t <= n.from) && (n = K.undirectionalRange(e, t));
			}
		}
		let { inputState: r } = e;
		return r.mouseSelection && (r.mouseSelection.dragging = !0), r.draggedContent = n, t.dataTransfer && (t.dataTransfer.setData("Text", $d(e.state, Em, e.state.sliceDoc(n.from, n.to))), t.dataTransfer.effectAllowed = "copyMove"), !1;
	}, jh.dragend = (e) => (e.inputState.draggedContent = null, !1), jh.drop = (e, t) => {
		if (!t.dataTransfer) return !1;
		if (e.state.readOnly) return !0;
		let n = t.dataTransfer.files;
		if (n && n.length) {
			let r = Array(n.length), i = 0, a = () => {
				++i == n.length && of(e, t, r.filter((e) => e != null).join(e.state.lineBreak), !1);
			};
			for (let e = 0; e < n.length; e++) {
				let t = new FileReader();
				t.onerror = a, t.onload = () => {
					/[\x00-\x08\x0e-\x1f]{2}/.test(t.result) || (r[e] = t.result), a();
				}, t.readAsText(n[e]);
			}
			return !0;
		}
		{
			let n = t.dataTransfer.getData("Text");
			if (n) return of(e, t, n, !0), !0;
		}
		return !1;
	}, jh.paste = (e, t) => {
		if (e.state.readOnly) return !0;
		e.observer.flush();
		let n = Nh ? null : t.clipboardData;
		return n ? (ef(e, n.getData("text/plain") || n.getData("text/uri-list")), !0) : (Qd(e), !1);
	}, Rh = null, jh.copy = jh.cut = (e, t) => {
		if (!xu(e.contentDOM, e.observer.selectionRange)) return !1;
		let { text: n, ranges: r, linewise: i } = cf(e.state);
		if (!n && !i) return !1;
		Rh = i ? n : null, t.type == "cut" && !e.state.readOnly && e.dispatch({
			changes: r,
			scrollIntoView: !0,
			userEvent: "delete.cut"
		});
		let a = Nh ? null : t.clipboardData;
		return a ? (a.clearData(), a.setData("text/plain", n), !0) : (sf(e, n), !1);
	}, zh = /*@__PURE__*/ Dl.define(), Mh.focus = (e) => {
		e.inputState.lastFocusTime = Date.now(), !e.scrollDOM.scrollTop && (e.inputState.lastScrollTop || e.inputState.lastScrollLeft) && (e.scrollDOM.scrollTop = e.inputState.lastScrollTop, e.scrollDOM.scrollLeft = e.inputState.lastScrollLeft), uf(e);
	}, Mh.blur = (e) => {
		e.observer.clearSelectionRange(), uf(e);
	}, Mh.compositionstart = Mh.compositionupdate = (e, t) => {
		if (!e.observer.editContext && (e.inputState.compositionFirstChange ?? (e.inputState.compositionFirstChange = !0), e.inputState.composing < 0)) {
			let { main: t } = e.state.selection;
			!t.empty && e.lineBlockAt(t.from).from != e.lineBlockAt(t.to).from && !e.state.readOnly && e.dispatch({
				changes: e.state.selection.ranges.filter((e) => !e.empty).map((e) => ({
					from: e.from,
					to: e.to
				})),
				userEvent: "input"
			}), e.inputState.composing = 0;
		}
	}, Mh.compositionend = (e) => {
		e.observer.editContext || (e.inputState.composing = -1, e.inputState.compositionEndedAt = Date.now(), e.inputState.compositionPendingKey = !0, e.inputState.compositionPendingChange = e.observer.pendingRecords().length > 0, e.inputState.compositionFirstChange = null, J.chrome && J.android ? e.observer.flushSoon() : e.inputState.compositionPendingChange ? Promise.resolve().then(() => e.observer.flush()) : setTimeout(() => {
			e.inputState.composing < 0 && e.docView.hasComposition && e.update([]);
		}, 50));
	}, Mh.contextmenu = (e) => {
		e.inputState.lastContextMenu = Date.now();
	}, jh.beforeinput = (e, t) => {
		if ((t.inputType == "insertText" || t.inputType == "insertCompositionText") && (e.inputState.insertingText = t.data, e.inputState.insertingTextAt = Date.now()), t.inputType == "insertReplacementText" && e.observer.editContext) {
			let n = t.dataTransfer?.getData("text/plain"), r = t.getTargetRanges();
			if (n && r.length) {
				let t = r[0];
				return Ld(e, {
					from: e.posAtDOM(t.startContainer, t.startOffset),
					to: e.posAtDOM(t.endContainer, t.endOffset),
					insert: e.state.toText(n)
				}, null), !0;
			}
		}
		let n;
		if (J.chrome && J.android && (n = Eh.find((e) => e.inputType == t.inputType)) && (e.observer.delayAndroidKey(n.key, n.keyCode), n.key == "Backspace" || n.key == "Delete")) {
			let t = window.visualViewport?.height || 0;
			setTimeout(() => {
				(window.visualViewport?.height || 0) > t + 10 && e.hasFocus && (e.contentDOM.blur(), e.focus());
			}, 100);
		}
		return J.ios && t.inputType == "deleteContentForward" && e.observer.flushSoon(), J.safari && t.inputType == "insertText" && e.inputState.composing >= 0 && setTimeout(() => Mh.compositionend(e, t), 20), !1;
	}, Bh = /*@__PURE__*/ new Set(), Vh = [
		"pre-wrap",
		"normal",
		"pre-line",
		"break-spaces"
	], Hh = !1, Uh = class {
		constructor(e) {
			this.lineWrapping = e, this.doc = Zc.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30;
		}
		heightForGap(e, t) {
			let n = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
			return this.lineWrapping && (n += Math.max(0, Math.ceil((t - e - n * this.lineLength * .5) / this.lineLength))), this.lineHeight * n;
		}
		heightForLine(e) {
			return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / Math.max(1, this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
		}
		setDoc(e) {
			return this.doc = e, this;
		}
		mustRefreshForWrapping(e) {
			return Vh.indexOf(e) > -1 != this.lineWrapping;
		}
		mustRefreshForHeights(e) {
			let t = !1;
			for (let n = 0; n < e.length; n++) {
				let r = e[n];
				r < 0 ? n++ : this.heightSamples[Math.floor(r * 10)] || (t = !0, this.heightSamples[Math.floor(r * 10)] = !0);
			}
			return t;
		}
		refresh(e, t, n, r, i, a) {
			let o = Vh.indexOf(e) > -1, s = Math.abs(t - this.lineHeight) > .3 || this.lineWrapping != o;
			if (this.lineWrapping = o, this.lineHeight = t, this.charWidth = n, this.textHeight = r, this.lineLength = i, s) {
				this.heightSamples = {};
				for (let e = 0; e < a.length; e++) {
					let t = a[e];
					t < 0 ? e++ : this.heightSamples[Math.floor(t * 10)] = !0;
				}
			}
			return s;
		}
	}, Wh = class {
		constructor(e, t) {
			this.from = e, this.heights = t, this.index = 0;
		}
		get more() {
			return this.index < this.heights.length;
		}
	}, Gh = class e {
		constructor(e, t, n, r, i) {
			this.from = e, this.length = t, this.top = n, this.height = r, this._content = i;
		}
		get type() {
			return typeof this._content == "number" ? Xp.Text : Array.isArray(this._content) ? this._content : this._content.type;
		}
		get to() {
			return this.from + this.length;
		}
		get bottom() {
			return this.top + this.height;
		}
		get widget() {
			return this._content instanceof $p ? this._content.widget : null;
		}
		get widgetLineBreaks() {
			return typeof this._content == "number" ? this._content : 0;
		}
		join(t) {
			let n = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(t._content) ? t._content : [t]);
			return new e(this.from, this.length + t.length, this.top, this.height + t.height, n);
		}
	}, Kh = /*@__PURE__*/ (function(e) {
		return e[e.ByPos = 0] = "ByPos", e[e.ByHeight = 1] = "ByHeight", e[e.ByPosNoHeight = 2] = "ByPosNoHeight", e;
	})(Kh ||= {}), qh = .001, Jh = class e {
		constructor(e, t, n = 2) {
			this.length = e, this.height = t, this.flags = n;
		}
		get outdated() {
			return (this.flags & 2) > 0;
		}
		set outdated(e) {
			this.flags = (e ? 2 : 0) | this.flags & -3;
		}
		setHeight(e) {
			this.height != e && (Math.abs(this.height - e) > qh && (Hh = !0), this.height = e);
		}
		replace(t, n, r) {
			return e.of(r);
		}
		decomposeLeft(e, t) {
			t.push(this);
		}
		decomposeRight(e, t) {
			t.push(this);
		}
		applyChanges(e, t, n, r) {
			let i = this, a = n.doc;
			for (let o = r.length - 1; o >= 0; o--) {
				let { fromA: s, toA: c, fromB: l, toB: u } = r[o], d = i.lineAt(s, Kh.ByPosNoHeight, n.setDoc(t), 0, 0), f = d.to >= c ? d : i.lineAt(c, Kh.ByPosNoHeight, n, 0, 0);
				for (u += f.to - c, c = f.to; o > 0 && d.from <= r[o - 1].toA;) s = r[o - 1].fromA, l = r[o - 1].fromB, o--, s < d.from && (d = i.lineAt(s, Kh.ByPosNoHeight, n, 0, 0));
				l += d.from - s, s = d.from;
				let p = tg.build(n.setDoc(a), e, l, u);
				i = pf(i, i.replace(s, c, p));
			}
			return i.updateHeight(n, 0);
		}
		static empty() {
			return new Zh(0, 0, 0);
		}
		static of(t) {
			if (t.length == 1) return t[0];
			let n = 0, r = t.length, i = 0, a = 0;
			for (;;) if (n == r) {
				if (i > a * 2) {
					let e = t[n - 1];
					e.break ? t.splice(--n, 1, e.left, null, e.right) : t.splice(--n, 1, e.left, e.right), r += 1 + e.break, i -= e.size;
				} else if (a > i * 2) {
					let e = t[r];
					e.break ? t.splice(r, 1, e.left, null, e.right) : t.splice(r, 1, e.left, e.right), r += 2 + e.break, a -= e.size;
				} else break;
			} else if (i < a) {
				let e = t[n++];
				e && (i += e.size);
			} else {
				let e = t[--r];
				e && (a += e.size);
			}
			let o = !1;
			return t[n - 1] == null ? (o = !0, n--) : t[n] ?? (o = !0, r++), new $h(e.of(t.slice(0, n)), o, e.of(t.slice(r)));
		}
	}, Jh.prototype.size = 1, Yh = /*@__PURE__*/ Y.replace({}), Xh = class extends Jh {
		constructor(e, t, n) {
			super(e, t), this.deco = n, this.spaceAbove = 0;
		}
		mainBlock(e, t) {
			return new Gh(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.deco || 0);
		}
		blockAt(e, t, n, r) {
			return this.spaceAbove && e < n + this.spaceAbove ? new Gh(r, 0, n, this.spaceAbove, Yh) : this.mainBlock(n, r);
		}
		lineAt(e, t, n, r, i) {
			let a = this.mainBlock(r, i);
			return this.spaceAbove ? this.blockAt(0, n, r, i).join(a) : a;
		}
		forEachLine(e, t, n, r, i, a) {
			e <= i + this.length && t >= i && a(this.lineAt(0, Kh.ByPos, n, r, i));
		}
		setMeasuredHeight(e) {
			let t = e.heights[e.index++];
			t < 0 ? (this.spaceAbove = -t, t = e.heights[e.index++]) : this.spaceAbove = 0, this.setHeight(t);
		}
		updateHeight(e, t = 0, n = !1, r) {
			return r && r.from <= t && r.more && this.setMeasuredHeight(r), this.outdated = !1, this;
		}
		toString() {
			return `block(${this.length})`;
		}
	}, Zh = class e extends Xh {
		constructor(e, t, n) {
			super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0, this.spaceAbove = n;
		}
		mainBlock(e, t) {
			return new Gh(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.breaks);
		}
		replace(t, n, r) {
			let i = r[0];
			return r.length == 1 && (i instanceof e || i instanceof Qh && i.flags & 4) && Math.abs(this.length - i.length) < 10 ? (i instanceof Qh ? i = new e(i.length, this.height, this.spaceAbove) : i.height = this.height, this.outdated || (i.outdated = !1), i) : Jh.of(r);
		}
		updateHeight(e, t = 0, n = !1, r) {
			return r && r.from <= t && r.more ? this.setMeasuredHeight(r) : (n || this.outdated) && (this.spaceAbove = 0, this.setHeight(Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight)), this.outdated = !1, this;
		}
		toString() {
			return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
		}
	}, Qh = class e extends Jh {
		constructor(e) {
			super(e, 0);
		}
		heightMetrics(e, t) {
			let n = e.doc.lineAt(t).number, r = e.doc.lineAt(t + this.length).number, i = r - n + 1, a, o = 0;
			if (e.lineWrapping) {
				let t = Math.min(this.height, e.lineHeight * i);
				a = t / i, this.length > i + 1 && (o = (this.height - t) / (this.length - i - 1));
			} else a = this.height / i;
			return {
				firstLine: n,
				lastLine: r,
				perLine: a,
				perChar: o
			};
		}
		blockAt(e, t, n, r) {
			let { firstLine: i, lastLine: a, perLine: o, perChar: s } = this.heightMetrics(t, r);
			if (t.lineWrapping) {
				let i = r + (e < t.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (e - n) / this.height)) * this.length)), a = t.doc.lineAt(i), c = o + a.length * s, l = Math.max(n, e - c / 2);
				return new Gh(a.from, a.length, l, c, 0);
			}
			{
				let r = Math.max(0, Math.min(a - i, Math.floor((e - n) / o))), { from: s, length: c } = t.doc.line(i + r);
				return new Gh(s, c, n + o * r, o, 0);
			}
		}
		lineAt(e, t, n, r, i) {
			if (t == Kh.ByHeight) return this.blockAt(e, n, r, i);
			if (t == Kh.ByPosNoHeight) {
				let { from: t, to: r } = n.doc.lineAt(e);
				return new Gh(t, r - t, 0, 0, 0);
			}
			let { firstLine: a, perLine: o, perChar: s } = this.heightMetrics(n, i), c = n.doc.lineAt(e), l = o + c.length * s, u = c.number - a, d = r + o * u + s * (c.from - i - u);
			return new Gh(c.from, c.length, Math.max(r, Math.min(d, r + this.height - l)), l, 0);
		}
		forEachLine(e, t, n, r, i, a) {
			e = Math.max(e, i), t = Math.min(t, i + this.length);
			let { firstLine: o, perLine: s, perChar: c } = this.heightMetrics(n, i);
			for (let l = e, u = r; l <= t;) {
				let t = n.doc.lineAt(l);
				if (l == e) {
					let n = t.number - o;
					u += s * n + c * (e - i - n);
				}
				let r = s + c * t.length;
				a(new Gh(t.from, t.length, u, r, 0)), u += r, l = t.to + 1;
			}
		}
		replace(t, n, r) {
			let i = this.length - n;
			if (i > 0) {
				let t = r[r.length - 1];
				t instanceof e ? r[r.length - 1] = new e(t.length + i) : r.push(null, new e(i - 1));
			}
			if (t > 0) {
				let n = r[0];
				n instanceof e ? r[0] = new e(t + n.length) : r.unshift(new e(t - 1), null);
			}
			return Jh.of(r);
		}
		decomposeLeft(t, n) {
			n.push(new e(t - 1), null);
		}
		decomposeRight(t, n) {
			n.push(null, new e(this.length - t - 1));
		}
		updateHeight(t, n = 0, r = !1, i) {
			let a = n + this.length;
			if (i && i.from <= n + this.length && i.more) {
				let r = [], o = Math.max(n, i.from), s = -1;
				for (i.from > n && r.push(new e(i.from - n - 1).updateHeight(t, n)); o <= a && i.more;) {
					let e = t.doc.lineAt(o).length;
					r.length && r.push(null);
					let n = i.heights[i.index++], a = 0;
					n < 0 && (a = -n, n = i.heights[i.index++]), s == -1 ? s = n : Math.abs(n - s) >= qh && (s = -2);
					let c = new Zh(e, n, a);
					c.outdated = !1, r.push(c), o += e + 1;
				}
				o <= a && r.push(null, new e(a - o).updateHeight(t, o));
				let c = Jh.of(r);
				return (s < 0 || Math.abs(c.height - this.height) >= qh || Math.abs(s - this.heightMetrics(t, n).perLine) >= qh) && (Hh = !0), pf(this, c);
			}
			return (r || this.outdated) && (this.setHeight(t.heightForGap(n, n + this.length)), this.outdated = !1), this;
		}
		toString() {
			return `gap(${this.length})`;
		}
	}, $h = class extends Jh {
		constructor(e, t, n) {
			super(e.length + +!!t + n.length, e.height + n.height, +!!t | (e.outdated || n.outdated ? 2 : 0)), this.left = e, this.right = n, this.size = e.size + n.size;
		}
		get break() {
			return this.flags & 1;
		}
		blockAt(e, t, n, r) {
			let i = n + this.left.height;
			return e < i ? this.left.blockAt(e, t, n, r) : this.right.blockAt(e, t, i, r + this.left.length + this.break);
		}
		lineAt(e, t, n, r, i) {
			let a = r + this.left.height, o = i + this.left.length + this.break, s = t == Kh.ByHeight ? e < a : e < o, c = s ? this.left.lineAt(e, t, n, r, i) : this.right.lineAt(e, t, n, a, o);
			if (this.break || (s ? c.to < o : c.from > o)) return c;
			let l = t == Kh.ByPosNoHeight ? Kh.ByPosNoHeight : Kh.ByPos;
			return s ? c.join(this.right.lineAt(o, l, n, a, o)) : this.left.lineAt(o, l, n, r, i).join(c);
		}
		forEachLine(e, t, n, r, i, a) {
			let o = r + this.left.height, s = i + this.left.length + this.break;
			if (this.break) e < s && this.left.forEachLine(e, t, n, r, i, a), t >= s && this.right.forEachLine(e, t, n, o, s, a);
			else {
				let c = this.lineAt(s, Kh.ByPos, n, r, i);
				e < c.from && this.left.forEachLine(e, Math.min(t, c.from - 1), n, r, i, a), c.to >= e && c.from <= t && a(c), t > c.to && this.right.forEachLine(Math.max(e, c.to + 1), t, n, o, s, a);
			}
		}
		replace(e, t, n) {
			let r = this.left.length + this.break;
			if (t < r) return this.balanced(this.left.replace(e, t, n), this.right);
			if (e > this.left.length) return this.balanced(this.left, this.right.replace(e - r, t - r, n));
			let i = [];
			e > 0 && this.decomposeLeft(e, i);
			let a = i.length;
			for (let e of n) i.push(e);
			if (e > 0 && mf(i, a - 1), t < this.length) {
				let e = i.length;
				this.decomposeRight(t, i), mf(i, e);
			}
			return Jh.of(i);
		}
		decomposeLeft(e, t) {
			let n = this.left.length;
			if (e <= n) return this.left.decomposeLeft(e, t);
			t.push(this.left), this.break && (n++, e >= n && t.push(null)), e > n && this.right.decomposeLeft(e - n, t);
		}
		decomposeRight(e, t) {
			let n = this.left.length, r = n + this.break;
			if (e >= r) return this.right.decomposeRight(e - r, t);
			e < n && this.left.decomposeRight(e, t), this.break && e < r && t.push(null), t.push(this.right);
		}
		balanced(e, t) {
			return e.size > 2 * t.size || t.size > 2 * e.size ? Jh.of(this.break ? [
				e,
				null,
				t
			] : [e, t]) : (this.left = pf(this.left, e), this.right = pf(this.right, t), this.setHeight(e.height + t.height), this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
		}
		updateHeight(e, t = 0, n = !1, r) {
			let { left: i, right: a } = this, o = t + i.length + this.break, s = null;
			return r && r.from <= t + i.length && r.more ? s = i = i.updateHeight(e, t, n, r) : i.updateHeight(e, t, n), r && r.from <= o + a.length && r.more ? s = a = a.updateHeight(e, o, n, r) : a.updateHeight(e, o, n), s ? this.balanced(i, a) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
		}
		toString() {
			return this.left + (this.break ? " " : "-") + this.right;
		}
	}, eg = 5, tg = class e {
		constructor(e, t) {
			this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
		}
		get isCovered() {
			return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
		}
		span(e, t) {
			if (this.lineStart > -1) {
				let e = Math.min(t, this.lineEnd), n = this.nodes[this.nodes.length - 1];
				n instanceof Zh ? n.length += e - this.pos : (e > this.pos || !this.isCovered) && this.nodes.push(new Zh(e - this.pos, -1, 0)), this.writtenTo = e, t > e && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
			}
			this.pos = t;
		}
		point(e, t, n) {
			if (e < t || n.heightRelevant) {
				let r = n.widget ? n.widget.estimatedHeight : 0, i = n.widget ? n.widget.lineBreaks : 0;
				r < 0 && (r = this.oracle.lineHeight);
				let a = t - e;
				n.block ? this.addBlock(new Xh(a, r, n)) : (a || i || r >= eg) && this.addLineDeco(r, i, a);
			} else t > e && this.span(e, t);
			this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
		}
		enterLine() {
			if (this.lineStart > -1) return;
			let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
			this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new Zh(this.pos - e, -1, 0)), this.writtenTo = this.pos;
		}
		blankContent(e, t) {
			let n = new Qh(t - e);
			return this.oracle.doc.lineAt(e).to == t && (n.flags |= 4), n;
		}
		ensureLine() {
			this.enterLine();
			let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
			if (e instanceof Zh) return e;
			let t = new Zh(0, -1, 0);
			return this.nodes.push(t), t;
		}
		addBlock(e) {
			this.enterLine();
			let t = e.deco;
			t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos += e.length, t && t.endSide > 0 && (this.covering = e);
		}
		addLineDeco(e, t, n) {
			let r = this.ensureLine();
			r.length += n, r.collapsed += n, r.widgetHeight = Math.max(r.widgetHeight, e), r.breaks += t, this.writtenTo = this.pos += n;
		}
		finish(e) {
			let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
			this.lineStart > -1 && !(t instanceof Zh) && !this.isCovered ? this.nodes.push(new Zh(0, -1, 0)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
			let n = e;
			for (let e of this.nodes) e instanceof Zh && e.updateHeight(this.oracle, n), n += e ? e.length : 1;
			return this.nodes;
		}
		static build(t, n, r, i) {
			let a = new e(r, t);
			return Bl.spans(n, r, i, a, 0), a.finish(r);
		}
	}, ng = class {
		constructor() {
			this.changes = [];
		}
		compareRange() {}
		comparePoint(e, t, n, r) {
			(e < t || n && n.heightRelevant || r && r.heightRelevant) && vu(e, t, this.changes, 5);
		}
	}, rg = class {
		constructor(e, t, n, r) {
			this.from = e, this.to = t, this.size = n, this.displaySize = r;
		}
		static same(e, t) {
			if (e.length != t.length) return !1;
			for (let n = 0; n < e.length; n++) {
				let r = e[n], i = t[n];
				if (r.from != i.from || r.to != i.to || r.size != i.size) return !1;
			}
			return !0;
		}
		draw(e, t) {
			return Y.replace({ widget: new ig(this.displaySize * (t ? e.scaleY : e.scaleX), t) }).range(this.from, this.to);
		}
	}, ig = class extends Yp {
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
	}, ag = class {
		constructor(e, t) {
			this.view = e, this.state = t, this.pixelViewport = {
				left: 0,
				right: window.innerWidth,
				top: 0,
				bottom: 0
			}, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scaleX = 1, this.scaleY = 1, this.scrollOffset = 0, this.scrolledToBottom = !1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = sg, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = sm.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
			let n = t.facet(zm).some((e) => typeof e != "function" && e.class == "cm-lineWrapping");
			this.heightOracle = new Uh(n), this.stateDeco = Cf(t), this.heightMap = Jh.empty().applyChanges(this.stateDeco, Zc.empty, this.heightOracle.setDoc(t.doc), [new qm(0, 0, 0, t.doc.length)]);
			for (let e = 0; e < 2 && (this.viewport = this.getViewport(0, null), this.updateForViewport()); e++);
			this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = Y.set(this.lineGaps.map((e) => e.draw(this, !1))), this.scrollParent = e.scrollDOM, this.computeVisibleRanges();
		}
		updateForViewport() {
			let e = [this.viewport], { main: t } = this.state.selection;
			for (let n = 0; n <= 1; n++) {
				let r = n ? t.head : t.anchor;
				if (!e.some(({ from: e, to: t }) => r >= e && r <= t)) {
					let { from: t, to: n } = this.lineBlockAt(r);
					e.push(new og(t, n));
				}
			}
			return this.viewports = e.sort((e, t) => e.from - t.from), this.updateScaler();
		}
		updateScaler() {
			let e = this.scaler;
			return this.scaler = this.heightMap.height <= 7e6 ? sg : cg.get(this.heightOracle, this.heightMap, this.viewports), e.eq(this.scaler) ? 0 : 2;
		}
		updateViewportLines() {
			this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
				this.viewportLines.push(wf(e, this.scaler));
			});
		}
		update(e, t = null) {
			this.state = e.state;
			let n = this.stateDeco;
			this.stateDeco = Cf(this.state);
			let r = e.changedRanges, i = qm.extendWithRanges(r, hf(n, this.stateDeco, e ? e.changes : sl.empty(this.state.doc.length))), a = this.heightMap.height, o = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollOffset);
			ff(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), i), (this.heightMap.height != a || Hh) && (e.flags |= 2), o ? (this.scrollAnchorPos = e.changes.mapPos(o.from, -1), this.scrollAnchorHeight = o.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = a);
			let s = i.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
			(t && (t.range.head < s.from || t.range.head > s.to) || !this.viewportIsAppropriate(s)) && (s = this.getViewport(0, t));
			let c = s.from != this.viewport.from || s.to != this.viewport.to;
			this.viewport = s, e.flags |= this.updateForViewport(), (c || !e.changes.empty || e.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(e.changes), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && (e.selectionSet || e.focusChanged) && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(Om) && (this.mustEnforceCursorAssoc = !0);
		}
		measure() {
			let { view: e } = this, t = e.contentDOM, n = window.getComputedStyle(t), r = this.heightOracle, i = n.whiteSpace;
			this.defaultTextDirection = n.direction == "rtl" ? sm.RTL : sm.LTR;
			let a = this.heightOracle.mustRefreshForWrapping(i) || this.mustMeasureContent === "refresh", o = t.getBoundingClientRect(), s = a || this.mustMeasureContent || this.contentDOMHeight != o.height;
			this.contentDOMHeight = o.height, this.mustMeasureContent = !1;
			let c = 0, l = 0;
			if (o.width && o.height) {
				let { scaleX: e, scaleY: n } = Au(t, o);
				(e > .005 && Math.abs(this.scaleX - e) > .005 || n > .005 && Math.abs(this.scaleY - n) > .005) && (this.scaleX = e, this.scaleY = n, c |= 16, a = s = !0);
			}
			let u = (parseInt(n.paddingTop) || 0) * this.scaleY, d = (parseInt(n.paddingBottom) || 0) * this.scaleY;
			(this.paddingTop != u || this.paddingBottom != d) && (this.paddingTop = u, this.paddingBottom = d, c |= 18), this.editorWidth != e.scrollDOM.clientWidth && (r.lineWrapping && (s = !0), this.editorWidth = e.scrollDOM.clientWidth, c |= 16);
			let f = Mu(this.view.contentDOM, !1).y;
			f != this.scrollParent && (this.scrollParent = f, this.scrollAnchorHeight = -1, this.scrollOffset = 0);
			let p = this.getScrollOffset();
			this.scrollOffset != p && (this.scrollAnchorHeight = -1, this.scrollOffset = p), this.scrolledToBottom = Bu(this.scrollParent || e.win);
			let m = (this.printing ? vf : gf)(t, this.paddingTop), h = m.top - this.pixelViewport.top, g = m.bottom - this.pixelViewport.bottom;
			this.pixelViewport = m;
			let _ = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
			if (_ != this.inView && (this.inView = _, _ && (s = !0)), !this.inView && !this.scrollTarget && !_f(e.dom)) return 0;
			let v = o.width;
			if ((this.contentDOMWidth != v || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = o.width, this.editorHeight = e.scrollDOM.clientHeight, c |= 16), s) {
				let t = e.docView.measureVisibleLineHeights(this.viewport);
				if (r.mustRefreshForHeights(t) && (a = !0), a || r.lineWrapping && Math.abs(v - this.contentDOMWidth) > r.charWidth) {
					let { lineHeight: n, charWidth: o, textHeight: s } = e.docView.measureTextSize();
					a = n > 0 && r.refresh(i, n, o, s, Math.max(5, v / o), t), a && (e.docView.minWidth = 0, c |= 16);
				}
				h > 0 && g > 0 ? l = Math.max(h, g) : h < 0 && g < 0 && (l = Math.min(h, g)), ff();
				for (let n of this.viewports) {
					let i = n.from == this.viewport.from ? t : e.docView.measureVisibleLineHeights(n);
					this.heightMap = (a ? Jh.empty().applyChanges(this.stateDeco, Zc.empty, this.heightOracle, [new qm(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(r, 0, a, new Wh(n.from, i));
				}
				Hh && (c |= 2);
			}
			let y = !this.viewportIsAppropriate(this.viewport, l) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
			return y && (c & 2 && (c |= this.updateScaler()), this.viewport = this.getViewport(l, this.scrollTarget), c |= this.updateForViewport()), (c & 2 || y) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(a ? [] : this.lineGaps, e)), c |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), c;
		}
		get visibleTop() {
			return this.scaler.fromDOM(this.pixelViewport.top);
		}
		get visibleBottom() {
			return this.scaler.fromDOM(this.pixelViewport.bottom);
		}
		getViewport(e, t) {
			let n = .5 - Math.max(-.5, Math.min(.5, e / 1e3 / 2)), r = this.heightMap, i = this.heightOracle, { visibleTop: a, visibleBottom: o } = this, s = new og(r.lineAt(a - n * 1e3, Kh.ByHeight, i, 0, 0).from, r.lineAt(o + (1 - n) * 1e3, Kh.ByHeight, i, 0, 0).to);
			if (t) {
				let { head: e } = t.range;
				if (e < s.from || e > s.to) {
					let n = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), a = r.lineAt(e, Kh.ByPos, i, 0, 0), o;
					o = t.y == "center" ? (a.top + a.bottom) / 2 - n / 2 : t.y == "start" || t.y == "nearest" && e < s.from ? a.top : a.bottom - n, s = new og(r.lineAt(o - 500, Kh.ByHeight, i, 0, 0).from, r.lineAt(o + n + 500, Kh.ByHeight, i, 0, 0).to);
				}
			}
			return s;
		}
		mapViewport(e, t) {
			let n = t.mapPos(e.from, -1), r = t.mapPos(e.to, 1);
			return new og(this.heightMap.lineAt(n, Kh.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(r, Kh.ByPos, this.heightOracle, 0, 0).to);
		}
		viewportIsAppropriate({ from: e, to: t }, n = 0) {
			if (!this.inView) return !0;
			let { top: r } = this.heightMap.lineAt(e, Kh.ByPos, this.heightOracle, 0, 0), { bottom: i } = this.heightMap.lineAt(t, Kh.ByPos, this.heightOracle, 0, 0), { visibleTop: a, visibleBottom: o } = this;
			return (e == 0 || r <= a - Math.max(10, Math.min(-n, 250))) && (t == this.state.doc.length || i >= o + Math.max(10, Math.min(n, 250))) && r > a - 2e3 && i < o + 2e3;
		}
		mapLineGaps(e, t) {
			if (!e.length || t.empty) return e;
			let n = [];
			for (let r of e) t.touchesRange(r.from, r.to) || n.push(new rg(t.mapPos(r.from), t.mapPos(r.to), r.size, r.displaySize));
			return n;
		}
		ensureLineGaps(e, t) {
			let n = this.heightOracle.lineWrapping, r = n ? 1e4 : 2e3, i = r >> 1, a = r << 1;
			if (this.defaultTextDirection != sm.LTR && !n) return [];
			let o = [], s = (r, a, c, l) => {
				if (a - r < i) return;
				let u = this.state.selection.main, d = [u.from];
				u.empty || d.push(u.to);
				for (let e of d) if (e > r && e < a) {
					s(r, e - 10, c, l), s(e + 10, a, c, l);
					return;
				}
				let f = Sf(e, (e) => e.from >= c.from && e.to <= c.to && Math.abs(e.from - r) < i && Math.abs(e.to - a) < i && !d.some((t) => e.from < t && e.to > t));
				if (!f) {
					if (a < c.to && t && n && t.visibleRanges.some((e) => e.from <= a && e.to >= a)) {
						let e = t.moveToLineBoundary(K.cursor(a), !1, !0).head;
						e > r && (a = e);
					}
					let e = this.gapSize(c, r, a, l);
					f = new rg(r, a, e, n || e < 2e6 ? e : 2e6);
				}
				o.push(f);
			}, c = (t) => {
				if (t.length < a || t.type != Xp.Text) return;
				let i = yf(t.from, t.to, this.stateDeco);
				if (i.total < a) return;
				let o = this.scrollTarget ? this.scrollTarget.range.head : null, c, l;
				if (n) {
					let e = r / this.heightOracle.lineLength * this.heightOracle.lineHeight, n, a;
					if (o != null) {
						let r = xf(i, o), s = ((this.visibleBottom - this.visibleTop) / 2 + e) / t.height;
						n = r - s, a = r + s;
					} else n = (this.visibleTop - t.top - e) / t.height, a = (this.visibleBottom - t.top + e) / t.height;
					c = bf(i, n), l = bf(i, a);
				} else {
					let n = i.total * this.heightOracle.charWidth, a = r * this.heightOracle.charWidth, s = 0;
					if (n > 2e6) for (let n of e) n.from >= t.from && n.from < t.to && n.size != n.displaySize && n.from * this.heightOracle.charWidth + s < this.pixelViewport.left && (s = n.size - n.displaySize);
					let u = this.pixelViewport.left + s, d = this.pixelViewport.right + s, f, p;
					if (o != null) {
						let e = xf(i, o), t = ((d - u) / 2 + a) / n;
						f = e - t, p = e + t;
					} else f = (u - a) / n, p = (d + a) / n;
					c = bf(i, f), l = bf(i, p);
				}
				c > t.from && s(t.from, c, t, i), l < t.to && s(l, t.to, t, i);
			};
			for (let e of this.viewportLines) Array.isArray(e.type) ? e.type.forEach(c) : c(e);
			return o;
		}
		gapSize(e, t, n, r) {
			let i = xf(r, n) - xf(r, t);
			return this.heightOracle.lineWrapping ? e.height * i : r.total * this.heightOracle.charWidth * i;
		}
		updateLineGaps(e) {
			rg.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = Y.set(e.map((e) => e.draw(this, this.heightOracle.lineWrapping))));
		}
		computeVisibleRanges(e) {
			let t = this.stateDeco;
			this.lineGaps.length && (t = t.concat(this.lineGapDeco));
			let n = [];
			Bl.spans(t, this.viewport.from, this.viewport.to, {
				span(e, t) {
					n.push({
						from: e,
						to: t
					});
				},
				point() {}
			}, 20);
			let r = 0;
			if (n.length != this.visibleRanges.length) r = 12;
			else for (let t = 0; t < n.length && !(r & 8); t++) {
				let i = this.visibleRanges[t], a = n[t];
				(i.from != a.from || i.to != a.to) && (r |= 4, e && e.mapPos(i.from, -1) == a.from && e.mapPos(i.to, 1) == a.to || (r |= 8));
			}
			return this.visibleRanges = n, r;
		}
		lineBlockAt(e) {
			return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || wf(this.heightMap.lineAt(e, Kh.ByPos, this.heightOracle, 0, 0), this.scaler);
		}
		lineBlockAtHeight(e) {
			return e >= this.viewportLines[0].top && e <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((t) => t.top <= e && t.bottom >= e) || wf(this.heightMap.lineAt(this.scaler.fromDOM(e), Kh.ByHeight, this.heightOracle, 0, 0), this.scaler);
		}
		getScrollOffset() {
			return this.scrollParent == this.view.scrollDOM ? this.scrollParent.scrollTop * this.scaleY : (this.scrollParent ? this.scrollParent.getBoundingClientRect().top : 0) - this.view.contentDOM.getBoundingClientRect().top;
		}
		scrollAnchorAt(e) {
			let t = this.lineBlockAtHeight(e + 12 - this.paddingTop);
			return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
		}
		elementAtHeight(e) {
			return wf(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
		}
		get docHeight() {
			return this.scaler.toDOM(this.heightMap.height);
		}
		get contentHeight() {
			return this.docHeight + this.paddingTop + this.paddingBottom;
		}
	}, og = class {
		constructor(e, t) {
			this.from = e, this.to = t;
		}
	}, sg = {
		toDOM(e) {
			return e;
		},
		fromDOM(e) {
			return e;
		},
		scale: 1,
		eq(e) {
			return e == this;
		}
	}, cg = class e {
		constructor(e, t) {
			this.scale = e, this.viewports = t;
		}
		static get(t, n, r) {
			let i = 0, a = 0, o = 0, s = r.map(({ from: e, to: r }) => {
				let a = n.lineAt(e, Kh.ByPos, t, 0, 0).top, o = n.lineAt(r, Kh.ByPos, t, 0, 0).bottom;
				return i += o - a, {
					from: e,
					to: r,
					top: a,
					bottom: o,
					domTop: 0,
					domBottom: 0
				};
			});
			if (n.height - i < 10) return sg;
			let c = (7e6 - i) / (n.height - i);
			for (let e of s) e.domTop = o + (e.top - a) * c, o = e.domBottom = e.domTop + (e.bottom - e.top), a = e.bottom;
			return new e(c, s);
		}
		toDOM(e) {
			for (let t = 0, n = 0, r = 0;; t++) {
				let i = t < this.viewports.length ? this.viewports[t] : null;
				if (!i || e < i.top) return r + (e - n) * this.scale;
				if (e <= i.bottom) return i.domTop + (e - i.top);
				n = i.bottom, r = i.domBottom;
			}
		}
		fromDOM(e) {
			for (let t = 0, n = 0, r = 0;; t++) {
				let i = t < this.viewports.length ? this.viewports[t] : null;
				if (!i || e < i.domTop) return n + (e - r) / this.scale;
				if (e <= i.domBottom) return i.top + (e - i.domTop);
				n = i.bottom, r = i.domBottom;
			}
		}
		eq(t) {
			return t instanceof e && this.scale == t.scale && this.viewports.length == t.viewports.length && this.viewports.every((e, n) => e.from == t.viewports[n].from && e.to == t.viewports[n].to);
		}
	}, lg = /*@__PURE__*/ q.define({ combine: (e) => e.join(" ") }), ug = /*@__PURE__*/ q.define({ combine: (e) => e.indexOf(!0) > -1 }), dg = /*@__PURE__*/ Xl.newName(), fg = /*@__PURE__*/ Xl.newName(), pg = /*@__PURE__*/ Xl.newName(), mg = {
		"&light": "." + fg,
		"&dark": "." + pg
	}, hg = /*@__PURE__*/ Tf("." + dg, {
		"&": {
			position: "relative !important",
			boxSizing: "border-box",
			"&.cm-focused": { outline: "1px dotted #212121" },
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
			boxSizing: "border-box",
			minHeight: "100%",
			padding: "4px 0",
			outline: "none",
			"&[contenteditable=true]": { WebkitUserModify: "read-write-plaintext-only" }
		},
		".cm-lineWrapping": {
			whiteSpace_fallback: "pre-wrap",
			whiteSpace: "break-spaces",
			wordBreak: "break-word",
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
			position: "absolute",
			left: 0,
			top: 0,
			contain: "size style",
			"& > *": { position: "absolute" }
		},
		"&light .cm-selectionBackground": { background: "#d9d9d9" },
		"&dark .cm-selectionBackground": { background: "#222" },
		"&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": { background: "#d7d4f0" },
		"&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": { background: "#233" },
		".cm-cursorLayer": { pointerEvents: "none" },
		"&.cm-focused > .cm-scroller > .cm-cursorLayer": { animation: "steps(1) cm-blink 1.2s infinite" },
		"@keyframes cm-blink": {
			"0%": {},
			"50%": { opacity: 0 },
			"100%": {}
		},
		"@keyframes cm-blink2": {
			"0%": {},
			"50%": { opacity: 0 },
			"100%": {}
		},
		".cm-cursor, .cm-dropCursor": {
			borderLeft: "1.2px solid black",
			marginLeft: "-0.6px",
			pointerEvents: "none"
		},
		".cm-cursor": { display: "none" },
		"&dark .cm-cursor": { borderLeftColor: "#ddd" },
		".cm-selectionHandle": {
			backgroundColor: "currentColor",
			width: "1.5px"
		},
		".cm-selectionHandle-start::before, .cm-selectionHandle-end::before": {
			content: "\"\"",
			backgroundColor: "inherit",
			borderRadius: "50%",
			width: "8px",
			height: "8px",
			position: "absolute",
			left: "-3.25px"
		},
		".cm-selectionHandle-start::before": { top: "-8px" },
		".cm-selectionHandle-end::before": { bottom: "-8px" },
		".cm-dropCursor": { position: "absolute" },
		"&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": { display: "block" },
		".cm-iso": { unicodeBidi: "isolate" },
		".cm-announced": {
			position: "fixed",
			top: "-10000px"
		},
		"@media print": { ".cm-announced": { display: "none" } },
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
			flexDirection: "column",
			flexShrink: 0,
			boxSizing: "border-box",
			minHeight: "100%",
			overflow: "hidden"
		},
		".cm-gutterElement": { boxSizing: "border-box" },
		".cm-lineNumbers .cm-gutterElement": {
			padding: "0 3px 0 5px",
			minWidth: "20px",
			textAlign: "right",
			whiteSpace: "nowrap"
		},
		"&light .cm-activeLineGutter": { backgroundColor: "#e2f2ff" },
		"&dark .cm-activeLineGutter": { backgroundColor: "#222227" },
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
		".cm-panels-top": { top: "0" },
		".cm-panels-bottom": { bottom: "0" },
		"&light .cm-panels-top": { borderBottom: "1px solid #ddd" },
		"&light .cm-panels-bottom": { borderTop: "1px solid #ddd" },
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
			verticalAlign: "baseline",
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
			background: "radial-gradient(circle at 50% 55%, #aaa 20%, transparent 0) no-repeat",
			backgroundSize: ".4em",
			backgroundPosition: "calc(min(50%, 0px)) center"
		},
		".cm-highlightTab": {
			backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"20\"><path stroke=\"%23888\" stroke-width=\"1\" fill=\"none\" d=\"M1 10H196L190 5M190 15L196 10M197 4L197 16\"/></svg>')",
			backgroundSize: "auto 100%",
			backgroundPosition: "right 90%",
			backgroundRepeat: "no-repeat"
		},
		".cm-trailingSpace": { backgroundColor: "#ff332255" },
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
			"&:active": { backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)" }
		},
		"&dark .cm-button": {
			backgroundImage: "linear-gradient(#393939, #111)",
			border: "1px solid #888",
			"&:active": { backgroundImage: "linear-gradient(#111, #333)" }
		},
		".cm-textfield": {
			verticalAlign: "middle",
			color: "inherit",
			fontSize: "70%",
			border: "1px solid silver",
			padding: ".2em .5em"
		},
		"&light .cm-textfield": { backgroundColor: "white" },
		"&dark .cm-textfield": {
			border: "1px solid #555",
			backgroundColor: "inherit"
		}
	}, mg), gg = {
		childList: !0,
		characterData: !0,
		subtree: !0,
		attributes: !0,
		characterDataOldValue: !0
	}, _g = J.ie && J.ie_version <= 11, vg = class {
		constructor(e) {
			this.view = e, this.active = !1, this.editContext = null, this.selectionRange = new rm(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
				for (let e of t) this.queue.push(e);
				(J.ie && J.ie_version <= 11 || J.ios && e.composing) && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : this.flush();
			}), window.EditContext && J.android && e.constructor.EDIT_CONTEXT !== !1 && !(J.chrome && J.chrome_version < 126) && (this.editContext = new yg(e), e.state.facet(Nm) && (e.contentDOM.editContext = this.editContext.editContext)), _g && (this.onCharData = (e) => {
				this.queue.push({
					target: e.target,
					type: "characterData",
					oldValue: e.prevValue
				}), this.flushSoon();
			}), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
				this.view.docView?.lastUpdate < Date.now() - 75 && this.onResize();
			}), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((e) => {
				this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), e.length > 0 && e[e.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
			}, { threshold: [0, .001] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((e) => {
				e.length > 0 && e[e.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
			}, {})), this.listenForScroll(), this.readSelectionRange();
		}
		onScrollChanged(e) {
			this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
		}
		onScroll(e) {
			this.intersecting && this.flush(this.pendingRecords().length > 0), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(e);
		}
		onResize() {
			this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
				this.resizeTimeout = -1, this.view.requestMeasure();
			}, 50));
		}
		onPrint(e) {
			(e.type != "change" && e.type || e.matches) && (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
				this.view.viewState.printing = !1, this.view.requestMeasure();
			}, 500));
		}
		updateGaps(e) {
			if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, n) => t != e[n]))) {
				this.gapIntersection.disconnect();
				for (let t of e) this.gapIntersection.observe(t);
				this.gaps = e;
			}
		}
		onSelectionChange(e) {
			let t = this.selectionChanged;
			if (!this.readSelectionRange() || this.delayedAndroidKey) return;
			let { view: n } = this, r = this.selectionRange;
			if (n.state.facet(Nm) ? n.root.activeElement != this.dom : !xu(this.dom, r)) return;
			let i = r.anchorNode && n.docView.tile.nearest(r.anchorNode);
			i && i.isWidget() && i.widget.ignoreEvent(e) ? t || (this.selectionChanged = !1) : (J.ie && J.ie_version <= 11 || J.android && J.chrome) && !n.state.selection.main.empty && r.focusNode && Cu(r.focusNode, r.focusOffset, r.anchorNode, r.anchorOffset) ? this.flushSoon() : this.flush(!1);
		}
		readSelectionRange() {
			let { view: e } = this, t = yu(e.root);
			if (!t) return !1;
			let n = J.safari && e.root.nodeType == 11 && e.root.activeElement == this.dom && Of(this.view, t) || t;
			if (!n || this.selectionRange.eq(n)) return !1;
			let r = xu(this.dom, n);
			return r && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && zu(this.dom, n) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(n), r && (this.selectionChanged = !0), !0);
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
			for (let n = this.dom; n;) if (tm(n)) !t && e < this.scrollTargets.length && this.scrollTargets[e] == n ? e++ : t ||= this.scrollTargets.slice(0, e), t && t.push(n), n = n.assignedSlot || n.parentNode;
			else if (n.nodeType == 11) n = n.host;
			else break;
			if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
				for (let e of this.scrollTargets) e.removeEventListener("scroll", this.onScroll);
				for (let e of this.scrollTargets = t) e.addEventListener("scroll", this.onScroll);
			}
		}
		ignore(e) {
			if (!this.active) return e();
			try {
				return this.stop(), e();
			} finally {
				this.start(), this.clear();
			}
		}
		start() {
			this.active ||= (this.observer.observe(this.dom, gg), _g && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), !0);
		}
		stop() {
			this.active && (this.active = !1, this.observer.disconnect(), _g && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
		}
		clear() {
			this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
		}
		delayAndroidKey(e, t) {
			if (!this.delayedAndroidKey) {
				let e = () => {
					let e = this.delayedAndroidKey;
					e && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = e.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && e.force && Lu(this.dom, e.key, e.keyCode));
				};
				this.flushingAndroidKey = this.view.win.requestAnimationFrame(e);
			}
			this.delayedAndroidKey && e != "Enter" || (this.delayedAndroidKey = {
				key: e,
				keyCode: t,
				force: this.lastChange < Date.now() - 50 || !!this.delayedAndroidKey?.force
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
			for (let e of this.observer.takeRecords()) this.queue.push(e);
			return this.queue;
		}
		processRecords() {
			let e = this.pendingRecords();
			e.length && (this.queue = []);
			let t = -1, n = -1, r = !1;
			for (let i of e) {
				let e = this.readMutation(i);
				e && (e.typeOver && (r = !0), t == -1 ? {from: t, to: n} = e : (t = Math.min(e.from, t), n = Math.max(e.to, n)));
			}
			return {
				from: t,
				to: n,
				typeOver: r
			};
		}
		readChange() {
			let { from: e, to: t, typeOver: n } = this.processRecords(), r = this.selectionChanged && xu(this.dom, this.selectionRange);
			if (e < 0 && !r) return null;
			e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
			let i = new wh(this.view, e, t, n);
			return this.view.docView.domChanged = { newSel: i.newSel ? i.newSel.main : null }, i;
		}
		flush(e = !0) {
			if (this.delayedFlush >= 0 || this.delayedAndroidKey) return !1;
			e && this.readSelectionRange();
			let t = this.selectionChanged, n = this.readChange();
			if (!n) return this.view.requestMeasure(), !1;
			let r = this.view.state, i = Id(this.view, n);
			return this.view.state == r && (n.domChanged || t) && this.view.update([]), i;
		}
		readMutation(e) {
			let t = this.view.docView.tile.nearest(e.target);
			if (!t || t.isWidget()) return null;
			if (t.markDirty(e.type == "attributes"), e.type == "childList") {
				let n = Ef(t, e.previousSibling || e.target.previousSibling, -1), r = Ef(t, e.nextSibling || e.target.nextSibling, 1);
				return {
					from: n ? t.posAfter(n) : t.posAtStart,
					to: r ? t.posBefore(r) : t.posAtEnd,
					typeOver: !1
				};
			}
			return e.type == "characterData" ? {
				from: t.posAtStart,
				to: t.posAtEnd,
				typeOver: e.target.nodeValue == e.oldValue
			} : null;
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
			this.editContext && (this.editContext.update(e), e.startState.facet(Nm) != e.state.facet(Nm) && (e.view.contentDOM.editContext = e.state.facet(Nm) ? this.editContext.editContext : null));
		}
		destroy() {
			var e, t, n;
			this.stop(), (e = this.intersection) == null || e.disconnect(), (t = this.gapIntersection) == null || t.disconnect(), (n = this.resizeScroll) == null || n.disconnect();
			for (let e of this.scrollTargets) e.removeEventListener("scroll", this.onScroll);
			this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy());
		}
	}, yg = class {
		constructor(e) {
			this.from = 0, this.to = 0, this.pendingContextChange = null, this.handlers = Object.create(null), this.composing = null, this.resetRange(e.state);
			let t = this.editContext = new window.EditContext({
				text: e.state.doc.sliceString(this.from, this.to),
				selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, e.state.selection.main.anchor))),
				selectionEnd: this.toContextPos(e.state.selection.main.head)
			});
			this.handlers.textupdate = (n) => {
				let r = e.state.selection.main, { anchor: i, head: a } = r, o = this.toEditorPos(n.updateRangeStart), s = this.toEditorPos(n.updateRangeEnd);
				e.inputState.composing >= 0 && !this.composing && (this.composing = {
					contextBase: n.updateRangeStart,
					editorBase: o,
					drifted: !1
				});
				let c = s - o > n.text.length;
				o == this.from && i < this.from ? o = i : s == this.to && i > this.to && (s = i);
				let l = zd(e.state.sliceDoc(o, s), n.text, (c ? r.from : r.to) - o, c ? "end" : null);
				if (!l) {
					let t = K.single(this.toEditorPos(n.selectionStart), this.toEditorPos(n.selectionEnd));
					Hd(t, r) || e.dispatch({
						selection: t,
						userEvent: "select"
					});
					return;
				}
				let u = {
					from: l.from + o,
					to: l.toA + o,
					insert: Zc.of(n.text.slice(l.from, l.toB).split("\n"))
				};
				if ((J.mac || J.android) && u.from == a - 1 && /^\. ?$/.test(n.text) && e.contentDOM.getAttribute("autocorrect") == "off" && (u = {
					from: o,
					to: s,
					insert: Zc.of([n.text.replace(".", " ")])
				}), this.pendingContextChange = u, !e.state.readOnly) {
					let t = this.to - this.from + (u.to - u.from + u.insert.length);
					Ld(e, u, K.single(this.toEditorPos(n.selectionStart, t), this.toEditorPos(n.selectionEnd, t)));
				}
				this.pendingContextChange && (this.revertPending(e.state), this.setSelection(e.state)), u.from < u.to && !u.insert.length && e.inputState.composing >= 0 && !/[\\p{Alphabetic}\\p{Number}_]/.test(t.text.slice(Math.max(0, n.updateRangeStart - 1), Math.min(t.text.length, n.updateRangeStart + 1))) && this.handlers.compositionend(n);
			}, this.handlers.characterboundsupdate = (n) => {
				let r = [], i = null;
				for (let t = this.toEditorPos(n.rangeStart), a = this.toEditorPos(n.rangeEnd); t < a; t++) {
					let n = e.coordsForChar(t);
					i = n && new DOMRect(n.left, n.top, n.right - n.left, n.bottom - n.top) || i || new DOMRect(), r.push(i);
				}
				t.updateCharacterBounds(n.rangeStart, r);
			}, this.handlers.textformatupdate = (t) => {
				let n = [];
				for (let e of t.getTextFormats()) {
					let t = e.underlineStyle, r = e.underlineThickness;
					if (!/none/i.test(t) && !/none/i.test(r)) {
						let i = this.toEditorPos(e.rangeStart), a = this.toEditorPos(e.rangeEnd);
						if (i < a) {
							let e = `text-decoration: underline ${/^[a-z]/.test(t) ? t + " " : t == "Dashed" ? "dashed " : t == "Squiggle" ? "wavy " : ""}${/thin/i.test(r) ? 1 : 2}px`;
							n.push(Y.mark({ attributes: { style: e } }).range(i, a));
						}
					}
				}
				e.dispatch({ effects: Mm.of(Y.set(n)) });
			}, this.handlers.compositionstart = () => {
				e.inputState.composing < 0 && (e.inputState.composing = 0, e.inputState.compositionFirstChange = !0);
			}, this.handlers.compositionend = () => {
				if (e.inputState.composing = -1, e.inputState.compositionFirstChange = null, this.composing) {
					let { drifted: t } = this.composing;
					this.composing = null, t && this.reset(e.state);
				}
			};
			for (let e in this.handlers) t.addEventListener(e, this.handlers[e]);
			this.measureReq = { read: (e) => {
				let t = yu(e.root);
				t && t.rangeCount && this.editContext.updateSelectionBounds(t.getRangeAt(0).getBoundingClientRect());
			} };
		}
		applyEdits(e) {
			let t = 0, n = !1, r = this.pendingContextChange;
			return e.changes.iterChanges((i, a, o, s, c) => {
				if (n) return;
				let l = c.length - (a - i);
				if (r && a >= r.to) {
					if (r.from == i && r.to == a && r.insert.eq(c)) {
						r = this.pendingContextChange = null, t += l, this.to += l;
						return;
					}
					r = null, this.revertPending(e.state);
				}
				if (i += t, a += t, a <= this.from) this.from += l, this.to += l;
				else if (i < this.to) {
					if (i < this.from || a > this.to || this.to - this.from + c.length > 3e4) {
						n = !0;
						return;
					}
					this.editContext.updateText(this.toContextPos(i), this.toContextPos(a), c.toString()), this.to += l;
				}
				t += l;
			}), r && !n && this.revertPending(e.state), !n;
		}
		update(e) {
			let t = this.pendingContextChange, n = e.startState.selection.main;
			this.composing && (this.composing.drifted || !e.changes.touchesRange(n.from, n.to) && e.transactions.some((e) => !e.isUserEvent("input.type") && e.changes.touchesRange(this.from, this.to))) ? (this.composing.drifted = !0, this.composing.editorBase = e.changes.mapPos(this.composing.editorBase)) : !this.applyEdits(e) || !this.rangeIsValid(e.state) ? (this.pendingContextChange = null, this.reset(e.state)) : (e.docChanged || e.selectionSet || t) && this.setSelection(e.state), (e.geometryChanged || e.docChanged || e.selectionSet) && e.view.requestMeasure(this.measureReq);
		}
		resetRange(e) {
			let { head: t } = e.selection.main;
			this.from = Math.max(0, t - 1e4), this.to = Math.min(e.doc.length, t + 1e4);
		}
		reset(e) {
			this.resetRange(e), this.editContext.updateText(0, this.editContext.text.length, e.doc.sliceString(this.from, this.to)), this.setSelection(e);
		}
		revertPending(e) {
			let t = this.pendingContextChange;
			this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(t.from), this.toContextPos(t.from + t.insert.length), e.doc.sliceString(t.from, t.to));
		}
		setSelection(e) {
			let { main: t } = e.selection, n = this.toContextPos(Math.max(this.from, Math.min(this.to, t.anchor))), r = this.toContextPos(t.head);
			(this.editContext.selectionStart != n || this.editContext.selectionEnd != r) && this.editContext.updateSelection(n, r);
		}
		rangeIsValid(e) {
			let { head: t } = e.selection.main;
			return !(this.from > 0 && t - this.from < 500 || this.to < e.doc.length && this.to - t < 500 || this.to - this.from > 3e4);
		}
		toEditorPos(e, t = this.to - this.from) {
			e = Math.min(e, t);
			let n = this.composing;
			return n && n.drifted ? n.editorBase + (e - n.contextBase) : e + this.from;
		}
		toContextPos(e) {
			let t = this.composing;
			return t && t.drifted ? t.contextBase + (e - t.editorBase) : e - this.from;
		}
		destroy() {
			for (let e in this.handlers) this.editContext.removeEventListener(e, this.handlers[e]);
		}
	}, X = class e {
		get state() {
			return this.viewState.state;
		}
		get viewport() {
			return this.viewState.viewport;
		}
		get visibleRanges() {
			return this.viewState.visibleRanges;
		}
		get inView() {
			return this.viewState.inView;
		}
		get composing() {
			return !!this.inputState && this.inputState.composing > 0;
		}
		get compositionStarted() {
			return !!this.inputState && this.inputState.composing >= 0;
		}
		get root() {
			return this._root;
		}
		get win() {
			return this.dom.ownerDocument.defaultView || window;
		}
		constructor(e = {}) {
			this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.clearAnnouncement = -1, this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
			let { dispatch: t } = e;
			this.dispatchTransactions = e.dispatchTransactions || t && ((e) => e.forEach((e) => t(e, this))) || ((e) => this.update(e)), this.dispatch = this.dispatch.bind(this), this._root = e.root || Ru(e.parent) || document, this.viewState = new ag(this, e.state || Il.create(e)), e.scrollTo && e.scrollTo.is(jm) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(Fm).map((e) => new Lm(e));
			for (let e of this.plugins) e.update(this);
			this.observer = new vg(this), this.inputState = new Th(this), this.inputState.ensureHandlers(this.plugins), this.docView = new hh(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), document.fonts?.ready && document.fonts.ready.then(() => {
				this.viewState.mustMeasureContent = "refresh", this.requestMeasure();
			});
		}
		dispatch(...e) {
			let t = e.length == 1 && e[0] instanceof jl ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
			this.dispatchTransactions(t, this);
		}
		update(t) {
			if (this.updateState != 0) throw Error("Calls to EditorView.update are not allowed while an update is in progress");
			let n = !1, r = !1, i, a = this.state;
			for (let e of t) {
				if (e.startState != a) throw RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
				a = e.state;
			}
			if (this.destroyed) {
				this.viewState.state = a;
				return;
			}
			let o = this.hasFocus, s = 0, c = null;
			t.some((e) => e.annotation(zh)) ? (this.inputState.notifiedFocused = o, s = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, c = lf(a, o), c || (s = 1));
			let l = this.observer.delayedAndroidKey, u = null;
			if (l ? (this.observer.clearDelayedAndroidKey(), u = this.observer.readChange(), (u && !this.state.doc.eq(a.doc) || !this.state.selection.eq(a.selection)) && (u = null)) : this.observer.clear(), a.facet(Il.phrases) != this.state.facet(Il.phrases)) return this.setState(a);
			i = Jm.create(this, a, t), i.flags |= s;
			let d = this.viewState.scrollTarget;
			try {
				this.updateState = 2;
				for (let n of t) {
					if (d &&= d.map(n.changes), n.scrollIntoView) {
						let { main: t } = n.state.selection, { x: r, y: i } = this.state.facet(e.cursorScrollMargin);
						d = new Am(t.empty ? t : K.cursor(t.head, t.head > t.anchor ? -1 : 1), "nearest", "nearest", i, r);
					}
					for (let e of n.effects) e.is(jm) && (d = e.value.clip(this.state));
				}
				this.viewState.update(i, d), this.bidiCache = Sg.update(this.bidiCache, i.changes), i.empty || (this.updatePlugins(i), this.inputState.update(i)), n = this.docView.update(i), this.state.facet(Km) != this.styleModules && this.mountStyles(), r = this.updateAttrs(), this.showAnnouncements(t), this.docView.updateSelection(n, t.some((e) => e.isUserEvent("select.pointer")));
			} finally {
				this.updateState = 0;
			}
			if (i.startState.facet(lg) != i.state.facet(lg) && (this.viewState.mustMeasureContent = !0), (n || r || d || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), n && this.docViewUpdate(), !i.empty) for (let e of this.state.facet(Sm)) try {
				e(i);
			} catch (e) {
				td(this.state, e, "update listener");
			}
			(c || u) && Promise.resolve().then(() => {
				c && this.state == c.startState && this.dispatch(c), u && !Id(this, u) && l.force && Lu(this.contentDOM, l.key, l.keyCode);
			});
		}
		setState(e) {
			if (this.updateState != 0) throw Error("Calls to EditorView.setState are not allowed while an update is in progress");
			if (this.destroyed) {
				this.viewState.state = e;
				return;
			}
			this.updateState = 2;
			let t = this.hasFocus;
			try {
				for (let e of this.plugins) e.destroy(this);
				this.viewState = new ag(this, e), this.plugins = e.facet(Fm).map((e) => new Lm(e)), this.pluginMap.clear();
				for (let e of this.plugins) e.update(this);
				this.docView.destroy(), this.docView = new hh(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
			} finally {
				this.updateState = 0;
			}
			t && this.focus(), this.requestMeasure();
		}
		updatePlugins(e) {
			let t = e.startState.facet(Fm), n = e.state.facet(Fm);
			if (t != n) {
				let r = [];
				for (let i of n) {
					let n = t.indexOf(i);
					if (n < 0) r.push(new Lm(i));
					else {
						let t = this.plugins[n];
						t.mustUpdate = e, r.push(t);
					}
				}
				for (let t of this.plugins) t.mustUpdate != e && t.destroy(this);
				this.plugins = r, this.pluginMap.clear();
			} else for (let t of this.plugins) t.mustUpdate = e;
			for (let e = 0; e < this.plugins.length; e++) this.plugins[e].update(this);
			t != n && this.inputState.ensureHandlers(this.plugins);
		}
		docViewUpdate() {
			for (let e of this.plugins) {
				let t = e.value;
				if (t && t.docViewUpdate) try {
					t.docViewUpdate(this);
				} catch (e) {
					td(this.state, e, "doc view update listener");
				}
			}
		}
		measure(e = !0) {
			if (this.destroyed) return;
			if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
				this.measureScheduled = -1, this.requestMeasure();
				return;
			}
			this.measureScheduled = 0, e && this.observer.forceFlush();
			let t = null, n = this.viewState.scrollParent, r = this.viewState.getScrollOffset(), { scrollAnchorPos: i, scrollAnchorHeight: a, scaleY: o } = this.viewState;
			Math.abs(r - this.viewState.scrollOffset) > 1 && (a = -1), this.viewState.scrollAnchorHeight = -1;
			try {
				for (let e = 0;; e++) {
					if (a < 0) {
						if (Bu(n || this.win)) i = -1, a = this.viewState.heightMap.height / this.viewState.scaleY;
						else {
							let e = this.viewState.scrollAnchorAt(r);
							i = e.from, a = e.top;
						}
						o = this.viewState.scaleY;
					}
					this.updateState = 1;
					let s = this.viewState.measure();
					if (!s && !this.measureRequests.length && this.viewState.scrollTarget == null) break;
					if (e > 5) {
						console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
						break;
					}
					let c = [];
					s & 4 || ([this.measureRequests, c] = [c, this.measureRequests]);
					let l = c.map((e) => {
						try {
							return e.read(this);
						} catch (e) {
							return td(this.state, e), xg;
						}
					}), u = Jm.create(this, this.state, []), d = !1;
					u.flags |= s, t ? t.flags |= s : t = u, this.updateState = 2, u.empty || (this.updatePlugins(u), this.inputState.update(u), this.updateAttrs(), d = this.docView.update(u), d && this.docViewUpdate());
					for (let e = 0; e < c.length; e++) if (l[e] != xg) try {
						let t = c[e];
						t.write && t.write(l[e], this);
					} catch (e) {
						td(this.state, e);
					}
					if (d && this.docView.updateSelection(!0), !u.viewportChanged && this.measureRequests.length == 0) {
						if (this.viewState.editorHeight) {
							if (this.viewState.scrollTarget) {
								this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, a = -1;
								continue;
							}
							{
								let e = (i < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(i).top) / this.viewState.scaleY - a / o;
								if ((e > 1 || e < -1) && !(J.ios && this.inputState.lastIOSMomentumScroll > Date.now() - 100) && (n == this.scrollDOM || this.hasFocus || Math.max(this.inputState.lastWheelEvent, this.inputState.lastTouchTime) > Date.now() - 100)) {
									r += e, n ? i < 0 ? n.scrollTop = n.scrollHeight : n.scrollTop += e : this.win.scrollBy(0, e), a = -1;
									continue;
								}
							}
						}
						break;
					}
				}
			} finally {
				this.updateState = 0, this.measureScheduled = -1;
			}
			if (t && !t.empty) for (let e of this.state.facet(Sm)) e(t);
		}
		get themeClasses() {
			return dg + " " + (this.state.facet(ug) ? pg : fg) + " " + this.state.facet(lg);
		}
		updateAttrs() {
			let e = kf(this, Rm, { class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses }), t = {
				spellcheck: "false",
				autocorrect: "off",
				autocapitalize: "off",
				writingsuggestions: "false",
				translate: "no",
				contenteditable: this.state.facet(Nm) ? "true" : "false",
				class: "cm-content",
				style: `${J.tabSize}: ${this.state.tabSize}`,
				role: "textbox",
				"aria-multiline": "true"
			};
			this.state.readOnly && (t["aria-readonly"] = "true"), kf(this, zm, t);
			let n = this.observer.ignore(() => {
				let n = mu(this.contentDOM, this.contentAttrs, t), r = mu(this.dom, this.editorAttrs, e);
				return n || r;
			});
			return this.editorAttrs = e, this.contentAttrs = t, n;
		}
		showAnnouncements(t) {
			let n = !0;
			for (let r of t) for (let t of r.effects) if (t.is(e.announce)) {
				n &&= (this.announceDOM.textContent = "", this.win.clearTimeout(this.clearAnnouncement), this.clearAnnouncement = this.win.setTimeout(() => {
					this.announceDOM.textContent = "\xA0";
				}, 200), !1);
				let e = this.announceDOM.appendChild(document.createElement("div"));
				e.textContent = t.value;
			}
		}
		mountStyles() {
			this.styleModules = this.state.facet(Km);
			let t = this.state.facet(e.cspNonce);
			Xl.mount(this.root, this.styleModules.concat(hg).reverse(), t ? { nonce: t } : void 0);
		}
		readMeasured() {
			if (this.updateState == 2) throw Error("Reading the editor layout isn't allowed during an update");
			this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
		}
		requestMeasure(e) {
			if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
				if (this.measureRequests.indexOf(e) > -1) return;
				if (e.key != null) {
					for (let t = 0; t < this.measureRequests.length; t++) if (this.measureRequests[t].key === e.key) {
						this.measureRequests[t] = e;
						return;
					}
				}
				this.measureRequests.push(e);
			}
		}
		plugin(e) {
			let t = this.pluginMap.get(e);
			return (t === void 0 || t && t.plugin != e) && this.pluginMap.set(e, t = this.plugins.find((t) => t.plugin == e) || null), t && t.update(this).value;
		}
		get documentTop() {
			return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
		}
		get documentPadding() {
			return {
				top: this.viewState.paddingTop,
				bottom: this.viewState.paddingBottom
			};
		}
		get scaleX() {
			return this.viewState.scaleX;
		}
		get scaleY() {
			return this.viewState.scaleY;
		}
		elementAtHeight(e) {
			return this.readMeasured(), this.viewState.elementAtHeight(e);
		}
		lineBlockAtHeight(e) {
			return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
		}
		get viewportLineBlocks() {
			return this.viewState.viewportLines;
		}
		lineBlockAt(e) {
			return this.viewState.lineBlockAt(e);
		}
		get contentHeight() {
			return this.viewState.contentHeight;
		}
		moveByChar(e, t, n) {
			return jd(this, e, Ed(this, e, t, n));
		}
		moveByGroup(e, t) {
			return jd(this, e, Ed(this, e, t, (t) => Dd(this, e.head, t)));
		}
		visualLineSide(e, t) {
			return t ? K.cursor(e.to, 1) : K.cursor(e.from, -1);
		}
		moveToLineBoundary(e, t, n = !0) {
			return Td(this, e, t, n);
		}
		moveVertically(e, t, n) {
			return jd(this, e, Od(this, e, t, n));
		}
		domAtPos(e, t = 1) {
			return this.docView.domAtPos(e, t);
		}
		posAtDOM(e, t = 0) {
			return this.docView.posFromDOM(e, t);
		}
		posAtCoords(e, t = !0) {
			this.readMeasured();
			let n = Md(this, e, t);
			return n && n.pos;
		}
		posAndSideAtCoords(e, t = !0) {
			return this.readMeasured(), Md(this, e, t);
		}
		coordsAtPos(e, t = 1) {
			this.readMeasured();
			let n = this.state.doc.lineAt(e), r = this.bidiSpans(n), i = r[hm.find(r, e - n.from, -1, t)];
			return n.length && (e == n.from && t < 0 || e == n.to && t > 0) && i.dir != this.textDirectionAt(n.from) && (e == n.to ? (e = n.from + i.from, t = 1) : (e = n.from + i.to, t = -1)), this.docView.coordsAt(e, t, i.dir == sm.RTL);
		}
		coordsForChar(e) {
			return this.readMeasured(), this.docView.coordsForChar(e);
		}
		get defaultCharacterWidth() {
			return this.viewState.heightOracle.charWidth;
		}
		get defaultLineHeight() {
			return this.viewState.heightOracle.lineHeight;
		}
		get textDirection() {
			return this.viewState.defaultTextDirection;
		}
		textDirectionAt(e) {
			return !this.state.facet(Dm) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
		}
		get lineWrapping() {
			return this.viewState.heightOracle.lineWrapping;
		}
		bidiSpans(e) {
			if (e.length > bg) return Qu(e.length);
			let t = this.textDirectionAt(e.from), n;
			for (let r of this.bidiCache) if (r.from == e.from && r.dir == t && (r.fresh || Gu(r.isolates, n = nd(this, e)))) return r.order;
			n ||= nd(this, e);
			let r = Zu(e.text, t, n);
			return this.bidiCache.push(new Sg(e.from, e.to, t, n, !0, r)), r;
		}
		get hasFocus() {
			return (this.dom.ownerDocument.hasFocus() || J.safari && this.inputState?.lastContextMenu > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
		}
		focus() {
			this.observer.ignore(() => {
				Fu(this.contentDOM), this.docView.updateSelection();
			});
		}
		setRoot(e) {
			this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
		}
		destroy() {
			this.root.activeElement == this.contentDOM && this.contentDOM.blur();
			for (let e of this.plugins) e.destroy(this);
			this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.win.clearTimeout(this.clearAnnouncement), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
		}
		static scrollIntoView(e, t = {}) {
			return jm.of(new Am(typeof e == "number" ? K.cursor(e) : e, t.y ?? "nearest", t.x ?? "nearest", t.yMargin ?? 5, t.xMargin ?? 5));
		}
		scrollSnapshot() {
			let { scrollTop: e, scrollLeft: t } = this.scrollDOM, n = this.viewState.scrollAnchorAt(e);
			return jm.of(new Am(K.cursor(n.from), "start", "start", n.top - e, t, !0));
		}
		setTabFocusMode(e) {
			e == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof e == "boolean" ? this.inputState.tabFocusMode = e ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + e);
		}
		static domEventHandlers(e) {
			return Im.define(() => ({}), { eventHandlers: e });
		}
		static domEventObservers(e) {
			return Im.define(() => ({}), { eventObservers: e });
		}
		static theme(e, t) {
			let n = Xl.newName(), r = [lg.of(n), Km.of(Tf(`.${n}`, e))];
			return t && t.dark && r.push(ug.of(!0)), r;
		}
		static baseTheme(e) {
			return hl.lowest(Km.of(Tf("." + dg, e, mg)));
		}
		static findFromDOM(e) {
			let t = e.querySelector(".cm-content");
			return (t && Xm.get(t) || Xm.get(e))?.root?.view || null;
		}
	}, X.styleModule = Km, X.inputHandler = Cm, X.clipboardInputFilter = Tm, X.clipboardOutputFilter = Em, X.scrollHandler = km, X.focusChangeEffect = wm, X.perLineTextDirection = Dm, X.exceptionSink = xm, X.updateListener = Sm, X.editable = Nm, X.mouseSelectionStyle = bm, X.dragMovesSelection = ym, X.clickAddsSelectionRange = vm, X.decorations = Bm, X.blockWrappers = Vm, X.outerDecorations = Hm, X.atomicRanges = Um, X.bidiIsolatedRanges = Wm, X.cursorScrollMargin = /*@__PURE__*/ q.define({ combine: (e) => {
		let t = 5, n = 5;
		for (let r of e) typeof r == "number" ? t = n = r : {x: t, y: n} = r;
		return {
			x: t,
			y: n
		};
	} }), X.scrollMargins = Gm, X.darkTheme = ug, X.cspNonce = /*@__PURE__*/ q.define({ combine: (e) => e.length ? e[0] : "" }), X.contentAttributes = zm, X.editorAttributes = Rm, X.lineWrapping = /*@__PURE__*/ X.contentAttributes.of({ class: "cm-lineWrapping" }), X.announce = /*@__PURE__*/ Al.define(), bg = 4096, xg = {}, Sg = class e {
		constructor(e, t, n, r, i, a) {
			this.from = e, this.to = t, this.dir = n, this.isolates = r, this.fresh = i, this.order = a;
		}
		static update(t, n) {
			if (n.empty && !t.some((e) => e.fresh)) return t;
			let r = [], i = t.length ? t[t.length - 1].dir : sm.LTR;
			for (let a = Math.max(0, t.length - 10); a < t.length; a++) {
				let o = t[a];
				o.dir == i && !n.touchesRange(o.from, o.to) && r.push(new e(n.mapPos(o.from, 1), n.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
			}
			return r;
		}
	}, Cg = J.mac ? "mac" : J.windows ? "win" : J.linux ? "linux" : "key", wg = /*@__PURE__*/ hl.default(/*@__PURE__*/ X.domEventHandlers({ keydown(e, t) {
		return Ff(Mf(t.state), e, t, "editor");
	} })), Tg = /*@__PURE__*/ q.define({ enables: wg }), Eg = /*@__PURE__*/ new WeakMap(), Dg = null, Og = 4e3, kg = null, Ag = class e {
		constructor(e, t, n, r, i) {
			this.className = e, this.left = t, this.top = n, this.width = r, this.height = i;
		}
		draw() {
			let e = document.createElement("div");
			return e.className = this.className, this.adjust(e), e;
		}
		update(e, t) {
			return t.className == this.className && (this.adjust(e), !0);
		}
		adjust(e) {
			e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
		}
		eq(e) {
			return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
		}
		static forRange(t, n, r) {
			if (r.empty) {
				let i = t.coordsAtPos(r.head, r.assoc || 1);
				if (!i) return [];
				let a = If(t);
				return [new e(n, i.left - a.left, i.top - a.top, null, i.bottom - i.top)];
			}
			return Rf(t, n, r);
		}
	}, jg = class {
		constructor(e, t) {
			this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = {
				read: this.measure.bind(this),
				write: this.draw.bind(this)
			}, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
		}
		update(e) {
			e.startState.facet(Mg) != e.state.facet(Mg) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
		}
		docViewUpdate(e) {
			this.layer.updateOnDocViewUpdate !== !1 && e.requestMeasure(this.measureReq);
		}
		setOrder(e) {
			let t = 0, n = e.facet(Mg);
			for (; t < n.length && n[t] != this.layer;) t++;
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
			if (e.length != this.drawn.length || e.some((e, t) => !zf(e, this.drawn[t]))) {
				let t = this.dom.firstChild, n = 0;
				for (let r of e) r.update && t && r.constructor && this.drawn[n].constructor && r.update(t, this.drawn[n]) ? (t = t.nextSibling, n++) : this.dom.insertBefore(r.draw(), t);
				for (; t;) {
					let e = t.nextSibling;
					t.remove(), t = e;
				}
				this.drawn = e, J.webkit && (this.dom.style.display = this.dom.firstChild ? "" : "none");
			}
		}
		destroy() {
			this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
		}
	}, Mg = /*@__PURE__*/ q.define(), Ng = !J.ios, Pg = /*@__PURE__*/ q.define({ combine(e) {
		return Lc(e, {
			cursorBlinkRate: 1200,
			drawRangeCursor: !0,
			iosSelectionHandles: !0
		}, {
			cursorBlinkRate: (e, t) => Math.min(e, t),
			drawRangeCursor: (e, t) => e || t
		});
	} }), Fg = /*@__PURE__*/ Bf({
		above: !0,
		markers(e) {
			let { state: t } = e, n = t.facet(Pg), r = [];
			for (let i of t.selection.ranges) {
				let a = i == t.selection.main;
				if (i.empty || n.drawRangeCursor && !(a && J.ios && n.iosSelectionHandles)) {
					let t = a ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", n = i.empty ? i : K.cursor(i.head, i.assoc);
					for (let i of Ag.forRange(e, t, n)) r.push(i);
				}
			}
			return r;
		},
		update(e, t) {
			e.transactions.some((e) => e.selection) && (t.style.animationName = t.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
			let n = Uf(e);
			return n && Wf(e.state, t), e.docChanged || e.selectionSet || n;
		},
		mount(e, t) {
			Wf(t.state, e);
		},
		class: "cm-cursorLayer"
	}), Ig = /*@__PURE__*/ Bf({
		above: !1,
		markers(e) {
			let t = [], { main: n, ranges: r } = e.state.selection;
			for (let i of r) if (!i.empty && (Ng || i != n)) for (let n of Ag.forRange(e, "cm-selectionBackground", i)) t.push(n);
			if (J.ios && !n.empty && e.state.facet(Pg).iosSelectionHandles) {
				for (let r of Ag.forRange(e, "cm-selectionHandle cm-selectionHandle-start", K.cursor(n.from, 1))) t.push(r);
				for (let r of Ag.forRange(e, "cm-selectionHandle cm-selectionHandle-end", K.cursor(n.to, 1))) t.push(r);
			}
			return t;
		},
		update(e, t) {
			return e.docChanged || e.selectionSet || e.viewportChanged || Uf(e);
		},
		class: "cm-selectionLayer"
	}), Lg = J.gecko && J.gecko_version == 153 ? "#ffffff01" : "transparent", Rg = /*@__PURE__*/ hl.highest(/*@__PURE__*/ X.theme({
		".cm-line": {
			...Ng ? { "& ::selection, &::selection": { backgroundColor: `${Lg} !important` } } : {},
			caretColor: "transparent !important"
		},
		".cm-content": {
			caretColor: "transparent !important",
			"& :focus": {
				caretColor: "initial !important",
				...Ng ? { "&::selection, & ::selection": { backgroundColor: "Highlight !important" } } : {}
			}
		}
	})), zg = /*@__PURE__*/ Al.define({ map(e, t) {
		return e == null ? null : t.mapPos(e);
	} }), Bg = /*@__PURE__*/ pl.define({
		create() {
			return null;
		},
		update(e, t) {
			return e != null && (e = t.changes.mapPos(e)), t.effects.reduce((e, t) => t.is(zg) ? t.value : e, e);
		}
	}), Vg = /*@__PURE__*/ Im.fromClass(class {
		constructor(e) {
			this.view = e, this.cursor = null, this.measureReq = {
				read: this.readPos.bind(this),
				write: this.drawCursor.bind(this)
			};
		}
		update(e) {
			var t;
			let n = e.state.field(Bg);
			n == null ? this.cursor != null && ((t = this.cursor) == null || t.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (e.startState.field(Bg) != n || e.docChanged || e.geometryChanged) && this.view.requestMeasure(this.measureReq));
		}
		readPos() {
			let { view: e } = this, t = e.state.field(Bg), n = t != null && e.coordsAtPos(t);
			if (!n) return null;
			let r = e.scrollDOM.getBoundingClientRect();
			return {
				left: n.left - r.left + e.scrollDOM.scrollLeft * e.scaleX,
				top: n.top - r.top + e.scrollDOM.scrollTop * e.scaleY,
				height: n.bottom - n.top
			};
		}
		drawCursor(e) {
			if (this.cursor) {
				let { scaleX: t, scaleY: n } = this.view;
				e ? (this.cursor.style.left = e.left / t + "px", this.cursor.style.top = e.top / n + "px", this.cursor.style.height = e.height / n + "px") : this.cursor.style.left = "-100000px";
			}
		}
		destroy() {
			this.cursor && this.cursor.remove();
		}
		setDropPos(e) {
			this.view.state.field(Bg) != e && this.view.dispatch({ effects: zg.of(e) });
		}
	}, { eventObservers: {
		dragover(e) {
			this.setDropPos(this.view.posAtCoords({
				x: e.clientX,
				y: e.clientY
			}));
		},
		dragleave(e) {
			e.target != this.view.contentDOM && this.view.contentDOM.contains(e.relatedTarget) || this.setDropPos(null);
		},
		dragend() {
			this.setDropPos(null);
		},
		drop() {
			this.setDropPos(null);
		}
	} }), Hg = class {
		constructor(e) {
			let { regexp: t, decoration: n, decorate: r, boundary: i, maxLength: a = 1e3 } = e;
			if (!t.global) throw RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
			if (this.regexp = t, r) this.addMatch = (e, t, n, i) => r(i, n, n + e[0].length, e, t);
			else if (typeof n == "function") this.addMatch = (e, t, r, i) => {
				let a = n(e, t, r);
				a && i(r, r + e[0].length, a);
			};
			else if (n) this.addMatch = (e, t, r, i) => i(r, r + e[0].length, n);
			else throw RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
			this.boundary = i, this.maxLength = a;
		}
		createDeco(e) {
			let t = new Vl(), n = t.add.bind(t);
			for (let { from: t, to: r } of qf(e, this.maxLength)) Kf(e.state.doc, this.regexp, t, r, (t, r) => this.addMatch(r, e, t, n));
			return t.finish();
		}
		updateDeco(e, t) {
			let n = 1e9, r = -1;
			return e.docChanged && e.changes.iterChanges((t, i, a, o) => {
				o >= e.view.viewport.from && a <= e.view.viewport.to && (n = Math.min(a, n), r = Math.max(o, r));
			}), e.viewportMoved || r - n > 1e3 ? this.createDeco(e.view) : r > -1 ? this.updateRange(e.view, t.map(e.changes), n, r) : t;
		}
		updateRange(e, t, n, r) {
			for (let i of e.visibleRanges) {
				let a = Math.max(i.from, n), o = Math.min(i.to, r);
				if (o >= a) {
					let n = e.state.doc.lineAt(a), r = n.to < o ? e.state.doc.lineAt(o) : n, s = Math.max(i.from, n.from), c = Math.min(i.to, r.to);
					if (this.boundary) {
						for (; a > n.from; a--) if (this.boundary.test(n.text[a - 1 - n.from])) {
							s = a;
							break;
						}
						for (; o < r.to; o++) if (this.boundary.test(r.text[o - r.from])) {
							c = o;
							break;
						}
					}
					let l = [], u, d = (e, t, n) => l.push(n.range(e, t));
					if (n == r) for (this.regexp.lastIndex = s - n.from; (u = this.regexp.exec(n.text)) && u.index < c - n.from;) this.addMatch(u, e, u.index + n.from, d);
					else Kf(e.state.doc, this.regexp, s, c, (t, n) => this.addMatch(n, e, t, d));
					t = t.update({
						filterFrom: s,
						filterTo: c,
						filter: (e, t) => e < s || t > c,
						add: l
					});
				}
			}
			return t;
		}
	}, Ug = /x/.unicode == null ? "g" : "gu", Wg = /*@__PURE__*/ RegExp("[\0-\b\n--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩﻿￹-￼]", Ug), Gg = {
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
	}, Kg = null, qg = /*@__PURE__*/ q.define({ combine(e) {
		let t = Lc(e, {
			render: null,
			specialChars: Wg,
			addSpecialChars: null
		});
		return (t.replaceTabs = !Jf()) && (t.specialChars = RegExp("	|" + t.specialChars.source, Ug)), t.addSpecialChars && (t.specialChars = RegExp(t.specialChars.source + "|" + t.addSpecialChars.source, Ug)), t;
	} }), Jg = null, Yg = "•", Xg = class extends Yp {
		constructor(e, t) {
			super(), this.options = e, this.code = t;
		}
		eq(e) {
			return e.code == this.code;
		}
		toDOM(e) {
			let t = Zf(this.code), n = e.state.phrase("Control character") + " " + (Gg[this.code] || "0x" + this.code.toString(16)), r = this.options.render && this.options.render(this.code, n, t);
			if (r) return r;
			let i = document.createElement("span");
			return i.textContent = t, i.title = n, i.setAttribute("aria-label", n), i.className = "cm-specialChar", i;
		}
		ignoreEvent() {
			return !1;
		}
	}, Zg = class extends Yp {
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
	}, Qg = /*@__PURE__*/ Im.fromClass(class {
		constructor() {
			this.height = 1e3, this.attrs = { style: "padding-bottom: 1000px" };
		}
		update(e) {
			let { view: t } = e, n = t.viewState.editorHeight - t.defaultLineHeight - t.documentPadding.top - .5;
			n >= 0 && n != this.height && (this.height = n, this.attrs = { style: `padding-bottom: ${n}px` });
		}
	}), $g = /*@__PURE__*/ Y.line({ class: "cm-activeLine" }), e_ = /*@__PURE__*/ Im.fromClass(class {
		constructor(e) {
			this.decorations = this.getDeco(e);
		}
		update(e) {
			(e.docChanged || e.selectionSet) && (this.decorations = this.getDeco(e.view));
		}
		getDeco(e) {
			let t = -1, n = [];
			for (let r of e.state.selection.ranges) {
				let i = e.lineBlockAt(r.head);
				i.from > t && (n.push($g.range(i.from)), t = i.from);
			}
			return Y.set(n);
		}
	}, { decorations: (e) => e.decorations }), t_ = class extends Yp {
		constructor(e) {
			super(), this.content = e;
		}
		toDOM(e) {
			let t = document.createElement("span");
			return t.className = "cm-placeholder", t.style.pointerEvents = "none", t.appendChild(typeof this.content == "string" ? document.createTextNode(this.content) : typeof this.content == "function" ? this.content(e) : this.content.cloneNode(!0)), t.setAttribute("aria-hidden", "true"), t;
		}
		coordsAt(e) {
			let t = e.firstChild ? Su(e.firstChild) : [];
			if (!t.length) return null;
			let n = window.getComputedStyle(e.parentNode), r = Ou(t[0], n.direction != "rtl"), i = parseInt(n.lineHeight);
			return r.bottom - r.top > i * 1.5 ? {
				left: r.left,
				right: r.right,
				top: r.top,
				bottom: r.top + i
			} : r;
		}
		ignoreEvent() {
			return !1;
		}
	}, n_ = 2e3, r_ = {
		Alt: [18, (e) => !!e.altKey],
		Control: [17, (e) => !!e.ctrlKey],
		Shift: [16, (e) => !!e.shiftKey],
		Meta: [91, (e) => !!e.metaKey]
	}, i_ = { style: "cursor: crosshair" }, a_ = "-10000px", o_ = class {
		constructor(e, t, n, r) {
			this.facet = t, this.createTooltipView = n, this.removeTooltipView = r, this.input = e.state.facet(t), this.tooltips = this.input.filter((e) => e);
			let i = null;
			this.tooltipViews = this.tooltips.map((e) => i = n(e, i));
		}
		update(e, t) {
			var n;
			let r = e.state.facet(this.facet), i = r.filter((e) => e);
			if (r === this.input) {
				for (let t of this.tooltipViews) t.update && t.update(e);
				return !1;
			}
			let a = [], o = t ? [] : null;
			for (let n = 0; n < i.length; n++) {
				let r = i[n], s = -1;
				if (r) {
					for (let e = 0; e < this.tooltips.length; e++) {
						let t = this.tooltips[e];
						t && t.create == r.create && (s = e);
					}
					if (s < 0) a[n] = this.createTooltipView(r, n ? a[n - 1] : null), o && (o[n] = !!r.above);
					else {
						let r = a[n] = this.tooltipViews[s];
						o && (o[n] = t[s]), r.update && r.update(e);
					}
				}
			}
			for (let e of this.tooltipViews) a.indexOf(e) < 0 && (this.removeTooltipView(e), (n = e.destroy) == null || n.call(e));
			return t && (o.forEach((e, n) => t[n] = e), t.length = o.length), this.input = r, this.tooltips = i, this.tooltipViews = a, !0;
		}
	}, s_ = /*@__PURE__*/ q.define({ combine: (e) => ({
		position: J.ios ? "absolute" : e.find((e) => e.position)?.position || "fixed",
		parent: e.find((e) => e.parent)?.parent || null,
		tooltipSpace: e.find((e) => e.tooltipSpace)?.tooltipSpace || lp
	}) }), c_ = /*@__PURE__*/ new WeakMap(), l_ = /*@__PURE__*/ Im.fromClass(class {
		constructor(e) {
			this.view = e, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
			let t = e.state.facet(s_);
			this.position = t.position, this.parent = t.parent, this.classes = e.themeClasses, this.createContainer(), this.measureReq = {
				read: this.readMeasure.bind(this),
				write: this.writeMeasure.bind(this),
				key: this
			}, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new o_(e, f_, (e, t) => this.createTooltip(e, t), (e) => {
				this.resizeObserver && this.resizeObserver.unobserve(e.dom), e.dom.remove();
			}), this.above = this.manager.tooltips.map((e) => !!e.above), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((e) => {
				Date.now() > this.lastTransaction - 50 && e.length > 0 && e[e.length - 1].intersectionRatio < 1 && this.measureSoon();
			}, { threshold: [1] }) : null, this.observeIntersection(), e.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
		}
		createContainer() {
			this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
		}
		observeIntersection() {
			if (this.intersectionObserver) {
				this.intersectionObserver.disconnect();
				for (let e of this.manager.tooltipViews) this.intersectionObserver.observe(e.dom);
			}
		}
		measureSoon() {
			this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
				this.measureTimeout = -1, this.maybeMeasure();
			}, 50));
		}
		update(e) {
			e.transactions.length && (this.lastTransaction = Date.now());
			let t = this.manager.update(e, this.above);
			t && this.observeIntersection();
			let n = t || e.geometryChanged, r = e.state.facet(s_);
			if (r.position != this.position && !this.madeAbsolute) {
				this.position = r.position;
				for (let e of this.manager.tooltipViews) e.dom.style.position = this.position;
				n = !0;
			}
			if (r.parent != this.parent) {
				this.parent && this.container.remove(), this.parent = r.parent, this.createContainer();
				for (let e of this.manager.tooltipViews) this.container.appendChild(e.dom);
				n = !0;
			} else this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
			n && this.maybeMeasure();
		}
		createTooltip(e, t) {
			let n = e.create(this.view), r = t ? t.dom : null;
			if (n.dom.classList.add("cm-tooltip"), e.arrow && !n.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
				let e = document.createElement("div");
				e.className = "cm-tooltip-arrow", n.dom.appendChild(e);
			}
			return n.dom.style.position = this.position, n.dom.style.top = a_, n.dom.style.left = "0px", this.container.insertBefore(n.dom, r), n.mount && n.mount(this.view), this.resizeObserver && this.resizeObserver.observe(n.dom), n;
		}
		destroy() {
			var e, t, n;
			this.view.win.removeEventListener("resize", this.measureSoon);
			for (let t of this.manager.tooltipViews) t.dom.remove(), (e = t.destroy) == null || e.call(t);
			this.parent && this.container.remove(), (t = this.resizeObserver) == null || t.disconnect(), (n = this.intersectionObserver) == null || n.disconnect(), clearTimeout(this.measureTimeout);
		}
		readMeasure() {
			let e = 1, t = 1, n = !1, r = 0;
			if (this.position == "fixed" && this.manager.tooltipViews.length) {
				let { dom: e } = this.manager.tooltipViews[0];
				if (J.safari) {
					let t = e.getBoundingClientRect();
					n = Math.abs(t.top + 1e4) > 1 || Math.abs(t.left) > 1;
				} else n = !!e.offsetParent && e.offsetParent != this.container.ownerDocument.body;
			}
			if (n || this.position == "absolute") {
				if (this.parent) {
					let n = this.parent.getBoundingClientRect();
					n.width && n.height && (e = n.width / this.parent.offsetWidth, t = n.height / this.parent.offsetHeight);
				} else ({scaleX: e, scaleY: t} = this.view.viewState);
			} else r = cp(this.view).left;
			let i = this.view.scrollDOM.getBoundingClientRect(), a = id(this.view);
			return {
				visible: {
					left: i.left + a.left,
					top: i.top + a.top,
					right: i.right - a.right,
					bottom: i.bottom - a.bottom
				},
				parent: this.parent ? this.container.getBoundingClientRect() : this.view.dom.getBoundingClientRect(),
				pos: this.manager.tooltips.map((e, t) => {
					let n = this.manager.tooltipViews[t];
					return n.getCoords ? n.getCoords(e.pos) : this.view.coordsAtPos(e.pos);
				}),
				size: this.manager.tooltipViews.map(({ dom: e }) => e.getBoundingClientRect()),
				space: this.view.state.facet(s_).tooltipSpace(this.view),
				scaleX: e,
				scaleY: t,
				makeAbsolute: n,
				fixedLeft: r
			};
		}
		writeMeasure(e) {
			if (e.makeAbsolute) {
				this.madeAbsolute = !0, this.position = "absolute";
				for (let e of this.manager.tooltipViews) e.dom.style.position = "absolute";
			}
			let { visible: t, space: n, scaleX: r, scaleY: i } = e, a = [];
			for (let o = 0; o < this.manager.tooltips.length; o++) {
				let s = this.manager.tooltips[o], c = this.manager.tooltipViews[o], { dom: l } = c, u = e.pos[o], d = e.size[o];
				if (!u || s.clip !== !1 && (u.bottom <= Math.max(t.top, n.top) || u.top >= Math.min(t.bottom, n.bottom) || u.right < Math.max(t.left, n.left) - .1 || u.left > Math.min(t.right, n.right) + .1)) {
					l.style.top = a_;
					continue;
				}
				let f = s.arrow ? c.dom.querySelector(".cm-tooltip-arrow") : null, p = f ? 7 : 0, m = d.right - d.left, h = c_.get(c) ?? d.bottom - d.top, g = c.offset || d_, _ = this.view.textDirection == sm.LTR, v = d.width > n.right - n.left ? _ ? n.left : n.right - d.width : _ ? Math.max(n.left, Math.min(u.left - (f ? 14 : 0) + g.x, n.right - m)) : Math.min(Math.max(n.left, u.left - m + (f ? 14 : 0) - g.x), n.right - m), y = this.above[o];
				!s.strictSide && (y ? u.top - h - p - g.y < n.top : u.bottom + h + p + g.y > n.bottom) && y == n.bottom - u.bottom > u.top - n.top && (y = this.above[o] = !y);
				let b = (y ? u.top - n.top : n.bottom - u.bottom) - p;
				if (b < h && c.resize !== !1) {
					if (b < this.view.defaultLineHeight) {
						l.style.top = a_;
						continue;
					}
					c_.set(c, h), l.style.height = (h = b) / i + "px";
				} else l.style.height && (l.style.height = "");
				let x = y ? u.top - h - p - g.y : u.bottom + p + g.y, S = v + m;
				if (c.overlap !== !0) for (let e of a) e.left < S && e.right > v && e.top < x + h && e.bottom > x && (x = y ? e.top - h - 2 - p : e.bottom + p + 2);
				if (this.position == "absolute" ? (l.style.top = (x - e.parent.top) / i + "px", up(l, (v - e.parent.left) / r)) : (l.style.top = x / i + "px", up(l, (v - e.fixedLeft) / r)), f) {
					let e = u.left + (_ ? g.x : -g.x) - (v + 14 - 7);
					f.style.left = e / r + "px";
				}
				c.overlap !== !0 && a.push({
					left: v,
					top: x,
					right: S,
					bottom: x + h
				}), l.classList.toggle("cm-tooltip-above", y), l.classList.toggle("cm-tooltip-below", !y), c.positioned && c.positioned(e.space);
			}
		}
		maybeMeasure() {
			if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView))) for (let e of this.manager.tooltipViews) e.dom.style.top = a_;
		}
	}, { eventObservers: { scroll() {
		this.maybeMeasure();
	} } }), u_ = /*@__PURE__*/ X.baseTheme({
		".cm-tooltip": {
			zIndex: 500,
			boxSizing: "border-box"
		},
		"&light .cm-tooltip": {
			border: "1px solid #bbb",
			backgroundColor: "#f5f5f5"
		},
		"&light .cm-tooltip-section:not(:first-child)": { borderTop: "1px solid #bbb" },
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
				"&:before": { borderTop: "7px solid #bbb" },
				"&:after": {
					borderTop: "7px solid #f5f5f5",
					bottom: "1px"
				}
			},
			".cm-tooltip-below &": {
				top: "-7px",
				"&:before": { borderBottom: "7px solid #bbb" },
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
	}), d_ = {
		x: 0,
		y: 0
	}, f_ = /*@__PURE__*/ q.define({ enables: [l_, u_] }), p_ = /*@__PURE__*/ q.define({ combine: (e) => e.reduce((e, t) => e.concat(t), []) }), m_ = class e {
		static create(t) {
			return new e(t);
		}
		constructor(e) {
			this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new o_(e, p_, (e, t) => this.createHostedView(e, t), (e) => e.dom.remove());
		}
		createHostedView(e, t) {
			let n = e.create(this.view);
			return n.dom.classList.add("cm-tooltip-section"), this.dom.insertBefore(n.dom, t ? t.dom.nextSibling : this.dom.firstChild), this.mounted && n.mount && n.mount(this.view), n;
		}
		mount(e) {
			for (let t of this.manager.tooltipViews) t.mount && t.mount(e);
			this.mounted = !0;
		}
		positioned(e) {
			for (let t of this.manager.tooltipViews) t.positioned && t.positioned(e);
		}
		update(e) {
			this.manager.update(e);
		}
		destroy() {
			var e;
			for (let t of this.manager.tooltipViews) (e = t.destroy) == null || e.call(t);
		}
		passProp(e) {
			let t;
			for (let n of this.manager.tooltipViews) {
				let r = n[e];
				if (r !== void 0) {
					if (t === void 0) t = r;
					else if (t !== r) return;
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
	}, h_ = /*@__PURE__*/ f_.compute([p_], (e) => {
		let t = e.facet(p_);
		return t.length === 0 ? null : {
			pos: Math.min(...t.map((e) => e.pos)),
			end: Math.max(...t.map((e) => e.end ?? e.pos)),
			create: m_.create,
			above: t[0].above,
			arrow: t.some((e) => e.arrow)
		};
	}), g_ = /*@__PURE__*/ q.define(), __ = class {
		constructor(e, t, n, r, i, a) {
			this.view = e, this.source = t, this.field = n, this.locked = r, this.setHover = i, this.hoverTime = a, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = {
				x: 0,
				y: 0,
				target: e.dom,
				time: 0
			}, this.checkHover = this.checkHover.bind(this), e.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), e.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
		}
		update(e) {
			this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
		}
		get active() {
			return this.view.state.field(this.field);
		}
		checkHover() {
			if (this.hoverTimeout = -1, this.active.length) return;
			let e = Date.now() - this.lastMove.time;
			e < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - e) : this.startHover();
		}
		startHover() {
			clearTimeout(this.restartTimeout);
			let { view: e, lastMove: t } = this, n = e.docView.tile.nearest(t.target);
			if (!n) return;
			let r, i = 1;
			if (n.isWidget()) r = n.posAtStart;
			else {
				if (r = e.posAtCoords(t), r == null) return;
				let n = e.coordsAtPos(r);
				if (!n || t.y < n.top || t.y > n.bottom || t.x < n.left - e.defaultCharacterWidth || t.x > n.right + e.defaultCharacterWidth) return;
				let a = e.bidiSpans(e.state.doc.lineAt(r)).find((e) => e.from <= r && e.to >= r), o = a && a.dir == sm.RTL ? -1 : 1;
				i = t.x < n.left ? -o : o;
			}
			this.activateHover(e, r, i);
		}
		activateHover(e, t, n, r) {
			let i = this.source(e, t, n), a = (t) => {
				if (t && (!Array.isArray(t) || t.length)) {
					let n = Array.isArray(t) ? t : [t];
					r && this.locked.set(n, r), e.dispatch({ effects: this.setHover.of(n) });
				}
			};
			if (i && "then" in i) {
				let n = this.pending = { pos: t };
				i.then((e) => {
					this.pending == n && (this.pending = null, a(e));
				}, (t) => td(e.state, t, "hover tooltip"));
			} else a(i);
		}
		get tooltip() {
			let e = this.view.plugin(l_), t = e ? e.manager.tooltips.findIndex((e) => e.create == m_.create) : -1;
			return t > -1 ? e.manager.tooltipViews[t] : null;
		}
		mousemove(e) {
			this.lastMove = {
				x: e.clientX,
				y: e.clientY,
				target: e.target,
				time: Date.now()
			}, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
			let { active: t, tooltip: n } = this;
			if (t.length && !this.locked.has(t) && n && !dp(n.dom, e) || this.pending) {
				let { pos: n } = t[0] || this.pending, r = t[0]?.end ?? n;
				(n == r ? this.view.posAtCoords(this.lastMove) != n : !fp(this.view, n, r, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of([]) }), this.pending = null);
			}
		}
		mouseleave(e) {
			clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
			let { active: t } = this;
			if (t.length && !this.locked.has(t)) {
				let { tooltip: t } = this;
				t && t.dom.contains(e.relatedTarget) ? this.watchTooltipLeave(t.dom) : this.view.dispatch({ effects: this.setHover.of([]) });
			}
		}
		watchTooltipLeave(e) {
			let t = (n) => {
				e.removeEventListener("mouseleave", t);
				let { active: r } = this;
				r.length && !this.locked.has(r) && !this.view.dom.contains(n.relatedTarget) && this.view.dispatch({ effects: this.setHover.of([]) });
			};
			e.addEventListener("mouseleave", t);
		}
		destroy() {
			clearTimeout(this.hoverTimeout), clearTimeout(this.restartTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
		}
	}, v_ = 4, y_ = /*@__PURE__*/ Al.define(), b_ = /*@__PURE__*/ y_.of(null), x_ = /*@__PURE__*/ q.define({ combine(e) {
		let t, n;
		for (let r of e) t ||= r.topContainer, n ||= r.bottomContainer;
		return {
			topContainer: t,
			bottomContainer: n
		};
	} }), S_ = /*@__PURE__*/ Im.fromClass(class {
		constructor(e) {
			this.input = e.state.facet(w_), this.specs = this.input.filter((e) => e), this.panels = this.specs.map((t) => t(e));
			let t = e.state.facet(x_);
			this.top = new C_(e, !0, t.topContainer), this.bottom = new C_(e, !1, t.bottomContainer), this.top.sync(this.panels.filter((e) => e.top)), this.bottom.sync(this.panels.filter((e) => !e.top));
			for (let e of this.panels) e.dom.classList.add("cm-panel"), e.mount && e.mount();
		}
		update(e) {
			let t = e.state.facet(x_);
			this.top.container != t.topContainer && (this.top.sync([]), this.top = new C_(e.view, !0, t.topContainer)), this.bottom.container != t.bottomContainer && (this.bottom.sync([]), this.bottom = new C_(e.view, !1, t.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
			let n = e.state.facet(w_);
			if (n != this.input) {
				let t = n.filter((e) => e), r = [], i = [], a = [], o = [];
				for (let n of t) {
					let t = this.specs.indexOf(n), s;
					t < 0 ? (s = n(e.view), o.push(s)) : (s = this.panels[t], s.update && s.update(e)), r.push(s), (s.top ? i : a).push(s);
				}
				this.specs = t, this.panels = r, this.top.sync(i), this.bottom.sync(a);
				for (let e of o) e.dom.classList.add("cm-panel"), e.mount && e.mount();
			} else for (let t of this.panels) t.update && t.update(e);
		}
		destroy() {
			this.top.sync([]), this.bottom.sync([]);
		}
	}, { provide: (e) => X.scrollMargins.of((t) => {
		let n = t.plugin(e);
		return n && {
			top: n.top.scrollMargin(),
			bottom: n.bottom.scrollMargin()
		};
	}) }), C_ = class {
		constructor(e, t, n) {
			this.view = e, this.top = t, this.container = n, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
		}
		sync(e) {
			for (let t of this.panels) t.destroy && e.indexOf(t) < 0 && t.destroy();
			this.panels = e, this.syncDOM();
		}
		syncDOM() {
			if (this.panels.length == 0) {
				this.dom &&= (this.dom.remove(), void 0);
				return;
			}
			if (!this.dom) {
				this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom";
				let e = this.container || this.view.dom;
				e.insertBefore(this.dom, this.top ? e.firstChild : null);
			}
			let e = this.dom.firstChild;
			for (let t of this.panels) if (t.dom.parentNode == this.dom) {
				for (; e != t.dom;) e = xp(e);
				e = e.nextSibling;
			} else this.dom.insertBefore(t.dom, e);
			for (; e;) e = xp(e);
		}
		scrollMargin() {
			return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
		}
		syncClasses() {
			if (this.container && this.classes != this.view.themeClasses) {
				for (let e of this.classes.split(" ")) e && this.container.classList.remove(e);
				for (let e of (this.classes = this.view.themeClasses).split(" ")) e && this.container.classList.add(e);
			}
		}
	}, w_ = /*@__PURE__*/ q.define({ enables: S_ }), T_ = /*@__PURE__*/ pl.define({
		create() {
			return [];
		},
		update(e, t) {
			for (let n of t.effects) n.is(E_) ? e = [n.value].concat(e) : n.is(D_) && (e = e.filter((e) => e != n.value));
			return e;
		},
		provide: (e) => w_.computeN([e], (t) => t.field(e))
	}), E_ = /*@__PURE__*/ Al.define(), D_ = /*@__PURE__*/ Al.define(), O_ = class extends Ll {
		compare(e) {
			return this == e || this.constructor == e.constructor && this.eq(e);
		}
		eq(e) {
			return !1;
		}
		destroy(e) {}
	}, O_.prototype.elementClass = "", O_.prototype.toDOM = void 0, O_.prototype.mapMode = al.TrackBefore, O_.prototype.startSide = O_.prototype.endSide = -1, O_.prototype.point = !0, k_ = /*@__PURE__*/ q.define(), A_ = /*@__PURE__*/ q.define(), j_ = {
		class: "",
		renderEmptyElements: !1,
		elementStyle: "",
		markers: () => Bl.empty,
		lineMarker: () => null,
		widgetMarker: () => null,
		lineMarkerChange: null,
		initialSpacer: null,
		updateSpacer: null,
		domEventHandlers: {},
		side: "before"
	}, M_ = /*@__PURE__*/ q.define(), N_ = /*@__PURE__*/ q.define({ combine: (e) => e.some((e) => e) }), P_ = /*@__PURE__*/ Im.fromClass(class {
		constructor(e) {
			this.view = e, this.domAfter = null, this.prevViewport = e.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters cm-gutters-before", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = e.state.facet(M_).map((t) => new I_(e, t)), this.fixed = !e.state.facet(N_);
			for (let e of this.gutters) e.config.side == "after" ? this.getDOMAfter().appendChild(e.dom) : this.dom.appendChild(e.dom);
			this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), e.scrollDOM.insertBefore(this.dom, e.contentDOM);
		}
		getDOMAfter() {
			return this.domAfter || (this.domAfter = document.createElement("div"), this.domAfter.className = "cm-gutters cm-gutters-after", this.domAfter.setAttribute("aria-hidden", "true"), this.domAfter.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.domAfter.style.position = this.fixed ? "sticky" : "", this.view.scrollDOM.appendChild(this.domAfter)), this.domAfter;
		}
		update(e) {
			if (this.updateGutters(e)) {
				let t = this.prevViewport, n = e.view.viewport, r = Math.min(t.to, n.to) - Math.max(t.from, n.from);
				this.syncGutters(r < (n.to - n.from) * .8);
			}
			if (e.geometryChanged) {
				let e = this.view.contentHeight / this.view.scaleY + "px";
				this.dom.style.minHeight = e, this.domAfter && (this.domAfter.style.minHeight = e);
			}
			this.view.state.facet(N_) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : "", this.domAfter && (this.domAfter.style.position = this.fixed ? "sticky" : "")), this.prevViewport = e.view.viewport;
		}
		syncGutters(e) {
			let t = this.dom.nextSibling;
			e && (this.dom.remove(), this.domAfter && this.domAfter.remove());
			let n = Bl.iter(this.view.state.facet(k_), this.view.viewport.from), r = [], i = this.gutters.map((e) => new F_(e, this.view.viewport, -this.view.documentPadding.top));
			for (let e of this.view.viewportLineBlocks) if (r.length && (r = []), Array.isArray(e.type)) {
				let t = !0;
				for (let a of e.type) if (a.type == Xp.Text && t) {
					Op(n, r, a.from);
					for (let e of i) e.line(this.view, a, r);
					t = !1;
				} else if (a.widget) for (let e of i) e.widget(this.view, a);
			} else if (e.type == Xp.Text) {
				Op(n, r, e.from);
				for (let t of i) t.line(this.view, e, r);
			} else if (e.widget) for (let t of i) t.widget(this.view, e);
			for (let e of i) e.finish();
			e && (this.view.scrollDOM.insertBefore(this.dom, t), this.domAfter && this.view.scrollDOM.appendChild(this.domAfter));
		}
		updateGutters(e) {
			let t = e.startState.facet(M_), n = e.state.facet(M_), r = e.docChanged || e.heightChanged || e.viewportChanged || !Bl.eq(e.startState.facet(k_), e.state.facet(k_), e.view.viewport.from, e.view.viewport.to);
			if (t == n) for (let t of this.gutters) t.update(e) && (r = !0);
			else {
				r = !0;
				let i = [];
				for (let r of n) {
					let n = t.indexOf(r);
					n < 0 ? i.push(new I_(this.view, r)) : (this.gutters[n].update(e), i.push(this.gutters[n]));
				}
				for (let e of this.gutters) e.dom.remove(), i.indexOf(e) < 0 && e.destroy();
				for (let e of i) e.config.side == "after" ? this.getDOMAfter().appendChild(e.dom) : this.dom.appendChild(e.dom);
				this.gutters = i;
			}
			return r;
		}
		destroy() {
			for (let e of this.gutters) e.destroy();
			this.dom.remove(), this.domAfter && this.domAfter.remove();
		}
	}, { provide: (e) => X.scrollMargins.of((t) => {
		let n = t.plugin(e);
		if (!n || n.gutters.length == 0 || !n.fixed) return null;
		let r = n.dom.offsetWidth * t.scaleX, i = n.domAfter ? n.domAfter.offsetWidth * t.scaleX : 0;
		return t.textDirection == sm.LTR ? {
			left: r,
			right: i
		} : {
			right: r,
			left: i
		};
	}) }), F_ = class {
		constructor(e, t, n) {
			this.gutter = e, this.height = n, this.i = 0, this.cursor = Bl.iter(e.markers, t.from);
		}
		addElement(e, t, n) {
			let { gutter: r } = this, i = (t.top - this.height) / e.scaleY, a = t.height / e.scaleY;
			if (this.i == r.elements.length) {
				let t = new L_(e, a, i, n);
				r.elements.push(t), r.dom.appendChild(t.dom);
			} else r.elements[this.i].update(e, a, i, n);
			this.height = t.bottom, this.i++;
		}
		line(e, t, n) {
			let r = [];
			Op(this.cursor, r, t.from), n.length && (r = r.concat(n));
			let i = this.gutter.config.lineMarker(e, t, r);
			i && r.unshift(i);
			let a = this.gutter;
			(r.length != 0 || a.config.renderEmptyElements) && this.addElement(e, t, r);
		}
		widget(e, t) {
			let n = this.gutter.config.widgetMarker(e, t.widget, t), r = n ? [n] : null;
			for (let n of e.state.facet(A_)) {
				let i = n(e, t.widget, t);
				i && (r ||= []).push(i);
			}
			r && this.addElement(e, t, r);
		}
		finish() {
			let e = this.gutter;
			for (; e.elements.length > this.i;) {
				let t = e.elements.pop();
				e.dom.removeChild(t.dom), t.destroy();
			}
		}
	}, I_ = class {
		constructor(e, t) {
			this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
			for (let n in t.domEventHandlers) this.dom.addEventListener(n, (r) => {
				let i = r.target, a;
				if (i != this.dom && this.dom.contains(i)) {
					for (; i.parentNode != this.dom;) i = i.parentNode;
					let e = i.getBoundingClientRect();
					a = (e.top + e.bottom) / 2;
				} else a = r.clientY;
				let o = e.lineBlockAtHeight(a - e.documentTop);
				t.domEventHandlers[n](e, o, r) && r.preventDefault();
			});
			this.markers = Dp(t.markers(e)), t.initialSpacer && (this.spacer = new L_(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
		}
		update(e) {
			let t = this.markers;
			if (this.markers = Dp(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
				let t = this.config.updateSpacer(this.spacer.markers[0], e);
				t != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [t]);
			}
			let n = e.view.viewport;
			return !Bl.eq(this.markers, t, n.from, n.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
		}
		destroy() {
			for (let e of this.elements) e.destroy();
		}
	}, L_ = class {
		constructor(e, t, n, r) {
			this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, n, r);
		}
		update(e, t, n, r) {
			this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != n && (this.dom.style.marginTop = (this.above = n) ? n + "px" : ""), kp(this.markers, r) || this.setMarkers(e, r);
		}
		setMarkers(e, t) {
			let n = "cm-gutterElement", r = this.dom.firstChild;
			for (let i = 0, a = 0;;) {
				let o = a, s = i < t.length ? t[i++] : null, c = !1;
				if (s) {
					let e = s.elementClass;
					e && (n += " " + e);
					for (let e = a; e < this.markers.length; e++) if (this.markers[e].compare(s)) {
						o = e, c = !0;
						break;
					}
				} else o = this.markers.length;
				for (; a < o;) {
					let e = this.markers[a++];
					if (e.toDOM) {
						e.destroy(r);
						let t = r.nextSibling;
						r.remove(), r = t;
					}
				}
				if (!s) break;
				s.toDOM && (c ? r = r.nextSibling : this.dom.insertBefore(s.toDOM(e), r)), c && a++;
			}
			this.dom.className = n, this.markers = t;
		}
		destroy() {
			this.setMarkers(null, []);
		}
	}, R_ = /*@__PURE__*/ q.define(), z_ = /*@__PURE__*/ q.define(), B_ = /*@__PURE__*/ q.define({ combine(e) {
		return Lc(e, {
			formatNumber: String,
			domEventHandlers: {}
		}, { domEventHandlers(e, t) {
			let n = Object.assign({}, e);
			for (let e in t) {
				let r = n[e], i = t[e];
				n[e] = r ? (e, t, n) => r(e, t, n) || i(e, t, n) : i;
			}
			return n;
		} });
	} }), V_ = class extends O_ {
		constructor(e) {
			super(), this.number = e;
		}
		eq(e) {
			return this.number == e.number;
		}
		toDOM() {
			return document.createTextNode(this.number);
		}
	}, H_ = /*@__PURE__*/ M_.compute([B_], (e) => ({
		class: "cm-lineNumbers",
		renderEmptyElements: !1,
		markers(e) {
			return e.state.facet(R_);
		},
		lineMarker(e, t, n) {
			return n.some((e) => e.toDOM) ? null : new V_(Ap(e, e.state.doc.lineAt(t.from).number));
		},
		widgetMarker: (e, t, n) => {
			for (let r of e.state.facet(z_)) {
				let i = r(e, t, n);
				if (i) return i;
			}
			return null;
		},
		lineMarkerChange: (e) => e.startState.facet(B_) != e.state.facet(B_),
		initialSpacer(e) {
			return new V_(Ap(e, Mp(e.state.doc.lines)));
		},
		updateSpacer(e, t) {
			let n = Ap(t.view, Mp(t.view.state.doc.lines));
			return n == e.number ? e : new V_(n);
		},
		domEventHandlers: e.facet(B_).domEventHandlers,
		side: "before"
	})), U_ = /*@__PURE__*/ new class extends O_ {
		constructor() {
			super(...arguments), this.elementClass = "cm-activeLineGutter";
		}
	}(), W_ = /*@__PURE__*/ k_.compute(["selection"], (e) => {
		let t = [], n = -1;
		for (let r of e.selection.ranges) {
			let i = e.doc.lineAt(r.head).from;
			i > n && (n = i, t.push(U_.range(i)));
		}
		return Bl.of(t);
	}), G_ = /*@__PURE__*/ Y.mark({ class: "cm-highlightTab" }), K_ = /*@__PURE__*/ Y.mark({ class: "cm-highlightSpace" }), q_ = /*@__PURE__*/ Pp(/*@__PURE__*/ new Hg({
		regexp: /\t| /g,
		decoration: (e) => e[0] == "	" ? G_ : K_,
		boundary: /\S/
	})), J_ = /*@__PURE__*/ Pp(/*@__PURE__*/ new Hg({
		regexp: /\s+$/g,
		decoration: /*@__PURE__*/ Y.mark({ class: "cm-trailingSpace" })
	})), Y_ = {
		HeightMap: Jh,
		HeightOracle: Uh,
		MeasuredHeights: Wh,
		QueryType: Kh,
		ChangedRange: qm,
		computeOrder: Zu,
		moveVisually: $u,
		clearHeightChangeFlag: ff,
		getHeightChangeFlag: () => Hh
	};
}));
// node_modules/@lezer/common/dist/index.js
function Z_(e, t, n, r) {
	switch (e) {
		case -2: return n < t;
		case -1: return r >= t && n < t;
		case 0: return n < t && r > t;
		case 1: return n <= t && r > t;
		case 2: return r > t;
		case 4: return !0;
	}
}
function Q_(e, t, n, r) {
	for (; e.from == e.to || (n < 1 ? e.from >= t : e.from > t) || (n > -1 ? e.to <= t : e.to < t);) {
		let t = !r && e instanceof xv && e.index < 0 ? null : e.parent;
		if (!t) return e;
		e = t;
	}
	let i = r ? 0 : gv.IgnoreOverlays;
	if (r) for (let r = e, a = r.parent; a; r = a, a = r.parent) r instanceof xv && r.index < 0 && a.enter(t, n, i)?.from != r.from && (e = a);
	for (;;) {
		let r = e.enter(t, n, i);
		if (!r) return e;
		e = r;
	}
}
function $_(e, t, n, r) {
	let i = e.cursor(), a = [];
	if (!i.firstChild()) return a;
	if (n != null) {
		for (let e = !1; !e;) if (e = i.type.is(n), !i.nextSibling()) return a;
	}
	for (;;) {
		if (r != null && i.type.is(r)) return a;
		if (i.type.is(t) && a.push(i.node), !i.nextSibling()) return r == null ? a : [];
	}
}
function ev(e, t, n = t.length - 1) {
	for (let r = e; n >= 0; r = r.parent) {
		if (!r) return !1;
		if (!r.type.isAnonymous) {
			if (t[n] && t[n] != r.name) return !1;
			n--;
		}
	}
	return !0;
}
function tv(e) {
	if (!e.length) return null;
	let t = 0, n = e[0];
	for (let r = 1; r < e.length; r++) {
		let i = e[r];
		(i.from > n.from || i.to < n.to) && (n = i, t = r);
	}
	let r = n instanceof xv && n.index < 0 ? null : n.parent, i = e.slice();
	return r ? i[t] = r : i.splice(t, 1), new wv(i, n);
}
function nv(e, t, n) {
	let r = e.resolveInner(t, n), i = null;
	for (let e = r instanceof xv ? r : r.context.parent; e; e = e.parent) if (e.index < 0) {
		let a = e.parent;
		(i ||= [r]).push(a.resolve(t, n)), e = a;
	} else {
		let a = uv.get(e.tree);
		if (a && a.overlay && a.overlay[0].from <= t && a.overlay[a.overlay.length - 1].to >= t) {
			let o = new xv(a.tree, a.overlay[0].from + e.from, -1, e);
			(i ||= [r]).push(Q_(o, t, n, !1));
		}
	}
	return i ? tv(i) : r;
}
function rv(e) {
	return e.children.some((e) => e instanceof yv || !e.type.isAnonymous || rv(e));
}
function iv(e) {
	let { buffer: t, nodeSet: n, maxBufferLength: r = sv, reused: i = [], minRepeatType: a = n.types.length } = e, o = Array.isArray(t) ? new vv(t, t.length) : t, s = n.types, c = 0, l = 0;
	function u(e, t, _, v, y, b) {
		let { id: x, start: S, end: C, size: w } = o, ee = l, te = c;
		if (w < 0) {
			if (o.next(), w == -1) {
				let t = i[x];
				_.push(t), v.push(S - e);
				return;
			}
			if (w == -3) {
				c = x;
				return;
			}
			if (w == -4) {
				l = x;
				return;
			}
			throw RangeError(`Unrecognized record size: ${w}`);
		}
		let ne = s[x], T, re, ie = S - e;
		if (C - S <= r && (re = h(o.pos - t, y))) {
			let t = new Uint16Array(re.size - re.skip), r = o.pos - re.size, i = t.length;
			for (; o.pos > r;) i = g(re.start, t, i);
			T = new yv(t, C - re.start, n), ie = re.start - e;
		} else {
			let e = o.pos - w;
			o.next();
			let t = [], s = [], c = x >= a ? x : -1, h = 0, g = C, _ = ee;
			for (; o.pos > e;) c >= 0 && o.id == c && o.size >= 0 ? (o.end <= g - r && (p(t, s, S, h, o.end, g, c, _, te), h = t.length, g = o.end, _ = l), o.next()) : b > 2500 ? d(S, e, t, s) : (c >= 0 && o.size == -1 && i[o.id].type == n.types[c] && (h < t.length && p(t, s, S, h, o.end, g, c, _, te), h = t.length + 1, g = o.start, _ = l), u(S, e, t, s, c, b + 1));
			if (c >= 0 && h > 0 && h < t.length && p(t, s, S, h, S, g, c, _, te), t.reverse(), s.reverse(), c > -1 && h > 0) {
				let e = f(ne, te);
				T = ov(ne, t, s, 0, t.length, 0, C - S, e, e);
			} else T = m(ne, t, s, C - S, ee - C, te);
		}
		_.push(T), v.push(ie);
	}
	function d(e, t, i, a) {
		let s = [], c = 0, l = -1;
		for (; o.pos > t;) {
			let { id: e, start: t, end: n, size: i } = o;
			if (i > 4) o.next();
			else if (l > -1 && t < l) break;
			else l < 0 && (l = n - r), s.push(e, t, n), c++, o.next();
		}
		if (c) {
			let t = new Uint16Array(c * 4), r = s[s.length - 2];
			for (let e = s.length - 3, n = 0; e >= 0; e -= 3) t[n++] = s[e], t[n++] = s[e + 1] - r, t[n++] = s[e + 2] - r, t[n++] = n;
			i.push(new yv(t, s[2] - r, n)), a.push(r - e);
		}
	}
	function f(e, t) {
		return (n, r, i) => {
			let a = 0, o = n.length - 1, s, c;
			if (o >= 0 && (s = n[o]) instanceof _v) {
				if (!o && s.type == e && s.length == i) return s;
				(c = s.prop(Z.lookAhead)) && (a = r[o] + s.length + c - i);
			}
			return m(e, n, r, i, a, t);
		};
	}
	function p(e, t, r, i, a, o, s, c, l) {
		let u = [], d = [];
		for (; e.length > i;) u.push(e.pop()), d.push(t.pop() + r - a);
		e.push(m(n.types[s], u, d, o - a, c - o, l)), t.push(a - r);
	}
	function m(e, t, n, r, i, a, o) {
		if (a) {
			let e = [Z.contextHash, a];
			o = o ? [e].concat(o) : [e];
		}
		if (i > 25) {
			let e = [Z.lookAhead, i];
			o = o ? [e].concat(o) : [e];
		}
		return new _v(e, t, n, r, o);
	}
	function h(e, t) {
		let n = o.fork(), i = 0, s = 0, c = 0, l = n.end - r, u = {
			size: 0,
			start: 0,
			skip: 0
		};
		scan: for (let r = n.pos - e; n.pos > r;) {
			let e = n.size;
			if (n.id == t && e >= 0) {
				u.size = i, u.start = s, u.skip = c, c += 4, i += 4, n.next();
				continue;
			}
			let o = n.pos - e;
			if (e < 0 || o < r || n.start < l) break;
			let d = n.id >= a ? 4 : 0, f = n.start;
			for (n.next(); n.pos > o;) {
				if (n.size < 0) {
					if (n.size == -3 || n.size == -4) d += 4;
					else break scan;
				} else n.id >= a && (d += 4);
				n.next();
			}
			s = f, i += e, c += d;
		}
		return (t < 0 || i == e) && (u.size = i, u.start = s, u.skip = c), u.size > 4 ? u : void 0;
	}
	function g(e, t, n) {
		let { id: r, start: i, end: s, size: u } = o;
		if (o.next(), u >= 0 && r < a) {
			let a = n;
			if (u > 4) {
				let r = o.pos - (u - 4);
				for (; o.pos > r;) n = g(e, t, n);
			}
			t[--n] = a, t[--n] = s - e, t[--n] = i - e, t[--n] = r;
		} else u == -3 ? c = r : u == -4 && (l = r);
		return n;
	}
	let _ = [], v = [];
	for (; o.pos > 0;) u(e.start || 0, e.bufferStart || 0, _, v, -1, 0);
	let y = e.length ?? (_.length ? v[0] + _[0].length : 0);
	return new _v(s[e.topID], _.reverse(), v.reverse(), y);
}
function av(e, t) {
	if (!e.isAnonymous || t instanceof yv || t.type != e) return 1;
	let n = Ev.get(t);
	if (n == null) {
		n = 1;
		for (let r of t.children) {
			if (r.type != e || !(r instanceof _v)) {
				n = 1;
				break;
			}
			n += av(e, r);
		}
		Ev.set(t, n);
	}
	return n;
}
function ov(e, t, n, r, i, a, o, s, c) {
	let l = 0;
	for (let n = r; n < i; n++) l += av(e, t[n]);
	let u = Math.ceil(l * 1.5 / 8), d = [], f = [];
	function p(t, n, r, i, o) {
		for (let s = r; s < i;) {
			let r = s, l = n[s], m = av(e, t[s]);
			for (s++; s < i; s++) {
				let n = av(e, t[s]);
				if (m + n >= u) break;
				m += n;
			}
			if (s == r + 1) {
				if (m > u) {
					let e = t[r];
					p(e.children, e.positions, 0, e.children.length, n[r] + o);
					continue;
				}
				d.push(t[r]);
			} else {
				let i = n[s - 1] + t[s - 1].length - l;
				d.push(ov(e, t, n, r, s, l, i, null, c));
			}
			f.push(l + o - a);
		}
	}
	return p(t, n, r, i, 0), (s || c)(d, f, o);
}
var sv, cv, lv, Z, uv, dv, fv, pv, mv, hv, gv, _v, vv, yv, bv, xv, Sv, Cv, wv, Tv, Ev, Dv, Ov, kv, Av, jv = t((() => {
	sv = 1024, cv = 0, lv = class {
		constructor(e, t) {
			this.from = e, this.to = t;
		}
	}, Z = class {
		constructor(e = {}) {
			this.id = cv++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
				throw Error("This node type doesn't define a deserialize function");
			}), this.combine = e.combine || null;
		}
		add(e) {
			if (this.perNode) throw RangeError("Can't add per-node props to node types");
			return typeof e != "function" && (e = fv.match(e)), (t) => {
				let n = e(t);
				return n === void 0 ? null : [this, n];
			};
		}
	}, Z.closedBy = new Z({ deserialize: (e) => e.split(" ") }), Z.openedBy = new Z({ deserialize: (e) => e.split(" ") }), Z.group = new Z({ deserialize: (e) => e.split(" ") }), Z.isolate = new Z({ deserialize: (e) => {
		if (e && e != "rtl" && e != "ltr" && e != "auto") throw RangeError("Invalid value for isolate: " + e);
		return e || "auto";
	} }), Z.contextHash = new Z({ perNode: !0 }), Z.lookAhead = new Z({ perNode: !0 }), Z.mounted = new Z({ perNode: !0 }), uv = class {
		constructor(e, t, n, r = !1) {
			this.tree = e, this.overlay = t, this.parser = n, this.bracketed = r;
		}
		static get(e) {
			return e && e.props && e.props[Z.mounted.id];
		}
	}, dv = Object.create(null), fv = class e {
		constructor(e, t, n, r = 0) {
			this.name = e, this.props = t, this.id = n, this.flags = r;
		}
		static define(t) {
			let n = t.props && t.props.length ? Object.create(null) : dv, r = +!!t.top | (t.skipped ? 2 : 0) | (t.error ? 4 : 0) | (t.name == null ? 8 : 0), i = new e(t.name || "", n, t.id, r);
			if (t.props) {
				for (let e of t.props) if (Array.isArray(e) || (e = e(i)), e) {
					if (e[0].perNode) throw RangeError("Can't store a per-node prop on a node type");
					n[e[0].id] = e[1];
				}
			}
			return i;
		}
		prop(e) {
			return this.props[e.id];
		}
		get isTop() {
			return (this.flags & 1) > 0;
		}
		get isSkipped() {
			return (this.flags & 2) > 0;
		}
		get isError() {
			return (this.flags & 4) > 0;
		}
		get isAnonymous() {
			return (this.flags & 8) > 0;
		}
		is(e) {
			if (typeof e == "string") {
				if (this.name == e) return !0;
				let t = this.prop(Z.group);
				return t ? t.indexOf(e) > -1 : !1;
			}
			return this.id == e;
		}
		static match(e) {
			let t = Object.create(null);
			for (let n in e) for (let r of n.split(" ")) t[r] = e[n];
			return (e) => {
				for (let n = e.prop(Z.group), r = -1; r < (n ? n.length : 0); r++) {
					let i = t[r < 0 ? e.name : n[r]];
					if (i) return i;
				}
			};
		}
	}, fv.none = new fv("", Object.create(null), 0, 8), pv = class e {
		constructor(e) {
			this.types = e;
			for (let t = 0; t < e.length; t++) if (e[t].id != t) throw RangeError("Node type ids should correspond to array positions when creating a node set");
		}
		extend(...t) {
			let n = [];
			for (let e of this.types) {
				let r = null;
				for (let n of t) {
					let t = n(e);
					if (t) {
						r ||= Object.assign({}, e.props);
						let n = t[1], i = t[0];
						i.combine && i.id in r && (n = i.combine(r[i.id], n)), r[i.id] = n;
					}
				}
				n.push(r ? new fv(e.name, r, e.id, e.flags) : e);
			}
			return new e(n);
		}
	}, mv = /* @__PURE__ */ new WeakMap(), hv = /* @__PURE__ */ new WeakMap(), (function(e) {
		e[e.ExcludeBuffers = 1] = "ExcludeBuffers", e[e.IncludeAnonymous = 2] = "IncludeAnonymous", e[e.IgnoreMounts = 4] = "IgnoreMounts", e[e.IgnoreOverlays = 8] = "IgnoreOverlays", e[e.EnterBracketed = 16] = "EnterBracketed";
	})(gv ||= {}), _v = class e {
		constructor(e, t, n, r, i) {
			if (this.type = e, this.children = t, this.positions = n, this.length = r, this.props = null, i && i.length) {
				this.props = Object.create(null);
				for (let [e, t] of i) this.props[typeof e == "number" ? e : e.id] = t;
			}
		}
		toString() {
			let e = uv.get(this);
			if (e && !e.overlay) return e.tree.toString();
			let t = "";
			for (let e of this.children) {
				let n = e.toString();
				n && (t && (t += ","), t += n);
			}
			return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
		}
		cursor(e = 0) {
			return new Tv(this.topNode, e);
		}
		cursorAt(e, t = 0, n = 0) {
			let r = mv.get(this) || this.topNode, i = new Tv(r);
			return i.moveTo(e, t), mv.set(this, i._tree), i;
		}
		get topNode() {
			return new xv(this, 0, 0, null);
		}
		resolve(e, t = 0) {
			let n = Q_(mv.get(this) || this.topNode, e, t, !1);
			return mv.set(this, n), n;
		}
		resolveInner(e, t = 0) {
			let n = Q_(hv.get(this) || this.topNode, e, t, !0);
			return hv.set(this, n), n;
		}
		resolveStack(e, t = 0) {
			return nv(this, e, t);
		}
		iterate(e) {
			let { enter: t, leave: n, from: r = 0, to: i = this.length } = e, a = e.mode || 0, o = (a & gv.IncludeAnonymous) > 0;
			for (let e = this.cursor(a | gv.IncludeAnonymous);;) {
				let a = !1;
				if (e.from <= i && e.to >= r && (!o && e.type.isAnonymous || t(e) !== !1)) {
					if (e.firstChild()) continue;
					a = !0;
				}
				for (; a && n && (o || !e.type.isAnonymous) && n(e), !e.nextSibling();) {
					if (!e.parent()) return;
					a = !0;
				}
			}
		}
		prop(e) {
			return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
		}
		get propValues() {
			let e = [];
			if (this.props) for (let t in this.props) e.push([+t, this.props[t]]);
			return e;
		}
		balance(t = {}) {
			return this.children.length <= 8 ? this : ov(fv.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, n, r) => new e(this.type, t, n, r, this.propValues), t.makeTree || ((t, n, r) => new e(fv.none, t, n, r)));
		}
		static build(e) {
			return iv(e);
		}
	}, _v.empty = new _v(fv.none, [], [], 0), vv = class e {
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
			return new e(this.buffer, this.index);
		}
	}, yv = class e {
		constructor(e, t, n) {
			this.buffer = e, this.length = t, this.set = n;
		}
		get type() {
			return fv.none;
		}
		toString() {
			let e = [];
			for (let t = 0; t < this.buffer.length;) e.push(this.childString(t)), t = this.buffer[t + 3];
			return e.join(",");
		}
		childString(e) {
			let t = this.buffer[e], n = this.buffer[e + 3], r = this.set.types[t], i = r.name;
			if (/\W/.test(i) && !r.isError && (i = JSON.stringify(i)), e += 4, n == e) return i;
			let a = [];
			for (; e < n;) a.push(this.childString(e)), e = this.buffer[e + 3];
			return i + "(" + a.join(",") + ")";
		}
		findChild(e, t, n, r, i) {
			let { buffer: a } = this, o = -1;
			for (let s = e; s != t && !(Z_(i, r, a[s + 1], a[s + 2]) && (o = s, n > 0)); s = a[s + 3]);
			return o;
		}
		slice(t, n, r) {
			let i = this.buffer, a = new Uint16Array(n - t), o = 0;
			for (let e = t, s = 0; e < n;) {
				a[s++] = i[e++], a[s++] = i[e++] - r;
				let n = a[s++] = i[e++] - r;
				a[s++] = i[e++] - t, o = Math.max(o, n);
			}
			return new e(a, o, this.set);
		}
	}, bv = class {
		cursor(e = 0) {
			return new Tv(this, e);
		}
		getChild(e, t = null, n = null) {
			let r = $_(this, e, t, n);
			return r.length ? r[0] : null;
		}
		getChildren(e, t = null, n = null) {
			return $_(this, e, t, n);
		}
		resolve(e, t = 0) {
			return Q_(this, e, t, !1);
		}
		resolveInner(e, t = 0) {
			return Q_(this, e, t, !0);
		}
		matchContext(e) {
			return ev(this.parent, e);
		}
		enterUnfinishedNodesBefore(e) {
			let t = this.childBefore(e), n = this;
			for (; t;) {
				let e = t.lastChild;
				if (!e || e.to != t.to) break;
				e.type.isError && e.from == e.to ? (n = t, t = e.prevSibling) : t = e;
			}
			return n;
		}
		get node() {
			return this;
		}
		get next() {
			return this.parent;
		}
	}, xv = class e extends bv {
		constructor(e, t, n, r) {
			super(), this._tree = e, this.from = t, this.index = n, this._parent = r;
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
		nextChild(t, n, r, i, a = 0) {
			for (let o = this;;) {
				for (let { children: s, positions: c } = o._tree, l = n > 0 ? s.length : -1; t != l; t += n) {
					let l = s[t], u = c[t] + o.from, d;
					if (a & gv.EnterBracketed && l instanceof _v && (d = uv.get(l)) && !d.overlay && d.bracketed && r >= u && r <= u + l.length || Z_(i, r, u, u + l.length)) {
						if (l instanceof yv) {
							if (a & gv.ExcludeBuffers) continue;
							let e = l.findChild(0, l.buffer.length, n, r - u, i);
							if (e > -1) return new Cv(new Sv(o, l, t, u), null, e);
						} else if (a & gv.IncludeAnonymous || !l.type.isAnonymous || rv(l)) {
							let s;
							if (!(a & gv.IgnoreMounts) && (s = uv.get(l)) && !s.overlay) return new e(s.tree, u, t, o);
							let c = new e(l, u, t, o);
							return a & gv.IncludeAnonymous || !c.type.isAnonymous ? c : c.nextChild(n < 0 ? l.children.length - 1 : 0, n, r, i, a);
						}
					}
				}
				if (a & gv.IncludeAnonymous || !o.type.isAnonymous || (t = o.index >= 0 ? o.index + n : n < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o)) return null;
			}
		}
		get firstChild() {
			return this.nextChild(0, 1, 0, 4);
		}
		get lastChild() {
			return this.nextChild(this._tree.children.length - 1, -1, 0, 4);
		}
		childAfter(e) {
			return this.nextChild(0, 1, e, 2);
		}
		childBefore(e) {
			return this.nextChild(this._tree.children.length - 1, -1, e, -2);
		}
		prop(e) {
			return this._tree.prop(e);
		}
		enter(t, n, r = 0) {
			let i;
			if (!(r & gv.IgnoreOverlays) && (i = uv.get(this._tree)) && i.overlay) {
				let a = t - this.from, o = r & gv.EnterBracketed && i.bracketed;
				for (let { from: t, to: r } of i.overlay) if ((n > 0 || o ? t <= a : t < a) && (n < 0 || o ? r >= a : r > a)) return new e(i.tree, i.overlay[0].from + this.from, -1, this);
			}
			return this.nextChild(0, 1, t, n, r);
		}
		nextSignificantParent() {
			let e = this;
			for (; e.type.isAnonymous && e._parent;) e = e._parent;
			return e;
		}
		get parent() {
			return this._parent ? this._parent.nextSignificantParent() : null;
		}
		get nextSibling() {
			return this._parent && this.index >= 0 ? this._parent.nextChild(this.index + 1, 1, 0, 4) : null;
		}
		get prevSibling() {
			return this._parent && this.index >= 0 ? this._parent.nextChild(this.index - 1, -1, 0, 4) : null;
		}
		get tree() {
			return this._tree;
		}
		toTree() {
			return this._tree;
		}
		toString() {
			return this._tree.toString();
		}
	}, Sv = class {
		constructor(e, t, n, r) {
			this.parent = e, this.buffer = t, this.index = n, this.start = r;
		}
	}, Cv = class e extends bv {
		get name() {
			return this.type.name;
		}
		get from() {
			return this.context.start + this.context.buffer.buffer[this.index + 1];
		}
		get to() {
			return this.context.start + this.context.buffer.buffer[this.index + 2];
		}
		constructor(e, t, n) {
			super(), this.context = e, this._parent = t, this.index = n, this.type = e.buffer.set.types[e.buffer.buffer[n]];
		}
		child(t, n, r) {
			let { buffer: i } = this.context, a = i.findChild(this.index + 4, i.buffer[this.index + 3], t, n - this.context.start, r);
			return a < 0 ? null : new e(this.context, this, a);
		}
		get firstChild() {
			return this.child(1, 0, 4);
		}
		get lastChild() {
			return this.child(-1, 0, 4);
		}
		childAfter(e) {
			return this.child(1, e, 2);
		}
		childBefore(e) {
			return this.child(-1, e, -2);
		}
		prop(e) {
			return this.type.prop(e);
		}
		enter(t, n, r = 0) {
			if (r & gv.ExcludeBuffers) return null;
			let { buffer: i } = this.context, a = i.findChild(this.index + 4, i.buffer[this.index + 3], n > 0 ? 1 : -1, t - this.context.start, n);
			return a < 0 ? null : new e(this.context, this, a);
		}
		get parent() {
			return this._parent || this.context.parent.nextSignificantParent();
		}
		externalSibling(e) {
			return this._parent ? null : this.context.parent.nextChild(this.context.index + e, e, 0, 4);
		}
		get nextSibling() {
			let { buffer: t } = this.context, n = t.buffer[this.index + 3];
			return n < (this._parent ? t.buffer[this._parent.index + 3] : t.buffer.length) ? new e(this.context, this._parent, n) : this.externalSibling(1);
		}
		get prevSibling() {
			let { buffer: t } = this.context, n = this._parent ? this._parent.index + 4 : 0;
			return this.index == n ? this.externalSibling(-1) : new e(this.context, this._parent, t.findChild(n, this.index, -1, 0, 4));
		}
		get tree() {
			return null;
		}
		toTree() {
			let e = [], t = [], { buffer: n } = this.context, r = this.index + 4, i = n.buffer[this.index + 3];
			if (i > r) {
				let a = n.buffer[this.index + 1];
				e.push(n.slice(r, i, a)), t.push(0);
			}
			return new _v(this.type, e, t, this.to - this.from);
		}
		toString() {
			return this.context.buffer.childString(this.index);
		}
	}, wv = class {
		constructor(e, t) {
			this.heads = e, this.node = t;
		}
		get next() {
			return tv(this.heads);
		}
	}, Tv = class {
		get name() {
			return this.type.name;
		}
		constructor(e, t = 0) {
			if (this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, this.mode = t & ~gv.EnterBracketed, e instanceof xv) this.yieldNode(e);
			else {
				this._tree = e.context.parent, this.buffer = e.context;
				for (let t = e._parent; t; t = t._parent) this.stack.unshift(t.index);
				this.bufferNode = e, this.yieldBuf(e.index);
			}
		}
		yieldNode(e) {
			return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
		}
		yieldBuf(e, t) {
			this.index = e;
			let { start: n, buffer: r } = this.buffer;
			return this.type = t || r.set.types[r.buffer[e]], this.from = n + r.buffer[e + 1], this.to = n + r.buffer[e + 2], !0;
		}
		yield(e) {
			return e ? e instanceof xv ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
		}
		toString() {
			return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
		}
		enterChild(e, t, n) {
			if (!this.buffer) return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, n, this.mode));
			let { buffer: r } = this.buffer, i = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.buffer.start, n);
			return i < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(i));
		}
		firstChild() {
			return this.enterChild(1, 0, 4);
		}
		lastChild() {
			return this.enterChild(-1, 0, 4);
		}
		childAfter(e) {
			return this.enterChild(1, e, 2);
		}
		childBefore(e) {
			return this.enterChild(-1, e, -2);
		}
		enter(e, t, n = this.mode) {
			return this.buffer ? n & gv.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, n));
		}
		parent() {
			if (!this.buffer) return this.yieldNode(this.mode & gv.IncludeAnonymous ? this._tree._parent : this._tree.parent);
			if (this.stack.length) return this.yieldBuf(this.stack.pop());
			let e = this.mode & gv.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
			return this.buffer = null, this.yieldNode(e);
		}
		sibling(e) {
			if (!this.buffer) return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
			let { buffer: t } = this.buffer, n = this.stack.length - 1;
			if (e < 0) {
				let e = n < 0 ? 0 : this.stack[n] + 4;
				if (this.index != e) return this.yieldBuf(t.findChild(e, this.index, -1, 0, 4));
			} else {
				let e = t.buffer[this.index + 3];
				if (e < (n < 0 ? t.buffer.length : t.buffer[this.stack[n] + 3])) return this.yieldBuf(e);
			}
			return n < 0 && this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode));
		}
		nextSibling() {
			return this.sibling(1);
		}
		prevSibling() {
			return this.sibling(-1);
		}
		atLastNode(e) {
			let t, n, { buffer: r } = this;
			if (r) {
				if (e > 0) {
					if (this.index < r.buffer.buffer.length) return !1;
				} else for (let e = 0; e < this.index; e++) if (r.buffer.buffer[e + 3] < this.index) return !1;
				({index: t, parent: n} = r);
			} else ({index: t, _parent: n} = this._tree);
			for (; n; {index: t, _parent: n} = n) if (t > -1) for (let r = t + e, i = e < 0 ? -1 : n._tree.children.length; r != i; r += e) {
				let e = n._tree.children[r];
				if (this.mode & gv.IncludeAnonymous || e instanceof yv || !e.type.isAnonymous || rv(e)) return !1;
			}
			return !0;
		}
		move(e, t) {
			if (t && this.enterChild(e, 0, 4)) return !0;
			for (;;) {
				if (this.sibling(e)) return !0;
				if (this.atLastNode(e) || !this.parent()) return !1;
			}
		}
		next(e = !0) {
			return this.move(1, e);
		}
		prev(e = !0) {
			return this.move(-1, e);
		}
		moveTo(e, t = 0) {
			for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(););
			for (; this.enterChild(1, e, t););
			return this;
		}
		get node() {
			if (!this.buffer) return this._tree;
			let e = this.bufferNode, t = null, n = 0;
			if (e && e.context == this.buffer) scan: for (let r = this.index, i = this.stack.length; i >= 0;) {
				for (let a = e; a; a = a._parent) if (a.index == r) {
					if (r == this.index) return a;
					t = a, n = i + 1;
					break scan;
				}
				r = this.stack[--i];
			}
			for (let e = n; e < this.stack.length; e++) t = new Cv(this.buffer, t, this.stack[e]);
			return this.bufferNode = new Cv(this.buffer, t, this.index);
		}
		get tree() {
			return this.buffer ? null : this._tree._tree;
		}
		iterate(e, t) {
			for (let n = 0;;) {
				let r = !1;
				if (this.type.isAnonymous || e(this) !== !1) {
					if (this.firstChild()) {
						n++;
						continue;
					}
					this.type.isAnonymous || (r = !0);
				}
				for (;;) {
					if (r && t && t(this), r = this.type.isAnonymous, !n) return;
					if (this.nextSibling()) break;
					this.parent(), n--, r = !0;
				}
			}
		}
		matchContext(e) {
			if (!this.buffer) return ev(this.node.parent, e);
			let { buffer: t } = this.buffer, { types: n } = t.set;
			for (let r = e.length - 1, i = this.stack.length - 1; r >= 0; i--) {
				if (i < 0) return ev(this._tree, e, r);
				let a = n[t.buffer[this.stack[i]]];
				if (!a.isAnonymous) {
					if (e[r] && e[r] != a.name) return !1;
					r--;
				}
			}
			return !0;
		}
	}, Ev = /* @__PURE__ */ new WeakMap(), Dv = class {
		constructor() {
			this.map = /* @__PURE__ */ new WeakMap();
		}
		setBuffer(e, t, n) {
			let r = this.map.get(e);
			r || this.map.set(e, r = /* @__PURE__ */ new Map()), r.set(t, n);
		}
		getBuffer(e, t) {
			let n = this.map.get(e);
			return n && n.get(t);
		}
		set(e, t) {
			e instanceof Cv ? this.setBuffer(e.context.buffer, e.index, t) : e instanceof xv && this.map.set(e.tree, t);
		}
		get(e) {
			return e instanceof Cv ? this.getBuffer(e.context.buffer, e.index) : e instanceof xv ? this.map.get(e.tree) : void 0;
		}
		cursorSet(e, t) {
			e.buffer ? this.setBuffer(e.buffer.buffer, e.index, t) : this.map.set(e.tree, t);
		}
		cursorGet(e) {
			return e.buffer ? this.getBuffer(e.buffer.buffer, e.index) : this.map.get(e.tree);
		}
	}, Ov = class e {
		constructor(e, t, n, r, i = !1, a = !1) {
			this.from = e, this.to = t, this.tree = n, this.offset = r, this.open = !!i | (a ? 2 : 0);
		}
		get openStart() {
			return (this.open & 1) > 0;
		}
		get openEnd() {
			return (this.open & 2) > 0;
		}
		static addTree(t, n = [], r = !1) {
			let i = [new e(0, t.length, t, 0, !1, r)];
			for (let e of n) e.to > t.length && i.push(e);
			return i;
		}
		static applyChanges(t, n, r = 128) {
			if (!n.length) return t;
			let i = [], a = 1, o = t.length ? t[0] : null;
			for (let s = 0, c = 0, l = 0;; s++) {
				let u = s < n.length ? n[s] : null, d = u ? u.fromA : 1e9;
				if (d - c >= r) for (; o && o.from < d;) {
					let n = o;
					if (c >= n.from || d <= n.to || l) {
						let t = Math.max(n.from, c) - l, r = Math.min(n.to, d) - l;
						n = t >= r ? null : new e(t, r, n.tree, n.offset + l, s > 0, !!u);
					}
					if (n && i.push(n), o.to > d) break;
					o = a < t.length ? t[a++] : null;
				}
				if (!u) break;
				c = u.toA, l = u.toA - u.toB;
			}
			return i;
		}
	}, kv = class {
		startParse(e, t, n) {
			return typeof e == "string" && (e = new Av(e)), n = n ? n.length ? n.map((e) => new lv(e.from, e.to)) : [new lv(0, 0)] : [new lv(0, e.length)], this.createParse(e, t || [], n);
		}
		parse(e, t, n) {
			let r = this.startParse(e, t, n);
			for (;;) {
				let e = r.advance();
				if (e) return e;
			}
		}
	}, Av = class {
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
	}, new Z({ perNode: !0 });
})), Mv = /* @__PURE__ */ n({
	Tag: () => Hv,
	classHighlighter: () => cy,
	getStyleTags: () => Bv,
	highlightCode: () => zv,
	highlightTree: () => Rv,
	styleTags: () => Fv,
	tagHighlighter: () => Iv,
	tags: () => $
});
function Nv(e, t) {
	return e.length == t.length && e.every((e, n) => e == t[n]);
}
function Pv(e) {
	let t = [[]];
	for (let n = 0; n < e.length; n++) for (let r = 0, i = t.length; r < i; r++) t.push(t[r].concat(e[n]));
	return t.sort((e, t) => t.length - e.length);
}
function Fv(e) {
	let t = Object.create(null);
	for (let n in e) {
		let r = e[n];
		Array.isArray(r) || (r = [r]);
		for (let e of n.split(" ")) if (e) {
			let n = [], i = 2, a = e;
			for (let t = 0;;) {
				if (a == "..." && t > 0 && t + 3 == e.length) {
					i = 1;
					break;
				}
				let r = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(a);
				if (!r) throw RangeError("Invalid path: " + e);
				if (n.push(r[0] == "*" ? "" : r[0][0] == "\"" ? JSON.parse(r[0]) : r[0]), t += r[0].length, t == e.length) break;
				let o = e[t++];
				if (t == e.length && o == "!") {
					i = 0;
					break;
				}
				if (o != "/") throw RangeError("Invalid path: " + e);
				a = e.slice(t);
			}
			let o = n.length - 1, s = n[o];
			if (!s) throw RangeError("Invalid path: " + e);
			t[s] = new Kv(r, i, o > 0 ? n.slice(0, o) : null).sort(t[s]);
		}
	}
	return Gv.add(t);
}
function Iv(e, t) {
	let n = Object.create(null);
	for (let t of e) if (!Array.isArray(t.tag)) n[t.tag.id] = t.class;
	else for (let e of t.tag) n[e.id] = t.class;
	let { scope: r, all: i = null } = t || {};
	return {
		style: (e) => {
			let t = i;
			for (let r of e) for (let e of r.set) {
				let r = n[e.id];
				if (r) {
					t = t ? t + " " + r : r;
					break;
				}
			}
			return t;
		},
		scope: r
	};
}
function Lv(e, t) {
	let n = null;
	for (let r of e) {
		let e = r.style(t);
		e && (n = n ? n + " " + e : e);
	}
	return n;
}
function Rv(e, t, n, r = 0, i = e.length) {
	let a = new qv(r, Array.isArray(t) ? t : [t], n);
	a.highlightRange(e.cursor(), r, i, "", a.highlighters), a.flush(i);
}
function zv(e, t, n, r, i, a = 0, o = e.length) {
	let s = a;
	function c(t, n) {
		if (!(t <= s)) {
			for (let a = e.slice(s, t), o = 0;;) {
				let e = a.indexOf("\n", o), t = e < 0 ? a.length : e;
				if (t > o && r(a.slice(o, t), n), e < 0) break;
				i(), o = e + 1;
			}
			s = t;
		}
	}
	Rv(t, n, (e, t, n) => {
		c(e, ""), c(t, n);
	}, a, o), c(o, "");
}
function Bv(e) {
	let t = e.type.prop(Gv);
	for (; t && t.context && !e.matchContext(t.context);) t = t.next;
	return t || null;
}
var Vv, Hv, Uv, Wv, Gv, Kv, qv, Q, Jv, Yv, Xv, Zv, Qv, $v, ey, ty, ny, ry, iy, ay, oy, sy, $, cy, ly = t((() => {
	jv(), Vv = 0, Hv = class e {
		constructor(e, t, n, r) {
			this.name = e, this.set = t, this.base = n, this.modified = r, this.id = Vv++;
		}
		toString() {
			let { name: e } = this;
			for (let t of this.modified) t.name && (e = `${t.name}(${e})`);
			return e;
		}
		static define(t, n) {
			let r = typeof t == "string" ? t : "?";
			if (t instanceof e && (n = t), n?.base) throw Error("Can not derive from a modified tag");
			let i = new e(r, [], null, []);
			if (i.set.push(i), n) for (let e of n.set) i.set.push(e);
			return i;
		}
		static defineModifier(e) {
			let t = new Wv(e);
			return (e) => e.modified.indexOf(t) > -1 ? e : Wv.get(e.base || e, e.modified.concat(t).sort((e, t) => e.id - t.id));
		}
	}, Uv = 0, Wv = class e {
		constructor(e) {
			this.name = e, this.instances = [], this.id = Uv++;
		}
		static get(t, n) {
			if (!n.length) return t;
			let r = n[0].instances.find((e) => e.base == t && Nv(n, e.modified));
			if (r) return r;
			let i = [], a = new Hv(t.name, i, t, n);
			for (let e of n) e.instances.push(a);
			let o = Pv(n);
			for (let n of t.set) if (!n.modified.length) for (let t of o) i.push(e.get(n, t));
			return a;
		}
	}, Gv = new Z({ combine(e, t) {
		let n, r, i;
		for (; e || t;) {
			if (!e || t && e.depth <= t.depth ? (i = t, t = t.next) : (i = e, e = e.next), n && n.mode == i.mode && !i.context && !n.context) continue;
			let a = new Kv(i.tags, i.mode, i.context);
			n ? n.next = a : r = a, n = a;
		}
		return r;
	} }), Kv = class {
		constructor(e, t, n, r) {
			this.tags = e, this.mode = t, this.context = n, this.next = r;
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
	}, Kv.empty = new Kv([], 2, null), qv = class {
		constructor(e, t, n) {
			this.at = e, this.highlighters = t, this.span = n, this.class = "";
		}
		startSpan(e, t) {
			t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
		}
		flush(e) {
			e > this.at && this.class && this.span(this.at, e, this.class);
		}
		highlightRange(e, t, n, r, i) {
			let { type: a, from: o, to: s } = e;
			if (o >= n || s <= t) return;
			a.isTop && (i = this.highlighters.filter((e) => !e.scope || e.scope(a)));
			let c = r, l = Bv(e) || Kv.empty, u = Lv(i, l.tags);
			if (u && (c && (c += " "), c += u, l.mode == 1 && (r += (r ? " " : "") + u)), this.startSpan(Math.max(t, o), c), l.opaque) return;
			let d = e.tree && e.tree.prop(Z.mounted);
			if (d && d.overlay) {
				let a = e.node.enter(d.overlay[0].from + o, 1), l = this.highlighters.filter((e) => !e.scope || e.scope(d.tree.type)), u = e.firstChild();
				for (let f = 0, p = o;; f++) {
					let m = f < d.overlay.length ? d.overlay[f] : null, h = m ? m.from + o : s, g = Math.max(t, p), _ = Math.min(n, h);
					if (g < _ && u) for (; e.from < _ && (this.highlightRange(e, g, _, r, i), this.startSpan(Math.min(_, e.to), c), !(e.to >= h || !e.nextSibling())););
					if (!m || h > n) break;
					p = m.to + o, p > t && (this.highlightRange(a.cursor(), Math.max(t, m.from + o), Math.min(n, p), "", l), this.startSpan(Math.min(n, p), c));
				}
				u && e.parent();
			} else if (e.firstChild()) {
				d && (r = "");
				do
					if (!(e.to <= t)) {
						if (e.from >= n) break;
						this.highlightRange(e, t, n, r, i), this.startSpan(Math.min(n, e.to), c);
					}
				while (e.nextSibling());
				e.parent();
			}
		}
	}, Q = Hv.define, Jv = Q(), Yv = Q(), Xv = Q(Yv), Zv = Q(Yv), Qv = Q(), $v = Q(Qv), ey = Q(Qv), ty = Q(), ny = Q(ty), ry = Q(), iy = Q(), ay = Q(), oy = Q(ay), sy = Q(), $ = {
		comment: Jv,
		lineComment: Q(Jv),
		blockComment: Q(Jv),
		docComment: Q(Jv),
		name: Yv,
		variableName: Q(Yv),
		typeName: Xv,
		tagName: Q(Xv),
		propertyName: Zv,
		attributeName: Q(Zv),
		className: Q(Yv),
		labelName: Q(Yv),
		namespace: Q(Yv),
		macroName: Q(Yv),
		literal: Qv,
		string: $v,
		docString: Q($v),
		character: Q($v),
		attributeValue: Q($v),
		number: ey,
		integer: Q(ey),
		float: Q(ey),
		bool: Q(Qv),
		regexp: Q(Qv),
		escape: Q(Qv),
		color: Q(Qv),
		url: Q(Qv),
		keyword: ry,
		self: Q(ry),
		null: Q(ry),
		atom: Q(ry),
		unit: Q(ry),
		modifier: Q(ry),
		operatorKeyword: Q(ry),
		controlKeyword: Q(ry),
		definitionKeyword: Q(ry),
		moduleKeyword: Q(ry),
		operator: iy,
		derefOperator: Q(iy),
		arithmeticOperator: Q(iy),
		logicOperator: Q(iy),
		bitwiseOperator: Q(iy),
		compareOperator: Q(iy),
		updateOperator: Q(iy),
		definitionOperator: Q(iy),
		typeOperator: Q(iy),
		controlOperator: Q(iy),
		punctuation: ay,
		separator: Q(ay),
		bracket: oy,
		angleBracket: Q(oy),
		squareBracket: Q(oy),
		paren: Q(oy),
		brace: Q(oy),
		content: ty,
		heading: ny,
		heading1: Q(ny),
		heading2: Q(ny),
		heading3: Q(ny),
		heading4: Q(ny),
		heading5: Q(ny),
		heading6: Q(ny),
		contentSeparator: Q(ty),
		list: Q(ty),
		quote: Q(ty),
		emphasis: Q(ty),
		strong: Q(ty),
		link: Q(ty),
		monospace: Q(ty),
		strikethrough: Q(ty),
		inserted: Q(),
		deleted: Q(),
		changed: Q(),
		invalid: Q(),
		meta: sy,
		documentMeta: Q(sy),
		annotation: Q(sy),
		processingInstruction: Q(sy),
		definition: Hv.defineModifier("definition"),
		constant: Hv.defineModifier("constant"),
		function: Hv.defineModifier("function"),
		standard: Hv.defineModifier("standard"),
		local: Hv.defineModifier("local"),
		special: Hv.defineModifier("special")
	};
	for (let e in $) {
		let t = $[e];
		t instanceof Hv && (t.name = e);
	}
	cy = Iv([
		{
			tag: $.link,
			class: "tok-link"
		},
		{
			tag: $.heading,
			class: "tok-heading"
		},
		{
			tag: $.emphasis,
			class: "tok-emphasis"
		},
		{
			tag: $.strong,
			class: "tok-strong"
		},
		{
			tag: $.keyword,
			class: "tok-keyword"
		},
		{
			tag: $.atom,
			class: "tok-atom"
		},
		{
			tag: $.bool,
			class: "tok-bool"
		},
		{
			tag: $.url,
			class: "tok-url"
		},
		{
			tag: $.labelName,
			class: "tok-labelName"
		},
		{
			tag: $.inserted,
			class: "tok-inserted"
		},
		{
			tag: $.deleted,
			class: "tok-deleted"
		},
		{
			tag: $.literal,
			class: "tok-literal"
		},
		{
			tag: $.string,
			class: "tok-string"
		},
		{
			tag: $.number,
			class: "tok-number"
		},
		{
			tag: [
				$.regexp,
				$.escape,
				$.special($.string)
			],
			class: "tok-string2"
		},
		{
			tag: $.variableName,
			class: "tok-variableName"
		},
		{
			tag: $.local($.variableName),
			class: "tok-variableName tok-local"
		},
		{
			tag: $.definition($.variableName),
			class: "tok-variableName tok-definition"
		},
		{
			tag: $.special($.variableName),
			class: "tok-variableName2"
		},
		{
			tag: $.definition($.propertyName),
			class: "tok-propertyName tok-definition"
		},
		{
			tag: $.typeName,
			class: "tok-typeName"
		},
		{
			tag: $.namespace,
			class: "tok-namespace"
		},
		{
			tag: $.className,
			class: "tok-className"
		},
		{
			tag: $.macroName,
			class: "tok-macroName"
		},
		{
			tag: $.propertyName,
			class: "tok-propertyName"
		},
		{
			tag: $.operator,
			class: "tok-operator"
		},
		{
			tag: $.comment,
			class: "tok-comment"
		},
		{
			tag: $.meta,
			class: "tok-meta"
		},
		{
			tag: $.invalid,
			class: "tok-invalid"
		},
		{
			tag: $.punctuation,
			class: "tok-punctuation"
		}
	]);
}));
// node_modules/@codemirror/streamparser/dist/index.js
function uy(e, t, n, r = 0, i = 0) {
	t ?? (t = e.search(/[^\s\u00a0]/), t == -1 && (t = e.length));
	let a = i;
	for (let i = r; i < t; i++) e.charCodeAt(i) == 9 ? a += n - a % n : a++;
	return a;
}
var dy, fy = t((() => {
	dy = class {
		constructor(e, t, n, r) {
			this.string = e, this.tabSize = t, this.indentUnit = n, this.overrideIndent = r, this.pos = 0, this.start = 0, this.lastColumnPos = 0, this.lastColumnValue = 0;
		}
		eol() {
			return this.pos >= this.string.length;
		}
		sol() {
			return this.pos == 0;
		}
		peek() {
			return this.string.charAt(this.pos) || void 0;
		}
		next() {
			if (this.pos < this.string.length) return this.string.charAt(this.pos++);
		}
		eat(e) {
			let t = this.string.charAt(this.pos), n;
			if (n = typeof e == "string" ? t == e : t && (e instanceof RegExp ? e.test(t) : e(t)), n) return ++this.pos, t;
		}
		eatWhile(e) {
			let t = this.pos;
			for (; this.eat(e););
			return this.pos > t;
		}
		eatSpace() {
			let e = this.pos;
			for (; /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++this.pos;
			return this.pos > e;
		}
		skipToEnd() {
			this.pos = this.string.length;
		}
		skipTo(e) {
			let t = this.string.indexOf(e, this.pos);
			if (t > -1) return this.pos = t, !0;
		}
		backUp(e) {
			this.pos -= e;
		}
		column() {
			return this.lastColumnPos < this.start && (this.lastColumnValue = uy(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue;
		}
		indentation() {
			return this.overrideIndent ?? uy(this.string, null, this.tabSize);
		}
		match(e, t, n) {
			if (typeof e == "string") {
				let r = (e) => n ? e.toLowerCase() : e;
				return r(this.string.substr(this.pos, e.length)) == r(e) ? (t !== !1 && (this.pos += e.length), !0) : null;
			}
			{
				let n = this.string.slice(this.pos).match(e);
				return n && n.index > 0 ? null : (n && t !== !1 && (this.pos += n[0].length), n);
			}
		}
		current() {
			return this.string.slice(this.start, this.pos);
		}
	};
})), py = /* @__PURE__ */ n({
	DocInput: () => kb,
	HighlightStyle: () => ux,
	IndentContext: () => Vb,
	LRLanguage: () => Ob,
	Language: () => Db,
	LanguageDescription: () => Rb,
	LanguageSupport: () => Lb,
	ParseContext: () => jb,
	StreamLanguage: () => Tx,
	StringStream: () => dy,
	TreeIndentContext: () => Ub,
	bidiIsolates: () => Sb,
	bracketMatching: () => ib,
	bracketMatchingHandle: () => Cx,
	codeFolding: () => Xy,
	continuedIndent: () => Fy,
	defaultHighlightStyle: () => hx,
	defineLanguageFacet: () => my,
	delimitedIndent: () => Ny,
	ensureSyntaxTree: () => _y,
	flatIndent: () => Wb,
	foldAll: () => $b,
	foldCode: () => Zb,
	foldEffect: () => Jb,
	foldGutter: () => Qy,
	foldInside: () => Ly,
	foldKeymap: () => nx,
	foldNodeProp: () => qb,
	foldService: () => Kb,
	foldState: () => Xb,
	foldable: () => By,
	foldedRanges: () => Wy,
	forceParsing: () => yy,
	getIndentUnit: () => Sy,
	getIndentation: () => wy,
	highlightingFor: () => tb,
	indentNodeProp: () => Hb,
	indentOnInput: () => Iy,
	indentRange: () => Ty,
	indentService: () => zb,
	indentString: () => Cy,
	indentUnit: () => Bb,
	language: () => Ib,
	languageDataProp: () => Tb,
	matchBrackets: () => sb,
	sublanguageProp: () => Eb,
	syntaxHighlighting: () => eb,
	syntaxParserRunning: () => by,
	syntaxTree: () => gy,
	syntaxTreeAvailable: () => vy,
	toggleFold: () => tx,
	unfoldAll: () => ex,
	unfoldCode: () => Qb,
	unfoldEffect: () => Yb
});
function my(e) {
	return q.define({ combine: e ? (t) => t.concat(e) : void 0 });
}
function hy(e, t, n) {
	let r = e.facet(Ib), i = gy(e).topNode;
	if (!r || r.allowsNesting) for (let e = i; e; e = e.enter(t, n, gv.ExcludeBuffers | gv.EnterBracketed)) e.type.isTop && (i = e);
	return i;
}
function gy(e) {
	let t = e.field(Db.state, !1);
	return t ? t.tree : _v.empty;
}
function _y(e, t, n = 50) {
	let r = e.field(Db.state, !1)?.context;
	if (!r) return null;
	let i = r.viewport;
	r.updateViewport({
		from: 0,
		to: t
	});
	let a = r.isDone(t) || r.work(n, t) ? r.tree : null;
	return r.updateViewport(i), a;
}
function vy(e, t = e.doc.length) {
	return e.field(Db.state, !1)?.context.isDone(t) || !1;
}
function yy(e, t = e.viewport.to, n = 100) {
	let r = _y(e.state, t, n);
	return r != gy(e.state) && e.dispatch({}), !!r;
}
function by(e) {
	return e.plugin(Fb)?.isWorking() || !1;
}
function xy(e, t, n) {
	return Ov.applyChanges(e, [{
		fromA: t,
		toA: n,
		fromB: t,
		toB: n
	}]);
}
function Sy(e) {
	let t = e.facet(Bb);
	return t.charCodeAt(0) == 9 ? e.tabSize * t.length : t.length;
}
function Cy(e, t) {
	let n = "", r = e.tabSize, i = e.facet(Bb)[0];
	if (i == "	") {
		for (; t >= r;) n += "	", t -= r;
		i = " ";
	}
	for (let e = 0; e < t; e++) n += i;
	return n;
}
function wy(e, t) {
	e instanceof Il && (e = new Vb(e));
	for (let n of e.state.facet(zb)) {
		let r = n(e, t);
		if (r !== void 0) return r;
	}
	let n = gy(e.state);
	return n.length >= t ? Ey(e, n, t) : null;
}
function Ty(e, t, n) {
	let r = Object.create(null), i = new Vb(e, { overrideIndentation: (e) => r[e] ?? -1 }), a = [];
	for (let o = t; o <= n;) {
		let t = e.doc.lineAt(o);
		o = t.to + 1;
		let n = wy(i, t.from);
		if (n == null) continue;
		/\S/.test(t.text) || (n = 0);
		let s = /^\s*/.exec(t.text)[0], c = Cy(e, n);
		s != c && (r[t.from] = n, a.push({
			from: t.from,
			to: t.from + s.length,
			insert: c
		}));
	}
	return e.changes(a);
}
function Ey(e, t, n) {
	let r = t.resolveStack(n), i = t.resolveInner(n, -1).resolve(n, 0).enterUnfinishedNodesBefore(n);
	if (i != r.node) {
		let e = [];
		for (let t = i; t && !(t.from < r.node.from || t.to > r.node.to || t.from == r.node.from && t.type == r.node.type); t = t.parent) e.push(t);
		for (let t = e.length - 1; t >= 0; t--) r = {
			node: e[t],
			next: r
		};
	}
	return Dy(r, e, n);
}
function Dy(e, t, n) {
	for (let r = e; r; r = r.next) {
		let e = ky(r.node);
		if (e) return e(Ub.create(t, n, r));
	}
	return 0;
}
function Oy(e) {
	return e.pos == e.options.simulateBreak && e.options.simulateDoubleBreak;
}
function ky(e) {
	let t = e.type.prop(Hb);
	if (t) return t;
	let n = e.firstChild, r;
	if (n && (r = n.type.prop(Z.closedBy))) {
		let t = e.lastChild, n = t && r.indexOf(t.name) > -1;
		return (e) => Py(e, !0, 1, void 0, n && !Oy(e) ? t.from : void 0);
	}
	return e.parent == null ? Ay : null;
}
function Ay() {
	return 0;
}
function jy(e, t) {
	for (let n = t; n; n = n.parent) if (e == n) return !0;
	return !1;
}
function My(e) {
	let t = e.node, n = t.childAfter(t.from), r = t.lastChild;
	if (!n) return null;
	let i = e.options.simulateBreak, a = e.state.doc.lineAt(n.from), o = i == null || i <= a.from ? a.to : Math.min(a.to, i);
	for (let e = n.to;;) {
		let i = t.childAfter(e);
		if (!i || i == r) return null;
		if (!i.type.isSkipped) {
			if (i.from >= o) return null;
			let e = /^ */.exec(a.text.slice(n.to - a.from))[0].length;
			return {
				from: n.from,
				to: n.to + e
			};
		}
		e = i.to;
	}
}
function Ny({ closing: e, align: t = !0, units: n = 1 }) {
	return (r) => Py(r, t, n, e);
}
function Py(e, t, n, r, i) {
	let a = e.textAfter, o = a.match(/^\s*/)[0].length, s = r && a.slice(o, o + r.length) == r || i == e.pos + o, c = t ? My(e) : null;
	return c ? s ? e.column(c.from) : e.column(c.to) : e.baseIndent + (s ? 0 : e.unit * n);
}
function Fy({ except: e, units: t = 1 } = {}) {
	return (n) => {
		let r = e && e.test(n.textAfter);
		return n.baseIndent + (r ? 0 : t * n.unit);
	};
}
function Iy() {
	return Il.transactionFilter.of((e) => {
		if (!e.docChanged || !e.isUserEvent("input.type") && !e.isUserEvent("input.complete")) return e;
		let t = e.startState.languageDataAt("indentOnInput", e.startState.selection.main.head);
		if (!t.length) return e;
		let n = e.newDoc, { head: r } = e.newSelection.main, i = n.lineAt(r);
		if (r > i.from + Gb) return e;
		let a = n.sliceString(i.from, r);
		if (!t.some((e) => e.test(a))) return e;
		let { state: o } = e, s = -1, c = [];
		for (let { head: e } of o.selection.ranges) {
			let t = o.doc.lineAt(e);
			if (t.from == s) continue;
			s = t.from;
			let n = wy(o, t.from);
			if (n == null) continue;
			let r = /^\s*/.exec(t.text)[0], i = Cy(o, n);
			r != i && c.push({
				from: t.from,
				to: t.from + r.length,
				insert: i
			});
		}
		return c.length ? [e, {
			changes: c,
			sequential: !0
		}] : e;
	});
}
function Ly(e) {
	let t = e.firstChild, n = e.lastChild;
	return t && t.to < n.from ? {
		from: t.to,
		to: n.type.isError ? e.to : n.from
	} : null;
}
function Ry(e, t, n) {
	let r = gy(e);
	if (r.length < n) return null;
	let i = r.resolveStack(n, 1), a = null;
	for (let o = i; o; o = o.next) {
		let i = o.node;
		if (i.to <= n || i.from > n) continue;
		if (a && i.from < t) break;
		let s = i.type.prop(qb);
		if (s && (i.to < r.length - 50 || r.length == e.doc.length || !zy(i))) {
			let r = s(i, e);
			r && r.from <= n && r.from >= t && r.to > n && (a = r);
		}
	}
	return a;
}
function zy(e) {
	let t = e.lastChild;
	return t && t.to == e.to && t.type.isError;
}
function By(e, t, n) {
	for (let r of e.facet(Kb)) {
		let i = r(e, t, n);
		if (i) return i;
	}
	return Ry(e, t, n);
}
function Vy(e, t) {
	let n = t.mapPos(e.from, 1), r = t.mapPos(e.to, -1);
	return n >= r ? void 0 : {
		from: n,
		to: r
	};
}
function Hy(e) {
	let t = [];
	for (let { head: n } of e.state.selection.ranges) t.some((e) => e.from <= n && e.to >= n) || t.push(e.lineBlockAt(n));
	return t;
}
function Uy(e, t, n = t) {
	let r = !1;
	return e.between(t, n, (e, i) => {
		e < n && i > t && (r = !0);
	}), r ? e.update({
		filterFrom: t,
		filterTo: n,
		filter: (e, r) => e >= n || r <= t
	}) : e;
}
function Wy(e) {
	return e.field(Xb, !1) || Bl.empty;
}
function Gy(e, t, n) {
	var r;
	let i = null;
	return (r = e.field(Xb, !1)) == null || r.between(t, n, (e, t) => {
		(!i || i.from > e) && (i = {
			from: e,
			to: t
		});
	}), i;
}
function Ky(e, t, n) {
	let r = !1;
	return e.between(t, t, (e, i) => {
		e == t && i == n && (r = !0);
	}), r;
}
function qy(e, t) {
	return e.field(Xb, !1) ? t : t.concat(Al.appendConfig.of(Xy()));
}
function Jy(e, t, n = !0) {
	let r = e.state.doc.lineAt(t.from).number, i = e.state.doc.lineAt(t.to).number;
	return X.announce.of(`${e.state.phrase(n ? "Folded lines" : "Unfolded lines")} ${r} ${e.state.phrase("to")} ${i}.`);
}
function Yy(e, t) {
	for (let n = t;;) {
		let r = By(e.state, n.from, n.to);
		if (r && r.to > t.from) return r;
		if (!n.from) return null;
		n = e.lineBlockAt(n.from - 1);
	}
}
function Xy(e) {
	let t = [Xb, lx];
	return e && t.push(ix.of(e)), t;
}
function Zy(e, t) {
	let { state: n } = e, r = n.facet(ix), i = (t) => {
		let n = e.lineBlockAt(e.posAtDOM(t.target)), r = Gy(e.state, n.from, n.to);
		r && e.dispatch({ effects: Yb.of(r) }), t.preventDefault();
	};
	if (r.placeholderDOM) return r.placeholderDOM(e, i, t);
	let a = document.createElement("span");
	return a.textContent = r.placeholderText, a.setAttribute("aria-label", n.phrase("folded code")), a.title = n.phrase("unfold"), a.className = "cm-foldPlaceholder", a.onclick = i, a;
}
function Qy(e = {}) {
	let t = {
		...sx,
		...e
	}, n = new cx(t, !0), r = new cx(t, !1), i = Im.fromClass(class {
		constructor(e) {
			this.from = e.viewport.from, this.markers = this.buildMarkers(e);
		}
		update(e) {
			(e.docChanged || e.viewportChanged || e.startState.facet(Ib) != e.state.facet(Ib) || e.startState.field(Xb, !1) != e.state.field(Xb, !1) || gy(e.startState) != gy(e.state) || t.foldingChanged(e)) && (this.markers = this.buildMarkers(e.view));
		}
		buildMarkers(e) {
			let t = new Vl();
			for (let i of e.viewportLineBlocks) {
				let a = Gy(e.state, i.from, i.to) ? r : By(e.state, i.from, i.to) ? n : null;
				a && t.add(i.from, i.from, a);
			}
			return t.finish();
		}
	}), { domEventHandlers: a } = t;
	return [
		i,
		Tp({
			class: "cm-foldGutter",
			markers(e) {
				return e.plugin(i)?.markers || Bl.empty;
			},
			initialSpacer() {
				return new cx(t, !1);
			},
			domEventHandlers: {
				...a,
				click: (e, t, n) => {
					if (a.click && a.click(e, t, n)) return !0;
					let r = Gy(e.state, t.from, t.to);
					if (r) return e.dispatch({ effects: Yb.of(r) }), !0;
					let i = By(e.state, t.from, t.to);
					return i ? (e.dispatch({ effects: Jb.of(i) }), !0) : !1;
				}
			}
		}),
		Xy()
	];
}
function $y(e) {
	let t = e.facet(dx);
	return t.length ? t : e.facet(fx);
}
function eb(e, t) {
	let n = [mx], r;
	return e instanceof ux && (e.module && n.push(X.styleModule.of(e.module)), r = e.themeType), t?.fallback ? n.push(fx.of(e)) : r ? n.push(dx.computeN([X.darkTheme], (t) => t.facet(X.darkTheme) == (r == "dark") ? [e] : [])) : n.push(dx.of(e)), n;
}
function tb(e, t, n) {
	let r = $y(e), i = null;
	if (r) {
		for (let e of r) if (!e.scope || n && e.scope(n)) {
			let n = e.style(t);
			n && (i = i ? i + " " + n : n);
		}
	}
	return i;
}
function nb(e) {
	let t = [], n = e.matched ? bx : xx;
	return t.push(n.range(e.start.from, e.start.to)), e.end && t.push(n.range(e.end.from, e.end.to)), t;
}
function rb(e) {
	let t = [], n = e.facet(yx);
	for (let r of e.selection.ranges) {
		if (!r.empty) continue;
		let i = sb(e, r.head, -1, n) || r.head > 0 && sb(e, r.head - 1, 1, n) || n.afterCursor && (sb(e, r.head, 1, n) || r.head < e.doc.length && sb(e, r.head + 1, -1, n));
		i && (t = t.concat(n.renderMatch(i, e)));
	}
	return Y.set(t, !0);
}
function ib(e = {}) {
	return [yx.of(e), Sx];
}
function ab(e, t, n) {
	let r = e.prop(t < 0 ? Z.openedBy : Z.closedBy);
	if (r) return r;
	if (e.name.length == 1) {
		let r = n.indexOf(e.name);
		if (r > -1 && r % 2 == +(t < 0)) return [n[r + t]];
	}
	return null;
}
function ob(e) {
	let t = e.type.prop(Cx);
	return t ? t(e.node) : e;
}
function sb(e, t, n, r = {}) {
	let i = r.maxScanDistance || _x, a = r.brackets || vx, o = gy(e), s = o.resolveInner(t, n);
	for (let r = s; r; r = r.parent) {
		let i = ab(r.type, n, a);
		if (i && r.from < r.to) {
			let o = ob(r);
			if (o && (n > 0 ? t >= o.from && t < o.to : t > o.from && t <= o.to)) return cb(e, t, n, r, o, i, a);
		}
	}
	return lb(e, t, n, o, s.type, i, a);
}
function cb(e, t, n, r, i, a, o) {
	let s = r.parent, c = {
		from: i.from,
		to: i.to
	}, l = 0, u = s?.cursor();
	if (u && (n < 0 ? u.childBefore(r.from) : u.childAfter(r.to))) do
		if (n < 0 ? u.to <= r.from : u.from >= r.to) {
			if (l == 0 && a.indexOf(u.type.name) > -1 && u.from < u.to) {
				let e = ob(u);
				return {
					start: c,
					end: e ? {
						from: e.from,
						to: e.to
					} : void 0,
					matched: !0
				};
			}
			if (ab(u.type, n, o)) l++;
			else if (ab(u.type, -n, o)) {
				if (l == 0) {
					let e = ob(u);
					return {
						start: c,
						end: e && e.from < e.to ? {
							from: e.from,
							to: e.to
						} : void 0,
						matched: !1
					};
				}
				l--;
			}
		}
	while (n < 0 ? u.prevSibling() : u.nextSibling());
	return {
		start: c,
		matched: !1
	};
}
function lb(e, t, n, r, i, a, o) {
	if (n < 0 ? !t : t == e.doc.length) return null;
	let s = n < 0 ? e.sliceDoc(t - 1, t) : e.sliceDoc(t, t + 1), c = o.indexOf(s);
	if (c < 0 || c % 2 == 0 != n > 0) return null;
	let l = {
		from: n < 0 ? t - 1 : t,
		to: n > 0 ? t + 1 : t
	}, u = e.doc.iterRange(t, n > 0 ? e.doc.length : 0), d = 0;
	for (let e = 0; !u.next().done && e <= a;) {
		let a = u.value;
		n < 0 && (e += a.length);
		let s = t + e * n;
		for (let e = n > 0 ? 0 : a.length - 1, t = n > 0 ? a.length : -1; e != t; e += n) {
			let t = o.indexOf(a[e]);
			if (!(t < 0 || r.resolveInner(s + e, 1).type != i)) {
				if (t % 2 == 0 == n > 0) d++;
				else if (d == 1) return {
					start: l,
					end: {
						from: s + e,
						to: s + e + 1
					},
					matched: t >> 1 == c >> 1
				};
				else d--;
			}
		}
		n > 0 && (e += a.length);
	}
	return u.done ? {
		start: l,
		matched: !1
	} : null;
}
function ub(e) {
	return {
		name: e.name || "",
		token: e.token,
		blankLine: e.blankLine || (() => {}),
		startState: e.startState || (() => !0),
		copyState: e.copyState || db,
		indent: e.indent || (() => null),
		languageData: e.languageData || {},
		tokenTable: e.tokenTable || Dx,
		mergeTokens: e.mergeTokens !== !1
	};
}
function db(e) {
	if (typeof e != "object") return e;
	let t = {};
	for (let n in e) {
		let r = e[n];
		t[n] = r instanceof Array ? r.slice() : r;
	}
	return t;
}
function fb(e, t, n, r, i) {
	let a = n >= r && n + t.length <= i && t.prop(e.stateAfter);
	if (a) return {
		state: e.streamParser.copyState(a),
		pos: n + t.length
	};
	for (let a = t.children.length - 1; a >= 0; a--) {
		let o = t.children[a], s = n + t.positions[a], c = o instanceof _v && s < i && fb(e, o, s, r, i);
		if (c) return c;
	}
	return null;
}
function pb(e, t, n, r, i) {
	if (i && n <= 0 && r >= t.length) return t;
	!i && n == 0 && t.type == e.topNode && (i = !0);
	for (let a = t.children.length - 1; a >= 0; a--) {
		let o = t.positions[a], s = t.children[a], c;
		if (o < r && s instanceof _v) {
			if (!(c = pb(e, s, n - o, r - o, i))) break;
			return i ? new _v(t.type, t.children.slice(0, a).concat(c), t.positions.slice(0, a + 1), o + c.length) : c;
		}
	}
	return null;
}
function mb(e, t, n, r, i) {
	for (let i of t) {
		let t = i.from + (i.openStart ? 25 : 0), a = i.to - (i.openEnd ? 25 : 0), o = t <= n && a > n && fb(e, i.tree, 0 - i.offset, n, a), s;
		if (o && o.pos <= r && (s = pb(e, i.tree, n + i.offset, o.pos + i.offset, !1))) return {
			state: o.state,
			tree: s
		};
	}
	return {
		state: e.streamParser.startState(i ? Sy(i) : 4),
		tree: _v.empty
	};
}
function hb(e, t, n) {
	t.start = t.pos;
	for (let r = 0; r < 10; r++) {
		let r = e(t, n);
		if (t.pos > t.start) return r;
	}
	throw Error("Stream parser failed to advance stream.");
}
function gb(e, t) {
	Ax.indexOf(e) > -1 || (Ax.push(e), console.warn(t));
}
function _b(e, t) {
	let n = [];
	for (let r of t.split(" ")) {
		let t = [];
		for (let n of r.split(".")) {
			let r = e[n] || $[n];
			r ? typeof r == "function" ? t.length ? t = t.map(r) : gb(n, `Modifier ${n} used at start of tag`) : t.length ? gb(n, `Tag ${n} used as modifier`) : t = Array.isArray(r) ? r : [r] : gb(n, `Unknown highlighting tag ${n}`);
		}
		for (let e of t) n.push(e);
	}
	if (!n.length) return 0;
	let r = t.replace(/ /g, "_"), i = r + " " + n.map((e) => e.id), a = jx[i];
	if (a) return a.id;
	let o = jx[i] = fv.define({
		id: Ox.length,
		name: r,
		props: [Fv({ [r]: n })]
	});
	return Ox.push(o), o.id;
}
function vb(e, t) {
	let n = fv.define({
		id: Ox.length,
		name: "Document",
		props: [Tb.add(() => e), Hb.add(() => (e) => t.getIndent(e))],
		top: !0
	});
	return Ox.push(n), n;
}
function yb(e) {
	return e.length <= 4096 && /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/.test(e);
}
function bb(e) {
	for (let t = e.iter(); !t.next().done;) if (yb(t.value)) return !0;
	return !1;
}
function xb(e) {
	let t = !1;
	return e.iterChanges((e, n, r, i, a) => {
		!t && bb(a) && (t = !0);
	}), t;
}
function Sb(e = {}) {
	let t = [Ix];
	return e.alwaysIsolate && t.push(Fx.of(!0)), t;
}
function Cb(e, t, n) {
	let r = new Vl(), i = e.visibleRanges;
	n || (i = wb(i, e.state.doc));
	for (let { from: e, to: n } of i) t.iterate({
		enter: (e) => {
			let t = e.type.prop(Z.isolate);
			t && r.add(e.from, e.to, Lx[t]);
		},
		from: e,
		to: n
	});
	return r.finish();
}
function wb(e, t) {
	let n = t.iter(), r = 0, i = [], a = null;
	for (let { from: t, to: o } of e) if (!(a && a.to > t && (t = a.to, t >= o))) for (r + n.value.length < t && (n.next(t - (r + n.value.length)), r = t);;) {
		let e = r, t = r + n.value.length;
		if (!n.lineBreak && yb(n.value) && (a && a.to > e - 10 ? a.to = Math.min(o, t) : i.push(a = {
			from: e,
			to: Math.min(o, t)
		})), t >= o) break;
		r = t, n.next();
	}
	return i;
}
var Tb, Eb, Db, Ob, kb, Ab, jb, Mb, Nb, Pb, Fb, Ib, Lb, Rb, zb, Bb, Vb, Hb, Ub, Wb, Gb, Kb, qb, Jb, Yb, Xb, Zb, Qb, $b, ex, tx, nx, rx, ix, ax, ox, sx, cx, lx, ux, dx, fx, px, mx, hx, gx, _x, vx, yx, bx, xx, Sx, Cx, wx, Tx, Ex, Dx, Ox, kx, Ax, jx, Mx, Nx, Px, Fx, Ix, Lx, Rx = t((() => {
	jv(), Gl(), X_(), ly(), $l(), fy(), Tb = /*@__PURE__*/ new Z(), Eb = /*@__PURE__*/ new Z(), Db = class {
		constructor(e, t, n = [], r = "") {
			this.data = e, this.name = r, Il.prototype.hasOwnProperty("tree") || Object.defineProperty(Il.prototype, "tree", { get() {
				return gy(this);
			} }), this.parser = t, this.extension = [Ib.of(this), Il.languageData.of((e, t, n) => {
				let r = hy(e, t, n), i = r.type.prop(Tb);
				if (!i) return [];
				let a = e.facet(i), o = r.type.prop(Eb);
				if (o) {
					let i = r.resolve(t - r.from, n);
					for (let t of o) if (t.test(i, e)) {
						let n = e.facet(t.facet);
						return t.type == "replace" ? n : n.concat(a);
					}
				}
				return a;
			})].concat(n);
		}
		isActiveAt(e, t, n = -1) {
			return hy(e, t, n).type.prop(Tb) == this.data;
		}
		findRegions(e) {
			let t = e.facet(Ib);
			if (t?.data == this.data) return [{
				from: 0,
				to: e.doc.length
			}];
			if (!t || !t.allowsNesting) return [];
			let n = [], r = (e, t) => {
				if (e.prop(Tb) == this.data) {
					n.push({
						from: t,
						to: t + e.length
					});
					return;
				}
				let i = e.prop(Z.mounted);
				if (i) {
					if (i.tree.prop(Tb) == this.data) {
						if (i.overlay) for (let e of i.overlay) n.push({
							from: e.from + t,
							to: e.to + t
						});
						else n.push({
							from: t,
							to: t + e.length
						});
						return;
					}
					if (i.overlay) {
						let e = n.length;
						if (r(i.tree, i.overlay[0].from + t), n.length > e) return;
					}
				}
				for (let n = 0; n < e.children.length; n++) {
					let i = e.children[n];
					i instanceof _v && r(i, e.positions[n] + t);
				}
			};
			return r(gy(e), 0), n;
		}
		get allowsNesting() {
			return !0;
		}
	}, Db.setState = /*@__PURE__*/ Al.define(), Ob = class e extends Db {
		constructor(e, t, n) {
			super(e, t, [], n), this.parser = t;
		}
		static define(t) {
			let n = my(t.languageData);
			return new e(n, t.parser.configure({ props: [Tb.add((e) => e.isTop ? n : void 0)] }), t.name);
		}
		configure(t, n) {
			return new e(this.data, this.parser.configure(t), n || this.name);
		}
		get allowsNesting() {
			return this.parser.hasWrappers();
		}
	}, kb = class {
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
			let n = this.cursorPos - this.string.length;
			return e < n || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - n, t - n);
		}
	}, Ab = null, jb = class e {
		constructor(e, t, n = [], r, i, a, o, s) {
			this.parser = e, this.state = t, this.fragments = n, this.tree = r, this.treeLen = i, this.viewport = a, this.skipped = o, this.scheduleOn = s, this.parse = null, this.tempSkipped = [];
		}
		static create(t, n, r) {
			return new e(t, n, [], _v.empty, 0, r, [], null);
		}
		startParse() {
			return this.parser.startParse(new kb(this.state.doc), this.fragments);
		}
		work(e, t) {
			return t != null && t >= this.state.doc.length && (t = void 0), this.tree != _v.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
				if (typeof e == "number") {
					let t = Date.now() + e;
					e = () => Date.now() > t;
				}
				for (this.parse ||= this.startParse(), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t);;) {
					let n = this.parse.advance();
					if (n) {
						if (this.fragments = this.withoutTempSkipped(Ov.addTree(n, this.fragments, this.parse.stoppedAt != null)), this.treeLen = this.parse.stoppedAt ?? this.state.doc.length, this.tree = n, this.parse = null, this.treeLen < (t ?? this.state.doc.length)) this.parse = this.startParse();
						else return !0;
					}
					if (e()) return !1;
				}
			});
		}
		takeTree() {
			let e, t;
			this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
				for (; !(t = this.parse.advance()););
			}), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(Ov.addTree(this.tree, this.fragments, !0)), this.parse = null);
		}
		withContext(e) {
			let t = Ab;
			Ab = this;
			try {
				return e();
			} finally {
				Ab = t;
			}
		}
		withoutTempSkipped(e) {
			for (let t; t = this.tempSkipped.pop();) e = xy(e, t.from, t.to);
			return e;
		}
		changes(t, n) {
			let { fragments: r, tree: i, treeLen: a, viewport: o, skipped: s } = this;
			if (this.takeTree(), !t.empty) {
				let e = [];
				if (t.iterChangedRanges((t, n, r, i) => e.push({
					fromA: t,
					toA: n,
					fromB: r,
					toB: i
				})), r = Ov.applyChanges(r, e), i = _v.empty, a = 0, o = {
					from: t.mapPos(o.from, -1),
					to: t.mapPos(o.to, 1)
				}, this.skipped.length) {
					s = [];
					for (let e of this.skipped) {
						let n = t.mapPos(e.from, 1), r = t.mapPos(e.to, -1);
						n < r && s.push({
							from: n,
							to: r
						});
					}
				}
			}
			return new e(this.parser, n, r, i, a, o, s, this.scheduleOn);
		}
		updateViewport(e) {
			if (this.viewport.from == e.from && this.viewport.to == e.to) return !1;
			this.viewport = e;
			let t = this.skipped.length;
			for (let t = 0; t < this.skipped.length; t++) {
				let { from: n, to: r } = this.skipped[t];
				n < e.to && r > e.from && (this.fragments = xy(this.fragments, n, r), this.skipped.splice(t--, 1));
			}
			return this.skipped.length >= t ? !1 : (this.reset(), !0);
		}
		reset() {
			this.parse &&= (this.takeTree(), null);
		}
		skipUntilInView(e, t) {
			this.skipped.push({
				from: e,
				to: t
			});
		}
		static getSkippingParser(e) {
			return new class extends kv {
				createParse(t, n, r) {
					let i = r[0].from, a = r[r.length - 1].to;
					return {
						parsedPos: i,
						advance() {
							let t = Ab;
							if (t) {
								for (let e of r) t.tempSkipped.push(e);
								e && (t.scheduleOn = t.scheduleOn ? Promise.all([t.scheduleOn, e]) : e);
							}
							return this.parsedPos = a, new _v(fv.none, [], [], a - i);
						},
						stoppedAt: null,
						stopAt() {}
					};
				}
			}();
		}
		isDone(e) {
			e = Math.min(e, this.state.doc.length);
			let t = this.fragments;
			return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
		}
		static get() {
			return Ab;
		}
	}, Mb = class e {
		constructor(e) {
			this.context = e, this.tree = e.tree;
		}
		apply(t) {
			if (!t.docChanged && this.tree == this.context.tree) return this;
			let n = this.context.changes(t.changes, t.state), r = this.context.treeLen == t.startState.doc.length ? void 0 : Math.max(t.changes.mapPos(this.context.treeLen), n.viewport.to);
			return n.work(20, r) || n.takeTree(), new e(n);
		}
		static init(t) {
			let n = Math.min(3e3, t.doc.length), r = jb.create(t.facet(Ib).parser, t, {
				from: 0,
				to: n
			});
			return r.work(20, n) || r.takeTree(), new e(r);
		}
	}, Db.state = /*@__PURE__*/ pl.define({
		create: Mb.init,
		update(e, t) {
			for (let e of t.effects) if (e.is(Db.setState)) return e.value;
			return t.startState.facet(Ib) == t.state.facet(Ib) ? e.apply(t) : Mb.init(t.state);
		}
	}), Nb = (e) => {
		let t = setTimeout(() => e(), 500);
		return () => clearTimeout(t);
	}, typeof requestIdleCallback < "u" && (Nb = (e) => {
		let t = -1, n = setTimeout(() => {
			t = requestIdleCallback(e, { timeout: 400 });
		}, 100);
		return () => t < 0 ? clearTimeout(n) : cancelIdleCallback(t);
	}), Pb = typeof navigator < "u" && navigator.scheduling?.isInputPending ? () => navigator.scheduling.isInputPending() : null, Fb = /*@__PURE__*/ Im.fromClass(class {
		constructor(e) {
			this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
		}
		update(e) {
			let t = this.view.state.field(Db.state).context;
			(t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
		}
		scheduleWork() {
			if (this.working) return;
			let { state: e } = this.view, t = e.field(Db.state);
			t.tree == t.context.tree && t.context.isDone(e.doc.length) || (this.working = Nb(this.work));
		}
		work(e) {
			this.working = null;
			let t = Date.now();
			if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0) return;
			let { state: n, viewport: { to: r } } = this.view, i = n.field(Db.state);
			if (i.tree == i.context.tree && i.context.isDone(r + 1e5)) return;
			let a = Date.now() + Math.min(this.chunkBudget, 100, e && !Pb ? Math.max(25, e.timeRemaining() - 5) : 1e9), o = i.context.treeLen < r && n.doc.length > r + 1e3, s = i.context.work(() => Pb && Pb() || Date.now() > a, r + (o ? 0 : 1e5));
			this.chunkBudget -= Date.now() - t, (s || this.chunkBudget <= 0) && (i.context.takeTree(), this.view.dispatch({ effects: Db.setState.of(new Mb(i.context)) })), this.chunkBudget > 0 && (!s || o) && this.scheduleWork(), this.checkAsyncSchedule(i.context);
		}
		checkAsyncSchedule(e) {
			e.scheduleOn &&= (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((e) => td(this.view.state, e)).then(() => this.workScheduled--), null);
		}
		destroy() {
			this.working && this.working();
		}
		isWorking() {
			return !!(this.working || this.workScheduled > 0);
		}
	}, { eventHandlers: { focus() {
		this.scheduleWork();
	} } }), Ib = /*@__PURE__*/ q.define({
		combine(e) {
			return e.length ? e[0] : null;
		},
		enables: (e) => [
			Db.state,
			Fb,
			X.contentAttributes.compute([e], (t) => {
				let n = t.facet(e);
				return n && n.name ? { "data-language": n.name } : {};
			})
		]
	}), Lb = class {
		constructor(e, t = []) {
			this.language = e, this.support = t, this.extension = [e, t];
		}
	}, Rb = class e {
		constructor(e, t, n, r, i, a = void 0) {
			this.name = e, this.alias = t, this.extensions = n, this.filename = r, this.loadFunc = i, this.support = a, this.loading = null;
		}
		load() {
			return this.loading ||= this.loadFunc().then((e) => this.support = e, (e) => {
				throw this.loading = null, e;
			});
		}
		static of(t) {
			let { load: n, support: r } = t;
			if (!n) {
				if (!r) throw RangeError("Must pass either 'load' or 'support' to LanguageDescription.of");
				n = () => Promise.resolve(r);
			}
			return new e(t.name, (t.alias || []).concat(t.name).map((e) => e.toLowerCase()), t.extensions || [], t.filename, n, r);
		}
		static matchFilename(e, t) {
			for (let n of e) if (n.filename && n.filename.test(t)) return n;
			let n = /\.([^.]+)$/.exec(t);
			if (n) {
				for (let t of e) if (t.extensions.indexOf(n[1]) > -1) return t;
			}
			return null;
		}
		static matchLanguageName(e, t, n = !0) {
			t = t.toLowerCase();
			for (let n of e) if (n.alias.some((e) => e == t)) return n;
			if (n) for (let n of e) for (let e of n.alias) {
				let r = t.indexOf(e);
				if (r > -1 && (e.length > 2 || !/\w/.test(t[r - 1]) && !/\w/.test(t[r + e.length]))) return n;
			}
			return null;
		}
	}, zb = /*@__PURE__*/ q.define(), Bb = /*@__PURE__*/ q.define({ combine: (e) => {
		if (!e.length) return "  ";
		let t = e[0];
		if (!t || /\S/.test(t) || Array.from(t).some((e) => e != t[0])) throw Error("Invalid indent unit: " + JSON.stringify(e[0]));
		return t;
	} }), Vb = class {
		constructor(e, t = {}) {
			this.state = e, this.options = t, this.unit = Sy(e);
		}
		lineAt(e, t = 1) {
			let n = this.state.doc.lineAt(e), { simulateBreak: r, simulateDoubleBreak: i } = this.options;
			return r != null && r >= n.from && r <= n.to ? i && r == e ? {
				text: "",
				from: e
			} : (t < 0 ? r < e : r <= e) ? {
				text: n.text.slice(r - n.from),
				from: r
			} : {
				text: n.text.slice(0, r - n.from),
				from: n.from
			} : n;
		}
		textAfterPos(e, t = 1) {
			if (this.options.simulateDoubleBreak && e == this.options.simulateBreak) return "";
			let { text: n, from: r } = this.lineAt(e, t);
			return n.slice(e - r, Math.min(n.length, e + 100 - r));
		}
		column(e, t = 1) {
			let { text: n, from: r } = this.lineAt(e, t), i = this.countColumn(n, e - r), a = this.options.overrideIndentation ? this.options.overrideIndentation(r) : -1;
			return a > -1 && (i += a - this.countColumn(n, n.search(/\S|$/))), i;
		}
		countColumn(e, t = e.length) {
			return Yc(e, this.state.tabSize, t);
		}
		lineIndent(e, t = 1) {
			let { text: n, from: r } = this.lineAt(e, t), i = this.options.overrideIndentation;
			if (i) {
				let e = i(r);
				if (e > -1) return e;
			}
			return this.countColumn(n, n.search(/\S|$/));
		}
		get simulatedBreak() {
			return this.options.simulateBreak || null;
		}
	}, Hb = /*@__PURE__*/ new Z(), Ub = class e extends Vb {
		constructor(e, t, n) {
			super(e.state, e.options), this.base = e, this.pos = t, this.context = n;
		}
		get node() {
			return this.context.node;
		}
		static create(t, n, r) {
			return new e(t, n, r);
		}
		get textAfter() {
			return this.textAfterPos(this.pos);
		}
		get baseIndent() {
			return this.baseIndentFor(this.node);
		}
		baseIndentFor(e) {
			let t = this.state.doc.lineAt(e.from);
			for (;;) {
				let n = e.resolve(t.from);
				for (; n.parent && n.parent.from == n.from;) n = n.parent;
				if (jy(n, e)) break;
				t = this.state.doc.lineAt(n.from);
			}
			return this.lineIndent(t.from);
		}
		continue() {
			return Dy(this.context.next, this.base, this.pos);
		}
	}, Wb = (e) => e.baseIndent, Gb = 200, Kb = /*@__PURE__*/ q.define(), qb = /*@__PURE__*/ new Z(), Jb = /*@__PURE__*/ Al.define({ map: Vy }), Yb = /*@__PURE__*/ Al.define({ map: Vy }), Xb = /*@__PURE__*/ pl.define({
		create() {
			return Y.none;
		},
		update(e, t) {
			t.isUserEvent("delete") && t.changes.iterChangedRanges((t, n) => e = Uy(e, t, n)), e = e.map(t.changes);
			let n = [];
			for (let r of t.effects) r.is(Jb) && !Ky(e, r.value.from, r.value.to) ? n.push(r.value) : r.is(Yb) && (e = e.update({
				filter: (e, t) => r.value.from != e || r.value.to != t,
				filterFrom: r.value.from,
				filterTo: r.value.to
			}));
			if (n.length) {
				let { preparePlaceholder: r } = t.state.facet(ix), i = n.map((e) => (r ? Y.replace({ widget: new ox(r(t.state, e)) }) : ax).range(e.from, e.to));
				e = e.update({ add: i });
			}
			return t.selection && (e = Uy(e, t.selection.main.head)), e;
		},
		provide: (e) => X.decorations.from(e),
		toJSON(e, t) {
			let n = [];
			return e.between(0, t.doc.length, (e, t) => {
				n.push(e, t);
			}), n;
		},
		fromJSON(e) {
			if (!Array.isArray(e) || e.length % 2) throw RangeError("Invalid JSON for fold state");
			let t = [];
			for (let n = 0; n < e.length;) {
				let r = e[n++], i = e[n++];
				if (typeof r != "number" || typeof i != "number") throw RangeError("Invalid JSON for fold state");
				t.push(ax.range(r, i));
			}
			return Y.set(t, !0);
		}
	}), Zb = (e) => {
		for (let t of Hy(e)) {
			let n = By(e.state, t.from, t.to);
			if (n) return e.dispatch({ effects: qy(e.state, [Jb.of(n), Jy(e, n)]) }), !0;
		}
		return !1;
	}, Qb = (e) => {
		if (!e.state.field(Xb, !1)) return !1;
		let t = [];
		for (let n of Hy(e)) {
			let r = Gy(e.state, n.from, n.to);
			r && t.push(Yb.of(r), Jy(e, r, !1));
		}
		return t.length && e.dispatch({ effects: t }), t.length > 0;
	}, $b = (e) => {
		let { state: t } = e, n = [];
		for (let r = 0; r < t.doc.length;) {
			let i = e.lineBlockAt(r), a = By(t, i.from, i.to);
			a && n.push(Jb.of(a)), r = (a ? e.lineBlockAt(a.to) : i).to + 1;
		}
		return n.length && e.dispatch({ effects: qy(e.state, n) }), !!n.length;
	}, ex = (e) => {
		let t = e.state.field(Xb, !1);
		if (!t || !t.size) return !1;
		let n = [];
		return t.between(0, e.state.doc.length, (e, t) => {
			n.push(Yb.of({
				from: e,
				to: t
			}));
		}), e.dispatch({ effects: n }), !0;
	}, tx = (e) => {
		let t = [];
		for (let n of Hy(e)) {
			let r = Gy(e.state, n.from, n.to);
			if (r) t.push(Yb.of(r), Jy(e, r, !1));
			else {
				let r = Yy(e, n);
				r && t.push(Jb.of(r), Jy(e, r));
			}
		}
		return t.length > 0 && e.dispatch({ effects: qy(e.state, t) }), !!t.length;
	}, nx = [
		{
			key: "Ctrl-Shift-[",
			mac: "Cmd-Alt-[",
			run: Zb
		},
		{
			key: "Ctrl-Shift-]",
			mac: "Cmd-Alt-]",
			run: Qb
		},
		{
			key: "Ctrl-Alt-[",
			run: $b
		},
		{
			key: "Ctrl-Alt-]",
			run: ex
		}
	], rx = {
		placeholderDOM: null,
		preparePlaceholder: null,
		placeholderText: "…"
	}, ix = /*@__PURE__*/ q.define({ combine(e) {
		return Lc(e, rx);
	} }), ax = /*@__PURE__*/ Y.replace({ widget: /*@__PURE__*/ new class extends Yp {
		toDOM(e) {
			return Zy(e, null);
		}
	}() }), ox = class extends Yp {
		constructor(e) {
			super(), this.value = e;
		}
		eq(e) {
			return this.value == e.value;
		}
		toDOM(e) {
			return Zy(e, this.value);
		}
	}, sx = {
		openText: "⌄",
		closedText: "›",
		markerDOM: null,
		domEventHandlers: {},
		foldingChanged: () => !1
	}, cx = class extends O_ {
		constructor(e, t) {
			super(), this.config = e, this.open = t;
		}
		eq(e) {
			return this.config == e.config && this.open == e.open;
		}
		toDOM(e) {
			if (this.config.markerDOM) return this.config.markerDOM(this.open);
			let t = document.createElement("span");
			return t.textContent = this.open ? this.config.openText : this.config.closedText, t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line"), t;
		}
	}, lx = /*@__PURE__*/ X.baseTheme({
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
	}), ux = class e {
		constructor(e, t) {
			this.specs = e;
			let n;
			function r(e) {
				let t = Xl.newName();
				return (n ||= Object.create(null))["." + t] = e, t;
			}
			let i = typeof t.all == "string" ? t.all : t.all ? r(t.all) : void 0, a = t.scope;
			this.scope = a instanceof Db ? (e) => e.prop(Tb) == a.data : a ? (e) => e == a : void 0, this.style = Iv(e.map((e) => ({
				tag: e.tag,
				class: e.class || r(Object.assign({}, e, { tag: null }))
			})), { all: i }).style, this.module = n ? new Xl(n) : null, this.themeType = t.themeType;
		}
		static define(t, n) {
			return new e(t, n || {});
		}
	}, dx = /*@__PURE__*/ q.define(), fx = /*@__PURE__*/ q.define({ combine(e) {
		return e.length ? [e[0]] : null;
	} }), px = class {
		constructor(e) {
			this.markCache = Object.create(null), this.tree = gy(e.state), this.decorations = this.buildDeco(e, $y(e.state)), this.decoratedTo = e.viewport.to;
		}
		update(e) {
			let t = gy(e.state), n = $y(e.state), r = n != $y(e.startState), { viewport: i } = e.view, a = e.changes.mapPos(this.decoratedTo, 1);
			t.length < i.to && !r && t.type == this.tree.type && a >= i.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = a) : (t != this.tree || e.viewportChanged || r) && (this.tree = t, this.decorations = this.buildDeco(e.view, n), this.decoratedTo = i.to);
		}
		buildDeco(e, t) {
			if (!t || !this.tree.length) return Y.none;
			let n = new Vl();
			for (let { from: r, to: i } of e.visibleRanges) Rv(this.tree, t, (e, t, r) => {
				n.add(e, t, this.markCache[r] || (this.markCache[r] = Y.mark({ class: r })));
			}, r, i);
			return n.finish();
		}
	}, mx = /*@__PURE__*/ hl.high(/*@__PURE__*/ Im.fromClass(px, { decorations: (e) => e.decorations })), hx = /*@__PURE__*/ ux.define([
		{
			tag: $.meta,
			color: "#404740"
		},
		{
			tag: $.link,
			textDecoration: "underline"
		},
		{
			tag: $.heading,
			textDecoration: "underline",
			fontWeight: "bold"
		},
		{
			tag: $.emphasis,
			fontStyle: "italic"
		},
		{
			tag: $.strong,
			fontWeight: "bold"
		},
		{
			tag: $.strikethrough,
			textDecoration: "line-through"
		},
		{
			tag: $.keyword,
			color: "#708"
		},
		{
			tag: [
				$.atom,
				$.bool,
				$.url,
				$.contentSeparator,
				$.labelName
			],
			color: "#219"
		},
		{
			tag: [$.literal, $.inserted],
			color: "#164"
		},
		{
			tag: [$.string, $.deleted],
			color: "#a11"
		},
		{
			tag: [
				$.regexp,
				$.escape,
				/*@__PURE__*/ $.special($.string)
			],
			color: "#e40"
		},
		{
			tag: /*@__PURE__*/ $.definition($.variableName),
			color: "#00f"
		},
		{
			tag: /*@__PURE__*/ $.local($.variableName),
			color: "#30a"
		},
		{
			tag: [$.typeName, $.namespace],
			color: "#085"
		},
		{
			tag: $.className,
			color: "#167"
		},
		{
			tag: [/*@__PURE__*/ $.special($.variableName), $.macroName],
			color: "#256"
		},
		{
			tag: /*@__PURE__*/ $.definition($.propertyName),
			color: "#00c"
		},
		{
			tag: $.comment,
			color: "#940"
		},
		{
			tag: $.invalid,
			color: "#f00"
		}
	]), gx = /*@__PURE__*/ X.baseTheme({
		"&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
		"&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
	}), _x = 1e4, vx = "()[]{}", yx = /*@__PURE__*/ q.define({ combine(e) {
		return Lc(e, {
			afterCursor: !0,
			brackets: vx,
			maxScanDistance: _x,
			renderMatch: nb
		});
	} }), bx = /*@__PURE__*/ Y.mark({ class: "cm-matchingBracket" }), xx = /*@__PURE__*/ Y.mark({ class: "cm-nonmatchingBracket" }), Sx = [/* @__PURE__ */ Im.fromClass(class {
		constructor(e) {
			this.paused = !1, this.decorations = rb(e.state);
		}
		update(e) {
			(e.docChanged || e.selectionSet || this.paused) && (e.view.composing ? (this.decorations = this.decorations.map(e.changes), this.paused = !0) : (this.decorations = rb(e.state), this.paused = !1));
		}
	}, { decorations: (e) => e.decorations }), gx], Cx = /*@__PURE__*/ new Z(), wx = /*@__PURE__*/ new WeakMap(), Tx = class e extends Db {
		constructor(e) {
			let t = my(e.languageData), n = ub(e), r, i = new class extends kv {
				createParse(e, t, n) {
					return new Ex(r, e, t, n);
				}
			}();
			super(t, i, [], e.name), this.topNode = vb(t, this), r = this, this.streamParser = n, this.stateAfter = new Z({ perNode: !0 }), this.tokenTable = e.tokenTable ? new Nx(n.tokenTable) : Px;
		}
		static define(t) {
			return new e(t);
		}
		getIndent(e) {
			let t, { overrideIndentation: n } = e.options;
			n && (t = wx.get(e.state), t != null && t < e.pos - 1e4 && (t = void 0));
			let r = fb(this, e.node.tree, e.node.from, e.node.from, t ?? e.pos), i, a;
			if (r ? (a = r.state, i = r.pos + 1) : (a = this.streamParser.startState(e.unit), i = e.node.from), e.pos - i > 1e4) return null;
			for (; i < e.pos;) {
				let t = e.state.doc.lineAt(i), r = Math.min(e.pos, t.to);
				if (t.length) {
					let i = n ? n(t.from) : -1, o = new dy(t.text, e.state.tabSize, e.unit, i < 0 ? void 0 : i);
					for (; o.pos < r - t.from;) hb(this.streamParser.token, o, a);
				} else this.streamParser.blankLine(a, e.unit);
				if (r == e.pos) break;
				i = t.to + 1;
			}
			let o = e.lineAt(e.pos);
			return n && t == null && wx.set(e.state, o.from), this.streamParser.indent(a, /^\s*(.*)/.exec(o.text)[1], e);
		}
		get allowsNesting() {
			return !1;
		}
	}, Ex = class {
		constructor(e, t, n, r) {
			this.lang = e, this.input = t, this.fragments = n, this.ranges = r, this.stoppedAt = null, this.chunks = [], this.chunkPos = [], this.chunk = [], this.chunkReused = void 0, this.rangeIndex = 0, this.to = r[r.length - 1].to;
			let i = jb.get(), a = r[0].from, { state: o, tree: s } = mb(e, n, a, this.to, i?.state);
			this.state = o, this.parsedPos = this.chunkStart = a + s.length;
			for (let e = 0; e < s.children.length; e++) this.chunks.push(s.children[e]), this.chunkPos.push(s.positions[e]);
			i && this.parsedPos < i.viewport.from - 1e5 && r.some((e) => e.from <= i.viewport.from && e.to >= i.viewport.from) && (this.state = this.lang.streamParser.startState(Sy(i.state)), i.skipUntilInView(this.parsedPos, i.viewport.from), this.parsedPos = i.viewport.from), this.moveRangeIndex();
		}
		advance() {
			let e = jb.get(), t = this.stoppedAt == null ? this.to : Math.min(this.to, this.stoppedAt), n = Math.min(t, this.chunkStart + 512);
			for (e && (n = Math.min(n, e.viewport.to)); this.parsedPos < n;) this.parseLine(e);
			return this.chunkStart < this.parsedPos && this.finishChunk(), this.parsedPos >= t ? this.finish() : e && this.parsedPos >= e.viewport.to ? (e.skipUntilInView(this.parsedPos, t), this.finish()) : null;
		}
		stopAt(e) {
			this.stoppedAt = e;
		}
		lineAfter(e) {
			let t = this.input.chunk(e);
			if (this.input.lineChunks) t == "\n" && (t = "");
			else {
				let e = t.indexOf("\n");
				e > -1 && (t = t.slice(0, e));
			}
			return e + t.length <= this.to ? t : t.slice(0, this.to - e);
		}
		nextLine() {
			let e = this.parsedPos, t = this.lineAfter(e), n = e + t.length;
			for (let e = this.rangeIndex;;) {
				let r = this.ranges[e].to;
				if (r >= n || (t = t.slice(0, r - (n - t.length)), e++, e == this.ranges.length)) break;
				let i = this.ranges[e].from, a = this.lineAfter(i);
				t += a, n = i + a.length;
			}
			return {
				line: t,
				end: n
			};
		}
		skipGapsTo(e, t, n) {
			for (;;) {
				let r = this.ranges[this.rangeIndex].to, i = e + t;
				if (n > 0 ? r > i : r >= i) break;
				let a = this.ranges[++this.rangeIndex].from;
				t += a - r;
			}
			return t;
		}
		moveRangeIndex() {
			for (; this.ranges[this.rangeIndex].to < this.parsedPos;) this.rangeIndex++;
		}
		emitToken(e, t, n, r) {
			let i = 4;
			if (this.ranges.length > 1) {
				r = this.skipGapsTo(t, r, 1), t += r;
				let e = this.chunk.length;
				r = this.skipGapsTo(n, r, -1), n += r, i += this.chunk.length - e;
			}
			let a = this.chunk.length - 4;
			return this.lang.streamParser.mergeTokens && i == 4 && a >= 0 && this.chunk[a] == e && this.chunk[a + 2] == t ? this.chunk[a + 2] = n : this.chunk.push(e, t, n, i), r;
		}
		parseLine(e) {
			let { line: t, end: n } = this.nextLine(), r = 0, { streamParser: i } = this.lang, a = new dy(t, e ? e.state.tabSize : 4, e ? Sy(e.state) : 2);
			if (a.eol()) i.blankLine(this.state, a.indentUnit);
			else for (; !a.eol();) {
				let e = hb(i.token, a, this.state);
				if (e && (r = this.emitToken(this.lang.tokenTable.resolve(e), this.parsedPos + a.start, this.parsedPos + a.pos, r)), a.start > 1e4) break;
			}
			this.parsedPos = n, this.moveRangeIndex(), this.parsedPos < this.to && this.parsedPos++;
		}
		finishChunk() {
			let e = _v.build({
				buffer: this.chunk,
				start: this.chunkStart,
				length: this.parsedPos - this.chunkStart,
				nodeSet: kx,
				topID: 0,
				maxBufferLength: 512,
				reused: this.chunkReused
			});
			e = new _v(e.type, e.children, e.positions, e.length, [[this.lang.stateAfter, this.lang.streamParser.copyState(this.state)]]), this.chunks.push(e), this.chunkPos.push(this.chunkStart - this.ranges[0].from), this.chunk = [], this.chunkReused = void 0, this.chunkStart = this.parsedPos;
		}
		finish() {
			return new _v(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
		}
	}, Dx = /*@__PURE__*/ Object.create(null), Ox = [fv.none], kx = /*@__PURE__*/ new pv(Ox), Ax = [], jx = /*@__PURE__*/ Object.create(null), Mx = /*@__PURE__*/ Object.create(null);
	for (let [e, t] of [
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
	]) Mx[e] = /*@__PURE__*/ _b(Dx, t);
	Nx = class {
		constructor(e) {
			this.extra = e, this.table = Object.assign(Object.create(null), Mx);
		}
		resolve(e) {
			return e ? this.table[e] || (this.table[e] = _b(this.extra, e)) : 0;
		}
	}, Px = /*@__PURE__*/ new Nx(Dx), Fx = /*@__PURE__*/ q.define({ combine: (e) => e.some((e) => e) }), Ix = /*@__PURE__*/ Im.fromClass(class {
		constructor(e) {
			this.always = e.state.facet(Fx) || e.textDirection != sm.LTR || e.state.facet(X.perLineTextDirection), this.hasRTL = !this.always && bb(e.state.doc), this.tree = gy(e.state), this.decorations = this.always || this.hasRTL ? Cb(e, this.tree, this.always) : Y.none;
		}
		update(e) {
			let t = e.state.facet(Fx) || e.view.textDirection != sm.LTR || e.state.facet(X.perLineTextDirection);
			if (!t && !this.hasRTL && xb(e.changes) && (this.hasRTL = !0), !t && !this.hasRTL) return;
			let n = gy(e.state);
			(t != this.always || n != this.tree || e.docChanged || e.viewportChanged) && (this.tree = n, this.always = t, this.decorations = Cb(e.view, n, t));
		}
	}, { provide: (e) => {
		function t(t) {
			return t.plugin(e)?.decorations ?? Y.none;
		}
		return [X.outerDecorations.of(t), hl.lowest(X.bidiIsolatedRanges.of(t))];
	} }), Lx = {
		rtl: /*@__PURE__*/ Y.mark({
			class: "cm-iso",
			inclusive: !0,
			attributes: { dir: "rtl" },
			bidiIsolate: sm.RTL
		}),
		ltr: /*@__PURE__*/ Y.mark({
			class: "cm-iso",
			inclusive: !0,
			attributes: { dir: "ltr" },
			bidiIsolate: sm.LTR
		}),
		auto: /*@__PURE__*/ Y.mark({
			class: "cm-iso",
			inclusive: !0,
			attributes: { dir: "auto" },
			bidiIsolate: null
		})
	};
}));
// node_modules/@lezer/lr/dist/index.js
function zx(e, t = Uint16Array) {
	if (typeof e != "string") return e;
	let n = null;
	for (let r = 0, i = 0; r < e.length;) {
		let a = 0;
		for (;;) {
			let t = e.charCodeAt(r++), n = !1;
			if (t == 126) {
				a = 65535;
				break;
			}
			t >= 92 && t--, t >= 34 && t--;
			let i = t - 32;
			if (i >= 46 && (i -= 46, n = !0), a += i, n) break;
			a *= 46;
		}
		n ? n[i++] = a : n = new t(a);
	}
	return n;
}
function Bx(e, t, n, r, i, a) {
	let o = 0, s = 1 << r, { dialect: c } = n.p.parser;
	scan: for (; (s & e[o]) != 0;) {
		let n = e[o + 1];
		for (let r = o + 3; r < n; r += 2) if ((e[r + 1] & s) > 0) {
			let n = e[r];
			if (c.allows(n) && (t.token.value == -1 || t.token.value == n || Hx(n, t.token.value, i, a))) {
				t.acceptToken(n);
				break;
			}
		}
		let r = t.next, l = 0, u = e[o + 2];
		if (t.next < 0 && u > l && e[n + u * 3 - 3] == 65535) {
			o = e[n + u * 3 - 1];
			continue scan;
		}
		for (; l < u;) {
			let i = l + u >> 1, a = n + i + (i << 1), s = e[a], c = e[a + 1] || 65536;
			if (r < s) u = i;
			else if (r >= c) l = i + 1;
			else {
				o = e[a + 2], t.advance();
				continue scan;
			}
		}
		break;
	}
}
function Vx(e, t, n) {
	for (let r = t, i; (i = e[r]) != 65535; r++) if (i == n) return r - t;
	return -1;
}
function Hx(e, t, n, r) {
	let i = Vx(n, r, t);
	return i < 0 || Vx(n, r, e) < i;
}
function Ux(e, t, n) {
	let r = e.cursor(gv.IncludeAnonymous);
	for (r.moveTo(t);;) if (!(n < 0 ? r.childBefore(t) : r.childAfter(t))) for (;;) {
		if ((n < 0 ? r.to < t : r.from > t) && !r.type.isError) return n < 0 ? Math.max(0, Math.min(r.to - 1, t - 25)) : Math.min(e.length, Math.max(r.from + 1, t + 25));
		if (n < 0 ? r.prevSibling() : r.nextSibling()) break;
		if (!r.parent()) return n < 0 ? 0 : e.length;
	}
}
function Wx(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (r.pos == e.pos && r.sameState(e)) {
			t[n].score < e.score && (t[n] = e);
			return;
		}
	}
	t.push(e);
}
function Gx(e, t) {
	return e[t] | e[t + 1] << 16;
}
function Kx(e) {
	let t = null;
	for (let n of e) {
		let e = n.p.stoppedAt;
		(n.pos == n.p.stream.end || e != null && n.pos > e) && n.p.parser.stateFlag(n.state, 2) && (!t || t.score < n.score) && (t = n);
	}
	return t;
}
function qx(e) {
	if (e.external) {
		let t = +!!e.extend;
		return (n, r) => e.external(n, r) << 1 | t;
	}
	return e.get;
}
var Jx, Yx, Xx, Zx, Qx, $x, eS, tS, nS, rS, iS, aS, oS, sS, cS, lS, uS, dS, fS, pS = t((() => {
	jv(), Jx = class e {
		constructor(e, t, n, r, i, a, o, s, c, l = 0, u) {
			this.p = e, this.stack = t, this.state = n, this.reducePos = r, this.pos = i, this.score = a, this.buffer = o, this.bufferBase = s, this.curContext = c, this.lookAhead = l, this.parent = u;
		}
		toString() {
			return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
		}
		static start(t, n, r = 0) {
			let i = t.parser.context;
			return new e(t, [], n, r, r, 0, [], 0, i ? new Yx(i, i.start) : null, 0, null);
		}
		get context() {
			return this.curContext ? this.curContext.context : null;
		}
		pushState(e, t) {
			this.stack.push(this.state, t, this.bufferBase + this.buffer.length), this.state = e;
		}
		reduce(e) {
			let t = e >> 19, n = e & 65535, { parser: r } = this.p, i = this.reducePos < this.pos - 25 && this.setLookAhead(this.pos), a = r.dynamicPrecedence(n);
			if (a && (this.score += a), t == 0) {
				n < r.minRepeatTerm && this.reducePos < this.pos && (this.reducePos = this.pos), this.pushState(r.getGoto(this.state, n, !0), this.reducePos), n < r.minRepeatTerm && this.storeNode(n, this.reducePos, this.reducePos, i ? 8 : 4, !0), this.reduceContext(n, this.reducePos);
				return;
			}
			let o = this.stack.length - (t - 1) * 3 - (e & 262144 ? 6 : 0), s = o ? this.stack[o - 2] : this.p.ranges[0].from;
			n < r.minRepeatTerm && s == this.reducePos && this.reducePos < this.pos && (this.reducePos = this.pos);
			let c = this.reducePos - s;
			c >= 2e3 && !this.p.parser.nodeSet.types[n]?.isAnonymous && (s == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = c) : this.p.lastBigReductionSize < c && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = s, this.p.lastBigReductionSize = c));
			let l = o ? this.stack[o - 1] : 0, u = this.bufferBase + this.buffer.length - l;
			if (n < r.minRepeatTerm || e & 131072) {
				let e = r.stateFlag(this.state, 1) ? this.pos : this.reducePos;
				this.storeNode(n, s, e, u + 4, !0);
			}
			if (e & 262144) this.state = this.stack[o];
			else {
				let e = this.stack[o - 3];
				this.state = r.getGoto(e, n, !0);
			}
			for (; this.stack.length > o;) this.stack.pop();
			this.reduceContext(n, s);
		}
		storeNode(e, t, n, r = 4, i = !1) {
			if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
				let e = this.buffer.length;
				if (e > 0 && this.buffer[e - 4] == 0 && this.buffer[e - 1] > -1) {
					if (t == n) return;
					if (this.buffer[e - 2] >= t) {
						this.buffer[e - 2] = n;
						return;
					}
				}
			}
			if (!i || this.pos == n) this.buffer.push(e, t, n, r);
			else {
				let i = this.buffer.length;
				if (i > 0 && (this.buffer[i - 4] != 0 || this.buffer[i - 1] < 0)) {
					let e = !1;
					for (let t = i; t > 0 && this.buffer[t - 2] > n; t -= 4) if (this.buffer[t - 1] >= 0) {
						e = !0;
						break;
					}
					if (e) for (; i > 0 && this.buffer[i - 2] > n;) this.buffer[i] = this.buffer[i - 4], this.buffer[i + 1] = this.buffer[i - 3], this.buffer[i + 2] = this.buffer[i - 2], this.buffer[i + 3] = this.buffer[i - 1], i -= 4, r > 4 && (r -= 4);
				}
				this.buffer[i] = e, this.buffer[i + 1] = t, this.buffer[i + 2] = n, this.buffer[i + 3] = r;
			}
		}
		shift(e, t, n, r) {
			if (e & 131072) this.pushState(e & 65535, this.pos);
			else if (e & 262144) this.pos = r, this.shiftContext(t, n), t <= this.p.parser.maxNode && this.buffer.push(t, n, r, 4);
			else {
				let i = e, { parser: a } = this.p;
				this.pos = r;
				let o = a.stateFlag(i, 1);
				!o && (r > n || t <= a.maxNode) && (this.reducePos = r), this.pushState(i, o ? n : Math.min(n, this.reducePos)), this.shiftContext(t, n), t <= a.maxNode && this.buffer.push(t, n, r, 4);
			}
		}
		apply(e, t, n, r) {
			e & 65536 ? this.reduce(e) : this.shift(e, t, n, r);
		}
		useNode(e, t, n) {
			let r = this.p.reused.length - 1;
			(r < 0 || this.p.reused[r] != e) && (this.p.reused.push(e), r++);
			let i = this.reducePos = this.pos = n + e.length;
			this.pushState(t, n), this.buffer.push(r, n, i, -1), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
		}
		split() {
			let t = this, n = t.buffer.length;
			for (n && t.buffer[n - 4] == 0 && (n -= 4); n > 0 && t.buffer[n - 2] > t.reducePos;) n -= 4;
			let r = t.buffer.slice(n), i = t.bufferBase + n;
			for (; t && i == t.bufferBase;) t = t.parent;
			return new e(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, r, i, this.curContext, this.lookAhead, t);
		}
		recoverByDelete(e, t) {
			let n = e <= this.p.parser.maxNode;
			n && this.storeNode(e, this.pos, t, 4), this.storeNode(0, this.pos, t, n ? 8 : 4), this.pos = this.reducePos = t, this.score -= 190;
		}
		canShift(e) {
			for (let t = new Xx(this);;) {
				let n = this.p.parser.stateSlot(t.state, 4) || this.p.parser.hasAction(t.state, e);
				if (n == 0) return !1;
				if (!(n & 65536)) return !0;
				t.reduce(n);
			}
		}
		recoverByInsert(e) {
			if (this.stack.length >= 300) return [];
			let t = this.p.parser.nextStates(this.state);
			if (t.length > 8 || this.stack.length >= 120) {
				let n = [];
				for (let r = 0, i; r < t.length; r += 2) (i = t[r + 1]) != this.state && this.p.parser.hasAction(i, e) && n.push(t[r], i);
				if (this.stack.length < 120) for (let e = 0; n.length < 8 && e < t.length; e += 2) {
					let r = t[e + 1];
					n.some((e, t) => t & 1 && e == r) || n.push(t[e], r);
				}
				t = n;
			}
			let n = [];
			for (let e = 0; e < t.length && n.length < 4; e += 2) {
				let r = t[e + 1];
				if (r == this.state) continue;
				let i = this.split();
				i.pushState(r, this.pos), i.storeNode(0, i.pos, i.pos, 4, !0), i.shiftContext(t[e], this.pos), i.reducePos = this.pos, i.score -= 200, n.push(i);
			}
			return n;
		}
		forceReduce() {
			let { parser: e } = this.p, t = e.stateSlot(this.state, 5);
			if (!(t & 65536)) return !1;
			if (!e.validAction(this.state, t)) {
				let n = t >> 19, r = t & 65535, i = this.stack.length - n * 3;
				if (i < 0 || e.getGoto(this.stack[i], r, !1) < 0) {
					let e = this.findForcedReduction();
					if (e == null) return !1;
					t = e;
				}
				this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
			}
			return this.reducePos = this.pos, this.reduce(t), !0;
		}
		findForcedReduction() {
			let { parser: e } = this.p, t = [], n = (r, i) => {
				if (!t.includes(r)) return t.push(r), e.allActions(r, (t) => {
					if (!(t & 393216)) {
						if (t & 65536) {
							let n = (t >> 19) - i;
							if (n > 1) {
								let r = t & 65535, i = this.stack.length - n * 3;
								if (i >= 0 && e.getGoto(this.stack[i], r, !1) >= 0) return n << 19 | 65536 | r;
							}
						} else {
							let e = n(t, i + 1);
							if (e != null) return e;
						}
					}
				});
			};
			return n(this.state, 0);
		}
		forceAll() {
			for (; !this.p.parser.stateFlag(this.state, 2);) if (!this.forceReduce()) {
				this.storeNode(0, this.pos, this.pos, 4, !0);
				break;
			}
			return this;
		}
		get deadEnd() {
			if (this.stack.length != 3) return !1;
			let { parser: e } = this.p;
			return e.data[e.stateSlot(this.state, 1)] == 65535 && !e.stateSlot(this.state, 4);
		}
		restart() {
			this.storeNode(0, this.pos, this.pos, 4, !0), this.state = this.stack[0], this.stack.length = 0;
		}
		sameState(e) {
			if (this.state != e.state || this.stack.length != e.stack.length) return !1;
			for (let t = 0; t < this.stack.length; t += 3) if (this.stack[t] != e.stack[t]) return !1;
			return !0;
		}
		get parser() {
			return this.p.parser;
		}
		dialectEnabled(e) {
			return this.p.parser.dialect.flags[e];
		}
		shiftContext(e, t) {
			this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(t)));
		}
		reduceContext(e, t) {
			this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(t)));
		}
		emitContext() {
			let e = this.buffer.length - 1;
			(e < 0 || this.buffer[e] != -3) && this.storeNode(this.curContext.hash, this.reducePos, this.reducePos, -3, !0);
		}
		emitLookAhead() {
			let e = this.buffer.length - 1;
			(e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
		}
		updateContext(e) {
			if (e != this.curContext.context) {
				let t = new Yx(this.curContext.tracker, e);
				t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
			}
		}
		setLookAhead(e) {
			return e <= this.lookAhead ? !1 : (this.emitLookAhead(), this.lookAhead = e, !0);
		}
		close() {
			this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
		}
	}, Yx = class {
		constructor(e, t) {
			this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
		}
	}, Xx = class {
		constructor(e) {
			this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
		}
		reduce(e) {
			let t = e & 65535, n = e >> 19;
			n == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (n - 1) * 3;
			let r = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
			this.state = r;
		}
	}, Zx = class e {
		constructor(e, t, n) {
			this.stack = e, this.pos = t, this.index = n, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
		}
		static create(t, n = t.bufferBase + t.buffer.length) {
			return new e(t, n, n - t.bufferBase);
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
			return new e(this.stack, this.pos, this.index);
		}
	}, Qx = class {
		constructor() {
			this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
		}
	}, $x = new Qx(), eS = class {
		constructor(e, t) {
			this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = $x, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
		}
		resolveOffset(e, t) {
			let n = this.range, r = this.rangeIndex, i = this.pos + e;
			for (; i < n.from;) {
				if (!r) return null;
				let e = this.ranges[--r];
				i -= n.from - e.to, n = e;
			}
			for (; t < 0 ? i > n.to : i >= n.to;) {
				if (r == this.ranges.length - 1) return null;
				let e = this.ranges[++r];
				i += e.from - n.to, n = e;
			}
			return i;
		}
		clipPos(e) {
			if (e >= this.range.from && e < this.range.to) return e;
			for (let t of this.ranges) if (t.to > e) return Math.max(e, t.from);
			return this.end;
		}
		peek(e) {
			let t = this.chunkOff + e, n, r;
			if (t >= 0 && t < this.chunk.length) n = this.pos + e, r = this.chunk.charCodeAt(t);
			else {
				let t = this.resolveOffset(e, 1);
				if (t == null) return -1;
				if (n = t, n >= this.chunk2Pos && n < this.chunk2Pos + this.chunk2.length) r = this.chunk2.charCodeAt(n - this.chunk2Pos);
				else {
					let e = this.rangeIndex, t = this.range;
					for (; t.to <= n;) t = this.ranges[++e];
					this.chunk2 = this.input.chunk(this.chunk2Pos = n), n + this.chunk2.length > t.to && (this.chunk2 = this.chunk2.slice(0, t.to - n)), r = this.chunk2.charCodeAt(0);
				}
			}
			return n >= this.token.lookAhead && (this.token.lookAhead = n + 1), r;
		}
		acceptToken(e, t = 0) {
			let n = t ? this.resolveOffset(t, -1) : this.pos;
			if (n == null || n < this.token.start) throw RangeError("Token end out of bounds");
			this.token.value = e, this.token.end = n;
		}
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
			return this.next = this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? -1 : this.chunk.charCodeAt(this.chunkOff);
		}
		advance(e = 1) {
			for (this.chunkOff += e; this.pos + e >= this.range.to;) {
				if (this.rangeIndex == this.ranges.length - 1) return this.setDone();
				e -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
			}
			return this.pos += e, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
		}
		setDone() {
			return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
		}
		reset(e, t) {
			if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = $x, this.pos != e) {
				if (this.pos = e, e == this.end) return this.setDone(), this;
				for (; e < this.range.from;) this.range = this.ranges[--this.rangeIndex];
				for (; e >= this.range.to;) this.range = this.ranges[++this.rangeIndex];
				e >= this.chunkPos && e < this.chunkPos + this.chunk.length ? this.chunkOff = e - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
			}
			return this;
		}
		read(e, t) {
			if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length) return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
			if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length) return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
			if (e >= this.range.from && t <= this.range.to) return this.input.read(e, t);
			let n = "";
			for (let r of this.ranges) {
				if (r.from >= t) break;
				r.to > e && (n += this.input.read(Math.max(r.from, e), Math.min(r.to, t)));
			}
			return n;
		}
	}, tS = class {
		constructor(e, t) {
			this.data = e, this.id = t;
		}
		token(e, t) {
			let { parser: n } = t.p;
			Bx(this.data, e, t, this.id, n.data, n.tokenPrecTable);
		}
	}, tS.prototype.contextual = tS.prototype.fallback = tS.prototype.extend = !1, nS = class {
		constructor(e, t, n) {
			this.precTable = t, this.elseToken = n, this.data = typeof e == "string" ? zx(e) : e;
		}
		token(e, t) {
			let n = e.pos, r = 0;
			for (;;) {
				let n = e.next < 0, i = e.resolveOffset(1, 1);
				if (Bx(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1) break;
				if (this.elseToken == null) return;
				if (n || r++, i == null) break;
				e.reset(i, e.token);
			}
			r && (e.reset(n, e.token), e.acceptToken(this.elseToken, r));
		}
	}, nS.prototype.contextual = tS.prototype.fallback = tS.prototype.extend = !1, rS = class {
		constructor(e, t = {}) {
			this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
		}
	}, iS = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG), aS = null, oS = class {
		constructor(e, t) {
			this.fragments = e, this.minRepeat = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.lastRepeat = null, this.lastRepeatPos = -1, this.nextFragment();
		}
		nextFragment() {
			let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
			if (e) {
				for (this.safeFrom = e.openStart ? Ux(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? Ux(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length;) this.trees.pop(), this.start.pop(), this.index.pop();
				this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
			} else this.nextStart = 1e9;
		}
		nodeAt(e) {
			if (e < this.nextStart) return null;
			for (; this.fragment && this.safeTo <= e;) this.nextFragment();
			if (!this.fragment) return null;
			for (;;) {
				let t = this.trees.length - 1;
				if (t < 0) return this.nextFragment(), null;
				if (e < this.safeFrom) return null;
				let n = this.trees[t], r = this.index[t];
				if (r == n.children.length) {
					this.trees.pop(), this.start.pop(), this.index.pop();
					continue;
				}
				let i = n.children[r], a = this.start[t] + n.positions[r];
				if (a > e) return this.nextStart = a, null;
				if (i instanceof _v) {
					let n = a > this.lastRepeatPos && i.type.id >= this.minRepeat;
					if (a == e || n) {
						let t = a + i.length, r;
						if (a >= this.safeFrom && t <= this.safeTo && (!(r = i.prop(Z.lookAhead)) || t + r < this.fragment.to) && (n && (this.lastRepeat = i, this.lastRepeatPos = a), a == e)) return i;
					}
					this.index[t]++, a + i.length >= Math.max(this.safeFrom, e) && (this.trees.push(i), this.start.push(a), this.index.push(0));
				} else this.index[t]++, this.nextStart = a + i.length;
			}
		}
	}, sS = class {
		constructor(e, t) {
			this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((e) => new Qx());
		}
		getActions(e) {
			let t = 0, n = null, { parser: r } = e.p, { tokenizers: i } = r, a = r.stateSlot(e.state, 3), o = e.curContext ? e.curContext.hash : 0, s = 0;
			for (let r = 0; r < i.length; r++) {
				if (!(1 << r & a)) continue;
				let c = i[r], l = this.tokens[r];
				if ((!n || c.fallback) && ((c.contextual || l.start != e.pos || l.mask != a || l.context != o) && (this.updateCachedToken(l, c, e), l.mask = a, l.context = o), l.lookAhead > l.end + 25 && (s = Math.max(l.lookAhead, s)), l.value != 0)) {
					let r = t;
					if (l.extended > -1 && (t = this.addActions(e, l.extended, l.end, t)), t = this.addActions(e, l.value, l.end, t), !c.extend && (n = l, t > r)) break;
				}
			}
			for (; this.actions.length > t;) this.actions.pop();
			return s && e.setLookAhead(s), !n && e.pos == this.stream.end && (n = new Qx(), n.value = e.p.parser.eofTerm, n.start = n.end = e.pos, t = this.addActions(e, n.value, n.end, t)), this.mainToken = n, this.actions;
		}
		getMainToken(e) {
			if (this.mainToken) return this.mainToken;
			let t = new Qx(), { pos: n, p: r } = e;
			return t.start = n, t.end = Math.min(n + 1, r.stream.end), t.value = n == r.stream.end ? r.parser.eofTerm : 0, t;
		}
		updateCachedToken(e, t, n) {
			let r = this.stream.clipPos(n.pos);
			if (t.token(this.stream.reset(r, e), n), e.value > -1) {
				let { parser: t } = n.p;
				for (let r = 0; r < t.specialized.length; r++) if (t.specialized[r] == e.value) {
					let i = t.specializers[r](this.stream.read(e.start, e.end), n);
					if (i >= 0 && n.p.parser.dialect.allows(i >> 1)) {
						i & 1 ? e.extended = i >> 1 : e.value = i >> 1;
						break;
					}
				}
			} else e.value = 0, e.end = this.stream.clipPos(r + 1);
		}
		putAction(e, t, n, r) {
			for (let t = 0; t < r; t += 3) if (this.actions[t] == e) return r;
			return this.actions[r++] = e, this.actions[r++] = t, this.actions[r++] = n, r;
		}
		addActions(e, t, n, r) {
			let { state: i } = e, { parser: a } = e.p, { data: o } = a;
			for (let e = 0; e < 2; e++) for (let s = a.stateSlot(i, e ? 2 : 1);; s += 3) {
				if (o[s] == 65535) {
					if (o[s + 1] == 1) s = Gx(o, s + 2);
					else {
						r == 0 && o[s + 1] == 2 && (r = this.putAction(Gx(o, s + 2), t, n, r));
						break;
					}
				}
				o[s] == t && (r = this.putAction(Gx(o, s + 1), t, n, r));
			}
			return r;
		}
	}, cS = class {
		constructor(e, t, n, r) {
			this.parser = e, this.input = t, this.ranges = r, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new eS(t, r), this.tokens = new sS(e, this.stream), this.topTerm = e.top[1];
			let { from: i } = r[0];
			this.stacks = [Jx.start(this, e.top[0], i)], this.fragments = n.length && this.stream.end - i > e.bufferLength * 4 ? new oS(n, e.minRepeatTerm) : null;
		}
		get parsedPos() {
			return this.minStackPos;
		}
		advance() {
			let e = this.stacks, t = this.minStackPos, n = this.stacks = [], r, i;
			if (this.bigReductionCount > 300 && e.length == 1) {
				let [t] = e;
				for (; t.forceReduce() && t.stack.length && t.stack[t.stack.length - 2] >= this.lastBigReductionStart;);
				this.bigReductionCount = this.lastBigReductionSize = 0;
			}
			for (let a = 0; a < e.length; a++) {
				let o = e[a];
				for (;;) {
					if (this.tokens.mainToken = null, o.pos > t) n.push(o);
					else if (this.advanceStack(o, n, e)) continue;
					else {
						r || (r = [], i = []), r.push(o);
						let e = this.tokens.getMainToken(o);
						i.push(e.value, e.end);
					}
					break;
				}
			}
			if (!n.length) {
				let e = r && Kx(r);
				if (e) return iS && console.log("Finish with " + this.stackID(e)), this.stackToTree(e);
				if (this.parser.strict) throw iS && r && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), SyntaxError("No parse at " + t);
				this.recovering ||= 5;
			}
			if (this.recovering && r) {
				let e = this.stoppedAt != null && r[0].pos > this.stoppedAt ? r[0] : this.runRecovery(r, i, n);
				if (e) return iS && console.log("Force-finish " + this.stackID(e)), this.stackToTree(e.forceAll());
			}
			if (this.recovering) {
				let e = this.recovering == 1 ? 1 : this.recovering * 3;
				if (n.length > e) for (n.sort((e, t) => t.score - e.score); n.length > e;) n.pop();
				n.some((e) => e.reducePos > t) && this.recovering--;
			} else if (n.length > 1) {
				outer: for (let e = 0; e < n.length - 1; e++) {
					let t = n[e];
					for (let r = e + 1; r < n.length; r++) {
						let i = n[r];
						if (t.sameState(i) || t.buffer.length > 500 && i.buffer.length > 500) {
							if ((t.score - i.score || t.buffer.length - i.buffer.length) > 0) n.splice(r--, 1);
							else {
								n.splice(e--, 1);
								continue outer;
							}
						}
					}
				}
				n.length > 12 && (n.sort((e, t) => t.score - e.score), n.splice(12, n.length - 12));
			}
			this.minStackPos = n[0].pos;
			for (let e = 1; e < n.length; e++) n[e].pos < this.minStackPos && (this.minStackPos = n[e].pos);
			return null;
		}
		stopAt(e) {
			if (this.stoppedAt != null && this.stoppedAt < e) throw RangeError("Can't move stoppedAt forward");
			this.stoppedAt = e;
		}
		tryReuse(e, t, n, r) {
			if (!n) return null;
			let i = e.curContext && e.curContext.tracker.strict, a = i ? e.curContext.hash : 0;
			for (; n;) {
				let o = this.parser.nodeSet.types[n.type.id] == n.type ? this.parser.getGoto(e.state, n.type.id) : -1;
				if (o > -1 && n.length && (!i || (n.prop(Z.contextHash) || 0) == a)) return e.useNode(n, o, t), n;
				if (n.children.length == 0 || n.positions[0] > 0) break;
				let s = n.children[0];
				if (s instanceof _v && (!r || s.type.id >= this.parser.minRepeatTerm)) n = s;
				else break;
			}
			return null;
		}
		advanceStack(e, t, n) {
			let r = e.pos, { parser: i } = this, a = iS ? this.stackID(e) + " -> " : "";
			if (this.stoppedAt != null && r > this.stoppedAt) return e.forceReduce() ? e : null;
			if (this.fragments) {
				let t = e.reducePos < r && e.buffer.length && e.buffer[e.buffer.length - 2] <= e.reducePos && this.fragments.lastRepeatPos == e.reducePos && this.tryReuse(e, e.reducePos, this.fragments.lastRepeat, !0) || this.tryReuse(e, r, this.fragments.nodeAt(r), !1);
				if (t) return iS && console.log(a + this.stackID(e) + ` (via reuse of ${i.getName(t.type.id)})`), !0;
			}
			let o = i.stateSlot(e.state, 4);
			if (o > 0) return e.reduce(o), iS && console.log(a + this.stackID(e) + ` (via always-reduce ${i.getName(o & 65535)})`), !0;
			if (e.stack.length >= 8400) for (; e.stack.length > 6e3 && e.forceReduce(););
			let s = this.tokens.getActions(e);
			for (let o = 0; o < s.length;) {
				let c = s[o++], l = s[o++], u = s[o++], d = o == s.length || !n, f = d ? e : e.split(), p = this.tokens.mainToken;
				if (f.apply(c, l, p ? p.start : f.pos, u), iS && console.log(a + this.stackID(f) + ` (via ${c & 65536 ? `reduce of ${i.getName(c & 65535)}` : "shift"} for ${i.getName(l)} @ ${r}${f == e ? "" : ", split"})`), d) return !0;
				f.pos > r ? t.push(f) : n.push(f);
			}
			return !1;
		}
		advanceFully(e, t) {
			let n = e.pos;
			for (;;) {
				if (!this.advanceStack(e, null, null)) return !1;
				if (e.pos > n) return Wx(e, t), !0;
			}
		}
		runRecovery(e, t, n) {
			let r = null, i = !1;
			for (let a = 0; a < e.length; a++) {
				let o = e[a], s = t[a << 1], c = t[(a << 1) + 1], l = iS ? this.stackID(o) + " -> " : "";
				if (o.deadEnd && (i || (i = !0, o.restart(), iS && console.log(l + this.stackID(o) + " (restarted)"), this.advanceFully(o, n)))) continue;
				let u = o.split(), d = l;
				for (let e = 0; e < 10 && u.forceReduce() && (iS && console.log(d + this.stackID(u) + " (via force-reduce)"), !this.advanceFully(u, n)); e++) iS && (d = this.stackID(u) + " -> ");
				for (let e of o.recoverByInsert(s)) iS && console.log(l + this.stackID(e) + " (via recover-insert)"), this.advanceFully(e, n);
				this.stream.end > o.pos ? (c == o.pos && (c++, s = 0), o.recoverByDelete(s, c), iS && console.log(l + this.stackID(o) + ` (via recover-delete ${this.parser.getName(s)})`), Wx(o, n)) : (!r || r.score < u.score) && (r = u);
			}
			return r;
		}
		stackToTree(e) {
			return e.close(), _v.build({
				buffer: Zx.create(e),
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
			let t = (aS ||= /* @__PURE__ */ new WeakMap()).get(e);
			return t || aS.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
		}
	}, lS = class {
		constructor(e, t, n) {
			this.source = e, this.flags = t, this.disabled = n;
		}
		allows(e) {
			return !this.disabled || this.disabled[e] == 0;
		}
	}, uS = (e) => e, dS = class {
		constructor(e) {
			this.start = e.start, this.shift = e.shift || uS, this.reduce = e.reduce || uS, this.reuse = e.reuse || uS, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
		}
	}, fS = class e extends kv {
		constructor(e) {
			if (super(), this.wrappers = [], e.version != 14) throw RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
			let t = e.nodeNames.split(" ");
			this.minRepeatTerm = t.length;
			for (let n = 0; n < e.repeatNodeCount; n++) t.push("");
			let n = Object.keys(e.topRules).map((t) => e.topRules[t][1]), r = [];
			for (let e = 0; e < t.length; e++) r.push([]);
			function i(e, t, n) {
				r[e].push([t, t.deserialize(String(n))]);
			}
			if (e.nodeProps) for (let t of e.nodeProps) {
				let e = t[0];
				typeof e == "string" && (e = Z[e]);
				for (let n = 1; n < t.length;) {
					let r = t[n++];
					if (r >= 0) i(r, e, t[n++]);
					else {
						let a = t[n + -r];
						for (let o = -r; o > 0; o--) i(t[n++], e, a);
						n++;
					}
				}
			}
			this.nodeSet = new pv(t.map((t, i) => fv.define({
				name: i >= this.minRepeatTerm ? void 0 : t,
				id: i,
				props: r[i],
				top: n.indexOf(i) > -1,
				error: i == 0,
				skipped: e.skippedNodes && e.skippedNodes.indexOf(i) > -1
			}))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = sv;
			let a = zx(e.tokenData);
			this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
			for (let e = 0; e < this.specializerSpecs.length; e++) this.specialized[e] = this.specializerSpecs[e].term;
			this.specializers = this.specializerSpecs.map(qx), this.states = zx(e.states, Uint32Array), this.data = zx(e.stateData), this.goto = zx(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((e) => typeof e == "number" ? new tS(a, e) : e), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
		}
		createParse(e, t, n) {
			let r = new cS(this, e, t, n);
			for (let i of this.wrappers) r = i(r, e, t, n);
			return r;
		}
		getGoto(e, t, n = !1) {
			let r = this.goto;
			if (t >= r[0]) return -1;
			for (let i = r[t + 1];;) {
				let t = r[i++], a = t & 1, o = r[i++];
				if (a && n) return o;
				for (let n = i + (t >> 1); i < n; i++) if (r[i] == e) return o;
				if (a) return -1;
			}
		}
		hasAction(e, t) {
			let n = this.data;
			for (let r = 0; r < 2; r++) for (let i = this.stateSlot(e, r ? 2 : 1), a;; i += 3) {
				if ((a = n[i]) == 65535) {
					if (n[i + 1] == 1) a = n[i = Gx(n, i + 2)];
					else if (n[i + 1] == 2) return Gx(n, i + 2);
					else break;
				}
				if (a == t || a == 0) return Gx(n, i + 1);
			}
			return 0;
		}
		stateSlot(e, t) {
			return this.states[e * 6 + t];
		}
		stateFlag(e, t) {
			return (this.stateSlot(e, 0) & t) > 0;
		}
		validAction(e, t) {
			return !!this.allActions(e, (e) => e == t || null);
		}
		allActions(e, t) {
			let n = this.stateSlot(e, 4), r = n ? t(n) : void 0;
			for (let n = this.stateSlot(e, 1); r == null; n += 3) {
				if (this.data[n] == 65535) {
					if (this.data[n + 1] == 1) n = Gx(this.data, n + 2);
					else break;
				}
				r = t(Gx(this.data, n + 1));
			}
			return r;
		}
		nextStates(e) {
			let t = [];
			for (let n = this.stateSlot(e, 1);; n += 3) {
				if (this.data[n] == 65535) {
					if (this.data[n + 1] == 1) n = Gx(this.data, n + 2);
					else break;
				}
				if (!(this.data[n + 2] & 1)) {
					let e = this.data[n + 1];
					t.some((t, n) => n & 1 && t == e) || t.push(this.data[n], e);
				}
			}
			return t;
		}
		configure(t) {
			let n = Object.assign(Object.create(e.prototype), this);
			if (t.props && (n.nodeSet = this.nodeSet.extend(...t.props)), t.top) {
				let e = this.topRules[t.top];
				if (!e) throw RangeError(`Invalid top rule name ${t.top}`);
				n.top = e;
			}
			return t.tokenizers && (n.tokenizers = this.tokenizers.map((e) => {
				let n = t.tokenizers.find((t) => t.from == e);
				return n ? n.to : e;
			})), t.specializers && (n.specializers = this.specializers.slice(), n.specializerSpecs = this.specializerSpecs.map((e, r) => {
				let i = t.specializers.find((t) => t.from == e.external);
				if (!i) return e;
				let a = Object.assign(Object.assign({}, e), { external: i.to });
				return n.specializers[r] = qx(a), a;
			})), t.contextTracker && (n.context = t.contextTracker), t.dialect && (n.dialect = this.parseDialect(t.dialect)), t.strict != null && (n.strict = t.strict), t.wrap && (n.wrappers = n.wrappers.concat(t.wrap)), t.bufferLength != null && (n.bufferLength = t.bufferLength), n;
		}
		hasWrappers() {
			return this.wrappers.length > 0;
		}
		getName(e) {
			return this.termNames ? this.termNames[e] : String(e <= this.maxNode && this.nodeSet.types[e].name || e);
		}
		get eofTerm() {
			return this.maxNode + 1;
		}
		get topNode() {
			return this.nodeSet.types[this.top[1]];
		}
		dynamicPrecedence(e) {
			let t = this.dynamicPrecedences;
			return t == null ? 0 : t[e] || 0;
		}
		parseDialect(e) {
			let t = Object.keys(this.dialects), n = t.map(() => !1);
			if (e) for (let r of e.split(" ")) {
				let e = t.indexOf(r);
				e >= 0 && (n[e] = !0);
			}
			let r = null;
			for (let e = 0; e < t.length; e++) if (!n[e]) for (let n = this.dialects[t[e]], i; (i = this.data[n++]) != 65535;) (r ||= new Uint8Array(this.maxTerm + 1))[i] = 1;
			return new lS(e, n, r);
		}
		static deserialize(t) {
			return new e(t);
		}
	};
}));
// node_modules/@lezer/javascript/dist/index.js
function mS(e, t) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e == 95 || e >= 192 || !t && e >= 48 && e <= 57;
}
var hS, gS, _S, vS, yS, bS, xS, SS, CS, wS, TS, ES, DS, OS, kS, AS, jS, MS, NS, PS, FS, IS, LS, RS, zS, BS, VS, HS, US, WS, GS, KS, qS, JS, YS, XS = t((() => {
	pS(), ly(), hS = 317, gS = 318, _S = 1, vS = 2, yS = 3, bS = 4, xS = 319, SS = 321, CS = 322, wS = 5, TS = 6, ES = 0, DS = [
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
	], OS = 125, kS = 59, AS = 47, jS = 42, MS = 43, NS = 45, PS = 60, FS = 44, IS = 63, LS = 46, RS = 91, zS = new dS({
		start: !1,
		shift(e, t) {
			return t == wS || t == TS || t == SS ? e : t == CS;
		},
		strict: !1
	}), BS = new rS((e, t) => {
		let { next: n } = e;
		(n == OS || n == -1 || t.context) && e.acceptToken(xS);
	}, {
		contextual: !0,
		fallback: !0
	}), VS = new rS((e, t) => {
		let { next: n } = e, r;
		DS.indexOf(n) > -1 || (n != AS || (r = e.peek(1)) != AS && r != jS) && n != OS && n != kS && n != -1 && !t.context && e.acceptToken(hS);
	}, { contextual: !0 }), HS = new rS((e, t) => {
		e.next == RS && !t.context && e.acceptToken(gS);
	}, { contextual: !0 }), US = new rS((e, t) => {
		let { next: n } = e;
		if (n == MS || n == NS) {
			if (e.advance(), n == e.next) {
				e.advance();
				let n = !t.context && t.canShift(_S);
				e.acceptToken(n ? _S : vS);
			}
		} else n == IS && e.peek(1) == LS && (e.advance(), e.advance(), (e.next < 48 || e.next > 57) && e.acceptToken(yS));
	}, { contextual: !0 }), WS = new rS((e, t) => {
		if (e.next != PS || !t.dialectEnabled(ES) || (e.advance(), e.next == AS)) return;
		let n = 0;
		for (; DS.indexOf(e.next) > -1;) e.advance(), n++;
		if (mS(e.next, !0)) {
			for (e.advance(), n++; mS(e.next, !1);) e.advance(), n++;
			for (; DS.indexOf(e.next) > -1;) e.advance(), n++;
			if (e.next == FS) return;
			for (let t = 0;; t++) {
				if (t == 7) {
					if (!mS(e.next, !0)) return;
					break;
				}
				if (e.next != "extends".charCodeAt(t)) break;
				e.advance(), n++;
			}
		}
		e.acceptToken(bS, -n);
	}), GS = Fv({
		"get set async static": $.modifier,
		"for while do if else switch try catch finally return throw break continue default case defer": $.controlKeyword,
		"in of await yield void typeof delete instanceof as satisfies": $.operatorKeyword,
		"let var const using function class extends": $.definitionKeyword,
		"import export from": $.moduleKeyword,
		"with debugger new": $.keyword,
		TemplateString: $.special($.string),
		super: $.atom,
		BooleanLiteral: $.bool,
		this: $.self,
		null: $.null,
		Star: $.modifier,
		VariableName: $.variableName,
		"CallExpression/VariableName TaggedTemplateExpression/VariableName": $.function($.variableName),
		VariableDefinition: $.definition($.variableName),
		Label: $.labelName,
		PropertyName: $.propertyName,
		PrivatePropertyName: $.special($.propertyName),
		"CallExpression/MemberExpression/PropertyName": $.function($.propertyName),
		"FunctionDeclaration/VariableDefinition": $.function($.definition($.variableName)),
		"ClassDeclaration/VariableDefinition": $.definition($.className),
		"NewExpression/VariableName": $.className,
		PropertyDefinition: $.definition($.propertyName),
		PrivatePropertyDefinition: $.definition($.special($.propertyName)),
		UpdateOp: $.updateOperator,
		"LineComment Hashbang": $.lineComment,
		BlockComment: $.blockComment,
		Number: $.number,
		String: $.string,
		Escape: $.escape,
		ArithOp: $.arithmeticOperator,
		LogicOp: $.logicOperator,
		BitOp: $.bitwiseOperator,
		CompareOp: $.compareOperator,
		RegExp: $.regexp,
		Equals: $.definitionOperator,
		Arrow: $.function($.punctuation),
		": Spread": $.punctuation,
		"( )": $.paren,
		"[ ]": $.squareBracket,
		"{ }": $.brace,
		"InterpolationStart InterpolationEnd": $.special($.brace),
		".": $.derefOperator,
		", ;": $.separator,
		"@": $.meta,
		TypeName: $.typeName,
		TypeDefinition: $.definition($.typeName),
		"type enum interface implements namespace module declare": $.definitionKeyword,
		"abstract global Privacy readonly override": $.modifier,
		"is keyof unique infer asserts": $.operatorKeyword,
		JSXAttributeValue: $.attributeValue,
		JSXText: $.content,
		"JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": $.angleBracket,
		"JSXIdentifier JSXNameSpacedName": $.tagName,
		"JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": $.attributeName,
		"JSXBuiltin/JSXIdentifier": $.standard($.tagName)
	}), KS = {
		__proto__: null,
		export: 20,
		as: 25,
		from: 33,
		default: 36,
		async: 41,
		function: 42,
		in: 52,
		out: 55,
		const: 56,
		extends: 60,
		this: 64,
		true: 72,
		false: 72,
		null: 84,
		void: 88,
		typeof: 92,
		super: 108,
		new: 142,
		delete: 154,
		yield: 163,
		await: 167,
		class: 172,
		public: 237,
		private: 237,
		protected: 237,
		readonly: 239,
		instanceof: 258,
		satisfies: 261,
		import: 294,
		keyof: 351,
		unique: 355,
		infer: 361,
		asserts: 397,
		is: 399,
		abstract: 419,
		implements: 421,
		type: 423,
		let: 426,
		var: 428,
		using: 431,
		interface: 437,
		enum: 441,
		namespace: 447,
		module: 449,
		declare: 453,
		global: 457,
		defer: 473,
		for: 478,
		of: 487,
		while: 490,
		with: 494,
		do: 498,
		if: 502,
		else: 504,
		switch: 508,
		case: 514,
		try: 520,
		catch: 524,
		finally: 528,
		return: 532,
		throw: 536,
		break: 540,
		continue: 544,
		debugger: 548
	}, qS = {
		__proto__: null,
		async: 129,
		get: 131,
		set: 133,
		declare: 195,
		public: 197,
		private: 197,
		protected: 197,
		static: 199,
		abstract: 201,
		override: 203,
		readonly: 209,
		accessor: 211,
		new: 403
	}, JS = {
		__proto__: null,
		"<": 193
	}, YS = fS.deserialize({
		version: 14,
		states: "$GSQ%TQlOOO%[QlOOO'_QpOOP(lO`OOO*zQ!0MxO'#CiO+RO#tO'#CjO+aO&jO'#CjO+oO#@ItO'#DaO.QQlO'#DgO.bQlO'#DrO%[QlO'#DzO0fQlO'#ESOOQ!0Lf'#E['#E[O1PQ`O'#EXOOQO'#Ep'#EpOOQO'#Im'#ImO1XQ`O'#GtO1dQ`O'#EoO1iQ`O'#EoO3hQ!0MxO'#JsO6[Q!0MxO'#JtO6uQ`O'#F^O6zQ,UO'#FuOOQ!0Lf'#Fg'#FgO7VO7dO'#FgO9XQMhO'#F}O9`Q`O'#F|OOQ!0Lf'#Jt'#JtOOQ!0Lb'#Js'#JsO9eQ`O'#GxOOQ['#K`'#K`O9pQ`O'#IZO9uQ!0LrO'#I[OOQ['#Ja'#JaOOQ['#I`'#I`Q`QlOOQ`QlOOO9}Q!L^O'#DvO:UQlO'#EOO:]QlO'#EQO9kQ`O'#GtO:dQMhO'#CoO:rQ`O'#EnO:}Q`O'#EzO;hQMhO'#FfO;xQ`O'#GtOOQO'#Ka'#KaO;}Q`O'#KaO<]Q`O'#G|O<]Q`O'#G}O<]Q`O'#HPO9kQ`O'#HSO=SQ`O'#HVO>kQ`O'#CeO>{Q`O'#HdO?TQ`O'#HjO?TQ`O'#HlO`QlO'#HnO?TQ`O'#HpO?TQ`O'#HsO?YQ`O'#HyO?_Q!0LsO'#IPO%[QlO'#IRO?jQ!0LsO'#ITO?uQ!0LsO'#IVO9uQ!0LrO'#IXO@QQ!0MxO'#CiOASQpO'#DlQOQ`OOO%[QlO'#EQOAjQ`O'#ETO:dQMhO'#EnOAuQ`O'#EnOBQQ!bO'#FfOOQ['#Cg'#CgOOQ!0Lb'#Dq'#DqOOQ!0Lb'#Jw'#JwO%[QlO'#JwOOQO'#Jz'#JzOOQO'#Ii'#IiOCQQpO'#EgOOQ!0Lb'#Ef'#EfOOQ!0Lb'#KO'#KOOC|Q!0MSO'#EgODWQpO'#EWOOQO'#Jy'#JyODlQpO'#JzOEyQpO'#EWODWQpO'#EgPFWO&2DjO'#CbPOOO)CEO)CEOOOOO'#Ia'#IaOFcO#tO,59UOOQ!0Lh,59U,59UOOOO'#Ib'#IbOFqO&jO,59UOGPQ!L^O'#DcOOOO'#Id'#IdOGWO#@ItO,59{OOQ!0Lf,59{,59{OGfQlO'#IeOGyQ`O'#JuOIxQ!fO'#JuO+}QlO'#JuOJPQ`O,5:ROJgQ`O'#EpOJtQ`O'#KUOKPQ`O'#KTOKPQ`O'#KTOKXQ`O,5;^OK^Q`O'#KSOOQ!0Ln,5:^,5:^OKeQlO,5:^OMcQ!0MxO,5:fONSQ`O,5:nONmQ!0LrO'#KRONtQ`O'#KQO9eQ`O'#KQO! YQ`O'#KQO! bQ`O,5;]O! gQ`O'#KQO!#lQ!fO'#JtOOQ!0Lh'#Ci'#CiO%[QlO'#ESO!$[Q!fO,5:sOOQS'#J{'#J{OOQO-E<k-E<kO9kQ`O,5=`O!$rQ`O,5=`O!$wQlO,5;ZO!&zQMhO'#EkO!(eQ`O,5;ZO!(jQlO'#DyO!(tQpO,5;eO!(|QpO,5;eO%[QlO,5;eOOQ['#FU'#FUOOQ['#FW'#FWO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fOOQ['#F['#F[O!)[QlO,5;uOOQ!0Lf,5;z,5;zOOQ!0Lf,5;{,5;{OOQ!0Lf,5;},5;}O%[QlO'#IqO!+_Q!0LrO,5<jO%[QlO,5;fO!&zQMhO,5;fO!+|QMhO,5;fO!-nQMhO'#E^O%[QlO,5;xOOQ!0Lf,5;|,5;|O!-uQ,UO'#FkO!.rQ,UO'#KYO!.^Q,UO'#KYO!.yQ,UO'#KYOOQO'#KY'#KYO!/_Q,UO,5<TOOOW,5<a,5<aO!/pQlO'#FwOOOW'#Ip'#IpO7VO7dO,5<RO!/wQ,UO'#FyOOQ!0Lf,5<R,5<RO!0hQ$IUO'#CyOOQ!0Lh'#C}'#C}O!0{O#@ItO'#DRO!1iQMjO,5<fO!1pQ`O,5<iO!3YQ(CWO'#GYO!3jQ`O'#GZO!3oQ`O'#GZO!5_Q(CWO'#G_O!6dQpO'#GcOOQO'#Go'#GoO!,TQMhO'#GnOOQO'#Gq'#GqO!,TQMhO'#GpO!7VQ$IUO'#JmOOQ!0Lh'#Jm'#JmO!7aQ`O'#JlO!7oQ`O'#JkO!7wQ`O'#CuOOQ!0Lh'#C{'#C{O!8YQ`O'#C}OOQ!0Lh'#DV'#DVOOQ!0Lh'#DX'#DXO!8_Q`O,5<fO1SQ`O'#DZO!,TQMhO'#GQO!,TQMhO'#GSO!8gQ`O'#GUO!8lQ`O'#GVO!3oQ`O'#G]O!,TQMhO'#GbO<]Q`O'#JlO!8qQ`O'#EqO!9`Q`O,5<hOOQ!0Lb'#Cr'#CrO!9hQ`O'#ErO!:bQpO'#EsOOQ!0Lb'#KS'#KSO!:iQ!0LrO'#KbO9uQ!0LrO,5=dO`QlO,5>uOOQ['#Ji'#JiOOQ[,5>v,5>vOOQ[-E<^-E<^O!<hQ!0MxO,5:bO!=[QpO,5:`O!?WQ!0MxO,5:jO%[QlO,5:jO!AnQ!0MxO,5:lOOQO,5@{,5@{O!B_QMhO,5=`O!BmQ!0LrO'#JjO9`Q`O'#JjO!COQ!0LrO,59ZO!CZQpO,59ZO!CcQMhO,59ZO:dQMhO,59ZO!CnQ`O,5;ZO!CvQ`O'#HcO!D[Q`O'#KeO%[QlO,5<OO!=[QpO,5<QO!DdQ`O,5={O!DiQ`O,5={O!DnQ`O,5={O!D|Q`O,5={O9uQ!0LrO,5={O<]Q`O,5=kOOQO'#Cy'#CyO!ETQpO,5=hO!E]QMhO,5=iO!EhQ`O,5=kO!EmQ!bO,5=nO!EuQ`O'#KaO?YQ`O'#HXO9kQ`O'#HZO!EzQ`O'#HZO:dQMhO'#H]O!FPQ`O'#H]OOQ[,5=q,5=qO!FUQ`O'#H^O!FgQ`O'#CoO!FlQ`O,59PO!FvQ`O,59PO!H{QlO,59POOQ[,59P,59PO!I]Q!0LrO,59PO%[QlO,59PO!KhQlO'#HfOOQ['#Hg'#HgOOQ['#Hh'#HhO`QlO,5>OO!LOQ`O,5>OO`QlO,5>UO`QlO,5>WO!LTQ`O,5>YO`QlO,5>[O!LYQ`O,5>_O!L_QlO,5>eOOQ[,5>k,5>kO%[QlO,5>kO9uQ!0LrO,5>mOOQ[,5>o,5>oO#!iQ`O,5>oOOQ[,5>q,5>qO#!iQ`O,5>qOOQ[,5>s,5>sO##VQpO'#D_O%[QlO'#JwO##aQpO'#JwO##{QpO'#DmO#$^QpO'#DmO#&oQlO'#DmO#&vQ`O'#JvO#'OQ`O,5:WO#'TQ`O'#EtO#'`Q`O'#EtO#'eQ`O'#KVO#'mQ`O,5;_O#'rQpO'#DmO#(PQpO'#EVOOQ!0Lf,5:o,5:oO%[QlO,5:oO#(WQ`O,5:oO?YQ`O,5;YO!CZQpO,5;YO!CcQMhO,5;YO:dQMhO,5;YO#(`Q`O,5@cO#(eQ07dO,5:sOOQO-E<g-E<gO#)kQ!0MSO,5;RODWQpO,5:rO#)uQpO,5:rODWQpO,5;RO!COQ!0LrO,5:rOOQ!0Lb'#Ej'#EjOOQO,5;R,5;RO%[QlO,5;RO#*SQ!0LrO,5;RO#*_Q!0LrO,5;RO!CZQpO,5:rOOQO,5;X,5;XO#*mQ!0LrO,5;RPOOO'#I_'#I_P#+RO&2DjO,58|POOO,58|,58|OOOO-E<_-E<_OOQ!0Lh1G.p1G.pOOOO-E<`-E<`OOOO,59},59}O#+^Q!bO,59}OOOO-E<b-E<bOOQ!0Lf1G/g1G/gO#+cQ!fO,5?PO+}QlO,5?POOQO,5?V,5?VO#+mQlO'#IeOOQO-E<c-E<cO#+zQ`O,5@aO#,SQ!fO,5@aO#,ZQ`O,5@oOOQ!0Lf1G/m1G/mO%[QlO,5@pO#,cQ`O'#IkOOQO-E<i-E<iO#,ZQ`O,5@oOOQ!0Lb1G0x1G0xOOQ!0Ln1G/x1G/xOOQ!0Ln1G0Y1G0YO%[QlO,5@mO#,wQ!0LrO,5@mO#-YQ!0LrO,5@mO#-aQ`O,5@lO9eQ`O,5@lO#-iQ`O,5@lO#-wQ`O'#InO#-aQ`O,5@lOOQ!0Lb1G0w1G0wO!(tQpO,5:uO!)PQpO,5:uOOQS,5:w,5:wO#.iQdO,5:wO#.qQMhO1G2zO9kQ`O1G2zOOQ!0Lf1G0u1G0uO#/PQ!0MxO1G0uO#0UQ!0MvO,5;VOOQ!0Lh'#GX'#GXO#0rQ!0MzO'#JmO!$wQlO1G0uO#2}Q!fO'#JxO%[QlO'#JxO#3XQ`O,5:eOOQ!0Lh'#D_'#D_OOQ!0Lf1G1P1G1PO%[QlO1G1POOQ!0Lf1G1g1G1gO#3^Q`O1G1PO#5rQ!0MxO1G1QO#5yQ!0MxO1G1QO#8aQ!0MxO1G1QO#8hQ!0MxO1G1QO#;OQ!0MxO1G1QO#=fQ!0MxO1G1QO#=mQ!0MxO1G1QO#=tQ!0MxO1G1QO#@[Q!0MxO1G1QO#@cQ!0MxO1G1QO#BpQ?MtO'#CiO#DkQ?MtO1G1aO#DrQ?MtO'#JtO#EVQ!0MxO,5?]OOQ!0Lb-E<o-E<oO#GdQ!0MxO1G1QO#HaQ!0MzO1G1QOOQ!0Lf1G1Q1G1QO#IdQMjO'#J}O#InQ`O,5:xO#IsQ!0MxO1G1dO#JgQ,UO,5<XO#JoQ,UO,5<YO#JwQ,UO'#FpO#K`Q`O'#FoOOQO'#KZ'#KZOOQO'#Io'#IoO#KeQ,UO1G1oOOQ!0Lf1G1o1G1oOOOW1G1z1G1zO#KvQ?MtO'#JsO#LQQ`O,5<cO!)[QlO,5<cOOOW-E<n-E<nOOQ!0Lf1G1m1G1mO#LVQpO'#KYOOQ!0Lf,5<e,5<eO#L_QpO,5<eO#LdQMhO'#DTOOOO'#Ic'#IcO#LkO#@ItO,59mOOQ!0Lh,59m,59mO%[QlO1G2QO!8lQ`O'#IsO#LvQ`O,5<{OOQ!0Lh,5<x,5<xO!,TQMhO'#IvO#MdQMjO,5=YO!,TQMhO'#IxO#NVQMjO,5=[O!&zQMhO,5=^OOQO1G2T1G2TO#NaQ!dO'#CrO#NtQ(CWO'#ErO$ |QpO'#GcO$!dQ!dO,5<tO$!kQ`O'#K]O9eQ`O'#K]O$!yQ`O,5<vO$#aQ!dO'#C{O!,TQMhO,5<uO$#kQ`O'#G[O$$PQ`O,5<uO$$UQ!dO'#GXO$$cQ!dO'#K^O$$mQ`O'#K^O!&zQMhO'#K^O$$rQ`O,5<yO$$wQlO'#JwO$%RQpO'#GdO#$^QpO'#GdO$%dQ`O'#GhO!3oQ`O'#GlO$%iQ!0LrO'#IuO$%tQpO,5<}OOQ!0Lp,5<},5<}O$%{QpO'#GdO$&YQpO'#GeO$&kQpO'#GeO$&pQMjO,5=YO$'QQMjO,5=[OOQ!0Lh,5=_,5=_O!,TQMhO,5@WO!,TQMhO,5@WO$'bQ`O'#IzO$'vQ`O,5@VO$(OQ`O,59aOOQ!0Lh,59i,59iO$(TQ`O,5@WO$)TQ$IYO,59uOOQ!0Lh'#Jq'#JqO$)vQMjO,5<lO$*iQMjO,5<nO@zQ`O,5<pOOQ!0Lh,5<q,5<qO$*sQ`O,5<wO$*xQMjO,5<|O$+YQ`O'#KQO!$wQlO1G2SO$+_Q`O1G2SO9eQ`O'#KTO$+dQ`O'#D_O9eQ`O'#EtO%[QlO'#EtO9eQ`O'#I|O$+rQ!0LrO,5@|OOQ[1G3O1G3OOOQ[1G4a1G4aOOQ!0Lf1G/|1G/|OOQ!0Lf1G/z1G/zO$-tQ!0MxO1G0UOOQ[1G2z1G2zO!&zQMhO1G2zO%[QlO1G2zO#.tQ`O1G2zO$/xQMhO'#EkOOQ!0Lb,5@U,5@UO$0VQ!0LrO,5@UOOQ[1G.u1G.uO!COQ!0LrO1G.uO!CZQpO1G.uO!CcQMhO1G.uO$0hQ`O1G0uO$0mQ`O'#CiO$0xQ`O'#KfO$1QQ`O,5=}O$1VQ`O'#KfO$1[Q`O'#KfO$1jQ`O'#JSO$1xQ`O,5APO$2QQ!fO1G1jOOQ!0Lf1G1l1G1lO9kQ`O1G3gO@zQ`O1G3gO$2XQ`O1G3gO$2^Q`O1G3gO!DnQ`O1G3gO9uQ!0LrO1G3gOOQ[1G3g1G3gO!EhQ`O1G3VO!&zQMhO1G3SO$2cQ`O1G3SOOQ[1G3T1G3TO!&zQMhO1G3TO$2hQ`O1G3TO$2pQpO'#HROOQ[1G3V1G3VO!6_QpO'#JOO!EmQ!bO1G3YOOQ[1G3Y1G3YOOQ[,5=s,5=sO$2xQMhO,5=uO9kQ`O,5=uO$%dQ`O,5=wO9`Q`O,5=wO!CZQpO,5=wO!CcQMhO,5=wO:dQMhO,5=wO$3WQ`O'#KdO$3cQ`O,5=xOOQ[1G.k1G.kO$3hQ!0LrO1G.kO@zQ`O1G.kO$3sQ`O1G.kO9uQ!0LrO1G.kO$5{Q!fO,5ARO$6YQ`O,5ARO9eQ`O,5ARO$6eQlO,5>QO$6lQ`O,5>QOOQ[1G3j1G3jO`QlO1G3jOOQ[1G3p1G3pOOQ[1G3r1G3rO?TQ`O1G3tO$6qQlO1G3vO$:uQlO'#HuOOQ[1G3y1G3yO$;SQ`O'#H{O?YQ`O'#H}OOQ[1G4P1G4PO$;[QlO1G4PO9uQ!0LrO1G4VOOQ[1G4X1G4XOOQ!0Lb'#G`'#G`O9uQ!0LrO1G4ZO9uQ!0LrO1G4]O$?cQ`O,5@cO9eQ`O,5;`O?YQ`O,5:XO!)[QlO,5:XO!CZQpO,5:XO$?hQ?MtO,5:XOOQO,5;`,5;`O$?rQpO'#IfO$@YQ`O,5@bOOQ!0Lf1G/r1G/rO!)[QlO,5;`O$@bQpO'#IlO$@lQ`O,5@qOOQ!0Lb1G0y1G0yO#$^QpO,5:XOOQO'#Ih'#IhO$@tQpO,5:qOOQ!0Ln,5:q,5:qO#(ZQ`O1G0ZOOQ!0Lf1G0Z1G0ZO%[QlO1G0ZOOQ!0Lf1G0t1G0tO?YQ`O1G0tO!CZQpO1G0tO!CcQMhO1G0tOOQ!0Lb1G5}1G5}O!COQ!0LrO1G0^OOQO1G0m1G0mO%[QlO1G0mO$@{Q!0LrO1G0mO$AWQ!0LrO1G0mO!CZQpO1G0^ODWQpO1G0^O$AfQ!0LrO1G0mOOQO1G0^1G0^O$AzQ!0MxO1G0mPOOO-E<]-E<]POOO1G.h1G.hOOOO1G/i1G/iO$BUQ!bO,5<jO$B^Q!fO1G4kOOQO1G4q1G4qO%[QlO,5?PO$BhQ`O1G5{O$BpQ`O1G6ZO$BxQ!fO1G6[O9eQ`O,5?VO$CSQ!0MxO1G6XO%[QlO1G6XO$CdQ!0LrO1G6XO$CuQ`O1G6WO$CuQ`O1G6WO9eQ`O1G6WO$C}Q`O,5?YO9eQ`O,5?YOOQO,5?Y,5?YO$DcQ`O,5?YO$+YQ`O,5?YOOQO-E<l-E<lOOQS1G0a1G0aOOQS1G0c1G0cO#.lQ`O1G0cOOQ[7+(f7+(fO!&zQMhO7+(fO%[QlO7+(fO$DqQ`O7+(fO$D|QMhO7+(fO$E[Q!0MzO,5=YO$GgQ!0MzO,5=[O$IrQ!0MzO,5=YO$LTQ!0MzO,5=[O$NfQ!0MzO,59uO%!kQ!0MzO,5<lO%$vQ!0MzO,5<nO%'RQ!0MzO,5<|OOQ!0Lf7+&a7+&aO%)dQ!0MxO7+&aO%*WQlO'#IgO%*eQ`O,5@dO%*mQ!fO,5@dOOQ!0Lf1G0P1G0PO%*wQ`O7+&kOOQ!0Lf7+&k7+&kO%*|Q?MtO,5:fO%[QlO7+&{O%+WQ?MtO,5:bO%+eQ?MtO,5:jO%+oQ?MtO,5:lO%+yQMhO'#IjO%,TQ`O,5@iOOQ!0Lh1G0d1G0dOOQO1G1s1G1sOOQO1G1t1G1tO%,]Q!jO,5<[O!)[QlO,5<ZOOQO-E<m-E<mOOQ!0Lf7+'Z7+'ZOOOW7+'f7+'fOOOW1G1}1G1}O%,hQ`O1G1}OOQ!0Lf1G2P1G2POOOO,59o,59oO%,mQ!dO,59oOOOO-E<a-E<aOOQ!0Lh1G/X1G/XO%,tQ!0MxO7+'lOOQ!0Lh,5?_,5?_O%-hQMhO1G2gP%-oQ`O'#IsPOQ!0Lh-E<q-E<qO%.]QMjO,5?bOOQ!0Lh-E<t-E<tO%/OQMjO,5?dOOQ!0Lh-E<v-E<vO%/YQ!dO1G2xO%/aQ!dO'#CrO%/wQMhO'#KTO$$wQlO'#JwOOQ!0Lh1G2`1G2`O%0RQ`O'#IrO%0jQ`O,5@wO%0jQ`O,5@wO%0rQ`O,5@wO%0}Q`O,5@wOOQO1G2b1G2bO%1]QMjO1G2aO$+YQ`O'#K]O!,TQMhO1G2aO%1mQ(CWO'#ItO%1zQ`O,5@xO!&zQMhO,5@xO%2SQ!dO,5@xOOQ!0Lh1G2e1G2eO%4dQ!fO'#CiO%4nQ`O,5=QOOQ!0Lb,5=O,5=OO%4vQpO,5=OOOQ!0Lb,5=P,5=POCwQ`O,5=OO%5RQpO,5=OOOQ!0Lb,5=S,5=SO$+YQ`O,5=WOOQO,5?a,5?aOOQO-E<s-E<sOOQ!0Lp1G2i1G2iO#$^QpO,5=OO$$wQlO,5=QO%5aQ`O,5=PO%5lQpO,5=PO!,TQMhO'#IvO%6fQMjO1G2tO!,TQMhO'#IxO%7XQMjO1G2vO%7cQMjO1G5rO%7mQMjO1G5rOOQO,5?f,5?fOOQO-E<x-E<xOOQO1G.{1G.{O!,TQMhO1G5rO!,TQMhO1G5rO!=[QpO,59wO%[QlO,59wOOQ!0Lh,5<k,5<kO%7zQ`O1G2[O!,TQMhO1G2cO%8PQ!0MxO7+'nOOQ!0Lf7+'n7+'nO!$wQlO7+'nO%8sQ`O,5;`OOQ!0Lb,5?h,5?hOOQ!0Lb-E<z-E<zO%8xQ!dO'#K_O#(ZQ`O7+(fO4UQ!fO7+(fO$DtQ`O7+(fO%9SQ!0MvO'#CiO%9gQ!0MvO,5=TO%9zQ`O,5=TO%:SQ`O,5=TOOQ!0Lb1G5p1G5pOOQ[7+$a7+$aO!COQ!0LrO7+$aO!CZQpO7+$aO!$wQlO7+&aO%:XQ`O'#JRO%:pQ`O,5AQOOQO1G3i1G3iO9kQ`O,5AQO%:pQ`O,5AQO%:xQ`O,5AQOOQO,5?n,5?nOOQO-E=Q-E=QOOQ!0Lf7+'U7+'UO%:}Q`O7+)RO9uQ!0LrO7+)RO9kQ`O7+)RO@zQ`O7+)RO%;SQ`O7+)ROOQ[7+)R7+)ROOQ[7+(q7+(qO%;XQ!0MvO7+(nO!&zQMhO7+(nO!EcQ`O7+(oOOQ[7+(o7+(oO!&zQMhO7+(oO%;cQ`O'#KcO%;nQ`O,5=mOOQO,5?j,5?jOOQO-E<|-E<|OOQ[7+(t7+(tO%=QQpO'#H[OOQ[1G3a1G3aO!&zQMhO1G3aO%[QlO1G3aO%=XQ`O1G3aO%=dQMhO1G3aO9uQ!0LrO1G3cO$%dQ`O1G3cO9`Q`O1G3cO!CZQpO1G3cO!CcQMhO1G3cO%=rQ`O'#JQO%>WQ`O,5AOO%>`QpO,5AOOOQ!0Lb1G3d1G3dOOQ[7+$V7+$VO@zQ`O7+$VO9uQ!0LrO7+$VO%>kQ`O7+$VO%[QlO1G6mO%[QlO1G6nO%>pQ!0LrO1G6mO%>zQlO1G3lO%?RQ`O1G3lO%?WQlO1G3lOOQ[7+)U7+)UO9uQ!0LrO7+)`O`QlO7+)bOOQ['#Ki'#KiOOQ['#JT'#JTO%?_QlO,5>aOOQ[,5>a,5>aO%[QlO'#HvO%?lQ`O'#HxOOQ[,5>g,5>gO9eQ`O,5>gOOQ[,5>i,5>iOOQ[7+)k7+)kOOQ[7+)q7+)qOOQ[7+)u7+)uOOQ[7+)w7+)wO%?qQpO1G5}O%@]Q`O1G0zOOQO1G/s1G/sO%@hQ?MtO1G/sO?YQ`O1G/sO!)[QlO'#DmOOQO,5?Q,5?QOOQO-E<d-E<dO%@rQ?MtO1G0zOOQO,5?W,5?WOOQO-E<j-E<jO!CZQpO1G/sOOQO-E<f-E<fOOQ!0Ln1G0]1G0]OOQ!0Lf7+%u7+%uO#(ZQ`O7+%uOOQ!0Lf7+&`7+&`O?YQ`O7+&`O!CZQpO7+&`OOQO7+%x7+%xO$AzQ!0MxO7+&XOOQO7+&X7+&XO%[QlO7+&XO%@|Q!0LrO7+&XO!COQ!0LrO7+%xO!CZQpO7+%xO%AXQ!0LrO7+&XO%AgQ!0MxO7++sO%[QlO7++sO%AwQ`O7++rO%AwQ`O7++rOOQO1G4t1G4tO9eQ`O1G4tO%BPQ`O1G4tOOQS7+%}7+%}O#(ZQ`O<<LQO4UQ!fO<<LQO%B_Q`O<<LQOOQ[<<LQ<<LQO!&zQMhO<<LQO%[QlO<<LQO%BgQ`O<<LQO%BrQ!0MzO,5?bO%D}Q!0MzO,5?dO%GYQ!0MzO1G2aO%IkQ!0MzO1G2tO%KvQ!0MzO1G2vO%NRQ!fO,5?RO%[QlO,5?ROOQO-E<e-E<eO%N]Q`O1G6OOOQ!0Lf<<JV<<JVO%NeQ?MtO1G0uO&!lQ?MtO1G1QO&!sQ?MtO1G1QO&$tQ?MtO1G1QO&${Q?MtO1G1QO&&|Q?MtO1G1QO&(}Q?MtO1G1QO&)UQ?MtO1G1QO&)]Q?MtO1G1QO&+^Q?MtO1G1QO&+eQ?MtO1G1QO&+lQ!0MxO<<JgO&-dQ?MtO1G1QO&.aQ?MvO1G1QO&/dQ?MvO'#JmO&1jQ?MtO1G1dO&1wQ?MtO1G0UO&2RQMjO,5?UOOQO-E<h-E<hO!)[QlO'#FrOOQO'#K['#K[OOQO1G1v1G1vO&2]Q`O1G1uO&2bQ?MtO,5?]OOOW7+'i7+'iOOOO1G/Z1G/ZO&2lQ!dO1G4yOOQ!0Lh7+(R7+(RP!&zQMhO,5?_O!,TQMhO7+(dO&2sQ`O,5?^O9eQ`O,5?^O$+YQ`O,5?^OOQO-E<p-E<pO&3RQ`O1G6cO&3RQ`O1G6cO&3ZQ`O1G6cO&3fQMjO7+'{O&3vQ!dO,5?`O&4QQ`O,5?`O!&zQMhO,5?`OOQO-E<r-E<rO&4VQ!dO1G6dO&4aQ`O1G6dO&4iQ`O1G2lO!&zQMhO1G2lOOQ!0Lb1G2j1G2jOOQ!0Lb1G2k1G2kO%4vQpO1G2jO!CZQpO1G2jOCwQ`O1G2jOOQ!0Lb1G2r1G2rO&4nQpO1G2jO&4|Q`O1G2lO$+YQ`O1G2kOCwQ`O1G2kO$$wQlO1G2lO&5UQ`O1G2kO&5xQMjO,5?bOOQ!0Lh-E<u-E<uO&6kQMjO,5?dOOQ!0Lh-E<w-E<wO!,TQMhO7++^O&6uQMjO7++^O&7PQMjO7++^OOQ!0Lh1G/c1G/cO&7^Q`O1G/cOOQ!0Lh7+'v7+'vO&7cQMjO7+'}O&7sQ!0MxO<<KYOOQ!0Lf<<KY<<KYO&8gQ`O1G0zO!&zQMhO'#I{O&8lQ`O,5@yO&:nQ!fO<<LQO!&zQMhO1G2oO&:uQ!0LrO1G2oOOQ[<<G{<<G{O!COQ!0LrO<<G{O&;WQ!0MxO<<I{OOQ!0Lf<<I{<<I{OOQO,5?m,5?mO&;zQ`O,5?mO&<PQ`O,5?mOOQO-E=P-E=PO&<_Q`O1G6lO&<_Q`O1G6lO9kQ`O1G6lO@zQ`O<<LmOOQ[<<Lm<<LmO&<gQ`O<<LmO9uQ!0LrO<<LmO9kQ`O<<LmOOQ[<<LY<<LYO%;XQ!0MvO<<LYOOQ[<<LZ<<LZO!EcQ`O<<LZO&<lQpO'#I}O&<wQ`O,5@}O!)[QlO,5@}OOQ[1G3X1G3XOOQO'#JP'#JPO9uQ!0LrO'#JPO&=PQpO,5=vOOQ[,5=v,5=vO&=WQpO'#EgO&=_QpO'#GfO&=dQ`O7+({O&=iQ`O7+({OOQ[7+({7+({O!&zQMhO7+({O%[QlO7+({O&=qQ`O7+({OOQ[7+(}7+(}O9uQ!0LrO7+(}O$%dQ`O7+(}O9`Q`O7+(}O!CZQpO7+(}O&=|Q`O,5?lOOQO-E=O-E=OOOQO'#H_'#H_O&>XQ`O1G6jO9uQ!0LrO<<GqOOQ[<<Gq<<GqO@zQ`O<<GqO&>aQ`O7+,XO&>fQ`O7+,YO%[QlO7+,XO%[QlO7+,YOOQ[7+)W7+)WO&>kQ`O7+)WO&>pQlO7+)WO&>wQ`O7+)WOOQ[<<Lz<<LzOOQ[<<L|<<L|OOQ[-E=R-E=ROOQ[1G3{1G3{O&>|Q`O,5>bOOQ[,5>d,5>dO&?RQ`O1G4RO9eQ`O7+&fO!)[QlO7+&fOOQO7+%_7+%_O&?WQ?MtO1G6[O?YQ`O7+%_OOQ!0Lf<<Ia<<IaOOQ!0Lf<<Iz<<IzO?YQ`O<<IzOOQO<<Is<<IsO$AzQ!0MxO<<IsO%[QlO<<IsOOQO<<Id<<IdO!COQ!0LrO<<IdO&?bQ!0LrO<<IsO&?mQ!0MxO<= _O&?}Q`O<= ^OOQO7+*`7+*`O9eQ`O7+*`OOQ[ANAlANAlO&@VQ!fOANAlO!&zQMhOANAlO#(ZQ`OANAlO4UQ!fOANAlO&@^Q`OANAlO%[QlOANAlO&@fQ!0MzO7+'{O&BwQ!0MzO,5?bO&ESQ!0MzO,5?dO&G_Q!0MzO7+'}O&IpQ!fO1G4mO&IzQ?MtO7+&aO&LOQ?MvO,5=YO&NVQ?MvO,5=[O&NgQ?MvO,5=YO&NwQ?MvO,5=[O' XQ?MvO,59uO'#_Q?MvO,5<lO'%bQ?MvO,5<nO''vQ?MvO,5<|O')lQ?MtO7+'lO')yQ?MtO7+'nO'*WQ`O,5<^OOQO7+'a7+'aOOQ!0Lh7+*e7+*eO'*]QMjO<<LOOOQO1G4x1G4xO'*dQ`O1G4xO'*oQ`O1G4xO'*}Q`O7++}O'*}Q`O7++}O!&zQMhO1G4zO'+VQ!dO1G4zO'+aQ`O7+,OO'+iQ`O7+(WO'+tQ!dO7+(WOOQ!0Lb7+(U7+(UOOQ!0Lb7+(V7+(VO!CZQpO7+(UOCwQ`O7+(UO',OQ`O7+(WO!&zQMhO7+(WO$+YQ`O7+(VO',TQ`O7+(WOCwQ`O7+(VO',]QMjO<<NxO!,TQMhO<<NxOOQ!0Lh7+$}7+$}O',gQ!dO,5?gOOQO-E<y-E<yO',qQ!0MvO7+(ZO!&zQMhO7+(ZOOQ[AN=gAN=gO9kQ`O1G5XOOQO1G5X1G5XO'-RQ`O1G5XO'-WQ`O7+,WO'-WQ`O7+,WO9uQ!0LrOANBXO@zQ`OANBXOOQ[ANBXANBXO'-`Q`OANBXOOQ[ANAtANAtOOQ[ANAuANAuO'-eQ`O,5?iOOQO-E<{-E<{O'-pQ?MtO1G6iOOQO,5?k,5?kOOQO-E<}-E<}OOQ[1G3b1G3bO'-zQ`O,5=QOOQ[<<Lg<<LgO!&zQMhO<<LgO&=dQ`O<<LgO'.PQ`O<<LgO%[QlO<<LgOOQ[<<Li<<LiO9uQ!0LrO<<LiO$%dQ`O<<LiO9`Q`O<<LiO'.XQpO1G5WO'.dQ`O7+,UOOQ[AN=]AN=]O9uQ!0LrOAN=]OOQ[<= s<= sOOQ[<= t<= tO'.lQ`O<= sO'.qQ`O<= tOOQ[<<Lr<<LrO'.vQ`O<<LrO'.{QlO<<LrOOQ[1G3|1G3|O?YQ`O7+)mO'/SQ`O<<JQO'/_Q?MtO<<JQOOQO<<Hy<<HyOOQ!0LfAN?fAN?fOOQOAN?_AN?_O$AzQ!0MxOAN?_OOQOAN?OAN?OO%[QlOAN?_OOQO<<Mz<<MzOOQ[G27WG27WO!&zQMhOG27WO#(ZQ`OG27WO'/iQ!fOG27WO4UQ!fOG27WO'/pQ`OG27WO'/xQ?MtO<<JgO'0VQ?MvO1G2aO'1{Q?MvO,5?bO'4OQ?MvO,5?dO'6RQ?MvO1G2tO'8UQ?MvO1G2vO':XQ?MtO<<KYO':fQ?MtO<<I{OOQO1G1x1G1xO!,TQMhOANAjOOQO7+*d7+*dO':sQ`O7+*dO';OQ`O<= iO';WQ!dO7+*fOOQ!0Lb<<Kr<<KrO$+YQ`O<<KrOCwQ`O<<KrO';bQ`O<<KrO!&zQMhO<<KrOOQ!0Lb<<Kp<<KpO!CZQpO<<KpO';mQ!dO<<KrOOQ!0Lb<<Kq<<KqO';wQ`O<<KrO!&zQMhO<<KrO$+YQ`O<<KqO';|QMjOANDdO'<WQ!0MvO<<KuOOQO7+*s7+*sO9kQ`O7+*sO'<hQ`O<= rOOQ[G27sG27sO9uQ!0LrOG27sO@zQ`OG27sO!)[QlO1G5TO'<pQ`O7+,TO'<xQ`O1G2lO&=dQ`OANBROOQ[ANBRANBRO!&zQMhOANBRO'<}Q`OANBROOQ[ANBTANBTO9uQ!0LrOANBTO$%dQ`OANBTOOQO'#H`'#H`OOQO7+*r7+*rOOQ[G22wG22wOOQ[ANE_ANE_OOQ[ANE`ANE`OOQ[ANB^ANB^O'=VQ`OANB^OOQ[<<MX<<MXO!)[QlOAN?lOOQOG24yG24yO$AzQ!0MxOG24yO#(ZQ`OLD,rOOQ[LD,rLD,rO!&zQMhOLD,rO'=[Q!fOLD,rO'=cQ?MvO7+'{O'?XQ?MvO,5?bO'A[Q?MvO,5?dO'C_Q?MvO7+'}O'ETQMjOG27UOOQO<<NO<<NOOOQ!0LbANA^ANA^O$+YQ`OANA^OCwQ`OANA^O'EeQ!dOANA^OOQ!0LbANA[ANA[O'ElQ`OANA^O!&zQMhOANA^O'EwQ!dOANA^OOQ!0LbANA]ANA]OOQO<<N_<<N_OOQ[LD-_LD-_O9uQ!0LrOLD-_O'FRQ?MtO7+*oOOQO'#Gg'#GgOOQ[G27mG27mO&=dQ`OG27mO!&zQMhOG27mOOQ[G27oG27oO9uQ!0LrOG27oOOQ[G27xG27xO'F]Q?MtOG25WOOQOLD*eLD*eOOQ[!$(!^!$(!^O#(ZQ`O!$(!^O!&zQMhO!$(!^O'FgQ!0MzOG27UOOQ!0LbG26xG26xO$+YQ`OG26xO'HxQ`OG26xOCwQ`OG26xO'ITQ!dOG26xO!&zQMhOG26xOOQ[!$(!y!$(!yOOQ[LD-XLD-XO&=dQ`OLD-XOOQ[LD-ZLD-ZOOQ[!)9Ex!)9ExO#(ZQ`O!)9ExOOQ!0LbLD,dLD,dO$+YQ`OLD,dOCwQ`OLD,dO'I[Q`OLD,dO'IgQ!dOLD,dOOQ[!$(!s!$(!sOOQ[!.K;d!.K;dO'InQ?MvOG27UOOQ!0Lb!$(!O!$(!OO$+YQ`O!$(!OOCwQ`O!$(!OO'KdQ`O!$(!OOOQ!0Lb!)9Ej!)9EjO$+YQ`O!)9EjOCwQ`O!)9EjOOQ!0Lb!.K;U!.K;UO$+YQ`O!.K;UOOQ!0Lb!4/0p!4/0pO!)[QlO'#DzO1PQ`O'#EXO'KoQ!fO'#JsO'KvQ!L^O'#DvO'K}QlO'#EOO'LUQ!fO'#CiO'NlQ!fO'#CiO!)[QlO'#EQO'N|QlO,5;ZO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO'#IqO(#PQ`O,5<jO!)[QlO,5;fO(#XQMhO,5;fO($rQMhO,5;fO!)[QlO,5;xO!&zQMhO'#GnO(#XQMhO'#GnO!&zQMhO'#GpO(#XQMhO'#GpO1SQ`O'#DZO1SQ`O'#DZO!&zQMhO'#GQO(#XQMhO'#GQO!&zQMhO'#GSO(#XQMhO'#GSO!&zQMhO'#GbO(#XQMhO'#GbO!)[QlO,5:jO($yQpO'#D_O!)[QlO,5@pO'N|QlO1G0uO(%TQ?MtO'#CiO!)[QlO1G2QO!&zQMhO'#IvO(#XQMhO'#IvO!&zQMhO'#IxO(#XQMhO'#IxO(%_Q!dO'#CrO!&zQMhO,5<uO(#XQMhO,5<uO'N|QlO1G2SO!)[QlO7+&{O!&zQMhO1G2aO(#XQMhO1G2aO!&zQMhO'#IvO(#XQMhO'#IvO!&zQMhO'#IxO(#XQMhO'#IxO!&zQMhO1G2cO(#XQMhO1G2cO'N|QlO7+'nO'N|QlO7+&aO!&zQMhOANAjO(#XQMhOANAjO(%rQ`O'#EoO(%wQ`O'#EoO(&PQ`O'#F^O(&UQ`O'#EzO(&ZQ`O'#KUO(&fQ`O'#KSO(&qQ`O,5;ZO(&vQMjO,5<fO(&}Q`O'#GZO('SQ`O'#GZO('XQ`O,5<fO('aQ`O,5<hO('iQ`O,5;ZO('qQ?MtO1G1aO('xQ`O,5<uO('}Q`O,5<uO((SQ`O,5<wO((XQ`O,5<wO((^Q`O1G2SO((cQ`O1G0uO((hQMjO<<LOO((oQMjO<<LOO((vQMhO'#F}O9`Q`O'#F|OAuQ`O'#EnO!)[QlO,5;uO!3oQ`O'#GZO!3oQ`O'#GZO!3oQ`O'#G]O!3oQ`O'#G]O!,TQMhO7+(dO!,TQMhO7+(dO%/YQ!dO1G2xO%/YQ!dO1G2xO!&zQMhO,5=^O!&zQMhO,5=^",
		stateData: "(){~O'}OS(OOSTOS(PRQ~OPYOQYOSfOY!VOaqOdzOeyOl!POpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!uwO!xxO!|]O$X|O$oiO%i}O%k!QO%m!OO%n!OO%o!OO%r!RO%t!SO%w!TO%x!TO%z!UO&X!WO&_!XO&a!YO&c!ZO&e![O&h!]O&n!^O&t!_O&v!`O&x!aO&z!bO&|!cO(USO(WTO(ZUO(bVO(p[O~OWtO~P`OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(U!dO(WTO(ZUO(bVO(p[O~Oa!wOs!nO!S!oO!b!yO!c!vO!d!vO!|<XO#T!pO#U!pO#V!xO#W!pO#X!pO#[!zO#]!zO(V!lO(WTO(ZUO(f!mO(p!sO~O(P!{O~OP]XR]X[]Xa]Xj]Xr]X!Q]X!S]X!]]X!l]X!p]X#R]X#S]X#`]X#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X'{]X(b]X(s]X(z]X({]X~O!g%SX~P(qO_!}O(W#PO(X!}O(Y#PO~O_#QO(Y#PO(Z#PO([#QO~Ox#SO!U#TO(c#TO(d#VO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(U<]O(WTO(ZUO(bVO(p[O~O![#ZO!]#WO!Y(iP!Y(wP~P+}O!^#cO~P`OPYOQYOSfOd!jOe!iOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(WTO(ZUO(bVO(p[O~Op#mO![#iO!|]O#j#lO#k#iO(U<^O!k(tP~P.iO!l#oO(U#nO~O!x#sO!|]O%i#tO~O#l#uO~O!g#vO#l#uO~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!]$_O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO#{$WO#|$XO(bVO(s$YO(z#|O({#}O~Oa(gX'{(gX'x(gX!k(gX!Y(gX!_(gX%j(gX!g(gX~P1qO#S$dO#`$eO$R$eOP(hXR(hX[(hXj(hXr(hX!Q(hX!S(hX!](hX!l(hX!p(hX#R(hX#o(hX#p(hX#q(hX#r(hX#s(hX#t(hX#u(hX#v(hX#w(hX#y(hX#{(hX#|(hX(b(hX(s(hX(z(hX({(hX!_(hX%j(hX~Oa(hX'{(hX'x(hX!Y(hX!k(hXv(hX!g(hX~P4UO#`$eO~O$^$hO$`$gO$g$mO~OSfO!_$nO$j$oO$l$qO~Oh%VOj%dOk%dOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#k%cO$X%`O$u%^O$w%_O$z%aO(U$sO(WTO(ZUO(b$uO(z$}O({%POg(_P~Ol%[O~P7eO!l%eO~O!S%hO!_%iO(U%gO~O!g%mO~Oa%nO'{%nO~O!Q%rO~P%[O(V!lO~P%[O%o%vO~P%[Oh%VO!l%eO(U%gO(V!lO~Oe%}O!l%eO(U%gO~Oj$RO~O!_&PO(U%gO(V!lO(WTO(ZUO`)XP~O!Q&SO!l&RO%k&VO&U&WO~P;SO!x#sO~O%t&YO!S)TX!_)TX(U)TX~O(U&ZO~Ol!PO!u&`O%k!QO%m!OO%n!OO%o!OO%r!RO%t!SO%w!TO%x!TO~Od&eOe&dO!x&bO%i&cO%|&aO~P<bOd&hOeyOl!PO!_&gO!u&`O!xxO!|]O%i}O%m!OO%n!OO%o!OO%r!RO%t!SO%w!TO%x!TO%z!UO~Ob&kO#`&nO%k&iO(V!lO~P=gO!l&oO!u&sO~O!l#oO~O!_XO~Oa%nO'y&{O'{%nO~Oa%nO'y'OO'{%nO~Oa%nO'y'QO'{%nO~O'x]X!Y]Xv]X!k]X&]]X!_]X%j]X!g]X~P(qO!b'`O!c'WO!d'WO(V!lO(WTO(ZUO~Os'UO!S'TO!['XO(f'SO!^(jP!^(yP~P@nOn'cO!_'aO(U%gO~Oe'hO!l%eO(U%gO~O!Q&SO!l&RO~Os!nO!S!oO!|<XO#T!pO#U!pO#W!pO#X!pO(V!lO(WTO(ZUO(f!mO(p!sO~O!b'nO!c'mO!d'mO#V!pO#['oO#]'oO~PBYOa%nOh%VO!g#vO!l%eO'{%nO(s'qO~O!p'uO#`'sO~PChOs!nO!S!oO(WTO(ZUO(f!mO(p!sO~O!_XOs(nX!S(nX!b(nX!c(nX!d(nX!|(nX#T(nX#U(nX#V(nX#W(nX#X(nX#[(nX#](nX(V(nX(W(nX(Z(nX(f(nX(p(nX~O!c'mO!d'mO(V!lO~PDWO(Q'yO(R'yO(S'{O~O_!}O(W'}O(X!}O(Y'}O~O_#QO(Y'}O(Z'}O([#QO~Ov(PO~P%[Ox#SO!U#TO(c#TO(d(SO~O![(UO!Y'XX!Y'_X!]'XX!]'_X~P+}O!](WO!Y(iX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!](WO!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO#{$WO#|$XO(bVO(s$YO(z#|O({#}O~O!Y(iX~PHRO!Y(]O~O!Y(vX!](vX!g(vX!k(vX(s(vX~O#`(vX#l#dX!^(vX~PJUO#`(^O!Y(xX!](xX~O!](_O!Y(wX~O!Y(bO~O#`$eO~PJUO!^(cO~P`OR#zO!Q#yO!S#{O!l#xO(bVOP!na[!naj!nar!na!]!na!p!na#R!na#o!na#p!na#q!na#r!na#s!na#t!na#u!na#v!na#w!na#y!na#{!na#|!na(s!na(z!na({!na~Oa!na'{!na'x!na!Y!na!k!nav!na!_!na%j!na!g!na~PKlO!k(dO~O!g#vO#`(eO(s'qO!](uXa(uX'{(uX~O!k(uX~PNXO!S%hO!_%iO!|]O#j(jO#k(iO(U%gO~O!](kO!k(tX~O!k(mO~O!S%hO!_%iO#k(iO(U%gO~OP(hXR(hX[(hXj(hXr(hX!Q(hX!S(hX!](hX!l(hX!p(hX#R(hX#o(hX#p(hX#q(hX#r(hX#s(hX#t(hX#u(hX#v(hX#w(hX#y(hX#{(hX#|(hX(b(hX(s(hX(z(hX({(hX~O!g#vO!k(hX~P! uOR(oO!Q(nO!l#xO#S$dO!|!{a!S!{a~O!x!{a%i!{a!_!{a#j!{a#k!{a(U!{a~P!#vO!x(sO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(U!dO(WTO(ZUO(bVO(p[O~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<uO!S${O!_$|O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(U(wO(WTO(ZUO(b$uO(z$}O({%PO~O#l(yO~O![({O!k(lP~P%[O(f(}O(p[O~O!S)PO!l#xO(f(}O(p[O~OP<WOQ<WOSfOd>SOe!iOpkOr<WOskOtkOzkO|<WO!O<WO!SWO!WkO!XkO!_!eO!i<ZO!lZO!o<WO!p<WO!q<WO!s<[O!u<_O!x!hO$X!kO$o>QO(U)^O(WTO(ZUO(bVO(p[O~O!]$_Oa$ra'{$ra'x$ra!k$ra!Y$ra!_$ra%j$ra!g$ra~Ol)eO~P!&zOh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#k%cO$X%`O$u%^O$w%_O$z%aO(U(wO(WTO(ZUO(b$uO(z$}O({%PO~Og(qP~P!,TO!Q)jO!g)iO!_$_X$[$_X$^$_X$`$_X$g$_X~O!g)iO!_(|X$[(|X$^(|X$`(|X$g(|X~O!Q)jO~P!.^O!Q)jO!_(|X$[(|X$^(|X$`(|X$g(|X~O!_)lO$[)pO$^)kO$`)kO$g)qO~O![)tO~P!)[O$^$hO$`$gO$g)xO~On${X!Q${X#S${X'z${X(z${X({${X~OgmXg${XnmX!]mX#`mX~P!0SOx)zO(c){O(d)}O~On*WO!Q*PO'z*QO(z$}O({%PO~Og*OO~P!1WOg*XO~Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<uO!S*ZO!_*[O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(WTO(ZUO(b$uO(z$}O({%PO~Op*aO![*_O(U*YO!k)PP~P!1uO#l*bO~O!l*cO~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<uO!S${O!_$|O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(U*eO(WTO(ZUO(b$uO(z$}O({%PO~O![*hO!Y)QP~P!3tOr*tOs!nO!S*jO!b*rO!c*lO!d*lO!l*cO#[*sO%a*nO(V!lO(WTO(ZUO(f!mO~O!^*qO~P!5iO#S$dOn(aX!Q(aX'z(aX(z(aX({(aX!](aX#`(aX~Og(aX$P(aX~P!6kOn*yO#`*xOg(`X!](`X~O!]*zOg(_X~Oj%dOk%dOl%dO(U&ZOg(_P~Os*}O~Og*OO(U&ZO~O!l+TO~O(U(wO~Op+XO!S%hO![#iO!_%iO!|]O#j#lO#k#iO(U%gO!k(tP~O!g#vO#l+YO~O!S%hO![+[O!](_O!_%iO(U%gO!Y(wP~Os']O!S+_O![+^O(WTO(ZUO(f+]O~O!^(yP~P!9|O!]+`Oa)UX'{)UX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO#{$WO#|$XO(bVO(s$YO(z#|O({#}O~Oa!ja!]!ja'{!ja'x!ja!Y!ja!k!jav!ja!_!ja%j!ja!g!ja~P!:tO(f(}O~OR#zO!Q#yO!S#{O!l#xO(bVOP!ra[!raj!rar!ra!]!ra!p!ra#R!ra#o!ra#p!ra#q!ra#r!ra#s!ra#t!ra#u!ra#v!ra#w!ra#y!ra#{!ra#|!ra(s!ra(z!ra({!ra~Oa!ra'{!ra'x!ra!Y!ra!k!rav!ra!_!ra%j!ra!g!ra~P!=aOR#zO!Q#yO!S#{O!l#xO(bVOP!ta[!taj!tar!ta!]!ta!p!ta#R!ta#o!ta#p!ta#q!ta#r!ta#s!ta#t!ta#u!ta#v!ta#w!ta#y!ta#{!ta#|!ta(s!ta(z!ta({!ta~Oa!ta'{!ta'x!ta!Y!ta!k!tav!ta!_!ta%j!ta!g!ta~P!?wOh%VOn+iO!_'aO%j+hO~O!g+kOa(^X!_(^X'{(^X!](^X~Oa%nO!_XO'{%nO~Oh%VO!l%eO~Oh%VO!l%eO(U%gO~O!g#vO#l(yO~Ob+vO%k+wO(U+sO(WTO(ZUO!^)YP~O!]+xO`)XX~O[+|O~O`+}O~O!_&PO(U%gO(V!lO`)XP~O%k,QO~P;SOh%VO#`,UO~Oh%VOn,XO!_$|O~O!_,ZO~O!Q,]O!_XO~O%o%vO~O!x,bO~Oe,gO~Ob,hO(U#nO(WTO(ZUO!^)WP~Oe%}O~O%k!QO(U&ZO~P=gO[,mO`,lO~OPYOQYOSfOdzOeyOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!iuO!lZO!oYO!pYO!qYO!svO!xxO!|]O$oiO%i}O(WTO(ZUO(bVO(p[O~O!_!eO!u!gO$X!kO(U!dO~P!GOO`,lOa%nO'{%nO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!x!hO$X!kO$oiO(U!dO(WTO(ZUO(bVO(p[O~Oa,rOl!OO!uwO%m!OO%n!OO%o!OO~P!IhO!l&oO~O&_,xO~O!_,zO~O&p,|O&r,}OP&maQ&maS&maY&maa&mad&mae&mal&map&mar&mas&mat&maz&ma|&ma!O&ma!S&ma!W&ma!X&ma!_&ma!i&ma!l&ma!o&ma!p&ma!q&ma!s&ma!u&ma!x&ma!|&ma$X&ma$o&ma%i&ma%k&ma%m&ma%n&ma%o&ma%r&ma%t&ma%w&ma%x&ma%z&ma&X&ma&_&ma&a&ma&c&ma&e&ma&h&ma&n&ma&t&ma&v&ma&x&ma&z&ma&|&ma'x&ma(U&ma(W&ma(Z&ma(b&ma(p&ma!^&ma&f&mab&ma&k&ma~O(U-SO~Oh!eX!]#iX!^#iX!g!RX!g!eX!l!eX#`#iX~O!]!eX!^!eX~P#!nO!g-WOh(kX!](kX!^(kX!g(kX!l(kXr(kX(s(kX~Oh%VO!g-YO!l%eO!]!aX!^!aX~Os!nO!S!oO(WTO(ZUO(f!mO~OP<WOQ<WOSfOd>SOe!iOpkOr<WOskOtkOzkO|<WO!O<WO!SWO!WkO!XkO!_!eO!i<ZO!lZO!o<WO!p<WO!q<WO!s<[O!u<_O!x!hO$X!kO$o>QO(WTO(ZUO(bVO(p[O~O(U=RO~P#$oO!]-^O!^(jX~O!^-`O~O#`-aO!]#hX!^#hX~O!g-WO~O!]-bO!^(yX~O!^-dO~O!c-eO!d-eO(V!lO~P#$^O!^-hO~P'_On-kO!_'aO~O!Y-pO~Os!{a!b!{a!c!{a!d!{a#T!{a#U!{a#V!{a#W!{a#X!{a#[!{a#]!{a(V!{a(W!{a(Z!{a(f!{a(p!{a~P!#vO!p-uO#`-sO~PChO!c-wO!d-wO(V!lO~PDWOa%nO#`-sO'{%nO~Oa%nO!g#vO#`-sO'{%nO~Oa%nO!g#vO!p-uO#`-sO'{%nO(s'qO~O(Q'yO(R'yO(S-|O~Ov-}O~O!Y'Xa!]'Xa~P!:tO![.RO!Y'XX!]'XX~P%[O!](WO!Y(ia~O!Y(ia~PHRO!](_O!Y(wa~O!S%hO![.VO!_%iO(U%gO!Y'_X!]'_X~O#`.XO!](ua!k(uaa(ua'{(ua~O!g#vO~P#,wO!](kO!k(ta~O!S%hO!_%iO#k.]O(U%gO~Op.bO!S%hO![._O!_%iO!|]O#j.aO#k._O(U%gO!]'bX!k'bX~OR.fO!l#xO~Oh%VOn.iO!_'aO%j.hO~Oa#ci!]#ci'{#ci'x#ci!Y#ci!k#civ#ci!_#ci%j#ci!g#ci~P!:tOn>^O!Q*PO'z*QO(z$}O({%PO~O#l#_aa#_a#`#_a'{#_a!]#_a!k#_a!_#_a!Y#_a~P#/sO#l(aXP(aXR(aX[(aXa(aXj(aXr(aX!S(aX!l(aX!p(aX#R(aX#o(aX#p(aX#q(aX#r(aX#s(aX#t(aX#u(aX#v(aX#w(aX#y(aX#{(aX#|(aX'{(aX(b(aX(s(aX!k(aX!Y(aX'x(aXv(aX!_(aX%j(aX!g(aX~P!6kO!].vO!k(lX~P!:tO!k.yO~O!Y.{O~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(bVO[#nia#nij#nir#ni!]#ni#R#ni#p#ni#q#ni#r#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni'{#ni(s#ni(z#ni({#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#o#ni~P#3cO#o$OO~P#3cOP$[OR#zOr$aO!Q#yO!S#{O!l#xO!p$[O#o$OO#p$PO#q$PO#r$PO(bVO[#nia#nij#ni!]#ni#R#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni'{#ni(s#ni(z#ni({#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#s#ni~P#6QO#s$QO~P#6QOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO(bVOa#ni!]#ni#y#ni#{#ni#|#ni'{#ni(s#ni(z#ni({#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#w#ni~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO(bVO({#}Oa#ni!]#ni#{#ni#|#ni'{#ni(s#ni(z#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#y$UO~P#;VO#y#ni~P#;VO#w$SO~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO(bVO(z#|O({#}Oa#ni!]#ni#|#ni'{#ni(s#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#{#ni~P#={O#{$WO~P#={OP]XR]X[]Xj]Xr]X!Q]X!S]X!l]X!p]X#R]X#S]X#`]X#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X(b]X(s]X(z]X({]X!]]X!^]X~O$P]X~P#@jOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO#w<eO#y<gO#{<iO#|<jO(bVO(s$YO(z#|O({#}O~O$P.}O~P#BwO#S$dO#`<pO$R<pO$P(hX!^(hX~P! uOa'ea!]'ea'{'ea'x'ea!k'ea!Y'eav'ea!_'ea%j'ea!g'ea~P!:tO[#nia#nij#nir#ni!]#ni#R#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni'{#ni(s#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#o$OO#p$PO#q$PO#r$PO(bVO(z#ni({#ni~P#EyOn>^O!Q*PO'z*QO(z$}O({%POP#niR#ni!S#ni!l#ni!p#ni#o#ni#p#ni#q#ni#r#ni(b#ni~P#EyO!]/ROg(qX~P!1WOg/TO~Oa$Qi!]$Qi'{$Qi'x$Qi!Y$Qi!k$Qiv$Qi!_$Qi%j$Qi!g$Qi~P!:tO$^/UO$`/UO~O$^/VO$`/VO~O!g)iO#`/WO!_$dX$[$dX$^$dX$`$dX$g$dX~O![/XO~O!_)lO$[/ZO$^)kO$`)kO$g/[O~O!]<kO!^(gX~P#BwO!^/]O~O!g)iO$g(|X~O$g/_O~Ov/`O~P!&zOx)zO(c){O(d/cO~O!S/fO~O(z$}On%ba!Q%ba'z%ba({%ba!]%ba#`%ba~Og%ba$P%ba~P#L{O({%POn%da!Q%da'z%da(z%da!]%da#`%da~Og%da$P%da~P#MnO!]fX!gfX!kfX!k${X(sfX~P!0SOp%WO![/oO!](_O(U/nO!Y(wP!Y)QP~P!1uOr*tO!b*rO!c*lO!d*lO!l*cO#[*sO%a*nO(V!lO(WTO(ZUO~Os'UO!S/pO![+^O!^*qO(f=OO!^(yP~P$ [O!k/qO~P#/sO!]/rO!g#vO(s'qO!k)PX~O!k/wO~OnoX!QoX'zoX(zoX({oX~O!g#vO!koX~P$#OOp/yO!S%hO![*_O!_%iO(U%gO!k)PP~O#l/zO~O!Y${X!]${X!g%SX~P!0SO!]/{O!Y)QX~P#/sO!g/}O~O!Y0PO~OpkO(U0QO~P.iOh%VOr0VO!g#vO!l%eO(s'qO~O!g+kO~Oa%nO!]0ZO'{%nO~O!^0]O~P!5iO!c0^O!d0^O(V!lO~P#$^Os!nO!S0_O(WTO(ZUO(f!mO~O#[0aO~Og%ba!]%ba#`%ba$P%ba~P!1WOg%da!]%da#`%da$P%da~P!1WOj%dOk%dOl%dO(U&ZOg'nX!]'nX~O!]*zOg(_a~Og0jO~On0lO#`0kOg(`a!](`a~OR0mO!Q0mO!S0nO#S$dOn}a'z}a(z}a({}a!]}a#`}a~Og}a$P}a~P$(cO!Q*PO'z*QOn$ta(z$ta({$ta!]$ta#`$ta~Og$ta$P$ta~P$)_O!Q*PO'z*QOn$va(z$va({$va!]$va#`$va~Og$va$P$va~P$*QO#l0qO~Og%Ua!]%Ua#`%Ua$P%Ua~P!1WO!g#vO~O#l0tO~O!]#iX!^#iX!g!RX#`#iX~O!]+`Oa)Ua'{)Ua~OR#zO!Q#yO!S#{O!l#xO(bVOP!ri[!rij!rir!ri!]!ri!p!ri#R!ri#o!ri#p!ri#q!ri#r!ri#s!ri#t!ri#u!ri#v!ri#w!ri#y!ri#{!ri#|!ri(s!ri(z!ri({!ri~Oa!ri'{!ri'x!ri!Y!ri!k!riv!ri!_!ri%j!ri!g!ri~P$+}Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<uO!S${O!_$|O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(WTO(ZUO(b$uO(z$}O({%PO~Op0}O%^1OO(U0|O~P$.eO!g+kOa(^a!_(^a'{(^a!](^a~O#l1UO~O[]X!]fX!^fX~O!]1VO!^)YX~O!^1XO~O[1YO~Ob1[O(U+sO(WTO(ZUO~O!_&PO(U%gO`'vX!]'vX~O!]+xO`)Xa~O!k1_O~P!:tO[1bO~O`1cO~O#`1hO~On1kO!_$|O~O(f(}O!^)VP~Oh%VOn1tO!_1qO%j1sO~O[2OO!]1|O!^)WX~O!^2PO~O`2ROa%nO'{%nO~O(U#nO(WTO(ZUO~O#S$dO#`$eO$R$eOP(hXR(hX[(hXr(hX!Q(hX!S(hX!](hX!l(hX!p(hX#R(hX#o(hX#p(hX#q(hX#r(hX#s(hX#t(hX#u(hX#v(hX#w(hX#y(hX#{(hX#|(hX(b(hX(s(hX(z(hX({(hX~Oj2UO&]2VOa(hX~P$4OOj2UO#`$eO&]2VO~Oa2XO~P%[Oa2ZO~O&f2^OP&diQ&diS&diY&dia&did&die&dil&dip&dir&dis&dit&diz&di|&di!O&di!S&di!W&di!X&di!_&di!i&di!l&di!o&di!p&di!q&di!s&di!u&di!x&di!|&di$X&di$o&di%i&di%k&di%m&di%n&di%o&di%r&di%t&di%w&di%x&di%z&di&X&di&_&di&a&di&c&di&e&di&h&di&n&di&t&di&v&di&x&di&z&di&|&di'x&di(U&di(W&di(Z&di(b&di(p&di!^&dib&di&k&di~Ob2dO!^2bO&k2cO~P`O!_XO!l2fO~O&r,}OP&miQ&miS&miY&mia&mid&mie&mil&mip&mir&mis&mit&miz&mi|&mi!O&mi!S&mi!W&mi!X&mi!_&mi!i&mi!l&mi!o&mi!p&mi!q&mi!s&mi!u&mi!x&mi!|&mi$X&mi$o&mi%i&mi%k&mi%m&mi%n&mi%o&mi%r&mi%t&mi%w&mi%x&mi%z&mi&X&mi&_&mi&a&mi&c&mi&e&mi&h&mi&n&mi&t&mi&v&mi&x&mi&z&mi&|&mi'x&mi(U&mi(W&mi(Z&mi(b&mi(p&mi!^&mi&f&mib&mi&k&mi~O!Y2lO~O!]!aa!^!aa~P#BwOs!nO!S!oO![2qO(f!mO!]'YX!^'YX~P@nO!]-^O!^(ja~O!]'`X!^'`X~P!9|O!]-bO!^(ya~O!^2yO~P'_Oa%nO#`3SO'{%nO~Oa%nO!g#vO#`3SO'{%nO~Oa%nO!g#vO!p3WO#`3SO'{%nO(s'qO~Oa%nO'{%nO~P!:tO!]$_Ov$ra~O!Y'Xi!]'Xi~P!:tO!](WO!Y(ii~O!](_O!Y(wi~O!Y(xi!](xi~P!:tO!](ui!k(uia(ui'{(ui~P!:tO#`3YO!](ui!k(uia(ui'{(ui~O!](kO!k(ti~O!S%hO!_%iO!|]O#j3_O#k3^O(U%gO~O!S%hO!_%iO#k3^O(U%gO~On3fO!_'aO%j3eO~Oh%VOn3fO!_'aO%j3eO~O#l%baP%baR%ba[%baa%baj%bar%ba!S%ba!l%ba!p%ba#R%ba#o%ba#p%ba#q%ba#r%ba#s%ba#t%ba#u%ba#v%ba#w%ba#y%ba#{%ba#|%ba'{%ba(b%ba(s%ba!k%ba!Y%ba'x%bav%ba!_%ba%j%ba!g%ba~P#L{O#l%daP%daR%da[%daa%daj%dar%da!S%da!l%da!p%da#R%da#o%da#p%da#q%da#r%da#s%da#t%da#u%da#v%da#w%da#y%da#{%da#|%da'{%da(b%da(s%da!k%da!Y%da'x%dav%da!_%da%j%da!g%da~P#MnO#l%baP%baR%ba[%baa%baj%bar%ba!S%ba!]%ba!l%ba!p%ba#R%ba#o%ba#p%ba#q%ba#r%ba#s%ba#t%ba#u%ba#v%ba#w%ba#y%ba#{%ba#|%ba'{%ba(b%ba(s%ba!k%ba!Y%ba'x%ba#`%bav%ba!_%ba%j%ba!g%ba~P#/sO#l%daP%daR%da[%daa%daj%dar%da!S%da!]%da!l%da!p%da#R%da#o%da#p%da#q%da#r%da#s%da#t%da#u%da#v%da#w%da#y%da#{%da#|%da'{%da(b%da(s%da!k%da!Y%da'x%da#`%dav%da!_%da%j%da!g%da~P#/sO#l}aP}a[}aa}aj}ar}a!l}a!p}a#R}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#w}a#y}a#{}a#|}a'{}a(b}a(s}a!k}a!Y}a'x}av}a!_}a%j}a!g}a~P$(cO#l$taP$taR$ta[$taa$taj$tar$ta!S$ta!l$ta!p$ta#R$ta#o$ta#p$ta#q$ta#r$ta#s$ta#t$ta#u$ta#v$ta#w$ta#y$ta#{$ta#|$ta'{$ta(b$ta(s$ta!k$ta!Y$ta'x$tav$ta!_$ta%j$ta!g$ta~P$)_O#l$vaP$vaR$va[$vaa$vaj$var$va!S$va!l$va!p$va#R$va#o$va#p$va#q$va#r$va#s$va#t$va#u$va#v$va#w$va#y$va#{$va#|$va'{$va(b$va(s$va!k$va!Y$va'x$vav$va!_$va%j$va!g$va~P$*QO#l%UaP%UaR%Ua[%Uaa%Uaj%Uar%Ua!S%Ua!]%Ua!l%Ua!p%Ua#R%Ua#o%Ua#p%Ua#q%Ua#r%Ua#s%Ua#t%Ua#u%Ua#v%Ua#w%Ua#y%Ua#{%Ua#|%Ua'{%Ua(b%Ua(s%Ua!k%Ua!Y%Ua'x%Ua#`%Uav%Ua!_%Ua%j%Ua!g%Ua~P#/sOa#cq!]#cq'{#cq'x#cq!Y#cq!k#cqv#cq!_#cq%j#cq!g#cq~P!:tO![3nO!]'ZX!k'ZX~P%[O!].vO!k(la~O!].vO!k(la~P!:tO!Y3qO~O$P!na!^!na~PKlO$P!ja!]!ja!^!ja~P#BwO$P!ra!^!ra~P!=aO$P!ta!^!ta~P!?wOg'^X!]'^X~P!,TO!]/ROg(qa~OSfO!_4VO$e4WO~O!^4[O~Ov4]O~P#/sOa$nq!]$nq'{$nq'x$nq!Y$nq!k$nqv$nq!_$nq%j$nq!g$nq~P!:tO!Y4_O~P!&zO!S4`O~O!Q*PO'z*QO({%POn'ja(z'ja!]'ja#`'ja~Og'ja$P'ja~P%-tO!Q*PO'z*QOn'la(z'la({'la!]'la#`'la~Og'la$P'la~P%.gO(s$YO~P#/sO!YfX!Y${X!]fX!]${X!g%SX#`fX~P!0SOp%WO(U=XO~P!1uOp4dO!S%hO![4cO!_%iO(U%gO!]'fX!k'fX~O!]/rO!k)Pa~O!]/rO!g#vO!k)Pa~O!]/rO!g#vO(s'qO!k)Pa~Og$}i!]$}i#`$}i$P$}i~P!1WO![4lO!Y'hX!]'hX~P!3tO!]/{O!Y)Qa~O!]/{O!Y)Qa~P#/sOP]XR]X[]Xj]Xr]X!Q]X!S]X!Y]X!]]X!l]X!p]X#R]X#S]X#`]X#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X(b]X(s]X(z]X({]X~Oj%ZX!g%ZX~P%2^Oj4qO!g#vO~Oh%VO!g#vO!l%eO~Oh%VOr4vO!l%eO(s'qO~Or4{O!g#vO(s'qO~Os!nO!S4|O(WTO(ZUO(f!mO~O(z$}On%bi!Q%bi'z%bi({%bi!]%bi#`%bi~Og%bi$P%bi~P%5}O({%POn%di!Q%di'z%di(z%di!]%di#`%di~Og%di$P%di~P%6pOg(`i!](`i~P!1WO#`5SOg(`i!](`i~P!1WO!k5XO~Oa$pq!]$pq'{$pq'x$pq!Y$pq!k$pqv$pq!_$pq%j$pq!g$pq~P!:tO!Y5]O~O!]5^O!_)RX~P#/sOa${X!_${X%_]X'{${X!]${X~P!0SO%_5aOaoX!_oX'{oX!]oX~P$#OOp5bO(U#nO~O%_5aO~Ob5hO%k5iO(U+sO(WTO(ZUO!]'uX!^'uX~O!]1VO!^)Ya~O[5mO~O`5nO~O[5rO~Oa%nO'{%nO~P#/sO!]5wO#`5yO!^)VX~O!^5zO~Or6QOs!nO!S*jO!b!yO!c!vO!d!vO!|<XO#T!pO#U!pO#V!pO#W!pO#X!pO#[6PO#]!zO(V!lO(WTO(ZUO(f!mO(p!sO~O!^6OO~P%;sOn6VO!_1qO%j6UO~Oh%VOn6VO!_1qO%j6UO~Ob6^O(U#nO(WTO(ZUO!]'tX!^'tX~O!]1|O!^)Wa~O(WTO(ZUO(f6`O~O`6dO~Oj6gO&]6hO~PNXO!k6iO~P%[Oa6kO~Oa6kO~P%[Ob2dO!^6pO&k2cO~P`O!g6rO~O!g6tOh(ki!](ki!^(ki!g(ki!l(kir(ki(s(ki~O#`6uO!]#hi!^#hi~O!]!ai!^!ai~P#BwO!]#hi!^#hi~P#BwOa%nO#`7OO'{%nO~Oa%nO!g#vO#`7OO'{%nO~O!](uq!k(uqa(uq'{(uq~P!:tO!](kO!k(tq~O!S%hO!_%iO#k7VO(U%gO~O!_'aO%j7YO~On7^O!_'aO%j7YO~O#l'jaP'jaR'ja['jaa'jaj'jar'ja!S'ja!l'ja!p'ja#R'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#w'ja#y'ja#{'ja#|'ja'{'ja(b'ja(s'ja!k'ja!Y'ja'x'jav'ja!_'ja%j'ja!g'ja~P%-tO#l'laP'laR'la['laa'laj'lar'la!S'la!l'la!p'la#R'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#w'la#y'la#{'la#|'la'{'la(b'la(s'la!k'la!Y'la'x'lav'la!_'la%j'la!g'la~P%.gO#l$}iP$}iR$}i[$}ia$}ij$}ir$}i!S$}i!]$}i!l$}i!p$}i#R$}i#o$}i#p$}i#q$}i#r$}i#s$}i#t$}i#u$}i#v$}i#w$}i#y$}i#{$}i#|$}i'{$}i(b$}i(s$}i!k$}i!Y$}i'x$}i#`$}iv$}i!_$}i%j$}i!g$}i~P#/sO#l%biP%biR%bi[%bia%bij%bir%bi!S%bi!l%bi!p%bi#R%bi#o%bi#p%bi#q%bi#r%bi#s%bi#t%bi#u%bi#v%bi#w%bi#y%bi#{%bi#|%bi'{%bi(b%bi(s%bi!k%bi!Y%bi'x%biv%bi!_%bi%j%bi!g%bi~P%5}O#l%diP%diR%di[%dia%dij%dir%di!S%di!l%di!p%di#R%di#o%di#p%di#q%di#r%di#s%di#t%di#u%di#v%di#w%di#y%di#{%di#|%di'{%di(b%di(s%di!k%di!Y%di'x%div%di!_%di%j%di!g%di~P%6pO!]'Za!k'Za~P!:tO!].vO!k(li~O$P#ci!]#ci!^#ci~P#BwOP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(bVO[#nij#nir#ni#R#ni#p#ni#q#ni#r#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni$P#ni(s#ni(z#ni({#ni!]#ni!^#ni~O#o#ni~P%NrO#o<aO~P%NrOP$[OR#zOr<mO!Q#yO!S#{O!l#xO!p$[O#o<aO#p<bO#q<bO#r<bO(bVO[#nij#ni#R#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni$P#ni(s#ni(z#ni({#ni!]#ni!^#ni~O#s#ni~P&!zO#s<cO~P&!zOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO(bVO#y#ni#{#ni#|#ni$P#ni(s#ni(z#ni({#ni!]#ni!^#ni~O#w#ni~P&%SOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO#w<eO(bVO({#}O#{#ni#|#ni$P#ni(s#ni(z#ni!]#ni!^#ni~O#y<gO~P&'TO#y#ni~P&'TO#w<eO~P&%SOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO#w<eO#y<gO(bVO(z#|O({#}O#|#ni$P#ni(s#ni!]#ni!^#ni~O#{#ni~P&)dO#{<iO~P&)dOa#}y!]#}y'{#}y'x#}y!Y#}y!k#}yv#}y!_#}y%j#}y!g#}y~P!:tO[#nij#nir#ni#R#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni$P#ni(s#ni!]#ni!^#ni~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#o<aO#p<bO#q<bO#r<bO(bVO(z#ni({#ni~P&,`On>_O!Q*PO'z*QO(z$}O({%POP#niR#ni!S#ni!l#ni!p#ni#o#ni#p#ni#q#ni#r#ni(b#ni~P&,`O#S$dOP(aXR(aX[(aXj(aXn(aXr(aX!Q(aX!S(aX!l(aX!p(aX#R(aX#o(aX#p(aX#q(aX#r(aX#s(aX#t(aX#u(aX#v(aX#w(aX#y(aX#{(aX#|(aX$P(aX'z(aX(b(aX(s(aX(z(aX({(aX!](aX!^(aX~O$P$Qi!]$Qi!^$Qi~P#BwO$P!ri!^!ri~P$+}Og'^a!]'^a~P!1WO!^7pO~O!]'ea!^'ea~P#BwO!Y7qO~P#/sO!g#vO(s'qO!]'fa!k'fa~O!]/rO!k)Pi~O!]/rO!g#vO!k)Pi~Og$}q!]$}q#`$}q$P$}q~P!1WO!Y'ha!]'ha~P#/sO!g7xO~O!]/{O!Y)Qi~P#/sO!]/{O!Y)Qi~O!Y7{O~Oh%VOr8QO!l%eO(s'qO~Oj8SO!g#vO~Or8VO!g#vO(s'qO~O!Q*PO'z*QO({%POn'ka(z'ka!]'ka#`'ka~Og'ka$P'ka~P&5aO!Q*PO'z*QOn'ma(z'ma({'ma!]'ma#`'ma~Og'ma$P'ma~P&6SOg(`q!](`q~P!1WO#`8XOg(`q!](`q~P!1WO!Y8YO~Og%Pq!]%Pq#`%Pq$P%Pq~P!1WOa$py!]$py'{$py'x$py!Y$py!k$pyv$py!_$py%j$py!g$py~P!:tO!g6tO~O!]5^O!_)Ra~O!_'aOP$UaR$Ua[$Uaj$Uar$Ua!Q$Ua!S$Ua!]$Ua!l$Ua!p$Ua#R$Ua#o$Ua#p$Ua#q$Ua#r$Ua#s$Ua#t$Ua#u$Ua#v$Ua#w$Ua#y$Ua#{$Ua#|$Ua(b$Ua(s$Ua(z$Ua({$Ua~O%j7YO~P&8tO%_8^Oa%]i!_%]i'{%]i!]%]i~Oa#cy!]#cy'{#cy'x#cy!Y#cy!k#cyv#cy!_#cy%j#cy!g#cy~P!:tO[8`O~Ob8bO(U+sO(WTO(ZUO~O!]1VO!^)Yi~O`8fO~O(f(}O!]'qX!^'qX~O!]5wO!^)Va~O!^8pO~P%;sO(p!sO~P$&YO#[8qO~O!_1qO~O!_1qO%j8sO~On8vO!_1qO%j8sO~O[8{O!]'ta!^'ta~O!]1|O!^)Wi~O!k9PO~O!k9QO~O!k9TO~O!k9TO~P%[Oa9VO~O!g9WO~O!k9XO~O!](xi!^(xi~P#BwOa%nO#`9aO'{%nO~O!](uy!k(uya(uy'{(uy~P!:tO!](kO!k(ty~O%j9dO~P&8tO!_'aO%j9dO~O#l$}qP$}qR$}q[$}qa$}qj$}qr$}q!S$}q!]$}q!l$}q!p$}q#R$}q#o$}q#p$}q#q$}q#r$}q#s$}q#t$}q#u$}q#v$}q#w$}q#y$}q#{$}q#|$}q'{$}q(b$}q(s$}q!k$}q!Y$}q'x$}q#`$}qv$}q!_$}q%j$}q!g$}q~P#/sO#l'kaP'kaR'ka['kaa'kaj'kar'ka!S'ka!l'ka!p'ka#R'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#w'ka#y'ka#{'ka#|'ka'{'ka(b'ka(s'ka!k'ka!Y'ka'x'kav'ka!_'ka%j'ka!g'ka~P&5aO#l'maP'maR'ma['maa'maj'mar'ma!S'ma!l'ma!p'ma#R'ma#o'ma#p'ma#q'ma#r'ma#s'ma#t'ma#u'ma#v'ma#w'ma#y'ma#{'ma#|'ma'{'ma(b'ma(s'ma!k'ma!Y'ma'x'mav'ma!_'ma%j'ma!g'ma~P&6SO#l%PqP%PqR%Pq[%Pqa%Pqj%Pqr%Pq!S%Pq!]%Pq!l%Pq!p%Pq#R%Pq#o%Pq#p%Pq#q%Pq#r%Pq#s%Pq#t%Pq#u%Pq#v%Pq#w%Pq#y%Pq#{%Pq#|%Pq'{%Pq(b%Pq(s%Pq!k%Pq!Y%Pq'x%Pq#`%Pqv%Pq!_%Pq%j%Pq!g%Pq~P#/sO!]'Zi!k'Zi~P!:tO$P#cq!]#cq!^#cq~P#BwO(z$}OP%baR%ba[%baj%bar%ba!S%ba!l%ba!p%ba#R%ba#o%ba#p%ba#q%ba#r%ba#s%ba#t%ba#u%ba#v%ba#w%ba#y%ba#{%ba#|%ba$P%ba(b%ba(s%ba!]%ba!^%ba~On%ba!Q%ba'z%ba({%ba~P&JXO({%POP%daR%da[%daj%dar%da!S%da!l%da!p%da#R%da#o%da#p%da#q%da#r%da#s%da#t%da#u%da#v%da#w%da#y%da#{%da#|%da$P%da(b%da(s%da!]%da!^%da~On%da!Q%da'z%da(z%da~P&L`On>_O!Q*PO'z*QO({%PO~P&JXOn>_O!Q*PO'z*QO(z$}O~P&L`OR0mO!Q0mO!S0nO#S$dOP}a[}aj}an}ar}a!l}a!p}a#R}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#w}a#y}a#{}a#|}a$P}a'z}a(b}a(s}a(z}a({}a!]}a!^}a~O!Q*PO'z*QOP$taR$ta[$taj$tan$tar$ta!S$ta!l$ta!p$ta#R$ta#o$ta#p$ta#q$ta#r$ta#s$ta#t$ta#u$ta#v$ta#w$ta#y$ta#{$ta#|$ta$P$ta(b$ta(s$ta(z$ta({$ta!]$ta!^$ta~O!Q*PO'z*QOP$vaR$va[$vaj$van$var$va!S$va!l$va!p$va#R$va#o$va#p$va#q$va#r$va#s$va#t$va#u$va#v$va#w$va#y$va#{$va#|$va$P$va(b$va(s$va(z$va({$va!]$va!^$va~On>_O!Q*PO'z*QO(z$}O({%PO~OP%UaR%Ua[%Uaj%Uar%Ua!S%Ua!l%Ua!p%Ua#R%Ua#o%Ua#p%Ua#q%Ua#r%Ua#s%Ua#t%Ua#u%Ua#v%Ua#w%Ua#y%Ua#{%Ua#|%Ua$P%Ua(b%Ua(s%Ua!]%Ua!^%Ua~P''eO$P$nq!]$nq!^$nq~P#BwO$P$pq!]$pq!^$pq~P#BwO!^9qO~O$P9rO~P!1WO!g#vO!]'fi!k'fi~O!g#vO(s'qO!]'fi!k'fi~O!]/rO!k)Pq~O!Y'hi!]'hi~P#/sO!]/{O!Y)Qq~Or9yO!g#vO(s'qO~O[9{O!Y9zO~P#/sO!Y9zO~Oj:RO!g#vO~Og(`y!](`y~P!1WO!]'oa!_'oa~P#/sOa%]q!_%]q'{%]q!]%]q~P#/sO[:WO~O!]1VO!^)Yq~O`:[O~O#`:]O!]'qa!^'qa~O!]5wO!^)Vi~P#BwO!S:_O~O!_1qO%j:bO~O(WTO(ZUO(f:gO~O!]1|O!^)Wq~O!k:jO~O!k:kO~O!k:lO~O!k:lO~P%[O#`:oO!]#hy!^#hy~O!]#hy!^#hy~P#BwO%j:tO~P&8tO!_'aO%j:tO~O$P#}y!]#}y!^#}y~P#BwOP$}iR$}i[$}ij$}ir$}i!S$}i!l$}i!p$}i#R$}i#o$}i#p$}i#q$}i#r$}i#s$}i#t$}i#u$}i#v$}i#w$}i#y$}i#{$}i#|$}i$P$}i(b$}i(s$}i!]$}i!^$}i~P''eO!Q*PO'z*QO({%POP'jaR'ja['jaj'jan'jar'ja!S'ja!l'ja!p'ja#R'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#w'ja#y'ja#{'ja#|'ja$P'ja(b'ja(s'ja(z'ja!]'ja!^'ja~O!Q*PO'z*QOP'laR'la['laj'lan'lar'la!S'la!l'la!p'la#R'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#w'la#y'la#{'la#|'la$P'la(b'la(s'la(z'la({'la!]'la!^'la~O(z$}OP%biR%bi[%bij%bin%bir%bi!Q%bi!S%bi!l%bi!p%bi#R%bi#o%bi#p%bi#q%bi#r%bi#s%bi#t%bi#u%bi#v%bi#w%bi#y%bi#{%bi#|%bi$P%bi'z%bi(b%bi(s%bi({%bi!]%bi!^%bi~O({%POP%diR%di[%dij%din%dir%di!Q%di!S%di!l%di!p%di#R%di#o%di#p%di#q%di#r%di#s%di#t%di#u%di#v%di#w%di#y%di#{%di#|%di$P%di'z%di(b%di(s%di(z%di!]%di!^%di~O$P$py!]$py!^$py~P#BwO$P#cy!]#cy!^#cy~P#BwO!g#vO!]'fq!k'fq~O!]/rO!k)Py~O!Y'hq!]'hq~P#/sOr;OO!g#vO(s'qO~O[;SO!Y;RO~P#/sO!Y;RO~Og(`!R!](`!R~P!1WOa%]y!_%]y'{%]y!]%]y~P#/sO!]1VO!^)Yy~O!]5wO!^)Vq~O(U;ZO~O!_1qO%j;^O~O!k;aO~O%j;fO~P&8tOP$}qR$}q[$}qj$}qr$}q!S$}q!l$}q!p$}q#R$}q#o$}q#p$}q#q$}q#r$}q#s$}q#t$}q#u$}q#v$}q#w$}q#y$}q#{$}q#|$}q$P$}q(b$}q(s$}q!]$}q!^$}q~P''eO!Q*PO'z*QO({%POP'kaR'ka['kaj'kan'kar'ka!S'ka!l'ka!p'ka#R'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#w'ka#y'ka#{'ka#|'ka$P'ka(b'ka(s'ka(z'ka!]'ka!^'ka~O!Q*PO'z*QOP'maR'ma['maj'man'mar'ma!S'ma!l'ma!p'ma#R'ma#o'ma#p'ma#q'ma#r'ma#s'ma#t'ma#u'ma#v'ma#w'ma#y'ma#{'ma#|'ma$P'ma(b'ma(s'ma(z'ma({'ma!]'ma!^'ma~OP%PqR%Pq[%Pqj%Pqr%Pq!S%Pq!l%Pq!p%Pq#R%Pq#o%Pq#p%Pq#q%Pq#r%Pq#s%Pq#t%Pq#u%Pq#v%Pq#w%Pq#y%Pq#{%Pq#|%Pq$P%Pq(b%Pq(s%Pq!]%Pq!^%Pq~P''eOg%f!Z!]%f!Z#`%f!Z$P%f!Z~P!1WO!Y;jO~P#/sOr;kO!g#vO(s'qO~O[;mO!Y;jO~P#/sO!]'qq!^'qq~P#BwO!]#h!Z!^#h!Z~P#BwO#l%f!ZP%f!ZR%f!Z[%f!Za%f!Zj%f!Zr%f!Z!S%f!Z!]%f!Z!l%f!Z!p%f!Z#R%f!Z#o%f!Z#p%f!Z#q%f!Z#r%f!Z#s%f!Z#t%f!Z#u%f!Z#v%f!Z#w%f!Z#y%f!Z#{%f!Z#|%f!Z'{%f!Z(b%f!Z(s%f!Z!k%f!Z!Y%f!Z'x%f!Z#`%f!Zv%f!Z!_%f!Z%j%f!Z!g%f!Z~P#/sOr;vO!g#vO(s'qO~O!Y;wO~P#/sOr<OO!g#vO(s'qO~O!Y<PO~P#/sOP%f!ZR%f!Z[%f!Zj%f!Zr%f!Z!S%f!Z!l%f!Z!p%f!Z#R%f!Z#o%f!Z#p%f!Z#q%f!Z#r%f!Z#s%f!Z#t%f!Z#u%f!Z#v%f!Z#w%f!Z#y%f!Z#{%f!Z#|%f!Z$P%f!Z(b%f!Z(s%f!Z!]%f!Z!^%f!Z~P''eOr<SO!g#vO(s'qO~Ov(gX~P1qO!Q%rO~P!)[O(V!lO~P!)[O!YfX!]fX#`fX~P%2^OP]XR]X[]Xj]Xr]X!Q]X!S]X!]]X!]fX!l]X!p]X#R]X#S]X#`]X#`fX#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X(b]X(s]X(z]X({]X~O!gfX!k]X!kfX(sfX~P'LcOP<WOQ<WOSfOd>SOe!iOpkOr<WOskOtkOzkO|<WO!O<WO!SWO!WkO!XkO!_XO!i<ZO!lZO!o<WO!p<WO!q<WO!s<[O!u<_O!x!hO$X!kO$o>QO(U)^O(WTO(ZUO(bVO(p[O~O!]<kO!^$ra~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<vO!S${O!_$|O!i>XO!l$xO#k<|O$X%`O$u<xO$w<zO$z%aO(U(wO(WTO(ZUO(b$uO(z$}O({%PO~Ol)eO~P(#XOr!eX(s!eX~P#!nO!^]X!^fX~P'LcO!YfX!Y${X!]fX!]${X#`fX~P!0SO#l<`O~O!g#vO#l<`O~O#`<pO~Oj<dO~O#`=PO!](xX!^(xX~O#`<pO!](vX!^(vX~O#l=QO~Og=SO~P!1WO#l=YO~O#l=ZO~Og=SO(U&ZO~O!g#vO#l=[O~O!g#vO#l=QO~O$P=]O~P#BwO#l=^O~O#l=_O~O#l=dO~O#l=eO~O#l=fO~O#l=gO~O$P=hO~P!1WO$P=iO~P!1WOl=tO~P7eOk#S#T#U#W#X#[#j#k#v$o$u$w$z%^%_%i%j%k%r%t%w%x%z%|~(PT#p!X'}(V#qs#o#rr!Q(O$^(U$`(f~",
		goto: "$9_)^PPPPPP)_PP)bP)sP+X/^PPPP6lPP7SPP=PPPP@sPA]PA]PPPA]PCePA]PA]PA]PCiPCnPD]PIVPPPIZPPPPIZL^PPPLdMUPIZPIZPP! dIZPPPIZPIZP!#kIZP!'R!(W!(aP!)T!)X!)T!,fPPPPPPP!-V!(WPP!-g!/XP!2hIZIZ!2m!5y!:g!:g!>f!>nPPP!>tIZPPPPPPPPP!BTP!CbPPIZ!DsPIZPIZIZIZIZIZPIZ!FVP!IaP!LgP!Lk!Lu!Ly!LyP!I^P!L}!L}P#!TP#!XIZPIZ#!_#%dCiA]PA]PA]A]P#&qA]A]#)TA]#+{A]#.XA]A]#.w#1]#1]#1b#1k#1]#1vPP#1]PA]#2`A]#6_A]A]6lPPP#:dPPP#:}#:}P#:}P#;e#:}PP#;kP#;bP#;b#<O#;b#<j#<p#<s)bP#<v)bP#=P#=P#=PP)bP)bP)bP)bPP)bP#=V#=YP#=Y)bP#=^P#=aP)bP)bP)bP)bP)bP)b)bPP#=g#=m#=x#>O#>U#>[#>b#>p#>v#?Q#?W#?b#?h#?x#@O#@p#AS#AY#A`#An#BT#Cx#DW#D_#Ey#FX#Gy#HX#H_#He#Hk#Hu#H{#IR#I]#Io#IuPPPPPPPPPPP#I{PPPPPPP#Jp#M}$ g$ n$ vPPP$'bP$'k$*d$0}$1Q$1T$2S$2V$2^$2fP$2l$2oP$3]$3a$4X$5g$5l$6SPP$6X$6_$6c$6f$6j$6n$7j$8R$8j$8n$8q$8t$9O$9R$9V$9ZR!|RoqOXst!Z#d%m&r&t&u&w,u,z2^2aY!vQ'a-g1q5}Q%tvQ%|yQ&T|Q&j!VS'W!e-^Q'g!iS'm!r!yU*l$|*[*pQ+q%}S,O&V&WQ,f&dQ-e'`Q-o'hQ-w'nQ0^*rQ1d,QQ1{,gR<}<[%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_,r,u,z-k-s.R.X.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3n4|6V6g6h6k7O8v9V9aS#q]<X!r)`$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TU+Q%]<u<vQ+v&PQ,h&gQ,o&oQ0z+iQ1P+kQ1[+wQ2T,mQ3b.iQ5b1OQ5h1VQ6^1|Q7[3fQ8b5iR9g7^'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>T!S!nQ!r!v!y!z$|'W'`'a'm'n'o*l*p*r*s-^-e-g-w0^0a1q5}6P%[$ti#v$b$c$d$x${%O%Q%^%_%c)z*S*U*W*Z*b*h*x*y+h+k,U,X.h/R/f/o/z/{/}0b0d0k0l0q1h1k1s3e4`4a4l4q5S5^5a6U7Y7x8S8X8^8s9d9r9{:R:b:t;S;^;f;m<n<o<q<r<s<t<w<x<y<z<{<|=T=U=V=W=Y=Z=^=_=`=a=b=c=d=e=h=i>Q>Y>Z>^>_Q&X|S'U!e*[S']%i-bQ+v&PQ,R&WQ,h&gQ0p+TQ1[+wQ1a+}Q2S,lQ2T,mQ5h1VQ5q1cQ6^1|Q6a2OQ6b2RQ8b5iQ8e5nQ9O6dQ:Z8fQ:h8{R;X:[rnOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aR,j&k&z^OPXYstuvwz!Z!`!g!j!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'c's(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>S>T[#]WZ#W#Z'X(U!b%jm#h#i#l$x%e%h(_(i(j(k*Z*_*c+[+^+`,q-W.V.].^._.a/o/r2f3^3_4c6t7VQ%wxQ%{yW&Q|&V&W,QQ&_!TQ'd!hQ'f!iQ(r#sS+p%|%}Q+t&PQ,a&bQ,e&dS-n'g'hQ.k(sQ1T+qQ1Z+wQ1]+xQ1`+|Q1v,bS1z,f,gQ3O-oQ5g1VQ5k1YQ5p1bQ6]1{Q8a5iQ8d5mQ8h5rQ:V8`R;V:W!U$zi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z!^%yy!i!u%{%|%}'V'f'g'h'l'v*k+p+q-Z-n-o-v0T0W1T2w3O3V4t4u4x8P9}Q+j%wQ,V&[Q,Y&]Q,d&dQ.j(rQ1u,aU1y,e,f,gQ3g.kQ6W1vS6[1z1{Q8z6]#f>U#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_o>V<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=iW%Ti%V*z>QS&[!Q&iQ&]!RQ&^!SU+O%[%d=tR,T&Y%]%Si#v$b$c$d$x${%O%Q%^%_%c)z*S*U*W*Z*b*h*x*y+h+k,U,X.h/R/f/o/z/{/}0b0d0k0l0q1h1k1s3e4`4a4l4q5S5^5a6U7Y7x8S8X8^8s9d9r9{:R:b:t;S;^;f;m<n<o<q<r<s<t<w<x<y<z<{<|=T=U=V=W=Y=Z=^=_=`=a=b=c=d=e=h=i>Q>Y>Z>^>_T){$u)|V+Q%]<u<vW']!e%i*[-bS)O#y#zQ+e%rQ+{&SS.d(n(oQ1l,ZQ5V0mR8k5w'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>T$i$^c#Y#e%q%s%u(T(Z(u(z)S)T)U)V)W)X)Y)Z)[)])_)a)c)h)r+f+z-[-z.P.U.W.u.x.|/O/P/Q/d0r2o2t3Q3X3m3r3s3t3u3v3w3x3y3z3{3|3}4O4R4S4Z5Z5e6w6}7S7c7d7m7n8m9Z9_9i9o9p:q;Y;b<Y=wT#TV#U'RkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TQ'Y!eR2r-^!W!nQ!e!r!v!y!z$|'W'`'a'm'n'o*[*l*p*r*s-^-e-g-w0^0a1q5}6PR1n,]nqOXst!Z#d%m&r&t&u&w,u,z2^2aQ&y!^Q'w!xS(t#u<`Q+n%zQ,_&_Q,`&aQ-l'eQ-y'pS.t(y=QS0s+Y=[Q1R+oQ1p,^Q2e,|Q2g,}Q2n-XQ2|-mQ3P-qS5[0t=fQ5c1SS5f1U=gQ6v2pQ6z2}Q7P3UQ8_5dQ9[6xQ9]6{Q9`7QR:n9X$d$]c#Y#e%s%u(T(Z(u(z)S)T)U)V)W)X)Y)Z)[)])_)a)c)h)r+f+z-[-z.P.U.W.u.x.|/P/Q/d0r2o2t3Q3X3m3r3s3t3u3v3w3x3y3z3{3|3}4O4R4S4Z5Z5e6w6}7S7c7d7m7n8m9Z9_9i9o9p:q;Y;b<Y=wS(p#p'jQ)Q#zS+d%q/OS.e(o(qR3`.f'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TS#q]<XQ&t!XQ&u!YQ&w![Q&x!]R2],xQ'b!hQ+g%wQ-j'dS.g(r+jQ2z-iW3d.j.k0y0{Q6y2{W7W3a3c3g5`U9c7X7Z7]U:s9e9f9hS;d:r:uQ;r;eR;z;sU!wQ'a-gT5{1q5}!Q_OXZ`st!V!Z#d#h%e%m&i&k&r&t&u&w(k,u,z.^2^2a]!pQ!r'a-g1q5}T#q]<X%^{OPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aS)O#y#zS.d(n(o!s=m$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TU$fd)`,oS(q#p'jU*w%R(x4QU0o+P.p7iQ5`0zQ7X3bQ9f7[R:u9gm!tQ!r!v!y!z'a'm'n'o-g-w1q5}6PQ'u!uS(g#g2WS-u'l'xQ/u*^Q0T*kQ3W-xQ4h/vQ4t0VQ4u0WQ4z0`Q7t4bS8P4v4xS8T4{4}Q9t7uQ9x7{Q9}8QQ:S8VS:}9y9zS;i;O;RS;u;j;kS;};v;wS<R<O<PR<U<SQ#wbQ't!uS(f#g2WS(h#m+XQ+Z%fQ+l%xQ+r&OU-t'l'u'xQ.Y(gU/t*^*a/yQ0U*kQ0X*mQ1Q+mQ1w,cS3T-u-xQ3].bS4g/u/vQ4p0RS4s0T0`Q4w0YQ6Y1xQ7R3WS7s4b4dQ7w4hU8O4t4z4}Q8R4yQ8x6ZS9s7t7uQ9w7{Q:P8TQ:Q8UQ:e8yQ:{9tS:|9x9zQ;U:SQ;`:fS;h:};RS;t;i;jS;|;u;wS<Q;}<PQ<T<RQ<V<UQ=p=kQ=|=uR=}=vV!wQ'a-g%^aOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aS#wz!j!r=j$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TR=p>S%^bOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aQ%fj!^%xy!i!u%{%|%}'V'f'g'h'l'v*k+p+q-Z-n-o-v0T0W1T2w3O3V4t4u4x8P9}S&Oz!jQ+m%yQ,c&dW1x,d,e,f,gU6Z1y1z1{S8y6[6]Q:f8z!r=k$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TQ=u>RR=v>S%QeOPXYstuvw!Z!`!g!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'c's(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aY#bWZ#W#Z(U!b%jm#h#i#l$x%e%h(_(i(j(k*Z*_*c+[+^+`,q-W.V.].^._.a/o/r2f3^3_4c6t7VQ,p&o!p=l$Z$n)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TR=o'XU'^!e%i*[R2u-bX'[!e%i*[-b%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_,r,u,z-k-s.R.X.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3n4|6V6g6h6k7O8v9V9a!r)`$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TQ,o&oQ0z+iQ3b.iQ7[3fR9g7^!b$Tc#Y%q(T(Z(u(z)[)])a)h+z-z.P.U.W.u.x/d0r3Q3X3m3}5Z5e6}7S7c9_:q<Y!P<f)_)r-[/O2o2t3r3{3|4R4Z6w7d7m7n8m9Z9i9o9p;Y;b=w!f$Vc#Y%q(T(Z(u(z)X)Y)[)])a)h+z-z.P.U.W.u.x/d0r3Q3X3m3}5Z5e6}7S7c9_:q<Y!T<h)_)r-[/O2o2t3r3x3y3{3|4R4Z6w7d7m7n8m9Z9i9o9p;Y;b=w!^$Zc#Y%q(T(Z(u(z)a)h+z-z.P.U.W.u.x/d0r3Q3X3m3}5Z5e6}7S7c9_:q<YQ4a/mz>T)_)r-[/O2o2t3r4R4Z6w7d7m7n8m9Z9i9o9p;Y;b=wQ>Y>[R>Z>]'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TS$oh$pR4W/W'XgOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/W/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TT$kf$qQ$ifS)k$l)oR)w$qT$jf$qT)m$l)o'XhOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/W/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TT$oh$pQ$rhR)v$p%^jOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9a!s>R$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>T#glOPXZst!Z!`!o#S#d#o#{$n%m&k&n&o&r&t&u&w&{'T'c)P)t*j+_+i,r,u,z-k.i/X/p0_0n1t2U2V2X2Z2^2a2c3f4V4|6V6g6h6k7^8v9V!U%Ri$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z#f(x#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_Q+U%aQ/e*Po4Q<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=i!U$yi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>ZQ*d$zU*m$|*[*pQ+V%bQ0Y*n#f=r#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_n=s<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=iQ=x>UQ=y>VQ=z>WR={>X!U%Ri$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z#f(x#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_o4Q<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=inoOXst!Z#d%m&r&t&u&w,u,z2^2aS*g${*ZQ-T'OQ-U'QR4k/{%[%Si#v$b$c$d$x${%O%Q%^%_%c)z*S*U*W*Z*b*h*x*y+h+k,U,X.h/R/f/o/z/{/}0b0d0k0l0q1h1k1s3e4`4a4l4q5S5^5a6U7Y7x8S8X8^8s9d9r9{:R:b:t;S;^;f;m<n<o<q<r<s<t<w<x<y<z<{<|=T=U=V=W=Y=Z=^=_=`=a=b=c=d=e=h=i>Q>Y>Z>^>_Q,W&]Q1j,YQ5u1iR8j5vV*o$|*[*pU*o$|*[*pT5|1q5}S0R*j/pQ4y0_T8U4|:_Q+l%xQ0X*mQ1Q+mQ1w,cQ6Y1xQ8x6ZQ:e8yR;`:f!U%Oi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Zx*S$v)f*T*v+W/x0f0g4T4i5T5U5Y7r8W:T:z=q>O>PS0b*u0c#f<q#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_n<r<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=i!d=T(v)d*]*f.l.o.s/a/m0O0x1g3j4^4j4n5t7_7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]`=U4P7e7h7l9j:v:y;{S=`.n3kT=a7g9m!U%Qi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z|*U$v)f*V*u+W/i/x0f0g4T4i5O5T5U5Y7r8W:T:z=q>O>PS0d*v0e#f<s#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_n<t<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=i!h=V(v)d*]*f.m.n.s/a/m0O0x1g3h3j4^4j4n5t7_7`7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]d=W4P7f7g7l9j9k:v:w:y;{S=b.o3lT=c7h9nrnOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aQ&f!UR,r&ornOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aR&f!UQ,[&^R1f,TsnOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aQ1r,aS6T1u1vU8r6R6S6WS:a8t8uS;[:`:cQ;o;]R;y;pQ&m!VR,k&iR6a2OR:h8{W&Q|&V&W,QR1]+xQ&r!WR,u&sR,{&xT2_,z2aR-P&yQ-O&yR2h-PQ'z!{R-{'zSsOtQ#dXT%ps#dQ#OTR'|#OQ#RUR(O#RQ)|$uR/b)|Q#UVR(R#UQ#XWU(X#X(Y.SQ(Y#YR.S(ZQ-_'YR2s-_Q.w(zS3o.w3pR3p.xQ-g'aR2x-gY!rQ'a-g1q5}R'k!rQ/S)fR4U/SU#_W%h*ZU(`#_(a.TQ(a#`R.T([Q-c'^R2v-ct`OXst!V!Z#d%m&i&k&r&t&u&w,u,z2^2aS#hZ%eU#r`#h.^R.^(kQ(l#jQ.Z(hW.c(l.Z3Z7TQ3Z.[R7T3[Q)o$lR/Y)oQ$phR)u$pQ$`cU)b$`.O<lQ.O<YR<l)rQ/s*^W4e/s4f7v9uU4f/t/u/vS7v4g4hR9u7w$e*R$v(v)d)f*]*f*u*v+R+S+W.n.o.q.r.s/a/i/k/m/x0O0f0g0x1g3h3i3j4P4T4^4i4j4n5O5Q5T5U5Y5t7_7`7a7b7g7h7j7k7l7r7y7|8W8Z8]9j9k9l9v:O:T:U:v:w:x:y:z;P;T;g;l;x;{=q>O>P>[>]Q/|*fU4m/|4o7zQ4o0OR7z4nS*p$|*[R0[*px*T$v)f*u*v+W/x0f0g4T4i5T5U5Y7r8W:T:z=q>O>P!d.l(v)d*]*f.n.o.s/a/m0O0x1g3j4^4j4n5t7_7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]U/j*T.l7ea7e4P7g7h7l9j:v:y;{Q0c*uQ3k.nU5P0c3k9mR9m7g|*V$v)f*u*v+W/i/x0f0g4T4i5O5T5U5Y7r8W:T:z=q>O>P!h.m(v)d*]*f.n.o.s/a/m0O0x1g3h3j4^4j4n5t7_7`7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]U/l*V.m7fe7f4P7g7h7l9j9k:v:w:y;{Q0e*vQ3l.oU5R0e3l9nR9n7hQ*{%UR0i*{Q5_0xR8[5_Q+a%kR0w+aQ5x1lS8l5x:^R:^8mQ,^&_R1o,^Q5}1qR8o5}Q1},hS6_1}8|R8|6aQ1W+tW5j1W5l8c:XQ5l1ZQ8c5kR:X8dQ+y&QR1^+yQ2a,zR6o2aYrOXst#dQ&v!ZQ+c%mQ,t&rQ,v&tQ,w&uQ,y&wQ2[,uS2_,z2aR6n2^Q%opQ&z!_Q&}!aQ'P!bQ'R!cQ'r!uQ+b%lQ+n%zQ,S&XQ,j&mQ-R&|W-r'l't'u'xQ-y'pQ0Z*oQ1R+oQ1e,RS2Q,k,nQ2i-QQ2j-TQ2k-UQ3P-qW3R-t-u-x-zQ5c1SQ5o1aQ5s1gQ6X1wQ6c2SQ6m2]U6|3Q3T3WQ7P3UQ8_5dQ8g5qQ8i5tQ8n5|Q8w6YQ8}6bS9^6}7RQ9`7QQ:Y8eQ:d8xQ:i9OQ:p9_Q;W:ZQ;_:eQ;c:qQ;n;XR;q;`Q%zyQ'e!iQ'p!uU+o%{%|%}Q-X'VU-m'f'g'hS-q'l'vQ0S*kS1S+p+qQ2p-ZS2}-n-oQ3U-vS4r0T0WQ5d1TQ6x2wQ6{3OQ7Q3VU7}4t4u4xQ9|8PR;Q9}S$wi>QR*|%VU%Ui%V>QR0h*zQ$viS(v#v+kS)d$b$cQ)f$dQ*]$xS*f${*ZQ*u%OQ*v%QQ+R%^Q+S%_Q+W%cQ.n<qQ.o<sQ.q<wQ.r<yQ.s<{Q/a)zQ/i*SQ/k*UQ/m*WQ/x*bS0O*h/oQ0f*xQ0g*yl0x+h,X.h1k1s3e6U7Y8s9d:b:t;^;fQ1g,UQ3h=TQ3i=VQ3j=YS4P<n<oQ4T/RS4^/f4`Q4i/zQ4j/{Q4n/}Q5O0bQ5Q0dQ5T0kQ5U0lQ5Y0qQ5t1hQ7_=^Q7`=`Q7a=bQ7b=dQ7g<rQ7h<tQ7j<xQ7k<zQ7l<|Q7r4aQ7y4lQ7|4qQ8W5SQ8Z5^Q8]5aQ9j=ZQ9k=UQ9l=WQ9v7xQ:O8SQ:T8XQ:U8^Q:v=_Q:w=aQ:x=cQ:y=eQ:z9rQ;P9{Q;T:RQ;g=hQ;l;SQ;x;mQ;{=iQ=q>QQ>O>YQ>P>ZQ>[>^R>]>_Q+P%]Q.p<uR7i<vnpOXst!Z#d%m&r&t&u&w,u,z2^2aQ!fPS#fZ#oQ&|!`W'i!o*j0_4|Q(Q#SQ)R#{Q)s$nS,n&k&nQ,s&oQ-Q&{S-V'T/pQ-i'cQ.z)PQ/^)tQ0u+_Q0{+iQ2Y,rQ2{-kQ3c.iQ4Y/XQ5W0nQ6S1tQ6e2UQ6f2VQ6j2XQ6l2ZQ6q2cQ7]3fQ7o4VQ8u6VQ9R6gQ9S6hQ9U6kQ9h7^Q:c8vR:m9V#[cOPXZst!Z!`!o#d#o#{%m&k&n&o&r&t&u&w&{'T'c)P*j+_+i,r,u,z-k.i/p0_0n1t2U2V2X2Z2^2a2c3f4|6V6g6h6k7^8v9VQ#YWQ#eYQ%quQ%svS%uw!gS(T#W(WQ(Z#ZQ(u#uQ(z#xQ)S$OQ)T$PQ)U$QQ)V$RQ)W$SQ)X$TQ)Y$UQ)Z$VQ)[$WQ)]$XQ)_$ZQ)a$_Q)c$aQ)h$eW)r$n)t/X4VQ+f%tQ+z&RS-['X2qQ-z'sS.P(U.RQ.U(^Q.W(eQ.u(yQ.x({Q.|<WQ/O<ZQ/P<[Q/Q<_Q/d*OQ0r+YQ2o-YQ2t-aQ3Q-sQ3X.XQ3m.vQ3r<`Q3s<aQ3t<bQ3u<cQ3v<dQ3w<eQ3x<fQ3y<gQ3z<hQ3{<iQ3|<jQ3}.}Q4O<mQ4R<pQ4S<}Q4Z<kQ5Z0tQ5e1UQ6w=PQ6}3SQ7S3YQ7c3nQ7d=QQ7m=SQ7n=[Q8m5yQ9Z6uQ9_7OQ9i=]Q9o=fQ9p=gQ:q9aQ;Y:]Q;b:oQ<Y#SR=w>TR#[WR'Z!el!tQ!r!v!y!z'a'm'n'o-g-w1q5}6PS'V!e-^U*k$|*[*pS-Z'W'`S0W*l*rQ0`*sQ2w-eQ4x0^R4}0aR(|#xQ!fQT-f'a-g]!qQ!r'a-g1q5}Q#p]R'j<XR)g$dY!uQ'a-g1q5}Q'l!rS'v!v!yS'x!z6PS-v'm'nQ-x'oR3V-wT#kZ%eS#jZ%eS%km,qU(h#h#i#lS.[(i(jQ.`(kQ0v+`Q3[.]U3].^._.aS7U3^3_R9b7Vd#^W#W#Z%h(U(_*Z+[.V/or#gZm#h#i#l%e(i(j(k+`.].^._.a3^3_7VS*^$x*cQ/v*_Q2W,qQ2m-WQ4b/rQ6s2fQ7u4cQ9Y6tT=n'X+^V#aW%h*ZU#`W%h*ZS(V#W(_U([#Z+[/oS-]'X+^T.Q(U.VV'_!e%i*[Q$lfR)y$qT)n$l)oR4X/WT*`$x*cT*i${*ZQ0y+hQ1i,XQ3a.hQ5v1kQ6R1sQ7Z3eQ8t6UQ9e7YQ:`8sQ:r9dQ;]:bQ;e:tQ;p;^R;s;fnqOXst!Z#d%m&r&t&u&w,u,z2^2aQ&l!VR,j&itmOXst!U!V!Z#d%m&i&r&t&u&w,u,z2^2aR,q&oT%lm,qR1m,ZR,i&gQ&U|S,P&V&WR1`,QR+u&PT&p!W&sT&q!W&sT2`,z2a",
		nodeNames: "⚠ ArithOp ArithOp ?. JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList in out const TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewTarget new NewExpression ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression TypeArgList CompareOp < declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty VariableDefinition Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression InstantiationExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast < ArrowFunction TypeParamList SequenceExpression InstantiationExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate asserts is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration defer ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
		maxTerm: 381,
		context: zS,
		nodeProps: [
			[
				"isolate",
				-8,
				5,
				6,
				14,
				37,
				39,
				51,
				53,
				55,
				""
			],
			[
				"group",
				-26,
				9,
				17,
				19,
				68,
				208,
				212,
				216,
				217,
				219,
				222,
				225,
				235,
				238,
				244,
				246,
				248,
				250,
				253,
				259,
				265,
				267,
				269,
				271,
				273,
				275,
				276,
				"Statement",
				-34,
				13,
				14,
				32,
				35,
				36,
				42,
				51,
				54,
				55,
				57,
				62,
				70,
				72,
				76,
				80,
				82,
				84,
				85,
				110,
				111,
				121,
				122,
				137,
				140,
				142,
				143,
				144,
				145,
				146,
				148,
				149,
				168,
				170,
				172,
				"Expression",
				-23,
				31,
				33,
				37,
				41,
				43,
				45,
				174,
				176,
				178,
				179,
				181,
				182,
				183,
				185,
				186,
				187,
				189,
				190,
				191,
				202,
				204,
				206,
				207,
				"Type",
				-3,
				88,
				103,
				109,
				"ClassItem"
			],
			[
				"openedBy",
				23,
				"<",
				38,
				"InterpolationStart",
				56,
				"[",
				60,
				"{",
				73,
				"(",
				161,
				"JSXStartCloseTag"
			],
			[
				"closedBy",
				-2,
				24,
				169,
				">",
				40,
				"InterpolationEnd",
				50,
				"]",
				61,
				"}",
				74,
				")",
				166,
				"JSXEndTag"
			]
		],
		propSources: [GS],
		skippedNodes: [
			0,
			5,
			6,
			279
		],
		repeatNodeCount: 37,
		tokenData: "$Fq07[R!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#:O!R![#<_![!]#I_!]!^#Jk!^!_#Ku!_!`$![!`!a$$v!a!b$*T!b!c$,r!c!}Er!}#O$-|#O#P$/W#P#Q$4o#Q#R$5y#R#SEr#S#T$7W#T#o$8b#o#p$<r#p#q$=h#q#r$>x#r#s$@U#s$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$I|Er$I|$I}$Dk$I}$JO$Dk$JO$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr(n%d_$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$j&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$j&j([!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU([!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$j&j(XpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(XpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z07[+rq$j&j(Xp([!b'}0/lOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z07[.ST(Y#S$j&j(O0/lO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c07[.n_$j&j(Xp([!b(O0/lOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)3p/x`$j&j!p),Q(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW1V`#w(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW2d_#w(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At3l_(W':f$j&j([!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$j&j([!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$j&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$e`$j&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$e``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$e`$j&j([!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ([!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$e`([!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k%9[:hh$j&j(Xp([!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__WS$j&j(Xp([!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]WS$j&j([!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXWS$j&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSWSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWWS([!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]WS$j&j(XpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWWS(XpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYWS(Xp([!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S%9[C}i$j&j(p%1l(Xp([!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr%9[EoP;=`<%lCr07[FRk$j&j(Xp([!b$^#t(U,2j(f$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$j&j(Xp([!b$^#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv07[JPP;=`<%lEr(KWJ_`$j&j(Xp([!b#q(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWKl_$j&j$R(Ch(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,#xLva({+JY$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWNW`$j&j#{(Ch(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At! c_(Z';W$j&j(XpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$j&j(XpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$j&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$e`$j&j(XpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(XpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$e`(XpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b/5|!'t_!l/.^$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&U!)O_!k!Lf$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z-!n!*[b$j&j(Xp([!b(V%&f#r(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW!+o`$j&j(Xp([!b#o(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;x!,|`$j&j(Xp([!br+4YOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,$U!.Z_!]+Jf$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!/ec$j&j(Xp([!b!Q.2^OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!0ya$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!2Z_![!L^$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!3eg$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!5Vg$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!6wc$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!8_c$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!9uf$j&j(Xp([!b#p(ChOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcxz!;Zz{#-}{!P!;Z!P!Q#/d!Q!^!;Z!^!_#(i!_!`#7S!`!a#8i!a!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z?O!;fb$j&j(Xp([!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z>^!<w`$j&j([!b!X7`OY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eq!Q!^!<n!^!_!Gr!_!}!<n!}#O!KS#O#P!Dy#P#o!<n#o#p!Gr#p;'S!<n;'S;=`!L]<%lO!<n<z!>Q^$j&j!X7`OY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@c!_!}!=y!}#O!CW#O#P!Dy#P#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!?Td$j&j!X7`O!^&c!_#W&c#W#X!>|#X#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#k!>|#k#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&c7`!@hX!X7`OY!@cZ!P!@c!P!Q!AT!Q!}!@c!}#O!Ar#O#P!Bq#P;'S!@c;'S;=`!CQ<%lO!@c7`!AYW!X7`#W#X!AT#Z#[!AT#]#^!AT#a#b!AT#g#h!AT#i#j!AT#j#k!AT#m#n!AT7`!AuVOY!ArZ#O!Ar#O#P!B[#P#Q!@c#Q;'S!Ar;'S;=`!Bk<%lO!Ar7`!B_SOY!ArZ;'S!Ar;'S;=`!Bk<%lO!Ar7`!BnP;=`<%l!Ar7`!BtSOY!@cZ;'S!@c;'S;=`!CQ<%lO!@c7`!CTP;=`<%l!@c<z!C][$j&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#O!CW#O#P!DR#P#Q!=y#Q#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DWX$j&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DvP;=`<%l!CW<z!EOX$j&jOY!=yYZ&cZ!^!=y!^!_!@c!_#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!EnP;=`<%l!=y>^!Ezl$j&j([!b!X7`OY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#W&}#W#X!Eq#X#Z&}#Z#[!Eq#[#]&}#]#^!Eq#^#a&}#a#b!Eq#b#g&}#g#h!Eq#h#i&}#i#j!Eq#j#k!Eq#k#m&}#m#n!Eq#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}8r!GyZ([!b!X7`OY!GrZw!Grwx!@cx!P!Gr!P!Q!Hl!Q!}!Gr!}#O!JU#O#P!Bq#P;'S!Gr;'S;=`!J|<%lO!Gr8r!Hse([!b!X7`OY'}Zw'}x#O'}#P#W'}#W#X!Hl#X#Z'}#Z#[!Hl#[#]'}#]#^!Hl#^#a'}#a#b!Hl#b#g'}#g#h!Hl#h#i'}#i#j!Hl#j#k!Hl#k#m'}#m#n!Hl#n;'S'};'S;=`(f<%lO'}8r!JZX([!bOY!JUZw!JUwx!Arx#O!JU#O#P!B[#P#Q!Gr#Q;'S!JU;'S;=`!Jv<%lO!JU8r!JyP;=`<%l!JU8r!KPP;=`<%l!Gr>^!KZ^$j&j([!bOY!KSYZ&cZw!KSwx!CWx!^!KS!^!_!JU!_#O!KS#O#P!DR#P#Q!<n#Q#o!KS#o#p!JU#p;'S!KS;'S;=`!LV<%lO!KS>^!LYP;=`<%l!KS>^!L`P;=`<%l!<n=l!Ll`$j&j(Xp!X7`OY!LcYZ&cZr!Lcrs!=ys!P!Lc!P!Q!Mn!Q!^!Lc!^!_# o!_!}!Lc!}#O#%P#O#P!Dy#P#o!Lc#o#p# o#p;'S!Lc;'S;=`#&Y<%lO!Lc=l!Mwl$j&j(Xp!X7`OY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#W(r#W#X!Mn#X#Z(r#Z#[!Mn#[#](r#]#^!Mn#^#a(r#a#b!Mn#b#g(r#g#h!Mn#h#i(r#i#j!Mn#j#k!Mn#k#m(r#m#n!Mn#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r8Q# vZ(Xp!X7`OY# oZr# ors!@cs!P# o!P!Q#!i!Q!}# o!}#O#$R#O#P!Bq#P;'S# o;'S;=`#$y<%lO# o8Q#!pe(Xp!X7`OY)rZr)rs#O)r#P#W)r#W#X#!i#X#Z)r#Z#[#!i#[#])r#]#^#!i#^#a)r#a#b#!i#b#g)r#g#h#!i#h#i)r#i#j#!i#j#k#!i#k#m)r#m#n#!i#n;'S)r;'S;=`*Z<%lO)r8Q#$WX(XpOY#$RZr#$Rrs!Ars#O#$R#O#P!B[#P#Q# o#Q;'S#$R;'S;=`#$s<%lO#$R8Q#$vP;=`<%l#$R8Q#$|P;=`<%l# o=l#%W^$j&j(XpOY#%PYZ&cZr#%Prs!CWs!^#%P!^!_#$R!_#O#%P#O#P!DR#P#Q!Lc#Q#o#%P#o#p#$R#p;'S#%P;'S;=`#&S<%lO#%P=l#&VP;=`<%l#%P=l#&]P;=`<%l!Lc?O#&kn$j&j(Xp([!b!X7`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#W%Z#W#X#&`#X#Z%Z#Z#[#&`#[#]%Z#]#^#&`#^#a%Z#a#b#&`#b#g%Z#g#h#&`#h#i%Z#i#j#&`#j#k#&`#k#m%Z#m#n#&`#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z9d#(r](Xp([!b!X7`OY#(iZr#(irs!Grsw#(iwx# ox!P#(i!P!Q#)k!Q!}#(i!}#O#+`#O#P!Bq#P;'S#(i;'S;=`#,`<%lO#(i9d#)th(Xp([!b!X7`OY*gZr*grs'}sw*gwx)rx#O*g#P#W*g#W#X#)k#X#Z*g#Z#[#)k#[#]*g#]#^#)k#^#a*g#a#b#)k#b#g*g#g#h#)k#h#i*g#i#j#)k#j#k#)k#k#m*g#m#n#)k#n;'S*g;'S;=`+Z<%lO*g9d#+gZ(Xp([!bOY#+`Zr#+`rs!JUsw#+`wx#$Rx#O#+`#O#P!B[#P#Q#(i#Q;'S#+`;'S;=`#,Y<%lO#+`9d#,]P;=`<%l#+`9d#,cP;=`<%l#(i?O#,o`$j&j(Xp([!bOY#,fYZ&cZr#,frs!KSsw#,fwx#%Px!^#,f!^!_#+`!_#O#,f#O#P!DR#P#Q!;Z#Q#o#,f#o#p#+`#p;'S#,f;'S;=`#-q<%lO#,f?O#-tP;=`<%l#,f?O#-zP;=`<%l!;Z07[#.[b$j&j(Xp([!b(P0/l!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z07[#/o_$j&j(Xp([!bT0/lOY#/dYZ&cZr#/drs#0nsw#/dwx#4Ox!^#/d!^!_#5}!_#O#/d#O#P#1p#P#o#/d#o#p#5}#p;'S#/d;'S;=`#6|<%lO#/d06j#0w]$j&j([!bT0/lOY#0nYZ&cZw#0nwx#1px!^#0n!^!_#3R!_#O#0n#O#P#1p#P#o#0n#o#p#3R#p;'S#0n;'S;=`#3x<%lO#0n05W#1wX$j&jT0/lOY#1pYZ&cZ!^#1p!^!_#2d!_#o#1p#o#p#2d#p;'S#1p;'S;=`#2{<%lO#1p0/l#2iST0/lOY#2dZ;'S#2d;'S;=`#2u<%lO#2d0/l#2xP;=`<%l#2d05W#3OP;=`<%l#1p01O#3YW([!bT0/lOY#3RZw#3Rwx#2dx#O#3R#O#P#2d#P;'S#3R;'S;=`#3r<%lO#3R01O#3uP;=`<%l#3R06j#3{P;=`<%l#0n05x#4X]$j&j(XpT0/lOY#4OYZ&cZr#4Ors#1ps!^#4O!^!_#5Q!_#O#4O#O#P#1p#P#o#4O#o#p#5Q#p;'S#4O;'S;=`#5w<%lO#4O00^#5XW(XpT0/lOY#5QZr#5Qrs#2ds#O#5Q#O#P#2d#P;'S#5Q;'S;=`#5q<%lO#5Q00^#5tP;=`<%l#5Q05x#5zP;=`<%l#4O01p#6WY(Xp([!bT0/lOY#5}Zr#5}rs#3Rsw#5}wx#5Qx#O#5}#O#P#2d#P;'S#5};'S;=`#6v<%lO#5}01p#6yP;=`<%l#5}07[#7PP;=`<%l#/d)3h#7ab$j&j$R(Ch(Xp([!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;ZAt#8vb$[#t$j&j(Xp([!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z'Ad#:Zp$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#U%Z#U#V#?i#V#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#d#Bq#d#l%Z#l#m#Es#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#<jk$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#>j_$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#?rd$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#A]f$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Bzc$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Dbe$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#E|g$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Gpi$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x#Il_!g$b$j&j$P)Lv(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#Jv_al$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f#LS^h#)`#R-<U(Xp([!b$o7`OY*gZr*grs'}sw*gwx)rx!P*g!P!Q#MO!Q!^*g!^!_#Mt!_!`$ f!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#MXX$l&j(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El#M}Z#s(Ch(Xp([!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#Np!`#O*g#P;'S*g;'S;=`+Z<%lO*g(El#NyX$R(Ch(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El$ oX#t(Ch(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g*)x$!ga#`*!Y$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$#l!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(K[$#w_#l(Cl$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x$%Vag!*r#t(Ch$g#|$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$&[!`!a$'f!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$&g_#t(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$'qa#s(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$(v!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$)R`#s(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(Kd$*`a(s(Ct$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!a%Z!a!b$+e!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$+p`$j&j#|(Ch(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`$,}_!|$Ip$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f$.X_!S0,v$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/]Z$j&jO!^$0O!^!_$0f!_#i$0O#i#j$0k#j#l$0O#l#m$2^#m#o$0O#o#p$0f#p;'S$0O;'S;=`$4i<%lO$0O(n$0VT_#S$j&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0kO_#S(n$0p[$j&jO!Q&c!Q![$1f![!^&c!_!c&c!c!i$1f!i#T&c#T#Z$1f#Z#o&c#o#p$3|#p;'S&c;'S;=`&w<%lO&c(n$1kZ$j&jO!Q&c!Q![$2^![!^&c!_!c&c!c!i$2^!i#T&c#T#Z$2^#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2cZ$j&jO!Q&c!Q![$3U![!^&c!_!c&c!c!i$3U!i#T&c#T#Z$3U#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3ZZ$j&jO!Q&c!Q![$0O![!^&c!_!c&c!c!i$0O!i#T&c#T#Z$0O#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$4PR!Q![$4Y!c!i$4Y#T#Z$4Y#S$4]S!Q![$4Y!c!i$4Y#T#Z$4Y#q#r$0f(n$4lP;=`<%l$0O#1[$4z_!Y#)l$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$6U`#y(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;p$7c_$j&j(Xp([!b(b+4QOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$8qk$j&j(Xp([!b(U,2j$`#t(f$I[OY%ZYZ&cZr%Zrs&}st%Ztu$8buw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$8b![!^%Z!^!_*g!_!c%Z!c!}$8b!}#O%Z#O#P&c#P#R%Z#R#S$8b#S#T%Z#T#o$8b#o#p*g#p$g%Z$g;'S$8b;'S;=`$<l<%lO$8b+d$:qk$j&j(Xp([!b$`#tOY%ZYZ&cZr%Zrs&}st%Ztu$:fuw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$:f![!^%Z!^!_*g!_!c%Z!c!}$:f!}#O%Z#O#P&c#P#R%Z#R#S$:f#S#T%Z#T#o$:f#o#p*g#p$g%Z$g;'S$:f;'S;=`$<f<%lO$:f+d$<iP;=`<%l$:f07[$<oP;=`<%l$8b#Jf$<{X!_#Hb(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g,#x$=sa(z+JY$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+e#q;'S%Z;'S;=`+a<%lO%Z)>v$?V_!^(CdvBr$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z?O$@a_!q7`$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$Aq|$j&j(Xp([!b'}0/l$^#t(U,2j(f$I[OX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr07[$D|k$j&j(Xp([!b(O0/l$^#t(U,2j(f$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
		tokenizers: [
			VS,
			HS,
			US,
			WS,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			BS,
			new nS("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOx~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!U~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(d~~", 141, 341),
			new nS("j~RQYZXz{^~^O(R~~aP!P!Qd~iO(S~~", 25, 324)
		],
		topRules: {
			Script: [0, 7],
			SingleExpression: [1, 277],
			SingleClassItem: [2, 278]
		},
		dialects: {
			jsx: 0,
			ts: 15179
		},
		dynamicPrecedences: {
			80: 1,
			82: 1,
			94: 1,
			170: 1,
			200: 1
		},
		specialized: [
			{
				term: 328,
				get: (e) => KS[e] || -1
			},
			{
				term: 344,
				get: (e) => qS[e] || -1
			},
			{
				term: 95,
				get: (e) => JS[e] || -1
			}
		],
		tokenPrec: 15205
	});
}));
// node_modules/@codemirror/autocomplete/dist/index.js
function ZS(e) {
	let t = Object.keys(e).join(""), n = /\w/.test(t);
	return n && (t = t.replace(/\w/g, "")), `[${n ? "\\w" : ""}${t.replace(/[^\w\s]/g, "\\$&")}]`;
}
function QS(e) {
	let t = Object.create(null), n = Object.create(null);
	for (let { label: r } of e) {
		t[r[0]] = !0;
		for (let e = 1; e < r.length; e++) n[r[e]] = !0;
	}
	let r = ZS(t) + ZS(n) + "*$";
	return [RegExp("^" + r), new RegExp(r)];
}
function $S(e) {
	let t = e.map((e) => typeof e == "string" ? { label: e } : e), [n, r] = t.every((e) => /^\w+$/.test(e.label)) ? [/\w*$/, /\w+$/] : QS(t);
	return (e) => {
		let i = e.matchBefore(r);
		return i || e.explicit ? {
			from: i ? i.from : e.pos,
			options: t,
			validFor: n
		} : null;
	};
}
function eC(e, t) {
	return (n) => {
		for (let t = gy(n.state).resolveInner(n.pos, -1); t; t = t.parent) {
			if (e.indexOf(t.name) > -1) return null;
			if (t.type.isTop) break;
		}
		return t(n);
	};
}
function tC(e, t) {
	return K.create(e.filter((e) => e.field == t).map((e) => K.range(e.from, e.to)));
}
function nC(e) {
	let t = lC.parse(e);
	return (e, n, r, i) => {
		let { text: a, ranges: o } = t.instantiate(e.state, r), { main: s } = e.state.selection, c = {
			changes: {
				from: r,
				to: i == s.from ? s.to : i,
				insert: Zc.of(a)
			},
			scrollIntoView: !0,
			annotations: n ? [aC.of(n), jl.userEvent.of("input.complete")] : void 0
		};
		if (o.length && (c.selection = tC(o, 0)), o.some((e) => e.field > 0)) {
			let t = new fC(o, 0), n = c.effects = [pC.of(t)];
			e.state.field(hC, !1) === void 0 && n.push(Al.appendConfig.of([
				hC,
				xC,
				SC,
				oC
			]));
		}
		e.dispatch(e.state.update(c));
	};
}
function rC(e) {
	return ({ state: t, dispatch: n }) => {
		let r = t.field(hC, !1);
		if (!r || e < 0 && r.active == 0) return !1;
		let i = r.active + e, a = e > 0 && !r.ranges.some((t) => t.field == i + e);
		return n(t.update({
			selection: tC(r.ranges, i),
			effects: pC.of(a ? null : new fC(r.ranges, i)),
			scrollIntoView: !0
		})), !0;
	};
}
function iC(e, t) {
	return {
		...t,
		apply: nC(e)
	};
}
var aC, oC, sC, cC, lC, uC, dC, fC, pC, mC, hC, gC, _C, vC, yC, bC, xC, SC, CC, wC = t((() => {
	Gl(), X_(), Rx(), aC = /*@__PURE__*/ Dl.define(), typeof navigator == "object" && navigator.platform, oC = /*@__PURE__*/ X.baseTheme({
		".cm-tooltip.cm-tooltip-autocomplete": { "& > ul": {
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
				opacity: .7
			}
		} },
		"&light .cm-tooltip-autocomplete ul li[aria-selected]": {
			background: "#17c",
			color: "white"
		},
		"&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": { background: "#777" },
		"&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
			background: "#347",
			color: "white"
		},
		"&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": { background: "#444" },
		".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
			content: "\"···\"",
			opacity: .5,
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
		".cm-completionMatchedText": { textDecoration: "underline" },
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
		".cm-completionIcon-function, .cm-completionIcon-method": { "&:after": { content: "'ƒ'" } },
		".cm-completionIcon-class": { "&:after": { content: "'○'" } },
		".cm-completionIcon-interface": { "&:after": { content: "'◌'" } },
		".cm-completionIcon-variable": { "&:after": { content: "'𝑥'" } },
		".cm-completionIcon-constant": { "&:after": { content: "'𝐶'" } },
		".cm-completionIcon-type": { "&:after": { content: "'𝑡'" } },
		".cm-completionIcon-enum": { "&:after": { content: "'∪'" } },
		".cm-completionIcon-property": { "&:after": { content: "'□'" } },
		".cm-completionIcon-keyword": { "&:after": { content: "'🔑︎'" } },
		".cm-completionIcon-namespace": { "&:after": { content: "'▢'" } },
		".cm-completionIcon-text": { "&:after": {
			content: "'abc'",
			fontSize: "50%",
			verticalAlign: "middle"
		} }
	}), sC = class {
		constructor(e, t, n, r) {
			this.field = e, this.line = t, this.from = n, this.to = r;
		}
	}, cC = class e {
		constructor(e, t, n) {
			this.field = e, this.from = t, this.to = n;
		}
		map(t) {
			let n = t.mapPos(this.from, -1, al.TrackDel), r = t.mapPos(this.to, 1, al.TrackDel);
			return n == null || r == null ? null : new e(this.field, n, r);
		}
	}, lC = class e {
		constructor(e, t) {
			this.lines = e, this.fieldPositions = t;
		}
		instantiate(e, t) {
			let n = [], r = [t], i = e.doc.lineAt(t), a = /^\s*/.exec(i.text)[0];
			for (let i of this.lines) {
				if (n.length) {
					let n = a, o = /^\t*/.exec(i)[0].length;
					for (let t = 0; t < o; t++) n += e.facet(Bb);
					r.push(t + n.length - o), i = n + i.slice(o);
				}
				n.push(i), t += i.length + 1;
			}
			return {
				text: n,
				ranges: this.fieldPositions.map((e) => new cC(e.field, r[e.line] + e.from, r[e.line] + e.to))
			};
		}
		static parse(t) {
			let n = [], r = [], i = [], a;
			for (let e of t.split(/\r\n?|\n/)) {
				for (; a = /[#$]\{(?:(\d+)(?::([^{}]*))?|((?:\\[{}]|[^{}])*))\}/.exec(e);) {
					let t = a[1] ? +a[1] : null, o = a[2] || a[3] || "", s = -1;
					t === 0 && (t = 1e9);
					let c = o.replace(/\\[{}]/g, (e) => e[1]);
					for (let e = 0; e < n.length; e++) (t == null ? c && n[e].name == c : n[e].seq == t) && (s = e);
					if (s < 0) {
						let e = 0;
						for (; e < n.length && (t == null || n[e].seq != null && n[e].seq < t);) e++;
						n.splice(e, 0, {
							seq: t,
							name: c
						}), s = e;
						for (let e of i) e.field >= s && e.field++;
					}
					for (let e of i) if (e.line == r.length && e.from > a.index) {
						let t = a[2] ? 3 + (a[1] || "").length : 2;
						e.from -= t, e.to -= t;
					}
					i.push(new sC(s, r.length, a.index, a.index + c.length)), e = e.slice(0, a.index) + o + e.slice(a.index + a[0].length);
				}
				e = e.replace(/\\([{}])/g, (e, t, n) => {
					for (let e of i) e.line == r.length && e.from > n && (e.from--, e.to--);
					return t;
				}), r.push(e);
			}
			return new e(r, i);
		}
	}, uC = /*@__PURE__*/ Y.widget({ widget: /*@__PURE__*/ new class extends Yp {
		toDOM() {
			let e = document.createElement("span");
			return e.className = "cm-snippetFieldPosition", e;
		}
		ignoreEvent() {
			return !1;
		}
	}() }), dC = /*@__PURE__*/ Y.mark({ class: "cm-snippetField" }), fC = class e {
		constructor(e, t) {
			this.ranges = e, this.active = t, this.deco = Y.set(e.map((e) => (e.from == e.to ? uC : dC).range(e.from, e.to)), !0);
		}
		map(t) {
			let n = [];
			for (let e of this.ranges) {
				let r = e.map(t);
				if (!r) return null;
				n.push(r);
			}
			return new e(n, this.active);
		}
		selectionInsideField(e) {
			return e.ranges.every((e) => this.ranges.some((t) => t.field == this.active && t.from <= e.from && t.to >= e.to));
		}
	}, pC = /*@__PURE__*/ Al.define({ map(e, t) {
		return e && e.map(t);
	} }), mC = /*@__PURE__*/ Al.define(), hC = /*@__PURE__*/ pl.define({
		create() {
			return null;
		},
		update(e, t) {
			for (let n of t.effects) {
				if (n.is(pC)) return n.value;
				if (n.is(mC) && e) return new fC(e.ranges, n.value);
			}
			return e && t.docChanged && (e = e.map(t.changes)), e && t.selection && !e.selectionInsideField(t.selection) && (e = null), e;
		},
		provide: (e) => X.decorations.from(e, (e) => e ? e.deco : Y.none)
	}), gC = ({ state: e, dispatch: t }) => e.field(hC, !1) ? (t(e.update({ effects: pC.of(null) })), !0) : !1, _C = /*@__PURE__*/ rC(1), vC = /*@__PURE__*/ rC(-1), yC = [{
		key: "Tab",
		run: _C,
		shift: vC
	}, {
		key: "Escape",
		run: gC
	}], bC = /*@__PURE__*/ q.define({ combine(e) {
		return e.length ? e[0] : yC;
	} }), xC = /*@__PURE__*/ hl.highest(/*@__PURE__*/ Tg.compute([bC], (e) => e.facet(bC))), SC = /*@__PURE__*/ X.domEventHandlers({ mousedown(e, t) {
		let n = t.state.field(hC, !1), r;
		if (!n || (r = t.posAtCoords({
			x: e.clientX,
			y: e.clientY
		})) == null) return !1;
		let i = n.ranges.find((e) => e.from <= r && e.to >= r);
		return !i || i.field == n.active ? !1 : (t.dispatch({
			selection: tC(n.ranges, i.field),
			effects: pC.of(n.ranges.some((e) => e.field > i.field) ? new fC(n.ranges, i.field) : null),
			scrollIntoView: !0
		}), !0);
	} }), CC = /*@__PURE__*/ new class extends Ll {}(), CC.startSide = 1, CC.endSide = -1, typeof navigator == "object" && navigator.userAgent;
})), TC = /* @__PURE__ */ n({
	autoCloseTags: () => nw,
	completionPath: () => AC,
	esLint: () => IC,
	javascript: () => NC,
	javascriptLanguage: () => qC,
	jsxLanguage: () => XC,
	localCompletionSource: () => OC,
	scopeCompletionSource: () => MC,
	snippets: () => zC,
	tsxLanguage: () => ZC,
	typescriptLanguage: () => YC,
	typescriptSnippets: () => BC
});
function EC(e) {
	return (t, n) => {
		let r = t.node.getChild("VariableDefinition");
		return r && n(r, e), !0;
	};
}
function DC(e, t) {
	let n = VC.get(t);
	if (n) return n;
	let r = [], i = !0;
	function a(t, n) {
		let i = e.sliceString(t.from, t.to);
		r.push({
			label: i,
			type: n
		});
	}
	return t.cursor(gv.IncludeAnonymous).iterate((t) => {
		if (i) i = !1;
		else if (t.name) {
			let e = WC[t.name];
			if (e && e(t, a) || HC.has(t.name)) return !1;
		} else if (t.to - t.from > 8192) {
			for (let n of DC(e, t.node)) r.push(n);
			return !1;
		}
	}), VC.set(t, r), r;
}
function OC(e) {
	let t = gy(e.state).resolveInner(e.pos, -1);
	if (KC.indexOf(t.name) > -1) return null;
	let n = t.name == "VariableName" || t.to - t.from < 20 && GC.test(e.state.sliceDoc(t.from, t.to));
	if (!n && !e.explicit) return null;
	let r = [];
	for (let n = t; n; n = n.parent) HC.has(n.name) && (r = r.concat(DC(e.state.doc, n)));
	return {
		options: r,
		from: n ? t.from : e.pos,
		validFor: GC
	};
}
function kC(e, t, n) {
	let r = [];
	for (;;) {
		let i = t.firstChild, a;
		if (i?.name == "VariableName") return r.push(e(i)), {
			path: r.reverse(),
			name: n
		};
		if (i?.name == "MemberExpression" && (a = i.lastChild)?.name == "PropertyName") r.push(e(a)), t = i;
		else return null;
	}
}
function AC(e) {
	let t = (t) => e.state.doc.sliceString(t.from, t.to), n = gy(e.state).resolveInner(e.pos, -1);
	return n.name == "PropertyName" ? kC(t, n.parent, t(n)) : (n.name == "." || n.name == "?.") && n.parent.name == "MemberExpression" ? kC(t, n.parent, "") : KC.indexOf(n.name) > -1 ? null : n.name == "VariableName" || n.to - n.from < 20 && GC.test(t(n)) ? {
		path: [],
		name: t(n)
	} : n.name == "MemberExpression" ? kC(t, n, "") : e.explicit ? {
		path: [],
		name: ""
	} : null;
}
function jC(e, t) {
	let n = e, r = [], i = /* @__PURE__ */ new Set();
	for (let a = 0;; a++) {
		for (let o of (Object.getOwnPropertyNames || Object.keys)(e)) {
			if (!/^[a-zA-Z_$\xaa-\uffdc][\w$\xaa-\uffdc]*$/.test(o) || i.has(o)) continue;
			i.add(o);
			let e;
			try {
				e = n[o];
			} catch {
				continue;
			}
			r.push({
				label: o,
				type: typeof e == "function" ? /^[A-Z]/.test(o) ? "class" : t ? "function" : "method" : t ? "variable" : "property",
				boost: -a
			});
		}
		let o = Object.getPrototypeOf(e);
		if (!o) return r;
		e = o;
	}
}
function MC(e) {
	let t = /* @__PURE__ */ new Map();
	return (n) => {
		let r = AC(n);
		if (!r) return null;
		let i = e;
		for (let e of r.path) if (i = i[e], !i) return null;
		let a = t.get(i);
		return a || t.set(i, a = jC(i, !r.path.length)), {
			from: n.pos - r.name.length,
			options: a,
			validFor: GC
		};
	};
}
function NC(e = {}) {
	let t = e.jsx ? e.typescript ? ZC : XC : e.typescript ? YC : qC, n = e.typescript ? BC.concat(ew) : zC.concat($C);
	return new Lb(t, [
		qC.data.of({ autocomplete: eC(KC, $S(n)) }),
		qC.data.of({ autocomplete: OC }),
		e.jsx ? nw : []
	]);
}
function PC(e) {
	for (;;) {
		if (e.name == "JSXOpenTag" || e.name == "JSXSelfClosingTag" || e.name == "JSXFragmentTag") return e;
		if (e.name == "JSXEscape" || !e.parent) return null;
		e = e.parent;
	}
}
function FC(e, t, n = e.length) {
	for (let r = t?.firstChild; r; r = r.nextSibling) if (r.name == "JSXIdentifier" || r.name == "JSXBuiltin" || r.name == "JSXNamespacedName" || r.name == "JSXMemberExpression") return e.sliceString(r.from, Math.min(r.to, n));
	return "";
}
function IC(e, t) {
	return t || (t = {
		parserOptions: {
			ecmaVersion: 2019,
			sourceType: "module"
		},
		env: {
			browser: !0,
			node: !0,
			es6: !0,
			es2015: !0,
			es2017: !0,
			es2020: !0
		},
		rules: {}
	}, e.getRules().forEach((e, n) => {
		e.meta.docs?.recommended && (t.rules[n] = 2);
	})), (n) => {
		let { state: r } = n, i = [];
		for (let { from: n, to: a } of qC.findRegions(r)) {
			let o = r.doc.lineAt(n), s = {
				line: o.number - 1,
				col: n - o.from,
				pos: n
			};
			for (let o of e.verify(r.sliceDoc(n, a), t)) i.push(RC(o, r.doc, s));
		}
		return i;
	};
}
function LC(e, t, n, r) {
	return n.line(e + r.line).from + t + (e == 1 ? r.col - 1 : -1);
}
function RC(e, t, n) {
	let r = LC(e.line, e.column, t, n), i = {
		from: r,
		to: e.endLine != null && e.endColumn != 1 ? LC(e.endLine, e.endColumn, t, n) : r,
		message: e.message,
		source: e.ruleId ? "eslint:" + e.ruleId : "eslint",
		severity: e.severity == 1 ? "warning" : "error"
	};
	if (e.fix) {
		let { range: t, text: a } = e.fix, o = t[0] + n.pos - r, s = t[1] + n.pos - r;
		i.actions = [{
			name: "fix",
			apply(e, t) {
				e.dispatch({
					changes: {
						from: t + o,
						to: t + s,
						insert: a
					},
					scrollIntoView: !0
				});
			}
		}];
	}
	return i;
}
var zC, BC, VC, HC, UC, WC, GC, KC, qC, JC, YC, XC, ZC, QC, $C, ew, tw, nw, rw = t((() => {
	XS(), Rx(), Gl(), X_(), wC(), jv(), zC = [
		/*@__PURE__*/ iC("function ${name}(${params}) {\n	${}\n}", {
			label: "function",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
			label: "for",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("for (let ${name} of ${collection}) {\n	${}\n}", {
			label: "for",
			detail: "of loop",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("do {\n	${}\n} while (${})", {
			label: "do",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("while (${}) {\n	${}\n}", {
			label: "while",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("try {\n	${}\n} catch (${error}) {\n	${}\n}", {
			label: "try",
			detail: "/ catch block",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("if (${}) {\n	${}\n}", {
			label: "if",
			detail: "block",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("if (${}) {\n	${}\n} else {\n	${}\n}", {
			label: "if",
			detail: "/ else block",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("class ${name} {\n	constructor(${params}) {\n		${}\n	}\n}", {
			label: "class",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("import {${names}} from \"${module}\"\n${}", {
			label: "import",
			detail: "named",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("import ${name} from \"${module}\"\n${}", {
			label: "import",
			detail: "default",
			type: "keyword"
		})
	], BC = /*@__PURE__*/ zC.concat([
		/*@__PURE__*/ iC("interface ${name} {\n	${}\n}", {
			label: "interface",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("type ${name} = ${type}", {
			label: "type",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("enum ${name} {\n	${}\n}", {
			label: "enum",
			detail: "definition",
			type: "keyword"
		})
	]), VC = /*@__PURE__*/ new Dv(), HC = /*@__PURE__*/ new Set([
		"Script",
		"Block",
		"FunctionExpression",
		"FunctionDeclaration",
		"ArrowFunction",
		"MethodDeclaration",
		"ForStatement"
	]), UC = ["FunctionDeclaration"], WC = {
		FunctionDeclaration: /*@__PURE__*/ EC("function"),
		ClassDeclaration: /*@__PURE__*/ EC("class"),
		ClassExpression: () => !0,
		EnumDeclaration: /*@__PURE__*/ EC("constant"),
		TypeAliasDeclaration: /*@__PURE__*/ EC("type"),
		NamespaceDeclaration: /*@__PURE__*/ EC("namespace"),
		VariableDefinition(e, t) {
			e.matchContext(UC) || t(e, "variable");
		},
		TypeDefinition(e, t) {
			t(e, "type");
		},
		__proto__: null
	}, GC = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/, KC = [
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
	], qC = /*@__PURE__*/ Ob.define({
		name: "javascript",
		parser: /*@__PURE__*/ YS.configure({ props: [/*@__PURE__*/ Hb.add({
			IfStatement: /*@__PURE__*/ Fy({ except: /^\s*({|else\b)/ }),
			TryStatement: /*@__PURE__*/ Fy({ except: /^\s*({|catch\b|finally\b)/ }),
			LabeledStatement: Wb,
			SwitchBody: (e) => {
				let t = e.textAfter, n = /^\s*\}/.test(t), r = /^\s*(case|default)\b/.test(t);
				return e.baseIndent + (n ? 0 : r ? 1 : 2) * e.unit;
			},
			Block: /*@__PURE__*/ Ny({ closing: "}" }),
			ArrowFunction: (e) => e.baseIndent + e.unit,
			"TemplateString BlockComment": () => null,
			"Statement Property": /*@__PURE__*/ Fy({ except: /^\s*{/ }),
			JSXElement(e) {
				let t = /^\s*<\//.test(e.textAfter);
				return e.lineIndent(e.node.from) + (t ? 0 : e.unit);
			},
			JSXEscape(e) {
				let t = /\s*\}/.test(e.textAfter);
				return e.lineIndent(e.node.from) + (t ? 0 : e.unit);
			},
			"JSXOpenTag JSXSelfClosingTag"(e) {
				return e.column(e.node.from) + e.unit;
			}
		}), /*@__PURE__*/ qb.add({
			"Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": Ly,
			BlockComment(e) {
				return {
					from: e.from + 2,
					to: e.to - 2
				};
			},
			JSXElement(e) {
				let t = e.firstChild;
				if (!t || t.name == "JSXSelfClosingTag") return null;
				let n = e.lastChild;
				return {
					from: t.to,
					to: n.type.isError ? e.to : n.from
				};
			},
			"JSXSelfClosingTag JSXOpenTag"(e) {
				let t = e.firstChild?.nextSibling, n = e.lastChild;
				return !t || t.type.isError ? null : {
					from: t.to,
					to: n.type.isError ? e.to : n.from
				};
			}
		})] }),
		languageData: {
			closeBrackets: { brackets: [
				"(",
				"[",
				"{",
				"'",
				"\"",
				"`"
			] },
			commentTokens: {
				line: "//",
				block: {
					open: "/*",
					close: "*/"
				}
			},
			indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
			wordChars: "$"
		}
	}), JC = {
		test: (e) => /^JSX/.test(e.name),
		facet: /*@__PURE__*/ my({ commentTokens: { block: {
			open: "{/*",
			close: "*/}"
		} } })
	}, YC = /*@__PURE__*/ qC.configure({ dialect: "ts" }, "typescript"), XC = /*@__PURE__*/ qC.configure({
		dialect: "jsx",
		props: [/*@__PURE__*/ Eb.add((e) => e.isTop ? [JC] : void 0)]
	}), ZC = /*@__PURE__*/ qC.configure({
		dialect: "jsx ts",
		props: [/*@__PURE__*/ Eb.add((e) => e.isTop ? [JC] : void 0)]
	}, "typescript"), QC = (e) => ({
		label: e,
		type: "keyword"
	}), $C = /*@__PURE__*/ "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(QC), ew = /*@__PURE__*/ $C.concat(/*@__PURE__*/ [
		"declare",
		"implements",
		"private",
		"protected",
		"public"
	].map(QC)), tw = typeof navigator == "object" && /*@__PURE__*/ /Android\b/.test(navigator.userAgent), nw = /*@__PURE__*/ X.inputHandler.of((e, t, n, r, i) => {
		if ((tw ? e.composing : e.compositionStarted) || e.state.readOnly || t != n || r != ">" && r != "/" || !qC.isActiveAt(e.state, t, -1)) return !1;
		let a = i(), { state: o } = a, s = o.changeByRange((e) => {
			let { head: t } = e, n = gy(o).resolveInner(t - 1, -1), i;
			if (n.name == "JSXStartTag" && (n = n.parent), !(o.doc.sliceString(t - 1, t) != r || n.name == "JSXAttributeValue" && n.to > t)) {
				if (r == ">" && n.name == "JSXFragmentTag") return {
					range: e,
					changes: {
						from: t,
						insert: "</>"
					}
				};
				if (r == "/" && n.name == "JSXStartCloseTag") {
					let e = n.parent, r = e.parent;
					if (r && e.from == t - 2 && ((i = FC(o.doc, r.firstChild, t)) || r.firstChild?.name == "JSXFragmentTag")) {
						let e = `${i}>`;
						return {
							range: K.cursor(t + e.length, -1),
							changes: {
								from: t,
								insert: e
							}
						};
					}
				} else if (r == ">") {
					let r = PC(n);
					if (r && r.name == "JSXOpenTag" && !/^\/?>|^<\//.test(o.doc.sliceString(t, t + 2)) && (i = FC(o.doc, r, t))) return {
						range: e,
						changes: {
							from: t,
							insert: `</${i}>`
						}
					};
				}
			}
			return { range: e };
		});
		return !s.changes.empty && (e.dispatch([a, o.update(s, {
			userEvent: "input.complete",
			scrollIntoView: !0
		})]), !0);
	});
}));
// node_modules/@lezer/python/dist/index.js
function iw(e) {
	return e == oT || e == sT;
}
function aw(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function ow(e, t, n) {
	this.parent = e, this.indent = t, this.flags = n, this.hash = (e ? e.hash + e.hash << 8 : 0) + t + (t << 4) + n + (n << 6);
}
function sw(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t += e.charCodeAt(n) == lT ? 8 - t % 8 : 1;
	return t;
}
function cw(e, t) {
	if (t == vT) for (let t = 0; t < 2 && e.next >= 48 && e.next <= 55; t++) e.advance();
	else if (t == yT) for (let t = 0; t < 2 && aw(e.next); t++) e.advance();
	else if (t == xT) for (let t = 0; t < 4 && aw(e.next); t++) e.advance();
	else if (t == ST) for (let t = 0; t < 8 && aw(e.next); t++) e.advance();
	else if (t == bT && e.next == pT) {
		for (e.advance(); e.next >= 0 && e.next != mT && e.next != hT && e.next != gT && e.next != oT;) e.advance();
		e.next == mT && e.advance();
	}
}
var lw, uw, dw, fw, pw, mw, hw, gw, _w, vw, yw, bw, xw, Sw, Cw, ww, Tw, Ew, Dw, Ow, kw, Aw, jw, Mw, Nw, Pw, Fw, Iw, Lw, Rw, zw, Bw, Vw, Hw, Uw, Ww, Gw, Kw, qw, Jw, Yw, Xw, Zw, Qw, $w, eT, tT, nT, rT, iT, aT, oT, sT, cT, lT, uT, dT, fT, pT, mT, hT, gT, _T, vT, yT, bT, xT, ST, CT, wT, TT, ET, DT, OT, kT, AT, jT, MT, NT, PT, FT, IT, LT, RT, zT, BT = t((() => {
	pS(), ly(), lw = 1, uw = 194, dw = 195, fw = 196, pw = 197, mw = 198, hw = 199, gw = 200, _w = 2, vw = 3, yw = 201, bw = 24, xw = 25, Sw = 49, Cw = 50, ww = 55, Tw = 56, Ew = 57, Dw = 59, Ow = 60, kw = 61, Aw = 62, jw = 63, Mw = 65, Nw = 238, Pw = 71, Fw = 241, Iw = 242, Lw = 243, Rw = 244, zw = 245, Bw = 246, Vw = 247, Hw = 248, Uw = 72, Ww = 249, Gw = 250, Kw = 251, qw = 252, Jw = 253, Yw = 254, Xw = 255, Zw = 256, Qw = 73, $w = 77, eT = 263, tT = 112, nT = 130, rT = 151, iT = 152, aT = 155, oT = 10, sT = 13, cT = 32, lT = 9, uT = 35, dT = 40, fT = 46, pT = 123, mT = 125, hT = 39, gT = 34, _T = 92, vT = 111, yT = 120, bT = 78, xT = 117, ST = 85, CT = /* @__PURE__ */ new Set([
		xw,
		Sw,
		Cw,
		eT,
		Mw,
		nT,
		Tw,
		Ew,
		Nw,
		Aw,
		jw,
		Uw,
		Qw,
		$w,
		Ow,
		kw,
		rT,
		iT,
		aT,
		tT
	]), wT = new rS((e, t) => {
		let n;
		if (e.next < 0) e.acceptToken(hw);
		else if (t.context.flags & ET) iw(e.next) && e.acceptToken(mw, 1);
		else if (((n = e.peek(-1)) < 0 || iw(n)) && t.canShift(pw)) {
			let t = 0;
			for (; e.next == cT || e.next == lT;) e.advance(), t++;
			(e.next == oT || e.next == sT || e.next == uT) && e.acceptToken(pw, -t);
		} else iw(e.next) && e.acceptToken(fw, 1);
	}, { contextual: !0 }), TT = new rS((e, t) => {
		let n = t.context;
		if (n.flags) return;
		let r = e.peek(-1);
		if (r == oT || r == sT) {
			let t = 0, r = 0;
			for (;;) {
				if (e.next == cT) t++;
				else if (e.next == lT) t += 8 - t % 8;
				else break;
				e.advance(), r++;
			}
			t != n.indent && e.next != oT && e.next != sT && e.next != uT && (t < n.indent ? e.acceptToken(dw, -r) : e.acceptToken(uw));
		}
	}), ET = 1, DT = 2, OT = 4, kT = 8, AT = 16, jT = 32, MT = new ow(null, 0, 0), NT = new Map([
		[Fw, 0],
		[Iw, OT],
		[Lw, kT],
		[Rw, 12],
		[zw, AT],
		[Bw, 20],
		[Vw, 24],
		[Hw, 28],
		[Ww, jT],
		[Gw, 36],
		[Kw, 40],
		[qw, 44],
		[Jw, 48],
		[Yw, 52],
		[Xw, 56],
		[Zw, 60]
	].map(([e, t]) => [e, t | DT])), PT = new dS({
		start: MT,
		reduce(e, t, n, r) {
			return e.flags & ET && CT.has(t) || (t == Pw || t == Uw) && e.flags & DT ? e.parent : e;
		},
		shift(e, t, n, r) {
			return t == uw ? new ow(e, sw(r.read(r.pos, n.pos)), 0) : t == dw ? e.parent : t == bw || t == ww || t == Dw || t == vw ? new ow(e, 0, ET) : NT.has(t) ? new ow(e, 0, NT.get(t) | e.flags & ET) : e;
		},
		hash(e) {
			return e.hash;
		}
	}), FT = new rS((e) => {
		for (let t = 0; t < 5; t++) {
			if (e.next != "print".charCodeAt(t)) return;
			e.advance();
		}
		if (!/\w/.test(String.fromCharCode(e.next))) for (let t = 0;; t++) {
			let n = e.peek(t);
			if (n != cT && n != lT) {
				n != dT && n != fT && n != oT && n != sT && n != uT && e.acceptToken(lw);
				return;
			}
		}
	}), IT = new rS((e, t) => {
		let { flags: n } = t.context, r = n & OT ? gT : hT, i = (n & kT) > 0, a = !(n & AT), o = (n & jT) > 0, s = e.pos;
		for (; !(e.next < 0);) if (o && e.next == pT) {
			if (e.peek(1) == pT) e.advance(2);
			else {
				if (e.pos == s) {
					e.acceptToken(vw, 1);
					return;
				}
				break;
			}
		} else if (a && e.next == _T) {
			if (e.pos == s) {
				e.advance();
				let t = e.next;
				t >= 0 && (e.advance(), cw(e, t)), e.acceptToken(_w);
				return;
			}
			break;
		} else if (e.next == _T && !a && e.peek(1) > -1) e.advance(2);
		else if (e.next == r && (!i || e.peek(1) == r && e.peek(2) == r)) {
			if (e.pos == s) {
				e.acceptToken(yw, i ? 3 : 1);
				return;
			}
			break;
		} else if (e.next == oT) {
			if (i) e.advance();
			else if (e.pos == s) {
				e.acceptToken(yw);
				return;
			}
			break;
		} else e.advance();
		e.pos > s && e.acceptToken(gw);
	}), LT = Fv({
		"async \"*\" \"**\" FormatConversion FormatSpec": $.modifier,
		"for while if elif else try except finally return raise break continue with pass assert await yield match case": $.controlKeyword,
		"in not and or is del": $.operatorKeyword,
		"from def class global nonlocal lambda": $.definitionKeyword,
		import: $.moduleKeyword,
		"with as print": $.keyword,
		Boolean: $.bool,
		None: $.null,
		VariableName: $.variableName,
		"CallExpression/VariableName": $.function($.variableName),
		"FunctionDefinition/VariableName": $.function($.definition($.variableName)),
		"ClassDefinition/VariableName": $.definition($.className),
		PropertyName: $.propertyName,
		"CallExpression/MemberExpression/PropertyName": $.function($.propertyName),
		Comment: $.lineComment,
		Number: $.number,
		String: $.string,
		FormatString: $.special($.string),
		Escape: $.escape,
		UpdateOp: $.updateOperator,
		"ArithOp!": $.arithmeticOperator,
		BitOp: $.bitwiseOperator,
		CompareOp: $.compareOperator,
		AssignOp: $.definitionOperator,
		Ellipsis: $.punctuation,
		At: $.meta,
		"( )": $.paren,
		"[ ]": $.squareBracket,
		"{ }": $.brace,
		".": $.derefOperator,
		", ;": $.separator
	}), RT = {
		__proto__: null,
		await: 44,
		or: 54,
		and: 56,
		in: 60,
		not: 62,
		is: 64,
		if: 70,
		else: 72,
		lambda: 76,
		yield: 94,
		from: 96,
		async: 102,
		for: 104,
		None: 162,
		True: 164,
		False: 164,
		del: 178,
		pass: 182,
		break: 186,
		continue: 190,
		return: 194,
		raise: 202,
		import: 206,
		as: 208,
		global: 212,
		nonlocal: 214,
		assert: 218,
		type: 223,
		elif: 236,
		while: 240,
		try: 246,
		except: 248,
		finally: 250,
		with: 254,
		def: 258,
		class: 268,
		match: 279,
		case: 285
	}, zT = fS.deserialize({
		version: 14,
		states: "##jQ`QeOOP$}OSOOO&WQtO'#HUOOQS'#Co'#CoOOQS'#Cp'#CpO'vQdO'#CnO*UQtO'#HTOOQS'#HU'#HUOOQS'#DU'#DUOOQS'#HT'#HTO*rQdO'#D_O+VQdO'#DfO+gQdO'#DjO+zOWO'#DuO,VOWO'#DvO.[QtO'#GuOOQS'#Gu'#GuO'vQdO'#GtO0ZQtO'#GtOOQS'#Eb'#EbO0rQdO'#EcOOQS'#Gs'#GsO0|QdO'#GrOOQV'#Gr'#GrO1XQdO'#FYOOQS'#G^'#G^O1^QdO'#FXOOQV'#IS'#ISOOQV'#Gq'#GqOOQV'#Fq'#FqQ`QeOOO'vQdO'#CqO1lQdO'#C}O1sQdO'#DRO2RQdO'#HYO2cQtO'#EVO'vQdO'#EWOOQS'#EY'#EYOOQS'#E['#E[OOQS'#E^'#E^O2wQdO'#E`O3_QdO'#EdO3rQdO'#EfO3zQtO'#EfO1XQdO'#EiO0rQdO'#ElO1XQdO'#EnO0rQdO'#EtO0rQdO'#EwO4VQdO'#EyO4^QdO'#FOO4iQdO'#EzO0rQdO'#FOO1XQdO'#FQO1XQdO'#FVO4nQdO'#F[P4uOdO'#GpPOOO)CBd)CBdOOQS'#Ce'#CeOOQS'#Cf'#CfOOQS'#Cg'#CgOOQS'#Ch'#ChOOQS'#Ci'#CiOOQS'#Cj'#CjOOQS'#Cl'#ClO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO5TQdO'#DoOOQS,5:Y,5:YO5hQdO'#HdOOQS,5:],5:]O5uQ!fO,5:]O5zQtO,59YO1lQdO,59bO1lQdO,59bO1lQdO,59bO8jQdO,59bO8oQdO,59bO8vQdO,59jO8}QdO'#HTO:TQdO'#HSOOQS'#HS'#HSOOQS'#D['#D[O:lQdO,59aO'vQdO,59aO:zQdO,59aOOQS,59y,59yO;PQdO,5:RO'vQdO,5:ROOQS,5:Q,5:QO;_QdO,5:QO;dQdO,5:XO'vQdO,5:XO'vQdO,5:VOOQS,5:U,5:UO;uQdO,5:UO;zQdO,5:WOOOW'#Fy'#FyO<POWO,5:aOOQS,5:a,5:aO<[QdO'#HwOOOW'#Dw'#DwOOOW'#Fz'#FzO<lOWO,5:bOOQS,5:b,5:bOOQS'#F}'#F}O<zQtO,5:iO?lQtO,5=`O@VQ#xO,5=`O@vQtO,5=`OOQS,5:},5:}OA_QeO'#GWOBqQdO,5;^OOQV,5=^,5=^OB|QtO'#IPOCkQdO,5;tOOQS-E:[-E:[OOQV,5;s,5;sO4dQdO'#FQOOQV-E9o-E9oOCsQtO,59]OEzQtO,59iOFeQdO'#HVOFpQdO'#HVO1XQdO'#HVOF{QdO'#DTOGTQdO,59mOGYQdO'#HZO'vQdO'#HZO0rQdO,5=tOOQS,5=t,5=tO0rQdO'#EROOQS'#ES'#ESOGwQdO'#GPOHXQdO,58|OHXQdO,58|O*xQdO,5:oOHgQtO'#H]OOQS,5:r,5:rOOQS,5:z,5:zOHzQdO,5;OOI]QdO'#IOO1XQdO'#H}OOQS,5;Q,5;QOOQS'#GT'#GTOIqQtO,5;QOJPQdO,5;QOJUQdO'#IQOOQS,5;T,5;TOJdQdO'#H|OOQS,5;W,5;WOJuQdO,5;YO4iQdO,5;`O4iQdO,5;cOJ}QtO'#ITO'vQdO'#ITOKXQdO,5;eO4VQdO,5;eO0rQdO,5;jO1XQdO,5;lOK^QeO'#EuOLjQgO,5;fO!!kQdO'#IUO4iQdO,5;jO!!vQdO,5;lO!#OQdO,5;qO!#ZQtO,5;vO'vQdO,5;vPOOO,5=[,5=[P!#bOSO,5=[P!#jOdO,5=[O!&bQtO1G.jO!&iQtO1G.jO!)YQtO1G.jO!)dQtO1G.jO!+}QtO1G.jO!,bQtO1G.jO!,uQdO'#HcO!-TQtO'#GuO0rQdO'#HcO!-_QdO'#HbOOQS,5:Z,5:ZO!-gQdO,5:ZO!-lQdO'#HeO!-wQdO'#HeO!.[QdO,5>OOOQS'#Ds'#DsOOQS1G/w1G/wOOQS1G.|1G.|O!/[QtO1G.|O!/cQtO1G.|O1lQdO1G.|O!0OQdO1G/UOOQS'#DZ'#DZO0rQdO,59tOOQS1G.{1G.{O!0VQdO1G/eO!0gQdO1G/eO!0oQdO1G/fO'vQdO'#H[O!0tQdO'#H[O!0yQtO1G.{O!1ZQdO,59iO!2aQdO,5=zO!2qQdO,5=zO!2yQdO1G/mO!3OQtO1G/mOOQS1G/l1G/lO!3`QdO,5=uO!4VQdO,5=uO0rQdO1G/qO!4tQdO1G/sO!4yQtO1G/sO!5ZQtO1G/qOOQS1G/p1G/pOOQS1G/r1G/rOOOW-E9w-E9wOOQS1G/{1G/{O!5kQdO'#HxO0rQdO'#HxO!5|QdO,5>cOOOW-E9x-E9xOOQS1G/|1G/|OOQS-E9{-E9{O!6[Q#xO1G2zO!6{QtO1G2zO'vQdO,5<jOOQS,5<j,5<jOOQS-E9|-E9|OOQS,5<r,5<rOOQS-E:U-E:UOOQV1G0x1G0xO1XQdO'#GRO!7dQtO,5>kOOQS1G1`1G1`O!8RQdO1G1`OOQS'#DV'#DVO0rQdO,5=qOOQS,5=q,5=qO!8WQdO'#FrO!8cQdO,59oO!8kQdO1G/XO!8uQtO,5=uOOQS1G3`1G3`OOQS,5:m,5:mO!9fQdO'#GtOOQS,5<k,5<kOOQS-E9}-E9}O!9wQdO1G.hOOQS1G0Z1G0ZO!:VQdO,5=wO!:gQdO,5=wO0rQdO1G0jO0rQdO1G0jO!:xQdO,5>jO!;ZQdO,5>jO1XQdO,5>jO!;lQdO,5>iOOQS-E:R-E:RO!;qQdO1G0lO!;|QdO1G0lO!<RQdO,5>lO!<aQdO,5>lO!<oQdO,5>hO!=VQdO,5>hO!=hQdO'#EpO0rQdO1G0tO!=sQdO1G0tO!=xQgO1G0zO!AvQgO1G0}O!EqQdO,5>oO!E{QdO,5>oO!FTQtO,5>oO0rQdO1G1PO!F_QdO1G1PO4iQdO1G1UO!!vQdO1G1WOOQV,5;a,5;aO!FdQfO,5;aO!FiQgO1G1QO!JjQdO'#GZO4iQdO1G1QO4iQdO1G1QO!JzQdO,5>pO!KXQdO,5>pO1XQdO,5>pOOQV1G1U1G1UO!KaQdO'#FSO!KrQ!fO1G1WO!KzQdO1G1WOOQV1G1]1G1]O4iQdO1G1]O!LPQdO1G1]O!LXQdO'#F^OOQV1G1b1G1bO!#ZQtO1G1bPOOO1G2v1G2vP!L^OSO1G2vOOQS,5=},5=}OOQS'#Dp'#DpO0rQdO,5=}O!LfQdO,5=|O!LyQdO,5=|OOQS1G/u1G/uO!MRQdO,5>PO!McQdO,5>PO!MkQdO,5>PO!NOQdO,5>PO!N`QdO,5>POOQS1G3j1G3jOOQS7+$h7+$hO!8kQdO7+$pO#!RQdO1G.|O#!YQdO1G.|OOQS1G/`1G/`OOQS,5<`,5<`O'vQdO,5<`OOQS7+%P7+%PO#!aQdO7+%POOQS-E9r-E9rOOQS7+%Q7+%QO#!qQdO,5=vO'vQdO,5=vOOQS7+$g7+$gO#!vQdO7+%PO##OQdO7+%QO##TQdO1G3fOOQS7+%X7+%XO##eQdO1G3fO##mQdO7+%XOOQS,5<_,5<_O'vQdO,5<_O##rQdO1G3aOOQS-E9q-E9qO#$iQdO7+%]OOQS7+%_7+%_O#$wQdO1G3aO#%fQdO7+%_O#%kQdO1G3gO#%{QdO1G3gO#&TQdO7+%]O#&YQdO,5>dO#&sQdO,5>dO#&sQdO,5>dOOQS'#Dx'#DxO#'UO&jO'#DzO#'aO`O'#HyOOOW1G3}1G3}O#'fQdO1G3}O#'nQdO1G3}O#'yQ#xO7+(fO#(jQtO1G2UP#)TQdO'#GOOOQS,5<m,5<mOOQS-E:P-E:POOQS7+&z7+&zOOQS1G3]1G3]OOQS,5<^,5<^OOQS-E9p-E9pOOQS7+$s7+$sO#)bQdO,5=`O#){QdO,5=`O#*^QtO,5<aO#*qQdO1G3cOOQS-E9s-E9sOOQS7+&U7+&UO#+RQdO7+&UO#+aQdO,5<nO#+uQdO1G4UOOQS-E:Q-E:QO#,WQdO1G4UOOQS1G4T1G4TOOQS7+&W7+&WO#,iQdO7+&WOOQS,5<p,5<pO#,tQdO1G4WOOQS-E:S-E:SOOQS,5<l,5<lO#-SQdO1G4SOOQS-E:O-E:OO1XQdO'#EqO#-jQdO'#EqO#-uQdO'#IRO#-}QdO,5;[OOQS7+&`7+&`O0rQdO7+&`O#.SQgO7+&fO!JmQdO'#GXO4iQdO7+&fO4iQdO7+&iO#2QQtO,5<tO'vQdO,5<tO#2[QdO1G4ZOOQS-E:W-E:WO#2fQdO1G4ZO4iQdO7+&kO0rQdO7+&kOOQV7+&p7+&pO!KrQ!fO7+&rO!KzQdO7+&rO`QeO1G0{OOQV-E:X-E:XO4iQdO7+&lO4iQdO7+&lOOQV,5<u,5<uO#2nQdO,5<uO!JmQdO,5<uOOQV7+&l7+&lO#2yQgO7+&lO#6tQdO,5<vO#7PQdO1G4[OOQS-E:Y-E:YO#7^QdO1G4[O#7fQdO'#IWO#7tQdO'#IWO1XQdO'#IWOOQS'#IW'#IWO#8PQdO'#IVOOQS,5;n,5;nO#8XQdO,5;nO0rQdO'#FUOOQV7+&r7+&rO4iQdO7+&rOOQV7+&w7+&wO4iQdO7+&wO#8^QfO,5;xOOQV7+&|7+&|POOO7+(b7+(bO#8cQdO1G3iOOQS,5<c,5<cO#8qQdO1G3hOOQS-E9u-E9uO#9UQdO,5<dO#9aQdO,5<dO#9tQdO1G3kOOQS-E9v-E9vO#:UQdO1G3kO#:^QdO1G3kO#:nQdO1G3kO#:UQdO1G3kOOQS<<H[<<H[O#:yQtO1G1zOOQS<<Hk<<HkP#;WQdO'#FtO8vQdO1G3bO#;eQdO1G3bO#;jQdO<<HkOOQS<<Hl<<HlO#;zQdO7+)QOOQS<<Hs<<HsO#<[QtO1G1yP#<{QdO'#FsO#=YQdO7+)RO#=jQdO7+)RO#=rQdO<<HwO#=wQdO7+({OOQS<<Hy<<HyO#>nQdO,5<bO'vQdO,5<bOOQS-E9t-E9tOOQS<<Hw<<HwOOQS,5<g,5<gO0rQdO,5<gO#>sQdO1G4OOOQS-E9y-E9yO#?^QdO1G4OO<[QdO'#H{OOOO'#D{'#D{OOOO'#F|'#F|O#?oO&jO,5:fOOOW,5>e,5>eOOOW7+)i7+)iO#?zQdO7+)iO#@SQdO1G2zO#@mQdO1G2zP'vQdO'#FuO0rQdO<<IpO1XQdO1G2YP1XQdO'#GSO#AOQdO7+)pO#AaQdO7+)pOOQS<<Ir<<IrP1XQdO'#GUP0rQdO'#GQOOQS,5;],5;]O#ArQdO,5>mO#BQQdO,5>mOOQS1G0v1G0vOOQS<<Iz<<IzOOQV-E:V-E:VO4iQdO<<JQOOQV,5<s,5<sO4iQdO,5<sOOQV<<JQ<<JQOOQV<<JT<<JTO#BYQtO1G2`P#BdQdO'#GYO#BkQdO7+)uO#BuQgO<<JVO4iQdO<<JVOOQV<<J^<<J^O4iQdO<<J^O!KrQ!fO<<J^O#FpQgO7+&gOOQV<<JW<<JWO#FzQgO<<JWOOQV1G2a1G2aO1XQdO1G2aO#JuQdO1G2aO4iQdO<<JWO1XQdO1G2bP0rQdO'#G[O#KQQdO7+)vO#K_QdO7+)vOOQS'#FT'#FTO0rQdO,5>rO#KgQdO,5>rO#KrQdO,5>rO#K}QdO,5>qO#L`QdO,5>qOOQS1G1Y1G1YOOQS,5;p,5;pOOQV<<Jc<<JcO#LhQdO1G1dOOQS7+)T7+)TP#LmQdO'#FwO#L}QdO1G2OO#MbQdO1G2OO#MrQdO1G2OP#M}QdO'#FxO#N[QdO7+)VO#NlQdO7+)VO#NlQdO7+)VO#NtQdO7+)VO$ UQdO7+(|O8vQdO7+(|OOQSAN>VAN>VO$ oQdO<<LmOOQSAN>cAN>cO0rQdO1G1|O$!PQtO1G1|P$!ZQdO'#FvOOQS1G2R1G2RP$!hQdO'#F{O$!uQdO7+)jO$#`QdO,5>gOOOO-E9z-E9zOOOW<<MT<<MTO$#nQdO7+(fOOQSAN?[AN?[OOQS7+'t7+'tO$$XQdO<<M[OOQS,5<q,5<qO$$jQdO1G4XOOQS-E:T-E:TOOQVAN?lAN?lOOQV1G2_1G2_O4iQdOAN?qO$$xQgOAN?qOOQVAN?xAN?xO4iQdOAN?xOOQV<<JR<<JRO4iQdOAN?rO4iQdO7+'{OOQV7+'{7+'{O1XQdO7+'{OOQVAN?rAN?rOOQS7+'|7+'|O$(sQdO<<MbOOQS1G4^1G4^O0rQdO1G4^OOQS,5<w,5<wO$)QQdO1G4]OOQS-E:Z-E:ZOOQU'#G_'#G_O$)cQfO7+'OO$)nQdO'#F_O$*uQdO7+'jO$+VQdO7+'jOOQS7+'j7+'jO$+bQdO<<LqO$+rQdO<<LqO$+rQdO<<LqO$+zQdO'#H^OOQS<<Lh<<LhO$,UQdO<<LhOOQS7+'h7+'hOOQS'#D|'#D|OOOO1G4R1G4RO$,oQdO1G4RO$,wQdO1G4RP!=hQdO'#GVOOQVG25]G25]O4iQdOG25]OOQVG25dG25dOOQVG25^G25^OOQV<<Kg<<KgO4iQdO<<KgOOQS7+)x7+)xP$-SQdO'#G]OOQU-E:]-E:]OOQV<<Jj<<JjO$-vQtO'#FaOOQS'#Fc'#FcO$.WQdO'#FbO$.xQdO'#FbOOQS'#Fb'#FbO$.}QdO'#IYO$)nQdO'#FiO$)nQdO'#FiO$/fQdO'#FjO$)nQdO'#FkO$/mQdO'#IZOOQS'#IZ'#IZO$0[QdO,5;yOOQS<<KU<<KUO$0dQdO<<KUO$0tQdOANB]O$1UQdOANB]O$1^QdO'#H_OOQS'#H_'#H_O1sQdO'#DcO$1wQdO,5=xOOQSANBSANBSOOOO7+)m7+)mO$2`QdO7+)mOOQVLD*wLD*wOOQVANARANARO5uQ!fO'#GaO$2hQtO,5<SO$)nQdO'#FmOOQS,5<W,5<WOOQS'#Fd'#FdO$3YQdO,5;|O$3_QdO,5;|OOQS'#Fg'#FgO$)nQdO'#G`O$4PQdO,5<QO$4kQdO,5>tO$4{QdO,5>tO1XQdO,5<PO$5^QdO,5<TO$5cQdO,5<TO$)nQdO'#I[O$5hQdO'#I[O$5mQdO,5<UOOQS,5<V,5<VO0rQdO'#FpOOQU1G1e1G1eO4iQdO1G1eOOQSAN@pAN@pO$5rQdOG27wO$6SQdO,59}OOQS1G3d1G3dOOOO<<MX<<MXOOQS,5<{,5<{OOQS-E:_-E:_O$6XQtO'#FaO$6`QdO'#I]O$6nQdO'#I]O$6vQdO,5<XOOQS1G1h1G1hO$6{QdO1G1hO$7QQdO,5<zOOQS-E:^-E:^O$7lQdO,5=OO$8TQdO1G4`OOQS-E:b-E:bOOQS1G1k1G1kOOQS1G1o1G1oO$8eQdO,5>vO$)nQdO,5>vOOQS1G1p1G1pOOQS,5<[,5<[OOQU7+'P7+'PO$+zQdO1G/iO$)nQdO,5<YO$8sQdO,5>wO$8zQdO,5>wOOQS1G1s1G1sOOQS7+'S7+'SP$)nQdO'#GdO$9SQdO1G4bO$9^QdO1G4bO$9fQdO1G4bOOQS7+%T7+%TO$9tQdO1G1tO$:SQtO'#FaO$:ZQdO,5<}OOQS,5<},5<}O$:iQdO1G4cOOQS-E:a-E:aO$)nQdO,5<|O$:pQdO,5<|O$:uQdO7+)|OOQS-E:`-E:`O$;PQdO7+)|O$)nQdO,5<ZP$)nQdO'#GcO$;XQdO1G2hO$)nQdO1G2hP$;gQdO'#GbO$;nQdO<<MhO$;xQdO1G1uO$<WQdO7+(SO8vQdO'#C}O8vQdO,59bO8vQdO,59bO8vQdO,59bO$<fQtO,5=`O8vQdO1G.|O0rQdO1G/XO0rQdO7+$pP$<yQdO'#GOO'vQdO'#GtO$=WQdO,59bO$=]QdO,59bO$=dQdO,59mO$=iQdO1G/UO1sQdO'#DRO8vQdO,59j",
		stateData: "$>S~O%cOS%^OSSOS%]PQ~OPdOVaOfoOhYOopOs!POvqO!PrO!Q{O!T!SO!U!RO!XZO!][O!h`O!r`O!s`O!t`O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#l!QO#o!TO#s!UO#u!VO#z!WO#}hO$P!XO%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~O%]!YO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%j![O%k!]O%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aO~Ok%xXl%xXm%xXn%xXo%xXp%xXs%xXz%xX{%xX!x%xX#g%xX%[%xX%_%xX%z%xXg%xX!T%xX!U%xX%{%xX!W%xX![%xX!Q%xX#[%xXt%xX!m%xX~P%SOfoOhYO!XZO!][O!h`O!r`O!s`O!t`O%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~Oz%wX{%wX#g%wX%[%wX%_%wX%z%wX~Ok!pOl!qOm!oOn!oOo!rOp!sOs!tO!x%wX~P)pOV!zOg!|Oo0cOv0qO!PrO~P'vOV#OOo0cOv0qO!W#PO~P'vOV#SOa#TOo0cOv0qO![#UO~P'vOQ#XO%`#XO%a#ZO~OQ#^OR#[O%`#^O%a#`O~OV%iX_%iXa%iXh%iXk%iXl%iXm%iXn%iXo%iXp%iXs%iXz%iX!X%iX!f%iX%j%iX%k%iX%l%iX%m%iX%n%iX%o%iX%p%iX%q%iX%r%iX%s%iXg%iX!T%iX!U%iX~O&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O{%iX!x%iX#g%iX%[%iX%_%iX%z%iX%{%iX!W%iX![%iX!Q%iX#[%iXt%iX!m%iX~P,eOz#dO{%hX!x%hX#g%hX%[%hX%_%hX%z%hX~Oo0cOv0qO~P'vO#g#gO%[#iO%_#iO~O%uWO~O!T#nO#u!VO#z!WO#}hO~OopO~P'vOV#sOa#tO%uWO{wP~OV#xOo0cOv0qO!Q#yO~P'vO{#{O!x$QO%z#|O#g!yX%[!yX%_!yX~OV#xOo0cOv0qO#g#SX%[#SX%_#SX~P'vOo0cOv0qO#g#WX%[#WX%_#WX~P'vOh$WO%uWO~O!f$YO!r$YO%uWO~OV$eO~P'vO!U$gO#s$hO#u$iO~O{$jO~OV$qO~P'vOS$sO%[$rO%_$rO%c$tO~OV$}Oa$}Og%POo0cOv0qO~P'vOo0cOv0qO{%SO~P'vO&Y%UO~Oa!bOh!iO!X!kO!f!mOVba_bakbalbambanbaobapbasbazba{ba!xba#gba%[ba%_ba%jba%kba%lba%mba%nba%oba%pba%qba%rba%sba%zbagba!Tba!Uba%{ba!Wba![ba!Qba#[batba!mba~On%ZO~Oo%ZO~P'vOo0cO~P'vOk0eOl0fOm0dOn0dOo0mOp0nOs0rOg%wX!T%wX!U%wX%{%wX!W%wX![%wX!Q%wX#[%wX!m%wX~P)pO%{%]Og%vXz%vX!T%vX!U%vX!W%vX{%vX~Og%_Oz%`O!T%dO!U%cO~Og%_O~Oz%gO!T%dO!U%cO!W&SX~O!W%kO~Oz%lO{%nO!T%dO!U%cO![%}X~O![%rO~O![%sO~OQ#XO%`#XO%a%uO~OV%wOo0cOv0qO!PrO~P'vOQ#^OR#[O%`#^O%a%zO~OV!qa_!qaa!qah!qak!qal!qam!qan!qao!qap!qas!qaz!qa{!qa!X!qa!f!qa!x!qa#g!qa%[!qa%_!qa%j!qa%k!qa%l!qa%m!qa%n!qa%o!qa%p!qa%q!qa%r!qa%s!qa%z!qag!qa!T!qa!U!qa%{!qa!W!qa![!qa!Q!qa#[!qat!qa!m!qa~P#yOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P%SOV&OOopOvqO{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P'vOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#g$zX%[$zX%_$zX~P'vO#g#gO%[&TO%_&TO~O!f&UOh&sX%[&sXz&sX#[&sX#g&sX%_&sX#Z&sXg&sX~Oh!iO%[&WO~Okealeameaneaoeapeaseazea{ea!xea#gea%[ea%_ea%zeagea!Tea!Uea%{ea!Wea![ea!Qea#[eatea!mea~P%SOsqazqa{qa#gqa%[qa%_qa%zqa~Ok!pOl!qOm!oOn!oOo!rOp!sO!xqa~PEcO%z&YOz%yX{%yX~O%uWOz%yX{%yX~Oz&]O{wX~O{&_O~Oz%lO#g%}X%[%}X%_%}Xg%}X{%}X![%}X!m%}X%z%}X~OV0lOo0cOv0qO!PrO~P'vO%z#|O#gUa%[Ua%_Ua~Oz&hO#g&PX%[&PX%_&PXn&PX~P%SOz&kO!Q&jO#g#Wa%[#Wa%_#Wa~Oz&lO#[&nO#g&rX%[&rX%_&rXg&rX~O!f$YO!r$YO#Z&qO%uWO~O#Z&qO~Oz&sO#g&tX%[&tX%_&tX~Oz&uO#g&pX%[&pX%_&pX{&pX~O!X&wO%z&xO~Oz&|On&wX~P%SOn'PO~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO%['UO~P'vOt'YO#p'WO#q'XOP#naV#naf#nah#nao#nas#nav#na!P#na!Q#na!T#na!U#na!X#na!]#na!h#na!r#na!s#na!t#na!{#na!}#na#P#na#R#na#T#na#X#na#Z#na#^#na#_#na#a#na#c#na#l#na#o#na#s#na#u#na#z#na#}#na$P#na%X#na%o#na%p#na%t#na%u#na&Z#na&[#na&]#na&^#na&_#na&`#na&a#na&b#na&c#na&d#na&e#na&f#na&g#na&h#na&i#na&j#na%Z#na%_#na~Oz'ZO#[']O{&xX~Oh'_O!X&wO~Oh!iO{$jO!X&wO~O{'eO~P%SO%['hO%_'hO~OS'iO%['hO%_'hO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%k!]O~P!#uO%kWi~P!#uOV!aO_!aOa!bOh!iO!X!kO!f!mO%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%m!_O%n!_O~P!&pO%mWi%nWi~P!&pOa!bOh!iO!X!kO!f!mOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%mWi%nWi%oWi%pWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~OV!aO_!aO%q!aO%r!aO%s!aO~P!)nOVWi_Wi%qWi%rWi%sWi~P!)nO!T%dO!U%cOg&VXz&VX~O%z'kO%{'kO~P,eOz'mOg&UX~Og'oO~Oz'pO{'rO!W&XX~Oo0cOv0qOz'pO{'sO!W&XX~P'vO!W'uO~Om!oOn!oOo!rOp!sOkjisjizji{ji!xji#gji%[ji%_ji%zji~Ol!qO~P!.aOlji~P!.aOk0eOl0fOm0dOn0dOo0mOp0nO~Ot'wO~P!/jOV'|Og'}Oo0cOv0qO~P'vOg'}Oz(OO~Og(QO~O!U(SO~Og(TOz(OO!T%dO!U%cO~P%SOk0eOl0fOm0dOn0dOo0mOp0nOgqa!Tqa!Uqa%{qa!Wqa![qa!Qqa#[qatqa!mqa~PEcOV'|Oo0cOv0qO!W&Sa~P'vOz(WO!W&Sa~O!W(XO~Oz(WO!T%dO!U%cO!W&Sa~P%SOV(]Oo0cOv0qO![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~P'vOz(^O![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~O![(aO~Oz(^O!T%dO!U%cO![%}a~P%SOz(dO!T%dO!U%cO![&Ta~P%SOz(gO{&lX![&lX!m&lX%z&lX~O{(kO![(mO!m(nO%z(jO~OV&OOopOvqO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~P'vOz(pO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~O!f&UOh&sa%[&saz&sa#[&sa#g&sa%_&sa#Z&sag&sa~O%[(uO~OV#sOa#tO%uWO~Oz&]O{wa~OopOvqO~P'vOz(^O#g%}a%[%}a%_%}ag%}a{%}a![%}a!m%}a%z%}a~P%SOz(zO#g%hX%[%hX%_%hX%z%hX~O%z#|O#gUi%[Ui%_Ui~O#g&Pa%[&Pa%_&Pan&Pa~P'vOz(}O#g&Pa%[&Pa%_&Pan&Pa~O%uWO#g&ra%[&ra%_&rag&ra~Oz)SO#g&ra%[&ra%_&rag&ra~Og)VO~OV)WOh$WO%uWO~O#Z)XO~O%uWO#g&ta%[&ta%_&ta~Oz)ZO#g&ta%[&ta%_&ta~Oo0cOv0qO#g&pa%[&pa%_&pa{&pa~P'vOz)^O#g&pa%[&pa%_&pa{&pa~OV)`Oa)`O%uWO~O%z)eO~Ot)hO#j)gOP#hiV#hif#hih#hio#his#hiv#hi!P#hi!Q#hi!T#hi!U#hi!X#hi!]#hi!h#hi!r#hi!s#hi!t#hi!{#hi!}#hi#P#hi#R#hi#T#hi#X#hi#Z#hi#^#hi#_#hi#a#hi#c#hi#l#hi#o#hi#s#hi#u#hi#z#hi#}#hi$P#hi%X#hi%o#hi%p#hi%t#hi%u#hi&Z#hi&[#hi&]#hi&^#hi&_#hi&`#hi&a#hi&b#hi&c#hi&d#hi&e#hi&f#hi&g#hi&h#hi&i#hi&j#hi%Z#hi%_#hi~Ot)iOP#kiV#kif#kih#kio#kis#kiv#ki!P#ki!Q#ki!T#ki!U#ki!X#ki!]#ki!h#ki!r#ki!s#ki!t#ki!{#ki!}#ki#P#ki#R#ki#T#ki#X#ki#Z#ki#^#ki#_#ki#a#ki#c#ki#l#ki#o#ki#s#ki#u#ki#z#ki#}#ki$P#ki%X#ki%o#ki%p#ki%t#ki%u#ki&Z#ki&[#ki&]#ki&^#ki&_#ki&`#ki&a#ki&b#ki&c#ki&d#ki&e#ki&f#ki&g#ki&h#ki&i#ki&j#ki%Z#ki%_#ki~OV)kOn&wa~P'vOz)lOn&wa~Oz)lOn&wa~P%SOn)pO~O%Y)tO~Ot)wO#p'WO#q)vOP#niV#nif#nih#nio#nis#niv#ni!P#ni!Q#ni!T#ni!U#ni!X#ni!]#ni!h#ni!r#ni!s#ni!t#ni!{#ni!}#ni#P#ni#R#ni#T#ni#X#ni#Z#ni#^#ni#_#ni#a#ni#c#ni#l#ni#o#ni#s#ni#u#ni#z#ni#}#ni$P#ni%X#ni%o#ni%p#ni%t#ni%u#ni&Z#ni&[#ni&]#ni&^#ni&_#ni&`#ni&a#ni&b#ni&c#ni&d#ni&e#ni&f#ni&g#ni&h#ni&i#ni&j#ni%Z#ni%_#ni~OV)zOo0cOv0qO{$jO~P'vOo0cOv0qO{&xa~P'vOz*OO{&xa~OV*SOa*TOg*WO%q*UO%uWO~O{$jO&{*YO~Oh'_O~Oh!iO{$jO~O%[*_O~O%[*aO%_*aO~OV$}Oa$}Oo0cOv0qOg&Ua~P'vOz*dOg&Ua~Oo0cOv0qO{*gO!W&Xa~P'vOz*hO!W&Xa~Oo0cOv0qOz*hO{*kO!W&Xa~P'vOo0cOv0qOz*hO!W&Xa~P'vOz*hO{*kO!W&Xa~Om0dOn0dOo0mOp0nOgjikjisjizji!Tji!Uji%{ji!Wji{ji![ji#gji%[ji%_ji!Qji#[jitji!mji%zji~Ol0fO~P!NkOlji~P!NkOV'|Og*pOo0cOv0qO~P'vOn*rO~Og*pOz*tO~Og*uO~OV'|Oo0cOv0qO!W&Si~P'vOz*vO!W&Si~O!W*wO~OV(]Oo0cOv0qO![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~P'vOz*zO!T%dO!U%cO![&Ti~Oz*}O![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~O![+OO~Oa+QOo0cOv0qO![&Ti~P'vOz*zO![&Ti~O![+SO~OV+UOo0cOv0qO{&la![&la!m&la%z&la~P'vOz+VO{&la![&la!m&la%z&la~O!]+YO&n+[O![!nX~O![+^O~O{(kO![+_O~O{(kO![+_O!m+`O~OV&OOopOvqO{%hq!x%hq#g%hq%[%hq%_%hq%z%hq~P'vOz$ri{$ri!x$ri#g$ri%[$ri%_$ri%z$ri~P%SOV&OOopOvqO~P'vOV&OOo0cOv0qO#g%ha%[%ha%_%ha%z%ha~P'vOz+aO#g%ha%[%ha%_%ha%z%ha~Oz$ia#g$ia%[$ia%_$ian$ia~P%SO#g&Pi%[&Pi%_&Pin&Pi~P'vOz+dO#g#Wq%[#Wq%_#Wq~O#[+eOz$va#g$va%[$va%_$vag$va~O%uWO#g&ri%[&ri%_&rig&ri~Oz+gO#g&ri%[&ri%_&rig&ri~OV+iOh$WO%uWO~O%uWO#g&ti%[&ti%_&ti~Oo0cOv0qO#g&pi%[&pi%_&pi{&pi~P'vO{#{Oz#eX!W#eX~Oz+mO!W&uX~O!W+oO~Ot+rO#j)gOP#hqV#hqf#hqh#hqo#hqs#hqv#hq!P#hq!Q#hq!T#hq!U#hq!X#hq!]#hq!h#hq!r#hq!s#hq!t#hq!{#hq!}#hq#P#hq#R#hq#T#hq#X#hq#Z#hq#^#hq#_#hq#a#hq#c#hq#l#hq#o#hq#s#hq#u#hq#z#hq#}#hq$P#hq%X#hq%o#hq%p#hq%t#hq%u#hq&Z#hq&[#hq&]#hq&^#hq&_#hq&`#hq&a#hq&b#hq&c#hq&d#hq&e#hq&f#hq&g#hq&h#hq&i#hq&j#hq%Z#hq%_#hq~On$|az$|a~P%SOV)kOn&wi~P'vOz+yOn&wi~Oz,TO{$jO#[,TO~O#q,VOP#nqV#nqf#nqh#nqo#nqs#nqv#nq!P#nq!Q#nq!T#nq!U#nq!X#nq!]#nq!h#nq!r#nq!s#nq!t#nq!{#nq!}#nq#P#nq#R#nq#T#nq#X#nq#Z#nq#^#nq#_#nq#a#nq#c#nq#l#nq#o#nq#s#nq#u#nq#z#nq#}#nq$P#nq%X#nq%o#nq%p#nq%t#nq%u#nq&Z#nq&[#nq&]#nq&^#nq&_#nq&`#nq&a#nq&b#nq&c#nq&d#nq&e#nq&f#nq&g#nq&h#nq&i#nq&j#nq%Z#nq%_#nq~O#[,WOz%Oa{%Oa~Oo0cOv0qO{&xi~P'vOz,YO{&xi~O{#{O%z,[Og&zXz&zX~O%uWOg&zXz&zX~Oz,`Og&yX~Og,bO~O%Y,eO~O!T%dO!U%cOg&Viz&Vi~OV$}Oa$}Oo0cOv0qOg&Ui~P'vO{,hOz$la!W$la~Oo0cOv0qO{,iOz$la!W$la~P'vOo0cOv0qO{*gO!W&Xi~P'vOz,lO!W&Xi~Oo0cOv0qOz,lO!W&Xi~P'vOz,lO{,oO!W&Xi~Og$hiz$hi!W$hi~P%SOV'|Oo0cOv0qO~P'vOn,qO~OV'|Og,rOo0cOv0qO~P'vOV'|Oo0cOv0qO!W&Sq~P'vOz$gi![$gi#g$gi%[$gi%_$gig$gi{$gi!m$gi%z$gi~P%SOV(]Oo0cOv0qO~P'vOa+QOo0cOv0qO![&Tq~P'vOz,sO![&Tq~O![,tO~OV(]Oo0cOv0qO![%}q#g%}q%[%}q%_%}qg%}q{%}q!m%}q%z%}q~P'vO{,uO~OV+UOo0cOv0qO{&li![&li!m&li%z&li~P'vOz,zO{&li![&li!m&li%z&li~O!]+YO&n+[O![!na~O{(kO![,}O~OV&OOo0cOv0qO#g%hi%[%hi%_%hi%z%hi~P'vOz-OO#g%hi%[%hi%_%hi%z%hi~O%uWO#g&rq%[&rq%_&rqg&rq~Oz-RO#g&rq%[&rq%_&rqg&rq~OV)`Oa)`O%uWO!W&ua~Oz-TO!W&ua~On$|iz$|i~P%SOV)kO~P'vOV)kOn&wq~P'vOt-XOP#myV#myf#myh#myo#mys#myv#my!P#my!Q#my!T#my!U#my!X#my!]#my!h#my!r#my!s#my!t#my!{#my!}#my#P#my#R#my#T#my#X#my#Z#my#^#my#_#my#a#my#c#my#l#my#o#my#s#my#u#my#z#my#}#my$P#my%X#my%o#my%p#my%t#my%u#my&Z#my&[#my&]#my&^#my&_#my&`#my&a#my&b#my&c#my&d#my&e#my&f#my&g#my&h#my&i#my&j#my%Z#my%_#my~O%Z-]O%_-]O~P`O#q-^OP#nyV#nyf#nyh#nyo#nys#nyv#ny!P#ny!Q#ny!T#ny!U#ny!X#ny!]#ny!h#ny!r#ny!s#ny!t#ny!{#ny!}#ny#P#ny#R#ny#T#ny#X#ny#Z#ny#^#ny#_#ny#a#ny#c#ny#l#ny#o#ny#s#ny#u#ny#z#ny#}#ny$P#ny%X#ny%o#ny%p#ny%t#ny%u#ny&Z#ny&[#ny&]#ny&^#ny&_#ny&`#ny&a#ny&b#ny&c#ny&d#ny&e#ny&f#ny&g#ny&h#ny&i#ny&j#ny%Z#ny%_#ny~Oz-aO{$jO#[-aO~Oo0cOv0qO{&xq~P'vOz-dO{&xq~O%z,[Og&zaz&za~O{#{Og&zaz&za~OV*SOa*TO%q*UO%uWOg&ya~Oz-hOg&ya~O$S-lO~OV$}Oa$}Oo0cOv0qO~P'vOo0cOv0qO{-mOz$li!W$li~P'vOo0cOv0qOz$li!W$li~P'vO{-mOz$li!W$li~Oo0cOv0qO{*gO~P'vOo0cOv0qO{*gO!W&Xq~P'vOz-pO!W&Xq~Oo0cOv0qOz-pO!W&Xq~P'vOs-sO!T%dO!U%cOg&Oq!W&Oq![&Oqz&Oq~P!/jOa+QOo0cOv0qO![&Ty~P'vOz$ji![$ji~P%SOa+QOo0cOv0qO~P'vOV+UOo0cOv0qO~P'vOV+UOo0cOv0qO{&lq![&lq!m&lq%z&lq~P'vO{(kO![-xO!m-yO%z-wO~OV&OOo0cOv0qO#g%hq%[%hq%_%hq%z%hq~P'vO%uWO#g&ry%[&ry%_&ryg&ry~OV)`Oa)`O%uWO!W&ui~Ot-}OP#m!RV#m!Rf#m!Rh#m!Ro#m!Rs#m!Rv#m!R!P#m!R!Q#m!R!T#m!R!U#m!R!X#m!R!]#m!R!h#m!R!r#m!R!s#m!R!t#m!R!{#m!R!}#m!R#P#m!R#R#m!R#T#m!R#X#m!R#Z#m!R#^#m!R#_#m!R#a#m!R#c#m!R#l#m!R#o#m!R#s#m!R#u#m!R#z#m!R#}#m!R$P#m!R%X#m!R%o#m!R%p#m!R%t#m!R%u#m!R&Z#m!R&[#m!R&]#m!R&^#m!R&_#m!R&`#m!R&a#m!R&b#m!R&c#m!R&d#m!R&e#m!R&f#m!R&g#m!R&h#m!R&i#m!R&j#m!R%Z#m!R%_#m!R~Oo0cOv0qO{&xy~P'vOV*SOa*TO%q*UO%uWOg&yi~O$S-lO%Z.VO%_.VO~OV.aOh._O!X.^O!].`O!h.YO!s.[O!t.[O%p.XO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O~Oo0cOv0qOz$lq!W$lq~P'vO{.fOz$lq!W$lq~Oo0cOv0qO{*gO!W&Xy~P'vOz.gO!W&Xy~Oo0cOv.kO~P'vOs-sO!T%dO!U%cOg&Oy!W&Oy![&Oyz&Oy~P!/jO{(kO![.nO~O{(kO![.nO!m.oO~OV*SOa*TO%q*UO%uWO~Oh.tO!f.rOz$TX#[$TX%j$TXg$TX~Os$TX{$TX!W$TX![$TX~P$-bO%o.vO%p.vOs$UXz$UX{$UX#[$UX%j$UX!W$UXg$UX![$UX~O!h.xO~Oz.|O#[/OO%j.yOs&|X{&|X!W&|Xg&|X~Oa/RO~P$)zOh.tOs&}Xz&}X{&}X#[&}X%j&}X!W&}Xg&}X![&}X~Os/VO{$jO~Oo0cOv0qOz$ly!W$ly~P'vOo0cOv0qO{*gO!W&X!R~P'vOz/ZO!W&X!R~Og&RXs&RX!T&RX!U&RX!W&RX![&RXz&RX~P!/jOs-sO!T%dO!U%cOg&Qa!W&Qa![&Qaz&Qa~O{(kO![/^O~O!f.rOh$[as$[az$[a{$[a#[$[a%j$[a!W$[ag$[a![$[a~O!h/eO~O%o.vO%p.vOs$Uaz$Ua{$Ua#[$Ua%j$Ua!W$Uag$Ua![$Ua~O%j.yOs$Yaz$Ya{$Ya#[$Ya!W$Yag$Ya![$Ya~Os&|a{&|a!W&|ag&|a~P$)nOz/jOs&|a{&|a!W&|ag&|a~O!W/mO~Og/mO~O{/oO~O![/pO~Oo0cOv0qO{*gO!W&X!Z~P'vO{/sO~O%z/tO~P$-bOz/uO#[/OO%j.yOg'PX~Oz/uOg'PX~Og/wO~O!h/xO~O#[/OOs%Saz%Sa{%Sa%j%Sa!W%Sag%Sa![%Sa~O#[/OO%j.yOs%Waz%Wa{%Wa!W%Wag%Wa~Os&|i{&|i!W&|ig&|i~P$)nOz/zO#[/OO%j.yO!['Oa~Og'Pa~P$)nOz0SOg'Pa~Oa0UO!['Oi~P$)zOz0WO!['Oi~Oz0WO#[/OO%j.yO!['Oi~O#[/OO%j.yOg$biz$bi~O%z0ZO~P$-bO#[/OO%j.yOg%Vaz%Va~Og'Pi~P$)nO{0^O~Oa0UO!['Oq~P$)zOz0`O!['Oq~O#[/OO%j.yOz%Ui![%Ui~Oa0UO~P$)zOa0UO!['Oy~P$)zO#[/OO%j.yOg$ciz$ci~O#[/OO%j.yOz%Uq![%Uq~Oz+aO#g%ha%[%ha%_%ha%z%ha~P%SOV&OOo0cOv0qO~P'vOn0hO~Oo0hO~P'vO{0iO~Ot0jO~P!/jO&]&Z&j&h&i&g&f&d&e&c&b&`&a&_&^&[%u~",
		goto: "!=j'QPPPPPP'RP'Z*s+[+t,_,y-fP.SP'Z.r.r'ZPPP'Z2[PPPPPP2[5PPP5PP7b7k=sPP=v>h>kPP'Z'ZPP>zPP'Z'ZPP'Z'Z'Z'Z'Z?O?w'ZP?zP@QDXGuGyPG|HWH['ZPPPH_Hk'RP'R'RP'RP'RP'RP'RP'R'R'RP'RPP'RPP'RP'RPHqH}IVPI^IdPI^PI^I^PPPI^PKrPK{LVL]KrPI^LfPI^PLmLsPLwM]MzNeLwLwNkNxLwLwLwLw! ^! d! g! l! o! y!!P!!]!!o!!u!#P!#V!#s!#y!$P!$Z!$a!$g!$y!%T!%Z!%a!%k!%q!%w!%}!&T!&Z!&e!&k!&u!&{!'U!'[!'k!'s!'}!(UPPPPPPPPPPP!([!(_!(e!(n!(x!)TPPPPPPPPPPPP!-u!/Z!3^!6oPP!6w!7W!7a!8Y!8P!8c!8i!8l!8o!8r!8z!9jPPPPPPPPPPPPPPPPP!9m!9q!9wP!:]!:a!:m!:v!;S!;j!;m!;p!;v!;|!<S!<VP!<_!<h!=d!=g]eOn#g$j)t,P'}`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r{!cQ#c#p$R$d$p%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g}!dQ#c#p$R$d$p$u%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!P!eQ#c#p$R$d$p$u$v%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!R!fQ#c#p$R$d$p$u$v$w%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!T!gQ#c#p$R$d$p$u$v$w$x%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!V!hQ#c#p$R$d$p$u$v$w$x$y%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!Z!hQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g'}TOTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r&eVOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0r%oXOYZ[dnrxy}!P!Q!U!i!k#[#d#g#y#{#}$Q$h$j$}%S%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#vqQ/[.kR0o0q't`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rh#jhz{$W$Z&l&q)S)X+f+g-RW#rq&].k0qQ$]|Q$a!OQ$n!VQ$o!WW$|!i'm*d,gS&[#s#tQ'S$iQ(s&UQ)U&nU)Y&s)Z+jW)a&w+m-T-{Q*Q']W*R'_,`-h.TQ+l)`S,_*S*TQ-Q+eQ-_,TQ-c,WQ.R-al.W-l.^._.a.z.|/R/j/o/t/y0U0Z0^Q/S.`Q/a.tQ/l/OU0P/u0S0[X0V/z0W0_0`R&Z#r!_!wYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZR%^!vQ!{YQ%x#[Q&d#}Q&g$QR,{+YT.j-s/s!Y!jQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gQ&X#kQ'c$oR*^'dR'l$|Q%V!mR/_.r'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rS#a_#b!P.[-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rT#a_#bT#^^#_R(o%xa(l%x(n(o+`,{-y-z.oT+[(k+]R-z,{Q$PsQ+l)aQ,^*RR-e,_X#}s$O$P&fQ&y$aQ'a$nQ'd$oR)s'SQ)b&wV-S+m-T-{ZgOn$j)t,PXkOn)t,PQ$k!TQ&z$bQ&{$cQ'^$mQ'b$oQ)q'RQ)x'WQ){'XQ)|'YQ*Z'`S*]'c'dQ+s)gQ+u)hQ+v)iQ+z)oS+|)r*[Q,Q)vQ,R)wS,S)y)zQ,d*^Q-V+rQ-W+tQ-Y+{S-Z+},OQ-`,UQ-b,VQ-|-XQ.O-[Q.P-^Q.Q-_Q.p-}Q.q.RQ/W.dR/r/XWkOn)t,PR#mjQ'`$nS)r'S'aR,O)sQ,]*RR-f,^Q*['`Q+})rR-[,OZiOjn)t,PQ'f$pR*`'gT-j,e-ku.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^t.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^Q/S.`X0V/z0W0_0`!P.Z-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`Q.w.YR/f.xg.z.].{/b/i/n/|0O0Q0]0a0bu.b-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^X.u.W.b/a0PR/c.tV0R/u0S0[R/X.dQnOS#on,PR,P)tQ&^#uR(x&^S%m#R#wS(_%m(bT(b%p&`Q%a!yQ%h!}W(P%a%h(U(YQ(U%eR(Y%jQ&i$RR)O&iQ(e%qQ*{(`T+R(e*{Q'n%OR*e'nS'q%R%SY*i'q*j,m-q.hU*j'r's'tU,m*k*l*mS-q,n,oR.h-rQ#Y]R%t#YQ#_^R%y#_Q(h%vS+W(h+XR+X(iQ+](kR,|+]Q#b_R%{#bQ#ebQ%}#cW&Q#e%}({+bQ({&cR+b0gQ$OsS&e$O&fR&f$PQ&v$_R)_&vQ&V#jR(t&VQ&m$VS)T&m+hR+h)UQ$Z{R&p$ZQ&t$]R)[&tQ+n)bR-U+nQ#hfR&S#hQ)f&zR+q)fQ&}$dS)m&})nR)n'OQ'V$kR)u'VQ'[$lS*P'[,ZR,Z*QQ,a*VR-i,aWjOn)t,PR#ljQ-k,eR.U-kd.{.]/b/i/n/|0O0Q0]0a0bR/h.{U.s.W/a0PR/`.sQ/{/nS0X/{0YR0Y/|S/v/b/cR0T/vQ.}.]R/k.}R!ZPXmOn)t,PWlOn)t,PR'T$jYfOn$j)t,PR&R#g[sOn#g$j)t,PR&d#}&dQOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0rQ!nTQ#caQ#poU$Rt%c(SS$d!R$gQ$p!XQ$u!cQ$v!dQ$w!eQ$x!fQ$y!gQ$z!hQ%e!zQ%j#OQ%p#SQ%q#TQ&`#xQ'O$eQ'g$qQ(q&OU(|&h(}+cW)j&|)l+x+yQ*o'|Q*x(]Q+w)kQ,v+QR0g0lQ!yYQ!}ZQ$b!PQ$c!QQ%R!kQ't%S^'{%`%g(O(W*q*t*v^*f'p*h,k,l-p.g/ZQ*l'rQ*m'sQ+t)gQ,j*gQ,n*kQ-n,hQ-o,iQ-r,oQ.e-mR/Y.f[bOn#g$j)t,P!^!vYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZQ#R[Q#fdS#wrxQ$UyW$_}$Q'P)pS$l!U$hW${!i'm*d,gS%v#[+Y`&P#d%|(p(r(z+a-O0kQ&a#yQ&b#{Q&c#}Q'j$}Q'z%^W([%l(^*y*}Q(`%nQ(i%wQ(v&ZS(y&_0iQ)P&jQ)Q&kU)]&u)^+kQ)d&xQ)y'WY)}'Z*O,X,Y-dQ*b'lS*n'w0jW+P(d*z,s,wW+T(g+V,y,zQ+p)eQ,U)zQ,c*YQ,x+UQ-P+dQ-e,]Q-v,uQ.S-fR/q/VhUOn#d#g$j%|&_'w(p(r)t,P%U!uYZ[drxy}!P!Q!U!i!k#[#y#{#}$Q$h$}%S%^%`%g%l%n%w&Z&j&k&u&x'P'W'Z'l'm'p'r's(O(W(^(d(g(z)^)e)g)p)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#qpW%W!o!s0d0nQ%X!pQ%Y!qQ%[!tQ%f0cS'v%Z0hQ'x0eQ'y0fQ,p*rQ-u,qS.i-s/sR0p0rU#uq.k0qR(w&][cOn#g$j)t,PZ!xY#[#}$Q+YQ#W[Q#zrR$TxQ%b!yQ%i!}Q%o#RQ'j${Q(V%eQ(Z%jQ(c%pQ(f%qQ*|(`Q,f*bQ-t,pQ.m-uR/].lQ$StQ(R%cR*s(SQ.l-sR/}/sR#QZR#V[R%Q!iQ%O!iV*c'm*d,g!Z!lQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gR%T!kT#]^#_Q%x#[R,{+YQ(m%xS+_(n(oQ,}+`Q-x,{S.n-y-zR/^.oT+Z(k+]Q$`}Q&g$QQ)o'PR+{)pQ$XzQ)W&qR+i)XQ$XzQ&o$WQ)W&qR+i)XQ#khW$Vz$W&q)XQ$[{Q&r$ZZ)R&l)S+f+g-RR$^|R)c&wXlOn)t,PQ$f!RR'Q$gQ$m!UR'R$hR*X'_Q*V'_V-g,`-h.TQ.d-lQ/P.^R/Q._U.]-l.^._Q/U.aQ/b.tQ/g.zU/i.|/j/yQ/n/RQ/|/oQ0O/tU0Q/u0S0[Q0]0UQ0a0ZR0b0^R/T.`R/d.t",
		nodeNames: "⚠ print Escape { Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ) ( ParenthesizedExpression BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from TupleExpression ComprehensionExpression async for LambdaExpression ] [ ArrayExpression ArrayComprehensionExpression } { DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatSelfDoc FormatConversion FormatSpec FormatReplacement FormatSelfDoc ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert TypeDefinition type TypeParamList TypeParam StatementGroup ; IfStatement Body elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At MatchStatement match MatchBody MatchClause case CapturePattern LiteralPattern ArithOp ArithOp AsPattern OrPattern LogicOp AttributePattern SequencePattern MappingPattern StarPattern ClassPattern PatternArgList KeywordPattern KeywordPattern Guard",
		maxTerm: 277,
		context: PT,
		nodeProps: [
			[
				"isolate",
				-5,
				4,
				71,
				72,
				73,
				77,
				""
			],
			[
				"group",
				-15,
				6,
				85,
				87,
				88,
				90,
				92,
				94,
				96,
				98,
				99,
				100,
				102,
				105,
				108,
				110,
				"Statement Statement",
				-22,
				8,
				18,
				21,
				25,
				40,
				49,
				50,
				56,
				57,
				60,
				61,
				62,
				63,
				64,
				67,
				70,
				71,
				72,
				79,
				80,
				81,
				82,
				"Expression",
				-10,
				114,
				116,
				119,
				121,
				122,
				126,
				128,
				133,
				135,
				138,
				"Statement",
				-9,
				143,
				144,
				147,
				148,
				150,
				151,
				152,
				153,
				154,
				"Pattern"
			],
			[
				"openedBy",
				23,
				"(",
				54,
				"[",
				58,
				"{"
			],
			[
				"closedBy",
				24,
				")",
				55,
				"]",
				59,
				"}"
			]
		],
		propSources: [LT],
		skippedNodes: [0, 4],
		repeatNodeCount: 34,
		tokenData: "!2|~R!`OX%TXY%oY[%T[]%o]p%Tpq%oqr'ars)Yst*xtu%Tuv,dvw-hwx.Uxy/tyz0[z{0r{|2S|}2p}!O3W!O!P4_!P!Q:Z!Q!R;k!R![>_![!]Do!]!^Es!^!_FZ!_!`Gk!`!aHX!a!b%T!b!cIf!c!dJU!d!eK^!e!hJU!h!i!#f!i!tJU!t!u!,|!u!wJU!w!x!.t!x!}JU!}#O!0S#O#P&o#P#Q!0j#Q#R!1Q#R#SJU#S#T%T#T#UJU#U#VK^#V#YJU#Y#Z!#f#Z#fJU#f#g!,|#g#iJU#i#j!.t#j#oJU#o#p!1n#p#q!1s#q#r!2a#r#s!2f#s$g%T$g;'SJU;'S;=`KW<%lOJU`%YT&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T`%lP;=`<%l%To%v]&n`%c_OX%TXY%oY[%T[]%o]p%Tpq%oq#O%T#O#P&o#P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To&tX&n`OY%TYZ%oZ]%T]^%o^#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc'f[&n`O!_%T!_!`([!`#T%T#T#U(r#U#f%T#f#g(r#g#h(r#h#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(cTmR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(yT!mR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk)aV&n`&[ZOr%Trs)vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk){V&n`Or%Trs*bs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk*iT&n`&^ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To+PZS_&n`OY*xYZ%TZ]*x]^%T^#o*x#o#p+r#p#q*x#q#r+r#r;'S*x;'S;=`,^<%lO*x_+wTS_OY+rZ]+r^;'S+r;'S;=`,W<%lO+r_,ZP;=`<%l+ro,aP;=`<%l*xj,kV%rQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-XT!xY&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-oV%lQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.]V&n`&ZZOw%Twx.rx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.wV&n`Ow%Twx/^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/eT&n`&]ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/{ThZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc0cTgR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk0yXVZ&n`Oz%Tz{1f{!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk1mVaR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk2ZV%oZ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc2wTzR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To3_W%pZ&n`O!_%T!_!`-Q!`!a3w!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Td4OT&{S&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk4fX!fQ&n`O!O%T!O!P5R!P!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5WV&n`O!O%T!O!P5m!P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5tT!rZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti6[a!hX&n`O!Q%T!Q![6T![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S6T#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti7fZ&n`O{%T{|8X|}%T}!O8X!O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8^V&n`O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8z]!hX&n`O!Q%T!Q![8s![!l%T!l!m9s!m#R%T#R#S8s#S#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti9zT!hX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk:bX%qR&n`O!P%T!P!Q:}!Q!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj;UV%sQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti;ro!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!d%T!d!e?q!e!g%T!g!h7a!h!l%T!l!m9s!m!q%T!q!rA]!r!z%T!z!{Bq!{#R%T#R#S>_#S#U%T#U#V?q#V#X%T#X#Y7a#Y#^%T#^#_9s#_#c%T#c#dA]#d#l%T#l#mBq#m#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti=xV&n`O!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti>fc!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S>_#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti?vY&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti@mY!hX&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiAbX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBUX!hX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBv]&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiCv]!hX&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToDvV{_&n`O!_%T!_!`E]!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TcEdT%{R&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkEzT#gZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkFbXmR&n`O!^%T!^!_F}!_!`([!`!a([!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjGUV%mQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkGrV%zZ&n`O!_%T!_!`([!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkH`WmR&n`O!_%T!_!`([!`!aHx!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjIPV%nQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkIoV_Q#}P&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToJ_]&n`&YS%uZO!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoKZP;=`<%lJUoKge&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!tJU!t!uLx!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#gLx#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoMRa&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUkN_V&n`&`ZOr%TrsNts#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkNyV&n`Or%Trs! `s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! gT&n`&bZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! }V&n`&_ZOw%Twx!!dx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!!iV&n`Ow%Twx!#Ox#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!#VT&n`&aZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!#oe&n`&YS%uZOr%Trs!%Qsw%Twx!&px!Q%T!Q![JU![!c%T!c!tJU!t!u!(`!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#g!(`#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!%XV&n`&dZOr%Trs!%ns#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!%sV&n`Or%Trs!&Ys#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&aT&n`&fZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&wV&n`&cZOw%Twx!'^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!'cV&n`Ow%Twx!'xx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!(PT&n`&eZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!(ia&n`&YS%uZOr%Trs!)nsw%Twx!+^x!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!)uV&n`&hZOr%Trs!*[s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*aV&n`Or%Trs!*vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*}T&n`&jZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!+eV&n`&gZOw%Twx!+zx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,PV&n`Ow%Twx!,fx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,mT&n`&iZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!-Vi&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!dJU!d!eLx!e!hJU!h!i!(`!i!}JU!}#R%T#R#SJU#S#T%T#T#UJU#U#VLx#V#YJU#Y#Z!(`#Z#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUo!.}a&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!0ZT!XZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc!0qT!WR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj!1XV%kQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!1sO!]~k!1zV%jR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!2fO![~i!2mT%tX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T",
		tokenizers: [
			FT,
			TT,
			wT,
			IT,
			0,
			1,
			2,
			3,
			4
		],
		topRules: { Script: [0, 5] },
		specialized: [{
			term: 221,
			get: (e) => RT[e] || -1
		}],
		tokenPrec: 7668
	});
})), VT = /* @__PURE__ */ n({
	globalCompletion: () => tE,
	localCompletionSource: () => WT,
	python: () => qT,
	pythonLanguage: () => nE
});
function HT(e) {
	return (t, n, r) => {
		if (r) return !1;
		let i = t.node.getChild("VariableName");
		return i && n(i, e), !0;
	};
}
function UT(e, t) {
	let n = JT.get(t);
	if (n) return n;
	let r = [], i = !0;
	function a(t, n) {
		let i = e.sliceString(t.from, t.to);
		r.push({
			label: i,
			type: n
		});
	}
	return t.cursor(gv.IncludeAnonymous).iterate((t) => {
		if (t.name) {
			let e = XT[t.name];
			if (e && e(t, a, i) || !i && YT.has(t.name)) return !1;
			i = !1;
		} else if (t.to - t.from > 8192) {
			for (let n of UT(e, t.node)) r.push(n);
			return !1;
		}
	}), JT.set(t, r), r;
}
function WT(e) {
	let t = gy(e.state).resolveInner(e.pos, -1);
	if (QT.indexOf(t.name) > -1) return null;
	let n = t.name == "VariableName" || t.to - t.from < 20 && ZT.test(e.state.sliceDoc(t.from, t.to));
	if (!n && !e.explicit) return null;
	let r = [];
	for (let n = t; n; n = n.parent) YT.has(n.name) && (r = r.concat(UT(e.state.doc, n)));
	return {
		options: r,
		from: n ? t.from : e.pos,
		validFor: ZT
	};
}
function GT(e) {
	let { node: t, pos: n } = e, r = e.lineIndent(n, -1), i = null;
	for (;;) {
		let a = t.childBefore(n);
		if (!a) break;
		if (a.name == "Comment") n = a.from;
		else if (a.name == "Body" || a.name == "MatchBody") e.baseIndentFor(a) + e.unit <= r && (i = a), t = a;
		else if (a.name == "MatchClause") t = a;
		else if (a.type.is("Statement")) t = a;
		else break;
	}
	return i;
}
function KT(e, t) {
	let n = e.baseIndentFor(t), r = e.lineAt(e.pos, -1), i = r.from + r.text.length;
	return /^\s*($|#)/.test(r.text) && e.node.to < i + 100 && !/\S/.test(e.state.sliceDoc(i, e.node.to)) && e.lineIndent(e.pos, -1) <= n || /^\s*(else:|elif |except |finally:|case\s+[^=:]+:)/.test(e.textAfter) && e.lineIndent(e.pos, -1) > n ? null : n + e.unit;
}
function qT() {
	return new Lb(nE, [nE.data.of({ autocomplete: WT }), nE.data.of({ autocomplete: tE })]);
}
var JT, YT, XT, ZT, QT, $T, eE, tE, nE, rE = t((() => {
	BT(), Rx(), jv(), wC(), JT = /*@__PURE__*/ new Dv(), YT = /*@__PURE__*/ new Set([
		"Script",
		"Body",
		"FunctionDefinition",
		"ClassDefinition",
		"LambdaExpression",
		"ForStatement",
		"MatchClause"
	]), XT = {
		FunctionDefinition: /*@__PURE__*/ HT("function"),
		ClassDefinition: /*@__PURE__*/ HT("class"),
		ForStatement(e, t, n) {
			if (n) {
				for (let n = e.node.firstChild; n; n = n.nextSibling) if (n.name == "VariableName") t(n, "variable");
				else if (n.name == "in") break;
			}
		},
		ImportStatement(e, t) {
			let { node: n } = e, r = n.firstChild?.name == "from";
			for (let e = n.getChild("import"); e; e = e.nextSibling) e.name == "VariableName" && e.nextSibling?.name != "as" && t(e, r ? "variable" : "namespace");
		},
		AssignStatement(e, t) {
			for (let n = e.node.firstChild; n; n = n.nextSibling) if (n.name == "VariableName") t(n, "variable");
			else if (n.name == ":" || n.name == "AssignOp") break;
		},
		ParamList(e, t) {
			for (let n = null, r = e.node.firstChild; r; r = r.nextSibling) r.name != "VariableName" || n && /\*|AssignOp/.test(n.name) || t(r, "variable"), n = r;
		},
		CapturePattern: /*@__PURE__*/ HT("variable"),
		AsPattern: /*@__PURE__*/ HT("variable"),
		__proto__: null
	}, ZT = /^[\w\xa1-\uffff][\w\d\xa1-\uffff]*$/, QT = [
		"String",
		"FormatString",
		"Comment",
		"PropertyName"
	], $T = /*@__PURE__*/ [
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
	].map((e) => ({
		label: e,
		type: "constant"
	})).concat(/*@__PURE__*/ (/* @__PURE__ */ "ArithmeticError.AssertionError.AttributeError.BaseException.BlockingIOError.BrokenPipeError.BufferError.BytesWarning.ChildProcessError.ConnectionAbortedError.ConnectionError.ConnectionRefusedError.ConnectionResetError.DeprecationWarning.EOFError.Ellipsis.EncodingWarning.EnvironmentError.Exception.FileExistsError.FileNotFoundError.FloatingPointError.FutureWarning.GeneratorExit.IOError.ImportError.ImportWarning.IndentationError.IndexError.InterruptedError.IsADirectoryError.KeyError.KeyboardInterrupt.LookupError.MemoryError.ModuleNotFoundError.NameError.NotADirectoryError.NotImplemented.NotImplementedError.OSError.OverflowError.PendingDeprecationWarning.PermissionError.ProcessLookupError.RecursionError.ReferenceError.ResourceWarning.RuntimeError.RuntimeWarning.StopAsyncIteration.StopIteration.SyntaxError.SyntaxWarning.SystemError.SystemExit.TabError.TimeoutError.TypeError.UnboundLocalError.UnicodeDecodeError.UnicodeEncodeError.UnicodeError.UnicodeTranslateError.UnicodeWarning.UserWarning.ValueError.Warning.ZeroDivisionError".split(".")).map((e) => ({
		label: e,
		type: "type"
	}))).concat(/*@__PURE__*/ [
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
	].map((e) => ({
		label: e,
		type: "class"
	}))).concat(/*@__PURE__*/ (/* @__PURE__ */ "abs.aiter.all.anext.any.ascii.bin.breakpoint.callable.chr.compile.delattr.dict.dir.divmod.enumerate.eval.exec.exit.filter.format.getattr.globals.hasattr.hash.help.hex.id.input.isinstance.issubclass.iter.len.license.locals.max.min.next.oct.open.ord.pow.print.property.quit.repr.reversed.round.setattr.slice.sorted.sum.vars.zip".split(".")).map((e) => ({
		label: e,
		type: "function"
	}))), eE = [
		/*@__PURE__*/ iC("def ${name}(${params}):\n	${}", {
			label: "def",
			detail: "function",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("for ${name} in ${collection}:\n	${}", {
			label: "for",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("while ${}:\n	${}", {
			label: "while",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("try:\n	${}\nexcept ${error}:\n	${}", {
			label: "try",
			detail: "/ except block",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("if ${}:\n	\n", {
			label: "if",
			detail: "block",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("if ${}:\n	${}\nelse:\n	${}", {
			label: "if",
			detail: "/ else block",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("class ${name}:\n	def __init__(self, ${params}):\n			${}", {
			label: "class",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("import ${module}", {
			label: "import",
			detail: "statement",
			type: "keyword"
		}),
		/*@__PURE__*/ iC("from ${module} import ${names}", {
			label: "from",
			detail: "import",
			type: "keyword"
		})
	], tE = /*@__PURE__*/ eC(QT, /*@__PURE__*/ $S(/*@__PURE__*/ $T.concat(eE))), nE = /*@__PURE__*/ Ob.define({
		name: "python",
		parser: /*@__PURE__*/ zT.configure({ props: [/*@__PURE__*/ Hb.add({
			Body: (e) => KT(e, /^\s*(#|$)/.test(e.textAfter) && GT(e) || e.node) ?? e.continue(),
			MatchBody: (e) => KT(e, GT(e) || e.node) ?? e.continue(),
			IfStatement: (e) => /^\s*(else:|elif )/.test(e.textAfter) ? e.baseIndent : e.continue(),
			"ForStatement WhileStatement": (e) => /^\s*else:/.test(e.textAfter) ? e.baseIndent : e.continue(),
			TryStatement: (e) => /^\s*(except[ :]|finally:|else:)/.test(e.textAfter) ? e.baseIndent : e.continue(),
			MatchStatement: (e) => /^\s*case /.test(e.textAfter) ? e.baseIndent + e.unit : e.continue(),
			"TupleExpression ComprehensionExpression ParamList ArgList ParenthesizedExpression": /*@__PURE__*/ Ny({ closing: ")" }),
			"DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression": /*@__PURE__*/ Ny({ closing: "}" }),
			"ArrayExpression ArrayComprehensionExpression": /*@__PURE__*/ Ny({ closing: "]" }),
			MemberExpression: (e) => e.baseIndent + e.unit,
			"String FormatString": () => null,
			Script: (e) => {
				let t = GT(e);
				return (t && KT(e, t)) ?? e.continue();
			}
		}), /*@__PURE__*/ qb.add({
			"ArrayExpression DictionaryExpression SetExpression TupleExpression": Ly,
			Body: (e, t) => ({
				from: e.from + 1,
				to: e.to - (e.to == t.doc.length ? 0 : 1)
			}),
			"String FormatString": (e, t) => ({
				from: t.doc.lineAt(e.from).to,
				to: e.to
			})
		})] }),
		languageData: {
			closeBrackets: {
				brackets: [
					"(",
					"[",
					"{",
					"'",
					"\"",
					"'''",
					"\"\"\""
				],
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
			indentOnInput: /^\s*([\}\]\)]|else:|elif |except |finally:|case\s+[^:]*:?)$/
		}
	});
})), iE = /* @__PURE__ */ H("<button> </button>"), aE = /* @__PURE__ */ H("<div class=\"syms svelte-15ml29j\"></div>"), oE = /* @__PURE__ */ H("<div class=\"cerr mono svelte-15ml29j\"> </div> <div class=\"chint svelte-15ml29j\">The source API may be disabled or token-gated on this server (enable_source_api).</div>", 1), sE = /* @__PURE__ */ H("<div class=\"cload mono svelte-15ml29j\">loading source…</div>"), cE = /* @__PURE__ */ H("<div class=\"editor svelte-15ml29j\"></div>"), lE = /* @__PURE__ */ H("<div class=\"code svelte-15ml29j\"><div class=\"chead svelte-15ml29j\"><span class=\"mark mono svelte-15ml29j\">&lt;/&gt; Code</span> <span class=\"path mono svelte-15ml29j\"> </span> <span class=\"spacer svelte-15ml29j\"></span> <span class=\"rotag mono svelte-15ml29j\">read-only</span></div> <!> <!></div>");
function uE(e, t) {
	Ge(t, !0);
	let n = /* @__PURE__ */ j(null), r = /* @__PURE__ */ j(""), i = /* @__PURE__ */ j(null), a = null;
	function o(e) {
		let t = [], n = e.split("\n");
		return /^\s*(?:'''|""")/.test(n[0] ?? "") && t.push({
			label: "\"\"\"doc",
			line: 1
		}), n.forEach((e, n) => {
			let r = e.match(/^\s*class\s+(\w+)/);
			if (r) {
				t.push({
					label: r[1],
					line: n + 1
				});
				return;
			}
			let i = e.match(/^\s*def\s+(\w+)/);
			if (!i) return;
			let a = i[1];
			a === "__call__" ? t.push({
				label: "__call__",
				line: n + 1
			}) : a.startsWith("version_") ? t.push({
				label: `~${a.slice(8)}`,
				line: n + 1
			}) : a.startsWith("__") || t.push({
				label: `${a}()`,
				line: n + 1
			});
		}), t;
	}
	let s = /* @__PURE__ */ k(() => B(n) ? o(B(n).content) : []), c = /* @__PURE__ */ j(null);
	yn(() => {
		if (t.path, M(n, null), M(r, ""), !t.adapter.readSource) {
			M(r, "this host has no source API");
			return;
		}
		let e = !1;
		return t.adapter.readSource(t.path).then((t) => {
			e || M(n, t, !0);
		}).catch((t) => {
			e || M(r, t instanceof Error ? t.message : String(t), !0);
		}), () => e = !0;
	}), yn(() => {
		let e = B(i), r = B(n);
		if (!e || !r) return;
		let o = !1;
		return (async () => {
			let [n, i, s, c] = await Promise.all([
				Promise.resolve().then(() => (X_(), uu)),
				Promise.resolve().then(() => (Gl(), rc)),
				Promise.resolve().then(() => (Rx(), py)),
				Promise.resolve().then(() => (ly(), Mv))
			]);
			if (o) return;
			let { EditorView: u, lineNumbers: d, highlightActiveLine: f } = n, { EditorState: p } = i, { syntaxHighlighting: m, HighlightStyle: h } = s, { tags: g } = c, _ = r.language === "javascript" ? (await Promise.resolve().then(() => (rw(), TC))).javascript() : (await Promise.resolve().then(() => (rE(), VT))).python();
			if (o) return;
			let v = u.theme({
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
				".cm-activeLineGutter": {
					backgroundColor: "transparent",
					color: "#8f8677"
				},
				"&.cm-focused": { outline: "none" }
			}, { dark: !0 }), y = h.define([
				{
					tag: [
						g.keyword,
						g.controlKeyword,
						g.definitionKeyword
					],
					color: "#c2569b"
				},
				{
					tag: [g.string, g.special(g.string)],
					color: "#7fc9a6"
				},
				{
					tag: [
						g.number,
						g.bool,
						g.null
					],
					color: "#e0a06a"
				},
				{
					tag: [g.function(g.variableName), g.function(g.definition(g.variableName))],
					color: "#8ba0f0"
				},
				{
					tag: [g.definition(g.variableName), g.className],
					color: "#8ba0f0"
				},
				{
					tag: [g.comment, g.docString],
					color: "#8f8677",
					fontStyle: "italic"
				},
				{
					tag: [g.propertyName, g.attributeName],
					color: "#c9c0af"
				},
				{
					tag: g.self,
					color: "#c2a3d6"
				}
			]);
			a?.destroy(), a = new u({
				state: p.create({
					doc: r.content,
					extensions: [
						d(),
						f(),
						_,
						v,
						m(y),
						p.readOnly.of(!0),
						u.editable.of(!1),
						u.lineWrapping
					]
				}),
				parent: e
			}), t.line && l(t.line);
		})(), () => {
			o = !0, a?.destroy(), a = null;
		};
	});
	function l(e) {
		if (!a) return;
		let t = a.state.doc, n = Math.max(1, Math.min(e, t.lines)), r = t.line(n).from;
		a.dispatch({
			selection: { anchor: r },
			effects: a.constructor.scrollIntoView ? a.constructor.scrollIntoView(r, {
				y: "start",
				yMargin: 8
			}) : void 0,
			scrollIntoView: !0
		}), M(c, n, !0);
	}
	var u = lE(), d = N(u), f = F(I(N(d), 2), !0);
	Ee(4), O(d);
	var p = I(d, 2), m = (e) => {
		var t = aE();
		Hr(t, 21, () => B(s), (e) => e.label + e.line, (e, t) => {
			var n = iE();
			let r;
			var i = F(n, !0);
			L(() => {
				r = ii(n, 1, "sym mono svelte-15ml29j", null, r, { on: B(c) === B(t).line }), W(i, B(t).label);
			}), V("click", n, () => l(B(t).line)), U(e, n);
		}), O(t), U(e, t);
	};
	G(p, (e) => {
		B(s).length && e(m);
	});
	var h = I(p, 2), g = (e) => {
		var t = oE(), n = F(P(t), !0);
		Ee(2), L(() => W(n, B(r))), U(e, t);
	}, _ = (e) => {
		U(e, sE());
	}, v = (e) => {
		var t = cE();
		Oi(t, (e) => M(i, e), () => B(i)), U(e, t);
	};
	G(h, (e) => {
		B(r) ? e(g) : B(n) ? e(v, -1) : e(_, 1);
	}), O(u), L(() => W(f, t.path)), U(e, u), Ke();
}
yr(["click"]);
// src/Machinable.svelte
var dE = /* @__PURE__ */ H("<button class=\"back svelte-eqn6l9\" title=\"back to runs\">‹</button>"), fE = /* @__PURE__ */ H("<span class=\"target mono svelte-eqn6l9\"> </span>"), pE = /* @__PURE__ */ H("<span class=\"server mono svelte-eqn6l9\"> </span> <!>", 1), mE = /* @__PURE__ */ H("<span class=\"server mono svelte-eqn6l9\">not connected</span>"), hE = /* @__PURE__ */ H("<span class=\"ro mono svelte-eqn6l9\" title=\"Read-only — server widgets are not loaded\">read-only</span>"), gE = /* @__PURE__ */ H("<span class=\"needs mono svelte-eqn6l9\">NEEDS TRUST</span>"), _E = /* @__PURE__ */ H("<span class=\"ro mono svelte-eqn6l9\"> </span>"), vE = /* @__PURE__ */ H("<button> </button>"), yE = /* @__PURE__ */ H("<!> <div class=\"hrow tabs svelte-eqn6l9\"></div>", 1), bE = /* @__PURE__ */ H("<div class=\"trust svelte-eqn6l9\"><div class=\"trow svelte-eqn6l9\"><span class=\"bang svelte-eqn6l9\">!</span> <span class=\"tq svelte-eqn6l9\">Trust this server?</span></div> <p class=\"tp svelte-eqn6l9\">Its widgets run <strong class=\"svelte-eqn6l9\">as code in your session</strong>. Only trust servers you\n							control. Read-only inspection stays available either way.</p> <div class=\"tbtns svelte-eqn6l9\"><button class=\"go fill svelte-eqn6l9\">Trust &amp; connect</button> <button class=\"go svelte-eqn6l9\">Read-only</button></div></div>"), xE = /* @__PURE__ */ H("<button class=\"go fill svelte-eqn6l9\"> </button>"), SE = /* @__PURE__ */ H("<div class=\"err mono svelte-eqn6l9\"> </div> <button class=\"retry mono svelte-eqn6l9\">retry · check URL ▸</button>", 1), CE = /* @__PURE__ */ H("<div class=\"connect svelte-eqn6l9\"><input class=\"cinput mono svelte-eqn6l9\" placeholder=\"server url, e.g. http://127.0.0.1:8000\" aria-label=\"server url\"/> <input class=\"cinput mono svelte-eqn6l9\" type=\"password\" placeholder=\"token · optional\" aria-label=\"token\"/> <!> <!></div>"), wE = /* @__PURE__ */ H("<span class=\"mpkind mono svelte-eqn6l9\"> </span>"), TE = /* @__PURE__ */ H("<span class=\"mpdoc svelte-eqn6l9\"> </span>"), EE = /* @__PURE__ */ H("<button class=\"mpick svelte-eqn6l9\"><span class=\"mpname mono svelte-eqn6l9\"> </span> <!> <!></button>"), DE = /* @__PURE__ */ H("<div class=\"mpempty mono svelte-eqn6l9\">no modules match</div>"), OE = /* @__PURE__ */ H("<input class=\"mfilter mono svelte-eqn6l9\" placeholder=\"find an interface…\" aria-label=\"find an interface\"/> <div class=\"mlist svelte-eqn6l9\"></div>", 1), kE = /* @__PURE__ */ H("<div class=\"lockbar svelte-eqn6l9\"><span class=\"lockmsg mono svelte-eqn6l9\">🔒 cached · read-only</span> <button class=\"fork mono svelte-eqn6l9\">Fork as new draft ▸</button></div>"), AE = /* @__PURE__ */ H("<div class=\"resulthint mono svelte-eqn6l9\"> </div>"), jE = /* @__PURE__ */ H("<div class=\"resulthint mono svelte-eqn6l9\">no run yet</div>"), ME = /* @__PURE__ */ H("<div class=\"panel svelte-eqn6l9\"><span class=\"nomod mono svelte-eqn6l9\">no source declared for this module</span></div>"), NE = /* @__PURE__ */ H("<div class=\"panel svelte-eqn6l9\"><span class=\"nomod mono svelte-eqn6l9\">resolving source…</span></div>"), PE = /* @__PURE__ */ H("<!> <div><!> <!></div> <div><!> <!></div> <div><!> <!></div> <div><!></div> <div><!></div> <!> <!>", 1), FE = /* @__PURE__ */ H("<div class=\"mach svelte-eqn6l9\"><div class=\"head svelte-eqn6l9\"><div class=\"hrow svelte-eqn6l9\"><!> <span></span> <!> <span class=\"spacer svelte-eqn6l9\"></span> <!> <!></div> <!></div> <div class=\"body svelte-eqn6l9\"><!></div></div>");
function IE(e, t) {
	Ge(t, !0);
	let n = ji(t, "defaultUrl", 3, "http://127.0.0.1:8000"), r = ji(t, "autoConnect", 3, !1), i = ji(t, "initialView", 3, null), a = ji(t, "initialTarget", 3, ""), o = ji(t, "initialVersion", 19, () => []), s = /* @__PURE__ */ j(Xt(n())), c = /* @__PURE__ */ j(""), l = /* @__PURE__ */ j(!1), u = /* @__PURE__ */ j(!1), d = /* @__PURE__ */ j(!1), f = /* @__PURE__ */ j(Xt([])), p = /* @__PURE__ */ j(Xt([])), m = /* @__PURE__ */ j(""), h = /* @__PURE__ */ j(!1), g = /* @__PURE__ */ j(!1), _ = /* @__PURE__ */ j("");
	async function v(e) {
		M(g, !0), M(_, ""), t.onError?.(null);
		try {
			let n = await t.adapter.connect(B(s), B(c) || void 0, e);
			if (M(d, !!n.needsTrust), n.needsTrust) return;
			M(l, n.connected, !0), M(u, !!n.readOnly), M(f, n.modules ?? [], !0), B(l) ? (console.info("[machinable] connected", B(s), `${B(f).length} module(s)`, B(u) ? "(read-only)" : ""), M(p, B(f).map((e) => ({ module: e })), !0), t.adapter.listModules?.().then((e) => {
				e?.length && M(p, e, !0);
			}), M(h, !1), t.adapter.listSource?.().then(() => M(h, !0)).catch(() => {}), t.onConnect?.(B(s), B(f), B(u))) : (M(_, n.message ?? "could not connect (no detail)", !0), console.warn("[machinable] connect failed —", B(s), B(_)), t.onError?.(`${B(s)}: ${B(_)}`));
		} catch (e) {
			M(_, e instanceof Error ? e.message : String(e), !0), console.error("[machinable] connect threw —", B(s), e), t.onError?.(`${B(s)}: ${B(_)}`);
		} finally {
			M(g, !1);
		}
	}
	async function y() {
		await t.adapter.trust(B(s)), M(d, !1), await v();
	}
	let b = !1;
	yn(() => {
		r() && !b && (b = !0, v().then(() => {
			B(l) && (i() === "item" && a() ? (xe(a(), o()), M(S, "item")) : M(S, "list"));
		}));
	});
	let x = /* @__PURE__ */ k(() => B(s).replace(/^https?:\/\//, "")), S = /* @__PURE__ */ j("list"), C = /* @__PURE__ */ j("config");
	function w() {
		xe(""), M(S, "item");
	}
	function ee(e) {
		xe(e.module, e.version ?? [e.config]), M(S, "item");
	}
	function te() {
		M(S, "list");
	}
	function ne(e) {
		M(C, e, !0), e === "code" && !B(Ee) && ke();
	}
	let T = /* @__PURE__ */ j(""), re = /* @__PURE__ */ j(Xt([])), ie = /* @__PURE__ */ j(Xt([])), ae = /* @__PURE__ */ j(Xt({})), oe = /* @__PURE__ */ j(""), se = /* @__PURE__ */ j(""), ce = /* @__PURE__ */ j(!0), le = /* @__PURE__ */ j(Xt([])), ue = /* @__PURE__ */ j(Xt({
		context: [],
		chain: []
	})), de = /* @__PURE__ */ j(null), fe = /* @__PURE__ */ j("draft"), pe = /* @__PURE__ */ j(null), me = /* @__PURE__ */ j(!1), he = /* @__PURE__ */ j(!1), ge = /* @__PURE__ */ j(null), _e = /* @__PURE__ */ j(null), ve = /* @__PURE__ */ j(!1), ye = /* @__PURE__ */ j(null), be = null;
	function xe(e, t = []) {
		M(T, e, !0), M(ie, t, !0), M(re, t, !0), M(fe, "draft"), M(pe, null), M(me, !1), M(he, !1), M(ge, null), M(_e, null), M(ve, !1), be = null, M(C, "config"), M(Ee, null), M(De, void 0), M(Oe, !1);
	}
	function Se(e, n) {
		M(fe, e, !0), n && M(pe, n, !0), e === "running" ? M(me, !0) : M(ge, null), t.onStatus?.(e), be === "running" && e === "cached" && (t.onCached?.(B(T), B(ae)), M(C, "result")), e === "cached" && be === null && t.onCached?.(B(T), B(ae)), be = e;
	}
	let E = /* @__PURE__ */ k(() => B(fe) === "cached" && !B(me)), Ce = /* @__PURE__ */ k(() => B(fe) === "cached" && !B(he)), D = /* @__PURE__ */ k(() => B(fe) === "running" || B(Ce)), we = /* @__PURE__ */ k(() => !B(l) || !B(T) || B(S) !== "item" ? null : B(ve) ? "running-looped" : B(E) ? "cached-reuse" : B(fe) === "interrupted" ? "interrupted" : B(fe)), Te = /* @__PURE__ */ k(() => B(ue).chain.find((e) => e.id === B(ue).executionRef)?.title ?? "default execution"), Ee = /* @__PURE__ */ j(null), De = /* @__PURE__ */ j(void 0), Oe = /* @__PURE__ */ j(!1);
	async function ke() {
		M(Oe, !1);
		try {
			let e = await t.adapter.introspect(B(T));
			M(Ee, e.sourceRef?.path ?? null, !0), M(Oe, !B(Ee));
		} catch {
			M(Oe, !0);
		}
	}
	function Ae(e) {
		M(Ee, e.path, !0), M(De, e.line, !0), M(Oe, !1), M(C, "code");
	}
	function je(e) {
		M(ue, e, !0);
	}
	function Me(e) {
		M(de, e, !0);
	}
	function Ne(e) {
		M(ce, e.ok, !0), M(le, e.ok ? [] : e.issues, !0), e.ok ? (M(ae, e.config, !0), M(se, e.identity ?? "", !0), M(oe, e.cli, !0)) : M(oe, "");
	}
	function Pe(e) {
		M(re, e, !0);
	}
	function Fe(e) {
		M(ge, e, !0);
	}
	function Ie(e) {
		M(_e, e, !0);
	}
	function Le(e) {
		M(ve, e, !0);
	}
	function Re(e) {
		M(ye, e, !0);
	}
	function ze() {
		B(ge) && t.adapter.interrupt(B(ge).executionRef);
	}
	let Be = [
		{
			id: "config",
			label: "Config"
		},
		{
			id: "context",
			label: "Context"
		},
		{
			id: "result",
			label: "Result"
		},
		{
			id: "execution",
			label: "Execution"
		},
		{
			id: "cli",
			label: "CLI"
		},
		{
			id: "provenance",
			label: "Provenance"
		},
		{
			id: "code",
			label: "</> Code"
		}
	], Ve = /* @__PURE__ */ k(() => Be.filter((e) => e.id !== "code" || !!t.adapter.readSource && B(h)));
	var He = FE(), Ue = N(He), We = N(Ue), qe = N(We), Je = (e) => {
		var t = dE();
		V("click", t, te), U(e, t);
	};
	G(qe, (e) => {
		B(l) && B(S) === "item" && e(Je);
	});
	var Ye = I(qe, 2);
	let Xe;
	var Ze = I(Ye, 2), Qe = (e) => {
		var t = pE(), n = P(t), r = F(n, !0), i = I(n, 2), a = (e) => {
			var t = fE(), n = F(t, !0);
			L(() => W(n, B(T))), U(e, t);
		};
		G(i, (e) => {
			B(S) === "item" && B(T) && e(a);
		}), L(() => {
			bi(n, "title", B(s)), W(r, B(x));
		}), U(e, t);
	}, $e = (e) => {
		U(e, mE());
	};
	G(Ze, (e) => {
		B(l) ? e(Qe) : e($e, -1);
	});
	var et = I(Ze, 4), tt = (e) => {
		U(e, hE());
	};
	G(et, (e) => {
		B(u) && B(l) && e(tt);
	});
	var nt = I(et, 2), it = (e) => {
		U(e, gE());
	}, at = (e) => {
		var t = _E(), n = F(t);
		L(() => W(n, `${B(ye) ?? ""} run${B(ye) === 1 ? "" : "s"}`)), U(e, t);
	};
	G(nt, (e) => {
		B(d) && !B(l) ? e(it) : B(l) && B(S) === "list" && B(ye) !== null && e(at, 1);
	}), O(We);
	var ot = I(We, 2), st = (e) => {
		var n = yE(), r = P(n);
		fs(r, {
			get adapter() {
				return t.adapter;
			},
			get module() {
				return B(T);
			},
			get version() {
				return B(re);
			},
			get badge() {
				return B(we);
			},
			onResolved: Ne,
			children: (e, n) => {
				{
					let n = /* @__PURE__ */ k(() => !B(ce));
					vo(e, {
						get adapter() {
							return t.adapter;
						},
						get module() {
							return B(T);
						},
						get version() {
							return B(re);
						},
						get onFailure() {
							return t.onFailure;
						},
						get context() {
							return B(ue).context;
						},
						get execution() {
							return B(ue).execution;
						},
						get executionRef() {
							return B(ue).executionRef;
						},
						compact: !0,
						get disabled() {
							return B(n);
						},
						launchLabel: "Launch",
						onStatus: Se,
						onRun: Fe
					});
				}
			},
			$$slots: { default: !0 }
		});
		var i = I(r, 2);
		Hr(i, 21, () => B(Ve), (e) => e.id, (e, t) => {
			var n = vE();
			let r;
			var i = F(n, !0);
			L(() => {
				r = ii(n, 1, "tab mono-if-code svelte-eqn6l9", null, r, { on: B(C) === B(t).id }), W(i, B(t).label);
			}), V("click", n, () => ne(B(t).id)), U(e, n);
		}), O(i), U(e, n);
	};
	G(ot, (e) => {
		B(l) && B(S) === "item" && B(T) && e(st);
	}), O(Ue);
	var ct = I(Ue, 2), lt = N(ct), ut = (e) => {
		var t = CE(), n = N(t);
		vi(n);
		var r = I(n, 2);
		vi(r);
		var i = I(r, 2), a = (e) => {
			var t = bE(), n = I(N(t), 4), r = N(n), i = I(r, 2);
			O(n), O(t), L(() => {
				r.disabled = B(g), i.disabled = B(g);
			}), V("click", r, y), V("click", i, () => v({ readOnly: !0 })), U(e, t);
		}, o = (e) => {
			var t = xE(), n = F(t, !0);
			L(() => {
				t.disabled = B(g), W(n, B(g) ? "connecting…" : "Connect");
			}), V("click", t, () => v()), U(e, t);
		};
		G(i, (e) => {
			B(d) ? e(a) : e(o, -1);
		});
		var l = I(i, 2), u = (e) => {
			var t = SE(), n = P(t), r = F(n, !0), i = I(n, 2);
			L(() => W(r, B(_))), V("click", i, () => v()), U(e, t);
		};
		G(l, (e) => {
			B(_) && e(u);
		}), O(t), L(() => {
			n.disabled = B(g), r.disabled = B(g);
		}), wi(n, () => B(s), (e) => M(s, e)), wi(r, () => B(c), (e) => M(c, e)), U(e, t);
	}, dt = (e) => {
		rs(e, {
			get adapter() {
				return t.adapter;
			},
			onNew: w,
			onOpen: ee,
			onTotal: Re
		});
	}, ft = (e) => {
		var n = Dr(), r = P(n), i = (e) => {
			var t = OE(), n = P(t);
			vi(n), rt(n, !0);
			var r = I(n, 2);
			Hr(r, 21, () => B(p).filter((e) => !B(m) || e.module.toLowerCase().includes(B(m).toLowerCase())), (e) => e.module, (e, t) => {
				var n = EE(), r = N(n), i = F(r, !0), a = I(r, 2), o = (e) => {
					var n = wE(), r = F(n, !0);
					L(() => W(r, B(t).kind)), U(e, n);
				};
				G(a, (e) => {
					B(t).kind && B(t).kind !== "Interface" && e(o);
				});
				var s = I(a, 2), c = (e) => {
					var n = TE(), r = F(n, !0);
					L((e) => W(r, e), [() => B(t).doc.split("\n")[0]]), U(e, n);
				};
				G(s, (e) => {
					B(t).doc && e(c);
				}), O(n), L(() => W(i, B(t).module)), V("click", n, () => xe(B(t).module)), U(e, n);
			}, (e) => {
				U(e, DE());
			}), O(r), wi(n, () => B(m), (e) => M(m, e)), U(e, t);
		}, a = (e) => {
			var n = PE(), r = P(n), i = (e) => {
				Cs(e, {
					get executionLabel() {
						return B(Te);
					},
					get identity() {
						return B(se);
					},
					get startedAt() {
						return B(ge).startedAt;
					},
					onInterrupt: ze
				});
			};
			G(r, (e) => {
				B(fe) === "running" && B(ge) && e(i);
			});
			var a = I(r, 2);
			let o;
			var s = N(a), c = (e) => {
				var t = kE(), n = I(N(t), 2);
				O(t), V("click", n, () => M(he, !0)), U(e, t);
			};
			G(s, (e) => {
				B(Ce) && e(c);
			}), Ya(I(s, 2), {
				get adapter() {
					return t.adapter;
				},
				get module() {
					return B(T);
				},
				get version() {
					return B(ie);
				},
				get issues() {
					return B(le);
				},
				get disabled() {
					return B(D);
				},
				onVersion: Pe,
				onViewSource: Ae
			}), O(a);
			var l = I(a, 2);
			let u;
			var d = N(l), p = (e) => {
				var t = kE(), n = I(N(t), 2);
				O(t), V("click", n, () => M(he, !0)), U(e, t);
			};
			G(d, (e) => {
				B(Ce) && e(p);
			}), so(I(d, 2), {
				get adapter() {
					return t.adapter;
				},
				get modules() {
					return B(f);
				},
				get project() {
					return B(x);
				},
				get disabled() {
					return B(D);
				},
				get highlightId() {
					return B(de);
				},
				onHighlight: Me,
				onChange: je,
				onViewSource: Ae
			}), O(l);
			var m = I(l, 2);
			let h;
			var g = N(m), _ = (e) => {
				Us(e, {
					get adapter() {
						return t.adapter;
					},
					get module() {
						return B(T);
					},
					get version() {
						return B(re);
					},
					get result() {
						return B(_e);
					},
					get status() {
						return B(fe);
					}
				});
			};
			G(g, (e) => {
				(t.adapter.slots?.result || t.adapter.widgetAssets || B(_e) !== null) && e(_);
			});
			var v = I(g, 2), y = (e) => {
				Fs(e, {
					get adapter() {
						return t.adapter;
					},
					get module() {
						return B(T);
					},
					get version() {
						return B(re);
					},
					onResult: Ie,
					onLoop: Le
				});
			}, b = (e) => {
				var t = AE(), n = F(t, !0);
				L(() => W(n, B(fe) === "running" ? "running…" : "no result yet — launch first")), U(e, t);
			};
			G(v, (e) => {
				B(fe) === "cached" ? e(y) : e(b, -1);
			}), O(m);
			var S = I(m, 2);
			let w;
			var ee = N(S), te = (e) => {
				ks(e, {
					get adapter() {
						return t.adapter;
					},
					get executionRef() {
						return B(pe);
					},
					get status() {
						return B(fe);
					}
				});
			}, ne = (e) => {
				U(e, jE());
			};
			G(ee, (e) => {
				B(pe) ? e(te) : e(ne, -1);
			}), O(S);
			var ae = I(S, 2);
			let ce;
			ys(N(ae), {
				get cli() {
					return B(oe);
				},
				get module() {
					return B(T);
				},
				get chain() {
					return B(ue).chain;
				},
				get highlightId() {
					return B(de);
				},
				onHighlight: Me
			}), O(ae);
			var me = I(ae, 2), ve = (e) => {
				Po(e, {
					get adapter() {
						return t.adapter;
					},
					get module() {
						return B(T);
					},
					get version() {
						return B(re);
					},
					onViewSource: Ae
				});
			};
			G(me, (e) => {
				B(C) === "provenance" && e(ve);
			});
			var ye = I(me, 2), be = (e) => {
				var n = Dr(), r = P(n), i = (e) => {
					uE(e, {
						get adapter() {
							return t.adapter;
						},
						get path() {
							return B(Ee);
						},
						get line() {
							return B(De);
						}
					});
				}, a = (e) => {
					U(e, ME());
				}, o = (e) => {
					U(e, NE());
				};
				G(r, (e) => {
					B(Ee) ? e(i) : B(Oe) ? e(a, 1) : e(o, -1);
				}), U(e, n);
			};
			G(ye, (e) => {
				B(C) === "code" && e(be);
			}), L(() => {
				o = ii(a, 1, "pane svelte-eqn6l9", null, o, { off: B(C) !== "config" }), u = ii(l, 1, "pane svelte-eqn6l9", null, u, { off: B(C) !== "context" }), h = ii(m, 1, "pane fill svelte-eqn6l9", null, h, { off: B(C) !== "result" }), w = ii(S, 1, "pane svelte-eqn6l9", null, w, { off: B(C) !== "execution" }), ce = ii(ae, 1, "pane svelte-eqn6l9", null, ce, { off: B(C) !== "cli" });
			}), U(e, n);
		};
		G(r, (e) => {
			B(T) ? e(a, -1) : e(i);
		}), U(e, n);
	};
	G(lt, (e) => {
		B(l) ? B(S) === "list" ? e(dt, 1) : e(ft, -1) : e(ut);
	}), O(ct), O(He), L(() => Xe = ii(Ye, 1, "dot svelte-eqn6l9", null, Xe, {
		on: B(l),
		run: B(l) && B(fe) === "running"
	})), U(e, He), Ke();
}
yr(["click"]);
// src/adapter.ts
var LE = class extends Error {
	status;
	detail;
	constructor(e, t) {
		super(typeof t == "string" ? t : JSON.stringify(t)), this.status = e, this.detail = t;
	}
};
function RE(e) {
	return {
		target: e.target,
		version: e.version ?? []
	};
}
function zE(e) {
	if (e.endsWith(".py")) return "python";
	if (e.endsWith(".js") || e.endsWith(".mjs")) return "javascript";
	if (e.endsWith(".ts")) return "typescript";
	if (e.endsWith(".json")) return "json";
	if (e.endsWith(".yaml") || e.endsWith(".yml")) return "yaml";
	if (e.endsWith(".md")) return "markdown";
}
function BE(e, t) {
	let n = (e ?? "http://127.0.0.1:8000").replace(/\/+$/, ""), r = t;
	async function i(e, t = {}) {
		let i = {};
		t.body !== void 0 && (i["Content-Type"] = "application/json"), r && (i.Authorization = `Bearer ${r}`);
		let a = await fetch(n + e, {
			method: t.method ?? (t.body === void 0 ? "GET" : "POST"),
			headers: i,
			body: t.body === void 0 ? void 0 : JSON.stringify(t.body)
		});
		if (!a.ok) {
			let e = a.statusText;
			try {
				e = (await a.json())?.detail ?? e;
			} catch {}
			throw new LE(a.status, e);
		}
		if (a.status !== 204) return await a.json();
	}
	function a(e) {
		return e && typeof e == "object" && Array.isArray(e.issues) ? e.issues.map((e) => ({
			path: e.path ?? void 0,
			message: String(e.message ?? e)
		})) : [{ message: typeof e == "string" ? e : JSON.stringify(e) }];
	}
	return {
		connect: async (e, t) => {
			n = e.replace(/\/+$/, ""), t !== void 0 && (r = t);
			try {
				await i("/v1/health");
				let e = await i("/v1/project");
				return {
					connected: !0,
					modules: (e.modules ?? []).map((e) => e.module),
					project: e.project
				};
			} catch (e) {
				return {
					connected: !1,
					message: e instanceof Error ? e.message : String(e)
				};
			}
		},
		trust: async () => {},
		setToken: (e) => {
			r = e;
		},
		listModules: async () => ((await i("/v1/project")).modules ?? []).map((e) => ({
			module: e.module,
			kind: e.kind,
			doc: e.doc ?? void 0
		})),
		introspect: async (e) => zi(e, await i(`/v1/project/${encodeURIComponent(e)}`)),
		resolve: async (e, t) => {
			try {
				let n = await i("/v1/interfaces/resolve", { body: {
					target: e,
					version: t
				} });
				return {
					ok: !0,
					config: n.config,
					cli: n.cli,
					predicate: n.predicate,
					identity: Gi(n.predicate ?? n.config)
				};
			} catch (e) {
				if (e instanceof LE && e.status === 400) return {
					ok: !1,
					issues: a(e.detail)
				};
				throw e;
			}
		},
		dispatch: async (e, t, n) => {
			let r = { interfaces: [{
				target: e,
				version: t,
				context: (n?.context ?? []).map(RE)
			}] };
			return n?.execution && (r.execution = RE(n.execution)), n?.executionRef && (r.execution_ref = n.executionRef), { executionRef: (await i("/v1/executions", { body: r })).uuid };
		},
		find: async (e, t, n) => {
			try {
				let r = await i("/v1/interfaces/lifecycle", { body: {
					target: e,
					version: t,
					context: (n?.context ?? []).map(RE)
				} });
				return {
					status: r.status,
					uuid: r.uuid ?? void 0,
					executionRef: r.execution_uuid ?? void 0
				};
			} catch (e) {
				if (e instanceof LE && e.status === 400) return {
					status: "draft",
					issues: a(e.detail)
				};
				throw e;
			}
		},
		interrupt: async (e) => {
			await i(`/v1/executions/${encodeURIComponent(e)}/cancel`, { method: "POST" });
		},
		runDetail: async (e) => {
			let t = await i(`/v1/executions/${encodeURIComponent(e)}`);
			return {
				uuid: t.uuid,
				nickname: t.nickname ?? void 0,
				seed: t.seed ?? void 0,
				startedAt: t.started_at ?? null,
				finishedAt: t.finished_at ?? null,
				heartbeatAt: t.heartbeat_at ?? null,
				active: t.is_active ?? void 0,
				finished: t.is_finished ?? void 0
			};
		},
		runOutput: async (e, t) => {
			let n = new URLSearchParams();
			t?.offset !== void 0 && n.set("offset", String(t.offset)), t?.tail !== void 0 && n.set("tail", String(t.tail)), t?.limit !== void 0 && n.set("limit", String(t.limit));
			let r = n.size ? `?${n}` : "";
			return i(`/v1/executions/${encodeURIComponent(e)}/output${r}`);
		},
		call: async (e, t, n, r) => (await i("/v1/interfaces/call", { body: {
			target: e,
			version: r,
			method: t,
			args: [],
			kwargs: n
		} })).payload,
		list: async (e) => {
			let t = {
				limit: e?.limit ?? 50,
				offset: e?.offset ?? 0,
				include_status: !0
			};
			e?.module && (t.module = e.module), e?.facets?.length && (t.config = { filters: e.facets.map((e) => ({
				path: e.path,
				op: e.op,
				value: e.value
			})) }), t.sort = e?.sort ? [{
				by: e.sort.by,
				direction: e.sort.direction ?? "desc",
				...e.sort.configPath ? { config_layer: "resolved" } : {}
			}] : [{
				by: "created_at_ns",
				direction: "desc"
			}];
			let n = await i("/v1/interfaces/search", { body: t }), r = n.items.map((e) => ({
				uuid: e.id,
				module: e.module ?? "",
				config: e.config ?? {},
				version: e.version ?? void 0,
				identity: Gi(e.config ?? {}),
				status: e.status ?? "draft",
				executionRef: e.execution_uuid ?? void 0,
				label: e.label ?? void 0,
				createdAt: e.created_at_ns ? Math.floor(e.created_at_ns / 1e6) : void 0,
				creator: e.created_by ?? void 0,
				runCount: e.run_count ?? void 0
			})), a = e?.text?.trim().toLowerCase();
			return a && (r = r.filter((e) => `${e.label ?? ""} ${e.module} ${e.uuid}`.toLowerCase().includes(a))), {
				items: r,
				total: n.total
			};
		},
		setLabel: async (e, t) => {
			await i(`/v1/interfaces/${encodeURIComponent(e)}/label`, {
				method: "PATCH",
				body: { label: t }
			});
		},
		provenance: async (e, t) => {
			let n = await i("/v1/interfaces/lifecycle", { body: {
				target: e,
				version: t
			} });
			return n.uuid ? i(`/v1/interfaces/${encodeURIComponent(n.uuid)}/provenance`) : null;
		},
		widgetAssets: async (e) => {
			let t = await i(`/v1/project/${encodeURIComponent(e)}`);
			if (!t.widget) return null;
			let a = (t) => fetch(`${n}/v1/project/${encodeURIComponent(e)}/widget/${t}`, { headers: r ? { Authorization: `Bearer ${r}` } : {} }), o = await a("esm");
			if (!o.ok) return null;
			let s = null;
			if (t.widget.css_url) {
				let e = await a("css");
				e.ok && (s = await e.text());
			}
			return {
				esm: await o.text(),
				css: s,
				meta: t.widget.meta
			};
		},
		listSource: async () => (await i("/v1/source")).files ?? [],
		readSource: async (e) => {
			let t = await i(`/v1/source/${e}`);
			return {
				path: t.path,
				content: t.content,
				etag: t.etag,
				language: zE(t.path)
			};
		}
	};
}
// src/main.ts
function VE(e, t = {}) {
	let n = Mr(IE, {
		target: e,
		props: {
			adapter: t.adapter ?? BE(t.url, t.token),
			defaultUrl: t.url ?? "http://127.0.0.1:8000",
			autoConnect: !!t.view,
			initialView: t.view ?? null,
			initialTarget: t.target ?? "",
			initialVersion: t.version ?? []
		}
	});
	return { unmount: () => void Ir(n) };
}
function HE(e, t) {
	let n, r, i = new Promise((e) => r = e), a = () => e.send({ type: "machinable.token" }), o = (e) => {
		if (e?.type !== "machinable.token") return;
		e.error && console.warn("[machinable] session token:", e.error);
		let i = e.token ?? void 0;
		t(i), r?.(i), r = void 0, clearTimeout(n);
		let o = i && e.expires_in ? e.expires_in * 800 : 6e4;
		n = setTimeout(a, o);
	};
	return e.on("msg:custom", o), a(), setTimeout(() => {
		r?.(void 0), r = void 0;
	}, 1e4), {
		first: i,
		stop: () => {
			clearTimeout(n), e.off?.("msg:custom", o);
		}
	};
}
async function UE({ model: e, el: t }) {
	let n = (t) => typeof e?.get == "function" ? e.get(t) ?? void 0 : void 0;
	t.style.height || (t.style.height = n("height") ?? "440px");
	let r = BE(n("url")), i = () => {};
	if (n("auth") === "kernel" && typeof e?.send == "function") {
		let t = HE(e, (e) => r.setToken?.(e));
		i = t.stop, await t.first;
	}
	let a = VE(t, {
		url: n("url"),
		adapter: r,
		view: n("view"),
		target: n("target"),
		version: n("version")
	});
	return () => {
		i(), a.unmount();
	};
}
var WE = {
	render: UE,
	mount: VE,
	createAdapter: BE
};
export { rs as Browser, Fs as CallLoop, ys as CliView, uE as CodeView, Ya as ConfigPicker, so as ContextStack, ga as FieldRenderer, vo as Lifecycle, IE as Machinable, Po as Provenance, fs as ResolvedBar, Us as ResultSlot, Cs as RunBanner, ks as RunPanel, os as StatusBadge, Fa as VersionEditor, BE as createAdapter, Is as createCallModel, WE as default, Vi as elementsToVersion, zi as moduleSchemaFromServer, VE as mount, Pi as parseAnnotation, Fi as parseSignature, Hi as parseVersionToken, UE as render, Ui as serializeVersionToken, Gi as shortIdentity, Bi as versionToElements };

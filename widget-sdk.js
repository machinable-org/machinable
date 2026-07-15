//#region \0rolldown/runtime.js
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
var _ = 1024, v = 2048, y = 4096, b = 8192, x = 16384, S = 32768, C = 1 << 25, w = 65536, ee = 1 << 19, te = 1 << 20, ne = 1 << 25, T = 65536, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("legacy props"), ce = Symbol(""), le = Symbol("attributes"), ue = Symbol("class"), de = Symbol("style"), fe = Symbol("text"), pe = Symbol("form reset"), me = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), he = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function ge() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function _e(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ve(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function ye() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function be(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function xe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Se(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ce() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function we() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Te() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ee() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/constants.js
var De = {}, Oe = Symbol("uninitialized"), ke = "http://www.w3.org/1999/xhtml";
function Ae() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function je(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Me() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ne() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var E = !1;
function Pe(e) {
	E = e;
}
var D;
function Fe(e) {
	if (e === null) throw je(), De;
	return D = e;
}
function Ie() {
	return Fe(/* @__PURE__ */ un(D));
}
function O(e) {
	if (E) {
		if (/* @__PURE__ */ un(D) !== null) throw je(), De;
		D = e;
	}
}
function Le(e = 1) {
	if (E) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ un(n);
		D = n;
	}
}
function Re(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ un(n);
		e && n.remove(), n = i;
	}
}
function ze(e) {
	if (!e || e.nodeType !== 8) throw je(), De;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Be(e) {
	return e === this.v;
}
function Ve(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function He(e) {
	return !Ve(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
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
		r: R,
		l: null
	};
}
function Ke(e) {
	var t = Ue, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) En(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ue = t.p, e ?? {};
}
function qe() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Je = [];
function Ye() {
	var e = Je;
	Je = [], h(e);
}
function Xe(e) {
	if (Je.length === 0 && !Ot) {
		var t = Je;
		queueMicrotask(() => {
			t === Je && Ye();
		});
	}
	Je.push(e);
}
function Ze() {
	for (; Je.length > 0;) Ye();
}
function Qe(e) {
	var t = R;
	if (t === null) return L.f |= ae, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	$e(e, t);
}
function $e(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128) {
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
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var et = ~(v | y | _);
function tt(e, t) {
	e.f = e.f & et | t;
}
function nt(e) {
	e.f & 512 || e.deps === null ? tt(e, _) : tt(e, y);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function rt(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= T, rt(t.deps));
}
function it(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), rt(e.deps), tt(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var at = !1;
function ot(e) {
	var t = at;
	try {
		return at = !1, [e(), at];
	} finally {
		at = t;
	}
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function st(e) {
	let t = 0, n = qt(0), r;
	return () => {
		Cn() && (z(n), An(() => (t === 0 && (r = _r(() => e(() => Zt(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, Zt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ct = w | ee;
function lt(e, t, n, r) {
	new ut(e, t, n, r);
}
var ut = class {
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
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = st(() => (this.#m = qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = R;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = R.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = jn(() => {
			if (E) {
				let e = this.#t;
				Ie();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#v() : this.#g();
			} else this.#y();
		}, ct), E && (this.#e = D);
	}
	#g() {
		try {
			this.#a = Mn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed;
		t && (this.#s = Mn(() => {
			t(this.#e, () => e, () => () => {});
		}));
	}
	#v() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Mn(() => e(this.#e)), Xe(() => {
			var e = this.#c = document.createDocumentFragment(), t = cn();
			e.append(t), this.#a = this.#x(() => Mn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, zn(this.#o, () => {
				this.#o = null;
			}), this.#b(A));
		}));
	}
	#y() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Mn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Un(this.#a, e);
				let t = this.#n.pending;
				this.#o = Mn(() => t(this.#e));
			} else this.#b(A);
		} catch (e) {
			this.error(e);
		}
	}
	#b(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		it(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#x(e) {
		var t = R, n = L, r = Ue;
		Xn(this.#i), Yn(this.#i), We(this.#i.ctx);
		try {
			return Pt.ensure(), e();
		} catch (e) {
			return Qe(e), null;
		} finally {
			Xn(t), Yn(n), We(r);
		}
	}
	#S(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#S(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#b(t), this.#o && zn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#S(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Xe(() => {
			this.#d = !1, this.#m && Yt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), z(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#C(e);
		})) : this.#C(e);
	}
	#C(e) {
		this.#a &&= (In(this.#a), null), this.#o &&= (In(this.#o), null), this.#s &&= (In(this.#s), null), E && (Fe(this.#t), Le(), Fe(Re()));
		var t = this.#n.onerror;
		let n = this.#n.failed;
		var r = !1, i = !1;
		let a = () => {
			if (r) {
				Ne();
				return;
			}
			r = !0, i && Ee(), this.#s !== null && zn(this.#s, () => {
				this.#s = null;
			}), this.#x(() => {
				this.#y();
			});
		}, o = (e) => {
			try {
				i = !0, t?.(e, a), i = !1;
			} catch (e) {
				$e(e, this.#i && this.#i.parent);
			}
			n && (this.#s = this.#x(() => {
				try {
					return Mn(() => {
						var t = R;
						t.b = this, t.f |= 128, n(this.#e, () => e, () => a);
					});
				} catch (e) {
					return $e(e, this.#i.parent), null;
				}
			}));
		};
		Xe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				$e(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(o, (e) => $e(e, this.#i && this.#i.parent)) : o(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function dt(e, t, n, r) {
	let i = qe() ? ht : vt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = R, c = ft(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				$e(e, s);
			}
			pt();
		}
	}
	var d = mt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ _t(e))).then(u).catch((e) => $e(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), pt();
	}) : f();
}
function ft() {
	var e = R, t = L, n = Ue, r = A;
	return function(i = !0) {
		Xn(e), Yn(t), We(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function pt(e = !0) {
	Xn(null), Yn(null), We(null), e && A?.deactivate();
}
function mt() {
	var e = R, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ht(e) {
	var t = 2 | v;
	return R !== null && (R.f |= ee), {
		ctx: Ue,
		deps: null,
		effects: null,
		equals: Be,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: Oe,
		wv: 0,
		parent: R,
		ac: null
	};
}
var gt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function _t(e, t, n) {
	let r = R;
	r === null && ge();
	var i = void 0, a = qt(Oe), o = !L, s = /* @__PURE__ */ new Set();
	return kn(() => {
		var t = R, n = g();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== me && n.reject(e);
			}).finally(pt);
		} catch (e) {
			n.reject(e), pt();
		}
		var c = A;
		if (o) {
			if (t.f & 32768) var l = mt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(gt);
			else for (let e of s.values()) e.reject(gt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== gt && (c.activate(), t ? (a.f |= ae, Yt(a, t)) : (a.f & 8388608 && (a.f ^= ae), Yt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), wn(() => {
		for (let e of s) e.reject(gt);
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
	let t = /* @__PURE__ */ ht(e);
	return Qn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function vt(e) {
	let t = /* @__PURE__ */ ht(e);
	return t.equals = He, t;
}
function yt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) In(t[n]);
	}
}
function bt(e) {
	var t, n = R, r = e.parent;
	if (!Kn && r !== null && e.v !== Oe && r.f & 24576) return Ae(), e.v;
	Xn(r);
	try {
		e.f &= ~T, yt(e), t = ur(e);
	} finally {
		Xn(n);
	}
	return t;
}
function xt(e) {
	var t = bt(e);
	if (!e.equals(t) && (e.wv = sr(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), Tt?.capture(e, t, !0)), e.deps === null))) {
		tt(e, _);
		return;
	}
	Kn || (Et === null ? nt(e) : (Cn() || A?.is_fork) && Et.set(e, t));
}
function St(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(me), t.fn !== null && (t.teardown = m), t.ac = null, fr(t, 0), Pn(t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && pr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var wt = null, A = null, Tt = null, Et = null, Dt = null, Ot = !1, kt = !1, At = null, jt = null, Mt = 0, Nt = 1, Pt = class e {
	id = Nt++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		wt === null ? wt = this : (wt.#n = this, this.#t = wt), wt = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) tt(r, v), t(r);
			for (r of n.m) tt(r, y), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Mt++ > 1e3 && (this.#x(), It());
		for (let e of this.#u) this.#d.delete(e), tt(e, v), this.schedule(e);
		for (let e of this.#d) tt(e, y), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = At = [], r = [], i = jt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Ut(e), this.#h() || this.discard(), t;
		}
		if (A = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (At = null, jt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ht(e, t);
			i.length > 0 && A.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Tt = this, Rt(r), Rt(n), Tt = null, this.#s?.resolve();
		var s = A;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= _;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = (i & 96) != 0;
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= _ : i & 4 ? t.push(r) : cr(r) && (i & 16 && this.#d.add(r), pr(r));
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
	#v() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#y(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), tt(i, v), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), A = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) it(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== Oe && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Et?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, Et = null;
	}
	flush() {
		try {
			kt = !0, A = this, this.#g();
		} finally {
			Mt = 0, Dt = null, At = null, jt = null, kt = !1, A = null, Et = null, Gt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(gt);
		this.#x(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, Xe(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= g()).promise;
	}
	static ensure() {
		if (A === null) {
			let t = A = new e();
			!kt && !Ot && Xe(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		Et = null;
	}
	schedule(e) {
		if (Dt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (At !== null && t === R && (L === null || !(L.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= _;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? wt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ft(e) {
	var t = Ot;
	Ot = !0;
	try {
		var n;
		for (e && (A !== null && !A.is_fork && A.flush(), n = e());;) {
			if (Ze(), A === null) return n;
			A.flush();
		}
	} finally {
		Ot = t;
	}
}
function It() {
	try {
		xe();
	} catch (e) {
		$e(e, Dt);
	}
}
var Lt = null;
function Rt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && cr(r) && (Lt = /* @__PURE__ */ new Set(), pr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Rn(r), Lt?.size > 0)) {
				Gt.clear();
				for (let e of Lt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Lt.has(n) && (Lt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || pr(n);
					}
				}
				Lt.clear();
			}
		}
		Lt = null;
	}
}
function zt(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? zt(i, t, n, r) : e & 4194320 && !(e & 2048) && Bt(i, t, r) && (tt(i, v), Vt(i));
	}
}
function Bt(e, t, n) {
	let r = n.get(e);
	if (r !== void 0) return r;
	if (e.deps !== null) for (let r of e.deps) {
		if (a.call(t, r)) return !0;
		if (r.f & 2 && Bt(r, t, n)) return n.set(r, !0), !0;
	}
	return n.set(e, !1), !1;
}
function Vt(e) {
	A.schedule(e);
}
function Ht(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), tt(e, _);
		for (var n = e.first; n !== null;) Ht(n, t), n = n.next;
	}
}
function Ut(e) {
	tt(e, _);
	for (var t = e.first; t !== null;) Ut(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Wt = /* @__PURE__ */ new Set(), Gt = /* @__PURE__ */ new Map(), Kt = !1;
function qt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Be,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function j(e, t) {
	let n = qt(e, t);
	return Qn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Jt(e, t = !1, n = !0) {
	let r = qt(e);
	return t || (r.equals = He), r;
}
function M(e, t, n = !1) {
	return L !== null && (!Jn || L.f & 131072) && qe() && L.f & 4325394 && (Zn === null || !Zn.has(e)) && Te(), Yt(e, n ? $t(t) : t, jt);
}
function Yt(e, t, n = null) {
	if (!e.equals(t)) {
		Gt.set(e, Kn ? t : e.v);
		var r = Pt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && bt(t), Et === null && nt(t);
		}
		e.wv = sr(), Qt(e, v, n), qe() && R !== null && R.f & 1024 && !(R.f & 96) && (tr === null ? nr([e]) : tr.push(e)), !r.is_fork && Wt.size > 0 && !Kt && Xt();
	}
	return t;
}
function Xt() {
	Kt = !1;
	for (let e of Wt) {
		e.f & 1024 && tt(e, y);
		let t;
		try {
			t = cr(e);
		} catch {
			t = !0;
		}
		t && pr(e);
	}
	Wt.clear();
}
function Zt(e) {
	M(e, e.v + 1);
}
function Qt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = qe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === R)) {
			var l = (c & v) === 0;
			if (l && tt(s, t), c & 131072) Wt.add(s);
			else if (c & 2) {
				var u = s;
				Et?.delete(u), c & 65536 || (c & 512 && (R === null || !(R.f & 2097152)) && (s.f |= T), Qt(u, y, n));
			} else if (l) {
				var d = s;
				c & 16 && Lt !== null && Lt.add(d), n === null ? Vt(d) : n.push(d);
			}
		}
	}
}
function $t(e) {
	if (typeof e != "object" || !e || oe in e) return e;
	let t = f(e);
	if (t !== u && t !== d) return e;
	var n = /* @__PURE__ */ new Map(), i = r(e), a = /* @__PURE__ */ j(0), o = null, s = ar, l = (e) => {
		if (ar === s) return e();
		var t = L, n = ar;
		Yn(null), or(s);
		var r = e();
		return Yn(t), or(n), r;
	};
	return i && n.set("length", /* @__PURE__ */ j(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && Ce();
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
					let e = l(() => /* @__PURE__ */ j(Oe, o));
					n.set(t, e), Zt(a);
				}
			} else M(r, Oe), Zt(a);
			return !0;
		},
		get(t, r, i) {
			if (r === oe) return e;
			var a = n.get(r), s = r in t;
			if (a === void 0 && (!s || c(t, r)?.writable) && (a = l(() => /* @__PURE__ */ j($t(s ? t[r] : Oe), o)), n.set(r, a)), a !== void 0) {
				var u = z(a);
				return u === Oe ? void 0 : u;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var r = Reflect.getOwnPropertyDescriptor(e, t);
			if (r && "value" in r) {
				var i = n.get(t);
				i && (r.value = z(i));
			} else if (r === void 0) {
				var a = n.get(t), o = a?.v;
				if (a !== void 0 && o !== Oe) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === oe) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== Oe || Reflect.has(e, t);
			return (r !== void 0 || R !== null && (!i || c(e, t)?.writable)) && (r === void 0 && (r = l(() => /* @__PURE__ */ j(i ? $t(e[t]) : Oe, o)), n.set(t, r)), z(r) === Oe) ? !1 : i;
		},
		set(e, t, r, s) {
			var u = n.get(t), d = t in e;
			if (i && t === "length") for (var f = r; f < u.v; f += 1) {
				var p = n.get(f + "");
				p === void 0 ? f in e && (p = l(() => /* @__PURE__ */ j(Oe, o)), n.set(f + "", p)) : M(p, Oe);
			}
			if (u === void 0) (!d || c(e, t)?.writable) && (u = l(() => /* @__PURE__ */ j(void 0, o)), M(u, $t(r)), n.set(t, u));
			else {
				d = u.v !== Oe;
				var m = l(() => $t(r));
				M(u, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, r), !d) {
				if (i && typeof t == "string") {
					var g = n.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && M(g, _ + 1);
				}
				Zt(a);
			}
			return !0;
		},
		ownKeys(e) {
			z(a);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== Oe;
			});
			for (var [r, i] of n) i.v !== Oe && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			we();
		}
	});
}
function en(e) {
	try {
		if (typeof e == "object" && e && oe in e) return e[oe];
	} catch {}
	return e;
}
function tn(e, t) {
	return Object.is(en(e), en(t));
}
var nn, rn, an, on;
function sn() {
	if (nn === void 0) {
		nn = window, rn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		an = c(t, "firstChild").get, on = c(t, "nextSibling").get, p(e) && (e[ue] = void 0, e[le] = null, e[de] = void 0, e.__e = void 0), p(n) && (n[fe] = void 0);
	}
}
function cn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ln(e) {
	return an.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function un(e) {
	return on.call(e);
}
function N(e, t) {
	if (!E) return /* @__PURE__ */ ln(e);
	var n = /* @__PURE__ */ ln(D);
	if (n === null) n = D.appendChild(cn());
	else if (t && n.nodeType !== 3) {
		var r = cn();
		return n?.before(r), Fe(r), r;
	}
	return t && mn(n), Fe(n), n;
}
function P(e, t = !1) {
	if (!E) {
		var n = /* @__PURE__ */ ln(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ un(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = cn();
			return D?.before(r), Fe(r), r;
		}
		mn(D);
	}
	return D;
}
function F(e, t = 1, n = !1) {
	let r = E ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ un(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = cn();
			return r === null ? i?.after(a) : r.before(a), Fe(a), a;
		}
		mn(r);
	}
	return Fe(r), r;
}
function dn(e) {
	e.textContent = "";
}
function fn() {
	return !1;
}
function pn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function mn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function hn(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, Xe(() => {
			document.activeElement === t && e.focus();
		});
	}
}
var gn = !1;
function _n() {
	gn || (gn = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[pe]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function vn(e) {
	var t = L, n = R;
	Yn(null), Xn(null);
	try {
		return e();
	} finally {
		Yn(t), Xn(n);
	}
}
function yn(e, t, n, r = n) {
	e.addEventListener(t, () => vn(n));
	let i = e[pe];
	i ? e[pe] = () => {
		i(), r(!0);
	} : e[pe] = () => r(!0), _n();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function bn(e) {
	R === null && (L === null && be(e), ye()), Kn && ve(e);
}
function xn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Sn(e, t) {
	var n = R;
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
	if (e & 4) At === null ? Pt.ensure().schedule(r) : At.push(r);
	else if (t !== null) {
		try {
			pr(r);
		} catch (e) {
			throw In(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= w));
	}
	if (i !== null && (i.parent = n, n !== null && xn(i, n), L !== null && L.f & 2 && !(e & 64))) {
		var a = L;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Cn() {
	return L !== null && !Jn;
}
function wn(e) {
	let t = Sn(8, null);
	return tt(t, _), t.teardown = e, t;
}
function Tn(e) {
	bn("$effect");
	var t = R.f;
	if (!L && t & 32 && Ue !== null && !Ue.i) {
		var n = Ue;
		(n.e ??= []).push(e);
	} else return En(e);
}
function En(e) {
	return Sn(4 | te, e);
}
function Dn(e) {
	Pt.ensure();
	let t = Sn(64 | ee, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? zn(t, () => {
			In(t), n(void 0);
		}) : (In(t), n(void 0));
	});
}
function On(e) {
	return Sn(4, e);
}
function kn(e) {
	return Sn(ie | ee, e);
}
function An(e, t = 0) {
	return Sn(8 | t, e);
}
function I(e, t = [], n = [], r = []) {
	dt(r, t, n, (t) => {
		Sn(8, () => {
			e(...t.map(z));
		});
	});
}
function jn(e, t = 0) {
	return Sn(16 | t, e);
}
function Mn(e) {
	return Sn(32 | ee, e);
}
function Nn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Kn, n = L;
		qn(!0), Yn(null);
		try {
			t.call(null);
		} finally {
			qn(e), Yn(n);
		}
	}
}
function Pn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && vn(() => {
			e.abort(me);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : In(n, t), n = r;
	}
}
function Fn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || In(t), t = n;
	}
}
function In(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Ln(e.nodes.start, e.nodes.end), n = !0), e.f |= C, Pn(e, t && !n), fr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Nn(e), e.f ^= C, e.f |= x;
	var i = e.parent;
	i !== null && i.first !== null && Rn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Ln(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ un(e);
		e.remove(), e = n;
	}
}
function Rn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function zn(e, t, n = !0) {
	var r = [];
	Bn(e, r, !0);
	var i = () => {
		n && In(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Bn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= b;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = (i.f & 65536) != 0 || (i.f & 32) != 0 && (e.f & 16) != 0;
				Bn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Vn(e) {
	Hn(e, !0);
}
function Hn(e, t) {
	if (e.f & 8192) {
		e.f ^= b, e.f & 1024 || (tt(e, v), Pt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = (n.f & 65536) != 0 || (n.f & 32) != 0;
			Hn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Un(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ un(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Wn = null, Gn = !1, Kn = !1;
function qn(e) {
	Kn = e;
}
var L = null, Jn = !1;
function Yn(e) {
	L = e;
}
var R = null;
function Xn(e) {
	R = e;
}
var Zn = null;
function Qn(e) {
	L !== null && (Zn ??= /* @__PURE__ */ new Set()).add(e);
}
var $n = null, er = 0, tr = null;
function nr(e) {
	tr = e;
}
var rr = 1, ir = 0, ar = ir;
function or(e) {
	ar = e;
}
function sr() {
	return ++rr;
}
function cr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~T), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (cr(a) && xt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Et === null && tt(e, _);
	}
	return !1;
}
function lr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Zn !== null && Zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? lr(a, t, !1) : t === a && (n ? tt(a, v) : a.f & 1024 && tt(a, y), Vt(a));
	}
}
function ur(e) {
	var t = $n, n = er, r = tr, i = L, a = Zn, o = Ue, s = Jn, c = ar, l = e.f;
	$n = null, er = 0, tr = null, L = l & 96 ? null : e, Zn = null, We(e.ctx), Jn = !1, ar = ++ir, e.ac !== null && (vn(() => {
		e.ac.abort(me);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= S;
		var f = e.deps, p = A?.is_fork;
		if ($n !== null) {
			var m;
			if (p || fr(e, er), f !== null && er > 0) for (f.length = er + $n.length, m = 0; m < $n.length; m++) f[er + m] = $n[m];
			else e.deps = f = $n;
			if (Cn() && e.f & 512) for (m = er; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && er < f.length && (fr(e, er), f.length = er);
		if (qe() && tr !== null && !Jn && f !== null && !(e.f & 6146)) for (m = 0; m < tr.length; m++) lr(tr[m], e);
		if (i !== null && i !== e) {
			if (ir++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ir;
			if (t !== null) for (let e of t) e.rv = ir;
			tr !== null && (r === null ? r = tr : r.push(...tr));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (e) {
		return Qe(e);
	} finally {
		e.f ^= re, $n = t, er = n, tr = r, L = i, Zn = a, We(o), Jn = s, ar = c;
	}
}
function dr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = i.call(n, e);
		if (r !== -1) {
			var o = n.length - 1;
			o === 0 ? n = t.reactions = null : (n[r] = n[o], n.pop());
		}
	}
	if (n === null && t.f & 2 && ($n === null || !a.call($n, t))) {
		var s = t;
		s.f & 512 && (s.f ^= 512, s.f &= ~T), s.v !== Oe && nt(s), St(s), fr(s, 0);
	}
}
function fr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) dr(e, n[r]);
}
function pr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		tt(e, _);
		var n = R, r = Gn;
		R = e, Gn = !0;
		try {
			t & 16777232 ? Fn(e) : Pn(e), Nn(e);
			var i = ur(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = rr;
		} finally {
			Gn = r, R = n;
		}
	}
}
async function mr() {
	await Promise.resolve(), Ft();
}
function z(e) {
	var t = (e.f & 2) != 0;
	if (Wn?.add(e), L !== null && !Jn && !(R !== null && R.f & 16384) && (Zn === null || !Zn.has(e))) {
		var n = L.deps;
		if (L.f & 2097152) e.rv < ir && (e.rv = ir, $n === null && n !== null && n[er] === e ? er++ : $n === null ? $n = [e] : $n.push(e));
		else {
			L.deps ??= [], a.call(L.deps, e) || L.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [L] : a.call(r, L) || r.push(L);
		}
	}
	if (Kn && Gt.has(e)) return Gt.get(e);
	if (t) {
		var i = e;
		if (Kn) {
			var o = i.v;
			return (!(i.f & 1024) && i.reactions !== null || gr(i)) && (o = bt(i)), Gt.set(i, o), o;
		}
		var s = (i.f & 512) == 0 && !Jn && L !== null && (Gn || (L.f & 512) != 0), c = (i.f & S) === 0;
		cr(i) && (s && (i.f |= 512), xt(i)), s && !c && (Ct(i), hr(i));
	}
	if (Et?.has(e)) return Et.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function hr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Ct(t), hr(t));
}
function gr(e) {
	if (e.v === Oe) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Gt.has(t) || t.f & 2 && gr(t)) return !0;
	return !1;
}
function _r(e) {
	var t = Jn;
	try {
		return Jn = !0, e();
	} finally {
		Jn = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var vr = ["touchstart", "touchmove"];
function yr(e) {
	return vr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var br = Symbol("events"), xr = /* @__PURE__ */ new Set(), Sr = /* @__PURE__ */ new Set();
function Cr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Dr.call(t, e), !e.cancelBubble) return vn(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Xe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function wr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Cr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && wn(() => {
		t.removeEventListener(e, o, a);
	});
}
function B(e, t, n) {
	(t[br] ??= {})[e] = n;
}
function Tr(e) {
	for (var t = 0; t < e.length; t++) xr.add(e[t]);
	for (var n of Sr) n(e);
}
var Er = null;
function Dr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Er = e;
	var o = 0, c = Er === e && e[br];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[br] = t;
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
		var d = L, f = R;
		Yn(null), Xn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[br]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
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
			e[br] = t, delete e.currentTarget, Yn(d), Xn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Or = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function kr(e) {
	return Or?.createHTML(e) ?? e;
}
function Ar(e) {
	var t = pn("template");
	return t.innerHTML = kr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function jr(e, t) {
	var n = R;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function V(e, t) {
	var n = (t & 1) != 0, r = (t & 2) != 0, i, a = !e.startsWith("<!>");
	return () => {
		if (E) return jr(D, null), D;
		i === void 0 && (i = Ar(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ ln(i)));
		var t = r || rn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ ln(t), s = t.lastChild;
			jr(o, s);
		} else jr(t, t);
		return t;
	};
}
function Mr() {
	if (E) return jr(D, null), D;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = cn();
	return e.append(t, n), jr(t, n), e;
}
function H(e, t) {
	if (E) {
		var n = R;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = D), Ie();
		return;
	}
	e !== null && e.before(t);
}
function U(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[fe] ??= e.nodeValue) && (e[fe] = n, e.nodeValue = `${n}`);
}
function Nr(e, t) {
	return Fr(e, t);
}
var Pr = /* @__PURE__ */ new Map();
function Fr(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: s = !0, transformError: c }) {
	sn();
	var l = void 0, u = Dn(() => {
		var s = n ?? t.appendChild(cn());
		lt(s, { pending: () => {} }, (t) => {
			Ge({});
			var n = Ue;
			if (a && (n.c = a), i && (r.$$events = i), E && jr(t, null), l = e(t, r) || {}, E && (R.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw je(), De;
			Ke();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = yr(r);
					for (let e of [t, document]) {
						var a = Pr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Pr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Dr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(o(xr)), Sr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Pr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Dr), r.delete(e), r.size === 0 && Pr.delete(n)) : r.set(e, i);
			}
			Sr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Ir.set(l, u), l;
}
var Ir = /* @__PURE__ */ new WeakMap();
function Lr(e, t) {
	let n = Ir.get(e);
	return n ? (Ir.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Rr = class {
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
			if (n) Vn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Vn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (In(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Un(r, t), t.append(cn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else In(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), zn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (In(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = fn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = cn();
			i.append(a), this.#n.set(e, {
				effect: Mn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Mn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else E && (this.anchor = D), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function W(e, t, n = !1) {
	var r;
	E && (r = D, Ie());
	var i = new Rr(e), a = n ? w : 0;
	function o(e, t) {
		if (E) {
			var n = ze(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Re();
				Fe(a), i.anchor = a, Pe(!1), i.ensure(e, t), Pe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	jn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function zr(e, t) {
	return t;
}
function Br(e, t, n) {
	for (var r = [], i = t.length, a, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		zn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Vr(e, o(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			dn(d), d.append(u), e.items.clear();
		}
		Vr(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Vr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, Un(a, document.createDocumentFragment())) : In(t[i], n);
	}
}
var Hr;
function Ur(e, t, n, i, a, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = E ? Fe(/* @__PURE__ */ ln(u)) : u.appendChild(cn());
	}
	E && Ie();
	var d = null, f = /* @__PURE__ */ vt(() => {
		var e = n();
		return r(e) ? e : e == null ? [] : o(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Gr(v, p, c, t, i), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ne, qr(d, null, c)) : Vn(d) : zn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: jn(() => {
			p = z(f);
			var e = p.length;
			let r = !1;
			E && ze(c) === "[!" != (e === 0) && (c = Re(), Fe(c), Pe(!1), r = !0);
			for (var o = /* @__PURE__ */ new Set(), u = A, v = fn(), y = 0; y < e; y += 1) {
				E && D.nodeType === 8 && D.data === "]" && (c = D, r = !0, Pe(!1));
				var b = p[y], x = i(b, y), S = h ? null : l.get(x);
				S ? (S.v && Yt(S.v, b), S.i && Yt(S.i, y), v && u.unskip_effect(S.e)) : (S = Kr(l, h ? c : Hr ??= cn(), b, x, y, a, t, n), h || (S.e.f |= ne), l.set(x, S)), o.add(x);
			}
			if (e === 0 && s && !d && (h ? d = Mn(() => s(c)) : (d = Mn(() => s(Hr ??= cn())), d.f |= ne)), e > o.size && _e("", "", ""), E && e > 0 && Fe(Re()), !h) if (m.set(u, o), v) {
				for (let [e, t] of l) o.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			r && Pe(!0), z(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, E && (c = D);
}
function Wr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Gr(e, t, n, r, i) {
	var a = (r & 8) != 0, s = t.length, c = e.items, l = Wr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Vn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ne, _ === l) qr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Jr(e, d, _), Jr(e, _, y), qr(_, y, n), d = _, p = [], m = [], l = Wr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) qr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Jr(e, S.prev, C.next), Jr(e, d, S), Jr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), qr(_, l, n), Jr(e, _.prev, _.next), Jr(e, _, d === null ? e.effect.first : d.next), Jr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Wr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Wr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Vr(e, o(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Wr(l.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && s === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			Br(e, w, te);
		}
	}
	a && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Kr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? qt(n) : /* @__PURE__ */ Jt(n, !1, !1) : null, l = o & 2 ? qt(i) : null;
	return {
		v: c,
		i: l,
		e: Mn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function qr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ un(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Jr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function Yr(e, t, ...n) {
	var r = new Rr(e);
	jn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, w);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Xr(e, t, n) {
	var r;
	E && (r = D, Ie());
	var i = new Rr(e);
	jn(() => {
		var e = t() ?? null;
		if (E && ze(r) === "[" != (e !== null)) {
			var a = Re();
			Fe(a), i.anchor = a, Pe(!1), i.ensure(e, e && ((t) => n(t, e))), Pe(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, w);
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Zr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = Zr(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function Qr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Zr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function $r(e) {
	return typeof e == "object" ? Qr(e) : e ?? "";
}
var ei = [..." 	\n\r\f\xA0\v﻿"];
function ti(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ei.includes(r[o - 1])) && (s === r.length || ei.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ni(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ri(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function ii(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ri)), i && c.push(...Object.keys(i).map(ri));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ri(e.substring(l, u).trim());
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
		return r && (n += ni(r)), i && (n += ni(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function ai(e, t, n, r, i, a) {
	var o = e[ue];
	if (E || o !== n || o === void 0) {
		var s = ti(n, r, a);
		(!E || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ue] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function oi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function si(e, t, n, r) {
	var i = e[de];
	if (E || i !== t) {
		var a = ii(t, r);
		(!E || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[de] = t;
	} else r && (Array.isArray(r) ? (oi(e, n?.[0], r[0]), oi(e, n?.[1], r[1], "important")) : oi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ci(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!r(t)) return Me();
		for (var i of e.options) i.selected = t.includes(di(i));
		return;
	}
	for (i of e.options) if (tn(di(i), t)) {
		i.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function li(e) {
	var t = new MutationObserver(() => {
		ci(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), wn(() => {
		t.disconnect();
	});
}
function ui(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	yn(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), di);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && di(o);
		}
		n(a), e.__value = a, A !== null && r.add(A);
	}), On(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = A;
			if (r.has(o)) return;
		}
		if (ci(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = di(s), n(a));
		}
		e.__value = a, i = !1;
	}), li(e);
}
function di(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var fi = Symbol("is custom element"), pi = Symbol("is html"), mi = he ? "link" : "LINK", hi = he ? "progress" : "PROGRESS";
function gi(e) {
	if (E) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					vi(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					vi(e, "checked", null), e.checked = r;
				}
			}
		};
		e[pe] = n, Xe(n), _n();
	}
}
function _i(e, t) {
	var n = yi(e);
	n.value === (n.value = t ?? void 0) || e.value === t && (t !== 0 || e.nodeName !== hi) || (e.value = t ?? "");
}
function vi(e, t, n, r) {
	var i = yi(e);
	E && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === mi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ce] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && xi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function yi(e) {
	return e[le] ??= {
		[fi]: e.nodeName.includes("-"),
		[pi]: e.namespaceURI === ke
	};
}
var bi = /* @__PURE__ */ new Map();
function xi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = bi.get(t);
	if (n) return n;
	bi.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = l(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = f(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Si(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	yn(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Ci(e) ? wi(a) : a, n(a), A !== null && r.add(A), await mr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (E && e.defaultValue !== e.value || _r(t) == null && e.value) && (n(Ci(e) ? wi(e.value) : e.value), A !== null && r.add(A)), An(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = A;
			if (r.has(i)) return;
		}
		Ci(e) && n === wi(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Ci(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function wi(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ti(e, t) {
	return e === t || e?.[oe] === t;
}
function Ei(e = {}, t, n, r) {
	var i = Ue.r, a = R;
	return On(() => {
		var o, s;
		return An(() => {
			o = s, s = r?.() || [], _r(() => {
				Ti(n(...s), e) || (t(e, ...s), o && Ti(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ti(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Di(e, t, n, r) {
	var i = !0, a = (n & 8) != 0, o = (n & 16) != 0, s = r, l = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ ht(r), z(u)) : (l && (l = !1, s = o ? _r(r) : r), s);
	let f;
	if (a) {
		var p = oe in e || se in e;
		f = c(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ot(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Se(t), f(m)));
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
	var v = !1, y = (n & 1 ? ht : vt)(() => (v = !1, g()));
	a && z(y);
	var b = R;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? z(y) : i && a ? $t(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Kn && v || b.f & 16384 ? y.v : z(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/introspection.ts
function Oi(e, t) {
	let n = [], r = 0, i = null, a = "";
	for (let o = 0; o < e.length; o++) {
		let s = e[o];
		if (i) {
			a += s, s === i && e[o - 1] !== "\\" && (i = null);
			continue;
		}
		if (s === "'" || s === "\"") {
			i = s, a += s;
			continue;
		}
		if ((s === "[" || s === "(" || s === "{") && r++, (s === "]" || s === ")" || s === "}") && r--, r === 0 && s === t && t.length === 1) {
			n.push(a), a = "";
			continue;
		}
		a += s;
	}
	return n.push(a), n;
}
function ki(e) {
	let t = e.trim();
	if (t === "None") return null;
	if (t === "True") return !0;
	if (t === "False") return !1;
	if (/^-?\d+$/.test(t)) return parseInt(t, 10);
	if (/^-?\d*\.\d+(e-?\d+)?$/i.test(t) || /^-?\d+e-?\d+$/i.test(t)) return parseFloat(t);
	let n = t.match(/^(['"])(.*)\1$/s);
	return n ? n[2] : t;
}
function Ai(e) {
	let t = (e ?? "").trim();
	if (!t) return { kind: "unknown" };
	let n = t.match(/^<class '([^']+)'>$/);
	if (n && (t = n[1]), t = t.replace(/^typing\./, ""), Oi(t, "|").length > 1) {
		let n = Oi(t, "|").map((e) => e.trim()), r = n.filter((e) => e !== "None" && e !== "NoneType"), i = r.length !== n.length, a = r.length === 1 ? Ai(r[0]) : {
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
				inner: Ai(n)
			};
			case "Literal": {
				let t = Oi(n, ",").map((e) => ki(e)).filter((e) => typeof e == "string" || typeof e == "number");
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
				item: Ai(Oi(n, ",")[0])
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
function ji(e) {
	if (!e) return [];
	let t = e.trim().replace(/^\(/, "").replace(/\)$/, "");
	if (!t.trim()) return [];
	let n = [];
	for (let e of Oi(t, ",")) {
		let t = e.trim();
		if (!t || t === "self" || t === "*" || t === "/" || t.startsWith("*")) continue;
		let r = Oi(t, "="), i = r[0].trim(), a = r.length > 1 ? r.slice(1).join("=").trim() : void 0, o = Oi(i, ":"), s = o[0].trim();
		if (!s || !/^\w+$/.test(s)) continue;
		let c = o.length > 1 ? o.slice(1).join(":").trim() : void 0;
		n.push({
			name: s,
			type: c ? Ai(c) : void 0,
			default: a === void 0 ? void 0 : ki(a)
		});
	}
	return n;
}
function Mi(e, t) {
	return e.kind === "unknown" ? t : e.kind === "optional" ? {
		kind: "optional",
		inner: Mi(e.inner, t)
	} : e.kind === "list" ? {
		kind: "list",
		item: Mi(e.item, t)
	} : e;
}
function Ni(e, t) {
	let n = Ai(e.type ?? "");
	if (e.fields?.length) {
		let t = e.fields.map((e) => Ni(e));
		n = Mi(n, {
			kind: "object",
			fields: t
		});
	}
	return {
		key: e.name,
		type: n,
		default: e.default ?? void 0,
		required: e.required ?? void 0,
		slot: t?.(e.name)
	};
}
function Pi(e, t, n) {
	let r = (t.config_fields ?? []).map((e) => Ni(e, n?.slotFor)), i = t.source_file ?? void 0, a = t.version_methods?.length ? t.version_methods.map((e) => ({
		name: e.name,
		doc: e.doc ?? void 0,
		signature: e.signature,
		params: ji(e.signature),
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
function Fi(e) {
	let t = [];
	for (let n of e) if (typeof n == "string") {
		let e = Li(n);
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
function Ii(e, t = (e, t) => t) {
	let n = [];
	for (let r of e) r.kind === "dict" ? Object.keys(r.value).length && n.push({ ...r.value }) : n.push(Ri(r.name, t(r.name, r.args)));
	return n;
}
function Li(e) {
	let t = e.match(/^~(\w+)(?:\((.*)\))?$/s);
	if (!t) return null;
	let n = {};
	if (t[2]?.trim()) for (let e of Oi(t[2], ",")) {
		let [t, ...r] = e.split("="), i = r.join("=").trim();
		if (!(!t.trim() || !i)) try {
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
function Ri(e, t) {
	let n = Object.entries(t).map(([e, t]) => `${e}=${typeof t == "string" ? `'${t}'` : JSON.stringify(t)}`);
	return n.length ? `~${e}(${n.join(", ")})` : `~${e}`;
}
function zi(e) {
	let t = [];
	for (let n of e) if (typeof n == "string") t.push(n);
	else for (let [e, r] of Object.entries(n)) t.push(`${e}=${typeof r == "string" && !/[\s"'{}[\],]/.test(r) ? r : JSON.stringify(r)}`);
	return t;
}
function Bi(e) {
	let t = Vi(e), n = 5381;
	for (let e = 0; e < t.length; e++) n = (n << 5) + n + t.charCodeAt(e) | 0;
	return (n >>> 0).toString(16).padStart(8, "0");
}
function Vi(e) {
	return typeof e != "object" || !e ? JSON.stringify(e) ?? "null" : Array.isArray(e) ? `[${e.map(Vi).join(",")}]` : `{${Object.keys(e).sort().map((t) => `${JSON.stringify(t)}:${Vi(e[t])}`).join(",")}}`;
}
//#endregion
//#region src/fields/util.ts
function Hi(e) {
	switch (e.kind) {
		case "str": return "";
		case "int":
		case "float": return 0;
		case "bool": return !1;
		case "enum": return e.options[0] ?? "";
		case "optional": return null;
		case "list": return [];
		case "object": return Object.fromEntries((e.fields ?? []).map((e) => [e.key, e.default ?? Hi(e.type)]));
		default: return null;
	}
}
function Ui(e) {
	switch (e.kind) {
		case "str": return "str";
		case "int": return "int";
		case "float": return "float";
		case "bool": return "bool";
		case "enum": return "Literal[…]";
		case "optional": return `${Ui(e.inner)} | None`;
		case "list": return `list[${Ui(e.item)}]`;
		case "object": return "dict";
		default: return e.annotation ?? "?";
	}
}
function Wi(e, t) {
	return JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
}
function Gi(e) {
	return e == null ? "null" : Array.isArray(e) ? `${e.length} item${e.length === 1 ? "" : "s"}` : typeof e == "object" ? `{ ${Object.keys(e).length} }` : String(e);
}
//#endregion
//#region src/fields/ObjectField.svelte
var Ki = /* @__PURE__ */ V("<div class=\"row svelte-yl9j08\"><span class=\"key mono svelte-yl9j08\"> </span> <!> <span class=\"cap mono svelte-yl9j08\"> </span></div>"), qi = /* @__PURE__ */ V("<input class=\"raw mono svelte-yl9j08\" type=\"text\"/>"), Ji = /* @__PURE__ */ V("<div class=\"body svelte-yl9j08\"><!></div>"), Yi = /* @__PURE__ */ V("<div><button class=\"head svelte-yl9j08\"><span class=\"disc svelte-yl9j08\"> </span> <span class=\"meta mono svelte-yl9j08\"> </span></button> <!></div>");
function Xi(e, t) {
	Ge(t, !0);
	let n = Di(t, "disabled", 3, !1), r = Di(t, "depth", 3, 0), i = /* @__PURE__ */ j(r() > 0), a = /* @__PURE__ */ k(() => t.value ?? {});
	function o(e, n) {
		t.onChange({
			...z(a),
			[e]: n
		});
	}
	let s = /* @__PURE__ */ j(""), c = /* @__PURE__ */ j(!1);
	Tn(() => {
		z(c) || M(s, JSON.stringify(z(a), null, 1).replace(/\n\s*/g, " "), !0);
	});
	function l(e) {
		M(s, e, !0), M(c, !0);
		try {
			let n = JSON.parse(e);
			n && typeof n == "object" && !Array.isArray(n) && (t.onChange(n), M(c, !1));
		} catch {}
	}
	var u = Yi();
	let d;
	var f = N(u), p = N(f), m = N(p, !0);
	O(p);
	var h = F(p, 2), g = N(h);
	O(h), O(f);
	var _ = F(f, 2), v = (e) => {
		var i = Ji(), c = N(i), u = (e) => {
			var i = Mr();
			Ur(P(i), 17, () => t.type.fields, (e) => e.key, (e, t) => {
				var i = Ki(), s = N(i), c = N(s, !0);
				O(s);
				var l = F(s, 2);
				{
					let e = /* @__PURE__ */ k(() => z(a)[z(t).key] ?? z(t).default ?? Hi(z(t).type)), i = /* @__PURE__ */ k(() => r() + 1);
					ua(l, {
						get type() {
							return z(t).type;
						},
						get value() {
							return z(e);
						},
						onChange: (e) => o(z(t).key, e),
						get disabled() {
							return n();
						},
						get depth() {
							return z(i);
						}
					});
				}
				var u = F(l, 2), d = N(u, !0);
				O(u), O(i), I((e) => {
					vi(s, "title", z(t).doc), U(c, z(t).key), U(d, e);
				}, [() => Ui(z(t).type)]), H(e, i);
			}), H(e, i);
		}, d = (e) => {
			var t = qi();
			gi(t), I(() => {
				_i(t, z(s)), t.disabled = n();
			}), B("input", t, (e) => l(e.currentTarget.value)), H(e, t);
		};
		W(c, (e) => {
			t.type.fields?.length ? e(u) : e(d, -1);
		}), O(i), H(e, i);
	};
	W(_, (e) => {
		z(i) && e(v);
	}), O(u), I((e) => {
		d = ai(u, 1, "obj svelte-yl9j08", null, d, { nested: r() > 0 }), U(m, z(i) ? "▾" : "▸"), U(g, `dict · ${e ?? ""}`);
	}, [() => Gi(z(a))]), B("click", f, () => M(i, !z(i))), H(e, u), Ke();
}
Tr(["click", "input"]);
//#endregion
//#region src/fields/ListField.svelte
var Zi = /* @__PURE__ */ V("<button class=\"rm svelte-1im9a9p\" title=\"remove\">×</button>"), Qi = /* @__PURE__ */ V("<div class=\"row svelte-1im9a9p\"><span class=\"grip svelte-1im9a9p\" title=\"reorder\"><button class=\"mv svelte-1im9a9p\" tabindex=\"-1\">▴</button> <button class=\"mv svelte-1im9a9p\" tabindex=\"-1\">▾</button></span> <span class=\"idx mono svelte-1im9a9p\"></span> <!> <!></div>"), $i = /* @__PURE__ */ V("<button class=\"add mono svelte-1im9a9p\"> </button>"), ea = /* @__PURE__ */ V("<div class=\"list svelte-1im9a9p\"><!> <!></div>");
function ta(e, t) {
	Ge(t, !0);
	let n = Di(t, "disabled", 3, !1), r = Di(t, "depth", 3, 0), i = /* @__PURE__ */ k(() => Array.isArray(t.value) ? t.value : []), a = /* @__PURE__ */ k(() => t.type.item.kind === "object" ? t.type.item.fields ?? [] : null);
	function o(e, n) {
		t.onChange(z(i).map((t, r) => r === e ? n : t));
	}
	function s(e, t, n) {
		o(e, {
			...z(i)[e] ?? {},
			[t]: n
		});
	}
	function c(e) {
		t.onChange(z(i).filter((t, n) => n !== e));
	}
	function l() {
		t.onChange([...z(i), Hi(t.type.item)]);
	}
	function u(e, n) {
		let r = e + n;
		if (r < 0 || r >= z(i).length) return;
		let a = [...z(i)];
		[a[e], a[r]] = [a[r], a[e]], t.onChange(a);
	}
	var d = ea(), f = N(d);
	Ur(f, 17, () => z(i), zr, (e, i, l) => {
		var d = Qi(), f = N(d), p = N(f), m = F(p, 2);
		O(f);
		var h = F(f, 2);
		h.textContent = l;
		var g = F(h, 2), _ = (e) => {
			var t = Mr();
			Ur(P(t), 17, () => z(a), (e) => e.key, (e, t) => {
				{
					let a = /* @__PURE__ */ k(() => z(i)?.[z(t).key] ?? z(t).default ?? Hi(z(t).type)), o = /* @__PURE__ */ k(() => r() + 1);
					ua(e, {
						get type() {
							return z(t).type;
						},
						get value() {
							return z(a);
						},
						onChange: (e) => s(l, z(t).key, e),
						get disabled() {
							return n();
						},
						get depth() {
							return z(o);
						}
					});
				}
			}), H(e, t);
		}, v = (e) => {
			{
				let a = /* @__PURE__ */ k(() => r() + 1);
				ua(e, {
					get type() {
						return t.type.item;
					},
					get value() {
						return z(i);
					},
					onChange: (e) => o(l, e),
					get disabled() {
						return n();
					},
					get depth() {
						return z(a);
					}
				});
			}
		};
		W(g, (e) => {
			z(a)?.length ? e(_) : e(v, -1);
		});
		var y = F(g, 2), b = (e) => {
			var t = Zi();
			B("click", t, () => c(l)), H(e, t);
		};
		W(y, (e) => {
			n() || e(b);
		}), O(d), I(() => {
			p.disabled = n(), m.disabled = n();
		}), B("click", p, () => u(l, -1)), B("click", m, () => u(l, 1)), H(e, d);
	});
	var p = F(f, 2), m = (e) => {
		var n = $i(), r = N(n);
		O(n), I((e) => U(r, `+ add ${e ?? ""}`), [() => Ui(t.type.item)]), B("click", n, l), H(e, n);
	};
	W(p, (e) => {
		n() || e(m);
	}), O(d), H(e, d), Ke();
}
Tr(["click"]);
//#endregion
//#region src/fields/FieldRenderer.svelte
var na = /* @__PURE__ */ V("<input class=\"fr-input mono svelte-10okn7m\" type=\"text\"/>"), ra = /* @__PURE__ */ V("<span><button class=\"fr-step svelte-10okn7m\" tabindex=\"-1\">−</button> <input class=\"fr-num mono svelte-10okn7m\" type=\"number\"/> <button class=\"fr-step svelte-10okn7m\" tabindex=\"-1\">+</button></span>"), ia = /* @__PURE__ */ V("<button role=\"switch\" aria-label=\"Toggle value\"><span class=\"fr-knob svelte-10okn7m\"></span></button> <span class=\"fr-boolval svelte-10okn7m\"> </span>", 1), aa = /* @__PURE__ */ V("<button> </button>"), oa = /* @__PURE__ */ V("<span></span>"), sa = /* @__PURE__ */ V("<span class=\"fr-none mono svelte-10okn7m\">None</span> <button class=\"fr-set mono svelte-10okn7m\">set value</button>", 1), ca = /* @__PURE__ */ V("<!> <button class=\"fr-clear mono svelte-10okn7m\" title=\"reset to None\">×</button>", 1), la = /* @__PURE__ */ V("<input class=\"fr-input fr-raw mono svelte-10okn7m\" type=\"text\"/>");
function ua(e, t) {
	Ge(t, !0);
	let n = Di(t, "disabled", 3, !1), r = Di(t, "depth", 3, 0);
	function i() {
		if (t.type.kind === "int") return 1;
		let e = Math.abs(Number(t.value) || 0);
		if (e === 0) return .1;
		let n = 10 ** Math.floor(Math.log10(e));
		return n / 10 >= .001 ? n / 10 : .001;
	}
	function a(e) {
		let n = i(), r = (Number(t.value) || 0) + e * n;
		t.onChange(t.type.kind === "int" ? Math.round(r) : Number(r.toPrecision(12)));
	}
	function o(e) {
		let n = e.currentTarget.value;
		n !== "" && t.onChange(t.type.kind === "int" ? Math.round(Number(n)) : Number(n));
	}
	let s = /* @__PURE__ */ j(""), c = /* @__PURE__ */ j(!1);
	Tn(() => {
		z(c) || M(s, t.value === void 0 ? "null" : JSON.stringify(t.value), !0);
	});
	function l(e) {
		M(s, e, !0), M(c, !0);
		try {
			t.onChange(JSON.parse(e)), M(c, !1);
		} catch {}
	}
	var u = Mr(), d = P(u), f = (e) => {
		var r = na();
		gi(r), I((e) => {
			_i(r, e), r.disabled = n();
		}, [() => String(t.value ?? "")]), B("input", r, (e) => t.onChange(e.currentTarget.value)), H(e, r);
	}, p = (e) => {
		var r = ra();
		let i;
		var s = N(r), c = F(s, 2);
		gi(c);
		var l = F(c, 2);
		O(r), I(() => {
			i = ai(r, 1, "fr-stepper svelte-10okn7m", null, i, { disabled: n() }), s.disabled = n(), _i(c, t.value ?? ""), c.disabled = n(), l.disabled = n();
		}), B("click", s, () => a(-1)), B("input", c, o), B("click", l, () => a(1)), H(e, r);
	}, m = (e) => {
		var r = ia(), i = P(r);
		let a;
		var o = F(i, 2), s = N(o, !0);
		O(o), I(() => {
			a = ai(i, 1, "fr-toggle svelte-10okn7m", null, a, { on: !!t.value }), i.disabled = n(), vi(i, "aria-checked", !!t.value), U(s, t.value ? "true" : "false");
		}), B("click", i, () => t.onChange(!t.value)), H(e, r);
	}, h = (e) => {
		var r = oa();
		let i;
		Ur(r, 20, () => t.type.options, (e) => e, (e, r) => {
			var i = aa();
			let a;
			var o = N(i, !0);
			O(i), I(() => {
				a = ai(i, 1, "fr-opt svelte-10okn7m", null, a, { on: t.value === r }), i.disabled = n(), U(o, r);
			}), B("click", i, () => t.onChange(r)), H(e, i);
		}), O(r), I(() => i = ai(r, 1, "fr-seg svelte-10okn7m", null, i, { disabled: n() })), H(e, r);
	}, g = (e) => {
		var i = Mr(), a = P(i), o = (e) => {
			var r = sa(), i = F(P(r), 2);
			I(() => i.disabled = n()), B("click", i, () => t.onChange(Hi(t.type.inner))), H(e, r);
		}, s = (e) => {
			var i = ca(), a = P(i);
			ua(a, {
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
			var o = F(a, 2);
			I(() => o.disabled = n()), B("click", o, () => t.onChange(null)), H(e, i);
		};
		W(a, (e) => {
			t.value === null || t.value === void 0 ? e(o) : e(s, -1);
		}), H(e, i);
	}, _ = (e) => {
		Xi(e, {
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
	}, v = (e) => {
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
	}, y = (e) => {
		var r = la();
		gi(r), I((e) => {
			_i(r, z(s)), r.disabled = n(), vi(r, "title", e);
		}, [() => t.type.kind === "unknown" ? t.type.annotation ?? "no schema" : Ui(t.type)]), B("input", r, (e) => l(e.currentTarget.value)), H(e, r);
	};
	W(d, (e) => {
		t.type.kind === "str" ? e(f) : t.type.kind === "int" || t.type.kind === "float" ? e(p, 1) : t.type.kind === "bool" ? e(m, 2) : t.type.kind === "enum" ? e(h, 3) : t.type.kind === "optional" ? e(g, 4) : t.type.kind === "object" ? e(_, 5) : t.type.kind === "list" ? e(v, 6) : e(y, -1);
	}), H(e, u), Ke();
}
Tr(["input", "click"]);
//#endregion
//#region src/VersionEditor.svelte
var da = /* @__PURE__ */ V("<button class=\"esrc mono svelte-10ggm8s\">&lt;/&gt;</button>"), fa = /* @__PURE__ */ V("<span class=\"ktype mono svelte-10ggm8s\"> </span>"), pa = /* @__PURE__ */ V("<div class=\"krow svelte-10ggm8s\"><span class=\"kname mono svelte-10ggm8s\"> </span> <!> <!> <button class=\"krm svelte-10ggm8s\" title=\"remove key\">×</button></div>"), ma = /* @__PURE__ */ V("<div class=\"kempty mono svelte-10ggm8s\">empty — add a field below</div>"), ha = /* @__PURE__ */ V("<button class=\"kfield mono svelte-10ggm8s\"> </button>"), ga = /* @__PURE__ */ V("<!> <div class=\"kadd svelte-10ggm8s\"><!> <input class=\"kfree mono svelte-10ggm8s\" placeholder=\"custom.key\"/></div>", 1), _a = /* @__PURE__ */ V("<div class=\"tdoc svelte-10ggm8s\"> </div>"), va = /* @__PURE__ */ V("<div class=\"krow svelte-10ggm8s\"><span class=\"kname mono svelte-10ggm8s\"> </span> <!> <!></div>"), ya = /* @__PURE__ */ V("<div class=\"kempty mono svelte-10ggm8s\">no arguments</div>"), ba = /* @__PURE__ */ V("<!> <!>", 1), xa = /* @__PURE__ */ V("<div class=\"ebody svelte-10ggm8s\"><!></div>"), Sa = /* @__PURE__ */ V("<div><div class=\"ehead svelte-10ggm8s\"><button class=\"etoggle svelte-10ggm8s\"><span class=\"eno mono svelte-10ggm8s\"></span> <span> </span></button> <span class=\"espacer svelte-10ggm8s\"></span> <!> <span class=\"emv svelte-10ggm8s\"><button class=\"mv svelte-10ggm8s\" title=\"move up\">▴</button> <button class=\"mv svelte-10ggm8s\" title=\"move down\">▾</button></span> <button class=\"erm svelte-10ggm8s\" title=\"remove\">×</button></div> <!></div>"), Ca = /* @__PURE__ */ V("<div class=\"kempty mono svelte-10ggm8s\">defaults — add overrides or a ~version</div>"), wa = /* @__PURE__ */ V("<button class=\"add mono svelte-10ggm8s\">+ ~version</button>"), Ta = /* @__PURE__ */ V("<span class=\"vdoc svelte-10ggm8s\"> </span>"), Ea = /* @__PURE__ */ V("<button class=\"vrow svelte-10ggm8s\"><span class=\"vname mono svelte-10ggm8s\"> </span> <!></button>"), Da = /* @__PURE__ */ V("<div class=\"vocab svelte-10ggm8s\"></div>"), Oa = /* @__PURE__ */ V("<div class=\"overlay svelte-10ggm8s\"><div class=\"modal svelte-10ggm8s\" role=\"dialog\" aria-label=\"version editor\"><div class=\"mhead svelte-10ggm8s\"><span class=\"mtitle mono svelte-10ggm8s\"> </span> <span class=\"mspacer svelte-10ggm8s\"></span> <button class=\"mclose svelte-10ggm8s\" title=\"cancel\">×</button></div> <div class=\"mbody svelte-10ggm8s\"><!> <div class=\"addbar svelte-10ggm8s\"><button class=\"add mono svelte-10ggm8s\"></button> <!></div> <!></div> <div class=\"mfoot svelte-10ggm8s\"><span class=\"mprev mono svelte-10ggm8s\" title=\"the compact version, as the CLI writes it\"> </span> <span class=\"mspacer svelte-10ggm8s\"></span> <button class=\"btn svelte-10ggm8s\">Cancel</button> <button class=\"btn primary svelte-10ggm8s\">Apply</button></div></div></div>");
function ka(e, t) {
	Ge(t, !0);
	let n = /* @__PURE__ */ j($t(Fi(t.version))), r = /* @__PURE__ */ j($t(z(n).length ? 0 : null)), i = /* @__PURE__ */ j(!1), a = /* @__PURE__ */ j(""), o = (e) => t.schema.versionMethods.find((t) => t.name === e), s = (e) => t.schema.fields.find((t) => t.key === e);
	function c(e, t) {
		let n = o(e);
		return Object.fromEntries(Object.entries(t).filter(([e, t]) => {
			let r = n?.params.find((t) => t.name === e);
			return r === void 0 || !Wi(t, r.default);
		}));
	}
	let l = /* @__PURE__ */ k(() => Ii(z(n), c));
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
		if (i < 0 || i >= z(n).length) return;
		let a = [...z(n)];
		[a[e], a[i]] = [a[i], a[e]], M(n, a, !0), z(r) === e ? M(r, i) : z(r) === i && M(r, e, !0);
	}
	function f(e) {
		M(n, z(n).filter((t, n) => n !== e), !0), z(r) === e ? M(r, null) : z(r) !== null && z(r) > e && M(r, z(r) - 1);
	}
	function p() {
		M(n, [...z(n), {
			kind: "dict",
			value: {}
		}], !0), M(r, z(n).length - 1);
	}
	function m(e) {
		let t = o(e), a = Object.fromEntries((t?.params ?? []).filter((e) => e.default !== void 0).map((e) => [e.name, e.default]));
		M(n, [...z(n), {
			kind: "token",
			name: e,
			args: a
		}], !0), M(i, !1), M(r, z(n).length - 1);
	}
	function h(e, t, r) {
		M(n, z(n).map((n, i) => i === e && n.kind === "dict" ? {
			kind: "dict",
			value: {
				...n.value,
				[t]: r
			}
		} : n), !0);
	}
	function g(e, t) {
		M(n, z(n).map((n, r) => {
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
		h(e, t, n ? n.default ?? Hi(n.type) : "");
	}
	function v(e) {
		let t = z(a).trim();
		t && (h(e, t, ""), M(a, ""));
	}
	function y(e) {
		return t.schema.fields.filter((t) => !(t.key in e.value));
	}
	function b(e, t, r) {
		M(n, z(n).map((n, i) => i === e && n.kind === "token" ? {
			kind: "token",
			name: n.name,
			args: {
				...n.args,
				[t]: r
			}
		} : n), !0);
	}
	let x = /* @__PURE__ */ k(() => z(l).map((e) => typeof e == "string" ? e : Object.entries(e).map(([e, t]) => `${e}=${typeof t == "string" ? t : JSON.stringify(t)}`).join(" ")).join(" ") || "defaults");
	var S = Oa(), C = N(S), w = N(C), ee = N(w), te = N(ee);
	O(ee);
	var ne = F(ee, 4);
	O(w);
	var T = F(w, 2), re = N(T);
	Ur(re, 17, () => z(n), zr, (e, n, i) => {
		var c = Sa();
		let l;
		var p = N(c), m = N(p), x = N(m);
		x.textContent = i + 1;
		var S = F(x, 2);
		let C;
		var w = N(S, !0);
		O(S), O(m);
		var ee = F(m, 4), te = (e) => {
			var r = da();
			B("click", r, () => t.onViewSource(o(z(n).name).sourceRef)), H(e, r);
		}, ne = /* @__PURE__ */ k(() => z(n).kind === "token" && o(z(n).name)?.sourceRef && t.onViewSource);
		W(ee, (e) => {
			z(ne) && e(te);
		});
		var T = F(ee, 2), re = N(T), ie = F(re, 2);
		O(T);
		var ae = F(T, 2);
		O(p);
		var oe = F(p, 2), se = (e) => {
			var t = xa(), r = N(t), c = (e) => {
				var t = ga(), r = P(t);
				Ur(r, 16, () => Object.keys(z(n).value), (e) => e, (e, t) => {
					let r = /* @__PURE__ */ k(() => s(t));
					var a = pa(), o = N(a), c = N(o, !0);
					O(o);
					var l = F(o, 2);
					{
						let e = /* @__PURE__ */ k(() => z(r)?.type ?? { kind: "unknown" });
						ua(l, {
							get type() {
								return z(e);
							},
							get value() {
								return z(n).value[t];
							},
							onChange: (e) => h(i, t, e)
						});
					}
					var u = F(l, 2), d = (e) => {
						var t = fa(), n = N(t, !0);
						O(t), I((e) => U(n, e), [() => Ui(z(r).type)]), H(e, t);
					};
					W(u, (e) => {
						z(r) && e(d);
					});
					var f = F(u, 2);
					O(a), I(() => U(c, t)), B("click", f, () => g(i, t)), H(e, a);
				}, (e) => {
					H(e, ma());
				});
				var o = F(r, 2), c = N(o);
				Ur(c, 17, () => y(z(n)), (e) => e.key, (e, t) => {
					var n = ha(), r = N(n);
					O(n), I(() => U(r, `+ ${z(t).key ?? ""}`)), B("click", n, () => _(i, z(t).key)), H(e, n);
				});
				var l = F(c, 2);
				gi(l), O(o), B("keydown", l, (e) => e.key === "Enter" && v(i)), Si(l, () => z(a), (e) => M(a, e)), H(e, t);
			}, l = (e) => {
				let t = /* @__PURE__ */ k(() => o(z(n).name));
				var r = ba(), a = P(r), s = (e) => {
					var n = _a(), r = N(n, !0);
					O(n), I(() => U(r, z(t).doc)), H(e, n);
				};
				W(a, (e) => {
					z(t)?.doc && e(s);
				}), Ur(F(a, 2), 17, () => z(t)?.params ?? [], (e) => e.name, (e, t) => {
					var r = va(), a = N(r), o = N(a, !0);
					O(a);
					var s = F(a, 2);
					{
						let e = /* @__PURE__ */ k(() => z(t).type ?? { kind: "unknown" }), r = /* @__PURE__ */ k(() => z(n).args[z(t).name] ?? z(t).default ?? null);
						ua(s, {
							get type() {
								return z(e);
							},
							get value() {
								return z(r);
							},
							onChange: (e) => b(i, z(t).name, e)
						});
					}
					var c = F(s, 2), l = (e) => {
						var n = fa(), r = N(n);
						O(n), I((e) => U(r, `def ${e ?? ""}`), [() => JSON.stringify(z(t).default)]), H(e, n);
					};
					W(c, (e) => {
						z(t).default !== void 0 && e(l);
					}), O(r), I(() => U(o, z(t).name)), H(e, r);
				}, (e) => {
					H(e, ya());
				}), H(e, r);
			};
			W(r, (e) => {
				z(n).kind === "dict" ? e(c) : e(l, -1);
			}), O(t), H(e, t);
		};
		W(oe, (e) => {
			z(r) === i && e(se);
		}), O(c), I((e) => {
			l = ai(c, 1, "elem svelte-10ggm8s", null, l, { openel: z(r) === i }), C = ai(S, 1, "echip mono svelte-10ggm8s", null, C, { dict: z(n).kind === "dict" }), U(w, e);
		}, [() => u(z(n))]), B("click", m, () => M(r, z(r) === i ? null : i, !0)), B("click", re, () => d(i, -1)), B("click", ie, () => d(i, 1)), B("click", ae, () => f(i)), H(e, c);
	}, (e) => {
		H(e, Ca());
	});
	var ie = F(re, 2), ae = N(ie);
	ae.textContent = "+ overrides {}";
	var oe = F(ae, 2), se = (e) => {
		var t = wa();
		B("click", t, () => M(i, !z(i))), H(e, t);
	};
	W(oe, (e) => {
		t.schema.versionMethods.length && e(se);
	}), O(ie);
	var ce = F(ie, 2), le = (e) => {
		var n = Da();
		Ur(n, 21, () => t.schema.versionMethods, (e) => e.name, (e, t) => {
			var n = Ea(), r = N(n), i = N(r);
			O(r);
			var a = F(r, 2), o = (e) => {
				var n = Ta(), r = N(n, !0);
				O(n), I((e) => U(r, e), [() => z(t).doc.split("\n")[0]]), H(e, n);
			};
			W(a, (e) => {
				z(t).doc && e(o);
			}), O(n), I(() => U(i, `~${z(t).name ?? ""}`)), B("click", n, () => m(z(t).name)), H(e, n);
		}), O(n), H(e, n);
	};
	W(ce, (e) => {
		z(i) && e(le);
	}), O(T);
	var ue = F(T, 2), de = N(ue), fe = N(de, !0);
	O(de);
	var pe = F(de, 4), me = F(pe, 2);
	O(ue), O(C), O(S), I(() => {
		U(te, `version · ${t.schema.module ?? ""}`), U(fe, z(x));
	}), B("click", S, function(...e) {
		t.onCancel?.apply(this, e);
	}), B("click", C, (e) => e.stopPropagation()), B("click", ne, function(...e) {
		t.onCancel?.apply(this, e);
	}), B("click", ae, p), B("click", pe, function(...e) {
		t.onCancel?.apply(this, e);
	}), B("click", me, () => t.onApply(z(l))), H(e, S), Ke();
}
Tr(["click", "keydown"]);
//#endregion
//#region src/ConfigPicker.svelte
var Aa = /* @__PURE__ */ V("<div class=\"skl svelte-8pl3d7\"><div class=\"skl-line svelte-8pl3d7\" style=\"width: 55%\"></div> <div class=\"skl-box svelte-8pl3d7\"></div> <div class=\"skl-box svelte-8pl3d7\" style=\"animation-delay: 0.15s\"></div></div>"), ja = /* @__PURE__ */ V("<span> </span>"), Ma = /* @__PURE__ */ V("<span class=\"defaults mono svelte-8pl3d7\">defaults</span>"), Na = /* @__PURE__ */ V("<button class=\"edit mono svelte-8pl3d7\">✎ edit</button>"), Pa = /* @__PURE__ */ V("<div class=\"doc svelte-8pl3d7\"> </div>"), Fa = /* @__PURE__ */ V("<span class=\"mdot svelte-8pl3d7\" title=\"changed from default\"></span>"), Ia = /* @__PURE__ */ V("<div class=\"ierr mono svelte-8pl3d7\"> </div>"), La = /* @__PURE__ */ V("<div><div class=\"slothead svelte-8pl3d7\"><span class=\"key mono svelte-8pl3d7\"> </span> <span class=\"slottag mono svelte-8pl3d7\"> </span> <!></div> <!> <!></div>"), Ra = /* @__PURE__ */ V("<div><span class=\"key mono svelte-8pl3d7\"> </span> <span> </span> <span class=\"cap2 mono svelte-8pl3d7\"> </span> <!></div> <!>", 1), za = /* @__PURE__ */ V("<div class=\"frow svelte-8pl3d7\"><span class=\"key mono svelte-8pl3d7\"> </span> <span class=\"val mono svelte-8pl3d7\"> </span></div>"), Ba = /* @__PURE__ */ V("<div class=\"empty mono svelte-8pl3d7\">no configurable fields — runs as-is</div>"), Va = /* @__PURE__ */ V("<div class=\"vrow svelte-8pl3d7\"><!> <!></div> <!> <div class=\"fields svelte-8pl3d7\"><!> <!> <!></div> <!>", 1), Ha = /* @__PURE__ */ V("<div class=\"cfg svelte-8pl3d7\"><!></div>");
function Ua(e, t) {
	Ge(t, !0);
	let n = Di(t, "version", 19, () => []), r = Di(t, "issues", 19, () => []), i = Di(t, "disabled", 3, !1), a = /* @__PURE__ */ j(null), o = /* @__PURE__ */ j($t([])), s = /* @__PURE__ */ j($t({})), c = /* @__PURE__ */ j(!1);
	Tn(() => {
		t.module;
		let e = _r(() => n()), r = !1;
		return t.adapter.introspect(t.module).then((n) => {
			r || (M(a, n, !0), M(o, e, !0), t.onVersion?.(e));
		}), () => r = !0;
	}), Tn(() => {
		JSON.stringify(z(o)), t.module;
		let e = !1, n = setTimeout(() => {
			t.adapter.resolve(t.module, z(o)).then((n) => {
				e || !n.ok || (M(s, n.config, !0), t.onValues?.({ ...n.config }));
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
		let n = Fi(z(o)), r = [...n].reverse().find((e) => e.kind === "dict");
		r && r.kind === "dict" ? r.value[e] = t : n.push({
			kind: "dict",
			value: { [e]: t }
		}), l(Ii(n));
	}
	let d = /* @__PURE__ */ k(() => new Set((z(a)?.fields ?? []).filter((e) => !Wi(z(s)[e.key], e.default ?? Hi(e.type))).map((e) => e.key))), f = /* @__PURE__ */ k(() => Fi(z(o))), p = /* @__PURE__ */ k(() => {
		let e = new Set((z(a)?.fields ?? []).map((e) => e.key));
		return Object.keys(z(s)).filter((t) => !e.has(t) && !t.startsWith("_"));
	});
	function m(e) {
		return e == null ? "None" : typeof e == "string" ? e === "" ? "\"\"" : e : JSON.stringify(e);
	}
	function h(e) {
		return r().find((t) => t.path === e || t.path?.startsWith(e + "."));
	}
	var g = Ha(), _ = N(g), v = (e) => {
		H(e, Aa());
	}, y = (e) => {
		var n = Va(), r = P(n), g = N(r);
		Ur(g, 17, () => z(f), zr, (e, t) => {
			var n = ja();
			let r;
			var i = N(n, !0);
			O(n), I((e) => {
				r = ai(n, 1, "chip mono svelte-8pl3d7", null, r, { dict: z(t).kind === "dict" }), U(i, e);
			}, [() => z(t).kind === "dict" ? `{ ${Object.keys(z(t).value).join(", ")} }` : `~${z(t).name}`]), H(e, n);
		}, (e) => {
			H(e, Ma());
		});
		var _ = F(g, 2), v = (e) => {
			var t = Na();
			B("click", t, () => M(c, !0)), H(e, t);
		};
		W(_, (e) => {
			i() || e(v);
		}), O(r);
		var y = F(r, 2), b = (e) => {
			var t = Pa(), n = N(t, !0);
			O(t), I((e) => U(n, e), [() => z(a).doc.split("\n\n")[0]]), H(e, t);
		};
		W(y, (e) => {
			z(a).doc && e(b);
		});
		var x = F(y, 2), S = N(x);
		Ur(S, 17, () => z(a).fields, (e) => e.key, (e, n) => {
			let r = /* @__PURE__ */ k(() => z(n).slot ? t.adapter.slots?.fields?.[z(n).slot] : void 0), a = /* @__PURE__ */ k(() => h(z(n).key));
			var o = Mr(), c = P(o), l = (e) => {
				var t = La();
				let o;
				var c = N(t), l = N(c), f = N(l, !0);
				O(l);
				var p = F(l, 2), m = N(p);
				O(p);
				var h = F(p, 2), g = (e) => {
					H(e, Fa());
				}, _ = /* @__PURE__ */ k(() => z(d).has(z(n).key));
				W(h, (e) => {
					z(_) && e(g);
				}), O(c);
				var v = F(c, 2);
				{
					let e = /* @__PURE__ */ k(() => String(z(s)[z(n).key] ?? ""));
					Xr(v, () => z(r), (t, r) => {
						r(t, {
							get value() {
								return z(e);
							},
							onChange: (e) => u(z(n).key, e),
							get disabled() {
								return i();
							}
						});
					});
				}
				var y = F(v, 2), b = (e) => {
					var t = Ia(), n = N(t, !0);
					O(t), I(() => U(n, z(a).message)), H(e, t);
				};
				W(y, (e) => {
					z(a) && e(b);
				}), O(t), I(() => {
					o = ai(t, 1, "slotcard svelte-8pl3d7", null, o, { bad: !!z(a) }), vi(l, "title", z(n).doc), U(f, z(n).key), U(m, `HOST SLOT · ${z(n).slot ?? ""}`);
				}), H(e, t);
			}, f = (e) => {
				var t = Ra(), r = P(t);
				let i;
				var o = N(r), c = N(o, !0);
				O(o);
				var l = F(o, 2);
				let u;
				var f = N(l, !0);
				O(l);
				var p = F(l, 2), h = N(p, !0);
				O(p);
				var g = F(p, 2), _ = (e) => {
					H(e, Fa());
				}, v = /* @__PURE__ */ k(() => z(d).has(z(n).key));
				W(g, (e) => {
					z(v) && e(_);
				}), O(r);
				var y = F(r, 2), b = (e) => {
					var t = Ia(), n = N(t, !0);
					O(t), I(() => U(n, z(a).message)), H(e, t);
				};
				W(y, (e) => {
					z(a) && e(b);
				}), I((e, t, s) => {
					i = ai(r, 1, "frow svelte-8pl3d7", null, i, { bad: !!z(a) }), vi(o, "title", z(n).doc), U(c, z(n).key), u = ai(l, 1, "val mono svelte-8pl3d7", null, u, e), U(f, t), U(h, s);
				}, [
					() => ({ isdef: !z(d).has(z(n).key) }),
					() => m(z(s)[z(n).key] ?? z(n).default ?? Hi(z(n).type)),
					() => Ui(z(n).type)
				]), H(e, t);
			};
			W(c, (e) => {
				z(r) ? e(l) : e(f, -1);
			}), H(e, o);
		});
		var C = F(S, 2);
		Ur(C, 16, () => z(p), (e) => e, (e, t) => {
			var n = za(), r = N(n), i = N(r, !0);
			O(r);
			var a = F(r, 2), o = N(a, !0);
			O(a), O(n), I((e) => {
				U(i, t), U(o, e);
			}, [() => m(z(s)[t])]), H(e, n);
		});
		var w = F(C, 2), ee = (e) => {
			H(e, Ba());
		};
		W(w, (e) => {
			!z(a).fields.length && !z(p).length && e(ee);
		}), O(x);
		var te = F(x, 2), ne = (e) => {
			ka(e, {
				get schema() {
					return z(a);
				},
				get version() {
					return z(o);
				},
				onApply: l,
				onCancel: () => M(c, !1),
				get onViewSource() {
					return t.onViewSource;
				}
			});
		};
		W(te, (e) => {
			z(c) && e(ne);
		}), H(e, n);
	};
	W(_, (e) => {
		z(a) ? e(y, -1) : e(v);
	}), O(g), H(e, g), Ke();
}
Tr(["click"]);
//#endregion
//#region src/ContextStack.svelte
var Wa = /* @__PURE__ */ V("<button class=\"lact mono svelte-94r51u\" title=\"reset — a fresh run instance\">↺ new run</button>"), Ga = /* @__PURE__ */ V("<span class=\"lmv svelte-94r51u\"><button class=\"mv svelte-94r51u\" title=\"move up\">▴</button> <button class=\"mv svelte-94r51u\" title=\"move down\">▾</button></span> <button class=\"lrm svelte-94r51u\" title=\"remove\">×</button>", 1), Ka = /* @__PURE__ */ V("<div class=\"lbody svelte-94r51u\"><!></div>"), qa = /* @__PURE__ */ V("<div role=\"group\"><div class=\"lhead svelte-94r51u\"><button class=\"ltoggle svelte-94r51u\"><span class=\"lno mono svelte-94r51u\"> </span> <span class=\"lname mono svelte-94r51u\"> </span> <span class=\"lsum mono svelte-94r51u\"> </span></button> <span class=\"lspacer svelte-94r51u\"></span> <!> <button class=\"lsrc mono svelte-94r51u\" title=\"view source\">&lt;/&gt;</button> <!></div> <!></div>"), Ja = /* @__PURE__ */ V("<div class=\"empty mono svelte-94r51u\" style=\"margin-left: 9px\">no context layers<br/><span class=\"emptysub svelte-94r51u\">→ runs in the ambient project</span></div>"), Ya = /* @__PURE__ */ V("<button class=\"mitem svelte-94r51u\"><span class=\"mname mono svelte-94r51u\"> </span> <span class=\"mhint svelte-94r51u\"> </span></button>"), Xa = /* @__PURE__ */ V("<button class=\"mitem svelte-94r51u\"><span class=\"mname mono svelte-94r51u\"> </span></button>"), Za = /* @__PURE__ */ V("<div class=\"msep mono svelte-94r51u\">any interface</div> <!>", 1), Qa = /* @__PURE__ */ V("<div class=\"menu svelte-94r51u\"><!> <!></div>"), $a = /* @__PURE__ */ V("<div class=\"addrow svelte-94r51u\"><button class=\"addbtn mono svelte-94r51u\">+ add context</button></div> <!>", 1), eo = /* @__PURE__ */ V("<div><div class=\"shead svelte-94r51u\"><span class=\"cap mono svelte-94r51u\">CONTEXT · with-stack</span> <span class=\"hint mono svelte-94r51u\">LIFO — enter top→down</span></div> <div class=\"env mono svelte-94r51u\"><span class=\"envk svelte-94r51u\">env</span> <span class=\"envm svelte-94r51u\">project</span> <span class=\"envv svelte-94r51u\"> </span> <span class=\"amb svelte-94r51u\">ambient</span></div> <!> <!></div>");
function to(e, t) {
	Ge(t, !0);
	let n = Di(t, "modules", 19, () => []), r = Di(t, "disabled", 3, !1), i = Di(t, "highlightId", 3, null), a = /* @__PURE__ */ j($t([])), o = /* @__PURE__ */ j(!1), s = () => Math.random().toString(36).slice(2, 8);
	async function c(e) {
		M(o, !1);
		let n = "Interface", r = e.split(".").at(-1) ?? e;
		try {
			let i = await t.adapter.introspect(e);
			n = i.kind ?? n, r = i.title ?? r;
		} catch {}
		M(a, [...z(a), {
			id: s(),
			module: e,
			title: r,
			kind: n,
			version: [],
			open: !0
		}], !0);
	}
	function l(e) {
		M(a, z(a).filter((t) => t.id !== e), !0);
	}
	function u(e, t) {
		let n = e + t;
		if (n < 0 || n >= z(a).length) return;
		let r = [...z(a)];
		[r[e], r[n]] = [r[n], r[e]], M(a, r, !0);
	}
	function d(e, t) {
		let n = z(a).find((t) => t.id === e);
		!n || JSON.stringify(n.version) === JSON.stringify(t) || M(a, z(a).map((n) => n.id === e ? {
			...n,
			version: t
		} : n), !0);
	}
	function f(e) {
		M(a, z(a).map((t) => t.id === e ? {
			...t,
			open: !t.open
		} : t), !0);
	}
	function p(e) {
		M(a, z(a).map((t) => t.id === e ? {
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
		let t = zi(e.version);
		return t.length ? t.join(" ") : "defaults";
	}
	let g = /* @__PURE__ */ k(() => {
		let e = [], t, n;
		for (let r of z(a)) r.kind === "Execution" && !t ? (t = {
			target: r.module,
			version: r.version
		}, n = r.id) : e.push({
			target: r.module,
			version: r.version
		});
		let r = z(a).map((e) => ({
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
	Tn(() => {
		let e = z(g), n = JSON.stringify(e);
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
	var b = eo();
	let x;
	var S = F(N(b), 2), C = F(N(S), 4), w = N(C, !0);
	O(C), Le(2), O(S);
	var ee = F(S, 2);
	Ur(ee, 19, () => z(a), (e) => e.id, (e, n, a) => {
		var o = qa();
		let s;
		var c = N(o), g = N(c), _ = N(g), v = N(_, !0);
		O(_);
		var y = F(_, 2), b = N(y, !0);
		O(y);
		var x = F(y, 2), S = N(x, !0);
		O(x), O(g);
		var C = F(g, 4), w = (e) => {
			var t = Wa();
			B("click", t, () => p(z(n).id)), H(e, t);
		};
		W(C, (e) => {
			z(n).kind === "Execution" && !r() && e(w);
		});
		var ee = F(C, 2), te = F(ee, 2), ne = (e) => {
			var t = Ga(), r = P(t), i = N(r), o = F(i, 2);
			O(r);
			var s = F(r, 2);
			B("click", i, () => u(z(a), -1)), B("click", o, () => u(z(a), 1)), B("click", s, () => l(z(n).id)), H(e, t);
		};
		W(te, (e) => {
			r() || e(ne);
		}), O(c);
		var T = F(c, 2), re = (e) => {
			var i = Ka();
			Ua(N(i), {
				get adapter() {
					return t.adapter;
				},
				get module() {
					return z(n).module;
				},
				get version() {
					return z(n).version;
				},
				get disabled() {
					return r();
				},
				onVersion: (e) => d(z(n).id, e),
				get onViewSource() {
					return t.onViewSource;
				}
			}), O(i), H(e, i);
		};
		W(T, (e) => {
			z(n).open && e(re);
		}), O(o), I((e, t) => {
			s = ai(o, 1, "layer svelte-94r51u", null, s, { hl: i() === z(n).id }), si(o, `margin-left: ${e ?? ""}px`), vi(g, "title", z(n).open ? "collapse" : "expand"), U(v, z(a) + 1), U(b, z(n).title), U(S, t);
		}, [() => Math.min(z(a), 5) * 16 + 9, () => z(n).kind === "Execution" ? "execution · runner" : h(z(n))]), wr("mouseenter", o, () => t.onHighlight?.(z(n).id)), wr("mouseleave", o, () => t.onHighlight?.(null)), B("click", g, () => f(z(n).id)), B("click", ee, () => m(z(n).module)), H(e, o);
	}, (e) => {
		H(e, Ja());
	});
	var te = F(ee, 2), ne = (e) => {
		var t = $a(), n = P(t), r = N(n);
		O(n);
		var i = F(n, 2), s = (e) => {
			var t = Qa(), n = N(t);
			Ur(n, 17, () => v, (e) => e.module, (e, t) => {
				var n = Ya(), r = N(n), i = N(r, !0);
				O(r);
				var a = F(r, 2), o = N(a, !0);
				O(a), O(n), I(() => {
					U(i, z(t).label), U(o, z(t).hint);
				}), B("click", n, () => c(z(t).module)), H(e, n);
			});
			var r = F(n, 2), i = (e) => {
				var t = Za();
				Ur(F(P(t), 2), 16, () => z(y), (e) => e, (e, t) => {
					var n = Xa(), r = N(n), i = N(r, !0);
					O(r), O(n), I(() => U(i, t)), B("click", n, () => c(t)), H(e, n);
				}), H(e, t);
			};
			W(r, (e) => {
				z(y).length && e(i);
			}), O(t), H(e, t);
		};
		W(i, (e) => {
			z(o) && e(s);
		}), I((e) => si(n, `margin-left: ${e ?? ""}px`), [() => Math.min(z(a).length, 5) * 16 + 9]), B("click", r, () => M(o, !z(o))), H(e, t);
	};
	W(te, (e) => {
		r() || e(ne);
	}), O(b), I(() => {
		x = ai(b, 1, "stack svelte-94r51u", null, x, { disabled: r() }), U(w, t.project ?? "default");
	}), H(e, b), Ke();
}
Tr(["click"]);
//#endregion
//#region src/Lifecycle.svelte
var no = /* @__PURE__ */ V("<div class=\"err mono svelte-dckg3z\"> </div>"), ro = /* @__PURE__ */ V("<span> </span>"), io = /* @__PURE__ */ V("<button class=\"go launch svelte-dckg3z\"> <span class=\"arr svelte-dckg3z\">▸</span></button>"), ao = /* @__PURE__ */ V("<span class=\"stat mono svelte-dckg3z\"><span class=\"spin svelte-dckg3z\">◴</span> running…</span>"), oo = /* @__PURE__ */ V("<button class=\"go stop svelte-dckg3z\">Interrupt</button>"), so = /* @__PURE__ */ V("<!> <!>", 1), co = /* @__PURE__ */ V("<span class=\"stat ready mono svelte-dckg3z\">✓ result cached</span>"), lo = /* @__PURE__ */ V("<button class=\"go resume svelte-dckg3z\">Resume</button>"), uo = /* @__PURE__ */ V("<div><!> <div class=\"row svelte-dckg3z\"><!> <!></div></div>");
function fo(e, t) {
	Ge(t, !0);
	let n = Di(t, "disabled", 3, !1), r = Di(t, "compact", 3, !1), i = Di(t, "launchLabel", 3, "Launch"), a = /* @__PURE__ */ j("draft"), o = /* @__PURE__ */ j(!1), s = /* @__PURE__ */ j(""), c = /* @__PURE__ */ j(void 0);
	function l(e, n) {
		M(a, e, !0), n && M(c, n, !0), t.onStatus?.(e, z(c));
	}
	Tn(() => {
		if (JSON.stringify(t.version), t.executionRef, d++, _r(() => z(a)) === "running") return;
		let e = !1;
		return t.adapter.find(t.module, t.version, {
			context: t.context,
			executionRef: t.executionRef
		}).then((t) => {
			e || l(t.status, t.executionRef);
		}), () => e = !0;
	});
	async function u() {
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
			}), f();
		} catch (e) {
			M(s, e instanceof Error ? e.message : String(e), !0);
		} finally {
			M(o, !1);
		}
	}
	let d = 0;
	async function f() {
		let e = ++d;
		for (;;) {
			if (await new Promise((e) => setTimeout(e, 600)), e !== d) return;
			try {
				let n = await t.adapter.find(t.module, t.version, {
					context: t.context,
					executionRef: t.executionRef
				});
				if (e !== d || (n.status !== "draft" && l(n.status, n.executionRef), n.status === "cached" || n.status === "failed")) return;
			} catch {}
		}
	}
	async function p() {
		z(c) && await t.adapter.interrupt(z(c));
	}
	var m = uo();
	let h;
	var g = N(m), _ = (e) => {
		var t = no(), n = N(t, !0);
		O(t), I(() => U(n, z(s))), H(e, t);
	};
	W(g, (e) => {
		z(s) && e(_);
	});
	var v = F(g, 2), y = N(v), b = (e) => {
		var t = ro(), n = N(t, !0);
		O(t), I(() => {
			ai(t, 1, `badge ${z(a) ?? ""}`, "svelte-dckg3z"), U(n, z(a));
		}), H(e, t);
	};
	W(y, (e) => {
		r() || e(b);
	});
	var x = F(y, 2), S = (e) => {
		var t = io(), r = N(t);
		Le(), O(t), I(() => {
			t.disabled = z(o) || n(), U(r, `${i() ?? ""} `);
		}), B("click", t, u), H(e, t);
	}, C = (e) => {
		var t = so(), n = P(t), i = (e) => {
			H(e, ao());
		};
		W(n, (e) => {
			r() || e(i);
		});
		var a = F(n, 2), o = (e) => {
			var t = oo();
			B("click", t, p), H(e, t);
		};
		W(a, (e) => {
			z(c) && e(o);
		}), H(e, t);
	}, w = (e) => {
		var t = Mr(), n = P(t), i = (e) => {
			H(e, co());
		};
		W(n, (e) => {
			r() || e(i);
		}), H(e, t);
	}, ee = (e) => {
		var t = lo();
		I(() => t.disabled = z(o)), B("click", t, u), H(e, t);
	};
	W(x, (e) => {
		z(a) === "draft" ? e(S) : z(a) === "running" ? e(C, 1) : z(a) === "cached" ? e(w, 2) : (z(a) === "failed" || z(a) === "interrupted") && e(ee, 3);
	}), O(v), O(m), I(() => h = ai(m, 1, "lifecycle svelte-dckg3z", null, h, { compact: r() })), H(e, m), Ke();
}
Tr(["click"]);
//#endregion
//#region src/Provenance.svelte
var po = /* @__PURE__ */ V("<div class=\"empty mono svelte-1pahae8\">loading provenance…</div>"), mo = /* @__PURE__ */ V("<div class=\"empty mono svelte-1pahae8\">no provenance recorded — not yet executed</div>"), ho = /* @__PURE__ */ V("<span class=\"cargs svelte-1pahae8\"> </span>"), go = /* @__PURE__ */ V("<div class=\"rline svelte-1pahae8\"><span class=\"kw svelte-1pahae8\">with</span> <span class=\"mod svelte-1pahae8\"> </span> <!></div>"), _o = /* @__PURE__ */ V("<div class=\"rline svelte-1pahae8\"><span class=\"vparts svelte-1pahae8\"> </span></div>"), vo = /* @__PURE__ */ V("<span class=\"dirty mono svelte-1pahae8\">dirty ●</span>"), yo = /* @__PURE__ */ V("<span class=\"clean mono svelte-1pahae8\">clean</span>"), bo = /* @__PURE__ */ V("<button class=\"src mono svelte-1pahae8\">view source ▸</button>"), xo = /* @__PURE__ */ V("<div class=\"deps mono svelte-1pahae8\"> </div>"), So = /* @__PURE__ */ V("<div class=\"erow mf svelte-1pahae8\"><span class=\"mfk mono svelte-1pahae8\">uses manifest</span> <span class=\"commit mono svelte-1pahae8\"> </span> <!> <span class=\"espacer svelte-1pahae8\"></span> <!></div> <!>", 1), Co = /* @__PURE__ */ V("<div class=\"exec svelte-1pahae8\"><div class=\"erow svelte-1pahae8\"><span></span> <span class=\"est svelte-1pahae8\"> </span> <span class=\"espacer svelte-1pahae8\"></span> <span class=\"ets mono svelte-1pahae8\"> </span></div> <!></div>"), wo = /* @__PURE__ */ V("<div class=\"empty mono svelte-1pahae8\">(not yet executed)</div>"), To = /* @__PURE__ */ V("<div class=\"trunc mono svelte-1pahae8\">graph truncated · more layers hidden ▾</div>"), Eo = /* @__PURE__ */ V("<div class=\"sect svelte-1pahae8\"><div class=\"cap mono svelte-1pahae8\">RECIPE · config ⊕ context <span class=\"capsub svelte-1pahae8\">— frozen</span></div> <div class=\"recipe mono svelte-1pahae8\"><!> <div class=\"rline svelte-1pahae8\"><span class=\"tgt svelte-1pahae8\"> </span></div> <!></div></div> <div class=\"sect svelte-1pahae8\"><div class=\"cap mono svelte-1pahae8\">HISTORY · executions · newest first</div> <!></div> <!>", 1), Do = /* @__PURE__ */ V("<div class=\"prov svelte-1pahae8\"><!></div>");
function Oo(e, t) {
	Ge(t, !0);
	let n = /* @__PURE__ */ j(null), r = /* @__PURE__ */ j(!1);
	Tn(() => {
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
	let s = /* @__PURE__ */ k(() => z(n) ? i(z(n), z(n).root) : void 0), c = /* @__PURE__ */ k(() => o(z(s)?.attributes)), l = /* @__PURE__ */ k(() => {
		let e = z(c).context;
		return Array.isArray(e) ? e.map((e) => {
			let t = o(e);
			return {
				target: String(t.target ?? e),
				version: Array.isArray(t.version) ? t.version : []
			};
		}) : [];
	}), u = /* @__PURE__ */ k(() => {
		let e = o(z(c).config_layers);
		return Array.isArray(e.version) ? e.version : z(s)?.version ?? [];
	}), d = /* @__PURE__ */ k(() => z(n) ? a(z(n), z(n).root, "runs").map((e) => {
		let t = o(e.attributes), r = o(a(z(n), e.uuid, "uses").find((e) => e.kind === "Manifest")?.attributes);
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
	var m = Do(), h = N(m), g = (e) => {
		H(e, po());
	}, _ = (e) => {
		H(e, mo());
	}, v = (e) => {
		var r = Eo(), i = P(r), a = F(N(i), 2), o = N(a);
		Ur(o, 17, () => z(l), zr, (e, t, n) => {
			var r = go();
			si(r, `padding-left: ${n * 16}px`);
			var i = F(N(r), 2), a = N(i, !0);
			O(i);
			var o = F(i, 2), s = (e) => {
				var n = ho(), r = N(n, !0);
				O(n), I((e) => U(r, e), [() => zi(z(t).version).join(" ")]), H(e, n);
			}, c = /* @__PURE__ */ k(() => zi(z(t).version).length);
			W(o, (e) => {
				z(c) && e(s);
			}), O(r), I(() => U(a, z(t).target)), H(e, r);
		});
		var c = F(o, 2), m = N(c), h = N(m, !0);
		O(m), O(c);
		var g = F(c, 2), _ = (e) => {
			var t = _o(), n = N(t), r = N(n, !0);
			O(n), O(t), I((e) => {
				si(t, `padding-left: ${z(l).length * 16 + 12}px`), U(r, e);
			}, [() => zi(z(u)).join(" · ")]), H(e, t);
		}, v = /* @__PURE__ */ k(() => zi(z(u)).length);
		W(g, (e) => {
			z(v) && e(_);
		}), O(a), O(i);
		var y = F(i, 2);
		Ur(F(N(y), 2), 17, () => z(d), (e) => e.uuid, (e, n) => {
			var r = Co(), i = N(r), a = N(i);
			let o;
			var s = F(a, 2), c = N(s, !0);
			O(s);
			var l = F(s, 4), u = N(l, !0);
			O(l), O(i);
			var d = F(i, 2), m = (e) => {
				var r = So(), i = P(r), a = F(N(i), 2), o = N(a, !0);
				O(a);
				var s = F(a, 2), c = (e) => {
					H(e, vo());
				}, l = (e) => {
					H(e, yo());
				};
				W(s, (e) => {
					z(n).dirty ? e(c) : e(l, -1);
				});
				var u = F(s, 4), d = (e) => {
					var t = bo();
					B("click", t, p), H(e, t);
				};
				W(u, (e) => {
					t.onViewSource && e(d);
				}), O(i);
				var f = F(i, 2), m = (e) => {
					var t = xo(), r = N(t);
					O(t), I((e) => U(r, `deps · ${e ?? ""}`), [() => z(n).deps.join(" · ")]), H(e, t);
				};
				W(f, (e) => {
					z(n).deps.length && e(m);
				}), I(() => U(o, z(n).commit)), H(e, r);
			};
			W(d, (e) => {
				z(n).commit && e(m);
			}), O(r), I((e) => {
				o = ai(a, 1, "edot svelte-1pahae8", null, o, { bad: z(n).status === "failed" }), U(c, z(n).status ?? "run"), U(u, e);
			}, [() => f(z(n).ts)]), H(e, r);
		}, (e) => {
			H(e, wo());
		}), O(y);
		var b = F(y, 2), x = (e) => {
			H(e, To());
		};
		W(b, (e) => {
			z(n).truncated && e(x);
		}), I(() => {
			si(c, `padding-left: ${z(l).length * 16}px`), U(h, z(s).module ?? t.module);
		}), H(e, r);
	};
	W(h, (e) => {
		z(r) ? !z(n) || !z(s) ? e(_, 1) : e(v, -1) : e(g);
	}), O(m), H(e, m), Ke();
}
Tr(["click"]);
//#endregion
//#region src/Browser.svelte
var ko = /* @__PURE__ */ V("<div class=\"err mono svelte-83jdt3\"> </div>"), Ao = /* @__PURE__ */ V("<span class=\"chip mono svelte-83jdt3\"> <button class=\"x svelte-83jdt3\">×</button></span>"), jo = /* @__PURE__ */ V("<option class=\"svelte-83jdt3\"> </option>"), Mo = /* @__PURE__ */ V("<div class=\"fform svelte-83jdt3\"><input class=\"fp mono svelte-83jdt3\" placeholder=\"config path — e.g. alpha\"/> <select class=\"fo mono svelte-83jdt3\"></select> <input class=\"fv mono svelte-83jdt3\" placeholder=\"value\"/> <button class=\"fadd svelte-83jdt3\">add</button></div>"), No = /* @__PURE__ */ V("<button class=\"newrow svelte-83jdt3\"><span class=\"newplus mono svelte-83jdt3\">+</span> <span class=\"newmeta svelte-83jdt3\"><span class=\"newname svelte-83jdt3\">New run</span></span> <span class=\"chev svelte-83jdt3\">›</span></button>"), Po = /* @__PURE__ */ V("<button class=\"clear mono svelte-83jdt3\">clear filters ×</button>"), Fo = /* @__PURE__ */ V("<div class=\"hint mono svelte-83jdt3\">no runs yet</div>"), Io = /* @__PURE__ */ V("<div class=\"nomatch svelte-83jdt3\"><div class=\"nm mono svelte-83jdt3\">0 runs match</div> <!></div>"), Lo = /* @__PURE__ */ V("<input class=\"rename mono svelte-83jdt3\"/>"), Ro = /* @__PURE__ */ V("<button class=\"pen svelte-83jdt3\" title=\"rename\">✎</button>"), zo = /* @__PURE__ */ V("<span class=\"lbl svelte-83jdt3\"> </span> <!>", 1), Bo = /* @__PURE__ */ V("<span class=\"ident mono svelte-83jdt3\"> </span>"), Vo = /* @__PURE__ */ V("<span class=\"sp svelte-83jdt3\"> </span>"), Ho = /* @__PURE__ */ V("<span class=\"more svelte-83jdt3\"> </span>"), Uo = /* @__PURE__ */ V("<span class=\"more svelte-83jdt3\">defaults</span>"), Wo = /* @__PURE__ */ V("<span class=\"git mono svelte-83jdt3\"> </span>"), Go = /* @__PURE__ */ V("<span class=\"meta svelte-83jdt3\"> </span>"), Ko = /* @__PURE__ */ V("<div class=\"peekbody svelte-83jdt3\"><!></div>"), qo = /* @__PURE__ */ V("<div class=\"row svelte-83jdt3\" role=\"button\" tabindex=\"0\"><div class=\"r1 svelte-83jdt3\"><span></span> <!> <span class=\"spacer svelte-83jdt3\"></span> <!> <span class=\"chev svelte-83jdt3\">›</span></div> <div class=\"r2 mono svelte-83jdt3\"><!> <!> <!></div> <div class=\"r3 svelte-83jdt3\"><span> </span> <!> <!> <span class=\"meta svelte-83jdt3\"> </span> <span class=\"spacer svelte-83jdt3\"></span> <button class=\"peek mono svelte-83jdt3\">⌥ provenance</button></div> <!></div>"), Jo = /* @__PURE__ */ V("<button class=\"morebtn mono svelte-83jdt3\"> </button>"), Yo = /* @__PURE__ */ V("<div class=\"rows svelte-83jdt3\"></div> <div class=\"foot mono svelte-83jdt3\"><span class=\"svelte-83jdt3\"> </span> <span class=\"spacer svelte-83jdt3\"></span> <!></div>", 1), Xo = /* @__PURE__ */ V("<div class=\"cat svelte-83jdt3\"><!> <div class=\"controls svelte-83jdt3\"><div class=\"search svelte-83jdt3\"><span class=\"mag svelte-83jdt3\">⌕</span> <input placeholder=\"search config &amp; labels…\" class=\"svelte-83jdt3\"/></div> <div class=\"chips svelte-83jdt3\"><!> <button class=\"addf mono svelte-83jdt3\">+ facet</button> <span class=\"spacer svelte-83jdt3\"></span> <label class=\"sort mono svelte-83jdt3\">sort: <select class=\"svelte-83jdt3\"><option class=\"svelte-83jdt3\">newest</option><option class=\"svelte-83jdt3\">oldest</option><option class=\"svelte-83jdt3\">label</option></select></label></div> <!></div> <!> <!></div>");
function Zo(e, t) {
	Ge(t, !0);
	let n = /* @__PURE__ */ j(""), r = /* @__PURE__ */ j($t([])), i = /* @__PURE__ */ j("newest"), a = /* @__PURE__ */ j($t([])), o = /* @__PURE__ */ j(0), s = /* @__PURE__ */ j(""), c = /* @__PURE__ */ j(!1);
	function l(e) {
		return {
			text: z(n).trim() || void 0,
			facets: z(r).length ? z(r) : void 0,
			sort: z(i) === "label" ? {
				by: "label",
				direction: "asc"
			} : {
				by: "created_at_ns",
				direction: z(i) === "newest" ? "desc" : "asc"
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
			let e = await t.adapter.list(l(z(a).length));
			M(a, [...z(a), ...e.items], !0), M(o, e.total, !0);
		} catch (e) {
			M(s, e instanceof Error ? e.message : String(e), !0);
		} finally {
			M(c, !1);
		}
	}
	Tn(() => {
		z(n), JSON.stringify(z(r)), z(i);
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
		if (!z(m).trim() || z(g) === "") return;
		let e = Number(z(g)), t = z(g).trim() !== "" && !Number.isNaN(e) ? e : z(g);
		M(r, [...z(r), {
			path: z(m).trim(),
			op: z(h),
			value: t
		}], !0), M(m, ""), M(g, ""), M(h, "eq"), M(p, !1);
	}
	function v(e) {
		M(r, z(r).filter((t, n) => n !== e), !0);
	}
	function y(e) {
		let t = f.find((t) => t.op === e.op)?.label ?? e.op;
		return `${e.path} ${t} ${typeof e.value == "string" ? e.value : JSON.stringify(e.value)}`;
	}
	function b(e) {
		return e.version?.length ? zi(e.version) : Object.entries(e.config).map(([e, t]) => `${e}=${typeof t == "string" ? t : JSON.stringify(t)}`);
	}
	function x(e) {
		if (!e) return "";
		let t = Math.max(0, (Date.now() - e) / 1e3);
		return t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago`;
	}
	let S = /* @__PURE__ */ j(null), C = /* @__PURE__ */ j("");
	async function w(e) {
		let n = z(C).trim();
		if (M(S, null), !(!n || n === e.label || !t.adapter.setLabel)) try {
			await t.adapter.setLabel(e.uuid, n), await u();
		} catch (e) {
			M(s, e instanceof Error ? e.message : String(e), !0);
		}
	}
	let ee = /* @__PURE__ */ j(null);
	var te = Xo(), ne = N(te), T = (e) => {
		var t = ko(), n = N(t, !0);
		O(t), I(() => U(n, z(s))), H(e, t);
	};
	W(ne, (e) => {
		z(s) && e(T);
	});
	var re = F(ne, 2), ie = N(re), ae = F(N(ie), 2);
	gi(ae), O(ie);
	var oe = F(ie, 2), se = N(oe);
	Ur(se, 17, () => z(r), zr, (e, t, n) => {
		var r = Ao(), i = N(r), a = F(i);
		O(r), I((e) => U(i, `${e ?? ""} `), [() => y(z(t))]), B("click", a, () => v(n)), H(e, r);
	});
	var ce = F(se, 2), le = F(ce, 4), ue = F(N(le)), de = N(ue);
	de.value = de.__value = "newest";
	var fe = F(de);
	fe.value = fe.__value = "oldest";
	var pe = F(fe);
	pe.value = pe.__value = "label", O(ue), O(le), O(oe);
	var me = F(oe, 2), he = (e) => {
		var t = Mo(), n = N(t);
		gi(n);
		var r = F(n, 2);
		Ur(r, 21, () => f, (e) => e.op, (e, t) => {
			var n = jo(), r = N(n, !0);
			O(n);
			var i = {};
			I(() => {
				U(r, z(t).label), i !== (i = z(t).op) && (n.value = (n.__value = z(t).op) ?? "");
			}), H(e, n);
		}), O(r);
		var i = F(r, 2);
		gi(i);
		var a = F(i, 2);
		O(t), Si(n, () => z(m), (e) => M(m, e)), ui(r, () => z(h), (e) => M(h, e)), B("keydown", i, (e) => e.key === "Enter" && _()), Si(i, () => z(g), (e) => M(g, e)), B("click", a, _), H(e, t);
	};
	W(me, (e) => {
		z(p) && e(he);
	}), O(re);
	var ge = F(re, 2), _e = (e) => {
		var n = No();
		B("click", n, function(...e) {
			t.onNew?.apply(this, e);
		}), H(e, n);
	};
	W(ge, (e) => {
		t.onNew && e(_e);
	});
	var ve = F(ge, 2), ye = (e) => {
		var t = Io(), i = F(N(t), 2), a = (e) => {
			var t = Po();
			B("click", t, () => {
				M(r, [], !0), M(n, "");
			}), H(e, t);
		}, o = (e) => {
			H(e, Fo());
		};
		W(i, (e) => {
			z(r).length || z(n) ? e(a) : e(o, -1);
		}), O(t), H(e, t);
	}, be = (e) => {
		var n = Yo(), r = P(n);
		Ur(r, 21, () => z(a), (e) => e.uuid, (e, n) => {
			var r = qo(), i = N(r), a = N(i);
			let o;
			var s = F(a, 2), c = (e) => {
				var t = Lo();
				gi(t), hn(t, !0), B("click", t, (e) => e.stopPropagation()), B("keydown", t, (e) => {
					e.stopPropagation(), e.key === "Enter" && w(z(n)), e.key === "Escape" && M(S, null);
				}), wr("blur", t, () => void w(z(n))), Si(t, () => z(C), (e) => M(C, e)), H(e, t);
			}, l = (e) => {
				var r = zo(), i = P(r), a = N(i, !0);
				O(i);
				var o = F(i, 2), s = (e) => {
					var t = Ro();
					B("click", t, (e) => {
						e.stopPropagation(), M(S, z(n).uuid, !0), M(C, z(n).label ?? "", !0);
					}), H(e, t);
				};
				W(o, (e) => {
					t.adapter.setLabel && e(s);
				}), I(() => U(a, z(n).label ?? z(n).module)), H(e, r);
			};
			W(s, (e) => {
				z(S) === z(n).uuid ? e(c) : e(l, -1);
			});
			var u = F(s, 4), d = (e) => {
				var t = Bo(), r = N(t);
				O(t), I(() => U(r, `#${z(n).identity ?? ""}`)), H(e, t);
			};
			W(u, (e) => {
				z(n).identity && e(d);
			}), Le(2), O(i);
			var f = F(i, 2), p = N(f);
			Ur(p, 17, () => b(z(n)).slice(0, 4), zr, (e, t) => {
				var n = Vo(), r = N(n, !0);
				O(n), I(() => U(r, z(t))), H(e, n);
			});
			var m = F(p, 2), h = (e) => {
				var t = Ho(), r = N(t);
				O(t), I((e) => U(r, `+${e ?? ""} more`), [() => b(z(n)).length - 4]), H(e, t);
			}, g = /* @__PURE__ */ k(() => b(z(n)).length > 4);
			W(m, (e) => {
				z(g) && e(h);
			});
			var _ = F(m, 2), v = (e) => {
				H(e, Uo());
			}, y = /* @__PURE__ */ k(() => b(z(n)).length === 0);
			W(_, (e) => {
				z(y) && e(v);
			}), O(f);
			var te = F(f, 2), ne = N(te), T = N(ne, !0);
			O(ne);
			var re = F(ne, 2), ie = (e) => {
				var t = Wo(), r = N(t);
				O(t), I(() => U(r, `git ${z(n).manifest.commit ?? ""}${z(n).manifest.dirty ? "*" : ""}`)), H(e, t);
			};
			W(re, (e) => {
				z(n).manifest && e(ie);
			});
			var ae = F(re, 2), oe = (e) => {
				var t = Go(), r = N(t);
				O(t), I(() => U(r, `${z(n).runCount ?? ""} runs`)), H(e, t);
			};
			W(ae, (e) => {
				z(n).runCount && z(n).runCount > 1 && e(oe);
			});
			var se = F(ae, 2), ce = N(se);
			O(se);
			var le = F(se, 4);
			O(te);
			var ue = F(te, 2), de = (e) => {
				var r = Ko(), i = N(r);
				{
					let e = /* @__PURE__ */ k(() => z(n).version ?? [z(n).config]);
					Oo(i, {
						get adapter() {
							return t.adapter;
						},
						get module() {
							return z(n).module;
						},
						get version() {
							return z(e);
						}
					});
				}
				O(r), B("click", r, (e) => e.stopPropagation()), B("keydown", r, (e) => e.stopPropagation()), H(e, r);
			};
			W(ue, (e) => {
				z(ee) === z(n).uuid && e(de);
			}), O(r), I((e) => {
				o = ai(a, 1, `dot ${z(n).status ?? ""}`, "svelte-83jdt3", o, { pulse: z(n).status === "running" }), ai(ne, 1, `st ${z(n).status ?? ""}`, "svelte-83jdt3"), U(T, z(n).status), U(ce, `${e ?? ""}${z(n).creator ? ` · ${z(n).creator}` : ""}`);
			}, [() => x(z(n).createdAt)]), B("click", r, () => t.onOpen?.(z(n))), B("keydown", r, (e) => e.key === "Enter" && t.onOpen?.(z(n))), B("click", le, (e) => {
				e.stopPropagation(), M(ee, z(ee) === z(n).uuid ? null : z(n).uuid, !0);
			}), H(e, r);
		}), O(r);
		var i = F(r, 2), s = N(i), l = N(s);
		O(s);
		var u = F(s, 4), f = (e) => {
			var t = Jo(), n = N(t, !0);
			O(t), I(() => {
				t.disabled = z(c), U(n, z(c) ? "loading…" : "load more ▾");
			}), B("click", t, d), H(e, t);
		};
		W(u, (e) => {
			z(a).length < z(o) && e(f);
		}), O(i), I(() => U(l, `1–${z(a).length ?? ""} of ${z(o) ?? ""}`)), H(e, n);
	};
	W(ve, (e) => {
		z(a).length === 0 ? e(ye) : e(be, -1);
	}), O(te), Si(ae, () => z(n), (e) => M(n, e)), B("click", ce, () => M(p, !z(p))), ui(ue, () => z(i), (e) => M(i, e)), H(e, te), Ke();
}
Tr(["click", "keydown"]);
//#endregion
//#region src/StatusBadge.svelte
var Qo = /* @__PURE__ */ V("<span class=\"pulse svelte-1pj1gvc\"></span>"), $o = /* @__PURE__ */ V("<span><!> </span>");
function es(e, t) {
	let n = {
		draft: "DRAFT",
		running: "RUNNING",
		"running-looped": "RUNNING · LOOPED",
		cached: "CACHED",
		"cached-reuse": "CACHED · REUSE ↺",
		failed: "FAILED",
		interrupted: "INTERRUPTED",
		locked: "🔒 LOCKED"
	};
	var r = $o(), i = N(r), a = (e) => {
		H(e, Qo());
	};
	W(i, (e) => {
		(t.variant === "running" || t.variant === "running-looped") && e(a);
	});
	var o = F(i);
	O(r), I(() => {
		ai(r, 1, `badge ${t.variant ?? ""}`, "svelte-1pj1gvc"), U(o, ` ${n[t.variant] ?? ""}`);
	}), H(e, r);
}
//#endregion
//#region src/ResolvedBar.svelte
var ts = /* @__PURE__ */ V("<span class=\"ident mono svelte-195uv0s\"> </span>"), ns = /* @__PURE__ */ V("<span class=\"state mono bad svelte-195uv0s\">✕ fix to launch</span>"), rs = /* @__PURE__ */ V("<div class=\"issue mono svelte-195uv0s\"> </div>"), is = /* @__PURE__ */ V("<div class=\"issues svelte-195uv0s\"></div>"), as = /* @__PURE__ */ V("<div class=\"bar svelte-195uv0s\"><div class=\"brow svelte-195uv0s\"><!> <!> <!> <span class=\"spacer svelte-195uv0s\"></span> <!></div> <!></div>");
function os(e, t) {
	Ge(t, !0);
	let n = Di(t, "badge", 3, null), r = /* @__PURE__ */ j(""), i = /* @__PURE__ */ j($t([]));
	Tn(() => {
		JSON.stringify(t.version), t.module;
		let e = !1, n = setTimeout(() => {
			t.adapter.resolve(t.module, t.version).then((n) => {
				e || (n.ok ? (M(r, n.identity ?? "", !0), M(i, [], !0)) : (M(r, ""), M(i, n.issues, !0)), t.onResolved?.(n));
			});
		}, 150);
		return () => {
			e = !0, clearTimeout(n);
		};
	});
	var a = as(), o = N(a), s = N(o), c = (e) => {
		es(e, { get variant() {
			return n();
		} });
	};
	W(s, (e) => {
		n() && e(c);
	});
	var l = F(s, 2), u = (e) => {
		var t = ts(), n = N(t);
		O(t), I(() => U(n, `#${z(r) ?? ""}`)), H(e, t);
	};
	W(l, (e) => {
		z(r) && e(u);
	});
	var d = F(l, 2), f = (e) => {
		H(e, ns());
	};
	W(d, (e) => {
		z(i).length && e(f);
	}), Yr(F(d, 4), () => t.children ?? m), O(o);
	var p = F(o, 2), h = (e) => {
		var t = is();
		Ur(t, 21, () => z(i), zr, (e, t) => {
			var n = rs(), r = N(n);
			O(n), I(() => U(r, `${z(t).path ? `${z(t).path} · ` : ""}${z(t).message ?? ""}`)), H(e, n);
		}), O(t), H(e, t);
	};
	W(p, (e) => {
		z(i).length && e(h);
	}), O(a), H(e, a), Ke();
}
//#endregion
//#region src/CliView.svelte
var ss = /* @__PURE__ */ V("<span role=\"note\"> </span> ", 1), cs = /* @__PURE__ */ V("<span> </span> ", 1), ls = /* @__PURE__ */ V("<div class=\"cli mono svelte-1gjwari\"><span class=\"cmd svelte-1gjwari\">machinable get</span> <!><span class=\"tgtspan svelte-1gjwari\"></span> <span class=\"launchflag svelte-1gjwari\">--launch</span></div> <button class=\"copy mono svelte-1gjwari\"> </button>", 1), us = /* @__PURE__ */ V("<div class=\"cli mono dim svelte-1gjwari\">resolving…</div>"), ds = /* @__PURE__ */ V("<div class=\"cliview svelte-1gjwari\"><!></div>");
function fs(e, t) {
	Ge(t, !0);
	let n = Di(t, "chain", 19, () => []), r = Di(t, "highlightId", 3, null);
	function i(e) {
		let t = [], n = 0, r = null, i = "";
		for (let a of e) {
			if (r) {
				i += a, a === r && (r = null);
				continue;
			}
			if (a === "'" || a === "\"") {
				r = a, i += a;
				continue;
			}
			if ((a === "[" || a === "{" || a === "(") && n++, (a === "]" || a === "}" || a === ")") && n--, a === " " && n === 0) {
				i && t.push(i), i = "";
				continue;
			}
			i += a;
		}
		return i && t.push(i), t;
	}
	let a = /* @__PURE__ */ k(() => t.cli.replace(/^machinable get /, "")), o = /* @__PURE__ */ k(() => z(a) ? i(z(a)).map((e) => {
		let n = "plain";
		return e === t.module || e.endsWith(t.module) ? n = "mod" : e.startsWith("~") ? n = "tok" : e.includes("=") && (n = "kv"), {
			w: e,
			cls: n
		};
	}) : []);
	function s(e) {
		return [e.module, ...zi(e.version)].join(" ");
	}
	let c = /* @__PURE__ */ k(() => [
		"machinable get",
		...n().map(s),
		z(a),
		"--launch"
	].filter(Boolean).join(" ")), l = /* @__PURE__ */ j(!1);
	async function u() {
		try {
			await navigator.clipboard.writeText(z(c)), M(l, !0), setTimeout(() => M(l, !1), 1200);
		} catch {}
	}
	var d = ds(), f = N(d), p = (e) => {
		var i = ls(), a = P(i), c = F(N(a), 1, !0);
		c.nodeValue = " ";
		var d = F(c);
		Ur(d, 17, n, (e) => e.id, (e, n) => {
			var i = ss(), a = P(i);
			let o;
			var c = N(a, !0);
			O(a);
			var l = F(a, 1, !0);
			l.nodeValue = " ", I((e) => {
				o = ai(a, 1, "ctxspan svelte-1gjwari", null, o, { hl: r() === z(n).id }), U(c, e);
			}, [() => s(z(n))]), wr("mouseenter", a, () => t.onHighlight?.(z(n).id)), wr("mouseleave", a, () => t.onHighlight?.(null)), H(e, i);
		});
		var f = F(d);
		Ur(f, 21, () => z(o), zr, (e, t, n) => {
			var r = cs(), i = P(r), a = N(i, !0);
			O(i);
			var s = F(i, 1, !0);
			I(() => {
				ai(i, 1, $r(z(t).cls), "svelte-1gjwari"), U(a, z(t).w), U(s, n < z(o).length - 1 ? " " : "");
			}), H(e, r);
		}), O(f);
		var p = F(f, 1, !0);
		p.nodeValue = " ", Le(), O(a);
		var m = F(a, 2), h = N(m, !0);
		O(m), I(() => U(h, z(l) ? "copied ✓" : "copy ⧉")), B("click", m, u), H(e, i);
	}, m = (e) => {
		H(e, us());
	};
	W(f, (e) => {
		t.cli ? e(p) : e(m, -1);
	}), O(d), H(e, d), Ke();
}
Tr(["click"]);
//#endregion
//#region src/RunBanner.svelte
var ps = /* @__PURE__ */ V("<button class=\"stop svelte-6u7gzy\">Interrupt</button>"), ms = /* @__PURE__ */ V("<div class=\"note mono svelte-6u7gzy\">identity <span class=\"hash svelte-6u7gzy\"> </span> · new variant — not a cache hit</div>"), hs = /* @__PURE__ */ V("<div class=\"banner svelte-6u7gzy\"><div class=\"row svelte-6u7gzy\"><span class=\"spinner svelte-6u7gzy\"></span> <div class=\"what svelte-6u7gzy\"><span class=\"title svelte-6u7gzy\">Job · dispatched to <span class=\"exec mono svelte-6u7gzy\"> </span></span> <span class=\"sub mono svelte-6u7gzy\"> </span></div> <!></div> <div class=\"track svelte-6u7gzy\"><span class=\"fill svelte-6u7gzy\"></span></div> <!></div>");
function gs(e, t) {
	Ge(t, !0);
	let n = Di(t, "executionLabel", 3, "default execution"), r = /* @__PURE__ */ j($t(Date.now()));
	Tn(() => {
		let e = setInterval(() => M(r, Date.now(), !0), 500);
		return () => clearInterval(e);
	});
	let i = /* @__PURE__ */ k(() => {
		let e = Math.max(0, Math.floor((z(r) - t.startedAt) / 1e3));
		return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
	});
	var a = hs(), o = N(a), s = F(N(o), 2), c = N(s), l = F(N(c)), u = N(l, !0);
	O(l), O(c);
	var d = F(c, 2), f = N(d);
	O(d), O(s);
	var p = F(s, 2), m = (e) => {
		var n = ps();
		B("click", n, function(...e) {
			t.onInterrupt?.apply(this, e);
		}), H(e, n);
	};
	W(p, (e) => {
		t.onInterrupt && e(m);
	}), O(o);
	var h = F(o, 4), g = (e) => {
		var n = ms(), r = F(N(n)), i = N(r);
		O(r), Le(), O(n), I(() => U(i, `#${t.identity ?? ""}`)), H(e, n);
	};
	W(h, (e) => {
		t.identity && e(g);
	}), O(a), I(() => {
		U(u, n()), U(f, `polling · elapsed ${z(i) ?? ""}`);
	}), H(e, a), Ke();
}
Tr(["click"]);
//#endregion
//#region src/RunPanel.svelte
var _s = /* @__PURE__ */ V("<span class=\"nick svelte-su2ghu\"> </span>"), vs = /* @__PURE__ */ V("<span> </span>"), ys = /* @__PURE__ */ V("<div class=\"trim mono svelte-su2ghu\"> </div>"), bs = /* @__PURE__ */ V("<!> <pre class=\"log mono svelte-su2ghu\"> </pre>", 1), xs = /* @__PURE__ */ V("<div class=\"run svelte-su2ghu\"><div class=\"meta mono svelte-su2ghu\"><!> <!> <span> </span> <!> <!> <span class=\"spacer svelte-su2ghu\"></span> <button class=\"otoggle svelte-su2ghu\"> </button></div> <!></div>");
function Ss(e, t) {
	Ge(t, !0);
	let n = 262144, r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ j(null), a = /* @__PURE__ */ j(0), o = 0, s = /* @__PURE__ */ j(!0), c = /* @__PURE__ */ j($t(Date.now())), l = /* @__PURE__ */ j(null);
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
				let e = (z(i) ?? "") + s.output;
				e.length > n && (M(a, z(a) + (e.length - n)), e = e.slice(-262144)), M(i, e, !0);
			}
			o = s.size, z(l) && (z(l).scrollTop = z(l).scrollHeight);
		} catch {}
	}
	let d = null;
	Tn(() => {
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
		let e = z(r)?.startedAt ? new Date(z(r).startedAt).getTime() : NaN;
		if (isNaN(e)) return null;
		let t = z(r)?.finishedAt ? new Date(z(r).finishedAt).getTime() : z(c), n = Math.max(0, (t - e) / 1e3);
		if (n < 60) return `${n.toFixed(1)}s`;
		let i = Math.floor(n / 60);
		return `${i}m ${Math.round(n - i * 60)}s`;
	});
	var m = Mr(), h = P(m), g = (e) => {
		var n = xs(), o = N(n), c = N(o), u = (e) => {
			var t = _s(), n = N(t, !0);
			O(t), I(() => U(n, z(r).nickname)), H(e, t);
		};
		W(c, (e) => {
			z(r)?.nickname && e(u);
		});
		var d = F(c, 2), m = (e) => {
			var t = vs(), n = N(t);
			O(t), I(() => U(n, `seed ${z(r).seed ?? ""}`)), H(e, t);
		};
		W(d, (e) => {
			z(r)?.seed !== void 0 && e(m);
		});
		var h = F(d, 2), g = N(h);
		O(h);
		var _ = F(h, 2), v = (e) => {
			var t = vs(), n = N(t);
			O(t), I((e) => U(n, `finished ${e ?? ""}`), [() => f(z(r).finishedAt)]), H(e, t);
		};
		W(_, (e) => {
			z(r)?.finishedAt && e(v);
		});
		var y = F(_, 2), b = (e) => {
			var n = vs();
			let r;
			var i = N(n, !0);
			O(n), I(() => {
				r = ai(n, 1, "rt svelte-su2ghu", null, r, { live: t.status === "running" }), U(i, z(p));
			}), H(e, n);
		};
		W(y, (e) => {
			z(p) && e(b);
		});
		var x = F(y, 4), S = N(x);
		O(x), O(o);
		var C = F(o, 2), w = (e) => {
			var t = bs(), n = P(t), r = (e) => {
				var t = ys(), n = N(t);
				O(t), I(() => U(n, `… earlier output trimmed (${z(a) ?? ""} bytes)`)), H(e, t);
			};
			W(n, (e) => {
				z(a) > 0 && e(r);
			});
			var o = F(n, 2), s = N(o, !0);
			O(o), Ei(o, (e) => M(l, e), () => z(l)), I((e) => U(s, e), [() => z(i)?.trimEnd() || "(no output)"]), H(e, t);
		};
		W(C, (e) => {
			z(s) && e(w);
		}), O(n), I((e) => {
			U(g, `started ${e ?? ""}`), U(S, `${z(s) ? "▾" : "▸"} output`);
		}, [() => f(z(r)?.startedAt)]), B("click", x, () => M(s, !z(s))), H(e, n);
	};
	W(h, (e) => {
		t.adapter.runDetail && e(g);
	}), H(e, m), Ke();
}
Tr(["click"]);
//#endregion
//#region src/CallLoop.svelte
var Cs = /* @__PURE__ */ V("<span class=\"cyc mono svelte-1kkcsr9\"><span></span> </span> <span class=\"cad mono svelte-1kkcsr9\"> </span> <span class=\"spacer svelte-1kkcsr9\"></span> <button class=\"btn svelte-1kkcsr9\"> </button> <button class=\"btn svelte-1kkcsr9\">Stop</button>", 1), ws = /* @__PURE__ */ V("<div class=\"menu svelte-1kkcsr9\"><button class=\"mopt mono svelte-1kkcsr9\">Call</button> <button class=\"mopt mono svelte-1kkcsr9\">Call every 2s</button> <button class=\"mopt mono svelte-1kkcsr9\">Call every 5s</button></div>"), Ts = /* @__PURE__ */ V("<input class=\"minput mono svelte-1kkcsr9\" placeholder=\"method — e.g. units\"/> <span class=\"split svelte-1kkcsr9\"><button class=\"btn main svelte-1kkcsr9\" title=\"invoke once\"> </button> <button class=\"btn caret svelte-1kkcsr9\" title=\"call options\" aria-label=\"call options\">▾</button> <!></span>", 1), Es = /* @__PURE__ */ V("<div class=\"cerr mono svelte-1kkcsr9\"> </div>"), Ds = /* @__PURE__ */ V("<div class=\"call svelte-1kkcsr9\"><div class=\"chead svelte-1kkcsr9\"><span class=\"cap mono svelte-1kkcsr9\"> </span> <span class=\"hint svelte-1kkcsr9\"> </span></div> <div class=\"crow svelte-1kkcsr9\"><!></div> <!></div>");
function Os(e, t) {
	Ge(t, !0);
	let n = Di(t, "method", 3, ""), r = Di(t, "args", 19, () => ({})), i = Di(t, "cadenceMs", 3, 2e3), a = Di(t, "disabled", 3, !1), o = /* @__PURE__ */ j($t(n())), s = /* @__PURE__ */ j(!1), c = /* @__PURE__ */ j(!1), l = /* @__PURE__ */ j(0), u = /* @__PURE__ */ j(!1), d = /* @__PURE__ */ j(""), f = /* @__PURE__ */ j(!1), p = /* @__PURE__ */ j($t({
		top: 0,
		right: 0
	})), m = /* @__PURE__ */ j($t(i()));
	function h(e) {
		if (!z(f)) {
			let t = e.currentTarget.getBoundingClientRect();
			M(p, {
				top: t.bottom + 4,
				right: window.innerWidth - t.right
			}, !0);
		}
		M(f, !z(f));
	}
	async function g() {
		if (!(!z(o).trim() || z(u))) {
			M(u, !0), M(d, "");
			try {
				let e = await t.adapter.call(t.module, z(o).trim(), r(), t.version);
				M(l, z(l) + 1), t.onResult?.(e, {
					cycle: z(l),
					method: z(o).trim()
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
		z(o).trim() && (M(m, e, !0), M(s, !0), M(c, !1), M(l, 0), t.onLoop?.(!0), g(), _ = setInterval(() => {
			z(c) || g();
		}, e));
	}
	function y() {
		_ && clearInterval(_), _ = null, M(s, !1), M(c, !1), t.onLoop?.(!1);
	}
	Tn(() => () => {
		_ && clearInterval(_), z(s) && t.onLoop?.(!1);
	});
	var b = Ds(), x = N(b), S = N(x), C = N(S);
	O(S);
	var w = F(S, 2), ee = N(w, !0);
	O(w), O(x);
	var te = F(x, 2), ne = N(te), T = (e) => {
		var t = Cs(), n = P(t), r = N(n);
		let i;
		var a = F(r);
		O(n);
		var o = F(n, 2), s = N(o);
		O(o);
		var u = F(o, 4), d = N(u, !0);
		O(u);
		var f = F(u, 2);
		I((e) => {
			i = ai(r, 1, "dot svelte-1kkcsr9", null, i, { paused: z(c) }), U(a, `cycle ${z(l) ?? ""}`), U(s, `every ${e ?? ""}s`), U(d, z(c) ? "Resume" : "Pause");
		}, [() => (z(m) / 1e3).toFixed(0)]), B("click", u, () => M(c, !z(c))), B("click", f, y), H(e, t);
	}, re = (e) => {
		var t = Ts(), n = P(t);
		gi(n);
		var r = F(n, 2), i = N(r), s = N(i, !0);
		O(i);
		var c = F(i, 2), l = F(c, 2), d = (e) => {
			var t = ws(), n = N(t), r = F(n, 2), i = F(r, 2);
			O(t), I(() => si(t, `top: ${z(p).top ?? ""}px; right: ${z(p).right ?? ""}px`)), B("click", n, () => {
				M(f, !1), g();
			}), B("click", r, () => {
				M(f, !1), v(2e3);
			}), B("click", i, () => {
				M(f, !1), v(5e3);
			}), H(e, t);
		};
		W(l, (e) => {
			z(f) && e(d);
		}), O(r), I((e, t) => {
			n.disabled = a(), i.disabled = e, U(s, z(u) ? "…" : "Call"), c.disabled = t;
		}, [() => a() || z(u) || !z(o).trim(), () => a() || !z(o).trim()]), B("keydown", n, (e) => e.key === "Enter" && g()), Si(n, () => z(o), (e) => M(o, e)), B("click", i, g), B("click", c, h), H(e, t);
	};
	W(ne, (e) => {
		z(s) ? e(T) : e(re, -1);
	}), O(te);
	var ie = F(te, 2), ae = (e) => {
		var t = Es(), n = N(t, !0);
		O(t), I(() => U(n, z(d))), H(e, t);
	};
	W(ie, (e) => {
		z(d) && e(ae);
	}), O(b), I(() => {
		U(C, `CALL${z(s) ? " · looped" : ""}`), U(ee, z(s) ? "re-invokes live during a session" : "invoke a result accessor");
	}), H(e, b), Ke();
}
Tr(["click", "keydown"]);
//#endregion
//#region src/ResultSlot.svelte
var ks = /* @__PURE__ */ V("<pre class=\"mono svelte-12h03ym\"> </pre>"), As = /* @__PURE__ */ V("<div class=\"raw svelte-12h03ym\"><button class=\"rawhead mono svelte-12h03ym\"> </button> <!></div>"), js = /* @__PURE__ */ V("<div class=\"empty svelte-12h03ym\"><div class=\"ephead mono svelte-12h03ym\"> </div></div>"), Ms = /* @__PURE__ */ V("<div class=\"slot svelte-12h03ym\"><!></div>");
function Ns(e, t) {
	Ge(t, !0);
	let n = Di(t, "result", 3, null), r = Di(t, "waiting", 3, !1), i = /* @__PURE__ */ k(() => t.adapter.slots?.result), a = /* @__PURE__ */ j(!0), o = /* @__PURE__ */ k(() => {
		try {
			return JSON.stringify(n(), null, 2);
		} catch {
			return String(n());
		}
	});
	var s = Ms(), c = N(s), l = (e) => {
		var r = Mr();
		Xr(P(r), () => z(i), (e, r) => {
			r(e, {
				get result() {
					return n();
				},
				get module() {
					return t.module;
				},
				get version() {
					return t.version;
				}
			});
		}), H(e, r);
	}, u = (e) => {
		var t = As(), n = N(t), r = N(n);
		O(n);
		var i = F(n, 2), s = (e) => {
			var t = ks(), n = N(t, !0);
			O(t), I(() => U(n, z(o))), H(e, t);
		};
		W(i, (e) => {
			z(a) && e(s);
		}), O(t), I(() => U(r, `${z(a) ? "▾" : "▸"} result`)), B("click", n, () => M(a, !z(a))), H(e, t);
	}, d = (e) => {
		var t = js(), n = N(t), i = N(n, !0);
		O(n), O(t), I(() => U(i, r() ? "waiting for the run…" : "no result read yet")), H(e, t);
	};
	W(c, (e) => {
		z(i) && n() !== null ? e(l) : n() === null ? e(d, -1) : e(u, 1);
	}), O(s), H(e, s), Ke();
}
Tr(["click"]);
//#endregion
//#region node_modules/@marijn/find-cluster-break/src/index.js
function Ps(e) {
	if (e < 768) return !1;
	for (let t = 0, n = Us.length;;) {
		let r = t + n >> 1;
		if (e < Us[r]) n = r;
		else if (e >= Ws[r]) t = r + 1;
		else return !0;
		if (t == n) return !1;
	}
}
function Fs(e) {
	return e >= 127462 && e <= 127487;
}
function Is(e, t, n = !0, r = !0) {
	return (n ? Ls : Rs)(e, t, r);
}
function Ls(e, t, n) {
	if (t == e.length) return t;
	t && Bs(e.charCodeAt(t)) && Vs(e.charCodeAt(t - 1)) && t--;
	let r = zs(e, t);
	for (t += Hs(r); t < e.length;) {
		let i = zs(e, t);
		if (r == Gs || i == Gs || n && Ps(i)) t += Hs(i), r = i;
		else if (Fs(i)) {
			let n = 0, r = t - 2;
			for (; r >= 0 && Fs(zs(e, r));) n++, r -= 2;
			if (n % 2 == 0) break;
			t += 2;
		} else break;
	}
	return t;
}
function Rs(e, t, n) {
	for (; t > 1;) {
		let r = Ls(e, t - 2, n);
		if (r < t) return r;
		t--;
	}
	return 0;
}
function zs(e, t) {
	let n = e.charCodeAt(t);
	if (!Vs(n) || t + 1 == e.length) return n;
	let r = e.charCodeAt(t + 1);
	return Bs(r) ? (n - 55296 << 10) + (r - 56320) + 65536 : n;
}
function Bs(e) {
	return e >= 56320 && e < 57344;
}
function Vs(e) {
	return e >= 55296 && e < 56320;
}
function Hs(e) {
	return e < 65536 ? 1 : 2;
}
var Us, Ws, Gs, Ks = t((() => {
	Us = [], Ws = [], (() => {
		let e = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((e) => e ? parseInt(e, 36) : 1);
		for (let t = 0, n = 0; t < e.length; t++) (t % 2 ? Ws : Us).push(n += e[t]);
	})(), Gs = 8205;
})), qs = /* @__PURE__ */ n({
	Annotation: () => hl,
	AnnotationType: () => gl,
	ChangeDesc: () => Jc,
	ChangeSet: () => Yc,
	CharCategory: () => xl,
	Compartment: () => al,
	EditorSelection: () => K,
	EditorState: () => wl,
	Facet: () => q,
	Line: () => Gc,
	MapMode: () => qc,
	Prec: () => rl,
	Range: () => El,
	RangeSet: () => Ol,
	RangeSetBuilder: () => kl,
	RangeValue: () => Tl,
	SelectionRange: () => Zc,
	StateEffect: () => vl,
	StateEffectType: () => _l,
	StateField: () => tl,
	Text: () => G,
	Transaction: () => yl,
	codePointAt: () => tc,
	codePointSize: () => rc,
	combineConfig: () => Dc,
	countColumn: () => Rc,
	findClusterBreak: () => Qs,
	findColumn: () => zc,
	fromCodePoint: () => nc
});
function Js(e) {
	let t = -1;
	for (let n of e) t += n.length + 1;
	return t;
}
function Ys(e, t, n = 0, r = 1e9) {
	for (let i = 0, a = 0, o = !0; a < e.length && i <= r; a++) {
		let s = e[a], c = i + s.length;
		c >= n && (c > r && (s = s.slice(0, r - i)), i < n && (s = s.slice(n - i)), o ? (t[t.length - 1] += s, o = !1) : t.push(s)), i = c + 1;
	}
	return t;
}
function Xs(e, t, n) {
	return Ys(e, [""], t, n);
}
function Zs(e, t, n) {
	return t = Math.max(0, Math.min(e.length, t)), [t, Math.max(t, Math.min(e.length, n))];
}
function Qs(e, t, n = !0, r = !0) {
	return Is(e, t, n, r);
}
function $s(e) {
	return e >= 56320 && e < 57344;
}
function ec(e) {
	return e >= 55296 && e < 56320;
}
function tc(e, t) {
	let n = e.charCodeAt(t);
	if (!ec(n) || t + 1 == e.length) return n;
	let r = e.charCodeAt(t + 1);
	return $s(r) ? (n - 55296 << 10) + (r - 56320) + 65536 : n;
}
function nc(e) {
	return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
}
function rc(e) {
	return e < 65536 ? 1 : 2;
}
function ic(e, t, n, r = !1) {
	if (t == 0 && n <= 0) return;
	let i = e.length - 2;
	i >= 0 && n <= 0 && n == e[i + 1] ? e[i] += t : i >= 0 && t == 0 && e[i] == 0 ? e[i + 1] += n : r ? (e[i] += t, e[i + 1] += n) : e.push(t, n);
}
function ac(e, t, n) {
	if (n.length == 0) return;
	let r = t.length - 2 >> 1;
	if (r < e.length) e[e.length - 1] = e[e.length - 1].append(n);
	else {
		for (; e.length < r;) e.push(G.empty);
		e.push(n);
	}
}
function oc(e, t, n) {
	let r = e.inserted;
	for (let i = 0, a = 0, o = 0; o < e.sections.length;) {
		let s = e.sections[o++], c = e.sections[o++];
		if (c < 0) i += s, a += s;
		else {
			let l = i, u = a, d = G.empty;
			for (; l += s, u += c, c && r && (d = d.append(r[o - 2 >> 1])), !(n || o == e.sections.length || e.sections[o + 1] < 0);) s = e.sections[o++], c = e.sections[o++];
			t(i, l, a, u, d), i = l, a = u;
		}
	}
}
function sc(e, t, n, r = !1) {
	let i = [], a = r ? [] : null, o = new Xc(e), s = new Xc(t);
	for (let e = -1;;) if (o.done && s.len || s.done && o.len) throw Error("Mismatched change set lengths");
	else if (o.ins == -1 && s.ins == -1) {
		let e = Math.min(o.len, s.len);
		ic(i, e, -1), o.forward(e), s.forward(e);
	} else if (s.ins >= 0 && (o.ins < 0 || e == o.i || o.off == 0 && (s.len < o.len || s.len == o.len && !n))) {
		let t = s.len;
		for (ic(i, s.ins, -1); t;) {
			let n = Math.min(o.len, t);
			o.ins >= 0 && e < o.i && o.len <= n && (ic(i, 0, o.ins), a && ac(a, i, o.text), e = o.i), o.forward(n), t -= n;
		}
		s.next();
	} else if (o.ins >= 0) {
		let t = 0, n = o.len;
		for (; n;) if (s.ins == -1) {
			let e = Math.min(n, s.len);
			t += e, n -= e, s.forward(e);
		} else if (s.ins == 0 && s.len < n) n -= s.len, s.next();
		else break;
		ic(i, t, e < o.i ? o.ins : 0), a && e < o.i && ac(a, i, o.text), e = o.i, o.forward(o.len - n);
	} else if (o.done && s.done) return a ? Yc.createSet(i, a) : Jc.create(i);
	else throw Error("Mismatched change set lengths");
}
function cc(e, t, n = !1) {
	let r = [], i = n ? [] : null, a = new Xc(e), o = new Xc(t);
	for (let e = !1;;) if (a.done && o.done) return i ? Yc.createSet(r, i) : Jc.create(r);
	else if (a.ins == 0) ic(r, a.len, 0, e), a.next();
	else if (o.len == 0 && !o.done) ic(r, 0, o.ins, e), i && ac(i, r, o.text), o.next();
	else if (a.done || o.done) throw Error("Mismatched change set lengths");
	else {
		let t = Math.min(a.len2, o.len), n = r.length;
		if (a.ins == -1) {
			let n = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
			ic(r, t, n, e), i && n && ac(i, r, o.text);
		} else o.ins == -1 ? (ic(r, a.off ? 0 : a.len, t, e), i && ac(i, r, a.textBit(t))) : (ic(r, a.off ? 0 : a.len, o.off ? 0 : o.ins, e), i && !o.off && ac(i, r, o.text));
		e = (a.ins > t || o.ins >= 0 && o.len > t) && (e || r.length > n), a.forward2(t), o.forward(t);
	}
}
function lc(e, t) {
	for (let n of e.ranges) if (n.to > t) throw RangeError("Selection points outside of document");
}
function uc(e, t) {
	return e == t || e.length == t.length && e.every((e, n) => e === t[n]);
}
function dc(e, t, n) {
	if (e.length != t.length) return !1;
	for (let r = 0; r < e.length; r++) if (!n(e[r], t[r])) return !1;
	return !0;
}
function fc(e, t) {
	let n = !1;
	for (let r of t) gc(e, r) & 1 && (n = !0);
	return n;
}
function pc(e, t, n) {
	let r = n.map((t) => e[t.id]), i = n.map((e) => e.type), a = r.filter((e) => !(e & 1)), o = e[t.id] >> 1;
	function s(e) {
		let n = [];
		for (let t = 0; t < r.length; t++) {
			let a = _c(e, r[t]);
			if (i[t] == 2) for (let e of a) n.push(e);
			else n.push(a);
		}
		return t.combine(n);
	}
	return {
		create(e) {
			for (let t of r) gc(e, t);
			return e.values[o] = s(e), 1;
		},
		update(e, n) {
			if (!fc(e, a)) return 0;
			let r = s(e);
			return t.compare(r, e.values[o]) ? 0 : (e.values[o] = r, 1);
		},
		reconfigure(e, i) {
			let a = fc(e, r), c = i.config.facets[t.id], l = i.facet(t);
			if (c && !a && uc(n, c)) return e.values[o] = l, 0;
			let u = s(e);
			return t.compare(u, l) ? (e.values[o] = l, 0) : (e.values[o] = u, 1);
		}
	};
}
function mc(e) {
	return (t) => new il(t, e);
}
function hc(e, t, n) {
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
			t > -1 && r[s].splice(t, 1), e instanceof ol && n.delete(e.compartment);
		}
		if (i.set(e, o), Array.isArray(e)) for (let t of e) a(t, o);
		else if (e instanceof ol) {
			if (n.has(e.compartment)) throw RangeError("Duplicate use of compartment in extensions");
			let r = t.get(e.compartment) || e.inner;
			n.set(e.compartment, r), a(r, o);
		} else if (e instanceof il) a(e.inner, e.prec);
		else if (e instanceof tl) r[o].push(e), e.provides && a(e.provides, o);
		else if (e instanceof $c) r[o].push(e), e.facet.extensions && a(e.facet.extensions, nl.default);
		else {
			let t = e.extension;
			if (!t) throw Error(`Unrecognized extension value in extension set (${e}).`);
			if (t == e) throw Error(`Unrecognized extension value in extension set (${e}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
			a(t, o);
		}
	}
	return a(e, nl.default), r.reduce((e, t) => e.concat(t));
}
function gc(e, t) {
	if (t & 1) return 2;
	let n = t >> 1, r = e.status[n];
	if (r == 4) throw Error("Cyclic dependency between fields and/or facets");
	if (r & 2) return r;
	e.status[n] = 4;
	let i = e.computeSlot(e, e.config.dynamicSlots[n]);
	return e.status[n] = 2 | i;
}
function _c(e, t) {
	return t & 1 ? e.config.staticValues[t >> 1] : e.values[t >> 1];
}
function vc(e, t) {
	let n = [];
	for (let r = 0, i = 0;;) {
		let a, o;
		if (r < e.length && (i == t.length || t[i] >= e[r])) a = e[r++], o = e[r++];
		else if (i < t.length) a = t[i++], o = t[i++];
		else return n;
		!n.length || n[n.length - 1] < a ? n.push(a, o) : n[n.length - 1] < o && (n[n.length - 1] = o);
	}
}
function yc(e, t, n) {
	let r, i, a;
	return n ? (r = t.changes, i = Yc.empty(t.changes.length), a = e.changes.compose(t.changes)) : (r = t.changes.map(e.changes), i = e.changes.mapDesc(t.changes, !0), a = e.changes.compose(r)), {
		changes: a,
		selection: t.selection ? t.selection.map(i) : e.selection?.map(r),
		effects: vl.mapEffects(e.effects, r).concat(vl.mapEffects(t.effects, i)),
		annotations: e.annotations.length ? e.annotations.concat(t.annotations) : t.annotations,
		scrollIntoView: e.scrollIntoView || t.scrollIntoView
	};
}
function bc(e, t, n) {
	let r = t.selection, i = wc(t.annotations);
	return t.userEvent && (i = i.concat(yl.userEvent.of(t.userEvent))), {
		changes: t.changes instanceof Yc ? t.changes : Yc.of(t.changes || [], n, e.facet(ul)),
		selection: r && (r instanceof K ? r : K.single(r.anchor, r.head)),
		effects: wc(t.effects),
		annotations: i,
		scrollIntoView: !!t.scrollIntoView
	};
}
function xc(e, t, n) {
	let r = bc(e, t.length ? t[0] : {}, e.doc.length);
	t.length && t[0].filter === !1 && (n = !1);
	for (let i = 1; i < t.length; i++) {
		t[i].filter === !1 && (n = !1);
		let a = !!t[i].sequential;
		r = yc(r, bc(e, t[i], a ? r.changes.newLength : e.doc.length), a);
	}
	let i = yl.create(e, r.changes, r.selection, r.effects, r.annotations, r.scrollIntoView);
	return Cc(n ? Sc(i) : i);
}
function Sc(e) {
	let t = e.startState, n = !0;
	for (let r of t.facet(dl)) {
		let t = r(e);
		if (t === !1) {
			n = !1;
			break;
		}
		Array.isArray(t) && (n = n === !0 ? t : vc(n, t));
	}
	if (n !== !0) {
		let r, i;
		if (n === !1) i = e.changes.invertedDesc, r = Yc.empty(t.doc.length);
		else {
			let t = e.changes.filter(n);
			r = t.changes, i = t.filtered.mapDesc(t.changes).invertedDesc;
		}
		e = yl.create(t, r, e.selection && e.selection.map(i), vl.mapEffects(e.effects, i), e.annotations, e.scrollIntoView);
	}
	let r = t.facet(fl);
	for (let n = r.length - 1; n >= 0; n--) {
		let i = r[n](e);
		e = i instanceof yl ? i : Array.isArray(i) && i.length == 1 && i[0] instanceof yl ? i[0] : xc(t, wc(i), !1);
	}
	return e;
}
function Cc(e) {
	let t = e.startState, n = t.facet(pl), r = e;
	for (let i = n.length - 1; i >= 0; i--) {
		let a = n[i](e);
		a && Object.keys(a).length && (r = yc(r, bc(t, a, e.changes.newLength), !0));
	}
	return r == e ? e : yl.create(t, e.changes, e.selection, r.effects, r.annotations, r.scrollIntoView);
}
function wc(e) {
	return e == null ? bl : Array.isArray(e) ? e : [e];
}
function Tc(e) {
	if (Cl) return Cl.test(e);
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (/\w/.test(n) || n > "" && (n.toUpperCase() != n.toLowerCase() || Sl.test(n))) return !0;
	}
	return !1;
}
function Ec(e) {
	return (t) => {
		if (!/\S/.test(t)) return xl.Space;
		if (Tc(t)) return xl.Word;
		for (let n = 0; n < e.length; n++) if (t.indexOf(e[n]) > -1) return xl.Word;
		return xl.Other;
	};
}
function Dc(e, t, n = {}) {
	let r = {};
	for (let t of e) for (let e of Object.keys(t)) {
		let i = t[e], a = r[e];
		if (a === void 0) r[e] = i;
		else if (!(a === i || i === void 0)) if (Object.hasOwnProperty.call(n, e)) r[e] = n[e](a, i);
		else throw Error("Config merge conflict for field " + e);
	}
	for (let e in t) r[e] === void 0 && (r[e] = t[e]);
	return r;
}
function Oc(e, t) {
	return e == t || e.constructor == t.constructor && e.eq(t);
}
function kc(e, t) {
	return e.from - t.from || e.value.startSide - t.value.startSide;
}
function Ac(e) {
	if (e.length > 1) for (let t = e[0], n = 1; n < e.length; n++) {
		let r = e[n];
		if (kc(t, r) > 0) return e.slice().sort(kc);
		t = r;
	}
	return e;
}
function jc(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let t of e) for (let e = 0; e < t.chunk.length; e++) t.chunk[e].maxPoint <= 0 && r.set(t.chunk[e], t.chunkPos[e]);
	let i = /* @__PURE__ */ new Set();
	for (let e of t) for (let t = 0; t < e.chunk.length; t++) {
		let a = r.get(e.chunk[t]);
		a != null && (n ? n.mapPos(a) : a) == e.chunkPos[t] && !n?.touchesRange(a, a + e.chunk[t].length) && i.add(e.chunk[t]);
	}
	return i;
}
function Mc(e, t) {
	for (let n = e[t];;) {
		let r = (t << 1) + 1;
		if (r >= e.length) break;
		let i = e[r];
		if (r + 1 < e.length && i.compare(e[r + 1]) >= 0 && (i = e[r + 1], r++), n.compare(i) < 0) break;
		e[r] = n, e[t] = i, t = r;
	}
}
function Nc(e, t, n, r, i, a) {
	e.goto(t), n.goto(r);
	let o = r + i, s = r, c = r - t, l = !!a.boundChange;
	for (let t = !1;;) {
		let r = e.to + c - n.to, i = r || e.endSide - n.endSide, u = i < 0 ? e.to + c : n.to, d = Math.min(u, o);
		if (e.point || n.point ? (e.point && n.point && Oc(e.point, n.point) && Pc(e.activeForPoint(e.to), n.activeForPoint(n.to)) || a.comparePoint(s, d, e.point, n.point), t = !1) : (t && a.boundChange(s), d > s && !Pc(e.active, n.active) && a.compareRange(s, d, e.active, n.active), l && d < o && (r || e.openEnd(u) != n.openEnd(u)) && (t = !0)), u > o) break;
		s = u, i <= 0 && e.next(), i >= 0 && n.next();
	}
}
function Pc(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (e[n] != t[n] && !Oc(e[n], t[n])) return !1;
	return !0;
}
function Fc(e, t) {
	for (let n = t, r = e.length - 1; n < r; n++) e[n] = e[n + 1];
	e.pop();
}
function Ic(e, t, n) {
	for (let n = e.length - 1; n >= t; n--) e[n + 1] = e[n];
	e[t] = n;
}
function Lc(e, t) {
	let n = -1, r = 1e9;
	for (let i = 0; i < t.length; i++) (t[i] - r || e[i].endSide - e[n].endSide) < 0 && (n = i, r = t[i]);
	return n;
}
function Rc(e, t, n = e.length) {
	let r = 0;
	for (let i = 0; i < n && i < e.length;) e.charCodeAt(i) == 9 ? (r += t - r % t, i++) : (r++, i = Qs(e, i));
	return r;
}
function zc(e, t, n, r) {
	for (let r = 0, i = 0;;) {
		if (i >= t) return r;
		if (r == e.length) break;
		i += e.charCodeAt(r) == 9 ? n - i % n : 1, r = Qs(e, r);
	}
	return r === !0 ? -1 : e.length;
}
var G, Bc, Vc, Hc, Uc, Wc, Gc, Kc, qc, Jc, Yc, Xc, Zc, K, Qc, q, $c, el, tl, nl, rl, il, al, ol, sl, cl, ll, ul, dl, fl, pl, ml, hl, gl, _l, vl, yl, bl, xl, Sl, Cl, wl, Tl, El, Dl, Ol, kl, Al, jl, Ml, Nl = t((() => {
	Ks(), G = class e {
		lineAt(e) {
			if (e < 0 || e > this.length) throw RangeError(`Invalid position ${e} in document of length ${this.length}`);
			return this.lineInner(e, !1, 1, 0);
		}
		line(e) {
			if (e < 1 || e > this.lines) throw RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
			return this.lineInner(e, !0, 1, 0);
		}
		replace(e, t, n) {
			[e, t] = Zs(this, e, t);
			let r = [];
			return this.decompose(0, e, r, 2), n.length && n.decompose(0, n.length, r, 3), this.decompose(t, this.length, r, 1), Vc.from(r, this.length - (t - e) + n.length);
		}
		append(e) {
			return this.replace(this.length, this.length, e);
		}
		slice(e, t = this.length) {
			[e, t] = Zs(this, e, t);
			let n = [];
			return this.decompose(e, t, n, 0), Vc.from(n, t - e);
		}
		eq(e) {
			if (e == this) return !0;
			if (e.length != this.length || e.lines != this.lines) return !1;
			let t = this.scanIdentical(e, 1), n = this.length - this.scanIdentical(e, -1), r = new Hc(this), i = new Hc(e);
			for (let e = t, a = t;;) {
				if (r.next(e), i.next(e), e = 0, r.lineBreak != i.lineBreak || r.done != i.done || r.value != i.value) return !1;
				if (a += r.value.length, r.done || a >= n) return !0;
			}
		}
		iter(e = 1) {
			return new Hc(this, e);
		}
		iterRange(e, t = this.length) {
			return new Uc(this, e, t);
		}
		iterLines(e, t) {
			let n;
			if (e == null) n = this.iter();
			else {
				t ??= this.lines + 1;
				let r = this.line(e).from;
				n = this.iterRange(r, Math.max(r, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
			}
			return new Wc(n);
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
			return t.length == 1 && !t[0] ? e.empty : t.length <= 32 ? new Bc(t) : Vc.from(Bc.split(t, []));
		}
	}, Bc = class e extends G {
		constructor(e, t = Js(e)) {
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
				if ((t ? n : o) >= e) return new Gc(r, o, n, a);
				r = o + 1, n++;
			}
		}
		decompose(t, n, r, i) {
			let a = t <= 0 && n >= this.length ? this : new e(Xs(this.text, t, n), Math.min(n, this.length) - Math.max(0, t));
			if (i & 1) {
				let t = r.pop(), n = Ys(a.text, t.text.slice(), 0, a.length);
				if (n.length <= 32) r.push(new e(n, t.length + a.length));
				else {
					let t = n.length >> 1;
					r.push(new e(n.slice(0, t)), new e(n.slice(t)));
				}
			} else r.push(a);
		}
		replace(t, n, r) {
			if (!(r instanceof e)) return super.replace(t, n, r);
			[t, n] = Zs(this, t, n);
			let i = Ys(this.text, Ys(r.text, Xs(this.text, 0, t)), n), a = this.length + r.length - (n - t);
			return i.length <= 32 ? new e(i, a) : Vc.from(e.split(i, []), a);
		}
		sliceString(e, t = this.length, n = "\n") {
			[e, t] = Zs(this, e, t);
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
	}, Vc = class e extends G {
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
			if ([t, n] = Zs(this, t, n), r.lines < this.lines) for (let i = 0, a = 0; i < this.children.length; i++) {
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
			[e, t] = Zs(this, e, t);
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
				return new Bc(e, n);
			}
			let i = Math.max(32, r >> 5), a = i << 1, o = i >> 1, s = [], c = 0, l = -1, u = [];
			function d(t) {
				let n;
				if (t.lines > a && t instanceof e) for (let e of t.children) d(e);
				else t.lines > o && (c > o || !c) ? (f(), s.push(t)) : t instanceof Bc && c && (n = u[u.length - 1]) instanceof Bc && t.lines + n.lines <= 32 ? (c += t.lines, l += t.length + 1, u[u.length - 1] = new Bc(n.text.concat(t.text), n.length + 1 + t.length)) : (c + t.lines > i && f(), c += t.lines, l += t.length + 1, u.push(t));
			}
			function f() {
				c != 0 && (s.push(u.length == 1 ? u[0] : e.from(u, l)), l = -1, c = u.length = 0);
			}
			for (let e of t) d(e);
			return f(), s.length == 1 ? s[0] : new e(s, n);
		}
	}, G.empty = /*@__PURE__*/ new Bc([""], 0), Hc = class {
		constructor(e, t = 1) {
			this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof Bc ? e.text.length : e.children.length) << 1];
		}
		nextInner(e, t) {
			for (this.done = this.lineBreak = !1;;) {
				let n = this.nodes.length - 1, r = this.nodes[n], i = this.offsets[n], a = i >> 1, o = r instanceof Bc ? r.text.length : r.children.length;
				if (a == (t > 0 ? o : 0)) {
					if (n == 0) return this.done = !0, this.value = "", this;
					t > 0 && this.offsets[n - 1]++, this.nodes.pop(), this.offsets.pop();
				} else if ((i & 1) == (t > 0 ? 0 : 1)) {
					if (this.offsets[n] += t, e == 0) return this.lineBreak = !0, this.value = "\n", this;
					e--;
				} else if (r instanceof Bc) {
					let i = r.text[a + (t < 0 ? -1 : 0)];
					if (this.offsets[n] += t, i.length > Math.max(0, e)) return this.value = e == 0 ? i : t > 0 ? i.slice(e) : i.slice(0, i.length - e), this;
					e -= i.length;
				} else {
					let i = r.children[a + (t < 0 ? -1 : 0)];
					e > i.length ? (e -= i.length, this.offsets[n] += t) : (t < 0 && this.offsets[n]--, this.nodes.push(i), this.offsets.push(t > 0 ? 1 : (i instanceof Bc ? i.text.length : i.children.length) << 1));
				}
			}
		}
		next(e = 0) {
			return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
		}
	}, Uc = class {
		constructor(e, t, n) {
			this.value = "", this.done = !1, this.cursor = new Hc(e, t > n ? -1 : 1), this.pos = t > n ? e.length : 0, this.from = Math.min(t, n), this.to = Math.max(t, n);
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
	}, Wc = class {
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
	}, typeof Symbol < "u" && (G.prototype[Symbol.iterator] = function() {
		return this.iter();
	}, Hc.prototype[Symbol.iterator] = Uc.prototype[Symbol.iterator] = Wc.prototype[Symbol.iterator] = function() {
		return this;
	}), Gc = class {
		constructor(e, t, n, r) {
			this.from = e, this.to = t, this.number = n, this.text = r;
		}
		get length() {
			return this.to - this.from;
		}
	}, Kc = /\r\n?|\n/, qc = /*@__PURE__*/ (function(e) {
		return e[e.Simple = 0] = "Simple", e[e.TrackDel = 1] = "TrackDel", e[e.TrackBefore = 2] = "TrackBefore", e[e.TrackAfter = 3] = "TrackAfter", e;
	})(qc ||= {}), Jc = class e {
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
			oc(this, e, t);
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
			return this.empty ? e : e.empty ? this : cc(this, e);
		}
		mapDesc(e, t = !1) {
			return e.empty ? this : sc(this, e, t);
		}
		mapPos(e, t = -1, n = qc.Simple) {
			let r = 0, i = 0;
			for (let a = 0; a < this.sections.length;) {
				let o = this.sections[a++], s = this.sections[a++], c = r + o;
				if (s < 0) {
					if (c > e) return i + (e - r);
					i += o;
				} else {
					if (n != qc.Simple && c >= e && (n == qc.TrackDel && r < e && c > e || n == qc.TrackBefore && r < e || n == qc.TrackAfter && c > e)) return null;
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
	}, Yc = class e extends Jc {
		constructor(e, t) {
			super(e), this.inserted = t;
		}
		apply(e) {
			if (this.length != e.length) throw RangeError("Applying change set to a document with the wrong length");
			return oc(this, (t, n, r, i, a) => e = e.replace(r, r + (n - t), a), !1), e;
		}
		mapDesc(e, t = !1) {
			return sc(this, e, t, !0);
		}
		invert(t) {
			let n = this.sections.slice(), r = [];
			for (let e = 0, i = 0; e < n.length; e += 2) {
				let a = n[e], o = n[e + 1];
				if (o >= 0) {
					n[e] = o, n[e + 1] = a;
					let s = e >> 1;
					for (; r.length < s;) r.push(G.empty);
					r.push(a ? t.slice(i, i + a) : G.empty);
				}
				i += a;
			}
			return new e(n, r);
		}
		compose(e) {
			return this.empty ? e : e.empty ? this : cc(this, e, !0);
		}
		map(e, t = !1) {
			return e.empty ? this : sc(this, e, t, !0);
		}
		iterChanges(e, t = !1) {
			oc(this, e, t);
		}
		get desc() {
			return Jc.create(this.sections);
		}
		filter(t) {
			let n = [], r = [], i = [], a = new Xc(this);
			done: for (let e = 0, o = 0;;) {
				let s = e == t.length ? 1e9 : t[e++];
				for (; o < s || o == s && a.len == 0;) {
					if (a.done) break done;
					let e = Math.min(a.len, s - o);
					ic(i, e, -1);
					let t = a.ins == -1 ? -1 : a.off == 0 ? a.ins : 0;
					ic(n, e, t), t > 0 && ac(r, n, a.text), a.forward(e), o += e;
				}
				let c = t[e++];
				for (; o < c;) {
					if (a.done) break done;
					let e = Math.min(a.len, c - o);
					ic(n, e, -1), ic(i, e, a.ins == -1 ? -1 : a.off == 0 ? a.ins : 0), a.forward(e), o += e;
				}
			}
			return {
				changes: new e(n, r),
				filtered: Jc.create(i)
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
				o < n && ic(i, n - o, -1);
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
					let u = l ? typeof l == "string" ? G.of(l.split(r || Kc)) : l : G.empty, d = u.length;
					if (e == s && d == 0) return;
					e < o && c(), e > o && ic(i, e - o, -1), ic(i, s - e, d), ac(a, i, u), o = s;
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
					for (; r.length < e;) r.push(G.empty);
					r[e] = G.of(i.slice(1)), n.push(i[0], r[e].length);
				}
			}
			return new e(n, r);
		}
		static createSet(t, n) {
			return new e(t, n);
		}
	}, Xc = class {
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
			return t >= e.length ? G.empty : e[t];
		}
		textBit(e) {
			let { inserted: t } = this.set, n = this.i - 2 >> 1;
			return n >= t.length && !e ? G.empty : t[n].slice(this.off, e == null ? void 0 : this.off + e);
		}
		forward(e) {
			e == this.len ? this.next() : (this.len -= e, this.off += e);
		}
		forward2(e) {
			this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
		}
	}, Zc = class e {
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
			return new e(t.ranges.map((e) => Zc.fromJSON(e)), t.main);
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
			return Zc.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (n == null ? 7 : Math.min(6, n)), r);
		}
		static range(e, t, n, r, i) {
			let a = r == null ? 7 : Math.min(6, r);
			return !i && e != t && (i = t < e ? 1 : -1), i && (a |= i < 0 ? 8 : 16), t < e ? Zc.create(t, e, a | 32, n) : Zc.create(e, t, a, n);
		}
		static undirectionalRange(e, t) {
			return Zc.create(e, t, 64, void 0);
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
	}, Qc = 0, q = class e {
		constructor(e, t, n, r, i) {
			this.combine = e, this.compareInput = t, this.compare = n, this.isStatic = r, this.id = Qc++, this.default = e([]), this.extensions = typeof i == "function" ? i(this) : i;
		}
		get reader() {
			return this;
		}
		static define(t = {}) {
			return new e(t.combine || ((e) => e), t.compareInput || ((e, t) => e === t), t.compare || (t.combine ? (e, t) => e === t : uc), !!t.static, t.enables);
		}
		of(e) {
			return new $c([], this, 0, e);
		}
		compute(e, t) {
			if (this.isStatic) throw Error("Can't compute a static facet");
			return new $c(e, this, 1, t);
		}
		computeN(e, t) {
			if (this.isStatic) throw Error("Can't compute a static facet");
			return new $c(e, this, 2, t);
		}
		from(e, t) {
			return t ||= (e) => e, this.compute([e], (n) => t(n.field(e)));
		}
	}, $c = class {
		constructor(e, t, n, r) {
			this.dependencies = e, this.facet = t, this.type = n, this.value = r, this.id = Qc++;
		}
		dynamicSlot(e) {
			let t = this.value, n = this.facet.compareInput, r = this.id, i = e[r] >> 1, a = this.type == 2, o = !1, s = !1, c = [];
			for (let t of this.dependencies) t == "doc" ? o = !0 : t == "selection" ? s = !0 : (e[t.id] ?? 1) & 1 || c.push(e[t.id]);
			return {
				create(e) {
					return e.values[i] = t(e), 1;
				},
				update(e, r) {
					if (o && r.docChanged || s && (r.docChanged || r.selection) || fc(e, c)) {
						let r = t(e);
						if (a ? !dc(r, e.values[i], n) : !n(r, e.values[i])) return e.values[i] = r, 1;
					}
					return 0;
				},
				reconfigure: (e, o) => {
					let s, c = o.config.address[r];
					if (c != null) {
						let r = _c(o, c);
						if (this.dependencies.every((t) => t instanceof q ? o.facet(t) === e.facet(t) : t instanceof tl ? o.field(t, !1) == e.field(t, !1) : !0) || (a ? dc(s = t(e), r, n) : n(s = t(e), r))) return e.values[i] = r, 0;
					} else s = t(e);
					return e.values[i] = s, 1;
				}
			};
		}
		get extension() {
			return this;
		}
	}, el = /*@__PURE__*/ q.define({ static: !0 }), tl = class e {
		constructor(e, t, n, r, i) {
			this.id = e, this.createF = t, this.updateF = n, this.compareF = r, this.spec = i, this.provides = void 0;
		}
		static define(t) {
			let n = new e(Qc++, t.create, t.update, t.compare || ((e, t) => e === t), t);
			return t.provide && (n.provides = t.provide(n)), n;
		}
		create(e) {
			return (e.facet(el).find((e) => e.field == this)?.create || this.createF)(e);
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
					let r = e.facet(el), i = n.facet(el), a;
					return (a = r.find((e) => e.field == this)) && a != i.find((e) => e.field == this) ? (e.values[t] = a.create(e), 1) : n.config.address[this.id] == null ? (e.values[t] = this.create(e), 1) : (e.values[t] = n.field(this), 0);
				}
			};
		}
		init(e) {
			return [this, el.of({
				field: this,
				create: e
			})];
		}
		get extension() {
			return this;
		}
	}, nl = {
		lowest: 4,
		low: 3,
		default: 2,
		high: 1,
		highest: 0
	}, rl = {
		highest: /*@__PURE__*/ mc(nl.highest),
		high: /*@__PURE__*/ mc(nl.high),
		default: /*@__PURE__*/ mc(nl.default),
		low: /*@__PURE__*/ mc(nl.low),
		lowest: /*@__PURE__*/ mc(nl.lowest)
	}, il = class {
		constructor(e, t) {
			this.inner = e, this.prec = t;
		}
		get extension() {
			return this;
		}
	}, al = class e {
		of(e) {
			return new ol(this, e);
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
	}, ol = class {
		constructor(e, t) {
			this.compartment = e, this.inner = t;
		}
		get extension() {
			return this;
		}
	}, sl = class e {
		constructor(e, t, n, r, i, a) {
			for (this.base = e, this.compartments = t, this.dynamicSlots = n, this.address = r, this.staticValues = i, this.facets = a, this.statusTemplate = []; this.statusTemplate.length < n.length;) this.statusTemplate.push(0);
		}
		staticFacet(e) {
			let t = this.address[e.id];
			return t == null ? e.default : this.staticValues[t >> 1];
		}
		static resolve(t, n, r) {
			let i = [], a = Object.create(null), o = /* @__PURE__ */ new Map();
			for (let e of hc(t, n, o)) e instanceof tl ? i.push(e) : (a[e.facet.id] || (a[e.facet.id] = [])).push(e);
			let s = Object.create(null), c = [], l = [];
			for (let e of i) s[e.id] = l.length << 1, l.push((t) => e.slot(t));
			let u = r?.config.facets;
			for (let e in a) {
				let t = a[e], n = t[0].facet, i = u && u[e] || [];
				if (t.every((e) => e.type == 0)) if (s[n.id] = c.length << 1 | 1, uc(i, t)) c.push(r.facet(n));
				else {
					let e = n.combine(t.map((e) => e.value));
					c.push(r && n.compare(e, r.facet(n)) ? r.facet(n) : e);
				}
				else {
					for (let e of t) e.type == 0 ? (s[e.id] = c.length << 1 | 1, c.push(e.value)) : (s[e.id] = l.length << 1, l.push((t) => e.dynamicSlot(t)));
					s[n.id] = l.length << 1, l.push((e) => pc(e, n, t));
				}
			}
			let d = l.map((e) => e(s));
			return new e(t, o, d, s, c, a);
		}
	}, cl = /*@__PURE__*/ q.define(), ll = /*@__PURE__*/ q.define({
		combine: (e) => e.some((e) => e),
		static: !0
	}), ul = /*@__PURE__*/ q.define({
		combine: (e) => e.length ? e[0] : void 0,
		static: !0
	}), dl = /*@__PURE__*/ q.define(), fl = /*@__PURE__*/ q.define(), pl = /*@__PURE__*/ q.define(), ml = /*@__PURE__*/ q.define({ combine: (e) => e.length ? e[0] : !1 }), hl = class {
		constructor(e, t) {
			this.type = e, this.value = t;
		}
		static define() {
			return new gl();
		}
	}, gl = class {
		of(e) {
			return new hl(this, e);
		}
	}, _l = class {
		constructor(e) {
			this.map = e;
		}
		of(e) {
			return new vl(this, e);
		}
	}, vl = class e {
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
			return new _l(e.map || ((e) => e));
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
	}, vl.reconfigure = /*@__PURE__*/ vl.define(), vl.appendConfig = /*@__PURE__*/ vl.define(), yl = class e {
		constructor(t, n, r, i, a, o) {
			this.startState = t, this.changes = n, this.selection = r, this.effects = i, this.annotations = a, this.scrollIntoView = o, this._doc = null, this._state = null, r && lc(r, n.newLength), a.some((t) => t.type == e.time) || (this.annotations = a.concat(e.time.of(Date.now())));
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
	}, yl.time = /*@__PURE__*/ hl.define(), yl.userEvent = /*@__PURE__*/ hl.define(), yl.addToHistory = /*@__PURE__*/ hl.define(), yl.remote = /*@__PURE__*/ hl.define(), bl = [], xl = /*@__PURE__*/ (function(e) {
		return e[e.Word = 0] = "Word", e[e.Space = 1] = "Space", e[e.Other = 2] = "Other", e;
	})(xl ||= {}), Sl = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
	try {
		Cl = /*@__PURE__*/ RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
	} catch {}
	wl = class e {
		constructor(e, t, n, r, i, a) {
			this.config = e, this.doc = t, this.selection = n, this.values = r, this.status = e.statusTemplate.slice(), this.computeSlot = i, a && (a._state = this);
			for (let e = 0; e < this.config.dynamicSlots.length; e++) gc(this, e << 1);
			this.computeSlot = null;
		}
		field(e, t = !0) {
			let n = this.config.address[e.id];
			if (n == null) {
				if (t) throw RangeError("Field is not present in this state");
				return;
			}
			return gc(this, n), _c(this, n);
		}
		update(...e) {
			return xc(this, e, !0);
		}
		applyTransaction(t) {
			let n = this.config, { base: r, compartments: i } = n;
			for (let e of t.effects) e.is(al.reconfigure) ? (n &&= (i = /* @__PURE__ */ new Map(), n.compartments.forEach((e, t) => i.set(t, e)), null), i.set(e.value.compartment, e.value.extension)) : e.is(vl.reconfigure) ? (n = null, r = e.value) : e.is(vl.appendConfig) && (n = null, r = wc(r).concat(e.value));
			let a;
			n ? a = t.startState.values.slice() : (n = sl.resolve(r, i, this), a = new e(n, this.doc, this.selection, n.dynamicSlots.map(() => null), (e, t) => t.reconfigure(e, this), null).values);
			let o = t.startState.facet(ll) ? t.newSelection : t.newSelection.asSingle();
			new e(n, t.newDoc, o, a, (e, n) => n.update(e, t), t);
		}
		replaceSelection(e) {
			return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
				changes: {
					from: t.from,
					to: t.to,
					insert: e
				},
				range: K.cursor(t.from + e.length)
			}));
		}
		changeByRange(e) {
			let t = this.selection, n = e(t.ranges[0]), r = this.changes(n.changes), i = [n.range], a = wc(n.effects);
			for (let n = 1; n < t.ranges.length; n++) {
				let o = e(t.ranges[n]), s = this.changes(o.changes), c = s.map(r);
				for (let e = 0; e < n; e++) i[e] = i[e].map(c);
				let l = r.mapDesc(s, !0);
				i.push(o.range.map(l)), r = r.compose(c), a = vl.mapEffects(a, c).concat(vl.mapEffects(wc(o.effects), l));
			}
			return {
				changes: r,
				selection: K.create(i, t.mainIndex),
				effects: a
			};
		}
		changes(t = []) {
			return t instanceof Yc ? t : Yc.of(t, this.doc.length, this.facet(e.lineSeparator));
		}
		toText(t) {
			return G.of(t.split(this.facet(e.lineSeparator) || Kc));
		}
		sliceDoc(e = 0, t = this.doc.length) {
			return this.doc.sliceString(e, t, this.lineBreak);
		}
		facet(e) {
			let t = this.config.address[e.id];
			return t == null ? e.default : (gc(this, t), _c(this, t));
		}
		toJSON(e) {
			let t = {
				doc: this.sliceDoc(),
				selection: this.selection.toJSON()
			};
			if (e) for (let n in e) {
				let r = e[n];
				r instanceof tl && this.config.address[r.id] != null && (t[n] = r.spec.toJSON(this.field(e[n]), this));
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
			let n = sl.resolve(t.extensions || [], /* @__PURE__ */ new Map()), r = t.doc instanceof G ? t.doc : G.of((t.doc || "").split(n.staticFacet(e.lineSeparator) || Kc)), i = t.selection ? t.selection instanceof K ? t.selection : K.single(t.selection.anchor, t.selection.head) : K.single(0);
			return lc(i, r.length), n.staticFacet(ll) || (i = i.asSingle()), new e(n, r, i, n.dynamicSlots.map(() => null), (e, t) => t.create(e), null);
		}
		get tabSize() {
			return this.facet(e.tabSize);
		}
		get lineBreak() {
			return this.facet(e.lineSeparator) || "\n";
		}
		get readOnly() {
			return this.facet(ml);
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
			for (let i of this.facet(cl)) for (let a of i(this, t, n)) Object.prototype.hasOwnProperty.call(a, e) && r.push(a[e]);
			return r;
		}
		charCategorizer(e) {
			let t = this.languageDataAt("wordChars", e);
			return Ec(t.length ? t[0] : "");
		}
		wordAt(e) {
			let { text: t, from: n, length: r } = this.doc.lineAt(e), i = this.charCategorizer(e), a = e - n, o = e - n;
			for (; a > 0;) {
				let e = Qs(t, a, !1);
				if (i(t.slice(e, a)) != xl.Word) break;
				a = e;
			}
			for (; o < r;) {
				let e = Qs(t, o);
				if (i(t.slice(o, e)) != xl.Word) break;
				o = e;
			}
			return a == o ? null : K.range(a + n, o + n);
		}
	}, wl.allowMultipleSelections = ll, wl.tabSize = /*@__PURE__*/ q.define({ combine: (e) => e.length ? e[0] : 4 }), wl.lineSeparator = ul, wl.readOnly = ml, wl.phrases = /*@__PURE__*/ q.define({ compare(e, t) {
		let n = Object.keys(e), r = Object.keys(t);
		return n.length == r.length && n.every((n) => e[n] == t[n]);
	} }), wl.languageData = cl, wl.changeFilter = dl, wl.transactionFilter = fl, wl.transactionExtender = pl, al.reconfigure = /*@__PURE__*/ vl.define(), Tl = class {
		eq(e) {
			return this == e;
		}
		range(e, t = e) {
			return El.create(e, t, this);
		}
	}, Tl.prototype.startSide = Tl.prototype.endSide = 0, Tl.prototype.point = !1, Tl.prototype.mapMode = qc.TrackDel, El = class e {
		constructor(e, t, n) {
			this.from = e, this.to = t, this.value = n;
		}
		static create(t, n, r) {
			return new e(t, n, r);
		}
	}, Dl = class e {
		constructor(e, t, n, r) {
			this.from = e, this.to = t, this.value = n, this.maxPoint = r;
		}
		get length() {
			return this.to[this.to.length - 1];
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
		map(t, n) {
			let r = [], i = [], a = [], o = -1, s = -1;
			for (let e = 0; e < this.value.length; e++) {
				let c = this.value[e], l = this.from[e] + t, u = this.to[e] + t, d, f;
				if (l == u) {
					let e = n.mapPos(l, c.startSide, c.mapMode);
					if (e == null || (d = f = e, c.startSide != c.endSide && (f = n.mapPos(l, c.endSide), f < d))) continue;
				} else if (d = n.mapPos(l, c.startSide), f = n.mapPos(u, c.endSide), d > f || d == f && c.startSide > 0 && c.endSide <= 0) continue;
				(f - d || c.endSide - c.startSide) < 0 || (o < 0 && (o = d), c.point && (s = Math.max(s, f - d)), r.push(c), i.push(d - o), a.push(f - o));
			}
			return {
				mapped: r.length ? new e(i, a, r, s) : null,
				pos: o
			};
		}
	}, Ol = class e {
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
			if (r && (n = n.slice().sort(kc)), this.isEmpty) return n.length ? e.of(n) : this;
			let s = new Al(this, null, -1).goto(0), c = 0, l = [], u = new kl();
			for (; s.value || c < n.length;) if (c < n.length && (s.from - n[c].from || s.startSide - n[c].value.startSide) >= 0) {
				let e = n[c++];
				u.addInner(e.from, e.to, e.value) || l.push(e);
			} else s.rangeIndex == 1 && s.chunkIndex < this.chunk.length && (c == n.length || this.chunkEnd(s.chunkIndex) < n[c].from) && (!o || i > this.chunkEnd(s.chunkIndex) || a < this.chunkPos[s.chunkIndex]) && u.addChunk(this.chunkPos[s.chunkIndex], this.chunk[s.chunkIndex]) ? s.nextChunk() : ((!o || i > s.to || a < s.from || o(s.from, s.to, s.value)) && (u.addInner(s.from, s.to, s.value) || l.push(El.create(s.from, s.to, s.value))), s.next());
			return u.finishInner(this.nextLayer.isEmpty && !l.length ? e.empty : this.nextLayer.update({
				add: l,
				filter: o,
				filterFrom: i,
				filterTo: a
			}));
		}
		map(t) {
			if (t.empty || this.isEmpty) return this;
			let n = [], r = [], i = -1;
			for (let e = 0; e < this.chunk.length; e++) {
				let a = this.chunkPos[e], o = this.chunk[e], s = t.touchesRange(a, a + o.length);
				if (s === !1) i = Math.max(i, o.maxPoint), n.push(o), r.push(t.mapPos(a));
				else if (s === !0) {
					let { mapped: e, pos: s } = o.map(a, t);
					e && (i = Math.max(i, e.maxPoint), n.push(e), r.push(s));
				}
			}
			let a = this.nextLayer.map(t);
			return n.length == 0 ? a : new e(r, n, a || e.empty, i);
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
			return jl.from([this]).goto(e);
		}
		get isEmpty() {
			return this.nextLayer == this;
		}
		static iter(e, t = 0) {
			return jl.from(e).goto(t);
		}
		static compare(e, t, n, r, i = -1) {
			let a = e.filter((e) => e.maxPoint > 0 || !e.isEmpty && e.maxPoint >= i), o = t.filter((e) => e.maxPoint > 0 || !e.isEmpty && e.maxPoint >= i), s = jc(a, o, n), c = new Ml(a, s, i), l = new Ml(o, s, i);
			n.iterGaps((e, t, n) => Nc(c, e, l, t, n, r)), n.empty && n.length == 0 && Nc(c, 0, l, 0, 0, r);
		}
		static eq(e, t, n = 0, r) {
			r ??= 999999999;
			let i = e.filter((e) => !e.isEmpty && t.indexOf(e) < 0), a = t.filter((t) => !t.isEmpty && e.indexOf(t) < 0);
			if (i.length != a.length) return !1;
			if (!i.length) return !0;
			let o = jc(i, a), s = new Ml(i, o, 0).goto(n), c = new Ml(a, o, 0).goto(n);
			for (;;) {
				if (s.to != c.to || !Pc(s.active, c.active) || s.point && (!c.point || !Oc(s.point, c.point))) return !1;
				if (s.to > r) return !0;
				s.next(), c.next();
			}
		}
		static spans(e, t, n, r, i = -1) {
			let a = new Ml(e, null, i).goto(t), o = t, s = a.openStart;
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
			let n = new kl();
			for (let r of e instanceof El ? [e] : t ? Ac(e) : e) n.add(r.from, r.to, r.value);
			return n.finish();
		}
		static join(t) {
			if (!t.length) return e.empty;
			let n = t[t.length - 1];
			for (let r = t.length - 2; r >= 0; r--) for (let i = t[r]; i != e.empty; i = i.nextLayer) n = new e(i.chunkPos, i.chunk, n, Math.max(i.maxPoint, n.maxPoint));
			return n;
		}
	}, Ol.empty = /*@__PURE__*/ new Ol([], [], null, -1), Ol.empty.nextLayer = Ol.empty, kl = class e {
		finishChunk(e) {
			this.chunks.push(new Dl(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
		}
		constructor() {
			this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
		}
		add(t, n, r) {
			this.addInner(t, n, r) || (this.nextLayer ||= new e()).add(t, n, r);
		}
		addInner(e, t, n) {
			let r = e - this.lastTo || n.startSide - this.last.endSide;
			if (r <= 0 && (e - this.lastFrom || n.startSide - this.last.startSide) < 0) throw Error("Ranges must be added sorted by `from` position and `startSide`");
			return r < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = n, this.lastFrom = e, this.lastTo = t, this.value.push(n), n.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
		}
		addChunk(e, t) {
			if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0) return !1;
			this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
			let n = t.value.length - 1;
			return this.last = t.value[n], this.lastFrom = t.from[n] + e, this.lastTo = t.to[n] + e, !0;
		}
		finish() {
			return this.finishInner(Ol.empty);
		}
		finishInner(e) {
			if (this.from.length && this.finishChunk(!1), this.chunks.length == 0) return e;
			let t = Ol.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
			return this.from = null, t;
		}
	}, Al = class {
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
	}, jl = class e {
		constructor(e) {
			this.heap = e;
		}
		static from(t, n = null, r = -1) {
			let i = [];
			for (let e = 0; e < t.length; e++) for (let a = t[e]; !a.isEmpty; a = a.nextLayer) a.maxPoint >= r && i.push(new Al(a, n, r, e));
			return i.length == 1 ? i[0] : new e(i);
		}
		get startSide() {
			return this.value ? this.value.startSide : 0;
		}
		goto(e, t = -1e9) {
			for (let n of this.heap) n.goto(e, t);
			for (let e = this.heap.length >> 1; e >= 0; e--) Mc(this.heap, e);
			return this.next(), this;
		}
		forward(e, t) {
			for (let n of this.heap) n.forward(e, t);
			for (let e = this.heap.length >> 1; e >= 0; e--) Mc(this.heap, e);
			(this.to - e || this.value.endSide - t) < 0 && this.next();
		}
		next() {
			if (this.heap.length == 0) this.from = this.to = 1e9, this.value = null, this.rank = -1;
			else {
				let e = this.heap[0];
				this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), Mc(this.heap, 0);
			}
		}
	}, Ml = class {
		constructor(e, t, n) {
			this.minPoint = n, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = jl.from(e, t, n);
		}
		goto(e, t = -1e9) {
			return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
		}
		forward(e, t) {
			for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0;) this.removeActive(this.minActive);
			this.cursor.forward(e, t);
		}
		removeActive(e) {
			Fc(this.active, e), Fc(this.activeTo, e), Fc(this.activeRank, e), this.minActive = Lc(this.active, this.activeTo);
		}
		addActive(e) {
			let t = 0, { value: n, to: r, rank: i } = this.cursor;
			for (; t < this.activeRank.length && (i - this.activeRank[t] || r - this.activeTo[t]) > 0;) t++;
			Ic(this.active, t, n), Ic(this.activeTo, t, r), Ic(this.activeRank, t, i), e && Ic(e, t, this.cursor.from), this.minActive = Lc(this.active, this.activeTo);
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
					this.removeActive(r), n && Fc(n, r);
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
})), Pl, Fl, Il, Ll, Rl, zl, Bl, Vl = t((() => {
	Pl = "ͼ", Fl = typeof Symbol > "u" ? "__ͼ" : Symbol.for(Pl), Il = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), Ll = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {}, Rl = class {
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
			let e = Ll[Fl] || 1;
			return Ll[Fl] = e + 1, Pl + e.toString(36);
		}
		static mount(e, t, n) {
			let r = e[Il], i = n && n.nonce;
			r ? i && r.setNonce(i) : r = new Bl(e, i), r.mount(Array.isArray(t) ? t : [t], e);
		}
	}, zl = /* @__PURE__ */ new Map(), Bl = class {
		constructor(e, t) {
			let n = e.ownerDocument || e, r = n.defaultView;
			if (!e.head && e.adoptedStyleSheets && r.CSSStyleSheet) {
				let t = zl.get(n);
				if (t) return e[Il] = t;
				this.sheet = new r.CSSStyleSheet(), zl.set(n, this);
			} else this.styleTag = n.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
			this.modules = [], e[Il] = this;
		}
		mount(e, t) {
			let n = this.sheet, r = 0, i = 0;
			for (let t = 0; t < e.length; t++) {
				let a = e[t], o = this.modules.indexOf(a);
				if (o < i && o > -1 && (this.modules.splice(o, 1), i--, o = -1), o == -1) {
					if (this.modules.splice(i++, 0, a), n) for (let e = 0; e < a.rules.length; e++) n.insertRule(a.rules[e], r++);
				} else {
					for (; i < o;) r += this.modules[i++].rules.length;
					r += a.rules.length, i++;
				}
			}
			if (n) t.adoptedStyleSheets.indexOf(this.sheet) < 0 && (t.adoptedStyleSheets = [this.sheet, ...t.adoptedStyleSheets]);
			else {
				let e = "";
				for (let t = 0; t < this.modules.length; t++) e += this.modules[t].getRules() + "\n";
				this.styleTag.textContent = e;
				let n = t.head || t;
				this.styleTag.parentNode != n && n.insertBefore(this.styleTag, n.firstChild);
			}
		}
		setNonce(e) {
			this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
		}
	};
}));
//#endregion
//#region node_modules/w3c-keyname/index.js
function Hl(e) {
	var t = !(Gl && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey || Kl && e.shiftKey && e.key && e.key.length == 1 || e.key == "Unidentified") && e.key || (e.shiftKey ? Wl : Ul)[e.keyCode] || e.key || "Unidentified";
	return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
var Ul, Wl, Gl, Kl, ql, Jl = t((() => {
	for (Ul = {
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
	}, Wl = {
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
	}, Gl = typeof navigator < "u" && /Mac/.test(navigator.platform), Kl = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), ql = 0; ql < 10; ql++) Ul[48 + ql] = Ul[96 + ql] = String(ql);
	for (ql = 1; ql <= 24; ql++) Ul[ql + 111] = "F" + ql;
	for (ql = 65; ql <= 90; ql++) Ul[ql] = String.fromCharCode(ql + 32), Wl[ql] = String.fromCharCode(ql);
	for (var e in Ul) Wl.hasOwnProperty(e) || (Wl[e] = Ul[e]);
}));
//#endregion
//#region node_modules/crelt/index.js
function Yl() {
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
	for (; t < arguments.length; t++) Xl(e, arguments[t]);
	return e;
}
function Xl(e, t) {
	if (typeof t == "string") e.appendChild(document.createTextNode(t));
	else if (t != null) if (t.nodeType != null) e.appendChild(t);
	else if (Array.isArray(t)) for (var n = 0; n < t.length; n++) Xl(e, t[n]);
	else throw RangeError("Unsupported child node: " + t);
}
var Zl = t((() => {})), Ql = /* @__PURE__ */ n({
	BidiSpan: () => Zp,
	BlockInfo: () => Dh,
	BlockType: () => Pp,
	BlockWrapper: () => Rp,
	Decoration: () => Y,
	Direction: () => Up,
	EditorView: () => X,
	GutterMarker: () => c_,
	MatchDecorator: () => Sg,
	RectangleMarker: () => fg,
	ViewPlugin: () => vm,
	ViewUpdate: () => Am,
	WidgetType: () => Np,
	__test: () => k_,
	activateHover: () => Qf,
	closeHoverTooltip: () => tp,
	closeHoverTooltips: () => e_,
	crosshairCursor: () => Gf,
	drawSelection: () => Ef,
	dropCursor: () => Af,
	getDialog: () => sp,
	getDrawSelectionConfig: () => Df,
	getPanel: () => ip,
	getTooltip: () => $f,
	gutter: () => lp,
	gutterLineClass: () => l_,
	gutterWidgetClass: () => u_,
	gutters: () => up,
	hasHoverTooltips: () => ep,
	highlightActiveLine: () => Rf,
	highlightActiveLineGutter: () => _p,
	highlightSpecialChars: () => Pf,
	highlightTrailingWhitespace: () => bp,
	highlightWhitespace: () => yp,
	hoverTooltip: () => Zf,
	keymap: () => sg,
	layer: () => Tf,
	lineNumberMarkers: () => v_,
	lineNumberWidgetMarker: () => y_,
	lineNumbers: () => hp,
	logException: () => Vu,
	panels: () => rp,
	placeholder: () => zf,
	rectangularSelection: () => Wf,
	repositionTooltips: () => np,
	runScopeHandlers: () => vf,
	scrollPastEnd: () => Lf,
	showDialog: () => op,
	showPanel: () => i_,
	showTooltip: () => Kg,
	tooltips: () => Kf
});
function $l(e, t) {
	for (let n in e) n == "class" && t.class ? t.class += " " + e.class : n == "style" && t.style ? t.style += ";" + e.style : t[n] = e[n];
	return t;
}
function eu(e, t, n) {
	if (e == t) return !0;
	e ||= Mp, t ||= Mp;
	let r = Object.keys(e), i = Object.keys(t);
	if (r.length - (n && r.indexOf(n) > -1 ? 1 : 0) != i.length - (n && i.indexOf(n) > -1 ? 1 : 0)) return !1;
	for (let a of r) if (a != n && (i.indexOf(a) == -1 || e[a] !== t[a])) return !1;
	return !0;
}
function tu(e, t) {
	for (let n = e.attributes.length - 1; n >= 0; n--) {
		let r = e.attributes[n].name;
		t[r] ?? e.removeAttribute(r);
	}
	for (let n in t) {
		let r = t[n];
		n == "style" ? e.style.cssText = r : e.getAttribute(n) != r && e.setAttribute(n, r);
	}
}
function nu(e, t, n) {
	let r = !1;
	if (t) for (let i in t) n && i in n || (r = !0, i == "style" ? e.style.cssText = "" : e.removeAttribute(i));
	if (n) for (let i in n) t && t[i] == n[i] || (r = !0, i == "style" ? e.style.cssText = n[i] : e.setAttribute(i, n[i]));
	return r;
}
function ru(e) {
	let t = Object.create(null);
	for (let n = 0; n < e.attributes.length; n++) {
		let r = e.attributes[n];
		t[r.name] = r.value;
	}
	return t;
}
function iu(e, t = !1) {
	let { inclusiveStart: n, inclusiveEnd: r } = e;
	return n ??= e.inclusive, r ??= e.inclusive, {
		start: n ?? t,
		end: r ?? t
	};
}
function au(e, t) {
	return e == t || !!(e && t && e.compare(t));
}
function ou(e, t, n, r = 0) {
	let i = n.length - 1;
	i >= 0 && n[i] + r >= e ? n[i] = Math.max(n[i], t) : n.push(e, t);
}
function su(e) {
	let t;
	return t = e.nodeType == 11 ? e.getSelection ? e : e.ownerDocument : e, t.getSelection();
}
function cu(e, t) {
	return t ? e == t || e.contains(t.nodeType == 1 ? t : t.parentNode) : !1;
}
function lu(e, t) {
	if (!t.anchorNode) return !1;
	try {
		return cu(e, t.anchorNode);
	} catch {
		return !1;
	}
}
function uu(e) {
	return e.nodeType == 3 ? Su(e, 0, e.nodeValue.length).getClientRects() : e.nodeType == 1 ? e.getClientRects() : [];
}
function du(e, t, n, r) {
	return n ? mu(e, t, n, r, -1) || mu(e, t, n, r, 1) : !1;
}
function fu(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}
function pu(e) {
	return e.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(e.nodeName);
}
function mu(e, t, n, r, i) {
	for (;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : hu(e))) {
			if (e.nodeName == "DIV") return !1;
			let n = e.parentNode;
			if (!n || n.nodeType != 1) return !1;
			t = fu(e) + (i < 0 ? 0 : 1), e = n;
		} else if (e.nodeType == 1) {
			if (e = e.childNodes[t + (i < 0 ? -1 : 0)], e.nodeType == 1 && e.contentEditable == "false") return !1;
			t = i < 0 ? hu(e) : 0;
		} else return !1;
	}
}
function hu(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function gu(e, t) {
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
function _u(e) {
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
function vu(e, t) {
	let n = t.width / e.offsetWidth, r = t.height / e.offsetHeight;
	return (n > .995 && n < 1.005 || !isFinite(n) || Math.abs(t.width - e.offsetWidth) < 1) && (n = 1), (r > .995 && r < 1.005 || !isFinite(r) || Math.abs(t.height - e.offsetHeight) < 1) && (r = 1), {
		scaleX: n,
		scaleY: r
	};
}
function yu(e, t, n, r, i, a, o, s) {
	let c = e.ownerDocument, l = c.defaultView || window;
	for (let u = e, d = !1; u && !d;) if (u.nodeType == 1) {
		let e, f = u == c.body, p = 1, m = 1;
		if (f) e = _u(l);
		else {
			if (/^(fixed|sticky)$/.test(getComputedStyle(u).position) && (d = !0), u.scrollHeight <= u.clientHeight && u.scrollWidth <= u.clientWidth) {
				u = u.assignedSlot || u.parentNode;
				continue;
			}
			let t = u.getBoundingClientRect();
			({scaleX: p, scaleY: m} = vu(u, t)), e = {
				left: t.left,
				right: t.left + u.clientWidth * p,
				top: t.top,
				bottom: t.top + u.clientHeight * m
			};
		}
		let h = 0, g = 0;
		if (i == "nearest") t.top < e.top + o ? (g = t.top - (e.top + o), n > 0 && t.bottom > e.bottom + g && (g = t.bottom - e.bottom + o)) : t.bottom > e.bottom - o && (g = t.bottom - e.bottom + o, n < 0 && t.top - g < e.top && (g = t.top - (e.top + o)));
		else {
			let r = t.bottom - t.top, a = e.bottom - e.top;
			g = (i == "center" && r <= a ? t.top + r / 2 - a / 2 : i == "start" || i == "center" && n < 0 ? t.top - o : t.bottom - a + o) - e.top;
		}
		if (r == "nearest" ? t.left < e.left + a ? (h = t.left - (e.left + a), n > 0 && t.right > e.right + h && (h = t.right - e.right + a)) : t.right > e.right - a && (h = t.right - e.right + a, n < 0 && t.left < e.left + h && (h = t.left - (e.left + a))) : h = (r == "center" ? t.left + (t.right - t.left) / 2 - (e.right - e.left) / 2 : r == "start" == s ? t.left - a : t.right - (e.right - e.left) + a) - e.left, h || g) if (f) l.scrollBy(h, g);
		else {
			let e = 0, n = 0;
			if (g) {
				let e = u.scrollTop;
				u.scrollTop += g / m, n = (u.scrollTop - e) * m;
			}
			if (h) {
				let t = u.scrollLeft;
				u.scrollLeft += h / p, e = (u.scrollLeft - t) * p;
			}
			t = {
				left: t.left - e,
				top: t.top - n,
				right: t.right - e,
				bottom: t.bottom - n
			}, e && Math.abs(e - h) < 1 && (r = "nearest"), n && Math.abs(n - g) < 1 && (i = "nearest");
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
function bu(e, t = !0) {
	let n = e.ownerDocument, r = null, i = null;
	for (let a = e.parentNode; a && !(a == n.body || (!t || r) && i);) if (a.nodeType == 1) !i && a.scrollHeight > a.clientHeight && (i = a), t && !r && a.scrollWidth > a.clientWidth && (r = a), a = a.assignedSlot || a.parentNode;
	else if (a.nodeType == 11) a = a.host;
	else break;
	return {
		x: r,
		y: i
	};
}
function xu(e) {
	if (e.setActive) return e.setActive();
	if (Bp) return e.focus(Bp);
	let t = [];
	for (let n = e; n && (t.push(n, n.scrollTop, n.scrollLeft), n != n.ownerDocument); n = n.parentNode);
	if (e.focus(Bp == null ? { get preventScroll() {
		return Bp = { preventScroll: !0 }, !0;
	} } : void 0), !Bp) {
		Bp = !1;
		for (let e = 0; e < t.length;) {
			let n = t[e++], r = t[e++], i = t[e++];
			n.scrollTop != r && (n.scrollTop = r), n.scrollLeft != i && (n.scrollLeft = i);
		}
	}
}
function Su(e, t, n = t) {
	let r = Vp ||= document.createRange();
	return r.setEnd(e, n), r.setStart(e, t), r;
}
function Cu(e, t, n, r) {
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
function wu(e) {
	for (; e;) {
		if (e && (e.nodeType == 9 || e.nodeType == 11 && e.host)) return e;
		e = e.assignedSlot || e.parentNode;
	}
	return null;
}
function Tu(e, t) {
	let n = t.focusNode, r = t.focusOffset;
	if (!n || t.anchorNode != n || t.anchorOffset != r) return !1;
	for (r = Math.min(r, hu(n));;) if (r) {
		if (n.nodeType != 1) return !1;
		let e = n.childNodes[r - 1];
		e.contentEditable == "false" ? r-- : (n = e, r = hu(n));
	} else if (n == e) return !0;
	else r = fu(n), n = n.parentNode;
}
function Eu(e) {
	return e instanceof Window ? e.pageYOffset > Math.max(0, e.document.documentElement.scrollHeight - e.innerHeight - 4) : e.scrollTop > Math.max(1, e.scrollHeight - e.clientHeight - 4);
}
function Du(e, t) {
	for (let n = e, r = t;;) if (n.nodeType == 3 && r > 0) return {
		node: n,
		offset: r
	};
	else if (n.nodeType == 1 && r > 0) {
		if (n.contentEditable == "false") return null;
		n = n.childNodes[r - 1], r = hu(n);
	} else if (n.parentNode && !pu(n)) r = fu(n), n = n.parentNode;
	else return null;
}
function Ou(e, t) {
	for (let n = e, r = t;;) if (n.nodeType == 3 && r < n.nodeValue.length) return {
		node: n,
		offset: r
	};
	else if (n.nodeType == 1 && r < n.childNodes.length) {
		if (n.contentEditable == "false") return null;
		n = n.childNodes[r], r = 0;
	} else if (n.parentNode && !pu(n)) r = fu(n) + 1, n = n.parentNode;
	else return null;
}
function ku(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t.push(1 << e[n]);
	return t;
}
function Au(e) {
	return e <= 247 ? Kp[e] : 1424 <= e && e <= 1524 ? 2 : 1536 <= e && e <= 1785 ? qp[e - 1536] : 1774 <= e && e <= 2220 ? 4 : 8192 <= e && e <= 8204 ? 256 : 64336 <= e && e <= 65023 ? 4 : 1;
}
function ju(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) {
		let r = e[n], i = t[n];
		if (r.from != i.from || r.to != i.to || r.direction != i.direction || !ju(r.inner, i.inner)) return !1;
	}
	return !0;
}
function Mu(e, t, n, r, i) {
	for (let a = 0; a <= r.length; a++) {
		let o = a ? r[a - 1].to : t, s = a < r.length ? r[a].from : n, c = a ? 256 : i;
		for (let t = o, n = c, r = c; t < s; t++) {
			let i = Au(e.charCodeAt(t));
			i == 512 ? i = n : i == 8 && r == 4 && (i = 16), Qp[t] = i == 4 ? 2 : i, i & 7 && (r = i), n = i;
		}
		for (let e = o, t = c, r = c; e < s; e++) {
			let i = Qp[e];
			if (i == 128) e < s - 1 && t == Qp[e + 1] && t & 24 ? i = Qp[e] = t : Qp[e] = 256;
			else if (i == 64) {
				let i = e + 1;
				for (; i < s && Qp[i] == 64;) i++;
				let a = e && t == 8 || i < n && Qp[i] == 8 ? r == 1 ? 1 : 8 : 256;
				for (let t = e; t < i; t++) Qp[t] = a;
				e = i - 1;
			} else i == 8 && r == 1 && (Qp[e] = 1);
			t = i, i & 7 && (r = i);
		}
	}
}
function Nu(e, t, n, r, i) {
	let a = i == 1 ? 2 : 1;
	for (let o = 0, s = 0, c = 0; o <= r.length; o++) {
		let l = o ? r[o - 1].to : t, u = o < r.length ? r[o].from : n;
		for (let t = l, n, r, o; t < u; t++) if (r = Jp[n = e.charCodeAt(t)]) if (r < 0) {
			for (let e = s - 3; e >= 0; e -= 3) if (Yp[e + 1] == -r) {
				let n = Yp[e + 2], r = n & 2 ? i : n & 4 ? n & 1 ? a : i : 0;
				r && (Qp[t] = Qp[Yp[e]] = r), s = e;
				break;
			}
		} else if (Yp.length == 189) break;
		else Yp[s++] = t, Yp[s++] = n, Yp[s++] = c;
		else if ((o = Qp[t]) == 2 || o == 1) {
			let e = o == i;
			c = +!e;
			for (let t = s - 3; t >= 0; t -= 3) {
				let n = Yp[t + 2];
				if (n & 2) break;
				if (e) Yp[t + 2] |= 2;
				else {
					if (n & 4) break;
					Yp[t + 2] |= 4;
				}
			}
		}
	}
}
function Pu(e, t, n, r) {
	for (let i = 0, a = r; i <= n.length; i++) {
		let o = i ? n[i - 1].to : e, s = i < n.length ? n[i].from : t;
		for (let c = o; c < s;) {
			let o = Qp[c];
			if (o == 256) {
				let o = c + 1;
				for (;;) if (o == s) {
					if (i == n.length) break;
					o = n[i++].to, s = i < n.length ? n[i].from : t;
				} else if (Qp[o] == 256) o++;
				else break;
				let l = a == 1, u = l == ((o < t ? Qp[o] : r) == 1) ? l ? 1 : 2 : r;
				for (let t = o, r = i, a = r ? n[r - 1].to : e; t > c;) t == a && (t = n[--r].from, a = r ? n[r - 1].to : e), Qp[--t] = u;
				c = o;
			} else a = o, c++;
		}
	}
}
function Fu(e, t, n, r, i, a, o) {
	let s = r % 2 ? 2 : 1;
	if (r % 2 == i % 2) for (let c = t, l = 0; c < n;) {
		let t = !0, u = !1;
		if (l == a.length || c < a[l].from) {
			let e = Qp[c];
			e != s && (t = !1, u = e == 16);
		}
		let d = !t && s == 1 ? [] : null, f = t ? r : r + 1, p = c;
		run: for (;;) if (l < a.length && p == a[l].from) {
			if (u) break run;
			let m = a[l];
			if (!t) for (let e = m.to, t = l + 1;;) {
				if (e == n) break run;
				if (t < a.length && a[t].from == e) e = a[t++].to;
				else if (Qp[e] == s) break run;
				else break;
			}
			l++, d ? d.push(m) : (m.from > c && o.push(new Zp(c, m.from, f)), Iu(e, m.direction == Wp == !(f % 2) ? r : r + 1, i, m.inner, m.from, m.to, o), c = m.to), p = m.to;
		} else if (p == n || (t ? Qp[p] != s : Qp[p] == s)) break;
		else p++;
		d ? Fu(e, c, p, r + 1, i, d, o) : c < p && o.push(new Zp(c, p, f)), c = p;
	}
	else for (let c = n, l = a.length; c > t;) {
		let n = !0, u = !1;
		if (!l || c > a[l - 1].to) {
			let e = Qp[c - 1];
			e != s && (n = !1, u = e == 16);
		}
		let d = !n && s == 1 ? [] : null, f = n ? r : r + 1, p = c;
		run: for (;;) if (l && p == a[l - 1].to) {
			if (u) break run;
			let m = a[--l];
			if (!n) for (let e = m.from, n = l;;) {
				if (e == t) break run;
				if (n && a[n - 1].to == e) e = a[--n].from;
				else if (Qp[e - 1] == s) break run;
				else break;
			}
			d ? d.push(m) : (m.to < c && o.push(new Zp(m.to, c, f)), Iu(e, m.direction == Wp == !(f % 2) ? r : r + 1, i, m.inner, m.from, m.to, o), c = m.from), p = m.from;
		} else if (p == t || (n ? Qp[p - 1] != s : Qp[p - 1] == s)) break;
		else p--;
		d ? Fu(e, p, c, r + 1, i, d, o) : p < c && o.push(new Zp(p, c, f)), c = p;
	}
}
function Iu(e, t, n, r, i, a, o) {
	let s = t % 2 ? 2 : 1;
	Mu(e, i, a, r, s), Nu(e, i, a, r, s), Pu(i, a, r, s), Fu(e, i, a, t, n, r, o);
}
function Lu(e, t, n) {
	if (!e) return [new Zp(0, 0, +(t == Gp))];
	if (t == Wp && !n.length && !Xp.test(e)) return Ru(e.length);
	if (n.length) for (; e.length > Qp.length;) Qp[Qp.length] = 256;
	let r = [], i = t == Wp ? 0 : 1;
	return Iu(e, i, i, n, 0, e.length, r), r;
}
function Ru(e) {
	return [new Zp(0, e, 0)];
}
function zu(e, t, n, r, i) {
	let a = r.head - e.from, o = Zp.find(t, a, r.bidiLevel ?? -1, r.assoc), s = t[o], c = s.side(i, n);
	if (a == c) {
		let e = o += i ? 1 : -1;
		if (e < 0 || e >= t.length) return null;
		s = t[o = e], a = s.side(!i, n), c = s.side(i, n);
	}
	let l = Qs(e.text, a, s.forward(i, n));
	(l < s.from || l > s.to) && (l = c), $p = e.text.slice(Math.min(a, l), Math.max(a, l));
	let u = o == (i ? t.length - 1 : 0) ? null : t[o + (i ? 1 : -1)];
	return u && l == c && u.level + +!i < s.level ? K.cursor(u.side(!i, n) + e.from, u.forward(i, n) ? 1 : -1, u.level) : K.cursor(l + e.from, s.forward(i, n) ? -1 : 1, s.level);
}
function Bu(e, t, n) {
	for (let r = t; r < n; r++) {
		let t = Au(e.charCodeAt(r));
		if (t == 1) return Wp;
		if (t == 2 || t == 4) return Gp;
	}
	return Wp;
}
function Vu(e, t, n) {
	let r = e.facet(rm);
	r.length ? r[0](t) : window.onerror && window.onerror(String(t), n, void 0, void 0, t) || (n ? console.error(n + ":", t) : console.error(t));
}
function Hu(e, t) {
	let n = e.state.facet(Em);
	if (!n.length) return n;
	let r = n.map((t) => t instanceof Function ? t(e) : t), i = [];
	return Ol.spans(r, t.from, t.to, {
		point() {},
		span(e, n, r, a) {
			let o = e - t.from, s = n - t.from, c = i;
			for (let e = r.length - 1; e >= 0; e--, a--) {
				let n = r[e].spec.bidiIsolate, i;
				if (n ??= Bu(t.text, o, s), a > 0 && c.length && (i = c[c.length - 1]).to == o && i.direction == n) i.to = s, c = i.inner;
				else {
					let e = {
						from: o,
						to: s,
						direction: n,
						inner: []
					};
					c.push(e), c = e.inner;
				}
			}
		}
	}), i;
}
function Uu(e) {
	let t = 0, n = 0, r = 0, i = 0;
	for (let a of e.state.facet(Dm)) {
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
function Wu(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
function Gu(e) {
	let t = e.dom.lastChild;
	if (!t) return e.dom.getBoundingClientRect();
	let n = uu(t);
	return n[n.length - 1] || null;
}
function Ku(e, t) {
	let n = e.coordsIn(0, 1), r = t.coordsIn(0, 1);
	return n && r && r.top < n.bottom;
}
function qu(e, t) {
	let n = (e) => {
		for (let r of e.children) if ((t ? r.isText() : r.length) || n(r)) return !0;
		return !1;
	};
	return n(e);
}
function Ju(e) {
	let t = e.isReplace ? (e.startSide < 0 ? 64 : 0) | (e.endSide > 0 ? 128 : 0) : e.startSide > 0 ? 32 : 16;
	return e.block && (t |= 256), t;
}
function Yu(e, t) {
	let n = t.spec.attributes, r = t.spec.class;
	return !n && !r ? e : (e ||= { class: "cm-line" }, n && $l(n, e), r && (e.class += " " + r), e);
}
function Xu(e) {
	let t = [];
	for (let n = e.parents.length; n > 1; n--) {
		let r = n == e.parents.length ? e.tile : e.parents[n].tile;
		r instanceof Lm && t.push(r.mark);
	}
	return t;
}
function Zu(e) {
	let t = Mm.get(e);
	return t && t.setDOM(e.cloneNode()), e;
}
function Qu(e, t) {
	let n = t?.get(e);
	if (n != 1) {
		n ?? e.destroy();
		for (let n of e.children) Qu(n, t);
	}
}
function $u(e) {
	return e.node.nodeType == 1 && e.node.firstChild && (e.offset == 0 || e.node.childNodes[e.offset - 1].contentEditable == "false") && (e.offset == e.node.childNodes.length || e.node.childNodes[e.offset].contentEditable == "false");
}
function ed(e, t) {
	let n = e.observer.selectionRange;
	if (!n.focusNode) return null;
	let r = Du(n.focusNode, n.focusOffset), i = Ou(n.focusNode, n.focusOffset), a = r || i;
	if (i && r && i.node != r.node) {
		let t = Mm.get(i.node);
		if (!t || t.isText() && t.text != i.node.nodeValue) a = i;
		else if (e.docView.lastCompositionAfterCursor) {
			let e = Mm.get(r.node);
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
function td(e, t, n) {
	let r = ed(e, n);
	if (!r) return null;
	let { node: i, from: a, to: o } = r, s = i.nodeValue;
	if (/[\n\r]/.test(s) || e.state.doc.sliceString(r.from, r.to) != s) return null;
	let c = t.invertedDesc;
	return {
		range: new km(c.mapPos(a), c.mapPos(o), a, o),
		text: i
	};
}
function nd(e, t) {
	return e.nodeType == 1 ? (t && e.childNodes[t - 1].contentEditable == "false" ? 1 : 0) | (t < e.childNodes.length && e.childNodes[t].contentEditable == "false" ? 2 : 0) : 0;
}
function rd(e, t, n) {
	let r = new Qm();
	return Ol.compare(e, t, n, r), r.changes;
}
function id(e, t, n) {
	let r = new $m();
	return Ol.compare(e, t, n, r), r.changes;
}
function ad(e, t) {
	for (let n = e; n && n != t; n = n.assignedSlot || n.parentNode) if (n.nodeType == 1 && n.contentEditable == "false") return !0;
	return !1;
}
function od(e, t) {
	let n = !1;
	return t && e.iterChangedRanges((e, r) => {
		e < t.to && r > t.from && (n = !0);
	}), n;
}
function sd(e, t, n = 1) {
	let r = e.charCategorizer(t), i = e.doc.lineAt(t), a = t - i.from;
	if (i.length == 0) return K.cursor(t);
	a == 0 ? n = 1 : a == i.length && (n = -1);
	let o = a, s = a;
	n < 0 ? o = Qs(i.text, a, !1) : s = Qs(i.text, a);
	let c = r(i.text.slice(o, s));
	for (; o > 0;) {
		let e = Qs(i.text, o, !1);
		if (r(i.text.slice(e, o)) != c) break;
		o = e;
	}
	for (; s < i.length;) {
		let e = Qs(i.text, s);
		if (r(i.text.slice(s, e)) != c) break;
		s = e;
	}
	return K.undirectionalRange(o + i.from, s + i.from);
}
function cd(e, t, n, r, i) {
	let a = Math.round((r - t.left) * e.defaultCharacterWidth);
	if (e.lineWrapping && n.height > e.defaultLineHeight * 1.5) {
		let t = e.viewState.heightOracle.textHeight, r = Math.floor((i - n.top - (e.defaultLineHeight - t) * .5) / t);
		a += r * e.viewState.heightOracle.lineLength;
	}
	let o = e.state.sliceDoc(n.from, n.to);
	return n.from + zc(o, a, e.state.tabSize);
}
function ld(e, t, n) {
	let r = e.lineBlockAt(t);
	if (Array.isArray(r.type)) {
		let e;
		for (let i of r.type) {
			if (i.from > t) break;
			if (!(i.to < t)) {
				if (i.from < t && i.to > t) return i;
				(!e || i.type == Pp.Text && (e.type != i.type || (n < 0 ? i.from < t : i.to > t))) && (e = i);
			}
		}
		return e || r;
	}
	return r;
}
function ud(e, t, n, r) {
	let i = ld(e, t.head, t.assoc || -1), a = !r || i.type != Pp.Text || !(e.lineWrapping || i.widgetLineBreaks) ? null : e.coordsAtPos(t.assoc < 0 && t.head > i.from ? t.head - 1 : t.head);
	if (a) {
		let t = e.dom.getBoundingClientRect(), r = e.textDirectionAt(i.from), o = e.posAtCoords({
			x: n == (r == Up.LTR) ? t.right - 1 : t.left + 1,
			y: (a.top + a.bottom) / 2
		});
		if (o != null) return K.cursor(o, n ? -1 : 1);
	}
	return K.cursor(n ? i.to : i.from, n ? -1 : 1);
}
function dd(e, t, n, r) {
	let i = e.state.doc.lineAt(t.head), a = e.bidiSpans(i), o = e.textDirectionAt(i.from);
	for (let s = t, c = null;;) {
		let t = zu(i, a, o, s, n), l = $p;
		if (!t) {
			if (i.number == (n ? e.state.doc.lines : 1)) return s;
			l = "\n", i = e.state.doc.line(i.number + (n ? 1 : -1)), a = e.bidiSpans(i), t = e.visualLineSide(i, !n);
		}
		if (!c) {
			if (!r) return t;
			c = r(l);
		} else if (!c(l)) return s;
		s = t;
	}
}
function fd(e, t, n) {
	let r = e.state.charCategorizer(t), i = r(n);
	return (e) => {
		let t = r(e);
		return i == xl.Space && (i = t), i == t;
	};
}
function pd(e, t, n, r) {
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
		let r = s + (p + t) * a, i = _d(e, {
			x: d,
			y: r
		}, !1, a);
		if (n ? r > c.bottom : r < c.top) return K.cursor(i.pos, i.assoc);
		let l = e.coordsAtPos(i.pos, i.assoc), u = l ? (l.top + l.bottom) / 2 : 0;
		if (!l || (n ? u > s : u < s)) return K.cursor(i.pos, i.assoc, void 0, o);
	}
}
function md(e, t, n) {
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
function hd(e, t) {
	let n = null;
	for (let r = 0; r < t.ranges.length; r++) {
		let i = t.ranges[r], a = null;
		if (i.empty) {
			let t = md(e, i.from, 0);
			t != i.from && (a = K.cursor(t, -1));
		} else {
			let t = md(e, i.from, -1), n = md(e, i.to, 1);
			(t != i.from || n != i.to) && (a = i.undirectional ? K.undirectionalRange(i.from, i.to) : K.range(i.from == i.anchor ? t : n, i.from == i.head ? t : n));
		}
		a && (n ||= t.ranges.slice(), n[r] = a);
	}
	return n ? K.create(n, t.mainIndex) : t;
}
function gd(e, t, n) {
	let r = md(e.state.facet(Tm).map((t) => t(e)), n.from, t.head > n.from ? -1 : 1);
	return r == n.from ? n : K.cursor(r, r < n.from ? 1 : -1);
}
function _d(e, t, n, r) {
	let i = e.contentDOM.getBoundingClientRect(), a = i.top + e.viewState.paddingTop, { x: o, y: s } = t, c = s - a, l;
	for (;;) {
		if (c < 0) return new th(0, 1);
		if (c > e.viewState.docHeight) return new th(e.state.doc.length, -1);
		if (l = e.elementAtHeight(c), r == null) break;
		if (l.type == Pp.Text) {
			if (r < 0 ? l.to < e.viewport.from : l.from > e.viewport.to) break;
			let t = e.docView.coordsAt(r < 0 ? l.from : l.to, r > 0 ? -1 : 1);
			if (t && (r < 0 ? t.top <= c + a : t.bottom >= c + a)) break;
		}
		let t = e.viewState.heightOracle.textHeight / 2;
		c = r > 0 ? l.bottom + t : l.top - t;
	}
	if (e.viewport.from >= l.to || e.viewport.to <= l.from) {
		if (n) return null;
		if (l.type == Pp.Text) {
			let t = cd(e, i, l, o, s);
			return new th(t, t == l.from ? 1 : -1);
		}
	}
	if (l.type != Pp.Text) return c < (l.top + l.bottom) / 2 ? new th(l.from, 1) : new th(l.to, -1);
	let u = e.docView.lineAt(l.from, 2);
	return (!u || u.length != l.length) && (u = e.docView.lineAt(l.from, -2)), new nh(e, o, s, e.textDirectionAt(l.from)).scanTile(u, l.from);
}
function vd(e, t, n) {
	for (;;) {
		if (!t || n < hu(t)) return !1;
		if (t == e) return !0;
		n = fu(t) + 1, t = t.parentNode;
	}
}
function yd(e, t) {
	let n;
	for (; !(e == t || !e); e = e.nextSibling) {
		let t = Mm.get(e);
		if (!t?.isWidget()) return !1;
		t && (n ||= []).push(t);
	}
	if (n) {
		for (let e of n) if (e.overrideDOMText?.length) return !1;
	}
	return !0;
}
function bd(e, t, n, r) {
	if (e.isComposite()) {
		let i = -1, a = -1, o = -1, s = -1;
		for (let c = 0, l = r, u = r; c < e.children.length; c++) {
			let r = e.children[c], d = l + r.length;
			if (l < t && d > n) return bd(r, t, n, l);
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
	} else if (e.isText()) return {
		from: r,
		to: r + e.length,
		startDOM: e.dom,
		endDOM: e.dom.nextSibling
	};
	else return null;
}
function xd(e, t) {
	let n, { newSel: r } = t, { state: i } = e, a = i.selection.main, o = e.inputState.lastKeyTime > Date.now() - 100 ? e.inputState.lastKeyCode : -1;
	if (t.bounds) {
		let { from: e, to: r } = t.bounds, s = a.from, c = null;
		(o === 8 || J.android && t.text.length < r - e) && (s = a.to, c = "end");
		let l = i.doc.sliceString(e, r, rh), u, d;
		!a.empty && a.from >= e && a.to <= r && (t.typeOver || l != t.text) && l.slice(0, a.from - e) == t.text.slice(0, a.from - e) && l.slice(a.to - e) == t.text.slice(u = t.text.length - (l.length - (a.to - e))) ? n = {
			from: a.from,
			to: a.to,
			insert: G.of(t.text.slice(a.from - e, u).split(rh))
		} : (d = wd(l, t.text, s - e, c)) && (J.chrome && o == 13 && d.toB == d.from + 2 && t.text.slice(d.from, d.toB) == "￿￿" && d.toB--, n = {
			from: e + d.from,
			to: e + d.toA,
			insert: G.of(t.text.slice(d.from, d.toB).split(rh))
		});
	} else r && (!e.hasFocus && i.facet(hm) || Dd(r, a)) && (r = null);
	if (!n && !r) return !1;
	if ((J.mac || J.android) && n && n.from == n.to && n.from == a.head - 1 && /^\. ?$/.test(n.insert.toString()) && e.contentDOM.getAttribute("autocorrect") == "off" ? (r && n.insert.length == 2 && (r = K.single(r.main.anchor - 1, r.main.head - 1)), n = {
		from: n.from,
		to: n.to,
		insert: G.of([n.insert.toString().replace(".", " ")])
	}) : i.doc.lineAt(a.from).to < a.to && e.docView.lineHasWidget(a.to) && e.inputState.insertingTextAt > Date.now() - 50 ? n = {
		from: a.from,
		to: a.to,
		insert: i.toText(e.inputState.insertingText)
	} : J.chrome && n && n.from == n.to && n.from == a.head && n.insert.toString() == "\n " && e.lineWrapping && (r &&= K.single(r.main.anchor - 1, r.main.head - 1), n = {
		from: a.from,
		to: a.to,
		insert: G.of([" "])
	}), n) return Sd(e, n, r, o);
	if (r && !Dd(r, a)) {
		let t = !1, n = "select";
		return e.inputState.lastSelectionTime > Date.now() - 50 && (e.inputState.lastSelectionOrigin == "select" && (t = !0), n = e.inputState.lastSelectionOrigin, n == "select.pointer" && (r = hd(i.facet(Tm).map((t) => t(e)), r))), e.dispatch({
			selection: r,
			scrollIntoView: t,
			userEvent: n
		}), !0;
	} else return !1;
}
function Sd(e, t, n, r = -1) {
	if (J.ios && e.inputState.flushIOSKey(t)) return !0;
	let i = e.state.selection.main;
	if (J.android && (t.to == i.to && (t.from == i.from || t.from == i.from - 1 && e.state.sliceDoc(t.from, i.from) == " ") && t.insert.length == 1 && t.insert.lines == 2 && Cu(e.contentDOM, "Enter", 13) || (t.from == i.from - 1 && t.to == i.to && t.insert.length == 0 || r == 8 && t.insert.length < t.to - t.from && t.to > i.head) && Cu(e.contentDOM, "Backspace", 8) || t.from == i.from && t.to == i.to + 1 && t.insert.length == 0 && Cu(e.contentDOM, "Delete", 46))) return !0;
	let a = t.insert.toString();
	e.inputState.composing >= 0 && e.inputState.composing++;
	let o, s = () => o ||= Cd(e, t, n);
	return e.state.facet(am).some((n) => n(e, t.from, t.to, a, s)) || e.dispatch(s()), !0;
}
function Cd(e, t, n) {
	let r, i = e.state, a = i.selection.main, o = -1;
	if (t.from == t.to && t.from < a.from || t.from > a.to) {
		let n = t.from < a.from ? -1 : 1, r = n < 0 ? a.from : a.to, s = md(i.facet(Tm).map((t) => t(e)), r, n);
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
			let c = e.state.sliceDoc(t.from, t.to), l, u = n && ed(e, n.main.head);
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
function wd(e, t, n, r) {
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
function Td(e) {
	let t = [];
	if (e.root.activeElement != e.contentDOM) return t;
	let { anchorNode: n, anchorOffset: r, focusNode: i, focusOffset: a } = e.observer.selectionRange;
	return n && (t.push(new ah(n, r)), (i != n || a != r) && t.push(new ah(i, a))), t;
}
function Ed(e, t) {
	if (e.length == 0) return null;
	let n = e[0].pos, r = e.length == 2 ? e[1].pos : n;
	return n > -1 && r > -1 ? K.single(n + t, r + t) : null;
}
function Dd(e, t) {
	return t.head == e.main.head && t.anchor == e.main.anchor;
}
function Od(e) {
	return e.visualViewport ? e.visualViewport.height * e.visualViewport.scale / e.document.documentElement.clientHeight < .85 : !1;
}
function kd(e, t) {
	return (n, r) => {
		try {
			return t.call(e, r, n);
		} catch (e) {
			Vu(n.state, e);
		}
	};
}
function Ad(e) {
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
			i && n(e).handlers.push(kd(t.value, i));
		}
		if (i) for (let e in i) {
			let r = i[e];
			r && n(e).observers.push(kd(t.value, r));
		}
	}
	for (let e in ph) n(e).handlers.push(ph[e]);
	for (let e in mh) n(e).observers.push(mh[e]);
	return t;
}
function jd(e) {
	return Math.max(0, e) * .7 + 8;
}
function Md(e, t) {
	return Math.max(Math.abs(e.clientX - t.clientX), Math.abs(e.clientY - t.clientY));
}
function Nd(e, t) {
	let n = e.state.facet(em);
	return n.length ? n[0](t) : J.mac ? t.metaKey : t.ctrlKey;
}
function Pd(e, t) {
	let n = e.state.facet(tm);
	return n.length ? n[0](t) : J.mac ? !t.altKey : !t.ctrlKey;
}
function Fd(e, t) {
	let { main: n } = e.state.selection;
	if (n.empty) return !1;
	let r = su(e.root);
	if (!r || r.rangeCount == 0) return !0;
	let i = r.getRangeAt(0).getClientRects();
	for (let e = 0; e < i.length; e++) {
		let n = i[e];
		if (n.left <= t.clientX && n.right >= t.clientX && n.top <= t.clientY && n.bottom >= t.clientY) return !0;
	}
	return !1;
}
function Id(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target, r; n != e.contentDOM; n = n.parentNode) if (!n || n.nodeType == 11 || (r = Mm.get(n)) && r.isWidget() && !r.isHidden && r.widget.ignoreEvent(t)) return !1;
	return !0;
}
function Ld(e) {
	let t = e.dom.parentNode;
	if (!t) return;
	let n = t.appendChild(document.createElement("textarea"));
	n.style.cssText = "position: fixed; left: -10000px; top: 10px", n.focus(), setTimeout(() => {
		e.focus(), n.remove(), zd(e, n.value);
	}, 50);
}
function Rd(e, t, n) {
	for (let r of e.facet(t)) n = r(n, e);
	return n;
}
function zd(e, t) {
	t = Rd(e.state, sm, t);
	let { state: n } = e, r, i = 1, a = n.toText(t), o = a.lines == n.selection.ranges.length;
	if (bh != null && n.selection.ranges.every((e) => e.empty) && bh == a.toString()) {
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
				range: K.cursor(r.from + c.length)
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
			range: K.cursor(e.from + t.length)
		};
	}) : n.replaceSelection(a);
	e.dispatch(r, {
		userEvent: "input.paste",
		scrollIntoView: !0
	});
}
function Bd(e, t, n, r) {
	if (r == 1) return K.cursor(t, n);
	if (r == 2) return sd(e.state, t, n);
	{
		let r = e.docView.lineAt(t, n), i = e.state.doc.lineAt(r ? r.posAtEnd : t), a = r ? r.posAtStart : i.from, o = r ? r.posAtEnd : i.to;
		return o < e.state.doc.length && o == i.to && o++, K.undirectionalRange(a, o);
	}
}
function Vd(e) {
	if (!gh) return e.detail;
	let t = _h, n = yh;
	return _h = e, yh = Date.now(), vh = !t || n > Date.now() - 400 && Math.abs(t.clientX - e.clientX) < 2 && Math.abs(t.clientY - e.clientY) < 2 ? (vh + 1) % 3 : 1;
}
function Hd(e, t) {
	let n = e.posAndSideAtCoords({
		x: t.clientX,
		y: t.clientY
	}, !1), r = Vd(t), i = e.state.selection;
	return {
		update(e) {
			e.docChanged && (n.pos = e.changes.mapPos(n.pos), i = i.map(e.changes));
		},
		get(t, a, o) {
			let s = e.posAndSideAtCoords({
				x: t.clientX,
				y: t.clientY
			}, !1), c, l = Bd(e, s.pos, s.assoc, r);
			if (n.pos != s.pos && !a) {
				let t = Bd(e, n.pos, n.assoc, r), i = Math.min(t.from, l.from), a = Math.max(t.to, l.to);
				l = i < l.from ? K.range(i, a, l.assoc) : K.range(a, i, l.assoc);
			}
			return a ? i.replaceRange(i.main.extend(l.from, l.to, l.assoc)) : o && r == 1 && i.ranges.length > 1 && (c = Ud(i, s.pos)) ? c : o ? i.addRange(l) : K.create([l]);
		}
	};
}
function Ud(e, t) {
	for (let n = 0; n < e.ranges.length; n++) {
		let { from: r, to: i } = e.ranges[n];
		if (r <= t && i >= t) return K.create(e.ranges.slice(0, n).concat(e.ranges.slice(n + 1)), e.mainIndex == n ? 0 : e.mainIndex - +(e.mainIndex > n));
	}
	return null;
}
function Wd(e, t, n, r) {
	if (n = Rd(e.state, sm, n), !n) return;
	let i = e.posAtCoords({
		x: t.clientX,
		y: t.clientY
	}, !1), { draggedContent: a } = e.inputState, o = r && a && Pd(e, t) ? {
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
function Gd(e, t) {
	let n = e.dom.parentNode;
	if (!n) return;
	let r = n.appendChild(document.createElement("textarea"));
	r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.value = t, r.focus(), r.selectionEnd = t.length, r.selectionStart = 0, setTimeout(() => {
		r.remove(), e.focus();
	}, 50);
}
function Kd(e) {
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
		text: Rd(e, cm, t.join(e.lineBreak)),
		ranges: n,
		linewise: r
	};
}
function qd(e, t) {
	let n = [];
	for (let r of e.facet(om)) {
		let i = r(e, t);
		i && n.push(i);
	}
	return n.length ? e.update({
		effects: n,
		annotations: xh.of(!0)
	}) : null;
}
function Jd(e) {
	setTimeout(() => {
		let t = e.hasFocus;
		if (t != e.inputState.notifiedFocused) {
			let n = qd(e.state, t);
			n ? e.dispatch(n) : e.update([]);
		}
	}, 10);
}
function Yd(e) {
	Sh.has(e) || (Sh.add(e), e.addEventListener("copy", () => {}), e.addEventListener("cut", () => {}));
}
function Xd() {
	wh = !1;
}
function Zd(e, t) {
	return e == t ? e : (e.constructor != t.constructor && (wh = !0), t);
}
function Qd(e, t) {
	let n, r;
	e[t] == null && (n = e[t - 1]) instanceof Ph && (r = e[t + 1]) instanceof Ph && e.splice(t - 1, 3, new Ph(n.length + 1 + r.length));
}
function $d(e, t, n) {
	let r = new Rh();
	return Ol.compare(e, t, n, r, 0), r.changes;
}
function ef(e, t) {
	let n = e.getBoundingClientRect(), r = e.ownerDocument, i = r.defaultView || window, a = Math.max(0, n.left), o = Math.min(i.innerWidth, n.right), s = Math.max(0, n.top), c = Math.min(i.innerHeight, n.bottom);
	for (let t = e.parentNode; t && t != r.body;) if (t.nodeType == 1) {
		let n = t, r = window.getComputedStyle(n);
		if ((n.scrollHeight > n.clientHeight || n.scrollWidth > n.clientWidth) && r.overflow != "visible") {
			let r = n.getBoundingClientRect();
			a = Math.max(a, r.left), o = Math.min(o, r.right), s = Math.max(s, r.top), c = Math.min(t == e.parentNode ? i.innerHeight : c, r.bottom);
		}
		t = r.position == "absolute" || r.position == "fixed" ? n.offsetParent : n.parentNode;
	} else if (t.nodeType == 11) t = t.host;
	else break;
	return {
		left: a - n.left,
		right: Math.max(a, o) - n.left,
		top: s - (n.top + t),
		bottom: Math.max(s, c) - (n.top + t)
	};
}
function tf(e) {
	let t = e.getBoundingClientRect(), n = e.ownerDocument.defaultView || window;
	return t.left < n.innerWidth && t.right > 0 && t.top < n.innerHeight && t.bottom > 0;
}
function nf(e, t) {
	let n = e.getBoundingClientRect();
	return {
		left: 0,
		right: n.right - n.left,
		top: t,
		bottom: n.bottom - (n.top + t)
	};
}
function rf(e, t, n) {
	let r = [], i = e, a = 0;
	return Ol.spans(n, e, t, {
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
function af({ total: e, ranges: t }, n) {
	if (n <= 0) return t[0].from;
	if (n >= 1) return t[t.length - 1].to;
	let r = Math.floor(e * n);
	for (let e = 0;; e++) {
		let { from: n, to: i } = t[e], a = i - n;
		if (r <= a) return n + r;
		r -= a;
	}
}
function of(e, t) {
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
function sf(e, t) {
	for (let n of e) if (t(n)) return n;
}
function cf(e) {
	let t = e.facet(Sm).filter((e) => typeof e != "function"), n = e.facet(wm).filter((e) => typeof e != "function");
	return n.length && t.push(Ol.join(n)), t;
}
function lf(e, t) {
	if (t.scale == 1) return e;
	let n = t.toDOM(e.top), r = t.toDOM(e.bottom);
	return new Dh(e.from, e.length, n, r - n, Array.isArray(e._content) ? e._content.map((e) => lf(e, t)) : e._content);
}
function uf(e, t, n) {
	return new Rl(t, { finish(t) {
		return /&/.test(t) ? t.replace(/&\w*/, (t) => {
			if (t == "&") return e;
			if (!n || !n[t]) throw RangeError(`Unsupported selector: ${t}`);
			return n[t];
		}) : e + " " + t;
	} });
}
function df(e, t, n) {
	for (; t;) {
		let r = Mm.get(t);
		if (r && r.parent == e) return r;
		let i = t.parentNode;
		t = i == e.dom ? n > 0 ? t.nextSibling : t.previousSibling : i;
	}
	return null;
}
function ff(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.docView.domAtPos(e.state.selection.main.anchor, 1);
	return du(o.node, o.offset, i, a) && ([n, r, i, a] = [
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
function pf(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return ff(e, n);
	}
	let n = null;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.contentDOM.addEventListener("beforeinput", r, !0), e.dom.ownerDocument.execCommand("indent"), e.contentDOM.removeEventListener("beforeinput", r, !0), n ? ff(e, n) : null;
}
function mf(e, t, n) {
	for (let r = e.state.facet(t), i = r.length - 1; i >= 0; i--) {
		let t = r[i], a = typeof t == "function" ? t(e) : t;
		a && $l(a, n);
	}
	return n;
}
function hf(e, t) {
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
function gf(e, t, n) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n !== !1 && t.shiftKey && (e = "Shift-" + e), e;
}
function _f(e) {
	let t = e.facet(sg), n = cg.get(t);
	return n || cg.set(t, n = yf(t.reduce((e, t) => e.concat(t), []))), n;
}
function vf(e, t, n) {
	return bf(_f(e.state), t, e, n);
}
function yf(e, t = ag) {
	let n = Object.create(null), r = Object.create(null), i = (e, t) => {
		let n = r[e];
		if (n == null) r[e] = t;
		else if (n != t) throw Error("Key binding " + e + " is used both as a regular binding and as a multi-stroke prefix");
	}, a = (e, r, a, o, s) => {
		let c = n[e] || (n[e] = Object.create(null)), l = r.split(/ (?!$)/).map((e) => hf(e, t));
		for (let t = 1; t < l.length; t++) {
			let n = l.slice(0, t).join(" ");
			i(n, !0), c[n] || (c[n] = {
				preventDefault: !0,
				stopPropagation: !1,
				run: [(t) => {
					let r = lg = {
						view: t,
						prefix: n,
						scope: e
					};
					return setTimeout(() => {
						lg == r && (lg = null);
					}, ug), !0;
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
			for (let t in e) e[t].run.push((e) => i(e, dg));
		}
		let i = r[t] || r.key;
		if (i) for (let t of e) a(t, i, r.run, r.preventDefault, r.stopPropagation), r.shift && a(t, "Shift-" + i, r.shift, r.preventDefault, r.stopPropagation);
	}
	return n;
}
function bf(e, t, n, r) {
	dg = t;
	let i = Hl(t), a = rc(tc(i, 0)) == i.length && i != " ", o = "", s = !1, c = !1, l = !1;
	lg && lg.view == n && lg.scope == r && (o = lg.prefix + " ", uh.indexOf(t.keyCode) < 0 && (c = !0, lg = null));
	let u = /* @__PURE__ */ new Set(), d = (e) => {
		if (e) {
			for (let t of e.run) if (!u.has(t) && (u.add(t), t(n))) return e.stopPropagation && (l = !0), !0;
			e.preventDefault && (e.stopPropagation && (l = !0), c = !0);
		}
		return !1;
	}, f = e[r], p, m;
	return f && (d(f[o + gf(i, t, !a)]) ? s = !0 : a && (t.altKey || t.metaKey || t.ctrlKey) && !(J.windows && t.ctrlKey && t.altKey) && !(J.mac && t.altKey && !(t.ctrlKey || t.metaKey)) && (p = Ul[t.keyCode]) && p != i ? (d(f[o + gf(p, t, !0)]) || t.shiftKey && (m = Wl[t.keyCode]) != i && m != p && d(f[o + gf(m, t, !1)])) && (s = !0) : a && t.shiftKey && d(f[o + gf(i, t, !0)]) && (s = !0), !s && d(f._any) && (s = !0)), c && (s = !0), s && l && t.stopPropagation(), dg = null, s;
}
function xf(e) {
	let t = e.scrollDOM.getBoundingClientRect();
	return {
		left: (e.textDirection == Up.LTR ? t.left : t.right - e.scrollDOM.clientWidth * e.scaleX) - e.scrollDOM.scrollLeft * e.scaleX,
		top: t.top - e.scrollDOM.scrollTop * e.scaleY
	};
}
function Sf(e, t, n, r) {
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
function Cf(e, t, n) {
	if (n.to <= e.viewport.from || n.from >= e.viewport.to) return [];
	let r = Math.max(n.from, e.viewport.from), i = Math.min(n.to, e.viewport.to), a = e.textDirection == Up.LTR, o = e.contentDOM, s = o.getBoundingClientRect(), c = xf(e), l = o.querySelector(".cm-line"), u = l && window.getComputedStyle(l), d = s.left + (u ? parseInt(u.paddingLeft) + Math.min(0, parseInt(u.textIndent)) : 0), f = s.right - (u ? parseInt(u.paddingRight) : 0), p = ld(e, r, 1), m = ld(e, i, -1), h = p.type == Pp.Text ? p : null, g = m.type == Pp.Text ? m : null;
	if (h && (e.lineWrapping || p.widgetLineBreaks) && (h = Sf(e, r, 1, h)), g && (e.lineWrapping || m.widgetLineBreaks) && (g = Sf(e, i, -1, g)), h && g && h.from == g.from && h.to == g.to) return v(y(n.from, n.to, h));
	{
		let t = h ? y(n.from, null, h) : b(p, !1), r = g ? y(null, n.to, g) : b(m, !0), i = [];
		return (h || p).to < (g || m).from - (h && g ? 1 : 0) || p.widgetLineBreaks > 1 && t.bottom + e.defaultLineHeight / 2 < r.top ? i.push(_(d, t.bottom, f, r.top)) : t.bottom < r.top && e.elementAtHeight((t.bottom + r.top) / 2).type == Pp.Text && (t.bottom = r.top = (t.bottom + r.top) / 2), v(t).concat(i).concat(v(r));
	}
	function _(e, n, r, i) {
		return new fg(t, e - c.left, n - c.top, Math.max(0, r - e), i - n);
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
			!p || !m || (i = Math.min(p.top, m.top, i), o = Math.max(p.bottom, m.bottom, o), u == Up.LTR ? s.push(a && n ? d : p.left, a && l ? f : m.right) : s.push(!a && l ? d : m.left, !a && n ? f : p.right));
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
function wf(e, t) {
	return e.constructor == t.constructor && e.eq(t);
}
function Tf(e) {
	return [vm.define((t) => new pg(t, e)), mg.of(e)];
}
function Ef(e = {}) {
	return [
		hg.of(e),
		gg,
		_g,
		vg,
		um.of(!0)
	];
}
function Df(e) {
	return e.facet(hg);
}
function Of(e) {
	return e.startState.facet(hg) != e.state.facet(hg);
}
function kf(e, t) {
	t.style.animationDuration = e.facet(hg).cursorBlinkRate + "ms";
}
function Af() {
	return [bg, xg];
}
function jf(e, t, n, r, i) {
	t.lastIndex = 0;
	for (let a = e.iterRange(n, r), o = n, s; !a.next().done; o += a.value.length) if (!a.lineBreak) for (; s = t.exec(a.value);) i(o + s.index, s);
}
function Mf(e, t) {
	let n = e.visibleRanges;
	if (n.length == 1 && n[0].from == e.viewport.from && n[0].to == e.viewport.to) return n;
	let r = [];
	for (let { from: i, to: a } of n) i = Math.max(e.state.doc.lineAt(i).from, i - t), a = Math.min(e.state.doc.lineAt(a).to, a + t), r.length && r[r.length - 1].to >= i ? r[r.length - 1].to = a : r.push({
		from: i,
		to: a
	});
	return r;
}
function Nf() {
	if (Eg == null && typeof document < "u" && document.body) {
		let e = document.body.style;
		Eg = (e.tabSize ?? e.MozTabSize) != null;
	}
	return Eg || !1;
}
function Pf(e = {}) {
	return [Dg.of(e), Ff()];
}
function Ff() {
	return Og ||= vm.fromClass(class {
		constructor(e) {
			this.view = e, this.decorations = Y.none, this.decorationCache = Object.create(null), this.decorator = this.makeDecorator(e.state.facet(Dg)), this.decorations = this.decorator.createDeco(e);
		}
		makeDecorator(e) {
			return new Sg({
				regexp: e.specialChars,
				decoration: (t, n, r) => {
					let { doc: i } = n.state, a = tc(t[0], 0);
					if (a == 9) {
						let e = i.lineAt(r), t = n.state.tabSize, a = Rc(e.text, t, r - e.from);
						return Y.replace({ widget: new jg((t - a % t) * this.view.defaultCharacterWidth / this.view.scaleX) });
					}
					return this.decorationCache[a] || (this.decorationCache[a] = Y.replace({ widget: new Ag(e, a) }));
				},
				boundary: e.replaceTabs ? void 0 : /[^]/
			});
		}
		update(e) {
			let t = e.state.facet(Dg);
			e.startState.facet(Dg) == t ? this.decorations = this.decorator.updateDeco(e, this.decorations) : (this.decorator = this.makeDecorator(t), this.decorations = this.decorator.createDeco(e.view));
		}
	}, { decorations: (e) => e.decorations });
}
function If(e) {
	return e >= 32 ? kg : e == 10 ? "␤" : String.fromCharCode(9216 + e);
}
function Lf() {
	return [Mg, xm.of((e) => e.plugin(Mg)?.attrs || null)];
}
function Rf() {
	return Pg;
}
function zf(e) {
	let t = vm.fromClass(class {
		constructor(t) {
			this.view = t, this.placeholder = e ? Y.set([Y.widget({
				widget: new Fg(e),
				side: 1
			}).range(0)]) : Y.none;
		}
		get decorations() {
			return this.view.state.doc.length ? Y.none : this.placeholder;
		}
	}, { decorations: (e) => e.decorations });
	return typeof e == "string" ? [t, X.contentAttributes.of({ "aria-placeholder": e })] : t;
}
function Bf(e, t, n) {
	let r = Math.min(t.line, n.line), i = Math.max(t.line, n.line), a = [];
	if (t.off > Ig || n.off > Ig || t.col < 0 || n.col < 0) {
		let o = Math.min(t.off, n.off), s = Math.max(t.off, n.off);
		for (let t = r; t <= i; t++) {
			let n = e.doc.line(t);
			n.length <= s && a.push(K.range(n.from + o, n.to + s));
		}
	} else {
		let o = Math.min(t.col, n.col), s = Math.max(t.col, n.col);
		for (let t = r; t <= i; t++) {
			let n = e.doc.line(t), r = zc(n.text, o, e.tabSize, !0);
			if (r < 0) a.push(K.cursor(n.to));
			else {
				let t = zc(n.text, s, e.tabSize);
				a.push(K.range(n.from + r, n.from + t));
			}
		}
	}
	return a;
}
function Vf(e, t) {
	let n = e.coordsAtPos(e.viewport.from);
	return n ? Math.round(Math.abs((n.left - t) / e.defaultCharacterWidth)) : -1;
}
function Hf(e, t) {
	let n = e.posAtCoords({
		x: t.clientX,
		y: t.clientY
	}, !1), r = e.state.doc.lineAt(n), i = n - r.from, a = i > Ig ? -1 : i == r.length ? Vf(e, t.clientX) : Rc(r.text, e.state.tabSize, n - r.from);
	return {
		line: r.number,
		col: a,
		off: i
	};
}
function Uf(e, t) {
	let n = Hf(e, t), r = e.state.selection;
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
			let o = Hf(e, t);
			if (!o) return r;
			let s = Bf(e.state, n, o);
			return s.length ? a ? K.create(s.concat(r.ranges)) : K.create(s) : r;
		}
	} : null;
}
function Wf(e) {
	let t = e?.eventFilter || ((e) => e.altKey && e.button == 0);
	return X.mouseSelectionStyle.of((e, n) => t(n) ? Uf(e, n) : null);
}
function Gf(e = {}) {
	let [t, n] = Lg[e.key || "Alt"], r = vm.fromClass(class {
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
			(e.keyCode == t || !n(e)) && this.set(!1);
		},
		mousemove(e) {
			this.set(n(e));
		}
	} });
	return [r, X.contentAttributes.of((e) => e.plugin(r)?.isDown ? Rg : null)];
}
function Kf(e = {}) {
	return Vg.of(e);
}
function qf(e) {
	let t = e.dom.ownerDocument.documentElement;
	return {
		top: 0,
		left: 0,
		bottom: t.clientHeight,
		right: t.clientWidth
	};
}
function Jf(e, t) {
	let n = parseInt(e.style.left, 10);
	(isNaN(n) || Math.abs(t - n) > 1) && (e.style.left = t + "px");
}
function Yf(e, t) {
	let { left: n, right: r, top: i, bottom: a } = e.getBoundingClientRect(), o;
	if (o = e.querySelector(".cm-tooltip-arrow")) {
		let e = o.getBoundingClientRect();
		i = Math.min(e.top, i), a = Math.max(e.bottom, a);
	}
	return t.clientX >= n - Qg && t.clientX <= r + Qg && t.clientY >= i - Qg && t.clientY <= a + Qg;
}
function Xf(e, t, n, r, i, a) {
	let o = e.scrollDOM.getBoundingClientRect(), s = e.documentTop + e.documentPadding.top + e.contentHeight;
	if (o.left > r || o.right < r || o.top > i || Math.min(o.bottom, s) < i) return !1;
	let c = e.posAtCoords({
		x: r,
		y: i
	}, !1);
	return c >= t && c <= n;
}
function Zf(e, t = {}) {
	let n = vl.define(), r = /* @__PURE__ */ new WeakMap(), i = tl.define({
		create() {
			return [];
		},
		update(e, a) {
			let o = r.get(e);
			if (e.length && (t.hideOnChange && (a.docChanged || a.selection) || o && o(a) ? e = [] : t.hideOn && (e = e.filter((e) => !t.hideOn(a, e)))), a.docChanged && e.length) {
				let t = [];
				for (let n of e) {
					let e = a.changes.mapPos(n.pos, -1, qc.TrackDel);
					if (e != null) {
						let r = Object.assign(Object.create(null), n);
						r.pos = e, r.end != null && (r.end = a.changes.mapPos(r.end)), t.push(r);
					}
				}
				e = t;
			}
			for (let t of a.effects) t.is(n) && (e = t.value, o = void 0), (t.is($g) && !t.value || t.value == i) && (e = []);
			return e.length && o && r.set(e, o), e;
		},
		provide: (e) => qg.from(e)
	}), a = vm.define((a) => new Zg(a, e, i, r, n, t.hoverTime || 300));
	return {
		active: i,
		extension: [
			i,
			a,
			Xg.of(a),
			Yg
		]
	};
}
function Qf(e, t, n, r = {}) {
	let i = e.state.facet(Xg).map((t) => e.plugin(t)).filter((e) => !!e);
	if (r.tooltip && r.tooltip.active) {
		let e = i.find((e) => e.field == r.tooltip.active);
		e && (i = [e]);
	}
	for (let a of i) a.activateHover(e, t, n, r.until ?? (() => !1));
}
function $f(e, t) {
	let n = e.plugin(Ug);
	if (!n) return null;
	let r = n.manager.tooltips.indexOf(t);
	return r < 0 ? null : n.manager.tooltipViews[r];
}
function ep(e) {
	return e.facet(qg).some((e) => e);
}
function tp(e) {
	return $g.of(e.active);
}
function np(e) {
	let t = e.plugin(Ug);
	t && t.maybeMeasure();
}
function rp(e) {
	return e ? [t_.of(e)] : [];
}
function ip(e, t) {
	let n = e.plugin(n_), r = n ? n.specs.indexOf(t) : -1;
	return r > -1 ? n.panels[r] : null;
}
function ap(e) {
	let t = e.nextSibling;
	return e.remove(), t;
}
function op(e, t) {
	let n, r = new Promise((e) => n = e), i = (e) => cp(e, t, n);
	e.state.field(a_, !1) ? e.dispatch({ effects: o_.of(i) }) : e.dispatch({ effects: vl.appendConfig.of(a_.init(() => [i])) });
	let a = s_.of(i);
	return {
		close: a,
		result: r.then((t) => ((e.win.queueMicrotask || ((t) => e.win.setTimeout(t, 10)))(() => {
			e.state.field(a_).indexOf(i) > -1 && e.dispatch({ effects: a });
		}), t))
	};
}
function sp(e, t) {
	let n = e.state.field(a_, !1) || [];
	for (let r of n) {
		let n = ip(e, r);
		if (n && n.dom.classList.contains(t)) return n;
	}
	return null;
}
function cp(e, t, n) {
	let r = t.content ? t.content(e, () => o(null)) : null;
	if (!r) {
		if (r = Yl("form"), t.input) {
			let e = Yl("input", t.input);
			/^(text|password|number|email|tel|url)$/.test(e.type) && e.classList.add("cm-textfield"), e.name ||= "input", r.appendChild(Yl("label", (t.label || "") + ": ", e));
		} else r.appendChild(document.createTextNode(t.label || ""));
		r.appendChild(document.createTextNode(" ")), r.appendChild(Yl("button", {
			class: "cm-button",
			type: "submit"
		}, t.submitLabel || "OK"));
	}
	let i = r.nodeName == "FORM" ? [r] : r.querySelectorAll("form");
	for (let e = 0; e < i.length; e++) {
		let t = i[e];
		t.addEventListener("keydown", (e) => {
			e.keyCode == 27 ? (e.preventDefault(), o(null)) : e.keyCode == 13 && (e.preventDefault(), o(t));
		}), t.addEventListener("submit", (e) => {
			e.preventDefault(), o(t);
		});
	}
	let a = Yl("div", r, Yl("button", {
		onclick: () => o(null),
		"aria-label": e.state.phrase("close"),
		class: "cm-dialog-close",
		type: "button"
	}, ["×"]));
	t.class && (a.className = t.class), a.classList.add("cm-dialog");
	function o(t) {
		a.contains(a.ownerDocument.activeElement) && e.focus(), n(t);
	}
	return {
		dom: a,
		top: t.top,
		mount: () => {
			if (t.focus) {
				let e;
				e = typeof t.focus == "string" ? r.querySelector(t.focus) : r.querySelector("input") || r.querySelector("button"), e && "select" in e ? e.select() : e && "focus" in e && e.focus();
			}
		}
	};
}
function lp(e) {
	return [up(), f_.of({
		...d_,
		...e
	})];
}
function up(e) {
	let t = [m_];
	return e && e.fixed === !1 && t.push(p_.of(!0)), t;
}
function dp(e) {
	return Array.isArray(e) ? e : [e];
}
function fp(e, t, n) {
	for (; e.value && e.from <= n;) e.from == n && t.push(e.value), e.next();
}
function pp(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].compare(t[n])) return !1;
	return !0;
}
function mp(e, t) {
	return e.state.facet(b_).formatNumber(t, e.state);
}
function hp(e = {}) {
	return [
		b_.of(e),
		up(),
		S_
	];
}
function gp(e) {
	let t = 9;
	for (; t < e;) t = t * 10 + 9;
	return t;
}
function _p() {
	return w_;
}
function vp(e) {
	return vm.define((t) => ({
		decorations: e.createDeco(t),
		update(t) {
			this.decorations = e.updateDeco(t, this.decorations);
		}
	}), { decorations: (e) => e.decorations });
}
function yp() {
	return D_;
}
function bp() {
	return O_;
}
var xp, Sp, Cp, wp, Tp, Ep, Dp, Op, kp, Ap, jp, J, Mp, Np, Pp, Y, Fp, Ip, Lp, Rp, zp, Bp, Vp, Hp, Up, Wp, Gp, Kp, qp, Jp, Yp, Xp, Zp, Qp, $p, em, tm, nm, rm, im, am, om, sm, cm, lm, um, dm, fm, pm, mm, hm, gm, _m, vm, ym, bm, xm, Sm, Cm, wm, Tm, Em, Dm, Om, km, Am, jm, Mm, Nm, Pm, Fm, Im, Lm, Rm, zm, Bm, Vm, Hm, Um, Wm, Gm, Km, qm, Jm, Ym, Xm, Zm, Qm, $m, eh, th, nh, rh, ih, ah, oh, sh, ch, lh, uh, dh, fh, ph, mh, hh, gh, _h, vh, yh, bh, xh, Sh, Ch, wh, Th, Eh, Dh, Oh, kh, Ah, jh, Mh, Nh, Ph, Fh, Ih, Lh, Rh, zh, Bh, Vh, Hh, Uh, Wh, Gh, Kh, qh, Jh, Yh, Xh, Zh, Qh, $h, eg, tg, X, ng, rg, ig, ag, og, sg, cg, lg, ug, dg, fg, pg, mg, hg, gg, _g, vg, yg, bg, xg, Sg, Cg, wg, Tg, Eg, Dg, Og, kg, Ag, jg, Mg, Ng, Pg, Fg, Ig, Lg, Rg, zg, Bg, Vg, Hg, Ug, Wg, Gg, Kg, qg, Jg, Yg, Xg, Zg, Qg, $g, e_, t_, n_, r_, i_, a_, o_, s_, c_, l_, u_, d_, f_, p_, m_, h_, g_, __, v_, y_, b_, x_, S_, C_, w_, T_, E_, D_, O_, k_, A_ = t((() => {
	Nl(), Vl(), Jl(), Zl(), xp = typeof navigator < "u" ? navigator : {
		userAgent: "",
		vendor: "",
		platform: ""
	}, Sp = typeof document < "u" ? document : { documentElement: { style: {} } }, Cp = /*@__PURE__*/ /Edge\/(\d+)/.exec(xp.userAgent), wp = /*@__PURE__*/ /MSIE \d/.test(xp.userAgent), Tp = /*@__PURE__*/ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(xp.userAgent), Ep = !!(wp || Tp || Cp), Dp = !Ep && /*@__PURE__*/ /gecko\/(\d+)/i.test(xp.userAgent), Op = !Ep && /*@__PURE__*/ /Chrome\/(\d+)/.exec(xp.userAgent), kp = "webkitFontSmoothing" in Sp.documentElement.style, Ap = !Ep && /*@__PURE__*/ /Apple Computer/.test(xp.vendor), jp = Ap && (/*@__PURE__*/ /Mobile\/\w+/.test(xp.userAgent) || xp.maxTouchPoints > 2), J = {
		mac: jp || /*@__PURE__*/ /Mac/.test(xp.platform),
		windows: /*@__PURE__*/ /Win/.test(xp.platform),
		linux: /*@__PURE__*/ /Linux|X11/.test(xp.platform),
		ie: Ep,
		ie_version: wp ? Sp.documentMode || 6 : Tp ? +Tp[1] : Cp ? +Cp[1] : 0,
		gecko: Dp,
		gecko_version: Dp ? +(/*@__PURE__*/ /Firefox\/(\d+)/.exec(xp.userAgent) || [0, 0])[1] : 0,
		chrome: !!Op,
		chrome_version: Op ? +Op[1] : 0,
		ios: jp,
		android: /*@__PURE__*/ /Android\b/.test(xp.userAgent),
		webkit: kp,
		webkit_version: kp ? +(/*@__PURE__*/ /\bAppleWebKit\/(\d+)/.exec(xp.userAgent) || [0, 0])[1] : 0,
		safari: Ap,
		safari_version: Ap ? +(/*@__PURE__*/ /\bVersion\/(\d+(\.\d+)?)/.exec(xp.userAgent) || [0, 0])[1] : 0,
		tabSize: Sp.documentElement.style.tabSize == null ? "-moz-tab-size" : "tab-size"
	}, Mp = /*@__PURE__*/ Object.create(null), Np = class {
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
	}, Pp = /*@__PURE__*/ (function(e) {
		return e[e.Text = 0] = "Text", e[e.WidgetBefore = 1] = "WidgetBefore", e[e.WidgetAfter = 2] = "WidgetAfter", e[e.WidgetRange = 3] = "WidgetRange", e;
	})(Pp ||= {}), Y = class extends Tl {
		constructor(e, t, n, r) {
			super(), this.startSide = e, this.endSide = t, this.widget = n, this.spec = r;
		}
		get heightRelevant() {
			return !1;
		}
		static mark(e) {
			return new Fp(e);
		}
		static widget(e) {
			let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), n = !!e.block;
			return t += n && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new Lp(e, t, t, n, e.widget || null, !1);
		}
		static replace(e) {
			let t = !!e.block, n, r;
			if (e.isBlockGap) n = -5e8, r = 4e8;
			else {
				let { start: i, end: a } = iu(e, t);
				n = (i ? t ? -3e8 : -1 : 5e8) - 1, r = (a ? t ? 2e8 : 1 : -6e8) + 1;
			}
			return new Lp(e, n, r, t, e.widget || null, !0);
		}
		static line(e) {
			return new Ip(e);
		}
		static set(e, t = !1) {
			return Ol.of(e, t);
		}
		hasHeight() {
			return this.widget ? this.widget.estimatedHeight > -1 : !1;
		}
	}, Y.none = Ol.empty, Fp = class e extends Y {
		constructor(e) {
			let { start: t, end: n } = iu(e);
			super(t ? -1 : 5e8, n ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.attrs = e.class && e.attributes ? $l(e.attributes, { class: e.class }) : e.class ? { class: e.class } : e.attributes || Mp;
		}
		eq(t) {
			return this == t || t instanceof e && this.tagName == t.tagName && eu(this.attrs, t.attrs);
		}
		range(e, t = e) {
			if (e >= t) throw RangeError("Mark decorations may not be empty");
			return super.range(e, t);
		}
	}, Fp.prototype.point = !1, Ip = class e extends Y {
		constructor(e) {
			super(-2e8, -2e8, null, e);
		}
		eq(t) {
			return t instanceof e && this.spec.class == t.spec.class && eu(this.spec.attributes, t.spec.attributes);
		}
		range(e, t = e) {
			if (t != e) throw RangeError("Line decoration ranges must be zero-length");
			return super.range(e, t);
		}
	}, Ip.prototype.mapMode = qc.TrackBefore, Ip.prototype.point = !0, Lp = class e extends Y {
		constructor(e, t, n, r, i, a) {
			super(t, n, i, e), this.block = r, this.isReplace = a, this.mapMode = r ? t <= 0 ? qc.TrackBefore : qc.TrackAfter : qc.TrackDel;
		}
		get type() {
			return this.startSide == this.endSide ? this.startSide <= 0 ? Pp.WidgetBefore : Pp.WidgetAfter : Pp.WidgetRange;
		}
		get heightRelevant() {
			return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
		}
		eq(t) {
			return t instanceof e && au(this.widget, t.widget) && this.block == t.block && this.startSide == t.startSide && this.endSide == t.endSide;
		}
		range(e, t = e) {
			if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0)) throw RangeError("Invalid range for replacement decoration");
			if (!this.isReplace && t != e) throw RangeError("Widget decorations can only have zero-length ranges");
			return super.range(e, t);
		}
	}, Lp.prototype.point = !0, Rp = class e extends Tl {
		constructor(e, t, n) {
			super(), this.tagName = e, this.attributes = t, this.rank = n;
		}
		eq(t) {
			return t == this || t instanceof e && this.tagName == t.tagName && eu(this.attributes, t.attributes);
		}
		static create(t) {
			return new e(t.tagName, t.attributes || Mp, t.rank == null ? 50 : Math.max(0, Math.min(t.rank, 100)));
		}
		static set(e, t = !1) {
			return Ol.of(e, t);
		}
	}, Rp.prototype.startSide = Rp.prototype.endSide = -1, zp = class {
		constructor() {
			this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
		}
		eq(e) {
			return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
		}
		setRange(e) {
			let { anchorNode: t, focusNode: n } = e;
			this.set(t, Math.min(e.anchorOffset, t ? hu(t) : 0), n, Math.min(e.focusOffset, n ? hu(n) : 0));
		}
		set(e, t, n, r) {
			this.anchorNode = e, this.anchorOffset = t, this.focusNode = n, this.focusOffset = r;
		}
	}, Bp = null, J.safari && J.safari_version >= 26 && (Bp = !1), Hp = class e {
		constructor(e, t, n = !0) {
			this.node = e, this.offset = t, this.precise = n;
		}
		static before(t, n) {
			return new e(t.parentNode, fu(t), n);
		}
		static after(t, n) {
			return new e(t.parentNode, fu(t) + 1, n);
		}
	}, Up = /*@__PURE__*/ (function(e) {
		return e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL", e;
	})(Up ||= {}), Wp = Up.LTR, Gp = Up.RTL, Kp = /*@__PURE__*/ ku("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), qp = /*@__PURE__*/ ku("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), Jp = /*@__PURE__*/ Object.create(null), Yp = [];
	for (let e of [
		"()",
		"[]",
		"{}"
	]) {
		let t = /*@__PURE__*/ e.charCodeAt(0), n = /*@__PURE__*/ e.charCodeAt(1);
		Jp[t] = n, Jp[n] = -t;
	}
	Xp = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/, Zp = class {
		get dir() {
			return this.level % 2 ? Gp : Wp;
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
	}, Qp = [], $p = "", em = /*@__PURE__*/ q.define(), tm = /*@__PURE__*/ q.define(), nm = /*@__PURE__*/ q.define(), rm = /*@__PURE__*/ q.define(), im = /*@__PURE__*/ q.define(), am = /*@__PURE__*/ q.define(), om = /*@__PURE__*/ q.define(), sm = /*@__PURE__*/ q.define(), cm = /*@__PURE__*/ q.define(), lm = /*@__PURE__*/ q.define({ combine: (e) => e.some((e) => e) }), um = /*@__PURE__*/ q.define({ combine: (e) => e.some((e) => e) }), dm = /*@__PURE__*/ q.define(), fm = class e {
		constructor(e, t, n, r, i, a = !1) {
			this.range = e, this.y = t, this.x = n, this.yMargin = r, this.xMargin = i, this.isSnapshot = a;
		}
		map(t) {
			return t.empty ? this : new e(this.range.map(t), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
		}
		clip(t) {
			return this.range.to <= t.doc.length ? this : new e(K.cursor(t.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
		}
	}, pm = /*@__PURE__*/ vl.define({ map: (e, t) => e.map(t) }), mm = /*@__PURE__*/ vl.define(), hm = /*@__PURE__*/ q.define({ combine: (e) => !e.length || e[0] }), gm = 0, _m = /*@__PURE__*/ q.define({ combine(e) {
		return e.filter((t, n) => {
			for (let r = 0; r < n; r++) if (e[r].plugin == t.plugin) return !1;
			return !0;
		});
	} }), vm = class e {
		constructor(e, t, n, r, i) {
			this.id = e, this.create = t, this.domEventHandlers = n, this.domEventObservers = r, this.baseExtensions = i(this), this.extension = this.baseExtensions.concat(_m.of({
				plugin: this,
				arg: void 0
			}));
		}
		of(e) {
			return this.baseExtensions.concat(_m.of({
				plugin: this,
				arg: e
			}));
		}
		static define(t, n) {
			let { eventHandlers: r, eventObservers: i, provide: a, decorations: o } = n || {};
			return new e(gm++, t, r, i, (e) => {
				let t = [];
				return o && t.push(Sm.of((t) => {
					let n = t.plugin(e);
					return n ? o(n) : Y.none;
				})), a && t.push(a(e)), t;
			});
		}
		static fromClass(t, n) {
			return e.define((e, n) => new t(e, n), n);
		}
	}, ym = class {
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
					Vu(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
				}
			} else if (this.mustUpdate) {
				let e = this.mustUpdate;
				if (this.mustUpdate = null, this.value.update) try {
					this.value.update(e);
				} catch (t) {
					if (Vu(e.state, t, "CodeMirror plugin crashed"), this.value.destroy) try {
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
				Vu(e.state, t, "CodeMirror plugin crashed");
			}
		}
		deactivate() {
			this.spec = this.value = null;
		}
	}, bm = /*@__PURE__*/ q.define(), xm = /*@__PURE__*/ q.define(), Sm = /*@__PURE__*/ q.define(), Cm = /*@__PURE__*/ q.define(), wm = /*@__PURE__*/ q.define(), Tm = /*@__PURE__*/ q.define(), Em = /*@__PURE__*/ q.define(), Dm = /*@__PURE__*/ q.define(), Om = /*@__PURE__*/ q.define(), km = class e {
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
	}, Am = class e {
		constructor(e, t, n) {
			this.view = e, this.state = t, this.transactions = n, this.flags = 0, this.startState = e.state, this.changes = Yc.empty(this.startState.doc.length);
			for (let e of n) this.changes = this.changes.compose(e.changes);
			let r = [];
			this.changes.iterChangedRanges((e, t, n, i) => r.push(new km(e, t, n, i))), this.changedRanges = r;
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
	}, jm = [], Mm = class {
		constructor(e, t, n = 0) {
			this.dom = e, this.length = t, this.flags = n, this.parent = null, e.cmTile = this;
		}
		get breakAfter() {
			return this.flags & 1;
		}
		get children() {
			return jm;
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
				e && tu(this.dom, e);
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
			let n = fu(this.dom), r = this.length ? e > 0 : t > 0;
			return new Hp(this.parent.dom, n + +!!r, e == 0 || e == this.length);
		}
		markDirty(e) {
			this.flags &= -3, e && (this.flags |= 4), this.parent && this.parent.flags & 2 && this.parent.markDirty(!1);
		}
		get overrideDOMText() {
			return null;
		}
		get root() {
			for (let e = this; e; e = e.parent) if (e instanceof Pm) return e;
			return null;
		}
		static get(e) {
			return e.cmTile;
		}
	}, Nm = class extends Mm {
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
				if (o.sync(e), a += o.length + o.breakAfter, r = n ? n.nextSibling : t.firstChild, i && r != o.dom && (i.written = !0), o.dom.parentNode == t) for (; r && r != o.dom;) r = Wu(r);
				else t.insertBefore(o.dom, r);
				n = o.dom;
			}
			for (r = n ? n.nextSibling : t.firstChild, i && r && (i.written = !0); r;) r = Wu(r);
			this.length = a;
		}
	}, Pm = class extends Nm {
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
				let t = Mm.get(e);
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
				if (a instanceof Fm) t.push(r), n = a, r = 0;
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
	}, Fm = class e extends Nm {
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
	}, Im = class e extends Nm {
		constructor(e, t) {
			super(e), this.attrs = t;
		}
		isLine() {
			return !0;
		}
		static start(t, n, r) {
			let i = new e(n || document.createElement("div"), t);
			return (!n || !r) && (i.flags |= 4), i;
		}
		get domAttrs() {
			return this.attrs;
		}
		resolveInline(e, t, n) {
			let r = null, i = -1, a = null, o = -1;
			function s(e, c) {
				for (let l = 0, u = 0; l < e.children.length && u <= c; l++) {
					let d = e.children[l], f = u + d.length;
					f >= c && (d.isComposite() ? s(d, c - u) : (!a || a.isHidden && (t > 0 && !(a.flags & 32) || n && Ku(a, d))) && (f > c || d.flags & 32) ? (a = d, o = c - u) : (u < c || d.flags & 16 && !d.isHidden) && (r = d, i = c - u)), u = f;
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
			return r ? r.tile.coordsIn(Math.max(0, r.offset), t, n) : Gu(this);
		}
		domIn(e, t) {
			let n = this.resolveInline(e, t);
			if (n) {
				let { tile: e, offset: r } = n;
				if (this.dom.contains(e.dom)) return e.isText() ? new Hp(e.dom, Math.min(e.dom.nodeValue.length, r)) : e.domPosFor(r, e.flags & 16 ? 1 : e.flags & 32 ? -1 : t);
				let i = n.tile.parent, a = !1;
				for (let e of i.children) {
					if (a) return new Hp(e.dom, 0);
					e == n.tile && (a = !0);
				}
			}
			return new Hp(this.dom, 0);
		}
	}, Lm = class e extends Nm {
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
	}, Rm = class e extends Mm {
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
			let s = Su(this.dom, i, a).getClientRects();
			if (!s.length) return null;
			let c = s[(o ? o < 0 : t >= 0) ? 0 : s.length - 1];
			return J.safari && !o && c.width == 0 && (c = Array.prototype.find.call(s, (e) => e.width) || c), n == null ? c : gu(c, (o ? o > 0 : t < 0) == n);
		}
		static of(t, n) {
			let r = new e(n || document.createTextNode(t), t);
			return n || (r.flags |= 2), r;
		}
	}, zm = class e extends Mm {
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
			if (n) return gu(this.dom.getBoundingClientRect(), this.length ? e == 0 : t <= 0);
			{
				let t = this.dom.getClientRects(), n = null;
				if (!t.length) return null;
				let r = this.flags & 16 ? !0 : this.flags & 32 ? !1 : e > 0;
				for (let i = r ? t.length - 1 : 0; n = t[i], !(e > 0 ? i == 0 : i == t.length - 1 || n.top < n.bottom); i += r ? -1 : 1);
				return gu(n, !r);
			}
		}
		get overrideDOMText() {
			if (!this.length) return G.empty;
			let { root: e } = this;
			if (!e) return G.empty;
			let t = this.posAtStart;
			return e.view.state.doc.slice(t, t + this.length);
		}
		destroy() {
			super.destroy(), this.widget.destroy(this.dom);
		}
		static of(t, n, r, i, a) {
			return a || (a = t.toDOM(n), t.editable || (a.contentEditable = "false")), new e(a, r, t, i);
		}
	}, Bm = class extends Mm {
		constructor(e) {
			let t = document.createElement("img");
			t.className = "cm-widgetBuffer", t.setAttribute("aria-hidden", "true"), super(t, 0, e);
		}
		get isHidden() {
			return !0;
		}
		get overrideDOMText() {
			return G.empty;
		}
		coordsIn(e, t, n) {
			let r = this.dom.getBoundingClientRect();
			return n == null ? r : gu(r, t > 0 == n);
		}
	}, Vm = class {
		constructor(e) {
			this.index = 0, this.beforeBreak = !1, this.parents = [], this.tile = e;
		}
		advance(e, t, n) {
			let { tile: r, index: i, beforeBreak: a, parents: o } = this;
			for (; e || t > 0;) if (!r.isComposite()) if (i == r.length) a = !!r.breakAfter, {tile: r, index: i} = o.pop(), i++;
			else if (e) {
				let t = Math.min(e, r.length - i);
				n && n.skip(r, i, i + t), e -= t, i += t;
			} else break;
			else if (a) {
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
	}, Hm = class {
		constructor(e, t, n, r) {
			this.from = e, this.to = t, this.wrapper = n, this.rank = r;
		}
	}, Um = class {
		constructor(e, t, n) {
			this.cache = e, this.root = t, this.blockWrappers = n, this.curLine = null, this.lastBlock = null, this.afterWidget = null, this.pos = 0, this.wrappers = [], this.wrapperPos = 0;
		}
		addText(e, t, n, r) {
			this.flushBuffer();
			let i = this.ensureMarks(t, n), a = i.lastChild;
			if (a && a.isText() && !(a.flags & 8) && a.length + e.length < 512) {
				this.cache.reused.set(a, 2);
				let t = i.children[i.children.length - 1] = new Rm(a.dom, a.text + e);
				t.parent = i;
			} else i.append(r || Rm.of(e, this.cache.find(Rm)?.dom));
			this.pos += e.length, this.afterWidget = null;
		}
		addComposition(e, t) {
			let n = this.curLine;
			n.dom != t.line.dom && (n.setDOM(this.cache.reused.has(t.line) ? Zu(t.line.dom) : t.line.dom), this.cache.reused.set(t.line, 2));
			let r = n;
			for (let e = t.marks.length - 1; e >= 0; e--) {
				let n = t.marks[e], i = r.lastChild;
				if (i instanceof Lm && i.mark.eq(n.mark)) i.dom != n.dom && i.setDOM(Zu(n.dom)), r = i;
				else {
					if (this.cache.reused.get(n)) {
						let e = Mm.get(n.dom);
						e && e.setDOM(Zu(n.dom));
					}
					let e = Lm.of(n.mark, n.dom);
					r.append(e), r = e;
				}
				this.cache.reused.set(n, 2);
			}
			let i = Mm.get(e.text);
			i && this.cache.reused.set(i, 2);
			let a = new Rm(e.text, e.text.nodeValue);
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
			e ||= Jm;
			let n = Im.start(e, t || this.cache.find(Im)?.dom, !!t);
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
				if (t > 0 && (a = n.lastChild) && a instanceof Lm && a.mark.eq(i)) n = a, t--;
				else {
					let e = Lm.of(i, this.cache.find(Lm, (e) => e.mark.eq(i))?.dom);
					n.append(e), n = e, t = 0;
				}
			}
			return n;
		}
		endLine() {
			if (this.curLine) {
				this.flushBuffer();
				let e = this.curLine.lastChild;
				(!e || !qu(this.curLine, !1) || e.dom.nodeName != "BR" && e.isWidget() && !(J.ios && qu(this.curLine, !0))) && this.curLine.append(this.cache.findWidget(Xm, 0, 32) || new zm(Xm.toDOM(), 0, Xm, 32)), this.curLine = this.afterWidget = null;
			}
		}
		updateBlockWrappers() {
			this.wrapperPos > this.pos + 1e4 && (this.blockWrappers.goto(this.pos), this.wrappers.length = 0);
			for (let e = this.wrappers.length - 1; e >= 0; e--) this.wrappers[e].to < this.pos && this.wrappers.splice(e, 1);
			for (let e = this.blockWrappers; e.value && e.from <= this.pos; e.next()) if (e.to >= this.pos) {
				let t = e.rank * 102 + e.value.rank, n = new Hm(e.from, e.to, e.value, t), r = this.wrappers.length;
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
				if (t.from < this.pos && n instanceof Fm && n.wrapper.eq(t.wrapper)) e = n;
				else {
					let n = Fm.of(t.wrapper, this.cache.find(Fm, (e) => e.wrapper.eq(t.wrapper))?.dom);
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
			let t = 2 | (e < 0 ? 16 : 32), n = this.cache.find(Bm, void 0, 1);
			return n && (n.flags = t), n || new Bm(t);
		}
		flushBuffer() {
			this.afterWidget && !(this.afterWidget.flags & 32) && (this.afterWidget.parent.append(this.getBuffer(-1)), this.afterWidget = null);
		}
	}, Wm = class {
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
	}, Gm = [
		zm,
		Im,
		Rm,
		Lm,
		Bm,
		Fm,
		Pm
	];
	for (let e = 0; e < Gm.length; e++) Gm[e].bucket = e;
	Km = class {
		constructor(e) {
			this.view = e, this.buckets = Gm.map(() => []), this.index = Gm.map(() => 0), this.reused = /* @__PURE__ */ new Map();
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
				if (!this.reused.has(o) && (a == 0 ? o.widget.compare(e) : o.widget.constructor == e.constructor && e.updateDOM(o.dom, this.view, o.widget))) return r.splice(i, 1), i < this.index[0] && this.index[0]--, o.widget == e && o.length == t && (o.flags & 497) == n ? (this.reused.set(o, 1), o) : (this.reused.set(o, 2), new zm(o.dom, t, e, o.flags & -498 | n));
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
	}, qm = class {
		constructor(e, t, n, r, i) {
			this.view = e, this.decorations = r, this.disallowBlockEffectsFor = i, this.openWidget = !1, this.openMarks = 0, this.cache = new Km(e), this.text = new Wm(e.state.doc), this.builder = new Um(this.cache, new Pm(e, e.contentDOM), Ol.iter(n)), this.cache.reused.set(t, 2), this.old = new Vm(t), this.reuseWalker = {
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
			let r = Xu(this.old), i = this.openMarks;
			this.old.advance(e, n ? 1 : -1, {
				skip: (e, t, n) => {
					if (e.isWidget()) if (this.openWidget) this.builder.continueWidget(n - t);
					else {
						let a = n > 0 || t < e.length ? zm.of(e.widget, this.view, n - t, e.flags & 496, this.cache.maybeReuse(e)) : this.cache.reuse(e);
						a.flags & 256 ? (a.flags &= -2, this.builder.addBlockWidget(a)) : (this.builder.ensureLine(null), this.builder.addInlineWidget(a, r, i), i = r.length);
					}
					else if (e.isText()) this.builder.ensureLine(null), !t && n == e.length && !this.cache.reused.has(e) ? this.builder.addText(e.text, r, i, this.cache.reuse(e)) : (this.cache.add(e), this.builder.addText(e.text.slice(t, n), r, i)), i = r.length;
					else if (e.isLine()) e.flags &= -2, this.cache.reused.set(e, 1), this.builder.addLine(e);
					else if (e instanceof Bm) this.cache.add(e);
					else if (e instanceof Lm) this.builder.ensureLine(null), this.builder.addMark(e, r, i), this.cache.reused.set(e, 1), i = r.length;
					else return !1;
					this.openWidget = !1;
				},
				enter: (e) => {
					e.isLine() ? this.builder.addLineStart(e.attrs, this.cache.maybeReuse(e)) : (this.cache.add(e), e instanceof Lm && r.unshift(e.mark)), this.openWidget = !1;
				},
				leave: (e) => {
					e.isLine() ? r.length &&= i = 0 : e instanceof Lm && (r.shift(), i = Math.min(i, r.length));
				},
				break: () => {
					this.builder.addBreak(), this.openWidget = !1;
				}
			}), this.text.skip(e);
		}
		emit(e, t) {
			let n = null, r = this.builder, i = 0, a = Ol.spans(this.decorations, e, t, {
				point: (e, t, a, o, s, c) => {
					if (a instanceof Lp) {
						if (this.disallowBlockEffectsFor[c]) {
							if (a.block) throw RangeError("Block decorations may not be specified via plugins");
							if (t > this.view.state.doc.lineAt(e).to) throw RangeError("Decorations that replace line breaks may not be specified via plugins");
						}
						if (i = o.length, s > o.length) r.continueWidget(t - e);
						else {
							let i = a.widget || (a.block ? Ym.block : Ym.inline), c = Ju(a), l = this.cache.findWidget(i, t - e, c) || zm.of(i, this.view, t - e, c);
							a.block ? (a.startSide > 0 && r.addLineStartIfNotCovered(n), r.addBlockWidget(l)) : (r.ensureLine(n), r.addInlineWidget(l, o, s));
						}
						n = null;
					} else n = Yu(n, a);
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
			this.openWidget = a > i, this.openWidget || r.addLineStartIfNotCovered(n), this.openMarks = a;
		}
		forward(e, t, n = 1) {
			t - e <= 10 ? this.old.advance(t - e, n, this.reuseWalker) : (this.old.advance(5, -1, this.reuseWalker), this.old.advance(t - e - 10, -1), this.old.advance(5, n, this.reuseWalker));
		}
		getCompositionContext(e) {
			let t = [], n = null;
			for (let r = e.parentNode;; r = r.parentNode) {
				let e = Mm.get(r);
				if (r == this.view.contentDOM) break;
				e instanceof Lm ? t.push(e) : e?.isLine() ? n = e : e instanceof Fm || (r.nodeName == "DIV" && !n && r != this.view.contentDOM ? n = new Im(r, Jm) : n || t.push(Lm.of(new Fp({
					tagName: r.nodeName.toLowerCase(),
					attributes: ru(r)
				}), r)));
			}
			return {
				line: n,
				marks: t
			};
		}
	}, Jm = { class: "cm-line" }, Ym = class extends Np {
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
	}, Ym.inline = /*@__PURE__*/ new Ym("span"), Ym.block = /*@__PURE__*/ new Ym("div"), Xm = /*@__PURE__*/ new class extends Np {
		toDOM() {
			return document.createElement("br");
		}
		get isHidden() {
			return !0;
		}
		get editable() {
			return !0;
		}
	}(), Zm = class {
		constructor(e) {
			this.view = e, this.decorations = [], this.blockWrappers = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.editContextFormatting = Y.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.updateDeco(), this.tile = new Pm(e, e.contentDOM), this.updateInner([new km(0, 0, 0, e.state.doc.length)], null);
		}
		update(e) {
			let t = e.changedRanges;
			this.minWidth > 0 && t.length && (t.every(({ fromA: e, toA: t }) => t < this.minWidthFrom || e > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(e);
			let n = -1;
			this.view.inputState.composing >= 0 && !this.view.observer.editContext && (this.domChanged?.newSel ? n = this.domChanged.newSel.head : !od(e.changes, this.hasComposition) && !e.selectionSet && (n = e.state.selection.main.head));
			let r = n > -1 ? td(this.view, e.changes, n) : null;
			if (this.domChanged = null, this.hasComposition) {
				let { from: n, to: r } = this.hasComposition;
				t = new km(n, r, e.changes.mapPos(n, -1), e.changes.mapPos(r, 1)).addToSet(t.slice());
			}
			this.hasComposition = r ? {
				from: r.range.fromB,
				to: r.range.toB
			} : null, (J.ie || J.chrome) && !r && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
			let i = this.decorations, a = this.blockWrappers;
			this.updateDeco();
			let o = rd(i, this.decorations, e.changes);
			o.length && (t = km.extendWithRanges(t, o));
			let s = id(a, this.blockWrappers, e.changes);
			return s.length && (t = km.extendWithRanges(t, s)), r && !t.some((e) => e.fromA <= r.range.fromA && e.toA >= r.range.toA) && (t = r.range.addToSet(t.slice())), this.tile.flags & 2 && t.length == 0 ? !1 : (this.updateInner(t, r), e.transactions.length && (this.lastUpdate = Date.now()), !0);
		}
		updateInner(e, t) {
			this.view.viewState.mustMeasureContent = !0;
			let { observer: n } = this.view;
			n.ignore(() => {
				if (t || e.length) {
					let n = this.tile, r = new qm(this.view, n, this.blockWrappers, this.decorations, this.dynamicDecorationMap);
					t && Mm.get(t.text) && r.cache.reused.set(Mm.get(t.text), 2), this.tile = r.run(e, t), Qu(n, r.cache.reused);
				}
				this.tile.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.tile.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
				let r = J.chrome || J.ios ? {
					node: n.selectionRange.focusNode,
					written: !1
				} : void 0;
				this.tile.sync(r), r && (r.written || n.selectionRange.focusNode != r.node || !this.tile.dom.contains(r.node)) && (this.forceSelection = !0), this.tile.dom.style.height = "";
			});
			let r = [];
			if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length) for (let e of this.tile.children) e.isWidget() && e.widget instanceof eh && r.push(e.dom);
			n.updateGaps(r);
		}
		updateEditContextFormatting(e) {
			this.editContextFormatting = this.editContextFormatting.map(e.changes);
			for (let t of e.transactions) for (let e of t.effects) e.is(mm) && (this.editContextFormatting = e.value);
		}
		updateSelection(e = !1, t = !1) {
			(e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
			let { dom: n } = this.tile, r = this.view.root.activeElement, i = r == n, a = !i && !(this.view.state.facet(hm) || n.tabIndex > -1) && lu(n, this.view.observer.selectionRange) && !(r && n.contains(r));
			if (!(i || t || a)) return;
			let o = this.forceSelection;
			this.forceSelection = !1;
			let s = this.view.state.selection.main, c, l;
			if (s.empty ? l = c = this.inlineDOMNearPos(s.anchor, s.assoc || 1) : (l = this.inlineDOMNearPos(s.head, s.head == s.from ? 1 : -1), c = this.inlineDOMNearPos(s.anchor, s.anchor == s.from ? 1 : -1)), J.gecko && s.empty && !this.hasComposition && $u(c)) {
				let e = document.createTextNode("");
				this.view.observer.ignore(() => c.node.insertBefore(e, c.node.childNodes[c.offset] || null)), c = l = new Hp(e, 0), o = !0;
			}
			let u = this.view.observer.selectionRange;
			(o || !u.focusNode || (!du(c.node, c.offset, u.anchorNode, u.anchorOffset) || !du(l.node, l.offset, u.focusNode, u.focusOffset)) && !this.suppressWidgetCursorChange(u, s)) && (this.view.observer.ignore(() => {
				J.android && J.chrome && n.contains(u.focusNode) && ad(u.focusNode, n) && (n.blur(), n.focus({ preventScroll: !0 }));
				let e = su(this.view.root);
				if (e) if (s.empty) {
					if (J.gecko) {
						let e = nd(c.node, c.offset);
						if (e && e != 3) {
							let t = (e == 1 ? Du : Ou)(c.node, c.offset);
							t && (c = new Hp(t.node, t.offset));
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
				a && this.view.root.activeElement == n && (n.blur(), r && r.focus());
			}), this.view.observer.setSelectionRange(c, l)), this.impreciseAnchor = c.precise ? null : new Hp(u.anchorNode, u.anchorOffset), this.impreciseHead = l.precise ? null : new Hp(u.focusNode, u.focusOffset);
		}
		suppressWidgetCursorChange(e, t) {
			return this.hasComposition && t.empty && du(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
		}
		enforceCursorAssoc() {
			if (this.hasComposition) return;
			let { view: e } = this, t = e.state.selection.main, n = su(e.root), { anchorNode: r, anchorOffset: i } = e.observer.selectionRange;
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
					let r = hu(e) == 0 ? 0 : t == 0 ? -1 : 1;
					for (;;) {
						let t = e.parentNode;
						if (t == n.dom) break;
						r == 0 && t.firstChild != t.lastChild && (r = e == t.firstChild ? -1 : 1), e = t;
					}
					i = r < 0 ? e : e.nextSibling;
				}
				if (i == n.dom.firstChild) return r;
				for (; i && !Mm.get(i);) i = i.nextSibling;
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
			return r.isWidget() ? r.widget instanceof eh ? null : r.coordsInWidget(i, t, !0) : r.coordsIn(i, t, n);
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
					let n = Qs(e.text, t);
					if (n == t) return null;
					let r = Su(e.dom, t, n).getClientRects();
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
			let t = [], { from: n, to: r } = e, i = this.view.contentDOM.clientWidth, a = i > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, o = -1, s = this.view.textDirection == Up.LTR, c = 0, l = (e, u, d) => {
				for (let f = 0; f < e.children.length && !(u > r); f++) {
					let r = e.children[f], p = u + r.length, m = r.dom.getBoundingClientRect(), { height: h } = m;
					if (d && !f && (c += m.top - d.top), r instanceof Fm) p > n && l(r, u, m);
					else if (u >= n && (c > 0 && t.push(-c), t.push(h + c), c = 0, a)) {
						let e = r.dom.lastChild, t = e ? uu(e) : [];
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
			return getComputedStyle(t.dom).direction == "rtl" ? Up.RTL : Up.LTR;
		}
		measureTextSize() {
			let e = this.tile.blockTiles((e) => {
				if (e.isLine() && e.children.length && e.length <= 20) {
					let t = 0, n;
					for (let r of e.children) {
						if (!r.isText() || /[^ -~]/.test(r.text)) return;
						let e = uu(r.dom);
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
				let e = uu(t.firstChild)[0];
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
						widget: new eh(r),
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
			let e = 1, t = this.view.state.facet(Sm).map((t) => (this.dynamicDecorationMap[e++] = typeof t == "function") ? t(this.view) : t), n = !1, r = this.view.state.facet(wm).map((e, t) => {
				let r = typeof e == "function";
				return r && (n = !0), r ? e(this.view) : e;
			});
			for (r.length && (this.dynamicDecorationMap[e++] = n, t.push(Ol.join(r))), this.decorations = [
				this.editContextFormatting,
				...t,
				this.computeBlockGapDeco(),
				this.view.viewState.lineGapDeco
			]; e < this.decorations.length;) this.dynamicDecorationMap[e++] = !1;
			this.blockWrappers = this.view.state.facet(Cm).map((e) => typeof e == "function" ? e(this.view) : e);
		}
		scrollIntoView(e) {
			if (e.isSnapshot) {
				let t = this.view.viewState.lineBlockAt(e.range.head);
				this.view.scrollDOM.scrollTop = t.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
				return;
			}
			for (let t of this.view.state.facet(dm)) try {
				if (t(this.view, e.range, e)) return !0;
			} catch (e) {
				Vu(this.view.state, e, "scroll handler");
			}
			let { range: t } = e, n = this.coordsAt(t.head, t.assoc || (t.head > t.anchor ? -1 : 1)), r;
			if (!n) return;
			!t.empty && (r = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (n = {
				left: Math.min(n.left, r.left),
				top: Math.min(n.top, r.top),
				right: Math.max(n.right, r.right),
				bottom: Math.max(n.bottom, r.bottom)
			});
			let i = Uu(this.view), a = {
				left: n.left - i.left,
				top: n.top - i.top,
				right: n.right + i.right,
				bottom: n.bottom + i.bottom
			}, { offsetWidth: o, offsetHeight: s } = this.view.scrollDOM;
			if (yu(this.view.scrollDOM, a, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, o), -o), Math.max(Math.min(e.yMargin, s), -s), this.view.textDirection == Up.LTR), window.visualViewport && window.innerHeight - window.visualViewport.height > 1 && (n.top > window.pageYOffset + window.visualViewport.offsetTop + window.visualViewport.height || n.bottom < window.pageYOffset + window.visualViewport.offsetTop)) {
				let e = this.view.docView.lineAt(t.head, 1);
				e && e.dom.scrollIntoView({ block: "nearest" });
			}
		}
		lineHasWidget(e) {
			let t = (e) => e.isWidget() || e.children.some(t);
			return t(this.tile.resolveBlock(e, 1).tile);
		}
		destroy() {
			Qu(this.tile);
		}
	}, Qm = class {
		constructor() {
			this.changes = [];
		}
		compareRange(e, t) {
			ou(e, t, this.changes);
		}
		comparePoint(e, t) {
			ou(e, t, this.changes);
		}
		boundChange(e) {
			ou(e, e, this.changes);
		}
	}, $m = class {
		constructor() {
			this.changes = [];
		}
		compareRange(e, t) {
			ou(e, t, this.changes);
		}
		comparePoint() {}
		boundChange(e) {
			ou(e, e, this.changes);
		}
	}, eh = class extends Np {
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
	}, th = class {
		constructor(e, t) {
			this.pos = e, this.assoc = t;
		}
	}, nh = class {
		constructor(e, t, n, r) {
			this.view = e, this.x = t, this.y = n, this.baseDir = r, this.line = null, this.spans = null;
		}
		bidiSpansAt(e) {
			return (!this.line || this.line.from > e || this.line.to < e) && (this.line = this.view.state.doc.lineAt(e), this.spans = this.view.bidiSpans(this.line)), this;
		}
		baseDirAt(e, t) {
			let { line: n, spans: r } = this.bidiSpansAt(e);
			return r[Zp.find(r, e - n.from, -1, t)].level == this.baseDir;
		}
		dirAt(e, t) {
			let { line: n, spans: r } = this.bidiSpansAt(e);
			return r[Zp.find(r, e - n.from, -1, t)].dir;
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
					let e = r + Math.floor(Math.random() * n);
					for (let t = 0; t < n; t++) {
						if (!a.has(e)) {
							f = e;
							break adjust;
						}
						e++, e == i && (e = r);
					}
					break search;
				}
				a.add(f);
				let p = t(f);
				if (p) for (let t = 0; t < p.length; t++) {
					let n = p[t], a = 0;
					if (!(n.width == 0 && p.length > 1)) {
						if (n.bottom < this.y) (!s || s.bottom < n.bottom) && (s = n), a = 1;
						else if (n.top > this.y) (!c || c.top > n.top) && (c = n), a = -1;
						else {
							let e = n.left > this.x ? this.x - n.left : n.right < this.x ? this.x - n.right : 0, t = Math.abs(e);
							t < u && (l = f, u = t, d = n), e && (a = e < 0 == (this.baseDir == Up.LTR) ? -1 : 1);
						}
						a == -1 && (!o || this.baseDirAt(e[f], 1)) ? i = f : a == 1 && (!o || this.baseDirAt(e[f + 1], -1)) && (r = f + 1);
					}
				}
			}
			if (!d) {
				if (!c && !s) return {
					i: e[0],
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
			let f = (o ? this.dirAt(e[l], 1) : this.baseDir) == Up.LTR;
			return {
				i: l,
				after: this.x > (d.left + d.right) / 2 == f
			};
		}
		scanText(e, t) {
			let n = [];
			for (let r = 0; r < e.length; r = Qs(e.text, r)) n.push(t + r);
			n.push(t + e.length);
			let r = this.scan(n, (r) => {
				let i = n[r] - t, a = n[r + 1] - t;
				return Su(e.dom, i, a).getClientRects();
			});
			return r.after ? new th(n[r.i + 1], -1) : new th(n[r.i], 1);
		}
		scanTile(e, t) {
			if (!e.length) return new th(t, 1);
			if (e.children.length == 1) {
				let n = e.children[0];
				if (n.isText()) return this.scanText(n, t);
				if (n.isComposite()) return this.scanTile(n, t);
			}
			let n = [t];
			for (let r = 0, i = t; r < e.children.length; r++) n.push(i += e.children[r].length);
			let r = this.scan(n, (t) => {
				let n = e.children[t];
				return n.flags & 48 ? null : (n.dom.nodeType == 1 ? n.dom : Su(n.dom, 0, n.length)).getClientRects();
			}), i = e.children[r.i], a = n[r.i];
			return i.isText() ? this.scanText(i, a) : i.isComposite() ? this.scanTile(i, a) : r.after ? new th(n[r.i + 1], -1) : new th(a, 1);
		}
	}, rh = "￿", ih = class {
		constructor(e, t) {
			this.points = e, this.view = t, this.text = "", this.lineSeparator = t.state.facet(wl.lineSeparator);
		}
		append(e) {
			this.text += e;
		}
		lineBreak() {
			this.text += rh;
		}
		readRange(e, t) {
			if (!e) return this;
			let n = e.parentNode;
			for (let r = e;;) {
				this.findPointBefore(n, r);
				let e = this.text.length;
				this.readNode(r);
				let i = Mm.get(r), a = r.nextSibling;
				if (a == t) {
					i?.breakAfter && !a && n != this.view.contentDOM && this.lineBreak();
					break;
				}
				let o = Mm.get(a);
				(i && o ? i.breakAfter : (i ? i.breakAfter : pu(r)) || pu(a) && (r.nodeName != "BR" || i?.isWidget()) && this.text.length > e) && !yd(a, t) && this.lineBreak(), r = a;
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
			let t = Mm.get(e), n = t && t.overrideDOMText;
			if (n != null) {
				this.findPointInside(e, n.length);
				for (let e = n.iter(); !e.next().done;) e.lineBreak ? this.lineBreak() : this.append(e.value);
			} else e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
		}
		findPointBefore(e, t) {
			for (let n of this.points) n.node == e && e.childNodes[n.offset] == t && (n.pos = this.text.length);
		}
		findPointInside(e, t) {
			for (let n of this.points) (e.nodeType == 3 ? n.node == e : e.contains(n.node)) && (n.pos = this.text.length + (vd(e, n.node, n.offset) ? t : 0));
		}
	}, ah = class {
		constructor(e, t) {
			this.node = e, this.offset = t, this.pos = -1;
		}
	}, oh = class {
		constructor(e, t, n, r) {
			this.typeOver = r, this.bounds = null, this.text = "", this.domChanged = t > -1;
			let { impreciseHead: i, impreciseAnchor: a } = e.docView, o = e.state.selection;
			if (e.state.readOnly && t > -1) this.newSel = null;
			else if (t > -1 && (this.bounds = bd(e.docView.tile, t, n, 0))) {
				let t = i || a ? [] : Td(e), n = new ih(t, e);
				n.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = n.text, this.newSel = Ed(t, this.bounds.from);
			} else {
				let t = e.observer.selectionRange, n = i && i.node == t.focusNode && i.offset == t.focusOffset || !cu(e.contentDOM, t.focusNode) ? o.main.head : e.docView.posFromDOM(t.focusNode, t.focusOffset), r = a && a.node == t.anchorNode && a.offset == t.anchorOffset || !cu(e.contentDOM, t.anchorNode) ? o.main.anchor : e.docView.posFromDOM(t.anchorNode, t.anchorOffset), s = e.viewport;
				if ((J.ios || J.chrome) && n != r && Math.min(n, r) <= o.main.from && Math.max(n, r) >= o.main.to && (s.from > 0 || s.to < e.state.doc.length)) {
					let t = Math.min(n, r), i = Math.max(n, r), a = s.from - t, o = s.to - i;
					(a == 0 || a == 1 || t == 0) && (o == 0 || o == -1 || i == e.state.doc.length) && (n = 0, r = e.state.doc.length);
				}
				if (e.inputState.composing > -1 && o.ranges.length > 1) this.newSel = o.replaceRange(K.range(r, n));
				else if (e.lineWrapping && r == n && !(o.main.empty && o.main.head == n) && e.inputState.lastTouchTime > Date.now() - 100) {
					let t = e.coordsAtPos(n, -1), r = 0;
					t && (r = e.inputState.lastTouchY <= t.bottom ? -1 : 1), this.newSel = K.create([K.cursor(n, r)]);
				} else this.newSel = K.single(r, n);
			}
		}
	}, sh = class {
		setSelectionOrigin(e) {
			this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
		}
		constructor(e) {
			this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.touchActive = !1, this.lastTouchTime = 0, this.lastTouchX = 0, this.lastTouchY = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.lastWheelEvent = 0, this.pendingIOSKey = void 0, this.lastIOSMomentumScroll = 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.insertingText = "", this.insertingTextAt = 0, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, J.safari && e.contentDOM.addEventListener("input", () => null), J.gecko && Yd(e.contentDOM.ownerDocument);
		}
		handleEvent(e) {
			!Id(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || (this.view.updateState == 0 ? this.runHandlers(e.type, e) : Promise.resolve().then(() => this.runHandlers(e.type, e)));
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
			let t = Ad(e), n = this.handlers, r = this.view.contentDOM;
			for (let e in t) if (e != "scroll") {
				let i = !t[e].handlers.length, a = n[e];
				a && i != !a.handlers.length && (r.removeEventListener(e, this.handleEvent), a = null), a || r.addEventListener(e, this.handleEvent, { passive: i });
			}
			for (let e in n) e != "scroll" && !t[e] && r.removeEventListener(e, this.handleEvent);
			this.handlers = t;
		}
		keydown(e) {
			if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode)) return !0;
			if (this.tabFocusMode > 0 && e.keyCode != 27 && uh.indexOf(e.keyCode) < 0 && (this.tabFocusMode = -1), J.android && J.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8)) return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
			if (J.ios && !e.synthetic && !e.altKey && !e.metaKey && (ch.some((t) => t.keyCode == e.keyCode) && !e.ctrlKey || lh.indexOf(e.key) > -1 && e.ctrlKey)) {
				let t = {
					ctrlKey: e.ctrlKey,
					altKey: e.altKey,
					metaKey: e.metaKey,
					shiftKey: e.shiftKey
				};
				return t.shiftKey && J.ios && !/^(off|none)$/.test(this.view.contentDOM.autocapitalize) && Od(this.view.win) && (t.shiftKey = !1), this.pendingIOSKey = {
					key: e.key,
					keyCode: e.keyCode,
					mods: t
				}, setTimeout(() => this.flushIOSKey(), 250), !0;
			}
			return e.keyCode != 229 && this.view.observer.forceFlush(), !1;
		}
		flushIOSKey(e) {
			let t = this.pendingIOSKey;
			return !t || t.key == "Enter" && e && e.from < e.to && /^\S+$/.test(e.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, Cu(this.view.contentDOM, t.key, t.keyCode, t.mods));
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
	}, ch = [
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
	], lh = "dthko", uh = [
		16,
		17,
		18,
		20,
		91,
		92,
		224,
		225
	], dh = 6, fh = class {
		constructor(e, t, n, r) {
			this.view = e, this.startEvent = t, this.style = n, this.mustSelect = r, this.scrollSpeed = {
				x: 0,
				y: 0
			}, this.scrolling = -1, this.lastEvent = t, this.scrollParents = bu(e.contentDOM), this.atoms = e.state.facet(Tm).map((t) => t(e));
			let i = e.contentDOM.ownerDocument;
			i.addEventListener("mousemove", this.move = this.move.bind(this)), i.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(wl.allowMultipleSelections) && Nd(e, t), this.dragging = Fd(e, t) && Vd(t) == 1 ? null : !1;
		}
		start(e) {
			this.dragging === !1 && this.select(e);
		}
		move(e) {
			if (e.buttons == 0) return this.destroy();
			if (this.dragging || this.dragging == null && Md(this.startEvent, e) < 10) return;
			this.select(this.lastEvent = e);
			let t = 0, n = 0, r = 0, i = 0, a = this.view.win.innerWidth, o = this.view.win.innerHeight;
			this.scrollParents.x && ({left: r, right: a} = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({top: i, bottom: o} = this.scrollParents.y.getBoundingClientRect());
			let s = Uu(this.view);
			e.clientX - s.left <= r + dh ? t = -jd(r - e.clientX) : e.clientX + s.right >= a - dh && (t = jd(e.clientX - a)), e.clientY - s.top <= i + dh ? n = -jd(i - e.clientY) : e.clientY + s.bottom >= o - dh && (n = jd(e.clientY - o)), this.setScrollSpeed(t, n);
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
			let { view: t } = this, n = hd(this.atoms, this.style.get(e, this.extend, this.multiple));
			(this.mustSelect || !n.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
				selection: n,
				userEvent: "select.pointer"
			}), this.mustSelect = !1;
		}
		update(e) {
			e.transactions.some((e) => e.isUserEvent("input.type")) ? this.destroy() : this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
		}
	}, ph = /*@__PURE__*/ Object.create(null), mh = /*@__PURE__*/ Object.create(null), hh = J.ie && J.ie_version < 15 || J.ios && J.webkit_version < 604, mh.scroll = (e) => {
		let t = e.inputState;
		t.lastScrollTop = e.scrollDOM.scrollTop, t.lastScrollLeft = e.scrollDOM.scrollLeft, J.ios && !t.touchActive && (t.lastIOSMomentumScroll = Date.now());
	}, mh.wheel = mh.mousewheel = (e) => {
		e.inputState.lastWheelEvent = Date.now();
	}, ph.keydown = (e, t) => (e.inputState.setSelectionOrigin("select"), t.keyCode == 27 && e.inputState.tabFocusMode != 0 && (e.inputState.tabFocusMode = Date.now() + 2e3), !1), mh.touchstart = (e, t) => {
		let n = e.inputState, r = t.targetTouches[0];
		n.touchActive = !0, n.lastTouchTime = Date.now(), r && (n.lastTouchX = r.clientX, n.lastTouchY = r.clientY), n.setSelectionOrigin("select.pointer");
	}, mh.touchmove = (e) => {
		e.inputState.setSelectionOrigin("select.pointer");
	}, mh.touchend = (e, t) => {
		e.inputState.touchActive = !1;
	}, ph.mousedown = (e, t) => {
		if (e.observer.flush(), e.inputState.lastTouchTime > Date.now() - 2e3) return !1;
		let n = null;
		for (let r of e.state.facet(nm)) if (n = r(e, t), n) break;
		if (!n && t.button == 0 && (n = Hd(e, t)), n) {
			let r = !e.hasFocus;
			e.inputState.startMouseSelection(new fh(e, t, n, r)), r && e.observer.ignore(() => {
				xu(e.contentDOM);
				let t = e.root.activeElement;
				t && !t.contains(e.contentDOM) && t.blur();
			});
			let i = e.inputState.mouseSelection;
			if (i) return i.start(t), i.dragging === !1;
		} else e.inputState.setSelectionOrigin("select.pointer");
		return !1;
	}, gh = J.ie && J.ie_version <= 11, _h = null, vh = 0, yh = 0, ph.dragstart = (e, t) => {
		let { selection: { main: n } } = e.state;
		if (t.target.draggable) {
			let r = e.docView.tile.nearest(t.target);
			if (r && r.isWidget()) {
				let e = r.posAtStart, t = e + r.length;
				(e >= n.to || t <= n.from) && (n = K.undirectionalRange(e, t));
			}
		}
		let { inputState: r } = e;
		return r.mouseSelection && (r.mouseSelection.dragging = !0), r.draggedContent = n, t.dataTransfer && (t.dataTransfer.setData("Text", Rd(e.state, cm, e.state.sliceDoc(n.from, n.to))), t.dataTransfer.effectAllowed = "copyMove"), !1;
	}, ph.dragend = (e) => (e.inputState.draggedContent = null, !1), ph.drop = (e, t) => {
		if (!t.dataTransfer) return !1;
		if (e.state.readOnly) return !0;
		let n = t.dataTransfer.files;
		if (n && n.length) {
			let r = Array(n.length), i = 0, a = () => {
				++i == n.length && Wd(e, t, r.filter((e) => e != null).join(e.state.lineBreak), !1);
			};
			for (let e = 0; e < n.length; e++) {
				let t = new FileReader();
				t.onerror = a, t.onload = () => {
					/[\x00-\x08\x0e-\x1f]{2}/.test(t.result) || (r[e] = t.result), a();
				}, t.readAsText(n[e]);
			}
			return !0;
		} else {
			let n = t.dataTransfer.getData("Text");
			if (n) return Wd(e, t, n, !0), !0;
		}
		return !1;
	}, ph.paste = (e, t) => {
		if (e.state.readOnly) return !0;
		e.observer.flush();
		let n = hh ? null : t.clipboardData;
		return n ? (zd(e, n.getData("text/plain") || n.getData("text/uri-list")), !0) : (Ld(e), !1);
	}, bh = null, ph.copy = ph.cut = (e, t) => {
		if (!lu(e.contentDOM, e.observer.selectionRange)) return !1;
		let { text: n, ranges: r, linewise: i } = Kd(e.state);
		if (!n && !i) return !1;
		bh = i ? n : null, t.type == "cut" && !e.state.readOnly && e.dispatch({
			changes: r,
			scrollIntoView: !0,
			userEvent: "delete.cut"
		});
		let a = hh ? null : t.clipboardData;
		return a ? (a.clearData(), a.setData("text/plain", n), !0) : (Gd(e, n), !1);
	}, xh = /*@__PURE__*/ hl.define(), mh.focus = (e) => {
		e.inputState.lastFocusTime = Date.now(), !e.scrollDOM.scrollTop && (e.inputState.lastScrollTop || e.inputState.lastScrollLeft) && (e.scrollDOM.scrollTop = e.inputState.lastScrollTop, e.scrollDOM.scrollLeft = e.inputState.lastScrollLeft), Jd(e);
	}, mh.blur = (e) => {
		e.observer.clearSelectionRange(), Jd(e);
	}, mh.compositionstart = mh.compositionupdate = (e) => {
		e.observer.editContext || (e.inputState.compositionFirstChange ?? (e.inputState.compositionFirstChange = !0), e.inputState.composing < 0 && (e.inputState.composing = 0));
	}, mh.compositionend = (e) => {
		e.observer.editContext || (e.inputState.composing = -1, e.inputState.compositionEndedAt = Date.now(), e.inputState.compositionPendingKey = !0, e.inputState.compositionPendingChange = e.observer.pendingRecords().length > 0, e.inputState.compositionFirstChange = null, J.chrome && J.android ? e.observer.flushSoon() : e.inputState.compositionPendingChange ? Promise.resolve().then(() => e.observer.flush()) : setTimeout(() => {
			e.inputState.composing < 0 && e.docView.hasComposition && e.update([]);
		}, 50));
	}, mh.contextmenu = (e) => {
		e.inputState.lastContextMenu = Date.now();
	}, ph.beforeinput = (e, t) => {
		if ((t.inputType == "insertText" || t.inputType == "insertCompositionText") && (e.inputState.insertingText = t.data, e.inputState.insertingTextAt = Date.now()), t.inputType == "insertReplacementText" && e.observer.editContext) {
			let n = t.dataTransfer?.getData("text/plain"), r = t.getTargetRanges();
			if (n && r.length) {
				let t = r[0];
				return Sd(e, {
					from: e.posAtDOM(t.startContainer, t.startOffset),
					to: e.posAtDOM(t.endContainer, t.endOffset),
					insert: e.state.toText(n)
				}, null), !0;
			}
		}
		let n;
		if (J.chrome && J.android && (n = ch.find((e) => e.inputType == t.inputType)) && (e.observer.delayAndroidKey(n.key, n.keyCode), n.key == "Backspace" || n.key == "Delete")) {
			let t = window.visualViewport?.height || 0;
			setTimeout(() => {
				(window.visualViewport?.height || 0) > t + 10 && e.hasFocus && (e.contentDOM.blur(), e.focus());
			}, 100);
		}
		return J.ios && t.inputType == "deleteContentForward" && e.observer.flushSoon(), J.safari && t.inputType == "insertText" && e.inputState.composing >= 0 && setTimeout(() => mh.compositionend(e, t), 20), !1;
	}, Sh = /*@__PURE__*/ new Set(), Ch = [
		"pre-wrap",
		"normal",
		"pre-line",
		"break-spaces"
	], wh = !1, Th = class {
		constructor(e) {
			this.lineWrapping = e, this.doc = G.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30;
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
			return Ch.indexOf(e) > -1 != this.lineWrapping;
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
			let o = Ch.indexOf(e) > -1, s = Math.abs(t - this.lineHeight) > .3 || this.lineWrapping != o;
			if (this.lineWrapping = o, this.lineHeight = t, this.charWidth = n, this.textHeight = r, this.lineLength = i, s) {
				this.heightSamples = {};
				for (let e = 0; e < a.length; e++) {
					let t = a[e];
					t < 0 ? e++ : this.heightSamples[Math.floor(t * 10)] = !0;
				}
			}
			return s;
		}
	}, Eh = class {
		constructor(e, t) {
			this.from = e, this.heights = t, this.index = 0;
		}
		get more() {
			return this.index < this.heights.length;
		}
	}, Dh = class e {
		constructor(e, t, n, r, i) {
			this.from = e, this.length = t, this.top = n, this.height = r, this._content = i;
		}
		get type() {
			return typeof this._content == "number" ? Pp.Text : Array.isArray(this._content) ? this._content : this._content.type;
		}
		get to() {
			return this.from + this.length;
		}
		get bottom() {
			return this.top + this.height;
		}
		get widget() {
			return this._content instanceof Lp ? this._content.widget : null;
		}
		get widgetLineBreaks() {
			return typeof this._content == "number" ? this._content : 0;
		}
		join(t) {
			let n = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(t._content) ? t._content : [t]);
			return new e(this.from, this.length + t.length, this.top, this.height + t.height, n);
		}
	}, Oh = /*@__PURE__*/ (function(e) {
		return e[e.ByPos = 0] = "ByPos", e[e.ByHeight = 1] = "ByHeight", e[e.ByPosNoHeight = 2] = "ByPosNoHeight", e;
	})(Oh ||= {}), kh = .001, Ah = class e {
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
			this.height != e && (Math.abs(this.height - e) > kh && (wh = !0), this.height = e);
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
				let { fromA: s, toA: c, fromB: l, toB: u } = r[o], d = i.lineAt(s, Oh.ByPosNoHeight, n.setDoc(t), 0, 0), f = d.to >= c ? d : i.lineAt(c, Oh.ByPosNoHeight, n, 0, 0);
				for (u += f.to - c, c = f.to; o > 0 && d.from <= r[o - 1].toA;) s = r[o - 1].fromA, l = r[o - 1].fromB, o--, s < d.from && (d = i.lineAt(s, Oh.ByPosNoHeight, n, 0, 0));
				l += d.from - s, s = d.from;
				let p = Lh.build(n.setDoc(a), e, l, u);
				i = Zd(i, i.replace(s, c, p));
			}
			return i.updateHeight(n, 0);
		}
		static empty() {
			return new Nh(0, 0, 0);
		}
		static of(t) {
			if (t.length == 1) return t[0];
			let n = 0, r = t.length, i = 0, a = 0;
			for (;;) if (n == r) if (i > a * 2) {
				let e = t[n - 1];
				e.break ? t.splice(--n, 1, e.left, null, e.right) : t.splice(--n, 1, e.left, e.right), r += 1 + e.break, i -= e.size;
			} else if (a > i * 2) {
				let e = t[r];
				e.break ? t.splice(r, 1, e.left, null, e.right) : t.splice(r, 1, e.left, e.right), r += 2 + e.break, a -= e.size;
			} else break;
			else if (i < a) {
				let e = t[n++];
				e && (i += e.size);
			} else {
				let e = t[--r];
				e && (a += e.size);
			}
			let o = 0;
			return t[n - 1] == null ? (o = 1, n--) : t[n] ?? (o = 1, r++), new Fh(e.of(t.slice(0, n)), o, e.of(t.slice(r)));
		}
	}, Ah.prototype.size = 1, jh = /*@__PURE__*/ Y.replace({}), Mh = class extends Ah {
		constructor(e, t, n) {
			super(e, t), this.deco = n, this.spaceAbove = 0;
		}
		mainBlock(e, t) {
			return new Dh(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.deco || 0);
		}
		blockAt(e, t, n, r) {
			return this.spaceAbove && e < n + this.spaceAbove ? new Dh(r, 0, n, this.spaceAbove, jh) : this.mainBlock(n, r);
		}
		lineAt(e, t, n, r, i) {
			let a = this.mainBlock(r, i);
			return this.spaceAbove ? this.blockAt(0, n, r, i).join(a) : a;
		}
		forEachLine(e, t, n, r, i, a) {
			e <= i + this.length && t >= i && a(this.lineAt(0, Oh.ByPos, n, r, i));
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
	}, Nh = class e extends Mh {
		constructor(e, t, n) {
			super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0, this.spaceAbove = n;
		}
		mainBlock(e, t) {
			return new Dh(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.breaks);
		}
		replace(t, n, r) {
			let i = r[0];
			return r.length == 1 && (i instanceof e || i instanceof Ph && i.flags & 4) && Math.abs(this.length - i.length) < 10 ? (i instanceof Ph ? i = new e(i.length, this.height, this.spaceAbove) : i.height = this.height, this.outdated || (i.outdated = !1), i) : Ah.of(r);
		}
		updateHeight(e, t = 0, n = !1, r) {
			return r && r.from <= t && r.more ? this.setMeasuredHeight(r) : (n || this.outdated) && (this.spaceAbove = 0, this.setHeight(Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight)), this.outdated = !1, this;
		}
		toString() {
			return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
		}
	}, Ph = class e extends Ah {
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
				return new Dh(a.from, a.length, l, c, 0);
			} else {
				let r = Math.max(0, Math.min(a - i, Math.floor((e - n) / o))), { from: s, length: c } = t.doc.line(i + r);
				return new Dh(s, c, n + o * r, o, 0);
			}
		}
		lineAt(e, t, n, r, i) {
			if (t == Oh.ByHeight) return this.blockAt(e, n, r, i);
			if (t == Oh.ByPosNoHeight) {
				let { from: t, to: r } = n.doc.lineAt(e);
				return new Dh(t, r - t, 0, 0, 0);
			}
			let { firstLine: a, perLine: o, perChar: s } = this.heightMetrics(n, i), c = n.doc.lineAt(e), l = o + c.length * s, u = c.number - a, d = r + o * u + s * (c.from - i - u);
			return new Dh(c.from, c.length, Math.max(r, Math.min(d, r + this.height - l)), l, 0);
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
				a(new Dh(t.from, t.length, u, r, 0)), u += r, l = t.to + 1;
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
			return Ah.of(r);
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
					n < 0 && (a = -n, n = i.heights[i.index++]), s == -1 ? s = n : Math.abs(n - s) >= kh && (s = -2);
					let c = new Nh(e, n, a);
					c.outdated = !1, r.push(c), o += e + 1;
				}
				o <= a && r.push(null, new e(a - o).updateHeight(t, o));
				let c = Ah.of(r);
				return (s < 0 || Math.abs(c.height - this.height) >= kh || Math.abs(s - this.heightMetrics(t, n).perLine) >= kh) && (wh = !0), Zd(this, c);
			} else (r || this.outdated) && (this.setHeight(t.heightForGap(n, n + this.length)), this.outdated = !1);
			return this;
		}
		toString() {
			return `gap(${this.length})`;
		}
	}, Fh = class extends Ah {
		constructor(e, t, n) {
			super(e.length + t + n.length, e.height + n.height, t | (e.outdated || n.outdated ? 2 : 0)), this.left = e, this.right = n, this.size = e.size + n.size;
		}
		get break() {
			return this.flags & 1;
		}
		blockAt(e, t, n, r) {
			let i = n + this.left.height;
			return e < i ? this.left.blockAt(e, t, n, r) : this.right.blockAt(e, t, i, r + this.left.length + this.break);
		}
		lineAt(e, t, n, r, i) {
			let a = r + this.left.height, o = i + this.left.length + this.break, s = t == Oh.ByHeight ? e < a : e < o, c = s ? this.left.lineAt(e, t, n, r, i) : this.right.lineAt(e, t, n, a, o);
			if (this.break || (s ? c.to < o : c.from > o)) return c;
			let l = t == Oh.ByPosNoHeight ? Oh.ByPosNoHeight : Oh.ByPos;
			return s ? c.join(this.right.lineAt(o, l, n, a, o)) : this.left.lineAt(o, l, n, r, i).join(c);
		}
		forEachLine(e, t, n, r, i, a) {
			let o = r + this.left.height, s = i + this.left.length + this.break;
			if (this.break) e < s && this.left.forEachLine(e, t, n, r, i, a), t >= s && this.right.forEachLine(e, t, n, o, s, a);
			else {
				let c = this.lineAt(s, Oh.ByPos, n, r, i);
				e < c.from && this.left.forEachLine(e, c.from - 1, n, r, i, a), c.to >= e && c.from <= t && a(c), t > c.to && this.right.forEachLine(c.to + 1, t, n, o, s, a);
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
			if (e > 0 && Qd(i, a - 1), t < this.length) {
				let e = i.length;
				this.decomposeRight(t, i), Qd(i, e);
			}
			return Ah.of(i);
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
			return e.size > 2 * t.size || t.size > 2 * e.size ? Ah.of(this.break ? [
				e,
				null,
				t
			] : [e, t]) : (this.left = Zd(this.left, e), this.right = Zd(this.right, t), this.setHeight(e.height + t.height), this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
		}
		updateHeight(e, t = 0, n = !1, r) {
			let { left: i, right: a } = this, o = t + i.length + this.break, s = null;
			return r && r.from <= t + i.length && r.more ? s = i = i.updateHeight(e, t, n, r) : i.updateHeight(e, t, n), r && r.from <= o + a.length && r.more ? s = a = a.updateHeight(e, o, n, r) : a.updateHeight(e, o, n), s ? this.balanced(i, a) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
		}
		toString() {
			return this.left + (this.break ? " " : "-") + this.right;
		}
	}, Ih = 5, Lh = class e {
		constructor(e, t) {
			this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
		}
		get isCovered() {
			return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
		}
		span(e, t) {
			if (this.lineStart > -1) {
				let e = Math.min(t, this.lineEnd), n = this.nodes[this.nodes.length - 1];
				n instanceof Nh ? n.length += e - this.pos : (e > this.pos || !this.isCovered) && this.nodes.push(new Nh(e - this.pos, -1, 0)), this.writtenTo = e, t > e && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
			}
			this.pos = t;
		}
		point(e, t, n) {
			if (e < t || n.heightRelevant) {
				let r = n.widget ? n.widget.estimatedHeight : 0, i = n.widget ? n.widget.lineBreaks : 0;
				r < 0 && (r = this.oracle.lineHeight);
				let a = t - e;
				n.block ? this.addBlock(new Mh(a, r, n)) : (a || i || r >= Ih) && this.addLineDeco(r, i, a);
			} else t > e && this.span(e, t);
			this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
		}
		enterLine() {
			if (this.lineStart > -1) return;
			let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
			this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new Nh(this.pos - e, -1, 0)), this.writtenTo = this.pos;
		}
		blankContent(e, t) {
			let n = new Ph(t - e);
			return this.oracle.doc.lineAt(e).to == t && (n.flags |= 4), n;
		}
		ensureLine() {
			this.enterLine();
			let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
			if (e instanceof Nh) return e;
			let t = new Nh(0, -1, 0);
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
			this.lineStart > -1 && !(t instanceof Nh) && !this.isCovered ? this.nodes.push(new Nh(0, -1, 0)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
			let n = e;
			for (let e of this.nodes) e instanceof Nh && e.updateHeight(this.oracle, n), n += e ? e.length : 1;
			return this.nodes;
		}
		static build(t, n, r, i) {
			let a = new e(r, t);
			return Ol.spans(n, r, i, a, 0), a.finish(r);
		}
	}, Rh = class {
		constructor() {
			this.changes = [];
		}
		compareRange() {}
		comparePoint(e, t, n, r) {
			(e < t || n && n.heightRelevant || r && r.heightRelevant) && ou(e, t, this.changes, 5);
		}
	}, zh = class {
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
			return Y.replace({ widget: new Bh(this.displaySize * (t ? e.scaleY : e.scaleX), t) }).range(this.from, this.to);
		}
	}, Bh = class extends Np {
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
	}, Vh = class {
		constructor(e, t) {
			this.view = e, this.state = t, this.pixelViewport = {
				left: 0,
				right: window.innerWidth,
				top: 0,
				bottom: 0
			}, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scaleX = 1, this.scaleY = 1, this.scrollOffset = 0, this.scrolledToBottom = !1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = Uh, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = Up.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
			let n = t.facet(xm).some((e) => typeof e != "function" && e.class == "cm-lineWrapping");
			this.heightOracle = new Th(n), this.stateDeco = cf(t), this.heightMap = Ah.empty().applyChanges(this.stateDeco, G.empty, this.heightOracle.setDoc(t.doc), [new km(0, 0, 0, t.doc.length)]);
			for (let e = 0; e < 2 && (this.viewport = this.getViewport(0, null), this.updateForViewport()); e++);
			this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = Y.set(this.lineGaps.map((e) => e.draw(this, !1))), this.scrollParent = e.scrollDOM, this.computeVisibleRanges();
		}
		updateForViewport() {
			let e = [this.viewport], { main: t } = this.state.selection;
			for (let n = 0; n <= 1; n++) {
				let r = n ? t.head : t.anchor;
				if (!e.some(({ from: e, to: t }) => r >= e && r <= t)) {
					let { from: t, to: n } = this.lineBlockAt(r);
					e.push(new Hh(t, n));
				}
			}
			return this.viewports = e.sort((e, t) => e.from - t.from), this.updateScaler();
		}
		updateScaler() {
			let e = this.scaler;
			return this.scaler = this.heightMap.height <= 7e6 ? Uh : new Wh(this.heightOracle, this.heightMap, this.viewports), e.eq(this.scaler) ? 0 : 2;
		}
		updateViewportLines() {
			this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
				this.viewportLines.push(lf(e, this.scaler));
			});
		}
		update(e, t = null) {
			this.state = e.state;
			let n = this.stateDeco;
			this.stateDeco = cf(this.state);
			let r = e.changedRanges, i = km.extendWithRanges(r, $d(n, this.stateDeco, e ? e.changes : Yc.empty(this.state.doc.length))), a = this.heightMap.height, o = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollOffset);
			Xd(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), i), (this.heightMap.height != a || wh) && (e.flags |= 2), o ? (this.scrollAnchorPos = e.changes.mapPos(o.from, -1), this.scrollAnchorHeight = o.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = a);
			let s = i.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
			(t && (t.range.head < s.from || t.range.head > s.to) || !this.viewportIsAppropriate(s)) && (s = this.getViewport(0, t));
			let c = s.from != this.viewport.from || s.to != this.viewport.to;
			this.viewport = s, e.flags |= this.updateForViewport(), (c || !e.changes.empty || e.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(e.changes), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && (e.selectionSet || e.focusChanged) && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(um) && (this.mustEnforceCursorAssoc = !0);
		}
		measure() {
			let { view: e } = this, t = e.contentDOM, n = window.getComputedStyle(t), r = this.heightOracle, i = n.whiteSpace;
			this.defaultTextDirection = n.direction == "rtl" ? Up.RTL : Up.LTR;
			let a = this.heightOracle.mustRefreshForWrapping(i) || this.mustMeasureContent === "refresh", o = t.getBoundingClientRect(), s = a || this.mustMeasureContent || this.contentDOMHeight != o.height;
			this.contentDOMHeight = o.height, this.mustMeasureContent = !1;
			let c = 0, l = 0;
			if (o.width && o.height) {
				let { scaleX: e, scaleY: n } = vu(t, o);
				(e > .005 && Math.abs(this.scaleX - e) > .005 || n > .005 && Math.abs(this.scaleY - n) > .005) && (this.scaleX = e, this.scaleY = n, c |= 16, a = s = !0);
			}
			let u = (parseInt(n.paddingTop) || 0) * this.scaleY, d = (parseInt(n.paddingBottom) || 0) * this.scaleY;
			(this.paddingTop != u || this.paddingBottom != d) && (this.paddingTop = u, this.paddingBottom = d, c |= 18), this.editorWidth != e.scrollDOM.clientWidth && (r.lineWrapping && (s = !0), this.editorWidth = e.scrollDOM.clientWidth, c |= 16);
			let f = bu(this.view.contentDOM, !1).y;
			f != this.scrollParent && (this.scrollParent = f, this.scrollAnchorHeight = -1, this.scrollOffset = 0);
			let p = this.getScrollOffset();
			this.scrollOffset != p && (this.scrollAnchorHeight = -1, this.scrollOffset = p), this.scrolledToBottom = Eu(this.scrollParent || e.win);
			let m = (this.printing ? nf : ef)(t, this.paddingTop), h = m.top - this.pixelViewport.top, g = m.bottom - this.pixelViewport.bottom;
			this.pixelViewport = m;
			let _ = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
			if (_ != this.inView && (this.inView = _, _ && (s = !0)), !this.inView && !this.scrollTarget && !tf(e.dom)) return 0;
			let v = o.width;
			if ((this.contentDOMWidth != v || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = o.width, this.editorHeight = e.scrollDOM.clientHeight, c |= 16), s) {
				let t = e.docView.measureVisibleLineHeights(this.viewport);
				if (r.mustRefreshForHeights(t) && (a = !0), a || r.lineWrapping && Math.abs(v - this.contentDOMWidth) > r.charWidth) {
					let { lineHeight: n, charWidth: o, textHeight: s } = e.docView.measureTextSize();
					a = n > 0 && r.refresh(i, n, o, s, Math.max(5, v / o), t), a && (e.docView.minWidth = 0, c |= 16);
				}
				h > 0 && g > 0 ? l = Math.max(h, g) : h < 0 && g < 0 && (l = Math.min(h, g)), Xd();
				for (let n of this.viewports) {
					let i = n.from == this.viewport.from ? t : e.docView.measureVisibleLineHeights(n);
					this.heightMap = (a ? Ah.empty().applyChanges(this.stateDeco, G.empty, this.heightOracle, [new km(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(r, 0, a, new Eh(n.from, i));
				}
				wh && (c |= 2);
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
			let n = .5 - Math.max(-.5, Math.min(.5, e / 1e3 / 2)), r = this.heightMap, i = this.heightOracle, { visibleTop: a, visibleBottom: o } = this, s = new Hh(r.lineAt(a - n * 1e3, Oh.ByHeight, i, 0, 0).from, r.lineAt(o + (1 - n) * 1e3, Oh.ByHeight, i, 0, 0).to);
			if (t) {
				let { head: e } = t.range;
				if (e < s.from || e > s.to) {
					let n = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), a = r.lineAt(e, Oh.ByPos, i, 0, 0), o;
					o = t.y == "center" ? (a.top + a.bottom) / 2 - n / 2 : t.y == "start" || t.y == "nearest" && e < s.from ? a.top : a.bottom - n, s = new Hh(r.lineAt(o - 1e3 / 2, Oh.ByHeight, i, 0, 0).from, r.lineAt(o + n + 1e3 / 2, Oh.ByHeight, i, 0, 0).to);
				}
			}
			return s;
		}
		mapViewport(e, t) {
			let n = t.mapPos(e.from, -1), r = t.mapPos(e.to, 1);
			return new Hh(this.heightMap.lineAt(n, Oh.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(r, Oh.ByPos, this.heightOracle, 0, 0).to);
		}
		viewportIsAppropriate({ from: e, to: t }, n = 0) {
			if (!this.inView) return !0;
			let { top: r } = this.heightMap.lineAt(e, Oh.ByPos, this.heightOracle, 0, 0), { bottom: i } = this.heightMap.lineAt(t, Oh.ByPos, this.heightOracle, 0, 0), { visibleTop: a, visibleBottom: o } = this;
			return (e == 0 || r <= a - Math.max(10, Math.min(-n, 250))) && (t == this.state.doc.length || i >= o + Math.max(10, Math.min(n, 250))) && r > a - 2 * 1e3 && i < o + 2 * 1e3;
		}
		mapLineGaps(e, t) {
			if (!e.length || t.empty) return e;
			let n = [];
			for (let r of e) t.touchesRange(r.from, r.to) || n.push(new zh(t.mapPos(r.from), t.mapPos(r.to), r.size, r.displaySize));
			return n;
		}
		ensureLineGaps(e, t) {
			let n = this.heightOracle.lineWrapping, r = n ? 1e4 : 2e3, i = r >> 1, a = r << 1;
			if (this.defaultTextDirection != Up.LTR && !n) return [];
			let o = [], s = (r, a, c, l) => {
				if (a - r < i) return;
				let u = this.state.selection.main, d = [u.from];
				u.empty || d.push(u.to);
				for (let e of d) if (e > r && e < a) {
					s(r, e - 10, c, l), s(e + 10, a, c, l);
					return;
				}
				let f = sf(e, (e) => e.from >= c.from && e.to <= c.to && Math.abs(e.from - r) < i && Math.abs(e.to - a) < i && !d.some((t) => e.from < t && e.to > t));
				if (!f) {
					if (a < c.to && t && n && t.visibleRanges.some((e) => e.from <= a && e.to >= a)) {
						let e = t.moveToLineBoundary(K.cursor(a), !1, !0).head;
						e > r && (a = e);
					}
					let e = this.gapSize(c, r, a, l);
					f = new zh(r, a, e, n || e < 2e6 ? e : 2e6);
				}
				o.push(f);
			}, c = (t) => {
				if (t.length < a || t.type != Pp.Text) return;
				let i = rf(t.from, t.to, this.stateDeco);
				if (i.total < a) return;
				let o = this.scrollTarget ? this.scrollTarget.range.head : null, c, l;
				if (n) {
					let e = r / this.heightOracle.lineLength * this.heightOracle.lineHeight, n, a;
					if (o != null) {
						let r = of(i, o), s = ((this.visibleBottom - this.visibleTop) / 2 + e) / t.height;
						n = r - s, a = r + s;
					} else n = (this.visibleTop - t.top - e) / t.height, a = (this.visibleBottom - t.top + e) / t.height;
					c = af(i, n), l = af(i, a);
				} else {
					let n = i.total * this.heightOracle.charWidth, a = r * this.heightOracle.charWidth, s = 0;
					if (n > 2e6) for (let n of e) n.from >= t.from && n.from < t.to && n.size != n.displaySize && n.from * this.heightOracle.charWidth + s < this.pixelViewport.left && (s = n.size - n.displaySize);
					let u = this.pixelViewport.left + s, d = this.pixelViewport.right + s, f, p;
					if (o != null) {
						let e = of(i, o), t = ((d - u) / 2 + a) / n;
						f = e - t, p = e + t;
					} else f = (u - a) / n, p = (d + a) / n;
					c = af(i, f), l = af(i, p);
				}
				c > t.from && s(t.from, c, t, i), l < t.to && s(l, t.to, t, i);
			};
			for (let e of this.viewportLines) Array.isArray(e.type) ? e.type.forEach(c) : c(e);
			return o;
		}
		gapSize(e, t, n, r) {
			let i = of(r, n) - of(r, t);
			return this.heightOracle.lineWrapping ? e.height * i : r.total * this.heightOracle.charWidth * i;
		}
		updateLineGaps(e) {
			zh.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = Y.set(e.map((e) => e.draw(this, this.heightOracle.lineWrapping))));
		}
		computeVisibleRanges(e) {
			let t = this.stateDeco;
			this.lineGaps.length && (t = t.concat(this.lineGapDeco));
			let n = [];
			Ol.spans(t, this.viewport.from, this.viewport.to, {
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
			return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || lf(this.heightMap.lineAt(e, Oh.ByPos, this.heightOracle, 0, 0), this.scaler);
		}
		lineBlockAtHeight(e) {
			return e >= this.viewportLines[0].top && e <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((t) => t.top <= e && t.bottom >= e) || lf(this.heightMap.lineAt(this.scaler.fromDOM(e), Oh.ByHeight, this.heightOracle, 0, 0), this.scaler);
		}
		getScrollOffset() {
			return (this.scrollParent == this.view.scrollDOM ? this.scrollParent.scrollTop : (this.scrollParent ? this.scrollParent.getBoundingClientRect().top : 0) - this.view.contentDOM.getBoundingClientRect().top) * this.scaleY;
		}
		scrollAnchorAt(e) {
			let t = this.lineBlockAtHeight(e + 8);
			return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
		}
		elementAtHeight(e) {
			return lf(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
		}
		get docHeight() {
			return this.scaler.toDOM(this.heightMap.height);
		}
		get contentHeight() {
			return this.docHeight + this.paddingTop + this.paddingBottom;
		}
	}, Hh = class {
		constructor(e, t) {
			this.from = e, this.to = t;
		}
	}, Uh = {
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
	}, Wh = class e {
		constructor(e, t, n) {
			let r = 0, i = 0, a = 0;
			this.viewports = n.map(({ from: n, to: i }) => {
				let a = t.lineAt(n, Oh.ByPos, e, 0, 0).top, o = t.lineAt(i, Oh.ByPos, e, 0, 0).bottom;
				return r += o - a, {
					from: n,
					to: i,
					top: a,
					bottom: o,
					domTop: 0,
					domBottom: 0
				};
			}), this.scale = (7e6 - r) / (t.height - r);
			for (let e of this.viewports) e.domTop = a + (e.top - i) * this.scale, a = e.domBottom = e.domTop + (e.bottom - e.top), i = e.bottom;
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
	}, Gh = /*@__PURE__*/ q.define({ combine: (e) => e.join(" ") }), Kh = /*@__PURE__*/ q.define({ combine: (e) => e.indexOf(!0) > -1 }), qh = /*@__PURE__*/ Rl.newName(), Jh = /*@__PURE__*/ Rl.newName(), Yh = /*@__PURE__*/ Rl.newName(), Xh = {
		"&light": "." + Jh,
		"&dark": "." + Yh
	}, Zh = /*@__PURE__*/ uf("." + qh, {
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
	}, Xh), Qh = {
		childList: !0,
		characterData: !0,
		subtree: !0,
		attributes: !0,
		characterDataOldValue: !0
	}, $h = J.ie && J.ie_version <= 11, eg = class {
		constructor(e) {
			this.view = e, this.active = !1, this.editContext = null, this.selectionRange = new zp(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
				for (let e of t) this.queue.push(e);
				(J.ie && J.ie_version <= 11 || J.ios && e.composing) && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : this.flush();
			}), window.EditContext && J.android && e.constructor.EDIT_CONTEXT !== !1 && !(J.chrome && J.chrome_version < 126) && (this.editContext = new tg(e), e.state.facet(hm) && (e.contentDOM.editContext = this.editContext.editContext)), $h && (this.onCharData = (e) => {
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
			if (n.state.facet(hm) ? n.root.activeElement != this.dom : !lu(this.dom, r)) return;
			let i = r.anchorNode && n.docView.tile.nearest(r.anchorNode);
			if (i && i.isWidget() && i.widget.ignoreEvent(e)) {
				t || (this.selectionChanged = !1);
				return;
			}
			(J.ie && J.ie_version <= 11 || J.android && J.chrome) && !n.state.selection.main.empty && r.focusNode && du(r.focusNode, r.focusOffset, r.anchorNode, r.anchorOffset) ? this.flushSoon() : this.flush(!1);
		}
		readSelectionRange() {
			let { view: e } = this, t = su(e.root);
			if (!t) return !1;
			let n = J.safari && e.root.nodeType == 11 && e.root.activeElement == this.dom && pf(this.view, t) || t;
			if (!n || this.selectionRange.eq(n)) return !1;
			let r = lu(this.dom, n);
			return r && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && Tu(this.dom, n) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(n), r && (this.selectionChanged = !0), !0);
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
			for (let n = this.dom; n;) if (n.nodeType == 1) !t && e < this.scrollTargets.length && this.scrollTargets[e] == n ? e++ : t ||= this.scrollTargets.slice(0, e), t && t.push(n), n = n.assignedSlot || n.parentNode;
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
			this.active ||= (this.observer.observe(this.dom, Qh), $h && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), !0);
		}
		stop() {
			this.active && (this.active = !1, this.observer.disconnect(), $h && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
		}
		clear() {
			this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
		}
		delayAndroidKey(e, t) {
			if (!this.delayedAndroidKey) {
				let e = () => {
					let e = this.delayedAndroidKey;
					e && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = e.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && e.force && Cu(this.dom, e.key, e.keyCode));
				};
				this.flushingAndroidKey = this.view.win.requestAnimationFrame(e);
			}
			(!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
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
			let { from: e, to: t, typeOver: n } = this.processRecords(), r = this.selectionChanged && lu(this.dom, this.selectionRange);
			if (e < 0 && !r) return null;
			e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
			let i = new oh(this.view, e, t, n);
			return this.view.docView.domChanged = { newSel: i.newSel ? i.newSel.main : null }, i;
		}
		flush(e = !0) {
			if (this.delayedFlush >= 0 || this.delayedAndroidKey) return !1;
			e && this.readSelectionRange();
			let t = this.readChange();
			if (!t) return this.view.requestMeasure(), !1;
			let n = this.view.state, r = xd(this.view, t);
			return this.view.state == n && (t.domChanged || t.newSel && !Dd(this.view.state.selection, t.newSel.main)) && this.view.update([]), r;
		}
		readMutation(e) {
			let t = this.view.docView.tile.nearest(e.target);
			if (!t || t.isWidget()) return null;
			if (t.markDirty(e.type == "attributes"), e.type == "childList") {
				let n = df(t, e.previousSibling || e.target.previousSibling, -1), r = df(t, e.nextSibling || e.target.nextSibling, 1);
				return {
					from: n ? t.posAfter(n) : t.posAtStart,
					to: r ? t.posBefore(r) : t.posAtEnd,
					typeOver: !1
				};
			} else if (e.type == "characterData") return {
				from: t.posAtStart,
				to: t.posAtEnd,
				typeOver: e.target.nodeValue == e.oldValue
			};
			else return null;
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
			this.editContext && (this.editContext.update(e), e.startState.facet(hm) != e.state.facet(hm) && (e.view.contentDOM.editContext = e.state.facet(hm) ? this.editContext.editContext : null));
		}
		destroy() {
			var e, t, n;
			this.stop(), (e = this.intersection) == null || e.disconnect(), (t = this.gapIntersection) == null || t.disconnect(), (n = this.resizeScroll) == null || n.disconnect();
			for (let e of this.scrollTargets) e.removeEventListener("scroll", this.onScroll);
			this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy());
		}
	}, tg = class {
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
				let l = wd(e.state.sliceDoc(o, s), n.text, (c ? r.from : r.to) - o, c ? "end" : null);
				if (!l) {
					let t = K.single(this.toEditorPos(n.selectionStart), this.toEditorPos(n.selectionEnd));
					Dd(t, r) || e.dispatch({
						selection: t,
						userEvent: "select"
					});
					return;
				}
				let u = {
					from: l.from + o,
					to: l.toA + o,
					insert: G.of(n.text.slice(l.from, l.toB).split("\n"))
				};
				if ((J.mac || J.android) && u.from == a - 1 && /^\. ?$/.test(n.text) && e.contentDOM.getAttribute("autocorrect") == "off" && (u = {
					from: o,
					to: s,
					insert: G.of([n.text.replace(".", " ")])
				}), this.pendingContextChange = u, !e.state.readOnly) {
					let t = this.to - this.from + (u.to - u.from + u.insert.length);
					Sd(e, u, K.single(this.toEditorPos(n.selectionStart, t), this.toEditorPos(n.selectionEnd, t)));
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
				e.dispatch({ effects: mm.of(Y.set(n)) });
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
				let t = su(e.root);
				t && t.rangeCount && this.editContext.updateSelectionBounds(t.getRangeAt(0).getBoundingClientRect());
			} };
		}
		applyEdits(e) {
			let t = 0, n = !1, r = this.pendingContextChange;
			return e.changes.iterChanges((i, a, o, s, c) => {
				if (n) return;
				let l = c.length - (a - i);
				if (r && a >= r.to) if (r.from == i && r.to == a && r.insert.eq(c)) {
					r = this.pendingContextChange = null, t += l, this.to += l;
					return;
				} else r = null, this.revertPending(e.state);
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
			return !(this.from > 0 && t - this.from < 500 || this.to < e.doc.length && this.to - t < 500 || this.to - this.from > 1e4 * 3);
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
			this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
			let { dispatch: t } = e;
			this.dispatchTransactions = e.dispatchTransactions || t && ((e) => e.forEach((e) => t(e, this))) || ((e) => this.update(e)), this.dispatch = this.dispatch.bind(this), this._root = e.root || wu(e.parent) || document, this.viewState = new Vh(this, e.state || wl.create(e)), e.scrollTo && e.scrollTo.is(pm) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(_m).map((e) => new ym(e));
			for (let e of this.plugins) e.update(this);
			this.observer = new eg(this), this.inputState = new sh(this), this.inputState.ensureHandlers(this.plugins), this.docView = new Zm(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), document.fonts?.ready && document.fonts.ready.then(() => {
				this.viewState.mustMeasureContent = "refresh", this.requestMeasure();
			});
		}
		dispatch(...e) {
			let t = e.length == 1 && e[0] instanceof yl ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
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
			t.some((e) => e.annotation(xh)) ? (this.inputState.notifiedFocused = o, s = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, c = qd(a, o), c || (s = 1));
			let l = this.observer.delayedAndroidKey, u = null;
			if (l ? (this.observer.clearDelayedAndroidKey(), u = this.observer.readChange(), (u && !this.state.doc.eq(a.doc) || !this.state.selection.eq(a.selection)) && (u = null)) : this.observer.clear(), a.facet(wl.phrases) != this.state.facet(wl.phrases)) return this.setState(a);
			i = Am.create(this, a, t), i.flags |= s;
			let d = this.viewState.scrollTarget;
			try {
				this.updateState = 2;
				for (let n of t) {
					if (d &&= d.map(n.changes), n.scrollIntoView) {
						let { main: t } = n.state.selection, { x: r, y: i } = this.state.facet(e.cursorScrollMargin);
						d = new fm(t.empty ? t : K.cursor(t.head, t.head > t.anchor ? -1 : 1), "nearest", "nearest", i, r);
					}
					for (let e of n.effects) e.is(pm) && (d = e.value.clip(this.state));
				}
				this.viewState.update(i, d), this.bidiCache = ig.update(this.bidiCache, i.changes), i.empty || (this.updatePlugins(i), this.inputState.update(i)), n = this.docView.update(i), this.state.facet(Om) != this.styleModules && this.mountStyles(), r = this.updateAttrs(), this.showAnnouncements(t), this.docView.updateSelection(n, t.some((e) => e.isUserEvent("select.pointer")));
			} finally {
				this.updateState = 0;
			}
			if (i.startState.facet(Gh) != i.state.facet(Gh) && (this.viewState.mustMeasureContent = !0), (n || r || d || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), n && this.docViewUpdate(), !i.empty) for (let e of this.state.facet(im)) try {
				e(i);
			} catch (e) {
				Vu(this.state, e, "update listener");
			}
			(c || u) && Promise.resolve().then(() => {
				c && this.state == c.startState && this.dispatch(c), u && !xd(this, u) && l.force && Cu(this.contentDOM, l.key, l.keyCode);
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
				this.viewState = new Vh(this, e), this.plugins = e.facet(_m).map((e) => new ym(e)), this.pluginMap.clear();
				for (let e of this.plugins) e.update(this);
				this.docView.destroy(), this.docView = new Zm(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
			} finally {
				this.updateState = 0;
			}
			t && this.focus(), this.requestMeasure();
		}
		updatePlugins(e) {
			let t = e.startState.facet(_m), n = e.state.facet(_m);
			if (t != n) {
				let r = [];
				for (let i of n) {
					let n = t.indexOf(i);
					if (n < 0) r.push(new ym(i));
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
					Vu(this.state, e, "doc view update listener");
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
			let t = null, n = this.viewState.scrollParent, r = this.viewState.getScrollOffset(), { scrollAnchorPos: i, scrollAnchorHeight: a } = this.viewState;
			Math.abs(r - this.viewState.scrollOffset) > 1 && (a = -1), this.viewState.scrollAnchorHeight = -1;
			try {
				for (let e = 0;; e++) {
					if (a < 0) if (Eu(n || this.win)) i = -1, a = this.viewState.heightMap.height;
					else {
						let e = this.viewState.scrollAnchorAt(r);
						i = e.from, a = e.top;
					}
					this.updateState = 1;
					let o = this.viewState.measure();
					if (!o && !this.measureRequests.length && this.viewState.scrollTarget == null) break;
					if (e > 5) {
						console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
						break;
					}
					let s = [];
					o & 4 || ([this.measureRequests, s] = [s, this.measureRequests]);
					let c = s.map((e) => {
						try {
							return e.read(this);
						} catch (e) {
							return Vu(this.state, e), rg;
						}
					}), l = Am.create(this, this.state, []), u = !1;
					l.flags |= o, t ? t.flags |= o : t = l, this.updateState = 2, l.empty || (this.updatePlugins(l), this.inputState.update(l), this.updateAttrs(), u = this.docView.update(l), u && this.docViewUpdate());
					for (let e = 0; e < s.length; e++) if (c[e] != rg) try {
						let t = s[e];
						t.write && t.write(c[e], this);
					} catch (e) {
						Vu(this.state, e);
					}
					if (u && this.docView.updateSelection(!0), !l.viewportChanged && this.measureRequests.length == 0) {
						if (this.viewState.editorHeight) if (this.viewState.scrollTarget) {
							this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, a = -1;
							continue;
						} else {
							let e = ((i < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(i).top) - a) / this.scaleY;
							if ((e > 1 || e < -1) && !(J.ios && this.inputState.lastIOSMomentumScroll > Date.now() - 100) && (n == this.scrollDOM || this.hasFocus || Math.max(this.inputState.lastWheelEvent, this.inputState.lastTouchTime) > Date.now() - 100)) {
								r += e, n ? n.scrollTop += e : this.win.scrollBy(0, e), a = -1;
								continue;
							}
						}
						break;
					}
				}
			} finally {
				this.updateState = 0, this.measureScheduled = -1;
			}
			if (t && !t.empty) for (let e of this.state.facet(im)) e(t);
		}
		get themeClasses() {
			return qh + " " + (this.state.facet(Kh) ? Yh : Jh) + " " + this.state.facet(Gh);
		}
		updateAttrs() {
			let e = mf(this, bm, { class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses }), t = {
				spellcheck: "false",
				autocorrect: "off",
				autocapitalize: "off",
				writingsuggestions: "false",
				translate: "no",
				contenteditable: this.state.facet(hm) ? "true" : "false",
				class: "cm-content",
				style: `${J.tabSize}: ${this.state.tabSize}`,
				role: "textbox",
				"aria-multiline": "true"
			};
			this.state.readOnly && (t["aria-readonly"] = "true"), mf(this, xm, t);
			let n = this.observer.ignore(() => {
				let n = nu(this.contentDOM, this.contentAttrs, t), r = nu(this.dom, this.editorAttrs, e);
				return n || r;
			});
			return this.editorAttrs = e, this.contentAttrs = t, n;
		}
		showAnnouncements(t) {
			let n = !0;
			for (let r of t) for (let t of r.effects) if (t.is(e.announce)) {
				n && (this.announceDOM.textContent = ""), n = !1;
				let e = this.announceDOM.appendChild(document.createElement("div"));
				e.textContent = t.value;
			}
		}
		mountStyles() {
			this.styleModules = this.state.facet(Om);
			let t = this.state.facet(e.cspNonce);
			Rl.mount(this.root, this.styleModules.concat(Zh).reverse(), t ? { nonce: t } : void 0);
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
			return gd(this, e, dd(this, e, t, n));
		}
		moveByGroup(e, t) {
			return gd(this, e, dd(this, e, t, (t) => fd(this, e.head, t)));
		}
		visualLineSide(e, t) {
			let n = this.bidiSpans(e), r = this.textDirectionAt(e.from), i = n[t ? n.length - 1 : 0];
			return K.cursor(i.side(t, r) + e.from, i.forward(!t, r) ? 1 : -1);
		}
		moveToLineBoundary(e, t, n = !0) {
			return ud(this, e, t, n);
		}
		moveVertically(e, t, n) {
			return gd(this, e, pd(this, e, t, n));
		}
		domAtPos(e, t = 1) {
			return this.docView.domAtPos(e, t);
		}
		posAtDOM(e, t = 0) {
			return this.docView.posFromDOM(e, t);
		}
		posAtCoords(e, t = !0) {
			this.readMeasured();
			let n = _d(this, e, t);
			return n && n.pos;
		}
		posAndSideAtCoords(e, t = !0) {
			return this.readMeasured(), _d(this, e, t);
		}
		coordsAtPos(e, t = 1) {
			this.readMeasured();
			let n = this.state.doc.lineAt(e), r = this.bidiSpans(n), i = r[Zp.find(r, e - n.from, -1, t)];
			return this.docView.coordsAt(e, t, i.dir == Up.RTL);
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
			return !this.state.facet(lm) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
		}
		get lineWrapping() {
			return this.viewState.heightOracle.lineWrapping;
		}
		bidiSpans(e) {
			if (e.length > ng) return Ru(e.length);
			let t = this.textDirectionAt(e.from), n;
			for (let r of this.bidiCache) if (r.from == e.from && r.dir == t && (r.fresh || ju(r.isolates, n = Hu(this, e)))) return r.order;
			n ||= Hu(this, e);
			let r = Lu(e.text, t, n);
			return this.bidiCache.push(new ig(e.from, e.to, t, n, !0, r)), r;
		}
		get hasFocus() {
			return (this.dom.ownerDocument.hasFocus() || J.safari && this.inputState?.lastContextMenu > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
		}
		focus() {
			this.observer.ignore(() => {
				xu(this.contentDOM), this.docView.updateSelection();
			});
		}
		setRoot(e) {
			this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
		}
		destroy() {
			this.root.activeElement == this.contentDOM && this.contentDOM.blur();
			for (let e of this.plugins) e.destroy(this);
			this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
		}
		static scrollIntoView(e, t = {}) {
			return pm.of(new fm(typeof e == "number" ? K.cursor(e) : e, t.y ?? "nearest", t.x ?? "nearest", t.yMargin ?? 5, t.xMargin ?? 5));
		}
		scrollSnapshot() {
			let { scrollTop: e, scrollLeft: t } = this.scrollDOM, n = this.viewState.scrollAnchorAt(e);
			return pm.of(new fm(K.cursor(n.from), "start", "start", n.top - e, t, !0));
		}
		setTabFocusMode(e) {
			e == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof e == "boolean" ? this.inputState.tabFocusMode = e ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + e);
		}
		static domEventHandlers(e) {
			return vm.define(() => ({}), { eventHandlers: e });
		}
		static domEventObservers(e) {
			return vm.define(() => ({}), { eventObservers: e });
		}
		static theme(e, t) {
			let n = Rl.newName(), r = [Gh.of(n), Om.of(uf(`.${n}`, e))];
			return t && t.dark && r.push(Kh.of(!0)), r;
		}
		static baseTheme(e) {
			return rl.lowest(Om.of(uf("." + qh, e, Xh)));
		}
		static findFromDOM(e) {
			let t = e.querySelector(".cm-content");
			return (t && Mm.get(t) || Mm.get(e))?.root?.view || null;
		}
	}, X.styleModule = Om, X.inputHandler = am, X.clipboardInputFilter = sm, X.clipboardOutputFilter = cm, X.scrollHandler = dm, X.focusChangeEffect = om, X.perLineTextDirection = lm, X.exceptionSink = rm, X.updateListener = im, X.editable = hm, X.mouseSelectionStyle = nm, X.dragMovesSelection = tm, X.clickAddsSelectionRange = em, X.decorations = Sm, X.blockWrappers = Cm, X.outerDecorations = wm, X.atomicRanges = Tm, X.bidiIsolatedRanges = Em, X.cursorScrollMargin = /*@__PURE__*/ q.define({ combine: (e) => {
		let t = 5, n = 5;
		for (let r of e) typeof r == "number" ? t = n = r : {x: t, y: n} = r;
		return {
			x: t,
			y: n
		};
	} }), X.scrollMargins = Dm, X.darkTheme = Kh, X.cspNonce = /*@__PURE__*/ q.define({ combine: (e) => e.length ? e[0] : "" }), X.contentAttributes = xm, X.editorAttributes = bm, X.lineWrapping = /*@__PURE__*/ X.contentAttributes.of({ class: "cm-lineWrapping" }), X.announce = /*@__PURE__*/ vl.define(), ng = 4096, rg = {}, ig = class e {
		constructor(e, t, n, r, i, a) {
			this.from = e, this.to = t, this.dir = n, this.isolates = r, this.fresh = i, this.order = a;
		}
		static update(t, n) {
			if (n.empty && !t.some((e) => e.fresh)) return t;
			let r = [], i = t.length ? t[t.length - 1].dir : Up.LTR;
			for (let a = Math.max(0, t.length - 10); a < t.length; a++) {
				let o = t[a];
				o.dir == i && !n.touchesRange(o.from, o.to) && r.push(new e(n.mapPos(o.from, 1), n.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
			}
			return r;
		}
	}, ag = J.mac ? "mac" : J.windows ? "win" : J.linux ? "linux" : "key", og = /*@__PURE__*/ rl.default(/*@__PURE__*/ X.domEventHandlers({ keydown(e, t) {
		return bf(_f(t.state), e, t, "editor");
	} })), sg = /*@__PURE__*/ q.define({ enables: og }), cg = /*@__PURE__*/ new WeakMap(), lg = null, ug = 4e3, dg = null, fg = class e {
		constructor(e, t, n, r, i) {
			this.className = e, this.left = t, this.top = n, this.width = r, this.height = i;
		}
		draw() {
			let e = document.createElement("div");
			return e.className = this.className, this.adjust(e), e;
		}
		update(e, t) {
			return t.className == this.className ? (this.adjust(e), !0) : !1;
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
				let a = xf(t);
				return [new e(n, i.left - a.left, i.top - a.top, null, i.bottom - i.top)];
			} else return Cf(t, n, r);
		}
	}, pg = class {
		constructor(e, t) {
			this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = {
				read: this.measure.bind(this),
				write: this.draw.bind(this)
			}, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
		}
		update(e) {
			e.startState.facet(mg) != e.state.facet(mg) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
		}
		docViewUpdate(e) {
			this.layer.updateOnDocViewUpdate !== !1 && e.requestMeasure(this.measureReq);
		}
		setOrder(e) {
			let t = 0, n = e.facet(mg);
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
			if (e.length != this.drawn.length || e.some((e, t) => !wf(e, this.drawn[t]))) {
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
	}, mg = /*@__PURE__*/ q.define(), hg = /*@__PURE__*/ q.define({ combine(e) {
		return Dc(e, {
			cursorBlinkRate: 1200,
			drawRangeCursor: !0,
			iosSelectionHandles: !0
		}, {
			cursorBlinkRate: (e, t) => Math.min(e, t),
			drawRangeCursor: (e, t) => e || t
		});
	} }), gg = /*@__PURE__*/ Tf({
		above: !0,
		markers(e) {
			let { state: t } = e, n = t.facet(hg), r = [];
			for (let i of t.selection.ranges) {
				let a = i == t.selection.main;
				if (i.empty || n.drawRangeCursor && !(a && J.ios && n.iosSelectionHandles)) {
					let t = a ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", n = i.empty ? i : K.cursor(i.head, i.assoc);
					for (let i of fg.forRange(e, t, n)) r.push(i);
				}
			}
			return r;
		},
		update(e, t) {
			e.transactions.some((e) => e.selection) && (t.style.animationName = t.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
			let n = Of(e);
			return n && kf(e.state, t), e.docChanged || e.selectionSet || n;
		},
		mount(e, t) {
			kf(t.state, e);
		},
		class: "cm-cursorLayer"
	}), _g = /*@__PURE__*/ Tf({
		above: !1,
		markers(e) {
			let t = [], { main: n, ranges: r } = e.state.selection;
			for (let n of r) if (!n.empty) for (let r of fg.forRange(e, "cm-selectionBackground", n)) t.push(r);
			if (J.ios && !n.empty && e.state.facet(hg).iosSelectionHandles) {
				for (let r of fg.forRange(e, "cm-selectionHandle cm-selectionHandle-start", K.cursor(n.from, 1))) t.push(r);
				for (let r of fg.forRange(e, "cm-selectionHandle cm-selectionHandle-end", K.cursor(n.to, 1))) t.push(r);
			}
			return t;
		},
		update(e, t) {
			return e.docChanged || e.selectionSet || e.viewportChanged || Of(e);
		},
		class: "cm-selectionLayer"
	}), vg = /*@__PURE__*/ rl.highest(/*@__PURE__*/ X.theme({
		".cm-line": {
			"& ::selection, &::selection": { backgroundColor: "transparent !important" },
			caretColor: "transparent !important"
		},
		".cm-content": {
			caretColor: "transparent !important",
			"& :focus": {
				caretColor: "initial !important",
				"&::selection, & ::selection": { backgroundColor: "Highlight !important" }
			}
		}
	})), yg = /*@__PURE__*/ vl.define({ map(e, t) {
		return e == null ? null : t.mapPos(e);
	} }), bg = /*@__PURE__*/ tl.define({
		create() {
			return null;
		},
		update(e, t) {
			return e != null && (e = t.changes.mapPos(e)), t.effects.reduce((e, t) => t.is(yg) ? t.value : e, e);
		}
	}), xg = /*@__PURE__*/ vm.fromClass(class {
		constructor(e) {
			this.view = e, this.cursor = null, this.measureReq = {
				read: this.readPos.bind(this),
				write: this.drawCursor.bind(this)
			};
		}
		update(e) {
			var t;
			let n = e.state.field(bg);
			n == null ? this.cursor != null && ((t = this.cursor) == null || t.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (e.startState.field(bg) != n || e.docChanged || e.geometryChanged) && this.view.requestMeasure(this.measureReq));
		}
		readPos() {
			let { view: e } = this, t = e.state.field(bg), n = t != null && e.coordsAtPos(t);
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
			this.view.state.field(bg) != e && this.view.dispatch({ effects: yg.of(e) });
		}
	}, { eventObservers: {
		dragover(e) {
			this.setDropPos(this.view.posAtCoords({
				x: e.clientX,
				y: e.clientY
			}));
		},
		dragleave(e) {
			(e.target == this.view.contentDOM || !this.view.contentDOM.contains(e.relatedTarget)) && this.setDropPos(null);
		},
		dragend() {
			this.setDropPos(null);
		},
		drop() {
			this.setDropPos(null);
		}
	} }), Sg = class {
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
			let t = new kl(), n = t.add.bind(t);
			for (let { from: t, to: r } of Mf(e, this.maxLength)) jf(e.state.doc, this.regexp, t, r, (t, r) => this.addMatch(r, e, t, n));
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
					else jf(e.state.doc, this.regexp, s, c, (t, n) => this.addMatch(n, e, t, d));
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
	}, Cg = /x/.unicode == null ? "g" : "gu", wg = /*@__PURE__*/ RegExp("[\0-\b\n--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩﻿￹-￼]", Cg), Tg = {
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
	}, Eg = null, Dg = /*@__PURE__*/ q.define({ combine(e) {
		let t = Dc(e, {
			render: null,
			specialChars: wg,
			addSpecialChars: null
		});
		return (t.replaceTabs = !Nf()) && (t.specialChars = RegExp("	|" + t.specialChars.source, Cg)), t.addSpecialChars && (t.specialChars = RegExp(t.specialChars.source + "|" + t.addSpecialChars.source, Cg)), t;
	} }), Og = null, kg = "•", Ag = class extends Np {
		constructor(e, t) {
			super(), this.options = e, this.code = t;
		}
		eq(e) {
			return e.code == this.code;
		}
		toDOM(e) {
			let t = If(this.code), n = e.state.phrase("Control character") + " " + (Tg[this.code] || "0x" + this.code.toString(16)), r = this.options.render && this.options.render(this.code, n, t);
			if (r) return r;
			let i = document.createElement("span");
			return i.textContent = t, i.title = n, i.setAttribute("aria-label", n), i.className = "cm-specialChar", i;
		}
		ignoreEvent() {
			return !1;
		}
	}, jg = class extends Np {
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
	}, Mg = /*@__PURE__*/ vm.fromClass(class {
		constructor() {
			this.height = 1e3, this.attrs = { style: "padding-bottom: 1000px" };
		}
		update(e) {
			let { view: t } = e, n = t.viewState.editorHeight - t.defaultLineHeight - t.documentPadding.top - .5;
			n >= 0 && n != this.height && (this.height = n, this.attrs = { style: `padding-bottom: ${n}px` });
		}
	}), Ng = /*@__PURE__*/ Y.line({ class: "cm-activeLine" }), Pg = /*@__PURE__*/ vm.fromClass(class {
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
				i.from > t && (n.push(Ng.range(i.from)), t = i.from);
			}
			return Y.set(n);
		}
	}, { decorations: (e) => e.decorations }), Fg = class extends Np {
		constructor(e) {
			super(), this.content = e;
		}
		toDOM(e) {
			let t = document.createElement("span");
			return t.className = "cm-placeholder", t.style.pointerEvents = "none", t.appendChild(typeof this.content == "string" ? document.createTextNode(this.content) : typeof this.content == "function" ? this.content(e) : this.content.cloneNode(!0)), t.setAttribute("aria-hidden", "true"), t;
		}
		coordsAt(e) {
			let t = e.firstChild ? uu(e.firstChild) : [];
			if (!t.length) return null;
			let n = window.getComputedStyle(e.parentNode), r = gu(t[0], n.direction != "rtl"), i = parseInt(n.lineHeight);
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
	}, Ig = 2e3, Lg = {
		Alt: [18, (e) => !!e.altKey],
		Control: [17, (e) => !!e.ctrlKey],
		Shift: [16, (e) => !!e.shiftKey],
		Meta: [91, (e) => !!e.metaKey]
	}, Rg = { style: "cursor: crosshair" }, zg = "-10000px", Bg = class {
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
	}, Vg = /*@__PURE__*/ q.define({ combine: (e) => ({
		position: J.ios ? "absolute" : e.find((e) => e.position)?.position || "fixed",
		parent: e.find((e) => e.parent)?.parent || null,
		tooltipSpace: e.find((e) => e.tooltipSpace)?.tooltipSpace || qf
	}) }), Hg = /*@__PURE__*/ new WeakMap(), Ug = /*@__PURE__*/ vm.fromClass(class {
		constructor(e) {
			this.view = e, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
			let t = e.state.facet(Vg);
			this.position = t.position, this.parent = t.parent, this.classes = e.themeClasses, this.createContainer(), this.measureReq = {
				read: this.readMeasure.bind(this),
				write: this.writeMeasure.bind(this),
				key: this
			}, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new Bg(e, Kg, (e, t) => this.createTooltip(e, t), (e) => {
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
			let n = t || e.geometryChanged, r = e.state.facet(Vg);
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
			return n.dom.style.position = this.position, n.dom.style.top = zg, n.dom.style.left = "0px", this.container.insertBefore(n.dom, r), n.mount && n.mount(this.view), this.resizeObserver && this.resizeObserver.observe(n.dom), n;
		}
		destroy() {
			var e, t, n;
			this.view.win.removeEventListener("resize", this.measureSoon);
			for (let t of this.manager.tooltipViews) t.dom.remove(), (e = t.destroy) == null || e.call(t);
			this.parent && this.container.remove(), (t = this.resizeObserver) == null || t.disconnect(), (n = this.intersectionObserver) == null || n.disconnect(), clearTimeout(this.measureTimeout);
		}
		readMeasure() {
			let e = 1, t = 1, n = !1;
			if (this.position == "fixed" && this.manager.tooltipViews.length) {
				let { dom: e } = this.manager.tooltipViews[0];
				if (J.safari) {
					let t = e.getBoundingClientRect();
					n = Math.abs(t.top + 1e4) > 1 || Math.abs(t.left) > 1;
				} else n = !!e.offsetParent && e.offsetParent != this.container.ownerDocument.body;
			}
			if (n || this.position == "absolute") if (this.parent) {
				let n = this.parent.getBoundingClientRect();
				n.width && n.height && (e = n.width / this.parent.offsetWidth, t = n.height / this.parent.offsetHeight);
			} else ({scaleX: e, scaleY: t} = this.view.viewState);
			let r = this.view.scrollDOM.getBoundingClientRect(), i = Uu(this.view);
			return {
				visible: {
					left: r.left + i.left,
					top: r.top + i.top,
					right: r.right - i.right,
					bottom: r.bottom - i.bottom
				},
				parent: this.parent ? this.container.getBoundingClientRect() : this.view.dom.getBoundingClientRect(),
				pos: this.manager.tooltips.map((e, t) => {
					let n = this.manager.tooltipViews[t];
					return n.getCoords ? n.getCoords(e.pos) : this.view.coordsAtPos(e.pos);
				}),
				size: this.manager.tooltipViews.map(({ dom: e }) => e.getBoundingClientRect()),
				space: this.view.state.facet(Vg).tooltipSpace(this.view),
				scaleX: e,
				scaleY: t,
				makeAbsolute: n
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
					l.style.top = zg;
					continue;
				}
				let f = s.arrow ? c.dom.querySelector(".cm-tooltip-arrow") : null, p = f ? 7 : 0, m = d.right - d.left, h = Hg.get(c) ?? d.bottom - d.top, g = c.offset || Gg, _ = this.view.textDirection == Up.LTR, v = d.width > n.right - n.left ? _ ? n.left : n.right - d.width : _ ? Math.max(n.left, Math.min(u.left - (f ? 14 : 0) + g.x, n.right - m)) : Math.min(Math.max(n.left, u.left - m + (f ? 14 : 0) - g.x), n.right - m), y = this.above[o];
				!s.strictSide && (y ? u.top - h - p - g.y < n.top : u.bottom + h + p + g.y > n.bottom) && y == n.bottom - u.bottom > u.top - n.top && (y = this.above[o] = !y);
				let b = (y ? u.top - n.top : n.bottom - u.bottom) - p;
				if (b < h && c.resize !== !1) {
					if (b < this.view.defaultLineHeight) {
						l.style.top = zg;
						continue;
					}
					Hg.set(c, h), l.style.height = (h = b) / i + "px";
				} else l.style.height && (l.style.height = "");
				let x = y ? u.top - h - p - g.y : u.bottom + p + g.y, S = v + m;
				if (c.overlap !== !0) for (let e of a) e.left < S && e.right > v && e.top < x + h && e.bottom > x && (x = y ? e.top - h - 2 - p : e.bottom + p + 2);
				if (this.position == "absolute" ? (l.style.top = (x - e.parent.top) / i + "px", Jf(l, (v - e.parent.left) / r)) : (l.style.top = x / i + "px", Jf(l, v / r)), f) {
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
			if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView))) for (let e of this.manager.tooltipViews) e.dom.style.top = zg;
		}
	}, { eventObservers: { scroll() {
		this.maybeMeasure();
	} } }), Wg = /*@__PURE__*/ X.baseTheme({
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
	}), Gg = {
		x: 0,
		y: 0
	}, Kg = /*@__PURE__*/ q.define({ enables: [Ug, Wg] }), qg = /*@__PURE__*/ q.define({ combine: (e) => e.reduce((e, t) => e.concat(t), []) }), Jg = class e {
		static create(t) {
			return new e(t);
		}
		constructor(e) {
			this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new Bg(e, qg, (e, t) => this.createHostedView(e, t), (e) => e.dom.remove());
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
	}, Yg = /*@__PURE__*/ Kg.compute([qg], (e) => {
		let t = e.facet(qg);
		return t.length === 0 ? null : {
			pos: Math.min(...t.map((e) => e.pos)),
			end: Math.max(...t.map((e) => e.end ?? e.pos)),
			create: Jg.create,
			above: t[0].above,
			arrow: t.some((e) => e.arrow)
		};
	}), Xg = /*@__PURE__*/ q.define(), Zg = class {
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
				let a = e.bidiSpans(e.state.doc.lineAt(r)).find((e) => e.from <= r && e.to >= r), o = a && a.dir == Up.RTL ? -1 : 1;
				i = t.x < n.left ? -o : o;
			}
			this.activateHover(e, r, i);
		}
		activateHover(e, t, n, r) {
			let i = this.source(e, t, n), a = (t) => {
				if (t && !(Array.isArray(t) && !t.length)) {
					let n = Array.isArray(t) ? t : [t];
					r && this.locked.set(n, r), e.dispatch({ effects: this.setHover.of(n) });
				}
			};
			if (i && "then" in i) {
				let n = this.pending = { pos: t };
				i.then((e) => {
					this.pending == n && (this.pending = null, a(e));
				}, (t) => Vu(e.state, t, "hover tooltip"));
			} else a(i);
		}
		get tooltip() {
			let e = this.view.plugin(Ug), t = e ? e.manager.tooltips.findIndex((e) => e.create == Jg.create) : -1;
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
			if (t.length && !this.locked.has(t) && n && !Yf(n.dom, e) || this.pending) {
				let { pos: n } = t[0] || this.pending, r = t[0]?.end ?? n;
				(n == r ? this.view.posAtCoords(this.lastMove) != n : !Xf(this.view, n, r, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of([]) }), this.pending = null);
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
	}, Qg = 4, $g = /*@__PURE__*/ vl.define(), e_ = /*@__PURE__*/ $g.of(null), t_ = /*@__PURE__*/ q.define({ combine(e) {
		let t, n;
		for (let r of e) t ||= r.topContainer, n ||= r.bottomContainer;
		return {
			topContainer: t,
			bottomContainer: n
		};
	} }), n_ = /*@__PURE__*/ vm.fromClass(class {
		constructor(e) {
			this.input = e.state.facet(i_), this.specs = this.input.filter((e) => e), this.panels = this.specs.map((t) => t(e));
			let t = e.state.facet(t_);
			this.top = new r_(e, !0, t.topContainer), this.bottom = new r_(e, !1, t.bottomContainer), this.top.sync(this.panels.filter((e) => e.top)), this.bottom.sync(this.panels.filter((e) => !e.top));
			for (let e of this.panels) e.dom.classList.add("cm-panel"), e.mount && e.mount();
		}
		update(e) {
			let t = e.state.facet(t_);
			this.top.container != t.topContainer && (this.top.sync([]), this.top = new r_(e.view, !0, t.topContainer)), this.bottom.container != t.bottomContainer && (this.bottom.sync([]), this.bottom = new r_(e.view, !1, t.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
			let n = e.state.facet(i_);
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
	}) }), r_ = class {
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
				this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
				let e = this.container || this.view.dom;
				e.insertBefore(this.dom, this.top ? e.firstChild : null);
			}
			let e = this.dom.firstChild;
			for (let t of this.panels) if (t.dom.parentNode == this.dom) {
				for (; e != t.dom;) e = ap(e);
				e = e.nextSibling;
			} else this.dom.insertBefore(t.dom, e);
			for (; e;) e = ap(e);
		}
		scrollMargin() {
			return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
		}
		syncClasses() {
			if (!(!this.container || this.classes == this.view.themeClasses)) {
				for (let e of this.classes.split(" ")) e && this.container.classList.remove(e);
				for (let e of (this.classes = this.view.themeClasses).split(" ")) e && this.container.classList.add(e);
			}
		}
	}, i_ = /*@__PURE__*/ q.define({ enables: n_ }), a_ = /*@__PURE__*/ tl.define({
		create() {
			return [];
		},
		update(e, t) {
			for (let n of t.effects) n.is(o_) ? e = [n.value].concat(e) : n.is(s_) && (e = e.filter((e) => e != n.value));
			return e;
		},
		provide: (e) => i_.computeN([e], (t) => t.field(e))
	}), o_ = /*@__PURE__*/ vl.define(), s_ = /*@__PURE__*/ vl.define(), c_ = class extends Tl {
		compare(e) {
			return this == e || this.constructor == e.constructor && this.eq(e);
		}
		eq(e) {
			return !1;
		}
		destroy(e) {}
	}, c_.prototype.elementClass = "", c_.prototype.toDOM = void 0, c_.prototype.mapMode = qc.TrackBefore, c_.prototype.startSide = c_.prototype.endSide = -1, c_.prototype.point = !0, l_ = /*@__PURE__*/ q.define(), u_ = /*@__PURE__*/ q.define(), d_ = {
		class: "",
		renderEmptyElements: !1,
		elementStyle: "",
		markers: () => Ol.empty,
		lineMarker: () => null,
		widgetMarker: () => null,
		lineMarkerChange: null,
		initialSpacer: null,
		updateSpacer: null,
		domEventHandlers: {},
		side: "before"
	}, f_ = /*@__PURE__*/ q.define(), p_ = /*@__PURE__*/ q.define({ combine: (e) => e.some((e) => e) }), m_ = /*@__PURE__*/ vm.fromClass(class {
		constructor(e) {
			this.view = e, this.domAfter = null, this.prevViewport = e.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters cm-gutters-before", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = e.state.facet(f_).map((t) => new g_(e, t)), this.fixed = !e.state.facet(p_);
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
			this.view.state.facet(p_) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : "", this.domAfter && (this.domAfter.style.position = this.fixed ? "sticky" : "")), this.prevViewport = e.view.viewport;
		}
		syncGutters(e) {
			let t = this.dom.nextSibling;
			e && (this.dom.remove(), this.domAfter && this.domAfter.remove());
			let n = Ol.iter(this.view.state.facet(l_), this.view.viewport.from), r = [], i = this.gutters.map((e) => new h_(e, this.view.viewport, -this.view.documentPadding.top));
			for (let e of this.view.viewportLineBlocks) if (r.length && (r = []), Array.isArray(e.type)) {
				let t = !0;
				for (let a of e.type) if (a.type == Pp.Text && t) {
					fp(n, r, a.from);
					for (let e of i) e.line(this.view, a, r);
					t = !1;
				} else if (a.widget) for (let e of i) e.widget(this.view, a);
			} else if (e.type == Pp.Text) {
				fp(n, r, e.from);
				for (let t of i) t.line(this.view, e, r);
			} else if (e.widget) for (let t of i) t.widget(this.view, e);
			for (let e of i) e.finish();
			e && (this.view.scrollDOM.insertBefore(this.dom, t), this.domAfter && this.view.scrollDOM.appendChild(this.domAfter));
		}
		updateGutters(e) {
			let t = e.startState.facet(f_), n = e.state.facet(f_), r = e.docChanged || e.heightChanged || e.viewportChanged || !Ol.eq(e.startState.facet(l_), e.state.facet(l_), e.view.viewport.from, e.view.viewport.to);
			if (t == n) for (let t of this.gutters) t.update(e) && (r = !0);
			else {
				r = !0;
				let i = [];
				for (let r of n) {
					let n = t.indexOf(r);
					n < 0 ? i.push(new g_(this.view, r)) : (this.gutters[n].update(e), i.push(this.gutters[n]));
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
		return t.textDirection == Up.LTR ? {
			left: r,
			right: i
		} : {
			right: r,
			left: i
		};
	}) }), h_ = class {
		constructor(e, t, n) {
			this.gutter = e, this.height = n, this.i = 0, this.cursor = Ol.iter(e.markers, t.from);
		}
		addElement(e, t, n) {
			let { gutter: r } = this, i = (t.top - this.height) / e.scaleY, a = t.height / e.scaleY;
			if (this.i == r.elements.length) {
				let t = new __(e, a, i, n);
				r.elements.push(t), r.dom.appendChild(t.dom);
			} else r.elements[this.i].update(e, a, i, n);
			this.height = t.bottom, this.i++;
		}
		line(e, t, n) {
			let r = [];
			fp(this.cursor, r, t.from), n.length && (r = r.concat(n));
			let i = this.gutter.config.lineMarker(e, t, r);
			i && r.unshift(i);
			let a = this.gutter;
			r.length == 0 && !a.config.renderEmptyElements || this.addElement(e, t, r);
		}
		widget(e, t) {
			let n = this.gutter.config.widgetMarker(e, t.widget, t), r = n ? [n] : null;
			for (let n of e.state.facet(u_)) {
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
	}, g_ = class {
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
			this.markers = dp(t.markers(e)), t.initialSpacer && (this.spacer = new __(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
		}
		update(e) {
			let t = this.markers;
			if (this.markers = dp(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
				let t = this.config.updateSpacer(this.spacer.markers[0], e);
				t != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [t]);
			}
			let n = e.view.viewport;
			return !Ol.eq(this.markers, t, n.from, n.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
		}
		destroy() {
			for (let e of this.elements) e.destroy();
		}
	}, __ = class {
		constructor(e, t, n, r) {
			this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, n, r);
		}
		update(e, t, n, r) {
			this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != n && (this.dom.style.marginTop = (this.above = n) ? n + "px" : ""), pp(this.markers, r) || this.setMarkers(e, r);
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
	}, v_ = /*@__PURE__*/ q.define(), y_ = /*@__PURE__*/ q.define(), b_ = /*@__PURE__*/ q.define({ combine(e) {
		return Dc(e, {
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
	} }), x_ = class extends c_ {
		constructor(e) {
			super(), this.number = e;
		}
		eq(e) {
			return this.number == e.number;
		}
		toDOM() {
			return document.createTextNode(this.number);
		}
	}, S_ = /*@__PURE__*/ f_.compute([b_], (e) => ({
		class: "cm-lineNumbers",
		renderEmptyElements: !1,
		markers(e) {
			return e.state.facet(v_);
		},
		lineMarker(e, t, n) {
			return n.some((e) => e.toDOM) ? null : new x_(mp(e, e.state.doc.lineAt(t.from).number));
		},
		widgetMarker: (e, t, n) => {
			for (let r of e.state.facet(y_)) {
				let i = r(e, t, n);
				if (i) return i;
			}
			return null;
		},
		lineMarkerChange: (e) => e.startState.facet(b_) != e.state.facet(b_),
		initialSpacer(e) {
			return new x_(mp(e, gp(e.state.doc.lines)));
		},
		updateSpacer(e, t) {
			let n = mp(t.view, gp(t.view.state.doc.lines));
			return n == e.number ? e : new x_(n);
		},
		domEventHandlers: e.facet(b_).domEventHandlers,
		side: "before"
	})), C_ = /*@__PURE__*/ new class extends c_ {
		constructor() {
			super(...arguments), this.elementClass = "cm-activeLineGutter";
		}
	}(), w_ = /*@__PURE__*/ l_.compute(["selection"], (e) => {
		let t = [], n = -1;
		for (let r of e.selection.ranges) {
			let i = e.doc.lineAt(r.head).from;
			i > n && (n = i, t.push(C_.range(i)));
		}
		return Ol.of(t);
	}), T_ = /*@__PURE__*/ Y.mark({ class: "cm-highlightTab" }), E_ = /*@__PURE__*/ Y.mark({ class: "cm-highlightSpace" }), D_ = /*@__PURE__*/ vp(/*@__PURE__*/ new Sg({
		regexp: /\t| /g,
		decoration: (e) => e[0] == "	" ? T_ : E_,
		boundary: /\S/
	})), O_ = /*@__PURE__*/ vp(/*@__PURE__*/ new Sg({
		regexp: /\s+$/g,
		decoration: /*@__PURE__*/ Y.mark({ class: "cm-trailingSpace" })
	})), k_ = {
		HeightMap: Ah,
		HeightOracle: Th,
		MeasuredHeights: Eh,
		QueryType: Oh,
		ChangedRange: km,
		computeOrder: Lu,
		moveVisually: zu,
		clearHeightChangeFlag: Xd,
		getHeightChangeFlag: () => wh
	};
}));
//#endregion
//#region node_modules/@lezer/common/dist/index.js
function j_(e, t, n, r) {
	switch (e) {
		case -2: return n < t;
		case -1: return r >= t && n < t;
		case 0: return n < t && r > t;
		case 1: return n <= t && r > t;
		case 2: return r > t;
		case 4: return !0;
	}
}
function M_(e, t, n, r) {
	for (; e.from == e.to || (n < 1 ? e.from >= t : e.from > t) || (n > -1 ? e.to <= t : e.to < t);) {
		let t = !r && e instanceof tv && e.index < 0 ? null : e.parent;
		if (!t) return e;
		e = t;
	}
	let i = r ? 0 : X_.IgnoreOverlays;
	if (r) for (let r = e, a = r.parent; a; r = a, a = r.parent) r instanceof tv && r.index < 0 && a.enter(t, n, i)?.from != r.from && (e = a);
	for (;;) {
		let r = e.enter(t, n, i);
		if (!r) return e;
		e = r;
	}
}
function N_(e, t, n, r) {
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
function P_(e, t, n = t.length - 1) {
	for (let r = e; n >= 0; r = r.parent) {
		if (!r) return !1;
		if (!r.type.isAnonymous) {
			if (t[n] && t[n] != r.name) return !1;
			n--;
		}
	}
	return !0;
}
function F_(e) {
	if (!e.length) return null;
	let t = 0, n = e[0];
	for (let r = 1; r < e.length; r++) {
		let i = e[r];
		(i.from > n.from || i.to < n.to) && (n = i, t = r);
	}
	let r = n instanceof tv && n.index < 0 ? null : n.parent, i = e.slice();
	return r ? i[t] = r : i.splice(t, 1), new iv(i, n);
}
function I_(e, t, n) {
	let r = e.resolveInner(t, n), i = null;
	for (let e = r instanceof tv ? r : r.context.parent; e; e = e.parent) if (e.index < 0) {
		let a = e.parent;
		(i ||= [r]).push(a.resolve(t, n)), e = a;
	} else {
		let a = W_.get(e.tree);
		if (a && a.overlay && a.overlay[0].from <= t && a.overlay[a.overlay.length - 1].to >= t) {
			let o = new tv(a.tree, a.overlay[0].from + e.from, -1, e);
			(i ||= [r]).push(M_(o, t, n, !1));
		}
	}
	return i ? F_(i) : r;
}
function L_(e) {
	return e.children.some((e) => e instanceof $_ || !e.type.isAnonymous || L_(e));
}
function R_(e) {
	let { buffer: t, nodeSet: n, maxBufferLength: r = V_, reused: i = [], minRepeatType: a = n.types.length } = e, o = Array.isArray(t) ? new Q_(t, t.length) : t, s = n.types, c = 0, l = 0;
	function u(e, t, _, v, y, b) {
		let { id: x, start: S, end: C, size: w } = o, ee = l, te = c;
		if (w < 0) if (o.next(), w == -1) {
			let t = i[x];
			_.push(t), v.push(S - e);
			return;
		} else if (w == -3) {
			c = x;
			return;
		} else if (w == -4) {
			l = x;
			return;
		} else throw RangeError(`Unrecognized record size: ${w}`);
		let ne = s[x], T, re, ie = S - e;
		if (C - S <= r && (re = h(o.pos - t, y))) {
			let t = new Uint16Array(re.size - re.skip), r = o.pos - re.size, i = t.length;
			for (; o.pos > r;) i = g(re.start, t, i);
			T = new $_(t, C - re.start, n), ie = re.start - e;
		} else {
			let e = o.pos - w;
			o.next();
			let t = [], n = [], i = x >= a ? x : -1, s = 0, c = C;
			for (; o.pos > e;) i >= 0 && o.id == i && o.size >= 0 ? (o.end <= c - r && (p(t, n, S, s, o.end, c, i, ee, te), s = t.length, c = o.end), o.next()) : b > 2500 ? d(S, e, t, n) : u(S, e, t, n, i, b + 1);
			if (i >= 0 && s > 0 && s < t.length && p(t, n, S, s, S, c, i, ee, te), t.reverse(), n.reverse(), i > -1 && s > 0) {
				let e = f(ne, te);
				T = B_(ne, t, n, 0, t.length, 0, C - S, e, e);
			} else T = m(ne, t, n, C - S, ee - C, te);
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
			i.push(new $_(t, s[2] - r, n)), a.push(r - e);
		}
	}
	function f(e, t) {
		return (n, r, i) => {
			let a = 0, o = n.length - 1, s, c;
			if (o >= 0 && (s = n[o]) instanceof Z_) {
				if (!o && s.type == e && s.length == i) return s;
				(c = s.prop(Z.lookAhead)) && (a = r[o] + s.length + c);
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
		return new Z_(e, t, n, r, o);
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
				if (n.size < 0) if (n.size == -3 || n.size == -4) d += 4;
				else break scan;
				else n.id >= a && (d += 4);
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
	return new Z_(s[e.topID], _.reverse(), v.reverse(), y);
}
function z_(e, t) {
	if (!e.isAnonymous || t instanceof $_ || t.type != e) return 1;
	let n = ov.get(t);
	if (n == null) {
		n = 1;
		for (let r of t.children) {
			if (r.type != e || !(r instanceof Z_)) {
				n = 1;
				break;
			}
			n += z_(e, r);
		}
		ov.set(t, n);
	}
	return n;
}
function B_(e, t, n, r, i, a, o, s, c) {
	let l = 0;
	for (let n = r; n < i; n++) l += z_(e, t[n]);
	let u = Math.ceil(l * 1.5 / 8), d = [], f = [];
	function p(t, n, r, i, o) {
		for (let s = r; s < i;) {
			let r = s, l = n[s], m = z_(e, t[s]);
			for (s++; s < i; s++) {
				let n = z_(e, t[s]);
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
				d.push(B_(e, t, n, r, s, l, i, null, c));
			}
			f.push(l + o - a);
		}
	}
	return p(t, n, r, i, 0), (s || c)(d, f, o);
}
var V_, H_, U_, Z, W_, G_, K_, q_, J_, Y_, X_, Z_, Q_, $_, ev, tv, nv, rv, iv, av, ov, sv, cv, lv, uv, dv = t((() => {
	V_ = 1024, H_ = 0, U_ = class {
		constructor(e, t) {
			this.from = e, this.to = t;
		}
	}, Z = class {
		constructor(e = {}) {
			this.id = H_++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
				throw Error("This node type doesn't define a deserialize function");
			}), this.combine = e.combine || null;
		}
		add(e) {
			if (this.perNode) throw RangeError("Can't add per-node props to node types");
			return typeof e != "function" && (e = K_.match(e)), (t) => {
				let n = e(t);
				return n === void 0 ? null : [this, n];
			};
		}
	}, Z.closedBy = new Z({ deserialize: (e) => e.split(" ") }), Z.openedBy = new Z({ deserialize: (e) => e.split(" ") }), Z.group = new Z({ deserialize: (e) => e.split(" ") }), Z.isolate = new Z({ deserialize: (e) => {
		if (e && e != "rtl" && e != "ltr" && e != "auto") throw RangeError("Invalid value for isolate: " + e);
		return e || "auto";
	} }), Z.contextHash = new Z({ perNode: !0 }), Z.lookAhead = new Z({ perNode: !0 }), Z.mounted = new Z({ perNode: !0 }), W_ = class {
		constructor(e, t, n, r = !1) {
			this.tree = e, this.overlay = t, this.parser = n, this.bracketed = r;
		}
		static get(e) {
			return e && e.props && e.props[Z.mounted.id];
		}
	}, G_ = Object.create(null), K_ = class e {
		constructor(e, t, n, r = 0) {
			this.name = e, this.props = t, this.id = n, this.flags = r;
		}
		static define(t) {
			let n = t.props && t.props.length ? Object.create(null) : G_, r = !!t.top | (t.skipped ? 2 : 0) | (t.error ? 4 : 0) | (t.name == null ? 8 : 0), i = new e(t.name || "", n, t.id, r);
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
	}, K_.none = new K_("", Object.create(null), 0, 8), q_ = class e {
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
				n.push(r ? new K_(e.name, r, e.id, e.flags) : e);
			}
			return new e(n);
		}
	}, J_ = /* @__PURE__ */ new WeakMap(), Y_ = /* @__PURE__ */ new WeakMap(), (function(e) {
		e[e.ExcludeBuffers = 1] = "ExcludeBuffers", e[e.IncludeAnonymous = 2] = "IncludeAnonymous", e[e.IgnoreMounts = 4] = "IgnoreMounts", e[e.IgnoreOverlays = 8] = "IgnoreOverlays", e[e.EnterBracketed = 16] = "EnterBracketed";
	})(X_ ||= {}), Z_ = class e {
		constructor(e, t, n, r, i) {
			if (this.type = e, this.children = t, this.positions = n, this.length = r, this.props = null, i && i.length) {
				this.props = Object.create(null);
				for (let [e, t] of i) this.props[typeof e == "number" ? e : e.id] = t;
			}
		}
		toString() {
			let e = W_.get(this);
			if (e && !e.overlay) return e.tree.toString();
			let t = "";
			for (let e of this.children) {
				let n = e.toString();
				n && (t && (t += ","), t += n);
			}
			return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
		}
		cursor(e = 0) {
			return new av(this.topNode, e);
		}
		cursorAt(e, t = 0, n = 0) {
			let r = J_.get(this) || this.topNode, i = new av(r);
			return i.moveTo(e, t), J_.set(this, i._tree), i;
		}
		get topNode() {
			return new tv(this, 0, 0, null);
		}
		resolve(e, t = 0) {
			let n = M_(J_.get(this) || this.topNode, e, t, !1);
			return J_.set(this, n), n;
		}
		resolveInner(e, t = 0) {
			let n = M_(Y_.get(this) || this.topNode, e, t, !0);
			return Y_.set(this, n), n;
		}
		resolveStack(e, t = 0) {
			return I_(this, e, t);
		}
		iterate(e) {
			let { enter: t, leave: n, from: r = 0, to: i = this.length } = e, a = e.mode || 0, o = (a & X_.IncludeAnonymous) > 0;
			for (let e = this.cursor(a | X_.IncludeAnonymous);;) {
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
			return this.children.length <= 8 ? this : B_(K_.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, n, r) => new e(this.type, t, n, r, this.propValues), t.makeTree || ((t, n, r) => new e(K_.none, t, n, r)));
		}
		static build(e) {
			return R_(e);
		}
	}, Z_.empty = new Z_(K_.none, [], [], 0), Q_ = class e {
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
	}, $_ = class e {
		constructor(e, t, n) {
			this.buffer = e, this.length = t, this.set = n;
		}
		get type() {
			return K_.none;
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
			for (let s = e; s != t && !(j_(i, r, a[s + 1], a[s + 2]) && (o = s, n > 0)); s = a[s + 3]);
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
	}, ev = class {
		cursor(e = 0) {
			return new av(this, e);
		}
		getChild(e, t = null, n = null) {
			let r = N_(this, e, t, n);
			return r.length ? r[0] : null;
		}
		getChildren(e, t = null, n = null) {
			return N_(this, e, t, n);
		}
		resolve(e, t = 0) {
			return M_(this, e, t, !1);
		}
		resolveInner(e, t = 0) {
			return M_(this, e, t, !0);
		}
		matchContext(e) {
			return P_(this.parent, e);
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
	}, tv = class e extends ev {
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
					if (!(!(a & X_.EnterBracketed && l instanceof Z_ && (d = W_.get(l)) && !d.overlay && d.bracketed && r >= u && r <= u + l.length) && !j_(i, r, u, u + l.length))) {
						if (l instanceof $_) {
							if (a & X_.ExcludeBuffers) continue;
							let e = l.findChild(0, l.buffer.length, n, r - u, i);
							if (e > -1) return new rv(new nv(o, l, t, u), null, e);
						} else if (a & X_.IncludeAnonymous || !l.type.isAnonymous || L_(l)) {
							let s;
							if (!(a & X_.IgnoreMounts) && (s = W_.get(l)) && !s.overlay) return new e(s.tree, u, t, o);
							let c = new e(l, u, t, o);
							return a & X_.IncludeAnonymous || !c.type.isAnonymous ? c : c.nextChild(n < 0 ? l.children.length - 1 : 0, n, r, i, a);
						}
					}
				}
				if (a & X_.IncludeAnonymous || !o.type.isAnonymous || (t = o.index >= 0 ? o.index + n : n < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o)) return null;
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
			if (!(r & X_.IgnoreOverlays) && (i = W_.get(this._tree)) && i.overlay) {
				let a = t - this.from, o = r & X_.EnterBracketed && i.bracketed;
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
	}, nv = class {
		constructor(e, t, n, r) {
			this.parent = e, this.buffer = t, this.index = n, this.start = r;
		}
	}, rv = class e extends ev {
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
			if (r & X_.ExcludeBuffers) return null;
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
			return new Z_(this.type, e, t, this.to - this.from);
		}
		toString() {
			return this.context.buffer.childString(this.index);
		}
	}, iv = class {
		constructor(e, t) {
			this.heads = e, this.node = t;
		}
		get next() {
			return F_(this.heads);
		}
	}, av = class {
		get name() {
			return this.type.name;
		}
		constructor(e, t = 0) {
			if (this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, this.mode = t & ~X_.EnterBracketed, e instanceof tv) this.yieldNode(e);
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
			return e ? e instanceof tv ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
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
			return this.buffer ? n & X_.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, n));
		}
		parent() {
			if (!this.buffer) return this.yieldNode(this.mode & X_.IncludeAnonymous ? this._tree._parent : this._tree.parent);
			if (this.stack.length) return this.yieldBuf(this.stack.pop());
			let e = this.mode & X_.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
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
				if (this.mode & X_.IncludeAnonymous || e instanceof $_ || !e.type.isAnonymous || L_(e)) return !1;
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
			for (let e = n; e < this.stack.length; e++) t = new rv(this.buffer, t, this.stack[e]);
			return this.bufferNode = new rv(this.buffer, t, this.index);
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
			if (!this.buffer) return P_(this.node.parent, e);
			let { buffer: t } = this.buffer, { types: n } = t.set;
			for (let r = e.length - 1, i = this.stack.length - 1; r >= 0; i--) {
				if (i < 0) return P_(this._tree, e, r);
				let a = n[t.buffer[this.stack[i]]];
				if (!a.isAnonymous) {
					if (e[r] && e[r] != a.name) return !1;
					r--;
				}
			}
			return !0;
		}
	}, ov = /* @__PURE__ */ new WeakMap(), sv = class {
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
			e instanceof rv ? this.setBuffer(e.context.buffer, e.index, t) : e instanceof tv && this.map.set(e.tree, t);
		}
		get(e) {
			return e instanceof rv ? this.getBuffer(e.context.buffer, e.index) : e instanceof tv ? this.map.get(e.tree) : void 0;
		}
		cursorSet(e, t) {
			e.buffer ? this.setBuffer(e.buffer.buffer, e.index, t) : this.map.set(e.tree, t);
		}
		cursorGet(e) {
			return e.buffer ? this.getBuffer(e.buffer.buffer, e.index) : this.map.get(e.tree);
		}
	}, cv = class e {
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
	}, lv = class {
		startParse(e, t, n) {
			return typeof e == "string" && (e = new uv(e)), n = n ? n.length ? n.map((e) => new U_(e.from, e.to)) : [new U_(0, 0)] : [new U_(0, e.length)], this.createParse(e, t || [], n);
		}
		parse(e, t, n) {
			let r = this.startParse(e, t, n);
			for (;;) {
				let e = r.advance();
				if (e) return e;
			}
		}
	}, uv = class {
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
})), fv = /* @__PURE__ */ n({
	Tag: () => Sv,
	classHighlighter: () => Hv,
	getStyleTags: () => bv,
	highlightCode: () => yv,
	highlightTree: () => vv,
	styleTags: () => hv,
	tagHighlighter: () => gv,
	tags: () => $
});
function pv(e, t) {
	return e.length == t.length && e.every((e, n) => e == t[n]);
}
function mv(e) {
	let t = [[]];
	for (let n = 0; n < e.length; n++) for (let r = 0, i = t.length; r < i; r++) t.push(t[r].concat(e[n]));
	return t.sort((e, t) => t.length - e.length);
}
function hv(e) {
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
			t[s] = new Ev(r, i, o > 0 ? n.slice(0, o) : null).sort(t[s]);
		}
	}
	return Tv.add(t);
}
function gv(e, t) {
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
function _v(e, t) {
	let n = null;
	for (let r of e) {
		let e = r.style(t);
		e && (n = n ? n + " " + e : e);
	}
	return n;
}
function vv(e, t, n, r = 0, i = e.length) {
	let a = new Dv(r, Array.isArray(t) ? t : [t], n);
	a.highlightRange(e.cursor(), r, i, "", a.highlighters), a.flush(i);
}
function yv(e, t, n, r, i, a = 0, o = e.length) {
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
	vv(t, n, (e, t, n) => {
		c(e, ""), c(t, n);
	}, a, o), c(o, "");
}
function bv(e) {
	let t = e.type.prop(Tv);
	for (; t && t.context && !e.matchContext(t.context);) t = t.next;
	return t || null;
}
var xv, Sv, Cv, wv, Tv, Ev, Dv, Q, Ov, kv, Av, jv, Mv, Nv, Pv, Fv, Iv, Lv, Rv, zv, Bv, Vv, $, Hv, Uv = t((() => {
	dv(), xv = 0, Sv = class e {
		constructor(e, t, n, r) {
			this.name = e, this.set = t, this.base = n, this.modified = r, this.id = xv++;
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
			let t = new wv(e);
			return (e) => e.modified.indexOf(t) > -1 ? e : wv.get(e.base || e, e.modified.concat(t).sort((e, t) => e.id - t.id));
		}
	}, Cv = 0, wv = class e {
		constructor(e) {
			this.name = e, this.instances = [], this.id = Cv++;
		}
		static get(t, n) {
			if (!n.length) return t;
			let r = n[0].instances.find((e) => e.base == t && pv(n, e.modified));
			if (r) return r;
			let i = [], a = new Sv(t.name, i, t, n);
			for (let e of n) e.instances.push(a);
			let o = mv(n);
			for (let n of t.set) if (!n.modified.length) for (let t of o) i.push(e.get(n, t));
			return a;
		}
	}, Tv = new Z({ combine(e, t) {
		let n, r, i;
		for (; e || t;) {
			if (!e || t && e.depth >= t.depth ? (i = t, t = t.next) : (i = e, e = e.next), n && n.mode == i.mode && !i.context && !n.context) continue;
			let a = new Ev(i.tags, i.mode, i.context);
			n ? n.next = a : r = a, n = a;
		}
		return r;
	} }), Ev = class {
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
	}, Ev.empty = new Ev([], 2, null), Dv = class {
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
			let c = r, l = bv(e) || Ev.empty, u = _v(i, l.tags);
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
				do {
					if (e.to <= t) continue;
					if (e.from >= n) break;
					this.highlightRange(e, t, n, r, i), this.startSpan(Math.min(n, e.to), c);
				} while (e.nextSibling());
				e.parent();
			}
		}
	}, Q = Sv.define, Ov = Q(), kv = Q(), Av = Q(kv), jv = Q(kv), Mv = Q(), Nv = Q(Mv), Pv = Q(Mv), Fv = Q(), Iv = Q(Fv), Lv = Q(), Rv = Q(), zv = Q(), Bv = Q(zv), Vv = Q(), $ = {
		comment: Ov,
		lineComment: Q(Ov),
		blockComment: Q(Ov),
		docComment: Q(Ov),
		name: kv,
		variableName: Q(kv),
		typeName: Av,
		tagName: Q(Av),
		propertyName: jv,
		attributeName: Q(jv),
		className: Q(kv),
		labelName: Q(kv),
		namespace: Q(kv),
		macroName: Q(kv),
		literal: Mv,
		string: Nv,
		docString: Q(Nv),
		character: Q(Nv),
		attributeValue: Q(Nv),
		number: Pv,
		integer: Q(Pv),
		float: Q(Pv),
		bool: Q(Mv),
		regexp: Q(Mv),
		escape: Q(Mv),
		color: Q(Mv),
		url: Q(Mv),
		keyword: Lv,
		self: Q(Lv),
		null: Q(Lv),
		atom: Q(Lv),
		unit: Q(Lv),
		modifier: Q(Lv),
		operatorKeyword: Q(Lv),
		controlKeyword: Q(Lv),
		definitionKeyword: Q(Lv),
		moduleKeyword: Q(Lv),
		operator: Rv,
		derefOperator: Q(Rv),
		arithmeticOperator: Q(Rv),
		logicOperator: Q(Rv),
		bitwiseOperator: Q(Rv),
		compareOperator: Q(Rv),
		updateOperator: Q(Rv),
		definitionOperator: Q(Rv),
		typeOperator: Q(Rv),
		controlOperator: Q(Rv),
		punctuation: zv,
		separator: Q(zv),
		bracket: Bv,
		angleBracket: Q(Bv),
		squareBracket: Q(Bv),
		paren: Q(Bv),
		brace: Q(Bv),
		content: Fv,
		heading: Iv,
		heading1: Q(Iv),
		heading2: Q(Iv),
		heading3: Q(Iv),
		heading4: Q(Iv),
		heading5: Q(Iv),
		heading6: Q(Iv),
		contentSeparator: Q(Fv),
		list: Q(Fv),
		quote: Q(Fv),
		emphasis: Q(Fv),
		strong: Q(Fv),
		link: Q(Fv),
		monospace: Q(Fv),
		strikethrough: Q(Fv),
		inserted: Q(),
		deleted: Q(),
		changed: Q(),
		invalid: Q(),
		meta: Vv,
		documentMeta: Q(Vv),
		annotation: Q(Vv),
		processingInstruction: Q(Vv),
		definition: Sv.defineModifier("definition"),
		constant: Sv.defineModifier("constant"),
		function: Sv.defineModifier("function"),
		standard: Sv.defineModifier("standard"),
		local: Sv.defineModifier("local"),
		special: Sv.defineModifier("special")
	};
	for (let e in $) {
		let t = $[e];
		t instanceof Sv && (t.name = e);
	}
	Hv = gv([
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
})), Wv = /* @__PURE__ */ n({
	DocInput: () => sb,
	HighlightStyle: () => Hb,
	IndentContext: () => yb,
	LRLanguage: () => ob,
	Language: () => ab,
	LanguageDescription: () => gb,
	LanguageSupport: () => hb,
	ParseContext: () => lb,
	StreamLanguage: () => ix,
	StringStream: () => nx,
	TreeIndentContext: () => xb,
	bidiIsolates: () => eb,
	bracketMatching: () => Fy,
	bracketMatchingHandle: () => tx,
	codeFolding: () => Dy,
	continuedIndent: () => fy,
	defaultHighlightStyle: () => qb,
	defineLanguageFacet: () => Gv,
	delimitedIndent: () => uy,
	ensureSyntaxTree: () => Jv,
	flatIndent: () => Sb,
	foldAll: () => jb,
	foldCode: () => kb,
	foldEffect: () => Eb,
	foldGutter: () => ky,
	foldInside: () => my,
	foldKeymap: () => Pb,
	foldNodeProp: () => Tb,
	foldService: () => wb,
	foldState: () => Ob,
	foldable: () => _y,
	foldedRanges: () => xy,
	forceParsing: () => Xv,
	getIndentUnit: () => $v,
	getIndentation: () => ty,
	highlightingFor: () => My,
	indentNodeProp: () => bb,
	indentOnInput: () => py,
	indentRange: () => ny,
	indentService: () => _b,
	indentString: () => ey,
	indentUnit: () => vb,
	language: () => mb,
	languageDataProp: () => rb,
	matchBrackets: () => Ry,
	sublanguageProp: () => ib,
	syntaxHighlighting: () => jy,
	syntaxParserRunning: () => Zv,
	syntaxTree: () => qv,
	syntaxTreeAvailable: () => Yv,
	toggleFold: () => Nb,
	unfoldAll: () => Mb,
	unfoldCode: () => Ab,
	unfoldEffect: () => Db
});
function Gv(e) {
	return q.define({ combine: e ? (t) => t.concat(e) : void 0 });
}
function Kv(e, t, n) {
	let r = e.facet(mb), i = qv(e).topNode;
	if (!r || r.allowsNesting) for (let e = i; e; e = e.enter(t, n, X_.ExcludeBuffers | X_.EnterBracketed)) e.type.isTop && (i = e);
	return i;
}
function qv(e) {
	let t = e.field(ab.state, !1);
	return t ? t.tree : Z_.empty;
}
function Jv(e, t, n = 50) {
	let r = e.field(ab.state, !1)?.context;
	if (!r) return null;
	let i = r.viewport;
	r.updateViewport({
		from: 0,
		to: t
	});
	let a = r.isDone(t) || r.work(n, t) ? r.tree : null;
	return r.updateViewport(i), a;
}
function Yv(e, t = e.doc.length) {
	return e.field(ab.state, !1)?.context.isDone(t) || !1;
}
function Xv(e, t = e.viewport.to, n = 100) {
	let r = Jv(e.state, t, n);
	return r != qv(e.state) && e.dispatch({}), !!r;
}
function Zv(e) {
	return e.plugin(pb)?.isWorking() || !1;
}
function Qv(e, t, n) {
	return cv.applyChanges(e, [{
		fromA: t,
		toA: n,
		fromB: t,
		toB: n
	}]);
}
function $v(e) {
	let t = e.facet(vb);
	return t.charCodeAt(0) == 9 ? e.tabSize * t.length : t.length;
}
function ey(e, t) {
	let n = "", r = e.tabSize, i = e.facet(vb)[0];
	if (i == "	") {
		for (; t >= r;) n += "	", t -= r;
		i = " ";
	}
	for (let e = 0; e < t; e++) n += i;
	return n;
}
function ty(e, t) {
	e instanceof wl && (e = new yb(e));
	for (let n of e.state.facet(_b)) {
		let r = n(e, t);
		if (r !== void 0) return r;
	}
	let n = qv(e.state);
	return n.length >= t ? ry(e, n, t) : null;
}
function ny(e, t, n) {
	let r = Object.create(null), i = new yb(e, { overrideIndentation: (e) => r[e] ?? -1 }), a = [];
	for (let o = t; o <= n;) {
		let t = e.doc.lineAt(o);
		o = t.to + 1;
		let n = ty(i, t.from);
		if (n == null) continue;
		/\S/.test(t.text) || (n = 0);
		let s = /^\s*/.exec(t.text)[0], c = ey(e, n);
		s != c && (r[t.from] = n, a.push({
			from: t.from,
			to: t.from + s.length,
			insert: c
		}));
	}
	return e.changes(a);
}
function ry(e, t, n) {
	let r = t.resolveStack(n), i = t.resolveInner(n, -1).resolve(n, 0).enterUnfinishedNodesBefore(n);
	if (i != r.node) {
		let e = [];
		for (let t = i; t && !(t.from < r.node.from || t.to > r.node.to || t.from == r.node.from && t.type == r.node.type); t = t.parent) e.push(t);
		for (let t = e.length - 1; t >= 0; t--) r = {
			node: e[t],
			next: r
		};
	}
	return iy(r, e, n);
}
function iy(e, t, n) {
	for (let r = e; r; r = r.next) {
		let e = oy(r.node);
		if (e) return e(xb.create(t, n, r));
	}
	return 0;
}
function ay(e) {
	return e.pos == e.options.simulateBreak && e.options.simulateDoubleBreak;
}
function oy(e) {
	let t = e.type.prop(bb);
	if (t) return t;
	let n = e.firstChild, r;
	if (n && (r = n.type.prop(Z.closedBy))) {
		let t = e.lastChild, n = t && r.indexOf(t.name) > -1;
		return (e) => dy(e, !0, 1, void 0, n && !ay(e) ? t.from : void 0);
	}
	return e.parent == null ? sy : null;
}
function sy() {
	return 0;
}
function cy(e, t) {
	for (let n = t; n; n = n.parent) if (e == n) return !0;
	return !1;
}
function ly(e) {
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
function uy({ closing: e, align: t = !0, units: n = 1 }) {
	return (r) => dy(r, t, n, e);
}
function dy(e, t, n, r, i) {
	let a = e.textAfter, o = a.match(/^\s*/)[0].length, s = r && a.slice(o, o + r.length) == r || i == e.pos + o, c = t ? ly(e) : null;
	return c ? s ? e.column(c.from) : e.column(c.to) : e.baseIndent + (s ? 0 : e.unit * n);
}
function fy({ except: e, units: t = 1 } = {}) {
	return (n) => {
		let r = e && e.test(n.textAfter);
		return n.baseIndent + (r ? 0 : t * n.unit);
	};
}
function py() {
	return wl.transactionFilter.of((e) => {
		if (!e.docChanged || !e.isUserEvent("input.type") && !e.isUserEvent("input.complete")) return e;
		let t = e.startState.languageDataAt("indentOnInput", e.startState.selection.main.head);
		if (!t.length) return e;
		let n = e.newDoc, { head: r } = e.newSelection.main, i = n.lineAt(r);
		if (r > i.from + Cb) return e;
		let a = n.sliceString(i.from, r);
		if (!t.some((e) => e.test(a))) return e;
		let { state: o } = e, s = -1, c = [];
		for (let { head: e } of o.selection.ranges) {
			let t = o.doc.lineAt(e);
			if (t.from == s) continue;
			s = t.from;
			let n = ty(o, t.from);
			if (n == null) continue;
			let r = /^\s*/.exec(t.text)[0], i = ey(o, n);
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
function my(e) {
	let t = e.firstChild, n = e.lastChild;
	return t && t.to < n.from ? {
		from: t.to,
		to: n.type.isError ? e.to : n.from
	} : null;
}
function hy(e, t, n) {
	let r = qv(e);
	if (r.length < n) return null;
	let i = r.resolveStack(n, 1), a = null;
	for (let o = i; o; o = o.next) {
		let i = o.node;
		if (i.to <= n || i.from > n) continue;
		if (a && i.from < t) break;
		let s = i.type.prop(Tb);
		if (s && (i.to < r.length - 50 || r.length == e.doc.length || !gy(i))) {
			let r = s(i, e);
			r && r.from <= n && r.from >= t && r.to > n && (a = r);
		}
	}
	return a;
}
function gy(e) {
	let t = e.lastChild;
	return t && t.to == e.to && t.type.isError;
}
function _y(e, t, n) {
	for (let r of e.facet(wb)) {
		let i = r(e, t, n);
		if (i) return i;
	}
	return hy(e, t, n);
}
function vy(e, t) {
	let n = t.mapPos(e.from, 1), r = t.mapPos(e.to, -1);
	return n >= r ? void 0 : {
		from: n,
		to: r
	};
}
function yy(e) {
	let t = [];
	for (let { head: n } of e.state.selection.ranges) t.some((e) => e.from <= n && e.to >= n) || t.push(e.lineBlockAt(n));
	return t;
}
function by(e, t, n = t) {
	let r = !1;
	return e.between(t, n, (e, i) => {
		e < n && i > t && (r = !0);
	}), r ? e.update({
		filterFrom: t,
		filterTo: n,
		filter: (e, r) => e >= n || r <= t
	}) : e;
}
function xy(e) {
	return e.field(Ob, !1) || Ol.empty;
}
function Sy(e, t, n) {
	var r;
	let i = null;
	return (r = e.field(Ob, !1)) == null || r.between(t, n, (e, t) => {
		(!i || i.from > e) && (i = {
			from: e,
			to: t
		});
	}), i;
}
function Cy(e, t, n) {
	let r = !1;
	return e.between(t, t, (e, i) => {
		e == t && i == n && (r = !0);
	}), r;
}
function wy(e, t) {
	return e.field(Ob, !1) ? t : t.concat(vl.appendConfig.of(Dy()));
}
function Ty(e, t, n = !0) {
	let r = e.state.doc.lineAt(t.from).number, i = e.state.doc.lineAt(t.to).number;
	return X.announce.of(`${e.state.phrase(n ? "Folded lines" : "Unfolded lines")} ${r} ${e.state.phrase("to")} ${i}.`);
}
function Ey(e, t) {
	for (let n = t;;) {
		let r = _y(e.state, n.from, n.to);
		if (r && r.to > t.from) return r;
		if (!n.from) return null;
		n = e.lineBlockAt(n.from - 1);
	}
}
function Dy(e) {
	let t = [Ob, Vb];
	return e && t.push(Ib.of(e)), t;
}
function Oy(e, t) {
	let { state: n } = e, r = n.facet(Ib), i = (t) => {
		let n = e.lineBlockAt(e.posAtDOM(t.target)), r = Sy(e.state, n.from, n.to);
		r && e.dispatch({ effects: Db.of(r) }), t.preventDefault();
	};
	if (r.placeholderDOM) return r.placeholderDOM(e, i, t);
	let a = document.createElement("span");
	return a.textContent = r.placeholderText, a.setAttribute("aria-label", n.phrase("folded code")), a.title = n.phrase("unfold"), a.className = "cm-foldPlaceholder", a.onclick = i, a;
}
function ky(e = {}) {
	let t = {
		...zb,
		...e
	}, n = new Bb(t, !0), r = new Bb(t, !1), i = vm.fromClass(class {
		constructor(e) {
			this.from = e.viewport.from, this.markers = this.buildMarkers(e);
		}
		update(e) {
			(e.docChanged || e.viewportChanged || e.startState.facet(mb) != e.state.facet(mb) || e.startState.field(Ob, !1) != e.state.field(Ob, !1) || qv(e.startState) != qv(e.state) || t.foldingChanged(e)) && (this.markers = this.buildMarkers(e.view));
		}
		buildMarkers(e) {
			let t = new kl();
			for (let i of e.viewportLineBlocks) {
				let a = Sy(e.state, i.from, i.to) ? r : _y(e.state, i.from, i.to) ? n : null;
				a && t.add(i.from, i.from, a);
			}
			return t.finish();
		}
	}), { domEventHandlers: a } = t;
	return [
		i,
		lp({
			class: "cm-foldGutter",
			markers(e) {
				return e.plugin(i)?.markers || Ol.empty;
			},
			initialSpacer() {
				return new Bb(t, !1);
			},
			domEventHandlers: {
				...a,
				click: (e, t, n) => {
					if (a.click && a.click(e, t, n)) return !0;
					let r = Sy(e.state, t.from, t.to);
					if (r) return e.dispatch({ effects: Db.of(r) }), !0;
					let i = _y(e.state, t.from, t.to);
					return i ? (e.dispatch({ effects: Eb.of(i) }), !0) : !1;
				}
			}
		}),
		Dy()
	];
}
function Ay(e) {
	let t = e.facet(Ub);
	return t.length ? t : e.facet(Wb);
}
function jy(e, t) {
	let n = [Kb], r;
	return e instanceof Hb && (e.module && n.push(X.styleModule.of(e.module)), r = e.themeType), t?.fallback ? n.push(Wb.of(e)) : r ? n.push(Ub.computeN([X.darkTheme], (t) => t.facet(X.darkTheme) == (r == "dark") ? [e] : [])) : n.push(Ub.of(e)), n;
}
function My(e, t, n) {
	let r = Ay(e), i = null;
	if (r) {
		for (let e of r) if (!e.scope || n && e.scope(n)) {
			let n = e.style(t);
			n && (i = i ? i + " " + n : n);
		}
	}
	return i;
}
function Ny(e) {
	let t = [], n = e.matched ? Qb : $b;
	return t.push(n.range(e.start.from, e.start.to)), e.end && t.push(n.range(e.end.from, e.end.to)), t;
}
function Py(e) {
	let t = [], n = e.facet(Zb);
	for (let r of e.selection.ranges) {
		if (!r.empty) continue;
		let i = Ry(e, r.head, -1, n) || r.head > 0 && Ry(e, r.head - 1, 1, n) || n.afterCursor && (Ry(e, r.head, 1, n) || r.head < e.doc.length && Ry(e, r.head + 1, -1, n));
		i && (t = t.concat(n.renderMatch(i, e)));
	}
	return Y.set(t, !0);
}
function Fy(e = {}) {
	return [Zb.of(e), ex];
}
function Iy(e, t, n) {
	let r = e.prop(t < 0 ? Z.openedBy : Z.closedBy);
	if (r) return r;
	if (e.name.length == 1) {
		let r = n.indexOf(e.name);
		if (r > -1 && r % 2 == +(t < 0)) return [n[r + t]];
	}
	return null;
}
function Ly(e) {
	let t = e.type.prop(tx);
	return t ? t(e.node) : e;
}
function Ry(e, t, n, r = {}) {
	let i = r.maxScanDistance || Yb, a = r.brackets || Xb, o = qv(e), s = o.resolveInner(t, n);
	for (let r = s; r; r = r.parent) {
		let i = Iy(r.type, n, a);
		if (i && r.from < r.to) {
			let o = Ly(r);
			if (o && (n > 0 ? t >= o.from && t < o.to : t > o.from && t <= o.to)) return zy(e, t, n, r, o, i, a);
		}
	}
	return By(e, t, n, o, s.type, i, a);
}
function zy(e, t, n, r, i, a, o) {
	let s = r.parent, c = {
		from: i.from,
		to: i.to
	}, l = 0, u = s?.cursor();
	if (u && (n < 0 ? u.childBefore(r.from) : u.childAfter(r.to))) do
		if (n < 0 ? u.to <= r.from : u.from >= r.to) {
			if (l == 0 && a.indexOf(u.type.name) > -1 && u.from < u.to) {
				let e = Ly(u);
				return {
					start: c,
					end: e ? {
						from: e.from,
						to: e.to
					} : void 0,
					matched: !0
				};
			} else if (Iy(u.type, n, o)) l++;
			else if (Iy(u.type, -n, o)) {
				if (l == 0) {
					let e = Ly(u);
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
function By(e, t, n, r, i, a, o) {
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
			if (!(t < 0 || r.resolveInner(s + e, 1).type != i)) if (t % 2 == 0 == n > 0) d++;
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
		n > 0 && (e += a.length);
	}
	return u.done ? {
		start: l,
		matched: !1
	} : null;
}
function Vy(e, t, n, r = 0, i = 0) {
	t ?? (t = e.search(/[^\s\u00a0]/), t == -1 && (t = e.length));
	let a = i;
	for (let i = r; i < t; i++) e.charCodeAt(i) == 9 ? a += n - a % n : a++;
	return a;
}
function Hy(e) {
	return {
		name: e.name || "",
		token: e.token,
		blankLine: e.blankLine || (() => {}),
		startState: e.startState || (() => !0),
		copyState: e.copyState || Uy,
		indent: e.indent || (() => null),
		languageData: e.languageData || {},
		tokenTable: e.tokenTable || ox,
		mergeTokens: e.mergeTokens !== !1
	};
}
function Uy(e) {
	if (typeof e != "object") return e;
	let t = {};
	for (let n in e) {
		let r = e[n];
		t[n] = r instanceof Array ? r.slice() : r;
	}
	return t;
}
function Wy(e, t, n, r, i) {
	let a = n >= r && n + t.length <= i && t.prop(e.stateAfter);
	if (a) return {
		state: e.streamParser.copyState(a),
		pos: n + t.length
	};
	for (let a = t.children.length - 1; a >= 0; a--) {
		let o = t.children[a], s = n + t.positions[a], c = o instanceof Z_ && s < i && Wy(e, o, s, r, i);
		if (c) return c;
	}
	return null;
}
function Gy(e, t, n, r, i) {
	if (i && n <= 0 && r >= t.length) return t;
	!i && n == 0 && t.type == e.topNode && (i = !0);
	for (let a = t.children.length - 1; a >= 0; a--) {
		let o = t.positions[a], s = t.children[a], c;
		if (o < r && s instanceof Z_) {
			if (!(c = Gy(e, s, n - o, r - o, i))) break;
			return i ? new Z_(t.type, t.children.slice(0, a).concat(c), t.positions.slice(0, a + 1), o + c.length) : c;
		}
	}
	return null;
}
function Ky(e, t, n, r, i) {
	for (let i of t) {
		let t = i.from + (i.openStart ? 25 : 0), a = i.to - (i.openEnd ? 25 : 0), o = t <= n && a > n && Wy(e, i.tree, 0 - i.offset, n, a), s;
		if (o && o.pos <= r && (s = Gy(e, i.tree, n + i.offset, o.pos + i.offset, !1))) return {
			state: o.state,
			tree: s
		};
	}
	return {
		state: e.streamParser.startState(i ? $v(i) : 4),
		tree: Z_.empty
	};
}
function qy(e, t, n) {
	t.start = t.pos;
	for (let r = 0; r < 10; r++) {
		let r = e(t, n);
		if (t.pos > t.start) return r;
	}
	throw Error("Stream parser failed to advance stream.");
}
function Jy(e, t) {
	lx.indexOf(e) > -1 || (lx.push(e), console.warn(t));
}
function Yy(e, t) {
	let n = [];
	for (let r of t.split(" ")) {
		let t = [];
		for (let n of r.split(".")) {
			let r = e[n] || $[n];
			r ? typeof r == "function" ? t.length ? t = t.map(r) : Jy(n, `Modifier ${n} used at start of tag`) : t.length ? Jy(n, `Tag ${n} used as modifier`) : t = Array.isArray(r) ? r : [r] : Jy(n, `Unknown highlighting tag ${n}`);
		}
		for (let e of t) n.push(e);
	}
	if (!n.length) return 0;
	let r = t.replace(/ /g, "_"), i = r + " " + n.map((e) => e.id), a = ux[i];
	if (a) return a.id;
	let o = ux[i] = K_.define({
		id: sx.length,
		name: r,
		props: [hv({ [r]: n })]
	});
	return sx.push(o), o.id;
}
function Xy(e, t) {
	let n = K_.define({
		id: sx.length,
		name: "Document",
		props: [rb.add(() => e), bb.add(() => (e) => t.getIndent(e))],
		top: !0
	});
	return sx.push(n), n;
}
function Zy(e) {
	return e.length <= 4096 && /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/.test(e);
}
function Qy(e) {
	for (let t = e.iter(); !t.next().done;) if (Zy(t.value)) return !0;
	return !1;
}
function $y(e) {
	let t = !1;
	return e.iterChanges((e, n, r, i, a) => {
		!t && Qy(a) && (t = !0);
	}), t;
}
function eb(e = {}) {
	let t = [hx];
	return e.alwaysIsolate && t.push(mx.of(!0)), t;
}
function tb(e, t, n) {
	let r = new kl(), i = e.visibleRanges;
	n || (i = nb(i, e.state.doc));
	for (let { from: e, to: n } of i) t.iterate({
		enter: (e) => {
			let t = e.type.prop(Z.isolate);
			t && r.add(e.from, e.to, gx[t]);
		},
		from: e,
		to: n
	});
	return r.finish();
}
function nb(e, t) {
	let n = t.iter(), r = 0, i = [], a = null;
	for (let { from: t, to: o } of e) if (!(a && a.to > t && (t = a.to, t >= o))) for (r + n.value.length < t && (n.next(t - (r + n.value.length)), r = t);;) {
		let e = r, t = r + n.value.length;
		if (!n.lineBreak && Zy(n.value) && (a && a.to > e - 10 ? a.to = Math.min(o, t) : i.push(a = {
			from: e,
			to: Math.min(o, t)
		})), t >= o) break;
		r = t, n.next();
	}
	return i;
}
var rb, ib, ab, ob, sb, cb, lb, ub, db, fb, pb, mb, hb, gb, _b, vb, yb, bb, xb, Sb, Cb, wb, Tb, Eb, Db, Ob, kb, Ab, jb, Mb, Nb, Pb, Fb, Ib, Lb, Rb, zb, Bb, Vb, Hb, Ub, Wb, Gb, Kb, qb, Jb, Yb, Xb, Zb, Qb, $b, ex, tx, nx, rx, ix, ax, ox, sx, cx, lx, ux, dx, fx, px, mx, hx, gx, _x = t((() => {
	dv(), Nl(), A_(), Uv(), Vl(), rb = /*@__PURE__*/ new Z(), ib = /*@__PURE__*/ new Z(), ab = class {
		constructor(e, t, n = [], r = "") {
			this.data = e, this.name = r, wl.prototype.hasOwnProperty("tree") || Object.defineProperty(wl.prototype, "tree", { get() {
				return qv(this);
			} }), this.parser = t, this.extension = [mb.of(this), wl.languageData.of((e, t, n) => {
				let r = Kv(e, t, n), i = r.type.prop(rb);
				if (!i) return [];
				let a = e.facet(i), o = r.type.prop(ib);
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
			return Kv(e, t, n).type.prop(rb) == this.data;
		}
		findRegions(e) {
			let t = e.facet(mb);
			if (t?.data == this.data) return [{
				from: 0,
				to: e.doc.length
			}];
			if (!t || !t.allowsNesting) return [];
			let n = [], r = (e, t) => {
				if (e.prop(rb) == this.data) {
					n.push({
						from: t,
						to: t + e.length
					});
					return;
				}
				let i = e.prop(Z.mounted);
				if (i) {
					if (i.tree.prop(rb) == this.data) {
						if (i.overlay) for (let e of i.overlay) n.push({
							from: e.from + t,
							to: e.to + t
						});
						else n.push({
							from: t,
							to: t + e.length
						});
						return;
					} else if (i.overlay) {
						let e = n.length;
						if (r(i.tree, i.overlay[0].from + t), n.length > e) return;
					}
				}
				for (let n = 0; n < e.children.length; n++) {
					let i = e.children[n];
					i instanceof Z_ && r(i, e.positions[n] + t);
				}
			};
			return r(qv(e), 0), n;
		}
		get allowsNesting() {
			return !0;
		}
	}, ab.setState = /*@__PURE__*/ vl.define(), ob = class e extends ab {
		constructor(e, t, n) {
			super(e, t, [], n), this.parser = t;
		}
		static define(t) {
			let n = Gv(t.languageData);
			return new e(n, t.parser.configure({ props: [rb.add((e) => e.isTop ? n : void 0)] }), t.name);
		}
		configure(t, n) {
			return new e(this.data, this.parser.configure(t), n || this.name);
		}
		get allowsNesting() {
			return this.parser.hasWrappers();
		}
	}, sb = class {
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
	}, cb = null, lb = class e {
		constructor(e, t, n = [], r, i, a, o, s) {
			this.parser = e, this.state = t, this.fragments = n, this.tree = r, this.treeLen = i, this.viewport = a, this.skipped = o, this.scheduleOn = s, this.parse = null, this.tempSkipped = [];
		}
		static create(t, n, r) {
			return new e(t, n, [], Z_.empty, 0, r, [], null);
		}
		startParse() {
			return this.parser.startParse(new sb(this.state.doc), this.fragments);
		}
		work(e, t) {
			return t != null && t >= this.state.doc.length && (t = void 0), this.tree != Z_.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
				if (typeof e == "number") {
					let t = Date.now() + e;
					e = () => Date.now() > t;
				}
				for (this.parse ||= this.startParse(), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t);;) {
					let n = this.parse.advance();
					if (n) if (this.fragments = this.withoutTempSkipped(cv.addTree(n, this.fragments, this.parse.stoppedAt != null)), this.treeLen = this.parse.stoppedAt ?? this.state.doc.length, this.tree = n, this.parse = null, this.treeLen < (t ?? this.state.doc.length)) this.parse = this.startParse();
					else return !0;
					if (e()) return !1;
				}
			});
		}
		takeTree() {
			let e, t;
			this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
				for (; !(t = this.parse.advance()););
			}), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(cv.addTree(this.tree, this.fragments, !0)), this.parse = null);
		}
		withContext(e) {
			let t = cb;
			cb = this;
			try {
				return e();
			} finally {
				cb = t;
			}
		}
		withoutTempSkipped(e) {
			for (let t; t = this.tempSkipped.pop();) e = Qv(e, t.from, t.to);
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
				})), r = cv.applyChanges(r, e), i = Z_.empty, a = 0, o = {
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
				n < e.to && r > e.from && (this.fragments = Qv(this.fragments, n, r), this.skipped.splice(t--, 1));
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
			return new class extends lv {
				createParse(t, n, r) {
					let i = r[0].from, a = r[r.length - 1].to;
					return {
						parsedPos: i,
						advance() {
							let t = cb;
							if (t) {
								for (let e of r) t.tempSkipped.push(e);
								e && (t.scheduleOn = t.scheduleOn ? Promise.all([t.scheduleOn, e]) : e);
							}
							return this.parsedPos = a, new Z_(K_.none, [], [], a - i);
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
			return cb;
		}
	}, ub = class e {
		constructor(e) {
			this.context = e, this.tree = e.tree;
		}
		apply(t) {
			if (!t.docChanged && this.tree == this.context.tree) return this;
			let n = this.context.changes(t.changes, t.state), r = this.context.treeLen == t.startState.doc.length ? void 0 : Math.max(t.changes.mapPos(this.context.treeLen), n.viewport.to);
			return n.work(20, r) || n.takeTree(), new e(n);
		}
		static init(t) {
			let n = Math.min(3e3, t.doc.length), r = lb.create(t.facet(mb).parser, t, {
				from: 0,
				to: n
			});
			return r.work(20, n) || r.takeTree(), new e(r);
		}
	}, ab.state = /*@__PURE__*/ tl.define({
		create: ub.init,
		update(e, t) {
			for (let e of t.effects) if (e.is(ab.setState)) return e.value;
			return t.startState.facet(mb) == t.state.facet(mb) ? e.apply(t) : ub.init(t.state);
		}
	}), db = (e) => {
		let t = setTimeout(() => e(), 500);
		return () => clearTimeout(t);
	}, typeof requestIdleCallback < "u" && (db = (e) => {
		let t = -1, n = setTimeout(() => {
			t = requestIdleCallback(e, { timeout: 400 });
		}, 100);
		return () => t < 0 ? clearTimeout(n) : cancelIdleCallback(t);
	}), fb = typeof navigator < "u" && navigator.scheduling?.isInputPending ? () => navigator.scheduling.isInputPending() : null, pb = /*@__PURE__*/ vm.fromClass(class {
		constructor(e) {
			this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
		}
		update(e) {
			let t = this.view.state.field(ab.state).context;
			(t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
		}
		scheduleWork() {
			if (this.working) return;
			let { state: e } = this.view, t = e.field(ab.state);
			(t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = db(this.work));
		}
		work(e) {
			this.working = null;
			let t = Date.now();
			if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0) return;
			let { state: n, viewport: { to: r } } = this.view, i = n.field(ab.state);
			if (i.tree == i.context.tree && i.context.isDone(r + 1e5)) return;
			let a = Date.now() + Math.min(this.chunkBudget, 100, e && !fb ? Math.max(25, e.timeRemaining() - 5) : 1e9), o = i.context.treeLen < r && n.doc.length > r + 1e3, s = i.context.work(() => fb && fb() || Date.now() > a, r + (o ? 0 : 1e5));
			this.chunkBudget -= Date.now() - t, (s || this.chunkBudget <= 0) && (i.context.takeTree(), this.view.dispatch({ effects: ab.setState.of(new ub(i.context)) })), this.chunkBudget > 0 && !(s && !o) && this.scheduleWork(), this.checkAsyncSchedule(i.context);
		}
		checkAsyncSchedule(e) {
			e.scheduleOn &&= (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((e) => Vu(this.view.state, e)).then(() => this.workScheduled--), null);
		}
		destroy() {
			this.working && this.working();
		}
		isWorking() {
			return !!(this.working || this.workScheduled > 0);
		}
	}, { eventHandlers: { focus() {
		this.scheduleWork();
	} } }), mb = /*@__PURE__*/ q.define({
		combine(e) {
			return e.length ? e[0] : null;
		},
		enables: (e) => [
			ab.state,
			pb,
			X.contentAttributes.compute([e], (t) => {
				let n = t.facet(e);
				return n && n.name ? { "data-language": n.name } : {};
			})
		]
	}), hb = class {
		constructor(e, t = []) {
			this.language = e, this.support = t, this.extension = [e, t];
		}
	}, gb = class e {
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
	}, _b = /*@__PURE__*/ q.define(), vb = /*@__PURE__*/ q.define({ combine: (e) => {
		if (!e.length) return "  ";
		let t = e[0];
		if (!t || /\S/.test(t) || Array.from(t).some((e) => e != t[0])) throw Error("Invalid indent unit: " + JSON.stringify(e[0]));
		return t;
	} }), yb = class {
		constructor(e, t = {}) {
			this.state = e, this.options = t, this.unit = $v(e);
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
			return Rc(e, this.state.tabSize, t);
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
	}, bb = /*@__PURE__*/ new Z(), xb = class e extends yb {
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
				if (cy(n, e)) break;
				t = this.state.doc.lineAt(n.from);
			}
			return this.lineIndent(t.from);
		}
		continue() {
			return iy(this.context.next, this.base, this.pos);
		}
	}, Sb = (e) => e.baseIndent, Cb = 200, wb = /*@__PURE__*/ q.define(), Tb = /*@__PURE__*/ new Z(), Eb = /*@__PURE__*/ vl.define({ map: vy }), Db = /*@__PURE__*/ vl.define({ map: vy }), Ob = /*@__PURE__*/ tl.define({
		create() {
			return Y.none;
		},
		update(e, t) {
			t.isUserEvent("delete") && t.changes.iterChangedRanges((t, n) => e = by(e, t, n)), e = e.map(t.changes);
			let n = [];
			for (let r of t.effects) r.is(Eb) && !Cy(e, r.value.from, r.value.to) ? n.push(r.value) : r.is(Db) && (e = e.update({
				filter: (e, t) => r.value.from != e || r.value.to != t,
				filterFrom: r.value.from,
				filterTo: r.value.to
			}));
			if (n.length) {
				let { preparePlaceholder: r } = t.state.facet(Ib), i = n.map((e) => (r ? Y.replace({ widget: new Rb(r(t.state, e)) }) : Lb).range(e.from, e.to));
				e = e.update({ add: i });
			}
			return t.selection && (e = by(e, t.selection.main.head)), e;
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
				t.push(Lb.range(r, i));
			}
			return Y.set(t, !0);
		}
	}), kb = (e) => {
		for (let t of yy(e)) {
			let n = _y(e.state, t.from, t.to);
			if (n) return e.dispatch({ effects: wy(e.state, [Eb.of(n), Ty(e, n)]) }), !0;
		}
		return !1;
	}, Ab = (e) => {
		if (!e.state.field(Ob, !1)) return !1;
		let t = [];
		for (let n of yy(e)) {
			let r = Sy(e.state, n.from, n.to);
			r && t.push(Db.of(r), Ty(e, r, !1));
		}
		return t.length && e.dispatch({ effects: t }), t.length > 0;
	}, jb = (e) => {
		let { state: t } = e, n = [];
		for (let r = 0; r < t.doc.length;) {
			let i = e.lineBlockAt(r), a = _y(t, i.from, i.to);
			a && n.push(Eb.of(a)), r = (a ? e.lineBlockAt(a.to) : i).to + 1;
		}
		return n.length && e.dispatch({ effects: wy(e.state, n) }), !!n.length;
	}, Mb = (e) => {
		let t = e.state.field(Ob, !1);
		if (!t || !t.size) return !1;
		let n = [];
		return t.between(0, e.state.doc.length, (e, t) => {
			n.push(Db.of({
				from: e,
				to: t
			}));
		}), e.dispatch({ effects: n }), !0;
	}, Nb = (e) => {
		let t = [];
		for (let n of yy(e)) {
			let r = Sy(e.state, n.from, n.to);
			if (r) t.push(Db.of(r), Ty(e, r, !1));
			else {
				let r = Ey(e, n);
				r && t.push(Eb.of(r), Ty(e, r));
			}
		}
		return t.length > 0 && e.dispatch({ effects: wy(e.state, t) }), !!t.length;
	}, Pb = [
		{
			key: "Ctrl-Shift-[",
			mac: "Cmd-Alt-[",
			run: kb
		},
		{
			key: "Ctrl-Shift-]",
			mac: "Cmd-Alt-]",
			run: Ab
		},
		{
			key: "Ctrl-Alt-[",
			run: jb
		},
		{
			key: "Ctrl-Alt-]",
			run: Mb
		}
	], Fb = {
		placeholderDOM: null,
		preparePlaceholder: null,
		placeholderText: "…"
	}, Ib = /*@__PURE__*/ q.define({ combine(e) {
		return Dc(e, Fb);
	} }), Lb = /*@__PURE__*/ Y.replace({ widget: /*@__PURE__*/ new class extends Np {
		toDOM(e) {
			return Oy(e, null);
		}
	}() }), Rb = class extends Np {
		constructor(e) {
			super(), this.value = e;
		}
		eq(e) {
			return this.value == e.value;
		}
		toDOM(e) {
			return Oy(e, this.value);
		}
	}, zb = {
		openText: "⌄",
		closedText: "›",
		markerDOM: null,
		domEventHandlers: {},
		foldingChanged: () => !1
	}, Bb = class extends c_ {
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
	}, Vb = /*@__PURE__*/ X.baseTheme({
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
	}), Hb = class e {
		constructor(e, t) {
			this.specs = e;
			let n;
			function r(e) {
				let t = Rl.newName();
				return (n ||= Object.create(null))["." + t] = e, t;
			}
			let i = typeof t.all == "string" ? t.all : t.all ? r(t.all) : void 0, a = t.scope;
			this.scope = a instanceof ab ? (e) => e.prop(rb) == a.data : a ? (e) => e == a : void 0, this.style = gv(e.map((e) => ({
				tag: e.tag,
				class: e.class || r(Object.assign({}, e, { tag: null }))
			})), { all: i }).style, this.module = n ? new Rl(n) : null, this.themeType = t.themeType;
		}
		static define(t, n) {
			return new e(t, n || {});
		}
	}, Ub = /*@__PURE__*/ q.define(), Wb = /*@__PURE__*/ q.define({ combine(e) {
		return e.length ? [e[0]] : null;
	} }), Gb = class {
		constructor(e) {
			this.markCache = Object.create(null), this.tree = qv(e.state), this.decorations = this.buildDeco(e, Ay(e.state)), this.decoratedTo = e.viewport.to;
		}
		update(e) {
			let t = qv(e.state), n = Ay(e.state), r = n != Ay(e.startState), { viewport: i } = e.view, a = e.changes.mapPos(this.decoratedTo, 1);
			t.length < i.to && !r && t.type == this.tree.type && a >= i.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = a) : (t != this.tree || e.viewportChanged || r) && (this.tree = t, this.decorations = this.buildDeco(e.view, n), this.decoratedTo = i.to);
		}
		buildDeco(e, t) {
			if (!t || !this.tree.length) return Y.none;
			let n = new kl();
			for (let { from: r, to: i } of e.visibleRanges) vv(this.tree, t, (e, t, r) => {
				n.add(e, t, this.markCache[r] || (this.markCache[r] = Y.mark({ class: r })));
			}, r, i);
			return n.finish();
		}
	}, Kb = /*@__PURE__*/ rl.high(/*@__PURE__*/ vm.fromClass(Gb, { decorations: (e) => e.decorations })), qb = /*@__PURE__*/ Hb.define([
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
	]), Jb = /*@__PURE__*/ X.baseTheme({
		"&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
		"&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
	}), Yb = 1e4, Xb = "()[]{}", Zb = /*@__PURE__*/ q.define({ combine(e) {
		return Dc(e, {
			afterCursor: !0,
			brackets: Xb,
			maxScanDistance: Yb,
			renderMatch: Ny
		});
	} }), Qb = /*@__PURE__*/ Y.mark({ class: "cm-matchingBracket" }), $b = /*@__PURE__*/ Y.mark({ class: "cm-nonmatchingBracket" }), ex = [/* @__PURE__ */ vm.fromClass(class {
		constructor(e) {
			this.paused = !1, this.decorations = Py(e.state);
		}
		update(e) {
			(e.docChanged || e.selectionSet || this.paused) && (e.view.composing ? (this.decorations = this.decorations.map(e.changes), this.paused = !0) : (this.decorations = Py(e.state), this.paused = !1));
		}
	}, { decorations: (e) => e.decorations }), Jb], tx = /*@__PURE__*/ new Z(), nx = class {
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
			return this.lastColumnPos < this.start && (this.lastColumnValue = Vy(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue;
		}
		indentation() {
			return this.overrideIndent ?? Vy(this.string, null, this.tabSize);
		}
		match(e, t, n) {
			if (typeof e == "string") {
				let r = (e) => n ? e.toLowerCase() : e;
				return r(this.string.substr(this.pos, e.length)) == r(e) ? (t !== !1 && (this.pos += e.length), !0) : null;
			} else {
				let n = this.string.slice(this.pos).match(e);
				return n && n.index > 0 ? null : (n && t !== !1 && (this.pos += n[0].length), n);
			}
		}
		current() {
			return this.string.slice(this.start, this.pos);
		}
	}, rx = /*@__PURE__*/ new WeakMap(), ix = class e extends ab {
		constructor(e) {
			let t = Gv(e.languageData), n = Hy(e), r, i = new class extends lv {
				createParse(e, t, n) {
					return new ax(r, e, t, n);
				}
			}();
			super(t, i, [], e.name), this.topNode = Xy(t, this), r = this, this.streamParser = n, this.stateAfter = new Z({ perNode: !0 }), this.tokenTable = e.tokenTable ? new fx(n.tokenTable) : px;
		}
		static define(t) {
			return new e(t);
		}
		getIndent(e) {
			let t, { overrideIndentation: n } = e.options;
			n && (t = rx.get(e.state), t != null && t < e.pos - 1e4 && (t = void 0));
			let r = Wy(this, e.node.tree, e.node.from, e.node.from, t ?? e.pos), i, a;
			if (r ? (a = r.state, i = r.pos + 1) : (a = this.streamParser.startState(e.unit), i = e.node.from), e.pos - i > 1e4) return null;
			for (; i < e.pos;) {
				let t = e.state.doc.lineAt(i), r = Math.min(e.pos, t.to);
				if (t.length) {
					let i = n ? n(t.from) : -1, o = new nx(t.text, e.state.tabSize, e.unit, i < 0 ? void 0 : i);
					for (; o.pos < r - t.from;) qy(this.streamParser.token, o, a);
				} else this.streamParser.blankLine(a, e.unit);
				if (r == e.pos) break;
				i = t.to + 1;
			}
			let o = e.lineAt(e.pos);
			return n && t == null && rx.set(e.state, o.from), this.streamParser.indent(a, /^\s*(.*)/.exec(o.text)[1], e);
		}
		get allowsNesting() {
			return !1;
		}
	}, ax = class {
		constructor(e, t, n, r) {
			this.lang = e, this.input = t, this.fragments = n, this.ranges = r, this.stoppedAt = null, this.chunks = [], this.chunkPos = [], this.chunk = [], this.chunkReused = void 0, this.rangeIndex = 0, this.to = r[r.length - 1].to;
			let i = lb.get(), a = r[0].from, { state: o, tree: s } = Ky(e, n, a, this.to, i?.state);
			this.state = o, this.parsedPos = this.chunkStart = a + s.length;
			for (let e = 0; e < s.children.length; e++) this.chunks.push(s.children[e]), this.chunkPos.push(s.positions[e]);
			i && this.parsedPos < i.viewport.from - 1e5 && r.some((e) => e.from <= i.viewport.from && e.to >= i.viewport.from) && (this.state = this.lang.streamParser.startState($v(i.state)), i.skipUntilInView(this.parsedPos, i.viewport.from), this.parsedPos = i.viewport.from), this.moveRangeIndex();
		}
		advance() {
			let e = lb.get(), t = this.stoppedAt == null ? this.to : Math.min(this.to, this.stoppedAt), n = Math.min(t, this.chunkStart + 512);
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
			let { line: t, end: n } = this.nextLine(), r = 0, { streamParser: i } = this.lang, a = new nx(t, e ? e.state.tabSize : 4, e ? $v(e.state) : 2);
			if (a.eol()) i.blankLine(this.state, a.indentUnit);
			else for (; !a.eol();) {
				let e = qy(i.token, a, this.state);
				if (e && (r = this.emitToken(this.lang.tokenTable.resolve(e), this.parsedPos + a.start, this.parsedPos + a.pos, r)), a.start > 1e4) break;
			}
			this.parsedPos = n, this.moveRangeIndex(), this.parsedPos < this.to && this.parsedPos++;
		}
		finishChunk() {
			let e = Z_.build({
				buffer: this.chunk,
				start: this.chunkStart,
				length: this.parsedPos - this.chunkStart,
				nodeSet: cx,
				topID: 0,
				maxBufferLength: 512,
				reused: this.chunkReused
			});
			e = new Z_(e.type, e.children, e.positions, e.length, [[this.lang.stateAfter, this.lang.streamParser.copyState(this.state)]]), this.chunks.push(e), this.chunkPos.push(this.chunkStart - this.ranges[0].from), this.chunk = [], this.chunkReused = void 0, this.chunkStart = this.parsedPos;
		}
		finish() {
			return new Z_(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
		}
	}, ox = /*@__PURE__*/ Object.create(null), sx = [K_.none], cx = /*@__PURE__*/ new q_(sx), lx = [], ux = /*@__PURE__*/ Object.create(null), dx = /*@__PURE__*/ Object.create(null);
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
	]) dx[e] = /*@__PURE__*/ Yy(ox, t);
	fx = class {
		constructor(e) {
			this.extra = e, this.table = Object.assign(Object.create(null), dx);
		}
		resolve(e) {
			return e ? this.table[e] || (this.table[e] = Yy(this.extra, e)) : 0;
		}
	}, px = /*@__PURE__*/ new fx(ox), mx = /*@__PURE__*/ q.define({ combine: (e) => e.some((e) => e) }), hx = /*@__PURE__*/ vm.fromClass(class {
		constructor(e) {
			this.always = e.state.facet(mx) || e.textDirection != Up.LTR || e.state.facet(X.perLineTextDirection), this.hasRTL = !this.always && Qy(e.state.doc), this.tree = qv(e.state), this.decorations = this.always || this.hasRTL ? tb(e, this.tree, this.always) : Y.none;
		}
		update(e) {
			let t = e.state.facet(mx) || e.view.textDirection != Up.LTR || e.state.facet(X.perLineTextDirection);
			if (!t && !this.hasRTL && $y(e.changes) && (this.hasRTL = !0), !t && !this.hasRTL) return;
			let n = qv(e.state);
			(t != this.always || n != this.tree || e.docChanged || e.viewportChanged) && (this.tree = n, this.always = t, this.decorations = tb(e.view, n, t));
		}
	}, { provide: (e) => {
		function t(t) {
			return t.plugin(e)?.decorations ?? Y.none;
		}
		return [X.outerDecorations.of(t), rl.lowest(X.bidiIsolatedRanges.of(t))];
	} }), gx = {
		rtl: /*@__PURE__*/ Y.mark({
			class: "cm-iso",
			inclusive: !0,
			attributes: { dir: "rtl" },
			bidiIsolate: Up.RTL
		}),
		ltr: /*@__PURE__*/ Y.mark({
			class: "cm-iso",
			inclusive: !0,
			attributes: { dir: "ltr" },
			bidiIsolate: Up.LTR
		}),
		auto: /*@__PURE__*/ Y.mark({
			class: "cm-iso",
			inclusive: !0,
			attributes: { dir: "auto" },
			bidiIsolate: null
		})
	};
}));
//#endregion
//#region node_modules/@lezer/lr/dist/index.js
function vx(e, t = Uint16Array) {
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
function yx(e, t, n, r, i, a) {
	let o = 0, s = 1 << r, { dialect: c } = n.p.parser;
	scan: for (; (s & e[o]) != 0;) {
		let n = e[o + 1];
		for (let r = o + 3; r < n; r += 2) if ((e[r + 1] & s) > 0) {
			let n = e[r];
			if (c.allows(n) && (t.token.value == -1 || t.token.value == n || xx(n, t.token.value, i, a))) {
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
function bx(e, t, n) {
	for (let r = t, i; (i = e[r]) != 65535; r++) if (i == n) return r - t;
	return -1;
}
function xx(e, t, n, r) {
	let i = bx(n, r, t);
	return i < 0 || bx(n, r, e) < i;
}
function Sx(e, t, n) {
	let r = e.cursor(X_.IncludeAnonymous);
	for (r.moveTo(t);;) if (!(n < 0 ? r.childBefore(t) : r.childAfter(t))) for (;;) {
		if ((n < 0 ? r.to < t : r.from > t) && !r.type.isError) return n < 0 ? Math.max(0, Math.min(r.to - 1, t - 25)) : Math.min(e.length, Math.max(r.from + 1, t + 25));
		if (n < 0 ? r.prevSibling() : r.nextSibling()) break;
		if (!r.parent()) return n < 0 ? 0 : e.length;
	}
}
function Cx(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (r.pos == e.pos && r.sameState(e)) {
			t[n].score < e.score && (t[n] = e);
			return;
		}
	}
	t.push(e);
}
function wx(e, t) {
	return e[t] | e[t + 1] << 16;
}
function Tx(e) {
	let t = null;
	for (let n of e) {
		let e = n.p.stoppedAt;
		(n.pos == n.p.stream.end || e != null && n.pos > e) && n.p.parser.stateFlag(n.state, 2) && (!t || t.score < n.score) && (t = n);
	}
	return t;
}
function Ex(e) {
	if (e.external) {
		let t = +!!e.extend;
		return (n, r) => e.external(n, r) << 1 | t;
	}
	return e.get;
}
var Dx, Ox, kx, Ax, jx, Mx, Nx, Px, Fx, Ix, Lx, Rx, zx, Bx, Vx, Hx, Ux, Wx, Gx, Kx = t((() => {
	dv(), Dx = class e {
		constructor(e, t, n, r, i, a, o, s, c, l = 0, u) {
			this.p = e, this.stack = t, this.state = n, this.reducePos = r, this.pos = i, this.score = a, this.buffer = o, this.bufferBase = s, this.curContext = c, this.lookAhead = l, this.parent = u;
		}
		toString() {
			return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
		}
		static start(t, n, r = 0) {
			let i = t.parser.context;
			return new e(t, [], n, r, r, 0, [], 0, i ? new Ox(i, i.start) : null, 0, null);
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
		useNode(e, t) {
			let n = this.p.reused.length - 1;
			(n < 0 || this.p.reused[n] != e) && (this.p.reused.push(e), n++);
			let r = this.pos;
			this.reducePos = this.pos = r + e.length, this.pushState(t, r), this.buffer.push(n, r, this.reducePos, -1), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
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
			for (let t = new kx(this);;) {
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
					if (!(t & 393216)) if (t & 65536) {
						let n = (t >> 19) - i;
						if (n > 1) {
							let r = t & 65535, i = this.stack.length - n * 3;
							if (i >= 0 && e.getGoto(this.stack[i], r, !1) >= 0) return n << 19 | 65536 | r;
						}
					} else {
						let e = n(t, i + 1);
						if (e != null) return e;
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
			(e < 0 || this.buffer[e] != -3) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
		}
		emitLookAhead() {
			let e = this.buffer.length - 1;
			(e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
		}
		updateContext(e) {
			if (e != this.curContext.context) {
				let t = new Ox(this.curContext.tracker, e);
				t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
			}
		}
		setLookAhead(e) {
			return e <= this.lookAhead ? !1 : (this.emitLookAhead(), this.lookAhead = e, !0);
		}
		close() {
			this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
		}
	}, Ox = class {
		constructor(e, t) {
			this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
		}
	}, kx = class {
		constructor(e) {
			this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
		}
		reduce(e) {
			let t = e & 65535, n = e >> 19;
			n == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (n - 1) * 3;
			let r = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
			this.state = r;
		}
	}, Ax = class e {
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
	}, jx = class {
		constructor() {
			this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
		}
	}, Mx = new jx(), Nx = class {
		constructor(e, t) {
			this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = Mx, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
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
			return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
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
			if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = Mx, this.pos != e) {
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
	}, Px = class {
		constructor(e, t) {
			this.data = e, this.id = t;
		}
		token(e, t) {
			let { parser: n } = t.p;
			yx(this.data, e, t, this.id, n.data, n.tokenPrecTable);
		}
	}, Px.prototype.contextual = Px.prototype.fallback = Px.prototype.extend = !1, Fx = class {
		constructor(e, t, n) {
			this.precTable = t, this.elseToken = n, this.data = typeof e == "string" ? vx(e) : e;
		}
		token(e, t) {
			let n = e.pos, r = 0;
			for (;;) {
				let n = e.next < 0, i = e.resolveOffset(1, 1);
				if (yx(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1) break;
				if (this.elseToken == null) return;
				if (n || r++, i == null) break;
				e.reset(i, e.token);
			}
			r && (e.reset(n, e.token), e.acceptToken(this.elseToken, r));
		}
	}, Fx.prototype.contextual = Px.prototype.fallback = Px.prototype.extend = !1, Ix = class {
		constructor(e, t = {}) {
			this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
		}
	}, Lx = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG), Rx = null, zx = class {
		constructor(e, t) {
			this.fragments = e, this.nodeSet = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
		}
		nextFragment() {
			let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
			if (e) {
				for (this.safeFrom = e.openStart ? Sx(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? Sx(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length;) this.trees.pop(), this.start.pop(), this.index.pop();
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
				let n = this.trees[t], r = this.index[t];
				if (r == n.children.length) {
					this.trees.pop(), this.start.pop(), this.index.pop();
					continue;
				}
				let i = n.children[r], a = this.start[t] + n.positions[r];
				if (a > e) return this.nextStart = a, null;
				if (i instanceof Z_) {
					if (a == e) {
						if (a < this.safeFrom) return null;
						let e = a + i.length;
						if (e <= this.safeTo) {
							let t = i.prop(Z.lookAhead);
							if (!t || e + t < this.fragment.to) return i;
						}
					}
					this.index[t]++, a + i.length >= Math.max(this.safeFrom, e) && (this.trees.push(i), this.start.push(a), this.index.push(0));
				} else this.index[t]++, this.nextStart = a + i.length;
			}
		}
	}, Bx = class {
		constructor(e, t) {
			this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((e) => new jx());
		}
		getActions(e) {
			let t = 0, n = null, { parser: r } = e.p, { tokenizers: i } = r, a = r.stateSlot(e.state, 3), o = e.curContext ? e.curContext.hash : 0, s = 0;
			for (let r = 0; r < i.length; r++) {
				if (!(1 << r & a)) continue;
				let c = i[r], l = this.tokens[r];
				if (!(n && !c.fallback) && ((c.contextual || l.start != e.pos || l.mask != a || l.context != o) && (this.updateCachedToken(l, c, e), l.mask = a, l.context = o), l.lookAhead > l.end + 25 && (s = Math.max(l.lookAhead, s)), l.value != 0)) {
					let r = t;
					if (l.extended > -1 && (t = this.addActions(e, l.extended, l.end, t)), t = this.addActions(e, l.value, l.end, t), !c.extend && (n = l, t > r)) break;
				}
			}
			for (; this.actions.length > t;) this.actions.pop();
			return s && e.setLookAhead(s), !n && e.pos == this.stream.end && (n = new jx(), n.value = e.p.parser.eofTerm, n.start = n.end = e.pos, t = this.addActions(e, n.value, n.end, t)), this.mainToken = n, this.actions;
		}
		getMainToken(e) {
			if (this.mainToken) return this.mainToken;
			let t = new jx(), { pos: n, p: r } = e;
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
				if (o[s] == 65535) if (o[s + 1] == 1) s = wx(o, s + 2);
				else {
					r == 0 && o[s + 1] == 2 && (r = this.putAction(wx(o, s + 2), t, n, r));
					break;
				}
				o[s] == t && (r = this.putAction(wx(o, s + 1), t, n, r));
			}
			return r;
		}
	}, Vx = class {
		constructor(e, t, n, r) {
			this.parser = e, this.input = t, this.ranges = r, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new Nx(t, r), this.tokens = new Bx(e, this.stream), this.topTerm = e.top[1];
			let { from: i } = r[0];
			this.stacks = [Dx.start(this, e.top[0], i)], this.fragments = n.length && this.stream.end - i > e.bufferLength * 4 ? new zx(n, e.nodeSet) : null;
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
				let e = r && Tx(r);
				if (e) return Lx && console.log("Finish with " + this.stackID(e)), this.stackToTree(e);
				if (this.parser.strict) throw Lx && r && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), SyntaxError("No parse at " + t);
				this.recovering ||= 5;
			}
			if (this.recovering && r) {
				let e = this.stoppedAt != null && r[0].pos > this.stoppedAt ? r[0] : this.runRecovery(r, i, n);
				if (e) return Lx && console.log("Force-finish " + this.stackID(e)), this.stackToTree(e.forceAll());
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
						if (t.sameState(i) || t.buffer.length > 500 && i.buffer.length > 500) if ((t.score - i.score || t.buffer.length - i.buffer.length) > 0) n.splice(r--, 1);
						else {
							n.splice(e--, 1);
							continue outer;
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
		advanceStack(e, t, n) {
			let r = e.pos, { parser: i } = this, a = Lx ? this.stackID(e) + " -> " : "";
			if (this.stoppedAt != null && r > this.stoppedAt) return e.forceReduce() ? e : null;
			if (this.fragments) {
				let t = e.curContext && e.curContext.tracker.strict, n = t ? e.curContext.hash : 0;
				for (let o = this.fragments.nodeAt(r); o;) {
					let r = this.parser.nodeSet.types[o.type.id] == o.type ? i.getGoto(e.state, o.type.id) : -1;
					if (r > -1 && o.length && (!t || (o.prop(Z.contextHash) || 0) == n)) return e.useNode(o, r), Lx && console.log(a + this.stackID(e) + ` (via reuse of ${i.getName(o.type.id)})`), !0;
					if (!(o instanceof Z_) || o.children.length == 0 || o.positions[0] > 0) break;
					let s = o.children[0];
					if (s instanceof Z_ && o.positions[0] == 0) o = s;
					else break;
				}
			}
			let o = i.stateSlot(e.state, 4);
			if (o > 0) return e.reduce(o), Lx && console.log(a + this.stackID(e) + ` (via always-reduce ${i.getName(o & 65535)})`), !0;
			if (e.stack.length >= 8400) for (; e.stack.length > 6e3 && e.forceReduce(););
			let s = this.tokens.getActions(e);
			for (let o = 0; o < s.length;) {
				let c = s[o++], l = s[o++], u = s[o++], d = o == s.length || !n, f = d ? e : e.split(), p = this.tokens.mainToken;
				if (f.apply(c, l, p ? p.start : f.pos, u), Lx && console.log(a + this.stackID(f) + ` (via ${c & 65536 ? `reduce of ${i.getName(c & 65535)}` : "shift"} for ${i.getName(l)} @ ${r}${f == e ? "" : ", split"})`), d) return !0;
				f.pos > r ? t.push(f) : n.push(f);
			}
			return !1;
		}
		advanceFully(e, t) {
			let n = e.pos;
			for (;;) {
				if (!this.advanceStack(e, null, null)) return !1;
				if (e.pos > n) return Cx(e, t), !0;
			}
		}
		runRecovery(e, t, n) {
			let r = null, i = !1;
			for (let a = 0; a < e.length; a++) {
				let o = e[a], s = t[a << 1], c = t[(a << 1) + 1], l = Lx ? this.stackID(o) + " -> " : "";
				if (o.deadEnd && (i || (i = !0, o.restart(), Lx && console.log(l + this.stackID(o) + " (restarted)"), this.advanceFully(o, n)))) continue;
				let u = o.split(), d = l;
				for (let e = 0; e < 10 && u.forceReduce() && (Lx && console.log(d + this.stackID(u) + " (via force-reduce)"), !this.advanceFully(u, n)); e++) Lx && (d = this.stackID(u) + " -> ");
				for (let e of o.recoverByInsert(s)) Lx && console.log(l + this.stackID(e) + " (via recover-insert)"), this.advanceFully(e, n);
				this.stream.end > o.pos ? (c == o.pos && (c++, s = 0), o.recoverByDelete(s, c), Lx && console.log(l + this.stackID(o) + ` (via recover-delete ${this.parser.getName(s)})`), Cx(o, n)) : (!r || r.score < u.score) && (r = u);
			}
			return r;
		}
		stackToTree(e) {
			return e.close(), Z_.build({
				buffer: Ax.create(e),
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
			let t = (Rx ||= /* @__PURE__ */ new WeakMap()).get(e);
			return t || Rx.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
		}
	}, Hx = class {
		constructor(e, t, n) {
			this.source = e, this.flags = t, this.disabled = n;
		}
		allows(e) {
			return !this.disabled || this.disabled[e] == 0;
		}
	}, Ux = (e) => e, Wx = class {
		constructor(e) {
			this.start = e.start, this.shift = e.shift || Ux, this.reduce = e.reduce || Ux, this.reuse = e.reuse || Ux, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
		}
	}, Gx = class e extends lv {
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
			this.nodeSet = new q_(t.map((t, i) => K_.define({
				name: i >= this.minRepeatTerm ? void 0 : t,
				id: i,
				props: r[i],
				top: n.indexOf(i) > -1,
				error: i == 0,
				skipped: e.skippedNodes && e.skippedNodes.indexOf(i) > -1
			}))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = V_;
			let a = vx(e.tokenData);
			this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
			for (let e = 0; e < this.specializerSpecs.length; e++) this.specialized[e] = this.specializerSpecs[e].term;
			this.specializers = this.specializerSpecs.map(Ex), this.states = vx(e.states, Uint32Array), this.data = vx(e.stateData), this.goto = vx(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((e) => typeof e == "number" ? new Px(a, e) : e), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
		}
		createParse(e, t, n) {
			let r = new Vx(this, e, t, n);
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
				if ((a = n[i]) == 65535) if (n[i + 1] == 1) a = n[i = wx(n, i + 2)];
				else if (n[i + 1] == 2) return wx(n, i + 2);
				else break;
				if (a == t || a == 0) return wx(n, i + 1);
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
				if (this.data[n] == 65535) if (this.data[n + 1] == 1) n = wx(this.data, n + 2);
				else break;
				r = t(wx(this.data, n + 1));
			}
			return r;
		}
		nextStates(e) {
			let t = [];
			for (let n = this.stateSlot(e, 1);; n += 3) {
				if (this.data[n] == 65535) if (this.data[n + 1] == 1) n = wx(this.data, n + 2);
				else break;
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
				return n.specializers[r] = Ex(a), a;
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
			return new Hx(e, n, r);
		}
		static deserialize(t) {
			return new e(t);
		}
	};
}));
//#endregion
//#region node_modules/@lezer/javascript/dist/index.js
function qx(e, t) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e == 95 || e >= 192 || !t && e >= 48 && e <= 57;
}
var Jx, Yx, Xx, Zx, Qx, $x, eS, tS, nS, rS, iS, aS, oS, sS, cS, lS, uS, dS, fS, pS, mS, hS, gS, _S, vS, yS, bS, xS, SS, CS, wS, TS, ES, DS, OS, kS = t((() => {
	Kx(), Uv(), Jx = 316, Yx = 317, Xx = 1, Zx = 2, Qx = 3, $x = 4, eS = 318, tS = 320, nS = 321, rS = 5, iS = 6, aS = 0, oS = [
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
	], sS = 125, cS = 59, lS = 47, uS = 42, dS = 43, fS = 45, pS = 60, mS = 44, hS = 63, gS = 46, _S = 91, vS = new Wx({
		start: !1,
		shift(e, t) {
			return t == rS || t == iS || t == tS ? e : t == nS;
		},
		strict: !1
	}), yS = new Ix((e, t) => {
		let { next: n } = e;
		(n == sS || n == -1 || t.context) && e.acceptToken(eS);
	}, {
		contextual: !0,
		fallback: !0
	}), bS = new Ix((e, t) => {
		let { next: n } = e, r;
		oS.indexOf(n) > -1 || n == lS && ((r = e.peek(1)) == lS || r == uS) || n != sS && n != cS && n != -1 && !t.context && e.acceptToken(Jx);
	}, { contextual: !0 }), xS = new Ix((e, t) => {
		e.next == _S && !t.context && e.acceptToken(Yx);
	}, { contextual: !0 }), SS = new Ix((e, t) => {
		let { next: n } = e;
		if (n == dS || n == fS) {
			if (e.advance(), n == e.next) {
				e.advance();
				let n = !t.context && t.canShift(Xx);
				e.acceptToken(n ? Xx : Zx);
			}
		} else n == hS && e.peek(1) == gS && (e.advance(), e.advance(), (e.next < 48 || e.next > 57) && e.acceptToken(Qx));
	}, { contextual: !0 }), CS = new Ix((e, t) => {
		if (e.next != pS || !t.dialectEnabled(aS) || (e.advance(), e.next == lS)) return;
		let n = 0;
		for (; oS.indexOf(e.next) > -1;) e.advance(), n++;
		if (qx(e.next, !0)) {
			for (e.advance(), n++; qx(e.next, !1);) e.advance(), n++;
			for (; oS.indexOf(e.next) > -1;) e.advance(), n++;
			if (e.next == mS) return;
			for (let t = 0;; t++) {
				if (t == 7) {
					if (!qx(e.next, !0)) return;
					break;
				}
				if (e.next != "extends".charCodeAt(t)) break;
				e.advance(), n++;
			}
		}
		e.acceptToken($x, -n);
	}), wS = hv({
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
	}), TS = {
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
		public: 235,
		private: 235,
		protected: 235,
		readonly: 237,
		instanceof: 256,
		satisfies: 259,
		import: 292,
		keyof: 349,
		unique: 353,
		infer: 359,
		asserts: 395,
		is: 397,
		abstract: 417,
		implements: 419,
		type: 421,
		let: 424,
		var: 426,
		using: 429,
		interface: 435,
		enum: 439,
		namespace: 445,
		module: 447,
		declare: 451,
		global: 455,
		defer: 471,
		for: 476,
		of: 485,
		while: 488,
		with: 492,
		do: 496,
		if: 500,
		else: 502,
		switch: 506,
		case: 512,
		try: 518,
		catch: 522,
		finally: 526,
		return: 530,
		throw: 534,
		break: 538,
		continue: 542,
		debugger: 546
	}, ES = {
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
		new: 401
	}, DS = {
		__proto__: null,
		"<": 193
	}, OS = Gx.deserialize({
		version: 14,
		states: "$F|Q%TQlOOO%[QlOOO'_QpOOP(lO`OOO*zQ!0MxO'#CiO+RO#tO'#CjO+aO&jO'#CjO+oO#@ItO'#DaO.QQlO'#DgO.bQlO'#DrO%[QlO'#DzO0fQlO'#ESOOQ!0Lf'#E['#E[O1PQ`O'#EXOOQO'#Ep'#EpOOQO'#Il'#IlO1XQ`O'#GsO1dQ`O'#EoO1iQ`O'#EoO3hQ!0MxO'#JrO6[Q!0MxO'#JsO6uQ`O'#F]O6zQ,UO'#FtOOQ!0Lf'#Ff'#FfO7VO7dO'#FfO9XQMhO'#F|O9`Q`O'#F{OOQ!0Lf'#Js'#JsOOQ!0Lb'#Jr'#JrO9eQ`O'#GwOOQ['#K_'#K_O9pQ`O'#IYO9uQ!0LrO'#IZOOQ['#J`'#J`OOQ['#I_'#I_Q`QlOOQ`QlOOO9}Q!L^O'#DvO:UQlO'#EOO:]QlO'#EQO9kQ`O'#GsO:dQMhO'#CoO:rQ`O'#EnO:}Q`O'#EyO;hQMhO'#FeO;xQ`O'#GsOOQO'#K`'#K`O;}Q`O'#K`O<]Q`O'#G{O<]Q`O'#G|O<]Q`O'#HOO9kQ`O'#HRO=SQ`O'#HUO>kQ`O'#CeO>{Q`O'#HcO?TQ`O'#HiO?TQ`O'#HkO`QlO'#HmO?TQ`O'#HoO?TQ`O'#HrO?YQ`O'#HxO?_Q!0LsO'#IOO%[QlO'#IQO?jQ!0LsO'#ISO?uQ!0LsO'#IUO9uQ!0LrO'#IWO@QQ!0MxO'#CiOASQpO'#DlQOQ`OOO%[QlO'#EQOAjQ`O'#ETO:dQMhO'#EnOAuQ`O'#EnOBQQ!bO'#FeOOQ['#Cg'#CgOOQ!0Lb'#Dq'#DqOOQ!0Lb'#Jv'#JvO%[QlO'#JvOOQO'#Jy'#JyOOQO'#Ih'#IhOCQQpO'#EgOOQ!0Lb'#Ef'#EfOOQ!0Lb'#J}'#J}OC|Q!0MSO'#EgODWQpO'#EWOOQO'#Jx'#JxODlQpO'#JyOEyQpO'#EWODWQpO'#EgPFWO&2DjO'#CbPOOO)CD})CD}OOOO'#I`'#I`OFcO#tO,59UOOQ!0Lh,59U,59UOOOO'#Ia'#IaOFqO&jO,59UOGPQ!L^O'#DcOOOO'#Ic'#IcOGWO#@ItO,59{OOQ!0Lf,59{,59{OGfQlO'#IdOGyQ`O'#JtOIxQ!fO'#JtO+}QlO'#JtOJPQ`O,5:ROJgQ`O'#EpOJtQ`O'#KTOKPQ`O'#KSOKPQ`O'#KSOKXQ`O,5;^OK^Q`O'#KROOQ!0Ln,5:^,5:^OKeQlO,5:^OMcQ!0MxO,5:fONSQ`O,5:nONmQ!0LrO'#KQONtQ`O'#KPO9eQ`O'#KPO! YQ`O'#KPO! bQ`O,5;]O! gQ`O'#KPO!#lQ!fO'#JsOOQ!0Lh'#Ci'#CiO%[QlO'#ESO!$[Q!fO,5:sOOQS'#Jz'#JzOOQO-E<j-E<jO9kQ`O,5=_O!$rQ`O,5=_O!$wQlO,5;ZO!&zQMhO'#EkO!(eQ`O,5;ZO!(jQlO'#DyO!(tQpO,5;dO!(|QpO,5;dO%[QlO,5;dOOQ['#FT'#FTOOQ['#FV'#FVO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eOOQ['#FZ'#FZO!)[QlO,5;tOOQ!0Lf,5;y,5;yOOQ!0Lf,5;z,5;zOOQ!0Lf,5;|,5;|O%[QlO'#IpO!+_Q!0LrO,5<iO%[QlO,5;eO!&zQMhO,5;eO!+|QMhO,5;eO!-nQMhO'#E^O%[QlO,5;wOOQ!0Lf,5;{,5;{O!-uQ,UO'#FjO!.rQ,UO'#KXO!.^Q,UO'#KXO!.yQ,UO'#KXOOQO'#KX'#KXO!/_Q,UO,5<SOOOW,5<`,5<`O!/pQlO'#FvOOOW'#Io'#IoO7VO7dO,5<QO!/wQ,UO'#FxOOQ!0Lf,5<Q,5<QO!0hQ$IUO'#CyOOQ!0Lh'#C}'#C}O!0{O#@ItO'#DRO!1iQMjO,5<eO!1pQ`O,5<hO!3YQ(CWO'#GXO!3jQ`O'#GYO!3oQ`O'#GYO!5_Q(CWO'#G^O!6dQpO'#GbOOQO'#Gn'#GnO!,TQMhO'#GmOOQO'#Gp'#GpO!,TQMhO'#GoO!7VQ$IUO'#JlOOQ!0Lh'#Jl'#JlO!7aQ`O'#JkO!7oQ`O'#JjO!7wQ`O'#CuOOQ!0Lh'#C{'#C{O!8YQ`O'#C}OOQ!0Lh'#DV'#DVOOQ!0Lh'#DX'#DXO!8_Q`O,5<eO1SQ`O'#DZO!,TQMhO'#GPO!,TQMhO'#GRO!8gQ`O'#GTO!8lQ`O'#GUO!3oQ`O'#G[O!,TQMhO'#GaO<]Q`O'#JkO!8qQ`O'#EqO!9`Q`O,5<gOOQ!0Lb'#Cr'#CrO!9hQ`O'#ErO!:bQpO'#EsOOQ!0Lb'#KR'#KRO!:iQ!0LrO'#KaO9uQ!0LrO,5=cO`QlO,5>tOOQ['#Jh'#JhOOQ[,5>u,5>uOOQ[-E<]-E<]O!<hQ!0MxO,5:bO!:]QpO,5:`O!?RQ!0MxO,5:jO%[QlO,5:jO!AiQ!0MxO,5:lOOQO,5@z,5@zO!BYQMhO,5=_O!BhQ!0LrO'#JiO9`Q`O'#JiO!ByQ!0LrO,59ZO!CUQpO,59ZO!C^QMhO,59ZO:dQMhO,59ZO!CiQ`O,5;ZO!CqQ`O'#HbO!DVQ`O'#KdO%[QlO,5;}O!:]QpO,5<PO!D_Q`O,5=zO!DdQ`O,5=zO!DiQ`O,5=zO!DwQ`O,5=zO9uQ!0LrO,5=zO<]Q`O,5=jOOQO'#Cy'#CyO!EOQpO,5=gO!EWQMhO,5=hO!EcQ`O,5=jO!EhQ!bO,5=mO!EpQ`O'#K`O?YQ`O'#HWO9kQ`O'#HYO!EuQ`O'#HYO:dQMhO'#H[O!EzQ`O'#H[OOQ[,5=p,5=pO!FPQ`O'#H]O!FbQ`O'#CoO!FgQ`O,59PO!FqQ`O,59PO!HvQlO,59POOQ[,59P,59PO!IWQ!0LrO,59PO%[QlO,59PO!KcQlO'#HeOOQ['#Hf'#HfOOQ['#Hg'#HgO`QlO,5=}O!KyQ`O,5=}O`QlO,5>TO`QlO,5>VO!LOQ`O,5>XO`QlO,5>ZO!LTQ`O,5>^O!LYQlO,5>dOOQ[,5>j,5>jO%[QlO,5>jO9uQ!0LrO,5>lOOQ[,5>n,5>nO#!dQ`O,5>nOOQ[,5>p,5>pO#!dQ`O,5>pOOQ[,5>r,5>rO##QQpO'#D_O%[QlO'#JvO##sQpO'#JvO##}QpO'#DmO#$`QpO'#DmO#&qQlO'#DmO#&xQ`O'#JuO#'QQ`O,5:WO#'VQ`O'#EtO#'eQ`O'#KUO#'mQ`O,5;_O#'rQpO'#DmO#(PQpO'#EVOOQ!0Lf,5:o,5:oO%[QlO,5:oO#(WQ`O,5:oO?YQ`O,5;YO!CUQpO,5;YO!C^QMhO,5;YO:dQMhO,5;YO#(`Q`O,5@bO#(eQ07dO,5:sOOQO-E<f-E<fO#)kQ!0MSO,5;RODWQpO,5:rO#)uQpO,5:rODWQpO,5;RO!ByQ!0LrO,5:rOOQ!0Lb'#Ej'#EjOOQO,5;R,5;RO%[QlO,5;RO#*SQ!0LrO,5;RO#*_Q!0LrO,5;RO!CUQpO,5:rOOQO,5;X,5;XO#*mQ!0LrO,5;RPOOO'#I^'#I^P#+RO&2DjO,58|POOO,58|,58|OOOO-E<^-E<^OOQ!0Lh1G.p1G.pOOOO-E<_-E<_OOOO,59},59}O#+^Q!bO,59}OOOO-E<a-E<aOOQ!0Lf1G/g1G/gO#+cQ!fO,5?OO+}QlO,5?OOOQO,5?U,5?UO#+mQlO'#IdOOQO-E<b-E<bO#+zQ`O,5@`O#,SQ!fO,5@`O#,ZQ`O,5@nOOQ!0Lf1G/m1G/mO%[QlO,5@oO#,cQ`O'#IjOOQO-E<h-E<hO#,ZQ`O,5@nOOQ!0Lb1G0x1G0xOOQ!0Ln1G/x1G/xOOQ!0Ln1G0Y1G0YO%[QlO,5@lO#,wQ!0LrO,5@lO#-YQ!0LrO,5@lO#-aQ`O,5@kO9eQ`O,5@kO#-iQ`O,5@kO#-wQ`O'#ImO#-aQ`O,5@kOOQ!0Lb1G0w1G0wO!(tQpO,5:uO!)PQpO,5:uOOQS,5:w,5:wO#.iQdO,5:wO#.qQMhO1G2yO9kQ`O1G2yOOQ!0Lf1G0u1G0uO#/PQ!0MxO1G0uO#0UQ!0MvO,5;VOOQ!0Lh'#GW'#GWO#0rQ!0MzO'#JlO!$wQlO1G0uO#2}Q!fO'#JwO%[QlO'#JwO#3XQ`O,5:eOOQ!0Lh'#D_'#D_OOQ!0Lf1G1O1G1OO%[QlO1G1OOOQ!0Lf1G1f1G1fO#3^Q`O1G1OO#5rQ!0MxO1G1PO#5yQ!0MxO1G1PO#8aQ!0MxO1G1PO#8hQ!0MxO1G1PO#;OQ!0MxO1G1PO#=fQ!0MxO1G1PO#=mQ!0MxO1G1PO#=tQ!0MxO1G1PO#@[Q!0MxO1G1PO#@cQ!0MxO1G1PO#BpQ?MtO'#CiO#DkQ?MtO1G1`O#DrQ?MtO'#JsO#EVQ!0MxO,5?[OOQ!0Lb-E<n-E<nO#GdQ!0MxO1G1PO#HaQ!0MzO1G1POOQ!0Lf1G1P1G1PO#IdQMjO'#J|O#InQ`O,5:xO#IsQ!0MxO1G1cO#JgQ,UO,5<WO#JoQ,UO,5<XO#JwQ,UO'#FoO#K`Q`O'#FnOOQO'#KY'#KYOOQO'#In'#InO#KeQ,UO1G1nOOQ!0Lf1G1n1G1nOOOW1G1y1G1yO#KvQ?MtO'#JrO#LQQ`O,5<bO!)[QlO,5<bOOOW-E<m-E<mOOQ!0Lf1G1l1G1lO#LVQpO'#KXOOQ!0Lf,5<d,5<dO#L_QpO,5<dO#LdQMhO'#DTOOOO'#Ib'#IbO#LkO#@ItO,59mOOQ!0Lh,59m,59mO%[QlO1G2PO!8lQ`O'#IrO#LvQ`O,5<zOOQ!0Lh,5<w,5<wO!,TQMhO'#IuO#MdQMjO,5=XO!,TQMhO'#IwO#NVQMjO,5=ZO!&zQMhO,5=]OOQO1G2S1G2SO#NaQ!dO'#CrO#NtQ(CWO'#ErO$ |QpO'#GbO$!dQ!dO,5<sO$!kQ`O'#K[O9eQ`O'#K[O$!yQ`O,5<uO$#aQ!dO'#C{O!,TQMhO,5<tO$#kQ`O'#GZO$$PQ`O,5<tO$$UQ!dO'#GWO$$cQ!dO'#K]O$$mQ`O'#K]O!&zQMhO'#K]O$$rQ`O,5<xO$$wQlO'#JvO$%RQpO'#GcO#$`QpO'#GcO$%dQ`O'#GgO!3oQ`O'#GkO$%iQ!0LrO'#ItO$%tQpO,5<|OOQ!0Lp,5<|,5<|O$%{QpO'#GcO$&YQpO'#GdO$&kQpO'#GdO$&pQMjO,5=XO$'QQMjO,5=ZOOQ!0Lh,5=^,5=^O!,TQMhO,5@VO!,TQMhO,5@VO$'bQ`O'#IyO$'vQ`O,5@UO$(OQ`O,59aOOQ!0Lh,59i,59iO$(TQ`O,5@VO$)TQ$IYO,59uOOQ!0Lh'#Jp'#JpO$)vQMjO,5<kO$*iQMjO,5<mO@zQ`O,5<oOOQ!0Lh,5<p,5<pO$*sQ`O,5<vO$*xQMjO,5<{O$+YQ`O'#KPO!$wQlO1G2RO$+_Q`O1G2RO9eQ`O'#KSO9eQ`O'#EtO%[QlO'#EtO9eQ`O'#I{O$+dQ!0LrO,5@{OOQ[1G2}1G2}OOQ[1G4`1G4`OOQ!0Lf1G/|1G/|OOQ!0Lf1G/z1G/zO$-fQ!0MxO1G0UOOQ[1G2y1G2yO!&zQMhO1G2yO%[QlO1G2yO#.tQ`O1G2yO$/jQMhO'#EkOOQ!0Lb,5@T,5@TO$/wQ!0LrO,5@TOOQ[1G.u1G.uO!ByQ!0LrO1G.uO!CUQpO1G.uO!C^QMhO1G.uO$0YQ`O1G0uO$0_Q`O'#CiO$0jQ`O'#KeO$0rQ`O,5=|O$0wQ`O'#KeO$0|Q`O'#KeO$1[Q`O'#JRO$1jQ`O,5AOO$1rQ!fO1G1iOOQ!0Lf1G1k1G1kO9kQ`O1G3fO@zQ`O1G3fO$1yQ`O1G3fO$2OQ`O1G3fO!DiQ`O1G3fO9uQ!0LrO1G3fOOQ[1G3f1G3fO!EcQ`O1G3UO!&zQMhO1G3RO$2TQ`O1G3ROOQ[1G3S1G3SO!&zQMhO1G3SO$2YQ`O1G3SO$2bQpO'#HQOOQ[1G3U1G3UO!6_QpO'#I}O!EhQ!bO1G3XOOQ[1G3X1G3XOOQ[,5=r,5=rO$2jQMhO,5=tO9kQ`O,5=tO$%dQ`O,5=vO9`Q`O,5=vO!CUQpO,5=vO!C^QMhO,5=vO:dQMhO,5=vO$2xQ`O'#KcO$3TQ`O,5=wOOQ[1G.k1G.kO$3YQ!0LrO1G.kO@zQ`O1G.kO$3eQ`O1G.kO9uQ!0LrO1G.kO$5mQ!fO,5AQO$5zQ`O,5AQO9eQ`O,5AQO$6VQlO,5>PO$6^Q`O,5>POOQ[1G3i1G3iO`QlO1G3iOOQ[1G3o1G3oOOQ[1G3q1G3qO?TQ`O1G3sO$6cQlO1G3uO$:gQlO'#HtOOQ[1G3x1G3xO$:tQ`O'#HzO?YQ`O'#H|OOQ[1G4O1G4OO$:|QlO1G4OO9uQ!0LrO1G4UOOQ[1G4W1G4WOOQ!0Lb'#G_'#G_O9uQ!0LrO1G4YO9uQ!0LrO1G4[O$?TQ`O,5@bO!)[QlO,5;`O9eQ`O,5;`O?YQ`O,5:XO!)[QlO,5:XO!CUQpO,5:XO$?YQ?MtO,5:XOOQO,5;`,5;`O$?dQpO'#IeO$?zQ`O,5@aOOQ!0Lf1G/r1G/rO$@SQpO'#IkO$@^Q`O,5@pOOQ!0Lb1G0y1G0yO#$`QpO,5:XOOQO'#Ig'#IgO$@fQpO,5:qOOQ!0Ln,5:q,5:qO#(ZQ`O1G0ZOOQ!0Lf1G0Z1G0ZO%[QlO1G0ZOOQ!0Lf1G0t1G0tO?YQ`O1G0tO!CUQpO1G0tO!C^QMhO1G0tOOQ!0Lb1G5|1G5|O!ByQ!0LrO1G0^OOQO1G0m1G0mO%[QlO1G0mO$@mQ!0LrO1G0mO$@xQ!0LrO1G0mO!CUQpO1G0^ODWQpO1G0^O$AWQ!0LrO1G0mOOQO1G0^1G0^O$AlQ!0MxO1G0mPOOO-E<[-E<[POOO1G.h1G.hOOOO1G/i1G/iO$AvQ!bO,5<iO$BOQ!fO1G4jOOQO1G4p1G4pO%[QlO,5?OO$BYQ`O1G5zO$BbQ`O1G6YO$BjQ!fO1G6ZO9eQ`O,5?UO$BtQ!0MxO1G6WO%[QlO1G6WO$CUQ!0LrO1G6WO$CgQ`O1G6VO$CgQ`O1G6VO9eQ`O1G6VO$CoQ`O,5?XO9eQ`O,5?XOOQO,5?X,5?XO$DTQ`O,5?XO$+YQ`O,5?XOOQO-E<k-E<kOOQS1G0a1G0aOOQS1G0c1G0cO#.lQ`O1G0cOOQ[7+(e7+(eO!&zQMhO7+(eO%[QlO7+(eO$DcQ`O7+(eO$DnQMhO7+(eO$D|Q!0MzO,5=XO$GXQ!0MzO,5=ZO$IdQ!0MzO,5=XO$KuQ!0MzO,5=ZO$NWQ!0MzO,59uO%!]Q!0MzO,5<kO%$hQ!0MzO,5<mO%&sQ!0MzO,5<{OOQ!0Lf7+&a7+&aO%)UQ!0MxO7+&aO%)xQlO'#IfO%*VQ`O,5@cO%*_Q!fO,5@cOOQ!0Lf1G0P1G0PO%*iQ`O7+&jOOQ!0Lf7+&j7+&jO%*nQ?MtO,5:fO%[QlO7+&zO%*xQ?MtO,5:bO%+VQ?MtO,5:jO%+aQ?MtO,5:lO%+kQMhO'#IiO%+uQ`O,5@hOOQ!0Lh1G0d1G0dOOQO1G1r1G1rOOQO1G1s1G1sO%+}Q!jO,5<ZO!)[QlO,5<YOOQO-E<l-E<lOOQ!0Lf7+'Y7+'YOOOW7+'e7+'eOOOW1G1|1G1|O%,YQ`O1G1|OOQ!0Lf1G2O1G2OOOOO,59o,59oO%,_Q!dO,59oOOOO-E<`-E<`OOQ!0Lh1G/X1G/XO%,fQ!0MxO7+'kOOQ!0Lh,5?^,5?^O%-YQMhO1G2fP%-aQ`O'#IrPOQ!0Lh-E<p-E<pO%-}QMjO,5?aOOQ!0Lh-E<s-E<sO%.pQMjO,5?cOOQ!0Lh-E<u-E<uO%.zQ!dO1G2wO%/RQ!dO'#CrO%/iQMhO'#KSO$$wQlO'#JvOOQ!0Lh1G2_1G2_O%/sQ`O'#IqO%0[Q`O,5@vO%0[Q`O,5@vO%0dQ`O,5@vO%0oQ`O,5@vOOQO1G2a1G2aO%0}QMjO1G2`O$+YQ`O'#K[O!,TQMhO1G2`O%1_Q(CWO'#IsO%1lQ`O,5@wO!&zQMhO,5@wO%1tQ!dO,5@wOOQ!0Lh1G2d1G2dO%4UQ!fO'#CiO%4`Q`O,5=POOQ!0Lb,5<},5<}O%4hQpO,5<}OOQ!0Lb,5=O,5=OOCwQ`O,5<}O%4sQpO,5<}OOQ!0Lb,5=R,5=RO$+YQ`O,5=VOOQO,5?`,5?`OOQO-E<r-E<rOOQ!0Lp1G2h1G2hO#$`QpO,5<}O$$wQlO,5=PO%5RQ`O,5=OO%5^QpO,5=OO!,TQMhO'#IuO%6WQMjO1G2sO!,TQMhO'#IwO%6yQMjO1G2uO%7TQMjO1G5qO%7_QMjO1G5qOOQO,5?e,5?eOOQO-E<w-E<wOOQO1G.{1G.{O!,TQMhO1G5qO!,TQMhO1G5qO!:]QpO,59wO%[QlO,59wOOQ!0Lh,5<j,5<jO%7lQ`O1G2ZO!,TQMhO1G2bO%7qQ!0MxO7+'mOOQ!0Lf7+'m7+'mO!$wQlO7+'mO%8eQ`O,5;`OOQ!0Lb,5?g,5?gOOQ!0Lb-E<y-E<yO%8jQ!dO'#K^O#(ZQ`O7+(eO4UQ!fO7+(eO$DfQ`O7+(eO%8tQ!0MvO'#CiO%9XQ!0MvO,5=SO%9lQ`O,5=SO%9tQ`O,5=SOOQ!0Lb1G5o1G5oOOQ[7+$a7+$aO!ByQ!0LrO7+$aO!CUQpO7+$aO!$wQlO7+&aO%9yQ`O'#JQO%:bQ`O,5APOOQO1G3h1G3hO9kQ`O,5APO%:bQ`O,5APO%:jQ`O,5APOOQO,5?m,5?mOOQO-E=P-E=POOQ!0Lf7+'T7+'TO%:oQ`O7+)QO9uQ!0LrO7+)QO9kQ`O7+)QO@zQ`O7+)QO%:tQ`O7+)QOOQ[7+)Q7+)QOOQ[7+(p7+(pO%:yQ!0MvO7+(mO!&zQMhO7+(mO!E^Q`O7+(nOOQ[7+(n7+(nO!&zQMhO7+(nO%;TQ`O'#KbO%;`Q`O,5=lOOQO,5?i,5?iOOQO-E<{-E<{OOQ[7+(s7+(sO%<rQpO'#HZOOQ[1G3`1G3`O!&zQMhO1G3`O%[QlO1G3`O%<yQ`O1G3`O%=UQMhO1G3`O9uQ!0LrO1G3bO$%dQ`O1G3bO9`Q`O1G3bO!CUQpO1G3bO!C^QMhO1G3bO%=dQ`O'#JPO%=xQ`O,5@}O%>QQpO,5@}OOQ!0Lb1G3c1G3cOOQ[7+$V7+$VO@zQ`O7+$VO9uQ!0LrO7+$VO%>]Q`O7+$VO%[QlO1G6lO%[QlO1G6mO%>bQ!0LrO1G6lO%>lQlO1G3kO%>sQ`O1G3kO%>xQlO1G3kOOQ[7+)T7+)TO9uQ!0LrO7+)_O`QlO7+)aOOQ['#Kh'#KhOOQ['#JS'#JSO%?PQlO,5>`OOQ[,5>`,5>`O%[QlO'#HuO%?^Q`O'#HwOOQ[,5>f,5>fO9eQ`O,5>fOOQ[,5>h,5>hOOQ[7+)j7+)jOOQ[7+)p7+)pOOQ[7+)t7+)tOOQ[7+)v7+)vO%?cQpO1G5|O%?}Q?MtO1G0zO%@XQ`O1G0zOOQO1G/s1G/sO%@dQ?MtO1G/sO?YQ`O1G/sO!)[QlO'#DmOOQO,5?P,5?POOQO-E<c-E<cOOQO,5?V,5?VOOQO-E<i-E<iO!CUQpO1G/sOOQO-E<e-E<eOOQ!0Ln1G0]1G0]OOQ!0Lf7+%u7+%uO#(ZQ`O7+%uOOQ!0Lf7+&`7+&`O?YQ`O7+&`O!CUQpO7+&`OOQO7+%x7+%xO$AlQ!0MxO7+&XOOQO7+&X7+&XO%[QlO7+&XO%@nQ!0LrO7+&XO!ByQ!0LrO7+%xO!CUQpO7+%xO%@yQ!0LrO7+&XO%AXQ!0MxO7++rO%[QlO7++rO%AiQ`O7++qO%AiQ`O7++qOOQO1G4s1G4sO9eQ`O1G4sO%AqQ`O1G4sOOQS7+%}7+%}O#(ZQ`O<<LPO4UQ!fO<<LPO%BPQ`O<<LPOOQ[<<LP<<LPO!&zQMhO<<LPO%[QlO<<LPO%BXQ`O<<LPO%BdQ!0MzO,5?aO%DoQ!0MzO,5?cO%FzQ!0MzO1G2`O%I]Q!0MzO1G2sO%KhQ!0MzO1G2uO%MsQ!fO,5?QO%[QlO,5?QOOQO-E<d-E<dO%M}Q`O1G5}OOQ!0Lf<<JU<<JUO%NVQ?MtO1G0uO&!^Q?MtO1G1PO&!eQ?MtO1G1PO&$fQ?MtO1G1PO&$mQ?MtO1G1PO&&nQ?MtO1G1PO&(oQ?MtO1G1PO&(vQ?MtO1G1PO&(}Q?MtO1G1PO&+OQ?MtO1G1PO&+VQ?MtO1G1PO&+^Q!0MxO<<JfO&-UQ?MtO1G1PO&.RQ?MvO1G1PO&/UQ?MvO'#JlO&1[Q?MtO1G1cO&1iQ?MtO1G0UO&1sQMjO,5?TOOQO-E<g-E<gO!)[QlO'#FqOOQO'#KZ'#KZOOQO1G1u1G1uO&1}Q`O1G1tO&2SQ?MtO,5?[OOOW7+'h7+'hOOOO1G/Z1G/ZO&2^Q!dO1G4xOOQ!0Lh7+(Q7+(QP!&zQMhO,5?^O!,TQMhO7+(cO&2eQ`O,5?]O9eQ`O,5?]O$+YQ`O,5?]OOQO-E<o-E<oO&2sQ`O1G6bO&2sQ`O1G6bO&2{Q`O1G6bO&3WQMjO7+'zO&3hQ!dO,5?_O&3rQ`O,5?_O!&zQMhO,5?_OOQO-E<q-E<qO&3wQ!dO1G6cO&4RQ`O1G6cO&4ZQ`O1G2kO!&zQMhO1G2kOOQ!0Lb1G2i1G2iOOQ!0Lb1G2j1G2jO%4hQpO1G2iO!CUQpO1G2iOCwQ`O1G2iOOQ!0Lb1G2q1G2qO&4`QpO1G2iO&4nQ`O1G2kO$+YQ`O1G2jOCwQ`O1G2jO$$wQlO1G2kO&4vQ`O1G2jO&5jQMjO,5?aOOQ!0Lh-E<t-E<tO&6]QMjO,5?cOOQ!0Lh-E<v-E<vO!,TQMhO7++]O&6gQMjO7++]O&6qQMjO7++]OOQ!0Lh1G/c1G/cO&7OQ`O1G/cOOQ!0Lh7+'u7+'uO&7TQMjO7+'|O&7eQ!0MxO<<KXOOQ!0Lf<<KX<<KXO&8XQ`O1G0zO!&zQMhO'#IzO&8^Q`O,5@xO&:`Q!fO<<LPO!&zQMhO1G2nO&:gQ!0LrO1G2nOOQ[<<G{<<G{O!ByQ!0LrO<<G{O&:xQ!0MxO<<I{OOQ!0Lf<<I{<<I{OOQO,5?l,5?lO&;lQ`O,5?lO&;qQ`O,5?lOOQO-E=O-E=OO&<PQ`O1G6kO&<PQ`O1G6kO9kQ`O1G6kO@zQ`O<<LlOOQ[<<Ll<<LlO&<XQ`O<<LlO9uQ!0LrO<<LlO9kQ`O<<LlOOQ[<<LX<<LXO%:yQ!0MvO<<LXOOQ[<<LY<<LYO!E^Q`O<<LYO&<^QpO'#I|O&<iQ`O,5@|O!)[QlO,5@|OOQ[1G3W1G3WOOQO'#JO'#JOO9uQ!0LrO'#JOO&<qQpO,5=uOOQ[,5=u,5=uO&<xQpO'#EgO&=PQpO'#GeO&=UQ`O7+(zO&=ZQ`O7+(zOOQ[7+(z7+(zO!&zQMhO7+(zO%[QlO7+(zO&=cQ`O7+(zOOQ[7+(|7+(|O9uQ!0LrO7+(|O$%dQ`O7+(|O9`Q`O7+(|O!CUQpO7+(|O&=nQ`O,5?kOOQO-E<}-E<}OOQO'#H^'#H^O&=yQ`O1G6iO9uQ!0LrO<<GqOOQ[<<Gq<<GqO@zQ`O<<GqO&>RQ`O7+,WO&>WQ`O7+,XO%[QlO7+,WO%[QlO7+,XOOQ[7+)V7+)VO&>]Q`O7+)VO&>bQlO7+)VO&>iQ`O7+)VOOQ[<<Ly<<LyOOQ[<<L{<<L{OOQ[-E=Q-E=QOOQ[1G3z1G3zO&>nQ`O,5>aOOQ[,5>c,5>cO&>sQ`O1G4QO9eQ`O7+&fO!)[QlO7+&fOOQO7+%_7+%_O&>xQ?MtO1G6ZO?YQ`O7+%_OOQ!0Lf<<Ia<<IaOOQ!0Lf<<Iz<<IzO?YQ`O<<IzOOQO<<Is<<IsO$AlQ!0MxO<<IsO%[QlO<<IsOOQO<<Id<<IdO!ByQ!0LrO<<IdO&?SQ!0LrO<<IsO&?_Q!0MxO<= ^O&?oQ`O<= ]OOQO7+*_7+*_O9eQ`O7+*_OOQ[ANAkANAkO&?wQ!fOANAkO!&zQMhOANAkO#(ZQ`OANAkO4UQ!fOANAkO&@OQ`OANAkO%[QlOANAkO&@WQ!0MzO7+'zO&BiQ!0MzO,5?aO&DtQ!0MzO,5?cO&GPQ!0MzO7+'|O&IbQ!fO1G4lO&IlQ?MtO7+&aO&KpQ?MvO,5=XO&MwQ?MvO,5=ZO&NXQ?MvO,5=XO&NiQ?MvO,5=ZO&NyQ?MvO,59uO'#PQ?MvO,5<kO'%SQ?MvO,5<mO''hQ?MvO,5<{O')^Q?MtO7+'kO')kQ?MtO7+'mO')xQ`O,5<]OOQO7+'`7+'`OOQ!0Lh7+*d7+*dO')}QMjO<<K}OOQO1G4w1G4wO'*UQ`O1G4wO'*aQ`O1G4wO'*oQ`O7++|O'*oQ`O7++|O!&zQMhO1G4yO'*wQ!dO1G4yO'+RQ`O7++}O'+ZQ`O7+(VO'+fQ!dO7+(VOOQ!0Lb7+(T7+(TOOQ!0Lb7+(U7+(UO!CUQpO7+(TOCwQ`O7+(TO'+pQ`O7+(VO!&zQMhO7+(VO$+YQ`O7+(UO'+uQ`O7+(VOCwQ`O7+(UO'+}QMjO<<NwO!,TQMhO<<NwOOQ!0Lh7+$}7+$}O',XQ!dO,5?fOOQO-E<x-E<xO',cQ!0MvO7+(YO!&zQMhO7+(YOOQ[AN=gAN=gO9kQ`O1G5WOOQO1G5W1G5WO',sQ`O1G5WO',xQ`O7+,VO',xQ`O7+,VO9uQ!0LrOANBWO@zQ`OANBWOOQ[ANBWANBWO'-QQ`OANBWOOQ[ANAsANAsOOQ[ANAtANAtO'-VQ`O,5?hOOQO-E<z-E<zO'-bQ?MtO1G6hOOQO,5?j,5?jOOQO-E<|-E<|OOQ[1G3a1G3aO'-lQ`O,5=POOQ[<<Lf<<LfO!&zQMhO<<LfO&=UQ`O<<LfO'-qQ`O<<LfO%[QlO<<LfOOQ[<<Lh<<LhO9uQ!0LrO<<LhO$%dQ`O<<LhO9`Q`O<<LhO'-yQpO1G5VO'.UQ`O7+,TOOQ[AN=]AN=]O9uQ!0LrOAN=]OOQ[<= r<= rOOQ[<= s<= sO'.^Q`O<= rO'.cQ`O<= sOOQ[<<Lq<<LqO'.hQ`O<<LqO'.mQlO<<LqOOQ[1G3{1G3{O?YQ`O7+)lO'.tQ`O<<JQO'/PQ?MtO<<JQOOQO<<Hy<<HyOOQ!0LfAN?fAN?fOOQOAN?_AN?_O$AlQ!0MxOAN?_OOQOAN?OAN?OO%[QlOAN?_OOQO<<My<<MyOOQ[G27VG27VO!&zQMhOG27VO#(ZQ`OG27VO'/ZQ!fOG27VO4UQ!fOG27VO'/bQ`OG27VO'/jQ?MtO<<JfO'/wQ?MvO1G2`O'1mQ?MvO,5?aO'3pQ?MvO,5?cO'5sQ?MvO1G2sO'7vQ?MvO1G2uO'9yQ?MtO<<KXO':WQ?MtO<<I{OOQO1G1w1G1wO!,TQMhOANAiOOQO7+*c7+*cO':eQ`O7+*cO':pQ`O<= hO':xQ!dO7+*eOOQ!0Lb<<Kq<<KqO$+YQ`O<<KqOCwQ`O<<KqO';SQ`O<<KqO!&zQMhO<<KqOOQ!0Lb<<Ko<<KoO!CUQpO<<KoO';_Q!dO<<KqOOQ!0Lb<<Kp<<KpO';iQ`O<<KqO!&zQMhO<<KqO$+YQ`O<<KpO';nQMjOANDcO';xQ!0MvO<<KtOOQO7+*r7+*rO9kQ`O7+*rO'<YQ`O<= qOOQ[G27rG27rO9uQ!0LrOG27rO@zQ`OG27rO!)[QlO1G5SO'<bQ`O7+,SO'<jQ`O1G2kO&=UQ`OANBQOOQ[ANBQANBQO!&zQMhOANBQO'<oQ`OANBQOOQ[ANBSANBSO9uQ!0LrOANBSO$%dQ`OANBSOOQO'#H_'#H_OOQO7+*q7+*qOOQ[G22wG22wOOQ[ANE^ANE^OOQ[ANE_ANE_OOQ[ANB]ANB]O'<wQ`OANB]OOQ[<<MW<<MWO!)[QlOAN?lOOQOG24yG24yO$AlQ!0MxOG24yO#(ZQ`OLD,qOOQ[LD,qLD,qO!&zQMhOLD,qO'<|Q!fOLD,qO'=TQ?MvO7+'zO'>yQ?MvO,5?aO'@|Q?MvO,5?cO'CPQ?MvO7+'|O'DuQMjOG27TOOQO<<M}<<M}OOQ!0LbANA]ANA]O$+YQ`OANA]OCwQ`OANA]O'EVQ!dOANA]OOQ!0LbANAZANAZO'E^Q`OANA]O!&zQMhOANA]O'EiQ!dOANA]OOQ!0LbANA[ANA[OOQO<<N^<<N^OOQ[LD-^LD-^O9uQ!0LrOLD-^O'EsQ?MtO7+*nOOQO'#Gf'#GfOOQ[G27lG27lO&=UQ`OG27lO!&zQMhOG27lOOQ[G27nG27nO9uQ!0LrOG27nOOQ[G27wG27wO'E}Q?MtOG25WOOQOLD*eLD*eOOQ[!$(!]!$(!]O#(ZQ`O!$(!]O!&zQMhO!$(!]O'FXQ!0MzOG27TOOQ!0LbG26wG26wO$+YQ`OG26wO'HjQ`OG26wOCwQ`OG26wO'HuQ!dOG26wO!&zQMhOG26wOOQ[!$(!x!$(!xOOQ[LD-WLD-WO&=UQ`OLD-WOOQ[LD-YLD-YOOQ[!)9Ew!)9EwO#(ZQ`O!)9EwOOQ!0LbLD,cLD,cO$+YQ`OLD,cOCwQ`OLD,cO'H|Q`OLD,cO'IXQ!dOLD,cOOQ[!$(!r!$(!rOOQ[!.K;c!.K;cO'I`Q?MvOG27TOOQ!0Lb!$( }!$( }O$+YQ`O!$( }OCwQ`O!$( }O'KUQ`O!$( }OOQ!0Lb!)9Ei!)9EiO$+YQ`O!)9EiOCwQ`O!)9EiOOQ!0Lb!.K;T!.K;TO$+YQ`O!.K;TOOQ!0Lb!4/0o!4/0oO!)[QlO'#DzO1PQ`O'#EXO'KaQ!fO'#JrO'KhQ!L^O'#DvO'KoQlO'#EOO'KvQ!fO'#CiO'N^Q!fO'#CiO!)[QlO'#EQO'NnQlO,5;ZO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO'#IpO(!qQ`O,5<iO!)[QlO,5;eO(!yQMhO,5;eO($dQMhO,5;eO!)[QlO,5;wO!&zQMhO'#GmO(!yQMhO'#GmO!&zQMhO'#GoO(!yQMhO'#GoO1SQ`O'#DZO1SQ`O'#DZO!&zQMhO'#GPO(!yQMhO'#GPO!&zQMhO'#GRO(!yQMhO'#GRO!&zQMhO'#GaO(!yQMhO'#GaO!)[QlO,5:jO($kQpO'#D_O($uQpO'#JvO!)[QlO,5@oO'NnQlO1G0uO(%PQ?MtO'#CiO!)[QlO1G2PO!&zQMhO'#IuO(!yQMhO'#IuO!&zQMhO'#IwO(!yQMhO'#IwO(%ZQ!dO'#CrO!&zQMhO,5<tO(!yQMhO,5<tO'NnQlO1G2RO!)[QlO7+&zO!&zQMhO1G2`O(!yQMhO1G2`O!&zQMhO'#IuO(!yQMhO'#IuO!&zQMhO'#IwO(!yQMhO'#IwO!&zQMhO1G2bO(!yQMhO1G2bO'NnQlO7+'mO'NnQlO7+&aO!&zQMhOANAiO(!yQMhOANAiO(%nQ`O'#EoO(%sQ`O'#EoO(%{Q`O'#F]O(&QQ`O'#EyO(&VQ`O'#KTO(&bQ`O'#KRO(&mQ`O,5;ZO(&rQMjO,5<eO(&yQ`O'#GYO('OQ`O'#GYO('TQ`O,5<eO(']Q`O,5<gO('eQ`O,5;ZO('mQ?MtO1G1`O('tQ`O,5<tO('yQ`O,5<tO((OQ`O,5<vO((TQ`O,5<vO((YQ`O1G2RO((_Q`O1G0uO((dQMjO<<K}O((kQMjO<<K}O((rQMhO'#F|O9`Q`O'#F{OAuQ`O'#EnO!)[QlO,5;tO!3oQ`O'#GYO!3oQ`O'#GYO!3oQ`O'#G[O!3oQ`O'#G[O!,TQMhO7+(cO!,TQMhO7+(cO%.zQ!dO1G2wO%.zQ!dO1G2wO!&zQMhO,5=]O!&zQMhO,5=]",
		stateData: "()x~O'|OS'}OSTOS(ORQ~OPYOQYOSfOY!VOaqOdzOeyOl!POpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!uwO!xxO!|]O$W|O$niO%h}O%j!QO%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO%y!UO&W!WO&^!XO&`!YO&b!ZO&d![O&g!]O&m!^O&s!_O&u!`O&w!aO&y!bO&{!cO(TSO(VTO(YUO(aVO(o[O~OWtO~P`OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oa!wOs!nO!S!oO!b!yO!c!vO!d!vO!|<VO#T!pO#U!pO#V!xO#W!pO#X!pO#[!zO#]!zO(U!lO(VTO(YUO(e!mO(o!sO~O(O!{O~OP]XR]X[]Xa]Xj]Xr]X!Q]X!S]X!]]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X'z]X(a]X(r]X(y]X(z]X~O!g%RX~P(qO_!}O(V#PO(W!}O(X#PO~O_#QO(X#PO(Y#PO(Z#QO~Ox#SO!U#TO(b#TO(c#VO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T<ZO(VTO(YUO(aVO(o[O~O![#ZO!]#WO!Y(hP!Y(vP~P+}O!^#cO~P`OPYOQYOSfOd!jOe!iOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(VTO(YUO(aVO(o[O~Op#mO![#iO!|]O#i#lO#j#iO(T<[O!k(sP~P.iO!l#oO(T#nO~O!x#sO!|]O%h#tO~O#k#uO~O!g#vO#k#uO~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!]$_O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~Oa(fX'z(fX'w(fX!k(fX!Y(fX!_(fX%i(fX!g(fX~P1qO#S$dO#`$eO$Q$eOP(gXR(gX[(gXj(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX!_(gX%i(gX~Oa(gX'z(gX'w(gX!Y(gX!k(gXv(gX!g(gX~P4UO#`$eO~O$]$hO$_$gO$f$mO~OSfO!_$nO$i$oO$k$qO~Oh%VOj%dOk%dOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#j%cO$W%`O$t%^O$v%_O$y%aO(T$sO(VTO(YUO(a$uO(y$}O(z%POg(^P~Ol%[O~P7eO!l%eO~O!S%hO!_%iO(T%gO~O!g%mO~Oa%nO'z%nO~O!Q%rO~P%[O(U!lO~P%[O%n%vO~P%[Oh%VO!l%eO(T%gO(U!lO~Oe%}O!l%eO(T%gO~Oj$RO~O!_&PO(T%gO(U!lO(VTO(YUO`)WP~O!Q&SO!l&RO%j&VO&T&WO~P;SO!x#sO~O%s&YO!S)SX!_)SX(T)SX~O(T&ZO~Ol!PO!u&`O%j!QO%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO~Od&eOe&dO!x&bO%h&cO%{&aO~P<bOd&hOeyOl!PO!_&gO!u&`O!xxO!|]O%h}O%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO%y!UO~Ob&kO#`&nO%j&iO(U!lO~P=gO!l&oO!u&sO~O!l#oO~O!_XO~Oa%nO'x&{O'z%nO~Oa%nO'x'OO'z%nO~Oa%nO'x'QO'z%nO~O'w]X!Y]Xv]X!k]X&[]X!_]X%i]X!g]X~P(qO!b'_O!c'WO!d'WO(U!lO(VTO(YUO~Os'UO!S'TO!['XO(e'SO!^(iP!^(xP~P@nOn'bO!_'`O(T%gO~Oe'gO!l%eO(T%gO~O!Q&SO!l&RO~Os!nO!S!oO!|<VO#T!pO#U!pO#W!pO#X!pO(U!lO(VTO(YUO(e!mO(o!sO~O!b'mO!c'lO!d'lO#V!pO#['nO#]'nO~PBYOa%nOh%VO!g#vO!l%eO'z%nO(r'pO~O!p'tO#`'rO~PChOs!nO!S!oO(VTO(YUO(e!mO(o!sO~O!_XOs(mX!S(mX!b(mX!c(mX!d(mX!|(mX#T(mX#U(mX#V(mX#W(mX#X(mX#[(mX#](mX(U(mX(V(mX(Y(mX(e(mX(o(mX~O!c'lO!d'lO(U!lO~PDWO(P'xO(Q'xO(R'zO~O_!}O(V'|O(W!}O(X'|O~O_#QO(X'|O(Y'|O(Z#QO~Ov(OO~P%[Ox#SO!U#TO(b#TO(c(RO~O![(TO!Y'WX!Y'^X!]'WX!]'^X~P+}O!](VO!Y(hX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!](VO!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~O!Y(hX~PHRO!Y([O~O!Y(uX!](uX!g(uX!k(uX(r(uX~O#`(uX#k#dX!^(uX~PJUO#`(]O!Y(wX!](wX~O!](^O!Y(vX~O!Y(aO~O#`$eO~PJUO!^(bO~P`OR#zO!Q#yO!S#{O!l#xO(aVOP!na[!naj!nar!na!]!na!p!na#R!na#n!na#o!na#p!na#q!na#r!na#s!na#t!na#u!na#v!na#x!na#z!na#{!na(r!na(y!na(z!na~Oa!na'z!na'w!na!Y!na!k!nav!na!_!na%i!na!g!na~PKlO!k(cO~O!g#vO#`(dO(r'pO!](tXa(tX'z(tX~O!k(tX~PNXO!S%hO!_%iO!|]O#i(iO#j(hO(T%gO~O!](jO!k(sX~O!k(lO~O!S%hO!_%iO#j(hO(T%gO~OP(gXR(gX[(gXj(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX~O!g#vO!k(gX~P! uOR(nO!Q(mO!l#xO#S$dO!|!{a!S!{a~O!x!{a%h!{a!_!{a#i!{a#j!{a(T!{a~P!#vO!x(rO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~O#k(xO~O![(zO!k(kP~P%[O(e(|O(o[O~O!S)OO!l#xO(e(|O(o[O~OP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_!eO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(T)]O(VTO(YUO(aVO(o[O~O!]$_Oa$qa'z$qa'w$qa!k$qa!Y$qa!_$qa%i$qa!g$qa~Ol)dO~P!&zOh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#j%cO$W%`O$t%^O$v%_O$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~Og(pP~P!,TO!Q)iO!g)hO!_$^X$Z$^X$]$^X$_$^X$f$^X~O!g)hO!_({X$Z({X$]({X$_({X$f({X~O!Q)iO~P!.^O!Q)iO!_({X$Z({X$]({X$_({X$f({X~O!_)kO$Z)oO$])jO$_)jO$f)pO~O![)sO~P!)[O$]$hO$_$gO$f)wO~On$zX!Q$zX#S$zX'y$zX(y$zX(z$zX~OgmXg$zXnmX!]mX#`mX~P!0SOx)yO(b)zO(c)|O~On*VO!Q*OO'y*PO(y$}O(z%PO~Og)}O~P!1WOg*WO~Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<sO!S*YO!_*ZO!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(VTO(YUO(a$uO(y$}O(z%PO~Op*`O![*^O(T*XO!k)OP~P!1uO#k*aO~O!l*bO~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(T*dO(VTO(YUO(a$uO(y$}O(z%PO~O![*gO!Y)PP~P!3tOr*sOs!nO!S*iO!b*qO!c*kO!d*kO!l*bO#[*rO%`*mO(U!lO(VTO(YUO(e!mO~O!^*pO~P!5iO#S$dOn(`X!Q(`X'y(`X(y(`X(z(`X!](`X#`(`X~Og(`X$O(`X~P!6kOn*xO#`*wOg(_X!](_X~O!]*yOg(^X~Oj%dOk%dOl%dO(T&ZOg(^P~Os*|O~Og)}O(T&ZO~O!l+SO~O(T(vO~Op+WO!S%hO![#iO!_%iO!|]O#i#lO#j#iO(T%gO!k(sP~O!g#vO#k+XO~O!S%hO![+ZO!](^O!_%iO(T%gO!Y(vP~Os'[O!S+]O![+[O(VTO(YUO(e(|O~O!^(xP~P!9|O!]+^Oa)TX'z)TX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~Oa!ja!]!ja'z!ja'w!ja!Y!ja!k!jav!ja!_!ja%i!ja!g!ja~P!:tOR#zO!Q#yO!S#{O!l#xO(aVOP!ra[!raj!rar!ra!]!ra!p!ra#R!ra#n!ra#o!ra#p!ra#q!ra#r!ra#s!ra#t!ra#u!ra#v!ra#x!ra#z!ra#{!ra(r!ra(y!ra(z!ra~Oa!ra'z!ra'w!ra!Y!ra!k!rav!ra!_!ra%i!ra!g!ra~P!=[OR#zO!Q#yO!S#{O!l#xO(aVOP!ta[!taj!tar!ta!]!ta!p!ta#R!ta#n!ta#o!ta#p!ta#q!ta#r!ta#s!ta#t!ta#u!ta#v!ta#x!ta#z!ta#{!ta(r!ta(y!ta(z!ta~Oa!ta'z!ta'w!ta!Y!ta!k!tav!ta!_!ta%i!ta!g!ta~P!?rOh%VOn+gO!_'`O%i+fO~O!g+iOa(]X!_(]X'z(]X!](]X~Oa%nO!_XO'z%nO~Oh%VO!l%eO~Oh%VO!l%eO(T%gO~O!g#vO#k(xO~Ob+tO%j+uO(T+qO(VTO(YUO!^)XP~O!]+vO`)WX~O[+zO~O`+{O~O!_&PO(T%gO(U!lO`)WP~O%j,OO~P;SOh%VO#`,SO~Oh%VOn,VO!_$|O~O!_,XO~O!Q,ZO!_XO~O%n%vO~O!x,`O~Oe,eO~Ob,fO(T#nO(VTO(YUO!^)VP~Oe%}O~O%j!QO(T&ZO~P=gO[,kO`,jO~OPYOQYOSfOdzOeyOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!iuO!lZO!oYO!pYO!qYO!svO!xxO!|]O$niO%h}O(VTO(YUO(aVO(o[O~O!_!eO!u!gO$W!kO(T!dO~P!FyO`,jOa%nO'z%nO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oa,pOl!OO!uwO%l!OO%m!OO%n!OO~P!IcO!l&oO~O&^,vO~O!_,xO~O&o,zO&q,{OP&laQ&laS&laY&laa&lad&lae&lal&lap&lar&las&lat&laz&la|&la!O&la!S&la!W&la!X&la!_&la!i&la!l&la!o&la!p&la!q&la!s&la!u&la!x&la!|&la$W&la$n&la%h&la%j&la%l&la%m&la%n&la%q&la%s&la%v&la%w&la%y&la&W&la&^&la&`&la&b&la&d&la&g&la&m&la&s&la&u&la&w&la&y&la&{&la'w&la(T&la(V&la(Y&la(a&la(o&la!^&la&e&lab&la&j&la~O(T-QO~Oh!eX!]!RX!^!RX!g!RX!g!eX!l!eX#`!RX~O!]!eX!^!eX~P#!iO!g-VO#`-UOh(jX!]#hX!^#hX!g(jX!l(jX~O!](jX!^(jX~P##[Oh%VO!g-XO!l%eO!]!aX!^!aX~Os!nO!S!oO(VTO(YUO(e!mO~OP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_!eO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(VTO(YUO(aVO(o[O~O(T=QO~P#$qO!]-]O!^(iX~O!^-_O~O!g-VO#`-UO!]#hX!^#hX~O!]-`O!^(xX~O!^-bO~O!c-cO!d-cO(U!lO~P#$`O!^-fO~P'_On-iO!_'`O~O!Y-nO~Os!{a!b!{a!c!{a!d!{a#T!{a#U!{a#V!{a#W!{a#X!{a#[!{a#]!{a(U!{a(V!{a(Y!{a(e!{a(o!{a~P!#vO!p-sO#`-qO~PChO!c-uO!d-uO(U!lO~PDWOa%nO#`-qO'z%nO~Oa%nO!g#vO#`-qO'z%nO~Oa%nO!g#vO!p-sO#`-qO'z%nO(r'pO~O(P'xO(Q'xO(R-zO~Ov-{O~O!Y'Wa!]'Wa~P!:tO![.PO!Y'WX!]'WX~P%[O!](VO!Y(ha~O!Y(ha~PHRO!](^O!Y(va~O!S%hO![.TO!_%iO(T%gO!Y'^X!]'^X~O#`.VO!](ta!k(taa(ta'z(ta~O!g#vO~P#,wO!](jO!k(sa~O!S%hO!_%iO#j.ZO(T%gO~Op.`O!S%hO![.]O!_%iO!|]O#i._O#j.]O(T%gO!]'aX!k'aX~OR.dO!l#xO~Oh%VOn.gO!_'`O%i.fO~Oa#ci!]#ci'z#ci'w#ci!Y#ci!k#civ#ci!_#ci%i#ci!g#ci~P!:tOn>]O!Q*OO'y*PO(y$}O(z%PO~O#k#_aa#_a#`#_a'z#_a!]#_a!k#_a!_#_a!Y#_a~P#/sO#k(`XP(`XR(`X[(`Xa(`Xj(`Xr(`X!S(`X!l(`X!p(`X#R(`X#n(`X#o(`X#p(`X#q(`X#r(`X#s(`X#t(`X#u(`X#v(`X#x(`X#z(`X#{(`X'z(`X(a(`X(r(`X!k(`X!Y(`X'w(`Xv(`X!_(`X%i(`X!g(`X~P!6kO!].tO!k(kX~P!:tO!k.wO~O!Y.yO~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(aVO[#mia#mij#mir#mi!]#mi#R#mi#o#mi#p#mi#q#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#n#mi~P#3cO#n$OO~P#3cOP$[OR#zOr$aO!Q#yO!S#{O!l#xO!p$[O#n$OO#o$PO#p$PO#q$PO(aVO[#mia#mij#mi!]#mi#R#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#r#mi~P#6QO#r$QO~P#6QOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO(aVOa#mi!]#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#v#mi~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO(aVO(z#}Oa#mi!]#mi#z#mi#{#mi'z#mi(r#mi(y#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#x$UO~P#;VO#x#mi~P#;VO#v$SO~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO(aVO(y#|O(z#}Oa#mi!]#mi#{#mi'z#mi(r#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#z#mi~P#={O#z$WO~P#={OP]XR]X[]Xj]Xr]X!Q]X!S]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X!]]X!^]X~O$O]X~P#@jOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO#x<eO#z<gO#{<hO(aVO(r$YO(y#|O(z#}O~O$O.{O~P#BwO#S$dO#`<nO$Q<nO$O(gX!^(gX~P! uOa'da!]'da'z'da'w'da!k'da!Y'dav'da!_'da%i'da!g'da~P!:tO[#mia#mij#mir#mi!]#mi#R#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#n$OO#o$PO#p$PO#q$PO(aVO(y#mi(z#mi~P#EyOn>]O!Q*OO'y*PO(y$}O(z%POP#miR#mi!S#mi!l#mi!p#mi#n#mi#o#mi#p#mi#q#mi(a#mi~P#EyO!]/POg(pX~P!1WOg/RO~Oa$Pi!]$Pi'z$Pi'w$Pi!Y$Pi!k$Piv$Pi!_$Pi%i$Pi!g$Pi~P!:tO$]/SO$_/SO~O$]/TO$_/TO~O!g)hO#`/UO!_$cX$Z$cX$]$cX$_$cX$f$cX~O![/VO~O!_)kO$Z/XO$])jO$_)jO$f/YO~O!]<iO!^(fX~P#BwO!^/ZO~O!g)hO$f({X~O$f/]O~Ov/^O~P!&zOx)yO(b)zO(c/aO~O!S/dO~O(y$}On%aa!Q%aa'y%aa(z%aa!]%aa#`%aa~Og%aa$O%aa~P#L{O(z%POn%ca!Q%ca'y%ca(y%ca!]%ca#`%ca~Og%ca$O%ca~P#MnO!]fX!gfX!kfX!k$zX(rfX~P!0SOp%WO![/mO!](^O(T/lO!Y(vP!Y)PP~P!1uOr*sO!b*qO!c*kO!d*kO!l*bO#[*rO%`*mO(U!lO(VTO(YUO~Os<}O!S/nO![+[O!^*pO(e<|O!^(xP~P$ [O!k/oO~P#/sO!]/pO!g#vO(r'pO!k)OX~O!k/uO~OnoX!QoX'yoX(yoX(zoX~O!g#vO!koX~P$#OOp/wO!S%hO![*^O!_%iO(T%gO!k)OP~O#k/xO~O!Y$zX!]$zX!g%RX~P!0SO!]/yO!Y)PX~P#/sO!g/{O~O!Y/}O~OpkO(T0OO~P.iOh%VOr0TO!g#vO!l%eO(r'pO~O!g+iO~Oa%nO!]0XO'z%nO~O!^0ZO~P!5iO!c0[O!d0[O(U!lO~P#$`Os!nO!S0]O(VTO(YUO(e!mO~O#[0_O~Og%aa!]%aa#`%aa$O%aa~P!1WOg%ca!]%ca#`%ca$O%ca~P!1WOj%dOk%dOl%dO(T&ZOg'mX!]'mX~O!]*yOg(^a~Og0hO~On0jO#`0iOg(_a!](_a~OR0kO!Q0kO!S0lO#S$dOn}a'y}a(y}a(z}a!]}a#`}a~Og}a$O}a~P$(cO!Q*OO'y*POn$sa(y$sa(z$sa!]$sa#`$sa~Og$sa$O$sa~P$)_O!Q*OO'y*POn$ua(y$ua(z$ua!]$ua#`$ua~Og$ua$O$ua~P$*QO#k0oO~Og%Ta!]%Ta#`%Ta$O%Ta~P!1WO!g#vO~O#k0rO~O!]+^Oa)Ta'z)Ta~OR#zO!Q#yO!S#{O!l#xO(aVOP!ri[!rij!rir!ri!]!ri!p!ri#R!ri#n!ri#o!ri#p!ri#q!ri#r!ri#s!ri#t!ri#u!ri#v!ri#x!ri#z!ri#{!ri(r!ri(y!ri(z!ri~Oa!ri'z!ri'w!ri!Y!ri!k!riv!ri!_!ri%i!ri!g!ri~P$+oOh%VOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(VTO(YUO(a$uO(y$}O(z%PO~Op0{O%]0|O(T0zO~P$.VO!g+iOa(]a!_(]a'z(]a!](]a~O#k1SO~O[]X!]fX!^fX~O!]1TO!^)XX~O!^1VO~O[1WO~Ob1YO(T+qO(VTO(YUO~O!_&PO(T%gO`'uX!]'uX~O!]+vO`)Wa~O!k1]O~P!:tO[1`O~O`1aO~O#`1fO~On1iO!_$|O~O(e(|O!^)UP~Oh%VOn1rO!_1oO%i1qO~O[1|O!]1zO!^)VX~O!^1}O~O`2POa%nO'z%nO~O(T#nO(VTO(YUO~O#S$dO#`$eO$Q$eOP(gXR(gX[(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX~Oj2SO&[2TOa(gX~P$3pOj2SO#`$eO&[2TO~Oa2VO~P%[Oa2XO~O&e2[OP&ciQ&ciS&ciY&cia&cid&cie&cil&cip&cir&cis&cit&ciz&ci|&ci!O&ci!S&ci!W&ci!X&ci!_&ci!i&ci!l&ci!o&ci!p&ci!q&ci!s&ci!u&ci!x&ci!|&ci$W&ci$n&ci%h&ci%j&ci%l&ci%m&ci%n&ci%q&ci%s&ci%v&ci%w&ci%y&ci&W&ci&^&ci&`&ci&b&ci&d&ci&g&ci&m&ci&s&ci&u&ci&w&ci&y&ci&{&ci'w&ci(T&ci(V&ci(Y&ci(a&ci(o&ci!^&cib&ci&j&ci~Ob2bO!^2`O&j2aO~P`O!_XO!l2dO~O&q,{OP&liQ&liS&liY&lia&lid&lie&lil&lip&lir&lis&lit&liz&li|&li!O&li!S&li!W&li!X&li!_&li!i&li!l&li!o&li!p&li!q&li!s&li!u&li!x&li!|&li$W&li$n&li%h&li%j&li%l&li%m&li%n&li%q&li%s&li%v&li%w&li%y&li&W&li&^&li&`&li&b&li&d&li&g&li&m&li&s&li&u&li&w&li&y&li&{&li'w&li(T&li(V&li(Y&li(a&li(o&li!^&li&e&lib&li&j&li~O!Y2jO~O!]!aa!^!aa~P#BwOs!nO!S!oO![2pO(e!mO!]'XX!^'XX~P@nO!]-]O!^(ia~O!]'_X!^'_X~P!9|O!]-`O!^(xa~O!^2wO~P'_Oa%nO#`3QO'z%nO~Oa%nO!g#vO#`3QO'z%nO~Oa%nO!g#vO!p3UO#`3QO'z%nO(r'pO~Oa%nO'z%nO~P!:tO!]$_Ov$qa~O!Y'Wi!]'Wi~P!:tO!](VO!Y(hi~O!](^O!Y(vi~O!Y(wi!](wi~P!:tO!](ti!k(tia(ti'z(ti~P!:tO#`3WO!](ti!k(tia(ti'z(ti~O!](jO!k(si~O!S%hO!_%iO!|]O#i3]O#j3[O(T%gO~O!S%hO!_%iO#j3[O(T%gO~On3dO!_'`O%i3cO~Oh%VOn3dO!_'`O%i3cO~O#k%aaP%aaR%aa[%aaa%aaj%aar%aa!S%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa'z%aa(a%aa(r%aa!k%aa!Y%aa'w%aav%aa!_%aa%i%aa!g%aa~P#L{O#k%caP%caR%ca[%caa%caj%car%ca!S%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca'z%ca(a%ca(r%ca!k%ca!Y%ca'w%cav%ca!_%ca%i%ca!g%ca~P#MnO#k%aaP%aaR%aa[%aaa%aaj%aar%aa!S%aa!]%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa'z%aa(a%aa(r%aa!k%aa!Y%aa'w%aa#`%aav%aa!_%aa%i%aa!g%aa~P#/sO#k%caP%caR%ca[%caa%caj%car%ca!S%ca!]%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca'z%ca(a%ca(r%ca!k%ca!Y%ca'w%ca#`%cav%ca!_%ca%i%ca!g%ca~P#/sO#k}aP}a[}aa}aj}ar}a!l}a!p}a#R}a#n}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#x}a#z}a#{}a'z}a(a}a(r}a!k}a!Y}a'w}av}a!_}a%i}a!g}a~P$(cO#k$saP$saR$sa[$saa$saj$sar$sa!S$sa!l$sa!p$sa#R$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#t$sa#u$sa#v$sa#x$sa#z$sa#{$sa'z$sa(a$sa(r$sa!k$sa!Y$sa'w$sav$sa!_$sa%i$sa!g$sa~P$)_O#k$uaP$uaR$ua[$uaa$uaj$uar$ua!S$ua!l$ua!p$ua#R$ua#n$ua#o$ua#p$ua#q$ua#r$ua#s$ua#t$ua#u$ua#v$ua#x$ua#z$ua#{$ua'z$ua(a$ua(r$ua!k$ua!Y$ua'w$uav$ua!_$ua%i$ua!g$ua~P$*QO#k%TaP%TaR%Ta[%Taa%Taj%Tar%Ta!S%Ta!]%Ta!l%Ta!p%Ta#R%Ta#n%Ta#o%Ta#p%Ta#q%Ta#r%Ta#s%Ta#t%Ta#u%Ta#v%Ta#x%Ta#z%Ta#{%Ta'z%Ta(a%Ta(r%Ta!k%Ta!Y%Ta'w%Ta#`%Tav%Ta!_%Ta%i%Ta!g%Ta~P#/sOa#cq!]#cq'z#cq'w#cq!Y#cq!k#cqv#cq!_#cq%i#cq!g#cq~P!:tO![3lO!]'YX!k'YX~P%[O!].tO!k(ka~O!].tO!k(ka~P!:tO!Y3oO~O$O!na!^!na~PKlO$O!ja!]!ja!^!ja~P#BwO$O!ra!^!ra~P!=[O$O!ta!^!ta~P!?rOg']X!]']X~P!,TO!]/POg(pa~OSfO!_4TO$d4UO~O!^4YO~Ov4ZO~P#/sOa$mq!]$mq'z$mq'w$mq!Y$mq!k$mqv$mq!_$mq%i$mq!g$mq~P!:tO!Y4]O~P!&zO!S4^O~O!Q*OO'y*PO(z%POn'ia(y'ia!]'ia#`'ia~Og'ia$O'ia~P%-fO!Q*OO'y*POn'ka(y'ka(z'ka!]'ka#`'ka~Og'ka$O'ka~P%.XO(r$YO~P#/sO!YfX!Y$zX!]fX!]$zX!g%RX#`fX~P!0SOp%WO(T=WO~P!1uOp4bO!S%hO![4aO!_%iO(T%gO!]'eX!k'eX~O!]/pO!k)Oa~O!]/pO!g#vO!k)Oa~O!]/pO!g#vO(r'pO!k)Oa~Og$|i!]$|i#`$|i$O$|i~P!1WO![4jO!Y'gX!]'gX~P!3tO!]/yO!Y)Pa~O!]/yO!Y)Pa~P#/sOP]XR]X[]Xj]Xr]X!Q]X!S]X!Y]X!]]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X~Oj%YX!g%YX~P%2OOj4oO!g#vO~Oh%VO!g#vO!l%eO~Oh%VOr4tO!l%eO(r'pO~Or4yO!g#vO(r'pO~Os!nO!S4zO(VTO(YUO(e!mO~O(y$}On%ai!Q%ai'y%ai(z%ai!]%ai#`%ai~Og%ai$O%ai~P%5oO(z%POn%ci!Q%ci'y%ci(y%ci!]%ci#`%ci~Og%ci$O%ci~P%6bOg(_i!](_i~P!1WO#`5QOg(_i!](_i~P!1WO!k5VO~Oa$oq!]$oq'z$oq'w$oq!Y$oq!k$oqv$oq!_$oq%i$oq!g$oq~P!:tO!Y5ZO~O!]5[O!_)QX~P#/sOa$zX!_$zX%^]X'z$zX!]$zX~P!0SO%^5_OaoX!_oX'zoX!]oX~P$#OOp5`O(T#nO~O%^5_O~Ob5fO%j5gO(T+qO(VTO(YUO!]'tX!^'tX~O!]1TO!^)Xa~O[5kO~O`5lO~O[5pO~Oa%nO'z%nO~P#/sO!]5uO#`5wO!^)UX~O!^5xO~Or6OOs!nO!S*iO!b!yO!c!vO!d!vO!|<VO#T!pO#U!pO#V!pO#W!pO#X!pO#[5}O#]!zO(U!lO(VTO(YUO(e!mO(o!sO~O!^5|O~P%;eOn6TO!_1oO%i6SO~Oh%VOn6TO!_1oO%i6SO~Ob6[O(T#nO(VTO(YUO!]'sX!^'sX~O!]1zO!^)Va~O(VTO(YUO(e6^O~O`6bO~Oj6eO&[6fO~PNXO!k6gO~P%[Oa6iO~Oa6iO~P%[Ob2bO!^6nO&j2aO~P`O!g6pO~O!g6rOh(ji!](ji!^(ji!g(ji!l(jir(ji(r(ji~O!]#hi!^#hi~P#BwO#`6sO!]#hi!^#hi~O!]!ai!^!ai~P#BwOa%nO#`6|O'z%nO~Oa%nO!g#vO#`6|O'z%nO~O!](tq!k(tqa(tq'z(tq~P!:tO!](jO!k(sq~O!S%hO!_%iO#j7TO(T%gO~O!_'`O%i7WO~On7[O!_'`O%i7WO~O#k'iaP'iaR'ia['iaa'iaj'iar'ia!S'ia!l'ia!p'ia#R'ia#n'ia#o'ia#p'ia#q'ia#r'ia#s'ia#t'ia#u'ia#v'ia#x'ia#z'ia#{'ia'z'ia(a'ia(r'ia!k'ia!Y'ia'w'iav'ia!_'ia%i'ia!g'ia~P%-fO#k'kaP'kaR'ka['kaa'kaj'kar'ka!S'ka!l'ka!p'ka#R'ka#n'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#x'ka#z'ka#{'ka'z'ka(a'ka(r'ka!k'ka!Y'ka'w'kav'ka!_'ka%i'ka!g'ka~P%.XO#k$|iP$|iR$|i[$|ia$|ij$|ir$|i!S$|i!]$|i!l$|i!p$|i#R$|i#n$|i#o$|i#p$|i#q$|i#r$|i#s$|i#t$|i#u$|i#v$|i#x$|i#z$|i#{$|i'z$|i(a$|i(r$|i!k$|i!Y$|i'w$|i#`$|iv$|i!_$|i%i$|i!g$|i~P#/sO#k%aiP%aiR%ai[%aia%aij%air%ai!S%ai!l%ai!p%ai#R%ai#n%ai#o%ai#p%ai#q%ai#r%ai#s%ai#t%ai#u%ai#v%ai#x%ai#z%ai#{%ai'z%ai(a%ai(r%ai!k%ai!Y%ai'w%aiv%ai!_%ai%i%ai!g%ai~P%5oO#k%ciP%ciR%ci[%cia%cij%cir%ci!S%ci!l%ci!p%ci#R%ci#n%ci#o%ci#p%ci#q%ci#r%ci#s%ci#t%ci#u%ci#v%ci#x%ci#z%ci#{%ci'z%ci(a%ci(r%ci!k%ci!Y%ci'w%civ%ci!_%ci%i%ci!g%ci~P%6bO!]'Ya!k'Ya~P!:tO!].tO!k(ki~O$O#ci!]#ci!^#ci~P#BwOP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(aVO[#mij#mir#mi#R#mi#o#mi#p#mi#q#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#n#mi~P%NdO#n<_O~P%NdOP$[OR#zOr<kO!Q#yO!S#{O!l#xO!p$[O#n<_O#o<`O#p<`O#q<`O(aVO[#mij#mi#R#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#r#mi~P&!lO#r<aO~P&!lOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO(aVO#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#v#mi~P&$tOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO(aVO(z#}O#z#mi#{#mi$O#mi(r#mi(y#mi!]#mi!^#mi~O#x<eO~P&&uO#x#mi~P&&uO#v<cO~P&$tOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO#x<eO(aVO(y#|O(z#}O#{#mi$O#mi(r#mi!]#mi!^#mi~O#z#mi~P&)UO#z<gO~P&)UOa#|y!]#|y'z#|y'w#|y!Y#|y!k#|yv#|y!_#|y%i#|y!g#|y~P!:tO[#mij#mir#mi#R#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi!]#mi!^#mi~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#n<_O#o<`O#p<`O#q<`O(aVO(y#mi(z#mi~P&,QOn>^O!Q*OO'y*PO(y$}O(z%POP#miR#mi!S#mi!l#mi!p#mi#n#mi#o#mi#p#mi#q#mi(a#mi~P&,QO#S$dOP(`XR(`X[(`Xj(`Xn(`Xr(`X!Q(`X!S(`X!l(`X!p(`X#R(`X#n(`X#o(`X#p(`X#q(`X#r(`X#s(`X#t(`X#u(`X#v(`X#x(`X#z(`X#{(`X$O(`X'y(`X(a(`X(r(`X(y(`X(z(`X!](`X!^(`X~O$O$Pi!]$Pi!^$Pi~P#BwO$O!ri!^!ri~P$+oOg']a!]']a~P!1WO!^7nO~O!]'da!^'da~P#BwO!Y7oO~P#/sO!g#vO(r'pO!]'ea!k'ea~O!]/pO!k)Oi~O!]/pO!g#vO!k)Oi~Og$|q!]$|q#`$|q$O$|q~P!1WO!Y'ga!]'ga~P#/sO!g7vO~O!]/yO!Y)Pi~P#/sO!]/yO!Y)Pi~O!Y7yO~Oh%VOr8OO!l%eO(r'pO~Oj8QO!g#vO~Or8TO!g#vO(r'pO~O!Q*OO'y*PO(z%POn'ja(y'ja!]'ja#`'ja~Og'ja$O'ja~P&5RO!Q*OO'y*POn'la(y'la(z'la!]'la#`'la~Og'la$O'la~P&5tOg(_q!](_q~P!1WO#`8VOg(_q!](_q~P!1WO!Y8WO~Og%Oq!]%Oq#`%Oq$O%Oq~P!1WOa$oy!]$oy'z$oy'w$oy!Y$oy!k$oyv$oy!_$oy%i$oy!g$oy~P!:tO!g6rO~O!]5[O!_)Qa~O!_'`OP$TaR$Ta[$Taj$Tar$Ta!Q$Ta!S$Ta!]$Ta!l$Ta!p$Ta#R$Ta#n$Ta#o$Ta#p$Ta#q$Ta#r$Ta#s$Ta#t$Ta#u$Ta#v$Ta#x$Ta#z$Ta#{$Ta(a$Ta(r$Ta(y$Ta(z$Ta~O%i7WO~P&8fO%^8[Oa%[i!_%[i'z%[i!]%[i~Oa#cy!]#cy'z#cy'w#cy!Y#cy!k#cyv#cy!_#cy%i#cy!g#cy~P!:tO[8^O~Ob8`O(T+qO(VTO(YUO~O!]1TO!^)Xi~O`8dO~O(e(|O!]'pX!^'pX~O!]5uO!^)Ua~O!^8nO~P%;eO(o!sO~P$&YO#[8oO~O!_1oO~O!_1oO%i8qO~On8tO!_1oO%i8qO~O[8yO!]'sa!^'sa~O!]1zO!^)Vi~O!k8}O~O!k9OO~O!k9RO~O!k9RO~P%[Oa9TO~O!g9UO~O!k9VO~O!](wi!^(wi~P#BwOa%nO#`9_O'z%nO~O!](ty!k(tya(ty'z(ty~P!:tO!](jO!k(sy~O%i9bO~P&8fO!_'`O%i9bO~O#k$|qP$|qR$|q[$|qa$|qj$|qr$|q!S$|q!]$|q!l$|q!p$|q#R$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#t$|q#u$|q#v$|q#x$|q#z$|q#{$|q'z$|q(a$|q(r$|q!k$|q!Y$|q'w$|q#`$|qv$|q!_$|q%i$|q!g$|q~P#/sO#k'jaP'jaR'ja['jaa'jaj'jar'ja!S'ja!l'ja!p'ja#R'ja#n'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#x'ja#z'ja#{'ja'z'ja(a'ja(r'ja!k'ja!Y'ja'w'jav'ja!_'ja%i'ja!g'ja~P&5RO#k'laP'laR'la['laa'laj'lar'la!S'la!l'la!p'la#R'la#n'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#x'la#z'la#{'la'z'la(a'la(r'la!k'la!Y'la'w'lav'la!_'la%i'la!g'la~P&5tO#k%OqP%OqR%Oq[%Oqa%Oqj%Oqr%Oq!S%Oq!]%Oq!l%Oq!p%Oq#R%Oq#n%Oq#o%Oq#p%Oq#q%Oq#r%Oq#s%Oq#t%Oq#u%Oq#v%Oq#x%Oq#z%Oq#{%Oq'z%Oq(a%Oq(r%Oq!k%Oq!Y%Oq'w%Oq#`%Oqv%Oq!_%Oq%i%Oq!g%Oq~P#/sO!]'Yi!k'Yi~P!:tO$O#cq!]#cq!^#cq~P#BwO(y$}OP%aaR%aa[%aaj%aar%aa!S%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa$O%aa(a%aa(r%aa!]%aa!^%aa~On%aa!Q%aa'y%aa(z%aa~P&IyO(z%POP%caR%ca[%caj%car%ca!S%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca$O%ca(a%ca(r%ca!]%ca!^%ca~On%ca!Q%ca'y%ca(y%ca~P&LQOn>^O!Q*OO'y*PO(z%PO~P&IyOn>^O!Q*OO'y*PO(y$}O~P&LQOR0kO!Q0kO!S0lO#S$dOP}a[}aj}an}ar}a!l}a!p}a#R}a#n}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#x}a#z}a#{}a$O}a'y}a(a}a(r}a(y}a(z}a!]}a!^}a~O!Q*OO'y*POP$saR$sa[$saj$san$sar$sa!S$sa!l$sa!p$sa#R$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#t$sa#u$sa#v$sa#x$sa#z$sa#{$sa$O$sa(a$sa(r$sa(y$sa(z$sa!]$sa!^$sa~O!Q*OO'y*POP$uaR$ua[$uaj$uan$uar$ua!S$ua!l$ua!p$ua#R$ua#n$ua#o$ua#p$ua#q$ua#r$ua#s$ua#t$ua#u$ua#v$ua#x$ua#z$ua#{$ua$O$ua(a$ua(r$ua(y$ua(z$ua!]$ua!^$ua~On>^O!Q*OO'y*PO(y$}O(z%PO~OP%TaR%Ta[%Taj%Tar%Ta!S%Ta!l%Ta!p%Ta#R%Ta#n%Ta#o%Ta#p%Ta#q%Ta#r%Ta#s%Ta#t%Ta#u%Ta#v%Ta#x%Ta#z%Ta#{%Ta$O%Ta(a%Ta(r%Ta!]%Ta!^%Ta~P''VO$O$mq!]$mq!^$mq~P#BwO$O$oq!]$oq!^$oq~P#BwO!^9oO~O$O9pO~P!1WO!g#vO!]'ei!k'ei~O!g#vO(r'pO!]'ei!k'ei~O!]/pO!k)Oq~O!Y'gi!]'gi~P#/sO!]/yO!Y)Pq~Or9wO!g#vO(r'pO~O[9yO!Y9xO~P#/sO!Y9xO~Oj:PO!g#vO~Og(_y!](_y~P!1WO!]'na!_'na~P#/sOa%[q!_%[q'z%[q!]%[q~P#/sO[:UO~O!]1TO!^)Xq~O`:YO~O#`:ZO!]'pa!^'pa~O!]5uO!^)Ui~P#BwO!S:]O~O!_1oO%i:`O~O(VTO(YUO(e:eO~O!]1zO!^)Vq~O!k:hO~O!k:iO~O!k:jO~O!k:jO~P%[O#`:mO!]#hy!^#hy~O!]#hy!^#hy~P#BwO%i:rO~P&8fO!_'`O%i:rO~O$O#|y!]#|y!^#|y~P#BwOP$|iR$|i[$|ij$|ir$|i!S$|i!l$|i!p$|i#R$|i#n$|i#o$|i#p$|i#q$|i#r$|i#s$|i#t$|i#u$|i#v$|i#x$|i#z$|i#{$|i$O$|i(a$|i(r$|i!]$|i!^$|i~P''VO!Q*OO'y*PO(z%POP'iaR'ia['iaj'ian'iar'ia!S'ia!l'ia!p'ia#R'ia#n'ia#o'ia#p'ia#q'ia#r'ia#s'ia#t'ia#u'ia#v'ia#x'ia#z'ia#{'ia$O'ia(a'ia(r'ia(y'ia!]'ia!^'ia~O!Q*OO'y*POP'kaR'ka['kaj'kan'kar'ka!S'ka!l'ka!p'ka#R'ka#n'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#x'ka#z'ka#{'ka$O'ka(a'ka(r'ka(y'ka(z'ka!]'ka!^'ka~O(y$}OP%aiR%ai[%aij%ain%air%ai!Q%ai!S%ai!l%ai!p%ai#R%ai#n%ai#o%ai#p%ai#q%ai#r%ai#s%ai#t%ai#u%ai#v%ai#x%ai#z%ai#{%ai$O%ai'y%ai(a%ai(r%ai(z%ai!]%ai!^%ai~O(z%POP%ciR%ci[%cij%cin%cir%ci!Q%ci!S%ci!l%ci!p%ci#R%ci#n%ci#o%ci#p%ci#q%ci#r%ci#s%ci#t%ci#u%ci#v%ci#x%ci#z%ci#{%ci$O%ci'y%ci(a%ci(r%ci(y%ci!]%ci!^%ci~O$O$oy!]$oy!^$oy~P#BwO$O#cy!]#cy!^#cy~P#BwO!g#vO!]'eq!k'eq~O!]/pO!k)Oy~O!Y'gq!]'gq~P#/sOr:|O!g#vO(r'pO~O[;QO!Y;PO~P#/sO!Y;PO~Og(_!R!](_!R~P!1WOa%[y!_%[y'z%[y!]%[y~P#/sO!]1TO!^)Xy~O!]5uO!^)Uq~O(T;XO~O!_1oO%i;[O~O!k;_O~O%i;dO~P&8fOP$|qR$|q[$|qj$|qr$|q!S$|q!l$|q!p$|q#R$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#t$|q#u$|q#v$|q#x$|q#z$|q#{$|q$O$|q(a$|q(r$|q!]$|q!^$|q~P''VO!Q*OO'y*PO(z%POP'jaR'ja['jaj'jan'jar'ja!S'ja!l'ja!p'ja#R'ja#n'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#x'ja#z'ja#{'ja$O'ja(a'ja(r'ja(y'ja!]'ja!^'ja~O!Q*OO'y*POP'laR'la['laj'lan'lar'la!S'la!l'la!p'la#R'la#n'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#x'la#z'la#{'la$O'la(a'la(r'la(y'la(z'la!]'la!^'la~OP%OqR%Oq[%Oqj%Oqr%Oq!S%Oq!l%Oq!p%Oq#R%Oq#n%Oq#o%Oq#p%Oq#q%Oq#r%Oq#s%Oq#t%Oq#u%Oq#v%Oq#x%Oq#z%Oq#{%Oq$O%Oq(a%Oq(r%Oq!]%Oq!^%Oq~P''VOg%e!Z!]%e!Z#`%e!Z$O%e!Z~P!1WO!Y;hO~P#/sOr;iO!g#vO(r'pO~O[;kO!Y;hO~P#/sO!]'pq!^'pq~P#BwO!]#h!Z!^#h!Z~P#BwO#k%e!ZP%e!ZR%e!Z[%e!Za%e!Zj%e!Zr%e!Z!S%e!Z!]%e!Z!l%e!Z!p%e!Z#R%e!Z#n%e!Z#o%e!Z#p%e!Z#q%e!Z#r%e!Z#s%e!Z#t%e!Z#u%e!Z#v%e!Z#x%e!Z#z%e!Z#{%e!Z'z%e!Z(a%e!Z(r%e!Z!k%e!Z!Y%e!Z'w%e!Z#`%e!Zv%e!Z!_%e!Z%i%e!Z!g%e!Z~P#/sOr;tO!g#vO(r'pO~O!Y;uO~P#/sOr;|O!g#vO(r'pO~O!Y;}O~P#/sOP%e!ZR%e!Z[%e!Zj%e!Zr%e!Z!S%e!Z!l%e!Z!p%e!Z#R%e!Z#n%e!Z#o%e!Z#p%e!Z#q%e!Z#r%e!Z#s%e!Z#t%e!Z#u%e!Z#v%e!Z#x%e!Z#z%e!Z#{%e!Z$O%e!Z(a%e!Z(r%e!Z!]%e!Z!^%e!Z~P''VOr<QO!g#vO(r'pO~Ov(fX~P1qO!Q%rO~P!)[O(U!lO~P!)[O!YfX!]fX#`fX~P%2OOP]XR]X[]Xj]Xr]X!Q]X!S]X!]]X!]fX!l]X!p]X#R]X#S]X#`]X#`fX#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X~O!gfX!k]X!kfX(rfX~P'LTOP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_XO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(T)]O(VTO(YUO(aVO(o[O~O!]<iO!^$qa~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<tO!S${O!_$|O!i>WO!l$xO#j<zO$W%`O$t<vO$v<xO$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~Ol)dO~P(!yOr!eX(r!eX~P#!iOr(jX(r(jX~P##[O!^]X!^fX~P'LTO!YfX!Y$zX!]fX!]$zX#`fX~P!0SO#k<^O~O!g#vO#k<^O~O#`<nO~Oj<bO~O#`=OO!](wX!^(wX~O#`<nO!](uX!^(uX~O#k=PO~Og=RO~P!1WO#k=XO~O#k=YO~Og=RO(T&ZO~O!g#vO#k=ZO~O!g#vO#k=PO~O$O=[O~P#BwO#k=]O~O#k=^O~O#k=cO~O#k=dO~O#k=eO~O#k=fO~O$O=gO~P!1WO$O=hO~P!1WOl=sO~P7eOk#S#T#U#W#X#[#i#j#u$n$t$v$y%]%^%h%i%j%q%s%v%w%y%{~(OT#o!X'|(U#ps#n#qr!Q'}$]'}(T$_(e~",
		goto: "$9Y)]PPPPPP)^PP)aP)rP+W/]PPPP6mPP7TPP=QPPP@tPA^PA^PPPA^PCfPA^PA^PA^PCjPCoPD^PIWPPPI[PPPPI[L_PPPLeMVPI[PI[PP! eI[PPPI[PI[P!#lI[P!'S!(X!(bP!)U!)Y!)U!,gPPPPPPP!-W!(XPP!-h!/YP!2iI[I[!2n!5z!:h!:h!>gPPP!>oI[PPPPPPPPP!BOP!C]PPI[!DnPI[PI[I[I[I[I[PI[!FQP!I[P!LbP!Lf!Lp!Lt!LtP!IXP!Lx!LxP#!OP#!SI[PI[#!Y#%_CjA^PA^PA^A^P#&lA^A^#)OA^#+vA^#.SA^A^#.r#1W#1W#1]#1f#1W#1qPP#1WPA^#2ZA^#6YA^A^6mPPP#:_PPP#:x#:xP#:xP#;`#:xPP#;fP#;]P#;]#;y#;]#<e#<k#<n)aP#<q)aP#<z#<z#<zP)aP)aP)aP)aPP)aP#=Q#=TP#=T)aP#=XP#=[P)aP)aP)aP)aP)aP)a)aPP#=b#=h#=s#=y#>P#>V#>]#>k#>q#>{#?R#?]#?c#?s#?y#@k#@}#AT#AZ#Ai#BO#Cs#DR#DY#Et#FS#Gt#HS#HY#H`#Hf#Hp#Hv#H|#IW#Ij#IpPPPPPPPPPPP#IvPPPPPPP#Jk#Mx$ b$ i$ qPPP$']P$'f$*_$0x$0{$1O$1}$2Q$2X$2aP$2g$2jP$3W$3[$4S$5b$5g$5}PP$6S$6Y$6^$6a$6e$6i$7e$7|$8e$8i$8l$8o$8y$8|$9Q$9UR!|RoqOXst!Z#d%m&r&t&u&w,s,x2[2_Y!vQ'`-e1o5{Q%tvQ%|yQ&T|Q&j!VS'W!e-]Q'f!iS'l!r!yU*k$|*Z*oQ+o%}S+|&V&WQ,d&dQ-c'_Q-m'gQ-u'mQ0[*qQ1b,OQ1y,eR<{<Y%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+],p,s,x-i-q.P.V.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3l4z6T6e6f6i6|8t9T9_S#q]<V!r)_$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SU+P%]<s<tQ+t&PQ,f&gQ,m&oQ0x+gQ0}+iQ1Y+uQ2R,kQ3`.gQ5`0|Q5f1TQ6[1zQ7Y3dQ8`5gR9e7['QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S!S!nQ!r!v!y!z$|'W'_'`'l'm'n*k*o*q*r-]-c-e-u0[0_1o5{5}%[$ti#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^Q&X|Q'U!eS'[%i-`Q+t&PQ,P&WQ,f&gQ0n+SQ1Y+uQ1_+{Q2Q,jQ2R,kQ5f1TQ5o1aQ6[1zQ6_1|Q6`2PQ8`5gQ8c5lQ8|6bQ:X8dQ:f8yQ;V:YR<}*ZrnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_R,h&k&z^OPXYstuvwz!Z!`!g!j!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'b'r(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>R>S[#]WZ#W#Z'X(T!b%jm#h#i#l$x%e%h(^(h(i(j*Y*^*b+Z+[+^,o-V.T.Z.[.]._/m/p2d3[3]4a6r7TQ%wxQ%{yW&Q|&V&W,OQ&_!TQ'c!hQ'e!iQ(q#sS+n%|%}Q+r&PQ,_&bQ,c&dS-l'f'gQ.i(rQ1R+oQ1X+uQ1Z+vQ1^+zQ1t,`S1x,d,eQ2|-mQ5e1TQ5i1WQ5n1`Q6Z1yQ8_5gQ8b5kQ8f5pQ:T8^R;T:U!U$zi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y!^%yy!i!u%{%|%}'V'e'f'g'k'u*j+n+o-Y-l-m-t0R0U1R2u2|3T4r4s4v7}9{Q+h%wQ,T&[Q,W&]Q,b&dQ.h(qQ1s,_U1w,c,d,eQ3e.iQ6U1tS6Y1x1yQ8x6Z#f>T#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^o>U<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hW%Ti%V*y>PS&[!Q&iQ&]!RQ&^!SU*}%[%d=sR,R&Y%]%Si#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^T)z$u){V+P%]<s<tW'[!e%i*Z-`S(}#y#zQ+c%rQ+y&SS.b(m(nQ1j,XQ5T0kR8i5u'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S$i$^c#Y#e%q%s%u(S(Y(t(y)R)S)T)U)V)W)X)Y)Z)[)^)`)b)g)q+d+x-Z-x-}.S.U.s.v.z.|.}/O/b0p2k2n3O3V3k3p3q3r3s3t3u3v3w3x3y3z3{3|4P4Q4X5X5c6u6{7Q7a7b7k7l8k9X9]9g9m9n:o;W;`<W=vT#TV#U'RkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ'Y!eR2q-]!W!nQ!e!r!v!y!z$|'W'_'`'l'm'n*Z*k*o*q*r-]-c-e-u0[0_1o5{5}R1l,ZnqOXst!Z#d%m&r&t&u&w,s,x2[2_Q&y!^Q'v!xS(s#u<^Q+l%zQ,]&_Q,^&aQ-j'dQ-w'oS.r(x=PS0q+X=ZQ1P+mQ1n,[Q2c,zQ2e,{Q2m-WQ2z-kQ2}-oS5Y0r=eQ5a1QS5d1S=fQ6t2oQ6x2{Q6}3SQ8]5bQ9Y6vQ9Z6yQ9^7OR:l9V$d$]c#Y#e%s%u(S(Y(t(y)R)S)T)U)V)W)X)Y)Z)[)^)`)b)g)q+d+x-Z-x-}.S.U.s.v.z.}/O/b0p2k2n3O3V3k3p3q3r3s3t3u3v3w3x3y3z3{3|4P4Q4X5X5c6u6{7Q7a7b7k7l8k9X9]9g9m9n:o;W;`<W=vS(o#p'iQ)P#zS+b%q.|S.c(n(pR3^.d'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SS#q]<VQ&t!XQ&u!YQ&w![Q&x!]R2Z,vQ'a!hQ+e%wQ-h'cS.e(q+hQ2x-gW3b.h.i0w0yQ6w2yW7U3_3a3e5^U9a7V7X7ZU:q9c9d9fS;b:p:sQ;p;cR;x;qU!wQ'`-eT5y1o5{!Q_OXZ`st!V!Z#d#h%e%m&i&k&r&t&u&w(j,s,x.[2[2_]!pQ!r'`-e1o5{T#q]<V%^{OPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_S(}#y#zS.b(m(n!s=l$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SU$fd)_,mS(p#p'iU*v%R(w4OU0m+O.n7gQ5^0xQ7V3`Q9d7YR:s9em!tQ!r!v!y!z'`'l'm'n-e-u1o5{5}Q't!uS(f#g2US-s'k'wQ/s*]Q0R*jQ3U-vQ4f/tQ4r0TQ4s0UQ4x0^Q7r4`S7}4t4vS8R4y4{Q9r7sQ9v7yQ9{8OQ:Q8TS:{9w9xS;g:|;PS;s;h;iS;{;t;uS<P;|;}R<S<QQ#wbQ's!uS(e#g2US(g#m+WQ+Y%fQ+j%xQ+p&OU-r'k't'wQ.W(fU/r*]*`/wQ0S*jQ0V*lQ1O+kQ1u,aS3R-s-vQ3Z.`S4e/s/tQ4n0PS4q0R0^Q4u0WQ6W1vQ7P3US7q4`4bQ7u4fU7|4r4x4{Q8P4wQ8v6XS9q7r7sQ9u7yQ9}8RQ:O8SQ:c8wQ:y9rS:z9v9xQ;S:QQ;^:dS;f:{;PS;r;g;hS;z;s;uS<O;{;}Q<R<PQ<T<SQ=o=jQ={=tR=|=uV!wQ'`-e%^aOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_S#wz!j!r=i$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SR=o>R%^bOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_Q%fj!^%xy!i!u%{%|%}'V'e'f'g'k'u*j+n+o-Y-l-m-t0R0U1R2u2|3T4r4s4v7}9{S&Oz!jQ+k%yQ,a&dW1v,b,c,d,eU6X1w1x1yS8w6Y6ZQ:d8x!r=j$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ=t>QR=u>R%QeOPXYstuvw!Z!`!g!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_Y#bWZ#W#Z(T!b%jm#h#i#l$x%e%h(^(h(i(j*Y*^*b+Z+[+^,o-V.T.Z.[.]._/m/p2d3[3]4a6r7TQ,n&o!p=k$Z$n)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SR=n'XU']!e%i*ZR2s-`%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+],p,s,x-i-q.P.V.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3l4z6T6e6f6i6|8t9T9_!r)_$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ,m&oQ0x+gQ3`.gQ7Y3dR9e7[!b$Tc#Y%q(S(Y(t(y)Z)[)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<W!P<d)^)q-Z.|2k2n3p3y3z4P4X6u7b7k7l8k9X9g9m9n;W;`=v!f$Vc#Y%q(S(Y(t(y)W)X)Z)[)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<W!T<f)^)q-Z.|2k2n3p3v3w3y3z4P4X6u7b7k7l8k9X9g9m9n;W;`=v!^$Zc#Y%q(S(Y(t(y)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<WQ4_/kz>S)^)q-Z.|2k2n3p4P4X6u7b7k7l8k9X9g9m9n;W;`=vQ>X>ZR>Y>['QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SS$oh$pR4U/U'XgOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/U/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>ST$kf$qQ$ifS)j$l)nR)v$qT$jf$qT)l$l)n'XhOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/U/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>ST$oh$pQ$rhR)u$p%^jOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_!s>Q$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S#glOPXZst!Z!`!o#S#d#o#{$n%m&k&n&o&r&t&u&w&{'T'b)O)s*i+]+g,p,s,x-i.g/V/n0]0l1r2S2T2V2X2[2_2a3d4T4z6T6e6f6i7[8t9T!U%Ri$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y#f(w#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^Q+T%aQ/c*Oo4O<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!U$yi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>YQ*c$zU*l$|*Z*oQ+U%bQ0W*m#f=q#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n=r<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hQ=w>TQ=x>UQ=y>VR=z>W!U%Ri$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y#f(w#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^o4O<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hnoOXst!Z#d%m&r&t&u&w,s,x2[2_S*f${*YQ-R'OQ-S'QR4i/y%[%Si#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^Q,U&]Q1h,WQ5s1gR8h5tV*n$|*Z*oU*n$|*Z*oT5z1o5{S0P*i/nQ4w0]T8S4z:]Q+j%xQ0V*lQ1O+kQ1u,aQ6W1vQ8v6XQ:c8wR;^:d!U%Oi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Yx*R$v)e*S*u+V/v0d0e4R4g5R5S5W7p8U:R:x=p=}>OS0`*t0a#f<o#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n<p<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!d=S(u)c*[*e.j.m.q/_/k/|0v1e3h4[4h4l5r7]7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[`=T3}7c7f7j9h:t:w;yS=_.l3iT=`7e9k!U%Qi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y|*T$v)e*U*t+V/g/v0d0e4R4g4|5R5S5W7p8U:R:x=p=}>OS0b*u0c#f<q#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n<r<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!h=U(u)c*[*e.k.l.q/_/k/|0v1e3f3h4[4h4l5r7]7^7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[d=V3}7d7e7j9h9i:t:u:w;yS=a.m3jT=b7f9lrnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_Q&f!UR,p&ornOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_R&f!UQ,Y&^R1d,RsnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_Q1p,_S6R1s1tU8p6P6Q6US:_8r8sS;Y:^:aQ;m;ZR;w;nQ&m!VR,i&iR6_1|R:f8yW&Q|&V&W,OR1Z+vQ&r!WR,s&sR,y&xT2],x2_R,}&yQ,|&yR2f,}Q'y!{R-y'ySsOtQ#dXT%ps#dQ#OTR'{#OQ#RUR'}#RQ){$uR/`){Q#UVR(Q#UQ#XWU(W#X(X.QQ(X#YR.Q(YQ-^'YR2r-^Q.u(yS3m.u3nR3n.vQ-e'`R2v-eY!rQ'`-e1o5{R'j!rQ/Q)eR4S/QU#_W%h*YU(_#_(`.RQ(`#`R.R(ZQ-a']R2t-at`OXst!V!Z#d%m&i&k&r&t&u&w,s,x2[2_S#hZ%eU#r`#h.[R.[(jQ(k#jQ.X(gW.a(k.X3X7RQ3X.YR7R3YQ)n$lR/W)nQ$phR)t$pQ$`cU)a$`-|<jQ-|<WR<j)qQ/q*]W4c/q4d7t9sU4d/r/s/tS7t4e4fR9s7u$e*Q$v(u)c)e*[*e*t*u+Q+R+V.l.m.o.p.q/_/g/i/k/v/|0d0e0v1e3f3g3h3}4R4[4g4h4l4|5O5R5S5W5r7]7^7_7`7e7f7h7i7j7p7w7z8U8X8Z9h9i9j9t9|:R:S:t:u:v:w:x:};R;e;j;v;y=p=}>O>Z>[Q/z*eU4k/z4m7xQ4m/|R7x4lS*o$|*ZR0Y*ox*S$v)e*t*u+V/v0d0e4R4g5R5S5W7p8U:R:x=p=}>O!d.j(u)c*[*e.l.m.q/_/k/|0v1e3h4[4h4l5r7]7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[U/h*S.j7ca7c3}7e7f7j9h:t:w;yQ0a*tQ3i.lU4}0a3i9kR9k7e|*U$v)e*t*u+V/g/v0d0e4R4g4|5R5S5W7p8U:R:x=p=}>O!h.k(u)c*[*e.l.m.q/_/k/|0v1e3f3h4[4h4l5r7]7^7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[U/j*U.k7de7d3}7e7f7j9h9i:t:u:w;yQ0c*uQ3j.mU5P0c3j9lR9l7fQ*z%UR0g*zQ5]0vR8Y5]Q+_%kR0u+_Q5v1jS8j5v:[R:[8kQ,[&_R1m,[Q5{1oR8m5{Q1{,fS6]1{8zR8z6_Q1U+rW5h1U5j8a:VQ5j1XQ8a5iR:V8bQ+w&QR1[+wQ2_,xR6m2_YrOXst#dQ&v!ZQ+a%mQ,r&rQ,t&tQ,u&uQ,w&wQ2Y,sS2],x2_R6l2[Q%opQ&z!_Q&}!aQ'P!bQ'R!cQ'q!uQ+`%lQ+l%zQ,Q&XQ,h&mQ-P&|W-p'k's't'wQ-w'oQ0X*nQ1P+mQ1c,PS2O,i,lQ2g-OQ2h-RQ2i-SQ2}-oW3P-r-s-v-xQ5a1QQ5m1_Q5q1eQ6V1uQ6a2QQ6k2ZU6z3O3R3UQ6}3SQ8]5bQ8e5oQ8g5rQ8l5zQ8u6WQ8{6`S9[6{7PQ9^7OQ:W8cQ:b8vQ:g8|Q:n9]Q;U:XQ;]:cQ;a:oQ;l;VR;o;^Q%zyQ'd!iQ'o!uU+m%{%|%}Q-W'VU-k'e'f'gS-o'k'uQ0Q*jS1Q+n+oQ2o-YS2{-l-mQ3S-tS4p0R0UQ5b1RQ6v2uQ6y2|Q7O3TU7{4r4s4vQ9z7}R;O9{S$wi>PR*{%VU%Ui%V>PR0f*yQ$viS(u#v+iS)c$b$cQ)e$dQ*[$xS*e${*YQ*t%OQ*u%QQ+Q%^Q+R%_Q+V%cQ.l<oQ.m<qQ.o<uQ.p<wQ.q<yQ/_)yQ/g*RQ/i*TQ/k*VQ/v*aS/|*g/mQ0d*wQ0e*xl0v+f,V.f1i1q3c6S7W8q9b:`:r;[;dQ1e,SQ3f=SQ3g=UQ3h=XS3}<l<mQ4R/PS4[/d4^Q4g/xQ4h/yQ4l/{Q4|0`Q5O0bQ5R0iQ5S0jQ5W0oQ5r1fQ7]=]Q7^=_Q7_=aQ7`=cQ7e<pQ7f<rQ7h<vQ7i<xQ7j<zQ7p4_Q7w4jQ7z4oQ8U5QQ8X5[Q8Z5_Q9h=YQ9i=TQ9j=VQ9t7vQ9|8QQ:R8VQ:S8[Q:t=^Q:u=`Q:v=bQ:w=dQ:x9pQ:}9yQ;R:PQ;e=gQ;j;QQ;v;kQ;y=hQ=p>PQ=}>XQ>O>YQ>Z>]R>[>^Q+O%]Q.n<sR7g<tnpOXst!Z#d%m&r&t&u&w,s,x2[2_Q!fPS#fZ#oQ&|!`W'h!o*i0]4zQ(P#SQ)Q#{Q)r$nS,l&k&nQ,q&oQ-O&{S-T'T/nQ-g'bQ.x)OQ/[)sQ0s+]Q0y+gQ2W,pQ2y-iQ3a.gQ4W/VQ5U0lQ6Q1rQ6c2SQ6d2TQ6h2VQ6j2XQ6o2aQ7Z3dQ7m4TQ8s6TQ9P6eQ9Q6fQ9S6iQ9f7[Q:a8tR:k9T#[cOPXZst!Z!`!o#d#o#{%m&k&n&o&r&t&u&w&{'T'b)O*i+]+g,p,s,x-i.g/n0]0l1r2S2T2V2X2[2_2a3d4z6T6e6f6i7[8t9TQ#YWQ#eYQ%quQ%svS%uw!gS(S#W(VQ(Y#ZQ(t#uQ(y#xQ)R$OQ)S$PQ)T$QQ)U$RQ)V$SQ)W$TQ)X$UQ)Y$VQ)Z$WQ)[$XQ)^$ZQ)`$_Q)b$aQ)g$eW)q$n)s/V4TQ+d%tQ+x&RS-Z'X2pQ-x'rS-}(T.PQ.S(]Q.U(dQ.s(xQ.v(zQ.z<UQ.|<XQ.}<YQ/O<]Q/b)}Q0p+XQ2k-UQ2n-XQ3O-qQ3V.VQ3k.tQ3p<^Q3q<_Q3r<`Q3s<aQ3t<bQ3u<cQ3v<dQ3w<eQ3x<fQ3y<gQ3z<hQ3{.{Q3|<kQ4P<nQ4Q<{Q4X<iQ5X0rQ5c1SQ6u=OQ6{3QQ7Q3WQ7a3lQ7b=PQ7k=RQ7l=ZQ8k5wQ9X6sQ9]6|Q9g=[Q9m=eQ9n=fQ:o9_Q;W:ZQ;`:mQ<W#SR=v>SR#[WR'Z!el!tQ!r!v!y!z'`'l'm'n-e-u1o5{5}S'V!e-]U*j$|*Z*oS-Y'W'_S0U*k*qQ0^*rQ2u-cQ4v0[R4{0_R({#xQ!fQT-d'`-e]!qQ!r'`-e1o5{Q#p]R'i<VR)f$dY!uQ'`-e1o5{Q'k!rS'u!v!yS'w!z5}S-t'l'mQ-v'nR3T-uT#kZ%eS#jZ%eS%km,oU(g#h#i#lS.Y(h(iQ.^(jQ0t+^Q3Y.ZU3Z.[.]._S7S3[3]R9`7Td#^W#W#Z%h(T(^*Y+Z.T/mr#gZm#h#i#l%e(h(i(j+^.Z.[.]._3[3]7TS*]$x*bQ/t*^Q2U,oQ2l-VQ4`/pQ6q2dQ7s4aQ9W6rT=m'X+[V#aW%h*YU#`W%h*YS(U#W(^U(Z#Z+Z/mS-['X+[T.O(T.TV'^!e%i*ZQ$lfR)x$qT)m$l)nR4V/UT*_$x*bT*h${*YQ0w+fQ1g,VQ3_.fQ5t1iQ6P1qQ7X3cQ8r6SQ9c7WQ:^8qQ:p9bQ;Z:`Q;c:rQ;n;[R;q;dnqOXst!Z#d%m&r&t&u&w,s,x2[2_Q&l!VR,h&itmOXst!U!V!Z#d%m&i&r&t&u&w,s,x2[2_R,o&oT%lm,oR1k,XR,g&gQ&U|S+}&V&WR1^,OR+s&PT&p!W&sT&q!W&sT2^,x2_",
		nodeNames: "⚠ ArithOp ArithOp ?. JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList in out const TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewTarget new NewExpression ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression TypeArgList CompareOp < declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression InstantiationExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast < ArrowFunction TypeParamList SequenceExpression InstantiationExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate asserts is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration defer ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
		maxTerm: 380,
		context: vS,
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
				207,
				211,
				215,
				216,
				218,
				221,
				224,
				234,
				237,
				243,
				245,
				247,
				249,
				252,
				258,
				264,
				266,
				268,
				270,
				272,
				274,
				275,
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
				120,
				121,
				136,
				139,
				141,
				142,
				143,
				144,
				145,
				147,
				148,
				167,
				169,
				171,
				"Expression",
				-23,
				31,
				33,
				37,
				41,
				43,
				45,
				173,
				175,
				177,
				178,
				180,
				181,
				182,
				184,
				185,
				186,
				188,
				189,
				190,
				201,
				203,
				205,
				206,
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
				160,
				"JSXStartCloseTag"
			],
			[
				"closedBy",
				-2,
				24,
				168,
				">",
				40,
				"InterpolationEnd",
				50,
				"]",
				61,
				"}",
				74,
				")",
				165,
				"JSXEndTag"
			]
		],
		propSources: [wS],
		skippedNodes: [
			0,
			5,
			6,
			278
		],
		repeatNodeCount: 37,
		tokenData: "$Fq07[R!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#:O!R![#<_![!]#I_!]!^#Jk!^!_#Ku!_!`$![!`!a$$v!a!b$*T!b!c$,r!c!}Er!}#O$-|#O#P$/W#P#Q$4o#Q#R$5y#R#SEr#S#T$7W#T#o$8b#o#p$<r#p#q$=h#q#r$>x#r#s$@U#s$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$I|Er$I|$I}$Dk$I}$JO$Dk$JO$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr(n%d_$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$i&j(Z!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU(Z!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$i&j(WpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(WpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z07[+rq$i&j(Wp(Z!b'|0/lOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z07[.ST(X#S$i&j'}0/lO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c07[.n_$i&j(Wp(Z!b'}0/lOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)3p/x`$i&j!p),Q(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW1V`#v(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW2d_#v(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At3l_(V':f$i&j(Z!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$i&j(Z!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$i&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$d`$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$d``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$d`$i&j(Z!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ(Z!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$d`(Z!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k%9[:hh$i&j(Wp(Z!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__WS$i&j(Wp(Z!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]WS$i&j(Z!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXWS$i&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSWSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWWS(Z!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]WS$i&j(WpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWWS(WpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYWS(Wp(Z!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S%9[C}i$i&j(o%1l(Wp(Z!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr%9[EoP;=`<%lCr07[FRk$i&j(Wp(Z!b$]#t(T,2j(e$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$i&j(Wp(Z!b$]#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv07[JPP;=`<%lEr(KWJ_`$i&j(Wp(Z!b#p(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWKl_$i&j$Q(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,#xLva(z+JY$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWNW`$i&j#z(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At! c_(Y';W$i&j(WpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$i&j(WpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$i&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$d`$i&j(WpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(WpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$d`(WpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b/5|!'t_!l/.^$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&U!)O_!k!Lf$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z-!n!*[b$i&j(Wp(Z!b(U%&f#q(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW!+o`$i&j(Wp(Z!b#n(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;x!,|`$i&j(Wp(Z!br+4YOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,$U!.Z_!]+Jf$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!/ec$i&j(Wp(Z!b!Q.2^OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!0ya$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!2Z_![!L^$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!3eg$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!5Vg$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!6wc$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!8_c$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!9uf$i&j(Wp(Z!b#o(ChOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcxz!;Zz{#-}{!P!;Z!P!Q#/d!Q!^!;Z!^!_#(i!_!`#7S!`!a#8i!a!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z?O!;fb$i&j(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z>^!<w`$i&j(Z!b!X7`OY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eq!Q!^!<n!^!_!Gr!_!}!<n!}#O!KS#O#P!Dy#P#o!<n#o#p!Gr#p;'S!<n;'S;=`!L]<%lO!<n<z!>Q^$i&j!X7`OY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@c!_!}!=y!}#O!CW#O#P!Dy#P#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!?Td$i&j!X7`O!^&c!_#W&c#W#X!>|#X#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#k!>|#k#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&c7`!@hX!X7`OY!@cZ!P!@c!P!Q!AT!Q!}!@c!}#O!Ar#O#P!Bq#P;'S!@c;'S;=`!CQ<%lO!@c7`!AYW!X7`#W#X!AT#Z#[!AT#]#^!AT#a#b!AT#g#h!AT#i#j!AT#j#k!AT#m#n!AT7`!AuVOY!ArZ#O!Ar#O#P!B[#P#Q!@c#Q;'S!Ar;'S;=`!Bk<%lO!Ar7`!B_SOY!ArZ;'S!Ar;'S;=`!Bk<%lO!Ar7`!BnP;=`<%l!Ar7`!BtSOY!@cZ;'S!@c;'S;=`!CQ<%lO!@c7`!CTP;=`<%l!@c<z!C][$i&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#O!CW#O#P!DR#P#Q!=y#Q#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DWX$i&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DvP;=`<%l!CW<z!EOX$i&jOY!=yYZ&cZ!^!=y!^!_!@c!_#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!EnP;=`<%l!=y>^!Ezl$i&j(Z!b!X7`OY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#W&}#W#X!Eq#X#Z&}#Z#[!Eq#[#]&}#]#^!Eq#^#a&}#a#b!Eq#b#g&}#g#h!Eq#h#i&}#i#j!Eq#j#k!Eq#k#m&}#m#n!Eq#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}8r!GyZ(Z!b!X7`OY!GrZw!Grwx!@cx!P!Gr!P!Q!Hl!Q!}!Gr!}#O!JU#O#P!Bq#P;'S!Gr;'S;=`!J|<%lO!Gr8r!Hse(Z!b!X7`OY'}Zw'}x#O'}#P#W'}#W#X!Hl#X#Z'}#Z#[!Hl#[#]'}#]#^!Hl#^#a'}#a#b!Hl#b#g'}#g#h!Hl#h#i'}#i#j!Hl#j#k!Hl#k#m'}#m#n!Hl#n;'S'};'S;=`(f<%lO'}8r!JZX(Z!bOY!JUZw!JUwx!Arx#O!JU#O#P!B[#P#Q!Gr#Q;'S!JU;'S;=`!Jv<%lO!JU8r!JyP;=`<%l!JU8r!KPP;=`<%l!Gr>^!KZ^$i&j(Z!bOY!KSYZ&cZw!KSwx!CWx!^!KS!^!_!JU!_#O!KS#O#P!DR#P#Q!<n#Q#o!KS#o#p!JU#p;'S!KS;'S;=`!LV<%lO!KS>^!LYP;=`<%l!KS>^!L`P;=`<%l!<n=l!Ll`$i&j(Wp!X7`OY!LcYZ&cZr!Lcrs!=ys!P!Lc!P!Q!Mn!Q!^!Lc!^!_# o!_!}!Lc!}#O#%P#O#P!Dy#P#o!Lc#o#p# o#p;'S!Lc;'S;=`#&Y<%lO!Lc=l!Mwl$i&j(Wp!X7`OY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#W(r#W#X!Mn#X#Z(r#Z#[!Mn#[#](r#]#^!Mn#^#a(r#a#b!Mn#b#g(r#g#h!Mn#h#i(r#i#j!Mn#j#k!Mn#k#m(r#m#n!Mn#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r8Q# vZ(Wp!X7`OY# oZr# ors!@cs!P# o!P!Q#!i!Q!}# o!}#O#$R#O#P!Bq#P;'S# o;'S;=`#$y<%lO# o8Q#!pe(Wp!X7`OY)rZr)rs#O)r#P#W)r#W#X#!i#X#Z)r#Z#[#!i#[#])r#]#^#!i#^#a)r#a#b#!i#b#g)r#g#h#!i#h#i)r#i#j#!i#j#k#!i#k#m)r#m#n#!i#n;'S)r;'S;=`*Z<%lO)r8Q#$WX(WpOY#$RZr#$Rrs!Ars#O#$R#O#P!B[#P#Q# o#Q;'S#$R;'S;=`#$s<%lO#$R8Q#$vP;=`<%l#$R8Q#$|P;=`<%l# o=l#%W^$i&j(WpOY#%PYZ&cZr#%Prs!CWs!^#%P!^!_#$R!_#O#%P#O#P!DR#P#Q!Lc#Q#o#%P#o#p#$R#p;'S#%P;'S;=`#&S<%lO#%P=l#&VP;=`<%l#%P=l#&]P;=`<%l!Lc?O#&kn$i&j(Wp(Z!b!X7`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#W%Z#W#X#&`#X#Z%Z#Z#[#&`#[#]%Z#]#^#&`#^#a%Z#a#b#&`#b#g%Z#g#h#&`#h#i%Z#i#j#&`#j#k#&`#k#m%Z#m#n#&`#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z9d#(r](Wp(Z!b!X7`OY#(iZr#(irs!Grsw#(iwx# ox!P#(i!P!Q#)k!Q!}#(i!}#O#+`#O#P!Bq#P;'S#(i;'S;=`#,`<%lO#(i9d#)th(Wp(Z!b!X7`OY*gZr*grs'}sw*gwx)rx#O*g#P#W*g#W#X#)k#X#Z*g#Z#[#)k#[#]*g#]#^#)k#^#a*g#a#b#)k#b#g*g#g#h#)k#h#i*g#i#j#)k#j#k#)k#k#m*g#m#n#)k#n;'S*g;'S;=`+Z<%lO*g9d#+gZ(Wp(Z!bOY#+`Zr#+`rs!JUsw#+`wx#$Rx#O#+`#O#P!B[#P#Q#(i#Q;'S#+`;'S;=`#,Y<%lO#+`9d#,]P;=`<%l#+`9d#,cP;=`<%l#(i?O#,o`$i&j(Wp(Z!bOY#,fYZ&cZr#,frs!KSsw#,fwx#%Px!^#,f!^!_#+`!_#O#,f#O#P!DR#P#Q!;Z#Q#o#,f#o#p#+`#p;'S#,f;'S;=`#-q<%lO#,f?O#-tP;=`<%l#,f?O#-zP;=`<%l!;Z07[#.[b$i&j(Wp(Z!b(O0/l!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z07[#/o_$i&j(Wp(Z!bT0/lOY#/dYZ&cZr#/drs#0nsw#/dwx#4Ox!^#/d!^!_#5}!_#O#/d#O#P#1p#P#o#/d#o#p#5}#p;'S#/d;'S;=`#6|<%lO#/d06j#0w]$i&j(Z!bT0/lOY#0nYZ&cZw#0nwx#1px!^#0n!^!_#3R!_#O#0n#O#P#1p#P#o#0n#o#p#3R#p;'S#0n;'S;=`#3x<%lO#0n05W#1wX$i&jT0/lOY#1pYZ&cZ!^#1p!^!_#2d!_#o#1p#o#p#2d#p;'S#1p;'S;=`#2{<%lO#1p0/l#2iST0/lOY#2dZ;'S#2d;'S;=`#2u<%lO#2d0/l#2xP;=`<%l#2d05W#3OP;=`<%l#1p01O#3YW(Z!bT0/lOY#3RZw#3Rwx#2dx#O#3R#O#P#2d#P;'S#3R;'S;=`#3r<%lO#3R01O#3uP;=`<%l#3R06j#3{P;=`<%l#0n05x#4X]$i&j(WpT0/lOY#4OYZ&cZr#4Ors#1ps!^#4O!^!_#5Q!_#O#4O#O#P#1p#P#o#4O#o#p#5Q#p;'S#4O;'S;=`#5w<%lO#4O00^#5XW(WpT0/lOY#5QZr#5Qrs#2ds#O#5Q#O#P#2d#P;'S#5Q;'S;=`#5q<%lO#5Q00^#5tP;=`<%l#5Q05x#5zP;=`<%l#4O01p#6WY(Wp(Z!bT0/lOY#5}Zr#5}rs#3Rsw#5}wx#5Qx#O#5}#O#P#2d#P;'S#5};'S;=`#6v<%lO#5}01p#6yP;=`<%l#5}07[#7PP;=`<%l#/d)3h#7ab$i&j$Q(Ch(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;ZAt#8vb$Z#t$i&j(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z'Ad#:Zp$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#U%Z#U#V#?i#V#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#d#Bq#d#l%Z#l#m#Es#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#<jk$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#>j_$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#?rd$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#A]f$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Bzc$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Dbe$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#E|g$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Gpi$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x#Il_!g$b$i&j$O)Lv(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#Jv_al$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f#LS^h#)`#R-<U(Wp(Z!b$n7`OY*gZr*grs'}sw*gwx)rx!P*g!P!Q#MO!Q!^*g!^!_#Mt!_!`$ f!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#MXX$k&j(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El#M}Z#r(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#Np!`#O*g#P;'S*g;'S;=`+Z<%lO*g(El#NyX$Q(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El$ oX#s(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g*)x$!ga#`*!Y$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$#l!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(K[$#w_#k(Cl$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x$%Vag!*r#s(Ch$f#|$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$&[!`!a$'f!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$&g_#s(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$'qa#r(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$(v!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$)R`#r(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(Kd$*`a(r(Ct$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!a%Z!a!b$+e!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$+p`$i&j#{(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`$,}_!|$Ip$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f$.X_!S0,v$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/]Z$i&jO!^$0O!^!_$0f!_#i$0O#i#j$0k#j#l$0O#l#m$2^#m#o$0O#o#p$0f#p;'S$0O;'S;=`$4i<%lO$0O(n$0VT_#S$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0kO_#S(n$0p[$i&jO!Q&c!Q![$1f![!^&c!_!c&c!c!i$1f!i#T&c#T#Z$1f#Z#o&c#o#p$3|#p;'S&c;'S;=`&w<%lO&c(n$1kZ$i&jO!Q&c!Q![$2^![!^&c!_!c&c!c!i$2^!i#T&c#T#Z$2^#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2cZ$i&jO!Q&c!Q![$3U![!^&c!_!c&c!c!i$3U!i#T&c#T#Z$3U#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3ZZ$i&jO!Q&c!Q![$0O![!^&c!_!c&c!c!i$0O!i#T&c#T#Z$0O#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$4PR!Q![$4Y!c!i$4Y#T#Z$4Y#S$4]S!Q![$4Y!c!i$4Y#T#Z$4Y#q#r$0f(n$4lP;=`<%l$0O#1[$4z_!Y#)l$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$6U`#x(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;p$7c_$i&j(Wp(Z!b(a+4QOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$8qk$i&j(Wp(Z!b(T,2j$_#t(e$I[OY%ZYZ&cZr%Zrs&}st%Ztu$8buw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$8b![!^%Z!^!_*g!_!c%Z!c!}$8b!}#O%Z#O#P&c#P#R%Z#R#S$8b#S#T%Z#T#o$8b#o#p*g#p$g%Z$g;'S$8b;'S;=`$<l<%lO$8b+d$:qk$i&j(Wp(Z!b$_#tOY%ZYZ&cZr%Zrs&}st%Ztu$:fuw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$:f![!^%Z!^!_*g!_!c%Z!c!}$:f!}#O%Z#O#P&c#P#R%Z#R#S$:f#S#T%Z#T#o$:f#o#p*g#p$g%Z$g;'S$:f;'S;=`$<f<%lO$:f+d$<iP;=`<%l$:f07[$<oP;=`<%l$8b#Jf$<{X!_#Hb(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g,#x$=sa(y+JY$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+e#q;'S%Z;'S;=`+a<%lO%Z)>v$?V_!^(CdvBr$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z?O$@a_!q7`$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$Aq|$i&j(Wp(Z!b'|0/l$]#t(T,2j(e$I[OX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr07[$D|k$i&j(Wp(Z!b'}0/l$]#t(T,2j(e$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
		tokenizers: [
			bS,
			xS,
			SS,
			CS,
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
			yS,
			new Fx("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOx~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!U~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(c~~", 141, 340),
			new Fx("j~RQYZXz{^~^O(Q~~aP!P!Qd~iO(R~~", 25, 323)
		],
		topRules: {
			Script: [0, 7],
			SingleExpression: [1, 276],
			SingleClassItem: [2, 277]
		},
		dialects: {
			jsx: 0,
			ts: 15175
		},
		dynamicPrecedences: {
			80: 1,
			82: 1,
			94: 1,
			169: 1,
			199: 1
		},
		specialized: [
			{
				term: 327,
				get: (e) => TS[e] || -1
			},
			{
				term: 343,
				get: (e) => ES[e] || -1
			},
			{
				term: 95,
				get: (e) => DS[e] || -1
			}
		],
		tokenPrec: 15201
	});
}));
//#endregion
//#region node_modules/@codemirror/autocomplete/dist/index.js
function AS(e) {
	let t = Object.keys(e).join(""), n = /\w/.test(t);
	return n && (t = t.replace(/\w/g, "")), `[${n ? "\\w" : ""}${t.replace(/[^\w\s]/g, "\\$&")}]`;
}
function jS(e) {
	let t = Object.create(null), n = Object.create(null);
	for (let { label: r } of e) {
		t[r[0]] = !0;
		for (let e = 1; e < r.length; e++) n[r[e]] = !0;
	}
	let r = AS(t) + AS(n) + "*$";
	return [RegExp("^" + r), new RegExp(r)];
}
function MS(e) {
	let t = e.map((e) => typeof e == "string" ? { label: e } : e), [n, r] = t.every((e) => /^\w+$/.test(e.label)) ? [/\w*$/, /\w+$/] : jS(t);
	return (e) => {
		let i = e.matchBefore(r);
		return i || e.explicit ? {
			from: i ? i.from : e.pos,
			options: t,
			validFor: n
		} : null;
	};
}
function NS(e, t) {
	return (n) => {
		for (let t = qv(n.state).resolveInner(n.pos, -1); t; t = t.parent) {
			if (e.indexOf(t.name) > -1) return null;
			if (t.type.isTop) break;
		}
		return t(n);
	};
}
function PS(e, t) {
	return K.create(e.filter((e) => e.field == t).map((e) => K.range(e.from, e.to)));
}
function FS(e) {
	let t = HS.parse(e);
	return (e, n, r, i) => {
		let { text: a, ranges: o } = t.instantiate(e.state, r), { main: s } = e.state.selection, c = {
			changes: {
				from: r,
				to: i == s.from ? s.to : i,
				insert: G.of(a)
			},
			scrollIntoView: !0,
			annotations: n ? [RS.of(n), yl.userEvent.of("input.complete")] : void 0
		};
		if (o.length && (c.selection = PS(o, 0)), o.some((e) => e.field > 0)) {
			let t = new GS(o, 0), n = c.effects = [KS.of(t)];
			e.state.field(JS, !1) === void 0 && n.push(vl.appendConfig.of([
				JS,
				eC,
				tC,
				zS
			]));
		}
		e.dispatch(e.state.update(c));
	};
}
function IS(e) {
	return ({ state: t, dispatch: n }) => {
		let r = t.field(JS, !1);
		if (!r || e < 0 && r.active == 0) return !1;
		let i = r.active + e, a = e > 0 && !r.ranges.some((t) => t.field == i + e);
		return n(t.update({
			selection: PS(r.ranges, i),
			effects: KS.of(a ? null : new GS(r.ranges, i)),
			scrollIntoView: !0
		})), !0;
	};
}
function LS(e, t) {
	return {
		...t,
		apply: FS(e)
	};
}
var RS, zS, BS, VS, HS, US, WS, GS, KS, qS, JS, YS, XS, ZS, QS, $S, eC, tC, nC, rC = t((() => {
	Nl(), A_(), _x(), RS = /*@__PURE__*/ hl.define(), typeof navigator == "object" && navigator.platform, zS = /*@__PURE__*/ X.baseTheme({
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
	}), BS = class {
		constructor(e, t, n, r) {
			this.field = e, this.line = t, this.from = n, this.to = r;
		}
	}, VS = class e {
		constructor(e, t, n) {
			this.field = e, this.from = t, this.to = n;
		}
		map(t) {
			let n = t.mapPos(this.from, -1, qc.TrackDel), r = t.mapPos(this.to, 1, qc.TrackDel);
			return n == null || r == null ? null : new e(this.field, n, r);
		}
	}, HS = class e {
		constructor(e, t) {
			this.lines = e, this.fieldPositions = t;
		}
		instantiate(e, t) {
			let n = [], r = [t], i = e.doc.lineAt(t), a = /^\s*/.exec(i.text)[0];
			for (let i of this.lines) {
				if (n.length) {
					let n = a, o = /^\t*/.exec(i)[0].length;
					for (let t = 0; t < o; t++) n += e.facet(vb);
					r.push(t + n.length - o), i = n + i.slice(o);
				}
				n.push(i), t += i.length + 1;
			}
			return {
				text: n,
				ranges: this.fieldPositions.map((e) => new VS(e.field, r[e.line] + e.from, r[e.line] + e.to))
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
					i.push(new BS(s, r.length, a.index, a.index + c.length)), e = e.slice(0, a.index) + o + e.slice(a.index + a[0].length);
				}
				e = e.replace(/\\([{}])/g, (e, t, n) => {
					for (let e of i) e.line == r.length && e.from > n && (e.from--, e.to--);
					return t;
				}), r.push(e);
			}
			return new e(r, i);
		}
	}, US = /*@__PURE__*/ Y.widget({ widget: /*@__PURE__*/ new class extends Np {
		toDOM() {
			let e = document.createElement("span");
			return e.className = "cm-snippetFieldPosition", e;
		}
		ignoreEvent() {
			return !1;
		}
	}() }), WS = /*@__PURE__*/ Y.mark({ class: "cm-snippetField" }), GS = class e {
		constructor(e, t) {
			this.ranges = e, this.active = t, this.deco = Y.set(e.map((e) => (e.from == e.to ? US : WS).range(e.from, e.to)), !0);
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
	}, KS = /*@__PURE__*/ vl.define({ map(e, t) {
		return e && e.map(t);
	} }), qS = /*@__PURE__*/ vl.define(), JS = /*@__PURE__*/ tl.define({
		create() {
			return null;
		},
		update(e, t) {
			for (let n of t.effects) {
				if (n.is(KS)) return n.value;
				if (n.is(qS) && e) return new GS(e.ranges, n.value);
			}
			return e && t.docChanged && (e = e.map(t.changes)), e && t.selection && !e.selectionInsideField(t.selection) && (e = null), e;
		},
		provide: (e) => X.decorations.from(e, (e) => e ? e.deco : Y.none)
	}), YS = ({ state: e, dispatch: t }) => e.field(JS, !1) ? (t(e.update({ effects: KS.of(null) })), !0) : !1, XS = /*@__PURE__*/ IS(1), ZS = /*@__PURE__*/ IS(-1), QS = [{
		key: "Tab",
		run: XS,
		shift: ZS
	}, {
		key: "Escape",
		run: YS
	}], $S = /*@__PURE__*/ q.define({ combine(e) {
		return e.length ? e[0] : QS;
	} }), eC = /*@__PURE__*/ rl.highest(/*@__PURE__*/ sg.compute([$S], (e) => e.facet($S))), tC = /*@__PURE__*/ X.domEventHandlers({ mousedown(e, t) {
		let n = t.state.field(JS, !1), r;
		if (!n || (r = t.posAtCoords({
			x: e.clientX,
			y: e.clientY
		})) == null) return !1;
		let i = n.ranges.find((e) => e.from <= r && e.to >= r);
		return !i || i.field == n.active ? !1 : (t.dispatch({
			selection: PS(n.ranges, i.field),
			effects: KS.of(n.ranges.some((e) => e.field > i.field) ? new GS(n.ranges, i.field) : null),
			scrollIntoView: !0
		}), !0);
	} }), nC = /*@__PURE__*/ new class extends Tl {}(), nC.startSide = 1, nC.endSide = -1, typeof navigator == "object" && navigator.userAgent;
})), iC = /* @__PURE__ */ n({
	autoCloseTags: () => FC,
	completionPath: () => lC,
	esLint: () => hC,
	javascript: () => fC,
	javascriptLanguage: () => EC,
	jsxLanguage: () => kC,
	localCompletionSource: () => sC,
	scopeCompletionSource: () => dC,
	snippets: () => vC,
	tsxLanguage: () => AC,
	typescriptLanguage: () => OC,
	typescriptSnippets: () => yC
});
function aC(e) {
	return (t, n) => {
		let r = t.node.getChild("VariableDefinition");
		return r && n(r, e), !0;
	};
}
function oC(e, t) {
	let n = bC.get(t);
	if (n) return n;
	let r = [], i = !0;
	function a(t, n) {
		let i = e.sliceString(t.from, t.to);
		r.push({
			label: i,
			type: n
		});
	}
	return t.cursor(X_.IncludeAnonymous).iterate((t) => {
		if (i) i = !1;
		else if (t.name) {
			let e = CC[t.name];
			if (e && e(t, a) || xC.has(t.name)) return !1;
		} else if (t.to - t.from > 8192) {
			for (let n of oC(e, t.node)) r.push(n);
			return !1;
		}
	}), bC.set(t, r), r;
}
function sC(e) {
	let t = qv(e.state).resolveInner(e.pos, -1);
	if (TC.indexOf(t.name) > -1) return null;
	let n = t.name == "VariableName" || t.to - t.from < 20 && wC.test(e.state.sliceDoc(t.from, t.to));
	if (!n && !e.explicit) return null;
	let r = [];
	for (let n = t; n; n = n.parent) xC.has(n.name) && (r = r.concat(oC(e.state.doc, n)));
	return {
		options: r,
		from: n ? t.from : e.pos,
		validFor: wC
	};
}
function cC(e, t, n) {
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
function lC(e) {
	let t = (t) => e.state.doc.sliceString(t.from, t.to), n = qv(e.state).resolveInner(e.pos, -1);
	return n.name == "PropertyName" ? cC(t, n.parent, t(n)) : (n.name == "." || n.name == "?.") && n.parent.name == "MemberExpression" ? cC(t, n.parent, "") : TC.indexOf(n.name) > -1 ? null : n.name == "VariableName" || n.to - n.from < 20 && wC.test(t(n)) ? {
		path: [],
		name: t(n)
	} : n.name == "MemberExpression" ? cC(t, n, "") : e.explicit ? {
		path: [],
		name: ""
	} : null;
}
function uC(e, t) {
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
function dC(e) {
	let t = /* @__PURE__ */ new Map();
	return (n) => {
		let r = lC(n);
		if (!r) return null;
		let i = e;
		for (let e of r.path) if (i = i[e], !i) return null;
		let a = t.get(i);
		return a || t.set(i, a = uC(i, !r.path.length)), {
			from: n.pos - r.name.length,
			options: a,
			validFor: wC
		};
	};
}
function fC(e = {}) {
	let t = e.jsx ? e.typescript ? AC : kC : e.typescript ? OC : EC, n = e.typescript ? yC.concat(NC) : vC.concat(MC);
	return new hb(t, [
		EC.data.of({ autocomplete: NS(TC, MS(n)) }),
		EC.data.of({ autocomplete: sC }),
		e.jsx ? FC : []
	]);
}
function pC(e) {
	for (;;) {
		if (e.name == "JSXOpenTag" || e.name == "JSXSelfClosingTag" || e.name == "JSXFragmentTag") return e;
		if (e.name == "JSXEscape" || !e.parent) return null;
		e = e.parent;
	}
}
function mC(e, t, n = e.length) {
	for (let r = t?.firstChild; r; r = r.nextSibling) if (r.name == "JSXIdentifier" || r.name == "JSXBuiltin" || r.name == "JSXNamespacedName" || r.name == "JSXMemberExpression") return e.sliceString(r.from, Math.min(r.to, n));
	return "";
}
function hC(e, t) {
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
		for (let { from: n, to: a } of EC.findRegions(r)) {
			let o = r.doc.lineAt(n), s = {
				line: o.number - 1,
				col: n - o.from,
				pos: n
			};
			for (let o of e.verify(r.sliceDoc(n, a), t)) i.push(_C(o, r.doc, s));
		}
		return i;
	};
}
function gC(e, t, n, r) {
	return n.line(e + r.line).from + t + (e == 1 ? r.col - 1 : -1);
}
function _C(e, t, n) {
	let r = gC(e.line, e.column, t, n), i = {
		from: r,
		to: e.endLine != null && e.endColumn != 1 ? gC(e.endLine, e.endColumn, t, n) : r,
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
var vC, yC, bC, xC, SC, CC, wC, TC, EC, DC, OC, kC, AC, jC, MC, NC, PC, FC, IC = t((() => {
	kS(), _x(), Nl(), A_(), rC(), dv(), vC = [
		/*@__PURE__*/ LS("function ${name}(${params}) {\n	${}\n}", {
			label: "function",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
			label: "for",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("for (let ${name} of ${collection}) {\n	${}\n}", {
			label: "for",
			detail: "of loop",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("do {\n	${}\n} while (${})", {
			label: "do",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("while (${}) {\n	${}\n}", {
			label: "while",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("try {\n	${}\n} catch (${error}) {\n	${}\n}", {
			label: "try",
			detail: "/ catch block",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("if (${}) {\n	${}\n}", {
			label: "if",
			detail: "block",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("if (${}) {\n	${}\n} else {\n	${}\n}", {
			label: "if",
			detail: "/ else block",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("class ${name} {\n	constructor(${params}) {\n		${}\n	}\n}", {
			label: "class",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("import {${names}} from \"${module}\"\n${}", {
			label: "import",
			detail: "named",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("import ${name} from \"${module}\"\n${}", {
			label: "import",
			detail: "default",
			type: "keyword"
		})
	], yC = /*@__PURE__*/ vC.concat([
		/*@__PURE__*/ LS("interface ${name} {\n	${}\n}", {
			label: "interface",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("type ${name} = ${type}", {
			label: "type",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("enum ${name} {\n	${}\n}", {
			label: "enum",
			detail: "definition",
			type: "keyword"
		})
	]), bC = /*@__PURE__*/ new sv(), xC = /*@__PURE__*/ new Set([
		"Script",
		"Block",
		"FunctionExpression",
		"FunctionDeclaration",
		"ArrowFunction",
		"MethodDeclaration",
		"ForStatement"
	]), SC = ["FunctionDeclaration"], CC = {
		FunctionDeclaration: /*@__PURE__*/ aC("function"),
		ClassDeclaration: /*@__PURE__*/ aC("class"),
		ClassExpression: () => !0,
		EnumDeclaration: /*@__PURE__*/ aC("constant"),
		TypeAliasDeclaration: /*@__PURE__*/ aC("type"),
		NamespaceDeclaration: /*@__PURE__*/ aC("namespace"),
		VariableDefinition(e, t) {
			e.matchContext(SC) || t(e, "variable");
		},
		TypeDefinition(e, t) {
			t(e, "type");
		},
		__proto__: null
	}, wC = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/, TC = [
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
	], EC = /*@__PURE__*/ ob.define({
		name: "javascript",
		parser: /*@__PURE__*/ OS.configure({ props: [/*@__PURE__*/ bb.add({
			IfStatement: /*@__PURE__*/ fy({ except: /^\s*({|else\b)/ }),
			TryStatement: /*@__PURE__*/ fy({ except: /^\s*({|catch\b|finally\b)/ }),
			LabeledStatement: Sb,
			SwitchBody: (e) => {
				let t = e.textAfter, n = /^\s*\}/.test(t), r = /^\s*(case|default)\b/.test(t);
				return e.baseIndent + (n ? 0 : r ? 1 : 2) * e.unit;
			},
			Block: /*@__PURE__*/ uy({ closing: "}" }),
			ArrowFunction: (e) => e.baseIndent + e.unit,
			"TemplateString BlockComment": () => null,
			"Statement Property": /*@__PURE__*/ fy({ except: /^\s*{/ }),
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
		}), /*@__PURE__*/ Tb.add({
			"Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": my,
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
	}), DC = {
		test: (e) => /^JSX/.test(e.name),
		facet: /*@__PURE__*/ Gv({ commentTokens: { block: {
			open: "{/*",
			close: "*/}"
		} } })
	}, OC = /*@__PURE__*/ EC.configure({ dialect: "ts" }, "typescript"), kC = /*@__PURE__*/ EC.configure({
		dialect: "jsx",
		props: [/*@__PURE__*/ ib.add((e) => e.isTop ? [DC] : void 0)]
	}), AC = /*@__PURE__*/ EC.configure({
		dialect: "jsx ts",
		props: [/*@__PURE__*/ ib.add((e) => e.isTop ? [DC] : void 0)]
	}, "typescript"), jC = (e) => ({
		label: e,
		type: "keyword"
	}), MC = /*@__PURE__*/ "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(jC), NC = /*@__PURE__*/ MC.concat(/*@__PURE__*/ [
		"declare",
		"implements",
		"private",
		"protected",
		"public"
	].map(jC)), PC = typeof navigator == "object" && /*@__PURE__*/ /Android\b/.test(navigator.userAgent), FC = /*@__PURE__*/ X.inputHandler.of((e, t, n, r, i) => {
		if ((PC ? e.composing : e.compositionStarted) || e.state.readOnly || t != n || r != ">" && r != "/" || !EC.isActiveAt(e.state, t, -1)) return !1;
		let a = i(), { state: o } = a, s = o.changeByRange((e) => {
			let { head: t } = e, n = qv(o).resolveInner(t - 1, -1), i;
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
					if (r && e.from == t - 2 && ((i = mC(o.doc, r.firstChild, t)) || r.firstChild?.name == "JSXFragmentTag")) {
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
					let r = pC(n);
					if (r && r.name == "JSXOpenTag" && !/^\/?>|^<\//.test(o.doc.sliceString(t, t + 2)) && (i = mC(o.doc, r, t))) return {
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
		return s.changes.empty ? !1 : (e.dispatch([a, o.update(s, {
			userEvent: "input.complete",
			scrollIntoView: !0
		})]), !0);
	});
}));
//#endregion
//#region node_modules/@lezer/python/dist/index.js
function LC(e) {
	return e == zw || e == Bw;
}
function RC(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function zC(e, t, n) {
	this.parent = e, this.indent = t, this.flags = n, this.hash = (e ? e.hash + e.hash << 8 : 0) + t + (t << 4) + n + (n << 6);
}
function BC(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t += e.charCodeAt(n) == Hw ? 8 - t % 8 : 1;
	return t;
}
function VC(e, t) {
	if (t == Zw) for (let t = 0; t < 2 && e.next >= 48 && e.next <= 55; t++) e.advance();
	else if (t == Qw) for (let t = 0; t < 2 && RC(e.next); t++) e.advance();
	else if (t == eT) for (let t = 0; t < 4 && RC(e.next); t++) e.advance();
	else if (t == tT) for (let t = 0; t < 8 && RC(e.next); t++) e.advance();
	else if (t == $w && e.next == Kw) {
		for (e.advance(); e.next >= 0 && e.next != qw && e.next != Jw && e.next != Yw && e.next != zw;) e.advance();
		e.next == qw && e.advance();
	}
}
var HC, UC, WC, GC, KC, qC, JC, YC, XC, ZC, QC, $C, ew, tw, nw, rw, iw, aw, ow, sw, cw, lw, uw, dw, fw, pw, mw, hw, gw, _w, vw, yw, bw, xw, Sw, Cw, ww, Tw, Ew, Dw, Ow, kw, Aw, jw, Mw, Nw, Pw, Fw, Iw, Lw, Rw, zw, Bw, Vw, Hw, Uw, Ww, Gw, Kw, qw, Jw, Yw, Xw, Zw, Qw, $w, eT, tT, nT, rT, iT, aT, oT, sT, cT, lT, uT, dT, fT, pT, mT, hT, gT, _T, vT, yT = t((() => {
	Kx(), Uv(), HC = 1, UC = 194, WC = 195, GC = 196, KC = 197, qC = 198, JC = 199, YC = 200, XC = 2, ZC = 3, QC = 201, $C = 24, ew = 25, tw = 49, nw = 50, rw = 55, iw = 56, aw = 57, ow = 59, sw = 60, cw = 61, lw = 62, uw = 63, dw = 65, fw = 238, pw = 71, mw = 241, hw = 242, gw = 243, _w = 244, vw = 245, yw = 246, bw = 247, xw = 248, Sw = 72, Cw = 249, ww = 250, Tw = 251, Ew = 252, Dw = 253, Ow = 254, kw = 255, Aw = 256, jw = 73, Mw = 77, Nw = 263, Pw = 112, Fw = 130, Iw = 151, Lw = 152, Rw = 155, zw = 10, Bw = 13, Vw = 32, Hw = 9, Uw = 35, Ww = 40, Gw = 46, Kw = 123, qw = 125, Jw = 39, Yw = 34, Xw = 92, Zw = 111, Qw = 120, $w = 78, eT = 117, tT = 85, nT = /* @__PURE__ */ new Set([
		ew,
		tw,
		nw,
		Nw,
		dw,
		Fw,
		iw,
		aw,
		fw,
		lw,
		uw,
		Sw,
		jw,
		Mw,
		sw,
		cw,
		Iw,
		Lw,
		Rw,
		Pw
	]), rT = new Ix((e, t) => {
		let n;
		if (e.next < 0) e.acceptToken(JC);
		else if (t.context.flags & aT) LC(e.next) && e.acceptToken(qC, 1);
		else if (((n = e.peek(-1)) < 0 || LC(n)) && t.canShift(KC)) {
			let t = 0;
			for (; e.next == Vw || e.next == Hw;) e.advance(), t++;
			(e.next == zw || e.next == Bw || e.next == Uw) && e.acceptToken(KC, -t);
		} else LC(e.next) && e.acceptToken(GC, 1);
	}, { contextual: !0 }), iT = new Ix((e, t) => {
		let n = t.context;
		if (n.flags) return;
		let r = e.peek(-1);
		if (r == zw || r == Bw) {
			let t = 0, r = 0;
			for (;;) {
				if (e.next == Vw) t++;
				else if (e.next == Hw) t += 8 - t % 8;
				else break;
				e.advance(), r++;
			}
			t != n.indent && e.next != zw && e.next != Bw && e.next != Uw && (t < n.indent ? e.acceptToken(WC, -r) : e.acceptToken(UC));
		}
	}), aT = 1, oT = 2, sT = 4, cT = 8, lT = 16, uT = 32, dT = new zC(null, 0, 0), fT = new Map([
		[mw, 0],
		[hw, sT],
		[gw, cT],
		[_w, 12],
		[vw, lT],
		[yw, 20],
		[bw, 24],
		[xw, 28],
		[Cw, uT],
		[ww, 36],
		[Tw, 40],
		[Ew, 44],
		[Dw, 48],
		[Ow, 52],
		[kw, 56],
		[Aw, 60]
	].map(([e, t]) => [e, t | oT])), pT = new Wx({
		start: dT,
		reduce(e, t, n, r) {
			return e.flags & aT && nT.has(t) || (t == pw || t == Sw) && e.flags & oT ? e.parent : e;
		},
		shift(e, t, n, r) {
			return t == UC ? new zC(e, BC(r.read(r.pos, n.pos)), 0) : t == WC ? e.parent : t == $C || t == rw || t == ow || t == ZC ? new zC(e, 0, aT) : fT.has(t) ? new zC(e, 0, fT.get(t) | e.flags & aT) : e;
		},
		hash(e) {
			return e.hash;
		}
	}), mT = new Ix((e) => {
		for (let t = 0; t < 5; t++) {
			if (e.next != "print".charCodeAt(t)) return;
			e.advance();
		}
		if (!/\w/.test(String.fromCharCode(e.next))) for (let t = 0;; t++) {
			let n = e.peek(t);
			if (!(n == Vw || n == Hw)) {
				n != Ww && n != Gw && n != zw && n != Bw && n != Uw && e.acceptToken(HC);
				return;
			}
		}
	}), hT = new Ix((e, t) => {
		let { flags: n } = t.context, r = n & sT ? Yw : Jw, i = (n & cT) > 0, a = !(n & lT), o = (n & uT) > 0, s = e.pos;
		for (; !(e.next < 0);) if (o && e.next == Kw) if (e.peek(1) == Kw) e.advance(2);
		else {
			if (e.pos == s) {
				e.acceptToken(ZC, 1);
				return;
			}
			break;
		}
		else if (a && e.next == Xw) {
			if (e.pos == s) {
				e.advance();
				let t = e.next;
				t >= 0 && (e.advance(), VC(e, t)), e.acceptToken(XC);
				return;
			}
			break;
		} else if (e.next == Xw && !a && e.peek(1) > -1) e.advance(2);
		else if (e.next == r && (!i || e.peek(1) == r && e.peek(2) == r)) {
			if (e.pos == s) {
				e.acceptToken(QC, i ? 3 : 1);
				return;
			}
			break;
		} else if (e.next == zw) {
			if (i) e.advance();
			else if (e.pos == s) {
				e.acceptToken(QC);
				return;
			}
			break;
		} else e.advance();
		e.pos > s && e.acceptToken(YC);
	}), gT = hv({
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
	}), _T = {
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
	}, vT = Gx.deserialize({
		version: 14,
		states: "##jQ`QeOOP$}OSOOO&WQtO'#HUOOQS'#Co'#CoOOQS'#Cp'#CpO'vQdO'#CnO*UQtO'#HTOOQS'#HU'#HUOOQS'#DU'#DUOOQS'#HT'#HTO*rQdO'#D_O+VQdO'#DfO+gQdO'#DjO+zOWO'#DuO,VOWO'#DvO.[QtO'#GuOOQS'#Gu'#GuO'vQdO'#GtO0ZQtO'#GtOOQS'#Eb'#EbO0rQdO'#EcOOQS'#Gs'#GsO0|QdO'#GrOOQV'#Gr'#GrO1XQdO'#FYOOQS'#G^'#G^O1^QdO'#FXOOQV'#IS'#ISOOQV'#Gq'#GqOOQV'#Fq'#FqQ`QeOOO'vQdO'#CqO1lQdO'#C}O1sQdO'#DRO2RQdO'#HYO2cQtO'#EVO'vQdO'#EWOOQS'#EY'#EYOOQS'#E['#E[OOQS'#E^'#E^O2wQdO'#E`O3_QdO'#EdO3rQdO'#EfO3zQtO'#EfO1XQdO'#EiO0rQdO'#ElO1XQdO'#EnO0rQdO'#EtO0rQdO'#EwO4VQdO'#EyO4^QdO'#FOO4iQdO'#EzO0rQdO'#FOO1XQdO'#FQO1XQdO'#FVO4nQdO'#F[P4uOdO'#GpPOOO)CBd)CBdOOQS'#Ce'#CeOOQS'#Cf'#CfOOQS'#Cg'#CgOOQS'#Ch'#ChOOQS'#Ci'#CiOOQS'#Cj'#CjOOQS'#Cl'#ClO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO5TQdO'#DoOOQS,5:Y,5:YO5hQdO'#HdOOQS,5:],5:]O5uQ!fO,5:]O5zQtO,59YO1lQdO,59bO1lQdO,59bO1lQdO,59bO8jQdO,59bO8oQdO,59bO8vQdO,59jO8}QdO'#HTO:TQdO'#HSOOQS'#HS'#HSOOQS'#D['#D[O:lQdO,59aO'vQdO,59aO:zQdO,59aOOQS,59y,59yO;PQdO,5:RO'vQdO,5:ROOQS,5:Q,5:QO;_QdO,5:QO;dQdO,5:XO'vQdO,5:XO'vQdO,5:VOOQS,5:U,5:UO;uQdO,5:UO;zQdO,5:WOOOW'#Fy'#FyO<POWO,5:aOOQS,5:a,5:aO<[QdO'#HwOOOW'#Dw'#DwOOOW'#Fz'#FzO<lOWO,5:bOOQS,5:b,5:bOOQS'#F}'#F}O<zQtO,5:iO?lQtO,5=`O@VQ#xO,5=`O@vQtO,5=`OOQS,5:},5:}OA_QeO'#GWOBqQdO,5;^OOQV,5=^,5=^OB|QtO'#IPOCkQdO,5;tOOQS-E:[-E:[OOQV,5;s,5;sO4dQdO'#FQOOQV-E9o-E9oOCsQtO,59]OEzQtO,59iOFeQdO'#HVOFpQdO'#HVO1XQdO'#HVOF{QdO'#DTOGTQdO,59mOGYQdO'#HZO'vQdO'#HZO0rQdO,5=tOOQS,5=t,5=tO0rQdO'#EROOQS'#ES'#ESOGwQdO'#GPOHXQdO,58|OHXQdO,58|O*xQdO,5:oOHgQtO'#H]OOQS,5:r,5:rOOQS,5:z,5:zOHzQdO,5;OOI]QdO'#IOO1XQdO'#H}OOQS,5;Q,5;QOOQS'#GT'#GTOIqQtO,5;QOJPQdO,5;QOJUQdO'#IQOOQS,5;T,5;TOJdQdO'#H|OOQS,5;W,5;WOJuQdO,5;YO4iQdO,5;`O4iQdO,5;cOJ}QtO'#ITO'vQdO'#ITOKXQdO,5;eO4VQdO,5;eO0rQdO,5;jO1XQdO,5;lOK^QeO'#EuOLjQgO,5;fO!!kQdO'#IUO4iQdO,5;jO!!vQdO,5;lO!#OQdO,5;qO!#ZQtO,5;vO'vQdO,5;vPOOO,5=[,5=[P!#bOSO,5=[P!#jOdO,5=[O!&bQtO1G.jO!&iQtO1G.jO!)YQtO1G.jO!)dQtO1G.jO!+}QtO1G.jO!,bQtO1G.jO!,uQdO'#HcO!-TQtO'#GuO0rQdO'#HcO!-_QdO'#HbOOQS,5:Z,5:ZO!-gQdO,5:ZO!-lQdO'#HeO!-wQdO'#HeO!.[QdO,5>OOOQS'#Ds'#DsOOQS1G/w1G/wOOQS1G.|1G.|O!/[QtO1G.|O!/cQtO1G.|O1lQdO1G.|O!0OQdO1G/UOOQS'#DZ'#DZO0rQdO,59tOOQS1G.{1G.{O!0VQdO1G/eO!0gQdO1G/eO!0oQdO1G/fO'vQdO'#H[O!0tQdO'#H[O!0yQtO1G.{O!1ZQdO,59iO!2aQdO,5=zO!2qQdO,5=zO!2yQdO1G/mO!3OQtO1G/mOOQS1G/l1G/lO!3`QdO,5=uO!4VQdO,5=uO0rQdO1G/qO!4tQdO1G/sO!4yQtO1G/sO!5ZQtO1G/qOOQS1G/p1G/pOOQS1G/r1G/rOOOW-E9w-E9wOOQS1G/{1G/{O!5kQdO'#HxO0rQdO'#HxO!5|QdO,5>cOOOW-E9x-E9xOOQS1G/|1G/|OOQS-E9{-E9{O!6[Q#xO1G2zO!6{QtO1G2zO'vQdO,5<jOOQS,5<j,5<jOOQS-E9|-E9|OOQS,5<r,5<rOOQS-E:U-E:UOOQV1G0x1G0xO1XQdO'#GRO!7dQtO,5>kOOQS1G1`1G1`O!8RQdO1G1`OOQS'#DV'#DVO0rQdO,5=qOOQS,5=q,5=qO!8WQdO'#FrO!8cQdO,59oO!8kQdO1G/XO!8uQtO,5=uOOQS1G3`1G3`OOQS,5:m,5:mO!9fQdO'#GtOOQS,5<k,5<kOOQS-E9}-E9}O!9wQdO1G.hOOQS1G0Z1G0ZO!:VQdO,5=wO!:gQdO,5=wO0rQdO1G0jO0rQdO1G0jO!:xQdO,5>jO!;ZQdO,5>jO1XQdO,5>jO!;lQdO,5>iOOQS-E:R-E:RO!;qQdO1G0lO!;|QdO1G0lO!<RQdO,5>lO!<aQdO,5>lO!<oQdO,5>hO!=VQdO,5>hO!=hQdO'#EpO0rQdO1G0tO!=sQdO1G0tO!=xQgO1G0zO!AvQgO1G0}O!EqQdO,5>oO!E{QdO,5>oO!FTQtO,5>oO0rQdO1G1PO!F_QdO1G1PO4iQdO1G1UO!!vQdO1G1WOOQV,5;a,5;aO!FdQfO,5;aO!FiQgO1G1QO!JjQdO'#GZO4iQdO1G1QO4iQdO1G1QO!JzQdO,5>pO!KXQdO,5>pO1XQdO,5>pOOQV1G1U1G1UO!KaQdO'#FSO!KrQ!fO1G1WO!KzQdO1G1WOOQV1G1]1G1]O4iQdO1G1]O!LPQdO1G1]O!LXQdO'#F^OOQV1G1b1G1bO!#ZQtO1G1bPOOO1G2v1G2vP!L^OSO1G2vOOQS,5=},5=}OOQS'#Dp'#DpO0rQdO,5=}O!LfQdO,5=|O!LyQdO,5=|OOQS1G/u1G/uO!MRQdO,5>PO!McQdO,5>PO!MkQdO,5>PO!NOQdO,5>PO!N`QdO,5>POOQS1G3j1G3jOOQS7+$h7+$hO!8kQdO7+$pO#!RQdO1G.|O#!YQdO1G.|OOQS1G/`1G/`OOQS,5<`,5<`O'vQdO,5<`OOQS7+%P7+%PO#!aQdO7+%POOQS-E9r-E9rOOQS7+%Q7+%QO#!qQdO,5=vO'vQdO,5=vOOQS7+$g7+$gO#!vQdO7+%PO##OQdO7+%QO##TQdO1G3fOOQS7+%X7+%XO##eQdO1G3fO##mQdO7+%XOOQS,5<_,5<_O'vQdO,5<_O##rQdO1G3aOOQS-E9q-E9qO#$iQdO7+%]OOQS7+%_7+%_O#$wQdO1G3aO#%fQdO7+%_O#%kQdO1G3gO#%{QdO1G3gO#&TQdO7+%]O#&YQdO,5>dO#&sQdO,5>dO#&sQdO,5>dOOQS'#Dx'#DxO#'UO&jO'#DzO#'aO`O'#HyOOOW1G3}1G3}O#'fQdO1G3}O#'nQdO1G3}O#'yQ#xO7+(fO#(jQtO1G2UP#)TQdO'#GOOOQS,5<m,5<mOOQS-E:P-E:POOQS7+&z7+&zOOQS1G3]1G3]OOQS,5<^,5<^OOQS-E9p-E9pOOQS7+$s7+$sO#)bQdO,5=`O#){QdO,5=`O#*^QtO,5<aO#*qQdO1G3cOOQS-E9s-E9sOOQS7+&U7+&UO#+RQdO7+&UO#+aQdO,5<nO#+uQdO1G4UOOQS-E:Q-E:QO#,WQdO1G4UOOQS1G4T1G4TOOQS7+&W7+&WO#,iQdO7+&WOOQS,5<p,5<pO#,tQdO1G4WOOQS-E:S-E:SOOQS,5<l,5<lO#-SQdO1G4SOOQS-E:O-E:OO1XQdO'#EqO#-jQdO'#EqO#-uQdO'#IRO#-}QdO,5;[OOQS7+&`7+&`O0rQdO7+&`O#.SQgO7+&fO!JmQdO'#GXO4iQdO7+&fO4iQdO7+&iO#2QQtO,5<tO'vQdO,5<tO#2[QdO1G4ZOOQS-E:W-E:WO#2fQdO1G4ZO4iQdO7+&kO0rQdO7+&kOOQV7+&p7+&pO!KrQ!fO7+&rO!KzQdO7+&rO`QeO1G0{OOQV-E:X-E:XO4iQdO7+&lO4iQdO7+&lOOQV,5<u,5<uO#2nQdO,5<uO!JmQdO,5<uOOQV7+&l7+&lO#2yQgO7+&lO#6tQdO,5<vO#7PQdO1G4[OOQS-E:Y-E:YO#7^QdO1G4[O#7fQdO'#IWO#7tQdO'#IWO1XQdO'#IWOOQS'#IW'#IWO#8PQdO'#IVOOQS,5;n,5;nO#8XQdO,5;nO0rQdO'#FUOOQV7+&r7+&rO4iQdO7+&rOOQV7+&w7+&wO4iQdO7+&wO#8^QfO,5;xOOQV7+&|7+&|POOO7+(b7+(bO#8cQdO1G3iOOQS,5<c,5<cO#8qQdO1G3hOOQS-E9u-E9uO#9UQdO,5<dO#9aQdO,5<dO#9tQdO1G3kOOQS-E9v-E9vO#:UQdO1G3kO#:^QdO1G3kO#:nQdO1G3kO#:UQdO1G3kOOQS<<H[<<H[O#:yQtO1G1zOOQS<<Hk<<HkP#;WQdO'#FtO8vQdO1G3bO#;eQdO1G3bO#;jQdO<<HkOOQS<<Hl<<HlO#;zQdO7+)QOOQS<<Hs<<HsO#<[QtO1G1yP#<{QdO'#FsO#=YQdO7+)RO#=jQdO7+)RO#=rQdO<<HwO#=wQdO7+({OOQS<<Hy<<HyO#>nQdO,5<bO'vQdO,5<bOOQS-E9t-E9tOOQS<<Hw<<HwOOQS,5<g,5<gO0rQdO,5<gO#>sQdO1G4OOOQS-E9y-E9yO#?^QdO1G4OO<[QdO'#H{OOOO'#D{'#D{OOOO'#F|'#F|O#?oO&jO,5:fOOOW,5>e,5>eOOOW7+)i7+)iO#?zQdO7+)iO#@SQdO1G2zO#@mQdO1G2zP'vQdO'#FuO0rQdO<<IpO1XQdO1G2YP1XQdO'#GSO#AOQdO7+)pO#AaQdO7+)pOOQS<<Ir<<IrP1XQdO'#GUP0rQdO'#GQOOQS,5;],5;]O#ArQdO,5>mO#BQQdO,5>mOOQS1G0v1G0vOOQS<<Iz<<IzOOQV-E:V-E:VO4iQdO<<JQOOQV,5<s,5<sO4iQdO,5<sOOQV<<JQ<<JQOOQV<<JT<<JTO#BYQtO1G2`P#BdQdO'#GYO#BkQdO7+)uO#BuQgO<<JVO4iQdO<<JVOOQV<<J^<<J^O4iQdO<<J^O!KrQ!fO<<J^O#FpQgO7+&gOOQV<<JW<<JWO#FzQgO<<JWOOQV1G2a1G2aO1XQdO1G2aO#JuQdO1G2aO4iQdO<<JWO1XQdO1G2bP0rQdO'#G[O#KQQdO7+)vO#K_QdO7+)vOOQS'#FT'#FTO0rQdO,5>rO#KgQdO,5>rO#KrQdO,5>rO#K}QdO,5>qO#L`QdO,5>qOOQS1G1Y1G1YOOQS,5;p,5;pOOQV<<Jc<<JcO#LhQdO1G1dOOQS7+)T7+)TP#LmQdO'#FwO#L}QdO1G2OO#MbQdO1G2OO#MrQdO1G2OP#M}QdO'#FxO#N[QdO7+)VO#NlQdO7+)VO#NlQdO7+)VO#NtQdO7+)VO$ UQdO7+(|O8vQdO7+(|OOQSAN>VAN>VO$ oQdO<<LmOOQSAN>cAN>cO0rQdO1G1|O$!PQtO1G1|P$!ZQdO'#FvOOQS1G2R1G2RP$!hQdO'#F{O$!uQdO7+)jO$#`QdO,5>gOOOO-E9z-E9zOOOW<<MT<<MTO$#nQdO7+(fOOQSAN?[AN?[OOQS7+'t7+'tO$$XQdO<<M[OOQS,5<q,5<qO$$jQdO1G4XOOQS-E:T-E:TOOQVAN?lAN?lOOQV1G2_1G2_O4iQdOAN?qO$$xQgOAN?qOOQVAN?xAN?xO4iQdOAN?xOOQV<<JR<<JRO4iQdOAN?rO4iQdO7+'{OOQV7+'{7+'{O1XQdO7+'{OOQVAN?rAN?rOOQS7+'|7+'|O$(sQdO<<MbOOQS1G4^1G4^O0rQdO1G4^OOQS,5<w,5<wO$)QQdO1G4]OOQS-E:Z-E:ZOOQU'#G_'#G_O$)cQfO7+'OO$)nQdO'#F_O$*uQdO7+'jO$+VQdO7+'jOOQS7+'j7+'jO$+bQdO<<LqO$+rQdO<<LqO$+rQdO<<LqO$+zQdO'#H^OOQS<<Lh<<LhO$,UQdO<<LhOOQS7+'h7+'hOOQS'#D|'#D|OOOO1G4R1G4RO$,oQdO1G4RO$,wQdO1G4RP!=hQdO'#GVOOQVG25]G25]O4iQdOG25]OOQVG25dG25dOOQVG25^G25^OOQV<<Kg<<KgO4iQdO<<KgOOQS7+)x7+)xP$-SQdO'#G]OOQU-E:]-E:]OOQV<<Jj<<JjO$-vQtO'#FaOOQS'#Fc'#FcO$.WQdO'#FbO$.xQdO'#FbOOQS'#Fb'#FbO$.}QdO'#IYO$)nQdO'#FiO$)nQdO'#FiO$/fQdO'#FjO$)nQdO'#FkO$/mQdO'#IZOOQS'#IZ'#IZO$0[QdO,5;yOOQS<<KU<<KUO$0dQdO<<KUO$0tQdOANB]O$1UQdOANB]O$1^QdO'#H_OOQS'#H_'#H_O1sQdO'#DcO$1wQdO,5=xOOQSANBSANBSOOOO7+)m7+)mO$2`QdO7+)mOOQVLD*wLD*wOOQVANARANARO5uQ!fO'#GaO$2hQtO,5<SO$)nQdO'#FmOOQS,5<W,5<WOOQS'#Fd'#FdO$3YQdO,5;|O$3_QdO,5;|OOQS'#Fg'#FgO$)nQdO'#G`O$4PQdO,5<QO$4kQdO,5>tO$4{QdO,5>tO1XQdO,5<PO$5^QdO,5<TO$5cQdO,5<TO$)nQdO'#I[O$5hQdO'#I[O$5mQdO,5<UOOQS,5<V,5<VO0rQdO'#FpOOQU1G1e1G1eO4iQdO1G1eOOQSAN@pAN@pO$5rQdOG27wO$6SQdO,59}OOQS1G3d1G3dOOOO<<MX<<MXOOQS,5<{,5<{OOQS-E:_-E:_O$6XQtO'#FaO$6`QdO'#I]O$6nQdO'#I]O$6vQdO,5<XOOQS1G1h1G1hO$6{QdO1G1hO$7QQdO,5<zOOQS-E:^-E:^O$7lQdO,5=OO$8TQdO1G4`OOQS-E:b-E:bOOQS1G1k1G1kOOQS1G1o1G1oO$8eQdO,5>vO$)nQdO,5>vOOQS1G1p1G1pOOQS,5<[,5<[OOQU7+'P7+'PO$+zQdO1G/iO$)nQdO,5<YO$8sQdO,5>wO$8zQdO,5>wOOQS1G1s1G1sOOQS7+'S7+'SP$)nQdO'#GdO$9SQdO1G4bO$9^QdO1G4bO$9fQdO1G4bOOQS7+%T7+%TO$9tQdO1G1tO$:SQtO'#FaO$:ZQdO,5<}OOQS,5<},5<}O$:iQdO1G4cOOQS-E:a-E:aO$)nQdO,5<|O$:pQdO,5<|O$:uQdO7+)|OOQS-E:`-E:`O$;PQdO7+)|O$)nQdO,5<ZP$)nQdO'#GcO$;XQdO1G2hO$)nQdO1G2hP$;gQdO'#GbO$;nQdO<<MhO$;xQdO1G1uO$<WQdO7+(SO8vQdO'#C}O8vQdO,59bO8vQdO,59bO8vQdO,59bO$<fQtO,5=`O8vQdO1G.|O0rQdO1G/XO0rQdO7+$pP$<yQdO'#GOO'vQdO'#GtO$=WQdO,59bO$=]QdO,59bO$=dQdO,59mO$=iQdO1G/UO1sQdO'#DRO8vQdO,59j",
		stateData: "$>S~O%cOS%^OSSOS%]PQ~OPdOVaOfoOhYOopOs!POvqO!PrO!Q{O!T!SO!U!RO!XZO!][O!h`O!r`O!s`O!t`O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#l!QO#o!TO#s!UO#u!VO#z!WO#}hO$P!XO%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~O%]!YO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%j![O%k!]O%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aO~Ok%xXl%xXm%xXn%xXo%xXp%xXs%xXz%xX{%xX!x%xX#g%xX%[%xX%_%xX%z%xXg%xX!T%xX!U%xX%{%xX!W%xX![%xX!Q%xX#[%xXt%xX!m%xX~P%SOfoOhYO!XZO!][O!h`O!r`O!s`O!t`O%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~Oz%wX{%wX#g%wX%[%wX%_%wX%z%wX~Ok!pOl!qOm!oOn!oOo!rOp!sOs!tO!x%wX~P)pOV!zOg!|Oo0cOv0qO!PrO~P'vOV#OOo0cOv0qO!W#PO~P'vOV#SOa#TOo0cOv0qO![#UO~P'vOQ#XO%`#XO%a#ZO~OQ#^OR#[O%`#^O%a#`O~OV%iX_%iXa%iXh%iXk%iXl%iXm%iXn%iXo%iXp%iXs%iXz%iX!X%iX!f%iX%j%iX%k%iX%l%iX%m%iX%n%iX%o%iX%p%iX%q%iX%r%iX%s%iXg%iX!T%iX!U%iX~O&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O{%iX!x%iX#g%iX%[%iX%_%iX%z%iX%{%iX!W%iX![%iX!Q%iX#[%iXt%iX!m%iX~P,eOz#dO{%hX!x%hX#g%hX%[%hX%_%hX%z%hX~Oo0cOv0qO~P'vO#g#gO%[#iO%_#iO~O%uWO~O!T#nO#u!VO#z!WO#}hO~OopO~P'vOV#sOa#tO%uWO{wP~OV#xOo0cOv0qO!Q#yO~P'vO{#{O!x$QO%z#|O#g!yX%[!yX%_!yX~OV#xOo0cOv0qO#g#SX%[#SX%_#SX~P'vOo0cOv0qO#g#WX%[#WX%_#WX~P'vOh$WO%uWO~O!f$YO!r$YO%uWO~OV$eO~P'vO!U$gO#s$hO#u$iO~O{$jO~OV$qO~P'vOS$sO%[$rO%_$rO%c$tO~OV$}Oa$}Og%POo0cOv0qO~P'vOo0cOv0qO{%SO~P'vO&Y%UO~Oa!bOh!iO!X!kO!f!mOVba_bakbalbambanbaobapbasbazba{ba!xba#gba%[ba%_ba%jba%kba%lba%mba%nba%oba%pba%qba%rba%sba%zbagba!Tba!Uba%{ba!Wba![ba!Qba#[batba!mba~On%ZO~Oo%ZO~P'vOo0cO~P'vOk0eOl0fOm0dOn0dOo0mOp0nOs0rOg%wX!T%wX!U%wX%{%wX!W%wX![%wX!Q%wX#[%wX!m%wX~P)pO%{%]Og%vXz%vX!T%vX!U%vX!W%vX{%vX~Og%_Oz%`O!T%dO!U%cO~Og%_O~Oz%gO!T%dO!U%cO!W&SX~O!W%kO~Oz%lO{%nO!T%dO!U%cO![%}X~O![%rO~O![%sO~OQ#XO%`#XO%a%uO~OV%wOo0cOv0qO!PrO~P'vOQ#^OR#[O%`#^O%a%zO~OV!qa_!qaa!qah!qak!qal!qam!qan!qao!qap!qas!qaz!qa{!qa!X!qa!f!qa!x!qa#g!qa%[!qa%_!qa%j!qa%k!qa%l!qa%m!qa%n!qa%o!qa%p!qa%q!qa%r!qa%s!qa%z!qag!qa!T!qa!U!qa%{!qa!W!qa![!qa!Q!qa#[!qat!qa!m!qa~P#yOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P%SOV&OOopOvqO{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P'vOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#g$zX%[$zX%_$zX~P'vO#g#gO%[&TO%_&TO~O!f&UOh&sX%[&sXz&sX#[&sX#g&sX%_&sX#Z&sXg&sX~Oh!iO%[&WO~Okealeameaneaoeapeaseazea{ea!xea#gea%[ea%_ea%zeagea!Tea!Uea%{ea!Wea![ea!Qea#[eatea!mea~P%SOsqazqa{qa#gqa%[qa%_qa%zqa~Ok!pOl!qOm!oOn!oOo!rOp!sO!xqa~PEcO%z&YOz%yX{%yX~O%uWOz%yX{%yX~Oz&]O{wX~O{&_O~Oz%lO#g%}X%[%}X%_%}Xg%}X{%}X![%}X!m%}X%z%}X~OV0lOo0cOv0qO!PrO~P'vO%z#|O#gUa%[Ua%_Ua~Oz&hO#g&PX%[&PX%_&PXn&PX~P%SOz&kO!Q&jO#g#Wa%[#Wa%_#Wa~Oz&lO#[&nO#g&rX%[&rX%_&rXg&rX~O!f$YO!r$YO#Z&qO%uWO~O#Z&qO~Oz&sO#g&tX%[&tX%_&tX~Oz&uO#g&pX%[&pX%_&pX{&pX~O!X&wO%z&xO~Oz&|On&wX~P%SOn'PO~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO%['UO~P'vOt'YO#p'WO#q'XOP#naV#naf#nah#nao#nas#nav#na!P#na!Q#na!T#na!U#na!X#na!]#na!h#na!r#na!s#na!t#na!{#na!}#na#P#na#R#na#T#na#X#na#Z#na#^#na#_#na#a#na#c#na#l#na#o#na#s#na#u#na#z#na#}#na$P#na%X#na%o#na%p#na%t#na%u#na&Z#na&[#na&]#na&^#na&_#na&`#na&a#na&b#na&c#na&d#na&e#na&f#na&g#na&h#na&i#na&j#na%Z#na%_#na~Oz'ZO#[']O{&xX~Oh'_O!X&wO~Oh!iO{$jO!X&wO~O{'eO~P%SO%['hO%_'hO~OS'iO%['hO%_'hO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%k!]O~P!#uO%kWi~P!#uOV!aO_!aOa!bOh!iO!X!kO!f!mO%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%m!_O%n!_O~P!&pO%mWi%nWi~P!&pOa!bOh!iO!X!kO!f!mOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%mWi%nWi%oWi%pWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~OV!aO_!aO%q!aO%r!aO%s!aO~P!)nOVWi_Wi%qWi%rWi%sWi~P!)nO!T%dO!U%cOg&VXz&VX~O%z'kO%{'kO~P,eOz'mOg&UX~Og'oO~Oz'pO{'rO!W&XX~Oo0cOv0qOz'pO{'sO!W&XX~P'vO!W'uO~Om!oOn!oOo!rOp!sOkjisjizji{ji!xji#gji%[ji%_ji%zji~Ol!qO~P!.aOlji~P!.aOk0eOl0fOm0dOn0dOo0mOp0nO~Ot'wO~P!/jOV'|Og'}Oo0cOv0qO~P'vOg'}Oz(OO~Og(QO~O!U(SO~Og(TOz(OO!T%dO!U%cO~P%SOk0eOl0fOm0dOn0dOo0mOp0nOgqa!Tqa!Uqa%{qa!Wqa![qa!Qqa#[qatqa!mqa~PEcOV'|Oo0cOv0qO!W&Sa~P'vOz(WO!W&Sa~O!W(XO~Oz(WO!T%dO!U%cO!W&Sa~P%SOV(]Oo0cOv0qO![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~P'vOz(^O![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~O![(aO~Oz(^O!T%dO!U%cO![%}a~P%SOz(dO!T%dO!U%cO![&Ta~P%SOz(gO{&lX![&lX!m&lX%z&lX~O{(kO![(mO!m(nO%z(jO~OV&OOopOvqO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~P'vOz(pO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~O!f&UOh&sa%[&saz&sa#[&sa#g&sa%_&sa#Z&sag&sa~O%[(uO~OV#sOa#tO%uWO~Oz&]O{wa~OopOvqO~P'vOz(^O#g%}a%[%}a%_%}ag%}a{%}a![%}a!m%}a%z%}a~P%SOz(zO#g%hX%[%hX%_%hX%z%hX~O%z#|O#gUi%[Ui%_Ui~O#g&Pa%[&Pa%_&Pan&Pa~P'vOz(}O#g&Pa%[&Pa%_&Pan&Pa~O%uWO#g&ra%[&ra%_&rag&ra~Oz)SO#g&ra%[&ra%_&rag&ra~Og)VO~OV)WOh$WO%uWO~O#Z)XO~O%uWO#g&ta%[&ta%_&ta~Oz)ZO#g&ta%[&ta%_&ta~Oo0cOv0qO#g&pa%[&pa%_&pa{&pa~P'vOz)^O#g&pa%[&pa%_&pa{&pa~OV)`Oa)`O%uWO~O%z)eO~Ot)hO#j)gOP#hiV#hif#hih#hio#his#hiv#hi!P#hi!Q#hi!T#hi!U#hi!X#hi!]#hi!h#hi!r#hi!s#hi!t#hi!{#hi!}#hi#P#hi#R#hi#T#hi#X#hi#Z#hi#^#hi#_#hi#a#hi#c#hi#l#hi#o#hi#s#hi#u#hi#z#hi#}#hi$P#hi%X#hi%o#hi%p#hi%t#hi%u#hi&Z#hi&[#hi&]#hi&^#hi&_#hi&`#hi&a#hi&b#hi&c#hi&d#hi&e#hi&f#hi&g#hi&h#hi&i#hi&j#hi%Z#hi%_#hi~Ot)iOP#kiV#kif#kih#kio#kis#kiv#ki!P#ki!Q#ki!T#ki!U#ki!X#ki!]#ki!h#ki!r#ki!s#ki!t#ki!{#ki!}#ki#P#ki#R#ki#T#ki#X#ki#Z#ki#^#ki#_#ki#a#ki#c#ki#l#ki#o#ki#s#ki#u#ki#z#ki#}#ki$P#ki%X#ki%o#ki%p#ki%t#ki%u#ki&Z#ki&[#ki&]#ki&^#ki&_#ki&`#ki&a#ki&b#ki&c#ki&d#ki&e#ki&f#ki&g#ki&h#ki&i#ki&j#ki%Z#ki%_#ki~OV)kOn&wa~P'vOz)lOn&wa~Oz)lOn&wa~P%SOn)pO~O%Y)tO~Ot)wO#p'WO#q)vOP#niV#nif#nih#nio#nis#niv#ni!P#ni!Q#ni!T#ni!U#ni!X#ni!]#ni!h#ni!r#ni!s#ni!t#ni!{#ni!}#ni#P#ni#R#ni#T#ni#X#ni#Z#ni#^#ni#_#ni#a#ni#c#ni#l#ni#o#ni#s#ni#u#ni#z#ni#}#ni$P#ni%X#ni%o#ni%p#ni%t#ni%u#ni&Z#ni&[#ni&]#ni&^#ni&_#ni&`#ni&a#ni&b#ni&c#ni&d#ni&e#ni&f#ni&g#ni&h#ni&i#ni&j#ni%Z#ni%_#ni~OV)zOo0cOv0qO{$jO~P'vOo0cOv0qO{&xa~P'vOz*OO{&xa~OV*SOa*TOg*WO%q*UO%uWO~O{$jO&{*YO~Oh'_O~Oh!iO{$jO~O%[*_O~O%[*aO%_*aO~OV$}Oa$}Oo0cOv0qOg&Ua~P'vOz*dOg&Ua~Oo0cOv0qO{*gO!W&Xa~P'vOz*hO!W&Xa~Oo0cOv0qOz*hO{*kO!W&Xa~P'vOo0cOv0qOz*hO!W&Xa~P'vOz*hO{*kO!W&Xa~Om0dOn0dOo0mOp0nOgjikjisjizji!Tji!Uji%{ji!Wji{ji![ji#gji%[ji%_ji!Qji#[jitji!mji%zji~Ol0fO~P!NkOlji~P!NkOV'|Og*pOo0cOv0qO~P'vOn*rO~Og*pOz*tO~Og*uO~OV'|Oo0cOv0qO!W&Si~P'vOz*vO!W&Si~O!W*wO~OV(]Oo0cOv0qO![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~P'vOz*zO!T%dO!U%cO![&Ti~Oz*}O![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~O![+OO~Oa+QOo0cOv0qO![&Ti~P'vOz*zO![&Ti~O![+SO~OV+UOo0cOv0qO{&la![&la!m&la%z&la~P'vOz+VO{&la![&la!m&la%z&la~O!]+YO&n+[O![!nX~O![+^O~O{(kO![+_O~O{(kO![+_O!m+`O~OV&OOopOvqO{%hq!x%hq#g%hq%[%hq%_%hq%z%hq~P'vOz$ri{$ri!x$ri#g$ri%[$ri%_$ri%z$ri~P%SOV&OOopOvqO~P'vOV&OOo0cOv0qO#g%ha%[%ha%_%ha%z%ha~P'vOz+aO#g%ha%[%ha%_%ha%z%ha~Oz$ia#g$ia%[$ia%_$ian$ia~P%SO#g&Pi%[&Pi%_&Pin&Pi~P'vOz+dO#g#Wq%[#Wq%_#Wq~O#[+eOz$va#g$va%[$va%_$vag$va~O%uWO#g&ri%[&ri%_&rig&ri~Oz+gO#g&ri%[&ri%_&rig&ri~OV+iOh$WO%uWO~O%uWO#g&ti%[&ti%_&ti~Oo0cOv0qO#g&pi%[&pi%_&pi{&pi~P'vO{#{Oz#eX!W#eX~Oz+mO!W&uX~O!W+oO~Ot+rO#j)gOP#hqV#hqf#hqh#hqo#hqs#hqv#hq!P#hq!Q#hq!T#hq!U#hq!X#hq!]#hq!h#hq!r#hq!s#hq!t#hq!{#hq!}#hq#P#hq#R#hq#T#hq#X#hq#Z#hq#^#hq#_#hq#a#hq#c#hq#l#hq#o#hq#s#hq#u#hq#z#hq#}#hq$P#hq%X#hq%o#hq%p#hq%t#hq%u#hq&Z#hq&[#hq&]#hq&^#hq&_#hq&`#hq&a#hq&b#hq&c#hq&d#hq&e#hq&f#hq&g#hq&h#hq&i#hq&j#hq%Z#hq%_#hq~On$|az$|a~P%SOV)kOn&wi~P'vOz+yOn&wi~Oz,TO{$jO#[,TO~O#q,VOP#nqV#nqf#nqh#nqo#nqs#nqv#nq!P#nq!Q#nq!T#nq!U#nq!X#nq!]#nq!h#nq!r#nq!s#nq!t#nq!{#nq!}#nq#P#nq#R#nq#T#nq#X#nq#Z#nq#^#nq#_#nq#a#nq#c#nq#l#nq#o#nq#s#nq#u#nq#z#nq#}#nq$P#nq%X#nq%o#nq%p#nq%t#nq%u#nq&Z#nq&[#nq&]#nq&^#nq&_#nq&`#nq&a#nq&b#nq&c#nq&d#nq&e#nq&f#nq&g#nq&h#nq&i#nq&j#nq%Z#nq%_#nq~O#[,WOz%Oa{%Oa~Oo0cOv0qO{&xi~P'vOz,YO{&xi~O{#{O%z,[Og&zXz&zX~O%uWOg&zXz&zX~Oz,`Og&yX~Og,bO~O%Y,eO~O!T%dO!U%cOg&Viz&Vi~OV$}Oa$}Oo0cOv0qOg&Ui~P'vO{,hOz$la!W$la~Oo0cOv0qO{,iOz$la!W$la~P'vOo0cOv0qO{*gO!W&Xi~P'vOz,lO!W&Xi~Oo0cOv0qOz,lO!W&Xi~P'vOz,lO{,oO!W&Xi~Og$hiz$hi!W$hi~P%SOV'|Oo0cOv0qO~P'vOn,qO~OV'|Og,rOo0cOv0qO~P'vOV'|Oo0cOv0qO!W&Sq~P'vOz$gi![$gi#g$gi%[$gi%_$gig$gi{$gi!m$gi%z$gi~P%SOV(]Oo0cOv0qO~P'vOa+QOo0cOv0qO![&Tq~P'vOz,sO![&Tq~O![,tO~OV(]Oo0cOv0qO![%}q#g%}q%[%}q%_%}qg%}q{%}q!m%}q%z%}q~P'vO{,uO~OV+UOo0cOv0qO{&li![&li!m&li%z&li~P'vOz,zO{&li![&li!m&li%z&li~O!]+YO&n+[O![!na~O{(kO![,}O~OV&OOo0cOv0qO#g%hi%[%hi%_%hi%z%hi~P'vOz-OO#g%hi%[%hi%_%hi%z%hi~O%uWO#g&rq%[&rq%_&rqg&rq~Oz-RO#g&rq%[&rq%_&rqg&rq~OV)`Oa)`O%uWO!W&ua~Oz-TO!W&ua~On$|iz$|i~P%SOV)kO~P'vOV)kOn&wq~P'vOt-XOP#myV#myf#myh#myo#mys#myv#my!P#my!Q#my!T#my!U#my!X#my!]#my!h#my!r#my!s#my!t#my!{#my!}#my#P#my#R#my#T#my#X#my#Z#my#^#my#_#my#a#my#c#my#l#my#o#my#s#my#u#my#z#my#}#my$P#my%X#my%o#my%p#my%t#my%u#my&Z#my&[#my&]#my&^#my&_#my&`#my&a#my&b#my&c#my&d#my&e#my&f#my&g#my&h#my&i#my&j#my%Z#my%_#my~O%Z-]O%_-]O~P`O#q-^OP#nyV#nyf#nyh#nyo#nys#nyv#ny!P#ny!Q#ny!T#ny!U#ny!X#ny!]#ny!h#ny!r#ny!s#ny!t#ny!{#ny!}#ny#P#ny#R#ny#T#ny#X#ny#Z#ny#^#ny#_#ny#a#ny#c#ny#l#ny#o#ny#s#ny#u#ny#z#ny#}#ny$P#ny%X#ny%o#ny%p#ny%t#ny%u#ny&Z#ny&[#ny&]#ny&^#ny&_#ny&`#ny&a#ny&b#ny&c#ny&d#ny&e#ny&f#ny&g#ny&h#ny&i#ny&j#ny%Z#ny%_#ny~Oz-aO{$jO#[-aO~Oo0cOv0qO{&xq~P'vOz-dO{&xq~O%z,[Og&zaz&za~O{#{Og&zaz&za~OV*SOa*TO%q*UO%uWOg&ya~Oz-hOg&ya~O$S-lO~OV$}Oa$}Oo0cOv0qO~P'vOo0cOv0qO{-mOz$li!W$li~P'vOo0cOv0qOz$li!W$li~P'vO{-mOz$li!W$li~Oo0cOv0qO{*gO~P'vOo0cOv0qO{*gO!W&Xq~P'vOz-pO!W&Xq~Oo0cOv0qOz-pO!W&Xq~P'vOs-sO!T%dO!U%cOg&Oq!W&Oq![&Oqz&Oq~P!/jOa+QOo0cOv0qO![&Ty~P'vOz$ji![$ji~P%SOa+QOo0cOv0qO~P'vOV+UOo0cOv0qO~P'vOV+UOo0cOv0qO{&lq![&lq!m&lq%z&lq~P'vO{(kO![-xO!m-yO%z-wO~OV&OOo0cOv0qO#g%hq%[%hq%_%hq%z%hq~P'vO%uWO#g&ry%[&ry%_&ryg&ry~OV)`Oa)`O%uWO!W&ui~Ot-}OP#m!RV#m!Rf#m!Rh#m!Ro#m!Rs#m!Rv#m!R!P#m!R!Q#m!R!T#m!R!U#m!R!X#m!R!]#m!R!h#m!R!r#m!R!s#m!R!t#m!R!{#m!R!}#m!R#P#m!R#R#m!R#T#m!R#X#m!R#Z#m!R#^#m!R#_#m!R#a#m!R#c#m!R#l#m!R#o#m!R#s#m!R#u#m!R#z#m!R#}#m!R$P#m!R%X#m!R%o#m!R%p#m!R%t#m!R%u#m!R&Z#m!R&[#m!R&]#m!R&^#m!R&_#m!R&`#m!R&a#m!R&b#m!R&c#m!R&d#m!R&e#m!R&f#m!R&g#m!R&h#m!R&i#m!R&j#m!R%Z#m!R%_#m!R~Oo0cOv0qO{&xy~P'vOV*SOa*TO%q*UO%uWOg&yi~O$S-lO%Z.VO%_.VO~OV.aOh._O!X.^O!].`O!h.YO!s.[O!t.[O%p.XO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O~Oo0cOv0qOz$lq!W$lq~P'vO{.fOz$lq!W$lq~Oo0cOv0qO{*gO!W&Xy~P'vOz.gO!W&Xy~Oo0cOv.kO~P'vOs-sO!T%dO!U%cOg&Oy!W&Oy![&Oyz&Oy~P!/jO{(kO![.nO~O{(kO![.nO!m.oO~OV*SOa*TO%q*UO%uWO~Oh.tO!f.rOz$TX#[$TX%j$TXg$TX~Os$TX{$TX!W$TX![$TX~P$-bO%o.vO%p.vOs$UXz$UX{$UX#[$UX%j$UX!W$UXg$UX![$UX~O!h.xO~Oz.|O#[/OO%j.yOs&|X{&|X!W&|Xg&|X~Oa/RO~P$)zOh.tOs&}Xz&}X{&}X#[&}X%j&}X!W&}Xg&}X![&}X~Os/VO{$jO~Oo0cOv0qOz$ly!W$ly~P'vOo0cOv0qO{*gO!W&X!R~P'vOz/ZO!W&X!R~Og&RXs&RX!T&RX!U&RX!W&RX![&RXz&RX~P!/jOs-sO!T%dO!U%cOg&Qa!W&Qa![&Qaz&Qa~O{(kO![/^O~O!f.rOh$[as$[az$[a{$[a#[$[a%j$[a!W$[ag$[a![$[a~O!h/eO~O%o.vO%p.vOs$Uaz$Ua{$Ua#[$Ua%j$Ua!W$Uag$Ua![$Ua~O%j.yOs$Yaz$Ya{$Ya#[$Ya!W$Yag$Ya![$Ya~Os&|a{&|a!W&|ag&|a~P$)nOz/jOs&|a{&|a!W&|ag&|a~O!W/mO~Og/mO~O{/oO~O![/pO~Oo0cOv0qO{*gO!W&X!Z~P'vO{/sO~O%z/tO~P$-bOz/uO#[/OO%j.yOg'PX~Oz/uOg'PX~Og/wO~O!h/xO~O#[/OOs%Saz%Sa{%Sa%j%Sa!W%Sag%Sa![%Sa~O#[/OO%j.yOs%Waz%Wa{%Wa!W%Wag%Wa~Os&|i{&|i!W&|ig&|i~P$)nOz/zO#[/OO%j.yO!['Oa~Og'Pa~P$)nOz0SOg'Pa~Oa0UO!['Oi~P$)zOz0WO!['Oi~Oz0WO#[/OO%j.yO!['Oi~O#[/OO%j.yOg$biz$bi~O%z0ZO~P$-bO#[/OO%j.yOg%Vaz%Va~Og'Pi~P$)nO{0^O~Oa0UO!['Oq~P$)zOz0`O!['Oq~O#[/OO%j.yOz%Ui![%Ui~Oa0UO~P$)zOa0UO!['Oy~P$)zO#[/OO%j.yOg$ciz$ci~O#[/OO%j.yOz%Uq![%Uq~Oz+aO#g%ha%[%ha%_%ha%z%ha~P%SOV&OOo0cOv0qO~P'vOn0hO~Oo0hO~P'vO{0iO~Ot0jO~P!/jO&]&Z&j&h&i&g&f&d&e&c&b&`&a&_&^&[%u~",
		goto: "!=j'QPPPPPP'RP'Z*s+[+t,_,y-fP.SP'Z.r.r'ZPPP'Z2[PPPPPP2[5PPP5PP7b7k=sPP=v>h>kPP'Z'ZPP>zPP'Z'ZPP'Z'Z'Z'Z'Z?O?w'ZP?zP@QDXGuGyPG|HWH['ZPPPH_Hk'RP'R'RP'RP'RP'RP'RP'R'R'RP'RPP'RPP'RP'RPHqH}IVPI^IdPI^PI^I^PPPI^PKrPK{LVL]KrPI^LfPI^PLmLsPLwM]MzNeLwLwNkNxLwLwLwLw! ^! d! g! l! o! y!!P!!]!!o!!u!#P!#V!#s!#y!$P!$Z!$a!$g!$y!%T!%Z!%a!%k!%q!%w!%}!&T!&Z!&e!&k!&u!&{!'U!'[!'k!'s!'}!(UPPPPPPPPPPP!([!(_!(e!(n!(x!)TPPPPPPPPPPPP!-u!/Z!3^!6oPP!6w!7W!7a!8Y!8P!8c!8i!8l!8o!8r!8z!9jPPPPPPPPPPPPPPPPP!9m!9q!9wP!:]!:a!:m!:v!;S!;j!;m!;p!;v!;|!<S!<VP!<_!<h!=d!=g]eOn#g$j)t,P'}`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r{!cQ#c#p$R$d$p%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g}!dQ#c#p$R$d$p$u%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!P!eQ#c#p$R$d$p$u$v%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!R!fQ#c#p$R$d$p$u$v$w%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!T!gQ#c#p$R$d$p$u$v$w$x%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!V!hQ#c#p$R$d$p$u$v$w$x$y%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!Z!hQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g'}TOTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r&eVOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0r%oXOYZ[dnrxy}!P!Q!U!i!k#[#d#g#y#{#}$Q$h$j$}%S%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#vqQ/[.kR0o0q't`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rh#jhz{$W$Z&l&q)S)X+f+g-RW#rq&].k0qQ$]|Q$a!OQ$n!VQ$o!WW$|!i'm*d,gS&[#s#tQ'S$iQ(s&UQ)U&nU)Y&s)Z+jW)a&w+m-T-{Q*Q']W*R'_,`-h.TQ+l)`S,_*S*TQ-Q+eQ-_,TQ-c,WQ.R-al.W-l.^._.a.z.|/R/j/o/t/y0U0Z0^Q/S.`Q/a.tQ/l/OU0P/u0S0[X0V/z0W0_0`R&Z#r!_!wYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZR%^!vQ!{YQ%x#[Q&d#}Q&g$QR,{+YT.j-s/s!Y!jQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gQ&X#kQ'c$oR*^'dR'l$|Q%V!mR/_.r'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rS#a_#b!P.[-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rT#a_#bT#^^#_R(o%xa(l%x(n(o+`,{-y-z.oT+[(k+]R-z,{Q$PsQ+l)aQ,^*RR-e,_X#}s$O$P&fQ&y$aQ'a$nQ'd$oR)s'SQ)b&wV-S+m-T-{ZgOn$j)t,PXkOn)t,PQ$k!TQ&z$bQ&{$cQ'^$mQ'b$oQ)q'RQ)x'WQ){'XQ)|'YQ*Z'`S*]'c'dQ+s)gQ+u)hQ+v)iQ+z)oS+|)r*[Q,Q)vQ,R)wS,S)y)zQ,d*^Q-V+rQ-W+tQ-Y+{S-Z+},OQ-`,UQ-b,VQ-|-XQ.O-[Q.P-^Q.Q-_Q.p-}Q.q.RQ/W.dR/r/XWkOn)t,PR#mjQ'`$nS)r'S'aR,O)sQ,]*RR-f,^Q*['`Q+})rR-[,OZiOjn)t,PQ'f$pR*`'gT-j,e-ku.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^t.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^Q/S.`X0V/z0W0_0`!P.Z-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`Q.w.YR/f.xg.z.].{/b/i/n/|0O0Q0]0a0bu.b-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^X.u.W.b/a0PR/c.tV0R/u0S0[R/X.dQnOS#on,PR,P)tQ&^#uR(x&^S%m#R#wS(_%m(bT(b%p&`Q%a!yQ%h!}W(P%a%h(U(YQ(U%eR(Y%jQ&i$RR)O&iQ(e%qQ*{(`T+R(e*{Q'n%OR*e'nS'q%R%SY*i'q*j,m-q.hU*j'r's'tU,m*k*l*mS-q,n,oR.h-rQ#Y]R%t#YQ#_^R%y#_Q(h%vS+W(h+XR+X(iQ+](kR,|+]Q#b_R%{#bQ#ebQ%}#cW&Q#e%}({+bQ({&cR+b0gQ$OsS&e$O&fR&f$PQ&v$_R)_&vQ&V#jR(t&VQ&m$VS)T&m+hR+h)UQ$Z{R&p$ZQ&t$]R)[&tQ+n)bR-U+nQ#hfR&S#hQ)f&zR+q)fQ&}$dS)m&})nR)n'OQ'V$kR)u'VQ'[$lS*P'[,ZR,Z*QQ,a*VR-i,aWjOn)t,PR#ljQ-k,eR.U-kd.{.]/b/i/n/|0O0Q0]0a0bR/h.{U.s.W/a0PR/`.sQ/{/nS0X/{0YR0Y/|S/v/b/cR0T/vQ.}.]R/k.}R!ZPXmOn)t,PWlOn)t,PR'T$jYfOn$j)t,PR&R#g[sOn#g$j)t,PR&d#}&dQOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0rQ!nTQ#caQ#poU$Rt%c(SS$d!R$gQ$p!XQ$u!cQ$v!dQ$w!eQ$x!fQ$y!gQ$z!hQ%e!zQ%j#OQ%p#SQ%q#TQ&`#xQ'O$eQ'g$qQ(q&OU(|&h(}+cW)j&|)l+x+yQ*o'|Q*x(]Q+w)kQ,v+QR0g0lQ!yYQ!}ZQ$b!PQ$c!QQ%R!kQ't%S^'{%`%g(O(W*q*t*v^*f'p*h,k,l-p.g/ZQ*l'rQ*m'sQ+t)gQ,j*gQ,n*kQ-n,hQ-o,iQ-r,oQ.e-mR/Y.f[bOn#g$j)t,P!^!vYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZQ#R[Q#fdS#wrxQ$UyW$_}$Q'P)pS$l!U$hW${!i'm*d,gS%v#[+Y`&P#d%|(p(r(z+a-O0kQ&a#yQ&b#{Q&c#}Q'j$}Q'z%^W([%l(^*y*}Q(`%nQ(i%wQ(v&ZS(y&_0iQ)P&jQ)Q&kU)]&u)^+kQ)d&xQ)y'WY)}'Z*O,X,Y-dQ*b'lS*n'w0jW+P(d*z,s,wW+T(g+V,y,zQ+p)eQ,U)zQ,c*YQ,x+UQ-P+dQ-e,]Q-v,uQ.S-fR/q/VhUOn#d#g$j%|&_'w(p(r)t,P%U!uYZ[drxy}!P!Q!U!i!k#[#y#{#}$Q$h$}%S%^%`%g%l%n%w&Z&j&k&u&x'P'W'Z'l'm'p'r's(O(W(^(d(g(z)^)e)g)p)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#qpW%W!o!s0d0nQ%X!pQ%Y!qQ%[!tQ%f0cS'v%Z0hQ'x0eQ'y0fQ,p*rQ-u,qS.i-s/sR0p0rU#uq.k0qR(w&][cOn#g$j)t,PZ!xY#[#}$Q+YQ#W[Q#zrR$TxQ%b!yQ%i!}Q%o#RQ'j${Q(V%eQ(Z%jQ(c%pQ(f%qQ*|(`Q,f*bQ-t,pQ.m-uR/].lQ$StQ(R%cR*s(SQ.l-sR/}/sR#QZR#V[R%Q!iQ%O!iV*c'm*d,g!Z!lQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gR%T!kT#]^#_Q%x#[R,{+YQ(m%xS+_(n(oQ,}+`Q-x,{S.n-y-zR/^.oT+Z(k+]Q$`}Q&g$QQ)o'PR+{)pQ$XzQ)W&qR+i)XQ$XzQ&o$WQ)W&qR+i)XQ#khW$Vz$W&q)XQ$[{Q&r$ZZ)R&l)S+f+g-RR$^|R)c&wXlOn)t,PQ$f!RR'Q$gQ$m!UR'R$hR*X'_Q*V'_V-g,`-h.TQ.d-lQ/P.^R/Q._U.]-l.^._Q/U.aQ/b.tQ/g.zU/i.|/j/yQ/n/RQ/|/oQ0O/tU0Q/u0S0[Q0]0UQ0a0ZR0b0^R/T.`R/d.t",
		nodeNames: "⚠ print Escape { Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ) ( ParenthesizedExpression BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from TupleExpression ComprehensionExpression async for LambdaExpression ] [ ArrayExpression ArrayComprehensionExpression } { DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatSelfDoc FormatConversion FormatSpec FormatReplacement FormatSelfDoc ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert TypeDefinition type TypeParamList TypeParam StatementGroup ; IfStatement Body elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At MatchStatement match MatchBody MatchClause case CapturePattern LiteralPattern ArithOp ArithOp AsPattern OrPattern LogicOp AttributePattern SequencePattern MappingPattern StarPattern ClassPattern PatternArgList KeywordPattern KeywordPattern Guard",
		maxTerm: 277,
		context: pT,
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
		propSources: [gT],
		skippedNodes: [0, 4],
		repeatNodeCount: 34,
		tokenData: "!2|~R!`OX%TXY%oY[%T[]%o]p%Tpq%oqr'ars)Yst*xtu%Tuv,dvw-hwx.Uxy/tyz0[z{0r{|2S|}2p}!O3W!O!P4_!P!Q:Z!Q!R;k!R![>_![!]Do!]!^Es!^!_FZ!_!`Gk!`!aHX!a!b%T!b!cIf!c!dJU!d!eK^!e!hJU!h!i!#f!i!tJU!t!u!,|!u!wJU!w!x!.t!x!}JU!}#O!0S#O#P&o#P#Q!0j#Q#R!1Q#R#SJU#S#T%T#T#UJU#U#VK^#V#YJU#Y#Z!#f#Z#fJU#f#g!,|#g#iJU#i#j!.t#j#oJU#o#p!1n#p#q!1s#q#r!2a#r#s!2f#s$g%T$g;'SJU;'S;=`KW<%lOJU`%YT&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T`%lP;=`<%l%To%v]&n`%c_OX%TXY%oY[%T[]%o]p%Tpq%oq#O%T#O#P&o#P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To&tX&n`OY%TYZ%oZ]%T]^%o^#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc'f[&n`O!_%T!_!`([!`#T%T#T#U(r#U#f%T#f#g(r#g#h(r#h#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(cTmR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(yT!mR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk)aV&n`&[ZOr%Trs)vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk){V&n`Or%Trs*bs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk*iT&n`&^ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To+PZS_&n`OY*xYZ%TZ]*x]^%T^#o*x#o#p+r#p#q*x#q#r+r#r;'S*x;'S;=`,^<%lO*x_+wTS_OY+rZ]+r^;'S+r;'S;=`,W<%lO+r_,ZP;=`<%l+ro,aP;=`<%l*xj,kV%rQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-XT!xY&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-oV%lQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.]V&n`&ZZOw%Twx.rx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.wV&n`Ow%Twx/^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/eT&n`&]ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/{ThZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc0cTgR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk0yXVZ&n`Oz%Tz{1f{!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk1mVaR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk2ZV%oZ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc2wTzR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To3_W%pZ&n`O!_%T!_!`-Q!`!a3w!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Td4OT&{S&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk4fX!fQ&n`O!O%T!O!P5R!P!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5WV&n`O!O%T!O!P5m!P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5tT!rZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti6[a!hX&n`O!Q%T!Q![6T![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S6T#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti7fZ&n`O{%T{|8X|}%T}!O8X!O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8^V&n`O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8z]!hX&n`O!Q%T!Q![8s![!l%T!l!m9s!m#R%T#R#S8s#S#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti9zT!hX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk:bX%qR&n`O!P%T!P!Q:}!Q!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj;UV%sQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti;ro!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!d%T!d!e?q!e!g%T!g!h7a!h!l%T!l!m9s!m!q%T!q!rA]!r!z%T!z!{Bq!{#R%T#R#S>_#S#U%T#U#V?q#V#X%T#X#Y7a#Y#^%T#^#_9s#_#c%T#c#dA]#d#l%T#l#mBq#m#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti=xV&n`O!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti>fc!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S>_#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti?vY&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti@mY!hX&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiAbX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBUX!hX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBv]&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiCv]!hX&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToDvV{_&n`O!_%T!_!`E]!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TcEdT%{R&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkEzT#gZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkFbXmR&n`O!^%T!^!_F}!_!`([!`!a([!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjGUV%mQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkGrV%zZ&n`O!_%T!_!`([!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkH`WmR&n`O!_%T!_!`([!`!aHx!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjIPV%nQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkIoV_Q#}P&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToJ_]&n`&YS%uZO!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoKZP;=`<%lJUoKge&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!tJU!t!uLx!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#gLx#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoMRa&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUkN_V&n`&`ZOr%TrsNts#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkNyV&n`Or%Trs! `s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! gT&n`&bZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! }V&n`&_ZOw%Twx!!dx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!!iV&n`Ow%Twx!#Ox#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!#VT&n`&aZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!#oe&n`&YS%uZOr%Trs!%Qsw%Twx!&px!Q%T!Q![JU![!c%T!c!tJU!t!u!(`!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#g!(`#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!%XV&n`&dZOr%Trs!%ns#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!%sV&n`Or%Trs!&Ys#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&aT&n`&fZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&wV&n`&cZOw%Twx!'^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!'cV&n`Ow%Twx!'xx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!(PT&n`&eZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!(ia&n`&YS%uZOr%Trs!)nsw%Twx!+^x!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!)uV&n`&hZOr%Trs!*[s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*aV&n`Or%Trs!*vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*}T&n`&jZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!+eV&n`&gZOw%Twx!+zx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,PV&n`Ow%Twx!,fx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,mT&n`&iZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!-Vi&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!dJU!d!eLx!e!hJU!h!i!(`!i!}JU!}#R%T#R#SJU#S#T%T#T#UJU#U#VLx#V#YJU#Y#Z!(`#Z#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUo!.}a&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!0ZT!XZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc!0qT!WR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj!1XV%kQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!1sO!]~k!1zV%jR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!2fO![~i!2mT%tX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T",
		tokenizers: [
			mT,
			iT,
			rT,
			hT,
			0,
			1,
			2,
			3,
			4
		],
		topRules: { Script: [0, 5] },
		specialized: [{
			term: 221,
			get: (e) => _T[e] || -1
		}],
		tokenPrec: 7668
	});
})), bT = /* @__PURE__ */ n({
	globalCompletion: () => PT,
	localCompletionSource: () => CT,
	python: () => ET,
	pythonLanguage: () => FT
});
function xT(e) {
	return (t, n, r) => {
		if (r) return !1;
		let i = t.node.getChild("VariableName");
		return i && n(i, e), !0;
	};
}
function ST(e, t) {
	let n = DT.get(t);
	if (n) return n;
	let r = [], i = !0;
	function a(t, n) {
		let i = e.sliceString(t.from, t.to);
		r.push({
			label: i,
			type: n
		});
	}
	return t.cursor(X_.IncludeAnonymous).iterate((t) => {
		if (t.name) {
			let e = kT[t.name];
			if (e && e(t, a, i) || !i && OT.has(t.name)) return !1;
			i = !1;
		} else if (t.to - t.from > 8192) {
			for (let n of ST(e, t.node)) r.push(n);
			return !1;
		}
	}), DT.set(t, r), r;
}
function CT(e) {
	let t = qv(e.state).resolveInner(e.pos, -1);
	if (jT.indexOf(t.name) > -1) return null;
	let n = t.name == "VariableName" || t.to - t.from < 20 && AT.test(e.state.sliceDoc(t.from, t.to));
	if (!n && !e.explicit) return null;
	let r = [];
	for (let n = t; n; n = n.parent) OT.has(n.name) && (r = r.concat(ST(e.state.doc, n)));
	return {
		options: r,
		from: n ? t.from : e.pos,
		validFor: AT
	};
}
function wT(e) {
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
function TT(e, t) {
	let n = e.baseIndentFor(t), r = e.lineAt(e.pos, -1), i = r.from + r.text.length;
	return /^\s*($|#)/.test(r.text) && e.node.to < i + 100 && !/\S/.test(e.state.sliceDoc(i, e.node.to)) && e.lineIndent(e.pos, -1) <= n || /^\s*(else:|elif |except |finally:|case\s+[^=:]+:)/.test(e.textAfter) && e.lineIndent(e.pos, -1) > n ? null : n + e.unit;
}
function ET() {
	return new hb(FT, [FT.data.of({ autocomplete: CT }), FT.data.of({ autocomplete: PT })]);
}
var DT, OT, kT, AT, jT, MT, NT, PT, FT, IT = t((() => {
	yT(), _x(), dv(), rC(), DT = /*@__PURE__*/ new sv(), OT = /*@__PURE__*/ new Set([
		"Script",
		"Body",
		"FunctionDefinition",
		"ClassDefinition",
		"LambdaExpression",
		"ForStatement",
		"MatchClause"
	]), kT = {
		FunctionDefinition: /*@__PURE__*/ xT("function"),
		ClassDefinition: /*@__PURE__*/ xT("class"),
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
			for (let n = null, r = e.node.firstChild; r; r = r.nextSibling) r.name == "VariableName" && (!n || !/\*|AssignOp/.test(n.name)) && t(r, "variable"), n = r;
		},
		CapturePattern: /*@__PURE__*/ xT("variable"),
		AsPattern: /*@__PURE__*/ xT("variable"),
		__proto__: null
	}, AT = /^[\w\xa1-\uffff][\w\d\xa1-\uffff]*$/, jT = [
		"String",
		"FormatString",
		"Comment",
		"PropertyName"
	], MT = /*@__PURE__*/ [
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
	}))), NT = [
		/*@__PURE__*/ LS("def ${name}(${params}):\n	${}", {
			label: "def",
			detail: "function",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("for ${name} in ${collection}:\n	${}", {
			label: "for",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("while ${}:\n	${}", {
			label: "while",
			detail: "loop",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("try:\n	${}\nexcept ${error}:\n	${}", {
			label: "try",
			detail: "/ except block",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("if ${}:\n	\n", {
			label: "if",
			detail: "block",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("if ${}:\n	${}\nelse:\n	${}", {
			label: "if",
			detail: "/ else block",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("class ${name}:\n	def __init__(self, ${params}):\n			${}", {
			label: "class",
			detail: "definition",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("import ${module}", {
			label: "import",
			detail: "statement",
			type: "keyword"
		}),
		/*@__PURE__*/ LS("from ${module} import ${names}", {
			label: "from",
			detail: "import",
			type: "keyword"
		})
	], PT = /*@__PURE__*/ NS(jT, /*@__PURE__*/ MS(/*@__PURE__*/ MT.concat(NT))), FT = /*@__PURE__*/ ob.define({
		name: "python",
		parser: /*@__PURE__*/ vT.configure({ props: [/*@__PURE__*/ bb.add({
			Body: (e) => TT(e, /^\s*(#|$)/.test(e.textAfter) && wT(e) || e.node) ?? e.continue(),
			MatchBody: (e) => TT(e, wT(e) || e.node) ?? e.continue(),
			IfStatement: (e) => /^\s*(else:|elif )/.test(e.textAfter) ? e.baseIndent : e.continue(),
			"ForStatement WhileStatement": (e) => /^\s*else:/.test(e.textAfter) ? e.baseIndent : e.continue(),
			TryStatement: (e) => /^\s*(except[ :]|finally:|else:)/.test(e.textAfter) ? e.baseIndent : e.continue(),
			MatchStatement: (e) => /^\s*case /.test(e.textAfter) ? e.baseIndent + e.unit : e.continue(),
			"TupleExpression ComprehensionExpression ParamList ArgList ParenthesizedExpression": /*@__PURE__*/ uy({ closing: ")" }),
			"DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression": /*@__PURE__*/ uy({ closing: "}" }),
			"ArrayExpression ArrayComprehensionExpression": /*@__PURE__*/ uy({ closing: "]" }),
			MemberExpression: (e) => e.baseIndent + e.unit,
			"String FormatString": () => null,
			Script: (e) => {
				let t = wT(e);
				return (t && TT(e, t)) ?? e.continue();
			}
		}), /*@__PURE__*/ Tb.add({
			"ArrayExpression DictionaryExpression SetExpression TupleExpression": my,
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
})), LT = /* @__PURE__ */ V("<button> </button>"), RT = /* @__PURE__ */ V("<div class=\"syms svelte-15ml29j\"></div>"), zT = /* @__PURE__ */ V("<div class=\"cerr mono svelte-15ml29j\"> </div> <div class=\"chint svelte-15ml29j\">The source API may be disabled or token-gated on this server (enable_source_api).</div>", 1), BT = /* @__PURE__ */ V("<div class=\"cload mono svelte-15ml29j\">loading source…</div>"), VT = /* @__PURE__ */ V("<div class=\"editor svelte-15ml29j\"></div>"), HT = /* @__PURE__ */ V("<div class=\"code svelte-15ml29j\"><div class=\"chead svelte-15ml29j\"><span class=\"mark mono svelte-15ml29j\">&lt;/&gt; Code</span> <span class=\"path mono svelte-15ml29j\"> </span> <span class=\"spacer svelte-15ml29j\"></span> <span class=\"rotag mono svelte-15ml29j\">read-only</span></div> <!> <!></div>");
function UT(e, t) {
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
	let s = /* @__PURE__ */ k(() => z(n) ? o(z(n).content) : []), c = /* @__PURE__ */ j(null);
	Tn(() => {
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
	}), Tn(() => {
		let e = z(i), r = z(n);
		if (!e || !r) return;
		let o = !1;
		return (async () => {
			let [n, i, s, c] = await Promise.all([
				Promise.resolve().then(() => (A_(), Ql)),
				Promise.resolve().then(() => (Nl(), qs)),
				Promise.resolve().then(() => (_x(), Wv)),
				Promise.resolve().then(() => (Uv(), fv))
			]);
			if (o) return;
			let { EditorView: u, lineNumbers: d, highlightActiveLine: f } = n, { EditorState: p } = i, { syntaxHighlighting: m, HighlightStyle: h } = s, { tags: g } = c, _ = r.language === "javascript" ? (await Promise.resolve().then(() => (IC(), iC))).javascript() : (await Promise.resolve().then(() => (IT(), bT))).python();
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
	var u = HT(), d = N(u), f = F(N(d), 2), p = N(f, !0);
	O(f), Le(4), O(d);
	var m = F(d, 2), h = (e) => {
		var t = RT();
		Ur(t, 21, () => z(s), (e) => e.label + e.line, (e, t) => {
			var n = LT();
			let r;
			var i = N(n, !0);
			O(n), I(() => {
				r = ai(n, 1, "sym mono svelte-15ml29j", null, r, { on: z(c) === z(t).line }), U(i, z(t).label);
			}), B("click", n, () => l(z(t).line)), H(e, n);
		}), O(t), H(e, t);
	};
	W(m, (e) => {
		z(s).length && e(h);
	});
	var g = F(m, 2), _ = (e) => {
		var t = zT(), n = P(t), i = N(n, !0);
		O(n), Le(2), I(() => U(i, z(r))), H(e, t);
	}, v = (e) => {
		H(e, BT());
	}, y = (e) => {
		var t = VT();
		Ei(t, (e) => M(i, e), () => z(i)), H(e, t);
	};
	W(g, (e) => {
		z(r) ? e(_) : z(n) ? e(y, -1) : e(v, 1);
	}), O(u), I(() => U(p, t.path)), H(e, u), Ke();
}
Tr(["click"]);
//#endregion
//#region src/Machinable.svelte
var WT = /* @__PURE__ */ V("<button class=\"back svelte-eqn6l9\" title=\"back to runs\">‹</button>"), GT = /* @__PURE__ */ V("<span class=\"target mono svelte-eqn6l9\"> </span>"), KT = /* @__PURE__ */ V("<span class=\"server mono svelte-eqn6l9\"> </span> <!>", 1), qT = /* @__PURE__ */ V("<span class=\"server mono svelte-eqn6l9\">not connected</span>"), JT = /* @__PURE__ */ V("<span class=\"ro mono svelte-eqn6l9\" title=\"Read-only — server widgets are not loaded\">read-only</span>"), YT = /* @__PURE__ */ V("<span class=\"needs mono svelte-eqn6l9\">NEEDS TRUST</span>"), XT = /* @__PURE__ */ V("<span class=\"ro mono svelte-eqn6l9\"> </span>"), ZT = /* @__PURE__ */ V("<button> </button>"), QT = /* @__PURE__ */ V("<!> <div class=\"hrow tabs svelte-eqn6l9\"></div>", 1), $T = /* @__PURE__ */ V("<div class=\"trust svelte-eqn6l9\"><div class=\"trow svelte-eqn6l9\"><span class=\"bang svelte-eqn6l9\">!</span> <span class=\"tq svelte-eqn6l9\">Trust this server?</span></div> <p class=\"tp svelte-eqn6l9\">Its widgets run <strong class=\"svelte-eqn6l9\">as code in your session</strong>. Only trust servers you\n							control. Read-only inspection stays available either way.</p> <div class=\"tbtns svelte-eqn6l9\"><button class=\"go fill svelte-eqn6l9\">Trust &amp; connect</button> <button class=\"go svelte-eqn6l9\">Read-only</button></div></div>"), eE = /* @__PURE__ */ V("<button class=\"go fill svelte-eqn6l9\"> </button>"), tE = /* @__PURE__ */ V("<div class=\"err mono svelte-eqn6l9\"> </div> <button class=\"retry mono svelte-eqn6l9\">retry · check URL ▸</button>", 1), nE = /* @__PURE__ */ V("<div class=\"connect svelte-eqn6l9\"><input class=\"cinput mono svelte-eqn6l9\" placeholder=\"server url, e.g. http://127.0.0.1:8000\" aria-label=\"server url\"/> <input class=\"cinput mono svelte-eqn6l9\" type=\"password\" placeholder=\"token · optional\" aria-label=\"token\"/> <!> <!></div>"), rE = /* @__PURE__ */ V("<span class=\"mpkind mono svelte-eqn6l9\"> </span>"), iE = /* @__PURE__ */ V("<span class=\"mpdoc svelte-eqn6l9\"> </span>"), aE = /* @__PURE__ */ V("<button class=\"mpick svelte-eqn6l9\"><span class=\"mpname mono svelte-eqn6l9\"> </span> <!> <!></button>"), oE = /* @__PURE__ */ V("<div class=\"mpempty mono svelte-eqn6l9\">no modules match</div>"), sE = /* @__PURE__ */ V("<input class=\"mfilter mono svelte-eqn6l9\" placeholder=\"find an interface…\" aria-label=\"find an interface\"/> <div class=\"mlist svelte-eqn6l9\"></div>", 1), cE = /* @__PURE__ */ V("<div class=\"lockbar svelte-eqn6l9\"><span class=\"lockmsg mono svelte-eqn6l9\">🔒 cached · read-only</span> <button class=\"fork mono svelte-eqn6l9\">Fork as new draft ▸</button></div>"), lE = /* @__PURE__ */ V("<div class=\"resulthint mono svelte-eqn6l9\"> </div>"), uE = /* @__PURE__ */ V("<div class=\"resulthint mono svelte-eqn6l9\">no run yet</div>"), dE = /* @__PURE__ */ V("<div class=\"panel svelte-eqn6l9\"><span class=\"nomod mono svelte-eqn6l9\">no source declared for this module</span></div>"), fE = /* @__PURE__ */ V("<div class=\"panel svelte-eqn6l9\"><span class=\"nomod mono svelte-eqn6l9\">resolving source…</span></div>"), pE = /* @__PURE__ */ V("<!> <div><!> <!></div> <div><!> <!></div> <div><!> <!></div> <div><!></div> <div><!></div> <!> <!>", 1), mE = /* @__PURE__ */ V("<div class=\"mach svelte-eqn6l9\"><div class=\"head svelte-eqn6l9\"><div class=\"hrow svelte-eqn6l9\"><!> <span></span> <!> <span class=\"spacer svelte-eqn6l9\"></span> <!> <!></div> <!></div> <div class=\"body svelte-eqn6l9\"><!></div></div>");
function hE(e, t) {
	Ge(t, !0);
	let n = Di(t, "defaultUrl", 3, "http://127.0.0.1:8000"), r = Di(t, "autoConnect", 3, !1), i = Di(t, "initialView", 3, null), a = Di(t, "initialTarget", 3, ""), o = Di(t, "initialVersion", 19, () => []), s = /* @__PURE__ */ j($t(n())), c = /* @__PURE__ */ j(""), l = /* @__PURE__ */ j(!1), u = /* @__PURE__ */ j(!1), d = /* @__PURE__ */ j(!1), f = /* @__PURE__ */ j($t([])), p = /* @__PURE__ */ j($t([])), m = /* @__PURE__ */ j(""), h = /* @__PURE__ */ j(!1), g = /* @__PURE__ */ j(!1), _ = /* @__PURE__ */ j("");
	async function v(e) {
		M(g, !0), M(_, ""), t.onError?.(null);
		try {
			let n = await t.adapter.connect(z(s), z(c) || void 0, e);
			if (M(d, !!n.needsTrust), n.needsTrust) return;
			M(l, n.connected, !0), M(u, !!n.readOnly), M(f, n.modules ?? [], !0), z(l) ? (console.info("[machinable] connected", z(s), `${z(f).length} module(s)`, z(u) ? "(read-only)" : ""), M(p, z(f).map((e) => ({ module: e })), !0), t.adapter.listModules?.().then((e) => {
				e?.length && M(p, e, !0);
			}), M(h, !1), t.adapter.listSource?.().then(() => M(h, !0)).catch(() => {}), t.onConnect?.(z(s), z(f), z(u))) : (M(_, n.message ?? "could not connect (no detail)", !0), console.warn("[machinable] connect failed —", z(s), z(_)), t.onError?.(`${z(s)}: ${z(_)}`));
		} catch (e) {
			M(_, e instanceof Error ? e.message : String(e), !0), console.error("[machinable] connect threw —", z(s), e), t.onError?.(`${z(s)}: ${z(_)}`);
		} finally {
			M(g, !1);
		}
	}
	async function y() {
		await t.adapter.trust(z(s)), M(d, !1), await v();
	}
	let b = !1;
	Tn(() => {
		!r() || b || (b = !0, v().then(() => {
			z(l) && (i() === "item" && a() ? (xe(a(), o()), M(S, "item")) : M(S, "list"));
		}));
	});
	let x = /* @__PURE__ */ k(() => z(s).replace(/^https?:\/\//, "")), S = /* @__PURE__ */ j("list"), C = /* @__PURE__ */ j("config");
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
		M(C, e, !0), e === "code" && !z(Oe) && je();
	}
	let T = /* @__PURE__ */ j(""), re = /* @__PURE__ */ j($t([])), ie = /* @__PURE__ */ j($t([])), ae = /* @__PURE__ */ j($t({})), oe = /* @__PURE__ */ j(""), se = /* @__PURE__ */ j(""), ce = /* @__PURE__ */ j(!0), le = /* @__PURE__ */ j($t([])), ue = /* @__PURE__ */ j($t({
		context: [],
		chain: []
	})), de = /* @__PURE__ */ j(null), fe = /* @__PURE__ */ j("draft"), pe = /* @__PURE__ */ j(null), me = /* @__PURE__ */ j(!1), he = /* @__PURE__ */ j(!1), ge = /* @__PURE__ */ j(null), _e = /* @__PURE__ */ j(null), ve = /* @__PURE__ */ j(!1), ye = /* @__PURE__ */ j(null), be = null;
	function xe(e, t = []) {
		M(T, e, !0), M(ie, t, !0), M(re, t, !0), M(fe, "draft"), M(pe, null), M(me, !1), M(he, !1), M(ge, null), M(_e, null), M(ve, !1), be = null, M(C, "config"), M(Oe, null), M(ke, void 0), M(Ae, !1);
	}
	function Se(e, n) {
		M(fe, e, !0), n && M(pe, n, !0), e === "running" ? M(me, !0) : M(ge, null), t.onStatus?.(e), be === "running" && e === "cached" && (t.onCached?.(z(T), z(ae)), M(C, "result")), e === "cached" && be === null && t.onCached?.(z(T), z(ae)), be = e;
	}
	let Ce = /* @__PURE__ */ k(() => z(fe) === "cached" && !z(me)), we = /* @__PURE__ */ k(() => z(fe) === "cached" && !z(he)), Te = /* @__PURE__ */ k(() => z(fe) === "running" || z(we)), Ee = /* @__PURE__ */ k(() => !z(l) || !z(T) || z(S) !== "item" ? null : z(ve) ? "running-looped" : z(Ce) ? "cached-reuse" : z(fe) === "interrupted" ? "interrupted" : z(fe)), De = /* @__PURE__ */ k(() => z(ue).chain.find((e) => e.id === z(ue).executionRef)?.title ?? "default execution"), Oe = /* @__PURE__ */ j(null), ke = /* @__PURE__ */ j(void 0), Ae = /* @__PURE__ */ j(!1);
	async function je() {
		M(Ae, !1);
		try {
			let e = await t.adapter.introspect(z(T));
			M(Oe, e.sourceRef?.path ?? null, !0), M(Ae, !z(Oe));
		} catch {
			M(Ae, !0);
		}
	}
	function Me(e) {
		M(Oe, e.path, !0), M(ke, e.line, !0), M(Ae, !1), M(C, "code");
	}
	function Ne(e) {
		M(ue, e, !0);
	}
	function E(e) {
		M(de, e, !0);
	}
	function Pe(e) {
		M(ce, e.ok, !0), M(le, e.ok ? [] : e.issues, !0), e.ok ? (M(ae, e.config, !0), M(se, e.identity ?? "", !0), M(oe, e.cli, !0)) : M(oe, "");
	}
	function D(e) {
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
		z(ge) && t.adapter.interrupt(z(ge).executionRef);
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
	], Ve = /* @__PURE__ */ k(() => Be.filter((e) => e.id !== "code" || !!t.adapter.readSource && z(h)));
	var He = mE(), Ue = N(He), We = N(Ue), qe = N(We), Je = (e) => {
		var t = WT();
		B("click", t, te), H(e, t);
	};
	W(qe, (e) => {
		z(l) && z(S) === "item" && e(Je);
	});
	var Ye = F(qe, 2);
	let Xe;
	var Ze = F(Ye, 2), Qe = (e) => {
		var t = KT(), n = P(t), r = N(n, !0);
		O(n);
		var i = F(n, 2), a = (e) => {
			var t = GT(), n = N(t, !0);
			O(t), I(() => U(n, z(T))), H(e, t);
		};
		W(i, (e) => {
			z(S) === "item" && z(T) && e(a);
		}), I(() => {
			vi(n, "title", z(s)), U(r, z(x));
		}), H(e, t);
	}, $e = (e) => {
		H(e, qT());
	};
	W(Ze, (e) => {
		z(l) ? e(Qe) : e($e, -1);
	});
	var et = F(Ze, 4), tt = (e) => {
		H(e, JT());
	};
	W(et, (e) => {
		z(u) && z(l) && e(tt);
	});
	var nt = F(et, 2), rt = (e) => {
		H(e, YT());
	}, it = (e) => {
		var t = XT(), n = N(t);
		O(t), I(() => U(n, `${z(ye) ?? ""} run${z(ye) === 1 ? "" : "s"}`)), H(e, t);
	};
	W(nt, (e) => {
		z(d) && !z(l) ? e(rt) : z(l) && z(S) === "list" && z(ye) !== null && e(it, 1);
	}), O(We);
	var at = F(We, 2), ot = (e) => {
		var n = QT(), r = P(n);
		os(r, {
			get adapter() {
				return t.adapter;
			},
			get module() {
				return z(T);
			},
			get version() {
				return z(re);
			},
			get badge() {
				return z(Ee);
			},
			onResolved: Pe,
			children: (e, n) => {
				{
					let n = /* @__PURE__ */ k(() => !z(ce));
					fo(e, {
						get adapter() {
							return t.adapter;
						},
						get module() {
							return z(T);
						},
						get version() {
							return z(re);
						},
						get context() {
							return z(ue).context;
						},
						get execution() {
							return z(ue).execution;
						},
						get executionRef() {
							return z(ue).executionRef;
						},
						compact: !0,
						get disabled() {
							return z(n);
						},
						launchLabel: "Launch",
						onStatus: Se,
						onRun: Fe
					});
				}
			},
			$$slots: { default: !0 }
		});
		var i = F(r, 2);
		Ur(i, 21, () => z(Ve), (e) => e.id, (e, t) => {
			var n = ZT();
			let r;
			var i = N(n, !0);
			O(n), I(() => {
				r = ai(n, 1, "tab mono-if-code svelte-eqn6l9", null, r, { on: z(C) === z(t).id }), U(i, z(t).label);
			}), B("click", n, () => ne(z(t).id)), H(e, n);
		}), O(i), H(e, n);
	};
	W(at, (e) => {
		z(l) && z(S) === "item" && z(T) && e(ot);
	}), O(Ue);
	var st = F(Ue, 2), ct = N(st), lt = (e) => {
		var t = nE(), n = N(t);
		gi(n);
		var r = F(n, 2);
		gi(r);
		var i = F(r, 2), a = (e) => {
			var t = $T(), n = F(N(t), 4), r = N(n), i = F(r, 2);
			O(n), O(t), I(() => {
				r.disabled = z(g), i.disabled = z(g);
			}), B("click", r, y), B("click", i, () => v({ readOnly: !0 })), H(e, t);
		}, o = (e) => {
			var t = eE(), n = N(t, !0);
			O(t), I(() => {
				t.disabled = z(g), U(n, z(g) ? "connecting…" : "Connect");
			}), B("click", t, () => v()), H(e, t);
		};
		W(i, (e) => {
			z(d) ? e(a) : e(o, -1);
		});
		var l = F(i, 2), u = (e) => {
			var t = tE(), n = P(t), r = N(n, !0);
			O(n);
			var i = F(n, 2);
			I(() => U(r, z(_))), B("click", i, () => v()), H(e, t);
		};
		W(l, (e) => {
			z(_) && e(u);
		}), O(t), I(() => {
			n.disabled = z(g), r.disabled = z(g);
		}), Si(n, () => z(s), (e) => M(s, e)), Si(r, () => z(c), (e) => M(c, e)), H(e, t);
	}, ut = (e) => {
		Zo(e, {
			get adapter() {
				return t.adapter;
			},
			onNew: w,
			onOpen: ee,
			onTotal: Re
		});
	}, dt = (e) => {
		var n = Mr(), r = P(n), i = (e) => {
			var t = sE(), n = P(t);
			gi(n), hn(n, !0);
			var r = F(n, 2);
			Ur(r, 21, () => z(p).filter((e) => !z(m) || e.module.toLowerCase().includes(z(m).toLowerCase())), (e) => e.module, (e, t) => {
				var n = aE(), r = N(n), i = N(r, !0);
				O(r);
				var a = F(r, 2), o = (e) => {
					var n = rE(), r = N(n, !0);
					O(n), I(() => U(r, z(t).kind)), H(e, n);
				};
				W(a, (e) => {
					z(t).kind && z(t).kind !== "Interface" && e(o);
				});
				var s = F(a, 2), c = (e) => {
					var n = iE(), r = N(n, !0);
					O(n), I((e) => U(r, e), [() => z(t).doc.split("\n")[0]]), H(e, n);
				};
				W(s, (e) => {
					z(t).doc && e(c);
				}), O(n), I(() => U(i, z(t).module)), B("click", n, () => xe(z(t).module)), H(e, n);
			}, (e) => {
				H(e, oE());
			}), O(r), Si(n, () => z(m), (e) => M(m, e)), H(e, t);
		}, a = (e) => {
			var n = pE(), r = P(n), i = (e) => {
				gs(e, {
					get executionLabel() {
						return z(De);
					},
					get identity() {
						return z(se);
					},
					get startedAt() {
						return z(ge).startedAt;
					},
					onInterrupt: ze
				});
			};
			W(r, (e) => {
				z(fe) === "running" && z(ge) && e(i);
			});
			var a = F(r, 2);
			let o;
			var s = N(a), c = (e) => {
				var t = cE(), n = F(N(t), 2);
				O(t), B("click", n, () => M(he, !0)), H(e, t);
			};
			W(s, (e) => {
				z(we) && e(c);
			}), Ua(F(s, 2), {
				get adapter() {
					return t.adapter;
				},
				get module() {
					return z(T);
				},
				get version() {
					return z(ie);
				},
				get issues() {
					return z(le);
				},
				get disabled() {
					return z(Te);
				},
				onVersion: D,
				onViewSource: Me
			}), O(a);
			var l = F(a, 2);
			let u;
			var d = N(l), p = (e) => {
				var t = cE(), n = F(N(t), 2);
				O(t), B("click", n, () => M(he, !0)), H(e, t);
			};
			W(d, (e) => {
				z(we) && e(p);
			}), to(F(d, 2), {
				get adapter() {
					return t.adapter;
				},
				get modules() {
					return z(f);
				},
				get project() {
					return z(x);
				},
				get disabled() {
					return z(Te);
				},
				get highlightId() {
					return z(de);
				},
				onHighlight: E,
				onChange: Ne,
				onViewSource: Me
			}), O(l);
			var m = F(l, 2);
			let h;
			var g = N(m), _ = (e) => {
				{
					let n = /* @__PURE__ */ k(() => z(fe) === "running");
					Ns(e, {
						get adapter() {
							return t.adapter;
						},
						get module() {
							return z(T);
						},
						get version() {
							return z(re);
						},
						get result() {
							return z(_e);
						},
						get waiting() {
							return z(n);
						}
					});
				}
			};
			W(g, (e) => {
				(t.adapter.slots?.result || z(_e) !== null) && e(_);
			});
			var v = F(g, 2), y = (e) => {
				Os(e, {
					get adapter() {
						return t.adapter;
					},
					get module() {
						return z(T);
					},
					get version() {
						return z(re);
					},
					onResult: Ie,
					onLoop: Le
				});
			}, b = (e) => {
				var t = lE(), n = N(t, !0);
				O(t), I(() => U(n, z(fe) === "running" ? "running…" : "no result yet — launch first")), H(e, t);
			};
			W(v, (e) => {
				z(fe) === "cached" ? e(y) : e(b, -1);
			}), O(m);
			var S = F(m, 2);
			let w;
			var ee = N(S), te = (e) => {
				Ss(e, {
					get adapter() {
						return t.adapter;
					},
					get executionRef() {
						return z(pe);
					},
					get status() {
						return z(fe);
					}
				});
			}, ne = (e) => {
				H(e, uE());
			};
			W(ee, (e) => {
				z(pe) ? e(te) : e(ne, -1);
			}), O(S);
			var ae = F(S, 2);
			let ce;
			fs(N(ae), {
				get cli() {
					return z(oe);
				},
				get module() {
					return z(T);
				},
				get chain() {
					return z(ue).chain;
				},
				get highlightId() {
					return z(de);
				},
				onHighlight: E
			}), O(ae);
			var me = F(ae, 2), ve = (e) => {
				Oo(e, {
					get adapter() {
						return t.adapter;
					},
					get module() {
						return z(T);
					},
					get version() {
						return z(re);
					},
					onViewSource: Me
				});
			};
			W(me, (e) => {
				z(C) === "provenance" && e(ve);
			});
			var ye = F(me, 2), be = (e) => {
				var n = Mr(), r = P(n), i = (e) => {
					UT(e, {
						get adapter() {
							return t.adapter;
						},
						get path() {
							return z(Oe);
						},
						get line() {
							return z(ke);
						}
					});
				}, a = (e) => {
					H(e, dE());
				}, o = (e) => {
					H(e, fE());
				};
				W(r, (e) => {
					z(Oe) ? e(i) : z(Ae) ? e(a, 1) : e(o, -1);
				}), H(e, n);
			};
			W(ye, (e) => {
				z(C) === "code" && e(be);
			}), I(() => {
				o = ai(a, 1, "pane svelte-eqn6l9", null, o, { off: z(C) !== "config" }), u = ai(l, 1, "pane svelte-eqn6l9", null, u, { off: z(C) !== "context" }), h = ai(m, 1, "pane fill svelte-eqn6l9", null, h, { off: z(C) !== "result" }), w = ai(S, 1, "pane svelte-eqn6l9", null, w, { off: z(C) !== "execution" }), ce = ai(ae, 1, "pane svelte-eqn6l9", null, ce, { off: z(C) !== "cli" });
			}), H(e, n);
		};
		W(r, (e) => {
			z(T) ? e(a, -1) : e(i);
		}), H(e, n);
	};
	W(ct, (e) => {
		z(l) ? z(S) === "list" ? e(ut, 1) : e(dt, -1) : e(lt);
	}), O(st), O(He), I(() => Xe = ai(Ye, 1, "dot svelte-eqn6l9", null, Xe, {
		on: z(l),
		run: z(l) && z(fe) === "running"
	})), H(e, He), Ke();
}
Tr(["click"]);
//#endregion
//#region src/adapter.ts
var gE = class extends Error {
	status;
	detail;
	constructor(e, t) {
		super(typeof t == "string" ? t : JSON.stringify(t)), this.status = e, this.detail = t;
	}
};
function _E(e) {
	return {
		target: e.target,
		version: e.version ?? []
	};
}
function vE(e) {
	if (e.endsWith(".py")) return "python";
	if (e.endsWith(".js") || e.endsWith(".mjs")) return "javascript";
	if (e.endsWith(".ts")) return "typescript";
	if (e.endsWith(".json")) return "json";
	if (e.endsWith(".yaml") || e.endsWith(".yml")) return "yaml";
	if (e.endsWith(".md")) return "markdown";
}
function yE(e, t) {
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
			throw new gE(a.status, e);
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
			n = e.replace(/\/+$/, ""), r = t;
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
		listModules: async () => ((await i("/v1/project")).modules ?? []).map((e) => ({
			module: e.module,
			kind: e.kind,
			doc: e.doc ?? void 0
		})),
		introspect: async (e) => Pi(e, await i(`/v1/project/${encodeURIComponent(e)}`)),
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
					identity: Bi(n.predicate ?? n.config)
				};
			} catch (e) {
				if (e instanceof gE && e.status === 400) return {
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
				context: (n?.context ?? []).map(_E)
			}] };
			return n?.execution && (r.execution = _E(n.execution)), n?.executionRef && (r.execution_ref = n.executionRef), { executionRef: (await i("/v1/executions", { body: r })).uuid };
		},
		find: async (e, t, n) => {
			let r = await i("/v1/interfaces/lifecycle", { body: {
				target: e,
				version: t,
				context: (n?.context ?? []).map(_E)
			} });
			return {
				status: r.status,
				uuid: r.uuid ?? void 0,
				executionRef: r.execution_uuid ?? void 0
			};
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
				identity: Bi(e.config ?? {}),
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
		listSource: async () => (await i("/v1/source")).files ?? [],
		readSource: async (e) => {
			let t = await i(`/v1/source/${e}`);
			return {
				path: t.path,
				content: t.content,
				etag: t.etag,
				language: vE(t.path)
			};
		}
	};
}
//#endregion
//#region src/main.ts
function bE(e, t = {}) {
	let n = Nr(hE, {
		target: e,
		props: {
			adapter: t.adapter ?? yE(t.url, t.token),
			defaultUrl: t.url ?? "http://127.0.0.1:8000",
			autoConnect: !!t.view,
			initialView: t.view ?? null,
			initialTarget: t.target ?? "",
			initialVersion: t.version ?? []
		}
	});
	return { unmount: () => void Lr(n) };
}
function xE({ model: e, el: t }) {
	let n = (t) => typeof e?.get == "function" ? e.get(t) ?? void 0 : void 0;
	t.style.height || (t.style.height = n("height") ?? "440px");
	let r = bE(t, {
		url: n("url"),
		token: n("token"),
		view: n("view"),
		target: n("target"),
		version: n("version")
	});
	return () => r.unmount();
}
var SE = {
	render: xE,
	mount: bE,
	createAdapter: yE
};
//#endregion
export { Zo as Browser, Os as CallLoop, fs as CliView, UT as CodeView, Ua as ConfigPicker, to as ContextStack, ua as FieldRenderer, fo as Lifecycle, hE as Machinable, Oo as Provenance, os as ResolvedBar, Ns as ResultSlot, gs as RunBanner, Ss as RunPanel, es as StatusBadge, ka as VersionEditor, yE as createAdapter, SE as default, Ii as elementsToVersion, Pi as moduleSchemaFromServer, bE as mount, Ai as parseAnnotation, ji as parseSignature, Li as parseVersionToken, xE as render, Ri as serializeVersionToken, Bi as shortIdentity, Fi as versionToElements };

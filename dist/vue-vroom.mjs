var Pe = Object.defineProperty;
var je = (n, t, e) => t in n ? Pe(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var w = (n, t, e) => (je(n, typeof t != "symbol" ? t + "" : t, e), e);
import { defineStore as ue } from "pinia";
import { ref as H, useSlots as se, computed as O, defineComponent as he, inject as B, watch as F, onUnmounted as ne, unref as N, renderSlot as V, normalizeProps as Q, mergeProps as W } from "vue";
function St({
  schema: n,
  belongsTo: t,
  hasMany: e,
  itemActions: s,
  singleton: i,
  includable: o,
  listMeta: r,
  idsAreNumbers: l,
  ...a
}) {
  return {
    schema: n,
    hasMany: e || {},
    belongsTo: t || {},
    itemActions: s || {},
    types: {},
    singleton: i,
    includable: o,
    listMeta: r,
    metaTypes: {},
    idsAreNumbers: l,
    ...a
  };
}
class k extends Error {
  constructor(e, s) {
    super();
    w(this, "status");
    w(this, "data");
    this.status = e, this.data = s || {};
  }
  log(e = "") {
    console.error(e, "Vroom server error", {
      status: this.status,
      data: this.data
    });
  }
}
const Ne = {
  casing: "camel",
  setCasing(n) {
    this.casing = n;
  },
  getBelongsToPostFix() {
    if (this.casing === "camel")
      return "Id";
    if (this.casing === "snake")
      return "_id";
  },
  getHasManyPostFix() {
    if (this.casing === "camel")
      return "Ids";
    if (this.casing === "snake")
      return "_ids";
  },
  removeHasManyPostfix(n) {
    var t = new RegExp(this.getHasManyPostFix() + "$", "g");
    return n.replace(t, "");
  },
  addBelongsToPostFix(n) {
    return n + this.getBelongsToPostFix();
  },
  addHasManyPostFix(n) {
    return n + this.getHasManyPostFix();
  }
}, j = Ne;
class xe {
  constructor(t, e, s, i, o, r, l, a) {
    w(this, "db");
    w(this, "model");
    w(this, "schema");
    w(this, "items");
    w(this, "belongsTo");
    w(this, "hasMany");
    w(this, "inverse");
    w(this, "lastId");
    w(this, "idsAreNumbers");
    w(this, "idFactory");
    w(this, "addDevtoolsEvent");
    this.db = a, this.model = t, this.schema = e, this.items = [], this.lastId = 0, this.belongsTo = s, this.hasMany = i, this.idsAreNumbers = r, this.idFactory = l, this.inverse = o || {};
  }
  find(t) {
    let e = t;
    return this.idsAreNumbers && typeof t == "string" && (e = parseInt(t, 10)), this.all().find((s) => s.id === e);
  }
  where(t) {
    return this.all().filter(t);
  }
  count(t) {
    return t ? this.where(t).length : this.items.length;
  }
  first() {
    return this.all().length > 0 ? this.all()[0] : null;
  }
  all() {
    return JSON.parse(JSON.stringify(this.items));
  }
  createId() {
    return this.lastId += 1, this.idsAreNumbers ? this.lastId : this.idFactory ? this.idFactory(this.lastId) : this.lastId.toString();
  }
  createMany(...t) {
    return t.map((e) => this.create(e));
  }
  findInverse(t) {
    return t in this.inverse ? this.inverse[t] : void 0;
  }
  updateRelations(t, e) {
    e.forEach((s) => {
      const i = this.findInverse(s.name);
      if (i === null)
        return;
      this.db[s.model].removeRelation(this.model, s.id, s.newId, i);
    }), t.forEach((s) => {
      const i = this.findInverse(s.name);
      if (i === null)
        return;
      this.db[s.model].pushRelation(this.model, s.id, s.newId, i);
    });
  }
  create(t) {
    const e = t.id || this.createId(), s = {};
    Object.entries(this.schema).forEach(([r, l]) => {
      l.optional || (s[r] = l.type());
    });
    const i = [];
    let o = { ...s, ...t };
    return Object.entries(this.belongsTo).forEach(([r, l]) => {
      const a = j.addBelongsToPostFix(r);
      if (a in o)
        i.push({
          name: r,
          newId: e,
          model: l(),
          id: o[a]
        });
      else if (r in o) {
        const u = o[r].id;
        o[a] = o[r].id, delete o[r], i.push({ name: r, newId: e, model: l(), id: u });
      }
      a in o || (o[a] = null);
    }), Object.entries(this.hasMany).forEach(([r, l]) => {
      const a = j.addHasManyPostFix(r);
      if (a in o)
        o[a].forEach((u) => {
          i.push({ name: r, newId: e, model: l(), id: u });
        });
      else if (r in o) {
        const u = o[r].map((c) => c.id);
        o[a] = u, delete o[r], u.forEach((c) => {
          i.push({ name: r, newId: e, model: l(), id: c });
        });
      }
      a in o || (o[a] = []);
    }), this.items.push({
      id: e,
      ...o
    }), this.addDevtoolsEvent && this.addDevtoolsEvent(this.model, "create", {
      payload: o,
      result: this.items[this.items.length - 1]
    }), i.length && this.updateRelations(i, []), this.items[this.items.length - 1];
  }
  pushRelation(t, e, s, i) {
    i !== null && (Object.entries(this.hasMany).forEach(([o, r]) => {
      if (!(i && o !== i) && r() === t) {
        const l = this.find(e), a = j.addHasManyPostFix(o), u = l[a] ? [...l[a]] : [];
        if (u.includes(s))
          return;
        this.update(e, {
          [a]: [...u, s]
        });
      }
    }), Object.entries(this.belongsTo).forEach(([o, r]) => {
      if (!(i && o !== i) && r() === t) {
        const l = j.addBelongsToPostFix(o);
        if (this.find(e)[l] === s)
          return;
        this.update(e, {
          [l]: s
        });
      }
    }));
  }
  removeRelation(t, e, s, i) {
    Object.entries(this.hasMany).forEach(([o, r]) => {
      if (!(i && o !== i) && r() === t) {
        const l = this.find(e), a = j.addHasManyPostFix(o), u = l[a] ? [...l[a]] : [];
        if (!l[a].includes(s))
          return;
        this.update(e, {
          [a]: u.filter((c) => c !== s)
        });
      }
    }), Object.entries(this.belongsTo).forEach(([o, r]) => {
      if (!(i && o !== i) && r() === t) {
        const l = this.find(e), a = j.addBelongsToPostFix(o);
        if (l[a] !== s)
          return;
        this.update(e, { [a]: null });
      }
    });
  }
  getRelated(t, e) {
    if (e in this.belongsTo) {
      const s = this.belongsTo[e](), i = j.addBelongsToPostFix(e);
      return this.find(t)[i] ? [this.db[s].find(this.find(t)[i])] : [];
    }
    if (e in this.hasMany) {
      const s = this.hasMany[e](), i = j.addHasManyPostFix(e);
      return this.find(t)[i].map((o) => this.db[s].find(o));
    }
  }
  getRelatedModelName(t) {
    if (t in this.belongsTo)
      return this.belongsTo[t]();
    if (t in this.hasMany)
      return this.hasMany[t]();
    throw new k(400, { type: "related_model_not_found" });
  }
  update(t, e) {
    const s = this.idsAreNumbers && typeof t != "number" ? parseInt(t, 10) : t, i = this.items.findIndex((c) => c.id === s);
    if (i === -1)
      throw new k(404);
    const o = this.items[i], r = e, l = [], a = [];
    Object.entries(this.belongsTo).forEach(([c, d]) => {
      const f = j.addBelongsToPostFix(c), h = o[f];
      if (f in r)
        r[f] && l.push({
          name: c,
          newId: s,
          model: d(),
          id: r[f]
        }), h && h !== t && a.push({
          name: c,
          newId: s,
          model: d(),
          id: h
        });
      else if (c in r) {
        const y = r[c].id;
        r[f] = r[c].id, delete r[c], l.push({
          name: c,
          newId: s,
          model: d(),
          id: y
        }), h && h !== t && a.push({
          name: c,
          newId: s,
          model: d(),
          id: h
        });
      }
    }), Object.entries(this.hasMany).forEach(([c, d]) => {
      const f = j.addHasManyPostFix(c), h = o[f] || [];
      if (f in r) {
        const y = r[f];
        y.filter((p) => !h.includes(p)).forEach((p) => {
          l.push({
            name: c,
            newId: s,
            model: d(),
            id: p
          });
        }), h.filter((p) => !y.includes(p)).forEach((p) => {
          a.push({
            name: c,
            newId: s,
            model: d(),
            id: p
          });
        });
      } else if (c in r) {
        const y = r[c].map((p) => p.id);
        r[f] = y, delete r[c], y.filter((p) => !h.includes(p)).forEach((p) => {
          l.push({
            name: c,
            newId: s,
            model: d(),
            id: p
          });
        }), h.filter((p) => !y.includes(p)).forEach((p) => {
          a.push({
            name: c,
            newId: s,
            model: d(),
            id: p
          });
        });
      }
    });
    const u = JSON.parse(JSON.stringify(this.items[i]));
    return Object.entries(r).forEach(([c, d]) => {
      this.items[i][c] = d;
    }), this.addDevtoolsEvent && this.addDevtoolsEvent(this.model, "update", {
      payload: r,
      before: u,
      after: JSON.parse(JSON.stringify(this.items[i]))
    }), (l.length || a.length) && this.updateRelations(l, a), this.items[i];
  }
  destroy(t) {
    this.items = this.items.filter((e) => e.id !== t), this.addDevtoolsEvent && this.addDevtoolsEvent(this.model, "delete", {
      id: t
    });
  }
  truncate() {
    this.items = [], this.lastId = 0;
  }
}
function _e(n) {
  const { models: t, ...e } = n, s = e.idsAreNumbers || !1;
  let i = {};
  return window.cypressVroom ? (i = window.cypressVroom.db, i) : (Object.entries(t).forEach(([o, r]) => {
    i[o] = new xe(
      o,
      r.schema,
      r.belongsTo,
      r.hasMany,
      r.inverse,
      r.idsAreNumbers ?? s,
      e.idFactory,
      i
    );
  }), i);
}
function J(n, t) {
  return typeof n == "boolean" ? t === "true" : typeof n == "number" ? parseFloat(t) : t;
}
const $e = {
  lt: (n, t) => typeof n == "string" ? n.localeCompare(t) < 0 : n < J(n, t),
  lte: (n, t) => typeof n == "string" ? n.localeCompare(t) <= 0 : n <= J(n, t),
  gt: (n, t) => typeof n == "string" ? n.localeCompare(t) > 0 : n > J(n, t),
  gte: (n, t) => typeof n == "string" ? n.localeCompare(t) >= 0 : n >= J(n, t),
  between: (n, t) => {
    const e = t.split(",");
    return typeof n == "string" ? n.localeCompare(e[0]) > 0 && n.localeCompare(e[1]) < 0 : n > J(n, e[0]) && n < J(n, e[1]);
  },
  contains: (n, t) => n.indexOf(t) !== -1
};
function fe(n) {
  const t = n.match(/(.*)\[(.*)\]/);
  if (!t)
    return { name: n, fn: (i, o) => i === J(i, o) };
  const [, e, s] = t;
  return {
    name: e,
    // @ts-expect-error
    fn: $e[s]
  };
}
function Fe(n, t, e) {
  return {
    paginatedItems: e === -1 ? n : n.slice((t - 1) * e, t * e),
    paginationMeta: {
      page: t,
      results: n.length,
      pages: e === -1 ? 1 : Math.ceil(n.length / e)
    }
  };
}
function ke(n, t, e) {
  let s = 0;
  if (t && (s = n.findIndex((r) => r.id == t), s === -1))
    throw new k(404, { type: "cursor_not_found" });
  let i = n.slice(s, s + e + 1), o = null;
  return i.length > e && (o = i.pop().id), {
    paginatedItems: i,
    paginationMeta: { nextCursor: o }
  };
}
function Le(n, t, e, s) {
  if (!t)
    return n;
  const i = t.split(",");
  return [...n].sort((o, r) => {
    for (let l = 0; l < i.length; l += 1) {
      const a = i[l].replace(/^-/, ""), u = i[l].charAt(0) === "-" ? -1 : 1;
      let c = 0;
      if (e && e[a])
        c = e[a](o, r, u, s);
      else {
        const d = o[a], f = r[a];
        typeof d == "string" ? c = d.localeCompare(f) * u : c = (d - f) * u;
      }
      if (c !== 0)
        return c;
    }
    return 0;
  });
}
function Re(n, t, e) {
  var p;
  const { page: s, limit: i, cursor: o, sort: r, include: l, ...a } = n.query;
  let u = t[n.model].all().filter((m) => {
    let E = !0;
    return Object.entries(a).forEach(([I, T]) => {
      if (n.filters && I in n.filters)
        n.filters[I](m, T, t) || (E = !1);
      else {
        const { name: g, fn: b } = fe(I);
        g in m && !b(m[g], T) && (E = !1);
      }
    }), E;
  });
  u = Le(u, r, n.sorters, t);
  const c = t[n.model].hasMany, d = l ? l.split(",") : [];
  if (u = u.map((m) => (Object.keys(m).forEach((E) => {
    const I = j.removeHasManyPostfix(E);
    I in c && !d.includes(I) && delete m[E];
  }), m)), n.settings.envelope === !1)
    return u;
  let f = {};
  n.settings.listMeta && Object.entries(n.settings.listMeta).forEach(([m, E]) => {
    n.metaFieldMethods && n.metaFieldMethods[m] ? f[m] = n.metaFieldMethods[m](u, t) : f[m] = E.type();
  });
  const h = n.settings.pagination;
  if (h) {
    if (h.type === "page") {
      const { paginatedItems: m, paginationMeta: E } = Fe(
        u,
        s || 1,
        i || h.defaultLimit
      );
      u = m, f = { ...f, ...E };
    }
    if (h.type === "cursor") {
      const { paginatedItems: m, paginationMeta: E } = ke(
        u,
        o,
        i || h.defaultLimit
      );
      u = m, f = { ...f, ...E };
    }
  }
  const y = {};
  if (d.forEach((m) => {
    const E = t[n.model].getRelatedModelName(m);
    y[E] || (y[E] = []), u.forEach((T) => {
      t[n.model].getRelated(T.id, m).forEach((b) => {
        y[E].find((_) => _.id === b.id) || y[E].push(b);
      });
    });
    const I = t[E].hasMany;
    y[E] = y[E].map((T) => (Object.keys(T).forEach((g) => {
      j.removeHasManyPostfix(g) in I && delete T[g];
    }), T));
  }), (p = n.sideEffects) != null && p.index) {
    const m = n.sideEffects.index(u, t, n);
    m && (u = m);
  }
  return {
    [e.naming.data]: u,
    [e.naming.meta]: f,
    [e.naming.included]: y
  };
}
function De(n, t) {
  var i;
  const e = JSON.parse(
    JSON.stringify(t[n.model].create(n.json))
  ), s = t[n.model].hasMany;
  if (Object.keys(e).forEach((o) => {
    j.removeHasManyPostfix(o) in s && delete e[o];
  }), (i = n.sideEffects) != null && i.create) {
    const o = n.sideEffects.create(e, t, n);
    if (o)
      return o;
  }
  return e;
}
function He(n, t) {
  var r;
  const { id: e } = n.params;
  if (!t[n.model].find(e))
    throw new k(404);
  const i = JSON.parse(
    JSON.stringify(t[n.model].update(e, n.json))
  ), o = t[n.model].hasMany;
  if (Object.keys(i).forEach((l) => {
    j.removeHasManyPostfix(l) in o && delete i[l];
  }), (r = n.sideEffects) != null && r.update) {
    const l = n.sideEffects.update(i, t, n);
    if (l)
      return l;
  }
  return i;
}
function Ve(n, t, e) {
  const s = n.query;
  let i = t[n.model].all().filter((r) => {
    let l = !0;
    return Object.entries(s).forEach(([a, u]) => {
      if (n.filters && a in n.filters)
        n.filters[a](r, u, t) || (l = !1);
      else {
        const { name: c, fn: d } = fe(a);
        c in r && !d(r[c], u) && (l = !1);
      }
    }), l;
  });
  if (!i.length)
    throw new k(404);
  const o = i[0];
  return n.settings.envelope === !1 ? o : {
    [e.naming.dataSingle]: o
  };
}
function Ce(n, t) {
  const e = n.query;
  let s = t[n.model].all().filter((o) => {
    let r = !0;
    return Object.entries(e).forEach(([l, a]) => {
      if (n.filters && l in n.filters)
        n.filters[l](o, a, t) || (r = !1);
      else {
        const { name: u, fn: c } = fe(l);
        u in o && !c(o[u], a) && (r = !1);
      }
    }), r;
  });
  if (!s.length)
    throw new k(404);
  const i = s[0];
  if (!i)
    throw new k(404);
  return t[n.model].update(i.id, n.json);
}
function Ae(n, t, e) {
  var u;
  const { id: s } = n.params, { include: i } = n.query;
  let o = t[n.model].find(s);
  if (!o)
    throw new k(404);
  if (n.settings.envelope === !1)
    return o;
  const r = t[n.model].hasMany, l = i ? i.split(",") : [];
  Object.keys(o).forEach((c) => {
    const d = j.removeHasManyPostfix(c);
    d in r && !l.includes(d) && delete o[c];
  });
  const a = {};
  if (i && i.split(",").forEach((c) => {
    const d = t[n.model].getRelatedModelName(c);
    a[d] = [], t[n.model].getRelated(o.id, c).forEach((y) => {
      a[d].find((p) => p.id === y.id) || a[d].push(y);
    });
    const h = t[d].hasMany;
    a[d] = a[d].map((y) => (Object.keys(y).forEach((p) => {
      j.removeHasManyPostfix(p) in h && delete y[p];
    }), y));
  }), (u = n.sideEffects) != null && u.read) {
    const c = n.sideEffects.read(o, t, n);
    c && (o = c);
  }
  return {
    [e.naming.dataSingle]: o,
    [e.naming.included]: a
  };
}
function Ue(n) {
  return (t, e) => {
    const { id: s } = t.params, i = e[t.model].find(s);
    if (!i)
      throw new k(404);
    return e[t.model].update(s, n(i));
  };
}
function Je(n, t) {
  var i;
  const { id: e } = n.params, s = t[n.model].find(e);
  if (!s)
    throw new k(404);
  (i = n.sideEffects) != null && i.delete && n.sideEffects.delete(s, t, n), t[n.model].destroy(s.id);
}
function Be(n, t) {
  const e = [];
  return n.json.forEach((s) => {
    const i = JSON.parse(
      JSON.stringify(t[n.model].create(s))
    ), o = t[n.model].hasMany;
    Object.keys(i).forEach((r) => {
      j.removeHasManyPostfix(r) in o && delete i[r];
    }), e.push(i);
  }), e;
}
function Ge(n, t) {
  const e = [];
  return n.json.forEach((s) => {
    const { id: i, ...o } = s;
    if (!t[n.model].find(i))
      throw new k(404);
    const l = JSON.parse(
      JSON.stringify(t[n.model].update(i, o))
    ), a = t[n.model].hasMany;
    Object.keys(l).forEach((u) => {
      j.removeHasManyPostfix(u) in a && delete l[u];
    }), e.push(l);
  }), e;
}
function ze(n, t) {
  n.params, n.json.forEach((e) => {
    const s = t[n.model].find(e.id);
    if (!s)
      throw new k(404);
    t[n.model].destroy(s.id);
  });
}
class Qe {
  constructor(t, e, s) {
    w(this, "routes");
    w(this, "customRoutes");
    w(this, "overrides");
    w(this, "db");
    w(this, "identityModel");
    w(this, "identity");
    w(this, "baseURL");
    w(this, "settings");
    w(this, "idsAreNumbers");
    w(this, "filters");
    w(this, "sideEffects");
    w(this, "metaFields");
    w(this, "sorters");
    w(this, "addDevtoolsEvent");
    w(this, "events");
    w(this, "naming");
    this.routes = [], this.customRoutes = [], this.overrides = [], this.db = s, this.baseURL = t.baseURL || "", window.cypressVroom ? (this.settings = window.cypressVroom.server.settings, this.overrides = window.cypressVroom.server.overrides) : this.settings = t.server || {}, this.idsAreNumbers = t.idsAreNumbers || !1, this.identityModel = t.identityModel ? t.identityModel() : null, this.identity = null, this.generateRoutes(e), this.filters = {}, this.sorters = {}, this.sideEffects = {}, this.metaFields = {}, this.events = [], this.naming = t.naming;
  }
  /** Reset the server: truncates all db collections and removes overriden routes */
  reset() {
    Object.values(this.db).forEach(
      (t) => {
        t.truncate();
      }
    ), this.overrides = [];
  }
  /** Overwrite the response delay */
  setDelay(t) {
    this.settings.delay = t;
  }
  generateRoutes(t) {
    Object.entries(t).forEach(([e, s]) => {
      const i = s.only || [
        "index",
        "create",
        "read",
        "update",
        "delete",
        "bulk-create",
        "bulk-update",
        "bulk-delete"
      ], o = s.singleton ? e : s.plural || `${e}s`, r = s.path || `/${o}`;
      if (s.singleton) {
        this.routes.push({
          method: "GET",
          path: r,
          handler: Ve,
          model: e,
          settings: s
        }), this.routes.push({
          method: "PATCH",
          path: r,
          handler: Ce,
          model: e,
          settings: s
        });
        return;
      }
      i.includes("index") && this.routes.push({
        method: "GET",
        path: r,
        handler: Re,
        model: e,
        settings: s
      }), i.includes("create") && this.routes.push({
        method: "POST",
        path: r,
        handler: De,
        model: e,
        settings: s
      }), i.includes("read") && this.routes.push({
        method: "GET",
        path: `${r}/:id`,
        handler: Ae,
        model: e,
        settings: s
      }), i.includes("bulk-update") && this.routes.push({
        method: "PATCH",
        path: `${r}/bulk`,
        handler: Ge,
        model: e,
        settings: s
      }), i.includes("update") && this.routes.push({
        method: "PATCH",
        path: `${r}/:id`,
        handler: He,
        model: e,
        settings: s
      }), i.includes("bulk-delete") && this.routes.push({
        method: "DELETE",
        path: `${r}/bulk`,
        handler: ze,
        model: e,
        settings: s
      }), i.includes("delete") && this.routes.push({
        method: "DELETE",
        path: `${r}/:id`,
        handler: Je,
        model: e,
        settings: s
      }), i.includes("bulk-create") && this.routes.push({
        method: "POST",
        path: `${r}/bulk`,
        handler: Be,
        model: e,
        settings: s
      }), Object.entries(s.itemActions).forEach(([l, a]) => {
        this.routes.push({
          method: "POST",
          path: `${r}/:id/${l}`,
          // @ts-expect-error
          handler: Ue(a),
          model: e,
          settings: s
        });
      });
    });
  }
  addCustomRoute(t, e, s) {
    this.customRoutes.push({ method: t, path: e, handler: s, model: "", settings: {} });
  }
  override(t, e, s) {
    this.overrides.push({ method: t, path: e, handler: s, model: "", settings: {} });
  }
  /** Add a custom GET route */
  get(t, e) {
    this.addCustomRoute("GET", t, e);
  }
  /** Add a custom PATCH route */
  patch(t, e) {
    this.addCustomRoute("PATCH", t, e);
  }
  /** Add a custom POST route */
  post(t, e) {
    this.addCustomRoute("POST", t, e);
  }
  /** Add a custom DELETE route */
  delete(t, e) {
    this.addCustomRoute("DELETE", t, e);
  }
  /** Add a temporary GET route (will be removed if server.reset is called) */
  overrideGet(t, e) {
    this.override("GET", t, e);
  }
  /** Add a temporary PATCH route (will be removed if server.reset is called) */
  overridePatch(t, e) {
    this.override("PATCH", t, e);
  }
  /** Add a temporary POST route (will be removed if server.reset is called) */
  overridePost(t, e) {
    this.override("POST", t, e);
  }
  /** Add a temporary DELETE route (will be removed if server.reset is called) */
  overrideDelete(t, e) {
    this.override("DELETE", t, e);
  }
  parseQuery(t) {
    const e = new URLSearchParams(t), s = {};
    for (const i of e.keys())
      if (e.get(i) !== null) {
        let o = e.get(i);
        (["limit", "page"].includes(i) || i === "cursor" && this.idsAreNumbers && /^\d+$/.test(o)) && (o = parseInt(o, 10)), s[i] = o;
      }
    return s;
  }
  parseUrl(t, e) {
    const s = t.startsWith(e) ? t.slice(e.length) : t, [i, o] = s.split("?");
    return {
      path: i,
      query: this.parseQuery(o)
    };
  }
  getJsonBody(t) {
    return JSON.parse(t);
  }
  findMatchingRoute(t, e) {
    const s = {}, i = [
      ...this.overrides,
      ...this.customRoutes,
      ...this.routes
    ].find((o) => {
      if (o.method !== t)
        return !1;
      const r = [...o.path.matchAll(/:([^/]+)/g)].map(
        (c) => c[1]
      ), l = o.path.replace(/:[^/]+/g, "([^/]+)") + "$", a = new RegExp(l), u = e.match(a);
      return u ? (r.forEach((c, d) => {
        s[c] = u[d + 1];
      }), !0) : !1;
    });
    return i ? {
      route: i,
      params: s
    } : { route: null, params: null };
  }
  parseRequest({ method: t, url: e, body: s, headers: i }, o) {
    const { path: r, query: l } = this.parseUrl(e, o), a = i["Content-Type"] === "multipart/form-data", u = a ? s : void 0, c = s && !a ? this.getJsonBody(s) : void 0;
    if (i.authorization && this.identityModel) {
      const [, h] = i.authorization.split(" ");
      this.identity = this.db[this.identityModel].find(h);
    }
    const { route: d, params: f } = this.findMatchingRoute(t, r);
    this.logEvent("🛫 " + t, e.replace(this.baseURL, ""), {
      params: f,
      query: l,
      body: c,
      headers: i
    });
    try {
      if (!d)
        throw new k(404, { type: "route_not_found", method: t, path: r });
      const h = {
        query: l,
        json: c,
        form: u,
        params: f,
        model: d.model,
        settings: d.settings,
        headers: i || {},
        // @ts-expect-error
        filters: this.filters ? this.filters[d.model] : {},
        // @ts-expect-error
        sideEffects: this.sideEffects ? this.sideEffects[d.model] : {},
        identity: this.identity,
        // @ts-expect-error
        sorters: this.sorters ? this.sorters[d.model] : {},
        // @ts-expect-error
        metaFieldMethods: this.metaFields ? this.metaFields[d.model] : {}
      };
      return d.handler(h, this.db, this);
    } catch (h) {
      throw h instanceof k && this.logEvent(
        "🚨 " + h.status.toString(),
        t + " " + e.replace(this.baseURL, ""),
        h.data,
        "error"
      ), h;
    }
  }
  async handleRequest(t, e, s, i) {
    const o = this.parseRequest(
      {
        method: t,
        url: e,
        body: s,
        headers: i
      },
      this.baseURL
    );
    return await new Promise(
      (r) => setTimeout(
        r,
        this.settings.delay === void 0 ? 150 : this.settings.delay
      )
    ), this.logEvent(
      "🛬 Response",
      e.toString().replace(this.baseURL, ""),
      o
    ), o;
  }
  /** Add one or more custom filters */
  addFilters(t) {
    Object.entries(t).forEach(([e, s]) => {
      const i = e;
      e in this.filters || (this.filters[i] = {}), this.filters[i] = {
        ...this.filters[i],
        // @ts-expect-error
        ...s
      };
    });
  }
  /** Add one or more custom meta fields */
  addMetaFields(t) {
    Object.entries(t).forEach(([e, s]) => {
      const i = e;
      e in this.metaFields || (this.metaFields[i] = {}), this.metaFields[i] = {
        ...this.metaFields[i],
        // @ts-expect-error
        ...s
      };
    });
  }
  /** Add on or more sideffects */
  addSideEffects(t) {
    Object.entries(t).forEach(([e, s]) => {
      const i = e;
      e in this.sideEffects || (this.sideEffects[i] = {}), this.sideEffects[i] = {
        ...this.sideEffects[i],
        // @ts-expect-error
        ...s
      };
    });
  }
  /** Add one or more custom sorters */
  addSorters(t) {
    Object.entries(t).forEach(([e, s]) => {
      const i = e;
      e in this.sorters || (this.sorters[i] = {}), this.sorters[i] = {
        ...this.sorters[i],
        // @ts-expect-error
        ...s
      };
    });
  }
  logEvent(t, e, s, i = "default") {
    if (this.events.push({ title: t, subtitle: e, data: s, logType: i }), this.addDevtoolsEvent)
      for (; this.events.length > 0; )
        this.addDevtoolsEvent(this.events.shift());
  }
  setDevTools(t) {
    for (this.addDevtoolsEvent = t; this.events.length > 0; )
      t(this.events.shift());
  }
}
function We(n, t, e) {
  return n.server && n.server.enable ? new Qe(n, t, e) : null;
}
class be extends Error {
  constructor(e, s, i) {
    super(`"${e}" sent invalid response`);
    w(this, "url");
    w(this, "errors");
    w(this, "response");
    this.url = e, this.errors = s, this.response = i;
  }
  log(e = "", s = "error") {
    console[s](e, `"${this.url}" sent invalid response:
`, {
      errors: this.errors,
      response: this.response
    });
  }
}
function Ee(n, t) {
  const e = t.schema, s = [];
  return Object.entries(e).forEach(([i, o]) => {
    const r = o;
    if (!(i in n))
      r.optional || s.push({ id: n.id, type: "field_missing", field: i });
    else if (typeof n[i] != typeof r.type()) {
      if (r.nullable && n[i] === null)
        return;
      s.push({
        id: n.id,
        type: "type_mismatch",
        field: i,
        expected: typeof r.type(),
        actual: typeof n[i]
      });
    }
  }), s.length ? s : null;
}
function Ke(n, t, e, s, i, o) {
  const r = s[o.dataSingle], l = [];
  r || l.push({
    msg: `Response did not include "${o.dataSingle}" object`
  });
  const a = Ee(r, i[e]);
  if (a && l.push(...a), l.length > 0) {
    const u = new be(n, l, s);
    throw u.log("", "warn"), u;
  }
}
function Xe(n, t, e, s, i, o) {
  const r = s[o.data], l = [];
  Array.isArray(r) ? r.forEach((c) => {
    const d = Ee(c, i[e]);
    d && l.push(...d);
  }) : l.push({
    msg: `Response did not include "${o.data}" object`
  }), t.include && (s[o.included] || l.push({
    msg: `Response did not include "${o.included}" object`
  }));
  const a = t ? new URLSearchParams(t).toString() : "", u = a ? n + "?" + a : n;
  if (l.length > 0) {
    const c = new be(u, l, s);
    throw c.log("", "warn"), c;
  }
}
function Ye(n, t) {
  return {
    list(e, s, i, o) {
      process.env.NODE_ENV !== "production" && Xe(e, s, i, o, n, t);
    },
    single(e, s, i, o) {
      process.env.NODE_ENV !== "production" && Ke(e, s, i, o, n, t);
    }
  };
}
class Oe extends Error {
}
function ce(n) {
  const t = {};
  return Object.entries(n).forEach(([e, s]) => {
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean")
      t[e] = s;
    else if (s && typeof s == "object") {
      let i = "";
      ["gt", "lt", "gte", "lte", "contains"].forEach((o) => {
        if (o in s) {
          i = o;
          const r = s[o];
          r && (t[`${e}[${i}]`] = r);
        }
      }), ["between"].forEach((o) => {
        if (o in s) {
          i = o;
          const r = s[o].join(",");
          r && (t[`${e}[${i}]`] = r);
        }
      });
    }
  }), t;
}
function Ze(n) {
  return n.map((t) => (t.dir === "DESC" ? "-" : "") + t.field).join(",");
}
function qe(n, t = "", e, s, i, o, r) {
  const l = e.path ? t + e.path : `${t}/${n}`;
  return ue("vroom:" + n, {
    state: () => ({
      item: null
    }),
    getters: {
      single: (a) => a.item
    },
    actions: {
      $fetch(a, u) {
        let c = {
          ...ce(a)
        };
        return i.get(u || l, c).then((d) => e.envelope === !1 ? (this.item = d, d) : (this.item = d[s.dataSingle], d[s.dataSingle]));
      },
      update(a, u = {}) {
        let c = {
          ...ce(u)
        };
        return i.patch(l, a, c).then((d) => {
          this.item = { ...d };
        });
      }
    }
  });
}
function et(n, t, e = "", s, i, o, r, l) {
  const a = s.path ? e + s.path : `${e}/${n}`, u = {};
  return Object.keys(s.itemActions).forEach((c) => {
    u[c] = function(d, f) {
      return o.post(`${a}/${d}/${c}`, f).then((h) => {
        this.add([h]);
      });
    };
  }), ue("vroom:" + n, {
    state: () => ({
      items: [],
      requestKeys: {}
    }),
    getters: {
      list(c) {
        return (d) => c.items.filter((f) => d.includes(f.id));
      },
      single(c) {
        return (d) => c.items.find((f) => f.id === d);
      }
    },
    actions: {
      ...u,
      add(c) {
        const d = [...this.items];
        c.forEach((f) => {
          const h = d.findIndex((y) => y.id === f.id);
          h !== -1 ? d[h] = { ...d[h], ...f } : d.push(f);
        }), this.items = d;
      },
      $list(c, d, f, h, y, p) {
        let m = {
          ...ce(c),
          ...d
        };
        f.length && (m.sort = Ze(f)), h.length && (m.include = h.join(",")), "cursor" in m && m.cursor === void 0 && delete m.cursor;
        const E = y || a, I = performance.now();
        return p && (this.requestKeys[p] = I), o.get(E, m).then((T) => {
          if (p) {
            if (this.requestKeys[p] !== I)
              throw new Oe();
            delete this.requestKeys[p];
          }
          if (s.envelope === !1)
            return this.add(T), { items: T };
          const g = T[i.data], b = T[i.included] || {}, _ = T[i.meta] || {};
          return l.list(E, m, t, T), this.add(g), Object.entries(b).forEach(([D, S]) => {
            r[D]().add(S);
          }), { items: g, meta: _, included: b };
        });
      },
      $single(c, d, f) {
        let h = {};
        d.length && (h.include = d.join(","));
        const y = f || a + "/" + c;
        return o.get(y, h).then((p) => {
          if (s.envelope === !1)
            return this.add([p]), p;
          const m = p[i.dataSingle], E = p[i.included] || {}, I = p[i.meta] || {};
          return l.single(y, h, t, p), this.add([m]), Object.entries(E).forEach(([T, g]) => {
            r[T]().add(g);
          }), { item: m, meta: I, included: E };
        });
      },
      create(c) {
        return o.post(a, c).then((d) => (this.add([d]), d));
      },
      bulkCreate(c) {
        return o.post(a + "/bulk", c).then((d) => {
          this.add(d);
        });
      },
      update(c, d) {
        return o.patch(a + "/" + c, d).then((f) => {
          this.add([f]);
        });
      },
      bulkUpdate(c) {
        return o.patch(a + "/bulk", c).then((d) => {
          this.add(d);
        });
      },
      localUpdate(c, d) {
        this.add([{ id: c, ...d }]);
      },
      delete(c, d) {
        return o.delete(a + "/" + c, void 0, d).then(() => {
          this.items = this.items.filter((f) => f.id !== c);
        });
      },
      bulkDelete(c) {
        return o.delete(a + "/bulk", c.map((d) => ({ id: d }))).then(() => {
          this.items = this.items.filter(
            (d) => !c.includes(d.id)
          );
        });
      },
      garbageCollect(c) {
        this.items = this.items.filter((d) => !c.includes(d.id));
      }
    }
  });
}
function tt(n, t = "", e, s) {
  const i = {}, o = Ye(n, e);
  return Object.keys(n).forEach((r) => {
    const l = n[r].plural || `${r}s`;
    n[r].singleton ? i[r] = qe(
      r,
      t,
      n[r],
      e,
      s
    ) : i[r] = et(
      l,
      r,
      t,
      n[r],
      e,
      s,
      i,
      o
    );
  }), i;
}
function st(n) {
  return ue("vroom:cache", {
    state: () => ({
      ids: {},
      timeout: null
    }),
    actions: {
      subscribe(t, e) {
        const s = JSON.parse(JSON.stringify(this.ids));
        t in s || (s[t] = {}), e.forEach((i) => {
          i in s[t] || (s[t][i] = 0), s[t][i] += 1;
        }), this.ids = s;
      },
      garbageCollect() {
        this.timeout = null, Object.entries(this.ids).forEach(([t, e]) => {
          const s = [];
          Object.entries(e).forEach(([i, o]) => {
            o === 0 && (s.push(i), delete this.ids[t][i]);
          }), s.length && n[t]().garbageCollect(s);
        });
      },
      scheduleGarbageCollection() {
        this.timeout || (this.timeout = setTimeout(this.garbageCollect, 5e3));
      },
      unsubscribe(t, e) {
        let s = !1;
        const i = JSON.parse(JSON.stringify(this.ids));
        t in this.ids && (e.forEach((o) => {
          o in i[t] && (i[t][o] -= 1, i[t][o] === 0 && (s = !0));
        }), this.ids = i, !this.timeout && s && this.scheduleGarbageCollection());
      }
    }
  });
}
function nt() {
  return Se().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function Se() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const it = typeof Proxy == "function", ot = "devtools-plugin:setup", rt = "plugin:settings:set";
let z, de;
function at() {
  var n;
  return z !== void 0 || (typeof window < "u" && window.performance ? (z = !0, de = window.performance) : typeof global < "u" && (!((n = global.perf_hooks) === null || n === void 0) && n.performance) ? (z = !0, de = global.perf_hooks.performance) : z = !1), z;
}
function lt() {
  return at() ? de.now() : Date.now();
}
class ct {
  constructor(t, e) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = e;
    const s = {};
    if (t.settings)
      for (const r in t.settings) {
        const l = t.settings[r];
        s[r] = l.defaultValue;
      }
    const i = `__vue-devtools-plugin-settings__${t.id}`;
    let o = Object.assign({}, s);
    try {
      const r = localStorage.getItem(i), l = JSON.parse(r);
      Object.assign(o, l);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return o;
      },
      setSettings(r) {
        try {
          localStorage.setItem(i, JSON.stringify(r));
        } catch {
        }
        o = r;
      },
      now() {
        return lt();
      }
    }, e && e.on(rt, (r, l) => {
      r === this.plugin.id && this.fallbacks.setSettings(l);
    }), this.proxiedOn = new Proxy({}, {
      get: (r, l) => this.target ? this.target.on[l] : (...a) => {
        this.onQueue.push({
          method: l,
          args: a
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (r, l) => this.target ? this.target[l] : l === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(l) ? (...a) => (this.targetQueue.push({
        method: l,
        args: a,
        resolve: () => {
        }
      }), this.fallbacks[l](...a)) : (...a) => new Promise((u) => {
        this.targetQueue.push({
          method: l,
          args: a,
          resolve: u
        });
      })
    });
  }
  async setRealTarget(t) {
    this.target = t;
    for (const e of this.onQueue)
      this.target.on[e.method](...e.args);
    for (const e of this.targetQueue)
      e.resolve(await this.target[e.method](...e.args));
  }
}
function dt(n, t) {
  const e = n, s = Se(), i = nt(), o = it && e.enableEarlyProxy;
  if (i && (s.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !o))
    i.emit(ot, n, t);
  else {
    const r = o ? new ct(e, i) : null;
    (s.__VUE_DEVTOOLS_PLUGINS__ = s.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: e,
      setupFn: t,
      proxy: r
    }), r && t(r.proxiedTarget);
  }
}
let re = [], ae = {}, ge = !1;
function ye(n, t, e) {
  re.push(...Object.entries(t)), re.forEach(([s, i]) => {
    ae[s] = i.items;
  }), dt(
    {
      id: "vue-vroom",
      label: "Vroom",
      packageName: "vue-vroom",
      homepage: "https://frederikbache.github.io/vue-vroom/",
      app: n
    },
    (s) => {
      const i = "vue-vroom";
      e.setDevTools((o) => {
        setTimeout(() => {
          s.addTimelineEvent({
            layerId: i,
            event: {
              time: s.now(),
              ...o
            }
          });
        });
      }), Object.values(t).forEach((o) => {
        o.addDevtoolsEvent = (r, l, a) => {
          setTimeout(() => {
            s.addTimelineEvent({
              layerId: i,
              event: {
                time: s.now(),
                title: "💾",
                subtitle: r + ":" + l,
                data: a
              }
            });
          });
        };
      }), ge || (ge = !0, s.addInspector({
        id: i,
        label: "Vroom",
        icon: "electric_moped"
      }), s.addTimelineLayer({
        id: i,
        color: 16750671,
        label: "Vroom"
      }), s.on.getInspectorTree((o, r) => {
        o.inspectorId === i && (o.rootNodes = [
          {
            id: "db",
            label: "Database",
            children: re.map(([l, a]) => ({
              id: l,
              label: l
            }))
          }
        ]);
      }), s.on.getInspectorState((o, r) => {
        o.inspectorId === i && (o.nodeId.match(/routes:(.*)/), o.nodeId in ae && (o.state = {
          "DB items": ae[o.nodeId].map((l) => ({
            key: l.id,
            value: l
          }))
        }));
      }));
    }
  );
}
function K(n) {
  const t = H(!1), e = H({}), s = H("none"), i = se(), o = O(
    () => s.value === "loading" && (!t.value || n)
  ), r = O(() => s.value === "failed");
  function l(a) {
    a instanceof Oe || (i.failed || (a.log ? a.log("Fetch unhandled:") : console.error("FetchList unhandled failed state: " + a.message)), s.value = "failed", e.value = a instanceof k ? a : a.message);
  }
  return { error: e, state: s, hasLoaded: t, isLoading: o, isFailed: r, handleError: l };
}
const ut = /* @__PURE__ */ he({
  __name: "FetchList",
  props: {
    model: { type: String, required: !0 },
    include: { type: Array, default: () => [] },
    pagination: { type: Object, default: () => ({}) },
    filter: { type: Object, default: () => ({}) },
    sort: { type: Array, default: () => [] },
    mergePages: { type: Boolean, default: !1 },
    loadOnUpdate: { type: Boolean, default: !1 },
    path: { type: String, default: null },
    modelValue: { type: Array, default: null }
  },
  emits: ["ready", "loaded", "update:modelValue"],
  setup(n, { emit: t }) {
    const e = n, s = B("stores"), i = s[e.model](), o = B("cache")(), r = B("models")[e.model], l = se(), a = O(() => ({
      ...r.hasMany,
      ...r.belongsTo
    })), u = O(
      () => JSON.stringify(e.filter) + "|" + JSON.stringify(e.pagination) + "|" + JSON.stringify(e.sort)
    ), { error: c, state: d, hasLoaded: f, isLoading: h, isFailed: y, handleError: p } = K(e.loadOnUpdate), m = H([]), E = H({}), I = O(() => {
      let v = i.list(m.value).sort(
        (x, A) => m.value.indexOf(x.id) - m.value.indexOf(A.id)
      );
      const M = {};
      return e.include.forEach((x) => {
        const A = x in r.hasMany, C = a.value[x](), ee = s[C]();
        M[C] || (M[C] = []), v = v.map((U) => {
          const G = { ...U };
          return A ? (M[C].push(...U[`${x}Ids`]), G[x] = ee.list(U[`${x}Ids`])) : (M[C].push(U[`${x}Id`]), G[x] = ee.single(U[`${x}Id`])), G;
        });
      }), { items: v, includes: M };
    }), T = O(() => I.value.items), g = O(() => I.value.includes);
    function b(v) {
      i.create(v).then((M) => {
        m.value = [...m.value, M.id];
      });
    }
    function _(v) {
      m.value = [...m.value, v];
    }
    const D = O(() => ({
      [e.model + "Items"]: T.value,
      meta: {
        ...E.value,
        refresh: S,
        pushId: _,
        create: b
      }
    }));
    function S() {
      d.value = "loading", i.$list(
        e.filter,
        e.pagination,
        e.sort,
        e.include,
        e.path
      ).then((v) => {
        const M = v.items.map((x) => x.id);
        m.value = e.mergePages ? [...m.value, ...M] : M, E.value = v.meta, d.value = "none", f.value = !0;
      }).catch(p);
    }
    return S(), F(u, () => {
      S();
    }), F(m, (v, M) => {
      o.subscribe(e.model, v), o.unsubscribe(e.model, M);
    }), F(g, (v, M) => {
      Object.keys(v).forEach((x) => {
        o.subscribe(x, v[x]);
      }), Object.keys(M).forEach((x) => {
        o.unsubscribe(x, M[x]);
      });
    }), ne(() => {
      o.unsubscribe(e.model, m.value), Object.keys(g.value).forEach((v) => {
        o.unsubscribe(v, g.value[v]);
      });
    }), t("ready", {
      refresh: S,
      pushId: _,
      create: b
    }), F(d, (v, M) => {
      M === "loading" && v === "none" && t("loaded", T.value);
    }), F(T, (v) => {
      e.modelValue && t("update:modelValue", v);
    }), (v, M) => N(l).all ? V(v.$slots, "all", Q(W({ key: 0 }, { ...N(D), isLoading: N(h), isFailed: N(y), error: N(c) }))) : N(h) ? V(v.$slots, "loading", { key: 1 }) : N(y) ? V(v.$slots, "failed", {
      key: 2,
      error: N(c)
    }) : V(v.$slots, "default", Q(W({ key: 3 }, N(D))));
  }
}), ht = /* @__PURE__ */ he({
  __name: "FetchSingle",
  props: {
    model: { type: String, required: !0 },
    id: { type: [Number, String], required: !0 },
    lazy: { type: Boolean, default: !1 },
    include: { type: Array, default: () => [] },
    loadOnUpdate: { type: Boolean, default: !1 },
    path: { type: String, default: null },
    modelValue: { type: Object, default: void 0 }
  },
  emits: ["loaded", "update:modelValue"],
  setup(n, { emit: t }) {
    const e = n, s = H({}), i = B("stores"), o = i[e.model](), r = B("models")[e.model], l = O(() => ({
      ...r.hasMany,
      ...r.belongsTo
    })), a = se(), { error: u, state: c, hasLoaded: d, isLoading: f, isFailed: h, handleError: y } = K(e.loadOnUpdate);
    function p() {
      c.value = "loading", o.$single(e.id, e.include, e.path).then((g) => {
        d.value = !0, c.value = "none";
        const b = {};
        g.included && Object.keys(g.included).forEach((_) => {
          b[_] = g.included[_].map((D) => D.id);
        }), s.value = b;
      }).catch(y);
    }
    const m = O(() => {
      const g = { ...o.single(e.id) };
      return e.include.forEach((b) => {
        const _ = b in r.hasMany, D = i[l.value[b]()]();
        _ ? g[b] = D.items.filter(
          (S) => g[b + "Ids"].includes(S.id)
        ) : g[b] = D.items.find(
          (S) => g[b + "Id"] === S.id
        );
      }), g;
    }), E = O(() => ({
      [e.model]: m.value
    })), I = B("cache")();
    function T(g, b) {
      I.subscribe(e.model, [g]), I.unsubscribe(e.model, [b]);
    }
    return e.lazy || p(), I.subscribe(e.model, [e.id]), F(
      () => e.id,
      (g, b) => {
        T(g, b), e.lazy || p();
      }
    ), F(s, (g, b) => {
      Object.keys(g).forEach((_) => {
        I.subscribe(_, g[_]);
      }), Object.keys(b).forEach((_) => {
        I.unsubscribe(_, b[_]);
      });
    }), F(c, (g, b) => {
      b === "loading" && g === "none" && t("loaded", m.value);
    }), F(m, (g) => {
      e.modelValue !== void 0 && t("update:modelValue", g);
    }), ne(() => {
      I.unsubscribe(e.model, [e.id]), Object.keys(s.value).forEach((g) => {
        I.unsubscribe(g, s.value[g]);
      });
    }), (g, b) => N(a).all ? V(g.$slots, "all", Q(W({ key: 0 }, { ...N(E), isLoading: N(f), isFailed: N(h), error: N(u) }))) : N(f) ? V(g.$slots, "loading", { key: 1 }) : N(h) ? V(g.$slots, "failed", {
      key: 2,
      error: N(u)
    }) : V(g.$slots, "default", Q(W({ key: 3 }, N(E))));
  }
}), ft = /* @__PURE__ */ he({
  __name: "FetchSingleton",
  props: {
    model: { type: String, required: !0 },
    filter: { type: Object, default: () => ({}) },
    loadOnUpdate: { type: Boolean, default: !1 },
    path: { type: String, default: null },
    modelValue: { type: Object, default: null }
  },
  emits: ["loaded", "update:modelValue"],
  setup(n, { emit: t }) {
    const e = n, s = B("stores")[e.model](), i = se(), { error: o, state: r, hasLoaded: l, isLoading: a, isFailed: u, handleError: c } = K(e.loadOnUpdate);
    function d() {
      r.value = "loading", s.$fetch(e.filter, e.path).then((p) => {
        l.value = !0, r.value = "none";
      }).catch(c);
    }
    const f = O(() => s.item), h = O(() => ({
      [e.model]: f.value
    })), y = O(() => JSON.stringify(e.filter));
    return d(), F(y, d), F(r, (p, m) => {
      m === "loading" && p === "none" && t("loaded", f.value);
    }), F(f, (p) => {
      e.modelValue !== void 0 && t("update:modelValue", p);
    }), (p, m) => N(i).all ? V(p.$slots, "all", Q(W({ key: 0 }, { ...N(h), isLoading: N(a), isFailed: N(u), error: N(o) }))) : N(a) ? V(p.$slots, "loading", { key: 1 }) : N(u) ? V(p.$slots, "failed", {
      key: 2,
      error: N(o)
    }) : V(p.$slots, "default", Q(W({ key: 3 }, N(h))));
  }
}), we = { "Content-Type": "application/json" }, Ie = {}, q = {
  error: null
};
function te(n, t, { params: e, body: s }, i = {}, o) {
  const r = e ? new URLSearchParams(e).toString() : "", l = r ? t + "?" + r : t, a = { ...we, ...i };
  let u = s;
  return u instanceof FormData ? o ? a["Content-Type"] = "multipart/form-data" : delete a["Content-Type"] : a["Content-Type"] === "application/json" && u && (u = JSON.stringify(u)), o ? o.handleRequest(n, l, u, a).catch((c) => {
    throw q.error && q.error(c), c;
  }) : fetch(l, {
    ...Ie,
    method: n,
    headers: a,
    body: u
  }).then(async (c) => {
    let d = {};
    try {
      d = await c.json();
    } catch {
    }
    if (c.ok)
      return d;
    throw new k(c.status, d);
  }).catch((c) => {
    throw q.error && q.error(c), c;
  });
}
function pt(n) {
  return {
    intercept: q,
    headers: we,
    requestOptions: Ie,
    get(t, e, s) {
      return te("GET", t, { params: e }, s, n);
    },
    post(t, e, s, i) {
      return te("POST", t, { body: e, params: s }, i, n);
    },
    patch(t, e, s, i) {
      return te("PATCH", t, { body: e, params: s }, i, n);
    },
    delete(t, e, s, i) {
      return te("DELETE", t, { body: e, params: s }, i, n);
    }
  };
}
function R(n) {
  if (Array.isArray(n))
    return n.map(R);
  if (typeof n == "object") {
    if (!n)
      return n;
    if ("value" in n)
      return R(n.value);
    const t = {};
    return Object.entries(n).forEach(([e, s]) => {
      t[e] = R(s);
    }), t;
  }
  return n;
}
function mt(n, t, e) {
  return function(i, o = {}) {
    const r = t[i](), l = e(), a = H([]), u = H(
      {}
    ), c = H(""), d = n[i], f = O(
      () => o.filter ? R(o.filter) : {}
    ), h = O(
      () => o.pagination ? R(o.pagination) : {}
    ), y = O(() => o.sort ? R(o.sort) : {}), p = O(
      () => o.include ? R(o.include) : []
    ), m = O(() => o.path ? R(o.path) : null), E = O(
      () => o.lazy !== void 0 ? R(o.lazy) : !1
    ), I = O(() => !E.value), T = H(null), g = H(void 0), { error: b, state: _, hasLoaded: D, isLoading: S, isFailed: v, handleError: M } = K(!!o.loadOnUpdate);
    d.includable && p.value.forEach((P) => {
      if (!d.includable.includes(P))
        throw new Error(
          `Vroom: model ${i} does not have an includable relation ${P}`
        );
    });
    const x = Math.random() * performance.now();
    function A() {
      if (o.throttle) {
        const P = Date.now();
        if (T.value && clearTimeout(T.value), g.value && P - g.value < o.throttle)
          return T.value = setTimeout(() => {
            C();
          }, o.throttle - (P - g.value)), !1;
        g.value = P;
      }
      return !0;
    }
    function C() {
      A() && (_.value = "loading", r.$list(
        f.value,
        h.value,
        y.value,
        p.value,
        m.value,
        x
      ).then((P) => {
        const L = c.value !== JSON.stringify(h.value);
        c.value = JSON.stringify(h.value);
        const $ = P.items.map((X) => X.id);
        a.value = o.mergePages && L ? [...a.value, ...$] : $, _.value = "none", u.value = P.meta, D.value = !0;
      }).catch(M));
    }
    I.value && C();
    const ee = O(
      () => JSON.stringify(f.value) + "|" + JSON.stringify(h.value) + "|" + JSON.stringify(y.value)
    );
    F(ee, () => {
      I.value && C();
    }), F(I, () => {
      I.value && C();
    });
    const U = O(() => ({
      ...d.hasMany,
      ...d.belongsTo
    })), G = O(() => {
      let P = r.list(a.value).sort(
        ($, X) => a.value.indexOf($.id) - a.value.indexOf(X.id)
      );
      const L = {};
      return p.value.forEach(($) => {
        const X = $ in d.hasMany, Y = U.value[$](), me = t[Y]();
        L[Y] || (L[Y] = []), P = P.map((Z) => {
          const oe = { ...Z };
          return X ? (L[Y].push(...Z[j.addHasManyPostFix($)]), oe[$] = me.list(
            Z[j.addHasManyPostFix($)]
          )) : (L[Y].push(Z[j.addBelongsToPostFix($)]), oe[$] = me.single(
            Z[j.addBelongsToPostFix($)]
          )), oe;
        });
      }), { items: P, includedIds: L };
    }), Me = O(() => {
      const { items: P } = G.value;
      return P;
    }), ie = O(() => {
      const { includedIds: P } = G.value;
      return P;
    }), pe = (P) => {
      a.value = [...a.value, P];
    }, Te = (P) => r.create(P).then((L) => (pe(L.id), L));
    return F(a, (P, L) => {
      l.subscribe(i, P), l.unsubscribe(i, L);
    }), F(ie, (P, L) => {
      Object.keys(P).forEach(($) => {
        l.subscribe($, P[$]);
      }), Object.keys(L).forEach(($) => {
        l.unsubscribe($, L[$]);
      });
    }), ne(() => {
      l.unsubscribe(i, a.value), Object.keys(ie.value).forEach((P) => {
        l.unsubscribe(P, ie.value[P]);
      });
    }), {
      items: Me,
      create: Te,
      pushId: pe,
      refresh: C,
      isLoading: S,
      isFailed: v,
      error: b,
      meta: u
    };
  };
}
function gt(n, t, e) {
  return function(i, o, r = {}) {
    const l = t[i](), a = e(), u = H({}), c = n[i], d = O(() => R(o)), f = O(
      () => r.include ? R(r.include) : []
    ), h = O(() => r.path ? R(r.path) : null), y = O(() => !(r.lazy || r.preferCache && l.single(d.value)));
    c.includable && f.value.forEach((S) => {
      if (!c.includable.includes(S))
        throw new Error(
          `Vroom: model ${i} does not have an includable relation ${S}`
        );
    });
    const { error: p, state: m, hasLoaded: E, isLoading: I, isFailed: T, handleError: g } = K(!!r.loadOnUpdate);
    function b() {
      m.value = "loading", l.$single(d.value, f.value, h.value).then((S) => {
        m.value = "none";
        const v = {};
        S.included && Object.keys(S.included).forEach((M) => {
          v[M] = S.included[M].map((x) => x.id);
        }), u.value = v, E.value = !0;
      }).catch(g);
    }
    y.value && b(), a.subscribe(i, [d.value]), F(d, (S, v) => {
      a.subscribe(i, [S]), a.unsubscribe(i, [v]), y.value && b();
    });
    const _ = O(() => ({
      ...c.hasMany,
      ...c.belongsTo
    })), D = O(() => {
      const S = { ...l.single(d.value) };
      return f.value.forEach((v) => {
        const M = v in c.hasMany, x = t[_.value[v]()]();
        if (M) {
          if (!S[j.addHasManyPostFix(v)])
            return;
          S[v] = x.items.filter(
            (A) => S[j.addHasManyPostFix(v)].includes(A.id)
          );
        } else {
          if (!S[j.addBelongsToPostFix(v)])
            return;
          S[v] = x.items.find(
            (A) => S[j.addBelongsToPostFix(v)] === A.id
          );
        }
      }), S;
    });
    return F(u, (S, v) => {
      Object.keys(S).forEach((M) => {
        a.subscribe(M, S[M]);
      }), Object.keys(v).forEach((M) => {
        a.unsubscribe(M, v[M]);
      });
    }), ne(() => {
      a.unsubscribe(i, [d.value]), Object.keys(u.value).forEach((S) => {
        a.unsubscribe(S, u.value[S]);
      });
    }), {
      item: D,
      refresh: b,
      isLoading: I,
      isFailed: T,
      error: p
    };
  };
}
function yt(n) {
  return function(e, s = {}) {
    const i = n[e](), o = O(
      () => s.filter ? R(s.filter) : {}
    ), r = O(() => s.path ? R(s.path) : null), { error: l, state: a, hasLoaded: u, isLoading: c, isFailed: d, handleError: f } = K(!!s.loadOnUpdate);
    function h() {
      a.value = "loading", i.$fetch(o.value, r.value).then((m) => {
        a.value = "none", u.value = !0;
      }).catch(f);
    }
    h();
    const y = O(() => JSON.stringify(o.value));
    return F(y, h), {
      item: O(() => i.item),
      refresh: h,
      isLoading: c,
      isFailed: d,
      error: l
    };
  };
}
function vt(n) {
  return {
    create: (t, e) => n[t]().create(e),
    update: (t, e, s) => n[t]().update(e, s),
    delete: (t, e) => n[t]().delete(e),
    get: (t, e, s) => {
      const i = (s == null ? void 0 : s.include) || [];
      return n[t]().$single(e, i);
    },
    getSingleton: (t, e) => n[t]().$fetch(e || {}),
    updateSingleton: (t, e, s) => n[t]().update(e, s || {}),
    list: (t, e) => {
      const s = (e == null ? void 0 : e.filter) || {}, i = (e == null ? void 0 : e.pagination) || {}, o = (e == null ? void 0 : e.sort) || {}, r = (e == null ? void 0 : e.include) || [];
      return n[t]().$list(s, i, o, r);
    }
  };
}
let le, ve = [];
function wt(n) {
  var u, c, d, f;
  const { models: t, ...e } = n, s = {
    data: ((u = n.naming) == null ? void 0 : u.data) || "data",
    dataSingle: ((c = n.naming) == null ? void 0 : c.dataSingle) || "data",
    included: ((d = n.naming) == null ? void 0 : d.included) || "included",
    meta: ((f = n.naming) == null ? void 0 : f.meta) || "meta"
  };
  e.naming = s, e.useSnakeCase && j.setCasing("snake");
  const i = process.env.NODE_ENV !== "production" ? _e(n) : null, o = process.env.NODE_ENV !== "production" ? We(e, t, i) : null, r = pt(o), l = tt(
    t,
    e.baseURL,
    s,
    r
  ), a = st(l);
  return process.env.NODE_ENV !== "production" && o && (le ? ye(le, i, o) : ve.push([i, o])), {
    api: r,
    db: i,
    settings: e,
    server: o,
    stores: l,
    cache: a,
    types: {},
    useList: mt(
      t,
      l,
      a
    ),
    useSingle: gt(
      t,
      l,
      a
    ),
    useSingleton: yt(l),
    ...vt(l),
    install(h) {
      h.provide("stores", l), h.provide("models", t), h.provide("cache", a), h.provide("vroomTypes", {}), h.component("FetchList", ut), h.component("FetchSingle", ht), h.component("FetchSingleton", ft), process.env.NODE_ENV !== "production" && o && ve.forEach((y) => ye(h, y[0], y[1])), le = h;
    }
  };
}
export {
  k as ServerError,
  wt as createVroom,
  St as defineModel
};

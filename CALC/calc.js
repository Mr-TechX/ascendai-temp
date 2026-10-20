(function () {
  var M = [
    {
      n: "Inmobiliaria",
      v: [300, 2, 3, 5000],
      t: [
        "Consultas al mes (anuncios y portales)",
        "Cierre actual (% de consultas que terminan en venta)",
        "Cierre objetivo (%)",
        "Comisión promedio por venta",
      ],
      r: [
        [0, 2000, 10],
        [0, 20, 0.1],
        [0, 30, 0.1],
        [0, 30000, 250],
      ],
    },
    {
      n: "SaaS",
      v: [200, 6, 10, 4000],
      t: [
        "Prospectos al mes",
        "Cierre actual (% de prospectos que se vuelven clientes)",
        "Cierre objetivo (%)",
        "Valor promedio por cliente (contrato)",
      ],
      r: [
        [0, 2000, 10],
        [0, 50, 0.1],
        [0, 60, 0.1],
        [0, 50000, 250],
      ],
    },
  ];
  var cur = 0,
    ids = ["a", "b", "c", "d"];
  var reduce =
    window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(i) {
    return document.getElementById(i);
  }
  function f(n) {
    return "$" + Math.round(n).toLocaleString("es-MX");
  }
  function paint(r) {
    var mn = +r.min,
      mx = +r.max,
      v = +r.value;
    r.style.setProperty("--p", ((v - mn) / (mx - mn || 1)) * 100 + "%");
  }
  function syncRange(i) {
    var r = $("r" + ids[i]),
      v = +$(ids[i]).value || 0;
    if (v > +r.max) r.max = v;
    r.value = v;
    paint(r);
  }
  var shown = 0,
    anim = null;
  function tween(to) {
    if (reduce) {
      $("m").textContent = f(to);
      shown = to;
      return;
    }
    if (anim) cancelAnimationFrame(anim);
    var from = shown,
      t0 = performance.now(),
      d = 600;
    (function k(t) {
      var p = Math.min(1, (t - t0) / d),
        e = 1 - Math.pow(1 - p, 3);
      shown = from + (to - from) * e;
      $("m").textContent = f(shown);
      if (p < 1) anim = requestAnimationFrame(k);
    })(t0);
  }
  function mode(k) {
    cur = k;
    $("m0").setAttribute("aria-pressed", !k);
    $("m1").setAttribute("aria-pressed", !!k);
    $("tabs").className = "tabs" + (k ? " k1" : "");
    for (var i = 0; i < 4; i++) {
      var r = $("r" + ids[i]);
      r.min = M[k].r[i][0];
      r.max = M[k].r[i][1];
      r.step = M[k].r[i][2];
      $("l" + (i + 1)).textContent = M[k].t[i];
      $(ids[i]).value = M[k].v[i];
      syncRange(i);
    }
    calc();
  }
  function calc() {
    var a = +$("a").value || 0,
      b = +$("b").value || 0,
      c = +$("c").value || 0,
      d = +$("d").value || 0;
    var diff = Math.max(c - b, 0) / 100,
      vx = a * diff,
      m = vx * d;
    $("msg").textContent =
      c < b ? "Tu cierre objetivo debe ser mayor al actual." : "";
    tween(m);
    $("y").textContent = f(m * 12);
    $("v").textContent = vx.toFixed(1);
    $("h").textContent = f(m / 2);
    var s1 = (a * b) / 100,
      s2 = (a * Math.max(c, b)) / 100,
      mx = Math.max(s2, 0.0001);
    $("b1").style.width = Math.max((s1 / mx) * 100, 3) + "%";
    $("b2").style.width = "100%";
    $("s1").textContent = s1.toFixed(1);
    $("s2").textContent = s2.toFixed(1);
    var t =
      "Hola, usé la calculadora de Revenue Leak de Ascend AI (" +
      M[cur].n +
      "): " +
      a +
      " al mes, cierre " +
      b +
      "% a " +
      c +
      "%, valor " +
      f(d) +
      ". Mi fuga estimada es " +
      f(m) +
      " al mes. Quiero mi diagnóstico gratis.";
    $("cta").href = "https://wa.me/525519071789?text=" + encodeURIComponent(t);
  }
  $("m0").onclick = function () {
    mode(0);
  };
  $("m1").onclick = function () {
    mode(1);
  };
  ids.forEach(function (id, i) {
    $(id).oninput = function () {
      syncRange(i);
      calc();
    };
    $("r" + id).oninput = function () {
      $(id).value = this.value;
      paint(this);
      calc();
    };
  });
  var big = $("m");
  big.addEventListener("animationend", function () {
    big.classList.remove("bump");
  });
  document.querySelectorAll("input").forEach(function (el) {
    el.addEventListener("change", function () {
      big.classList.remove("bump");
      void big.offsetWidth;
      big.classList.add("bump");
    });
  });
  mode(0);
})();

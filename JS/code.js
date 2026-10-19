/*
 *|++++++++++++++++++++++++++++++++++++++++++++++++++|
 *| AUTHOR: TecnoProjects Security                   |
 *| PROJECT: Ascend AI Landing Page                  |
 *| VERSION: 2.0.0                                   |
 *| LAST UPDATE: 18/OCT/2026                         |
 *|++++++++++++++++++++++++++++++++++++++++++++++++++|
 *|                      NOTE                        |
 *|++++++++++++++++++++++++++++++++++++++++++++++++++|
 *| If you find any vulnerabilities on this platform,| 
 *| please contact us at the following email address:|
 *|                                                  |
 *| · TecnoProjects.Sec@proton.me                    |
 *|                                                  |
 *| Your findings will be rewarded.                  |
 *|                                                  |
 *| - TPS Security Team                              |
 *|++++++++++++++++++++++++++++++++++++++++++++++++++|
 */
(function () {
  var reduce =
    window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fondo del hero: partículas que ascienden con estela
  var cv = document.getElementById("sky"),
    ctx = cv.getContext("2d"),
    P = [],
    W = 0,
    H = 0,
    dpr = 1;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth;
    H = cv.clientHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, W / 14));
    P = [];
    for (var i = 0; i < n; i++) P.push(spawn(true));
  }
  function spawn(any) {
    return {
      x: Math.random() * W,
      y: any ? Math.random() * H : H + 20,
      v: 0.25 + Math.random() * 0.9,
      l: 20 + Math.random() * 70,
      a: 0.15 + Math.random() * 0.5,
      c: Math.random() < 0.6 ? "2,213,243" : "60,110,255",
    };
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      var g = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.l);
      g.addColorStop(0, "rgba(" + p.c + "," + p.a + ")");
      g.addColorStop(1, "rgba(" + p.c + ",0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + p.l);
      ctx.stroke();
      ctx.fillStyle = "rgba(" + p.c + "," + Math.min(1, p.a + 0.3) + ")";
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      p.y -= p.v;
      if (p.y + p.l < 0) P[i] = spawn(false);
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  size();
  frame();
  window.addEventListener("resize", size);

  // Brillo que sigue al cursor en tarjetas
  document.querySelectorAll(".card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // Conteo animado al entrar en pantalla (el valor final ya está escrito en la página)
  function fmt(n) {
    return Math.round(n).toLocaleString("en-US");
  }
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          var el = e.target,
            to = +el.dataset.count,
            pre = el.dataset.prefix || "",
            suf = el.dataset.suffix || "",
            t0 = performance.now(),
            d = 1400;
          (function tick(t) {
            var k = Math.min(1, (t - t0) / d),
              ease = 1 - Math.pow(1 - k, 3);
            el.textContent = pre + fmt(to * ease) + suf;
            if (k < 1) requestAnimationFrame(tick);
          })(t0);
        });
      },
      { threshold: 0.6 },
    );
    document.querySelectorAll("[data-count]").forEach(function (el) {
      io.observe(el);
    });
  }
})();

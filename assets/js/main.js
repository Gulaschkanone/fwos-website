document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});

// Organigramm: connector lines drawn from actual box positions (SVG overlay),
// so they stay straight and unbroken regardless of text length/wrapping.
(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var STACK_BREAKPOINT = 820;

  function rectRelativeTo(el, root) {
    var r = el.getBoundingClientRect();
    var rootRect = root.getBoundingClientRect();
    var left = r.left - rootRect.left;
    var top = r.top - rootRect.top;
    return {
      top: top,
      bottom: top + r.height,
      left: left,
      right: left + r.width,
      centerX: left + r.width / 2,
      centerY: top + r.height / 2
    };
  }

  function makeLine(x1, y1, x2, y2) {
    var el = document.createElementNS(SVG_NS, "line");
    el.setAttribute("x1", Math.round(x1));
    el.setAttribute("y1", Math.round(y1));
    el.setAttribute("x2", Math.round(x2));
    el.setAttribute("y2", Math.round(y2));
    return el;
  }

  function drawOrgChart() {
    var root = document.getElementById("orgchart");
    if (!root) return;
    var svg = root.querySelector(".orgchart-svg");
    if (!svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    svg.setAttribute("width", root.clientWidth);
    svg.setAttribute("height", root.scrollHeight);

    if (window.innerWidth <= STACK_BREAKPOINT) return;

    var command = root.querySelector('[data-og-role="command"]');
    var cols = Array.prototype.slice.call(root.querySelectorAll(".orgchart-col"));
    var magazin = root.querySelector('[data-og-role="magazin"]');
    if (!command || !cols.length) return;

    var cmdRect = rectRelativeTo(command, root);

    var colInfo = cols.map(function (col) {
      var blocks = Array.prototype.slice.call(
        col.querySelectorAll(":scope > .orgchart-node, :scope > .orgchart-node-pair")
      );
      var title = col.querySelector(".orgchart-col-title");
      if (!blocks.length) return null;
      return {
        blocks: blocks.map(function (b) { return rectRelativeTo(b, root); }),
        titleBottom: title ? rectRelativeTo(title, root).bottom : cmdRect.bottom
      };
    });
    if (colInfo.indexOf(null) !== -1) return;

    // Horizontal branch sits below the lowest column title, so no line
    // ever crosses a title label.
    var barY = Math.max.apply(
      null,
      colInfo.map(function (c) { return c.titleBottom; })
    ) + 10;

    var firstBlockRects = colInfo.map(function (c) { return c.blocks[0]; });
    var firstX = firstBlockRects[0].centerX;
    var lastX = firstBlockRects[firstBlockRects.length - 1].centerX;

    // Trunk: command -> branch bar
    svg.appendChild(makeLine(cmdRect.centerX, cmdRect.bottom, cmdRect.centerX, barY));
    // Branch bar spanning the outer columns
    svg.appendChild(makeLine(firstX, barY, lastX, barY));
    // Stems: bar -> each column's first box
    firstBlockRects.forEach(function (rect) {
      svg.appendChild(makeLine(rect.centerX, barY, rect.centerX, rect.top));
    });

    // Spine within each column, connecting stacked boxes (drawn behind the
    // opaque cards, so it only shows in the gaps between them).
    colInfo.forEach(function (c) {
      if (c.blocks.length < 2) return;
      var x = c.blocks[0].centerX;
      var topY = c.blocks[0].centerY;
      var bottomY = c.blocks[c.blocks.length - 1].centerY;
      svg.appendChild(makeLine(x, topY, x, bottomY));
    });

    // Middle column -> Magazin
    if (magazin) {
      var middle = colInfo[Math.floor(colInfo.length / 2)];
      var lastBlock = middle.blocks[middle.blocks.length - 1];
      var magRect = rectRelativeTo(magazin, root);
      // Senkrecht von der mittleren Spalte nach unten (Magazin ist breiter und darunter zentriert)
      svg.appendChild(
        makeLine(lastBlock.centerX, lastBlock.bottom, lastBlock.centerX, magRect.top)
      );
    }
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    drawOrgChart();
    window.addEventListener("load", drawOrgChart);
    window.addEventListener("resize", debounce(drawOrgChart, 150));
  });
})();

// Bildergalerie und Einzelbilder: Klick auf ein Bild öffnet es gross (Pfeiltasten blättern, Esc schliesst).
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var links = Array.prototype.slice.call(document.querySelectorAll(".galerie-bild, .bild-link"));
    if (!links.length || typeof HTMLDialogElement === "undefined") return;

    var dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.innerHTML =
      '<img alt="">' +
      '<p class="lightbox-caption"></p>' +
      '<div class="lightbox-bar">' +
      '<button type="button" data-step="-1" aria-label="Vorheriges Bild">&larr;</button>' +
      '<button type="button" data-close aria-label="Schliessen">&times;</button>' +
      '<button type="button" data-step="1" aria-label="Nächstes Bild">&rarr;</button>' +
      "</div>";
    document.body.appendChild(dialog);
    var img = dialog.querySelector("img");
    var caption = dialog.querySelector(".lightbox-caption");
    var current = 0;

    function show(i) {
      current = (i + links.length) % links.length;
      img.src = links[current].href;
      img.alt = links[current].querySelector("img").alt;
      caption.textContent = links[current].getAttribute("data-caption") || "";
    }

    if (links.length < 2) {
      dialog.querySelectorAll("[data-step]").forEach(function (b) { b.hidden = true; });
    }

    links.forEach(function (link, i) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        show(i);
        dialog.showModal();
      });
    });

    dialog.addEventListener("click", function (e) {
      var step = e.target.getAttribute("data-step");
      if (step) show(current + parseInt(step, 10));
      else if (e.target === dialog || e.target.hasAttribute("data-close")) dialog.close();
    });

    document.addEventListener("keydown", function (e) {
      if (!dialog.open) return;
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  });
})();

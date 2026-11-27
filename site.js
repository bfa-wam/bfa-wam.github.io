"use strict";

document.documentElement.classList.add("js-enabled");

function element(tag, text, className) {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (className) item.className = className;
  return item;
}

function setResource(id, label, url) {
  if (!url) return;
  const link = element("a", label, "resource-link secondary");
  link.href = url;
  document.getElementById(id).replaceWith(link);
}

function renderPublication() {
  const { authors, affiliations, title, year, citationKey, codeUrl } = publication;
  const arxivId = publication.arxivId.trim()
    .replace(/^https?:\/\/(?:www\.)?arxiv\.org\/(?:abs|pdf)\//i, "")
    .replace(/^arxiv:\s*/i, "").replace(/\.pdf$/i, "");
  const arxivUrl = arxivId ? "https://arxiv.org/abs/" + arxivId : "";
  setResource("arxiv-resource", "arXiv", arxivUrl);
  setResource("code-resource", "Code", codeUrl);

  document.querySelector('meta[name="author"]').content = authors.map(author => author.name).join(", ");
  const byline = document.getElementById("authors");
  byline.textContent = authors.length ? "" : "Author names forthcoming";
  authors.forEach((author, index) => {
    const name = element(author.url ? "a" : "span", author.name);
    if (author.url) name.href = author.url;
    let marker = author.affiliations?.join(",") || "";
    if (author.corresponding) {
      marker += "*";
      name.setAttribute("aria-describedby", "author-note");
    }
    if (marker) name.append(element("sup", marker));
    if (index) byline.append(", ");
    byline.append(name);
  });
  document.getElementById("author-note").hidden = !authors.some(author => author.corresponding);

  const affiliationList = document.getElementById("affiliations");
  affiliationList.textContent = affiliations.length ? "" : "Affiliations forthcoming";
  affiliations.forEach((affiliation, index) => {
    const item = element("span");
    item.append(element("sup", String(index + 1)), " " + affiliation);
    affiliationList.append(item);
  });

  const fields = [];
  if (authors.length) fields.push(["author", authors.map(author => author.bibtexName || author.name).join(" and ")]);
  fields.push(["title", title.replace("BFA-WAM", "{BFA-WAM}")], ["year", year]);
  if (arxivId) {
    fields.push(["eprint", arxivId], ["archivePrefix", "arXiv"], ["url", arxivUrl]);
  } else {
    fields.push(["note", "Manuscript"]);
  }
  const lines = fields.map(([label, value]) => "  " + label + " = {" + value + "}");
  document.getElementById("bibtex").textContent = "@misc{" + citationKey + ",\n" + lines.join(",\n") + "\n}";
  const missing = [];
  if (!authors.length) missing.push("author names");
  if (!arxivId) missing.push("the arXiv identifier");
  document.getElementById("citation-status").textContent = missing.length
    ? "The citation will be updated with " + missing.join(" and ") + "."
    : "Bibliographic details for the paper.";
}

function initBottleDemo() {
  const demo = document.querySelector(".bottle-demo");
  const buttons = [...demo.querySelectorAll("[data-step]")];
  const frames = [...demo.querySelectorAll("[data-bottle]")].map(img => ({
    img,
    kind: img.dataset.bottle,
    caption: demo.querySelector('[data-bottle-label="' + img.dataset.bottle + '"]')
  }));
  for (const button of buttons) {
    button.addEventListener("click", () => {
      if (button.getAttribute("aria-pressed") === "true") return;
      const step = Number(button.dataset.step);
      const start = step - 4;
      const labels = {
        "rgb-forecast": ["Predicted RGB at " + step, "RGB forecast of the bottle at step " + step],
        "rgb-observed": ["Observed at " + step, "RGB-conditioned execution at step " + step + ", with the bottle near the dashed reference line"],
        "flow-forecast": ["Predicted flow " + start + "–" + step, "Forecast of gripper and bottle motion over steps " + start + " to " + step],
        "flow-observed": ["Observed at " + step, "BFA-WAM execution at step " + step + ", with the bottle above the dashed reference line"]
      };
      for (const { img, kind, caption } of frames) {
        img.src = "assets/bottle/" + kind + "-" + step + ".png";
        img.alt = labels[kind][1];
        caption.textContent = labels[kind][0];
      }
      document.getElementById("replan-step").textContent = String(step - 20);
      document.getElementById("target-step").textContent = String(step);
      const observations = {
        60: "By step 60, BFA-WAM has lifted the bottle above the line.",
        70: "At step 70, the BFA-WAM gripper still holds the bottle above the line.",
        80: "By step 80, BFA-WAM has carried the bottle over the cabinet."
      };
      document.getElementById("bottle-observation").textContent = observations[step];
      for (const option of buttons) option.setAttribute("aria-pressed", String(option === button));
    });
  }
}

function initGallery() {
  const viewer = document.getElementById("frame-viewer");
  if (typeof viewer.showModal !== "function") return;
  const image = document.getElementById("viewer-image");
  const title = document.getElementById("viewer-title");
  const status = document.getElementById("viewer-position");
  const previous = document.getElementById("previous-frame");
  const next = document.getElementById("next-frame");
  let frames = [];
  let current = 0;
  let trigger;

  function show(index) {
    if (index < 0 || index >= frames.length) return;
    current = index;
    const link = frames[index];
    image.src = link.href;
    image.alt = link.querySelector("img").alt;
    title.textContent = link.closest(".filmstrip").dataset.policy + " · " + link.querySelector("span").textContent;
    status.textContent = "Frame " + (index + 1) + " of " + frames.length;
    const focusedControl = document.activeElement;
    previous.disabled = index === 0;
    next.disabled = index === frames.length - 1;
    if (focusedControl === next && next.disabled) previous.focus();
    if (focusedControl === previous && previous.disabled) next.focus();
  }

  document.querySelector(".filmstrips").addEventListener("click", event => {
    const link = event.target.closest(".frame-grid a");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    frames = [...link.closest(".frame-grid").querySelectorAll("a")];
    show(frames.indexOf(link));
    viewer.showModal();
    document.getElementById("close-viewer").focus();
  });
  previous.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  document.getElementById("close-viewer").addEventListener("click", () => viewer.close());
  viewer.addEventListener("close", () => trigger?.focus({ preventScroll: true }));
  viewer.addEventListener("click", event => {
    if (event.target !== viewer) return;
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  });
  viewer.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(current + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
}

function drawComparison(benchmark) {
  const chart = document.getElementById("comparison-chart");
  const policies = ["BFA-WAM", "Fast-WAM"].map(name => benchmark.rows.find(row => row.name === name));
  const scale = element("div", undefined, "chart-scale");
  scale.setAttribute("aria-hidden", "true");
  const ticks = element("div");
  for (const tick of ["0", "50", "100%"]) ticks.append(element("span", tick));
  scale.append(ticks);
  chart.replaceChildren(scale);

  benchmark.conditions.forEach((condition, index) => {
    const row = element("div", undefined, "chart-row");
    row.setAttribute("role", "img");
    const description = policies.map(policy => policy.name + " " + policy.scores[index].toFixed(1) + "%");
    row.setAttribute("aria-label", condition + ". " + description.join(", ") + ".");
    const pair = element("div", undefined, "bar-pair");
    policies.forEach((policy, policyIndex) => {
      const bar = element("div", undefined, "bar-line");
      const track = element("div", undefined, "bar-track");
      const mark = element("span", undefined, policyIndex ? "bar baseline" : "bar");
      mark.style.width = policy.scores[index] + "%";
      track.append(mark);
      bar.append(track, element("span", policy.scores[index].toFixed(1), "bar-value"));
      pair.append(bar);
    });
    row.append(element("span", condition, "condition"), pair);
    chart.append(row);
  });
}

function drawBenchmarkTable(benchmark) {
  const table = document.getElementById("benchmark-table");
  table.replaceChildren();
  table.createCaption().textContent = benchmark.name + " task success rates (%)";
  const header = table.createTHead().insertRow();
  const labels = ["Method", "Embodied pretraining", ...benchmark.conditions, benchmark.aggregate];
  for (const label of labels) {
    const th = element("th", label);
    th.scope = "col";
    header.append(th);
  }
  const body = table.createTBody();
  for (const policy of benchmark.rows) {
    const row = body.insertRow();
    if (policy.name === "BFA-WAM") row.className = "our-row";
    const name = element("th", policy.name);
    name.scope = "row";
    row.append(name, element("td", policy.pretrained ? "Yes" : "No"));
    for (const score of policy.scores) row.append(element("td", score.toFixed(1)));
  }
  document.getElementById("table-note").textContent = benchmark.note;
}

function initBenchmarks() {
  const tabs = [...document.querySelectorAll("[data-benchmark]")];
  function select(tab) {
    const benchmark = benchmarks[tab.dataset.benchmark];
    for (const item of tabs) {
      item.setAttribute("aria-selected", String(item === tab));
      item.tabIndex = item === tab ? 0 : -1;
    }
    document.getElementById("benchmark-panel").setAttribute("aria-labelledby", tab.id);
    document.getElementById("chart-title").textContent = benchmark.title;
    document.getElementById("chart-context").textContent = benchmark.context;
    drawComparison(benchmark);
    drawBenchmarkTable(benchmark);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", event => {
      const destinations = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1
      };
      if (!(event.key in destinations)) return;
      event.preventDefault();
      const next = tabs[destinations[event.key]];
      next.focus();
      select(next);
    });
  });
  select(tabs[0]);
}

function initCitation() {
  const button = document.getElementById("copy-citation");
  const code = document.getElementById("bibtex");
  const status = document.getElementById("copy-status");
  let resetTimer;
  button.addEventListener("click", async () => {
    clearTimeout(resetTimer);
    let copied = false;
    try {
      await navigator.clipboard.writeText(code.textContent);
      copied = true;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      try { copied = document.execCommand("copy"); } catch { /* Keep the BibTeX selected for manual copy. */ }
      if (copied) selection.removeAllRanges();
    }
    button.textContent = copied ? "Copied" : "Press Ctrl/Cmd+C";
    status.textContent = copied ? "BibTeX copied to clipboard." : "Citation selected. Press Control or Command and C to copy.";
    resetTimer = setTimeout(() => { button.textContent = "Copy BibTeX"; }, 2200);
  });
}

function initNavigation() {
  const nav = document.getElementById("navigation");
  const links = [...nav.querySelectorAll("a")];
  const sections = links.map(link => document.querySelector(link.hash));
  const menu = document.querySelector(".mobile-menu");
  const mobile = window.matchMedia("(max-width: 690px)");
  menu.hidden = false;
  function closeMenu() { menu.setAttribute("aria-expanded", "false"); }
  menu.addEventListener("click", () => {
    menu.setAttribute("aria-expanded", String(menu.getAttribute("aria-expanded") !== "true"));
  });
  nav.addEventListener("click", closeMenu);
  mobile.addEventListener("change", closeMenu);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".site-header")) closeMenu();
  });

  let scheduled = false;
  function updateActive() {
    const line = document.querySelector(".site-header").offsetHeight + 28;
    let active = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= line) active = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) active = sections.length - 1;
    links.forEach((link, index) => {
      if (index === active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scheduled = false;
  }
  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateActive);
    }
  }, { passive: true });
  window.addEventListener("resize", updateActive);
  updateActive();
}

renderPublication();
initBottleDemo();
initGallery();
initBenchmarks();
initCitation();
initNavigation();

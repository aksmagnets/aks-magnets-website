/* AKS Air Fryer Time Finder — client-side only, using published chart values. */
(() => {
  "use strict";
  const data = window.AKS_AIR_FRYER_DATA || [];
  const search = document.getElementById("aft-search");
  const category = document.getElementById("aft-category");
  const units = document.getElementById("aft-units");
  const clear = document.getElementById("aft-clear");
  const showAll = document.getElementById("aft-show-all");
  const results = document.getElementById("aft-results");
  const count = document.getElementById("aft-count");
  const quick = document.getElementById("aft-quick-picks");
  if (!search || !category || !units || !clear || !showAll || !results || !count || !quick) return;
  const featured = [
    ["Chicken", "Breast (boneless)"], ["Frozen Foods", "Chicken nuggets"],
    ["Seafood", "Salmon fillet"], ["Vegetables", "Broccoli"],
    ["Beef", "Burger"], ["Frozen Foods", "Curly fries"],
    ["Vegetables", "Sweet potato"], ["Chicken", "Wings"]
  ];
  const normalize = value => String(value || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  let expanded = false;
  [...new Set(data.map(item => item.category))].forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    category.appendChild(option);
  });
  const fToC = f => Math.round((f - 32) * 5 / 9);
  const make = (tag, className, textValue) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textValue !== undefined) element.textContent = textValue;
    return element;
  };
  const labelFor = item => item.category === "Chicken" && /^(Breast|Thighs|Wings|Tenders|Drumsticks|Legs)/.test(item.name)
    ? "Chicken " + item.name.toLowerCase() : item.name;
  function matches(item, query) {
    const words = normalize(query).split(" ").filter(Boolean);
    if (!words.length) return true;
    const haystack = normalize([item.name, item.category, labelFor(item), item.portion].join(" "));
    return words.every(word => haystack.includes(word));
  }
  const isFeatured = item => featured.some(pair => item.category === pair[0] && item.name === pair[1]);
  function card(item) {
    const article = make("article", "aft-result-card");
    article.appendChild(make("span", "aft-result-category", item.category));
    article.appendChild(make("h3", "aft-result-name", labelFor(item)));
    const stats = make("div", "aft-result-stats");
    const temp = make("div", "aft-stat");
    temp.appendChild(make("span", "aft-stat-label", "Temperature"));
    temp.appendChild(make("strong", "aft-stat-value", units.value === "C" ? fToC(item.fahrenheit) + "°C" : item.fahrenheit + "°F"));
    const time = make("div", "aft-stat");
    time.appendChild(make("span", "aft-stat-label", "Estimated cook time"));
    time.appendChild(make("strong", "aft-stat-value", item.minutes + " min"));
    stats.append(temp, time);
    article.appendChild(stats);
    const portion = make("p", "aft-result-portion");
    portion.append(make("strong", "", "Size / preparation: "), document.createTextNode(item.portion));
    article.appendChild(portion);
    article.appendChild(make("p", "aft-result-footnote", "Check doneness with a food thermometer when applicable."));
    return article;
  }
  function render() {
    const query = search.value.trim();
    const selectedCategory = category.value;
    const filtering = Boolean(query || selectedCategory);
    const subset = data.filter(item => (!selectedCategory || item.category === selectedCategory) && matches(item, query));
    const visible = filtering || expanded ? subset : subset.filter(isFeatured);
    results.replaceChildren();
    visible.forEach(item => results.appendChild(card(item)));
    if (!visible.length) {
      const empty = make("div", "aft-empty");
      empty.append(make("h3", "", "No matching foods found"));
      empty.append(make("p", "", "Try a shorter food name, another category, or clear your filters."));
      results.appendChild(empty);
    }
    count.textContent = filtering ? subset.length + (subset.length === 1 ? " food found" : " foods found")
      : expanded ? "Browsing all " + subset.length + " foods" : "Showing " + visible.length + " featured foods from our " + data.length + "-food chart";
    showAll.hidden = filtering;
    showAll.textContent = expanded ? "Show featured foods" : "Browse all " + data.length + " foods";
    clear.hidden = !filtering;
    quick.querySelectorAll("button").forEach(button => {
      button.setAttribute("aria-pressed", String(normalize(search.value) === normalize(button.dataset.term)));
    });
  }
  const picks = [
    ["Chicken breast", "breast boneless"], ["Frozen nuggets", "nuggets"],
    ["Salmon", "salmon"], ["Broccoli", "broccoli"], ["French fries", "fries"]
  ];
  picks.forEach(pair => {
    const btn = make("button", "aft-chip", pair[0]);
    btn.type = "button";
    btn.dataset.term = pair[1];
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => {
      search.value = pair[1];
      category.value = "";
      render();
      search.focus();
    });
    quick.appendChild(btn);
  });
  search.addEventListener("input", render);
  category.addEventListener("change", render);
  units.addEventListener("change", render);
  clear.addEventListener("click", () => {
    search.value = "";
    category.value = "";
    expanded = false;
    render();
    search.focus();
  });
  showAll.addEventListener("click", () => { expanded = !expanded; render(); });
  render();
})();
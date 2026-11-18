/* AKS Air Fryer Time Finder — searchable source-backed reference library. */
(() => {
  "use strict";
  const data = Array.isArray(window.AKS_AIR_FRYER_DATA) ? window.AKS_AIR_FRYER_DATA : [];
  const $ = id => document.getElementById(id);
  const search = $("aft-search"), category = $("aft-category"), units = $("aft-units");
  const clear = $("aft-clear"), results = $("aft-results"), count = $("aft-count");
  const heading = $("aft-results-heading"), emptyState = $("aft-empty-state");
  const safety = $("aft-safety");
  if (![search, category, units, clear, results, count, heading, emptyState, safety].every(Boolean)) return;
  const normalize = input => String(input || "").toLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const synonyms = {
    "bell pepper": "capsicum", "capsicum": "bell pepper",
    "aubergine": "eggplant", "eggplant": "aubergine",
    "courgette": "zucchini", "zucchini": "courgette",
    "garbanzo": "chickpea", "chickpea": "garbanzo",
    "chips": "fries", "fries": "chips",
    "prawn": "shrimp", "shrimp": "prawn",
    "scallion": "green onion", "green onion": "scallion",
    "tater tots": "potato tots", "potato tots": "tater tots",
    "fillet": "filet", "filet": "fillet",
    "ribeye": "rib eye", "rib eye": "ribeye",
    "brussel sprout": "brussels sprouts"
  };
  const categories = [...new Set(data.map(food => food.category))].sort((a,b) => a.localeCompare(b));
  categories.forEach(name => {
    const option = document.createElement("option");
    option.value = name; option.textContent = name; category.appendChild(option);
  });
  const make = (tag, className, content) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  };
  function searchText(food) {
    let str = normalize([food.name, food.category, food.portion, food.keywords || ""].join(" "));
    for (const pair of Object.entries(synonyms)) {
      if (str.includes(pair[0])) str += " " + pair[1];
    }
    return str;
  }
  const indexed = data.map(food => ({...food, searchText:searchText(food)}));
  const fToC = f => Math.round((f - 32) * 5 / 9);
  function headingFor(food) {
    if (food.category === "Chicken" && /^(Breast|Thighs|Wings|Tenders|Drumsticks|Legs)/.test(food.name)) {
      return "Chicken " + food.name.toLowerCase();
    }
    return food.name;
  }
  function makeCard(food) {
    const article = make("article", "aft-result-card");
    article.append(make("span", "aft-result-category", food.category));
    article.append(make("h3", "aft-result-name", headingFor(food)));
    const stats = make("div", "aft-result-stats");
    const temp = make("div", "aft-stat");
    temp.append(make("span", "aft-stat-label", "Temperature"), make("strong", "aft-stat-value",
      units.value === "C" ? fToC(food.fahrenheit) + "°C" : food.fahrenheit + "°F"));
    const time = make("div", "aft-stat");
    time.append(make("span", "aft-stat-label", "Estimated cook time"), make("strong", "aft-stat-value", food.minutes + " min"));
    stats.append(temp, time);
    const portion = make("p", "aft-result-portion");
    portion.append(make("strong", "", "Preparation: "), document.createTextNode(food.portion));
    article.append(stats, portion);
    if (food.safeTemp) {
      const safe = make("p", "aft-result-safe");
      safe.append(make("strong", "", "Safe doneness: "), document.createTextNode(food.safeTemp));
      article.append(safe);
    }
    if (food.appliance || food.cookingMode) {
      const model = make("p", "aft-result-model");
      model.textContent = [food.appliance, food.cookingMode ? food.cookingMode + " mode" : ""].filter(Boolean).join(" · ");
      article.append(model);
    }
    if (food.note) article.append(make("p", "aft-result-note", food.note));
    return article;
  }
  let visibleLimit = 32;
  const loadMore = make("button", "aft-show-all", "Show more matches");
  loadMore.type = "button";
  loadMore.addEventListener("click", () => { visibleLimit += 32; render(); });
  const moreWrapper = make("div", "aft-more");
  moreWrapper.append(loadMore);
  results.insertAdjacentElement("afterend", moreWrapper);
  
  function matches(food, query) {
    const words = normalize(query).split(" ").filter(Boolean);
    return words.every(word => food.searchText.includes(word));
  }
  function render() {
    const query = search.value.trim();
    const selectedCategory = category.value;
    const active = Boolean(query || selectedCategory);
    results.replaceChildren();
    heading.hidden = !active;
    emptyState.hidden = active;
    safety.hidden = !active;
    clear.hidden = !active;
    moreWrapper.hidden = true;
    if (!active) return;
    const filtered = indexed.filter(food => (!selectedCategory || food.category === selectedCategory) && matches(food, query));
    const q = normalize(query);
    if (q) filtered.sort((a,b) => {
      const score = food => {
        const n = normalize(headingFor(food));
        return n === q ? 0 : n.startsWith(q) ? 1 : n.includes(q) ? 2 : 3;
      };
      return score(a) - score(b) || a.name.localeCompare(b.name);
    });
    else filtered.sort((a,b) => a.name.localeCompare(b.name));
    const fragment = document.createDocumentFragment();
    filtered.slice(0, visibleLimit).forEach(food => fragment.append(makeCard(food)));
    if (!filtered.length) {
      const empty = make("div", "aft-empty");
      empty.append(make("h3", "", "No matching foods found"));
      empty.append(make("p", "", "Try a shorter search or select another category."));
      fragment.append(empty);
    }
    results.append(fragment);
    count.textContent = filtered.length + (filtered.length === 1 ? " match" : " matches");
    if (filtered.length > visibleLimit) {
      moreWrapper.hidden = false;
      loadMore.textContent = "Show more matches (" + (filtered.length - visibleLimit) + " remaining)";
    }
  }
  function filterChanged() { visibleLimit = 32; render(); }
  search.addEventListener("input", filterChanged);
  category.addEventListener("change", filterChanged);
  units.addEventListener("change", render);
  clear.addEventListener("click", () => {
    search.value = ""; category.value = ""; visibleLimit = 32; render(); search.focus();
  });
  render();
})();
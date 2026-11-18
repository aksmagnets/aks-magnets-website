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
  // Search aliases are index-only: these never create unsupported cooking records.
  const aliasGroups = [
    ["brussels sprouts", "brussel sprouts", "brussel sprout", "brussels sprout"],
    ["pot stickers", "potstickers", "potsticker", "dumplings"],
    ["hash browns", "hashbrowns", "hash brown"],
    ["bell pepper", "bell peppers", "capsicum", "sweet pepper", "peppers"],
    ["eggplant", "aubergine"],
    ["zucchini", "courgette"],
    ["chickpeas", "chickpea", "garbanzo", "garbanzo beans"],
    ["scallions", "scallion", "green onions", "green onion"],
    ["shrimp", "prawns", "prawn"],
    ["rib eye", "ribeye"],
    ["fillet", "filet"],
    ["tater tots", "potato tots"],
    ["french fries", "fries", "chips"],
    ["hot dogs", "hotdog", "hotdogs"],
    ["cilantro", "coriander"]
  ];
  const aliases = aliasGroups.map(group => group.map(normalize));
  const stem = word => word.endsWith("ies") && word.length > 4 ? word.slice(0,-3) + "y" :
    word.endsWith("es") && /(?:oes|ches|shes|sses)$/.test(word) ? word.slice(0,-2) :
    word.endsWith("s") && !word.endsWith("ss") && word.length > 4 ? word.slice(0,-1) : word;
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
    let str = normalize([food.name, food.category, food.portion, food.keywords || "", food.category === "Poultry" && !/turkey|duck|game hen/i.test(food.name) ? "chicken" : ""].join(" "));
    for (const group of aliases) {
      if (group.some(term => str.includes(term))) str += " " + group.join(" ");
    }
    return str;
  }
  const indexed = data.map(food => ({...food, searchText:searchText(food)}));
  const fToC = f => Math.round((f - 32) * 5 / 9);
  function headingFor(food) {
    if (food.category === "Poultry" && /^(Breast|Thighs|Wings|Tenders|Drumsticks|Legs)/.test(food.name)) {
      return "Chicken " + food.name.toLowerCase();
    }
    return food.name;
  }

  // Visual catalog: one 4-column atlas, grouped by category (8 illustrations each).
  // A photo is intentionally omitted when no food-accurate illustration exists.
  function foodPhotoIndex(food) {
    const n = food.name.toLowerCase();
    const match = rules => {
      for (const [re, idx] of rules) if (re.test(n)) return idx;
      return null;
    };
    switch (food.category) {
      case "Poultry": return match([
        [/duck/,7], [/whole chicken|game hen/,2], [/wing/,1],
        [/drumstick|legs?/,4], [/tender|strip/,5],
        [/breaded|cutlet/,6], [/meatball/,80], [/burger/,3],
        [/breast|thigh|turkey|buffalo/,0]
      ]);
      case "Seafood": return match([
        [/salmon/,8], [/coconut shrimp|breaded shrimp/,9],
        [/shrimp|prawn/,9], [/crab cake|fish cake/,11],
        [/tuna|swordfish/,12], [/lobster/,13], [/calamari/,14],
        [/scallop/,15], [/fish|cod|tilapia|halibut|mahi/,10]
      ]);
      case "Vegetables": return match([
        [/asparagus/,72], [/cauliflower/,73], [/carrot/,74],
        [/corn/,75], [/green bean|snap pea|edamame/,76],
        [/eggplant|aubergine/,77], [/onion|garlic/,78],
        [/tomato/,79], [/broccoli/,16], [/brussel/,17],
        [/sweet potato/,20], [/baked potato|potato \\(large\\)/,19],
        [/potato|fries/,18], [/zucchini|courgette|summer squash/,21],
        [/pepper/,22], [/mushroom|portobello/,23],
        [/plant.based.*burger/,3], [/tofu/,null]
      ]);
      case "Frozen Foods": return match([
        [/salmon/,8], [/breaded shrimp|frozen shrimp/,9],
        [/chicken burger/,3], [/chicken nugget|popcorn chicken|chicken dipper/,26],
        [/chicken strips/,5], [/buffalo wings|\\bwings\\b/,1],
        [/fish cake|fish goujon|fish stick|fish fillet/,10],
        [/meatball/,80], [/french toast/,46], [/sausage patt/,44],
        [/hash brown/,27], [/fries|home fries|potato wedge/,24],
        [/onion ring/,25], [/mozzarella|mac and cheese bites/,31],
        [/tater tot|potato pops/,30], [/pizza|bagel bites/,28],
        [/egg roll|spring roll/,29], [/taquito/,29],
        [/mini quiche/,null], [/pastr|strudel/,48],
        [/potato skin/,18], [/burrito/,69], [/hot pocket/,49]
      ]);
      case "Pork & Lamb": return match([
        [/bacon/,33], [/kielbasa/,39], [/pork belly/,38],
        [/pork tenderloin|roast/,35], [/ham steak/,37],
        [/lamb/,36], [/chop|pork steak/,32],
        [/bratwurst|sausage|hot dog/,34]
      ]);
      case "Breakfast": return match([
        [/soft.boiled/,47], [/hard.boiled/,40], [/fried egg/,41],
        [/scrambled egg/,42], [/waffle/,43],
        [/sausage/,44], [/turkey bacon|bacon/,45]
      ]);
      case "Breads & Baking": return match([
        [/crescent/,48], [/grilled cheese|texas toast/,49],
        [/quesadilla/,50], [/nacho|pita chip/,51],
        [/biscuit/,52], [/brownie/,53], [/cheesecake/,54],
        [/muffin/,55], [/cinnamon apple/,56],
        [/cake/,58], [/quick bread/,null]
      ]);
      case "Sweets": return match([
        [/apple/,56], [/cake|cupcake/,61],
        [/cookie/,60], [/donut/,59]
      ]);
      case "Reheating": return match([
        [/pizza/,64], [/fries/,65], [/wing/,66],
        [/steak/,67], [/egg roll/,68]
      ]);
      default: return null;
    }
  }

  // 31 food-specific, illustrated subjects completing the remaining text-only cards.
  // Exact food names prevent one illustration being applied to the wrong preparation.
  const finalFoodPhotos = new Map([["Baby back ribs",0],["Beets",1],["Cabbage wedges",2],["Kale",3],["Okra",4],["Radishes",5],["Parsnips",6],["Squash",7],["Corn dogs",8],["Frozen pot pie",9],["Frozen pot stickers",10],["Sausage rolls",11],["Churros",12],["Cinnamon rolls",13],["Roasted bananas",14],["Roasted chickpeas",15],["Frozen jalapeño poppers",16],["Frozen samosas",17],["Crispy tofu cubes",18],["Spaghetti squash (halved)",19],["Falafel balls",20],["Frozen pierogies",21],["Bagel (toasted)",22],["Quick bread (mini loaf)",23],["Celeriac cubes",24],["Parsnips (cut)",25],["Turnip (cubes)",26],["Beetroot (whole)",27],["Fennel (quartered)",28],["Frozen mini quiche",29],["Frozen bagels",30]]);
  // The approved Beef images remain unchanged.
  function beefPhotoIndex(food) {
    const name = food.name.toLowerCase();
    if (/burger|patty/.test(name)) return 0;
    if (/roast|eye round|tri-tip/.test(name)) return 1;
    if (/rib.?eye/.test(name)) return 3;
    if (/meatball/.test(name)) return 4;
    if (/sausage/.test(name)) return 5;
    if (/fajita/.test(name)) return 6;
    if (/steak bites/.test(name)) return 7;
    return 2; // New York strip photo represents other whole steaks.
  }
  function makeCard(food) {
    const article = make("article", "aft-result-card");
    const atlasIndex = food.category === "Beef" ? null : foodPhotoIndex(food);
    const finalIndex = atlasIndex === null && food.category !== "Beef" ? finalFoodPhotos.get(food.name) : undefined;
    if (food.category === "Beef" || atlasIndex !== null || finalIndex !== undefined) {
      const headingRow = make("div", "aft-beef-heading");
      const labels = make("div", "aft-beef-heading-text");
      labels.append(make("span", "aft-result-category", food.category));
      labels.append(make("h3", "aft-result-name", headingFor(food)));
      const isBeef = food.category === "Beef";
      const photo = make("span", isBeef
        ? "aft-beef-photo aft-beef-photo-" + beefPhotoIndex(food)
        : atlasIndex === 80
          ? "aft-beef-photo aft-beef-photo-4"
          : atlasIndex !== null
            ? "aft-food-photo aft-food-photo-" + atlasIndex
            : "aft-last-photo aft-last-photo-" + finalIndex);
      photo.setAttribute("aria-hidden", "true");
      headingRow.append(labels, photo);
      article.append(headingRow);
    } else {
      article.append(make("span", "aft-result-category", food.category));
      article.append(make("h3", "aft-result-name", headingFor(food)));
    }
    const stats = make("div", "aft-result-stats");
    const temp = make("div", "aft-stat");
    if (food.cookingMode === "Max Crisp") {
      temp.append(make("span", "aft-stat-label", "Ninja cooking program"),
        make("strong", "aft-stat-value aft-max-crisp", "Max Crisp"));
    } else {
      temp.append(make("span", "aft-stat-label", "Temperature"), make("strong", "aft-stat-value",
        units.value === "C" ? fToC(food.fahrenheit) + "°C" : food.fahrenheit + "°F"));
    }
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
    const words = normalize(query).split(" ").filter(Boolean).map(stem);
    const terms = food.searchText.split(" ").filter(Boolean).map(stem);
    return words.every(word => terms.some(term => term.includes(word)));
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
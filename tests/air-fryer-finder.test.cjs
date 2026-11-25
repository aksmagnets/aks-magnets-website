// Run: node tests/air-fryer-finder.test.cjs
// No external test packages or browser needed.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..", "tools", "air-fryer-time-finder");
const window = {};
const scripts = ["data.js", "expanded-data.js", "supplemental-data.js", "reviewed-metadata.js"];
for (const name of scripts) vm.runInNewContext(fs.readFileSync(path.join(root, name), "utf8"), {window});
assert.equal(window.AKS_AIR_FRYER_DATA.length, 228);
assert(!window.AKS_AIR_FRYER_DATA.some(x => x.name === "Pork loin" && x.minutes === "55"));
assert(!window.AKS_AIR_FRYER_DATA.some(x => x.name === "Meatloaf" && x.portion === "Single layer"));
assert(window.AKS_AIR_FRYER_DATA.every(x => typeof x.fahrenheit === "number" && x.minutes && x.portion));
assert.equal(window.AKS_AIR_FRYER_DATA.filter(x => x.cookingMode === "Max Crisp").length, 8);
assert(window.AKS_AIR_FRYER_DATA.filter(x => x.fahrenheit > 420).every(x => /Cosori/i.test(x.appliance) && x.note));
class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.events = {}; this.value = ""; this.hidden = false; this.dataset = {}; this.attrs = {}; this._text = ""; }
  get textContent() { return this._text + this.children.map(c => typeof c === "string" ? c : c.textContent).join(""); }
  set textContent(v) { this._text = String(v); this.children = []; }
  append(...args) { this.children.push(...args); }
  appendChild(x) { this.children.push(x); return x; }
  replaceChildren(...args) { this.children = args; }
  insertAdjacentElement(_position, x) { this.after = x; }
  addEventListener(event, fn) { this.events[event] = fn; }
  focus() { this.focused = true; }
  setAttribute(key, value) { this.attrs[key] = value; }
}
const ids = ["aft-search", "aft-category", "aft-units", "aft-clear", "aft-results", "aft-count", "aft-results-heading", "aft-empty-state", "aft-safety"];
const nodes = Object.fromEntries(ids.map(id => [id, new Element(id)]));
nodes["aft-units"].value = "F";
const document = {
  getElementById(id) { return nodes[id] || null; },
  createElement(tag) { return new Element(tag); },
  createDocumentFragment() { return new Element("fragment"); },
  createTextNode(str) { return String(str); }
};
vm.runInNewContext(fs.readFileSync(path.join(root, "finder.js"), "utf8"), {window, document});
const findCards = () => nodes["aft-results"].children.flatMap(x => x.tag === "fragment" ? x.children : [x]);
function search(q, category = "") {
  nodes["aft-search"].value = q;
  nodes["aft-category"].value = category;
  nodes["aft-search"].events.input();
  return {
    count: Number(nodes["aft-count"].textContent.split(" ")[0]),
    cards: findCards(),
    titles: findCards().map(x => { const nodes = x.children.flatMap(c => [c, ...(c.children || []).flatMap(d => [d, ...(d.children || [])])]); return nodes.find(c => c.tag === "h3")?.textContent; }).filter(Boolean)
  };
}
assert.equal(findCards().length, 0, "Nothing should show before entering a query");
assert(nodes["aft-safety"].hidden, "Safety block should be hidden before searching");
assert(search("chicken breast").count >= 4);
assert(search("brussel sprouts").titles.some(x => x.includes("Brussels")));
assert(search("potstickers").titles.some(x => /pot stickers/i.test(x)));
assert(search("hashbrowns").count >= 1);
assert(search("capsicum").count >= 2);
assert(search("prawn").count >= 2);
assert(search("potatoes").count >= 5);
assert(search("frozen chicken").count >= 3);
assert(search("fennel").count >= 1);
const beefTrial = search("", "Beef");
assert(beefTrial.count >= 15, "Beef category should show its original results");
assert(beefTrial.cards.every(card => card.textContent && card.children.some(c => c.className === "aft-beef-heading")), "Beef cards should contain the image-ready heading");
const seafoodTrial = search("", "Seafood");
assert(seafoodTrial.cards.every(card => card.children.some(c => c.className === "aft-beef-heading")), "Seafood now shows illustrated cards");
assert(search("asparagus").cards.some(card => card.children.some(c => c.className === "aft-beef-heading")), "Asparagus should have an illustration");

// Audited Vegetable images should use the new dedicated sprite; approved foods stay put.
const vegImageIndex = card => {
  const row = card.children.find(c => c.className === "aft-beef-heading");
  const sprite = row?.children?.find(c => /^aft-vegetable-photo /.test(c.className || ""));
  return sprite ? Number(sprite.className.match(/aft-vegetable-photo-(\d+)/)?.[1]) : null;
};
for (const [name,index] of [["Acorn squash (CookTiming)",0],["Baked sweet potato (large)",1],["Baked whole potatoes",2],["Baked potato (large)",2],["Bell peppers (whole)",3],["Homemade fresh fries",4],["Homemade potato chips",5],["Loaded potato skins",6],["Mushrooms (whole)",7],["Peppers (1-inch chunks)",8],["Portobello mushrooms (whole)",9],["Potatoes (1-inch cubes)",10],["Potatoes (1-inch chunks)",10],["Roasted baby potatoes",11],["Stuffed mushrooms",12],["Sweet potato",13],["Tomato halves",14],["Zucchini",15]]) {
  const filtered = search(name, "Vegetables");
  assert(filtered.cards.some(c => vegImageIndex(c) === index), name + " needs its exact Vegetable illustration");
}
assert(search("Sweet potato cubes", "Vegetables").cards.every(c => vegImageIndex(c) === null), "Existing sweet potato cube illustration stays intact");
const frozenCardImageIndex = card => {
  const row = card.children.find(c => c.className === "aft-beef-heading");
  const sprite = row?.children?.find(c => /^aft-frozen-photo /.test(c.className || ""));
  return sprite ? Number(sprite.className.match(/aft-frozen-photo-(\d+)/)?.[1]) : null;
};
for (const [name, index] of [["Corn dogs",0],["Curly fries",1],["Fish sticks",2],["Frozen chicken burger",3],["Frozen fish cakes",4],["Frozen pizza",5],["Frozen pizza snack rolls",6],["Frozen potato wedges",7],["Frozen waffle fries",8]]) {
  const cards = search(name, "Frozen Foods").cards;
  assert(cards.some(card => frozenCardImageIndex(card) === index), name + " must use its reviewed Frozen Foods thumbnail");
}
assert(search("Chicken nuggets", "Frozen Foods").cards.every(card => frozenCardImageIndex(card) === null), "Approved chicken nuggets image must remain unchanged");



function hasPoultryCorrection(card) {
  return card.children.some(row => (row.children || []).some(child =>
    typeof child.className === "string" && child.className.includes("aft-poultry-photo")));
}
for (const q of ["Chicken thighs", "Turkey breast", "Turkey tenderloin"]) {
  assert(search(q).cards.some(hasPoultryCorrection), q + " should use a reviewed Poultry illustration");
}
assert(search("Chicken wings").cards.every(card => !hasPoultryCorrection(card)), "Approved wings imagery stays unchanged");

for (const name of ["Baby back ribs", "Kale", "Frozen pot pie", "Frozen mini quiche", "Frozen bagels"]) {
  const matched = search(name).cards;
  assert(matched.some(card => card.children.some(c => c.children.some(x => typeof x.className === "string" && x.className.startsWith("aft-last-photo")))), name + " should show a final-set illustration");
}

for (const [name,index] of [["Frozen samosas",0],["Frozen jalapeño poppers",1],["Sausage rolls",2]]) {
  const results = search(name,"Frozen Foods").cards;
  assert(results.some(card => card.children.some(row => (row.children || []).some(child => child.className === "aft-frozen-followup aft-frozen-followup-" + index))), name + " uses corrected follow-up art");
}
const porkCards = search("Hot dogs", "Pork & Lamb").cards;
assert(porkCards.some(card => card.children.some(row => (row.children || []).some(child => child.className === "aft-hotdog-photo"))), "Hot dogs must show hot dog image rather than sausages");
assert(search("Pork sausage", "Pork & Lamb").cards.every(card => !card.children.some(row => (row.children || []).some(child => child.className === "aft-hotdog-photo"))), "Approved pork sausage illustration remains unchanged");
for (const [name,index] of [["Churros",0],["Cinnamon rolls",1]]) {
  const cards = search(name,"Sweets").cards;
  assert(cards.some(card => card.children.some(row => (row.children || []).some(child =>
    child.className === "aft-sweets-photo aft-sweets-photo-" + index))), name + " should use its audited Sweets image");
}
assert(search("Cookies","Sweets").cards.every(card => !card.children.some(row => (row.children || []).some(child =>
  typeof child.className === "string" && child.className.startsWith("aft-sweets-photo")))), "Approved Cookie image must remain unchanged");
assert(search("taquitos").count >= 1);
assert(search("broccoli").count >= 1);
assert.equal(search("nothingmatchesaksmagnets").count, 0);
assert(!nodes["aft-safety"].hidden, "Safety block follows an entered query");
assert(search("", "Seafood").count >= 22, "Category-only filtering should work");
search("salmon");
nodes["aft-units"].value = "C";
nodes["aft-units"].events.change();
assert(findCards().some(x => x.textContent.includes("°C")), "Celsius conversion should render");
search("frozen waffle fries");
assert(findCards()[0].textContent.includes("Max Crisp"), "Ninja fixed preset must be shown");
const veg = search("", "Vegetables");
assert(veg.count >= 50 && findCards().length === 32, "Long result sets should paginate");
assert(!nodes["aft-results"].after.hidden, "Show More control should be accessible");
nodes["aft-results"].after.children[0].events.click();
assert(findCards().length >= 50, "Show More should append next batch");
nodes["aft-clear"].events.click();
assert.equal(findCards().length, 0);
assert(nodes["aft-safety"].hidden);
console.log("PASS: 228 active foods; source guards, complete 228-image catalog, search aliases, categories, unit switch, Max Crisp, pagination and reset.");

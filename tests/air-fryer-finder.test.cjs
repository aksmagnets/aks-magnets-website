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
    titles: findCards().map(x => x.children.find(c => c.tag === "h3")?.textContent).filter(Boolean)
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
console.log("PASS: 228 active foods; source guards, search aliases, categories, unit switch, Max Crisp, pagination and reset.");

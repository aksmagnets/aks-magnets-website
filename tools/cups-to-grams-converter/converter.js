(()=>{"use strict";
const $=id=>document.getElementById(id), data=window.AKS_CUP_WEIGHTS;
const search=$("ctg-search"), category=$("ctg-category"), ingredient=$("ctg-ingredient"), amount=$("ctg-amount"), result=$("ctg-result"), detail=$("ctg-detail"), source=$("ctg-source"), count=$("ctg-count"), label=$("ctg-amount-label"), fractions=$("ctg-fractions");
let direction="cups";
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();
function option(value,text){const el=document.createElement("option");el.value=value;el.textContent=text;return el;}
const categories=[...new Set(data.map(e=>e.category))].sort();
categories.forEach(c=>category.append(option(c,c)));
function fmt(n,d){if(n>0&&n<Math.pow(10,-d))return "<"+Math.pow(10,-d);return n.toLocaleString("en-US",{maximumFractionDigits:d});}
function parseAmount(s){s=s.trim();if(!s)return NaN; const mixed=s.match(/^(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)$/);if(mixed)return Number(mixed[3])>0?Number(mixed[1]||0)+Number(mixed[2])/Number(mixed[3]):NaN;return /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)?Number(s):NaN;}
function convert(){const e=ingredient.value===""?null:data[Number(ingredient.value)], n=parseAmount(amount.value);
amount.setAttribute("aria-invalid",String(amount.value.trim()!==""&&(!Number.isFinite(n)||n<0||n>1e9)));
if(!e){result.textContent="—";detail.textContent="Choose an ingredient.";source.textContent="";return;}
if(!Number.isFinite(n)||n<0||n>1e9){result.textContent="—";detail.textContent="Enter a nonnegative quantity up to 1 billion.";source.textContent="";return;}
const converted=direction==="cups"?n*e.grams:n/e.grams;
result.textContent=fmt(converted,direction==="cups"?1:3)+(direction==="cups"?" g":converted===1?" cup":" cups");
detail.textContent=e.name+" · 1 US cup ≈ "+e.grams+" g";
source.textContent=e.source==="Range midpoint"?"Reference: midpoint of published baking-weight range.":e.source==="Secondary"?"Reference: USDA-derived household portion estimates.":e.source==="Water"?"Reference: US cup volume; approximate water density.":"Reference: baking ingredient weight estimates.";
}
function filter(){const old=ingredient.value, words=norm(search.value).split(" ").filter(Boolean);const list=data.map((e,i)=>({e,i})).filter(({e})=>(!category.value||e.category===category.value)&&words.every(w=>norm(e.name+" "+e.aliases).includes(w)));ingredient.replaceChildren(...list.map(({e,i})=>option(String(i),e.name)));if(!list.length)ingredient.append(option("","No matching ingredients"));else if(list.some(({i})=>String(i)===old))ingredient.value=old;count.textContent=list.length+" of "+data.length+" ingredients";convert();}
search.addEventListener("input",filter);category.addEventListener("change",filter);ingredient.addEventListener("change",convert);amount.addEventListener("input",convert);
document.querySelectorAll("[data-ctg-mode]").forEach(b=>b.addEventListener("click",()=>{if(direction===b.dataset.ctgMode)return;direction=b.dataset.ctgMode;document.querySelectorAll("[data-ctg-mode]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));label.textContent=direction==="cups"?"Quantity in US cups":"Quantity in grams";amount.value=direction==="cups"?"1":"100";fractions.hidden=direction!=="cups";convert();}));
fractions.addEventListener("click",event=>{const b=event.target.closest("button[data-amount]");if(b){amount.value=b.dataset.amount;convert();}});
$("ctg-reset").addEventListener("click",()=>{search.value="";category.value="";filter();ingredient.value=String(data.findIndex(e=>e.name==="All-purpose flour"));document.querySelector('[data-ctg-mode="cups"]').click();amount.value="1";convert();});
filter();ingredient.value=String(data.findIndex(e=>e.name==="All-purpose flour"));convert();
})();
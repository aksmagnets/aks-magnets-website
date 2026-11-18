/* Reviewed corrections and safety metadata, November 2026.
   Applied after the two chart files; preserves original files for audit lineage.
   Suppresses an ambiguous pork loin entry until its 1-inch / 55-minute preparation is resolved. */
(() => {
  "use strict";
  const foods = window.AKS_AIR_FRYER_DATA;
  if (!Array.isArray(foods)) return;
  const original = foods.slice();
  const cosori = "https://cosori.com/blogs/blog/air-fryer-cooking-times";
  const ninja = "https://manuals.plus/m/02c0cdfee95e84667808070f706ac607208180f1d5f48151c1d9ebebafb54afc";
  for (const food of original) {
    const name = food.name.toLowerCase();
    if (food.category === "Chicken") food.category = "Poultry";
    if (food.source === cosori) {
      food.appliance = "Cosori Iconic";
      if (food.fahrenheit > 400) food.note = "Cosori Iconic setting. Check that your air fryer supports this temperature; do not exceed its maximum.";
    }
    if (food.source === "https://airfryerkitchen.com/air-fryer-cooking-times-chart/") {
      food.sourceChecked = "2026-11-18";
      food.sourceContext = "Preheated 5–6 qt basket; single layer.";
    }
    if (food.source === "https://cooktiming.com/air-fryer-timer") {
      food.sourceChecked = "2026-11-18";
      food.sourceContext = "Baseline lookup; check preparation and doneness.";
    }
    if (food.source === cosori) food.sourceChecked = "2026-11-18";
    if (food.source === ninja) food.sourceChecked = "2026-11-18";
    if (name === "cherry tomatoes (roasted)" && food.source === ninja) {
      food.name = "Balsamic roasted cherry tomatoes";
      food.portion = "500 g cherry tomatoes; balsamic vinegar and oil";
    }
    if (name === "pork steaks (boneless)" && food.source === ninja) {
      food.name = "Honey-sage pork steaks (boneless)";
      food.portion = "2–3 steaks, 120 g each; honey, oil and sage";
    }
    if (name === "honey-glazed brussels sprouts" && food.source === ninja) {
      food.name = "Honey-hazelnut Brussels sprouts";
      food.portion = "500 g Brussels sprouts, halved; honey and hazelnuts";
    }
    if (name === "plant-based burger (ninja)" && food.source === ninja) {
      food.name = "Plant-based BBQ burgers (Ninja)";
      food.portion = "4 patties, 125 g each; BBQ sauce";
    }
    if (food.source === ninja) {
      food.appliance = "Ninja Foodi FlexDrawer";
      food.cookingMode = "Air Fry";
      if (/^(cherry tomatoes \(roasted\)|pork steaks \(boneless\))$/i.test(name)) {
        food.cookingMode = "Roast";
        food.note = "Ninja FlexDrawer Roast program; time/temperature from the manufacturer's recipe chart.";
      }
      if (/^(frozen waffle fries|frozen popcorn chicken|frozen potato pops|frozen battered onion rings|frozen crinkle-cut fries|frozen potato wedges|frozen chicken dippers|frozen fish goujons)$/i.test(food.name)) {
        food.cookingMode = "Max Crisp";
        food.note = "Ninja FlexDrawer Max Crisp program; follow the manufacturer's setting for this mode.";
      }
      if (name === "duck breast (ninja, skin-on)") {
        food.note = "Slash skin; cook skin-side down first and turn halfway. Ninja FlexDrawer Air Fry instructions for 2 breasts (400 g total).";
      }
    }
    if (/^duck breast \(skin-on\)$/i.test(food.name)) {
      food.note = "CookTiming reference for a fresh skin-on breast; not directly interchangeable with the Ninja 2-breast method.";
    }
    if (/^soft-boiled eggs \(in shell\)$/i.test(food.name)) {
      food.note = "Soft yolks do not meet the general U.S. recommendation to cook eggs until whites and yolks are firm. Higher-risk diners should avoid undercooked eggs.";
    }
    if (/^whole chicken$/i.test(food.name) && /6\.5/.test(food.portion)) {
      food.note = "Large bird: check that your air fryer can safely accommodate 6.5 lb with room for airflow.";
    }
    if (food.category === "Poultry") {
      food.safeTemp = "165°F (74°C) internal";
    } else if (food.category === "Beef" || food.category === "Pork & Lamb") {
      if (/meatballs|burger|ground|sausage|bratwurst/i.test(food.name)) {
        food.safeTemp = "160°F (71°C) internal for ground meat";
      } else if (/bacon|hot dogs|precooked|ham steak|smoked kielbasa/i.test(food.name)) {
        food.safeTemp = "Check package directions and whether the product is precooked";
      } else {
        food.safeTemp = "145°F (63°C) internal, then rest 3 minutes for whole cuts";
      }
    } else if (food.category === "Seafood") {
      if (/shrimp|prawns|lobster|scallop|calamari|crab/i.test(food.name)) {
        food.safeTemp = "Cook shellfish until opaque and fully cooked";
      } else {
        food.safeTemp = "145°F (63°C) internal for fish, or opaque and flakes easily";
      }
    } else if (food.category === "Reheating") {
      food.safeTemp = "Reheat leftovers to 165°F (74°C) internal";
    } else if (/scrambled eggs|fried eggs/i.test(food.name)) {
      food.safeTemp = "Cook egg dishes to 160°F (71°C); whole eggs until firm";
    }
    if (food.category === "Breakfast" && /sausage patties/i.test(food.name) && !/precooked/i.test(food.portion)) {
      food.safeTemp = "160°F (71°C) internal for pork/beef sausage; 165°F (74°C) for poultry sausage";
    }
    if (food.category === "Frozen Foods") {
      food.note = [food.note, "Follow the package directions and verify any required internal temperature."].filter(Boolean).join(" ");
    }
  }
  const withheld = foods.findIndex(food => food.name === "Pork loin" && food.portion === "1 in" && food.minutes === "55");
  if (withheld !== -1) foods.splice(withheld, 1);
})();

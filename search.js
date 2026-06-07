/* ============================================================
   Lawsuit Center — search index + results renderer
   Edit the INDEX array below to add/remove searchable pages.
   ============================================================ */

(function () {
  var INDEX = [
    // ----- Free tools -----
    { url: "pfas-exposure-checker.html",   title: "PFAS Exposure Checker", tag: "Free Tool", category: "Free Tools",
      desc: "Check location, water source, AFFF or industrial exposure, and timeline against active PFAS case categories.",
      keywords: "pfas forever chemicals water afff foam military airport exposure checker tool firefighting" },

    { url: "cancer-exposure-checker.html", title: "Cancer Exposure Checker", tag: "Free Tool", category: "Free Tools",
      desc: "Four short questions mapping a cancer diagnosis and exposure history to active case categories.",
      keywords: "cancer mesothelioma talc hair relaxer roundup camp lejeune pfas benzene afff exposure checker tool" },

    // ----- Case Review -----
    { url: "cancer-case-review.html", title: "Cancer Case Review", tag: "Case Review", category: "Cancer",
      desc: "Cancer diagnoses possibly tied to consumer products, workplace exposure, or contaminated water.",
      keywords: "cancer mesothelioma kidney ovarian lung lymphoma leukemia bladder uterine talc roundup zantac asbestos benzene afff camp lejeune" },

    { url: "asbestos-case-review.html", title: "Asbestos Case Review", tag: "Case Review", category: "Asbestos",
      desc: "Mesothelioma, asbestos-related lung cancer, asbestosis, military or shipyard exposure, or secondhand exposure.",
      keywords: "asbestos mesothelioma lung cancer asbestosis shipyard navy military secondhand" },

    { url: "lung-cancer-asbestos-review.html", title: "Lung Cancer Asbestos Review", tag: "Case Review", category: "Asbestos",
      desc: "Submit basic information about asbestos exposure history and a lung cancer diagnosis for case review.",
      keywords: "lung cancer asbestos exposure occupational" },

    { url: "social-media-case-review.html", title: "Social Media Case Review", tag: "Case Review", category: "Digital Platforms",
      desc: "Children or teens with mental health harm tied to Instagram, TikTok, Snapchat, Facebook, YouTube.",
      keywords: "social media instagram tiktok snapchat facebook youtube meta minors teen anxiety depression eating disorder self-harm MDL 3047" },

    { url: "video-game-case-review.html", title: "Video Game Case Review", tag: "Case Review", category: "Digital Platforms",
      desc: "Compulsive gaming, academic decline, mental health impact, or unauthorized in-game spending involving minors.",
      keywords: "video game gaming addiction minors fortnite roblox in-game purchases" },

    { url: "openai-case-review.html", title: "OpenAI / ChatGPT Case Review", tag: "Case Review", category: "AI Chatbot Harm",
      desc: "Wrongful death, self-harm, fatal drug interaction, or harm involving sustained ChatGPT use.",
      keywords: "openai chatgpt ai chatbot wrongful death suicide overdose violence school shooting product liability" },

    { url: "ai-case-review.html", title: "AI Case Review", tag: "Case Review", category: "AI Chatbot Harm",
      desc: "Harm involving an AI chatbot, AI-generated deepfake images, or another AI product — chatbot harm, deepfakes, or professional impersonation.",
      keywords: "ai artificial intelligence chatbot lawsuit deepfake nonconsensual images grok xai character ai openai chatgpt wrongful death self-harm medical impersonation take it down act" },

    { url: "pfas-case-review.html", title: "PFAS Case Review", tag: "Case Review", category: "Water & Environment",
      desc: "PFAS contamination, AFFF firefighting foam, military base or airport exposure, kidney/testicular cancer, thyroid disease, or ulcerative colitis.",
      keywords: "pfas pfoa pfos forever chemicals afff firefighting foam military base airport kidney testicular cancer thyroid ulcerative colitis" },

    { url: "toxic-water-case-review.html", title: "Toxic Water Case Review", tag: "Case Review", category: "Water & Environment",
      desc: "Contaminated drinking water, well water contamination, or industrial chemical releases.",
      keywords: "toxic water drinking well contamination industrial release" },

    { url: "environmental-contamination-case-review.html", title: "Environmental Contamination Review", tag: "Case Review", category: "Water & Environment",
      desc: "Exposure through soil, groundwater, industrial sites, landfills, or community conditions.",
      keywords: "environmental contamination soil groundwater landfill industrial superfund" },

    { url: "air-pollution-case-review.html", title: "Air Pollution Case Review", tag: "Case Review", category: "Water & Environment",
      desc: "Long-term air pollution, industrial emissions, refinery or plant proximity, and respiratory conditions.",
      keywords: "air pollution emissions refinery plant respiratory asthma" },

    { url: "pesticide-case-review.html", title: "Pesticide Case Review", tag: "Case Review", category: "Chemicals & Pesticides",
      desc: "Glyphosate (Roundup), paraquat, chlorpyrifos, and other pesticide or herbicide exposure.",
      keywords: "pesticide herbicide roundup glyphosate paraquat chlorpyrifos non-hodgkin lymphoma parkinson farmer applicator" },

    { url: "neurological-case-review.html", title: "Neurological Case Review", tag: "Case Review", category: "Chemicals & Pesticides",
      desc: "Parkinson's, neuropathy, cognitive decline, or movement disorders with exposure history.",
      keywords: "neurological parkinson neuropathy cognitive decline movement disorder pesticide heavy metals" },

    { url: "consumer-product-case-review.html", title: "Consumer Product Case Review", tag: "Case Review", category: "Products & Food",
      desc: "Allegedly defective, mislabeled, contaminated, or unsafe consumer products and recalls.",
      keywords: "consumer product defective recall mislabeled unsafe" },

    { url: "processed-food-case-review.html", title: "Processed Food Case Review", tag: "Case Review", category: "Products & Food",
      desc: "Childhood-onset Type 2 diabetes, NAFLD, or metabolic conditions from ultra-processed food.",
      keywords: "processed food ultra-processed type 2 diabetes nafld fatty liver childhood obesity sugar" },

    { url: "reproductive-case-review.html", title: "Reproductive Injury Case Review", tag: "Case Review", category: "Products & Food",
      desc: "Uterine or ovarian cancer, fertility complications, or reproductive harm tied to long-term product use.",
      keywords: "reproductive uterine ovarian cancer fertility hair relaxer talc talcum prenatal" },

    { url: "depo-provera-case-review.html", title: "Depo-Provera Case Review", tag: "Case Review", category: "Drugs & Medical Devices",
      desc: "Long-term Depo-Provera use (or generic medroxyprogesterone acetate) followed by a meningioma brain tumor diagnosis.",
      keywords: "depo-provera depo provera medroxyprogesterone meningioma brain tumor birth control injection MDL 3140" },

    { url: "case-review.html", title: "General Case Review", tag: "Case Review", category: "General",
      desc: "Not sure where you fit? Describe the situation and we'll review which category may apply.",
      keywords: "general case review intake start" },

    // ----- Overviews -----
    { url: "asbestos-lawsuits.html", title: "Asbestos Lawsuits", tag: "Overview", category: "Asbestos",
      desc: "Main asbestos hub: exposure history, illnesses tied to asbestos, and how case review works.",
      keywords: "asbestos lawsuits overview mesothelioma exposure" },

    { url: "lung-cancer-from-asbestos-exposure.html", title: "Lung Cancer From Asbestos Exposure", tag: "Overview", category: "Asbestos",
      desc: "Background on lung cancer claims involving asbestos exposure history.",
      keywords: "lung cancer asbestos" },

    { url: "social-media-addiction-lawsuit.html", title: "Social Media Addiction Lawsuit", tag: "Overview", category: "Digital Platforms",
      desc: "Background on allegations that platforms used addictive design features harming youth mental health.",
      keywords: "social media addiction lawsuit design features youth teens" },

    { url: "https://lawsuitinformer.com/ai-lawsuits", title: "AI Lawsuits Overview", tag: "Overview", category: "AI Chatbot Harm",
      desc: "The top-level guide to AI litigation: who is being sued, the legal theories involved, and how the OpenAI, Grok, and Character.AI cases differ.",
      keywords: "ai lawsuits artificial intelligence litigation overview hub openai grok character ai deepfake chatbot product liability" },

    { url: "https://lawsuitinformer.com/take-it-down-act", title: "The TAKE IT DOWN Act Explained", tag: "Overview", category: "AI Chatbot Harm",
      desc: "The federal law on nonconsensual intimate images and AI deepfakes — what it covers, the 48-hour platform removal duty, and victims' rights.",
      keywords: "take it down act nonconsensual intimate images ncii deepfake law platform removal 48 hours ftc victim rights deepfake laws" },

    { url: "https://lawsuitinformer.com/grok-lawsuits", title: "Grok and xAI Lawsuits", tag: "Overview", category: "AI Chatbot Harm",
      desc: "The deepfake-image litigation against xAI — nonconsensual AI-generated images, the class actions, and the city and state actions.",
      keywords: "grok lawsuit xai deepfake nonconsensual ai generated images class action st clair baltimore privacy likeness" },

    { url: "https://lawsuitinformer.com/character-ai-lawsuit", title: "Character.AI Lawsuits", tag: "Overview", category: "AI Chatbot Harm",
      desc: "Teen-safety and wrongful death cases, the January 2026 settlements, and the state action alleging a chatbot posed as a licensed doctor.",
      keywords: "character ai lawsuit companion chatbot teen safety wrongful death settlement google medical impersonation doctor psychiatrist kentucky pennsylvania" },

    { url: "https://lawsuitinformer.com/openai-lawsuits", title: "OpenAI Lawsuits", tag: "Overview", category: "AI Chatbot Harm",
      desc: "The central hub for OpenAI litigation coverage — ChatGPT wrongful death, self-harm, mass shooting claims, and the product-versus-content framing question.",
      keywords: "openai chatgpt lawsuits wrongful death self harm overdose school shooting product liability section 230" },

    { url: "https://lawsuitinformer.com/openai-school-shooting-lawsuits-ai-product-liability", title: "OpenAI School Shooting Lawsuits", tag: "Overview", category: "AI Chatbot Harm",
      desc: "Federal lawsuits against OpenAI tied to mass shootings and the product-vs-content framing question.",
      keywords: "openai chatgpt school shooting product liability section 230" },

    { url: "https://lawsuitinformer.com/chatgpt-fsu-shooting-lawsuit", title: "FSU Shooting Lawsuit", tag: "Overview", category: "AI Chatbot Harm",
      desc: "The Chabba complaint: an eight-count federal lawsuit with a novel negligent entrustment theory for AI access.",
      keywords: "fsu florida state shooting chatgpt openai negligent entrustment chabba" },

    { url: "https://lawsuitinformer.com/chatgpt-overdose-lawsuit-scott", title: "Scott Overdose Lawsuit", tag: "Overview", category: "AI Chatbot Harm",
      desc: "First major AI-as-unauthorized-medical-advisor wrongful death case (kratom + Xanax interaction).",
      keywords: "scott chatgpt overdose kratom xanax wrongful death drug interaction" },

    { url: "https://lawsuitinformer.com/cancers-linked-to-lawsuits", title: "Cancers Linked to Lawsuits", tag: "Overview", category: "Cancer",
      desc: "Guide on cancers most often involved in toxic exposure, product liability, and environmental claims.",
      keywords: "cancer lawsuits toxic exposure product liability environmental" },

    { url: "water-contamination-lawsuits.html", title: "Water Contamination Lawsuits", tag: "Overview", category: "Water & Environment",
      desc: "Background on contaminated drinking water and long-term community water exposure claims.",
      keywords: "water contamination drinking groundwater community" },

    { url: "pfas-water-contamination-lawsuits.html", title: "PFAS Water Contamination", tag: "Overview", category: "Water & Environment",
      desc: "Forever chemicals near military bases, airports, and industrial facilities.",
      keywords: "pfas pfoa pfos water contamination military airport industrial" },

    { url: "environmental-contamination-lawsuits.html", title: "Environmental Contamination Lawsuits", tag: "Overview", category: "Water & Environment",
      desc: "Background on exposure through air, soil, groundwater, or community conditions.",
      keywords: "environmental contamination air soil groundwater community" },

    { url: "chemical-exposure-lawsuits.html", title: "Chemical Exposure Lawsuits", tag: "Overview", category: "Chemicals & Pesticides",
      desc: "Toxic substances, repeated exposure, contaminated property, and workplace exposure.",
      keywords: "chemical exposure toxic workplace occupational" },

    { url: "who-may-qualify-for-a-chemical-exposure-lawsuit.html", title: "Who May Qualify for a Chemical Exposure Lawsuit", tag: "Overview", category: "Chemicals & Pesticides",
      desc: "Common qualification factors, exposure patterns, and information people gather before pursuing a claim.",
      keywords: "qualify chemical exposure lawsuit eligibility" },

    { url: "roundup-lawsuit.html", title: "Roundup Lawsuit", tag: "Overview", category: "Chemicals & Pesticides",
      desc: "Glyphosate-based herbicides and alleged links to non-Hodgkin lymphoma.",
      keywords: "roundup glyphosate monsanto bayer non-hodgkin lymphoma cancer" },

    { url: "hair-relaxer-lawsuit.html", title: "Hair Relaxer Lawsuit", tag: "Overview", category: "Chemicals & Pesticides",
      desc: "Chemical hair relaxer products and alleged long-term reproductive health risks.",
      keywords: "hair relaxer chemical reproductive uterine ovarian cancer fibroid" },

    { url: "product-liability-lawsuits.html", title: "Product Liability Lawsuits", tag: "Overview", category: "Products & Food",
      desc: "Background on allegedly defective, unsafe, mislabeled, or harmful consumer products and devices.",
      keywords: "product liability defective recall consumer device" },

    { url: "depo-provera.html", title: "Depo-Provera Meningioma Lawsuit", tag: "Overview", category: "Drugs & Medical Devices",
      desc: "Background on the Depo-Provera meningioma litigation (MDL 3140), who qualifies, and FAQs.",
      keywords: "depo provera depo-provera meningioma brain tumor mdl 3140 birth control" },

    { url: "drug-injury-lawsuits.html", title: "Drug Injury Lawsuits", tag: "Overview", category: "Drugs & Medical Devices",
      desc: "Prescription medications, side effects, warning issues, and medication-related injuries.",
      keywords: "drug injury prescription medication side effect warning" },

    { url: "medical-device-lawsuits.html", title: "Medical Device Lawsuits", tag: "Overview", category: "Drugs & Medical Devices",
      desc: "Implants, surgical mesh, joint replacements, complications, recalls, and alleged defects.",
      keywords: "medical device implant surgical mesh joint replacement hip knee recall" },

    { url: "ozempic-lawsuit.html", title: "Ozempic / GLP-1 Lawsuits", tag: "Overview", category: "Drugs & Medical Devices",
      desc: "GLP-1 medications and reported gastrointestinal complications.",
      keywords: "ozempic glp-1 wegovy mounjaro semaglutide gastroparesis stomach paralysis" },

    { url: "personal-injury-lawsuits.html", title: "Personal Injury Lawsuits", tag: "Overview", category: "Personal Injury",
      desc: "Background on accident, negligence, and injury-related claim categories.",
      keywords: "personal injury accident negligence" },

    { url: "consumer-lawsuits.html", title: "Consumer Lawsuits", tag: "Overview", category: "Consumer & Financial",
      desc: "False advertising, billing disputes, defective products, scams, and consumer protection.",
      keywords: "consumer protection false advertising billing scam" },

    { url: "financial-lawsuits.html", title: "Financial Lawsuits", tag: "Overview", category: "Consumer & Financial",
      desc: "Investment losses, financial misconduct, securities, and consumer finance claims.",
      keywords: "financial investment securities ponzi misconduct" },

    { url: "banking-lending-lawsuits.html", title: "Banking & Lending Lawsuits", tag: "Overview", category: "Consumer & Financial",
      desc: "Bank fees, mortgage servicing, credit reporting, debt collection, and predatory lending.",
      keywords: "banking lending mortgage credit report debt collection predatory" },

    { url: "privacy-data-breach-lawsuits.html", title: "Privacy & Data Breach Lawsuits", tag: "Overview", category: "Privacy & Civil Rights",
      desc: "Data breaches, biometric privacy, tracking, and exposed personal information.",
      keywords: "privacy data breach biometric tracking pixel BIPA" },

    { url: "defamation-reputation-lawsuits.html", title: "Defamation & Reputation Lawsuits", tag: "Overview", category: "Privacy & Civil Rights",
      desc: "Libel, slander, online reviews, social media posts, and reputation harm.",
      keywords: "defamation libel slander reputation review" },

    { url: "civil-rights-lawsuits.html", title: "Civil Rights Lawsuits", tag: "Overview", category: "Privacy & Civil Rights",
      desc: "Discrimination, government misconduct, police misconduct, and disability access claims.",
      keywords: "civil rights discrimination police government disability ADA" },

    { url: "business-lawsuits.html", title: "Business Lawsuits", tag: "Overview", category: "Business & Employment",
      desc: "Contracts, partnership disputes, fraud, unfair competition, and commercial litigation.",
      keywords: "business contract partnership fraud commercial" },

    { url: "employment-lawsuits.html", title: "Employment Lawsuits", tag: "Overview", category: "Business & Employment",
      desc: "Wage claims, discrimination, retaliation, harassment, and wrongful termination.",
      keywords: "employment wage discrimination retaliation harassment wrongful termination" },

    { url: "class-action-lawsuits.html", title: "Class Action Lawsuits", tag: "Overview", category: "Business & Employment",
      desc: "Large group claims involving consumers, employees, investors, or defective products.",
      keywords: "class action group claim mass" },

    { url: "consumer-bankruptcy.html", title: "Consumer Bankruptcy", tag: "Overview", category: "Debt & Bankruptcy",
      desc: "Chapter 7 and Chapter 13 basics, the automatic stay, and dischargeable debts.",
      keywords: "consumer bankruptcy chapter 7 chapter 13 automatic stay discharge" },

    { url: "business-bankruptcy.html", title: "Business Bankruptcy", tag: "Overview", category: "Debt & Bankruptcy",
      desc: "Chapter 11 reorganization, Subchapter V, Chapter 7 liquidation, and creditor claims.",
      keywords: "business bankruptcy chapter 11 subchapter v chapter 7 reorganization" },

    { url: "insurance-lawsuits.html", title: "Insurance Lawsuits", tag: "Overview", category: "Property & Insurance",
      desc: "Denied claims, delayed payments, bad faith, and coverage disputes.",
      keywords: "insurance denied claim bad faith coverage" },

    { url: "real-estate-property-lawsuits.html", title: "Real Estate & Property Lawsuits", tag: "Overview", category: "Property & Insurance",
      desc: "Landlord-tenant, boundary, title, HOA disputes, and property damage.",
      keywords: "real estate landlord tenant boundary title HOA property" },

    { url: "construction-lawsuits.html", title: "Construction Lawsuits", tag: "Overview", category: "Property & Insurance",
      desc: "Construction defects, contractor disputes, mechanic's liens, and unsafe work.",
      keywords: "construction contractor defect lien" },

    { url: "lawsuit-defense.html", title: "Lawsuit Defense", tag: "Overview", category: "Lawsuit Defense",
      desc: "Responding to a lawsuit, deadlines, pleadings, default judgments, and hiring defense counsel.",
      keywords: "lawsuit defense defendant sued response deadline" },

    { url: "what-to-do-after-being-sued.html", title: "What To Do After Being Sued", tag: "Guide", category: "Lawsuit Defense",
      desc: "Basic steps after receiving a complaint, summons, demand letter, or other legal notice.",
      keywords: "sued complaint summons demand letter served" },

    { url: "default-judgment.html", title: "Default Judgment", tag: "Guide", category: "Lawsuit Defense",
      desc: "What a default judgment is and why response deadlines matter.",
      keywords: "default judgment deadline response" },

    { url: "california-personal-injury-lawyers.html", title: "California Personal Injury Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "California injury lawyer information and questions to ask before hiring.",
      keywords: "california personal injury lawyer attorney" },

    { url: "asbestos-lawyers.html", title: "Asbestos Lawyers", tag: "Lawyers", category: "State Lawyer Pages",
      desc: "Find an asbestos lawyer by state — what asbestos attorneys do, time limits, and how to compare firms.",
      keywords: "asbestos lawyer attorney mesothelioma law firm by state national find" },

    { url: "mesothelioma-lawyers.html", title: "Mesothelioma Lawyers", tag: "Lawyers", category: "State Lawyer Pages",
      desc: "How mesothelioma lawyers evaluate pleural, peritoneal, and wrongful death claims — fees, time limits, and how to find a mesothelioma attorney near you.",
      keywords: "mesothelioma lawyer attorney near me law firm best pleural peritoneal wrongful death contingency fee asbestos by state" },

    { url: "california-asbestos-lawyers.html", title: "California Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for California-related exposure or illness.",
      keywords: "california asbestos lawyer mesothelioma" },

    { url: "florida-asbestos-lawyers.html", title: "Florida Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for Florida-related exposure or illness.",
      keywords: "florida asbestos lawyer mesothelioma" },

    { url: "illinois-asbestos-lawyers.html", title: "Illinois Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for Illinois-related exposure or illness.",
      keywords: "illinois asbestos lawyer mesothelioma chicago steel railroad" },

    { url: "pennsylvania-asbestos-lawyers.html", title: "Pennsylvania Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for Pennsylvania-related exposure or illness.",
      keywords: "pennsylvania asbestos lawyer mesothelioma pittsburgh steel philadelphia shipyard" },

    { url: "texas-asbestos-lawyers.html", title: "Texas Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos and mesothelioma lawyer information for Texas-related exposure or illness — Gulf Coast refineries, the Houston Ship Channel, and shipyards.",
      keywords: "texas asbestos lawyer mesothelioma houston dallas beaumont port arthur refinery petrochemical gulf coast shipyard ship channel" },

    { url: "new-york-asbestos-lawyers.html", title: "New York Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos and mesothelioma lawyer information for New York-related exposure or illness — Brooklyn Navy Yard, NYC construction, Con Edison plants, and the World Trade Center.",
      keywords: "new york asbestos lawyer mesothelioma nyc brooklyn navy yard con edison construction world trade center 9/11 buffalo bethlehem steel nycal" },

    { url: "michigan-asbestos-lawyers.html", title: "Michigan Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for Michigan-related exposure or illness.",
      keywords: "michigan asbestos lawyer mesothelioma detroit auto foundry" },

    { url: "louisiana-asbestos-lawyers.html", title: "Louisiana Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for Louisiana-related exposure or illness.",
      keywords: "louisiana asbestos lawyer mesothelioma refinery petrochemical avondale shipyard" }
  ];

  // ---------- search logic ----------
  function score(item, q) {
    var t = item.title.toLowerCase();
    var c = (item.category || "").toLowerCase();
    var k = (item.keywords || "").toLowerCase();
    var d = (item.desc || "").toLowerCase();
    if (t === q) return 100;
    if (t.indexOf(q) === 0) return 80;
    if (t.indexOf(q) !== -1) return 60;
    if (k.indexOf(q) !== -1) return 45;
    if (c.indexOf(q) !== -1) return 35;
    if (d.indexOf(q) !== -1) return 20;
    return 0;
  }

  function search(query) {
    var q = query.trim().toLowerCase();
    if (!q) return [];
    var terms = q.split(/\s+/).filter(Boolean);
    return INDEX
      .map(function (item) {
        var s = 0;
        for (var i = 0; i < terms.length; i++) {
          var ts = score(item, terms[i]);
          if (ts === 0) return { item: item, score: 0 };
          s += ts;
        }
        return { item: item, score: s };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (r) { return r.item; });
  }

  // ---------- render ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function render(results, query) {
    var list = document.getElementById("search-results");
    var meta = document.getElementById("search-page-meta");
    var empty = document.getElementById("search-empty");
    var idle = document.getElementById("search-idle");
    var chips = document.getElementById("search-page-chips");

    if (!query) {
      list.innerHTML = "";
      meta.textContent = "";
      empty.hidden = true;
      idle.hidden = false;
      chips.hidden = false;
      return;
    }

    idle.hidden = true;

    if (results.length === 0) {
      list.innerHTML = "";
      meta.textContent = "";
      empty.hidden = false;
      chips.hidden = true;
      return;
    }

    empty.hidden = true;
    chips.hidden = true;
    meta.textContent = results.length + (results.length === 1 ? " result" : " results") + ' for "' + query + '"';
    list.innerHTML = results.map(function (r) {
      return (
        '<li class="search-result">' +
          '<a href="' + escapeHtml(r.url) + '">' +
            '<div class="search-result__top">' +
              '<span class="search-result__tag">' + escapeHtml(r.tag) + '</span>' +
              '<span class="search-result__category">' + escapeHtml(r.category) + '</span>' +
            '</div>' +
            '<h3 class="search-result__title">' + escapeHtml(r.title) + '</h3>' +
            '<p class="search-result__desc">' + escapeHtml(r.desc) + '</p>' +
          '</a>' +
        '</li>'
      );
    }).join("");
  }

  // ---------- wire up ----------
  document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById("search-page-input");
    var clearBtn = document.getElementById("search-page-clear");
    if (!input) return;

    function run(q) {
      render(search(q || ""), (q || "").trim());
      if (clearBtn) clearBtn.hidden = !q;
    }

    // initial query from URL
    var initial = (new URLSearchParams(location.search).get("q") || "").trim();
    if (initial) {
      input.value = initial;
      run(initial);
    } else {
      run("");
    }

    // live typing — update results AND URL (no reload)
    var t;
    input.addEventListener("input", function (e) {
      clearTimeout(t);
      var v = e.target.value;
      t = setTimeout(function () {
        run(v);
        var newUrl = v ? location.pathname + "?q=" + encodeURIComponent(v) : location.pathname;
        history.replaceState(null, "", newUrl);
      }, 100);
    });

    // clear
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = "";
        run("");
        history.replaceState(null, "", location.pathname);
        input.focus();
      });
    }

    // chip clicks — handle without full reload
    var chipsEl = document.getElementById("search-page-chips");
    if (chipsEl) {
      chipsEl.addEventListener("click", function (e) {
        var a = e.target.closest("a");
        if (!a) return;
        e.preventDefault();
        var q = new URLSearchParams(a.search).get("q") || "";
        input.value = q;
        run(q);
        history.replaceState(null, "", location.pathname + (q ? "?q=" + encodeURIComponent(q) : ""));
        input.focus();
      });
    }
  });
})();

/* ============================================================
   Lawsuit Center — search index + results renderer
   Edit the INDEX array below to add/remove searchable pages.
   ============================================================ */

(function () {
  var INDEX = [
    // ----- Free tools -----
    { url: "pfas-exposure-checker",   title: "PFAS Exposure Checker", tag: "Free Tool", category: "Free Tools",
      desc: "Check location, water source, AFFF or industrial exposure, and timeline against active PFAS case categories.",
      keywords: "pfas forever chemicals water afff foam military airport exposure checker tool firefighting" },

    { url: "cancer-exposure-checker", title: "Cancer Exposure Checker", tag: "Free Tool", category: "Free Tools",
      desc: "Four short questions mapping a cancer diagnosis and exposure history to active case categories.",
      keywords: "cancer mesothelioma talc hair relaxer roundup camp lejeune pfas benzene afff exposure checker tool" },

    // ----- Case Review -----
    { url: "cancer-case-review", title: "Cancer Case Review", tag: "Case Review", category: "Cancer",
      desc: "Cancer diagnoses possibly tied to consumer products, workplace exposure, or contaminated water.",
      keywords: "cancer mesothelioma kidney ovarian lung lymphoma leukemia bladder uterine talc roundup zantac asbestos benzene afff camp lejeune" },

    { url: "asbestos-case-review", title: "Asbestos Case Review", tag: "Case Review", category: "Asbestos",
      desc: "Mesothelioma, asbestos-related lung cancer, asbestosis, military or shipyard exposure, or secondhand exposure.",
      keywords: "asbestos mesothelioma lung cancer asbestosis shipyard navy military secondhand" },

    { url: "lung-cancer-asbestos-review", title: "Lung Cancer Asbestos Review", tag: "Case Review", category: "Asbestos",
      desc: "Submit basic information about asbestos exposure history and a lung cancer diagnosis for case review.",
      keywords: "lung cancer asbestos exposure occupational" },

    { url: "social-media-case-review", title: "Social Media Case Review", tag: "Case Review", category: "Digital Platforms",
      desc: "Children or teens with mental health harm tied to Instagram, TikTok, Snapchat, Facebook, YouTube.",
      keywords: "social media instagram tiktok snapchat facebook youtube meta minors teen anxiety depression eating disorder self-harm MDL 3047" },

    { url: "video-game-case-review", title: "Video Game Case Review", tag: "Case Review", category: "Digital Platforms",
      desc: "Compulsive gaming, academic decline, mental health impact, or unauthorized in-game spending involving minors.",
      keywords: "video game gaming addiction minors fortnite roblox in-game purchases" },

    { url: "video-game-lawsuit", title: "Video Game Lawsuit", tag: "Lawsuit", category: "Digital Platforms",
      desc: "Claims alleging games like Roblox and Fortnite were designed to encourage compulsive play in minors. Coordinated in California, no settlement yet.",
      keywords: "video game lawsuit video game addiction lawsuit claim file sign up do i qualify settlement gaming addiction roblox fortnite epic games loot boxes minors who qualifies" },

    { url: "video-game-lawyers", title: "Video Game Lawyers", tag: "Lawyers", category: "Digital Platforms",
      desc: "How video game attorneys evaluate compulsive gaming claims tied to Roblox, Fortnite, and other games, what records help, time limits, and how to compare firms.",
      keywords: "video game addiction lawyer video game lawsuit attorney gaming addiction lawyer roblox lawsuit lawyer fortnite lawsuit attorney video game addiction law firm" },

    { url: "openai-case-review", title: "OpenAI / ChatGPT Case Review", tag: "Case Review", category: "AI Chatbot Harm",
      desc: "Wrongful death, self-harm, fatal drug interaction, or harm involving sustained ChatGPT use.",
      keywords: "openai chatgpt ai chatbot wrongful death suicide overdose violence school shooting product liability" },

    { url: "ai-case-review", title: "AI Case Review", tag: "Case Review", category: "AI Chatbot Harm",
      desc: "Harm involving an AI chatbot, AI-generated deepfake images, or another AI product — chatbot harm, deepfakes, or professional impersonation.",
      keywords: "ai artificial intelligence chatbot lawsuit deepfake nonconsensual images grok xai character ai openai chatgpt wrongful death self-harm medical impersonation take it down act" },

    { url: "pfas-case-review", title: "PFAS Case Review", tag: "Case Review", category: "Water & Environment",
      desc: "PFAS contamination, AFFF firefighting foam, military base or airport exposure, kidney/testicular cancer, thyroid disease, or ulcerative colitis.",
      keywords: "pfas pfoa pfos forever chemicals afff firefighting foam military base airport kidney testicular cancer thyroid ulcerative colitis" },

    { url: "toxic-water-case-review", title: "Toxic Water Case Review", tag: "Case Review", category: "Water & Environment",
      desc: "Contaminated drinking water, well water contamination, or industrial chemical releases.",
      keywords: "toxic water drinking well contamination industrial release" },

    { url: "environmental-contamination-case-review", title: "Environmental Contamination Review", tag: "Case Review", category: "Water & Environment",
      desc: "Exposure through soil, groundwater, industrial sites, landfills, or community conditions.",
      keywords: "environmental contamination soil groundwater landfill industrial superfund" },

    { url: "air-pollution-case-review", title: "Air Pollution Case Review", tag: "Case Review", category: "Water & Environment",
      desc: "Long-term air pollution, industrial emissions, refinery or plant proximity, and respiratory conditions.",
      keywords: "air pollution emissions refinery plant respiratory asthma" },

    { url: "pesticide-case-review", title: "Pesticide Case Review", tag: "Case Review", category: "Chemicals & Pesticides",
      desc: "Glyphosate (Roundup), paraquat, chlorpyrifos, and other pesticide or herbicide exposure.",
      keywords: "pesticide herbicide roundup glyphosate paraquat chlorpyrifos non-hodgkin lymphoma parkinson farmer applicator" },

    { url: "neurological-case-review", title: "Neurological Case Review", tag: "Case Review", category: "Chemicals & Pesticides",
      desc: "Parkinson's, neuropathy, cognitive decline, or movement disorders with exposure history.",
      keywords: "neurological parkinson neuropathy cognitive decline movement disorder pesticide heavy metals" },

    { url: "consumer-product-case-review", title: "Consumer Product Case Review", tag: "Case Review", category: "Products & Food",
      desc: "Allegedly defective, mislabeled, contaminated, or unsafe consumer products and recalls.",
      keywords: "consumer product defective recall mislabeled unsafe" },

    { url: "processed-food-case-review", title: "Processed Food Case Review", tag: "Case Review", category: "Products & Food",
      desc: "Childhood-onset Type 2 diabetes, NAFLD, or metabolic conditions from ultra-processed food.",
      keywords: "processed food ultra-processed type 2 diabetes nafld fatty liver childhood obesity sugar" },

    { url: "reproductive-case-review", title: "Reproductive Injury Case Review", tag: "Case Review", category: "Products & Food",
      desc: "Uterine or ovarian cancer, fertility complications, or reproductive harm tied to long-term product use.",
      keywords: "reproductive uterine ovarian cancer fertility hair relaxer talc talcum prenatal" },

    { url: "talcum-powder-case-review", title: "Talcum Powder Case Review", tag: "Case Review", category: "Products & Food",
      desc: "Long-term talc or baby powder use (Johnson's Baby Powder, Shower to Shower) followed by an ovarian cancer diagnosis.",
      keywords: "talcum powder talc lawsuit ovarian cancer johnson and johnson j&j baby powder shower to shower gold bond attorney lawyer settlement payout who qualifies eligibility deadline mdl 2738" },

    { url: "talcum-powder-lawsuits", title: "Talcum Powder Lawsuit", tag: "Overview", category: "Products & Food",
      desc: "Overview of the talcum powder ovarian cancer litigation (MDL 2738): what the lawsuit is about, who qualifies, settlements, and FAQs.",
      keywords: "talcum powder lawsuit litigation ovarian cancer johnson and johnson j&j talc settlement attorneys lawyers mdl 2738 shower to shower who qualifies average settlement payout deadline class action" },

    { url: "depo-provera-case-review", title: "Depo-Provera Case Review", tag: "Case Review", category: "Drugs & Medical Devices",
      desc: "Long-term Depo-Provera use (or generic medroxyprogesterone acetate) followed by a meningioma brain tumor diagnosis.",
      keywords: "depo-provera depo provera medroxyprogesterone meningioma brain tumor birth control injection MDL 3140" },

    { url: "case-review", title: "General Case Review", tag: "Case Review", category: "General",
      desc: "Not sure where you fit? Describe the situation and we'll review which category may apply.",
      keywords: "general case review intake start" },

    // ----- Overviews -----
    { url: "asbestos-lawsuits", title: "Asbestos Lawsuits", tag: "Overview", category: "Asbestos",
      desc: "Main asbestos hub: exposure history, illnesses tied to asbestos, and how case review works.",
      keywords: "asbestos lawsuits overview mesothelioma exposure" },

    { url: "lung-cancer-from-asbestos-exposure", title: "Lung Cancer From Asbestos Exposure", tag: "Overview", category: "Asbestos",
      desc: "Background on lung cancer claims involving asbestos exposure history.",
      keywords: "lung cancer asbestos" },

    { url: "social-media-addiction-lawsuit", title: "Social Media Addiction Lawsuit", tag: "Overview", category: "Digital Platforms",
      desc: "Background on allegations that platforms used addictive design features harming youth mental health.",
      keywords: "social media addiction lawsuit design features youth teens" },

    { url: "social-media-lawyers", title: "Social Media Lawyers", tag: "Lawyers", category: "Digital Platforms",
      desc: "How social media harm attorneys evaluate youth mental health and addiction claims, what records help, MDL 3047, time limits, and how to compare firms.",
      keywords: "social media lawyer social media attorney social media harm lawyer social media mental health lawyer sue social media addiction lawyer to sue instagram mdl 3047 youth teens" },

    { url: "instagram-lawsuit", title: "Instagram Lawsuit", tag: "Overview", category: "Digital Platforms",
      desc: "What the Instagram lawsuits are about, who may be affected, MDL 3047, what to gather, and time limits.",
      keywords: "instagram lawsuit meta instagram class action instagram lawyer to sue instagram teen mental health addiction mdl 3047 youth harm social media social media lawsuit social media addiction" },

    { url: "tiktok-lawsuit", title: "TikTok Lawsuit", tag: "Overview", category: "Digital Platforms",
      desc: "What the TikTok lawsuits are about, who may be affected, MDL 3047, what to gather, and time limits.",
      keywords: "tiktok lawsuit bytedance tiktok addiction teen mental health youth harm mdl 3047 recommendation algorithm social media social media lawsuit social media addiction" },

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

    { url: "water-contamination-lawsuits", title: "Water Contamination Lawsuits", tag: "Overview", category: "Water & Environment",
      desc: "Background on contaminated drinking water and long-term community water exposure claims.",
      keywords: "water contamination drinking groundwater community" },

    { url: "pfas-lawsuit", title: "PFAS Lawsuits", tag: "Overview", category: "Water & Environment",
      desc: "Overview of PFAS forever chemicals litigation, including water contamination, AFFF firefighting foam, related illnesses, lawyer guides, and case review.",
      keywords: "pfas lawsuit lawsuits forever chemicals afff firefighting foam water contamination kidney testicular cancer thyroid claim settlement case review" },
    { url: "pfas-water-contamination-lawsuits", title: "PFAS Water Contamination", tag: "Overview", category: "Water & Environment",
      desc: "Forever chemicals near military bases, airports, and industrial facilities.",
      keywords: "pfas pfoa pfos water contamination military airport industrial" },

    { url: "environmental-contamination-lawsuits", title: "Environmental Contamination Lawsuits", tag: "Overview", category: "Water & Environment",
      desc: "Background on exposure through air, soil, groundwater, or community conditions.",
      keywords: "environmental contamination air soil groundwater community" },

    { url: "chemical-exposure-lawsuits", title: "Chemical Exposure Lawsuits", tag: "Overview", category: "Chemicals & Pesticides",
      desc: "Toxic substances, repeated exposure, contaminated property, and workplace exposure.",
      keywords: "chemical exposure toxic workplace occupational" },

    { url: "who-may-qualify-for-a-chemical-exposure-lawsuit", title: "Who May Qualify for a Chemical Exposure Lawsuit", tag: "Overview", category: "Chemicals & Pesticides",
      desc: "Common qualification factors, exposure patterns, and information people gather before pursuing a claim.",
      keywords: "qualify chemical exposure lawsuit eligibility" },

    { url: "paraquat-lawsuit", title: "Paraquat Parkinson's Lawsuit", tag: "Overview", category: "Chemicals & Pesticides",
      desc: "Long-term paraquat or Gramoxone exposure linked to Parkinson's disease, consolidated in MDL 3004 — who may qualify and how case review works.",
      keywords: "paraquat parkinson gramoxone herbicide exposure lawsuit mdl 3004 syngenta chevron farmer applicator settlement attorney lawyer dichloride" },

    { url: "roundup-lawsuit", title: "Roundup Lawsuit", tag: "Overview", category: "Chemicals & Pesticides",
      desc: "Glyphosate-based herbicides and alleged links to non-Hodgkin lymphoma.",
      keywords: "roundup glyphosate monsanto bayer non-hodgkin lymphoma cancer" },

    { url: "hair-relaxer-lawsuit", title: "Hair Relaxer Lawsuit", tag: "Overview", category: "Chemicals & Pesticides",
      desc: "Chemical hair relaxer products and alleged long-term reproductive health risks.",
      keywords: "hair relaxer chemical reproductive uterine ovarian cancer fibroid" },

    { url: "product-liability-lawsuits", title: "Product Liability Lawsuits", tag: "Overview", category: "Products & Food",
      desc: "Background on allegedly defective, unsafe, mislabeled, or harmful consumer products and devices.",
      keywords: "product liability defective recall consumer device" },

    { url: "depo-provera", title: "Depo-Provera Meningioma Lawsuit", tag: "Overview", category: "Drugs & Medical Devices",
      desc: "Background on the Depo-Provera meningioma litigation (MDL 3140), who qualifies, and FAQs.",
      keywords: "depo provera depo-provera meningioma brain tumor mdl 3140 birth control" },

    { url: "depo-provera-lawyers", title: "Depo-Provera Lawyers", tag: "Lawyers", category: "Drugs & Medical Devices",
      desc: "How Depo-Provera attorneys evaluate meningioma claims, what records help, MDL 3140, time limits, and how to compare firms.",
      keywords: "depo provera lawyer depo provera lawyers depo provera attorney depo provera lawsuit lawyers medroxyprogesterone meningioma brain tumor mdl 3140 drug injury" },

    { url: "drug-injury-lawsuits", title: "Drug Injury Lawsuits", tag: "Overview", category: "Drugs & Medical Devices",
      desc: "Prescription medications, side effects, warning issues, and medication-related injuries.",
      keywords: "drug injury prescription medication side effect warning" },

    { url: "medical-device-lawsuits", title: "Medical Device Lawsuits", tag: "Overview", category: "Drugs & Medical Devices",
      desc: "Implants, surgical mesh, joint replacements, complications, recalls, and alleged defects.",
      keywords: "medical device implant surgical mesh joint replacement hip knee recall" },

    { url: "ozempic-lawsuit", title: "Ozempic / GLP-1 Lawsuits", tag: "Overview", category: "Drugs & Medical Devices",
      desc: "GLP-1 medications and reported gastrointestinal complications.",
      keywords: "ozempic glp-1 wegovy mounjaro semaglutide gastroparesis stomach paralysis" },

    { url: "personal-injury-lawsuits", title: "Personal Injury Lawsuits", tag: "Overview", category: "Personal Injury",
      desc: "Background on accident, negligence, and injury-related claim categories.",
      keywords: "personal injury accident negligence" },

    { url: "consumer-lawsuits", title: "Consumer Lawsuits", tag: "Overview", category: "Consumer & Financial",
      desc: "False advertising, billing disputes, defective products, scams, and consumer protection.",
      keywords: "consumer protection false advertising billing scam" },

    { url: "financial-lawsuits", title: "Financial Lawsuits", tag: "Overview", category: "Consumer & Financial",
      desc: "Investment losses, financial misconduct, securities, and consumer finance claims.",
      keywords: "financial investment securities ponzi misconduct" },

    { url: "banking-lending-lawsuits", title: "Banking & Lending Lawsuits", tag: "Overview", category: "Consumer & Financial",
      desc: "Bank fees, mortgage servicing, credit reporting, debt collection, and predatory lending.",
      keywords: "banking lending mortgage credit report debt collection predatory" },

    { url: "privacy-data-breach-lawsuits", title: "Privacy & Data Breach Lawsuits", tag: "Overview", category: "Privacy & Civil Rights",
      desc: "Data breaches, biometric privacy, tracking, and exposed personal information.",
      keywords: "privacy data breach biometric tracking pixel BIPA" },

    { url: "defamation-reputation-lawsuits", title: "Defamation & Reputation Lawsuits", tag: "Overview", category: "Privacy & Civil Rights",
      desc: "Libel, slander, online reviews, social media posts, and reputation harm.",
      keywords: "defamation libel slander reputation review" },

    { url: "civil-rights-lawsuits", title: "Civil Rights Lawsuits", tag: "Overview", category: "Privacy & Civil Rights",
      desc: "Discrimination, government misconduct, police misconduct, and disability access claims.",
      keywords: "civil rights discrimination police government disability ADA" },

    { url: "business-lawsuits", title: "Business Lawsuits", tag: "Overview", category: "Business & Employment",
      desc: "Contracts, partnership disputes, fraud, unfair competition, and commercial litigation.",
      keywords: "business contract partnership fraud commercial" },

    { url: "employment-lawsuits", title: "Employment Lawsuits", tag: "Overview", category: "Business & Employment",
      desc: "Wage claims, discrimination, retaliation, harassment, and wrongful termination.",
      keywords: "employment wage discrimination retaliation harassment wrongful termination" },

    { url: "class-action-lawsuits", title: "Class Action Lawsuits", tag: "Overview", category: "Business & Employment",
      desc: "Large group claims involving consumers, employees, investors, or defective products.",
      keywords: "class action group claim mass" },

    { url: "consumer-bankruptcy", title: "Consumer Bankruptcy", tag: "Overview", category: "Debt & Bankruptcy",
      desc: "Chapter 7 and Chapter 13 basics, the automatic stay, and dischargeable debts.",
      keywords: "consumer bankruptcy chapter 7 chapter 13 automatic stay discharge" },

    { url: "business-bankruptcy", title: "Business Bankruptcy", tag: "Overview", category: "Debt & Bankruptcy",
      desc: "Chapter 11 reorganization, Subchapter V, Chapter 7 liquidation, and creditor claims.",
      keywords: "business bankruptcy chapter 11 subchapter v chapter 7 reorganization" },

    { url: "insurance-lawsuits", title: "Insurance Lawsuits", tag: "Overview", category: "Property & Insurance",
      desc: "Denied claims, delayed payments, bad faith, and coverage disputes.",
      keywords: "insurance denied claim bad faith coverage" },

    { url: "real-estate-property-lawsuits", title: "Real Estate & Property Lawsuits", tag: "Overview", category: "Property & Insurance",
      desc: "Landlord-tenant, boundary, title, HOA disputes, and property damage.",
      keywords: "real estate landlord tenant boundary title HOA property" },

    { url: "construction-lawsuits", title: "Construction Lawsuits", tag: "Overview", category: "Property & Insurance",
      desc: "Construction defects, contractor disputes, mechanic's liens, and unsafe work.",
      keywords: "construction contractor defect lien" },

    { url: "lawsuit-defense", title: "Lawsuit Defense", tag: "Overview", category: "Lawsuit Defense",
      desc: "Responding to a lawsuit, deadlines, pleadings, default judgments, and hiring defense counsel.",
      keywords: "lawsuit defense defendant sued response deadline" },

    { url: "what-to-do-after-being-sued", title: "What To Do After Being Sued", tag: "Guide", category: "Lawsuit Defense",
      desc: "Basic steps after receiving a complaint, summons, demand letter, or other legal notice.",
      keywords: "sued complaint summons demand letter served" },

    { url: "default-judgment", title: "Default Judgment", tag: "Guide", category: "Lawsuit Defense",
      desc: "What a default judgment is and why response deadlines matter.",
      keywords: "default judgment deadline response" },

    { url: "california-personal-injury-lawyers", title: "California Personal Injury Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "California injury lawyer information and questions to ask before hiring.",
      keywords: "california personal injury lawyer attorney" },

    { url: "asbestos-lawyers", title: "Asbestos Lawyers", tag: "Lawyers", category: "State Lawyer Pages",
      desc: "Find an asbestos lawyer by state — what asbestos attorneys do, time limits, and how to compare firms.",
      keywords: "asbestos lawyer attorney mesothelioma law firm by state national find" },

    { url: "mesothelioma-lawyers", title: "Mesothelioma Lawyers", tag: "Lawyers", category: "State Lawyer Pages",
      desc: "How mesothelioma lawyers evaluate pleural, peritoneal, and wrongful death claims — fees, time limits, and how to find a mesothelioma attorney near you.",
      keywords: "mesothelioma lawyer attorney near me law firm best pleural peritoneal wrongful death contingency fee asbestos by state" },

    { url: "pfas-lawyers", title: "PFAS Lawyers", tag: "Lawyers", category: "State Lawyer Pages",
      desc: "Find a PFAS lawyer for forever chemicals claims, including water contamination and AFFF firefighting foam, plus what records help and how to compare firms.",
      keywords: "pfas lawyer attorney forever chemicals afff firefighting foam water contamination kidney testicular cancer thyroid law firm find national" },

    { url: "roundup-lawyers", title: "Roundup Lawyers", tag: "Lawyers", category: "State Lawyer Pages",
      desc: "Find a Roundup lawyer for glyphosate exposure and non-Hodgkin lymphoma claims, plus how settlements and deadlines work and how to compare firms.",
      keywords: "roundup lawyer attorney glyphosate cancer lawyer non-hodgkin lymphoma best attorney for roundup lawsuit monsanto bayer settlement law firm find pesticide herbicide" },

    { url: "hair-relaxer-lawyers", title: "Hair Relaxer Lawyers", tag: "Lawyers", category: "State Lawyer Pages",
      desc: "Find a hair relaxer lawyer for uterine, endometrial, or ovarian cancer claims tied to chemical straighteners, plus how MDL 3060 settlements and deadlines work and how to compare firms.",
      keywords: "hair relaxer lawyer attorney chemical straightener uterine cancer endometrial ovarian cancer mdl 3060 settlement payout class action morgan and morgan ben crump loreal revlon law firm find fibroids" },

    { url: "tylenol-autism-lawsuit", title: "Tylenol Autism Lawsuit", tag: "Lawsuit", category: "Consumer Products",
      desc: "Claims alleging failure to warn about a possible association between prenatal acetaminophen exposure and autism or ADHD. Litigation active but unsettled, federal appeal pending.",
      keywords: "tylenol autism lawsuit tylenol lawsuit acetaminophen autism adhd class action sign up age limit settlement update pregnancy johnson and johnson kenvue mdl daubert appeal who qualifies" },

    { url: "baby-food-lawsuit", title: "Baby Food Lawsuit", tag: "Lawsuit", category: "Consumer Products",
      desc: "Claims alleging heavy metals in baby foods from Gerber, Beech-Nut, and others, linked in litigation to autism and ADHD diagnoses. MDL 3101, no settlement yet.",
      keywords: "baby food lawsuit toxic baby food gerber gerbers beech nut heavy metals lead arsenic autism adhd claim file sign up do i qualify settlement mdl 3101 who qualifies" },

    { url: "baby-food-lawyers", title: "Baby Food Lawyers", tag: "Lawyers", category: "Consumer Products",
      desc: "How baby food attorneys evaluate autism and ADHD claims tied to alleged heavy metals, what records help, MDL 3101, time limits, and how to compare firms.",
      keywords: "baby food lawyer baby food lawyers baby food autism lawsuit lawyer baby food autism attorney toxic baby food law firm gerber lawyer beech nut attorney heavy metals" },

    { url: "california-asbestos-lawyers", title: "California Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for California-related exposure or illness.",
      keywords: "california asbestos lawyer mesothelioma" },

    { url: "florida-asbestos-lawyers", title: "Florida Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for Florida-related exposure or illness.",
      keywords: "florida asbestos lawyer mesothelioma" },

    { url: "illinois-asbestos-lawyers", title: "Illinois Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for Illinois-related exposure or illness.",
      keywords: "illinois asbestos lawyer mesothelioma chicago steel railroad" },

    { url: "pennsylvania-asbestos-lawyers", title: "Pennsylvania Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for Pennsylvania-related exposure or illness.",
      keywords: "pennsylvania asbestos lawyer mesothelioma pittsburgh steel philadelphia shipyard" },

    { url: "texas-asbestos-lawyers", title: "Texas Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos and mesothelioma lawyer information for Texas-related exposure or illness — Gulf Coast refineries, the Houston Ship Channel, and shipyards.",
      keywords: "texas asbestos lawyer mesothelioma houston dallas beaumont port arthur refinery petrochemical gulf coast shipyard ship channel" },

    { url: "new-york-asbestos-lawyers", title: "New York Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos and mesothelioma lawyer information for New York-related exposure or illness — Brooklyn Navy Yard, NYC construction, Con Edison plants, and the World Trade Center.",
      keywords: "new york asbestos lawyer mesothelioma nyc brooklyn navy yard con edison construction world trade center 9/11 buffalo bethlehem steel nycal" },

    { url: "michigan-asbestos-lawyers", title: "Michigan Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
      desc: "Asbestos lawyer information for Michigan-related exposure or illness.",
      keywords: "michigan asbestos lawyer mesothelioma detroit auto foundry" },

    { url: "louisiana-asbestos-lawyers", title: "Louisiana Asbestos Lawyers", tag: "State Page", category: "State Lawyer Pages",
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

const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

//  Your test scenarios (Pos_Fun should pass, Neg_Fun intentionally wrong expected => fail)
const scenarios = [
  { id: "Pos_Fun_0001", name: "Convert a simple sentence", input: "mama gedhara yanavaa.", expected: "මම ගෙදර යනවා.", shouldPass: true },
  { id: "Pos_Fun_0002", name: "request sentence", input: "mata bath oonee.", expected: "මට බත් ඕනේ.", shouldPass: true },
  { id: "Pos_Fun_0003", name: "Compound sentence with conjunction", input: "api kaeema kanna yanavaa saha passe chithrapatayakuth balanavaa.", expected: "අපි කෑම කන්න යනවා සහ පස්සෙ චිත්‍රපටයකුත් බලනවා.", shouldPass: true },
  { id: "Pos_Fun_0004", name: "Complex sentence (condition)", input: "oya enavaanam mama balan innavaa.", expected: "ඔය එනවානම් මම බලන් ඉන්නවා.", shouldPass: true },
  { id: "Pos_Fun_0005", name: "Interrogative greeting with punctuation", input: "oyaata kohomadha?", expected: "ඔයාට කොහොමද?", shouldPass: true },

  { id: "Pos_Fun_0006", name: "Imperative command", input: "vahaama enna.", expected: "වහාම එන්න.", shouldPass: true },
  { id: "Pos_Fun_0007", name: "Past tense statement", input: "api iiyee giyaa.", expected: "අපි ඊයේ ගියා.", shouldPass: true },
  { id: "Pos_Fun_0008", name: "Future tense plan", input: "mama heta yannam.", expected: "මම හෙට යන්නම්.", shouldPass: true },
  { id: "Pos_Fun_0009", name: "Compound sentence with “and”", input: "mama bath kanavaa saha tii bonavaa.", expected: "මම බත් කනවා සහ ටී බොනවා.", shouldPass: true },
  { id: "Pos_Fun_0010", name: "Complex sentence", input: "mama late una mokadha bus eka aavee nae.", expected: "මම late උන මොකද bus එක ආවේ නැ.", shouldPass: true },

  { id: "Pos_Fun_0011", name: "Conditional complex sentence", input: "oya enavanam mama balannam.", expected: "ඔය එනවනම් මම බලන්නම්.", shouldPass: true },
  { id: "Pos_Fun_0012", name: "Command: do something", input: "meeka dhaanna.", expected: "මේක දාන්න.", shouldPass: true },
  { id: "Pos_Fun_0013", name: "Repeated word emphasis", input: "hari hari.", expected: "හරි හරි.", shouldPass: true },
  { id: "Pos_Fun_0014", name: "Present tense", input: "mama dhaen vaeda karanavaa.", expected: "මම දැන් වැඩ කරනවා.", shouldPass: true },
  { id: "Pos_Fun_0015", name: "English brand retention", input: "Zoom meeting ekak thiyennee.", expected: "Zoom meeting එකක් තියෙන්නේ.", shouldPass: true },

  { id: "Pos_Fun_0016", name: "Future tense", input: "mama heta enavaa.", expected: "මම හෙට එනවා.", shouldPass: true },
  { id: "Pos_Fun_0017", name: "Place name handling", input: "api trip eka Kandy valata yamudha", expected: "අපි trip එක Kandy වලට යමුද", shouldPass: true },
  { id: "Pos_Fun_0018", name: "Abbreviation retention", input: "mata OTP eka evanna.", expected: "මට OTP එක එවන්න.", shouldPass: true },
  { id: "Pos_Fun_0019", name: "Currency format", input: "Rs. 5343 gevanna.", expected: "Rs. 5343 ගෙවන්න.", shouldPass: true },
  { id: "Pos_Fun_0020", name: "Multiple spaces handling", input: "mama gedhara yanavaa.", expected: "මම ගෙදර යනවා.", shouldPass: true },

  { id: "Pos_Fun_0021", name: "Line break input", input: "mama gedhara yanavaa.\noya enavadha?", expected: "මම ගෙදර යනවා.\nඔය එනවද?", shouldPass: true },
  { id: "Pos_Fun_0022", name: "Polite response", input: "hari, mama karannam.", expected: "හරි, මම කරන්නම්.", shouldPass: true },
  { id: "Pos_Fun_0023", name: "Slang phrase", input: "ela machan!", expected: "එල මචන්!", shouldPass: true },
  { id: "Pos_Fun_0024", name: "Long paragraph input", input: "dhitvaa suLi kuNaatuva samaGa aethi vuu gQQvathura saha naayayaeem heethuven maarga sQQvarDhana aDhikaariya sathu maarga kotas 430k vinaashayata pathva aethi athara, ehi samastha dhiga pramaaNaya kiloomiitar 300k pamaNa vana bava pravaahana,mahaamaarga saha naagarika sQQvarDhana amaathYA bimal rathnaayaka saDHahan kaLeeya.", expected: "දිට්වා සුළි කුණාටුව සමඟ ඇති වූ ගංවතුර සහ නායයෑම් හේතුවෙන් මාර්ග සංවර්ධන අධිකාරිය සතු මාර්ග කොටස් 430ක් විනාශයට පත්ව ඇති අතර, එහි සමස්ත දිග ප්‍රමාණය කිලෝමීටර් 300ක් පමණ වන බව ප්‍රවාහන,මහාමාර්ග සහ නාගරික සංවර්ධන අමාත්‍ය බිමල් රත්නායක සඳහන් කළේය.", shouldPass: true },

  { id: "Pos_UI_0001", name: "Real-time output update", input: "mama gedhara yanavaa", expected: "මම ගෙදර යනවා", shouldPass: true },

  //  Intentionally wrong expected output => these should FAIL in report
  { id: "Neg_Fun_0001", name: "Joined words stress test", input: "mamagedharayanavaa", expected: "මම ගෙදර යනවා.", shouldPass: false },
  { id: "Neg_Fun_0002", name: "Typo handling", input: "mata bath oone.", expected: "මට බත් ඕනේ.", shouldPass: false },
  { id: "Neg_Fun_0003", name: "Mixed English overload", input: "api meeting eka cancel karala reschedule karamuu.", expected: "අපි meeting එක cancel කරලා reschedule කරමු.", shouldPass: false },
  { id: "Neg_Fun_0004", name: "Slang with discourse particle", input: "adoo mokakda bn meeka?", expected: "අඩෝ මොකක්ද බං මේක", shouldPass: false },
  { id: "Neg_Fun_0005", name: "Excessive punctuation", input: "mokakda????", expected: "මොකක්ඩ", shouldPass: false },
  { id: "Neg_Fun_0006", name: "Emoji in input", input: "mama gedharayanavaa  😊", expected: "මම ගෙදර යනවා 😊", shouldPass: false },
  { id: "Neg_Fun_0007", name: "Random characters", input: "mama @@ gedharayanavaa", expected: "මම  @@ ගෙදර යනවා", shouldPass: false },
  { id: "Neg_Fun_0008", name: "Very long joined paragraph", input: "mama iiyee office giyaa namuth traffic thibba nisaa late vunee. manager mata kiyuvvaa report eka 2025-12-25 wenakam submit karanna kiyalaa, habai computer eka crash vuna nisaa eeka hariyata karanna baeri vunee. dhaen api heta Zoom meeting ekak daala thiyenavaa 7.30 AM, eeka WhatsApp group eke share karanna kiyuvvath link eka evune naehae. mata dhanne naehae mehema deval ekka vaeda karanna kohomadha kiyalaa. api mehema deva ganna system eka long, meaningful paragraph ekak hariyata Sinhala convert karannehariyathadha kiyalaa test karanavaa.", expected: "මම ඉයේ office ගියා, නමුත් traffic තිබ්බ නිසා late උනා. manager මට කිව්වා report එක 2025-12-25 වෙනකම් submit කරන්න කියලා, හැබැයි computer එක crash උනා නිසා ඒක හරියට කරන්න බැරි උනා. දැන් අපි හෙට Zoom meeting එකක් 7.30 AM දාලා තියෙනවා, ඒක WhatsApp group එකේ share කරන්න කිව්වට link එක එවුනේ නැහැ. මට දන්නේ නැහැ මෙහෙම දේවල් එක්ක වැඩ කරන්න කොහොමද කියලා. System එක long meaningful paragraph එකක් නිවැරදිව convert කරන්න ඕන.", shouldPass: false },
  { id: "Neg_Fun_0009", name: "Mixed language type", input: "api Kandy yamu plz", expected: "අපි Kandy යමු", shouldPass: false },
  { id: "Neg_Fun_0010", name: "Line break misplacement", input: "api yamu\n\nheta", expected: "අපි යමු    හෙට", shouldPass: false }
];

/* -------------------- GLOBAL SETTINGS FOR DEMO -------------------------- */
//  typing delay per character (increase for slower demo)
const TYPE_DELAY_MS = 120; // try 150 / 200 for slower

//  where output appears on SwiftTranslator page
const OUTPUT_SELECTOR = "div.whitespace-pre-wrap.overflow-y-auto";

//  screenshots folder
const screenshotsDir = path.join(__dirname, "..", "screenshots");
fs.mkdirSync(screenshotsDir, { recursive: true });

for (const scenario of scenarios) {
  test(`${scenario.id}: ${scenario.name}`, async ({ page }) => {
    test.setTimeout(90 * 1000);

    // 1) Open SwiftTranslator
    await page.goto("https://www.swifttranslator.com/", {
      waitUntil: "domcontentloaded",
      timeout: 60_000
    });

    // 2) Find input field (SwiftTranslator typically has textarea)
    const inputBox = page.locator("textarea").first();
    await expect(inputBox).toBeVisible({ timeout: 15_000 });

    // 3) Clear and type SLOWLY
    await inputBox.fill("");
    await inputBox.type(scenario.input, { delay: TYPE_DELAY_MS });

    // 4) Wait until output has text
    await page.waitForFunction(
      (sel) => {
        const el = document.querySelector(sel);
        return el && el.textContent && el.textContent.trim().length > 0;
      },
      OUTPUT_SELECTOR,
      { timeout: 20_000 }
    );

    // 5) Read output
    const outputDiv = page.locator(OUTPUT_SELECTOR).first();
    const actualOutput = (await outputDiv.innerText()).trim();

    console.log(`TC ID: ${scenario.id} | Actual: ${actualOutput}`);

    // 6) Screenshot evidence
    await page.screenshot({
      path: path.join(screenshotsDir, `${scenario.id}.png`),
      fullPage: true
    });

    // 7) Assert
    // Pos_Fun expected to pass (exact match)
    // Neg_Fun expected to fail (because expected is wrong)
    expect(actualOutput).toBe(scenario.expected);
  });
}

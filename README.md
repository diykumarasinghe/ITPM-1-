# ITPM Assignment 1 – SwiftTranslator (Singlish → Sinhala) Playwright Automation

This repository contains **Playwright automation** for **functional and UI test scenarios** executed on the live web application:

🔗 https://www.swifttranslator.com/

The automation validates the accuracy of **Singlish → Sinhala translation**, real-time UI behavior, and system limitations using **positive and negative test cases** as required for the ITPM Assignment 1.

---

## 🎯 Assignment Objective

The main objective of this assignment is to:
- Test an existing real-world system
- Validate functional correctness and UI behavior
- Identify both correct behavior and failure scenarios
- Automate test execution using Playwright

Only **UI and functional behavior** are tested.  
❌ Backend APIs, performance testing, and security testing are **out of scope**.

---

## 🧪 Test Coverage

### ✔ Functional Coverage
- Simple, compound, and complex sentences
- Interrogative and imperative sentences
- Past, present, and future tenses
- Polite language, slang, and daily conversations
- Mixed content (English words, brand names, places)
- Long paragraph inputs
- Line breaks and punctuation handling

### ✔ Test Types
- **Pos_Fun** – Positive functional test cases (expected to PASS)
- **Neg_Fun** – Negative functional test cases (intentionally expected to FAIL)
- **UI test** – Real-time output update validation

---

## 🛠️ Technologies Used

- **Playwright** – Automation framework
- **Node.js** – Runtime environment
- **JavaScript**
- **Chromium Browser**
- **Excel** – Test case management
- **Playwright HTML Reporter**

---

## 📁 Project Structure

IT23770638/
│
├── tests/
│ ├── positive.spec.js # Pos_Fun & Neg_Fun automated tests
│ └── example.spec.ts
│
├── screenshots/ # Screenshot evidence for each test case
├── playwright-report/ # HTML test report
├── test-results/ # Raw Playwright results
├── out/ # JSON / Excel outputs
│
├── IT23770638.xlsx # Excel test case file
├── playwright.config.ts # Playwright configuration (slow motion enabled)
├── package.json
├── README.md


---

 ## Prerequisites

Ensure the following are installed before running the project:

- **Node.js 18+** (recommended)
- **npm 9+**

Verify using:
```bash
node -v
npm -v

⚙️ Setup

Install dependencies and Playwright browsers:

npm install
npx playwright install

▶️ Run Tests
Run all tests (headless)
npx playwright test

Run tests with visible browser (recommended for demo / viva)
npx playwright test --headed

Run only SwiftTranslator automation tests
npx playwright test tests/positive.spec.js --headed


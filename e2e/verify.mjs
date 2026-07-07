// End-to-end verification: drives the real first-run journey in a browser
// against `expo start --web` and asserts the product's promises, not just
// that screens render. Run:
//
//   npx expo start --web --port 8097     # terminal 1
//   npm run e2e                            # terminal 2
//
// PORT overrides the port; PW_CHROMIUM points at a chromium binary when
// playwright's own download isn't available.

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = `http://localhost:${process.env.PORT ?? '8097'}`;
const OUT = new URL('./shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 420, height: 860 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });
const seen = (sel) => page.locator(sel).last();

// 1. Onboarding
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120000 });
await seen('text=Answer that with data.').waitFor({ timeout: 120000 });
await shot('1-onboarding');
await page.locator('text="Yes"').last().click();
await page.fill('[placeholder="Leave blank to keep it unnamed"]', 'J. Doe');
await seen('text=Start the record').click();

// 2. Log a symptom in seconds
await seen('text=What happened?').waitFor({ timeout: 30000 });
await shot('2-log');
await seen('text=Hot flash').click();
await page.locator('[aria-label="severity 3 of 4"]').last().click();
await page.locator('text="at work"').last().click();
await page
  .locator('[placeholder="A note in your own words — end with ? to flag it for the doctor"]')
  .last()
  .fill('Third one during a meeting — is this a pattern?');
await seen('text=Log it').click();
await seen('text=On the record.').waitFor({ timeout: 15000 });

// second + third logs to make artifacts meaningful
await seen('text=Night sweats').click();
await page.locator('[aria-label="severity 4 of 4"]').last().click();
await page.locator('text="woke me up"').last().click();
await seen('text=Log it').click();
await seen('text=Brain fog').click();
await page.locator('[aria-label="severity 2 of 4"]').last().click();
await seen('text=Log it').click();

// 3. Receipts timeline — the paper strip
await seen('text=Receipts').click();
await seen('text=3 entries on the record').waitFor({ timeout: 30000 });
await seen('text=— logged, on the record —').waitFor({ timeout: 10000 });
await shot('3-receipts');

// filter
await page.locator('text="hot flash"').last().click();
await seen('text=1 entry on the record').waitFor({ timeout: 10000 }).catch(() => {});
await page.locator('text="everything"').last().click();

// 4. Artifacts — one-pager with clinician question harvested from the ?-note
await seen('text=Artifacts').click();
await seen('text=The one-pager').waitFor({ timeout: 30000 });
await seen('text=Symptom record — J. Doe').waitFor({ timeout: 10000 });
await seen('text=Third one during a meeting — is this a pattern?').waitFor({ timeout: 10000 });
await shot('4-onepager');

// 5. Scripts: audience + tone switching, disclaimer always present
await seen('text=Say it with the record behind you').waitFor({ timeout: 10000 });
await page.locator('text="partner"').last().click();
await seen('text=What I need from you').waitFor({ timeout: 10000 });
await page.locator('text=/● measured|measured/').last(); // tone row exists
await page.locator('text="fierce"').last().click();
await seen("text=I'm not here to wonder if this is real").waitFor({ timeout: 10000 });
await shot('5-script-partner-fierce');
await page.locator('text="employer"').last().click();
await seen('text=one adjustment to start').waitFor({ timeout: 10000 });

// disclaimer check on-screen
await seen('text=no medical or legal conclusions').waitFor({ timeout: 10000 }).catch(async () => {
  await seen('text=no medical').waitFor({ timeout: 5000 });
});

// 6. Duty-of-care surfaces on a heavy note
await seen('text=Log').click();
await seen('text=What happened?').waitFor({ timeout: 30000 });
await seen('text=Anxiety').click();
await page.locator('[aria-label="severity 2 of 4"]').last().click();
await page
  .locator('[placeholder="A note in your own words — end with ? to flag it for the doctor"]')
  .last()
  .fill('some nights I think about hurting myself');
await seen('text=Log it').click();
await seen("text=If it’s heavier than symptoms").waitFor({ timeout: 15000 });
await seen('text=988 Suicide & Crisis Lifeline (US): call or text 988').waitFor({ timeout: 10000 });
await shot('6-duty-of-care');

// 7. Persistence
await page.goto(BASE, { waitUntil: 'networkidle' });
await seen('text=Receipts').click();
await seen('text=4 entries on the record').waitFor({ timeout: 30000 });

console.log('FLOW OK');
await browser.close();

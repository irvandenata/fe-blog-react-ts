import url from 'url';
import { createRunner, PuppeteerRunnerExtension } from '@puppeteer/replay';
import puppeteer from 'puppeteer';
import fs from 'fs';

export async function run(extensionData) {
  // Launch browser (Brave) dengan opsi window full screen
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    slowMo: 50,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--start-fullscreen'
    ]
  });

  const page = await browser.newPage();

  // Custom Extension turunan PuppeteerRunnerExtension
  class Extension extends PuppeteerRunnerExtension {
    constructor(browser, page, timeout = 7000) {
      super(browser, page, timeout);
      this.results = [];
    }

    async beforeAllSteps(flow) {
      await super.beforeAllSteps(flow);
      console.log('Starting run flow...');
    }

    async beforeEachStep(step, flow) {
      await super.beforeEachStep(step, flow);
      console.log(`Before step: ${step.type}`);
    }

    async afterEachStep(step, flow) {
      await super.afterEachStep(step, flow);
      console.log(`After step: ${step.type}`);

      // Ambil URL saat ini
      const currentUrl = this.page.url();

      // Contoh: ambil value input #email jika ada
      let emailValue = null;
      try {
        emailValue = await this.page.$eval('#email', el => el.value);
      } catch (err) {
        // elemen #email mungkin tidak ada, abaikan error
      }

      // Simpan hasil step ini
      this.results.push({
        stepType: step.type,
        url: currentUrl,
        emailValue: emailValue
      });
    }

    async afterAllSteps(flow) {
      await super.afterAllSteps(flow);
      console.log('Flow selesai.');

      // Tampilkan semua hasil yang dikumpulkan
      console.log('Hasil semua step:');
      this.results.forEach((res, idx) => {
        console.log(`#${idx + 1} Step: ${res.stepType}, URL: ${res.url}, Email: ${res.emailValue}`);
      });

      // Tutup browser setelah selesai
    //   await this.browser.close();

    }
  }

  // Buat runner dengan extension kustom dan data flow dari JSON
  const runner = await createRunner(new Extension(browser, page, 7000), {
    extensionData,
    launchOptions: {
      headless: false
    }
  });

  // Run semua step dalam flow dari extensionData.steps
  await runner.runBeforeAllSteps();

  for (const step of extensionData.steps) {
    await runner.runStep(step);
  }

  await runner.runAfterAllSteps();
}

// Jika file ini langsung dijalankan lewat node, jalankan fungsi run
if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  // Contoh: load JSON flow dari file lokal (ganti path sesuai file kamu)
  const extensionData = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
 if (!extensionData.steps) {
    throw new Error('File JSON tidak memiliki properti "steps"');
  }
  await run(extensionData);
}

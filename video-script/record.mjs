import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: './videos/',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();
  
  try {
    console.log("Navigating to localhost:3000...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    console.log("Exploring sidebar...");
    await page.click('a[href="/collections"]');
    await page.waitForTimeout(1500);

    await page.click('a[href="/documents"]');
    await page.waitForTimeout(1500);

    await page.click('a[href="/chat"]');
    await page.waitForTimeout(1500);

    console.log("Selecting existing chat...");
    const chatLinks = page.locator('a[href^="/chat/"]');
    if (await chatLinks.count() > 0) {
      await chatLinks.first().click();
      await page.waitForTimeout(1500);

      console.log("Sending message...");
      const inputSelector = 'input[placeholder="Message your knowledge base..."]';
      if (await page.locator(inputSelector).count() > 0) {
        await page.fill(inputSelector, "Can you summarize the main points?");
        await page.click('button[type="submit"]');
        
        await page.waitForTimeout(6000); // Wait for generation

        console.log("Demonstrating copy...");
        const botMessages = page.locator('.flex.w-full.justify-start');
        if (await botMessages.count() > 0) {
          const lastBotMessage = botMessages.last();
          await lastBotMessage.hover();
          await page.waitForTimeout(1000);
          const copyButton = lastBotMessage.locator('button', { hasText: 'Copy' });
          if (await copyButton.count() > 0) {
            await copyButton.click();
            await page.waitForTimeout(1500);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await context.close();
    await browser.close();

    const artifactsDir = '/Users/uzairansari/.gemini/antigravity-ide/brain/20abe7f5-b49e-462c-ba08-20e0ac79b9f7';
    const videosPath = './videos';
    if (fs.existsSync(videosPath)) {
      const videoFiles = fs.readdirSync(videosPath).filter(f => f.endsWith('.webm'));
      if (videoFiles.length > 0) {
        const videoFile = videoFiles[0];
        fs.renameSync(path.join(videosPath, videoFile), path.join(artifactsDir, 'linkedin_app_showcase.webm'));
        console.log("Video saved to artifacts: linkedin_app_showcase.webm");
      }
    }
  }
})();

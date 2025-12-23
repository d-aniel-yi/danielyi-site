import { chromium } from 'playwright';

(async () => {
    console.log('Starting PDF generation with Playwright...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Standard A4 Landscape Viewport
    // A4 is 297mm x 210mm.
    // We use a high resolution viewport to ensure good quality rendering before printing
    await page.setViewportSize({ width: 1920, height: 1080 });

    const targetUrl = 'http://localhost:3000/mercury/pdf';
    console.log(`Navigating to ${targetUrl}...`);

    try {
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
        console.error('Error navigating to page:', e.message);
        console.error('⚠️  Make sure your dev server is running! (npm run dev)');
        await browser.close();
        process.exit(1);
    }

    // Force print media simulation
    await page.emulateMedia({ media: 'print' });

    // Wait for fonts/animations to settle
    await page.waitForTimeout(2000);

    console.log('Generating PDF...');

    await page.pdf({
        path: 'mercury-strategy.pdf',
        format: 'A4',
        landscape: true,       // Landscape mode
        printBackground: true, // Keep dark theme background
        displayHeaderFooter: false,
        margin: {
            top: '0px',
            bottom: '0px',
            left: '0px',
            right: '0px'
        }
    });

    console.log('✅ PDF generated successfully: mercury-strategy.pdf');

    await browser.close();
})();

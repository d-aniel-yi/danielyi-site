import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set viewport to a standard desktop size to ensure layout is correct before printing
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Navigating to PDF page...');
    // Assuming the dev server is running on port 3000
    try {
        await page.goto('http://localhost:3000/mercury/pdf', { waitUntil: 'networkidle0' });
    } catch (e) {
        console.error('Error navigating to page. specific error:', e);
        console.error('Make sure your dev server is running on http://localhost:3000 (npm run dev)');
        await browser.close();
        process.exit(1);
    }

    console.log('Generating PDF...');

    await page.pdf({
        path: 'mercury-strategy.pdf',
        format: 'A4',
        landscape: true,
        printBackground: true, // Essential for the dark theme
        displayHeaderFooter: false,
        margin: {
            top: '0px',
            bottom: '0px',
            left: '0px',
            right: '0px'
        }
    });

    console.log('PDF generated successfully: mercury-strategy.pdf');

    await browser.close();
})();

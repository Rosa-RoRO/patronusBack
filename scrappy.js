const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
      headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/virginiatr6/?hl=es');
  await page.screenshot({ path: 'example.png' });

  const seguidores = await page.evaluate(() => document.querySelectorAll('.lOXF2')[1].innerText.slice(0, 3));

  await browser.close();
})();




// TIKTOK

/* 

page = https://www.tiktok.com/@fatifemalesports?

const seguidoresletra = document.querySelectorAll('.number')[1].innerText.seguidoresletra.slice(0, 5);


*/
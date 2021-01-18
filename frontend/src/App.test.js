/* eslint-disable */
const faker = require("faker");
const puppeteer = require("puppeteer");

const user = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe("Sign-Up", () => {
  test("Sign-up successful", async () => {
    let browser = await puppeteer.launch({
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
      ],
      headless: false,
      slowMo: 50,
    });
    let page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 500,
        height: 650,
      },
      userAgent: "",
    });

    await page.goto("http://localhost:3000/");

    await page.waitForSelector(
      "#root > div > header > div > button:nth-child(5)"
    );
    await page.click("#root > div > header > div > button:nth-child(5)");
    await page.waitForSelector(
      "#account-menu > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li"
    );
    await page.click(
      "#account-menu > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li"
    );
    await page.waitForSelector(
      "body > div.MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div > div:nth-child(5) > div:nth-child(2) > button"
    );
    await page.click(
      "body > div.MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div > div:nth-child(5) > div:nth-child(2) > button"
    );

    await page.waitForSelector(
      "body > div.MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > form"
    );
    await page.click("input[name=firstName]");
    await page.type("input[name=firstName]", user.firstName);
    await page.click("input[name=lastName]");
    await page.type("input[name=lastName]", user.lastName);
    await page.click("input[name=userName]");
    await page.type("input[name=userName]", user.userName);
    await page.click("input[name=email]");
    await page.type("input[name=email]", user.email);
    await page.click("input[name=password]");
    await page.type("input[name=password]", user.password);

    await page.click(
      "body > div.MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > form > button"
    );

    await page.waitForSelector("#client-snackbar");
    const html = await page.$eval("#client-snackbar", (e) => e.textContent);
    expect(html).toBe("Successfully signed up");

    browser.close();
  }, 100000);
});

const express = require("express");
const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const fs = require("fs-extra");
const path = require("path");
const data = require("./content.json");

const app = express();

app.use(express.static(path.join(__dirname + "/public")));


const compile = async function (templateName, data) {
  const filepath = path.join(process.cwd(), "templates", `${templateName}.hbs`);

  const html = await fs.readFile(filepath, "utf8");

  return hbs.compile(html)(data);
}

const run = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.emulateMediaType("screen");

    const content = await compile("resumeContent", data);

    await page.setContent(content);

    await page.addStyleTag({
      path: __dirname + "/styles/styles.css"
    })

    await page.pdf({
      path: "Resume.pdf",
      format: "A4",
      printBackground: true,
    });

    console.log("done");
    await browser.close();
    process.exit();
  } catch (error) {
    console.log("something went wrong");
    console.log(error)
  }
};

run();

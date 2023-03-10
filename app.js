const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const express = require("express");
const app = express();

// app.get("/getdetails/:dest", async function (req, res) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  const dest = req.params.dest;
  // console.log(req.params.dest)
  await page.goto(`https://www.lonelyplanet.com/search?q=${dest}`, {
    waitUntil: "networkidle0",
  });

  await Promise.all([
    page.click("#search-results article div a"),
    page.waitForNavigation({ waitUntil: "load" }),
  ]);
  let data = await page.evaluate(
    () =>
      document
        .querySelector("*")
        .outerHTML.split('<script id="__NEXT_DATA__" type="application/json">')
        .pop()
        .split(',"scriptLoader":[]}</script>')[0] + "}"
  );
  data = JSON.parse(data);
  // console.log(typeof data);
  await browser.close().then(async () => {
    console.log("browser closed");
    const final = {"data": data.props.pageProps.data.points}
    res.send(final);
  });
// });

app.listen(8000, function () {
  console.log("Running on port 8000.");
});

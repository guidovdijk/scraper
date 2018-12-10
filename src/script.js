// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi

/*

  dagaanieding van anternate is via een iframe in de website geplaats.
  Er is maar 1 iframe op de pagina en de link staat in een src attribute.
  (https://www.alternate.nl/dagaanbieding)

  op elke website wordt er,
  als er geen korting wordt gegeven, de huidige prijs in de price.new selector gezet.
  Als er wel korting is verplaats de huidige prijs naar de price.old 
  en wordt de price.new gevult met het nieuwe bedrag.

  format bedrag van product:
  - Check of het bedrag een euro teken heeft.
  - Sommige bedragen (zoals die van alternate) hebben een '*' aan het einde

  - Zed website titel bij de producten.

  laadtijd:
  - Maak een loading state. Initial load duurt ong 10s á 15s.
  - Als het kan laat het laden per 5 items.

  Als je wilt testen met 1 product van elke pagina, haal dan de tweede for loop uit de index.ejs weg en vervand de [j] met [0].
*/
const puppeteer = require('puppeteer');
const $ = require('cheerio');

class Scraper {
  scrapeData(obj, link) {
    const request = puppeteer
      .launch()
      .then((browser) => {
        return browser.newPage();
      })
      .then((page) => {
        return page.goto(link).then(() => {
          return page.content();
        });
      })
      .then((html) => {
        return {
          title: $(obj.data.title, html).text(),
          price: {
            old: $(obj.data.price.old, html).text(),
            new: $(obj.data.price.new, html).text(),
          },
          image: $(obj.data.image, html).attr('src'),
          src: {
            link: link,
            prefix: obj.data.prefix,
          }
        };
      }).catch((err) => {
        console.log('error', err);
      });

    return request;
  }
}

module.exports = Scraper;

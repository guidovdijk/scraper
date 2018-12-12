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

  https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8
*/
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsdom = require("jsdom");
const rp = require('request-promise');
const request = require('request');
const dataBundle = require('./config.json');

const { JSDOM } = jsdom;


const requestAsync = function(data, url) {
    return new Promise((resolve, reject) => {
      console.log(url)
        const asyncdata = url.map(u => {
          rp({url: u}).then((html) => {
              const $ = cheerio.load(html);
              resolve({
                  title: $(data.title).text(),
                  price: {
                    old: $(data.price.old).text(),
                    new: $(data.price.new).text(),
                  },
                  image: $(data.image).attr('src'),
                  src: {
                    link: u,
                    prefix: data.prefix,
                  }
              });
          }).catch((err) => {

          });
        })
       
    });
};


const scrape = async function (obj, link) {
  
  try {
    var data = await Promise.all(dataBundle.map(requestAsync))
  } catch (err){
    console.log(err);
  }
  console.log('data',data)
  // return rp({url: link})
  //       .then((html) => {
  //         //success!
  //           const $ = cheerio.load(html);
  //           return {
  //               title: $(obj.data.title).text(),
  //               price: {
  //                 old: $(obj.data.price.old).text(),
  //                 new: $(obj.data.price.new).text(),
  //               },
  //               image: $(obj.data.image).attr('src'),
  //               src: {
  //                 link: link,
  //                 prefix: obj.data.prefix,
  //               }
  //           };
  //       }).catch((err) => {
  //         //handle error
          
  //       });

  // JSDOM.fromURL(link).then(dom => {
  //   return dom.serialize();
  // }).then(dom => {

  //     const $ = cheerio.load(dom);

  //     const data = {
  //         title: $(obj.data.title).text(),
  //         price: {
  //           old: $(obj.data.price.old).text(),
  //           new: $(obj.data.price.new).text(),
  //         },
  //         image: $(obj.data.image).attr('src'),
  //         src: {
  //           link: link,
  //           prefix: obj.data.prefix,
  //         }
  //     };
  //     console.log(data)
  //     return data;
  // });

  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();

  // await page.setRequestInterception(true);
    
  // page.on('request', (req) => {
  //     if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font'){
  //         req.abort();
  //     }
  //     else {
  //         req.continue();
  //     }
  // });

  // await page.goto(link);

  // let content = await page.content();
  // var $ = cheerio.load(content);

  // let data = {
  //     title: $(obj.data.title).text(),
  //     price: {
  //       old: $(obj.data.price.old).text(),
  //       new: $(obj.data.price.new).text(),
  //     },
  //     image: $(obj.data.image).attr('src'),
  //     src: {
  //       link: link,
  //       prefix: obj.data.prefix,
  //     }
  // };

  // await browser.close();

  // return data

}

module.exports = scrape;


/*
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

*/
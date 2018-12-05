// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi

/*
  formatting als img src al een 'https:' heeft.

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
  - Verzin wat voor de C.O.R.S error
  - Maak een loading state. Het ophalen van de data duurt ong 10s.
  - Als het kan laat het laden per 5 items.
*/
const rp = require('request-promise');
const $ = require('cheerio');
const dataBundle = require('./config.json')

class Scraper {
  constructor(){
    this.config = {
      template: {
        _string: `
        <div class="product">
          <img src="{{srcprefix}}{{image}}"/>
          <h1>{{title}}</h1>
          <a href="{{link}}" target="_blank">Go to product</a>
          <p class="price price--old">{{oldprice}}</p>
          <p class="price price--new">{{newprice}}</p>
        </div>`,
        _placeholder: {
          title: 'title',
          price: {
            old: 'oldprice',
            new: 'newprice',
          },
          image: 'image',
        }
      },
      data: dataBundle,
      _regex: /\{\{(\w+)\}\}/g,
      _wrapper: 'product_wrapper',
    };

      this.initScraper();
  }
  initScraper(){
    const { data } = this.config;
    const results = Promise.all(data.map(d => { 

      return Promise.all(d.url.map(url => { return this.scrapeData(d, url); }))

    }));
    
    results.then((data) => this.makeTemplate(data));
    results.then((data) => this.addData(data));
    
    results.catch(function(err){
      console.log('error', err);
    });
    
  }
  scrapeData(obj, test) {
    const request = rp(test)
      .then((html) => {
        return {
          title: $(obj.data.title, html).text(),
          price: {
            old: $(obj.data.price.old, html).text(),
            new: $(obj.data.price.new, html).text(),
          },
          image: $(obj.data.image, html).attr('src'),
          link: test,
          srcPrefix: obj.data.srcPrefix,
        };
      });

    return request;
  }
  
  makeTemplate(data) {
    const { template } = this.config;
    data.map(d => {
      d.map(d => {
        d.template = this.replacePlaceholder(template._string, {
          title: d.title,
          oldprice: d.price.old,
          newprice: d.price.new,
          image: d.image,
          link: d.link,
          srcprefix: d.srcPrefix,
        });
      });
    });
  }

  replacePlaceholder (template, data) {
    return template.replace(this.config._regex, function(match, key) {
        return data[key];
    });
  }
  
  addData (data) {
    const wrapper = document.getElementById(this.config._wrapper);
  
    data.map(d => {
      d.map(d => {
        wrapper.insertAdjacentHTML("beforeend",  d.template);
      });
    });
  }
}
new Scraper();

// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi

const rp = require('request-promise');
const $ = require('cheerio');

class Scraper {
  constructor(){
    this.config = {
      template: {
        _string: `
        <div class="product">
          <img src="https:{{image}}"/>
          <h1>{{title}}</h1>
          <a href="{{link}}">Go to product</a>
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
      data: [
        {
          url: 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States',
          title: '.firstHeading',
          image: '.vcard img',
          price: {
            old: '.mw-jump-link',
            new: '#siteSub',
          },
        },
        {
          url: 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States',
          title: '.firstHeading',
          image: '.vcard img',
          price: {
            old: '.mw-jump-link',
            new: '#siteSub',
          },
        },
        {
          url: 'https://en.wikipedia.org/wiki/Politics_of_the_United_States',
          title: '.firstHeading',
          image: '.vcard img',
          price: {
            old: '.mw-jump-link',
            new: '#siteSub',
          },
        },
      ],
      _regex: /\{\{(\w+)\}\}/g,
      _wrapper: 'product_wrapper',
      srcPrefix: 'https:',
    };

    this.initScraper();
  }
  initScraper(){
    const { data } = this.config;
    
    const results = Promise.all(data.map(d => { 
      return this.scrapeData(d);
    }));

    results.then((data) => this.makeTemplate(data));
    results.then((data) => this.addData(data));
    
    results.catch(function(err){
      console.log('error', err);
    });
    
  }
  scrapeData(obj) {
    const request = rp(obj.url)
      .then((html) => {
        return {
          title: $(obj.title, html).text(),
          price: {
            old: $(obj.price.old, html).text(),
            new: $(obj.price.new, html).text(),
          },
          image: $(obj.image, html).attr('src'),
          link: obj.url,
        };
      });

    return request;
  }
  
  makeTemplate(data) {
    const { template } = this.config;
    data.map(d => {
      d.template = this.replacePlaceholder(template._string, {
        title: d.title,
        oldprice: d.price.old,
        newprice: d.price.new,
        image: d.image,
        link: d.link
      })
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
      wrapper.insertAdjacentHTML("beforeend",  d.template);
    });
  }
}
new Scraper();
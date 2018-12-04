const rp = require('request-promise');
const $ = require('cheerio');


const config = {
  template: {
    string: `
    <div class="product">
      <img src="https:{{image}}"/>
      <h1>{{title}}</h1>
      <a href="{{link}}">Go to product</a>
      <p class="price price--old">{{oldprice}}</p>
      <p class="price price--new">{{newprice}}</p>
    </div>`,
  },
  _regex: /\{\{(\w+)\}\}/g,
  _wrapper: 'product_wrapper',
  srcPrefix: 'https:',
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
};

// Scrape data from sites
const scrapeData = (obj) => {
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
    })
  return request;
};

const makeTemplate = (data) => {
  const t = config.template.string;

  data.map(d => {
    d.template = replacePlaceholder(t, {
      title: d.title,
      oldprice: d.price.old,
      newprice: d.price.new,
      image: d.image,
      link: d.link
    })
  });
}


const replacePlaceholder = (template, data) => {
  return template.replace(config._regex, function(match, key) {
      return data[key];
  });
}

const append = (data) => {
  const wrapper = document.getElementById(config._wrapper);

  data.map(d => {
    wrapper.insertAdjacentHTML("beforeend",  d.template);
  });
}

const results = Promise.all(config.data.map(scrapeData));

results.then(makeTemplate);
results.then(append);

results.catch(function(err){
  console.log('error', err);
});




/*
  placeholder: {
      title: title,
      price: {
        old: old_price,
        new: new_price,
      },
      image: img_src,
    }

*/
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

  format this.config:
  - Heel veel herhaling met selectors voor dezelfde websites.
  - Alle winkjels in aparte bestanden zetten en importeren.

  laadtijd:
  - Verzin wat voor de C.O.R.S error
  - Maak een loading state. Het ophalen van de data duurt ong 10s.
  - Als het kan laat het laden per 5 items.
*/
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
        /* mediamarkt */
        {
          url: 'https://www.mediamarkt.nl/nl/product/_logitech-g-g513-carbon-tactile-1563720.html',
          title: 'h1',
          image: '#product-sidebar .zoom img',
          price: {
            old: '.sidebar-form .price-old',
            new: '.sidebar-form .price.big',
          },
        },
        {
          url: 'https://www.mediamarkt.nl/nl/product/_logitech-g-g502-hero-1592614.html',
          title: 'h1',
          image: '#product-sidebar .zoom img',
          price: {
            old: '.sidebar-form .price-old',
            new: '.sidebar-form .price.big',
          },
        },
        {
          url: 'https://www.mediamarkt.nl/nl/product/_logitech-g-g840-xl-1537518.html',
          title: 'h1',
          image: '#product-sidebar .zoom img',
          price: {
            old: '.sidebar-form .price-old',
            new: '.sidebar-form .price.big',
          },
        },
        {
          url: 'https://www.mediamarkt.nl/nl/product/_hyperx-cloud-alpha-gaming-headset-1558266.html?ga_query=cloud+alpha',
          title: 'h1',
          image: '#product-sidebar .zoom img',
          price: {
            old: '.sidebar-form .price-old',
            new: '.sidebar-form .price.big',
          },
        },
        {
          url: 'https://www.mediamarkt.nl/nl/product/_samsung-860-evo-250-gb-1557211.html',
          title: 'h1',
          image: '#product-sidebar .zoom img',
          price: {
            old: '.sidebar-form .price-old',
            new: '.sidebar-form .price.big',
          },
        },
        /* coolblue */
        {
          url: 'https://www.coolblue.nl/product/808943/logitech-g513-tactile-mechanical-gaming-keyboard-qwerty.html',
          title: 'h1 .js-product-name',
          image: '.product-media-gallery__item.swiper-slide-active img',
          price: {
            old: '.js-sticky-header-end .sales-price__former',
            new: '.js-sticky-header-end .sales-price__current',
          },
        },
        {
          url: 'https://www.coolblue.nl/product/820146/logitech-g502-hero-high-performance-gaming-mouse.html',
          title: 'h1 .js-product-name',
          image: '.product-media-gallery__item.swiper-slide-active img',
          price: {
            old: '.js-sticky-header-end .sales-price__former',
            new: '.js-sticky-header-end .sales-price__current',
          },
        },
        {
          url: 'https://www.coolblue.nl/product/792520/logitech-g840-xl-gaming-mouse-pad.html',
          title: 'h1 .js-product-name',
          image: '.product-media-gallery__item.swiper-slide-active img',
          price: {
            old: '.js-sticky-header-end .sales-price__former',
            new: '.js-sticky-header-end .sales-price__current',
          },
        },
        {
          url: 'https://www.coolblue.nl/product/802659/hyperx-cloud-alpha-pro-gaming-headset.html',
          title: 'h1 .js-product-name',
          image: '.product-media-gallery__item.swiper-slide-active img',
          price: {
            old: '.js-sticky-header-end .sales-price__former',
            new: '.js-sticky-header-end .sales-price__current',
          },
        },
        {
          url: 'https://www.coolblue.nl/product/801969/samsung-860-evo-250gb-2-5-inch.html',
          title: 'h1 .js-product-name',
          image: '.product-media-gallery__item.swiper-slide-active img',
          price: {
            old: '.js-sticky-header-end .sales-price__former',
            new: '.js-sticky-header-end .sales-price__current',
          },
        },
        /* bol.com */
        {
          url: 'https://www.bol.com/nl/p/logitech-g513-tactile-mechanisch-gaming-toetsenbord-qwerty/9200000090809252/?suggestionType=suggestedsearch&bltgh=owsPjm5ybw0WvPVSuIlL3A.1.2.ProductTitle',
          title: 'h1',
          image: '.product-image-content img',
          price: {
            old: '.ab-discount del',
            new: '.buy-block__prices .promo-price',
          },
        },
        {
          url: 'https://www.bol.com/nl/p/logitech-g502-hero-rgb-gaming-muis-pc/9200000098065282/?suggestionType=typedsearch&bltgh=pDC7vhsxCA8jWM4172lGoQ.1.3.ProductImage',
          title: 'h1',
          image: '.product-image-content img',
          price: {
            old: '.ab-discount del',
            new: '.buy-block__prices .promo-price',
          },
        },
        {
          url: 'https://www.bol.com/nl/p/logitech-g840-xl-gaming-muismat/9200000081859830/?suggestionType=featured_product&suggestedFor=g84&originalSearchContext=media_all&originalSection=main',
          title: 'h1',
          image: '.product-image-content img',
          price: {
            old: '.ab-discount del',
            new: '.buy-block__prices .promo-price',
          },
        },
        {
          url: 'https://www.bol.com/nl/p/hyperx-cloud-alpha-gaming-headset-ps4-xbox-one-nintendo-switch-windows-mobile-black/9200000095625954/?suggestionType=featured_product&suggestedFor=cloud%20al&originalSearchContext=media_all&originalSection=main',
          title: 'h1',
          image: '.product-image-content img',
          price: {
            old: '.ab-discount del',
            new: '.buy-block__prices .promo-price',
          },
        },
        {
          url: 'https://www.bol.com/nl/p/samsung-860-evo-250gb-ssd/9200000087796720/',
          title: 'h1',
          image: '.product-image-content img',
          price: {
            old: '.ab-discount del',
            new: '.buy-block__prices .promo-price',
          },
        },
        /* alternate */
        {
          url: 'https://www.alternate.nl/Logitech/G513-CARBON-RGB-Tactile-Mechanical-Gaming-Keyboard/html/product/1433387?event=search',
          title: 'h1 span',
          image: '#bigPic img',
          price: {
            old: '.productShort .msrp span',
            new: '.productShort .price span',
          },
        },
        {
          url: 'https://www.alternate.nl/Logitech/G502-HERO-High-Performance-Gaming-Mouse/html/product/1479074?event=search',
          title: 'h1 span',
          image: '#bigPic img',
          price: {
            old: '.productShort .msrp span',
            new: '.productShort .price span',
          },
        },
        {
          url: 'https://www.alternate.nl/Logitech/G840-XL-Gaming-Mouse-pad/html/product/1380580?event=search',
          title: 'h1 span',
          image: '#bigPic img',
          price: {
            old: '.productShort .msrp span',
            new: '.productShort .price span',
          },
        },
        {
          url: 'https://www.alternate.nl/HyperX/Cloud-Alpha-Pro-Gaming-Headset/html/product/1432269?event=search',
          title: 'h1 span',
          image: '#bigPic img',
          price: {
            old: '.productShort .msrp span',
            new: '.productShort .price span',
          },
        },
        {
          url: 'https://www.alternate.nl/Samsung/860-EVO-250-GB-SSD/html/product/1405516?lk=15405',
          title: 'h1 span',
          image: '#bigPic img',
          price: {
            old: '.productShort .msrp span',
            new: '.productShort .price span',
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
      console.log(d.template);
      // wrapper.insertAdjacentHTML("beforeend",  d.template);
    });
  }
}
new Scraper();

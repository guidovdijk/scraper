const rp = require('request-promise');
const $ = require('cheerio');

const template = `
  <div>
    <h1></h1>
    <img src=""/>
  </div>
`;
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

const config = [
  {
    url: 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States',
    name: '.firstHeading',
  },
  {
    url: 'https://en.wikipedia.org/wiki/Politics_of_the_United_States',
    name: '.firstHeading',
  },
  {
    url: 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States',
    name: '.firstHeading',
  },
];


rp(url)
  .then(function(html){
    //success!
    console.log($('big > a', html).length);
    console.log($('big > a', html));
  })
  .catch(function(err){
    //handle error
  });


// Scrape data from sites
var fn = function getData(obj){
  return rp(obj.url)
    .then(function(html){
      return {
        name: $(obj.name, html).text()
      };
    })
    .catch(function(err){
      console.log('error', err);
    });
};



var results = Promise.all(config.map(fn));

results.then(data =>
    console.log(data)
);


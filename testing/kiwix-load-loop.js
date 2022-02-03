// setup as non-root
// mkdir iiab-tester
// cd iiab-tester/
// npm init -y
// npm install puppeteer

var runFlag = true;
const readline = require('readline');
const puppeteer = require('puppeteer');

//host = 'http://192.168.3.96';
host = 'http://192.168.3.96:3000';

randomUrl = host + '/kiwix/random?content=wikipedia_es_medicine_maxi_2019-11';
searchUrls = [
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=mexico+',
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=futbol+',
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=amlo+',
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=gobierno+',
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=pais+',
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=nuevo+',
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=juego+',
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=oaxaca+',
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=gastronomia+',
    '/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=pueblo+'
]

const maxRequests = 5;
let curRequests = 0;

process.setMaxListeners(Infinity); // avoid max listeners warning

function main() {
    captureInput().then(result => {
        console.log('repl result:', result)
      }).catch(e => {
        console.log('failed:', e)
      })

    while(runFlag){
        //console.log('Run is ' + runFlag);
        if (curRequests < maxRequests){
            //loadSet();
            loadPage(randomUrl)
            curRequests += 1;
        }
    }
}

function loadSet() {
    for (let i = 0; i < searchUrls.length; i++) {
        console.log(i, curRequests);
        loadPage(host + searchUrls[i]);
        loadPage(randomUrl);
    }
}

async function loadPage(url) {
    curRequests += 1;
    console.log('CurRequests is ' + curRequests);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    try {
      await page.goto(url, {waitUntil: 'load', timeout: 0});
      const title = await page.title();
      const html = await page.content();
      const pageBody = await page.evaluate(() => document.body.innerHTML);
      //const h1 = await page.evaluate(() => document.body.h1.innerHTML);
  
      console.log(title);
      //console.log(pageBody);
      //console.log(page.headers.status);
      //console.log(pageBody.substring(1, 300));
      //const elm = await page.$("h1");
      //const text = await page.evaluate(elm => elm.textContent, elm[0]);
      //console.log(text);
      //console.log(h1);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      await browser.close();
      curRequests -= 1;
      console.log('CurRequests is ' + curRequests);
    
    }
  }

function captureInput(){
    return new Promise(function(resolve, reject) {
        let rl = readline.createInterface(process.stdin, process.stdout)
        
        rl.on('line', function(line) {          
            runFlag = false;
            rl.close()
            return // bail here, so rl.prompt() isn't called again                       
        }).on('close',function(){
          console.log('bye')
          resolve('end') // this is the final result of the function
        });
      })
}

main();

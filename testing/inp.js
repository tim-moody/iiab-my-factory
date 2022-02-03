const readline = require('readline');
const puppeteer = require('puppeteer');
let curRequests = 0;

function replDemo() {
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


async function run() {
  try {
    let replResult = await replDemo()
    console.log('repl result:', replResult)

  } catch(e) {
    console.log('failed:', e)
  }
}

function run2() {
  replDemo().then(result => {
    console.log('repl result:', result)
  }).catch(e => {
    console.log('failed:', e)
  })
  console.log('replDemo has been called')
  loadPage('http://192.168.3.96:3000/kiwix/search?content=wikipedia_es_all_maxi_2019-09&pattern=mexico+')
}

run2()

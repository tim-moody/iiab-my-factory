// apt install libxss1
// setup as non-root
// mkdir iiab-tester
// cd iiab-tester/
// apt install nodejs
// apt install npm
// npm init -y
// npm install puppeteer

// The loop can be broken by typing any key + enter

const readline = require('readline');
const puppeteer = require('puppeteer');
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

const host = 'http://rpi-devel/kolibri/en/learn/#/topics/';
//const host = 'http://192.168.3.76';
//const host = 'http://192.168.3.96:3000';
const zim = 'wikipedia_es_all_maxi_2019-09';

const maxRequests = 4; // maximum number of simultaneous requests
const rndRatio = 2; // how many random requests for each search
const iterations = 100; // how many total requests

var curRequests = 0;
var runFlag = true;
var totalCount = 0;
var errorCount = 0;
var netError = 0;
var maxResp = 0;
var totResp = 0;

// const prefix = '/kiwix/search?content=' + zim + '&pattern=';
// const randomUrl = host + '/kiwix/random?content=' + zim;

reqUrls = [
    'c/e34fdf01baeb5a1289cd4c2c0ef60271',
    'c/d74d0b57979950b8952f174cddc0c65b',
    'c/906678946e8953fabf68856954a4febb',
    'c/302571d75a875ea380e892a4e9926ccb'
]
process.setMaxListeners(Infinity); // avoid max listeners warning
var startTime = getTime();

async function main() {
    getInput().then(result => {
        console.log('getInput result:', result)
    }).catch(e => {
        console.log('failed:', e)
    })
    console.log('getInput has been called')

    var reqPtr = 0;
    var rndCnt = rndRatio;

    while (runFlag) {
        //console.log('Run is ' + runFlag);
        if (curRequests < maxRequests) {
            loadPage(host + reqUrls[reqPtr]);
            reqPtr += 1;
            if (reqPtr == reqUrls.length)
                reqPtr = 0;
            curRequests += 1;
        }
        await sleep(10);
        if (totalCount >= iterations){
           runFlag = false;
           console.log('Finished, Network Errors: ', netError);
         }
    }
}

function getInput() {
    return new Promise(function (resolve, reject) {
        let rl = readline.createInterface(process.stdin, process.stdout)

        rl.on('line', function (line) {
            runFlag = false;
            rl.close()
            return // bail here, so rl.prompt() isn't called again
        }).on('close', function () {
            console.log('bye')
            resolve('end') // this is the final result of the function
        });
    })
}

async function loadPage(url) {
    //console.log('CurRequests is ' + curRequests);
    console.log(curRequests + ' URL: ' + url)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    totalCount += 1;

    try {
        var pageStart = getTime();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });
        const title = await page.title();
        var pageElapsed = getTime() - pageStart;
        if (pageElapsed > maxResp)
            maxResp = pageElapsed;
        totResp += pageElapsed;
        const html = await page.content();
        const pageBody = await page.evaluate(() => document.body.innerHTML);
        if (pageBody.includes('Gateway'))
            errorCount += 1;
        //const h1 = await page.evaluate(() => document.body.h1.innerHTML);
        var now = getTime();
        var offset =  Math.round((now - startTime)/1000);
        console.log('run: ' + curRequests + '/' + offset + 's err/req: ' + errorCount + '/' + totalCount + ' ' + title + ' (resp: ' + Math.round(pageElapsed/1000) + 's, avg: ' + Math.round(totResp/totalCount/1000) + 's, max: ' + Math.round(maxResp/1000) + 's)');
        //console.log(title);
        //console.log(pageBody);
        //console.log(page.headers.status);
        //console.log(pageBody.substring(1, 300));
        //const elm = await page.$("h1");
        //const text = await page.evaluate(elm => elm.textContent, elm[0]);
        //console.log(text);
        //console.log(h1);
    }
    catch (err) {
        netError += 1;
        console.log(err);
    }
    finally {
        await browser.close();
        curRequests -= 1;
        //console.log('CurRequests is ' + curRequests);

    }
}

function getTime() {
  var d = new Date();
  var t = d.getTime();
  return t;
}

function topWrapper() { // because main is async
    main()
        .then(text => {
            console.log(text);
        })
        .catch(err => {
            // Deal with the fact the chain failed
        });
}

topWrapper()

const fs = require('fs');
const path = require('path');

const BUILD_ALL = Boolean(process.env.BUILD_ALL)
const DEFAULT_MAX_DEPTH = 10;

const outputDir = path.join(__dirname, '..', 'dist');


function getAllStates(maxDepth = 3) {
  let allStates = new Set();
  const curStates = new Set(['1']);

  allStates = getNextStates(allStates, curStates, 0, maxDepth);

  return allStates;
}

function getNextStates(allStates, curStates, curDepth, maxDepth) {
  if (curDepth >= maxDepth) {
    return allStates;
  }
  const newStates = new Set();
  curStates.forEach(state => {
    newStates.add(`${state}0`);
    newStates.add(`${state}1`);
  });

  return getNextStates(new Set([...allStates, ...newStates]), newStates, curDepth + 1, maxDepth);
}

function statesToHtml(states) {
  return states.map(state => {
    const decimalNumber = parseInt(state, 2);
    const next0StateName = `s${state}0`;
    const next1StateName = `s${state}1`;
    return `<input type="radio" name="app-state" id="s${state}">
      <div class="state">
        <div class="answer" data-bin="${state}" data-dec="${decimalNumber}"></div>
        <label for="${next0StateName}">0</label>
        <label for="${next1StateName}">1</label>
      </div>`;
  }).join('\n');
}

function buildDecoderHtml(maxDepth) {
  console.log(`~~~~ Building Binary Decoder (depth=${maxDepth}) ~~~`);
  const startTime = +new Date();
  const allStates = getAllStates(maxDepth);
  const endTime = +new Date();

  console.log('  Found ', allStates.size, 'states in ', (endTime - startTime), 'milliseconds');
  console.log('  Mapping to html states...');
  const statesHtml = statesToHtml(Array.from(allStates));
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>CSS Binary Decoder</title>
      <link href="./styles.css" rel="stylesheet"></head>
    </head>
    <body>
    <div class="app">
      <h1>Binary Decoder</h1>
      <p>This app is built entirely out of HTML and CSS, no JavaScript™ at all!</p>
      <br><br>
      <div class="stateContainer">
        <input type="radio" name="app-state" id="start" checked>
        <div class="state">
          <div class="answer" data-bin="1" data-dec="1" ></div>
          <label for="s10">0</label>
          <label for="s11">1</label>
        </div>
        ${statesHtml}
        <label for="start" id="resetButton">Reset</label>
      </div>
    </div>
    <footer class="footer">Check out <a href="https://github.com/lukebatchelor/css-binary-decoder">lukebatchelor/css-binary-decoder</a> if you're interested in how it works!</footer>
      <a href="https://github.com/lukebatchelor/css-binary-decoder" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
    </body>
    </html>
  `;
  const fileName = maxDepth === 10 ? 'index.html' : `${maxDepth}.html`;
  const outputFilePath = path.join(outputDir, fileName);
  console.log('  Writing to', outputFilePath);

  fs.writeFileSync(outputFilePath, htmlTemplate);

  console.log('  Total size: ', (htmlTemplate.length / 1000000).toFixed(2), 'mb');
}


if (BUILD_ALL) {
  const depths = [8,9,10,11,12,13,14];
  depths.forEach(depth => {
    buildDecoderHtml(depth);
  });
} else {
  buildDecoderHtml(DEFAULT_MAX_DEPTH);
}

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
    <a href="https://github.com/lukebatchelor/css-binary-decoder"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub">
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

const fs = require('fs');
const degit = require('degit');
const rimraf =  require('rimraf');

// degit to temp folder

function moveDir(path, destination, callback) {
  fs.rename(path, destination, (error) => {
    if(error) {
      console.log("ERROR \n" + error.message);
    }
    else {
      if (typeof callback === 'function') {
        callback();
      }
    }
  });
}

// clone repo using degit

function cloneRepo(callback) {
  const emmiter = degit('stone-payments/pos-mamba-sdk#develop', {
    force: true,
    verbose: true,
  });
  return emmiter.clone('.temp/');
}

// check if dir exists and create if it doesnt
function createDir(dirName) {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, (error) => {
      if(error) {
        console.log('ERROR \n'+error.message);
      }

    });
  }
}

function clearTemp() {
  rimraf('.temp/', () => {
    console.log('Temporary Files Removed !');
    console.log('SDK Updated');
  });
}

// clears packages
rimraf('./packages', () =>{
  console.log('Cleaning Packages.');

  // create dirs
  createDir('packages/');
  createDir('packages/pos');
  createDir('packages/components');

  // clone repo
  cloneRepo().then(() => {
    
    // Need remove undesired components
    // Not working. Resolved at navigation-loader
    /* ['App'].forEach(c => {
      const item = c;
      const path = `./.temp/packages/components/${c}/`;
      rimraf(path, () => console.log(`Removing ${item}`))
    }); */

    // move to directory and clear temp files
    moveDir('./.temp/packages/components', './packages/components',
      moveDir('./.temp/packages/pos', './packages/pos',
        moveDir('./.temp/packages/store','./packages/store',
          clearTemp())));
  });
})

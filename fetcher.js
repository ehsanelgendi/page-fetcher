const request = require('request');
const fs = require('fs');
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const urlDomain = process.argv[2];
const localPath = process.argv[3];

const write = function(localPath, body, printmessage) {
  fs.writeFile(localPath, body, (error) => {
    if (error) {
      console.log('ERROR in write File', error);
    }
    const fileSize = body.length;
    printmessage(fileSize);
  });
}

const printmessage = fileSize => {
  console.log(`Downloaded and saved ${fileSize} bytes to ./index.html`);
}


request(urlDomain, (error, response, body) => {
  if (error) {
    console.log("ERROR in request", error);
    process.exit();
  } else {
    fs.stat(localPath, (err, stat) => {
      if (err === null) { //file exists
        rl.question('File exists, type Y + Enter if you want to overwrite the file otherwise skip and exit ', (answer) => {
          if (answer === 'y') {
            write(localPath, body, printmessage);
            rl.close();
          } else {
            process.exit();
          }
        });
      } else if (err.code === 'ENOENT') { //file doesn't exist
        write(localPath, body, printmessage);
      }
    });
  }
});

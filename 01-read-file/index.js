const fs = require('fs');

const readStream = fs.createReadStream('./01-read-file/text.txt');

readStream.on('data', function (chunk) {
	console.log(chunk.toString());
});

readStream.on('error', function (err) {
	console.error(err);
});

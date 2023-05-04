const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const filePath = './02-write-file/text.txt';

const stream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Welcome! Please enter your text or type "exit" to finish.');

rl.on('line', function (input) {
	if (input === 'exit') {
		console.log('Goodbye!');
		rl.close();
	} else {
		stream.write(`${input}\n`);
	}
});

rl.on('SIGINT', function () {
	console.log('Have a nice day!');
	process.exit();
});

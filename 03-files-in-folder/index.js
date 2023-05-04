const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true })
	.then((dirents) => {
		for (const dirent of dirents) {
			if (dirent.isFile()) {
				const fileExtension = path.extname(dirent.name).slice(1);
				const fileName = path.parse(dirent.name).name;
				const filePath = path.join(folderPath, dirent.name);

				fs.stat(filePath)
					.then((stats) => {
						const fileSizeInKb = (stats.size / 1024).toFixed(3);
						console.log(
							`${fileName} - ${fileExtension} - ${fileSizeInKb}kb`
						);
					})
					.catch((err) => {
						console.error(
							`Error reading stats for file ${dirent.name}: ${err}`
						);
					});
			}
		}
	})
	.catch((err) => {
		console.error(`Error reading contents of folder ${folderPath}: ${err}`);
	});

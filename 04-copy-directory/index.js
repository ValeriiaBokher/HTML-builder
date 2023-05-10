const fs = require('fs');
const path = require('path');

const copyDir = async () => {
	try {
		const sourcePath = path.join(__dirname, 'files');
		const targetPath = path.join(__dirname, 'files-copy');

		await fs.promises.rm(targetPath, { recursive: true, force: true });
		await fs.promises.mkdir(targetPath, { recursive: true });

		const files = await fs.promises.readdir(sourcePath, {
			withFileTypes: true,
		});

		for (let file of files) {
			const sourceFilePath = path.join(sourcePath, file.name);
			const targetFilePath = path.join(targetPath, file.name);

			if (file.isDirectory()) {
				await copyDir(sourceFilePath, targetFilePath);
			} else {
				await fs.promises.copyFile(sourceFilePath, targetFilePath);
			}
		}

		console.log('Files copied successfully!');
	} catch (err) {
		console.error(`Error copying files: ${err}`);
	}
};

copyDir();

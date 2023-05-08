const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const projectDistPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(projectDistPath, 'bundle.css');

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
	if (err) {
		console.error('Error reading styles directory:', err);
		return;
	}

	const cssFiles = files.filter((file) => {
		return file.isFile() && path.extname(file.name) === '.css';
	});

	const styles = [];

	cssFiles.forEach((file) => {
		const filePath = path.join(stylesPath, file.name);
		fs.readFile(filePath, 'utf-8', (err, content) => {
			if (err) {
				console.error('Error reading file:', err);
				return;
			}

			styles.push(content);

			if (styles.length === cssFiles.length) {
				const bundleContent = styles.join('\n');
				fs.writeFile(bundlePath, bundleContent, (err) => {
					if (err) {
						console.error('Error writing bundle file:', err);
						return;
					}
				});
			}
		});
	});
});

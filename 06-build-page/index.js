const fs = require('fs');
const path = require('path');
const util = require('util');

const DIST_PATH = path.join(__dirname, 'project-dist');

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const COMPONENTS_PATH = path.join(__dirname, 'components');
const ASSETS_SRC_PATH = path.join(__dirname, 'assets');
const ASSETS_DIST_PATH = path.join(DIST_PATH, 'assets');
const STYLES_PATH = path.join(__dirname, 'styles');
const STYLE_FILE_PATH = path.join(DIST_PATH, 'style.css');

// Create project-dist folder
fs.mkdir(DIST_PATH, { recursive: true }, (err) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log('Project-dist folder created successfully!');

	// Read all CSS files and write them to style.css in project-dist
	fs.readdir(STYLES_PATH, (err, files) => {
		if (err) {
			console.error(err);
			return;
		}

		let styles = '';

		files.forEach((file) => {
			if (path.extname(file) === '.css') {
				const filePath = path.join(STYLES_PATH, file);
				styles += fs.readFileSync(filePath, 'utf8');
			}
		});

		fs.writeFile(STYLE_FILE_PATH, styles, (err) => {
			if (err) {
				console.error(err);
			} else {
				console.log('style.css written successfully!');
			}
		});
	});

	// Read the HTML template and replace the component tags with their content
	fs.readFile(TEMPLATE_PATH, 'utf8', async (err, template) => {
		if (err) {
			console.error(err);
			return;
		}

		const regex = /{{(.+?)}}/g;
		const tags = [];

		let match;
		while ((match = regex.exec(template))) {
			tags.push(match[1]);
		}

		console.log('Tags found:', tags);

		const replaceTags = async (template, tags) => {
			for (const tag of tags) {
				const componentPath = path.join(COMPONENTS_PATH, `${tag}.html`);
				try {
					const component = await util.promisify(fs.readFile)(
						componentPath,
						'utf8'
					);
					template = template.replace(
						new RegExp(`{{${tag}}}`, 'g'),
						component
					);
					console.log(`Tag '${tag}' replaced successfully!`);
				} catch (err) {
					console.error(
						`Error reading file ${componentPath}: ${err}`
					);
				}
			}
			return template;
		};

		const finalHTML = await replaceTags(template, tags);

		// Write the final HTML to the index.html file in project-dist
		const INDEX_PATH = path.join(DIST_PATH, 'index.html');
		fs.writeFile(INDEX_PATH, finalHTML, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			console.log('index.html written successfully!');
		});

		// Copy the assets folder to project-dist
		copyFolderRecursive(ASSETS_SRC_PATH, ASSETS_DIST_PATH);
	});
});

// Recursively copy a folder from src to dest, preserving subfolder structure
function copyFolderRecursive(src, dest) {
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest);
	}

	fs.readdirSync(src).forEach((file) => {
		const srcPath = path.join(src, file);
		const destPath = path.join(dest, file);

		if (fs.statSync(srcPath).isDirectory()) {
			copyFolderRecursive(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
			console.log(`File '${file}' copied successfully!`);
		}
	});
}

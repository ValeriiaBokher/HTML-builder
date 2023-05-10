const fs = require('fs').promises;
const path = require('path');

const DIST_PATH = path.join(__dirname, 'project-dist');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const COMPONENTS_PATH = path.join(__dirname, 'components');
const ASSETS_SRC_PATH = path.join(__dirname, 'assets');
const ASSETS_DIST_PATH = path.join(DIST_PATH, 'assets');
const STYLES_PATH = path.join(__dirname, 'styles');
const STYLE_FILE_PATH = path.join(DIST_PATH, 'style.css');

async function main() {
	try {
		// Create project-dist folder
		await fs.mkdir(DIST_PATH, { recursive: true });
		console.log('Project-dist folder created successfully!');

		// Read all CSS files and write them to style.css in project-dist
		const files = await fs.readdir(STYLES_PATH);
		const styles = await Promise.all(
			files
				.filter((file) => path.extname(file) === '.css')
				.map((file) =>
					fs.readFile(path.join(STYLES_PATH, file), 'utf8')
				)
		);
		await fs.writeFile(STYLE_FILE_PATH, styles.join('\n'), 'utf8');
		console.log('style.css written successfully!');

		// Read the HTML template and replace the component tags with their content
		let template = await fs.readFile(TEMPLATE_PATH, 'utf8');
		const regex = /{{(.+?)}}/g;
		const tags = [];
		let match;
		while ((match = regex.exec(template))) {
			tags.push(match[1]);
		}

		console.log('Tags found:', tags);

		for (const tag of tags) {
			const componentPath = path.join(COMPONENTS_PATH, `${tag}.html`);
			const component = await fs.readFile(componentPath, 'utf8');
			template = template.replace(
				new RegExp(`{{${tag}}}`, 'g'),
				component
			);
			console.log(`Tag '${tag}' replaced successfully!`);
		}

		// Write the final HTML to the index.html file in project-dist
		const INDEX_PATH = path.join(DIST_PATH, 'index.html');
		await fs.writeFile(INDEX_PATH, template, 'utf8');
		console.log('index.html written successfully!');

		// Copy the assets folder to project-dist
		await copyFolderRecursive(ASSETS_SRC_PATH, ASSETS_DIST_PATH);
		console.log('Assets folder copied successfully!');
	} catch (err) {
		console.error(err);
	}
}

// Recursively copy a folder from src to dest, preserving subfolder structure
async function copyFolderRecursive(src, dest) {
	try {
		await fs.mkdir(dest, { recursive: true });

		const files = await fs.readdir(src);

		for (const file of files) {
			const srcPath = path.join(src, file);
			const destPath = path.join(dest, file);

			const stat = await fs.stat(srcPath);

			if (stat.isDirectory()) {
				await copyFolderRecursive(srcPath, destPath);
			} else {
				await fs.copyFile(srcPath, destPath);
				console.log(`File '${file}' copied successfully!`);
			}
		}
	} catch (err) {
		console.error(err);
	}
}

main();

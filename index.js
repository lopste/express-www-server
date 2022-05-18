import express from "express";
import fs from "fs";
import util from "util";

import {fileURLToPath} from "url";
import {dirname} from "path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const hidden = JSON.parse(fs.readFileSync(`${__dirname}/hiddenFiles.json`))

app.get('/', (req, res) => {
	res.status(200);
	if(req.accepts("html")) {
		res.sendFile(`${__dirname}/static/index.html`);
		return;
	}
});

app.listen(port, () => {
	console.log(`Web server listening on port ${port}`);
});

app.use(function(req,res,next) {
	let path = `${__dirname}/static${req.path}`;
	if(fs.existsSync(path) && hidden.indexOf(req.path) == -1) {
		if(!fs.lstatSync(path).isDirectory()) {
			res.status(200);
			res.sendFile(path);
			return;
		}
	}

	res.status(404);
	if(req.accepts("html")) {
		res.sendFile(`${__dirname}/static/404.html`);
		return;
	}
	if(req.accepts("json")) {
		res.json({"error": "Not Found"});
		return;
	}
	res.type("txt").send("Not Found");
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = 'data';

function slugToPath(slug) {
  const filename = `${slug}.md`;
  return path.join(DATA_DIR, filename);
}

function jsonOK(res, data) {
  res.json({ status: 'ok', ...data });
}

function jsonError(res, message) {
  res.json({ status: 'error', message });
}

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/page/:slug', async (req, res) => {
  const filename = slugToPath(req.params.slug);
  try {
    const body = await readFile(filename, 'utf-8');
    return jsonOK(res, { body });
  } catch (e) {
    return jsonError(res, 'Page does not exist.');
  }
});

app.post('/api/page/:slug', async (req, res) => {
  const filename = slugToPath(req.params.slug);
  try {
    const body = req.body.body;
    await writeFile(filename, body);
    return jsonOK(res);
  } catch (e) {
    return jsonError(res, 'Could not write page.');
  }
});

app.get('/api/pages/all', async (req, res) => {
  const filenames = await readDir(DATA_DIR);
  const pages = filenames.map(filename => path.parse(filename).name);
  return jsonOK(res, { pages });
});

app.get('/api/tags/:tag', async (req, res) => {
  const TAG_RE = /#(\w+)/;
  const tag = req.params.tag;
  let filenames = await readDir(DATA_DIR);
  filenames = filenames.map(f => path.join(DATA_DIR, f));
  const promises = filenames.map(async f => {
    const body = await readFile(f, 'utf-8');
    return TAG_RE.match(body);
  });
  const results = await Promise.all(promises);
  console.log('QUERY', q);
  return jsonOK(res, { q });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Wiki app is serving at http://localhost:${port}`));

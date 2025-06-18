const fs = require("fs").promises;
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const categoriesDir = path.join(dataDir, "categories");
const notesDir = path.join(dataDir, "notes");

async function ensureDirectories() {
  await fs.mkdir(categoriesDir, { recursive: true });
  await fs.mkdir(notesDir, { recursive: true });
}

async function readData(type) {
  const dir = type === "categories" ? categoriesDir : notesDir;
  const files = await fs.readdir(dir);
  const items = [];
  for (const file of files) {
    if (file.endsWith(".json")) {
      const content = await fs.readFile(path.join(dir, file), "utf8");
      items.push(JSON.parse(content));
    }
  }
  return items;
}

async function readItemById(type, id) {
  const dir = type === "categories" ? categoriesDir : notesDir;
  const filePath = path.join(dir, `${id}.json`);
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

async function writeData(type, item) {
  const dir = type === "categories" ? categoriesDir : notesDir;
  const filePath = path.join(dir, `${item.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(item, null, 2));
}

async function deleteData(type, id) {
  const dir = type === "categories" ? categoriesDir : notesDir;
  const filePath = path.join(dir, `${id}.json`);
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function saveNote(note) {
  await writeData("notes", note);
}

module.exports = {
  readData,
  readItemById,
  writeData,
  saveNote,
  deleteData,
  ensureDirectories,
};

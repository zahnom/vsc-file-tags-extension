const vscode = require("vscode");
const fs = require("fs");
const fsPromise = fs.promises;

const path = "./file-tag.json";

const getData = async () => {
  if (!fs.existsSync(path)) return {};
  const data = await fsPromise.readFile(path, { encoding: "utf8" });
  return JSON.parse(data) || {};
};

const saveData = async (data = {}) => {
  const result = await fsPromise.writeFile(
    path,
    JSON.stringify(data, undefined, 2)
  );
  console.log("result::", result);
  return result;
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "file-tag" is now active!');

  let disposable = vscode.commands.registerCommand(
    "file-tag.createTag",
    async () => {
      try {
        const input = await vscode.window.showInputBox({
          placeHolder: "Enter description"
        });
        const activeTE = vscode.window.activeTextEditor;
        const filePath = activeTE["_documentData"]["_uri"]["path"];
        const data = await getData();
        data[filePath] = input;
        saveData(data);
        // console.log(input, activeTE, filePath);
      } catch (err) {
        console.log(err);
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};

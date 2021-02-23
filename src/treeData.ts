import * as vscode from 'vscode';
import * as path from 'path';
import FileTag from './util';
import { parseData } from './helpers';

export class FileTagProvider implements vscode.TreeDataProvider<TreeItem> {
  fileTag: FileTag;

  constructor(private workspaceRoot: string) {
    this.fileTag = new FileTag();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TreeItem): Thenable<TreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('Cannot use extension in empty workspace.');
      return Promise.resolve([]);
    }

    if (this.fileTag.empty) {
      vscode.window.showInformationMessage('No tags.');
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve([new TreeItem(element.filePath, undefined, undefined, vscode.TreeItemCollapsibleState.None)]);
    } else {
      const { meta } = parseData(this.fileTag);
      const tagList = meta.map(([filePath, { name }]) => new TreeItem(name, filePath, 'v1', vscode.TreeItemCollapsibleState.Collapsed));

      return Promise.resolve(tagList);
    }
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public filePath: string | undefined,
    private status: string | undefined,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = this.label;
    this.description = this.status;
    this.filePath = this.filePath;
  }

  command = {
    title: 'open',
    command: 'file-tag.openTag',
    arguments: [this.filePath]
  };

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  };
}
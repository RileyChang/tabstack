import * as vscode from "vscode";

export type GroupConfig = {
  tabs: string[];
  groupPosition: vscode.ViewColumn;
};

export type Arrangement = GroupConfig[];

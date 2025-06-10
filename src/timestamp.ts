import * as vscode from "vscode";

export function insertTimestamp() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found");
    return;
  }

  const now = new Date();
  const dayOfWeek = now.toLocaleString("en-GB", { weekday: "short" });

  // Manually format the date components
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const timestamp = `[${dayOfWeek} ${year}-${month}-${day} ${hours}:${minutes}]`;

  editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, timestamp);
  });
}

import * as vscode from "vscode";
import { getArrangement } from "./tabs";
import { Arrangement } from "./types";

const CONFIG_KEY = "ARRANGEMENTS";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("tabstack.save", async () => {
      const arrangement = getArrangement();

      // Prompt user for a string to label this arrangement.
      let configName = "[default]";
      await vscode.window
        .showInputBox({
          prompt: "Name for this tab arrangement?",
          placeHolder: "my cool feature",
          ignoreFocusOut: true, // Keeps the input box open even if it loses focus
        })
        .then((input) => {
          if (input !== undefined) {
            configName = input;
          }
        });

      // Write config to a JSON file in the extension's workspace storage
      const currentConfigs = context.workspaceState.get(
        CONFIG_KEY,
        {}
      ) as Record<string, Arrangement>;
      currentConfigs[configName] = arrangement;
      context.workspaceState.update(CONFIG_KEY, currentConfigs);

      vscode.window.showInformationMessage("Tab arrangement saved!");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tabstack.load", async () => {
      const currentConfigs = context.workspaceState.get(
        CONFIG_KEY,
        {}
      ) as Record<string, Arrangement>;

      const arrangementName = await vscode.window.showQuickPick(
        Object.keys(currentConfigs),
        {
          placeHolder: "Select a tab arrangement to restore",
        }
      );
      if (!arrangementName) {
        return;
      }

      const config = currentConfigs[arrangementName];

      await vscode.commands.executeCommand("workbench.action.closeAllEditors");
      config.forEach(async (group) => {
        for (const tabPath of group.tabs) {
          const uri = vscode.Uri.file(tabPath);
          await vscode.window.showTextDocument(uri, {
            viewColumn: group.groupPosition,
            preview: false,
          });
        }
      });

      vscode.window.showInformationMessage(
        `Tab arrangement \"${arrangementName}\" loaded!`
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tabstack.clear", () => {
      context.workspaceState.update(CONFIG_KEY, {});
      vscode.window.showInformationMessage("Cleared all tab arrangements.");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tabstack.delete", async () => {
      const currentConfigs = context.workspaceState.get(
        CONFIG_KEY,
        {}
      ) as Record<string, Arrangement>;

      const arrangementName = await vscode.window.showQuickPick(
        Object.keys(currentConfigs),
        {
          placeHolder: "Select a tab arrangement to delete",
        }
      );
      if (!arrangementName) {
        return;
      }

      delete currentConfigs[arrangementName];
      context.workspaceState.update(CONFIG_KEY, currentConfigs);

      vscode.window.showInformationMessage(
        `Tab arrangement \"${arrangementName}\" deleted`
      );
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

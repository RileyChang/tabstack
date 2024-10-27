import * as vscode from "vscode";
import { GroupConfig } from "./types";

/**
 * Gets the current arrangement of open tabs in VS Code, collecting file paths and grouping information.
 */
export function getArrangement(): GroupConfig[] {
  const tabGroups = vscode.window.tabGroups;

  const groupConfigs: GroupConfig[] = [];
  tabGroups.all.forEach((group) => {
    const groupConfig = {
      tabs: [] as string[],
      groupPosition: group.viewColumn,
    };

    group.tabs.forEach((tab) => {
      if (tab.input instanceof vscode.TabInputText) {
        groupConfig.tabs.push(tab.input.uri.path);
      }
    });

    groupConfigs.push(groupConfig);
  });

  return groupConfigs;
}

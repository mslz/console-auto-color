import * as vscode from "vscode";

const reset = "\x1b[0m";
const blue = "\x1b[34m";
const yellow = "\x1b[33m";
const redBackground = "\x1b[41m";

const supportedLogs = [
  ["info", blue],
  ["warn", yellow],
  ["error", redBackground],
];
const paddingLength = 1;

const logMethodTransform = supportedLogs.map(([method, color]) => ({
  withoutColors: `console.${method}()`,
  withColors: `console.${method}("${color}  ${reset}")`,
  offset: -(`${reset}"`.length + paddingLength),
}));

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidChangeTextDocument((e) => {
    const change = e.contentChanges[0];

    const line = e.document.lineAt(change.range.start);

    logMethodTransform.forEach(async (log) => {
      if (line.text.includes(log.withoutColors)) {
        const newLineText = line.text.replace(
          log.withoutColors,
          log.withColors
        );

        const workspace = new vscode.WorkspaceEdit();
        workspace.replace(e.document.uri, line.range, newLineText);
        await vscode.workspace.applyEdit(workspace);

        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor) {
          const newPosition = new vscode.Position(
            activeEditor.selection.active.line,
            activeEditor.selection.active.character + log.offset
          );
          const newSelection = new vscode.Selection(newPosition, newPosition);
          activeEditor.selection = newSelection;
        }
      }
    });
  });
}

export function deactivate() {}

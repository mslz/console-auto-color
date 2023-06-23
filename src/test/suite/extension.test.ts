import * as assert from "assert";
import * as vscode from "vscode";

import * as myExtension from "../../extension";

const waitFunction = (ms: number) => new Promise((res) => setTimeout(res, ms));

suite("Console-auto-color test suite", () => {
  vscode.window.showInformationMessage("Running tests...");

  vscode.workspace.updateWorkspaceFolders(
    0,
    vscode.workspace.workspaceFolders?.length,
    {
      uri: vscode.Uri.parse(__dirname),
      name: "Test Folder",
    }
  );

  myExtension.activate();

  test("should not modify a default console.log method", async function () {
    this.timeout(5000);

    const edit = new vscode.WorkspaceEdit();
    const wsPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    const filePath = vscode.Uri.file(wsPath + "/testFile.js");
    edit.createFile(filePath, { overwrite: true });
    await vscode.workspace.applyEdit(edit);

    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(filePath);

    const currentPosition = new vscode.Position(
      vscode.window.activeTextEditor?.selection.active.line || 0,
      vscode.window.activeTextEditor?.selection.active.character || 0
    );

    edit.insert(filePath, currentPosition, "console.log()");
    await vscode.workspace.applyEdit(edit);

    // wait until an addon has a chance to (not) modify the document
    await waitFunction(1000);

    const text = document.getText();

    assert.equal(text, "console.log()");
  });

  test("should not modify a console.info method without complete parenthesis", async function () {
    this.timeout(5000);

    const edit = new vscode.WorkspaceEdit();
    const wsPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    const filePath = vscode.Uri.file(wsPath + "/testFile.js");
    edit.createFile(filePath, { overwrite: true });
    await vscode.workspace.applyEdit(edit);

    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(filePath);

    const currentPosition = new vscode.Position(
      vscode.window.activeTextEditor?.selection.active.line || 0,
      vscode.window.activeTextEditor?.selection.active.character || 0
    );

    edit.insert(filePath, currentPosition, "console.info(");
    await vscode.workspace.applyEdit(edit);

    await waitFunction(1000);

    const text = document.getText();

    assert.equal(text, "console.info(");
  });

  test("should modify a console.info method by applying blue ASCI color codes, resetting to a default color at the end and positioning the cursor", async function () {
    this.timeout(5000);

    const edit = new vscode.WorkspaceEdit();
    const wsPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    const filePath = vscode.Uri.file(wsPath + "/testFile.js");
    edit.createFile(filePath, { overwrite: true });
    await vscode.workspace.applyEdit(edit);

    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(filePath);

    const currentPosition = new vscode.Position(
      vscode.window.activeTextEditor?.selection.active.line || 0,
      vscode.window.activeTextEditor?.selection.active.character || 0
    );

    edit.insert(filePath, currentPosition, "console.info()");
    await vscode.workspace.applyEdit(edit);

    await waitFunction(1000);

    const text = document.getText();
    const currentLine = vscode.window.activeTextEditor?.selection.active.line;
    const currentCharacter =
      vscode.window.activeTextEditor?.selection.active.character;

    assert.equal(text, 'console.info("\x1B[34m  \x1B[0m")');
    assert.equal(currentLine, 0);
    assert.equal(currentCharacter, 15);
  });

  test("should modify a console.warn method by applying yellow ASCI color codes, resetting to a default color at the end and positioning the cursor", async function () {
    this.timeout(5000);

    const edit = new vscode.WorkspaceEdit();
    const wsPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    const filePath = vscode.Uri.file(wsPath + "/testFile.js");
    edit.createFile(filePath, { overwrite: true });
    await vscode.workspace.applyEdit(edit);

    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(filePath);

    const currentPosition = new vscode.Position(
      vscode.window.activeTextEditor?.selection.active.line || 0,
      vscode.window.activeTextEditor?.selection.active.character || 0
    );

    edit.insert(filePath, currentPosition, "console.warn()");
    await vscode.workspace.applyEdit(edit);

    await waitFunction(1000);

    const text = document.getText();
    const currentLine = vscode.window.activeTextEditor?.selection.active.line;
    const currentCharacter =
      vscode.window.activeTextEditor?.selection.active.character;

    assert.equal(text, 'console.warn("\x1B[33m  \x1B[0m")');
    assert.equal(currentLine, 0);
    assert.equal(currentCharacter, 15);
  });

  test("should modify a console.error method by applying red background ASCI color codes, resetting to a default color at the end and positioning the cursor", async function () {
    this.timeout(5000);

    const edit = new vscode.WorkspaceEdit();
    const wsPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    const filePath = vscode.Uri.file(wsPath + "/testFile.js");
    edit.createFile(filePath, { overwrite: true });
    await vscode.workspace.applyEdit(edit);

    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(filePath);

    const currentPosition = new vscode.Position(
      vscode.window.activeTextEditor?.selection.active.line || 0,
      vscode.window.activeTextEditor?.selection.active.character || 0
    );

    edit.insert(filePath, currentPosition, "console.error()");
    await vscode.workspace.applyEdit(edit);

    await waitFunction(1000);

    const text = document.getText();
    const currentLine = vscode.window.activeTextEditor?.selection.active.line;
    const currentCharacter =
      vscode.window.activeTextEditor?.selection.active.character;

    assert.equal(text, 'console.error("\x1B[41m  \x1B[0m")');
    assert.equal(currentLine, 0);
    assert.equal(currentCharacter, 16);
  });
});

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "file-ref-tags" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('file-ref-tags.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from file-ref-tags!');
	});

	context.subscriptions.push(disposable);

	// Register webview view provider
	const webviewViewProvider = new FileRefTagsViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('file-ref-tags.list-view', webviewViewProvider)
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}

class FileRefTagsViewProvider implements vscode.WebviewViewProvider {

	constructor(private readonly _extensionUri: vscode.Uri) { }

	resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		// Set the webview options
		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};

		// Set the webview HTML content
		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		// Handle messages from the webview
		webviewView.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'hello':
						vscode.window.showInformationMessage(message.text);
						return;
				}
			},
			undefined,
			// No need for a disposal token here since webviewView is already tracked
		);

		// Handle view state changes
		webviewView.onDidChangeVisibility(() => {
			if (webviewView.visible) {
				// Update the view when it becomes visible
				webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
			}
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview): string {
		// Return a simple HTML content for the webview
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>File Ref Tags</title>
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
					margin: 0;
					padding: 16px;
					background-color: #1e1e1e;
					color: #d4d4d4;
				}
				h1 {
					font-size: 18px;
					margin-bottom: 16px;
				}
				.empty-state {
					text-align: center;
					padding: 32px 0;
					color: #858585;
				}
				button {
					background-color: #0e639c;
					color: white;
					border: none;
					padding: 8px 16px;
					border-radius: 4px;
					cursor: pointer;
					font-size: 14px;
				}
				button:hover {
					background-color: #1177bb;
				}
			</style>
		</head>
		<body>
			<h1>File References</h1>
			<div class="empty-state">
				<p>No references yet. Add your first reference!</p>
				<button onclick="sendMessage('Hello from webview!')">Test Button</button>
			</div>

			<script>
				const vscode = acquireVsCodeApi();

				function sendMessage(text) {
					vscode.postMessage({
						command: 'hello',
						text: text
					});
				}
			</script>
		</body>
		</html>`;
	}
}

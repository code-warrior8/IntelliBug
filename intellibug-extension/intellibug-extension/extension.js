const vscode = require('vscode');
const https = require('http');

function activate(context) {
	console.log('IntelliBug Extension is now active!');

	let disposable = vscode.commands.registerCommand('intellibug.detectBugs', async function () {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No file is open!');
			return;
		}

		const code = editor.document.getText();
		vscode.window.showInformationMessage('🔍 Analyzing your code...');

		const postData = JSON.stringify({ code: code, user_email: "vscode-user" });

		const options = {
			hostname: 'localhost',
			port: 8000,
			path: '/detect-bugs',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(postData)
			}
		};

		const req = https.request(options, (res) => {
			let data = '';
			res.on('data', (chunk) => { data += chunk; });
			res.on('end', () => {
				try {
					const result = JSON.parse(data);
					if (result.bugs_found) {
						const issues = result.issues.join('\n• ');
						vscode.window.showWarningMessage(`⚠️ Bugs Found:\n• ${issues}`);
					} else {
						vscode.window.showInformationMessage('✅ No bugs found! Great code!');
					}
				} catch (e) {
					vscode.window.showErrorMessage('Error parsing response');
				}
			});
		});

		req.on('error', (e) => {
			vscode.window.showErrorMessage(`❌ Cannot connect to IntelliBug backend. Make sure it's running on port 8000!`);
		});

		req.write(postData);
		req.end();
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
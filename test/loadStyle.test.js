const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const BootstrapEmail = require('../src/BootstrapEmail');

const html = '<div class="container"><div class="row"><div class="col-6">hi</div></div></div>';

test('reads style variables from the default stylesheet', () => {
	const email = new BootstrapEmail(html, {logLevel: BootstrapEmail.LOG_LEVEL.ERROR});
	assert.deepStrictEqual(email._vars, {'$grid-columns': 12});
	assert.match(email.compile(), /width: *50%/);
});

test('reads overridden style variables from a custom stylesheet', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'be-'));
	const style = path.join(dir, 'custom.scss');
	fs.writeFileSync(style, '$grid-columns: 6;\n$container-max-width: 480px;\n@import "' +
		path.join(__dirname, '../src/assets/bootstrap-email.scss').replace(/\\/g, '/') + '";\n');
	const email = new BootstrapEmail(html, {
		style,
		variables: {'$container-max-width': 600},
		logLevel: BootstrapEmail.LOG_LEVEL.ERROR
	});
	assert.deepStrictEqual(email._vars, {'$grid-columns': 6, '$container-max-width': 480});
	assert.match(email.compile(), /width: *100%/);
});

const ensureLoggedOut = require(`${CV_ROOT}/controllers/concerns/ensureLoggedOut`);

async function Create(req, res) {
}

module.exports = ensureLoggedOut(Create);

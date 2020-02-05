const diffdb = require('../services/diffdb');

module.exports = model => diffdb.getDb({name: model.name});
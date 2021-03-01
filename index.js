const fs = require('fs')

var env = process.env.NODE_ENV || 'unknown';
const homedir = require('os').homedir();

if (env == 'unknown') {
    console.error("missing env");
    process.exit();
}

var cfg = {
    misc: {},
    sfdc: {},
    local: {}
};

const miscfg = `${homedir}/sfdc/etc/jsconfig/misc.json`;
if (fs.existsSync(miscfg)) {
    cfg.misc = require(miscfg);
}

const localcfg = __dirname + '/../../config/default.json';
if (fs.existsSync(localcfg)) {
    cfg.local = require(localcfg);
}

const sfdccfg = `${homedir}/sfdc/etc/jsconfig/sfdc.json`;
if (fs.existsSync(sfdccfg)) {
    var sfdc = require(sfdccfg);

    if (sfdc[env]) {
        cfg.sfdc = sfdc[env];
    } else {
        console.error(`unknown auth ${env}`);
        process.exit();
    }
}

module.exports = cfg;

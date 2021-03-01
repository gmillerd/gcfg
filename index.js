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
    store: {},
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

const storecfg = __dirname + '/../../config/store.json';
if (fs.existsSync(storecfg)) {
    cfg.store = require(storecfg);
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

cfg.set = function(key, val) {
    cfg.store[key] = val;
    fs.writeFileSync(storecfg, JSON.stringify(cfg.store, null, 3));
};

module.exports = cfg;

const fs = require("fs");

const env = process.env.NODE_ENV || "unknown";
const homedir = require("os").homedir();

if (env == "unknown") {
    console.error("missing process.env");
    process.exit();
}

var cfg = {};

var stubs = {
    misc: `${homedir}/sfdc/etc/jsconfig/misc.json`,
    sfdc: `${homedir}/sfdc/etc/jsconfig/sfdc.json`,
    local: `${__dirname}/../../config/default.json`,
    store: `${__dirname}/../../config/store.json`,
};

for (const [name, file] of Object.entries(stubs)) {
    cfg[name] = {};
    if (fs.existsSync(file)) {
        if (name == "sfdc") {
            var sfdc = require(file);
            if (sfdc[env]) {
                cfg.sfdc = sfdc[env];
            } else {
                console.error(`unknown auth ${env}`);
                process.exit();
            }
        } else {
            cfg[name] = require(file);
        }
    }
}

cfg.save = function() {
    fs.writeFileSync(stubs["store"], JSON.stringify(cfg.store, null, 3));
};

module.exports = cfg;
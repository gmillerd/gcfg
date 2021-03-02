const fs = require("fs");

const env = process.env.NODE_ENV || "unknown";
const homedir = require("os").homedir();

if (env == "unknown") {
    console.error("missing process.env");
    process.exit();
}

var cfg = {};

var stubs = [{
    name: "misc",
    file: `${homedir}/sfdc/etc/jsconfig/misc.json`
}, {
    name: "sfdc",
    file: `${homedir}/sfdc/etc/jsconfig/sfdc.json`
}, {
    name: "local",
    file: `${__dirname}/../../config/default.json`
}, {
    name: "store",
    file: `${__dirname}'/../../config/store.json`
}];

stubs.forEach((e) => {
    cfg[e.name] = {};
    if (fs.existsSync(e.file)) {
        if (e.name == "sfdc") {
            var sfdc = require(e.file);
            if (sfdc[env]) {
                cfg.sfdc = sfdc[env];
            } else {
                console.error(`unknown auth ${env}`);
                process.exit();
            }
        } else {
            cfg[e.name] = require(e.file);
        }
    }
});

// console.log(cfg);

cfg.save = function() {
    fs.writeFileSync(stubs["store"].file, JSON.stringify(cfg.store, null, 3));
};

module.exports = cfg;
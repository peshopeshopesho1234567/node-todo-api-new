var env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {

    var config = require("./config.json");
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        if (key !== "NODE_ENV") {
            process.env[key] = envConfig[key];
        }
    });
}
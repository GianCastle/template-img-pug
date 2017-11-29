const pug = require("pug");
const _ = require("lodash");
const phantom = require("phantom");
const Promise = require("promise");

function templateToImage(imageType, width, height, address, options) {
    let page, status, instance, base64;

    let html = pug.renderFile(address, options);
    return new Promise((resolve, reject) => {
        phantom.create().then((_instance) => {
            instance = _instance;

            return instance.createPage();
        }).then(function (_page) {
            page = _page;
            page.property("viewportSize", { width: width, height: height });
            page.property("content", html);
            console.log(html)

            return page.property("onLoadFinished");
        }).then(function () {
            return page.renderBase64(imageType);
        }).then(function (_base64) {
            base64 = _base64;

            resolve(Buffer.from(base64, "base64"));

            instance.exit(0);
        }).catch(function (error) {
            reject(error);

            instance.exit(1);
        });
    });
}

module.exports = _.curry(pugToImage);

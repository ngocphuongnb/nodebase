function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      lasso_page = __loadTag(require("lasso/taglib/page-tag"));

  return function render(data, out) {
    lasso_page({
        packagePath: data.lassoPackage,
        dirname: __dirname,
        filename: __filename
      }, out);

    out.w("<!DOCTYPE html> <html lang=\"en\"> ");

    data.view.header.render({
        page: data.lassoPackage,
        browser_pack: data.lassoPackage
      }, out);

    out.w(" <body> <header> ");

    data.view.sidebar.render(data.moduleData, out);

    out.w(" </header> <main> ");

    data.view.module.render(data.moduleData, out);

    out.w(" </main> ");

    data.view.footer.render({}, out);

    out.w(" </body> </html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);

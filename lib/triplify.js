module.exports = function triplify(data, feed) {
  const languagePath = this.getParam('language', 'ISTEX/language/0');
  const property = this.getParam('property', 'http://a.link/of/some#sort');
  const doiPath = this.getParam('doi', 'ISTEX/doi/0');

  const language = data && data[languagePath];
  const doi = data && data[doiPath];

  if (doi && language) {
    feed.write(`<${language}> <${property}> "${doi}" .\n`);
  } else if (!doi && data) {
    feed.write(`${data.id} has no doi\n`);
  }
  if (this.isLast()) {
    feed.close();
  }
  feed.end();
};

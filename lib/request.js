const OBJ = require('dot-prop');
const request = require('request');
const url = require('url');

module.exports = function ISTESRequest(data, feed) {
  const path = this.getParam('path', 'ISTEX');
  const json = this.getParam('json', true);
  let handle = OBJ.get(data, path);
  if (handle === undefined) {
    handle = data;
  }

  if (this.isLast()) {
    feed.close();
  } else {
    const urlObj = {
      url: url.format(handle),
      method: 'GET',
      json,
    };
    request(urlObj, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        if (handle === undefined) {
          feed.send(body);
        } else {
          OBJ.set(data, path, body);
          feed.send(data);
        }
      } else {
        throw error;
      }
    });
  }
};


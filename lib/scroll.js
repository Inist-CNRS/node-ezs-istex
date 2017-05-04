const request = require('request');
const url = require('url');

let nextURI;
let json;

/**
 * Get the nextURI in the API and call himself until body have noMoreScrollResults : true
 */
function scrollRecursive(feed) {
  const options = {
    uri: nextURI,
    method: 'GET',
    json,
  };

  request(options, (error, reponse, body) => {
    if (error) {
      /* eslint-disable */
      console.error('options:', options);
      console.error('error', error);
      console.error(
        'response',
        reponse.statusCode,
        reponse.statusMessage,
        reponse.headers
      );
      /* eslint-enable */
      return feed.end();
    }
    if (body.noMoreScrollResults) {
      return feed.close();
    }
    feed.write(body);
    return scrollRecursive(feed);
  });
}

/**
 * scroll use the scrolling features of API istex
 * data: urlObj in data.ISTEX
 * params:
 * - sid: user agent (lodex by default)
 */
module.exports = function scroll(data, feed) {
  // console.time('scroll');

  const sid = this.getParam('sid', 'lodex');
  json = this.getParam('json', true);


  const urlObj = data.ISTEX;
  urlObj.search += `&scroll=30s&sid=${sid}`;

  const options = {
    uri: url.format(urlObj),
    method: 'GET',
    json,
  };

  request(options, (error, response, body) => {
    if (error) {
      /* eslint-disable */
      console.error('options:', options);
      console.error('error', error);
      console.error('response',
        response.statusCode,
        response.statusMessage,
        response.headers
      );
      /* eslint-enable */
    }
    if (body.hits.length) {
      feed.write(body);
    }
    if (!body.noMoreScrollResults) {
      nextURI = body.nextScrollURI;

      scrollRecursive(feed);
    }
  });
};

/**
 * Take the content of a zip file, and extract JSON files.
 *
 * The zip file comes from dl.istex.fr, and the `manifest.json` is not
 * extracted.
 *
 * @name ISTEXUnzip
 * @returns Array<Object>
 */
function ISTEXUnzip(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    feed.end();
}

export default {
    ISTEXUnzip,
};

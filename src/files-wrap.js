import archiver from 'archiver';
import { PassThrough } from 'stream';

const add2archive = (archive, { content, name }) => {
    if (content && name) {
        archive.append(content, { name });
        return true;
    }
    return false;
};
/**
 * Take and Object with ISTEX `stream` and wrap inta un single zip
 *
 * @name ISTEXFilesWrap
 * @see ISTEXFiles
 * @returns {Array}
 */
function ISTEXFilesWrap(data, feed) {
    const format = this.getParam('format', 'zip');
    if (this.isFirst()) {
        this.output = new PassThrough();
        this.archive = archiver(format, {
            zlib: {
                level: 9,
            },
        });
        this.archive.pipe(this.output);
        this.output.on('data', d => feed.write(d));
        this.output.on('end', () => feed.close());
        this.output.on('error', e => feed.stop(e));
        this.firstChunk = data;
        feed.end();
        return;
    }

    if (this.firstChunk) {
        add2archive(this.archive, this.firstChunk);
        this.firstChunk = null;
    }

    if (this.isLast()) {
        this.archive.finalize();
        return;
    }

    add2archive(this.archive, data);
    feed.end();
}

export default {
    ISTEXFilesWrap,
};

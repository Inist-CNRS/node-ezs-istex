import { PassThrough } from 'stream';
import unzipper from 'unzipper';

function writeTo(stream, data, cb) {
    const check = stream.write(data);
    if (!check) {
        stream.once('drain', cb);
    } else {
        process.nextTick(cb);
    }
    return check;
}

/**
 * Take the content of a zip file, and extract JSON files.
 *
 * The zip file comes from dl.istex.fr, and the `manifest.json` is not
 * extracted.
 *
 * @name ISTEXUnzip
 * @returns Array<Object>
 */
export default function ISTEXUnzip(data, feed) {
    const { ezs } = this;
    if (this.isFirst()) {
        this.input = new PassThrough({ objectMode: true });

        const output = this.input
            .pipe(unzipper.Parse())
            .on('entry', (entry) => {
                const fileName = entry.path;
                if (fileName === 'manifest.json') {
                    entry.autodrain();
                } else if (fileName.endsWith('.json')) {
                    let str = '';
                    entry
                        .pipe(ezs(function uncompress(data2, feed2) {
                            if (this.isLast()) {
                                const obj = JSON.parse(str);
                                feed.write(obj);
                                return feed2.close();
                            }
                            str += data2.toString();
                            return feed2.end();
                        }));
                } else {
                    entry.autodrain();
                }
            })
            .on('error', e => feed.write(e))
            .on('data', d => feed.write(d));

        this.whenFinish = new Promise((resolve, reject) => {
            output.on('end', resolve);
            output.on('error', reject);
        });
    }
    if (this.isLast()) {
        this.whenFinish
            .then(() => feed.close())
            .catch(e => feed.stop(e));
        this.input.end();
    } else {
        writeTo(this.input, data, () => feed.end());
    }
    return 1;
}

// export default {
//     ISTEXUnzip,
// };

// See https://github.com/touv/node-ezs/blob/master/src/statements/delegate.js

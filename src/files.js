import URL from 'url';
import InistARK from 'inist-ark';

const ark = new InistARK();
/**
 * Take and Object with ISTEX `id` and genrate objetc for each files
 *
 * @name ISTEXFiles
 * @see ISTEXScroll
 * @param {string} [fulltext=pdf]    typology of the document to save
 * @param {string} [metadata=mods]   format of the files to save
 * @param {string} [sid="ezs-istex"]  User-agent identifier
 * @returns {Array}
 */
function ISTEXFiles(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const typology = this.getParam('fulltext');
    const typologies = Array.isArray(typology) ? typology : [typology];
    const record = this.getParam('metadata', 'json');
    const records = Array.isArray(record) ? record : [record];
    const enrichment = this.getParam('enrichment');
    const enrichments = Array.isArray(enrichment) ? enrichment : [enrichment];
    const sid = this.getParam('sid', 'ezs-istex');
    const location = {
        protocol: 'https:',
        host: 'api.istex.fr',
    };
    if (!data.hits && !data.arkIstex) {
        throw new Error(
            '[ISTEXFetch] or [ISTEXScroll] should be defined'
            + ' before this statement.',
        );
    }
    if (records.length === 0 && typologies.length === 0) {
        throw new Error('metadata or fulltext must be defined as parameter.');
    }

    const identifiers = data.hits ? data.hits : [data];
    identifiers.map(({ id, arkIstex }) => {
        const { name: arkName } = ark.parse(arkIstex);
        return [
            ...enrichments.filter(Boolean).map(enri => `${arkIstex}/enrichment.${enri}`),
            ...typologies.filter(Boolean).map(typo => `${arkIstex}/fulltext.${typo}`),
            ...records.map(form => `${arkIstex}/record.${form}`),
        ].forEach((pathname) => {
            const urlObj = {
                ...location,
                pathname,
                query: {
                    sid,
                },
            };
            const cmdObj = {
                id,
                arkIstex,
                name: pathname.replace('ark:', ''),
                source: URL.format(urlObj),
            };
            feed.write(cmdObj);
        });
    });
    feed.end();
}

export default {
    ISTEXFiles,
};

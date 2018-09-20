import { contains } from 'ramda';

const triples = {};
const previous = {};

// TODO: mutualize getTriple (see ISTEXRemoveIf)
function getTriple(line) {
    let [subject, verb, complement] = line.split('> ', 3);
    subject += '>';
    verb += '>';
    if (complement === '.\n') {
        // In the case of a verb badly parsed (ex: <uri1> a <uri2>)
        [verb, complement] = verb.split(' ', 2);
    } else if (!complement.endsWith('" .\n')) {
        // In the case of an URI, split removed the end of the complement
        complement += '>';
    } else /* if (complement.endsWith(' .\n')) */ {
        // In the normal case
        complement = complement.slice(0, -3); // Remove " .\n"
    }
    return [subject, verb, complement];
}

function ISTEXRemoveVerb(data, feed) {
    const verbToRemove = this.getParam('verb', '');
    function writeFilteredTriples() {
        triples[verbToRemove] = triples[verbToRemove].filter(triple => !contains(triple.verb, verbToRemove));
        triples[verbToRemove].forEach(t => feed.write(`${t.subject} ${t.verb} ${t.complement} .\n`));
    }

    if (this.isLast()) {
        writeFilteredTriples();
        return feed.close();
    }

    const [subject, verb, complement] = getTriple(data);

    if (this.isFirst()) {
        triples[verbToRemove] = [];
        previous[verbToRemove] = subject;
    }

    if (previous[verbToRemove] && subject !== previous[verbToRemove]) {
        writeFilteredTriples();
        triples[verbToRemove] = [];
        previous[verbToRemove] = subject;
    }

    triples[verbToRemove].push({ subject, verb, complement });
    feed.end();
}

/**
 * Unconditionnaly remove triples which `verb` is given.
 *
 * @param {string} verb   `"<https://data.istex.fr/ontology/istex#idIstex>"`
 *
 * @example
 * <https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/ontology/istex#idIstex> "2FF3F5B1477986B9C617BB75CA3333DBEE99EB05" .
 * <https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> a <http://purl.org/ontology/bibo/Document> .
 * <https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <host/genre> "journal" .
 * <https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/fake#journalTitle> "Linguistic Typology" .
 *
 * @example
 * [ISTEXRemoveIf]
 * verb = <host/genre>
 *
 * @example
 * <https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/ontology/istex#idIstex> "2FF3F5B1477986B9C617BB75CA3333DBEE99EB05" .
 * <https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> a <http://purl.org/ontology/bibo/Document> .
 * <https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/fake#journalTitle> "Linguistic Typology" .
 */
export default {
    ISTEXRemoveVerb,
};

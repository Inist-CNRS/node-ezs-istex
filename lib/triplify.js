/**
 * Triplify data
 *
 * Ex:
 * .pipe(ezs('triplify', {
 *    properties: {
 *      'ISTEX/doi/': 'http://purl.org/ontology/bibo/doi',
 *      'ISTEX/language/': 'http://purl.org/dc/terms/language'
 *    }
 *  ));
 * --->
 * <http://lod.istex.fr/2FF3F5B1477986B9C617BB75CA3333DBEE99EB05>
 *   a <http://purl.org/ontology/bibo/Document> ;
 *   <http://purl.org/dc/terms/language> <http://lexvo.org/id/iso639-3/fra> ;
 *   <http://purl.org/ontology/bibo/doi>  "10.1002/zaac.19936190205" ;
 *   <http://lod.istex.fr/ontology/istex#idIstex> "2FF3F5B1477986B9C617BB75CA3333DBEE99EB05" .
 *
 */
module.exports = function triplify(data, feed) {
  const properties = this.getParam('properties', {});

  if (this.isLast()) {
    feed.close();
    feed.end();
    return;
  }

  feed.write(`<http://lod.istex.fr/${data['ISTEX/id']}> a <http://purl.org/ontology/bibo/Document> .\n`);
  feed.write(`<http://lod.istex.fr/${data['ISTEX/id']}> <http://lod.istex.fr/ontology/istex#idIstex> "${data['ISTEX/id']}" .\n`);
  Object.keys(properties).forEach((path) => {
    if (path[path.length - 1] === '/') {
      // path points to an array
      const values = [];
      let i = 0;
      while (data[path + i]) {
        values.push(data[path + i]);
        i += 1;
      }
      if (values.length) {
        for (i = 0; i < values.length; i += 1) {
          feed.write(`<http://lod.istex.fr/${data['ISTEX/id']}> <${properties[path]}> "${values[i]}" .\n`);
        }
      }
    } else {
      // Path points to a single value
      const value = data[path];
      feed.write(`<http://lod.istex.fr/${data['ISTEX/id']}> <${properties[path]}> "${value}" .\n`);
    }
  });

  feed.end();
};

// <http://lod.istex.fr/2FF3F5B1477986B9C617BB75CA3333DBEE99EB05>
//               a bibo:Document ;
//               dcterms:language <http://lexvo.org/id/iso639-3/fra> ;
//               bibo:doi  "10.1002/zaac.19936190205" ;
//               istex:idIstex "2FF3F5B1477986B9C617BB75CA3333DBEE99EB05" .

// module.exports = function triplify(data, feed) {
//   const languagePath = this.getParam('language', 'ISTEX/language/0');
//   const property = this.getParam('property', 'http://a.link/of/some#sort');
//   const doiPath = this.getParam('doi', 'ISTEX/doi/0');

//   const language = data && data[languagePath];
//   const doi = data && data[doiPath];

//   if (doi && language) {
//     feed.write(`<http://lexvo.org/id/iso639-3/${language}> <${property}> "${doi}" .\n`);
//     // FIXME: unknown a pour code lexvo und
//     // FIXME: URI ISTEX : http://lod.istex.fr/IDISTEX
//     //
//   // } else if (!doi && data) {
//   //   feed.write(`${data.id} has no doi\n`);
//   }
//   if (this.isLast()) {
//     feed.close();
//   }
//   feed.end();
// };

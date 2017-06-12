const path = require('path'),
  fs = require('fs'),
  request = require('request'),
  async = require('async');
/*
 * Ce plugin récupère les hits (résultats de la requête à l'API ISTEX), puis télécharge les fichiers selon les critères demandé.  
 */
module.exports = function(data, feed) {
  let self = this;
  if (self.isLast()) {
    feed.close();
  } else {
    let handle = self.getParam('path', data.ISTEX);
    if (!(handle && handle.hits)) return feed.send(data);
    async.eachSeries(handle.hits, function(hit, next) {
      let files = (self.getParam("key") === "fulltext" || self.getParam("key") === "metadata") ? hit[self.getParam("key")] : hit.enrichments[self.getParam("key")];
      if (!files) return next();
      let file = selectFile(files, self.getParam("criteria"));
      if (!(file && file.uri)) return next();
      request(file.uri, function(error, response, body) {
        if (error) next(error);
        if (response.statusCode.toString()[0] !== '2') return next(response); // Si erreur http (code différent de 2XX, on la remonte
        var filePath = path.join(self.getParam("out"), hit.id + '.' + self.getParam("criteria").extension); // Calcul du chemin complet du fichier téléchargé
        fs.writeFile(filePath, body, function(err) {
          if (err) return next(err);
          hit.filename = filePath;
          next();
        });
      });
    }, function(err) {
      if (err) {
        throw err;
      }
      feed.send(data);
    });
  }
};

/**
 * Retourne le premier objet du Tableau de fichier respectant tous les critères spécifiées
 * Exemple : Je souhaite récupérer le fichier txt généré par LoadIstex
 *   files = docObject.fulltext (paramètre du docObject contenant les infos liées au fulltext)
 *   criteria = { mime: 'text/plain', original: false }, --> ficher txt généré par LoadIstex
 * @param {array} files Tableau d'objet représentant un ensemble de fichier (ex : jsonLine.metadata || jsonLine.fulltext)
 * @param {object} criteria Objet regroupant les critères du document recherché
 * @return {object} L'objet correspondant ou null
 */
function selectFile(files, criteria) {
  var keys = Object.keys(criteria);
  for (var i = 0; i < files.length; i++) {
    var found = true;
    for (var j = 0; j < keys.length; j++) {
      found &= (criteria[keys[j]] instanceof RegExp) ? criteria[keys[j]].test(files[i][keys[j]]) : (files[i][keys[j]] === criteria[keys[j]]);
      if (!found) break;
    }
    if (found) return files[i];
  }
  return null;
};
# Basics statements for ezs

This package cannot be used alone. EZS has to be installed.

## Usage

```js
var ezs = require('ezs');
ezs.use(require('ezs-istex'));
```

## Statements

### ISTEXDownload

*Come after : ISTEXRequest*

This plugin will download the selected file contained in the result of ISTEX API.

```js
.pipe(ezs('ISTEXDownload', {
  criteria: {                       // Criteria
    "extension": "txt",
    "original": false,
    "mimetype": "text/plain"
  },
  out: "/my/path/",                 // Output path
  key: "fulltext"                   // Which key contain the data :
}))                                 // - fulltext (.pdf, .txt, .tei, ...) => key: "fulltext"
                                    // - metadata (.mods, .xml, ...)      => key: "metadata"
                                    // - enrichments (.tei, ...)          => key: "unitex" / "teeft" / "multicat" / "refBibs" / "nb" / "abesAuthors" / "abesSubjects"
```

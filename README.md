# ISTEX statements for ezs

This package cannot be used alone. EZS has to be installed.

## Usage

```js
var ezs = require('ezs');
ezs.use(require('ezs-istex'));
```

## Statements

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [ISTEXFetch](#istexfetch)
    -   [Parameters](#parameters)
-   [ISTEXParseDotCorpus](#istexparsedotcorpus)
    -   [Parameters](#parameters-1)
-   [ISTEXResult](#istexresult)
    -   [Parameters](#parameters-2)
-   [ISTEXSave](#istexsave)
    -   [Parameters](#parameters-3)
-   [ISTEXTriplify](#istextriplify)
    -   [Parameters](#parameters-4)
    -   [Examples](#examples)
-   [ISTEX](#istex)
    -   [Parameters](#parameters-5)
-   [ISTEXRemoveIf](#istexremoveif)
    -   [Parameters](#parameters-6)
    -   [Examples](#examples-1)
-   [ISTEXRemoveVerb](#istexremoveverb)
    -   [Parameters](#parameters-7)
    -   [Examples](#examples-2)
-   [Scroll](#scroll)
    -   [Parameters](#parameters-8)
-   [ISTEXUniq](#istexuniq)
    -   [Examples](#examples-3)

### ISTEXFetch

Take `Object` with `id` and returns the document's metadata

#### Parameters

-   `data`  
-   `feed`  
-   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Field to use to fetch documents (optional, default `"id"`)
-   `target` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `id` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** ISTEX Identifier of a document (optional, default `data.id`)
-   `sid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** User-agent identifier (optional, default `"ezs-istex"`)

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 

### ISTEXParseDotCorpus

Parse a `.corpus` file content, and returns an object containing queries and
ids.

#### Parameters

-   `data`  
-   `feed`  

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### ISTEXResult

-   **See: ISTEXScroll**

Take `Object` containing results of ISTEX API, and returns `hits` value (documents).
This should be placed after ISTEXScroll.

#### Parameters

-   `data`  
-   `feed`  
-   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**  (optional, default `data`)
-   `target` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**  (optional, default `feed`)

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 

### ISTEXSave

-   **See: ISTEXFetch**

Take and Object with ISTEX `id` and save the document's file.
Warning: to access fulltext, you have to give a `token` parameter.
ISTEXFetch produces the stream you need to save the file.

#### Parameters

-   `data`  
-   `feed`  
-   `directory` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** path for the PDFs (optional, default `currentworkingdirectory`)
-   `typology` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** typology of the document to save (optional, default `"fulltext"`)
-   `format` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** format of the files to save (optional, default `"pdf"`)
-   `sid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** User-agent identifier (optional, default `"ezs-istex"`)
-   `token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** authentication token (see [documentation](https://doc.istex.fr/api/access/fede.html#acc%C3%A8s-programmatique-via-un-token-didentification))

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** 

### ISTEXTriplify

-   **See: ISTEXResult**
-   **See: OBJFlatten (from ezs-basics)**

Take `Object` containing flatten hits from ISTEXResult.

If the environment variable DEBUG is set, some errors could appear on stderr.

#### Parameters

-   `data`  
-   `feed`  
-   `property` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** path to uri for the properties to output (property and uri separated by `->`) (optional, default `[]`)
-   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the root of the keys (ex: `istex/`) (optional, default `""`)

#### Examples

```javascript
data: {
'author/0/name': 'Geoffrey Strickland',
'author/0/affiliations/0': 'University of Reading',
'host/issn/0': '0047-2441',
'host/eissn/0': '1740-2379',
'title': 'Maupassant, Zola, Jules Vallès and the Paris Commune of 1871',
'publicationDate': '1983',
'doi/0': '10.1177/004724418301305203',
'id': 'F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483',
'score': 1 }
```

```javascript
.pipe(ezs('ISTEXTriplify', {
   property: [
     'doi/0 -> http://purl.org/ontology/bibo/doi',
     'language -> http://purl.org/dc/terms/language',
     'author/\\d+/name -> http://purl.org/dc/terms/creator',
     'author/\\d+/affiliations -> https://data.istex.fr/ontology/istex#affiliation',
   ],
 ));
```

```javascript
<https://data.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483>
    a <http://purl.org/ontology/bibo/Document> ;
      "10.1002/zaac.19936190205" ;
    <https://data.istex.fr/ontology/istex#idIstex> "F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483" ;
    <http://purl.org/dc/terms/creator> "Geoffrey Strickland" ;
    <https://data.istex.fr/ontology/istex#affiliation> "University of Reading" ;
```

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### ISTEX

Take an array and returns matching documents for every value of the array

#### Parameters

-   `data`  
-   `feed`  
-   `query` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>)** ISTEX query (or queries) (optional, default `data.query||[]`)
-   `id` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>)** ISTEX id (or ids) (optional, default `data.id||[]`)
-   `maxPage` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** maximum number of pages to get
-   `size` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** size of each page of results
-   `duration` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** maximum duration between two requests (ex: "30s")
-   `field` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** fields to output

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 

### ISTEXRemoveIf

Remove triples which properties are given (`remove`) if other given `property`
has the given `value`.

#### Parameters

-   `if` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** "property = value"

#### Examples

```javascript
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/ontology/istex#idIstex> "2FF3F5B1477986B9C617BB75CA3333DBEE99EB05" .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> a <http://purl.org/ontology/bibo/Document> .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <host/genre> "journal" .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/fake#journalTitle> "Linguistic Typology" .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/fake#bookTitle> "Linguistic Typology" .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/fake#seriesTitle> "Linguistic Typology" .
```

```javascript
[ISTEXRemoveIf]
if = <host/genre> = "journal"
remove = <https://data.istex.fr/fake#bookTitle>
remove = <https://data.istex.fr/fake#seriesTitle>
remove = <host/genre>
```

```javascript
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/ontology/istex#idIstex> "2FF3F5B1477986B9C617BB75CA3333DBEE99EB05" .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> a <http://purl.org/ontology/bibo/Document> .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/fake#journalTitle> "Linguistic Typology" .
```

### ISTEXRemoveVerb

Unconditionnaly remove triples which `verb` is given.

#### Parameters

-   `verb` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** `"<https://data.istex.fr/ontology/istex#idIstex>"`

#### Examples

```javascript
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/ontology/istex#idIstex> "2FF3F5B1477986B9C617BB75CA3333DBEE99EB05" .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> a <http://purl.org/ontology/bibo/Document> .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <host/genre> "journal" .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/fake#journalTitle> "Linguistic Typology" .
```

```javascript
[ISTEXRemoveIf]
verb = <host/genre>
```

```javascript
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/ontology/istex#idIstex> "2FF3F5B1477986B9C617BB75CA3333DBEE99EB05" .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> a <http://purl.org/ontology/bibo/Document> .
<https://api.istex.fr/ark:/67375/QT4-D0J6VN6K-K> <https://data.istex.fr/fake#journalTitle> "Linguistic Typology" .
```

### Scroll

Take an `Object` containing a query and outputs records from the ISTEX API.

#### Parameters

-   `data`  
-   `feed`  
-   `query` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** ISTEX query (optional, default `"*"`)
-   `sid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** User-agent identifier (optional, default `"ezs-istex"`)
-   `maxPage` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Maximum number of pages to get
-   `size` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** size of each page of results (optional, default `2000`)
-   `duration` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** maximum duration between two requests (optional, default `"30s"`)
-   `field` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** fields to get (optional, default `["doi"]`)

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 

### ISTEXUniq

Remove duplicates triples within a single document's set of triples (same
subject).

Assume that every triple of a document (except the first one) follows another
triple of the same document.

#### Examples

```javascript
<https://api.istex.fr/ark:/67375/NVC-JMPZTKTT-R> <http://purl.org/dc/terms/creator> "S Corbett" .
<https://api.istex.fr/ark:/67375/NVC-JMPZTKTT-R> <https://data.istex.fr/ontology/istex#affiliation> "Department of Public Health, University of Sydney, Australia." .
<https://api.istex.fr/ark:/67375/NVC-JMPZTKTT-R> <https://data.istex.fr/ontology/istex#affiliation> "Department of Public Health, University of Sydney, Australia." .
<https://api.istex.fr/ark:/67375/NVC-JMPZTKTT-R> <https://data.istex.fr/ontology/istex#affiliation> "Department of Public Health, University of Sydney, Australia." .
```

```javascript
[ISTEXUniq]
```

```javascript
<https://api.istex.fr/ark:/67375/NVC-JMPZTKTT-R> <http://purl.org/dc/terms/creator> "S Corbett" .
<https://api.istex.fr/ark:/67375/NVC-JMPZTKTT-R> <https://data.istex.fr/ontology/istex#affiliation> "Department of Public Health, University of Sydney, Australia." .
```

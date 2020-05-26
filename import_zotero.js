// The initial implementation of this script is derived from the versions in
// https://forums.zotero.org/discussion/78638/unable-to-bulk-import-a-list-of-urls

var url_file = query.url_file;
var path = OS.Path.dirname(url_file);

function write_array_to_file(filename, arr) {
  Zotero.File.putContents(Zotero.File.pathToFile(OS.Path.join(path, filename)), arr.join('\n'));
}

async function import_zotero(urls) {
  var urls_fail = [];
  var urls_ok = [];
  for (var cururl of urls) {
    try {
      await Zotero.HTTP.processDocuments(
        cururl,
        async function(doc) {
          if (!doc) {
            throw "doc is null";
          }
          var translate = new Zotero.Translate.Web();
          translate.setDocument(doc);

          var translators = await translate.getTranslators();
          if (translators.length == 0) {
            Zotero.debug("No translator found for "+cururl+" so just save the webpage itself")
            await ZoteroPane.addItemFromDocument(doc);
            return;
          }

          translate.setTranslator(translators[0]);
          await translate.translate();
          urls_ok.push(cururl);
        }
      );
    } catch (e) {
      Zotero.debug(cururl+" failed: "+e.name+e.message);
      urls_fail.push(cururl);
    }
  }
  Zotero.debug("All documents processed.");

  write_array_to_file("urls_failed.txt", urls_fail);
  write_array_to_file("urls_ok.txt", urls_ok);

  Zotero.debug("Logs written.");
}

try {
  await import_zotero(Zotero.File.getContents(url_file).split('\n').map(url => url));
} catch(e) {
  Zotero.debug("Error: "+e.name+e.message);
}
return "Import zotero.js done";

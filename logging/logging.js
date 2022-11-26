
exports.logError = logError;

function logError(apiReference, log) {
    if (apiReference
      && apiReference.apiReferenceModule
      && apiReference.api) {
  
      try {
        log = JSON.stringify(log);
      }
      catch (exception) {
      }
      console.error("-->" + apiReference.apiReferenceModule + " :=: " + apiReference.api + " :=: " + log);
    }
}

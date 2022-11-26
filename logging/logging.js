
exports.logError = logError;

function logError(apiReference, log) {
    if (apiReference
      && apiReference.module
      && apiReference.api) {
  
      try {
        log = JSON.stringify(log);
      }
      catch (exception) {
      }
      console.error("-->" + apiReference.module + " :=: " + apiReference.api + " :=: " + log);
    }
}

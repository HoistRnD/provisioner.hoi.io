var Sanitizer = function () { 
}

Sanitizer.prototype.sanitize = function (string) {
  var lowerCaseString = string.toLowerCase();
  return lowerCaseString.replace(/\W+/i, "");
}

module.exports = Sanitizer;
var assert = require('assert');
var CSP = require('../lib');

suite('Content Security Policy(CSP) middleware', function() {
  function getRes(result) {
    return {
      setHeader : function(name, value) {
        console.log("set %s: %s", name, value);
        result.name = name;
        result.value = value;
      },
      removeHeader : function(name) {
        console.log("remove: %s", name);
      }
    };
  };

  var next = function() {
  };

  test('Starter options', function() {
    var cspFunction = CSP.getCSP(CSP.STARTER_OPTIONS);
    var result = {};
    cspFunction(null, getRes(result), next);

    assert(result.name === "Content-Security-Policy");
    assert(result.value.indexOf("default-src 'none'") > -1, "default-src");
    assert(result.value.indexOf("script-src 'self'") > -1, "script-src");
    assert(result.value.indexOf("connect-src 'self'") > -1, "connect-src");
    assert(result.value.indexOf("img-src 'self'") > -1, "img-src");
    assert(result.value.indexOf("style-src 'self'") > -1, "style-src");
    assert(result.value.indexOf("child-src 'self'") > -1, "child-src");
    assert(result.value.indexOf("form-action 'self'") > -1, "form-action");
    assert(result.value.indexOf("frame-ancestors 'self'") > -1, "frame-ancestors");
    assert(result.value.indexOf("plugin-types 'none'") > -1, "plugin-types");
  });

  test('Report only', function() {
    var policy = {
      "default-src" : CSP.SRC_NONE,
      "report-only" : true
    };
    var cspFunction = CSP.getCSP(policy);
    var result = {};
    cspFunction(null, getRes(result), next);

    assert(result.name === "Content-Security-Policy-Report-Only");

    assert(result.value.indexOf("default-src 'none'") > -1, "default-src");
  });

  test('All policies', function() {
    var policy = {
      "report-uri" : "/reporting",
      "sandbox" : [ CSP.SANDBOX_ALLOW_FORMS ],
      "default-src" : CSP.SRC_NONE,
      "script-src" : [ CSP.SRC_SELF, CSP.SRC_USAFE_INLINE ],
      "object-src" : "https://google.com",
      "style-src" : "http://tmp.com",
      "img-src" : "https://flikr.com",
      "media-src" : "123",
      "frame-src" : "456",
      "font-src" : "789",
      "connect-src" : "abc",
      "child-src" : "def",
      "form-action" : "ghi",
      "frame-ancestors" : [CSP.SRC_SELF, CSP.SRC_DATA],
      "plugin-types" : CSP.SRC_NONE
    };

    var result = {};
    var cspFunction = CSP.getCSP(policy);
    cspFunction(null, getRes(result), next);

    assert(result.name === "Content-Security-Policy");

    assert(result.value.indexOf("report-uri /reporting") > -1, "report-uri");
    assert(result.value.indexOf("sandbox allow-forms") > -1, "style-src");
    assert(result.value.indexOf("default-src 'none'") > -1, "default-src");
    assert(result.value.indexOf("script-src 'self' 'unsafe-inline'") > -1, "script-src");
    assert(result.value.indexOf("object-src https://google.com") > -1, "object-src");
    assert(result.value.indexOf("style-src http://tmp.com") > -1, "style-src");
    assert(result.value.indexOf("img-src https://flikr.com") > -1, "img-src");
    assert(result.value.indexOf("media-src 123") > -1, "media-src");
    assert(result.value.indexOf("frame-src 456") > -1, "frame-src");
    assert(result.value.indexOf("font-src 789") > -1, "font-src");
    assert(result.value.indexOf("connect-src abc") > -1, "connect-src");
    assert(result.value.indexOf("child-src def") > -1, "child-src");
    assert(result.value.indexOf("form-action ghi") > -1, "form-action");
    assert(result.value.indexOf("frame-ancestors 'self' data:") > -1, "frame-ancestors");
    assert(result.value.indexOf("plugin-types 'none'") > -1, "plugin-types");
  });
});

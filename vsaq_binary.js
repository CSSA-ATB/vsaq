var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.global.CLOSURE_UNCOMPILED_DEFINES;
goog.global.CLOSURE_DEFINES;
goog.isDef = function(val) {
  return val !== void 0;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0]);
  }
  for (var part;parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object;
    } else {
      if (cur[part]) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
      }
    }
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else {
      if (goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) {
        value = goog.global.CLOSURE_DEFINES[name];
      }
    }
  }
  goog.exportPath_(name, value);
};
goog.define("goog.DEBUG", true);
goog.define("goog.LOCALE", "en");
goog.define("goog.TRUSTED_SITE", true);
goog.define("goog.STRICT_MODE_COMPATIBLE", false);
goog.define("goog.DISALLOW_TEST_ONLY_CODE", COMPILED && !goog.DEBUG);
goog.define("goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING", false);
goog.provide = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while (namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }
  goog.exportPath_(name, opt_obj);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
  if (!goog.isString(name) || !name || name.search(goog.VALID_MODULE_RE_) == -1) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return name in goog.loadedModules_ ? goog.loadedModules_[name] : goog.getObjectByName(name);
    } else {
      return null;
    }
  }
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareLegacyNamespace must be called from " + "within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to " + "goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function(name) {
};
goog.forwardDeclare("Document");
goog.forwardDeclare("HTMLScriptElement");
goog.forwardDeclare("XMLHttpRequest");
if (!COMPILED) {
  goog.isProvided_ = function(name) {
    return name in goog.loadedModules_ || !goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name));
  };
  goog.implicitNamespaces_ = {"goog.module":true};
}
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for (var part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires, opt_isModule) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for (var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      deps.pathIsModule[path] = !!opt_isModule;
    }
    for (var j = 0;require = requires[j];j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};
goog.define("goog.ENABLE_DEBUG_LOADER", true);
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console["error"](msg);
  }
};
goog.require = function(name) {
  if (!COMPILED) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }
    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      } else {
        return null;
      }
    }
    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.writeScripts_(path);
        return null;
      }
    }
    var errorMessage = "goog.require could not find: " + name;
    goog.logToConsole_(errorMessage);
    throw Error(errorMessage);
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.define("goog.LOAD_MODULE_USING_EVAL", true);
goog.define("goog.SEAL_MODULE_EXPORTS", goog.DEBUG);
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
if (goog.DEPENDENCIES_ENABLED) {
  goog.dependencies_ = {pathIsModule:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return doc != null && "write" in doc;
  };
  goog.findBasePath_ = function() {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else {
      if (!goog.inHtmlDocument_()) {
        return;
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("SCRIPT");
    for (var i = scripts.length - 1;i >= 0;--i) {
      var script = (scripts[i]);
      var src = script.src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.IS_OLD_IE_ = !!(!goog.global.atob && goog.global.document && goog.global.document.all);
  goog.importModule_ = function(src) {
    var bootstrap = 'goog.retrieveAndExecModule_("' + src + '");';
    if (goog.importScript_("", bootstrap)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.queuedModules_ = [];
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return "" + "goog.loadModule(function(exports) {" + '"use strict";' + scriptText + "\n" + ";return exports" + "});" + "\n//# sourceURL=" + srcUrl + "\n";
    } else {
      return "" + "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");";
    }
  };
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0;i < count;i++) {
        var path = queue[i];
        goog.maybeProcessDeferredPath_(path);
      }
    }
  };
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
      var path = goog.getPathFromDeps_(name);
      goog.maybeProcessDeferredPath_(goog.basePath + path);
    }
  };
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && goog.dependencies_.pathIsModule[path]) {
      var abspath = goog.basePath + path;
      return abspath in goog.dependencies_.deferred;
    }
    return false;
  };
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && path in goog.dependencies_.requires) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };
  goog.loadModuleFromUrl = function(url) {
    goog.retrieveAndExecModule_(url);
  };
  goog.loadModule = function(moduleDef) {
    var previousState = goog.moduleLoaderState_;
    try {
      goog.moduleLoaderState_ = {moduleName:undefined, declareLegacyNamespace:false};
      var exports;
      if (goog.isFunction(moduleDef)) {
        exports = moduleDef.call(goog.global, {});
      } else {
        if (goog.isString(moduleDef)) {
          exports = goog.loadModuleFromSource_.call(goog.global, moduleDef);
        } else {
          throw Error("Invalid module definition");
        }
      }
      var moduleName = goog.moduleLoaderState_.moduleName;
      if (!goog.isString(moduleName) || !moduleName) {
        throw Error('Invalid module name "' + moduleName + '"');
      }
      if (goog.moduleLoaderState_.declareLegacyNamespace) {
        goog.constructNamespace_(moduleName, exports);
      } else {
        if (goog.SEAL_MODULE_EXPORTS && Object.seal) {
          Object.seal(exports);
        }
      }
      goog.loadedModules_[moduleName] = exports;
    } finally {
      goog.moduleLoaderState_ = previousState;
    }
  };
  goog.loadModuleFromSource_ = function() {
    var exports = {};
    eval(arguments[0]);
    return exports;
  };
  goog.writeScriptSrcNode_ = function(src) {
    goog.global.document.write('<script type="text/javascript" src="' + src + '"></' + "script>");
  };
  goog.appendScriptSrcNode_ = function(src) {
    var doc = goog.global.document;
    var scriptEl = (doc.createElement("script"));
    scriptEl.type = "text/javascript";
    scriptEl.src = src;
    scriptEl.defer = false;
    scriptEl.async = false;
    doc.head.appendChild(scriptEl);
  };
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && doc.readyState == "complete") {
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }
      var isOldIE = goog.IS_OLD_IE_;
      if (opt_sourceText === undefined) {
        if (!isOldIE) {
          if (goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING) {
            goog.appendScriptSrcNode_(src);
          } else {
            goog.writeScriptSrcNode_(src);
          }
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write('<script type="text/javascript" src="' + src + '"' + state + "></" + "script>");
        }
      } else {
        doc.write('<script type="text/javascript">' + opt_sourceText + "</" + "script>");
      }
      return true;
    } else {
      return false;
    }
  };
  goog.lastNonModuleScriptIndex_ = 0;
  goog.onScriptLoad_ = function(script, scriptIndex) {
    if (script.readyState == "complete" && goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };
  goog.writeScripts_ = function(pathToLoad) {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }
      if (path in deps.visited) {
        return;
      }
      deps.visited[path] = true;
      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }
    visitNode(pathToLoad);
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      if (path) {
        if (!deps.pathIsModule[path]) {
          goog.importScript_(goog.basePath + path);
        } else {
          goog.importModule_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error("Undefined script input");
      }
    }
    goog.moduleLoaderState_ = moduleState;
  };
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };
  goog.findBasePath_();
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js");
  }
}
goog.normalizePath_ = function(path) {
  var components = path.split("/");
  var i = 0;
  while (i < components.length) {
    if (components[i] == ".") {
      components.splice(i, 1);
    } else {
      if (i && components[i] == ".." && components[i - 1] && components[i - 1] != "..") {
        components.splice(--i, 2);
      } else {
        i++;
      }
    }
  }
  return components.join("/");
};
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  } else {
    var xhr = new goog.global["XMLHttpRequest"];
    xhr.open("get", src, false);
    xhr.send();
    return xhr.responseText;
  }
};
goog.retrieveAndExecModule_ = function(src) {
  if (!COMPILED) {
    var originalPath = src;
    src = goog.normalizePath_(src);
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    var scriptText = goog.loadFileSync_(src);
    if (scriptText != null) {
      var execModuleScript = goog.wrapModule_(src, scriptText);
      var isOldIE = goog.IS_OLD_IE_;
      if (isOldIE) {
        goog.dependencies_.deferred[originalPath] = execModuleScript;
        goog.queuedModules_.push(originalPath);
      } else {
        importScript(src, execModuleScript);
      }
    } else {
      throw new Error("load of " + src + "failed");
    }
  }
};
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == "object") {
    if (value) {
      if (value instanceof Array) {
        return "array";
      } else {
        if (value instanceof Object) {
          return s;
        }
      }
      var className = Object.prototype.toString.call((value));
      if (className == "[object Window]") {
        return "object";
      }
      if (className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if (className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if (s == "function" && typeof value.call == "undefined") {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return val === null;
};
goog.isDefAndNotNull = function(val) {
  return val != null;
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array";
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number";
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function";
};
goog.isString = function(val) {
  return typeof val == "string";
};
goog.isBoolean = function(val) {
  return typeof val == "boolean";
};
goog.isNumber = function(val) {
  return typeof val == "number";
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function";
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function";
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  if (obj !== null && "removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1E9 >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return (fn.call.apply(fn.bind, arguments));
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error;
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _evalTest_ = 1;");
        if (typeof goog.global["_evalTest_"] != "undefined") {
          try {
            delete goog.global["_evalTest_"];
          } catch (ignore) {
          }
          goog.evalWorksForGlobals_ = true;
        } else {
          goog.evalWorksForGlobals_ = false;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document;
        var scriptElt = (doc.createElement("SCRIPT"));
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for (var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  };
  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }
  if (opt_modifier) {
    return className + "-" + rename(opt_modifier);
  } else {
    return rename(className);
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return opt_values != null && key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = new Array(arguments.length - 2);
    for (var i = 2;i < arguments.length;i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used " + "with strict mode code. See " + "http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    var ctorArgs = new Array(arguments.length - 1);
    for (var i = 1;i < arguments.length;i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }
  var args = new Array(arguments.length - 2);
  for (var i = 2;i < arguments.length;i++) {
    args[i - 2] = arguments[i];
  }
  var foundCaller = false;
  for (var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global);
};
if (!COMPILED) {
  goog.global["COMPILED"] = COMPILED;
}
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor;
  var statics = def.statics;
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error("cannot instantiate an interface (no constructor defined).");
    };
  }
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }
  return cls;
};
goog.defineClass.ClassDescriptor;
goog.define("goog.defineClass.SEAL_CLASS_INSTANCES", goog.DEBUG);
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (superClass && superClass.prototype && superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return ctr;
    }
    var wrappedCtr = function() {
      var instance = ctr.apply(this, arguments) || this;
      instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
      if (this.constructor === wrappedCtr) {
        Object.seal(instance);
      }
      return instance;
    };
    return wrappedCtr;
  }
  return ctr;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.defineClass.applyProperties_ = function(target, source) {
  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.provide("goog.positioning.AbstractPosition");
goog.positioning.AbstractPosition = function() {
};
goog.positioning.AbstractPosition.prototype.reposition = function(movableElement, corner, opt_margin, opt_preferredSize) {
};
goog.provide("goog.functions");
goog.functions.constant = function(retValue) {
  return function() {
    return retValue;
  };
};
goog.functions.FALSE = goog.functions.constant(false);
goog.functions.TRUE = goog.functions.constant(true);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.functions.error = function(message) {
  return function() {
    throw Error(message);
  };
};
goog.functions.fail = function(err) {
  return function() {
    throw err;
  };
};
goog.functions.lock = function(f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0;
  return function() {
    return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs));
  };
};
goog.functions.nth = function(n) {
  return function() {
    return arguments[n];
  };
};
goog.functions.withReturnValue = function(f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue));
};
goog.functions.equalTo = function(value, opt_useLooseComparison) {
  return function(other) {
    return opt_useLooseComparison ? value == other : value === other;
  };
};
goog.functions.compose = function(fn, var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    if (length) {
      result = functions[length - 1].apply(this, arguments);
    }
    for (var i = length - 2;i >= 0;i--) {
      result = functions[i].call(this, result);
    }
    return result;
  };
};
goog.functions.sequence = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    for (var i = 0;i < length;i++) {
      result = functions[i].apply(this, arguments);
    }
    return result;
  };
};
goog.functions.and = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (!functions[i].apply(this, arguments)) {
        return false;
      }
    }
    return true;
  };
};
goog.functions.or = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (functions[i].apply(this, arguments)) {
        return true;
      }
    }
    return false;
  };
};
goog.functions.not = function(f) {
  return function() {
    return !f.apply(this, arguments);
  };
};
goog.functions.create = function(constructor, var_args) {
  var temp = function() {
  };
  temp.prototype = constructor.prototype;
  var obj = new temp;
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
  return obj;
};
goog.define("goog.functions.CACHE_RETURN_VALUE", true);
goog.functions.cacheReturnValue = function(fn) {
  var called = false;
  var value;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return fn();
    }
    if (!called) {
      value = fn();
      called = true;
    }
    return value;
  };
};
goog.functions.once = function(f) {
  var inner = f;
  return function() {
    if (inner) {
      var tmp = inner;
      inner = null;
      tmp();
    }
  };
};
goog.functions.debounce = function(f, interval, opt_scope) {
  if (opt_scope) {
    f = goog.bind(f, opt_scope);
  }
  var timeout = null;
  return (function(var_args) {
    goog.global.clearTimeout(timeout);
    var args = arguments;
    timeout = goog.global.setTimeout(function() {
      f.apply(null, args);
    }, interval);
  });
};
goog.functions.throttle = function(f, interval, opt_scope) {
  if (opt_scope) {
    f = goog.bind(f, opt_scope);
  }
  var timeout = null;
  var shouldFire = false;
  var args = [];
  var handleTimeout = function() {
    timeout = null;
    if (shouldFire) {
      shouldFire = false;
      fire();
    }
  };
  var fire = function() {
    timeout = goog.global.setTimeout(handleTimeout, interval);
    f.apply(null, args);
  };
  return (function(var_args) {
    args = arguments;
    if (!timeout) {
      fire();
    } else {
      shouldFire = true;
    }
  });
};
goog.provide("goog.storage.ErrorCode");
goog.storage.ErrorCode = {INVALID_VALUE:"Storage: Invalid value was encountered", DECRYPTION_ERROR:"Storage: The value could not be decrypted"};
goog.provide("goog.storage.mechanism.ErrorCode");
goog.storage.mechanism.ErrorCode = {INVALID_VALUE:"Storage mechanism: Invalid value was encountered", QUOTA_EXCEEDED:"Storage mechanism: Quota exceeded", STORAGE_DISABLED:"Storage mechanism: Storage disabled"};
goog.provide("goog.storage.mechanism.Mechanism");
goog.storage.mechanism.Mechanism = function() {
};
goog.storage.mechanism.Mechanism.prototype.set = goog.abstractMethod;
goog.storage.mechanism.Mechanism.prototype.get = goog.abstractMethod;
goog.storage.mechanism.Mechanism.prototype.remove = goog.abstractMethod;
goog.provide("goog.fx.Transition");
goog.provide("goog.fx.Transition.EventType");
goog.fx.Transition = function() {
};
goog.fx.Transition.EventType = {PLAY:"play", BEGIN:"begin", RESUME:"resume", END:"end", STOP:"stop", FINISH:"finish", PAUSE:"pause"};
goog.fx.Transition.prototype.play;
goog.fx.Transition.prototype.stop;
goog.provide("goog.math.Size");
goog.math.Size = function(width, height) {
  this.width = width;
  this.height = height;
};
goog.math.Size.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.width == b.width && a.height == b.height;
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height);
};
if (goog.DEBUG) {
  goog.math.Size.prototype.toString = function() {
    return "(" + this.width + " x " + this.height + ")";
  };
}
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height);
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height);
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height;
};
goog.math.Size.prototype.perimeter = function() {
  return (this.width + this.height) * 2;
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height;
};
goog.math.Size.prototype.isEmpty = function() {
  return !this.area();
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Size.prototype.fitsInside = function(target) {
  return this.width <= target.width && this.height <= target.height;
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Size.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.width *= sx;
  this.height *= sy;
  return this;
};
goog.math.Size.prototype.scaleToCover = function(target) {
  var s = this.aspectRatio() <= target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s);
};
goog.math.Size.prototype.scaleToFit = function(target) {
  var s = this.aspectRatio() > target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s);
};
goog.provide("goog.json");
goog.provide("goog.json.Replacer");
goog.provide("goog.json.Reviver");
goog.provide("goog.json.Serializer");
goog.define("goog.json.USE_NATIVE_JSON", false);
goog.json.isValid = function(s) {
  if (/^\s*$/.test(s)) {
    return false;
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g;
  var simpleValuesRe = /"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g;
  var remainderRe = /^[\],:{}\s\u2028\u2029]*$/;
  return remainderRe.test(s.replace(backslashesRe, "@").replace(simpleValuesRe, "]").replace(openBracketsRe, ""));
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["parse"]) : function(s) {
  var o = String(s);
  if (goog.json.isValid(o)) {
    try {
      return (eval("(" + o + ")"));
    } catch (ex) {
    }
  }
  throw Error("Invalid JSON string: " + o);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["parse"]) : function(s) {
  return (eval("(" + s + ")"));
};
goog.json.Replacer;
goog.json.Reviver;
goog.json.serialize = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["stringify"]) : function(object, opt_replacer) {
  return (new goog.json.Serializer(opt_replacer)).serialize(object);
};
goog.json.Serializer = function(opt_replacer) {
  this.replacer_ = opt_replacer;
};
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serializeInternal(object, sb);
  return sb.join("");
};
goog.json.Serializer.prototype.serializeInternal = function(object, sb) {
  if (object == null) {
    sb.push("null");
    return;
  }
  if (typeof object == "object") {
    if (goog.isArray(object)) {
      this.serializeArray(object, sb);
      return;
    } else {
      if (object instanceof String || object instanceof Number || object instanceof Boolean) {
        object = object.valueOf();
      } else {
        this.serializeObject_((object), sb);
        return;
      }
    }
  }
  switch(typeof object) {
    case "string":
      this.serializeString_(object, sb);
      break;
    case "number":
      this.serializeNumber_(object, sb);
      break;
    case "boolean":
      sb.push(String(object));
      break;
    case "function":
      sb.push("null");
      break;
    default:
      throw Error("Unknown type: " + typeof object);;
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    var rv = goog.json.Serializer.charToJsonCharCache_[c];
    if (!rv) {
      rv = "\\u" + (c.charCodeAt(0) | 65536).toString(16).substr(1);
      goog.json.Serializer.charToJsonCharCache_[c] = rv;
    }
    return rv;
  }), '"');
};
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? String(n) : "null");
};
goog.json.Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  var sep = "";
  for (var i = 0;i < l;i++) {
    sb.push(sep);
    var value = arr[i];
    this.serializeInternal(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb);
    sep = ",";
  }
  sb.push("]");
};
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "";
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      if (typeof value != "function") {
        sb.push(sep);
        this.serializeString_(key, sb);
        sb.push(":");
        this.serializeInternal(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb);
        sep = ",";
      }
    }
  }
  sb.push("}");
};
goog.provide("goog.storage.Storage");
goog.require("goog.json");
goog.require("goog.storage.ErrorCode");
goog.storage.Storage = function(mechanism) {
  this.mechanism = mechanism;
};
goog.storage.Storage.prototype.set = function(key, value) {
  if (!goog.isDef(value)) {
    this.mechanism.remove(key);
    return;
  }
  this.mechanism.set(key, goog.json.serialize(value));
};
goog.storage.Storage.prototype.get = function(key) {
  var json;
  try {
    json = this.mechanism.get(key);
  } catch (e) {
    return undefined;
  }
  if (goog.isNull(json)) {
    return undefined;
  }
  try {
    return goog.json.parse(json);
  } catch (e) {
    throw goog.storage.ErrorCode.INVALID_VALUE;
  }
};
goog.storage.Storage.prototype.remove = function(key) {
  this.mechanism.remove(key);
};
goog.provide("goog.i18n.bidi");
goog.provide("goog.i18n.bidi.Dir");
goog.provide("goog.i18n.bidi.DirectionalString");
goog.provide("goog.i18n.bidi.Format");
goog.define("goog.i18n.bidi.FORCE_RTL", false);
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || (goog.LOCALE.substring(0, 2).toLowerCase() == "ar" || goog.LOCALE.substring(0, 2).toLowerCase() == "fa" || goog.LOCALE.substring(0, 2).toLowerCase() == "he" || goog.LOCALE.substring(0, 2).toLowerCase() == "iw" || goog.LOCALE.substring(0, 2).toLowerCase() == "ps" || goog.LOCALE.substring(0, 2).toLowerCase() == "sd" || goog.LOCALE.substring(0, 2).toLowerCase() == "ug" || goog.LOCALE.substring(0, 2).toLowerCase() == "ur" || goog.LOCALE.substring(0, 
2).toLowerCase() == "yi") && (goog.LOCALE.length == 2 || goog.LOCALE.substring(2, 3) == "-" || goog.LOCALE.substring(2, 3) == "_") || goog.LOCALE.length >= 3 && goog.LOCALE.substring(0, 3).toLowerCase() == "ckb" && (goog.LOCALE.length == 3 || goog.LOCALE.substring(3, 4) == "-" || goog.LOCALE.substring(3, 4) == "_");
goog.i18n.bidi.Format = {LRE:"\u202a", RLE:"\u202b", PDF:"\u202c", LRM:"\u200e", RLM:"\u200f"};
goog.i18n.bidi.Dir = {LTR:1, RTL:-1, NEUTRAL:0};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(givenDir, opt_noNeutral) {
  if (typeof givenDir == "number") {
    return givenDir > 0 ? goog.i18n.bidi.Dir.LTR : givenDir < 0 ? goog.i18n.bidi.Dir.RTL : opt_noNeutral ? null : goog.i18n.bidi.Dir.NEUTRAL;
  } else {
    if (givenDir == null) {
      return null;
    } else {
      return givenDir ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
    }
  }
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff" + "\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u06ef\u06fa-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(str, opt_isStripNeeded) {
  return opt_isStripNeeded ? str.replace(goog.i18n.bidi.htmlSkipReg_, "") : str;
};
goog.i18n.bidi.rtlCharReg_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.ltrRe_ = new RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = new RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(str) {
  return goog.i18n.bidi.rtlRe_.test(str);
};
goog.i18n.bidi.isLtrChar = function(str) {
  return goog.i18n.bidi.ltrRe_.test(str);
};
goog.i18n.bidi.isNeutralChar = function(str) {
  return !goog.i18n.bidi.isLtrChar(str) && !goog.i18n.bidi.isRtlChar(str);
};
goog.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(str, opt_isHtml) {
  str = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml);
  return goog.i18n.bidi.isRequiredLtrRe_.test(str) || !goog.i18n.bidi.hasAnyLtr(str) && !goog.i18n.bidi.hasAnyRtl(str);
};
goog.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = new RegExp("^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|" + ".*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))" + "(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)", "i");
goog.i18n.bidi.isRtlLanguage = function(lang) {
  return goog.i18n.bidi.rtlLocalesRe_.test(lang);
};
goog.i18n.bidi.bracketGuardHtmlRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g;
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInHtml = function(s, opt_isRtlContext) {
  var useRtl = opt_isRtlContext === undefined ? goog.i18n.bidi.hasAnyRtl(s) : opt_isRtlContext;
  if (useRtl) {
    return s.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=rtl>$&</span>");
  }
  return s.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=ltr>$&</span>");
};
goog.i18n.bidi.guardBracketInText = function(s, opt_isRtlContext) {
  var useRtl = opt_isRtlContext === undefined ? goog.i18n.bidi.hasAnyRtl(s) : opt_isRtlContext;
  var mark = useRtl ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return s.replace(goog.i18n.bidi.bracketGuardTextRe_, mark + "$&" + mark);
};
goog.i18n.bidi.enforceRtlInHtml = function(html) {
  if (html.charAt(0) == "<") {
    return html.replace(/<\w+/, "$& dir=rtl");
  }
  return "\n<span dir=rtl>" + html + "</span>";
};
goog.i18n.bidi.enforceRtlInText = function(text) {
  return goog.i18n.bidi.Format.RLE + text + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.enforceLtrInHtml = function(html) {
  if (html.charAt(0) == "<") {
    return html.replace(/<\w+/, "$& dir=ltr");
  }
  return "\n<span dir=ltr>" + html + "</span>";
};
goog.i18n.bidi.enforceLtrInText = function(text) {
  return goog.i18n.bidi.Format.LRE + text + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(cssStr) {
  return cssStr.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT);
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(str) {
  return str.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3");
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /[\d\u06f0-\u06f9]/;
goog.i18n.bidi.rtlDetectionThreshold_ = .4;
goog.i18n.bidi.estimateDirection = function(str, opt_isHtml) {
  var rtlCount = 0;
  var totalCount = 0;
  var hasWeaklyLtr = false;
  var tokens = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml).split(goog.i18n.bidi.wordSeparatorRe_);
  for (var i = 0;i < tokens.length;i++) {
    var token = tokens[i];
    if (goog.i18n.bidi.startsWithRtl(token)) {
      rtlCount++;
      totalCount++;
    } else {
      if (goog.i18n.bidi.isRequiredLtrRe_.test(token)) {
        hasWeaklyLtr = true;
      } else {
        if (goog.i18n.bidi.hasAnyLtr(token)) {
          totalCount++;
        } else {
          if (goog.i18n.bidi.hasNumeralsRe_.test(token)) {
            hasWeaklyLtr = true;
          }
        }
      }
    }
  }
  return totalCount == 0 ? hasWeaklyLtr ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL : rtlCount / totalCount > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
};
goog.i18n.bidi.detectRtlDirectionality = function(str, opt_isHtml) {
  return goog.i18n.bidi.estimateDirection(str, opt_isHtml) == goog.i18n.bidi.Dir.RTL;
};
goog.i18n.bidi.setElementDirAndAlign = function(element, dir) {
  if (element) {
    dir = goog.i18n.bidi.toDir(dir);
    if (dir) {
      element.style.textAlign = dir == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
      element.dir = dir == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr";
    }
  }
};
goog.i18n.bidi.setElementDirByTextDirectionality = function(element, text) {
  switch(goog.i18n.bidi.estimateDirection(text)) {
    case goog.i18n.bidi.Dir.LTR:
      element.dir = "ltr";
      break;
    case goog.i18n.bidi.Dir.RTL:
      element.dir = "rtl";
      break;
    default:
      element.removeAttribute("dir");
  }
};
goog.i18n.bidi.DirectionalString = function() {
};
goog.i18n.bidi.DirectionalString.prototype.implementsGoogI18nBidiDirectionalString;
goog.i18n.bidi.DirectionalString.prototype.getDirection;
goog.provide("goog.a11y.aria.Role");
goog.a11y.aria.Role = {ALERT:"alert", ALERTDIALOG:"alertdialog", APPLICATION:"application", ARTICLE:"article", BANNER:"banner", BUTTON:"button", CHECKBOX:"checkbox", COLUMNHEADER:"columnheader", COMBOBOX:"combobox", COMPLEMENTARY:"complementary", CONTENTINFO:"contentinfo", DEFINITION:"definition", DIALOG:"dialog", DIRECTORY:"directory", DOCUMENT:"document", FORM:"form", GRID:"grid", GRIDCELL:"gridcell", GROUP:"group", HEADING:"heading", IMG:"img", LINK:"link", LIST:"list", LISTBOX:"listbox", LISTITEM:"listitem", 
LOG:"log", MAIN:"main", MARQUEE:"marquee", MATH:"math", MENU:"menu", MENUBAR:"menubar", MENU_ITEM:"menuitem", MENU_ITEM_CHECKBOX:"menuitemcheckbox", MENU_ITEM_RADIO:"menuitemradio", NAVIGATION:"navigation", NOTE:"note", OPTION:"option", PRESENTATION:"presentation", PROGRESSBAR:"progressbar", RADIO:"radio", RADIOGROUP:"radiogroup", REGION:"region", ROW:"row", ROWGROUP:"rowgroup", ROWHEADER:"rowheader", SCROLLBAR:"scrollbar", SEARCH:"search", SEPARATOR:"separator", SLIDER:"slider", SPINBUTTON:"spinbutton", 
STATUS:"status", TAB:"tab", TAB_LIST:"tablist", TAB_PANEL:"tabpanel", TEXTBOX:"textbox", TEXTINFO:"textinfo", TIMER:"timer", TOOLBAR:"toolbar", TOOLTIP:"tooltip", TREE:"tree", TREEGRID:"treegrid", TREEITEM:"treeitem"};
goog.provide("goog.a11y.aria.AutoCompleteValues");
goog.provide("goog.a11y.aria.CheckedValues");
goog.provide("goog.a11y.aria.DropEffectValues");
goog.provide("goog.a11y.aria.ExpandedValues");
goog.provide("goog.a11y.aria.GrabbedValues");
goog.provide("goog.a11y.aria.InvalidValues");
goog.provide("goog.a11y.aria.LivePriority");
goog.provide("goog.a11y.aria.OrientationValues");
goog.provide("goog.a11y.aria.PressedValues");
goog.provide("goog.a11y.aria.RelevantValues");
goog.provide("goog.a11y.aria.SelectedValues");
goog.provide("goog.a11y.aria.SortValues");
goog.provide("goog.a11y.aria.State");
goog.a11y.aria.State = {ACTIVEDESCENDANT:"activedescendant", ATOMIC:"atomic", AUTOCOMPLETE:"autocomplete", BUSY:"busy", CHECKED:"checked", CONTROLS:"controls", DESCRIBEDBY:"describedby", DISABLED:"disabled", DROPEFFECT:"dropeffect", EXPANDED:"expanded", FLOWTO:"flowto", GRABBED:"grabbed", HASPOPUP:"haspopup", HIDDEN:"hidden", INVALID:"invalid", LABEL:"label", LABELLEDBY:"labelledby", LEVEL:"level", LIVE:"live", MULTILINE:"multiline", MULTISELECTABLE:"multiselectable", ORIENTATION:"orientation", OWNS:"owns", 
POSINSET:"posinset", PRESSED:"pressed", READONLY:"readonly", RELEVANT:"relevant", REQUIRED:"required", SELECTED:"selected", SETSIZE:"setsize", SORT:"sort", VALUEMAX:"valuemax", VALUEMIN:"valuemin", VALUENOW:"valuenow", VALUETEXT:"valuetext"};
goog.a11y.aria.AutoCompleteValues = {INLINE:"inline", LIST:"list", BOTH:"both", NONE:"none"};
goog.a11y.aria.DropEffectValues = {COPY:"copy", MOVE:"move", LINK:"link", EXECUTE:"execute", POPUP:"popup", NONE:"none"};
goog.a11y.aria.LivePriority = {OFF:"off", POLITE:"polite", ASSERTIVE:"assertive"};
goog.a11y.aria.OrientationValues = {VERTICAL:"vertical", HORIZONTAL:"horizontal"};
goog.a11y.aria.RelevantValues = {ADDITIONS:"additions", REMOVALS:"removals", TEXT:"text", ALL:"all"};
goog.a11y.aria.SortValues = {ASCENDING:"ascending", DESCENDING:"descending", NONE:"none", OTHER:"other"};
goog.a11y.aria.CheckedValues = {TRUE:"true", FALSE:"false", MIXED:"mixed", UNDEFINED:"undefined"};
goog.a11y.aria.ExpandedValues = {TRUE:"true", FALSE:"false", UNDEFINED:"undefined"};
goog.a11y.aria.GrabbedValues = {TRUE:"true", FALSE:"false", UNDEFINED:"undefined"};
goog.a11y.aria.InvalidValues = {FALSE:"false", TRUE:"true", GRAMMAR:"grammar", SPELLING:"spelling"};
goog.a11y.aria.PressedValues = {TRUE:"true", FALSE:"false", MIXED:"mixed", UNDEFINED:"undefined"};
goog.a11y.aria.SelectedValues = {TRUE:"true", FALSE:"false", UNDEFINED:"undefined"};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call((opt_obj), obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    if (f.call((opt_obj), obj[key], key, obj)) {
      res[key] = obj[key];
    }
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    res[key] = f.call((opt_obj), obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call((opt_obj), obj[key], key, obj)) {
      return true;
    }
  }
  return false;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call((opt_obj), obj[key], key, obj)) {
      return false;
    }
  }
  return true;
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for (var key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for (var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if (!goog.isDef(obj)) {
      break;
    }
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return obj !== null && key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call((opt_this), obj[key], key, obj)) {
      return key;
    }
  }
  return undefined;
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if (rv = key in (obj)) {
    delete obj[key];
  }
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (obj !== null && key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  if (obj !== null && key in obj) {
    return obj[key];
  }
  return opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in (obj) ? obj[key] : obj[key] = value;
};
goog.object.setWithReturnValueIfNotSet = function(obj, key, f) {
  if (key in obj) {
    return obj[key];
  }
  var val = f();
  obj[key] = val;
  return val;
};
goog.object.equals = function(a, b) {
  for (var k in a) {
    if (!(k in b) || a[k] !== b[k]) {
      return false;
    }
  }
  for (var k in b) {
    if (!(k in a)) {
      return false;
    }
  }
  return true;
};
goog.object.clone = function(obj) {
  var res = {};
  for (var key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (goog.isFunction(obj.clone)) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for (var key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for (var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for (var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  var rv = {};
  for (var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  if (Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj);
    Object.freeze(result);
  }
  return result;
};
goog.object.isImmutableView = function(obj) {
  return !!Object.isFrozen && Object.isFrozen(obj);
};
goog.provide("goog.a11y.aria.datatables");
goog.require("goog.a11y.aria.State");
goog.require("goog.object");
goog.a11y.aria.DefaultStateValueMap_;
goog.a11y.aria.datatables.getDefaultValuesMap = function() {
  if (!goog.a11y.aria.DefaultStateValueMap_) {
    goog.a11y.aria.DefaultStateValueMap_ = goog.object.create(goog.a11y.aria.State.ATOMIC, false, goog.a11y.aria.State.AUTOCOMPLETE, "none", goog.a11y.aria.State.DROPEFFECT, "none", goog.a11y.aria.State.HASPOPUP, false, goog.a11y.aria.State.LIVE, "off", goog.a11y.aria.State.MULTILINE, false, goog.a11y.aria.State.MULTISELECTABLE, false, goog.a11y.aria.State.ORIENTATION, "vertical", goog.a11y.aria.State.READONLY, false, goog.a11y.aria.State.RELEVANT, "additions text", goog.a11y.aria.State.REQUIRED, 
    false, goog.a11y.aria.State.SORT, "none", goog.a11y.aria.State.BUSY, false, goog.a11y.aria.State.DISABLED, false, goog.a11y.aria.State.HIDDEN, false, goog.a11y.aria.State.INVALID, "false");
  }
  return goog.a11y.aria.DefaultStateValueMap_;
};
goog.provide("goog.ui.IdGenerator");
goog.ui.IdGenerator = function() {
};
goog.addSingletonGetter(goog.ui.IdGenerator);
goog.ui.IdGenerator.prototype.nextId_ = 0;
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
  return ":" + (this.nextId_++).toString(36);
};
goog.provide("goog.ui.ControlContent");
goog.ui.ControlContent;
goog.provide("goog.fs.url");
goog.fs.url.createObjectUrl = function(blob) {
  return goog.fs.url.getUrlObject_().createObjectURL(blob);
};
goog.fs.url.revokeObjectUrl = function(url) {
  goog.fs.url.getUrlObject_().revokeObjectURL(url);
};
goog.fs.url.UrlObject_;
goog.fs.url.getUrlObject_ = function() {
  var urlObject = goog.fs.url.findUrlObject_();
  if (urlObject != null) {
    return urlObject;
  } else {
    throw Error("This browser doesn't seem to support blob URLs");
  }
};
goog.fs.url.findUrlObject_ = function() {
  if (goog.isDef(goog.global.URL) && goog.isDef(goog.global.URL.createObjectURL)) {
    return (goog.global.URL);
  } else {
    if (goog.isDef(goog.global.webkitURL) && goog.isDef(goog.global.webkitURL.createObjectURL)) {
      return (goog.global.webkitURL);
    } else {
      if (goog.isDef(goog.global.createObjectURL)) {
        return (goog.global);
      } else {
        return null;
      }
    }
  }
};
goog.fs.url.browserSupportsObjectUrls = function() {
  return goog.fs.url.findUrlObject_() != null;
};
goog.provide("goog.debug.LogRecord");
goog.debug.LogRecord = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber);
};
goog.debug.LogRecord.prototype.time_;
goog.debug.LogRecord.prototype.level_;
goog.debug.LogRecord.prototype.msg_;
goog.debug.LogRecord.prototype.loggerName_;
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.define("goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS", true);
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  if (goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS) {
    this.sequenceNumber_ = typeof opt_sequenceNumber == "number" ? opt_sequenceNumber : goog.debug.LogRecord.nextSequenceNumber_++;
  }
  this.time_ = opt_time || goog.now();
  this.level_ = level;
  this.msg_ = msg;
  this.loggerName_ = loggerName;
  delete this.exception_;
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_;
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_;
};
goog.debug.LogRecord.prototype.setException = function(exception) {
  this.exception_ = exception;
};
goog.debug.LogRecord.prototype.setLoggerName = function(loggerName) {
  this.loggerName_ = loggerName;
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_;
};
goog.debug.LogRecord.prototype.setLevel = function(level) {
  this.level_ = level;
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_;
};
goog.debug.LogRecord.prototype.setMessage = function(msg) {
  this.msg_ = msg;
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_;
};
goog.debug.LogRecord.prototype.setMillis = function(time) {
  this.time_ = time;
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_;
};
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = (new Error).stack;
    if (stack) {
      this.stack = stack;
    }
  }
  if (opt_msg) {
    this.message = String(opt_msg);
  }
  this.reportErrorToServer = true;
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.debug.RelativeTimeProvider");
goog.debug.RelativeTimeProvider = function() {
  this.relativeTimeStart_ = goog.now();
};
goog.debug.RelativeTimeProvider.defaultInstance_ = new goog.debug.RelativeTimeProvider;
goog.debug.RelativeTimeProvider.prototype.set = function(timeStamp) {
  this.relativeTimeStart_ = timeStamp;
};
goog.debug.RelativeTimeProvider.prototype.reset = function() {
  this.set(goog.now());
};
goog.debug.RelativeTimeProvider.prototype.get = function() {
  return this.relativeTimeStart_;
};
goog.debug.RelativeTimeProvider.getDefaultInstance = function() {
  return goog.debug.RelativeTimeProvider.defaultInstance_;
};
goog.provide("goog.promise.Resolver");
goog.promise.Resolver = function() {
};
goog.promise.Resolver.prototype.promise;
goog.promise.Resolver.prototype.resolve;
goog.promise.Resolver.prototype.reject;
goog.provide("goog.Thenable");
goog.Thenable = function() {
};
goog.Thenable.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
};
goog.Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
goog.Thenable.addImplementation = function(ctor) {
  goog.exportProperty(ctor.prototype, "then", ctor.prototype.then);
  if (COMPILED) {
    ctor.prototype[goog.Thenable.IMPLEMENTED_BY_PROP] = true;
  } else {
    ctor.prototype.$goog_Thenable = true;
  }
};
goog.Thenable.isImplementedBy = function(object) {
  if (!object) {
    return false;
  }
  try {
    if (COMPILED) {
      return !!object[goog.Thenable.IMPLEMENTED_BY_PROP];
    }
    return !!object.$goog_Thenable;
  } catch (e) {
    return false;
  }
};
goog.provide("goog.reflect");
goog.reflect.object = function(type, object) {
  return object;
};
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[" "](x);
  return x;
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(obj, prop) {
  try {
    goog.reflect.sinkValue(obj[prop]);
    return true;
  } catch (e) {
  }
  return false;
};
goog.provide("goog.events.EventId");
goog.events.EventId = function(eventId) {
  this.id = eventId;
};
goog.events.EventId.prototype.toString = function() {
  return this.id;
};
goog.provide("goog.events.Listenable");
goog.provide("goog.events.ListenableKey");
goog.require("goog.events.EventId");
goog.events.Listenable = function() {
};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (Math.random() * 1E6 | 0);
goog.events.Listenable.addImplementation = function(cls) {
  cls.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = true;
};
goog.events.Listenable.isImplementedBy = function(obj) {
  return !!(obj && obj[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
};
goog.events.Listenable.prototype.listen;
goog.events.Listenable.prototype.listenOnce;
goog.events.Listenable.prototype.unlisten;
goog.events.Listenable.prototype.unlistenByKey;
goog.events.Listenable.prototype.dispatchEvent;
goog.events.Listenable.prototype.removeAllListeners;
goog.events.Listenable.prototype.getParentEventTarget;
goog.events.Listenable.prototype.fireListeners;
goog.events.Listenable.prototype.getListeners;
goog.events.Listenable.prototype.getListener;
goog.events.Listenable.prototype.hasListener;
goog.events.ListenableKey = function() {
};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
  return ++goog.events.ListenableKey.counter_;
};
goog.events.ListenableKey.prototype.src;
goog.events.ListenableKey.prototype.type;
goog.events.ListenableKey.prototype.listener;
goog.events.ListenableKey.prototype.capture;
goog.events.ListenableKey.prototype.handler;
goog.events.ListenableKey.prototype.key;
goog.provide("goog.events.Listener");
goog.require("goog.events.ListenableKey");
goog.events.Listener = function(listener, proxy, src, type, capture, opt_handler) {
  if (goog.events.Listener.ENABLE_MONITORING) {
    this.creationStack = (new Error).stack;
  }
  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  this.type = type;
  this.capture = !!capture;
  this.handler = opt_handler;
  this.key = goog.events.ListenableKey.reserveKey();
  this.callOnce = false;
  this.removed = false;
};
goog.define("goog.events.Listener.ENABLE_MONITORING", false);
goog.events.Listener.prototype.creationStack;
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = true;
  this.listener = null;
  this.proxy = null;
  this.src = null;
  this.handler = null;
};
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.define("goog.string.DETECT_DOUBLE_ESCAPING", false);
goog.define("goog.string.FORCE_NON_DOM_HTML_UNESCAPING", false);
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0;
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0;
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  var splitParts = str.split("%s");
  var returnString = "";
  var subsArguments = Array.prototype.slice.call(arguments, 1);
  while (subsArguments.length && splitParts.length > 1) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(str) {
  return /^[\s\xa0]*$/.test(str);
};
goog.string.isEmptyString = function(str) {
  return str.length == 0;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(str) {
  return !/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return !/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return !/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return !/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return ch == " ";
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd";
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(str) {
  return str.trim();
} : function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if (test1 < test2) {
    return -1;
  } else {
    if (test1 == test2) {
      return 0;
    } else {
      return 1;
    }
  }
};
goog.string.numberAwareCompare_ = function(str1, str2, tokenizerRegExp) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return -1;
  }
  if (!str2) {
    return 1;
  }
  var tokens1 = str1.toLowerCase().match(tokenizerRegExp);
  var tokens2 = str2.toLowerCase().match(tokenizerRegExp);
  var count = Math.min(tokens1.length, tokens2.length);
  for (var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }
  return str1 < str2 ? -1 : 1;
};
goog.string.intAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\D+/g);
};
goog.string.floatAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\.\d+|\D+/g);
};
goog.string.numerateCompare = goog.string.floatAwareCompare;
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;");
    if (goog.string.DETECT_DOUBLE_ESCAPING) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    if (str.indexOf("&") != -1) {
      str = str.replace(goog.string.AMP_RE_, "&amp;");
    }
    if (str.indexOf("<") != -1) {
      str = str.replace(goog.string.LT_RE_, "&lt;");
    }
    if (str.indexOf(">") != -1) {
      str = str.replace(goog.string.GT_RE_, "&gt;");
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.QUOT_RE_, "&quot;");
    }
    if (str.indexOf("'") != -1) {
      str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;");
    }
    if (str.indexOf("\x00") != -1) {
      str = str.replace(goog.string.NULL_RE_, "&#0;");
    }
    if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf("e") != -1) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  }
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
  if (goog.string.contains(str, "&")) {
    if (!goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str);
    } else {
      return goog.string.unescapePureXmlEntities_(str);
    }
  }
  return str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  if (goog.string.contains(str, "&")) {
    return goog.string.unescapeEntitiesUsingDom_(str, document);
  }
  return str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div;
  if (opt_document) {
    div = opt_document.createElement("div");
  } else {
    div = goog.global.document.createElement("div");
  }
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if (entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    if (!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        if (entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for (var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (str.length > chars) {
    str = str.substring(0, chars - 3) + "...";
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos);
    }
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  var sb = ['"'];
  for (var i = 0;i < s.length;i++) {
    var ch = s.charAt(i);
    var cc = ch.charCodeAt(0);
    sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch));
  }
  sb.push('"');
  return sb.join("");
};
goog.string.escapeString = function(str) {
  var sb = [];
  for (var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    if (cc < 256) {
      rv = "\\x";
      if (cc < 16 || cc > 256) {
        rv += "0";
      }
    } else {
      rv = "\\u";
      if (cc < 4096) {
        rv += "0";
      }
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = function(str, subString) {
  return str.indexOf(subString) != -1;
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength);
  }
  return resultStr;
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = String.prototype.repeat ? function(string, length) {
  return string.repeat(length);
} : function(string, length) {
  return (new Array(length + 1)).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if (index == -1) {
    index = s.length;
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for (var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
    } while (order == 0);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return -1;
  } else {
    if (left > right) {
      return 1;
    }
  }
  return 0;
};
goog.string.hashCode = function(str) {
  var result = 0;
  for (var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i) >>> 0;
  }
  return result;
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if (num == 0 && goog.string.isEmptyOrWhitespace(str)) {
    return NaN;
  }
  return num;
};
goog.string.isLowerCamelCase = function(str) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return /^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  delimiters = delimiters ? "|[" + delimiters + "]+" : "";
  var regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.capitalize = function(str) {
  return String(str.charAt(0)).toUpperCase() + String(str.substr(1)).toLowerCase();
};
goog.string.parseInt = function(value) {
  if (isFinite(value)) {
    value = String(value);
  }
  if (goog.isString(value)) {
    return /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
  }
  return NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  var parts = str.split(separator);
  var returnVal = [];
  while (limit > 0 && parts.length) {
    returnVal.push(parts.shift());
    limit--;
  }
  if (parts.length) {
    returnVal.push(parts.join(separator));
  }
  return returnVal;
};
goog.string.editDistance = function(a, b) {
  var v0 = [];
  var v1 = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var i = 0;i < b.length + 1;i++) {
    v0[i] = i;
  }
  for (var i = 0;i < a.length;i++) {
    v1[0] = i + 1;
    for (var j = 0;j < b.length;j++) {
      var cost = a[i] != b[j];
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (var j = 0;j < v0.length;j++) {
      v0[j] = v1[j];
    }
  }
  return v1[b.length];
};
goog.provide("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var navigator = goog.labs.userAgent.util.getNavigator_();
  if (navigator) {
    var userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(opt_userAgent) {
  goog.labs.userAgent.util.userAgent_ = opt_userAgent || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(userAgent, str);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(userAgent, str);
};
goog.labs.userAgent.util.extractVersionTuples = function(userAgent) {
  var versionRegExp = new RegExp("(\\w[\\w ]+)" + "/" + "([^\\s]+)" + "\\s*" + "(?:\\((.*?)\\))?", "g");
  var data = [];
  var match;
  while (match = versionRegExp.exec(userAgent)) {
    data.push([match[1], match[2], match[3] || undefined]);
  }
  return data;
};
goog.provide("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.platform.isAndroid = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.platform.isIpod = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPod");
};
goog.labs.userAgent.platform.isIphone = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIpad = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIos = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod();
};
goog.labs.userAgent.platform.isMacintosh = function() {
  return goog.labs.userAgent.util.matchUserAgent("Macintosh");
};
goog.labs.userAgent.platform.isLinux = function() {
  return goog.labs.userAgent.util.matchUserAgent("Linux");
};
goog.labs.userAgent.platform.isWindows = function() {
  return goog.labs.userAgent.util.matchUserAgent("Windows");
};
goog.labs.userAgent.platform.isChromeOS = function() {
  return goog.labs.userAgent.util.matchUserAgent("CrOS");
};
goog.labs.userAgent.platform.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  var version = "", re;
  if (goog.labs.userAgent.platform.isWindows()) {
    re = /Windows (?:NT|Phone) ([0-9.]+)/;
    var match = re.exec(userAgentString);
    if (match) {
      version = match[1];
    } else {
      version = "0.0";
    }
  } else {
    if (goog.labs.userAgent.platform.isIos()) {
      re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
      var match = re.exec(userAgentString);
      version = match && match[1].replace(/_/g, ".");
    } else {
      if (goog.labs.userAgent.platform.isMacintosh()) {
        re = /Mac OS X ([0-9_.]+)/;
        var match = re.exec(userAgentString);
        version = match ? match[1].replace(/_/g, ".") : "10";
      } else {
        if (goog.labs.userAgent.platform.isAndroid()) {
          re = /Android\s+([^\);]+)(\)|;)/;
          var match = re.exec(userAgentString);
          version = match && match[1];
        } else {
          if (goog.labs.userAgent.platform.isChromeOS()) {
            re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
            var match = re.exec(userAgentString);
            version = match && match[1];
          }
        }
      }
    }
  }
  return version || "";
};
goog.labs.userAgent.platform.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), version) >= 0;
};
goog.provide("goog.string.format");
goog.require("goog.string");
goog.string.format = function(formatString, var_args) {
  var args = Array.prototype.slice.call(arguments);
  var template = args.shift();
  if (typeof template == "undefined") {
    throw Error("[goog.string.format] Template required");
  }
  var formatRe = /%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g;
  function replacerDemuxer(match, flags, width, dotp, precision, type, offset, wholeString) {
    if (type == "%") {
      return "%";
    }
    var value = args.shift();
    if (typeof value == "undefined") {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = value;
    return goog.string.format.demuxes_[type].apply(null, arguments);
  }
  return template.replace(formatRe, replacerDemuxer);
};
goog.string.format.demuxes_ = {};
goog.string.format.demuxes_["s"] = function(value, flags, width, dotp, precision, type, offset, wholeString) {
  var replacement = value;
  if (isNaN(width) || width == "" || replacement.length >= width) {
    return replacement;
  }
  if (flags.indexOf("-", 0) > -1) {
    replacement = replacement + goog.string.repeat(" ", width - replacement.length);
  } else {
    replacement = goog.string.repeat(" ", width - replacement.length) + replacement;
  }
  return replacement;
};
goog.string.format.demuxes_["f"] = function(value, flags, width, dotp, precision, type, offset, wholeString) {
  var replacement = value.toString();
  if (!(isNaN(precision) || precision == "")) {
    replacement = parseFloat(value).toFixed(precision);
  }
  var sign;
  if (value < 0) {
    sign = "-";
  } else {
    if (flags.indexOf("+") >= 0) {
      sign = "+";
    } else {
      if (flags.indexOf(" ") >= 0) {
        sign = " ";
      } else {
        sign = "";
      }
    }
  }
  if (value >= 0) {
    replacement = sign + replacement;
  }
  if (isNaN(width) || replacement.length >= width) {
    return replacement;
  }
  replacement = isNaN(precision) ? Math.abs(value).toString() : Math.abs(value).toFixed(precision);
  var padCount = width - replacement.length - sign.length;
  if (flags.indexOf("-", 0) >= 0) {
    replacement = sign + replacement + goog.string.repeat(" ", padCount);
  } else {
    var paddingChar = flags.indexOf("0", 0) >= 0 ? "0" : " ";
    replacement = sign + goog.string.repeat(paddingChar, padCount) + replacement;
  }
  return replacement;
};
goog.string.format.demuxes_["d"] = function(value, flags, width, dotp, precision, type, offset, wholeString) {
  return goog.string.format.demuxes_["f"](parseInt(value, 10), flags, width, dotp, 0, type, offset, wholeString);
};
goog.string.format.demuxes_["i"] = goog.string.format.demuxes_["d"];
goog.string.format.demuxes_["u"] = goog.string.format.demuxes_["d"];
goog.provide("goog.string.TypedString");
goog.string.TypedString = function() {
};
goog.string.TypedString.prototype.implementsGoogStringTypedString;
goog.string.TypedString.prototype.getTypedStringValue;
goog.provide("goog.string.StringBuffer");
goog.string.StringBuffer = function(opt_a1, var_args) {
  if (opt_a1 != null) {
    this.append.apply(this, arguments);
  }
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(s) {
  this.buffer_ = "" + s;
};
goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
  this.buffer_ += a1;
  if (opt_a2 != null) {
    for (var i = 1;i < arguments.length;i++) {
      this.buffer_ += arguments[i];
    }
  }
  return this;
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = "";
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length;
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_;
};
goog.provide("goog.dom.TagName");
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEMPLATE:"TEMPLATE", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.provide("goog.dom.tags");
goog.require("goog.object");
goog.dom.tags.VOID_TAGS_ = goog.object.createSet("area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr");
goog.dom.tags.isVoidTag = function(tagName) {
  return goog.dom.tags.VOID_TAGS_[tagName] === true;
};
goog.provide("goog.dom.InputType");
goog.dom.InputType = {BUTTON:"button", CHECKBOX:"checkbox", COLOR:"color", DATE:"date", DATETIME:"datetime", DATETIME_LOCAL:"datetime-local", EMAIL:"email", FILE:"file", HIDDEN:"hidden", IMAGE:"image", MENU:"menu", MONTH:"month", NUMBER:"number", PASSWORD:"password", RADIO:"radio", RANGE:"range", RESET:"reset", SEARCH:"search", SELECT_MULTIPLE:"select-multiple", SELECT_ONE:"select-one", SUBMIT:"submit", TEL:"tel", TEXT:"text", TEXTAREA:"textarea", TIME:"time", URL:"url", WEEK:"week"};
goog.provide("goog.dom.NodeType");
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.provide("goog.format.JsonPrettyPrinter");
goog.provide("goog.format.JsonPrettyPrinter.HtmlDelimiters");
goog.provide("goog.format.JsonPrettyPrinter.TextDelimiters");
goog.require("goog.json");
goog.require("goog.json.Serializer");
goog.require("goog.string");
goog.require("goog.string.StringBuffer");
goog.require("goog.string.format");
goog.format.JsonPrettyPrinter = function(delimiters) {
  this.delimiters_ = delimiters || new goog.format.JsonPrettyPrinter.TextDelimiters;
  this.jsonSerializer_ = new goog.json.Serializer;
};
goog.format.JsonPrettyPrinter.prototype.format = function(json) {
  if (!goog.isDefAndNotNull(json)) {
    return "";
  }
  if (goog.isString(json)) {
    if (goog.string.isEmptyOrWhitespace(json)) {
      return "";
    }
    json = goog.json.parse(json);
  }
  var outputBuffer = new goog.string.StringBuffer;
  this.printObject_(json, outputBuffer, 0);
  return outputBuffer.toString();
};
goog.format.JsonPrettyPrinter.prototype.printObject_ = function(val, outputBuffer, indent) {
  var typeOf = goog.typeOf(val);
  switch(typeOf) {
    case "null":
    ;
    case "boolean":
    ;
    case "number":
    ;
    case "string":
      this.printValue_((val), typeOf, outputBuffer);
      break;
    case "array":
      outputBuffer.append(this.delimiters_.arrayStart);
      var i = 0;
      for (i = 0;i < val.length;i++) {
        if (i > 0) {
          outputBuffer.append(this.delimiters_.propertySeparator);
        }
        outputBuffer.append(this.delimiters_.lineBreak);
        this.printSpaces_(indent + this.delimiters_.indent, outputBuffer);
        this.printObject_(val[i], outputBuffer, indent + this.delimiters_.indent);
      }
      if (i > 0) {
        outputBuffer.append(this.delimiters_.lineBreak);
        this.printSpaces_(indent, outputBuffer);
      }
      outputBuffer.append(this.delimiters_.arrayEnd);
      break;
    case "object":
      outputBuffer.append(this.delimiters_.objectStart);
      var propertyCount = 0;
      for (var name in val) {
        if (!val.hasOwnProperty(name)) {
          continue;
        }
        if (propertyCount > 0) {
          outputBuffer.append(this.delimiters_.propertySeparator);
        }
        outputBuffer.append(this.delimiters_.lineBreak);
        this.printSpaces_(indent + this.delimiters_.indent, outputBuffer);
        this.printName_(name, outputBuffer);
        outputBuffer.append(this.delimiters_.nameValueSeparator, this.delimiters_.space);
        this.printObject_(val[name], outputBuffer, indent + this.delimiters_.indent);
        propertyCount++;
      }
      if (propertyCount > 0) {
        outputBuffer.append(this.delimiters_.lineBreak);
        this.printSpaces_(indent, outputBuffer);
      }
      outputBuffer.append(this.delimiters_.objectEnd);
      break;
    default:
      this.printValue_("", "unknown", outputBuffer);
  }
};
goog.format.JsonPrettyPrinter.prototype.printName_ = function(name, outputBuffer) {
  outputBuffer.append(this.delimiters_.preName, this.jsonSerializer_.serialize(name), this.delimiters_.postName);
};
goog.format.JsonPrettyPrinter.prototype.printValue_ = function(val, typeOf, outputBuffer) {
  outputBuffer.append(goog.string.format(this.delimiters_.preValue, typeOf), this.jsonSerializer_.serialize(val), goog.string.format(this.delimiters_.postValue, typeOf));
};
goog.format.JsonPrettyPrinter.prototype.printSpaces_ = function(indent, outputBuffer) {
  outputBuffer.append(goog.string.repeat(this.delimiters_.space, indent));
};
goog.format.JsonPrettyPrinter.TextDelimiters = function() {
};
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.space = " ";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.lineBreak = "\n";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.objectStart = "{";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.objectEnd = "}";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.arrayStart = "[";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.arrayEnd = "]";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.propertySeparator = ",";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.nameValueSeparator = ":";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.preName = "";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.postName = "";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.preValue = "";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.postValue = "";
goog.format.JsonPrettyPrinter.TextDelimiters.prototype.indent = 2;
goog.format.JsonPrettyPrinter.HtmlDelimiters = function() {
  goog.format.JsonPrettyPrinter.TextDelimiters.call(this);
};
goog.inherits(goog.format.JsonPrettyPrinter.HtmlDelimiters, goog.format.JsonPrettyPrinter.TextDelimiters);
goog.format.JsonPrettyPrinter.HtmlDelimiters.prototype.preName = '<span class="' + goog.getCssName("goog-jsonprettyprinter-propertyname") + '">';
goog.format.JsonPrettyPrinter.HtmlDelimiters.prototype.postName = "</span>";
goog.format.JsonPrettyPrinter.HtmlDelimiters.prototype.preValue = '<span class="' + goog.getCssName("goog-jsonprettyprinter-propertyvalue-%s") + '">';
goog.format.JsonPrettyPrinter.HtmlDelimiters.prototype.postValue = "</span>";
goog.provide("goog.structs.Collection");
goog.structs.Collection = function() {
};
goog.structs.Collection.prototype.add;
goog.structs.Collection.prototype.remove;
goog.structs.Collection.prototype.contains;
goog.structs.Collection.prototype.getCount;
goog.provide("goog.disposable.IDisposable");
goog.disposable.IDisposable = function() {
};
goog.disposable.IDisposable.prototype.dispose = goog.abstractMethod;
goog.disposable.IDisposable.prototype.isDisposed = goog.abstractMethod;
goog.provide("goog.Disposable");
goog.provide("goog.dispose");
goog.provide("goog.disposeAll");
goog.require("goog.disposable.IDisposable");
goog.Disposable = function() {
  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
    if (goog.Disposable.INCLUDE_STACK_ON_CREATION) {
      this.creationStack = (new Error).stack;
    }
    goog.Disposable.instances_[goog.getUid(this)] = this;
  }
  this.disposed_ = this.disposed_;
  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.define("goog.Disposable.MONITORING_MODE", 0);
goog.define("goog.Disposable.INCLUDE_STACK_ON_CREATION", true);
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var ret = [];
  for (var id in goog.Disposable.instances_) {
    if (goog.Disposable.instances_.hasOwnProperty(id)) {
      ret.push(goog.Disposable.instances_[Number(id)]);
    }
  }
  return ret;
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {};
};
goog.Disposable.prototype.disposed_ = false;
goog.Disposable.prototype.onDisposeCallbacks_;
goog.Disposable.prototype.creationStack;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_;
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if (!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
      var uid = goog.getUid(this);
      if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(uid)) {
        throw Error(this + " did not call the goog.Disposable base " + "constructor or was disposed of after a clearUndisposedObjects " + "call");
      }
      delete goog.Disposable.instances_[uid];
    }
  }
};
goog.Disposable.prototype.registerDisposable = function(disposable) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));
};
goog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {
  if (this.disposed_) {
    callback.call(opt_scope);
    return;
  }
  if (!this.onDisposeCallbacks_) {
    this.onDisposeCallbacks_ = [];
  }
  this.onDisposeCallbacks_.push(goog.isDef(opt_scope) ? goog.bind(callback, opt_scope) : callback);
};
goog.Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    while (this.onDisposeCallbacks_.length) {
      this.onDisposeCallbacks_.shift()();
    }
  }
};
goog.Disposable.isDisposed = function(obj) {
  if (obj && typeof obj.isDisposed == "function") {
    return obj.isDisposed();
  }
  return false;
};
goog.dispose = function(obj) {
  if (obj && typeof obj.dispose == "function") {
    obj.dispose();
  }
};
goog.disposeAll = function(var_args) {
  for (var i = 0, len = arguments.length;i < len;++i) {
    var disposable = arguments[i];
    if (goog.isArrayLike(disposable)) {
      goog.disposeAll.apply(null, disposable);
    } else {
      goog.dispose(disposable);
    }
  }
};
goog.provide("goog.events.Event");
goog.provide("goog.events.EventLike");
goog.require("goog.Disposable");
goog.require("goog.events.EventId");
goog.events.EventLike;
goog.events.Event = function(type, opt_target) {
  this.type = type instanceof goog.events.EventId ? String(type) : type;
  this.target = opt_target;
  this.currentTarget = this.target;
  this.propagationStopped_ = false;
  this.defaultPrevented = false;
  this.returnValue_ = true;
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true;
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = true;
  this.returnValue_ = false;
};
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation();
};
goog.events.Event.preventDefault = function(e) {
  e.preventDefault();
};
goog.provide("goog.net.ErrorCode");
goog.net.ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9};
goog.net.ErrorCode.getDebugMessage = function(errorCode) {
  switch(errorCode) {
    case goog.net.ErrorCode.NO_ERROR:
      return "No Error";
    case goog.net.ErrorCode.ACCESS_DENIED:
      return "Access denied to content document";
    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return "File not found";
    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return "Firefox silently errored";
    case goog.net.ErrorCode.CUSTOM_ERROR:
      return "Application custom error";
    case goog.net.ErrorCode.EXCEPTION:
      return "An exception occurred";
    case goog.net.ErrorCode.HTTP_ERROR:
      return "Http response at 400 or 500 level";
    case goog.net.ErrorCode.ABORT:
      return "Request was aborted";
    case goog.net.ErrorCode.TIMEOUT:
      return "Request timed out";
    case goog.net.ErrorCode.OFFLINE:
      return "The resource is not available offline";
    default:
      return "Unrecognized error code";
  }
};
goog.provide("goog.net.HttpStatus");
goog.net.HttpStatus = {CONTINUE:100, SWITCHING_PROTOCOLS:101, OK:200, CREATED:201, ACCEPTED:202, NON_AUTHORITATIVE_INFORMATION:203, NO_CONTENT:204, RESET_CONTENT:205, PARTIAL_CONTENT:206, MULTIPLE_CHOICES:300, MOVED_PERMANENTLY:301, FOUND:302, SEE_OTHER:303, NOT_MODIFIED:304, USE_PROXY:305, TEMPORARY_REDIRECT:307, BAD_REQUEST:400, UNAUTHORIZED:401, PAYMENT_REQUIRED:402, FORBIDDEN:403, NOT_FOUND:404, METHOD_NOT_ALLOWED:405, NOT_ACCEPTABLE:406, PROXY_AUTHENTICATION_REQUIRED:407, REQUEST_TIMEOUT:408, 
CONFLICT:409, GONE:410, LENGTH_REQUIRED:411, PRECONDITION_FAILED:412, REQUEST_ENTITY_TOO_LARGE:413, REQUEST_URI_TOO_LONG:414, UNSUPPORTED_MEDIA_TYPE:415, REQUEST_RANGE_NOT_SATISFIABLE:416, EXPECTATION_FAILED:417, PRECONDITION_REQUIRED:428, TOO_MANY_REQUESTS:429, REQUEST_HEADER_FIELDS_TOO_LARGE:431, INTERNAL_SERVER_ERROR:500, NOT_IMPLEMENTED:501, BAD_GATEWAY:502, SERVICE_UNAVAILABLE:503, GATEWAY_TIMEOUT:504, HTTP_VERSION_NOT_SUPPORTED:505, NETWORK_AUTHENTICATION_REQUIRED:511, QUIRK_IE_NO_CONTENT:1223};
goog.net.HttpStatus.isSuccess = function(status) {
  switch(status) {
    case goog.net.HttpStatus.OK:
    ;
    case goog.net.HttpStatus.CREATED:
    ;
    case goog.net.HttpStatus.ACCEPTED:
    ;
    case goog.net.HttpStatus.NO_CONTENT:
    ;
    case goog.net.HttpStatus.PARTIAL_CONTENT:
    ;
    case goog.net.HttpStatus.NOT_MODIFIED:
    ;
    case goog.net.HttpStatus.QUIRK_IE_NO_CONTENT:
      return true;
    default:
      return false;
  }
};
goog.provide("goog.net.XhrLike");
goog.net.XhrLike = function() {
};
goog.net.XhrLike.OrNative;
goog.net.XhrLike.prototype.onreadystatechange;
goog.net.XhrLike.prototype.responseText;
goog.net.XhrLike.prototype.responseXML;
goog.net.XhrLike.prototype.readyState;
goog.net.XhrLike.prototype.status;
goog.net.XhrLike.prototype.statusText;
goog.net.XhrLike.prototype.open = function(method, url, opt_async, opt_user, opt_password) {
};
goog.net.XhrLike.prototype.send = function(opt_data) {
};
goog.net.XhrLike.prototype.abort = function() {
};
goog.net.XhrLike.prototype.setRequestHeader = function(header, value) {
};
goog.net.XhrLike.prototype.getResponseHeader = function(header) {
};
goog.net.XhrLike.prototype.getAllResponseHeaders = function() {
};
goog.provide("goog.net.XmlHttpFactory");
goog.require("goog.net.XhrLike");
goog.net.XmlHttpFactory = function() {
};
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null;
goog.net.XmlHttpFactory.prototype.createInstance = goog.abstractMethod;
goog.net.XmlHttpFactory.prototype.getOptions = function() {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions());
};
goog.net.XmlHttpFactory.prototype.internalGetOptions = goog.abstractMethod;
goog.provide("goog.net.EventType");
goog.net.EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", PROGRESS:"progress", DOWNLOAD_PROGRESS:"downloadprogress", UPLOAD_PROGRESS:"uploadprogress"};
goog.provide("goog.net.WrapperXmlHttpFactory");
goog.require("goog.net.XhrLike");
goog.require("goog.net.XmlHttpFactory");
goog.net.WrapperXmlHttpFactory = function(xhrFactory, optionsFactory) {
  goog.net.XmlHttpFactory.call(this);
  this.xhrFactory_ = xhrFactory;
  this.optionsFactory_ = optionsFactory;
};
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_();
};
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_();
};
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.dom.NodeType");
goog.require("goog.string");
goog.define("goog.asserts.ENABLE_ASSERTS", goog.DEBUG);
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs;
  } else {
    if (defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs;
    }
  }
  var e = new goog.asserts.AssertionError("" + message, args || []);
  goog.asserts.errorHandler_(e);
};
goog.asserts.setErrorHandler = function(errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler;
  }
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
goog.asserts.getType_ = function(value) {
  if (value instanceof Function) {
    return value.displayName || value.name || "unknown type name";
  } else {
    if (value instanceof Object) {
      return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value);
    } else {
      return value === null ? "null" : typeof value;
    }
  }
};
goog.provide("goog.debug.EntryPointMonitor");
goog.provide("goog.debug.entryPointRegistry");
goog.require("goog.asserts");
goog.debug.EntryPointMonitor = function() {
};
goog.debug.EntryPointMonitor.prototype.wrap;
goog.debug.EntryPointMonitor.prototype.unwrap;
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = false;
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback;
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    var monitors = goog.debug.entryPointRegistry.monitors_;
    for (var i = 0;i < monitors.length;i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]));
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = true;
  var transformer = goog.bind(monitor.wrap, monitor);
  for (var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor);
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(monitor == monitors[monitors.length - 1], "Only the most recent monitor can be unwrapped.");
  var transformer = goog.bind(monitor.unwrap, monitor);
  for (var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  monitors.length--;
};
goog.provide("goog.debug.LogBuffer");
goog.require("goog.asserts");
goog.require("goog.debug.LogRecord");
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining " + "goog.debug.LogBuffer.CAPACITY.");
  this.clear();
};
goog.debug.LogBuffer.getInstance = function() {
  if (!goog.debug.LogBuffer.instance_) {
    goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer;
  }
  return goog.debug.LogBuffer.instance_;
};
goog.define("goog.debug.LogBuffer.CAPACITY", 0);
goog.debug.LogBuffer.prototype.buffer_;
goog.debug.LogBuffer.prototype.curIndex_;
goog.debug.LogBuffer.prototype.isFull_;
goog.debug.LogBuffer.prototype.addRecord = function(level, msg, loggerName) {
  var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = curIndex;
  if (this.isFull_) {
    var ret = this.buffer_[curIndex];
    ret.reset(level, msg, loggerName);
    return ret;
  }
  this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[curIndex] = new goog.debug.LogRecord(level, msg, loggerName);
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return goog.debug.LogBuffer.CAPACITY > 0;
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = new Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = false;
};
goog.debug.LogBuffer.prototype.forEachRecord = function(func) {
  var buffer = this.buffer_;
  if (!buffer[0]) {
    return;
  }
  var curIndex = this.curIndex_;
  var i = this.isFull_ ? curIndex : -1;
  do {
    i = (i + 1) % goog.debug.LogBuffer.CAPACITY;
    func((buffer[i]));
  } while (i != curIndex);
};
goog.provide("goog.string.Const");
goog.require("goog.asserts");
goog.require("goog.string.TypedString");
goog.string.Const = function() {
  this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = "";
  this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = goog.string.Const.TYPE_MARKER_;
};
goog.string.Const.prototype.implementsGoogStringTypedString = true;
goog.string.Const.prototype.getTypedStringValue = function() {
  return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
};
goog.string.Const.prototype.toString = function() {
  return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}";
};
goog.string.Const.unwrap = function(stringConst) {
  if (stringConst instanceof goog.string.Const && stringConst.constructor === goog.string.Const && stringConst.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === goog.string.Const.TYPE_MARKER_) {
    return stringConst.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
  } else {
    goog.asserts.fail("expected object of type Const, got '" + stringConst + "'");
    return "type_error:Const";
  }
};
goog.string.Const.from = function(s) {
  return goog.string.Const.create__googStringSecurityPrivate_(s);
};
goog.string.Const.TYPE_MARKER_ = {};
goog.string.Const.create__googStringSecurityPrivate_ = function(s) {
  var stringConst = new goog.string.Const;
  stringConst.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = s;
  return stringConst;
};
goog.provide("goog.html.SafeScript");
goog.require("goog.asserts");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeScript = function() {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = "";
  this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeScript.prototype.implementsGoogStringTypedString = true;
goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeScript.fromConstant = function(script) {
  var scriptString = goog.string.Const.unwrap(script);
  if (scriptString.length === 0) {
    return goog.html.SafeScript.EMPTY;
  }
  return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(scriptString);
};
goog.html.SafeScript.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeScriptWrappedValue_;
};
if (goog.DEBUG) {
  goog.html.SafeScript.prototype.toString = function() {
    return "SafeScript{" + this.privateDoNotAccessOrElseSafeScriptWrappedValue_ + "}";
  };
}
goog.html.SafeScript.unwrap = function(safeScript) {
  if (safeScript instanceof goog.html.SafeScript && safeScript.constructor === goog.html.SafeScript && safeScript.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeScript.privateDoNotAccessOrElseSafeScriptWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeScript, got '" + safeScript + "'");
    return "type_error:SafeScript";
  }
};
goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse = function(script) {
  return (new goog.html.SafeScript).initSecurityPrivateDoNotAccessOrElse_(script);
};
goog.html.SafeScript.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(script) {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = script;
  return this;
};
goog.html.SafeScript.EMPTY = goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("");
goog.provide("goog.html.TrustedResourceUrl");
goog.require("goog.asserts");
goog.require("goog.i18n.bidi.Dir");
goog.require("goog.i18n.bidi.DirectionalString");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.TrustedResourceUrl = function() {
  this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = "";
  this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = true;
goog.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = true;
goog.html.TrustedResourceUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
if (goog.DEBUG) {
  goog.html.TrustedResourceUrl.prototype.toString = function() {
    return "TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}";
  };
}
goog.html.TrustedResourceUrl.unwrap = function(trustedResourceUrl) {
  if (trustedResourceUrl instanceof goog.html.TrustedResourceUrl && trustedResourceUrl.constructor === goog.html.TrustedResourceUrl && trustedResourceUrl.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return trustedResourceUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type TrustedResourceUrl, got '" + trustedResourceUrl + "'");
    return "type_error:TrustedResourceUrl";
  }
};
goog.html.TrustedResourceUrl.fromConstant = function(url) {
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(url));
};
goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function(url) {
  var trustedResourceUrl = new goog.html.TrustedResourceUrl;
  trustedResourceUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = url;
  return trustedResourceUrl;
};
goog.provide("goog.html.SafeUrl");
goog.require("goog.asserts");
goog.require("goog.fs.url");
goog.require("goog.i18n.bidi.Dir");
goog.require("goog.i18n.bidi.DirectionalString");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeUrl = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
goog.html.SafeUrl.prototype.implementsGoogStringTypedString = true;
goog.html.SafeUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = true;
goog.html.SafeUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
if (goog.DEBUG) {
  goog.html.SafeUrl.prototype.toString = function() {
    return "SafeUrl{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
  };
}
goog.html.SafeUrl.unwrap = function(safeUrl) {
  if (safeUrl instanceof goog.html.SafeUrl && safeUrl.constructor === goog.html.SafeUrl && safeUrl.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeUrl.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeUrl, got '" + safeUrl + "'");
    return "type_error:SafeUrl";
  }
};
goog.html.SafeUrl.fromConstant = function(url) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(url));
};
goog.html.SAFE_MIME_TYPE_PATTERN_ = /^(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm))$/i;
goog.html.SafeUrl.fromBlob = function(blob) {
  var url = goog.html.SAFE_MIME_TYPE_PATTERN_.test(blob.type) ? goog.fs.url.createObjectUrl(blob) : goog.html.SafeUrl.INNOCUOUS_STRING;
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.DATA_URL_PATTERN_ = /^data:([^;,]*);base64,[a-z0-9+\/]+=*$/i;
goog.html.SafeUrl.fromDataUrl = function(dataUrl) {
  var match = dataUrl.match(goog.html.DATA_URL_PATTERN_);
  var valid = match && goog.html.SAFE_MIME_TYPE_PATTERN_.test(match[1]);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(valid ? dataUrl : goog.html.SafeUrl.INNOCUOUS_STRING);
};
goog.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i;
goog.html.SafeUrl.sanitize = function(url) {
  if (url instanceof goog.html.SafeUrl) {
    return url;
  } else {
    if (url.implementsGoogStringTypedString) {
      url = url.getTypedStringValue();
    } else {
      url = String(url);
    }
  }
  if (!goog.html.SAFE_URL_PATTERN_.test(url)) {
    url = goog.html.SafeUrl.INNOCUOUS_STRING;
  }
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function(url) {
  var safeUrl = new goog.html.SafeUrl;
  safeUrl.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = url;
  return safeUrl;
};
goog.provide("goog.uri.utils");
goog.provide("goog.uri.utils.ComponentIndex");
goog.provide("goog.uri.utils.QueryArray");
goog.provide("goog.uri.utils.QueryValue");
goog.provide("goog.uri.utils.StandardQueryParam");
goog.require("goog.asserts");
goog.require("goog.string");
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = "";
  if (opt_scheme) {
    out += opt_scheme + ":";
  }
  if (opt_domain) {
    out += "//";
    if (opt_userInfo) {
      out += opt_userInfo + "@";
    }
    out += opt_domain;
    if (opt_port) {
      out += ":" + opt_port;
    }
  }
  if (opt_path) {
    out += opt_path;
  }
  if (opt_queryData) {
    out += "?" + opt_queryData;
  }
  if (opt_fragment) {
    out += "#" + opt_fragment;
  }
  return out;
};
goog.uri.utils.splitRe_ = new RegExp("^" + "(?:" + "([^:/?#.]+)" + ":)?" + "(?://" + "(?:([^/?#]*)@)?" + "([^/#?]*?)" + "(?::([0-9]+))?" + "(?=[/#?]|$)" + ")?" + "([^?#]+)?" + "(?:\\?([^#]*))?" + "(?:#(.*))?" + "$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(uri) {
  return (uri.match(goog.uri.utils.splitRe_));
};
goog.uri.utils.decodeIfPossible_ = function(uri, opt_preserveReserved) {
  if (!uri) {
    return uri;
  }
  return opt_preserveReserved ? decodeURI(uri) : decodeURIComponent(uri);
};
goog.uri.utils.getComponentByIndex_ = function(componentIndex, uri) {
  return goog.uri.utils.split(uri)[componentIndex] || null;
};
goog.uri.utils.getScheme = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, uri);
};
goog.uri.utils.getEffectiveScheme = function(uri) {
  var scheme = goog.uri.utils.getScheme(uri);
  if (!scheme && goog.global.self && goog.global.self.location) {
    var protocol = goog.global.self.location.protocol;
    scheme = protocol.substr(0, protocol.length - 1);
  }
  return scheme ? scheme.toLowerCase() : "";
};
goog.uri.utils.getUserInfoEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, uri);
};
goog.uri.utils.getUserInfo = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(uri));
};
goog.uri.utils.getDomainEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, uri);
};
goog.uri.utils.getDomain = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri), true);
};
goog.uri.utils.getPort = function(uri) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, uri)) || null;
};
goog.uri.utils.getPathEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, uri);
};
goog.uri.utils.getPath = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri), true);
};
goog.uri.utils.getQueryData = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, uri);
};
goog.uri.utils.getFragmentEncoded = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? null : uri.substr(hashIndex + 1);
};
goog.uri.utils.setFragmentEncoded = function(uri, fragment) {
  return goog.uri.utils.removeFragment(uri) + (fragment ? "#" + fragment : "");
};
goog.uri.utils.getFragment = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(uri));
};
goog.uri.utils.getHost = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], pieces[goog.uri.utils.ComponentIndex.USER_INFO], pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT]);
};
goog.uri.utils.getPathAndAfter = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, pieces[goog.uri.utils.ComponentIndex.PATH], pieces[goog.uri.utils.ComponentIndex.QUERY_DATA], pieces[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.removeFragment = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? uri : uri.substr(0, hashIndex);
};
goog.uri.utils.haveSameDomain = function(uri1, uri2) {
  var pieces1 = goog.uri.utils.split(uri1);
  var pieces2 = goog.uri.utils.split(uri2);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.SCHEME] == pieces2[goog.uri.utils.ComponentIndex.SCHEME] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(uri) {
  if (goog.DEBUG && (uri.indexOf("#") >= 0 || uri.indexOf("?") >= 0)) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not " + "supported: [" + uri + "]");
  }
};
goog.uri.utils.QueryValue;
goog.uri.utils.QueryArray;
goog.uri.utils.parseQueryData = function(encodedQuery, callback) {
  if (!encodedQuery) {
    return;
  }
  var pairs = encodedQuery.split("&");
  for (var i = 0;i < pairs.length;i++) {
    var indexOfEquals = pairs[i].indexOf("=");
    var name = null;
    var value = null;
    if (indexOfEquals >= 0) {
      name = pairs[i].substring(0, indexOfEquals);
      value = pairs[i].substring(indexOfEquals + 1);
    } else {
      name = pairs[i];
    }
    callback(name, value ? goog.string.urlDecode(value) : "");
  }
};
goog.uri.utils.appendQueryData_ = function(buffer) {
  if (buffer[1]) {
    var baseUri = (buffer[0]);
    var hashIndex = baseUri.indexOf("#");
    if (hashIndex >= 0) {
      buffer.push(baseUri.substr(hashIndex));
      buffer[0] = baseUri = baseUri.substr(0, hashIndex);
    }
    var questionIndex = baseUri.indexOf("?");
    if (questionIndex < 0) {
      buffer[1] = "?";
    } else {
      if (questionIndex == baseUri.length - 1) {
        buffer[1] = undefined;
      }
    }
  }
  return buffer.join("");
};
goog.uri.utils.appendKeyValuePairs_ = function(key, value, pairs) {
  if (goog.isArray(value)) {
    goog.asserts.assertArray(value);
    for (var j = 0;j < value.length;j++) {
      goog.uri.utils.appendKeyValuePairs_(key, String(value[j]), pairs);
    }
  } else {
    if (value != null) {
      pairs.push("&", key, value === "" ? "" : "=", goog.string.urlEncode(value));
    }
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(buffer, keysAndValues, opt_startIndex) {
  goog.asserts.assert(Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2 == 0, "goog.uri.utils: Key/value lists must be even in length.");
  for (var i = opt_startIndex || 0;i < keysAndValues.length;i += 2) {
    goog.uri.utils.appendKeyValuePairs_(keysAndValues[i], keysAndValues[i + 1], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryData = function(keysAndValues, opt_startIndex) {
  var buffer = goog.uri.utils.buildQueryDataBuffer_([], keysAndValues, opt_startIndex);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(buffer, map) {
  for (var key in map) {
    goog.uri.utils.appendKeyValuePairs_(key, map[key], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryDataFromMap = function(map) {
  var buffer = goog.uri.utils.buildQueryDataBufferFromMap_([], map);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.appendParams = function(uri, var_args) {
  return goog.uri.utils.appendQueryData_(arguments.length == 2 ? goog.uri.utils.buildQueryDataBuffer_([uri], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([uri], arguments, 1));
};
goog.uri.utils.appendParamsFromMap = function(uri, map) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([uri], map));
};
goog.uri.utils.appendParam = function(uri, key, opt_value) {
  var paramArr = [uri, "&", key];
  if (goog.isDefAndNotNull(opt_value)) {
    paramArr.push("=", goog.string.urlEncode(opt_value));
  }
  return goog.uri.utils.appendQueryData_(paramArr);
};
goog.uri.utils.findParam_ = function(uri, startIndex, keyEncoded, hashOrEndIndex) {
  var index = startIndex;
  var keyLength = keyEncoded.length;
  while ((index = uri.indexOf(keyEncoded, index)) >= 0 && index < hashOrEndIndex) {
    var precedingChar = uri.charCodeAt(index - 1);
    if (precedingChar == goog.uri.utils.CharCode_.AMPERSAND || precedingChar == goog.uri.utils.CharCode_.QUESTION) {
      var followingChar = uri.charCodeAt(index + keyLength);
      if (!followingChar || followingChar == goog.uri.utils.CharCode_.EQUAL || followingChar == goog.uri.utils.CharCode_.AMPERSAND || followingChar == goog.uri.utils.CharCode_.HASH) {
        return index;
      }
    }
    index += keyLength + 1;
  }
  return -1;
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(uri, keyEncoded) {
  return goog.uri.utils.findParam_(uri, 0, keyEncoded, uri.search(goog.uri.utils.hashOrEndRe_)) >= 0;
};
goog.uri.utils.getParamValue = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var foundIndex = goog.uri.utils.findParam_(uri, 0, keyEncoded, hashOrEndIndex);
  if (foundIndex < 0) {
    return null;
  } else {
    var endPosition = uri.indexOf("&", foundIndex);
    if (endPosition < 0 || endPosition > hashOrEndIndex) {
      endPosition = hashOrEndIndex;
    }
    foundIndex += keyEncoded.length + 1;
    return goog.string.urlDecode(uri.substr(foundIndex, endPosition - foundIndex));
  }
};
goog.uri.utils.getParamValues = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var result = [];
  while ((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    position = uri.indexOf("&", foundIndex);
    if (position < 0 || position > hashOrEndIndex) {
      position = hashOrEndIndex;
    }
    foundIndex += keyEncoded.length + 1;
    result.push(goog.string.urlDecode(uri.substr(foundIndex, position - foundIndex)));
  }
  return result;
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var buffer = [];
  while ((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    buffer.push(uri.substring(position, foundIndex));
    position = Math.min(uri.indexOf("&", foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex);
  }
  buffer.push(uri.substr(position));
  return buffer.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1");
};
goog.uri.utils.setParam = function(uri, keyEncoded, value) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value);
};
goog.uri.utils.appendPath = function(baseUri, path) {
  goog.uri.utils.assertNoFragmentsOrQueries_(baseUri);
  if (goog.string.endsWith(baseUri, "/")) {
    baseUri = baseUri.substr(0, baseUri.length - 1);
  }
  if (goog.string.startsWith(path, "/")) {
    path = path.substr(1);
  }
  return goog.string.buildString(baseUri, "/", path);
};
goog.uri.utils.setPath = function(uri, path) {
  if (!goog.string.startsWith(path, "/")) {
    path = "/" + path;
  }
  var parts = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(parts[goog.uri.utils.ComponentIndex.SCHEME], parts[goog.uri.utils.ComponentIndex.USER_INFO], parts[goog.uri.utils.ComponentIndex.DOMAIN], parts[goog.uri.utils.ComponentIndex.PORT], path, parts[goog.uri.utils.ComponentIndex.QUERY_DATA], parts[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(uri) {
  return goog.uri.utils.setParam(uri, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString());
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.define("goog.NATIVE_ARRAY_PROTOTYPES", goog.TRUSTED_SITE);
goog.define("goog.array.ASSUME_NATIVE_FUNCTIONS", false);
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return -1;
    }
    return arr.indexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return Array.prototype.lastIndexOf.call(arr, obj, fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if (fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex);
  }
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return -1;
    }
    return arr.lastIndexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i >= 0;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  Array.prototype.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      f.call((opt_obj), arr2[i], i, arr);
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;--i) {
    if (i in arr2) {
      f.call((opt_obj), arr2[i], i, arr);
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      if (f.call((opt_obj), val, i, arr)) {
        res[resLength++] = val;
      }
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      res[i] = f.call((opt_obj), arr2[i], i, arr);
    }
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return Array.prototype.reduce.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call((opt_obj), rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.asserts.assert(f != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return Array.prototype.reduceRight.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call((opt_obj), rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call((opt_obj), arr2[i], i, arr)) {
      return true;
    }
  }
  return false;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && !f.call((opt_obj), arr2[i], i, arr)) {
      return false;
    }
  }
  return true;
};
goog.array.count = function(arr, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr, function(element, index, arr) {
    if (f.call((opt_obj), element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call((opt_obj), arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;i--) {
    if (i in arr2 && f.call((opt_obj), arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;i >= 0;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if (rv = i >= 0) {
    goog.array.removeAt(arr, i);
  }
  return rv;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.splice.call(arr, i, 1).length == 1;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};
goog.array.removeAllIf = function(arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function(val, index) {
    if (f.call((opt_obj), val, index, arr)) {
      if (goog.array.removeAt(arr, index)) {
        removedCount++;
      }
    }
  });
  return removedCount;
};
goog.array.concat = function(var_args) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
goog.array.join = function(var_args) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
goog.array.toArray = function(object) {
  var length = object.length;
  if (length > 0) {
    var rv = new Array(length);
    for (var i = 0;i < length;i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return [];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for (var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    if (goog.isArrayLike(arr2)) {
      var len1 = arr1.length || 0;
      var len2 = arr2.length || 0;
      arr1.length = len1 + len2;
      for (var j = 0;j < len2;j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if (arguments.length <= 2) {
    return Array.prototype.slice.call(arr, start);
  } else {
    return Array.prototype.slice.call(arr, start, opt_end);
  }
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  var returnArray = opt_rv || arr;
  var defaultHashFn = function(item) {
    return goog.isObject(item) ? "o" + goog.getUid(item) : (typeof item).charAt(0) + item;
  };
  var hashFn = opt_hashFn || defaultHashFn;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while (cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = hashFn(current);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while (left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      compareResult = (compareFn)(opt_target, arr[middle]);
    }
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      found = !compareResult;
    }
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for (var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  goog.array.sort(arr, stableCompareFn);
  for (var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value;
  }
};
goog.array.sortByKey = function(arr, keyFn, opt_compareFn) {
  var keyCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return keyCompareFn(keyFn(a), keyFn(b));
  });
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  goog.array.sortByKey(arr, function(obj) {
    return obj[key];
  }, opt_compareFn);
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for (var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }
  return true;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false;
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for (var i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for (var i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (result != 0) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.inverseDefaultCompare = function(a, b) {
  return -goog.array.defaultCompare(a, b);
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true;
  }
  return false;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  var buckets = {};
  for (var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter.call((opt_obj), value, i, array);
    if (goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }
  return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call((opt_obj), element, index, arr)] = element;
  });
  return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [];
  var start = 0;
  var end = startOrEnd;
  var step = opt_step || 1;
  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }
  if (step * (end - start) < 0) {
    return [];
  }
  if (step > 0) {
    for (var i = start;i < end;i += step) {
      array.push(i);
    }
  } else {
    for (var i = start;i > end;i += step) {
      array.push(i);
    }
  }
  return array;
};
goog.array.repeat = function(value, n) {
  var array = [];
  for (var i = 0;i < n;i++) {
    array[i] = value;
  }
  return array;
};
goog.array.flatten = function(var_args) {
  var CHUNK_SIZE = 8192;
  var result = [];
  for (var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if (goog.isArray(element)) {
      for (var c = 0;c < element.length;c += CHUNK_SIZE) {
        var chunk = goog.array.slice(element, c, c + CHUNK_SIZE);
        var recurseResult = goog.array.flatten.apply(null, chunk);
        for (var r = 0;r < recurseResult.length;r++) {
          result.push(recurseResult[r]);
        }
      }
    } else {
      result.push(element);
    }
  }
  return result;
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if (array.length) {
    n %= array.length;
    if (n > 0) {
      Array.prototype.unshift.apply(array, array.splice(-n, n));
    } else {
      if (n < 0) {
        Array.prototype.push.apply(array, array.splice(0, -n));
      }
    }
  }
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
  var removedItems = Array.prototype.splice.call(arr, fromIndex, 1);
  Array.prototype.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return [];
  }
  var result = [];
  var minLen = arguments[0].length;
  for (var i = 1;i < arguments.length;i++) {
    if (arguments[i].length < minLen) {
      minLen = arguments[i].length;
    }
  }
  for (var i = 0;i < minLen;i++) {
    var value = [];
    for (var j = 0;j < arguments.length;j++) {
      value.push(arguments[j][i]);
    }
    result.push(value);
  }
  return result;
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for (var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
goog.array.copyByIndex = function(arr, index_arr) {
  var result = [];
  goog.array.forEach(index_arr, function(index) {
    result.push(arr[index]);
  });
  return result;
};
goog.provide("goog.math");
goog.require("goog.array");
goog.require("goog.asserts");
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
goog.math.modulo = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
};
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 1E-6);
};
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360);
};
goog.math.standardAngleInRadians = function(angle) {
  return goog.math.modulo(angle, 2 * Math.PI);
};
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees * Math.PI / 180;
};
goog.math.toDegrees = function(angleRadians) {
  return angleRadians * 180 / Math.PI;
};
goog.math.angleDx = function(degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees));
};
goog.math.angleDy = function(degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees));
};
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
  if (d > 180) {
    d = d - 360;
  } else {
    if (d <= -180) {
      d = 360 + d;
    }
  }
  return d;
};
goog.math.sign = Math.sign || function(x) {
  if (x > 0) {
    return 1;
  }
  if (x < 0) {
    return -1;
  }
  return x;
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  var compare = opt_compareFn || function(a, b) {
    return a == b;
  };
  var collect = opt_collectorFn || function(i1, i2) {
    return array1[i1];
  };
  var length1 = array1.length;
  var length2 = array2.length;
  var arr = [];
  for (var i = 0;i < length1 + 1;i++) {
    arr[i] = [];
    arr[i][0] = 0;
  }
  for (var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0;
  }
  for (i = 1;i <= length1;i++) {
    for (j = 1;j <= length2;j++) {
      if (compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
      }
    }
  }
  var result = [];
  var i = length1, j = length2;
  while (i > 0 && j > 0) {
    if (compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--;
    } else {
      if (arr[i - 1][j] > arr[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
  }
  return result;
};
goog.math.sum = function(var_args) {
  return (goog.array.reduce(arguments, function(sum, value) {
    return sum + value;
  }, 0));
};
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(var_args) {
  var sampleSize = arguments.length;
  if (sampleSize < 2) {
    return 0;
  }
  var mean = goog.math.average.apply(null, arguments);
  var variance = goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
    return Math.pow(val - mean, 2);
  })) / (sampleSize - 1);
  return variance;
};
goog.math.standardDeviation = function(var_args) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(num) {
  return isFinite(num) && num % 1 == 0;
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num);
};
goog.math.isNegativeZero = function(num) {
  return num == 0 && 1 / num < 0;
};
goog.math.log10Floor = function(num) {
  if (num > 0) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (parseFloat("1e" + x) > num ? 1 : 0);
  }
  return num == 0 ? -Infinity : NaN;
};
goog.math.safeFloor = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.floor(num + (opt_epsilon || 2E-15));
};
goog.math.safeCeil = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.ceil(num - (opt_epsilon || 2E-15));
};
goog.provide("goog.math.Coordinate");
goog.require("goog.math");
goog.math.Coordinate = function(opt_x, opt_y) {
  this.x = goog.isDef(opt_x) ? opt_x : 0;
  this.y = goog.isDef(opt_y) ? opt_y : 0;
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y);
};
if (goog.DEBUG) {
  goog.math.Coordinate.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
  };
}
goog.math.Coordinate.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.x == b.x && a.y == b.y;
};
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y);
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx * dx + dy * dy;
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};
goog.math.Coordinate.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.x += tx.x;
    this.y += tx.y;
  } else {
    this.x += tx;
    if (goog.isNumber(opt_ty)) {
      this.y += opt_ty;
    }
  }
  return this;
};
goog.math.Coordinate.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.x *= sx;
  this.y *= sy;
  return this;
};
goog.math.Coordinate.prototype.rotateRadians = function(radians, opt_center) {
  var center = opt_center || new goog.math.Coordinate(0, 0);
  var x = this.x;
  var y = this.y;
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);
  this.x = (x - center.x) * cos - (y - center.y) * sin + center.x;
  this.y = (x - center.x) * sin + (y - center.y) * cos + center.y;
};
goog.math.Coordinate.prototype.rotateDegrees = function(degrees, opt_center) {
  this.rotateRadians(goog.math.toRadians(degrees), opt_center);
};
goog.provide("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.math.Box = function(top, right, bottom, left) {
  this.top = top;
  this.right = right;
  this.bottom = bottom;
  this.left = left;
};
goog.math.Box.boundingBox = function(var_args) {
  var box = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x);
  for (var i = 1;i < arguments.length;i++) {
    box.expandToIncludeCoordinate(arguments[i]);
  }
  return box;
};
goog.math.Box.prototype.getWidth = function() {
  return this.right - this.left;
};
goog.math.Box.prototype.getHeight = function() {
  return this.bottom - this.top;
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left);
};
if (goog.DEBUG) {
  goog.math.Box.prototype.toString = function() {
    return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)";
  };
}
goog.math.Box.prototype.contains = function(other) {
  return goog.math.Box.contains(this, other);
};
goog.math.Box.prototype.expand = function(top, opt_right, opt_bottom, opt_left) {
  if (goog.isObject(top)) {
    this.top -= top.top;
    this.right += top.right;
    this.bottom += top.bottom;
    this.left -= top.left;
  } else {
    this.top -= top;
    this.right += opt_right;
    this.bottom += opt_bottom;
    this.left -= opt_left;
  }
  return this;
};
goog.math.Box.prototype.expandToInclude = function(box) {
  this.left = Math.min(this.left, box.left);
  this.top = Math.min(this.top, box.top);
  this.right = Math.max(this.right, box.right);
  this.bottom = Math.max(this.bottom, box.bottom);
};
goog.math.Box.prototype.expandToIncludeCoordinate = function(coord) {
  this.top = Math.min(this.top, coord.y);
  this.right = Math.max(this.right, coord.x);
  this.bottom = Math.max(this.bottom, coord.y);
  this.left = Math.min(this.left, coord.x);
};
goog.math.Box.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left;
};
goog.math.Box.contains = function(box, other) {
  if (!box || !other) {
    return false;
  }
  if (other instanceof goog.math.Box) {
    return other.left >= box.left && other.right <= box.right && other.top >= box.top && other.bottom <= box.bottom;
  }
  return other.x >= box.left && other.x <= box.right && other.y >= box.top && other.y <= box.bottom;
};
goog.math.Box.relativePositionX = function(box, coord) {
  if (coord.x < box.left) {
    return coord.x - box.left;
  } else {
    if (coord.x > box.right) {
      return coord.x - box.right;
    }
  }
  return 0;
};
goog.math.Box.relativePositionY = function(box, coord) {
  if (coord.y < box.top) {
    return coord.y - box.top;
  } else {
    if (coord.y > box.bottom) {
      return coord.y - box.bottom;
    }
  }
  return 0;
};
goog.math.Box.distance = function(box, coord) {
  var x = goog.math.Box.relativePositionX(box, coord);
  var y = goog.math.Box.relativePositionY(box, coord);
  return Math.sqrt(x * x + y * y);
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
};
goog.math.Box.intersectsWithPadding = function(a, b, padding) {
  return a.left <= b.right + padding && b.left <= a.right + padding && a.top <= b.bottom + padding && b.top <= a.bottom + padding;
};
goog.math.Box.prototype.ceil = function() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this;
};
goog.math.Box.prototype.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this;
};
goog.math.Box.prototype.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this;
};
goog.math.Box.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.left += tx.x;
    this.right += tx.x;
    this.top += tx.y;
    this.bottom += tx.y;
  } else {
    this.left += tx;
    this.right += tx;
    if (goog.isNumber(opt_ty)) {
      this.top += opt_ty;
      this.bottom += opt_ty;
    }
  }
  return this;
};
goog.math.Box.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left *= sx;
  this.right *= sx;
  this.top *= sy;
  this.bottom *= sy;
  return this;
};
goog.provide("goog.math.Rect");
goog.require("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Size");
goog.math.Rect = function(x, y, w, h) {
  this.left = x;
  this.top = y;
  this.width = w;
  this.height = h;
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height);
};
goog.math.Rect.prototype.toBox = function() {
  var right = this.left + this.width;
  var bottom = this.top + this.height;
  return new goog.math.Box(this.top, right, bottom, this.left);
};
goog.math.Rect.createFromPositionAndSize = function(position, size) {
  return new goog.math.Rect(position.x, position.y, size.width, size.height);
};
goog.math.Rect.createFromBox = function(box) {
  return new goog.math.Rect(box.left, box.top, box.right - box.left, box.bottom - box.top);
};
if (goog.DEBUG) {
  goog.math.Rect.prototype.toString = function() {
    return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)";
  };
}
goog.math.Rect.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height;
};
goog.math.Rect.prototype.intersection = function(rect) {
  var x0 = Math.max(this.left, rect.left);
  var x1 = Math.min(this.left + this.width, rect.left + rect.width);
  if (x0 <= x1) {
    var y0 = Math.max(this.top, rect.top);
    var y1 = Math.min(this.top + this.height, rect.top + rect.height);
    if (y0 <= y1) {
      this.left = x0;
      this.top = y0;
      this.width = x1 - x0;
      this.height = y1 - y0;
      return true;
    }
  }
  return false;
};
goog.math.Rect.intersection = function(a, b) {
  var x0 = Math.max(a.left, b.left);
  var x1 = Math.min(a.left + a.width, b.left + b.width);
  if (x0 <= x1) {
    var y0 = Math.max(a.top, b.top);
    var y1 = Math.min(a.top + a.height, b.top + b.height);
    if (y0 <= y1) {
      return new goog.math.Rect(x0, y0, x1 - x0, y1 - y0);
    }
  }
  return null;
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height;
};
goog.math.Rect.prototype.intersects = function(rect) {
  return goog.math.Rect.intersects(this, rect);
};
goog.math.Rect.difference = function(a, b) {
  var intersection = goog.math.Rect.intersection(a, b);
  if (!intersection || !intersection.height || !intersection.width) {
    return [a.clone()];
  }
  var result = [];
  var top = a.top;
  var height = a.height;
  var ar = a.left + a.width;
  var ab = a.top + a.height;
  var br = b.left + b.width;
  var bb = b.top + b.height;
  if (b.top > a.top) {
    result.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top));
    top = b.top;
    height -= b.top - a.top;
  }
  if (bb < ab) {
    result.push(new goog.math.Rect(a.left, bb, a.width, ab - bb));
    height = bb - top;
  }
  if (b.left > a.left) {
    result.push(new goog.math.Rect(a.left, top, b.left - a.left, height));
  }
  if (br < ar) {
    result.push(new goog.math.Rect(br, top, ar - br, height));
  }
  return result;
};
goog.math.Rect.prototype.difference = function(rect) {
  return goog.math.Rect.difference(this, rect);
};
goog.math.Rect.prototype.boundingRect = function(rect) {
  var right = Math.max(this.left + this.width, rect.left + rect.width);
  var bottom = Math.max(this.top + this.height, rect.top + rect.height);
  this.left = Math.min(this.left, rect.left);
  this.top = Math.min(this.top, rect.top);
  this.width = right - this.left;
  this.height = bottom - this.top;
};
goog.math.Rect.boundingRect = function(a, b) {
  if (!a || !b) {
    return null;
  }
  var clone = a.clone();
  clone.boundingRect(b);
  return clone;
};
goog.math.Rect.prototype.contains = function(another) {
  if (another instanceof goog.math.Rect) {
    return this.left <= another.left && this.left + this.width >= another.left + another.width && this.top <= another.top && this.top + this.height >= another.top + another.height;
  } else {
    return another.x >= this.left && another.x <= this.left + this.width && another.y >= this.top && another.y <= this.top + this.height;
  }
};
goog.math.Rect.prototype.squaredDistance = function(point) {
  var dx = point.x < this.left ? this.left - point.x : Math.max(point.x - (this.left + this.width), 0);
  var dy = point.y < this.top ? this.top - point.y : Math.max(point.y - (this.top + this.height), 0);
  return dx * dx + dy * dy;
};
goog.math.Rect.prototype.distance = function(point) {
  return Math.sqrt(this.squaredDistance(point));
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height);
};
goog.math.Rect.prototype.getTopLeft = function() {
  return new goog.math.Coordinate(this.left, this.top);
};
goog.math.Rect.prototype.getCenter = function() {
  return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2);
};
goog.math.Rect.prototype.getBottomRight = function() {
  return new goog.math.Coordinate(this.left + this.width, this.top + this.height);
};
goog.math.Rect.prototype.ceil = function() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Rect.prototype.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Rect.prototype.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Rect.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.left += tx.x;
    this.top += tx.y;
  } else {
    this.left += tx;
    if (goog.isNumber(opt_ty)) {
      this.top += opt_ty;
    }
  }
  return this;
};
goog.math.Rect.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left *= sx;
  this.width *= sx;
  this.top *= sy;
  this.height *= sy;
  return this;
};
goog.provide("goog.html.SafeStyle");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeStyle = function() {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
  this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyle.prototype.implementsGoogStringTypedString = true;
goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyle.fromConstant = function(style) {
  var styleString = goog.string.Const.unwrap(style);
  if (styleString.length === 0) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(styleString);
  goog.asserts.assert(goog.string.endsWith(styleString, ";"), "Last character of style string is not ';': " + styleString);
  goog.asserts.assert(goog.string.contains(styleString, ":"), "Style string must contain at least one ':', to " + 'specify a "name: value" pair: ' + styleString);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(styleString);
};
goog.html.SafeStyle.checkStyle_ = function(style) {
  goog.asserts.assert(!/[<>]/.test(style), "Forbidden characters in style string: " + style);
};
goog.html.SafeStyle.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleWrappedValue_;
};
if (goog.DEBUG) {
  goog.html.SafeStyle.prototype.toString = function() {
    return "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}";
  };
}
goog.html.SafeStyle.unwrap = function(safeStyle) {
  if (safeStyle instanceof goog.html.SafeStyle && safeStyle.constructor === goog.html.SafeStyle && safeStyle.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeStyle.privateDoNotAccessOrElseSafeStyleWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeStyle, got '" + safeStyle + "'");
    return "type_error:SafeStyle";
  }
};
goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function(style) {
  return (new goog.html.SafeStyle).initSecurityPrivateDoNotAccessOrElse_(style);
};
goog.html.SafeStyle.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(style) {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = style;
  return this;
};
goog.html.SafeStyle.EMPTY = goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse("");
goog.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
goog.html.SafeStyle.PropertyMap;
goog.html.SafeStyle.create = function(map) {
  var style = "";
  for (var name in map) {
    if (!/^[-_a-zA-Z0-9]+$/.test(name)) {
      throw Error("Name allows only [-_a-zA-Z0-9], got: " + name);
    }
    var value = map[name];
    if (value == null) {
      continue;
    }
    if (value instanceof goog.string.Const) {
      value = goog.string.Const.unwrap(value);
      goog.asserts.assert(!/[{;}]/.test(value), "Value does not allow [{;}].");
    } else {
      if (!goog.html.SafeStyle.VALUE_RE_.test(value)) {
        goog.asserts.fail("String value allows only [-,.\"'%_!# a-zA-Z0-9], got: " + value);
        value = goog.html.SafeStyle.INNOCUOUS_STRING;
      } else {
        if (!goog.html.SafeStyle.hasBalancedQuotes_(value)) {
          goog.asserts.fail("String value requires balanced quotes, got: " + value);
          value = goog.html.SafeStyle.INNOCUOUS_STRING;
        }
      }
    }
    style += name + ":" + value + ";";
  }
  if (!style) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(style);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style);
};
goog.html.SafeStyle.hasBalancedQuotes_ = function(value) {
  var outsideSingle = true;
  var outsideDouble = true;
  for (var i = 0;i < value.length;i++) {
    var c = value.charAt(i);
    if (c == "'" && outsideDouble) {
      outsideSingle = !outsideSingle;
    } else {
      if (c == '"' && outsideSingle) {
        outsideDouble = !outsideDouble;
      }
    }
  }
  return outsideSingle && outsideDouble;
};
goog.html.SafeStyle.VALUE_RE_ = /^[-,."'%_!# a-zA-Z0-9]+$/;
goog.html.SafeStyle.concat = function(var_args) {
  var style = "";
  var addArgument = function(argument) {
    if (goog.isArray(argument)) {
      goog.array.forEach(argument, addArgument);
    } else {
      style += goog.html.SafeStyle.unwrap(argument);
    }
  };
  goog.array.forEach(arguments, addArgument);
  if (!style) {
    return goog.html.SafeStyle.EMPTY;
  }
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style);
};
goog.provide("goog.html.SafeStyleSheet");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeStyleSheet = function() {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = "";
  this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyleSheet.prototype.implementsGoogStringTypedString = true;
goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyleSheet.concat = function(var_args) {
  var result = "";
  var addArgument = function(argument) {
    if (goog.isArray(argument)) {
      goog.array.forEach(argument, addArgument);
    } else {
      result += goog.html.SafeStyleSheet.unwrap(argument);
    }
  };
  goog.array.forEach(arguments, addArgument);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(result);
};
goog.html.SafeStyleSheet.fromConstant = function(styleSheet) {
  var styleSheetString = goog.string.Const.unwrap(styleSheet);
  if (styleSheetString.length === 0) {
    return goog.html.SafeStyleSheet.EMPTY;
  }
  goog.asserts.assert(!goog.string.contains(styleSheetString, "<"), "Forbidden '<' character in style sheet string: " + styleSheetString);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheetString);
};
goog.html.SafeStyleSheet.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
};
if (goog.DEBUG) {
  goog.html.SafeStyleSheet.prototype.toString = function() {
    return "SafeStyleSheet{" + this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ + "}";
  };
}
goog.html.SafeStyleSheet.unwrap = function(safeStyleSheet) {
  if (safeStyleSheet instanceof goog.html.SafeStyleSheet && safeStyleSheet.constructor === goog.html.SafeStyleSheet && safeStyleSheet.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeStyleSheet.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeStyleSheet, got '" + safeStyleSheet + "'");
    return "type_error:SafeStyleSheet";
  }
};
goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse = function(styleSheet) {
  return (new goog.html.SafeStyleSheet).initSecurityPrivateDoNotAccessOrElse_(styleSheet);
};
goog.html.SafeStyleSheet.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(styleSheet) {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = styleSheet;
  return this;
};
goog.html.SafeStyleSheet.EMPTY = goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse("");
goog.provide("goog.html.SafeHtml");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom.TagName");
goog.require("goog.dom.tags");
goog.require("goog.html.SafeStyle");
goog.require("goog.html.SafeStyleSheet");
goog.require("goog.html.SafeUrl");
goog.require("goog.html.TrustedResourceUrl");
goog.require("goog.i18n.bidi.Dir");
goog.require("goog.i18n.bidi.DirectionalString");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeHtml = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
  this.dir_ = null;
};
goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = true;
goog.html.SafeHtml.prototype.getDirection = function() {
  return this.dir_;
};
goog.html.SafeHtml.prototype.implementsGoogStringTypedString = true;
goog.html.SafeHtml.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
if (goog.DEBUG) {
  goog.html.SafeHtml.prototype.toString = function() {
    return "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
  };
}
goog.html.SafeHtml.unwrap = function(safeHtml) {
  if (safeHtml instanceof goog.html.SafeHtml && safeHtml.constructor === goog.html.SafeHtml && safeHtml.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeHtml.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeHtml, got '" + safeHtml + "'");
    return "type_error:SafeHtml";
  }
};
goog.html.SafeHtml.TextOrHtml_;
goog.html.SafeHtml.htmlEscape = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var dir = null;
  if (textOrHtml.implementsGoogI18nBidiDirectionalString) {
    dir = textOrHtml.getDirection();
  }
  var textAsString;
  if (textOrHtml.implementsGoogStringTypedString) {
    textAsString = textOrHtml.getTypedStringValue();
  } else {
    textAsString = String(textOrHtml);
  }
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.htmlEscape(textAsString), dir);
};
goog.html.SafeHtml.htmlEscapePreservingNewlines = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var html = goog.html.SafeHtml.htmlEscape(textOrHtml);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.newLineToBr(goog.html.SafeHtml.unwrap(html)), html.getDirection());
};
goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var html = goog.html.SafeHtml.htmlEscape(textOrHtml);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.whitespaceEscape(goog.html.SafeHtml.unwrap(html)), html.getDirection());
};
goog.html.SafeHtml.from = goog.html.SafeHtml.htmlEscape;
goog.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
goog.html.SafeHtml.URL_ATTRIBUTES_ = goog.object.createSet("action", "cite", "data", "formaction", "href", "manifest", "poster", "src");
goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = goog.object.createSet(goog.dom.TagName.EMBED, goog.dom.TagName.IFRAME, goog.dom.TagName.LINK, goog.dom.TagName.OBJECT, goog.dom.TagName.SCRIPT, goog.dom.TagName.STYLE, goog.dom.TagName.TEMPLATE);
goog.html.SafeHtml.AttributeValue_;
goog.html.SafeHtml.create = function(tagName, opt_attributes, opt_content) {
  if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(tagName)) {
    throw Error("Invalid tag name <" + tagName + ">.");
  }
  if (tagName.toUpperCase() in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) {
    throw Error("Tag name <" + tagName + "> is not allowed for SafeHtml.");
  }
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(tagName, opt_attributes, opt_content);
};
goog.html.SafeHtml.createIframe = function(opt_src, opt_srcdoc, opt_attributes, opt_content) {
  var fixedAttributes = {};
  fixedAttributes["src"] = opt_src || null;
  fixedAttributes["srcdoc"] = opt_srcdoc || null;
  var defaultAttributes = {"sandbox":""};
  var attributes = goog.html.SafeHtml.combineAttributes(fixedAttributes, defaultAttributes, opt_attributes);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", attributes, opt_content);
};
goog.html.SafeHtml.createStyle = function(styleSheet, opt_attributes) {
  var fixedAttributes = {"type":"text/css"};
  var defaultAttributes = {};
  var attributes = goog.html.SafeHtml.combineAttributes(fixedAttributes, defaultAttributes, opt_attributes);
  var content = "";
  styleSheet = goog.array.concat(styleSheet);
  for (var i = 0;i < styleSheet.length;i++) {
    content += goog.html.SafeStyleSheet.unwrap(styleSheet[i]);
  }
  var htmlContent = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(content, goog.i18n.bidi.Dir.NEUTRAL);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style", attributes, htmlContent);
};
goog.html.SafeHtml.getAttrNameAndValue_ = function(tagName, name, value) {
  if (value instanceof goog.string.Const) {
    value = goog.string.Const.unwrap(value);
  } else {
    if (name.toLowerCase() == "style") {
      value = goog.html.SafeHtml.getStyleValue_(value);
    } else {
      if (/^on/i.test(name)) {
        throw Error('Attribute "' + name + '" requires goog.string.Const value, "' + value + '" given.');
      } else {
        if (name.toLowerCase() in goog.html.SafeHtml.URL_ATTRIBUTES_) {
          if (value instanceof goog.html.TrustedResourceUrl) {
            value = goog.html.TrustedResourceUrl.unwrap(value);
          } else {
            if (value instanceof goog.html.SafeUrl) {
              value = goog.html.SafeUrl.unwrap(value);
            } else {
              if (goog.isString(value)) {
                value = goog.html.SafeUrl.sanitize(value).getTypedStringValue();
              } else {
                throw Error('Attribute "' + name + '" on tag "' + tagName + '" requires goog.html.SafeUrl, goog.string.Const, or string,' + ' value "' + value + '" given.');
              }
            }
          }
        }
      }
    }
  }
  if (value.implementsGoogStringTypedString) {
    value = value.getTypedStringValue();
  }
  goog.asserts.assert(goog.isString(value) || goog.isNumber(value), "String or number value expected, got " + typeof value + " with value: " + value);
  return name + '="' + goog.string.htmlEscape(String(value)) + '"';
};
goog.html.SafeHtml.getStyleValue_ = function(value) {
  if (!goog.isObject(value)) {
    throw Error('The "style" attribute requires goog.html.SafeStyle or map ' + "of style properties, " + typeof value + " given: " + value);
  }
  if (!(value instanceof goog.html.SafeStyle)) {
    value = goog.html.SafeStyle.create(value);
  }
  return goog.html.SafeStyle.unwrap(value);
};
goog.html.SafeHtml.createWithDir = function(dir, tagName, opt_attributes, opt_content) {
  var html = goog.html.SafeHtml.create(tagName, opt_attributes, opt_content);
  html.dir_ = dir;
  return html;
};
goog.html.SafeHtml.concat = function(var_args) {
  var dir = goog.i18n.bidi.Dir.NEUTRAL;
  var content = "";
  var addArgument = function(argument) {
    if (goog.isArray(argument)) {
      goog.array.forEach(argument, addArgument);
    } else {
      var html = goog.html.SafeHtml.htmlEscape(argument);
      content += goog.html.SafeHtml.unwrap(html);
      var htmlDir = html.getDirection();
      if (dir == goog.i18n.bidi.Dir.NEUTRAL) {
        dir = htmlDir;
      } else {
        if (htmlDir != goog.i18n.bidi.Dir.NEUTRAL && dir != htmlDir) {
          dir = null;
        }
      }
    }
  };
  goog.array.forEach(arguments, addArgument);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(content, dir);
};
goog.html.SafeHtml.concatWithDir = function(dir, var_args) {
  var html = goog.html.SafeHtml.concat(goog.array.slice(arguments, 1));
  html.dir_ = dir;
  return html;
};
goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function(html, dir) {
  return (new goog.html.SafeHtml).initSecurityPrivateDoNotAccessOrElse_(html, dir);
};
goog.html.SafeHtml.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(html, dir) {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = html;
  this.dir_ = dir;
  return this;
};
goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function(tagName, opt_attributes, opt_content) {
  var dir = null;
  var result = "<" + tagName;
  if (opt_attributes) {
    for (var name in opt_attributes) {
      if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(name)) {
        throw Error('Invalid attribute name "' + name + '".');
      }
      var value = opt_attributes[name];
      if (!goog.isDefAndNotNull(value)) {
        continue;
      }
      result += " " + goog.html.SafeHtml.getAttrNameAndValue_(tagName, name, value);
    }
  }
  var content = opt_content;
  if (!goog.isDefAndNotNull(content)) {
    content = [];
  } else {
    if (!goog.isArray(content)) {
      content = [content];
    }
  }
  if (goog.dom.tags.isVoidTag(tagName.toLowerCase())) {
    goog.asserts.assert(!content.length, "Void tag <" + tagName + "> does not allow content.");
    result += ">";
  } else {
    var html = goog.html.SafeHtml.concat(content);
    result += ">" + goog.html.SafeHtml.unwrap(html) + "</" + tagName + ">";
    dir = html.getDirection();
  }
  var dirAttribute = opt_attributes && opt_attributes["dir"];
  if (dirAttribute) {
    if (/^(ltr|rtl|auto)$/i.test(dirAttribute)) {
      dir = goog.i18n.bidi.Dir.NEUTRAL;
    } else {
      dir = null;
    }
  }
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(result, dir);
};
goog.html.SafeHtml.combineAttributes = function(fixedAttributes, defaultAttributes, opt_attributes) {
  var combinedAttributes = {};
  var name;
  for (name in fixedAttributes) {
    goog.asserts.assert(name.toLowerCase() == name, "Must be lower case");
    combinedAttributes[name] = fixedAttributes[name];
  }
  for (name in defaultAttributes) {
    goog.asserts.assert(name.toLowerCase() == name, "Must be lower case");
    combinedAttributes[name] = defaultAttributes[name];
  }
  for (name in opt_attributes) {
    var nameLower = name.toLowerCase();
    if (nameLower in fixedAttributes) {
      throw Error('Cannot override "' + nameLower + '" attribute, got "' + name + '" with value "' + opt_attributes[name] + '"');
    }
    if (nameLower in defaultAttributes) {
      delete combinedAttributes[nameLower];
    }
    combinedAttributes[name] = opt_attributes[name];
  }
  return combinedAttributes;
};
goog.html.SafeHtml.DOCTYPE_HTML = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<!DOCTYPE html>", goog.i18n.bidi.Dir.NEUTRAL);
goog.html.SafeHtml.EMPTY = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("", goog.i18n.bidi.Dir.NEUTRAL);
goog.provide("goog.html.uncheckedconversions");
goog.require("goog.asserts");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.SafeScript");
goog.require("goog.html.SafeStyle");
goog.require("goog.html.SafeStyleSheet");
goog.require("goog.html.SafeUrl");
goog.require("goog.html.TrustedResourceUrl");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract = function(justification, html, opt_dir) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(html, opt_dir || null);
};
goog.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract = function(justification, script) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmpty(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(script);
};
goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract = function(justification, style) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style);
};
goog.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract = function(justification, styleSheet) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheet);
};
goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract = function(justification, url) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract = function(justification, url) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.provide("goog.html.legacyconversions");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.SafeStyle");
goog.require("goog.html.SafeUrl");
goog.require("goog.html.TrustedResourceUrl");
goog.define("goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS", true);
goog.html.legacyconversions.safeHtmlFromString = function(html) {
  goog.html.legacyconversions.throwIfConversionsDisallowed();
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(html, null);
};
goog.html.legacyconversions.safeStyleFromString = function(style) {
  goog.html.legacyconversions.throwIfConversionsDisallowed();
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style);
};
goog.html.legacyconversions.trustedResourceUrlFromString = function(url) {
  goog.html.legacyconversions.throwIfConversionsDisallowed();
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.legacyconversions.safeUrlFromString = function(url) {
  goog.html.legacyconversions.throwIfConversionsDisallowed();
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.legacyconversions.reportCallback_ = goog.nullFunction;
goog.html.legacyconversions.setReportCallback = function(callback) {
  goog.html.legacyconversions.reportCallback_ = callback;
};
goog.html.legacyconversions.throwIfConversionsDisallowed = function() {
  if (!goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS) {
    throw Error("Error: Legacy conversion from string to goog.html types is disabled");
  }
  goog.html.legacyconversions.reportCallback_();
};
goog.provide("goog.i18n.BidiFormatter");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.legacyconversions");
goog.require("goog.i18n.bidi");
goog.require("goog.i18n.bidi.Dir");
goog.require("goog.i18n.bidi.Format");
goog.i18n.BidiFormatter = function(contextDir, opt_alwaysSpan) {
  this.contextDir_ = goog.i18n.bidi.toDir(contextDir, true);
  this.alwaysSpan_ = !!opt_alwaysSpan;
};
goog.i18n.BidiFormatter.prototype.getContextDir = function() {
  return this.contextDir_;
};
goog.i18n.BidiFormatter.prototype.getAlwaysSpan = function() {
  return this.alwaysSpan_;
};
goog.i18n.BidiFormatter.prototype.setContextDir = function(contextDir) {
  this.contextDir_ = goog.i18n.bidi.toDir(contextDir, true);
};
goog.i18n.BidiFormatter.prototype.setAlwaysSpan = function(alwaysSpan) {
  this.alwaysSpan_ = alwaysSpan;
};
goog.i18n.BidiFormatter.prototype.estimateDirection = goog.i18n.bidi.estimateDirection;
goog.i18n.BidiFormatter.prototype.areDirectionalitiesOpposite_ = function(dir1, dir2) {
  return dir1 * dir2 < 0;
};
goog.i18n.BidiFormatter.prototype.dirResetIfNeeded_ = function(str, dir, opt_isHtml, opt_dirReset) {
  if (opt_dirReset && (this.areDirectionalitiesOpposite_(dir, this.contextDir_) || this.contextDir_ == goog.i18n.bidi.Dir.LTR && goog.i18n.bidi.endsWithRtl(str, opt_isHtml) || this.contextDir_ == goog.i18n.bidi.Dir.RTL && goog.i18n.bidi.endsWithLtr(str, opt_isHtml))) {
    return this.contextDir_ == goog.i18n.bidi.Dir.LTR ? goog.i18n.bidi.Format.LRM : goog.i18n.bidi.Format.RLM;
  } else {
    return "";
  }
};
goog.i18n.BidiFormatter.prototype.dirAttrValue = function(str, opt_isHtml) {
  return this.knownDirAttrValue(this.estimateDirection(str, opt_isHtml));
};
goog.i18n.BidiFormatter.prototype.knownDirAttrValue = function(dir) {
  var resolvedDir = dir == goog.i18n.bidi.Dir.NEUTRAL ? this.contextDir_ : dir;
  return resolvedDir == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr";
};
goog.i18n.BidiFormatter.prototype.dirAttr = function(str, opt_isHtml) {
  return this.knownDirAttr(this.estimateDirection(str, opt_isHtml));
};
goog.i18n.BidiFormatter.prototype.knownDirAttr = function(dir) {
  if (dir != this.contextDir_) {
    return dir == goog.i18n.bidi.Dir.RTL ? 'dir="rtl"' : dir == goog.i18n.bidi.Dir.LTR ? 'dir="ltr"' : "";
  }
  return "";
};
goog.i18n.BidiFormatter.prototype.spanWrapSafeHtml = function(html, opt_dirReset) {
  return this.spanWrapSafeHtmlWithKnownDir(null, html, opt_dirReset);
};
goog.i18n.BidiFormatter.prototype.spanWrap = function(str, opt_isHtml, opt_dirReset) {
  return this.spanWrapWithKnownDir(null, str, opt_isHtml, opt_dirReset);
};
goog.i18n.BidiFormatter.prototype.spanWrapSafeHtmlWithKnownDir = function(dir, html, opt_dirReset) {
  if (dir == null) {
    dir = this.estimateDirection(goog.html.SafeHtml.unwrap(html), true);
  }
  return this.spanWrapWithKnownDir_(dir, html, opt_dirReset);
};
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir = function(dir, str, opt_isHtml, opt_dirReset) {
  var html = opt_isHtml ? goog.html.legacyconversions.safeHtmlFromString(str) : goog.html.SafeHtml.htmlEscape(str);
  return goog.html.SafeHtml.unwrap(this.spanWrapSafeHtmlWithKnownDir(dir, html, opt_dirReset));
};
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir_ = function(dir, html, opt_dirReset) {
  opt_dirReset = opt_dirReset || opt_dirReset == undefined;
  var result;
  var dirCondition = dir != goog.i18n.bidi.Dir.NEUTRAL && dir != this.contextDir_;
  if (this.alwaysSpan_ || dirCondition) {
    var dirAttribute;
    if (dirCondition) {
      dirAttribute = dir == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr";
    }
    result = goog.html.SafeHtml.create("span", {"dir":dirAttribute}, html);
  } else {
    result = html;
  }
  var str = goog.html.SafeHtml.unwrap(html);
  result = goog.html.SafeHtml.concatWithDir(goog.i18n.bidi.Dir.NEUTRAL, result, this.dirResetIfNeeded_(str, dir, true, opt_dirReset));
  return result;
};
goog.i18n.BidiFormatter.prototype.unicodeWrap = function(str, opt_isHtml, opt_dirReset) {
  return this.unicodeWrapWithKnownDir(null, str, opt_isHtml, opt_dirReset);
};
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir = function(dir, str, opt_isHtml, opt_dirReset) {
  if (dir == null) {
    dir = this.estimateDirection(str, opt_isHtml);
  }
  return this.unicodeWrapWithKnownDir_(dir, str, opt_isHtml, opt_dirReset);
};
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir_ = function(dir, str, opt_isHtml, opt_dirReset) {
  opt_dirReset = opt_dirReset || opt_dirReset == undefined;
  var result = [];
  if (dir != goog.i18n.bidi.Dir.NEUTRAL && dir != this.contextDir_) {
    result.push(dir == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.Format.RLE : goog.i18n.bidi.Format.LRE);
    result.push(str);
    result.push(goog.i18n.bidi.Format.PDF);
  } else {
    result.push(str);
  }
  result.push(this.dirResetIfNeeded_(str, dir, opt_isHtml, opt_dirReset));
  return result.join("");
};
goog.i18n.BidiFormatter.prototype.markAfter = function(str, opt_isHtml) {
  return this.markAfterKnownDir(null, str, opt_isHtml);
};
goog.i18n.BidiFormatter.prototype.markAfterKnownDir = function(dir, str, opt_isHtml) {
  if (dir == null) {
    dir = this.estimateDirection(str, opt_isHtml);
  }
  return this.dirResetIfNeeded_(str, dir, opt_isHtml, true);
};
goog.i18n.BidiFormatter.prototype.mark = function() {
  switch(this.contextDir_) {
    case goog.i18n.bidi.Dir.LTR:
      return goog.i18n.bidi.Format.LRM;
    case goog.i18n.bidi.Dir.RTL:
      return goog.i18n.bidi.Format.RLM;
    default:
      return "";
  }
};
goog.i18n.BidiFormatter.prototype.startEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
};
goog.i18n.BidiFormatter.prototype.endEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
};
goog.provide("goog.labs.userAgent.browser");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.object");
goog.require("goog.string");
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchEdge_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Edge");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.matchEdge_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"));
};
goog.labs.userAgent.browser.matchCoast_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Coast");
};
goog.labs.userAgent.browser.matchIosWebview_ = function() {
  return (goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return (goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchOpera_() && !goog.labs.userAgent.browser.matchEdge_();
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk());
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isEdge = goog.labs.userAgent.browser.matchEdge_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_;
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(userAgentString);
  }
  var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
  var versionMap = {};
  goog.array.forEach(versionTuples, function(tuple) {
    var key = tuple[0];
    var value = tuple[1];
    versionMap[key] = value;
  });
  var versionMapHasKey = goog.partial(goog.object.containsKey, versionMap);
  function lookUpValueWithKeys(keys) {
    var key = goog.array.find(keys, versionMapHasKey);
    return versionMap[key] || "";
  }
  if (goog.labs.userAgent.browser.isOpera()) {
    return lookUpValueWithKeys(["Version", "Opera", "OPR"]);
  }
  if (goog.labs.userAgent.browser.isEdge()) {
    return lookUpValueWithKeys(["Edge"]);
  }
  if (goog.labs.userAgent.browser.isChrome()) {
    return lookUpValueWithKeys(["Chrome", "CriOS"]);
  }
  var tuple = versionTuples[2];
  return tuple && tuple[1] || "";
};
goog.labs.userAgent.browser.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version) >= 0;
};
goog.labs.userAgent.browser.getIEVersion_ = function(userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  var version = "";
  var msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if (msie[1] == "7.0") {
      if (tridentVersion && tridentVersion[1]) {
        switch(tridentVersion[1]) {
          case "4.0":
            version = "8.0";
            break;
          case "5.0":
            version = "9.0";
            break;
          case "6.0":
            version = "10.0";
            break;
          case "7.0":
            version = "11.0";
            break;
        }
      } else {
        version = "7.0";
      }
    } else {
      version = msie[1];
    }
  }
  return version;
};
goog.provide("goog.labs.userAgent.engine");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isEdge = function() {
  return goog.labs.userAgent.util.matchUserAgent("Edge");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !goog.labs.userAgent.engine.isEdge();
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident() && !goog.labs.userAgent.engine.isEdge();
};
goog.labs.userAgent.engine.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (userAgentString) {
    var tuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
    var engineTuple = goog.labs.userAgent.engine.getEngineTuple_(tuples);
    if (engineTuple) {
      if (engineTuple[0] == "Gecko") {
        return goog.labs.userAgent.engine.getVersionForKey_(tuples, "Firefox");
      }
      return engineTuple[1];
    }
    var browserTuple = tuples[0];
    var info;
    if (browserTuple && (info = browserTuple[2])) {
      var match = /Trident\/([^\s;]+)/.exec(info);
      if (match) {
        return match[1];
      }
    }
  }
  return "";
};
goog.labs.userAgent.engine.getEngineTuple_ = function(tuples) {
  if (!goog.labs.userAgent.engine.isEdge()) {
    return tuples[1];
  }
  for (var i = 0;i < tuples.length;i++) {
    var tuple = tuples[i];
    if (tuple[0] == "Edge") {
      return tuple;
    }
  }
};
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version) >= 0;
};
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
  var pair = goog.array.find(tuples, function(pair) {
    return key == pair[0];
  });
  return pair && pair[1] || "";
};
goog.provide("goog.userAgent");
goog.require("goog.labs.userAgent.browser");
goog.require("goog.labs.userAgent.engine");
goog.require("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.define("goog.userAgent.ASSUME_IE", false);
goog.define("goog.userAgent.ASSUME_EDGE", false);
goog.define("goog.userAgent.ASSUME_GECKO", false);
goog.define("goog.userAgent.ASSUME_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_MOBILE_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_OPERA", false);
goog.define("goog.userAgent.ASSUME_ANY_VERSION", false);
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigator = function() {
  return goog.global["navigator"] || null;
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.EDGE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_EDGE : goog.labs.userAgent.engine.isEdge();
goog.userAgent.EDGE_OR_IE = goog.userAgent.EDGE || goog.userAgent.IE;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.define("goog.userAgent.ASSUME_MAC", false);
goog.define("goog.userAgent.ASSUME_WINDOWS", false);
goog.define("goog.userAgent.ASSUME_LINUX", false);
goog.define("goog.userAgent.ASSUME_X11", false);
goog.define("goog.userAgent.ASSUME_ANDROID", false);
goog.define("goog.userAgent.ASSUME_IPHONE", false);
goog.define("goog.userAgent.ASSUME_IPAD", false);
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh();
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows();
goog.userAgent.isLegacyLinux_ = function() {
  return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS();
};
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_();
goog.userAgent.isX11_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return !!navigator && goog.string.contains(navigator["appVersion"] || "", "X11");
};
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_();
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid();
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone();
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.operaVersion_ = function() {
  var version = goog.global.opera.version;
  try {
    return version();
  } catch (e) {
    return version;
  }
};
goog.userAgent.determineVersion_ = function() {
  if (goog.userAgent.OPERA && goog.global["opera"]) {
    return goog.userAgent.operaVersion_();
  }
  var version = "";
  var arr = goog.userAgent.getVersionRegexResult_();
  if (arr) {
    version = arr ? arr[1] : "";
  }
  if (goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if (docMode > parseFloat(version)) {
      return String(docMode);
    }
  }
  return version;
};
goog.userAgent.getVersionRegexResult_ = function() {
  var userAgent = goog.userAgent.getUserAgentString();
  if (goog.userAgent.GECKO) {
    return /rv\:([^\);]+)(\)|;)/.exec(userAgent);
  }
  if (goog.userAgent.EDGE) {
    return /Edge\/([\d\.]+)/.exec(userAgent);
  }
  if (goog.userAgent.IE) {
    return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(userAgent);
  }
  if (goog.userAgent.WEBKIT) {
    return /WebKit\/(\S+)/.exec(userAgent);
  }
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global["document"];
  return doc ? doc["documentMode"] : undefined;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[version] || (goog.userAgent.isVersionOrHigherCache_[version] = goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0);
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return goog.userAgent.DOCUMENT_MODE >= documentMode;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var doc = goog.global["document"];
  var mode = goog.userAgent.getDocumentMode_();
  if (!doc || !goog.userAgent.IE) {
    return undefined;
  }
  return mode || (doc["compatMode"] == "CSS1Compat" ? parseInt(goog.userAgent.VERSION, 10) : 5);
}();
goog.provide("goog.events.ListenerMap");
goog.require("goog.array");
goog.require("goog.events.Listener");
goog.require("goog.object");
goog.events.ListenerMap = function(src) {
  this.src = src;
  this.listeners = {};
  this.typeCount_ = 0;
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
  return this.typeCount_;
};
goog.events.ListenerMap.prototype.getListenerCount = function() {
  var count = 0;
  for (var type in this.listeners) {
    count += this.listeners[type].length;
  }
  return count;
};
goog.events.ListenerMap.prototype.add = function(type, listener, callOnce, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  var listenerArray = this.listeners[typeStr];
  if (!listenerArray) {
    listenerArray = this.listeners[typeStr] = [];
    this.typeCount_++;
  }
  var listenerObj;
  var index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    listenerObj = listenerArray[index];
    if (!callOnce) {
      listenerObj.callOnce = false;
    }
  } else {
    listenerObj = new goog.events.Listener(listener, null, this.src, typeStr, !!opt_useCapture, opt_listenerScope);
    listenerObj.callOnce = callOnce;
    listenerArray.push(listenerObj);
  }
  return listenerObj;
};
goog.events.ListenerMap.prototype.remove = function(type, listener, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  if (!(typeStr in this.listeners)) {
    return false;
  }
  var listenerArray = this.listeners[typeStr];
  var index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    var listenerObj = listenerArray[index];
    listenerObj.markAsRemoved();
    goog.array.removeAt(listenerArray, index);
    if (listenerArray.length == 0) {
      delete this.listeners[typeStr];
      this.typeCount_--;
    }
    return true;
  }
  return false;
};
goog.events.ListenerMap.prototype.removeByKey = function(listener) {
  var type = listener.type;
  if (!(type in this.listeners)) {
    return false;
  }
  var removed = goog.array.remove(this.listeners[type], listener);
  if (removed) {
    listener.markAsRemoved();
    if (this.listeners[type].length == 0) {
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return removed;
};
goog.events.ListenerMap.prototype.removeAll = function(opt_type) {
  var typeStr = opt_type && opt_type.toString();
  var count = 0;
  for (var type in this.listeners) {
    if (!typeStr || type == typeStr) {
      var listenerArray = this.listeners[type];
      for (var i = 0;i < listenerArray.length;i++) {
        ++count;
        listenerArray[i].markAsRemoved();
      }
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return count;
};
goog.events.ListenerMap.prototype.getListeners = function(type, capture) {
  var listenerArray = this.listeners[type.toString()];
  var rv = [];
  if (listenerArray) {
    for (var i = 0;i < listenerArray.length;++i) {
      var listenerObj = listenerArray[i];
      if (listenerObj.capture == capture) {
        rv.push(listenerObj);
      }
    }
  }
  return rv;
};
goog.events.ListenerMap.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  var listenerArray = this.listeners[type.toString()];
  var i = -1;
  if (listenerArray) {
    i = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, capture, opt_listenerScope);
  }
  return i > -1 ? listenerArray[i] : null;
};
goog.events.ListenerMap.prototype.hasListener = function(opt_type, opt_capture) {
  var hasType = goog.isDef(opt_type);
  var typeStr = hasType ? opt_type.toString() : "";
  var hasCapture = goog.isDef(opt_capture);
  return goog.object.some(this.listeners, function(listenerArray, type) {
    for (var i = 0;i < listenerArray.length;++i) {
      if ((!hasType || listenerArray[i].type == typeStr) && (!hasCapture || listenerArray[i].capture == opt_capture)) {
        return true;
      }
    }
    return false;
  });
};
goog.events.ListenerMap.findListenerIndex_ = function(listenerArray, listener, opt_useCapture, opt_listenerScope) {
  for (var i = 0;i < listenerArray.length;++i) {
    var listenerObj = listenerArray[i];
    if (!listenerObj.removed && listenerObj.listener == listener && listenerObj.capture == !!opt_useCapture && listenerObj.handler == opt_listenerScope) {
      return i;
    }
  }
  return -1;
};
goog.provide("goog.events.BrowserFeature");
goog.require("goog.userAgent");
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && 
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !!(goog.global["document"] && document.documentElement && "ontouchstart" in document.documentElement) || !!(goog.global["navigator"] && 
goog.global["navigator"]["msMaxTouchPoints"])};
goog.provide("goog.events.EventType");
goog.require("goog.userAgent");
goog.events.getVendorPrefixedName_ = function(eventName) {
  return goog.userAgent.WEBKIT ? "webkit" + eventName : goog.userAgent.OPERA ? "o" + eventName.toLowerCase() : eventName.toLowerCase();
};
goog.events.EventType = {CLICK:"click", RIGHTCLICK:"rightclick", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", SELECTSTART:"selectstart", WHEEL:"wheel", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", 
CHANGE:"change", RESET:"reset", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", 
LOSECAPTURE:"losecapture", ORIENTATIONCHANGE:"orientationchange", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", ANIMATIONSTART:goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND:goog.events.getVendorPrefixedName_("AnimationEnd"), 
ANIMATIONITERATION:goog.events.getVendorPrefixedName_("AnimationIteration"), TRANSITIONEND:goog.events.getVendorPrefixedName_("TransitionEnd"), POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", 
MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXT:"text", 
TEXTINPUT:"textInput", COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", COMPOSITIONEND:"compositionend", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage", DOMSUBTREEMODIFIED:"DOMSubtreeModified", DOMNODEINSERTED:"DOMNodeInserted", DOMNODEREMOVED:"DOMNodeRemoved", 
DOMNODEREMOVEDFROMDOCUMENT:"DOMNodeRemovedFromDocument", DOMNODEINSERTEDINTODOCUMENT:"DOMNodeInsertedIntoDocument", DOMATTRMODIFIED:"DOMAttrModified", DOMCHARACTERDATAMODIFIED:"DOMCharacterDataModified", BEFOREPRINT:"beforeprint", AFTERPRINT:"afterprint"};
goog.provide("goog.events.BrowserEvent");
goog.provide("goog.events.BrowserEvent.MouseButton");
goog.require("goog.events.BrowserFeature");
goog.require("goog.events.Event");
goog.require("goog.events.EventType");
goog.require("goog.reflect");
goog.require("goog.userAgent");
goog.events.BrowserEvent = function(opt_e, opt_currentTarget) {
  goog.events.BrowserEvent.base(this, "constructor", opt_e ? opt_e.type : "");
  this.target = null;
  this.currentTarget = null;
  this.relatedTarget = null;
  this.offsetX = 0;
  this.offsetY = 0;
  this.clientX = 0;
  this.clientY = 0;
  this.screenX = 0;
  this.screenY = 0;
  this.button = 0;
  this.keyCode = 0;
  this.charCode = 0;
  this.ctrlKey = false;
  this.altKey = false;
  this.shiftKey = false;
  this.metaKey = false;
  this.state = null;
  this.platformModifierKey = false;
  this.event_ = null;
  if (opt_e) {
    this.init(opt_e, opt_currentTarget);
  }
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type;
  var relevantTouch = e.changedTouches ? e.changedTouches[0] : null;
  this.target = (e.target) || e.srcElement;
  this.currentTarget = (opt_currentTarget);
  var relatedTarget = (e.relatedTarget);
  if (relatedTarget) {
    if (goog.userAgent.GECKO) {
      if (!goog.reflect.canAccessProperty(relatedTarget, "nodeName")) {
        relatedTarget = null;
      }
    }
  } else {
    if (type == goog.events.EventType.MOUSEOVER) {
      relatedTarget = e.fromElement;
    } else {
      if (type == goog.events.EventType.MOUSEOUT) {
        relatedTarget = e.toElement;
      }
    }
  }
  this.relatedTarget = relatedTarget;
  if (!goog.isNull(relevantTouch)) {
    this.clientX = relevantTouch.clientX !== undefined ? relevantTouch.clientX : relevantTouch.pageX;
    this.clientY = relevantTouch.clientY !== undefined ? relevantTouch.clientY : relevantTouch.pageY;
    this.screenX = relevantTouch.screenX || 0;
    this.screenY = relevantTouch.screenY || 0;
  } else {
    this.offsetX = goog.userAgent.WEBKIT || e.offsetX !== undefined ? e.offsetX : e.layerX;
    this.offsetY = goog.userAgent.WEBKIT || e.offsetY !== undefined ? e.offsetY : e.layerY;
    this.clientX = e.clientX !== undefined ? e.clientX : e.pageX;
    this.clientY = e.clientY !== undefined ? e.clientY : e.pageY;
    this.screenX = e.screenX || 0;
    this.screenY = e.screenY || 0;
  }
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || (type == "keypress" ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
  this.state = e.state;
  this.event_ = e;
  if (e.defaultPrevented) {
    this.preventDefault();
  }
};
goog.events.BrowserEvent.prototype.isButton = function(button) {
  if (!goog.events.BrowserFeature.HAS_W3C_BUTTON) {
    if (this.type == "click") {
      return button == goog.events.BrowserEvent.MouseButton.LEFT;
    } else {
      return !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[button]);
    }
  } else {
    return this.event_.button == button;
  }
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey);
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  if (this.event_.stopPropagation) {
    this.event_.stopPropagation();
  } else {
    this.event_.cancelBubble = true;
  }
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  if (!be.preventDefault) {
    be.returnValue = false;
    if (goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        var VK_F1 = 112;
        var VK_F12 = 123;
        if (be.ctrlKey || be.keyCode >= VK_F1 && be.keyCode <= VK_F12) {
          be.keyCode = -1;
        }
      } catch (ex) {
      }
    }
  } else {
    be.preventDefault();
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_;
};
goog.provide("goog.events");
goog.provide("goog.events.CaptureSimulationMode");
goog.provide("goog.events.Key");
goog.provide("goog.events.ListenableType");
goog.require("goog.asserts");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.BrowserFeature");
goog.require("goog.events.Listenable");
goog.require("goog.events.ListenerMap");
goog.forwardDeclare("goog.debug.ErrorHandler");
goog.forwardDeclare("goog.events.EventWrapper");
goog.events.Key;
goog.events.ListenableType;
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (Math.random() * 1E6 | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {OFF_AND_FAIL:0, OFF_AND_SILENT:1, ON:2};
goog.define("goog.events.CAPTURE_SIMULATION_MODE", 2);
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listen(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.listen((type), listener, opt_capt, opt_handler);
  } else {
    return goog.events.listen_((src), (type), listener, false, opt_capt, opt_handler);
  }
};
goog.events.listen_ = function(src, type, listener, callOnce, opt_capt, opt_handler) {
  if (!type) {
    throw Error("Invalid event type");
  }
  var capture = !!opt_capt;
  if (capture && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      goog.asserts.fail("Can not register capture listener in IE8-.");
      return null;
    } else {
      if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
        return null;
      }
    }
  }
  var listenerMap = goog.events.getListenerMap_(src);
  if (!listenerMap) {
    src[goog.events.LISTENER_MAP_PROP_] = listenerMap = new goog.events.ListenerMap(src);
  }
  var listenerObj = listenerMap.add(type, listener, callOnce, opt_capt, opt_handler);
  if (listenerObj.proxy) {
    return listenerObj;
  }
  var proxy = goog.events.getProxy();
  listenerObj.proxy = proxy;
  proxy.src = src;
  proxy.listener = listenerObj;
  if (src.addEventListener) {
    src.addEventListener(type.toString(), proxy, capture);
  } else {
    if (src.attachEvent) {
      src.attachEvent(goog.events.getOnString_(type.toString()), proxy);
    } else {
      throw Error("addEventListener and attachEvent are unavailable.");
    }
  }
  goog.events.listenerCountEstimate_++;
  return listenerObj;
};
goog.events.getProxy = function() {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_;
  var f = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(eventObject) {
    return proxyCallbackFunction.call(f.src, f.listener, eventObject);
  } : function(eventObject) {
    var v = proxyCallbackFunction.call(f.src, f.listener, eventObject);
    if (!v) {
      return v;
    }
  };
  return f;
};
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.listenOnce((type), listener, opt_capt, opt_handler);
  } else {
    return goog.events.listen_((src), (type), listener, true, opt_capt, opt_handler);
  }
};
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler);
};
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlisten((type), listener, opt_capt, opt_handler);
  }
  if (!src) {
    return false;
  }
  var capture = !!opt_capt;
  var listenerMap = goog.events.getListenerMap_((src));
  if (listenerMap) {
    var listenerObj = listenerMap.getListener((type), listener, capture, opt_handler);
    if (listenerObj) {
      return goog.events.unlistenByKey(listenerObj);
    }
  }
  return false;
};
goog.events.unlistenByKey = function(key) {
  if (goog.isNumber(key)) {
    return false;
  }
  var listener = key;
  if (!listener || listener.removed) {
    return false;
  }
  var src = listener.src;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlistenByKey(listener);
  }
  var type = listener.type;
  var proxy = listener.proxy;
  if (src.removeEventListener) {
    src.removeEventListener(type, proxy, listener.capture);
  } else {
    if (src.detachEvent) {
      src.detachEvent(goog.events.getOnString_(type), proxy);
    }
  }
  goog.events.listenerCountEstimate_--;
  var listenerMap = goog.events.getListenerMap_((src));
  if (listenerMap) {
    listenerMap.removeByKey(listener);
    if (listenerMap.getTypeCount() == 0) {
      listenerMap.src = null;
      src[goog.events.LISTENER_MAP_PROP_] = null;
    }
  } else {
    listener.markAsRemoved();
  }
  return true;
};
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler);
};
goog.events.removeAll = function(obj, opt_type) {
  if (!obj) {
    return 0;
  }
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.removeAllListeners(opt_type);
  }
  var listenerMap = goog.events.getListenerMap_((obj));
  if (!listenerMap) {
    return 0;
  }
  var count = 0;
  var typeStr = opt_type && opt_type.toString();
  for (var type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      var listeners = listenerMap.listeners[type].concat();
      for (var i = 0;i < listeners.length;++i) {
        if (goog.events.unlistenByKey(listeners[i])) {
          ++count;
        }
      }
    }
  }
  return count;
};
goog.events.getListeners = function(obj, type, capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.getListeners(type, capture);
  } else {
    if (!obj) {
      return [];
    }
    var listenerMap = goog.events.getListenerMap_((obj));
    return listenerMap ? listenerMap.getListeners(type, capture) : [];
  }
};
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  type = (type);
  listener = goog.events.wrapListener(listener);
  var capture = !!opt_capt;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.getListener(type, listener, capture, opt_handler);
  }
  if (!src) {
    return null;
  }
  var listenerMap = goog.events.getListenerMap_((src));
  if (listenerMap) {
    return listenerMap.getListener(type, listener, capture, opt_handler);
  }
  return null;
};
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture);
  }
  var listenerMap = goog.events.getListenerMap_((obj));
  return !!listenerMap && listenerMap.hasListener(opt_type, opt_capture);
};
goog.events.expose = function(e) {
  var str = [];
  for (var key in e) {
    if (e[key] && e[key].id) {
      str.push(key + " = " + e[key] + " (" + e[key].id + ")");
    } else {
      str.push(key + " = " + e[key]);
    }
  }
  return str.join("\n");
};
goog.events.getOnString_ = function(type) {
  if (type in goog.events.onStringMap_) {
    return goog.events.onStringMap_[type];
  }
  return goog.events.onStringMap_[type] = goog.events.onString_ + type;
};
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.fireListeners(type, capture, eventObject);
  }
  return goog.events.fireListeners_(obj, type, capture, eventObject);
};
goog.events.fireListeners_ = function(obj, type, capture, eventObject) {
  var retval = true;
  var listenerMap = goog.events.getListenerMap_((obj));
  if (listenerMap) {
    var listenerArray = listenerMap.listeners[type.toString()];
    if (listenerArray) {
      listenerArray = listenerArray.concat();
      for (var i = 0;i < listenerArray.length;i++) {
        var listener = listenerArray[i];
        if (listener && listener.capture == capture && !listener.removed) {
          var result = goog.events.fireListener(listener, eventObject);
          retval = retval && result !== false;
        }
      }
    }
  }
  return retval;
};
goog.events.fireListener = function(listener, eventObject) {
  var listenerFn = listener.listener;
  var listenerHandler = listener.handler || listener.src;
  if (listener.callOnce) {
    goog.events.unlistenByKey(listener);
  }
  return listenerFn.call(listenerHandler, eventObject);
};
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_;
};
goog.events.dispatchEvent = function(src, e) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(src), "Can not use goog.events.dispatchEvent with " + "non-goog.events.Listenable instance.");
  return src.dispatchEvent(e);
};
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_);
};
goog.events.handleBrowserEvent_ = function(listener, opt_evt) {
  if (listener.removed) {
    return true;
  }
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt || (goog.getObjectByName("window.event"));
    var evt = new goog.events.BrowserEvent(ieEvent, this);
    var retval = true;
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
      if (!goog.events.isMarkedIeEvent_(ieEvent)) {
        goog.events.markIeEvent_(ieEvent);
        var ancestors = [];
        for (var parent = evt.currentTarget;parent;parent = parent.parentNode) {
          ancestors.push(parent);
        }
        var type = listener.type;
        for (var i = ancestors.length - 1;!evt.propagationStopped_ && i >= 0;i--) {
          evt.currentTarget = ancestors[i];
          var result = goog.events.fireListeners_(ancestors[i], type, true, evt);
          retval = retval && result;
        }
        for (var i = 0;!evt.propagationStopped_ && i < ancestors.length;i++) {
          evt.currentTarget = ancestors[i];
          var result = goog.events.fireListeners_(ancestors[i], type, false, evt);
          retval = retval && result;
        }
      }
    } else {
      retval = goog.events.fireListener(listener, evt);
    }
    return retval;
  }
  return goog.events.fireListener(listener, new goog.events.BrowserEvent(opt_evt, this));
};
goog.events.markIeEvent_ = function(e) {
  var useReturnValue = false;
  if (e.keyCode == 0) {
    try {
      e.keyCode = -1;
      return;
    } catch (ex) {
      useReturnValue = true;
    }
  }
  if (useReturnValue || (e.returnValue) == undefined) {
    e.returnValue = true;
  }
};
goog.events.isMarkedIeEvent_ = function(e) {
  return e.keyCode < 0 || e.returnValue != undefined;
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(identifier) {
  return identifier + "_" + goog.events.uniqueIdCounter_++;
};
goog.events.getListenerMap_ = function(src) {
  var listenerMap = src[goog.events.LISTENER_MAP_PROP_];
  return listenerMap instanceof goog.events.ListenerMap ? listenerMap : null;
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (Math.random() * 1E9 >>> 0);
goog.events.wrapListener = function(listener) {
  goog.asserts.assert(listener, "Listener can not be null.");
  if (goog.isFunction(listener)) {
    return listener;
  }
  goog.asserts.assert(listener.handleEvent, "An object listener must have handleEvent method.");
  if (!listener[goog.events.LISTENER_WRAPPER_PROP_]) {
    listener[goog.events.LISTENER_WRAPPER_PROP_] = function(e) {
      return listener.handleEvent(e);
    };
  }
  return listener[goog.events.LISTENER_WRAPPER_PROP_];
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_);
});
goog.provide("goog.events.EventTarget");
goog.require("goog.Disposable");
goog.require("goog.asserts");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.Listenable");
goog.require("goog.events.ListenerMap");
goog.require("goog.object");
goog.events.EventTarget = function() {
  goog.Disposable.call(this);
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);
  this.actualEventTarget_ = this;
  this.parentEventTarget_ = null;
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_;
};
goog.events.EventTarget.prototype.setParentEventTarget = function(parent) {
  this.parentEventTarget_ = parent;
};
goog.events.EventTarget.prototype.addEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.removeEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  this.assertInitialized_();
  var ancestorsTree, ancestor = this.getParentEventTarget();
  if (ancestor) {
    ancestorsTree = [];
    var ancestorCount = 1;
    for (;ancestor;ancestor = ancestor.getParentEventTarget()) {
      ancestorsTree.push(ancestor);
      goog.asserts.assert(++ancestorCount < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop");
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, e, ancestorsTree);
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null;
};
goog.events.EventTarget.prototype.listen = function(type, listener, opt_useCapture, opt_listenerScope) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(String(type), listener, false, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.listenOnce = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.add(String(type), listener, true, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlisten = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.remove(String(type), listener, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlistenByKey = function(key) {
  return this.eventTargetListeners_.removeByKey(key);
};
goog.events.EventTarget.prototype.removeAllListeners = function(opt_type) {
  if (!this.eventTargetListeners_) {
    return 0;
  }
  return this.eventTargetListeners_.removeAll(opt_type);
};
goog.events.EventTarget.prototype.fireListeners = function(type, capture, eventObject) {
  var listenerArray = this.eventTargetListeners_.listeners[String(type)];
  if (!listenerArray) {
    return true;
  }
  listenerArray = listenerArray.concat();
  var rv = true;
  for (var i = 0;i < listenerArray.length;++i) {
    var listener = listenerArray[i];
    if (listener && !listener.removed && listener.capture == capture) {
      var listenerFn = listener.listener;
      var listenerHandler = listener.handler || listener.src;
      if (listener.callOnce) {
        this.unlistenByKey(listener);
      }
      rv = listenerFn.call(listenerHandler, eventObject) !== false && rv;
    }
  }
  return rv && eventObject.returnValue_ != false;
};
goog.events.EventTarget.prototype.getListeners = function(type, capture) {
  return this.eventTargetListeners_.getListeners(String(type), capture);
};
goog.events.EventTarget.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  return this.eventTargetListeners_.getListener(String(type), listener, capture, opt_listenerScope);
};
goog.events.EventTarget.prototype.hasListener = function(opt_type, opt_capture) {
  var id = goog.isDef(opt_type) ? String(opt_type) : undefined;
  return this.eventTargetListeners_.hasListener(id, opt_capture);
};
goog.events.EventTarget.prototype.setTargetForTesting = function(target) {
  this.actualEventTarget_ = target;
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass " + "(goog.events.EventTarget) constructor?");
};
goog.events.EventTarget.dispatchEventInternal_ = function(target, e, opt_ancestorsTree) {
  var type = e.type || (e);
  if (goog.isString(e)) {
    e = new goog.events.Event(e, target);
  } else {
    if (!(e instanceof goog.events.Event)) {
      var oldEvent = e;
      e = new goog.events.Event(type, target);
      goog.object.extend(e, oldEvent);
    } else {
      e.target = e.target || target;
    }
  }
  var rv = true, currentTarget;
  if (opt_ancestorsTree) {
    for (var i = opt_ancestorsTree.length - 1;!e.propagationStopped_ && i >= 0;i--) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i];
      rv = currentTarget.fireListeners(type, true, e) && rv;
    }
  }
  if (!e.propagationStopped_) {
    currentTarget = e.currentTarget = target;
    rv = currentTarget.fireListeners(type, true, e) && rv;
    if (!e.propagationStopped_) {
      rv = currentTarget.fireListeners(type, false, e) && rv;
    }
  }
  if (opt_ancestorsTree) {
    for (i = 0;!e.propagationStopped_ && i < opt_ancestorsTree.length;i++) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i];
      rv = currentTarget.fireListeners(type, false, e) && rv;
    }
  }
  return rv;
};
goog.provide("goog.events.FocusHandler");
goog.provide("goog.events.FocusHandler.EventType");
goog.require("goog.events");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.EventTarget");
goog.require("goog.userAgent");
goog.events.FocusHandler = function(element) {
  goog.events.EventTarget.call(this);
  this.element_ = element;
  var typeIn = goog.userAgent.IE ? "focusin" : "focus";
  var typeOut = goog.userAgent.IE ? "focusout" : "blur";
  this.listenKeyIn_ = goog.events.listen(this.element_, typeIn, this, !goog.userAgent.IE);
  this.listenKeyOut_ = goog.events.listen(this.element_, typeOut, this, !goog.userAgent.IE);
};
goog.inherits(goog.events.FocusHandler, goog.events.EventTarget);
goog.events.FocusHandler.EventType = {FOCUSIN:"focusin", FOCUSOUT:"focusout"};
goog.events.FocusHandler.prototype.handleEvent = function(e) {
  var be = e.getBrowserEvent();
  var event = new goog.events.BrowserEvent(be);
  event.type = e.type == "focusin" || e.type == "focus" ? goog.events.FocusHandler.EventType.FOCUSIN : goog.events.FocusHandler.EventType.FOCUSOUT;
  this.dispatchEvent(event);
};
goog.events.FocusHandler.prototype.disposeInternal = function() {
  goog.events.FocusHandler.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.listenKeyIn_);
  goog.events.unlistenByKey(this.listenKeyOut_);
  delete this.element_;
};
goog.provide("goog.events.EventHandler");
goog.require("goog.Disposable");
goog.require("goog.events");
goog.require("goog.object");
goog.forwardDeclare("goog.events.EventWrapper");
goog.events.EventHandler = function(opt_scope) {
  goog.Disposable.call(this);
  this.handler_ = opt_scope;
  this.keys_ = {};
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(src, type, opt_fn, opt_capture) {
  return this.listen_(src, type, opt_fn, opt_capture);
};
goog.events.EventHandler.prototype.listenWithScope = function(src, type, fn, capture, scope) {
  return this.listen_(src, type, fn, capture, scope);
};
goog.events.EventHandler.prototype.listen_ = function(src, type, opt_fn, opt_capture, opt_scope) {
  if (!goog.isArray(type)) {
    if (type) {
      goog.events.EventHandler.typeArray_[0] = type.toString();
    }
    type = goog.events.EventHandler.typeArray_;
  }
  for (var i = 0;i < type.length;i++) {
    var listenerObj = goog.events.listen(src, type[i], opt_fn || this.handleEvent, opt_capture || false, opt_scope || this.handler_ || this);
    if (!listenerObj) {
      return this;
    }
    var key = listenerObj.key;
    this.keys_[key] = listenerObj;
  }
  return this;
};
goog.events.EventHandler.prototype.listenOnce = function(src, type, opt_fn, opt_capture) {
  return this.listenOnce_(src, type, opt_fn, opt_capture);
};
goog.events.EventHandler.prototype.listenOnceWithScope = function(src, type, fn, capture, scope) {
  return this.listenOnce_(src, type, fn, capture, scope);
};
goog.events.EventHandler.prototype.listenOnce_ = function(src, type, opt_fn, opt_capture, opt_scope) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      this.listenOnce_(src, type[i], opt_fn, opt_capture, opt_scope);
    }
  } else {
    var listenerObj = goog.events.listenOnce(src, type, opt_fn || this.handleEvent, opt_capture, opt_scope || this.handler_ || this);
    if (!listenerObj) {
      return this;
    }
    var key = listenerObj.key;
    this.keys_[key] = listenerObj;
  }
  return this;
};
goog.events.EventHandler.prototype.listenWithWrapper = function(src, wrapper, listener, opt_capt) {
  return this.listenWithWrapper_(src, wrapper, listener, opt_capt);
};
goog.events.EventHandler.prototype.listenWithWrapperAndScope = function(src, wrapper, listener, capture, scope) {
  return this.listenWithWrapper_(src, wrapper, listener, capture, scope);
};
goog.events.EventHandler.prototype.listenWithWrapper_ = function(src, wrapper, listener, opt_capt, opt_scope) {
  wrapper.listen(src, listener, opt_capt, opt_scope || this.handler_ || this, this);
  return this;
};
goog.events.EventHandler.prototype.getListenerCount = function() {
  var count = 0;
  for (var key in this.keys_) {
    if (Object.prototype.hasOwnProperty.call(this.keys_, key)) {
      count++;
    }
  }
  return count;
};
goog.events.EventHandler.prototype.unlisten = function(src, type, opt_fn, opt_capture, opt_scope) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      this.unlisten(src, type[i], opt_fn, opt_capture, opt_scope);
    }
  } else {
    var listener = goog.events.getListener(src, type, opt_fn || this.handleEvent, opt_capture, opt_scope || this.handler_ || this);
    if (listener) {
      goog.events.unlistenByKey(listener);
      delete this.keys_[listener.key];
    }
  }
  return this;
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_scope) {
  wrapper.unlisten(src, listener, opt_capt, opt_scope || this.handler_ || this, this);
  return this;
};
goog.events.EventHandler.prototype.removeAll = function() {
  goog.object.forEach(this.keys_, function(listenerObj, key) {
    if (this.keys_.hasOwnProperty(key)) {
      goog.events.unlistenByKey(listenerObj);
    }
  }, this);
  this.keys_ = {};
};
goog.events.EventHandler.prototype.disposeInternal = function() {
  goog.events.EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll();
};
goog.events.EventHandler.prototype.handleEvent = function(e) {
  throw Error("EventHandler.handleEvent not implemented");
};
goog.provide("goog.events.KeyCodes");
goog.require("goog.userAgent");
goog.forwardDeclare("goog.events.BrowserEvent");
goog.events.KeyCodes = {WIN_KEY_FF_LINUX:0, MAC_ENTER:3, BACKSPACE:8, TAB:9, NUM_CENTER:12, ENTER:13, SHIFT:16, CTRL:17, ALT:18, PAUSE:19, CAPS_LOCK:20, ESC:27, SPACE:32, PAGE_UP:33, PAGE_DOWN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40, PLUS_SIGN:43, PRINT_SCREEN:44, INSERT:45, DELETE:46, ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, FF_SEMICOLON:59, FF_EQUALS:61, FF_DASH:173, QUESTION_MARK:63, AT_SIGN:64, A:65, B:66, C:67, D:68, E:69, F:70, 
G:71, H:72, I:73, J:74, K:75, L:76, M:77, N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90, META:91, WIN_KEY_RIGHT:92, CONTEXT_MENU:93, NUM_ZERO:96, NUM_ONE:97, NUM_TWO:98, NUM_THREE:99, NUM_FOUR:100, NUM_FIVE:101, NUM_SIX:102, NUM_SEVEN:103, NUM_EIGHT:104, NUM_NINE:105, NUM_MULTIPLY:106, NUM_PLUS:107, NUM_MINUS:109, NUM_PERIOD:110, NUM_DIVISION:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NUMLOCK:144, SCROLL_LOCK:145, 
FIRST_MEDIA_KEY:166, LAST_MEDIA_KEY:183, SEMICOLON:186, DASH:189, EQUALS:187, COMMA:188, PERIOD:190, SLASH:191, APOSTROPHE:192, TILDE:192, SINGLE_QUOTE:222, OPEN_SQUARE_BRACKET:219, BACKSLASH:220, CLOSE_SQUARE_BRACKET:221, WIN_KEY:224, MAC_FF_META:224, MAC_WK_CMD_LEFT:91, MAC_WK_CMD_RIGHT:93, WIN_IME:229, VK_NONAME:252, PHANTOM:255};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(e) {
  if (e.altKey && !e.ctrlKey || e.metaKey || e.keyCode >= goog.events.KeyCodes.F1 && e.keyCode <= goog.events.KeyCodes.F12) {
    return false;
  }
  switch(e.keyCode) {
    case goog.events.KeyCodes.ALT:
    ;
    case goog.events.KeyCodes.CAPS_LOCK:
    ;
    case goog.events.KeyCodes.CONTEXT_MENU:
    ;
    case goog.events.KeyCodes.CTRL:
    ;
    case goog.events.KeyCodes.DOWN:
    ;
    case goog.events.KeyCodes.END:
    ;
    case goog.events.KeyCodes.ESC:
    ;
    case goog.events.KeyCodes.HOME:
    ;
    case goog.events.KeyCodes.INSERT:
    ;
    case goog.events.KeyCodes.LEFT:
    ;
    case goog.events.KeyCodes.MAC_FF_META:
    ;
    case goog.events.KeyCodes.META:
    ;
    case goog.events.KeyCodes.NUMLOCK:
    ;
    case goog.events.KeyCodes.NUM_CENTER:
    ;
    case goog.events.KeyCodes.PAGE_DOWN:
    ;
    case goog.events.KeyCodes.PAGE_UP:
    ;
    case goog.events.KeyCodes.PAUSE:
    ;
    case goog.events.KeyCodes.PHANTOM:
    ;
    case goog.events.KeyCodes.PRINT_SCREEN:
    ;
    case goog.events.KeyCodes.RIGHT:
    ;
    case goog.events.KeyCodes.SCROLL_LOCK:
    ;
    case goog.events.KeyCodes.SHIFT:
    ;
    case goog.events.KeyCodes.UP:
    ;
    case goog.events.KeyCodes.VK_NONAME:
    ;
    case goog.events.KeyCodes.WIN_KEY:
    ;
    case goog.events.KeyCodes.WIN_KEY_RIGHT:
      return false;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return !goog.userAgent.GECKO;
    default:
      return e.keyCode < goog.events.KeyCodes.FIRST_MEDIA_KEY || e.keyCode > goog.events.KeyCodes.LAST_MEDIA_KEY;
  }
};
goog.events.KeyCodes.firesKeyPressEvent = function(keyCode, opt_heldKeyCode, opt_shiftKey, opt_ctrlKey, opt_altKey) {
  if (!goog.userAgent.IE && !goog.userAgent.EDGE && !(goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("525"))) {
    return true;
  }
  if (goog.userAgent.MAC && opt_altKey) {
    return goog.events.KeyCodes.isCharacterKey(keyCode);
  }
  if (opt_altKey && !opt_ctrlKey) {
    return false;
  }
  if (goog.isNumber(opt_heldKeyCode)) {
    opt_heldKeyCode = goog.events.KeyCodes.normalizeKeyCode(opt_heldKeyCode);
  }
  if (!opt_shiftKey && (opt_heldKeyCode == goog.events.KeyCodes.CTRL || opt_heldKeyCode == goog.events.KeyCodes.ALT || goog.userAgent.MAC && opt_heldKeyCode == goog.events.KeyCodes.META)) {
    return false;
  }
  if ((goog.userAgent.WEBKIT || goog.userAgent.EDGE) && opt_ctrlKey && opt_shiftKey) {
    switch(keyCode) {
      case goog.events.KeyCodes.BACKSLASH:
      ;
      case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
      ;
      case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      ;
      case goog.events.KeyCodes.TILDE:
      ;
      case goog.events.KeyCodes.SEMICOLON:
      ;
      case goog.events.KeyCodes.DASH:
      ;
      case goog.events.KeyCodes.EQUALS:
      ;
      case goog.events.KeyCodes.COMMA:
      ;
      case goog.events.KeyCodes.PERIOD:
      ;
      case goog.events.KeyCodes.SLASH:
      ;
      case goog.events.KeyCodes.APOSTROPHE:
      ;
      case goog.events.KeyCodes.SINGLE_QUOTE:
        return false;
    }
  }
  if (goog.userAgent.IE && opt_ctrlKey && opt_heldKeyCode == keyCode) {
    return false;
  }
  switch(keyCode) {
    case goog.events.KeyCodes.ENTER:
      return true;
    case goog.events.KeyCodes.ESC:
      return !(goog.userAgent.WEBKIT || goog.userAgent.EDGE);
  }
  return goog.events.KeyCodes.isCharacterKey(keyCode);
};
goog.events.KeyCodes.isCharacterKey = function(keyCode) {
  if (keyCode >= goog.events.KeyCodes.ZERO && keyCode <= goog.events.KeyCodes.NINE) {
    return true;
  }
  if (keyCode >= goog.events.KeyCodes.NUM_ZERO && keyCode <= goog.events.KeyCodes.NUM_MULTIPLY) {
    return true;
  }
  if (keyCode >= goog.events.KeyCodes.A && keyCode <= goog.events.KeyCodes.Z) {
    return true;
  }
  if ((goog.userAgent.WEBKIT || goog.userAgent.EDGE) && keyCode == 0) {
    return true;
  }
  switch(keyCode) {
    case goog.events.KeyCodes.SPACE:
    ;
    case goog.events.KeyCodes.PLUS_SIGN:
    ;
    case goog.events.KeyCodes.QUESTION_MARK:
    ;
    case goog.events.KeyCodes.AT_SIGN:
    ;
    case goog.events.KeyCodes.NUM_PLUS:
    ;
    case goog.events.KeyCodes.NUM_MINUS:
    ;
    case goog.events.KeyCodes.NUM_PERIOD:
    ;
    case goog.events.KeyCodes.NUM_DIVISION:
    ;
    case goog.events.KeyCodes.SEMICOLON:
    ;
    case goog.events.KeyCodes.FF_SEMICOLON:
    ;
    case goog.events.KeyCodes.DASH:
    ;
    case goog.events.KeyCodes.EQUALS:
    ;
    case goog.events.KeyCodes.FF_EQUALS:
    ;
    case goog.events.KeyCodes.COMMA:
    ;
    case goog.events.KeyCodes.PERIOD:
    ;
    case goog.events.KeyCodes.SLASH:
    ;
    case goog.events.KeyCodes.APOSTROPHE:
    ;
    case goog.events.KeyCodes.SINGLE_QUOTE:
    ;
    case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
    ;
    case goog.events.KeyCodes.BACKSLASH:
    ;
    case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      return true;
    default:
      return false;
  }
};
goog.events.KeyCodes.normalizeKeyCode = function(keyCode) {
  if (goog.userAgent.GECKO) {
    return goog.events.KeyCodes.normalizeGeckoKeyCode(keyCode);
  } else {
    if (goog.userAgent.MAC && goog.userAgent.WEBKIT) {
      return goog.events.KeyCodes.normalizeMacWebKitKeyCode(keyCode);
    } else {
      return keyCode;
    }
  }
};
goog.events.KeyCodes.normalizeGeckoKeyCode = function(keyCode) {
  switch(keyCode) {
    case goog.events.KeyCodes.FF_EQUALS:
      return goog.events.KeyCodes.EQUALS;
    case goog.events.KeyCodes.FF_SEMICOLON:
      return goog.events.KeyCodes.SEMICOLON;
    case goog.events.KeyCodes.FF_DASH:
      return goog.events.KeyCodes.DASH;
    case goog.events.KeyCodes.MAC_FF_META:
      return goog.events.KeyCodes.META;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return goog.events.KeyCodes.WIN_KEY;
    default:
      return keyCode;
  }
};
goog.events.KeyCodes.normalizeMacWebKitKeyCode = function(keyCode) {
  switch(keyCode) {
    case goog.events.KeyCodes.MAC_WK_CMD_RIGHT:
      return goog.events.KeyCodes.META;
    default:
      return keyCode;
  }
};
goog.provide("goog.events.KeyEvent");
goog.provide("goog.events.KeyHandler");
goog.provide("goog.events.KeyHandler.EventType");
goog.require("goog.events");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.userAgent");
goog.events.KeyHandler = function(opt_element, opt_capture) {
  goog.events.EventTarget.call(this);
  if (opt_element) {
    this.attach(opt_element, opt_capture);
  }
};
goog.inherits(goog.events.KeyHandler, goog.events.EventTarget);
goog.events.KeyHandler.prototype.element_ = null;
goog.events.KeyHandler.prototype.keyPressKey_ = null;
goog.events.KeyHandler.prototype.keyDownKey_ = null;
goog.events.KeyHandler.prototype.keyUpKey_ = null;
goog.events.KeyHandler.prototype.lastKey_ = -1;
goog.events.KeyHandler.prototype.keyCode_ = -1;
goog.events.KeyHandler.prototype.altKey_ = false;
goog.events.KeyHandler.EventType = {KEY:"key"};
goog.events.KeyHandler.safariKey_ = {3:goog.events.KeyCodes.ENTER, 12:goog.events.KeyCodes.NUMLOCK, 63232:goog.events.KeyCodes.UP, 63233:goog.events.KeyCodes.DOWN, 63234:goog.events.KeyCodes.LEFT, 63235:goog.events.KeyCodes.RIGHT, 63236:goog.events.KeyCodes.F1, 63237:goog.events.KeyCodes.F2, 63238:goog.events.KeyCodes.F3, 63239:goog.events.KeyCodes.F4, 63240:goog.events.KeyCodes.F5, 63241:goog.events.KeyCodes.F6, 63242:goog.events.KeyCodes.F7, 63243:goog.events.KeyCodes.F8, 63244:goog.events.KeyCodes.F9, 
63245:goog.events.KeyCodes.F10, 63246:goog.events.KeyCodes.F11, 63247:goog.events.KeyCodes.F12, 63248:goog.events.KeyCodes.PRINT_SCREEN, 63272:goog.events.KeyCodes.DELETE, 63273:goog.events.KeyCodes.HOME, 63275:goog.events.KeyCodes.END, 63276:goog.events.KeyCodes.PAGE_UP, 63277:goog.events.KeyCodes.PAGE_DOWN, 63289:goog.events.KeyCodes.NUMLOCK, 63302:goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.keyIdentifier_ = {"Up":goog.events.KeyCodes.UP, "Down":goog.events.KeyCodes.DOWN, "Left":goog.events.KeyCodes.LEFT, "Right":goog.events.KeyCodes.RIGHT, "Enter":goog.events.KeyCodes.ENTER, "F1":goog.events.KeyCodes.F1, "F2":goog.events.KeyCodes.F2, "F3":goog.events.KeyCodes.F3, "F4":goog.events.KeyCodes.F4, "F5":goog.events.KeyCodes.F5, "F6":goog.events.KeyCodes.F6, "F7":goog.events.KeyCodes.F7, "F8":goog.events.KeyCodes.F8, "F9":goog.events.KeyCodes.F9, "F10":goog.events.KeyCodes.F10, 
"F11":goog.events.KeyCodes.F11, "F12":goog.events.KeyCodes.F12, "U+007F":goog.events.KeyCodes.DELETE, "Home":goog.events.KeyCodes.HOME, "End":goog.events.KeyCodes.END, "PageUp":goog.events.KeyCodes.PAGE_UP, "PageDown":goog.events.KeyCodes.PAGE_DOWN, "Insert":goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.USES_KEYDOWN_ = goog.userAgent.IE || goog.userAgent.EDGE || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("525");
goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ = goog.userAgent.MAC && goog.userAgent.GECKO;
goog.events.KeyHandler.prototype.handleKeyDown_ = function(e) {
  if (goog.userAgent.WEBKIT || goog.userAgent.EDGE) {
    if (this.lastKey_ == goog.events.KeyCodes.CTRL && !e.ctrlKey || this.lastKey_ == goog.events.KeyCodes.ALT && !e.altKey || goog.userAgent.MAC && this.lastKey_ == goog.events.KeyCodes.META && !e.metaKey) {
      this.resetState();
    }
  }
  if (this.lastKey_ == -1) {
    if (e.ctrlKey && e.keyCode != goog.events.KeyCodes.CTRL) {
      this.lastKey_ = goog.events.KeyCodes.CTRL;
    } else {
      if (e.altKey && e.keyCode != goog.events.KeyCodes.ALT) {
        this.lastKey_ = goog.events.KeyCodes.ALT;
      } else {
        if (e.metaKey && e.keyCode != goog.events.KeyCodes.META) {
          this.lastKey_ = goog.events.KeyCodes.META;
        }
      }
    }
  }
  if (goog.events.KeyHandler.USES_KEYDOWN_ && !goog.events.KeyCodes.firesKeyPressEvent(e.keyCode, this.lastKey_, e.shiftKey, e.ctrlKey, e.altKey)) {
    this.handleEvent(e);
  } else {
    this.keyCode_ = goog.events.KeyCodes.normalizeKeyCode(e.keyCode);
    if (goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
      this.altKey_ = e.altKey;
    }
  }
};
goog.events.KeyHandler.prototype.resetState = function() {
  this.lastKey_ = -1;
  this.keyCode_ = -1;
};
goog.events.KeyHandler.prototype.handleKeyup_ = function(e) {
  this.resetState();
  this.altKey_ = e.altKey;
};
goog.events.KeyHandler.prototype.handleEvent = function(e) {
  var be = e.getBrowserEvent();
  var keyCode, charCode;
  var altKey = be.altKey;
  if (goog.userAgent.IE && e.type == goog.events.EventType.KEYPRESS) {
    keyCode = this.keyCode_;
    charCode = keyCode != goog.events.KeyCodes.ENTER && keyCode != goog.events.KeyCodes.ESC ? be.keyCode : 0;
  } else {
    if ((goog.userAgent.WEBKIT || goog.userAgent.EDGE) && e.type == goog.events.EventType.KEYPRESS) {
      keyCode = this.keyCode_;
      charCode = be.charCode >= 0 && be.charCode < 63232 && goog.events.KeyCodes.isCharacterKey(keyCode) ? be.charCode : 0;
    } else {
      if (goog.userAgent.OPERA && !goog.userAgent.WEBKIT) {
        keyCode = this.keyCode_;
        charCode = goog.events.KeyCodes.isCharacterKey(keyCode) ? be.keyCode : 0;
      } else {
        keyCode = be.keyCode || this.keyCode_;
        charCode = be.charCode || 0;
        if (goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
          altKey = this.altKey_;
        }
        if (goog.userAgent.MAC && charCode == goog.events.KeyCodes.QUESTION_MARK && keyCode == goog.events.KeyCodes.WIN_KEY) {
          keyCode = goog.events.KeyCodes.SLASH;
        }
      }
    }
  }
  keyCode = goog.events.KeyCodes.normalizeKeyCode(keyCode);
  var key = keyCode;
  var keyIdentifier = be.keyIdentifier;
  if (keyCode) {
    if (keyCode >= 63232 && keyCode in goog.events.KeyHandler.safariKey_) {
      key = goog.events.KeyHandler.safariKey_[keyCode];
    } else {
      if (keyCode == 25 && e.shiftKey) {
        key = 9;
      }
    }
  } else {
    if (keyIdentifier && keyIdentifier in goog.events.KeyHandler.keyIdentifier_) {
      key = goog.events.KeyHandler.keyIdentifier_[keyIdentifier];
    }
  }
  var repeat = key == this.lastKey_;
  this.lastKey_ = key;
  var event = new goog.events.KeyEvent(key, charCode, repeat, be);
  event.altKey = altKey;
  this.dispatchEvent(event);
};
goog.events.KeyHandler.prototype.getElement = function() {
  return this.element_;
};
goog.events.KeyHandler.prototype.attach = function(element, opt_capture) {
  if (this.keyUpKey_) {
    this.detach();
  }
  this.element_ = element;
  this.keyPressKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYPRESS, this, opt_capture);
  this.keyDownKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYDOWN, this.handleKeyDown_, opt_capture, this);
  this.keyUpKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYUP, this.handleKeyup_, opt_capture, this);
};
goog.events.KeyHandler.prototype.detach = function() {
  if (this.keyPressKey_) {
    goog.events.unlistenByKey(this.keyPressKey_);
    goog.events.unlistenByKey(this.keyDownKey_);
    goog.events.unlistenByKey(this.keyUpKey_);
    this.keyPressKey_ = null;
    this.keyDownKey_ = null;
    this.keyUpKey_ = null;
  }
  this.element_ = null;
  this.lastKey_ = -1;
  this.keyCode_ = -1;
};
goog.events.KeyHandler.prototype.disposeInternal = function() {
  goog.events.KeyHandler.superClass_.disposeInternal.call(this);
  this.detach();
};
goog.events.KeyEvent = function(keyCode, charCode, repeat, browserEvent) {
  goog.events.BrowserEvent.call(this, browserEvent);
  this.type = goog.events.KeyHandler.EventType.KEY;
  this.keyCode = keyCode;
  this.charCode = charCode;
  this.repeat = repeat;
};
goog.inherits(goog.events.KeyEvent, goog.events.BrowserEvent);
goog.provide("goog.string.path");
goog.require("goog.array");
goog.require("goog.string");
goog.string.path.baseName = function(path) {
  var i = path.lastIndexOf("/") + 1;
  return path.slice(i);
};
goog.string.path.basename = goog.string.path.baseName;
goog.string.path.dirname = function(path) {
  var i = path.lastIndexOf("/") + 1;
  var head = path.slice(0, i);
  if (!/^\/+$/.test(head)) {
    head = head.replace(/\/+$/, "");
  }
  return head;
};
goog.string.path.extension = function(path) {
  var separator = ".";
  var baseName = goog.string.path.baseName(path).replace(/\.+/g, separator);
  var separatorIndex = baseName.lastIndexOf(separator);
  return separatorIndex <= 0 ? "" : baseName.substr(separatorIndex + 1);
};
goog.string.path.join = function(var_args) {
  var path = arguments[0];
  for (var i = 1;i < arguments.length;i++) {
    var arg = arguments[i];
    if (goog.string.startsWith(arg, "/")) {
      path = arg;
    } else {
      if (path == "" || goog.string.endsWith(path, "/")) {
        path += arg;
      } else {
        path += "/" + arg;
      }
    }
  }
  return path;
};
goog.string.path.normalizePath = function(path) {
  if (path == "") {
    return ".";
  }
  var initialSlashes = "";
  if (goog.string.startsWith(path, "/")) {
    initialSlashes = "/";
    if (goog.string.startsWith(path, "//") && !goog.string.startsWith(path, "///")) {
      initialSlashes = "//";
    }
  }
  var parts = path.split("/");
  var newParts = [];
  for (var i = 0;i < parts.length;i++) {
    var part = parts[i];
    if (part == "" || part == ".") {
      continue;
    }
    if (part != ".." || !initialSlashes && !newParts.length || goog.array.peek(newParts) == "..") {
      newParts.push(part);
    } else {
      newParts.pop();
    }
  }
  var returnPath = initialSlashes + newParts.join("/");
  return returnPath || ".";
};
goog.string.path.split = function(path) {
  var head = goog.string.path.dirname(path);
  var tail = goog.string.path.baseName(path);
  return [head, tail];
};
goog.provide("goog.dom.classlist");
goog.require("goog.array");
goog.define("goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST", false);
goog.dom.classlist.get = function(element) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    return element.classList;
  }
  var className = element.className;
  return goog.isString(className) && className.match(/\S+/g) || [];
};
goog.dom.classlist.set = function(element, className) {
  element.className = className;
};
goog.dom.classlist.contains = function(element, className) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    return element.classList.contains(className);
  }
  return goog.array.contains(goog.dom.classlist.get(element), className);
};
goog.dom.classlist.add = function(element, className) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    element.classList.add(className);
    return;
  }
  if (!goog.dom.classlist.contains(element, className)) {
    element.className += element.className.length > 0 ? " " + className : className;
  }
};
goog.dom.classlist.addAll = function(element, classesToAdd) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    goog.array.forEach(classesToAdd, function(className) {
      goog.dom.classlist.add(element, className);
    });
    return;
  }
  var classMap = {};
  goog.array.forEach(goog.dom.classlist.get(element), function(className) {
    classMap[className] = true;
  });
  goog.array.forEach(classesToAdd, function(className) {
    classMap[className] = true;
  });
  element.className = "";
  for (var className in classMap) {
    element.className += element.className.length > 0 ? " " + className : className;
  }
};
goog.dom.classlist.remove = function(element, className) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    element.classList.remove(className);
    return;
  }
  if (goog.dom.classlist.contains(element, className)) {
    element.className = goog.array.filter(goog.dom.classlist.get(element), function(c) {
      return c != className;
    }).join(" ");
  }
};
goog.dom.classlist.removeAll = function(element, classesToRemove) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    goog.array.forEach(classesToRemove, function(className) {
      goog.dom.classlist.remove(element, className);
    });
    return;
  }
  element.className = goog.array.filter(goog.dom.classlist.get(element), function(className) {
    return !goog.array.contains(classesToRemove, className);
  }).join(" ");
};
goog.dom.classlist.enable = function(element, className, enabled) {
  if (enabled) {
    goog.dom.classlist.add(element, className);
  } else {
    goog.dom.classlist.remove(element, className);
  }
};
goog.dom.classlist.enableAll = function(element, classesToEnable, enabled) {
  var f = enabled ? goog.dom.classlist.addAll : goog.dom.classlist.removeAll;
  f(element, classesToEnable);
};
goog.dom.classlist.swap = function(element, fromClass, toClass) {
  if (goog.dom.classlist.contains(element, fromClass)) {
    goog.dom.classlist.remove(element, fromClass);
    goog.dom.classlist.add(element, toClass);
    return true;
  }
  return false;
};
goog.dom.classlist.toggle = function(element, className) {
  var add = !goog.dom.classlist.contains(element, className);
  goog.dom.classlist.enable(element, className, add);
  return add;
};
goog.dom.classlist.addRemove = function(element, classToRemove, classToAdd) {
  goog.dom.classlist.remove(element, classToRemove);
  goog.dom.classlist.add(element, classToAdd);
};
goog.provide("goog.ui.registry");
goog.require("goog.asserts");
goog.require("goog.dom.classlist");
goog.ui.registry.getDefaultRenderer = function(componentCtor) {
  var key;
  var rendererCtor;
  while (componentCtor) {
    key = goog.getUid(componentCtor);
    if (rendererCtor = goog.ui.registry.defaultRenderers_[key]) {
      break;
    }
    componentCtor = componentCtor.superClass_ ? componentCtor.superClass_.constructor : null;
  }
  if (rendererCtor) {
    return goog.isFunction(rendererCtor.getInstance) ? rendererCtor.getInstance() : new rendererCtor;
  }
  return null;
};
goog.ui.registry.setDefaultRenderer = function(componentCtor, rendererCtor) {
  if (!goog.isFunction(componentCtor)) {
    throw Error("Invalid component class " + componentCtor);
  }
  if (!goog.isFunction(rendererCtor)) {
    throw Error("Invalid renderer class " + rendererCtor);
  }
  var key = goog.getUid(componentCtor);
  goog.ui.registry.defaultRenderers_[key] = rendererCtor;
};
goog.ui.registry.getDecoratorByClassName = function(className) {
  return className in goog.ui.registry.decoratorFunctions_ ? goog.ui.registry.decoratorFunctions_[className]() : null;
};
goog.ui.registry.setDecoratorByClassName = function(className, decoratorFn) {
  if (!className) {
    throw Error("Invalid class name " + className);
  }
  if (!goog.isFunction(decoratorFn)) {
    throw Error("Invalid decorator function " + decoratorFn);
  }
  goog.ui.registry.decoratorFunctions_[className] = decoratorFn;
};
goog.ui.registry.getDecorator = function(element) {
  var decorator;
  goog.asserts.assert(element);
  var classNames = goog.dom.classlist.get(element);
  for (var i = 0, len = classNames.length;i < len;i++) {
    if (decorator = goog.ui.registry.getDecoratorByClassName(classNames[i])) {
      return decorator;
    }
  }
  return null;
};
goog.ui.registry.reset = function() {
  goog.ui.registry.defaultRenderers_ = {};
  goog.ui.registry.decoratorFunctions_ = {};
};
goog.ui.registry.defaultRenderers_ = {};
goog.ui.registry.decoratorFunctions_ = {};
goog.provide("goog.ui.decorate");
goog.require("goog.ui.registry");
goog.ui.decorate = function(element) {
  var decorator = goog.ui.registry.getDecorator(element);
  if (decorator) {
    decorator.decorate(element);
  }
  return decorator;
};
goog.provide("goog.dom.BrowserFeature");
goog.require("goog.userAgent");
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, 
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE, LEGACY_IE_RANGES:goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)};
goog.provide("goog.dom.vendor");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.dom.vendor.getVendorJsPrefix = function() {
  if (goog.userAgent.WEBKIT) {
    return "Webkit";
  } else {
    if (goog.userAgent.GECKO) {
      return "Moz";
    } else {
      if (goog.userAgent.IE) {
        return "ms";
      } else {
        if (goog.userAgent.OPERA) {
          return "O";
        }
      }
    }
  }
  return null;
};
goog.dom.vendor.getVendorPrefix = function() {
  if (goog.userAgent.WEBKIT) {
    return "-webkit";
  } else {
    if (goog.userAgent.GECKO) {
      return "-moz";
    } else {
      if (goog.userAgent.IE) {
        return "-ms";
      } else {
        if (goog.userAgent.OPERA) {
          return "-o";
        }
      }
    }
  }
  return null;
};
goog.dom.vendor.getPrefixedPropertyName = function(propertyName, opt_object) {
  if (opt_object && propertyName in opt_object) {
    return propertyName;
  }
  var prefix = goog.dom.vendor.getVendorJsPrefix();
  if (prefix) {
    prefix = prefix.toLowerCase();
    var prefixedPropertyName = prefix + goog.string.toTitleCase(propertyName);
    return !goog.isDef(opt_object) || prefixedPropertyName in opt_object ? prefixedPropertyName : null;
  }
  return null;
};
goog.dom.vendor.getPrefixedEventType = function(eventType) {
  var prefix = goog.dom.vendor.getVendorJsPrefix() || "";
  return (prefix + eventType).toLowerCase();
};
goog.provide("goog.dom.safe");
goog.provide("goog.dom.safe.InsertAdjacentHtmlPosition");
goog.require("goog.asserts");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.SafeUrl");
goog.require("goog.html.TrustedResourceUrl");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.dom.safe.InsertAdjacentHtmlPosition = {AFTERBEGIN:"afterbegin", AFTEREND:"afterend", BEFOREBEGIN:"beforebegin", BEFOREEND:"beforeend"};
goog.dom.safe.insertAdjacentHtml = function(node, position, html) {
  node.insertAdjacentHTML(position, goog.html.SafeHtml.unwrap(html));
};
goog.dom.safe.setInnerHtml = function(elem, html) {
  elem.innerHTML = goog.html.SafeHtml.unwrap(html);
};
goog.dom.safe.setOuterHtml = function(elem, html) {
  elem.outerHTML = goog.html.SafeHtml.unwrap(html);
};
goog.dom.safe.documentWrite = function(doc, html) {
  doc.write(goog.html.SafeHtml.unwrap(html));
};
goog.dom.safe.setAnchorHref = function(anchor, url) {
  var safeUrl;
  if (url instanceof goog.html.SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = goog.html.SafeUrl.sanitize(url);
  }
  anchor.href = goog.html.SafeUrl.unwrap(safeUrl);
};
goog.dom.safe.setEmbedSrc = function(embed, url) {
  embed.src = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setFrameSrc = function(frame, url) {
  frame.src = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setIframeSrc = function(iframe, url) {
  iframe.src = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setLinkHrefAndRel = function(link, url, rel) {
  link.rel = rel;
  if (goog.string.caseInsensitiveContains(rel, "stylesheet")) {
    goog.asserts.assert(url instanceof goog.html.TrustedResourceUrl, 'URL must be TrustedResourceUrl because "rel" contains "stylesheet"');
    link.href = goog.html.TrustedResourceUrl.unwrap(url);
  } else {
    if (url instanceof goog.html.TrustedResourceUrl) {
      link.href = goog.html.TrustedResourceUrl.unwrap(url);
    } else {
      if (url instanceof goog.html.SafeUrl) {
        link.href = goog.html.SafeUrl.unwrap(url);
      } else {
        link.href = goog.html.SafeUrl.sanitize(url).getTypedStringValue();
      }
    }
  }
};
goog.dom.safe.setObjectData = function(object, url) {
  object.data = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setScriptSrc = function(script, url) {
  script.src = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setLocationHref = function(loc, url) {
  var safeUrl;
  if (url instanceof goog.html.SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = goog.html.SafeUrl.sanitize(url);
  }
  loc.href = goog.html.SafeUrl.unwrap(safeUrl);
};
goog.dom.safe.openInWindow = function(url, opt_openerWin, opt_name, opt_specs, opt_replace) {
  var safeUrl;
  if (url instanceof goog.html.SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = goog.html.SafeUrl.sanitize(url);
  }
  var win = opt_openerWin || window;
  return win.open(goog.html.SafeUrl.unwrap(safeUrl), opt_name ? goog.string.Const.unwrap(opt_name) : "", opt_specs, opt_replace);
};
goog.provide("goog.dom");
goog.provide("goog.dom.Appendable");
goog.provide("goog.dom.DomHelper");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom.BrowserFeature");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.TagName");
goog.require("goog.dom.safe");
goog.require("goog.html.SafeHtml");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Size");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.string.Unicode");
goog.require("goog.userAgent");
goog.define("goog.dom.ASSUME_QUIRKS_MODE", false);
goog.define("goog.dom.ASSUME_STANDARDS_MODE", false);
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(opt_element) {
  return opt_element ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(opt_element)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper);
};
goog.dom.defaultDomHelper_;
goog.dom.getDocument = function() {
  return document;
};
goog.dom.getElement = function(element) {
  return goog.dom.getElementHelper_(document, element);
};
goog.dom.getElementHelper_ = function(doc, element) {
  return goog.isString(element) ? doc.getElementById(element) : element;
};
goog.dom.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(document, id);
};
goog.dom.getRequiredElementHelper_ = function(doc, id) {
  goog.asserts.assertString(id);
  var element = goog.dom.getElementHelper_(doc, id);
  element = goog.asserts.assertElement(element, "No element found with id: " + id);
  return element;
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(document, opt_tag, opt_class, opt_el);
};
goog.dom.getElementsByClass = function(className, opt_el) {
  var parent = opt_el || document;
  if (goog.dom.canUseQuerySelector_(parent)) {
    return parent.querySelectorAll("." + className);
  }
  return goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el);
};
goog.dom.getElementByClass = function(className, opt_el) {
  var parent = opt_el || document;
  var retVal = null;
  if (parent.getElementsByClassName) {
    retVal = parent.getElementsByClassName(className)[0];
  } else {
    if (goog.dom.canUseQuerySelector_(parent)) {
      retVal = parent.querySelector("." + className);
    } else {
      retVal = goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el)[0];
    }
  }
  return retVal || null;
};
goog.dom.getRequiredElementByClass = function(className, opt_root) {
  var retValue = goog.dom.getElementByClass(className, opt_root);
  return goog.asserts.assert(retValue, "No element found with className: " + className);
};
goog.dom.canUseQuerySelector_ = function(parent) {
  return !!(parent.querySelectorAll && parent.querySelector);
};
goog.dom.getElementsByTagNameAndClass_ = function(doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc;
  var tagName = opt_tag && opt_tag != "*" ? opt_tag.toUpperCase() : "";
  if (goog.dom.canUseQuerySelector_(parent) && (tagName || opt_class)) {
    var query = tagName + (opt_class ? "." + opt_class : "");
    return parent.querySelectorAll(query);
  }
  if (opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);
    if (tagName) {
      var arrayLike = {};
      var len = 0;
      for (var i = 0, el;el = els[i];i++) {
        if (tagName == el.nodeName) {
          arrayLike[len++] = el;
        }
      }
      arrayLike.length = len;
      return arrayLike;
    } else {
      return els;
    }
  }
  var els = parent.getElementsByTagName(tagName || "*");
  if (opt_class) {
    var arrayLike = {};
    var len = 0;
    for (var i = 0, el;el = els[i];i++) {
      var className = el.className;
      if (typeof className.split == "function" && goog.array.contains(className.split(/\s+/), opt_class)) {
        arrayLike[len++] = el;
      }
    }
    arrayLike.length = len;
    return arrayLike;
  } else {
    return els;
  }
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    if (key == "style") {
      element.style.cssText = val;
    } else {
      if (key == "class") {
        element.className = val;
      } else {
        if (key == "for") {
          element.htmlFor = val;
        } else {
          if (goog.dom.DIRECT_ATTRIBUTE_MAP_.hasOwnProperty(key)) {
            element.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[key], val);
          } else {
            if (goog.string.startsWith(key, "aria-") || goog.string.startsWith(key, "data-")) {
              element.setAttribute(key, val);
            } else {
              element[key] = val;
            }
          }
        }
      }
    }
  });
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {"cellpadding":"cellPadding", "cellspacing":"cellSpacing", "colspan":"colSpan", "frameborder":"frameBorder", "height":"height", "maxlength":"maxLength", "role":"role", "rowspan":"rowSpan", "type":"type", "usemap":"useMap", "valign":"vAlign", "width":"width"};
goog.dom.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize_(opt_window || window);
};
goog.dom.getViewportSize_ = function(win) {
  var doc = win.document;
  var el = goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new goog.math.Size(el.clientWidth, el.clientHeight);
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window);
};
goog.dom.getDocumentHeight_ = function(win) {
  var doc = win.document;
  var height = 0;
  if (doc) {
    var body = doc.body;
    var docEl = (doc.documentElement);
    if (!(docEl && body)) {
      return 0;
    }
    var vh = goog.dom.getViewportSize_(win).height;
    if (goog.dom.isCss1CompatMode_(doc) && docEl.scrollHeight) {
      height = docEl.scrollHeight != vh ? docEl.scrollHeight : docEl.offsetHeight;
    } else {
      var sh = docEl.scrollHeight;
      var oh = docEl.offsetHeight;
      if (docEl.clientHeight != oh) {
        sh = body.scrollHeight;
        oh = body.offsetHeight;
      }
      if (sh > vh) {
        height = sh > oh ? sh : oh;
      } else {
        height = sh < oh ? sh : oh;
      }
    }
  }
  return height;
};
goog.dom.getPageScroll = function(opt_window) {
  var win = opt_window || goog.global || window;
  return goog.dom.getDomHelper(win.document).getDocumentScroll();
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document);
};
goog.dom.getDocumentScroll_ = function(doc) {
  var el = goog.dom.getDocumentScrollElement_(doc);
  var win = goog.dom.getWindow_(doc);
  if (goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && win.pageYOffset != el.scrollTop) {
    return new goog.math.Coordinate(el.scrollLeft, el.scrollTop);
  }
  return new goog.math.Coordinate(win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop);
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document);
};
goog.dom.getDocumentScrollElement_ = function(doc) {
  if (doc.scrollingElement) {
    return doc.scrollingElement;
  }
  if (!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(doc)) {
    return doc.documentElement;
  }
  return doc.body || doc.documentElement;
};
goog.dom.getWindow = function(opt_doc) {
  return opt_doc ? goog.dom.getWindow_(opt_doc) : window;
};
goog.dom.getWindow_ = function(doc) {
  return doc.parentWindow || doc.defaultView;
};
goog.dom.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(document, arguments);
};
goog.dom.createDom_ = function(doc, args) {
  var tagName = args[0];
  var attributes = args[1];
  if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes && (attributes.name || attributes.type)) {
    var tagNameArr = ["<", tagName];
    if (attributes.name) {
      tagNameArr.push(' name="', goog.string.htmlEscape(attributes.name), '"');
    }
    if (attributes.type) {
      tagNameArr.push(' type="', goog.string.htmlEscape(attributes.type), '"');
      var clone = {};
      goog.object.extend(clone, attributes);
      delete clone["type"];
      attributes = clone;
    }
    tagNameArr.push(">");
    tagName = tagNameArr.join("");
  }
  var element = doc.createElement(tagName);
  if (attributes) {
    if (goog.isString(attributes)) {
      element.className = attributes;
    } else {
      if (goog.isArray(attributes)) {
        element.className = attributes.join(" ");
      } else {
        goog.dom.setProperties(element, attributes);
      }
    }
  }
  if (args.length > 2) {
    goog.dom.append_(doc, element, args, 2);
  }
  return element;
};
goog.dom.append_ = function(doc, parent, args, startIndex) {
  function childHandler(child) {
    if (child) {
      parent.appendChild(goog.isString(child) ? doc.createTextNode(child) : child);
    }
  }
  for (var i = startIndex;i < args.length;i++) {
    var arg = args[i];
    if (goog.isArrayLike(arg) && !goog.dom.isNodeLike(arg)) {
      goog.array.forEach(goog.dom.isNodeList(arg) ? goog.array.toArray(arg) : arg, childHandler);
    } else {
      childHandler(arg);
    }
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(name) {
  return document.createElement(name);
};
goog.dom.createTextNode = function(content) {
  return document.createTextNode(String(content));
};
goog.dom.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(document, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.createTable_ = function(doc, rows, columns, fillWithNbsp) {
  var table = (doc.createElement(goog.dom.TagName.TABLE));
  var tbody = table.appendChild(doc.createElement(goog.dom.TagName.TBODY));
  for (var i = 0;i < rows;i++) {
    var tr = doc.createElement(goog.dom.TagName.TR);
    for (var j = 0;j < columns;j++) {
      var td = doc.createElement(goog.dom.TagName.TD);
      if (fillWithNbsp) {
        goog.dom.setTextContent(td, goog.string.Unicode.NBSP);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  return table;
};
goog.dom.safeHtmlToNode = function(html) {
  return goog.dom.safeHtmlToNode_(document, html);
};
goog.dom.safeHtmlToNode_ = function(doc, html) {
  var tempDiv = doc.createElement(goog.dom.TagName.DIV);
  if (goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    goog.dom.safe.setInnerHtml(tempDiv, goog.html.SafeHtml.concat(goog.html.SafeHtml.create("br"), html));
    tempDiv.removeChild(tempDiv.firstChild);
  } else {
    goog.dom.safe.setInnerHtml(tempDiv, html);
  }
  return goog.dom.childrenToNode_(doc, tempDiv);
};
goog.dom.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(document, htmlString);
};
goog.dom.htmlToDocumentFragment_ = function(doc, htmlString) {
  var tempDiv = doc.createElement(goog.dom.TagName.DIV);
  if (goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    tempDiv.innerHTML = "<br>" + htmlString;
    tempDiv.removeChild(tempDiv.firstChild);
  } else {
    tempDiv.innerHTML = htmlString;
  }
  return goog.dom.childrenToNode_(doc, tempDiv);
};
goog.dom.childrenToNode_ = function(doc, tempDiv) {
  if (tempDiv.childNodes.length == 1) {
    return tempDiv.removeChild(tempDiv.firstChild);
  } else {
    var fragment = doc.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    return fragment;
  }
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document);
};
goog.dom.isCss1CompatMode_ = function(doc) {
  if (goog.dom.COMPAT_MODE_KNOWN_) {
    return goog.dom.ASSUME_STANDARDS_MODE;
  }
  return doc.compatMode == "CSS1Compat";
};
goog.dom.canHaveChildren = function(node) {
  if (node.nodeType != goog.dom.NodeType.ELEMENT) {
    return false;
  }
  switch((node).tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return false;
  }
  return true;
};
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child);
};
goog.dom.append = function(parent, var_args) {
  goog.dom.append_(goog.dom.getOwnerDocument(parent), parent, arguments, 1);
};
goog.dom.removeChildren = function(node) {
  var child;
  while (child = node.firstChild) {
    node.removeChild(child);
  }
};
goog.dom.insertSiblingBefore = function(newNode, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode);
  }
};
goog.dom.insertSiblingAfter = function(newNode, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
  }
};
goog.dom.insertChildAt = function(parent, child, index) {
  parent.insertBefore(child, parent.childNodes[index] || null);
};
goog.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
};
goog.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  if (parent) {
    parent.replaceChild(newNode, oldNode);
  }
};
goog.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if (parent && parent.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if (element.removeNode) {
      return (element.removeNode(false));
    } else {
      while (child = element.firstChild) {
        parent.insertBefore(child, element);
      }
      return (goog.dom.removeNode(element));
    }
  }
};
goog.dom.getChildren = function(element) {
  if (goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && element.children != undefined) {
    return element.children;
  }
  return goog.array.filter(element.childNodes, function(node) {
    return node.nodeType == goog.dom.NodeType.ELEMENT;
  });
};
goog.dom.getFirstElementChild = function(node) {
  if (goog.isDef(node.firstElementChild)) {
    return (node).firstElementChild;
  }
  return goog.dom.getNextElementNode_(node.firstChild, true);
};
goog.dom.getLastElementChild = function(node) {
  if (goog.isDef(node.lastElementChild)) {
    return (node).lastElementChild;
  }
  return goog.dom.getNextElementNode_(node.lastChild, false);
};
goog.dom.getNextElementSibling = function(node) {
  if (goog.isDef(node.nextElementSibling)) {
    return (node).nextElementSibling;
  }
  return goog.dom.getNextElementNode_(node.nextSibling, true);
};
goog.dom.getPreviousElementSibling = function(node) {
  if (goog.isDef(node.previousElementSibling)) {
    return (node).previousElementSibling;
  }
  return goog.dom.getNextElementNode_(node.previousSibling, false);
};
goog.dom.getNextElementNode_ = function(node, forward) {
  while (node && node.nodeType != goog.dom.NodeType.ELEMENT) {
    node = forward ? node.nextSibling : node.previousSibling;
  }
  return (node);
};
goog.dom.getNextNode = function(node) {
  if (!node) {
    return null;
  }
  if (node.firstChild) {
    return node.firstChild;
  }
  while (node && !node.nextSibling) {
    node = node.parentNode;
  }
  return node ? node.nextSibling : null;
};
goog.dom.getPreviousNode = function(node) {
  if (!node) {
    return null;
  }
  if (!node.previousSibling) {
    return node.parentNode;
  }
  node = node.previousSibling;
  while (node && node.lastChild) {
    node = node.lastChild;
  }
  return node;
};
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && obj.nodeType > 0;
};
goog.dom.isElement = function(obj) {
  return goog.isObject(obj) && obj.nodeType == goog.dom.NodeType.ELEMENT;
};
goog.dom.isWindow = function(obj) {
  return goog.isObject(obj) && obj["window"] == obj;
};
goog.dom.getParentElement = function(element) {
  var parent;
  if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    var isIe9 = goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10");
    if (!(isIe9 && goog.global["SVGElement"] && element instanceof goog.global["SVGElement"])) {
      parent = element.parentElement;
      if (parent) {
        return parent;
      }
    }
  }
  parent = element.parentNode;
  return goog.dom.isElement(parent) ? (parent) : null;
};
goog.dom.contains = function(parent, descendant) {
  if (parent.contains && descendant.nodeType == goog.dom.NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant);
  }
  if (typeof parent.compareDocumentPosition != "undefined") {
    return parent == descendant || Boolean(parent.compareDocumentPosition(descendant) & 16);
  }
  while (descendant && parent != descendant) {
    descendant = descendant.parentNode;
  }
  return descendant == parent;
};
goog.dom.compareNodeOrder = function(node1, node2) {
  if (node1 == node2) {
    return 0;
  }
  if (node1.compareDocumentPosition) {
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1;
  }
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if (node1.nodeType == goog.dom.NodeType.DOCUMENT) {
      return -1;
    }
    if (node2.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1;
    }
  }
  if ("sourceIndex" in node1 || node1.parentNode && "sourceIndex" in node1.parentNode) {
    var isElement1 = node1.nodeType == goog.dom.NodeType.ELEMENT;
    var isElement2 = node2.nodeType == goog.dom.NodeType.ELEMENT;
    if (isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex;
    } else {
      var parent1 = node1.parentNode;
      var parent2 = node2.parentNode;
      if (parent1 == parent2) {
        return goog.dom.compareSiblingOrder_(node1, node2);
      }
      if (!isElement1 && goog.dom.contains(parent1, node2)) {
        return -1 * goog.dom.compareParentsDescendantNodeIe_(node1, node2);
      }
      if (!isElement2 && goog.dom.contains(parent2, node1)) {
        return goog.dom.compareParentsDescendantNodeIe_(node2, node1);
      }
      return (isElement1 ? node1.sourceIndex : parent1.sourceIndex) - (isElement2 ? node2.sourceIndex : parent2.sourceIndex);
    }
  }
  var doc = goog.dom.getOwnerDocument(node1);
  var range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(true);
  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(true);
  return range1.compareBoundaryPoints(goog.global["Range"].START_TO_END, range2);
};
goog.dom.compareParentsDescendantNodeIe_ = function(textNode, node) {
  var parent = textNode.parentNode;
  if (parent == node) {
    return -1;
  }
  var sibling = node;
  while (sibling.parentNode != parent) {
    sibling = sibling.parentNode;
  }
  return goog.dom.compareSiblingOrder_(sibling, textNode);
};
goog.dom.compareSiblingOrder_ = function(node1, node2) {
  var s = node2;
  while (s = s.previousSibling) {
    if (s == node1) {
      return -1;
    }
  }
  return 1;
};
goog.dom.findCommonAncestor = function(var_args) {
  var i, count = arguments.length;
  if (!count) {
    return null;
  } else {
    if (count == 1) {
      return arguments[0];
    }
  }
  var paths = [];
  var minLength = Infinity;
  for (i = 0;i < count;i++) {
    var ancestors = [];
    var node = arguments[i];
    while (node) {
      ancestors.unshift(node);
      node = node.parentNode;
    }
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length);
  }
  var output = null;
  for (i = 0;i < minLength;i++) {
    var first = paths[0][i];
    for (var j = 1;j < count;j++) {
      if (first != paths[j][i]) {
        return output;
      }
    }
    output = first;
  }
  return output;
};
goog.dom.getOwnerDocument = function(node) {
  goog.asserts.assert(node, "Node cannot be null or undefined.");
  return (node.nodeType == goog.dom.NodeType.DOCUMENT ? node : node.ownerDocument || node.document);
};
goog.dom.getFrameContentDocument = function(frame) {
  return frame.contentDocument || frame.contentWindow.document;
};
goog.dom.getFrameContentWindow = function(frame) {
  try {
    return frame.contentWindow || (frame.contentDocument ? goog.dom.getWindow(frame.contentDocument) : null);
  } catch (e) {
  }
  return null;
};
goog.dom.setTextContent = function(node, text) {
  goog.asserts.assert(node != null, "goog.dom.setTextContent expects a non-null value for node");
  if ("textContent" in node) {
    node.textContent = text;
  } else {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      node.data = text;
    } else {
      if (node.firstChild && node.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        while (node.lastChild != node.firstChild) {
          node.removeChild(node.lastChild);
        }
        node.firstChild.data = text;
      } else {
        goog.dom.removeChildren(node);
        var doc = goog.dom.getOwnerDocument(node);
        node.appendChild(doc.createTextNode(String(text)));
      }
    }
  }
};
goog.dom.getOuterHtml = function(element) {
  if ("outerHTML" in element) {
    return element.outerHTML;
  } else {
    var doc = goog.dom.getOwnerDocument(element);
    var div = doc.createElement(goog.dom.TagName.DIV);
    div.appendChild(element.cloneNode(true));
    return div.innerHTML;
  }
};
goog.dom.findNode = function(root, p) {
  var rv = [];
  var found = goog.dom.findNodes_(root, p, rv, true);
  return found ? rv[0] : undefined;
};
goog.dom.findNodes = function(root, p) {
  var rv = [];
  goog.dom.findNodes_(root, p, rv, false);
  return rv;
};
goog.dom.findNodes_ = function(root, p, rv, findOne) {
  if (root != null) {
    var child = root.firstChild;
    while (child) {
      if (p(child)) {
        rv.push(child);
        if (findOne) {
          return true;
        }
      }
      if (goog.dom.findNodes_(child, p, rv, findOne)) {
        return true;
      }
      child = child.nextSibling;
    }
  }
  return false;
};
goog.dom.TAGS_TO_IGNORE_ = {"SCRIPT":1, "STYLE":1, "HEAD":1, "IFRAME":1, "OBJECT":1};
goog.dom.PREDEFINED_TAG_VALUES_ = {"IMG":" ", "BR":"\n"};
goog.dom.isFocusableTabIndex = function(element) {
  return goog.dom.hasSpecifiedTabIndex_(element) && goog.dom.isTabIndexFocusable_(element);
};
goog.dom.setFocusableTabIndex = function(element, enable) {
  if (enable) {
    element.tabIndex = 0;
  } else {
    element.tabIndex = -1;
    element.removeAttribute("tabIndex");
  }
};
goog.dom.isFocusable = function(element) {
  var focusable;
  if (goog.dom.nativelySupportsFocus_(element)) {
    focusable = !element.disabled && (!goog.dom.hasSpecifiedTabIndex_(element) || goog.dom.isTabIndexFocusable_(element));
  } else {
    focusable = goog.dom.isFocusableTabIndex(element);
  }
  return focusable && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(element) : focusable;
};
goog.dom.hasSpecifiedTabIndex_ = function(element) {
  var attrNode = element.getAttributeNode("tabindex");
  return goog.isDefAndNotNull(attrNode) && attrNode.specified;
};
goog.dom.isTabIndexFocusable_ = function(element) {
  var index = element.tabIndex;
  return goog.isNumber(index) && index >= 0 && index < 32768;
};
goog.dom.nativelySupportsFocus_ = function(element) {
  return element.tagName == goog.dom.TagName.A || element.tagName == goog.dom.TagName.INPUT || element.tagName == goog.dom.TagName.TEXTAREA || element.tagName == goog.dom.TagName.SELECT || element.tagName == goog.dom.TagName.BUTTON;
};
goog.dom.hasNonZeroBoundingRect_ = function(element) {
  var rect = goog.isFunction(element["getBoundingClientRect"]) ? element.getBoundingClientRect() : {"height":element.offsetHeight, "width":element.offsetWidth};
  return goog.isDefAndNotNull(rect) && rect.height > 0 && rect.width > 0;
};
goog.dom.getTextContent = function(node) {
  var textContent;
  if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in node) {
    textContent = goog.string.canonicalizeNewlines(node.innerText);
  } else {
    var buf = [];
    goog.dom.getTextContent_(node, buf, true);
    textContent = buf.join("");
  }
  textContent = textContent.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  textContent = textContent.replace(/\u200B/g, "");
  if (!goog.dom.BrowserFeature.CAN_USE_INNER_TEXT) {
    textContent = textContent.replace(/ +/g, " ");
  }
  if (textContent != " ") {
    textContent = textContent.replace(/^\s*/, "");
  }
  return textContent;
};
goog.dom.getRawTextContent = function(node) {
  var buf = [];
  goog.dom.getTextContent_(node, buf, false);
  return buf.join("");
};
goog.dom.getTextContent_ = function(node, buf, normalizeWhitespace) {
  if (node.nodeName in goog.dom.TAGS_TO_IGNORE_) {
  } else {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      if (normalizeWhitespace) {
        buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ""));
      } else {
        buf.push(node.nodeValue);
      }
    } else {
      if (node.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        buf.push(goog.dom.PREDEFINED_TAG_VALUES_[node.nodeName]);
      } else {
        var child = node.firstChild;
        while (child) {
          goog.dom.getTextContent_(child, buf, normalizeWhitespace);
          child = child.nextSibling;
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(node) {
  return goog.dom.getTextContent(node).length;
};
goog.dom.getNodeTextOffset = function(node, opt_offsetParent) {
  var root = opt_offsetParent || goog.dom.getOwnerDocument(node).body;
  var buf = [];
  while (node && node != root) {
    var cur = node;
    while (cur = cur.previousSibling) {
      buf.unshift(goog.dom.getTextContent(cur));
    }
    node = node.parentNode;
  }
  return goog.string.trimLeft(buf.join("")).replace(/ +/g, " ").length;
};
goog.dom.getNodeAtOffset = function(parent, offset, opt_result) {
  var stack = [parent], pos = 0, cur = null;
  while (stack.length > 0 && pos < offset) {
    cur = stack.pop();
    if (cur.nodeName in goog.dom.TAGS_TO_IGNORE_) {
    } else {
      if (cur.nodeType == goog.dom.NodeType.TEXT) {
        var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        pos += text.length;
      } else {
        if (cur.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          pos += goog.dom.PREDEFINED_TAG_VALUES_[cur.nodeName].length;
        } else {
          for (var i = cur.childNodes.length - 1;i >= 0;i--) {
            stack.push(cur.childNodes[i]);
          }
        }
      }
    }
  }
  if (goog.isObject(opt_result)) {
    opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0;
    opt_result.node = cur;
  }
  return cur;
};
goog.dom.isNodeList = function(val) {
  if (val && typeof val.length == "number") {
    if (goog.isObject(val)) {
      return typeof val.item == "function" || typeof val.item == "string";
    } else {
      if (goog.isFunction(val)) {
        return typeof val.item == "function";
      }
    }
  }
  return false;
};
goog.dom.getAncestorByTagNameAndClass = function(element, opt_tag, opt_class, opt_maxSearchSteps) {
  if (!opt_tag && !opt_class) {
    return null;
  }
  var tagName = opt_tag ? opt_tag.toUpperCase() : null;
  return (goog.dom.getAncestor(element, function(node) {
    return (!tagName || node.nodeName == tagName) && (!opt_class || goog.isString(node.className) && goog.array.contains(node.className.split(/\s+/), opt_class));
  }, true, opt_maxSearchSteps));
};
goog.dom.getAncestorByClass = function(element, className, opt_maxSearchSteps) {
  return goog.dom.getAncestorByTagNameAndClass(element, null, className, opt_maxSearchSteps);
};
goog.dom.getAncestor = function(element, matcher, opt_includeNode, opt_maxSearchSteps) {
  if (!opt_includeNode) {
    element = element.parentNode;
  }
  var ignoreSearchSteps = opt_maxSearchSteps == null;
  var steps = 0;
  while (element && (ignoreSearchSteps || steps <= opt_maxSearchSteps)) {
    goog.asserts.assert(element.name != "parentNode");
    if (matcher(element)) {
      return element;
    }
    element = element.parentNode;
    steps++;
  }
  return null;
};
goog.dom.getActiveElement = function(doc) {
  try {
    return doc && doc.activeElement;
  } catch (e) {
  }
  return null;
};
goog.dom.getPixelRatio = function() {
  var win = goog.dom.getWindow();
  if (goog.isDef(win.devicePixelRatio)) {
    return win.devicePixelRatio;
  } else {
    if (win.matchMedia) {
      return goog.dom.matchesPixelRatio_(.75) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(3) || 1;
    }
  }
  return 1;
};
goog.dom.matchesPixelRatio_ = function(pixelRatio) {
  var win = goog.dom.getWindow();
  var query = "(-webkit-min-device-pixel-ratio: " + pixelRatio + ")," + "(min--moz-device-pixel-ratio: " + pixelRatio + ")," + "(min-resolution: " + pixelRatio + "dppx)";
  return win.matchMedia(query).matches ? pixelRatio : 0;
};
goog.dom.DomHelper = function(opt_document) {
  this.document_ = opt_document || goog.global.document || document;
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(document) {
  this.document_ = document;
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_;
};
goog.dom.DomHelper.prototype.getElement = function(element) {
  return goog.dom.getElementHelper_(this.document_, element);
};
goog.dom.DomHelper.prototype.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(this.document_, id);
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, opt_tag, opt_class, opt_el);
};
goog.dom.DomHelper.prototype.getElementsByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementsByClass(className, doc);
};
goog.dom.DomHelper.prototype.getElementByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementByClass(className, doc);
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(className, opt_root) {
  var root = opt_root || this.document_;
  return goog.dom.getRequiredElementByClass(className, root);
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize(opt_window || this.getWindow());
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow());
};
goog.dom.Appendable;
goog.dom.DomHelper.prototype.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(this.document_, arguments);
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(name) {
  return this.document_.createElement(name);
};
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(String(content));
};
goog.dom.DomHelper.prototype.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(this.document_, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.DomHelper.prototype.safeHtmlToNode = function(html) {
  return goog.dom.safeHtmlToNode_(this.document_, html);
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(this.document_, htmlString);
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_);
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_);
};
goog.dom.DomHelper.prototype.getActiveElement = function(opt_doc) {
  return goog.dom.getActiveElement(opt_doc || this.document_);
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
/*

 Copyright 2016 Google Inc. All rights reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
goog.provide("vsaq.questionnaire.utils");
goog.provide("vsaq.questionnaire.utils.InvalidExpressionError");
goog.provide("vsaq.questionnaire.utils.globals");
goog.require("goog.array");
goog.require("goog.debug.Error");
goog.require("goog.dom");
vsaq.questionnaire.utils.findById = function(element, id) {
  return (goog.dom.findNode(element, function(d) {
    return d.id == id;
  }));
};
vsaq.questionnaire.utils.InvalidExpressionError = function(opt_message) {
  opt_message = "Invalid expression" || opt_message;
  goog.base(this, opt_message);
};
goog.inherits(vsaq.questionnaire.utils.InvalidExpressionError, goog.debug.Error);
vsaq.questionnaire.utils.isOperator_ = function(character) {
  if (!character || character.length > 1) {
    return false;
  }
  return "&|!,".indexOf(character) > -1;
};
vsaq.questionnaire.utils.evalExpression = function(expression, resolver) {
  var token = vsaq.questionnaire.utils.tokenizeExpression(expression);
  return !!vsaq.questionnaire.utils.evalTokenizedExpression_(token, resolver);
};
vsaq.questionnaire.utils.evalTokenizedExpression_ = function(expression, resolver) {
  if (!expression.length) {
    return true;
  }
  var results = [];
  goog.array.forEach(expression, function(item) {
    if (goog.isArray(item)) {
      results.push(vsaq.questionnaire.utils.evalTokenizedExpression_(item, resolver));
    } else {
      if (item[0] == '"') {
        results.push(item);
      } else {
        if (vsaq.questionnaire.utils.isOperator_(item)) {
          results.push(item);
        } else {
          if (vsaq.questionnaire.utils.globals.hasOwnProperty(item)) {
            results.push(vsaq.questionnaire.utils.globals[item]);
          } else {
            results.push(resolver(item));
          }
        }
      }
    }
  });
  var results2 = [];
  for (var i = 0;i < results.length;i++) {
    if (results[i] == "!") {
      results2.push(!results[++i]);
    } else {
      results2.push(results[i]);
    }
  }
  var results3 = [];
  for (var i = 0;i < results2.length;i++) {
    var item = results2[i];
    if (typeof item == "function") {
      var args = results2[++i];
      if (!goog.isArray(args)) {
        args = [args];
      }
      args = goog.array.map(args, function(arg) {
        if (typeof arg == "string") {
          return arg.replace(/\\(.)|^"|"$/g, "$1");
        }
        return arg;
      });
      results3.push(item.apply(null, args));
    } else {
      results3.push(results2[i]);
    }
  }
  var result = results3[0];
  var collection = [result];
  var returnValue;
  for (var i = 0;i < results3.length;i++) {
    var item = results3[i];
    if (vsaq.questionnaire.utils.isOperator_(item)) {
      var arg = results3[++i];
      switch(item) {
        case "&":
          result = result && arg;
          break;
        case "|":
          result = result || arg;
          break;
        case ",":
          returnValue = collection;
          break;
      }
      collection.push(arg);
    } else {
      if (i) {
        throw new vsaq.questionnaire.utils.InvalidExpressionError;
      }
    }
  }
  if (returnValue) {
    return returnValue;
  }
  return result;
};
vsaq.questionnaire.utils.globals = {"matches":function(string, regexp, flags) {
  return !!string.match(new RegExp(regexp, flags));
}, "contains":function(string, needle) {
  return string.indexOf(needle) != -1;
}};
vsaq.questionnaire.utils.tokenizeExpression = function(expression) {
  var token = vsaq.questionnaire.utils.tokenizeExpression_(expression, 0);
  return token[0];
};
vsaq.questionnaire.utils.tokenizeExpression_ = function(expression, position) {
  var specialChars = " ()!&|,";
  var group = [];
  var currentVar = "";
  for (var i = position;i < expression.length;i++) {
    if (expression[i] == '"' && !currentVar) {
      currentVar += vsaq.questionnaire.utils.consumeString_(expression, i);
      i += currentVar.length - 1;
    } else {
      if (specialChars.indexOf(expression[i]) == -1) {
        currentVar += expression[i];
      } else {
        if (currentVar) {
          if (!goog.array.isEmpty(group) && !vsaq.questionnaire.utils.isOperator_(group[group.length - 1])) {
            throw new vsaq.questionnaire.utils.InvalidExpressionError;
          }
          group.push(currentVar);
          currentVar = "";
        }
        switch(expression[i]) {
          case "(":
            if (!goog.array.isEmpty(group) && !vsaq.questionnaire.utils.isOperator_(group[group.length - 1]) && !group[group.length - 1]) {
              throw new vsaq.questionnaire.utils.InvalidExpressionError;
            }
            var newGroup = vsaq.questionnaire.utils.tokenizeExpression_(expression, i + 1);
            group.push(newGroup[0]);
            i = newGroup[1];
            if (i == -1) {
              throw new vsaq.questionnaire.utils.InvalidExpressionError;
            }
            break;
          case ")":
            if (expression[position - 1] != "(") {
              throw new vsaq.questionnaire.utils.InvalidExpressionError;
            }
            if (position) {
              return [group, i];
            }
            break;
          case "&":
          ;
          case "|":
            if (expression[i] != expression[++i]) {
              throw new vsaq.questionnaire.utils.InvalidExpressionError;
            }
          ;
          case ",":
            if (vsaq.questionnaire.utils.isOperator_(group[group.length - 1])) {
              throw new vsaq.questionnaire.utils.InvalidExpressionError;
            }
          ;
          case "!":
            group.push(expression[i]);
        }
      }
    }
  }
  currentVar && group.push(currentVar);
  return [group, -1];
};
vsaq.questionnaire.utils.consumeString_ = function(expression, position) {
  if (expression[position] != '"') {
    throw new vsaq.questionnaire.utils.InvalidExpressionError;
  }
  var string = '"';
  for (var i = position + 1;i < expression.length;i++) {
    switch(expression[i]) {
      default:
        string += expression[i];
        break;
      case '"':
        return string + '"';
      case "\\":
        string += expression[i] + expression[++i];
    }
  }
  throw new vsaq.questionnaire.utils.InvalidExpressionError;
};
goog.provide("goog.a11y.aria");
goog.require("goog.a11y.aria.Role");
goog.require("goog.a11y.aria.State");
goog.require("goog.a11y.aria.datatables");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.object");
goog.require("goog.string");
goog.a11y.aria.ARIA_PREFIX_ = "aria-";
goog.a11y.aria.ROLE_ATTRIBUTE_ = "role";
goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_ = [goog.dom.TagName.A, goog.dom.TagName.AREA, goog.dom.TagName.BUTTON, goog.dom.TagName.HEAD, goog.dom.TagName.INPUT, goog.dom.TagName.LINK, goog.dom.TagName.MENU, goog.dom.TagName.META, goog.dom.TagName.OPTGROUP, goog.dom.TagName.OPTION, goog.dom.TagName.PROGRESS, goog.dom.TagName.STYLE, goog.dom.TagName.SELECT, goog.dom.TagName.SOURCE, goog.dom.TagName.TEXTAREA, goog.dom.TagName.TITLE, goog.dom.TagName.TRACK];
goog.a11y.aria.CONTAINER_ROLES_ = [goog.a11y.aria.Role.COMBOBOX, goog.a11y.aria.Role.GRID, goog.a11y.aria.Role.GROUP, goog.a11y.aria.Role.LISTBOX, goog.a11y.aria.Role.MENU, goog.a11y.aria.Role.MENUBAR, goog.a11y.aria.Role.RADIOGROUP, goog.a11y.aria.Role.ROW, goog.a11y.aria.Role.ROWGROUP, goog.a11y.aria.Role.TAB_LIST, goog.a11y.aria.Role.TEXTBOX, goog.a11y.aria.Role.TOOLBAR, goog.a11y.aria.Role.TREE, goog.a11y.aria.Role.TREEGRID];
goog.a11y.aria.setRole = function(element, roleName) {
  if (!roleName) {
    goog.a11y.aria.removeRole(element);
  } else {
    if (goog.asserts.ENABLE_ASSERTS) {
      goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.Role, roleName), "No such ARIA role " + roleName);
    }
    element.setAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_, roleName);
  }
};
goog.a11y.aria.getRole = function(element) {
  var role = element.getAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_);
  return (role) || null;
};
goog.a11y.aria.removeRole = function(element) {
  element.removeAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_);
};
goog.a11y.aria.setState = function(element, stateName, value) {
  if (goog.isArray(value)) {
    value = value.join(" ");
  }
  var attrStateName = goog.a11y.aria.getAriaAttributeName_(stateName);
  if (value === "" || value == undefined) {
    var defaultValueMap = goog.a11y.aria.datatables.getDefaultValuesMap();
    if (stateName in defaultValueMap) {
      element.setAttribute(attrStateName, defaultValueMap[stateName]);
    } else {
      element.removeAttribute(attrStateName);
    }
  } else {
    element.setAttribute(attrStateName, value);
  }
};
goog.a11y.aria.toggleState = function(el, attr) {
  var val = goog.a11y.aria.getState(el, attr);
  if (!goog.string.isEmptyOrWhitespace(goog.string.makeSafe(val)) && !(val == "true" || val == "false")) {
    goog.a11y.aria.removeState(el, (attr));
    return;
  }
  goog.a11y.aria.setState(el, attr, val == "true" ? "false" : "true");
};
goog.a11y.aria.removeState = function(element, stateName) {
  element.removeAttribute(goog.a11y.aria.getAriaAttributeName_(stateName));
};
goog.a11y.aria.getState = function(element, stateName) {
  var attr = (element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName)));
  var isNullOrUndefined = attr == null || attr == undefined;
  return isNullOrUndefined ? "" : String(attr);
};
goog.a11y.aria.getActiveDescendant = function(element) {
  var id = goog.a11y.aria.getState(element, goog.a11y.aria.State.ACTIVEDESCENDANT);
  return goog.dom.getOwnerDocument(element).getElementById(id);
};
goog.a11y.aria.setActiveDescendant = function(element, activeElement) {
  var id = "";
  if (activeElement) {
    id = activeElement.id;
    goog.asserts.assert(id, "The active element should have an id.");
  }
  goog.a11y.aria.setState(element, goog.a11y.aria.State.ACTIVEDESCENDANT, id);
};
goog.a11y.aria.getLabel = function(element) {
  return goog.a11y.aria.getState(element, goog.a11y.aria.State.LABEL);
};
goog.a11y.aria.setLabel = function(element, label) {
  goog.a11y.aria.setState(element, goog.a11y.aria.State.LABEL, label);
};
goog.a11y.aria.assertRoleIsSetInternalUtil = function(element, allowedRoles) {
  if (goog.array.contains(goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_, element.tagName)) {
    return;
  }
  var elementRole = (goog.a11y.aria.getRole(element));
  goog.asserts.assert(elementRole != null, "The element ARIA role cannot be null.");
  goog.asserts.assert(goog.array.contains(allowedRoles, elementRole), "Non existing or incorrect role set for element." + 'The role set is "' + elementRole + '". The role should be any of "' + allowedRoles + '". Check the ARIA specification for more details ' + "http://www.w3.org/TR/wai-aria/roles.");
};
goog.a11y.aria.getStateBoolean = function(element, stateName) {
  var attr = (element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName)));
  goog.asserts.assert(goog.isBoolean(attr) || attr == null || attr == "true" || attr == "false");
  if (attr == null) {
    return attr;
  }
  return goog.isBoolean(attr) ? attr : attr == "true";
};
goog.a11y.aria.getStateNumber = function(element, stateName) {
  var attr = (element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName)));
  goog.asserts.assert((attr == null || !isNaN(Number(attr))) && !goog.isBoolean(attr));
  return attr == null ? null : Number(attr);
};
goog.a11y.aria.getStateString = function(element, stateName) {
  var attr = element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName));
  goog.asserts.assert((attr == null || goog.isString(attr)) && (attr == "" || isNaN(Number(attr))) && attr != "true" && attr != "false");
  return attr == null || attr == "" ? null : attr;
};
goog.a11y.aria.getStringArrayStateInternalUtil = function(element, stateName) {
  var attrValue = element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName));
  return goog.a11y.aria.splitStringOnWhitespace_(attrValue);
};
goog.a11y.aria.hasState = function(element, stateName) {
  return element.hasAttribute(goog.a11y.aria.getAriaAttributeName_(stateName));
};
goog.a11y.aria.isContainerRole = function(element) {
  var role = goog.a11y.aria.getRole(element);
  return goog.array.contains(goog.a11y.aria.CONTAINER_ROLES_, role);
};
goog.a11y.aria.splitStringOnWhitespace_ = function(stringValue) {
  return stringValue ? stringValue.split(/\s+/) : [];
};
goog.a11y.aria.getAriaAttributeName_ = function(ariaName) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.assert(ariaName, "ARIA attribute cannot be empty.");
    goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.State, ariaName), "No such ARIA attribute " + ariaName);
  }
  return goog.a11y.aria.ARIA_PREFIX_ + ariaName;
};
goog.provide("goog.style");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.TagName");
goog.require("goog.dom.vendor");
goog.require("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Rect");
goog.require("goog.math.Size");
goog.require("goog.object");
goog.require("goog.reflect");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.forwardDeclare("goog.events.BrowserEvent");
goog.forwardDeclare("goog.events.Event");
goog.style.setStyle = function(element, style, opt_value) {
  if (goog.isString(style)) {
    goog.style.setStyle_(element, opt_value, style);
  } else {
    for (var key in style) {
      goog.style.setStyle_(element, style[key], key);
    }
  }
};
goog.style.setStyle_ = function(element, value, style) {
  var propertyName = goog.style.getVendorJsStyleName_(element, style);
  if (propertyName) {
    element.style[propertyName] = value;
  }
};
goog.style.styleNameCache_ = {};
goog.style.getVendorJsStyleName_ = function(element, style) {
  var propertyName = goog.style.styleNameCache_[style];
  if (!propertyName) {
    var camelStyle = goog.string.toCamelCase(style);
    propertyName = camelStyle;
    if (element.style[camelStyle] === undefined) {
      var prefixedStyle = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(camelStyle);
      if (element.style[prefixedStyle] !== undefined) {
        propertyName = prefixedStyle;
      }
    }
    goog.style.styleNameCache_[style] = propertyName;
  }
  return propertyName;
};
goog.style.getVendorStyleName_ = function(element, style) {
  var camelStyle = goog.string.toCamelCase(style);
  if (element.style[camelStyle] === undefined) {
    var prefixedStyle = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(camelStyle);
    if (element.style[prefixedStyle] !== undefined) {
      return goog.dom.vendor.getVendorPrefix() + "-" + style;
    }
  }
  return style;
};
goog.style.getStyle = function(element, property) {
  var styleValue = element.style[goog.string.toCamelCase(property)];
  if (typeof styleValue !== "undefined") {
    return styleValue;
  }
  return element.style[goog.style.getVendorJsStyleName_(element, property)] || "";
};
goog.style.getComputedStyle = function(element, property) {
  var doc = goog.dom.getOwnerDocument(element);
  if (doc.defaultView && doc.defaultView.getComputedStyle) {
    var styles = doc.defaultView.getComputedStyle(element, null);
    if (styles) {
      return styles[property] || styles.getPropertyValue(property) || "";
    }
  }
  return "";
};
goog.style.getCascadedStyle = function(element, style) {
  return element.currentStyle ? element.currentStyle[style] : null;
};
goog.style.getStyle_ = function(element, style) {
  return goog.style.getComputedStyle(element, style) || goog.style.getCascadedStyle(element, style) || element.style && element.style[style];
};
goog.style.getComputedBoxSizing = function(element) {
  return goog.style.getStyle_(element, "boxSizing") || goog.style.getStyle_(element, "MozBoxSizing") || goog.style.getStyle_(element, "WebkitBoxSizing") || null;
};
goog.style.getComputedPosition = function(element) {
  return goog.style.getStyle_(element, "position");
};
goog.style.getBackgroundColor = function(element) {
  return goog.style.getStyle_(element, "backgroundColor");
};
goog.style.getComputedOverflowX = function(element) {
  return goog.style.getStyle_(element, "overflowX");
};
goog.style.getComputedOverflowY = function(element) {
  return goog.style.getStyle_(element, "overflowY");
};
goog.style.getComputedZIndex = function(element) {
  return goog.style.getStyle_(element, "zIndex");
};
goog.style.getComputedTextAlign = function(element) {
  return goog.style.getStyle_(element, "textAlign");
};
goog.style.getComputedCursor = function(element) {
  return goog.style.getStyle_(element, "cursor");
};
goog.style.getComputedTransform = function(element) {
  var property = goog.style.getVendorStyleName_(element, "transform");
  return goog.style.getStyle_(element, property) || goog.style.getStyle_(element, "transform");
};
goog.style.setPosition = function(el, arg1, opt_arg2) {
  var x, y;
  if (arg1 instanceof goog.math.Coordinate) {
    x = arg1.x;
    y = arg1.y;
  } else {
    x = arg1;
    y = opt_arg2;
  }
  el.style.left = goog.style.getPixelStyleValue_((x), false);
  el.style.top = goog.style.getPixelStyleValue_((y), false);
};
goog.style.getPosition = function(element) {
  return new goog.math.Coordinate((element).offsetLeft, (element).offsetTop);
};
goog.style.getClientViewportElement = function(opt_node) {
  var doc;
  if (opt_node) {
    doc = goog.dom.getOwnerDocument(opt_node);
  } else {
    doc = goog.dom.getDocument();
  }
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9) && !goog.dom.getDomHelper(doc).isCss1CompatMode()) {
    return doc.body;
  }
  return doc.documentElement;
};
goog.style.getViewportPageOffset = function(doc) {
  var body = doc.body;
  var documentElement = doc.documentElement;
  var scrollLeft = body.scrollLeft || documentElement.scrollLeft;
  var scrollTop = body.scrollTop || documentElement.scrollTop;
  return new goog.math.Coordinate(scrollLeft, scrollTop);
};
goog.style.getBoundingClientRect_ = function(el) {
  var rect;
  try {
    rect = el.getBoundingClientRect();
  } catch (e) {
    return {"left":0, "top":0, "right":0, "bottom":0};
  }
  if (goog.userAgent.IE && el.ownerDocument.body) {
    var doc = el.ownerDocument;
    rect.left -= doc.documentElement.clientLeft + doc.body.clientLeft;
    rect.top -= doc.documentElement.clientTop + doc.body.clientTop;
  }
  return rect;
};
goog.style.getOffsetParent = function(element) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) {
    return element.offsetParent;
  }
  var doc = goog.dom.getOwnerDocument(element);
  var positionStyle = goog.style.getStyle_(element, "position");
  var skipStatic = positionStyle == "fixed" || positionStyle == "absolute";
  for (var parent = element.parentNode;parent && parent != doc;parent = parent.parentNode) {
    if (parent.nodeType == goog.dom.NodeType.DOCUMENT_FRAGMENT && parent.host) {
      parent = parent.host;
    }
    positionStyle = goog.style.getStyle_((parent), "position");
    skipStatic = skipStatic && positionStyle == "static" && parent != doc.documentElement && parent != doc.body;
    if (!skipStatic && (parent.scrollWidth > parent.clientWidth || parent.scrollHeight > parent.clientHeight || positionStyle == "fixed" || positionStyle == "absolute" || positionStyle == "relative")) {
      return (parent);
    }
  }
  return null;
};
goog.style.getVisibleRectForElement = function(element) {
  var visibleRect = new goog.math.Box(0, Infinity, Infinity, 0);
  var dom = goog.dom.getDomHelper(element);
  var body = dom.getDocument().body;
  var documentElement = dom.getDocument().documentElement;
  var scrollEl = dom.getDocumentScrollElement();
  for (var el = element;el = goog.style.getOffsetParent(el);) {
    if ((!goog.userAgent.IE || el.clientWidth != 0) && (!goog.userAgent.WEBKIT || el.clientHeight != 0 || el != body) && (el != body && el != documentElement && goog.style.getStyle_(el, "overflow") != "visible")) {
      var pos = goog.style.getPageOffset(el);
      var client = goog.style.getClientLeftTop(el);
      pos.x += client.x;
      pos.y += client.y;
      visibleRect.top = Math.max(visibleRect.top, pos.y);
      visibleRect.right = Math.min(visibleRect.right, pos.x + el.clientWidth);
      visibleRect.bottom = Math.min(visibleRect.bottom, pos.y + el.clientHeight);
      visibleRect.left = Math.max(visibleRect.left, pos.x);
    }
  }
  var scrollX = scrollEl.scrollLeft, scrollY = scrollEl.scrollTop;
  visibleRect.left = Math.max(visibleRect.left, scrollX);
  visibleRect.top = Math.max(visibleRect.top, scrollY);
  var winSize = dom.getViewportSize();
  visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width);
  visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height);
  return visibleRect.top >= 0 && visibleRect.left >= 0 && visibleRect.bottom > visibleRect.top && visibleRect.right > visibleRect.left ? visibleRect : null;
};
goog.style.getContainerOffsetToScrollInto = function(element, opt_container, opt_center) {
  var container = opt_container || goog.dom.getDocumentScrollElement();
  var elementPos = goog.style.getPageOffset(element);
  var containerPos = goog.style.getPageOffset(container);
  var containerBorder = goog.style.getBorderBox(container);
  if (container == goog.dom.getDocumentScrollElement()) {
    var relX = elementPos.x - container.scrollLeft;
    var relY = elementPos.y - container.scrollTop;
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(10)) {
      relX += containerBorder.left;
      relY += containerBorder.top;
    }
  } else {
    var relX = elementPos.x - containerPos.x - containerBorder.left;
    var relY = elementPos.y - containerPos.y - containerBorder.top;
  }
  var spaceX = container.clientWidth - (element).offsetWidth;
  var spaceY = container.clientHeight - (element).offsetHeight;
  var scrollLeft = container.scrollLeft;
  var scrollTop = container.scrollTop;
  if (opt_center) {
    scrollLeft += relX - spaceX / 2;
    scrollTop += relY - spaceY / 2;
  } else {
    scrollLeft += Math.min(relX, Math.max(relX - spaceX, 0));
    scrollTop += Math.min(relY, Math.max(relY - spaceY, 0));
  }
  return new goog.math.Coordinate(scrollLeft, scrollTop);
};
goog.style.scrollIntoContainerView = function(element, opt_container, opt_center) {
  var container = opt_container || goog.dom.getDocumentScrollElement();
  var offset = goog.style.getContainerOffsetToScrollInto(element, container, opt_center);
  container.scrollLeft = offset.x;
  container.scrollTop = offset.y;
};
goog.style.getClientLeftTop = function(el) {
  return new goog.math.Coordinate(el.clientLeft, el.clientTop);
};
goog.style.getPageOffset = function(el) {
  var doc = goog.dom.getOwnerDocument(el);
  goog.asserts.assertObject(el, "Parameter is required");
  var pos = new goog.math.Coordinate(0, 0);
  var viewportElement = goog.style.getClientViewportElement(doc);
  if (el == viewportElement) {
    return pos;
  }
  var box = goog.style.getBoundingClientRect_(el);
  var scrollCoord = goog.dom.getDomHelper(doc).getDocumentScroll();
  pos.x = box.left + scrollCoord.x;
  pos.y = box.top + scrollCoord.y;
  return pos;
};
goog.style.getPageOffsetLeft = function(el) {
  return goog.style.getPageOffset(el).x;
};
goog.style.getPageOffsetTop = function(el) {
  return goog.style.getPageOffset(el).y;
};
goog.style.getFramedPageOffset = function(el, relativeWin) {
  var position = new goog.math.Coordinate(0, 0);
  var currentWin = goog.dom.getWindow(goog.dom.getOwnerDocument(el));
  if (!goog.reflect.canAccessProperty(currentWin, "parent")) {
    return position;
  }
  var currentEl = el;
  do {
    var offset = currentWin == relativeWin ? goog.style.getPageOffset(currentEl) : goog.style.getClientPositionForElement_(goog.asserts.assert(currentEl));
    position.x += offset.x;
    position.y += offset.y;
  } while (currentWin && currentWin != relativeWin && currentWin != currentWin.parent && (currentEl = currentWin.frameElement) && (currentWin = currentWin.parent));
  return position;
};
goog.style.translateRectForAnotherFrame = function(rect, origBase, newBase) {
  if (origBase.getDocument() != newBase.getDocument()) {
    var body = origBase.getDocument().body;
    var pos = goog.style.getFramedPageOffset(body, newBase.getWindow());
    pos = goog.math.Coordinate.difference(pos, goog.style.getPageOffset(body));
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9) && !origBase.isCss1CompatMode()) {
      pos = goog.math.Coordinate.difference(pos, origBase.getDocumentScroll());
    }
    rect.left += pos.x;
    rect.top += pos.y;
  }
};
goog.style.getRelativePosition = function(a, b) {
  var ap = goog.style.getClientPosition(a);
  var bp = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(ap.x - bp.x, ap.y - bp.y);
};
goog.style.getClientPositionForElement_ = function(el) {
  var box = goog.style.getBoundingClientRect_(el);
  return new goog.math.Coordinate(box.left, box.top);
};
goog.style.getClientPosition = function(el) {
  goog.asserts.assert(el);
  if (el.nodeType == goog.dom.NodeType.ELEMENT) {
    return goog.style.getClientPositionForElement_((el));
  } else {
    var targetEvent = el.changedTouches ? el.changedTouches[0] : el;
    return new goog.math.Coordinate(targetEvent.clientX, targetEvent.clientY);
  }
};
goog.style.setPageOffset = function(el, x, opt_y) {
  var cur = goog.style.getPageOffset(el);
  if (x instanceof goog.math.Coordinate) {
    opt_y = x.y;
    x = x.x;
  }
  var dx = x - cur.x;
  var dy = opt_y - cur.y;
  goog.style.setPosition(el, (el).offsetLeft + dx, (el).offsetTop + dy);
};
goog.style.setSize = function(element, w, opt_h) {
  var h;
  if (w instanceof goog.math.Size) {
    h = w.height;
    w = w.width;
  } else {
    if (opt_h == undefined) {
      throw Error("missing height argument");
    }
    h = opt_h;
  }
  goog.style.setWidth(element, (w));
  goog.style.setHeight(element, h);
};
goog.style.getPixelStyleValue_ = function(value, round) {
  if (typeof value == "number") {
    value = (round ? Math.round(value) : value) + "px";
  }
  return value;
};
goog.style.setHeight = function(element, height) {
  element.style.height = goog.style.getPixelStyleValue_(height, true);
};
goog.style.setWidth = function(element, width) {
  element.style.width = goog.style.getPixelStyleValue_(width, true);
};
goog.style.getSize = function(element) {
  return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, (element));
};
goog.style.evaluateWithTemporaryDisplay_ = function(fn, element) {
  if (goog.style.getStyle_(element, "display") != "none") {
    return fn(element);
  }
  var style = element.style;
  var originalDisplay = style.display;
  var originalVisibility = style.visibility;
  var originalPosition = style.position;
  style.visibility = "hidden";
  style.position = "absolute";
  style.display = "inline";
  var retVal = fn(element);
  style.display = originalDisplay;
  style.position = originalPosition;
  style.visibility = originalVisibility;
  return retVal;
};
goog.style.getSizeWithDisplay_ = function(element) {
  var offsetWidth = (element).offsetWidth;
  var offsetHeight = (element).offsetHeight;
  var webkitOffsetsZero = goog.userAgent.WEBKIT && !offsetWidth && !offsetHeight;
  if ((!goog.isDef(offsetWidth) || webkitOffsetsZero) && element.getBoundingClientRect) {
    var clientRect = goog.style.getBoundingClientRect_(element);
    return new goog.math.Size(clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
  }
  return new goog.math.Size(offsetWidth, offsetHeight);
};
goog.style.getTransformedSize = function(element) {
  if (!element.getBoundingClientRect) {
    return null;
  }
  var clientRect = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, element);
  return new goog.math.Size(clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
};
goog.style.getBounds = function(element) {
  var o = goog.style.getPageOffset(element);
  var s = goog.style.getSize(element);
  return new goog.math.Rect(o.x, o.y, s.width, s.height);
};
goog.style.toCamelCase = function(selector) {
  return goog.string.toCamelCase(String(selector));
};
goog.style.toSelectorCase = function(selector) {
  return goog.string.toSelectorCase(selector);
};
goog.style.getOpacity = function(el) {
  var style = el.style;
  var result = "";
  if ("opacity" in style) {
    result = style.opacity;
  } else {
    if ("MozOpacity" in style) {
      result = style.MozOpacity;
    } else {
      if ("filter" in style) {
        var match = style.filter.match(/alpha\(opacity=([\d.]+)\)/);
        if (match) {
          result = String(match[1] / 100);
        }
      }
    }
  }
  return result == "" ? result : Number(result);
};
goog.style.setOpacity = function(el, alpha) {
  var style = el.style;
  if ("opacity" in style) {
    style.opacity = alpha;
  } else {
    if ("MozOpacity" in style) {
      style.MozOpacity = alpha;
    } else {
      if ("filter" in style) {
        if (alpha === "") {
          style.filter = "";
        } else {
          style.filter = "alpha(opacity=" + alpha * 100 + ")";
        }
      }
    }
  }
};
goog.style.setTransparentBackgroundImage = function(el, src) {
  var style = el.style;
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8")) {
    style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(" + 'src="' + src + '", sizingMethod="crop")';
  } else {
    style.backgroundImage = "url(" + src + ")";
    style.backgroundPosition = "top left";
    style.backgroundRepeat = "no-repeat";
  }
};
goog.style.clearTransparentBackgroundImage = function(el) {
  var style = el.style;
  if ("filter" in style) {
    style.filter = "";
  } else {
    style.backgroundImage = "none";
  }
};
goog.style.showElement = function(el, display) {
  goog.style.setElementShown(el, display);
};
goog.style.setElementShown = function(el, isShown) {
  el.style.display = isShown ? "" : "none";
};
goog.style.isElementShown = function(el) {
  return el.style.display != "none";
};
goog.style.installStyles = function(stylesString, opt_node) {
  var dh = goog.dom.getDomHelper(opt_node);
  var styleSheet = null;
  var doc = dh.getDocument();
  if (goog.userAgent.IE && doc.createStyleSheet) {
    styleSheet = doc.createStyleSheet();
    goog.style.setStyles(styleSheet, stylesString);
  } else {
    var head = dh.getElementsByTagNameAndClass(goog.dom.TagName.HEAD)[0];
    if (!head) {
      var body = dh.getElementsByTagNameAndClass(goog.dom.TagName.BODY)[0];
      head = dh.createDom(goog.dom.TagName.HEAD);
      body.parentNode.insertBefore(head, body);
    }
    styleSheet = dh.createDom(goog.dom.TagName.STYLE);
    goog.style.setStyles(styleSheet, stylesString);
    dh.appendChild(head, styleSheet);
  }
  return styleSheet;
};
goog.style.uninstallStyles = function(styleSheet) {
  var node = styleSheet.ownerNode || styleSheet.owningElement || (styleSheet);
  goog.dom.removeNode(node);
};
goog.style.setStyles = function(element, stylesString) {
  if (goog.userAgent.IE && goog.isDef(element.cssText)) {
    element.cssText = stylesString;
  } else {
    element.innerHTML = stylesString;
  }
};
goog.style.setPreWrap = function(el) {
  var style = el.style;
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8")) {
    style.whiteSpace = "pre";
    style.wordWrap = "break-word";
  } else {
    if (goog.userAgent.GECKO) {
      style.whiteSpace = "-moz-pre-wrap";
    } else {
      style.whiteSpace = "pre-wrap";
    }
  }
};
goog.style.setInlineBlock = function(el) {
  var style = el.style;
  style.position = "relative";
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8")) {
    style.zoom = "1";
    style.display = "inline";
  } else {
    style.display = "inline-block";
  }
};
goog.style.isRightToLeft = function(el) {
  return "rtl" == goog.style.getStyle_(el, "direction");
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT || goog.userAgent.EDGE ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(el) {
  if (goog.style.unselectableStyle_) {
    return el.style[goog.style.unselectableStyle_].toLowerCase() == "none";
  } else {
    if (goog.userAgent.IE || goog.userAgent.OPERA) {
      return el.getAttribute("unselectable") == "on";
    }
  }
  return false;
};
goog.style.setUnselectable = function(el, unselectable, opt_noRecurse) {
  var descendants = !opt_noRecurse ? el.getElementsByTagName("*") : null;
  var name = goog.style.unselectableStyle_;
  if (name) {
    var value = unselectable ? "none" : "";
    if (el.style) {
      el.style[name] = value;
    }
    if (descendants) {
      for (var i = 0, descendant;descendant = descendants[i];i++) {
        if (descendant.style) {
          descendant.style[name] = value;
        }
      }
    }
  } else {
    if (goog.userAgent.IE || goog.userAgent.OPERA) {
      var value = unselectable ? "on" : "";
      el.setAttribute("unselectable", value);
      if (descendants) {
        for (var i = 0, descendant;descendant = descendants[i];i++) {
          descendant.setAttribute("unselectable", value);
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(element) {
  return new goog.math.Size((element).offsetWidth, (element).offsetHeight);
};
goog.style.setBorderBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element);
  var isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("10") && (!isCss1CompatMode || !goog.userAgent.isVersionOrHigher("8"))) {
    var style = element.style;
    if (isCss1CompatMode) {
      var paddingBox = goog.style.getPaddingBox(element);
      var borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width - borderBox.left - paddingBox.left - paddingBox.right - borderBox.right;
      style.pixelHeight = size.height - borderBox.top - paddingBox.top - paddingBox.bottom - borderBox.bottom;
    } else {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height;
    }
  } else {
    goog.style.setBoxSizingSize_(element, size, "border-box");
  }
};
goog.style.getContentBoxSize = function(element) {
  var doc = goog.dom.getOwnerDocument(element);
  var ieCurrentStyle = goog.userAgent.IE && element.currentStyle;
  if (ieCurrentStyle && goog.dom.getDomHelper(doc).isCss1CompatMode() && ieCurrentStyle.width != "auto" && ieCurrentStyle.height != "auto" && !ieCurrentStyle.boxSizing) {
    var width = goog.style.getIePixelValue_(element, ieCurrentStyle.width, "width", "pixelWidth");
    var height = goog.style.getIePixelValue_(element, ieCurrentStyle.height, "height", "pixelHeight");
    return new goog.math.Size(width, height);
  } else {
    var borderBoxSize = goog.style.getBorderBoxSize(element);
    var paddingBox = goog.style.getPaddingBox(element);
    var borderBox = goog.style.getBorderBox(element);
    return new goog.math.Size(borderBoxSize.width - borderBox.left - paddingBox.left - paddingBox.right - borderBox.right, borderBoxSize.height - borderBox.top - paddingBox.top - paddingBox.bottom - borderBox.bottom);
  }
};
goog.style.setContentBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element);
  var isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("10") && (!isCss1CompatMode || !goog.userAgent.isVersionOrHigher("8"))) {
    var style = element.style;
    if (isCss1CompatMode) {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height;
    } else {
      var paddingBox = goog.style.getPaddingBox(element);
      var borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width + borderBox.left + paddingBox.left + paddingBox.right + borderBox.right;
      style.pixelHeight = size.height + borderBox.top + paddingBox.top + paddingBox.bottom + borderBox.bottom;
    }
  } else {
    goog.style.setBoxSizingSize_(element, size, "content-box");
  }
};
goog.style.setBoxSizingSize_ = function(element, size, boxSizing) {
  var style = element.style;
  if (goog.userAgent.GECKO) {
    style.MozBoxSizing = boxSizing;
  } else {
    if (goog.userAgent.WEBKIT) {
      style.WebkitBoxSizing = boxSizing;
    } else {
      style.boxSizing = boxSizing;
    }
  }
  style.width = Math.max(size.width, 0) + "px";
  style.height = Math.max(size.height, 0) + "px";
};
goog.style.getIePixelValue_ = function(element, value, name, pixelName) {
  if (/^\d+px?$/.test(value)) {
    return parseInt(value, 10);
  } else {
    var oldStyleValue = element.style[name];
    var oldRuntimeValue = element.runtimeStyle[name];
    element.runtimeStyle[name] = element.currentStyle[name];
    element.style[name] = value;
    var pixelValue = element.style[pixelName];
    element.style[name] = oldStyleValue;
    element.runtimeStyle[name] = oldRuntimeValue;
    return pixelValue;
  }
};
goog.style.getIePixelDistance_ = function(element, propName) {
  var value = goog.style.getCascadedStyle(element, propName);
  return value ? goog.style.getIePixelValue_(element, value, "left", "pixelLeft") : 0;
};
goog.style.getBox_ = function(element, stylePrefix) {
  if (goog.userAgent.IE) {
    var left = goog.style.getIePixelDistance_(element, stylePrefix + "Left");
    var right = goog.style.getIePixelDistance_(element, stylePrefix + "Right");
    var top = goog.style.getIePixelDistance_(element, stylePrefix + "Top");
    var bottom = goog.style.getIePixelDistance_(element, stylePrefix + "Bottom");
    return new goog.math.Box(top, right, bottom, left);
  } else {
    var left = goog.style.getComputedStyle(element, stylePrefix + "Left");
    var right = goog.style.getComputedStyle(element, stylePrefix + "Right");
    var top = goog.style.getComputedStyle(element, stylePrefix + "Top");
    var bottom = goog.style.getComputedStyle(element, stylePrefix + "Bottom");
    return new goog.math.Box(parseFloat(top), parseFloat(right), parseFloat(bottom), parseFloat(left));
  }
};
goog.style.getPaddingBox = function(element) {
  return goog.style.getBox_(element, "padding");
};
goog.style.getMarginBox = function(element) {
  return goog.style.getBox_(element, "margin");
};
goog.style.ieBorderWidthKeywords_ = {"thin":2, "medium":4, "thick":6};
goog.style.getIePixelBorder_ = function(element, prop) {
  if (goog.style.getCascadedStyle(element, prop + "Style") == "none") {
    return 0;
  }
  var width = goog.style.getCascadedStyle(element, prop + "Width");
  if (width in goog.style.ieBorderWidthKeywords_) {
    return goog.style.ieBorderWidthKeywords_[width];
  }
  return goog.style.getIePixelValue_(element, width, "left", "pixelLeft");
};
goog.style.getBorderBox = function(element) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    var left = goog.style.getIePixelBorder_(element, "borderLeft");
    var right = goog.style.getIePixelBorder_(element, "borderRight");
    var top = goog.style.getIePixelBorder_(element, "borderTop");
    var bottom = goog.style.getIePixelBorder_(element, "borderBottom");
    return new goog.math.Box(top, right, bottom, left);
  } else {
    var left = goog.style.getComputedStyle(element, "borderLeftWidth");
    var right = goog.style.getComputedStyle(element, "borderRightWidth");
    var top = goog.style.getComputedStyle(element, "borderTopWidth");
    var bottom = goog.style.getComputedStyle(element, "borderBottomWidth");
    return new goog.math.Box(parseFloat(top), parseFloat(right), parseFloat(bottom), parseFloat(left));
  }
};
goog.style.getFontFamily = function(el) {
  var doc = goog.dom.getOwnerDocument(el);
  var font = "";
  if (doc.body.createTextRange && goog.dom.contains(doc, el)) {
    var range = doc.body.createTextRange();
    range.moveToElementText(el);
    try {
      font = range.queryCommandValue("FontName");
    } catch (e) {
      font = "";
    }
  }
  if (!font) {
    font = goog.style.getStyle_(el, "fontFamily");
  }
  var fontsArray = font.split(",");
  if (fontsArray.length > 1) {
    font = fontsArray[0];
  }
  return goog.string.stripQuotes(font, "\"'");
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(value) {
  var units = value.match(goog.style.lengthUnitRegex_);
  return units && units[0] || null;
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {"cm":1, "in":1, "mm":1, "pc":1, "pt":1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {"em":1, "ex":1};
goog.style.getFontSize = function(el) {
  var fontSize = goog.style.getStyle_(el, "fontSize");
  var sizeUnits = goog.style.getLengthUnits(fontSize);
  if (fontSize && "px" == sizeUnits) {
    return parseInt(fontSize, 10);
  }
  if (goog.userAgent.IE) {
    if (sizeUnits in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(el, fontSize, "left", "pixelLeft");
    } else {
      if (el.parentNode && el.parentNode.nodeType == goog.dom.NodeType.ELEMENT && sizeUnits in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
        var parentElement = (el.parentNode);
        var parentSize = goog.style.getStyle_(parentElement, "fontSize");
        return goog.style.getIePixelValue_(parentElement, fontSize == parentSize ? "1em" : fontSize, "left", "pixelLeft");
      }
    }
  }
  var sizeElement = goog.dom.createDom(goog.dom.TagName.SPAN, {"style":"visibility:hidden;position:absolute;" + "line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(el, sizeElement);
  fontSize = sizeElement.offsetHeight;
  goog.dom.removeNode(sizeElement);
  return fontSize;
};
goog.style.parseStyleAttribute = function(value) {
  var result = {};
  goog.array.forEach(value.split(/\s*;\s*/), function(pair) {
    var keyValue = pair.match(/\s*([\w-]+)\s*\:(.+)/);
    if (keyValue) {
      var styleName = keyValue[1];
      var styleValue = goog.string.trim(keyValue[2]);
      result[goog.string.toCamelCase(styleName.toLowerCase())] = styleValue;
    }
  });
  return result;
};
goog.style.toStyleAttribute = function(obj) {
  var buffer = [];
  goog.object.forEach(obj, function(value, key) {
    buffer.push(goog.string.toSelectorCase(key), ":", value, ";");
  });
  return buffer.join("");
};
goog.style.setFloat = function(el, value) {
  el.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = value;
};
goog.style.getFloat = function(el) {
  return el.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || "";
};
goog.style.getScrollbarWidth = function(opt_className) {
  var outerDiv = goog.dom.createElement(goog.dom.TagName.DIV);
  if (opt_className) {
    outerDiv.className = opt_className;
  }
  outerDiv.style.cssText = "overflow:auto;" + "position:absolute;top:0;width:100px;height:100px";
  var innerDiv = goog.dom.createElement(goog.dom.TagName.DIV);
  goog.style.setSize(innerDiv, "200px", "200px");
  outerDiv.appendChild(innerDiv);
  goog.dom.appendChild(goog.dom.getDocument().body, outerDiv);
  var width = outerDiv.offsetWidth - outerDiv.clientWidth;
  goog.dom.removeNode(outerDiv);
  return width;
};
goog.style.MATRIX_TRANSLATION_REGEX_ = new RegExp("matrix\\([0-9\\.\\-]+, [0-9\\.\\-]+, " + "[0-9\\.\\-]+, [0-9\\.\\-]+, " + "([0-9\\.\\-]+)p?x?, ([0-9\\.\\-]+)p?x?\\)");
goog.style.getCssTranslation = function(element) {
  var transform = goog.style.getComputedTransform(element);
  if (!transform) {
    return new goog.math.Coordinate(0, 0);
  }
  var matches = transform.match(goog.style.MATRIX_TRANSLATION_REGEX_);
  if (!matches) {
    return new goog.math.Coordinate(0, 0);
  }
  return new goog.math.Coordinate(parseFloat(matches[1]), parseFloat(matches[2]));
};
goog.provide("goog.ui.Component");
goog.provide("goog.ui.Component.Error");
goog.provide("goog.ui.Component.EventType");
goog.provide("goog.ui.Component.State");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.TagName");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.object");
goog.require("goog.style");
goog.require("goog.ui.IdGenerator");
goog.ui.Component = function(opt_domHelper) {
  goog.events.EventTarget.call(this);
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();
  this.rightToLeft_ = goog.ui.Component.defaultRightToLeft_;
  this.id_ = null;
  this.inDocument_ = false;
  this.element_ = null;
  this.googUiComponentHandler_ = void 0;
  this.model_ = null;
  this.parent_ = null;
  this.children_ = null;
  this.childIndex_ = null;
  this.wasDecorated_ = false;
};
goog.inherits(goog.ui.Component, goog.events.EventTarget);
goog.define("goog.ui.Component.ALLOW_DETACHED_DECORATION", false);
goog.ui.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();
goog.define("goog.ui.Component.DEFAULT_BIDI_DIR", 0);
goog.ui.Component.defaultRightToLeft_ = goog.ui.Component.DEFAULT_BIDI_DIR == 1 ? false : goog.ui.Component.DEFAULT_BIDI_DIR == -1 ? true : null;
goog.ui.Component.EventType = {BEFORE_SHOW:"beforeshow", SHOW:"show", HIDE:"hide", DISABLE:"disable", ENABLE:"enable", HIGHLIGHT:"highlight", UNHIGHLIGHT:"unhighlight", ACTIVATE:"activate", DEACTIVATE:"deactivate", SELECT:"select", UNSELECT:"unselect", CHECK:"check", UNCHECK:"uncheck", FOCUS:"focus", BLUR:"blur", OPEN:"open", CLOSE:"close", ENTER:"enter", LEAVE:"leave", ACTION:"action", CHANGE:"change"};
goog.ui.Component.Error = {NOT_SUPPORTED:"Method not supported", DECORATE_INVALID:"Invalid element to decorate", ALREADY_RENDERED:"Component already rendered", PARENT_UNABLE_TO_BE_SET:"Unable to set parent component", CHILD_INDEX_OUT_OF_BOUNDS:"Child component index out of bounds", NOT_OUR_CHILD:"Child is not in parent component", NOT_IN_DOCUMENT:"Operation not supported while component is not in document", STATE_INVALID:"Invalid component state"};
goog.ui.Component.State = {ALL:255, DISABLED:1, HOVER:2, ACTIVE:4, SELECTED:8, CHECKED:16, FOCUSED:32, OPENED:64};
goog.ui.Component.getStateTransitionEvent = function(state, isEntering) {
  switch(state) {
    case goog.ui.Component.State.DISABLED:
      return isEntering ? goog.ui.Component.EventType.DISABLE : goog.ui.Component.EventType.ENABLE;
    case goog.ui.Component.State.HOVER:
      return isEntering ? goog.ui.Component.EventType.HIGHLIGHT : goog.ui.Component.EventType.UNHIGHLIGHT;
    case goog.ui.Component.State.ACTIVE:
      return isEntering ? goog.ui.Component.EventType.ACTIVATE : goog.ui.Component.EventType.DEACTIVATE;
    case goog.ui.Component.State.SELECTED:
      return isEntering ? goog.ui.Component.EventType.SELECT : goog.ui.Component.EventType.UNSELECT;
    case goog.ui.Component.State.CHECKED:
      return isEntering ? goog.ui.Component.EventType.CHECK : goog.ui.Component.EventType.UNCHECK;
    case goog.ui.Component.State.FOCUSED:
      return isEntering ? goog.ui.Component.EventType.FOCUS : goog.ui.Component.EventType.BLUR;
    case goog.ui.Component.State.OPENED:
      return isEntering ? goog.ui.Component.EventType.OPEN : goog.ui.Component.EventType.CLOSE;
    default:
    ;
  }
  throw Error(goog.ui.Component.Error.STATE_INVALID);
};
goog.ui.Component.setDefaultRightToLeft = function(rightToLeft) {
  goog.ui.Component.defaultRightToLeft_ = rightToLeft;
};
goog.ui.Component.prototype.getId = function() {
  return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId());
};
goog.ui.Component.prototype.setId = function(id) {
  if (this.parent_ && this.parent_.childIndex_) {
    goog.object.remove(this.parent_.childIndex_, this.id_);
    goog.object.add(this.parent_.childIndex_, id, this);
  }
  this.id_ = id;
};
goog.ui.Component.prototype.getElement = function() {
  return this.element_;
};
goog.ui.Component.prototype.getElementStrict = function() {
  var el = this.element_;
  goog.asserts.assert(el, "Can not call getElementStrict before rendering/decorating.");
  return el;
};
goog.ui.Component.prototype.setElementInternal = function(element) {
  this.element_ = element;
};
goog.ui.Component.prototype.getElementsByClass = function(className) {
  return this.element_ ? this.dom_.getElementsByClass(className, this.element_) : [];
};
goog.ui.Component.prototype.getElementByClass = function(className) {
  return this.element_ ? this.dom_.getElementByClass(className, this.element_) : null;
};
goog.ui.Component.prototype.getRequiredElementByClass = function(className) {
  var el = this.getElementByClass(className);
  goog.asserts.assert(el, "Expected element in component with class: %s", className);
  return el;
};
goog.ui.Component.prototype.getHandler = function() {
  var self = (this);
  if (!self.googUiComponentHandler_) {
    self.googUiComponentHandler_ = new goog.events.EventHandler(self);
  }
  return self.googUiComponentHandler_;
};
goog.ui.Component.prototype.setParent = function(parent) {
  if (this == parent) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  if (parent && this.parent_ && this.id_ && this.parent_.getChild(this.id_) && this.parent_ != parent) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  this.parent_ = parent;
  goog.ui.Component.superClass_.setParentEventTarget.call(this, parent);
};
goog.ui.Component.prototype.getParent = function() {
  return this.parent_;
};
goog.ui.Component.prototype.setParentEventTarget = function(parent) {
  if (this.parent_ && this.parent_ != parent) {
    throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
  }
  goog.ui.Component.superClass_.setParentEventTarget.call(this, parent);
};
goog.ui.Component.prototype.getDomHelper = function() {
  return this.dom_;
};
goog.ui.Component.prototype.isInDocument = function() {
  return this.inDocument_;
};
goog.ui.Component.prototype.createDom = function() {
  this.element_ = this.dom_.createElement(goog.dom.TagName.DIV);
};
goog.ui.Component.prototype.render = function(opt_parentElement) {
  this.render_(opt_parentElement);
};
goog.ui.Component.prototype.renderBefore = function(sibling) {
  this.render_((sibling.parentNode), sibling);
};
goog.ui.Component.prototype.render_ = function(opt_parentElement, opt_beforeNode) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (!this.element_) {
    this.createDom();
  }
  if (opt_parentElement) {
    opt_parentElement.insertBefore(this.element_, opt_beforeNode || null);
  } else {
    this.dom_.getDocument().body.appendChild(this.element_);
  }
  if (!this.parent_ || this.parent_.isInDocument()) {
    this.enterDocument();
  }
};
goog.ui.Component.prototype.decorate = function(element) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  } else {
    if (element && this.canDecorate(element)) {
      this.wasDecorated_ = true;
      var doc = goog.dom.getOwnerDocument(element);
      if (!this.dom_ || this.dom_.getDocument() != doc) {
        this.dom_ = goog.dom.getDomHelper(element);
      }
      this.decorateInternal(element);
      if (!goog.ui.Component.ALLOW_DETACHED_DECORATION || goog.dom.contains(doc, element)) {
        this.enterDocument();
      }
    } else {
      throw Error(goog.ui.Component.Error.DECORATE_INVALID);
    }
  }
};
goog.ui.Component.prototype.canDecorate = function(element) {
  return true;
};
goog.ui.Component.prototype.wasDecorated = function() {
  return this.wasDecorated_;
};
goog.ui.Component.prototype.decorateInternal = function(element) {
  this.element_ = element;
};
goog.ui.Component.prototype.enterDocument = function() {
  this.inDocument_ = true;
  this.forEachChild(function(child) {
    if (!child.isInDocument() && child.getElement()) {
      child.enterDocument();
    }
  });
};
goog.ui.Component.prototype.exitDocument = function() {
  this.forEachChild(function(child) {
    if (child.isInDocument()) {
      child.exitDocument();
    }
  });
  if (this.googUiComponentHandler_) {
    this.googUiComponentHandler_.removeAll();
  }
  this.inDocument_ = false;
};
goog.ui.Component.prototype.disposeInternal = function() {
  if (this.inDocument_) {
    this.exitDocument();
  }
  if (this.googUiComponentHandler_) {
    this.googUiComponentHandler_.dispose();
    delete this.googUiComponentHandler_;
  }
  this.forEachChild(function(child) {
    child.dispose();
  });
  if (!this.wasDecorated_ && this.element_) {
    goog.dom.removeNode(this.element_);
  }
  this.children_ = null;
  this.childIndex_ = null;
  this.element_ = null;
  this.model_ = null;
  this.parent_ = null;
  goog.ui.Component.superClass_.disposeInternal.call(this);
};
goog.ui.Component.prototype.makeId = function(idFragment) {
  return this.getId() + "." + idFragment;
};
goog.ui.Component.prototype.makeIds = function(object) {
  var ids = {};
  for (var key in object) {
    ids[key] = this.makeId(object[key]);
  }
  return ids;
};
goog.ui.Component.prototype.getModel = function() {
  return this.model_;
};
goog.ui.Component.prototype.setModel = function(obj) {
  this.model_ = obj;
};
goog.ui.Component.prototype.getFragmentFromId = function(id) {
  return id.substring(this.getId().length + 1);
};
goog.ui.Component.prototype.getElementByFragment = function(idFragment) {
  if (!this.inDocument_) {
    throw Error(goog.ui.Component.Error.NOT_IN_DOCUMENT);
  }
  return this.dom_.getElement(this.makeId(idFragment));
};
goog.ui.Component.prototype.addChild = function(child, opt_render) {
  this.addChildAt(child, this.getChildCount(), opt_render);
};
goog.ui.Component.prototype.addChildAt = function(child, index, opt_render) {
  goog.asserts.assert(!!child, "Provided element must not be null.");
  if (child.inDocument_ && (opt_render || !this.inDocument_)) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (index < 0 || index > this.getChildCount()) {
    throw Error(goog.ui.Component.Error.CHILD_INDEX_OUT_OF_BOUNDS);
  }
  if (!this.childIndex_ || !this.children_) {
    this.childIndex_ = {};
    this.children_ = [];
  }
  if (child.getParent() == this) {
    goog.object.set(this.childIndex_, child.getId(), child);
    goog.array.remove(this.children_, child);
  } else {
    goog.object.add(this.childIndex_, child.getId(), child);
  }
  child.setParent(this);
  goog.array.insertAt(this.children_, child, index);
  if (child.inDocument_ && this.inDocument_ && child.getParent() == this) {
    var contentElement = this.getContentElement();
    var insertBeforeElement = contentElement.childNodes[index] || null;
    if (insertBeforeElement != child.getElement()) {
      contentElement.insertBefore(child.getElement(), insertBeforeElement);
    }
  } else {
    if (opt_render) {
      if (!this.element_) {
        this.createDom();
      }
      var sibling = this.getChildAt(index + 1);
      child.render_(this.getContentElement(), sibling ? sibling.element_ : null);
    } else {
      if (this.inDocument_ && !child.inDocument_ && child.element_ && child.element_.parentNode && child.element_.parentNode.nodeType == goog.dom.NodeType.ELEMENT) {
        child.enterDocument();
      }
    }
  }
};
goog.ui.Component.prototype.getContentElement = function() {
  return this.element_;
};
goog.ui.Component.prototype.isRightToLeft = function() {
  if (this.rightToLeft_ == null) {
    this.rightToLeft_ = goog.style.isRightToLeft(this.inDocument_ ? this.element_ : this.dom_.getDocument().body);
  }
  return this.rightToLeft_;
};
goog.ui.Component.prototype.setRightToLeft = function(rightToLeft) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.rightToLeft_ = rightToLeft;
};
goog.ui.Component.prototype.hasChildren = function() {
  return !!this.children_ && this.children_.length != 0;
};
goog.ui.Component.prototype.getChildCount = function() {
  return this.children_ ? this.children_.length : 0;
};
goog.ui.Component.prototype.getChildIds = function() {
  var ids = [];
  this.forEachChild(function(child) {
    ids.push(child.getId());
  });
  return ids;
};
goog.ui.Component.prototype.getChild = function(id) {
  return this.childIndex_ && id ? (goog.object.get(this.childIndex_, id)) || null : null;
};
goog.ui.Component.prototype.getChildAt = function(index) {
  return this.children_ ? this.children_[index] || null : null;
};
goog.ui.Component.prototype.forEachChild = function(f, opt_obj) {
  if (this.children_) {
    goog.array.forEach(this.children_, f, opt_obj);
  }
};
goog.ui.Component.prototype.indexOfChild = function(child) {
  return this.children_ && child ? goog.array.indexOf(this.children_, child) : -1;
};
goog.ui.Component.prototype.removeChild = function(child, opt_unrender) {
  if (child) {
    var id = goog.isString(child) ? child : child.getId();
    child = this.getChild(id);
    if (id && child) {
      goog.object.remove(this.childIndex_, id);
      goog.array.remove(this.children_, child);
      if (opt_unrender) {
        child.exitDocument();
        if (child.element_) {
          goog.dom.removeNode(child.element_);
        }
      }
      child.setParent(null);
    }
  }
  if (!child) {
    throw Error(goog.ui.Component.Error.NOT_OUR_CHILD);
  }
  return (child);
};
goog.ui.Component.prototype.removeChildAt = function(index, opt_unrender) {
  return this.removeChild(this.getChildAt(index), opt_unrender);
};
goog.ui.Component.prototype.removeChildren = function(opt_unrender) {
  var removedChildren = [];
  while (this.hasChildren()) {
    removedChildren.push(this.removeChildAt(0, opt_unrender));
  }
  return removedChildren;
};
goog.provide("goog.ui.ScrollFloater");
goog.provide("goog.ui.ScrollFloater.EventType");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.dom.classlist");
goog.require("goog.events.EventType");
goog.require("goog.style");
goog.require("goog.ui.Component");
goog.require("goog.userAgent");
goog.ui.ScrollFloater = function(opt_parentElement, opt_domHelper) {
  var domHelper = opt_parentElement ? goog.dom.getDomHelper(opt_parentElement) : opt_domHelper;
  goog.ui.ScrollFloater.base(this, "constructor", domHelper);
  this.parentElement_ = opt_parentElement || this.getDomHelper().getDocument().body;
  this.originalStyles_ = {};
  this.viewportTopOffset_ = 0;
  this.containerElement_ = null;
  this.containerBounds_ = null;
  this.originalBounds_ = null;
  this.originalTopOffset_ = 0;
  this.placeholder_ = null;
  this.scrollingEnabled_ = true;
  this.pinned_ = false;
  this.floating_ = false;
};
goog.inherits(goog.ui.ScrollFloater, goog.ui.Component);
goog.ui.ScrollFloater.EventType = {FLOAT:"float", DOCK:"dock", PIN:"pin"};
goog.ui.ScrollFloater.FloatMode_ = {TOP:0, BOTTOM:1};
goog.ui.ScrollFloater.STORED_STYLE_PROPS_ = ["position", "top", "left", "width", "cssFloat"];
goog.ui.ScrollFloater.PLACEHOLDER_STYLE_PROPS_ = ["position", "top", "left", "display", "cssFloat", "marginTop", "marginLeft", "marginRight", "marginBottom"];
goog.ui.ScrollFloater.CSS_CLASS_ = goog.getCssName("goog-scrollfloater");
goog.ui.ScrollFloater.prototype.createDom = function() {
  goog.ui.ScrollFloater.base(this, "createDom");
  this.decorateInternal(this.getElement());
};
goog.ui.ScrollFloater.prototype.decorateInternal = function(element) {
  goog.ui.ScrollFloater.base(this, "decorateInternal", element);
  goog.asserts.assert(element);
  goog.dom.classlist.add(element, goog.ui.ScrollFloater.CSS_CLASS_);
};
goog.ui.ScrollFloater.prototype.enterDocument = function() {
  goog.ui.ScrollFloater.base(this, "enterDocument");
  if (!this.placeholder_) {
    this.placeholder_ = this.getDomHelper().createDom(goog.dom.TagName.DIV, {"style":"visibility:hidden"});
  }
  this.update();
  this.setScrollingEnabled(this.scrollingEnabled_);
  var win = this.getDomHelper().getWindow();
  this.getHandler().listen(win, goog.events.EventType.SCROLL, this.handleScroll_).listen(win, goog.events.EventType.RESIZE, this.update);
};
goog.ui.ScrollFloater.prototype.update = function() {
  if (!this.isInDocument()) {
    return;
  }
  this.dock_();
  if (this.containerElement_) {
    this.containerBounds_ = goog.style.getBounds(this.containerElement_);
  }
  this.originalBounds_ = goog.style.getBounds(this.getElement());
  this.originalTopOffset_ = goog.style.getPageOffset(this.getElement()).y;
  this.handleScroll_();
};
goog.ui.ScrollFloater.prototype.disposeInternal = function() {
  goog.ui.ScrollFloater.base(this, "disposeInternal");
  this.placeholder_ = null;
};
goog.ui.ScrollFloater.prototype.setScrollingEnabled = function(enable) {
  this.scrollingEnabled_ = enable;
  if (enable) {
    this.applyIeBgHack_();
    this.handleScroll_();
  } else {
    this.dock_();
  }
};
goog.ui.ScrollFloater.prototype.isScrollingEnabled = function() {
  return this.scrollingEnabled_;
};
goog.ui.ScrollFloater.prototype.isFloating = function() {
  return this.floating_;
};
goog.ui.ScrollFloater.prototype.isPinned = function() {
  return this.pinned_;
};
goog.ui.ScrollFloater.prototype.setViewportTopOffset = function(offset) {
  this.viewportTopOffset_ = offset;
  this.update();
};
goog.ui.ScrollFloater.prototype.setContainerElement = function(container) {
  this.containerElement_ = container;
  this.update();
};
goog.ui.ScrollFloater.prototype.handleScroll_ = function(opt_e) {
  if (this.scrollingEnabled_) {
    var scrollTop = this.getDomHelper().getDocumentScroll().y;
    if (this.originalBounds_.top - scrollTop >= this.viewportTopOffset_) {
      this.dock_();
      return;
    }
    var effectiveElementHeight = this.originalBounds_.height + this.viewportTopOffset_;
    if (this.containerElement_) {
      var containerBottom = this.containerBounds_.top + this.containerBounds_.height;
      if (scrollTop > containerBottom - effectiveElementHeight) {
        this.pin_();
        return;
      }
    }
    var windowHeight = this.getDomHelper().getViewportSize().height;
    if (this.needsIePositionHack_() || effectiveElementHeight < windowHeight) {
      this.float_(goog.ui.ScrollFloater.FloatMode_.TOP);
      return;
    }
    if (this.originalBounds_.height + this.originalTopOffset_ > windowHeight + scrollTop) {
      this.dock_();
    } else {
      this.float_(goog.ui.ScrollFloater.FloatMode_.BOTTOM);
    }
  }
};
goog.ui.ScrollFloater.prototype.pin_ = function() {
  if (this.floating_ && !this.dock_()) {
    return;
  }
  if (this.pinned_ || !this.dispatchEvent(goog.ui.ScrollFloater.EventType.PIN)) {
    return;
  }
  var elem = this.getElement();
  this.storeOriginalStyles_();
  elem.style.position = "relative";
  elem.style.top = this.containerBounds_.height - this.originalBounds_.height - this.originalBounds_.top + this.containerBounds_.top + "px";
  this.pinned_ = true;
};
goog.ui.ScrollFloater.prototype.float_ = function(floatMode) {
  var isTop = floatMode == goog.ui.ScrollFloater.FloatMode_.TOP;
  if (this.pinned_ && !this.dock_()) {
    return;
  }
  if (this.floating_ || !this.dispatchEvent(goog.ui.ScrollFloater.EventType.FLOAT)) {
    return;
  }
  var elem = (this.getElement());
  var doc = this.getDomHelper().getDocument();
  var originalLeft_ = goog.style.getPageOffsetLeft(elem);
  var originalWidth_ = goog.style.getContentBoxSize(elem).width;
  this.storeOriginalStyles_();
  goog.style.setSize(this.placeholder_, elem.offsetWidth, elem.offsetHeight);
  goog.style.setStyle(elem, {"left":originalLeft_ + "px", "width":originalWidth_ + "px", "cssFloat":"none"});
  if (elem.parentNode == this.parentElement_) {
    elem.parentNode.insertBefore(this.placeholder_, elem);
  } else {
    elem.parentNode.replaceChild(this.placeholder_, elem);
    this.parentElement_.appendChild(elem);
  }
  if (this.needsIePositionHack_()) {
    elem.style.position = "absolute";
    elem.style.setExpression("top", 'document.compatMode=="CSS1Compat"?' + "documentElement.scrollTop:document.body.scrollTop");
  } else {
    elem.style.position = "fixed";
    if (isTop) {
      elem.style.top = this.viewportTopOffset_ + "px";
      elem.style.bottom = "auto";
    } else {
      elem.style.top = "auto";
      elem.style.bottom = 0;
    }
  }
  this.floating_ = true;
};
goog.ui.ScrollFloater.prototype.dock_ = function() {
  if (!(this.floating_ || this.pinned_) || !this.dispatchEvent(goog.ui.ScrollFloater.EventType.DOCK)) {
    return false;
  }
  var elem = this.getElement();
  if (this.floating_) {
    this.restoreOriginalStyles_();
    if (this.needsIePositionHack_()) {
      elem.style.removeExpression("top");
    }
    if (this.placeholder_.parentNode == this.parentElement_) {
      this.placeholder_.parentNode.removeChild(this.placeholder_);
    } else {
      this.placeholder_.parentNode.replaceChild(elem, this.placeholder_);
    }
  }
  if (this.pinned_) {
    this.restoreOriginalStyles_();
  }
  this.floating_ = this.pinned_ = false;
  return true;
};
goog.ui.ScrollFloater.prototype.storeOriginalStyles_ = function() {
  var elem = this.getElement();
  this.originalStyles_ = {};
  goog.array.forEach(goog.ui.ScrollFloater.STORED_STYLE_PROPS_, function(property) {
    this.originalStyles_[property] = elem.style[property];
  }, this);
  goog.array.forEach(goog.ui.ScrollFloater.PLACEHOLDER_STYLE_PROPS_, function(property) {
    this.placeholder_.style[property] = elem.style[property] || goog.style.getCascadedStyle(elem, property) || goog.style.getComputedStyle(elem, property);
  }, this);
};
goog.ui.ScrollFloater.prototype.restoreOriginalStyles_ = function() {
  var elem = this.getElement();
  for (var prop in this.originalStyles_) {
    elem.style[prop] = this.originalStyles_[prop];
  }
};
goog.ui.ScrollFloater.prototype.needsIePositionHack_ = function() {
  return goog.userAgent.IE && !(goog.userAgent.isVersionOrHigher("7") && this.getDomHelper().isCss1CompatMode());
};
goog.ui.ScrollFloater.prototype.applyIeBgHack_ = function() {
  if (this.needsIePositionHack_()) {
    var doc = this.getDomHelper().getDocument();
    var topLevelElement = goog.style.getClientViewportElement(doc);
    if (topLevelElement.currentStyle.backgroundImage == "none") {
      topLevelElement.style.backgroundImage = this.getDomHelper().getWindow().location.protocol == "https:" ? "url(https:///)" : "url(about:blank)";
      topLevelElement.style.backgroundAttachment = "fixed";
    }
  }
};
goog.provide("goog.ui.ControlRenderer");
goog.require("goog.a11y.aria");
goog.require("goog.a11y.aria.Role");
goog.require("goog.a11y.aria.State");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.dom.classlist");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.style");
goog.require("goog.ui.Component");
goog.require("goog.userAgent");
goog.ui.ControlRenderer = function() {
};
goog.addSingletonGetter(goog.ui.ControlRenderer);
goog.tagUnsealableClass(goog.ui.ControlRenderer);
goog.ui.ControlRenderer.getCustomRenderer = function(ctor, cssClassName) {
  var renderer = new ctor;
  renderer.getCssClass = function() {
    return cssClassName;
  };
  return renderer;
};
goog.ui.ControlRenderer.CSS_CLASS = goog.getCssName("goog-control");
goog.ui.ControlRenderer.IE6_CLASS_COMBINATIONS = [];
goog.ui.ControlRenderer.ariaAttributeMap_;
goog.ui.ControlRenderer.TOGGLE_ARIA_STATE_MAP_ = goog.object.create(goog.a11y.aria.Role.BUTTON, goog.a11y.aria.State.PRESSED, goog.a11y.aria.Role.CHECKBOX, goog.a11y.aria.State.CHECKED, goog.a11y.aria.Role.MENU_ITEM, goog.a11y.aria.State.SELECTED, goog.a11y.aria.Role.MENU_ITEM_CHECKBOX, goog.a11y.aria.State.CHECKED, goog.a11y.aria.Role.MENU_ITEM_RADIO, goog.a11y.aria.State.CHECKED, goog.a11y.aria.Role.RADIO, goog.a11y.aria.State.CHECKED, goog.a11y.aria.Role.TAB, goog.a11y.aria.State.SELECTED, goog.a11y.aria.Role.TREEITEM, 
goog.a11y.aria.State.SELECTED);
goog.ui.ControlRenderer.prototype.getAriaRole = function() {
  return undefined;
};
goog.ui.ControlRenderer.prototype.createDom = function(control) {
  var element = control.getDomHelper().createDom(goog.dom.TagName.DIV, this.getClassNames(control).join(" "), control.getContent());
  return element;
};
goog.ui.ControlRenderer.prototype.getContentElement = function(element) {
  return element;
};
goog.ui.ControlRenderer.prototype.enableClassName = function(control, className, enable) {
  var element = (control.getElement ? control.getElement() : control);
  if (element) {
    var classNames = [className];
    if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("7")) {
      classNames = this.getAppliedCombinedClassNames_(goog.dom.classlist.get(element), className);
      classNames.push(className);
    }
    goog.dom.classlist.enableAll(element, classNames, enable);
  }
};
goog.ui.ControlRenderer.prototype.enableExtraClassName = function(control, className, enable) {
  this.enableClassName(control, className, enable);
};
goog.ui.ControlRenderer.prototype.canDecorate = function(element) {
  return true;
};
goog.ui.ControlRenderer.prototype.decorate = function(control, element) {
  if (element.id) {
    control.setId(element.id);
  }
  var contentElem = this.getContentElement(element);
  if (contentElem && contentElem.firstChild) {
    control.setContentInternal(contentElem.firstChild.nextSibling ? goog.array.clone(contentElem.childNodes) : contentElem.firstChild);
  } else {
    control.setContentInternal(null);
  }
  var state = 0;
  var rendererClassName = this.getCssClass();
  var structuralClassName = this.getStructuralCssClass();
  var hasRendererClassName = false;
  var hasStructuralClassName = false;
  var hasCombinedClassName = false;
  var classNames = goog.array.toArray(goog.dom.classlist.get(element));
  goog.array.forEach(classNames, function(className) {
    if (!hasRendererClassName && className == rendererClassName) {
      hasRendererClassName = true;
      if (structuralClassName == rendererClassName) {
        hasStructuralClassName = true;
      }
    } else {
      if (!hasStructuralClassName && className == structuralClassName) {
        hasStructuralClassName = true;
      } else {
        state |= this.getStateFromClass(className);
      }
    }
    if (this.getStateFromClass(className) == goog.ui.Component.State.DISABLED) {
      goog.asserts.assertElement(contentElem);
      if (goog.dom.isFocusableTabIndex(contentElem)) {
        goog.dom.setFocusableTabIndex(contentElem, false);
      }
    }
  }, this);
  control.setStateInternal(state);
  if (!hasRendererClassName) {
    classNames.push(rendererClassName);
    if (structuralClassName == rendererClassName) {
      hasStructuralClassName = true;
    }
  }
  if (!hasStructuralClassName) {
    classNames.push(structuralClassName);
  }
  var extraClassNames = control.getExtraClassNames();
  if (extraClassNames) {
    classNames.push.apply(classNames, extraClassNames);
  }
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("7")) {
    var combinedClasses = this.getAppliedCombinedClassNames_(classNames);
    if (combinedClasses.length > 0) {
      classNames.push.apply(classNames, combinedClasses);
      hasCombinedClassName = true;
    }
  }
  if (!hasRendererClassName || !hasStructuralClassName || extraClassNames || hasCombinedClassName) {
    goog.dom.classlist.set(element, classNames.join(" "));
  }
  return element;
};
goog.ui.ControlRenderer.prototype.initializeDom = function(control) {
  if (control.isRightToLeft()) {
    this.setRightToLeft(control.getElement(), true);
  }
  if (control.isEnabled()) {
    this.setFocusable(control, control.isVisible());
  }
};
goog.ui.ControlRenderer.prototype.setAriaRole = function(element, opt_preferredRole) {
  var ariaRole = opt_preferredRole || this.getAriaRole();
  if (ariaRole) {
    goog.asserts.assert(element, "The element passed as a first parameter cannot be null.");
    var currentRole = goog.a11y.aria.getRole(element);
    if (ariaRole == currentRole) {
      return;
    }
    goog.a11y.aria.setRole(element, ariaRole);
  }
};
goog.ui.ControlRenderer.prototype.setAriaStates = function(control, element) {
  goog.asserts.assert(control);
  goog.asserts.assert(element);
  var ariaLabel = control.getAriaLabel();
  if (goog.isDefAndNotNull(ariaLabel)) {
    this.setAriaLabel(element, ariaLabel);
  }
  if (!control.isVisible()) {
    goog.a11y.aria.setState(element, goog.a11y.aria.State.HIDDEN, !control.isVisible());
  }
  if (!control.isEnabled()) {
    this.updateAriaState(element, goog.ui.Component.State.DISABLED, !control.isEnabled());
  }
  if (control.isSupportedState(goog.ui.Component.State.SELECTED)) {
    this.updateAriaState(element, goog.ui.Component.State.SELECTED, control.isSelected());
  }
  if (control.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.updateAriaState(element, goog.ui.Component.State.CHECKED, control.isChecked());
  }
  if (control.isSupportedState(goog.ui.Component.State.OPENED)) {
    this.updateAriaState(element, goog.ui.Component.State.OPENED, control.isOpen());
  }
};
goog.ui.ControlRenderer.prototype.setAriaLabel = function(element, ariaLabel) {
  goog.a11y.aria.setLabel(element, ariaLabel);
};
goog.ui.ControlRenderer.prototype.setAllowTextSelection = function(element, allow) {
  goog.style.setUnselectable(element, !allow, !goog.userAgent.IE && !goog.userAgent.OPERA);
};
goog.ui.ControlRenderer.prototype.setRightToLeft = function(element, rightToLeft) {
  this.enableClassName(element, goog.getCssName(this.getStructuralCssClass(), "rtl"), rightToLeft);
};
goog.ui.ControlRenderer.prototype.isFocusable = function(control) {
  var keyTarget;
  if (control.isSupportedState(goog.ui.Component.State.FOCUSED) && (keyTarget = control.getKeyEventTarget())) {
    return goog.dom.isFocusableTabIndex(keyTarget);
  }
  return false;
};
goog.ui.ControlRenderer.prototype.setFocusable = function(control, focusable) {
  var keyTarget;
  if (control.isSupportedState(goog.ui.Component.State.FOCUSED) && (keyTarget = control.getKeyEventTarget())) {
    if (!focusable && control.isFocused()) {
      try {
        keyTarget.blur();
      } catch (e) {
      }
      if (control.isFocused()) {
        control.handleBlur(null);
      }
    }
    if (goog.dom.isFocusableTabIndex(keyTarget) != focusable) {
      goog.dom.setFocusableTabIndex(keyTarget, focusable);
    }
  }
};
goog.ui.ControlRenderer.prototype.setVisible = function(element, visible) {
  goog.style.setElementShown(element, visible);
  if (element) {
    goog.a11y.aria.setState(element, goog.a11y.aria.State.HIDDEN, !visible);
  }
};
goog.ui.ControlRenderer.prototype.setState = function(control, state, enable) {
  var element = control.getElement();
  if (element) {
    var className = this.getClassForState(state);
    if (className) {
      this.enableClassName(control, className, enable);
    }
    this.updateAriaState(element, state, enable);
  }
};
goog.ui.ControlRenderer.prototype.updateAriaState = function(element, state, enable) {
  if (!goog.ui.ControlRenderer.ariaAttributeMap_) {
    goog.ui.ControlRenderer.ariaAttributeMap_ = goog.object.create(goog.ui.Component.State.DISABLED, goog.a11y.aria.State.DISABLED, goog.ui.Component.State.SELECTED, goog.a11y.aria.State.SELECTED, goog.ui.Component.State.CHECKED, goog.a11y.aria.State.CHECKED, goog.ui.Component.State.OPENED, goog.a11y.aria.State.EXPANDED);
  }
  goog.asserts.assert(element, "The element passed as a first parameter cannot be null.");
  var ariaAttr = goog.ui.ControlRenderer.getAriaStateForAriaRole_(element, goog.ui.ControlRenderer.ariaAttributeMap_[state]);
  if (ariaAttr) {
    goog.a11y.aria.setState(element, ariaAttr, enable);
  }
};
goog.ui.ControlRenderer.getAriaStateForAriaRole_ = function(element, attr) {
  var role = goog.a11y.aria.getRole(element);
  if (!role) {
    return attr;
  }
  role = (role);
  var matchAttr = goog.ui.ControlRenderer.TOGGLE_ARIA_STATE_MAP_[role] || attr;
  return goog.ui.ControlRenderer.isAriaState_(attr) ? matchAttr : attr;
};
goog.ui.ControlRenderer.isAriaState_ = function(attr) {
  return attr == goog.a11y.aria.State.CHECKED || attr == goog.a11y.aria.State.SELECTED;
};
goog.ui.ControlRenderer.prototype.setContent = function(element, content) {
  var contentElem = this.getContentElement(element);
  if (contentElem) {
    goog.dom.removeChildren(contentElem);
    if (content) {
      if (goog.isString(content)) {
        goog.dom.setTextContent(contentElem, content);
      } else {
        var childHandler = function(child) {
          if (child) {
            var doc = goog.dom.getOwnerDocument(contentElem);
            contentElem.appendChild(goog.isString(child) ? doc.createTextNode(child) : child);
          }
        };
        if (goog.isArray(content)) {
          goog.array.forEach(content, childHandler);
        } else {
          if (goog.isArrayLike(content) && !("nodeType" in content)) {
            goog.array.forEach(goog.array.clone((content)), childHandler);
          } else {
            childHandler(content);
          }
        }
      }
    }
  }
};
goog.ui.ControlRenderer.prototype.getKeyEventTarget = function(control) {
  return control.getElement();
};
goog.ui.ControlRenderer.prototype.getCssClass = function() {
  return goog.ui.ControlRenderer.CSS_CLASS;
};
goog.ui.ControlRenderer.prototype.getIe6ClassCombinations = function() {
  return [];
};
goog.ui.ControlRenderer.prototype.getStructuralCssClass = function() {
  return this.getCssClass();
};
goog.ui.ControlRenderer.prototype.getClassNames = function(control) {
  var cssClass = this.getCssClass();
  var classNames = [cssClass];
  var structuralCssClass = this.getStructuralCssClass();
  if (structuralCssClass != cssClass) {
    classNames.push(structuralCssClass);
  }
  var classNamesForState = this.getClassNamesForState(control.getState());
  classNames.push.apply(classNames, classNamesForState);
  var extraClassNames = control.getExtraClassNames();
  if (extraClassNames) {
    classNames.push.apply(classNames, extraClassNames);
  }
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("7")) {
    classNames.push.apply(classNames, this.getAppliedCombinedClassNames_(classNames));
  }
  return classNames;
};
goog.ui.ControlRenderer.prototype.getAppliedCombinedClassNames_ = function(classes, opt_includedClass) {
  var toAdd = [];
  if (opt_includedClass) {
    classes = classes.concat([opt_includedClass]);
  }
  goog.array.forEach(this.getIe6ClassCombinations(), function(combo) {
    if (goog.array.every(combo, goog.partial(goog.array.contains, classes)) && (!opt_includedClass || goog.array.contains(combo, opt_includedClass))) {
      toAdd.push(combo.join("_"));
    }
  });
  return toAdd;
};
goog.ui.ControlRenderer.prototype.getClassNamesForState = function(state) {
  var classNames = [];
  while (state) {
    var mask = state & -state;
    classNames.push(this.getClassForState((mask)));
    state &= ~mask;
  }
  return classNames;
};
goog.ui.ControlRenderer.prototype.getClassForState = function(state) {
  if (!this.classByState_) {
    this.createClassByStateMap_();
  }
  return this.classByState_[state];
};
goog.ui.ControlRenderer.prototype.getStateFromClass = function(className) {
  if (!this.stateByClass_) {
    this.createStateByClassMap_();
  }
  var state = parseInt(this.stateByClass_[className], 10);
  return (isNaN(state) ? 0 : state);
};
goog.ui.ControlRenderer.prototype.createClassByStateMap_ = function() {
  var baseClass = this.getStructuralCssClass();
  var isValidClassName = !goog.string.contains(goog.string.normalizeWhitespace(baseClass), " ");
  goog.asserts.assert(isValidClassName, "ControlRenderer has an invalid css class: '" + baseClass + "'");
  this.classByState_ = goog.object.create(goog.ui.Component.State.DISABLED, goog.getCssName(baseClass, "disabled"), goog.ui.Component.State.HOVER, goog.getCssName(baseClass, "hover"), goog.ui.Component.State.ACTIVE, goog.getCssName(baseClass, "active"), goog.ui.Component.State.SELECTED, goog.getCssName(baseClass, "selected"), goog.ui.Component.State.CHECKED, goog.getCssName(baseClass, "checked"), goog.ui.Component.State.FOCUSED, goog.getCssName(baseClass, "focused"), goog.ui.Component.State.OPENED, 
  goog.getCssName(baseClass, "open"));
};
goog.ui.ControlRenderer.prototype.createStateByClassMap_ = function() {
  if (!this.classByState_) {
    this.createClassByStateMap_();
  }
  this.stateByClass_ = goog.object.transpose(this.classByState_);
};
goog.provide("goog.ui.TextareaRenderer");
goog.require("goog.dom.TagName");
goog.require("goog.ui.Component");
goog.require("goog.ui.ControlRenderer");
goog.ui.TextareaRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(goog.ui.TextareaRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.TextareaRenderer);
goog.ui.TextareaRenderer.CSS_CLASS = goog.getCssName("goog-textarea");
goog.ui.TextareaRenderer.prototype.getAriaRole = function() {
  return undefined;
};
goog.ui.TextareaRenderer.prototype.decorate = function(control, element) {
  this.setUpTextarea_(control);
  goog.ui.TextareaRenderer.superClass_.decorate.call(this, control, element);
  control.setContent(element.value);
  return element;
};
goog.ui.TextareaRenderer.prototype.createDom = function(textarea) {
  this.setUpTextarea_(textarea);
  var element = textarea.getDomHelper().createDom(goog.dom.TagName.TEXTAREA, {"class":this.getClassNames(textarea).join(" "), "disabled":!textarea.isEnabled()}, textarea.getContent() || "");
  return element;
};
goog.ui.TextareaRenderer.prototype.canDecorate = function(element) {
  return element.tagName == goog.dom.TagName.TEXTAREA;
};
goog.ui.TextareaRenderer.prototype.setRightToLeft = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.isFocusable = function(textarea) {
  return textarea.isEnabled();
};
goog.ui.TextareaRenderer.prototype.setFocusable = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.setState = function(textarea, state, enable) {
  goog.ui.TextareaRenderer.superClass_.setState.call(this, textarea, state, enable);
  var element = textarea.getElement();
  if (element && state == goog.ui.Component.State.DISABLED) {
    element.disabled = enable;
  }
};
goog.ui.TextareaRenderer.prototype.updateAriaState = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.setUpTextarea_ = function(textarea) {
  textarea.setHandleMouseEvents(false);
  textarea.setAutoStates(goog.ui.Component.State.ALL, false);
  textarea.setSupportedState(goog.ui.Component.State.FOCUSED, false);
};
goog.ui.TextareaRenderer.prototype.setContent = function(element, value) {
  if (element) {
    element.value = value;
  }
};
goog.ui.TextareaRenderer.prototype.getCssClass = function() {
  return goog.ui.TextareaRenderer.CSS_CLASS;
};
goog.provide("goog.ui.Control");
goog.require("goog.Disposable");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.Event");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.events.KeyHandler");
goog.require("goog.string");
goog.require("goog.ui.Component");
goog.require("goog.ui.ControlContent");
goog.require("goog.ui.ControlRenderer");
goog.require("goog.ui.decorate");
goog.require("goog.ui.registry");
goog.require("goog.userAgent");
goog.ui.Control = function(opt_content, opt_renderer, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.renderer_ = opt_renderer || goog.ui.registry.getDefaultRenderer(this.constructor);
  this.setContentInternal(goog.isDef(opt_content) ? opt_content : null);
  this.ariaLabel_ = null;
  this.ieMouseEventSequenceSimulator_;
};
goog.inherits(goog.ui.Control, goog.ui.Component);
goog.tagUnsealableClass(goog.ui.Control);
goog.ui.Control.registerDecorator = goog.ui.registry.setDecoratorByClassName;
goog.ui.Control.getDecorator = (goog.ui.registry.getDecorator);
goog.ui.Control.decorate = (goog.ui.decorate);
goog.ui.Control.prototype.renderer_;
goog.ui.Control.prototype.content_ = null;
goog.ui.Control.prototype.state_ = 0;
goog.ui.Control.prototype.supportedStates_ = goog.ui.Component.State.DISABLED | goog.ui.Component.State.HOVER | goog.ui.Component.State.ACTIVE | goog.ui.Component.State.FOCUSED;
goog.ui.Control.prototype.autoStates_ = goog.ui.Component.State.ALL;
goog.ui.Control.prototype.statesWithTransitionEvents_ = 0;
goog.ui.Control.prototype.visible_ = true;
goog.ui.Control.prototype.keyHandler_;
goog.ui.Control.prototype.extraClassNames_ = null;
goog.ui.Control.prototype.handleMouseEvents_ = true;
goog.ui.Control.prototype.allowTextSelection_ = false;
goog.ui.Control.prototype.preferredAriaRole_ = null;
goog.ui.Control.prototype.isHandleMouseEvents = function() {
  return this.handleMouseEvents_;
};
goog.ui.Control.prototype.setHandleMouseEvents = function(enable) {
  if (this.isInDocument() && enable != this.handleMouseEvents_) {
    this.enableMouseEventHandling_(enable);
  }
  this.handleMouseEvents_ = enable;
};
goog.ui.Control.prototype.getKeyEventTarget = function() {
  return this.renderer_.getKeyEventTarget(this);
};
goog.ui.Control.prototype.getKeyHandler = function() {
  return this.keyHandler_ || (this.keyHandler_ = new goog.events.KeyHandler);
};
goog.ui.Control.prototype.getRenderer = function() {
  return this.renderer_;
};
goog.ui.Control.prototype.setRenderer = function(renderer) {
  if (this.isInDocument()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (this.getElement()) {
    this.setElementInternal(null);
  }
  this.renderer_ = renderer;
};
goog.ui.Control.prototype.getExtraClassNames = function() {
  return this.extraClassNames_;
};
goog.ui.Control.prototype.addClassName = function(className) {
  if (className) {
    if (this.extraClassNames_) {
      if (!goog.array.contains(this.extraClassNames_, className)) {
        this.extraClassNames_.push(className);
      }
    } else {
      this.extraClassNames_ = [className];
    }
    this.renderer_.enableExtraClassName(this, className, true);
  }
};
goog.ui.Control.prototype.removeClassName = function(className) {
  if (className && this.extraClassNames_ && goog.array.remove(this.extraClassNames_, className)) {
    if (this.extraClassNames_.length == 0) {
      this.extraClassNames_ = null;
    }
    this.renderer_.enableExtraClassName(this, className, false);
  }
};
goog.ui.Control.prototype.enableClassName = function(className, enable) {
  if (enable) {
    this.addClassName(className);
  } else {
    this.removeClassName(className);
  }
};
goog.ui.Control.prototype.createDom = function() {
  var element = this.renderer_.createDom(this);
  this.setElementInternal(element);
  this.renderer_.setAriaRole(element, this.getPreferredAriaRole());
  if (!this.isAllowTextSelection()) {
    this.renderer_.setAllowTextSelection(element, false);
  }
  if (!this.isVisible()) {
    this.renderer_.setVisible(element, false);
  }
};
goog.ui.Control.prototype.getPreferredAriaRole = function() {
  return this.preferredAriaRole_;
};
goog.ui.Control.prototype.setPreferredAriaRole = function(role) {
  this.preferredAriaRole_ = role;
};
goog.ui.Control.prototype.getAriaLabel = function() {
  return this.ariaLabel_;
};
goog.ui.Control.prototype.setAriaLabel = function(label) {
  this.ariaLabel_ = label;
  var element = this.getElement();
  if (element) {
    this.renderer_.setAriaLabel(element, label);
  }
};
goog.ui.Control.prototype.getContentElement = function() {
  return this.renderer_.getContentElement(this.getElement());
};
goog.ui.Control.prototype.canDecorate = function(element) {
  return this.renderer_.canDecorate(element);
};
goog.ui.Control.prototype.decorateInternal = function(element) {
  element = this.renderer_.decorate(this, element);
  this.setElementInternal(element);
  this.renderer_.setAriaRole(element, this.getPreferredAriaRole());
  if (!this.isAllowTextSelection()) {
    this.renderer_.setAllowTextSelection(element, false);
  }
  this.visible_ = element.style.display != "none";
};
goog.ui.Control.prototype.enterDocument = function() {
  goog.ui.Control.superClass_.enterDocument.call(this);
  this.renderer_.setAriaStates(this, this.getElementStrict());
  this.renderer_.initializeDom(this);
  if (this.supportedStates_ & ~goog.ui.Component.State.DISABLED) {
    if (this.isHandleMouseEvents()) {
      this.enableMouseEventHandling_(true);
    }
    if (this.isSupportedState(goog.ui.Component.State.FOCUSED)) {
      var keyTarget = this.getKeyEventTarget();
      if (keyTarget) {
        var keyHandler = this.getKeyHandler();
        keyHandler.attach(keyTarget);
        this.getHandler().listen(keyHandler, goog.events.KeyHandler.EventType.KEY, this.handleKeyEvent).listen(keyTarget, goog.events.EventType.FOCUS, this.handleFocus).listen(keyTarget, goog.events.EventType.BLUR, this.handleBlur);
      }
    }
  }
};
goog.ui.Control.prototype.enableMouseEventHandling_ = function(enable) {
  var handler = this.getHandler();
  var element = this.getElement();
  if (enable) {
    handler.listen(element, goog.events.EventType.MOUSEOVER, this.handleMouseOver).listen(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).listen(element, goog.events.EventType.MOUSEUP, this.handleMouseUp).listen(element, goog.events.EventType.MOUSEOUT, this.handleMouseOut);
    if (this.handleContextMenu != goog.nullFunction) {
      handler.listen(element, goog.events.EventType.CONTEXTMENU, this.handleContextMenu);
    }
    if (goog.userAgent.IE) {
      handler.listen(element, goog.events.EventType.DBLCLICK, this.handleDblClick);
      if (!this.ieMouseEventSequenceSimulator_) {
        this.ieMouseEventSequenceSimulator_ = new goog.ui.Control.IeMouseEventSequenceSimulator_(this);
        this.registerDisposable(this.ieMouseEventSequenceSimulator_);
      }
    }
  } else {
    handler.unlisten(element, goog.events.EventType.MOUSEOVER, this.handleMouseOver).unlisten(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).unlisten(element, goog.events.EventType.MOUSEUP, this.handleMouseUp).unlisten(element, goog.events.EventType.MOUSEOUT, this.handleMouseOut);
    if (this.handleContextMenu != goog.nullFunction) {
      handler.unlisten(element, goog.events.EventType.CONTEXTMENU, this.handleContextMenu);
    }
    if (goog.userAgent.IE) {
      handler.unlisten(element, goog.events.EventType.DBLCLICK, this.handleDblClick);
      goog.dispose(this.ieMouseEventSequenceSimulator_);
      this.ieMouseEventSequenceSimulator_ = null;
    }
  }
};
goog.ui.Control.prototype.exitDocument = function() {
  goog.ui.Control.superClass_.exitDocument.call(this);
  if (this.keyHandler_) {
    this.keyHandler_.detach();
  }
  if (this.isVisible() && this.isEnabled()) {
    this.renderer_.setFocusable(this, false);
  }
};
goog.ui.Control.prototype.disposeInternal = function() {
  goog.ui.Control.superClass_.disposeInternal.call(this);
  if (this.keyHandler_) {
    this.keyHandler_.dispose();
    delete this.keyHandler_;
  }
  delete this.renderer_;
  this.content_ = null;
  this.extraClassNames_ = null;
  this.ieMouseEventSequenceSimulator_ = null;
};
goog.ui.Control.prototype.getContent = function() {
  return this.content_;
};
goog.ui.Control.prototype.setContent = function(content) {
  this.renderer_.setContent(this.getElement(), content);
  this.setContentInternal(content);
};
goog.ui.Control.prototype.setContentInternal = function(content) {
  this.content_ = content;
};
goog.ui.Control.prototype.getCaption = function() {
  var content = this.getContent();
  if (!content) {
    return "";
  }
  var caption = goog.isString(content) ? content : goog.isArray(content) ? goog.array.map(content, goog.dom.getRawTextContent).join("") : goog.dom.getTextContent((content));
  return goog.string.collapseBreakingSpaces(caption);
};
goog.ui.Control.prototype.setCaption = function(caption) {
  this.setContent(caption);
};
goog.ui.Control.prototype.setRightToLeft = function(rightToLeft) {
  goog.ui.Control.superClass_.setRightToLeft.call(this, rightToLeft);
  var element = this.getElement();
  if (element) {
    this.renderer_.setRightToLeft(element, rightToLeft);
  }
};
goog.ui.Control.prototype.isAllowTextSelection = function() {
  return this.allowTextSelection_;
};
goog.ui.Control.prototype.setAllowTextSelection = function(allow) {
  this.allowTextSelection_ = allow;
  var element = this.getElement();
  if (element) {
    this.renderer_.setAllowTextSelection(element, allow);
  }
};
goog.ui.Control.prototype.isVisible = function() {
  return this.visible_;
};
goog.ui.Control.prototype.setVisible = function(visible, opt_force) {
  if (opt_force || this.visible_ != visible && this.dispatchEvent(visible ? goog.ui.Component.EventType.SHOW : goog.ui.Component.EventType.HIDE)) {
    var element = this.getElement();
    if (element) {
      this.renderer_.setVisible(element, visible);
    }
    if (this.isEnabled()) {
      this.renderer_.setFocusable(this, visible);
    }
    this.visible_ = visible;
    return true;
  }
  return false;
};
goog.ui.Control.prototype.isEnabled = function() {
  return !this.hasState(goog.ui.Component.State.DISABLED);
};
goog.ui.Control.prototype.isParentDisabled_ = function() {
  var parent = this.getParent();
  return !!parent && typeof parent.isEnabled == "function" && !parent.isEnabled();
};
goog.ui.Control.prototype.setEnabled = function(enable) {
  if (!this.isParentDisabled_() && this.isTransitionAllowed(goog.ui.Component.State.DISABLED, !enable)) {
    if (!enable) {
      this.setActive(false);
      this.setHighlighted(false);
    }
    if (this.isVisible()) {
      this.renderer_.setFocusable(this, enable);
    }
    this.setState(goog.ui.Component.State.DISABLED, !enable, true);
  }
};
goog.ui.Control.prototype.isHighlighted = function() {
  return this.hasState(goog.ui.Component.State.HOVER);
};
goog.ui.Control.prototype.setHighlighted = function(highlight) {
  if (this.isTransitionAllowed(goog.ui.Component.State.HOVER, highlight)) {
    this.setState(goog.ui.Component.State.HOVER, highlight);
  }
};
goog.ui.Control.prototype.isActive = function() {
  return this.hasState(goog.ui.Component.State.ACTIVE);
};
goog.ui.Control.prototype.setActive = function(active) {
  if (this.isTransitionAllowed(goog.ui.Component.State.ACTIVE, active)) {
    this.setState(goog.ui.Component.State.ACTIVE, active);
  }
};
goog.ui.Control.prototype.isSelected = function() {
  return this.hasState(goog.ui.Component.State.SELECTED);
};
goog.ui.Control.prototype.setSelected = function(select) {
  if (this.isTransitionAllowed(goog.ui.Component.State.SELECTED, select)) {
    this.setState(goog.ui.Component.State.SELECTED, select);
  }
};
goog.ui.Control.prototype.isChecked = function() {
  return this.hasState(goog.ui.Component.State.CHECKED);
};
goog.ui.Control.prototype.setChecked = function(check) {
  if (this.isTransitionAllowed(goog.ui.Component.State.CHECKED, check)) {
    this.setState(goog.ui.Component.State.CHECKED, check);
  }
};
goog.ui.Control.prototype.isFocused = function() {
  return this.hasState(goog.ui.Component.State.FOCUSED);
};
goog.ui.Control.prototype.setFocused = function(focused) {
  if (this.isTransitionAllowed(goog.ui.Component.State.FOCUSED, focused)) {
    this.setState(goog.ui.Component.State.FOCUSED, focused);
  }
};
goog.ui.Control.prototype.isOpen = function() {
  return this.hasState(goog.ui.Component.State.OPENED);
};
goog.ui.Control.prototype.setOpen = function(open) {
  if (this.isTransitionAllowed(goog.ui.Component.State.OPENED, open)) {
    this.setState(goog.ui.Component.State.OPENED, open);
  }
};
goog.ui.Control.prototype.getState = function() {
  return this.state_;
};
goog.ui.Control.prototype.hasState = function(state) {
  return !!(this.state_ & state);
};
goog.ui.Control.prototype.setState = function(state, enable, opt_calledFrom) {
  if (!opt_calledFrom && state == goog.ui.Component.State.DISABLED) {
    this.setEnabled(!enable);
    return;
  }
  if (this.isSupportedState(state) && enable != this.hasState(state)) {
    this.renderer_.setState(this, state, enable);
    this.state_ = enable ? this.state_ | state : this.state_ & ~state;
  }
};
goog.ui.Control.prototype.setStateInternal = function(state) {
  this.state_ = state;
};
goog.ui.Control.prototype.isSupportedState = function(state) {
  return !!(this.supportedStates_ & state);
};
goog.ui.Control.prototype.setSupportedState = function(state, support) {
  if (this.isInDocument() && this.hasState(state) && !support) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (!support && this.hasState(state)) {
    this.setState(state, false);
  }
  this.supportedStates_ = support ? this.supportedStates_ | state : this.supportedStates_ & ~state;
};
goog.ui.Control.prototype.isAutoState = function(state) {
  return !!(this.autoStates_ & state) && this.isSupportedState(state);
};
goog.ui.Control.prototype.setAutoStates = function(states, enable) {
  this.autoStates_ = enable ? this.autoStates_ | states : this.autoStates_ & ~states;
};
goog.ui.Control.prototype.isDispatchTransitionEvents = function(state) {
  return !!(this.statesWithTransitionEvents_ & state) && this.isSupportedState(state);
};
goog.ui.Control.prototype.setDispatchTransitionEvents = function(states, enable) {
  this.statesWithTransitionEvents_ = enable ? this.statesWithTransitionEvents_ | states : this.statesWithTransitionEvents_ & ~states;
};
goog.ui.Control.prototype.isTransitionAllowed = function(state, enable) {
  return this.isSupportedState(state) && this.hasState(state) != enable && (!(this.statesWithTransitionEvents_ & state) || this.dispatchEvent(goog.ui.Component.getStateTransitionEvent(state, enable))) && !this.isDisposed();
};
goog.ui.Control.prototype.handleMouseOver = function(e) {
  if (!goog.ui.Control.isMouseEventWithinElement_(e, this.getElement()) && this.dispatchEvent(goog.ui.Component.EventType.ENTER) && this.isEnabled() && this.isAutoState(goog.ui.Component.State.HOVER)) {
    this.setHighlighted(true);
  }
};
goog.ui.Control.prototype.handleMouseOut = function(e) {
  if (!goog.ui.Control.isMouseEventWithinElement_(e, this.getElement()) && this.dispatchEvent(goog.ui.Component.EventType.LEAVE)) {
    if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      this.setActive(false);
    }
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(false);
    }
  }
};
goog.ui.Control.prototype.handleContextMenu = goog.nullFunction;
goog.ui.Control.isMouseEventWithinElement_ = function(e, elem) {
  return !!e.relatedTarget && goog.dom.contains(elem, e.relatedTarget);
};
goog.ui.Control.prototype.handleMouseDown = function(e) {
  if (this.isEnabled()) {
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true);
    }
    if (e.isMouseActionButton()) {
      if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
        this.setActive(true);
      }
      if (this.renderer_ && this.renderer_.isFocusable(this)) {
        this.getKeyEventTarget().focus();
      }
    }
  }
  if (!this.isAllowTextSelection() && e.isMouseActionButton()) {
    e.preventDefault();
  }
};
goog.ui.Control.prototype.handleMouseUp = function(e) {
  if (this.isEnabled()) {
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true);
    }
    if (this.isActive() && this.performActionInternal(e) && this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      this.setActive(false);
    }
  }
};
goog.ui.Control.prototype.handleDblClick = function(e) {
  if (this.isEnabled()) {
    this.performActionInternal(e);
  }
};
goog.ui.Control.prototype.performActionInternal = function(e) {
  if (this.isAutoState(goog.ui.Component.State.CHECKED)) {
    this.setChecked(!this.isChecked());
  }
  if (this.isAutoState(goog.ui.Component.State.SELECTED)) {
    this.setSelected(true);
  }
  if (this.isAutoState(goog.ui.Component.State.OPENED)) {
    this.setOpen(!this.isOpen());
  }
  var actionEvent = new goog.events.Event(goog.ui.Component.EventType.ACTION, this);
  if (e) {
    actionEvent.altKey = e.altKey;
    actionEvent.ctrlKey = e.ctrlKey;
    actionEvent.metaKey = e.metaKey;
    actionEvent.shiftKey = e.shiftKey;
    actionEvent.platformModifierKey = e.platformModifierKey;
  }
  return this.dispatchEvent(actionEvent);
};
goog.ui.Control.prototype.handleFocus = function(e) {
  if (this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(true);
  }
};
goog.ui.Control.prototype.handleBlur = function(e) {
  if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
    this.setActive(false);
  }
  if (this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(false);
  }
};
goog.ui.Control.prototype.handleKeyEvent = function(e) {
  if (this.isVisible() && this.isEnabled() && this.handleKeyEventInternal(e)) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  return false;
};
goog.ui.Control.prototype.handleKeyEventInternal = function(e) {
  return e.keyCode == goog.events.KeyCodes.ENTER && this.performActionInternal(e);
};
goog.ui.registry.setDefaultRenderer(goog.ui.Control, goog.ui.ControlRenderer);
goog.ui.registry.setDecoratorByClassName(goog.ui.ControlRenderer.CSS_CLASS, function() {
  return new goog.ui.Control(null);
});
goog.ui.Control.IeMouseEventSequenceSimulator_ = function(control) {
  goog.ui.Control.IeMouseEventSequenceSimulator_.base(this, "constructor");
  this.control_ = control;
  this.clickExpected_ = false;
  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);
  var element = this.control_.getElementStrict();
  this.handler_.listen(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown_).listen(element, goog.events.EventType.MOUSEUP, this.handleMouseUp_).listen(element, goog.events.EventType.CLICK, this.handleClick_);
};
goog.inherits(goog.ui.Control.IeMouseEventSequenceSimulator_, goog.Disposable);
goog.ui.Control.IeMouseEventSequenceSimulator_.prototype.handleMouseDown_ = function() {
  this.clickExpected_ = false;
};
goog.ui.Control.IeMouseEventSequenceSimulator_.prototype.handleMouseUp_ = function() {
  this.clickExpected_ = true;
};
goog.ui.Control.IeMouseEventSequenceSimulator_.prototype.handleClick_ = function(e) {
  if (this.clickExpected_) {
    this.clickExpected_ = false;
    return;
  }
  var browserEvent = (e);
  var event = browserEvent.getBrowserEvent();
  var origEventButton = event.button;
  var origEventType = event.type;
  event.button = goog.events.BrowserEvent.MouseButton.LEFT;
  event.type = goog.events.EventType.MOUSEDOWN;
  this.control_.handleMouseDown(new goog.events.BrowserEvent(event, browserEvent.currentTarget));
  event.type = goog.events.EventType.MOUSEUP;
  this.control_.handleMouseUp(new goog.events.BrowserEvent(event, browserEvent.currentTarget));
  event.button = origEventButton;
  event.type = origEventType;
};
goog.ui.Control.IeMouseEventSequenceSimulator_.prototype.disposeInternal = function() {
  this.control_ = null;
  goog.ui.Control.IeMouseEventSequenceSimulator_.base(this, "disposeInternal");
};
goog.provide("goog.ui.Textarea");
goog.provide("goog.ui.Textarea.EventType");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.classlist");
goog.require("goog.events.EventType");
goog.require("goog.style");
goog.require("goog.ui.Control");
goog.require("goog.ui.TextareaRenderer");
goog.require("goog.userAgent");
goog.ui.Textarea = function(content, opt_renderer, opt_domHelper) {
  goog.ui.Control.call(this, content, opt_renderer || goog.ui.TextareaRenderer.getInstance(), opt_domHelper);
  this.setHandleMouseEvents(false);
  this.setAllowTextSelection(true);
  this.hasUserInput_ = content != "";
  if (!content) {
    this.setContentInternal("");
  }
};
goog.inherits(goog.ui.Textarea, goog.ui.Control);
goog.tagUnsealableClass(goog.ui.Textarea);
goog.ui.Textarea.NEEDS_HELP_SHRINKING_ = !(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(11));
goog.ui.Textarea.prototype.isResizing_ = false;
goog.ui.Textarea.prototype.hasFocusForPlaceholder_ = false;
goog.ui.Textarea.prototype.hasUserInput_ = false;
goog.ui.Textarea.prototype.height_ = 0;
goog.ui.Textarea.prototype.maxHeight_ = 0;
goog.ui.Textarea.prototype.minHeight_ = 0;
goog.ui.Textarea.prototype.hasDiscoveredTextareaCharacteristics_ = false;
goog.ui.Textarea.prototype.needsPaddingBorderFix_ = false;
goog.ui.Textarea.prototype.scrollHeightIncludesPadding_ = false;
goog.ui.Textarea.prototype.scrollHeightIncludesBorder_ = false;
goog.ui.Textarea.prototype.paddingBox_;
goog.ui.Textarea.prototype.borderBox_;
goog.ui.Textarea.prototype.placeholderText_ = "";
goog.ui.Textarea.EventType = {RESIZE:"resize"};
goog.ui.Textarea.prototype.setPlaceholder = function(text) {
  this.placeholderText_ = text;
  if (this.getElement()) {
    this.restorePlaceholder_();
  }
};
goog.ui.Textarea.prototype.getPaddingBorderBoxHeight_ = function() {
  var paddingBorderBoxHeight = this.paddingBox_.top + this.paddingBox_.bottom + this.borderBox_.top + this.borderBox_.bottom;
  return paddingBorderBoxHeight;
};
goog.ui.Textarea.prototype.getMinHeight = function() {
  return this.minHeight_;
};
goog.ui.Textarea.prototype.getMinHeight_ = function() {
  var minHeight = this.minHeight_;
  var textarea = this.getElement();
  if (minHeight && textarea && this.needsPaddingBorderFix_) {
    minHeight -= this.getPaddingBorderBoxHeight_();
  }
  return minHeight;
};
goog.ui.Textarea.prototype.setMinHeight = function(height) {
  this.minHeight_ = height;
  this.resize();
};
goog.ui.Textarea.prototype.getMaxHeight = function() {
  return this.maxHeight_;
};
goog.ui.Textarea.prototype.getMaxHeight_ = function() {
  var maxHeight = this.maxHeight_;
  var textarea = this.getElement();
  if (maxHeight && textarea && this.needsPaddingBorderFix_) {
    maxHeight -= this.getPaddingBorderBoxHeight_();
  }
  return maxHeight;
};
goog.ui.Textarea.prototype.setMaxHeight = function(height) {
  this.maxHeight_ = height;
  this.resize();
};
goog.ui.Textarea.prototype.setValue = function(value) {
  this.setContent(String(value));
};
goog.ui.Textarea.prototype.getValue = function() {
  if (this.getElement().value != this.placeholderText_ || this.supportsNativePlaceholder_() || this.hasUserInput_) {
    return this.getElement().value;
  }
  return "";
};
goog.ui.Textarea.prototype.setContent = function(content) {
  goog.ui.Textarea.superClass_.setContent.call(this, content);
  this.hasUserInput_ = content != "";
  this.resize();
};
goog.ui.Textarea.prototype.setEnabled = function(enable) {
  goog.ui.Textarea.superClass_.setEnabled.call(this, enable);
  this.getElement().disabled = !enable;
};
goog.ui.Textarea.prototype.resize = function() {
  if (this.getElement()) {
    this.grow_();
  }
};
goog.ui.Textarea.prototype.supportsNativePlaceholder_ = function() {
  goog.asserts.assert(this.getElement());
  return "placeholder" in this.getElement();
};
goog.ui.Textarea.prototype.restorePlaceholder_ = function() {
  if (!this.placeholderText_) {
    return;
  }
  if (this.supportsNativePlaceholder_()) {
    this.getElement().placeholder = this.placeholderText_;
  } else {
    if (this.getElement() && !this.hasUserInput_ && !this.hasFocusForPlaceholder_) {
      goog.dom.classlist.add(goog.asserts.assert(this.getElement()), goog.ui.Textarea.TEXTAREA_PLACEHOLDER_CLASS);
      this.getElement().value = this.placeholderText_;
    }
  }
};
goog.ui.Textarea.prototype.enterDocument = function() {
  goog.ui.Textarea.base(this, "enterDocument");
  var textarea = this.getElement();
  goog.style.setStyle(textarea, {"overflowY":"hidden", "overflowX":"auto", "boxSizing":"border-box", "MsBoxSizing":"border-box", "WebkitBoxSizing":"border-box", "MozBoxSizing":"border-box"});
  this.paddingBox_ = goog.style.getPaddingBox(textarea);
  this.borderBox_ = goog.style.getBorderBox(textarea);
  this.getHandler().listen(textarea, goog.events.EventType.SCROLL, this.grow_).listen(textarea, goog.events.EventType.FOCUS, this.grow_).listen(textarea, goog.events.EventType.KEYUP, this.grow_).listen(textarea, goog.events.EventType.MOUSEUP, this.mouseUpListener_).listen(textarea, goog.events.EventType.BLUR, this.blur_);
  this.restorePlaceholder_();
  this.resize();
};
goog.ui.Textarea.prototype.getHeight_ = function() {
  this.discoverTextareaCharacteristics_();
  var textarea = this.getElement();
  if (isNaN(this.paddingBox_.top)) {
    this.paddingBox_ = goog.style.getPaddingBox(textarea);
    this.borderBox_ = goog.style.getBorderBox(textarea);
  }
  var height = this.getElement().scrollHeight + this.getHorizontalScrollBarHeight_();
  if (this.needsPaddingBorderFix_) {
    height -= this.getPaddingBorderBoxHeight_();
  } else {
    if (!this.scrollHeightIncludesPadding_) {
      var paddingBox = this.paddingBox_;
      var paddingBoxHeight = paddingBox.top + paddingBox.bottom;
      height += paddingBoxHeight;
    }
    if (!this.scrollHeightIncludesBorder_) {
      var borderBox = goog.style.getBorderBox(textarea);
      var borderBoxHeight = borderBox.top + borderBox.bottom;
      height += borderBoxHeight;
    }
  }
  return height;
};
goog.ui.Textarea.prototype.setHeight_ = function(height) {
  if (this.height_ != height) {
    this.height_ = height;
    this.getElement().style.height = height + "px";
  }
};
goog.ui.Textarea.prototype.setHeightToEstimate_ = function() {
  var textarea = this.getElement();
  textarea.style.height = "auto";
  var newlines = textarea.value.match(/\n/g) || [];
  textarea.rows = newlines.length + 1;
  this.height_ = 0;
};
goog.ui.Textarea.prototype.getHorizontalScrollBarHeight_ = function() {
  var textarea = (this.getElement());
  var height = textarea.offsetHeight - textarea.clientHeight;
  if (!this.scrollHeightIncludesPadding_) {
    var paddingBox = this.paddingBox_;
    var paddingBoxHeight = paddingBox.top + paddingBox.bottom;
    height -= paddingBoxHeight;
  }
  if (!this.scrollHeightIncludesBorder_) {
    var borderBox = goog.style.getBorderBox(textarea);
    var borderBoxHeight = borderBox.top + borderBox.bottom;
    height -= borderBoxHeight;
  }
  return height > 0 ? height : 0;
};
goog.ui.Textarea.prototype.discoverTextareaCharacteristics_ = function() {
  if (!this.hasDiscoveredTextareaCharacteristics_) {
    var textarea = (this.getElement().cloneNode(false));
    goog.style.setStyle(textarea, {"position":"absolute", "height":"auto", "top":"-9999px", "margin":"0", "padding":"1px", "border":"1px solid #000", "overflow":"hidden"});
    goog.dom.appendChild(this.getDomHelper().getDocument().body, textarea);
    var initialScrollHeight = textarea.scrollHeight;
    textarea.style.padding = "10px";
    var paddingScrollHeight = textarea.scrollHeight;
    this.scrollHeightIncludesPadding_ = paddingScrollHeight > initialScrollHeight;
    initialScrollHeight = paddingScrollHeight;
    textarea.style.borderWidth = "10px";
    var borderScrollHeight = textarea.scrollHeight;
    this.scrollHeightIncludesBorder_ = borderScrollHeight > initialScrollHeight;
    textarea.style.height = "100px";
    var offsetHeightAtHeight100 = textarea.offsetHeight;
    if (offsetHeightAtHeight100 != 100) {
      this.needsPaddingBorderFix_ = true;
    }
    goog.dom.removeNode(textarea);
    this.hasDiscoveredTextareaCharacteristics_ = true;
  }
};
goog.ui.Textarea.TEXTAREA_PLACEHOLDER_CLASS = goog.getCssName("textarea-placeholder-input");
goog.ui.Textarea.prototype.blur_ = function(opt_e) {
  if (!this.supportsNativePlaceholder_()) {
    this.hasFocusForPlaceholder_ = false;
    if (this.getElement().value == "") {
      this.hasUserInput_ = false;
      this.restorePlaceholder_();
    }
  }
};
goog.ui.Textarea.prototype.grow_ = function(opt_e) {
  if (this.isResizing_) {
    return;
  }
  var textarea = (this.getElement());
  if (!this.supportsNativePlaceholder_() && opt_e && opt_e.type == goog.events.EventType.FOCUS) {
    if (textarea.value == this.placeholderText_ && this.placeholderText_ && !this.hasFocusForPlaceholder_) {
      goog.dom.classlist.remove(textarea, goog.ui.Textarea.TEXTAREA_PLACEHOLDER_CLASS);
      textarea.value = "";
    }
    this.hasFocusForPlaceholder_ = true;
    this.hasUserInput_ = textarea.value != "";
  }
  var shouldCallShrink = false;
  this.isResizing_ = true;
  var oldHeight = this.height_;
  if (textarea.scrollHeight) {
    var setMinHeight = false;
    var setMaxHeight = false;
    var newHeight = this.getHeight_();
    var currentHeight = textarea.offsetHeight;
    var minHeight = this.getMinHeight_();
    var maxHeight = this.getMaxHeight_();
    if (minHeight && newHeight < minHeight) {
      this.setHeight_(minHeight);
      setMinHeight = true;
    } else {
      if (maxHeight && newHeight > maxHeight) {
        this.setHeight_(maxHeight);
        textarea.style.overflowY = "";
        setMaxHeight = true;
      } else {
        if (currentHeight != newHeight) {
          this.setHeight_(newHeight);
        } else {
          if (!this.height_) {
            this.height_ = newHeight;
          }
        }
      }
    }
    if (!setMinHeight && !setMaxHeight && goog.ui.Textarea.NEEDS_HELP_SHRINKING_) {
      shouldCallShrink = true;
    }
  } else {
    this.setHeightToEstimate_();
  }
  this.isResizing_ = false;
  if (shouldCallShrink) {
    this.shrink_();
  }
  if (oldHeight != this.height_) {
    this.dispatchEvent(goog.ui.Textarea.EventType.RESIZE);
  }
};
goog.ui.Textarea.prototype.shrink_ = function() {
  var textarea = this.getElement();
  if (!this.isResizing_) {
    this.isResizing_ = true;
    var scrollHeight = textarea.scrollHeight;
    if (!scrollHeight) {
      this.setHeightToEstimate_();
    } else {
      var currentHeight = this.getHeight_();
      var minHeight = this.getMinHeight_();
      if (!(minHeight && currentHeight <= minHeight)) {
        var paddingBox = this.paddingBox_;
        textarea.style.paddingBottom = paddingBox.bottom + 1 + "px";
        var heightAfterNudge = this.getHeight_();
        if (heightAfterNudge == currentHeight) {
          textarea.style.paddingBottom = paddingBox.bottom + scrollHeight + "px";
          textarea.scrollTop = 0;
          var shrinkToHeight = this.getHeight_() - scrollHeight;
          if (shrinkToHeight >= minHeight) {
            this.setHeight_(shrinkToHeight);
          } else {
            this.setHeight_(minHeight);
          }
        }
        textarea.style.paddingBottom = paddingBox.bottom + "px";
      }
    }
    this.isResizing_ = false;
  }
};
goog.ui.Textarea.prototype.mouseUpListener_ = function(e) {
  var textarea = (this.getElement());
  var height = textarea.offsetHeight;
  if (textarea["filters"] && textarea["filters"].length) {
    var dropShadow = textarea["filters"]["item"]("DXImageTransform.Microsoft.DropShadow");
    if (dropShadow) {
      height -= dropShadow["offX"];
    }
  }
  if (height != this.height_) {
    this.minHeight_ = height;
    this.height_ = height;
  }
};
goog.provide("goog.style.bidi");
goog.require("goog.dom");
goog.require("goog.style");
goog.require("goog.userAgent");
goog.style.bidi.getScrollLeft = function(element) {
  var isRtl = goog.style.isRightToLeft(element);
  if (isRtl && goog.userAgent.GECKO) {
    return -element.scrollLeft;
  } else {
    if (isRtl && !(goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher("8"))) {
      var overflowX = goog.style.getComputedOverflowX(element);
      if (overflowX == "visible") {
        return element.scrollLeft;
      } else {
        return element.scrollWidth - element.clientWidth - element.scrollLeft;
      }
    }
  }
  return element.scrollLeft;
};
goog.style.bidi.getOffsetStart = function(element) {
  element = (element);
  var offsetLeftForReal = element.offsetLeft;
  var bestParent = element.offsetParent;
  if (!bestParent && goog.style.getComputedPosition(element) == "fixed") {
    bestParent = goog.dom.getOwnerDocument(element).documentElement;
  }
  if (!bestParent) {
    return offsetLeftForReal;
  }
  if (goog.userAgent.GECKO) {
    var borderWidths = goog.style.getBorderBox(bestParent);
    offsetLeftForReal += borderWidths.left;
  } else {
    if (goog.userAgent.isDocumentModeOrHigher(8) && !goog.userAgent.isDocumentModeOrHigher(9)) {
      var borderWidths = goog.style.getBorderBox(bestParent);
      offsetLeftForReal -= borderWidths.left;
    }
  }
  if (goog.style.isRightToLeft(bestParent)) {
    var elementRightOffset = offsetLeftForReal + element.offsetWidth;
    return bestParent.clientWidth - elementRightOffset;
  }
  return offsetLeftForReal;
};
goog.style.bidi.setScrollOffset = function(element, offsetStart) {
  offsetStart = Math.max(offsetStart, 0);
  if (!goog.style.isRightToLeft(element)) {
    element.scrollLeft = offsetStart;
  } else {
    if (goog.userAgent.GECKO) {
      element.scrollLeft = -offsetStart;
    } else {
      if (!(goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher("8"))) {
        element.scrollLeft = element.scrollWidth - offsetStart - element.clientWidth;
      } else {
        element.scrollLeft = offsetStart;
      }
    }
  }
};
goog.style.bidi.setPosition = function(elem, left, top, isRtl) {
  if (!goog.isNull(top)) {
    elem.style.top = top + "px";
  }
  if (isRtl) {
    elem.style.right = left + "px";
    elem.style.left = "";
  } else {
    elem.style.left = left + "px";
    elem.style.right = "";
  }
};
goog.provide("goog.positioning");
goog.provide("goog.positioning.Corner");
goog.provide("goog.positioning.CornerBit");
goog.provide("goog.positioning.Overflow");
goog.provide("goog.positioning.OverflowStatus");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Rect");
goog.require("goog.math.Size");
goog.require("goog.style");
goog.require("goog.style.bidi");
goog.positioning.Corner = {TOP_LEFT:0, TOP_RIGHT:2, BOTTOM_LEFT:1, BOTTOM_RIGHT:3, TOP_START:4, TOP_END:6, BOTTOM_START:5, BOTTOM_END:7};
goog.positioning.CornerBit = {BOTTOM:1, RIGHT:2, FLIP_RTL:4};
goog.positioning.Overflow = {IGNORE:0, ADJUST_X:1, FAIL_X:2, ADJUST_Y:4, FAIL_Y:8, RESIZE_WIDTH:16, RESIZE_HEIGHT:32, ADJUST_X_EXCEPT_OFFSCREEN:64 | 1, ADJUST_Y_EXCEPT_OFFSCREEN:128 | 4};
goog.positioning.OverflowStatus = {NONE:0, ADJUSTED_X:1, ADJUSTED_Y:2, WIDTH_ADJUSTED:4, HEIGHT_ADJUSTED:8, FAILED_LEFT:16, FAILED_RIGHT:32, FAILED_TOP:64, FAILED_BOTTOM:128, FAILED_OUTSIDE_VIEWPORT:256};
goog.positioning.OverflowStatus.FAILED = goog.positioning.OverflowStatus.FAILED_LEFT | goog.positioning.OverflowStatus.FAILED_RIGHT | goog.positioning.OverflowStatus.FAILED_TOP | goog.positioning.OverflowStatus.FAILED_BOTTOM | goog.positioning.OverflowStatus.FAILED_OUTSIDE_VIEWPORT;
goog.positioning.OverflowStatus.FAILED_HORIZONTAL = goog.positioning.OverflowStatus.FAILED_LEFT | goog.positioning.OverflowStatus.FAILED_RIGHT;
goog.positioning.OverflowStatus.FAILED_VERTICAL = goog.positioning.OverflowStatus.FAILED_TOP | goog.positioning.OverflowStatus.FAILED_BOTTOM;
goog.positioning.positionAtAnchor = function(anchorElement, anchorElementCorner, movableElement, movableElementCorner, opt_offset, opt_margin, opt_overflow, opt_preferredSize, opt_viewport) {
  goog.asserts.assert(movableElement);
  var movableParentTopLeft = goog.positioning.getOffsetParentPageOffset(movableElement);
  var anchorRect = goog.positioning.getVisiblePart_(anchorElement);
  goog.style.translateRectForAnotherFrame(anchorRect, goog.dom.getDomHelper(anchorElement), goog.dom.getDomHelper(movableElement));
  var corner = goog.positioning.getEffectiveCorner(anchorElement, anchorElementCorner);
  var absolutePos = new goog.math.Coordinate(corner & goog.positioning.CornerBit.RIGHT ? anchorRect.left + anchorRect.width : anchorRect.left, corner & goog.positioning.CornerBit.BOTTOM ? anchorRect.top + anchorRect.height : anchorRect.top);
  absolutePos = goog.math.Coordinate.difference(absolutePos, movableParentTopLeft);
  if (opt_offset) {
    absolutePos.x += (corner & goog.positioning.CornerBit.RIGHT ? -1 : 1) * opt_offset.x;
    absolutePos.y += (corner & goog.positioning.CornerBit.BOTTOM ? -1 : 1) * opt_offset.y;
  }
  var viewport;
  if (opt_overflow) {
    if (opt_viewport) {
      viewport = opt_viewport;
    } else {
      viewport = goog.style.getVisibleRectForElement(movableElement);
      if (viewport) {
        viewport.top -= movableParentTopLeft.y;
        viewport.right -= movableParentTopLeft.x;
        viewport.bottom -= movableParentTopLeft.y;
        viewport.left -= movableParentTopLeft.x;
      }
    }
  }
  return goog.positioning.positionAtCoordinate(absolutePos, movableElement, movableElementCorner, opt_margin, viewport, opt_overflow, opt_preferredSize);
};
goog.positioning.getOffsetParentPageOffset = function(movableElement) {
  var movableParentTopLeft;
  var parent = movableElement.offsetParent;
  if (parent) {
    var isBody = parent.tagName == goog.dom.TagName.HTML || parent.tagName == goog.dom.TagName.BODY;
    if (!isBody || goog.style.getComputedPosition(parent) != "static") {
      movableParentTopLeft = goog.style.getPageOffset(parent);
      if (!isBody) {
        movableParentTopLeft = goog.math.Coordinate.difference(movableParentTopLeft, new goog.math.Coordinate(goog.style.bidi.getScrollLeft(parent), parent.scrollTop));
      }
    }
  }
  return movableParentTopLeft || new goog.math.Coordinate;
};
goog.positioning.getVisiblePart_ = function(el) {
  var rect = goog.style.getBounds(el);
  var visibleBox = goog.style.getVisibleRectForElement(el);
  if (visibleBox) {
    rect.intersection(goog.math.Rect.createFromBox(visibleBox));
  }
  return rect;
};
goog.positioning.positionAtCoordinate = function(absolutePos, movableElement, movableElementCorner, opt_margin, opt_viewport, opt_overflow, opt_preferredSize) {
  absolutePos = absolutePos.clone();
  var corner = goog.positioning.getEffectiveCorner(movableElement, movableElementCorner);
  var elementSize = goog.style.getSize(movableElement);
  var size = opt_preferredSize ? opt_preferredSize.clone() : elementSize.clone();
  var positionResult = goog.positioning.getPositionAtCoordinate(absolutePos, size, corner, opt_margin, opt_viewport, opt_overflow);
  if (positionResult.status & goog.positioning.OverflowStatus.FAILED) {
    return positionResult.status;
  }
  goog.style.setPosition(movableElement, positionResult.rect.getTopLeft());
  size = positionResult.rect.getSize();
  if (!goog.math.Size.equals(elementSize, size)) {
    goog.style.setBorderBoxSize(movableElement, size);
  }
  return positionResult.status;
};
goog.positioning.getPositionAtCoordinate = function(absolutePos, elementSize, elementCorner, opt_margin, opt_viewport, opt_overflow) {
  absolutePos = absolutePos.clone();
  elementSize = elementSize.clone();
  var status = goog.positioning.OverflowStatus.NONE;
  if (opt_margin || elementCorner != goog.positioning.Corner.TOP_LEFT) {
    if (elementCorner & goog.positioning.CornerBit.RIGHT) {
      absolutePos.x -= elementSize.width + (opt_margin ? opt_margin.right : 0);
    } else {
      if (opt_margin) {
        absolutePos.x += opt_margin.left;
      }
    }
    if (elementCorner & goog.positioning.CornerBit.BOTTOM) {
      absolutePos.y -= elementSize.height + (opt_margin ? opt_margin.bottom : 0);
    } else {
      if (opt_margin) {
        absolutePos.y += opt_margin.top;
      }
    }
  }
  if (opt_overflow) {
    status = opt_viewport ? goog.positioning.adjustForViewport_(absolutePos, elementSize, opt_viewport, opt_overflow) : goog.positioning.OverflowStatus.FAILED_OUTSIDE_VIEWPORT;
  }
  var rect = new goog.math.Rect(0, 0, 0, 0);
  rect.left = absolutePos.x;
  rect.top = absolutePos.y;
  rect.width = elementSize.width;
  rect.height = elementSize.height;
  return {rect:rect, status:status};
};
goog.positioning.adjustForViewport_ = function(pos, size, viewport, overflow) {
  var status = goog.positioning.OverflowStatus.NONE;
  var ADJUST_X_EXCEPT_OFFSCREEN = goog.positioning.Overflow.ADJUST_X_EXCEPT_OFFSCREEN;
  var ADJUST_Y_EXCEPT_OFFSCREEN = goog.positioning.Overflow.ADJUST_Y_EXCEPT_OFFSCREEN;
  if ((overflow & ADJUST_X_EXCEPT_OFFSCREEN) == ADJUST_X_EXCEPT_OFFSCREEN && (pos.x < viewport.left || pos.x >= viewport.right)) {
    overflow &= ~goog.positioning.Overflow.ADJUST_X;
  }
  if ((overflow & ADJUST_Y_EXCEPT_OFFSCREEN) == ADJUST_Y_EXCEPT_OFFSCREEN && (pos.y < viewport.top || pos.y >= viewport.bottom)) {
    overflow &= ~goog.positioning.Overflow.ADJUST_Y;
  }
  if (pos.x < viewport.left && overflow & goog.positioning.Overflow.ADJUST_X) {
    pos.x = viewport.left;
    status |= goog.positioning.OverflowStatus.ADJUSTED_X;
  }
  if (overflow & goog.positioning.Overflow.RESIZE_WIDTH) {
    var originalX = pos.x;
    if (pos.x < viewport.left) {
      pos.x = viewport.left;
      status |= goog.positioning.OverflowStatus.WIDTH_ADJUSTED;
    }
    if (pos.x + size.width > viewport.right) {
      size.width = Math.min(viewport.right - pos.x, originalX + size.width - viewport.left);
      size.width = Math.max(size.width, 0);
      status |= goog.positioning.OverflowStatus.WIDTH_ADJUSTED;
    }
  }
  if (pos.x + size.width > viewport.right && overflow & goog.positioning.Overflow.ADJUST_X) {
    pos.x = Math.max(viewport.right - size.width, viewport.left);
    status |= goog.positioning.OverflowStatus.ADJUSTED_X;
  }
  if (overflow & goog.positioning.Overflow.FAIL_X) {
    status |= (pos.x < viewport.left ? goog.positioning.OverflowStatus.FAILED_LEFT : 0) | (pos.x + size.width > viewport.right ? goog.positioning.OverflowStatus.FAILED_RIGHT : 0);
  }
  if (pos.y < viewport.top && overflow & goog.positioning.Overflow.ADJUST_Y) {
    pos.y = viewport.top;
    status |= goog.positioning.OverflowStatus.ADJUSTED_Y;
  }
  if (overflow & goog.positioning.Overflow.RESIZE_HEIGHT) {
    var originalY = pos.y;
    if (pos.y < viewport.top) {
      pos.y = viewport.top;
      status |= goog.positioning.OverflowStatus.HEIGHT_ADJUSTED;
    }
    if (pos.y + size.height > viewport.bottom) {
      size.height = Math.min(viewport.bottom - pos.y, originalY + size.height - viewport.top);
      size.height = Math.max(size.height, 0);
      status |= goog.positioning.OverflowStatus.HEIGHT_ADJUSTED;
    }
  }
  if (pos.y + size.height > viewport.bottom && overflow & goog.positioning.Overflow.ADJUST_Y) {
    pos.y = Math.max(viewport.bottom - size.height, viewport.top);
    status |= goog.positioning.OverflowStatus.ADJUSTED_Y;
  }
  if (overflow & goog.positioning.Overflow.FAIL_Y) {
    status |= (pos.y < viewport.top ? goog.positioning.OverflowStatus.FAILED_TOP : 0) | (pos.y + size.height > viewport.bottom ? goog.positioning.OverflowStatus.FAILED_BOTTOM : 0);
  }
  return status;
};
goog.positioning.getEffectiveCorner = function(element, corner) {
  return ((corner & goog.positioning.CornerBit.FLIP_RTL && goog.style.isRightToLeft(element) ? corner ^ goog.positioning.CornerBit.RIGHT : corner) & ~goog.positioning.CornerBit.FLIP_RTL);
};
goog.positioning.flipCornerHorizontal = function(corner) {
  return (corner ^ goog.positioning.CornerBit.RIGHT);
};
goog.positioning.flipCornerVertical = function(corner) {
  return (corner ^ goog.positioning.CornerBit.BOTTOM);
};
goog.positioning.flipCorner = function(corner) {
  return (corner ^ goog.positioning.CornerBit.BOTTOM ^ goog.positioning.CornerBit.RIGHT);
};
goog.provide("goog.positioning.AnchoredPosition");
goog.require("goog.positioning");
goog.require("goog.positioning.AbstractPosition");
goog.positioning.AnchoredPosition = function(anchorElement, corner, opt_overflow) {
  this.element = anchorElement;
  this.corner = corner;
  this.overflow_ = opt_overflow;
};
goog.inherits(goog.positioning.AnchoredPosition, goog.positioning.AbstractPosition);
goog.positioning.AnchoredPosition.prototype.reposition = function(movableElement, movableCorner, opt_margin, opt_preferredSize) {
  goog.positioning.positionAtAnchor(this.element, this.corner, movableElement, movableCorner, undefined, opt_margin, this.overflow_);
};
goog.provide("goog.positioning.ViewportPosition");
goog.require("goog.math.Coordinate");
goog.require("goog.positioning");
goog.require("goog.positioning.AbstractPosition");
goog.require("goog.positioning.Corner");
goog.require("goog.style");
goog.positioning.ViewportPosition = function(arg1, opt_arg2) {
  this.coordinate = arg1 instanceof goog.math.Coordinate ? arg1 : new goog.math.Coordinate((arg1), opt_arg2);
};
goog.inherits(goog.positioning.ViewportPosition, goog.positioning.AbstractPosition);
goog.positioning.ViewportPosition.prototype.reposition = function(element, popupCorner, opt_margin, opt_preferredSize) {
  goog.positioning.positionAtAnchor(goog.style.getClientViewportElement(element), goog.positioning.Corner.TOP_LEFT, element, popupCorner, this.coordinate, opt_margin, null, opt_preferredSize);
};
goog.provide("goog.structs.InversionMap");
goog.require("goog.array");
goog.structs.InversionMap = function(rangeArray, valueArray, opt_delta) {
  this.rangeArray = null;
  if (rangeArray.length != valueArray.length) {
    return null;
  }
  this.storeInversion_(rangeArray, opt_delta);
  this.values = valueArray;
};
goog.structs.InversionMap.prototype.storeInversion_ = function(rangeArray, opt_delta) {
  this.rangeArray = rangeArray;
  for (var i = 1;i < rangeArray.length;i++) {
    if (rangeArray[i] == null) {
      rangeArray[i] = rangeArray[i - 1] + 1;
    } else {
      if (opt_delta) {
        rangeArray[i] += rangeArray[i - 1];
      }
    }
  }
};
goog.structs.InversionMap.prototype.spliceInversion = function(rangeArray, valueArray, opt_delta) {
  var otherMap = new goog.structs.InversionMap(rangeArray, valueArray, opt_delta);
  var startRange = otherMap.rangeArray[0];
  var endRange = (goog.array.peek(otherMap.rangeArray));
  var startSplice = this.getLeast(startRange);
  var endSplice = this.getLeast(endRange);
  if (startRange != this.rangeArray[startSplice]) {
    startSplice++;
  }
  var spliceLength = endSplice - startSplice + 1;
  goog.partial(goog.array.splice, this.rangeArray, startSplice, spliceLength).apply(null, otherMap.rangeArray);
  goog.partial(goog.array.splice, this.values, startSplice, spliceLength).apply(null, otherMap.values);
};
goog.structs.InversionMap.prototype.at = function(intKey) {
  var index = this.getLeast(intKey);
  if (index < 0) {
    return null;
  }
  return this.values[index];
};
goog.structs.InversionMap.prototype.getLeast = function(intKey) {
  var arr = this.rangeArray;
  var low = 0;
  var high = arr.length;
  while (high - low > 8) {
    var mid = high + low >> 1;
    if (arr[mid] <= intKey) {
      low = mid;
    } else {
      high = mid;
    }
  }
  for (;low < high;++low) {
    if (intKey < arr[low]) {
      break;
    }
  }
  return low - 1;
};
goog.provide("goog.i18n.GraphemeBreak");
goog.require("goog.structs.InversionMap");
goog.i18n.GraphemeBreak.property = {ANY:0, CONTROL:1, EXTEND:2, PREPEND:3, SPACING_MARK:4, INDIC_CONSONANT:5, VIRAMA:6, L:7, V:8, T:9, LV:10, LVT:11, CR:12, LF:13, REGIONAL_INDICATOR:14};
goog.i18n.GraphemeBreak.inversions_ = null;
goog.i18n.GraphemeBreak.applyLegacyBreakRules_ = function(prop_a, prop_b) {
  var prop = goog.i18n.GraphemeBreak.property;
  if (prop_a == prop.CR && prop_b == prop.LF) {
    return false;
  }
  if (prop_a == prop.CONTROL || prop_a == prop.CR || prop_a == prop.LF) {
    return true;
  }
  if (prop_b == prop.CONTROL || prop_b == prop.CR || prop_b == prop.LF) {
    return true;
  }
  if (prop_a == prop.L && (prop_b == prop.L || prop_b == prop.V || prop_b == prop.LV || prop_b == prop.LVT)) {
    return false;
  }
  if ((prop_a == prop.LV || prop_a == prop.V) && (prop_b == prop.V || prop_b == prop.T)) {
    return false;
  }
  if ((prop_a == prop.LVT || prop_a == prop.T) && prop_b == prop.T) {
    return false;
  }
  if (prop_b == prop.EXTEND || prop_b == prop.VIRAMA) {
    return false;
  }
  if (prop_a == prop.VIRAMA && prop_b == prop.INDIC_CONSONANT) {
    return false;
  }
  return true;
};
goog.i18n.GraphemeBreak.getBreakProp_ = function(acode) {
  if (44032 <= acode && acode <= 55203) {
    var prop = goog.i18n.GraphemeBreak.property;
    if (acode % 28 == 16) {
      return prop.LV;
    }
    return prop.LVT;
  } else {
    if (!goog.i18n.GraphemeBreak.inversions_) {
      goog.i18n.GraphemeBreak.inversions_ = new goog.structs.InversionMap([0, 10, 1, 2, 1, 18, 95, 33, 13, 1, 594, 112, 275, 7, 263, 45, 1, 1, 1, 2, 1, 2, 1, 1, 56, 5, 11, 11, 48, 21, 16, 1, 101, 7, 1, 1, 6, 2, 2, 1, 4, 33, 1, 1, 1, 30, 27, 91, 11, 58, 9, 34, 4, 1, 9, 1, 3, 1, 5, 43, 3, 136, 31, 1, 17, 37, 1, 1, 1, 1, 3, 8, 4, 1, 2, 1, 7, 8, 2, 2, 21, 8, 1, 2, 17, 39, 1, 1, 1, 2, 6, 6, 1, 9, 5, 4, 2, 2, 12, 2, 15, 2, 1, 17, 39, 2, 3, 12, 4, 8, 6, 17, 2, 3, 14, 1, 17, 39, 1, 1, 3, 8, 4, 1, 20, 2, 
      29, 1, 2, 17, 39, 1, 1, 2, 1, 6, 6, 9, 6, 4, 2, 2, 13, 1, 16, 1, 18, 41, 1, 1, 1, 12, 1, 9, 1, 41, 3, 17, 37, 4, 3, 5, 7, 8, 3, 2, 8, 2, 30, 2, 17, 39, 1, 1, 1, 1, 2, 1, 3, 1, 5, 1, 8, 9, 1, 3, 2, 30, 2, 17, 38, 3, 1, 2, 5, 7, 1, 9, 1, 10, 2, 30, 2, 22, 48, 5, 1, 2, 6, 7, 19, 2, 13, 46, 2, 1, 1, 1, 6, 1, 12, 8, 50, 46, 2, 1, 1, 1, 9, 11, 6, 14, 2, 58, 2, 27, 1, 1, 1, 1, 1, 4, 2, 49, 14, 1, 4, 1, 1, 2, 5, 48, 9, 1, 57, 33, 12, 4, 1, 6, 1, 2, 2, 2, 1, 16, 2, 4, 2, 2, 4, 3, 1, 3, 2, 7, 3, 4, 13, 
      1, 1, 1, 2, 6, 1, 1, 14, 1, 98, 96, 72, 88, 349, 3, 931, 15, 2, 1, 14, 15, 2, 1, 14, 15, 2, 15, 15, 14, 35, 17, 2, 1, 7, 8, 1, 2, 9, 1, 1, 9, 1, 45, 3, 155, 1, 87, 31, 3, 4, 2, 9, 1, 6, 3, 20, 19, 29, 44, 9, 3, 2, 1, 69, 23, 2, 3, 4, 45, 6, 2, 1, 1, 1, 8, 1, 1, 1, 2, 8, 6, 13, 128, 4, 1, 14, 33, 1, 1, 5, 1, 1, 5, 1, 1, 1, 7, 31, 9, 12, 2, 1, 7, 23, 1, 4, 2, 2, 2, 2, 2, 11, 3, 2, 36, 2, 1, 1, 2, 3, 1, 1, 3, 2, 12, 36, 8, 8, 2, 2, 21, 3, 128, 3, 1, 13, 1, 7, 4, 1, 4, 2, 1, 203, 64, 523, 1, 2, 
      2, 24, 7, 49, 16, 96, 33, 3070, 3, 141, 1, 96, 32, 554, 6, 105, 2, 30164, 4, 1, 10, 33, 1, 80, 2, 272, 1, 3, 1, 4, 1, 23, 2, 2, 1, 24, 30, 4, 4, 3, 8, 1, 1, 13, 2, 16, 34, 16, 1, 27, 18, 24, 24, 4, 8, 2, 23, 11, 1, 1, 12, 32, 3, 1, 5, 3, 3, 36, 1, 2, 4, 2, 1, 3, 1, 69, 35, 6, 2, 2, 2, 2, 12, 1, 8, 1, 1, 18, 16, 1, 3, 6, 1, 5, 48, 1, 1, 3, 2, 2, 5, 2, 1, 1, 32, 9, 1, 2, 2, 5, 1, 1, 201, 14, 2, 1, 1, 9, 8, 2, 1, 2, 1, 2, 1, 1, 1, 18, 11184, 27, 49, 1028, 1024, 6942, 1, 737, 16, 16, 7, 216, 1, 
      158, 2, 89, 3, 513, 1, 2051, 15, 40, 7, 1, 1472, 1, 1, 1, 53, 14, 1, 57, 2, 1, 45, 3, 4, 2, 1, 1, 2, 1, 66, 3, 36, 5, 1, 6, 2, 75, 2, 1, 48, 3, 9, 1, 1, 1258, 1, 1, 1, 2, 6, 1, 1, 22681, 62, 4, 25042, 1, 1, 3, 3, 1, 5, 8, 8, 2, 7, 30, 4, 148, 3, 8097, 26, 790017, 255], [1, 13, 1, 12, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 1, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 4, 0, 5, 2, 4, 2, 0, 4, 2, 4, 6, 4, 
      0, 2, 5, 0, 2, 0, 5, 2, 4, 0, 5, 2, 0, 2, 4, 2, 4, 6, 0, 2, 5, 0, 2, 0, 5, 0, 2, 4, 0, 5, 2, 4, 2, 6, 2, 5, 0, 2, 0, 2, 4, 0, 5, 2, 0, 4, 2, 4, 6, 0, 2, 0, 2, 4, 0, 5, 2, 0, 2, 4, 2, 4, 6, 2, 5, 0, 2, 0, 5, 0, 2, 0, 5, 2, 4, 2, 4, 6, 0, 2, 0, 4, 0, 5, 0, 2, 4, 2, 6, 2, 5, 0, 2, 0, 4, 0, 5, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 6, 2, 5, 0, 2, 0, 4, 0, 5, 0, 2, 4, 2, 4, 6, 0, 2, 0, 2, 0, 4, 0, 5, 6, 2, 4, 2, 4, 2, 4, 0, 5, 0, 2, 0, 4, 2, 6, 0, 2, 0, 5, 0, 2, 0, 4, 2, 0, 2, 0, 5, 0, 2, 0, 2, 0, 2, 0, 
      2, 0, 4, 5, 2, 4, 2, 6, 0, 2, 0, 2, 0, 2, 0, 5, 0, 2, 4, 2, 0, 6, 4, 2, 5, 0, 5, 0, 4, 2, 5, 2, 5, 0, 5, 0, 5, 2, 5, 2, 0, 4, 2, 0, 2, 5, 0, 2, 0, 7, 8, 9, 0, 2, 0, 5, 2, 6, 0, 5, 2, 6, 0, 5, 2, 0, 5, 2, 5, 0, 2, 4, 2, 4, 2, 4, 2, 6, 2, 0, 2, 0, 2, 0, 2, 0, 5, 2, 4, 2, 4, 2, 4, 2, 0, 5, 0, 5, 0, 4, 0, 4, 0, 5, 2, 4, 0, 5, 0, 5, 4, 2, 4, 2, 6, 0, 2, 0, 2, 4, 2, 0, 2, 4, 0, 5, 2, 4, 2, 4, 2, 4, 2, 4, 6, 5, 0, 2, 0, 2, 4, 0, 5, 4, 2, 4, 2, 6, 4, 5, 0, 5, 0, 5, 0, 2, 4, 2, 4, 2, 4, 2, 6, 0, 5, 
      4, 2, 4, 2, 0, 5, 0, 2, 0, 2, 4, 2, 0, 2, 0, 4, 2, 0, 2, 0, 1, 2, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 6, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 6, 5, 2, 5, 4, 2, 4, 0, 5, 0, 5, 0, 5, 0, 5, 0, 4, 0, 5, 4, 6, 0, 2, 0, 5, 0, 2, 0, 5, 2, 4, 6, 0, 7, 2, 4, 0, 5, 0, 5, 2, 4, 2, 4, 2, 4, 6, 0, 5, 2, 4, 2, 4, 2, 0, 2, 0, 2, 4, 0, 5, 0, 5, 0, 5, 0, 5, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 5, 4, 2, 4, 0, 4, 6, 0, 5, 0, 5, 0, 5, 0, 4, 2, 4, 2, 4, 0, 4, 6, 0, 11, 8, 9, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 
      0, 1, 0, 2, 0, 2, 0, 2, 6, 0, 4, 2, 4, 0, 2, 6, 0, 2, 4, 0, 4, 2, 4, 6, 2, 0, 1, 0, 2, 0, 2, 4, 2, 6, 0, 2, 4, 0, 4, 2, 4, 6, 0, 2, 4, 2, 4, 2, 6, 2, 0, 4, 2, 0, 2, 4, 2, 0, 4, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 14, 0, 1, 2], true);
    }
    return (goog.i18n.GraphemeBreak.inversions_.at(acode));
  }
};
goog.i18n.GraphemeBreak.hasGraphemeBreak = function(a, b, opt_extended) {
  var prop_a = goog.i18n.GraphemeBreak.getBreakProp_(a);
  var prop_b = goog.i18n.GraphemeBreak.getBreakProp_(b);
  var prop = goog.i18n.GraphemeBreak.property;
  return goog.i18n.GraphemeBreak.applyLegacyBreakRules_(prop_a, prop_b) && !(opt_extended && (prop_a == prop.PREPEND || prop_b == prop.SPACING_MARK));
};
goog.provide("goog.format");
goog.require("goog.i18n.GraphemeBreak");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.format.fileSize = function(bytes, opt_decimals) {
  return goog.format.numBytesToString(bytes, opt_decimals, false);
};
goog.format.isConvertableScaledNumber = function(val) {
  return goog.format.SCALED_NUMERIC_RE_.test(val);
};
goog.format.stringToNumericValue = function(stringValue) {
  if (goog.string.endsWith(stringValue, "B")) {
    return goog.format.stringToNumericValue_(stringValue, goog.format.NUMERIC_SCALES_BINARY_);
  }
  return goog.format.stringToNumericValue_(stringValue, goog.format.NUMERIC_SCALES_SI_);
};
goog.format.stringToNumBytes = function(stringValue) {
  return goog.format.stringToNumericValue_(stringValue, goog.format.NUMERIC_SCALES_BINARY_);
};
goog.format.numericValueToString = function(val, opt_decimals) {
  return goog.format.numericValueToString_(val, goog.format.NUMERIC_SCALES_SI_, opt_decimals);
};
goog.format.numBytesToString = function(val, opt_decimals, opt_suffix, opt_useSeparator) {
  var suffix = "";
  if (!goog.isDef(opt_suffix) || opt_suffix) {
    suffix = "B";
  }
  return goog.format.numericValueToString_(val, goog.format.NUMERIC_SCALES_BINARY_, opt_decimals, suffix, opt_useSeparator);
};
goog.format.stringToNumericValue_ = function(stringValue, conversion) {
  var match = stringValue.match(goog.format.SCALED_NUMERIC_RE_);
  if (!match) {
    return NaN;
  }
  var val = match[1] * conversion[match[2]];
  return val;
};
goog.format.numericValueToString_ = function(val, conversion, opt_decimals, opt_suffix, opt_useSeparator) {
  var prefixes = goog.format.NUMERIC_SCALE_PREFIXES_;
  var orig_val = val;
  var symbol = "";
  var separator = "";
  var scale = 1;
  if (val < 0) {
    val = -val;
  }
  for (var i = 0;i < prefixes.length;i++) {
    var unit = prefixes[i];
    scale = conversion[unit];
    if (val >= scale || scale <= 1 && val > .1 * scale) {
      symbol = unit;
      break;
    }
  }
  if (!symbol) {
    scale = 1;
  } else {
    if (opt_suffix) {
      symbol += opt_suffix;
    }
    if (opt_useSeparator) {
      separator = " ";
    }
  }
  var ex = Math.pow(10, goog.isDef(opt_decimals) ? opt_decimals : 2);
  return Math.round(orig_val / scale * ex) / ex + separator + symbol;
};
goog.format.SCALED_NUMERIC_RE_ = /^([-]?\d+\.?\d*)([K,M,G,T,P,k,m,u,n]?)[B]?$/;
goog.format.NUMERIC_SCALE_PREFIXES_ = ["P", "T", "G", "M", "K", "", "m", "u", "n"];
goog.format.NUMERIC_SCALES_SI_ = {"":1, "n":1E-9, "u":1E-6, "m":.001, "k":1E3, "K":1E3, "M":1E6, "G":1E9, "T":1E12, "P":1E15};
goog.format.NUMERIC_SCALES_BINARY_ = {"":1, "n":Math.pow(1024, -3), "u":Math.pow(1024, -2), "m":1 / 1024, "k":1024, "K":1024, "M":Math.pow(1024, 2), "G":Math.pow(1024, 3), "T":Math.pow(1024, 4), "P":Math.pow(1024, 5)};
goog.format.FIRST_GRAPHEME_EXTEND_ = 768;
goog.format.isTreatedAsBreakingSpace_ = function(charCode) {
  return charCode <= goog.format.WbrToken_.SPACE || charCode >= 4096 && (charCode >= 8192 && charCode <= 8198 || charCode >= 8200 && charCode <= 8203 || charCode == 5760 || charCode == 6158 || charCode == 8232 || charCode == 8233 || charCode == 8287 || charCode == 12288);
};
goog.format.isInvisibleFormattingCharacter_ = function(charCode) {
  return charCode >= 8204 && charCode <= 8207 || charCode >= 8234 && charCode <= 8238;
};
goog.format.insertWordBreaksGeneric_ = function(str, hasGraphemeBreak, opt_maxlen) {
  var maxlen = opt_maxlen || 10;
  if (maxlen > str.length) {
    return str;
  }
  var rv = [];
  var n = 0;
  var nestingCharCode = 0;
  var lastDumpPosition = 0;
  var charCode = 0;
  for (var i = 0;i < str.length;i++) {
    var lastCharCode = charCode;
    charCode = str.charCodeAt(i);
    var isPotentiallyGraphemeExtending = charCode >= goog.format.FIRST_GRAPHEME_EXTEND_ && !hasGraphemeBreak(lastCharCode, charCode, true);
    if (n >= maxlen && !goog.format.isTreatedAsBreakingSpace_(charCode) && !isPotentiallyGraphemeExtending) {
      rv.push(str.substring(lastDumpPosition, i), goog.format.WORD_BREAK_HTML);
      lastDumpPosition = i;
      n = 0;
    }
    if (!nestingCharCode) {
      if (charCode == goog.format.WbrToken_.LT || charCode == goog.format.WbrToken_.AMP) {
        nestingCharCode = charCode;
      } else {
        if (goog.format.isTreatedAsBreakingSpace_(charCode)) {
          n = 0;
        } else {
          if (!goog.format.isInvisibleFormattingCharacter_(charCode)) {
            n++;
          }
        }
      }
    } else {
      if (charCode == goog.format.WbrToken_.GT && nestingCharCode == goog.format.WbrToken_.LT) {
        nestingCharCode = 0;
      } else {
        if (charCode == goog.format.WbrToken_.SEMI_COLON && nestingCharCode == goog.format.WbrToken_.AMP) {
          nestingCharCode = 0;
          n++;
        }
      }
    }
  }
  rv.push(str.substr(lastDumpPosition));
  return rv.join("");
};
goog.format.insertWordBreaks = function(str, opt_maxlen) {
  return goog.format.insertWordBreaksGeneric_(str, goog.i18n.GraphemeBreak.hasGraphemeBreak, opt_maxlen);
};
goog.format.conservativelyHasGraphemeBreak_ = function(lastCharCode, charCode, opt_extended) {
  return charCode >= 1024 && charCode < 1315;
};
goog.format.insertWordBreaksBasic = function(str, opt_maxlen) {
  return goog.format.insertWordBreaksGeneric_(str, goog.format.conservativelyHasGraphemeBreak_, opt_maxlen);
};
goog.format.IS_IE8_OR_ABOVE_ = goog.userAgent.IE && goog.userAgent.isVersionOrHigher(8);
goog.format.WORD_BREAK_HTML = goog.userAgent.WEBKIT ? "<wbr></wbr>" : goog.userAgent.OPERA ? "&shy;" : goog.format.IS_IE8_OR_ABOVE_ ? "&#8203;" : "<wbr>";
goog.format.WbrToken_ = {LT:60, GT:62, AMP:38, SEMI_COLON:59, SPACE:32};
goog.provide("goog.structs");
goog.require("goog.array");
goog.require("goog.object");
goog.structs.getCount = function(col) {
  if (col.getCount && typeof col.getCount == "function") {
    return col.getCount();
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return col.length;
  }
  return goog.object.getCount(col);
};
goog.structs.getValues = function(col) {
  if (col.getValues && typeof col.getValues == "function") {
    return col.getValues();
  }
  if (goog.isString(col)) {
    return col.split("");
  }
  if (goog.isArrayLike(col)) {
    var rv = [];
    var l = col.length;
    for (var i = 0;i < l;i++) {
      rv.push(col[i]);
    }
    return rv;
  }
  return goog.object.getValues(col);
};
goog.structs.getKeys = function(col) {
  if (col.getKeys && typeof col.getKeys == "function") {
    return col.getKeys();
  }
  if (col.getValues && typeof col.getValues == "function") {
    return undefined;
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    var rv = [];
    var l = col.length;
    for (var i = 0;i < l;i++) {
      rv.push(i);
    }
    return rv;
  }
  return goog.object.getKeys(col);
};
goog.structs.contains = function(col, val) {
  if (col.contains && typeof col.contains == "function") {
    return col.contains(val);
  }
  if (col.containsValue && typeof col.containsValue == "function") {
    return col.containsValue(val);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.contains((col), val);
  }
  return goog.object.containsValue(col, val);
};
goog.structs.isEmpty = function(col) {
  if (col.isEmpty && typeof col.isEmpty == "function") {
    return col.isEmpty();
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.isEmpty((col));
  }
  return goog.object.isEmpty(col);
};
goog.structs.clear = function(col) {
  if (col.clear && typeof col.clear == "function") {
    col.clear();
  } else {
    if (goog.isArrayLike(col)) {
      goog.array.clear((col));
    } else {
      goog.object.clear(col);
    }
  }
};
goog.structs.forEach = function(col, f, opt_obj) {
  if (col.forEach && typeof col.forEach == "function") {
    col.forEach(f, opt_obj);
  } else {
    if (goog.isArrayLike(col) || goog.isString(col)) {
      goog.array.forEach((col), f, opt_obj);
    } else {
      var keys = goog.structs.getKeys(col);
      var values = goog.structs.getValues(col);
      var l = values.length;
      for (var i = 0;i < l;i++) {
        f.call((opt_obj), values[i], keys && keys[i], col);
      }
    }
  }
};
goog.structs.filter = function(col, f, opt_obj) {
  if (typeof col.filter == "function") {
    return col.filter(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter((col), f, opt_obj);
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      if (f.call((opt_obj), values[i], keys[i], col)) {
        rv[keys[i]] = values[i];
      }
    }
  } else {
    rv = [];
    for (var i = 0;i < l;i++) {
      if (f.call(opt_obj, values[i], undefined, col)) {
        rv.push(values[i]);
      }
    }
  }
  return rv;
};
goog.structs.map = function(col, f, opt_obj) {
  if (typeof col.map == "function") {
    return col.map(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map((col), f, opt_obj);
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      rv[keys[i]] = f.call((opt_obj), values[i], keys[i], col);
    }
  } else {
    rv = [];
    for (var i = 0;i < l;i++) {
      rv[i] = f.call((opt_obj), values[i], undefined, col);
    }
  }
  return rv;
};
goog.structs.some = function(col, f, opt_obj) {
  if (typeof col.some == "function") {
    return col.some(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some((col), f, opt_obj);
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0;i < l;i++) {
    if (f.call((opt_obj), values[i], keys && keys[i], col)) {
      return true;
    }
  }
  return false;
};
goog.structs.every = function(col, f, opt_obj) {
  if (typeof col.every == "function") {
    return col.every(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every((col), f, opt_obj);
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0;i < l;i++) {
    if (!f.call((opt_obj), values[i], keys && keys[i], col)) {
      return false;
    }
  }
  return true;
};
goog.provide("goog.soy.data.SanitizedContent");
goog.provide("goog.soy.data.SanitizedContentKind");
goog.provide("goog.soy.data.UnsanitizedText");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.uncheckedconversions");
goog.require("goog.string.Const");
goog.soy.data.SanitizedContentKind = {HTML:goog.DEBUG ? {sanitizedContentKindHtml:true} : {}, JS:goog.DEBUG ? {sanitizedContentJsChars:true} : {}, URI:goog.DEBUG ? {sanitizedContentUri:true} : {}, TRUSTED_RESOURCE_URI:goog.DEBUG ? {sanitizedContentTrustedResourceUri:true} : {}, ATTRIBUTES:goog.DEBUG ? {sanitizedContentHtmlAttribute:true} : {}, CSS:goog.DEBUG ? {sanitizedContentCss:true} : {}, TEXT:goog.DEBUG ? {sanitizedContentKindText:true} : {}};
goog.soy.data.SanitizedContent = function() {
  throw Error("Do not instantiate directly");
};
goog.soy.data.SanitizedContent.prototype.contentKind;
goog.soy.data.SanitizedContent.prototype.contentDir = null;
goog.soy.data.SanitizedContent.prototype.content;
goog.soy.data.SanitizedContent.prototype.getContent = function() {
  return this.content;
};
goog.soy.data.SanitizedContent.prototype.toString = function() {
  return this.content;
};
goog.soy.data.SanitizedContent.prototype.toSafeHtml = function() {
  if (this.contentKind === goog.soy.data.SanitizedContentKind.TEXT) {
    return goog.html.SafeHtml.htmlEscape(this.toString());
  }
  if (this.contentKind !== goog.soy.data.SanitizedContentKind.HTML) {
    throw Error("Sanitized content was not of kind TEXT or HTML.");
  }
  return goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Soy SanitizedContent of kind HTML produces " + "SafeHtml-contract-compliant value."), this.toString(), this.contentDir);
};
goog.soy.data.UnsanitizedText = function() {
  goog.soy.data.UnsanitizedText.base(this, "constructor");
};
goog.inherits(goog.soy.data.UnsanitizedText, goog.soy.data.SanitizedContent);
goog.provide("goog.soy");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.TagName");
goog.require("goog.soy.data.SanitizedContent");
goog.require("goog.soy.data.SanitizedContentKind");
goog.require("goog.string");
goog.define("goog.soy.REQUIRE_STRICT_AUTOESCAPE", false);
goog.soy.renderHtml = function(element, templateResult) {
  element.innerHTML = goog.soy.ensureTemplateOutputHtml_(templateResult);
};
goog.soy.renderElement = function(element, template, opt_templateData, opt_injectedData) {
  goog.asserts.assert(template, "Soy template may not be null.");
  element.innerHTML = goog.soy.ensureTemplateOutputHtml_(template(opt_templateData || goog.soy.defaultTemplateData_, undefined, opt_injectedData));
};
goog.soy.renderAsFragment = function(template, opt_templateData, opt_injectedData, opt_domHelper) {
  goog.asserts.assert(template, "Soy template may not be null.");
  var dom = opt_domHelper || goog.dom.getDomHelper();
  var html = goog.soy.ensureTemplateOutputHtml_(template(opt_templateData || goog.soy.defaultTemplateData_, undefined, opt_injectedData));
  goog.soy.assertFirstTagValid_(html);
  return dom.htmlToDocumentFragment(html);
};
goog.soy.renderAsElement = function(template, opt_templateData, opt_injectedData, opt_domHelper) {
  goog.asserts.assert(template, "Soy template may not be null.");
  return goog.soy.convertToElement_(template(opt_templateData || goog.soy.defaultTemplateData_, undefined, opt_injectedData), opt_domHelper);
};
goog.soy.convertToElement = function(templateResult, opt_domHelper) {
  return goog.soy.convertToElement_(templateResult, opt_domHelper);
};
goog.soy.convertToElement_ = function(templateResult, opt_domHelper) {
  var dom = opt_domHelper || goog.dom.getDomHelper();
  var wrapper = dom.createElement(goog.dom.TagName.DIV);
  var html = goog.soy.ensureTemplateOutputHtml_(templateResult);
  goog.soy.assertFirstTagValid_(html);
  wrapper.innerHTML = html;
  if (wrapper.childNodes.length == 1) {
    var firstChild = wrapper.firstChild;
    if (firstChild.nodeType == goog.dom.NodeType.ELEMENT) {
      return (firstChild);
    }
  }
  return wrapper;
};
goog.soy.ensureTemplateOutputHtml_ = function(templateResult) {
  if (!goog.soy.REQUIRE_STRICT_AUTOESCAPE && !goog.isObject(templateResult)) {
    return String(templateResult);
  }
  if (templateResult instanceof goog.soy.data.SanitizedContent) {
    templateResult = (templateResult);
    var ContentKind = goog.soy.data.SanitizedContentKind;
    if (templateResult.contentKind === ContentKind.HTML) {
      return goog.asserts.assertString(templateResult.getContent());
    }
    if (templateResult.contentKind === ContentKind.TEXT) {
      return goog.string.htmlEscape(templateResult.getContent());
    }
  }
  goog.asserts.fail("Soy template output is unsafe for use as HTML: " + templateResult);
  return "zSoyz";
};
goog.soy.assertFirstTagValid_ = function(html) {
  if (goog.asserts.ENABLE_ASSERTS) {
    var matches = html.match(goog.soy.INVALID_TAG_TO_RENDER_);
    goog.asserts.assert(!matches, "This template starts with a %s, which " + "cannot be a child of a <div>, as required by soy internals. " + "Consider using goog.soy.renderElement instead.\nTemplate output: %s", matches && matches[0], html);
  }
};
goog.soy.INVALID_TAG_TO_RENDER_ = /^<(body|caption|col|colgroup|head|html|tr|td|th|tbody|thead|tfoot)>/i;
goog.soy.defaultTemplateData_ = {};
goog.provide("goog.net.DefaultXmlHttpFactory");
goog.provide("goog.net.XmlHttp");
goog.provide("goog.net.XmlHttp.OptionType");
goog.provide("goog.net.XmlHttp.ReadyState");
goog.provide("goog.net.XmlHttpDefines");
goog.require("goog.asserts");
goog.require("goog.net.WrapperXmlHttpFactory");
goog.require("goog.net.XmlHttpFactory");
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance();
};
goog.define("goog.net.XmlHttp.ASSUME_NATIVE_XHR", false);
goog.net.XmlHttpDefines = {};
goog.define("goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR", false);
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions();
};
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION:0, LOCAL_REQUEST_ERROR:1};
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.factory_;
goog.net.XmlHttp.setFactory = function(factory, optionsFactory) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(goog.asserts.assert(factory), goog.asserts.assert(optionsFactory)));
};
goog.net.XmlHttp.setGlobalFactory = function(factory) {
  goog.net.XmlHttp.factory_ = factory;
};
goog.net.DefaultXmlHttpFactory = function() {
  goog.net.XmlHttpFactory.call(this);
};
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var progId = this.getProgId_();
  if (progId) {
    return new ActiveXObject(progId);
  } else {
    return new XMLHttpRequest;
  }
};
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var progId = this.getProgId_();
  var options = {};
  if (progId) {
    options[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = true;
    options[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = true;
  }
  return options;
};
goog.net.DefaultXmlHttpFactory.prototype.ieProgId_;
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if (goog.net.XmlHttp.ASSUME_NATIVE_XHR || goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR) {
    return "";
  }
  if (!this.ieProgId_ && typeof XMLHttpRequest == "undefined" && typeof ActiveXObject != "undefined") {
    var ACTIVE_X_IDENTS = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
    for (var i = 0;i < ACTIVE_X_IDENTS.length;i++) {
      var candidate = ACTIVE_X_IDENTS[i];
      try {
        new ActiveXObject(candidate);
        this.ieProgId_ = candidate;
        return candidate;
      } catch (e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled," + " or MSXML might not be installed");
  }
  return (this.ieProgId_);
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory);
goog.provide("goog.async.FreeList");
goog.async.FreeList = goog.defineClass(null, {constructor:function(create, reset, limit) {
  this.limit_ = limit;
  this.create_ = create;
  this.reset_ = reset;
  this.occupants_ = 0;
  this.head_ = null;
}, get:function() {
  var item;
  if (this.occupants_ > 0) {
    this.occupants_--;
    item = this.head_;
    this.head_ = item.next;
    item.next = null;
  } else {
    item = this.create_();
  }
  return item;
}, put:function(item) {
  this.reset_(item);
  if (this.occupants_ < this.limit_) {
    this.occupants_++;
    item.next = this.head_;
    this.head_ = item;
  }
}, occupants:function() {
  return this.occupants_;
}});
goog.provide("goog.async.nextTick");
goog.provide("goog.async.throwException");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.dom.TagName");
goog.require("goog.functions");
goog.require("goog.labs.userAgent.browser");
goog.require("goog.labs.userAgent.engine");
goog.async.throwException = function(exception) {
  goog.global.setTimeout(function() {
    throw exception;
  }, 0);
};
goog.async.nextTick = function(callback, opt_context, opt_useSetImmediate) {
  var cb = callback;
  if (opt_context) {
    cb = goog.bind(callback, opt_context);
  }
  cb = goog.async.nextTick.wrapCallback_(cb);
  if (goog.isFunction(goog.global.setImmediate) && (opt_useSetImmediate || goog.async.nextTick.useSetImmediate_())) {
    goog.global.setImmediate(cb);
    return;
  }
  if (!goog.async.nextTick.setImmediate_) {
    goog.async.nextTick.setImmediate_ = goog.async.nextTick.getSetImmediateEmulator_();
  }
  goog.async.nextTick.setImmediate_(cb);
};
goog.async.nextTick.useSetImmediate_ = function() {
  if (!goog.global.Window || !goog.global.Window.prototype) {
    return true;
  }
  if (goog.labs.userAgent.browser.isEdge() || goog.global.Window.prototype.setImmediate != goog.global.setImmediate) {
    return true;
  }
  return false;
};
goog.async.nextTick.setImmediate_;
goog.async.nextTick.getSetImmediateEmulator_ = function() {
  var Channel = goog.global["MessageChannel"];
  if (typeof Channel === "undefined" && typeof window !== "undefined" && window.postMessage && window.addEventListener && !goog.labs.userAgent.engine.isPresto()) {
    Channel = function() {
      var iframe = document.createElement(goog.dom.TagName.IFRAME);
      iframe.style.display = "none";
      iframe.src = "";
      document.documentElement.appendChild(iframe);
      var win = iframe.contentWindow;
      var doc = win.document;
      doc.open();
      doc.write("");
      doc.close();
      var message = "callImmediate" + Math.random();
      var origin = win.location.protocol == "file:" ? "*" : win.location.protocol + "//" + win.location.host;
      var onmessage = goog.bind(function(e) {
        if (origin != "*" && e.origin != origin || e.data != message) {
          return;
        }
        this["port1"].onmessage();
      }, this);
      win.addEventListener("message", onmessage, false);
      this["port1"] = {};
      this["port2"] = {postMessage:function() {
        win.postMessage(message, origin);
      }};
    };
  }
  if (typeof Channel !== "undefined" && !goog.labs.userAgent.browser.isIE()) {
    var channel = new Channel;
    var head = {};
    var tail = head;
    channel["port1"].onmessage = function() {
      if (goog.isDef(head.next)) {
        head = head.next;
        var cb = head.cb;
        head.cb = null;
        cb();
      }
    };
    return function(cb) {
      tail.next = {cb:cb};
      tail = tail.next;
      channel["port2"].postMessage(0);
    };
  }
  if (typeof document !== "undefined" && "onreadystatechange" in document.createElement(goog.dom.TagName.SCRIPT)) {
    return function(cb) {
      var script = document.createElement(goog.dom.TagName.SCRIPT);
      script.onreadystatechange = function() {
        script.onreadystatechange = null;
        script.parentNode.removeChild(script);
        script = null;
        cb();
        cb = null;
      };
      document.documentElement.appendChild(script);
    };
  }
  return function(cb) {
    goog.global.setTimeout(cb, 0);
  };
};
goog.async.nextTick.wrapCallback_ = goog.functions.identity;
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.async.nextTick.wrapCallback_ = transformer;
});
goog.provide("goog.async.WorkItem");
goog.provide("goog.async.WorkQueue");
goog.require("goog.asserts");
goog.require("goog.async.FreeList");
goog.async.WorkQueue = function() {
  this.workHead_ = null;
  this.workTail_ = null;
};
goog.define("goog.async.WorkQueue.DEFAULT_MAX_UNUSED", 100);
goog.async.WorkQueue.freelist_ = new goog.async.FreeList(function() {
  return new goog.async.WorkItem;
}, function(item) {
  item.reset();
}, goog.async.WorkQueue.DEFAULT_MAX_UNUSED);
goog.async.WorkQueue.prototype.add = function(fn, scope) {
  var item = this.getUnusedItem_();
  item.set(fn, scope);
  if (this.workTail_) {
    this.workTail_.next = item;
    this.workTail_ = item;
  } else {
    goog.asserts.assert(!this.workHead_);
    this.workHead_ = item;
    this.workTail_ = item;
  }
};
goog.async.WorkQueue.prototype.remove = function() {
  var item = null;
  if (this.workHead_) {
    item = this.workHead_;
    this.workHead_ = this.workHead_.next;
    if (!this.workHead_) {
      this.workTail_ = null;
    }
    item.next = null;
  }
  return item;
};
goog.async.WorkQueue.prototype.returnUnused = function(item) {
  goog.async.WorkQueue.freelist_.put(item);
};
goog.async.WorkQueue.prototype.getUnusedItem_ = function() {
  return goog.async.WorkQueue.freelist_.get();
};
goog.async.WorkItem = function() {
  this.fn = null;
  this.scope = null;
  this.next = null;
};
goog.async.WorkItem.prototype.set = function(fn, scope) {
  this.fn = fn;
  this.scope = scope;
  this.next = null;
};
goog.async.WorkItem.prototype.reset = function() {
  this.fn = null;
  this.scope = null;
  this.next = null;
};
goog.provide("goog.async.run");
goog.require("goog.async.WorkQueue");
goog.require("goog.async.nextTick");
goog.require("goog.async.throwException");
goog.async.run = function(callback, opt_context) {
  if (!goog.async.run.schedule_) {
    goog.async.run.initializeRunner_();
  }
  if (!goog.async.run.workQueueScheduled_) {
    goog.async.run.schedule_();
    goog.async.run.workQueueScheduled_ = true;
  }
  goog.async.run.workQueue_.add(callback, opt_context);
};
goog.async.run.initializeRunner_ = function() {
  if (goog.global.Promise && goog.global.Promise.resolve) {
    var promise = goog.global.Promise.resolve(undefined);
    goog.async.run.schedule_ = function() {
      promise.then(goog.async.run.processWorkQueue);
    };
  } else {
    goog.async.run.schedule_ = function() {
      goog.async.nextTick(goog.async.run.processWorkQueue);
    };
  }
};
goog.async.run.forceNextTick = function(opt_realSetTimeout) {
  goog.async.run.schedule_ = function() {
    goog.async.nextTick(goog.async.run.processWorkQueue);
    if (opt_realSetTimeout) {
      opt_realSetTimeout(goog.async.run.processWorkQueue);
    }
  };
};
goog.async.run.schedule_;
goog.async.run.workQueueScheduled_ = false;
goog.async.run.workQueue_ = new goog.async.WorkQueue;
if (goog.DEBUG) {
  goog.async.run.resetQueue = function() {
    goog.async.run.workQueueScheduled_ = false;
    goog.async.run.workQueue_ = new goog.async.WorkQueue;
  };
}
goog.async.run.processWorkQueue = function() {
  var item = null;
  while (item = goog.async.run.workQueue_.remove()) {
    try {
      item.fn.call(item.scope);
    } catch (e) {
      goog.async.throwException(e);
    }
    goog.async.run.workQueue_.returnUnused(item);
  }
  goog.async.run.workQueueScheduled_ = false;
};
goog.provide("goog.Promise");
goog.require("goog.Thenable");
goog.require("goog.asserts");
goog.require("goog.async.FreeList");
goog.require("goog.async.run");
goog.require("goog.async.throwException");
goog.require("goog.debug.Error");
goog.require("goog.promise.Resolver");
goog.Promise = function(resolver, opt_context) {
  this.state_ = goog.Promise.State_.PENDING;
  this.result_ = undefined;
  this.parent_ = null;
  this.callbackEntries_ = null;
  this.callbackEntriesTail_ = null;
  this.executing_ = false;
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    this.unhandledRejectionId_ = 0;
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      this.hadUnhandledRejection_ = false;
    }
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.stack_ = [];
    this.addStackTrace_(new Error("created"));
    this.currentStep_ = 0;
  }
  if (resolver != goog.nullFunction) {
    try {
      var self = this;
      resolver.call(opt_context, function(value) {
        self.resolve_(goog.Promise.State_.FULFILLED, value);
      }, function(reason) {
        if (goog.DEBUG && !(reason instanceof goog.Promise.CancellationError)) {
          try {
            if (reason instanceof Error) {
              throw reason;
            } else {
              throw new Error("Promise rejected.");
            }
          } catch (e) {
          }
        }
        self.resolve_(goog.Promise.State_.REJECTED, reason);
      });
    } catch (e) {
      this.resolve_(goog.Promise.State_.REJECTED, e);
    }
  }
};
goog.define("goog.Promise.LONG_STACK_TRACES", false);
goog.define("goog.Promise.UNHANDLED_REJECTION_DELAY", 0);
goog.Promise.State_ = {PENDING:0, BLOCKED:1, FULFILLED:2, REJECTED:3};
goog.Promise.CallbackEntry_ = function() {
  this.child = null;
  this.onFulfilled = null;
  this.onRejected = null;
  this.context = null;
  this.next = null;
  this.always = false;
};
goog.Promise.CallbackEntry_.prototype.reset = function() {
  this.child = null;
  this.onFulfilled = null;
  this.onRejected = null;
  this.context = null;
  this.always = false;
};
goog.define("goog.Promise.DEFAULT_MAX_UNUSED", 100);
goog.Promise.freelist_ = new goog.async.FreeList(function() {
  return new goog.Promise.CallbackEntry_;
}, function(item) {
  item.reset();
}, goog.Promise.DEFAULT_MAX_UNUSED);
goog.Promise.getCallbackEntry_ = function(onFulfilled, onRejected, context) {
  var entry = goog.Promise.freelist_.get();
  entry.onFulfilled = onFulfilled;
  entry.onRejected = onRejected;
  entry.context = context;
  return entry;
};
goog.Promise.returnEntry_ = function(entry) {
  goog.Promise.freelist_.put(entry);
};
goog.Promise.resolve = function(opt_value) {
  if (opt_value instanceof goog.Promise) {
    return opt_value;
  }
  var promise = new goog.Promise(goog.nullFunction);
  promise.resolve_(goog.Promise.State_.FULFILLED, opt_value);
  return promise;
};
goog.Promise.reject = function(opt_reason) {
  return new goog.Promise(function(resolve, reject) {
    reject(opt_reason);
  });
};
goog.Promise.resolveThen_ = function(value, onFulfilled, onRejected) {
  var isThenable = goog.Promise.maybeThen_(value, onFulfilled, onRejected, null);
  if (!isThenable) {
    goog.async.run(goog.partial(onFulfilled, value));
  }
};
goog.Promise.race = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    if (!promises.length) {
      resolve(undefined);
    }
    for (var i = 0, promise;i < promises.length;i++) {
      promise = promises[i];
      goog.Promise.resolveThen_(promise, resolve, reject);
    }
  });
};
goog.Promise.all = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toFulfill = promises.length;
    var values = [];
    if (!toFulfill) {
      resolve(values);
      return;
    }
    var onFulfill = function(index, value) {
      toFulfill--;
      values[index] = value;
      if (toFulfill == 0) {
        resolve(values);
      }
    };
    var onReject = function(reason) {
      reject(reason);
    };
    for (var i = 0, promise;i < promises.length;i++) {
      promise = promises[i];
      goog.Promise.resolveThen_(promise, goog.partial(onFulfill, i), onReject);
    }
  });
};
goog.Promise.allSettled = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toSettle = promises.length;
    var results = [];
    if (!toSettle) {
      resolve(results);
      return;
    }
    var onSettled = function(index, fulfilled, result) {
      toSettle--;
      results[index] = fulfilled ? {fulfilled:true, value:result} : {fulfilled:false, reason:result};
      if (toSettle == 0) {
        resolve(results);
      }
    };
    for (var i = 0, promise;i < promises.length;i++) {
      promise = promises[i];
      goog.Promise.resolveThen_(promise, goog.partial(onSettled, i, true), goog.partial(onSettled, i, false));
    }
  });
};
goog.Promise.firstFulfilled = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toReject = promises.length;
    var reasons = [];
    if (!toReject) {
      resolve(undefined);
      return;
    }
    var onFulfill = function(value) {
      resolve(value);
    };
    var onReject = function(index, reason) {
      toReject--;
      reasons[index] = reason;
      if (toReject == 0) {
        reject(reasons);
      }
    };
    for (var i = 0, promise;i < promises.length;i++) {
      promise = promises[i];
      goog.Promise.resolveThen_(promise, onFulfill, goog.partial(onReject, i));
    }
  });
};
goog.Promise.withResolver = function() {
  var resolve, reject;
  var promise = new goog.Promise(function(rs, rj) {
    resolve = rs;
    reject = rj;
  });
  return new goog.Promise.Resolver_(promise, resolve, reject);
};
goog.Promise.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
  if (opt_onFulfilled != null) {
    goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  }
  if (opt_onRejected != null) {
    goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context " + "as the second argument instead of the third?");
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("then"));
  }
  return this.addChildPromise_(goog.isFunction(opt_onFulfilled) ? opt_onFulfilled : null, goog.isFunction(opt_onRejected) ? opt_onRejected : null, opt_context);
};
goog.Thenable.addImplementation(goog.Promise);
goog.Promise.prototype.thenVoid = function(opt_onFulfilled, opt_onRejected, opt_context) {
  if (opt_onFulfilled != null) {
    goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  }
  if (opt_onRejected != null) {
    goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context " + "as the second argument instead of the third?");
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("then"));
  }
  this.addCallbackEntry_(goog.Promise.getCallbackEntry_(opt_onFulfilled || goog.nullFunction, opt_onRejected || null, opt_context));
};
goog.Promise.prototype.thenAlways = function(onSettled, opt_context) {
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("thenAlways"));
  }
  var entry = goog.Promise.getCallbackEntry_(onSettled, onSettled, opt_context);
  entry.always = true;
  this.addCallbackEntry_(entry);
  return this;
};
goog.Promise.prototype.thenCatch = function(onRejected, opt_context) {
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("thenCatch"));
  }
  return this.addChildPromise_(null, onRejected, opt_context);
};
goog.Promise.prototype.cancel = function(opt_message) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    goog.async.run(function() {
      var err = new goog.Promise.CancellationError(opt_message);
      this.cancelInternal_(err);
    }, this);
  }
};
goog.Promise.prototype.cancelInternal_ = function(err) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    if (this.parent_) {
      this.parent_.cancelChild_(this, err);
      this.parent_ = null;
    } else {
      this.resolve_(goog.Promise.State_.REJECTED, err);
    }
  }
};
goog.Promise.prototype.cancelChild_ = function(childPromise, err) {
  if (!this.callbackEntries_) {
    return;
  }
  var childCount = 0;
  var childEntry = null;
  var beforeChildEntry = null;
  for (var entry = this.callbackEntries_;entry;entry = entry.next) {
    if (!entry.always) {
      childCount++;
      if (entry.child == childPromise) {
        childEntry = entry;
      }
      if (childEntry && childCount > 1) {
        break;
      }
    }
    if (!childEntry) {
      beforeChildEntry = entry;
    }
  }
  if (childEntry) {
    if (this.state_ == goog.Promise.State_.PENDING && childCount == 1) {
      this.cancelInternal_(err);
    } else {
      if (beforeChildEntry) {
        this.removeEntryAfter_(beforeChildEntry);
      } else {
        this.popEntry_();
      }
      this.executeCallback_(childEntry, goog.Promise.State_.REJECTED, err);
    }
  }
};
goog.Promise.prototype.addCallbackEntry_ = function(callbackEntry) {
  if (!this.hasEntry_() && (this.state_ == goog.Promise.State_.FULFILLED || this.state_ == goog.Promise.State_.REJECTED)) {
    this.scheduleCallbacks_();
  }
  this.queueEntry_(callbackEntry);
};
goog.Promise.prototype.addChildPromise_ = function(onFulfilled, onRejected, opt_context) {
  var callbackEntry = goog.Promise.getCallbackEntry_(null, null, null);
  callbackEntry.child = new goog.Promise(function(resolve, reject) {
    callbackEntry.onFulfilled = onFulfilled ? function(value) {
      try {
        var result = onFulfilled.call(opt_context, value);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    } : resolve;
    callbackEntry.onRejected = onRejected ? function(reason) {
      try {
        var result = onRejected.call(opt_context, reason);
        if (!goog.isDef(result) && reason instanceof goog.Promise.CancellationError) {
          reject(reason);
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    } : reject;
  });
  callbackEntry.child.parent_ = this;
  this.addCallbackEntry_(callbackEntry);
  return callbackEntry.child;
};
goog.Promise.prototype.unblockAndFulfill_ = function(value) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.FULFILLED, value);
};
goog.Promise.prototype.unblockAndReject_ = function(reason) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.REJECTED, reason);
};
goog.Promise.prototype.resolve_ = function(state, x) {
  if (this.state_ != goog.Promise.State_.PENDING) {
    return;
  }
  if (this == x) {
    state = goog.Promise.State_.REJECTED;
    x = new TypeError("Promise cannot resolve to itself");
  }
  this.state_ = goog.Promise.State_.BLOCKED;
  var isThenable = goog.Promise.maybeThen_(x, this.unblockAndFulfill_, this.unblockAndReject_, this);
  if (isThenable) {
    return;
  }
  this.result_ = x;
  this.state_ = state;
  this.parent_ = null;
  this.scheduleCallbacks_();
  if (state == goog.Promise.State_.REJECTED && !(x instanceof goog.Promise.CancellationError)) {
    goog.Promise.addUnhandledRejection_(this, x);
  }
};
goog.Promise.maybeThen_ = function(value, onFulfilled, onRejected, context) {
  if (value instanceof goog.Promise) {
    value.thenVoid(onFulfilled, onRejected, context);
    return true;
  } else {
    if (goog.Thenable.isImplementedBy(value)) {
      value = (value);
      value.then(onFulfilled, onRejected, context);
      return true;
    } else {
      if (goog.isObject(value)) {
        try {
          var then = value["then"];
          if (goog.isFunction(then)) {
            goog.Promise.tryThen_(value, then, onFulfilled, onRejected, context);
            return true;
          }
        } catch (e) {
          onRejected.call(context, e);
          return true;
        }
      }
    }
  }
  return false;
};
goog.Promise.tryThen_ = function(thenable, then, onFulfilled, onRejected, context) {
  var called = false;
  var resolve = function(value) {
    if (!called) {
      called = true;
      onFulfilled.call(context, value);
    }
  };
  var reject = function(reason) {
    if (!called) {
      called = true;
      onRejected.call(context, reason);
    }
  };
  try {
    then.call(thenable, resolve, reject);
  } catch (e) {
    reject(e);
  }
};
goog.Promise.prototype.scheduleCallbacks_ = function() {
  if (!this.executing_) {
    this.executing_ = true;
    goog.async.run(this.executeCallbacks_, this);
  }
};
goog.Promise.prototype.hasEntry_ = function() {
  return !!this.callbackEntries_;
};
goog.Promise.prototype.queueEntry_ = function(entry) {
  goog.asserts.assert(entry.onFulfilled != null);
  if (this.callbackEntriesTail_) {
    this.callbackEntriesTail_.next = entry;
    this.callbackEntriesTail_ = entry;
  } else {
    this.callbackEntries_ = entry;
    this.callbackEntriesTail_ = entry;
  }
};
goog.Promise.prototype.popEntry_ = function() {
  var entry = null;
  if (this.callbackEntries_) {
    entry = this.callbackEntries_;
    this.callbackEntries_ = entry.next;
    entry.next = null;
  }
  if (!this.callbackEntries_) {
    this.callbackEntriesTail_ = null;
  }
  if (entry != null) {
    goog.asserts.assert(entry.onFulfilled != null);
  }
  return entry;
};
goog.Promise.prototype.removeEntryAfter_ = function(previous) {
  goog.asserts.assert(this.callbackEntries_);
  goog.asserts.assert(previous != null);
  if (previous.next == this.callbackEntriesTail_) {
    this.callbackEntriesTail_ = previous;
  }
  previous.next = previous.next.next;
};
goog.Promise.prototype.executeCallbacks_ = function() {
  var entry = null;
  while (entry = this.popEntry_()) {
    if (goog.Promise.LONG_STACK_TRACES) {
      this.currentStep_++;
    }
    this.executeCallback_(entry, this.state_, this.result_);
  }
  this.executing_ = false;
};
goog.Promise.prototype.executeCallback_ = function(callbackEntry, state, result) {
  if (state == goog.Promise.State_.REJECTED && callbackEntry.onRejected && !callbackEntry.always) {
    this.removeUnhandledRejection_();
  }
  if (callbackEntry.child) {
    callbackEntry.child.parent_ = null;
    goog.Promise.invokeCallback_(callbackEntry, state, result);
  } else {
    try {
      callbackEntry.always ? callbackEntry.onFulfilled.call(callbackEntry.context) : goog.Promise.invokeCallback_(callbackEntry, state, result);
    } catch (err) {
      goog.Promise.handleRejection_.call(null, err);
    }
  }
  goog.Promise.returnEntry_(callbackEntry);
};
goog.Promise.invokeCallback_ = function(callbackEntry, state, result) {
  if (state == goog.Promise.State_.FULFILLED) {
    callbackEntry.onFulfilled.call(callbackEntry.context, result);
  } else {
    if (callbackEntry.onRejected) {
      callbackEntry.onRejected.call(callbackEntry.context, result);
    }
  }
};
goog.Promise.prototype.addStackTrace_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && goog.isString(err.stack)) {
    var trace = err.stack.split("\n", 4)[3];
    var message = err.message;
    message += Array(11 - message.length).join(" ");
    this.stack_.push(message + trace);
  }
};
goog.Promise.prototype.appendLongStack_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && err && goog.isString(err.stack) && this.stack_.length) {
    var longTrace = ["Promise trace:"];
    for (var promise = this;promise;promise = promise.parent_) {
      for (var i = this.currentStep_;i >= 0;i--) {
        longTrace.push(promise.stack_[i]);
      }
      longTrace.push("Value: " + "[" + (promise.state_ == goog.Promise.State_.REJECTED ? "REJECTED" : "FULFILLED") + "] " + "<" + String(promise.result_) + ">");
    }
    err.stack += "\n\n" + longTrace.join("\n");
  }
};
goog.Promise.prototype.removeUnhandledRejection_ = function() {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    for (var p = this;p && p.unhandledRejectionId_;p = p.parent_) {
      goog.global.clearTimeout(p.unhandledRejectionId_);
      p.unhandledRejectionId_ = 0;
    }
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      for (var p = this;p && p.hadUnhandledRejection_;p = p.parent_) {
        p.hadUnhandledRejection_ = false;
      }
    }
  }
};
goog.Promise.addUnhandledRejection_ = function(promise, reason) {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    promise.unhandledRejectionId_ = goog.global.setTimeout(function() {
      promise.appendLongStack_(reason);
      goog.Promise.handleRejection_.call(null, reason);
    }, goog.Promise.UNHANDLED_REJECTION_DELAY);
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      promise.hadUnhandledRejection_ = true;
      goog.async.run(function() {
        if (promise.hadUnhandledRejection_) {
          promise.appendLongStack_(reason);
          goog.Promise.handleRejection_.call(null, reason);
        }
      });
    }
  }
};
goog.Promise.handleRejection_ = goog.async.throwException;
goog.Promise.setUnhandledRejectionHandler = function(handler) {
  goog.Promise.handleRejection_ = handler;
};
goog.Promise.CancellationError = function(opt_message) {
  goog.Promise.CancellationError.base(this, "constructor", opt_message);
};
goog.inherits(goog.Promise.CancellationError, goog.debug.Error);
goog.Promise.CancellationError.prototype.name = "cancel";
goog.Promise.Resolver_ = function(promise, resolve, reject) {
  this.promise = promise;
  this.resolve = resolve;
  this.reject = reject;
};
goog.provide("goog.Timer");
goog.require("goog.Promise");
goog.require("goog.events.EventTarget");
goog.Timer = function(opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this);
  this.interval_ = opt_interval || 1;
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now();
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.INVALID_TIMEOUT_ID_ = -1;
goog.Timer.prototype.enabled = false;
goog.Timer.defaultTimerObject = goog.global;
goog.Timer.intervalScale = .8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
  return this.interval_;
};
goog.Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  if (this.timer_ && this.enabled) {
    this.stop();
    this.start();
  } else {
    if (this.timer_) {
      this.stop();
    }
  }
};
goog.Timer.prototype.tick_ = function() {
  if (this.enabled) {
    var elapsed = goog.now() - this.last_;
    if (elapsed > 0 && elapsed < this.interval_ * goog.Timer.intervalScale) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed);
      return;
    }
    if (this.timer_) {
      this.timerObject_.clearTimeout(this.timer_);
      this.timer_ = null;
    }
    this.dispatchTick();
    if (this.enabled) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
      this.last_ = goog.now();
    }
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK);
};
goog.Timer.prototype.start = function() {
  this.enabled = true;
  if (!this.timer_) {
    this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
    this.last_ = goog.now();
  }
};
goog.Timer.prototype.stop = function() {
  this.enabled = false;
  if (this.timer_) {
    this.timerObject_.clearTimeout(this.timer_);
    this.timer_ = null;
  }
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_;
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if (goog.isFunction(listener)) {
    if (opt_handler) {
      listener = goog.bind(listener, opt_handler);
    }
  } else {
    if (listener && typeof listener.handleEvent == "function") {
      listener = goog.bind(listener.handleEvent, listener);
    } else {
      throw Error("Invalid listener argument");
    }
  }
  if (opt_delay > goog.Timer.MAX_TIMEOUT_) {
    return goog.Timer.INVALID_TIMEOUT_ID_;
  } else {
    return goog.Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0);
  }
};
goog.Timer.clear = function(timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId);
};
goog.Timer.promise = function(delay, opt_result) {
  var timerKey = null;
  return (new goog.Promise(function(resolve, reject) {
    timerKey = goog.Timer.callOnce(function() {
      resolve(opt_result);
    }, delay);
    if (timerKey == goog.Timer.INVALID_TIMEOUT_ID_) {
      reject(new Error("Failed to schedule timer."));
    }
  })).thenCatch(function(error) {
    goog.Timer.clear(timerKey);
    throw error;
  });
};
goog.provide("goog.ui.PopupBase");
goog.provide("goog.ui.PopupBase.EventType");
goog.provide("goog.ui.PopupBase.Type");
goog.require("goog.Timer");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.events");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.fx.Transition");
goog.require("goog.style");
goog.require("goog.userAgent");
goog.ui.PopupBase = function(opt_element, opt_type) {
  goog.events.EventTarget.call(this);
  this.handler_ = new goog.events.EventHandler(this);
  this.setElement(opt_element || null);
  if (opt_type) {
    this.setType(opt_type);
  }
};
goog.inherits(goog.ui.PopupBase, goog.events.EventTarget);
goog.tagUnsealableClass(goog.ui.PopupBase);
goog.ui.PopupBase.Type = {TOGGLE_DISPLAY:"toggle_display", MOVE_OFFSCREEN:"move_offscreen"};
goog.ui.PopupBase.prototype.element_ = null;
goog.ui.PopupBase.prototype.autoHide_ = true;
goog.ui.PopupBase.prototype.autoHidePartners_ = null;
goog.ui.PopupBase.prototype.autoHideRegion_ = null;
goog.ui.PopupBase.prototype.isVisible_ = false;
goog.ui.PopupBase.prototype.shouldHideAsync_ = false;
goog.ui.PopupBase.prototype.lastShowTime_ = -1;
goog.ui.PopupBase.prototype.lastHideTime_ = -1;
goog.ui.PopupBase.prototype.hideOnEscape_ = false;
goog.ui.PopupBase.prototype.enableCrossIframeDismissal_ = true;
goog.ui.PopupBase.prototype.type_ = goog.ui.PopupBase.Type.TOGGLE_DISPLAY;
goog.ui.PopupBase.prototype.showTransition_;
goog.ui.PopupBase.prototype.hideTransition_;
goog.ui.PopupBase.EventType = {BEFORE_SHOW:"beforeshow", SHOW:"show", BEFORE_HIDE:"beforehide", HIDE:"hide"};
goog.ui.PopupBase.DEBOUNCE_DELAY_MS = 150;
goog.ui.PopupBase.prototype.getType = function() {
  return this.type_;
};
goog.ui.PopupBase.prototype.setType = function(type) {
  this.type_ = type;
};
goog.ui.PopupBase.prototype.shouldHideAsync = function() {
  return this.shouldHideAsync_;
};
goog.ui.PopupBase.prototype.setShouldHideAsync = function(b) {
  this.shouldHideAsync_ = b;
};
goog.ui.PopupBase.prototype.getElement = function() {
  return this.element_;
};
goog.ui.PopupBase.prototype.setElement = function(elt) {
  this.ensureNotVisible_();
  this.element_ = elt;
};
goog.ui.PopupBase.prototype.getAutoHide = function() {
  return this.autoHide_;
};
goog.ui.PopupBase.prototype.setAutoHide = function(autoHide) {
  this.ensureNotVisible_();
  this.autoHide_ = autoHide;
};
goog.ui.PopupBase.prototype.addAutoHidePartner = function(partner) {
  if (!this.autoHidePartners_) {
    this.autoHidePartners_ = [];
  }
  goog.array.insert(this.autoHidePartners_, partner);
};
goog.ui.PopupBase.prototype.removeAutoHidePartner = function(partner) {
  if (this.autoHidePartners_) {
    goog.array.remove(this.autoHidePartners_, partner);
  }
};
goog.ui.PopupBase.prototype.getHideOnEscape = function() {
  return this.hideOnEscape_;
};
goog.ui.PopupBase.prototype.setHideOnEscape = function(hideOnEscape) {
  this.ensureNotVisible_();
  this.hideOnEscape_ = hideOnEscape;
};
goog.ui.PopupBase.prototype.getEnableCrossIframeDismissal = function() {
  return this.enableCrossIframeDismissal_;
};
goog.ui.PopupBase.prototype.setEnableCrossIframeDismissal = function(enable) {
  this.enableCrossIframeDismissal_ = enable;
};
goog.ui.PopupBase.prototype.getAutoHideRegion = function() {
  return this.autoHideRegion_;
};
goog.ui.PopupBase.prototype.setAutoHideRegion = function(element) {
  this.autoHideRegion_ = element;
};
goog.ui.PopupBase.prototype.setTransition = function(opt_showTransition, opt_hideTransition) {
  this.showTransition_ = opt_showTransition;
  this.hideTransition_ = opt_hideTransition;
};
goog.ui.PopupBase.prototype.getLastShowTime = function() {
  return this.lastShowTime_;
};
goog.ui.PopupBase.prototype.getLastHideTime = function() {
  return this.lastHideTime_;
};
goog.ui.PopupBase.prototype.getHandler = function() {
  var self = (this);
  return self.handler_;
};
goog.ui.PopupBase.prototype.ensureNotVisible_ = function() {
  if (this.isVisible_) {
    throw Error("Can not change this state of the popup while showing.");
  }
};
goog.ui.PopupBase.prototype.isVisible = function() {
  return this.isVisible_;
};
goog.ui.PopupBase.prototype.isOrWasRecentlyVisible = function() {
  return this.isVisible_ || goog.now() - this.lastHideTime_ < goog.ui.PopupBase.DEBOUNCE_DELAY_MS;
};
goog.ui.PopupBase.prototype.setVisible = function(visible) {
  if (this.showTransition_) {
    this.showTransition_.stop();
  }
  if (this.hideTransition_) {
    this.hideTransition_.stop();
  }
  if (visible) {
    this.show_();
  } else {
    this.hide_();
  }
};
goog.ui.PopupBase.prototype.reposition = goog.nullFunction;
goog.ui.PopupBase.prototype.show_ = function() {
  if (this.isVisible_) {
    return;
  }
  if (!this.onBeforeShow()) {
    return;
  }
  if (!this.element_) {
    throw Error("Caller must call setElement before trying to show the popup");
  }
  this.reposition();
  var doc = goog.dom.getOwnerDocument(this.element_);
  if (this.hideOnEscape_) {
    this.handler_.listen(doc, goog.events.EventType.KEYDOWN, this.onDocumentKeyDown_, true);
  }
  if (this.autoHide_) {
    this.handler_.listen(doc, goog.events.EventType.MOUSEDOWN, this.onDocumentMouseDown_, true);
    if (goog.userAgent.IE) {
      var activeElement;
      try {
        activeElement = doc.activeElement;
      } catch (e) {
      }
      while (activeElement && activeElement.nodeName == goog.dom.TagName.IFRAME) {
        try {
          var tempDoc = goog.dom.getFrameContentDocument(activeElement);
        } catch (e) {
          break;
        }
        doc = tempDoc;
        activeElement = doc.activeElement;
      }
      this.handler_.listen(doc, goog.events.EventType.MOUSEDOWN, this.onDocumentMouseDown_, true);
      this.handler_.listen(doc, goog.events.EventType.DEACTIVATE, this.onDocumentBlur_);
    } else {
      this.handler_.listen(doc, goog.events.EventType.BLUR, this.onDocumentBlur_);
    }
  }
  if (this.type_ == goog.ui.PopupBase.Type.TOGGLE_DISPLAY) {
    this.showPopupElement();
  } else {
    if (this.type_ == goog.ui.PopupBase.Type.MOVE_OFFSCREEN) {
      this.reposition();
    }
  }
  this.isVisible_ = true;
  this.lastShowTime_ = goog.now();
  this.lastHideTime_ = -1;
  if (this.showTransition_) {
    goog.events.listenOnce((this.showTransition_), goog.fx.Transition.EventType.END, this.onShow_, false, this);
    this.showTransition_.play();
  } else {
    this.onShow_();
  }
};
goog.ui.PopupBase.prototype.hide_ = function(opt_target) {
  if (!this.isVisible_ || !this.onBeforeHide_(opt_target)) {
    return false;
  }
  if (this.handler_) {
    this.handler_.removeAll();
  }
  this.isVisible_ = false;
  this.lastHideTime_ = goog.now();
  if (this.hideTransition_) {
    goog.events.listenOnce((this.hideTransition_), goog.fx.Transition.EventType.END, goog.partial(this.continueHidingPopup_, opt_target), false, this);
    this.hideTransition_.play();
  } else {
    this.continueHidingPopup_(opt_target);
  }
  return true;
};
goog.ui.PopupBase.prototype.continueHidingPopup_ = function(opt_target) {
  if (this.type_ == goog.ui.PopupBase.Type.TOGGLE_DISPLAY) {
    if (this.shouldHideAsync_) {
      goog.Timer.callOnce(this.hidePopupElement, 0, this);
    } else {
      this.hidePopupElement();
    }
  } else {
    if (this.type_ == goog.ui.PopupBase.Type.MOVE_OFFSCREEN) {
      this.moveOffscreen_();
    }
  }
  this.onHide_(opt_target);
};
goog.ui.PopupBase.prototype.showPopupElement = function() {
  this.element_.style.visibility = "visible";
  goog.style.setElementShown(this.element_, true);
};
goog.ui.PopupBase.prototype.hidePopupElement = function() {
  this.element_.style.visibility = "hidden";
  goog.style.setElementShown(this.element_, false);
};
goog.ui.PopupBase.prototype.moveOffscreen_ = function() {
  this.element_.style.top = "-10000px";
};
goog.ui.PopupBase.prototype.onBeforeShow = function() {
  return this.dispatchEvent(goog.ui.PopupBase.EventType.BEFORE_SHOW);
};
goog.ui.PopupBase.prototype.onShow_ = function() {
  this.dispatchEvent(goog.ui.PopupBase.EventType.SHOW);
};
goog.ui.PopupBase.prototype.onBeforeHide_ = function(opt_target) {
  return this.dispatchEvent({type:goog.ui.PopupBase.EventType.BEFORE_HIDE, target:opt_target});
};
goog.ui.PopupBase.prototype.onHide_ = function(opt_target) {
  this.dispatchEvent({type:goog.ui.PopupBase.EventType.HIDE, target:opt_target});
};
goog.ui.PopupBase.prototype.onDocumentMouseDown_ = function(e) {
  var target = e.target;
  if (!goog.dom.contains(this.element_, target) && !this.isOrWithinAutoHidePartner_(target) && this.isWithinAutoHideRegion_(target) && !this.shouldDebounce_()) {
    this.hide_(target);
  }
};
goog.ui.PopupBase.prototype.onDocumentKeyDown_ = function(e) {
  if (e.keyCode == goog.events.KeyCodes.ESC) {
    if (this.hide_(e.target)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
};
goog.ui.PopupBase.prototype.onDocumentBlur_ = function(e) {
  if (!this.enableCrossIframeDismissal_) {
    return;
  }
  var doc = goog.dom.getOwnerDocument(this.element_);
  if (typeof document.activeElement != "undefined") {
    var activeElement = doc.activeElement;
    if (!activeElement || goog.dom.contains(this.element_, activeElement) || activeElement.tagName == goog.dom.TagName.BODY) {
      return;
    }
  } else {
    if (e.target != doc) {
      return;
    }
  }
  if (this.shouldDebounce_()) {
    return;
  }
  this.hide_();
};
goog.ui.PopupBase.prototype.isOrWithinAutoHidePartner_ = function(element) {
  return goog.array.some(this.autoHidePartners_ || [], function(partner) {
    return element === partner || goog.dom.contains(partner, element);
  });
};
goog.ui.PopupBase.prototype.isWithinAutoHideRegion_ = function(element) {
  return this.autoHideRegion_ ? goog.dom.contains(this.autoHideRegion_, element) : true;
};
goog.ui.PopupBase.prototype.shouldDebounce_ = function() {
  return goog.now() - this.lastShowTime_ < goog.ui.PopupBase.DEBOUNCE_DELAY_MS;
};
goog.ui.PopupBase.prototype.disposeInternal = function() {
  goog.ui.PopupBase.base(this, "disposeInternal");
  this.handler_.dispose();
  goog.dispose(this.showTransition_);
  goog.dispose(this.hideTransition_);
  delete this.element_;
  delete this.handler_;
  delete this.autoHidePartners_;
};
goog.provide("goog.ui.Popup");
goog.require("goog.math.Box");
goog.require("goog.positioning.Corner");
goog.require("goog.style");
goog.require("goog.ui.PopupBase");
goog.ui.Popup = function(opt_element, opt_position) {
  this.popupCorner_ = goog.positioning.Corner.TOP_START;
  this.position_ = opt_position || undefined;
  goog.ui.PopupBase.call(this, opt_element);
};
goog.inherits(goog.ui.Popup, goog.ui.PopupBase);
goog.tagUnsealableClass(goog.ui.Popup);
goog.ui.Popup.prototype.margin_;
goog.ui.Popup.prototype.getPinnedCorner = function() {
  return this.popupCorner_;
};
goog.ui.Popup.prototype.setPinnedCorner = function(corner) {
  this.popupCorner_ = corner;
  if (this.isVisible()) {
    this.reposition();
  }
};
goog.ui.Popup.prototype.getPosition = function() {
  return this.position_ || null;
};
goog.ui.Popup.prototype.setPosition = function(position) {
  this.position_ = position || undefined;
  if (this.isVisible()) {
    this.reposition();
  }
};
goog.ui.Popup.prototype.getMargin = function() {
  return this.margin_ || null;
};
goog.ui.Popup.prototype.setMargin = function(arg1, opt_arg2, opt_arg3, opt_arg4) {
  if (arg1 == null || arg1 instanceof goog.math.Box) {
    this.margin_ = arg1;
  } else {
    this.margin_ = new goog.math.Box(arg1, (opt_arg2), (opt_arg3), (opt_arg4));
  }
  if (this.isVisible()) {
    this.reposition();
  }
};
goog.ui.Popup.prototype.reposition = function() {
  if (!this.position_) {
    return;
  }
  var hideForPositioning = !this.isVisible() && this.getType() != goog.ui.PopupBase.Type.MOVE_OFFSCREEN;
  var el = this.getElement();
  if (hideForPositioning) {
    el.style.visibility = "hidden";
    goog.style.setElementShown(el, true);
  }
  this.position_.reposition(el, this.popupCorner_, this.margin_);
  if (hideForPositioning) {
    goog.style.setElementShown(el, false);
  }
};
goog.provide("goog.iter");
goog.provide("goog.iter.Iterable");
goog.provide("goog.iter.Iterator");
goog.provide("goog.iter.StopIteration");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.functions");
goog.require("goog.math");
goog.iter.Iterable;
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global["StopIteration"] : {message:"StopIteration", stack:""};
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
  return this;
};
goog.iter.toIterator = function(iterable) {
  if (iterable instanceof goog.iter.Iterator) {
    return iterable;
  }
  if (typeof iterable.__iterator__ == "function") {
    return iterable.__iterator__(false);
  }
  if (goog.isArrayLike(iterable)) {
    var i = 0;
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
      while (true) {
        if (i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if (!(i in iterable)) {
          i++;
          continue;
        }
        return iterable[i++];
      }
    };
    return newIter;
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
  if (goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach((iterable), f, opt_obj);
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  } else {
    iterable = goog.iter.toIterator(iterable);
    try {
      while (true) {
        f.call(opt_obj, iterable.next(), undefined, iterable);
      }
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (f.call(opt_obj, val, undefined, iterator)) {
        return val;
      }
    }
  };
  return newIter;
};
goog.iter.filterFalse = function(iterable, f, opt_obj) {
  return goog.iter.filter(iterable, goog.functions.not(f), opt_obj);
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0;
  var stop = startOrStop;
  var step = opt_step || 1;
  if (arguments.length > 1) {
    start = startOrStop;
    stop = opt_stop;
  }
  if (step == 0) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (step > 0 && start >= stop || step < 0 && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv;
  };
  return newIter;
};
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator);
};
goog.iter.map = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    var val = iterator.next();
    return f.call(opt_obj, val, undefined, iterator);
  };
  return newIter;
};
goog.iter.reduce = function(iterable, f, val, opt_obj) {
  var rval = val;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val);
  });
  return rval;
};
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while (true) {
      if (f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return false;
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while (true) {
      if (!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return true;
};
goog.iter.chain = function(var_args) {
  return goog.iter.chainFromIterable(arguments);
};
goog.iter.chainFromIterable = function(iterable) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  var current = null;
  iter.next = function() {
    while (true) {
      if (current == null) {
        var it = iterator.next();
        current = goog.iter.toIterator(it);
      }
      try {
        return current.next();
      } catch (ex) {
        if (ex !== goog.iter.StopIteration) {
          throw ex;
        }
        current = null;
      }
    }
  };
  return iter;
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var dropping = true;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (dropping && f.call(opt_obj, val, undefined, iterator)) {
        continue;
      } else {
        dropping = false;
      }
      return val;
    }
  };
  return newIter;
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    var val = iterator.next();
    if (f.call(opt_obj, val, undefined, iterator)) {
      return val;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.toArray = function(iterable) {
  if (goog.isArrayLike(iterable)) {
    return goog.array.toArray((iterable));
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val);
  });
  return array;
};
goog.iter.equals = function(iterable1, iterable2, opt_equalsFn) {
  var fillValue = {};
  var pairs = goog.iter.zipLongest(fillValue, iterable1, iterable2);
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  return goog.iter.every(pairs, function(pair) {
    return equalsFn(pair[0], pair[1]);
  });
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next();
  } catch (e) {
    if (e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue;
  }
};
goog.iter.product = function(var_args) {
  var someArrayEmpty = goog.array.some(arguments, function(arr) {
    return !arr.length;
  });
  if (someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator;
  }
  var iter = new goog.iter.Iterator;
  var arrays = arguments;
  var indicies = goog.array.repeat(0, arrays.length);
  iter.next = function() {
    if (indicies) {
      var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex];
      });
      for (var i = indicies.length - 1;i >= 0;i--) {
        goog.asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }
        if (i == 0) {
          indicies = null;
          break;
        }
        indicies[i] = 0;
      }
      return retVal;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.cycle = function(iterable) {
  var baseIterator = goog.iter.toIterator(iterable);
  var cache = [];
  var cacheIndex = 0;
  var iter = new goog.iter.Iterator;
  var useCache = false;
  iter.next = function() {
    var returnElement = null;
    if (!useCache) {
      try {
        returnElement = baseIterator.next();
        cache.push(returnElement);
        return returnElement;
      } catch (e) {
        if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        useCache = true;
      }
    }
    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;
    return returnElement;
  };
  return iter;
};
goog.iter.count = function(opt_start, opt_step) {
  var counter = opt_start || 0;
  var step = goog.isDef(opt_step) ? opt_step : 1;
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    var returnValue = counter;
    counter += step;
    return returnValue;
  };
  return iter;
};
goog.iter.repeat = function(value) {
  var iter = new goog.iter.Iterator;
  iter.next = goog.functions.constant(value);
  return iter;
};
goog.iter.accumulate = function(iterable) {
  var iterator = goog.iter.toIterator(iterable);
  var total = 0;
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    total += iterator.next();
    return total;
  };
  return iter;
};
goog.iter.zip = function(var_args) {
  var args = arguments;
  var iter = new goog.iter.Iterator;
  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var arr = goog.array.map(iterators, function(it) {
        return it.next();
      });
      return arr;
    };
  }
  return iter;
};
goog.iter.zipLongest = function(fillValue, var_args) {
  var args = goog.array.slice(arguments, 1);
  var iter = new goog.iter.Iterator;
  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var iteratorsHaveValues = false;
      var arr = goog.array.map(iterators, function(it) {
        var returnValue;
        try {
          returnValue = it.next();
          iteratorsHaveValues = true;
        } catch (ex) {
          if (ex !== goog.iter.StopIteration) {
            throw ex;
          }
          returnValue = fillValue;
        }
        return returnValue;
      });
      if (!iteratorsHaveValues) {
        throw goog.iter.StopIteration;
      }
      return arr;
    };
  }
  return iter;
};
goog.iter.compress = function(iterable, selectors) {
  var selectorIterator = goog.iter.toIterator(selectors);
  return goog.iter.filter(iterable, function() {
    return !!selectorIterator.next();
  });
};
goog.iter.GroupByIterator_ = function(iterable, opt_keyFunc) {
  this.iterator = goog.iter.toIterator(iterable);
  this.keyFunc = opt_keyFunc || goog.functions.identity;
  this.targetKey;
  this.currentKey;
  this.currentValue;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
  while (this.currentKey == this.targetKey) {
    this.currentValue = this.iterator.next();
    this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return [this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(targetKey) {
  var arr = [];
  while (this.currentKey == targetKey) {
    arr.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return arr;
};
goog.iter.groupBy = function(iterable, opt_keyFunc) {
  return new goog.iter.GroupByIterator_(iterable, opt_keyFunc);
};
goog.iter.starMap = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    var args = goog.iter.toArray(iterator.next());
    return f.apply(opt_obj, goog.array.concat(args, undefined, iterator));
  };
  return iter;
};
goog.iter.tee = function(iterable, opt_num) {
  var iterator = goog.iter.toIterator(iterable);
  var num = goog.isNumber(opt_num) ? opt_num : 2;
  var buffers = goog.array.map(goog.array.range(num), function() {
    return [];
  });
  var addNextIteratorValueToBuffers = function() {
    var val = iterator.next();
    goog.array.forEach(buffers, function(buffer) {
      buffer.push(val);
    });
  };
  var createIterator = function(buffer) {
    var iter = new goog.iter.Iterator;
    iter.next = function() {
      if (goog.array.isEmpty(buffer)) {
        addNextIteratorValueToBuffers();
      }
      goog.asserts.assert(!goog.array.isEmpty(buffer));
      return buffer.shift();
    };
    return iter;
  };
  return goog.array.map(buffers, createIterator);
};
goog.iter.enumerate = function(iterable, opt_start) {
  return goog.iter.zip(goog.iter.count(opt_start), iterable);
};
goog.iter.limit = function(iterable, limitSize) {
  goog.asserts.assert(goog.math.isInt(limitSize) && limitSize >= 0);
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  var remaining = limitSize;
  iter.next = function() {
    if (remaining-- > 0) {
      return iterator.next();
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.consume = function(iterable, count) {
  goog.asserts.assert(goog.math.isInt(count) && count >= 0);
  var iterator = goog.iter.toIterator(iterable);
  while (count-- > 0) {
    goog.iter.nextOrValue(iterator, null);
  }
  return iterator;
};
goog.iter.slice = function(iterable, start, opt_end) {
  goog.asserts.assert(goog.math.isInt(start) && start >= 0);
  var iterator = goog.iter.consume(iterable, start);
  if (goog.isNumber(opt_end)) {
    goog.asserts.assert(goog.math.isInt(opt_end) && opt_end >= start);
    iterator = goog.iter.limit(iterator, opt_end - start);
  }
  return iterator;
};
goog.iter.hasDuplicates_ = function(arr) {
  var deduped = [];
  goog.array.removeDuplicates(arr, deduped);
  return arr.length != deduped.length;
};
goog.iter.permutations = function(iterable, opt_length) {
  var elements = goog.iter.toArray(iterable);
  var length = goog.isNumber(opt_length) ? opt_length : elements.length;
  var sets = goog.array.repeat(elements, length);
  var product = goog.iter.product.apply(undefined, sets);
  return goog.iter.filter(product, function(arr) {
    return !goog.iter.hasDuplicates_(arr);
  });
};
goog.iter.combinations = function(iterable, length) {
  var elements = goog.iter.toArray(iterable);
  var indexes = goog.iter.range(elements.length);
  var indexIterator = goog.iter.permutations(indexes, length);
  var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  });
  var iter = new goog.iter.Iterator;
  function getIndexFromElements(index) {
    return elements[index];
  }
  iter.next = function() {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
  };
  return iter;
};
goog.iter.combinationsWithReplacement = function(iterable, length) {
  var elements = goog.iter.toArray(iterable);
  var indexes = goog.array.range(elements.length);
  var sets = goog.array.repeat(indexes, length);
  var indexIterator = goog.iter.product.apply(undefined, sets);
  var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  });
  var iter = new goog.iter.Iterator;
  function getIndexFromElements(index) {
    return elements[index];
  }
  iter.next = function() {
    return goog.array.map((sortedIndexIterator.next()), getIndexFromElements);
  };
  return iter;
};
goog.provide("goog.storage.mechanism.IterableMechanism");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.iter");
goog.require("goog.storage.mechanism.Mechanism");
goog.storage.mechanism.IterableMechanism = function() {
  goog.storage.mechanism.IterableMechanism.base(this, "constructor");
};
goog.inherits(goog.storage.mechanism.IterableMechanism, goog.storage.mechanism.Mechanism);
goog.storage.mechanism.IterableMechanism.prototype.getCount = function() {
  var count = 0;
  goog.iter.forEach(this.__iterator__(true), function(key) {
    goog.asserts.assertString(key);
    count++;
  });
  return count;
};
goog.storage.mechanism.IterableMechanism.prototype.__iterator__ = goog.abstractMethod;
goog.storage.mechanism.IterableMechanism.prototype.clear = function() {
  var keys = goog.iter.toArray(this.__iterator__(true));
  var selfObj = this;
  goog.array.forEach(keys, function(key) {
    selfObj.remove(key);
  });
};
goog.provide("goog.storage.mechanism.HTML5WebStorage");
goog.require("goog.asserts");
goog.require("goog.iter.Iterator");
goog.require("goog.iter.StopIteration");
goog.require("goog.storage.mechanism.ErrorCode");
goog.require("goog.storage.mechanism.IterableMechanism");
goog.storage.mechanism.HTML5WebStorage = function(storage) {
  goog.storage.mechanism.HTML5WebStorage.base(this, "constructor");
  this.storage_ = storage;
};
goog.inherits(goog.storage.mechanism.HTML5WebStorage, goog.storage.mechanism.IterableMechanism);
goog.storage.mechanism.HTML5WebStorage.STORAGE_AVAILABLE_KEY_ = "__sak";
goog.storage.mechanism.HTML5WebStorage.prototype.isAvailable = function() {
  if (!this.storage_) {
    return false;
  }
  try {
    this.storage_.setItem(goog.storage.mechanism.HTML5WebStorage.STORAGE_AVAILABLE_KEY_, "1");
    this.storage_.removeItem(goog.storage.mechanism.HTML5WebStorage.STORAGE_AVAILABLE_KEY_);
    return true;
  } catch (e) {
    return false;
  }
};
goog.storage.mechanism.HTML5WebStorage.prototype.set = function(key, value) {
  try {
    this.storage_.setItem(key, value);
  } catch (e) {
    if (this.storage_.length == 0) {
      throw goog.storage.mechanism.ErrorCode.STORAGE_DISABLED;
    } else {
      throw goog.storage.mechanism.ErrorCode.QUOTA_EXCEEDED;
    }
  }
};
goog.storage.mechanism.HTML5WebStorage.prototype.get = function(key) {
  var value = this.storage_.getItem(key);
  if (!goog.isString(value) && !goog.isNull(value)) {
    throw goog.storage.mechanism.ErrorCode.INVALID_VALUE;
  }
  return value;
};
goog.storage.mechanism.HTML5WebStorage.prototype.remove = function(key) {
  this.storage_.removeItem(key);
};
goog.storage.mechanism.HTML5WebStorage.prototype.getCount = function() {
  return this.storage_.length;
};
goog.storage.mechanism.HTML5WebStorage.prototype.__iterator__ = function(opt_keys) {
  var i = 0;
  var storage = this.storage_;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (i >= storage.length) {
      throw goog.iter.StopIteration;
    }
    var key = goog.asserts.assertString(storage.key(i++));
    if (opt_keys) {
      return key;
    }
    var value = storage.getItem(key);
    if (!goog.isString(value)) {
      throw goog.storage.mechanism.ErrorCode.INVALID_VALUE;
    }
    return value;
  };
  return newIter;
};
goog.storage.mechanism.HTML5WebStorage.prototype.clear = function() {
  this.storage_.clear();
};
goog.storage.mechanism.HTML5WebStorage.prototype.key = function(index) {
  return this.storage_.key(index);
};
goog.provide("goog.storage.mechanism.HTML5LocalStorage");
goog.require("goog.storage.mechanism.HTML5WebStorage");
goog.storage.mechanism.HTML5LocalStorage = function() {
  var storage = null;
  try {
    storage = window.localStorage || null;
  } catch (e) {
  }
  goog.storage.mechanism.HTML5LocalStorage.base(this, "constructor", storage);
};
goog.inherits(goog.storage.mechanism.HTML5LocalStorage, goog.storage.mechanism.HTML5WebStorage);
goog.provide("goog.structs.Map");
goog.require("goog.iter.Iterator");
goog.require("goog.iter.StopIteration");
goog.require("goog.object");
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  this.count_ = 0;
  this.version_ = 0;
  var argLength = arguments.length;
  if (argLength > 1) {
    if (argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1]);
    }
  } else {
    if (opt_map) {
      this.addAll((opt_map));
    }
  }
};
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  var rv = [];
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key]);
  }
  return rv;
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return (this.keys_.concat());
};
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key);
};
goog.structs.Map.prototype.containsValue = function(val) {
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return true;
    }
  }
  return false;
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if (this === otherMap) {
    return true;
  }
  if (this.count_ != otherMap.getCount()) {
    return false;
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var key, i = 0;key = this.keys_[i];i++) {
    if (!equalityFn(this.get(key), otherMap.get(key))) {
      return false;
    }
  }
  return true;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.keys_.length = 0;
  this.count_ = 0;
  this.version_ = 0;
};
goog.structs.Map.prototype.remove = function(key) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    delete this.map_[key];
    this.count_--;
    this.version_++;
    if (this.keys_.length > 2 * this.count_) {
      this.cleanupKeysArray_();
    }
    return true;
  }
  return false;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    var srcIndex = 0;
    var destIndex = 0;
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if (goog.structs.Map.hasKey_(this.map_, key)) {
        this.keys_[destIndex++] = key;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
  if (this.count_ != this.keys_.length) {
    var seen = {};
    var srcIndex = 0;
    var destIndex = 0;
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if (!goog.structs.Map.hasKey_(seen, key)) {
        this.keys_[destIndex++] = key;
        seen[key] = 1;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    return this.map_[key];
  }
  return opt_val;
};
goog.structs.Map.prototype.set = function(key, value) {
  if (!goog.structs.Map.hasKey_(this.map_, key)) {
    this.count_++;
    this.keys_.push((key));
    this.version_++;
  }
  this.map_[key] = value;
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  if (map instanceof goog.structs.Map) {
    keys = map.getKeys();
    values = map.getValues();
  } else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map);
  }
  for (var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i]);
  }
};
goog.structs.Map.prototype.forEach = function(f, opt_obj) {
  var keys = this.getKeys();
  for (var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var value = this.get(key);
    f.call(opt_obj, value, key, this);
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
  var transposed = new goog.structs.Map;
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    var value = this.map_[key];
    transposed.set(value, key);
  }
  return transposed;
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  var obj = {};
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key];
  }
  return obj;
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(true);
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(false);
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  this.cleanupKeysArray_();
  var i = 0;
  var version = this.version_;
  var selfObj = this;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (version != selfObj.version_) {
      throw Error("The map has changed since the iterator was created");
    }
    if (i >= selfObj.keys_.length) {
      throw goog.iter.StopIteration;
    }
    var key = selfObj.keys_[i++];
    return opt_keys ? key : selfObj.map_[key];
  };
  return newIter;
};
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
goog.provide("goog.Uri");
goog.provide("goog.Uri.QueryData");
goog.require("goog.array");
goog.require("goog.string");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.require("goog.uri.utils");
goog.require("goog.uri.utils.ComponentIndex");
goog.require("goog.uri.utils.StandardQueryParam");
goog.Uri = function(opt_uri, opt_ignoreCase) {
  this.scheme_ = "";
  this.userInfo_ = "";
  this.domain_ = "";
  this.port_ = null;
  this.path_ = "";
  this.fragment_ = "";
  this.isReadOnly_ = false;
  this.ignoreCase_ = false;
  this.queryData_;
  var m;
  if (opt_uri instanceof goog.Uri) {
    this.ignoreCase_ = goog.isDef(opt_ignoreCase) ? opt_ignoreCase : opt_uri.getIgnoreCase();
    this.setScheme(opt_uri.getScheme());
    this.setUserInfo(opt_uri.getUserInfo());
    this.setDomain(opt_uri.getDomain());
    this.setPort(opt_uri.getPort());
    this.setPath(opt_uri.getPath());
    this.setQueryData(opt_uri.getQueryData().clone());
    this.setFragment(opt_uri.getFragment());
  } else {
    if (opt_uri && (m = goog.uri.utils.split(String(opt_uri)))) {
      this.ignoreCase_ = !!opt_ignoreCase;
      this.setScheme(m[goog.uri.utils.ComponentIndex.SCHEME] || "", true);
      this.setUserInfo(m[goog.uri.utils.ComponentIndex.USER_INFO] || "", true);
      this.setDomain(m[goog.uri.utils.ComponentIndex.DOMAIN] || "", true);
      this.setPort(m[goog.uri.utils.ComponentIndex.PORT]);
      this.setPath(m[goog.uri.utils.ComponentIndex.PATH] || "", true);
      this.setQueryData(m[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", true);
      this.setFragment(m[goog.uri.utils.ComponentIndex.FRAGMENT] || "", true);
    } else {
      this.ignoreCase_ = !!opt_ignoreCase;
      this.queryData_ = new goog.Uri.QueryData(null, null, this.ignoreCase_);
    }
  }
};
goog.Uri.preserveParameterTypesCompatibilityFlag = false;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.toString = function() {
  var out = [];
  var scheme = this.getScheme();
  if (scheme) {
    out.push(goog.Uri.encodeSpecialChars_(scheme, goog.Uri.reDisallowedInSchemeOrUserInfo_, true), ":");
  }
  var domain = this.getDomain();
  if (domain || scheme == "file") {
    out.push("//");
    var userInfo = this.getUserInfo();
    if (userInfo) {
      out.push(goog.Uri.encodeSpecialChars_(userInfo, goog.Uri.reDisallowedInSchemeOrUserInfo_, true), "@");
    }
    out.push(goog.Uri.removeDoubleEncoding_(goog.string.urlEncode(domain)));
    var port = this.getPort();
    if (port != null) {
      out.push(":", String(port));
    }
  }
  var path = this.getPath();
  if (path) {
    if (this.hasDomain() && path.charAt(0) != "/") {
      out.push("/");
    }
    out.push(goog.Uri.encodeSpecialChars_(path, path.charAt(0) == "/" ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_, true));
  }
  var query = this.getEncodedQuery();
  if (query) {
    out.push("?", query);
  }
  var fragment = this.getFragment();
  if (fragment) {
    out.push("#", goog.Uri.encodeSpecialChars_(fragment, goog.Uri.reDisallowedInFragment_));
  }
  return out.join("");
};
goog.Uri.prototype.resolve = function(relativeUri) {
  var absoluteUri = this.clone();
  var overridden = relativeUri.hasScheme();
  if (overridden) {
    absoluteUri.setScheme(relativeUri.getScheme());
  } else {
    overridden = relativeUri.hasUserInfo();
  }
  if (overridden) {
    absoluteUri.setUserInfo(relativeUri.getUserInfo());
  } else {
    overridden = relativeUri.hasDomain();
  }
  if (overridden) {
    absoluteUri.setDomain(relativeUri.getDomain());
  } else {
    overridden = relativeUri.hasPort();
  }
  var path = relativeUri.getPath();
  if (overridden) {
    absoluteUri.setPort(relativeUri.getPort());
  } else {
    overridden = relativeUri.hasPath();
    if (overridden) {
      if (path.charAt(0) != "/") {
        if (this.hasDomain() && !this.hasPath()) {
          path = "/" + path;
        } else {
          var lastSlashIndex = absoluteUri.getPath().lastIndexOf("/");
          if (lastSlashIndex != -1) {
            path = absoluteUri.getPath().substr(0, lastSlashIndex + 1) + path;
          }
        }
      }
      path = goog.Uri.removeDotSegments(path);
    }
  }
  if (overridden) {
    absoluteUri.setPath(path);
  } else {
    overridden = relativeUri.hasQuery();
  }
  if (overridden) {
    absoluteUri.setQueryData(relativeUri.getDecodedQuery());
  } else {
    overridden = relativeUri.hasFragment();
  }
  if (overridden) {
    absoluteUri.setFragment(relativeUri.getFragment());
  }
  return absoluteUri;
};
goog.Uri.prototype.clone = function() {
  return new goog.Uri(this);
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_;
};
goog.Uri.prototype.setScheme = function(newScheme, opt_decode) {
  this.enforceReadOnly();
  this.scheme_ = opt_decode ? goog.Uri.decodeOrEmpty_(newScheme, true) : newScheme;
  if (this.scheme_) {
    this.scheme_ = this.scheme_.replace(/:$/, "");
  }
  return this;
};
goog.Uri.prototype.hasScheme = function() {
  return !!this.scheme_;
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_;
};
goog.Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
  this.enforceReadOnly();
  this.userInfo_ = opt_decode ? goog.Uri.decodeOrEmpty_(newUserInfo) : newUserInfo;
  return this;
};
goog.Uri.prototype.hasUserInfo = function() {
  return !!this.userInfo_;
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_;
};
goog.Uri.prototype.setDomain = function(newDomain, opt_decode) {
  this.enforceReadOnly();
  this.domain_ = opt_decode ? goog.Uri.decodeOrEmpty_(newDomain, true) : newDomain;
  return this;
};
goog.Uri.prototype.hasDomain = function() {
  return !!this.domain_;
};
goog.Uri.prototype.getPort = function() {
  return this.port_;
};
goog.Uri.prototype.setPort = function(newPort) {
  this.enforceReadOnly();
  if (newPort) {
    newPort = Number(newPort);
    if (isNaN(newPort) || newPort < 0) {
      throw Error("Bad port number " + newPort);
    }
    this.port_ = newPort;
  } else {
    this.port_ = null;
  }
  return this;
};
goog.Uri.prototype.hasPort = function() {
  return this.port_ != null;
};
goog.Uri.prototype.getPath = function() {
  return this.path_;
};
goog.Uri.prototype.setPath = function(newPath, opt_decode) {
  this.enforceReadOnly();
  this.path_ = opt_decode ? goog.Uri.decodeOrEmpty_(newPath, true) : newPath;
  return this;
};
goog.Uri.prototype.hasPath = function() {
  return !!this.path_;
};
goog.Uri.prototype.hasQuery = function() {
  return this.queryData_.toString() !== "";
};
goog.Uri.prototype.setQueryData = function(queryData, opt_decode) {
  this.enforceReadOnly();
  if (queryData instanceof goog.Uri.QueryData) {
    this.queryData_ = queryData;
    this.queryData_.setIgnoreCase(this.ignoreCase_);
  } else {
    if (!opt_decode) {
      queryData = goog.Uri.encodeSpecialChars_(queryData, goog.Uri.reDisallowedInQuery_);
    }
    this.queryData_ = new goog.Uri.QueryData(queryData, null, this.ignoreCase_);
  }
  return this;
};
goog.Uri.prototype.setQuery = function(newQuery, opt_decode) {
  return this.setQueryData(newQuery, opt_decode);
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString();
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString();
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_;
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery();
};
goog.Uri.prototype.setParameterValue = function(key, value) {
  this.enforceReadOnly();
  this.queryData_.set(key, value);
  return this;
};
goog.Uri.prototype.setParameterValues = function(key, values) {
  this.enforceReadOnly();
  if (!goog.isArray(values)) {
    values = [String(values)];
  }
  this.queryData_.setValues(key, values);
  return this;
};
goog.Uri.prototype.getParameterValues = function(name) {
  return this.queryData_.getValues(name);
};
goog.Uri.prototype.getParameterValue = function(paramName) {
  return (this.queryData_.get(paramName));
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_;
};
goog.Uri.prototype.setFragment = function(newFragment, opt_decode) {
  this.enforceReadOnly();
  this.fragment_ = opt_decode ? goog.Uri.decodeOrEmpty_(newFragment) : newFragment;
  return this;
};
goog.Uri.prototype.hasFragment = function() {
  return !!this.fragment_;
};
goog.Uri.prototype.hasSameDomainAs = function(uri2) {
  return (!this.hasDomain() && !uri2.hasDomain() || this.getDomain() == uri2.getDomain()) && (!this.hasPort() && !uri2.hasPort() || this.getPort() == uri2.getPort());
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this;
};
goog.Uri.prototype.removeParameter = function(key) {
  this.enforceReadOnly();
  this.queryData_.remove(key);
  return this;
};
goog.Uri.prototype.setReadOnly = function(isReadOnly) {
  this.isReadOnly_ = isReadOnly;
  return this;
};
goog.Uri.prototype.isReadOnly = function() {
  return this.isReadOnly_;
};
goog.Uri.prototype.enforceReadOnly = function() {
  if (this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(ignoreCase) {
  this.ignoreCase_ = ignoreCase;
  if (this.queryData_) {
    this.queryData_.setIgnoreCase(ignoreCase);
  }
  return this;
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_;
};
goog.Uri.parse = function(uri, opt_ignoreCase) {
  return uri instanceof goog.Uri ? uri.clone() : new goog.Uri(uri, opt_ignoreCase);
};
goog.Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_query, opt_fragment, opt_ignoreCase) {
  var uri = new goog.Uri(null, opt_ignoreCase);
  opt_scheme && uri.setScheme(opt_scheme);
  opt_userInfo && uri.setUserInfo(opt_userInfo);
  opt_domain && uri.setDomain(opt_domain);
  opt_port && uri.setPort(opt_port);
  opt_path && uri.setPath(opt_path);
  opt_query && uri.setQueryData(opt_query);
  opt_fragment && uri.setFragment(opt_fragment);
  return uri;
};
goog.Uri.resolve = function(base, rel) {
  if (!(base instanceof goog.Uri)) {
    base = goog.Uri.parse(base);
  }
  if (!(rel instanceof goog.Uri)) {
    rel = goog.Uri.parse(rel);
  }
  return base.resolve(rel);
};
goog.Uri.removeDotSegments = function(path) {
  if (path == ".." || path == ".") {
    return "";
  } else {
    if (!goog.string.contains(path, "./") && !goog.string.contains(path, "/.")) {
      return path;
    } else {
      var leadingSlash = goog.string.startsWith(path, "/");
      var segments = path.split("/");
      var out = [];
      for (var pos = 0;pos < segments.length;) {
        var segment = segments[pos++];
        if (segment == ".") {
          if (leadingSlash && pos == segments.length) {
            out.push("");
          }
        } else {
          if (segment == "..") {
            if (out.length > 1 || out.length == 1 && out[0] != "") {
              out.pop();
            }
            if (leadingSlash && pos == segments.length) {
              out.push("");
            }
          } else {
            out.push(segment);
            leadingSlash = true;
          }
        }
      }
      return out.join("/");
    }
  }
};
goog.Uri.decodeOrEmpty_ = function(val, opt_preserveReserved) {
  if (!val) {
    return "";
  }
  return opt_preserveReserved ? decodeURI(val.replace(/%25/g, "%2525")) : decodeURIComponent(val);
};
goog.Uri.encodeSpecialChars_ = function(unescapedPart, extra, opt_removeDoubleEncoding) {
  if (goog.isString(unescapedPart)) {
    var encoded = encodeURI(unescapedPart).replace(extra, goog.Uri.encodeChar_);
    if (opt_removeDoubleEncoding) {
      encoded = goog.Uri.removeDoubleEncoding_(encoded);
    }
    return encoded;
  }
  return null;
};
goog.Uri.encodeChar_ = function(ch) {
  var n = ch.charCodeAt(0);
  return "%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16);
};
goog.Uri.removeDoubleEncoding_ = function(doubleEncodedString) {
  return doubleEncodedString.replace(/%25([0-9a-fA-F]{2})/g, "%$1");
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(uri1String, uri2String) {
  var pieces1 = goog.uri.utils.split(uri1String);
  var pieces2 = goog.uri.utils.split(uri2String);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.Uri.QueryData = function(opt_query, opt_uri, opt_ignoreCase) {
  this.keyMap_ = null;
  this.count_ = null;
  this.encodedQuery_ = opt_query || null;
  this.ignoreCase_ = !!opt_ignoreCase;
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if (!this.keyMap_) {
    this.keyMap_ = new goog.structs.Map;
    this.count_ = 0;
    if (this.encodedQuery_) {
      var self = this;
      goog.uri.utils.parseQueryData(this.encodedQuery_, function(name, value) {
        self.add(goog.string.urlDecode(name), value);
      });
    }
  }
};
goog.Uri.QueryData.createFromMap = function(map, opt_uri, opt_ignoreCase) {
  var keys = goog.structs.getKeys(map);
  if (typeof keys == "undefined") {
    throw Error("Keys are undefined");
  }
  var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase);
  var values = goog.structs.getValues(map);
  for (var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var value = values[i];
    if (!goog.isArray(value)) {
      queryData.add(key, value);
    } else {
      queryData.setValues(key, value);
    }
  }
  return queryData;
};
goog.Uri.QueryData.createFromKeysValues = function(keys, values, opt_uri, opt_ignoreCase) {
  if (keys.length != values.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase);
  for (var i = 0;i < keys.length;i++) {
    queryData.add(keys[i], values[i]);
  }
  return queryData;
};
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_;
};
goog.Uri.QueryData.prototype.add = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  var values = this.keyMap_.get(key);
  if (!values) {
    this.keyMap_.set(key, values = []);
  }
  values.push(value);
  this.count_++;
  return this;
};
goog.Uri.QueryData.prototype.remove = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  if (this.keyMap_.containsKey(key)) {
    this.invalidateCache_();
    this.count_ -= this.keyMap_.get(key).length;
    return this.keyMap_.remove(key);
  }
  return false;
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ = null;
  this.count_ = 0;
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return this.count_ == 0;
};
goog.Uri.QueryData.prototype.containsKey = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.containsKey(key);
};
goog.Uri.QueryData.prototype.containsValue = function(value) {
  var vals = this.getValues();
  return goog.array.contains(vals, value);
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  var vals = (this.keyMap_.getValues());
  var keys = this.keyMap_.getKeys();
  var rv = [];
  for (var i = 0;i < keys.length;i++) {
    var val = vals[i];
    for (var j = 0;j < val.length;j++) {
      rv.push(keys[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.getValues = function(opt_key) {
  this.ensureKeyMapInitialized_();
  var rv = [];
  if (goog.isString(opt_key)) {
    if (this.containsKey(opt_key)) {
      rv = goog.array.concat(rv, this.keyMap_.get(this.getKeyName_(opt_key)));
    }
  } else {
    var values = this.keyMap_.getValues();
    for (var i = 0;i < values.length;i++) {
      rv = goog.array.concat(rv, values[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.set = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  if (this.containsKey(key)) {
    this.count_ -= this.keyMap_.get(key).length;
  }
  this.keyMap_.set(key, [value]);
  this.count_++;
  return this;
};
goog.Uri.QueryData.prototype.get = function(key, opt_default) {
  var values = key ? this.getValues(key) : [];
  if (goog.Uri.preserveParameterTypesCompatibilityFlag) {
    return values.length > 0 ? values[0] : opt_default;
  } else {
    return values.length > 0 ? String(values[0]) : opt_default;
  }
};
goog.Uri.QueryData.prototype.setValues = function(key, values) {
  this.remove(key);
  if (values.length > 0) {
    this.invalidateCache_();
    this.keyMap_.set(this.getKeyName_(key), goog.array.clone(values));
    this.count_ += values.length;
  }
};
goog.Uri.QueryData.prototype.toString = function() {
  if (this.encodedQuery_) {
    return this.encodedQuery_;
  }
  if (!this.keyMap_) {
    return "";
  }
  var sb = [];
  var keys = this.keyMap_.getKeys();
  for (var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var encodedKey = goog.string.urlEncode(key);
    var val = this.getValues(key);
    for (var j = 0;j < val.length;j++) {
      var param = encodedKey;
      if (val[j] !== "") {
        param += "=" + goog.string.urlEncode(val[j]);
      }
      sb.push(param);
    }
  }
  return this.encodedQuery_ = sb.join("&");
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  return goog.Uri.decodeOrEmpty_(this.toString());
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  this.encodedQuery_ = null;
};
goog.Uri.QueryData.prototype.filterKeys = function(keys) {
  this.ensureKeyMapInitialized_();
  this.keyMap_.forEach(function(value, key) {
    if (!goog.array.contains(keys, key)) {
      this.remove(key);
    }
  }, this);
  return this;
};
goog.Uri.QueryData.prototype.clone = function() {
  var rv = new goog.Uri.QueryData;
  rv.encodedQuery_ = this.encodedQuery_;
  if (this.keyMap_) {
    rv.keyMap_ = this.keyMap_.clone();
    rv.count_ = this.count_;
  }
  return rv;
};
goog.Uri.QueryData.prototype.getKeyName_ = function(arg) {
  var keyName = String(arg);
  if (this.ignoreCase_) {
    keyName = keyName.toLowerCase();
  }
  return keyName;
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(ignoreCase) {
  var resetKeys = ignoreCase && !this.ignoreCase_;
  if (resetKeys) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    this.keyMap_.forEach(function(value, key) {
      var lowerCase = key.toLowerCase();
      if (key != lowerCase) {
        this.remove(key);
        this.setValues(lowerCase, value);
      }
    }, this);
  }
  this.ignoreCase_ = ignoreCase;
};
goog.Uri.QueryData.prototype.extend = function(var_args) {
  for (var i = 0;i < arguments.length;i++) {
    var data = arguments[i];
    goog.structs.forEach(data, function(value, key) {
      this.add(key, value);
    }, this);
  }
};
goog.provide("goog.dom.forms");
goog.require("goog.dom.InputType");
goog.require("goog.dom.TagName");
goog.require("goog.structs.Map");
goog.dom.forms.getFormDataMap = function(form) {
  var map = new goog.structs.Map;
  goog.dom.forms.getFormDataHelper_(form, map, goog.dom.forms.addFormDataToMap_);
  return map;
};
goog.dom.forms.getFormDataString = function(form) {
  var sb = [];
  goog.dom.forms.getFormDataHelper_(form, sb, goog.dom.forms.addFormDataToStringBuffer_);
  return sb.join("&");
};
goog.dom.forms.getFormDataHelper_ = function(form, result, fnAppend) {
  var els = form.elements;
  for (var el, i = 0;el = els[i];i++) {
    if (el.form != form || el.disabled || el.tagName == goog.dom.TagName.FIELDSET) {
      continue;
    }
    var name = el.name;
    switch(el.type.toLowerCase()) {
      case goog.dom.InputType.FILE:
      ;
      case goog.dom.InputType.SUBMIT:
      ;
      case goog.dom.InputType.RESET:
      ;
      case goog.dom.InputType.BUTTON:
        break;
      case goog.dom.InputType.SELECT_MULTIPLE:
        var values = goog.dom.forms.getValue(el);
        if (values != null) {
          for (var value, j = 0;value = values[j];j++) {
            fnAppend(result, name, value);
          }
        }
        break;
      default:
        var value = goog.dom.forms.getValue(el);
        if (value != null) {
          fnAppend(result, name, value);
        }
      ;
    }
  }
  var inputs = form.getElementsByTagName(goog.dom.TagName.INPUT);
  for (var input, i = 0;input = inputs[i];i++) {
    if (input.form == form && input.type.toLowerCase() == goog.dom.InputType.IMAGE) {
      name = input.name;
      fnAppend(result, name, input.value);
      fnAppend(result, name + ".x", "0");
      fnAppend(result, name + ".y", "0");
    }
  }
};
goog.dom.forms.addFormDataToMap_ = function(map, name, value) {
  var array = map.get(name);
  if (!array) {
    array = [];
    map.set(name, array);
  }
  array.push(value);
};
goog.dom.forms.addFormDataToStringBuffer_ = function(sb, name, value) {
  sb.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
};
goog.dom.forms.hasFileInput = function(form) {
  var els = form.elements;
  for (var el, i = 0;el = els[i];i++) {
    if (!el.disabled && el.type && el.type.toLowerCase() == goog.dom.InputType.FILE) {
      return true;
    }
  }
  return false;
};
goog.dom.forms.setDisabled = function(el, disabled) {
  if (el.tagName == goog.dom.TagName.FORM) {
    var els = el.elements;
    for (var i = 0;el = els[i];i++) {
      goog.dom.forms.setDisabled(el, disabled);
    }
  } else {
    if (disabled == true) {
      el.blur();
    }
    el.disabled = disabled;
  }
};
goog.dom.forms.focusAndSelect = function(el) {
  el.focus();
  if (el.select) {
    el.select();
  }
};
goog.dom.forms.hasValue = function(el) {
  var value = goog.dom.forms.getValue(el);
  return !!value;
};
goog.dom.forms.hasValueByName = function(form, name) {
  var value = goog.dom.forms.getValueByName(form, name);
  return !!value;
};
goog.dom.forms.getValue = function(el) {
  var type = el.type;
  if (!goog.isDef(type)) {
    return null;
  }
  switch(type.toLowerCase()) {
    case goog.dom.InputType.CHECKBOX:
    ;
    case goog.dom.InputType.RADIO:
      return goog.dom.forms.getInputChecked_(el);
    case goog.dom.InputType.SELECT_ONE:
      return goog.dom.forms.getSelectSingle_(el);
    case goog.dom.InputType.SELECT_MULTIPLE:
      return goog.dom.forms.getSelectMultiple_(el);
    default:
      return goog.isDef(el.value) ? el.value : null;
  }
};
goog.dom.$F = goog.dom.forms.getValue;
goog.dom.forms.getValueByName = function(form, name) {
  var els = form.elements[name];
  if (els) {
    if (els.type) {
      return goog.dom.forms.getValue(els);
    } else {
      for (var i = 0;i < els.length;i++) {
        var val = goog.dom.forms.getValue(els[i]);
        if (val) {
          return val;
        }
      }
    }
  }
  return null;
};
goog.dom.forms.getInputChecked_ = function(el) {
  return el.checked ? el.value : null;
};
goog.dom.forms.getSelectSingle_ = function(el) {
  var selectedIndex = el.selectedIndex;
  return selectedIndex >= 0 ? el.options[selectedIndex].value : null;
};
goog.dom.forms.getSelectMultiple_ = function(el) {
  var values = [];
  for (var option, i = 0;option = el.options[i];i++) {
    if (option.selected) {
      values.push(option.value);
    }
  }
  return values.length ? values : null;
};
goog.dom.forms.setValue = function(el, opt_value) {
  var type = el.type;
  if (goog.isDef(type)) {
    switch(type.toLowerCase()) {
      case goog.dom.InputType.CHECKBOX:
      ;
      case goog.dom.InputType.RADIO:
        goog.dom.forms.setInputChecked_(el, (opt_value));
        break;
      case goog.dom.InputType.SELECT_ONE:
        goog.dom.forms.setSelectSingle_(el, (opt_value));
        break;
      case goog.dom.InputType.SELECT_MULTIPLE:
        goog.dom.forms.setSelectMultiple_(el, (opt_value));
        break;
      default:
        el.value = goog.isDefAndNotNull(opt_value) ? opt_value : "";
    }
  }
};
goog.dom.forms.setInputChecked_ = function(el, opt_value) {
  el.checked = opt_value;
};
goog.dom.forms.setSelectSingle_ = function(el, opt_value) {
  el.selectedIndex = -1;
  if (goog.isString(opt_value)) {
    for (var option, i = 0;option = el.options[i];i++) {
      if (option.value == opt_value) {
        option.selected = true;
        break;
      }
    }
  }
};
goog.dom.forms.setSelectMultiple_ = function(el, opt_value) {
  if (goog.isString(opt_value)) {
    opt_value = [opt_value];
  }
  for (var option, i = 0;option = el.options[i];i++) {
    option.selected = false;
    if (opt_value) {
      for (var value, j = 0;value = opt_value[j];j++) {
        if (option.value == value) {
          option.selected = true;
        }
      }
    }
  }
};
goog.provide("vsaq.utils");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.dom.classlist");
goog.require("goog.dom.forms");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.string.format");
goog.require("goog.structs");
vsaq.utils.addClickHandler = function(elementId, callback) {
  var element = goog.dom.getElement(elementId);
  if (element) {
    goog.events.listen(element, [goog.events.EventType.CLICK], callback);
    return true;
  }
  return false;
};
vsaq.utils.initClickables = function(handlers) {
  goog.events.listen(goog.dom.getDocument(), [goog.events.EventType.CLICK], function(e) {
    goog.structs.forEach(handlers, function(handler, className) {
      var clickable = goog.dom.getAncestorByClass(e.target, className);
      if (clickable && !goog.dom.classlist.contains(clickable, "maia-button-disabled")) {
        handler(clickable, e);
      }
    });
  });
};
vsaq.utils.createContent = function(format, var_args) {
  var params = goog.array.slice(arguments, 1);
  var encodedParams = goog.array.map(params, encodeURIComponent);
  goog.array.insertAt(encodedParams, format, 0);
  return goog.string.format.apply(null, encodedParams);
};
vsaq.utils.getValue = function(el) {
  var elt = goog.dom.getElement(el);
  if (!elt) {
    return undefined;
  }
  var value = goog.object.get(elt, "value");
  if (!value) {
    return undefined;
  }
  return value;
};
vsaq.utils.initProjectSelector = function() {
  var select = goog.dom.getElement("vsaq_vendor_project_selector");
  if (select) {
    goog.events.listen(select, [goog.events.EventType.CHANGE], function(e) {
      var projectUrl = goog.dom.forms.getValue(e.target);
      if (projectUrl) {
        var currentSubPage = window.location.pathname.match("^/.*/");
        document.location = currentSubPage + projectUrl;
      }
    });
  }
};
vsaq.utils.vsaqonToJson = function(vsaqon) {
  var text = vsaqon.replace(/" \+[ ]*\r?\n[ ]*"/g, "");
  text = text.replace(/\\x/g, "\\u00");
  text = text.replace(/\n[ ]*\/\/[^\r\n]*/g, "");
  return text;
};
goog.provide("goog.structs.LinkedMap");
goog.require("goog.structs.Map");
goog.structs.LinkedMap = function(opt_maxCount, opt_cache, opt_evictionCallback) {
  this.maxCount_ = opt_maxCount || null;
  this.cache_ = !!opt_cache;
  this.evictionCallback_ = opt_evictionCallback;
  this.map_ = new goog.structs.Map;
  this.head_ = new goog.structs.LinkedMap.Node_("", undefined);
  this.head_.next = this.head_.prev = this.head_;
};
goog.structs.LinkedMap.prototype.findAndMoveToTop_ = function(key) {
  var node = this.map_.get(key);
  if (node) {
    if (this.cache_) {
      node.remove();
      this.insert_(node);
    }
  }
  return node;
};
goog.structs.LinkedMap.prototype.get = function(key, opt_val) {
  var node = this.findAndMoveToTop_(key);
  return node ? node.value : opt_val;
};
goog.structs.LinkedMap.prototype.peekValue = function(key, opt_val) {
  var node = this.map_.get(key);
  return node ? node.value : opt_val;
};
goog.structs.LinkedMap.prototype.set = function(key, value) {
  var node = this.findAndMoveToTop_(key);
  if (node) {
    node.value = value;
  } else {
    node = new goog.structs.LinkedMap.Node_(key, value);
    this.map_.set(key, node);
    this.insert_(node);
  }
};
goog.structs.LinkedMap.prototype.peek = function() {
  return this.head_.next.value;
};
goog.structs.LinkedMap.prototype.peekLast = function() {
  return this.head_.prev.value;
};
goog.structs.LinkedMap.prototype.shift = function() {
  return this.popNode_(this.head_.next);
};
goog.structs.LinkedMap.prototype.pop = function() {
  return this.popNode_(this.head_.prev);
};
goog.structs.LinkedMap.prototype.remove = function(key) {
  var node = this.map_.get(key);
  if (node) {
    this.removeNode(node);
    return true;
  }
  return false;
};
goog.structs.LinkedMap.prototype.removeNode = function(node) {
  node.remove();
  this.map_.remove(node.key);
};
goog.structs.LinkedMap.prototype.getCount = function() {
  return this.map_.getCount();
};
goog.structs.LinkedMap.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};
goog.structs.LinkedMap.prototype.setEvictionCallback = function(evictionCallback) {
  this.evictionCallback_ = evictionCallback;
};
goog.structs.LinkedMap.prototype.setMaxCount = function(maxCount) {
  this.maxCount_ = maxCount || null;
  if (this.maxCount_ != null) {
    this.truncate_(this.maxCount_);
  }
};
goog.structs.LinkedMap.prototype.getKeys = function() {
  return this.map(function(val, key) {
    return key;
  });
};
goog.structs.LinkedMap.prototype.getValues = function() {
  return this.map(function(val, key) {
    return val;
  });
};
goog.structs.LinkedMap.prototype.contains = function(value) {
  return this.some(function(el) {
    return el == value;
  });
};
goog.structs.LinkedMap.prototype.containsKey = function(key) {
  return this.map_.containsKey(key);
};
goog.structs.LinkedMap.prototype.clear = function() {
  this.truncate_(0);
};
goog.structs.LinkedMap.prototype.forEach = function(f, opt_obj) {
  for (var n = this.head_.next;n != this.head_;n = n.next) {
    f.call(opt_obj, n.value, n.key, this);
  }
};
goog.structs.LinkedMap.prototype.map = function(f, opt_obj) {
  var rv = [];
  for (var n = this.head_.next;n != this.head_;n = n.next) {
    rv.push(f.call(opt_obj, n.value, n.key, this));
  }
  return rv;
};
goog.structs.LinkedMap.prototype.some = function(f, opt_obj) {
  for (var n = this.head_.next;n != this.head_;n = n.next) {
    if (f.call(opt_obj, n.value, n.key, this)) {
      return true;
    }
  }
  return false;
};
goog.structs.LinkedMap.prototype.every = function(f, opt_obj) {
  for (var n = this.head_.next;n != this.head_;n = n.next) {
    if (!f.call(opt_obj, n.value, n.key, this)) {
      return false;
    }
  }
  return true;
};
goog.structs.LinkedMap.prototype.insert_ = function(node) {
  if (this.cache_) {
    node.next = this.head_.next;
    node.prev = this.head_;
    this.head_.next = node;
    node.next.prev = node;
  } else {
    node.prev = this.head_.prev;
    node.next = this.head_;
    this.head_.prev = node;
    node.prev.next = node;
  }
  if (this.maxCount_ != null) {
    this.truncate_(this.maxCount_);
  }
};
goog.structs.LinkedMap.prototype.truncate_ = function(count) {
  while (this.getCount() > count) {
    var toRemove = this.cache_ ? this.head_.prev : this.head_.next;
    this.removeNode(toRemove);
    if (this.evictionCallback_) {
      this.evictionCallback_(toRemove.key, toRemove.value);
    }
  }
};
goog.structs.LinkedMap.prototype.popNode_ = function(node) {
  if (this.head_ != node) {
    this.removeNode(node);
  }
  return node.value;
};
goog.structs.LinkedMap.Node_ = function(key, value) {
  this.key = key;
  this.value = value;
};
goog.structs.LinkedMap.Node_.prototype.next;
goog.structs.LinkedMap.Node_.prototype.prev;
goog.structs.LinkedMap.Node_.prototype.remove = function() {
  this.prev.next = this.next;
  this.next.prev = this.prev;
  delete this.prev;
  delete this.next;
};
goog.provide("vsaq.questionnaire.items.Item");
goog.provide("vsaq.questionnaire.items.ItemArray");
goog.provide("vsaq.questionnaire.items.ParseError");
goog.provide("vsaq.questionnaire.items.ValueItem");
goog.provide("vsaq.questionnaire.items.factory");
goog.require("goog.debug.Error");
goog.require("goog.dom");
goog.require("goog.dom.classlist");
goog.require("goog.events.EventTarget");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.structs.LinkedMap");
goog.require("vsaq.questionnaire.utils");
vsaq.questionnaire.items.ItemArray;
vsaq.questionnaire.items.ParseError = function(opt_msg) {
  goog.base(this, opt_msg);
};
goog.inherits(vsaq.questionnaire.items.ParseError, goog.debug.Error);
vsaq.questionnaire.items.Item = function(id, conditions) {
  this.propertiesInformation = new goog.structs.LinkedMap;
  this.type = "";
  var propertyInformation = {nameInClass:"type", mandatory:true, unchangeable:true, metadata:true};
  this.addPropertyInformation("type", propertyInformation);
  this.templateItemId = id;
  propertyInformation = {nameInClass:"templateItemId", metadata:true};
  this.addPropertyInformation("id", propertyInformation);
  this.id = goog.string.makeSafe(id) || goog.string.createUniqueString();
  this.conditions = conditions || "";
  propertyInformation = {nameInClass:"conditions", metadata:true};
  this.addPropertyInformation("cond", propertyInformation);
  this.parentItem;
  this.container = goog.dom.createElement("div");
  this.editItemPrefix = null;
  this.editItemSuffix = null;
  this.eventDispatcher = new goog.events.EventTarget;
};
vsaq.questionnaire.items.Item.prototype.render = goog.abstractMethod;
vsaq.questionnaire.items.Item.POSSIBLE_PROPERTY_INFORMATION = {nameInClass:"", mandatory:false, unchangeable:false, metadata:false, defaultValues:{}};
vsaq.questionnaire.items.Item.prototype.addPropertyInformation = function(propertyName, propertyInformation) {
  goog.exportProperty(this, propertyInformation.nameInClass, this[propertyInformation.nameInClass]);
  var newPropertyInformation = {};
  goog.object.forEach(vsaq.questionnaire.items.Item.POSSIBLE_PROPERTY_INFORMATION, function(propertyDefaultValue, propertyKey) {
    if (!propertyInformation.hasOwnProperty(propertyKey)) {
      return;
    }
    var newPropertyValue = propertyInformation[propertyKey];
    if (!(typeof propertyDefaultValue === typeof newPropertyValue)) {
      throw new vsaq.questionnaire.items.ParseError("Found invalid property type in passed property information...");
    }
    newPropertyInformation[propertyKey] = newPropertyValue;
  });
  this.propertiesInformation.set(propertyName, newPropertyInformation);
};
vsaq.questionnaire.items.Item.prototype.getPropertyInformation = function(propertyName, opt_nameInClass) {
  if (opt_nameInClass) {
    var resolvedPropertyInformation = null;
    this.propertiesInformation.some(function(propertyAttributes, propertyKey) {
      if (propertyAttributes.nameInClass == opt_nameInClass) {
        resolvedPropertyInformation = propertyAttributes;
        return true;
      } else {
        return false;
      }
    }, this);
    return resolvedPropertyInformation;
  }
  return this.propertiesInformation.get(propertyName);
};
vsaq.questionnaire.items.Item.prototype.getPropertiesInformation = function() {
  this.propertiesInformation.forEach(function(propertyAttributes) {
    if (!this.hasOwnProperty(propertyAttributes.nameInClass)) {
      throw new vsaq.questionnaire.items.ParseError("Invalid property to be exported detected...");
    }
    propertyAttributes.value = this[propertyAttributes.nameInClass];
    if (typeof propertyAttributes.value === "boolean") {
      var booleanString = propertyAttributes.value.toString();
      var defaultValues = propertyAttributes.defaultValues;
      if (defaultValues) {
        propertyAttributes.value = defaultValues[booleanString];
      }
    } else {
      if (propertyAttributes.defaultValues) {
        var translatedEntry = goog.object.findValue(propertyAttributes.defaultValues, function(value, key) {
          return key === propertyAttributes.value;
        }, this);
        if (typeof translatedEntry !== "undefined") {
          propertyAttributes.value = translatedEntry;
        }
      }
    }
  }, this);
  return this.propertiesInformation;
};
vsaq.questionnaire.items.Item.prototype.evaluateConditions = function(items) {
  var resolver = function(id) {
    if (id == "false") {
      return false;
    }
    var refId = id.replace(/^[\^]?/, "").replace(/(\/yes|\/no|\/value)$/, "");
    var refItem = items[refId];
    if (!refItem) {
      throw new vsaq.questionnaire.items.ParseError("Could not parse condition of item " + this.id);
    }
    if (refItem instanceof vsaq.questionnaire.items.ValueItem && id.indexOf("/value") > -1) {
      return refItem.getValue();
    }
    if (id.charAt(0) == "^") {
      return refItem.isVisible();
    }
    var blockVisible = true;
    if (refItem.parentItem) {
      blockVisible = refItem.parentItem.evaluateConditions(items);
    }
    if (!blockVisible || !refItem.evaluateConditions(items)) {
      return false;
    }
    if (refItem instanceof vsaq.questionnaire.items.ValueItem) {
      return refItem.isChecked(id);
    } else {
      if (typeof refItem.getValue == "function") {
        return refItem.getValue();
      } else {
        throw new vsaq.questionnaire.items.ParseError("Operator illegal in conditions of item " + this.id);
      }
    }
  };
  var cond = (this.conditions);
  return vsaq.questionnaire.utils.evalExpression(cond, resolver);
};
vsaq.questionnaire.items.Item.CHANGED = "vsaq.questionnaire.items.Item.CHANGED";
vsaq.questionnaire.items.Item.HIDDEN = "vsaq.questionnaire.items.Item.HIDDEN";
vsaq.questionnaire.items.Item.SHOWN = "vsaq.questionnaire.items.Item.SHOWN";
vsaq.questionnaire.items.Item.TYPE;
vsaq.questionnaire.items.Item.parse = function(questionStack) {
  if (questionStack.length == 0) {
    throw new vsaq.questionnaire.items.ParseError("No questions in stack.");
  }
  var question = questionStack[0];
  var parser = vsaq.questionnaire.items.factory.parsers[question.type];
  if (parser) {
    var item = (parser(questionStack));
    if (question.className) {
      goog.dom.classlist.add(item.container, question.className);
    }
    if (question["default"] && item instanceof vsaq.questionnaire.items.ValueItem) {
      item.setInternalValue(question["default"]);
    }
    item.type = question.type;
    return item;
  }
  throw new vsaq.questionnaire.items.ParseError("No renderer registered for type " + question.type);
};
vsaq.questionnaire.items.Item.prototype.setVisibility = function(visible) {
  if (this.container) {
    var ev;
    var isVisible = !(this.container.style.display == "none");
    if (isVisible && !visible) {
      this.container.style.display = "none";
      ev = {type:vsaq.questionnaire.items.Item.HIDDEN, source:this};
    } else {
      if (!isVisible && visible) {
        this.container.style.display = "block";
        ev = {type:vsaq.questionnaire.items.Item.SHOWN, source:this};
      }
    }
    if (ev) {
      this.eventDispatcher.dispatchEvent(ev);
    }
  }
};
vsaq.questionnaire.items.Item.prototype.isVisible = function() {
  if (this.container && this.container.style.display == "none") {
    return false;
  } else {
    if (this.parentItem) {
      return this.parentItem.isVisible();
    }
  }
  return true;
};
vsaq.questionnaire.items.Item.prototype.parentItemSet = function(parentItem) {
  this.parentItem = parentItem;
};
vsaq.questionnaire.items.Item.prototype.exportItem = function() {
  var propertiesInformation = this.getPropertiesInformation();
  var exportProperties = new goog.structs.LinkedMap;
  propertiesInformation.forEach(function(propertyAttributes, propertyName) {
    if (!propertyAttributes.value && !(typeof propertyAttributes.value === "boolean")) {
      return;
    }
    exportProperties.set(propertyName, propertyAttributes.value);
  }, this);
  return exportProperties;
};
vsaq.questionnaire.items.ValueItem = function(id, conditions, text, opt_placeholder, opt_inputPattern, opt_inputTitle, opt_isRequired, opt_maxlength) {
  if (!id) {
    throw new vsaq.questionnaire.items.ParseError("ValueItem must have an ID.");
  }
  goog.base(this, id, conditions);
  var propertyInformation = {nameInClass:"id", mandatory:true, metadata:true};
  this.addPropertyInformation("id", propertyInformation);
  this.text = goog.string.makeSafe(text);
  propertyInformation = {nameInClass:"text", mandatory:true};
  this.addPropertyInformation("text", propertyInformation);
  this.placeholder = opt_placeholder;
  this.required = Boolean(opt_isRequired);
  this.inputPattern = opt_inputPattern;
  this.inputTitle = opt_inputTitle;
  this.maxlength = opt_maxlength;
};
goog.inherits(vsaq.questionnaire.items.ValueItem, vsaq.questionnaire.items.Item);
vsaq.questionnaire.items.ValueItem.prototype.answerChanged = function() {
  var changes = {};
  changes[this.id] = this.getValue();
  var ev = {type:vsaq.questionnaire.items.Item.CHANGED, source:this, changes:changes};
  this.eventDispatcher.dispatchEvent(ev);
};
vsaq.questionnaire.items.ValueItem.prototype.isChecked = function(opt_value) {
  return false;
};
vsaq.questionnaire.items.ValueItem.prototype.setValue = function(value) {
  this.setInternalValue(value);
  this.answerChanged();
};
vsaq.questionnaire.items.ValueItem.prototype.setInternalValue = goog.abstractMethod;
vsaq.questionnaire.items.ValueItem.prototype.getValue = goog.abstractMethod;
vsaq.questionnaire.items.ValueItem.prototype.setReadOnly = goog.abstractMethod;
vsaq.questionnaire.items.ValueItem.prototype.isAnswered = goog.abstractMethod;
vsaq.questionnaire.items.factory.parsers = {};
vsaq.questionnaire.items.factory.add = function(type, parser) {
  vsaq.questionnaire.items.factory.parsers[type] = parser;
};
vsaq.questionnaire.items.factory.clear = function() {
  vsaq.questionnaire.items.factory.parsers = {};
};
goog.provide("vsaq.questionnaire.items.ContainerItem");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("vsaq.questionnaire.items.Item");
vsaq.questionnaire.items.ContainerItem = function(id, conditions) {
  goog.base(this, id, conditions);
  this.containerItems = [];
};
goog.inherits(vsaq.questionnaire.items.ContainerItem, vsaq.questionnaire.items.Item);
vsaq.questionnaire.items.ContainerItem.prototype.getContainerItems = function() {
  return this.containerItems;
};
vsaq.questionnaire.items.ContainerItem.prototype.addItem = function(item) {
  this.containerItems.push(item);
  item.parentItem = this;
  this.container.appendChild(item.container);
};
vsaq.questionnaire.items.ContainerItem.prototype.getContainerItemId_ = function(item) {
  var targetSubItemId = null;
  var subItemCounter = 0;
  goog.array.some(this.containerItems, function(subItem) {
    if (subItem.id == item.id) {
      targetSubItemId = subItemCounter;
      return true;
    }
    subItemCounter++;
    return false;
  });
  return targetSubItemId;
};
vsaq.questionnaire.items.ContainerItem.prototype.getSiblingItem = function(item, getLowerSibling) {
  var targetSubItemId = this.getContainerItemId_(item);
  if (targetSubItemId == null) {
    return null;
  }
  var numbercontainerItems_ = this.containerItems.length;
  var siblingItem = null;
  if (getLowerSibling) {
    if (targetSubItemId + 1 < numbercontainerItems_) {
      siblingItem = this.containerItems[targetSubItemId + 1];
    }
  } else {
    if (targetSubItemId - 1 >= 0) {
      siblingItem = this.containerItems[targetSubItemId - 1];
    }
  }
  return siblingItem;
};
vsaq.questionnaire.items.ContainerItem.prototype.insertItemRelativeTo_ = function(newItem, srcItem, insertBelow) {
  var srcSubItemId = this.getContainerItemId_(srcItem);
  if (srcSubItemId == null) {
    return;
  }
  var newItemPosition;
  if (insertBelow) {
    newItemPosition = srcSubItemId + 1;
  } else {
    newItemPosition = srcSubItemId;
  }
  goog.array.insertAt(this.containerItems, newItem, newItemPosition);
  newItem.parentItemSet(this);
};
vsaq.questionnaire.items.ContainerItem.prototype.insertAfter = function(newItem, srcItem) {
  this.insertItemRelativeTo_(newItem, srcItem, true);
  goog.dom.insertSiblingAfter(newItem.container, srcItem.container);
};
vsaq.questionnaire.items.ContainerItem.prototype.insertBefore = function(newItem, srcItem) {
  this.insertItemRelativeTo_(newItem, srcItem, false);
  goog.dom.insertSiblingBefore(newItem.container, srcItem.container);
};
vsaq.questionnaire.items.ContainerItem.prototype.deleteItem = function(item) {
  var targetSubItemId = this.getContainerItemId_(item);
  if (targetSubItemId == null) {
    return;
  }
  goog.array.removeAt(this.containerItems, targetSubItemId);
  goog.dom.removeNode(item.container);
};
goog.provide("goog.structs.Set");
goog.require("goog.structs");
goog.require("goog.structs.Collection");
goog.require("goog.structs.Map");
goog.structs.Set = function(opt_values) {
  this.map_ = new goog.structs.Map;
  if (opt_values) {
    this.addAll(opt_values);
  }
};
goog.structs.Set.getKey_ = function(val) {
  var type = typeof val;
  if (type == "object" && val || type == "function") {
    return "o" + goog.getUid((val));
  } else {
    return type.substr(0, 1) + val;
  }
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
};
goog.structs.Set.prototype.add = function(element) {
  this.map_.set(goog.structs.Set.getKey_(element), element);
};
goog.structs.Set.prototype.addAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0;i < l;i++) {
    this.add(values[i]);
  }
};
goog.structs.Set.prototype.removeAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0;i < l;i++) {
    this.remove(values[i]);
  }
};
goog.structs.Set.prototype.remove = function(element) {
  return this.map_.remove(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear();
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};
goog.structs.Set.prototype.contains = function(element) {
  return this.map_.containsKey(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.containsAll = function(col) {
  return goog.structs.every(col, this.contains, this);
};
goog.structs.Set.prototype.intersection = function(col) {
  var result = new goog.structs.Set;
  var values = goog.structs.getValues(col);
  for (var i = 0;i < values.length;i++) {
    var value = values[i];
    if (this.contains(value)) {
      result.add(value);
    }
  }
  return result;
};
goog.structs.Set.prototype.difference = function(col) {
  var result = this.clone();
  result.removeAll(col);
  return result;
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues();
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this);
};
goog.structs.Set.prototype.equals = function(col) {
  return this.getCount() == goog.structs.getCount(col) && this.isSubsetOf(col);
};
goog.structs.Set.prototype.isSubsetOf = function(col) {
  var colCount = goog.structs.getCount(col);
  if (this.getCount() > colCount) {
    return false;
  }
  if (!(col instanceof goog.structs.Set) && colCount > 5) {
    col = new goog.structs.Set(col);
  }
  return goog.structs.every(this, function(value) {
    return goog.structs.contains(col, value);
  });
};
goog.structs.Set.prototype.__iterator__ = function(opt_keys) {
  return this.map_.__iterator__(false);
};
goog.provide("goog.ui.Tooltip");
goog.provide("goog.ui.Tooltip.CursorTooltipPosition");
goog.provide("goog.ui.Tooltip.ElementTooltipPosition");
goog.provide("goog.ui.Tooltip.State");
goog.require("goog.Timer");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.dom.safe");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.events.FocusHandler");
goog.require("goog.html.legacyconversions");
goog.require("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.require("goog.positioning");
goog.require("goog.positioning.AnchoredPosition");
goog.require("goog.positioning.Corner");
goog.require("goog.positioning.Overflow");
goog.require("goog.positioning.OverflowStatus");
goog.require("goog.positioning.ViewportPosition");
goog.require("goog.structs.Set");
goog.require("goog.style");
goog.require("goog.ui.Popup");
goog.require("goog.ui.PopupBase");
goog.ui.Tooltip = function(opt_el, opt_str, opt_domHelper) {
  this.dom_ = opt_domHelper || (opt_el ? goog.dom.getDomHelper(goog.dom.getElement(opt_el)) : goog.dom.getDomHelper());
  goog.ui.Popup.call(this, this.dom_.createDom(goog.dom.TagName.DIV, {"style":"position:absolute;display:none;"}));
  this.cursorPosition = new goog.math.Coordinate(1, 1);
  this.elements_ = new goog.structs.Set;
  this.tooltipFocusHandler_ = null;
  if (opt_el) {
    this.attach(opt_el);
  }
  if (opt_str != null) {
    this.setText(opt_str);
  }
};
goog.inherits(goog.ui.Tooltip, goog.ui.Popup);
goog.tagUnsealableClass(goog.ui.Tooltip);
goog.ui.Tooltip.activeInstances_ = [];
goog.ui.Tooltip.prototype.activeEl_ = null;
goog.ui.Tooltip.prototype.className = goog.getCssName("goog-tooltip");
goog.ui.Tooltip.prototype.showDelayMs_ = 500;
goog.ui.Tooltip.prototype.showTimer;
goog.ui.Tooltip.prototype.hideDelayMs_ = 0;
goog.ui.Tooltip.prototype.hideTimer;
goog.ui.Tooltip.prototype.anchor;
goog.ui.Tooltip.State = {INACTIVE:0, WAITING_TO_SHOW:1, SHOWING:2, WAITING_TO_HIDE:3, UPDATING:4};
goog.ui.Tooltip.Activation = {CURSOR:0, FOCUS:1};
goog.ui.Tooltip.prototype.seenInteraction_;
goog.ui.Tooltip.prototype.requireInteraction_;
goog.ui.Tooltip.prototype.childTooltip_;
goog.ui.Tooltip.prototype.parentTooltip_;
goog.ui.Tooltip.prototype.getDomHelper = function() {
  return this.dom_;
};
goog.ui.Tooltip.prototype.getChildTooltip = function() {
  return this.childTooltip_;
};
goog.ui.Tooltip.prototype.attach = function(el) {
  el = goog.dom.getElement(el);
  this.elements_.add(el);
  goog.events.listen(el, goog.events.EventType.MOUSEOVER, this.handleMouseOver, false, this);
  goog.events.listen(el, goog.events.EventType.MOUSEOUT, this.handleMouseOutAndBlur, false, this);
  goog.events.listen(el, goog.events.EventType.MOUSEMOVE, this.handleMouseMove, false, this);
  goog.events.listen(el, goog.events.EventType.FOCUS, this.handleFocus, false, this);
  goog.events.listen(el, goog.events.EventType.BLUR, this.handleMouseOutAndBlur, false, this);
};
goog.ui.Tooltip.prototype.detach = function(opt_el) {
  if (opt_el) {
    var el = goog.dom.getElement(opt_el);
    this.detachElement_(el);
    this.elements_.remove(el);
  } else {
    var a = this.elements_.getValues();
    for (var el, i = 0;el = a[i];i++) {
      this.detachElement_(el);
    }
    this.elements_.clear();
  }
};
goog.ui.Tooltip.prototype.detachElement_ = function(el) {
  goog.events.unlisten(el, goog.events.EventType.MOUSEOVER, this.handleMouseOver, false, this);
  goog.events.unlisten(el, goog.events.EventType.MOUSEOUT, this.handleMouseOutAndBlur, false, this);
  goog.events.unlisten(el, goog.events.EventType.MOUSEMOVE, this.handleMouseMove, false, this);
  goog.events.unlisten(el, goog.events.EventType.FOCUS, this.handleFocus, false, this);
  goog.events.unlisten(el, goog.events.EventType.BLUR, this.handleMouseOutAndBlur, false, this);
};
goog.ui.Tooltip.prototype.setShowDelayMs = function(delay) {
  this.showDelayMs_ = delay;
};
goog.ui.Tooltip.prototype.getShowDelayMs = function() {
  return this.showDelayMs_;
};
goog.ui.Tooltip.prototype.setHideDelayMs = function(delay) {
  this.hideDelayMs_ = delay;
};
goog.ui.Tooltip.prototype.getHideDelayMs = function() {
  return this.hideDelayMs_;
};
goog.ui.Tooltip.prototype.setText = function(str) {
  goog.dom.setTextContent(this.getElement(), str);
};
goog.ui.Tooltip.prototype.setHtml = function(str) {
  this.setSafeHtml(goog.html.legacyconversions.safeHtmlFromString(str));
};
goog.ui.Tooltip.prototype.setSafeHtml = function(html) {
  var element = this.getElement();
  if (element) {
    goog.dom.safe.setInnerHtml(element, html);
  }
};
goog.ui.Tooltip.prototype.setElement = function(el) {
  var oldElement = this.getElement();
  if (oldElement) {
    goog.dom.removeNode(oldElement);
  }
  goog.ui.Tooltip.superClass_.setElement.call(this, el);
  if (el) {
    var body = this.dom_.getDocument().body;
    body.insertBefore(el, body.lastChild);
    this.registerContentFocusEvents_();
  } else {
    goog.dispose(this.tooltipFocusHandler_);
    this.tooltipFocusHandler_ = null;
  }
};
goog.ui.Tooltip.prototype.registerContentFocusEvents_ = function() {
  goog.dispose(this.tooltipFocusHandler_);
  this.tooltipFocusHandler_ = new goog.events.FocusHandler(goog.asserts.assert(this.getElement()));
  this.registerDisposable(this.tooltipFocusHandler_);
  goog.events.listen(this.tooltipFocusHandler_, goog.events.FocusHandler.EventType.FOCUSIN, this.clearHideTimer, undefined, this);
  goog.events.listen(this.tooltipFocusHandler_, goog.events.FocusHandler.EventType.FOCUSOUT, this.startHideTimer, undefined, this);
};
goog.ui.Tooltip.prototype.getText = function() {
  return goog.dom.getTextContent(this.getElement());
};
goog.ui.Tooltip.prototype.getHtml = function() {
  return this.getElement().innerHTML;
};
goog.ui.Tooltip.prototype.getState = function() {
  return this.showTimer ? this.isVisible() ? goog.ui.Tooltip.State.UPDATING : goog.ui.Tooltip.State.WAITING_TO_SHOW : this.hideTimer ? goog.ui.Tooltip.State.WAITING_TO_HIDE : this.isVisible() ? goog.ui.Tooltip.State.SHOWING : goog.ui.Tooltip.State.INACTIVE;
};
goog.ui.Tooltip.prototype.setRequireInteraction = function(requireInteraction) {
  this.requireInteraction_ = requireInteraction;
};
goog.ui.Tooltip.prototype.isCoordinateInTooltip = function(coord) {
  if (!this.isVisible()) {
    return false;
  }
  var offset = goog.style.getPageOffset(this.getElement());
  var size = goog.style.getSize(this.getElement());
  return offset.x <= coord.x && coord.x <= offset.x + size.width && offset.y <= coord.y && coord.y <= offset.y + size.height;
};
goog.ui.Tooltip.prototype.onBeforeShow = function() {
  if (!goog.ui.PopupBase.prototype.onBeforeShow.call(this)) {
    return false;
  }
  if (this.anchor) {
    for (var tt, i = 0;tt = goog.ui.Tooltip.activeInstances_[i];i++) {
      if (!goog.dom.contains(tt.getElement(), this.anchor)) {
        tt.setVisible(false);
      }
    }
  }
  goog.array.insert(goog.ui.Tooltip.activeInstances_, this);
  var element = this.getElement();
  element.className = this.className;
  this.clearHideTimer();
  goog.events.listen(element, goog.events.EventType.MOUSEOVER, this.handleTooltipMouseOver, false, this);
  goog.events.listen(element, goog.events.EventType.MOUSEOUT, this.handleTooltipMouseOut, false, this);
  this.clearShowTimer();
  return true;
};
goog.ui.Tooltip.prototype.onHide_ = function() {
  goog.array.remove(goog.ui.Tooltip.activeInstances_, this);
  var element = this.getElement();
  for (var tt, i = 0;tt = goog.ui.Tooltip.activeInstances_[i];i++) {
    if (tt.anchor && goog.dom.contains(element, tt.anchor)) {
      tt.setVisible(false);
    }
  }
  if (this.parentTooltip_) {
    this.parentTooltip_.startHideTimer();
  }
  goog.events.unlisten(element, goog.events.EventType.MOUSEOVER, this.handleTooltipMouseOver, false, this);
  goog.events.unlisten(element, goog.events.EventType.MOUSEOUT, this.handleTooltipMouseOut, false, this);
  this.anchor = undefined;
  if (this.getState() == goog.ui.Tooltip.State.INACTIVE) {
    this.seenInteraction_ = false;
  }
  goog.ui.PopupBase.prototype.onHide_.call(this);
};
goog.ui.Tooltip.prototype.maybeShow = function(el, opt_pos) {
  if (this.anchor == el && this.elements_.contains(this.anchor)) {
    if (this.seenInteraction_ || !this.requireInteraction_) {
      this.setVisible(false);
      if (!this.isVisible()) {
        this.positionAndShow_(el, opt_pos);
      }
    } else {
      this.anchor = undefined;
    }
  }
  this.showTimer = undefined;
};
goog.ui.Tooltip.prototype.getElements = function() {
  return this.elements_;
};
goog.ui.Tooltip.prototype.getActiveElement = function() {
  return this.activeEl_;
};
goog.ui.Tooltip.prototype.setActiveElement = function(activeEl) {
  this.activeEl_ = activeEl;
};
goog.ui.Tooltip.prototype.showForElement = function(el, opt_pos) {
  this.attach(el);
  this.activeEl_ = el;
  this.positionAndShow_(el, opt_pos);
};
goog.ui.Tooltip.prototype.positionAndShow_ = function(el, opt_pos) {
  this.anchor = el;
  this.setPosition(opt_pos || this.getPositioningStrategy(goog.ui.Tooltip.Activation.CURSOR));
  this.setVisible(true);
};
goog.ui.Tooltip.prototype.maybeHide = function(el) {
  this.hideTimer = undefined;
  if (el == this.anchor) {
    var dom = this.getDomHelper();
    var focusedEl = dom.getActiveElement();
    var tooltipContentFocused = focusedEl && this.getElement() && dom.contains(this.getElement(), focusedEl);
    if ((this.activeEl_ == null || this.activeEl_ != this.getElement() && !this.elements_.contains(this.activeEl_)) && !tooltipContentFocused && !this.hasActiveChild()) {
      this.setVisible(false);
    }
  }
};
goog.ui.Tooltip.prototype.hasActiveChild = function() {
  return !!(this.childTooltip_ && this.childTooltip_.activeEl_);
};
goog.ui.Tooltip.prototype.saveCursorPosition_ = function(event) {
  var scroll = this.dom_.getDocumentScroll();
  this.cursorPosition.x = event.clientX + scroll.x;
  this.cursorPosition.y = event.clientY + scroll.y;
};
goog.ui.Tooltip.prototype.handleMouseOver = function(event) {
  var el = this.getAnchorFromElement((event.target));
  this.activeEl_ = el;
  this.clearHideTimer();
  if (el != this.anchor) {
    this.anchor = el;
    this.startShowTimer(el);
    this.checkForParentTooltip_();
    this.saveCursorPosition_(event);
  }
};
goog.ui.Tooltip.prototype.getAnchorFromElement = function(el) {
  try {
    while (el && !this.elements_.contains(el)) {
      el = (el.parentNode);
    }
    return el;
  } catch (e) {
    return null;
  }
};
goog.ui.Tooltip.prototype.handleMouseMove = function(event) {
  this.saveCursorPosition_(event);
  this.seenInteraction_ = true;
};
goog.ui.Tooltip.prototype.handleFocus = function(event) {
  var el = this.getAnchorFromElement((event.target));
  this.activeEl_ = el;
  this.seenInteraction_ = true;
  if (this.anchor != el) {
    this.anchor = el;
    var pos = this.getPositioningStrategy(goog.ui.Tooltip.Activation.FOCUS);
    this.clearHideTimer();
    this.startShowTimer(el, pos);
    this.checkForParentTooltip_();
  }
};
goog.ui.Tooltip.prototype.getPositioningStrategy = function(activationType) {
  if (activationType == goog.ui.Tooltip.Activation.CURSOR) {
    var coord = this.cursorPosition.clone();
    return new goog.ui.Tooltip.CursorTooltipPosition(coord);
  }
  return new goog.ui.Tooltip.ElementTooltipPosition(this.activeEl_);
};
goog.ui.Tooltip.prototype.checkForParentTooltip_ = function() {
  if (this.anchor) {
    for (var tt, i = 0;tt = goog.ui.Tooltip.activeInstances_[i];i++) {
      if (goog.dom.contains(tt.getElement(), this.anchor)) {
        tt.childTooltip_ = this;
        this.parentTooltip_ = tt;
      }
    }
  }
};
goog.ui.Tooltip.prototype.handleMouseOutAndBlur = function(event) {
  var el = this.getAnchorFromElement((event.target));
  var elTo = this.getAnchorFromElement((event.relatedTarget));
  if (el == elTo) {
    return;
  }
  if (el == this.activeEl_) {
    this.activeEl_ = null;
  }
  this.clearShowTimer();
  this.seenInteraction_ = false;
  if (this.isVisible() && (!event.relatedTarget || !goog.dom.contains(this.getElement(), event.relatedTarget))) {
    this.startHideTimer();
  } else {
    this.anchor = undefined;
  }
};
goog.ui.Tooltip.prototype.handleTooltipMouseOver = function(event) {
  var element = this.getElement();
  if (this.activeEl_ != element) {
    this.clearHideTimer();
    this.activeEl_ = element;
  }
};
goog.ui.Tooltip.prototype.handleTooltipMouseOut = function(event) {
  var element = this.getElement();
  if (this.activeEl_ == element && (!event.relatedTarget || !goog.dom.contains(element, event.relatedTarget))) {
    this.activeEl_ = null;
    this.startHideTimer();
  }
};
goog.ui.Tooltip.prototype.startShowTimer = function(el, opt_pos) {
  if (!this.showTimer) {
    this.showTimer = goog.Timer.callOnce(goog.bind(this.maybeShow, this, el, opt_pos), this.showDelayMs_);
  }
};
goog.ui.Tooltip.prototype.clearShowTimer = function() {
  if (this.showTimer) {
    goog.Timer.clear(this.showTimer);
    this.showTimer = undefined;
  }
};
goog.ui.Tooltip.prototype.startHideTimer = function() {
  if (this.getState() == goog.ui.Tooltip.State.SHOWING) {
    this.hideTimer = goog.Timer.callOnce(goog.bind(this.maybeHide, this, this.anchor), this.getHideDelayMs());
  }
};
goog.ui.Tooltip.prototype.clearHideTimer = function() {
  if (this.hideTimer) {
    goog.Timer.clear(this.hideTimer);
    this.hideTimer = undefined;
  }
};
goog.ui.Tooltip.prototype.disposeInternal = function() {
  this.setVisible(false);
  this.clearShowTimer();
  this.detach();
  if (this.getElement()) {
    goog.dom.removeNode(this.getElement());
  }
  this.activeEl_ = null;
  delete this.dom_;
  goog.ui.Tooltip.superClass_.disposeInternal.call(this);
};
goog.ui.Tooltip.CursorTooltipPosition = function(arg1, opt_arg2) {
  goog.positioning.ViewportPosition.call(this, arg1, opt_arg2);
};
goog.inherits(goog.ui.Tooltip.CursorTooltipPosition, goog.positioning.ViewportPosition);
goog.ui.Tooltip.CursorTooltipPosition.prototype.reposition = function(element, popupCorner, opt_margin) {
  var viewportElt = goog.style.getClientViewportElement(element);
  var viewport = goog.style.getVisibleRectForElement(viewportElt);
  var margin = opt_margin ? new goog.math.Box(opt_margin.top + 10, opt_margin.right, opt_margin.bottom, opt_margin.left + 10) : new goog.math.Box(10, 0, 0, 10);
  if (goog.positioning.positionAtCoordinate(this.coordinate, element, goog.positioning.Corner.TOP_START, margin, viewport, goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.FAIL_Y) & goog.positioning.OverflowStatus.FAILED) {
    goog.positioning.positionAtCoordinate(this.coordinate, element, goog.positioning.Corner.TOP_START, margin, viewport, goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.ADJUST_Y);
  }
};
goog.ui.Tooltip.ElementTooltipPosition = function(element) {
  goog.positioning.AnchoredPosition.call(this, element, goog.positioning.Corner.BOTTOM_RIGHT);
};
goog.inherits(goog.ui.Tooltip.ElementTooltipPosition, goog.positioning.AnchoredPosition);
goog.ui.Tooltip.ElementTooltipPosition.prototype.reposition = function(element, popupCorner, opt_margin) {
  var offset = new goog.math.Coordinate(10, 0);
  if (goog.positioning.positionAtAnchor(this.element, this.corner, element, popupCorner, offset, opt_margin, goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.FAIL_Y) & goog.positioning.OverflowStatus.FAILED) {
    goog.positioning.positionAtAnchor(this.element, goog.positioning.Corner.TOP_RIGHT, element, goog.positioning.Corner.BOTTOM_LEFT, offset, opt_margin, goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.ADJUST_Y);
  }
};
goog.provide("goog.debug");
goog.require("goog.array");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.SafeUrl");
goog.require("goog.html.uncheckedconversions");
goog.require("goog.string.Const");
goog.require("goog.structs.Set");
goog.require("goog.userAgent");
goog.define("goog.debug.LOGGING_ENABLED", goog.DEBUG);
goog.define("goog.debug.FORCE_SLOPPY_STACKS", !goog.STRICT_MODE_COMPATIBLE);
goog.debug.catchErrors = function(logFunc, opt_cancel, opt_target) {
  var target = opt_target || goog.global;
  var oldErrorHandler = target.onerror;
  var retVal = !!opt_cancel;
  if (goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("535.3")) {
    retVal = !retVal;
  }
  target.onerror = function(message, url, line, opt_col, opt_error) {
    if (oldErrorHandler) {
      oldErrorHandler(message, url, line, opt_col, opt_error);
    }
    logFunc({message:message, fileName:url, line:line, col:opt_col, error:opt_error});
    return retVal;
  };
};
goog.debug.expose = function(obj, opt_showFn) {
  if (typeof obj == "undefined") {
    return "undefined";
  }
  if (obj == null) {
    return "NULL";
  }
  var str = [];
  for (var x in obj) {
    if (!opt_showFn && goog.isFunction(obj[x])) {
      continue;
    }
    var s = x + " = ";
    try {
      s += obj[x];
    } catch (e) {
      s += "*** " + e + " ***";
    }
    str.push(s);
  }
  return str.join("\n");
};
goog.debug.deepExpose = function(obj, opt_showFn) {
  var str = [];
  var helper = function(obj, space, parentSeen) {
    var nestspace = space + "  ";
    var seen = new goog.structs.Set(parentSeen);
    var indentMultiline = function(str) {
      return str.replace(/\n/g, "\n" + space);
    };
    try {
      if (!goog.isDef(obj)) {
        str.push("undefined");
      } else {
        if (goog.isNull(obj)) {
          str.push("NULL");
        } else {
          if (goog.isString(obj)) {
            str.push('"' + indentMultiline(obj) + '"');
          } else {
            if (goog.isFunction(obj)) {
              str.push(indentMultiline(String(obj)));
            } else {
              if (goog.isObject(obj)) {
                if (seen.contains(obj)) {
                  str.push("*** reference loop detected ***");
                } else {
                  seen.add(obj);
                  str.push("{");
                  for (var x in obj) {
                    if (!opt_showFn && goog.isFunction(obj[x])) {
                      continue;
                    }
                    str.push("\n");
                    str.push(nestspace);
                    str.push(x + " = ");
                    helper(obj[x], nestspace, seen);
                  }
                  str.push("\n" + space + "}");
                }
              } else {
                str.push(obj);
              }
            }
          }
        }
      }
    } catch (e) {
      str.push("*** " + e + " ***");
    }
  };
  helper(obj, "", new goog.structs.Set);
  return str.join("");
};
goog.debug.exposeArray = function(arr) {
  var str = [];
  for (var i = 0;i < arr.length;i++) {
    if (goog.isArray(arr[i])) {
      str.push(goog.debug.exposeArray(arr[i]));
    } else {
      str.push(arr[i]);
    }
  }
  return "[ " + str.join(", ") + " ]";
};
goog.debug.exposeException = function(err, opt_fn) {
  var html = goog.debug.exposeExceptionAsHtml(err, opt_fn);
  return goog.html.SafeHtml.unwrap(html);
};
goog.debug.exposeExceptionAsHtml = function(err, opt_fn) {
  try {
    var e = goog.debug.normalizeErrorObject(err);
    var viewSourceUrl = goog.debug.createViewSourceUrl_(e.fileName);
    var error = goog.html.SafeHtml.concat(goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Message: " + e.message + "\nUrl: "), goog.html.SafeHtml.create("a", {href:viewSourceUrl, target:"_new"}, e.fileName), goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("\nLine: " + e.lineNumber + "\n\nBrowser stack:\n" + e.stack + "-> " + "[end]\n\nJS stack traversal:\n" + goog.debug.getStacktrace(opt_fn) + "-> "));
    return error;
  } catch (e2) {
    return goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Exception trying to expose exception! You win, we lose. " + e2);
  }
};
goog.debug.createViewSourceUrl_ = function(opt_fileName) {
  if (!goog.isDefAndNotNull(opt_fileName)) {
    opt_fileName = "";
  }
  if (!/^https?:\/\//i.test(opt_fileName)) {
    return goog.html.SafeUrl.fromConstant(goog.string.Const.from("sanitizedviewsrc"));
  }
  var sanitizedFileName = goog.html.SafeUrl.sanitize(opt_fileName);
  return goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("view-source scheme plus HTTP/HTTPS URL"), "view-source:" + goog.html.SafeUrl.unwrap(sanitizedFileName));
};
goog.debug.normalizeErrorObject = function(err) {
  var href = goog.getObjectByName("window.location.href");
  if (goog.isString(err)) {
    return {"message":err, "name":"Unknown error", "lineNumber":"Not available", "fileName":href, "stack":"Not available"};
  }
  var lineNumber, fileName;
  var threwError = false;
  try {
    lineNumber = err.lineNumber || err.line || "Not available";
  } catch (e) {
    lineNumber = "Not available";
    threwError = true;
  }
  try {
    fileName = err.fileName || err.filename || err.sourceURL || goog.global["$googDebugFname"] || href;
  } catch (e) {
    fileName = "Not available";
    threwError = true;
  }
  if (threwError || !err.lineNumber || !err.fileName || !err.stack || !err.message || !err.name) {
    return {"message":err.message || "Not available", "name":err.name || "UnknownError", "lineNumber":lineNumber, "fileName":fileName, "stack":err.stack || "Not available"};
  }
  return err;
};
goog.debug.enhanceError = function(err, opt_message) {
  var error;
  if (typeof err == "string") {
    error = Error(err);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, goog.debug.enhanceError);
    }
  } else {
    error = err;
  }
  if (!error.stack) {
    error.stack = goog.debug.getStacktrace(goog.debug.enhanceError);
  }
  if (opt_message) {
    var x = 0;
    while (error["message" + x]) {
      ++x;
    }
    error["message" + x] = String(opt_message);
  }
  return error;
};
goog.debug.getStacktraceSimple = function(opt_depth) {
  if (!goog.debug.FORCE_SLOPPY_STACKS) {
    var stack = goog.debug.getNativeStackTrace_(goog.debug.getStacktraceSimple);
    if (stack) {
      return stack;
    }
  }
  var sb = [];
  var fn = arguments.callee.caller;
  var depth = 0;
  while (fn && (!opt_depth || depth < opt_depth)) {
    sb.push(goog.debug.getFunctionName(fn));
    sb.push("()\n");
    try {
      fn = fn.caller;
    } catch (e) {
      sb.push("[exception trying to get caller]\n");
      break;
    }
    depth++;
    if (depth >= goog.debug.MAX_STACK_DEPTH) {
      sb.push("[...long stack...]");
      break;
    }
  }
  if (opt_depth && depth >= opt_depth) {
    sb.push("[...reached max depth limit...]");
  } else {
    sb.push("[end]");
  }
  return sb.join("");
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getNativeStackTrace_ = function(fn) {
  var tempErr = new Error;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(tempErr, fn);
    return String(tempErr.stack);
  } else {
    try {
      throw tempErr;
    } catch (e) {
      tempErr = e;
    }
    var stack = tempErr.stack;
    if (stack) {
      return String(stack);
    }
  }
  return null;
};
goog.debug.getStacktrace = function(opt_fn) {
  var stack;
  if (!goog.debug.FORCE_SLOPPY_STACKS) {
    var contextFn = opt_fn || goog.debug.getStacktrace;
    stack = goog.debug.getNativeStackTrace_(contextFn);
  }
  if (!stack) {
    stack = goog.debug.getStacktraceHelper_(opt_fn || arguments.callee.caller, []);
  }
  return stack;
};
goog.debug.getStacktraceHelper_ = function(fn, visited) {
  var sb = [];
  if (goog.array.contains(visited, fn)) {
    sb.push("[...circular reference...]");
  } else {
    if (fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
      sb.push(goog.debug.getFunctionName(fn) + "(");
      var args = fn.arguments;
      for (var i = 0;args && i < args.length;i++) {
        if (i > 0) {
          sb.push(", ");
        }
        var argDesc;
        var arg = args[i];
        switch(typeof arg) {
          case "object":
            argDesc = arg ? "object" : "null";
            break;
          case "string":
            argDesc = arg;
            break;
          case "number":
            argDesc = String(arg);
            break;
          case "boolean":
            argDesc = arg ? "true" : "false";
            break;
          case "function":
            argDesc = goog.debug.getFunctionName(arg);
            argDesc = argDesc ? argDesc : "[fn]";
            break;
          case "undefined":
          ;
          default:
            argDesc = typeof arg;
            break;
        }
        if (argDesc.length > 40) {
          argDesc = argDesc.substr(0, 40) + "...";
        }
        sb.push(argDesc);
      }
      visited.push(fn);
      sb.push(")\n");
      try {
        sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited));
      } catch (e) {
        sb.push("[exception trying to get caller]\n");
      }
    } else {
      if (fn) {
        sb.push("[...long stack...]");
      } else {
        sb.push("[end]");
      }
    }
  }
  return sb.join("");
};
goog.debug.setFunctionResolver = function(resolver) {
  goog.debug.fnNameResolver_ = resolver;
};
goog.debug.getFunctionName = function(fn) {
  if (goog.debug.fnNameCache_[fn]) {
    return goog.debug.fnNameCache_[fn];
  }
  if (goog.debug.fnNameResolver_) {
    var name = goog.debug.fnNameResolver_(fn);
    if (name) {
      goog.debug.fnNameCache_[fn] = name;
      return name;
    }
  }
  var functionSource = String(fn);
  if (!goog.debug.fnNameCache_[functionSource]) {
    var matches = /function ([^\(]+)/.exec(functionSource);
    if (matches) {
      var method = matches[1];
      goog.debug.fnNameCache_[functionSource] = method;
    } else {
      goog.debug.fnNameCache_[functionSource] = "[Anonymous]";
    }
  }
  return goog.debug.fnNameCache_[functionSource];
};
goog.debug.makeWhitespaceVisible = function(string) {
  return string.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
goog.debug.runtimeType = function(value) {
  if (value instanceof Function) {
    return value.displayName || value.name || "unknown type name";
  } else {
    if (value instanceof Object) {
      return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value);
    } else {
      return value === null ? "null" : typeof value;
    }
  }
};
goog.debug.fnNameCache_ = {};
goog.debug.fnNameResolver_;
goog.provide("goog.debug.LogManager");
goog.provide("goog.debug.Loggable");
goog.provide("goog.debug.Logger");
goog.provide("goog.debug.Logger.Level");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.debug");
goog.require("goog.debug.LogBuffer");
goog.require("goog.debug.LogRecord");
goog.debug.Loggable;
goog.debug.Logger = function(name) {
  this.name_ = name;
  this.parent_ = null;
  this.level_ = null;
  this.children_ = null;
  this.handlers_ = null;
};
goog.debug.Logger.ROOT_LOGGER_NAME = "";
goog.define("goog.debug.Logger.ENABLE_HIERARCHY", true);
if (!goog.debug.Logger.ENABLE_HIERARCHY) {
  goog.debug.Logger.rootHandlers_ = [];
  goog.debug.Logger.rootLevel_;
}
goog.debug.Logger.Level = function(name, value) {
  this.name = name;
  this.value = value;
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name;
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for (var i = 0, level;level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];i++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level;
    goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level;
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(name) {
  if (!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_();
  }
  return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null;
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(value) {
  if (!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_();
  }
  if (value in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[value];
  }
  for (var i = 0;i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++i) {
    var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
    if (level.value <= value) {
      return level;
    }
  }
  return null;
};
goog.debug.Logger.getLogger = function(name) {
  return goog.debug.LogManager.getLogger(name);
};
goog.debug.Logger.logToProfilers = function(msg) {
  if (goog.global["console"]) {
    if (goog.global["console"]["timeStamp"]) {
      goog.global["console"]["timeStamp"](msg);
    } else {
      if (goog.global["console"]["markTimeline"]) {
        goog.global["console"]["markTimeline"](msg);
      }
    }
  }
  if (goog.global["msWriteProfilerMark"]) {
    goog.global["msWriteProfilerMark"](msg);
  }
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_;
};
goog.debug.Logger.prototype.addHandler = function(handler) {
  if (goog.debug.LOGGING_ENABLED) {
    if (goog.debug.Logger.ENABLE_HIERARCHY) {
      if (!this.handlers_) {
        this.handlers_ = [];
      }
      this.handlers_.push(handler);
    } else {
      goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when " + "goog.debug.Logger.ENABLE_HIERARCHY is false.");
      goog.debug.Logger.rootHandlers_.push(handler);
    }
  }
};
goog.debug.Logger.prototype.removeHandler = function(handler) {
  if (goog.debug.LOGGING_ENABLED) {
    var handlers = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
    return !!handlers && goog.array.remove(handlers, handler);
  } else {
    return false;
  }
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_;
};
goog.debug.Logger.prototype.getChildren = function() {
  if (!this.children_) {
    this.children_ = {};
  }
  return this.children_;
};
goog.debug.Logger.prototype.setLevel = function(level) {
  if (goog.debug.LOGGING_ENABLED) {
    if (goog.debug.Logger.ENABLE_HIERARCHY) {
      this.level_ = level;
    } else {
      goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when " + "goog.debug.Logger.ENABLE_HIERARCHY is false.");
      goog.debug.Logger.rootLevel_ = level;
    }
  }
};
goog.debug.Logger.prototype.getLevel = function() {
  return goog.debug.LOGGING_ENABLED ? this.level_ : goog.debug.Logger.Level.OFF;
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if (!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF;
  }
  if (!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_;
  }
  if (this.level_) {
    return this.level_;
  }
  if (this.parent_) {
    return this.parent_.getEffectiveLevel();
  }
  goog.asserts.fail("Root logger has no level set.");
  return null;
};
goog.debug.Logger.prototype.isLoggable = function(level) {
  return goog.debug.LOGGING_ENABLED && level.value >= this.getEffectiveLevel().value;
};
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED && this.isLoggable(level)) {
    if (goog.isFunction(msg)) {
      msg = msg();
    }
    this.doLogRecord_(this.getLogRecord(level, msg, opt_exception));
  }
};
goog.debug.Logger.prototype.getLogRecord = function(level, msg, opt_exception) {
  if (goog.debug.LogBuffer.isBufferingEnabled()) {
    var logRecord = goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_)
  } else {
    logRecord = new goog.debug.LogRecord(level, String(msg), this.name_);
  }
  if (opt_exception) {
    logRecord.setException(opt_exception);
  }
  return logRecord;
};
goog.debug.Logger.prototype.shout = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.SHOUT, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.warning = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.INFO, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.config = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.fine = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINE, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.finer = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINER, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.finest = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINEST, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.logRecord = function(logRecord) {
  if (goog.debug.LOGGING_ENABLED && this.isLoggable(logRecord.getLevel())) {
    this.doLogRecord_(logRecord);
  }
};
goog.debug.Logger.prototype.doLogRecord_ = function(logRecord) {
  goog.debug.Logger.logToProfilers("log:" + logRecord.getMessage());
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var target = this;
    while (target) {
      target.callPublish_(logRecord);
      target = target.getParent();
    }
  } else {
    for (var i = 0, handler;handler = goog.debug.Logger.rootHandlers_[i++];) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
  if (this.handlers_) {
    for (var i = 0, handler;handler = this.handlers_[i];i++) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(parent) {
  this.parent_ = parent;
};
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
  this.getChildren()[name] = logger;
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  if (!goog.debug.LogManager.rootLogger_) {
    goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(goog.debug.Logger.ROOT_LOGGER_NAME);
    goog.debug.LogManager.loggers_[goog.debug.Logger.ROOT_LOGGER_NAME] = goog.debug.LogManager.rootLogger_;
    goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG);
  }
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_;
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return (goog.debug.LogManager.rootLogger_);
};
goog.debug.LogManager.getLogger = function(name) {
  goog.debug.LogManager.initialize();
  var ret = goog.debug.LogManager.loggers_[name];
  return ret || goog.debug.LogManager.createLogger_(name);
};
goog.debug.LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    var logger = opt_logger || goog.debug.LogManager.getRoot();
    logger.severe("Error: " + info.message + " (" + info.fileName + " @ Line: " + info.line + ")");
  };
};
goog.debug.LogManager.createLogger_ = function(name) {
  var logger = new goog.debug.Logger(name);
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf(".");
    var parentName = name.substr(0, lastDotIndex);
    var leafName = name.substr(lastDotIndex + 1);
    var parentLogger = goog.debug.LogManager.getLogger(parentName);
    parentLogger.addChild_(leafName, logger);
    logger.setParent_(parentLogger);
  }
  goog.debug.LogManager.loggers_[name] = logger;
  return logger;
};
goog.provide("goog.log");
goog.provide("goog.log.Level");
goog.provide("goog.log.LogRecord");
goog.provide("goog.log.Logger");
goog.require("goog.debug");
goog.require("goog.debug.LogManager");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger");
goog.define("goog.log.ENABLED", goog.debug.LOGGING_ENABLED);
goog.log.ROOT_LOGGER_NAME = goog.debug.Logger.ROOT_LOGGER_NAME;
goog.log.Logger = goog.debug.Logger;
goog.log.Level = goog.debug.Logger.Level;
goog.log.LogRecord = goog.debug.LogRecord;
goog.log.getLogger = function(name, opt_level) {
  if (goog.log.ENABLED) {
    var logger = goog.debug.LogManager.getLogger(name);
    if (opt_level && logger) {
      logger.setLevel(opt_level);
    }
    return logger;
  } else {
    return null;
  }
};
goog.log.addHandler = function(logger, handler) {
  if (goog.log.ENABLED && logger) {
    logger.addHandler(handler);
  }
};
goog.log.removeHandler = function(logger, handler) {
  if (goog.log.ENABLED && logger) {
    return logger.removeHandler(handler);
  } else {
    return false;
  }
};
goog.log.log = function(logger, level, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.log(level, msg, opt_exception);
  }
};
goog.log.error = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.severe(msg, opt_exception);
  }
};
goog.log.warning = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.warning(msg, opt_exception);
  }
};
goog.log.info = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.info(msg, opt_exception);
  }
};
goog.log.fine = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.fine(msg, opt_exception);
  }
};
goog.provide("goog.debug.Formatter");
goog.provide("goog.debug.HtmlFormatter");
goog.provide("goog.debug.TextFormatter");
goog.require("goog.debug");
goog.require("goog.debug.Logger");
goog.require("goog.debug.RelativeTimeProvider");
goog.require("goog.html.SafeHtml");
goog.debug.Formatter = function(opt_prefix) {
  this.prefix_ = opt_prefix || "";
  this.startTimeProvider_ = goog.debug.RelativeTimeProvider.getDefaultInstance();
};
goog.debug.Formatter.prototype.appendNewline = true;
goog.debug.Formatter.prototype.showAbsoluteTime = true;
goog.debug.Formatter.prototype.showRelativeTime = true;
goog.debug.Formatter.prototype.showLoggerName = true;
goog.debug.Formatter.prototype.showExceptionText = false;
goog.debug.Formatter.prototype.showSeverityLevel = false;
goog.debug.Formatter.prototype.formatRecord = goog.abstractMethod;
goog.debug.Formatter.prototype.formatRecordAsHtml = goog.abstractMethod;
goog.debug.Formatter.prototype.setStartTimeProvider = function(provider) {
  this.startTimeProvider_ = provider;
};
goog.debug.Formatter.prototype.getStartTimeProvider = function() {
  return this.startTimeProvider_;
};
goog.debug.Formatter.prototype.resetRelativeTimeStart = function() {
  this.startTimeProvider_.reset();
};
goog.debug.Formatter.getDateTimeStamp_ = function(logRecord) {
  var time = new Date(logRecord.getMillis());
  return goog.debug.Formatter.getTwoDigitString_(time.getFullYear() - 2E3) + goog.debug.Formatter.getTwoDigitString_(time.getMonth() + 1) + goog.debug.Formatter.getTwoDigitString_(time.getDate()) + " " + goog.debug.Formatter.getTwoDigitString_(time.getHours()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getMinutes()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getSeconds()) + "." + goog.debug.Formatter.getTwoDigitString_(Math.floor(time.getMilliseconds() / 10));
};
goog.debug.Formatter.getTwoDigitString_ = function(n) {
  if (n < 10) {
    return "0" + n;
  }
  return String(n);
};
goog.debug.Formatter.getRelativeTime_ = function(logRecord, relativeTimeStart) {
  var ms = logRecord.getMillis() - relativeTimeStart;
  var sec = ms / 1E3;
  var str = sec.toFixed(3);
  var spacesToPrepend = 0;
  if (sec < 1) {
    spacesToPrepend = 2;
  } else {
    while (sec < 100) {
      spacesToPrepend++;
      sec *= 10;
    }
  }
  while (spacesToPrepend-- > 0) {
    str = " " + str;
  }
  return str;
};
goog.debug.HtmlFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.HtmlFormatter, goog.debug.Formatter);
goog.debug.HtmlFormatter.prototype.showExceptionText = true;
goog.debug.HtmlFormatter.prototype.formatRecord = function(logRecord) {
  if (!logRecord) {
    return "";
  }
  return this.formatRecordAsHtml(logRecord).getTypedStringValue();
};
goog.debug.HtmlFormatter.prototype.formatRecordAsHtml = function(logRecord) {
  if (!logRecord) {
    return goog.html.SafeHtml.EMPTY;
  }
  var className;
  switch(logRecord.getLevel().value) {
    case goog.debug.Logger.Level.SHOUT.value:
      className = "dbg-sh";
      break;
    case goog.debug.Logger.Level.SEVERE.value:
      className = "dbg-sev";
      break;
    case goog.debug.Logger.Level.WARNING.value:
      className = "dbg-w";
      break;
    case goog.debug.Logger.Level.INFO.value:
      className = "dbg-i";
      break;
    case goog.debug.Logger.Level.FINE.value:
    ;
    default:
      className = "dbg-f";
      break;
  }
  var sb = [];
  sb.push(this.prefix_, " ");
  if (this.showAbsoluteTime) {
    sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  }
  if (this.showRelativeTime) {
    sb.push("[", goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get()), "s] ");
  }
  if (this.showLoggerName) {
    sb.push("[", logRecord.getLoggerName(), "] ");
  }
  if (this.showSeverityLevel) {
    sb.push("[", logRecord.getLevel().name, "] ");
  }
  var fullPrefixHtml = goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(sb.join(""));
  var exceptionHtml = goog.html.SafeHtml.EMPTY;
  if (this.showExceptionText && logRecord.getException()) {
    exceptionHtml = goog.html.SafeHtml.concat(goog.html.SafeHtml.create("br"), goog.debug.exposeExceptionAsHtml(logRecord.getException()));
  }
  var logRecordHtml = goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(logRecord.getMessage());
  var recordAndExceptionHtml = goog.html.SafeHtml.create("span", {"class":className}, goog.html.SafeHtml.concat(logRecordHtml, exceptionHtml));
  var html;
  if (this.appendNewline) {
    html = goog.html.SafeHtml.concat(fullPrefixHtml, recordAndExceptionHtml, goog.html.SafeHtml.create("br"));
  } else {
    html = goog.html.SafeHtml.concat(fullPrefixHtml, recordAndExceptionHtml);
  }
  return html;
};
goog.debug.TextFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.TextFormatter, goog.debug.Formatter);
goog.debug.TextFormatter.prototype.formatRecord = function(logRecord) {
  var sb = [];
  sb.push(this.prefix_, " ");
  if (this.showAbsoluteTime) {
    sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  }
  if (this.showRelativeTime) {
    sb.push("[", goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get()), "s] ");
  }
  if (this.showLoggerName) {
    sb.push("[", logRecord.getLoggerName(), "] ");
  }
  if (this.showSeverityLevel) {
    sb.push("[", logRecord.getLevel().name, "] ");
  }
  sb.push(logRecord.getMessage());
  if (this.showExceptionText) {
    var exception = logRecord.getException();
    if (exception) {
      var exceptionText = exception instanceof Error ? exception.message : exception.toString();
      sb.push("\n", exceptionText);
    }
  }
  if (this.appendNewline) {
    sb.push("\n");
  }
  return sb.join("");
};
goog.debug.TextFormatter.prototype.formatRecordAsHtml = function(logRecord) {
  return goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(goog.debug.TextFormatter.prototype.formatRecord(logRecord));
};
goog.provide("goog.debug.Console");
goog.require("goog.debug.LogManager");
goog.require("goog.debug.Logger");
goog.require("goog.debug.TextFormatter");
goog.debug.Console = function() {
  this.publishHandler_ = goog.bind(this.addLogRecord, this);
  this.formatter_ = new goog.debug.TextFormatter;
  this.formatter_.showAbsoluteTime = false;
  this.formatter_.showExceptionText = false;
  this.formatter_.appendNewline = false;
  this.isCapturing_ = false;
  this.logBuffer_ = "";
  this.filteredLoggers_ = {};
};
goog.debug.Console.prototype.getFormatter = function() {
  return this.formatter_;
};
goog.debug.Console.prototype.setCapturing = function(capturing) {
  if (capturing == this.isCapturing_) {
    return;
  }
  var rootLogger = goog.debug.LogManager.getRoot();
  if (capturing) {
    rootLogger.addHandler(this.publishHandler_);
  } else {
    rootLogger.removeHandler(this.publishHandler_);
    this.logBuffer = "";
  }
  this.isCapturing_ = capturing;
};
goog.debug.Console.prototype.addLogRecord = function(logRecord) {
  if (this.filteredLoggers_[logRecord.getLoggerName()]) {
    return;
  }
  var record = this.formatter_.formatRecord(logRecord);
  var console = goog.debug.Console.console_;
  if (console) {
    switch(logRecord.getLevel()) {
      case goog.debug.Logger.Level.SHOUT:
        goog.debug.Console.logToConsole_(console, "info", record);
        break;
      case goog.debug.Logger.Level.SEVERE:
        goog.debug.Console.logToConsole_(console, "error", record);
        break;
      case goog.debug.Logger.Level.WARNING:
        goog.debug.Console.logToConsole_(console, "warn", record);
        break;
      default:
        goog.debug.Console.logToConsole_(console, "debug", record);
        break;
    }
  } else {
    this.logBuffer_ += record;
  }
};
goog.debug.Console.prototype.addFilter = function(loggerName) {
  this.filteredLoggers_[loggerName] = true;
};
goog.debug.Console.prototype.removeFilter = function(loggerName) {
  delete this.filteredLoggers_[loggerName];
};
goog.debug.Console.instance = null;
goog.debug.Console.console_ = goog.global["console"];
goog.debug.Console.setConsole = function(console) {
  goog.debug.Console.console_ = console;
};
goog.debug.Console.autoInstall = function() {
  if (!goog.debug.Console.instance) {
    goog.debug.Console.instance = new goog.debug.Console;
  }
  if (goog.global.location && goog.global.location.href.indexOf("Debug=true") != -1) {
    goog.debug.Console.instance.setCapturing(true);
  }
};
goog.debug.Console.show = function() {
  alert(goog.debug.Console.instance.logBuffer_);
};
goog.debug.Console.logToConsole_ = function(console, fnName, record) {
  if (console[fnName]) {
    console[fnName](record);
  } else {
    console.log(record);
  }
};
goog.provide("goog.net.IframeIo");
goog.provide("goog.net.IframeIo.IncrementalDataEvent");
goog.require("goog.Timer");
goog.require("goog.Uri");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.debug");
goog.require("goog.dom");
goog.require("goog.dom.InputType");
goog.require("goog.dom.TagName");
goog.require("goog.dom.safe");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.html.uncheckedconversions");
goog.require("goog.json");
goog.require("goog.log");
goog.require("goog.log.Level");
goog.require("goog.net.ErrorCode");
goog.require("goog.net.EventType");
goog.require("goog.reflect");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.require("goog.structs");
goog.require("goog.userAgent");
goog.net.IframeIo = function() {
  goog.net.IframeIo.base(this, "constructor");
  this.name_ = goog.net.IframeIo.getNextName_();
  this.iframesForDisposal_ = [];
  goog.net.IframeIo.instances_[this.name_] = this;
};
goog.inherits(goog.net.IframeIo, goog.events.EventTarget);
goog.net.IframeIo.instances_ = {};
goog.net.IframeIo.FRAME_NAME_PREFIX = "closure_frame";
goog.net.IframeIo.INNER_FRAME_SUFFIX = "_inner";
goog.net.IframeIo.IFRAME_DISPOSE_DELAY_MS = 2E3;
goog.net.IframeIo.counter_ = 0;
goog.net.IframeIo.form_;
goog.net.IframeIo.send = function(uri, opt_callback, opt_method, opt_noCache, opt_data) {
  var io = new goog.net.IframeIo;
  goog.events.listen(io, goog.net.EventType.READY, io.dispose, false, io);
  if (opt_callback) {
    goog.events.listen(io, goog.net.EventType.COMPLETE, opt_callback);
  }
  io.send(uri, opt_method, opt_noCache, opt_data);
};
goog.net.IframeIo.getIframeByName = function(fname) {
  return window.frames[fname];
};
goog.net.IframeIo.getInstanceByName = function(fname) {
  return goog.net.IframeIo.instances_[fname];
};
goog.net.IframeIo.handleIncrementalData = function(win, data) {
  var iframeName = goog.string.endsWith(win.name, goog.net.IframeIo.INNER_FRAME_SUFFIX) ? win.parent.name : win.name;
  var iframeIoName = iframeName.substring(0, iframeName.lastIndexOf("_"));
  var iframeIo = goog.net.IframeIo.getInstanceByName(iframeIoName);
  if (iframeIo && iframeName == iframeIo.iframeName_) {
    iframeIo.handleIncrementalData_(data);
  } else {
    var logger = goog.log.getLogger("goog.net.IframeIo");
    goog.log.info(logger, "Incremental iframe data routed for unknown iframe");
  }
};
goog.net.IframeIo.getNextName_ = function() {
  return goog.net.IframeIo.FRAME_NAME_PREFIX + goog.net.IframeIo.counter_++;
};
goog.net.IframeIo.getForm_ = function() {
  if (!goog.net.IframeIo.form_) {
    goog.net.IframeIo.form_ = (goog.dom.createDom(goog.dom.TagName.FORM));
    goog.net.IframeIo.form_.acceptCharset = "utf-8";
    var s = goog.net.IframeIo.form_.style;
    s.position = "absolute";
    s.visibility = "hidden";
    s.top = s.left = "-10px";
    s.width = s.height = "10px";
    s.overflow = "hidden";
    goog.dom.getDocument().body.appendChild(goog.net.IframeIo.form_);
  }
  return goog.net.IframeIo.form_;
};
goog.net.IframeIo.addFormInputs_ = function(form, data) {
  var helper = goog.dom.getDomHelper(form);
  goog.structs.forEach(data, function(value, key) {
    if (!goog.isArray(value)) {
      value = [value];
    }
    goog.array.forEach(value, function(value) {
      var inp = helper.createDom(goog.dom.TagName.INPUT, {"type":goog.dom.InputType.HIDDEN, "name":key, "value":value});
      form.appendChild(inp);
    });
  });
};
goog.net.IframeIo.useIeReadyStateCodePath_ = function() {
  return goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("11");
};
goog.net.IframeIo.prototype.logger_ = goog.log.getLogger("goog.net.IframeIo");
goog.net.IframeIo.prototype.form_ = null;
goog.net.IframeIo.prototype.iframe_ = null;
goog.net.IframeIo.prototype.iframeName_ = null;
goog.net.IframeIo.prototype.nextIframeId_ = 0;
goog.net.IframeIo.prototype.active_ = false;
goog.net.IframeIo.prototype.complete_ = false;
goog.net.IframeIo.prototype.success_ = false;
goog.net.IframeIo.prototype.lastUri_ = null;
goog.net.IframeIo.prototype.lastContent_ = null;
goog.net.IframeIo.prototype.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
goog.net.IframeIo.prototype.firefoxSilentErrorTimeout_ = null;
goog.net.IframeIo.prototype.iframeDisposalTimer_ = null;
goog.net.IframeIo.prototype.errorHandled_;
goog.net.IframeIo.prototype.ignoreResponse_ = false;
goog.net.IframeIo.prototype.errorChecker_;
goog.net.IframeIo.prototype.lastCustomError_;
goog.net.IframeIo.prototype.lastContentHtml_;
goog.net.IframeIo.prototype.send = function(uri, opt_method, opt_noCache, opt_data) {
  if (this.active_) {
    throw Error("[goog.net.IframeIo] Unable to send, already active.");
  }
  var uriObj = new goog.Uri(uri);
  this.lastUri_ = uriObj;
  var method = opt_method ? opt_method.toUpperCase() : "GET";
  if (opt_noCache) {
    uriObj.makeUnique();
  }
  goog.log.info(this.logger_, "Sending iframe request: " + uriObj + " [" + method + "]");
  this.form_ = goog.net.IframeIo.getForm_();
  if (method == "GET") {
    goog.net.IframeIo.addFormInputs_(this.form_, uriObj.getQueryData());
  }
  if (opt_data) {
    goog.net.IframeIo.addFormInputs_(this.form_, opt_data);
  }
  this.form_.action = uriObj.toString();
  this.form_.method = method;
  this.sendFormInternal_();
  this.clearForm_();
};
goog.net.IframeIo.prototype.sendFromForm = function(form, opt_uri, opt_noCache) {
  if (this.active_) {
    throw Error("[goog.net.IframeIo] Unable to send, already active.");
  }
  var uri = new goog.Uri(opt_uri || form.action);
  if (opt_noCache) {
    uri.makeUnique();
  }
  goog.log.info(this.logger_, "Sending iframe request from form: " + uri);
  this.lastUri_ = uri;
  this.form_ = form;
  this.form_.action = uri.toString();
  this.sendFormInternal_();
};
goog.net.IframeIo.prototype.abort = function(opt_failureCode) {
  if (this.active_) {
    goog.log.info(this.logger_, "Request aborted");
    var requestIframe = this.getRequestIframe();
    goog.asserts.assert(requestIframe);
    goog.events.removeAll(requestIframe);
    this.complete_ = false;
    this.active_ = false;
    this.success_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
    this.dispatchEvent(goog.net.EventType.ABORT);
    this.makeReady_();
  }
};
goog.net.IframeIo.prototype.disposeInternal = function() {
  goog.log.fine(this.logger_, "Disposing iframeIo instance");
  if (this.active_) {
    goog.log.fine(this.logger_, "Aborting active request");
    this.abort();
  }
  goog.net.IframeIo.superClass_.disposeInternal.call(this);
  if (this.iframe_) {
    this.scheduleIframeDisposal_();
  }
  this.disposeForm_();
  delete this.errorChecker_;
  this.form_ = null;
  this.lastCustomError_ = this.lastContent_ = this.lastContentHtml_ = null;
  this.lastUri_ = null;
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  delete goog.net.IframeIo.instances_[this.name_];
};
goog.net.IframeIo.prototype.isComplete = function() {
  return this.complete_;
};
goog.net.IframeIo.prototype.isSuccess = function() {
  return this.success_;
};
goog.net.IframeIo.prototype.isActive = function() {
  return this.active_;
};
goog.net.IframeIo.prototype.getResponseText = function() {
  return this.lastContent_;
};
goog.net.IframeIo.prototype.getResponseHtml = function() {
  return this.lastContentHtml_;
};
goog.net.IframeIo.prototype.getResponseJson = function() {
  return goog.json.parse(this.lastContent_);
};
goog.net.IframeIo.prototype.getResponseXml = function() {
  if (!this.iframe_) {
    return null;
  }
  return this.getContentDocument_();
};
goog.net.IframeIo.prototype.getLastUri = function() {
  return this.lastUri_;
};
goog.net.IframeIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
};
goog.net.IframeIo.prototype.getLastError = function() {
  return goog.net.ErrorCode.getDebugMessage(this.lastErrorCode_);
};
goog.net.IframeIo.prototype.getLastCustomError = function() {
  return this.lastCustomError_;
};
goog.net.IframeIo.prototype.setErrorChecker = function(fn) {
  this.errorChecker_ = fn;
};
goog.net.IframeIo.prototype.getErrorChecker = function() {
  return this.errorChecker_;
};
goog.net.IframeIo.prototype.isIgnoringResponse = function() {
  return this.ignoreResponse_;
};
goog.net.IframeIo.prototype.setIgnoreResponse = function(ignore) {
  this.ignoreResponse_ = ignore;
};
goog.net.IframeIo.prototype.sendFormInternal_ = function() {
  this.active_ = true;
  this.complete_ = false;
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.createIframe_();
  if (goog.net.IframeIo.useIeReadyStateCodePath_()) {
    this.form_.target = this.iframeName_ || "";
    this.appendIframe_();
    if (!this.ignoreResponse_) {
      goog.events.listen(this.iframe_, goog.events.EventType.READYSTATECHANGE, this.onIeReadyStateChange_, false, this);
    }
    try {
      this.errorHandled_ = false;
      this.form_.submit();
    } catch (e) {
      if (!this.ignoreResponse_) {
        goog.events.unlisten(this.iframe_, goog.events.EventType.READYSTATECHANGE, this.onIeReadyStateChange_, false, this);
      }
      this.handleError_(goog.net.ErrorCode.ACCESS_DENIED);
    }
  } else {
    goog.log.fine(this.logger_, "Setting up iframes and cloning form");
    this.appendIframe_();
    var innerFrameName = this.iframeName_ + goog.net.IframeIo.INNER_FRAME_SUFFIX;
    var doc = goog.dom.getFrameContentDocument(this.iframe_);
    var html;
    if (document.baseURI) {
      html = goog.net.IframeIo.createIframeHtmlWithBaseUri_(innerFrameName);
    } else {
      html = goog.net.IframeIo.createIframeHtml_(innerFrameName);
    }
    if (goog.userAgent.OPERA && !goog.userAgent.WEBKIT) {
      goog.dom.safe.setInnerHtml(doc.documentElement, html);
    } else {
      goog.dom.safe.documentWrite(doc, html);
    }
    if (!this.ignoreResponse_) {
      goog.events.listen(doc.getElementById(innerFrameName), goog.events.EventType.LOAD, this.onIframeLoaded_, false, this);
    }
    var textareas = this.form_.getElementsByTagName(goog.dom.TagName.TEXTAREA);
    for (var i = 0, n = textareas.length;i < n;i++) {
      var value = textareas[i].value;
      if (goog.dom.getRawTextContent(textareas[i]) != value) {
        goog.dom.setTextContent(textareas[i], value);
        textareas[i].value = value;
      }
    }
    var clone = doc.importNode(this.form_, true);
    clone.target = innerFrameName;
    clone.action = this.form_.action;
    doc.body.appendChild(clone);
    var selects = this.form_.getElementsByTagName(goog.dom.TagName.SELECT);
    var clones = clone.getElementsByTagName(goog.dom.TagName.SELECT);
    for (var i = 0, n = selects.length;i < n;i++) {
      var selectsOptions = selects[i].getElementsByTagName(goog.dom.TagName.OPTION);
      var clonesOptions = clones[i].getElementsByTagName(goog.dom.TagName.OPTION);
      for (var j = 0, m = selectsOptions.length;j < m;j++) {
        clonesOptions[j].selected = selectsOptions[j].selected;
      }
    }
    var inputs = this.form_.getElementsByTagName(goog.dom.TagName.INPUT);
    var inputClones = clone.getElementsByTagName(goog.dom.TagName.INPUT);
    for (var i = 0, n = inputs.length;i < n;i++) {
      if (inputs[i].type == goog.dom.InputType.FILE) {
        if (inputs[i].value != inputClones[i].value) {
          goog.log.fine(this.logger_, "File input value not cloned properly.  Will " + "submit using original form.");
          this.form_.target = innerFrameName;
          clone = this.form_;
          break;
        }
      }
    }
    goog.log.fine(this.logger_, "Submitting form");
    try {
      this.errorHandled_ = false;
      clone.submit();
      doc.close();
      if (goog.userAgent.GECKO) {
        this.firefoxSilentErrorTimeout_ = goog.Timer.callOnce(this.testForFirefoxSilentError_, 250, this);
      }
    } catch (e) {
      goog.log.error(this.logger_, "Error when submitting form: " + goog.debug.exposeException(e));
      if (!this.ignoreResponse_) {
        goog.events.unlisten(doc.getElementById(innerFrameName), goog.events.EventType.LOAD, this.onIframeLoaded_, false, this);
      }
      doc.close();
      this.handleError_(goog.net.ErrorCode.FILE_NOT_FOUND);
    }
  }
};
goog.net.IframeIo.createIframeHtml_ = function(innerFrameName) {
  var innerFrameNameEscaped = goog.string.htmlEscape(innerFrameName);
  return goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Short HTML snippet, input escaped, for performance"), '<body><iframe id="' + innerFrameNameEscaped + '" name="' + innerFrameNameEscaped + '"></iframe>');
};
goog.net.IframeIo.createIframeHtmlWithBaseUri_ = function(innerFrameName) {
  var innerFrameNameEscaped = goog.string.htmlEscape(innerFrameName);
  return goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Short HTML snippet, input escaped, safe URL, for performance"), '<head><base href="' + goog.string.htmlEscape((document.baseURI)) + '"></head>' + '<body><iframe id="' + innerFrameNameEscaped + '" name="' + innerFrameNameEscaped + '"></iframe>');
};
goog.net.IframeIo.prototype.onIeReadyStateChange_ = function(e) {
  if (this.iframe_.readyState == "complete") {
    goog.events.unlisten(this.iframe_, goog.events.EventType.READYSTATECHANGE, this.onIeReadyStateChange_, false, this);
    var doc;
    try {
      doc = goog.dom.getFrameContentDocument(this.iframe_);
      if (goog.userAgent.IE && doc.location == "about:blank" && !navigator.onLine) {
        this.handleError_(goog.net.ErrorCode.OFFLINE);
        return;
      }
    } catch (ex) {
      this.handleError_(goog.net.ErrorCode.ACCESS_DENIED);
      return;
    }
    this.handleLoad_((doc));
  }
};
goog.net.IframeIo.prototype.onIframeLoaded_ = function(e) {
  if (goog.userAgent.OPERA && !goog.userAgent.WEBKIT && this.getContentDocument_().location == "about:blank") {
    return;
  }
  goog.events.unlisten(this.getRequestIframe(), goog.events.EventType.LOAD, this.onIframeLoaded_, false, this);
  try {
    this.handleLoad_(this.getContentDocument_());
  } catch (ex) {
    this.handleError_(goog.net.ErrorCode.ACCESS_DENIED);
  }
};
goog.net.IframeIo.prototype.handleLoad_ = function(contentDocument) {
  goog.log.fine(this.logger_, "Iframe loaded");
  this.complete_ = true;
  this.active_ = false;
  var errorCode;
  try {
    var body = contentDocument.body;
    this.lastContent_ = body.textContent || body.innerText;
    this.lastContentHtml_ = body.innerHTML;
  } catch (ex) {
    errorCode = goog.net.ErrorCode.ACCESS_DENIED;
  }
  var customError;
  if (!errorCode && typeof this.errorChecker_ == "function") {
    customError = this.errorChecker_(contentDocument);
    if (customError) {
      errorCode = goog.net.ErrorCode.CUSTOM_ERROR;
    }
  }
  goog.log.log(this.logger_, goog.log.Level.FINER, "Last content: " + this.lastContent_);
  goog.log.log(this.logger_, goog.log.Level.FINER, "Last uri: " + this.lastUri_);
  if (errorCode) {
    goog.log.fine(this.logger_, "Load event occurred but failed");
    this.handleError_(errorCode, customError);
  } else {
    goog.log.fine(this.logger_, "Load succeeded");
    this.success_ = true;
    this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.SUCCESS);
    this.makeReady_();
  }
};
goog.net.IframeIo.prototype.handleError_ = function(errorCode, opt_customError) {
  if (!this.errorHandled_) {
    this.success_ = false;
    this.active_ = false;
    this.complete_ = true;
    this.lastErrorCode_ = errorCode;
    if (errorCode == goog.net.ErrorCode.CUSTOM_ERROR) {
      goog.asserts.assert(goog.isDef(opt_customError));
      this.lastCustomError_ = opt_customError;
    }
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ERROR);
    this.makeReady_();
    this.errorHandled_ = true;
  }
};
goog.net.IframeIo.prototype.handleIncrementalData_ = function(data) {
  this.dispatchEvent(new goog.net.IframeIo.IncrementalDataEvent(data));
};
goog.net.IframeIo.prototype.makeReady_ = function() {
  goog.log.info(this.logger_, "Ready for new requests");
  this.scheduleIframeDisposal_();
  this.disposeForm_();
  this.dispatchEvent(goog.net.EventType.READY);
};
goog.net.IframeIo.prototype.createIframe_ = function() {
  goog.log.fine(this.logger_, "Creating iframe");
  this.iframeName_ = this.name_ + "_" + (this.nextIframeId_++).toString(36);
  var iframeAttributes = {"name":this.iframeName_, "id":this.iframeName_};
  if (goog.userAgent.IE && goog.userAgent.VERSION < 7) {
    iframeAttributes.src = 'javascript:""';
  }
  this.iframe_ = (goog.dom.getDomHelper(this.form_).createDom(goog.dom.TagName.IFRAME, iframeAttributes));
  var s = this.iframe_.style;
  s.visibility = "hidden";
  s.width = s.height = "10px";
  s.display = "none";
  if (!goog.userAgent.WEBKIT) {
    s.position = "absolute";
    s.top = s.left = "-10px";
  } else {
    s.marginTop = s.marginLeft = "-10px";
  }
};
goog.net.IframeIo.prototype.appendIframe_ = function() {
  goog.dom.getDomHelper(this.form_).getDocument().body.appendChild(this.iframe_);
};
goog.net.IframeIo.prototype.scheduleIframeDisposal_ = function() {
  var iframe = this.iframe_;
  if (iframe) {
    iframe.onreadystatechange = null;
    iframe.onload = null;
    iframe.onerror = null;
    this.iframesForDisposal_.push(iframe);
  }
  if (this.iframeDisposalTimer_) {
    goog.Timer.clear(this.iframeDisposalTimer_);
    this.iframeDisposalTimer_ = null;
  }
  if (goog.userAgent.GECKO || goog.userAgent.OPERA && !goog.userAgent.WEBKIT) {
    this.iframeDisposalTimer_ = goog.Timer.callOnce(this.disposeIframes_, goog.net.IframeIo.IFRAME_DISPOSE_DELAY_MS, this);
  } else {
    this.disposeIframes_();
  }
  this.iframe_ = null;
  this.iframeName_ = null;
};
goog.net.IframeIo.prototype.disposeIframes_ = function() {
  if (this.iframeDisposalTimer_) {
    goog.Timer.clear(this.iframeDisposalTimer_);
    this.iframeDisposalTimer_ = null;
  }
  while (this.iframesForDisposal_.length != 0) {
    var iframe = this.iframesForDisposal_.pop();
    goog.log.info(this.logger_, "Disposing iframe");
    goog.dom.removeNode(iframe);
  }
};
goog.net.IframeIo.prototype.clearForm_ = function() {
  if (this.form_ && this.form_ == goog.net.IframeIo.form_) {
    goog.dom.removeChildren(this.form_);
  }
};
goog.net.IframeIo.prototype.disposeForm_ = function() {
  this.clearForm_();
  this.form_ = null;
};
goog.net.IframeIo.prototype.getContentDocument_ = function() {
  if (this.iframe_) {
    return (goog.dom.getFrameContentDocument(this.getRequestIframe()));
  }
  return null;
};
goog.net.IframeIo.prototype.getRequestIframe = function() {
  if (this.iframe_) {
    return (goog.net.IframeIo.useIeReadyStateCodePath_() ? this.iframe_ : goog.dom.getFrameContentDocument(this.iframe_).getElementById(this.iframeName_ + goog.net.IframeIo.INNER_FRAME_SUFFIX));
  }
  return null;
};
goog.net.IframeIo.prototype.testForFirefoxSilentError_ = function() {
  if (this.active_) {
    var doc = this.getContentDocument_();
    if (doc && !goog.reflect.canAccessProperty(doc, "documentUri")) {
      if (!this.ignoreResponse_) {
        goog.events.unlisten(this.getRequestIframe(), goog.events.EventType.LOAD, this.onIframeLoaded_, false, this);
      }
      if (navigator.onLine) {
        goog.log.warning(this.logger_, "Silent Firefox error detected");
        this.handleError_(goog.net.ErrorCode.FF_SILENT_ERROR);
      } else {
        goog.log.warning(this.logger_, "Firefox is offline so report offline error " + "instead of silent error");
        this.handleError_(goog.net.ErrorCode.OFFLINE);
      }
      return;
    }
    this.firefoxSilentErrorTimeout_ = goog.Timer.callOnce(this.testForFirefoxSilentError_, 250, this);
  }
};
goog.net.IframeIo.IncrementalDataEvent = function(data) {
  goog.events.Event.call(this, goog.net.EventType.INCREMENTAL_DATA);
  this.data = data;
};
goog.inherits(goog.net.IframeIo.IncrementalDataEvent, goog.events.Event);
goog.provide("goog.net.XhrIo");
goog.provide("goog.net.XhrIo.ResponseType");
goog.require("goog.Timer");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.events.EventTarget");
goog.require("goog.json");
goog.require("goog.log");
goog.require("goog.net.ErrorCode");
goog.require("goog.net.EventType");
goog.require("goog.net.HttpStatus");
goog.require("goog.net.XmlHttp");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.require("goog.uri.utils");
goog.require("goog.userAgent");
goog.forwardDeclare("goog.Uri");
goog.net.XhrIo = function(opt_xmlHttpFactory) {
  goog.net.XhrIo.base(this, "constructor");
  this.headers = new goog.structs.Map;
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null;
  this.active_ = false;
  this.xhr_ = null;
  this.xhrOptions_ = null;
  this.lastUri_ = "";
  this.lastMethod_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastError_ = "";
  this.errorDispatched_ = false;
  this.inSend_ = false;
  this.inOpen_ = false;
  this.inAbort_ = false;
  this.timeoutInterval_ = 0;
  this.timeoutId_ = null;
  this.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;
  this.withCredentials_ = false;
  this.progressEventsEnabled_ = false;
  this.useXhr2Timeout_ = false;
};
goog.inherits(goog.net.XhrIo, goog.events.EventTarget);
goog.net.XhrIo.ResponseType = {DEFAULT:"", TEXT:"text", DOCUMENT:"document", BLOB:"blob", ARRAY_BUFFER:"arraybuffer"};
goog.net.XhrIo.prototype.logger_ = goog.log.getLogger("goog.net.XhrIo");
goog.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;
goog.net.XhrIo.METHODS_WITH_FORM_DATA = ["POST", "PUT"];
goog.net.XhrIo.FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8";
goog.net.XhrIo.XHR2_TIMEOUT_ = "timeout";
goog.net.XhrIo.XHR2_ON_TIMEOUT_ = "ontimeout";
goog.net.XhrIo.sendInstances_ = [];
goog.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content, opt_headers, opt_timeoutInterval, opt_withCredentials) {
  var x = new goog.net.XhrIo;
  goog.net.XhrIo.sendInstances_.push(x);
  if (opt_callback) {
    x.listen(goog.net.EventType.COMPLETE, opt_callback);
  }
  x.listenOnce(goog.net.EventType.READY, x.cleanupSend_);
  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval);
  }
  if (opt_withCredentials) {
    x.setWithCredentials(opt_withCredentials);
  }
  x.send(url, opt_method, opt_content, opt_headers);
  return x;
};
goog.net.XhrIo.cleanup = function() {
  var instances = goog.net.XhrIo.sendInstances_;
  while (instances.length) {
    instances.pop().dispose();
  }
};
goog.net.XhrIo.protectEntryPoints = function(errorHandler) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = errorHandler.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
};
goog.net.XhrIo.prototype.cleanupSend_ = function() {
  this.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, this);
};
goog.net.XhrIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
};
goog.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms);
};
goog.net.XhrIo.prototype.setResponseType = function(type) {
  this.responseType_ = type;
};
goog.net.XhrIo.prototype.getResponseType = function() {
  return this.responseType_;
};
goog.net.XhrIo.prototype.setWithCredentials = function(withCredentials) {
  this.withCredentials_ = withCredentials;
};
goog.net.XhrIo.prototype.getWithCredentials = function() {
  return this.withCredentials_;
};
goog.net.XhrIo.prototype.setProgressEventsEnabled = function(enabled) {
  this.progressEventsEnabled_ = enabled;
};
goog.net.XhrIo.prototype.getProgressEventsEnabled = function() {
  return this.progressEventsEnabled_;
};
goog.net.XhrIo.prototype.send = function(url, opt_method, opt_content, opt_headers) {
  if (this.xhr_) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.lastUri_ + "; newUri=" + url);
  }
  var method = opt_method ? opt_method.toUpperCase() : "GET";
  this.lastUri_ = url;
  this.lastError_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastMethod_ = method;
  this.errorDispatched_ = false;
  this.active_ = true;
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
  if (this.getProgressEventsEnabled() && "onprogress" in this.xhr_) {
    this.xhr_.onprogress = goog.bind(function(e) {
      this.onProgressHandler_(e, true);
    }, this);
    if (this.xhr_.upload) {
      this.xhr_.upload.onprogress = goog.bind(this.onProgressHandler_, this);
    }
  }
  try {
    goog.log.fine(this.logger_, this.formatMsg_("Opening Xhr"));
    this.inOpen_ = true;
    this.xhr_.open(method, String(url), true);
    this.inOpen_ = false;
  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_("Error opening Xhr: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
    return;
  }
  var content = opt_content || "";
  var headers = this.headers.clone();
  if (opt_headers) {
    goog.structs.forEach(opt_headers, function(value, key) {
      headers.set(key, value);
    });
  }
  var contentTypeKey = goog.array.find(headers.getKeys(), goog.net.XhrIo.isContentTypeHeader_);
  var contentIsFormData = goog.global["FormData"] && content instanceof goog.global["FormData"];
  if (goog.array.contains(goog.net.XhrIo.METHODS_WITH_FORM_DATA, method) && !contentTypeKey && !contentIsFormData) {
    headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE);
  }
  headers.forEach(function(value, key) {
    this.xhr_.setRequestHeader(key, value);
  }, this);
  if (this.responseType_) {
    this.xhr_.responseType = this.responseType_;
  }
  if (goog.object.containsKey(this.xhr_, "withCredentials")) {
    this.xhr_.withCredentials = this.withCredentials_;
  }
  try {
    this.cleanUpTimeoutTimer_();
    if (this.timeoutInterval_ > 0) {
      this.useXhr2Timeout_ = goog.net.XhrIo.shouldUseXhr2Timeout_(this.xhr_);
      goog.log.fine(this.logger_, this.formatMsg_("Will abort after " + this.timeoutInterval_ + "ms if incomplete, xhr2 " + this.useXhr2Timeout_));
      if (this.useXhr2Timeout_) {
        this.xhr_[goog.net.XhrIo.XHR2_TIMEOUT_] = this.timeoutInterval_;
        this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = goog.bind(this.timeout_, this);
      } else {
        this.timeoutId_ = goog.Timer.callOnce(this.timeout_, this.timeoutInterval_, this);
      }
    }
    goog.log.fine(this.logger_, this.formatMsg_("Sending request"));
    this.inSend_ = true;
    this.xhr_.send(content);
    this.inSend_ = false;
  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_("Send error: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
  }
};
goog.net.XhrIo.shouldUseXhr2Timeout_ = function(xhr) {
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher(9) && goog.isNumber(xhr[goog.net.XhrIo.XHR2_TIMEOUT_]) && goog.isDef(xhr[goog.net.XhrIo.XHR2_ON_TIMEOUT_]);
};
goog.net.XhrIo.isContentTypeHeader_ = function(header) {
  return goog.string.caseInsensitiveEquals(goog.net.XhrIo.CONTENT_TYPE_HEADER, header);
};
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp();
};
goog.net.XhrIo.prototype.timeout_ = function() {
  if (typeof goog == "undefined") {
  } else {
    if (this.xhr_) {
      this.lastError_ = "Timed out after " + this.timeoutInterval_ + "ms, aborting";
      this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT;
      goog.log.fine(this.logger_, this.formatMsg_(this.lastError_));
      this.dispatchEvent(goog.net.EventType.TIMEOUT);
      this.abort(goog.net.ErrorCode.TIMEOUT);
    }
  }
};
goog.net.XhrIo.prototype.error_ = function(errorCode, err) {
  this.active_ = false;
  if (this.xhr_) {
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false;
  }
  this.lastError_ = err;
  this.lastErrorCode_ = errorCode;
  this.dispatchErrors_();
  this.cleanUpXhr_();
};
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  if (!this.errorDispatched_) {
    this.errorDispatched_ = true;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ERROR);
  }
};
goog.net.XhrIo.prototype.abort = function(opt_failureCode) {
  if (this.xhr_ && this.active_) {
    goog.log.fine(this.logger_, this.formatMsg_("Aborting"));
    this.active_ = false;
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ABORT);
    this.cleanUpXhr_();
  }
};
goog.net.XhrIo.prototype.disposeInternal = function() {
  if (this.xhr_) {
    if (this.active_) {
      this.active_ = false;
      this.inAbort_ = true;
      this.xhr_.abort();
      this.inAbort_ = false;
    }
    this.cleanUpXhr_(true);
  }
  goog.net.XhrIo.base(this, "disposeInternal");
};
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if (this.isDisposed()) {
    return;
  }
  if (!this.inOpen_ && !this.inSend_ && !this.inAbort_) {
    this.onReadyStateChangeEntryPoint_();
  } else {
    this.onReadyStateChangeHelper_();
  }
};
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_();
};
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if (!this.active_) {
    return;
  }
  if (typeof goog == "undefined") {
  } else {
    if (this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE && this.getStatus() == 2) {
      goog.log.fine(this.logger_, this.formatMsg_("Local request error detected and ignored"));
    } else {
      if (this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.Timer.callOnce(this.onReadyStateChange_, 0, this);
        return;
      }
      this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);
      if (this.isComplete()) {
        goog.log.fine(this.logger_, this.formatMsg_("Request complete"));
        this.active_ = false;
        try {
          if (this.isSuccess()) {
            this.dispatchEvent(goog.net.EventType.COMPLETE);
            this.dispatchEvent(goog.net.EventType.SUCCESS);
          } else {
            this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR;
            this.lastError_ = this.getStatusText() + " [" + this.getStatus() + "]";
            this.dispatchErrors_();
          }
        } finally {
          this.cleanUpXhr_();
        }
      }
    }
  }
};
goog.net.XhrIo.prototype.onProgressHandler_ = function(e, opt_isDownload) {
  goog.asserts.assert(e.type === goog.net.EventType.PROGRESS, "goog.net.EventType.PROGRESS is of the same type as raw XHR progress.");
  this.dispatchEvent(goog.net.XhrIo.buildProgressEvent_(e, goog.net.EventType.PROGRESS));
  this.dispatchEvent(goog.net.XhrIo.buildProgressEvent_(e, opt_isDownload ? goog.net.EventType.DOWNLOAD_PROGRESS : goog.net.EventType.UPLOAD_PROGRESS));
};
goog.net.XhrIo.buildProgressEvent_ = function(e, eventType) {
  return ({type:eventType, lengthComputable:e.lengthComputable, loaded:e.loaded, total:e.total});
};
goog.net.XhrIo.prototype.cleanUpXhr_ = function(opt_fromDispose) {
  if (this.xhr_) {
    this.cleanUpTimeoutTimer_();
    var xhr = this.xhr_;
    var clearedOnReadyStateChange = this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ? goog.nullFunction : null;
    this.xhr_ = null;
    this.xhrOptions_ = null;
    if (!opt_fromDispose) {
      this.dispatchEvent(goog.net.EventType.READY);
    }
    try {
      xhr.onreadystatechange = clearedOnReadyStateChange;
    } catch (e) {
      goog.log.error(this.logger_, "Problem encountered resetting onreadystatechange: " + e.message);
    }
  }
};
goog.net.XhrIo.prototype.cleanUpTimeoutTimer_ = function() {
  if (this.xhr_ && this.useXhr2Timeout_) {
    this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = null;
  }
  if (goog.isNumber(this.timeoutId_)) {
    goog.Timer.clear(this.timeoutId_);
    this.timeoutId_ = null;
  }
};
goog.net.XhrIo.prototype.isActive = function() {
  return !!this.xhr_;
};
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
};
goog.net.XhrIo.prototype.isSuccess = function() {
  var status = this.getStatus();
  return goog.net.HttpStatus.isSuccess(status) || status === 0 && !this.isLastUriEffectiveSchemeHttp_();
};
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var scheme = goog.uri.utils.getEffectiveScheme(String(this.lastUri_));
  return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(scheme);
};
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ? (this.xhr_.readyState) : goog.net.XmlHttp.ReadyState.UNINITIALIZED;
};
goog.net.XhrIo.prototype.getStatus = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1;
  } catch (e) {
    return -1;
  }
};
goog.net.XhrIo.prototype.getStatusText = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : "";
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get status: " + e.message);
    return "";
  }
};
goog.net.XhrIo.prototype.getLastUri = function() {
  return String(this.lastUri_);
};
goog.net.XhrIo.prototype.getResponseText = function() {
  try {
    return this.xhr_ ? this.xhr_.responseText : "";
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get responseText: " + e.message);
    return "";
  }
};
goog.net.XhrIo.prototype.getResponseBody = function() {
  try {
    if (this.xhr_ && "responseBody" in this.xhr_) {
      return this.xhr_["responseBody"];
    }
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get responseBody: " + e.message);
  }
  return null;
};
goog.net.XhrIo.prototype.getResponseXml = function() {
  try {
    return this.xhr_ ? this.xhr_.responseXML : null;
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get responseXML: " + e.message);
    return null;
  }
};
goog.net.XhrIo.prototype.getResponseJson = function(opt_xssiPrefix) {
  if (!this.xhr_) {
    return undefined;
  }
  var responseText = this.xhr_.responseText;
  if (opt_xssiPrefix && responseText.indexOf(opt_xssiPrefix) == 0) {
    responseText = responseText.substring(opt_xssiPrefix.length);
  }
  return goog.json.parse(responseText);
};
goog.net.XhrIo.prototype.getResponse = function() {
  try {
    if (!this.xhr_) {
      return null;
    }
    if ("response" in this.xhr_) {
      return this.xhr_.response;
    }
    switch(this.responseType_) {
      case goog.net.XhrIo.ResponseType.DEFAULT:
      ;
      case goog.net.XhrIo.ResponseType.TEXT:
        return this.xhr_.responseText;
      case goog.net.XhrIo.ResponseType.ARRAY_BUFFER:
        if ("mozResponseArrayBuffer" in this.xhr_) {
          return this.xhr_.mozResponseArrayBuffer;
        }
      ;
    }
    goog.log.error(this.logger_, "Response type " + this.responseType_ + " is not " + "supported on this browser");
    return null;
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get response: " + e.message);
    return null;
  }
};
goog.net.XhrIo.prototype.getResponseHeader = function(key) {
  return this.xhr_ && this.isComplete() ? this.xhr_.getResponseHeader(key) : undefined;
};
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ? this.xhr_.getAllResponseHeaders() : "";
};
goog.net.XhrIo.prototype.getResponseHeaders = function() {
  var headersObject = {};
  var headersArray = this.getAllResponseHeaders().split("\r\n");
  for (var i = 0;i < headersArray.length;i++) {
    if (goog.string.isEmptyOrWhitespace(headersArray[i])) {
      continue;
    }
    var keyValue = goog.string.splitLimit(headersArray[i], ": ", 2);
    if (headersObject[keyValue[0]]) {
      headersObject[keyValue[0]] += ", " + keyValue[1];
    } else {
      headersObject[keyValue[0]] = keyValue[1];
    }
  }
  return headersObject;
};
goog.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
};
goog.net.XhrIo.prototype.getLastError = function() {
  return goog.isString(this.lastError_) ? this.lastError_ : String(this.lastError_);
};
goog.net.XhrIo.prototype.formatMsg_ = function(msg) {
  return msg + " [" + this.lastMethod_ + " " + this.lastUri_ + " " + this.getStatus() + "]";
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = transformer(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
});
goog.provide("soy");
goog.provide("soy.StringBuilder");
goog.provide("soy.asserts");
goog.provide("soy.esc");
goog.provide("soydata");
goog.provide("soydata.SanitizedHtml");
goog.provide("soydata.SanitizedHtmlAttribute");
goog.provide("soydata.SanitizedJs");
goog.provide("soydata.SanitizedJsStrChars");
goog.provide("soydata.SanitizedUri");
goog.provide("soydata.VERY_UNSAFE");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.debug");
goog.require("goog.dom.DomHelper");
goog.require("goog.format");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.SafeStyle");
goog.require("goog.html.SafeUrl");
goog.require("goog.html.TrustedResourceUrl");
goog.require("goog.html.uncheckedconversions");
goog.require("goog.i18n.BidiFormatter");
goog.require("goog.i18n.bidi");
goog.require("goog.object");
goog.require("goog.soy");
goog.require("goog.soy.data.SanitizedContent");
goog.require("goog.soy.data.SanitizedContentKind");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.require("goog.string.StringBuffer");
soy.StringBuilder = goog.string.StringBuffer;
soydata.SanitizedContentKind = goog.soy.data.SanitizedContentKind;
soydata.isContentKind = function(value, contentKind) {
  return value != null && value.contentKind === contentKind;
};
soydata.getContentDir = function(value) {
  if (value != null) {
    switch(value.contentDir) {
      case goog.i18n.bidi.Dir.LTR:
        return goog.i18n.bidi.Dir.LTR;
      case goog.i18n.bidi.Dir.RTL:
        return goog.i18n.bidi.Dir.RTL;
      case goog.i18n.bidi.Dir.NEUTRAL:
        return goog.i18n.bidi.Dir.NEUTRAL;
    }
  }
  return null;
};
soydata.SanitizedHtml = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(soydata.SanitizedHtml, goog.soy.data.SanitizedContent);
soydata.SanitizedHtml.prototype.contentKind = soydata.SanitizedContentKind.HTML;
soydata.SanitizedHtml.from = function(value) {
  if (value != null && value.contentKind === soydata.SanitizedContentKind.HTML) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return (value);
  }
  if (value instanceof goog.html.SafeHtml) {
    return soydata.VERY_UNSAFE.ordainSanitizedHtml(goog.html.SafeHtml.unwrap(value), value.getDirection());
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(soy.esc.$$escapeHtmlHelper(String(value)), soydata.getContentDir(value));
};
soydata.SanitizedJs = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(soydata.SanitizedJs, goog.soy.data.SanitizedContent);
soydata.SanitizedJs.prototype.contentKind = soydata.SanitizedContentKind.JS;
soydata.SanitizedJs.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
soydata.SanitizedUri = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(soydata.SanitizedUri, goog.soy.data.SanitizedContent);
soydata.SanitizedUri.prototype.contentKind = soydata.SanitizedContentKind.URI;
soydata.SanitizedUri.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
soydata.SanitizedHtmlAttribute = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(soydata.SanitizedHtmlAttribute, goog.soy.data.SanitizedContent);
soydata.SanitizedHtmlAttribute.prototype.contentKind = soydata.SanitizedContentKind.ATTRIBUTES;
soydata.SanitizedHtmlAttribute.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
soydata.SanitizedCss = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(soydata.SanitizedCss, goog.soy.data.SanitizedContent);
soydata.SanitizedCss.prototype.contentKind = soydata.SanitizedContentKind.CSS;
soydata.SanitizedCss.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
soydata.UnsanitizedText = function(content, opt_contentDir) {
  this.content = String(content);
  this.contentDir = opt_contentDir != null ? opt_contentDir : null;
};
goog.inherits(soydata.UnsanitizedText, goog.soy.data.SanitizedContent);
soydata.UnsanitizedText.prototype.contentKind = soydata.SanitizedContentKind.TEXT;
soydata.$$EMPTY_STRING_ = {VALUE:""};
soydata.$$makeSanitizedContentFactory_ = function(ctor) {
  function InstantiableCtor(content) {
    this.content = content;
  }
  InstantiableCtor.prototype = ctor.prototype;
  function sanitizedContentFactory(content, opt_contentDir) {
    var result = new InstantiableCtor(String(content));
    if (opt_contentDir !== undefined) {
      result.contentDir = opt_contentDir;
    }
    return result;
  }
  return sanitizedContentFactory;
};
soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_ = function(ctor) {
  function InstantiableCtor(content) {
    this.content = content;
  }
  InstantiableCtor.prototype = ctor.prototype;
  function sanitizedContentFactory(content) {
    var result = new InstantiableCtor(String(content));
    return result;
  }
  return sanitizedContentFactory;
};
soydata.markUnsanitizedText = function(content, opt_contentDir) {
  return new soydata.UnsanitizedText(content, opt_contentDir);
};
soydata.VERY_UNSAFE.ordainSanitizedHtml = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedHtml);
soydata.VERY_UNSAFE.ordainSanitizedJs = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(soydata.SanitizedJs);
soydata.VERY_UNSAFE.ordainSanitizedUri = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(soydata.SanitizedUri);
soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(soydata.SanitizedHtmlAttribute);
soydata.VERY_UNSAFE.ordainSanitizedCss = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(soydata.SanitizedCss);
soy.renderElement = goog.soy.renderElement;
soy.renderAsFragment = function(template, opt_templateData, opt_document, opt_injectedData) {
  return goog.soy.renderAsFragment(template, opt_templateData, opt_injectedData, new goog.dom.DomHelper(opt_document));
};
soy.renderAsElement = function(template, opt_templateData, opt_document, opt_injectedData) {
  return goog.soy.renderAsElement(template, opt_templateData, opt_injectedData, new goog.dom.DomHelper(opt_document));
};
soy.$$IS_LOCALE_RTL = goog.i18n.bidi.IS_RTL;
soy.$$augmentMap = function(baseMap, additionalMap) {
  function TempCtor() {
  }
  TempCtor.prototype = baseMap;
  var augmentedMap = new TempCtor;
  for (var key in additionalMap) {
    augmentedMap[key] = additionalMap[key];
  }
  return augmentedMap;
};
soy.$$checkMapKey = function(key) {
  if (typeof key != "string") {
    throw Error("Map literal's key expression must evaluate to string" + ' (encountered type "' + typeof key + '").');
  }
  return key;
};
soy.$$getMapKeys = function(map) {
  var mapKeys = [];
  for (var key in map) {
    mapKeys.push(key);
  }
  return mapKeys;
};
soy.$$checkNotNull = function(val) {
  if (val == null) {
    throw Error("unexpected null value");
  }
  return val;
};
soy.$$getDelTemplateId = function(delTemplateName) {
  return delTemplateName;
};
soy.$$DELEGATE_REGISTRY_PRIORITIES_ = {};
soy.$$DELEGATE_REGISTRY_FUNCTIONS_ = {};
soy.$$registerDelegateFn = function(delTemplateId, delTemplateVariant, delPriority, delFn) {
  var mapKey = "key_" + delTemplateId + ":" + delTemplateVariant;
  var currPriority = soy.$$DELEGATE_REGISTRY_PRIORITIES_[mapKey];
  if (currPriority === undefined || delPriority > currPriority) {
    soy.$$DELEGATE_REGISTRY_PRIORITIES_[mapKey] = delPriority;
    soy.$$DELEGATE_REGISTRY_FUNCTIONS_[mapKey] = delFn;
  } else {
    if (delPriority == currPriority) {
      throw Error('Encountered two active delegates with the same priority ("' + delTemplateId + ":" + delTemplateVariant + '").');
    } else {
    }
  }
};
soy.$$getDelegateFn = function(delTemplateId, delTemplateVariant, allowsEmptyDefault) {
  var delFn = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + delTemplateId + ":" + delTemplateVariant];
  if (!delFn && delTemplateVariant != "") {
    delFn = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + delTemplateId + ":"];
  }
  if (delFn) {
    return delFn;
  } else {
    if (allowsEmptyDefault) {
      return soy.$$EMPTY_TEMPLATE_FN_;
    } else {
      throw Error('Found no active impl for delegate call to "' + delTemplateId + ":" + delTemplateVariant + '" (and not allowemptydefault="true").');
    }
  }
};
soy.$$EMPTY_TEMPLATE_FN_ = function(opt_data, opt_sb, opt_ijData) {
  return "";
};
soydata.$$makeSanitizedContentFactoryForInternalBlocks_ = function(ctor) {
  function InstantiableCtor(content) {
    this.content = content;
  }
  InstantiableCtor.prototype = ctor.prototype;
  function sanitizedContentFactory(content, opt_contentDir) {
    var contentString = String(content);
    if (!contentString) {
      return soydata.$$EMPTY_STRING_.VALUE;
    }
    var result = new InstantiableCtor(contentString);
    if (opt_contentDir !== undefined) {
      result.contentDir = opt_contentDir;
    }
    return result;
  }
  return sanitizedContentFactory;
};
soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_ = function(ctor) {
  function InstantiableCtor(content) {
    this.content = content;
  }
  InstantiableCtor.prototype = ctor.prototype;
  function sanitizedContentFactory(content) {
    var contentString = String(content);
    if (!contentString) {
      return soydata.$$EMPTY_STRING_.VALUE;
    }
    var result = new InstantiableCtor(contentString);
    return result;
  }
  return sanitizedContentFactory;
};
soydata.$$markUnsanitizedTextForInternalBlocks = function(content, opt_contentDir) {
  var contentString = String(content);
  if (!contentString) {
    return soydata.$$EMPTY_STRING_.VALUE;
  }
  return new soydata.UnsanitizedText(contentString, opt_contentDir);
};
soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks = soydata.$$makeSanitizedContentFactoryForInternalBlocks_(soydata.SanitizedHtml);
soydata.VERY_UNSAFE.$$ordainSanitizedJsForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(soydata.SanitizedJs);
soydata.VERY_UNSAFE.$$ordainSanitizedUriForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(soydata.SanitizedUri);
soydata.VERY_UNSAFE.$$ordainSanitizedAttributesForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(soydata.SanitizedHtmlAttribute);
soydata.VERY_UNSAFE.$$ordainSanitizedCssForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(soydata.SanitizedCss);
soy.$$escapeHtml = function(value) {
  return soydata.SanitizedHtml.from(value);
};
soy.$$cleanHtml = function(value, opt_safeTags) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return (value);
  }
  var tagWhitelist;
  if (opt_safeTags) {
    tagWhitelist = goog.object.createSet(opt_safeTags);
    goog.object.extend(tagWhitelist, soy.esc.$$SAFE_TAG_WHITELIST_);
  } else {
    tagWhitelist = soy.esc.$$SAFE_TAG_WHITELIST_;
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(soy.$$stripHtmlTags(value, tagWhitelist), soydata.getContentDir(value));
};
soy.$$normalizeHtml = function(value) {
  return soy.esc.$$normalizeHtmlHelper(value);
};
soy.$$escapeHtmlRcdata = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return soy.esc.$$normalizeHtmlHelper(value.getContent());
  }
  return soy.esc.$$escapeHtmlHelper(value);
};
soy.$$HTML5_VOID_ELEMENTS_ = new RegExp("^<(?:area|base|br|col|command|embed|hr|img|input" + "|keygen|link|meta|param|source|track|wbr)\\b");
soy.$$stripHtmlTags = function(value, opt_tagWhitelist) {
  if (!opt_tagWhitelist) {
    return String(value).replace(soy.esc.$$HTML_TAG_REGEX_, "").replace(soy.esc.$$LT_REGEX_, "&lt;");
  }
  var html = String(value).replace(/\[/g, "&#91;");
  var tags = [];
  var openListTags = [];
  var attrs = [];
  html = html.replace(soy.esc.$$HTML_TAG_REGEX_, function(tok, tagName) {
    if (tagName) {
      tagName = tagName.toLowerCase();
      if (opt_tagWhitelist.hasOwnProperty(tagName) && opt_tagWhitelist[tagName]) {
        var isClose = tok.charAt(1) == "/";
        var index = tags.length;
        var start = "</";
        var attributes = "";
        if (!isClose) {
          start = "<";
          var match;
          while (match = soy.esc.$$HTML_ATTRIBUTE_REGEX_.exec(tok)) {
            if (match[1] && match[1].toLowerCase() == "dir") {
              var dir = match[2];
              if (dir) {
                if (dir.charAt(0) == "'" || dir.charAt(0) == '"') {
                  dir = dir.substr(1, dir.length - 2);
                }
                dir = dir.toLowerCase();
                if (dir == "ltr" || dir == "rtl" || dir == "auto") {
                  attributes = ' dir="' + dir + '"';
                }
              }
              break;
            }
          }
          soy.esc.$$HTML_ATTRIBUTE_REGEX_.lastIndex = 0;
        }
        tags[index] = start + tagName + ">";
        attrs[index] = attributes;
        return "[" + index + "]";
      }
    }
    return "";
  });
  html = soy.esc.$$normalizeHtmlHelper(html);
  var finalCloseTags = soy.$$balanceTags_(tags);
  html = html.replace(/\[(\d+)\]/g, function(_, index) {
    if (attrs[index] && tags[index]) {
      return tags[index].substr(0, tags[index].length - 1) + attrs[index] + ">";
    }
    return tags[index];
  });
  return html + finalCloseTags;
};
soy.$$embedCssIntoHtml_ = function(css) {
  return css.replace(/<\//g, "<\\/").replace(/\]\]>/g, "]]\\>");
};
soy.$$balanceTags_ = function(tags) {
  var open = [];
  for (var i = 0, n = tags.length;i < n;++i) {
    var tag = tags[i];
    if (tag.charAt(1) == "/") {
      var openTagIndex = goog.array.lastIndexOf(open, tag);
      if (openTagIndex < 0) {
        tags[i] = "";
      } else {
        tags[i] = open.slice(openTagIndex).reverse().join("");
        open.length = openTagIndex;
      }
    } else {
      if (tag == "<li>" && goog.array.lastIndexOf(open, "</ol>") < 0 && goog.array.lastIndexOf(open, "</ul>") < 0) {
        tags[i] = "";
      } else {
        if (!soy.$$HTML5_VOID_ELEMENTS_.test(tag)) {
          open.push("</" + tag.substring(1));
        }
      }
    }
  }
  return open.reverse().join("");
};
soy.$$escapeHtmlAttribute = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return soy.esc.$$normalizeHtmlHelper(soy.$$stripHtmlTags(value.getContent()));
  }
  return soy.esc.$$escapeHtmlHelper(value);
};
soy.$$escapeHtmlAttributeNospace = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return soy.esc.$$normalizeHtmlNospaceHelper(soy.$$stripHtmlTags(value.getContent()));
  }
  return soy.esc.$$escapeHtmlNospaceHelper(value);
};
soy.$$filterHtmlAttributes = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.ATTRIBUTES)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtmlAttribute);
    return value.getContent().replace(/([^"'\s])$/, "$1 ");
  }
  return soy.esc.$$filterHtmlAttributesHelper(value);
};
soy.$$filterHtmlElementName = function(value) {
  return soy.esc.$$filterHtmlElementNameHelper(value);
};
soy.$$escapeJs = function(value) {
  return soy.$$escapeJsString(value);
};
soy.$$escapeJsString = function(value) {
  return soy.esc.$$escapeJsStringHelper(value);
};
soy.$$escapeJsValue = function(value) {
  if (value == null) {
    return " null ";
  }
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.JS)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedJs);
    return value.getContent();
  }
  switch(typeof value) {
    case "boolean":
    ;
    case "number":
      return " " + value + " ";
    default:
      return "'" + soy.esc.$$escapeJsStringHelper(String(value)) + "'";
  }
};
soy.$$escapeJsRegex = function(value) {
  return soy.esc.$$escapeJsRegexHelper(value);
};
soy.$$problematicUriMarks_ = /['()]/g;
soy.$$pctEncode_ = function(ch) {
  return "%" + ch.charCodeAt(0).toString(16);
};
soy.$$escapeUri = function(value) {
  var encoded = soy.esc.$$escapeUriHelper(value);
  soy.$$problematicUriMarks_.lastIndex = 0;
  if (soy.$$problematicUriMarks_.test(encoded)) {
    return encoded.replace(soy.$$problematicUriMarks_, soy.$$pctEncode_);
  }
  return encoded;
};
soy.$$normalizeUri = function(value) {
  return soy.esc.$$normalizeUriHelper(value);
};
soy.$$filterNormalizeUri = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.URI)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedUri);
    return soy.$$normalizeUri(value);
  }
  if (value instanceof goog.html.SafeUrl) {
    return soy.$$normalizeUri(goog.html.SafeUrl.unwrap(value));
  }
  if (value instanceof goog.html.TrustedResourceUrl) {
    return soy.$$normalizeUri(goog.html.TrustedResourceUrl.unwrap(value));
  }
  return soy.esc.$$filterNormalizeUriHelper(value);
};
soy.$$filterNormalizeMediaUri = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.URI)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedUri);
    return soy.$$normalizeUri(value);
  }
  if (value instanceof goog.html.SafeUrl) {
    return soy.$$normalizeUri(goog.html.SafeUrl.unwrap(value));
  }
  if (value instanceof goog.html.TrustedResourceUrl) {
    return soy.$$normalizeUri(goog.html.TrustedResourceUrl.unwrap(value));
  }
  return soy.esc.$$filterNormalizeMediaUriHelper(value);
};
soy.$$filterImageDataUri = function(value) {
  return soydata.VERY_UNSAFE.ordainSanitizedUri(soy.esc.$$filterImageDataUriHelper(value));
};
soy.$$escapeCssString = function(value) {
  return soy.esc.$$escapeCssStringHelper(value);
};
soy.$$filterCssValue = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.CSS)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedCss);
    return soy.$$embedCssIntoHtml_(value.getContent());
  }
  if (value == null) {
    return "";
  }
  if (value instanceof goog.html.SafeStyle) {
    return soy.$$embedCssIntoHtml_(goog.html.SafeStyle.unwrap(value));
  }
  return soy.esc.$$filterCssValueHelper(value);
};
soy.$$filterNoAutoescape = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.TEXT)) {
    goog.asserts.fail("Tainted SanitizedContentKind.TEXT for |noAutoescape: `%s`", [value.getContent()]);
    return "zSoyz";
  }
  return value;
};
soy.$$changeNewlineToBr = function(value) {
  var result = goog.string.newLineToBr(String(value), false);
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    return soydata.VERY_UNSAFE.ordainSanitizedHtml(result, soydata.getContentDir(value));
  }
  return result;
};
soy.$$insertWordBreaks = function(value, maxCharsBetweenWordBreaks) {
  var result = goog.format.insertWordBreaks(String(value), maxCharsBetweenWordBreaks);
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    return soydata.VERY_UNSAFE.ordainSanitizedHtml(result, soydata.getContentDir(value));
  }
  return result;
};
soy.$$truncate = function(str, maxLen, doAddEllipsis) {
  str = String(str);
  if (str.length <= maxLen) {
    return str;
  }
  if (doAddEllipsis) {
    if (maxLen > 3) {
      maxLen -= 3;
    } else {
      doAddEllipsis = false;
    }
  }
  if (soy.$$isHighSurrogate_(str.charAt(maxLen - 1)) && soy.$$isLowSurrogate_(str.charAt(maxLen))) {
    maxLen -= 1;
  }
  str = str.substring(0, maxLen);
  if (doAddEllipsis) {
    str += "...";
  }
  return str;
};
soy.$$isHighSurrogate_ = function(ch) {
  return 55296 <= ch && ch <= 56319;
};
soy.$$isLowSurrogate_ = function(ch) {
  return 56320 <= ch && ch <= 57343;
};
soy.$$bidiFormatterCache_ = {};
soy.$$getBidiFormatterInstance_ = function(bidiGlobalDir) {
  return soy.$$bidiFormatterCache_[bidiGlobalDir] || (soy.$$bidiFormatterCache_[bidiGlobalDir] = new goog.i18n.BidiFormatter(bidiGlobalDir));
};
soy.$$bidiTextDir = function(text, opt_isHtml) {
  var contentDir = soydata.getContentDir(text);
  if (contentDir != null) {
    return contentDir;
  }
  var isHtml = opt_isHtml || soydata.isContentKind(text, soydata.SanitizedContentKind.HTML);
  return goog.i18n.bidi.estimateDirection(text + "", isHtml);
};
soy.$$bidiDirAttr = function(bidiGlobalDir, text, opt_isHtml) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  var contentDir = soydata.getContentDir(text);
  if (contentDir == null) {
    var isHtml = opt_isHtml || soydata.isContentKind(text, soydata.SanitizedContentKind.HTML);
    contentDir = goog.i18n.bidi.estimateDirection(text + "", isHtml);
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute(formatter.knownDirAttr(contentDir));
};
soy.$$bidiMarkAfter = function(bidiGlobalDir, text, opt_isHtml) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  var isHtml = opt_isHtml || soydata.isContentKind(text, soydata.SanitizedContentKind.HTML);
  return formatter.markAfterKnownDir(soydata.getContentDir(text), text + "", isHtml);
};
soy.$$bidiSpanWrap = function(bidiGlobalDir, text) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  var html = goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Soy |bidiSpanWrap is applied on an autoescaped text."), String(text));
  var wrappedHtml = formatter.spanWrapSafeHtmlWithKnownDir(soydata.getContentDir(text), html);
  return goog.html.SafeHtml.unwrap(wrappedHtml);
};
soy.$$bidiUnicodeWrap = function(bidiGlobalDir, text) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  var isHtml = soydata.isContentKind(text, soydata.SanitizedContentKind.HTML);
  var wrappedText = formatter.unicodeWrapWithKnownDir(soydata.getContentDir(text), text + "", isHtml);
  var wrappedTextDir = formatter.getContextDir();
  if (soydata.isContentKind(text, soydata.SanitizedContentKind.TEXT)) {
    return new soydata.UnsanitizedText(wrappedText, wrappedTextDir);
  }
  if (isHtml) {
    return soydata.VERY_UNSAFE.ordainSanitizedHtml(wrappedText, wrappedTextDir);
  }
  return wrappedText;
};
soy.asserts.assertType = function(typeCheck, paramName, param, jsDocTypeStr, var_args) {
  var msg = "expected param " + paramName + " of type " + jsDocTypeStr + (goog.DEBUG ? ", but got " + goog.debug.runtimeType(param) : "") + ".";
  return goog.asserts.assert(typeCheck, msg, var_args);
};
soy.esc.$$escapeHtmlHelper = function(v) {
  return goog.string.htmlEscape(String(v));
};
soy.esc.$$escapeUriHelper = function(v) {
  return goog.string.urlEncode(String(v));
};
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = {"\x00":"&#0;", "\t":"&#9;", "\n":"&#10;", "\x0B":"&#11;", "\f":"&#12;", "\r":"&#13;", " ":"&#32;", '"':"&quot;", "&":"&amp;", "'":"&#39;", "-":"&#45;", "/":"&#47;", "<":"&lt;", "=":"&#61;", ">":"&gt;", "`":"&#96;", "\u0085":"&#133;", "\u00a0":"&#160;", "\u2028":"&#8232;", "\u2029":"&#8233;"};
soy.esc.$$REPLACER_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_[ch];
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = {"\x00":"\\x00", "\b":"\\x08", "\t":"\\t", "\n":"\\n", "\x0B":"\\x0b", "\f":"\\f", "\r":"\\r", '"':"\\x22", "$":"\\x24", "&":"\\x26", "'":"\\x27", "(":"\\x28", ")":"\\x29", "*":"\\x2a", "+":"\\x2b", ",":"\\x2c", "-":"\\x2d", ".":"\\x2e", "/":"\\/", ":":"\\x3a", "<":"\\x3c", "=":"\\x3d", ">":"\\x3e", "?":"\\x3f", "[":"\\x5b", "\\":"\\\\", "]":"\\x5d", "^":"\\x5e", "{":"\\x7b", "|":"\\x7c", "}":"\\x7d", "\u0085":"\\x85", "\u2028":"\\u2028", 
"\u2029":"\\u2029"};
soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_[ch];
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_ = {"\x00":"\\0 ", "\b":"\\8 ", "\t":"\\9 ", "\n":"\\a ", "\x0B":"\\b ", "\f":"\\c ", "\r":"\\d ", '"':"\\22 ", "&":"\\26 ", "'":"\\27 ", "(":"\\28 ", ")":"\\29 ", "*":"\\2a ", "/":"\\2f ", ":":"\\3a ", ";":"\\3b ", "<":"\\3c ", "=":"\\3d ", ">":"\\3e ", "@":"\\40 ", "\\":"\\5c ", "{":"\\7b ", "}":"\\7d ", "\u0085":"\\85 ", "\u00a0":"\\a0 ", "\u2028":"\\2028 ", "\u2029":"\\2029 "};
soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_[ch];
};
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_ = {"\x00":"%00", "\u0001":"%01", "\u0002":"%02", "\u0003":"%03", "\u0004":"%04", "\u0005":"%05", "\u0006":"%06", "\u0007":"%07", "\b":"%08", "\t":"%09", "\n":"%0A", "\x0B":"%0B", "\f":"%0C", "\r":"%0D", "\u000e":"%0E", "\u000f":"%0F", "\u0010":"%10", "\u0011":"%11", "\u0012":"%12", "\u0013":"%13", "\u0014":"%14", "\u0015":"%15", "\u0016":"%16", "\u0017":"%17", "\u0018":"%18", "\u0019":"%19", "\u001a":"%1A", 
"\u001b":"%1B", "\u001c":"%1C", "\u001d":"%1D", "\u001e":"%1E", "\u001f":"%1F", " ":"%20", '"':"%22", "'":"%27", "(":"%28", ")":"%29", "<":"%3C", ">":"%3E", "\\":"%5C", "{":"%7B", "}":"%7D", "\u007f":"%7F", "\u0085":"%C2%85", "\u00a0":"%C2%A0", "\u2028":"%E2%80%A8", "\u2029":"%E2%80%A9", "\uff01":"%EF%BC%81", "\uff03":"%EF%BC%83", "\uff04":"%EF%BC%84", "\uff06":"%EF%BC%86", "\uff07":"%EF%BC%87", "\uff08":"%EF%BC%88", "\uff09":"%EF%BC%89", "\uff0a":"%EF%BC%8A", "\uff0b":"%EF%BC%8B", "\uff0c":"%EF%BC%8C", 
"\uff0f":"%EF%BC%8F", "\uff1a":"%EF%BC%9A", "\uff1b":"%EF%BC%9B", "\uff1d":"%EF%BC%9D", "\uff1f":"%EF%BC%9F", "\uff20":"%EF%BC%A0", "\uff3b":"%EF%BC%BB", "\uff3d":"%EF%BC%BD"};
soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_[ch];
};
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_ = /[\x00\x22\x27\x3c\x3e]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x26\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_ = /[\x00\x08-\x0d\x22\x26\x27\/\x3c-\x3e\\\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_ = /[\x00\x08-\x0d\x22\x24\x26-\/\x3a\x3c-\x3f\x5b-\x5e\x7b-\x7d\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_ = /[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_ = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g;
soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_ = /^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|)$/i;
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_ = /^(?![^#?]*\/(?:\.|%2E){2}(?:[\/?#]|$))(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i;
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_MEDIA_URI_ = /^[^&:\/?#]*(?:[\/?#]|$)|^https?:|^data:image\/[a-z0-9+]+;base64,[a-z0-9+\/]+=*$|^blob:/i;
soy.esc.$$FILTER_FOR_FILTER_IMAGE_DATA_URI_ = /^data:image\/(?:bmp|gif|jpe?g|png|tiff|webp);base64,[a-z0-9+\/]+=*$/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_ = /^(?!style|on|action|archive|background|cite|classid|codebase|data|dsync|href|longdesc|src|usemap)(?:[a-z0-9_$:-]*)$/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_ = /^(?!script|style|title|textarea|xmp|no)[a-z0-9_$:-]*$/i;
soy.esc.$$normalizeHtmlHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_, soy.esc.$$REPLACER_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};
soy.esc.$$escapeHtmlNospaceHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};
soy.esc.$$normalizeHtmlNospaceHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};
soy.esc.$$escapeJsStringHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_);
};
soy.esc.$$escapeJsRegexHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_);
};
soy.esc.$$escapeCssStringHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_);
};
soy.esc.$$filterCssValueHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterCssValue", [str]);
    return "zSoyz";
  }
  return str;
};
soy.esc.$$normalizeUriHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_);
};
soy.esc.$$filterNormalizeUriHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterNormalizeUri", [str]);
    return "#zSoyz";
  }
  return str.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_);
};
soy.esc.$$filterNormalizeMediaUriHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_MEDIA_URI_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterNormalizeMediaUri", [str]);
    return "about:invalid#zSoyz";
  }
  return str.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_);
};
soy.esc.$$filterImageDataUriHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_IMAGE_DATA_URI_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterImageDataUri", [str]);
    return "data:image/gif;base64,zSoyz";
  }
  return str;
};
soy.esc.$$filterHtmlAttributesHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterHtmlAttributes", [str]);
    return "zSoyz";
  }
  return str;
};
soy.esc.$$filterHtmlElementNameHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterHtmlElementName", [str]);
    return "zSoyz";
  }
  return str;
};
soy.esc.$$HTML_TAG_REGEX_ = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g;
soy.esc.$$LT_REGEX_ = /</g;
soy.esc.$$SAFE_TAG_WHITELIST_ = {"b":true, "br":true, "em":true, "i":true, "s":true, "sub":true, "sup":true, "u":true};
soy.esc.$$HTML_ATTRIBUTE_REGEX_ = /([a-zA-Z][a-zA-Z0-9:\-]*)[\t\n\r\u0020]*=[\t\n\r\u0020]*("[^"]*"|'[^']*')/g;
goog.provide("vsaq.questionnaire.templates");
goog.require("soy");
goog.require("soydata");
vsaq.questionnaire.templates.sectionsHeader = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div id="_vsaq_sections_header">Sections</div>');
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.sectionsHeader.soyTemplateName = "vsaq.questionnaire.templates.sectionsHeader";
}
vsaq.questionnaire.templates.questionnaireSection = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<li><a title="Open section #' + soy.$$escapeHtmlAttribute(opt_data.sectionHtml) + '"><div class="vsaq-section-title">' + soy.$$escapeHtml(opt_data.sectionHtml) + '</div></a><div class="vsaq-section-status"><span class="vsaq-unanswered-count">x</span> questions unanswered</div></li>');
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.questionnaireSection.soyTemplateName = "vsaq.questionnaire.templates.questionnaireSection";
}
vsaq.questionnaire.templates.block = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<fieldset id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" class="vsaq-item vsaq-block"><legend><span name="text" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.captionHtml) + "</span>" + (opt_data.blockId ? '<a href="#' + soy.$$escapeHtmlAttribute(opt_data.blockId) + '" name="' + soy.$$escapeHtmlAttribute(opt_data.blockId) + '" class="vsaq-block-link">&#x1f517;</a>' : "") + "</legend></fieldset>");
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.block.soyTemplateName = "vsaq.questionnaire.templates.block";
}
vsaq.questionnaire.templates.editablePropertyValue = function(opt_data, opt_ignored) {
  var output = '<span name="' + soy.$$escapeHtmlAttribute(opt_data.propertyInformation.nameInClass) + '" class="' + (!opt_data.propertyInformation.unchangeable ? opt_data.propertyInformation.defaultValues ? "vsaq-select-text" : "vsaq-label-text" : "") + '">';
  if (opt_data.propertyInformation.defaultValues) {
    output += "<select>" + (!opt_data.propertyInformation.mandatory ? '<option value="">none</option>' : "");
    var defaultTypeKeyList42 = soy.$$getMapKeys(opt_data.propertyInformation.defaultValues);
    var defaultTypeKeyListLen42 = defaultTypeKeyList42.length;
    for (var defaultTypeKeyIndex42 = 0;defaultTypeKeyIndex42 < defaultTypeKeyListLen42;defaultTypeKeyIndex42++) {
      var defaultTypeKeyData42 = defaultTypeKeyList42[defaultTypeKeyIndex42];
      output += '<option value="' + soy.$$escapeHtmlAttribute(opt_data.propertyInformation.defaultValues[defaultTypeKeyData42]) + '"' + (opt_data.propertyInformation.defaultValues[defaultTypeKeyData42] == opt_data.propertyInformation.value ? 'selected="selected"' : "") + ">" + soy.$$escapeHtml(opt_data.propertyInformation.defaultValues[defaultTypeKeyData42]) + "</option>";
    }
    output += "</select>";
  } else {
    output += soy.$$escapeHtml(opt_data.propertyInformation.value || "none");
  }
  output += "</span>";
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.editablePropertyValue.soyTemplateName = "vsaq.questionnaire.templates.editablePropertyValue";
}
vsaq.questionnaire.templates.editablePrefix = function(opt_data, opt_ignored) {
  var output = '<div><table width="100%">';
  var knownPropertyIndexList59 = soy.$$getMapKeys(opt_data.knownPropertiesKeys);
  var knownPropertyIndexListLen59 = knownPropertyIndexList59.length;
  for (var knownPropertyIndexIndex59 = 0;knownPropertyIndexIndex59 < knownPropertyIndexListLen59;knownPropertyIndexIndex59++) {
    var knownPropertyIndexData59 = knownPropertyIndexList59[knownPropertyIndexIndex59];
    output += "<tr><td>" + soy.$$escapeHtml(opt_data.knownPropertiesKeys[knownPropertyIndexData59]) + "</td><td>" + (!opt_data.knownPropertiesValues[knownPropertyIndexData59].metadata && !opt_data.knownPropertiesValues[knownPropertyIndexData59].defaultValues && opt_data.knownPropertiesValues[knownPropertyIndexData59].value ? '<span name="' + soy.$$escapeHtmlAttribute(opt_data.knownPropertiesValues[knownPropertyIndexData59].nameInClass) + '" class="vsaq-remove-text"><input type="checkbox" checked="checked" class="vsaq-checkbox"></span>' : 
    vsaq.questionnaire.templates.editablePropertyValue({propertyInformation:opt_data.knownPropertiesValues[knownPropertyIndexData59]})) + "</td></tr>";
  }
  output += "</table></div>";
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.editablePrefix.soyTemplateName = "vsaq.questionnaire.templates.editablePrefix";
}
vsaq.questionnaire.templates.editableSuffix = function(opt_data, opt_ignored) {
  var output = '<div><a class="maia-button eh-add-to-item">Add</a>&nbsp;<select>';
  var typeList76 = opt_data.types;
  var typeListLen76 = typeList76.length;
  for (var typeIndex76 = 0;typeIndex76 < typeListLen76;typeIndex76++) {
    var typeData76 = typeList76[typeIndex76];
    output += '<option value="' + soy.$$escapeHtmlAttribute(typeData76) + '" ' + (typeData76 == opt_data.defaultType ? 'selected="selected"' : "") + ">" + soy.$$escapeHtml(typeData76) + "</option>";
  }
  output += "</select>&nbsp;" + (opt_data.defaultType != "block" && opt_data.defaultType != "radiogroup" && opt_data.defaultType != "checkgroup" ? '<a class="maia-button eh-copy-item">Copy</a>&nbsp;' : "") + '<a class="maia-button eh-remove-from-item">Remove</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="maia-button eh-move-item-up">&#x25B2;</a><a class="maia-button eh-move-item-down">&#x25BC;</a></div>';
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.editableSuffix.soyTemplateName = "vsaq.questionnaire.templates.editableSuffix";
}
vsaq.questionnaire.templates.editableTrigger = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="vsaq-editable" style="display:inline">&nbsp;<img class="vsaq-icon eh-make-editable" src="/static/mode_edit.png" title="edit/save" alt="edit/save"/>[' + soy.$$escapeHtml(opt_data.itemType) + "]</div>");
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.editableTrigger.soyTemplateName = "vsaq.questionnaire.templates.editableTrigger";
}
vsaq.questionnaire.templates.radio = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="vsaq-item vsaq-radio-item" data-vsaq-container-for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '"><label><input name="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" type="radio" id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" class="vsaq-radiobutton"> <span name="text" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.captionHtml) + "</span></label></div>");
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.radio.soyTemplateName = "vsaq.questionnaire.templates.radio";
}
vsaq.questionnaire.templates.yesno = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="vsaq-item vsaq-yesno-block" data-vsaq-container-for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '"><div class="vsaq-question-title"><span name="text" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.captionHtml) + '</span></div><label><input name="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '/yes" type="radio" value="yes" class="vsaq-radiobutton"> <span name="yes" class="vsaq-label-text">' + 
  soy.$$escapeHtml(opt_data.yesHtml) + '</span></label><label><input name="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '/no" type="radio" value="no" class="vsaq-radiobutton"> <span name="no" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.noHtml) + "</span></label></div>");
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.yesno.soyTemplateName = "vsaq.questionnaire.templates.yesno";
}
vsaq.questionnaire.templates.groupitem = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" class="vsaq-item vsaq-group-item"><div class="vsaq-question-title"><span name="text" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.captionHtml) + "</span></div></div>");
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.groupitem.soyTemplateName = "vsaq.questionnaire.templates.groupitem";
}
vsaq.questionnaire.templates.info = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" class="vsaq-item vsaq-info-item"><span name="info" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.captionHtml) + "</span></div>");
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.info.soyTemplateName = "vsaq.questionnaire.templates.info";
}
vsaq.questionnaire.templates.group = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" class="vsaq-item vsaq-group-item"></div>');
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.group.soyTemplateName = "vsaq.questionnaire.templates.group";
}
vsaq.questionnaire.templates.spacer = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" class="vsaq-item"><hr class="vsaq-spacer" /></div>');
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.spacer.soyTemplateName = "vsaq.questionnaire.templates.spacer";
}
vsaq.questionnaire.templates.check = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="vsaq-item vsaq-checkbox-item" data-vsaq-container-for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '"><label><input type="checkbox" name="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" class="vsaq-checkbox"> <span name="text" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.captionHtml) + "</span></label></div>");
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.check.soyTemplateName = "vsaq.questionnaire.templates.check";
}
vsaq.questionnaire.templates.bubble = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="vsaq-item vsaq-bubble-block" data-vsaq-container-for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '"><div class="maia-notification ' + (opt_data.isWarning ? "vsaq-bubble-" + soy.$$escapeHtmlAttribute(opt_data.severity || "medium") : "") + '"><p><strong>' + (opt_data.customTitle ? '<span name="customTitle" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.customTitle) + "</span>" : opt_data.isWarning ? "Warning" + (opt_data.severity ? 
  " &mdash; possible " + soy.$$escapeHtml(opt_data.severity) + "-risk issue" : "") : "Tip") + '</strong></p><p><span name="text" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.contentHtml) + "</span></p>" + (opt_data.whyHtml ? '<div class="vsaq-compensating-desc"><i><span name="clarification" class="vsaq-label-text">' + soy.$$escapeHtml(opt_data.whyHtml) + '</span></i><br><textarea id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" class="vsaq-box">' + (opt_data.whyValue ? soy.$$escapeHtmlRcdata(opt_data.whyValue) : 
  "") + "</textarea></div>" : "") + "</div></div>");
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.bubble.soyTemplateName = "vsaq.questionnaire.templates.bubble";
}
vsaq.questionnaire.templates.box = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="vsaq-item" data-vsaq-container-for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '"><div class="vsaq-question-title"><label name="text" class="vsaq-label-text" for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '">' + soy.$$escapeHtml(opt_data.captionHtml) + '</label></div><textarea id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '"' + (opt_data.placeholder ? 'placeholder="' + soy.$$escapeHtmlAttribute(opt_data.placeholder) + '" ' : "") + 
  (opt_data.inputPattern ? 'pattern="' + soy.$$escapeHtmlAttribute(opt_data.inputPattern) + '" ' : "") + (opt_data.inputTitle ? 'title="' + soy.$$escapeHtmlAttribute(opt_data.inputTitle) + '" ' : "") + (opt_data.isRequired ? "required " : "") + (opt_data.maxlength ? 'maxlength="' + soy.$$escapeHtmlAttribute(opt_data.maxlength) + '" ' : "") + 'class="vsaq-box"></textarea></div>');
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.box.soyTemplateName = "vsaq.questionnaire.templates.box";
}
vsaq.questionnaire.templates.line = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="vsaq-item" data-vsaq-container-for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '"><div class="vsaq-question-title"><label name="text" class="vsaq-label-text" for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '">' + soy.$$escapeHtml(opt_data.captionHtml) + '</label></div><input id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '"' + (opt_data.placeholder ? 'placeholder="' + soy.$$escapeHtmlAttribute(opt_data.placeholder) + '" ' : "") + 
  (opt_data.isRequired ? "required " : "") + (opt_data.inputPattern ? 'pattern="' + soy.$$escapeHtmlAttribute(opt_data.inputPattern) + '" ' : "") + (opt_data.inputTitle ? 'title="' + soy.$$escapeHtmlAttribute(opt_data.inputTitle) + '" ' : "") + (opt_data.maxlength ? 'maxlength="' + soy.$$escapeHtmlAttribute(opt_data.maxlength) + '" ' : "") + (opt_data.type ? 'type="' + soy.$$escapeHtmlAttribute(opt_data.type) + '" ' : "") + 'class="vsaq-line"><p></p></div>');
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.line.soyTemplateName = "vsaq.questionnaire.templates.line";
}
vsaq.questionnaire.templates.upload = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="vsaq-item" data-vsaq-container-for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '"><div class="vsaq-question-title"><label name="text" class="vsaq-label-text" for="' + soy.$$escapeHtmlAttribute(opt_data.id) + '-file">' + soy.$$escapeHtml(opt_data.captionHtml) + '</label></div><div class="vsaq-question-title">The following file types are allowed: PDF, ODT, DOC, DOCX</div><form enctype="multipart/form-data" method="POST" id="' + soy.$$escapeHtmlAttribute(opt_data.id) + 
  '-form"><span id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '-label"></span> <input type="file" name="file" class="vsaq-upload" id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '-file"> <a href="javascript:void(0)" id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '-download">Download</a> <a href="javascript:void(0)" id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '-delete">Delete</a></form><p></p></div>');
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.upload.soyTemplateName = "vsaq.questionnaire.templates.upload";
}
vsaq.questionnaire.templates.todoList = function(opt_data, opt_ignored) {
  var output = '<fieldset class="vsaq-item vsaq-block"><legend>Todo List</legend>';
  if (opt_data.todoListItems.length) {
    output += "<p>Based on your selections, we have compiled the following todo list for you:</p><ul id='vsaq_todo_ul'>";
    var todoList288 = opt_data.todoListItems;
    var todoListLen288 = todoList288.length;
    for (var todoIndex288 = 0;todoIndex288 < todoListLen288;todoIndex288++) {
      var todoData288 = todoList288[todoIndex288];
      output += "<li><label><input type='checkbox' name='" + soy.$$escapeHtmlAttribute(todoData288.key) + "' class='eh-todo-item'" + (opt_data.todoStatus[todoData288.key] == "checked" ? "checked " : "") + "id='" + soy.$$escapeHtmlAttribute(todoData288.key) + "' value='checked'><span>" + soy.$$escapeHtml(todoData288.description) + "</span></label></li>";
    }
    output += "</ul>";
  } else {
    output += "<p>Great news, you're all set. There is no todo.</p>";
  }
  output += "</fieldset>";
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  vsaq.questionnaire.templates.todoList.soyTemplateName = "vsaq.questionnaire.templates.todoList";
}
;goog.provide("vsaq.questionnaire.items.SpacerItem");
goog.require("goog.dom");
goog.require("goog.soy");
goog.require("vsaq.questionnaire.items.Item");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.templates");
vsaq.questionnaire.items.SpacerItem = function(id, conditions) {
  goog.base(this, id, conditions);
  this.render();
};
goog.inherits(vsaq.questionnaire.items.SpacerItem, vsaq.questionnaire.items.Item);
vsaq.questionnaire.items.SpacerItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.spacer, {id:this.id});
  goog.dom.replaceNode(this.container, oldNode);
};
vsaq.questionnaire.items.SpacerItem.TYPE = "spacer";
vsaq.questionnaire.items.SpacerItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.SpacerItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.SpacerItem(item.id, item.cond);
};
goog.provide("vsaq.questionnaire.items.BoxItem");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.soy");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.templates");
goog.require("vsaq.questionnaire.utils");
vsaq.questionnaire.items.BoxItem = function(id, conditions, caption, opt_placeholder, opt_inputPattern, opt_inputTitle, opt_isRequired, opt_maxlength) {
  goog.base(this, id, conditions, caption, opt_placeholder, opt_inputPattern, opt_inputTitle, opt_isRequired, opt_maxlength);
  this.textArea_;
  this.render();
};
goog.inherits(vsaq.questionnaire.items.BoxItem, vsaq.questionnaire.items.ValueItem);
vsaq.questionnaire.items.BoxItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.box, {id:this.id, captionHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.text), placeholder:this.placeholder, inputPattern:this.inputPattern, inputTitle:this.inputTitle, isRequired:Boolean(this.required), maxlength:this.maxlength});
  goog.dom.replaceNode(this.container, oldNode);
  this.textArea_ = (vsaq.questionnaire.utils.findById(this.container, this.id));
  goog.events.listen(this.textArea_, [goog.events.EventType.KEYUP, goog.events.EventType.CHANGE], this.answerChanged, true, this);
};
vsaq.questionnaire.items.BoxItem.TYPE = "box";
vsaq.questionnaire.items.BoxItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.BoxItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.BoxItem(item.id, item.cond, item.text, item.placeholder, item.inputPattern, item.inputTitle, item.required, item.maxlength);
};
vsaq.questionnaire.items.BoxItem.prototype.setReadOnly = function(readOnly) {
  this.textArea_.readOnly = readOnly;
};
vsaq.questionnaire.items.BoxItem.prototype.getValue = function() {
  return this.textArea_.value;
};
vsaq.questionnaire.items.BoxItem.prototype.setInternalValue = function(value) {
  this.textArea_.value = (value);
};
vsaq.questionnaire.items.BoxItem.prototype.isAnswered = function() {
  return this.getValue().length > 0;
};
goog.provide("vsaq.questionnaire.items.UploadItem");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.net.EventType");
goog.require("goog.net.IframeIo");
goog.require("goog.net.XhrIo");
goog.require("goog.soy");
goog.require("goog.string");
goog.require("goog.string.format");
goog.require("goog.style");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.templates");
goog.require("vsaq.questionnaire.utils");
vsaq.questionnaire.items.UploadItem = function(id, conditions, caption) {
  goog.base(this, id, conditions, caption);
  this.form_;
  this.label_;
  this.deleteLink_;
  this.downloadLink_;
  this.filename_ = "";
  this.fileId_ = "";
  this.fileInput_;
  this.render();
};
goog.inherits(vsaq.questionnaire.items.UploadItem, vsaq.questionnaire.items.ValueItem);
vsaq.questionnaire.items.UploadItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.upload, {id:this.id, captionHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.text)});
  goog.dom.replaceNode(this.container, oldNode);
  this.form_ = (vsaq.questionnaire.utils.findById(this.container, this.id + "-form"));
  this.label_ = (vsaq.questionnaire.utils.findById(this.container, this.id + "-label"));
  this.deleteLink_ = (vsaq.questionnaire.utils.findById(this.container, this.id + "-delete"));
  goog.style.setElementShown(this.deleteLink_, false);
  this.downloadLink_ = (vsaq.questionnaire.utils.findById(this.container, this.id + "-download"));
  goog.style.setElementShown(this.downloadLink_, false);
  this.fileInput_ = (vsaq.questionnaire.utils.findById(this.container, this.id + "-file"));
  goog.events.listen(this.downloadLink_, goog.events.EventType.CLICK, function(e) {
    e.target.href = goog.string.format("/download/%s?q=%s", this.fileId_, encodeURIComponent(document.location.pathname));
  }, true, this);
  goog.events.listen(this.deleteLink_, goog.events.EventType.CLICK, function(e) {
    if (confirm("Are you sure you would like to delete this file?")) {
      this.deleteFile_(e);
    }
  }, true, this);
  goog.events.listen(vsaq.questionnaire.utils.findById(this.container, this.id + "-file"), goog.events.EventType.CHANGE, this.handleUpload_, true, this);
};
vsaq.questionnaire.items.UploadItem.TYPE = "upload";
vsaq.questionnaire.items.UploadItem.FETCH_URL_URL = "/ajax?f=GetUploadUrl";
vsaq.questionnaire.items.UploadItem.VALID_EXTENSIONS = ["pdf", "odt", "doc", "docx"];
vsaq.questionnaire.items.UploadItem.prototype.handleUpload_ = function() {
  var file = this.fileInput_.value;
  if (!file) {
    return;
  }
  var ext = file.substring(file.lastIndexOf(".") + 1).toLowerCase();
  if (!goog.array.contains(vsaq.questionnaire.items.UploadItem.VALID_EXTENSIONS, ext)) {
    this.deleteFile_();
    goog.dom.setTextContent(this.label_, "Invalid extension.");
    return;
  }
  goog.net.XhrIo.send(vsaq.questionnaire.items.UploadItem.FETCH_URL_URL, goog.bind(function(e) {
    if (e.target.isSuccess()) {
      var body = e.target.getResponseJson();
      this.form_.action = body["url"];
      var io = new goog.net.IframeIo;
      goog.events.listen(io, [goog.net.EventType.COMPLETE], this.handleCompletedUpload_, true, this);
      io.sendFromForm(this.form_);
      goog.dom.setTextContent(this.label_, "Uploading...");
      goog.style.setElementShown(this.fileInput_, false);
    }
  }, this), "POST", "q=" + encodeURIComponent(document.location.pathname));
};
vsaq.questionnaire.items.UploadItem.prototype.handleCompletedUpload_ = function(e) {
  var response = {};
  try {
    response = e.target.getResponseJson();
  } catch (err) {
  }
  if (response["filename"] && response["fileId"]) {
    this.setValue(response["fileId"] + "|" + response["filename"]);
  } else {
    this.deleteFile_();
    var error = response["error"] || "Error. Upload unsuccessful.";
    goog.dom.setTextContent(this.label_, error);
  }
};
vsaq.questionnaire.items.UploadItem.prototype.deleteFile_ = function(opt_event) {
  this.filename_ = "";
  this.fileId_ = "";
  this.form_.reset();
  goog.dom.setTextContent(this.label_, "");
  goog.style.setElementShown(this.deleteLink_, false);
  goog.style.setElementShown(this.downloadLink_, false);
  goog.style.setElementShown(this.fileInput_, true);
  if (opt_event) {
    this.answerChanged();
  }
};
vsaq.questionnaire.items.UploadItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.UploadItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.UploadItem(item.id, item.cond, item.text);
};
vsaq.questionnaire.items.UploadItem.prototype.setReadOnly = function(readOnly) {
  this.fileInput_.readOnly = readOnly;
};
vsaq.questionnaire.items.UploadItem.prototype.getValue = function() {
  if (this.fileId_ && this.filename_) {
    return this.fileId_ + "|" + this.filename_;
  }
  return "";
};
vsaq.questionnaire.items.UploadItem.prototype.setInternalValue = function(value) {
  var parts = value.split("|");
  if (parts.length == 2) {
    this.fileId_ = parts[0];
    this.filename_ = parts[1];
    goog.dom.setTextContent(this.label_, "Uploaded file: " + this.filename_);
    this.downloadLink_.href = goog.string.format("/download/%s?q=%s", this.fileId_, encodeURIComponent(document.location.pathname));
    goog.style.setElementShown(this.deleteLink_, true);
    goog.style.setElementShown(this.downloadLink_, true);
    goog.style.setElementShown(this.fileInput_, false);
    this.form_.reset();
  } else {
    if (!value) {
      this.deleteFile_();
    }
  }
};
vsaq.questionnaire.items.UploadItem.prototype.isAnswered = function() {
  return this.fileId_.length > 0;
};
goog.provide("vsaq.questionnaire.items.InfoItem");
goog.require("goog.dom");
goog.require("goog.soy");
goog.require("goog.string");
goog.require("vsaq.questionnaire.items.Item");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.templates");
vsaq.questionnaire.items.InfoItem = function(id, conditions, info) {
  goog.base(this, id, conditions);
  this.info = goog.string.makeSafe(info);
  var propertyInformation = {nameInClass:"info", mandatory:true};
  this.addPropertyInformation("text", propertyInformation);
  this.render();
};
goog.inherits(vsaq.questionnaire.items.InfoItem, vsaq.questionnaire.items.Item);
vsaq.questionnaire.items.InfoItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.info, {id:this.id, captionHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.info)});
  goog.dom.replaceNode(this.container, oldNode);
};
vsaq.questionnaire.items.InfoItem.TYPE = "info";
vsaq.questionnaire.items.InfoItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.InfoItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.InfoItem(item.id, item.cond, item.text);
};
goog.provide("vsaq.questionnaire.items.RadioItem");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.soy");
goog.require("vsaq.questionnaire.items.Item");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.templates");
goog.require("vsaq.questionnaire.utils");
vsaq.questionnaire.items.RadioItem = function(id, conditions, caption) {
  goog.base(this, id, conditions, caption);
  this.radioButton;
  this.render();
};
goog.inherits(vsaq.questionnaire.items.RadioItem, vsaq.questionnaire.items.ValueItem);
vsaq.questionnaire.items.RadioItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.radio, {id:this.id, captionHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.text)});
  goog.dom.replaceNode(this.container, oldNode);
  this.radioButton = (vsaq.questionnaire.utils.findById(this.container, this.id));
  goog.events.listen(this.radioButton, [goog.events.EventType.CHANGE], function(e) {
    if (this.radioButton.checked) {
      this.answerChanged();
    }
  }, true, this);
};
vsaq.questionnaire.items.RadioItem.CHECKED_VALUE = "checked";
vsaq.questionnaire.items.RadioItem.TYPE = "radio";
vsaq.questionnaire.items.RadioItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.RadioItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.RadioItem(item.id, item.cond, item.text);
};
vsaq.questionnaire.items.RadioItem.prototype.setReadOnly = function(readOnly) {
  this.radioButton.disabled = readOnly;
};
vsaq.questionnaire.items.RadioItem.prototype.isChecked = function(opt_value) {
  return this.radioButton.checked;
};
vsaq.questionnaire.items.RadioItem.prototype.answerChanged = function() {
  var changes = {};
  var containerItems = this.parentItem.getContainerItems();
  goog.array.forEach(containerItems, function(item) {
    if (item instanceof vsaq.questionnaire.items.RadioItem) {
      changes[item.id] = item.getValue();
    }
  });
  changes[this.id] = this.getValue();
  var ev = {type:vsaq.questionnaire.items.Item.CHANGED, source:this, changes:changes};
  this.eventDispatcher.dispatchEvent(ev);
};
vsaq.questionnaire.items.RadioItem.prototype.getValue = function() {
  return this.radioButton.checked ? vsaq.questionnaire.items.RadioItem.CHECKED_VALUE : "";
};
vsaq.questionnaire.items.RadioItem.prototype.parentItemSet = function(parentItem) {
  this.parentItem = parentItem;
  this.radioButton.name = "radio_" + parentItem.id;
};
vsaq.questionnaire.items.RadioItem.prototype.setInternalValue = function(value) {
  if (goog.isBoolean(value) && value) {
    this.radioButton.checked = true;
  } else {
    if (goog.isString(value) && value == vsaq.questionnaire.items.RadioItem.CHECKED_VALUE) {
      this.radioButton.checked = true;
    }
  }
};
vsaq.questionnaire.items.RadioItem.prototype.isAnswered = function() {
  throw "This function should never be called.";
};
goog.provide("vsaq.questionnaire.items.BlockItem");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.soy");
goog.require("goog.string");
goog.require("vsaq.questionnaire.items.ContainerItem");
goog.require("vsaq.questionnaire.items.Item");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.RadioItem");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.templates");
vsaq.questionnaire.items.BlockItem = function(id, conditions, caption, opt_auth, opt_className) {
  goog.base(this, id, conditions);
  this.auth = goog.string.makeSafe(opt_auth);
  var propertyInformation = {nameInClass:"auth", defaultValues:{admin:"admin"}, metadata:true};
  this.addPropertyInformation("auth", propertyInformation);
  this.className = goog.string.makeSafe(opt_className);
  propertyInformation = {nameInClass:"className", defaultValues:{vsaq_invisible:"vsaq-invisible"}, metadata:true};
  this.addPropertyInformation("className", propertyInformation);
  this.text = goog.string.makeSafe(caption);
  propertyInformation = {nameInClass:"text", mandatory:true};
  this.addPropertyInformation("text", propertyInformation);
  this.render();
};
goog.inherits(vsaq.questionnaire.items.BlockItem, vsaq.questionnaire.items.ContainerItem);
vsaq.questionnaire.items.BlockItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.block, {id:this.id, captionHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.text), blockId:this.id});
  goog.array.forEach(this.containerItems, function(item) {
    this.container.appendChild(item.container);
  }, this);
  goog.dom.replaceNode(this.container, oldNode);
};
vsaq.questionnaire.items.BlockItem.prototype.getUnansweredCount = function() {
  var count = 0, radioChecked = false, hasRadio = false;
  goog.array.forEach(this.containerItems, function(item) {
    if (item instanceof vsaq.questionnaire.items.RadioItem) {
      hasRadio = true;
      if (item.isChecked()) {
        radioChecked = true;
      }
      return;
    }
    if (item instanceof vsaq.questionnaire.items.ValueItem && item.isVisible() && !item.isAnswered()) {
      count++;
    }
    if (item instanceof vsaq.questionnaire.items.BlockItem) {
      count += item.getUnansweredCount();
    }
  }, this);
  if (hasRadio && !radioChecked) {
    count++;
  }
  return count;
};
vsaq.questionnaire.items.BlockItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.BlockItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.BlockItem(item.id, item.cond, item.text, item.auth, item.className);
};
vsaq.questionnaire.items.BlockItem.prototype.exportItem = function() {
  var exportProperties = vsaq.questionnaire.items.Item.prototype.exportItem.call(this);
  var containerItems = [];
  goog.array.forEach(this.containerItems, function(item) {
    containerItems.push(item.exportItem());
  });
  exportProperties.set("items", containerItems);
  return exportProperties;
};
vsaq.questionnaire.items.BlockItem.TYPE = "block";
goog.provide("vsaq.questionnaire.items.TipItem");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.soy");
goog.require("goog.string");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.templates");
goog.require("vsaq.questionnaire.utils");
vsaq.questionnaire.items.TipItem = function(id, conditions, text, warn, opt_severity, opt_clarification, opt_name, opt_todo, opt_customTitle) {
  goog.base(this, id, conditions, text);
  this.warn = warn;
  var propertyInformation = {nameInClass:"warn", defaultValues:{"true":"yes"}};
  this.addPropertyInformation("warn", propertyInformation);
  this.name = goog.string.makeSafe(opt_name);
  propertyInformation = {nameInClass:"name", metadata:true};
  this.addPropertyInformation("name", propertyInformation);
  this.clarification = goog.string.makeSafe(opt_clarification);
  propertyInformation = {nameInClass:"clarification"};
  this.addPropertyInformation("why", propertyInformation);
  this.todo = goog.string.makeSafe(opt_todo);
  propertyInformation = {nameInClass:"todo", metadata:true};
  this.addPropertyInformation("todo", propertyInformation);
  this.customTitle = goog.string.makeSafe(opt_customTitle);
  propertyInformation = {nameInClass:"customTitle"};
  this.addPropertyInformation("customTitle", propertyInformation);
  this.severity = opt_severity || "";
  propertyInformation = {nameInClass:"severity", defaultValues:{medium:"medium", high:"high", critical:"critical"}, dependencies:{warn:"yes"}};
  this.addPropertyInformation("severity", propertyInformation);
  this.textArea_;
  this.render();
};
goog.inherits(vsaq.questionnaire.items.TipItem, vsaq.questionnaire.items.ValueItem);
vsaq.questionnaire.items.TipItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.bubble, {contentHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.text), id:this.id, whyHtml:this.clarification ? soydata.VERY_UNSAFE.ordainSanitizedHtml(this.clarification) : "", isWarning:this.warn, severity:this.severity, customTitle:this.customTitle});
  goog.dom.replaceNode(this.container, oldNode);
  if (this.clarification) {
    this.textArea_ = (vsaq.questionnaire.utils.findById(this.container, this.id));
    goog.events.listen(this.textArea_, [goog.events.EventType.KEYUP, goog.events.EventType.CHANGE], this.answerChanged, true, this);
  }
};
vsaq.questionnaire.items.TipItem.TYPE = "tip";
vsaq.questionnaire.items.TipItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.TipItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  var isWarn = goog.string.makeSafe(item.warn) == "yes";
  return new vsaq.questionnaire.items.TipItem(item.id, item.cond, item.text, isWarn, item.severity, item.why, item.name, item.todo, item.customTitle);
};
vsaq.questionnaire.items.TipItem.prototype.setReadOnly = function(readOnly) {
  if (this.textArea_) {
    this.textArea_.readOnly = readOnly;
  }
};
vsaq.questionnaire.items.TipItem.prototype.getValue = function() {
  if (this.textArea_) {
    return this.textArea_.value;
  }
  return null;
};
vsaq.questionnaire.items.TipItem.prototype.setInternalValue = function(value) {
  if (this.textArea_) {
    this.textArea_.value = (value);
  }
};
vsaq.questionnaire.items.TipItem.prototype.isAnswered = function() {
  return true;
};
goog.provide("vsaq.questionnaire.items.LineItem");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.soy");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.templates");
goog.require("vsaq.questionnaire.utils");
vsaq.questionnaire.items.LineItem = function(id, conditions, caption, opt_inputType, opt_placeholder, opt_inputPattern, opt_inputTitle, opt_isRequired, opt_maxlength) {
  goog.base(this, id, conditions, caption, opt_placeholder, opt_inputPattern, opt_inputTitle, opt_isRequired, opt_maxlength);
  this.textBox_;
  this.inputType = opt_inputType;
  this.render();
};
goog.inherits(vsaq.questionnaire.items.LineItem, vsaq.questionnaire.items.ValueItem);
vsaq.questionnaire.items.LineItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.line, {id:this.id, captionHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.text), type:this.inputType, inputPattern:this.inputPattern, inputTitle:this.inputTitle, placeholder:this.placeholder, isRequired:Boolean(this.required), maxlength:this.maxlength});
  goog.dom.replaceNode(this.container, oldNode);
  this.textBox_ = (vsaq.questionnaire.utils.findById(this.container, this.id));
  goog.events.listen(this.textBox_, [goog.events.EventType.KEYUP, goog.events.EventType.CHANGE], this.answerChanged, true, this);
};
vsaq.questionnaire.items.LineItem.TYPE = "line";
vsaq.questionnaire.items.LineItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.LineItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.LineItem(item.id, item.cond, item.text, item.inputType, item.placeholder, item.inputPattern, item.inputTitle, item.required, item.maxlength);
};
vsaq.questionnaire.items.LineItem.prototype.setReadOnly = function(readOnly) {
  this.textBox_.readOnly = readOnly;
};
vsaq.questionnaire.items.LineItem.prototype.getValue = function() {
  return this.textBox_.value;
};
vsaq.questionnaire.items.LineItem.prototype.setInternalValue = function(value) {
  this.textBox_.value = (value);
};
vsaq.questionnaire.items.LineItem.prototype.isAnswered = function() {
  return this.getValue().length > 0;
};
goog.provide("vsaq.questionnaire.items.YesNoItem");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.soy");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.templates");
goog.require("vsaq.questionnaire.utils");
vsaq.questionnaire.items.YesNoItem = function(id, conditions, caption, yes, no) {
  goog.base(this, id, conditions, caption);
  this.yes = yes;
  var propertyInformation = {nameInClass:"yes", mandatory:true};
  this.addPropertyInformation("yes", propertyInformation);
  this.no = no;
  propertyInformation = {nameInClass:"no", mandatory:true};
  this.addPropertyInformation("no", propertyInformation);
  this.yesRadio_;
  this.noRadio_;
  this.render();
};
goog.inherits(vsaq.questionnaire.items.YesNoItem, vsaq.questionnaire.items.ValueItem);
vsaq.questionnaire.items.YesNoItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.yesno, {id:this.id, captionHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.text), yesHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.yes), noHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.no)});
  goog.dom.replaceNode(this.container, oldNode);
  this.yesRadio_ = (vsaq.questionnaire.utils.findById(this.container, this.id + "/yes"));
  this.noRadio_ = (vsaq.questionnaire.utils.findById(this.container, this.id + "/no"));
  goog.events.listen(this.yesRadio_, goog.events.EventType.CLICK, this.answerChanged, true, this);
  goog.events.listen(this.noRadio_, goog.events.EventType.CLICK, this.answerChanged, true, this);
};
vsaq.questionnaire.items.YesNoItem.YES_VALUE = "yes";
vsaq.questionnaire.items.YesNoItem.NO_VALUE = "no";
vsaq.questionnaire.items.YesNoItem.TYPE = "yesno";
vsaq.questionnaire.items.YesNoItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.YesNoItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.YesNoItem(item.id, item.cond, item.text, item.yes, item.no);
};
vsaq.questionnaire.items.YesNoItem.prototype.setReadOnly = function(readOnly) {
  this.yesRadio_.disabled = readOnly;
  this.noRadio_.disabled = readOnly;
};
vsaq.questionnaire.items.YesNoItem.prototype.isChecked = function(opt_value) {
  if (!opt_value) {
    opt_value = "/yes";
  }
  var exp_value = opt_value.substring(opt_value.lastIndexOf("/") + 1);
  return this.getValue() == exp_value;
};
vsaq.questionnaire.items.YesNoItem.prototype.getValue = function() {
  if (this.yesRadio_.checked) {
    return vsaq.questionnaire.items.YesNoItem.YES_VALUE;
  } else {
    if (this.noRadio_.checked) {
      return vsaq.questionnaire.items.YesNoItem.NO_VALUE;
    }
  }
  return "";
};
vsaq.questionnaire.items.YesNoItem.prototype.setInternalValue = function(value) {
  if (value == vsaq.questionnaire.items.YesNoItem.YES_VALUE) {
    this.yesRadio_.checked = true;
    this.noRadio_.checked = false;
  } else {
    if (value == vsaq.questionnaire.items.YesNoItem.NO_VALUE) {
      this.yesRadio_.checked = false;
      this.noRadio_.checked = true;
    } else {
      this.yesRadio_.checked = false;
      this.noRadio_.checked = false;
    }
  }
};
vsaq.questionnaire.items.YesNoItem.prototype.isAnswered = function() {
  return this.getValue().length > 0;
};
goog.provide("vsaq.questionnaire.items.CheckItem");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.soy");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.templates");
goog.require("vsaq.questionnaire.utils");
vsaq.questionnaire.items.CheckItem = function(id, conditions, caption) {
  goog.base(this, id, conditions, caption);
  this.checkBox_;
  this.render();
};
goog.inherits(vsaq.questionnaire.items.CheckItem, vsaq.questionnaire.items.ValueItem);
vsaq.questionnaire.items.CheckItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.check, {id:this.id, captionHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.text)});
  goog.dom.replaceNode(this.container, oldNode);
  this.checkBox_ = (vsaq.questionnaire.utils.findById(this.container, this.id));
  goog.events.listen(this.checkBox_, goog.events.EventType.CHANGE, this.answerChanged, true, this);
};
vsaq.questionnaire.items.CheckItem.CHECKED_VALUE = "checked";
vsaq.questionnaire.items.CheckItem.TYPE = "check";
vsaq.questionnaire.items.CheckItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.CheckItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.CheckItem(item.id, item.cond, item.text);
};
vsaq.questionnaire.items.CheckItem.prototype.setReadOnly = function(readOnly) {
  this.checkBox_.disabled = readOnly;
};
vsaq.questionnaire.items.CheckItem.prototype.isChecked = function(opt_value) {
  return this.checkBox_.checked;
};
vsaq.questionnaire.items.CheckItem.prototype.getValue = function() {
  return this.checkBox_.checked ? vsaq.questionnaire.items.CheckItem.CHECKED_VALUE : "";
};
vsaq.questionnaire.items.CheckItem.prototype.setInternalValue = function(value) {
  if (goog.isBoolean(value)) {
    this.checkBox_.checked = value;
  } else {
    if (goog.isString(value)) {
      this.checkBox_.checked = value == vsaq.questionnaire.items.CheckItem.CHECKED_VALUE;
    }
  }
};
vsaq.questionnaire.items.CheckItem.prototype.isAnswered = function() {
  return true;
};
goog.provide("vsaq.questionnaire.items.CheckgroupItem");
goog.provide("vsaq.questionnaire.items.GroupItem");
goog.provide("vsaq.questionnaire.items.RadiogroupItem");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.object");
goog.require("goog.soy");
goog.require("goog.string");
goog.require("vsaq.questionnaire.items.CheckItem");
goog.require("vsaq.questionnaire.items.ContainerItem");
goog.require("vsaq.questionnaire.items.Item");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.RadioItem");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.templates");
vsaq.questionnaire.items.GroupItem = function(id, conditions, caption, defaultChoice, choices, choicesConds) {
  goog.base(this, id, conditions);
  this.groupItemType = "";
  this.text = goog.string.makeSafe(caption);
  var propertyInformation = {nameInClass:"text", mandatory:false};
  this.addPropertyInformation("text", propertyInformation);
  this.defaultChoice = defaultChoice;
  propertyInformation = {nameInClass:"defaultChoice", defaultValues:{"true":true, "false":false}, mandatory:true};
  this.addPropertyInformation("defaultChoice", propertyInformation);
  this.defaultChoiceItem = null;
  goog.array.forEach(choices, function(choice) {
    var choiceId = goog.object.getKeys(choice)[0];
    var choiceText = choice[choiceId];
    var choiceCondition = null;
    if (choicesConds) {
      goog.array.some(choicesConds, function(choiceCond) {
        var choiceCondId = goog.object.getKeys(choiceCond)[0];
        if (choiceCondId == choiceId) {
          choiceCondition = choiceCond[choiceCondId];
          return true;
        }
        return false;
      }, this);
    }
    var appendNewItem = this.createSingleItem(choiceId, choiceCondition, choiceText);
    appendNewItem.parentItemSet(this);
    goog.events.listen(appendNewItem.eventDispatcher, vsaq.questionnaire.items.Item.CHANGED, goog.bind(this.answerChanged_, this));
    this.containerItems.push(appendNewItem);
  }, this);
  this.render();
};
goog.inherits(vsaq.questionnaire.items.GroupItem, vsaq.questionnaire.items.ContainerItem);
vsaq.questionnaire.items.GroupItem.prototype.setDefaultChoice = function() {
  if (this.defaultChoice && !this.defaultChoiceItem) {
    var defaultChoiceId = goog.string.createUniqueString();
    this.defaultChoiceItem = this.createSingleItem(defaultChoiceId, null, vsaq.questionnaire.items.GroupItem.DEFAULT_CHOICE);
    this.defaultChoiceItem.parentItemSet(this);
    goog.events.listen(this.defaultChoiceItem.eventDispatcher, vsaq.questionnaire.items.Item.CHANGED, goog.bind(this.answerChanged_, this));
    this.containerItems.push(this.defaultChoiceItem);
  } else {
    if (!this.defaultChoice && this.defaultChoiceItem) {
      this.deleteItem(this.defaultChoiceItem);
      this.defaultChoiceItem = null;
    }
  }
};
vsaq.questionnaire.items.GroupItem.prototype.getValue = function() {
  for (var i = 0;i < this.containerItems.length;i++) {
    if (this.containerItems[i] instanceof vsaq.questionnaire.items.ValueItem && this.containerItems[i].getValue()) {
      return true;
    }
  }
  return false;
};
vsaq.questionnaire.items.GroupItem.prototype.render = function() {
  var oldNode = this.container;
  this.container = goog.soy.renderAsElement(vsaq.questionnaire.templates.groupitem, {id:this.id, captionHtml:soydata.VERY_UNSAFE.ordainSanitizedHtml(this.text)});
  this.setDefaultChoice();
  goog.array.forEach(this.containerItems, function(item) {
    this.container.appendChild(item.container);
  }, this);
  goog.dom.replaceNode(this.container, oldNode);
};
vsaq.questionnaire.items.GroupItem.DEFAULT_CHOICE = "None of the above.";
vsaq.questionnaire.items.GroupItem.prototype.answerChanged_ = function(ev) {
  this.eventDispatcher.dispatchEvent(ev);
};
vsaq.questionnaire.items.GroupItem.prototype.createSingleItem = goog.abstractMethod;
vsaq.questionnaire.items.GroupItem.prototype.exportItem = function() {
  var exportProperties = vsaq.questionnaire.items.Item.prototype.exportItem.call(this);
  var choices = [];
  var choicesConds = [];
  goog.array.forEach(this.containerItems, function(item) {
    if (this.defaultChoiceItem && item.id == this.defaultChoiceItem.id) {
      return;
    }
    var choice = {};
    choice[item.id] = item.text;
    choices.push(choice);
    if (item.conditions && item.conditions.length > 0) {
      var choiceCond = {};
      choiceCond[item.id] = item.conditions;
      choicesConds.push(choiceCond);
    }
  }, this);
  exportProperties.set("choices", choices);
  if (choicesConds.length > 0) {
    exportProperties.set("choicesConds", choicesConds);
  }
  return exportProperties;
};
vsaq.questionnaire.items.RadiogroupItem = function(id, conditions, caption, defaultChoice, choices, choicesConds) {
  goog.base(this, id, conditions, caption, defaultChoice, choices, choicesConds);
  this.groupItemType = vsaq.questionnaire.items.RadioItem.TYPE;
};
goog.inherits(vsaq.questionnaire.items.RadiogroupItem, vsaq.questionnaire.items.GroupItem);
vsaq.questionnaire.items.RadiogroupItem.prototype.createSingleItem = function(choiceId, choiceCondition, choiceText) {
  var newRadioItem = new vsaq.questionnaire.items.RadioItem(choiceId, choiceCondition, choiceText);
  newRadioItem.type = vsaq.questionnaire.items.RadioItem.TYPE;
  return newRadioItem;
};
vsaq.questionnaire.items.RadiogroupItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.RadiogroupItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.RadiogroupItem(item.id, item.cond, item.text, item.defaultChoice, item.choices, item.choicesConds);
};
vsaq.questionnaire.items.RadiogroupItem.TYPE = "radiogroup";
vsaq.questionnaire.items.CheckgroupItem = function(id, conditions, caption, defaultChoice, choices, choicesConds) {
  goog.base(this, id, conditions, caption, defaultChoice, choices, choicesConds);
  this.groupItemType = vsaq.questionnaire.items.CheckItem.TYPE;
};
goog.inherits(vsaq.questionnaire.items.CheckgroupItem, vsaq.questionnaire.items.GroupItem);
vsaq.questionnaire.items.CheckgroupItem.prototype.createSingleItem = function(choiceId, choiceCondition, choiceText) {
  var newCheckItem = new vsaq.questionnaire.items.CheckItem(choiceId, choiceCondition, choiceText);
  newCheckItem.type = vsaq.questionnaire.items.CheckItem.TYPE;
  return newCheckItem;
};
vsaq.questionnaire.items.CheckgroupItem.TYPE = "checkgroup";
vsaq.questionnaire.items.CheckgroupItem.parse = function(questionStack) {
  var item = questionStack.shift();
  if (item.type != vsaq.questionnaire.items.CheckgroupItem.TYPE) {
    throw new vsaq.questionnaire.items.ParseError("Wrong parser chosen.");
  }
  return new vsaq.questionnaire.items.CheckgroupItem(item.id, item.cond, item.text, item.defaultChoice, item.choices, item.choicesConds);
};
goog.provide("vsaq.Questionnaire");
goog.provide("vsaq.questionnaire.QuestionnaireError");
goog.require("goog.Promise");
goog.require("goog.array");
goog.require("goog.debug.Console");
goog.require("goog.debug.Error");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.json");
goog.require("goog.log");
goog.require("goog.object");
goog.require("goog.soy");
goog.require("goog.structs");
goog.require("vsaq.questionnaire.items.BlockItem");
goog.require("vsaq.questionnaire.items.BoxItem");
goog.require("vsaq.questionnaire.items.CheckItem");
goog.require("vsaq.questionnaire.items.CheckgroupItem");
goog.require("vsaq.questionnaire.items.GroupItem");
goog.require("vsaq.questionnaire.items.InfoItem");
goog.require("vsaq.questionnaire.items.Item");
goog.require("vsaq.questionnaire.items.LineItem");
goog.require("vsaq.questionnaire.items.ParseError");
goog.require("vsaq.questionnaire.items.RadioItem");
goog.require("vsaq.questionnaire.items.RadiogroupItem");
goog.require("vsaq.questionnaire.items.SpacerItem");
goog.require("vsaq.questionnaire.items.TipItem");
goog.require("vsaq.questionnaire.items.UploadItem");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.items.YesNoItem");
goog.require("vsaq.questionnaire.items.factory");
goog.require("vsaq.questionnaire.templates");
vsaq.questionnaire.QuestionnaireError = function(opt_msg) {
  goog.base(this, opt_msg);
};
goog.inherits(vsaq.questionnaire.QuestionnaireError, goog.debug.Error);
vsaq.Questionnaire = function(rootElement) {
  goog.events.EventTarget.call(this);
  goog.debug.Console.autoInstall();
  this.logger_ = goog.log.getLogger("vsaq.Questionnaire");
  this.items_ = {};
  this.template_ = [];
  this.values_ = {};
  this.rootElement_ = rootElement;
  this.isCapturingEvents_ = true;
  this.unrolledMode_ = false;
  this.adminMode_ = false;
  this.readonlyMode_ = false;
  this.showTodo_ = false;
  this.todoListElement_ = goog.dom.createDom(goog.dom.TagName.DIV);
  this.oldTodoFormat_ = false;
  this.resolver_ = goog.Promise.withResolver();
};
goog.inherits(vsaq.Questionnaire, goog.events.EventTarget);
vsaq.Questionnaire.ChangeEvent = function(type, opt_target) {
  goog.events.Event.call(this, type, opt_target);
  this.changes = {};
};
goog.inherits(vsaq.Questionnaire.ChangeEvent, goog.events.Event);
vsaq.Questionnaire.prototype.rootBlock_;
vsaq.Questionnaire.prototype.getRootBlock = function() {
  return this.rootBlock_;
};
vsaq.Questionnaire.prototype.answerChanged_ = function(e) {
  if (!this.isCapturingEvents_) {
    return;
  }
  goog.object.extend(this.values_, e.changes);
  this.dispatchChange_(e.changes);
  if (e.source instanceof vsaq.questionnaire.items.LineItem || e.source instanceof vsaq.questionnaire.items.BoxItem || e.source instanceof vsaq.questionnaire.items.TipItem) {
    this.reevaluateConditionsLater_();
  } else {
    this.reevaluateConditions_();
  }
};
vsaq.Questionnaire.prototype.fixLinks_ = function(start) {
  goog.events.listen(start, goog.events.EventType.CLICK, function(e) {
    if (e.target instanceof HTMLAnchorElement && e.target.target == "") {
      e.target.target = "_blank";
    }
    return true;
  });
};
vsaq.Questionnaire.prototype.dispatchChange_ = function(changes) {
  var ev = {type:goog.events.EventType.CHANGE, changedValues:changes};
  this.dispatchEvent(ev);
};
vsaq.Questionnaire.prototype.reevaluateConditions_ = function() {
  var todos = [];
  var todoStatus = {};
  goog.structs.forEach(this.items_, function(item, id, items) {
    if (item instanceof vsaq.questionnaire.items.ValueItem) {
      item.setReadOnly(this.readonlyMode_);
    }
    if (item.auth == "admin" && !this.adminMode_ || item.className == "vsaq-invisible") {
      item.setVisibility(false);
    } else {
      item.setVisibility(this.unrolledMode_ || item.evaluateConditions(items));
    }
    if (item instanceof vsaq.questionnaire.items.TipItem && item.isVisible() && item.todo.length > 0) {
      var todoKey = "vsaq_todo_" + item.id;
      todos.push({key:todoKey, description:soydata.VERY_UNSAFE.ordainSanitizedHtml(item.todo)});
      todoStatus[todoKey] = this.values_[todoKey];
    }
  }, this);
  goog.dom.removeChildren(this.todoListElement_);
  if (!this.oldTodoFormat_) {
    this.todoListElement_.appendChild(goog.soy.renderAsElement(vsaq.questionnaire.templates.todoList, {todoListItems:todos, todoStatus:todoStatus}));
  }
};
vsaq.Questionnaire.prototype.reevaluateConditionsLater_ = function() {
  if (!goog.isDefAndNotNull(this.reevaluateTimer_)) {
    this.reevaluateTimer_ = setTimeout(goog.bind(function() {
      this.reevaluateTimer_ = null;
      this.reevaluateConditions_();
    }, this), this.REEVALUATE_CONDITIONS_DELAY_);
  }
};
vsaq.Questionnaire.prototype.reevaluateTimer_ = null;
vsaq.Questionnaire.prototype.REEVALUATE_CONDITIONS_DELAY_ = 1E3;
vsaq.Questionnaire.prototype.setUnrolledMode = function(isOn) {
  this.unrolledMode_ = isOn;
};
vsaq.Questionnaire.prototype.setAdminMode = function(isAdmin) {
  this.adminMode_ = isAdmin;
};
vsaq.Questionnaire.prototype.setReadOnlyMode = function(isReadOnly) {
  this.readonlyMode_ = isReadOnly;
};
vsaq.Questionnaire.prototype.setShowTodo = function(isTodoVisible) {
  this.showTodo_ = isTodoVisible;
};
vsaq.Questionnaire.prototype.setRecursiveTemplate = function(template, parentId) {
  var parentItem = this.items_[parentId];
  if (!(parentItem instanceof vsaq.questionnaire.items.BlockItem)) {
    throw new vsaq.questionnaire.items.ParseError("Invalid parent item passed, id: " + parentId);
  }
  var itemStack = goog.array.clone(template);
  while (itemStack.length) {
    var currentObject = goog.object.clone(itemStack[0]);
    var item = vsaq.questionnaire.items.Item.parse(itemStack);
    parentItem.addItem(item);
    item.parentItemSet(parentItem);
    goog.events.listen(item.eventDispatcher, vsaq.questionnaire.items.Item.CHANGED, goog.bind(this.answerChanged_, this));
    goog.events.listen(item.eventDispatcher, vsaq.questionnaire.items.Item.SHOWN, goog.bind(this.dispatchEvent, this));
    goog.events.listen(item.eventDispatcher, vsaq.questionnaire.items.Item.HIDDEN, goog.bind(this.dispatchEvent, this));
    if (this.items_[item.id]) {
      throw new vsaq.questionnaire.items.ParseError("Duplicate item id: " + item.id);
    }
    this.items_[item.id] = item;
    if (item instanceof vsaq.questionnaire.items.BlockItem) {
      if (currentObject["items"].length > 0) {
        this.setRecursiveTemplate(currentObject["items"], item.id);
      }
    } else {
      if (item instanceof vsaq.questionnaire.items.GroupItem) {
        var containerItems = item.getContainerItems();
        goog.array.forEach(containerItems, function(item) {
          this.items_[item.id] = item;
        }, this);
      }
    }
  }
};
vsaq.Questionnaire.prototype.done = function() {
  return this.resolver_.promise;
};
vsaq.Questionnaire.prototype.setTemplate = function(template) {
  var tmp = (goog.object.unsafeClone(template));
  var currentObject = goog.object.clone(tmp[0]);
  var rootItem = vsaq.questionnaire.items.Item.parse(tmp);
  if (!(rootItem instanceof vsaq.questionnaire.items.BlockItem)) {
    throw new vsaq.questionnaire.items.ParseError("All items must be contained in a block.");
  }
  this.rootBlock_ = (rootItem);
  this.items_ = {};
  this.items_[rootItem.id] = rootItem;
  if (!currentObject.hasOwnProperty("items") || template.length > 1) {
    throw new vsaq.questionnaire.items.ParseError("All items must be contained in one root block.");
  }
  this.setRecursiveTemplate(currentObject["items"], rootItem.id);
  this.template_ = template;
  this.resolver_.resolve();
};
vsaq.Questionnaire.prototype.setMultipleTemplates = function(baseTemplate, var_args) {
  var count = arguments.length;
  var baseTemplateVersion = baseTemplate["version"];
  var questionnaireTemplate = (baseTemplate["questionnaire"]);
  if (count < 2) {
    this.setTemplate(questionnaireTemplate);
    return;
  }
  for (var i = 1;i < count;i++) {
    var template = arguments[i];
    var version = template["version"];
    if (version != baseTemplateVersion) {
      throw new vsaq.questionnaire.QuestionnaireError("Extension templates must match version of base template.");
    }
    this.extendBaseTemplate_(baseTemplate, template);
  }
  this.setTemplate(questionnaireTemplate);
};
vsaq.Questionnaire.prototype.extendBaseTemplate_ = function(baseTemplate, extensionTemplate) {
  var extensions = extensionTemplate["extensions"];
  if (extensionTemplate.hasOwnProperty("namespace")) {
    this.addNamespaceToIds_(extensions, extensionTemplate["namespace"]);
  }
  for (var i = 0, extension;extension = extensions[i];i++) {
    var insertBefore = undefined;
    var insertAfter = undefined;
    if (extension.hasOwnProperty("insertBefore")) {
      insertBefore = extension["insertBefore"];
    }
    if (extension.hasOwnProperty("insertAfter")) {
      insertAfter = extension["insertAfter"];
    }
    if (insertBefore && insertAfter || !insertBefore && !insertAfter) {
      throw new vsaq.questionnaire.QuestionnaireError("Extension item at position " + i + " in extension array must have " + "either an insertBefore or an insertAfter property set");
    }
    var targetItemId = insertBefore || insertAfter;
    var success = this.insertItemIntoTemplate_(baseTemplate["questionnaire"], extension, targetItemId, insertAfter);
    if (!success) {
      throw new vsaq.questionnaire.QuestionnaireError('Target item id "' + targetItemId + '" was not found. Check ' + '"insertBefore" or "insertAfter" property');
    }
  }
};
vsaq.Questionnaire.prototype.insertItemIntoTemplate_ = function(template, newItem, targetItemId, opt_insertAfter) {
  var success = false;
  for (var i = 0, item;item = template[i];i++) {
    if (item.hasOwnProperty("id") && item["id"] == targetItemId) {
      if (opt_insertAfter) {
        goog.array.insertAt(template, newItem, i + 1);
      } else {
        goog.array.insertAt(template, newItem, i);
      }
      return true;
    }
    if (item.hasOwnProperty("items")) {
      success |= this.insertItemIntoTemplate_(item["items"], newItem, targetItemId, opt_insertAfter);
    }
  }
  return success;
};
vsaq.Questionnaire.prototype.addNamespaceToIds_ = function(items, namespace) {
  for (var i = 0, item;item = items[i];i++) {
    if (item.hasOwnProperty("id")) {
      item["id"] = namespace + ":" + item["id"];
    }
    if (item.hasOwnProperty("items")) {
      this.addNamespaceToIds_(item["items"], namespace);
    }
    if (item.hasOwnProperty("choices")) {
      for (var j = 0, choice;choice = item["choices"][j];j++) {
        var key = goog.object.getKeys(choice)[0];
        choice[namespace + ":" + key] = choice[key];
        delete choice[key];
      }
    }
  }
};
vsaq.Questionnaire.prototype.setValues = function(values, opt_scrollThere) {
  this.values_ = values;
  this.isCapturingEvents_ = false;
  goog.structs.forEach(this.values_, function(value, id) {
    var item = this.items_[id];
    if (!item) {
      this.logger_.warning('Answers refer to item "' + id + '", which does not seem to exist.');
      return;
    }
    if (!(item instanceof vsaq.questionnaire.items.ValueItem)) {
      this.logger_.warning('Answer refers to item "' + id + '", which cannot have a value');
      return;
    }
    item = (item);
    item.setValue(value);
    if (opt_scrollThere) {
      item.container.scrollIntoViewIfNeeded(true);
    }
  }, this);
  this.isCapturingEvents_ = true;
  this.reevaluateConditions_();
};
vsaq.Questionnaire.prototype.getValuesAsJson = function() {
  return goog.json.serialize(this.values_);
};
vsaq.Questionnaire.prototype.getTemplate = function() {
  return this.template_;
};
vsaq.Questionnaire.prototype.getRootElement = function() {
  return this.rootElement_;
};
vsaq.Questionnaire.prototype.getItem = function(index) {
  if (!this.items_.hasOwnProperty(index)) {
    return null;
  }
  return this.items_[index];
};
vsaq.Questionnaire.prototype.getItems = function() {
  return this.items_;
};
vsaq.Questionnaire.prototype.render = function() {
  this.isCapturingEvents_ = false;
  goog.dom.removeChildren(this.rootElement_);
  if (this.rootBlock_) {
    this.rootElement_.appendChild(this.rootBlock_.container);
    if (this.showTodo_) {
      this.rootElement_.appendChild(this.todoListElement_);
    }
  }
  this.isCapturingEvents_ = true;
  this.reevaluateConditions_();
  this.fixLinks_(this.rootElement_);
};
vsaq.Questionnaire.prototype.reset = function() {
  this.setTemplate(this.template_);
  this.render();
};
vsaq.Questionnaire.prototype.setTodoListElement = function(el) {
  this.todoListElement_ = el;
  this.reevaluateConditions_();
};
goog.scope(function() {
  var items = vsaq.questionnaire.items;
  items.factory.clear();
  items.factory.add(items.BoxItem.TYPE, items.BoxItem.parse);
  items.factory.add(items.CheckItem.TYPE, items.CheckItem.parse);
  items.factory.add(items.InfoItem.TYPE, items.InfoItem.parse);
  items.factory.add(items.LineItem.TYPE, items.LineItem.parse);
  items.factory.add(items.RadioItem.TYPE, items.RadioItem.parse);
  items.factory.add(items.SpacerItem.TYPE, items.SpacerItem.parse);
  items.factory.add(items.BlockItem.TYPE, items.BlockItem.parse);
  items.factory.add(items.TipItem.TYPE, items.TipItem.parse);
  items.factory.add(items.UploadItem.TYPE, items.UploadItem.parse);
  items.factory.add(items.YesNoItem.TYPE, items.YesNoItem.parse);
  items.factory.add(items.CheckgroupItem.TYPE, items.CheckgroupItem.parse);
  items.factory.add(items.RadiogroupItem.TYPE, items.RadiogroupItem.parse);
});
goog.provide("vsaq.QuestionnaireEditor");
goog.require("goog.Uri");
goog.require("goog.array");
goog.require("goog.debug.Error");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.dom.classlist");
goog.require("goog.dom.forms");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.format.JsonPrettyPrinter");
goog.require("goog.json");
goog.require("goog.json.Serializer");
goog.require("goog.object");
goog.require("goog.soy");
goog.require("goog.string");
goog.require("goog.structs.LinkedMap");
goog.require("goog.ui.ScrollFloater");
goog.require("goog.ui.Textarea");
goog.require("vsaq.questionnaire.items.ContainerItem");
goog.require("vsaq.questionnaire.items.GroupItem");
goog.require("vsaq.questionnaire.items.Item");
goog.require("vsaq.questionnaire.items.ValueItem");
goog.require("vsaq.questionnaire.items.factory");
goog.require("vsaq.questionnaire.templates");
goog.require("vsaq.utils");
vsaq.QuestionnaireEditor = function() {
  if (!this.isEditorEnabled_()) {
    return;
  }
  var questionnaireObj = vsaq.initQuestionnaire();
  this.questionnaire_ = questionnaireObj.questionnaire;
  this.questionnaire_.setAdminMode(true);
  this.questionnaire_.setUnrolledMode(true);
  this.templateEditMode_ = false;
  this.editorActive_ = false;
  this.itemEditability_ = false;
  this.itemClickEventMutex_ = false;
  this.itemClickTextEditMutex_ = false;
  this.lastClickedItemID_ = null;
  this.editTemplateElement_ = null;
  this.liveEditModeElement_ = null;
  this.lightEditModeElement_ = null;
  this.editorWindowDOM_ = null;
  this.initEditorDOMElements_();
  this.editTemplateElementDecorator_ = new goog.ui.Textarea("");
  this.editTemplateElementDecorator_.setMaxHeight(vsaq.QuestionnaireEditor.SETTINGS.windowHeightPercentage / 100 * goog.dom.getViewportSize().height);
  this.editTemplateElementDecorator_.decorate(this.editTemplateElement_);
  var scrollfloater = new goog.ui.ScrollFloater;
  scrollfloater.setViewportTopOffset(vsaq.QuestionnaireEditor.SETTINGS.windowTopOffset);
  scrollfloater.decorate(this.editorWindowDOM_);
  this.initEditorClickables_({"eh-add-to-item":goog.bind(this.addItem, this), "eh-copy-item":goog.bind(this.copyItem, this), "eh-remove-from-item":goog.bind(this.removeItem, this), "eh-make-editable":goog.bind(this.enableItemEditability, this), "eh-move-item-up":goog.bind(this.moveItemUp, this), "eh-move-item-down":goog.bind(this.moveItemDown, this), "eh-export-template":goog.bind(this.exportTemplate, this), "eh-editor-status":goog.bind(this.toggleEditor, this), "eh-light-editor-status":goog.bind(this.setGlobalItemEditability, 
  this), "eh-editor-rollmode":goog.bind(this.setRollMode, this), "eh-parse-template":goog.bind(this.parseTemplate, this), "vsaq-label-text":goog.bind(this.editItemTextEntry, this), "vsaq-select-text":goog.bind(this.selectItemEntry, this), "vsaq-remove-text":goog.bind(this.removeItemEntry, this)});
  goog.events.listen(this.editTemplateElement_, goog.events.EventType.CLICK, goog.bind(this.toggleExportBox, this));
  var scrollOnClickHandler = goog.bind(this.itemClickedHandler, this);
  goog.events.listen(goog.dom.getDocument(), [goog.events.EventType.CLICK], function(e) {
    e.stopPropagation();
    var clickable = goog.dom.getAncestorByClass(e.target, "vsaq-item");
    if (clickable) {
      scrollOnClickHandler(clickable);
    }
  });
  this.initEditor_();
};
vsaq.QuestionnaireEditor.SETTINGS = {urlParameter:"editor", windowHeightPercentage:60, windowTopOffset:100, successColor:"rgb(245, 252, 244)", failureColor:"rgb(255, 231, 231)", noTextEntry:"none", jsonScrollTopOffset:21, itemEditBorder:"2px solid green"};
vsaq.QuestionnaireEditor.prototype.initEditorDOMElements_ = function() {
  this.editTemplateElement_ = goog.dom.getElement("vsaq_editor_template_textarea");
  if (!this.editTemplateElement_) {
    throw new goog.debug.Error("Can't find the template textarea.");
  }
  this.liveEditModeElement_ = goog.dom.getElement("vsaq_editor_live_mode");
  if (!this.liveEditModeElement_) {
    throw new goog.debug.Error("Can't find the template live edit mode element.");
  }
  this.lightEditModeElement_ = goog.dom.getElement("vsaq_editor_light_mode");
  if (!this.lightEditModeElement_) {
    throw new goog.debug.Error("Can't find the template live edit mode element.");
  }
  this.editorWindowDOM_ = goog.dom.getElement("vsaq_editor");
  if (!this.editorWindowDOM_) {
    throw new goog.debug.Error("Can't find the template editor.");
  }
};
vsaq.QuestionnaireEditor.DUMMY_ITEM = {id:"", type:"", cond:"", text:"Sample text", warn:"no", defaultChoice:false, choices:[], choicesConds:[], yes:"Yes.", no:"No."};
vsaq.QuestionnaireEditor.DUMMY_CHOICES_TEXT = ["choice 1", "choice 2"];
vsaq.QuestionnaireEditor.prototype.isEditorEnabled_ = function() {
  var uri = new goog.Uri(document.location.search);
  var editorParameterSet = uri.getQueryData().get(vsaq.QuestionnaireEditor.SETTINGS.urlParameter, "");
  return !!editorParameterSet;
};
vsaq.QuestionnaireEditor.prototype.initEditor_ = function() {
  var promise = this.questionnaire_.done();
  promise.then(this.displayEditor_, null, this);
};
vsaq.QuestionnaireEditor.prototype.displayEditor_ = function() {
  this.setQuestionnaireEditability_();
  this.exportTemplate();
};
vsaq.QuestionnaireEditor.prototype.setQuestionnaireEditability_ = function() {
  var rootBlock = this.questionnaire_.getRootBlock();
  if (!rootBlock) {
    return;
  }
  this.setEditability(rootBlock);
};
vsaq.QuestionnaireEditor.prototype.eventHandler_ = function(editorFunction, el) {
  this.itemClickEventMutex_ = true;
  editorFunction(el);
  this.exportTemplate();
};
vsaq.QuestionnaireEditor.prototype.initEditorClickables_ = function(handlers) {
  for (var handlerName in handlers) {
    if (!handlers.hasOwnProperty(handlerName)) {
      continue;
    }
    handlers[handlerName] = goog.bind(this.eventHandler_, this, handlers[handlerName]);
  }
  vsaq.utils.initClickables(handlers);
};
vsaq.QuestionnaireEditor.prototype.highlightElement_ = function(el, success, opt_reset) {
  if (el == null || !el.hasAttribute("style")) {
    return;
  }
  if (opt_reset) {
    el.style.backgroundColor = "";
    return;
  }
  if (success) {
    el.style.backgroundColor = vsaq.QuestionnaireEditor.SETTINGS.successColor;
  } else {
    el.style.backgroundColor = vsaq.QuestionnaireEditor.SETTINGS.failureColor;
  }
};
vsaq.QuestionnaireEditor.prototype.flushQuestionnaire_ = function() {
  var qItems = this.questionnaire_.getItems();
  for (var itemId in qItems) {
    if (qItems.hasOwnProperty(itemId)) {
      delete qItems[itemId];
    }
  }
  var rootBlock = this.questionnaire_.getRootBlock();
  if (!rootBlock) {
    return;
  }
  goog.dom.removeNode(rootBlock.container);
};
vsaq.QuestionnaireEditor.prototype.tryParseTemplate_ = function() {
  var vsaqonTemplate = this.editTemplateElementDecorator_.getValue();
  var jsonTemplate = vsaq.utils.vsaqonToJson(vsaqonTemplate);
  var template = {};
  try {
    template = JSON.parse(jsonTemplate)["questionnaire"];
  } catch (err) {
    this.highlightElement_(this.editTemplateElement_, false);
    return false;
  }
  this.flushQuestionnaire_();
  try {
    this.questionnaire_.setTemplate(template);
    this.questionnaire_.render();
  } catch (err) {
    return false;
  }
  return true;
};
vsaq.QuestionnaireEditor.prototype.parseTemplate = function() {
  var jsonTemplateBackup = this.exportQuestionnaireJSON_();
  var templateParsed = this.tryParseTemplate_();
  if (templateParsed) {
    this.setQuestionnaireEditability_();
    this.highlightElement_(this.editTemplateElement_, true);
  } else {
    if (!jsonTemplateBackup) {
      return true;
    }
    this.editTemplateElementDecorator_.setValue(jsonTemplateBackup);
    this.parseTemplate();
    this.highlightElement_(this.editTemplateElement_, false);
  }
  return templateParsed;
};
vsaq.QuestionnaireEditor.prototype.toggleExportBox = function() {
  if (!this.liveEditModeElement_.checked) {
    return;
  }
  if (!this.templateEditMode_) {
    this.exportTemplate();
    goog.events.removeAll(this.editTemplateElement_, goog.events.EventType.CLICK);
    goog.events.listen(this.editTemplateElement_, goog.events.EventType.BLUR, goog.bind(this.toggleExportBox, this));
    this.templateEditMode_ = true;
  } else {
    this.parseTemplate();
    goog.events.removeAll(this.editTemplateElement_, goog.events.EventType.BLUR);
    goog.events.listen(this.editTemplateElement_, goog.events.EventType.CLICK, goog.bind(this.toggleExportBox, this));
    this.templateEditMode_ = false;
  }
};
vsaq.QuestionnaireEditor.prototype.editItemTextEntry = function(el) {
  var targetItem = this.getNextParentItem_(el);
  if (targetItem == null) {
    return;
  }
  this.itemClickTextEditMutex_ = true;
  if (el.firstChild && el.firstChild.tagName === String(goog.dom.TagName.TEXTAREA)) {
    return;
  }
  if (el.hasAttribute("for")) {
    el.removeAttribute("for");
  }
  if (el.parentNode && el.parentNode.tagName === String(goog.dom.TagName.LABEL)) {
    var labelElement = el.parentNode;
    var fragment = document.createDocumentFragment();
    while (labelElement.firstChild) {
      fragment.appendChild(labelElement.firstChild);
    }
    goog.dom.replaceNode(fragment, labelElement);
  }
  var editDOMTextarea = document.createElement("textarea");
  editDOMTextarea.value = el.innerHTML;
  if (editDOMTextarea.value == vsaq.QuestionnaireEditor.SETTINGS.noTextEntry) {
    editDOMTextarea.value = "";
  }
  goog.dom.classlist.set(editDOMTextarea, "vsaq-box");
  (new goog.ui.Textarea("")).decorate(editDOMTextarea);
  goog.dom.classlist.remove(el, "vsaq-label-text");
  goog.dom.removeChildren(el);
  el.appendChild(editDOMTextarea);
  editDOMTextarea.focus();
  goog.events.listen(editDOMTextarea, goog.events.EventType.BLUR, goog.bind(this.saveItemEntry_, this, el, targetItem));
};
vsaq.QuestionnaireEditor.prototype.selectItemEntry = function(el) {
  var targetItem = this.getNextParentItem_(el);
  if (targetItem == null) {
    return;
  }
  this.saveItemEntry_(el, targetItem);
};
vsaq.QuestionnaireEditor.prototype.removeItemEntry = function(el) {
  var targetItem = this.getNextParentItem_(el);
  if (targetItem == null) {
    return;
  }
  var entryName = el.getAttribute("name");
  if (this.updateItemEntry_(targetItem, entryName, null)) {
    el.innerHTML = vsaq.QuestionnaireEditor.SETTINGS.noTextEntry;
    this.eventHandler_(function() {
    }, null);
  }
};
vsaq.QuestionnaireEditor.prototype.saveItemEntry_ = function(el, targetItem) {
  var editItemEntryDOM = (el.firstChild);
  if (!editItemEntryDOM) {
    return;
  }
  var isSelectDOM = editItemEntryDOM.tagName === String(goog.dom.TagName.SELECT);
  var isTextareaDOM = editItemEntryDOM.tagName === String(goog.dom.TagName.TEXTAREA);
  if (!isSelectDOM && !isTextareaDOM) {
    return;
  }
  if (isTextareaDOM) {
    goog.dom.classlist.add(el, "vsaq-label-text");
  }
  var updateValue = (goog.dom.forms.getValue(editItemEntryDOM));
  var entryName = el.getAttribute("name");
  if (updateValue === vsaq.QuestionnaireEditor.SETTINGS.noTextEntry || updateValue === "") {
    updateValue = null;
  }
  if (!this.updateItemEntry_(targetItem, entryName, updateValue)) {
    this.highlightElement_(editItemEntryDOM, false);
    return;
  }
  this.eventHandler_(function() {
  }, null);
  if (isTextareaDOM) {
    el.innerHTML = updateValue || vsaq.QuestionnaireEditor.SETTINGS.noTextEntry;
  }
  this.itemClickTextEditMutex_ = false;
};
vsaq.QuestionnaireEditor.prototype.updateItemID_ = function(targetItem, newItemID) {
  var newUniqueID = newItemID || goog.string.createUniqueString();
  if (newUniqueID == targetItem.id) {
    return true;
  }
  var qItems = this.questionnaire_.getItems();
  if (newUniqueID != targetItem.id && qItems[newUniqueID]) {
    return false;
  }
  if (targetItem.container.hasAttribute("data-vsaq-container-for")) {
    targetItem.container.setAttribute("data-vsaq-container-for", newUniqueID);
  } else {
    if (targetItem.container.hasAttribute("id")) {
      targetItem.container.setAttribute("id", newUniqueID);
    } else {
      throw new goog.debug.Error("Can't find the HTML container id of the item parent.");
    }
  }
  qItems[newUniqueID] = qItems[targetItem.id];
  delete qItems[targetItem.id];
  targetItem.id = newUniqueID;
  targetItem.templateItemId = newItemID;
  this.lastClickedItemID_ = targetItem.id;
  return true;
};
vsaq.QuestionnaireEditor.prototype.getTemplateValueName_ = function(propertyInformation, entryValue) {
  if (!entryValue) {
    return "";
  }
  var translatedValue = entryValue;
  if (propertyInformation.defaultValues) {
    translatedValue = goog.object.findKey(propertyInformation.defaultValues, function(value) {
      if (value === entryValue) {
        return true;
      } else {
        if (typeof value === "boolean" && value.toString() === entryValue) {
          return true;
        }
      }
      return false;
    }, this);
    if (!translatedValue) {
      throw new goog.debug.Error("Unknown value passed (not found in default values).");
    }
  }
  if (translatedValue === "true" || translatedValue === "false") {
    translatedValue = translatedValue === "true";
  }
  return translatedValue;
};
vsaq.QuestionnaireEditor.prototype.updateItemEntry_ = function(targetItem, entryName, newEntryValue) {
  if (!targetItem.hasOwnProperty(entryName)) {
    throw new goog.debug.Error("Invalid entryName detected: '" + entryName + "'.");
  }
  var propertyInformation = targetItem.getPropertyInformation("", entryName);
  if (!propertyInformation) {
    throw new goog.debug.Error("Property information missing for '" + entryName + "'.");
  }
  if (!newEntryValue && propertyInformation.mandatory) {
    return false;
  }
  if (entryName === "id" || entryName === "templateItemId") {
    return this.updateItemID_(targetItem, newEntryValue);
  }
  var translatedValue = this.getTemplateValueName_(propertyInformation, newEntryValue);
  targetItem[entryName] = translatedValue;
  if (propertyInformation.metadata) {
    if (targetItem.container.hasAttribute(entryName)) {
      targetItem.container.setAttribute(entryName, goog.string.makeSafe(newEntryValue));
    }
  } else {
    targetItem.render();
    this.setEditability(targetItem);
  }
  return true;
};
vsaq.QuestionnaireEditor.prototype.itemClickedHandler = function(el) {
  var targetItem = this.getNextParentItem_(el);
  if (targetItem == null) {
    return;
  }
  if (this.itemClickEventMutex_) {
    this.itemClickEventMutex_ = false;
    return;
  }
  if (this.itemClickTextEditMutex_) {
    return;
  }
  this.scrollToItemJSON_(targetItem);
};
vsaq.QuestionnaireEditor.prototype.enableItemEditability = function(el) {
  var targetItem = this.getNextParentItem_(el);
  if (targetItem == null) {
    return;
  }
  if (!this.itemEditability_) {
    var lastItemClicked = null;
    if (this.lastClickedItemID_) {
      lastItemClicked = this.questionnaire_.getItem(this.lastClickedItemID_);
    }
    this.lastClickedItemID_ = targetItem.id;
    if (lastItemClicked) {
      this.setEditability(lastItemClicked, false, true);
    }
    this.setEditability(targetItem, true, true);
    this.scrollToItemJSON_(targetItem);
  }
};
vsaq.QuestionnaireEditor.prototype.scrollToItemJSON_ = function(targetItem) {
  if (targetItem.parentItem && targetItem.parentItem instanceof vsaq.questionnaire.items.GroupItem) {
    targetItem = targetItem.parentItem;
  }
  var targetItemJson = this.exportQuestionnaireJSON_(targetItem);
  var splittedLines = targetItemJson.split("\n");
  var regexText = "\\s*";
  goog.array.forEach(splittedLines, function(line) {
    regexText += goog.string.regExpEscape(line) + "\\s*";
  });
  var regexPattern = new RegExp(regexText, "g");
  var searchResults = regexPattern.exec(this.editTemplateElement_.value);
  var itemTemplatePosition = searchResults.index;
  if (itemTemplatePosition == -1) {
    throw new goog.debug.Error("Can't find the block...");
  }
  if (searchResults.length > 1) {
    throw new goog.debug.Error("Too many blocks found...");
  }
  var templateResult = goog.string.trim(searchResults[0]);
  var resultLength = templateResult.length;
  itemTemplatePosition += searchResults[0].replace(/^(\s*)[\s\S]*/, "$1").length;
  var backup = this.editTemplateElement_.value;
  var prefix = this.editTemplateElement_.value.substring(0, itemTemplatePosition);
  this.editTemplateElement_.blur();
  this.editTemplateElementDecorator_.setValue(prefix);
  this.editTemplateElement_.focus();
  this.editTemplateElementDecorator_.setValue(backup);
  this.editTemplateElement_.scrollTop += parseInt(this.editTemplateElement_.style.height, 10);
  this.editTemplateElement_.scrollTop -= vsaq.QuestionnaireEditor.SETTINGS.jsonScrollTopOffset;
  this.editTemplateElement_.setSelectionRange(itemTemplatePosition, itemTemplatePosition + resultLength);
};
vsaq.QuestionnaireEditor.prototype.exportQuestionnaireJSON_ = function(opt_item) {
  var currentTemplateTree;
  if (opt_item) {
    currentTemplateTree = opt_item.exportItem();
  } else {
    var rootBlock = this.questionnaire_.getRootBlock();
    if (!rootBlock) {
      return "";
    }
    currentTemplateTree = rootBlock.exportItem();
    currentTemplateTree = {"questionnaire":[currentTemplateTree]};
  }
  var orderedJsonSerializer = new vsaq.QuestionnaireEditor.Serializer;
  var jsonContent = orderedJsonSerializer.serialize(currentTemplateTree);
  var printer = new goog.format.JsonPrettyPrinter(new goog.format.JsonPrettyPrinter.TextDelimiters);
  jsonContent = printer.format(jsonContent);
  var curlyBracketsCompressionPattern = "" + "(^\\s*)\\{\\s*" + "^\\s+(.*)\\s" + "^\\s*(\\},?)";
  var re = new RegExp(curlyBracketsCompressionPattern, "gm");
  jsonContent = jsonContent.replace(re, "$1{$2$3");
  return jsonContent;
};
vsaq.QuestionnaireEditor.prototype.exportTemplate = function() {
  var exportedJSON = this.exportQuestionnaireJSON_();
  this.editTemplateElementDecorator_.setValue(exportedJSON);
};
vsaq.QuestionnaireEditor.prototype.setRollMode = function(el) {
  if (el == null) {
    return;
  }
  this.questionnaire_.setUnrolledMode(el.checked);
  this.parseTemplate();
};
vsaq.QuestionnaireEditor.prototype.toggleEditor = function(el) {
  if (el == null) {
    return;
  }
  this.lightEditModeElement_.disabled = !el.checked;
  if (!el.checked) {
    this.itemEditability_ = false;
    this.lastClickedItemID_ = null;
  } else {
    this.itemEditability_ = !this.lightEditModeElement_.checked;
  }
  this.editorActive_ = el.checked;
  this.parseTemplate();
};
vsaq.QuestionnaireEditor.prototype.setGlobalItemEditability = function(el) {
  if (el == null) {
    return;
  }
  this.itemEditability_ = !el.checked;
  this.parseTemplate();
};
vsaq.QuestionnaireEditor.prototype.getDomElementItemId_ = function(el) {
  if (el == null) {
    return null;
  }
  var itemId = null;
  if (el.hasAttribute("data-vsaq-container-for")) {
    itemId = el.getAttribute("data-vsaq-container-for");
  } else {
    if (el.hasAttribute("id")) {
      itemId = el.getAttribute("id");
    }
  }
  return itemId;
};
vsaq.QuestionnaireEditor.prototype.getNextParentItemId_ = function(el) {
  var targetDomItem = el;
  if (targetDomItem == null) {
    return null;
  }
  var targetItemId = this.getDomElementItemId_(targetDomItem);
  while (targetDomItem.parentNode != null && targetItemId == null) {
    targetDomItem = (targetDomItem.parentNode);
    targetItemId = this.getDomElementItemId_(targetDomItem);
  }
  return targetItemId;
};
vsaq.QuestionnaireEditor.prototype.getNextParentItem_ = function(el) {
  var targetItemId = this.getNextParentItemId_(el);
  if (targetItemId == null) {
    return null;
  }
  return this.questionnaire_.getItem(targetItemId);
};
vsaq.QuestionnaireEditor.prototype.moveItem_ = function(el, moveDown) {
  var targetItem = (this.getNextParentItem_(el));
  if (targetItem == null) {
    return;
  }
  var targetParentItem = targetItem.parentItem;
  if (!(targetParentItem instanceof vsaq.questionnaire.items.ContainerItem)) {
    throw new goog.debug.Error("Can't move items within non-container parents.");
  }
  var nextItem = targetParentItem.getSiblingItem(targetItem, moveDown);
  if (nextItem == null) {
    return;
  }
  targetParentItem.deleteItem(targetItem);
  if (moveDown) {
    targetParentItem.insertAfter(targetItem, nextItem);
  } else {
    targetParentItem.insertBefore(targetItem, nextItem);
  }
};
vsaq.QuestionnaireEditor.prototype.moveItemDown = function(el) {
  this.moveItem_(el, true);
};
vsaq.QuestionnaireEditor.prototype.moveItemUp = function(el) {
  this.moveItem_(el, false);
};
vsaq.QuestionnaireEditor.prototype.getRandomDummyItem_ = function(itemType) {
  var newDummyItem = goog.object.clone(vsaq.QuestionnaireEditor.DUMMY_ITEM);
  newDummyItem.id = goog.string.createUniqueString();
  newDummyItem.type = itemType;
  newDummyItem.choices = [];
  goog.array.forEach(vsaq.QuestionnaireEditor.DUMMY_CHOICES_TEXT, function(choiceText) {
    var newChoice = {};
    newChoice[goog.string.createUniqueString()] = choiceText;
    newDummyItem.choices.push(newChoice);
  });
  return newDummyItem;
};
vsaq.QuestionnaireEditor.prototype.addItem = function(el) {
  var targetItem = this.getNextParentItem_(el);
  if (targetItem == null) {
    return;
  }
  var selectNewItemTypeFields = goog.dom.getElementsByTagNameAndClass("select", null, targetItem.editItemSuffix);
  if (selectNewItemTypeFields.length == 0) {
    throw new goog.debug.Error("Couldn't find the item type to add.");
  }
  var selectNewItemTypeField = selectNewItemTypeFields[0];
  var dummyItemType = (goog.dom.forms.getValue(selectNewItemTypeField));
  var dummyItem = this.getRandomDummyItem_(dummyItemType);
  var dummyStack = ([dummyItem]);
  var newItem = (vsaq.questionnaire.items.Item.parse(dummyStack));
  if (!(newItem instanceof vsaq.questionnaire.items.ValueItem)) {
    newItem.templateItemId = null;
  }
  this.setEditability(newItem);
  var qItems = this.questionnaire_.getItems();
  if (newItem instanceof vsaq.questionnaire.items.ContainerItem) {
    var containerItems = newItem.getContainerItems();
    goog.array.forEach(containerItems, function(item) {
      qItems[item.id] = item;
    });
  }
  qItems[newItem.id] = newItem;
  if (targetItem instanceof vsaq.questionnaire.items.ContainerItem) {
    targetItem.addItem(newItem);
    this.setEditability(targetItem);
  } else {
    var targetParentItem = targetItem.parentItem;
    targetParentItem.insertAfter(newItem, targetItem);
  }
};
vsaq.QuestionnaireEditor.prototype.copyItem = function(el) {
  var targetItem = this.getNextParentItem_(el);
  if (targetItem == null) {
    return;
  }
  var targetItemCopy = (goog.object.clone(targetItem));
  targetItemCopy.id = goog.string.createUniqueString();
  targetItemCopy.templateItemId = targetItem.templateItemId ? targetItemCopy.id : null;
  targetItemCopy.container = targetItem.container.cloneNode(true);
  targetItemCopy.editItemPrefix = null;
  targetItemCopy.editItemSuffix = null;
  targetItemCopy.render();
  this.setEditability(targetItemCopy);
  var targetParentItem = targetItem.parentItem;
  targetParentItem.insertAfter(targetItemCopy, targetItem);
  var qItems = this.questionnaire_.getItems();
  qItems[targetItemCopy.id] = targetItemCopy;
};
vsaq.QuestionnaireEditor.prototype.removeItem = function(el) {
  var targetItem = this.getNextParentItem_(el);
  if (targetItem == null) {
    return;
  }
  if (!targetItem.parentItem) {
    return;
  }
  var parentItem = targetItem.parentItem;
  parentItem.deleteItem(targetItem);
  var qItems = this.questionnaire_.getItems();
  var targetItemId = this.getNextParentItemId_(el);
  if (targetItemId == null) {
    return;
  }
  delete qItems[targetItemId];
};
vsaq.QuestionnaireEditor.prototype.addItemEditabilityPrefix = function(targetItem) {
  var knownProperties = targetItem.getPropertiesInformation();
  var knownPropertiesKeys = knownProperties.getKeys();
  var knownPropertiesValues = knownProperties.getValues();
  for (var key in knownPropertiesKeys) {
    if (!knownPropertiesKeys.hasOwnProperty(key)) {
      continue;
    }
    if (knownPropertiesValues[key].mandatory && !knownPropertiesValues[key].metadata && !knownPropertiesValues[key].defaultValues) {
      delete knownPropertiesKeys[key];
      delete knownPropertiesValues[key];
    }
  }
  targetItem.editItemPrefix = goog.soy.renderAsElement(vsaq.questionnaire.templates.editablePrefix, {knownPropertiesKeys:knownPropertiesKeys, knownPropertiesValues:knownPropertiesValues});
  if (!targetItem.container.firstChild) {
    throw new goog.debug.Error("The item must be in a valid container.");
  }
  var firstChild = targetItem.container.firstChild;
  targetItem.container.insertBefore(targetItem.editItemPrefix, firstChild);
};
vsaq.QuestionnaireEditor.prototype.addItemEditabilitySuffix = function(targetItem) {
  var possibleTypes = [];
  var groupItemType = null;
  if (targetItem instanceof vsaq.questionnaire.items.GroupItem) {
    groupItemType = targetItem.groupItemType;
  }
  if (targetItem.parentItem instanceof vsaq.questionnaire.items.GroupItem) {
    groupItemType = targetItem.type;
  }
  if (groupItemType) {
    possibleTypes.push(groupItemType);
  } else {
    for (var itemType in vsaq.questionnaire.items.factory.parsers) {
      if (!vsaq.questionnaire.items.factory.parsers.hasOwnProperty(itemType)) {
        continue;
      }
      if (itemType == "-block") {
        continue;
      }
      possibleTypes.push(itemType);
    }
  }
  targetItem.editItemSuffix = goog.soy.renderAsElement(vsaq.questionnaire.templates.editableSuffix, {types:possibleTypes, defaultType:targetItem.type});
  targetItem.container.appendChild(targetItem.editItemSuffix);
};
vsaq.QuestionnaireEditor.prototype.setEditability = function(targetItem, opt_editable, opt_excludeChildren) {
  if (!(targetItem instanceof vsaq.questionnaire.items.Item)) {
    return;
  }
  targetItem = (targetItem);
  var editable = opt_editable;
  if (!editable) {
    editable = this.itemEditability_;
  }
  if (!editable && this.lastClickedItemID_ == targetItem.id) {
    editable = true;
    opt_excludeChildren = true;
  }
  if (targetItem.editItemPrefix) {
    goog.dom.removeNode(targetItem.editItemPrefix);
  }
  if (targetItem.editItemSuffix) {
    goog.dom.removeNode(targetItem.editItemSuffix);
  }
  if (!opt_excludeChildren && targetItem instanceof vsaq.questionnaire.items.ContainerItem) {
    var containerItems = targetItem.getContainerItems();
    goog.array.forEach(containerItems, function(item) {
      this.setEditability(item, editable);
    }, this);
  }
  targetItem.container.style.border = "";
  if (!editable) {
    if (!this.editorActive_) {
      return;
    }
    targetItem.editItemSuffix = goog.soy.renderAsElement(vsaq.questionnaire.templates.editableTrigger, {itemType:targetItem.type});
    targetItem.container.appendChild(targetItem.editItemSuffix);
    return;
  }
  this.addItemEditabilityPrefix(targetItem);
  this.addItemEditabilitySuffix(targetItem);
  targetItem.container.style.border = vsaq.QuestionnaireEditor.SETTINGS.itemEditBorder;
};
vsaq.QuestionnaireEditor.Serializer = function(opt_replacer) {
  this.replacerFunction_ = opt_replacer;
  goog.base(this, opt_replacer);
};
goog.inherits(vsaq.QuestionnaireEditor.Serializer, goog.json.Serializer);
vsaq.QuestionnaireEditor.Serializer.prototype.serializeInternal = function(object, sb) {
  if (object instanceof goog.structs.LinkedMap) {
    this.serializeLinkedMap_(object, sb);
    return;
  }
  return goog.json.Serializer.prototype.serializeInternal.call(this, object, sb);
};
vsaq.QuestionnaireEditor.Serializer.prototype.serializeLinkedMap_ = function(map, sb) {
  sb.push("{");
  var sep = "";
  map.forEach(function(value, key) {
    sb.push(sep);
    goog.json.Serializer.prototype.serializeInternal.call(this, key, sb);
    sb.push(":");
    var replacerResult = value;
    if (this.replacerFunction_) {
      replacerResult = this.replacerFunction_.call(this, key, value);
    }
    this.serializeInternal(replacerResult, sb);
    sep = ",";
  }, this);
  sb.push("}");
};
goog.provide("vsaq.QpageBase");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.structs");
goog.require("goog.ui.Tooltip");
goog.require("vsaq.Questionnaire");
goog.require("vsaq.utils");
vsaq.QpageBase = function() {
  this.changes = {};
  var qNode = goog.dom.getElement("_vsaq_body");
  if (!qNode) {
    alert("Did not find an element with ID _vsaq_body to render the " + "questionnaire into.");
    return;
  }
  this.questionnaire = new vsaq.Questionnaire(qNode);
  this.nextUpdateAttemptIn = vsaq.QpageBase.SAVE_TIMEOUT_LENGTH;
  this.isReadOnly = goog.dom.getElement("_rom_").value == "true";
  this.statusIndicator = goog.dom.getElement("_vsaq_saved_status") || goog.dom.createDom(goog.dom.TagName.SPAN);
  this.questionnaire.setReadOnlyMode(this.isReadOnly);
  vsaq.utils.initClickables({"eh-edit":goog.bind(this.makeEditable, this)});
  goog.events.listen(window, [goog.events.EventType.BEFOREUNLOAD], function() {
    if (vsaq.qpageObject_ && vsaq.qpageObject_.unsavedChanges()) {
      return "You have unsaved changes.";
    }
  });
};
vsaq.QpageBase.SAVE_TIMEOUT_LENGTH = 2;
vsaq.QpageBase.prototype.questionnaire;
vsaq.QpageBase.prototype.changes;
vsaq.QpageBase.prototype.saveTimeout;
vsaq.QpageBase.prototype.nextUpdateAttemptIn;
vsaq.QpageBase.prototype.isReadOnly;
vsaq.QpageBase.prototype.statusIndicator;
vsaq.QpageBase.prototype.makeEditable = function() {
  this.isReadOnly = false;
  this.questionnaire.setReadOnlyMode(this.isReadOnly);
  this.questionnaire.render();
};
vsaq.QpageBase.prototype.sendUpdate = goog.abstractMethod;
vsaq.QpageBase.prototype.installToolTips = function() {
  var ttElements = goog.dom.getElementsByClass("tooltip-link", this.questionnaire.getRootElement());
  goog.array.forEach(ttElements, function(element) {
    var tip = new goog.ui.Tooltip(element);
    tip.setText(element.getAttribute("data-tooltip"));
    tip.className = "vsaq-tooltip";
  });
};
vsaq.QpageBase.prototype.scheduleNextUpdate = function(lastSaveFailed) {
  if (lastSaveFailed) {
    if (this.nextUpdateAttemptIn <= 256) {
      this.nextUpdateAttemptIn *= 2;
    }
  } else {
    this.nextUpdateAttemptIn = vsaq.QpageBase.SAVE_TIMEOUT_LENGTH;
  }
  this.saveTimeout = window.setTimeout(goog.bind(this.sendUpdate, this), this.nextUpdateAttemptIn * 1E3);
};
vsaq.QpageBase.prototype.loadQuestionnaire = goog.abstractMethod;
vsaq.QpageBase.prototype.unsavedChanges = function() {
  return goog.structs.getCount(this.changes) > 0;
};
vsaq.qpageObject_;
goog.provide("vsaq");
goog.provide("vsaq.Qpage");
goog.require("goog.Uri");
goog.require("goog.debug.Error");
goog.require("goog.dom");
goog.require("goog.events.EventType");
goog.require("goog.json");
goog.require("goog.net.XhrIo");
goog.require("goog.object");
goog.require("goog.storage.Storage");
goog.require("goog.storage.mechanism.HTML5LocalStorage");
goog.require("goog.string.path");
goog.require("goog.structs");
goog.require("vsaq.QpageBase");
goog.require("vsaq.QuestionnaireEditor");
goog.require("vsaq.utils");
vsaq.Qpage = function() {
  goog.base(this);
  var mechanism = new goog.storage.mechanism.HTML5LocalStorage;
  this.storage = new goog.storage.Storage(mechanism);
  this.questionnaireID = "";
  this.questionnaire.setReadOnlyMode(this.isReadOnly);
  var uploadAnswersDom = document.getElementById("answer_file");
  if (uploadAnswersDom) {
    uploadAnswersDom.addEventListener("change", goog.bind(this.loadAnswersFromFile, this), false);
  }
  try {
    this.loadQuestionnaire();
  } catch (e) {
    alert("An error occurred loading the questionnaire: " + e);
    throw e;
  }
};
goog.inherits(vsaq.Qpage, vsaq.QpageBase);
vsaq.Qpage.prototype.submitQuestionnaireToServer_ = function(id, server, xsrf, opt_redirect) {
  if (this.isReadOnly) {
    alert("This questionnaire is readonly and can therefore not be submitted.");
    return;
  }
  var answers = this.questionnaire.getValuesAsJson();
  goog.net.XhrIo.send(server, goog.bind(function(e) {
    if (!e.target.isSuccess()) {
      alert("Submitting the questionnaire failed!");
    } else {
      if (opt_redirect) {
        if (typeof opt_redirect == "function") {
          opt_redirect();
        } else {
          document.location = opt_redirect;
        }
      }
    }
  }, this), "POST", goog.string.format("id=%s&_xsrf_=%s&answers=%s", encodeURIComponent(id), encodeURIComponent(xsrf), encodeURIComponent(answers)));
};
vsaq.Qpage.prototype.loadAnswersFromServer_ = function(id, server) {
  goog.net.XhrIo.send(server, goog.bind(function(e) {
    var text = e.target.getResponseText();
    if (e.target.isSuccess()) {
      this.questionnaire.render();
      this.questionnaire.setValues((JSON.parse(text)));
    } else {
      alert("Couldn't load questionnaire answers!");
    }
  }, this), "POST", "id=" + encodeURIComponent(id));
};
vsaq.Qpage.prototype.updateStorage_ = function(data) {
  if (!this.questionnaireID) {
    return;
  }
  var newStorageData = null;
  var storageData = this.readStorage_();
  if (storageData) {
    storageData = JSON.parse(storageData);
    goog.object.extend(storageData, data);
    newStorageData = goog.json.serialize(storageData);
  } else {
    newStorageData = goog.json.serialize(data);
  }
  this.storage.set(this.questionnaireID, newStorageData);
};
vsaq.Qpage.prototype.readStorage_ = function() {
  if (!this.questionnaireID) {
    return null;
  }
  return (this.storage.get(this.questionnaireID));
};
vsaq.Qpage.prototype.clearStorage = function() {
  if (this.questionnaireID) {
    this.storage.remove(this.questionnaireID);
  }
};
vsaq.Qpage.prototype.sendUpdate = function() {
  window.clearTimeout(this.saveTimeout);
  if (!this.isReadOnly && goog.structs.getCount(this.changes) > 0) {
    this.updateStorage_(this.changes);
    this.updateDownloadAnswersUrl();
    this.changes = {};
    if (!goog.structs.getCount(this.changes)) {
      goog.dom.setTextContent(this.statusIndicator, "Draft Saved");
    }
  }
  this.scheduleNextUpdate(false);
};
vsaq.Qpage.prototype.loadAnswersFromFile = function(evt) {
  var answer_file = evt.target.files[0];
  var reader = new FileReader;
  reader.onload = goog.bind(function(f) {
    return goog.bind(function(e) {
      var answers = e.target.result;
      this.questionnaire.setValues((JSON.parse(answers)));
    }, this);
  }, this)(answer_file);
  reader.readAsText(answer_file);
};
vsaq.Qpage.prototype.updateDownloadAnswersUrl = function() {
  var downloadLink = goog.dom.getElement("_vsaq_save_questionnaire");
  var storageData = this.readStorage_();
  if (!downloadLink || !storageData) {
    return;
  }
  var MIME_TYPE = "text/plain";
  var textFileAsBlob = new Blob([storageData], {type:MIME_TYPE});
  var fileNameToSaveAs = "answers_" + this.questionnaireID;
  downloadLink.download = fileNameToSaveAs;
  window.URL = window.URL || window.webkitURL;
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.className = "maia-button";
};
vsaq.Qpage.prototype.loadExtensionThenQuestionnaire = function(questionnaire_path, extension_path) {
  goog.net.XhrIo.send(extension_path, goog.bind(function(e) {
    var text = e.target.getResponseText();
    if (!e.target.isSuccess()) {
      alert(text);
    } else {
      text = vsaq.utils.vsaqonToJson(text);
      var extension = {};
      try {
        extension = JSON.parse(text);
      } catch (err) {
        alert("Loading the extension failed. It does not appear to be " + "valid json");
      }
      this.loadQuestionnaire(questionnaire_path, extension);
    }
  }, this), "GET");
};
vsaq.Qpage.prototype.loadQuestionnaire = function(opt_path, opt_extension) {
  var uri = new goog.Uri(document.location.search);
  this.questionnaire.setUnrolledMode(uri.getQueryData().get("unroll", "") == "true");
  if (opt_path) {
    this.questionnaireID = goog.string.path.baseName(opt_path);
    this.questionnaireID = this.questionnaireID.replace(/\.[^/.]+$/, "");
    this.questionnaireID = this.questionnaireID.replace(/\//, "_");
    goog.net.XhrIo.send(opt_path, goog.bind(function(e) {
      var text = e.target.getResponseText();
      if (!e.target.isSuccess()) {
        alert(text);
      } else {
        text = vsaq.utils.vsaqonToJson(text);
        var template = {};
        try {
          template = JSON.parse(text);
        } catch (err) {
          alert("Loading the template failed. It does not appear to be " + "valid json");
          return;
        }
        if (!template) {
          alert("Empty template!");
          return;
        }
        if (opt_extension) {
          this.questionnaire.setMultipleTemplates(template, opt_extension);
        } else {
          this.questionnaire.setTemplate(template["questionnaire"]);
        }
        this.questionnaire.render();
        this.installToolTips();
        var storageData = this.readStorage_();
        if (storageData) {
          this.questionnaire.setValues((JSON.parse(storageData)));
          this.updateDownloadAnswersUrl();
        }
        this.questionnaire.listen(goog.events.EventType.CHANGE, goog.bind(function(e) {
          goog.structs.forEach(e.changedValues, function(val, key) {
            this.changes[key] = val;
          }, this);
          if (goog.structs.getCount(this.changes) > 0) {
            goog.dom.setTextContent(this.statusIndicator, "Changes pending...");
            var saveBtn = goog.dom.getElement("_vsaq_save_questionnaire");
            saveBtn.className = "maia-button maia-button-disabled";
          }
        }, this));
        this.scheduleNextUpdate(false);
      }
    }, this), "GET");
  }
};
vsaq.initQuestionnaire = function() {
  if (vsaq.qpageObject_) {
    return vsaq.qpageObject_;
  }
  vsaq.qpageObject_ = new vsaq.Qpage;
  var templatePattern = new RegExp(/^\/?questionnaires\/[a-z0-9_]+\.json$/i);
  var uri = new goog.Uri(document.location.search);
  var questionnairePath = (uri.getQueryData().get("qpath", ""));
  if (questionnairePath && !templatePattern.test(questionnairePath)) {
    throw new goog.debug.Error("qpath must be a relative path and must match this pattern: " + templatePattern.toString());
  }
  var extensionPath = (uri.getQueryData().get("extension", ""));
  if (extensionPath) {
    if (!templatePattern.test(extensionPath)) {
      throw new goog.debug.Error("extension must be a relative path and must match this pattern: " + templatePattern.toString());
    }
    vsaq.qpageObject_.loadExtensionThenQuestionnaire(questionnairePath, extensionPath);
  } else {
    vsaq.qpageObject_.loadQuestionnaire(questionnairePath);
  }
  return vsaq.qpageObject_;
};
vsaq.clearAnswers = function() {
  if (confirm("Are you sure that you want to delete all answers?")) {
    if (vsaq.qpageObject_) {
      vsaq.qpageObject_.clearStorage();
      vsaq.qpageObject_ = null;
    }
    vsaq.initQuestionnaire();
  }
};
if (!goog.getObjectByName("goog.testing.TestRunner")) {
  vsaq.initQuestionnaire();
  new vsaq.QuestionnaireEditor;
  vsaq.utils.initClickables({"eh-clear":vsaq.clearAnswers});
}
;

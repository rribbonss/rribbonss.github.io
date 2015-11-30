/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __slice = [].slice;

  window.BeelineUtils = {
    colorIsDark: function(hexColor) {
      var b, g, luma, r, rgb;
      rgb = parseInt(hexColor.substring(1), 16);
      r = (rgb >> 16) & 0xff;
      g = (rgb >> 8) & 0xff;
      b = (rgb >> 0) & 0xff;
      luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luma < 80;
    },
    attachElement: function(elem, doc) {
      var head;
      if (doc == null) {
        doc = document;
      }
      head = doc.getElementsByTagName('head')[0];
      if (head) {
        return head.appendChild(elem);
      } else {
        return doc.body.appendChild(elem);
      }
    },
    loadScript: function(src, opts) {
      var script;
      if (opts == null) {
        opts = {};
      }
      script = document.createElement('SCRIPT');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', src + (opts.reload ? "?r=" + (Math.random()) : ""));
      this.attachElement(script);
      if ((opts.loads != null) && (opts.then != null)) {
        return this.whenTrue((function() {
          return window[opts.loads] != null;
        }), opts.then);
      }
    },
    loadCSS: function(href, opts) {
      var doc, link;
      if (opts == null) {
        opts = {};
      }
      doc = opts.document || document;
      if (!opts.id || !doc.getElementById(opts.id)) {
        link = doc.createElement('LINK');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', href);
        if (opts.id != null) {
          link.setAttribute('id', opts.id);
        }
        link.setAttribute('type', 'text/css');
        link.setAttribute('media', opts.media || 'all');
        return this.attachElement(link, doc);
      }
    },
    removeCSS: function(href) {
      var node, _i, _len, _ref, _results;
      _ref = document.querySelectorAll("link[href='" + href + "']");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.parentNode.removeChild(node));
      }
      return _results;
    },
    afterRender: function(callback) {
      var c,
        _this = this;
      c = function() {
        var e;
        try {
          return callback.call(_this);
        } catch (_error) {
          e = _error;
          return BeelineUtils.log("Exception in afterRender", e, e != null ? e.stack : void 0);
        }
      };
      return window.setTimeout(c, 1);
    },
    log: function() {
      var s;
      s = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (typeof console !== 'undefined') {
        return typeof console.log === "function" ? console.log.apply(console, ["BeeLine Reader: "].concat(__slice.call(s))) : void 0;
      }
    },
    reload: function(e) {
      if (e == null) {
        e = null;
      }
      if (e) {
        e.preventDefault();
      }
      return window.location.reload();
    },
    alert: function(message) {
      return alert(message);
    },
    url: function() {
      var _ref;
      return (_ref = window.location) != null ? _ref.href : void 0;
    },
    urlMatches: function(pattern) {
      var _ref, _ref1;
      return (_ref = window.location) != null ? (_ref1 = _ref.href) != null ? _ref1.match(pattern) : void 0 : void 0;
    },
    redirect: function(url, params) {
      var key, str;
      if (params == null) {
        params = {};
      }
      str = "";
      for (key in params) {
        if (str !== "") {
          str += "&";
        }
        str += key + "=" + encodeURIComponent(params[key]);
      }
      return window.location.href = url + (str ? "?" + str : "");
    },
    domain: function() {
      var _ref, _ref1;
      return (_ref = window.location) != null ? (_ref1 = _ref.origin) != null ? _ref1.replace(/^https?:\/\//i, '') : void 0 : void 0;
    },
    offset: function(node) {
      var curTransform, left, top;
      left = top = 0;
      if (node.offsetParent) {
        if (window.WebKitCSSMatrix != null) {
          while (true) {
            curTransform = new WebKitCSSMatrix(window.getComputedStyle(node).webkitTransform);
            left += node.offsetLeft + curTransform.m41;
            top += node.offsetTop + curTransform.m42;
            if (!(node = node.offsetParent)) {
              break;
            }
          }
        } else {
          while (true) {
            left += node.offsetLeft;
            top += node.offsetTop;
            if (!(node = node.offsetParent)) {
              break;
            }
          }
        }
      }
      return [left, top];
    },
    outsideOfViewport: function(node, scale) {
      var bottom, left, right, top, _ref;
      if (scale == null) {
        scale = 0;
      }
      _ref = this.offset(node), left = _ref[0], top = _ref[1];
      bottom = top + node.offsetHeight;
      right = left + node.offsetWidth;
      return bottom < window.pageYOffset - window.innerHeight * scale || right < window.pageXOffset - window.innerWidth * scale || left > window.pageXOffset + window.innerWidth * (scale + 1) || top > window.pageYOffset + window.innerHeight * (scale + 1);
    },
    whenTrue: function(condition, callback) {
      var go,
        _this = this;
      go = function() {
        if (condition()) {
          return callback();
        } else {
          BeelineUtils.log("Condition hasn't matched, trying again in a moment...");
          return setTimeout(go, 50);
        }
      };
      return go();
    },
    not: function(func) {
      return function() {
        return !func();
      };
    },
    presentSliceOf: function(object) {
      var key, slice, val;
      slice = {};
      for (key in object) {
        val = object[key];
        if ((val != null) && val !== '') {
          slice[key] = val;
        }
      }
      return slice;
    },
    evalOrReturn: function() {
      var args, context, thing;
      context = arguments[0], thing = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (typeof thing === 'function') {
        return thing.apply(context, args);
      } else {
        return thing;
      }
    },
    installCustomCSS: function(id, colorClassname, styleData) {
      var elem;
      if (document.getElementsByClassName(colorClassname).length > 0) {
        return;
      }
      if ((elem = document.getElementById(id))) {
        elem.parentNode.removeChild(elem);
      }
      elem = document.createElement('style');
      elem.setAttribute('type', 'text/css');
      elem.setAttribute('id', id);
      elem.setAttribute('class', colorClassname);
      if (/trident/i.test(navigator.userAgent)) {
        elem.sheet.cssText = styleData;
      } else if (/msie/i.test(navigator.userAgent) && !(/opera/i.test(navigator.userAgent))) {
        elem.styleSheet.cssText = styleData;
      } else {
        if (elem.innerText != null) {
          elem.innerText = styleData;
        } else {
          elem.innerHTML = styleData;
        }
      }
      return document.getElementsByTagName('head')[0].appendChild(elem);
    },
    epochInSeconds: function() {
      return parseInt((new Date()).getTime() / 1000);
    },
    sendGaTrack: function(g, h, i) {
      var a, b, c, d, f, k, l, m, n;
      c = function(e, j) {
        return e + Math.floor(Math.random() * (j - e));
      };
      f = 1000000000;
      k = c(f, 9999999999);
      a = c(10000000, 99999999);
      l = c(f, 2147483647);
      b = (new Date()).getTime();
      d = window.location;
      m = new Image();
      n = '//www.google-analytics.com/__utm.gif?utmwv=1.3&utmn=' + k + '&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn=' + h + '&utmr=' + d + '&utmp=' + i + '&utmac=' + g + '&utmcc=__utma%3D' + a + '.' + l + '.' + b + '.' + b + '.' + b + '.2%3B%2B__utmb%3D' + a + '%3B%2B__utmc%3D' + a + '%3B%2B__utmz%3D' + a + '.' + b + '.2.2.utmccn%3D(referral)%7Cutmcsr%3D' + d.host + '%7Cutmcct%3D' + d.pathname + '%7Cutmcmd%3Dreferral%3B%2B__utmv%3D' + a + '.-%3B';
      return m.src = n;
    }
  };

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.BeeLineReader = (function() {
    BeeLineReader.prototype.BEELINE_INDICATOR_CLASS = 'beeline-node';

    BeeLineReader.SKIP_COLOR_ATTRIBUTE = 'data-beeline-skip';

    BeeLineReader.prototype.DEFAULT_SKIP_TAGS = ['svg', 'h1', 'h2', 'h3', 'h4', 'h5', 'style', 'script'];

    BeeLineReader.prototype.NUM_COLORS = 4;

    BeeLineReader.prototype.SPACE_REGEX = /^\s+$/;

    BeeLineReader.prototype.MIN_COLOR_WIDTH = 100;

    BeeLineReader.prototype.WRAPPER_TYPE = "beelinespan";

    BeeLineReader.prototype.BASE_CLASS_PATTERN = /^(beeline-colored-area|beeline-theme-\w+)$/g;

    BeeLineReader.THEMES = {
      'bright': ["#000000", "#0000FF", "#000000", "#FF0500", "#FBFBFB"],
      'dark': ["#000000", "#00057F", "#000000", "#970000", "#FBFBFB"],
      'blues': ["#000000", "#0000FF", "#000000", "#840DD2", "#FBFBFB"],
      'gray': ["#000000", "#666666", "#000000", "#666666", "#FBFBFB"],
      'night_gray': ["#FBFBFB", "#666666", "#FBFBFB", "#666666", "#000000"],
      'night_blues': ["#FBFBFB", "#56AAFF", "#FBFBFB", "#9E8DFC", "#000000"],
      'custom': ["#000000", "#0000FF", "#000000", "#FF0500", "#FBFBFB"]
    };

    BeeLineReader.DEFAULT_THEME = 'bright';

    BeeLineReader.THEME_ORDER = ['bright', 'dark', 'blues', 'gray', 'night_gray', 'night_blues'];

    BeeLineReader.prototype.COLOR_BLOCK_LENGTH = 2000;

    BeeLineReader.prototype.WORK_INTERVAL = 20;

    function BeeLineReader(node, options) {
      var _base;
      if (options == null) {
        options = {};
      }
      this._resizeHandler = __bind(this._resizeHandler, this);
      this.recolor = __bind(this.recolor, this);
      this.uncolor = __bind(this.uncolor, this);
      this.color = __bind(this.color, this);
      if (!node || (node && node.jquery)) {
        throw "A raw DOM Node is required when creating a BeeLineReader instance.  If you are providing a jQuery node, you should call get(0) on it to extract the DOM node.";
      }
      this.node = node;
      this.options = options;
      this.listeners = {};
      this.reflowNeeded = true;
      this.colorCache = {};
      this.tohexCache = {};
      this.coloring = false;
      this.colored = false;
      this.charsColored = 0;
      this.charsWrapped = 0;
      this.abortCount = 0;
      this.workInterval = options.workInterval || this.WORK_INTERVAL;
      (_base = this.options).skipTags || (_base.skipTags = this.DEFAULT_SKIP_TAGS);
      if (this.browserIsCompatible()) {
        if (this.options.handleResize) {
          this._setupResizeHandler();
        }
        if (this.options.colorImmediately) {
          BeelineUtils.afterRender(this.color);
        }
      }
    }

    BeeLineReader.prototype.color = function(callback) {
      var callbackWithTrigger,
        _this = this;
      if (!this.browserIsCompatible()) {
        return typeof callback === "function" ? callback() : void 0;
      }
      callbackWithTrigger = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _this.trigger.apply(_this, ["afterColor"].concat(__slice.call(args)));
        if (callback) {
          return callback.apply(null, args);
        }
      };
      this.trigger("beforeColor");
      if (this.getTheme() === 'custom') {
        return this._color(this.node, this.options.customColor1 || BeeLineReader.THEMES['custom'][0], this.options.customColor2 || BeeLineReader.THEMES['custom'][1], this.options.customColor3 || BeeLineReader.THEMES['custom'][2], this.options.customColor4 || BeeLineReader.THEMES['custom'][3], this.options.customBackground || BeeLineReader.THEMES['custom'][4], callbackWithTrigger);
      } else {
        return this._color.apply(this, [this.node].concat(__slice.call(BeeLineReader.THEMES[this.getTheme()]), [callbackWithTrigger]));
      }
    };

    BeeLineReader.prototype.getTheme = function() {
      return (this.options.theme && BeeLineReader.THEMES[this.options.theme] && this.options.theme) || BeeLineReader.DEFAULT_THEME;
    };

    BeeLineReader.prototype.setCustom = function(color1, color2, color3, color4, backgroundColor) {
      this.options.theme = 'custom';
      this.options.customColor1 = color1;
      this.options.customColor2 = color2;
      this.options.customColor3 = color3;
      this.options.customColor4 = color4;
      return this.options.customBackground = backgroundColor;
    };

    BeeLineReader.prototype.setOptions = function(options) {
      var key, value, _results;
      _results = [];
      for (key in options) {
        value = options[key];
        _results.push(this.options[key] = value);
      }
      return _results;
    };

    BeeLineReader.prototype.uncolor = function() {
      this.trigger('beforeUncolor');
      this._unwrap(this.node);
      if (!this.options.skipBackgroundColor) {
        this._revertBackground(this.node);
      }
      this._removeClasses(this.node, this.BASE_CLASS_PATTERN);
      this.colored = false;
      return this.reflowNeeded = true;
    };

    BeeLineReader.prototype.recolor = function(callback) {
      if (!this.browserIsCompatible()) {
        return typeof callback === "function" ? callback() : void 0;
      }
      this.trigger('beforeRecolor');
      this.reflowNeeded = true;
      return this.color(callback);
    };

    BeeLineReader.prototype.cleanup = function() {
      if (this.alreadySetupResizeHandler) {
        window.removeEventListener('resize', this._resizeHandler, false);
      }
      return this.trigger('afterCleanup');
    };

    BeeLineReader.prototype.bind = function(event, callback, binding) {
      var _base;
      (_base = this.listeners)[event] || (_base[event] = []);
      return this.listeners[event].push([callback, binding || this]);
    };

    BeeLineReader.prototype.trigger = function() {
      var args, binding, callback, event, _i, _len, _ref, _ref1, _results;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.listeners[event] || [];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], callback = _ref1[0], binding = _ref1[1];
        _results.push(callback.apply(binding, args));
      }
      return _results;
    };

    BeeLineReader.prototype.browserIsCompatible = function() {
      var ie;
      ie = this._getInternetExplorerVersion();
      return ie === -1 || ie >= 9;
    };

    BeeLineReader.prototype._getInternetExplorerVersion = function() {
      var re, rv, ua;
      rv = -1;
      if (navigator.appName === 'Microsoft Internet Explorer') {
        ua = navigator.userAgent;
        re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) !== null) {
          rv = parseFloat(RegExp.$1);
        }
      }
      return rv;
    };

    BeeLineReader.prototype._setupResizeHandler = function() {
      if (!this.alreadySetupResizeHandler) {
        this.alreadySetupResizeHandler = true;
        return window.addEventListener('resize', this._resizeHandler, false);
      }
    };

    BeeLineReader.prototype._resizeHandler = function() {
      var _this = this;
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      return this.resizeTimer = setTimeout((function() {
        _this.resizeTimer = null;
        if (_this.colored) {
          BeelineUtils.log("re-coloring after resize");
          return _this.recolor();
        }
      }), 500);
    };

    BeeLineReader.prototype._addClasses = function(parseNode, classes) {
      return parseNode.className = __slice.call(parseNode.className.split(/\s+/)).concat([classes]).join(" ");
    };

    BeeLineReader.prototype._removeClasses = function(parseNode, regex) {
      var part, parts;
      parts = parseNode.className.split(/\s+/);
      return parseNode.className = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          if (!part.match(regex)) {
            _results.push(part);
          }
        }
        return _results;
      })()).join(" ");
    };

    BeeLineReader.prototype._installCustomStyles = function(color) {
      var styleData, tag;
      styleData = "" + (((function() {
        var _i, _len, _ref, _results;
        _ref = this.options.skipTags;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          _results.push(".beeline-colored-area " + tag + ", ");
        }
        return _results;
      }).call(this)).join(" ")) + "\n.beeline-colored-area a,\n.beeline-colored-area a:hover,\n.beeline-colored-area a:active,\n.beeline-colored-area a:visited {\n  color: " + color + ";\n}";
      return BeelineUtils.installCustomCSS("beeline-custom-styles", "beeline-custom-styles-" + (color.replace('#', '')), styleData.replace(/[\n\r]/g, ''));
    };

    BeeLineReader.prototype._color = function(parseNode, firstColorMinHex, firstColorMaxHex, secondColorMinHex, secondColorMaxHex, backgroundColorHex, callback) {
      var _this = this;
      this.abortCount++;
      return BeelineUtils.whenTrue((function() {
        return !_this.coloring;
      }), function() {
        var onColorCompletion, state, workQueue;
        onColorCompletion = function() {
          _this.reflowNeeded = false;
          _this.colored = true;
          _this.coloring = false;
          if (callback) {
            return callback();
          }
        };
        if (parseNode.hasChildNodes()) {
          _this.coloring = true;
          _this.abortCount--;
          if (!_this.options.skipBackgroundColor) {
            if (parseNode.style.backgroundColor && !parseNode.originalBackgroundColor) {
              parseNode.originalBackgroundColor = parseNode.style.backgroundColor;
            }
            parseNode.style.backgroundColor = backgroundColorHex;
          }
          _this._installCustomStyles(firstColorMinHex);
          _this._removeClasses(parseNode, _this.BASE_CLASS_PATTERN);
          _this._addClasses(parseNode, "beeline-colored-area beeline-theme-" + (_this.getTheme()));
          workQueue = [];
          state = {
            reflowNeeded: _this.reflowNeeded,
            xlast: null,
            ylast: null,
            xfirst: null,
            line: [],
            thisColor: 0,
            colorOne: firstColorMinHex,
            colorTwo: firstColorMaxHex,
            colorThree: secondColorMinHex,
            colorFour: secondColorMaxHex,
            reflowNeeded: _this.reflowNeeded,
            rtl: (window.getComputedStyle(parseNode, null).direction || '').toLowerCase() === 'rtl',
            colorPairs: []
          };
          if (state.xmin === state.xmax) {
            state.xmax += 1;
          }
          _this._wrapAndColor(parseNode, workQueue, state);
          return _this._workOff(workQueue, {
            abortable: true,
            after: function(aborted) {
              if (aborted) {
                _this.trigger('coloringAborted');
                BeelineUtils.log("aborted coloring");
                return onColorCompletion();
              } else {
                _this._colorLine(state, true);
                return _this._workOff(workQueue, {
                  after: onColorCompletion
                });
              }
            }
          });
        } else {
          if (callback) {
            return callback({
              error: "This node has no children"
            });
          }
        }
      });
    };

    BeeLineReader.prototype._wrapAndColor = function(node, queue, state) {
      var next, _ref, _results,
        _this = this;
      if (node.nodeType === 1) {
        if (node = node.firstChild) {
          _results = [];
          while (true) {
            next = node.nextSibling;
            if (!(node.nodeType === 1 && ((_ref = node.nodeName.toLowerCase(), __indexOf.call(this.options.skipTags, _ref) >= 0) || node.getAttribute(BeeLineReader.SKIP_COLOR_ATTRIBUTE) === 'true'))) {
              if (node.className === this.BEELINE_INDICATOR_CLASS) {
                this._colorNode(queue, node, state);
              } else {
                this._wrapAndColor(node, queue, state);
              }
            }
            if (!(node = next)) {
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      } else if (node.nodeType === 3) {
        if (this.options.viewportOnly && BeelineUtils.outsideOfViewport(node.parentNode, this.options.viewportMarginMultiple || 0)) {
          return;
        }
        return queue.push(function() {
          var gatheredChars, j, newSpan, newText, numchars, text, thisChar, thisParent, _i;
          numchars = node.length;
          thisParent = node.parentNode;
          text = node.nodeValue;
          if (thisParent && numchars && !(_this.SPACE_REGEX.test(text))) {
            gatheredChars = '';
            for (j = _i = 0; 0 <= numchars ? _i < numchars : _i > numchars; j = 0 <= numchars ? ++_i : --_i) {
              thisChar = text.charAt(j);
              if (thisChar === ' ' || thisChar === "\n" || thisChar === "\t" || thisChar === "\r") {
                gatheredChars += thisChar;
              } else {
                if (gatheredChars) {
                  newText = document.createTextNode(gatheredChars);
                  newSpan = document.createElement(_this.WRAPPER_TYPE);
                  newSpan.className = _this.BEELINE_INDICATOR_CLASS;
                  newSpan.appendChild(newText);
                  thisParent.insertBefore(newSpan, node);
                  _this.charsWrapped += 1;
                  _this._colorNode(queue, newSpan, state);
                }
                gatheredChars = thisChar;
              }
            }
            if (gatheredChars) {
              newText = document.createTextNode(gatheredChars);
              newSpan = document.createElement(_this.WRAPPER_TYPE);
              newSpan.className = _this.BEELINE_INDICATOR_CLASS;
              newSpan.appendChild(newText);
              thisParent.insertBefore(newSpan, node);
              _this.charsWrapped += 1;
              _this._colorNode(queue, newSpan, state);
            }
            return thisParent.removeChild(node);
          }
        });
      }
    };

    BeeLineReader.prototype._colorNode = function(queue, node, state) {
      var _this = this;
      return queue.push(function() {
        var newLine, rect, x, y;
        _this.charsColored += 1;
        if (state.reflowNeeded) {
          rect = node.getBoundingClientRect();
          node.cachedBeeLineXRect = rect;
        } else {
          rect = node.cachedBeeLineXRect || node.getBoundingClientRect();
        }
        x = rect.left;
        y = rect.top;
        if (x >= 0 || _this.options.colorOffScreen) {
          if (state.xlast === null) {
            state.xfirst = x;
            state.xlast = x;
            state.ylast = y;
          }
          if (state.rtl) {
            newLine = (x - state.xlast) > 3;
          } else {
            newLine = (x - state.xlast) < -3 || (y - state.ylast) < -50;
          }
          if (newLine) {
            _this._colorLine(state);
            state.xfirst = x;
          }
          state.xlast = x;
          state.ylast = y;
          return state.line.push([node, x]);
        }
      });
    };

    BeeLineReader.prototype._colorLine = function(state, final) {
      var charNode, charx, lastx, maxColor, minColor, _i, _len, _ref, _ref1;
      if (final == null) {
        final = false;
      }
      if (state.line.length) {
        if (state.thisColor < 2) {
          minColor = state.colorOne;
          maxColor = state.colorTwo;
        } else {
          minColor = state.colorThree;
          maxColor = state.colorFour;
        }
        lastx = state.line[state.line.length - 1][1];
        _ref = state.line;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _ref1 = _ref[_i], charNode = _ref1[0], charx = _ref1[1];
          if (state.rtl) {
            state.colorPairs.push([charNode, this._getColor(state.thisColor, charx, state.xfirst, lastx, maxColor, minColor)]);
          } else {
            state.colorPairs.push([charNode, this._getColor(state.thisColor, charx, state.xfirst, lastx, minColor, maxColor)]);
          }
        }
        this._partialColor(state, final);
        state.thisColor += 1;
        state.thisColor %= this.NUM_COLORS;
        return state.line = [];
      }
    };

    BeeLineReader.prototype._partialColor = function(state, final) {
      var charNode, color, _i, _len, _ref, _ref1;
      if (final || state.colorPairs.length > this.COLOR_BLOCK_LENGTH) {
        _ref = state.colorPairs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _ref1 = _ref[_i], charNode = _ref1[0], color = _ref1[1];
          charNode.style.setProperty('color', color, 'important');
        }
        return state.colorPairs = [];
      }
    };

    BeeLineReader.prototype._getColor = function(thisColor, xcoord, xmin, xmax, minColor, maxColor) {
      var m0, maxb, maxg, maxr, mb, mg, minb, ming, minr, mr, xhere, y, yb, ycosdown, ycosup, ydown, yg, yr, yup, _b, _g, _r, _ref;
      if (this.colorCache[minColor + maxColor]) {
        _ref = this.colorCache[minColor + maxColor], maxr = _ref[0], minr = _ref[1], maxg = _ref[2], ming = _ref[3], maxb = _ref[4], minb = _ref[5];
      } else {
        maxr = this._hexToR(maxColor);
        minr = this._hexToR(minColor);
        maxg = this._hexToG(maxColor);
        ming = this._hexToG(minColor);
        maxb = this._hexToB(maxColor);
        minb = this._hexToB(minColor);
        this.colorCache[minColor + maxColor] = [maxr, minr, maxg, ming, maxb, minb];
      }
      _r = _g = _b = 0;
      m0 = 3.1415 / (xmax - xmin);
      mr = maxr - minr;
      mg = maxg - ming;
      mb = maxb - minb;
      xhere = y = yup = ydown = yr = yg = yb = ycosup = ycosup = 0;
      switch (thisColor) {
        case 0:
          xhere = xcoord - xmin;
          y = m0 * xhere;
          yup = y - 3.1415;
          ycosup = Math.cos(yup);
          ycosup += 1;
          ycosup = ycosup / 2;
          yr = mr * ycosup;
          yr = yr + minr;
          yg = mg * ycosup;
          yg = yg + ming;
          yb = mb * ycosup;
          yb = yb + minb;
          _r = Math.round(yr);
          _g = Math.round(yg);
          _b = Math.round(yb);
          break;
        case 1:
          xhere = xcoord - xmin;
          y = m0 * xhere;
          ydown = y;
          ycosdown = Math.cos(ydown);
          ycosdown += 1;
          ycosdown = ycosdown / 2;
          yr = mr * ycosdown;
          yr = yr + minr;
          yg = mg * ycosdown;
          yg = yg + ming;
          yb = mb * ycosdown;
          yb = yb + minb;
          _r = Math.round(yr);
          _g = Math.round(yg);
          _b = Math.round(yb);
          break;
        case 2:
          xhere = xcoord - xmin;
          y = m0 * xhere;
          yup = y - 3.1415;
          ycosup = Math.cos(yup);
          ycosup += 1;
          ycosup = ycosup / 2;
          yr = mr * ycosup;
          yr = yr + minr;
          yg = mg * ycosup;
          yg = yg + ming;
          yb = mb * ycosup;
          yb = yb + minb;
          _r = Math.round(yr);
          _g = Math.round(yg);
          _b = Math.round(yb);
          break;
        case 3:
          xhere = xcoord - xmin;
          y = m0 * xhere;
          ydown = y;
          ycosdown = Math.cos(ydown);
          ycosdown += 1;
          ycosdown = ycosdown / 2;
          yr = mr * ycosdown;
          yr = yr + minr;
          yg = mg * ycosdown;
          yg = yg + ming;
          yb = mb * ycosdown;
          yb = yb + minb;
          _r = Math.round(yr);
          _g = Math.round(yg);
          _b = Math.round(yb);
          break;
        default:
          _r = 127;
          _g = 127;
          _b = 127;
      }
      return this._rgbToHex(_r, _g, _b);
    };

    BeeLineReader.prototype._rgbToHex = function(r, g, b) {
      return "#" + this._toHex(r) + this._toHex(g) + this._toHex(b);
    };

    BeeLineReader.prototype._toHex = function(n) {
      var cachedValue;
      if (!(cachedValue = this.tohexCache[n])) {
        n = parseInt(n, 10);
        if (isNaN(n)) {
          return "00";
        }
        n = Math.max(0, Math.min(n, 255));
        cachedValue = "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
        this.tohexCache[n] = cachedValue;
      }
      return cachedValue;
    };

    BeeLineReader.prototype._hexToR = function(h) {
      return parseInt((this._cutHex(h)).substring(0, 2), 16);
    };

    BeeLineReader.prototype._hexToG = function(h) {
      return parseInt((this._cutHex(h)).substring(2, 4), 16);
    };

    BeeLineReader.prototype._hexToB = function(h) {
      return parseInt((this._cutHex(h)).substring(4, 6), 16);
    };

    BeeLineReader.prototype._cutHex = function(h) {
      if (h.charAt(0) === "#") {
        return h.substring(1, 7);
      } else {
        return h;
      }
    };

    BeeLineReader.prototype._time = function(name, callback) {
      var end, start;
      start = (new Date()).getTime();
      callback();
      end = (new Date()).getTime();
      return BeelineUtils.log("" + name + " took " + (end - start) + "ms");
    };

    BeeLineReader.prototype._revertBackground = function(node) {
      return node.style.backgroundColor = node.originalBackgroundColor || '';
    };

    BeeLineReader.prototype._unwrap = function(node) {
      var contiguous, element, region, regions, _i, _j, _len, _len1, _ref, _results;
      contiguous = [];
      regions = [];
      _ref = node.getElementsByClassName(this.BEELINE_INDICATOR_CLASS);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (contiguous.length === 0 || element === contiguous[contiguous.length - 1].nextSibling) {
          contiguous.push(element);
        } else {
          regions.push(contiguous);
          contiguous = [element];
        }
      }
      if (contiguous.length > 0) {
        regions.push(contiguous);
      }
      _results = [];
      for (_j = 0, _len1 = regions.length; _j < _len1; _j++) {
        region = regions[_j];
        _results.push(this._mergeContents(region));
      }
      return _results;
    };

    BeeLineReader.prototype._mergeContents = function(nodes) {
      var node, parent, text, _i, _j, _len, _len1, _ref, _ref1, _results;
      parent = nodes[0].parentNode;
      text = "";
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        if (((_ref = node.firstChild) != null ? _ref.nodeValue : void 0) !== null) {
          text += node.firstChild.nodeValue;
        }
      }
      parent.replaceChild(document.createTextNode(text), nodes[0]);
      _ref1 = nodes.slice(1, nodes.length);
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        node = _ref1[_j];
        _results.push(parent.removeChild(node));
      }
      return _results;
    };

    BeeLineReader.prototype._workOff = function(queue, opts) {
      var fn, startTime,
        _this = this;
      if (opts == null) {
        opts = {};
      }
      startTime = (new Date()).getTime();
      while ((new Date()).getTime() - startTime < this.workInterval && (fn = queue.shift())) {
        fn();
      }
      if (queue.length > 0 && opts.abortable && this.abortCount > 0) {
        if (opts.after) {
          return opts.after(true);
        }
      } else if (queue.length > 0) {
        return BeelineUtils.afterRender(function() {
          return _this._workOff(queue, opts);
        });
      } else {
        if (opts.after) {
          return opts.after();
        }
      }
    };

    return BeeLineReader;

  })();

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  (function($) {
    return window.BeeLineReaderExtension = (function() {
      BeeLineReaderExtension.prototype.settings = ['theme', 'openDyslexic', 'disableCustomSites', 'skipAutoColorOn', 'hasShownHelp', 'customColor1', 'customColor2', 'customColor3', 'customColor4', 'customBackground', 'licenseCode', 'licenseState', 'licenseCurrentPeriodEnd', 'licensePlan', 'licensePlanName', 'lastCheckedLicense', 'environment', 'usageData', 'legacy', 'upsells', 'kioskMode', 'kioskResetAt', 'kioskDisabled'];

      BeeLineReaderExtension.prototype.version = 1.7;

      BeeLineReaderExtension.prototype.KIOSK_WINDOW = 60 * 15;

      function BeeLineReaderExtension(options) {
        if (options == null) {
          options = {};
        }
        this.setVariablesInStorage = __bind(this.setVariablesInStorage, this);
        this.getVariablesFromStorage = __bind(this.getVariablesFromStorage, this);
        this.setVariables = __bind(this.setVariables, this);
        this.getVariables = __bind(this.getVariables, this);
        this.updateInterfaceColors = __bind(this.updateInterfaceColors, this);
        this.recolor = __bind(this.recolor, this);
        this.disable = __bind(this.disable, this);
        this.showConfigurationPane = __bind(this.showConfigurationPane, this);
        this.options = options;
        this.beelines = [];
      }

      BeeLineReaderExtension.prototype.init = function() {
        var _this = this;
        return this.loadSettings(function() {
          _this.checkLicense();
          _this.possiblyResetInKioskMode();
          _this.checkForCustomSite();
          if (_this.shouldInlineColor()) {
            _this.loadResources({
              disable: _this.options.customSite.disable
            });
            return _this.launchDelay(function() {
              _this.initCustomSite();
              if (!_this.disabled) {
                return _this.sharedStartupActions();
              }
            });
          } else {
            if (_this.manualUsageAllowed()) {
              return _this.loadReadbility(function(parseNode) {
                _this.loadResources({
                  readability: true
                });
                return _this.launchDelay(function() {
                  _this.setupBeelineForReadability(parseNode);
                  return _this.sharedStartupActions();
                });
              });
            } else {
              _this.loadResources();
              return _this.launchDelay(function() {
                return _this._showNoMoreUsagesTodayLightbox();
              });
            }
          }
        });
      };

      BeeLineReaderExtension.prototype.sharedStartupActions = function() {
        this.showPopupIfNeeded();
        this.updateOpenDyslexic();
        this.gaTrackLoad();
        this.addTools();
        if (this.development()) {
          return BeelineUtils.log("IN " + this.options.environment + " MODE");
        }
      };

      BeeLineReaderExtension.prototype.setupBeelineForReadability = function(parseNode) {
        var beeline,
          _this = this;
        beeline = new BeeLineReader(parseNode, {
          handleResize: this.options.handleResize,
          openDyslexic: this.options.openDyslexic
        });
        this.addBeeline(beeline, {
          manual: true
        });
        return BeelineUtils.afterRender(function() {
          return _this.color();
        });
      };

      BeeLineReaderExtension.prototype.checkForCustomSite = function() {
        var className, handler, klass, _ref;
        _ref = this.getCustomHandlers();
        for (className in _ref) {
          klass = _ref[className];
          handler = new klass(this);
          if (handler.matches()) {
            this.options.customSite = handler;
            this.options.customSiteClassName = className;
            break;
          }
        }
        if (this.options.disableCustomSites) {
          this.options.disabledCustomSite = this.options.customSite;
          return this.options.customSite = null;
        }
      };

      BeeLineReaderExtension.prototype.getCustomHandlers = function() {
        return BeeLineReaderExtension.customHandlers;
      };

      BeeLineReaderExtension.prototype.shouldInlineColor = function() {
        return (this.options.customSite != null) && !this.options.skipAutoColorOn[this.options.customSiteClassName];
      };

      BeeLineReaderExtension.prototype.shouldAutoColor = function() {
        return this.shouldInlineColor() && BeelineUtils.evalOrReturn(this.options.customSite, this.options.customSite.autoColor, this);
      };

      BeeLineReaderExtension.prototype.backgroundColor = function() {
        if (this.options.theme === "custom") {
          return this.options.customBackground || BeeLineReader.THEMES['custom'][4];
        } else {
          return BeeLineReader.THEMES[this.getTheme()][4];
        }
      };

      BeeLineReaderExtension.prototype.initCustomSite = function() {
        var now, _base, _ref, _ref1;
        if (((_ref = this.options.customSite) != null ? (_ref1 = _ref.disable) != null ? _ref1.backgrounds : void 0 : void 0) && BeelineUtils.colorIsDark(this.backgroundColor())) {
          this.options.theme = "bright";
        }
        if (this.autoUsageAllowed()) {
          this.options.customSite.run();
          return this.disabled = !this.options.customSite.working;
        } else {
          now = BeelineUtils.epochInSeconds();
          if ((this.options.upsells.lastAutoDisallow || 0) < now - 24 * 60 * 60) {
            this.options.upsells.lastAutoDisallow = now;
            (_base = this.options.upsells).autoDisallowCount || (_base.autoDisallowCount = 0);
            this.options.upsells.autoDisallowCount += 1;
            return this.setVariables({
              upsells: this.options.upsells
            });
          }
        }
      };

      BeeLineReaderExtension.prototype.gaPlanType = function() {
        if (this.options.legacy) {
          return 'legacy';
        } else if (this.options.licenseState === 'trialing') {
          return 'trialing';
        } else if (this.freePlan()) {
          return 'free';
        } else if (this.options.licenseState === 'active') {
          return this.options.licensePlan;
        } else {
          return "" + this.options.licensePlan + "-" + this.options.licenseState;
        }
      };

      BeeLineReaderExtension.prototype.gaTrackLoad = function() {
        var _this = this;
        if (this.options.ga) {
          return this.getVariables('lastLoad', function(opts) {
            var now;
            _this.gaTrack(_this.getTheme());
            now = (new Date()).getTime();
            if (!opts.lastLoad) {
              _this.gaTrack('firstTime');
            } else if (opts.lastLoad < now - (1000 * 60 * 60 * 24)) {
              _this.gaTrack("firstRevisitToday/" + (_this.gaPlanType()));
            } else {
              return;
            }
            return _this.setVariables({
              lastLoad: now
            });
          });
        }
      };

      BeeLineReaderExtension.prototype.GA_LOOKUP = {
        colorings: 'UA-24181354-3',
        pro: 'UA-24181354-5',
        kiosk: 'UA-24181354-7',
        sampled: 'UA-24181354-2'
      };

      BeeLineReaderExtension.prototype.gaTrack = function(path, code) {
        if (code == null) {
          code = 'colorings';
        }
        if (this.options.ga) {
          if (code === 'colorings' && this.options.kioskMode) {
            code = 'kiosk';
          }
          code = this.GA_LOOKUP[code] || (function() {
            throw 'Unknown GA code';
          })();
          if (this.development()) {
            return BeelineUtils.log("ga " + code + " not sent: /" + this.EXTENSION_NAME + "/" + path);
          } else {
            return BeelineUtils.sendGaTrack(code, 'www.beelinereader.com', "/" + this.EXTENSION_NAME + "/" + path);
          }
        }
      };

      BeeLineReaderExtension.prototype.updateBeelineOptions = function(beelines) {
        var beeline, _i, _len, _results;
        if (beelines == null) {
          beelines = this.beelines;
        }
        _results = [];
        for (_i = 0, _len = beelines.length; _i < _len; _i++) {
          beeline = beelines[_i];
          _results.push(beeline.setOptions({
            theme: this.options.theme,
            customColor1: this.options.customColor1,
            customColor2: this.options.customColor2,
            customColor3: this.options.customColor3,
            customColor4: this.options.customColor4,
            customBackground: this.options.customBackground
          }));
        }
        return _results;
      };

      BeeLineReaderExtension.prototype.cleanupOldBeelines = function() {
        var beeline, newBeelines, numCleaned, _i, _len, _ref;
        newBeelines = [];
        _ref = this.beelines;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          beeline = _ref[_i];
          if ($(beeline.node).closest('body').length > 0) {
            newBeelines.push(beeline);
          } else {
            beeline.cleanup();
          }
        }
        numCleaned = this.beelines.length - newBeelines.length;
        if (numCleaned > 0) {
          this.beelines = newBeelines;
        }
        return numCleaned;
      };

      BeeLineReaderExtension.prototype.loadSettings = function(callback) {
        var _this = this;
        return this.getVariables(this.settings, function(variables) {
          var setting, _base, _i, _len, _ref;
          _ref = _this.settings;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            setting = _ref[_i];
            if ((_base = _this.options)[setting] == null) {
              _base[setting] = variables[setting];
            }
          }
          if (_this.options.skipAutoColorOn == null) {
            _this.options.skipAutoColorOn = {};
          }
          if (_this.options.upsells == null) {
            _this.options.upsells = {};
          }
          if (!_this.options.usageData) {
            _this.options.usageData = {
              manual: {
                count: 0,
                lastIncremented: 0
              },
              auto: {
                count: 0,
                lastIncremented: 0,
                sites: {}
              }
            };
          }
          if (callback) {
            return callback();
          }
        });
      };

      BeeLineReaderExtension.prototype.showPopupIfNeeded = function() {
        var message, _ref,
          _this = this;
        if (this.options.legacy && !this.options.licensePlan) {
          this.setVariables({
            hasShownHelp: this.version,
            licenseCode: null,
            licensePlan: 'legacy',
            licensePlanName: 'Legacy',
            licenseState: 'active',
            licenseCurrentPeriodEnd: parseInt((new Date()).getTime() / 1000) + 60 * 60 * 48
          });
          message = "<p class='beeline-header-large'>BeeLine Reader is going Pro!</p>\n<p>Get BeeLine on Gmail, Google Docs,<br>\n   Wordpress, and tons of other sites!</p>\n<br>\n<p><i>Upgrade now and get a year of Pro for free</i></p>";
          this.gaTrack('legacy-user-first-time-lightbox', 'pro');
          return this._attachPopup(message, {
            choice: true,
            yesChoice: "Go Pro",
            noChoice: "No Thanks",
            yes: function() {
              _this.gaTrack('legacy-user-first-time-lightbox/go-pro', 'pro');
              return _this.redirectToRegister({
                coupon: 'legacy'
              });
            },
            no: function() {
              message = "<p>Thanks for being one of our early users!</p>\n<p>You can keep using this plugin for free,<br>\n   but it won't be updated with new features.</p>\n<p>To find out about <a href='mailto:education@beelinereader.com?subject=Educational%20pricing'>educational</a> or <a href='mailto:licensing@beelinereader.com?subject=Institutional%20pricing'>institutional</a> pricing, please email us!</p>";
              _this.gaTrack('legacy-user-first-time-lightbox/no-thanks', 'pro');
              return _this._attachPopup(message);
            }
          });
        } else if (this.options.licensePlan === 'legacy' && this.options.licenseCurrentPeriodEnd && (new Date()).getTime() / 1000 > this.options.licenseCurrentPeriodEnd) {
          this.setVariables({
            licenseCode: null,
            licensePlan: 'legacy',
            licensePlanName: 'Legacy',
            licenseState: 'active',
            licenseCurrentPeriodEnd: null
          });
          message = "<p class='beeline-header-large'>Last Chance for your Free Upgrade!</p>\n<br>\n<p>Existing users can get a free year of BeeLine Pro<br>\n   Upgrade now to get BeeLine on thousands of new sites:<br>\n   Gmail, Google Docs, Wordpress.com, and tons more!</p>\n<br>\n<p><i>Only longtime BeeLiners like you qualify for this free offer</i></p>";
          this.gaTrack('legacy-user-last-chance-lightbox', 'pro');
          return this._attachPopup(message, {
            choice: true,
            yesChoice: "Upgrade for Free",
            noChoice: "No thanks",
            yes: function() {
              _this.gaTrack('legacy-user-last-chance-lightbox/go-pro', 'pro');
              return _this.redirectToRegister({
                coupon: 'legacy'
              });
            }
          });
        } else if (!this.options.licensePlan) {
          message = "<p class='beeline-header-large'>Welcome!</p>\n<p>BeeLine will auto-run on many popular sites, like<br> Gmail, Tumblr, Facebook, and Google Docs</p>\n<br>\n<p class='beeline-header'>To activate BeeLine on other sites:</p>\n<p>\n   Click the <span class='small-beeline-icon'></span> logo in the upper right, or<br>\n   " + (typeof this.keyboardHelpMessage === "function" ? this.keyboardHelpMessage() : void 0) + "\n</p>";
          return this._attachPopup(message, {
            callback: function() {
              var periodEnd;
              periodEnd = parseInt((new Date()).getTime() / 1000) + 60 * 60 * 24 * 30;
              _this.gaTrack('new-user-lightbox', 'pro');
              _this.setVariables({
                licenseCode: null,
                licensePlan: 'worker',
                licensePlanName: 'Worker Bee',
                licenseState: 'trialing',
                licenseCurrentPeriodEnd: periodEnd,
                hasShownHelp: _this.version
              });
              message = "<p>BeeLine Reader gives you unlimited use for<br>\n   30 days, and 5 uses per day after that\n</p>\n<p><strong>For more unlimited BeeLining, go Pro!</strong></p>";
              return _this._attachPopup(message, {
                choice: true,
                yesChoice: "Go Pro Now",
                noChoice: "Maybe Later",
                yes: function() {
                  _this.gaTrack('new-user-lightbox/go-pro-now', 'pro');
                  return _this.redirectToRegister();
                },
                no: function() {
                  _this.gaTrack('new-user-lightbox/maybe-later', 'pro');
                  return _this.showConfigurationPane();
                }
              });
            }
          });
        } else if (this.options.licenseState === 'trialing' && (new Date()).getTime() / 1000 > this.options.licenseCurrentPeriodEnd) {
          message = "<p>You unlimited-use trial period has ended.</p>\n<p>You can go Pro now, or use BeeLine Limited, up to 5 times per day</p>";
          return this._attachPopup(message, {
            choice: true,
            yesChoice: "Go Pro Now",
            noChoice: "Limit Me",
            yes: function() {
              _this.gaTrack('trial-ended-lightbox/go-pro-now', 'pro');
              return _this.redirectToRegister();
            },
            no: function() {
              _this.gaTrack('trial-ended-lightbox/limit-me', 'pro');
              return _this.setVariables({
                licenseCurrentPeriodEnd: null,
                licenseCode: null,
                licensePlan: 'free',
                licensePlanName: 'Free',
                licenseState: 'active'
              });
            }
          });
        } else if (((_ref = this.options.customSite) != null ? _ref.name : void 0) === 'Bookshare' && !this.options.upsells.bookshareUpsellShown) {
          this.options.upsells.bookshareUpsellShown = true;
          this.setVariables({
            upsells: this.options.upsells
          });
          this.gaTrack('bookshare-upsell-lightbox', 'pro');
          return this._attachPopup("<p>\n  Do you use Bookshare? Now you can use BeeLine Reader for free on any book on Bookshare's Web Reader platform!\n</p>\n<p>\n  Just email <a href=\"mailto:beta@bookshare.org?subject=BeeLine%20Beta%20Request\">beta@bookshare.org</a> to request an invite to the beta!\n</p>");
        } else if (this.showAutoUsageDisallowedUpsell) {
          message = "<p>Thanks for using the free version of BeeLine Reader. For unlimited BeeLining, please go Pro!</p>";
          return this._attachPopup(message, {
            choice: true,
            yesChoice: "Go Pro",
            noChoice: "Cancel",
            yes: function() {
              _this.gaTrack('free-user-upsell/go-pro', 'pro');
              return _this.redirectToRegister();
            },
            no: function() {
              return _this.gaTrack('free-user-upsell/cancel', 'pro');
            }
          });
        } else {
          return this._showHelpOnUpgrade();
        }
      };

      BeeLineReaderExtension.prototype._showHelpOnUpgrade = function() {
        var promotionMessage;
        if (!this.options.hasShownHelp || this.options.hasShownHelp < this.version) {
          this.setVariables({
            hasShownHelp: this.version
          });
          if (this.options.legacy) {
            promotionMessage = "<p>\n  Do Black Friday crowds make you use colorful language?\n</p>\n<p>\n  Great news: starting Black Friday, we're giving away a month of\n  FREE BeeLine Pro access! Happy reading (and stay safe out there)!\n</p>";
            return this._attachPopup(promotionMessage);
          }
        }
      };

      BeeLineReaderExtension.prototype._showNoMoreUsagesTodayLightbox = function() {
        var message,
          _this = this;
        message = "<p>You've used all 5 manual BeeLine activations for today.</p>\n<br>\n<p class='beeline-header'>Go Pro for unlimited BeeLining!</p>";
        this.gaTrack('no-more-usages-today-lightbox', 'pro');
        return this._attachPopup(message, {
          choice: true,
          yesChoice: "Go Pro",
          noChoice: "Not right now",
          yes: function() {
            _this.gaTrack('no-more-usages-today-lightbox/go-pro', 'pro');
            return _this.redirectToRegister();
          }
        });
      };

      BeeLineReaderExtension.prototype._showDailyUsageLightbox = function() {
        var message,
          _this = this;
        message = "<p>\n  In Free mode, you can use BeeLine on 5 pages per day. For scrolling sites like Tumblr, Facebook, and Kindle Cloud Reader, we count 15 minutes as one use. This means you can read on any one of these sites for up to 75 minutes in a day. For unlimited daily BeeLining, upgrade to BeeLine Pro!\n</p>";
        this.gaTrack('daily-limit-info-lightbox', 'pro');
        return this._attachPopup(message, {
          choice: true,
          yesChoice: "Go pro",
          noChoice: "OK",
          yes: function() {
            _this.gaTrack('daily-limit-info-lightbox/go-pro', 'pro');
            return _this.redirectToRegister();
          }
        });
      };

      BeeLineReaderExtension.prototype._learnMoreLightbox = function() {
        var message;
        message = "<p>\n  BeeLine Reader is a tool that makes reading on-screen easier\n  and faster by using eye-guiding color gradients. The color at\n  the end of one line matches up with the color at the beginning\n  of the next line, which improves reading fluency for readers\n  of all skill levels. You can change the colors using the BeeLine\n  settings.\n</p>\n<p>\n  If you want to learn more about how BeeLine works, visit our website:\n  <a href=\"http://www.beelinereader.com\" target=\"_blank\">www.BeeLineReader.com</a>\n</p>";
        this.gaTrack('kiosk-learn-more-lightbox', 'pro');
        return this._attachPopup(message);
      };

      BeeLineReaderExtension.prototype._showRegistrationDetailsLightbox = function() {
        var hours, message, now, _ref,
          _this = this;
        if (this.options.licensePlan === 'legacy' && this.options.licenseCurrentPeriodEnd && (new Date()).getTime() / 1000 < this.options.licenseCurrentPeriodEnd) {
          now = parseInt((new Date()).getTime() / 1000);
          hours = parseInt((this.options.licenseCurrentPeriodEnd - now) / 60 / 60);
          message = "<p>\n  For the next " + hours + " hours only,\n  existing users can get<br>\n  one year of BeeLine Reader Pro for free.\n</p>\n<p>\n  Upgrade now to get access to BeeLine on sites like:<br>\n  Gmail, Google Docs, Wordpress.com,\n  and tons more!\n</p>";
          return this._attachPopup(message, {
            choice: true,
            yesChoice: "Upgrade to Pro",
            noChoice: "Not right now",
            yes: function() {
              return _this.redirectToRegister({
                coupon: 'legacy'
              });
            }
          });
        } else if (this.options.licenseState === 'trialing' || this.freePlan() || this.options.legacy) {
          message = "<p>You are currently " + this.options.licenseState + " on<br>BeeLine Reader's " + this.options.licensePlanName + " plan.</p>\n<p>To get access to all updates and<br>\n   unlimited BeeLining, upgrade now!</p>\n<p class='beeline-text-small'>Need help with your account? <a href='mailto:contact@beelinereader.com?subject=Subscription%20help'>Email us</a>!</p>";
          this.gaTrack('registration-info-lightbox', 'pro');
          return this._attachPopup(message, {
            choice: true,
            yesChoice: "Upgrade to Pro",
            noChoice: "Not right now",
            yes: function() {
              _this.gaTrack('registration-info-lightbox/go-pro', 'pro');
              return _this.redirectToRegister();
            }
          });
        } else {
          return this._attachPopup("<p>You are currently " + this.options.licenseState + " on<br>BeeLine Reader's " + this.options.licensePlanName + " plan.</p>\n<p>Need to update your info, register a different browser, or cancel? <a href='mailto:contact@beelinereader.com?subject=Subscription%20help%20(" + (((_ref = this.options.licenseCode) != null ? typeof _ref.substring === "function" ? _ref.substring(0, 10) : void 0 : void 0) || "no%20license") + ")'>Email us!</a></p>");
        }
      };

      BeeLineReaderExtension.prototype._attachPopup = function(message, opts) {
        var $dialog, buttons, html,
          _this = this;
        if (opts == null) {
          opts = {};
        }
        if (opts.choice) {
          buttons = "<a class='beeline-action-button' dialog-choice=\"yes\">" + (opts.yesChoice || 'Yes') + "</a>\n<a class='beeline-action-button' dialog-choice=\"no\">" + (opts.noChoice || 'No') + "</a>";
        } else if (opts.buttonHTML) {
          buttons = opts.buttonHTML;
        } else {
          buttons = "<a class='beeline-action-button'>" + (opts.closeChoice || 'OK') + "</a>";
        }
        html = "<div class='beeline-first-time-help-dialog mfp-hide'>\n  <div class='beeline-logo'></div>\n  <div class='beeline-dialog-inner'>" + message + "</div>\n  <div class='beeline-dialog-button-wrapper'>" + buttons + "</div>\n</div>";
        $dialog = $(html).css({
          background: "white",
          padding: 0,
          width: "800px",
          margin: "40px auto"
        });
        $dialog.find('a.beeline-action-button').click(function(e) {
          var $button;
          $button = $(e.target);
          $button.attr('dialog-choice') === 'yes' && opts.yes && setTimeout(opts.yes, 750);
          $button.attr('dialog-choice') === 'yes2' && opts.yes2 && setTimeout(opts.yes2, 750);
          $button.attr('dialog-choice') === 'no' && opts.no && setTimeout(opts.no, 750);
          if (!$button.is('[target="_blank"]')) {
            e.stopPropagation();
            return $.magnificPopup.close();
          }
        });
        $dialog.find('a').click(function(e) {
          return e.stopPropagation();
        });
        $("body").append($dialog);
        BeelineUtils.afterRender(function() {
          return new BeeLineReader($dialog.find('.beeline-dialog-inner').get(0), {
            colorImmediately: true,
            skipBackgroundColor: true
          });
        });
        return $.magnificPopup.open({
          items: {
            src: '.beeline-first-time-help-dialog',
            type: 'inline'
          },
          fixedContentPos: false,
          fixedBgPos: true,
          alignTop: true,
          overflowY: 'auto',
          closeBtnInside: false,
          showCloseBtn: false,
          closeOnContentClick: false,
          closeOnBgClick: false,
          enableEscapeKey: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          callbacks: {
            close: function() {
              $dialog.remove();
              if (opts.callback != null) {
                return setTimeout(opts.callback, 150);
              }
            },
            open: function() {
              return setTimeout(function() {
                var elem;
                elem = $(".mfp-bg").get(0);
                elem.style.display = 'none';
                elem.offsetHeight;
                return elem.style.display = 'block';
              }, 10);
            }
          },
          mainClass: 'beeline-help-body'
        });
      };

      BeeLineReaderExtension.prototype.helpMessage = function() {
        var normalMessage;
        normalMessage = "<p>We've made several bug fixes to Tumblr and other sites.</p>\n<p></p>\n<p style=\"text-align: center; font-weight: bold; font-size: 24px; margin-top: 24px; margin-bottom: 24px;\">BeeLine Reader PDF Plugin</p>\n<p>We're thrilled to announce the release of our PDF plugin for Chrome! Now when you click on a PDF, Chrome will open it in BeeLine by default. <a href=\"https://chrome.google.com/webstore/detail/beeline-reader-pdf-viewer/pmeknoingfjncbdhempgnkdgojickcko/\" target=\"_blank\">Get it here!</a></p>";
        return [typeof this.introHelpMessage === "function" ? this.introHelpMessage() : void 0, normalMessage].join("\n");
      };

      BeeLineReaderExtension.prototype.matchesVersion = function(versionString) {
        var num, type, _ref;
        _ref = versionString.split(" "), type = _ref[0], num = _ref[1];
        num = parseFloat(num);
        if (type === "<") {
          return this.version < num;
        }
        if (type === "<=") {
          return this.version <= num;
        }
        if (type === ">") {
          return this.version > num;
        }
        if (type === ">=") {
          return this.version >= num;
        }
        if (type === "=") {
          return this.version === num;
        }
        if (type === "!=") {
          return this.version !== num;
        }
        BeelineUtils.log("Unknown version string: " + versionString);
        return false;
      };

      BeeLineReaderExtension.prototype.addTools = function() {
        var $configure, $tools, _ref;
        $tools = $("<div id='beeline-tools'></div>");
        $configure = $('<a href="#" title="Configure BeeLine Reader" class="beeline-icon configure-button"></a>').click(this.showConfigurationPane);
        $tools.append($configure);
        $("body").prepend($tools);
        if (this.shouldInlineColor() && (((_ref = this.options.customSite.positions) != null ? _ref.toolsMenu : void 0) != null)) {
          return $tools.css(this.options.customSite.positions.toolsMenu);
        }
      };

      BeeLineReaderExtension.prototype.hideConfigurationPane = function() {
        return $("#beeline-configuration-pane").remove();
      };

      BeeLineReaderExtension.prototype.showConfigurationPane = function(e) {
        var $configurationPane, $configure, $label, $themes, checked, currentTheme, humanizedTheme, notice, theme, _i, _len, _ref, _ref1, _ref2, _ref3,
          _this = this;
        if (e != null) {
          e.preventDefault();
        }
        if ($("#beeline-configuration-pane").length) {
          return this.hideConfigurationPane();
        } else {
          notice = "";
          if (this.options.kioskMode) {
            notice = "<div class='beeline-kiosk-mode'>\n  BeeLine Reader is a Stanford award-winning technology that uses color\n  gradients to make reading easier.\n  <a href='#' class='beeline-learn-more'>Learn more</a>\n\n  <div class=\"kiosk-disable\">\n    " + (this.options.kioskDisabled ? "Auto-run disabled <a href='#' class='enable'>Enable</a>" : "Pause for: <a href='#' data-minutes='30'>30m</a> <a href='#' data-minutes='60'>60m</a>") + "\n  </div>\n</div>";
          } else if (this.noMoreFreeAutoUsages) {
            notice = "<div class='beeline-notice'>\n  You've used your 5 free BeeLine activations for today.\n  <a href='#' class='beeline-daily-usage'>Learn more</a>\n</div>";
          }
          $configure = $(".configure-button");
          $configurationPane = $("<div id='beeline-configuration-pane'>\n  " + notice + "\n  <fieldset class='themes'>\n    <legend>Theme</legend>\n  </fieldset>\n  <fieldset class='custom-colors'>\n    <legend>Custom Colors</legend>\n    <label for='custom-color1'>\n      <span class='name'>Base</span>\n      <span class='color-selector'>\n        <input type='text' class='custom-color1' name='custom-color1' value='" + (this.options.customColor1 || BeeLineReader.THEMES[BeeLineReader.DEFAULT_THEME][0]) + "'>\n      </span>\n    </label>\n    <label for='custom-color2'>\n      <span class='name'>Color 1</span>\n      <span class='color-selector'>\n        <input type='text' class='custom-color2' name='custom-color2' value='" + (this.options.customColor2 || BeeLineReader.THEMES[BeeLineReader.DEFAULT_THEME][1]) + "'>\n      </span>\n    </label>\n    <label for='custom-color4'>\n      <span class='name'>Color 2</span>\n      <span class='color-selector'>\n        <input type='text' class='custom-color4' name='custom-color4' value='" + (this.options.customColor4 || BeeLineReader.THEMES[BeeLineReader.DEFAULT_THEME][3]) + "'>\n      </span>\n    </label>\n    <label for='custom-background'>\n      <span class='name'>Background</span>\n      <span class='color-selector'>\n        <input type='text' class='custom-background' name='custom-background' value='" + (this.options.customBackground || BeeLineReader.THEMES[BeeLineReader.DEFAULT_THEME][4]) + "'>\n      </span>\n    </label>\n  </fieldset>\n  <fieldset class='settings'>\n    <legend class='settings-legend'>Settings</legend>\n    <label class='open-dyslexic-label'><input type='checkbox' class='open-dyslexic' name='open-dyslexic' value='true' " + (this.options.openDyslexic ? 'checked="checked"' : '') + "> OpenDyslexic Font</label>\n    <label class='disable-custom-sites-label'><input type='checkbox' class='disable-custom-sites' name='disable-custom-sites' value='true' " + (this.options.disableCustomSites ? '' : 'checked="checked"') + "> Enable auto-color</label>\n    <label class='skip-auto-color-here-label'>&nbsp;&nbsp;<input type='checkbox' class='skip-auto-color-here' name='skip-auto-color-here' value='true' " + (this.options.customSiteClassName && this.options.skipAutoColorOn[this.options.customSiteClassName] ? '' : 'checked="checked"') + "> Auto-color this site</label>\n  </fieldset>\n  <a href='#' class='beeline-action-button close-beeline'>Close</a>\n  <a href='#' class='beeline-action-button beeline-registration-details'>Registration</a>\n</div>");
          if (this.shouldInlineColor() && (((_ref = this.options.customSite.positions) != null ? _ref.configurationPane : void 0) != null)) {
            $configurationPane.css(this.options.customSite.positions.configurationPane);
          }
          if (this.options.kioskMode) {
            $configurationPane.find('.beeline-registration-details, .skip-auto-color-here-label, .disable-custom-sites-label').hide();
          }
          $configurationPane.find('.settings-legend').click(function(e) {
            if (e.shiftKey && e.altKey) {
              e.preventDefault();
              return _this.debugPrompt();
            }
          });
          $configurationPane.find(".close-beeline").click(function(e) {
            e.preventDefault();
            return $configurationPane.remove();
          });
          $configurationPane.find(".beeline-registration-details").click(function(e) {
            e.preventDefault();
            return _this._showRegistrationDetailsLightbox();
          });
          $configurationPane.find(".beeline-notice a.beeline-daily-usage").click(function(e) {
            e.preventDefault();
            return _this._showDailyUsageLightbox();
          });
          $configurationPane.find(".beeline-kiosk-mode a.beeline-learn-more").click(function(e) {
            e.preventDefault();
            return _this._learnMoreLightbox();
          });
          $configurationPane.find(".kiosk-disable a").click(function(e) {
            var $link, minutes, newSettings;
            e.preventDefault();
            $link = $(e.target);
            if ($link.hasClass('enable')) {
              _this.setVariables({
                kioskDisabled: false,
                kioskResetAt: null
              });
              return _this.hideConfigurationPane();
            } else {
              minutes = $link.data('minutes');
              newSettings = {
                kioskDisabled: true,
                kioskResetAt: BeelineUtils.epochInSeconds() + 60 * minutes
              };
              return _this.setVariables(newSettings, function() {
                alert("BeeLine Reader is has been disabled for " + minutes + " minutes. You can re-enable BeeLine Reader at any time by clicking the B icon in the upper right of your browser window and then clicking on the BeeLine Reader gear icon. The page will now reload.");
                return BeelineUtils.reload();
              });
            }
          });
          $themes = $configurationPane.find(".themes");
          currentTheme = this.getTheme();
          _ref1 = BeeLineReader.THEME_ORDER;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            theme = _ref1[_i];
            checked = (currentTheme === theme ? 'checked="checked"' : '');
            humanizedTheme = theme.charAt(0).toUpperCase() + theme.slice(1).replace('_', ' ');
            $label = $("<label><input type='radio' class='theme " + theme + "-theme' name='themes' value='" + theme + "' " + checked + "> " + humanizedTheme + "</label>");
            if (BeelineUtils.colorIsDark(BeeLineReader.THEMES[theme][4])) {
              $label.find('input').addClass('dark-background');
            }
            $themes.append($label);
          }
          $themes.append("<label><input type='radio' class='theme' name='themes' value='custom' " + (currentTheme === 'custom' ? 'checked="checked"' : '') + "> Custom</label>");
          if (currentTheme === 'custom') {
            $configurationPane.find(".custom-colors").show();
          }
          if (!this.options.customSiteClassName || this.options.disableCustomSites) {
            $configurationPane.find("label.skip-auto-color-here-label").hide();
          }
          if (this.shouldInlineColor()) {
            if ((_ref2 = this.options.customSite.disable) != null ? _ref2.backgrounds : void 0) {
              $configurationPane.find("label[for='custom-background'], input.theme.dark-background").addClass('disabled');
            }
            if ((_ref3 = this.options.customSite.disable) != null ? _ref3.openDyslexic : void 0) {
              $configurationPane.find(".open-dyslexic-label").addClass('disabled');
            }
          }
          $themes.on('click', 'input:not(.disabled)', function(e) {
            theme = $(e.target).val();
            if (theme === 'custom') {
              $configurationPane.find(".custom-colors").show();
            } else {
              $configurationPane.find(".custom-colors").hide();
            }
            if (theme !== _this.getTheme()) {
              _this.gaTrack("colorChange/" + theme);
              _this.setVariables({
                theme: theme
              });
              return _this.color();
            }
          });
          $configurationPane.find(".custom-colors input").spectrum({
            preferredFormat: "hex"
          }).on("dragstop.spectrum", function(e, color) {
            return $(e.target).val(color.toHexString()).change();
          });
          $configurationPane.on('change', '.custom-colors input', function() {
            var background, color1, color2, color3, color4;
            color1 = $("input[name='custom-color1']").val();
            color2 = $("input[name='custom-color2']").val();
            color3 = color1;
            color4 = $("input[name='custom-color4']").val();
            background = $("input[name='custom-background']").val();
            _this.setVariables({
              customColor1: color1,
              customColor2: color2,
              customColor3: color3,
              customColor4: color4,
              customBackground: background
            });
            if (_this.getTheme() === 'custom') {
              return _this.color();
            }
          });
          $configurationPane.on('change', '.open-dyslexic-label:not(.disabled) .open-dyslexic', function(e) {
            var val;
            val = $(e.target).is(":checked");
            _this.setVariables({
              openDyslexic: val
            });
            return _this.updateOpenDyslexic({
              recolor: true
            });
          });
          $configurationPane.on('change', '.skip-auto-color-here-label:not(.disabled) .skip-auto-color-here', function(e) {
            var val;
            if (_this.options.customSiteClassName != null) {
              val = !$(e.target).is(":checked");
              _this.options.skipAutoColorOn[_this.options.customSiteClassName] = !!val;
              _this.setVariables({
                skipAutoColorOn: _this.options.skipAutoColorOn
              });
              return alert("This site will " + (val ? 'no longer' : 'now') + " be colored automatically.  Reload to update the page.");
            }
          });
          $configurationPane.on('change', '.disable-custom-sites-label:not(.disabled) .disable-custom-sites', function(e) {
            var val;
            val = !$(e.target).is(":checked");
            _this.setVariables({
              disableCustomSites: val
            });
            if ((_this.options.customSite != null) || (_this.options.disabledCustomSite != null)) {
              if (val) {
                alert("BeeLine will no longer auto-color any webpage. You can also turn off auto-coloring on a site-by-site basis in the settings.");
              } else {
                alert("BeeLine will now auto-color on all available webpages.");
              }
            }
            if (_this.options.disableCustomSites) {
              return $configurationPane.find("label.skip-auto-color-here-label").hide();
            } else {
              if (_this.options.customSiteClassName && !_this.options.disableCustomSites) {
                return $configurationPane.find("label.skip-auto-color-here-label").show();
              }
            }
          });
          $configurationPane.on('click', '.disabled', function(e) {
            e.preventDefault();
            return false;
          });
          return $configure.after($configurationPane);
        }
      };

      BeeLineReaderExtension.prototype.disable = function(message) {
        BeelineUtils.alert(message);
        return BeelineUtils.reload();
      };

      BeeLineReaderExtension.prototype.getTheme = function() {
        return (this.options.theme && BeeLineReader.THEMES[this.options.theme] && this.options.theme) || BeeLineReader.DEFAULT_THEME;
      };

      BeeLineReaderExtension.prototype.addBeeline = function(beeline, opts) {
        if (opts == null) {
          opts = {};
        }
        this.beelines.push(beeline);
        this.updateBeelineOptions([beeline]);
        $(beeline.node).addClass('beeline-region');
        this.updateOpenDyslexic({
          beelines: [beeline]
        });
        if (this.options.usageData) {
          return this.recordColoring(opts);
        }
      };

      BeeLineReaderExtension.prototype.manualUsageAllowed = function() {
        if (!this.freePlan()) {
          return true;
        }
        return this.options.usageData.manual.count < 5;
      };

      BeeLineReaderExtension.prototype.autoUsageAllowed = function() {
        var autoUsageAllowed;
        if (!this.freePlan()) {
          return true;
        }
        this.cleanupOldColoringData();
        autoUsageAllowed = this.options.usageData.auto.sites[BeelineUtils.domain()] || this.options.usageData.auto.count < 5;
        this.noMoreFreeAutoUsages = !autoUsageAllowed;
        return autoUsageAllowed;
      };

      BeeLineReaderExtension.prototype.cleanupOldColoringData = function() {
        var count, fifteenMinutesAgo, midnight, midnightDate, now, siteName, _ref, _results;
        now = (new Date()).getTime();
        midnightDate = new Date();
        midnightDate.setHours(0, 0, 0, 0);
        midnight = midnightDate.getTime();
        if (this.options.usageData.auto.lastIncremented < midnight) {
          if (this.development()) {
            BeelineUtils.log('clearing auto at midnight');
          }
          this.options.usageData.auto.count = 0;
          this.options.usageData.auto.lastIncremented = now;
        }
        if (this.options.usageData.manual.lastIncremented < midnight) {
          if (this.development()) {
            BeelineUtils.log('clearing manual at midnight');
          }
          this.options.usageData.manual.count = 0;
          this.options.usageData.manual.lastIncremented = now;
        }
        fifteenMinutesAgo = now - 15 * 60 * 1000;
        _ref = this.options.usageData.auto.sites;
        _results = [];
        for (siteName in _ref) {
          count = _ref[siteName];
          if ((count || 0) < fifteenMinutesAgo) {
            if (this.development()) {
              BeelineUtils.log("last visit to " + siteName + " was > 15 min ago");
            }
            _results.push(delete this.options.usageData.auto.sites[siteName]);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      BeeLineReaderExtension.prototype.recordColoring = function(opts) {
        var now,
          _this = this;
        if (this.options.kioskMode) {
          return this.pushKioskResetForward();
        } else if (this.freePlan()) {
          now = (new Date()).getTime();
          if (now > (this.lastColorRecording || 0) + 30000) {
            return this.getVariables('usageData', function(result) {
              if (result.usageData) {
                _this.options.usageData = result.usageData;
              }
              _this.cleanupOldColoringData();
              if (opts.manual) {
                _this.options.usageData.manual.count += 1;
                _this.options.usageData.manual.lastIncremented = now;
                if (_this.development()) {
                  BeelineUtils.log("incremented manual count to " + _this.options.usageData.manual.count);
                }
              } else {
                if (!_this.options.usageData.auto.sites[BeelineUtils.domain()]) {
                  _this.options.usageData.auto.sites[BeelineUtils.domain()] = now;
                  _this.options.usageData.auto.count += 1;
                  _this.options.usageData.auto.lastIncremented = now;
                  if (_this.development()) {
                    BeelineUtils.log("incremented auto count to " + _this.options.usageData.auto.count);
                  }
                  if (_this.options.usageData.auto.count === 5) {
                    _this.gaTrack("hitFiveAutoRuns/" + (_this.gaPlanType()));
                  }
                }
              }
              _this.lastColorRecording = now;
              return _this.setVariables({
                usageData: _this.options.usageData
              });
            });
          }
        }
      };

      BeeLineReaderExtension.prototype.updateOpenDyslexic = function(opts) {
        var beeline, beelines, _i, _j, _len, _len1, _ref, _ref1, _ref2;
        if (opts == null) {
          opts = {};
        }
        if (!(this.shouldInlineColor() && ((_ref = this.options.customSite.disable) != null ? _ref.openDyslexic : void 0))) {
          beelines = opts.beelines || this.beelines;
          if (this.options.openDyslexic) {
            this.shouldInlineColor() && ((_ref1 = this.options.customSite) != null ? _ref1.triggerInterfaceChange("open-dyslexic", true) : void 0);
            for (_i = 0, _len = beelines.length; _i < _len; _i++) {
              beeline = beelines[_i];
              $(beeline.node).addClass('open-dyslexic');
              this.loadOpenDyslexic(beeline.node.ownerDocument);
            }
          } else {
            this.shouldInlineColor() && ((_ref2 = this.options.customSite) != null ? _ref2.triggerInterfaceChange("open-dyslexic", false) : void 0);
            for (_j = 0, _len1 = beelines.length; _j < _len1; _j++) {
              beeline = beelines[_j];
              $(beeline.node).removeClass('open-dyslexic');
            }
          }
          if (opts.recolor) {
            return BeelineUtils.afterRender(this.recolor);
          }
        }
      };

      BeeLineReaderExtension.prototype.color = function() {
        var beeline, _i, _len, _ref;
        _ref = this.beelines;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          beeline = _ref[_i];
          beeline.color();
        }
        return this.updateInterfaceColors();
      };

      BeeLineReaderExtension.prototype.recolor = function() {
        var beeline, _i, _len, _ref;
        _ref = this.beelines;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          beeline = _ref[_i];
          beeline.recolor();
        }
        return this.updateInterfaceColors();
      };

      BeeLineReaderExtension.prototype.updateInterfaceColors = function() {
        if (!this.shouldInlineColor()) {
          this.setBackgroundColor(this.backgroundColor());
          return this.maybeInvertIcons(this.backgroundColor());
        }
      };

      BeeLineReaderExtension.prototype.maybeInvertIcons = function(color) {
        if (BeelineUtils.colorIsDark(color)) {
          return $("#beeline-tools > a.beeline-icon").addClass('invert');
        } else {
          return $("#beeline-tools > a.beeline-icon").removeClass('invert');
        }
      };

      BeeLineReaderExtension.prototype.setBackgroundColor = function(color) {
        return $("body, #readOverlay").css({
          backgroundColor: color
        });
      };

      BeeLineReaderExtension.prototype.debugPrompt = function() {
        var args, cmd, commandLine, object, setting, tmp, _i, _j, _len, _len1, _ref, _ref1, _ref2;
        commandLine = prompt("cmd:");
        if (commandLine) {
          _ref = commandLine.split(' '), cmd = _ref[0], args = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
          switch (cmd) {
            case "set":
              object = {};
              object[args[0]] = (function() {
                try {
                  return JSON.parse(args[1]);
                } catch (_error) {
                  return args[1];
                }
              })();
              this.setVariables(object);
              alert(JSON.stringify(this.options[args[0]]));
              return this.debugPrompt();
            case "get":
              if (args[0]) {
                alert(JSON.stringify(this.options[args[0]]));
              } else {
                tmp = {};
                _ref1 = this.settings;
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  setting = _ref1[_i];
                  tmp[setting] = this.options[setting];
                }
                alert(JSON.stringify(tmp));
              }
              return this.debugPrompt();
            case "reset":
              tmp = {
                lastLoad: null
              };
              _ref2 = this.settings;
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                setting = _ref2[_j];
                if (setting !== 'environment') {
                  tmp[setting] = null;
                }
              }
              this.setVariables(tmp);
              alert("done");
              return this.debugPrompt();
            case "valid":
              alert(this.settings);
              return this.debugPrompt();
            case "checkLicense":
              this.checkLicense(true);
              return alert("ok");
            case "help":
              alert("set key value; get value; valid; reset; checkLicense; help");
              return this.debugPrompt();
          }
        }
      };

      BeeLineReaderExtension.prototype.loadReadbility = function(callback) {
        var tries, waitForReadability,
          _this = this;
        window.readStyle = 'style-newspaper';
        window.readSize = 'size-large';
        window.readMargin = 'margin-medium';
        $("link, style").remove();
        readability.init();
        tries = 0;
        waitForReadability = function() {
          var parseNode, _ref;
          document.getElementsByTagName("body")[0].className += " readabilityBody";
          parseNode = document.getElementById("readInner");
          if (((_ref = window.readability) != null ? _ref.done : void 0) || tries > 100) {
            _this.readabilityCleanup();
            if (parseNode) {
              return callback(parseNode);
            }
          } else {
            tries += 1;
            return setTimeout(waitForReadability, 100);
          }
        };
        return setTimeout(waitForReadability, 100);
      };

      BeeLineReaderExtension.prototype.readabilityCleanup = function() {
        return $("aside").remove();
      };

      BeeLineReaderExtension.prototype.getVariables = function(variables, callback) {
        var _this = this;
        return this.getVariablesFromStorage(variables, function(answers) {
          return callback && callback(answers);
        });
      };

      BeeLineReaderExtension.prototype.setVariables = function(variables, callback) {
        var key, val,
          _this = this;
        if (this.development()) {
          BeelineUtils.log("setting ", JSON.stringify(variables));
        }
        for (key in variables) {
          val = variables[key];
          this.options[key] = val;
        }
        this.updateBeelineOptions();
        return this.setVariablesInStorage(variables, function() {
          return callback && callback();
        });
      };

      BeeLineReaderExtension.prototype.resetSettings = function(callback) {
        if (callback == null) {
          callback = null;
        }
        return this.setVariables({
          theme: null,
          openDyslexic: false,
          disableCustomSites: false,
          skipAutoColorOn: {},
          customColor1: null,
          customColor2: null,
          customColor3: null,
          customColor4: null,
          customBackground: null,
          kioskDisabled: null,
          kioskResetAt: null
        }, callback);
      };

      BeeLineReaderExtension.prototype.possiblyResetInKioskMode = function() {
        var now;
        now = BeelineUtils.epochInSeconds();
        if (this.options.kioskMode && this.options.kioskResetAt) {
          if (this.options.kioskResetAt < now) {
            return this.resetSettings();
          }
        }
      };

      BeeLineReaderExtension.prototype.pushKioskResetForward = function() {
        var now;
        now = BeelineUtils.epochInSeconds();
        if (this.options.kioskMode) {
          if ((this.options.kioskResetAt || 0) < now + this.KIOSK_WINDOW - 60) {
            return this.setVariables({
              kioskResetAt: now + this.KIOSK_WINDOW
            });
          }
        }
      };

      BeeLineReaderExtension.prototype.currentlyKioskDisabled = function() {
        return this.options.kioskMode && this.options.kioskDisabled;
      };

      BeeLineReaderExtension.prototype.redirectToRegister = function(opts) {
        if (opts == null) {
          opts = {};
        }
        return BeelineUtils.redirect("" + (this.siteDomain()) + "/register", $.extend({}, opts, {
          "return": BeelineUtils.url()
        }));
      };

      BeeLineReaderExtension.prototype.checkLicense = function(force) {
        var now,
          _this = this;
        if (force == null) {
          force = false;
        }
        now = (new Date()).getTime();
        if (this.options.licenseCode && (force || !this.options.lastCheckedLicense || this.options.lastCheckedLicense < now - (24 * 60 * 60 * 1000))) {
          this.setVariables({
            lastCheckedLicense: now
          });
          return $.ajax({
            dataType: "json",
            url: "" + (this.siteDomain()) + "/licenses/" + this.options.licenseCode + ".json",
            error: function(jqXHR, textStatus, errorThrown) {
              return BeelineUtils.log("Unable to check registration: " + textStatus + " " + errorThrown);
            },
            success: function(response) {
              var _ref, _ref1;
              if (response.registration != null) {
                return _this.setVariables(BeelineUtils.presentSliceOf({
                  licenseState: response.registration.state,
                  licenseCurrentPeriodEnd: response.registration.current_period_end,
                  licensePlan: (_ref = response.registration.plan) != null ? _ref.shortname : void 0,
                  licensePlanName: (_ref1 = response.registration.plan) != null ? _ref1.name : void 0
                }));
              } else {
                return BeelineUtils.log("No registration data returned");
              }
            }
          });
        }
      };

      BeeLineReaderExtension.prototype.siteDomain = function() {
        if (this.development()) {
          if (this.options.environment === 'staging') {
            return 'https://beelinereader-staging.herokuapp.com';
          } else {
            return 'http://localhost:3000';
          }
        } else {
          return 'https://beelinereader.herokuapp.com';
        }
      };

      BeeLineReaderExtension.prototype.development = function() {
        var _ref;
        return (_ref = this.options.environment) === 'development' || _ref === 'staging';
      };

      BeeLineReaderExtension.prototype.freePlan = function() {
        var _ref;
        if (this.options.legacy) {
          return false;
        }
        return this.options.licensePlan === 'free' || ((_ref = this.options.licenseState) !== 'active' && _ref !== 'trialing');
      };

      BeeLineReaderExtension.prototype.getVariablesFromStorage = function(variables, callback) {
        return callback && callback();
      };

      BeeLineReaderExtension.prototype.setVariablesInStorage = function(variables, callback) {
        return callback && callback();
      };

      BeeLineReaderExtension.prototype.launchDelay = function(callback) {
        return callback();
      };

      BeeLineReaderExtension.start = function() {
        var _ref, _ref1;
        if (this.onBeeLineWebsite()) {
          return BeelineUtils.alert("Please launch BeeLine Reader on a site with long-form content that you wish to read, such as Wikipedia or the New York Times.");
        } else if ((_ref = window.location) != null ? (_ref1 = _ref.href) != null ? _ref1.match(/\.pdf(\?.*)?$/i) : void 0 : void 0) {
          return BeelineUtils.alert("To read PDFs with BeeLine, download our PDF plugin from our website: www.BeeLineReader.com");
        } else if (this.active()) {
          return this.deactivate();
        } else {
          return this.activate();
        }
      };

      BeeLineReaderExtension.autoStart = function() {
        var extension;
        if (this.onBeeLineWebsite()) {
          extension = new this();
          return extension.loadSettings(function() {
            var handleRegistration, registrationInterval,
              _this = this;
            handleRegistration = function() {
              var $metadata, $status, updatePage;
              $status = $('.beeline-extension-registration-status');
              updatePage = function() {
                $('.beeline-extension-not-installed').hide();
                $('.beeline-extension-installed').show();
                if (extension.options.licenseCode && extension.options.licenseState !== 'canceled') {
                  return $status.text('Status: registered').show();
                } else {
                  return $status.text('Status: unregistered').show();
                }
              };
              updatePage();
              $metadata = $('.beeline-extension-installed .beeline-metadata');
              return $.each($metadata, function(index, elem) {
                var $elem, environment, kioskMode, licenseCode, updateHash;
                $elem = $(elem);
                licenseCode = $elem.data('code');
                environment = $elem.data('environment');
                kioskMode = $elem.data('kiosk-mode');
                updateHash = {};
                if (environment != null) {
                  updateHash.environment = environment;
                }
                if (licenseCode != null) {
                  updateHash.licenseCode = licenseCode;
                  updateHash.lastCheckedLicense = null;
                  updateHash.legacy = false;
                  updateHash.kioskMode = kioskMode;
                  updateHash.hasShownHelp = extension.version;
                }
                return extension.setVariables(updateHash, function() {
                  if (licenseCode != null) {
                    return extension.checkLicense(true).done(updatePage);
                  }
                });
              });
            };
            return registrationInterval = setInterval(function() {
              if ($('.beeline-extension-registration-status').length) {
                clearInterval(registrationInterval);
                return handleRegistration();
              }
            }, 500);
          });
        } else {
          return this.activate();
        }
      };

      BeeLineReaderExtension.deactivate = function() {
        $("body")[0].beelineIsActive = false;
        return BeelineUtils.reload();
      };

      BeeLineReaderExtension.activate = function() {
        var extension;
        $("body")[0].beelineIsActive = true;
        extension = new this({
          ga: true,
          handleResize: true
        });
        return extension.init();
      };

      BeeLineReaderExtension.onBeeLineWebsite = function() {
        var _ref;
        return (_ref = window.location) != null ? _ref.href.match(/^https?:\/\/(www\.)?(beelinereader\.com|localhost:3000|beelinereader(-\w+)?\.herokuapp\.com)/i) : void 0;
      };

      BeeLineReaderExtension.shouldAutoStart = function(callback) {
        var extension;
        if (this.onBeeLineWebsite()) {
          return callback(true);
        } else {
          extension = new this();
          return extension.loadSettings(function() {
            extension.possiblyResetInKioskMode();
            if (extension.currentlyKioskDisabled()) {
              return callback(false);
            } else {
              extension.checkForCustomSite();
              if (extension.options.customSite != null) {
                return callback(extension.shouldAutoColor());
              } else {
                return callback(false);
              }
            }
          });
        }
      };

      BeeLineReaderExtension.active = function() {
        return $("body")[0].beelineIsActive === true;
      };

      return BeeLineReaderExtension;

    })();
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return window.BeeLineReaderFirefox = (function(_super) {
      __extends(BeeLineReaderFirefox, _super);

      function BeeLineReaderFirefox() {
        this.setVariablesInStorage = __bind(this.setVariablesInStorage, this);
        this.getVariablesFromStorage = __bind(this.getVariablesFromStorage, this);
        _ref = BeeLineReaderFirefox.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      BeeLineReaderFirefox.prototype.EXTENSION_NAME = 'Firefox';

      BeeLineReaderFirefox.prototype.introHelpMessage = function() {
        return "<p>Welcome to the BeeLine Firefox Addon, v1.7.0!</p>";
      };

      BeeLineReaderFirefox.prototype.keyboardHelpMessage = function() {
        return "or press shift+control+L";
      };

      BeeLineReaderFirefox.prototype.sendMessageToExtension = function(data, callback) {
        var event, request;
        request = document.createTextNode(JSON.stringify(data));
        request.addEventListener("beelinereader-response", function(event) {
          request.parentNode.removeChild(request);
          if (callback) {
            return callback(JSON.parse(request.nodeValue));
          }
        }, false);
        document.head.appendChild(request);
        event = document.createEvent("HTMLEvents");
        event.initEvent("beelinereader-message", true, false);
        return request.dispatchEvent(event);
      };

      BeeLineReaderFirefox.prototype.getVariablesFromStorage = function(variables, callback) {
        var _this = this;
        return this.sendMessageToExtension({
          command: "get",
          variables: variables
        }, function(response) {
          console.log("heard back from get", response);
          return callback && callback(response);
        });
      };

      BeeLineReaderFirefox.prototype.setVariablesInStorage = function(variables, callback) {
        var _this = this;
        return this.sendMessageToExtension({
          command: "set",
          variables: variables
        }, function(response) {
          console.log("heard back from set", response);
          return callback && callback();
        });
      };

      BeeLineReaderFirefox.prototype.loadOpenDyslexic = function(doc) {
        if (doc == null) {
          doc = document;
        }
        return BeelineUtils.loadCSS("resource://beelinereader/vendor/open-dyslexic.css", {
          id: 'open-dyslexic-link',
          document: doc
        });
      };

      BeeLineReaderFirefox.prototype.loadResources = function(options) {
        var _ref1;
        if (options == null) {
          options = {};
        }
        BeelineUtils.loadCSS("resource://beelinereader/vendor/spectrum.css");
        BeelineUtils.loadCSS("resource://beelinereader/firefox.css");
        BeelineUtils.loadCSS("resource://beelinereader/vendor/magnific-popup/magnific-popup.css");
        if (!((_ref1 = options.disable) != null ? _ref1.openDyslexic : void 0)) {
          this.loadOpenDyslexic();
        }
        if (options.readability != null) {
          return BeelineUtils.loadCSS("resource://beelinereader/vendor/readability_print.css", {
            media: 'print'
          });
        }
      };

      BeeLineReaderFirefox.prototype.launchDelay = function(callback) {
        return setTimeout(callback, 100);
      };

      return BeeLineReaderFirefox;

    })(BeeLineReaderExtension);
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  if (BeeLineReaderExtension.customHandlers == null) {
    BeeLineReaderExtension.customHandlers = {};
  }

  (function($) {
    return BeeLineReaderExtension.CustomHandler = (function() {
      CustomHandler.prototype.autoColor = true;

      CustomHandler.prototype.disable = {
        backgrounds: true
      };

      function CustomHandler(extension) {
        this.extension = extension;
        this.working = false;
      }

      CustomHandler.prototype.matches = function() {
        return BeelineUtils.urlMatches(this.pattern);
      };

      CustomHandler.prototype.skip = function(selector, $root) {
        if ($root == null) {
          $root = null;
        }
        if ($root) {
          return $root.find(selector).attr(BeeLineReader.SKIP_COLOR_ATTRIBUTE, 'true');
        } else {
          return $(selector).attr(BeeLineReader.SKIP_COLOR_ATTRIBUTE, 'true');
        }
      };

      CustomHandler.prototype.triggerInterfaceChange = function(action, enabled) {
        return typeof this.onInterfaceChange === "function" ? this.onInterfaceChange(action, enabled) : void 0;
      };

      CustomHandler.prototype.keepLookingFor = function(options) {
        var interval;
        return interval = setInterval(function() {
          var element, option, selector, _ref, _results;
          _ref = options.patterns;
          _results = [];
          for (option in _ref) {
            selector = _ref[option];
            if (element = document.querySelector(selector)) {
              clearInterval(interval);
              options.callback(option, element);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }, 50);
      };

      CustomHandler.prototype.delay = function(milliseconds, callback) {
        return setTimeout(callback, milliseconds);
      };

      CustomHandler.prototype.keepColoringSelector = function(selector, options) {
        var beelineOptions, lastUpdate, update, updateFrequency,
          _this = this;
        if (options == null) {
          options = {};
        }
        this.working = true;
        beelineOptions = options.beelineOptions || {};
        updateFrequency = 300;
        lastUpdate = 0;
        update = function() {
          var $node, iframeSelector, newBeeline, node, now, num, scope, _i, _j, _len, _len1, _ref, _ref1;
          if (!_this.extension.autoUsageAllowed()) {
            return;
          }
          now = (new Date()).getTime();
          if (lastUpdate < now - updateFrequency) {
            num = 0;
            scope = $(document);
            if (options.withinIframes != null) {
              _ref = options.withinIframes;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                iframeSelector = _ref[_i];
                scope = $(iframeSelector, scope).contents();
              }
            }
            _ref1 = $(selector, scope);
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              node = _ref1[_j];
              if (node.getAttribute('data-beeline-indicator') !== "beeline-enabled") {
                $node = $(node);
                if (!options.filter || options.filter($node)) {
                  node.setAttribute('data-beeline-indicator', "beeline-enabled");
                  if ($node.closest('.beeline-region').length === 0 && $node.text() && !$node.closest("[" + BeeLineReader.SKIP_COLOR_ATTRIBUTE + "=true]").length) {
                    if (typeof options.beforeColor === "function") {
                      options.beforeColor($node);
                    }
                    num++;
                    newBeeline = new BeeLineReader(node, $.extend({
                      skipBackgroundColor: true,
                      handleResize: true
                    }, beelineOptions));
                    _this.extension.addBeeline(newBeeline);
                    newBeeline.color();
                    if (options.callback != null) {
                      options.callback($node, newBeeline);
                    }
                  }
                }
              }
            }
            if (num > 0) {
              BeelineUtils.log("Colored " + num + " new; Cleaned up: " + (_this.extension.cleanupOldBeelines()));
              if (!options.skipGa) {
                _this.extension.gaTrack("special/" + _this.name + "/sectionColored");
              }
            }
            return lastUpdate = now;
          }
        };
        setInterval(update, updateFrequency);
        return update();
      };

      CustomHandler.prototype.colorSelector = function(selector, options) {
        var $node, didSomething, handleResize, newBeeline, node, _i, _len, _ref;
        if (options == null) {
          options = {};
        }
        if (!this.extension.autoUsageAllowed()) {
          return;
        }
        didSomething = false;
        if (options.handleResize != null) {
          handleResize = options.handleResize;
        } else {
          handleResize = true;
        }
        _ref = $(selector);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          if (node.getAttribute('data-beeline-indicator') !== "beeline-enabled") {
            node.setAttribute('data-beeline-indicator', "beeline-enabled");
            $node = $(node);
            if ($node.text() && !$node.closest("[" + BeeLineReader.SKIP_COLOR_ATTRIBUTE + "=true]").length) {
              didSomething = true;
              newBeeline = new BeeLineReader(node, $.extend({
                skipBackgroundColor: true,
                handleResize: handleResize
              }, options));
              this.extension.addBeeline(newBeeline);
              newBeeline.color();
            }
          }
        }
        if (didSomething) {
          this.extension.gaTrack("special/" + this.name + "/pageColored");
          return this.working = true;
        }
      };

      return CustomHandler;

    })();
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ADDConnectHandler = (function(_super) {
    __extends(ADDConnectHandler, _super);

    function ADDConnectHandler() {
      _ref = ADDConnectHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ADDConnectHandler.prototype.pattern = /^https?:\/\/(\w+\.)?connect\.additudemag.com(\.\w{2})?.+\d/i;

    ADDConnectHandler.prototype.legacy = true;

    ADDConnectHandler.prototype.positions = {
      toolsMenu: {
        left: "15px",
        right: "auto",
        top: "15px"
      }
    };

    ADDConnectHandler.prototype.run = function() {
      return this.colorSelector(".post");
    };

    return ADDConnectHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ADDForumsHandler = (function(_super) {
    __extends(ADDForumsHandler, _super);

    function ADDForumsHandler() {
      _ref = ADDForumsHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ADDForumsHandler.prototype.pattern = /^https?:\/\/(\w+\.)?addforums\.com(\.\w{2})?/i;

    ADDForumsHandler.prototype.name = 'ADDForums';

    ADDForumsHandler.prototype.legacy = true;

    ADDForumsHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "30px",
        top: "10px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    ADDForumsHandler.prototype.run = function() {
      return this.colorSelector(".alt1");
    };

    return ADDForumsHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AeonHandler = (function(_super) {
    __extends(AeonHandler, _super);

    function AeonHandler() {
      _ref = AeonHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AeonHandler.prototype.pattern = /^https?:\/\/(\w+\.)?aeon\.co(\.\w{2})?\/magazine\/.+/i;

    AeonHandler.prototype.name = 'Aeon Magazine';

    AeonHandler.prototype.legacy = true;

    AeonHandler.prototype.positions = {
      toolsMenu: {
        top: "75px"
      }
    };

    AeonHandler.prototype.run = function() {
      return this.colorSelector(".content");
    };

    return AeonHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AllAboutVisionHandler = (function(_super) {
    __extends(AllAboutVisionHandler, _super);

    function AllAboutVisionHandler() {
      _ref = AllAboutVisionHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AllAboutVisionHandler.prototype.pattern = /^https?:\/\/(\w+\.)?allaboutvision\.com/i;

    AllAboutVisionHandler.prototype.name = 'All About Vision';

    AllAboutVisionHandler.prototype.legacy = true;

    AllAboutVisionHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px",
        top: "20px"
      },
      configurationPane: {
        left: "-160px",
        position: "relative"
      }
    };

    AllAboutVisionHandler.prototype.run = function() {
      this.skip("#onPage, .head");
      return this.colorSelector("#content");
    };

    return AllAboutVisionHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AmazonHandler = (function(_super) {
    __extends(AmazonHandler, _super);

    function AmazonHandler() {
      _ref = AmazonHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AmazonHandler.prototype.pattern = /^https?:\/\/(\w+\.)?amazon.com(\.\w{2})?/i;

    AmazonHandler.prototype.name = 'Amazon';

    AmazonHandler.prototype.legacy = true;

    AmazonHandler.prototype.positions = {
      toolsMenu: {
        top: "-200px",
        left: "-200px"
      }
    };

    AmazonHandler.prototype.matches = function() {
      return BeelineUtils.urlMatches(this.pattern) && !BeelineUtils.urlMatches(BeeLineReaderExtension.customHandlers.KindleReaderHandler.prototype.pattern);
    };

    AmazonHandler.prototype.run = function() {
      return this.keepColoringSelector("#revMHRL, #authorBio #bookDescription_feature_div, .reviewtext, .viewpointbox, #pdIframeContent");
    };

    return AmazonHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AOAHandler = (function(_super) {
    __extends(AOAHandler, _super);

    function AOAHandler() {
      _ref = AOAHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AOAHandler.prototype.pattern = /^https?:\/\/(\w+\.)?aoa\.org/i;

    AOAHandler.prototype.name = 'AOA';

    AOAHandler.prototype.legacy = true;

    AOAHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px",
        top: "20px"
      },
      configurationPane: {
        left: "-160px",
        position: "relative"
      }
    };

    AOAHandler.prototype.run = function() {
      this.skip(".banner");
      return this.colorSelector(".article.detail");
    };

    return AOAHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AOAJobsHandler = (function(_super) {
    __extends(AOAJobsHandler, _super);

    function AOAJobsHandler() {
      _ref = AOAJobsHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AOAJobsHandler.prototype.pattern = /^https?:\/\/(\w+\.)?careers\.optometryscareercenter\.org\/jobs/i;

    AOAJobsHandler.prototype.name = 'AOA Jobs';

    AOAJobsHandler.prototype.legacy = true;

    AOAJobsHandler.prototype.positions = {
      toolsMenu: {
        left: "12px",
        right: "auto",
        top: "12px"
      }
    };

    AOAJobsHandler.prototype.run = function() {
      this.skip(".banner");
      return this.colorSelector(".bti-jd-description, .bti-jd-employer-info");
    };

    return AOAJobsHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AolHandler = (function(_super) {
    __extends(AolHandler, _super);

    function AolHandler() {
      _ref = AolHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AolHandler.prototype.pattern = /^https?:\/\/(\w+\.)?reader\.aol\.com(\.\w{2})?/i;

    AolHandler.prototype.name = 'AOL Reader';

    AolHandler.prototype.legacy = true;

    AolHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "210px",
        top: "4px"
      }
    };

    AolHandler.prototype.run = function() {
      return this.keepColoringSelector(".article-body");
    };

    return AolHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ApexLearningHandler = (function(_super) {
    __extends(ApexLearningHandler, _super);

    function ApexLearningHandler() {
      _ref = ApexLearningHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ApexLearningHandler.prototype.pattern = /^https?:\/\/(\w+\.)?courses\.apexlearning\.com/i;

    ApexLearningHandler.prototype.name = 'Apex Learning';

    ApexLearningHandler.prototype.run = function() {
      var _this = this;
      return this.keepColoringSelector("body", {
        withinIframes: ["iframe[name=content]"],
        beforeColor: function($node) {
          return _this.skip('span.tooltip', $node);
        }
      });
    };

    return ApexLearningHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AppleDailyHandler = (function(_super) {
    __extends(AppleDailyHandler, _super);

    function AppleDailyHandler() {
      _ref = AppleDailyHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AppleDailyHandler.prototype.pattern = /^https?:\/\/(\w+\.)?appledaily\.com(\.\w{2})?/i;

    AppleDailyHandler.prototype.name = 'Appledaily.com.yw';

    AppleDailyHandler.prototype.legacy = true;

    AppleDailyHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    AppleDailyHandler.prototype.run = function() {
      return this.colorSelector("article");
    };

    return AppleDailyHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ArchiveOfOurOwnHandler = (function(_super) {
    __extends(ArchiveOfOurOwnHandler, _super);

    function ArchiveOfOurOwnHandler() {
      _ref = ArchiveOfOurOwnHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ArchiveOfOurOwnHandler.prototype.pattern = /^https?:\/\/(\w+\.)?archiveofourown\.org/i;

    ArchiveOfOurOwnHandler.prototype.name = 'ArchiveOfOurOwn';

    ArchiveOfOurOwnHandler.prototype.legacy = true;

    ArchiveOfOurOwnHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    ArchiveOfOurOwnHandler.prototype.run = function() {
      return this.colorSelector("#workskin");
    };

    return ArchiveOfOurOwnHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ArsTechnicaHandler = (function(_super) {
    __extends(ArsTechnicaHandler, _super);

    function ArsTechnicaHandler() {
      _ref = ArsTechnicaHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ArsTechnicaHandler.prototype.pattern = /^https?:\/\/(\w+\.)?arstechnica.com(\.\w{2})?/i;

    ArsTechnicaHandler.prototype.name = 'Ars Technica';

    ArsTechnicaHandler.prototype.legacy = true;

    ArsTechnicaHandler.prototype.run = function() {
      this.skip(".gallery, aside, .story-sidebar, .byline, .userinfo");
      return this.keepColoringSelector(".article-content, .comment, .post-content");
    };

    return ArsTechnicaHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AsianFanFicsHandler = (function(_super) {
    __extends(AsianFanFicsHandler, _super);

    function AsianFanFicsHandler() {
      _ref = AsianFanFicsHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AsianFanFicsHandler.prototype.pattern = /^https?:\/\/(\w+\.)?asianfanfics\.com(\.\w{2})?/i;

    AsianFanFicsHandler.prototype.name = 'asianfanfics';

    AsianFanFicsHandler.prototype.legacy = true;

    AsianFanFicsHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    AsianFanFicsHandler.prototype.run = function() {
      return this.colorSelector("#bodyText");
    };

    return AsianFanFicsHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AtlanticHandler = (function(_super) {
    __extends(AtlanticHandler, _super);

    function AtlanticHandler() {
      _ref = AtlanticHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AtlanticHandler.prototype.pattern = /^https?:\/\/(\w+\.)?theatlantic.com(\.\w{2})?.+\d/i;

    AtlanticHandler.prototype.name = 'The Atlantic';

    AtlanticHandler.prototype.legacy = true;

    AtlanticHandler.prototype.positions = {
      toolsMenu: {
        top: "50px"
      }
    };

    AtlanticHandler.prototype.run = function() {
      this.skip(".pullquote, aside");
      return this.colorSelector(".article-content, .article-body");
    };

    return AtlanticHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.AwfulAnnouncingHandler = (function(_super) {
    __extends(AwfulAnnouncingHandler, _super);

    function AwfulAnnouncingHandler() {
      _ref = AwfulAnnouncingHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AwfulAnnouncingHandler.prototype.pattern = /^https?:\/\/(\w+\.)?awfulannouncing\.com/i;

    AwfulAnnouncingHandler.prototype.name = 'Awful Announcing';

    AwfulAnnouncingHandler.prototype.run = function() {
      return this.colorSelector('.entry-content');
    };

    return AwfulAnnouncingHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.BBCHandler = (function(_super) {
    __extends(BBCHandler, _super);

    function BBCHandler() {
      _ref = BBCHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BBCHandler.prototype.pattern = /^https?:\/\/(\w+\.)?bbc\.(co\.uk|com)(\.\w{2})?/i;

    BBCHandler.prototype.name = 'BBC';

    BBCHandler.prototype.legacy = true;

    BBCHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    BBCHandler.prototype.run = function() {
      return this.colorSelector(".story-body");
    };

    return BBCHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.BeingDyslexichHandler = (function(_super) {
    __extends(BeingDyslexichHandler, _super);

    function BeingDyslexichHandler() {
      _ref = BeingDyslexichHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BeingDyslexichHandler.prototype.pattern = /^https?:\/\/(\w+\.)?beingdyslexic\.(co\.uk|com)(\.\w{2})?/i;

    BeingDyslexichHandler.prototype.name = 'BeingDyslexic';

    BeingDyslexichHandler.prototype.legacy = true;

    BeingDyslexichHandler.prototype.positions = {
      toolsMenu: {
        left: "10px",
        right: "auto",
        top: "40px"
      }
    };

    BeingDyslexichHandler.prototype.run = function() {
      return this.colorSelector(".post");
    };

    return BeingDyslexichHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.BleacherReportHandler = (function(_super) {
    __extends(BleacherReportHandler, _super);

    function BleacherReportHandler() {
      _ref = BleacherReportHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BleacherReportHandler.prototype.pattern = /^https?:\/\/(\w+\.)?bleacherreport\.com\/articles/i;

    BleacherReportHandler.prototype.name = 'Bleacher Report';

    BleacherReportHandler.prototype.legacy = true;

    BleacherReportHandler.prototype.run = function() {
      this.skip('.article_info.team-color-border.cf');
      return this.colorSelector('.article_body.cf');
    };

    return BleacherReportHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.BloggerHandler = (function(_super) {
    __extends(BloggerHandler, _super);

    function BloggerHandler() {
      _ref = BloggerHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BloggerHandler.prototype.pattern = /^https?:\/\/[^\.]+\.blogspot\.com/i;

    BloggerHandler.prototype.name = 'Blogger';

    BloggerHandler.prototype.run = function() {
      return this.colorSelector('.post-body.entry-content');
    };

    return BloggerHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {


}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.BookshareHandler = (function(_super) {
    __extends(BookshareHandler, _super);

    function BookshareHandler() {
      _ref = BookshareHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BookshareHandler.prototype.pattern = /^https?:\/\/(\w+\.)?bookshare\.org(\.\w{2})?/i;

    BookshareHandler.prototype.name = 'Bookshare';

    BookshareHandler.prototype.legacy = true;

    BookshareHandler.prototype.run = function() {
      return this.working = true;
    };

    return BookshareHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.BuzzfeedHandler = (function(_super) {
    __extends(BuzzfeedHandler, _super);

    function BuzzfeedHandler() {
      _ref = BuzzfeedHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BuzzfeedHandler.prototype.pattern = /^https?:\/\/(\w+\.)?buzzfeed.com(\.\w{2})?/i;

    BuzzfeedHandler.prototype.name = 'Buzzfeed';

    BuzzfeedHandler.prototype.legacy = true;

    BuzzfeedHandler.prototype.run = function() {
      return this.colorSelector(".buzz_superlist_item_text");
    };

    return BuzzfeedHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ChallengePostHandler = (function(_super) {
    __extends(ChallengePostHandler, _super);

    function ChallengePostHandler() {
      _ref = ChallengePostHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ChallengePostHandler.prototype.pattern = /^https?:\/\/(\w+\.)?challengepost\.com/i;

    ChallengePostHandler.prototype.name = 'Challenge Post';

    ChallengePostHandler.prototype.legacy = true;

    ChallengePostHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-135px",
        position: "relative"
      }
    };

    ChallengePostHandler.prototype.run = function() {
      return this.colorSelector(".large-9");
    };

    return ChallengePostHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ChronicleHandler = (function(_super) {
    __extends(ChronicleHandler, _super);

    function ChronicleHandler() {
      _ref = ChronicleHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ChronicleHandler.prototype.pattern = /^https?:\/\/(\w+\.)?chronicle\.com?(\.\w{2})?\/article/i;

    ChronicleHandler.prototype.name = 'Chronicle Of Higher Ed';

    ChronicleHandler.prototype.legacy = true;

    ChronicleHandler.prototype.positions = {
      toolsMenu: {
        left: "28px",
        right: "auto",
        top: "23px"
      }
    };

    ChronicleHandler.prototype.run = function() {
      return this.colorSelector(".article-body");
    };

    return ChronicleHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.CNNHandler = (function(_super) {
    __extends(CNNHandler, _super);

    function CNNHandler() {
      _ref = CNNHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CNNHandler.prototype.pattern = /^https?:\/\/(\w+\.)?cnn\.com(\.\w{2})?/i;

    CNNHandler.prototype.name = 'CNN';

    CNNHandler.prototype.legacy = true;

    CNNHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    CNNHandler.prototype.run = function() {
      this.skip(".cnnExplainer, .cnn_strybtmmorebx");
      return this.colorSelector(".zn-body__paragraph", {
        colorOffScreen: true
      });
    };

    return CNNHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.cornellHandler = (function(_super) {
    __extends(cornellHandler, _super);

    function cornellHandler() {
      _ref = cornellHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    cornellHandler.prototype.pattern = /^https?:\/\/(\w+\.)?law\.cornell\.edu(\.\w{2})?/i;

    cornellHandler.prototype.name = 'Cornell';

    cornellHandler.prototype.legacy = true;

    cornellHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-140px",
        position: "relative"
      }
    };

    cornellHandler.prototype.run = function() {
      this.skip(".toc, .field-items, .sb, .field.field-name-body");
      return this.colorSelector(".bodytext, .syllabus, .footnote, .note-body, .statutory-body, .statutory-body-1em, .statutory-body-2em, .statutory-body-3em, .source-credit, .field-item.even, .field-item.odd, .content-inner, .P");
    };

    return cornellHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.DailyStrengthHandler = (function(_super) {
    __extends(DailyStrengthHandler, _super);

    function DailyStrengthHandler() {
      _ref = DailyStrengthHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DailyStrengthHandler.prototype.pattern = /^https?:\/\/(\w+\.)?dailystrength\.org(\.\w{2})?/i;

    DailyStrengthHandler.prototype.name = 'DailyStrength';

    DailyStrengthHandler.prototype.legacy = true;

    DailyStrengthHandler.prototype.positions = {
      toolsMenu: {
        left: "30px",
        right: "auto",
        top: "25px"
      }
    };

    DailyStrengthHandler.prototype.run = function() {
      return this.colorSelector(".discussion_text, .blogPostContent");
    };

    return DailyStrengthHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.EconomistHandler = (function(_super) {
    __extends(EconomistHandler, _super);

    function EconomistHandler() {
      _ref = EconomistHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    EconomistHandler.prototype.pattern = /^https?:\/\/(\w+\.)?economist\.com(\.\w{2})?/i;

    EconomistHandler.prototype.name = 'Economist';

    EconomistHandler.prototype.legacy = true;

    EconomistHandler.prototype.run = function() {
      this.skip("aside, div.content-image-float-290");
      return this.colorSelector(".main-content, .es-content");
    };

    return EconomistHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ESPNHandler = (function(_super) {
    __extends(ESPNHandler, _super);

    function ESPNHandler() {
      _ref = ESPNHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ESPNHandler.prototype.pattern = /^https?:\/\/(\w+\.)?espn.go.com(\.\w{2})?/i;

    ESPNHandler.prototype.name = 'ESPN';

    ESPNHandler.prototype.legacy = true;

    ESPNHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "28px",
        top: "200px"
      },
      configurationPane: {
        left: "-140px",
        position: "relative"
      }
    };

    ESPNHandler.prototype.run = function() {
      this.skip("figcaption,.story-link, .related-links, .realStory, aside, .video-length, .author, .timestamp, .now-content, .share-count, .news-feed_item-meta");
      return this.keepColoringSelector("article, .article-body");
    };

    return ESPNHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.EtsyHandler = (function(_super) {
    __extends(EtsyHandler, _super);

    function EtsyHandler() {
      _ref = EtsyHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    EtsyHandler.prototype.pattern = /^https?:\/\/(\w+\.)?etsy.com(\.\w{2})?\/listing/i;

    EtsyHandler.prototype.name = 'Etsy';

    EtsyHandler.prototype.legacy = true;

    EtsyHandler.prototype.positions = {
      toolsMenu: {
        top: "15px",
        left: "15px"
      }
    };

    EtsyHandler.prototype.run = function() {
      return this.keepColoringSelector("#description-text, .feedback-comment, .policy-row.clear");
    };

    return EtsyHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.FacebookHandler = (function(_super) {
    __extends(FacebookHandler, _super);

    function FacebookHandler() {
      _ref = FacebookHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FacebookHandler.prototype.pattern = /^https?:\/\/(\w+\.)?facebook.com(\.\w{2})?/i;

    FacebookHandler.prototype.name = 'Facebook';

    FacebookHandler.prototype.legacy = true;

    FacebookHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "10px",
        top: "53px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    FacebookHandler.prototype.run = function() {
      return this.keepColoringSelector(".UFICommentBody, ._3ekx, ._5pbx");
    };

    return FacebookHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.FanFictionHandler = (function(_super) {
    __extends(FanFictionHandler, _super);

    function FanFictionHandler() {
      _ref = FanFictionHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FanFictionHandler.prototype.pattern = /^https?:\/\/(\w+\.)?fanfiction\.net/i;

    FanFictionHandler.prototype.name = 'FanFiction';

    FanFictionHandler.prototype.legacy = true;

    FanFictionHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    FanFictionHandler.prototype.run = function() {
      return this.colorSelector(".storytext");
    };

    return FanFictionHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.FazHandler = (function(_super) {
    __extends(FazHandler, _super);

    function FazHandler() {
      _ref = FazHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FazHandler.prototype.pattern = /^https?:\/\/(\w+\.)?faz\.net/i;

    FazHandler.prototype.name = 'Faz';

    FazHandler.prototype.legacy = true;

    FazHandler.prototype.run = function() {
      return this.colorSelector("p.Copy, .FAZArtikelText > p, .TeaserText", {
        handleResize: false
      });
    };

    return FazHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.FeedlyHandler = (function(_super) {
    __extends(FeedlyHandler, _super);

    function FeedlyHandler() {
      _ref = FeedlyHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FeedlyHandler.prototype.pattern = /^https?:\/\/(\w+\.)?feedly\.com/i;

    FeedlyHandler.prototype.name = 'Feedly';

    FeedlyHandler.prototype.legacy = true;

    FeedlyHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    FeedlyHandler.prototype.run = function() {
      return this.keepColoringSelector(".entryBody");
    };

    return FeedlyHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.FiveThirtyEightHandler = (function(_super) {
    __extends(FiveThirtyEightHandler, _super);

    function FiveThirtyEightHandler() {
      _ref = FiveThirtyEightHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FiveThirtyEightHandler.prototype.pattern = /^https?:\/\/(\w+\.)?fivethirtyeight\.com?(\.\w{2})?/i;

    FiveThirtyEightHandler.prototype.name = 'FiveThirtyEight';

    FiveThirtyEightHandler.prototype.legacy = true;

    FiveThirtyEightHandler.prototype.positions = {
      toolsMenu: {
        left: "45px",
        right: "auto",
        top: "28px"
      }
    };

    FiveThirtyEightHandler.prototype.run = function() {
      return this.colorSelector(".entry-content");
    };

    return FiveThirtyEightHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ForbesHandler = (function(_super) {
    __extends(ForbesHandler, _super);

    function ForbesHandler() {
      _ref = ForbesHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ForbesHandler.prototype.pattern = /^https?:\/\/(\w+\.)?forbes\.com(\.\w{2})?/i;

    ForbesHandler.prototype.name = 'Forbes';

    ForbesHandler.prototype.legacy = true;

    ForbesHandler.prototype.positions = {
      toolsMenu: {
        top: "67px"
      }
    };

    ForbesHandler.prototype.run = function() {
      return this.keepColoringSelector(".article-text");
    };

    return ForbesHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.FoxNewsHandler = (function(_super) {
    __extends(FoxNewsHandler, _super);

    function FoxNewsHandler() {
      _ref = FoxNewsHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FoxNewsHandler.prototype.pattern = /^https?:\/\/(\w+\.)?foxnews\.com(\.\w{2})?/i;

    FoxNewsHandler.prototype.name = 'FoxNews';

    FoxNewsHandler.prototype.legacy = true;

    FoxNewsHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    FoxNewsHandler.prototype.run = function() {
      this.skip(".m");
      return this.colorSelector("article");
    };

    return FoxNewsHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.FtchineseHandler = (function(_super) {
    __extends(FtchineseHandler, _super);

    function FtchineseHandler() {
      _ref = FtchineseHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FtchineseHandler.prototype.pattern = /^https?:\/\/(\w+\.)?Ftchinese\.com(\.\w{2})?/i;

    FtchineseHandler.prototype.name = 'Ftchinese.com';

    FtchineseHandler.prototype.legacy = true;

    FtchineseHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    FtchineseHandler.prototype.run = function() {
      return this.colorSelector(".content");
    };

    return FtchineseHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.GhostHandler = (function(_super) {
    __extends(GhostHandler, _super);

    function GhostHandler() {
      _ref = GhostHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GhostHandler.prototype.matches = function() {
      return document.querySelector("head > meta[name='generator'][content^='Ghost']");
    };

    GhostHandler.prototype.name = 'Ghost';

    GhostHandler.prototype.run = function() {
      return this.colorSelector(".post-content, .post-excerpt");
    };

    return GhostHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return BeeLineReaderExtension.customHandlers.GMAILHandler = (function(_super) {
      __extends(GMAILHandler, _super);

      function GMAILHandler() {
        _ref = GMAILHandler.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GMAILHandler.prototype.pattern = /(?:https?:\/\/)?(mail\.google\.com\/mail\/)/;

      GMAILHandler.prototype.name = 'Gmail';

      GMAILHandler.prototype.positions = {
        toolsMenu: {
          left: "auto",
          right: "340px",
          top: "5px"
        }
      };

      GMAILHandler.prototype.run = function() {
        var _this = this;
        this.keepColoringSelector(".adn, .ads, .gmail_extra:visible");
        return $(document).on('click', '[data-tooltip="Show trimmed content"]', function() {
          return _this.extension.recolor();
        });
      };

      return GMAILHandler;

    })(BeeLineReaderExtension.CustomHandler);
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return BeeLineReaderExtension.customHandlers.GoodreadsHandler = (function(_super) {
      __extends(GoodreadsHandler, _super);

      function GoodreadsHandler() {
        _ref = GoodreadsHandler.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GoodreadsHandler.prototype.pattern = /^https?:\/\/(\w+\.)?goodreads\.com/;

      GoodreadsHandler.prototype.name = 'Goodreads';

      GoodreadsHandler.prototype.legacy = true;

      GoodreadsHandler.prototype.positions = {
        toolsMenu: {
          left: "28px",
          right: "auto",
          top: "1px"
        }
      };

      GoodreadsHandler.prototype.run = function() {
        var _this = this;
        this.skip(".selfServeAds, button, a, #discoveryBox, #imagecol, .cell, #details");
        this.colorSelector(".leftContainer, .reviewText, .readable");
        return $(document).on('click', 'a[href="#"]', function() {
          return _this.extension.recolor();
        });
      };

      return GoodreadsHandler;

    })(BeeLineReaderExtension.CustomHandler);
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return BeeLineReaderExtension.customHandlers.GoogleDocsHandler = (function(_super) {
      __extends(GoogleDocsHandler, _super);

      function GoogleDocsHandler() {
        _ref = GoogleDocsHandler.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GoogleDocsHandler.prototype.pattern = /^https?:\/\/(\w+\.)?(docs\.google\.com\/document\/)/;

      GoogleDocsHandler.prototype.name = 'GoogleDocs';

      GoogleDocsHandler.prototype.positions = {
        toolsMenu: {
          left: "15px",
          right: "auto",
          top: "120px"
        }
      };

      GoogleDocsHandler.prototype.run = function() {
        var refresh, timer,
          _this = this;
        this.keepColoringSelector(".kix-appview-editor");
        timer = void 0;
        refresh = function() {
          return _this.extension.recolor();
        };
        return $('.kix-appview-editor').scroll(function() {
          if (timer !== void 0) {
            clearTimeout(timer);
          }
          return timer = setTimeout(refresh, 800);
        });
      };

      return GoogleDocsHandler;

    })(BeeLineReaderExtension.CustomHandler);
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.GoogleNewsHandler = (function(_super) {
    __extends(GoogleNewsHandler, _super);

    function GoogleNewsHandler() {
      _ref = GoogleNewsHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GoogleNewsHandler.prototype.pattern = /^https?:\/\/(\w+\.)?news\.google\.com/i;

    GoogleNewsHandler.prototype.name = 'Google News';

    GoogleNewsHandler.prototype.legacy = true;

    GoogleNewsHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    GoogleNewsHandler.prototype.run = function() {
      return this.keepColoringSelector(".esc-lead-snippet-wrapper");
    };

    return GoogleNewsHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.GrantlandHandler = (function(_super) {
    __extends(GrantlandHandler, _super);

    function GrantlandHandler() {
      _ref = GrantlandHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GrantlandHandler.prototype.pattern = /^https?:\/\/(\w+\.)?grantland\.com?(\.\w{2})?/i;

    GrantlandHandler.prototype.name = 'Grantland';

    GrantlandHandler.prototype.legacy = true;

    GrantlandHandler.prototype.positions = {
      toolsMenu: {
        left: "40px",
        right: "auto",
        top: "35px"
      }
    };

    GrantlandHandler.prototype.run = function() {
      this.skip(".espn-boxout");
      return this.colorSelector(".blog-body");
    };

    return GrantlandHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.GreenTechMediaHandler = (function(_super) {
    __extends(GreenTechMediaHandler, _super);

    function GreenTechMediaHandler() {
      _ref = GreenTechMediaHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GreenTechMediaHandler.prototype.pattern = /^https?:\/\/(\w+\.)?greentechmedia\.com/i;

    GreenTechMediaHandler.prototype.name = 'Green Tech Media';

    GreenTechMediaHandler.prototype.run = function() {
      return this.colorSelector('.article-body');
    };

    return GreenTechMediaHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.HabrahabrHandler = (function(_super) {
    __extends(HabrahabrHandler, _super);

    function HabrahabrHandler() {
      _ref = HabrahabrHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HabrahabrHandler.prototype.pattern = /^https?:\/\/(\w+\.)?habrahabr(\.\w{2})/i;

    HabrahabrHandler.prototype.name = 'Habrahabr';

    HabrahabrHandler.prototype.legacy = true;

    HabrahabrHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    HabrahabrHandler.prototype.run = function() {
      return this.colorSelector(".content");
    };

    return HabrahabrHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.HBRHandler = (function(_super) {
    __extends(HBRHandler, _super);

    function HBRHandler() {
      _ref = HBRHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HBRHandler.prototype.pattern = /^https?:\/\/(\w+\.)?hbr\.org(\.\w{2})?/i;

    HBRHandler.prototype.name = 'Harvard Business Review';

    HBRHandler.prototype.legacy = true;

    HBRHandler.prototype.positions = {
      toolsMenu: {
        top: "80px",
        left: "13px"
      }
    };

    HBRHandler.prototype.run = function() {
      this.skip(".article-tools");
      return this.colorSelector(".content-area--article.column");
    };

    return HBRHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.HuffingtonPostHandler = (function(_super) {
    __extends(HuffingtonPostHandler, _super);

    function HuffingtonPostHandler() {
      _ref = HuffingtonPostHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HuffingtonPostHandler.prototype.pattern = /^https?:\/\/(\w+\.)?huffingtonpost\.com(\.\w{2})?/i;

    HuffingtonPostHandler.prototype.name = 'HuffingtonPost';

    HuffingtonPostHandler.prototype.legacy = true;

    HuffingtonPostHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    HuffingtonPostHandler.prototype.run = function() {
      return this.colorSelector("#mainentrycontent, .articleBody, .entry, .entry-component__content");
    };

    return HuffingtonPostHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.HuxiuHandler = (function(_super) {
    __extends(HuxiuHandler, _super);

    function HuxiuHandler() {
      _ref = HuxiuHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HuxiuHandler.prototype.pattern = /^https?:\/\/(\w+\.)?huxiu\.com(\.\w{2})?/i;

    HuxiuHandler.prototype.name = 'Huxiu';

    HuxiuHandler.prototype.legacy = true;

    HuxiuHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    HuxiuHandler.prototype.run = function() {
      return this.colorSelector(".neirong-box");
    };

    return HuxiuHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.IMDBHandler = (function(_super) {
    __extends(IMDBHandler, _super);

    function IMDBHandler() {
      _ref = IMDBHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    IMDBHandler.prototype.pattern = /^https?:\/\/(\w+\.)?imdb\.com?(\.\w{2})?/i;

    IMDBHandler.prototype.name = 'IMDB';

    IMDBHandler.prototype.legacy = true;

    IMDBHandler.prototype.positions = {
      toolsMenu: {
        left: "28px",
        right: "auto",
        top: "23px"
      }
    };

    IMDBHandler.prototype.run = function() {
      return this.colorSelector(".inline.canwrap, .plotSummary, .display, .soda.odd, .bio, .inline, #main");
    };

    return IMDBHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.InstapaperHandler = (function(_super) {
    __extends(InstapaperHandler, _super);

    function InstapaperHandler() {
      _ref = InstapaperHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    InstapaperHandler.prototype.pattern = /^https?:\/\/(\w+\.)?instapaper\.com(\.\w{2})?/i;

    InstapaperHandler.prototype.name = 'Instapaper';

    InstapaperHandler.prototype.legacy = true;

    InstapaperHandler.prototype.positions = {
      toolsMenu: {
        top: "55px"
      }
    };

    InstapaperHandler.prototype.run = function() {
      return this.colorSelector("#story > div");
    };

    return InstapaperHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.JustinKanHandler = (function(_super) {
    __extends(JustinKanHandler, _super);

    function JustinKanHandler() {
      _ref = JustinKanHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    JustinKanHandler.prototype.pattern = /^https?:\/\/(\w+\.)?justinkan\.com(\.\w{2})?/i;

    JustinKanHandler.prototype.name = 'Justin Kan';

    JustinKanHandler.prototype.legacy = true;

    JustinKanHandler.prototype.positions = {
      toolsMenu: {
        top: "75px"
      }
    };

    JustinKanHandler.prototype.run = function() {
      return this.colorSelector(".blog.user_post");
    };

    return JustinKanHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return BeeLineReaderExtension.customHandlers.KindleReaderHandler = (function(_super) {
      __extends(KindleReaderHandler, _super);

      function KindleReaderHandler() {
        _ref = KindleReaderHandler.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      KindleReaderHandler.prototype.pattern = /^https?:\/\/(read|ler|leer)\.amazon\.(com|\w{2}|com\.\w{2})/i;

      KindleReaderHandler.prototype.name = 'KindleWebReader';

      KindleReaderHandler.prototype.legacy = true;

      KindleReaderHandler.prototype.positions = {
        toolsMenu: {
          top: "55px"
        }
      };

      KindleReaderHandler.prototype.run = function() {
        var getRoot, lastUpdate, rootIndicator, target, update, updateFrequency, updateTargets, _i, _len,
          _this = this;
        this.working = true;
        updateFrequency = 300;
        lastUpdate = 0;
        rootIndicator = 0;
        getRoot = function(node) {
          while (node.parentNode) {
            node = node.parentNode;
          }
          return node;
        };
        update = function() {
          var $iframe, iframe, iframes, indicator, movedCount, newCount, next, node, now, queue, root, _i, _j, _len, _len1, _ref1;
          if (!_this.extension.autoUsageAllowed()) {
            return;
          }
          now = (new Date()).getTime();
          if (lastUpdate < now - updateFrequency) {
            if (document.querySelector("iframe#KindleReaderIFrame")) {
              iframes = document.querySelector("iframe#KindleReaderIFrame").contentDocument.querySelectorAll("iframe");
              movedCount = 0;
              newCount = 0;
              queue = [];
              for (_i = 0, _len = iframes.length; _i < _len; _i++) {
                iframe = iframes[_i];
                $iframe = $(iframe);
                if ($iframe.css('zIndex') === 'auto' || parseInt($iframe.css('zIndex')) >= 0) {
                  _ref1 = iframe.contentDocument.querySelectorAll("body > div");
                  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    node = _ref1[_j];
                    root = getRoot(node);
                    indicator = root.beelineRootIndicator || ("root-" + (rootIndicator++));
                    root.beelineRootIndicator = indicator;
                    if (node.getAttribute('data-beeline-indicator') !== ("on-" + indicator)) {
                      if (node.getAttribute('data-beeline-indicator')) {
                        movedCount++;
                      } else {
                        newCount++;
                      }
                      node.setAttribute('data-beeline-indicator', "on-" + indicator);
                      if ($(node).text()) {
                        queue.push([node, Math.abs($(node).offset().top)]);
                      }
                    }
                  }
                }
              }
              if (movedCount + newCount > 0) {
                queue = queue.sort(function(a, b) {
                  if (a[1] > b[1]) {
                    return 1;
                  } else if (a[1] < b[1]) {
                    return -1;
                  } else {
                    return 0;
                  }
                });
                next = function() {
                  var data, newBeeline;
                  data = queue.shift();
                  if (data) {
                    newBeeline = new BeeLineReader(data[0], {
                      skipBackgroundColor: true
                    });
                    _this.extension.addBeeline(newBeeline);
                    return newBeeline.color(next);
                  }
                };
                next();
                BeelineUtils.log("New: " + newCount + "; Moved: " + movedCount + "; Cleaned up: " + (_this.extension.cleanupOldBeelines()));
                _this.extension.gaTrack('special/KindleWebReader/sectionColored');
              }
              return lastUpdate = now;
            }
          }
        };
        setInterval(update, updateFrequency);
        if (document.querySelector("iframe#KindleReaderIFrame")) {
          updateTargets = document.querySelector("iframe#KindleReaderIFrame").contentDocument.querySelectorAll(".kindleReader_pageTurnArea");
          for (_i = 0, _len = updateTargets.length; _i < _len; _i++) {
            target = updateTargets[_i];
            target.addEventListener('click', update, false);
          }
        }
        return update();
      };

      return KindleReaderHandler;

    })(BeeLineReaderExtension.CustomHandler);
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.KivaZipHandler = (function(_super) {
    __extends(KivaZipHandler, _super);

    function KivaZipHandler() {
      _ref = KivaZipHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    KivaZipHandler.prototype.pattern = /^https?:\/\/(\w+\.)?zip\.kiva\.org(\.\w{2})?\/loans/i;

    KivaZipHandler.prototype.name = 'Kiva Zip';

    KivaZipHandler.prototype.legacy = true;

    KivaZipHandler.prototype.run = function() {
      return this.colorSelector(".answer, .story");
    };

    return KivaZipHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.LexisHandler = (function(_super) {
    __extends(LexisHandler, _super);

    function LexisHandler() {
      _ref = LexisHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LexisHandler.prototype.pattern = /^https?:\/\/(\w+\.)?lexis\.com\/research\/retrieve/i;

    LexisHandler.prototype.name = 'Lexis';

    LexisHandler.prototype.legacy = true;

    LexisHandler.prototype.positions = {
      toolsMenu: {
        right: "auto",
        left: "100px",
        top: "0px"
      }
    };

    LexisHandler.prototype.run = function() {
      return this.colorSelector("#bodystyle");
    };

    return LexisHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.LifehackerHandler = (function(_super) {
    __extends(LifehackerHandler, _super);

    function LifehackerHandler() {
      _ref = LifehackerHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LifehackerHandler.prototype.pattern = /^https?:\/\/(\w+\.)?lifehacker\.com(\.\w{2})?/i;

    LifehackerHandler.prototype.name = 'Lifehacker';

    LifehackerHandler.prototype.legacy = true;

    LifehackerHandler.prototype.run = function() {
      return this.colorSelector(".post-content, .replies-wrapper .reply-content");
    };

    return LifehackerHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.LinkedInHandler = (function(_super) {
    __extends(LinkedInHandler, _super);

    function LinkedInHandler() {
      _ref = LinkedInHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LinkedInHandler.prototype.pattern = /^https?:\/\/(\w+\.)?linkedin\.com(\.\w{2})?/i;

    LinkedInHandler.prototype.name = 'LinkedIn';

    LinkedInHandler.prototype.legacy = true;

    LinkedInHandler.prototype.positions = {
      toolsMenu: {
        top: "53px"
      }
    };

    LinkedInHandler.prototype.autoColor = function() {
      return typeof chrome !== "undefined" && chrome !== null;
    };

    LinkedInHandler.prototype.run = function() {
      return this.keepColoringSelector(".article-body, .comment-text, .summary, #background-experience");
    };

    return LinkedInHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.LivingWithADDHandler = (function(_super) {
    __extends(LivingWithADDHandler, _super);

    function LivingWithADDHandler() {
      _ref = LivingWithADDHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LivingWithADDHandler.prototype.pattern = /^https?:\/\/(\w+\.)?livingwithadd\.com(\.\w{2})?/i;

    LivingWithADDHandler.prototype.name = 'LivingWithADD';

    LivingWithADDHandler.prototype.legacy = true;

    LivingWithADDHandler.prototype.positions = {
      toolsMenu: {
        left: "30px",
        right: "auto",
        top: "15px"
      }
    };

    LivingWithADDHandler.prototype.run = function() {
      return this.colorSelector(".xj_canvas");
    };

    return LivingWithADDHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.MediumHandler = (function(_super) {
    __extends(MediumHandler, _super);

    function MediumHandler() {
      _ref = MediumHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MediumHandler.prototype.pattern = /^https?:\/\/(\w+\.)?medium\.com(\.\w{2})?/i;

    MediumHandler.prototype.name = 'Medium';

    MediumHandler.prototype.legacy = true;

    MediumHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px",
        top: "70px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    MediumHandler.prototype.run = function() {
      return this.keepColoringSelector(".postArticle-content > section:not(.is-darkBackgrounded) .section-inner:visible");
    };

    return MediumHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.NewselaHandler = (function(_super) {
    __extends(NewselaHandler, _super);

    function NewselaHandler() {
      _ref = NewselaHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewselaHandler.prototype.pattern = /^https?:\/\/(\w+\.)?newsela\.com\/articles/i;

    NewselaHandler.prototype.name = 'Newsela';

    NewselaHandler.prototype.legacy = true;

    NewselaHandler.prototype.run = function() {
      return this.keepColoringSelector("#Article");
    };

    return NewselaHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.NewYorkerHandler = (function(_super) {
    __extends(NewYorkerHandler, _super);

    function NewYorkerHandler() {
      _ref = NewYorkerHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewYorkerHandler.prototype.pattern = /^https?:\/\/(\w+\.)?newyorker.com(\.\w{2})?\/.+/i;

    NewYorkerHandler.prototype.name = 'New Yorker';

    NewYorkerHandler.prototype.legacy = true;

    NewYorkerHandler.prototype.run = function() {
      return this.colorSelector("#articleBody");
    };

    return NewYorkerHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.NiemanLab = (function(_super) {
    __extends(NiemanLab, _super);

    function NiemanLab() {
      _ref = NiemanLab.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NiemanLab.prototype.pattern = /^https?:\/\/(\w+\.)?niemanlab\.org(\.\w{2})?/i;

    NiemanLab.prototype.name = 'NiemanLab';

    NiemanLab.prototype.positions = {
      toolsMenu: {
        left: "5px",
        top: "5px"
      }
    };

    NiemanLab.prototype.run = function() {
      this.skip(".embed-relatedstory");
      return this.keepColoringSelector(".simple-body");
    };

    return NiemanLab;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.NiemanReportsHandler = (function(_super) {
    __extends(NiemanReportsHandler, _super);

    function NiemanReportsHandler() {
      _ref = NiemanReportsHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NiemanReportsHandler.prototype.pattern = /^https?:\/\/(\w+\.)?niemanreports\.org/i;

    NiemanReportsHandler.prototype.name = 'Nieman Reports';

    NiemanReportsHandler.prototype.run = function() {
      this.skip('.l-sidebar-item, .inline-sidebar, .article-img, .pullquote, .footnote');
      return this.colorSelector('.l-article-body, .issue-detail-desc, .teaser-txt, .issue-desc, .feed-tease-subhead');
    };

    return NiemanReportsHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.NPRHandler = (function(_super) {
    __extends(NPRHandler, _super);

    function NPRHandler() {
      _ref = NPRHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NPRHandler.prototype.pattern = /^https?:\/\/(\w+\.)?npr\.org(\.\w{2})?/i;

    NPRHandler.prototype.name = 'NPR';

    NPRHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px",
        top: "70px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    NPRHandler.prototype.run = function() {
      this.skip(".bucket, .byline");
      return this.colorSelector("#storytext, .teaser, .transcript.storytext");
    };

    return NPRHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.NyMagHandler = (function(_super) {
    __extends(NyMagHandler, _super);

    function NyMagHandler() {
      _ref = NyMagHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NyMagHandler.prototype.pattern = /^https?:\/\/(\w+\.)?nymag.com(\.\w{2})?/i;

    NyMagHandler.prototype.name = 'NY Magazine';

    NyMagHandler.prototype.legacy = true;

    NyMagHandler.prototype.run = function() {
      return this.colorSelector(".body");
    };

    return NyMagHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.NYTimesHandler = (function(_super) {
    __extends(NYTimesHandler, _super);

    function NYTimesHandler() {
      _ref = NYTimesHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NYTimesHandler.prototype.pattern = /^https?:\/\/(\w+\.)*nytimes\.com(\.\w{2})?/i;

    NYTimesHandler.prototype.name = 'NYTimes';

    NYTimesHandler.prototype.legacy = true;

    NYTimesHandler.prototype.positions = {
      toolsMenu: {
        top: "140px",
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    NYTimesHandler.prototype.run = function() {
      this.skip(".more-link");
      return this.colorSelector("#main article#story, #main article.post");
    };

    return NYTimesHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.OKCupidHandler = (function(_super) {
    __extends(OKCupidHandler, _super);

    function OKCupidHandler() {
      _ref = OKCupidHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    OKCupidHandler.prototype.pattern = /^https?:\/\/(\w+\.)?okcupid.com(\.\w{2})?\/profile/i;

    OKCupidHandler.prototype.name = 'OK Cupid';

    OKCupidHandler.prototype.legacy = true;

    OKCupidHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "10px",
        top: "53px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    OKCupidHandler.prototype.run = function() {
      return this.colorSelector(".essay");
    };

    return OKCupidHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.OpenStaxHandler = (function(_super) {
    __extends(OpenStaxHandler, _super);

    function OpenStaxHandler() {
      _ref = OpenStaxHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    OpenStaxHandler.prototype.pattern = /^https?:\/\/(\w+\.)?cnx\.org(\.\w{2})?\/contents/i;

    OpenStaxHandler.prototype.name = 'OpenStax';

    OpenStaxHandler.prototype.legacy = true;

    OpenStaxHandler.prototype.run = function() {
      this.skip("#problem");
      return this.keepColoringSelector(".media-body");
    };

    return OpenStaxHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return BeeLineReaderExtension.customHandlers.OverdriveHandler = (function(_super) {
      __extends(OverdriveHandler, _super);

      function OverdriveHandler() {
        _ref = OverdriveHandler.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      OverdriveHandler.prototype.pattern = /^https?:\/\/([\w-]+\.)?read\.overdrive\.com/i;

      OverdriveHandler.prototype.name = 'Overdrive';

      OverdriveHandler.prototype.legacy = true;

      OverdriveHandler.prototype.positions = {
        toolsMenu: {
          left: "5px"
        }
      };

      OverdriveHandler.prototype.disable = {
        backgrounds: true,
        openDyslexic: true
      };

      OverdriveHandler.prototype.run = function() {
        this.keepColoringSelector("body:visible", {
          skipGa: true,
          withinIframes: [".bounds > iframe:visible"]
        });
        return this.extension.gaTrack("special/" + this.name + "/bookColored");
      };

      return OverdriveHandler;

    })(BeeLineReaderExtension.CustomHandler);
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.OysterHandler = (function(_super) {
    __extends(OysterHandler, _super);

    function OysterHandler() {
      _ref = OysterHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    OysterHandler.prototype.pattern = /^https?:\/\/(\w+\.)?oysterbooks\.com(\.\w{2})?\/read/i;

    OysterHandler.prototype.name = 'Oyster Books';

    OysterHandler.prototype.positions = {
      toolsMenu: {
        left: "10px",
        top: "70px"
      }
    };

    OysterHandler.prototype.run = function() {
      return this.keepColoringSelector(".document-container");
    };

    return OysterHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.PocketHandler = (function(_super) {
    __extends(PocketHandler, _super);

    function PocketHandler() {
      _ref = PocketHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PocketHandler.prototype.pattern = /^https?:\/\/(\w+\.)?getpocket\.com/i;

    PocketHandler.prototype.name = 'Pocket';

    PocketHandler.prototype.legacy = true;

    PocketHandler.prototype.positions = {
      toolsMenu: {
        top: "85px"
      }
    };

    PocketHandler.prototype.run = function() {
      return this.keepColoringSelector(".reader_content .text_body > *");
    };

    return PocketHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.PostagonHandler = (function(_super) {
    __extends(PostagonHandler, _super);

    function PostagonHandler() {
      _ref = PostagonHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PostagonHandler.prototype.pattern = /^https?:\/\/[^\.]+\.postagon\.com/i;

    PostagonHandler.prototype.name = 'Postagon';

    PostagonHandler.prototype.run = function() {
      return this.colorSelector('.post-body, .site-p-body');
    };

    return PostagonHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.PosthavenHandler = (function(_super) {
    __extends(PosthavenHandler, _super);

    function PosthavenHandler() {
      _ref = PosthavenHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PosthavenHandler.prototype.pattern = /^https?:\/\/[^\.]+\.posthaven\.com/i;

    PosthavenHandler.prototype.name = 'Posthaven';

    PosthavenHandler.prototype.run = function() {
      return this.colorSelector('.post-body');
    };

    return PosthavenHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.PsychForumsHandler = (function(_super) {
    __extends(PsychForumsHandler, _super);

    function PsychForumsHandler() {
      _ref = PsychForumsHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PsychForumsHandler.prototype.pattern = /^https?:\/\/(\w+\.)?psychforums\.com(\.\w{2})?/i;

    PsychForumsHandler.prototype.name = 'PsychForums';

    PsychForumsHandler.prototype.legacy = true;

    PsychForumsHandler.prototype.positions = {
      toolsMenu: {
        left: "30px",
        right: "auto",
        top: "15px"
      }
    };

    PsychForumsHandler.prototype.run = function() {
      return this.colorSelector(".content");
    };

    return PsychForumsHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return BeeLineReaderExtension.customHandlers.PubMedHandler = (function(_super) {
      __extends(PubMedHandler, _super);

      function PubMedHandler() {
        _ref = PubMedHandler.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PubMedHandler.prototype.pattern = /^https?:\/\/(\w+\.)?ncbi\.nlm\.nih\.gov\/pmc\/articles\//i;

      PubMedHandler.prototype.name = 'PubMed';

      PubMedHandler.prototype.legacy = true;

      PubMedHandler.prototype.run = function() {
        if ($(".article.content").length) {
          return this.colorSelector(".article.content");
        } else {
          return this.colorSelector("p");
        }
      };

      return PubMedHandler;

    })(BeeLineReaderExtension.CustomHandler);
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.QuartzHandler = (function(_super) {
    __extends(QuartzHandler, _super);

    function QuartzHandler() {
      _ref = QuartzHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    QuartzHandler.prototype.pattern = /^https?:\/\/(\w+\.)?qz.com(\.\w{2})?/i;

    QuartzHandler.prototype.name = 'Quartz';

    QuartzHandler.prototype.legacy = true;

    QuartzHandler.prototype.positions = {
      toolsMenu: {
        top: "64px"
      }
    };

    QuartzHandler.prototype.run = function() {
      return this.keepColoringSelector(".item-body");
    };

    return QuartzHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.QuoraHandler = (function(_super) {
    __extends(QuoraHandler, _super);

    function QuoraHandler() {
      _ref = QuoraHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    QuoraHandler.prototype.pattern = /^https?:\/\/(\w+\.)?quora.com(\.\w{2})?/i;

    QuoraHandler.prototype.name = 'Quora';

    QuoraHandler.prototype.legacy = true;

    QuoraHandler.prototype.positions = {
      toolsMenu: {
        top: "5px"
      }
    };

    QuoraHandler.prototype.run = function() {
      return this.keepColoringSelector(".Answer, .feed_item_answer, .answer_text, .expanded_q_text");
    };

    return QuoraHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ReadabilityHandler = (function(_super) {
    __extends(ReadabilityHandler, _super);

    function ReadabilityHandler() {
      _ref = ReadabilityHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ReadabilityHandler.prototype.pattern = /^https?:\/\/(\w+\.)?readability\.com\/articles/i;

    ReadabilityHandler.prototype.name = 'Readability';

    ReadabilityHandler.prototype.legacy = true;

    ReadabilityHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "12px",
        top: "12px"
      },
      configurationPane: {
        left: "-160px",
        position: "relative"
      }
    };

    ReadabilityHandler.prototype.run = function() {
      return this.colorSelector("#story_text");
    };

    return ReadabilityHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.readTheoryHandler = (function(_super) {
    __extends(readTheoryHandler, _super);

    function readTheoryHandler() {
      _ref = readTheoryHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    readTheoryHandler.prototype.pattern = /^https?:\/\/(\w+\.)?readtheory\.org(\.\w{2})?\/reading\/.+/i;

    readTheoryHandler.prototype.name = 'Read Theory';

    readTheoryHandler.prototype.legacy = true;

    readTheoryHandler.prototype.positions = {
      toolsMenu: {
        left: "15px",
        top: "75px"
      }
    };

    readTheoryHandler.prototype.run = function() {
      return this.keepColoringSelector("#presentPassage-content-passage, #presentQuiz-section-information.contentBox");
    };

    return readTheoryHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.RedditHandler = (function(_super) {
    __extends(RedditHandler, _super);

    function RedditHandler() {
      _ref = RedditHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RedditHandler.prototype.pattern = /^https?:\/\/(\w+\.)?reddit\.com(\.\w{2})?/i;

    RedditHandler.prototype.name = 'Reddit';

    RedditHandler.prototype.legacy = true;

    RedditHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    RedditHandler.prototype.run = function() {
      this.skip(".titlebox, .side");
      return this.colorSelector(".usertext-body");
    };

    return RedditHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ReutersHandler = (function(_super) {
    __extends(ReutersHandler, _super);

    function ReutersHandler() {
      _ref = ReutersHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ReutersHandler.prototype.pattern = /^https?:\/\/(\w+\.)?reuters\.com(\.\w{2})?/i;

    ReutersHandler.prototype.name = 'Reuters';

    ReutersHandler.prototype.legacy = true;

    ReutersHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    ReutersHandler.prototype.run = function() {
      return this.colorSelector("#articleText");
    };

    return ReutersHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.RollingStoneHandler = (function(_super) {
    __extends(RollingStoneHandler, _super);

    function RollingStoneHandler() {
      _ref = RollingStoneHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RollingStoneHandler.prototype.pattern = /^https?:\/\/(\w+\.)?rollingstone.com(\.\w{2})?/i;

    RollingStoneHandler.prototype.name = 'Rolling Stone';

    RollingStoneHandler.prototype.legacy = true;

    RollingStoneHandler.prototype.run = function() {
      return this.colorSelector(".article-content");
    };

    return RollingStoneHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.SacBeeHandler = (function(_super) {
    __extends(SacBeeHandler, _super);

    function SacBeeHandler() {
      _ref = SacBeeHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SacBeeHandler.prototype.pattern = /^https?:\/\/(\w+\.)?SacBee\.com/i;

    SacBeeHandler.prototype.name = 'SacBee';

    SacBeeHandler.prototype.positions = {
      toolsMenu: {
        left: "12px",
        right: "auto",
        top: "12px"
      }
    };

    SacBeeHandler.prototype.run = function() {
      return this.colorSelector("#story-target");
    };

    return SacBeeHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.Scholastic = (function(_super) {
    __extends(Scholastic, _super);

    function Scholastic() {
      _ref = Scholastic.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Scholastic.prototype.pattern = /^https?:\/\/(\w+\.)?magazines\.scholastic\.com(\.\w{2})?\/news/i;

    Scholastic.prototype.name = 'Scholastic';

    Scholastic.prototype.positions = {
      toolsMenu: {
        left: "5px",
        top: "1px"
      }
    };

    Scholastic.prototype.run = function() {
      return this.keepColoringSelector(".articleText");
    };

    return Scholastic;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.SecHandler = (function(_super) {
    __extends(SecHandler, _super);

    function SecHandler() {
      _ref = SecHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SecHandler.prototype.pattern = /^https?:\/\/(\w+\.)?sec\.gov\/Archives\/edgar/i;

    SecHandler.prototype.name = 'SEC Archives';

    SecHandler.prototype.legacy = true;

    SecHandler.prototype.matches = function() {
      return BeelineUtils.urlMatches(this.pattern) && !BeelineUtils.urlMatches(/index\.htm/);
    };

    SecHandler.prototype.run = function() {
      this.skip("table:not(:contains('•'))");
      return this.colorSelector("body");
    };

    return SecHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {


}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ShmoopHandler = (function(_super) {
    __extends(ShmoopHandler, _super);

    function ShmoopHandler() {
      _ref = ShmoopHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ShmoopHandler.prototype.pattern = /^https?:\/\/(\w+\.)?shmoop\.com/i;

    ShmoopHandler.prototype.name = 'Shmoop';

    ShmoopHandler.prototype.legacy = true;

    ShmoopHandler.prototype.run = function() {
      return this.colorSelector("#div_PrimaryContent");
    };

    return ShmoopHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.SlateHandler = (function(_super) {
    __extends(SlateHandler, _super);

    function SlateHandler() {
      _ref = SlateHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SlateHandler.prototype.pattern = /^https?:\/\/(\w+\.)?slate.com(\.\w{2})?\/articles/i;

    SlateHandler.prototype.name = 'Slate';

    SlateHandler.prototype.legacy = true;

    SlateHandler.prototype.positions = {
      toolsMenu: {
        top: "1px"
      }
    };

    SlateHandler.prototype.run = function() {
      return this.colorSelector(".text");
    };

    return SlateHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return BeeLineReaderExtension.customHandlers.SpiegelHandler = (function(_super) {
      __extends(SpiegelHandler, _super);

      function SpiegelHandler() {
        _ref = SpiegelHandler.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      SpiegelHandler.prototype.pattern = /^https?:\/\/(\w+\.)?spiegel(\.\w{2})/i;

      SpiegelHandler.prototype.name = 'Spiegel';

      SpiegelHandler.prototype.legacy = true;

      SpiegelHandler.prototype.positions = {
        toolsMenu: {
          left: "auto",
          right: "20px"
        },
        configurationPane: {
          left: "-185px",
          position: "relative"
        }
      };

      SpiegelHandler.prototype.run = function() {
        $(".spCommercial").remove();
        return this.colorSelector(".article-section");
      };

      return SpiegelHandler;

    })(BeeLineReaderExtension.CustomHandler);
  })(beelinejquery);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return BeeLineReaderExtension.customHandlers.SquarespaceHandler = (function(_super) {
      __extends(SquarespaceHandler, _super);

      function SquarespaceHandler() {
        _ref = SquarespaceHandler.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      SquarespaceHandler.prototype.matches = function() {
        var _ref1;
        return (_ref1 = $('head').html()) != null ? _ref1.match(/This is Squarespace/) : void 0;
      };

      SquarespaceHandler.prototype.name = 'Squarespace';

      SquarespaceHandler.prototype.positions = {
        toolsMenu: {
          left: "auto",
          right: "20px",
          top: "70px"
        },
        configurationPane: {
          left: "-185px",
          position: "relative"
        }
      };

      SquarespaceHandler.prototype.run = function() {
        return this.keepColoringSelector(".sqs-block-content");
      };

      return SquarespaceHandler;

    })(BeeLineReaderExtension.CustomHandler);
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.CornellLawHandler = (function(_super) {
    __extends(CornellLawHandler, _super);

    function CornellLawHandler() {
      _ref = CornellLawHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CornellLawHandler.prototype.pattern = /^https?:\/\/(\w+\.)?papers\.ssrn\.com/i;

    CornellLawHandler.prototype.name = 'SSRN';

    CornellLawHandler.prototype.legacy = true;

    CornellLawHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px",
        top: "20px"
      },
      configurationPane: {
        left: "-160px",
        position: "relative"
      }
    };

    CornellLawHandler.prototype.run = function() {
      return this.colorSelector("#abstract");
    };

    return CornellLawHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.TechCrunchHandler = (function(_super) {
    __extends(TechCrunchHandler, _super);

    function TechCrunchHandler() {
      _ref = TechCrunchHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TechCrunchHandler.prototype.pattern = /^https?:\/\/(\w+\.)?techcrunch\.com?(\.\w{2})?/i;

    TechCrunchHandler.prototype.name = 'TechCrunch';

    TechCrunchHandler.prototype.legacy = true;

    TechCrunchHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "25px",
        top: "23px"
      },
      configurationPane: {
        left: "-135px",
        position: "relative"
      }
    };

    TechCrunchHandler.prototype.run = function() {
      return this.colorSelector(".article-entry.text");
    };

    return TechCrunchHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.TechwebHandler = (function(_super) {
    __extends(TechwebHandler, _super);

    function TechwebHandler() {
      _ref = TechwebHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TechwebHandler.prototype.pattern = /^https?:\/\/(\w+\.)?techweb\.com(\.\w{2})?/i;

    TechwebHandler.prototype.name = 'Techweb.com.cn';

    TechwebHandler.prototype.legacy = true;

    TechwebHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-165px",
        position: "relative"
      }
    };

    TechwebHandler.prototype.run = function() {
      return this.colorSelector("#artibody, #articleBodies");
    };

    return TechwebHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.TheBigRoundtableHandler = (function(_super) {
    __extends(TheBigRoundtableHandler, _super);

    function TheBigRoundtableHandler() {
      _ref = TheBigRoundtableHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TheBigRoundtableHandler.prototype.pattern = /^https?:\/\/(\w+\.)?thebigroundtable.com(\.\w{2})?\/stories/i;

    TheBigRoundtableHandler.prototype.name = 'The Big Roundtable';

    TheBigRoundtableHandler.prototype.legacy = true;

    TheBigRoundtableHandler.prototype.run = function() {
      return this.colorSelector(".story-page-text");
    };

    return TheBigRoundtableHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.DailyBeastHandler = (function(_super) {
    __extends(DailyBeastHandler, _super);

    function DailyBeastHandler() {
      _ref = DailyBeastHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DailyBeastHandler.prototype.pattern = /^https?:\/\/(\w+\.)?thedailybeast.com(\.\w{2})?\/articles/i;

    DailyBeastHandler.prototype.name = 'The Daily Beast';

    DailyBeastHandler.prototype.legacy = true;

    DailyBeastHandler.prototype.positions = {
      toolsMenu: {
        left: "2px",
        top: "2px"
      }
    };

    DailyBeastHandler.prototype.run = function() {
      this.skip(".safe-area");
      return this.colorSelector(".content-body");
    };

    return DailyBeastHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.TheGuardianHandler = (function(_super) {
    __extends(TheGuardianHandler, _super);

    function TheGuardianHandler() {
      _ref = TheGuardianHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TheGuardianHandler.prototype.pattern = /^https?:\/\/(\w+\.)?theguardian\.com?(\.\w{2})?/i;

    TheGuardianHandler.prototype.name = 'TheGuardian';

    TheGuardianHandler.prototype.legacy = true;

    TheGuardianHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-158px",
        position: "relative"
      }
    };

    TheGuardianHandler.prototype.run = function() {
      return this.colorSelector("#article-wrapper, .flexible-content, .content__article-body");
    };

    return TheGuardianHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.TheVergeHandler = (function(_super) {
    __extends(TheVergeHandler, _super);

    function TheVergeHandler() {
      _ref = TheVergeHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TheVergeHandler.prototype.pattern = /^https?:\/\/(\w+\.)?theverge\.com(\.\w{2})?/i;

    TheVergeHandler.prototype.name = 'TheVerge';

    TheVergeHandler.prototype.legacy = true;

    TheVergeHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-135px",
        position: "relative"
      }
    };

    TheVergeHandler.prototype.run = function() {
      this.skip(".photo-essay");
      return this.colorSelector("#article-body, .entry-content, .entry-summary, #feature-body, .m-feature__body, .m-feature__intro");
    };

    return TheVergeHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.TimeHandler = (function(_super) {
    __extends(TimeHandler, _super);

    function TimeHandler() {
      _ref = TimeHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TimeHandler.prototype.pattern = /^https?:\/\/(\w+\.)?time\.com(\.\w{2})?/i;

    TimeHandler.prototype.name = 'Time';

    TimeHandler.prototype.legacy = true;

    TimeHandler.prototype.positions = {
      toolsMenu: {
        top: "100px",
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    TimeHandler.prototype.run = function() {
      return this.keepColoringSelector(".article-body");
    };

    return TimeHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.TopLawSchoolsVisionHandler = (function(_super) {
    __extends(TopLawSchoolsVisionHandler, _super);

    function TopLawSchoolsVisionHandler() {
      _ref = TopLawSchoolsVisionHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TopLawSchoolsVisionHandler.prototype.pattern = /^https?:\/\/(\w+\.)?top\-law\-schools\.com\/forums/i;

    TopLawSchoolsVisionHandler.prototype.name = 'Top Law Schools';

    TopLawSchoolsVisionHandler.prototype.legacy = true;

    TopLawSchoolsVisionHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "25px",
        top: "15px"
      },
      configurationPane: {
        left: "-160px",
        position: "relative"
      }
    };

    TopLawSchoolsVisionHandler.prototype.run = function() {
      return this.colorSelector(".postbody");
    };

    return TopLawSchoolsVisionHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.TumblrHandler = (function(_super) {
    __extends(TumblrHandler, _super);

    function TumblrHandler() {
      _ref = TumblrHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TumblrHandler.prototype.pattern = /^https?:\/\/([\-\w]+\.)?tumblr\.com(\.\w{2})?/i;

    TumblrHandler.prototype.name = 'Tumblr';

    TumblrHandler.prototype.legacy = true;

    TumblrHandler.prototype.positions = {
      toolsMenu: {
        left: "18px",
        right: "auto",
        top: "60px"
      }
    };

    TumblrHandler.prototype.run = function() {
      return this.keepColoringSelector("#entry, .description_inner, article, .caption, .post_content", {
        beelineOptions: {
          handleResize: false
        }
      });
    };

    return TumblrHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.UtilityDiveHandler = (function(_super) {
    __extends(UtilityDiveHandler, _super);

    function UtilityDiveHandler() {
      _ref = UtilityDiveHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    UtilityDiveHandler.prototype.pattern = /^https?:\/\/(\w+\.)?utilitydive\.com/i;

    UtilityDiveHandler.prototype.name = 'Utility Dive';

    UtilityDiveHandler.prototype.run = function() {
      this.skip('.addthis_toolbox.share-btns.share-bottom, .credits-box');
      return this.colorSelector('.brief-article, #feature-body');
    };

    return UtilityDiveHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.ViceHandler = (function(_super) {
    __extends(ViceHandler, _super);

    function ViceHandler() {
      _ref = ViceHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ViceHandler.prototype.pattern = /^https?:\/\/(\w+\.)?vice.com(\.\w{2})?/i;

    ViceHandler.prototype.name = 'Vice';

    ViceHandler.prototype.legacy = true;

    ViceHandler.prototype.positions = {
      toolsMenu: {
        top: "58px"
      }
    };

    ViceHandler.prototype.run = function() {
      return this.colorSelector(".article_content, .article-content");
    };

    return ViceHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.WashingtonPostHandler = (function(_super) {
    __extends(WashingtonPostHandler, _super);

    function WashingtonPostHandler() {
      _ref = WashingtonPostHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    WashingtonPostHandler.prototype.pattern = /^https?:\/\/(\w+\.)?washingtonpost\.com(\.\w{2})?/i;

    WashingtonPostHandler.prototype.name = 'WashingtonPost';

    WashingtonPostHandler.prototype.legacy = true;

    WashingtonPostHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    WashingtonPostHandler.prototype.run = function() {
      this.colorSelector(".article-body, .body.single-post");
      return this.colorSelector(".container.background");
    };

    return WashingtonPostHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.WikiMediaHandler = (function(_super) {
    __extends(WikiMediaHandler, _super);

    function WikiMediaHandler() {
      _ref = WikiMediaHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    WikiMediaHandler.prototype.matches = function() {
      return document.querySelector("head > meta[name='generator'][content^='MediaWiki']");
    };

    WikiMediaHandler.prototype.name = 'WikiMedia';

    WikiMediaHandler.prototype.run = function() {
      this.skip("h2, #toc, .infobox, .reflist, .thumbinner, #editform, form");
      return this.colorSelector("#mw-content-text, #bodycontents");
    };

    return WikiMediaHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.WikipediaHandler = (function(_super) {
    __extends(WikipediaHandler, _super);

    function WikipediaHandler() {
      _ref = WikipediaHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    WikipediaHandler.prototype.pattern = /^https?:\/\/(\w+\.)?wikipedia\.org(\.\w{2})?/i;

    WikipediaHandler.prototype.name = 'Wikipedia';

    WikipediaHandler.prototype.legacy = true;

    WikipediaHandler.prototype.run = function() {
      this.skip("h2, #toc, .infobox, .reflist, .thumbinner, #editform, form");
      return this.colorSelector("#mw-content-text");
    };

    return WikipediaHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {


}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.WordPressHandler = (function(_super) {
    __extends(WordPressHandler, _super);

    function WordPressHandler() {
      _ref = WordPressHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    WordPressHandler.prototype.matches = function() {
      var exclusions;
      exclusions = /https?:\/\/(\w+\.)?nypost\.com/i;
      return document.querySelector("head > meta[name='generator'][content^='WordPress']") && !BeelineUtils.urlMatches(exclusions);
    };

    WordPressHandler.prototype.name = 'WordPress';

    WordPressHandler.prototype.run = function() {
      return this.colorSelector(".entry-content, .post-content, .columns.large-9.entry-content, #content");
    };

    return WordPressHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var _ref;
    return BeeLineReaderExtension.customHandlers.WordpressYoastHandler = (function(_super) {
      __extends(WordpressYoastHandler, _super);

      function WordpressYoastHandler() {
        _ref = WordpressYoastHandler.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      WordpressYoastHandler.prototype.matches = function() {
        return $('head').html().match(/Yoast WordPress SEO/);
      };

      WordpressYoastHandler.prototype.name = 'Wordpress Yoast';

      WordpressYoastHandler.prototype.positions = {
        toolsMenu: {
          left: "auto",
          right: "20px",
          top: "70px"
        },
        configurationPane: {
          left: "-185px",
          position: "relative"
        }
      };

      WordpressYoastHandler.prototype.run = function() {
        return this.keepColoringSelector(".entry-content, .innerblogpost");
      };

      return WordpressYoastHandler;

    })(BeeLineReaderExtension.CustomHandler);
  })(beelinejquery);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.WSJHandler = (function(_super) {
    __extends(WSJHandler, _super);

    function WSJHandler() {
      _ref = WSJHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    WSJHandler.prototype.pattern = /^https?:\/\/(\w+\.)?wsj\.com(\.\w{2})?/i;

    WSJHandler.prototype.name = 'WSJ';

    WSJHandler.prototype.legacy = true;

    WSJHandler.prototype.run = function() {
      return this.colorSelector("#wsj-article-wrap, .post-content");
    };

    return WSJHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.YelpHandler = (function(_super) {
    __extends(YelpHandler, _super);

    function YelpHandler() {
      _ref = YelpHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    YelpHandler.prototype.pattern = /^https?:\/\/(\w+\.)?yelp\.com/i;

    YelpHandler.prototype.name = 'Yelp';

    YelpHandler.prototype.run = function() {
      this.skip('.biz-rating.biz-rating-very-large.clearfix, .review_tags, .review-footer.clearfix, .photo-box-grid.clearfix.js-content-expandable, .rateReview.voting-feedback');
      return this.colorSelector('.review-content, .item-description');
    };

    return YelpHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);

/*
  Copyright 2015, Andrew Cantino and Nicholas Lum, all rights reserved.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BeeLineReaderExtension.customHandlers.YicaiHandler = (function(_super) {
    __extends(YicaiHandler, _super);

    function YicaiHandler() {
      _ref = YicaiHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    YicaiHandler.prototype.pattern = /^https?:\/\/(\w+\.)?yicai\.com(\.\w{2})?/i;

    YicaiHandler.prototype.name = 'Yicai';

    YicaiHandler.prototype.legacy = true;

    YicaiHandler.prototype.positions = {
      toolsMenu: {
        left: "auto",
        right: "20px"
      },
      configurationPane: {
        left: "-185px",
        position: "relative"
      }
    };

    YicaiHandler.prototype.run = function() {
      return this.colorSelector(".articleContent");
    };

    return YicaiHandler;

  })(BeeLineReaderExtension.CustomHandler);

}).call(this);
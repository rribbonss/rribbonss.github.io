if (typeof window.BeeLineFirefoxUtils == 'undefined') {
  window.BeeLineFirefoxUtils = {
    pathCache: {},

    checkPathAndCallback: function (checkPath, callback) {
      var interval = setInterval(function () {
        var ref = window;
        for (var i = 0; i < checkPath.length; i++) {
          ref = ref && ref[checkPath[i]];
        }
        if (ref) {
          clearInterval(interval);
          callback();
        }
      }, 20);
    },

    load: function(path, checkPath, callback) {
      if (this.pathCache[path]) {
        return typeof callback === "function" ? callback() : void 0;
      } else {
        this.pathCache[path] = true;
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('charset', 'UTF-8');
        script.setAttribute('data-readability-skip', 'true');
        script.setAttribute('src', "resource://beelinereader/" + path);
        document.getElementsByTagName('head')[0].appendChild(script);
        if (checkPath && callback) {
          this.checkPathAndCallback(checkPath, callback);
        }
      }
    }
  };
}
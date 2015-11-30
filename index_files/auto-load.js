(function() {
  var interval = window.setInterval(function() {
    if(window.BeeLineFirefoxUtils) {
      window.clearInterval(interval);

      BeeLineFirefoxUtils.load("vendor/jquery-2.1.3.min.js", ["beelinejquery"], function() {
        BeeLineFirefoxUtils.load("firefox.js", ["BeeLineReaderFirefox"], function() {
          window.BeeLineReaderFirefox.shouldAutoStart(function(shouldLaunch) {
            if (shouldLaunch) {
              BeeLineFirefoxUtils.load("vendor/readability.js");
              BeeLineFirefoxUtils.load("vendor/spectrum.js");
              BeeLineFirefoxUtils.load("vendor/magnific-popup/jquery.magnific-popup.min.js", ["beelinejquery", "fn", "magnificPopup"], function() {
                window.BeeLineReaderFirefox.autoStart();
              });
            }
          });
        });
      });

    }
  }, 50);
})();

(function($) {
  $.fn.shortenText = function(config) {
    var defaults = {
      cut: 'end', // begin, middle, end
      reduce: 1,
      resize: true,
      symbol: '...'
    };

    var options = $.extend(defaults, config);

    var ShortenText = {
      init: function($target) {
        $target.attr('data-original-text', $target.text());
        $target.css({overflow: 'hidden'});
      },
      execute: function($target) {
        var text = $target.attr('data-original-text');

        // append invisible clone
        var $clone = $target.clone();
        $clone
          .css({
            display: 'none',
            position: 'absolute',
            overflow: 'visible'
          })
          .width($target.width)
          .height('auto')
          .text(text);
        $target.after($clone);

        // shorten text
        var rawText = text, shortened = text;
        if ($clone.height() > $target.height()) {
          while(text.length > 0 && $clone.height() > $target.height()) {
            result = this.shorten(rawText);
            rawText = result[0], shortened = result[1];
            $clone.text(shortened);
          }
          // 2回やると安心
          result = this.shorten(rawText);
          rawText = result[0], shortened = result[1];
        }
        $target.text(shortened);
        $clone.remove();
      },
      shorten: function(text) {
        var rawText, shortened;
        if (options.cut === 'begin') {
          rawText = text.slice(options.reduce, text.length);
          shortened = options.symbol + rawText;
        } else if (options.cut === 'middle') {
          shortened = [
            text.slice(0, ~~((text.length-options.reduce)/2)),
            options.symbol,
            text.slice(~~((text.length-options.reduce)/2)+options.reduce, text.length)
          ];
          rawText = shortened[0] + shortened[2];
          shortened = shortened.join('');
        } else {
          rawText = text.slice(0, text.length - options.reduce);
          shortened = rawText + options.symbol;
        }

        return [rawText, shortened];
      }
    };

    return this.each(function() {
      var $target = $(this);

      ShortenText.init($target);
      ShortenText.execute($target);

      if (options.resize) {
      var timerId = null;
        $(window).on('resize', function() {
          if (timerId) {
            clearTimeout(timerId);
          }

          timerId = setTimeout(function() {
            ShortenText.execute($target);
          }, 100);
        });
      }
    });
  };
})(jQuery);

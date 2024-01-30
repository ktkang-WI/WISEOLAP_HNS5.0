import ace from 'ace-builds/src-noconflict/ace';

ace.define('ace/mode/custom_highlight_rules', function(require, exports) {
  const oop = require('ace/lib/oop');
  const TextHighlightRules =
   require('ace/mode/text_highlight_rules').TextHighlightRules;

  const CustomHighlightRules = function() {
    this.$rules = {
      start: [
        {
          token: 'keyword',
          regex: /\[([^\]]+)]/
        }
      ]
    };
  };

  oop.inherits(CustomHighlightRules, TextHighlightRules);

  exports.CustomHighlightRules = CustomHighlightRules;
});

ace.define('ace/mode/custom', function(require, exports) {
  const oop = require('ace/lib/oop');
  const TextMode = require('ace/mode/text').Mode;
  const CustomHighlightRules =
   require('ace/mode/custom_highlight_rules').CustomHighlightRules;

  const Mode = function() {
    this.HighlightRules = CustomHighlightRules;
  };

  oop.inherits(Mode, TextMode);

  (function() {
    this.$id = 'ace/mode/custom';
  }.call(Mode.prototype));

  exports.Mode = Mode;
});

// Generated by CoffeeScript 1.3.1

/*

  Usage example:

  Click button first time
    + state: recording
    + enable Node::Actions
    + look for input and record it
    + if more than one input within same form
      try to scope it (Node::Finders)

  Click button second time
    + state: confirming
    + enable Node::Matchers
    + clicking an element will test for
      the existence of the selector
    + text selection will test for the
      content

  Click button third time
    + state: printing
    + background script copys all strings
      to clipboard

  Click button fourth time
    + state: off
    + full reset
*/


(function() {
  var Capycorder,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Capycorder = (function() {
    var TEMPLATES;

    Capycorder.name = 'Capycorder';

    Capycorder.prototype.state = 'off';

    Capycorder.prototype.namespace = 'capycorder';

    function Capycorder() {
      this.clickLink = __bind(this.clickLink, this);

      this.select = __bind(this.select, this);

      this.fillIn = __bind(this.fillIn, this);

      this.clickButton = __bind(this.clickButton, this);

      this.choose = __bind(this.choose, this);

      this.uncheck = __bind(this.uncheck, this);

      this.check = __bind(this.check, this);

      this.attachFile = __bind(this.attachFile, this);
      this.locator = new LocatorGenerator;
      this.highlighter = new SelectionBox;
    }

    Capycorder.prototype.setTabURL = function(url) {
      return this.tabURL = url;
    };

    Capycorder.prototype.switchState = function(state) {
      switch (state) {
        case 'recording':
          this._attachRecordingEvents();
          break;
        case 'confirming':
          this._detachRecordingEvents();
          this._attachConfirmingEvents();
          this._enableHighlighting();
          break;
        case 'printing':
          this._detachConfirmingEvents();
          Clipboard.copy(this.getCapybaraMethods());
          break;
        case 'off':
          this.reset();
      }
      return this.state = state;
    };

    Capycorder.prototype.reset = function() {};

    Capycorder.prototype.bind = function(event, callback) {
      return $(document).on([event, this.namespace].join('.'), callback);
    };

    Capycorder.prototype.trigger = function(event, data) {
      return $(document).trigger([event, this.namespace].join('.'), [data]);
    };

    Capycorder.prototype._enableHighlighting = function() {
      var _this = this;
      return $(document).on(['mousemove', this.namespace].join('.'), function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('body').css('cursor', 'crosshair');
        return _this.highlighter.highlight(e.target);
      });
    };

    Capycorder.prototype._disableHighlighting = function() {
      $(document).off(['mousemove', this.namespace].join('.'));
      $('body').css('cursor', '');
      return this.highlighter.hide();
    };

    Capycorder.prototype._attachRecordingEvents = function() {
      var _this = this;
      $('input[type=file]').on('change', function(e) {
        return _this.attachFile($(e.currentTarget));
      });
      $('input[type=checkbox]').on('change', function(e) {
        return _this.check($(e.currentTarget));
      });
      $('input[type=radio]').on('click', function(e) {
        return _this.choose($(e.currentTarget));
      });
      $(['input[type=submit]', 'input[type=reset]', 'input[type=button]', 'button'].join(',')).on('click', function(e) {
        return _this.clickButton($(e.currentTarget));
      });
      $('a').on('click', function(e) {
        return _this.clickLink($(e.currentTarget));
      });
      $(['input[type=text]', 'input[type=password]', 'input[type=email]', 'input[type=search]', 'textarea'].join(',')).on('keyup', function(e) {
        return _this.fillIn($(e.currentTarget));
      });
      return $('select').on('change', function(e) {
        return _this.select($(e.currentTarget));
      });
    };

    Capycorder.prototype._detachRecordingEvents = function() {};

    Capycorder.prototype._attachConfirmingEvents = function() {
      var _this = this;
      return $(document).on('mouseup', function(e) {
        return _this.shouldHaveSelector($(e.target));
      });
    };

    Capycorder.prototype._detachConfirmingEvents = function() {};

    Capycorder.prototype._capturedActions = [];

    Capycorder.prototype._captureAction = function(name, locator, options) {
      if (options == null) {
        options = {};
      }
      return this._capturedActions.push({
        name: name,
        locator: locator,
        options: options
      });
    };

    Capycorder.prototype._defaultInputLocatorMethods = ['name', 'id', 'label'];

    Capycorder.prototype._formScope = function($el) {
      var $form;
      if (($form = $el.parents('form')).length) {
        return this.locator.generate($form, ['id']);
      } else {
        return null;
      }
    };

    Capycorder.prototype.attachFile = function($el) {
      var locator;
      locator = this.locator.generate($el, this._defaultInputLocatorMethods);
      return this._captureAction('attachFile', locator, {
        file: $el.val(),
        scope: this._formScope($el)
      });
    };

    Capycorder.prototype.check = function($el) {
      var locator;
      if ($el.is(':checked')) {
        locator = this.locator.generate($el, this._defaultInputLocatorMethods);
        return this._captureAction('check', locator, {
          scope: this._formScope($el)
        });
      } else {
        return this.uncheck($el);
      }
    };

    Capycorder.prototype.uncheck = function($el) {
      var locator;
      locator = this.locator.generate($el, this._defaultInputLocatorMethods);
      return this._captureAction('uncheck', locator, {
        scope: this._formScope($el)
      });
    };

    Capycorder.prototype.choose = function($el) {
      var locator;
      locator = this.locator.generate($el, 'label id name'.split(' '));
      return this._captureAction('choose', locator, {
        scope: this._formScope($el)
      });
    };

    Capycorder.prototype.clickButton = function($el) {
      var locator;
      locator = this.locator.generate($el, 'id text value'.split(' '));
      return this._captureAction('clickButton', locator, {
        scope: this._formScope($el)
      });
    };

    Capycorder.prototype.fillIn = function($el) {
      var locator, previous;
      locator = this.locator.generate($el, this._defaultInputLocatorMethods);
      previous = _.last(this._capturedActions);
      if (previous && previous.name === 'fillIn' && previous.locator === locator) {
        return previous.options["with"] = $el.val();
      } else {
        return this._captureAction('fillIn', locator, {
          "with": $el.val(),
          scope: this._formScope($el)
        });
      }
    };

    Capycorder.prototype.select = function($el) {
      var locator;
      locator = this.locator.generate($el, this._defaultInputLocatorMethods);
      return this._captureAction('select', $el.val(), {
        from: locator,
        scope: this._formScope($el)
      });
    };

    Capycorder.prototype.clickLink = function($el) {
      var locator;
      locator = this.locator.generate($el, 'id text imgAlt'.split(' '));
      return this._captureAction('clickLink', locator, {
        scope: this._formScope($el)
      });
    };

    Capycorder.prototype._confirmedElements = [];

    Capycorder.prototype._confirmElement = function(name, selector, options) {
      if (options == null) {
        options = {};
      }
      return this._confirmedElements.push({
        name: name,
        selector: selector,
        options: options
      });
    };

    Capycorder.prototype.shouldHaveSelector = function($el) {
      var selection, selector;
      selection = window.getSelection().toString();
      if (selection.length) {
        return this.shouldHaveContent($el, selection);
      } else {
        selector = $el.getSelector();
        return this._confirmElement('shouldHaveSelector', selector);
      }
    };

    Capycorder.prototype.shouldHaveContent = function($el, content) {
      return this._confirmElement('shouldHaveContent', content);
    };

    Capycorder.prototype.withinForm = function($elements) {};

    TEMPLATES = {
      attachFile: function(a) {
        return "attach_file('" + a.locator + "', '" + a.options.file + "')";
      },
      check: function(a) {
        return "check('" + a.locator + "')";
      },
      uncheck: function(a) {
        return "uncheck('" + a.locator + "')";
      },
      choose: function(a) {
        return "choose('" + a.locator + "')";
      },
      clickButton: function(a) {
        return "click_button('" + a.locator + "')";
      },
      fillIn: function(a) {
        return "fill_in('" + a.locator + "', :with => '" + a.options["with"] + "')";
      },
      select: function(a) {
        return "select('" + a.locator + "', :from => '" + a.options.from + "')";
      },
      clickLink: function(a) {
        return "click_link('" + a.locator + "')";
      },
      withinForm: function(s) {
        return ["within_form('" + s + "') do", "end"];
      },
      visitPath: function(p) {
        return "visit('" + p + "')";
      },
      shouldHaveSelector: function(s) {
        return "page.should have_selector('" + s + "')";
      },
      shouldHaveContent: function(c) {
        return "page.should have_content('" + c + "')";
      },
      it: function() {
        return ["it 'DOESSOMETHING' do", "end"];
      }
    };

    Capycorder.prototype._parseURL = function(url) {
      var a;
      a = document.createElement('a');
      a.href = url;
      return a;
    };

    Capycorder.prototype.getCapybaraMethods = function() {
      var action, element, indent, path, scope, string, strings, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      _ref = [[], '  '], strings = _ref[0], indent = _ref[1];
      strings.push(TEMPLATES.it()[0]);
      path = this._parseURL(this.tabURL).pathname;
      strings.push(indent + TEMPLATES.visitPath(path));
      _ref1 = this._capturedActions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        action = _ref1[_i];
        string = indent;
        if (action.options.scope) {
          if (scope && scope !== action.options.scope) {
            strings.push(indent + TEMPLATES.withinForm(scope)[1]);
            scope = null;
          }
          if (!scope) {
            scope = action.options.scope;
            strings.push(indent + TEMPLATES.withinForm(action.options.scope)[0]);
          }
          string += indent;
        }
        string += TEMPLATES[action.name](action);
        strings.push(string);
      }
      if (scope) {
        strings.push(indent + TEMPLATES.withinForm(scope)[1]);
      }
      _ref2 = this._confirmedElements;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        element = _ref2[_j];
        strings.push(indent + TEMPLATES[element.name](element.selector));
      }
      strings.push(TEMPLATES.it()[1]);
      return strings.join('\n');
    };

    return Capycorder;

  })();

  window['Capycorder'] = Capycorder;

}).call(this);

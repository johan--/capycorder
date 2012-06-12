// Generated by CoffeeScript 1.3.3
(function() {

  window.Capybara || (window.Capybara = {});

  Capybara.Generators || (Capybara.Generators = {});

  Capybara.Generators.Matcher = (function() {

    Matcher.prototype.templates = {
      shouldHaveSelector: function(data) {
        return "page.should have_selector('" + data.selector + "')";
      },
      shouldHaveContent: function(data) {
        return "page.should have_content('" + data.options.content + "')";
      }
    };

    Matcher.prototype.scopeTemplate = function(locator) {
      return ["within_form('" + locator + "') do", "end"];
    };

    function Matcher(data) {
      if (data == null) {
        data = {};
      }
      this.data = data;
    }

    Matcher.prototype.isScoped = function() {
      return this.data.scope != null;
    };

    Matcher.prototype.scopeToPartials = function() {
      if (this.isScoped) {
        return this.scopeTemplate(this.data.scope);
      }
    };

    Matcher.prototype.toString = function() {
      return this.templates[this.data.name](this.data);
    };

    return Matcher;

  })();

}).call(this);

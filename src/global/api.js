/* ======= Global API ======= */

/**
 * Configuration of Moon
 */
Moon.config = {
  silent: ("__ENV__" === "production") || (typeof console === 'undefined'),
  delimiters: ["{{", "}}"],
  keyCodes: function(keyCodes) {
    for(var keyCode in keyCodes) {
      eventModifiersCode[keyCode] = `if(event.keyCode !== ${keyCodes[keyCode]}) {return;};`;
    }
  }
}

/**
 * Version of Moon
 */
Moon.version = '__VERSION__';

/**
 * Moon Utilities
 */
Moon.util = {
  noop: noop,
  error: error,
  log: log,
  merge: merge,
  extend: extend,
  h: h
}

/**
 * Runs an external Plugin
 * @param {Object} plugin
 * @param {Object} options
 */
Moon.use = function(plugin, options) {
  plugin.init(Moon, options);
}

/**
 * Compiles HTML to a Render Function
 * @param {String} template
 * @return {Function} render function
 */
Moon.compile = function(template) {
  return compile(template);
}

/**
 * Runs a Task After Update Queue
 * @param {Function} task
 */
Moon.nextTick = function(task) {
  setTimeout(task, 0);
}

/**
 * Creates a Directive
 * @param {String} name
 * @param {Function} action
 */
Moon.directive = function(name, action) {
  directives["m-" + name] = action;
}

/**
 * Creates a Component
 * @param {String} name
 * @param {Object} options
 */
Moon.component = function(name, options) {
  let Parent = this;

  if(options.name !== undefined) {
    name = options.name;
  } else {
    options.name = name;
  }

  if(options.data !== undefined && typeof options.data !== "function") {
    error("In components, data must be a function returning an object");
  }

  function MoonComponent() {
    Moon.call(this, options);
  }

  MoonComponent.prototype = Object.create(Parent.prototype);
  MoonComponent.prototype.constructor = MoonComponent;

  MoonComponent.prototype.init = function() {
    callHook(this, 'init');

    const options = this.$options;
    this.$destroyed = false;
    defineProperty(this, "$props", options.props, []);

    const template = options.template;
    this.$template = template;

    if(this.$render === noop) {
      this.$render = Moon.compile(template);
    }
  }

  components[name] = {
    CTor: MoonComponent,
    options: options
  };

  return MoonComponent;
}

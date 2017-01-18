/* ======= Default Directives ======= */
directives[config.prefix + "if"] = function(el, val, vdom) {
  var evaluated = new Function("return " + val);
  if(!evaluated()) {
    el.textContent = "";
    for(var i = 0; i < vdom.children.length; i++) {
      vdom.children[i].shouldRender = false;
    }
  } else {
    el.textContent = vdom.val;
    for(var i = 0; i < vdom.children.length; i++) {
      vdom.children[i].shouldRender = true;
    }
  }
}

directives[config.prefix + "show"] = function(el, val, vdom) {
  var evaluated = new Function("return " + val);
  if(!evaluated()) {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
  }
}

directives[config.prefix + "on"] = function(el, val, vdom) {
  var splitVal = val.split(":");
  var eventToCall = splitVal[0];
  var methodToCall = splitVal[1];
  if(self.$events[eventToCall]) {
    self.on(eventToCall, methodToCall);
  } else {
    el.addEventListener(eventToCall, function(e) {
      self.callMethod(methodToCall, [e]);
    });
  }
  delete vdom.props[config.prefix + "on"];
}

directives[config.prefix + "model"] = function(el, val, vdom) {
  el.value = self.get(val);
  el.addEventListener("input", function() {
    self.set(val, el.value);
  });
  delete vdom.props[config.prefix + "model"];
}

directives[config.prefix + "for"] = function(el, val, vdom) {
  var parts = val.split(" in ");
  var alias = parts[0];
  var array = self.get(parts[1]);
}

directives[config.prefix + "once"] = function(el, val, vdom) {
  vdom.meta.shouldRender = false;
}

directives[config.prefix + "text"] = function(el, val, vdom) {
  el.textContent = val;
}

directives[config.prefix + "html"] = function(el, val, vdom) {
  el.innerHTML = val;
}

directives[config.prefix + "mask"] = function(el, val, vdom) {

}

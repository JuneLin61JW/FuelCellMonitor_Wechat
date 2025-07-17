module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1705386116396, function(require, module, exports) {


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TYPE_ARRAY = '[object Array]';
var TYPE_OBJECT = '[object Object]';
var TYPE_FUNCTION = '[object Function]';

function setComputed(storeData, value, obj, key) {
  var type = getType(value);
  if (type === TYPE_FUNCTION) {
    Object.defineProperty(obj, key, {
      enumerable: true,
      get: function get() {
        return value.call(storeData);
      },
      set: function set() {
        console.warn('计算属性不支持重新赋值');
      }
    });
  } else if (type === TYPE_OBJECT) {
    Object.keys(value).forEach(function (subKey) {
      setComputed(storeData, value[subKey], value, subKey);
    });
  } else if (type === TYPE_ARRAY) {
    value.forEach(function (item, index) {
      setComputed(storeData, item, value, index);
    });
  }
}

function deepCopy(data) {
  var type = getType(data);
  if (type === TYPE_OBJECT) {
    var obj = {};
    Object.keys(data).forEach(function (key) {
      return obj[key] = deepCopy(data[key]);
    });
    return obj;
  }
  if (type === TYPE_ARRAY) {
    return data.map(deepCopy);
  }
  return data;
}

function getNowPage() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

function setState(vm, data) {
  vm._new_data = vm._new_data || {};
  Object.assign(vm._new_data, data);
  return new Promise(function (resolve) {
    Promise.resolve().then(function () {
      if (vm._new_data) {
        var diffState = getDiffState(vm._new_data, vm.data);
        vm._new_data = null;
        vm.setData(diffState, resolve);
      } else {
        resolve();
      }
    });
  });
}

function getDiffState(state, preState) {
  var newState = {};
  stateDiff(deepCopy(state), preState, '', newState);
  return newState;
}

function getType(obj) {
  return Object.prototype.toString.call(obj);
}

function addDiffState(newState, key, val) {
  key !== '' && (newState[key] = val);
}

function stateDiff(state, preState, path, newState) {
  if (state === preState) return;
  var stateType = getType(state);
  var preStateType = getType(preState);
  if (stateType === TYPE_OBJECT) {
    var stateKeys = Object.keys(state);
    var preStateKeys = Object.keys(preState || {});
    var stateLen = stateKeys.length;
    var preStateLen = preStateKeys.length;
    if (path !== '') {
      if (preStateType !== TYPE_OBJECT || stateLen < preStateLen || stateLen === 0 || preStateLen === 0) {
        addDiffState(newState, path, state);
        return;
      }
      preStateKeys.forEach(function (key) {
        if (state[key] === undefined) {
          state[key] = null; // 已删除的属性设置为null
          stateKeys.indexOf(key) === -1 && stateKeys.push(key);
        }
      });
    }
    stateKeys.forEach(function (key) {
      var subPath = path === '' ? key : path + '.' + key;
      stateDiff(state[key], preState[key], subPath, newState);
    });
    return;
  }
  if (stateType === TYPE_ARRAY) {
    if (preStateType !== TYPE_ARRAY || state.length < preState.length || state.length === 0 || preState.length === 0) {
      addDiffState(newState, path, state);
      return;
    }
    preState.forEach(function (item, index) {
      state[index] === undefined && (state[index] = null); // 已删除的属性设置为null
    });
    state.forEach(function (item, index) {
      return stateDiff(item, preState[index], path + '[' + index + ']', newState);
    });
    return;
  }
  addDiffState(newState, path, state);
}

function getVmRoute(vm) {
  return vm.route;
}

function getCurrentRoutes() {
  return getCurrentPages().map(function (f) {
    return getVmRoute(f);
  });
}

function initComponent(vm) {
  if (vm.route) return;
  var pageVm = vm.$page || vm.pageinstance || getNowPage() || {};
  vm.route = pageVm.route;
}

var Store = function () {
  function Store() {
    var _this = this;

    _classCallCheck(this, Store);

    this.__vms = [];
    setTimeout(function () {
      _this._setComputed();
    }, 0);
  }

  _createClass(Store, [{
    key: '_setComputed',
    value: function _setComputed() {
      if (!this.__isReadyComputed) {
        this.__isReadyComputed = true;
        setComputed(this.data, this.data);
      }
    }
  }, {
    key: 'bind',
    value: function bind(vm, key) {
      if (!key) {
        console.error('\u8BF7\u8BBE\u7F6Estore\u5728\u5F53\u524D\u7EC4\u4EF6\u5B9E\u4F8Bdata\u4E2D\u7684key\uFF0C\u5982store.bind(this, \'$store\')');
        return;
      }
      vm.data = vm.data || {};
      vm.data[key] = null;
      this.__vms = this.__vms || [];
      this._setComputed();
      this.__vms.push({ vm: vm, key: key });
      setState(vm, _defineProperty({}, key, this.data));
      setTimeout(function () {
        return initComponent(vm);
      }, 360);
    }
  }, {
    key: 'unbind',
    value: function unbind(vm) {
      this.__vms = (this.__vms || []).filter(function (f) {
        return f.vm !== vm;
      });
    }
  }, {
    key: 'update',
    value: function update() {
      var _this2 = this;

      var currRoutes = getCurrentRoutes();
      var nowVmRoute = currRoutes[currRoutes.length - 1];
      var delayVms = [];
      this.__vms = (this.__vms || []).filter(function (f) {
        var vmRoute = getVmRoute(f.vm);
        if (currRoutes.includes(vmRoute)) {
          if (nowVmRoute === vmRoute) {
            setState(f.vm, _defineProperty({}, f.key, _this2.data));
          } else {
            // 延迟更新
            delayVms.push(f);
          }
          return true;
        }
      });
      if (!delayVms.length) return;
      clearTimeout(this.__delayTimer);
      this.__delayTimer = setTimeout(function () {
        delayVms.forEach(function (f) {
          return setState(f.vm, _defineProperty({}, f.key, _this2.data));
        });
      }, 360);
    }
  }]);

  return Store;
}();

module.exports = { Store: Store };
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1705386116396);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map
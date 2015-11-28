'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Translation = require('./Translation');

var _Translation2 = _interopRequireDefault(_Translation);

var _filtersCapitalize = require('./filters/capitalize');

var _filtersCapitalize2 = _interopRequireDefault(_filtersCapitalize);

var _filtersAs = require('./filters/as');

var _filtersAs2 = _interopRequireDefault(_filtersAs);

var _filtersSelect = require('./filters/select');

var _filtersSelect2 = _interopRequireDefault(_filtersSelect);

var _filtersPlural = require('./filters/plural');

var _filtersPlural2 = _interopRequireDefault(_filtersPlural);

var defaultOptions = {
  locale: 'en'
};

var Translate = (function () {
  function Translate() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Translate);

    this._options = _extends({}, defaultOptions, {
      options: options
    });

    this._filters = {
      capitalize: _filtersCapitalize2['default'],
      as: _filtersAs2['default'],
      select: _filtersSelect2['default'],
      plural: _filtersPlural2['default']
    };

    this._translation = new _Translation2['default'](this);
  }

  _createClass(Translate, [{
    key: 'get',
    value: function get(path, attrs) {
      return this._translation.get(path, attrs);
    }
  }, {
    key: 'set',
    value: function set(name, value) {
      return this._translation.set(name, value, this);
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this._options;
    }
  }, {
    key: 'setFilter',
    value: function setFilter(type, fn) {
      this._filters[type] = fn;
    }
  }, {
    key: 'getFilter',
    value: function getFilter(type) {
      return this._filters[type];
    }
  }]);

  return Translate;
})();

exports['default'] = Translate;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('@swup/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeadPlugin = function (_Plugin) {
	_inherits(HeadPlugin, _Plugin);

	function HeadPlugin() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, HeadPlugin);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = HeadPlugin.__proto__ || Object.getPrototypeOf(HeadPlugin)).call.apply(_ref, [this].concat(args))), _this), _this.name = 'HeadPlugin', _this.getHeadAndReplace = function () {
			var headChildren = _this.getHeadChildren();
			var nextHeadChildren = _this.getNextHeadChildren();

			_this.replaceTags(headChildren, nextHeadChildren);
		}, _this.getHeadChildren = function () {
			return document.head.children;
		}, _this.getNextHeadChildren = function () {
			var pageContent = _this.swup.cache.getCurrentPage().originalContent.replace('<head', '<div id="swupHead"').replace('</head>', '</div>');
			var element = document.createElement('div');
			element.innerHTML = pageContent;
			var children = element.querySelector('#swupHead').children;

			// cleanup
			element.innerHTML = '';
			element = null;

			return children;
		}, _this.replaceTags = function (oldTags, newTags) {
			var head = document.head;
			var themeActive = Boolean(document.querySelector('[data-swup-theme]'));
			var addTags = _this.getTagsToAdd(oldTags, newTags, themeActive);
			var removeTags = _this.getTagsToRemove(oldTags, newTags, themeActive);

			removeTags.reverse().forEach(function (item) {
				head.removeChild(item.tag);
			});

			addTags.forEach(function (item) {
				head.insertBefore(item.tag, head.children[item.index]);
			});

			_this.swup.log('Removed ' + removeTags.length + ' / added ' + addTags.length + ' tags in head');
		}, _this.compareTags = function (oldTag, newTag) {
			var oldTagContent = oldTag.outerHTML;
			var newTagContent = newTag.outerHTML;

			return oldTagContent === newTagContent;
		}, _this.getTagsToRemove = function (oldTags, newTags) {
			var removeTags = [];

			for (var i = 0; i < oldTags.length; i++) {
				var foundAt = null;

				for (var j = 0; j < newTags.length; j++) {
					if (_this.compareTags(oldTags[i], newTags[j])) {
						foundAt = j;
						break;
					}
				}

				if (foundAt == null && oldTags[i].getAttribute('data-swup-theme') === null) {
					removeTags.push({ tag: oldTags[i] });
				}
			}

			return removeTags;
		}, _this.getTagsToAdd = function (oldTags, newTags, themeActive) {
			var addTags = [];

			for (var i = 0; i < newTags.length; i++) {
				var foundAt = null;

				for (var j = 0; j < oldTags.length; j++) {
					if (_this.compareTags(oldTags[j], newTags[i])) {
						foundAt = j;
						break;
					}
				}

				if (foundAt == null) {
					addTags.push({ index: themeActive ? i + 1 : i, tag: newTags[i] });
				}
			}

			return addTags;
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(HeadPlugin, [{
		key: 'mount',
		value: function mount() {
			this.swup.on('contentReplaced', this.getHeadAndReplace);
		}
	}, {
		key: 'unmount',
		value: function unmount() {
			this.swup.off('contentReplaced', this.getHeadAndReplace);
		}
	}]);

	return HeadPlugin;
}(_plugin2.default);

exports.default = HeadPlugin;
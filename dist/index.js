'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var legoToggle = require('lego-toggle');
var data = _interopDefault(require('lego-data'));

var filter = function (arr, fnc) { return Array.prototype.filter.call(arr, fnc); };

var DEFAULTS = {
    rootSelector: false,
    subNavClass: 'MobileNav-sub',
    subNavToggleSelector: 'header',
};

var Section = function Section(node, group, opts) {
    this.header = node.querySelector('header');
    this.navHeader = this.header.cloneNode(true);
    var nav = node.querySelector(("." + (opts.subNavClass)));
    nav.insertBefore(this.navHeader, nav.firstChild);

    this.headerTrigger = opts.subNavToggleSelector === 'header' ? this.header : this.header.querySelector(opts.subNavToggleSelector);
    this.navHeaderTrigger = opts.subNavToggleSelector === 'header' ? this.navHeader : this.navHeader.querySelector(opts.subNavToggleSelector);

    var panel = new legoToggle.Panel(node, { group: group, nav: nav });
    new legoToggle.Trigger(this.headerTrigger, { panel: panel });
    new legoToggle.Trigger(this.navHeaderTrigger, { panel: panel });

    // recursively initialize nested sections
    var subSections = filter(nav.children, function (node) { return node.tagName.toLowerCase() === 'section'; });

    if (subSections.length) {
        var subGroup = panel.opts.subGroup = new legoToggle.Group({
            state: 'open',
            parentNode: node,
        });

        subSections.forEach(function (node) { return new Section(node, subGroup, opts); });
    }
};

var MobileNav = function MobileNav(node, options) {
    var this$1 = this;
    if ( options === void 0 ) options = {};

    this.node = node;

    this.opts = Object.create(DEFAULTS);
    this.setOptions(options);

    // initialize active section as top level container
    var parentNode = this.opts.rootSelector ? this.node.querySelector(this.opts.rootSelector) : this.node;

    var group = new legoToggle.Group({
        state: 'open',
        parentNode: parentNode,
    });

    filter(parentNode.children, function (sectionNode) { return sectionNode.tagName.toLowerCase() === 'section'; })
        .forEach(function (sectionNode) { return new Section(sectionNode, group, this$1.opts); }
        );
};

MobileNav.prototype.setOptions = function setOptions (options) {
        var this$1 = this;
        if ( options === void 0 ) options = {};

    Object.keys(options).forEach(function (key) {
        this$1.opts[key] = options[key];
    });
};

MobileNav.prototype.close = function close (group) {
    if (group.activePanel) {
        if (group.activePanel.opts.subGroup) {
            this.close(group.activePanel.opts.subGroup);
        }
        group.removeActivatePanel();
    }
};

MobileNav.getInstance = function getMobileNavInstance(node, options) {
    var menu = data(node, '_mobileNav');
    if (!(menu instanceof MobileNav)) {
        data(node, '_mobileNav', menu = new MobileNav(node, options));
    } else {
        menu.setOptions(options);
    }
    return menu;
};

exports.DEFAULTS = DEFAULTS;
exports.Section = Section;
exports.default = MobileNav;

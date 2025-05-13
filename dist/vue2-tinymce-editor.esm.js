import tinymce from 'tinymce/tinymce';
import 'tinymce/icons/default/icons';
import 'tinymce/themes/silver/theme';
import 'tinymce/models/dom/model';
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/plugins/advlist/plugin';
import 'tinymce/plugins/autolink/plugin';
import 'tinymce/plugins/charmap/plugin';
import 'tinymce/plugins/preview/plugin';
import 'tinymce/plugins/anchor/plugin';
import 'tinymce/plugins/searchreplace/plugin';
import 'tinymce/plugins/visualblocks/plugin';
import 'tinymce/plugins/fullscreen/plugin';
import 'tinymce/plugins/insertdatetime/plugin';
import 'tinymce/plugins/media/plugin';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/plugins/table/plugin';
import 'tinymce/plugins/code/plugin';
import 'tinymce/plugins/help/plugin';
import 'tinymce/plugins/wordcount/plugin';
import 'tinymce/plugins/autoresize/plugin';
import 'tinymce/skins/content/default/content.min.css';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/icons/default';

//
var script = {
  name: 'Vue2TinymceEditor',
  props: {
    id: {
      default: 'vue2-tinymce-editor-' + new Date().getTime(),
      type: String
    },
    value: {
      default: ''
    },
    options: {
      default: function () {
        return {};
      },
      type: Object
    },
    height: {
      default: 300,
      type: Number
    },
    width: {
      default: 0,
      type: Number
    }
  },

  data() {
    return {
      inputId: "editor-" + new Date().getTime(),
      content: '',
      editor: null,
      checkerTimeout: null,
      isTyping: false,
      plugins: 'lists',
      toolbar: 'bold italic'
    };
  },

  mounted() {
    this.content = this.value;
    this.init();
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  watch: {
    value: function (newValue) {
      if (!this.isTyping) {
        if (this.editor !== null) this.editor.setContent(newValue);else this.content = newValue;
      }
    }
  },
  methods: {
    init() {
      let options = {
        selector: '#' + this.inputId,
        skin: false,
        toolbar: this.toolbar,
        plugins: this.plugins,
        init_instance_callback: this.initEditor
      }; // copy all options keys

      for (let key in this.options) {
        if (key === 'selector' || key === 'init_instance_callback') {
          continue;
        }

        options[key] = this.options[key];
      }

      tinymce.init(options);
    },

    initEditor(editor) {
      this.editor = editor;
      editor.on('KeyUp', () => {
        this.submitContent();
      });
      editor.on('Change', e => {
        if (this.editor.getContent() !== this.value) {
          this.submitContent();
        }

        this.$emit('editorChange', e);
      });
      editor.on('init', () => {
        editor.setContent(this.content);
        this.$emit('input', this.content);
      });
      this.$emit('editorInit', editor);
    },

    submitContent() {
      this.isTyping = true;
      if (this.checkerTimeout !== null) clearTimeout(this.checkerTimeout);
      this.checkerTimeout = setTimeout(() => {
        this.isTyping = false;
      }, 700);
      this.$emit('input', this.editor.getContent());
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    attrs: {
      "id": _vm.id
    }
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.content,
      expression: "content"
    }],
    style: {
      'height': _vm.height + 'px',
      'width': _vm.width <= 0 ? 'auto' : _vm.width + 'px'
    },
    attrs: {
      "id": _vm.inputId
    },
    domProps: {
      "value": _vm.content
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) {
          return;
        }

        _vm.content = $event.target.value;
      }
    }
  })]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = "data-v-297ad6d2";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Vue2TinymceEditor: __vue_component__
});

// Import vue components

const install = function installVue2TinymceEditor(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install on non-es builds, when vue is found

export default plugin;
export { __vue_component__ as Vue2TinymceEditor };

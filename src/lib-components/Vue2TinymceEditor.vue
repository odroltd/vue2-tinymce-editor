<template>
    <div :id="id">
        <textarea :id="inputId" v-model="content" :style="{'height': height+'px', 'width': width<=0?'auto':width+'px'}"></textarea>
    </div>
</template>

<script>
    // Import TinyMCE
    import tinymce from 'tinymce/tinymce'

    // A theme is also required
    import 'tinymce/icons/default/icons';
    import 'tinymce/themes/silver/theme';
    import 'tinymce/models/dom/model';
    import 'tinymce/skins/ui/oxide/skin.css';

    // plugins are imported
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


    import 'tinymce/skins/content/default/content.min.css'
    import 'tinymce/skins/ui/oxide/skin.min.css'
    import 'tinymce/icons/default'

    export default {
        name: 'Vue2TinymceEditor',
        props: {
            id: {
                default: 'vue2-tinymce-editor-' + new Date().getTime(),
                type: String,
            },
            value: {default: ''},
            options: {
                default: function () {
                    return {}
                }, type: Object
            },
            height:{
                default:300,
                type:Number
            },
            width:{
                default:0,
                type:Number
            },
        },
        data() {
            return {
                inputId: "editor-" + new Date().getTime(),
                content: '',
                editor: null,
                checkerTimeout: null,
                isTyping: false,
                plugins: 'lists',
                toolbar: 'bold italic',
            }
        },
        mounted() {
            this.content = this.value
            this.init()
        },
        beforeDestroy() {
            this.editor.destroy()
        },
        watch: {
            value: function (newValue) {
                if (!this.isTyping) {
                    if (this.editor !== null)
                        this.editor.setContent(newValue)
                    else
                        this.content = newValue
                }
            },
        },
        methods: {
            init() {
                let options = {
                    selector: '#' + this.inputId,
                    skin: false,
                    toolbar: this.toolbar,
                    plugins: this.plugins,
                    init_instance_callback: this.initEditor,
                }
                // copy all options keys
                for (let key in this.options) {
                    if (key === 'selector' || key ==='init_instance_callback') {
                        continue
                    }
                    options[key] = this.options[key]
                }

                tinymce.init(options)
            },
            initEditor(editor) {
                this.editor = editor
                editor.on('KeyUp', () => {
                    this.submitContent()
                })
                editor.on('Change', (e) => {
                    if (this.editor.getContent() !== this.value) {
                        this.submitContent()
                    }
                    this.$emit('editorChange', e)
                })
                editor.on('init', () => {
                    editor.setContent(this.content)
                    this.$emit('input', this.content)
                })
                this.$emit('editorInit', editor)
            },
            submitContent() {
                this.isTyping = true
                if (this.checkerTimeout !== null)
                    clearTimeout(this.checkerTimeout)
                this.checkerTimeout = setTimeout(() => {
                    this.isTyping = false
                }, 700)
                this.$emit('input', this.editor.getContent())
            }
        }
    }
</script>

<style scoped>
</style>

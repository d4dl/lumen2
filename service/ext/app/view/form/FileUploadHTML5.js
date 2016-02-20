Ext.define("Lumen.view.form.FileUploadHTML5", {
    extend: 'Ext.form.field.Trigger',
    alias: ['widget.filefieldhtml5', 'widget.fileuploadfieldhtml5'],

    skipTraverse: true,
    //<locale>
    /**
     * @cfg {String} buttonText
     * The button text to display on the upload button. Note that if you supply a value for
     * {@link #buttonConfig}, the buttonConfig.text value will be used instead if available.
     */
    buttonText: 'Choose file...',
    //</locale>


    /**
     * @cfg {String} [fieldBodyCls='x-form-file-wrap']
     * An extra CSS class to be applied to the body content element in addition to {@link #fieldBodyCls}.
     */
    fieldBodyCls: Ext.baseCSSPrefix + 'form-file-wrap',

    /**
     * @cfg {Boolean} readOnly
     * Unlike with other form fields, the readOnly config defaults to true in File field.
     */
    readOnly: true,

    /**
     * Do not show hand pointer over text field since file choose dialog is only shown when clicking in the button
     * @private
     */
    triggerNoEditCls: '',

    // private
    componentLayout: 'triggerfield',

    // private. Extract the file element, button outer element, and button active element.
    childEls: ['fileInputEl', 'buttonEl', 'buttonEl-btnEl', 'browseButtonWrap'],

    // private
    onRender: function() {
        var me = this,
            inputEl;

        me.callParent(arguments);

        inputEl = me.inputEl;
        inputEl.dom.name = ''; //name goes on the fileInput, not the text input

        me.fileInputEl.dom.name = me.getName();
        me.fileInputEl.on({
            scope: me,
            change: me.onFileChange
        });

        me.inputCell.setDisplayed(false);

        // Ensure the trigger cell is sized correctly upon render
        me.browseButtonWrap.dom.style.width = (me.browseButtonWrap.dom.lastChild.offsetWidth + me.buttonEl.getMargin('lr')) + 'px';
        if (Ext.isIE) {
            me.buttonEl.repaint();
        }
    },

    /**
     * Gets the markup to be inserted into the subTplMarkup.
     */
    getTriggerMarkup: function() {
        var me = this,
            result,
            btn = Ext.widget('button', Ext.apply({
                id: me.id + '-buttonEl',
                ui: me.ui,
                disabled: me.disabled,
                text: me.buttonText,
                cls: Ext.baseCSSPrefix + 'form-file-btn',
                preventDefault: false
            }, me.buttonConfig)),
            btnCfg = btn.getRenderTree(),
            inputElCfg = {
                id: me.id + '-fileInputEl',
                cls: Ext.baseCSSPrefix + 'form-file-input',
                tag: 'input',
                type: 'file',
                size: 1
            };
        if (me.disabled) {
            inputElCfg.disabled = true;
        }
        btnCfg.cn = inputElCfg;
        result = '<td id="' + me.id + '-browseButtonWrap">' + Ext.DomHelper.markup(btnCfg) + '</td>';
        btn.destroy();
        return result;
    },

    /**
     * @private
     * Creates the file input element. It is inserted into the trigger button component, made
     * invisible, and floated on top of the button's other content so that it will receive the
     * button's clicks.
     */
    createFileInput : function() {
        var me = this;
        me.fileInputEl = me.buttonEl.createChild({
            name: me.getName(),
            id: me.id + '-fileInputEl',
            cls: Ext.baseCSSPrefix + 'form-file-input',
            tag: 'input',
            type: 'file',
            size: 1
        });
        me.fileInputEl.on({
            scope: me,
            change: me.onFileChange
        });
    },

    /**
     * @private Event handler fired when the user selects a file.
     */
    onFileChange: function(e, t, opts) {
        var selfy = this;

        var fileIn = e.target.files[0];
        var mimeType = fileIn.type;
        var fileName = fileIn.name;

        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                var dataURL = e.target.result;
                var base64Index = dataURL.indexOf("base64,")+7;
                var base64Data = dataURL.substring(base64Index);

                Lumen.getApplication().fireEvent(Lumen.UPLOAD_FILE, {
                    documentType: selfy.documentTypeList,
                    mimeType: mimeType,
                    fileName: fileName,
                    base64Data: base64Data
                });
                selfy.fireEvent(Lumen.FILE_ADDED, {fileName: fileName});
            };
        })(fileIn);
        reader.readAsDataURL(fileIn);
    },

    /**
     * Overridden to do nothing
     * @method
     */
    setValue: Ext.emptyFn,

    reset : function(){
        var me = this;
        if (me.rendered) {
            me.fileInputEl.remove();
            me.createFileInput();
            me.inputEl.dom.value = '';
        }
        me.callParent();
    },

    onDisable: function(){
        this.callParent();
        this.disableItems();
    },

    disableItems: function(){
        var file = this.fileInputEl;
        if (file) {
            file.dom.disabled = true;
        }
        this['buttonEl-btnEl'].dom.disabled = true;
    },

    onEnable: function(){
        var me = this;
        me.callParent();
        me.fileInputEl.dom.disabled = false;
        this['buttonEl-btnEl'].dom.disabled = false;
    },

    isFileUpload: function() {
        return true;
    },

    extractFileInput: function() {
        var fileInput = this.fileInputEl.dom;
        this.reset();
        return fileInput;
    },

    onDestroy: function(){
        Ext.destroyMembers(this, 'fileInputEl', 'buttonEl');
        this.callParent();
    }
});
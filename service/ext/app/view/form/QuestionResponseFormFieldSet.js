Ext.define('Lumen.view.form.QuestionResponseFormFieldSet', {
    extend: 'Lumen.view.form.DataFormFieldSet',
    alias: 'widget.questionresponseformfieldset',

    constructor: function(config) {
        if(config.name) {
            this.title = Lumen.i18n(config.name, Lumen.PROMPT);
        }
        this.callParent([config]);
    },
    getOutputLabel: function() {
        return this.question ? Lumen.i18n(this.question, Lumen.PROMPT) : this.title;
    }
});
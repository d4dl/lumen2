Ext.define('Lumen.view.form.EvaluationForm',{
    extend: 'Ext.container.Container',
    alias: 'widget.evaluationform',
    allowBlank: false,
    validating: true,
    needsValidation: false,
    constructor: function(config) {
        this.callParent(arguments);
    },
    validate: function(forceValid) {
        if(!forceValid && this.required && !this.ownerCt.down("[evaluationFieldSet]")) {
            if(this.el) {
                this.el.query('.invalidText')[0].innerHTML = "<div class='requiredText'>"+Lumen.I18N_LABELS.evaluationsAreRequired+"</div>";
                this.needsValidation = false;
            } else {
                this.needsValidation = true;//This is reached when its validated before rendering. In that case, validation is deferred to render time.
            }
            return false;
        } else {
            if(this.el) {
                this.el.query('.invalidText')[0].innerHTML = "";
            }
            return true;
        }
    },
    invitationIsValid: function() {
        var isValid = true;
        var validatables = this.query("[isValidEvaluationField]");
        for(var i=0; i < validatables.length; i++) {
            var validatable = validatables[i];
            if(!validatable.isValid()) {
                isValid = false;
            }
        }
        if(!isValid) {
            var popup = Ext.widget('window',{
                title: 'More information needed.',
                modal: true,
                html: "Please complete the invitation fields before attempting to send the invitation.",
                width: 350,
                height: 120,
                bodyStyle: 'padding: 10px 20px;',
                autoScroll: true,

                buttons: [
                    {
                        text: 'Ok',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            });
            popup.show();
        }
        return isValid;
    },
    listeners: {
        afterrender: function() {
            if(this.needsValidation) {
                this.validate();
            }
        }
    }
});
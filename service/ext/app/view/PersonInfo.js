Ext.define('Lumen.view.PersonInfo',{
    extend: 'Ext.form.Panel',
    required: ['Lumen.model.Person'],
    constructor: function() {
        this.callParent(arguments);
        var selfy = this;
        this.addListener ({afterrender: {
            fn: function() {
                var firstPerson = Lumen.getApplication().getAuthenticationStore().first();
                Ext.ModelMgr.getModel('Lumen.model.Person').load(firstPerson.getId(), {
                    success: function(user) {
                        //selfy.down('form').getForm().loadRecord(firstPerson);
                    },
                    params: {
                        formData: JSON.stringify({ authAction: "person"})
                    }
                });
                this.jsonModel = Lumen.getApplication().getAuthenticationStore().getById(firstPerson.getId());
                selfy.items.items[0].modelToLoad = this.jsonModel;
            }
        }
    })},
    items: [
        {
            xtype: "appformloader",
            title: "Account Information <a id='logoutLink' target='_parent' href='" + Lumen.APPLICATION_LINK + "' class='menuLink logoutLink'>Back</a>",
            completeSection: "necessary_for_completeness_verification",
            url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/PersonInformation.js"
        }
    ],

    initComponent: function() {
        var self = this;
        this.buttons = [
            {
                text: 'Submit',
                handler: function () {
                    var form = this.up('form').getForm(); // get the basic form
                    if (form.isValid()) {
                        var document = Ext.merge({}, self.jsonModel.raw || self.jsonModel.data);
                        Lumen.getApplication().fireEvent(Lumen.SAVE_JSON_ENTITY, {
                            document: Ext.encode(document),
                            documentType: "Person",
                            callback: function() {
                                var popup = Ext.widget('window',{
                                    title: 'Information Updated',
                                    modal: true,
                                    html: Lumen.i18n("yourAccountInformationHasBeenUpdated"),
                                    bodyStyle: 'padding: 10px 20px;',
                                    autoScroll: true,

                                    buttons: [
                                        {
                                            text: 'Ok',
                                            handler: function () {
                                                this.up('window').close();
                                                window.parent.postMessage(Ext.encode({method: "relocate", url: Lumen.APPLICATION_LINK}), "*");
                                            }
                                        }
                                    ]
                                });
                                popup.show();
                            }
                        });
                    } else { // display error alert if the data is invalid
                        Ext.Msg.alert('Invalid Data', 'Please correct form errors.')
                    }
                }
            }
        ]
        this.callParent(arguments);
    }
});
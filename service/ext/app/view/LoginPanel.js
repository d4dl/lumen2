Ext.define('Lumen.view.LoginPanel',{
    extend: 'Ext.panel.Panel',
    frame: false,
    border: false,
    alias: 'widget.loginpanel',
    stores: ['Authentication','UIState'],
    cls: "loginPanel",
    layout: {
        type: 'hbox',
        defaultMargins: {
            top: 4,
            right: 9,
            bottom: 4,
            left: 0
        }
    },
    hideMode: 'offset',
    constructor: function () {
        Ext.apply(this,{
                dockedItems: [
                    {
                        xtype: 'container',
                        dock: 'top',

                        items: [
                            {
                                html: Lumen.I18N_LABELS.login
                            }
                        ]
                    }
                ]
            });
        this.callParent(arguments);
    },
    showErrorPopup: function (title, statusText) {
        var popup = Ext.widget('window', {
            title: title,
            modal: true,
            html: statusText,
            width: 300,
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
    }, items: [
        {
            xtype: 'panel',
            title: 'Login',
            collapsed: false,
            collapsible: false,
            width: 340,
            frame: true,
            bodyPadding: '5 5 5 5',
            border: false,
            cls: 'left-login-box',
            items: [
                {
                    xtype: "form",
                    border: false,
                    bodyBorder: false,
                    frame: true,
                    url: Lumen.DATA_SERVICE_URL_ROOT + "/authenticate.php",
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'Username',
                            fieldLabel: 'Email Address',
                            vtype: 'email',
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            name: 'Password',
                            fieldLabel: 'Password',
                            inputType: 'password',
                            style: 'margin-top:15px',
                            allowBlank: false,
                            minLength: 6
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'authAction',
                            value: 'login'
                        },
                        {
                            xtype: "label",
                            text: "Don't have your password?",
                            cls: "forgotPassword",
                            listeners: {
                                el: {
                                    click: {
                                        fn: function () {
                                            var popup = Ext.widget('window',{
                                                title: 'Email Reminder',
                                                modal: true,
                                                items: [
                                                    {
                                                        html: "Enter your email to reset your password."
                                                    },
                                                    {
                                                        xtype: "form",
                                                        items: {
                                                            xtype: 'textfield',
                                                            name: 'Username',
                                                            fieldLabel: 'Email Address',
                                                            vtype: 'email',
                                                            allowBlank: false
                                                        }

                                                    }

                                                ],
                                                width: 300,
                                                height: 160,
                                                bodyStyle: 'padding: 10px 20px;',
                                                autoScroll: true,

                                                buttons: [
                                                    {
                                                        text: 'Ok',
                                                        handler: function () {
                                                            var emailField = this.ownerCt.ownerCt.down("textfield");
                                                            if (emailField.isValid()) {
                                                                Ext.Ajax.request({
                                                                    url: Lumen.DATA_SERVICE_URL_ROOT + "/authenticate.php?newUser=true",
                                                                    params: {
                                                                        action: "put",
                                                                        formData: JSON.stringify({authAction: "forgotPassword",Username: emailField.getValue()})
                                                                    },
                                                                    method: "POST",
                                                                    context: this,
                                                                    failure: function (response) {
                                                                        alert("Failure");
                                                                    },
                                                                    success: function (response,opts) {
                                                                        var link = Lumen.DATA_SERVICE_URL_ROOT + "/authenticate.php?newUser=true";
                                                                        var jsonData = JSON.parse(response.responseText);
                                                                        var responseData = jsonData;
                                                                        if (responseData.Login && responseData.Login.Username && responseData.Login.ForgotPasswordToken) {
                                                                            link = Lumen.DATA_SERVICE_URL_ROOT + "/authenticate.php?action=redeem&token=" + responseData.Login.ForgotPasswordToken;
                                                                        }
                                                                        var popup = Ext.widget('window',{
                                                                            title: 'Reminder Sent',
                                                                            modal: true,
                                                                            html: "Please check your email for your password reset link.",
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
                                                                        Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION,{
                                                                            notifyParams: {
                                                                                emailTitle: "Request to reset your password",
                                                                                subject: "Request to reset your password",
                                                                                link: link,
                                                                                templateURL: Lumen.URL_FORGOT_PASSWORD,
                                                                                notify: responseData.Login.Username
                                                                            }
                                                                        });
                                                                    }
                                                                });

                                                            }
                                                            this.up('window').close();
                                                        }
                                                    },

                                                    {
                                                        text: 'Cancel',
                                                        handler: function () {
                                                            this.up('window').close();
                                                        }
                                                    }
                                                ]
                                            });

                                            popup.show();
                                        }
                                    }
                                }
                            }
                        }

                    ],
                    defaults: {
                        listeners: {
                            specialkey: {fn: function (field,e) {
                                // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                                // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                                if (e.getKey() == e.ENTER) {
                                    this.up('form').doSubmit();
                                }
                            }}
                        }
                    },
                    buttons: [
                        {
                            text: 'Submit',
                            handler: function () {
                                this.up('form').doSubmit();
                            }
                        }
                    ],
                    doSubmit: function () {
                        var loginPanel = this.up('loginpanel');
                        if (this.getForm().isValid()) {
                            Lumen.getApplication().fireEvent(Lumen.LOGIN_FORM_SUBMIT,{
                                form: this.getForm(),
                                usePopup: true,
                                scope: this,
                                callback: function (result,options) {
                                    var resultJSON = Ext.decode(result.responseText);
                                    if (resultJSON.Person) {
                                        Lumen.getApplication().getAuthenticationStore().load();
                                    }
                                },
                                errorCallback: function (result) {
                                    var title = 'Invalid login';
                                    var statusText = result.statusText;
                                    loginPanel.showErrorPopup(title, result.responseText);
                                }
                            });
                        }

                    }
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Create a login',
            cls: 'right-login-box',
            collapsed: false,
            collapsible: false,
            width: 340,
            frame: true,
            border: false,
            bodyPadding: '5 5 5 5',
            items: [
                {
                    xtype: "form",
                    border: false,
                    bodyBorder: false,
                    frame: true,
                    url: Lumen.DATA_SERVICE_URL_ROOT + "/authenticate.php",
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'Username',
                            fieldLabel: 'Email Address',
                            vtype: 'email',
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            name: 'Password',
                            fieldLabel: 'Password',
                            inputType: 'password',
                            style: 'margin-top:15px',
                            allowBlank: false,
                            minLength: 6
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'authAction',
                            value: 'create'
                        },
                        {
                            xtype: 'textfield',
                            name: 'password2',
                            fieldLabel: 'Repeat Password',
                            inputType: 'password',
                            allowBlank: false,
                            /**
                             * Custom validator implementation - checks that the value matches what was entered into
                             * the password1 field.
                             */
                            validator: function (value) {
                                var Password = this.previousSibling('[name=Password]');
                                return (value === Password.getValue()) ? true : 'Passwords do not match.'
                            }
                        }

                    ],
                    defaults: {
                        listeners: {
                            specialkey: {fn: function (field,e) {
                                // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                                // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                                if (e.getKey() == e.ENTER) {
                                    this.up('form').doSubmit();
                                }
                            }}

                        }},

                    buttons: [{
                            text: 'Submit',
                            handler: function () {
                                this.up('form').doSubmit();
                            }
                        }
                    ],
                    doSubmit: function () {
                        var loginPanel = this.up('loginpanel');
                        var theForm = this.getForm();
                        if (theForm.isValid()) {
                            Lumen.getApplication().fireEvent(Lumen.LOGIN_FORM_SUBMIT, {
                                form: theForm,
                                usePopup: true,
                                callback: function (result) {
                                    //var resultJSON = Ext.decode(result.responseText);
                                    var email = theForm.getFieldValues()["Username"];
                                    //Get the person loaded
                                    Lumen.getApplication().getAuthenticationStore().load();
                                    //Invoke notification to notify admins of the new user
                                    Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION,{
                                        notifyParams: {
                                            emailTitle: Lumen.I18N_LABELS.newAccountEmailTitle,
                                            subject: Lumen.I18N_LABELS.newAccountEmailSubject,
                                            link: Lumen.APPLICATION_LINK,
                                            templateURL: Lumen.URL_ACCOUNT_CREATION,
                                            notify: email
                                        }
                                    });
                                },
                                errorCallback: function (result) {
                                    var title = 'Account creation error';
                                    var statusText = result.statusText;
                                    loginPanel.showErrorPopup(title, result.responseText);
                                }
                            });
                        }

                    }
                }
            ]
        }
    ]
});
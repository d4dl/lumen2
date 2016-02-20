[
    {
        xtype: "panel",
        frame: true,
        autoHeight: true,
        cls: "applicationPanel completionTabPanel",
        autoDestroy: true,
        applicationType: "Person",
        defaults: {
            autoHeight: true,
            xtype: "appformloader"
        },
        items: [
            {
                xtype: "personname",
                name: "Person",
                title: "Full Name",
                showTitle: false
            },
            {
                xtype: 'textfield',
                name: 'Person.Email',
                fieldLabel: 'Email Address',
                vtype: 'email',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                name: 'Login.Username',
                fieldLabel: 'Email Address',
                vtype: 'email',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                name: 'Login.Password',
                fieldLabel: 'Password',
                inputType: 'password',
                style: 'margin-top:15px',
                minLength: 6
            },
            ,
            {
                xtype: 'textfield',
                name: 'password2',
                fieldLabel: 'Repeat Password',
                inputType: 'password',
                /**
                 * Custom validator implementation - checks that the value matches what was entered into
                 * the password1 field.
                 */
                validator: function (value) {
                    var Password = this.previousSibling('[name=Login.Password]');
                    return (value === Password.getValue()) ? true : 'Passwords do not match.'
                }
            },
            {
                layout: "fit",
                title: Lumen.i18n("Contact Numbers"),
                name: "Person.PhoneArray",
                collapsible: true,
                cls: "parentPhone",
                xtype: "phonenumber"
            },
            {
                xtype: "address",
                title: Lumen.i18n("Home Address"),
                name: "Person.AddressArray[0]"
            }
        ]
    }

]
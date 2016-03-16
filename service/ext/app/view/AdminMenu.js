Ext.define('Lumen.view.AdminMenu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.adminmenu',
    hideMode: "offset",
    title: "Applications - Admin <a id='logoutLink' href='" + Lumen.DATA_SERVICE_URL_ROOT + "/authenticate.php?action=logout' class='menuLink logoutLink'>Logout</a> " + "<a id='logoutLink' target='_parent' href='" + Lumen.APPLICATION_LINK + "?userInfo=true' class='menuLink logoutLink'>Your Account</a>",
    width: "100%",
    frame: true,
    collapsed: false,
    collapsible: true,
    store: 'Authentication',
    cls: "application-menu-content",

    constructor: function (config) {
        this.items = this.createItems();
        this.callParent(arguments);

        Lumen.getApplication().on(Lumen.MAIN_DISPLAY_REPLACED, this.resetToolbar, this);

        Ext.QuickTips.init();
    },

    // functions to display feedback
    onButtonClick: function (btn) {
        Lumen.msg('Button Click', 'You clicked the "{0}" button.', btn.displayText || btn.text);
    },

    onPendingFunctionality: function (item) {
        Lumen.msg('Menu Click', 'You clicked the "{0}" menu item.', item.text);
    },

    onItemCheck: function (item, checked) {
        Lumen.msg('Item Check', 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
    },

    onItemToggle: function (item, pressed) {
        Lumen.msg('Button Toggled', 'Button "{0}" was toggled to {1}.', item.text, pressed);
    },

    resetToolbar: function () {
        var self = this;
        if (this.adminToolbar) {
            this.adminToolbar.destroy();
        }
        var menu = Ext.create('Ext.menu.Menu', {
            style: {
                overflow: 'visible'     // For the Combo popup
            },
            items: [
                {
                    text: 'Radio Options',
                    menu: {        // <-- submenu by nested config object
                        items: [
                            // stick any markup in a menu
                            '<b class="menu-title">Choose a Theme</b>', {
                                text: 'Aero Glass',
                                checked: true,
                                group: 'theme',
                                checkHandler: self.onItemCheck
                            }, {
                                text: 'Vista Black',
                                checked: false,
                                group: 'theme',
                                checkHandler: self.onItemCheck
                            }, {
                                text: 'Gray Theme',
                                checked: false,
                                group: 'theme',
                                checkHandler: self.onItemCheck
                            }, {
                                text: 'Default Theme',
                                checked: false,
                                group: 'theme',
                                checkHandler: self.onItemCheck
                            }
                        ]
                    }
                }
            ]
        });
        if (Lumen.getApplication().userIsAdmin()) {
            this.adminToolbar = new Ext.toolbar.Toolbar({});  // toolbar is rendered
            this.adminToolbar.add(Ext.create('Ext.button.Button', {
                text: Lumen.i18n("Admissions"),
                handler: self.onButtonClick,
                tooltip: {text: 'Admissions and Enrollment Management', title: 'Admissions'},
                iconCls: 'blist',
                // Menus can be built/referenced by using nested menu config objects
                menu: {
                    items: [{
                        text: Lumen.i18n("Admission Applications"), handler: function () {
                            var grid = Ext.create("Lumen.view.AdmissionApplicationGrid", {});
                            Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: grid});
                        }
                    },
                    /**
                        {
                            text: Lumen.i18n("Enrollment"), handler: function () {
                            var grid = Ext.create("Lumen.view.AdmissionApplicationGrid", {});
                            Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: grid});
                        }
                        }
                     **/
                        {
                            text: Lumen.i18n("Begin a new application"),
                            handler: function () {
                                Lumen.getApplication().fireEvent(Lumen.NEW_APPLICATION);
                            }
                        }
                    /**
                     {
                         text: '<i>' + Lumen.i18n("Financial Aid Applications") + '</i>',
                         handler: self.onPendingFunctionality
                     }
                     **/
                    ]
                }
            }));
            this.adminToolbar.add(
                Ext.create('Ext.button.Button', {
                    text: Lumen.i18n("Students"),
                    handler: self.onButtonClick,
                    tooltip: {text: 'Student and Family Administration', title: 'Student'},
                    iconCls: 'blist',
                    // Menus can be built/referenced by using nested menu config objects
                    menu: {
                        items: [{
                            text: '<b>' + Lumen.i18n("Students") + '</b>', handler: function () {
                                var grid = Ext.create("Lumen.view.StudentParentTree", {});
                                Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: grid});
                            }
                        }
                        /**
                         , {
                                text: '<b>' + Lumen.i18n("Students") + '</b>', handler: function () {
                                    var grid = Ext.create("Lumen.view.PersonGrid", {});
                                    Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: grid});
                                }
                            }
                         **/
                        ]
                    }
                }));
            /**
             this.adminToolbar.add(
             Ext.create('Ext.button.Button', {
                    text: Lumen.i18n("Surveys"),
                    handler: self.onButtonClick,
                    tooltip: {text: 'Student and Family Administration', title: 'Student'},
                    iconCls: 'blist',
                    // Menus can be built/referenced by using nested menu config objects
                    menu: {
                        items: [{
                            text: '<b>' + Lumen.i18n("Applications") + '</b>', handler: self.onPendingFunctionality
                        }, {
                            text: '<i>' + Lumen.i18n("Enrollment") + '</i>', handler: self.onPendingFunctionality
                        }
                        ]
                    }
                }));
             this.adminToolbar.add(
             Ext.create('Ext.button.Button', {
                    text: Lumen.i18n("Attendance"),
                    handler: self.onButtonClick,
                    tooltip: {text: 'Student and Family Administration', title: 'Student'},
                    iconCls: 'blist',
                    // Menus can be built/referenced by using nested menu config objects
                    menu: {
                        items: [{
                            text: '<b>' + Lumen.i18n("Applications") + '</b>', handler: self.onPendingFunctionality
                        }, {
                            text: '<i>' + Lumen.i18n("Enrollment") + '</i>', handler: self.onPendingFunctionality
                        }
                        ]
                    }
                }));
             **/

            menu.add('&#160;');

            Ext.ComponentQuery.query('adminmenu')[0].add(this.adminToolbar);
            return this.adminToolbar;
        }
    },
    addToolbarButtons: function (buttons) {
        this.adminToolbar.add(buttons);
    },
    createItems: function () {
        var items = [
            {
                xtype: 'menu',
                floating: false,
                plain: true,
                border: false,
                items: [
                    //                    {
                    //                        text: 'Early Education',
                    //                        listeners: {
                    //                            'click': {
                    //                                fn:  function() {
                    //                                    var grid = Ext.create("Lumen.view.AdmissionApplicationGrid",{applicationType: 'EarlyEdAdmissions'});
                    //                                    Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: grid, applicationType: 'EarlyEdAdmissions'});
                    //                                }
                    //                            }
                    //                        }
                    //                    },
                    //
                    //                    {
                    //                        text: 'High/Middle School',
                    //                        listeners: {
                    //                            'click': {
                    //                                fn:  function(){
                    //                                    var grid = Ext.create("Lumen.view.AdmissionApplicationGrid",{applicationType: 'HSMSAdmissions'});
                    //                                    Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: grid, applicationType: 'HSMSAdmissions'});
                    //                                }
                    //                            }
                    //                        }
                    //                    },
                    //
                    //                    {
                    //                        text: 'International',
                    //                        listeners: {
                    //                            'click': {
                    //                                fn:  function(){
                    //                                    var grid = Ext.create("Lumen.view.AdmissionApplicationGrid",{applicationType: 'InternationalAdmissions'});
                    //                                    Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: grid, applicationType: 'EarlyEdAdmissions'});
                    //                                }
                    //                            }
                    //                        }
                    //                    },
                    //                    {
                    //                        text: 'All Students',
                    //                        listeners: {
                    //                            'click': {
                    //                                fn:  function(){
                    //                                    var grid = Ext.create("Lumen.view.PersonGrid",{});
                    //                                    Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: grid});
                    //                                }
                    //                            }
                    //                        }
                    //                    },
                    //                {
                    //                    text: 'Under Review'
                    //                },
                    //                {
                    //                    text: 'All Applications'
                    //                }
                ]
            }
        ];
        return items;
    }
});
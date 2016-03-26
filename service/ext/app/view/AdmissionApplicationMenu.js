Ext.define('Lumen.view.AdmissionApplicationMenu', {
    extend: 'Ext.panel.Panel',
    title: "Applications - Admin <a id='logoutLink' href='" + Lumen.DATA_SERVICE_URL_ROOT + "/authenticate.php?action=logout' class='menuLink logoutLink'>Logout</a> " + "<a id='logoutLink' target='_parent' href='" + Lumen.APPLICATION_LINK + "?userInfo=true' class='menuLink logoutLink'>Your Account</a>",
    width: "100%",
    frame: true,
    autoHeight: true,
    hideMode: "offset",
    collapsed: false,
    collapsible: true,
    alias: 'widget.adminmenu',
    constructor: function () {
        //this.items = this.createItems();
        this.callParent(arguments);
        this.store = Lumen.getApplication().getAdmissionApplicationListStore();
        this.addListener({
            afterrender: {
                fn: this.initializeMenu,
                scope: this
            }});
        this.store.addListener({
                load: {
                    fn: this.initializeMenu,
                    scope: this
                }
            });
    },

    initializeMenu: function () {
        var self = this;
        var continueApplicationRow = Ext.DomQuery.select('.notLoggedIn');
        if (continueApplicationRow) {
            Ext.destroy(continueApplicationRow);
        }
        var applicationList = Lumen.getApplication().getAdmissionApplicationListStore();
        var listMenu = this.down('#applicationListMenu');
        listMenu.removeChildEls(function () {
            return true;
        });
        listMenu.removeAll();
        var useGuidance = null;
        applicationList.each(function (record) {
            var childName = "New application";
            var applicationData = record.raw;
            if (applicationData.Child.firstName) {
                var childName = applicationData.Child.firstName;
            }
            if (applicationData.Child.lastName) {
                childName = childName + " " + applicationData.Child.lastName;
            }
            if(applicationData.Status == "Enrolling" || applicationData.Status == "Enrolled" || applicationData.Status == "Admitted") {
                listMenu.add(Ext.create("Ext.Button", {
                    text: "Documents and Payments for: " + childName,
                    listeners: {
                        click: {
                            fn: function () {
                                Lumen.getApplication().fireEvent(Lumen.SHOW_ENROLLMENT_DOCUMENTS, {applicantId: applicationData.ChildId});
                            }
                        }
                    }
                }));
                useGuidance = "paymentPlanGuidance";
            } else if(!applicationData.Status || (applicationData.Status !== "Accepted" && applicationData.Status !== "Bootstrapping")) {
                listMenu.add(Ext.create("Ext.Button", {
                    text: "Application: " + childName,
                    listeners: {
                        click: {
                            fn: function () {
                                Lumen.getApplication().fireEvent(Lumen.SHOW_APPLICATION_FORM, {record: record, type: "AdmissionApplication"})
                            }
                        }
                    }
                }));
                if(!useGuidance) {
                     useGuidance = "continueGuidance";
                }
            } else if(applicationData.Status == "Accepted" || applicationData.Status == "Bootstrapping") {
                listMenu.add(Ext.create("Ext.Button", {
                    text: "Setup Payments and Enroll: " + childName,
                    listeners: {
                        click: {
                            fn: function () {
                                Lumen.getApplication().fireEvent(Lumen.SHOW_ENROLLMENT_DOCUMENTS, {applicantId: applicationData.ChildId, type: "AdmissionApplication"});
                            }
                        }
                    }
                }));
                useGuidance = "enrollmentGuidance";
            }
        });
        var instructionBox = self.down("#instructionGuidanceBox");
        if(useGuidance == "enrollmentGuidance") {
            instructionBox.update(Lumen.I18N_LABELS.enrollmentGuidance1);
        } else if(useGuidance == "paymentPlanGuidance") {
            instructionBox.update(Lumen.I18N_LABELS.paymentPlanGuidance);
        }else if(useGuidance == "continueGuidance") {
            instructionBox.update(Lumen.I18N_LABELS.applicationGuidance2);
        }
        //this.doLayout();
    },
    dockedItems: [

    ],
    initComponent: function () {
        this.items = [
            {
                xtype: "container",
                layout: "hbox",
                autoHeight: true,
                items: [
                    {
                        xtype: "container",
                        layout: "vbox",
                        items: [
                            {
                                xtype: 'menu',
                                itemId: 'applicationListMenu',
                                floating: false,
                                flex: 1,
                                plain: true,
                                border: false,
                                layout: "vbox",
                                items: [
                                    {
                                        text: 'Application',
                                        listeners: {
                                            'click': {
                                                fn: function () {
                                                    Lumen.getApplication().fireEvent(Lumen.NEW_APPLICATION);
                                                    Lumen.getApplication().fireEvent(Lumen.SHOW_APPLICATION_FORM);
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: "button",
                                text: "Begin a new application",
                                itemId: "beginApplicationButton",
                                listeners: {
                                    'click': {
                                        fn: function () {
                                            Lumen.getApplication().fireEvent(Lumen.NEW_APPLICATION);
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: "component",
                        itemId: "instructionGuidanceBox",
                        autoHeight: true,
                        flex: 5,
                        cls: "instructionBox",
                        html: Lumen.I18N_LABELS.applicationGuidance1
                    }
                ]
            }
        ];

        this.callParent(arguments);
        if(Lumen.CLIENT_ID == "khabelestrong") {
            this.down('#beginApplicationButton').destroy();
        }
    }
});
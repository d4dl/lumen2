Ext.define('Lumen.view.AdmissionProcessMenu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.admissionprocessmenu',
    title: "Applications",
    layout: "fit",
    width: "100%",
    frame: true,
    collapsed: false,
    collapsible: true,
    store: 'Authentication',
    cls: "application-menu-content",
    hideMode: "offset",
    constructor: function(config) {
        this.items = this.createItems();
        this.callParent(arguments);
    },
    initComponent: function(config) {
        this.callParent(arguments);
    },

    boxSelected: function(target, newValue, oldValue, opts) {
        var intro = Ext.create("Lumen.view.UIContent",{params: {contentUrl: Lumen.URL_APP_INTRO}});
        Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY,{
            newClient: intro,
            anchorTarget: target.anchorTarget
        });
    },
    createItems: function() {
        var items = [
            {
                xtype: 'menu',
                floating: false,
                plain: true,
                border: false,
                defaults: {
                    //xtype: "component",
                    //disabled: true,
                    readOnly: true,
                    textCls: "menuChecktext",
                    fieldCls: 'menuCheckBoxBox'
                },
                items: [
                    {text: Lumen.I18N_LABELS.visitApplication, anchorTarget: "visitApplication", checked: true, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.signUpForTour, anchorTarget: "signUpForTour", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.requestForGuestDays, anchorTarget: "requestForGuestDays", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.completeApplication, anchorTarget: "completeApplication", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.submitFee, anchorTarget: "submitFee", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.getAdmissionInterview, anchorTarget: "getAdmissionInterview", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.getDeanInterview, anchorTarget: "getDeanInterview", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.attendGuestDays, anchorTarget: "attendGuestDays", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.meetDirector, anchorTarget: "meetDirector", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.submitEvaluationForms, anchorTarget: "submitEvaluationForms", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.councilReview, anchorTarget: "councilReview", checked: false, listeners:{ change: this.boxSelected}},
                    {text: Lumen.I18N_LABELS.letterOfIntent, anchorTarget: "letterOfIntent", checked: false, listeners:{ change: this.boxSelected}}
                ]
            }, {
                xtype: "button",
                text: "Begin a new application",
                listeners: {
                    'click': {
                        fn:  function() {
                            Lumen.getApplication().fireEvent(Lumen.NEW_APPLICATION);
                        }
                    }
                }
            }
        ];
        return items;
    }
});
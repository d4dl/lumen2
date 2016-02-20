Ext.define('Lumen.view.FamilyInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.familyinfo',
    cls: "familyinfo",
    border: 0,
    bodyPadding: 8,
    frame: false,
    items: [
        {
            xtype: "box",
            html: "hello family"
        }
    ]

});
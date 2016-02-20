/**
 * @class Ext.form.field.Checkbox
 * @overrides Ext.form.field.Checkbox
 */
Ext.require('Ext.form.field.Checkbox',
function() {
    Ext.define('Overrides.form.field.Checkbox', {
        requires: ['Ext.form.field.Checkbox'],
        override : 'Ext.form.field.Checkbox',
        fieldBodyCls: "compactRadioWrap",
        fieldCls: 'compactRadio',
        labelCls: 'compactLabel',
        boxLabelCls: 'compactBoxLabel',
        labelAlign: "left",
        padding: "2, 10",
        fieldSubTpl: '<tpl if="boxLabel && boxLabelAlign == \'before\'">'+
            '{beforeBoxLabelTpl}'+
            '<label id="{cmpId}-boxLabelEl" {boxLabelAttrTpl} class="{boxLabelCls} {boxLabelCls}-{boxLabelAlign}" for="{id}">'+
            '{beforeBoxLabelTextTpl}'+
            '{boxLabel}'+
            '{afterBoxLabelTextTpl}'+
            '</label>'+
            '{afterBoxLabelTpl}'+
            '</tpl>'+
            // Creates not an actual checkbox+ but a button which is given aria role="checkbox" (If ARIA is required) and
            // styled with a custom checkbox image. This allows greater control and consistency in
            // styling+ and using a button allows it to gain focus and handle keyboard nav properly.
            '<input type="button" id="{id}" {inputAttrTpl}'+
            '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>'+
            '<tpl if="disabled"> disabled="disabled"</tpl>'+
            '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>'+
            ' class="{fieldCls} {typeCls}" autocomplete="off" hidefocus="true" />'+
            '<tpl if="boxLabel && boxLabelAlign == \'after\'">'+
            '{beforeBoxLabelTpl}'+
            '<div class="align"><label id="{cmpId}-boxLabelEl" {boxLabelAttrTpl} class="{boxLabelCls} {boxLabelCls}-{boxLabelAlign}" for="{id}">'+
            '{beforeBoxLabelTextTpl}'+
            '{boxLabel}'+
            '{afterBoxLabelTextTpl}'+
            '</label></div>'+
            '{afterBoxLabelTpl}'+
            '</tpl>'
    });
}
);
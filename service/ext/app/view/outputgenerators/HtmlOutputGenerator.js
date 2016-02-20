Ext.define('Lumen.view.outputgenerators.HtmlOutputGenerator',{
    border: false,
    cls: "htmlOutput",

    getOutputLabel: function(dataItem, dataItemKey, field) {
        // throw new Error("This must be overridden.");
        var label = Lumen.i18n(field.name);
        return "<span>" + label + "</span>";
    },

    getOutputHtml: function(dataItem, dataItemKey, field) {
        var html = field.html || field.getEl().getHTML();
        //Remove all the forced widths and heights
        html = html.replace(/width:.*?px;/g,"")
        html = html.replace(/height:.*?px;/g,"")
        return html;
    }
});

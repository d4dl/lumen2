Ext.define('Lumen.view.form.ImageDrop', {
    extend: 'Ext.panel.Panel',
    requires: ['Lumen.view.FileDropPlugin'],
    alias: 'widget.imagedrop',
    cls: "imageDrop",
    plugins   : [{
            ptype    : "filedrop",
            readType : "DataURL"
        }
    ],
    listeners : {
        dragover : function(cmp, e) {
            Lumen.log("Dragging");
        },
        drop     : function(cmp, e) {
            Lumen.log("Drop");
        },
        beforeload: function(cmp, file) {
            var imageType = /image.*/;
            var isImage = Ext.isArray(file.type.match(imageType)); //true if an image
        },
        loadstart : function(cmp, e, file) {
            Lumen.log("Starting to Read");
        },
        load     : function(cmp, e, file) {
            Lumen.log("Done Reading");
        },
        loadend   : function(cmp, e, file) {
            Lumen.log("End of Reading");
        },
        loadabort : function(cmp, e, file) {
            Lumen.log("Aborted Reading");
        },
        loaderror : function(cmp, e, file) {
            Lumen.log("Error Reading");
        }
    }

});
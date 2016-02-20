    Ext.define('Lumen.view.AccordionStretch', {
    extend: 'Ext.layout.container.Accordion',
    animate: true,
    alias: 'layout.lumen.accordionstretch',
    autoDestroy: true,
    originalOwnerHeight: 0,
    originalBodyHeight: 0,
    lastCollapsed: null,

    constructor: function() {
        this.callParent(arguments);
    },

    beforeRenderItems: function() {
        var me = this;
        me.callParent(arguments);
        if(!this.listenersSet) {
            this.listenersSet = true;
            var owner = me.owner;
            var fieldsets = owner.query("fieldset");
            for(var i=0; i < fieldsets.length; i++) {
                var fieldset = fieldsets[i];
                fieldset.on("expand", function(){
                    me.adjustHeightForFieldset(fieldset);
                });
            }

            var items = this.getVisibleItems();

            //Find the biggest one.  That's the currently open one.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                item.on("resize", function(){
                    me.adjustHeightForFieldset(item);
                });
            }
        }

    },


    getBiggestChild: function () {
        var items = this.getVisibleItems();
        var biggestChild = null;
        //Find the biggest one.  That's the currently open one.
        for (var i = 0; i < items.length; i++) {
            var currentCandidate = items[i];
            var currentCandidateHeight = currentCandidate.getBox().height;
            if (!biggestChild || (currentCandidateHeight > biggestChild.getBox().height)) {
                biggestChild = currentCandidate;
            }
        }
        return biggestChild;
    },

    changeHeight: function (changeBy) {
        var newHeight = this.originalOwnerHeight - (changeBy);
        var newFinalHeight = newHeight;// + 90;
        var container = this.owner;
        Lumen.log("Changing height by " + changeBy + " pixels.");
        if (container.getHeight() != newFinalHeight) {
            container.setHeight(newFinalHeight);
        }
        //        Ext.create('Ext.fx.Anim', {
        //            target: container,
        //            duration: 1000,
        //            to: {
        //                height: newFinalHeight
        //            }
        //        });
        // callback();
    },

    setNewOwnerHeight: function (newBodyHeight) {
        var difference = this.originalBodyHeight - newBodyHeight;
        this.changeHeight(difference);
    },

    onComponentExpand: function(toExpand) {
        /**
        Lumen.log("-----------------");

        this.collapsing = this.getBiggestChild();
        this.expanding = toExpand;
        //toExpand.expandingNow = true;
        //toExpand.find();
        if(!this.originalOwnerHeight) {
            //The first time a child is expanding set the original heights
            this.originalOwnerHeight = this.owner.getHeight();
            this.originalBodyHeight = this.getBodyHeight(this.collapsing);
            Lumen.log("Original Owner Height: " + this.originalOwnerHeight + ".  Original Body Height: " + this.originalBodyHeight);
        }
        var self = this;
        toExpand.on("resize", function(){
            self.adjustHeightForFieldset(toExpand);
        });

        this.collapsing.on("collapse", this.adjustHeight, this);
         **/
        this.callParent(arguments);
    },

    adjustHeight: function() {
        var newBodyHeight = this.getBodyHeight(this.expanding);
        Lumen.log("After collapse, adjusting height for the new clicked on panel " + this.expanding.title + ".  Height: " + newBodyHeight);
        this.setNewOwnerHeight(newBodyHeight);

        this.collapsing.un("collapse", this.adjustHeight, this);
    },

    adjustHeightForFieldset: function(expanding) {
        var self = this;
//        expanding.on("resize", function() {
//            var height = expanding.getHeight();
//            self.setNewOwnerHeight(height);
//        });
    },

    getBodyHeight: function (item) {
        var body = item.getEl().getById(item.getId() + "-body");
        //item.updateLayout();
        var bodyContent = body.first();
        var bodyHeight = bodyContent.getHeight();
        Lumen.log("The height of " + item.title + " is " + bodyHeight);
        return bodyHeight;
    }
});
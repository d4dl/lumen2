Ext.define('Lumen.controller.util.HtmlExtractor', {
    //debug: true,
    currentLevel: -1,
    createPrintTitle: function(jsonForm) {
        var studentName = Lumen.getApplication().getStudentApplicantName();
        if(jsonForm.baseForm && jsonForm.baseForm.baseParams && jsonForm.baseForm.baseParams.ApplicationType) {
            var applicationType = Lumen.I18N_LABELS[jsonForm.baseForm.baseParams.ApplicationType];
            var title = "<div class='printHeading'><span class='studentName'>"+studentName+"</span><span class='applicationType'>"+applicationType+"</span></div>";
        } else {
            title = "";
        }
        return title;
    },

    getApplicationData: function () {
        var admissionApplicationStore = Lumen.getApplication().getAdmissionApplicationStore();
        var applicationData = {};
        var application = admissionApplicationStore.first();
        if (application) {
            applicationData = application.raw || application.data;
        }
        return applicationData;
    },

    extractApplicationHtml: function (jsonForm, applicationData) {
        var domWalker = new Lumen.controller.util.DomWalker();
        applicationData = applicationData || this.getApplicationData();
        var htmlMessage = "<html><body class='body'><div class='outer'><div class='wrapper'>";
        htmlMessage += this.createPrintTitle(jsonForm);
        var payload = {html: htmlMessage};
        var level = 0;
        domWalker.walkFormDom(jsonForm, applicationData, "", Ext.bind(this.beforeTraverseCallback, this), Ext.bind(this.afterTraverseCallback, this), Ext.bind(this.atLeafValueCallback, this), level, {}, payload);
        //        var componentContainers = this.query("appformloader");
        //        var otherContainers = this.query("[fieldSetComponentContainer]");
        //        componentContainers = componentContainers.concat(otherContainers);
        //        var componentContainers = this.query(">")
        //        for (var i = 0; i < componentContainers.length; i++) {
        //            var formLoader = componentContainers[i];
        //            htmlMessage += this.buildFieldSetComponentHtml(formLoader, true, 0);
        //        }
        //htmlMessage = new Inlinifyer().inlinify(htmlMessage,'inlinifyer.css');
        payload.html += "</div></div></body></html>";
        //Lumen.log("\n\nthepayload after extracted\n" + payload.html);

        return payload.html;
    },


    atLeafValueCallback: function (field, childDataItem, dataItem, childPathPrefix, level, topLevelItem, payload) {
        var html = this.doOutput(field, dataItem, childPathPrefix, level);
        payload.html += html;
    },

    /*
     * Return true to prevent a traversal
     */
    beforeTraverseCallback: function (field, childDataItem, dataItem, childPathPrefix, level, payload) {
        var html = "";
        var thisIsEnough = false;
        if(this.isOutputGenerator(field)) {
            html = this.doOutput(field, dataItem, childPathPrefix, level);
            thisIsEnough = !!html;
            //return "<div class='headingTitle'>" + field.getHeadingTitle() + "</d  iv>"
        } else if(field.title) {
            html = "<div class='subfieldTitle'>" + field.title + "</div>";
        }

        if(html) {
            payload.html = this.appendCloseTagsForLevel(payload.html, level, field.name || field.title);

           /// Lumen.log(this.pad("Opening " + level + " " + " current level " + this.currentLevel, level));
            html = "\n" + this.pad(html, level + 2);
            html = "\n" + this.pad("<div class='fieldSetComponentSection level" + level + "'>"+html, level + 1);
            this.currentLevel = level;
        }
        payload.html += html;
        return thisIsEnough;
    },

    afterTraverseCallback: function(field, childDataItem, dataItem, childPathPrefix, level, payload) {
        payload.html = this.appendCloseTagsForLevel(payload.html, level, field.name || field.title);
    },

    appendCloseTagsForLevel: function (html, targetLevel, fieldName) {
        if (this.currentLevel > -1 && this.currentLevel >= targetLevel) {
            //Lumen.log(this.pad("Closing " + this.currentLevel + " to " + targetLevel, this.currentLevel));
            html = html + "\n" + this.pad("</div>", targetLevel + 1);//close the last tag that was opened at this same level.
            this.currentLevel--;
        }
        return html;
    },

    doOutput: function (field, dataItem, childPathPrefix, level) {
        var retVal = null;
        var html = "";
        var fieldClass = field.cls ? (" " + field.cls) : "";
        var outputGenerator = this.getOutputGenerator(field);
        if (outputGenerator) {
            var outputLabel = outputGenerator.getOutputLabel(dataItem, childPathPrefix, field);
            var outputHtml = outputGenerator.getOutputHtml(dataItem, childPathPrefix, field);
            html = "<div class='fieldSetLabel level" + level + fieldClass + "'>" + outputLabel + "</div>" +
                   "<div class='childComponent level"+level+"'>" + outputHtml + "</div>";
        }

        return html;
    },

    getOutputGenerator: function (field) {
        var outputGenerator = field;
        if (!this.isOutputGenerator(outputGenerator)) {
            outputGenerator = Lumen.getApplication().getOutputGenerator(field.xtype);
        }
        return outputGenerator;
    },


    isOutputGenerator: function (outputGenerator) {
        return (outputGenerator.getOutputLabel && outputGenerator.getOutputHtml);
    },

    pad: function(text, depth) {
        var paddedText = text;
        for(var i=0; i < depth; i++) {
            paddedText = "  " + paddedText;
        }
        return paddedText;
    },

    generatePDF:function (url, fileName, html) {
        var data, canvas, ctx;
        var img = new Image();
        img.onload = function () {
            // Create the canvas element.
            canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            // Get '2d' context and draw the image.
            ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            // Get canvas data URL
            try {
                data = canvas.toDataURL('image/jpeg');

                var pdf = new jsPDF('p','in','letter');

                pdf.addImage(data, 'JPEG', 5, 4, 32, 32);
                pdf.fromHTML(html,0.5,5,
                    {'width':7.5,
                        'elementHandlers': {}
                    }
                );

                pdf.save(fileName);
            } catch (e) {
                error(e);
            }
        }
        // Load image URL.
        try {
            img.src = url;
        } catch (e) {
            error(e);
        }
    }
});

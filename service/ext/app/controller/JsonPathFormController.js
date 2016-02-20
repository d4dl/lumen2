Ext.define('Lumen.controller.JsonPathFormController',{
    extend: 'Ext.app.Controller',
    controlCounter: 0,
    formModelMap: {},
    stores: ['Lumen.store.AdmissionApplication', 'Lumen.store.Authentication', 'Lumen.store.Applicant', 'Lumen.store.JSONForm'],
    init: function (application) {
        var self = this;
        this.formModelMap = {};
        this.exclusivelyBoundForms = [];
        application.on({
            "JSON_PATH_FORM_SUBMIT": this.jsonPathFormSubmit,
            "EXPAND_EVERYTHING": this.expandEverything,
            "LOAD_DOCUMENT_LIST": this.loadDocumentList,
            "EVALUATION_FORM_SUBMIT": this.evaluationFormSubmit,
            "LOGIN_FORM_SUBMIT": this.formSubmit,
            "NEW_APPLICATION": this.newApplication,
            "ADD_EVALUATION": function(opts) {
                this.addEvaluation(opts.evaluationData, opts.parentContainer, opts.renderForPrint, opts.collapsed)
            },
            "BIND_FORM_FIELDS": function(opts) {
                this.visitFormFields(opts.formRoot, opts.data);
                if(this.exclusivelyBoundForms.indexOf(opts.formRoot) < 0) {
                    this.exclusivelyBoundForms.push(opts.formRoot);
                }
            },
            "DESTROY_ALL_FORMS": function(opts) {
                var parentTabContainers = Ext.ComponentQuery.query("jsonformcontainer");
                for(var i=0; i < parentTabContainers.length; i++) {
                    var parentTabContainer = parentTabContainers[i];
                    parentTabContainer.close();
                }
            },
            "REPLACE_MAIN_DISPLAY": function(opts) {
                var formStore = Ext.data.StoreManager.lookup('Lumen.store.JSONForm');
                formStore.removeAll();
                var parentTabContainers = Ext.ComponentQuery.query("jsonformcontainer");
                for(var i=0; i < parentTabContainers.length; i++) {
                    var parentTabContainer = parentTabContainers[i];
                    parentTabContainer.close();
                }
                if(this.tabChangeListener) {
                    this.tabChangeListener.destroy();
                }
                if(this.tabRemoveListener) {
                    this.tabRemoveListener.destroy();
                }
            },
            "UPLOAD_FILE": this.uploadFile,
            "POPULATE_FORM": this.populateForm,
            //"Lumen.FORM_FIELD_EVENT": this.processFormFieldEvent,
            scope: this
        });
    },

    newApplication: function () {
        //REFACTORTODO: Make sure grade works.
        //REFACTORTODO: Make sure multiselect works.
        //REFACTORTODO: Make sure all forms work childinfo address phone parentinfo creditcardform.
        //     Once you have been contacted by our admissions director, please use this form to request teacher evaluations for your child.
        //Mail when 1. receipt for payment, 2. guest days form is sent.  3. Their app is submitted.
        //AND put the user's name in the address for the email.

        //TODO load masks need to be put everywhere using the setLoading method

        Lumen.getApplication().getAdmissionApplicationStore().removeAll();
        var intro = Ext.create("Lumen.view.UIContent",{params: {contentUrl: Lumen.URL_APP_INTRO}});
        Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY,{newClient: intro, removeEverything: true});
    },


    uploadFile: function (opts) {
        var loadMask = new Ext.LoadMask(Ext.getCmp("lumenMainApplication"), {msg:"Saving your application.  Please wait..."});
        var form = Lumen.getApplication().applicationForm;
        var selfy = this;
        Lumen.getApplication().fireEvent(Lumen.JSON_PATH_FORM_SUBMIT,{
            form: form,
            callback: function (application) {
                //I don't think there should ever be a null _id
                opts.applicationId = Lumen.getApplication().getApplicationId();
                Ext.Ajax.request({
                    url: Lumen.DATA_SERVICE_URL_ROOT + "/fileService.php",
                    params: {
                        action: "put",
                        formData: JSON.stringify(opts)
                    },
                    method: "POST",
                    context: this,
                    failure: function (response) {
                        loadMask.hide();
                    },
                    success: function (response,opts) {
                        var fileInfos = JSON.parse(response.responseText);
                        selfy.renderDocumentList([fileInfos], form);
                        loadMask.hide();
                    }
                });
            }
        });
    },

    renderDocumentList: function (fileInfos,formRoot) {
        for (var i = 0; i < fileInfos.length; i++) {
            var html5List = formRoot.query("[documentType=" + fileInfos[i].documentType + "]")[0];
            if(html5List) {
                html5List.add(Ext.create("Ext.Component",{
                    html: "<li class='documentListItem'><a href='" + fileInfos[i].url + "'>" + fileInfos[i].Name + "</a></li>"
                }));
                html5List.ownerCt.doLayout();
                html5List.documentsExist = true;
            }
        }
    },

    loadDocumentList: function(args) {
        var selfy = this;
        if(Lumen.HACK_APPLICATION_ID) {
            Ext.Ajax.request({
                url: Lumen.DATA_SERVICE_URL_ROOT + "/fileService.php",
                params: {
                    action: "list",
                    applicationId: Lumen.HACK_APPLICATION_ID

                },
                method: "POST",
                context: this,
                failure: function (response) {
                    //loadMask.hide();
                },
                success: function (response,opts) {
                    if(response.responseText) {
                        var fileInfos = JSON.parse(response.responseText);
                        selfy.renderDocumentList(fileInfos ,args.formRoot);
                    }
                }
            })
        }
    },

    evaluationFormSubmit: function (args) {
        var loadMask = new Ext.LoadMask(Ext.getCmp("lumenMainApplication"), {
            msg:"Saving your evaluation data.  Please wait..."}
        );
        loadMask.show();
        var evaluationForm = args.evaluationForm;
        var skipValidation = new Lumen.controller.util.QueryData().get("skipValidation");
        var jsonData = JSON.stringify(evaluationForm.evaluationData[0]);
        var htmlMessage = args.fieldSetComponentHtml;

        Ext.Ajax.request({
            url: args.form.url,
            params: {
                action: "save",
                formData: jsonData,
                notifyParams: args.notifyParams
            },
            method: "POST",
            context: this,
            failure: function (response) {
                loadMask.hide();
            },
            success: function (response,opts) {
                if(args.callback) {
                    args.callback(response);
                }
                Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                    notifyParams: {
                        //applicationId: Lumen.getApplication().getApplicationId(),
                        emailTitle: Lumen.getApplication().getStudentApplicantName(),
                        subject: "Completed evaluation received for " + evaluationForm.studentName,
                        link: Lumen.APPLICATION_LINK,
                        templateURL: Lumen.URL_ADMIN_EVAL_RECEIVED_NOTIFICATION,
                        emailTo: "coordinator",
                        message: htmlMessage,
                        substitutions: {
                            "__STUDENT_NAME__": evaluationForm.studentName,
                            "__TEACHER_NAME__": evaluationForm.teacherName
                        }
                    }
                });
                Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION,{
                    notifyParams: {
                        //applicationId: Lumen.getApplication().getApplicationId(),
                        emailTitle: Lumen.getApplication().getStudentApplicantName(),
                        subject: "Evaluation for " + evaluationForm.studentName + " completed by " + evaluationForm.teacherName,
                        link: Lumen.APPLICATION_LINK,
                        templateURL: Lumen.URL_PARENT_EVAL_RECEIVED_NOTIFICATION,
                        notify: evaluationForm.parentEmail,
                        //date: date, date date
                        message: htmlMessage,
                        substitutions: {
                            "__STUDENT_NAME__": evaluationForm.studentName,
                            "__TEACHER_NAME__": evaluationForm.teacherName
                        }
                    }
                });
                loadMask.hide();
            }
        });
    },


    jsonPathFormSubmit: function (args) {
        var store = Lumen.getApplication().getAdmissionApplicationStore();
        store.flush(args)
    },

    //TODO this should be checked for user profile updates.
    //This is only used for the login forms right now.
    //For appication data see the AdmissionApplication.flush method
    formSubmit: function (args) {
        var form = args.form;
        //Flushes the cached form fields.
        delete form._fields;
        this.mergeAndSubmitJSON(form, args.usePopup, args.callback, args.errorCallback);
    },

    mergeAndSubmitJSON: function (form, usePopup, requestCallback, errorCallback) {
        var submitData = {}
        var formData = form.getFields();
        Ext.apply(submitData, form.baseParams);

        for (var i = 0; i < formData.items.length; i++) {
            var dataItem = formData.items[i];
            if(!(dataItem instanceof Ext.form.field.Display)) {
                var value = null;
                //Don't send undefined. It causes a bunch of empty objects to be created.
                if (typeof dataItem.inputValue !== "undefined" && dataItem.value == true) {
                    //This is a checked radio or checkbox
                    value = dataItem.inputValue;
                } else if (typeof dataItem.inputValue == "undefined") {
                    value = dataItem.getValue ? dataItem.getValue() : dataItem.value;
                }
                if (value !== "undefined" && value !== null) {//TODO This is going to be problematic for deletes now isn't it.
                    if(typeof value == "string") {
                        value = value.trim();
                    }
                    var fieldName = dataItem.name;
                    new Lumen.controller.util.JSONPath().find(submitData, fieldName, {create: true, newValue: value});
                }
            }
        }
        var postFormData = {urlEncoded: true};
        for(var key in submitData) {
            postFormData[key] = encodeURIComponent(submitData[key]);
        }
        var jsonData = JSON.stringify(postFormData);
        var popupToken = new Ext.data.UuidGenerator().generate();
        var params = {formData: jsonData};
        if(usePopup) {
            var popUp = window.open(form.url + "?formData=" + jsonData + "&tokenSet=" + popupToken, "token", "height=100,width=20,top=40000,left=40000");
            if (popUp == null || typeof(popUp)=='undefined') {
                alert('You have a pop-up blocker configured. Please disable your pop-up blocker and try again.');
            }
            params.tokenGet = popupToken;
        }

        Ext.Ajax.request({
            url: form.url,
            method: "POST",
            context: this,
            params: params,
            failure: function (response) {
                if (errorCallback) {
                    errorCallback(response);
                }
            },
            success: function (response,opts) {
                if (requestCallback) {
                    requestCallback(response);
                }
            }
        });
    },


    printDebugResponseArray: function(responseArray) {
        var responseArrayString = "";
        for(var i=0; i < responseArray.length; i++) {
            var response = responseArray[i];
            responseArrayString += i + "    q:" + response.Question.Label + "\n";
            var questionResponses = response.ResponseValueArray;
//            for(var j=0; j < questionResponses.length; j++) {
//
//            }
        }
        //Lumen.log(responseArrayString);
    },


    visitFormFields: function(formRoot, applicationData, JSONPathPrefix, renderForPrint, readOnly, hideData) {
        if(this.exclusivelyBoundForms.indexOf(formRoot) < 0) {
            var JSONPath = new Lumen.controller.util.JSONPath();
            //var keys = JSONPath.getKeys(applicationData);

            var domWalker = new Lumen.controller.util.DomWalker();
            var start = new Date().getTime();
            domWalker.walkFormDom(formRoot, applicationData, JSONPathPrefix, Ext.bind(this.beforeTraverseCallback, this), null, Ext.bind(this.atLeafValueCallback, this), 0);
            //Lumen.log("Walked the dom.", start);
            //Lumen.log("All Munged Names\n " + Ext.encode(Lumen.controller.util.DomWalker.mungedNames) + "\n");
            //Lumen.log("All Munges\n " + Ext.encode(Lumen.controller.util.DomWalker.munges) + "\n");
        }
    },

    /**
     * Return false to keep traversing
     * @param field
     * @param childDataItem
     * @return {Boolean}
     */
    beforeTraverseCallback: function (field, childDataItem) {
        if (field.setRenderObject) {
            field.setRenderObject(childDataItem);
        }
        if(field.isXType("evaluationform")) {
            return true;
        } else {
            return false;
        }
    },


    atLeafValueCallback: function (field, childDataItem, dataItem, childPathPrefix, level, topLevelItem) {

        var JSONPath = new Lumen.controller.util.JSONPath();
        //This will fail for empty strings and objects which is the desired behavior.
        //It only unsets values for non container components.
        if (childDataItem && !field.isXType("evaluationform")) {
            if ((!Ext.isObject(childDataItem) || Object.keys(childDataItem).length > 0)) {
                var value = childDataItem;
                if (field instanceof Ext.form.field.Date) {
                    value = new Date();
                    if(childDataItem.sec) {
                        childDataItem = childDataItem.sec * 1000;//this is a mongo db style date.  jeez.
                    } else if(childDataItem < 10000000000) {
                        childDataItem = childDataItem * 1000;
                    }
                    value.setTime(childDataItem);
                }
                //Lumen.log("Setting field value to " + value);
                if(!field.contentIsValue) {
                    field.setValue(value);
                }
            }
            var hasValue = field.contentIsValue || JSONPath.hasValue(childDataItem);
            if(!hasValue  && ((field.isXType("dataformfieldset") || field.isXType("fieldcontainer")) || !field.isXType('container'))) {
            //if(!hasValue  && !field.isXType('container')) {
                childDataItem = undefined;
                //Lumen.log("Unsetting value " + childPathPrefix);
                JSONPath.unSetValue(dataItem, childPathPrefix);
            }
        }
        var boundObject = JSONPath.getValueHolder(childPathPrefix, dataItem);
        if(field.contentIsValue) {
            var value =  field.html || field.getEl().getHTML();
            if(field.subsituteVariables) {
                value = value.replace("__STUDENT_NAME__", Lumen.getApplication().getStudentApplicantName());
                field.html = value;
            }
            JSONPath.setValue(dataItem, childPathPrefix, value);
        } else {
            var bindingKey = JSONPath.getValueKey(childPathPrefix);
            if(bindingKey === "") {
                throw new Error("Wasn't able to create a bindingKey from " + childPathPrefix + " it must have invalid characters.  Remove all non alpha ones.");
            }
            //0 length arrays get returned when empty objects should.
            //The server has no way to distinguish the difference and sends [] when it should send {}.  An object is needed.                                                      field.getEl().getHTML()
            if(Ext.isArray(boundObject) && boundObject.length == 0) {
                boundObject = {};
                JSONPath.setValue(dataItem, JSONPath.getParentPath(childPathPrefix), boundObject);
            }
            //Lumen.log("\nBound to " + JSON.stringify(boundObject));
            //Lumen.log("With Key " + JSON.stringify(bindingKey));
            //if (!field.wasModifiedByJsonPathFormController && (field instanceof Ext.form.RadioGroup && field.ownerCt.name)) {
            //if (!field.wasModifiedByJsonPathFormController) {
            //field.jsonPath = field.name;
            //    var oldName = field.name;
            //    field.name = field.ownerCt.name + "." + field.name;
            //so its jacked up that the name is being modified.
            //but flag it and don't do it ever again.
            //    field.wasModifiedByJsonPathFormController = true;
            //    Lumen.log("Change name from " + oldName + " to: " + field.name);
            //}
            this.bindEXTFieldsToData(bindingKey, boundObject, field, topLevelItem);
        }

        return {childDataItem: childDataItem, value: value, boundObject: boundObject, bindingKey: bindingKey};
    },

    /**
     * All of the 'special' classes particular to this app have custom functionality to
     * bind data.  Eventually the binding functionality should be done magically by this method.
     * There shouldn't need to be any special cases.  This will handle elements that aren't special...
     * They're garden variety ExtJS fields.
     * @param dataItem
     */
    bindEXTFieldsToData: function (bindingKey, boundObject, field, topLevelItem) {
        if(field.destroyableChangeListener) {
            field.destroyableChangeListener.destroy();
        }

        if(!boundObject.debugTag) {
            boundObject.debugTag = (Math.random() * 1000000000000000).toFixed(0);
        }
        var JSONPath = new Lumen.controller.util.JSONPath();
        if(field.setDataItem) {
            field.setDataItem(boundObject);
        } else {
            var changeListener = field.on({
                change: function (target, newValue, oldValue, eOpts) {
                    var fieldValue = field.getValue();
                    var top = topLevelItem;//This is just for debugging.
                    if (fieldValue !== undefined) {
                        if(Ext.isObject(fieldValue) && boundObject[bindingKey]) {
                            Ext.merge(boundObject[bindingKey], fieldValue);
                        } else {
                            if(fieldValue instanceof Date) {
                                fieldValue = fieldValue.getTime() / 1000;
                            }
                            boundObject[bindingKey] = fieldValue;
                            if(field.fieldLabelIsAgreement) {
                                boundObject[bindingKey+"Agreement"] = field.fieldLabel;
                            }
                            if(fieldValue === "") {
                                delete boundObject[bindingKey];
                            }
                        }
                    }
                },
                destroyable: true
            });
            field.destroyableChangeListener = changeListener;
        }
    },

    addEvaluation: function (evaluationData, parentContainer, renderForPrint, collapsed) {
        //If this isn't being accessed by an admin or from a url with an access code its read only.
        var queryData = new Lumen.controller.util.QueryData();
        var accessCode = queryData.get("accessCode");
        var accessCodeIsGood = accessCode && evaluationData.AccessCode && (evaluationData.AccessCode == queryData.get("accessCode"));
        var hideData = !(Lumen.getApplication().userIsAdmin() || accessCodeIsGood);
        var readOnly = !accessCodeIsGood;
        var selfy = this;
        if(evaluationData.EvaluationType) {
            var toVisit = null;
            var evaluationItems;
            if(hideData) {

                evaluationItems = {
                    xtype: "component",
                    evaluationId: evaluationData._id,
                    html: Lumen.I18N_LABELS.hiddenSurveyExplanation,
                    evaluationFieldSet: true//Used to look up.
                }
            } else {
                evaluationItems = {
                    layout: "vbox",
                    readOnly: readOnly,
                    evaluationId: evaluationData._id,
                    evaluationFieldSet: true,//Used to look up.
                    loader: {
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/surveys/"+evaluationData.EvaluationType+".js",
                        autoLoad: true,
                        renderer: "component",
                        loadMask: true,
                        callback: function() {
                            if(!collapsed) {
                                selfy.visitFormFields(toVisit, evaluationData, renderForPrint, !accessCodeIsGood);
                            }
                        }
                    }
                }
            }
            var lastUpdated = "Not yet updated";
            if(evaluationData.Updated) {
                var updatedDate = new Date(evaluationData.Updated * 1000);
                lastUpdated = Ext.Date.format(updatedDate, 'F j, Y, g:i a')
            }
            if(evaluationData.Created) {
                var createdDate = new Date(evaluationData.Created * 1000);
                var created = Ext.Date.format(createdDate, 'F j, Y, g:i a')
            }
            var evaluationFieldSet = Ext.create('Ext.form.FieldSet',{
                title: "Education Survey for " + evaluationData.TeacherName +
                       ".  Date Sent: " + created +
                       " to " + evaluationData.Email + ". Last update: " + lastUpdated,
                collapsible: true,
                collapsed: collapsed,
                items: evaluationItems,

                getHeadingTitle: function() {
                    return this.title;
                }
            });



            toVisit = evaluationFieldSet;


            if(collapsed) {
                evaluationFieldSet.on({
                    expand: function(t, e, opts) {
                        //Fill in the form, rooted in the new evaluationFieldSet
                        //Is missing a level. So its inserted into a fake application.
                        //TODO it looks like the application finder returns applications as an array sometimes and as an object others.
                        //TODO IE is probably still broken.  A good browser check needs to be added.
                        //TODO this only gets populated when the fieldset is expanded.  It should be fixed so it gets populated if its loaded already expanded.
                        this.visitFormFields(evaluationFieldSet, evaluationData, renderForPrint, readOnly, hideData);

                        //TODO this listener needs to be removed.  I commented this out for debugging.
                        t.removeListener("expand", e.expand, e.scope);
                    },
                    scope: this
                })
            } else if(!accessCodeIsGood) {
                evaluationFieldSet.on({
                    afterrender: function() {
                        this.visitFormFields(evaluationFieldSet, evaluationData, renderForPrint, readOnly, hideData);
                        if(Lumen.RENDER_FOR_PRINT) {
                            this.expandEverything(Lumen.getApplication());
                        }
                    },
                    scope: this
                });
            }

            //Find the panel to which the evaluationData should be added and add it.
            //This is specified in evaluationData.Panel


            if(accessCodeIsGood) {//This should be the only thing on the screen
                var newContainer = Ext.create('Ext.container.Container',{

                });
                var mainDisplay = parentContainer.up("#mainDisplay");
                Ext.destroy(parentContainer.up("#menuContainer1"));
                var accessCodeIsGood = evaluationData.AccessCode == accessCode;
                if(mainDisplay && accessCodeIsGood) {
                    mainDisplay.setWidth(Lumen.MAIN_CONTAINER_WIDTH);
                }
                parentContainer.setWidth("100%");
                evaluationFieldSet.setWidth("100%");
                //mainApp.removeAll(true);
                //mainApp.add(newContainer);
                parentContainer.add(evaluationFieldSet);
            } else {
                parentContainer.add(evaluationFieldSet);
                parentContainer.evaluationsExist = true;
                //There is no parentContainer validating when the form is loaded by itself.
                if(parentContainer.validate) {
                    parentContainer.validate(true);
                }
            }
        }
    },

    expandEverything: function () {
        var expandables = Ext.ComponentQuery.query("panel");
        var expandables = expandables.concat(Ext.ComponentQuery.query("fieldset, checkboxgroup"));
        for(var i=0; i < expandables.length; i++) {
            var expandable = expandables[i];
            expandable.expand();
        }
    },

    addSaveButton: function (saveable, subForm, parentTabContainer, dataRoots) {
        var self = this;
        if (saveable.buttonText) {
            var buttons = saveable.query("button[text=" + saveable.buttonText + "]");
            if(dataRoots && buttons.length > 0) {
                for(var i=0; i<buttons.length; i++) {
                    var button = buttons[i];
                    button.destroy();
                }
                buttons = [];
            }
            if (buttons.length == 0) {
                var saveButton = Ext.create("Ext.button.Button", {
                        text: saveable.buttonText,
                        listeners: {
                            'click': {
                                fn: function () {
                                    self.ignoreTabChanges = true;
                                    var JSONPath = new Lumen.controller.util.JSONPath();
                                    //Child is associated with the top level document.
                                    //Its severely special cased here.
                                    if(self.formModelMap[subForm.id]) {
                                        if(self.validateSaveable(subForm, true, false, false)) {
                                            var documentData = self.formModelMap[subForm.id].data;
                                            Ext.Array.each(dataRoots, function(dataRootPath, index, dataRoots) {
                                                var dataRoot = JSONPath.find(documentData, dataRootPath);
                                                if(Ext.isArray(dataRoot)) {
                                                    dataRoot = dataRoot[0];
                                                }

                                                self.saveJSONForm(dataRoot, subForm.documentType, false);
                                            })
                                            self.finalizeSave(parentTabContainer, true);
                                        }
                                    } else {
                                        self.saveDocument(saveable, parentTabContainer, true, true);
                                        self.finalizeSave(parentTabContainer, true);
                                        self.ignoreTabChanges = false;
                                    }
                                }
                            }
                        }
                    });
                saveable.add(saveButton);
            }
        }
    }, 
    
    getSaveableDocuments: function (parentComponent) {
        var saveables = parentComponent.query("[saveableDocument]");
        if (parentComponent.saveableDocument) {
            saveables.push(parentComponent);
        }

        return saveables;
    }, 
    
    /**
     * Populates the fields in the specified forms with the loaded formRoot in the admission application
     * store.
     * @param formRoot the root component containing the form elements
     */
    populateForm: function (options, e, args) {
        var self = this;
        var subForm = options.formRoot;
        this.connectSubmitButtons(subForm);
        var modelToLoad;
        var loadingDataRoot = false;
        if(!options.modelToLoad) {
            if(Lumen.USE_APPLICATION_STORE) {
                modelToLoad = this.getAdmissionApplication(subForm);
            } else {
                modelToLoad = this.getJSONFormData();
                modelToLoad.JSONDebugId = modelToLoad.JSONDebugId || Math.random();
            }
        } else {
            modelToLoad = options.modelToLoad.raw || options.modelToLoad.data || options.modelToLoad;
            if(subForm.id && subForm.dataRoots) {
                this.formModelMap[subForm.id] = {data: modelToLoad, documentType: subForm.documentType};
            }
        }
       // Lumen.log("\n\nPopulating a form: " + subForm.title + (options.modelToLoad ? " with" : " without") + " a specified model to load.");
        this.visitFormFields(subForm, modelToLoad, options.JSONPathPrefix, false, false, false);
        var saveableDocuments = self.getSaveableDocuments(subForm);
        if(saveableDocuments.length > 0) {
            var parentTabContainers = Ext.ComponentQuery.query("jsonformcontainer");
            if(parentTabContainers.length > 1) {
                throw new Error("There's too many tab containers");
            }
            var parentTabContainer = parentTabContainers[0];
            if(parentTabContainer) {
                this.markCompletedFormsComplete(parentTabContainer);
            }
            if(this.tabChangeListener) {
                this.tabChangeListener.destroy();
            }

            this.ignoreTabChanges = false;
//            this.tabChangeListener = parentTabContainer.addListener({beforetabchange: function(tabPanel, newCard, oldCard, eOpts) {
//                if(this.changingTabs || self.ignoreTabChanges) {
//                    return true;
//                } else {
//                    var result = self.saveDocuments(tabPanel.saveableDocument ? [oldCard] : self.getSaveableDocuments(oldCard), parentTabContainer);
//                    return result;
//                }
//            }, destroyable: true});
            if(this.tabRemoveListener) {
                this.tabRemoveListener.destroy();
            }
            if(parentTabContainer) {
                this.tabRemoveListener = parentTabContainer.addListener({beforeremove: function(tabPanel, newCard, oldCard, eOpts) {
                    self.ignoreTabChanges = true;
                }, destroyable: true});

                var saveables = subForm.saveableDocument ? [subForm] : saveableDocuments;
                Ext.Array.each(saveables, function(saveable, index, saveables) {
                    //Dataroot forms need to have a model sent with them
                    //so the button is only added if the form being populated is not a data root
                    // or there was a model sent with it.
                    self.addSaveButton(saveable, subForm, parentTabContainer, subForm.dataRoots);
                    //if(saveable.rendered) {
                    //} else {
                    //    saveable.addListener("afterrender", function(){
                    //        self.addSaveButton(saveable, subForm, parentTabContainer);
                    //    });
                    //}
                });
            }
        }
        if(Lumen.RENDER_FOR_PRINT) {
            this.expandEverything();
        }

    },

    connectSubmitButtons: function(formContainer) {
        var self = this;
        var validateButton = formContainer.down("#saveFormButton");
        if(validateButton) {
             validateButton.on({click: function() {
                 self.saveDocuments(self.getSaveableDocuments(formContainer), formContainer, true);
                 self.saveMappedData();
                 self.finalizeSave(formContainer, true);
             }});
        }
        var finalizeButton = formContainer.down("#finalizeButton");
        if(finalizeButton) {
            finalizeButton.on({click: function() {
                var docsAreValid = self.saveDocuments(self.getSaveableDocuments(formContainer), formContainer, false);
                self.saveMappedData();
                if(docsAreValid) {
                    self.finalizeSave(formContainer, false);
                }
            }});
        }
    },

    saveMappedData: function() {
        for(var formId in this.formModelMap) {
            var documentInfo = this.formModelMap[formId];
            //The only type in the system is Child right now.  Leaving this big obvious hack because
            //frustrated customers are waiting!
            this.saveJSONForm(documentInfo.data.Child, documentInfo.documentType, false);
        }
    },

    finalizeSave: function (parentTabContainer, saveOnly) {
        var documentData = this.buildDocumentDataForServer(parentTabContainer);
        this.markCompletedFormsComplete(parentTabContainer);
        var allSaveablesAreCompleteAndSubmitted = this.allSaveablesAreCompleteAndSubmitted(documentData);

        if (allSaveablesAreCompleteAndSubmitted && !saveOnly) {
            this.notifyAndMarkUpdateStatus(documentData, allSaveablesAreCompleteAndSubmitted);
        } else if(saveOnly) {
            this.notifySaved(allSaveablesAreCompleteAndSubmitted);
        }
    },

    markCompletedFormsComplete: function (parentTabContainer) {
        var formStore = Ext.data.StoreManager.lookup('Lumen.store.JSONForm');
        var formData = formStore.getOrCreateFormData();

        var tabs = parentTabContainer.query('tab');

        var children = parentTabContainer.query(">");
        //start at 1 and end one early to keep the header and footer out.
        for(var j=1; j < children.length - 1; j++) {
            var child = children[j];
            var tab = tabs[j - 1];

            var saveables = this.getSaveableDocuments(child);
            this.validateSaveables(saveables, tab, formData, child, false);
        }

    },

    addSaveablesTabValidityListeners: function (saveables, tab, formData, parentPanel) {
        //Lumen.log("Listener " + parentPanel.title);
        var self = this;
        if(saveables.length == 0) {
            //Lumen.log("Not adding any listeners to " + parentPanel.title + " because there are no saveables.");
        }
        for (var k = 0; k < saveables.length; k++) {
            var saveable = saveables[k];
            var fields = saveable.query('field,checkboxgroup');
            if(fields.length == 0) {
               // Lumen.log("Not adding any listeners to " + saveable.name + " " + " because there are no fields.");
            }
            //Lumen.log("Maybe saveable  " + parentPanel.title + " saveableCount: " + fields.length);
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];

                if (field.saveableValidator) {
                    field.saveableValidator.destroy();
                }
                //Lumen.log("***** Adding saveable listener to " + parentPanel.title + " saveableCount: " + saveables.length + " to " + field.name);
                field.saveableValidator = field.addListener({
                    change: function () {
                        //Lumen.log("Validating " + parentPanel.title + " saveableCount: " + saveables.length + " to " + field.name);
                        self.validateSaveables(saveables, tab, formData, parentPanel, true);
                    },
                    destroyable: true
                });
            }
        }
    },

    validateSaveables: function (saveables, tab, formData, parentPanel, comingFromListener) {
        var self = this;
        this.addSaveablesTabValidityListeners(saveables, tab, formData, parentPanel);
        var allAreValid = true;
        var allAreSubmitted = true;
        for (var k = 0; k < saveables.length; k++) {
            var saveable = saveables[k];
            //Lumen.log("Validating saveable " + saveable.title);
            var isValid = this.validateSaveable(saveable, false, true, comingFromListener);
            if (!isValid) {
                allAreValid = false;
            }
            var saveableData = formData[saveable.name];
            if(saveableData) {
                allAreSubmitted = allAreSubmitted && saveableData.Submitted;
                if(allAreValid) {
                    saveableData.Complete = !!saveableData.Submitted;
                    //Lumen.log("  Setting complete to submitted status " + saveableData.Complete);
                } else {
                   // Lumen.log("  Found an invalid field so setting it to invalid");
                    allAreSubmitted = false;
                    saveableData.Submitted = false;
                    saveableData.Complete = false;
                }
            }
        }
        if (allAreValid && allAreSubmitted) {
            tab.addCls("completeTab");
        } else {
            tab.removeCls("completeTab");
        }
    },

    validateSaveable: function (formRoot, allowSideEffects, validateSilently, comingFromListener) {
        var isValid = true;
        var self = this;
        if(allowSideEffects) {
           var i=0;
        }
        var fields = formRoot.query('field,checkboxgroup')
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];

            var requiredField = (field.allowBlank === false);
            if (requiredField) {
                field.preventMark = !allowSideEffects;//Prevent sencha from making error fields red.
                var fieldIsValid = allowSideEffects ? field.validate() : field.isValid();
                field.preventMark = false;
                if (!fieldIsValid) {
                    isValid = false;
                    self.lastInvalidField = field;
//                    Lumen.log((comingFromListener ?
//                        "  The listener triggered a check and found an" :
//                        "  A call was made to validate which resulted in an") +
//                        " invalid field: " + field.name + ": '" + field.getValue() + "'");
                }
            }
        }
        if(!isValid && !validateSilently) {
            if(self.lastInvalidField.isXType("textarea")) {
                var textAreaParent = self.lastInvalidField.up();
                if(textAreaParent && textAreaParent.isXType("textareafieldset")) {
                    textAreaParent.expand();
                }
            }
            var lastInvalidField = self.lastInvalidField;
            this.expandAllParents(lastInvalidField);
            //if(!lastInvalidField.rendered) {
                self.findAndSelectNonSelectedTab(lastInvalidField);
            //}
            lastInvalidField.getEl().scrollTo("top", 100, {
                duration: 300,
                listeners: {
                    afterAnimate: function() {
                        var popup = Ext.widget('window',{
                            closeAction: "destroy",
                            title: 'Required Fields Missing.',
                            modal: true,
                            html: Lumen.I18N_LABELS.completeAllFieldsBeforeContinuing,
                            bodyStyle: 'padding: 10px 20px;',
                            autoScroll: true,
                            y: lastInvalidField.getXY()[1],

                            buttons: [
                                {
                                    text: 'Ok',
                                    handler: function () {
                                        popup.close();
                                    }
                                }
                            ]
                        });
                        popup.show();
                    }
                }
            });
        }
        return isValid;
    },

    findAndSelectNonSelectedTab: function(childComponent) {
        var tabParent = childComponent.findParentByType("tabpanel");
        var currentParent = childComponent;
        while(currentParent != tabParent) {
            var nextParent = currentParent.up();
            if(nextParent != tabParent) {
                currentParent = nextParent;
            } else {
                break;
            }
        }
        tabParent.setActiveTab(currentParent);
    },

    expandAllParents: function (lastInvalidField) {
        var parent = lastInvalidField.up();
        if(parent) {
            this.expandAllParents(parent);
            if(parent.expand) {
                parent.expand();
            }
        }
        return parent;
    },

    saveDocuments: function (saveableForms, parentTabContainer, saveSilently) {
        var self = this;
        var store = Ext.data.StoreManager.lookup('Lumen.store.Applicant');

        var applicationType = parentTabContainer.applicationType;
        var allAreValid = true;

        var documentData = this.buildDocumentDataForServer(parentTabContainer);
        for(var i=0; i < saveableForms.length; i++) {
            var saveableForm = saveableForms[i];

            var isValid = this.validateSaveable(saveableForm, true, saveSilently, false);
            //var isValid = this.saveDocument(saveableForm, parentTabContainer, false, saveSilently);
            var subDocumentName = saveableForm.name;
            if(subDocumentName && isValid) {
                documentData[subDocumentName].Complete = isValid;
                documentData[subDocumentName].Submitted = isValid;
            }
            //If its not valid, the user was already notified. Don't notify again.
            if(!isValid) {
                saveSilently = true;
            }
            allAreValid = allAreValid && isValid;
        }

        this.saveJSONForm(documentData, "JSONForm", true);
        return allAreValid;
    },

    saveDocument: function (saveableForm, parentTabContainer, changeToNextTab, saveSilently) {
        var self = this;

        var isValid = this.validateSaveable(saveableForm, true, saveSilently, false);

        if (isValid || saveSilently) {
            //var admissionApplicationStore = Lumen.getApplication().getAdmissionApplicationStore();

            var documentData = this.buildDocumentDataForServer(parentTabContainer);
            var subDocumentName = saveableForm.name;
            if(subDocumentName) {
                documentData[subDocumentName].Complete = isValid;
                documentData[subDocumentName].Submitted = isValid;
                this.saveJSONForm(documentData, "JSONForm", true);
            }
        }
        return isValid;
    },


    saveJSONForm: function (documentData, documentType, captureDataId) {
        Lumen.getApplication().fireEvent(Lumen.SAVE_JSON_ENTITY, {
            document: Ext.encode(documentData),
            documentType: documentType || "JSONForm",
            callback: function (savedData) {

                var formStore = Ext.data.StoreManager.lookup('Lumen.store.JSONForm');
                var formData = formStore.getOrCreateFormData();
                if (savedData['_id'] && captureDataId) {
                    formData['_id'] = savedData['_id'];
                }
            }
        });
    },

    /**
     * Retrieves form data from the form store and some user information
     * from the applicant store to create an object representing the entire document
     * to be sent to the server.
     * TODO shouldn't the form binding take care of all this?
     */
    buildDocumentDataForServer: function (parentTabContainer) {
        var store = Ext.data.StoreManager.lookup('Lumen.store.Applicant');
        var formStore = Ext.data.StoreManager.lookup('Lumen.store.JSONForm');
        var formData = formStore.getOrCreateFormData();

        var applicationType = parentTabContainer.applicationType;
        var documentData = {
            applicationType: applicationType,
            ChildId: store.first().getId()
        };
        if (formData["_id"]) {
            documentData["_id"] = formData["_id"];
        }
        /**
         * Even though one document may be being saved, all data needs to
         */
        var saveableForms = Ext.ComponentQuery.query("[saveableDocument]");
        for (var i = 0; i < saveableForms.length; i++) {
            var saveableElement = saveableForms[i];
            documentData[saveableElement.name] = formData[saveableElement.name];
        }
        return documentData;
    },

    notifyAndMarkUpdateStatus: function (documentData) {
        var self = this;

        var JSONFormData = this.getJSONFormData();
        var studentName = "";
        if(JSONFormData.Child && JSONFormData.Child.Person.FirstName) {
            studentName = JSONFormData.Child.Person.FirstName + " " + JSONFormData.Child.Person.LastName;
        }

        Lumen.getApplication().updateApplicationStatus(null, "Enrolling");
        Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
            notifyParams: {
                //applicationId: Lumen.getApplication().getApplicationId(),
                emailTitle: studentName + " " + Lumen.i18n("Enrollment Completed"),
                subject: Lumen.i18n("Enrollment Completed For ") + studentName,
                link: Lumen.APPLICATION_LINK,
                templateURL: Lumen.URL_ENROLLMENT_PROCESSED_NOTIFICATION,
                emailTo: "coordinator",
                substitutions: {
                    "__STUDENT_NAME__": studentName
                }

            }
        });
        var thanksPanel = Ext.create("Ext.panel.Panel", {
            border: false,
            items: [
                {
                    xtype: "component",
                    style: {
                        "font-size": "22px",
                        "border-style": "none"
                    },
                    html:  Lumen.I18N_LABELS.yourEnrollmentisComplete,
                    border: false
                }
            ]
        });
        Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: thanksPanel});
    },

    notifySaved: function (enrollmentIsComplete) {
        var self = this;
        var popup = Ext.widget('window', {
            title: 'Enrollment Saved',
            modal: true,
            closeAction: "destroy",
            html: enrollmentIsComplete ? Lumen.I18N_LABELS.yourEnrollmentisReadyForSubmission : Lumen.I18N_LABELS.yourEnrollmentisNOTComplete,
            bodyStyle: 'padding: 10px 20px;',
            autoScroll: true,
            y: 250,
            buttons: [
                {
                    text: 'Ok',
                    handler: function () {
                        popup.close();
                    }
                }
            ]
        });
        popup.show();
    },

    allSaveablesAreCompleteAndSubmitted: function(savedDocumentMap) {
        for(var key in savedDocumentMap) {
            var document = savedDocumentMap[key];
            //Ignore the id field.
            if(key != "_id" && Ext.isObject(document) && !(document.Submitted && document.Complete)) {
                return false;
            }
        }
        return true;
    },


    getJSONFormData: function () {
        var formStore = Ext.data.StoreManager.lookup('Lumen.store.JSONForm');
        return formStore.getOrCreateFormData();
    },

    getAdmissionApplication: function (formRoot) {
        var admissionApplicationStore = Lumen.getApplication().getAdmissionApplicationStore();
        var applicationData = admissionApplicationStore.first();
        if (applicationData) {
            applicationData = applicationData.raw || applicationData.data;

            var evaluationArray = applicationData.StudentEvaluationArray;
            if (evaluationArray) {
                for (var i = 0; i < evaluationArray.length; i++) {
                    var evaluationData = evaluationArray[i];
                    //Only add the evaluation if the root contains the target panel for the evaluation
                    var evaluationPanel = formRoot.queryById(evaluationData.Panel);
                    if (evaluationPanel) {
                        var evaluationEntries = formRoot.query("[evaluationId=" + evaluationData._id + "]");
                        if (evaluationEntries.length <= 0) {
                            //Only add it if it isn't already there.
                            this.addEvaluation(evaluationData, evaluationPanel, false, true);
                        }

                    }
                }
            }
        } else {
            admissionApplicationStore.add(Ext.create("Lumen.model.AdmissionApplication"));

            var authenticationStore = Lumen.getApplication().getAuthenticationStore();

            var personData = authenticationStore.first() ? authenticationStore.first().raw : null;
            applicationData = admissionApplicationStore.first().data;
            //If the user is not an admin. Make the user the first parent in the application
            if (!Lumen.getApplication().userIsAdmin()) {
                applicationData.Child = {
                    HasChildArray: [
                        {
                            Parental: {
                                Person: personData.Person,
                                _id: personData._id
                            }
                        }
                    ]
                }
            }

        }

        return applicationData;
    }


});
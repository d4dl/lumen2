Ext.define('Lumen.controller.util.DomWalker', {


    /**
     * Iterate over data object populating the form with any data that matches either name
     * or dataItemKey.  dataItemKey shouldn't be usejd. It should always be name. This is controversial
     * given the question response value array strategy... which needs to be resolved.
      * Need to force the buidl to pick these up
     */
    walkFormDom: function (formElementContainer, dataItem, JSONPathPrefix, beforeTraverseCallback, afterTraverseCallback, atLeafValueCallback, level, topLevelItem, payload) {
        var result = "";
        topLevelItem = topLevelItem || dataItem;
        //Lumen.log(level + " topLevelItem " + JSON.stringify(topLevelItem));
        if (formElementContainer.query) {
            var JSONPath = new Lumen.controller.util.JSONPath();
            var fields = formElementContainer.query(">");
            //find all dataformsubfieldset and delete them. use fieldsetcontainer instead
            //fields = fields.concat(form.query("fieldcontainer > [name]"));
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                if (field.xtype == "header") {
                    continue;
                }
                var fieldName = field.name;
                if(fieldName) {
                    fieldName = this.replaceLegacyFieldNames(fieldName, field.xtype);
                }

                //If the field has a name, it can be used for i18n and whatnot.
                //If not and it has the question use it.
                if (!this.hasAGoodFieldName(field) && field.question) {
                    var mungedName = field.question.replace(/[^a-z0-9]/gmi, "").replace(/\s+/g, "");
                    // Lumen.controller.util.DomWalker.munges[mungedName] = field.question;
                    // Lumen.controller.util.DomWalker.mungedNames.push({name: mungedName});
                    field.name = mungedName;
                    fieldName = field.name;
                }
                var isValueField = false;
                if (fieldName && this.shouldContinue(field, topLevelItem)) {
                    if (field.setValue || field.contentIsValue) {
                        isValueField = true;
                    }
                    var isArrayIndex = Ext.isNumeric(fieldName);
                    var childPathPrefix = JSONPathPrefix ? (JSONPathPrefix + (isArrayIndex ? ("[" + fieldName + "]") : ("." + fieldName))) : fieldName;
                    //newValue being empty will force the json data structure to get built even when there aren't values
                    //If its not there and the content is the value, it needs to be created.
                    //If its a saveable document that hasn't been created... same
                    var jsonPathOptions = {create: field.contentIsValue || field.saveableDocument};
                    //if(isArrayIndex)
                    var childDataItem = JSONPath.find(dataItem, childPathPrefix, jsonPathOptions);
                    if (Ext.isArray(childDataItem)) {
                        if (Ext.isObject(childDataItem[0]) && isValueField) {
                            //Special case where there was no data and JSONPath created new data (as it needs to) but
                            //it had no way of determining what kind of data so it just created an object.
                            childDataItem = null;
                        } else {
                            childDataItem = childDataItem[0];
                        }
                    }
                    if (isValueField) {//Its a 'leaf' with a value.  Just set it.
                        atLeafValueCallback(field, childDataItem, dataItem, childPathPrefix, level, topLevelItem, payload);
                        if(payload) {
                           // Lumen.log("\n\nthepayload after atLeafValueCallback\n" + payload.html);
                        }                    }
                }
                if (!isValueField && this.shouldContinue(field, topLevelItem)) {
                    var stop = beforeTraverseCallback(field, childDataItem, dataItem, childPathPrefix, level, payload);
                    if(payload) {
                        //Lumen.log("\n\nthepayload after beforeTraverseCallback\n" + payload.html);
                    }
                    if (!stop) {
                        var traversedData = dataItem;
                        var traversedPath = JSONPathPrefix;
                        var newLevel = level;
                        if (fieldName) {//If there's a name, THEN go down to the next level. Otherwise, don't dig into the data object.
                            traversedData = childDataItem;
                            traversedPath = "";
                            newLevel = level + 1;
                        }
                        this.walkFormDom(field, traversedData, traversedPath, beforeTraverseCallback, afterTraverseCallback, atLeafValueCallback, newLevel, topLevelItem, payload);
                    }

                    if (afterTraverseCallback) {
                        afterTraverseCallback(field, childDataItem, dataItem, childPathPrefix, level, payload);
                        if(payload) {
                            //Lumen.log("\n\nthepayload after afterTraverseCallback\n" + payload.html);
                        }                    }
                }

            }
            return payload;
        }
    },

    //These need to be ordered from most specific to least specific
    legacyFieldNameMap: {
        "Child.Person.Grade":"Child.schoolAttributes.level",
        "Child.Person.BirthDate":"Child.birthDate",
        "Child.Person.Gender":"Child.gender",
        "Parental.Person.AddressArray": "guardian.addressList",
        "Parental.Person.PhoneArray": "guardian.phoneList",
        "Parental.Person.Email": "guardian.emailList[0].emailAddress",
        "Child.Person.DateOfBirth":"Child.birthDate",
        "Parental.Person.HasChildArray":"guardianList",
        "Login.Username":"login.username",
        "Login.Password": "login.password",
        "Child.Person":"Child",
        "ParentalStatus":"parentalStatus",
        "Parental.Person":"guardian",
        "HasChildArray":"guardianList",
        "Person.Email": "emailList[0].emailAddress",
        "Login.Username": "login.username",
        "Person.PhoneArray": "phoneList",
        "Person.AddressArray[0]": "addressList[0]",
        "Street": "street1",
        "Street2": "street2",
        "City": "city",
        "State": "state",
        "PostalCode": "postalCode",
        "Country": "country"
    },


    replaceLegacyFieldNames: function (fieldName, xtype) {
        //Lumen.log("Processing fieldName " + fieldName);
        if(fieldName == "Person" && xtype == "personname") {
            Lumen.log("Kluding Person.personname. Fix this");
            return null;
        }
        //Lumen.log("\"" + fieldName + "\": \"XXX\",")
        for(var key in this.legacyFieldNameMap) {
            var legacyNameIndex = fieldName.indexOf(key);

            //Lumen.log("Processing fieldName " + fieldName)
            if(legacyNameIndex >= 0) {
                var suggestedFieldName = this.legacyFieldNameMap[key];
                var newFieldName = fieldName.replace(key, suggestedFieldName);
                Lumen.log("Found a legacy field name '" + fieldName + "'.  These should all be replaced with '" + newFieldName + "' . Its a legacy format and is no longer valid.");
                fieldName = newFieldName;
            }
        }
        return fieldName;
    },

    shouldContinue: function (currentComponent, topLevelItem) {
        //If the current Element is marked as an exclusiveTopPanel only continue traversing if
        //its sent in as the topLevelItem
        if(currentComponent.exclusiveTopPanel && currentComponent != topLevelItem) {
            //console.log("Exclusive top panel is not the topLevelItem... not continuiing.");
            return false;
        } else if(currentComponent.exclusiveTopPanel) {
            //console.log("Exclusive top panel IS the topLevelItem... Continuing.")
        }
        //console.log("not exclusive panel");
        if(currentComponent.rolePermissions) {
            if(currentComponent.rolePermissions.admin) {
                var isAuthorized = Lumen.getApplication().userIsAdmin();
                var unauthorizedAction = currentComponent.rolePermissions["unauthorizedAction"];
                if(!isAuthorized && unauthorizedAction) {
                    currentComponent[unauthorizedAction]();
                }
                return isAuthorized;
            }
        } else {
            return !currentComponent.skipTraverse;
        }
    },

    /**
     * either no name or there's a hyphen in it.
     * @param fieldName
     * @return {*}
     */
    hasAGoodFieldName: function (field) {
        return (!!field.name && (field.name.indexOf('-') < 0));
    }

});
Lumen.controller.util.DomWalker.munges = {};
Lumen.controller.util.DomWalker.mungedNames = [];

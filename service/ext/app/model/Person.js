Ext.define('Lumen.model.Person', {
    extend: 'Ext.data.Model',
    requires: ["Ext.Ajax"],
    proxy: {
        type: 'ajax',
        url : Lumen.DATA_SERVICE_URL_ROOT + '/userService.php',
        reader: {
            type: 'json'
        }
    },

    fields: [
        {name: "firstName"},
        {name: "lastName"},
        {name: "schoolAttributes.level"},
        {name: "schoolAttributes.role"}
    ],


    hasMany: [{model: 'Lumen.model.Person', name: 'guardianList', associationKeyFunction: function(person, index) {
        var parents = [];
        var hasChildArray = person['guardianList'];
        if(hasChildArray) {
           for(var i=0; i < hasChildArray.length; i++) {
               var parental = hasChildArray[i].Parental;
               if(parental) {
                   parents.push(parental);
               }
           }
        }
        return parents;
    }}]
});
Ext.define('Lumen.model.Person', {
    extend: 'Ext.data.Model',
    //fields: ['FirstName'],
    requires: ["Ext.Ajax"],
    idProperty: 'StudentId',

    fields: [{name: "Person.FirstName"},{name: "Person.LastName"},{name: "School.Grade"},{name: "School.Role"}],
    proxy: {
        type: 'ajax',
        url : Lumen.DATA_SERVICE_URL_ROOT + '/userService.php',
        reader: {
            type: 'json',
            idProperty: '_id.$id',
            root: 'users',
            totalProperty: 'totalCount',
            successProperty: "success"
        },
        extraParams: {
            fields: JSON.stringify({
                "Child": ["FirstName", "LastName", "BirthDate", "Grade"]
            })
        }
    },

    hasMany: [{model: 'Lumen.model.Person', name: 'HasChildArray', associationKeyFunction: function(person, index) {
        var parents = [];
        var hasChildArray = person['HasChildArray'];
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
//    getPersonId: function() {
//        return this.raw._id['$id'];
//    }
    //fields: ['Title', 'FirstName', 'LastName', 'NameSuffix', 'Email', 'Gender', 'Password', 'Username']
    //fields: ['Title', 'FirstName', 'LastName', 'NameSuffix', 'Email', 'Gender', 'Login.Password', 'Login.UserName']

});
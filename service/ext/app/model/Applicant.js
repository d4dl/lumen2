Ext.define('Lumen.model.Applicant', {
    extend: 'Ext.data.Model',
    //fields: ['FirstName'],
    requires: ["Ext.Ajax"],
    idProperty: '_id.$id',
    //idProperty: 'StudentId',

    fields: [{name: 'FirstName'},{name: 'LastName'}],
    proxy: {
        type: 'ajax',
        url : Lumen.DATA_SERVICE_URL_ROOT + '/userService.php',
        reader: {
            type: 'json',
            //idProperty: '_id.$id',
            root: 'users',
            totalProperty: 'totalCount',
            successProperty: "success"
        },
        extraParams: {
            "loadParents": true,
            fields: JSON.stringify({
                "Child": ["FirstName", "LastName", "BirthDate", "Grade", "HasChildArray"]
            })
        }
    }
//    getPersonId: function() {
//        return this.raw._id['$id'];
//    }
    //fields: ['Title', 'FirstName', 'LastName', 'NameSuffix', 'Email', 'Gender', 'Password', 'Username']
    //fields: ['Title', 'FirstName', 'LastName', 'NameSuffix', 'Email', 'Gender', 'Login.Password', 'Login.UserName']

});
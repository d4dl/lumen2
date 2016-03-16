Ext.define('Lumen.model.Applicant', {
    extend: 'Ext.data.Model',
    requires: ["Ext.Ajax"],
    idProperty: 'id',
    //idProperty: 'StudentId',

    fields: [{name: 'firstName'},{name: 'lastName'}],
    proxy: {
        type: 'ajax',
        url : Lumen.DATA_SERVICE_URL_ROOT + '/userService.php',
        reader: {
            type: 'json',
            //idProperty: '_id.$id',
            root: 'users',
            totalProperty: 'totalCount',
            successProperty: "success"
        }
    }

});
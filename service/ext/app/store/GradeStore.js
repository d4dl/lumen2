store: Ext.define('Lumen.store.GradeStore',{
    extend: 'Ext.data.Store',
    fields: ['name'],
    data: (function () {

        var countryNames = [

        ]
        var data = [];
        for(var i=0; i < countryNames.length; i++) {
            data[i] = {name: countryNames[i]};
        }
        return data;
    })()
})
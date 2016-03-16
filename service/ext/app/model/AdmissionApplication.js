Ext.define('Lumen.model.AdmissionApplication',{
    extend: 'Ext.data.Model',
    idProperty: '_id.$id',
    fields: [
        {name: 'ApplicationType'},
        {name: 'Status'},
        {name: 'DateSubmitted'},
        {name: 'ChildId'},
        {name: 'AmountPaid', convert: function(value, record) {
            if(value) {
                return "$" + new Number(value/100).toFixed(2);
            }
        }},
        {name: 'age',convert: function (value,record) {
            //return applicationService.getChildAge(record['Child']);
            var age = "";
            if(record.raw &&
               record.raw.Child &&
               record.raw.Child.Person &&
               record.raw.Child.Person.BirthDate) {
                var childBirthDate = record.raw.Child.Person.BirthDate;
                if(childBirthDate < 10000000000) {
                    var childBirthDate = childBirthDate * 1000;
                }
                var birthDate = new Date(childBirthDate);
                var now = new Date();
                age = now.getYear() - birthDate.getYear();
                if (now.getMonth() == birthDate.getMonth()) {
                    if (now.getDate() > birthDate.getDate()) {
                        age--;
                    }
                } else if (now.getMonth() < birthDate.getMonth()) {
                    age--;
                }
            }
            return age;
        }}
    ]
});

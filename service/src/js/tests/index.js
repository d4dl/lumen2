var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title       : 'Awesome Test Suite',
    hostPageUrl: "../../../index.php",
    preload     : [
        // version of ExtJS used by your application
        '../../../ext/bootstrap.css',
        '../../../ext/ext/ext-dev.js',
        {
            // inject the loader paths right after ExtJS and before the application file
            //text    : Harness.getLoaderPathHook()

            text    : "Ext.Loader.setConfig({enabled: true, paths: {" +
                "'Lumen': '../../../ext/app'," +
                "'Lumen.store': '../../../ext/app/store'," +
                "'Lumen.controller.util': '../../../ext/app/controller/util'," +
                "'Lumen.controller': '../../../ext/app/controller'," +
                "'Lumen.view': '../../../ext/app/view'," +
                "'Lumen.model': '../../../ext/app/model'" +
                "}})"
        },
        '../../../ext/app/controller/JsonPathFormController'
    ]
});

Harness.start(
    '010_sanity.t.js',
    '020_basic.t.js'
);
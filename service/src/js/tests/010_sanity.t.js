// also supports: startTest(function(t) {
StartTest(function(t) {
    t.diag("Sanity");

    t.ok(Ext, 'ExtJS is here');
    t.ok(Ext.Window, '.. indeed');


    t.ok(Lumen.Application, 'My project is here');

    t.done();   // Optional, marks the correct exit point from the test
})
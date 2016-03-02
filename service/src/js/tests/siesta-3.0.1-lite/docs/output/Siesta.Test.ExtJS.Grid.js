Ext.data.JsonP.Siesta_Test_ExtJS_Grid({"tagname":"class","name":"Siesta.Test.ExtJS.Grid","autodetected":{},"files":[{"filename":"Grid.js","href":"Grid2.html#Siesta-Test-ExtJS-Grid"}],"members":[{"name":"clickToEditCell","tagname":"method","owner":"Siesta.Test.ExtJS.Grid","id":"method-clickToEditCell","meta":{}},{"name":"getCell","tagname":"method","owner":"Siesta.Test.ExtJS.Grid","id":"method-getCell","meta":{}},{"name":"getFirstCell","tagname":"method","owner":"Siesta.Test.ExtJS.Grid","id":"method-getFirstCell","meta":{}},{"name":"getFirstRow","tagname":"method","owner":"Siesta.Test.ExtJS.Grid","id":"method-getFirstRow","meta":{}},{"name":"getLastCellInRow","tagname":"method","owner":"Siesta.Test.ExtJS.Grid","id":"method-getLastCellInRow","meta":{}},{"name":"getRow","tagname":"method","owner":"Siesta.Test.ExtJS.Grid","id":"method-getRow","meta":{}},{"name":"matchGridCellContent","tagname":"method","owner":"Siesta.Test.ExtJS.Grid","id":"method-matchGridCellContent","meta":{}},{"name":"waitForRowsVisible","tagname":"method","owner":"Siesta.Test.ExtJS.Grid","id":"method-waitForRowsVisible","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Siesta.Test.ExtJS.Grid","short_doc":"This is a mixin, with helper methods for testing functionality relating to ExtJS grids. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":["Siesta.Test.ExtJS"],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Mixed into</h4><div class='dependency'><a href='#!/api/Siesta.Test.ExtJS' rel='Siesta.Test.ExtJS' class='docClass'>Siesta.Test.ExtJS</a></div><h4>Files</h4><div class='dependency'><a href='source/Grid2.html#Siesta-Test-ExtJS-Grid' target='_blank'>Grid.js</a></div></pre><div class='doc-contents'><p>This is a mixin, with helper methods for testing functionality relating to ExtJS grids. This mixin is being consumed by <a href=\"#!/api/Siesta.Test.ExtJS\" rel=\"Siesta.Test.ExtJS\" class=\"docClass\">Siesta.Test.ExtJS</a></p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-clickToEditCell' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJS.Grid'>Siesta.Test.ExtJS.Grid</span><br/><a href='source/Grid2.html#Siesta-Test-ExtJS-Grid-method-clickToEditCell' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJS.Grid-method-clickToEditCell' class='name expandable'>clickToEditCell</a>( <span class='pre'>grid, rowIndex, colIndex, callback, selector</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method performs either a click or double click on the specified grid cell\n(depending from the clicksToEdit\nconfi...</div><div class='long'><p>This method performs either a click or double click on the specified grid cell\n(depending from the <a href=\"http://docs.sencha.com/extjs/4.2.2/#!/api/Ext.grid.plugin.Editing-cfg-clicksToEdit\">clicksToEdit</a>\nconfig of it's editing plugin), then waits until the <code>input</code> selector appears under the cursor and calls the provided callback.\nThe callback will receive the DOM `&lt;input&gt; element as the 1st argument.</p>\n\n<p>In some browsers the editor is shown with delay, so its highly recommended to use this method when editing cells.\nTypical usage will be:</p>\n\n<pre><code>t.chain(\n    function (next) {\n        t.clickToEdit(grid, 0, 1, next)\n    },\n    function (next, inputEl) {\n        t.type(inputEl, \"my text\", next)\n    }\n)\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>grid</span> : Ext.grid.Panel/String<div class='sub-desc'><p>The grid panel or a ComponentQuery matching a panel</p>\n</div></li><li><span class='pre'>rowIndex</span> : Int<div class='sub-desc'><p>The row index</p>\n</div></li><li><span class='pre'>colIndex</span> : Int<div class='sub-desc'><p>The column index</p>\n</div></li><li><span class='pre'>callback</span> : Function<div class='sub-desc'><p>The callback to call once the <code>input</code> selector appears under the cursor</p>\n</div></li><li><span class='pre'>selector</span> : String<div class='sub-desc'><p>Custom selector to wait for, instead of <code>input</code>.</p>\n</div></li></ul></div></div></div><div id='method-getCell' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJS.Grid'>Siesta.Test.ExtJS.Grid</span><br/><a href='source/Grid2.html#Siesta-Test-ExtJS-Grid-method-getCell' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJS.Grid-method-getCell' class='name expandable'>getCell</a>( <span class='pre'>panel, row, column</span> ) : Ext.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Utility method which returns the cell at the supplied row and col position. ...</div><div class='long'><p>Utility method which returns the cell at the supplied row and col position.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>panel</span> : Ext.panel.Table/String<div class='sub-desc'><p>The panel or a ComponentQuery matching a panel</p>\n</div></li><li><span class='pre'>row</span> : Int<div class='sub-desc'><p>The row index</p>\n</div></li><li><span class='pre'>column</span> : Int<div class='sub-desc'><p>The column index</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Ext.Element</span><div class='sub-desc'><p>The element of the grid cell at specified position.</p>\n</div></li></ul></div></div></div><div id='method-getFirstCell' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJS.Grid'>Siesta.Test.ExtJS.Grid</span><br/><a href='source/Grid2.html#Siesta-Test-ExtJS-Grid-method-getFirstCell' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJS.Grid-method-getFirstCell' class='name expandable'>getFirstCell</a>( <span class='pre'>panel</span> ) : Ext.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Utility method which returns the first grid cell element. ...</div><div class='long'><p>Utility method which returns the first grid cell element.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>panel</span> : Ext.panel.Table/String<div class='sub-desc'><p>The panel or a ComponentQuery matching a panel</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Ext.Element</span><div class='sub-desc'><p>The element of the first cell in the grid.</p>\n</div></li></ul></div></div></div><div id='method-getFirstRow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJS.Grid'>Siesta.Test.ExtJS.Grid</span><br/><a href='source/Grid2.html#Siesta-Test-ExtJS-Grid-method-getFirstRow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJS.Grid-method-getFirstRow' class='name expandable'>getFirstRow</a>( <span class='pre'>panel</span> ) : Ext.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Utility method which returns the first grid row element. ...</div><div class='long'><p>Utility method which returns the first grid row element.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>panel</span> : Ext.panel.Table/String<div class='sub-desc'><p>The panel or a ComponentQuery matching a panel</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Ext.Element</span><div class='sub-desc'><p>The element of the first row in the grid.</p>\n</div></li></ul></div></div></div><div id='method-getLastCellInRow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJS.Grid'>Siesta.Test.ExtJS.Grid</span><br/><a href='source/Grid2.html#Siesta-Test-ExtJS-Grid-method-getLastCellInRow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJS.Grid-method-getLastCellInRow' class='name expandable'>getLastCellInRow</a>( <span class='pre'>panel, row</span> ) : Ext.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Utility method which returns the last cell for the supplied row. ...</div><div class='long'><p>Utility method which returns the last cell for the supplied row.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>panel</span> : Ext.panel.Table/String<div class='sub-desc'><p>The panel or a ComponentQuery matching a panel</p>\n</div></li><li><span class='pre'>row</span> : Int<div class='sub-desc'><p>The row index</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Ext.Element</span><div class='sub-desc'><p>The element of the grid cell at specified position.</p>\n</div></li></ul></div></div></div><div id='method-getRow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJS.Grid'>Siesta.Test.ExtJS.Grid</span><br/><a href='source/Grid2.html#Siesta-Test-ExtJS-Grid-method-getRow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJS.Grid-method-getRow' class='name expandable'>getRow</a>( <span class='pre'>panel, index</span> ) : Ext.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Utility method which returns a grid row element. ...</div><div class='long'><p>Utility method which returns a grid row element.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>panel</span> : Ext.panel.Table/String<div class='sub-desc'><p>The panel or a ComponentQuery matching a panel</p>\n</div></li><li><span class='pre'>index</span> : Int<div class='sub-desc'><p>The row index</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Ext.Element</span><div class='sub-desc'><p>The element corresponding to the grid row.</p>\n</div></li></ul></div></div></div><div id='method-matchGridCellContent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJS.Grid'>Siesta.Test.ExtJS.Grid</span><br/><a href='source/Grid2.html#Siesta-Test-ExtJS-Grid-method-matchGridCellContent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJS.Grid-method-matchGridCellContent' class='name expandable'>matchGridCellContent</a>( <span class='pre'>panel, row, column, string, [description]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This assertion passes if the passed string is found in the passed grid's cell element. ...</div><div class='long'><p>This assertion passes if the passed string is found in the passed grid's cell element.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>panel</span> : Ext.panel.Table/String<div class='sub-desc'><p>The panel or a ComponentQuery matching a panel</p>\n</div></li><li><span class='pre'>row</span> : Int<div class='sub-desc'><p>The row index</p>\n</div></li><li><span class='pre'>column</span> : Int<div class='sub-desc'><p>The column index</p>\n</div></li><li><span class='pre'>string</span> : String/RegExp<div class='sub-desc'><p>The string to find or RegExp to match</p>\n</div></li><li><span class='pre'>description</span> : String (optional)<div class='sub-desc'><p>The description for the assertion</p>\n</div></li></ul></div></div></div><div id='method-waitForRowsVisible' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJS.Grid'>Siesta.Test.ExtJS.Grid</span><br/><a href='source/Grid2.html#Siesta-Test-ExtJS-Grid-method-waitForRowsVisible' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJS.Grid-method-waitForRowsVisible' class='name expandable'>waitForRowsVisible</a>( <span class='pre'>panel, callback, scope, timeout</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Waits for the rows of a gridpanel or tree panel to render and then calls the supplied callback. ...</div><div class='long'><p>Waits for the rows of a gridpanel or tree panel to render and then calls the supplied callback. Please note, that if the store of the grid has no records,\nthe condition for this waiter will never be fullfilled.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>panel</span> : Ext.panel.Table/String<div class='sub-desc'><p>The panel or a ComponentQuery matching a panel</p>\n</div></li><li><span class='pre'>callback</span> : Function<div class='sub-desc'><p>A function to call when the condition has been met.</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>The scope for the callback</p>\n</div></li><li><span class='pre'>timeout</span> : Int<div class='sub-desc'><p>The maximum amount of time to wait for the condition to be fulfilled. Defaults to the <a href=\"#!/api/Siesta.Test.ExtJS-cfg-waitForTimeout\" rel=\"Siesta.Test.ExtJS-cfg-waitForTimeout\" class=\"docClass\">Siesta.Test.ExtJS.waitForTimeout</a> value.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});
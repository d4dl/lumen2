/*

Siesta 3.0.1
Copyright(c) 2009-2015 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.CoverageChart', {
    extend : 'Ext.chart.Chart',
    alias  : 'widget.coveragechart',

    margin  : '35% 35%',
    animate : {
        easing   : 'bounceOut',
        duration : 600
    },

    store : {
        stype  : 'jsonstore',
        fields : ['name', 'value']
    },

    gradients : [
        {
            'id'    : 'v-1',
            'angle' : 0,
            stops   : {
                0   : {
                    color : 'rgb(212, 40, 40)'
                },
                100 : {
                    color : 'rgb(188, 35, 35)'
                }
            }
        },
        {
            'id'    : 'v-2',
            'angle' : 0,
            stops   : {
                0   : {
                    color : 'rgb(180, 216, 42)'
                },
                100 : {
                    color : 'rgb(168, 185, 35)'
                }
            }
        },
        {
            'id'    : 'v-3',
            'angle' : 0,
            stops   : {
                0   : {
                    color : 'rgb(43, 221, 115)'
                },
                100 : {
                    color : 'rgb(33, 190, 100)'
                }
            }
        },
        {
            'id'    : 'v-4',
            'angle' : 0,
            stops   : {
                0   : {
                    color : 'rgb(45, 117, 226)'
                },
                100 : {
                    color : 'rgb(38, 104, 190)'
                }
            }
        }
    ],

    axes : [
        {
            type     : 'Numeric',
            position : 'left',
            fields   : ['value'],
            minimum  : 0,
            maximum  : 100,
            label    : {
                renderer : Ext.util.Format.numberRenderer('0'),
                fill     : '#555'
            },
            grid     : {
                odd  : {
                    stroke : '#efefef'
                },
                even : {
                    stroke : '#efefef'
                }
            }
        },
        {
            type     : 'Category',
            position : 'bottom',
            fields   : ['name'],
            label    : {
                fill : '#555'
            }
        }
    ],

    series : [{
        type     : 'column',
        axis     : 'left',
        yField   : 'value',
        colors : ['url(#v-1)', 'url(#v-2)', 'url(#v-3)', 'url(#v-4)', 'url(#v-5)'],

        label    : {
            display       : 'outside',
            'text-anchor' : 'middle',
            field         : 'value',
            orientation   : 'horizontal',
            fill          : '#aaa',
            renderer      : function (value, label, storeItem, item, i, display, animate, index) {
                return value + '%';
            }
        },

        renderer : function (sprite, storeItem, barAttr, i, store) {
            barAttr.fill = this.colors[i % this.colors.length];
            return barAttr;
        }
    }]
});
Ext.define('Lumen.controller.util.JSONPath',{
    find: function (obj,expr,arg) {
        var P = {
            resultType: arg && arg.resultType || "VALUE",
            result: [],
            normalize: function (expr) {
                var subx = [];
                return expr.replace(/[\['](\??\(.*?\))[\]']/g,function ($0,$1) {
                    return "[#" + (subx.push($1) - 1) + "]";
                }).replace(/'?\.'?|\['?/g,";").replace(/;;;|;;/g,";..;").replace(/;$|'?\]|'$/g,"").replace(/#([0-9]+)/g,function ($0,$1) {
                        return subx[$1];
                    });
            },
            asPath: function (path) {
                var x = path.split(";"), p = "$";
                for (var i = 1, n = x.length; i < n; i++)
                    p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
                return p;
            },
            store: function (p,v) {
                if (p) {
                    P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
                }
                return !!p;
            },
            trace: function (expr,val,path,create,newValue) {
                if (expr) {
                    var x = expr.split(";"), loc = x.shift();
                    x = x.join(";");
                    if (val && (create || val.hasOwnProperty(loc))) {
                        if (!x && newValue !== null && newValue !== undefined) {
                            val[loc] = newValue;
                        } else if (create && !val[loc]) {
                            //Endswith Array, use array.
                            val[loc] = loc.indexOf("Array", loc.length - "Array".length) !== -1 ? [] : {};
                        }
                        var value = val[loc];
                        P.trace(x,value,path + ";" + loc,create,newValue);
                    } else if (loc === "*") {
                        P.walk(loc,x,val,path,function (m,l,x,v,p) {
                            P.trace(m + ";" + x,v,p,create);
                        });
                    } else if (loc === "..") {
                        P.trace(x,val,path,create);
                        P.walk(loc,x,val,path,function (m,l,x,v,p) {
                            typeof v[m] === "object" && P.trace("..;" + x,v[m],p + ";" + m,create);
                        });
                    } else if (/,/.test(loc)) { // [name1,name2,...]
                        for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
                            P.trace(s[i] + ";" + x,val,path,create);
                    } else if (/^\(.*?\)$/.test(loc)) // [(expr)]
                    {
                        P.trace(P.eval(loc,val,path.substr(path.lastIndexOf(";") + 1)) + ";" + x,val,path,create);
                    } else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
                    {
                        P.walk(loc,x,val,path,function (m,l,x,v,p) {
                            if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) {
                                P.trace(m + ";" + x,v,p,create);
                            }
                        });
                    } else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
                    {
                        P.slice(loc,x,val,path);
                    }
                } else {
                    P.store(path,val);
                }
            },
            //        trace: function(expr, val, path) {
            //            if (expr) {
            //                var x = expr.split(";"), loc = x.shift();
            //                x = x.join(";");
            //                if (val && val.hasOwnProperty(loc))
            //                    P.trace(x, val[loc], path + ";" + loc);
            //                else if (loc === "*")
            //                    P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
            //                else if (loc === "..") {
            //                    P.trace(x, val, path);
            //                    P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
            //                }
            //                else if (/,/.test(loc)) { // [name1,name2,...]
            //                    for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
            //                        P.trace(s[i]+";"+x, val, path);
            //                }
            //                else if (/^\(.*?\)$/.test(loc)) // [(expr)]
            //                    P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
            //                else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
            //                    P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
            //                else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
            //                    P.slice(loc, x, val, path);
            //            }
            //            else
            //                P.store(path, val);
            //        },
            walk: function (loc,expr,val,path,f) {
                if (val instanceof Array) {
                    for (var i = 0, n = val.length; i < n; i++)
                        if (i in val) {
                            f(i,loc,expr,val,path);
                        }
                } else if (typeof val === "object") {
                    for (var m in val)
                        if (val.hasOwnProperty(m)) {
                            f(m,loc,expr,val,path);
                        }
                }
            },
            slice: function (loc,expr,val,path) {
                if (val instanceof Array) {
                    var len = val.length, start = 0, end = len, step = 1;
                    loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g,function ($0,$1,$2,$3) {
                        start = parseInt($1 || start);
                        end = parseInt($2 || end);
                        step = parseInt($3 || step);
                    });
                    start = (start < 0) ? Math.max(0,start + len) : Math.min(len,start);
                    end = (end < 0) ? Math.max(0,end + len) : Math.min(len,end);
                    for (var i = start; i < end; i += step)
                        P.trace(i + ";" + expr,val,path);
                }
            },
            eval: function (x,_v,_vname) {
                try { return $ && _v && eval(x.replace(/@/g,"_v")); } catch (e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g,"_v").replace(/\^/g,"_a")); }
            }
        };

        var $ = obj;
        if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
            P.trace(P.normalize(expr).replace(/^\$;/,""),obj,"$",arg && arg.create,arg && arg.newValue);
            return P.result.length ? P.result : [];
        }
    },
    /**
     * Given path=a.b.c and object {a:{b:{c:['0']}}} returns {c:['0']}
     * the innermost obkect
     * @param path
     * @param jsonObj
     * @return {*}
     */
    getValueHolder: function (path, jsonObj) {
        var valueHolder = jsonObj;
        var lastPeriodIndex = path.lastIndexOf(".");
        if (lastPeriodIndex >= 0) {
            var parentPath = path.substring(0, lastPeriodIndex);
            valueHolder = this.find(jsonObj, parentPath, {create: false});
            if (Ext.isArray(valueHolder)) {
                valueHolder = valueHolder[0];
            }
        }
        return valueHolder;
    },
    getParentPath: function(path) {
        var lastPeriodIndex = path.lastIndexOf(".");
        if (lastPeriodIndex >= 0) {
            var parentPath = path.substring(0, lastPeriodIndex);
        }
        return parentPath || "";
    },
    /**
     * Given
     * Given path=a.b.c for object {a:{b:{c:['0']}}} returns c
     */
    getValueKey: function (path) {
        var valueKey = path;
        var lastPeriodIndex = path.lastIndexOf(".");
        if (lastPeriodIndex >= 0) {
            valueKey = path.substring(lastPeriodIndex + 1);
        }
        return valueKey;
    },
    setValue: function(jsonObj, path, value) {
        var valueKey = this.getValueKey(path);
        var valueHolder = this.getValueHolder(path, jsonObj);
        valueHolder[valueKey] = value;
    },
    unSetValue: function(jsonObj, path) {
        var valueKey = this.getValueKey(path);
        var valueHolder = this.getValueHolder(path, jsonObj);
        delete valueHolder[valueKey];
    },
    getKeys: function(jsonObj, prefix, keys) {
        var keys = keys || [];
        var isArray = Ext.isArray(jsonObj);
        for(var key in jsonObj) {
            if(jsonObj.hasOwnProperty(key)) {
                var newKey = prefix ? prefix + (isArray ? ("[" + key + "]") : ("." + key)) : key;
                var value = jsonObj[key];
                if(key == "_id" && jsonObj["_id"]["$id"]) {
                    value = jsonObj["_id"]["$id"];
                }
                if(Ext.isObject(value) || Ext.isArray(value)) {
                    this.getKeys(value, newKey, keys);
                } else {
                    keys.push(newKey);
                }
            }
        }
        return keys;
    },

    hasValue: function (childDataItem) {
        var hasValue = true;
        if (Ext.isObject(childDataItem) && Object.keys(childDataItem).length == 0) {
            hasValue = false;
        } else if (Ext.isArray(childDataItem)) {
            if(childDataItem.length == 0) {
                hasValue = false;
            } else if(Ext.isObject(childDataItem[0]) && Object.keys(childDataItem[0]).length == 0) {
                hasValue = false;
            }
        }
        return hasValue;
    },

});

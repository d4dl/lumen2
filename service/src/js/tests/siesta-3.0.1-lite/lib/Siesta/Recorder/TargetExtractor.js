/*

Siesta 3.0.1
Copyright(c) 2009-2015 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Recorder.TargetExtractor

The type of target, possible options:

- 'css'     css selector
- 'xy'      XY coordinates

*/
Class('Siesta.Recorder.TargetExtractor', {

    has        : {
        lookUpUntil             : 'HTML',

        saveOffset              : true,

        // using node name as a CSS selector optional
        skipNodeNameForCSS      : false,

        ignoreIdRegExp          : function () {
            // match nothing
            return /\0/
        },

        // Ignore all irrelevant or generic classes which will generate unstable selectors
        ignoreClasses           : Joose.I.Array,
        ignoreCssClassesRegExp  : null,
        
        allowNodeNamesForTargetNodes    : true,
        // in theory, we don't need to precisely identify the target node, we are ok with its parent node and offset
        allowParentMatching             : true,

        uniqueDomNodeProperty : 'id'
    },

    methods : {

        initialize : function () {
            this.ignoreCssClassesRegExp = this.ignoreClasses.length ? new RegExp(this.ignoreClasses.join('|')) : /\0/
        },
        
        // return `true` to keep the id, `false` - to ignore it
        ignoreDomId : function (id, dom) {
            return this.ignoreIdRegExp.test(id)
        },
        
        
        // `true` to keep the class
        ignoreCssClass : function (cssClass) {
            return this.ignoreCssClassesRegExp.test(cssClass)
        },
        
        
        jquery : function (domEl) {
            this.rebindJQueryTo(domEl)
            
            return $(domEl)
        },
        
        
        findOffset : function (pageX, pageY, relativeTo) {
            var jqOffset    = this.jquery(relativeTo).offset()
            
//            if (jqOffset.left - Math.round(jqOffset.left) != 0 || jqOffset.top - Math.round(jqOffset.top) != 0) debugger
            
            jqOffset.left   = Math.round(jqOffset.left)
            jqOffset.top    = Math.round(jqOffset.top)
            
            return [ pageX - jqOffset.left, pageY - jqOffset.top ]
        },
        
        
        getCssClasses : function (dom) {
            var classes             = dom.classList
            var significantClasses  = []
            var index               = {}
            
            for (var i = 0; i < classes.length; i++) {
                var cssClass            = classes[ i ]
                
                if (!this.ignoreCssClass(cssClass) && !index[ cssClass ]) {
                    significantClasses.push(cssClass)
                    
                    index[ cssClass ]   = true
                }
            }
            
            return this.processCssClasses(significantClasses)
        },

        
        getCssQuerySegmentForElement : function (dom, isTarget, maxNumberOfCssClasses, lookUpUntil) {
            maxNumberOfCssClasses   = maxNumberOfCssClasses != null ? maxNumberOfCssClasses : 1e10

            // doesn't make sense to use id/css classes for "body" as there's a single such el in the document
            if (dom == dom.ownerDocument.body) return 'body'

            if (this.uniqueDomNodeProperty !== 'id') {
                var domAttrValue = $(dom).attr(this.uniqueDomNodeProperty);

                if (domAttrValue) {
                    return '[' + this.uniqueDomNodeProperty + '=\'' + domAttrValue + '\']';
                }
            }

            // Sizzle doesn't like : or . in DOM ids, need to escape them
            if (dom.id && !this.ignoreDomId(dom.id, dom)) return '#' + dom.id.replace(/:/gi, '\\:').replace(/\./gi, '\\.');
            
            var significantClasses  = this.getCssClasses(dom)
            var nodeName = dom.nodeName.toLowerCase();

            if (significantClasses.length > maxNumberOfCssClasses) significantClasses.length = maxNumberOfCssClasses
            
            if(significantClasses.length > 0) {
                return '.' + significantClasses.join('.');
            } else if (nodeName === 'a' && dom.innerHTML && dom.innerHTML.indexOf('<') < 0 && dom.innerHTML.indexOf('(') < 0 && dom.innerHTML.indexOf(')') < 0){
                // Return readable target for A tags with only text in them
                return 'a:contains(' + dom.innerHTML + ')';
            } else if (isTarget && this.allowNodeNamesForTargetNodes) {
                return dom.nodeName.toLowerCase();
            }

            return null;
        },
        
        
        processCssClasses : function (classes) {
            return classes
        },
        
        
        // if an #id is found then return immediately, otherwise return the 1st specific (matching only 1 node)
        // css query
        findDomQueryFor : function (dom, lookUpUntil, maxNumberOfCssClasses) {
            var target      = dom
            var query       = []
            var doc         = dom.ownerDocument
            
            var foundId     = false
            
            lookUpUntil     = lookUpUntil || doc.body
            
            var needToChangeTarget  = false
            var current     = target
            
            while (current != lookUpUntil) {
                var segment     = this.getCssQuerySegmentForElement(current, current == dom, maxNumberOfCssClasses, lookUpUntil)

                // `getCssQuerySegmentForElement` has returned an object, instead of string - meaning
                // it has already jumped several levels up in the tree
                if (Object(segment) === segment) {
                    // the last node in dom, that has been already examined inside of the `getCssQuerySegmentForElement` (by recognizer probably)
                    current     = segment.current
                    if (segment.target) target = segment.target
                    segment     = segment.segment
                }
                
                // can't reliably identify the target node - no query at all
                if (dom == current && !segment) 
                    if (this.allowParentMatching) {
                        // switching to "parent matching" mode in which we are looking for some parent of original dom
                        needToChangeTarget  = true
                    } else
                        break
                
                if (segment) {
                    if (needToChangeTarget) {
                        target              = current
                        needToChangeTarget  = false
                    }

                    query.unshift(segment)
                    
                    // no point in going further up, id is specific enough, return early
                    if (segment.match(/^#/) || (this.uniqueDomNodeProperty !== 'id' && $(current).attr(this.uniqueDomNodeProperty))) {
                        foundId = true;
                        break
                    }
                }
                
                // may happen if `getCssQuerySegmentForElement` has jumped over several nodes in tree and already reached the exit point
                // TODO check also for current.contains(lookUpUntil) ?
                if (current == lookUpUntil || $.contains(current, lookUpUntil)) break
                
                current         = current.parentNode
            }
            
            var resultQuery
            var hasUniqueMatch      = false
            
            // starting from the last segments we build several queries, until we find unique match
            for (var i = foundId ? 0 : query.length - 1; i >= 0; i--) {
                var parts           = query.slice(i)
                var subQuery        = parts.join(' ')
                var matchingNodes   = this.jquery(lookUpUntil).find(subQuery)
                
                if (matchingNodes.length == 1) 
                    if (matchingNodes[ 0 ] == target) {
                        hasUniqueMatch  = true
                        
                        resultQuery     = { query : subQuery, target : target, foundId : foundId, parts : parts }
                        
                        break
                    } else
                        // found some query that matches a different element, something went wrong
                        return null
                
                // at this point we are testing the whole query and it matches more then 1 dom element
                // in general such query is not specific enough, the only exception is when our dom node
                // is the 1st one in the results
                // in all other cases return null (below) 
                if (i == 0 && matchingNodes[ 0 ] == target) return { query : subQuery, target : target, foundId : foundId }
            }
            
            if (hasUniqueMatch) {
                var matchingParts       = resultQuery.parts
                
                var index               = 1
                
                while (index < matchingParts.length - 1) {
                    if (this.domSegmentIsNotSignificant(matchingParts[ index ])) {
                        var strippedParts   = matchingParts.slice()
                        
                        strippedParts.splice(index, 1)
                        
                        var matchingNodes   = this.jquery(lookUpUntil).find(subQuery)
                        
                        if (matchingNodes.length == 1) {
                            matchingParts.splice(index, 1)
                            // need to keep the index the same, so counter-adjust the following ++
                            index--
                        }
                    }
                    
                    index++
                }
            
                resultQuery.query       = parts.join(' ')
                delete resultQuery.parts
                
                return resultQuery
            }
            
            return null
        },
        
        
        domSegmentIsNotSignificant : function (segment) {
            // id selectors are always significant
            if (/^#/.test(segment)) return false
            
            // tag name - css classes will start with "."
            if (!/^\./.test(segment)) return true
            
            var cssClasses      = segment.split('.')
            
            // remove empty initial element
            cssClasses.shift()
            
            for (var i = 0; i < cssClasses.length; i++)
                if (!/^x-/.test(cssClasses[ i ])) return false

            // if all classes starts with "x-" then this segment is not significant
            return true
        },
        
        
        resolveDomQuery : function (subQuery, lookUpUntil) {
            var matchingNodes   = this.jquery(lookUpUntil).find(subQuery)
            
            return 
        },
        
        
        insertIntoTargets : function (targets, targetDesc, originalTarget) {
            var newTargetDistance   = this.calculateDistance(this.resolveTarget(targetDesc, originalTarget), originalTarget)
            
            for (var i = 0; i < targets.length; i++) {
                var currentTarget   = targets[ i ]
                
                if (currentTarget.type == 'xy') {
                    targets.splice(i, 0 , targetDesc)
                    return
                }
                
                var distance        = this.calculateDistance(this.resolveTarget(currentTarget, originalTarget), originalTarget)
                
                // we assume targets are inserted with "insertIntoTargets" with increasing specifity,
                // so that csq is going after cq, which goes after css
                // in this way even if csq target has same distance it should be inserted before the current target
                if (newTargetDistance <= distance) {
                    targets.splice(i, 0 , targetDesc)
                    return
                }
            }
            
            targets.push(targetDesc)
        },
        
        
        calculateDistance : function (node, deeperNode) {
            var distance    = 0
            
            while (deeperNode && node != deeperNode) {
                distance++
                deeperNode  = deeperNode.parentNode
            }
            
            return distance
        },
        
        
        rebindJQueryTo : function (sampleEl) {
            var doc     = sampleEl.ownerDocument
            var win     = doc.defaultView || doc.parentWindow
            
            $.rebindWindowContext(win)
        },
        
        
        resolveTarget : function (target, sampleEl) {
            if (target.type == 'css') {
                this.rebindJQueryTo(sampleEl)
                
                return $(target.target)[ 0 ]
            }
        },
        
        
        getTargets : function (event) {
            var result              = []
            
            var target              = event.target;
            
            var cssQuery            = this.findDomQueryFor(target)
            
            if (cssQuery) result.push({
                type        : 'css',
                target      : cssQuery.query,
                offset      : this.saveOffset ? this.findOffset(event.x, event.y, cssQuery.target) : null
            })
            
            result.push({
                type        : 'xy',
                target      : [ event.x, event.y ]
            })
            
            return result
        },
        
        
        regExpEscape : function (s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }        
    }
});

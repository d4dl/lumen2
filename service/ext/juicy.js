/**
 * Sticks css from declared stylesheets in the document into the style attributes of elements that are styled
 * by them (in the input html)
 * @constructor
 */
function Inlinifyer() {
    this.createCSSRuleObject = function(stylesArray) {
        var cssObj = {};
        for(_s in stylesArray){
            var S = stylesArray[_s].split(":");
            if(S[0].trim()==""||S[1].trim()=="")continue;
            cssObj[S[0].trim()] = S[1].trim();
        }
        return cssObj;
    }

    /**
     * @param $out - the tmp html content
     * If a stylesheetName is provided styles from it will be used.
     * Otherwise all stylesheets in the document will.
     *  a simple string compare is used to find the stylesheet in the document
     *  with the specified stylesheetName.
     */
    this.interpritAppendedStylesheet = function($out, input, stylesheetName) {
        var stylesheets = $out[0].styleSheets;
        for(var h=0; h < stylesheets.length; h++) {
            var stylesheet = stylesheets[h];
            if(!stylesheetName || (stylesheet.href && stylesheet.href.indexOf(stylesheetName) > 0)) {
                for(r in stylesheet.cssRules) {
                    //try{
                        var rule = stylesheet.cssRules[r];
                            if(!isNaN(rule))break; // make sure the rule exists
                        var $destObj = input.find(rule.selectorText);
                        var obj = rule.cssText.replace(rule.selectorText, '');
                        obj = obj.replace('{','').replace('}',''); // clean up the { and }'s
                        var styles = obj.split(";"); // separate each
                        $destObj.css(this.createCSSRuleObject(styles)); // do the inline styling
//                    } catch (e) { }
                }
            }

        }
    };


    this.isPatternRelevant = function(newHTML, pattern, relevantPatterns) {
        if( newHTML.indexOf(pattern) > -1 )
            relevantPatterns.push(new RegExp(pattern,"i"));
    };

    /**
     * The main method - inflinify
     *	this utilizes two text areas and a div for final output -
     * 		(1) css input textarea for the css to apply
     * 		(2) html content for the css to apply TO
     */
    this.inlinify = function(input, stylesheetName) {
        var input = jQuery(input);
        this.interpritAppendedStylesheet(jQuery(window.document), input, stylesheetName); // apply styles to the document just created

        var relevantPatterns = [];
        var html = input.html();
        this.isPatternRelevant(html, "href=\"", relevantPatterns);
        this.isPatternRelevant(html, "src=\"", relevantPatterns);
        return this.sanitize(html, relevantPatterns );
    };

    this.sanitize = function(html, patterns){
        var ret = html;
        for(var i=0; i<patterns.length; i++){
            ret = this.san(ret, patterns[i])
        }
        return ret;
    };

    /**
     * This method will take HTML and a PATTERN and essentially
     * sanitize the following chars within the HTML with that
     * pattern through a filter:
     *      Currently this only applies to &amp;' -> &
     */
    this.san = function(html, pattern){

        var ret = "";
        var remainingString;
        var hrefIndex;
        for(var i=0; i<html.length; i++){
            remainingString = html.substring(i);
            hrefIndex = remainingString.search(pattern);
            if( hrefIndex === 0 ){
                // actually sanitize the pattern, i.e. href="[sanitize-candidate]"
                // must be encapsulated within quotes, "
                (function(){
                    // get the start of what we will sanitize
                    var startIndex = remainingString.indexOf("\"");
                    // and the end
                    var endIndex = remainingString.indexOf("\"",startIndex+1);
                    // get the data to sanitize
                    var newHREF = html.substring(i+startIndex+1, i+endIndex+1);
                    // here we actually perform the replacement
                    newHREF = newHREF.replace(/&amp;/g, '&');
                    // add the pattern + the new data + a closing quote
                    var regExpStartLen = "/".length;
                    var regExpFlagsLen = "/i".length;
                    ret += String(pattern).substring( regExpStartLen, String(pattern).length - regExpFlagsLen)
                        + newHREF;
                    i += endIndex;
                })();
                continue;
            } else {
                // if we have another href, copy everything until that href index
                if( hrefIndex > 0 ) {
                    ret += html.substring(i, hrefIndex);
                    i = hrefIndex-1;
                } else {
                    // otherwise just add the remaining chars and stop trying to sanitize
                    ret += html.substring(i);
                    break;
                }
            }
        }
        return ret;

    };
}
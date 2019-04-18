if (!window.visionaustralia) {
    window.visionaustralia = {};
}



//MATCH FUNCTION START-----------------------------------------------------------------------------------------------------------
function myMatch(inputText) {
    //Example match function
    //the input to the function is the text in the input field, the output is array of strings. the strings can contain basic formatting
    //markup e.g. "Ab<span style="text-decoration:underline;">er</span>feldy Township"

    var matches = [];

    if (inputText === "") return matches;

    //sample total list of options
    var allOptions = ["Amsterdam", "Rotterdam", "Eindhoven", "Tokyo"];

    var inputTextLC = inputText.toLowerCase();
    var ll = inputText.length;

    for (var i = 0, len = allOptions.length; i < len; i++) {

        var txt = allOptions[i].trim();

        var LCtxt = txt.toLowerCase();

        var n = LCtxt.indexOf(inputTextLC);
        if (n > -1) {
            var newTxt = txt.slice(0, n) + "<span style='text-decoration:underline;'>" + txt.slice(n, n + ll) + "</span>" + txt.slice(n + ll);
            matches.push(newTxt);
        }
    }
    return matches;
}
//MATCH FUNCTION END--------------------------------------------------------------------------------------------------------------




//top level closure
(function () {

    //=== STANDARD FUNCTIONS 

    function gid(s) {
        return document.getElementById(s);
    }

    function gna(s, k) {
        if (k) {
            return s.getElementsByTagName(k);
        } else {
            return document.getElementsByTagName(k);
        }
    }

    function qse(s, k) {
        if (k) {
            return s.querySelector(k);
        } else {
            return document.querySelector(s);
        }
    }

    function ite(elems, f) {
        var len = elems.length;
        for (var i = 0; i < len; i++) {
            f(elems[i]);
        }
    }

    //set or get attribute value
    function att(el, nam, val) {
        if (val) {
            el.setAttribute(nam, val);
        } else {
            return el.getAttribute(nam);
        }
    }

    function css(el, ob, valski) {
        if (valski) {
            el.style[ob] = valski;
            return;
        }
        for (var k in ob) {
            el.style[k] = ob[k];
        }
    }

    function cre(s, ob) {
        var el = document.createElement(s);
        if (ob) {
            for (var k in ob) el.setAttribute(k, ob[k]);
        }
        return el;
    }

    function app(p, el) {
        p.appendChild(el);
    }

    function aft(el, newEl) {
        el.parentNode.insertBefore(newEl, el.nextSibling);
    }

    function rem(el) {
        el.parentNode.removeChild(el);
    }

    function aev(el, typ, f, bub) {
        if (typ.indexOf("on") === 1) typ = typ.slice(2);
        if (bub) {
            el.addEventListener(typ, f, bub);
        } else {
            el.addEventListener(typ, f);
        }
    }

    function trm(s) {
        return s.replace(/^\s+/, "").replace(/\s+$/, "");
    }

    function say(s) {
        //goes to the Windows command window where jpm is run from
        console.log(s);
    }

    function cresvg(s) {
        return document.createElementNS('http://www.w3.org/2000/svg', s);
    }

    //===============================================================================

    //define styles

    var cssSrOnly = {
        position: "absolute",
        clip: "rect(1px, 1px, 1px, 1px)",
        width: "1px",
        height: "1px",
        padding: "0",
        border: "0",
        overflow: "hidden",
        whiteSpace: "nowrap"
    };

    var cssDropdown = {
        listStyleType: "none",
        position: "absolute",
        backgroundColor: "white",
        margin: "1px",
        padding: "1px",
        border: "1px solid lightgrey",
        maxHeight: "200px",
        minWidth: "100px",
        overflow: "auto",
        paddingLeft: "2px",
        right: "auto"
    };

    var cssLi = {
        margin: "0px",
        padding: "0px"
    };

    var cssButton = {
        backgroundColor: "white",
        border: "none",
        outline: "none",
        textAlign: "left",
        textIndent: "2px",
        margin: "0px",
        padding: "0px",
        width: "100%",
        cursor: "pointer"
    };

    var cssButtonFocus = {
        outline: "none",
        backgroundColor: "blue",
        color: "white"
    };

    var cssButtonUnFocus = {
        outline: "none",
        backgroundColor: "white",
        color: "black"
    };

    //=================================================================================================================
    //=================================================================================================================
    //=================================================================================================================


    //ensure public function is called after page load
    function makeAutocomplete(inputId, selectId) {
        aev(document, "DOMContentLoaded", function () {
            makeAutocompleteAfterPageLoad(inputId, selectId);
        });
    }

    function makeAutocompleteAfterPageLoad(inputId, matchFunction) {

        var body = document.body;

        var input = gid(inputId);

        att(input, "autocomplete", "off");

        var live = cre("span");
        att(live, "aria-live", "assertive");
        css(live, cssSrOnly);
        aft(input, live);

        //==========================================
        var desc = cre("span");
        css(desc, cssSrOnly);
        var idCount = 0;
        var idVal = "va-acdc" + idCount;
        while (document.getElementById(idVal)) {
            idCount++;
            idVal = "va-acdc" + idCount;
        }
        att(desc, "id", idVal);
        desc.textContent = "";
        input.parentNode.insertBefore(desc, input);

        if (input.hasAttribute("aria-describedby")) {
            att(input, "aria-describedby", input.getAttribute("aria-describedby") + " " + idVal);
        } else {
            att(input, "aria-describedby", idVal);
        }
        //==========================================

        var noMatches = "No matches";

        var prevText = "";
        var ul;
        var prevIndex = -1;
        var matches = [];
        var buttons;

        //use keyup because only then is the actual character in the input field
        aev(input, "input", function (ev) {

            //if Tab key - ignore
            if (ev.key === "Tab") {
                return;
            }

            //remove spaces at start
            var text = trm(input.value);
            //if no change in text, do nothing
            if (text === prevText) {
                return;
            }


            setTimeout(doRest, 0);

            function doRest() {

                //keep this value for next time keydown event handler is called
                prevText = text;

                //if no matches: insert text "No matches" in ul
                //if some matches: insert the matches in ul
                //ul is only removed if you select an option OR click outside the input field

                //remove options
                removeUlContent();

                if (!ul) {
                    ul = cre("div", {
                        role: "list",
                        class: "vaautocomplete"
                    });
                    css(ul, cssDropdown);

                    aft(live, ul);
                    //add event handler to body
                    aev(body, "click", removeUl);
                }

                //store buttons to add event handlers afterwards
                buttons = [];

                //fill matches array with matching items
                matches = matchFunction(text);

                //if no matches
                if (matches.length === 0) {

                    if (input.value !== "") {

                        //lazy - use fake button so CSS is the same
                        var VOItem = cre("button", {
                            role: "presentation"
                        });
                        VOItem.innerHTML = "No matches";
                        css(VOItem, cssButton);

                        aev(VOItem, "click", function () {
                            removeUlContent();
                            removeUl();
                            input.focus();
                            prevText = input.value;
                        });

                        aev(VOItem, "focus", function () {
                            css(this, cssButtonFocus);
                        });

                        aev(VOItem, "blur", function () {
                            css(this, cssButtonUnFocus);
                        });

                        //ADD DOWN ARROW event handler
                        aev(VOItem, "keydown", function (ev) {
                            //escape
                            if (ev.key === "Escape" || ev.key === "Esc") {
                                removeUlContent();
                                input.focus();
                            }
                        });

                        aev(VOItem, "keydown", function (ev) {
                            //uparrow
                            if (ev.key === "ArrowUp" || ev.key === "Up") {
                                input.focus();
                                //removeUlContent();
                            }
                        });

                        var li = cre("div", {
                            role: "listitem"
                        });
                        css(li, cssLi);

                        app(li, VOItem);
                        app(ul, li);

                        buttons.push(VOItem);

                        live.innerHTML = "No matches";

                    } else {
                        removeUlContent();
                        removeUl();
                        return;
                    }
                }

                addMatches(matches, ul);

                //recursive function
                function addMatches(matches, container) {
                    //adds <li> elements to <ul> element (container)

                    if (matches.length === 0) return;


                    //2017   
                    if (matches.length === 1) {
                        live.innerHTML = "One match";
                    } else {
                        live.innerHTML = matches.length + " matches";
                    }


                    var lastListItem = null;

                    //add matches to list
                    for (var i = 0, len = matches.length; i < len; i++) {

                        if (matches[i] instanceof Array) {
                            var listEl = cre("div", {
                                "role": "list"
                            });
                            if (!lastListItem) {
                                var listIt = cre("div", {
                                    "role": "listitem"
                                });
                                css(listIt, cssLi);
                                addMatches(matches[i], listEl);
                                listIt.appendChild(listEl);
                                container.appendChild(listIt);
                            } else {
                                addMatches(matches[i], listEl);
                                lastListItem.appendChild(listEl);
                            }
                            continue;
                        }

                        var textVal = matches[i];

                        var VOItem = cre("button", {
                            "role": "presentation"
                        });
                        VOItem.innerHTML = textVal;
                        att(VOItem, "aria-label", VOItem.textContent);
                        css(VOItem, cssButton);

                        //this closes the visible options and finalses selection
                        aev(VOItem, "click", buttonClick);

                        aev(VOItem, "focus", buttonFocus);

                        aev(VOItem, "blur", buttonUnFocus);

                        buttons.push(VOItem);

                        lastListItem = cre("div", {
                            "role": "listitem"
                        });
                        lastListItem.appendChild(VOItem);
                        container.appendChild(lastListItem);
                    }

                    function buttonFocus() {
                        css(this, cssButtonFocus);
                    }

                    function buttonUnFocus() {
                        css(this, cssButtonUnFocus);
                    }

                    function buttonClick() {
                        //place text of selected item in input field
                        input.value = this.textContent;

                        //remove visible drop-down
                        removeUlContent();
                        removeUl();

                        //place focus on input element
                        input.focus();
                        //ensure that options do not show next time input field gets a keypress
                        prevText = input.value;

                    }
                }

                position(input, ul);

                //add event handlers to buttons, bar first and last
                for (var k = 1, klen = buttons.length - 1; k < klen; k++) {
                    //ADD DOWN ARROW event handler
                    aev(buttons[k], "keydown", addKeydown(k));
                }


                function addKeydown(k) {
                    return function (ev) {
                        //escape
                        if (ev.key === "Escape" || ev.key === "Esc") {
                            removeUlContent();
                            removeUl();
                            input.focus();

                            //if downarrow - move keyboard focus to the select element
                        } else if (ev.key === "ArrowDown" || ev.key === "Down") {

                            buttons[k + 1].focus();
                            ev.preventDefault();

                            //uparrow
                        } else if (ev.key === "ArrowUp" || ev.key === "Up") {

                            buttons[k - 1].focus();
                            ev.preventDefault();
                        }
                    };
                }

                if (buttons.length > 1) {
                    //add event handlers to first button
                    var VOItem = buttons[0];
                    aev(VOItem, "keydown", function (ev) {
                        //escape
                        if (ev.key === "Escape" || ev.key === "Esc") {
                            removeUlContent();
                            removeUl();
                            input.focus();
                            //if downarrow
                        } else if (ev.key === "ArrowDown" || ev.key === "Down") {

                            buttons[1].focus();

                            ev.preventDefault();
                            //ev.stopPropagation(); xxxx
                            //uparrow
                        } else if (ev.key === "ArrowUp" || ev.key === "Up") {

                            input.focus();
                            ev.preventDefault();
                        }
                    });

                    //add event handlers to last button
                    VOItem = buttons[klen];
                    aev(VOItem, "keydown", function (ev) {
                        //escape
                        if (ev.key === "Escape" || ev.key === "Esc") {
                            removeUlContent();
                            removeUl();
                            input.focus();
                            //if downarrow
                        } else if (ev.key === "ArrowDown" || ev.key === "Down") {

                            ev.preventDefault();
                            //uparrow
                        } else if (ev.key === "ArrowUp" || ev.key === "Up") {

                            buttons[klen - 1].focus();
                            ev.preventDefault();
                        }
                    });

                } else if (buttons.length == 1) {
                    var VOItem = buttons[0];
                    aev(VOItem, "keydown", function (ev) {
                        //escape
                        if (ev.key === "Escape" || ev.key === "Esc") {
                            removeUlContent();
                            removeUl();
                            input.focus();
                            //if downarrow
                        } else if (ev.key === "ArrowDown" || ev.key === "Down") {
                            ev.preventDefault();
                            //uparrow
                        } else if (ev.key === "ArrowUp" || ev.key === "Up") {
                            input.focus();
                            ev.preventDefault();
                        }
                    });
                }

                aft(live, ul);

                //end doRest doRest doRest doRest doRest doRest doRest doRest doRest doRest doRest doRest
            }
            //end on input
        });

        aev(input, "focus", function (ev) {
            if (live.textContent === "") {
                //xxxxxxxxxxxxxxxxxxx ?????
            }
        });

        aev(input, "keydown", function (ev) {
            //down arrow, move to suggestions
            if (ev.key === "ArrowDown" || ev.key === "Down") {
                if (ul) {
                    setTimeout(function () {
                        buttons[0].focus();
                    }, 100);
                }
                ev.preventDefault();
            } else if (ev.key === "Escape" || ev.key === "Esc") {
                removeUlContent();
                removeUl();
                ev.preventDefault();
            }
        });


        function removeUlContent() {
            //iterating over cildren to remove gives error
            // if(ul) ite(ul.children,function(el){rem(el);}); 
            if (ul) ul.innerHTML = "";
            //reset array of visible options
            VOArray = [];
            //reset index of current selection
            prevIndex = -1;
        }

        function removeUl() {
            if (ul) {
                rem(ul);
                ul = null;
                if (live) live.innerHTML = "";
                //remove eventlistener from body
                body.removeEventListener("click", removeUl);
            }
        }
        aev(window, "resize", function () {
            position(input, ul);
        });

        //distance between input element element and visible options
        var topOffset = 3;
        var leftOffset = 0;

        function position(original, newcomer) {
            if (!newcomer) return;

            var tt = original.offsetTop + original.offsetHeight;
            var ll = original.offsetLeft;

            css(newcomer, {
                "top": (tt + topOffset) + "px",
                "left": (ll + leftOffset) + "px"
            });
        }

    } //end makeAutoComplete

    //add public function
    window.visionaustralia.makeAutocomplete = makeAutocomplete;

    //end top level closure
})();








//Multiselect autocomplete XXXX add an svgredraw on windows resize ----------------------------------------------------------------------------------------------
//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

//top level closure
(function () {

    //=== STANDARD FUNCTIONS 

    function gid(s) {
        return document.getElementById(s);
    }

    function gna(s, k) {
        if (k) {
            return s.getElementsByTagName(k);
        } else {
            return document.getElementsByTagName(k);
        }
    }

    function qse(s, k) {
        if (k) {
            return s.querySelector(k);
        } else {
            return document.querySelector(s);
        }
    }

    function ite(elems, f) {
        var len = elems.length;
        for (var i = 0; i < len; i++) {
            f(elems[i]);
        }
    }

    //set or get attribute value
    function att(el, nam, val) {
        if (val) {
            el.setAttribute(nam, val);
        } else {
            return el.getAttribute(nam);
        }
    }

    function css(el, ob, valski) {
        if (valski) {
            el.style[ob] = valski;
            return;
        }
        for (var k in ob) {
            el.style[k] = ob[k];
        }
    }

    function cre(s, ob) {
        var el = document.createElement(s);
        if (ob) {
            for (var k in ob) el.setAttribute(k, ob[k]);
        }
        return el;
    }

    function app(p, el) {
        p.appendChild(el);
    }

    function aft(el, newEl) {
        el.parentNode.insertBefore(newEl, el.nextSibling);
    }

    function rem(el) {
        if (!el) return;
        el.parentNode.removeChild(el);
    }

    function aev(el, typ, f, bub) {
        if (typ.indexOf("on") === 1) typ = typ.slice(2);
        if (bub) {
            el.addEventListener(typ, f, bub);
        } else {
            el.addEventListener(typ, f);
        }
    }

    function trm(s) {
        return s.replace(/^\s+/, "").replace(/\s+$/, "");
    }

    function cresvg(s) {
        return document.createElementNS('http://www.w3.org/2000/svg', s);
    }

    function say(s) {
        //goes to the Windows command window where jpm is run from
        console.log(s);
    }


    //===============================================================================

    //define styles

    var cssSrOnly = {
        position: "absolute",
        clip: "rect(1px, 1px, 1px, 1px)",
        width: "1px",
        height: "1px",
        padding: "0",
        border: "0",
        overflow: "hidden",
        whiteSpace: "nowrap"
    };

    var cssDropdown = {
        listStyleType: "none",
        position: "absolute",
        backgroundColor: "white",
        margin: "1px",
        padding: "1px",
        border: "1px solid grey",
        maxHeight: "200px",
        minWidth: "100px",
        overflowY: "scroll",
        paddingLeft: "2px",
        right: "auto"
    };

    var cssLi = {
        margin: "0px",
        padding: "0px"
    };

    //button in dropdown and button in div (selected items)
    var cssButton = {
        backgroundColor: "white",
        border: "none",
        outline: "none",
        textAlign: "left",
        textIndent: "2px",
        margin: "auto",
        padding: "0px",
        width: "100%",
        cursor: "pointer",
        lineHeight: "12px"
    };

    var cssButtonFocus = {
        outline: "none",
        backgroundColor: "#4080F4",
        color: "white"
    };

    var cssButtonUnFocus = {
        outline: "none",
        backgroundColor: "white",
        color: "black"
    };


    /* multi select */ //overflow:"hidden", was removed
    var cssContainer = {
        position: "relative",
        border: "0",
        height: "auto",
        padding: "0 4px 1px 0",
        display: "block",
        width: "auto",
        maxWidth: "300px",
        fontFamily: "Arial",
        fontSize: "12px",
        backgroundColor: "transparent",
    };

    //Important: keep top padding, if not svg border will not be true
    var cssSelList = {
        position: "absolute",
        zIndex: "40",
        display: "inline-block",
        margin: "0",
        padding: "1px 0 0 1px"
    };

    //Important: ensure cssSelListItem and cssInput have same top and bottom margins.
    //If not, the svg border will not be true
    var cssSelListItem = {
        display: "inline-block",
        margin: "4px 0px 4px 4px",
        padding: "0px 4px 0px 4px",
        border: "1px solid grey",
        outline: "0",
        borderRadius: "6px",
        boxSizing: "border-box",
        verticalAlign: "middle",
        height: "24px",
        lineHeight: "24px"
    };

    var cssInput = {
        position: "relative",
        zIndex: "40",
        border: "1px solid grey",
        outline: "0",
        display: "inline-block",
        margin: "4px 0px 4px 4px",
        padding: "0",
        textIndent: "4px",
        boxSizing: "border-box",
        height: "22px",
        width: "95%"
    };


    var SVGx = '<svg width="11px" height="11px" viewBox="0 0 100 100" focusable="false" style="background:none;opacity:0.4;"><path d="M 20,20 l 60,60 M 20,80 l 60,-60" style="stroke:#303030;stroke-width:12;stroke-linecap:round;"/></svg>';

    var SVGc = '<svg width="16px" height="16px" viewBox="0 0 100 100" focusable="false" style="background:none;"><path d="M 20,20 l 60,60 M 20,80 l 60,-60" style="stroke:#303030;stroke-width:12;stroke-linecap:round;"/></svg>';

    var svgBorder;
    var path;
    var ulSel;
    var input;
    var div;
    //=================================================================================================================
    //=================================================================================================================
    //=================================================================================================================


    //ensure public function is called after page load
    function makeAutocompleteMulti(inputId, selectId) {
        aev(document, "DOMContentLoaded", function () {
            makeAutocompleteAfterPageLoad(inputId, selectId);
        });
    }


    function makeAutocompleteAfterPageLoad(inputId, matchFunction) {

        var body = document.body;

        input = gid(inputId);
        css(input, cssInput);
        var inputLabel = qse("label[for=" + inputId + "]");

        att(input, "autocomplete", "off");

        //==================
        div = input.parentNode;
        css(div, cssContainer);
        //list of selected items
        ulSel = cre("div", {
            role: "list"
        });
        css(ulSel, cssSelList);
        div.insertBefore(ulSel, div.firstChild);


        svgBorder = cresvg("svg");
        css(svgBorder, {
            background: "none",
            position: "absolute",
            border: "0",
            "top": "0",
            left: "0"
        });
        path = cresvg("path");
        css(path, {
            "stroke": "#222222",
            "stroke-width": "1",
            "stroke-linecap": "round",
            "fill": "white"
        });
        svgBorder.appendChild(path);
        att(svgBorder, "style", "background:none;position:absolute;border:0;");
        att(svgBorder, "focusable", "false");
        svgBorder.className = "border";
        div.insertBefore(svgBorder, div.firstChild);


        var liSel = cre("div", {
            role: "listitem",
            tabindex: "-1"
        });
        css(liSel, cssSrOnly);
        var nv = "No values selected";
        liSel.textContent = nv;
        ulSel.appendChild(liSel);
        var selectedOptions = {};
        var selCount = 0;
        //==================

        var live = cre("span");
        att(live, "aria-live", "assertive");
        css(live, cssSrOnly);
        aft(input, live);

        //==================
        var desc = cre("span");
        css(desc, cssSrOnly);
        var idCount = 0;
        var idVal = "va-acdc" + idCount;
        while (document.getElementById(idVal)) {
            idCount++;
            idVal = "va-acdc" + idCount;
        }
        att(desc, "id", idVal);
        desc.textContent = "";
        div.insertBefore(desc, input);

        if (input.hasAttribute("aria-describedby")) {
            att(input, "aria-describedby", input.getAttribute("aria-describedby") + " " + idVal);
        } else {
            att(input, "aria-describedby", idVal);
        }
        aev(div, "click", function (ev) {
            if (ev.target === this || ev.target === ulSel) input.focus();
        });
        //==================

        var prevText = "";
        var ul;
        var buc;
        var prevIndex = -1;
        var matches = [];
        var buttons;

        //use keyup because only then is the actual character in the input field
        aev(input, "input", function (ev) {

            //if Tab key - ignore
            if (ev.key === "Tab") {
                return;
            }

            //remove spaces at start
            var text = trm(input.value);
            //if no change in text, do nothing
            if (text === prevText) {
                return;
            }


            setTimeout(doRest, 0);

            function doRest() {

                //keep this value for next time keydown event handler is called
                prevText = text;

                //if no matches: insert text "No matches" in ul
                //if some matches: insert the matches in ul
                //ul is only removed if you select an option OR click outside the input field

                //remove options
                removeUlContent();

                if (!ul) {

                    ul = cre("div", {
                        role: "list",
                        class: "vaautocomplete"
                    });
                    css(ul, cssDropdown);
                    aft(live, ul);

                    //close button for drop-down, no need for event to close list as it's outside list
                    //so general onclick on body will pick handle the button clicks
                    buc = cre("button", {
                        "aria-label": ""
                    });
                    //but we need to place focus on input field when list is closed
                    aev(buc, "click", function () {
                        input.focus();
                    });
                    css(buc, {
                        position: "absolute",
                        border: "0",
                        background: "transparent",
                        border: "0",
                        margin: "0",
                        padding: "0"
                    });
                    buc.innerHTML = SVGc;
                    aft(live, buc);

                    //add event handler to body
                    aev(body, "click", removeUlPerhaps);
                }

                //store buttons to add event handlers afterwards
                buttons = [];

                //fill matches array with matching items
                matches = matchFunction(text);


                //if no matches
                if (matches.length === 0) {

                    if (input.value !== "") {

                        //lazy - use fake button so CSS is the same
                        var VOItem = cre("button", {
                            role: "presentation"
                        });
                        VOItem.textContent = "geen resultaat";
                        css(VOItem, cssButton);

                        aev(VOItem, "click", function () {
                            removeUlContent();
                            removeUl();
                            input.focus();
                            prevText = input.value;
                        });

                        aev(VOItem, "focus", function () {
                            css(this, cssButtonFocus);
                        });

                        aev(VOItem, "blur", function () {
                            css(this, cssButtonUnFocus);
                        });

                        //ADD DOWN ARROW event handler
                        aev(VOItem, "keydown", function (ev) {
                            //escape
                            if (ev.key === "Escape" || ev.key === "Esc") {
                                removeUlContent();
                                input.focus();
                            }
                        });

                        aev(VOItem, "keydown", function (ev) {
                            //uparrow
                            if (ev.key === "ArrowUp" || ev.key === "Up") {
                                input.focus();
                                //removeUlContent();
                            }
                        });

                        var li = cre("div", {
                            role: "listitem"
                        });
                        css(li, cssLi);

                        app(li, VOItem);
                        app(ul, li);

                        buttons.push(VOItem);

                        live.textContent = "geen resultaat";


                    } else {
                        removeUlContent();
                        removeUl();
                        return;
                    }
                }

                addMatches(matches, ul);


                function addMatches(matches, container) {
                    //adds <li> elements to <ul> element (container)

                    if (matches.length === 0) return;

                    if (matches.length === 1) {
                        live.textContent = "1 resultaat";
                    } else {
                        live.textContent = matches.length + " results";
                    }


                    var lastListItem = null;

                    //add matches to list below input field 
                    //(and show checkmark if they are in selected list above input field)
                    for (var i = 0, len = matches.length; i < len; i++) {

                        var VOItem = cre("button");
                        //matches[i] might contain markup (to underline matching characters)
                        VOItem.innerHTML = matches[i];
                        //get pure text without markup
                        var buttonText = VOItem.textContent;

                        css(VOItem, cssButton);
                        att(VOItem, "aria-label", buttonText);
                        att(VOItem, "role", "checkbox");

                        var tick = cre("span", {
                            "class": "check",
                            "aria-hidden": "true",
                            "style": "margin-right:4px"
                        });
                        tick.innerHTML = "&#10004;";

                        //insert the tick inside the button
                        VOItem.insertBefore(tick, VOItem.firstChild);

                        if (buttonText.toLowerCase() in selectedOptions) {
                            att(VOItem, "aria-checked", "true");
                            tick.style.opacity = "1";
                        } else {
                            att(VOItem, "aria-checked", "false");
                            tick.style.opacity = "0";
                        }

                        //this closes the visible options and finalses selection
                        aev(VOItem, "click", buttonClick);

                        aev(VOItem, "focus", buttonFocus);

                        aev(VOItem, "blur", buttonUnFocus);

                        buttons.push(VOItem);

                        lastListItem = cre("div", {
                            "role": "listitem"
                        });
                        lastListItem.appendChild(VOItem);
                        container.appendChild(lastListItem);

                    } //end loop through matches

                    function buttonFocus() {
                        css(this, cssButtonFocus);
                    }

                    function buttonUnFocus() {
                        css(this, cssButtonUnFocus);
                    }

                    function buttonClick() {
                        //place text of selected item in list above input field OR removes it
                        //user aria-label because this excludes the tick markup
                        var val = this.getAttribute("aria-label");
                        var valLC = val.toLowerCase();
                        var tick = this.querySelector("span");

                        if (this.getAttribute("aria-checked") === "true") {
                            this.setAttribute("aria-checked", "false");
                            tick.style.opacity = "0";

                            if (valLC in selectedOptions) {
                                rem(selectedOptions[valLC]);
                                delete selectedOptions[valLC];
                                selCount--;
                                if (selCount < 1) {

                                    var liSel = cre("div", {
                                        role: "listitem",
                                        tabindex: "-1"
                                    });
                                    css(liSel, cssSrOnly);
                                    liSel.textContent = nv;
                                    ulSel.appendChild(liSel);
                                    //fix for layot purposes
                                    ulSel.style.position = "absolute";
                                }

                                position(input, ul);
                            }
                        } else {
                            this.setAttribute("aria-checked", "true");
                            tick.style.opacity = "1";

                            if (!(valLC in selectedOptions)) {
                                if (selCount < 1) {
                                    //delete the "No items selected" item
                                    ulSel.innerHTML = "";
                                    ulSel.style.position = "relative";
                                }
                                var liSel = cre("div", {
                                    role: "listitem"
                                });
                                css(liSel, cssSelListItem);

                                //var sp = cre("div",{"style":"padding:0;margin:auto;display:flex;align-items: center;"});
                                liSel.textContent = val;
                                //sp.textContent = val;

                                //liSel.style.display = "flex";

                                var bb = cre("button", {
                                    type: "button",
                                    "aria-label": "Remove " + val
                                });
                                css(bb, cssButton);
                                bb.style.width = "auto";
                                bb.style.height = "auto";
                                bb.style.padding = "0";
                                bb.style.marginLeft = "5px";
                                bb.innerHTML = SVGx;
                                aev(bb, "click", remSel);
                                addFocusHandlers(liSel, bb);

                                //sp.appendChild(bb);
                                //liSel.appendChild(sp);


                                liSel.appendChild(bb);
                                ulSel.appendChild(liSel);
                                selectedOptions[valLC] = liSel;
                                selCount++;
                            }

                            position(input, ul);


                        }

                        function remSel() {
                            //this is called when the delete button is clicked in the selection list
                            //remove item in selection list
                            //and place focus on nearest list item button

                            selCount--;
                            if (selCount < 1) {

                                var liSel = cre("div", {
                                    role: "listitem",
                                    tabindex: "-1"
                                });
                                css(liSel, cssSrOnly);
                                liSel.textContent = nv;
                                ulSel.appendChild(liSel);
                                //fix for layot purposes
                                ulSel.style.position = "absolute";
                                liSel.focus();
                            } else {
                                var sibling = selectedOptions[valLC].nextElementSibling;
                                if (!sibling) sibling = selectedOptions[valLC].previousElementSibling;
                                sibling.querySelector("button").focus();
                            }
                            rem(selectedOptions[valLC]);
                            delete selectedOptions[valLC];

                            drawSVG();
                        }

                        function addFocusHandlers(liSel, bb) {
                            var svg = bb.querySelector("svg");
                            aev(liSel, "mouseenter", function () {
                                svg.style.opacity = "1";
                            });
                            aev(liSel, "mouseleave", function () {
                                svg.style.opacity = "0.4";
                            });
                            aev(bb, "focus", function () {
                                svg.style.opacity = "1";
                            });
                            aev(bb, "blur", function () {
                                svg.style.opacity = "0.4";
                            });
                        }

                        //ensure that options do not show next time input field gets a keypress
                        //do we still need this????
                        prevText = val;

                        //this click handler either adds or deletes item in selection list, so we need redraw
                        drawSVG();

                    } //end click handler


                } //end addMatches function



                position(input, ul);

                //add event handlers to buttons, bar first and last
                for (var k = 1, klen = buttons.length - 1; k < klen; k++) {
                    //ADD DOWN ARROW event handler
                    aev(buttons[k], "keydown", addKeydown(k));
                }


                function addKeydown(k) {
                    return function (ev) {
                        //escape
                        if (ev.key === "Escape" || ev.key === "Esc") {
                            removeUlContent();
                            removeUl();
                            prevText = input.value;
                            //here focus is put on the input field. When escape key goes up, it triggers the keyup
                            //on the input field and that opens the list of matches... To avoid that, prevText is set
                            //in code line above.
                            input.focus();

                            //if downarrow - move keyboard focus to the select element
                        } else if (ev.key === "ArrowDown" || ev.key === "Down") {

                            buttons[k + 1].focus();
                            ev.preventDefault();

                            //uparrow
                        } else if (ev.key === "ArrowUp" || ev.key === "Up") {

                            buttons[k - 1].focus();
                            ev.preventDefault();
                        }
                    };
                }

                if (buttons.length > 1) {
                    //add event handlers to first button
                    var VOItem = buttons[0];
                    aev(VOItem, "keydown", function (ev) {
                        //escape
                        if (ev.key === "Escape" || ev.key === "Esc") {
                            removeUlContent();
                            removeUl();
                            input.focus();
                            //if downarrow
                        } else if (ev.key === "ArrowDown" || ev.key === "Down") {

                            buttons[1].focus();

                            ev.preventDefault();

                            //uparrow
                        } else if (ev.key === "ArrowUp" || ev.key === "Up") {

                            input.focus();
                            ev.preventDefault();
                        }
                    });

                    //add event handlers to last button
                    VOItem = buttons[klen];
                    aev(VOItem, "keydown", function (ev) {
                        //escape
                        if (ev.key === "Escape" || ev.key === "Esc") {
                            removeUlContent();
                            removeUl();
                            input.focus();
                            //if downarrow
                        } else if (ev.key === "ArrowDown" || ev.key === "Down") {

                            ev.preventDefault();
                            //uparrow
                        } else if (ev.key === "ArrowUp" || ev.key === "Up") {

                            buttons[klen - 1].focus();
                            ev.preventDefault();
                        }
                    });

                } else if (buttons.length == 1) {
                    var VOItem = buttons[0];
                    aev(VOItem, "keydown", function (ev) {
                        //escape
                        if (ev.key === "Escape" || ev.key === "Esc") {
                            removeUlContent();
                            removeUl();
                            input.focus();
                            //if downarrow
                        } else if (ev.key === "ArrowDown" || ev.key === "Down") {
                            ev.preventDefault();
                            //uparrow
                        } else if (ev.key === "ArrowUp" || ev.key === "Up") {
                            input.focus();
                            ev.preventDefault();
                        }
                    });
                }

                //aft(live,ul);

                //end doRest doRest doRest doRest doRest doRest doRest doRest doRest doRest doRest doRest
            }
            //end on input
        });


        aev(input, "keydown", function (ev) {
            //down arrow, move to suggestions
            if (ev.key === "ArrowDown" || ev.key === "Down") {
                if (ul) {
                    setTimeout(function () {
                        buttons[0].focus();
                    }, 100);
                }
                ev.preventDefault();
            } else if (ev.key === "Escape" || ev.key === "Esc") {
                removeUlContent();
                removeUl();
                ev.preventDefault();
            }
        });


        function removeUlContent() {
            //iterating over children to remove gives error
            if (ul) ul.innerHTML = "";
            //reset array of visible options
            VOArray = [];
            //reset index of current selection
            prevIndex = -1;
        }


        function removeUlPerhaps(ev) {
            if (!ul) return;
            //don't close if we clicked inside the list
            if (ul.contains(ev.target)) return;

            rem(ul);
            ul = null;
            rem(buc);
            buc = null;
            if (live) live.textContent = "";
            //remove eventlistener from body
            body.removeEventListener("click", removeUlPerhaps);
        }

        function removeUl() {
            if (ul) {
                rem(ul);
                ul = null;
                rem(buc);
                buc = null;
                if (live) live.textContent = "";
                //remove eventlistener from body
                body.removeEventListener("click", removeUl);
            }
        }
        aev(window, "resize", function () {
            position(input, ul);
            drawSVG();
        });

        //distance between input element element and visible options
        var topOffset = 4;
        var leftOffset = -6;

        function position(original, newcomer) {
            if (!newcomer) return;

            var tt = original.offsetTop + original.offsetHeight;
            var ll = original.offsetLeft;

            css(newcomer, {
                "top": (tt + topOffset) + "px",
                "left": (ll + leftOffset) + "px"
            });

            buc.style.top = newcomer.offsetTop + "px";
            buc.style.left = newcomer.offsetLeft + newcomer.offsetWidth + 2 + "px";
        }

        drawSVG();

    } //end makeAutoCompleteMulti

    //add public function
    window.visionaustralia.makeAutocompleteMulti = makeAutocompleteMulti;




    //SVG border SVG border SVG border SVG border SVG border SVG border SVG border SVG border SVG border 
    function drawSVG() {
        //this is called by "buttonClick" when a button in suggestion list is either ticked or unticked 
        //(item is added or removed in selection list)
        //function is also called in "remSel" when an item is deleted by clicking the "x" button in 
        //selection list.
        //function is also called right at end of "makeAutoCompleteMulti"


        //var path = svgBorder.querySelector("path");

        var tmp = ulSel.children;

        var items = [];

        //don't add items if the only lisitem is the hidden "no selections" item
        if (!(tmp.length === 1 && tmp[0].offsetWidth < 2)) {
            ite(tmp, function (el) {
                items.push(el);
            });
        }

        //this is now array of everything we want to put svg line around
        items.push(input);

        //by making the svg absolute and flush with div, we avoid issue with line being cropped by SVG
        //the offset width etc of each list item is given relatively to the parent element
        svgBorder.style.width = div.offsetWidth + "px";
        svgBorder.style.height = div.offsetHeight + 10 + "px";
        svgBorder.style.top = "0px";
        svgBorder.style.left = "0px";


        var ends = [];

        //"top" is a keyword!!! so don't use
        var tt = items[0].offsetTop;
        //parse items to find the end of each row
        for (var i = 0, el; el = items[i]; i++) {

            //if top is different we have a new row, which means the previous element was end of row
            if (el.offsetTop !== tt) {
                //set tt to top of new row
                tt = el.offsetTop;

                //save info about the end of row (previous item)
                var ob = {};
                ob.x = items[i - 1].offsetLeft + items[i - 1].offsetWidth;
                ob.y1 = items[i - 1].offsetTop;
                ob.y2 = ob.y1 + items[i - 1].offsetHeight;
                ends.push(ob);
            }
        }
        //add last item in last row. If only 1 row, this will be the only item
        var ob = {};
        ob.x = items[i - 1].offsetLeft + items[i - 1].offsetWidth;
        ob.y1 = items[i - 1].offsetTop;
        ob.y2 = ob.y1 + items[i - 1].offsetHeight;
        ends.push(ob);


        //ppppppppppppppppppppppppppppppppppppppppppppppppppppppp
        //now add padding. the line needs to be exactly in the middle between rows.
        //so the y1 and y2 values are in the middle of the rows.
        var pad;
        if (ends.length > 1) {
            //half of vertical distance between rows
            pad = Math.round((ends[1].y1 - ends[0].y2) / 2);
        } else {
            pad = 2;
        }

        for (var i = 0, ob; ob = ends[i]; i++) {
            ob.x += pad;
            ob.y1 -= pad;
            ob.y2 += pad;
        }


        //WORX remember to set <div role="list"> and input position:relative and z-index:40; this ensures they are on top of the SVG and 1 px padding for the container div [[OK DONE]]
        //so we can actually click them
        //now just need to get rounding right
        //listitems are border-radius: 6px;

        var q = 5;
        var q1 = 5;
        //corners
        var tl = " c0,-" + q + " 0,-" + q + " " + q + ",-" + q + "";
        var tr = " c" + q + ",0 " + q + ",0 " + q + "," + q + "";
        var br = " c0," + q + " 0," + q + " -" + q + "," + q + "";
        var bl = " c-" + q + ",0 -" + q + ",0 -" + q + ",-" + q + "";
        var tlr = " c-" + q + ",0 -" + q + ",0 -" + q + "," + q + "";
        var brr = " c0," + q + " 0," + q + " -" + q + "," + q + "";
        var blr = " c0," + q + " 0," + q + " " + q + "," + q + "";

        //do start of line
        var ob = ends[0];
        //line starting top left corner (just down on the left side), going up and around to the right.
        var d = "M1," + (ends[0].y1 + q + 0) + tl;

        //then line to end of first row, around top corner and down to just before bottom corner
        d += " L" + (ob.x - q) + "," + (ob.y1 + 0) + tr;
        d += " L" + ob.x + "," + (ob.y2 - q);
        prevX = ob.x;
        for (var i = 1, le = ends.length; i < le; i++) {
            ob = ends[i];
            //for each end:
            //draw line from previous bottom corner to top corner of this one and then down
            //
            var diffX = ob.x - prevX;
            //if line comes from left
            if (diffX >= 5) {
                //down and to left from prev corner
                d += blr;
                //to this top corner and around and down
                d += " L" + (ob.x - q) + "," + ob.y1 + tr;

                //if line comes from right
            } else if (diffX <= -5) {
                //down and to right from prev corner
                d += br;
                //to this top corner and around and down
                d += " L" + (ob.x + q) + "," + ob.y1 + tlr;

                //they are pretty close
            } else {
                //midpoint between the two corner points
                var xMid = ob.x - Math.round(diffX / 2);
                var yMid = ob.y1;
                //d += " L" + ob.x + "," + (ob.y1 + q);
                d += " C" + xMid + "," + yMid + " " + xMid + "," + yMid + " " + ob.x + "," + (ob.y1 + q);
            }

            //line from top to almost bottom (parallel with right side)
            d += " L" + ob.x + "," + (ob.y2 - q);

            prevX = ob.x;
        }

        //draw around bottom right corner of last item (input field) 
        d += brr + " L" + (q + 1) + "," + ob.y2 + bl;


        d = d + "Z";
        path.setAttribute("d", d);

    }


    //end top level closure
})();
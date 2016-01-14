var $ = require("jquery"),
	_ = require("lodash");

var searchableContentSelector = ".searchable",
	matchClass = "match",
	termHighlightClass = "highlight";

var exactMatch = false;

var $input = $("input"),
	$domItems = $(searchableContentSelector);

var searchableObjects = [],
	matchingElems, elToShow, rgx,
	txt, rTxt, hTxt;

var loadDom = function() {
	/**
	Load our content from the DOM in to an array of objects
	*/
	$domItems.each(function(){

		var _this = $(this),
			cntnt = _this.text().toLowerCase();

		searchableObjects.push({
			searchContent: cntnt,
			elems: _this,
		});
	});

};

var highlightMatches = function(els, query) {
	/**
	Regex all matches within the the elements body and title
	and then wrap them in a span tag.
	*/
	var _this;

	// Generate new regex expression that matches any query term
	rgx = new RegExp("(\\b" + query.join("|") + "\\b)", "gim");

	// For each element in this match object
	els.each(function() {
		// Alter the HTML content to have matches wrapped in spans
		_this = $(this);
		txt = _this.html();

		// Reset any pre-existing highlighting
		rTxt = txt.replace(/(<span>|<\/span>)/igm, "");
		_this.html(rTxt);
		
		// Set the new highlighted text
		hTxt = txt.replace(rgx, "<span class='" + termHighlightClass + "'>$1</span>");
		_this.html(hTxt);

	});

};

var searchDom = function() {
	/**
	On key down search the DOM for current input
	*/
	var inputVal = $input.val().trim().toLowerCase();

	// Reset all matches by...
	// Removing the match class from the wrapper and then
	// for each highlighted word you find unwrap the highlighter
	$domItems
		.removeClass(matchClass)
		.find("." + termHighlightClass).each(function(){
			$(this).replaceWith($(this).html());
		});

	if (!!inputVal) {

		inputVal = inputVal.split(" ");

		matchingElems = _.filter(searchableObjects, function(o){
			/**
				Filter all the searchableObjects you built for your search query

				Some is used so that words don't have to be in series
				e.g. "This string of mine" will match for "this mine"
			*/
			return inputVal.some(function(aQuery) {
				return o.searchContent.indexOf(aQuery) > -1;
			});
			/** 
				TODO: Add option to exact match
				ALTERNATE: Exact term match. "This string of mine" will not match "this mine"
				return o.searchContent.indexOf(aQuery) > -1;
			**/
		});

		matchingElems.forEach(function(o) {
			/**
			For each element that matches and should be shown...
			*/
			elToShow = o.elems;
			elToShow.addClass(matchClass);
			highlightMatches(elToShow, inputVal);
		});
	}
	
};

var initSearch = function() {
	// On each keyup, scour the DOM
	$input.keyup(searchDom);
};

loadDom();
initSearch();
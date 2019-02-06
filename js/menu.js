//Coulour pallette object! Add any you like!
var colours = {
	blue: "19B5FE",
	lightblue: "86E2D5",
	pink: "E08283",
	grey: "67809F",
	skyblue: "C5EFF7",
	darkgrey: "2C3E50",
	orange: "F89406",
	white:"#ecf0f1",
	salmon: "F64747",
	yellow: "F7CA18"
}

function init() {
	var width = $(window).width();
	var height = $(window).height();
}

function relative_text(w, h){
	var title_text = $("#super_sam");
	title_text.css("font-size", w/10 + "px");
}


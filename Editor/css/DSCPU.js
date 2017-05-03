var currentView = "home";

function changeView(viewID) {
	$('#'+currentView).css('display', 'none');
	$('#'+viewID).css('display', 'block');
	currentView = viewID;
}
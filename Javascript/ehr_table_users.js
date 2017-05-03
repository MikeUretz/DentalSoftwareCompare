//Creates a modal box for accepting user info.
function checkUserCookie(){
	if (getCookie('DSC_email') == ''){
		BootstrapDialog.show({
			title: 'Welcome to the Dental Software Compare Tool',
            message: 'Please enter your name and email to continue to the free tool!</br> Email:<input id="email" type="email" placeholder="Enter your email" class="form-control"> </br> Name:<input id="name" type="text" placeholder="Enter your name" class="form-control"> ',
            onhide: function(dialogRef){
                var email = dialogRef.getModalBody().find('#email').val();
                var name =  dialogRef.getModalBody().find('#name').val();
                if(name == "" || validateEmail(email) == false) {
                    alert('Please enter a valid Email and Name');
                    return false;
                } else {
                	enterUser(name, email);
                	startTutorial();
                }
            },
            buttons: [{
                label: 'Submit',
                action: function(dialogRef) {
                    dialogRef.close();
                }
            }]
        });
	} else {
        updateUser(getCookie('DSC_name'), getCookie('DSC_email'), getCookie('DSC_id'), getCookie('DSC_visit_count'));
	}
}

//Sets a cookie in the users browser, given the cookie name, value and days to expire.
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//Returns the value of a given cookie, or empty string if it does not exist.
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

//Creates and calls a post statement to add a user to the database
function enterUser(name, email) {
	var user = { "record": [{"name": name, "email": email, "date": date(), "last_active_date": date()}]};
	var request = JSON.stringify(user);
    //Put call to the database
	jQuery.post("http://ec2-54-201-29-242.us-west-2.compute.amazonaws.com:80/rest/ehr/user_responses?app_name=ehrSelect", request, function(data){
        setCookie("DSC_id", data.record[0].user_id);
    });
    //creates cookies for the user.
	setCookie('DSC_email', email, 720);
    setCookie('DSC_name', name, 720);
    setCookie('DSC_visit_count', 0, 720);
}

//Creates and calls a patch statment to update a users info.
function updateUser(name, email, id, visit_count){
    userId = parseInt(id);
    //add 1 to the visit count
    var visit_count = parseInt(visit_count) +1;
    //Create patch request
    var data = { "record": {"last_active_date": date(), "visit_count": visit_count}, "ids": userId};
    var request = JSON.stringify(data);
    //Call the request to the API
    jQuery.ajax("http://ec2-54-201-29-242.us-west-2.compute.amazonaws.com:80/rest/ehr/user_responses?app_name=ehrSelect", {type: "PATCH", data: request});
    //Increase the visit count by 1
    setCookie('DSC_visit_count', visit_count, 720);
}


//Returns true if the given email is valid
function validateEmail(elementValue){        
   	var emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
   	return emailPattern.test(elementValue);   
 }  

//Returns the current date in the MySQL DATE format
 function date() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
	    dd='0'+dd
	} 
	if(mm<10) {
	    mm='0'+mm
	} 
	return ''+yyyy+'-'+mm+'-'+dd;
 }

//Starts the tutorial
 function startTutorial() {
 	// Initialize the tour
	tour.init();
     BootstrapDialog.show({
        title: 'Dental Software Compare Tool Tutorial',
        size: BootstrapDialog.SIZE_WIDE,
        message: 'Welcome to the Dental Software Compare Tool! This short video will show you how to navigate the tool. </br> <iframe width="870" height="490" src="https://www.youtube.com/embed/m3_09rOHa04?rel=0" frameborder="0" allowfullscreen></iframe>',
        buttons: [{
            label: 'Close',
            action: function(dialogItself){
                dialogItself.close();
            }
        }]
    });
 }
//Tour instance
var tour = new Tour({
  delay: 250,
  onStart: function (tour) {
      var children_company = document.getElementById('mytest1').childNodes;
      if (children_company[0].className == "glyphicon glyphicon-triangle-top"){
        children_company[0].className = "glyphicon glyphicon-triangle-bottom";
        $(".searchPanelCompany").slideToggle("slow");
      }
      var children_company = document.getElementById('mytest2').childNodes;
      if (children_company[0].className == "glyphicon glyphicon-triangle-top"){
        children_company[0].className = "glyphicon glyphicon-triangle-bottom";
        $(".searchPanelCategory").slideToggle("slow");
      }
      var children_company = document.getElementById('mytest3').childNodes;
      if (children_company[0].className == "glyphicon glyphicon-triangle-top"){
        children_company[0].className = "glyphicon glyphicon-triangle-bottom";
        $(".searchPanelFeaturesOnly").slideToggle("slow");
      }

  },

  steps: [
  {
    orphan: "true",
    title: "EHR Select Tutorial",
    content: "Welcome to the Dental Software Compare Tool, this short tutorial will show how to navigate the tool",
    template: "<div class='popover tour'><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><span data-role='separator'>|</span><button class='btn btn-default' data-role='next'>Next »</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>"
  },
  {
    element: "#searchCompany",
    title: "Companies",
    content: "Click here to show a list of the companies",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>",
    reflex: true
  },
  {
    element: "#6",
    title: "Companies",
    content: "Click the red minus sign, or corresponding green plus, to add and remove companies from the table",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>",
    reflex: true
  },
  {
    element: "#searchCompany",
    title: "Companies",
    content: "Click the dropdown again when you are ready to continue",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>",
    reflex: true
  },
  {
    element: "#searchCategory",
    title: "Categories and Features",
    content: "Click here to show all of the categories in the table",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>",
    reflex: true
  },
  {
    element: "#catDroppanel90052",
    title: "Categories and Features",
    content: "Each category has a dropdown for its features, click here to see them",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>",
    reflex: true
  },
  {
    element: "#90252",
    title: "Categories and Features",
    content: "Each feature and category has a magnifying glass which will show ONLY that feature or category in the table. Click next to continue"
  },
  {
    element: "#searchCategory",
    title: "Categories and Features",
    content: "Again, click the red minus sign, or corresponding green plus, you can add and remove categories or features from the table. Click here to continue",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>",
    reflex: true
  },
  {
    element: "#searchFeaturesOnly",
    title: "Features Only",
    content: "Click here to show a list of all the features",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>",
    reflex: true
  },
  {
    element: "#244",
    title: "Features Only",
    content: "Click the red minus sign, or corresponding green plus, to add and remove individual features from the table",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>",
    reflex: true
  },
  {
    element: "#tableLegend",
    title: "Legend",
    content: "This is the table legend. If you are ever confused by an icon, look here for an explanation. Click next to continue",
    placement: 'bottom'
  },
  {
    element: "#consulting",
    title: "Consulting",
    content: "If you would like to know how we can help you, click here! Otherwise, click next to continue",
    placement: 'right'
  },
  {
    element: "#tutorial",
    title: "Restart Tutorial",
    content: "Thank you for following this tutorial! If you wish to see it again at anytime, you may click here",
    placement: 'left'
  }
]});

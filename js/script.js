var flavors = [];
var headers = [];

// make function to load a random flavor from the list of flavors
function randomFlavor() {
    var randomFlavor = flavors[Math.floor(Math.random() * flavors.length)];
    var wingName = randomFlavor["Wing Name"];
    var wingNumber = randomFlavor["Flavor ID"];
    var description = randomFlavor["Description"];
    var randomWing = "<div title='" + description + "'>" + wingNumber + ": " + wingName + "</div>";
    document.getElementById("wing-names").innerHTML = randomWing;
}



function loadFlavors() {
    // Loading TSV from google sheets because when using CSV the commas in names or descriptions were causing issues
    fetch('flavors.tsv')
      .then(response => response.text())
      .then(data => {
        var rows = data.split('\n');
        headers = rows[0].split('\t');
        for (var i = 1; i < rows.length; i++) {
          var values = rows[i].split('\t');
          var flavor = {};
          for (var j = 0; j < headers.length; j++) {
            flavor[headers[j]] = values[j].trim();
            flavor["Description"] = values[j].trim();
          }
          
       //  // Adding the category to the flavor object
       //  for (var j = 2; j < headers.length; j++) {
       //    var category = headers[j];
       //    if (values[j].trim().toLowerCase() === "true") {
       //      flavor["Category"] = category;
       //      break;
       //    }
       //  }
          // adding the flavor to the flavors array
          flavors.push(flavor);
        }
       // console.log(flavors);
        generateTags();
        showFlavors();
      });
}
  

  

function generateTags() {
  var tagsDropdown = document.getElementById("tags");
  tagsDropdown.innerHTML = "";
  var option = document.createElement("option");
  option.text = "All";
  option.value = "all";
  tagsDropdown.add(option);
  for (var i = 0; i < headers.length; i++) {
    var header = headers[i];
    if (header !== "Wing Name" && header !== "Description" && header !== "Flavor ID" && header !== "Spice Level") {
      var option = document.createElement("option");
      option.text = header;
      option.value = header;
      tagsDropdown.add(option);
    }
  }
}




function showFlavors() {
   var selectedTag = document.getElementById("tags").value;
   var searchText = document.getElementById("search-box").value.toLowerCase();
   var wingNames = "";
   var cksChoices = [];

    // Filter flavors based on selected tag and search text
    for (var i = 0; i < flavors.length; i++) {
      if ((selectedTag === "all" || flavors[i][selectedTag] === "TRUE" || (selectedTag === "All" )) &&
        (searchText === "" || flavors[i]["Wing Name"].toLowerCase().indexOf(searchText) !== -1)) {
        var wingName = flavors[i]["Wing Name"];
        var wingNumber = flavors[i]["Flavor ID"];
        var description = flavors[i]["Description"];
        var SpiceLevel = flavors[i]["Spice Level"];
        var additionalCost = flavors[i]["Additional Cost"];


              // Add * next to wingNumber if additionalPrice is true

        switch(SpiceLevel) {
          case "0":  // Plain / Sweet / ETC
            heatScale = "";
            break;
          case "1":  // Mild
            heatScale = "<img src='images/heatlevels/level1.png' alt='Level1' class='pepper-image' width='300' height='50'>";
            break;
          case "2": // Hot
            heatScale = "<img src='images/heatlevels/level2.png' alt='Level2' class='pepper-image' width='120' height='20'>";
            break;
          case "3": // Death
            heatScale = "<img src='images/heatlevels/level3.png' alt='Level3' class='pepper-image' width='120' height='20'>";
            break;
          case "4": // Suicide
            heatScale = "<img src='images/heatlevels/level4.png' alt='Level4' class='pepper-image' width='120' height='20'>";
            break;
          case "5": // Nuclear
            heatScale = "<img src='images/heatlevels/level5.png' alt='Level5' class='pepper-image' width='120' height='20'>";
            break;
          default:
            console.log("Unexpected category: " + SpiceLevel + " " + wingName);
        }
        

      // Add asterisk before wingNumber if additionalPrice is true
      var asterisk = additionalCost === "TRUE" ? "* " : "";

      // Add pepper images based on selected tag
    //  var pepperImages = "";
    //  for (var j = 0; j < numPeppers; j++) {
    //    pepperImages += "<img src='pepper.png' alt='Pepper' class='pepper-image'>";
    //  }

      if (flavors[i]["CK's Choice"] === "TRUE" && selectedTag !== "CK's Choice") {
        // Add CK's Choice flavors to separate array
        cksChoices.push("<div class='flavor-container' title='" + description + "'><div class='flavor'>" + asterisk + wingNumber + ": " + wingName + "    " + heatScale + "</div><div class='recommended'>CK's Choice!</div></div>");
      } else {
        // Add other flavors to main list
        wingNames += "<div class='flavor-container' title='" + description + "'><div class='flavor'>" + asterisk + wingNumber + ": " + wingName +  "    " + heatScale + "</div></div>";
      }
    }
  }
   
   // Randomly select and add 3 CK's Choice flavors to the beginning of the main list
    var cksLen = cksChoices.length;
    for (var j = 0; j < 3 && cksLen > 0; j++) {
        var randomIndex = Math.floor(Math.random() * cksLen);
        wingNames = cksChoices.splice(randomIndex, 1) + wingNames;
        cksLen--;
    }
    document.getElementById("wing-names").innerHTML = wingNames;
 }

   // Check if ckChoices and if so shuffle 
   // Shuffle the CK's Choice array and select 3 random flavors
   cksChoices = shuffleArray(cksChoices);
   var recommendedFlavors = cksChoices.slice(0, 3);

   // Add the recommended flavors to the top of the main list
   wingNames = recommendedFlavors.join("") + wingNames;

   // Add the remaining flavors to the main list
   document.getElementById("wing-names").innerHTML = wingNames;
 



 // Function to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
   }
   return array;
}


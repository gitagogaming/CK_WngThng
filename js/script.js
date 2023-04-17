var flavors = [];
var flavorsLoaded = false;
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
    if (flavorsLoaded) {
      showFlavors();
      return; // skip loading flavors if already loaded
    } 
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
          
          flavors.push(flavor);
        }
        generateTags();
        showFlavors();
        flavorsLoaded = true;
      
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
        
        // Adding SpiceLevel Image
        switch(SpiceLevel) {
          case "0":  // Plain / Sweet / ETC
            heatScale = "<img src='images/heatlevels/level0.png' alt='Level0' class='pepper-image'>";
            break;
          case "1":  // Mild
            heatScale = "<img src='images/heatlevels/level1.png' alt='Level1' class='pepper-image'>";
            break;
          case "2": // Hot
            heatScale = "<img src='images/heatlevels/level2.png' alt='Level2' class='pepper-image'>";
            break;
          case "3": // Death
            heatScale = "<img src='images/heatlevels/level3.png' alt='Level3' class='pepper-image'> ";
            break;
          case "4": // Suicide
            heatScale = "<img src='images/heatlevels/level4.png' alt='Level4' class='pepper-image'> ";
            break;
          case "5": // Nuclear
            heatScale = "<img src='images/heatlevels/level5.png' alt='Level5' class='pepper-image'> ";
            break;
          default:
            console.log("Unexpected category: " + SpiceLevel + " " + wingName);
        }  

      // Add asterisk before wingNumber if additionalPrice is true
      var asterisk = additionalCost === "TRUE" ? "* " : "";

      if (flavors[i]["CK's Choice"] === "TRUE" && selectedTag !== "CK's Choice") {
        // Add CK's Choice flavors to separate array
        cksChoices.push("<div class='flavor-container' title='" + description + "'><div class='flavor'><div class='flavor-text'>" + asterisk + wingNumber + ": " + wingName + " " + "</div><div class='recommended-container'><img src='images/cksChoice.png' alt='CKs Choice' class='recommended'></div>"+ heatScale+"</div></div>");
      } else {
        // Add other flavors to main list
        wingNames += "<div class='flavor-container' title='" + description + "'><div class='flavor'>" + asterisk + wingNumber + ": " + wingName +  "    " + heatScale + "</div></div>";
      }
    }
  }
//console.log(wingNames)

   // Shuffle the CK's Choice array and select 3 random flavors
   cksChoices = shuffleArray(cksChoices);
   var recommendedFlavors = cksChoices.slice(0, 3);

   // Add the recommended flavors to the top of the main list
   wingNames = recommendedFlavors.join("") + wingNames;

   // Add the remaining flavors to the main list
   document.getElementById("wing-names").innerHTML = wingNames;
  // console.log("Total number of wingNames: " + wingNames.length);
  // console.log("Length of flavors: " + flavors.length);

}


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


    var starting_value = [
    {
      general:{
        fslRootDir:"/Applications/fsl/5.0.10",
        freesurferRootDir: "/Applications/freesurfer/6.0.0", 
        templates: ["aparc", "economo", "BB50human", "lausanne120", "lausanne250", "lausanne500"],
        reconstructionMethods: ["DTI", "CSD", "GQI"],   
        reconstructionSteps: ["structural_preprocessing", 
        "parcellation", 
        "collect_region_properties", 
        "reconstruction_diffusion", 
        "reconstruction_fibers", 
        "reconstruction_fiber_properties", 
        "reconstruction_network"],
        freesurferDir: "T1/SUBJECT_FS",
        ROIsFile: "TEMPLATESDIR/TEMPLATE/ROIs_TEMPLATE.txt",
        outputDir: "DWI_processed",
        possibleFonts: "test"
      }}
      ]


// Initialize the editor
var editor = new JSONEditor(document.getElementById('editor_holder'),{

// Enable fetching schemas via ajax
ajax: true,
theme: 'bootstrap4',
disable_edit_json: true,
disable_properties: true,
disable_collapse: true,
disable_array_add: false,
disable_array_delete: true,
disable_array_delete_all_rows: true,
disable_array_delete_last_row: true,
disable_array_reorder: true,

// The schema for the editor
schema: {
$ref: "general.json"
},

// Seed the form with a starting value
startval: starting_value,

// Disable additional properties
no_additional_properties: true,

// Require all properties by default
required_by_default: true
});

// Hook up the submit button to log to the console
document.getElementById('submit').addEventListener('click',function() {

// Get the value from the editor
configVars = $.extend( true, {}, editor.getValue());
configVars.reconstruction_fibers["forbiddenRegions"] = configVars.reconstruction_fibers["forbiddenRegions"]
	.split(/[ ,]+/)
	.map(function(item) {
		if (item === "") {
			return 0;
		} else {
			return parseInt(item, 10);
		}
	});
configVars.reconstruction_fibers["startRegions"] = configVars.reconstruction_fibers["startRegions"]
	.split(/[ ,]+/)
	.map(function(item) {
		if (item === "") {
			return 0;
		} else {
			return parseInt(item, 10);
		}
	});
configVars.reconstruction_fibers["stopRegions"] = configVars.reconstruction_fibers["stopRegions"]
	.split(/[ ,]+/)
	.map(function(item) {
		if (item === "") {
			return 0;
		} else {
			return parseInt(item, 10);
		}
	});		


console.log(JSON.stringify(configVars));
});

editor.on('ready', () => {

$("input[type=text]").each(function(){

  var $label = $(this).parent().find(".form-text");
  console.log($label)
  $label.append("<a>Select file</a>");
  $label.find("a").attr('name', $(this).attr('name'));
  $label.find("a").on("click", function(){
    console.log($(this))
    $("#fileselector").attr("name", $(this).attr('name'));
    $("#fileselector").removeClass("invisible").addClass("visible");
    $("#fileselectorLabel").html("Select " + $(this).parent().parent().find("label").html())
      $('#fileselector').modal('show')
  });
});
});

// // Hook up the Restore to Default button
// document.getElementById('restore').addEventListener('click',function() {
//   editor.setValue(starting_value);
// });

// Hook up the validation indicator to update its 
// status whenever the editor changes
editor.on('change',function() {
// Get an array of errors from the validator
var errors = editor.validate();

var indicator = document.getElementById('valid_indicator');

// Not valid
if(errors.length) {
  indicator.style.color = 'red';
  indicator.textContent = "not valid";
}
// Valid
else {
  indicator.style.color = 'green';
  indicator.textContent = "valid";
}
});

$('#selectFile').on('click', function(event) {
  var fieldName = $("#fileselector").attr("name");
  fieldName = fieldName.replace(/\[/g, ".");
  fieldName = fieldName.replace(/\]/g, ".");
  fieldName = fieldName.replace(/\.\./g, ".");
  fieldName = fieldName.slice(0, -1);
  console.log(fieldName);
  const ed = editor.getEditor(fieldName);
  console.log(ed)
  console.log(fileSelected)
  ed.setValue(fileSelected)

});

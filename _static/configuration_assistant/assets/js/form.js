// If anyone ever reads this. My apologies. This code is horrible, but I am happy that it works. Needs some refactoring.
var config_defaults = {ajax: true,
theme: 'bootstrap4',
disable_edit_json: true,
disable_properties: true,
disable_collapse: true,
disable_array_add: false,
disable_array_delete: true,
disable_array_delete_all_rows: true,
disable_array_delete_last_row: true,
disable_array_reorder: true,
no_additional_properties: true,
required_by_default: true};

for (var key in config_defaults) {
   if (config_defaults.hasOwnProperty(key)) {
          console.log(config_defaults[key]);
           JSONEditor.defaults.options[key] = config_defaults[key];
   }
}

var config_schema_file = "config_structural.json"; // Default
var $editor = document.getElementById('editor_holder');
var editor = loadJSONeditor();

$(".config-toggle").on('click', function() {
  var config_toggle = $('.config-toggle label.active').text();

  if (config_toggle == "Structural"){
    config_schema_file = "config_structural.json";
  } else {
    config_schema_file = "config_functional.json";
  }

  editor.destroy();
  $("#editor_holder").empty()
  loadJSONeditor();

});


function loadJSONeditor() {

// Initialize the editor
editor = new JSONEditor($editor,{
  schema: { $ref: config_schema_file }
});

function stringToArray(a, b) {


  a[b] = a[b]
    .split(/[ ,]+/)
    .map(function(item) {
      if (item === "") {
        return 0;
      } else {
        return parseFloat(item);
      }
    });
  return a;

};

editor.on('change',() => {
  // Get the value from the editor
  configVars = $.extend( true, {}, editor.getValue());

  if (config_schema_file == "config_structural.json") {
  configVars.reconstruction_fibers = stringToArray(configVars.reconstruction_fibers, "forbiddenRegions");
  configVars.reconstruction_fibers = stringToArray(configVars.reconstruction_fibers, "startRegions");
  configVars.reconstruction_fibers = stringToArray(configVars.reconstruction_fibers, "stopRegions");
}
else {
  configVars.reconstruction_functional_network.regression = stringToArray(configVars.reconstruction_functional_network.regression, "regressionMask");
  configVars.reconstruction_functional_network.bandpass_filter = stringToArray(configVars.reconstruction_functional_network.bandpass_filter, "frequencies");
}

    $('#generatedJSON').html(prettyPrintJson.toHtml(configVars, {quoteKeys: true}));
});


editor.on('ready', () => {

  $(".je-object__title").first().addClass("d-none");
  $(".je-object__controls").first().addClass("d-none");

  $("input[type=text]").each(function(){
    $(this).parent().append('<div class="input-group"></div>');
    $(this).parent().find('.input-group').append('<div class="input-group-append"><button class="btn btn-outline-secondary fileselectorButton" type="button"><i class="fa fa-folder-open-o"></i></button></div>');
    $(this).parent().find('.fileselectorButton').attr('name', $(this).attr('name'));
    $(this).parent().find('small').appendTo($(this).parent());
    $(this).prependTo($(this).parent().find('.input-group'));
  });

  $(".fileselectorButton").on("click", function(){
    $("#fileselector").attr("name", $(this).attr('name'));
    $("#fileselector").removeClass("invisible").addClass("visible");
    $("#fileselectorLabel").html("Select " + $(this).parent().parent().parent().find("label").html())
    $('#fileselector').modal('show')
  });

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

  $('#selectFile').on('click', function(event) {
    var fieldName = $("#fileselector").attr("name");
    fieldName = fieldName.replace(/\[/g, ".");
    fieldName = fieldName.replace(/\]/g, ".");
    fieldName = fieldName.replace(/\.\./g, ".");
    fieldName = fieldName.slice(0, -1);

    var fieldValue = fileSelected.replace(SUBJECT + "/", "");
    fieldValue = fieldValue.replaceAll(SUBJECT, "SUBJECT");

    var ed = editor.getEditor(fieldName);
    ed.setValue(fieldValue)
  });

});

return editor;
};
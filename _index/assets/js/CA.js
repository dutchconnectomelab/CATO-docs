$(document).ready(function() {
    

    new ClipboardJS('.btn');
    
    //
    $("#downloadButton").click(function(){
          var a = document.body.appendChild(
               document.createElement("a")
           );
           a.download = "CATO_configuration.json";
           textToWrite = JSON.stringify(myData, null, 4).replace(/\n/g, "%0D%0A"); 
           a.href = "data:text/plain," + textToWrite;
           a.click(); //Trigger a click on the element
    })
       
    
// Show number of uploaded files

  $('input[type="file"]').on("change", function() {
    let filenames = [];
    let files = document.getElementById("files").files;
    if (files.length > 1) {
      filenames.push(files.length + " files selected");
    } else {
      for (let i in files) {
        if (files.hasOwnProperty(i)) {
          filenames.push(files[i].name);
        }
      }
    }
    $(this)
      .next(".custom-file-label")
      .html(filenames.join(","));
  });
});

$(document).ready(function() {
    $('#generatedJSON').html(prettyPrintJson.toHtml(myData));
})
// Elements
var glassesParent = $("#glasses_parent");
var glasses = $("[alt='Glasses']");
var selectedGlasses;
var beardsParent = $("#beards_parent");
var beards = $("[alt='Beards']");
var selectedBeards;
var hatsParent = $("#hats_parent");
var hats = $("[alt='Hats']");
var selectedHats;
var file_drop = $("#file_drop");
var error = $("#error");
var plus = $("#plus");
var minus = $("#minus");
var left = $("#left");
var right = $("#right");
var picture = $("#picture");
var image_face = $("#face_image");
var selected_image;

// State
var uploadedFile;

file_drop.on("dragover", function (event) {
  event.preventDefault();
  event.stopPropagation();
  file_drop.addClass("dragging");
});

file_drop.on("dragleave", function (event) {
  event.preventDefault();
  event.stopPropagation();
  file_drop.removeClass("dragging");
});

file_drop.on("drop", function (event) {
  event.preventDefault();
  event.stopPropagation();
  file_drop.removeClass("dragging");

  uploadedFile = event.originalEvent.dataTransfer.files[0];

  if (
    !uploadedFile.type.startsWith("image/") ||
    !uploadedFile.type.match("image/jpeg") ||
    uploadedFile.size >= 300 * 1024
  ) {
    error.removeClass("hidden");
    return;
  }

  error.addClass("hidden");

  var reader = new FileReader();
  reader.onload = function (e) {
    image_face.attr("src", e.target.result);
  };
  reader.readAsDataURL(uploadedFile);
});

minus.click(function () {
  var scale = parseFloat(selected_image.attr("zoom"));
  scale = Math.max(0.1, scale - 0.1);
  selected_image.css("transform", "scale(" + scale + ")");
  selected_image.attr("zoom", scale);
});

plus.click(function () {
  var scale = parseFloat(selected_image.attr("zoom"));
  scale = Math.min(2, scale + 0.1);
  selected_image.css("transform", "scale(" + scale + ")");
  selected_image.attr("zoom", scale);
});

left.click(function () {
  var rotation = parseInt(selected_image.attr("rotation")) - 10;
  selected_image.css("transform", `rotate(${rotation}deg)`);
  selected_image.attr("rotation", rotation);
});

right.click(function () {
  var rotation = parseInt(selected_image.attr("rotation")) + 10;
  selected_image.css("transform", `rotate(${rotation}deg)`);
  selected_image.attr("rotation", rotation);
});

glasses.draggable({
  revert: "invalid",
  containment: "document",
  zIndex: 1000,
  start: function (event, ui) {
    selectImage(this);
  },
});

beards.draggable({
  revert: "invalid",
  containment: "document",
  zIndex: 1000,
  start: function (event, ui) {
    selectImage(this);
  },
});

hats.draggable({
  revert: "invalid",
  containment: "document",
  zIndex: 1000,
  start: function (event, ui) {
    selectImage(this);
  },
});

image_face
  .droppable({
    accept: ".accessories",
    drop: function (event, ui) {
      console.log(ui);

      switch (ui.draggable.attr("alt")) {
        case "Glasses":
          if (selectedGlasses !== null) {
            $(selectedGlasses).css("inset", "0px auto auto 0px");
          }
          selectedGlasses = ui.draggable;
          break;

        case "Beards":
          if (selectedBeards !== null) {
            $(selectedBeards).css("inset", "0px auto auto 0px");
          }
          selectedBeards = ui.draggable;
          break;

        case "Hats":
          if (selectedHats !== null) {
            $(selectedHats).css("inset", "0px auto auto 0px");
          }
          selectedHats = ui.draggable;
          break;
      }
    },
  })
  .click(function () {
    selectImage(this);
  });

// Utils
function selectImage(image) {
  selected_image = $(image);
  $(".dotted-border").removeClass("dotted-border");
  selected_image.addClass("dotted-border");
}

function savePicture() {
  cloneGlasses = selectedGlasses.clone();
  cloneGlasses.css("position", "absolute");
  cloneGlasses.css("top", selected_image.position().top);
  cloneGlasses.css("left", selected_image.position().left);
  cloneGlasses.css("transform", selected_image.css("transform"));
  cloneGlasses.css("zoom", selected_image.attr("zoom"));
  cloneGlasses.css("rotation", selected_image.attr("rotation"));
  picture.append(cloneGlasses);

  html2canvas(document.getElementById("picture"))
    .then(function (canvas) {
      var dataUrl = canvas.toDataURL("image/jpeg");

      var link = document.createElement("a");
      link.href = dataUrl;
      link.download = "FunnyFace2015.jpg";
      link.click();
    })
    .catch(function (error) {
      console.error("Error capturing image:", error);
    });
}

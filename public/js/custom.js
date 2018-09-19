$(document).ready(function() {
  var redirect = "/";
  $("#register-errors")
    .parent()
    .css({ display: "none" });
  $("#signin-errors")
    .parent()
    .css({ display: "none" });
  $("#profile-description-form").hide();
  $("#upload-product").click(function() {
    redirect = "/upload-product";
  });
  $("#acceder").click(function() {
    redirect = "/";
  });
  $("#signup-form").submit(function(event) {
    event.preventDefault();
    var username = $("#signup-username").val();
    var name = $("#signup-name").val();
    var email = $("#signup-email").val();
    var password = $("#signup-pwd").val();
    $.ajax({
      url: "/signup",
      type: "POST",
      data: {
        username: username,
        name: name,
        email: email,
        password: password
      },
      success: function(response) {
        if (response.success === true) {
          location.href = redirect;
        }
      },
      error: function(response) {
        $("#register-errors")
          .empty()
          .parent()
          .css({ display: "block" });
        var errors = response.responseJSON.errors;
        for (var i = 0; i < errors.length; i++) {
          $("#register-errors").append("<li>" + errors[i] + "</li>");
        }
      }
    });
  });

  $("#signin-form").submit(function(event) {
    event.preventDefault();
    var username = $("#signin-username").val();
    var password = $("#signin-password").val();
    $.ajax({
      url: "/signin",
      type: "POST",
      data: {
        username: username,
        password: password
      },
      success: function(response) {
        if (response.success === true) {
          location.href = redirect;
        }
      },
      error: function(response) {
        $("#signin-errors")
          .empty()
          .parent()
          .css({ display: "block" });
        var errors = response.responseJSON.error;
        for (var i = 0; i < errors.length; i++) {
          $("#signin-errors").append("<li>" + errors[i] + "</li>");
        }
      }
    });
  });

  $("#image-upload").click(function() {
    $("#product-img").trigger("click");
  });

  $("#product-img").change(function(event) {
    var tmppath = URL.createObjectURL(event.target.files[0]);
    $("#product-img-prev").attr("src", tmppath);
  });

  $("#show-link").click(function() {
    $("#product-link").show();
    $("#show-link").addClass("selected");
    $("#hide-link").removeClass("selected");
  });
  $("#hide-link").click(function() {
    $("#product-link").hide();
    $("#hide-link").addClass("selected");
    $("#show-link").removeClass("selected");
  });
  $("#product-location").hide();
  $("#show-location").click(function() {
    $("#product-location").show();
    $("#show-location").addClass("selected");
    $("#hide-location").removeClass("selected");
  });
  $("#hide-location").click(function() {
    $("#product-location").hide();
    $("#hide-location").addClass("selected");
    $("#show-location").removeClass("selected");
  });

  $("#profile-description-edit").click(function(event) {
    event.preventDefault();
    $(".profile-description p").hide();
    $("#profile-description-form").show();
  });

  $("#profile-description-cancel").click(function(event) {
    event.preventDefault();
    $(".profile-description p").show();
    $("#profile-description-form").hide();
  });
  $("#profile-description-save").click(function(event) {
    event.preventDefault();
    var description = $("#profile-description-field").val();
    $.ajax({
      url: "/profile",
      type: "POST",
      data: {
        description: description
      },
      success: function(response) {
        if (response.success === true) {
          $(".profile-description p").show();
          $(".profile-description p").html(description);
          $("#profile-description-form").hide();
        }
      }
    });
  });

  $("#add-description").click(function() {
    $("#profile-description-form").show();
  });
});

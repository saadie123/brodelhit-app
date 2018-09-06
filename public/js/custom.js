$(document).ready(function() {
  var redirect = "/";
  $("#register-errors")
    .parent()
    .css({ display: "none" });
  $("#signin-errors")
    .parent()
    .css({ display: "none" });
  $("#upload-product").click(function() {
    redirect = "/upload-product";
  });
  $("#acceder").click(function() {
    redirect = "/";
  });
  $("#signup-form").submit(function(event) {
    event.preventDefault();
    var username = $("#signup-username").val();
    var email = $("#signup-email").val();
    var password = $("#signup-pwd").val();
    $.ajax({
      url: "/signup",
      type: "POST",
      data: {
        username: username,
        email: email,
        password: password
      },
      success: function(response) {
        if (response.success === true) {
          location.href = "/register-complete";
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
});

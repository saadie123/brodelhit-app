$(document).ready(function() {
  $("#register-errors")
    .parent()
    .css({ display: "none" });
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
        console.log(response);
      }
    });
  });
});

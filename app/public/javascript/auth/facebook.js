$(document).ready(function () {
  $.fbInit('FACEBOOK_API_KEY');

  // FB Connect action
  $('#fb-connect').bind('click', function () {
    $.fbConnect({'include': ['first_name', 'last_name', 'name', 'pic']}, function (fbSession) {
      $('.not_authenticated').hide();
      $('.authenticated').show();
      $('#fb-first_name').html(fbSession.first_name);
    });
    return false;
  });

  // FB Logout action
  $('#fb-logout').bind('click', function () {
    $.fbLogout(function () {
      $('.authenticated').hide();
      $('.not_authenticated').show();
    });
    return false;
  });

  // Check whether we're logged in and arrange page accordingly
  $.fbIsAuthenticated(function (fbSession) {
    // Authenticated!
    $('.authenticated').show();
    $('#fb-first_name').html(fbSession.first_name);
  }, function () {
    // Not authenticated
    $('.not_authenticated').show();
  });

});
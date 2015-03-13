/*global $:true */
/*global Handlebars:true */
/*global Backbone:true */
'use strict';

var UserRouter = Backbone.Router.extend({
  routes: {
    'users': 'submitRegistration',
    'users/sign_in': 'submitLogin'
  },

  submitRegistration: function(event){
    $('#container').empty().load('partials/register-form.html', function(){
      var $form = $('#registration-form');
      $form.on('submit', function(event){
        event.preventDefault();
        $.ajax({
          url: 'http://localhost:3000/users',
          type: 'POST',
          data: { user: {
            name: $('#user-name').val(),
            email: $('#user-email').val(),
            password: $('#user-password').val(),
            address: $('#user-address').val()
          }}
        }).done(App.loginSuccess).fail(function(err){
          console.log(err);
        });
      });
    });
  },


  submitLogin: function(event){
    $('#container').empty().load('partials/login-form.html', function(){
      var $form = $('#login-form');
      $form.on('submit', function(event){
        event.preventDefault();
        $.ajax({
          url: 'http://localhost:3000/users/sign_in',
          type: 'POST',
          data: { user: {
            name: $('#user-email').val(),
            password: $('#user-password').val()
          }}
        }).done(App.loginSuccess).fail(function(err){
          console.log(err);
        });
      });
    });

    return false;
  }

});

var userRouter = new UserRouter();

var App = App || {};

var authToken = localStorage.getItem('authToken');

App.loginSuccess = function(userData){
  localStorage.setItem('authToken', userData.token);
  console.log(userData);
  console.log('logged in!');
  // window.location.href = '/';
};

App.setupAjaxRequests = function() {
  $.ajaxPrefilter(function( options ) {
    options.headers = {};
    options.headers['AUTHORIZATION'] = "Token token=" + authToken;
  });
};

App.signOut = function(event){
  event.preventDefault();
  localStorage.removeItem('authToken');
  authToken = undefined;
};

$(document).ready(function(){
  $('#sign-out').on('click', function(event){
    App.signOut(event);
  });
});

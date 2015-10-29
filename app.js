(function (window, $) {
	'use strict';

	const API_ROOT_URL = "http://greenvelvet.alwaysdata.net/kwick/api/";
	const $user = $('#user');
	const $psw = $('#psw');
	const $logout = $('#logout');
	const $submit = $('#submit');
	const $message = $('#message');

	function callKwickAPI(url, cb) {
		var request = $.ajax({
						type: 	'GET',
						dataType: 'jsonp',
						url: 	API_ROOT_URL + url,
		});


		//en cas d'erreur
		request.fail(function(jqXHR, textStatus, errorThrown) {
			cb(textStatus, null);
		});

		//en cas de succès
		request.done(function(data) {
			cb(null, data);
		});
	}

	var app = {

		token: null,
		id: null,

		// Fonction pour l'inscription

		initializeSignUp: function() {
			app.signup();
		},

		signup :function() {
			$('#form').on('submit', app.signupSubmit);
		},

		signupSubmit: function(e) {

			e.preventDefault();

			var user = $user.val();
			var psw = $psw.val();

			app.getSignUp(user, psw);

			$user.val('');
			$psw.val('');
		},

		getSignUp: function(user, psw) {
			callKwickAPI('signup/' + user+ '/'+ psw, function (err, data) {
				if (err)
					return alert(err);

				if (data.result.status == 'failure') {
					$('#log').empty().append('<p id="cont" >this login is not available</p>');
				}else {
					$('#log').empty().append('<p id="cont" >You are Registered ' + user +'</p>');

					$('#login').css ({
						visibility: 'visible',
					})
				}

				console.log(data);


			})
		},

		// Fonction pour la connecxion

		initializeLogin: function() {
			app.login();
		},

		login :function() {
			$('#form').on('submit', app.loginSumit);
		},

		loginSumit: function(e) {

			e.preventDefault();

			var user = $user.val();
			var psw = $psw.val();

			app.getLogin(user, psw);

			$user.val('');
			$psw.val('');
		},

		getLogin: function(user, psw) {
			callKwickAPI('login/' + user+ '/'+ psw, function (err, data) {
				if (err)
					return alert(err);

				if (data.result.status == 'failure') {
					$('#log').empty().append('<p id="cont">Wrong Login or Password</p>');
				}else{

					window.location.href="t'chat.html"

					app.setCredentials(data);
				}
			})
		},

		// Fonction pour la deconnecxion

		initializeLogout: function() {
			app.logout();
		},

		logout :function() {

			$logout.on('click', function() {

				app.getLogout(app.token, app.id);
				
			})
		},

		getLogout: function(token, id) {
			callKwickAPI('logout/' + token+ '/'+ id, function (err, data) {
				if (err)
					return alert(err);

				app.removeCredentials();

				window.location.href="login.html"
			})
		},

		// Fonction pour afficher la liste des utilisateur connecter

		initalizeChat: function () {

			app.getCredentials();

				if ((app.id === 0 || app.token === 'undefined') || (app.id === null || app.token === null)) {
					window.location.href="login.html"
				}else {
					app.getUserLoged();
					app.getMessage();
					setInterval(function(){
						app.getUserLoged();
						app.getMessage();
					}, 1500);		
				}
		},

		getUserLoged: function() {

			app.token = localStorage.getItem("token");

			callKwickAPI('user/logged/' + app.token, function (err, data) {
				if (err)
					return alert(err);

			app.userLoged(data);

			})
		},

		userLoged: function(data) {
			$('#user_log').empty();
			for (var i = 0; i < data.result.user.length; i++) {
				$('#user_log').append('<li><img src="../img/user.png" alt="">' + data.result.user[i] + '</li>');
			};
		},

		//Fonction pour afficher le t'chat

		getMessage: function() {

			app.token = localStorage.getItem("token");

			callKwickAPI('/talk/list/' + app.token +'/' + 0, function (err, data) {
				if (err)
					return alert(err);

			app.Message(data);

			})
		},

		Message: function(data) {
			var message = data.result.talk;
			$message.empty();
			for (var j = 0; j < message.length; j++) {
				$message.append('<p>' + '<span>' + message[j].user_name+ "</span> : " + message[j].content + '</p>');
				$message.scrollTop(10*1000000);
			};
		},

		
		//Fonction pour parler dans le t'chat
		
		initializeTalk: function() {
			app.sayUserButton();
		},

		sayUserButton: function() {
			$('#shoutbox').on('submit', app.sendMessage);
		},

		sendMessage: function(e) {
			e.preventDefault();

			var mess = encodeURIComponent($('#send').val());

			app.SendsayUser(app.token, app.id, mess);

			$('#send').val('');

			app.getMessage();
		},

		SendsayUser: function(token, id, mess) {

			app.token = localStorage.getItem("token");
			app.id = localStorage.getItem("id");

			callKwickAPI('say/'+ token + '/' + id + '/' + mess, function (err, data) {
				if (err)
					return alert(err);
			})
		},


		//Fonction pour Token et Id (LocalStorage)

		setCredentials: function(data) {
			app.token = data.result.token;
			app.id    = data.result.id;

			localStorage.setItem("token", data.result.token);
			localStorage.setItem("id", data.result.id);
		},

		getCredentials: function () {
			app.token = localStorage.getItem("token");
			app.id    = localStorage.getItem("id");
		},

		removeCredentials: function() {
			app.token = null;
			app.id    = null;

			localStorage.removeItem("token");
			localStorage.removeItem("id");
		},

		
	};

	window.app = app;

})(window, jQuery)
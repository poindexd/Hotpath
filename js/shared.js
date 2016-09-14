var config = {
	apiKey: "AIzaSyD3rOCm6moeTToONRvSU90ieHY9WxUOES0",
	authDomain: "hotpath-e3fad.firebaseapp.com",
	databaseURL: "https://hotpath-e3fad.firebaseio.com",
	storageBucket: "hotpath-e3fad.appspot.com",
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
	} else {
		if (!window.location.pathname.includes('login'))
			window.location = encodeURI('login.html?redirect=' + encodeURIComponent(window.location.href));
	}
});


function unique(value, index, self) { 
	if (value) return self.indexOf(value) === index;
}

function combine(pre, cur) {
	return pre.concat(cur);
}

function p(name){
	return (function(name, obj){
		if (obj)
			return obj[name];
	}).bind(null, name);
}
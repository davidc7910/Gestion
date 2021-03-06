var self;
function ViewModel() {
	self = this;
	self.listausuarios = ko.observableArray([]);
	self.nombreProyecto = ko.observable('');
	self.user = ko.observable('');
	this.usuario = sessionStorage.userName;
	var url = "ws://" + window.location.host + "/Gestion";
	self.sws = new WebSocket(url);
	
	self.sws.onopen = function(event) {
		self.user(sessionStorage.userName);
		var msg = {
			type: "ready",
			nombre: sessionStorage.userName,
			vista: "validar",
			
		};
		self.sws.send(JSON.stringify(msg));
	};
	
	self.sws.onmessage = function(event) {


		var data = event.data;
		data = JSON.parse(data);
		var usuarios = data.usuarios;


		for (var i = 0; i < usuarios.length; i++) {
			var usuario = usuarios[i];
				self.listausuarios.push(new Usuario(usuario.name, usuario.password, usuario.email, usuario.validado));
			
			

		}
	
		document.getElementsByTagName('h1')[0].innerText = sessionStorage.userName;

	}
	
	self.eliminar = function(){
		const info ={
				type: 'eliminar',
		};
		self.sws.send(JSON.stringify(info));
		location.reload();
	};
	
	
	class Usuario {
		constructor (nombre, password, email, validado) {
			this.nombre = nombre;
			this.password = password;
			this.email = email;
			this.validado = validado;
		}
		
		validacion(){
			var p = {
					type: "validacion",
					nombre: this.nombre
				};
				
				self.sws.send(JSON.stringify(p));
				location.reload();
		}
	}
	
	
	
}
var vm = new ViewModel();
ko.applyBindings(vm);
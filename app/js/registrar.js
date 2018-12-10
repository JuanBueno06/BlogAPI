
$(document).ready(function() {
    $("#registrarse").click(function(){
      registrar();
    })
  })
  
  function registrar() {
    var username = $("#email").val();
    var name = $("#nombre").val();
    var password = $("#password").val();
    var password2 = $("#password2").val();
  
    if (password != password2) {
      alert("La contraseña son diferentes")
    }
  
    var data = {
      name: name,
      email: username, 
      contrasena: password2
    }
      
    fetch("http://68.183.27.173:8080/register", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( res => res.json())
    .then(response => {
      console.log('Succes:', JSON.stringify(response))
    location.href ="../blogapi/index.html"
  })
    .catch(error => console.error('error', error));
  }
  
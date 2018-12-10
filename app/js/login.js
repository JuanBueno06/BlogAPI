

$(document).ready(function() {
  $("#btnlogin").click(function(){
    login();
  })
})

function login() {
    var username = $("#email").val();
    var password = $("#password").val();
  
    if (username === '' || password === '') {
      alert('Debe introducir el usuario y la contraseña');
      return;
    }
  
    var data = {
      email: username,
      password: password,
    }

    fetch("http://68.183.27.173:8080/login", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      var data = JSON.parse(JSON.stringify(response));
      localStorage.setItem("BlogApi_token", data.token);
      location.href = "./post/post.html";
  
    })
    .catch(error => {
      alert('El Usuario o la contraseña son Incorrectos')
      console.error('error', error)
    });
  }
  
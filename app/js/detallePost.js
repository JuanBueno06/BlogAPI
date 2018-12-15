$(document).ready(function () {
    cargarDetallePost();
})

function wsConnect(token) {

    console.log("WS- connect ", token);
    var websocket = new WebSocket(`ws://68.183.27.173:8080/?token=${token}`);
    websocket.onopen = function (evt) {
        console.log(evt)
    };
    websocket.onclose = function (evt) {
        console.log(evt)
    };
    websocket.onerror = function (evt) {
        console.log(evt)
    };

    websocket.onmessage = function (evt) {
        var data = JSON.parse(evt.data);
        console.log(data);
        switch (data.type) {
            case "likes":
                $('#BlogApi-like-' + data.postId).text(data.likes);
                break;
            case "view-post":
                // TODO: cambias likes por views
                $('#BlogApi-views-' + data.postId).text(data.views);
                break;

        }
    };
}

function cargarDetallePost() {
    var objeto = $("#informacionPost");

    var pantilla2 = `
        <article class="blog-post">
        <div class="blog-post-image">

        </div>
        <div class="blog-post-body">
            <h2><a href="detallePost.html">{titulo}</a></h2>
            <div class="post-meta">
                <span>by <a href="#">{username} - ({email})</a></span> / 
                <span><i class="fa fa-clock-o"></i>{fecha}</span> /
                <span><i class="fas fa-comments"></i> <a href="#">{comentarios}</a></span> /
                <span><i class="fas fa-hand-holding-heart"></i>{likes}</span> /
                <span><i class="far fa-eye"></i>{viwes}</span> 
            </div>
            <p>{cuerpo}</p>
            <p><i postid="{postid}" tieneLike="{tieneLike}" class="fas fa-hand-holding-heart genlike" id="{likePostId}"></i>
      <span id= "BlogApi-like-{postid}"></span></p>
        </div>
    </article>

    <div class="aside-widget">
        <div class="tags-widget">
            <ul>
               {tags}
            </ul>
        </div>
    </div>

    <div class="blog-comment">
         <h2>Comentarios del Post</h2>
         <form class="comment-form" action="">
                 <div class="form-group">                
                    <input type="text" placeholder="Nombre" class="form-control">
                </div>
         <div class="form-group">                
             <input type="email" placeholder="Email" class="form-control">
         </div>              
         <div class="form-group">
             <textarea class="form-control"></textarea>
         </div>
            <button class="button button-default" data-text="Comment" type="submit"><span>Comentario</span></button>
         </form>
     </div>

    `
    var token = localStorage.getItem("BlogApi_token")
    wsConnect(token)
    var postId = localStorage.getItem("Blogapi_postId");

    fetch(`http://68.183.27.173:8080/post/${postId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .then(response => {

            var post = response;
            var fecha = getfecha(post.createdAt)
            var tags = obtenerTags(post.tags);

            var item = pantilla2
                .replace("{titulo}", post.title)
                .replace("{cuerpo}", post.body)
                .replace("{comentarios}", post.comments)
                .replace("{likes}", post.likes)
                .replace("{username}", post.userName)
                .replace("{viwes}", post.views)
                .replace("{email}", post.userEmail)
                .replace("{tags}", tags)
                .replace("{fecha}", fecha);


            obtenerComentarios(post.id);
            objeto.append(item);
            console.log(item);

        })
        .catch((error) => console.log(error));


}


function obtenerTags(tags) {
    var plantilla = `<li><spab>{tag}</span></li>`;
    var htmltags = '';
    for (var tag of tags) {
        var item = plantilla.replace('{tag}', tag);
        htmltags += item;
    }
    return htmltags;
}

function getfecha(createdAt) {

    let date = new Date(createdAt);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();

    return `${day}-${month}-${year}`
}


function obtenerComentarios(postId) {
    //var plantilla = `<li><spab>{tag}</span></li>`;
    var htmlComent2 = "";
    var comentario = "";
    var token = localStorage.getItem("BlogApi_token");

    var htmlComent = "<li> {coment} {fecha}  </li>"

    fetch(`http://68.183.27.173:8080/post/${postId}/comment`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },

        })
        .then(res => res.json())
        .then(response => {

            for (const coment of response) {

                var fecha = getfecha(coment.createdAt);
                comentario = htmlComent;
                comentario = comentario
                    .replace('{coment}', coment.body)
                    .replace('{fecha}', fecha);
                htmlComent2 += comentario;

            }
            console.log(htmlComent2)
            $(`#postComentarios`).append(htmlComent2);
        })
        .catch((error) => console.log(error));
}


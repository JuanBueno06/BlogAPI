
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

$(document).ready(function () {
    $("body").on("click", ".genlike", function (e) {

        e.preventDefault();

        var post = parseInt($.trim($(this).attr("postid")));
        var tieneLike = parseInt($.trim($(this).attr("tieneLike")));
        // var tieneLike = $(`#postLike${post}`).attr("fas");

        aplicarLike(post, tieneLike);
    })

    cargarPost();
})

function detallePost(postId) {
    localStorage.setItem('Blogapi_postId', postId);
    location.href ="detallePost.html";
}

function cargarPost() {
    var lista = $("#misPost");

   
    var pantilla2 = `
        <article class="blog-post">
        <div class="blog-post-image">

        </div>
        <div class="blog-post-body">
            <h2><a href="javascript:;" onclick="detallePost({postid})">{titulo}</a></h2>
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
    `
    var token = localStorage.getItem("BlogApi_token")
    console.log(token);
    wsConnect(token)
    fetch("http://68.183.27.173:8080/post", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .then(response => {

            console.log(response);
            for (var post of response) {
                var fecha = getfecha(post.createdAt)
                var tieneLike = 0;
                if (post.liked) {
                    tieneLike = 1;
                }

                var tags = obtenerTags(post.tags);
                var cuerpo = post.body.substr(0, 150) + '...'

                var item = pantilla2
                    .replace("{titulo}", post.title)
                    .replace("{cuerpo}", cuerpo)
                    .replace("{comentarios}", post.comments)
                    .replace("{likes}", post.likes)
                    .replace("{username}", post.userName)
                    .replace("{viwes}", post.views)
                    .replace("{email}", post.userEmail)
                    .replace("{tags}", tags)
                    .replace("{fecha}", fecha)
                    .replace("{postid}", post.id)
                    .replace("{postid}", post.id)
                    .replace("{postid}", post.id)
                    .replace("{postid}", post.id)
                    .replace("{tieneLike}", tieneLike)
                    .replace("{likePostId}", `postLike${post.id}`)


                // obtenerComentarios(post.id);
                lista.append(`<li>${item}</li>`)
            }
        })
        .catch((error) => console.log(error));


}

function obtenerTags(tags) {
    var plantilla = ` <li><spab>{tag}</span></li>`;
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

function aplicarLike(postId, tieneLike) {
    console.log('liked')
    if (tieneLike) {
        quitarLike(postId)
    } else {
        generarLike(postId)
    }
}

function generarLike(postId) {
    var token = localStorage.getItem("BlogApi_token")

    fetch(`http://68.183.27.173:8080/post/${postId}/like`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        method: 'PUT'
    })
        .then(response => {
            if (response.ok) {
                console.log('like generado')
            }
        }).catch((error) => console.log(error))
}

function quitarLike(postId) {

    var token = localStorage.getItem("BlogApi_token")

    fetch(`http://68.183.27.173:8080/post/${postId}/like`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                console.log('like quitado')
            }
        }).catch((error) => console.log(error))
}


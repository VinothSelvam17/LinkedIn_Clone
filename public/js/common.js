const postTextarea = document.getElementById("postTextarea");
const submitButton = document.getElementById("PostBtn");

postTextarea.addEventListener("keyup", function (e) {
  const textBox = e.target;
  const value=textBox.value.trim();
  if(value == ""){
    submitButton.disabled = true;
    return;
  }
  submitButton.disabled = false;
});

submitButton.addEventListener("click", function (e){
  e.preventDefault();
  const data = new URLSearchParams();
  data.append("content", postTextarea.value);
  
  sendHttpRequest("POST", "http://localhost:2023/api/posts", data)
  .then((data) => {
    // console.log(data);
     var htmlData=createPost(data);
    const postsContainer = document.querySelector(".messages");
    postsContainer.insertAdjacentHTML("afterbegin", htmlData);
  })
  .catch((err) =>{
    console.log(err);
  });  

  // fetch("http://localhost:2023/Linkedin/users",{
  //   method:"POST",
  //   headers:{
  //      //"Content-Type": "application/json",
  //      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  //   },
  //   body:data,
  // })
  //   .then((res)=> res.json())
  //   .then((data)=> {
  //     // console.log(data);
  //     var htmlData = createPost(data);
  //     const postsContainer = document.querySelector(".messages");
  //     postsContainer.insertAdjacentHTML("afterbegin", htmlData);
  //     submitButton.disabled = true; 
  //   })
  postTextarea.value="";
});

async function getAllPost(){
  const response = await fetch("http://localhost:2023/api/posts");
  const posts = await response.json();
// console.log(posts);
  posts.forEach((post)=>{
    const messages = document.querySelector(".messages");
    const content = createPost(post);
    // console.log(content);
    messages.innerHTML = content + messages.innerHTML;
  });
}
getAllPost();

function createPost(post){
  // console.log(post);
  if(post == null ) return alert("Post Object is null");

  const isRewteet = post.retweetData !== undefined;
  const retweetedBy = isRewteet ? post.postedBy.username : null;
  post = isRewteet ? post.retweetData : post;

  const activeBtn = post.likes.includes(userLoggedIn._id) ? "active" : ""; 
  const activeRetweetBtn = post.retweetUsers.includes(userLoggedIn._id) ? "active" : "";

  let delButton ="";
  if(post.postedBy._id == userLoggedIn._id){
      delButton=`<button class='del-button'>&times;</button>`
  }

  let retweetText = "";
  if(isRewteet){    retweetText=`
    <span>
      <i class="fa fa-share"></i>
      Retweeted By <a href='/profile/${retweetedBy}'>${retweetedBy}</a>
    </span>
    `;
  }

  let data=`
    <div class="content" data-id="${post._id}">
    <div class='retweetText'>${retweetText}</div>
    <div class="messager">
    ${delButton}
      <div class="posts">
        <div>
          <img src="${post.postedBy.profilePic}" alt="">
          <i>${post.postedBy.username}</i> <span><small>${post.postedBy.role} | <span class="time">${timeFormat(new Date(), new Date(post.createdAt))}</span> </small></span>
        </div>                  
      </div>
      <div class="pstcnt">${post.content}</div>
      <hr>
      <div class="li">
        <button class="likeBtn ${activeBtn}"> <i class="fa fa-thumbs-o-up"></i><span>${post.likes.length || ""}</span><br><span>Like</span></button>
        <button class="commentBtn"><i class="fa fa-comment-o"></i><span></span><br><span>Comment</span></button>  
        <button class="retweetBtn ${activeRetweetBtn}"><i class="fa fa-retweet"></i><span>${post.retweetUsers.length || ""}</span><br><span>Repost</span></button>
        <button class="fa fa-paper-plane-o"><span></span><br><span>Send</span></button>
      </div>    
      <div class="comment-section" data-id='${post._id}'>
        <div class="textareaDiv">
          <textarea placeholder="Leave your thoughts here..." class="txtComment" data-id='${post._id}'></textarea>
          <span class="fa fa-close btnClear"></span>
          <button class="btnsend"><i class="fa fa-paper-plane-o"></i></button>
        </div>    
        <div class="comment-container"> 
      </div>
    </div>
  </div>`;
  return data;
}

function timeFormat(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const diff = current - previous;

  if (diff < msPerMinute) {
    if (diff / 1000 < 30) return "Just Now";
    return Math.round(diff / 1000) + " seconds ago";
  } else if (diff < msPerHour) {
    return Math.round(diff / msPerMinute) + " minutes ago";
  } else if (diff < msPerDay) {
    return Math.round(diff / msPerHour) + " hours ago";
  } else if (diff < msPerMonth) {
    return Math.round(diff / msPerDay) + " days ago";
  } else if (diff < msPerYear) {
    return Math.round(diff / msPerMonth) + " months ago";
  } else {
    return Math.round(diff / msPerYear) + " years ago";
  }
}
//like
document.addEventListener("click", async function (event){
  const target = event.target;
  if(target.classList.contains("likeBtn")){
    const likeBtn=target;
    const postId= getPostId(likeBtn);
    if(postId === undefined){
      return;
    }
    const uri=`/api/posts/${postId}/like`;

    const response = await fetch(uri, {
      method:"PUT",
    }); 

    const posts = await response.json();
    likeBtn.querySelector("span").textContent = posts.likes.length || "";
    //console.log(userLoggedId);
    if(posts.likes.includes(userLoggedIn._id)){
      likeBtn.classList.add("active")
    }else{
      likeBtn.classList.remove("active");
    }
  }
});

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = "json";
    if (data) {
      console.log("Content : ", data);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    }
    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject("Errors");
    };

    xhr.send(data); 
  });

  return promise;
};

function getPostId(element) {
  const isRoot = element.classList.contains("post");
  const rootElement = isRoot == "true" ? element : element.closest(".content");
  const postId = rootElement.dataset.id;
  if (postId === undefined) {
    return alert("Post id Undefined");
  }
  return postId;
}
//retweet
document.addEventListener("click", async function (event){
  const target = event.target;
  if(target.classList.contains("retweetBtn")){
    const button = target;
    const postId = getPostId(button);
    if(postId === undefined){
      return;
    }
    const uri = `/api/posts/${postId}/retweet`;

    const response = await fetch(uri, {
      method: "POST",
    });
    const posts = await response.json();
    // console.log(posts);
    button.querySelector("span").textContent = posts.retweetUsers.length || "";
    if(posts.likes.includes(userLoggedIn._id)){
      button.classList.add("active");
    }else{
      button.classList.remove("active");
    }
    location.reload();
  }
});
//comment
document.addEventListener("click", async function (event){
  const target = event.target;
  if(target.classList.contains("commentBtn")){
   const commentBtn = target;
   const postId = getPostId(commentBtn);
  //  console.log(postId);
   const commentSection=commentBtn.parentElement.nextElementSibling;
   commentSection.classList.toggle("commentActive");
   if(commentSection.classList.contains("commentActive")){
      const url=`/api/posts/${postId}/usercomment`;
      const response = await fetch(url);
      const comments = await response.json();
      const commentContainer = commentSection.querySelector(".comment-container");
      let htmlcomment = "";
      comments.forEach((comment)=>{
      htmlcomment += `<div class="comment-container">
      <div class="comment">
        <div class="user-pic">
          <img src='${comment.commentBy.profilePic}' width="50px">
        </div>
        <div class="comment-body">
          <div class="comment-header">
            <div class="username"
              <a href="#">${comment.commentBy.username}</a>
              <span>@${comment.commentBy.role}</span>
            </div>
            <div class="time">${timeFormat(new Date(), new Date(comment.createdAt))}</div>
          </div>
          <div class="comment-message">
            <p>${comment.comment}</p>
          </div>
        </div>
      </div>
    </div>
    `;
      });
      commentContainer.innerHTML=htmlcomment;
   }
  }
  if(target.classList.contains('btnClear')){
    const textarea=target.previousElementSibling;
    textarea.value="";
    textarea.focus();
  }
  if(target.classList.contains('btnsend')){
    const textarea=target.previousElementSibling.previousElementSibling;
    const postID=textarea.dataset.id;
    if(textarea.value.trim() != ""){
      const url=`/api/posts/${postID}/comment`;
      const data=new URLSearchParams(); 
      data.append("comment", textarea.value.trim());
      const response = await fetch(url,{method:"POST", body:data});
      const comment = await response.json();

      const commentContainer = textarea.parentElement.nextElementSibling;
      commentContainer.innerHTML=`
      <div class="comment">
      <div class="user-pic">
        <img src='${userLoggedIn.profilePic}' width="50px">
      </div>
      <div class="comment-body">
        <div class="comment-header">
          <div class="username"
            <a href="#">${userLoggedIn.username}</a>
            <span>@${userLoggedIn.role}</span>
          </div>
          <div class="time">${timeFormat(new Date(), new Date(comment.createdAt))}</div>
        </div>
        <div class="comment-message">
          <p>${comment.comment}</p>
        </div>
      </div>
    </div>     
      `;
      textarea.value="";
    }
  }
});
//view post page
document.addEventListener("click",async function (event){
  const target=event.target;
  if(target.classList.contains("pstcnt")){
    const postID=target.parentElement.parentElement.dataset.id;
    if(postID == undefined)return;
    window.location.href="/posts/" + postID;
  }
});

const modal= document.querySelector(".modal-box");
document.addEventListener("click", async function (event){
  const target = event.target;
  if(target.classList.contains("del-button")){
    //delete post
    modal.classList.add("show-modal");
    const postId=target.parentElement.parentElement.dataset.id;

    const btnDelete=document.getElementById("btnDelete");
    btnDelete.addEventListener("click", function(){
      const url=`api/posts/${postId}`;
      fetch(url, {method:"DELETE"}).then(()=>{
        modal.classList.remove("show-modal");
        location.reload();
      });
    });
  }else if(target.classList.contains("close-button")){
    modal.classList.remove("show-modal");
  }
});

window.addEventListener("click", async function(event){
  if(event.target === modal){
    modal.classList.remove("show-modal");
  }
});
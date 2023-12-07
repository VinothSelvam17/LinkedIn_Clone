document.addEventListener("DOMContentLoaded", async function (){
    const url=`/api/posts/${requested_postId}/single`;
    const response = await fetch(url);
    const postDetails = await response.json();
    // console.log(postDetails);
    const messages = document.querySelector(".messages");
    messages.innerHTML = createPost(postDetails.post);
    loadComments(postDetails.comments);
});

function createPost(post){
    console.log(post);
    if(post == null ) return alert("Post Object is null");
  
    const isRewteet = post.retweetData !== undefined;
    const retweetedBy = isRewteet ? post.postedBy.username : null;
    post = isRewteet ? post.retweetData : post;
  
    const activeBtn = post.likes.includes(userLoggedIn._id) ? "active" : ""; 
    const activeRetweetBtn = post.retweetUsers.includes(userLoggedIn._id) ? "active" : "";
  
    let delButton ="";
    if(post.postedBy._id==userLoggedIn._id){
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
        <div class="comments">

        </div> 
      </div>
    </div>`;
    return data;
  }

function loadComments(comments){
    const commentContainer = document.querySelector(".comments");
    console.log(commentContainer);
    comments.forEach((comment)=>{
        commentContainer.innerHTML += `
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
        </div>`;
    });
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


import { tweetsData as datajs } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const responseInput = document.getElementById('modal-input')
const modalBox =  document.getElementById('modal-box')
const confirmYesBtn = document.getElementById('confirm-yes')
let tweetsData = datajs 

if(localStorage.getItem('data')){
    tweetsData = JSON.parse(localStorage.getItem('data'))
}else{
    localStorage.setItem('data', JSON.stringify(tweetsData))
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }else if(e.target.id === 'close-module-btn'){
        handleCloseModuleBtnClick()
    }else if(e.target.dataset.respond){
        handleRespondBtnClick(e.target.dataset.respond)
    }else if(e.target.id === 'reply-btn'){
        handleModalSendBtnClick(responseInput.dataset.response)
    }else if(e.target.dataset.delete)
        handleDeleteBtnClick(e.target.dataset.delete)
    else if(e.target.id === 'confirm-yes')
        handleDeleteConfirmClick(confirmYesBtn.dataset.deleteItem)
    else if(e.target.id === 'confirm-no')
        handleDeleteBtnClick()
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba ✅`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleCloseModuleBtnClick(){
    modalBox.classList.toggle('hidden')
}

function handleRespondBtnClick(tweetId){
    const tweetObject = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0]
    const username = tweetObject.handle
    modalBox.classList.toggle('hidden')
    document.getElementById('response-message').textContent = `Responding to ${username}'s post`
    responseInput.dataset.response = tweetId
}

function handleModalSendBtnClick(tweetId){
    const tweetObject = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0]

    if(responseInput.value){
        tweetObject.replies.unshift({
            handle: `@Scrimba ✅`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: responseInput.value
        })
        responseInput.value = ''
        modalBox.classList.toggle('hidden')
        render();
    }
}

function handleDeleteBtnClick(tweetId){
    document.getElementById("delete-confirm").classList.toggle('hidden')
    document.getElementById("confirm-yes").dataset.deleteItem = tweetId
}

function handleDeleteConfirmClick(tweetId){
    const tweetObject = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0]
    const tweetObjectIndex = tweetsData.indexOf(tweetObject);
    tweetsData.splice(tweetObjectIndex,1)
    document.getElementById("delete-confirm").classList.toggle('hidden')
    console.log(tweetsData)
    render();
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span>
                    <i class="fa-solid fa-reply"
                    data-respond="${tweet.uuid}"></i>
                </span>
                <span>
                    <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    localStorage.setItem('data', JSON.stringify(tweetsData))
    document.getElementById('feed').innerHTML = getFeedHtml()

}

render()


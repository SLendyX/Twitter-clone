import { tweetsData as datajs } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const responseInput = document.getElementById('modal-input')
const modalBox =  document.getElementById('modal-box')
const confirmYesBtn = document.getElementById('confirm-yes')
const tweetInput = document.getElementById('tweet-input')
let tweetsData = datajs 

if(localStorage.getItem('data')){
    tweetsData = JSON.parse(localStorage.getItem('data'))
}else{
    localStorage.setItem('data', JSON.stringify(tweetsData))
}

tweetInput.addEventListener("keypress", function(e){
    if(e.key === "Enter")
        handleTweetBtnClick()
})

responseInput.addEventListener("keypress", function(e){
    if(e.key === "Enter")
        handleModalSendBtnClick(responseInput.dataset.response)
})

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
    getReplyState()
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
            isOP: true,
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
    
    localStorage.setItem(tweetId, 'undefined');

    if(responseInput.value){
        tweetObject.replies.unshift({
            handle: `@Scrimba ✅`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: responseInput.value,
            uuid: uuidv4()
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
    let tweetObject = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0]
    if(tweetObject){
        const tweetObjectIndex = tweetsData.indexOf(tweetObject);
        tweetsData.splice(tweetObjectIndex,1)
        document.getElementById("delete-confirm").classList.toggle('hidden')
    }else{
        let replyObject
        
        for(let tweet of tweetsData){
            const reply = tweet.replies.filter(function(reply){
                return reply.uuid === tweetId
            })
            if(reply.length > 0){
                replyObject = reply[0], tweetObject = tweet;
                break;
            }
        }
        const replyObjectIndex = tweetObject.replies.indexOf(replyObject)
        tweetObject.replies.splice(replyObjectIndex, 1)
        document.getElementById("delete-confirm").classList.toggle('hidden')
    }
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

        let deleteIconClass = ''
        
        if(!tweet.isOP)
            deleteIconClass = "hidden"

        let replyState = 'hidden'

        if(localStorage.getItem(tweet.uuid) === 'undefined')
            replyState = ''
        
        console.log(replyState)
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            let deleteIcon;
            tweet.replies.forEach(function(reply){
                if(reply.uuid)
                    deleteIcon = ` <span>
                    <i class="fa-solid fa-trash" data-delete="${reply.uuid}"></i>
                <span>`
                else
                    deleteIcon = ""
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        ${deleteIcon}
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
                    <i class="${deleteIconClass} fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
                <span>
            </div>   
        </div>            
    </div>
    <div class="${replyState}" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function getReplyState(){
    tweetsData.forEach(function(tweet){
        if(tweet.replies.length > 0)
        localStorage.setItem(tweet.uuid, JSON.stringify(document.getElementById(`replies-${tweet.uuid}`).classList[0]))
    })
}

function render(){
    localStorage.setItem('data', JSON.stringify(tweetsData))
    document.getElementById('feed').innerHTML = getFeedHtml()
    getReplyState()
}

render()


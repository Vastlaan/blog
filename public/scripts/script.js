//close popupCookies
const closeCookies = () =>{
  const popupCookies = document.querySelector('.popupCookies')
  return popupCookies.style.display = 'none'
}

//self calling check localStorage for Cookies popup token / if existing close cookies
(function checkLocalStorage(){
  if(localStorage.getItem('michalantczakblogCcookiePolicy')){
    const cookiePolicy = JSON.parse(localStorage.getItem('michalantczakblogCcookiePolicy'))

    if(cookiePolicy.agreed){
      return closeCookies()
    }
  }
})()

//Scroll to View #articles
const scrollToArticles = () =>{
    const articles = document.querySelector('.articles')
    return articles.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
}

// Accept Cookies, set item in localStorage
const hidePopupCookies = () =>{
  const cookieMessage  = {agreed: true}
    localStorage.setItem('michalantczakblogCcookiePolicy', JSON.stringify(cookieMessage))
    return closeCookies()
}

// Returns promise to resolve with value of array of articles from database
const getArticles = async () =>{

  try{
     //fetch endpoint - need to add route from production
    const res= await fetch('http://localhost:5555/api/getArticles')
    const data = await res.json()
    return data
  }catch(e){
    console.log(e)
    return []
  }
 
}

//get articles likes from database.
const getArticlesVotes = async () =>{

  try{
    const arrayOfArticles = await getArticles()
    arrayOfArticles.map(art=>{
      const id = art.article_id;
      
      const votes = art.votes;
      const votesElement = document.querySelector(`#likes-${id}`)
      return votesElement.innerHTML=votes
    })
  }catch(e){
    console.log(e)
    return null
  }
  
}
//call it on first load
getArticlesVotes()

//add like
const addNewLike = (id) =>{

  fetch('http://localhost:5555/api/uploadVote', {
    method:'POST',
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({id})
  })
    .then(res=>res.json())
    .then(data=>{
      if(data=='Updated'){
        return getArticlesVotes()
      }
    })
}

const scrollToArticle = (id) =>{
  const article = document.querySelector(`#${id}`)
  return article.scrollIntoView({behavior:'smooth'})
}

//search article by tags and title
const searchArticle = async (e) =>{
  e.preventDefault()
  //assign searched value
  const value = document.querySelector('#searchInput').value.toLowerCase()
  //get all articles
  const arrayOfArticles = await getArticles()
  //filter articles if their title or tags match searched values, assign to new array
  const filteredArticles = arrayOfArticles.filter(art=>art.title.toLowerCase().includes(value) || art.tags.includes(value))
  //get div where list of articles will be append
  const searchResultsField = document.querySelector('.search__found')
  //create html template
  let inner = ''

  filteredArticles.map((art,i)=>{
    if(i===0){
      inner=inner+`<ul><li onclick='scrollToArticle("${art.article_id}")'>${art.title}</li>`
    }else if(i>=filteredArticles.length){
      inner=inner+`<li onclick='scrollToArticle("${art.article_id}")'>${art.title}</li></ul>`
    }else{
      inner=inner+`<li onclick='scrollToArticle("${art.article_id}")'>${art.title}</li>`
    }
  })

  if(filteredArticles.length===0){
    inner='<ul><li>nothing found</li></ul>'
  }

  searchResultsField.innerHTML=inner

  return clearSearchInput()
}

const clearSearchInput = () =>{
  return document.querySelector('#searchInput').value=''
}

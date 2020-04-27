//appends article to content div. 
//Takes two arguments: url - is the path to .html file contaning article itself, parentId = #id of element to append to 
const appendArticle = (url, parentId, button) =>{

    const parent = document.querySelector(`#${parentId}`)
  
    if(button.innerHTML==='Read article'){
      
      //fetch article url, get response and inject it to content div
      fetch(url)
          .then(response=>{
            return response.text()
          })
          .then(data=>{
  
            //append html
            parent.innerHTML=data
            //add animation for sliding effect
            parent.style.animation='slideDown .3s ease-out'
            parent.scrollIntoView({behavior:'smooth',block:'start', line:'start'})
            button.innerHTML='Close'
            return 
        })
          .catch(e=>console.log(e))
    }else{
      //bring button title to initial state
      button.innerHTML='Read article'
      //clean article
      parent.innerHTML=''
      //add animation for sliding effect
      parent.style.animation=''
    }
      
  }
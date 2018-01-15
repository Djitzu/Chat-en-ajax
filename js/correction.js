function getMessages(){
  // 1. Elle doit créer une requête AJAX pour se connecter au serveur, et notamment au fichier handler.php
  const requeteAjax = new XMLHttpRequest();
  requeteAjax.open("GET", "handler.php");

  // 2. Quand elle reçoit les données, il faut qu'elle les traite (en exploitant le JSON) et il faut qu'elle affiche ces données au format HTML
  requeteAjax.onload = function(){
    const resultat = JSON.parse(requeteAjax.responseText);
    //console.log(resultat);
    const html = resultat.reverse().map(function(message){
      return `
        <div class="message">
          <span class="date">${message.created_at.substring(11, 16)}</span>
          <span class="author">${message.author}</span> : 
          <span class="content">${message.content}</span>
        </div>
      `
    }).join('');

    const messages = document.querySelector('.messages');

    messages.innerHTML = html;
    messages.scrollTop = messages.scrollHeight;
  }

  // 3. On envoie la requête
  requeteAjax.send();
 
}

function postMessage(event){
    //stopper le formulaire
    event.preventDefault();
    
    //Récupérer les données du formulaire
    const author = document.querySelector('#author');
    const content = document.querySelector('#content');
    
    //Conditionner les données
    const data = new FormData();
    data.append('author', author.value);
    data.append('content', content.value);
    
    //configurer une requete ajax en post
    const requeteAjax = new XMLHttpRequest();
    requeteAjax.open('POST', 'handler.php?task=write');
    
    requeteAjax.onload = function()
    {
        content.value = '';
        content.focus;
        getMessages();
    }
    
    requeteAjax.send(data);
}

document.querySelector('form').addEventListener('submit', postMessage);

window.setInterval(getMessages, 3000);

getMessages();
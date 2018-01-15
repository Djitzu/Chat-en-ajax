//On fait de l'ajx !!!

//Il nous faut une fonction pour afficher les messages et une autre pour écrire.

//Récupération des messages
function getMessages()
{
  //Instanciation de l'objet jx
  const requeteAjax = new XMLHttpRequest();
  //Début de la requête : si true ou non spécifié alors = synchrone
  requeteAjax.open("GET", "handler.php");
  
  //Pendant le chargement...
  requeteAjax.onload = function()
  {
    //...On formate la réponse en JSON...
    const resultat = JSON.parse(requeteAjax.responseText);
    //... On prepare du htlm...
    const html = resultat.reverse().map(function(message){
      return `
        <div class="message">
          <span class="date">${message.created_at.substring(11, 16)}</span>
          <span class="author">${message.author}</span> : 
          <span class="content">${message.content}</span>
        </div>
      `
      //la jointure vide permet de ne pas avoir de sparateur entre chaque élément
    }).join('');
    
    //on va chercher le DOM correspondant
    const messages = document.querySelector('.messages');
    
    //Définition du contenu de la div messages
    messages.innerHTML = html;
    
    //Pour afficher les dernier message (ceux du bas)
    messages.scrollTop = messages.scrollHeight;
    
  };
  
  //Envoie de la requete pour finir
  requeteAjax.send();
}


function postMessage(event)
{
    //stopper le formulaire
    event.preventDefault();

  //Récupérer les données du formuaire
  const author = document.querySelector('#author');
  const content = document.querySelector('#content');
  
  //Envoyer les données grâce à l'obet formData
  const data = new FormData();
  data.append('author', author.value);
  data.append('content', content.value);
  
  //La requête
  const requeteAjax = new XMLHttpRequest();
  requeteAjax.open('POST', 'handler.php?task=write');
  
  requeteAjax.onload = function()
  {
    //Effacement du contenu de content
    content.value = '';
    //garder le focus dans la zone de saisie du texte
    content.focus;
    //Raffraicchissement des messages
    getMessages();
  };
  
  requeteAjax.send(data);
}

//Ecoute de l'evenement submmit au formulaire
document.querySelector('form').addEventListener('submit', postMessage);

//Rafraichir toutes les 3 secondes les messages
window.setInterval(getMessages, 3000);

//Aller chercher les messages au démarrage de la page.
getMessages();
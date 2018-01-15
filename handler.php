<?php

//Connexion à la base de données via PDO
     
$db = new PDO('mysql:host=localhost;dbname=chat;charset=utf8', 'jeromepisi', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, 
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);


// Création d'un drapeu pour indiquer à php que faire, par defaut, il vaut 'list' pour lister les messages
$task ='list';

//s'il y a une clé task dans le get (adresse du traitement du form soit cette page) ...
if(array_key_exists('task', $_GET))
{
    //... alors task vaudra la valeur attaché à cette clef (soit write)
    // <form action="handler.php?task=write" method="POST">
   $task = $_GET['task'];
}

//Si task vaut write alors ...
if($task == "write")
{
    //... ecris un nouveau messsage dans la base de données...
    postMessage();    
    //... sinon, récupère juste la liste des messages
} else {
    getMessages();
}


//Récupération des messages
function getMessages()
{
    //Rappeler où est la variable pour des hsitoire de portée en php
    global $db;
    //requete à la bdd pour les 20 derniers messages
    $resultats = $db->query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 20");
    //traitement des resultats
    $messages = $resultats->fetchAll();
    // encodage en JSON pour le futur traitement en php
    echo json_encode($messages);
}


//Ecriture d'un nouveu message
function postMessage()
{
    global $db;
    
    //S'il n'y a pas de valeurs attribuées aux clefs author ou content...
    if(!array_key_exists('author', $_POST) || !array_key_exists('content', $_POST)){
        //...on en voit un message d'erreur...
        echo json_encode([
            "status" => "error",
            "messages" => "One field or more have not been sent"
            ]);
        // ... et on arrête la fonction
        return;
    }
    
    
    // Récupération les parametres passés en post (content, author)
    $author = $_POST['author'];
    $content = $_POST['content'];

    
    //insertion des données dans la BD
    $query = $db->prepare("INSERT INTO messages SET author = :author, content = :content, created_at = NOW()");
    
    $query -> execute([
        "author" => $author,
        "content" => $content
    ]);
    
    //donner un status  de succes ou d'erreur en Json
    echo json_encode(["status" => "succes"]);
}


?>
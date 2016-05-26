
(function (){

  "use strict";
  var canvas = document.getElementById('game'),
  context = canvas.getContext('2d');

  //Constante du jeux qui ne changeront jamais
  var nb_ligne=7,
  nb_brick_ligne=10,
  brick_width=45,
  brick_height=15,
  space_brick=5,
  barre_width=80,
  barre_height=10,
  barreX,
  barreY,
  deplacement=20,
  airzone_width=canvas.width,
  airzone_height=canvas.height,
  couleur= ["#e74c3c", "#c0392b", "#d35400", "#e67e22", "#1abc9c"],
  balle_width=6,
  balle_vitesse=2,
  balleX=100,
  balleY=250,
  dirBalleX=1,
  dirBalleY=-1,
  aGagne=0,
  bricks=(space_brick+brick_height)*nb_ligne,
  tab_brick=new Array(nb_ligne);

  //On place la barre au centre du jeu
  barreX = (airzone_width/2)-(barre_width/2);
  //en bas
  barreY = (airzone_height-barre_height);
  context.fillStyle="white";
  context.fillRect(barreX,barreY,barre_width,barre_height);

  //On appele la fonction pour generer les briques
  creation(context,nb_ligne,nb_brick_ligne,brick_width,brick_height,space_brick);

  var interval = setInterval(Game,10);
  window.document.onkeydown = checkDepla;


  function Game(){
    context.clearRect(0,0,airzone_width,airzone_height);
    aGagne = 1;
    context.fillStyle="#34495e";
    context.fillRect(0,0,airzone_width,airzone_height);
    context.fill();
		// Réaffichage des briques
    for (var i=0; i<tab_brick.length;i++){
      context.fillStyle=couleur[i];
      for(var j=0; j<tab_brick[i].length;j++){
        if(tab_brick[i][j]==1){
          context.fillRect((j*(brick_width+space_brick)),(i*(brick_height+space_brick)),brick_width,brick_height);
          aGagne=0;
        }
      }
    }

    context.fillStyle="white";
    context.fillRect(barreX,barreY,barre_width,barre_height);


    // on fait bouger la balle en lui ajoutant sa vitesse comme Flappy
    //On verifie que la balle ne depasse pas de la largeur du canvas
    if( (balleX+dirBalleX*balle_vitesse) > airzone_width){
      dirBalleX=-1;
    }
    else if( (balleX+dirBalleX*balle_vitesse) < 0 ){
      dirBalleX=1;
    }
    //On verifie que la balle ne depasse pas de la hauteur du canvas
    if( (balleY+dirBalleY*balle_vitesse)>airzone_height ){
      perdu();
    }
    else {
			if ( (balleY + dirBalleY * balle_vitesse) <  0){
        dirBalleY = 1;
      }
			else {
				if ( ((balleY + dirBalleY * balle_vitesse) > (airzone_height - barre_height)) && ((balleX + dirBalleX * balle_vitesse) >= barreX) && ((balleX + dirBalleX * balle_vitesse) <= (barreX+barre_width))) {
					dirBalleY = -1;
					dirBalleX=2*(balleX-(barreX+barre_width/2))/barre_width;
				}
			}
		}
    balleX+=dirBalleX*balle_vitesse;
    balleY+=dirBalleY*balle_vitesse;
    // Colision avec les briques
    if (balleY<=bricks){
    var ligneY=Math.floor(balleY/(brick_height+space_brick));
    var ligneX=Math.floor(balleX/(brick_width+space_brick));
    if((tab_brick[ligneY][ligneX])==1){
      // console.log(tab_brick[ligneY][ligneX]);
    tab_brick[ligneY][ligneX]=0;
    // console.log(tab_brick[ligneY][ligneX]);
    dirBalleY=1;
    }
    }
    //Creation de la balle
    context.fillStyle="white";
    context.beginPath();
    context.arc(balleX,balleY,balle_width,0,Math.PI*2,true);
    context.closePath();
    context.fill();
  }

  // Fonction de gameOver
  function perdu(){
    clearInterval(Game);
    context.font="30px Helvetica Neue";
    context.fillText("Game Over",180,300);
  }

  function gagne(){
    clearInterval(Game);
    alert("Win");
  }

  // Fonction qui va créer des bricks
  function creation(ctx, nb_ligne, nb_brick_ligne, width, height, space) {

    aGagne=1;
    for (var i=0; i < nb_ligne; i++) {
      //On commence ici a initialiser
      tab_brick[i] = new Array(nb_brick_ligne);

      ctx.fillStyle=couleur[i];
      for (var j=0; j < nb_brick_ligne; j++) {
        //On affiche une nouvelle brique
        ctx.fillRect((j*(width+space)),(i*(height+space)),width,height);
        //On dit qu'une brique existe si elle a comme valeur dans le tableau 1 donc 0 elle existe pas
        tab_brick[i][j] = 1;
      }//endfor j
    }//endfor i

  }

  function checkDepla(e) {
    // Flêche de droite préssée
    if (e.keyCode == 39) {
      // si la taille de la barre + le deplacement + la position est inferieur ou egale a la zone on ajoute a la position de la barre le deplacement
      if ( (barreX+deplacement+barre_width) <= airzone_width){
        barreX += deplacement+10;
      }
    }
    // Flêche de gauche préssée
    else if (e.keyCode == 37) {
      if ( ((barreX-deplacement)) >= 0 ){
        barreX -= deplacement+10;
      }
    }
  }

})();
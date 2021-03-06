
( function() {

    "use strict";
    var canvas = document.getElementById( "game" ),
        context = canvas.getContext( "2d" ),
        nbLigne = 6, nbBrickLigne = 9, brickwidth = 45, brickheight = 15, spacebrick = 5, barrewidth = 80, barreheight = 10, barreX, barreY, deplacement = 30,
        airzonewidth = canvas.width, airzoneheight = canvas.height,
        couleur = [ "#e74c3c", "#c0392b", "#d35400", "#e67e22", "#1abc9c" ],
        ballewidth = 6, ballevitesse = 2, balleX = 100, balleY = 250, dirBalleX = 1,
        dirBalleY = -1, aGagne = 0,
        bricks = ( spacebrick + brickheight ) * nbLigne,
        tabbrick = new Array( nbLigne ),
        point = 0, PartieEnCours = true,
        start, creation, recreation, Game, draw, gagne, mainLogic, perdu, balle, colision, checkDepla, i, j, LigneY, LigneX, MyTimer;


    // Fonction qui va créer des bricks
    creation = function( ctx, width, height, space ) {
        aGagne = 1;
        for ( i = 0; i < nbLigne; i++ ) {
        // On commence ici a initialiser
            tabbrick[ i ] = new Array( nbBrickLigne );
            // On remplit avec le tableau de couleur
            ctx.fillStyle = couleur[ i ];
            for ( j = 0; j < nbBrickLigne; j++ ) {
              // On affiche une nouvelle brique
                ctx.fillRect( ( j * ( width + space ) ), ( i * ( height + space ) ), width, height );
                // On dit qu'une brique existe si elle a comme valeur dans le tableau 1,donc, 0 elle existe pas
                tabbrick[ i ] [ j ] = 1;
            }// endfor j
        }// endfor i

    };


    draw = function() {
        context.fillStyle = "#34495e";
        context.fillRect( 0, 0, airzonewidth, airzoneheight );
        context.fill();
        context.fillStyle = "#1abc9c";
        context.font = "30px GameFont";
        context.textAlign = "center";
        context.fillText( "BRICK COLISION", airzonewidth / 2, 80 );
        context.fillText( "Appuyez sur ESPACE ", airzonewidth / 2, airzoneheight / 3 );
        context.fillText( "pour commencer ", airzonewidth / 2, airzoneheight / 2 );
        context.fillText( "----------", airzonewidth / 2, 300 );
        context.fillText( "----------", airzonewidth / 2, 350 );

    };


    recreation = function() {
        aGagne = 1;
      // Réaffichage des briques
        for ( i = 0 ; i < tabbrick.length ; i++ ) {
            context.fillStyle = couleur [ i ];
            for ( j = 0; j < tabbrick [ i ].length ; j++ ) {
                if ( tabbrick [ i ][ j ] === 1 ) {
                    context.fillRect( ( j * ( brickwidth + spacebrick ) ), ( i * ( brickheight + spacebrick ) ), brickwidth, brickheight );
                    aGagne = 0; // Si aGagne = O c'est qu'il reste toujours une brique
                }
            }
        }
        if ( aGagne ) {
            gagne();
        }
    };

    gagne = function() {
        PartieEnCours = true;
        window.clearInterval( MyTimer );
        context.textAlign = "center";
        context.font = "30px GameFont";
        context.fillText( "Bravo ! Vous avez GAGNER !", airzonewidth / 2, airzoneheight / 2 );
        context.fillText( "Score " + point, airzonewidth / 2, airzoneheight / 2.5 );
        dirBalleX = 0;
        dirBalleY = 0;
        ballevitesse = 0;
    };

    // Fonction de gameOver
    perdu = function() {
        PartieEnCours = true;
        window.clearInterval( MyTimer );
        context.textAlign = "center";
        context.font = "30px GameFont";
        context.fillText( "Espace pour recommencer", airzonewidth / 2, airzoneheight / 1.5 );
        context.fillText( "Game Over", airzonewidth / 2, airzoneheight / 2 );
        context.fillText( "Score " + point, airzonewidth / 2, airzoneheight / 2.5 );
        dirBalleX = 0;
        dirBalleY = 0;
        ballevitesse = 0;
    };


    mainLogic = function() {

        if ( ( balleX + dirBalleX * ballevitesse ) > airzonewidth ) {
            dirBalleX = -1.2;
        } else if ( ( balleX + dirBalleX * ballevitesse ) < 0 ) {
            dirBalleX = 1.2;
        } else if ( ( balleY + dirBalleY * ballevitesse ) > airzoneheight ) {
          // On verifie que la balle ne touche pas le bas du canvas
            perdu();
        } else if ( ( balleY + dirBalleY * ballevitesse ) < 0 ) {
        // On fait bouger la balle
            dirBalleY = 1.2;
        } else if ( ( ( balleY + dirBalleY * ballevitesse ) > ( airzoneheight - barreheight ) ) && ( ( balleX + dirBalleX * ballevitesse ) >= barreX ) && ( ( balleX + dirBalleX * ballevitesse ) <= ( barreX + barrewidth ) ) ) {
            dirBalleY = -1.2;
            dirBalleX = 2 * ( balleX - ( barreX + barrewidth / 2 ) ) / barrewidth;
        }
        balleX += dirBalleX * ballevitesse;
        balleY += dirBalleY * ballevitesse;
    };

    balle = function() {
      // Creation de la balle
        context.fillStyle = "white";
        context.beginPath();
        context.arc( balleX, balleY, ballewidth, 0, Math.PI * 2, true );
        context.closePath();
        context.fill();
    };


    colision = function() {
      // Colision avec les briques
        if ( balleY <= bricks ) {
            LigneY = Math.floor( balleY / ( brickheight + spacebrick ) );
            LigneX = Math.floor( balleX / ( brickwidth + spacebrick ) );
            if ( ( tabbrick [ LigneY ] [ LigneX ] ) === 1 ) {
              // console.log(tabbrick[LigneY][LigneX]);
                tabbrick[ LigneY ][ LigneX ] = 0;
                // console.log(tabbrick[LigneY][LigneX]);
                dirBalleY = 1.5;
                point = point + 1;
            }
        }
    };

    Game = function() {
        PartieEnCours = false;
        draw();
        // On efface l'écran de demarrage
        context.clearRect( 0, 0, airzonewidth, airzoneheight );
        context.fillStyle = "#34495e";
        context.fillRect( 0, 0, airzonewidth, airzoneheight );
        context.fill();
        context.fillStyle = "white";
        context.font = "16px Calibri,Geneva,Arial";
        context.fillText( "Score " + point, 50, 350 );
        recreation();
        context.fillStyle = "white";
        context.fillRect( barreX, barreY, barrewidth, barreheight );
        mainLogic();
        colision();
        balle();
        // console.log(PartieEnCours);
    };

    start = function() {
        PartieEnCours = false;

        // On place la barre au centre du jeu
        barreX = ( airzonewidth / 2 ) - ( barrewidth / 2 );
        // en bas
        barreY = ( airzoneheight - barreheight );
        context.fillStyle = "white";
        context.fillRect( barreX, barreY, barrewidth, barreheight );

    // On appele la fonction pour generer les briques
        creation( context, nbLigne, nbBrickLigne, brickwidth, brickheight, spacebrick );

        MyTimer = setInterval( Game, 10 );

        return MyTimer;

    };

    draw();

    checkDepla = function( e ) {
        // Flêche de droite préssée
        if ( e.keyCode === 39 ) {
          // si la taille de la barre + le deplacement + la position est inferieur ou egale a la zone on ajoute a la position de la barre le deplacement
            if ( ( barreX + deplacement + barrewidth ) <= airzonewidth ) {
                barreX += deplacement + 10;
            }
        } else if ( e.keyCode === 37 ) {
              // Flêche de gauche préssée
            if ( ( ( barreX - deplacement ) ) >= 0 ) {
                barreX -= deplacement + 10;
            }
        }
    };


    window.document.onkeydown = checkDepla;
    if ( PartieEnCours === true ) {
        window.addEventListener( "keyup", function( e ) {
            if ( e.which === 32 ) {
                window.clearInterval( MyTimer );
                start();
                balleX = 100;
                balleY = 250;
                dirBalleX = 1.2;
                dirBalleY = -1.2;
                ballevitesse = 2;
                point = 0;
            }
        }, false );
    }


} )();

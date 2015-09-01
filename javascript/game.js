
/*----------------------------------------------------------------------------*/
/*                                                                            */
/* Program: game.js                                                           */
/*                                                                            */
/* Description:  File used to allow the user to actually play the texas       */
/*               holdem game. This file is used to represent the state of a   */
/*               game at any time. Depending on the state of the game, the    */
/*               user will be able to take multiple actions. Once either users*/
/*               pot hits $0, the winner is determined and the game concludes.*/
/*                                                                            */
/* @author  Bradley Cronce                                                    */
/*          Sam Radford                                                       */
/*                                                                            */
/* @version  11-29-2014                                                       */
/*                                                                            */
/*----------------------------------------------------------------------------*/

// make sure window is fully loaded before doing anything...
window.onload = init;

// global variables...
var deck;
var state;
var playedCards;
var state;
var aiPot;
var playerPot;
var pot;
var start;
var turn;
var dealer;
var action;
var lastChoice;
var bidAmount;
var raiseAmount; 
var showing;
var allIn;
var move;

/**
 * Description: Function to initialize and start running the Texas Hold'em
 *              game. The function fist sets up the refresh button handler
 *              and then goes throwugh all the steps necessary for playing
 *              Texas Hold'em. 
 *
 */
function init() {
    
    $("#refresh").on("click", confirmRefresh);
    start = 1;
    turn = 1;
    dealer = 0;
    lastChoice = 0;
    action = 0;
    move = 0;
    bidAmount = 5;
    raiseAmount = 10;
    showing = 0;
    retrieveName();
    setUpDeck();
    setUpPlayed();
    setUpState();
    initState();
    startHand();
}

/**
 * Description:  Function to initialize the beginnging of each hand.
 *               This function encapsulates calls to other functions.
 *               The calls to the other functions have to happen in a 
 *               certain order for the game to work.
 *
 */
function startHand() {
    reset();
    initState();
    middleBlanks();
    initPlayed();
    initHand();
    start = 0;
    blinds();
    showing = 0;
    turn = !dealer;
    nextAction();
}

/**
 * Description:  Function to reset everything in the game to what the values
 *               should be at the beginning if a hand.
 *
 */
function reset() {

    showing = 0;
    lastChoice = 0;
    action = 0;
    allIn = 0;
    move = 0;
    bidAmount = 5;
    raiseAmount = 10;
    var bidBu = document.getElementById("bid");
    var raiseBu = document.getElementById("raise");
    bidBu.innerHTML = "Bid $5";
    raiseBu.innerHTML = "Raise $10";

}

/**
 * Description:  Function to handle a blind bid and blind raise at the
 *               beginning of each hand.
 *
 */
function blinds() {

    var str, newValue;
    var aiAmount, playerAmount;

    if(dealer) {

        aiAmount = 5;
        playerAmount = 2;

    } else {

        aiAmount = 2;
        playerAmount = 5;

    }

    str = playerPot.innerHTML;
    str = str.split(" ");
    newValue = str[1];
    playerPot.innerHTML = "$ " + (newValue - playerAmount);  
    str = aiPot.innerHTML;
    str = str.split(" ");
    newValue = str[1];
    aiPot.innerHTML = "$ " + (newValue - aiAmount);
       
    str = pot.innerHTML;
    str = str.split(" ");
    newValue = str[1];
    pot.innerHTML = "$ " + (parseInt(newValue) + playerAmount + aiAmount); 
}

/**
 * Description:  Function to determine whos turn it is. This function
 *               also displayes which players turn it is on the screen, 
 *               so the user will know what to do. We set a timeout on the 
 *               call to the ai's turn so it resembes the ai thinking. 
 *
 */
function nextAction() {
    
    if(turn) {

        if(lastChoice == 0){
            if(move == 1)
                $("#whoTurn").html("AI Checked! <br> It's Your Turn");
            else                    
                $("#whoTurn").html("It's Your Turn!");
        }
        if(move == 2) 
           $("#whoTurn").html("AI Bid! <br> It's Your Turn!");

        if(move == 3)
           $("#whoTurn").html("AI Raised! <br> It's Your Turn!");
        
        if(lastChoice == 1)
            $("#whoTurn").html("AI Checked! <br> It's Your Turn");

        if(lastChoice == 2)
            $("#whoTurn").html("AI Bid! <br> It's Your Turn!");

        if(lastChoice == 3)
            $("#whoTurn").html("AI Raised! <br> It's Your Turn!");
        
        playerTurn();

    } else {
        
        $("#whoTurn").html("AI Is Thinking!");
        setTimeout(aiTurn,2500);

    }
}

/**
 * Description:  Function to handle the ai's turn. The First thing that 
 *               happens in this function is that all of the button
 *               handlers are turned off so the player can not keep pressing 
 *               buttons. This is a simple ai, a random number between 0 and 99
 *               is generated and based off of that number, the ai makes a move.
 *
 */
function aiTurn() {
    
    $("#check").off("click");
    $("#bid").off("click");
    $("#raise").off("click");
    $("#fold").off("click");

    var rand = Math.floor(Math.random() * 100);

    if(action < 5 && (lastChoice == 2 || lastChoice == 3)) {

        // no check
        if (rand < 55) {

            aiBid();

        } else if (rand < 96) {

            aiRaise();

        } else {

            aiFold();

        }

    } else if((action == 5 && dealer == 0) && 
              (lastChoice == 2 || lastChoice == 3)) {
   
         // no raise
         // no check
         if (rand < 94) {

             aiBid();

         } else {

              aiFold();

         }

    } else {
        if (rand < 45) {

            aiBid();

        } else if (rand < 55) {

            aiRaise();

        } else if (rand < 95) {

            aiCheck();

        } else {

            aiFold();

        }
    }
}

/**
 * Description:  Function to let the player take a turn. Each of the
 *               button handlers are turned back on which allows the user
 *               to make his or her choice.
 *
 */
function playerTurn() {

    $("#check").on("click", checkHandler);
    $("#bid").on("click", bidHandler);
    $("#raise").on("click", raiseHandler);   
    $("#fold").on("click", foldHandler);

    if(lastChoice == 2 || lastChoice == 3) {

        $("#check").off("click");

    }
    
    if(action == 5 && dealer == 1) {

        $("#raise").off("click");

    }
}

/**
 * Description:  Function to handle the case where the ai decides 
 *               to check.
 *
 */
function aiCheck() {

    action++;
    move = 1; 
    if(allIn == 1)
        handleAllIn();
    else{
        if(lastChoice == 1){
            checkShowing();
        }
        else{
            lastChoice = 1;
            checkAction();
        }
    }
}

/**
 * Description:  Function to handle the case where the player decides
 *               to check. This is a button handler for the check 
 *               button.
 *
 */
function checkHandler() {

    // disable all buttons...
    $("#check").off("click");
    $("#bid").off("click");
    $("#raise").off("click");
    $("#fold").off("click");

    action++;
    if(allIn == 1)
        handleAllIn();
    else{
        if(lastChoice == 1){
            checkShowing();
        }
        else{
            lastChoice = 1;
            checkAction();
        }
    }
}

/**
 * Description:  Function to handle the case where the ai decides
 *               to bid.
 *
 */
function aiBid() {

    action++;
    lastChoice = 2;
    move = 2;

    // increment or decrement player and AI pots...
    var str, newValue;
    str = aiPot.innerHTML;
    str = str.split(" ");
    newValue = str[1];

    if(newValue - bidAmount < 0) {

       aiPot.innerHTML = "$ 0";

    } else {

       aiPot.innerHTML = "$ " + (newValue - bidAmount);

    }

    str = pot.innerHTML;
    str = str.split(" ");
    newValue = str[1];
    pot.innerHTML = "$ " + (parseInt(newValue) + bidAmount);

    if(allIn == 1)
        handleAllIn();
    else {
            
        str = aiPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
        
        if(newValue == 0)
            allIn = 1;
        checkAction();
    }
}

/**
 * Description:  Function to handle the case where the player decides 
 *               to bid. This is the button handler for the bid button.
 *
 */
function bidHandler() {

    // disable all buttons...
    $("#check").off("click");
    $("#bid").off("click");
    $("#raise").off("click");
    $("#fold").off("click");

    action++;
    // console.log("Action: " + action);
    lastChoice = 2;
    
    // increment or decrement player and AI pots...
    var str, newValue;
    str = playerPot.innerHTML;
    str = str.split(" ");
    newValue = str[1];

    if(newValue - bidAmount < 0) {

       playerPot.innerHTML = "$ 0";

    } else {

       playerPot.innerHTML = "$ " + (parseInt(newValue) - bidAmount);    
    }    

    str = pot.innerHTML;
    str = str.split(" ");
    newValue = str[1];
    pot.innerHTML = "";
    pot.innerHTML = "$ " + (parseInt(newValue) + bidAmount);
     
    if(allIn == 1)
        handleAllIn();
    else {

        str = playerPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
        
        if(newValue == 0)
            allIn = 1;

        checkAction();
    }
}

/**
 * Description:  Function to handle the case where the ai decides to
 *               raise. 
 *
 */
function aiRaise() {

    action++;
    lastChoice = 3;
    move = 3;

     // increment or decrement player and AI pots...
    var str, newValue;
    str = aiPot.innerHTML;
    str = str.split(" ");
    newValue = str[1];

    if(newValue - bidAmount < 0) {

       aiPot.innerHTML = "$ 0";

    } else {

       aiPot.innerHTML = "$ " + (parseInt(newValue) - raiseAmount);

    }

    str = pot.innerHTML;
    str = str.split(" ");
    newValue = str[1];
    pot.innerHTML = "$ " + (parseInt(newValue) + raiseAmount);

    bidAmount = raiseAmount+5;
    raiseAmount = bidAmount+5;
    var bidBu = document.getElementById("bid");
    var raiseBu = document.getElementById("raise");
    bidBu.innerHTML = "Bid   $" + bidAmount;
    raiseBu.innerHTML = "Raise   $" + raiseAmount;
    
    if(allIn == 1)
        handleAllIn();
    else {
        str = aiPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
       
        if(newValue == 0)
            allIn = 1;

        checkAction();
    }
}

/**
 * Description:  Function to handle the case where the user decides to 
 *               raise. This is the button handler for the raise button.
 *
 */
function raiseHandler() {

    // disable all buttons...
    $("#check").off("click");
    $("#bid").off("click");
    $("#raise").off("click");
    $("#fold").off("click");

    action++;
    lastChoice = 3;

     // increment or decrement player and AI pots...
    var str, newValue;
    str = playerPot.innerHTML;
    str = str.split(" ");
    newValue = str[1];

    if(newValue - bidAmount <= 0) {

       playerPot.innerHTML = "$ 0";

    } else {

       playerPot.innerHTML = "$ " + (parseInt(newValue) - raiseAmount);

    }
    str = pot.innerHTML;
    str = str.split(" ");
    newValue = str[1];
    pot.innerHTML = "$ " + (parseInt(newValue) + raiseAmount);

    bidAmount = raiseAmount+5;
    raiseAmount = bidAmount+5;
    var bidBu = document.getElementById("bid");
    var raiseBu = document.getElementById("raise");
    bidBu.innerHTML = "Bid   $" + bidAmount;
    raiseBu.innerHTML = "Raise   $" + raiseAmount;
   
    if(allIn == 1)
        handleAllIn();
    else {
            
        str = playerPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
        
        if(newValue == 0)
            allIn = 1;

        checkAction();
    }
}

/**
 * Description:  Function to handle the case where the ai decides
 *               to fold.
 *
 */
function aiFold() {

    action = 0;
    lastChoice = 0;
    dealer = !dealer;
    foldWinner();

}

/**
 * Description:  Function to handle the case where the player decides
 *               to fold. This is the button handler for the fold
 *               button.
 *
 */
function foldHandler() {

    // disable all buttons...
    $("#check").off("click");
    $("#bid").off("click");
    $("#raise").off("click");
    $("#fold").off("click");

    action = 0;
    lastChoice = 0;
    dealer = !dealer;
    foldWinner();

}

/**
 * Description:  Function to determine which player should recieve the 
 *               money from the pot once a fold occurs. If player1 folds
 *               then the ai gets the money, and it the ai folds then the
 *               player1 gets the pot.
 *
 */
function foldWinner() {

    var str,newValue,p,pVal;
    var pMoney, aiMoney;
    p = pot.innerHTML;
    p = p.split(" ");
    pVal = p[1];

    if (!turn) {

        str = playerPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
        playerPot.innterHTML = "";
        playerPot.innerHTML = "$ " + (parseInt(newValue) + parseInt(pVal));
        
        $("#whoTurn").html("AI Folded!"); 

    } else {

        str = aiPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
        aiPot.innerHTML = "";
        aiPot.innerHTML = "$ " + (parseInt(newValue) + parseInt(pVal));

        $("#whoTurn").html("You Folded!");
    }

    pot.innerHTML = "$ 0";
    pMoney = playerPot.innerHTML.split(" ");
    aiMoney = aiPot.innerHTML.split(" ");
    
    if(parseInt(pMoney[1]) <= 0 || parseInt(aiMoney[1]) <= 0) {

        endGame();

    } else {
        turn = !dealer;
        setTimeout(startHand,5000);
    }
}

/**
 * Description:  Function to limit how many bids you per card that
 *               is placed oonto the table.
 *
 */
function checkAction() {

    if (action == 6) {

        checkShowing();

    } else {

        turn = !turn;
        nextAction();

    }
}

/**
 * Description:  Function to act as the game dealer. If there are 0 cards
 *               on the table then 3 cards are placed into the middle of
 *               the table. If there are already 3 or 4 cards on the table 
 *               then one more card is added to the table.
 *
 */
function checkShowing() {
    if (showing == 0) {

        showThree();
        turn = !dealer;
        action = 0;
        lastChoice = 0;
        nextAction();

    } else if (showing == 3 || showing == 4) {

        showing = showing + 1;
        addCard(showing + 1);
        turn = !dealer;
        action = 0;
        lastChoice = 0;
        nextAction();
    }
    else{
        handWinner();
    }
    
}

/**
 * Description:  Function to handle the case where one persons pot becomes 0
 *               in the middle of a hand. If this case is true then all 5 cards 
 *               placed onto the table. After this the winner of the hand is 
 *               determined.
 *
 */
function handleAllIn() {

    if (showing == 0) {

        showThree();
        showing = 3;

    }

    if (showing == 3) {

        addCard(showing+2);
        showing = 4;

    }

    if (showing == 4) {

        addCard(showing+2);
        showing = 5;

    }
    handWinner();
}

/**
 * Description:  Function to determine who won the hand. This function calls 
 *               compareHand() with determines who won the hand. Depending on what
 *               compareHand() returns the appropriate action is taken. In each 
 *               if statement the money is split up appropriatly and the winner is 
 *               identified by printing it to the screen.
 *
 */
function handWinner() {
    
    var pMoney, aiMoney, pVal, str, newValue, pstr;
    var win = 0;
    dealer = !dealer;
    // ------------- 
    /**
        state[0][0] = "1 13";
        state[0][1] = "2 13";
        state[1][0] = "0 11";
        state[1][1] = "1 6";
        state[2][0] = "1 11";
        state[2][1] = "0 10";
        state[2][2] = "2 10";
        state[2][3] = "3 4";
        state[2][4] = "3 7";
    */
    // -------------    

    // determines who won the hand...
    win = compareHand(state); // in other js file

    pstr = pot.innerHTML;
    pstr = pstr.split(" ");
    pVal = pstr[1];

    if (win == 1) {

        // case where the player won the hand...
        str = playerPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
        playerPot.innerHTML = "$ " + (parseInt(newValue) + parseInt(pVal));

        $("#whoTurn").html("You Won!");

    } else if (win == 0) {

        // case where the AI won the hand...
        str = aiPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
        aiPot.innerHTML = "$ " + (parseInt(newValue) + parseInt(pVal));
        
        $("#whoTurn").html("AI Won!");
    
    } else if (win == 2) {

        // case where the hands are tied...
        str = playerPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
        playerPot.innerHTML = "$ " + (parseInt(newValue) + (Math.floor(parseInt(pVal)/2)));
        
        str = aiPot.innerHTML;
        str = str.split(" ");
        newValue = str[1];
        aiPot.innerHTML = "$ " + (parseInt(newValue) + ((Math.floor(parseInt(pVal)/2))-1));
        
        $("#whoTurn").html("You Tied!");
    }

    pot.innerHTML = "$ 0";

    pMoney = playerPot.innerHTML.split(" ");
    aiMoney = aiPot.innerHTML.split(" ");

    // code to flip over the ai cards at the end of each hand...
    var card1 = state[1][0].split(" ");
    var card2 = state[1][1].split(" ");
    var suit1 = getSuit(card1[0]);
    var suit2 = getSuit(card2[0]);
    document.getElementById("10").setAttribute("src", "img/cards/" + suit1 + "/" + (parseInt(card1[1])+1) + ".png");
    document.getElementById("11").setAttribute("src", "img/cards/" + suit2 + "/" + (parseInt(card2[1])+1) + ".png");
    displayHands();

    if(parseInt(pMoney[1]) <= 0 || parseInt(aiMoney[1]) <= 0) {
         
         endGame();

    } else {
        // call start hand after a certian amount of time...
        setTimeout(startHand,5000);
    }
    
}

/**
 * Description:  Function to print to the screen who won the game. 
 *               The function checks to see if one of the playes has $0
 *               in their pot, if so, they lost.
 *
 */
function endGame(){

    var pMoney, aiMoney;
    pMoney = playerPot.innerHTML.split(" ");
    aiMoney = aiPot.innerHTML.split(" ");

    if(pMoney[1] == 0 ) {

        $("#whoTurn").html("Sorry, you lose!");

    } else {

        $("#whoTurn").html("Congratulations! You won!");

    }
}

/**
 * Description:  Function used to initiaize an array to hold the location of 
 *               each card used in our game. The array is a 4 X 13 2d array. 
 *               Each cell in the array holds a path to an image to a card.
 *
 */
function setUpDeck() {

    deck = new Array(4);
    for(var suit = 0; suit<4; suit++) {

        deck[suit] = new Array(13);   
    }

    for(var suit = 0; suit < 4; suit++) {

        for(var card = 0; card < 13; card++) {

            if(suit == 0) {
                 
                deck[suit][card] = "img/cards/diamonds/" + (card+1) + ".png";

            } else if(suit == 1) {

                deck[suit][card] = "img/cards/clubs/" + (card+1) + ".png";

            } else if(suit == 2) {

                deck[suit][card] = "img/cards/hearts/" + (card+1) + ".png";

            } else if(suit == 3) {

                deck[suit][card] = "img/cards/spades/" + (card+1) + ".png";

            }
        }
    }
}


/**
 * Description:  Function to retreive the id of the link the user clicked,
 *               on the Home page, from localStorage. This function is 
 *               needed so we can figure out what style, and the number 
 *               of columns the user chose. 
 *
 */
function retrieveName() {

    var name = localStorage.getItem("playerName");
    var pname = document.getElementById("pname");

    // console.log(name);
    pname.innerHTML = name;

}



/**
 * Description:  Function used to create an array to hold the state of the 
 *               game at any given time. The state consists of each players
 *               cards, along with the showing cards in the middle of the game.
 *               This is a 3 X 5 2d array.
 *
 */
function setUpState() {

    state = new Array(3);

    for(var attr = 0; attr<3; attr++) {

        state[attr] = new Array(5);

    }
    initState();
}

/**
 * Description:  Function used to initialize the state of the game. This function
 *               simply sets the entire state array to -1.
 *
 */
function initState() {

    for(var attr = 0; attr<3; attr++) {

        for(var val = 0; val <5; val++) {

            state[attr][val] = -1;

        }
    }
}

/**
 * Description:  Function used to create an array to hold the set of cards that
 *               have already been played. The array is 4 X 13 2d array.
 *
 */
function setUpPlayed() {

    playedCards = new Array(4);

    for(var suit = 0; suit<4; suit++) {

        playedCards[suit] = new Array(13);

    }
    initPlayed();
}

/**
 * Description:  Function to simply initilize the array that holds the cards
 *               that have already been played. This function just sets the 
 *               entire array to 0.
 *
 */
function initPlayed() {

    for(var suit = 0; suit<4; suit++) {

        for(var card = 0; card<13; card++) {

            playedCards[suit][card] = 0;

        }
    }
}

/**
 * Description:  Function to initialize each had to random cards. The function
 *               first sets all of the pot values. Second, all of the cards
 *               in each of the players hands are set to random cards. Third, 
 *               the array that holds the already played cards is set depending on
 *               the cards that are on the table.
 *
 */
function initHand(){

    if(start) {

        // set the initial pot values...
        aiPot = document.getElementById("aipot");
        playerPot = document.getElementById("ppot");
        pot = document.getElementById("gamePot");
       
        aipot.innerHTML = "$ 2500";
        playerPot.innerHTML ="$ 2500";
        
        
        start = 0;

    }

    pot.innerHTML = "$ 0";

    // randomly set all of the cards in the game...
    for (var i = 0; i < 4; i++) {

        var goodCard = 0;
        var x, y;

        // gets random numbers until we get a combination that hasnt been seen before...
        while (goodCard == 0) {

            x = Math.floor(Math.random() * 3);
            y = Math.floor(Math.random() * 12);

            if(playedCards[x][y] == 0)
                goodCard = 1;
    
        }
        
        // set the array of played cards to the random values...
        playedCards[x][y] = 1;
        
        // set player cards...
        if (i == 0 || i == 1) {

            state[0][i] = "" + x + " " + y;
            var card0 = document.getElementById("00");
            var card1 = document.getElementById("01");
            
            if (i == 0) {

                card0.setAttribute("src", deck[x][y]);

            } else {

                card1.setAttribute("src", deck[x][y]);

            }

        }
         
        // set ai cards 
        else if( i == 2 || i == 3) {
            
            state[1][i-2] = "" + x + " " + y;

            var card0 = document.getElementById("10");
            var card1 = document.getElementById("11");
            card0.setAttribute("src", "img/cards/back.png");
            card1.setAttribute("src", "img/cards/back.png");
        }
    }
}

/**
 * Description:  Function to add the first three cards to the middle of the game.
 *               The 3 cards that show at the beginning of the game after the user
 *               has made three actions.
 *
 */
function showThree() {

    for (var i = 0; i < 3; i++) {

        var goodCard = 0;
        var x, y;

        while (goodCard == 0) {

            x = Math.floor(Math.random() * 3);
            y = Math.floor(Math.random() * 12);

            if(playedCards[x][y] == 0)
                goodCard = 1;

        }
        playedCards[x][y] = 1;
        state[2][i] = "" + x + " " + y;

        var card1 = document.getElementById("20");
        var card2 = document.getElementById("21");
        var card3 = document.getElementById("22");

        if(i == 0) {

            card1.setAttribute("src", deck[x][y]);

        } else if (i == 1) {

            card2.setAttribute("src", deck[x][y]);

        } else {

            card3.setAttribute("src", deck[x][y]);

        }
    }
    showing = 3;
}

/**
 * Description:  Function to add the fourth or fifth card to the middle
 *               of the game, in the showing cards.
 *
 */
function addCard(showing) {

    var goodCard = 0;
    var x, y;
    var num = showing -2;

    while (goodCard == 0) {

        x = Math.floor(Math.random() * 3);
        y = Math.floor(Math.random() * 12);

        if(playedCards[x][y] == 0)
            goodCard = 1;

    }
    playedCards[x][y] = 1;
    state[2][num] = "" + x + " " + y;
    var id = "2" + num;
    var card1 = document.getElementById(id);
    card1.setAttribute("src", deck[x][y]);
}

/**
 * Description:  Function to reset the cards in the middle of the game
 *               back to all blank cards.
 *
 */
function middleBlanks() {

    document.getElementById("20").setAttribute("src", "img/blank_card.png");
    document.getElementById("21").setAttribute("src", "img/blank_card.png");
    document.getElementById("22").setAttribute("src", "img/blank_card.png");
    document.getElementById("23").setAttribute("src", "img/blank_card.png");
    document.getElementById("24").setAttribute("src", "img/blank_card.png");

}

/**
 * Description:  Function to make sure the user wants to restart the program.
 *               The function throws a confirm dialog, if the user clicks 
 *               ok then the init function is called, otherwise, the game
 *               continues.
 *
 */
function confirmRefresh() {

    $("#refresh").off();
    
    if (confirm("Are you sure you want to restart?")) {

        init();

    } else return;
}

/*
 * Description:  Function to return the suit depending on the parameter
 *               that is passed into the function (0, 1, 3, 4).
 *
 */
function getSuit(suitNo) {

    var suit;

    if (suitNo == 0) {

        suit = "diamonds";

    } else if (suitNo == 1) {

        suit = "clubs";

    } else if (suitNo == 2) {

        suit = "hearts";

    } else suit = "spades";

    return suit;

}

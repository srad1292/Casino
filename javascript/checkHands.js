
/*----------------------------------------------------------------------------*/
/*                                                                            */
/* Program: checkHands.js                                                     */
/*                                                                            */
/* Description: File used to determine which player had the winning hand.     */
/*              This is simply a file with helper methods which are used in   */
/*              game.js file. The main function that is used by game.js is    */
/*              compareHand() which gets passed the current game state.       */
/*                                                                            */
/* @author  Bradley Cronce                                                    */
/*          Sam Radford                                                       */
/*                                                                            */
/* @version  11-29-2014                                                       */
/*                                                                            */
/*----------------------------------------------------------------------------*/

var winner,playerCards,aiCards,high,high2,tHigh,phas,ahas;

/**
 * Description:  Function to determine the winner of the current hand. 
 *               The function makes an array for each players hand. Then, it
 *               goes through each possible hand and determines the winner.
 *
 */
function compareHand(state) {

    var aiHand,checkResult,playerHand,aiHand,pHigh,aiHigh,pHigh2,aiHigh2;
    checkResult = 0;
    aiHand = 0;
    playerHand = 0;
    winner = 0;
    high = 0;
    high2 = 0;
    pHigh2 = 0;
    aiHigh2 = 0;
    tHigh = 0;
    phas = "Player has high card";
    ahas = "AI has high card";
    playerCards = new Array(7);
    aiCards = new Array(7);
    for(var hold = 0; hold < 7; hold++){
        if(hold < 2){
            playerCards[hold] = state[0][hold].split(" ");
            aiCards[hold] = state[1][hold].split(" ");
        }
        else{
            playerCards[hold] = state[2][hold-2].split(" ");
            aiCards[hold] = state[2][hold-2].split(" ");
        }
        //console.log("PlayerCard: " + playerCards[hold][0]+playerCards[hold][1]);
    }
    
    if(playerCards[0][1] > playerCards[1][1])
        pHigh = playerCards[0][1];
    else
        pHigh = playerCards[1][1];

    if(aiCards[0][1] > aiCards[1][1])
        aiHigh = aiCards[0][1];
    else
        aiHigh = aiCards[1][1];
    
    //Royal Flush 
    if(playerHand == 0){
        sortBySuitAndRank();
        if(checkRoyalFlush(playerCards) == 1){playerHand = 9; phas = "Player has a royal flush";}
    }
    //Straight Flush
    if(playerHand == 0){
        sortBySuitAndRank();
        if(checkStraightFlush(playerCards) == 1){playerHand = 8; phas = "Player has a straight flush";}
    }
    //Four Of A Kind
    if(playerHand == 0){
        sortByRank();
        if(checkFourOfAKind(playerCards) == 1){playerHand = 7; phas = "Player has four of a kind";}
    }
    //Full House
    if(playerHand == 0){
        sortByRank();
        if(checkFullHouse(playerCards) == 1){playerHand = 6; phas = "Player has a full house";}
    }
    //Flush
    if(playerHand == 0){
        sortBySuitAndRank();
        if(checkFlush(playerCards) == 1){playerHand = 5; phas = "Player has a flush";}
    }

    //Straight
    if(playerHand == 0){
        sortByRank();
        if(checkStraight(playerCards) == 1){playerHand = 4; phas = "Player has a straight";}
    }

    //Three of a kind
    if(playerHand == 0){
        sortByRank();
        if(checkThreeOfAKind(playerCards) == 1){playerHand = 3; phas = "Player has three of a kind";}
    }
    
    //Two Pair
    if(playerHand == 0){
        sortByRank();
        if(checkTwoPair(playerCards) == 1){playerHand = 2; phas = "Player has two pair";}
    }

    //One Pair
    if(playerHand == 0){
        sortByRank();
        if(checkOnePair(playerCards) == 1){ playerHand = 1; phas = "Player has a pair";}
    }
     
    if(playerHand > 0){
        pHigh = high;
    }
    if(playerHand == 2 || playerHand == 6){
        pHigh2 = high2;
    }
    high = 0;
    high2 = 0;
    //AI CHECK
    //Royal Flush 
    if(aiHand == 0){
        sortBySuitAndRank();
        if(checkRoyalFlush(aiCards) == 1){aiHand = 9; ahas = "AI has a royal flush";}
    }
    //Straight Flush
    if(aiHand == 0){
        sortBySuitAndRank();
        if(checkStraightFlush(aiCards) == 1){aiHand = 8; ahas = "AI has a straight flush";}
    }
    //Four Of A Kind
    if(aiHand == 0){
        sortByRank();
        if(checkFourOfAKind(aiCards) == 1){aiHand = 7; ahas = "AI has four of a kind";}
    }
    //Full House
    if(aiHand == 0){
        sortByRank();
        if(checkFullHouse(aiCards) == 1){aiHand = 6; ahas = "AI has a full house";}
    }
    //Flush
    if(aiHand == 0){
        sortBySuitAndRank();
        if(checkFlush(aiCards) == 1){aiHand = 5; ahas = "AI has a flush";}
    }

    //Straight
    if(aiHand == 0){
        sortByRank();
        if(checkStraight(aiCards) == 1){aiHand = 4; ahas = "AI has a straight";}
    }

    //Three of a kind
    if(aiHand == 0){
        sortByRank();
        if(checkThreeOfAKind(aiCards) == 1){aiHand = 3; ahas = "AI has three of a kind";}
    }
    
    //Two Pair
    if(aiHand == 0){
        sortByRank();
        if(checkTwoPair(aiCards) == 1){aiHand = 2; ahas = "AI has two pair";}
    }

    //One Pair
    if(aiHand == 0){
        sortByRank();
        if(checkOnePair(aiCards) == 1){ aiHand = 1; ahas = "AI has a pair";}
    }
    
    if(aiHand > 0){
        aiHigh = high;
    }
    if(aiHand == 2 || aiHand == 6){
        aiHigh2 = high2;
    }
    pHigh = parseInt(pHigh);
    aiHigh = parseInt(aiHigh);
    pHigh2 = parseInt(pHigh2);
    aiHigh2 = parseInt(aiHigh2);

    if(aiHand == playerHand && playerHand >0){
       console.log("phigh: " + pHigh);
       console.log("aiHigh: " + aiHigh);
       console.log("phigh2: " + pHigh2);
       console.log("aiHigh2: " + aiHigh2);

       if(pHigh > aiHigh)
           winner = 1;
       else if(aiHigh > pHigh)
           winner = 0;
       else{
           if(pHigh2 > aiHigh2)
               winner = 1;
           else if(aiHigh2 > pHigh2)
               winner = 0;
           else
               winner = checkHighCard(state); 
       }
    }

    else if(aiHand == 0 && playerHand == 0)
        winner = checkHighCard(state);
     
    else if(playerHand > aiHand)
        winner = 1;
        
    else if (playerHand < aiHand)
        winner = 0; 
    
    return winner;

}

/**
 * Description:  Function to sort the players and the ais hand by suit.
 *
 */
function sortBySuit() {
    var temp1,temp2;
    for(var pass = 0; pass < 7; pass++){
        for(var inPass = 0; inPass < 7; inPass++){ 
            if(playerCards[pass][0] < playerCards[inPass][0]){
                temp = playerCards[pass];
                playerCards[pass] = playerCards[inPass];
                playerCards[inPass] = temp;
            }
            if(aiCards[pass][0] < aiCards[inPass][0]){
                temp = aiCards[pass];
                aiCards[pass] = aiCards[inPass];
                aiCards[inPass] = temp;
            }
        }
    }
}

/**
 * Description:  Function to sort the players and the ais hand by rank.
 *
 */
function sortByRank() {

    var temp1;
    for(var pass = 0; pass < 7; pass++){
        for(var inPass = 0; inPass < 7; inPass++){
            if(parseInt(playerCards[pass][1]) < parseInt(playerCards[inPass][1])){
                temp = playerCards[pass];
                playerCards[pass] = playerCards[inPass];
                playerCards[inPass] = temp;
            }
            if(parseInt(aiCards[pass][1]) < parseInt(aiCards[inPass][1])){
                temp = aiCards[pass];
                aiCards[pass] = aiCards[inPass];
                aiCards[inPass] = temp;
            }
        }
    }
}

/**
 * Description:  Function to sort the players and the ais hand by suit and rank.
 *
 */
function sortBySuitAndRank(){
    sortBySuit();

    var temp1;
    for(var pass = 0; pass < 7; pass++){
        for(var inPass = 0; inPass < 7; inPass++){
           if((parseInt(playerCards[pass][1]) < parseInt(playerCards[inPass][1]))&&(parseInt(playerCards[pass][0]) == parseInt(playerCards[inPass][0]))){
                temp = playerCards[pass];
                playerCards[pass] = playerCards[inPass];
                playerCards[inPass] = temp;
            }
           if((parseInt(aiCards[pass][1]) < parseInt(aiCards[inPass][1]))&&(parseInt(aiCards[pass][0]) == parseInt(aiCards[inPass][0]))){
                temp = aiCards[pass];
                aiCards[pass] = aiCards[inPass];
                aiCards[inPass] = temp;
            }
        }
    }

}

/*
 * Description:  Function to check to see if the player or the ai has
 *               a royal flush.
 *
 */
function checkRoyalFlush(cards) {
    var hand = cards;
    var hasRoyalFlush = 0;
    var con = 1;
    var ten = 1;
    for(var pass = 0; pass < 6; pass++){
        if(parseInt(hand[pass+1][0]) == (parseInt(hand[pass][0])) && parseInt(hand[pass+1][1]) == (parseInt(hand[pass][1]))+1){
            if(con == 1){ ten = pass; }
            con++;
            if(con == 5 && parseInt(hand[ten][1]) == 9){ hasRoyalFlush = 1; high = 13;}
        }
        else{
            con = 1;
        }
    }
    
    return hasRoyalFlush;

}

/**
 * Description:  Function to check to see if the player or the ai has 
 *               straight flush.
 *
 */
function checkStraightFlush(cards) {
    var hand = cards;
    var hasStraightFlush = 0;
    var con = 1;
    for(var pass = 0; pass < 6; pass++){
        if(parseInt(hand[pass+1][0]) == (parseInt(hand[pass][0])) && parseInt(hand[pass+1][1]) == (parseInt(hand[pass][1]))+1){
            con++;
            if(con == 5){
                hasStraightFlush = 1;
                if(high == 0)
                    high = hand[pass+1][1];
            }
        }
        else{
            con = 1;
        }
    }
    return hasStraightFlush;

}

/**
 * Description:  Function to check to see if the player or the ai has 
 *               four of a kind.
 *
 */
function checkFourOfAKind(cards) {
    var hand = cards;
    var hasFour = 0;

    for(var pass = 0; pass < 4; pass++){
        if(hand[pass][1] == hand[pass+1][1] && hand[pass][1] == hand[pass+2][1] && hand[pass][1] == hand[pass+3][1]){
            hasFour = 1;
            if(high == 0)
                high = hand[pass][1];
        }
    }
    return hasFour;

}

/**
 * Description:  Function to check to see if the player or the ai has
 *               a full house.
 *
 */
function checkFullHouse(cards) {
    var hand = cards;
    var hasPair = 0;
    var hasThree = 0;
    var three = 0;
    var two = 0;
    var hasFullHouse = 0;
    for(var pass = 0; pass < 5; pass++){
        if(hand[pass][1] == hand[pass+1][1] && hand[pass][1] == hand[pass+2][1]){
            if(hasThree == 0)
                three = pass;
            else{
                if(parseInt(hand[pass][1]) > parseInt(hand[three][1]))
                    three = pass;
            }
            hasThree = 1;
        }
    }
     
    for(var pass = 0; pass < 6; pass++){
        if(hand[pass][1] == hand[pass+1][1] && hand[pass][1] != hand [three][1]){
            if(hasPair == 0)
                two = pass;
            else{
                if(parseInt(hand[pass][1]) > parseInt(hand[two][1]))
                    two = pass;
            }
            hasPair = 1;
        }
    }
    
    if(hasThree == 1 && hasPair == 1){
        hasFullHouse = 1;
        if(high == 0){
            high = hand[three][1];
            high2 = hand[two][1];
        }
    }

    return hasFullHouse;

}

/**
 * Description:  Function to check to see if the player or the ai has
 *               a flush.
 *
 */
function checkFlush(cards) {
    var hand = cards;
    var hasFlush = 0;
    var con = 1;
    for(var pass = 0; pass < 6; pass++){
        if(parseInt(hand[pass+1][0]) == (parseInt(hand[pass][0]))){
            con++;
            if(con == 5){
                hasFlush = 1;
                if(high == 0)
                    high = hand[pass+1][1];
            }
        }
        else{
            con = 1;
        }
    }
    return hasFlush;

}

/**
 * Description:  Function to check to see if the player or the ai had
 *               a straight.
 *
 */
function checkStraight(cards) {
    var hand = cards;
    var hasStraight = 0;
    var con = 1;
    for(var pass = 0; pass < 6; pass++){
        if(parseInt(hand[pass+1][1]) == (parseInt(hand[pass][1]))+1){
            con++;
            if(con == 5){
                hasStraight = 1;
                if(high == 0)
                    high = hand[pass+1][1];
            }
        }
        else{
            con = 1;
        }
    }
    return hasStraight;
}

/**
 * Description:  Function to check to see if the player or the ai has
 *               three of a kind.
 *
 */
function checkThreeOfAKind(cards) {
    var hand = cards;
    var hasThree = 0;

    for(var pass = 0; pass < 5; pass++){
        if(hand[pass][1] == hand[pass+1][1] && hand[pass][1] == hand[pass+2][1]){
            hasThree = 1;
            if(high == 0)
                high = hand[pass][1];
        }
    }
    return hasThree;

}

/**
 * Description:  Function to check to see if the ai or the player
 *               has two pairs.
 *
 */
function checkTwoPair(cards) {
    var hand = cards;
    var hasTwoPair = 0;
    var first = -1;
    var second = -1
    var hasPair = 0;
    var thigh = 0;
    var thigh2 = 0;
    for(var pass = 0; pass< 6; pass++){
        if(hand[pass][1] == hand[pass+1][1]){
            if(hasPair == 0)
                first = pass;
            else if(hasPair == 1){
                second = pass;
                hasTwoPair = 1;
                thigh = hand[pass][1];
                thigh2 = hand[first][1];
            }    
            else{
                thigh = hand[pass][1];
                thigh2 = hand[second][1];
            }
            hasPair++;
        }
    }
    if(high == 0 && hasTwoPair == 1){
            high = thigh;
            high2 = thigh2;
            console.log(high + " " + high2);
    }

    return hasTwoPair;

}

/**
 * Description:  Function to check if the player or the ai 
 *               one pair.
 *
 */
function checkOnePair(cards){
    var hand = cards;
    var hasPair = 0;
    var pair = 0;
    for(var pass = 0; pass < 6; pass++){
        if(hand[pass][1] == hand[pass+1][1]){
            hasPair = 1;
            pair = pass;
        }
    }
    if(hasPair){
        if(high == 0)
            high = hand[pair][1];
    }
    return hasPair;
}

/**
 * Description:  Function to look at the state and determine
 *               which player has the highest cards in their hand.
 *
 */
function checkHighCard(state) {
    var aiHigh;
    var pHigh;

    var aiCard1 = state[1][0].split(" ");
    var aiCard2 = state[1][1].split(" ");

    var pCard1 = state[0][0].split(" ");
    var pCard2 = state[0][1].split(" ");

    // get highest card in ai hand...
    //
    if (aiCard1[1] >= aiCard2[1]) {

        aiHigh = aiCard1[1];

    } else {

        aiHigh = aiCard2[1];

    }

    // get highest card in player hand...
    //
    if (pCard1[1] >= pCard2[1]) {

        pHigh = pCard1[1];

    } else {

        pHigh = pCard2[1];

    }

    // determine which player has highest card...
    //
    if (aiHigh > pHigh) {

        return 0;

    } if (aiHigh < pHigh) {

        return 1;

    } else {

        return 2;

    }

}


function displayHands() {
    alert(phas+"\n"+ ahas);
}

function printCards() {
    for(var pass = 0; pass < 7; pass++){
        console.log("Card[pass]: " + playerCards[pass][0] + playerCards[pass][1]);
    }

}

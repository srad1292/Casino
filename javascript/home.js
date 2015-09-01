window.onload = init;

/**
 * Description:  Function to handle initializing the entire html page.
 *               This function is incharge of setting up the button 
 *               handlers, and calling the appropriate function to save
 *               the users name into localStorage.
 *
 */
function init(){

    // console.log("init");
    var playButton = document.getElementById("play");
    playButton.onclick = saveName;

    var contButton = document.getElementById("contact");
    contButton.onclick = contactLoad;

}

/**
 * Description:  Function to take the name the user entered and 
 *               save it into local storage. This function is needed
 *               so we can display the users name on the game.html page.
 *
 */
function saveName() {

    var name = document.getElementById("homeName").value;
    localStorage.setItem("playerName", name);

}


/**
 * Description:  Function to handle the 'Contact Us' button click.
 *               This function simply loads a contact page.
 *
 */
function contactLoad(){
    
    window.location = 'contact/contact.html';
}



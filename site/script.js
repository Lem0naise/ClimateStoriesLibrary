// setting up default behaviour of navigation buttons
window.onload = function(){
    let menuButtons = document.getElementsByClassName("menuButton");
    for (let i=0; i<menuButtons.length; i++){
        menuButtons[i].onclick = function(event){
            event.stopPropagation();
            document.getElementById("d" + this.id.slice(1)).style.display = 'flex';
        };
    }
}


document.onclick = function(){
    let menuDrops = document.getElementsByClassName("menuDropdown")
    for (let i=0; i<menuDrops.length; i++){
        if (menuDrops[i].style.display != 'none'){
            menuDrops[i].style.display = 'none';
        };
    }
}
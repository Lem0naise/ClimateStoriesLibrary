// setting up default behaviour of navigation buttons
window.onload = function(){
    let menuButtons = document.getElementsByClassName("menuButton");
    for (let i=0; i<menuButtons.length; i++){
        menuButtons[i].onclick = function(event){
            event.stopPropagation();
            document.getElementById("d" + this.id.slice(1)).style.display = 'flex';
        };
    }

    loadMap();
}


document.onclick = function(){
    let menuDrops = document.getElementsByClassName("menuDropdown")
    for (let i=0; i<menuDrops.length; i++){
        if (menuDrops[i].style.display != 'none'){
            menuDrops[i].style.display = 'none';
        };
    }
}

function loadMap(){ // loading from leaflet js
    //let map = L.map('map').setView([20, 10], 3);
    
    //https://leaflet-extras.github.io/leaflet-providers/preview/

    let Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
        maxZoom: 13
    });
    let  Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
        maxZoom: 13
    });
    
    //Esri_OceanBasemap.addTo(map);
    //Esri_WorldTerrain.addTo(map);
}
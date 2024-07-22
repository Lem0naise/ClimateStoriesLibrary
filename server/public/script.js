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



/**
 * 
                <div class="menuButton" id="b1">
                    Home ⌄
                    <div class="menuDropdown" id="d1">
                        <a>Some home</a>
                        <a>Another one</a>
                        <a>Yet more</a>
                    </div>
                </div>
                <div class="menuButton" id="b2">
                    About us ⌄
                    <div class="menuDropdown" id="d2">
                        <a>A thing about us</a>
                        <a>Another one</a>
                        <a>Yet more</a>
                    </div>
                </div>
                <div class="menuButton" id="b3">
                    Weaving our stories ⌄
                    <div class="menuDropdown" id="d3">
                        <a>Testimonials</a>
                        <a>Another one</a>
                        <a>Yet more</a>
                    </div>
                </div>
 */
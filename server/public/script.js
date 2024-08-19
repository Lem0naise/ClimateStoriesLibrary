// setting up default behaviour of navigation buttons
window.onload = function(){
    loadMap();
}

let MAP = false;
async function loadMap(){ // loading from leaflet js
    if (MAP){
        let map = L.map('map').setView([20, 10], 3);
        map.options.maxZoom=9;
        //https://leaflet-extras.github.io/leaflet-providers/preview/

        let Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
            maxZoom: 13
        });
        let Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
            maxZoom: 9
        });
        //Esri_OceanBasemap.addTo(map);
        Esri_WorldTerrain.addTo(map);


        // here request sql??
        
        await loadStories();

        return 1;
    }
    else {
        document.getElementById("hidden").style.display = "flex";
        return 0;
    }
    
}

async function loadStories(){
    return 1;
}

async function hiddenClick(){
    if (MAP == false){
        MAP = true;
        loadMap();
        document.getElementById("hidden").style.display = 'none';
    }
}
async function share(){
    window.open("share", "_self");
}

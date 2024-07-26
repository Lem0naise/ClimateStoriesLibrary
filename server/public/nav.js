window.addEventListener("load", function(){
    fetch('nav.html')
    .then(res => res.text())
    .then(text => {
        let oldelem = document.getElementById("topBar");
        if (oldelem){
            let newelem = document.createElement("div");
            newelem.innerHTML = text;
            oldelem.parentNode.replaceChild(newelem,oldelem);
        }
  
    })
    fetch('bottom.html')
    .then(res => res.text())
    .then(text => {
        let oldelem = document.getElementById("bottomBar");
        if (oldelem){
            let newelem = document.createElement("div");
            newelem.innerHTML = text;
            oldelem.parentNode.replaceChild(newelem,oldelem);
        }
    })
})
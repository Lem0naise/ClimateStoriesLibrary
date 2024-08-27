window.onload = function(){
    window.scrollTo(0, 0);
    document.getElementById("custom-sql-form").addEventListener("submit", loginForm)
    document.getElementById("optionSelector").addEventListener('change', changeDropdown)
    document.getElementById("uploadResponse-img").addEventListener("change", previewImage)
}

async function previewImage(){
    let [file] = document.getElementById("uploadResponse-img").files;
    if (file){
        document.getElementById("uploadResponse-img-preview").src = URL.createObjectURL(file);
    }

}
let currentSelector = "begin";
async function changeDropdown(event){
    let hides = document.getElementsByClassName('hides')
    let selector = document.getElementById("optionSelector").value
    for (let x=0; x<hides.length; x++){
        if (hides[x].id==selector){
            hides[x].classList.remove('hiddenAdmin');
            currentSelector = selector;
            let formOptions = hides[x].getElementsByClassName('f1');
            for (let i=0; i<formOptions.length; i++){
                formOptions[i].value = "";
            }
        }
        else {
            hides[x].classList.add('hiddenAdmin');
        }
    }
}

async function loginForm(event){
    event.preventDefault();
    if (currentSelector=="begin"){document.getElementById('response').innerText = "No option selected.";return;}
    let formData;
    if (currentSelector=="custom"){
        formData = {
            selector: currentSelector,
            custom_query: document.getElementById('custom-query').value,
        }
    }
    if (currentSelector=="uploadVideo"){
        formData = {
            selector: currentSelector,
            uploadVideo_videoSelector: document.getElementById('uploadVideo-videoSelector').value,
            uploadVideo_link: document.getElementById('uploadVideo-link').value,
        }
    }
    if (currentSelector=="getVideos"){
        formData = {
            selector: currentSelector,
            getVideos_videoSelector: document.getElementById('getVideos-videoSelector').value,
        }
    }
    if (currentSelector=="uploadResponse"){
        formData = {
            selector: currentSelector,
            uploadResponse_img: document.getElementById('uploadResponse-img').value,
            uploadResponse_desc: document.getElementById('uploadResponse-desc').value,
            uploadResponse_title: document.getElementById('uploadResponse-title').value,
        }
    }
    formData[username] = document.getElementById('username').value;
    formData[password] = document.getElementById('password').value;
    fetch('/login', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.message=="Authorised"){
            alert("Executed command.");
            document.getElementById('response').innerText = data.message;
        }
        else{
            document.getElementById('response').innerText = data.message;
        }
        
    })
    .catch(error => {
        console.error(error);
    })
}


async function customSqlForm(event){
    event.preventDefault();
    let formData = {
        query: document.getElementById('custom-sql').value,
    };
    fetch('/customSQL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.message=="Authorised"){
            alert("Done.");
        }
        else{
            document.getElementById('response').innerText = data.message;
        } 
    })
    .catch(error => {
        console.error(error);
    })
}
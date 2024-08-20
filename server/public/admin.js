window.onload = function(){
    document.getElementById("custom-sql-form").addEventListener("submit", loginForm)
    document.getElementById("optionSelector").addEventListener('change', changeDropdown)
}

let currentSelector = "begin";
async function changeDropdown(event){
    let hides = document.getElementsByClassName('hides')
    let selector = document.getElementById("optionSelector").value
    for (let x=0; x<hides.length; x++){
        if (hides[x].id==selector){
            hides[x].classList.remove('hiddenAdmin');
            currentSelector = selector;
            console.log(currentSelector);
        }
        else {
            hides[x].classList.add('hiddenAdmin');
        }
    }
}

async function loginForm(event){
    event.preventDefault();
    if (currentSelector=="begin"){document.getElementById('response').innerText = "No option selected.";return;}
    let formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
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
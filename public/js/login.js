document.addEventListener('DOMContentLoaded', function(){
    const loginform=document.getElementById('form');
    loginform.addEventListener('submit', function(event){
        event.preventDefault();

        const formdata=new FormData(loginform);
        const formserialized = new URLSearchParams(formdata).toString();
        const errorMessage = document.getElementById('error-message');
        document.getElementById('error-message').textContent = '';
        axios.post('/login', formserialized) 
            .then(function(response){
                loginform.reset();
                const data = response.data;
                if (data) {
                    localStorage.setItem("token", data.token);
                    console.log("token", data.token);
                    window.location.href="/home.html";
                }
            })
            .catch(function(error){
                if (error.response && error.response.data.error) {
                    errorMessage.textContent = error.response.data.error;
                } else {
                    alert('Error submitting form');
                }
            });
    })
})
document.addEventListener('DOMContentLoaded', function(){
    const loginform=document.getElementById('form');
    loginform.addEventListener('submit', function(event){
        event.preventDefault();

        const formdata=new FormData(loginform);
        const formserialized = new URLSearchParams(formdata).toString();

        document.getElementById('error-message').textContent = '';
        axios.post('/login', formserialized) 
            .then(function(response){
                alert(response.data.message);
                loginform.reset();
                const data = response.data;
                if (data) {
                    localStorage.setItem("token", data.token);
                    console.log("token", data.token);
                    window.location.href="/home.html";
                }
            })
            .catch(function(err){
                const resErr = err.response && err.response.data;
                const errMessage = resErr && resErr.err ? resErr.err : 'Error submitting form';
                document.getElementById('error-message').textContent = errMessage;
            });
    })
})
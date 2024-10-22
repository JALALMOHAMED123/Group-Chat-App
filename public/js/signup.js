document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('form').addEventListener('submit', function(event){
        event.preventDefault();
        const data={
            name: event.target.name.value,
            email: event.target.email.value,
            number: event.target.phnumber.value,
            password: event.target.password.value
        }
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = '';
        axios.post('/signup', data)
            .then(function(response){
                alert(response.data.message);
                document.getElementById('form').reset();
                window.location.href="/login.html";
            })
            .catch(function(err){
                if(err.response && err.response.data.error){
                    errorMessage.textContent=err.response.data.error;
                }
                else
                {
                    alert('Error submitting form');
                }
            });
    })
})
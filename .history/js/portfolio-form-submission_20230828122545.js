const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

document.addEventListener("DOMContentLoaded", function () {

    //login
    var modal = document.getElementById("signupModal");
    var btnSignup = document.getElementById("signup");
    const btnSubmit = document.getElementById("submit");
    const loading  = document.getElementById("loading");

    var form = document.getElementById("submit-form");
    const alertModal = document.getElementById("edit-modal-alert");
    const alertImgIcon = document.getElementById("alert-icon");
    const alertMessageElement = document.getElementById("alert-message");



    btnSignup.onclick = function () {
        modal.style.display = "block";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target == alertModal) {
            alertModal.style.display = "none";
            modal.style.display = "none";
        }
    }
    if (form) {
        form.addEventListener("submit", (e) => {

            //preventing the default behavior of form submission event.
            e.preventDefault();

            var userName = document.getElementById('name');
            var email = document.getElementById('email');
            var password = document.getElementById('password');


            if (userName.value.length == 0) {
                alert("FAILED!\nEnter your name please");
            }
            else if (regex.test(email.value) == false) {
                alert("FAILED!\nEnter correct email address please");
            }
            else if (password.value.length <= 5) {
                alert("FAILED!\nEnter correct password please");
            }
            else {


                btnSubmit.textContent = "";
                loading.style.display = "inline-block";

                MockApiCall().then((response) => {
                    modal.style.display = "none";
                    console.log("API Call Success:", response);

                    alertImgIcon.src = "res/ic_success.png";
                    alertMessageElement.textContent = "Congradulation! Data has been sent successfully."
                    alertMessageElement.style.color = "green";
                    alertModal.style.display = "flex";


                }).catch(error => {
                    
                    modal.style.display = "none";

                    console.error("API Call Error:", error);

                    alertImgIcon.src = "res/ic_failed.png";
                    alertMessageElement.textContent = "Sorry! Your transaction has been failed.Please try again."
                    alertMessageElement.style.color = "red";
                    alertModal.style.display = "flex";


                });

            }


            function ResetForm(){
    
                userName.value = "";
                email.value = "";
                password.value = "";

                btnSubmit.textContent = "SUBMIT";
                loading.style.display = "none";
            }

            function MockApiCall(){
                 return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        var randomNum = Math.floor(Math.random() * 2);
                        if (randomNum === 1) {
                            resolve({ status: "success", message: "Data has been sent successfully" });
                        } else {
                            reject({ status: "error", message: "Sorry! Your transaction has been failed.Please try again." });
                        }

                        ResetForm();


                    }, 1000);
                });
            }
        });
    }

  

});
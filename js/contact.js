/*==================================================
        PORTFOLIO CONTACT FORM
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById(
            "portfolioContactForm"
        );

    if (!form) return;


    form.addEventListener("submit", async function(e) {

        e.preventDefault();


        const button =
            form.querySelector(
                ".portfolio-submit-btn"
            );

        const buttonText =
            button.querySelector("span");

        const buttonIcon =
            button.querySelector("i");


        /* Prevent duplicate submissions */

        button.disabled = true;


        buttonText.textContent =
            "Sending...";


        buttonIcon.className =
            "fas fa-spinner fa-spin";


        try {

            const formData =
                new FormData(form);


            const response =
                await fetch(
                    form.action,
                    {
                        method:"POST",
                        body:formData,
                        headers:{
                            "Accept":"application/json"
                        }
                    }
                );


            const result =
                await response.json();


            if (result.success) {

                buttonText.textContent =
                    "Message Sent";

                buttonIcon.className =
                    "fas fa-check";


                button.style.background =
                    "linear-gradient(135deg,#10B981,#34D399)";


                form.reset();


                setTimeout(() => {

                    button.disabled = false;

                    buttonText.textContent =
                        "Send Message";

                    buttonIcon.className =
                        "fas fa-paper-plane";

                    button.style.background =
                        "linear-gradient(135deg,#2563EB,#38BDF8)";

                }, 3500);


            } else {

                throw new Error(
                    "Form submission failed."
                );

            }


        } catch(error) {

            console.error(error);


            buttonText.textContent =
                "Try Again";

            buttonIcon.className =
                "fas fa-exclamation-circle";


            button.style.background =
                "#DC2626";


            setTimeout(() => {

                button.disabled = false;

                buttonText.textContent =
                    "Send Message";

                buttonIcon.className =
                    "fas fa-paper-plane";

                button.style.background =
                    "linear-gradient(135deg,#2563EB,#38BDF8)";

            }, 3000);

        }

    });

});
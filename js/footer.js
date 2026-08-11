/*==================================================
        PORTFOLIO FOOTER
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==============================================
            CURRENT YEAR
    ==============================================*/

    const year =
        document.getElementById("portfolioYear");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /*==============================================
            FOOTER BACK TO TOP
    ==============================================*/

    const footerBackTop =
        document.getElementById("footerBackTop");

    if (footerBackTop) {

        footerBackTop.addEventListener(
            "click",
            () => {

                window.scrollTo({

                    top:0,

                    behavior:"smooth"

                });

            }
        );

    }

});
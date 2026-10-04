/* =========================================================
   PROJECT CASE STUDY JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       CURRENT YEAR
    ----------------------------------------------------- */

    const yearElements = document.querySelectorAll("[data-project-year]");

    yearElements.forEach((element) => {
        element.textContent = new Date().getFullYear();
    });


    /* -----------------------------------------------------
       BACK TO TOP
    ----------------------------------------------------- */

    const backToTop = document.querySelector("#backToTop");

    if (backToTop) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 500) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }

        });

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* -----------------------------------------------------
       REVEAL CONTENT
    ----------------------------------------------------- */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }

});

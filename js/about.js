/*==================================================
            ABOUT SECTION ANIMATION
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const aboutSection =
        document.querySelector(".about");

    if (!aboutSection) return;


    const animatedElements =
        aboutSection.querySelectorAll(
            ".about-image-card, " +
            ".about-highlight, " +
            ".about-content > *, " +
            ".about-card"
        );


    /* Initial state */

    animatedElements.forEach((element, index) => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity .7s ease, " +
            "transform .7s ease";

        element.style.transitionDelay =
            `${Math.min(index * 0.08, 0.5)}s`;

    });


    /* Observer */

    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;


                    animatedElements.forEach(element => {

                        element.style.opacity = "1";

                        element.style.transform =
                            "translateY(0)";

                    });


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold:0.15
            }
        );


    observer.observe(aboutSection);

});
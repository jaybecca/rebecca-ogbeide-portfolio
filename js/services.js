/*==================================================
            SERVICES SCROLL REVEAL
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const servicesSection =
        document.querySelector(".services");

    if (!servicesSection) return;


    const cards =
        servicesSection.querySelectorAll(
            ".service-card"
        );


    const cta =
        servicesSection.querySelector(
            ".services-cta"
        );


    const elements = [
        ...cards,
        cta
    ];


    elements.forEach((element, index) => {

        if (!element) return;

        element.style.opacity = "0";

        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity .6s ease, " +
            "transform .6s ease";

        element.style.transitionDelay =
            `${Math.min(index * .08, .45)}s`;

    });


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;


                    elements.forEach(element => {

                        if (!element) return;

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
                threshold:.12
            }
        );


    observer.observe(servicesSection);

});
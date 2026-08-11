/*==================================================
        CERTIFICATIONS ANIMATION
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const section =
        document.querySelector(".certifications");

    if (!section) return;


    const elements =
        section.querySelectorAll(
            ".qualification-card, " +
            ".learning-item, " +
            ".learning-cta"
        );


    elements.forEach((element, index) => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity .6s ease, " +
            "transform .6s ease";

        element.style.transitionDelay =
            `${index * 0.08}s`;

    });


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;


                    elements.forEach(element => {

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
                threshold:.1
            }
        );


    observer.observe(section);

});







/*==================================================
        CAREER JOURNEY ANIMATION
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const section =
        document.querySelector(".experience");

    if (!section) return;


    const elements =
        section.querySelectorAll(
            ".experience-item, " +
            ".career-transition, " +
            ".experience-strengths"
        );


    elements.forEach((element, index) => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(30px)";

        element.style.transition =
            "opacity .7s ease, " +
            "transform .7s ease";

        element.style.transitionDelay =
            `${index * 0.12}s`;

    });


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;


                    elements.forEach(element => {

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


    observer.observe(section);

});
/*==================================================
        PROJECT SECTION ANIMATION
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const projectSection =
        document.querySelector(".projects");

    if (!projectSection) return;


    const projectElements =
        projectSection.querySelectorAll(
            ".featured-project, .project-card, .projects-footer"
        );


    projectElements.forEach((element, index) => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(30px)";

        element.style.transition =
            "opacity .7s ease, " +
            "transform .7s ease";

        element.style.transitionDelay =
            `${index * 0.08}s`;

    });


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;


                    projectElements.forEach(element => {

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
                threshold:0.1
            }
        );


    observer.observe(projectSection);

});
/*==================================================
        TESTIMONIALS ANIMATION
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const testimonials =
        document.querySelector(".testimonials");

    if (!testimonials) return;


    const cards =
        testimonials.querySelectorAll(
            ".testimonial-card"
        );


    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(30px)";

        card.style.transition =
            "opacity .7s ease, " +
            "transform .7s ease";

        card.style.transitionDelay =
            `${index * 0.15}s`;

    });


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;


                    cards.forEach(card => {

                        card.style.opacity = "1";

                        card.style.transform =
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


    observer.observe(testimonials);

});
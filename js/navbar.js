

/*==================================================
        PORTFOLIO NAVIGATION
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("siteHeader");

    const menuToggle = document.getElementById("menuToggle");

    const mainNav = document.getElementById("mainNav");

    const navLinks = document.querySelectorAll(".nav-link");


    /*==============================================
            HEADER SCROLL EFFECT
    ==============================================*/

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    });


    /*==============================================
            MOBILE MENU
    ==============================================*/

    menuToggle.addEventListener("click", () => {

        const isOpen =
            mainNav.classList.toggle("open");

        menuToggle.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    /*==============================================
            CLOSE MOBILE MENU
            WHEN LINK IS CLICKED
    ==============================================*/

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


    /*==============================================
            ACTIVE NAVIGATION
    ==============================================*/

    const sections =
        document.querySelectorAll("section[id]");


    const updateActiveLink = () => {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 120;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ){

                currentSection =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                `#${currentSection}`
            ){

                link.classList.add("active");

            }

        });

    };


    window.addEventListener(
        "scroll",
        updateActiveLink
    );


    updateActiveLink();

});
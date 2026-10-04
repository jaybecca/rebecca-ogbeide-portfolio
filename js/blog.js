/* =========================================================
   REBECCA OGBEIDE BLOG JAVASCRIPT
   Handles:
   - Mobile navigation
   - Search
   - Category filtering
   - Clear search
   - Article modal
   - Article content
   - Footer year
   - URL search parameters
   - Keyboard accessibility
========================================================= */

(function () {
    "use strict";

    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function initBlog() {

        console.log("Rebecca Ogbeide Blog JS loaded.");

        initMobileNavigation();
        initSearchAndFilters();
        initArticleModal();
        initFooterYear();

    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    function initMobileNavigation() {

        const menuToggle = document.getElementById("blogMenuToggle");
        const blogNav = document.getElementById("blogNav");

        if (!menuToggle || !blogNav) {
            return;
        }

        menuToggle.addEventListener("click", function () {

            const isOpen = blogNav.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation"
                    : "Open navigation"
            );

            const icon = menuToggle.querySelector("i");

            if (icon) {

                icon.classList.toggle(
                    "fa-bars",
                    !isOpen
                );

                icon.classList.toggle(
                    "fa-xmark",
                    isOpen
                );

            }

        });


        /* Close mobile menu when a navigation link is clicked */

        const navLinks = blogNav.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                blogNav.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

                const icon = menuToggle.querySelector("i");

                if (icon) {

                    icon.classList.add("fa-bars");
                    icon.classList.remove("fa-xmark");

                }

            });

        });

    }


    /* =====================================================
       SEARCH + FILTER
    ===================================================== */

    function initSearchAndFilters() {

        const searchForm =
            document.getElementById("blogSearchForm");

        const searchInput =
            document.getElementById("blogSearchInput");

        const searchButton =
            document.getElementById("blogSearchButton");

        const clearButton =
            document.getElementById("blogSearchClear");

        const status =
            document.getElementById("blogSearchStatus");

        const noResults =
            document.getElementById("noResults");

        const articleGrid =
            document.getElementById("articleGrid");

        const filterButtons =
            document.querySelectorAll(".category-filter");

        if (!articleGrid) {

            console.warn(
                "Blog JS: #articleGrid was not found."
            );

            return;
        }


        /*
         * Get ONLY article cards.
         *
         * This deliberately excludes the featured article
         * because the featured article is outside #articleGrid.
         */

        const articleCards =
            Array.from(
                articleGrid.querySelectorAll(".article-card")
            );


        if (!articleCards.length) {

            console.warn(
                "Blog JS: No .article-card elements found."
            );

            return;
        }


        let activeCategory = "all";
        let currentSearch = "";


        /* =================================================
           NORMALIZE CATEGORY
        ================================================= */

        function normalizeCategory(category) {

            if (!category) {
                return "";
            }

            const value =
                String(category)
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            /*
             * Your HTML uses:
             *
             * data-category="Web"
             *
             * but the filter uses:
             *
             * data-category="web-development"
             *
             * Treat both as the same category.
             */

            const aliases = {

                "web-development": "web",

                "web-dev": "web",

                "webdevelopment": "web",

                "cloud-engineering":
                    "cloud",

                "cloud-engineer":
                    "cloud",

                "dev-sec-ops":
                    "devsecops",

                "dev-secops":
                    "devsecops",

                "ci-cd":
                    "devops",

                "automation":
                    "devops",

                "kubernetes":
                    "devops",

                "security":
                    "security",

                "career":
                    "career",

                "ai":
                    "ai",

                "cloud":
                    "cloud",

                "devops":
                    "devops",

                "devsecops":
                    "devsecops"

            };


            return aliases[value] || value;

        }


        /* =================================================
           BUILD SEARCHABLE TEXT
        ================================================= */

        function getSearchText(card) {

            const title =
                card.querySelector("h3")?.textContent || "";

            const description =
                card.querySelector("p")?.textContent || "";

            const tags =
                Array.from(
                    card.querySelectorAll(".article-tags span")
                )
                .map(function (tag) {
                    return tag.textContent;
                })
                .join(" ");

            const meta =
                Array.from(
                    card.querySelectorAll(".article-meta span")
                )
                .map(function (item) {
                    return item.textContent;
                })
                .join(" ");

            const customSearch =
                card.getAttribute("data-search") || "";

            const category =
                card.getAttribute("data-category") || "";


            return [

                title,
                description,
                tags,
                meta,
                customSearch,
                category

            ]
            .join(" ")
            .toLowerCase()
            .trim();

        }


        /* =================================================
           CHECK SEARCH MATCH
        ================================================= */

        function matchesSearch(card, searchTerm) {

            if (!searchTerm) {
                return true;
            }

            const searchableText =
                getSearchText(card);

            /*
             * Support multiple words.
             *
             * Example:
             *
             * "AWS cloud"
             *
             * will match cards containing BOTH words.
             */

            const searchWords =
                searchTerm
                    .toLowerCase()
                    .split(/\s+/)
                    .filter(Boolean);


            return searchWords.every(function (word) {

                return searchableText.includes(word);

            });

        }


        /* =================================================
           CHECK CATEGORY MATCH
        ================================================= */

        function matchesCategory(card, category) {

            if (
                !category ||
                category === "all"
            ) {

                return true;

            }


            const cardCategory =
                normalizeCategory(
                    card.getAttribute("data-category")
                );


            /*
             * Direct category match.
             */

            if (cardCategory === category) {
                return true;
            }


            /*
             * Search/filter aliases.
             */

            const categoryText =
                getSearchText(card);


            /*
             * This allows the DevSecOps filter to find
             * cards explicitly marked DevSecOps.
             */

            if (
                category === "devsecops" &&
                (
                    categoryText.includes("devsecops") ||
                    categoryText.includes("dev secops")
                )
            ) {

                return true;

            }


            /*
             * Web Development should also find Web cards.
             */

            if (
                category === "web" &&
                (
                    categoryText.includes("web development") ||
                    categoryText.includes("web")
                )
            ) {

                return true;

            }


            return false;

        }


        /* =================================================
           UPDATE SEARCH UI
        ================================================= */

        function updateSearchUI(visibleCount) {

            if (noResults) {

                noResults.classList.toggle(
                    "show",
                    visibleCount === 0
                );

                /*
                 * Some CSS files use display rather than
                 * a .show class, so provide an inline fallback.
                 */

                noResults.style.display =
                    visibleCount === 0
                        ? "block"
                        : "none";

            }


            if (status) {

                if (
                    currentSearch &&
                    activeCategory !== "all"
                ) {

                    status.textContent =
                        `${visibleCount} article${visibleCount === 1 ? "" : "s"} found for "${currentSearch}" in ${getCategoryLabel(activeCategory)}.`;

                } else if (currentSearch) {

                    status.textContent =
                        `${visibleCount} article${visibleCount === 1 ? "" : "s"} found for "${currentSearch}".`;

                } else if (activeCategory !== "all") {

                    status.textContent =
                        `${visibleCount} article${visibleCount === 1 ? "" : "s"} in ${getCategoryLabel(activeCategory)}.`;

                } else {

                    status.textContent =
                        `${visibleCount} articles available.`;

                }

            }


            /*
             * Show/hide clear button.
             */

            if (clearButton) {

                clearButton.classList.toggle(
                    "visible",
                    Boolean(currentSearch)
                );

                clearButton.style.visibility =
                    currentSearch
                        ? "visible"
                        : "hidden";

                clearButton.style.opacity =
                    currentSearch
                        ? "1"
                        : "0";

            }

        }


        /* =================================================
           CATEGORY LABEL
        ================================================= */

        function getCategoryLabel(category) {

            const labels = {

                all: "All",

                cloud: "Cloud",

                devsecops: "DevSecOps",

                devops: "DevOps",

                ai: "AI",

                web: "Web Development",

                "web-development":
                    "Web Development",

                career: "Career",

                security: "Security"

            };

            return labels[category] || category;

        }


        /* =================================================
           APPLY FILTER
        ================================================= */

        function applyFilters(options = {}) {

            const scrollToResults =
                options.scrollToResults === true;


            let visibleCount = 0;


            articleCards.forEach(function (card) {

                const categoryMatches =
                    matchesCategory(
                        card,
                        activeCategory
                    );

                const searchMatches =
                    matchesSearch(
                        card,
                        currentSearch
                    );


                const shouldShow =
                    categoryMatches &&
                    searchMatches;


                if (shouldShow) {

                    card.style.display = "";

                    card.classList.remove(
                        "search-hidden"
                    );

                    /*
                     * Small animation reset.
                     */

                    requestAnimationFrame(function () {

                        card.classList.add(
                            "search-visible"
                        );

                    });

                    visibleCount++;

                } else {

                    card.style.display = "none";

                    card.classList.remove(
                        "search-visible"
                    );

                    card.classList.add(
                        "search-hidden"
                    );

                }

            });


            updateSearchUI(visibleCount);


            /*
             * Scroll to the article section only when the
             * user explicitly submitted a search.
             */

            if (
                scrollToResults &&
                articleGrid
            ) {

                const rect =
                    articleGrid.getBoundingClientRect();

                const absoluteTop =
                    window.pageYOffset +
                    rect.top -
                    100;

                window.scrollTo({

                    top: Math.max(
                        absoluteTop,
                        0
                    ),

                    behavior: "smooth"

                });

            }

        }


        /* =================================================
           SEARCH FORM SUBMIT
        ================================================= */

        if (searchForm) {

            searchForm.addEventListener(
                "submit",
                function (event) {

                    /*
                     * CRITICAL:
                     * Prevent browser from refreshing/navigating
                     * when the search button is clicked.
                     */

                    event.preventDefault();

                    currentSearch =
                        searchInput
                            ? searchInput.value
                                .trim()
                                .toLowerCase()
                            : "";


                    applyFilters({
                        scrollToResults: true
                    });

                }
            );

        }


        /* =================================================
           SEARCH BUTTON
        ================================================= */

        if (searchButton) {

            searchButton.addEventListener(
                "click",
                function (event) {

                    /*
                     * The form submit handler normally handles this.
                     * This makes the button reliable even if another
                     * script interferes with form events.
                     */

                    event.preventDefault();


                    currentSearch =
                        searchInput
                            ? searchInput.value
                                .trim()
                                .toLowerCase()
                            : "";


                    applyFilters({
                        scrollToResults: true
                    });

                }
            );

        }


        /* =================================================
           LIVE SEARCH
        ================================================= */

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    currentSearch =
                        searchInput.value
                            .trim()
                            .toLowerCase();


                    /*
                     * Apply immediately as the user types.
                     */

                    applyFilters({
                        scrollToResults: false
                    });

                }
            );


            /*
             * Enter key.
             */

            searchInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        currentSearch =
                            searchInput.value
                                .trim()
                                .toLowerCase();


                        applyFilters({
                            scrollToResults: true
                        });

                    }

                }
            );

        }


        /* =================================================
           CLEAR SEARCH
        ================================================= */

        if (clearButton) {

            clearButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    if (searchInput) {

                        searchInput.value = "";

                        searchInput.focus();

                    }

                    currentSearch = "";

                    applyFilters({
                        scrollToResults: false
                    });

                }
            );

        }


        /* =================================================
           CATEGORY BUTTONS
        ================================================= */

        filterButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const requestedCategory =
                        button.getAttribute(
                            "data-category"
                        ) || "all";


                    activeCategory =
                        normalizeCategory(
                            requestedCategory
                        );


                    /*
                     * Update active button.
                     */

                    filterButtons.forEach(
                        function (filterButton) {

                            filterButton.classList.remove(
                                "active"
                            );

                            filterButton.setAttribute(
                                "aria-pressed",
                                "false"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );

                    button.setAttribute(
                        "aria-pressed",
                        "true"
                    );


                    /*
                     * Filter articles.
                     */

                    applyFilters({
                        scrollToResults: false
                    });


                    /*
                     * Keep the selected filter visible.
                     */

                    if (
                        typeof button.scrollIntoView ===
                        "function"
                    ) {

                        /*
                         * Don't move the page on desktop.
                         * On mobile, bring the selected button
                         * into view if necessary.
                         */

                        if (
                            window.innerWidth < 768
                        ) {

                            button.scrollIntoView({
                                behavior: "smooth",
                                block: "nearest",
                                inline: "center"
                            });

                        }

                    }

                }
            );

        });


        /* =================================================
           INITIALIZE ARIA STATES
        ================================================= */

        filterButtons.forEach(function (button) {

            const isActive =
                button.classList.contains("active");

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });


        /* =================================================
           INITIAL FILTER
        ================================================= */

        applyFilters({
            scrollToResults: false
        });


        /* =================================================
           URL SEARCH SUPPORT
           
           Example:
           
           blog.html?search=terraform
           
           or
           
           blog.html?category=cloud
        ================================================= */

        try {

            const params =
                new URLSearchParams(
                    window.location.search
                );


            const urlSearch =
                params.get("search");

            const urlCategory =
                params.get("category");


            if (
                urlSearch &&
                searchInput
            ) {

                searchInput.value =
                    urlSearch;

                currentSearch =
                    urlSearch
                        .trim()
                        .toLowerCase();

            }


            if (urlCategory) {

                const normalizedURLCategory =
                    normalizeCategory(
                        urlCategory
                    );


                const matchingButton =
                    Array.from(
                        filterButtons
                    ).find(function (button) {

                        return (
                            normalizeCategory(
                                button.getAttribute(
                                    "data-category"
                                )
                            ) ===
                            normalizedURLCategory
                        );

                    });


                if (matchingButton) {

                    activeCategory =
                        normalizedURLCategory;


                    filterButtons.forEach(
                        function (button) {

                            button.classList.remove(
                                "active"
                            );

                            button.setAttribute(
                                "aria-pressed",
                                "false"
                            );

                        }
                    );


                    matchingButton.classList.add(
                        "active"
                    );

                    matchingButton.setAttribute(
                        "aria-pressed",
                        "true"
                    );

                }

            }


            applyFilters({
                scrollToResults: false
            });

        } catch (error) {

            console.warn(
                "Blog URL parameter handling failed:",
                error
            );

        }

    }


    /* =====================================================
       ARTICLE MODAL
    ===================================================== */

    function initArticleModal() {

        const modal =
            document.getElementById(
                "articleModal"
            );

        const modalBody =
            document.getElementById(
                "articleModalBody"
            );

        const modalClose =
            document.getElementById(
                "modalClose"
            );

        const modalOverlay =
            document.getElementById(
                "modalOverlay"
            );


        if (
            !modal ||
            !modalBody
        ) {

            return;

        }


        const articleButtons =
            document.querySelectorAll(
                ".read-article"
            );


        /* =================================================
           ARTICLE CONTENT
        ================================================= */

        const articles = {

            1: {

                category: "DevSecOps",

                Number: "1 min read",

                title:
                    'DevSecOps Is Not Just "DevOps With Security Added at the End"',

                content: `
                    <p>
                        DevSecOps is not simply about adding a security
                        scanner to the end of a CI/CD pipeline. The bigger
                        idea is to make security part of normal engineering
                        work.
                    </p>

                    <p>
                        When security checks happen earlier, engineers can
                        discover vulnerabilities while the application is
                        still being developed rather than discovering them
                        immediately before production.
                    </p>

                    <h4>What this changes</h4>

                    <p>
                        Security becomes a shared engineering responsibility.
                        Developers, DevOps engineers and security teams can
                        work together around automated checks, secure
                        configuration, dependency scanning, secrets
                        management and monitoring.
                    </p>

                    <p>
                        The goal is not to make development slower. The goal
                        is to make secure development repeatable.
                    </p>
                `

            },


            2: {

                category: "Cloud",

                readTime: "1 min read",

                title:
                    "What I Learned Building My First Practical AWS Cloud Architecture",

                content: `
                    <p>
                        Learning AWS services individually is very different
                        from designing an actual cloud architecture.
                    </p>

                    <p>
                        Building practical architectures forced me to think
                        about networking, compute, storage, security,
                        availability and cost as connected decisions.
                    </p>

                    <h4>The important shift</h4>

                    <p>
                        Instead of asking "What AWS service should I use?",
                        I started asking "What problem am I solving, and
                        what architecture solves it reliably?"
                    </p>

                    <p>
                        That change in thinking is one of the most useful
                        steps in becoming a stronger cloud engineer.
                    </p>
                `

            },


            3: {

                category: "DevOps",

                readTime: "1 min read",

                title:
                    "Why Terraform Changed the Way I Think About Cloud Infrastructure",

                content: `
                    <p>
                        Terraform makes infrastructure easier to describe,
                        review and reproduce because infrastructure can be
                        represented as code.
                    </p>

                    <p>
                        Instead of manually creating every resource,
                        engineers can define the desired state and allow
                        Terraform to manage the infrastructure lifecycle.
                    </p>

                    <h4>Why this matters</h4>

                    <p>
                        Infrastructure code can be version controlled,
                        reviewed and reused. That creates a much more
                        predictable engineering workflow.
                    </p>
                `

            },


            4: {

                category: "DevOps",

                readTime: "1 min read",

                title:
                    'Docker Finally Made "It Works on My Machine" Less Convincing',

                content: `
                    <p>
                        Docker provides a consistent way to package an
                        application together with the dependencies it needs
                        to run.
                    </p>

                    <p>
                        This reduces the differences between development,
                        testing and deployment environments.
                    </p>

                    <h4>Containers are not magic</h4>

                    <p>
                        Containers still require good image design,
                        security practices, resource management and
                        observability. They are a tool for consistency,
                        not a replacement for engineering fundamentals.
                    </p>
                `

            },


            5: {

                category: "DevOps",

                readTime: "1 min read",

                title:
                    "Building a Jenkins CI/CD Pipeline: What Actually Matters",

                content: `
                    <p>
                        A CI/CD pipeline should make software delivery more
                        repeatable and provide useful feedback to engineers.
                    </p>

                    <p>
                        A good pipeline can automate testing, validation,
                        artifact creation, security checks and deployment.
                    </p>

                    <h4>The real value</h4>

                    <p>
                        The goal is not simply to have a green build.
                        The goal is to make the path from code change to
                        reliable deployment predictable.
                    </p>
                `

            },


            6: {

                category: "Security",

                readTime: "1 min read",

                title:
                    "Cloud Security Basics I Refuse to Treat as Optional",

                content: `
                    <p>
                        Cloud security starts with fundamentals such as
                        identity management, least privilege, secure
                        configuration, logging and secrets management.
                    </p>

                    <p>
                        These controls should be part of the architecture
                        rather than something added after deployment.
                    </p>

                    <h4>Start with identity</h4>

                    <p>
                        Knowing who or what can access a resource is one of
                        the most important questions in cloud security.
                    </p>
                `

            },


            7: {

                category: "AI",

                readTime: "1 min read",

                title:
                    "How I Can Use AI as a Cloud Engineer Without Letting It Think for Me",

                content: `
                    <p>
                        AI can be extremely useful for research,
                        documentation, troubleshooting, explanations and
                        repetitive engineering tasks.
                    </p>

                    <p>
                        But the engineer remains responsible for validating
                        the result.
                    </p>

                    <h4>Use AI as an assistant</h4>

                    <p>
                        I find AI most useful when it helps me explore
                        possibilities faster while I remain responsible for
                        architecture, testing, security and final decisions.
                    </p>
                `

            },


            8: {

                category: "Career",

                readTime: "1 min read",

                title:
                    "How I'm Building a Cloud Engineering Portfolio That Recruiters Can Actually Understand",

                content: `
                    <p>
                        A strong engineering portfolio should demonstrate
                        how you think, not simply list technologies.
                    </p>

                    <p>
                        Projects become more valuable when they explain the
                        architecture, decisions, trade-offs, challenges and
                        results.
                    </p>

                    <h4>Show the engineering</h4>

                    <p>
                        Explain what you built, why you chose the design,
                        what went wrong and how you improved it.
                    </p>
                `

            },


            9: {

                category: "Cloud",

                readTime: "1 min read",

                title:
                    "AWS VPC Explained: The Networking Concepts I Had to Stop Memorizing",

                content: `
                    <p>
                        VPC networking becomes easier when you stop treating
                        subnets, route tables and gateways as isolated terms.
                    </p>

                    <p>
                        Instead, think about where traffic starts, where it
                        needs to go and which component controls that path.
                    </p>

                    <h4>Think in traffic flows</h4>

                    <p>
                        Understanding traffic flow makes AWS networking much
                        easier than memorizing definitions.
                    </p>
                `

            },


            10: {

                category: "DevSecOps",

                readTime: "2 min read",

                title:
                    'What "Shift Left" Actually Means in DevSecOps',

                content: `
                    <p>
                        Shift left means moving useful security checks
                        earlier into the development lifecycle.
                    </p>

                    <p>
                        Finding a vulnerability while code is still being
                        developed is generally easier to address than
                        discovering it immediately before production.
                    </p>

                    <h4>Earlier feedback</h4>

                    <p>
                        Automated dependency checks, static analysis,
                        secrets scanning and secure configuration checks can
                        provide useful feedback during development and CI.
                    </p>
                `

            },


            11: {

                category: "Security",

                readTime: "2 min read",

                title:
                    "Please Don't Put Your API Keys in GitHub",

                content: `
                    <p>
                        API keys and other secrets should never be treated
                        like ordinary source code.
                    </p>

                    <p>
                        Once a secret is committed to a repository, simply
                        deleting the file does not necessarily make the
                        credential safe again.
                    </p>

                    <h4>Use secret management</h4>

                    <p>
                        Use appropriate secret-management systems and
                        environment-specific configuration rather than
                        embedding credentials in source code.
                    </p>
                `

            },


            12: {

                category: "DevOps",

                readTime: "3 min read",

                title:
                    "Why GitHub Actions Is More Than a CI Button",

                content: `
                    <p>
                        GitHub Actions can automate much more than running
                        tests after a commit.
                    </p>

                    <p>
                        It can coordinate testing, linting, security checks,
                        artifact creation and deployment workflows.
                    </p>

                    <h4>Automation around the workflow</h4>

                    <p>
                        The most useful automation removes repetitive work
                        while keeping important engineering controls visible
                        and reviewable.
                    </p>
                `

            },


            13: {

                category: "Cloud",

                readTime: "2 min read",

                title:
                    "Scaling a Web Application: EC2 Is Only the Beginning",

                content: `
                    <p>
                        Scaling a web application requires more than simply
                        launching a larger EC2 instance.
                    </p>

                    <p>
                        Load balancing, health checks, redundancy, auto
                        scaling and application architecture all influence
                        how a system behaves under increasing demand.
                    </p>

                    <h4>Design for failure</h4>

                    <p>
                        A scalable system should also consider what happens
                        when an instance, process or availability zone fails.
                    </p>
                `

            },


            14: {

                category: "DevOps",

                readTime: "1 min read",

                title:
                    "Kubernetes Without the Mystery: How I'm Learning the Building Blocks",

                content: `
                    <p>
                        Kubernetes can appear complicated because it
                        introduces many concepts at once.
                    </p>

                    <p>
                        Pods, deployments and services become easier to
                        understand when each is connected to the problem it
                        solves.
                    </p>

                    <h4>Start with the fundamentals</h4>

                    <p>
                        Rather than memorizing every Kubernetes resource,
                        start with workloads, networking, configuration,
                        scaling and desired state.
                    </p>
                `

            },


            15: {

                category: "Career",

                readTime: "1 min read",

                title:
                    "How I'm Preparing for Cloud & DevOps Technical Interviews",

                content: `
                    <p>
                        Technical interview preparation becomes more useful
                        when you practice explaining engineering decisions
                        instead of simply memorizing technology definitions.
                    </p>

                    <p>
                        Be prepared to explain architecture, troubleshooting,
                        security, networking, automation and trade-offs.
                    </p>

                    <h4>Explain your reasoning</h4>

                    <p>
                        Strong answers usually demonstrate how you think
                        through a problem rather than simply naming a tool.
                    </p>
                `

            },


            16: {

                category: "Web",

                readTime: "1 min read",

                title:
                    "What Web Development Taught Me About Cloud Engineering",

                content: `
                    <p>
                        Web development taught me that technology ultimately
                        exists to solve problems for people and businesses.
                    </p>

                    <p>
                        Performance, accessibility, usability and reliability
                        matter just as much as the technology underneath.
                    </p>

                    <h4>Engineering serves users</h4>

                    <p>
                        That perspective is useful in cloud engineering
                        because infrastructure decisions ultimately affect
                        the people using the system.
                    </p>
                `

            },


            17: {

                category: "AI",

                readTime: "1 min read",

                title:
                    "10 Ways AI Can Make a DevOps Engineer More Productive",

                content: `
                    <p>
                        AI can assist with documentation, shell scripting,
                        troubleshooting, research, learning and repetitive
                        tasks.
                    </p>

                    <p>
                        The key is to use it responsibly and validate the
                        generated results.
                    </p>

                    <h4>Productivity without blind trust</h4>

                    <p>
                        AI can reduce the time required to explore a problem,
                        but engineers still need to understand the systems
                        they operate.
                    </p>
                `

            },


            18: {

                category: "Security",

                readTime: "1 min read",

                title:
                    "Linux Server Hardening: The Basics I Check First",

                content: `
                    <p>
                        Server hardening starts with simple controls:
                        updates, access management, SSH configuration,
                        firewall rules, logging and least privilege.
                    </p>

                    <p>
                        These fundamentals reduce unnecessary attack surface
                        and make infrastructure easier to manage.
                    </p>

                    <h4>Security fundamentals matter</h4>

                    <p>
                        Complex security tools cannot compensate for weak
                        basic configuration.
                    </p>
                `

            },


            19: {

                category: "Career",

                readTime: "1 min read",

                title:
                    "My Practical Roadmap for Becoming a Stronger Cloud Engineer",

                content: `
                    <p>
                        Becoming a stronger cloud engineer is not about
                        memorizing every cloud service.
                    </p>

                    <p>
                        I focus on fundamentals, practical projects,
                        documentation, troubleshooting and progressively
                        harder systems.
                    </p>

                    <h4>Build progressively</h4>

                    <p>
                        Each project should introduce a new engineering
                        problem while reinforcing the fundamentals already
                        learned.
                    </p>
                `

            },


            20: {

                category: "DevSecOps",

                readTime: "1 min read",

                title:
                    "Deployment Is Not the Finish Line: Why Monitoring Matters",

                content: `
                    <p>
                        Deployment is only part of operating a reliable
                        system.
                    </p>

                    <p>
                        Logs, metrics, alerts and useful observability help
                        engineers understand what the system is doing after
                        it reaches its environment.
                    </p>

                    <h4>Observe what you operate</h4>

                    <p>
                        Without monitoring, troubleshooting becomes
                        guesswork.
                    </p>
                `

            },


            21: {

                category: "AI",

                readTime: "1 min read",

                title:
                    "The Future Cloud Engineer May Use More AI, Not Fewer Engineering Skills",

                content: `
                    <p>
                        AI is changing how technical work is performed,
                        but strong engineering fundamentals remain valuable.
                    </p>

                    <p>
                        Cloud engineers still need to understand systems,
                        security, networking, reliability, architecture and
                        trade-offs.
                    </p>

                    <h4>AI changes the workflow</h4>

                    <p>
                        The strongest engineers will likely use AI to
                        accelerate parts of their work while retaining
                        responsibility for the decisions and outcomes.
                    </p>
                `

            }

        };


        /* =================================================
           OPEN ARTICLE
        ================================================= */

        function openArticle(articleId) {

            const article =
                articles[String(articleId)];


            /*
             * If no manually written article exists,
             * extract the article directly from the card.
             */

            if (!article) {

                const card =
                    document.querySelector(
                        `.read-article[data-article="${articleId}"]`
                    )?.closest(
                        ".article-card, .featured-article"
                    );


                if (!card) {

                    console.warn(
                        "Article not found:",
                        articleId
                    );

                    return;

                }


                const title =
                    card.querySelector("h3")
                        ?.textContent
                        .trim() ||
                    "Article";


                const description =
                    card.querySelector("p")
                        ?.textContent
                        .trim() ||
                    "";


                const category =
                    card.getAttribute(
                        "data-category"
                    ) ||
                    "Technology";


                modalBody.innerHTML = `

                    <div class="article-modal-header">

                        <span class="modal-category">
                            ${escapeHTML(category)}
                        </span>

                        <h2>
                            ${escapeHTML(title)}
                        </h2>

                    </div>

                    <div class="article-modal-text">

                        <p>
                            ${escapeHTML(description)}
                        </p>

                    </div>

                `;

            } else {

                modalBody.innerHTML = `

                    <div class="article-modal-header">

                        <span class="modal-category">
                            ${escapeHTML(article.category)}
                        </span>

                        <span class="modal-read-time">
                            ${escapeHTML(article.readTime)}
                        </span>

                        <h2>
                            ${escapeHTML(article.title)}
                        </h2>

                    </div>

                    <div class="article-modal-text">

                        ${article.content}

                    </div>

                `;

            }


            modal.classList.add("active");

            modal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.classList.add(
                "modal-open"
            );


            /*
             * Store currently focused element.
             */

            modal.dataset.previousFocus =
                document.activeElement?.id || "";


            if (modalClose) {

                setTimeout(function () {

                    modalClose.focus();

                }, 50);

            }

        }


        /* =================================================
           CLOSE ARTICLE
        ================================================= */

        function closeArticle() {

            modal.classList.remove(
                "active"
            );

            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.classList.remove(
                "modal-open"
            );

        }


        /* =================================================
           ARTICLE BUTTONS
        ================================================= */

        articleButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const articleId =
                        button.getAttribute(
                            "data-article"
                        );


                    if (articleId) {

                        openArticle(
                            articleId
                        );

                    }

                }
            );

        });


        /* =================================================
           CLOSE BUTTON
        ================================================= */

        if (modalClose) {

            modalClose.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    closeArticle();

                }
            );

        }


        /* =================================================
           OVERLAY CLOSE
        ================================================= */

        if (modalOverlay) {

            modalOverlay.addEventListener(
                "click",
                function () {

                    closeArticle();

                }
            );

        }


        /* =================================================
           ESCAPE KEY
        ================================================= */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    modal.classList.contains("active")
                ) {

                    closeArticle();

                }

            }
        );

    }


    /* =====================================================
       HTML ESCAPE HELPER
    ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value ?? "");

        return div.innerHTML;

    }


    /* =====================================================
       FOOTER YEAR
    ===================================================== */

    function initFooterYear() {

        const yearElement =
            document.getElementById(
                "blogYear"
            );


        if (yearElement) {

            yearElement.textContent =
                new Date().getFullYear();

        }

    }


    /* =====================================================
       START APPLICATION
    ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initBlog
        );

    } else {

        initBlog();

    }

})();

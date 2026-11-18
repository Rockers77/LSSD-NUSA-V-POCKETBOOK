document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    const navLinks = document.querySelectorAll(".nav-link");
    const searchInput = document.getElementById("global-search");
    const clearSearchBtn = document.getElementById("clear-search");
    const searchStatus = document.getElementById("search-status");
    const searchableItems = document.querySelectorAll(".searchable-item");
    const sections = document.querySelectorAll(".doc-section");

    // 1. Mobile Sidebar Toggle
    function toggleSidebar(forceClose = false) {
        const isOpen = forceClose ? false : !sidebar.classList.contains("open");
        sidebar.classList.toggle("open", isOpen);
        backdrop.classList.toggle("open", isOpen);
        hamburgerBtn.setAttribute("aria-expanded", isOpen);
    }

    hamburgerBtn.addEventListener("click", () => toggleSidebar());
    backdrop.addEventListener("click", () => toggleSidebar(true));

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 960) {
                toggleSidebar(true);
            }
        });
    });

    // 2. Active Navigation Highlight on Scroll
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("data-target") === id);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // 3. Real-Time Search Filter Across All Manual Items
    function filterPocketbook(query) {
        const cleanQuery = query.toLowerCase().trim();
        let matchCount = 0;

        searchableItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const isMatch = text.includes(cleanQuery);
            item.classList.toggle("hidden-by-search", !isMatch);
            if (isMatch) matchCount++;
        });

        if (cleanQuery === "") {
            searchStatus.textContent = "ALL SECTIONS VISIBLE";
        } else {
            searchStatus.textContent = `FOUND ${matchCount} MATCHING BLOCK(S)`;
        }
    }

    searchInput.addEventListener("input", (e) => {
        filterPocketbook(e.target.value);
    });

    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        filterPocketbook("");
        searchInput.focus();
    });
});

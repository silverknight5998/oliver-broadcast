// handle icon menu dropdown
function singleMenu(targetId, menuId, show = false) {
    const targetElement = document.getElementById(targetId);
    const menuElement = document.getElementById(menuId);

    // Initial state
    if (show) {
        // show dropdown
        menuElement.style.display = "block";
        targetElement.classList.add("active");
    } else {
        // hide dropdown
        menuElement.style.display = "none";
        targetElement.classList.remove("active");
    }

    // Toggle menu visibility when target element is clicked
    targetElement.addEventListener("click", () => {
        show = !show;

        if (show) {
            // show dropdown
            menuElement.style.display = "block";
            targetElement.classList.add("active");
        } else {
            // hide dropdown
            menuElement.style.display = "none";
            targetElement.classList.remove("active");
        }
    });

    // Close menu if clicked outside of container
    document.addEventListener("click", (event) => {
        if (!targetElement.parentElement.contains(event.target)) {
            show = false;
            menuElement.style.display = "none";
            targetElement.classList.remove("active");
        }
    });

    // Calculate half of the targetElement width
    const targetHalfWidth = targetElement.parentElement.offsetWidth / 2;

    // Set a CSS variable with the half width value
    targetElement.parentElement.style.setProperty(
        "--target-half-width",
        targetHalfWidth + "px"
    );
}

// Check the containers position to align the menus
const dropdownContainers = document.querySelectorAll(".target-id");

dropdownContainers.forEach((container) => {
    const rect = container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownMenu = container.querySelector(".menu-id");

    // Add 'right' class if the dropdown menu is within 300px from the right edge of the screen
    if (rect.right > viewportWidth - 300) {
        dropdownMenu.classList.add("right");
    }
});

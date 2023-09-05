function initiate_popup(args) {
  // Extract the arguments
  const target = args.target || false;
  const overlayColor = args.overlay_color || false;

  // If target is not provided, return
  if (!target) {
    return false;
  }

  const targetElement = document.querySelector(target);

  if (!targetElement) return;

  // Set overlay background color if provided
  if (overlayColor) {
    targetElement.style.backgroundColor = overlayColor;
  }

  // Fade in the popup
  popup_fade_in(targetElement);

  if (targetElement.classList.contains("opened")) return;

  targetElement.classList.add("opened");

  // Close the popup when clicking on the overlay
  targetElement.addEventListener("click", function (e) {
    e.stopPropagation();
    if (
      e.target.classList.contains("DuKSh") ||
      e.target.classList.contains("AYaOY")
    ) {
      // Check if the clicked element has the class "DuKSh" or "AYaOY"
      popup_fade_out(targetElement);
    } else if (e.target.closest(".DuKSh") || e.target.closest(".AYaOY")) {
      // Check if a parent of the clicked element has the class "DuKSh" or "AYaOY"
      e.stopPropagation(); // Prevent the click event from propagating to the parent div
    }
  });

  // Close the popup when clicking on elements with class 'AYaOY(close buttons)'
  const closeButtonElements = targetElement.querySelectorAll(`.AYaOY`);
  closeButtonElements.forEach(function (element) {
    element.addEventListener("click", function () {
      popup_fade_out(element.closest(".DuKSh"));
    });
  });

  // Prevent form submission and add 'gsCWf(display flex)' class to 'iDzey(popup loader)' element
  const isLoader = targetElement.getAttribute("data-loader") !== "false";
  if (isLoader) {
    targetElement.querySelectorAll("form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        //e.preventDefault();
        popup_form_show_loader(targetElement);
      });
    });
  }

  // // Prevent form submission and add 'gsCWf(display flex)' class to 'iDzey(popup loader)' element
  // const submitButtonElements = document.querySelectorAll(
  //     `${target} [type=submit]`
  // );
  // submitButtonElements.forEach(function (element) {
  //     element.addEventListener("click", function (e) {
  //         e.preventDefault();
  //         this.closest(".DuKSh")
  //             .querySelector(".iDzey")
  //             .classList.add("gsCWf");
  //     });
  // });
}

function popup_fade_in(element) {
  // Fade in the popup by adding 'gsCWf(display flex)' class
  element.classList.add("gsCWf");
  document.body.style.overflow = "hidden";
}

function popup_fade_out(element) {
  // Fade out the popup by removing 'gsCWf(display flex)' class
  element.classList.remove("gsCWf");
  document.body.style.overflow = "auto";
}

function popup_form_show_loader(popup) {
  popup.querySelector(".iDzey").classList.add("gsCWf");
}

function popup_form_hide_loader(popup) {
  popup.querySelector(".iDzey").classList.remove("gsCWf");
}

// menu-scripts

// Execute the code when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get all close button elements
  var closeButtonElements = document.querySelectorAll(".UYvZu");

  // Attach click event listeners to close buttons
  closeButtonElements.forEach(function (closeButton) {
    closeButton.addEventListener("click", function () {
      // Find the parent ellipsis icon button
      var toggleDropdownButton = this.closest(".BgbBR");

      // Toggle the display of the associated dropdown menu
      if (toggleDropdownButton) {
        var dropdownMenu = toggleDropdownButton.querySelector(".JVeuW");
        dropdownMenu.style.display =
          dropdownMenu.style.display === "block" ? "none" : "block";
      }
    });
  });

  // Close the dropdown menus when clicking outside of them
  document.addEventListener("click", function (event) {
    var isClickInsideCloseButton = event.target.classList.contains("UYvZu");
    var isClickInsideNestedCloseButton = event.target.closest(".UYvZu");

    if (!isClickInsideCloseButton && !isClickInsideNestedCloseButton) {
      var visibleDropdownMenus = document.querySelectorAll(".JVeuW");

      // Hide visible dropdown menus
      visibleDropdownMenus.forEach(function (dropdownMenu) {
        if (dropdownMenu.style.display === "block") {
          dropdownMenu.style.display = "none";
        }
      });
    }
  });
});

// handle icon menu dropdown
function singleMenu(targetId, menuId, show = false) {
  const targetElement = document.getElementById(targetId);
  const menuElement = document.getElementById(menuId);

  if (!targetElement || !menuElement) return;

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
  document.addEventListener("click", event => {
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

// Call functions
singleMenu("target_id1", "menu_id1", false);
singleMenu("target_id2", "menu_id2", false);

// Check the containers position to align the menus
const dropdownContainers = document.querySelectorAll(".target-id");

dropdownContainers.forEach(container => {
  const rect = container.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const dropdownMenu = container.querySelector(".menu-id");

  // Add 'right' class if the dropdown menu is within 300px from the right edge of the screen
  if (rect.right > viewportWidth - 300) {
    dropdownMenu.classList.add("right");
  }
});

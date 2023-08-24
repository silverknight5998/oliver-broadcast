// -------------------------------set emoji picker-----------------------------------

window.addEventListener("DOMContentLoaded", () => {
    EmojiButton(document.querySelector("#emoji-button"), function (emoji) {
        document.querySelector(".emoji-input").value += emoji;
    });
});

//--------------------------toggle full-width / 2 column-----------------------------

const toggleBtn = document.querySelector(".toggle");
const wrapper = document.querySelector(".wrapper");

toggleBtn.addEventListener("click", () => {
    // Toggle full-width / box-width mode on toggleIcon click
    wrapper.classList.toggle("full-width");

    // auto scroll to last message on toggleIcon click
    scrollToBottomMessage();
});

//  Add 'full-width' class to wrappper if screen size is less than 1201px
function checkScreenSize() {
    var shouldAddClass = window.innerWidth <= 1200;
    if (shouldAddClass) {
        wrapper.classList.add("full-width");
    }
}

// Call function initially and on screen resize
checkScreenSize();
window.addEventListener("resize", checkScreenSize);

//-----------------------Update the progress bar dynamically---------------------------

function updateProgressBar(collectedAmount, totalAmount) {
    // Get progress percentage
    const progressPercentage = (collectedAmount / totalAmount) * 100;
    const progressBars = document.querySelectorAll(".progress-bar");

    // Set the percentage as progress bar's width
    progressBars.forEach((progressBar) => {
        progressBar.style.width = progressPercentage + "%";
    });
}

// Set custom progress value
let collectedAmount = 200;
let totalAmount = 2000;
updateProgressBar(collectedAmount, totalAmount);

//-------------------------Initialize single menu dropdown-----------------------------

singleMenu("target_id1", "menu_id1", false);
singleMenu("target_id2", "menu_id2", false);
singleMenu("target_id3", "menu_id3", false);
singleMenu("target_id4", "menu_id4", false);

// -----------------------------------tab section--------------------------------------

// hide all the tabs
function hideAllTabs() {
    const tabs = document.querySelectorAll(".tab-menu");
    tabs.forEach((tab) => {
        tab.classList.remove("active");
    });
}

// show current active tab
function showTab(tabId) {
    hideAllTabs();
    const tab = document.getElementById(`${tabId}-tab`);
    tab.classList.add("active");
    setActiveButton(tabId);

    addClassToBottomContainer();
}

// set class 'active' to current tab's button
function setActiveButton(tabId) {
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach((btn) => {
        btn.classList.remove("active");
    });
    const button = document.getElementById(`${tabId}-btn`);
    button.classList.add("active");
}

// -------------------------handle chatbox button click----------------------------------

const bottomContainer = document.querySelector(".bottom-container");
const mobileChatbox = document.querySelector(".mobile-chatbox");
const messageInput = document.querySelector(".input-message");
const chatTabContainer = document.querySelector("#chat-tab");

mobileChatbox.addEventListener("click", (e) => {
    // scroll to chat tab on click
    showTab("chat");
    chatTabContainer.scrollIntoView({
        behavior: "smooth",
    });

    // auto focus message input
    messageInput.focus();
});

// Add class to bottomContainer if chat tab is open

function addClassToBottomContainer() {
    if (chatTabContainer.classList.contains("active")) {
        bottomContainer.classList.add("chat-active");
    } else {
        bottomContainer.classList.remove("chat-active");
    }
}

addClassToBottomContainer();

// set bottom container's 'padding-bottom' equal to mobile-chatbox's height

function setBottomContainerPadding() {
    if (window.innerWidth <= 1000) {
        const mobileChatboxHeight = mobileChatbox.offsetHeight;
        bottomContainer.style.paddingBottom = mobileChatboxHeight + "px";
    } else {
        bottomContainer.style.paddingBottom = "20px";
    }
}

// Call the function initially and on screen resize
setBottomContainerPadding();
window.addEventListener("resize", setBottomContainerPadding);

// -------------------------add message with input value-----------------------------

const sendMessageForm = document.querySelector(".input-container");
const messageContainer = document.querySelector(".message-container");

// Auto-scroll to the new message
function scrollToBottomMessage() {
    messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
    });
}

sendMessageForm.addEventListener("submit", (e) => {
    // stop auto refreshing on submit
    e.preventDefault();

    // Create a new div element
    if (messageInput.value != "") {
        const newDiv = document.createElement("div");
        newDiv.classList.add("message", "message-right");
        newDiv.innerHTML = `<div class="img-container">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                                    alt=""
                                />
                            </div>

                            <div class="text-container">
                                <div class="message-info">
                                    <span class="name">Alicia Padlock</span>
                                    <span class="time">3:50 PM</span>
                                </div>
                                <p class="text">${messageInput.value}</p>
                            </div>`;

        // Get the first child element of the container (if any)
        const firstChild = messageContainer.firstChild;

        // Insert the new div before the first child (if any), or at the top
        messageContainer.insertBefore(newDiv, firstChild);

        // Clear input value on submit
        messageInput.value = "";

        scrollToBottomMessage();
    } else {
        return;
    }
});

// --------------------hide mask image if last message is visible--------------------

// Function to check if the last element is visible within the container
function isLastElementVisible() {
    const lastMessage = messageContainer.lastElementChild;
    if (!lastMessage) return false; // If there are no child elements, it's not visible

    const containerRect = messageContainer.getBoundingClientRect();
    const lastMessageRect = lastMessage.getBoundingClientRect();

    return (
        lastMessageRect.top >= containerRect.top &&
        lastMessageRect.bottom <= containerRect.bottom
    );
}

// Function to handle visibility changes of the last message
function handleLastMessageVisibility() {
    if (wrapper.classList.contains("full-width")) {
        if (isLastElementVisible()) {
            // The last element is fully visible
            messageContainer.style.webkitMaskImage = "none";
            messageContainer.style.maskImage = "none";
        } else {
            // The last element is not fully visible
            messageContainer.style.webkitMaskImage = `linear-gradient(
                to bottom,
                transparent 0,
                black var(--top-mask-size, 0px),
                black calc(100% - var(--bottom-mask-size, 0px)),
                transparent 100%
            )`;
            messageContainer.style.maskImage = `linear-gradient(
                to bottom,
                transparent 0,
                black var(--top-mask-size, 0px),
                black calc(100% - var(--bottom-mask-size, 0px)),
                transparent 100%
            )`;
        }
    }
}

// Check initial visibility of the last message
handleLastMessageVisibility();

// Listen for scroll events on the message container
messageContainer.addEventListener("scroll", handleLastMessageVisibility);

// -----------------------------Close dropdown on icon-close click----------------------------

const closeIcon = document.querySelectorAll(".icon-close");

closeIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
        const menuIdContainer = icon.closest(".menu-id");
        const targetIdContainer = icon.closest(".target-id");

        if (menuIdContainer) {
            menuIdContainer.style.display = "none";
            targetIdContainer.classList.remove("active");
        }
    });
});

// -------------------move purple container based on screen size-------------------------

// Function to move elements inside the left container
function moveElementsToContainer() {
    const leftContainer = document.querySelector(".left-container");
    const purpleContainer = document.querySelector(".profile-meta-container");
    const tabButtonContainer = document.querySelector(".tab-buttons");

    leftContainer.appendChild(purpleContainer);
    leftContainer.appendChild(tabButtonContainer);
}

// Function to move elements back to their original position
function moveElementsBack() {
    const bottomContainer = document.querySelector(".bottom-container");
    const purpleContainer = document.querySelector(".profile-meta-container");
    const tabButtonContainer = document.querySelector(".tab-buttons");

    bottomContainer.insertBefore(
        tabButtonContainer,
        bottomContainer.firstChild
    );
    bottomContainer.insertBefore(purpleContainer, bottomContainer.firstChild);
}

// Function to check if the viewport width is 1000px and move the elements if required
function checkViewportWidth() {
    if (window.innerWidth <= 1000) {
        moveElementsToContainer();
    } else {
        moveElementsBack();
    }
}

// Initial check when the page loads
checkViewportWidth();
window.addEventListener("resize", checkViewportWidth);

// -------switch back to description tab if chat-tab is active on bigger than 1000px screen------

function switchToDescriptionTab() {
    if (
        window.innerWidth > 1000 &&
        chatTabContainer.classList.contains("active")
    ) {
        showTab("description");
    }
}
window.addEventListener("resize", switchToDescriptionTab);

// -------------------------------Initiate splide.js-------------------------------

window.addEventListener("DOMContentLoaded", () => {
    new Splide(".splide", {
        perMove: 1,
        gap: "1rem",
        mediaQuery: "min",
        destroy: false,
        perPage: 1,
    }).mount();
});

//-------------------------------handle pin icon click----------------------------------

const pinIcon = document.querySelector(".pin-icon-container");
const videoContainer = document.querySelector(".left-container");

pinIcon.addEventListener("click", () => {
    videoContainer.classList.toggle("pinned");
});

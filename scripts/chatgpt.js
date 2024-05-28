// Function to be executed when the target element appears
function onElementReady(selector, callback) {
    const targetNode = document.body;

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const observerCallback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const element = document.querySelector(selector);
                if (element) {
                    // Element is found, execute the callback and stop observing
                    callback(element);
                    observer.disconnect();
                    return;
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(observerCallback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

// Use the function to wait for an element with the class 'left-panel-class' to appear
onElementReady('nav > div:nth-child(2)', function (element) {
    // Create the search bar container
    const searchBarContainer = document.createElement('div');
    searchBarContainer.id = 'search-bar-container';

    // Create the input element
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.id = 'search-bar';
    searchBar.placeholder = 'Search chat history';

    // Append the search bar to the container
    searchBarContainer.appendChild(searchBar);

    // Insert the search bar container at the top of the left panel
    element.insertBefore(searchBarContainer, element.firstChild);

    // Add search functionality (example: filter a list of items)
    searchBar.addEventListener('input', function (event) {
        const query = event.target.value.toLowerCase();
        const items = document.querySelectorAll('nav li');
        items.forEach((item) => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

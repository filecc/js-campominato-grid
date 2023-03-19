/* Fixing the height of the application window on iPhone */
const setAppHeight = () => {
  document.documentElement.style.setProperty(
    '--app-height',
    `${window.innerHeight}px`
  );
};
window.addEventListener('resize', setAppHeight);
setAppHeight();

/* Creates a new HTML element with the specified tag name, classes and text content */
function createChild(tagName, id, classes, text) {
  const newElement = document.createElement(tagName);
  newElement.innerHTML = text;
  addClasses(newElement, classes);
  addID(newElement, id);
  return newElement;
}

/* Adds the specified classes to the given HTML element */
function addClasses(element, classes) {
  for (const _class of classes) {
    element.classList.add(_class);
  }
}


/* Adds the specified ID to the given HTML element */
function addID(element, _id) {
  element.setAttribute('id', _id);
}

/* get a random integer */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// get the clicked position
function getClickedPosition (coordinates){
  const clickedPosition = coordinates
          .replace(/[^0-9]/g, "-")
          .split("-");
        const clickedRow = parseInt(clickedPosition[1]),
          clickedCol = parseInt(clickedPosition[2]);
    return [clickedRow, clickedCol]
}



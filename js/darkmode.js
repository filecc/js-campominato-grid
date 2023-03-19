/* DARK MODE */
const main = document.querySelector("main");
const sun = document.querySelector('.sunImg');
const moon = document.querySelector('.moonImg');

function changeColor() {
  switcher.classList.toggle("sun");
  switcher.classList.toggle("moon");
  sun.classList.toggle('takeBack');
  moon.classList.toggle('takeBack');

  if (switcher.classList.contains("moon")) {
    main.classList.remove("dark");
    sun.classList.remove('takeBack');
    sun.classList.add('moveApart');

  } else {
    main.classList.add("dark");
    moon.classList.remove('takeBack');
    moon.classList.add('moveApart');
  }
  main.classList.toggle("dark");
  document.querySelector(".selectOptions").classList.toggle("light");
  document.querySelector("#gameHeader").classList.toggle("light");
}



const switcher = document.getElementById("btnSwitch");

//listen to input in toggle button
switcher.addEventListener("click", () => {
  changeColor();
});

// check if the user use dark mode on his device, if not changeColor() is fired
window.matchMedia("(prefers-color-scheme: dark)").matches && changeColor();

//listen to the change for preferred color
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    changeColor();
  });

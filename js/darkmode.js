/* DARK MODE */
const main = document.querySelector("main");
const sun = document.querySelector('.sunImg');
const moon = document.querySelector('.moonImg');
const switcher = document.getElementById("btnSwitch");

function changeColor() {
  toggleClasses(switcher, ['sun', 'moon']);
  toggleClasses(sun, ['takeBack']);
  toggleClasses(moon, ['takeBack']);
  
  if (switcher.classList.contains("moon")) {
    main.classList.remove("dark");
    sun.classList.remove('takeBack');
    sun.classList.add('moveApart');
    setTimeout(() => {
        sun.classList.toggle('d-none', true);
        moon.classList.remove('d-none', true);
    }, 500);
    
  } else {
    main.classList.add("dark");
    moon.classList.remove('takeBack');
    moon.classList.add('moveApart');
    setTimeout(() => {
        sun.classList.toggle('d-none', false);
        moon.classList.add('d-none', true);
    }, 500);
   
  }
  main.classList.toggle("dark");
  document.querySelector(".selectOptions").classList.toggle("light");
  document.querySelector("#gameHeader").classList.toggle("light");
}

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

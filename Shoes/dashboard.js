
const  sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#close_btn');


const themeToggler = document.querySelector('.theme-toggler');

if(!isUserLoggedIn()){
  window.location.href = "index.html"
}


menuBtn.addEventListener('click',()=>{
       sideMenu.style.display = "block"
})
closeBtn.addEventListener('click',()=>{
    sideMenu.style.display = "none"
})

themeToggler.addEventListener('click',()=>{
     document.body.classList.toggle('dark-theme-variables')
     themeToggler.querySelector('span:nth-child(1').classList.toggle('active')
     themeToggler.querySelector('span:nth-child(2').classList.toggle('active')
})

const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('openModalBtn');

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

function isUserLoggedIn() {
  return localStorage.getItem("currentUser");
}

function logout() {
  let isUserLoggedOut = confirm("Are you sure you want to logout ?");
  if(isUserLoggedOut) {
    localStorage.removeItem("currentUser");
    window.location.href="index.html"
  }
}
// const closeBtn = document.querySelector('.close-btn');

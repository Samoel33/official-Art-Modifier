const blog_message = document.querySelector(".blog");
const clothing_message = document.querySelector(".clothing");
const showMessage = document.querySelector(".blog-clothing");
const checkBox = document.querySelector(".navigation_check_button");
const lists = document.querySelector(".aboutArtM").href;
const glass = document.querySelector(".glass");

blog_message.addEventListener("click", () => {

    setTimeout(() => {
        showMessage.classList.remove("showMessage");
    }, 3000);
    showMessage.classList.toggle("showMessage");
});
clothing_message.addEventListener("click", () => {

    setTimeout(() => {
        showMessage.classList.remove("showMessage");
    }, 3000);
    showMessage.classList.toggle("showMessage");
});
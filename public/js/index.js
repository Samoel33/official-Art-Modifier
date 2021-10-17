import "@babel/polyfill";
import { login, signUp, getMyAccount } from './auth';
import { updateSettings } from "./update";
import { showAlert } from "./alerts";
import axios from "axios";

const blog_message = document.querySelector(".blog");
const clothing_message = document.querySelector(".clothing");
const showMessage = document.querySelector(".blog-clothing");
//const checkBox = document.querySelector(".navigation_check_button");
//const lists = document.querySelector(".aboutArtM").href;
const navigation_bar = document.querySelector(".burger");
const navigation_lists = document.querySelector(".navigation-lists");

const form = document.querySelector(".form-signup ");
const loginForm = document.querySelector(".form-login");
const deletePost1 = document.querySelector("a.delete");
const myAccount = document.querySelector("a.getMyAccs");
const userDataForm = document.querySelector(".form-user-data");
const blog = document.querySelector(".blog-single-container");
const createBlogForm = document.querySelector(".formCreate");
navigation_bar.addEventListener("click", () => {
    console.log("clicked");
    navigation_lists.classList.toggle("show-nav");
});

function media(wide) {
    if (wide.matches) {
        navigation_lists.classList.remove("show-nav");
        document.getElementById("navi-toggle").checked = false;
    }
}
var wide = window.matchMedia("(min-width:37.6em)");
media(wide);
wide.addListener(media);

const activePage = window.location.pathname;
document.querySelectorAll(".navigation-lists li a").forEach((link) => {
    if (link.href.includes(`${activePage}`)) {
        if (link.href.includes("shop")) {
            setTimeout(() => {
                showMessage.classList.remove("showMessage");
            }, 3000);
            showMessage.classList.toggle("showMessage");
        }
        link.classList.add("active");
        console.log(`${activePage}`);
    }
});
const video = document.getElementById("video");
if (video) {
    video.addEventListener("click", () => {
        document.getElementById("video").style.width = "100%";
        document.getElementById("video").style.height = "100%";
        document.getElementById("video").style.zIndex = "100";
    });
}
if (form) {
    form.addEventListener("submit", async(e) => {
        e.preventDefault();
        const userName = form.userName.value;
        const email = form.email.value;
        const password = form.password.value;
        const passwordConfirm = form.passwordConfirm.value;
        signUp(userName, email, password, passwordConfirm);
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        console.log(`you are attempting to login with ${email} and ${password}`);
        login(email, password);
    });
}
if (deletePost1) {
    deletePost1.addEventListener("click", async() => {
        console.log('pressed to delete');
        try {
            const deleteBlog = `/artmodifiers/blog/blogs/${deletePost1.dataset.doc}`;
            const res = await axios({
                method: "DELETE",
                url: deleteBlog,
            })
            if (res.data.status === undefined) {
                showAlert("success", "Blog deleted successfully!");
                window.setTimeout(() => {
                    location.assign("/artmodifiers/blogs");
                }, 1500);
            }
        } catch (err) {
            showAlert("error", err.response.data.message);
            // showAlert("error", 'Your are Not Authorised to Delete');
        }
    });
}
if (myAccount) {
    myAccount.addEventListener('click', () => {
        // e.preventDefault();
        getMyAccount();
    })
}
if (userDataForm)
    userDataForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("userName", document.getElementById("name").value);
        form.append("email", document.getElementById("email").value);
        form.append("photo", document.getElementById("photo").files[0]);
        console.log(form);

        updateSettings(form, "data");
    });
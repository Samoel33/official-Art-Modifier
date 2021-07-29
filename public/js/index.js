const blog_message = document.querySelector(".blog");
const clothing_message = document.querySelector(".clothing");
const showMessage = document.querySelector(".blog-clothing");
const checkBox = document.querySelector(".navigation_check_button");
const lists = document.querySelector(".aboutArtM").href;
const glass = document.querySelector(".glass");

blog_message.addEventListener("click", () => {
	if (lists == "http://localhost:5000/about-art") {
		console.log("lets see");
		glass.style.width = "100%";
		glass.style.transform = "translate(0) rotate(0deg)";
		glass.style.opacity = "1";
	}
	setTimeout(() => {
		showMessage.classList.remove("showMessage");
	}, 3000);
	showMessage.classList.toggle("showMessage");
});
clothing_message.addEventListener("click", () => {
	if (lists == "http://localhost:5000/about-art") {
		console.log("lets see");
		glass.style.width = "100%";
		glass.style.transform = "translate(0) rotate(0deg)";
		glass.style.opacity = "1";
	}
	setTimeout(() => {
		showMessage.classList.remove("showMessage");
	}, 3000);
	showMessage.classList.toggle("showMessage");
});
if (lists == "http://localhost:5000/about-art") {
	console.log("lets see");
	glass.style.width = "100%";
	glass.style.transform = "translate(0) rotate(0deg)";
	glass.style.opacity = "1";
}

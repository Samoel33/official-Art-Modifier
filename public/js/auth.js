import axios from "axios";
import { showAlert } from "./alerts";

export const login = async(email, password) => {
    try {
        const res = await axios({
            method: "POST",
            url: '/artmodifiers/blog/blogs/user/login',
            data: { email, password },
        });
        if (res.data.status === "success") {
            showAlert("success", "Logged in successfully!");
            window.setTimeout(() => {
                location.assign("/artmodifiers/blogs");
            }, 1500);
        }
    } catch (err) {
        console.log(err);

        //  showAlert('error', err.respose.data.message);
        showAlert("error", err.response.data.message);
    }

}
export const signUp = async(userName, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/artmodifiers/blog/blogs/user/signUp',
            data: { userName, email, password, passwordConfirm },
        });
        if (res.data.status === 'success') {
            showAlert("success", "Logged in successfully!");
            window.setTimeout(() => {
                location.assign("/artmodifiers/blogs");
            }, 1500);
        }

    } catch (err) {
        showAlert("error", err.response.data.message);
    }
}
export const getMyAccount = async() => {
    try {
        const res = await axios({
            method: "GET",
            url: "/artmodifiers/blog/blogs/user/me",
        });
        if (res.status === 200) {
            location.assign('/artmodifiers/blog/blogs/user/me');
        }
        console.log(res.status);
        console.log(`u made a request`);
    } catch (err) {

        showAlert("error", err.response.data.message);
    }
};
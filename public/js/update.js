import axios from "axios";
import { showAlert } from "./alerts";

export const updateSettings = async(data, type) => {
    try {
        const url =
            type === "password" ?
            "http://127.0.0.1:5080/artmodifiers/blog/blogs/user/updateMyPassword" :
            "http://127.0.0.1:5080/artmodifiers/blog/blogs/user/updateMe";

        const res = await axios({
            method: "PATCH",
            url,
            data,
        });

        if (res.data.status === "success") {
            showAlert("success", `${type.toUpperCase()} updated successfully!`);
        }
    } catch (err) {
        console.log(err);
        showAlert("error", err.response.data.message);
    }
};
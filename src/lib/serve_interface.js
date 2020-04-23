import axios from "axios";
import router from "../router";
import { notifyError } from "./ToastNotification";

export const publicServer = async (verb, endpoint, data = null, err_msg = "Erreur s'est produit.") => {
    try {
        return await axios({
            method: verb,
            url: `${process.env.VUE_APP_HOST}/${endpoint}`,
            data,
        });
    } catch (err) {
        notifyError(err_msg);
    }
};

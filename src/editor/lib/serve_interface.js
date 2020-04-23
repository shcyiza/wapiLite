import axios from "axios";
import { notifyError } from "./ToastNotification";

const serverApi = async (verb, endpoint, data = null, err_msg = "Erreur s'est produit.") => {
    try {
        return await axios({
            method: verb,
            url: `${process.env.VUE_APP_HOST}${endpoint}`,
            data,
        });
    } catch (err) {
        notifyError(err_msg);
    }

    return null;
};

export default serverApi;

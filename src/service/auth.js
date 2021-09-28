import firebase from "../config/config";

const googleAuth = (provider) => {
    return firebase
        .auth()
        .signInWithPopup(provider)
        .then((res) => {
            return res.user;
        })
        .catch((er) => {
            return er;
        });
};

export default googleAuth;
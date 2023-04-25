export default async function apiRequest(url = '', optionObj, errMessage = null) {
    try {
        const response = await fetch(url, optionObj);
        if (!response.ok) throw Error("Please reload the app");
    } catch (err) {
        errMessage = err.message
    } finally {
        return errMessage;
    }
}
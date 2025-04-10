import axios from "axios";

export async function fetchTempEmails(email: string) {
    const [login, domain] = email.split("@");
    const res = await axios.get(`https://www.1secmail.com/api/v1/`, {
        params: {
            action: "getMessages",
            login,
            domain,
        },
    });
    return res.data;
}

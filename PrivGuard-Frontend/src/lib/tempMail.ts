// src/lib/tempMail.ts
import axios from "axios";

const API = "https://api.mail.tm";
let authToken = "";

interface MailTMMessage {
    id: string;
    from: {
        address: string;
        name?: string;
    };
    subject: string;
    createdAt: string;
}

export async function createTempAccount(): Promise<string> {
    const domainRes = await axios.get(`${API}/domains`);
    const domains = domainRes.data["hydra:member"];
    if (!domains.length) throw new Error("No domains available");

    const selectedDomain = domains[0].domain;
    const randomUsername = Math.random().toString(36).substring(2, 10);
    const randomEmail = `${randomUsername}@${selectedDomain}`;
    const password = "privguard-temp123";

    await axios.post(`${API}/accounts`, {
        address: randomEmail,
        password,
    });

    const tokenRes = await axios.post(`${API}/token`, {
        address: randomEmail,
        password,
    });

    authToken = tokenRes.data.token;
    return randomEmail;
}

export async function fetchTempEmails(): Promise<MailTMMessage[]> {
    if (!authToken) throw new Error("Missing auth token");

    const res = await axios.get(`${API}/messages`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    return res.data["hydra:member"] || [];
}

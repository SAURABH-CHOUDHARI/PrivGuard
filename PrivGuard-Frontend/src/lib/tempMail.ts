import axios from "axios";

const API = import.meta.env.VITE_TEMPMAIL_API;
const password = import.meta.env.VITE_TEMPMAIL_PASS;
let authToken = "";

// TTL for the temp email (6.5 days in milliseconds)
const TTL = 6.5 * 24 * 60 * 60 * 1000;

interface MailTMMessage {
    id: string;
    from: {
        address: string;
        name?: string;
    };
    subject: string;
    createdAt: string;
}

// Function to generate the temporary email and store it in localStorage with TTL
export async function createTempAccount(): Promise<string> {
    const storedEmail = localStorage.getItem("tempEmail");
    const storedTime = localStorage.getItem("tempEmailTime");

    const currentTime = new Date().getTime();
    
    // If the email exists and has not expired, return it
    if (storedEmail && storedTime && currentTime - parseInt(storedTime) < TTL) {
        return storedEmail;
    }

    // Otherwise, create a new temporary email
    const domainRes = await axios.get(`${API}/domains`);
    const domains = domainRes.data["hydra:member"];
    if (!domains.length) throw new Error("No domains available");

    const selectedDomain = domains[0].domain;
    const randomUsername = Math.random().toString(36).substring(2, 10);
    const randomEmail = `${randomUsername}@${selectedDomain}`;
    

    await axios.post(`${API}/accounts`, {
        address: randomEmail,
        password,
    });

    const tokenRes = await axios.post(`${API}/token`, {
        address: randomEmail,
        password,
    });

    authToken = tokenRes.data.token;

    // Store the email and timestamp in localStorage
    localStorage.setItem("tempEmail", randomEmail);
    localStorage.setItem("tempEmailTime", currentTime.toString());

    return randomEmail;
}

// Fetch temporary emails using the stored token
export async function fetchTempEmails(): Promise<MailTMMessage[]> {
    if (!authToken) throw new Error("Missing auth token");

    const res = await axios.get(`${API}/messages`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    return res.data["hydra:member"] || [];
}

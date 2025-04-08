import { useEffect, useState } from "react";
import axios from "axios";

// Replace with your actual user ID fetching logic (e.g. from Clerk or auth context)
const getUserId = () => {
    return localStorage.getItem("user_id") || "demo-user-id";
};

// Helper to convert ArrayBuffer → Base64
function bufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function withPasskeyAuth(WrappedComponent: React.ComponentType) {
    return function PasskeyProtectedComponent(props: any) {
        const [isLoading, setIsLoading] = useState(true);
        const [showSetup, setShowSetup] = useState(false);

        useEffect(() => {
            checkAuthentication();
        }, []);

        const checkAuthentication = async () => {
            if (!window.PublicKeyCredential) {
                console.warn("WebAuthn not supported");
                setIsLoading(false);
                return;
            }

            try {
                const challenge = new Uint8Array(32); // Ideally fetch from backend

                const assertion = await navigator.credentials.get({
                    publicKey: {
                        challenge,
                        userVerification: "required",
                    },
                });

                if (assertion && assertion.type === "public-key") {
                    const credential = assertion as PublicKeyCredential;
                    const userId = getUserId();

                    const res = await axios.post(`${import.meta.env.VITE_BACKEND_ADDR}/api/device-auth`, {
                        register: false,
                        userId,
                        credential: {
                            id: credential.id,
                            rawId: bufferToBase64(credential.rawId),
                            type: credential.type,
                            response: {
                                clientDataJSON: bufferToBase64(
                                    (credential.response as AuthenticatorAssertionResponse).clientDataJSON
                                ),
                                authenticatorData: bufferToBase64(
                                    (credential.response as AuthenticatorAssertionResponse).authenticatorData
                                ),
                                signature: bufferToBase64(
                                    (credential.response as AuthenticatorAssertionResponse).signature
                                ),
                                userHandle: (credential.response as AuthenticatorAssertionResponse).userHandle
                                    ? bufferToBase64(
                                        (credential.response as AuthenticatorAssertionResponse).userHandle!
                                    )
                                    : null,
                            },
                        },
                    });

                    if (res.data.verified) {
                        setIsLoading(false);
                    } else {
                        setShowSetup(true);
                        setIsLoading(false);
                    }
                } else {
                    setShowSetup(true);
                    setIsLoading(false);
                }
            } catch (err) {
                console.warn("Authentication error:", err);
                setShowSetup(true);
                setIsLoading(false);
            }
        };

        const setupAuthentication = async () => {
            try {
                const challenge = new Uint8Array(32); 
                const userId = getUserId();

                const newCredential = await navigator.credentials.create({
                    publicKey: {
                        challenge,
                        rp: { name: "PrivGuard" },
                        user: {
                            id: new TextEncoder().encode(userId),
                            name: userId,
                            displayName: "PrivGuard User",
                        },
                        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                        authenticatorSelection: {
                            authenticatorAttachment: "platform",
                            userVerification: "required",
                        },
                    },
                });

                if (newCredential && newCredential.type === "public-key") {
                    const credential = newCredential as PublicKeyCredential;

                    await axios.post(`${import.meta.env.VITE_BACKEND_ADDR}/api/device-auth`, {
                        register: true,
                        userId,
                        credential: {
                            id: credential.id,
                            rawId: bufferToBase64(credential.rawId),
                            type: credential.type,
                            response: {
                                clientDataJSON: bufferToBase64(
                                    (credential.response as AuthenticatorAttestationResponse).clientDataJSON
                                ),
                                attestationObject: bufferToBase64(
                                    (credential.response as AuthenticatorAttestationResponse).attestationObject
                                ),
                            },
                        },
                    });

                    setShowSetup(false);
                }
            } catch (err) {
                console.error("Passkey setup failed:", err);
            }
        };

        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <p className="text-lg text-gray-600">Authenticating...</p>
                </div>
            );
        }

        if (showSetup) {
            return (
                <div className="flex flex-col items-center justify-center h-screen">
                    <p className="text-lg text-gray-600">
                        No recognized device found. Set up passkey?
                    </p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow"
                        onClick={setupAuthentication}
                    >
                        Set Up Passkey
                    </button>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
}

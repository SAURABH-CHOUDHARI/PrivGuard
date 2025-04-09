import { withPasskeyAuth } from "@/components/withPasskeyAuth";

function PasswordDetail() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Password Details</h1>
            <p>Here are your secured password details.</p>
        </div>
    );
}

export default withPasskeyAuth(PasswordDetail);

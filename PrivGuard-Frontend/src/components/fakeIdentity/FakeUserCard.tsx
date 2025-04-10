import { CopyableField } from "@/components/fakeIdentity/CopyableField";

export default function FakeUserCard({ user }: { user: any }) {
    return (
        <div className="rounded-xl bg-card p-4 shadow-md space-y-3">
            <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full mx-auto" />
            <h3 className="text-lg font-bold text-center">{user.name}</h3>
            <p className="text-muted-foreground text-sm text-center">{user.bio}</p>
            <CopyableField label="Username" value={user.username} />
            <CopyableField label="Email" value={user.email} />
            <CopyableField label="Password" value={user.password} />
        </div>
    );
}

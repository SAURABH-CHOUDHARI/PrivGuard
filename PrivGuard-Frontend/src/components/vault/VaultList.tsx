import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import VaultGroup from "@/components/vault/VaultGroup";
import { VaultEntry } from "@/pages/PasswordVault";

interface VaultListProps {
    entries: VaultEntry[];
    search: string;
}

export default function VaultList({ entries, search }: VaultListProps) {
    const filtered = entries.filter((entry) =>
        entry.service.toLowerCase().includes(search.toLowerCase()) ||
        entry.domain.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = filtered.reduce((acc, entry) => {
        if (!acc[entry.domain]) acc[entry.domain] = [];
        acc[entry.domain].push(entry);
        return acc;
    }, {} as Record<string, VaultEntry[]>);

    if (filtered.length === 0) {
        return <p className="text-center text-muted-foreground py-6">No entries found</p>;
    }

    return (
        <Accordion type="multiple">
            {Object.entries(grouped).map(([domain, entries]) => (
                <AccordionItem value={domain} key={domain} className="border-b">
                    <AccordionTrigger className="text-left text-primary text-lg font-semibold">
                        {domain}
                    </AccordionTrigger>
                    <AccordionContent>
                        <VaultGroup entries={entries} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
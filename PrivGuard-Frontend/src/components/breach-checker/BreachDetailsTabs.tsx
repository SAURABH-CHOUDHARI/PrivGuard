// src/components/breach-checker/BreachDetailsTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreachDetailsTable from "./BreachDetailsTable";
import BreachTimeline from "./BreachTimeline";
import PasswordAnalysis from "./PasswordAnalysis";
import { BreachResponse } from "@/types/breach-types";

interface BreachDetailsTabsProps {
    data: BreachResponse;
}

export default function BreachDetailsTabs({ data }: BreachDetailsTabsProps) {
    return (
        <Tabs defaultValue="details">
            <TabsList className="mb-4">
                <TabsTrigger value="details">Breach Details</TabsTrigger>
                <TabsTrigger value="timeline">Breach Timeline</TabsTrigger>
                <TabsTrigger value="passwords">Password Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
                <BreachDetailsTable breaches={data.ExposedBreaches.breaches_details} />
            </TabsContent>

            <TabsContent value="timeline">
                <BreachTimeline yearwiseDetails={data.BreachMetrics.yearwise_details[0]} />
            </TabsContent>

            <TabsContent value="passwords">
                <PasswordAnalysis passwordStrength={data.BreachMetrics.passwords_strength[0]} />
            </TabsContent>
        </Tabs>
    );
}
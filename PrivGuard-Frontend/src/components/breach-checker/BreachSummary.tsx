// src/components/breach-checker/BreachSummary.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreachResponse } from "@/types/breach-types";

interface BreachSummaryProps {
    data: BreachResponse;
}

export default function BreachSummary({ data }: BreachSummaryProps) {
    const getRiskColor = (label: string) => {
        switch (label) {
            case "Low": return "bg-green-500";
            case "Medium": return "bg-yellow-500";
            case "High": return "bg-orange-500";
            case "Critical": return "bg-red-500";
            default: return "bg-blue-500";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Breach Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-500 mb-2">Risk Level</div>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getRiskColor(data.BreachMetrics.risk[0].risk_label)}`}></div>
                            <span className="font-semibold">{data.BreachMetrics.risk[0].risk_label}</span>
                            <span className="text-sm text-slate-500">({data.BreachMetrics.risk[0].risk_score}/100)</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-500 mb-2">Breaches Found</div>
                        <div className="font-semibold text-lg">
                            {data.ExposedBreaches.breaches_details.length}
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-500 mb-2">Exposed Data</div>
                        <div className="text-sm">
                            {data.ExposedBreaches.breaches_details.length > 0
                                ? data.ExposedBreaches.breaches_details[0].xposed_data.split(';').slice(0, 3).join(', ')
                                : "None"}
                            {data.ExposedBreaches.breaches_details.length > 0 &&
                                data.ExposedBreaches.breaches_details[0].xposed_data.split(';').length > 3
                                ? "..."
                                : ""}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
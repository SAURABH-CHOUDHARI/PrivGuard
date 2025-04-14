// src/components/breach-checker/BreachDetailsTable.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar } from "lucide-react";
import { BreachDetails } from "@/types/breach-types";

interface BreachDetailsTableProps {
    breaches: BreachDetails[];
}

export default function BreachDetailsTable({ breaches }: BreachDetailsTableProps) {
    const getPasswordRiskBadge = (risk: string) => {
        switch (risk.toLowerCase()) {
            case "plaintext":
                return <Badge variant="destructive">Plain Text</Badge>;
            case "easytocrack":
                return <Badge variant="destructive">Easy To Crack</Badge>;
            case "hardtocrack":
                return <Badge variant="secondary" className="bg-amber-500">Strong Hash</Badge>;
            case "unknown":
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Breach Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Breach</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Industry</TableHead>
                            <TableHead>Records</TableHead>
                            <TableHead>Password Risk</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {breaches.map((breach) => (
                            <TableRow key={breach.breach}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {breach.logo ? (
                                            <img
                                                src={breach.logo}
                                                alt={breach.breach}
                                                className="w-5 h-5 object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <Building size={16} />
                                        )}
                                        {breach.breach}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {breach.xposed_date}
                                    </div>
                                </TableCell>
                                <TableCell>{breach.industry}</TableCell>
                                <TableCell>{breach.xposed_records.toLocaleString()}</TableCell>
                                <TableCell>
                                    {getPasswordRiskBadge(breach.password_risk)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
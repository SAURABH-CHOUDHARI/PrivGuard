// src/components/breach-checker/PasswordAnalysis.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { PasswordStrength } from "@/types/breach-types";

interface PasswordAnalysisProps {
    passwordStrength: PasswordStrength;
}

export default function PasswordAnalysis({ passwordStrength }: PasswordAnalysisProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Password Security Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                {passwordStrength && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                            <div className="text-sm text-red-700 mb-1">Plain Text</div>
                            <div className="font-semibold text-lg">{passwordStrength.PlainText}</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <div className="text-sm text-orange-700 mb-1">Easy To Crack</div>
                            <div className="font-semibold text-lg">{passwordStrength.EasyToCrack}</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="text-sm text-green-700 mb-1">Strong Hash</div>
                            <div className="font-semibold text-lg">{passwordStrength.StrongHash}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-sm text-slate-700 mb-1">Unknown</div>
                            <div className="font-semibold text-lg">{passwordStrength.Unknown}</div>
                        </div>
                    </div>
                )}

                <div className="mt-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock size={16} />
                        <span className="font-medium">Password Security Notes:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 ml-5">
                        <li><span className="text-red-600">Plain Text</span>: Passwords stored without any protection</li>
                        <li><span className="text-orange-600">Easy To Crack</span>: Weak hashing that can be broken</li>
                        <li><span className="text-green-600">Strong Hash</span>: Properly protected passwords</li>
                        <li><span className="text-slate-600">Unknown</span>: Security method unknown</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
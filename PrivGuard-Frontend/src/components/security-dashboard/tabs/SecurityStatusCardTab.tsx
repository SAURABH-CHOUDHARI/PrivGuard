// SecurityStatusCard.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { KeyRound, Fingerprint, Lock, Shield } from "lucide-react";

const SecurityStatusCardTab = () => {
    // These will be populated from your API later
    const [securityScore] = useState<number>(50);
    
    const getScoreLabel = (score: number): string => {
        if (score < 40) return "At Risk";
        if (score < 70) return "Adequate";
        return "Optimal";
    };

    const MotionCard = motion.create(Card);

    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border-muted/30 backdrop-blur-sm bg-card/90"
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Security Status</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Shield size={12} className="text-primary" />
                        Enterprise Protection
                    </Badge>
                </div>
                <CardDescription>Overview of your account's security posture</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                className="text-muted-foreground/20"
                                strokeWidth="10"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
                            <circle
                                className={`text-${securityScore < 40 ? 'red' : securityScore < 70 ? 'amber' : 'emerald'}-500`}
                                strokeWidth="10"
                                strokeDasharray={`${securityScore * 2.51} 251`}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-bold">{securityScore}%</span>
                            <span className="text-xs text-muted-foreground">{getScoreLabel(securityScore)}</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="space-y-3">
                            <SecurityFeatureProgress 
                                icon={<KeyRound size={16} className="text-amber-500" />}
                                name="Passkey Authentication"
                                status="1 of 2"
                                progress={50}
                                variant="amber"
                            />
                            <SecurityFeatureProgress 
                                icon={<Fingerprint size={16} className="text-red-500" />}
                                name="TOTP Authentication"
                                status="Not Set Up"
                                progress={0}
                                variant="red"
                            />
                            <SecurityFeatureProgress 
                                icon={<Lock size={16} className="text-emerald-500" />}
                                name="Password Strength"
                                status="Strong"
                                progress={100}
                                variant="emerald"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </MotionCard>
    );
};

// SecurityFeatureProgress component - Reused in StatusCard
const SecurityFeatureProgress = ({ 
    icon, 
    name, 
    status, 
    progress, 
    variant 
}: { 
    icon: React.ReactNode, 
    name: string, 
    status: string, 
    progress: number, 
    variant: 'red' | 'amber' | 'emerald' 
}) => {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm font-medium">{name}</span>
                </div>
                <Badge 
                    variant="outline" 
                    className={`text-${variant}-500 border-${variant}-500/20 bg-${variant}-500/10 text-xs`}
                >
                    {status}
                </Badge>
            </div>
            <Progress value={progress} className="h-1.5" />
        </div>
    );
};


export default SecurityStatusCardTab;
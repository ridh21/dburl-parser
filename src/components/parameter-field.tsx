"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ParameterFieldProps {
    label: string;
    value: string;
    description?: string;
    isPassword?: boolean;
    isMonospace?: boolean;
    onValueChange?: (value: string) => void;
}

export function ParameterField({
    label,
    value,
    description,
    isPassword = false,
    isMonospace = false,
    onValueChange,
}: ParameterFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const [isCopied, setIsCopied] = useState(false);

    const displayValue = isPassword && !showPassword
        ? "•".repeat(Math.min(value.length, 20))
        : localValue;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(localValue);
            setIsCopied(true);
            toast.success(`${label} copied to clipboard`);
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleChange = (newValue: string) => {
        setLocalValue(newValue);
        onValueChange?.(newValue);
    };

    return (
        <TooltipProvider>
            <div className="group relative flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {label}
                        </label>
                        {description && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">{description}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                    {onValueChange ? (
                        <Input
                            type={isPassword && !showPassword ? "password" : "text"}
                            value={localValue}
                            onChange={(e) => handleChange(e.target.value)}
                            className={`h-8 text-sm bg-background ${isMonospace ? "font-mono" : ""}`}
                        />
                    ) : (
                        <p className={`text-sm truncate ${isMonospace ? "font-mono" : ""}`}>
                            {displayValue || <span className="text-muted-foreground italic">Not specified</span>}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {isPassword && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleCopy}
                        disabled={!localValue}
                    >
                        {isCopied ? (
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </Button>
                </div>
            </div>
        </TooltipProvider>
    );
}

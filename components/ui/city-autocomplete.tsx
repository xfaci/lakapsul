"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

interface CityResult {
    label: string;
    city: string;
    postcode: string;
    context: string;
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export function CityAutocomplete({
    value,
    onChange,
    placeholder = "Rechercher une ville...",
    className,
}: CityAutocompleteProps) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<CityResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedInput = useDebounce(inputValue, 300);

    // Fetch suggestions from API
    useEffect(() => {
        async function fetchSuggestions() {
            if (debouncedInput.length < 2) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(debouncedInput)}&type=municipality&limit=8`
                );
                const data = await response.json();

                const results: CityResult[] = data.features.map((feature: {
                    properties: {
                        label: string;
                        city: string;
                        postcode: string;
                        context: string;
                    };
                }) => ({
                    label: feature.properties.label,
                    city: feature.properties.city,
                    postcode: feature.properties.postcode,
                    context: feature.properties.context,
                }));

                setSuggestions(results);
                setIsOpen(results.length > 0);
            } catch (error) {
                console.error("Error fetching cities:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSuggestions();
    }, [debouncedInput]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = useCallback((city: CityResult) => {
        setInputValue(city.label);
        onChange(city.label);
        setIsOpen(false);
        setSuggestions([]);
        setSelectedIndex(-1);
    }, [onChange]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSelect(suggestions[selectedIndex]);
                }
                break;
            case "Escape":
                setIsOpen(false);
                break;
        }
    };

    return (
        <div ref={wrapperRef} className={cn("relative", className)}>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="pl-10 pr-10"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                    <ul className="py-1 max-h-60 overflow-auto">
                        {suggestions.map((city, index) => (
                            <li
                                key={`${city.postcode}-${city.city}`}
                                onClick={() => handleSelect(city)}
                                className={cn(
                                    "px-3 py-2 cursor-pointer flex items-center gap-2 hover:bg-accent transition-colors",
                                    selectedIndex === index && "bg-accent"
                                )}
                            >
                                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{city.city}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {city.postcode} • {city.context}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

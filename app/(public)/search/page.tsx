import { SearchFilters } from "@/components/features/search/search-filters";
import { ProviderCard } from "@/components/features/search/provider-card";
import { MOCK_PROVIDERS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchPage() {
    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 lg:w-80 shrink-0">
                    <SearchFilters />
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Search Bar */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher un studio, un ingé son..." className="pl-10" />
                        </div>
                        <Button>Rechercher</Button>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-muted-foreground">
                        {MOCK_PROVIDERS.length} résultats trouvés
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_PROVIDERS.map((provider) => (
                            <ProviderCard key={provider.id} provider={provider} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

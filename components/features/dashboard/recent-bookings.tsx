import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const bookings = [
    {
        id: "INV001",
        provider: {
            name: "Studio La Seine",
            avatar: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop",
        },
        service: "Session Enregistrement (4h)",
        date: "2023-12-15",
        status: "CONFIRMED",
        amount: "350.00€",
    },
    {
        id: "INV002",
        provider: {
            name: "Alex Mix Engineer",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
        },
        service: "Mixage Titre Stereo",
        date: "2023-12-10",
        status: "COMPLETED",
        amount: "150.00€",
    },
    {
        id: "INV003",
        provider: {
            name: "BeatMaker Pro",
            avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop",
        },
        service: "Licence Exclusive Beat",
        date: "2023-11-28",
        status: "PENDING",
        amount: "80.00€",
    },
];

export function RecentBookings() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Réservations Récentes</h2>
            </div>
            <div className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="w-[250px] text-white">Prestataire</TableHead>
                            <TableHead className="text-white">Service</TableHead>
                            <TableHead className="text-white">Date</TableHead>
                            <TableHead className="text-white">Statut</TableHead>
                            <TableHead className="text-right text-white">Montant</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 ring-2 ring-white/10">
                                            <AvatarImage src={booking.provider.avatar} alt={booking.provider.name} />
                                            <AvatarFallback>{booking.provider.name[0]}</AvatarFallback>
                                        </Avatar>
                                        {booking.provider.name}
                                    </div>
                                </TableCell>
                                <TableCell>{booking.service}</TableCell>
                                <TableCell>{booking.date}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            booking.status === "CONFIRMED"
                                                ? "default"
                                                : booking.status === "COMPLETED"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                        className={
                                            booking.status === "CONFIRMED"
                                                ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/20"
                                                : booking.status === "COMPLETED"
                                                    ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/20"
                                                    : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/20"
                                        }
                                    >
                                        {booking.status === "CONFIRMED"
                                            ? "Confirmé"
                                            : booking.status === "COMPLETED"
                                                ? "Terminé"
                                                : "En attente"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono">{booking.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

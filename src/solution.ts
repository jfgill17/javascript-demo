// Advent of Code-style Challenge: Package Optimization System
import { todayPackages, yesterdayPackages } from "./constants";
import { Package } from "./types";

// Simulated API calls
async function getTodayPackages(): Promise<Package[]> {
    return todayPackages;
}

async function getYesterdayPackages(): Promise<Package[]> {
    return yesterdayPackages;
}

// Helper function to sort packages
function sortPackages(packages: Package[]): Package[] {
    return packages.sort((a, b) => {
        if (a.weight === b.weight) {
            return a.fragile === b.fragile ? 0 : a.fragile ? -1 : 1;
        }
        return a.weight - b.weight;
    });
}

// Main function to solve the challenge
async function optimizePackages(): Promise<Record<string, string>> {
    try {
        const [today, yesterday] = await Promise.all([
            getTodayPackages(),
            getYesterdayPackages(),
        ]);

        const allPackages = [...today, ...yesterday];

        // Filter out invalid packages
        const validPackages = allPackages.filter(
            (pkg) => pkg.weight > 0 && pkg.destination
        );

        // Group packages by destination
        const grouped: Record<string, Package[]> = {};
        for (const pkg of validPackages) {
            if (!grouped[pkg.destination]) {
                grouped[pkg.destination] = [];
            }
            grouped[pkg.destination].push(pkg);
        }

        // Sort each group and select the best package
        const result: Record<string, string> = {};
        for (const destination in grouped) {
            const sorted = sortPackages(grouped[destination]);
            const best = sorted.find((pkg) => !pkg.fragile) || sorted[0];
            if (best) {
                result[destination] = best.id;
            }
        }

        return result;
    } catch (error) {
        console.error("Error optimizing packages:", error);
        return {};
    }
}

// Run the challenge and log the result
optimizePackages().then((result) => console.log("Optimized Packages:", result));
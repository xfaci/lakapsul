import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/dashboard/",
                    "/messages/",
                    "/favorites/",
                    "/onboarding/",
                    "/profile/settings/",
                    "/provider/",
                    "/projects/",
                ],
            },
        ],
        sitemap: "https://lakapsul.vercel.app/sitemap.xml",
    };
}

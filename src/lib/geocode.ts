export const geocodeLocation = async (location: string): Promise<[number, number]> => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`;
    const params = new URLSearchParams({
        access_token: token ?? "",
        limit:  "1",
        language: "en",
        types: "place,locality,address",
    })
    const response = await fetch(`${endpoint}?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Mapbox Geocoding Error: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.features || data.features.length === 0) {
        throw new Error("No results found!");
    }
    const [lng, lat] = data.features[0].center;
    return [lng, lat];
};

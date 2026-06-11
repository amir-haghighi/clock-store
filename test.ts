const a = [
    [
        {
            "color": { "name": "black", "hex": "#000000" },
            price: 12000, "stock": 33, "_id": "6a2943024f7f937538f4065c"
        },

        { "color": { "name": "Silver", "hex": "#C0C0C0" }, price: 12000, "stock": 33, "_id": "6a2943024f7f937538f4065d" }
    ],
    [{ "color": { "name": "Midnight", "hex": "#1C1C1E" }, price: 450, "discountPrice": 339, "stock": 30, "_id": "6a29474bd6c2e83b73443ce0" }, { "color": { "name": "Starlight", "hex": "#F5F5F7" }, price: 450, "stock": 30, "_id": "6a29474bd6c2e83b73443ce1" }],
    [{ "color": { "name": "Blue", "hex": "#0A3D62" }, price: 6500, "discountPrice": 5900, "stock": 5, "_id": "6a295a859d576cbbeaa2af02" }, { "color": { "name": "Silver", "hex": "#BFC9CA" }, price: 6500, "discountPrice": 5900, "stock": 30, "_id": "6a295a859d576cbbeaa2af03" }],
    [{ "color": { "name": "Blue Sunburst", "hex": "#2B547E" }, price: 420, "discountPrice": 350, "stock": 5, "_id": "6a295c449d576cbbeaa2af0d" }],
    [{ "color": { "name": "Black", "hex": "#000000" }, price: 110, "discountPrice": 95, "stock": 33, "_id": "6a295d679d576cbbeaa2af16" }]
]
const originalRes =
    [
        {
            "_id": "6a295d679d576cbbeaa2af15",
            "title": "Casio G-Shock GA-2100",
            "slug": "casio-gshock-ga2100",
            "brand": "Casio",
            "watchModel": "GA-2100-1A1",
            "description": "Ultra durable shock-resistant sports watch.",
            "images": [
                "/uploads/products/1781095783834-868829574.avif",
                "/uploads/products/1781095783834-990902468.avif",
                "/uploads/products/1781095783834-244965090.avif"
            ],
            "category": "sport",
            "gender": "unisex",
            "specifications": {
                "material": "Carbon Core Guard",
                "Shock-Resistance": "yes",
                "Water Resistance": "200m",
                "Battery": "3 years"
            },
            "rating": 0,
            "numReviews": 0,
            "isFeatured": true,
            "isActive": true,
            "createdAt": "2026-06-10T12:49:43.837Z",
            "updatedAt": "2026-06-10T12:49:43.837Z",
            "__v": 0,
            "variants": []
        },
        {
            "_id": "6a295c449d576cbbeaa2af0c",
            "title": "Seiko Presage Cocktail Time",
            "slug": "seiko-presage-cocktail-time",
            "brand": "Seiko",
            "watchModel": "SRPB41J1",
            "description": "Elegant automatic watch inspired by cocktail aesthetics.",
            "images": [
                "/uploads/products/1781095492842-183455464.jpg",
                "/uploads/products/1781095492843-103605008.jpg",
                "/uploads/products/1781095492844-487885032.jpg"
            ],
            "category": "classic",
            "gender": "men",
            "specifications": {
                "material": "Stainless Steel",
                "Movement": "Automatic",
                "Power-Reserve": "41 hours",
                "Glass": "Hardlex"
            },
            "rating": 0,
            "numReviews": 0,
            "isFeatured": true,
            "isActive": true,
            "createdAt": "2026-06-10T12:44:52.849Z",
            "updatedAt": "2026-06-10T12:44:52.849Z",
            "__v": 0,
            "variants": []
        },
        {
            "_id": "6a295a849d576cbbeaa2af01",
            "title": "Omega Seamaster Diver 300M",
            "slug": "omega-seamaster-300m",
            "brand": "Omega",
            "watchModel": "Seamaster 21",
            "description": "Professional diving watch with helium escape valve.",
            "images": [
                "/uploads/products/1781095044989-980832395.avif",
                "/uploads/products/1781095044990-180943723.avif",
                "/uploads/products/1781095044992-969090244.png"
            ],
            "category": "luxury",
            "gender": "men",
            "specifications": {
                "material": "Stainless Steel",
                "Movement": "Co-Axial Master Chronometer",
                "Water-Resistance": "300m",
                "Glass": "Sapphire"
            },
            "rating": 0,
            "numReviews": 0,
            "isFeatured": true,
            "isActive": true,
            "createdAt": "2026-06-10T12:37:25.009Z",
            "updatedAt": "2026-06-10T12:37:25.009Z",
            "__v": 0,
            "variants": []
        },
        {
            "_id": "6a29474bd6c2e83b73443cdf",
            "title": "Apple Watch Series 9",
            "slug": "apple-watch-series-9",
            "brand": "Apple",
            "watchModel": "Series 9 GPS 45mm",
            "description": "Smartwatch with advanced health tracking and always-on display.",
            "images": [
                "/uploads/products/1781090123552-566836652.jpg",
                "/uploads/products/1781090123554-827226393.jpg"
            ],
            "category": "smart",
            "gender": "unisex",
            "specifications": {
                "material": "Aluminum",
                "os": "watchOS",
                "battery": "18 hours"
            },
            "rating": 0,
            "numReviews": 0,
            "isFeatured": true,
            "isActive": true,
            "createdAt": "2026-06-10T11:15:23.564Z",
            "updatedAt": "2026-06-10T11:15:23.564Z",
            "__v": 0,
            "variants": []
        },
        {
            "_id": "6a2943024f7f937538f4065b",
            "title": "Rolex Submariner Date",
            "slug": "rolex-submariner-date",
            "brand": "Rolex",
            "watchModel": "Submariner 126610LN",
            "description": "Luxury diver watch with automatic movement and 300m water resistance.",
            "images": [
                "/uploads/products/1781089026309-278361110.avif",
                "/uploads/products/1781089026310-536742003.avif"
            ],
            "category": "luxury",
            "gender": "men",
            "specifications": {
                "material": "Oystersteel",
                "movement": "Automatic",
                "water-resistance": "300m",
                "glass": "Sapphire"
            },
            "rating": 0,
            "numReviews": 0,
            "isFeatured": true,
            "isActive": true,
            "createdAt": "2026-06-10T10:57:06.325Z",
            "updatedAt": "2026-06-10T10:57:06.325Z",
            "__v": 0,
            "variants": []
        }
    ]
const translateToJson = (item) => {
    JSON.stringify
}

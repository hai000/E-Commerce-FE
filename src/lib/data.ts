const data = {
    headerMenus: [
        {
            name: "Today's Deal",
            href: '/search?tag=todays-deal',
        },
        {
            name: 'New Arrivals',
            href: '/search?tag=new-arrival',
        },
        {
            name: 'Featured Products',
            href: '/search?tag=featured',
        },
        {
            name: 'Best Sellers',
            href: '/search?tag=best-seller',
        },
        {
            name: 'Browsing History',
            href: '/#browsing-history',
        },
        {
            name: 'Customer Service',
            href: '/page.tsx/customers-service',
        },
        {
            name: 'About Us',
            href: '/page.tsx/about-us',
        },
        {
            name: 'Help',
            href: '/page.tsx/help',
        },
    ],
    carousels: [
        {
            title: 'Most Popular Shoes For Sale',
            buttonCaption: 'Shop Now',
            image: '/images/banner3.jpg',
            url: '/search?category=Shoes',
            isPublished: true,
        },
        {
            title: 'Best Sellers in T-Shirts',
            buttonCaption: 'Shop Now',
            image: '/images/banner1.jpg',
            url: '/search?category=T-Shirts',
            isPublished: true,
        },
        {
            title: 'Best Deals on Wrist Watches',
            buttonCaption: 'See More',
            image: '/images/banner2.jpg',
            url: '/search?category=Wrist Watches',
            isPublished: true,
        },
    ],

}
export const products_fake = [
    {
        "id": 16,
        "name": "Áo sơ mi",
        "slug": "ao_so_mi",
        "defaultPrice": 150000,
        "defaultDiscount": 20,
        "published": false,
        "category": {
            "id": 1,
            "name": "aosomi",
            "imagePath": "string",
            "description": "string"
        },
        "description": "Áo sơ mi",
        "images": [
            {
                "id": 123,
                "imagePath": "/images/p11-1.jpg"
            },
            {
                "id": 123,
                "imagePath":  "/images/p11-2.jpg"
            }
        ],
        "colors": [
            {
                "id": 26,
                "colorName": "Trắng",
                "colorCode": "#FFF",
            },
            {
                "id": 27,
                "colorName": "Đen",
                "colorCode": "#000"
            },
            {
                "id": 28,
                "colorName": "Xanh",
                "colorCode": "#37869e",
            }
        ],
        "sizes": [
            {
                "id": 15,
                "size": "L",
                "description": "cho cân nặng từ 40-45kg"
            },
            {
                "id": 16,
                "size": "XL",
                "description": "cho cân nặng từ 45-55kg"
            },
            {
                "id": 17,
                "size": "XXL",
                "description": "cho cân nặng từ 55-70kg"
            }
        ],
        "tags": [],
        "totalSale": 0,
        "quantity": 100,
        "avgRating": 0,
        "numReviews": 0,
        "brand": "string",
        "details": [
            {
                "id": 29,
                "productColor": {
                    "id": 26,
                    "color": "Trắng"
                },
                "productSize": {
                    "id": 15,
                    "size": "L",
                    "description": "cho cân nặng từ 40-45kg"
                },
                "discount": 20,
                "price": 150000,
                "quantity": 0
            },
            {
                "id": 30,
                "productColor": {
                    "id": 26,
                    "color": "Trắng"
                },
                "productSize": {
                    "id": 16,
                    "size": "XL",
                    "description": "cho cân nặng từ 45-55kg"
                },
                "discount": 20,
                "price": 150000,
                "quantity": 0
            },
            {
                "id": 31,
                "productColor": {
                    "id": 26,
                    "color": "Trắng"
                },
                "productSize": {
                    "id": 17,
                    "size": "XXL",
                    "description": "cho cân nặng từ 55-70kg"
                },
                "discount": 20,
                "price": 150000,
                "quantity": 0
            },
            {
                "id": 32,
                "productColor": {
                    "id": 27,
                    "color": "Đen"
                },
                "productSize": {
                    "id": 15,
                    "size": "L",
                    "description": "cho cân nặng từ 40-45kg"
                },
                "discount": 20,
                "price": 150000,
                "quantity": 0
            },
            {
                "id": 33,
                "productColor": {
                    "id": 27,
                    "color": "Đen"
                },
                "productSize": {
                    "id": 16,
                    "size": "XL",
                    "description": "cho cân nặng từ 45-55kg"
                },
                "discount": 20,
                "price": 150000,
                "quantity": 0
            },
            {
                "id": 34,
                "productColor": {
                    "id": 27,
                    "color": "Đen"
                },
                "productSize": {
                    "id": 17,
                    "size": "XXL",
                    "description": "cho cân nặng từ 55-70kg"
                },
                "discount": 20,
                "price": 150000,
                "quantity": 0
            },
            {
                "id": 35,
                "productColor": {
                    "id": 28,
                    "color": "Xanh"
                },
                "productSize": {
                    "id": 15,
                    "size": "L",
                    "description": "cho cân nặng từ 40-45kg"
                },
                "discount": 20,
                "price": 150000,
                "quantity": 0
            },
            {
                "id": 36,
                "productColor": {
                    "id": 28,
                    "color": "Xanh"
                },
                "productSize": {
                    "id": 16,
                    "size": "XL",
                    "description": "cho cân nặng từ 45-55kg"
                },
                "discount": 20,

                "quantity": 0
            },
            {
                "id": 37,
                "productColor": {
                    "id": 28,
                    "color": "Xanh"
                },
                "productSize": {
                    "id": 17,
                    "size": "XXL",
                    "description": "cho cân nặng từ 55-70kg"
                },
                "discount": 20,
                "price": 150000,
                "quantity": 0
            }
        ],
        "createdAt": null,
        "updatedAt": null
    }
]
export default data
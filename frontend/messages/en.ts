import { MessagesType } from "./type";

const en: MessagesType = {
    auth: {
        name: "Name",
        email: "Email",
        login: "Login",
        signup: "Sign Up",
        signupDescription: "Create a new account",
        password: "Password",
        passwordConfirm: "Confirm Password",
        passwordDescription:
            "Password must be at least 8 characters and contain one uppercase letter",
        noAccount: "Don't have an account?",
        loginDescription: "Login to your account",
        alreadyHaveAccount: "Already have an account?"
    },
    nav: {
        contact: "Contact",
        repair: "Repair",
        cart: "Cart"
    },
    products: {
        title: "All Products",
        items: "items",
        refetch: "Refresh",
        errorTitle: "Failed to load products",
        errorDescription: "Something went wrong. Please try again.",
        tryAgain: "Try Again",
        emptyTitle: "No products found",
        emptyDescription: "Check back later or try refreshing.",
        refresh: "Refresh",
        noProducts: "No products found"
    },
    product: {
        title: "All Products",
        items: "items",
        refetch: "Refetch",
        errorTitle: "Failed to load products",
        errorDescription: "Something went wrong. Please try again.",
        tryAgain: "Try Again",
        emptyTitle: "No products found",
        emptyDescription: "Check back later or try refreshing.",
        refresh: "Refresh",
        noProducts: "No products found",
        loading: "Loading...",
        notFoundTitle: "Product not found",
        notFoundDescription: "This product doesn't exist or has been removed.",
        backToProducts: "Back to products",
        addedToCart: "Added to cart",
        cart: "Cart",
        off: 'off',
        home: "Home",
        model: "Model",
        inStock: "In stock",
        outOfStock: "Out of stock",
        addToCart: "Add to Cart",
        color: "color",
        description: "Description",
        specs: "Specifications",
        reviews: "Reviews",
        noReviews: "No reviews yet",
        specifications: "Specifications",
        noSpecs: "No specifications available.",
        warranty: "2 Year Warranty",
        shipping: "Free Shipping",
        returns: "30-Day Returns",
        onlyLeft: "Only {count} left in stock",
    },
    cart: {
        title: "Shopping Cart",
        items: "items",
        emptyTitle: "Your cart is empty",
        emptyDescription: "Looks like you haven't added any watches yet.",
        browseWatches: "Browse Watches",
        orderSummary: "Order Summary",
        subtotal: "Subtotal",
        promo: "Promo",
        shipping: "Shipping",
        free: "Free",
        freeShippingHint: "Free shipping on orders over $500",
        total: "Total",
        promoPlaceholder: "Promo code",
        apply: "Apply",
        invalidPromo: "Invalid promo code",
        checkout: "Proceed to Checkout",
        continueShopping: "← Continue Shopping",
    },
    validation: {
        fullNameMin: "Name must be at least 3 characters",
        fullNameMax: "Name cannot exceed 60 characters",
        invalidEmail: "Please enter a valid email address",
        invalidPhone: "Please enter a valid mobile number",
        subjectRequired: "Please select a subject",
        messageMin: "Message must be at least 20 characters",
        messageMax: "Message cannot exceed 1000 characters"
    },

    contact: {
        hero: {
            title: "Contact Us",
            description:
                "Our watch specialists are ready to answer all your questions regarding luxury watches, repairs and warranty services."
        },

        cards: {
            address: {
                title: "Address",
                badge: "In Person",
                line1: "Valiasr Street, near Vanak Square, Tehran",
                line2: "Golden Watch Mall, Unit 11"
            },

            phone: {
                title: "Phone",
                badge: "Available 9 AM – 9 PM"
            },

            email: {
                title: "Email",
                badge: "24/7"
            },

            workingHours: {
                title: "Business Hours",
                badge: "Store",
                saturdayToWednesday:
                    "Saturday to Wednesday: 10:00 AM – 9:00 PM",
                thursday:
                    "Thursday: 10:00 AM – 6:00 PM",
                friday:
                    "Friday: Closed"
            }
        },

        form: {
            title: "Send a Message",
            description:
                "Complete the form below and we'll get back to you within 24 hours.",

            fullName: "Full Name *",
            fullNamePlaceholder: "John Doe",

            email: "Email *",
            emailPlaceholder: "john@example.com",

            phone: "Mobile Number",
            phonePlaceholder: "+989123456789",

            subject: "Subject *",
            subjectPlaceholder: "Select a subject",

            message: "Message *",
            messagePlaceholder: "Write your message here...",

            submit: "Send Message",
            submitting: "Sending..."
        },

        subjects: {
            purchase: "Watch Purchase",
            repair: "Repair & Service",
            warranty: "Warranty",
            wholesale: "Wholesale",
            other: "Other"
        },

        social: {
            title: "Social Media",
            instagram: "Instagram",
            whatsapp: "WhatsApp"
        },

        responseTime: {
            online: "Online",
            text:
                "Our average response time is less than 2 hours during business hours."
        },

        map: {
            title: "Store Location",
            badge: "📍 Tehran, Valiasr"
        },

        toast: {
            success:
                "We received your message and will contact you shortly."
        },

        footer: {
            copyright:
                "© 2025 Krono Saati. All rights reserved.",
            madeWithLove:
                "Designed with ❤️ for watch enthusiasts"
        }
    }
};

export default en;
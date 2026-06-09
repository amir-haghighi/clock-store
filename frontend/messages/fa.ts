
const fa = {
    auth: {
        name: "نام",
        email: "ایمیل",
        login: "ورود",
        signup: "ثبت نام",
        signupDescription: "برای ساخت اکانت ثبت نام کنید",
        password: "رمز عبور",
        passwordConfirm: "تکرار رمز عبور",
        passwordDescription:
            "رمز عبور باید حداقل ۸ کاراکتر بوده و حداقل یک حرف بزرگ داشته باشد",
        noAccount: "اکانت ندارید؟",
        loginDescription: "به اکانت خود وارد شوید",
        alreadyHaveAccount: "قبلاً ثبت نام کرده‌اید؟"
    },
    nav: {
        contact: "تماس",
        repair: "تعمیرات",
        cart: "سبد خرید"
    }, products: {
        title: "همه محصولات",
        items: "مورد",
        refetch: "دریافت مجدد",
        errorTitle: "خطا در دریافت محصولات",
        errorDescription: "مشکلی پیش آمد. دوباره تلاش کنید.",
        tryAgain: "تلاش مجدد",
        emptyTitle: "محصولی یافت نشد",
        emptyDescription: "بعداً دوباره بررسی کنید یا رفرش کنید.",
        refresh: "رفرش",
        noProducts: "محصولی یافت نشد"
    },
    product: {
        title: "همه محصولات",
        items: "مورد",
        refetch: "دریافت مجدد",
        errorTitle: "خطا در دریافت محصولات",
        errorDescription: "مشکلی پیش آمده، دوباره تلاش کنید",
        tryAgain: "تلاش دوباره",
        emptyTitle: "محصولی یافت نشد",
        emptyDescription: "بعداً دوباره بررسی کنید یا صفحه را رفرش کنید",
        refresh: "رفرش",
        noProducts: "محصولی یافت نشد",
        loading: "درحال بارگزاری...",
        off: 'تخفیف',
        color: "رنگ",
        notFoundTitle: "محصول پیدا نشد",
        notFoundDescription: "این محصول وجود ندارد یا حذف شده است",
        backToProducts: "بازگشت به محصولات",
        addedToCart: "به سبد اضافه شد",
        cart: "سبد خرید",
        home: "خانه",
        model: "مدل",
        inStock: "موجود",
        outOfStock: "ناموجود",
        addToCart: "افزودن به سبد",
        description: "توضیحات",
        specs: "مشخصات",
        reviews: "نظرات",
        noReviews: "هنوز نظری ثبت نشده",
        specifications: "مشخصات فنی",
        noSpecs: "مشخصاتی ثبت نشده است.",
        warranty: "۲ سال گارانتی",
        shipping: "ارسال رایگان",
        returns: "۳۰ روز مرجوعی",
        onlyLeft: "فقط {count} عدد باقی مانده",
    },
    cart: {
        title: "سبد خرید",
        items: "مورد",
        emptyTitle: "سبد خرید شما خالی است",
        emptyDescription: "هنوز ساعتی به سبد اضافه نکرده‌اید.",
        browseWatches: "مشاهده ساعت‌ها",
        orderSummary: "خلاصه سفارش",
        subtotal: "جمع کل",
        promo: "کد تخفیف",
        shipping: "ارسال",
        free: "رایگان",
        freeShippingHint: "ارسال رایگان برای خرید بالای ۵۰۰ دلار",
        total: "مبلغ نهایی",
        promoPlaceholder: "کد تخفیف",
        apply: "اعمال",
        invalidPromo: "کد تخفیف نامعتبر است",
        checkout: "ادامه و پرداخت",
        continueShopping: "← ادامه خرید",
    },

    validation: {
        fullNameMin: "نام باید حداقل ۳ کاراکتر باشد",
        fullNameMax: "نام نباید بیشتر از ۶۰ کاراکتر باشد",
        invalidEmail: "ایمیل معتبر وارد کنید",
        invalidPhone: "شماره موبایل معتبر وارد کنید",
        subjectRequired: "موضوع را انتخاب کنید",
        messageMin: "پیام باید حداقل ۲۰ کاراکتر باشد",
        messageMax: "پیام نباید بیشتر از ۱۰۰۰ کاراکتر باشد"
    },

    contact: {
        hero: {
            title: "با ما در تماس باشید",
            description:
                "تیم متخصص کرونو ساعتی آماده پاسخگویی به تمام سؤالات شما درباره ساعت‌های لوکس، تعمیرات و گارانتی است."
        },

        cards: {
            address: {
                title: "آدرس",
                badge: "حضوری",
                line1: "تهران، خیابان ولیعصر، نرسیده به میدان ونک",
                line2: "پاساژ ساعت طلایی، واحد ۱۱"
            },

            phone: {
                title: "تلفن تماس",
                badge: "پاسخگو ۹–۲۱"
            },

            email: {
                title: "ایمیل",
                badge: "۲۴ ساعته"
            },

            workingHours: {
                title: "ساعت کاری",
                badge: "فروشگاه",
                saturdayToWednesday: "شنبه تا چهارشنبه: ۱۰:۰۰ – ۲۱:۰۰",
                thursday: "پنجشنبه: ۱۰:۰۰ – ۱۸:۰۰",
                friday: "جمعه: تعطیل"
            }
        },

        form: {
            title: "ارسال پیام",
            description:
                "فرم زیر را تکمیل کنید؛ در کمتر از ۲۴ ساعت پاسخ می‌دهیم.",

            fullName: "نام و نام خانوادگی *",
            fullNamePlaceholder: "علی محمدی",

            email: "ایمیل *",
            emailPlaceholder: "ali@example.com",

            phone: "شماره موبایل",
            phonePlaceholder: "09123456789",

            subject: "موضوع *",
            subjectPlaceholder: "انتخاب کنید",

            message: "پیام *",
            messagePlaceholder: "پیام خود را اینجا بنویسید...",

            submit: "ارسال پیام",
            submitting: "در حال ارسال..."
        },

        subjects: {
            purchase: "خرید ساعت",
            repair: "تعمیر و سرویس",
            warranty: "گارانتی",
            wholesale: "خرید عمده",
            other: "سایر"
        },

        social: {
            title: "شبکه‌های اجتماعی",
            instagram: "اینستاگرام",
            whatsapp: "واتساپ"
        },

        responseTime: {
            online: "آنلاین",
            text:
                "میانگین زمان پاسخ ما کمتر از ۲ ساعت در ساعات کاری است."
        },

        map: {
            title: "موقعیت فروشگاه",
            badge: "📍 تهران، ولیعصر"
        },

        toast: {
            success:
                "پیام شما دریافت شد و به زودی با شما تماس خواهیم گرفت."
        },

        footer: {
            copyright:
                "© ۱۴۰۳ کرونو ساعتی. تمامی حقوق محفوظ است.",
            madeWithLove:
                "طراحی با ❤️ برای علاقه‌مندان ساعت"
        }
    }
};

export default fa;
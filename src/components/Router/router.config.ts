import LoadableComponent from '../Loadable/index';

export const userRouter: any = [
  {
    path: '/user',
    name: 'user',
    title: 'User',
    component: LoadableComponent(() => import('../Layout/UserLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/user/login',
    name: 'login',
    title: 'LogIn',
    component: LoadableComponent(() => import('../../scenes/Login')),
    showInMenu: false,
  },
];

export const appRouters: any = [
  {
    path: '/',
    exact: true,
    name: 'home',
    title: 'Home',
    component: LoadableComponent(() => import('../Layout/AppLayout')),
    isLayout: true,
    showInMenu: false,
    roles: [0],
  },
  {
    path: '/dashboard',
    name: 'dashboard1',
    title: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Dashboard')),
    roles: [0],
  },
  {
    permission: 'Users.List',
    title: 'Users',
    name: 'users',
    icon: 'fas fa-users',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/clients',
    permission: 'Clients.List',
    title: 'Clients',
    name: 'client',
    baseMenuItem: 'users',
    icon: 'fas fa-user-tag',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Clients')),
    roles: [0],
  },
  {
    path: '/admins',
    permission: 'Admins.List',
    title: 'Admins',
    name: 'admin',
    baseMenuItem: 'users',
    icon: 'fas fa-user-cog',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Admins')),
    roles: [0],
  },
  {
    path: '/shop-managers',
    permission: 'ShopManagers.List',
    title: 'ShopManagers',
    name: 'shopManager',
    baseMenuItem: 'users',
    icon: 'fas fa-user-tie',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/ShopManagers')),
    roles: [0],
  },
  {
    path: '/event-organizers',
    permission: 'EventOrganizers.List',
    title: 'EventOrganizers',
    name: 'eventOrganizers',
    baseMenuItem: 'users',
    icon: 'fas fa-people-carry',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/EventOrganizers')),
    roles: [0],
  },
  {
    permission: 'Shops.List',
    title: 'Shops',
    name: 'shops',
    icon: 'fas fa-store',
    showInMenu: true,
    roles: [0],
  },
  {
    title: 'Events',
    name: 'event',
    icon: 'far fa-calendar-alt',
    showInMenu: true,
    roles: [0],
    permission: 'Events.List',
  },
  {
    path: '/events',
    title: 'Events',
    permission: 'Events.List',

    name: 'eventList',
    icon: 'far fa-calendar-alt',
    baseMenuItem: 'event',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Events')),
    roles: [0],
  },
  {
    path: '/event-catagories',
    permission: 'EventCategories.List',
    title: 'EventCategories',
    name: 'eventCategories',
    baseMenuItem: 'event',
    icon: 'fas fa-tag',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/EventCategories')),
    roles: [0],
  },
  {
    path: '/withdraw-requests',
    permission: 'EventCategories.List',
    title: 'WithdrawRequests',
    name: 'WithdrawRequests',
    //baseMenuItem: 'event',
    icon: 'fas fa-wallet',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/WithdrawRequests')),
    roles: [0],
  },
  {
    path: '/shops',
    permission: 'Shops.List',
    title: 'Shops',
    name: 'shop',
    baseMenuItem: 'shops',
    icon: 'fas fa-store',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Shops')),
  },
  {
    path: '/shop/:id',
    permission: 'Shops.List',
    title: 'ShopDetails',
    name: 'shopDetails',
    icon: '',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Shops/ShopDetails')),
  },
  {
    path: '/products',
    permission: 'Products.List',
    title: 'Products',
    name: 'product',
    baseMenuItem: 'shops',
    icon: 'fas fa-boxes',
    component: LoadableComponent(() => import('../../scenes/Products')),
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/orders',
    title: 'Orders',
    name: 'order',
    permission: 'Orders.List',
    baseMenuItem: 'shops',
    icon: 'fas fa-shopping-cart',
    component: LoadableComponent(() => import('../../scenes/Orders')),
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/coupons',
    permission: 'Coupons.List',
    title: 'Coupons',
    baseMenuItem: 'shops',
    name: 'coupon',
    icon: 'fas fa-money-check-alt',
    showInMenu: true,
    roles: [0],
    component: LoadableComponent(() => import('../../scenes/Coupons')),
  },
  {
    path: '/promotions',
    permission: 'SliderImages.List',
    title: 'Promotions',
    baseMenuItem: 'shops',
    name: 'promotion',
    icon: 'fas fa-bullhorn',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Promotions')),
    roles: [0],
  },
  {
    path: '/categories',
    permission: 'Categories.List',
    title: 'MainCategories',
    name: 'category',
    icon: 'far fa-star',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Categories')),
    roles: [0],
    baseMenuItem: 'shops',
  },
  {
    path: '/classifications',
    permission: 'Classifications.List',
    title: 'SubCategories',
    name: 'classification',
    icon: 'fas fa-tags',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Classifications')),
    roles: [0],
    baseMenuItem: 'shops',
  },
  {
    path: '/my-categories',
    title: 'MyCategories',
    name: 'mu-categories',
    icon: 'far fa-star',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/MyCategories')),
    roles: [2],
  },
  {
    path: '/my-category/:id',
    title: 'CategoryDetails',
    name: 'mycategoryDetails',
    icon: '',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/MyCategories/CategoryDetails')),
    roles: [2],
  },
  {
    path: '/my-sub-categories',
    title: 'MySubCategories',
    name: 'MySubCategories',
    icon: 'fas fa-tags',
    component: LoadableComponent(() => import('../../scenes/MySubCategories')),
    showInMenu: true,
    roles: [2],
  },
  {
    permission: 'News.List',
    title: 'News',
    name: 'news',
    icon: 'fas fa-shopping-cart',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/news',
    permission: 'News.List',
    title: 'News',
    name: 'news',
    icon: 'fas fa-shopping-cart',
    component: LoadableComponent(() => import('../../scenes/News')),
    baseMenuItem: 'news',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/news-categories',
    permission: 'NewsCategories.List',
    title: 'NewsCategories',
    name: 'newsCategories',
    icon: 'far fa-star',
    component: LoadableComponent(() => import('../../scenes/NewsCategories')),
    baseMenuItem: 'news',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/banner',
    permission: 'NewsCategories.List',
    title: 'Banners',
    name: 'Banners',
    icon: 'far fa-image',
    component: LoadableComponent(() => import('../../scenes/Banner')),
    showInMenu: true,
    roles: [0],
  },

  {
    path: '/salaryCount',
    permission: 'NewsCategories.List',
    title: 'SalaryCount',
    name: 'SalaryCount',
    icon: 'far fa-image',
    component: LoadableComponent(() => import('../../scenes/SalaryCount')),
    showInMenu: true,
    roles: [0],
  },

  {
    path: '/logout',
    permission: '',
    title: 'Logout',
    name: 'logout',
    showInMenu: false,
    component: LoadableComponent(() => import('../Logout')),
    roles: [0, 1, 2, 3],
  },
  {
    path: '/exception?:type',
    permission: '',
    title: 'exception',
    name: 'exception',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Exception')),
    roles: [0, 1, 2, 3],
  },
  {
    permission: 'Exercises.List',
    title: 'Health',
    name: 'health',
    icon: 'fas fa-briefcase-medical',
    showInMenu: true,
    roles: [0],
  },
  {
    permission: 'Exercises.List',
    path: '/exercise',
    title: 'Exercise',
    name: 'exercise',
    icon: 'fas fa-dumbbell',
    component: LoadableComponent(() => import('../../scenes/Exercise')),
    baseMenuItem: 'health',
    showInMenu: true,
    roles: [0],
  },
  {
    permission: 'Sessions.List',
    path: '/exercises-session',
    title: 'Sessions',
    name: 'sessions',
    icon: 'fas fa-clipboard-list',
    component: LoadableComponent(() => import('../../scenes/ExerciseSession')),
    baseMenuItem: 'health',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/health-questions',
    title: 'HealthQuestions',
    permission: 'Questions.List',
    name: 'HealthQuestions',
    baseMenuItem: 'health',
    icon: 'fas fa-question',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/HealthQuestions')),
    roles: [0],
  },
  {
    permission: 'FoodCategories.List',
    title: 'Food',
    name: 'food',
    icon: 'fas fa-utensils',
    showInMenu: true,
    roles: [0],
  },
  {
    permission: 'FoodCategories.List',
    path: '/food-categories',
    title: 'FoodCategories',
    name: 'foodCategories',
    icon: 'fas fa-star',
    component: LoadableComponent(() => import('../../scenes/FoodCategories')),
    baseMenuItem: 'food',
    showInMenu: true,
    roles: [0],
  },
  {
    permission: 'Dishes.List',
    path: '/food-dishes',
    title: 'FoodDishes',
    name: 'foodDishes',
    icon: 'fas fa-hamburger',
    component: LoadableComponent(() => import('../../scenes/FoodDishes')),
    baseMenuItem: 'food',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/food-recipe',
    title: 'FoodRecipes',
    permission: 'Recipes.List',
    name: 'foodRecipes',
    icon: 'fas fa-receipt',
    component: LoadableComponent(() => import('../../scenes/FoodRecipes')),
    baseMenuItem: 'food',
    showInMenu: true,
    roles: [0],
  },

  {
    permission: 'MyLife',
    title: 'MyLife',
    name: 'my-life',
    icon: 'fa fa-solid fa-star-of-life',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/stories',
    title: 'Stories',
    name: 'Stories',
    baseMenuItem: 'my-life',
    permission: 'MyLife.Stories',
    icon: 'fa fa-solid fa-book',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Stories')),
    roles: [0],
  },
  {
    path: '/quotes',
    title: 'Quotes',
    baseMenuItem: 'my-life',
    permission: 'MyLife.Quotes',
    name: 'quote',
    icon: 'fas fa-quote-left',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Quotes')),
    roles: [0],
  },

  {
    path: '/category/:id',
    permission: 'Categories.List',
    title: 'CategoryDetails',
    name: 'categoryDetails',
    icon: '',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Categories/CategoryDetails')),
    roles: [0],
  },
  {
    permission: 'Personality',
    title: 'Personality',
    name: 'personality',
    icon: 'fas fa-user',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/questions',
    title: 'Questions',
    permission: 'Questions.List',
    name: 'Question',
    baseMenuItem: 'personality',
    icon: 'fas fa-question',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Questions')),
    roles: [0],
  },
  {
    path: '/avatars',
    title: 'Avatars',
    permission: 'Avatars.List',
    name: 'Avatar',
    baseMenuItem: 'personality',
    icon: 'fas fa-images',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Avatars')),
    roles: [0],
  },
  {
    path: '/locations',
    permission: 'Locations.List',
    title: 'Locations',
    name: 'location',
    icon: 'fas fa-map-marker-alt',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/countries',
    title: 'Countries',
    permission: 'Locations.List',
    name: 'country',
    baseMenuItem: 'location',
    icon: 'fas fa-map-marker-alt',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Countries')),
    roles: [0],
  },
  {
    path: '/cities',
    title: 'Cities',
    permission: 'Locations.List',
    name: 'city',
    baseMenuItem: 'location',
    icon: 'fas fa-map-marker-alt',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Cities')),
    roles: [0],
  },
  {
    path: '/neighbourhoods',
    title: 'Neighbourhoods',
    permission: 'Locations.List',
    name: 'neighbourhood',
    baseMenuItem: 'location',
    icon: 'fas fa-map-marker-alt',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Neighbourhoods')),
    roles: [0],
  },
  {
    path: '/help-management',
    permission: 'Locations.List',
    title: 'HelpManagement',
    name: 'Help',
    icon: 'fas fa-boxes',
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/faqs',
    title: 'Faq',
    permission: 'Locations.List',
    name: 'Faq',
    baseMenuItem: 'Help',
    icon: 'fas fa-boxes',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Faqs')),
    roles: [0],
  },
  {
    path: '/about-us',
    title: 'AboutUs',
    permission: 'Locations.List',
    name: 'AboutUs',
    baseMenuItem: 'Help',
    icon: 'fas fa-boxes',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/AboutUs')),
    roles: [0],
  },
  {
    path: '/contact-us',
    title: 'ContactUs',
    permission: 'Locations.List',
    name: 'ContactUs',
    baseMenuItem: 'Help',
    icon: 'fas fa-boxes',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/ContactUs')),
    roles: [0],
  },
  {
    path: '/challenges',
    title: 'Challenges',
    permission: 'Challenges.List',
    name: 'challenge',
    icon: 'fas fa-infinity',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Challenges')),
    roles: [0],
  },

  {
    path: '/azkar',
    title: 'religionAzkar',
    permission: 'Azkar.List',
    name: 'religionAzkar',
    icon: 'fa fa-praying-hands',
    component: LoadableComponent(() => import('../../scenes/Azkar')),
    showInMenu: true,
    roles: [0],
  },

  {
    path: '/banks',
    title: 'Banks',
    permission: 'Indices.List',
    name: 'bank',
    icon: 'fas fa-university',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Banks')),
    roles: [0],
  },
  {
    path: '/notifications',
    title: 'Notifications',
    name: 'notifications',
    permission: 'Notifications.List',
    icon: 'fas fa-bell',
    showInMenu: true,
    roles: [0],
    component: LoadableComponent(() => import('../../scenes/Notifications')),
  },
  {
    path: '/special-emails',
    // permission: 'Products.List',
    title: 'SpecialEmails',
    name: 'SpecialEmails',
    icon: 'fas fa-envelope',
    component: LoadableComponent(() => import('../../scenes/SpecialEmails')),
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/configurations',
    // permission: 'Products.List',
    title: 'Configurations',
    name: 'configurations',
    icon: 'fas fa-cog',
    component: LoadableComponent(() => import('../../scenes/Configurations')),
    showInMenu: true,
    roles: [0],
  },
  {
    path: '/my-notifications',
    title: 'Notifications',
    name: 'notifications1',
    icon: 'fas fa-bell',
    showInMenu: false,
    roles: [1, 2, 3],
    component: LoadableComponent(() => import('../../scenes/MyNotifications')),
  },
];

export const routers = [...userRouter, ...appRouters];

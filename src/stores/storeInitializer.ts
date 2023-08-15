import RoleStore from './roleStore';
import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import CategoryStore from './categoryStore';
import AdminStore from './adminStore';
import LocationStore from './locationStore';
import ClassificationStore from './classificationStore';
import ClientStore from './clientStore';
import ProductStore from './productStore';
import OrderStore from './orderStore';
import EventStore from './eventStore';
import ShopStore from './shopStore';
import PromoterStore from './promoterStore';
import ShopManagerStore from './shopmanagerStore';
import IndexStore from './indexStore';
import NewsStore from './newsStore';
import OffersStore from './offersStore';
import PaymentStore from './paymentStore';
import CouponStore from './couponStore';
import SliderImageStore from './sliderImageStore';
import NewsCategoryStore from './newsCategoryStore';
import BannerStore from './bannerStore';
import ExerciseStore from './exerciseStore';
import FoodCategoryStore from './foodCategoryStore';
import AzkarStore from './AzkarStore';
import StoryStore from './storyStore';
import FoodDishesStore from './foodDishesStore';
import FoodRecipesStore from './foodRecipeStore';
import EventOrganizerStore from './eventOrganizerStore';
import EventCategoryStore from './eventCategoryStore';
import ChallengeStore from './ChallengeStore';
import QuestionStore from './QuestionStore';
import HealthQuestionStore from './HealthQuestionStore';
import AvatarStore from './AvatarStore';
import BundleStore from './BundleStore';
import NotificationStore from './NotificationStore';
import ConfigurationsStore from './configurationsStore';
import ReviewsStore from './reviewsStore';
import SalaryCountStore from './salaryCountStore';
import FaqStore from './faqStore';
import AboutUsStore from './aboutUsStore';
import ContactStore from './contactStore';

export default function initializeStores() {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    tenantStore: new TenantStore(),
    userStore: new UserStore(),
    exerciseStore: new ExerciseStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    categoryStore: new CategoryStore(),
    adminStore: new AdminStore(),
    locationStore: new LocationStore(),
    classificationStore: new ClassificationStore(),
    clientStore: new ClientStore(),
    productStore: new ProductStore(),
    orderStore: new OrderStore(),
    eventStore: new EventStore(),
    shopStore: new ShopStore(),
    reviewsStore: new ReviewsStore(),
    promoterStore: new PromoterStore(),
    shopManagerStore: new ShopManagerStore(),
    indexStore: new IndexStore(),
    newsStore: new NewsStore(),
    offersStore: new OffersStore(),
    paymentStore: new PaymentStore(),
    couponStore: new CouponStore(),
    sliderImageStore: new SliderImageStore(),
    newsCategoryStore: new NewsCategoryStore(),
    bannerStore: new BannerStore(),
    salaryCountStore: new SalaryCountStore(),
    foodCategoryStore: new FoodCategoryStore(),
    azkarStore: new AzkarStore(),
    storyStore: new StoryStore(),
    foodDishesStore: new FoodDishesStore(),
    foodRecipesStore: new FoodRecipesStore(),
    eventOrganizerStore: new EventOrganizerStore(),
    eventCategoryStore: new EventCategoryStore(),
    challengeStore: new ChallengeStore(),
    questionStore: new QuestionStore(),
    healthQuestionStore: new HealthQuestionStore(),
    avatarStore: new AvatarStore(),
    bundleStore: new BundleStore(),
    notificationStore: new NotificationStore(),
    configurationsStore: new ConfigurationsStore(),
    faqStore: new FaqStore(),
    aboutUsStore: new AboutUsStore(),
    contactStore: new ContactStore(),
  };
}

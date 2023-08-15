import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import ReviewsService from '../services/reviews/reviewsService';
import { ReviewsPagedFilterRequest } from '../services/reviews/dto/reviewsPagedFilterRequest';
import { ReviewDto } from '../services/reviews/dto/ReviewDto';

class ReviewsStore extends StoreBase {
 
  @observable reviews: Array<ReviewDto> = [];
 
  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable isGettingShopReviews = false;

  @observable keyword?: string = undefined;


  @action
  async getReviews(input: ReviewsPagedFilterRequest) {
        await this.wrapExecutionAsync(
            async () => {
                const result = await ReviewsService.getAll(input);
                this.reviews = result.items;
                this.totalCount = result.totalCount;
            },
            () => {
                this.isGettingShopReviews = true;
            },
            () => {
                this.isGettingShopReviews = false;
            }
        );
    }
}

export default ReviewsStore;

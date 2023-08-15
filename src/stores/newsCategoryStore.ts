import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import * as newsCategoryDto from '../services/newsCategory/dto/newsCategoryDto';
import newsCategoriesService from '../services/newsCategory/newsCategoriesService';
import { notifySuccess } from '../lib/notifications';
import * as createNewsCategoryDto from '../services/newsCategory/dto/createNewsCategoryDto';
import * as updateNewsCategoryDto from '../services/newsCategory/dto/updateNewsCategoryDto';
import { EntityDto } from '../services/dto/entityDto';
import * as pagedFilterAndSortedRequest from '../services/dto/pagedFilterAndSortedRequest';

class NewsCategoryStore extends StoreBase {
  @observable newsCategories: Array<newsCategoryDto.NewsCategoryDto> = [];

  @observable loadingCategories = true;

  @observable isSubmittingCategory = false;

  @observable maxResultCount = 4;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable categoryModel?: newsCategoryDto.NewsCategoryDto = undefined;

  @observable statusFilter?: number = undefined;

  @observable keyword?: string = undefined;

  @observable isSortingItems = false;

  @action
  async getNewsCategories(input: pagedFilterAndSortedRequest.PagedFilterAndSortedRequest) {
    await this.wrapExecutionAsync(
      async () => {
        const result = await newsCategoriesService.getAll(input);
        this.newsCategories = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingCategories = true;
      },
      () => {
        this.loadingCategories = false;
      }
    );
  }

  @action
  async createNewsCategory(input: createNewsCategoryDto.CreateNewsCategoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await newsCategoriesService.createNewsCategory(input);
        await this.getNewsCategories({maxResultCount:this.maxResultCount,skipCount:this.skipCount});
        notifySuccess();
      },
      () => {
        this.isSubmittingCategory = true;
      },
      () => {
        this.isSubmittingCategory = false;
      }
    );
  }

  @action
  async updateNewsCategory(input: updateNewsCategoryDto.UpdateNewsCategoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await newsCategoriesService.updateNewsCategory(input);
        await this.getNewsCategories({maxResultCount:this.maxResultCount,skipCount:this.skipCount});
        notifySuccess();
      },
      () => {
        this.isSubmittingCategory = true;
      },
      () => {
        this.isSubmittingCategory = false;
      }
    );
  }

  @action
  async getNewsCategory(input: EntityDto) {
    const category = await newsCategoriesService.getNewsCategory(input);
    if (category !== undefined) {
      this.categoryModel = {
        id: category.id,
        isActive: category.isActive,
        arName: category.arName,
        enName: category.enName,
        name: category.name,
        createdBy: category.createdBy,
        creationTime: category.creationTime,
        newsCount: category.newsCount,
        imageUrl: category.imageUrl,
      };
    }
  }

  @action
  async newsCategoryActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await newsCategoriesService.newsCategoryActivation(input);
        await this.getNewsCategories({maxResultCount:this.maxResultCount,skipCount:this.skipCount});
        notifySuccess();
      },
      () => {
        this.loadingCategories = true;
      },
      () => {
        this.loadingCategories = false;
      }
    );
  }

  @action
  async newsCategoryDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await newsCategoriesService.newsCategoryDeactivation(input);
        await this.getNewsCategories({maxResultCount:this.maxResultCount,skipCount:this.skipCount});
        notifySuccess();
      },
      () => {
        this.loadingCategories = true;
      },
      () => {
        this.loadingCategories = false;
      }
    );
  }
}

export default NewsCategoryStore;

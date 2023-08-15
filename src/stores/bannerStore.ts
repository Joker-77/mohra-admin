import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { BannerDto } from '../services/banner/dto/bannerDto';
import bannerService from '../services/banner/bannerService';
import { notifySuccess } from '../lib/notifications';
import { CreateBannerDto } from '../services/banner/dto/createBannerDto';
import { UpdateBannerDto } from '../services/banner/dto/updateBannerDto';
import { EntityDto } from '../services/dto/entityDto';

class BannerStore extends StoreBase {
  @observable banner: Array<BannerDto> = [];

  @observable loadingbanners = true;

  @observable isSubmittingBanner = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable bannerModel?: BannerDto = undefined;

  @observable statusFilter?: number = undefined;

  @observable keyword?: string = undefined;

  @observable isSortingItems = false;

  @action
  async getBanners() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await bannerService.getAll();
        console.log("this.banner");
        console.log(this.banner);
        this.banner = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingbanners = true;
      },
      () => {
        this.loadingbanners = false;
      }
    );
  }

  @action
  async createBanner(input: CreateBannerDto) {
    await this.wrapExecutionAsync(
      async () => {
        await bannerService.createBanner(input);
        await this.getBanners();
        notifySuccess();
      },
      () => {
        this.isSubmittingBanner = true;
      },
      () => {
        this.isSubmittingBanner = false;
      }
    );
  }

  @action
  async updateBanner(input: UpdateBannerDto) {
    await this.wrapExecutionAsync(
      async () => {
        await bannerService.updateBanner(input);
        await this.getBanners();
        notifySuccess();
      },
      () => {
        this.isSubmittingBanner = true;
      },
      () => {
        this.isSubmittingBanner = false;
      }
    );
  }

  @action
  async getBanner(input: EntityDto) {
    const banner = await bannerService.getBanner(input);
    console.log("getBanner");
    console.log(banner);
    if (banner !== undefined) {
      this.bannerModel = {
        id: banner.id,
        arTitle: banner.arTitle,
        enTitle: banner.enTitle,
        arDescriptions: banner.arDescriptions,
        enDescriptions: banner.enDescriptions,
        image: banner.image,
        target: banner.target,
        externalLink: banner.externalLink,
        targetId: banner.targetId,
        isActive: banner.isActive,
        displayOrder: banner.displayOrder,
      };
    }
  }

  @action
  async bannerActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await bannerService.bannerActivation(input);
        await this.getBanners();
        notifySuccess();
      },
      () => {
        this.loadingbanners = true;
      },
      () => {
        this.loadingbanners = false;
      }
    );
  }

  @action
  async bannerDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await bannerService.bannerDeactivation(input);
        await this.getBanners();
        notifySuccess();
      },
      () => {
        this.loadingbanners = true;
      },
      () => {
        this.loadingbanners = false;
      }
    );
  }

  @action
  async deleteBanner(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await bannerService.deleteBanner(input);
        notifySuccess();
      },
      () => {
        this.loadingbanners = true;
      },
      () => {
        this.loadingbanners = false;
      }
    );
  }
}

export default BannerStore;

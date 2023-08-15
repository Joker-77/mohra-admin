import { action, observable } from "mobx";
import * as dto from "../services/faqs/dto/FaqDto";
import StoreBase from "./storeBase";
import faqService from "../services/faqs/faqService";
import { notifySuccess } from "../lib/notifications";
import { EntityDto } from "../services/dto/entityDto";

class FaqStore extends StoreBase {
  @observable faqs: Array<dto.FaqDto> = [];

  @observable loadingFaqs = true;

  @observable isSubmittingFaq = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable faqModel?: dto.FaqDto = undefined;

  @observable isActiveFilter?: boolean = undefined;

  @observable keyword?: string = undefined;

  @action
  async getAll(type: number): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        const result = await faqService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          type,
          isActive: this.isActiveFilter,
        });
        this.faqs = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingFaqs = true;
      },
      () => {
        this.loadingFaqs = false;
      }
    );
  }

  @action
  async createFaq(input: dto.CreateFaqDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await faqService.createFaq(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingFaq = true;
      },
      () => {
        this.isSubmittingFaq = false;
      }
    );
  }

  @action
  async updateFaq(input: dto.UpdateFaqDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await faqService.updateFaq(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingFaq = true;
      },
      () => {
        this.isSubmittingFaq = false;
      }
    );
  }

  @action
  async getFaq(input: EntityDto): Promise<void> {
    const item = this.faqs.find((c) => c.id === input.id);
    if (item !== undefined) {
      this.faqModel = {
        arAnswer: item.arAnswer,
        arQuestion: item.arQuestion,
        enAnswer: item.enAnswer,
        enQuestion: item.enQuestion,
        id: item.id,
        isActive: item.isActive,
        order: item.order,
      };
    }
  }

  @action
  async faqActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await faqService.faqActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingFaqs = true;
      },
      () => {
        this.loadingFaqs = false;
      }
    );
  }

  @action
  async faqDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await faqService.faqDeactivation(input);
        notifySuccess();
      },
      () => {
        this.loadingFaqs = true;
      },
      () => {
        this.loadingFaqs = false;
      }
    );
  }

  @action
  async faqDelete(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await faqService.faqDelete(input);
        notifySuccess();
      },
      () => {
        this.loadingFaqs = true;
      },
      () => {
        this.loadingFaqs = false;
      }
    );
  }
}

export default FaqStore;
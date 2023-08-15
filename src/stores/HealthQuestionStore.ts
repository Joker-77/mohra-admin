import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { CreateOrUpdateHealthQuestionDto, HealthQuestionDto } from '../services/healthquestions/dto';
import healthQuestionsService from '../services/healthquestions/healthQuestionsService';

class HealthQuestionStore extends StoreBase {
  @observable healthQuestions: Array<HealthQuestionDto> = [];

  @observable loadingHealthQuestions = true;

  @observable isSubmittingHealthQuestion = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable keyword?: string = undefined;

  @observable totalCount = 0;

  @observable sorting?: string = undefined;

  @observable healthQuestionModel?: HealthQuestionDto = undefined;

  @observable IsActive?: boolean = undefined;

  @action
  async getHealthQuestions() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await healthQuestionsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          IsActive: this.IsActive,
          Sorting: this.sorting,
          keyword: this.keyword,
        });
        this.healthQuestions = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingHealthQuestions = true;
      },
      () => {
        this.loadingHealthQuestions = false;
      }
    );
  }

  @action
  async createHealthQuestion(input: CreateOrUpdateHealthQuestionDto) {
    await this.wrapExecutionAsync(
      async () => {
        await healthQuestionsService.createHealthQuestion(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingHealthQuestion = true;
      },
      () => {
        this.isSubmittingHealthQuestion = false;
      }
    );
  }

  @action
  async updateHealthQuestion(input: CreateOrUpdateHealthQuestionDto) {
    await this.wrapExecutionAsync(
      async () => {
        await healthQuestionsService.updateHealthQuestion(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingHealthQuestion = true;
      },
      () => {
        this.isSubmittingHealthQuestion = false;
      }
    );
  }

  @action
  async getHealthQuestionById(input: EntityDto) {
    const healthQuestion = await healthQuestionsService.getHealthQuestionById(input);
    if (healthQuestion !== undefined) {
      this.healthQuestionModel = healthQuestion;
    }
  }

  @action
  async healthQuestionActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await healthQuestionsService.healthQuestionActivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingHealthQuestion = true;
      },
      () => {
        this.isSubmittingHealthQuestion = false;
      }
    );
  }

  @action
  async healthQuestionDeActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await healthQuestionsService.healthQuestionDeactivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingHealthQuestion = true;
      },
      () => {
        this.isSubmittingHealthQuestion = false;
      }
    );
  }

  @action
  async healthQuestionDelete(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await healthQuestionsService.healthQuestionDelete(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingHealthQuestion = true;
      },
      () => {
        this.isSubmittingHealthQuestion = false;
      }
    );
  }
}

export default HealthQuestionStore;

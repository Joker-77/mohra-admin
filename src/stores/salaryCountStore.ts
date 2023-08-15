import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { notifySuccess } from '../lib/notifications';
import { EntityDto } from '../services/dto/entityDto';
import salaryCountService from '../services/salaryCount/salaryCountService';
import { SalaryCountDto } from '../services/salaryCount/dto/salaryCountDto';
import { CreateSalaryCountDto } from '../services/salaryCount/dto/createSalaryCountDto';
import { UpdateSalaryCountDto } from '../services/salaryCount/dto/updateSalaryCountDto';

class SalaryCountStore extends StoreBase {
    @observable salaryCount: Array<SalaryCountDto> = [];

    @observable loadingsalaryCounts = true;

    @observable isSubmittingsalaryCount = false;

    @observable maxResultCount = 4;

    @observable skipCount = 0;

    @observable totalCount = 0;

    salaryCountModel?: SalaryCountDto = undefined;

    @observable statusFilter?: number = undefined;
    @observable isActiveFilter?: boolean = undefined;

    @observable keyword?: string = undefined;

    @observable isSortingItems = false;

    @action
    async getsalaryCounts() {
        await this.wrapExecutionAsync(
            async () => {
                const result = await salaryCountService.getAll({
                    skipCount: this.skipCount,
                    maxResultCount: this.maxResultCount,
                    //keyword: this.keyword,
                   // sorting:'CreationTime',
                   //isActive: this.isActiveFilter,
                });
                this.salaryCount = result.items;
                this.totalCount = result.totalCount;
            },
            () => {
                this.loadingsalaryCounts = true;
            },
            () => {
                this.loadingsalaryCounts = false;
            }
        );
    }

    @action
    async createSalaryCount(input: CreateSalaryCountDto) {
        debugger;
        await this.wrapExecutionAsync(
            async () => {
                await salaryCountService.createSalaryCount(input);
                await this.getsalaryCounts();
                notifySuccess();
            },
            () => {
                this.isSubmittingsalaryCount = true;
            },
            () => {
                this.isSubmittingsalaryCount = false;
            }
        );
    }

    @action
    async updateSalaryCount(input: UpdateSalaryCountDto) {
        await this.wrapExecutionAsync(
            async () => {
                await salaryCountService.updateSalaryCount(input);
                await this.getsalaryCounts();
                notifySuccess();
            },
            () => {
                this.isSubmittingsalaryCount = true;
            },
            () => {
                this.isSubmittingsalaryCount = false;
            }
        );
    }

    @action
    async getSalaryCount(input: EntityDto) {
        debugger;
        const salaryCount = await salaryCountService.getSalaryCount(input);
        if (salaryCount !== undefined) {
            debugger;
            this.salaryCountModel = {
                id: salaryCount.id,
                arTitle: salaryCount.arTitle,
                enTitle: salaryCount.enTitle,
                order: salaryCount.order,
                date: salaryCount.date,
                note: salaryCount.note,
                isActive: salaryCount.isActive,
                repeatedMode: salaryCount.repeatedMode
            };
        }
    }

    @action
    async salaryCountActivation(input: EntityDto): Promise<void> {
        await this.wrapExecutionAsync(
            async () => {
                await salaryCountService.salaryCountActivation(input);
                await this.getsalaryCounts();
                notifySuccess();
            },
            () => {
                this.loadingsalaryCounts = true;
            },
            () => {
                this.loadingsalaryCounts = false;
            }
        );
    }

    @action
    async salaryCountDeactivation(input: EntityDto): Promise<void> {
        await this.wrapExecutionAsync(
            async () => {
                await salaryCountService.salaryCountDeactivation(input);
                await this.getsalaryCounts();
                notifySuccess();
            },
            () => {
                this.loadingsalaryCounts = true;
            },
            () => {
                this.loadingsalaryCounts = false;
            }
        );
    }

    @action
    async deleteSalaryCount(input: EntityDto) {
        await this.wrapExecutionAsync(
            async () => {
                await salaryCountService.deleteSalaryCount(input);
                notifySuccess();
            },
            () => {
                this.loadingsalaryCounts = true;
            },
            () => {
                this.loadingsalaryCounts = false;
            }
        );
    }
}

export default SalaryCountStore;

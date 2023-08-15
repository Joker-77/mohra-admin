import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import * as adminDto from '../services/admins/dto/adminDto';
import adminsService from '../services/admins/adminsService';
import * as createAdminDto from '../services/admins/dto/createAdminDto';
import * as updateAdminDto from '../services/admins/dto/updateAdminDto';
import userService from '../services/user/userService';

class AdminStore extends StoreBase {
  @observable admins: Array<adminDto.AdminDto> = [];
  @observable loadingAdmins = true;
  @observable AdminsForExport: Array<adminDto.AdminDto> = [];
  @observable loadingAdminsForExport = true;
  @observable isSubmittingAdmin = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable adminModel?: adminDto.AdminDto = undefined;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable filterChosenDate?: number = 0;
  @observable filterFromDate?: string = undefined;
  @observable filterToDate?: string = undefined;

  @action
  async getAdminsForExport() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await adminsService.getAll({
          skipCount: 0,
          maxResultCount: 20,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
          filterChosenDate: this.filterChosenDate,
          filterFromDate: this.filterFromDate,
          filterToDate: this.filterToDate,
        });
        this.AdminsForExport = result.items;
      },
      () => {
        this.loadingAdminsForExport = true;
      },
      () => {
        this.loadingAdminsForExport = false;
      }
    );
  }
  @action
  async getAdmins() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await adminsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
          filterChosenDate: this.filterChosenDate,
          filterFromDate: this.filterFromDate,
          filterToDate: this.filterToDate,
        });
        this.admins = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingAdmins = true;
      },
      () => {
        this.loadingAdmins = false;
      }
    );
  }

  @action
  async createAdmin(input: createAdminDto.CreateAdminDto) {
    await this.wrapExecutionAsync(
      async () => {
        await adminsService.createAdmin(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAdmin = true;
      },
      () => {
        this.isSubmittingAdmin = false;
      }
    );
  }

  @action
  async updateAdmin(input: updateAdminDto.UpdateAdminDto) {
    await this.wrapExecutionAsync(
      async () => {
        await adminsService.updateAdmin(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAdmin = true;
      },
      () => {
        this.isSubmittingAdmin = false;
      }
    );
  }

  @action
  async getAdmin(input: EntityDto) {
    let admin = this.admins.find((c) => c.id === input.id);
    if (admin !== undefined) {
      this.adminModel = {
        id: admin.id,
        name: admin.name,
        status: admin.status,
        emailAddress: admin.emailAddress,
        surname: admin.surname,
        fullName: admin.fullName,
        creationTime: admin.creationTime,
        lastLoginTime: admin.lastLoginTime,
        permissions: admin.permissions,
      };
    }
  }

  @action
  async deleteAdmin(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await adminsService.deleteAdmin(input);
        notifySuccess();
      },
      () => {
        this.loadingAdmins = true;
      },
      () => {
        this.loadingAdmins = false;
      }
    );
  }

  @action
  async adminActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await userService.userActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingAdmins = true;
      },
      () => {
        this.loadingAdmins = false;
      }
    );
  }
  @action
  async adminDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await userService.userDeactivation(input);
        notifySuccess();
      },
      () => {
        this.loadingAdmins = true;
      },
      () => {
        this.loadingAdmins = false;
      }
    );
  }
}

export default AdminStore;

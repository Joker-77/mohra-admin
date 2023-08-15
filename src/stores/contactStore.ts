import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import * as dto from '../services/contactUs/dto/contactDto';
import contactService from '../services/contactUs/contactService';

class ContactStore extends StoreBase {
  @observable contacts: Array<dto.ContactDto> = [];

  @observable loadingContacts = true;

  @observable isSubmittingContacts = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable contactModel?: dto.ContactDto = undefined;

  @observable isActiveFilter?: boolean = undefined;

  @observable keyword?: string = undefined;

  @action
  async getAll(): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        const result = await contactService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
        });
        this.contacts = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingContacts = true;
      },
      () => {
        this.loadingContacts = false;
      }
    );
  }

  @action
  async createContact(input: dto.CreateContactDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await contactService.createContact(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingContacts = true;
      },
      () => {
        this.isSubmittingContacts = false;
      }
    );
  }

  @action
  async updateContact(input: dto.UpdateContactDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await contactService.updateContact(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingContacts = true;
      },
      () => {
        this.isSubmittingContacts = false;
      }
    );
  }

  @action
  async getContact(input: EntityDto): Promise<void> {
    const contactItem = this.contacts.find((c) => c.id === input.id);
    if (contactItem !== undefined) {
      this.contactModel = {
        id: contactItem.id,
        clientId: contactItem.clientId,
        client: contactItem.client,
        name: contactItem.name,
        phoneNumber: contactItem.phoneNumber,
        email: contactItem.email,
        message: contactItem.message,
        type: contactItem.type,
        creationTime: contactItem.creationTime,
      };
    }
  }

  @action
  async contactActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await contactService.contactActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingContacts = true;
      },
      () => {
        this.loadingContacts = false;
      }
    );
  }

  @action
  async contactDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await contactService.contactDeactivation(input);
        notifySuccess();
      },
      () => {
        this.loadingContacts = true;
      },
      () => {
        this.loadingContacts = false;
      }
    );
  }

  @action
  async contactDelete(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await contactService.contactDelete(input);
        notifySuccess();
      },
      () => {
        this.loadingContacts = true;
      },
      () => {
        this.loadingContacts = false;
      }
    );
  }
}

export default ContactStore;

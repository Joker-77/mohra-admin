import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { notifySuccess } from '../lib/notifications';
import { EntityDto } from '../services/dto/entityDto';
import * as dto from '../services/aboutUs/dto/AboutUsDto';
import aboutUsService from '../services/aboutUs/aboutUsService';

class AboutUsStore extends StoreBase {
  @observable loadingAbouts = true;

  @observable isSubmittingAbout = false;

  @observable aboutUsId: number = 0;

  @observable aboutUsModel?: dto.AboutUsDto = undefined;
  

  @action
  async updateAboutUs(input: dto.AboutUsRequestDto) {
    await this.wrapExecutionAsync(
      async () => {
        const about = await aboutUsService.updateAbout(input);
        this.aboutUsId = about.id;
        this.aboutUsModel = {
          id: about.id,
          arTitle: about.arTitle,
          enTitle: about.enTitle,
          arContent: about.arContent,
          enContent: about.enContent,
          isActive: about.isActive,
        };
        notifySuccess();
      },
      () => {
        this.isSubmittingAbout = true;
      },
      () => {
        this.isSubmittingAbout = false;
      }
    );
  }

  @action
  async getAboutUs(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        const about = await aboutUsService.getAbout(input);
        if (about !== undefined) {
          this.aboutUsId = about.id;
          this.aboutUsModel = {
            id: about.id,
            arTitle: about.arTitle,
            enTitle: about.enTitle,
            arContent: about.arContent,
            enContent: about.enContent,
            isActive: about.isActive,
          };
        }
      },
      () => { 
        this.isSubmittingAbout = true;
      },
      () => {
        this.isSubmittingAbout = false;
      }
    );
  }
  
}

export default AboutUsStore;

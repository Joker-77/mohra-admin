/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { EntityDto } from '../dto/entityDto';
import { AboutUsDto } from './dto/AboutUsDto';
import { AboutUsRequestDto } from './dto/AboutUsDto';

class AboutUsService {
  public async getAbout(input: EntityDto): Promise<AboutUsDto> {
    const result = await http.get('/api/services/app/About/Get', {
      params: { id: input.id },
    });
    return result.data.result;
  }
  
  public async updateAbout(input: AboutUsRequestDto): Promise<AboutUsDto> {
    const result = await http.put('api/services/app/About/Update', input);
    console.log("inputBanner");
    console.log(input);
    console.log(result.data);
    return result.data;
  }
}

export default new AboutUsService();

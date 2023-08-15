/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { BannerDto } from './dto/bannerDto';
import { CreateBannerDto } from './dto/createBannerDto';
import { UpdateBannerDto } from './dto/updateBannerDto';
import { EntityDto } from '../dto/entityDto';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';

class NewsCategoriesService {
  public async getAll(
    input?: PagedFilterAndSortedRequest
  ): Promise<PagedResultDto<BannerDto>> {
    const result = await http.get('api/services/app/Banner/GetAll', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        isActive: input?.isActive,
        keyword: input?.keyword,
        advancedSearchKeyword: input?.advancedSearchKeyword,
        Sorting: input?.sorting,
      },
    });
    console.log("Banner");
    console.log(result.data.result);
    return result.data.result;
  }

  public async getBanner(input: EntityDto): Promise<BannerDto> {
    const result = await http.get('/api/services/app/Banner/Get', {
      params: { id: input.id },
    });
    console.log("Banner");
    console.log(result.data.result);
    return result.data.result;
  }

  public async createBanner(input: CreateBannerDto): Promise<BannerDto> {
    const result = await http.post('api/services/app/Banner/Create', input);
    return result.data;
  }

  public async updateBanner(input: UpdateBannerDto): Promise<BannerDto> {
    const result = await http.put('api/services/app/Banner/Update', input);
    console.log("inputBanner");
    console.log(input);
    console.log(result.data);
    return result.data;
  }

  public async bannerDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Banner/DeActivate', input);
    return result.data;
  }

  public async bannerActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Banner/Activate', input);
    return result.data;
  }

  public async deleteBanner(input: EntityDto) {
    let result = await http.delete('api/services/app/Banner/Delete', { params: { id: input.id } });
    return result.data;
  }
}

export default new NewsCategoriesService();

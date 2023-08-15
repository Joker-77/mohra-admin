/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import { SalaryCountDto } from './dto/salaryCountDto';
import { CreateSalaryCountDto } from './dto/createSalaryCountDto';
import { UpdateSalaryCountDto } from './dto/updateSalaryCountDto';
import moment from 'moment';


class SalaryCountService {
  public async getAll(
    input?: PagedFilterAndSortedRequest
  ): Promise<PagedResultDto<SalaryCountDto>> {
    const result = await http.get('api/services/app/TimeTable/GetAllTimeTableForClient', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        isActive: input?.isActive,
        keyword: input?.keyword,
        advancedSearchKeyword: input?.advancedSearchKeyword,
        Sorting: input?.sorting,
      },
    });
    return result.data.result;
  }

  public async getSalaryCount(input: EntityDto): Promise<SalaryCountDto> {
    const result = await http.get('/api/services/app/TimeTable/Get', {
      params: { id: input.id },
    });
    return result.data.result;
  }

  public async createSalaryCount(input: CreateSalaryCountDto): Promise<SalaryCountDto> {
    debugger;
    input.date = moment(input.date).startOf('day').toDate();
    const result = await http.post('api/services/app/TimeTable/Create', input);
    return result.data;
  }

  public async updateSalaryCount(input: UpdateSalaryCountDto): Promise<SalaryCountDto> {
    const result = await http.put('api/services/app/TimeTable/Update', input);
    return result.data;
  }

  public async salaryCountDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/TimeTable/DeActivate', input);
    return result.data;
  }

  public async salaryCountActivation(input: EntityDto) {
    const result = await http.put('api/services/app/TimeTable/Activate', input);
    return result.data;
  }

  public async deleteSalaryCount(input: EntityDto) {
    let result = await http.delete('api/services/app/TimeTable/Delete', { params: { id: input.id } });
    return result.data;
  }
}

export default new SalaryCountService();

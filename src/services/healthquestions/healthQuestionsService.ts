/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { CreateOrUpdateHealthQuestionDto, HealthQuestionDto, HealthQuestionPagedResultDto } from './dto';

class HealthQuestionsService {
  public async getAll(input: HealthQuestionPagedResultDto): Promise<PagedResultDto<HealthQuestionDto>> {
    const { skipCount, maxResultCount, keyword, IsActive, Sorting } = input || {};
    const result = await http.get('/api/services/app/HealthProfileQuestion/GetAll', {
      params: {
        skipCount,
        maxResultCount,
        IsActive,
        keyword,
        Sorting,
      },
    });
    return result.data.result;
  }

  public async getAllLite(input?: HealthQuestionPagedResultDto): Promise<PagedResultDto<LiteEntityDto>> {
    const { skipCount, maxResultCount, keyword, IsActive } = input || {};
    const result = await http.get('api/services/app/HealthProfileQuestion/GetAllLite', {
      params: {
        skipCount,
        keyword,
        maxResultCount,
        IsActive,
      },
    });
    return result.data.result;
  }

  public async getHealthQuestionById(input: EntityDto): Promise<HealthQuestionDto> {
    const result = await http.get('api/services/app/HealthProfileQuestion/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createHealthQuestion(input: CreateOrUpdateHealthQuestionDto): Promise<HealthQuestionDto> {
    const result = await http.post('api/services/app/HealthProfileQuestion/Create', input);
    console.log("questioninputcreate");
    console.log(input);
    return result.data;
  }

  public async updateHealthQuestion(input: CreateOrUpdateHealthQuestionDto): Promise<HealthQuestionDto> {
    const result = await http.put('api/services/app/HealthProfileQuestion/Update', input);
    console.log("questioninput");
    console.log(input);
    return result.data;
  }

  public async healthQuestionActivation(input: EntityDto) {
    const result = await http.put('api/services/app/HealthProfileQuestion/Activate', { id: input.id });
    return result.data;
  }

  public async healthQuestionDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/HealthProfileQuestion/DeActivate', { id: input.id });
    return result.data;
  }

  public async healthQuestionDelete(input: EntityDto) {
    const result = await http.delete('api/services/app/HealthProfileQuestion/Delete', {
      params: { id: input.id },
    });
    return result.data;
  }
}

export default new HealthQuestionsService();

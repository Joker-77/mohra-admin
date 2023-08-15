import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import {
  AnswerOutPutDto,
  AppointmentDto,
  ClientDto,
  ClientPagedFilterRequest,
  DailySessionDto,
  HealthProfileAnswerDto,
  LifeDreamDto,
  MomentDto,
  PositiveHabitDto,
  ToDoTaskDto,
  TotalFriendsDto,
  SalaryCountsDto,
  AuthSessionDto,
  HealthProfileInfoDto
} from './dto/clientDto';
import { AdminPagedFilterRequest } from '../admins/dto/adminPagedFilterRequest';
import { CreateClientDto } from './dto/createClientDto';
import { UpdateClientDto } from './dto/updateClientDto';
import { LiteEntityDto } from '../dto/liteEntityDto';
import { ChallengeDto } from '../challenges/dto';
import { EventDto } from '../events/dto/eventDto';

class ClientsService {
  public async getAll(input: AdminPagedFilterRequest): Promise<PagedResultDto<ClientDto>> {
    let result = await http.get('api/services/app/Client/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        Sorting : input.Sorting,
        isActive: input.isActive,
        keyword: input.keyword,
        filterChosenDate: input.filterChosenDate,
        filterFromDate: input.filterFromDate,
        filterToDate: input.filterToDate,
      },
    });
    return result.data.result;
  }
  public async getAllLite(input?: AdminPagedFilterRequest): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Client/GetAllLite', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        isActive: input?.isActive,
      },
    });
    return result.data.result;
  }
  public async getShopFollowers(input?: Number): Promise<PagedResultDto<ClientDto>> {
    let result = await http.get('api/services/app/Client/GetClientsFollowedShop?ShopId=' + input);
    return result.data.result;
  }

  public async getClient(input: EntityDto): Promise<ClientDto> {
    let result = await http.get('api/services/app/Client/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async getHealthProfileAnswers(input: EntityDto): Promise<Array<HealthProfileAnswerDto>> {
    let result = await http.get('api/services/app/HealthProfile/GetHealthProfileAnswers', {
      params: { clientId: input.id },
    });
    return result.data.result;
  }

  public async getHealthProfileInfo(input: EntityDto): Promise<HealthProfileInfoDto> {
    let result = await http.get(`api/services/app/HealthProfile/GetHealthProfileInfoAdmin?clientId=${input.id}`);
    return result.data.result;
  }

  public async getPersonalityAnswers(input: EntityDto): Promise<Array<AnswerOutPutDto>> {
    let result = await http.get('api/services/app/Question/GetPersonalityAnswers', {
      params: { clientId: input.id },
    });
    return result.data.result;
  }

  public async createClient(input: CreateClientDto): Promise<ClientDto> {
    let result = await http.post('api/services/app/Client/Create', input);
    return result.data.result;
  }

  public async updateClient(input: UpdateClientDto): Promise<ClientDto> {
    let result = await http.put('api/services/app/Client/Update', input);
    return result.data.result;
  }

  public async getChallenges(
    input: ClientPagedFilterRequest
  ): Promise<PagedResultDto<ChallengeDto>> {
    let result = await http.get('api/services/app/Challenge/GetClientChallenges', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }

  public async getEvents(input: ClientPagedFilterRequest): Promise<PagedResultDto<EventDto>> {
    let result = await http.get('api/services/app/Client/GetUserEvents', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }

  public async getToDoList(input: ClientPagedFilterRequest): Promise<PagedResultDto<ToDoTaskDto>> {
    let result = await http.get('api/services/app/Client/GetUserToDoList', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }

  public async getAppointments(
    input: ClientPagedFilterRequest
  ): Promise<PagedResultDto<AppointmentDto>> {
    let result = await http.get('api/services/app/Client/GetUserAppointementList', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }

  public async getPositiveHabit(
    input: ClientPagedFilterRequest
  ): Promise<PagedResultDto<PositiveHabitDto>> {
    let result = await http.get('api/services/app/Client/GetUserLifePositiveHabitsList', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }

  public async getLifeDreams(
    input: ClientPagedFilterRequest
  ): Promise<PagedResultDto<LifeDreamDto>> {
    let result = await http.get('api/services/app/Client/GetUserLifeDreamList', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }

  public async getFriends(
    input: ClientPagedFilterRequest
  ): Promise<PagedResultDto<TotalFriendsDto>> {
    let result = await http.get('api/services/app/Client/GetFriendsList', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }

  public async getSalaryCounts(
    input: ClientPagedFilterRequest
  ): Promise<PagedResultDto<SalaryCountsDto>> {
    let result = await http.get('api/services/app/TimeTable/GetAllTimeTableForClient', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }
  
  public async getAuthSession(
    clientId: number
  ): Promise<PagedResultDto<AuthSessionDto>> {
    let result = await http.get(`/api/services/app/User/GetAudit?userId=${clientId}`);
    return result.data.result;
  }

  public async getDishes(input: ClientPagedFilterRequest): Promise<PagedResultDto<any>> {
    let result = await http.get('api/services/app/Client/GetUserDailyDishes', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }
  public async getSessions(
    input: ClientPagedFilterRequest
  ): Promise<PagedResultDto<DailySessionDto>> {
    let result = await http.get('api/services/app/DailySession/GetAll', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }
  public async getMoments(input: ClientPagedFilterRequest): Promise<PagedResultDto<MomentDto>> {
    let result = await http.get('api/services/app/Client/GetUserMoments', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }

  public async deleteClient(input: EntityDto) {
    let result = await http.delete('api/services/app/Client/Delete', { params: { id: input.id } });
    return result.data;
  }

}

export default new ClientsService();

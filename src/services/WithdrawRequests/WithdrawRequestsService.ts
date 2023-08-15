/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { WithdrawPagedFilterRequest } from './dto/WithdrawPagedFilterRequest';
import { WithdrawRequestsDto } from './dto/WithdrawRequestsDto';
import { changeWithdrawToApprovedDto } from './dto/changeWithdrawToApprovedDto';

class WithdrawRequestsService {


  public async getAll(input: WithdrawPagedFilterRequest): Promise<PagedResultDto<WithdrawRequestsDto>> {
    const result = await http.get('api/services/app/TicketTicket/GetAllWithdrawRequests', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        status: input.status,
        keyword: input.keyword,
        categoryId: input.categoryId,
        Sorting: input.Sorting,
        OnlyMyEvents: input.OnlyMyEvents,
        expired: input.expired,
        running: input.running,
        parentId: input.parentId,
      },
    });
    return result.data.result;
  }


  public async changeWithdrawToApproved(input: changeWithdrawToApprovedDto): Promise<boolean> {
    const result = await http.post('api/services/app/TicketTicket/ChangeWithdrawToApproved', input);
    return result.data.result;
  }


  // public async getAllLite(input?: EventsPagedFilterRequest): Promise<PagedResultDto<LiteEntityDto>> {
  //   const result = await http.get('/api/services/app/TicketTicket/GetAllWithdrawRequests', {
  //     params: {
  //       skipCount: input?.skipCount,
  //       maxResultCount: input?.maxResultCount,
  //       type: input?.type,
  //       status: input?.status,
  //       organizerId: input?.organizerId,
  //     },
  //   });
  //   return result.data.result;
  // }




}

export default new WithdrawRequestsService();

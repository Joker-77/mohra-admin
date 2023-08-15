import { EntityDto } from "../dto/entityDto";
import { PagedResultDto } from "../dto/pagedResultDto";
import http from "../httpService";
import { CreateFaqDto, FaqDto, FaqPagedFilterAndSortedRequest, UpdateFaqDto } from "./dto/FaqDto";

class FaqService {

    public async getAll(input: FaqPagedFilterAndSortedRequest): Promise<PagedResultDto<FaqDto>> {
        const result = await http.get('api/services/app/FAQ/GetAll', {
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

    public async createFaq(input: CreateFaqDto): Promise<FaqDto> {
        const result = await http.post('api/services/app/FAQ/Create', input);
        return result.data;
    }

    public async updateFaq(input: UpdateFaqDto): Promise<FaqDto> {
        const result = await http.put('api/services/app/FAQ/Update', input);
        return result.data;
    }

    public async getFaq(input: EntityDto): Promise<FaqDto> {
        return {
            arAnswer: "",
            arQuestion: "",
            enAnswer: "",
            enQuestion: "",
            id: 0,
            isActive: false,
            order: 1,
        };
    }

    public async faqDeactivation(input: EntityDto) {
        const result = await http.put('api/services/app/FAQ/DeActivate', input);
        return result.data;
    }
    
    public async faqActivation(input: EntityDto) {
        const result = await http.put('api/services/app/FAQ/Activate', input);
        return result.data;
    }
    
    public async faqDelete(input: EntityDto) {
        let result = await http.delete('api/services/app/FAQ/Delete', { params: { id: input.id } });
        return result.data;
    }

}

export default new FaqService();
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { ContactDto, ContactPagedFilterRequest, CreateContactDto, UpdateContactDto } from './dto/contactDto';

class ContactService {
  public async getAll(input?: ContactPagedFilterRequest): Promise<PagedResultDto<ContactDto>> {
    const result = await http.get('api/services/app/ContactForm/GetAll', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        isActive: input?.isActive,
        keyword: input?.keyword,
      },
    });
    return result.data.result;
  }

  public async getAllLite(input: ContactPagedFilterRequest): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/ContactForm/GetAll', {
        params: {
            skipCount: input?.skipCount,
            maxResultCount: input?.maxResultCount,
            isActive: input?.isActive,
            keyword: input?.keyword,
        },
    });
    return result.data.result;
  }

  public async getContact(input: EntityDto): Promise<ContactDto> {
    const result = await http.get('api/services/app/Index/Get', { params: { id: input.id } });
    return result.data;
  }

  public async createContact(input: CreateContactDto): Promise<ContactDto> {
    const result = await http.post('api/services/app/Index/Create', input);
    return result.data;
  }

  public async updateContact(input: UpdateContactDto): Promise<ContactDto> {
    const result = await http.put('api/services/app/Index/Update', input);
    return result.data;
  }

  public async contactActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Index/Activate', input);
    return result.data;
  }

  public async contactDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Index/DeActivate', input);
    return result.data;
  }

  public async contactDelete(input: EntityDto) {
    const result = await http.delete('api/services/app/Index/Delete', {
      params: input,
    });
    return result.data;
  }
}

export default new ContactService();

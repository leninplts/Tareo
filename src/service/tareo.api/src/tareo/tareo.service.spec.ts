import { Test, TestingModule } from '@nestjs/testing';
import { TareoService } from './tareo.service';

describe('TareoService', () => {
  let service: TareoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TareoService],
    }).compile();

    service = module.get<TareoService>(TareoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

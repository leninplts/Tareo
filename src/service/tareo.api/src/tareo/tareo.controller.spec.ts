import { Test, TestingModule } from '@nestjs/testing';
import { TareoController } from './tareo.controller';
import { TareoService } from './tareo.service';

describe('TareoController', () => {
  let controller: TareoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareoController],
      providers: [TareoService],
    }).compile();

    controller = module.get<TareoController>(TareoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

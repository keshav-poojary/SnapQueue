import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TenantService } from '../service/tenant.service';
import {
  CreateTenantRequestDto,
  GetAllTenantsRequestDto,
  GetTenantByIdResponseDto,
  GetTenantsResponseDto,
} from './dto';
import { ServiceTenantNotFoundException } from '../service/exceptions/ServiceNotFound.exception';
import { ServiceInternalServerException } from '../service/exceptions/ServiceInternalServerError.exception';

@Controller({
  path: 'tenants',
  version: '0',
})
@ApiTags('Tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}
  @Post('/')
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiCreatedResponse({
    description: 'The tenant has been successfully created.',
    type: GetTenantByIdResponseDto,
  })
  async create(@Body() request: CreateTenantRequestDto) {
    try {
      const result: GetTenantByIdResponseDto =
        await this.tenantService.create(request);
      return result;
    } catch (error) {
      if (error instanceof ServiceTenantNotFoundException) {
        throw new NotFoundException(`Tenant was created but not found`);
      }
      if (error instanceof ServiceInternalServerException) {
        throw new InternalServerErrorException(
          `Internal server error while creating tenant`,
        );
      }
      throw error;
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiOkResponse({
    description: 'The tenant details',
    type: GetTenantByIdResponseDto,
  })
  async getById(@Param('id') id: string) {
    try {
      const result: GetTenantByIdResponseDto = await this.tenantService.getById(
        { id },
      );
      return result;
    } catch (error) {
      if (error instanceof ServiceTenantNotFoundException) {
        throw new NotFoundException(`Tenant not found`);
      }
      if (error instanceof ServiceInternalServerException) {
        throw new InternalServerErrorException(
          `Internal server error while fetching tenant`,
        );
      }
      throw error;
    }
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all tenants' })
  @ApiOkResponse({
    description: 'List of tenants',
    type: GetTenantsResponseDto,
  })
  async getAll(@Query() query: GetAllTenantsRequestDto) {
    try {
      const result: GetTenantsResponseDto =
        await this.tenantService.getAll(query);
      return result;
    } catch (error) {
      if (error instanceof ServiceInternalServerException) {
        throw new InternalServerErrorException(
          `Internal server error while fetching tenants`,
        );
      }
      throw error;
    }
  }
}

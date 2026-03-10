import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { AddressResponseDto } from './responses/address.repsonse.dto';

@Controller('addresses')
@UseGuards(JwtSessionGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @Serialize(AddressResponseDto, 'Create address successfully.')
  create(@Req() req, @Body() data: CreateAddressDto) {
    return this.addressService.create(req.user.sub, data);
  }

  @Get()
  @Serialize(AddressResponseDto, 'Find all addess by user successfully.')
  findAll(@Req() req) {
    return this.addressService.findAllByUserId(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id/set-default')
  update(@Req() req, @Param('id') id: string) {
    return this.addressService.setDefaultAddress(req.user.sub, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}

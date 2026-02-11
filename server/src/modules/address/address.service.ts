import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './address.repository';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepo: AddressRepository) {}

  async create(userId: string, data: CreateAddressDto) {
    const isDefaultAddress = await this.addressRepo.findDefaultByUserId(userId);
    if (!isDefaultAddress) {
      return await this.addressRepo.createAddress(
        userId,
        data.addressText,
        data.receiverName,
        data.receiverPhone,
        true,
      );
    }
    return await this.addressRepo.createAddress(
      userId,
      data.addressText,
      data.receiverName,
      data.receiverPhone,
    );
  }

  findAllByUserId(userId: string) {
    return this.addressRepo.findAllAdressByUserId(userId);
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const defaultAddress = await this.addressRepo.findDefaultByUserId(userId);
    const address = await this.findOne(addressId);
    const isMatch = address && address.userId === userId;
    if (isMatch) {
      if (defaultAddress) {
        await this.addressRepo.update(
          { id: defaultAddress.id },
          { isDefault: false },
        );
      }
    }

    return await this.addressRepo.changeUserAddressDefault(address.id);
  }

  async findOne(id: string) {
    const address = await this.addressRepo.findUnique({ id });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
